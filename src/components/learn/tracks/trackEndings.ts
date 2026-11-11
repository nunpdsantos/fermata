import type { TrackId } from '../../../data/tracks';

/** An onward step from a track's last lesson. */
export type TrackEndingStep =
  /** Open Explore with a query applied (the lesson's instrument kept). */
  | { kind: 'explore'; label: string; query: string }
  /**
   * Open Explore's Progression panel (`requestProgression`, the progression
   * branch's contract) on the learner's own progression: no chords given.
   */
  | { kind: 'progression'; label: string }
  /** Open a level's page in Learn. */
  | { kind: 'level'; label: string; levelId: string };

/**
 * Each track's closing card: two onward steps (label = an i18n key under
 * `tracks`).
 */
export const TRACK_ENDINGS: Partial<Record<TrackId, readonly TrackEndingStep[]>> = {
  sound: [
    { kind: 'explore', label: 'tracks.sound.end.explore', query: 'C major scale' },
    { kind: 'level', label: 'tracks.sound.end.level1', levelId: 'l1' },
  ],
  chords: [
    { kind: 'progression', label: 'tracks.chords.end.progression' },
    { kind: 'level', label: 'tracks.chords.end.level2', levelId: 'l2' },
  ],
};

