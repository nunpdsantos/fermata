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
 *   prog   → each comma-separated symbol read as `chord` is (invalid ones
 *            left out), at most 16 (wave 2)
 *   bpm    → a whole number 50–200 (only with `prog`)
 *   capo   → a whole number 0–9
 */
import type { Chord, Note, NaturalNote, ScaleType } from '../core/types/music.ts';
import { parseChordSymbol, chordFromParsed } from '../core/utils/chordParser.ts';
import { SCALE_GROUPS } from '../components/navigation/keyChoice.ts';
import { MODULE_INDEX } from '../data/moduleIndex.ts';
import type { LearnDeepLink, InstrumentType } from '../state/storeTypes.ts';
import { MAX_PROG_LENGTH, MAX_SHARE_VALUE_LENGTH, type RawShareParams } from '../state/shareParams.ts';
import { MAX_PROGRESSION_CHORDS, isTempo } from '../state/progressionSave.ts';
import { MAX_CAPO_FRET } from '../state/capo.ts';

/** What a link asks for, every part valid. */
export interface ShareTarget {
  key?: Note;
  scale?: ScaleType;
  chord?: Chord;
  /** The chord as the link spelled it (for the toast). */
  chordSymbol?: string;
  inst?: InstrumentType;
  lesson?: LearnDeepLink;
  /** The Progression panel's chords, as the link spelled them (each one the parser reads). */
  prog?: string[];
  /** Its tempo (only with `prog`). */
  bpm?: number;
  /** The guitar capo fret, 0–9. */
  capo?: number;
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

/** A symbol in `prog` longer than this is not one the app writes. */
const MAX_PROG_SYMBOL_LENGTH = 32;

/** Split on the commas between chords, never on one inside parentheses (`C7(b9,#11)`). */
function splitChords(v: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of v) {
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) {
      out.push(cur);
      cur = '';
      // More pieces than a progression can hold: the rest is not read.
      if (out.length > MAX_PROGRESSION_CHORDS * 4) return out;
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

/**
 * `G,D,Em,C` → the symbols the chord parser reads, in order, at most 16; an
 * empty piece or one the parser does not read is left out. Null when none is.
 */
export function parseShareProgression(v: unknown): string[] | null {
  if (typeof v !== 'string' || v.length === 0 || v.length > MAX_PROG_LENGTH) return null;
  const out: string[] = [];
  for (const piece of splitChords(v)) {
    const s = piece.trim();
    if (!s || s.length > MAX_PROG_SYMBOL_LENGTH) continue;
    if (parseShareChord(s)) out.push(s);
    if (out.length >= MAX_PROGRESSION_CHORDS) break;
  }
  return out.length ? out : null;
}

/** A whole number written as digits only, within [min, max]; anything else null. */
function wholeNumber(v: unknown, min: number, max: number): number | null {
  if (!isText(v) || !/^\d{1,3}$/.test(v.trim())) return null;
  const n = Number(v.trim());
  return n >= min && n <= max ? n : null;
}

export function parseShareBpm(v: unknown): number | null {
  const n = wholeNumber(v, 0, 999);
  return n !== null && isTempo(n) ? n : null;
}

export function parseShareCapo(v: unknown): number | null {
  return wholeNumber(v, 0, MAX_CAPO_FRET);
}

/**
 * Every valid part of a link; an empty object when nothing in it is valid.
 *
 * `asTyped` is the same address read WITHOUT the fragment recovery
 * (`readShareParams(search)`): where a recovered key or chord is not valid
 * (`?chord=A#intro` → `A#intro`), the value before the `#` is tried instead,
 * so a real fragment after a valid value does not wipe it out. A value that
 * is invalid as typed stays ignored.
 */
export function parseShareLink(
  raw: RawShareParams | null | undefined,
  asTyped?: RawShareParams | null,
): ShareTarget {
  const out: ShareTarget = {};
  if (!raw || typeof raw !== 'object') return out;
  const typed = asTyped && typeof asTyped === 'object' ? asTyped : {};
  const key = parseShareKey(raw.key) ?? parseShareKey(typed.key);
  if (key) out.key = key;
  const scale = parseShareScale(raw.scale);
  if (scale) out.scale = scale;
  let chordText = raw.chord;
  let chord = parseShareChord(chordText);
  if (!chord) {
    chordText = typed.chord;
    chord = parseShareChord(chordText);
  }
  if (chord) {
    out.chord = chord;
    out.chordSymbol = (chordText as string).trim();
  }
  const inst = parseShareInstrument(raw.inst);
  if (inst) out.inst = inst;
  const lesson = parseShareLesson(raw.lesson);
  if (lesson) out.lesson = lesson;
  const prog = parseShareProgression(raw.prog) ?? parseShareProgression(typed.prog);
  if (prog) {
    out.prog = prog;
    const bpm = parseShareBpm(raw.bpm);
    if (bpm !== null) out.bpm = bpm;
  }
  const capo = parseShareCapo(raw.capo);
  if (capo !== null) out.capo = capo;
  return out;
}

export function isEmptyTarget(t: ShareTarget): boolean {
  return !t.key && !t.scale && !t.chord && !t.inst && !t.lesson && !t.prog && t.capo === undefined;
}
