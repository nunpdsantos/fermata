/**
 * The learner's progression as saved (wave 2, stream S): ONE optional field
 * of the v6 settings save, `progression`, written only while it holds at
 * least one chord (store.ts partialize) — a save without it is the app as it
 * was. The chord symbols are written with `chordLinkSymbol`
 * (services/shareLinkMake.ts), so they read back as the same chords.
 *
 * Eager and tiny (the settings guard runs at boot); it never parses a chord —
 * the panel does, and leaves out a symbol the parser no longer reads.
 */

export const MAX_PROGRESSION_CHORDS = 16;
export const MIN_BPM = 50;
export const MAX_BPM = 200;
export const DEFAULT_BPM = 90;
export const BEAT_CHOICES = [4, 2] as const;
export type BeatsPerChord = (typeof BEAT_CHOICES)[number];
export const DEFAULT_BEATS: BeatsPerChord = 4;
/** A saved symbol longer than this is not one the app wrote (the chord parser itself stops at 50). */
export const MAX_SAVED_SYMBOL_LENGTH = 50;

export interface SavedProgression {
  /** Chord symbols in playing order (ASCII: `F#m7`, `G/B`), 0–16 of them (saved only when ≥ 1). */
  chords: string[];
  /** Tempo, beats a minute (50–200, whole numbers). */
  bpm: number;
  /** Beats each chord lasts. */
  beats: BeatsPerChord;
}

export const EMPTY_PROGRESSION: SavedProgression = { chords: [], bpm: DEFAULT_BPM, beats: DEFAULT_BEATS };

export const isTempo = (v: unknown): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= MIN_BPM && v <= MAX_BPM;

export const isBeats = (v: unknown): v is BeatsPerChord => v === 4 || v === 2;

const isSymbol = (v: unknown): v is string =>
  typeof v === 'string' && v.length > 0 && v.length <= MAX_SAVED_SYMBOL_LENGTH && /^[A-G]/.test(v);

/**
 * The saved field if its shape is right (the same object, so the backup check
 * — which compares with Object.is — accepts it), else null: the guard then
 * drops it and the learner starts with no progression. An empty chord list
 * is never written, so it is not accepted either.
 */
export function sanitizeSavedProgression(v: unknown): SavedProgression | null {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return null;
  const p = v as Record<string, unknown>;
  if (!Array.isArray(p.chords) || p.chords.length === 0 || p.chords.length > MAX_PROGRESSION_CHORDS) return null;
  if (!p.chords.every(isSymbol)) return null;
  if (!isTempo(p.bpm) || !isBeats(p.beats)) return null;
  if (Object.keys(p).some((k) => k !== 'chords' && k !== 'bpm' && k !== 'beats')) return null;
  return v as SavedProgression;
}

/** The value partialize writes: the field only while it holds a chord. */
export function progressionToSave(p: SavedProgression | undefined): { progression: SavedProgression } | Record<string, never> {
  return p && p.chords.length > 0 ? { progression: { chords: [...p.chords], bpm: p.bpm, beats: p.beats } } : {};
}
