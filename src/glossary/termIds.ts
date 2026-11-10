/**
 * The glossary's term ids (wave 1, brief C) — eager and tiny: the
 * components mark the words they show with these ids (`<Term id>` for a
 * plain label the learner can tap, `data-term` on a word inside a button),
 * and "Words on this screen" lists the marked words that are visible.
 *
 * The explanations themselves (text, worked examples, sound demonstrations)
 * live in the lazy glossary chunk: `glossary/entries.ts` + `i18n/glossary/`.
 */
import type { ChordQuality, ScaleType } from '../core/types/music.ts';
import { SCALE_FORMULAS } from '../core/constants/scales.ts';

export const BASE_TERM_IDS = [
  // Keys and scales
  'key', 'scale', 'root', 'keySignature', 'sharpFlat', 'halfStep', 'octave', 'staff', 'interval', 'tritone',
  'relativeKey', 'dominantKey', 'subdominantKey', 'parentKey', 'circleOfFifths', 'relatedKeys', 'mode',
  'classicalMinor', 'writtenOctave',
  // Scale degrees and their names
  'degree', 'tonic', 'supertonic', 'mediant', 'subdominant', 'dominant', 'submediant', 'leadingNote', 'subtonic', 'augFifth',
  // Chords
  'chord', 'chordsInKey', 'romanNumeral', 'triad', 'majorChord', 'minorChord', 'diminishedChord', 'augmentedChord',
  'seventhChord', 'dominantSeventh', 'majorSeventh', 'minorSeventh', 'halfDiminished', 'diminishedSeventh',
  'sixthChord', 'susChord', 'powerChord', 'addedNote', 'extendedChord', 'alteredChord',
  'inversion', 'formula', 'arpeggio', 'compatibleScales', 'slashChord', 'outOfKey',
  // Guitar (the dock and the practice sheet)
  'fret', 'position', 'fingerNumbers', 'stretch', 'tuning', 'anchorFret',
  'tirandoApoyando', 'rightHandFingers', 'positionWalk', 'technicalSet', 'intervalScale', 'brokenChord',
] as const;

export type BaseTermId = (typeof BASE_TERM_IDS)[number];
export type ScaleTermId = `scale_${ScaleType}`;
export type TermId = BaseTermId | ScaleTermId;

export const SCALE_TERM_IDS: readonly ScaleTermId[] = (Object.keys(SCALE_FORMULAS) as ScaleType[]).map((s) => `scale_${s}` as const);
export const TERM_IDS: readonly TermId[] = [...BASE_TERM_IDS, ...SCALE_TERM_IDS];

export function isTermId(id: string): id is TermId {
  return (TERM_IDS as readonly string[]).includes(id);
}

/** A scale's own entry ("Mixolydian"). */
export function scaleTermId(type: ScaleType): ScaleTermId {
  return `scale_${type}`;
}

/** A degree-function label key (`degreeShort.leading`, `explore.fn.leading`) → its entry. */
export function functionTermId(fnKey: string): TermId | null {
  const name = fnKey.slice(fnKey.lastIndexOf('.') + 1);
  switch (name) {
    case 'tonic': return 'tonic';
    case 'supertonic': return 'supertonic';
    case 'mediant': return 'mediant';
    case 'subdominant': return 'subdominant';
    case 'dominant': return 'dominant';
    case 'submediant': return 'submediant';
    case 'leading': return 'leadingNote';
    case 'subtonic': return 'subtonic';
    case 'tritone': return 'tritone';
    case 'augFifth': return 'augFifth';
    default: return null;
  }
}

/** Every chord quality is explained by its family's entry. */
export const QUALITY_TERM: Record<ChordQuality, TermId> = {
  major: 'majorChord',
  minor: 'minorChord',
  diminished: 'diminishedChord',
  augmented: 'augmentedChord',
  major6: 'sixthChord',
  minor6: 'sixthChord',
  six_nine: 'sixthChord',
  minor_six_nine: 'sixthChord',
  major7: 'majorSeventh',
  minor7: 'minorSeventh',
  dominant7: 'dominantSeventh',
  diminished7: 'diminishedSeventh',
  half_diminished7: 'halfDiminished',
  augmented7: 'seventhChord',
  minor_major7: 'seventhChord',
  diminished_major7: 'seventhChord',
  augmented_major7: 'alteredChord',
  major7flat5: 'alteredChord',
  sus2: 'susChord',
  sus4: 'susChord',
  dominant7sus4: 'susChord',
  dominant9sus4: 'susChord',
  sus2sus4: 'susChord',
  power: 'powerChord',
  add9: 'addedNote',
  add11: 'addedNote',
  major9: 'extendedChord',
  minor9: 'extendedChord',
  dominant9: 'extendedChord',
  dominant11: 'extendedChord',
  major11: 'extendedChord',
  minor11: 'extendedChord',
  dominant13: 'extendedChord',
  major13: 'extendedChord',
  minor13: 'extendedChord',
  dominant7flat9: 'alteredChord',
  dominant7sharp9: 'alteredChord',
  dominant7flat5: 'alteredChord',
  dominant7sharp5: 'alteredChord',
  dominant7alt: 'alteredChord',
  dominant13flat9: 'alteredChord',
  dominant7flat13: 'alteredChord',
  dominant9sharp11: 'alteredChord',
  dominant7sharp11: 'alteredChord',
  major9sharp11: 'alteredChord',
  major7sharp11: 'alteredChord',
  dominant7sharp5flat9: 'alteredChord',
  dominant7flat5flat9: 'alteredChord',
  dominant7sharp5sharp9: 'alteredChord',
  dominant7flat5sharp9: 'alteredChord',
};

export function qualityTermId(quality: ChordQuality): TermId {
  return QUALITY_TERM[quality];
}

/** The All Chords categories (ChordBrowser `chordCategory.*`). */
export const CATEGORY_TERM: Record<string, TermId> = {
  'chordCategory.triads': 'triad',
  'chordCategory.sixths': 'sixthChord',
  'chordCategory.sevenths': 'seventhChord',
  'chordCategory.sus': 'susChord',
  'chordCategory.power': 'powerChord',
  'chordCategory.ninths': 'extendedChord',
  'chordCategory.altDom': 'alteredChord',
  'chordCategory.elevenths': 'extendedChord',
  'chordCategory.thirteenths': 'extendedChord',
};
