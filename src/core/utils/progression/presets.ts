/**
 * Common progressions, as degrees of a key. No display names (the panel names
 * them) and no song titles: nothing here claims what a real song uses.
 *
 * The twelve-bar blues is the basic form with dominant sevenths throughout:
 * I7 I7 I7 I7 | IV7 IV7 I7 I7 | V7 IV7 I7 V7 (Wikipedia, "Twelve-bar blues",
 * the basic layout I I I I / IV IV I I / V IV I V, and "Dominant 7th chords
 * are generally used throughout a blues progression"; accessed 2026-11-10).
 *
 * The minor presets are numbered as the app numbers natural minor
 * (`getDiatonicChordsForScale`): its own 6th and 7th chords are VI and VII,
 * without a ♭ (A minor: Am G F G = i VII VI VII).
 */

import type { Chord, ChordQuality } from '../../types/music';
import { buildChord } from '../../constants/chords';
import { getPitchClass, getSimplestSpelling } from '../../constants/notes';
import { spellOnLetter } from '../degreeSpelling';
import { keyScale } from './key';
import type { MusicKey, PresetStep, ProgressionPreset } from './types';

const step = (degree: number, quality: ChordQuality, alteration = 0): PresetStep => ({ degree, alteration, quality });

const I = step(1, 'major');
const ii = step(2, 'minor');
const IV = step(4, 'major');
const V = step(5, 'major');
const vi = step(6, 'minor');
const I7 = step(1, 'dominant7');
const IV7 = step(4, 'dominant7');
const V7 = step(5, 'dominant7');
const i = step(1, 'minor');
const iv = step(4, 'minor');
const v = step(5, 'minor');
const VI = step(6, 'major');
const VII = step(7, 'major');

export const PROGRESSION_PRESETS: readonly ProgressionPreset[] = [
  { id: 'I-IV-V', mode: 'major', numerals: ['I', 'IV', 'V'], steps: [I, IV, V] },
  { id: 'I-V-vi-IV', mode: 'major', numerals: ['I', 'V', 'vi', 'IV'], steps: [I, V, vi, IV] },
  { id: 'I-vi-IV-V', mode: 'major', numerals: ['I', 'vi', 'IV', 'V'], steps: [I, vi, IV, V] },
  { id: 'vi-IV-I-V', mode: 'major', numerals: ['vi', 'IV', 'I', 'V'], steps: [vi, IV, I, V] },
  { id: 'ii-V-I', mode: 'major', numerals: ['ii', 'V', 'I'], steps: [ii, V, I] },
  {
    id: 'twelve-bar-blues',
    mode: 'major',
    numerals: ['I7', 'I7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'],
    steps: [I7, I7, I7, I7, IV7, IV7, I7, I7, V7, IV7, I7, V7],
  },
  { id: 'i-VII-VI-VII', mode: 'minor', numerals: ['i', 'VII', 'VI', 'VII'], steps: [i, VII, VI, VII] },
  { id: 'i-iv-v', mode: 'minor', numerals: ['i', 'iv', 'v'], steps: [i, iv, v] },
];

/** A preset by id. */
export function getPreset(id: ProgressionPreset['id']): ProgressionPreset {
  const preset = PROGRESSION_PRESETS.find((p) => p.id === id);
  if (!preset) throw new Error(`Unknown progression preset: ${id}`);
  return preset;
}

/**
 * The chords of a preset on a key's tonic, spelled in that key. The preset's
 * own mode is used: a minor preset asked for in G major gives the chords of
 * G minor (the same tonic), so pass the key you mean.
 *
 *   presetChords(getPreset('I-V-vi-IV'), G major) → G, D, Em, C
 */
export function presetChords(preset: ProgressionPreset, key: MusicKey): Chord[] {
  const scale = keyScale({ root: key.root, mode: preset.mode });
  return preset.steps.map((s) => {
    const scaleNote = scale[s.degree - 1];
    const pc = getPitchClass(scaleNote) + s.alteration;
    const root = s.alteration === 0 ? scaleNote : (spellOnLetter(pc, scaleNote.natural) ?? getSimplestSpelling(((pc % 12) + 12) % 12 as Parameters<typeof getSimplestSpelling>[0]));
    return buildChord(root, s.quality);
  });
}
