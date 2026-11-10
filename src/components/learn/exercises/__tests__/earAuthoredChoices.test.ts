/**
 * Wave 2: ear-training note and interval items may carry authored `choices`
 * (optional field), so a sound-first item can ask "which note was higher?"
 * or "a half step or a whole step?". The played notes stay the config's; the
 * answer is the option marked correct. Items without choices are unchanged
 * (generated note / interval names, graded by name) — and so is their
 * identity, which is the config.
 */
import { describe, it, expect } from 'vitest';
import type { EarTrainingConfig, ExerciseDefinition } from '../../../../core/types/exercise';
import { choicesForExercise, earIntervalPitches, earReference } from '../exerciseHelpers';
import { validateAnswer as validateExercise } from '../validateExercise';
import { exerciseStaff } from '../exerciseStaff';
import { fingerprint } from '../../../../data/exercises/__tests__/exerciseFingerprints';
import exercisesL1 from '../../../../data/exercises/exercisesL1';

const t = (k: string, o?: Record<string, unknown>) => (o ? `${k}:${JSON.stringify(o)}` : k);
const higher: EarTrainingConfig = {
  type: 'ear_training', mode: 'interval', root: 'C', rootAccidental: '', rootOctave: 4, targetSemitones: 7, direction: 'ascending',
  choices: [{ label: 'The first note', correct: false }, { label: 'The second note', correct: true }, { label: 'Neither', correct: false }],
};
const item = (config: EarTrainingConfig): ExerciseDefinition => ({ id: 'x', type: 'ear_training', prompt: 'Listen.', config });

describe('authored choices on ear note / interval items', () => {
  it('interval: the options are the authored ones, graded by the one marked correct', () => {
    const options = choicesForExercise(item(higher), t);
    expect(options.map((o) => o.label).sort()).toEqual(['Neither', 'The first note', 'The second note']);
    expect(options.find((o) => o.correct)!.label).toBe('The second note');
    expect(validateExercise(higher, 'The second note', t).correct).toBe(true);
    expect(validateExercise(higher, 'The first note', t).correct).toBe(false);
    expect(validateExercise(higher, 'The first note', t).expected).toBe('The second note');
    // It still plays C4 then G4; no reference (an interval is relative), no staff.
    expect(earIntervalPitches(higher)!.map((p) => `${p.natural}${p.octave}`)).toEqual(['C4', 'G4']);
    expect(earReference(higher)).toBeNull();
    expect(exerciseStaff(higher)).toBeNull();
  });

  it('note: authored options win over the generated note names', () => {
    const cfg: EarTrainingConfig = { type: 'ear_training', mode: 'note', note: 'G', accidental: '', octave: 4, choices: [{ label: 'Higher than the C', correct: true }, { label: 'Lower than the C', correct: false }] };
    expect(choicesForExercise(item(cfg), t).map((o) => o.label).sort()).toEqual(['Higher than the C', 'Lower than the C']);
    expect(validateExercise(cfg, 'Higher than the C', t).correct).toBe(true);
    expect(validateExercise(cfg, 'G', t).correct).toBe(false);
  });

  it('without choices, nothing changed: generated interval / note names, graded by name', () => {
    const plain: EarTrainingConfig = { ...higher, choices: undefined };
    const options = choicesForExercise(item(plain), t);
    expect(options).toHaveLength(4);
    expect(options.find((o) => o.correct)!.label).toBe('Perfect 5th');
    const note: EarTrainingConfig = { type: 'ear_training', mode: 'note', note: 'E', accidental: '', octave: 4 };
    expect(choicesForExercise(item(note), t).find((o) => o.correct)!.label).toBe('E');
    expect(validateExercise(note, 'E', t).correct).toBe(true);
  });

  it('melody items ignore `choices` (their options are melodies)', () => {
    const cfg: EarTrainingConfig = { type: 'ear_training', mode: 'melody', root: 'C', melodyChoices: [{ notes: ['C4', 'D4'], correct: true }, { notes: ['C4', 'E4'], correct: false }], choices: [{ label: 'X', correct: true }] };
    expect(choicesForExercise(item(cfg), t).map((o) => o.label)).toEqual(['A', 'B']);
  });

  it('identity is what is PLAYED (options are labels, as in chord mode): adding the optional field changes no identity', () => {
    expect(fingerprint(item(higher))).toBe(fingerprint(item({ ...higher, choices: undefined })));
    expect(fingerprint(item(higher))).not.toBe(fingerprint(item({ ...higher, direction: 'descending' })));
  });

  it('the sound track uses them: every interval item of l1u34 has authored choices and draws no staff', () => {
    const items = Object.entries(exercisesL1).filter(([m]) => m.startsWith('l1u34')).flatMap(([, list]) => list);
    const intervals = items.filter((e) => e.config.type === 'ear_training' && e.config.mode === 'interval');
    expect(intervals.map((e) => e.id)).toEqual(['l1u34m1e1', 'l1u34m1e2', 'l1u34m1e3', 'l1u34m3e1', 'l1u34m3e2']);
    for (const e of intervals) expect((e.config as EarTrainingConfig).choices?.length, e.id).toBeGreaterThanOrEqual(3);
    // No check of the track draws a staff (note_id / interval_id / a staff stimulus).
    expect(items.filter((e) => exerciseStaff(e.config) !== null).map((e) => e.id)).toEqual([]);
    expect(items.filter((e) => e.type === 'note_id' || e.type === 'interval_id')).toEqual([]);
  });
});
