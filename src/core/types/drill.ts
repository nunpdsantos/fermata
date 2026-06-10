import type { NaturalNote, ChordQuality } from './music';

export type DrillFamily =
  | 'keysig'
  | 'circle'
  | 'scale'
  | 'degree'
  | 'interval'
  | 'triad'
  | 'seventh'
  | 'roman'
  | 'function';

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
];

export type DrillInputSpec =
  | { format: 'choice'; choices: string[] }
  | { format: 'noteChips'; chips: string[]; expectedCount: number } // canonical ASCII spellings ('#'/'b') matching noteToString output
  | { format: 'accidentalSlots'; letters: NaturalNote[] }
  | { format: 'rootQuality'; roots: string[]; qualities: ChordQuality[] };

export type DrillAnswerSpec =
  | { kind: 'choice'; correct: string }
  | { kind: 'notes'; notes: string[] } // canonical ASCII spellings ('#'/'b') matching noteToString output
  | { kind: 'accidentals'; spelled: string[] }
  | { kind: 'rootQuality'; root: string; quality: ChordQuality };

export interface DrillItem {
  id: string;
  family: DrillFamily;
  promptKey: string;
  promptParams: Record<string, string | number>;
  input: DrillInputSpec;
  answer: DrillAnswerSpec;
  whyKey: string;
  whyParams: Record<string, string | number>;
  rank: number;
}

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
