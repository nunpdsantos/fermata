/**
 * Helper functions for generating exercise choices.
 */
import type { NaturalNote, Accidental } from '../../../core/types/music';
import { noteToString } from '../../../core/types/music';
import { PITCH_CLASS_SPELLINGS, getPitchClass } from '../../../core/constants/notes';
import { INTERVAL_LABELS } from '../../../core/constants/chords';

export interface ChoiceOption {
  label: string;
  value: string;
  correct: boolean;
}

// WS5 mitigation: core INTERVAL_LABELS[8]='Augmented 5th' is wrong for interval-ID (should be 'Minor 6th', per SEMITONES_TO_INTERVAL[8]). Override here until the core constant is fixed (REMEDIATION B1).
const INTERVAL_LABEL_OVERRIDES: Readonly<Record<number, string>> = { 8: 'Minor 6th' };

/** Interval name for a semitone count, applying the WS5 label override before INTERVAL_LABELS. */
function intervalLabelFor(semitones: number): string {
  return (
    INTERVAL_LABEL_OVERRIDES[semitones] ??
    INTERVAL_LABELS[semitones] ??
    `${semitones} semitones`
  );
}

/**
 * Generate 4 note-name choices: the correct note + 3 distractors.
 * Avoids enharmonic equivalents of the correct note as distractors.
 */
export function generateNoteChoices(
  correctNatural: string,
  correctAccidental: string,
): ChoiceOption[] {
  const correctNote = { natural: correctNatural as NaturalNote, accidental: (correctAccidental || '') as Accidental };
  const correctPC = getPitchClass(correctNote);
  const correctLabel = noteToString(correctNote);

  // Collect distractor notes from different pitch classes
  const distractors: ChoiceOption[] = [];
  const usedPCs = new Set<number>([correctPC]);

  // Prefer nearby pitch classes for plausible distractors
  const offsets = [1, -1, 2, -2, 3, -3, 5, 7];
  for (const offset of offsets) {
    if (distractors.length >= 3) break;
    const pc = ((correctPC + offset) % 12 + 12) % 12;
    if (usedPCs.has(pc)) continue;
    usedPCs.add(pc);
    // Use simplest spelling
    const spelling = PITCH_CLASS_SPELLINGS[pc][0];
    const label = noteToString(spelling);
    distractors.push({ label, value: label, correct: false });
  }

  const options: ChoiceOption[] = [
    { label: correctLabel, value: correctLabel, correct: true },
    ...distractors.slice(0, 3),
  ];

  return shuffle(options);
}

/**
 * Generate 4 interval-name choices: the correct interval + 3 distractors.
 */
export function generateIntervalChoices(correctSemitones: number): ChoiceOption[] {
  const correctLabel = intervalLabelFor(correctSemitones);

  const distractorPool: number[] = [];
  for (let offset = -3; offset <= 3; offset++) {
    if (offset === 0) continue;
    const candidate = correctSemitones + offset;
    if (candidate >= 1 && candidate <= 12) {
      distractorPool.push(candidate);
    }
  }
  // Expand if needed
  if (distractorPool.length < 3) {
    for (let s = 1; s <= 12; s++) {
      if (s !== correctSemitones && !distractorPool.includes(s)) {
        distractorPool.push(s);
      }
      if (distractorPool.length >= 6) break;
    }
  }

  const distractors = shuffle(distractorPool).slice(0, 3);
  const options: ChoiceOption[] = [
    { label: correctLabel, value: String(correctSemitones), correct: true },
    ...distractors.map((s) => ({
      label: intervalLabelFor(s),
      value: String(s),
      correct: false,
    })),
  ];

  return shuffle(options);
}

type TFunc = (key: string) => string;

function getDegreeLabels(t: TFunc): string[] {
  return [
    '',
    t('exercise.degree1'),
    t('exercise.degree2'),
    t('exercise.degree3'),
    t('exercise.degree4'),
    t('exercise.degree5'),
    t('exercise.degree6'),
    t('exercise.degree7'),
  ];
}

/**
 * Generate 4 scale-degree choices: the correct degree + 3 distractors.
 */
export function generateDegreeChoices(correctDegree: number, t: TFunc): ChoiceOption[] {
  const DEGREE_LABELS = getDegreeLabels(t);
  const correctLabel = DEGREE_LABELS[correctDegree] || `${correctDegree}th`;
  const distractors: ChoiceOption[] = [];
  const used = new Set<number>([correctDegree]);

  // Nearby degrees as plausible distractors
  const offsets = [1, -1, 2, -2, 3, -3];
  for (const offset of offsets) {
    if (distractors.length >= 3) break;
    const d = correctDegree + offset;
    if (d >= 1 && d <= 7 && !used.has(d)) {
      used.add(d);
      const label = DEGREE_LABELS[d] || `${d}th`;
      distractors.push({ label, value: String(d), correct: false });
    }
  }

  const options: ChoiceOption[] = [
    { label: correctLabel, value: String(correctDegree), correct: true },
    ...distractors.slice(0, 3),
  ];

  return shuffle(options);
}

/**
 * Generate choices from a multiple-choice-style config embedded in ear training.
 */
export function generateEarChoices(
  choices: { label: string; correct: boolean }[],
): ChoiceOption[] {
  return shuffle(
    choices.map((c) => ({ label: c.label, value: c.label, correct: c.correct })),
  );
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
