/**
 * The number of a chord in a key (`chordInKey`): its Roman numeral, read from
 * the SPELLING of its root (in G major F is ♭VII and C♯ is ♯IV), and whether
 * its notes are the key's own.
 *
 * Numeral conventions are the app's (`getDiatonicChordsForScale`): upper case
 * for a major-type chord, lower case for a minor-type one, ° diminished,
 * ø half-diminished, + augmented, then the chord's own suffix (V7, ii7, Imaj7,
 * Vsus4, vii°, viiø7). In a minor key the degrees are read against NATURAL
 * minor, so its own III, VI and VII carry no ♭ (A minor: C = III, G = VII),
 * exactly as the app's diatonic chords for natural minor are numbered.
 */

import type { Chord, ChordQuality, Note } from '../../types/music';
import { getPitchClass, getSimplestSpelling } from '../../constants/notes';
import { chordFromParsed } from '../chordParser';
import { type Degree, letterAbove, letterDistance, spellOnLetter } from '../degreeSpelling';
import { keyScale } from './key';
import type { ChordFamily, ChordFit, ChordInKey, ChordInput, MusicKey } from './types';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;

/** Family (numeral case / mark) and numeral suffix of every explicit chord quality. */
const QUALITY_NUMERAL: Record<ChordQuality, readonly [ChordFamily, string]> = {
  major: ['major', ''],
  minor: ['minor', ''],
  diminished: ['diminished', '°'],
  augmented: ['augmented', '+'],
  major6: ['major', '6'],
  minor6: ['minor', '6'],
  major7: ['major', 'maj7'],
  minor7: ['minor', '7'],
  dominant7: ['major', '7'],
  diminished7: ['diminished', '°7'],
  half_diminished7: ['diminished', 'ø7'],
  augmented7: ['augmented', '+7'],
  sus2: ['neutral', 'sus2'],
  sus4: ['neutral', 'sus4'],
  add9: ['major', 'add9'],
  minor_major7: ['minor', 'maj7'],
  power: ['neutral', '5'],
  dominant7sus4: ['neutral', '7sus4'],
  major9: ['major', 'maj9'],
  minor9: ['minor', '9'],
  dominant9: ['major', '9'],
  dominant7flat9: ['major', '7♭9'],
  dominant7sharp9: ['major', '7♯9'],
  dominant7flat5: ['major', '7♭5'],
  dominant7sharp5: ['augmented', '7♯5'],
  dominant7alt: ['major', '7alt'],
  dominant11: ['major', '11'],
  major11: ['major', 'maj11'],
  minor11: ['minor', '11'],
  dominant9sharp11: ['major', '9♯11'],
  dominant7sharp11: ['major', '7♯11'],
  major9sharp11: ['major', 'maj9♯11'],
  dominant13: ['major', '13'],
  major13: ['major', 'maj13'],
  minor13: ['minor', '13'],
  dominant13flat9: ['major', '13♭9'],
  dominant7flat13: ['major', '7♭13'],
  add11: ['major', 'add11'],
  six_nine: ['major', '6/9'],
  minor_six_nine: ['minor', '6/9'],
  dominant9sus4: ['neutral', '9sus4'],
  sus2sus4: ['neutral', 'sus2sus4'],
  augmented_major7: ['augmented', '+maj7'],
  major7flat5: ['major', 'maj7♭5'],
  diminished_major7: ['diminished', '°maj7'],
  major7sharp11: ['major', 'maj7♯11'],
  dominant7sharp5flat9: ['augmented', '7♯5♭9'],
  dominant7flat5flat9: ['major', '7♭5♭9'],
  dominant7sharp5sharp9: ['augmented', '7♯5♯9'],
  dominant7flat5sharp9: ['major', '7♭5♯9'],
};

/** The family a chord quality belongs to. */
export function chordFamily(quality: ChordQuality): ChordFamily {
  return QUALITY_NUMERAL[quality][0];
}

