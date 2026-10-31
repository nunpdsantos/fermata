/**
 * Audit W1-05 / W1-06 / W1-11 / W1-15 / W1-17 / W3-03 — the degree displays
 * read degree, label and colour from the spelled letter.
 *
 *  - useKeyContext reports EVERY scale note (chromatic has 12, bebop 8) and
 *    colours it by function (W3-03, W1-06). The fretboard treats "no colour"
 *    as "not in the scale", so this contract is what lights its notes.
 *  - ScaleDegreeBar labels agree with the note printed under them, in one
 *    notation (b3 style), coloured by function (W1-05, W1-06, W1-11).
 *  - Scale Comparison labels each row from its own spelling (W1-15).
 *  - Piano screen-reader labels give B#/Cb the letter octave (W1-17).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, renderHook } from '@testing-library/react';
import type { Note, ScaleType } from '../../../core/types/music';
import { useAppStore } from '../../../state/store';
import { useKeyContext } from '../../../hooks/useKeyContext';
import { ScaleDegreeBar } from '../ScaleDegreeBar';
import { ScaleComparison } from '../ScaleComparison';
import { PianoKeyComponent } from '../../instruments/PianoKey';
import { DEGREE_COLORS } from '../../../design/tokens/colors';
import { buildScale, SCALE_FORMULAS } from '../../../core/constants/scales';
import { SELECTABLE_ROOTS, letterDegree, spellDegree, pcOf, mod12 } from '../../../core/utils/__tests__/theoryOracle';

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const make = (tag: string) => (props: Record<string, unknown>) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
    return React.createElement(tag, clean);
  };
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => make(prop) });
  return { motion: proxy, m: proxy, AnimatePresence: (p: { children: React.ReactNode }) => p.children, LazyMotion: (p: { children: React.ReactNode }) => p.children, domAnimation: {} };
});

afterEach(cleanup);

const toNote = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const str = (n: Note) => `${n.natural}${n.accidental}`;
const TYPES = Object.keys(SCALE_FORMULAS) as ScaleType[];
const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
};
const select = (root: string, type: ScaleType, extra: Record<string, unknown> = {}) =>
  useAppStore.setState({ selectedKey: toNote(root), selectedScale: type, selectedChord: null, selectedDegree: null, exerciseInputActive: false, comparisonScale: null, ...extra });

describe('W3-03 / W1-06 — useKeyContext reports and colours every scale note by function', () => {
  it('for every scale type x selectable root', () => {
    const bad: string[] = [];
    for (const type of TYPES) {
      for (const root of SELECTABLE_ROOTS) {
        select(root, type);
        const { result } = renderHook(() => useKeyContext());
        const ctx = result.current;
        const notes = buildScale(toNote(root), type).notes;
        const scalePcs = new Set(notes.map((n) => pcOf(str(n))));
        for (const n of notes) {
          const want = letterDegree(root, str(n));
          if (ctx.getNoteDegree(n) !== want) bad.push(`${root} ${type}: degree of ${str(n)} = ${ctx.getNoteDegree(n)} (want ${want})`);
          if (ctx.getNoteColor(n) !== DEGREE_COLORS[want as keyof typeof DEGREE_COLORS]) bad.push(`${root} ${type}: colour of ${str(n)}`);
        }
        for (let pc = 0; pc < 12; pc++) {
          if (scalePcs.has(pc)) continue;
          const probe = toNote(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][pc]);
          if (ctx.getNoteColor(probe) !== undefined) bad.push(`${root} ${type}: pc ${pc} coloured but not in scale`);
        }
        cleanup();
      }
    }
    expect(bad).toEqual([]);
  }, 60_000);

  it('chromatic reports all 12 notes; bebop dorian all 8', () => {
    select('C', 'chromatic');
    const chrom = renderHook(() => useKeyContext()).result.current;
    expect(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].filter((n) => chrom.getNoteColor(toNote(n)) !== undefined)).toHaveLength(12);
    select('C', 'bebop_dorian');
    const bd = renderHook(() => useKeyContext()).result.current;
    expect(['C', 'D', 'Eb', 'E', 'F', 'G', 'A', 'Bb'].filter((n) => bd.getNoteColor(toNote(n)) !== undefined)).toHaveLength(8);
  });
});

describe('W1-05 / W1-06 / W1-11 — Scale Degrees bar', () => {
  it('label names the note under it, b3 style, coloured by function — every type x root', () => {
    const bad: string[] = [];
    for (const type of TYPES) {
      for (const root of SELECTABLE_ROOTS) {
        select(root, type);
        const { container } = render(<ScaleDegreeBar />);
        const buttons = [...container.querySelectorAll('[aria-label^="Degree "]')];
        expect(buttons.length, `${root} ${type}`).toBe(SCALE_FORMULAS[type].length);
        for (const b of buttons) {
          const m = /^Degree (\d+), ([^,]+), (.+)$/.exec(b.getAttribute('aria-label')!)!;
          const [label, note] = [m[2], m[3]];
          const lm = /^(bb|b|##|#)?(\d+|R)$/.exec(label);
          if (!lm) { bad.push(`${root} ${type}: "${label}" not b3 style`); continue; }
          const num = lm[2] === 'R' ? 1 : Number(lm[2]);
          if (spellDegree(root, lm[2] === 'R' ? '1' : label) !== note) bad.push(`${root} ${type}: "${label}" over ${note}`);
          const labelSpan = b.querySelectorAll('span')[1] as HTMLElement;
          if (labelSpan.style.color !== hexToRgb(DEGREE_COLORS[num as keyof typeof DEGREE_COLORS])) bad.push(`${root} ${type}: colour of ${label}`);
        }
        cleanup();
      }
    }
    expect(bad).toEqual([]);
  }, 60_000);

  it('A blues reads R b3 4 b5 5 b7 over A C D Eb E G', () => {
    select('A', 'blues');
    const { container } = render(<ScaleDegreeBar />);
    const pairs = [...container.querySelectorAll('[aria-label^="Degree "]')].map((b) => b.getAttribute('aria-label')!.split(', ').slice(1).join('/'));
    expect(pairs).toEqual(['R/A', 'b3/C', '4/D', 'b5/Eb', '5/E', 'b7/G']);
  });
});

describe('W1-15 — Scale Comparison labels each row from its own spelling', () => {
  it('every in-scale cell label names its note: every type against six contrasting types, at C, F# and Eb', () => {
    const bad: string[] = [];
    const AGAINST: ScaleType[] = ['major', 'lydian', 'altered', 'blues', 'whole_tone', 'chromatic'];
    for (const root of ['C', 'F#', 'Eb']) {
      for (const a of TYPES) {
        for (const b of AGAINST) {
          if (a === b) continue;
          select(root, a, { comparisonScale: b });
          const { container } = render(<ScaleComparison />);
          const grid = container.querySelector('[role="group"]')!;
          const cells = [...grid.children].filter((c) => c.querySelectorAll('span').length === 2);
          for (const cell of cells) {
            const [noteEl, labelEl] = [...cell.querySelectorAll('span')];
            const note = noteEl.textContent ?? '';
            const label = labelEl.textContent ?? '';
            if (!note) continue;
            const lm = /^(bb|b|##|#)?(\d+|R)$/.exec(label);
            if (!lm || spellDegree(root, lm[2] === 'R' ? '1' : label) !== note) bad.push(`${root} ${a} vs ${b}: "${label}" over ${note}`);
          }
          cleanup();
        }
      }
    }
    expect(bad).toEqual([]);
  }, 60_000);
});

describe('W1-17 — piano screen-reader octave labels follow the letter', () => {
  const key = (natural: string, octave: number, isBlack = false) => ({
    note: { natural, accidental: '' } as Note,
    octave,
    isBlack,
    midiNumber: 12 + 12 * octave + mod12(pcOf(natural)),
    whiteKeyIndex: 0,
  });
  const props = { isHighlighted: false, isActive: false, isChordTone: false, isVoicingNote: false, isDimmed: false, onNoteOn: () => {}, onNoteOff: () => {}, showLabel: true };

  it('the C5 key spelled B# is announced B#4; the B3 key spelled Cb is announced Cb4', () => {
    const { container, unmount } = render(<PianoKeyComponent keyData={key('C', 5)} displayNote={toNote('B#')} {...props} />);
    expect(container.querySelector('[role="button"]')!.getAttribute('aria-label')).toBe('B#4');
    unmount();
    const r2 = render(<PianoKeyComponent keyData={key('B', 3)} displayNote={toNote('Cb')} {...props} />);
    expect(r2.container.querySelector('[role="button"]')!.getAttribute('aria-label')).toBe('Cb4');
  });

  it('ordinary keys keep their octave (C4, F#4)', () => {
    const { container } = render(<PianoKeyComponent keyData={key('C', 4)} {...props} />);
    expect(container.querySelector('[role="button"]')!.getAttribute('aria-label')).toBe('C4');
  });
});
