/**
 * Helper functions for generating exercise choices.
 */
import type { NaturalNote, Accidental, Note, ScaleType, ChordQuality, PitchedNote } from '../../../core/types/music';
import { noteToString } from '../../../core/types/music';
import { PITCH_CLASS_SPELLINGS, getPitchClass } from '../../../core/constants/notes';
import { INTERVAL_LABELS, buildChord, getDiatonicTriads } from '../../../core/constants/chords';
import { chordVoicingPitches } from '../../../core/utils/pianoLayout';
import { MAJOR_DEGREE_SEMITONES, intervalNameOfDegree, canonicalIntervalNumber } from '../../../core/utils/degreeSpelling';
import { buildScale } from '../../../core/constants/scales';
import { mulberry32, seededShuffle } from '../../../core/utils/prng';
import type { EarTrainingConfig } from '../../../core/types/exercise';

export interface ChoiceOption {
  label: string;
  value: string;
  correct: boolean;
}

/** Interval name for a semitone count. */
function intervalLabelFor(semitones: number): string {
  return INTERVAL_LABELS[semitones] ?? `${semitones} semitones`;
}

/** The five black keys spelled with sharps, and with flats (same-kind note distractors, W4-08). */
const BLACK_KEYS: Record<'#' | 'b', Note[]> = {
  '#': (['C', 'D', 'F', 'G', 'A'] as NaturalNote[]).map((natural) => ({ natural, accidental: '#' as Accidental })),
  b: (['D', 'E', 'G', 'A', 'B'] as NaturalNote[]).map((natural) => ({ natural, accidental: 'b' as Accidental })),
};

/**
 * Generate 4 note-name choices: the correct note + 3 distractors.
 * Avoids enharmonic equivalents of the correct note as distractors.
 *
 * A sharp or flat answer gets distractors of the same kind — the nearest
 * other black keys spelled with the same sign (audit W4-08): with natural
 * neighbours the answer was the only option with an accidental, so "written
 * here with a flat" (or "it includes an accidental") gave it away.
 */
export function generateNoteChoices(
  correctNatural: string,
  correctAccidental: string,
): ChoiceOption[] {
  const correctNote = { natural: correctNatural as NaturalNote, accidental: (correctAccidental || '') as Accidental };
  const correctPC = getPitchClass(correctNote);
  const correctLabel = noteToString(correctNote);

  if (correctNote.accidental === '#' || correctNote.accidental === 'b') {
    const distance = (pc: number) => Math.min((pc - correctPC + 12) % 12, (correctPC - pc + 12) % 12);
    const sameKind = BLACK_KEYS[correctNote.accidental]
      .filter((n) => getPitchClass(n) !== correctPC)
      .sort((a, b) => distance(getPitchClass(a)) - distance(getPitchClass(b)) || getPitchClass(a) - getPitchClass(b))
      .slice(0, 3)
      .map((n) => ({ label: noteToString(n), value: noteToString(n), correct: false }));
    return shuffle([{ label: correctLabel, value: correctLabel, correct: true }, ...sameKind]);
  }

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

/**
 * The spelled name of an interval from its NUMBER and size (audit W4-14):
 * 6 semitones as a 4th is an Augmented 4th, as a 5th a Diminished 5th;
 * 14 semitones as a 9th is a Major 9th. Null when the pair has no plain
 * single-alteration name (e.g. 7 semitones as a 4th).
 */
export function spelledIntervalName(number: number, semitones: number): string | null {
  if (number < 1 || semitones < 0) return null;
  const n = number - 1;
  const reference = MAJOR_DEGREE_SEMITONES[n % 7] + 12 * Math.floor(n / 7);
  const name = intervalNameOfDegree({ number, alteration: semitones - reference });
  return name.quality === 'AA' || name.quality === 'dd' ? null : name.long;
}

/** Choice value of a spelled interval: "number:semitones". */
export const spelledIntervalValue = (number: number, semitones: number) => `${number}:${semitones}`;

/**
 * Four spelled-interval choices (W4-14): the answer, then — for simple
 * intervals — its enharmonic twin on the neighbouring number (A4 ↔ d5, the
 * spelling the module teaches), then plain (perfect/major/minor) neighbours,
 * so the distractors are what a learner who counts only semitones or only
 * letters would pick.
 */
export function generateSpelledIntervalChoices(number: number, semitones: number): ChoiceOption[] {
  const correct = spelledIntervalName(number, semitones);
  if (!correct) return generateIntervalChoices(semitones);
  const enharmonic: [number, number][] = number <= 8 ? [[number + 1, semitones], [number - 1, semitones]] : [];
  const near: [number, number][] = [
    [number, semitones - 1], [number, semitones + 1], [number - 7, semitones - 12],
    [number + 1, semitones + 1], [number - 1, semitones - 1], [number + 1, semitones + 2], [number - 1, semitones - 2],
  ];
  const plain = (label: string) => /^(Perfect|Major|Minor) /.test(label);
  const picked: ChoiceOption[] = [];
  const take = (pairs: [number, number][], ok: (label: string) => boolean) => {
    for (const [n, st] of pairs) {
      if (picked.length >= 3) return;
      const label = st >= 1 ? spelledIntervalName(n, st) : null;
      if (!label || label === correct || !ok(label) || picked.some((c) => c.label === label)) continue;
      picked.push({ label, value: spelledIntervalValue(n, st), correct: false });
    }
  };
  take(enharmonic, () => true);
  take(near, plain);
  take(near, () => true);
  return shuffle([{ label: correct, value: spelledIntervalValue(number, semitones), correct: true }, ...picked]);
}

type TFunc = (key: string) => string;

/**
 * Interval-number choices (W4-15, L1 "Intervals by Number"): the number the
 * letters count (2nd, 3rd …) plus its nearest neighbours, labelled in the UI
 * language. Value = the number.
 */
export function generateIntervalNumberChoices(number: number, t: TFunc): ChoiceOption[] {
  const pool = [number - 1, number + 1, number - 2, number + 2, number + 3, number - 3].filter((n) => n >= 1 && n <= 8);
  const options: ChoiceOption[] = [number, ...pool.slice(0, 3)].map((n) => ({
    label: t(`exercise.intervalNumber${n}`),
    value: String(n),
    correct: n === number,
  }));
  return shuffle(options);
}

/** Half step / whole step (W4-15, L1 before interval qualities). Value = semitones. */
export function generateStepChoices(semitones: number, t: TFunc): ChoiceOption[] {
  return shuffle([
    { label: t('exercise.halfStep'), value: '1', correct: semitones === 1 },
    { label: t('exercise.wholeStep'), value: '2', correct: semitones === 2 },
  ]);
}

/** The interval number an interval_id exercise names (its spelled number, else the usual one for its size). */
export function intervalNumberOf(intervalNumber: number | undefined, semitones: number): number {
  return intervalNumber ?? canonicalIntervalNumber(semitones);
}

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
 * How long the replay lock must hold for an ear-training config, in ms —
 * the full scheduled playback of the mode plus a small margin, so pressing
 * Replay can never overlap the stimulus it repeats (audit R-01). Timings
 * mirror ExerciseRunner's playEarAudio and core playScale (0.35 s notes +
 * 15% gap, ascending run appends the octave).
 */
