/**
 * Which keys fit a list of chords (`findKeys`). One list of chords can fit
 * several keys — a key and its relative share all their notes — so this ranks
 * the 24 major and minor keys and says where nothing tells two apart. The
 * caller says "fits", never "is".
 *
 * Ranking, best first:
 *   1. how many DIFFERENT chords fit (`key`, or `harmonicMinor` in a minor
 *      key) — repeats count once, so a twelve-bar blues's seven bars of I7 do
 *      not outvote its V7;
 *   2. how many signs of the tonic hold (first chord is I / i, last chord is,
 *      a major V(7) → I / i step, the tonic chord is present), then the same
 *      signs compared in that order (the first chord weighs most);
 *   3. nothing left to tell them apart (`tiesWithNext`): the major first, then
 *      the smaller key signature, then the lower pitch class.
 * The tonic chord of a major key is a major-type chord on its tonic (I, I7,
 * Imaj7 …), of a minor key a minor-type one (i, i7 …); a chord without a
 * third (sus, power) counts for both.
 */

import type { Note } from '../../types/music';
import { getPitchClass } from '../../constants/notes';
import { enharmonicRootAlternative, majorKeySignature, parentMajorKey } from '../degreeSpelling';
import { chordInKey, toChord } from './chordInKey';
import { keyScale, pickerRoot, scaleTypeOf } from './key';
import type { ChordInKey, ChordInput, KeyCandidate, KeyMode, MusicKey, TonicSigns } from './types';

const MODES: readonly KeyMode[] = ['major', 'minor'];

/** Identity of a chord for counting repeats once: what sounds, the root and the bass. */
function chordIdentity(info: ChordInKey): string {
  const c = info.chord;
  const pcs = [...new Set(c.notes.map(getPitchClass))].sort((a, b) => a - b).join(',');
  return `${getPitchClass(c.root)}|${pcs}|${c.bassNote ? getPitchClass(c.bassNote) : ''}`;
}

/** Is this chord the tonic chord of the key? */
function isTonicChord(info: ChordInKey, key: MusicKey): boolean {
  if (getPitchClass(info.chord.root) !== getPitchClass(key.root)) return false;
  if (info.family === 'neutral') return true;
  return key.mode === 'major' ? info.family === 'major' : info.family === 'minor';
}

/** A major-type chord on the key's 5th (V, V7, V9 …). */
function isMajorFive(info: ChordInKey, key: MusicKey): boolean {
  return getPitchClass(info.chord.root) === (getPitchClass(key.root) + 7) % 12 && info.family === 'major';
}

function signsFor(infos: readonly ChordInKey[], key: MusicKey): TonicSigns {
  const tonic = infos.map((i) => isTonicChord(i, key));
  let dominantToTonic = false;
  for (let i = 0; i + 1 < infos.length; i++) {
    if (isMajorFive(infos[i], key) && tonic[i + 1]) dominantToTonic = true;
  }
  return {
    firstIsTonic: tonic[0] ?? false,
    lastIsTonic: tonic[tonic.length - 1] ?? false,
    dominantToTonic,
    tonicPresent: tonic.some(Boolean),
  };
}

const signVector = (s: TonicSigns): number[] =>
  [s.firstIsTonic, s.lastIsTonic, s.dominantToTonic, s.tonicPresent].map(Number);

/** How many of the typed notes the key's scale spells exactly as typed. */
function spellingAgreement(root: Note, mode: KeyMode, typed: readonly Note[]): number {
  const scale = keyScale({ root, mode });
  return typed.filter((t) =>
    scale.some((n) => n.natural === t.natural && n.accidental === t.accidental),
  ).length;
}

const isDouble = (n: Note): boolean => n.accidental === '##' || n.accidental === 'bb';

/**
 * The root for a pitch class and mode: the key picker's spelling, unless its
 * other everyday name (C♯ for D♭) spells MORE of the typed notes as typed.
 * The other name is never taken when its scale needs double sharps or flats
 * (D♯ major, D♭ minor) and the chords as typed have none. Only the two
 * everyday names of a black key are weighed: chords typed in C♭ or B♯ are
 * read in B or C.
 */
function candidateRoot(pc: number, mode: KeyMode, typed: readonly Note[]): Note {
  const preferred = pickerRoot(pc, mode);
  const other = enharmonicRootAlternative(preferred);
  if (!other) return preferred;
  if (keyScale({ root: other, mode }).some(isDouble) && !typed.some(isDouble)) return preferred;
  return spellingAgreement(other, mode, typed) > spellingAgreement(preferred, mode, typed) ? other : preferred;
}

/** Size of the key signature (the parent major's: A minor → C major). */
function signatureSize(key: MusicKey): number {
  const parent = parentMajorKey(key.root, scaleTypeOf(key.mode)) ?? key.root;
  return majorKeySignature(parent).count;
}

/**
 * Rank the 24 major and minor keys for a list of chords.
 *
 *   findKeys(['G', 'D', 'Em', 'C'].map((s) => parseChordSymbol(s)!))
 *     → [G major (4 of 4 fit, signs: first, present), E minor (4 of 4, present), …]
 *
 * An empty list returns []: no chords, nothing to fit. A single chord returns
 * all 24 keys, the keys whose tonic chord it is first.
 */
export function findKeys(inputs: readonly ChordInput[]): KeyCandidate[] {
  if (inputs.length === 0) return [];
  const chords = inputs.map(toChord);
  const typed: Note[] = [];
  for (const c of chords) {
    typed.push(c.root, ...c.notes);
    if (c.bassNote) typed.push(c.bassNote);
  }

  type Scored = Omit<KeyCandidate, 'tiesWithNext'> & { vector: number[]; sig: number };
  const scored: Scored[] = [];
  for (const mode of MODES) {
    for (let pc = 0; pc < 12; pc++) {
      const key: MusicKey = { root: candidateRoot(pc, mode, typed), mode };
      const infos = chords.map((c) => chordInKey(c, key));
      const fitting = new Set<string>();
      const all = new Set<string>();
      const outsideIndexes: number[] = [];
      infos.forEach((info, i) => {
        const id = chordIdentity(info);
        all.add(id);
        if (info.fits === 'outside') outsideIndexes.push(i);
        else fitting.add(id);
      });
      const signs = signsFor(infos, key);
      const vector = signVector(signs);
      scored.push({
        key,
        chords: infos,
        fitCount: fitting.size,
        distinctCount: all.size,
        outsideIndexes,
        signs,
        signCount: vector.reduce((a, b) => a + b, 0),
        vector,
        sig: signatureSize(key),
      });
    }
  }

  const sameRank = (a: Scored, b: Scored): boolean =>
    a.fitCount === b.fitCount && a.vector.every((v, i) => v === b.vector[i]);

  scored.sort((a, b) => {
    if (a.fitCount !== b.fitCount) return b.fitCount - a.fitCount;
    if (a.signCount !== b.signCount) return b.signCount - a.signCount;
    for (let i = 0; i < a.vector.length; i++) {
      if (a.vector[i] !== b.vector[i]) return b.vector[i] - a.vector[i];
    }
    if (a.key.mode !== b.key.mode) return a.key.mode === 'major' ? -1 : 1;
    if (a.sig !== b.sig) return a.sig - b.sig;
    return getPitchClass(a.key.root) - getPitchClass(b.key.root);
  });

  return scored.map(({ vector: _vector, sig: _sig, ...rest }, i) => ({
    ...rest,
    tiesWithNext: i + 1 < scored.length && sameRank(scored[i], scored[i + 1]),
  }));
}