/**
 * The family of a chord. An algorithmic chord's `quality` is only the closest
 * explicit one (the parser maps Cm(add9) to 'add9'), so its family is read
 * from its notes: a major 3rd → major (augmented with a ♯5 and no 5th), else a
 * minor 3rd → minor (diminished with a ♭5 and no 5th), else neutral.
 */
export function familyOf(chord: Chord): ChordFamily {
  if (!chord.algorithmicDisplayName) return chordFamily(chord.quality);
  const root = getPitchClass(chord.root);
  const has = new Set(chord.notes.map((n) => (getPitchClass(n) - root + 12) % 12));
  if (has.has(4)) return has.has(8) && !has.has(7) ? 'augmented' : 'major';
  if (has.has(3)) return has.has(6) && !has.has(7) ? 'diminished' : 'minor';
  return 'neutral';
}

/**
 * The degree of a spelled note in a key: the number from the letter distance
 * to the tonic, the alteration against the KEY'S OWN scale note on that letter
 * (natural minor for a minor key: C in A minor is 3, G♯ is ♯7; in G major
 * F is ♭7, C♯ is ♯4).
 */
export function degreeInKey(key: MusicKey, note: Note): Degree {
  const number = letterDistance(key.root.natural, note.natural) + 1;
  const scaleNote = keyScale(key)[number - 1];
  let alteration = (getPitchClass(note) - getPitchClass(scaleNote) + 12) % 12;
  if (alteration > 6) alteration -= 12;
  return { number, alteration };
}

