/**
 * Helper functions for generating exercise choices.
 */
import type { NaturalNote, Accidental, Note, ScaleType, ChordQuality, PitchedNote } from '../../../core/types/music';
import { noteToString } from '../../../core/types/music';
import { PITCH_CLASS_SPELLINGS, getPitchClass } from '../../../core/constants/notes';
import { INTERVAL_LABELS, buildChord, getDiatonicTriads } from '../../../core/constants/chords';
import { chordVoicingPitches, midiToNote } from '../../../core/utils/pianoLayout';
import { MAJOR_DEGREE_SEMITONES, intervalNameOfDegree, canonicalIntervalNumber } from '../../../core/utils/degreeSpelling';
import { buildScale } from '../../../core/constants/scales';
import { mulberry32, seededShuffle } from '../../../core/utils/prng';
import type { EarTrainingConfig, ExerciseDefinition } from '../../../core/types/exercise';
import { parseWrittenPitch } from './exerciseStaff';

export interface ChoiceOption {
  label: string;
  value: string;
  correct: boolean;
  /** A melody option (melodic dictation): drawn on a staff; `label` is its letter. */
  melody?: PitchedNote[];
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

  // Compound targets (9ths–11ths, W4-18) draw neighbours from the compound
  // range too; simple ones stay within the octave, as before.
  const max = correctSemitones > 12 ? 24 : 12;
  const distractorPool: number[] = [];
  for (let offset = -3; offset <= 3; offset++) {
    if (offset === 0) continue;
    const candidate = correctSemitones + offset;
    // 15 semitones heard alone is a minor 10th; the table's "Augmented 9th"
    // is the chord-symbol (#9) reading, so it is no aural distractor.
    if (candidate >= 1 && candidate <= max && INTERVAL_LABELS[candidate] && candidate !== 15) {
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
  const lead = earReferenceLeadMs(cfg);
  switch (cfg.mode) {
    case 'note':
      return lead + 1000 + MARGIN;
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
      return lead + (chords - 1) * 950 + 1200 + MARGIN;
    }
    case 'melody': {
      const notes = Math.max(1, earMelodyPitches(cfg).length);
      return lead + Math.round(((notes - 1) * MELODY_STEP_S + MELODY_LAST_S) * 1000) + MARGIN;
    }
  }
}

// ─── Reference pre-roll and melody mode (decision D-11, W4-11/12/13) ─────────

/** Middle C: the reference played before a single-note ear item. */
export const EAR_REFERENCE_PITCH: PitchedNote = { natural: 'C', accidental: '', octave: 4 };
/** How long the reference sounds (s) and how long after it starts the item begins (ms). */
export const EAR_REFERENCE_NOTE_S = 0.8;
export const EAR_REFERENCE_CHORD_S = 1.1;
const LEAD_MS = { pitch: 1300, key: 1700 } as const;
/** A melody's notes: one every 0.6 s, each 0.5 s; the last one rings 0.9 s. */
export const MELODY_STEP_S = 0.6;
export const MELODY_NOTE_S = 0.5;
export const MELODY_LAST_S = 0.9;

export type EarReference =
  | { kind: 'pitch'; pitches: PitchedNote[] }
  | { kind: 'key'; key: Note; pitches: PitchedNote[] };

/**
 * What sounds BEFORE the item, so it is heard relative to something (D-11):
 * middle C before every single note (W4-12), including a unison, the key's tonic chord — root
 * position, as the progressions voice their chords — before a progression /
 * cadence (W4-11) or a melody (W4-13). Other modes are already relative
 * (an interval, a chord's quality, a scale's type).
 */
export function earReference(cfg: EarTrainingConfig): EarReference | null {
  if (cfg.mode === 'note') {
    return { kind: 'pitch', pitches: [EAR_REFERENCE_PITCH] };
  }
  if (cfg.mode === 'progression' || cfg.mode === 'melody') {
    const key: Note = { natural: (cfg.root ?? 'C') as NaturalNote, accidental: (cfg.rootAccidental ?? '') as Accidental };
    return { kind: 'key', key, pitches: chordVoicingPitches(buildChord(key, 'major').notes, 3) };
  }
  return null;
}

/** Milliseconds from the reference's start to the item's start (0 = no reference). */
export function earReferenceLeadMs(cfg: EarTrainingConfig): number {
  const ref = earReference(cfg);
  return ref ? LEAD_MS[ref.kind] : 0;
}

/** The melody a melody-mode item plays: its correct option's written pitches. */
export function earMelodyPitches(cfg: EarTrainingConfig): PitchedNote[] {
  const correct = cfg.melodyChoices?.find((c) => c.correct);
  return correct ? correct.notes.map(parseWrittenPitch) : [];
}

/** How an option reads in words (a melody option: its notes). */
export function optionText(opt: ChoiceOption): string {
  return opt.melody ? opt.melody.map((n) => `${n.natural}${n.accidental}`).join(' ') : opt.label;
}

/** A melody option's value: its written pitches, space-separated ('E4 F#4 G4'). */
export const melodyValue = (notes: readonly string[]) => notes.join(' ');

/**
 * The options of a melody item, in a stable order seeded by the exercise id,
 * lettered A, B, C … in that order; each carries its melody for the staff.
 */
export function generateMelodyChoices(cfg: EarTrainingConfig, exerciseId: string): ChoiceOption[] {
  const options = seededShuffle(
    (cfg.melodyChoices ?? []).map((c) => ({ value: melodyValue(c.notes), correct: c.correct, melody: c.notes.map(parseWrittenPitch) })),
    mulberry32(djb2(`melody:${exerciseId}`)),
  );
  return options.map((o, i) => ({ ...o, label: String.fromCharCode(65 + i) }));
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
 * The two pitches an ear-training interval sounds (root, then target), from
 * MIDI arithmetic in the app's octave convention (MIDI = 12 + 12·octave + pc):
 * any size sounds right, compound 9ths–11ths included (W4-18). The inline
 * version added at most one octave and read C♭/B♯ roots a semitone off.
 */
export function earIntervalPitches(cfg: EarTrainingConfig): [PitchedNote, PitchedNote] | null {
  if (!cfg.root || cfg.targetSemitones === undefined) return null;
  const root: PitchedNote = { natural: cfg.root as NaturalNote, accidental: (cfg.rootAccidental ?? '') as Accidental, octave: cfg.rootOctave ?? 4 };
  const rootMidi = 12 + 12 * root.octave + getPitchClass(root);
  const signed = cfg.direction === 'descending' ? -cfg.targetSemitones : cfg.targetSemitones;
  return [root, midiToNote(rootMidi + signed)];
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

/**
 * The options a question offers, exactly as the focused check shows them
 * (one function for the runner and the corpus tests — e.g. the hint-leak test
 * reads each question's keyed answer from here).
 */
export function choicesForExercise(exercise: ExerciseDefinition, t: TFunc): ChoiceOption[] {
  const cfg = exercise.config;
  switch (cfg.type) {
    case 'note_id':
      return generateNoteChoices(cfg.note, cfg.accidental);
    case 'interval_id':
      if (cfg.answer === 'step') return generateStepChoices(cfg.targetSemitones, t);
      if (cfg.answer === 'number') return generateIntervalNumberChoices(intervalNumberOf(cfg.intervalNumber, cfg.targetSemitones), t);
      return cfg.intervalNumber !== undefined
        ? generateSpelledIntervalChoices(cfg.intervalNumber, cfg.targetSemitones)
        : generateIntervalChoices(cfg.targetSemitones);
    case 'multiple_choice':
      return generateMultipleChoiceOptions(cfg.choices, exercise.id);
    case 'ear_training': {
      if (cfg.mode === 'note') return generateNoteChoices(cfg.note ?? 'C', cfg.accidental ?? '');
      if (cfg.mode === 'interval') return generateIntervalChoices(cfg.targetSemitones ?? 7);
      if (cfg.mode === 'melody') return generateMelodyChoices(cfg, exercise.id);
      if ((cfg.mode === 'chord' || cfg.mode === 'scale' || cfg.mode === 'progression') && cfg.choices) return generateEarChoices(cfg.choices);
      return [];
    }
    case 'scale_degree_id':
      return generateDegreeChoices(cfg.correctDegree, t);
    default:
      return [];
  }
}
