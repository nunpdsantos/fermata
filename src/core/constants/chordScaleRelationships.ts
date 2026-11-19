/**
 * Chord-Scale Relationships
 *
 * Maps chord qualities to compatible scales for improvisation and harmony
 * guidance (the chord panel's "scales that fit").
 *
 * Based on jazz theory and common practice: each chord quality maps to
 * primary (best fit), secondary, and colour scale choices.
 *
 * Every scale offered holds every tone the chord names (QA report 2 of 18
 * November 2026, P1): a chord-scale is built by writing "all of the notes of
 * the chord (including upper extensions and altered notes)" and filling in
 * between them (Robert Hutchinson, Music Theory for the 21st-Century
 * Classroom, §31.10, https://musictheory.pugetsound.edu/mt21c/HowToDetermineChord-ScaleRelationships.html).
 * A scale tone a half step above a chord tone (an avoid note) is allowed; a
 * scale that puts a neighbour in place of a chord tone is not — whatever its
 * fit. Nine such pairings were removed (each marked below). Three pairings
 * that leave a tone out on purpose stay, each marked `exception` and saying
 * so in its sentence: major pentatonic over maj7 (a subset: no 7th) and the
 * blues scale over 7 and 7♯9 (the blues idiom: its ♭3 for the major 3rd) —
 * the seat's ruling on the review, decision D-14. The blues scale is another
 * kind of suggestion, not a chord-scale: Open Music Theory 2e, §6.7
 * "Chord-Scale Theory" (Gotham et al.), read at
 * https://human.libretexts.org/Bookshelves/Music/Music_Theory/Open_Music_Theory_2e_(Gotham_et_al.)/06%3A_Jazz/6.07%3A_Chord-Scale_Theory
 * on 19 November 2026: "Chord-Scale Theory generally does not account for
 * neighbor tones, passing tones, secondary leading tones, and blue notes".
 * `__tests__/chordScaleRelationships.test.ts` checks the whole table on every
 * root, and `getKeyScaleSuggestions` drops, at run time, any scale that would
 * not hold a chord the parser built with notes of its own or a slash chord's
 * bass (an exception keeps leaving out only its own `lacks`).
 *
 * (Audit W9-17 / C-90: the never-used substitution table — with musically
 * wrong text such as dim7 → half-dim7 "Add minor 7th" and maj7 → maj6
 * "Avoid b7 in melody" — and the unused reverse / mode lookups were deleted
 * rather than left waiting to be wired up.)
 */

import { ChordQuality, ScaleType, Chord, Scale } from '../types/music';

import { getPitchClass } from './notes';
import { SCALE_FORMULAS } from './scales';

// Scale suggestion with context about why it works
export interface ScaleSuggestion {
  scale: ScaleType;
  fit: 'primary' | 'secondary' | 'color'; // How well it fits
  keyNotes?: boolean;
  context?: string; // Optional context about when to use it
  /**
   * A suggestion that does NOT hold every tone the chord names, on purpose
   * (the seat's ruling on the review of P1, 19 November 2026; decision D-14):
   * a five-note subset that leaves a tone out, or the blues idiom, whose ♭3
   * stands in for the chord's major 3rd. `lacks` = the semitones above the
   * root it leaves out; its sentence names them, in all three languages.
   * Only the three entries listed in the test may carry this.
   */
  exception?: { kind: 'subset' | 'blues idiom'; lacks: number[] };
}