const noteText = (n: Note): string => `${n.natural}${n.accidental}`;
const glyphs = (s: string): string => s.replace(/#/g, '♯').replace(/b(?=\d)/g, '♭');

/**
 * The numeral suffix of an algorithmic chord (one the parser built from its
 * symbol, e.g. "Cm(add9)"): its name without root and bass, with the family's
 * own mark moved into the numeral's case (m → lower case, dim → °, aug → +).
 */
function algorithmicSuffix(chord: Chord, family: ChordFamily): string {
  let s = chord.algorithmicDisplayName ?? '';
  const root = noteText(chord.root);
  if (s.startsWith(root)) s = s.slice(root.length);
  const slash = s.lastIndexOf('/');
  if (chord.bassNote && slash >= 0 && s.slice(slash + 1) === noteText(chord.bassNote)) s = s.slice(0, slash);
  if (s.startsWith('dim')) s = `°${s.slice(3)}`;
  else if (s.startsWith('aug')) s = `+${s.slice(3)}`;
  else if (family === 'minor' && s.startsWith('m') && !/^ma/i.test(s)) s = s.slice(1);
  return glyphs(s);
}

/** Turn whatever the caller holds into a `Chord` with its notes. */
export function toChord(input: ChordInput): Chord {
  return 'notes' in input ? input : chordFromParsed(input);
}

/** Numeral for a root degree in a key (`degreeInKey`) and a chord, e.g. ({7, −1}, B♭7 in C major) → "♭VII7". */
export function numeralFor(degree: Degree, chord: Chord): string {
  const suffix = QUALITY_NUMERAL[chord.quality][1];
  const family = familyOf(chord);
  const base = ROMAN[(degree.number - 1) % 7];
  const prefix = degree.alteration < 0 ? '♭'.repeat(-degree.alteration) : '♯'.repeat(degree.alteration);
  const cased = family === 'minor' || family === 'diminished' ? base.toLowerCase() : base;
  const tail = chord.algorithmicDisplayName ? algorithmicSuffix(chord, family) : suffix;
  return `${prefix}${cased}${tail}`;
}

/** The same pitch, `steps` letters up (spelled on that letter; the simplest name past a double accidental). */
function moveLetter(note: Note, steps: number): Note {
  const pc = getPitchClass(note);
  return spellOnLetter(pc, letterAbove(note.natural, steps)) ?? getSimplestSpelling(pc);
}

/** Respell a whole chord so its root takes `rootLetter`, every note moving by the same number of letters. */
function respellChord(chord: Chord, root: Note): Chord {
  const steps = letterDistance(chord.root.natural, root.natural);
  const out: Chord = {
    ...chord,
    root,
    notes: chord.notes.map((n) => moveLetter(n, steps)),
  };
  if (chord.bassNote) out.bassNote = moveLetter(chord.bassNote, steps);
  if (chord.algorithmicDisplayName) out.algorithmicDisplayName = renameAlgorithmic(chord, out);
  return out;
}

/** An algorithmic chord's display name with the root and bass of `moved`. */
export function renameAlgorithmic(original: Chord, moved: Chord): string {
  let s = original.algorithmicDisplayName ?? '';
  const root = noteText(original.root);
  if (s.startsWith(root)) s = noteText(moved.root) + s.slice(root.length);
  if (original.bassNote && moved.bassNote) {
    const bass = `/${noteText(original.bassNote)}`;
    if (s.endsWith(bass)) s = s.slice(0, -bass.length) + `/${noteText(moved.bassNote)}`;
  }
  return s;
}

/** Every note the chord sounds, the slash bass included. */
function soundingNotes(chord: Chord): Note[] {
  const notes = [...chord.notes];
  if (chord.bassNote && !notes.some((n) => getPitchClass(n) === getPitchClass(chord.bassNote!))) {
    notes.unshift(chord.bassNote);
  }
  return notes;
}

/**
 * The number of `chord` in `key`, and how it fits.
 *
 *   chordInKey(parseChordSymbol('G7')!, { root: G, mode: 'major' })
 *     → { numeral: 'I7', fits: 'outside', outsideNotes: [F], … }
 *   chordInKey(parseChordSymbol('E7')!, { root: A, mode: 'minor' })
 *     → { numeral: 'V7', fits: 'harmonicMinor', outsideNotes: [G♯], … }
 */
export function chordInKey(input: ChordInput, key: MusicKey): ChordInKey {
  const original = toChord(input);
  const scale = keyScale(key);
  const scalePcs = new Set(scale.map(getPitchClass));

  // A root that is an enharmonic of a key note (C♯ typed in D♭ major) is read
  // as that note; any other root keeps its spelling, which sets the ♭ / ♯.
  const rootPc = getPitchClass(original.root);
  const keyNote = scale.find((n) => getPitchClass(n) === rootPc);
  const respelled = !!keyNote && keyNote.natural !== original.root.natural;
  const chord = respelled ? respellChord(original, keyNote) : original;

  const degree = degreeInKey(key, chord.root);
  const numeral = numeralFor(degree, chord);
  const family = familyOf(chord);

  const outside = soundingNotes(chord).filter((n) => !scalePcs.has(getPitchClass(n)));
  let fits: ChordFit = outside.length === 0 ? 'key' : 'outside';
  if (fits === 'outside' && key.mode === 'minor' && isMajorDominant(chord, degree)) {
    const raised7 = (getPitchClass(key.root) + 11) % 12;
    if (outside.every((n) => getPitchClass(n) === raised7)) fits = 'harmonicMinor';
  }

  const bass = chord.bassNote
    ? { note: chord.bassNote, degreeInKey: degreeInKey(key, chord.bassNote), chordTone: isChordTone(chord, chord.bassNote) }
    : null;

  return { numeral, degree, family, fits, outsideNotes: outside, bass, chord, respelled };
}

/**
 * Is the note one of the chord's own tones? `chordFromParsed` puts a slash bass
 * that is not a chord tone FIRST in `notes` (C/F♯ → F♯ C E G); such a leading
 * bass is not counted.
 */
function isChordTone(chord: Chord, note: Note): boolean {
  const pc = getPitchClass(note);
  const first = chord.notes[0];
  const prepended = !!first && getPitchClass(first) === pc && pc !== getPitchClass(chord.root);
  return (prepended ? chord.notes.slice(1) : chord.notes).some((n) => getPitchClass(n) === pc);
}

/** The major V or V7 (root on the unaltered 5th; exactly a major triad or a dominant 7th). */
function isMajorDominant(chord: Chord, degree: Degree): boolean {
  return (
    degree.number === 5 &&
    degree.alteration === 0 &&
    !chord.algorithmicDisplayName &&
    (chord.quality === 'major' || chord.quality === 'dominant7')
  );
}
