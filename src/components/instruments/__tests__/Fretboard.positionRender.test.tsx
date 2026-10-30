/**
 * Render sweep (port of the audit's scalepos_render + open_in_position
 * harnesses, W3-01 / W3-06): what the fretboard DRAWS in position view is
 * exactly the generated position — every dot at the right string/fret, the
 * right degree label for its sounding pitch, open-string dots only where the
 * position uses the open string, nothing else lit.
 *
 * Pitches and labels are checked against hand-written string MIDI numbers and
 * a label parser, not against the engine.
 */
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { useFingeringStore } from '../../../state/fingeringStore';
import { getGuitarPosition, POSITION_NUMBERS } from '../../../core/utils/guitarPositions';
import { getTuningById } from '../../../core/constants/guitarTunings';
import type { Note, ScaleType } from '../../../core/types/music';

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
});
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en', changeLanguage: vi.fn() } }),
}));
vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }),
}));
vi.mock('../../../hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
  useIsCompact: () => false,
  useIsTablet: () => false,
}));
afterEach(cleanup);

const OPEN_MIDI: Record<string, number[]> = {
  standard: [40, 45, 50, 55, 59, 64],
  'drop-d': [38, 45, 50, 55, 59, 64],
};
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const ACC: Record<string, number> = { '': 0, '#': 1, '##': 2, b: -1, bb: -2 };
const labelSemis = (label: string) => {
  const m = /^(bb|b|##|#)?(\d+)$/.exec(label)!;
  return (((MAJOR[(Number(m[2]) - 1) % 7] + ACC[m[1] ?? '']) % 12) + 12) % 12;
};
const LETTER: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const pcOf = (n: Note) => (((LETTER[n.natural] + ACC[n.accidental]) % 12) + 12) % 12;
const ROOTS: Note[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'].map((s) => ({
  natural: s[0] as Note['natural'],
  accidental: s.slice(1) as Note['accidental'],
}));

describe('position view draws exactly the generated position (render sweep)', () => {
  it('12 keys x major / natural minor / harmonic minor / minor pentatonic x Open-XII x standard + Drop D', async () => {
    useAppStore.setState({
      selectedKey: ROOTS[0], selectedScale: 'major', selectedChord: null, chordInversion: 0,
      instrument: 'guitar', activeNotes: new Set<number>(), highlightedNotes: [], exerciseInputActive: false,
      guitarScalePosition: 0, guitarTuningId: 'standard', quickSearchOpen: false, themeMode: 'fermata',
    });
    useFingeringStore.setState({ overrides: {}, labelMode: 'degree' });
    const { Fretboard } = await import('../Fretboard');
    const { container } = render(<Fretboard />);

    const problems: string[] = [];
    let renders = 0;
    let dotsChecked = 0;
    for (const tuningId of ['standard', 'drop-d']) {
      for (const scale of ['major', 'natural_minor', 'harmonic_minor', 'pentatonic_minor'] as ScaleType[]) {
        for (const root of ROOTS) {
          for (const n of POSITION_NUMBERS) {
            act(() => {
              useAppStore.setState({ guitarTuningId: tuningId, selectedKey: root, selectedScale: scale, guitarScalePosition: n });
            });
            renders++;
            const where = `${tuningId} ${root.natural}${root.accidental} ${scale} pos ${n}`;
            const drawn = [...container.querySelectorAll<HTMLElement>('[data-dot]')].map((el) => ({
              kind: el.dataset.dot,
              s: Number(el.dataset.dotString),
              f: Number(el.dataset.dotFret),
              label: el.textContent ?? '',
            }));
            const expected = getGuitarPosition(root, scale, n, getTuningById(tuningId)).notes;
            if (drawn.length !== expected.length) problems.push(`${where}: ${drawn.length} dots drawn, ${expected.length} expected`);
            for (const d of drawn) {
              dotsChecked++;
              if (d.kind !== 'position') problems.push(`${where}: non-position dot ${d.kind}`);
              const pc = (OPEN_MIDI[tuningId][d.s] + d.f) % 12;
              if (labelSemis(d.label) !== (((pc - pcOf(root)) % 12) + 12) % 12) problems.push(`${where}: s${6 - d.s} f${d.f} label ${d.label} vs pc ${pc}`);
              if (!expected.some((x) => x.stringIndex === d.s && x.fret === d.f)) problems.push(`${where}: unexpected dot s${6 - d.s} f${d.f}`);
              if (d.f === 0 && n !== 0) problems.push(`${where}: open-string dot outside Open position`);
            }
            for (const x of expected) {
              if (!drawn.some((d) => d.s === x.stringIndex && d.f === x.fret)) problems.push(`${where}: missing s${6 - x.stringIndex} f${x.fret}`);
            }
          }
        }
      }
    }
    expect(problems.slice(0, 10)).toEqual([]);
    expect(renders).toBe(2 * 4 * 12 * 13);
    expect(dotsChecked).toBeGreaterThan(renders * 10);
  }, 120_000);
});