// Chord-scale mappings based on jazz theory and common practice
export const CHORD_SCALE_MAP: Record<ChordQuality, ScaleSuggestion[]> = {
  // === MAJOR FAMILY ===
  major: [
    { scale: 'major', fit: 'primary', context: 'Contains all chord tones (1-3-5)' },
    {
      scale: 'lydian',
      fit: 'secondary',
      context: 'Raised 4th avoids the clash with the major 3rd',
    },
    { scale: 'pentatonic_major', fit: 'secondary', context: 'No avoid notes — always safe' },
  ],
  major7: [
    { scale: 'major', fit: 'primary', context: 'All chord tones present (1-3-5-7)' },
    // Hutchinson's Table 31.10.3: "C∆7 → C major scale or C Lydian scale".
    {
      scale: 'lydian',
      fit: 'primary',
      context: 'Raised 4th avoids the clash with the major 3rd',
    },
    // A subset (C D E G A): none of its notes clashes; it leaves out the 7th.
    {
      scale: 'pentatonic_major', fit: 'secondary',
      context: 'Safe melodic choice — five notes, none clashes; it leaves out the major 7th',
      exception: { kind: 'subset', lacks: [11] },
    },
  ],
  major6: [
    { scale: 'major', fit: 'primary', context: 'Contains the natural 6th' },
    { scale: 'pentatonic_major', fit: 'secondary', context: 'Clean, simple melodic lines' },
  ],
  major9: [
    { scale: 'major', fit: 'primary', context: '9th is the 2nd degree of major scale' },
    { scale: 'lydian', fit: 'primary', context: 'Adds brightness with #4' },
  ],
  major11: [
    {
      scale: 'major',
      fit: 'primary',
      context: 'Contains every chord tone, including the natural 11 — the chord omits the 3rd, so the 11 does not clash',
    },
    // (Lydian went, P1: its F♯ replaces the natural 11 the chord names.)
  ],
  major13: [
    { scale: 'major', fit: 'primary', context: 'Full scale coverage of all extensions' },
    { scale: 'lydian', fit: 'primary', context: 'Brighter with the #4' },
  ],
  six_nine: [
    { scale: 'major', fit: 'primary', context: '6th and 9th are scale degrees 6 and 2' },
    { scale: 'pentatonic_major', fit: 'secondary', context: 'Sweet, simple lines' },
  ],
  add9: [
    { scale: 'major', fit: 'primary', context: '9th is natural in major scale' },
    { scale: 'pentatonic_major', fit: 'secondary', context: 'Clean melodic approach' },
  ],
  // Cm(add9): C D E♭ G — the 9th (D) is the natural 2nd of both minors, as for minor9.
  minor_add9: [
    { scale: 'dorian', fit: 'primary', context: '9th is natural 2nd in dorian' },
    { scale: 'natural_minor', fit: 'secondary', context: 'Works but less bright' },
  ],
  add11: [
    {
      scale: 'major',
      fit: 'primary',
      context: 'Contains every chord tone, including the natural 11 the symbol asks for',
    },
    // (Lydian went, P1: its F♯ replaces the natural 11 the chord names.)
  ],

  // === MINOR FAMILY ===
  minor: [
    { scale: 'dorian', fit: 'primary', context: 'Natural 6th adds brightness — most versatile' },
    { scale: 'natural_minor', fit: 'primary', context: 'Classic minor sound with b6' },
    { scale: 'pentatonic_minor', fit: 'secondary', context: 'Five notes, no wrong choices' },
    { scale: 'blues', fit: 'color', context: 'Adds b5 blue note for soulful feel' },
  ],
  minor7: [
    {
      scale: 'dorian',
      fit: 'primary',
      context: 'Bright minor — natural 6 works over m7 chords',
    },
    { scale: 'natural_minor', fit: 'secondary', context: 'Darker with the b6' },
    { scale: 'pentatonic_minor', fit: 'secondary', context: 'Safe, bluesy choice' },
    { scale: 'phrygian', fit: 'color', context: 'b2 adds dark, Spanish character' },
  ],
  minor6: [
    { scale: 'dorian', fit: 'primary', context: 'Natural 6th matches the chord 6th exactly' },
    { scale: 'melodic_minor', fit: 'secondary', context: 'Also has natural 6 and 7' },
  ],
  minor9: [
    { scale: 'dorian', fit: 'primary', context: '9th is natural 2nd in dorian' },
    { scale: 'natural_minor', fit: 'secondary', context: 'Works but less bright' },
  ],
  minor11: [
    { scale: 'dorian', fit: 'primary', context: '11th (4th) is natural in dorian' },
    { scale: 'natural_minor', fit: 'secondary', context: 'Same 4th, darker 6th' },
  ],
  minor13: [{ scale: 'dorian', fit: 'primary', context: '13th is the natural 6th in dorian' }],
  minor_six_nine: [
    { scale: 'dorian', fit: 'primary', context: 'Natural 6 and 2 match chord' },
    { scale: 'melodic_minor', fit: 'secondary', context: 'Also works with 6 and 2' },
  ],
  minor_major7: [
    {
      scale: 'melodic_minor',
      fit: 'primary',
      context: 'Natural 7 + minor 3rd = melodic minor character',
    },
    { scale: 'harmonic_minor', fit: 'secondary', context: 'Natural 7 but b6 darker sound' },
  ],

  // === DOMINANT FAMILY ===
  dominant7: [
    {
      scale: 'mixolydian',
      fit: 'primary',
      context: 'b7 in scale matches the chord — THE dominant scale',
    },
    // The blues idiom (the header): no major 3rd, and the sentence says so.
    {
      scale: 'blues',
      fit: 'secondary',
      context: 'Blues/rock idiom: the scale\'s b3 rubs against the chord\'s major 3rd — that clash is the blues sound',
      exception: { kind: 'blues idiom', lacks: [4] },
    },
    { scale: 'bebop_dominant', fit: 'color', context: 'Chromatic passing tone for jazz lines' },
  ],
  dominant9: [
    { scale: 'mixolydian', fit: 'primary', context: 'Natural 9 (2nd) in mixolydian' },
    { scale: 'bebop_dominant', fit: 'secondary', context: 'Smooth chromatic lines' },
  ],
  dominant11: [
    { scale: 'mixolydian', fit: 'primary', context: '11th is natural 4th in mixolydian' },
    { scale: 'dorian', fit: 'secondary', context: 'Minor feel over sus4 voicings' },
  ],
  dominant13: [
    { scale: 'mixolydian', fit: 'primary', context: '13th is natural 6th' },
    { scale: 'lydian_dominant', fit: 'secondary', context: '#11 adds modern tension' },
  ],
  dominant7sus4: [
    { scale: 'mixolydian', fit: 'primary', context: 'Sus4 with b7 — unresolved dominant' },
    { scale: 'dorian', fit: 'secondary', context: 'Minor context works over sus voicing' },
  ],
  dominant9sus4: [
    { scale: 'mixolydian', fit: 'primary', context: '9 and 4 with b7 — modern jazz voicing' },
  ],

  // === ALTERED DOMINANTS ===
  dominant7flat9: [
    {
      scale: 'diminished_half_whole',
      fit: 'primary',
      context: 'Half-whole pattern fits all chord tones including b9',
    },
    { scale: 'phrygian_dominant', fit: 'secondary', context: 'Spanish/Flamenco flavour with b2' },
    // (Altered went, P1: it has no perfect 5th. Hutchinson: C7(♭9) → C
    // Octatonic (Half-Whole).)
  ],
  dominant7sharp9: [
    {
      scale: 'diminished_half_whole',
      fit: 'primary',
      context: 'Contains every chord tone — the #9 plus the major 3rd, perfect 5th and b7',
    },
    // The blues idiom (the header): no major 3rd, and the sentence says so.
    {
      scale: 'blues',
      fit: 'secondary',
      context: 'Blues/rock context (the "Hendrix chord"): the scale\'s b3 is the chord\'s #9 — it has no major 3rd',
      exception: { kind: 'blues idiom', lacks: [4] },
    },
    // (Altered, with no perfect 5th, went, P1. Hutchinson: C7(♯9) → C
    // Octatonic (Half-Whole).)
  ],
  dominant7flat5: [
    {
      scale: 'lydian_dominant',
      fit: 'primary',
      context: '#11 (=b5) built into lydian dominant',
    },
    { scale: 'whole_tone', fit: 'secondary', context: 'All notes a whole step apart — dreamy' },
    { scale: 'altered', fit: 'color', context: 'Full altered sound for maximum tension' },
  ],
  dominant7sharp5: [
    {
      scale: 'whole_tone',
      fit: 'primary',
      context: 'Contains every chord tone (1-3-#5-b7) plus the 9th and #11 — symmetric and dreamy',
    },
    { scale: 'altered', fit: 'secondary', context: '#5 is part of the altered scale' },
  ],
  dominant7alt: [
    {
      scale: 'altered',
      fit: 'primary',
      context: 'THE altered scale — 7th mode of melodic minor',
    },
    // (Half-whole went, P1: its natural 13 replaces the chord's b13.
    // Hutchinson: C7alt → C Diminished-Whole Tone, this scale.)
  ],
  dominant9sharp11: [
    {
      scale: 'lydian_dominant',
      fit: 'primary',
      context: '#11 defines this chord — 4th mode of melodic minor',
    },
  ],
  dominant7sharp11: [
    {
      scale: 'lydian_dominant',
      fit: 'primary',
      context: '#11 over a dominant 7th — lydian dominant (4th mode of melodic minor)',
    },
    // (Whole tone went, P1: its #5 replaces the chord's perfect 5th.
    // Hutchinson: C7(♯11) → C Lydian-Dominant.)
  ],
  major9sharp11: [
    { scale: 'lydian', fit: 'primary', context: '#11 IS the lydian 4th, with the major 7th and 9th' },
  ],
  dominant7flat13: [
    {
      scale: 'mixolydian_b6',
      fit: 'primary',
      context: 'b6 (=b13) over a dominant 7th — 5th mode of melodic minor',
    },
    // (Altered went, P1: it has no perfect 5th, which the chord keeps.)
  ],
  dominant13flat9: [
    {
      scale: 'diminished_half_whole',
      fit: 'primary',
      context: 'Contains b9 and natural 13 — symmetric scale',
    },
  ],

  // === SUSPENDED ===
  sus2: [
    { scale: 'major', fit: 'primary', context: '2nd degree replaces 3rd — open, ambiguous' },
    { scale: 'mixolydian', fit: 'secondary', context: 'Bluesy feel with b7 available' },
    { scale: 'pentatonic_major', fit: 'secondary', context: 'Clean melodic lines' },
  ],
  sus4: [
    { scale: 'mixolydian', fit: 'primary', context: '4th wants to resolve — dominant function' },
    { scale: 'dorian', fit: 'secondary', context: 'Minor context for sus4 voicing' },
    {
      scale: 'egyptian',
      fit: 'secondary',
      context: 'Suspended pentatonic (1-2-4-5-b7): no 3rd at all, so the sus sound stays intact',
    },
  ],
  sus2sus4: [
    { scale: 'mixolydian', fit: 'primary', context: 'Open sound — 2 and 4 with no 3rd' },
    {
      scale: 'egyptian',
      fit: 'secondary',
      context: 'Suspended pentatonic (1-2-4-5-b7): contains the 2 and 4, no 3rd',
    },
  ],

  // === DIMINISHED FAMILY ===
  diminished: [
    {
      scale: 'diminished_whole_half',
      fit: 'primary',
      context: 'Symmetric 8-note scale — whole step first, then alternating',
    },
    { scale: 'locrian', fit: 'secondary', context: 'Natural mode with b5 — darker sound' },
  ],
  diminished7: [
    {
      scale: 'diminished_whole_half',
      fit: 'primary',
      context: 'All chord tones present — start whole step from root',
    },
  ],
  half_diminished7: [
    { scale: 'locrian', fit: 'primary', context: 'Natural fit for ii chord in minor keys' },
    {
      scale: 'locrian_natural2',
      fit: 'secondary',
      context: 'Natural 2 avoids b2 clash — smoother',
    },
  ],
  diminished_major7: [
    {
      scale: 'diminished_whole_half',
      fit: 'primary',
      context: 'Rare chord — symmetric scale provides options',
    },
  ],

  // === AUGMENTED FAMILY ===
  augmented: [
    {
      scale: 'whole_tone',
      fit: 'primary',
      context: 'Every note whole step apart — dreamy, symmetric',
    },
    {
      scale: 'lydian_augmented',
      fit: 'secondary',
      context: '#5 matches chord — mode 3 of melodic minor',
    },
  ],
  augmented7: [
    { scale: 'whole_tone', fit: 'primary', context: 'b7 and #5 both in whole tone scale' },
    { scale: 'altered', fit: 'secondary', context: '#5 is part of altered — dominant function' },
  ],
  augmented_major7: [
    {
      scale: 'lydian_augmented',
      fit: 'primary',
      context: '#4 and #5 with maj7 — 3rd mode of melodic minor',
    },
  ],
  major7flat5: [
    { scale: 'lydian', fit: 'primary', context: '#4 (=b5 enharmonic) — lydian character' },
  ],

  // === POWER CHORD ===
  power: [
    { scale: 'pentatonic_minor', fit: 'primary', context: 'Rock/metal standard' },
    { scale: 'pentatonic_major', fit: 'secondary' },
    { scale: 'blues', fit: 'secondary' },
  ],

  // === MAJOR 7 #11 (LYDIAN CHORD) ===
  major7sharp11: [
    { scale: 'lydian', fit: 'primary', context: '#11 IS the lydian sound — perfect match' },
  ],

  // === COMBINATION ALTERED DOMINANTS ===
  dominant7sharp5flat9: [
    { scale: 'altered', fit: 'primary', context: '#5 and b9 are both altered tones' },
    // (Whole tone went, P1: its natural 9 replaces the chord's b9.)
  ],
  dominant7flat5flat9: [
    { scale: 'altered', fit: 'primary', context: 'b5 and b9 define the altered sound' },
    { scale: 'diminished_half_whole', fit: 'secondary', context: 'b5 and b9 in symmetric scale' },
  ],
  dominant7sharp5sharp9: [
    { scale: 'altered', fit: 'primary', context: '#5 and #9 — full altered dominant' },
    // (Whole tone went, P1: its natural 9 replaces the chord's #9.)
  ],
  dominant7flat5sharp9: [
    { scale: 'altered', fit: 'primary', context: 'b5 and #9 — classic altered combination' },
    { scale: 'diminished_half_whole', fit: 'secondary', context: 'Symmetric scale option' },
  ],
};

