/**
 * The Progression panel's logic (wave 2, stream S), without React: which key
 * the panel numbers in, the chord list (as saved symbols), what the key line
 * says, the capo lines. Everything musical comes from the progression engine
 * (`core/utils/progression`); this file only decides what the panel shows.
 *
 * Words: a list of chords FITS a key — never "the key is" (one list can fit
 * two keys; when nothing tells them apart, the line names both).
 */
import type { Chord, Note, ScaleType } from '../../../core/types/music';
import { SCALE_FORMULAS, buildScale } from '../../../core/constants/scales';
import { buildChord, getDiatonicChordsForScale } from '../../../core/constants/chords';
import { getPitchClass, getSimplestSpelling } from '../../../core/constants/notes';
import { parentMajorKey } from '../../../core/utils/degreeSpelling';
import { chordFromParsed, parseChordSymbol } from '../../../core/utils/chordParser';
import {
  capoOptions,
  chordInKey,
  findKeys,
  keyScale,
  presetChords,
  PROGRESSION_PRESETS,
  scaleTypeOf,
  transposeProgression,
  type CapoOption,
  type ChordInKey,
  type KeyCandidate,
  type MusicKey,
  type ProgressionPreset,
} from '../../../core/utils/progression';
import { chordLinkSymbol } from '../../../services/shareLinkMake';
import { preferredRootSpelling } from '../../../core/utils/degreeSpelling';
import { MAX_PROGRESSION_CHORDS } from '../../../state/progressionSave';
import { chordBelowCapo } from '../../../core/constants/guitarChordShapes';

// ─── The key the panel numbers in ──────────────────────────────────────────

const MAJOR_SAME_ROOT: ReadonlySet<ScaleType> = new Set<ScaleType>(['major', 'pentatonic_major', 'major_blues', 'bebop_major']);
const MINOR_SAME_ROOT: ReadonlySet<ScaleType> = new Set<ScaleType>(['natural_minor', 'harmonic_minor', 'melodic_minor', 'pentatonic_minor', 'blues']);
/** Scales whose chords are those of a parent major key (the church modes, and bebop scales built on them). */
const MODE_OF: Partial<Record<ScaleType, ScaleType>> = {
  dorian: 'dorian', phrygian: 'phrygian', lydian: 'lydian', mixolydian: 'mixolydian', locrian: 'locrian',
  bebop_dominant: 'mixolydian', bebop_dorian: 'dorian',
};

export interface PanelKey {
  key: MusicKey;
  /** Explore's scale IS this key (major or natural minor): no note needed. */
  exact: boolean;
}

/**
 * The major or minor key the panel numbers Explore's scale in:
 *  - major / natural minor: that key;
 *  - harmonic and melodic minor, the minor pentatonic and the blues scale:
 *    the minor key on the same root; the major pentatonic, major blues and
 *    bebop major: the major key on the same root;
 *  - the church modes (and the bebop dominant / dorian): their parent major
 *    (D Dorian → C major), the key whose notes they are;
 *  - any other scale: the major or minor key on its root, by its 3rd (a
 *    minor 3rd and no major 3rd → minor).
 * Anything but major / natural minor is `exact: false`, and the panel says
 * which key it counts in.
 */
export function panelKeyFor(root: Note, scale: ScaleType): PanelKey {
  if (scale === 'major') return { key: { root, mode: 'major' }, exact: true };
  if (scale === 'natural_minor') return { key: { root, mode: 'minor' }, exact: true };
  if (MAJOR_SAME_ROOT.has(scale)) return { key: { root, mode: 'major' }, exact: false };
  if (MINOR_SAME_ROOT.has(scale)) return { key: { root, mode: 'minor' }, exact: false };
  const mode = MODE_OF[scale];
  const parent = mode ? parentMajorKey(root, mode) : null;
  if (parent) return { key: { root: parent, mode: 'major' }, exact: false };
  const formula = SCALE_FORMULAS[scale] ?? [];
  const minor = formula.includes(3) && !formula.includes(4);
  return { key: { root, mode: minor ? 'minor' : 'major' }, exact: false };
}

