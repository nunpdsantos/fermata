/**
 * Machinery behind the W4 Learn fixes, each against an independent oracle:
 *
 * - spelled intervals (W4-14): name from number + size, staff spelling on
 *   the right letter, choices and grading by number AND size;
 * - interval answers by number / half-whole step (W4-15);
 * - same-kind note distractors for sharp/flat answers (W4-08);
 * - the staff a prompt draws: authored clef (W4-05), a question's notation
 *   (W4-06), written-pitch parsing in the app's octave convention;
 * - generator params: {key}, index-aligned octaves, clef, interval numbers,
 *   stimuli.
 */
import { describe, it, expect } from 'vitest';
import type { IntervalIdConfig } from '../../../../core/types/exercise';
import {
  spelledIntervalName,
  spelledIntervalValue,
  generateSpelledIntervalChoices,
  generateIntervalChoices,
  generateIntervalNumberChoices,
  generateStepChoices,
  generateNoteChoices,
} from '../exerciseHelpers';
import { validateAnswer } from '../validateExercise';
import { exerciseStaff, parseWrittenPitch } from '../exerciseStaff';
import { generateExercises } from '../../../../data/exercises/exerciseGenerator';

// ── Independent interval oracle ───────────────────────────────────────────
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const LETTER_PC = [0, 2, 4, 5, 7, 9, 11];
const ACC: Record<string, number> = { '': 0, '#': 1, b: -1, '##': 2, bb: -2 };
const ORD = ['Unison', '2nd', '3rd', '4th', '5th', '6th', '7th', 'Octave', '9th', '10th', '11th', '12th', '13th', '14th', '15th'];
function oracleName(number: number, semitones: number): string | null {
  const simple = ((number - 1) % 7) + 1;
  const ref = LETTER_PC[simple - 1] + 12 * Math.floor((number - 1) / 7);
  const d = semitones - ref;
  const perfect = [1, 4, 5].includes(simple);
  const q = perfect ? { 0: 'Perfect', 1: 'Augmented', [-1]: 'Diminished' }[d] : { 0: 'Major', [-1]: 'Minor', 1: 'Augmented', [-2]: 'Diminished' }[d];
  return q ? `${q} ${ORD[number - 1]}` : null;
}
/** Spell the note `number` letters and `semitones` above a root. */
function oracleSpell(root: string, acc: string, number: number, semitones: number): string {
  const li = LETTERS.indexOf(root);
  const tl = LETTERS[(li + number - 1) % 7];
  const pc = (((LETTER_PC[li] + ACC[acc] + semitones) % 12) + 12) % 12;
  let off = pc - LETTER_PC[LETTERS.indexOf(tl)];
  if (off > 6) off -= 12;
  if (off < -6) off += 12;
  return tl + (Object.entries(ACC).find(([, v]) => v === off)?.[0] ?? '?');
}

describe('spelled intervals (W4-14)', () => {
  const PAIRS: [number, number][] = [];
  for (let n = 2; n <= 13; n++) for (let s = 1; s <= 22; s++) PAIRS.push([n, s]);

  it('names every number/size pair as the oracle does (none where no single-alteration name exists)', () => {
    const bad = PAIRS.filter(([n, s]) => spelledIntervalName(n, s) !== oracleName(n, s)).map(([n, s]) => `${n}:${s} app=${spelledIntervalName(n, s)} oracle=${oracleName(n, s)}`);
    expect(bad).toEqual([]);
    expect(spelledIntervalName(4, 6)).toBe('Augmented 4th');
    expect(spelledIntervalName(5, 6)).toBe('Diminished 5th');
    expect(spelledIntervalName(9, 14)).toBe('Major 9th');
    expect(spelledIntervalName(10, 15)).toBe('Minor 10th');
    expect(spelledIntervalName(4, 7)).toBeNull();
  });

  it('choices: the answer once, three distinct real names, the enharmonic twin first for simple intervals', () => {
    for (const [n, s] of PAIRS.filter(([n, s]) => oracleName(n, s))) {
      const ch = generateSpelledIntervalChoices(n, s);
      expect(ch).toHaveLength(4);
      expect(ch.filter((c) => c.correct).map((c) => c.label)).toEqual([oracleName(n, s)]);
      expect(new Set(ch.map((c) => c.label)).size).toBe(4);
      for (const c of ch) {
        const [cn, cs] = c.value.split(':').map(Number);
        expect(c.label).toBe(oracleName(cn, cs));
      }
    }
    const a4 = generateSpelledIntervalChoices(4, 6).map((c) => c.label).sort();
    expect(a4).toEqual(['Augmented 4th', 'Diminished 5th', 'Perfect 4th', 'Perfect 5th']);
  });

  it('grading distinguishes A4 from d5 (same sound, different spelling)', () => {
    const cfg: IntervalIdConfig = { type: 'interval_id', root: 'C', rootAccidental: '', rootOctave: 4, targetSemitones: 6, direction: 'ascending', intervalNumber: 4 };
    expect(validateAnswer(cfg, spelledIntervalValue(4, 6)).correct).toBe(true);
    const wrong = validateAnswer(cfg, spelledIntervalValue(5, 6));
    expect(wrong.correct).toBe(false);
    expect(wrong.explanation).toContain('Augmented 4th');
    expect(wrong.explanation).toContain('Diminished 5th');
  });

  it('the staff spells the second note on the interval number\'s letter', () => {
    for (const [root, acc] of [['C', ''], ['D', ''], ['E', ''], ['G', ''], ['A', ''], ['B', 'b'], ['F', '#']] as const) {
      for (const [n, s] of [[4, 6], [5, 6], [5, 8], [7, 9], [2, 3], [9, 14], [10, 15], [11, 17], [13, 21]] as const) {
        const staff = exerciseStaff({ type: 'interval_id', root, rootAccidental: acc, rootOctave: 4, targetSemitones: s, direction: 'ascending', intervalNumber: n })!;
        const t = staff.notes[1];
        expect(`${t.natural}${t.accidental}`, `${root}${acc} +${n}:${s}`).toBe(oracleSpell(root, acc, n, s));
      }
    }
  });
});