/**
 * Get scale suggestions for a chord quality, ordered by fit
 * (primary → secondary → colour).
 */
export function getScaleSuggestions(quality: ChordQuality): ScaleSuggestion[] {
  return CHORD_SCALE_MAP[quality] || [];
}

/**
 * Every tone `chord` names is a note of `scale` built on the chord's root
 * (pitch classes), except the semitones above the root an exception may
 * leave out (`lacks`). A slash bass is among `chord.notes`: the parser puts
 * a bass that is not a chord tone there (`chordFromParsed`: C/D → D C E G).
 */
export function scaleHoldsChord(chord: Chord, scale: ScaleType, lacks: readonly number[] = []): boolean {
  const root = getPitchClass(chord.root);
  const held = new Set([...SCALE_FORMULAS[scale], ...lacks].map((i) => (root + i) % 12));
  return chord.notes.every((n) => held.has(getPitchClass(n)));
}

/** How many catalogue scales the panel offers, at most, for a chord no listed suggestion holds. */
export const HOLDING_SCALES_CAP = 4;
/** The tooltip of such a scale (`i18n/scaleSuggestionContext.ts` has it in PT / ES). */
export const HOLDS_EVERY_NOTE = 'Holds every note of this chord';

/**
 * The scales of `catalogue` (in its order: the Scale picker's teaching
 * order) that hold every note of `chord`, at most `HOLDING_SCALES_CAP`; the
 * chromatic scale, which holds any chord, is never one of them. For a chord
 * no listed suggestion holds (the review of the second round: Cm(add11),
 * Cm7♭9, C/B♭ … were left with no scale at all).
 */
