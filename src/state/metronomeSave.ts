/**
 * The metronome's saved settings (wave 3, stream M): ONE optional field of
 * the v6 settings save, `metronome` = { bpm, beats }, written only once the
 * learner has changed the tempo or the beats in a bar (store.ts partialize) —
 * a save without it is the app as it was. Whether it is running is never
 * saved. NOT `metronomeBPM` / `metronomeBeats` / `metronomeVolume`: the v4
 * migration in store.ts strips those names from every save.
 *
 * Eager and tiny (the settings guard runs at boot); the clock and the bar
 * are a lazy chunk (`services/metronome/`, `components/metronome/`).
 */

export const MIN_TEMPO = 30;
export const MAX_TEMPO = 240;
export const DEFAULT_TEMPO = 80;
export const BAR_CHOICES = [2, 3, 4, 6] as const;
export type BeatsInBar = (typeof BAR_CHOICES)[number];
export const DEFAULT_BEATS: BeatsInBar = 4;

export interface SavedMetronome {
  /** Tempo, beats a minute (30–240, whole numbers). */
  bpm: number;
  /** Beats in a bar; the first is marked by a different click. */
  beats: BeatsInBar;
}

export const DEFAULT_METRONOME: SavedMetronome = { bpm: DEFAULT_TEMPO, beats: DEFAULT_BEATS };

export const isMetronomeTempo = (v: unknown): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= MIN_TEMPO && v <= MAX_TEMPO;

export const isBeatsInBar = (v: unknown): v is BeatsInBar =>
  v === 2 || v === 3 || v === 4 || v === 6;

/**
 * The saved field if its shape is right (the same object, so the backup check
 * — which compares with Object.is — accepts it), else null: the guard then
 * drops it and the metronome starts from its defaults.
 */
export function sanitizeSavedMetronome(v: unknown): SavedMetronome | null {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return null;
  const m = v as Record<string, unknown>;
  if (!isMetronomeTempo(m.bpm) || !isBeatsInBar(m.beats)) return null;
  if (Object.keys(m).some((k) => k !== 'bpm' && k !== 'beats')) return null;
  return v as SavedMetronome;
}

/** The value partialize writes: the field only once the learner has set one. */
export function metronomeToSave(m: SavedMetronome | undefined): { metronome: SavedMetronome } | Record<string, never> {
  return m && isMetronomeTempo(m.bpm) && isBeatsInBar(m.beats) ? { metronome: { bpm: m.bpm, beats: m.beats } } : {};
}
