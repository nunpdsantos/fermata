import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { StaffNotationSkeleton } from '../StaffNotationSkeleton';

// Mock VexFlow since it requires full DOM/SVG rendering
vi.mock('../../../utils/vexflowLoader', () => ({
  loadVexFlow: vi.fn(() => new Promise(() => {})), // never resolves in test
}));

describe('StaffNotationSkeleton', () => {
  it('renders with default height', () => {
    const { container } = render(<StaffNotationSkeleton />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.height).toBe('150px');
  });

  it('renders with custom height', () => {
    const { container } = render(<StaffNotationSkeleton height={100} />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.height).toBe('100px');
  });

  it('renders 5 staff lines', () => {
    const { container } = render(<StaffNotationSkeleton />);
    const lines = container.querySelectorAll('line');
    expect(lines.length).toBe(5);
  });

  it('has pulse animation class', () => {
    const { container } = render(<StaffNotationSkeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('animate-pulse');
  });
});

// Review of the second round (20 November 2026): while VexFlow loads, the
// staff holds the height its drawing will take, not the one asked for — the
// Explore strip's C4–C5 (a ledger line under the staff) is drawn 100 px tall
// from a request of 80, and an 80 px skeleton moved everything under the
// staff 20 px down when the drawing arrived (e2e/explore-tools-audit.spec.ts Q4).
describe('StaffNotation while VexFlow loads', () => {
  it('the skeleton is as tall as the drawing will be (its fitted height), not the requested height', async () => {
    const { StaffNotation } = await import('../StaffNotation');
    const { staffLayout, staffPlan } = await import('../../../utils/notationHelpers');
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((n) => ({ natural: n, accidental: '', octave: 4 }))
      .concat([{ natural: 'C', accidental: '', octave: 5 }]) as Parameters<typeof staffPlan>[0];
    const plan = staffPlan(notes, undefined, 'piano', true);
    const fitted = staffLayout(plan.written, plan.clef, 80, { annotation: plan.annotation, duration: 'w' }).height;
    expect(fitted).toBeGreaterThan(80); // the ledger line takes room: the case that moved
    const { container } = render(<StaffNotation notes={[...notes]} height={80} duration="w" followInstrument />);
    expect((container.firstChild as HTMLElement).style.height).toBe(`${fitted}px`);
  });
});
