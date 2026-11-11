/**
 * What a lesson unlocks in Drill (wave 2, "Drill follows the lessons").
 *
 * Eager and content-free: lesson ids and the item fields the bank sets at
 * generation (`family`, `key`, `chord`, `degree`, `promptKey` — never an id
 * parsed apart). Read by Drill only when "Follow my lessons" is in force.
 *
 *  - The nine levels: a family opens WHOLE once its lesson
 *    (DRILL_FAMILY_TO_MODULE), or any later lesson in course order, is
 *    completed. Course order = MODULE_INDEX order with the optional units, the
 *    two tracks and Level 9 left out: Level 9 (ear training) runs beside every
 *    level, so finishing one of its lessons says nothing about Levels 2–8.
 *  - The two tracks (`data/tracks.ts`): a lesson opens part of a family, only
 *    the keys / chords / degrees it uses. See TRACK_UNLOCKS for what each one
 *    gives, and why some rows are narrower than the first plan.
 */
import type { ChordQuality } from '../core/types/music';
import type { DrillFamily, DrillItem } from '../core/types/drill';
import { DRILL_FAMILIES } from '../core/types/drill';
import { DRILL_FAMILY_TO_MODULE } from './drillFamilyToModule';
import { MODULE_INDEX } from './moduleIndex';
import { isOptionalModuleId } from '../core/constants/optionalCurriculum';
import { trackOfModule, type TrackInfo } from './tracks';

/** Part of one family that a track lesson opens. */
export interface DrillUnlockRow {
  family: DrillFamily;
  /** Items whose `key` is one of these ('C' major, 'a' minor — the bank's convention). */
  keys?: readonly string[];
  /** Items whose `chord` is one of these. */
  chords?: readonly { root: string; quality: ChordQuality }[];
  /** Only items about these degrees (their `degree`). */
  degrees?: readonly number[];
  /** Only these kinds of question (their `promptKey`). */
  prompts?: readonly string[];
}

const chords = (quality: ChordQuality, ...roots: string[]) => roots.map((root) => ({ root, quality }));

/** The keys of the open guitar chords: C A G E D major, A E D minor. */
const OPEN_MAJOR = ['C', 'A', 'G', 'E', 'D'] as const;
const OPEN_MINOR = ['A', 'E', 'D'] as const;
/** The keys the chords track works in (l1u35m2 onwards). */
const TRACK_KEYS = ['G', 'C', 'D', 'A', 'E'] as const;
/** The keys whose seven notes the chords track spells out (G, C, D: see below). */
const SPELLED_KEYS = ['G', 'C', 'D'] as const;

/**
 * The Roman-numeral questions a track lesson opens: "What is IV in G major?"
 * and "In G major, C major is which degree?". Left out: "Is D minor diatonic
 * in C major?" (the word "diatonic"), and the pattern / harmonic-minor facts,
 * which name no key.
 */
const ROMAN_IN_KEY = ['drill.prompts.degreeToChord', 'drill.prompts.chordToDegree'];

/**
 * The track lessons' table. Every row was checked against the items it lets
 * through (`drillUnlocks.test.ts` prints five of each, in English) and, at
 * integration (2026-11-10), against the written lessons' text: a row gives
 * only what a learner who did that lesson (and the track's lessons before
 * it) has been shown.
 *  - `scale` (l1u34m4): C and G major. The lesson builds both (G with its
 *    F♯); F major needs B♭, and nothing in the sound track says why it is
 *    B♭ and not A♯ (one letter per note), so F waits.
 *  - `roman` (l1u35m2, m3): the two "which chord / which degree" questions
 *    only (not "is it diatonic?"). m2 gives I, IV and V in G, C, D, A and E,
 *    as its text does. m3 gives I–vi in G, C and D only: its text names the
 *    minor chords of those three keys and never those of A or E; vii°
 *    (diminished) is not a minor chord of the key, which is what it is about.
 *  - `function` is left to its level lesson: "Home and away" (l1u35m4) calls
 *    I home and IV the softer way home, but never uses the answers' words
 *    (tonic / subdominant (pre-dominant) / dominant), nor says what ii or vi do.
 *  - `seventh` (l1u35m7): the open-string dominant sevenths (C7 A7 G7 E7 D7).
 *    The lesson builds the dominant 7th and never a minor seventh chord, so
 *    Am7 / Em7 / Dm7 wait, with major 7th, half-diminished and diminished
 *    sevenths, for Level 3.
 *  - `scale` (l1u35m9): G, C and D major, the keys whose seven notes the
 *    chords track spells out (G in m2 and m9; C's chord roots in m3; D in m3,
 *    m4 and m9). A and E major are never spelled as scales there.
 *  - `degree` (l1u35m9) is left out: it asks for the degree NAMES (supertonic,
 *    submediant…); the lesson gives the scale for a melody.
 */
