/**
 * A shared link's raw parameters (state/shareParams.ts) checked against the
 * app's OWN parsers and id lists. Whatever does not pass is left out — never
 * thrown, never written to the store. Pure; loaded lazily (the chord parser
 * is not needed for a first paint without a link).
 *
 *   key    → a Note the saved-settings guard accepts (letter + '' | '#' | 'b')
 *   scale  → one of the Scale picker's ids (SCALE_GROUPS)
 *   chord  → parseChordSymbol → chordFromParsed (the search box's own reading)
 *   inst   → 'piano' | 'guitar'
 *   lesson → a module of the static lesson index (MODULE_INDEX)
 */
import type { Chord, Note, NaturalNote, ScaleType } from '../core/types/music.ts';
import { parseChordSymbol, chordFromParsed } from '../core/utils/chordParser.ts';
import { SCALE_GROUPS } from '../components/navigation/keyChoice.ts';
import { MODULE_INDEX } from '../data/moduleIndex.ts';
import type { LearnDeepLink, InstrumentType } from '../state/storeTypes.ts';
import { MAX_SHARE_VALUE_LENGTH, type RawShareParams } from '../state/shareParams.ts';

/** What a link asks for, every part valid. */
export interface ShareTarget {
  key?: Note;
  scale?: ScaleType;
  chord?: Chord;
  /** The chord as the link spelled it (for the toast). */
  chordSymbol?: string;
  inst?: InstrumentType;
  lesson?: LearnDeepLink;
}

const PICKER_SCALES: ReadonlySet<string> = new Set(SCALE_GROUPS.flatMap((g) => g.options));
const INSTRUMENTS: ReadonlySet<string> = new Set(['piano', 'guitar']);
const LESSONS: ReadonlyMap<string, LearnDeepLink> = new Map(
  MODULE_INDEX.map((m) => [m.id, { levelId: m.level, unitId: m.unitId, moduleId: m.id }]),
);

const isText = (v: unknown): v is string =>
  typeof v === 'string' && v.length > 0 && v.length <= MAX_SHARE_VALUE_LENGTH;

/** `D`, `Eb`, `F#`, `f♯`, `B♭` → a Note; anything else → null. */
export function parseShareKey(v: unknown): Note | null {
  if (!isText(v)) return null;
  const m = /^([A-Ga-g])(#|b|♯|♭)?$/u.exec(v.trim());
  if (!m) return null;
  const accidental = m[2] === '#' || m[2] === '♯' ? '#' : m[2] === 'b' || m[2] === '♭' ? 'b' : '';
  return { natural: m[1].toUpperCase() as NaturalNote, accidental };
}

/** A Scale-picker id (exact, lower case) → the ScaleType; anything else → null. */
export function parseShareScale(v: unknown): ScaleType | null {
  if (!isText(v)) return null;
  const id = v.trim();
  return PICKER_SCALES.has(id) ? (id as ScaleType) : null;
}

/** A chord symbol the core parser reads → the Chord Explore selects; anything else → null. */
export function parseShareChord(v: unknown): Chord | null {
  if (!isText(v)) return null;
  try {
    const parsed = parseChordSymbol(v.trim());
    if (!parsed) return null;
    const chord = chordFromParsed(parsed);
    return chord.notes.length > 0 ? chord : null;
  } catch {
    return null;
  }
}

export function parseShareInstrument(v: unknown): InstrumentType | null {
  return isText(v) && INSTRUMENTS.has(v.trim()) ? (v.trim() as InstrumentType) : null;
}

export function parseShareLesson(v: unknown): LearnDeepLink | null {
  if (!isText(v)) return null;
  const hit = LESSONS.get(v.trim());
  return hit ? { ...hit } : null;
}

/** Every valid part of a link; an empty object when nothing in it is valid. */
export function parseShareLink(raw: RawShareParams | null | undefined): ShareTarget {
  const out: ShareTarget = {};
  if (!raw || typeof raw !== 'object') return out;
  const key = parseShareKey(raw.key);
  if (key) out.key = key;
  const scale = parseShareScale(raw.scale);
  if (scale) out.scale = scale;
  const chord = parseShareChord(raw.chord);
  if (chord) {
    out.chord = chord;
    out.chordSymbol = (raw.chord as string).trim();
  }
  const inst = parseShareInstrument(raw.inst);
  if (inst) out.inst = inst;
  const lesson = parseShareLesson(raw.lesson);
  if (lesson) out.lesson = lesson;
  return out;
}

export function isEmptyTarget(t: ShareTarget): boolean {
  return !t.key && !t.scale && !t.chord && !t.inst && !t.lesson;
}
