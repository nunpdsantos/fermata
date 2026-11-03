import type { NaturalNote, ChordQuality, PitchedNote } from './music';

export type DrillFamily =
  | 'keysig'
  | 'circle'
  | 'scale'
  | 'degree'
  | 'interval'
  | 'triad'
  | 'seventh'
  | 'roman'
  | 'function'
  | 'read';

export const DRILL_FAMILIES: readonly DrillFamily[] = [
  'keysig',
  'circle',
  'scale',
  'degree',
  'interval',
  'triad',
  'seventh',
  'roman',
  'function',
  'read',
];

export type DrillInputSpec =
  | { format: 'choice'; choices: string[] }
  | { format: 'noteChips'; chips: string[]; expectedCount: number } // unicode display strings (♯/♭) as shown on the chips; grading normalizes back to ASCII
  | { format: 'accidentalSlots'; letters: NaturalNote[] }
  | { format: 'rootQuality'; roots: string[]; qualities: ChordQuality[] }
  | FretboardInputSpec;

export type DrillAnswerSpec =
  | { kind: 'choice'; correct: string }
  | { kind: 'notes'; notes: string[] } // canonical ASCII spellings ('#'/'b') matching noteToString output
  | { kind: 'accidentals'; spelled: string[] }
  | { kind: 'rootQuality'; root: string; quality: ChordQuality }
  | FretPitchAnswerSpec;

interface DrillItemBase {
  id: string;
  promptKey: string;
  promptParams: Record<string, string | number>;
  input: DrillInputSpec;
  answer: DrillAnswerSpec;
  whyKey: string;
  whyParams: Record<string, string | number>;
  rank: number;
}

/** Reading is a normal Drill item, with its staff and stage required. */
export type DrillItem = TheoryDrillItem | ReadDrillItem;

export interface TheoryDrillItem extends DrillItemBase {
  family: Exclude<DrillFamily, 'read'>;
}

// ─── Guitar reading family (W10) ────────────────────────────────────────────

/** A place on the neck: 0 = 6th string (lowest) … 5 = 1st string; fret 0 = open. */
export interface FretPlace {
  stringIndex: number;
  fret: number;
}

/** Answer by tapping a place on a fretboard. */
export interface FretboardInputSpec {
  format: 'fretboard';
  /** Tuning the item is graded in (always 'standard' in the bank). */
  tuningId: string;
  /** Position the answer must be in: 0 = Open (open strings + frets 1–4), 2–12 = II–XII; null = anywhere. */
  position: number | null;
  /** The frets that position covers (for highlighting the window — never the answer); null = whole neck. */
  window: { fromFret: number; toFret: number; openStrings: boolean } | null;
  /** Highest fret the board offers. */
  maxFret: number;
}

/** Right = a tapped place in `accepted`; every accepted place sounds exactly `midi`. */
export interface FretPitchAnswerSpec {
  kind: 'fretPitch';
  /** Sounding pitch. */
  midi: number;
  accepted: FretPlace[];
}

/** The note the prompt shows: written an octave above where it sounds (treble-8vb, D-05). */
export interface ReadStaffPrompt {
  clef: 'treble';
  annotation: '8vb';
  /** As printed on the staff (app PitchedNote convention). */
  written: PitchedNote;
  /** As it sounds: written − 1 octave. */
  sounding: PitchedNote;
}

export interface ReadDrillItem extends DrillItemBase {
  family: 'read';
  input: FretboardInputSpec;
  answer: FretPitchAnswerSpec;
  staff: ReadStaffPrompt;
  /** Rung of the reading ladder: 1 Open, 2 II, 3 V, 4 above V, 5 whole neck. */
  stage: number;
}

/** What generateDrillBank({ includeRead: true }) returns. */
export type DrillBankItem = DrillItem;

export type MasteryTier = 'new' | 'learning' | 'review' | 'byHeart';

export interface AnswerRecord {
  ts: number;
  correct: boolean;
  ms: number;
  sessionId: string;
}

export interface SerializedCard {
  due: number;
  stability: number;
  difficulty: number;
  elapsed_days: number; // @deprecated in ts-fsrs 5.x; keep for round-trip fidelity, remove with ts-fsrs 6 upgrade
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number; // ts-fsrs State enum value (0=New 1=Learning 2=Review 3=Relearning)
  last_review?: number;
  learning_steps: number;
}

export interface ItemSrsState {
  card: SerializedCard;
  history: AnswerRecord[];
  tier: MasteryTier;
  introSessionId?: string;
  introCorrectCount: number;
}