/** Explore's scale for a key (switching Explore to a key the line suggests). */
export const scaleForKey = (key: MusicKey): ScaleType => scaleTypeOf(key.mode);

/** The key's own seven chords (triads), as the In key row builds them. */
export function keyChords(key: MusicKey): { chord: Chord; numeral: string }[] {
  return getDiatonicChordsForScale(buildScale(key.root, scaleTypeOf(key.mode))).map(({ chord, numeral }) => ({ chord, numeral }));
}

// ─── The chord list (saved as symbols) ────────────────────────────────────

/** A saved / linked symbol → the chord, or null when the parser does not read it. */
export function readSymbol(symbol: string): Chord | null {
  try {
    const parsed = parseChordSymbol(symbol);
    if (!parsed) return null;
    const chord = chordFromParsed(parsed);
    return chord.notes.length > 0 ? chord : null;
  } catch {
    return null;
  }
}

/**
 * The symbols that read, in order (at most 16): the list the chips show, so
 * that a chip's index is its symbol's index. A saved symbol the parser does
 * not read (an old or hand-edited save) is left out, and the first edit
 * writes the list without it.
 */
export function readableSymbols(symbols: readonly string[]): string[] {
  const out: string[] = [];
  for (const s of symbols) {
    if (readSymbol(s)) out.push(s);
    if (out.length >= MAX_PROGRESSION_CHORDS) break;
  }
  return out;
}

/** The symbols that read, as chords, in order (at most 16). */
export function readChords(symbols: readonly string[]): Chord[] {
  const out: Chord[] = [];
  for (const s of symbols) {
    const c = readSymbol(s);
    if (c) out.push(c);
    if (out.length >= MAX_PROGRESSION_CHORDS) break;
  }
  return out;
}

/**
 * The symbol saved for a chord: the link's own (`chordLinkSymbol`, which
 * reads back as exactly this chord). A spelling no symbol reads back (a
 * double flat moved in by a transposition) is respelled on its simplest
 * name, root and bass, with the same quality.
 */
export function symbolFor(chord: Chord): string | null {
  const exact = chordLinkSymbol(chord);
  if (exact) return exact;
  const simple = buildChord(getSimplestSpelling(getPitchClass(chord.root)), chord.quality);
  if (chord.bassNote) simple.bassNote = getSimplestSpelling(getPitchClass(chord.bassNote));
  return chordLinkSymbol(simple);
}

export function addChord(symbols: readonly string[], chord: Chord): string[] {
  if (symbols.length >= MAX_PROGRESSION_CHORDS) return [...symbols];
  const s = symbolFor(chord);
  return s ? [...symbols, s] : [...symbols];
}

export function moveChord(symbols: readonly string[], index: number, by: -1 | 1): string[] {
  const to = index + by;
  if (index < 0 || index >= symbols.length || to < 0 || to >= symbols.length) return [...symbols];
  const out = [...symbols];
  [out[index], out[to]] = [out[to], out[index]];
  return out;
}

export function removeChord(symbols: readonly string[], index: number): string[] {
  return symbols.filter((_, i) => i !== index);
}

/** The chords of a preset, as symbols (capped at 16). */
export function presetSymbols(chords: readonly Chord[]): string[] {
  return chords.map(symbolFor).filter((s): s is string => !!s).slice(0, MAX_PROGRESSION_CHORDS);
}

// ─── Moving by half steps ─────────────────────────────────────────────────

export interface MoveResult {
  /** Explore's new root (its scale stays). */
  root: Note;
  /** The panel's new key, read from Explore's new root and scale. */
  key: MusicKey;
  symbols: string[];
}

/**
 * Explore's root a half step up (+1) or down (−1), spelled as the key picker
 * spells it for the scale; the chords moved from the panel's key to the new
 * one by degree (the engine keeps each number and spells for the new key).
 */
