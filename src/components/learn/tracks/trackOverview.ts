/**
 * The starting tracks on Learn's overview (wave 2) — decided from STATIC data
 * only (`data/tracks.ts`, `MODULE_INDEX`, the learner's completed modules):
 * the overview never downloads a level for them.
 *
 *  - A track is listed once its first lesson is in MODULE_INDEX (the chords
 *    track's lessons come in a later change; until then it has no card).
 *  - A learner whose profile is 'new' or 'player' finds their own track at
 *    the top of the overview, under "Start here", the other one after it.
 *  - Everyone else (the owner: no profile; "I know some theory") finds both
 *    BELOW the level grid, under "Other ways in" — nothing above the grid
 *    moves for them.
 */
import { MODULE_INDEX } from '../../../data/moduleIndex';
import { TRACKS, TRACK_IDS, trackForProfile, type TrackInfo } from '../../../data/tracks';
import type { LearnerProfile } from '../../../state/storeTypes';

const INDEXED: ReadonlySet<string> = new Set(MODULE_INDEX.map((m) => m.id));

/** A track's lessons that exist (are in the module index), in track order. */
export function writtenLessons(track: TrackInfo, indexed: ReadonlySet<string> = INDEXED): string[] {
  return track.moduleIds.filter((id) => indexed.has(id));
}

/** Whether a track has a card: its first lesson exists. */
export function isTrackListed(track: TrackInfo, indexed: ReadonlySet<string> = INDEXED): boolean {
  return indexed.has(track.moduleIds[0]);
}

export interface TrackProgress {
  /** Lessons completed. */
  done: number;
  /** Lessons that exist. */
  total: number;
  /** The first lesson not completed yet, in track order (null: all done). */
  next: string | null;
}

export function trackProgress(track: TrackInfo, completed: readonly string[], indexed: ReadonlySet<string> = INDEXED): TrackProgress {
  const lessons = writtenLessons(track, indexed);
  const done = new Set(completed);
  return {
    done: lessons.filter((id) => done.has(id)).length,
    total: lessons.length,
    next: lessons.find((id) => !done.has(id)) ?? null,
  };
}

export interface OverviewTracks {
  /** The learner's own track (top, "Start here"), or null. */
  startHere: TrackInfo | null;
  /** The other listed tracks, in TRACK order. */
  others: TrackInfo[];
  /** Where `others` stand: at the top after "Start here", or below the level grid. */
  place: 'top' | 'below';
}

export function overviewTracks(profile: LearnerProfile | null, indexed: ReadonlySet<string> = INDEXED): OverviewTracks {
  const listed = TRACK_IDS.map((id) => TRACKS[id]).filter((t) => isTrackListed(t, indexed));
  const own = trackForProfile(profile);
  if (own && listed.includes(own)) return { startHere: own, others: listed.filter((t) => t !== own), place: 'top' };
  return { startHere: null, others: listed, place: 'below' };
}
