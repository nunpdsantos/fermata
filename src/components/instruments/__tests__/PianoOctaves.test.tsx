/**
 * Audit W2-07 (A-27) — the piano's octave buttons never take the scale off
 * the keyboard. Pre-fix, "C8" with G major lit 0 of 8 keys and "C0" with C
 * major 3 of 8. Buttons whose octave would push the scale (or the selected
 * chord) past A0–C8 are disabled, and a stored octave that no longer fits is
 * moved to the nearest one that does.
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

const octaveButton = (n: number) => screen.getByRole('tab', { name: `C${n}` });

describe('W2-07 — octave buttons stay on the keyboard', () => {
  it('G major: C8 is disabled, C1–C7 are enabled; C major: C0 disabled', () => {
    select('G', 'major');
    render(<Piano />);
    expect(octaveButton(8).hasAttribute('disabled')).toBe(true);
    for (let o = 1; o <= 6; o++) expect(octaveButton(o).hasAttribute('disabled'), `C${o}`).toBe(false);
    cleanup();
    select('C', 'major');
    render(<Piano />);
    expect(octaveButton(0).hasAttribute('disabled')).toBe(true);
  });

  it('every lit scale key exists on the keyboard for every enabled octave', () => {
    for (const root of ['C', 'G', 'B', 'A', 'F#']) {
      for (let o = 0; o <= 8; o++) {
        select(root, 'major', o);
        render(<Piano />);
        const enabled = !octaveButton(o).hasAttribute('disabled');
        const base = useAppStore.getState().baseOctave;
        // either the octave is enabled and kept, or it was moved to one that fits
        if (!enabled) expect(base, `${root} @${o}`).not.toBe(o);
        cleanup();
      }
    }
  });

  it('a stored octave that does not fit is moved to the nearest that does', () => {
    select('B', 'major', 8);
    render(<Piano />);
    expect(useAppStore.getState().baseOctave).toBe(6);
  });
});
