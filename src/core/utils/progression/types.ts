/**
 * Types of the progression engine (wave 2, stream S): the key a list of
 * chords fits, the number of each chord in it, the same chords moved, capo
 * ideas and common progressions. Plain data only — no display sentences.
 */

import type { Chord, Note } from '../../types/music';
import type { ParsedChord } from '../chordParser';
import type { Degree } from '../degreeSpelling';

/** The two modes a key has here (minor = natural minor, see `ChordFit`). */
export type KeyMode = 'major' | 'minor';

/** A key: a tonic and a mode. */
export interface MusicKey {
  readonly root: Note;
  readonly mode: KeyMode;
}

/** What the parser gives (`parseChordSymbol`) or a built `Chord` (`buildChord`, `chordFromParsed`). */
export type ChordInput = ParsedChord | Chord;

/**
 * How a chord sits in a key:
 *  - `key`: every note (the slash bass included) is one of the key's notes;
 *  - `harmonicMinor`: the major V or V7 of a minor key (E or E7 in A minor),
 *    whose raised 7th is the only note outside natural minor;
 *  - `outside`: at least one note is not in the key.
 * Membership is decided by pitch class (what sounds), so an enharmonic
 * spelling (E♯ for F in C major) still fits.
 */
export type ChordFit = 'key' | 'harmonicMinor' | 'outside';

/** Broad family of a chord, which sets the numeral's case and mark. */
export type ChordFamily = 'major' | 'minor' | 'diminished' | 'augmented' | 'neutral';

export interface SlashBass {
  /** The bass as written. */
  readonly note: Note;
  /** Its degree in the key, read as the root's is (see `ChordInKey.degree`). */
  readonly degreeInKey: Degree;
  /** Whether the bass is one of the chord's own notes (an inversion) or not. */
  readonly chordTone: boolean;
}

export interface ChordInKey {
  /** "V7", "♭VII", "ii", "viiø7", "Vsus4", "♯iv°" — never includes the bass. */
  readonly numeral: string;
  /**
   * Degree of the root in the key, read from the root's spelling: the number
   * from the letter, the alteration against the key's own scale note (natural
   * minor in a minor key: G♯ in A minor is {7, +1}).
   */
  readonly degree: Degree;
  /** The chord's family (case of the numeral). */
  readonly family: ChordFamily;
  readonly fits: ChordFit;
  /**
   * `outside`: every note not in the key, as spelled in `chord`. `harmonicMinor`:
   * the raised 7th (the one note outside natural minor). `key`: empty.
   */
  readonly outsideNotes: readonly Note[];
  /** The slash bass, or null. It never changes the numeral. */
  readonly bass: SlashBass | null;
  /**
   * The chord as read in this key. Same as the input, unless the root was an
   * enharmonic of one of the key's notes (C♯ typed in D♭ major): then the chord
   * is respelled on the key's letter (D♭) and `respelled` is true.
   */
  readonly chord: Chord;
  readonly respelled: boolean;
}

/** The signs of the tonic that rank keys sharing the same notes. */
export interface TonicSigns {
  /** The first chord is the key's I (major) / i (minor). */
  readonly firstIsTonic: boolean;
  /** The last chord is. */
  readonly lastIsTonic: boolean;
  /** Somewhere a major-type V (V, V7, V9 …) is followed directly by the tonic chord (no wrap-around). */
  readonly dominantToTonic: boolean;
  /** The tonic chord appears anywhere. */
  readonly tonicPresent: boolean;
}

export interface KeyCandidate {
  readonly key: MusicKey;
  /** One entry per input chord, in input order. */
  readonly chords: readonly ChordInKey[];
  /** How many DIFFERENT chords fit (`key`, or `harmonicMinor` in a minor key). */
  readonly fitCount: number;
  /** How many different chords the list has (repeats counted once). */
  readonly distinctCount: number;
  /** Input positions (0-based) of the chords that do not fit. */
  readonly outsideIndexes: readonly number[];
  readonly signs: TonicSigns;
  /** Number of true signs (0–4). */
  readonly signCount: number;
  /** Same fit count and the same signs as the next candidate: nothing here tells them apart. */
  readonly tiesWithNext: boolean;
}

export interface CapoShape {
  /** The shape to finger (the chord moved down by the capo fret). */
  readonly shape: Chord;
  /** The app's shape library has a playable open grip for it (bass lowest for a slash chord). */
  readonly open: boolean;
}

export interface CapoOption {
  /** 0 = no capo. */
  readonly fret: number;
  /** The key the shapes are in (the key moved down `fret` half steps; `fret` 0 = the key itself). */
  readonly shapeKey: MusicKey;
  /** One entry per input chord, in input order. */
  readonly shapes: readonly CapoShape[];
  /** How many DIFFERENT shapes have an open grip. */
  readonly openCount: number;
  /** How many different shapes there are. */
  readonly distinctCount: number;
  /** Every shape has an open grip. */
  readonly allOpen: boolean;
}

/** One chord of a preset: a degree of the key's own scale, altered, and a quality. */
export interface PresetStep {
  /** 1–7: the degree of the key's scale (major or natural minor). */
  readonly degree: number;
  /** Semitones against that scale degree (−1 = ♭, +1 = ♯); 0 for every preset here. */
  readonly alteration: number;
  readonly quality: Chord['quality'];
}

export type ProgressionPresetId =
  | 'I-IV-V'
  | 'I-V-vi-IV'
  | 'I-vi-IV-V'
  | 'vi-IV-I-V'
  | 'ii-V-I'
  | 'twelve-bar-blues'
  | 'i-VII-VI-VII'
  | 'i-iv-v';

export interface ProgressionPreset {
  readonly id: ProgressionPresetId;
  readonly mode: KeyMode;
  /** The numerals `chordInKey` gives for the preset's chords, in order. */
  readonly numerals: readonly string[];
  readonly steps: readonly PresetStep[];
}