export const TRACK_UNLOCKS: Readonly<Record<string, readonly DrillUnlockRow[]>> = {
  // Sound track ("Start with sound")
  l1u34m4: [{ family: 'scale', keys: ['C', 'G'] }],
  l1u34m5: [{ family: 'triad', chords: [...chords('major', 'C', 'G', 'F'), ...chords('minor', 'A', 'E', 'D')] }],
  // Chords track ("From the chords you know")
  l1u35m2: [{ family: 'roman', keys: TRACK_KEYS, degrees: [1, 4, 5], prompts: ROMAN_IN_KEY }],
  l1u35m3: [{ family: 'roman', keys: SPELLED_KEYS, degrees: [1, 2, 3, 4, 5, 6], prompts: ROMAN_IN_KEY }],
  l1u35m6: [{ family: 'triad', chords: [...chords('major', ...OPEN_MAJOR), ...chords('minor', ...OPEN_MINOR)] }],
  l1u35m7: [{ family: 'seventh', chords: chords('dominant7', ...OPEN_MAJOR) }],
  l1u35m9: [{ family: 'scale', keys: SPELLED_KEYS }],
};

/**
 * The nine levels' lessons in course order (optional units, the tracks and
 * Level 9 left out — see the header).
 */
export const LEVEL_COURSE_ORDER: readonly string[] = MODULE_INDEX
  .map((m) => m.id)
  .filter((id) => !isOptionalModuleId(id) && trackOfModule(id) === null && !id.startsWith('l9'));

const COURSE_POSITION = new Map(LEVEL_COURSE_ORDER.map((id, i) => [id, i]));

/** What the completed lessons open. */
export interface DrillUnlock {
  /** Families open in full (a level lesson reached them). */
  whole: ReadonlySet<DrillFamily>;
  /** Parts of other families opened by track lessons. */
  rows: readonly DrillUnlockRow[];
}

/** Pure: what Drill may ask after these lessons. */
export function unlockedFor(completedModuleIds: Iterable<string>): DrillUnlock {
  const done = new Set(completedModuleIds);
  let furthest = -1;
  for (const id of done) furthest = Math.max(furthest, COURSE_POSITION.get(id) ?? -1);
  const whole = new Set<DrillFamily>();
  for (const family of DRILL_FAMILIES) {
    const at = COURSE_POSITION.get(DRILL_FAMILY_TO_MODULE[family]);
    if (at !== undefined && at <= furthest) whole.add(family);
  }
  const rows: DrillUnlockRow[] = [];
  for (const id of Object.keys(TRACK_UNLOCKS)) {
    if (!done.has(id)) continue;
    for (const row of TRACK_UNLOCKS[id]) if (!whole.has(row.family)) rows.push(row);
  }
  return { whole, rows };
}

/** True when the lessons open nothing at all yet. */
export function nothingUnlocked(unlock: DrillUnlock): boolean {
  return unlock.whole.size === 0 && unlock.rows.length === 0;
}

function rowAdmits(row: DrillUnlockRow, item: DrillItem): boolean {
  if (row.family !== item.family) return false;
  if (row.keys && (item.key === undefined || !row.keys.includes(item.key))) return false;
  if (row.chords) {
    const c = item.chord;
    if (!c || !row.chords.some((r) => r.root === c.root && r.quality === c.quality)) return false;
  }
  if (row.degrees && (item.degree === undefined || !row.degrees.includes(item.degree))) return false;
  if (row.prompts && !row.prompts.includes(item.promptKey)) return false;
  return true;
}