describe('compound ear-interval choices (W4-18)', () => {
  it('a 9th–11th target gets compound neighbours, never the chord-symbol "Augmented 9th"', () => {
    for (const s of [13, 14, 16, 17]) {
      const ch = generateIntervalChoices(s);
      expect(ch).toHaveLength(4);
      expect(ch.filter((c) => c.correct).map((c) => Number(c.value))).toEqual([s]);
      for (const c of ch) {
        expect(Number(c.value)).toBeGreaterThanOrEqual(10);
        expect(c.value).not.toBe('15');
      }
    }
  });
  it('a simple target still stays within the octave', () => {
    for (let s = 1; s <= 12; s++) for (const c of generateIntervalChoices(s)) expect(Number(c.value)).toBeLessThanOrEqual(12);
  });
});

describe('interval answers by number or step (W4-15)', () => {
  const t = (k: string) => k;
  it('number choices hold the counted number and its neighbours; grading by number', () => {
    const ch = generateIntervalNumberChoices(3, t);
    expect(ch.find((c) => c.correct)?.label).toBe('exercise.intervalNumber3');
    expect(ch).toHaveLength(4);
    const cfg: IntervalIdConfig = { type: 'interval_id', root: 'C', rootAccidental: '', rootOctave: 4, targetSemitones: 4, direction: 'ascending', answer: 'number' };
    expect(validateAnswer(cfg, '3').correct).toBe(true);
    expect(validateAnswer(cfg, '4').correct).toBe(false);
    expect(validateAnswer(cfg, '3').explanation).toBe("Correct! That's a 3rd.");
  });
  it('step choices are half / whole step; grading by size', () => {
    expect(generateStepChoices(1, t).find((c) => c.correct)?.label).toBe('exercise.halfStep');
    const cfg: IntervalIdConfig = { type: 'interval_id', root: 'E', rootAccidental: '', rootOctave: 4, targetSemitones: 1, direction: 'ascending', answer: 'step' };
    expect(validateAnswer(cfg, '1').correct).toBe(true);
    expect(validateAnswer(cfg, '2').explanation).toBe('That was a Half step, not a Whole step.');
  });
});

describe('note choices for sharp/flat answers are the same kind (W4-08)', () => {
  const black = { '#': ['C#', 'D#', 'F#', 'G#', 'A#'], b: ['Db', 'Eb', 'Gb', 'Ab', 'Bb'] };
  for (const sign of ['#', 'b'] as const) {
    for (const label of black[sign]) {
      it(`${label}: every option is a black key spelled with ${sign}`, () => {
        const ch = generateNoteChoices(label[0], sign);
        expect(ch).toHaveLength(4);
        expect(ch.filter((c) => c.correct).map((c) => c.label)).toEqual([label]);
        for (const c of ch) expect(black[sign]).toContain(c.label);
      });
    }
  }
  it('a natural answer still gets its nearest neighbours', () => {
    expect(generateNoteChoices('C', '').map((c) => c.label).sort()).toEqual(['B', 'C', 'C#', 'D']);
  });
});