export function scalesHoldingChord(chord: Chord, catalogue: readonly ScaleType[]): ScaleSuggestion[] {
  return catalogue
    .filter((type) => type !== 'chromatic' && scaleHoldsChord(chord, type))
    .slice(0, HOLDING_SCALES_CAP)
    .map((scale) => ({ scale, fit: 'secondary', context: HOLDS_EVERY_NOTE }));
}

/** The key's own pitch set, rotated onto this chord root, precedes quality
 * suggestions when the entire chord is diatonic and the catalogue names it.
 * A suggestion that would not hold the chord as it is — a chord the parser
 * built with notes of its own (Cm(add11) borrows minor's list), or a slash
 * chord whose bass the scale lacks (C/F♯: not Major) — is left out (P1); an
 * exception keeps leaving out only its own `lacks` (C7 keeps Blues, C7/D
 * does not). Where nothing is left and a `catalogue` is given, the catalogue
 * scales that hold every note of the chord are offered instead. */
export function getKeyScaleSuggestions(chord: Chord, key: Scale, catalogue?: readonly ScaleType[]): ScaleSuggestion[] {
  const listed = getScaleSuggestions(chord.quality).filter((s) => scaleHoldsChord(chord, s.scale, s.exception?.lacks));
  const suggestions = listed.length > 0 || !catalogue ? listed : scalesHoldingChord(chord, catalogue);
  const pcs = new Set(key.notes.map(getPitchClass));
  if (!chord.notes.every((n) => pcs.has(getPitchClass(n)))) return suggestions;
  const root = getPitchClass(chord.root);
  const intervals = [...pcs].map((pc) => (pc - root + 12) % 12).sort((a, b) => a - b);
  const match = (Object.keys(SCALE_FORMULAS) as ScaleType[]).find((type) =>
    SCALE_FORMULAS[type].length === intervals.length && SCALE_FORMULAS[type].every((n, i) => n === intervals[i]));
  if (!match) return suggestions;
  return [{ ...suggestions.find((s) => s.scale === match), scale: match, fit: 'primary', keyNotes: true },
    ...suggestions.filter((s) => s.scale !== match)];
}