export function earPlaybackLockMs(cfg: EarTrainingConfig): number {
  const MARGIN = 100;
  switch (cfg.mode) {
    case 'note':
      return 1000 + MARGIN;
    case 'interval':
      return (cfg.harmonic ? 1200 : 700 + 600) + MARGIN;
    case 'chord':
      return 1200 + MARGIN;
    case 'scale': {
      let noteCount = 8; // heptatonic + octave fallback
      if (cfg.root && cfg.scaleType) {
        const root: Note = {
          natural: cfg.root as NaturalNote,
          accidental: (cfg.rootAccidental ?? '') as Accidental,
        };
        noteCount = buildScale(root, cfg.scaleType as ScaleType).notes.length + 1;
      }
      return Math.ceil(noteCount * 0.35 * 1.15 * 1000) + MARGIN;
    }
    case 'progression': {
      const chords = cfg.progression?.length ?? 4;
      return (chords - 1) * 950 + 1200 + MARGIN;
    }
  }
}

/**
 * The pitches an ear-training chord sounds (audit W4-10): root position,
 * voiced exactly as the piano lights the chord (`chordVoicingPitches`, close
 * position from octave 4), so the bass is the root. Playing every note in
 * octave 4 wrapped any chord whose root lies above C under it — A minor 7
 * sounded C E G A, a root-position C6.
 */
export function earChordPitches(cfg: EarTrainingConfig): PitchedNote[] {
  if (!cfg.chordRoot || !cfg.quality) return [];
  const root: Note = { natural: cfg.chordRoot as NaturalNote, accidental: (cfg.chordRootAccidental ?? '') as Accidental };
  return chordVoicingPitches(buildChord(root, cfg.quality as ChordQuality).notes, 4);
}

/**
 * The chords an ear-training progression sounds, one pitch list per numeral
 * (audit W4-10): each triad in root position with its root as the clear bass
 * (open voicing from octave 3 — root, fifth, third — as the piano lights a
 * low chord), so "follow the bass" names the right numeral. Same-octave
 * triads made V a 6/4 and vi a 6/3.
 */
export function earProgressionPitches(cfg: EarTrainingConfig): PitchedNote[][] {
  if (!cfg.progression) return [];
  const key: Note = { natural: (cfg.root ?? 'C') as NaturalNote, accidental: (cfg.rootAccidental ?? '') as Accidental };
  const triads = getDiatonicTriads(key);
  return cfg.progression.map((numeral) => {
    const entry = triads.find((t) => t.numeral.replace('°', '') === numeral.replace('°', ''));
    return entry ? chordVoicingPitches(entry.chord.notes, 3) : [];
  });
}

function djb2(s: string): number {
  let h = 5381;
  for (const c of s) {
    h = ((h * 33) ^ c.charCodeAt(0)) >>> 0;
  }
  return h;
}

/**
 * Order multiple-choice options with a shuffle seeded by the exercise id:
 * stable across retries and sessions, but the correct answer's position
 * varies per exercise instead of always being authored first.
 */
export function generateMultipleChoiceOptions(
  choices: { label: string; correct: boolean }[],
  exerciseId: string,
): ChoiceOption[] {
  return seededShuffle(
    choices.map((c) => ({ label: c.label, value: c.label, correct: c.correct })),
    mulberry32(djb2(exerciseId)),
  );
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