describe('the staff a prompt draws (W4-05, W4-06)', () => {
  it('written pitches become the app\'s sounding-octave notes', () => {
    expect(parseWrittenPitch('Eb4')).toEqual({ natural: 'E', accidental: 'b', octave: 4 });
    expect(parseWrittenPitch('Cb4')).toEqual({ natural: 'C', accidental: 'b', octave: 3 });
    expect(parseWrittenPitch('B#3')).toEqual({ natural: 'B', accidental: '#', octave: 4 });
    expect(() => parseWrittenPitch('H4')).toThrow();
  });
  it('an authored clef wins: A3 "below the treble staff" is drawn in treble', () => {
    expect(exerciseStaff({ type: 'note_id', note: 'A', accidental: '', octave: 3, clef: 'treble' })!.clef).toBe('treble');
    expect(exerciseStaff({ type: 'note_id', note: 'A', accidental: '', octave: 3 })!.clef).toBe('bass');
  });
  it('a multiple-choice stimulus is drawn (notes, clef, key signature, chord)', () => {
    const staff = exerciseStaff({ type: 'multiple_choice', choices: [{ label: 'x', correct: true }], stimulus: { notes: [], keySignature: 'D', clef: 'treble' } })!;
    expect(staff).toMatchObject({ notes: [], keySignature: 'D', clef: 'treble' });
    const chord = exerciseStaff({ type: 'multiple_choice', choices: [{ label: 'x', correct: true }], stimulus: { notes: ['C4', 'E4', 'G4', 'Bb4'], chord: true } })!;
    expect(chord.chord).toBe(true);
    expect(chord.notes.map((n) => `${n.natural}${n.accidental}${n.octave}`)).toEqual(['C4', 'E4', 'G4', 'Bb4']);
    expect(exerciseStaff({ type: 'multiple_choice', choices: [{ label: 'x', correct: true }] })).toBeNull();
  });
});

describe('generator params', () => {
  const base = { moduleId: 'tparams', targetCount: 4 };
  it('{key} fills from the key aligned with the drawn root', () => {
    const ex = generateExercises({ ...base, templates: [{ type: 'chord_build', promptTemplate: 'Build the Neapolitan of {key} minor.', hintTemplate: '{root} major on ♭II of {key}.', params: { roots: ['D', 'A', 'E', 'B'], accidentals: ['b', 'b', 'b', 'b'], keys: ['C', 'G', 'D', 'A'], chordQualities: ['major'], noteCounts: [3] } }] }, 3);
    const keyOf: Record<string, string> = { Db: 'C', Ab: 'G', Eb: 'D', Bb: 'A' };
    for (const e of ex) {
      const c = e.config as { root: string; rootAccidental: string };
      expect(e.prompt).toBe(`Build the Neapolitan of ${keyOf[c.root + c.rootAccidental]} minor.`);
      expect(e.hint).toBe(`${c.root}${c.rootAccidental} major on ♭II of ${keyOf[c.root + c.rootAccidental]}.`);
    }
  });
  it('noteOctaves pins each root\'s octave; clef is carried', () => {
    const ex = generateExercises({ ...base, templates: [{ type: 'note_id', promptTemplate: 'Name it.', hintTemplate: '', params: { roots: ['C', 'A', 'F'], noteOctaves: [4, 3, 3], clef: 'treble' } }] }, 5);
    const want: Record<string, number> = { C: 4, A: 3, F: 3 };
    for (const e of ex) {
      const c = e.config as { note: string; octave: number; clef?: string };
      expect(c.octave).toBe(want[c.note]);
      expect(c.clef).toBe('treble');
    }
  });
  it('intervalNumbers travel with their interval; stimuli with their choice set', () => {
    const iv = generateExercises({ ...base, templates: [{ type: 'interval_id', promptTemplate: 'x', hintTemplate: '', params: { roots: ['D', 'G'], intervals: [6, 6, 14], intervalNumbers: [4, 5, 9] } }] }, 9);
    for (const e of iv) {
      const c = e.config as IntervalIdConfig;
      expect([[6, 4], [6, 5], [14, 9]]).toContainEqual([c.targetSemitones, c.intervalNumber]);
    }
    const sets = [[{ label: 'G major', correct: true }, { label: 'D major', correct: false }], [{ label: 'D major', correct: true }, { label: 'G major', correct: false }]];
    const mc = generateExercises({ ...base, targetCount: 2, templates: [{ type: 'multiple_choice', promptTemplate: 'Which key?', hintTemplate: '', params: { choiceSets: sets, stimuli: [{ notes: [], keySignature: 'G' }, { notes: [], keySignature: 'D' }] } }] }, 1);
    for (const e of mc) {
      const c = e.config as { choices: { label: string; correct: boolean }[]; stimulus?: { keySignature?: string } };
      expect(c.stimulus?.keySignature).toBe(c.choices.find((x) => x.correct)!.label.split(' ')[0]);
    }
  });
});
