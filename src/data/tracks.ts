/**
 * The two starting tracks — a wave-2 contract (2026-11-10).
 *
 * OWNER: the lessons branch (stream L). The ids below are FIXED: other
 * branches key on them before the lessons exist. The owner may add exports;
 * every other branch may only IMPORT the names exported here, and must not
 * change this file.
 *
 * A track is an OPTIONAL unit of lessons with its own way in, outside the
 * nine levels' required path (core/constants/optionalCurriculum.ts):
 *
 *   'sound'  — "Start with sound": for someone new to music. No notation;
 *              every check is answered by ear or on the instrument.
 *   'chords' — "From the chords you know": for someone who already plays
 *              (often guitar, by chord shapes and songs) and never learned
 *              theory.
 *
 * This file is eager and free of lesson content: the start screen's doors,
 * the Learn overview and Drill read it without downloading a level.
 */
import type { LearnerProfile } from '../state/storeTypes.ts';

export type TrackId = 'sound' | 'chords';

export interface TrackInfo {
  id: TrackId;
  /** Where the unit lives in the curriculum data. */
  levelId: string;
  unitId: string;
  /** The lessons, in order. */
  moduleIds: readonly string[];
  /** The start-screen door this track is the first choice for. */
  profile: Exclude<LearnerProfile, 'theory'>;
}

export const TRACKS: Readonly<Record<TrackId, TrackInfo>> = {
  sound: {
    id: 'sound',
    levelId: 'l1',
    unitId: 'u34',
    moduleIds: ['l1u34m1', 'l1u34m2', 'l1u34m3', 'l1u34m4', 'l1u34m5'],
    profile: 'new',
  },
  chords: {
    id: 'chords',
    levelId: 'l1',
    unitId: 'u35',
    moduleIds: [
      'l1u35m1', 'l1u35m2', 'l1u35m3', 'l1u35m4', 'l1u35m5',
      'l1u35m6', 'l1u35m7', 'l1u35m8', 'l1u35m9', 'l1u35m10',
    ],
    profile: 'player',
  },
};

export const TRACK_IDS: readonly TrackId[] = ['sound', 'chords'];

/** The track a learner's profile starts with; null for 'theory' and never asked. */
export function trackForProfile(profile: LearnerProfile | null): TrackInfo | null {
  if (profile === 'new') return TRACKS.sound;
  if (profile === 'player') return TRACKS.chords;
  return null;
}

/** The track a lesson belongs to, or null for a lesson of the nine levels. */
export function trackOfModule(moduleId: string): TrackInfo | null {
  for (const id of TRACK_IDS) {
    if (TRACKS[id].moduleIds.includes(moduleId)) return TRACKS[id];
  }
  return null;
}

/** The first lesson of a track, in the shape `openLearnTarget` takes. */
export function firstLessonOf(track: TrackInfo): { levelId: string; unitId: string; moduleId: string } {
  return { levelId: track.levelId, unitId: track.unitId, moduleId: track.moduleIds[0] };
}

/**
 * The track lessons that exist today (wave 2, stream L). Eager and tiny, for
 * the one reader that cannot wait for the module index: the start hint,
 * which is in the entry chunk and must render whole with Explore's first
 * paint (MODULE_INDEX is a lazy chunk of ~20 kB; the entry has no room for
 * it). `src/data/__tests__/tracks.test.ts` keeps this set EQUAL to the track
 * ids in MODULE_INDEX, so it cannot drift: whoever adds a track lesson adds
 * its id here in the same change ('l1u35m1'…'l1u35m10' for the chords track).
 */
export const WRITTEN_TRACK_LESSONS: ReadonlySet<string> = new Set([...TRACKS.sound.moduleIds]);

/** Whether a track's first lesson exists (so a link to it can be offered). */
export function isTrackWritten(track: TrackInfo, written: ReadonlySet<string> = WRITTEN_TRACK_LESSONS): boolean {
  return written.has(track.moduleIds[0]);
}
