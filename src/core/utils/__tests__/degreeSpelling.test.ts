/**
 * Audit W1-05 / W1-06 / W1-11 — one letter-based spelling engine.
 *
 * Every scale type x every selectable root is checked against the independent
 * oracle in ./theoryOracle (step patterns + textbook degree formulas; imports
 * nothing from the app). buildScale is the app's public entry point, so these
 * tests fail on the pre-W1 engine (A blues spelled D#, C half-whole spelled
 * A-double-flat, F# chromatic spelled F##, bebop major spelled Ab).
 */
import { describe, it, expect } from 'vitest';
import type { Note, ScaleType } from '../../types/music';
import { buildScale, SCALE_FORMULAS } from '../../constants/scales';
import {
  SCALE_DEGREE_FORMULAS,
  parseDegree,
  degreeSemitones,
  degreeOf,
  formatDegree,
  scaleDegreeLabels,
  spellIntervalAboveStrict,
  spellIntervalBelow,
  intervalBetween,
  canonicalIntervalNumber,
  writtenOctave,
  staffAccidentals,
  preferredRootSpelling,
  enharmonicRootAlternative,
  keySignatureForScale,
} from '../degreeSpelling';
import {
  ORACLE_SCALES,
  ORACLE_SYMMETRIC,
  SELECTABLE_ROOTS,
  spellDegree as oracleSpell,
  pcOf,
  letterDegree,
  accMarks,
  mod12,
  midiOf,
  majorKeySignature,
  PARENT_RULE,
} from './theoryOracle';

const toNote = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const str = (n: Note) => `${n.natural}${n.accidental}`;
const ALL_TYPES = Object.keys(SCALE_FORMULAS) as ScaleType[];

describe('degree formulas agree with the semitone formulas (consistency)', () => {
  it.each(ALL_TYPES)('%s', (type) => {
    const semis = SCALE_DEGREE_FORMULAS[type].map((d) => degreeSemitones(parseDegree(d)));
    expect(semis).toEqual(SCALE_FORMULAS[type]);
  });
});

describe('W1-05 — buildScale spells every scale type on every selectable root like the oracle', () => {
  const fixed = Object.keys(ORACLE_SCALES);
  it('covers every scale type (fixed formula or symmetric convention)', () => {
    expect([...fixed, ...Object.keys(ORACLE_SYMMETRIC)].sort()).toEqual([...ALL_TYPES].sort());
  });

  for (const type of fixed) {
    it(`${type}: exact oracle spelling for all ${SELECTABLE_ROOTS.length} roots`, () => {
      const or = ORACLE_SCALES[type];
      for (const root of SELECTABLE_ROOTS) {
        const got = buildScale(toNote(root), type as ScaleType).notes.map(str);
        const want = or.degrees.map((d) => oracleSpell(root, d) ?? '?');
        // A triple accidental (never needed by these roots) would show as '?'.
        expect(want).not.toContain('?');
        expect(got, `${root} ${type}`).toEqual(want);
      }
    });
  }

  // Oracle brute force: the fewest double accidentals any combination of the
  // conventional names can achieve on this root (independent of the app's search).
  const minDoubles = (root: string, options: string[][]): number => {
    let best = Infinity;
    const walk = (i: number, doubles: number) => {
      if (doubles >= best) return;
      if (i === options.length) { best = doubles; return; }
      for (const d of options[i]) {
        const n = oracleSpell(root, d);
        if (n !== null) walk(i + 1, doubles + (accMarks(n) >= 2 ? 1 : 0));
      }
    };
    walk(0, 0);
    return best;
  };

  for (const [type, sym] of Object.entries(ORACLE_SYMMETRIC)) {
    it(`${type}: right pitches, a conventional name per note, double accidentals only when unavoidable`, () => {
      for (const root of SELECTABLE_ROOTS) {
        const got = buildScale(toNote(root), type as ScaleType).notes.map(str);
        expect(got.map(pcOf), `${root} ${type} pitches`).toEqual(sym.semis.map((s) => mod12(pcOf(root) + s)));
        got.forEach((n, i) => {
          const allowed = sym.options[i].map((d) => oracleSpell(root, d));
          expect(allowed, `${root} ${type} note ${i + 1}`).toContain(n);
        });
        expect(got.filter((n) => accMarks(n) >= 2).length, `${root} ${type}: ${got.join(' ')}`)
          .toBe(minDoubles(root, sym.options));
      }
    });
  }

  it('spot checks named in the audit', () => {
    const s = (r: string, t: ScaleType) => buildScale(toNote(r), t).notes.map(str).join(' ');
    expect(s('A', 'blues')).toBe('A C D Eb E G');
    expect(s('C#', 'blues')).toBe('C# E F# G G# B');
    expect(s('C', 'diminished_half_whole')).toBe('C Db D# E F# G A Bb');
    expect(s('C', 'diminished_whole_half')).toBe('C D Eb F Gb Ab A B');
    expect(s('C', 'whole_tone')).toBe('C D E F# G# Bb');
    expect(s('C#', 'whole_tone')).toBe('C# D# E# G A B');
    expect(s('C', 'chromatic')).toBe('C C# D D# E F F# G G# A A# B');
    expect(s('F#', 'chromatic')).toBe('F# G G# A A# B C C# D D# E E#');
    expect(s('C', 'bebop_major')).toBe('C D E F G G# A B');
    // A-17: "Eb dim H-W has four double flats" — now none.
    expect(s('Eb', 'diminished_half_whole')).toBe('Eb Fb Gb G A Bb C Db');
  });

  it('whole-tone scales never use the same letter twice', () => {
    for (const root of SELECTABLE_ROOTS) {
      const letters = buildScale(toNote(root), 'whole_tone').notes.map((n) => n.natural);
      expect(new Set(letters).size, root).toBe(letters.length);
    }
  });
});

