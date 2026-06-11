/**
 * Context-aware enharmonic spelling for instrument note labels.
 *
 * Both instruments (piano + fretboard) historically labelled every note by its
 * pitch class through a FIXED sharp-default map (`midiToNote`). That is wrong as
 * soon as the selected chord/scale/key spells a pitch class the other way: a
 * Cdim7 (C E♭ G♭ B𝄫) lit the right keys but printed C D♯ F♯ A.
 *
 * This module builds a pitch-class → Note map that respects, in priority order:
 *   a. the SELECTED CHORD's engine spelling (incl. double accidentals);
 *   b. the SELECTED SCALE's engine spelling (buildScale output);
 *   c. the KEY-SIGNATURE bias (flat keys spell black pcs as flats, sharp keys as
 *      sharps), derived from the accidentals the selected scale actually uses;
 *   d. a sharp-default fallback identical to `midiToNote` for anything unset.
 *
 * It is DISPLAY-LABEL only: pitch classes, MIDI numbers, key positions and
 * highlight colours are untouched. The map faithfully carries double accidentals
 * (B𝄫, F𝄪) and natural-as-accidental spellings (C♭, B♯, E♯, F♭) whenever the
 * chord or scale spells them that way.
 */

import type { Note, Chord, Scale, PitchClass } from '../types/music';
import { getPitchClass } from '../constants/notes';

/**
 * Sharp-default spelling for every pitch class. This is byte-for-byte the map
 * `midiToNote` uses, so the no-selection fallback reproduces the pre-existing
 * label behaviour exactly (the regression guard depends on this).
 */
export const SHARP_SPELLING: Record<number, Note> = {
  0: { natural: 'C', accidental: '' },
  1: { natural: 'C', accidental: '#' },
  2: { natural: 'D', accidental: '' },
  3: { natural: 'D', accidental: '#' },
  4: { natural: 'E', accidental: '' },
  5: { natural: 'F', accidental: '' },
  6: { natural: 'F', accidental: '#' },
  7: { natural: 'G', accidental: '' },
  8: { natural: 'G', accidental: '#' },
  9: { natural: 'A', accidental: '' },
  10: { natural: 'A', accidental: '#' },
  11: { natural: 'B', accidental: '' },
};

/**
 * Flat-default spelling for every pitch class. Differs from SHARP_SPELLING only
 * on the five black-key pitch classes (1, 3, 6, 8, 10); naturals are identical.
 */
export const FLAT_SPELLING: Record<number, Note> = {
  0: { natural: 'C', accidental: '' },
  1: { natural: 'D', accidental: 'b' },
  2: { natural: 'D', accidental: '' },
  3: { natural: 'E', accidental: 'b' },
  4: { natural: 'E', accidental: '' },
  5: { natural: 'F', accidental: '' },
  6: { natural: 'G', accidental: 'b' },
  7: { natural: 'G', accidental: '' },
  8: { natural: 'A', accidental: 'b' },
  9: { natural: 'A', accidental: '' },
  10: { natural: 'B', accidental: 'b' },
  11: { natural: 'B', accidental: '' },
};

/**
 * Decide whether remaining (chromatic) pitch classes should be spelled with
 * flats or sharps, from the accidentals the selected scale actually uses.
 *
 * The scale notes are already engine-spelled (buildScale), so they directly
 * reflect the key's flat/sharp character across every mode — F major's scale
 * carries B♭ (flat bias), G major's carries F♯ (sharp bias), D♭ major carries
 * five flats, A major three sharps. A natural-only scale (C major, A natural
 * minor) has no signal and defaults to sharp, matching the legacy fallback.
 *
 * Note: this reads already-built notes rather than re-deriving a key signature,
 * so it is intentionally NOT a reimplementation of drillBank's `keySignatureOf`
 * (which answers a different question — the count/order of a MAJOR key's
 * accidentals). Using the on-screen scale spelling also generalises to minor and
 * modal selections, which a major-only signature lookup would mis-bias.
 */
export function scalePrefersFlats(scaleNotes: Note[]): boolean {
  let flats = 0;
  let sharps = 0;
  for (const n of scaleNotes) {
    if (n.accidental === 'b' || n.accidental === 'bb') flats++;
    else if (n.accidental === '#' || n.accidental === '##') sharps++;
  }
  // Strict majority of flats → flat bias. Ties and all-natural fall through to
  // sharps (legacy default).
  return flats > sharps;
}

/**
 * Build the priority-ordered pitch-class → Note spelling map.
 *
 * @param chord  selected chord (its `.notes` + optional `.bassNote` win)
 * @param scale  selected scale (its `.notes` fill remaining diatonic pcs)
 * @returns a 12-entry Map; every pitch class 0–11 is present.
 */
export function buildSpellingMap(chord: Chord | null, scale: Scale | null): Map<number, Note> {
  const map = new Map<number, Note>();

  // (a) Chord tones — highest priority. First spelling for a pc wins (chord
  // notes are unique per pc in practice; bassNote appended last only fills a pc
  // the chord body didn't already claim).
  if (chord) {
    for (const n of chord.notes) {
      const pc = getPitchClass(n);
      if (!map.has(pc)) map.set(pc, n);
    }
    if (chord.bassNote) {
      const pc = getPitchClass(chord.bassNote);
      if (!map.has(pc)) map.set(pc, chord.bassNote);
    }
  }

  // (b) Scale tones — fill pcs the chord didn't claim.
  if (scale) {
    for (const n of scale.notes) {
      const pc = getPitchClass(n);
      if (!map.has(pc)) map.set(pc, n);
    }
  }

  // (c) + (d) Key-signature bias for everything still unset. The bias picks the
  // flat or sharp table; pcs already spelled by the chord/scale are untouched.
  const preferFlats = scale ? scalePrefersFlats(scale.notes) : false;
  const bias = preferFlats ? FLAT_SPELLING : SHARP_SPELLING;
  for (let pc = 0 as PitchClass; pc < 12; pc++) {
    if (!map.has(pc)) map.set(pc, bias[pc]);
  }

  return map;
}

/**
 * Convenience: resolve a single pitch class against a prebuilt map, falling back
 * to the sharp default if (defensively) the pc is missing.
 */
export function spellFromMap(map: Map<number, Note>, pc: number): Note {
  return map.get(((pc % 12) + 12) % 12) ?? SHARP_SPELLING[((pc % 12) + 12) % 12];
}

/**
 * Stable sharp-default speller — the legacy `midiToNote` letter for a pitch
 * class. Used where there is deliberately NO chord/scale context (e.g. exercise
 * instrument-input mode, where labels must not leak the active key's spelling).
 */
export function spellSharpDefault(pc: number): Note {
  return SHARP_SPELLING[((pc % 12) + 12) % 12];
}
