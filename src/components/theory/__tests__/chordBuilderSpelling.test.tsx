/**
 * Audit W1-07 (A-14, C-57) — the Chord Builder spells chord tones by the
 * CHORD, not by the key, and names each strip block's interval from the note
 * it shows. Pre-fix, C minor showed C–D#–G in C major, a chosen D♭ root showed
 * as C#, and C augmented's G# block was labelled "m6".
 *
 * Port of the auditors' builder harness, rendered: 4 keys x 12 roots x 9
 * qualities through the real panel, against the independent oracle.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, act, cleanup, screen } from '@testing-library/react';
import type { Note } from '../../../core/types/music';
import { ChordBuilderPanel } from '../ChordBuilderPanel';
import { useAppStore } from '../../../state/store';
import { spellDegree, pcOf, mod12 } from '../../../core/utils/__tests__/theoryOracle';

vi.mock('../../../core/services/audio.ts', () => ({ resumeAudio: vi.fn(() => Promise.resolve()), playChordVoiced: vi.fn() }));
vi.mock('../../../services/synthConfig.ts', () => ({ getSynthConfig: vi.fn(() => ({})) }));

afterEach(cleanup);

const toNote = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const QUALITIES: Record<string, string[]> = {
  major: ['1', '3', '5'], minor: ['1', 'b3', '5'], diminished: ['1', 'b3', 'b5'], augmented: ['1', '3', '#5'],
  dominant7: ['1', '3', '5', 'b7'], minor7: ['1', 'b3', '5', 'b7'], major7: ['1', '3', '5', '7'],
  half_diminished7: ['1', 'b3', 'b5', 'b7'], diminished7: ['1', 'b3', 'b5', 'bb7'],
};
const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MAJ = [0, 2, 4, 5, 7, 9, 11];
/** Oracle interval name (m3 style) from a degree label. */
function intervalName(degree: string): string {
  const m = /^(bb|b|#)?(\d)$/.exec(degree)!;
  const n = Number(m[2]);
  const alt = m[1] === 'b' ? -1 : m[1] === 'bb' ? -2 : m[1] === '#' ? 1 : 0;
  if (n === 1 && alt === 0) return 'R';
  const perfect = [1, 4, 5].includes(n);
  const q = perfect ? ({ 0: 'P', 1: 'A', [-1]: 'd' } as Record<number, string>)[alt] : ({ 0: 'M', [-1]: 'm', 1: 'A', [-2]: 'd' } as Record<number, string>)[alt];
  return `${q}${n}`;
}
const semis = (degree: string) => {
  const m = /^(bb|b|#)?(\d)$/.exec(degree)!;
  return MAJ[Number(m[2]) - 1] + (m[1] === 'b' ? -1 : m[1] === 'bb' ? -2 : m[1] === '#' ? 1 : 0);
};

function strip(): HTMLElement[] {
  return [...document.querySelector('[aria-label^="Chromatic strip"]')!.querySelectorAll('button')] as HTMLElement[];
}

describe('W1-07 — Chord Builder spells by the chord', () => {
  it('Notes row, interval labels and detected root match the oracle (4 keys x 12 roots x 9 qualities)', async () => {
    const bad: string[] = [];
    for (const key of ['C', 'F', 'A', 'Eb']) {
      for (const root of ROOTS) {
        for (const [q, degrees] of Object.entries(QUALITIES)) {
          const want = degrees.map((d) => spellDegree(root, d));
          if (want.some((n) => n === null)) continue;
          useAppStore.setState({ selectedKey: toNote(key), selectedScale: 'major', selectedChord: null, selectedDegree: null, chordInversion: 0 });
          const { container } = render(<ChordBuilderPanel />);
          await act(async () => { fireEvent.change(container.querySelector('select')!, { target: { value: root } }); });
          for (const d of degrees.slice(1)) {
            await act(async () => { fireEvent.click(strip()[semis(d)]); });
          }
          const notesRow = screen.getByText('Notes').nextElementSibling!.textContent!;
          const tag = `key ${key}, ${root} ${q}`;
          if (notesRow !== want.join(' – ')) bad.push(`${tag}: Notes "${notesRow}" want "${want.join(' – ')}"`);
          const intervals = screen.getByText('Intervals').nextElementSibling!.textContent!;
          const wantIntervals = degrees.map(intervalName).join(', ');
          if (intervals !== wantIntervals) bad.push(`${tag}: Intervals "${intervals}" want "${wantIntervals}"`);
          // each active block shows the chord's spelling and the interval it forms with the root
          degrees.slice(1).forEach((d) => {
            const label = strip()[semis(d)].getAttribute('aria-label')!;
            const wantLabel = `${intervalName(d)}, ${spellDegree(root, d)}`;
            if (!label.startsWith(wantLabel)) bad.push(`${tag}: block "${label}" want "${wantLabel}"`);
          });
          const chord = useAppStore.getState().selectedChord;
          if (!chord || `${chord.root.natural}${chord.root.accidental}` !== root || chord.quality !== q) {
            bad.push(`${tag}: detected ${chord ? `${chord.root.natural}${chord.root.accidental} ${chord.quality}` : 'nothing'}`);
          }
          cleanup();
        }
      }
    }
    expect(bad).toEqual([]);
  }, 120_000);

  it('C minor in C major shows C – Eb – G (not D#)', async () => {
    useAppStore.setState({ selectedKey: toNote('C'), selectedScale: 'major', selectedChord: null });
    render(<ChordBuilderPanel />);
    await act(async () => { fireEvent.click(strip()[3]); });
    await act(async () => { fireEvent.click(strip()[7]); });
    expect(screen.getByText('Notes').nextElementSibling!.textContent).toBe('C – Eb – G');
    expect(pcOf('Eb')).toBe(mod12(3));
  });
});

describe('review item 1 — the root dropdown always shows the strip root', () => {
  it('for every root the key picker can select (and odd ones like Cb, B#)', () => {
    for (const key of ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'Cb', 'B#']) {
      useAppStore.setState({ selectedKey: toNote(key), selectedScale: 'major', selectedChord: null });
      const { container } = render(<ChordBuilderPanel />);
      const select = container.querySelector('select') as HTMLSelectElement;
      const stripLabel = container.querySelector('[aria-label^="Chromatic strip"]')!.getAttribute('aria-label');
      expect(select.value, key).toBe(key);
      expect(stripLabel, key).toBe(`Chromatic strip from ${key}`);
      cleanup();
    }
  });
});