describe('W1-05 / W1-11 — scale degree labels agree with the note under them (b3 style)', () => {
  it('every label names the letter of its note, for every type and root', () => {
    const bad: string[] = [];
    for (const type of ALL_TYPES) {
      for (const root of SELECTABLE_ROOTS) {
        const scale = buildScale(toNote(root), type);
        const labels = scaleDegreeLabels(scale.root, scale.notes);
        labels.forEach((label, i) => {
          const note = str(scale.notes[i]);
          const m = /^(bb|b|##|#)?(\d+|R)$/.exec(label);
          if (!m) { bad.push(`${root} ${type}: "${label}" not in b3 style`); return; }
          const num = m[2] === 'R' ? 1 : Number(m[2]);
          if (letterDegree(root, note) !== num) bad.push(`${root} ${type}: "${label}" over ${note}`);
          // and the label's pitch is the note's pitch
          if (oracleSpell(root, m[2] === 'R' ? '1' : label) !== note) bad.push(`${root} ${type}: "${label}" is not ${note}`);
        });
      }
    }
    expect(bad).toEqual([]);
  });

  it('A minor pentatonic reads R b3 4 5 b7 (no m3/b7 mixing)', () => {
    const s = buildScale(toNote('A'), 'pentatonic_minor');
    expect(scaleDegreeLabels(s.root, s.notes)).toEqual(['R', 'b3', '4', '5', 'b7']);
  });
});

describe('degree reading and interval spelling primitives', () => {
  it('degreeOf reads number from letters and alteration from semitones', () => {
    expect(formatDegree(degreeOf(toNote('C'), toNote('B#')))).toBe('#7');
    expect(formatDegree(degreeOf(toNote('C'), toNote('Db')))).toBe('b2');
    expect(formatDegree(degreeOf(toNote('C'), toNote('C#')))).toBe('#1');
    expect(formatDegree(degreeOf(toNote('C'), toNote('Bbb')))).toBe('bb7');
    expect(formatDegree(degreeOf(toNote('A'), toNote('Eb')))).toBe('b5');
  });

  it('spells every interval 1–8 above every root like the oracle', () => {
    const NUM_SEMIS: [number, number][] = [[1, 0], [2, 1], [2, 2], [3, 3], [3, 4], [4, 5], [4, 6], [5, 6], [5, 7], [5, 8], [6, 8], [6, 9], [7, 10], [7, 11], [8, 12]];
    for (const root of SELECTABLE_ROOTS) {
      for (const [num, semis] of NUM_SEMIS) {
        const got = spellIntervalAboveStrict(toNote(root), num, semis);
        // oracle: letter by number, pitch by semitones
        const letterIdx = ('CDEFGAB'.indexOf(root[0]) + num - 1) % 7;
        const letter = 'CDEFGAB'[letterIdx];
        const diff = mod12(pcOf(root) + semis - pcOf(letter));
        const acc = ({ 0: '', 1: '#', 2: '##', 11: 'b', 10: 'bb' } as Record<number, string>)[diff];
        expect(got ? str(got) : null, `${num}/${semis} above ${root}`).toBe(acc === undefined ? null : letter + acc);
      }
    }
  });

  it('spells intervals below (a fifth below Db is Gb, a fourth below C is G)', () => {
    expect(str(spellIntervalBelow(toNote('Db'), 5, 7))).toBe('Gb');
    expect(str(spellIntervalBelow(toNote('C'), 4, 5))).toBe('G');
    expect(str(spellIntervalBelow(toNote('E'), 3, 3))).toBe('C#');
  });

  it('names intervals by spelling (m3 style)', () => {
    expect(intervalBetween(toNote('C'), toNote('Eb')).short).toBe('m3');
    expect(intervalBetween(toNote('C'), toNote('D#')).short).toBe('A2');
    expect(intervalBetween(toNote('C'), toNote('G#')).long).toBe('Augmented 5th');
    expect(intervalBetween(toNote('C'), toNote('Bbb')).long).toBe('Diminished 7th');
    expect(intervalBetween(toNote('C'), toNote('F#')).short).toBe('A4');
    expect(intervalBetween(toNote('C'), toNote('Gb')).short).toBe('d5');
  });

  it('canonical interval numbers match the answer-key names', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(canonicalIntervalNumber))
      .toEqual([1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8]);
  });
});