export function moveBy(root: Note, scale: ScaleType, symbols: readonly string[], by: -1 | 1): MoveResult {
  const from = panelKeyFor(root, scale).key;
  const newRoot = preferredRootSpelling(getPitchClass(root) + by + 12, scale);
  const to = panelKeyFor(newRoot, scale).key;
  const moved = transposeProgression(readChords(symbols), from, to);
  return { root: newRoot, key: to, symbols: moved.map(symbolFor).filter((s): s is string => !!s) };
}

// ─── The key line ─────────────────────────────────────────────────────────

/** What the line says about one key (or two that nothing tells apart). */
export interface FitStatement {
  keys: MusicKey[];
  /** Chord positions that fit (repeats counted each time — what the chips show). */
  fit: number;
  total: number;
  /** The chords that do not fit, once each, in order, as read in the first key. */
  outside: Chord[];
}

export interface KeyLine {
  current: FitStatement;
  /** Another key (or two tied) that fits more of the chords, or null. */
  better: FitStatement | null;
}

const samePcKey = (a: MusicKey, b: MusicKey) => a.mode === b.mode && getPitchClass(a.root) === getPitchClass(b.root);

/** The run of candidates that nothing tells apart, starting at `i`. */
function tiedRun(cands: readonly KeyCandidate[], i: number): KeyCandidate[] {
  let start = i;
  while (start > 0 && cands[start - 1].tiesWithNext) start--;
  const out = [cands[start]];
  for (let j = start; j < cands.length - 1 && cands[j].tiesWithNext; j++) out.push(cands[j + 1]);
  return out;
}

const positionsFit = (infos: readonly ChordInKey[]) => infos.filter((c) => c.fits !== 'outside').length;

function outsideOf(infos: readonly ChordInKey[]): Chord[] {
  const seen = new Set<string>();
  const out: Chord[] = [];
  for (const info of infos) {
    if (info.fits !== 'outside') continue;
    const id = chordLinkSymbol(info.chord) ?? `${getPitchClass(info.chord.root)}:${info.chord.quality}`;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(info.chord);
  }
  return out;
}

/**
 * The truth about the key, for the chords as they stand:
 *  - `current`: how many fit Explore's key (the panel key); when it is among
 *    the best-ranked keys and another ties with it (nothing tells them apart,
 *    `tiesWithNext`), both are named;
 *  - `better`: the best-ranked key when it fits more DIFFERENT chords and
 *    more of the positions (so the line never says "more" of a key that
 *    fits fewer chips); a tied pair is named together. Capped at two keys.
 * Null for no chords.
 */
export function keyLine(chords: readonly Chord[], key: MusicKey): KeyLine | null {
  if (chords.length === 0) return null;
  const cands = findKeys(chords);
  const infos = chords.map((c) => chordInKey(c, key));
  const idx = cands.findIndex((c) => samePcKey(c.key, key));
  const cur = cands[idx];
  const curKeys: MusicKey[] = [key];
  // A tie is named only among the best-ranked keys: one G chord fits many
  // keys equally, and naming two of them would say less than the truth.
  const run = cur ? tiedRun(cands, idx) : [];
  if (cur && run[0] === cands[0]) {
    for (const other of run) {
      if (!samePcKey(other.key, key) && curKeys.length < 2) curKeys.push(other.key);
    }
  }
  const current: FitStatement = { keys: curKeys, fit: positionsFit(infos), total: chords.length, outside: outsideOf(infos) };
  let better: FitStatement | null = null;
  const best = cands[0];
  if (best && cur && best.fitCount > cur.fitCount && positionsFit(best.chords) > current.fit) {
    const run = tiedRun(cands, 0).slice(0, 2);
    better = { keys: run.map((c) => c.key), fit: positionsFit(best.chords), total: chords.length, outside: outsideOf(best.chords) };
  }
  return { current, better };
}

// ─── Capo (guitar) ────────────────────────────────────────────────────────

