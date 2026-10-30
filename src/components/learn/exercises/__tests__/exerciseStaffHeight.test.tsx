/**
 * Design review — the exercise staff was fixed at 100 px, so ledger-line notes
 * were clipped (middle C's notehead sat on the bottom edge; notes two ledger
 * lines above the staff ran off the top). The staff now grows to fit its notes.
 * Real VexFlow in jsdom; the notehead glyph's y is its centre.
 */
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import type { ExerciseDefinition } from '../../../../core/types/exercise';
import { ExercisePrompt } from '../ExercisePrompt';
import { useAppStore } from '../../../../state/store';

beforeAll(() => {
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = class { observe() {} disconnect() {} };
  // jsdom has no layout: give the staff container a real width.
  HTMLElement.prototype.getBoundingClientRect = function () {
    return { width: 600, height: 0, top: 0, left: 0, right: 600, bottom: 0, x: 0, y: 0, toJSON() {} } as DOMRect;
  };
});

afterEach(() => {
  cleanup();
  useAppStore.setState({ instrument: 'piano' });
});

const noteId = (note: string, octave: number): ExerciseDefinition => ({
  id: `t-${note}${octave}`, type: 'note_id', prompt: 'Identify this note.', points: 1,
  config: { type: 'note_id', note, accidental: '', octave },
} as ExerciseDefinition);

async function measure(ex: ExerciseDefinition) {
  const { container } = render(<ExercisePrompt exercise={ex} />);
  await waitFor(() => expect(container.querySelector('svg g.vf-stavenote')).not.toBeNull(), { timeout: 15000 });
  const svg = container.querySelector('svg')!;
  const svgHeight = Number(svg.getAttribute('height'));
  const head = container.querySelector('g.vf-notehead text')!;
  const y = Number(head.getAttribute('y'));
  const box = svg.parentElement as HTMLElement;
  return { svgHeight, y, boxHeight: parseFloat(box.style.height) };
}

describe('exercise staff fits its notes', () => {
  it('middle C (one ledger line below the treble staff) is fully inside', async () => {
    const r = await measure(noteId('C', 4));
    expect(r.y + 6).toBeLessThanOrEqual(r.svgHeight);
    expect(r.boxHeight).toBe(r.svgHeight);
  });

  it('B6 (above the treble staff) is fully inside', async () => {
    const r = await measure(noteId('B', 6));
    expect(r.y - 6).toBeGreaterThanOrEqual(0);
    expect(r.y + 6).toBeLessThanOrEqual(r.svgHeight);
  });

  it('A3 on the guitar (treble-8vb, two ledger lines below) is fully inside', async () => {
    useAppStore.setState({ instrument: 'guitar' });
    const r = await measure(noteId('A', 3));
    expect(r.y + 6).toBeLessThanOrEqual(r.svgHeight);
  });

  it('B6 on the guitar (written B7, far above the staff) still fits', async () => {
    useAppStore.setState({ instrument: 'guitar' });
    const r = await measure(noteId('B', 6));
    expect(r.y - 6).toBeGreaterThanOrEqual(0);
    expect(r.y + 6).toBeLessThanOrEqual(r.svgHeight);
  });

  it('review item 4: the clef follows the WRITTEN octave (B♯ sounding as C4 is written B♯3 → bass clef)', async () => {
    const ex = { ...noteId('B', 4), config: { type: 'note_id', note: 'B', accidental: '#', octave: 4 } } as ExerciseDefinition;
    const { container } = render(<ExercisePrompt exercise={ex} />);
    await waitFor(() => expect(container.querySelector('svg g.vf-stavenote')).not.toBeNull(), { timeout: 15000 });
    const clef = container.querySelector('g.vf-clef text')!.textContent!.codePointAt(0);
    expect(clef).toBe(0xe062); // bass clef glyph
  });

  it('a note on the staff keeps the compact 100 px height', async () => {
    const r = await measure(noteId('G', 4));
    expect(r.svgHeight).toBe(100);
  });
});