/** May Drill ask this item under these lessons? */
export function isItemUnlocked(unlock: DrillUnlock, item: DrillItem): boolean {
  if (unlock.whole.has(item.family)) return true;
  return unlock.rows.some((row) => rowAdmits(row, item));
}

/** Families with at least something open: whole ones first, in DRILL_FAMILIES order. */
export function openFamilies(unlock: DrillUnlock): { family: DrillFamily; whole: boolean }[] {
  return DRILL_FAMILIES.flatMap((family): { family: DrillFamily; whole: boolean }[] => {
    if (unlock.whole.has(family)) return [{ family, whole: true }];
    return unlock.rows.some((r) => r.family === family) ? [{ family, whole: false }] : [];
  });
}

/** The lesson ids that open something, in the order a learner meets them (the track first). */
function unlockingLessons(track: TrackInfo | null): string[] {
  const trackIds = track ? track.moduleIds.filter((id) => id in TRACK_UNLOCKS) : [];
  const levelIds = LEVEL_COURSE_ORDER.filter((id) => DRILL_FAMILIES.some((f) => DRILL_FAMILY_TO_MODULE[f] === id));
  return [...trackIds, ...levelIds];
}

/** Does completing `moduleId` add anything to `unlock`? */
function opensMore(unlock: DrillUnlock, done: ReadonlySet<string>, moduleId: string): DrillFamily[] {
  const after = unlockedFor([...done, moduleId]);
  const before = openFamilies(unlock);
  return openFamilies(after)
    .filter(({ family, whole }) => {
      const was = before.find((b) => b.family === family);
      if (!was) return true;
      if (whole && !was.whole) return true;
      // A track lesson that widens a family already part-open counts as more.
      const rowsBefore = unlock.rows.filter((r) => r.family === family).length;
      const rowsAfter = after.rows.filter((r) => r.family === family).length;
      return !whole && rowsAfter > rowsBefore;
    })
    .map(({ family }) => family);
}

/**
 * The next lesson that opens something new, and what it opens: the learner's
 * own track first (in its order), then the levels' lessons. null = nothing
 * left to open.
 */
export function nextUnlock(
  completedModuleIds: Iterable<string>,
  track: TrackInfo | null,
): { moduleId: string; families: DrillFamily[] } | null {
  const done = new Set(completedModuleIds);
  const unlock = unlockedFor(done);
  for (const moduleId of unlockingLessons(track)) {
    if (done.has(moduleId)) continue;
    const families = opensMore(unlock, done, moduleId);
    if (families.length > 0) return { moduleId, families };
  }
  return null;
}

/**
 * The lesson that opens a family the learner has nothing of yet: the first
 * lesson of their own track that does, else the family's level lesson.
 */
export function lessonOpening(family: DrillFamily, track: TrackInfo | null): string {
  if (track) {
    const fromTrack = track.moduleIds.find((id) => TRACK_UNLOCKS[id]?.some((r) => r.family === family));
    if (fromTrack) return fromTrack;
  }
  return DRILL_FAMILY_TO_MODULE[family];
}

/** Where `openLearnTarget` finds a lesson: a track's, or one of the nine levels'. null = unknown id. */
export function learnTargetOf(moduleId: string): { levelId: string; unitId: string; moduleId: string } | null {
  const track = trackOfModule(moduleId);
  if (track) return { levelId: track.levelId, unitId: track.unitId, moduleId };
  const entry = MODULE_INDEX.find((m) => m.id === moduleId);
  return entry ? { levelId: entry.level, unitId: entry.unitId, moduleId } : null;
}

/** Every lesson id this file names (for the contract test). */
export function lessonIdsNamed(): string[] {
  return [...Object.keys(TRACK_UNLOCKS), ...Object.values(DRILL_FAMILY_TO_MODULE)];
}