/**
 * With a capo on `fret`, the shapes to play for these chords (fret 0: the
 * chords themselves). Named by the fretboard's own rule (`chordBelowCapo`), so
 * this line and the neck's "B♭: the G shape, capo on fret 3" agree chord by
 * chord (integration seam 3). `_key` is kept for the callers' shape of call.
 */
export function capoShapes(chords: readonly Chord[], _key: MusicKey, fret: number): Chord[] {
  if (fret <= 0) return [...chords];
  return chords.map((c) => chordBelowCapo(c, fret));
}

/**
 * Up to three capo ideas: frets 1–7 whose shapes have more open grips than
 * playing without a capo, best first (the engine's ranking: all open, then
 * more open shapes, then the lower fret). None when no capo helps.
 */
export function capoIdeas(chords: readonly Chord[], key: MusicKey): CapoOption[] {
  if (chords.length === 0) return [];
  const options = capoOptions(chords, key);
  const none = options.find((o) => o.fret === 0);
  const base = none?.openCount ?? 0;
  return options.filter((o) => o.fret > 0 && o.openCount > base).slice(0, 3);
}

// ─── Common progressions ──────────────────────────────────────────────────

export interface PresetView {
  preset: ProgressionPreset;
  /** The key the chords are shown in: the panel key, or its relative for a preset of the other mode. */
  key: MusicKey;
  /** The preset's key differs from the panel key (the line names it). */
  relative: boolean;
  chords: Chord[];
}

/** The relative key: minor on the major's 6th, major on the minor's 3rd, spelled from the key's own scale. */
export function relativeKey(key: MusicKey): MusicKey {
  const scale = keyScale(key);
  return key.mode === 'major' ? { root: scale[5], mode: 'minor' } : { root: scale[2], mode: 'major' };
}

/**
 * Every preset in the panel's key: a preset of the key's own mode on its
 * tonic; one of the other mode on the RELATIVE key (whose chords are the same
 * key's chords: in G major, i–VII–VI–VII is shown as Em D C D in E minor).
 */
export function presetViews(key: MusicKey): PresetView[] {
  const rel = relativeKey(key);
  return PROGRESSION_PRESETS.map((preset) => {
    const own = preset.mode === key.mode;
    const k = own ? key : rel;
    return { preset, key: k, relative: !own, chords: presetChords(preset, k) };
  });
}

// ─── "Another chord" ──────────────────────────────────────────────────────

/** The kinds the "Another chord" sheet offers, in its order. */
export const CHORD_KINDS = ['major', 'minor', 'dominant7', 'minor7', 'major7', 'sus4', 'sus2', 'diminished'] as const;
export type ChordKind = (typeof CHORD_KINDS)[number];

/** Black keys outside the key: the everyday mixed names (D♭ E♭ F♯ A♭ B♭), as chord charts spell them. */
const MIXED_NAMES: Record<number, Note> = {
  1: { natural: 'D', accidental: 'b' }, 3: { natural: 'E', accidental: 'b' }, 6: { natural: 'F', accidental: '#' },
  8: { natural: 'A', accidental: 'b' }, 10: { natural: 'B', accidental: 'b' },
};
const NATURALS: Record<number, Note['natural']> = { 0: 'C', 2: 'D', 4: 'E', 5: 'F', 7: 'G', 9: 'A', 11: 'B' };

/**
 * The twelve roots for the sheet, C first: the key's own notes as the key
 * spells them (F♯ in G major, E♯ in C♯ major), the other notes by their
 * everyday names (B♭ in G major reads as ♭III, never ♯II).
 */
export function sheetRoots(key: MusicKey): Note[] {
  const scale = keyScale(key);
  return Array.from({ length: 12 }, (_, pc) => {
    const own = scale.find((n) => getPitchClass(n) === pc && n.accidental.length < 2);
    if (own) return own;
    const natural = NATURALS[pc];
    return natural ? { natural, accidental: '' } : MIXED_NAMES[pc];
  });
}
