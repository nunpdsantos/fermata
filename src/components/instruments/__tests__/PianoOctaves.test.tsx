/**
 * Audit W2-07 (A-27) — the piano's octave buttons never take the scale off
 * the keyboard. Pre-fix, "C8" with G major lit 0 of 8 keys and "C0" with C
 * major 3 of 8. Only octaves where the scale (and the selected chord) stay on
 * A0–C8 are offered (review item 6: unreachable tabs are hidden, not shown
 * disabled), and a stored octave that no longer fits moves to the nearest one.
 */
import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import type { Note, ScaleType } from '../../../core/types/music';
import { useAppStore } from '../../../state/store';

vi.mock('../../../hooks/useAudio.ts', () => ({
  useAudio: () => ({ noteOn: vi.fn(async () => {}), noteOff: vi.fn() }),
}));

import { Piano } from '../Piano';

beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      value: (q: string) => ({ matches: false, media: q, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } }),
    });
  }
  Element.prototype.scrollIntoView ??= () => {};
  (Element.prototype as unknown as { scrollTo: () => void }).scrollTo ??= () => {};
});

afterEach(cleanup);

const toNote = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const select = (root: string, type: ScaleType, baseOctave = 4) =>
  useAppStore.setState({ selectedKey: toNote(root), selectedScale: type, selectedChord: null, exerciseInputActive: false, baseOctave, scaleOctaves: 1 });

const octaveTabs = () => screen.getAllByRole('tab').map((t) => t.textContent);

describe('W2-07 — octave buttons stay on the keyboard', () => {
  it('G major offers C1–C6 (no C0, no C8); A major also offers C0', () => {
    select('G', 'major');
    render(<Piano />);
    expect(octaveTabs()).toEqual(['C1', 'C2', 'C3', 'C4', 'C5', 'C6']);
    cleanup();
    select('A', 'major');
    render(<Piano />);
    expect(octaveTabs()).toEqual(['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6']);
  });

  it('C8 is never offered, and every offered octave keeps the scale on the keys', () => {
    for (const root of ['C', 'G', 'B', 'A', 'F#', 'Bb', 'Db']) {
      select(root, 'major');
      render(<Piano />);
      const offered = octaveTabs();
      expect(offered, root).not.toContain('C8');
      expect(offered.length, root).toBeGreaterThanOrEqual(6);
      cleanup();
    }
  });

  it('a stored octave that does not fit is moved to the nearest that does', () => {
    select('B', 'major', 8);
    render(<Piano />);
    expect(useAppStore.getState().baseOctave).toBe(6);
  });
});