describe('W1-02 — written (letter) octave', () => {
  it('B# sounding in octave 5 is written B#4; Cb sounding in octave 3 is written Cb4', () => {
    expect(writtenOctave(toNote('B#'), 5)).toBe(4);
    expect(writtenOctave(toNote('Cb'), 3)).toBe(4);
    expect(writtenOctave(toNote('B##'), 5)).toBe(4);
    expect(writtenOctave(toNote('Cbb'), 3)).toBe(4);
    expect(writtenOctave(toNote('C'), 4)).toBe(4);
    expect(writtenOctave(toNote('Bb'), 3)).toBe(3);
  });

  it('round-trips every spelling of every MIDI key: the written name sounds the same MIDI', () => {
    const SPELLINGS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'Fb', 'E#', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'Cb', 'B#', 'B##', 'Cbb', 'F##', 'Gbb'];
    for (let midi = 21; midi <= 108; midi++) {
      const pitchOctave = Math.floor((midi - 12) / 12);
      for (const s of SPELLINGS) {
        if (pcOf(s) !== midi % 12) continue;
        expect(midiOf(s, writtenOctave(toNote(s), pitchOctave)), `${s} @ ${midi}`).toBe(midi);
      }
    }
  });
});

describe('W1-03 — staff accidentals respect the key signature', () => {
  const pitched = (names: string[], octave = 4) => names.map((n) => ({ ...toNote(n), octave }));
  it('C harmonic minor in C minor prints a natural on B and nothing on Eb/Ab', () => {
    const sig = keySignatureForScale(toNote('C'), 'harmonic_minor')!;
    expect(sig.parent).toEqual(toNote('Eb'));
    const acc = staffAccidentals(pitched(['C', 'D', 'Eb', 'F', 'G', 'Ab', 'B']), sig.alterations);
    expect(acc).toEqual([null, null, null, null, null, null, 'n']);
  });
  it('Eb major prints no accidentals at all', () => {
    const sig = keySignatureForScale(toNote('Eb'), 'major')!;
    expect(staffAccidentals(pitched(['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D']), sig.alterations).every((a) => a === null)).toBe(true);
  });
  it('an accidental holds for its line until changed, without a key signature', () => {
    expect(staffAccidentals(pitched(['F#', 'F#', 'F', 'F'])))
      .toEqual(['#', null, 'n', null]);
  });
});

describe('W1-09 — key picker root spelling', () => {
  it('chooses the spelling with fewer accidentals per mode', () => {
    const s = (pc: number, t: ScaleType) => str(preferredRootSpelling(pc, t));
    expect([1, 3, 6, 8, 10].map((pc) => s(pc, 'major'))).toEqual(['Db', 'Eb', 'F#', 'Ab', 'Bb']);
    expect([1, 3, 6, 8, 10].map((pc) => s(pc, 'natural_minor'))).toEqual(['C#', 'Eb', 'F#', 'G#', 'Bb']);
    expect([0, 2, 4, 5, 7, 9, 11].map((pc) => s(pc, 'major'))).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });
  it('offers the other everyday name of a black-key root only', () => {
    expect(str(enharmonicRootAlternative(toNote('C#'))!)).toBe('Db');
    expect(str(enharmonicRootAlternative(toNote('Gb'))!)).toBe('F#');
    expect(enharmonicRootAlternative(toNote('C'))).toBeNull();
    expect(enharmonicRootAlternative(toNote('Cb'))).toBeNull();
  });
});

describe('W2-01 — key signature from the spelled parent key', () => {
  it('matches the oracle for every scale type with a standard signature, on every root', () => {
    for (const type of ALL_TYPES) {
      for (const root of SELECTABLE_ROOTS) {
        const got = keySignatureForScale(toNote(root), type);
        const rule = PARENT_RULE[type];
        if (!rule) { expect(got, `${root} ${type}`).toBeNull(); continue; }
        const parent = oracleSpell(root, rule)!;
        const want = majorKeySignature(parent);
        expect(got && str(got.parent), `${root} ${type}`).toBe(parent);
        expect({ count: got!.count, type: got!.type }, `${root} ${type}`).toEqual({ count: want.count, type: want.type });
      }
    }
  });
});
