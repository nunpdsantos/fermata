import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { StaffNotationSkeleton } from '../StaffNotationSkeleton';
import { StaffNotation } from '../StaffNotation';
import { staffLayout, staffPlan } from '../../../utils/notationHelpers';
import { exploreChordVoicing } from '../../explore/exploreRegister';
import { useAppStore } from '../../../state/store';
import type { PitchedNote } from '../../../core/types/music';

const pitch = (natural: string, octave: number) => ({ natural, accidental: '', octave }) as PitchedNote;

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
// Review of the fix (20 November 2026): the drawn container carries the
// fitted height too, so each case first proves that what it measures is the
// skeleton — its pulse and its five lines, which the drawn container has
// neither of — and then its height. VexFlow never loads here (mocked above).
describe('StaffNotation while VexFlow loads', () => {
  afterEach(() => {
    cleanup();
    useAppStore.setState({ instrument: 'piano' });
  });

  const skeletonHeight = (container: HTMLElement) => {
    const shown = container.firstChild as HTMLElement;
    expect(shown.className, 'the skeleton is what is shown').toContain('animate-pulse');
    expect(shown.querySelectorAll('svg line'), "the skeleton's five lines").toHaveLength(5);
    expect(container.querySelector('g.vf-stavenote'), 'nothing drawn').toBeNull();
    return shown.style.height;
  };
  const fittedHeight = (notes: PitchedNote[], instrument: 'piano' | 'guitar', options: { duration: string; chord?: boolean }) => {
    const plan = staffPlan(notes, undefined, instrument, true);
    return staffLayout(plan.written, plan.clef, 80, { annotation: plan.annotation, ...options }).height;
  };
  const pianoScale = (['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const).map((n) => pitch(n, 4)).concat([pitch('C', 5)]);

  it("the Explore strip's C4–C5 (a ledger line below): the skeleton is as tall as the drawing will be, not the 80 px asked for", () => {
    const fitted = fittedHeight(pianoScale, 'piano', { duration: 'w' });
    expect(fitted).toBe(100); // the ledger line takes 20 px: the case that moved
    const { container } = render(<StaffNotation notes={pianoScale} height={80} duration="w" followInstrument />);
    expect(skeletonHeight(container)).toBe(`${fitted}px`);
  });

  it("the guitar's chord C as Explore's chord staff draws it (written an octave up, 8vb): taller still, and the skeleton is too", () => {
    useAppStore.setState({ instrument: 'guitar' });
    const notes = exploreChordVoicing('guitar', 4, { root: { natural: 'C', accidental: '' }, notes: (['C', 'E', 'G'] as const).map((n) => ({ natural: n, accidental: '' })) });
    const fitted = fittedHeight(notes, 'guitar', { duration: 'w', chord: true });
    expect(fitted).toBeGreaterThan(fittedHeight(pianoScale, 'piano', { duration: 'w' }));
    const { container } = render(<StaffNotation notes={notes} height={80} width={132} duration="w" chord followInstrument />);
    expect(skeletonHeight(container)).toBe(`${fitted}px`);
  });
});
