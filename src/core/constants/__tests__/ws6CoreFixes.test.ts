/**
 * WS6 core-engine fixes (CORE-ESCALATION B1, B7 + audit:engine B# spelling).
 *
 * B1 — INTERVAL_LABELS[8] must be the generic interval name (Minor 6th), with
 *      chord displays preserving the chord-context spelling (#5) for the
 *      augmented family via quality-aware overrides.
 * B7 — dominant7alt must carry all four canonical alterations (b9 #9 #11 b13).
 * B# — scale/chord spelling must never emit a wrong pitch when correct
 *      spelling would need a triple accidental (respell enharmonically).
 */
import { describe, it, expect } from 'vitest';
import {
  INTERVAL_LABELS,
  INTERVAL_SHORT_LABELS,
  CHORD_FORMULAS,
  buildChord,
  getChordIntervalLabels,
  getChordShortIntervalLabels,
} from '../chords';
import { buildScale, SCALE_FORMULAS } from '../scales';
import { getPitchClass } from '../notes';
import type { Note, ChordQuality, ScaleType } from '../../types/music';

const note = (natural: Note['natural'], accidental: Note['accidental'] = ''): Note => ({
  natural,
  accidental,
});

describe('B1 — interval label for 8 semitones', () => {
  it('labels 8 semitones as Minor 6th in the generic interval table', () => {
    expect(INTERVAL_LABELS[8]).toBe('Minor 6th');
  });

  it('labels 8 semitones as b6 in the short table (scale-degree context)', () => {
    expect(INTERVAL_SHORT_LABELS[8]).toBe('b6');
  });

  it.each(['augmented', 'augmented7', 'dominant7sharp5', 'augmented_major7', 'dominant7sharp5flat9', 'dominant7sharp5sharp9'] as ChordQuality[])(
    'still shows #5 (not b6) in the chord formula display for %s',
    (quality) => {
      const formula = CHORD_FORMULAS[quality];
      const idx = formula.indexOf(8);
      expect(idx).toBeGreaterThan(-1);
      expect(getChordShortIntervalLabels(quality)[idx]).toBe('#5');
      expect(getChordIntervalLabels(quality)[idx]).toBe('Augmented 5th');
    },
  );
});

describe('B7 — dominant7alt carries all four alterations', () => {
  it('has the formula R 3 b7 b9 #9 #11 b13', () => {
    expect(CHORD_FORMULAS.dominant7alt).toEqual([0, 4, 10, 13, 15, 18, 20]);
  });

  it('spells C7alt as C E Bb Db D# F# Ab', () => {
    const chord = buildChord(note('C'), 'dominant7alt');
    const spelled = chord.notes.map((n) => `${n.natural}${n.accidental}`);
    expect(spelled).toEqual(['C', 'E', 'Bb', 'Db', 'D#', 'F#', 'Ab']);
  });

  it('labels the alt formula R 3 b7 b9 #9 #11 b13', () => {
    expect(getChordShortIntervalLabels('dominant7alt')).toEqual([
      'R', '3', 'b7', 'b9', '#9', '#11', 'b13',
    ]);
  });
});

describe('B# spelling — pitch correctness beats letter purity', () => {
  it('B# lydian augmented degree 5 lands on pitch class 8', () => {
    const scale = buildScale(note('B', '#'), 'lydian_augmented');
    expect(getPitchClass(scale.notes[4])).toBe(8);
  });

  it('B# hungarian major degree 2 lands on pitch class 3', () => {
    const scale = buildScale(note('B', '#'), 'hungarian_major');
    expect(getPitchClass(scale.notes[1])).toBe(3);
  });

  it('every scale type on every root spells every degree at the formula pitch class', () => {
    const roots: Note[] = [];
    for (const natural of ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const) {
      for (const accidental of ['', '#', 'b'] as const) {
        roots.push(note(natural, accidental));
      }
    }
    for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
      const formula = SCALE_FORMULAS[type];
      for (const root of roots) {
        const scale = buildScale(root, type);
        const rootPc = getPitchClass(root);
        scale.notes.forEach((n, i) => {
          expect(
            getPitchClass(n),
            `${n.natural}${n.accidental} at ${root.natural}${root.accidental} ${type}[${i}]`,
          ).toBe((rootPc + formula[i]) % 12);
        });
      }
    }
  });

  it('every chord quality on every root spells every tone at the formula pitch class', () => {
    const roots: Note[] = [];
    for (const natural of ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const) {
      for (const accidental of ['', '#', 'b'] as const) {
        roots.push(note(natural, accidental));
      }
    }
    for (const quality of Object.keys(CHORD_FORMULAS) as ChordQuality[]) {
      const formula = CHORD_FORMULAS[quality];
      for (const root of roots) {
        const chord = buildChord(root, quality);
        const rootPc = getPitchClass(root);
        chord.notes.forEach((n, i) => {
          expect(
            getPitchClass(n),
            `${n.natural}${n.accidental} at ${root.natural}${root.accidental} ${quality}[${i}]`,
          ).toBe((rootPc + formula[i]) % 12);
        });
      }
    }
  });
});
