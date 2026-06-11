/**
 * Chord-Scale Relationships
 *
 * Maps chord qualities to compatible scales (and vice-versa) for
 * improvisation and harmony guidance. Also provides chord substitution
 * recommendations and mode-scale relationships.
 *
 * Based on jazz theory and common practice: each chord quality maps to
 * primary (best fit), secondary, and colour scale choices. Reverse lookups
 * allow finding chords that suit a given scale.
 */

import { ChordQuality, ScaleType } from '../types/music';

// Scale suggestion with context about why it works
export interface ScaleSuggestion {
  scale: ScaleType;
  fit: 'primary' | 'secondary' | 'color'; // How well it fits
  context?: string; // Optional context about when to use it
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
    {
      scale: 'lydian',
      fit: 'primary',
      context: '#4 avoids the "avoid note" clash — preferred in jazz',
    },
    { scale: 'pentatonic_major', fit: 'secondary', context: 'Safe melodic choice' },
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
    { scale: 'lydian', fit: 'primary', context: '#11 matches the lydian 4th — defining sound' },
    { scale: 'major', fit: 'secondary', context: 'Natural 4th clashes slightly with 3rd' },
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
  add11: [
    { scale: 'lydian', fit: 'primary', context: '#11 preferred over natural 4' },
    { scale: 'major', fit: 'secondary', context: 'Natural 4 creates slight tension' },
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
    { scale: 'blues', fit: 'secondary', context: 'Blue notes add soul in blues/rock' },
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
    { scale: 'phrygian_dominant', fit: 'secondary', context: 'Spanish/Flamenco flavor with b2' },
    { scale: 'altered', fit: 'color', context: 'Maximum tension for resolving to minor' },
  ],
  dominant7sharp9: [
    {
      scale: 'altered',
      fit: 'primary',
      context: 'THE Hendrix chord scale — #9 is built into altered',
    },
    {
      scale: 'diminished_half_whole',
      fit: 'secondary',
      context: 'Symmetric scale contains both b9 and #9',
    },
    { scale: 'blues', fit: 'color', context: 'Blues scale b3 = #9 — rock/blues context' },
  ],
  dominant7flat5: [
    {
      scale: 'lydian_dominant',
      fit: 'primary',
      context: '#11 (=b5) built into lydian dominant — jazz standard',
    },
    { scale: 'whole_tone', fit: 'secondary', context: 'All notes a whole step apart — dreamy' },
    { scale: 'altered', fit: 'color', context: 'Full altered sound for maximum tension' },
  ],
  dominant7sharp5: [
    {
      scale: 'whole_tone',
      fit: 'primary',
      context: 'Every note is aug chord tone — symmetric and dreamy',
    },
    { scale: 'altered', fit: 'secondary', context: '#5 is part of the altered scale' },
  ],
  dominant7alt: [
    {
      scale: 'altered',
      fit: 'primary',
      context: 'THE altered scale — 7th mode of melodic minor',
    },
    {
      scale: 'diminished_half_whole',
      fit: 'color',
      context: 'Alternative with similar tension',
    },
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
    { scale: 'whole_tone', fit: 'secondary', context: 'b7 and #11(=b5) both present' },
  ],
  major9sharp11: [
    { scale: 'lydian', fit: 'primary', context: '#11 IS the lydian 4th, with the major 7th and 9th' },
    {
      scale: 'lydian_dominant',
      fit: 'color',
      context: 'Swap to b7 for a dominant flavour over the same #11',
    },
  ],
  dominant7flat13: [
    {
      scale: 'mixolydian_b6',
      fit: 'primary',
      context: 'b6 (=b13) over a dominant 7th — 5th mode of melodic minor',
    },
    { scale: 'altered', fit: 'secondary', context: 'b13 is one of the altered tensions' },
  ],
  dominant13flat9: [
    {
      scale: 'diminished_half_whole',
      fit: 'primary',
      context: 'Contains b9 and natural 13 — symmetric scale',
    },
    { scale: 'phrygian_dominant', fit: 'secondary', context: 'b9 with Spanish character' },
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
    { scale: 'pentatonic_major', fit: 'secondary', context: 'Safe, no clash with 3rd' },
  ],
  sus2sus4: [
    { scale: 'mixolydian', fit: 'primary', context: 'Open sound — 2 and 4 with no 3rd' },
    { scale: 'pentatonic_major', fit: 'secondary', context: 'Maximum ambiguity' },
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
    { scale: 'whole_tone', fit: 'secondary', context: 'b5 present in whole tone scale' },
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
    { scale: 'lydian_dominant', fit: 'color', context: 'Add b7 flavor for more tension' },
  ],

  // === COMBINATION ALTERED DOMINANTS ===
  dominant7sharp5flat9: [
    { scale: 'altered', fit: 'primary', context: '#5 and b9 are both altered tones' },
    { scale: 'whole_tone', fit: 'secondary', context: '#5 present — b9 is outside but usable' },
  ],
  dominant7flat5flat9: [
    { scale: 'altered', fit: 'primary', context: 'b5 and b9 define the altered sound' },
    { scale: 'diminished_half_whole', fit: 'secondary', context: 'b5 and b9 in symmetric scale' },
  ],
  dominant7sharp5sharp9: [
    { scale: 'altered', fit: 'primary', context: '#5 and #9 — full altered dominant' },
    { scale: 'whole_tone', fit: 'secondary', context: '#5 matches — #9 adds extra tension' },
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

/** Get only the primary (best-fit) scales for a chord quality. */
export function getPrimaryScales(quality: ChordQuality): ScaleType[] {
  return getScaleSuggestions(quality)
    .filter((s) => s.fit === 'primary')
    .map((s) => s.scale);
}

// Related chord suggestion with context
export interface ChordSubstitution {
  quality: ChordQuality;
  relationship: string; // Brief description of the relationship
}

// Common chord substitutions based on jazz theory
export const CHORD_SUBSTITUTIONS: Partial<Record<ChordQuality, ChordSubstitution[]>> = {
  // Major family - common substitutions
  major: [
    { quality: 'major7', relationship: 'Add color with maj7' },
    { quality: 'major6', relationship: 'Add 6th for movement' },
    { quality: 'add9', relationship: 'Add 9th for brightness' },
  ],
  major7: [
    { quality: 'major9', relationship: 'Extend to 9th' },
    { quality: 'six_nine', relationship: '6/9 voicing' },
    { quality: 'major6', relationship: 'Avoid b7 in melody' },
  ],
  major9: [
    { quality: 'major7', relationship: 'Simplify' },
    { quality: 'major13', relationship: 'Add more color' },
  ],

  // Minor family
  minor: [
    { quality: 'minor7', relationship: 'Add b7 for jazz' },
    { quality: 'minor6', relationship: 'Dorian color' },
    { quality: 'minor9', relationship: 'Rich extension' },
  ],
  minor7: [
    { quality: 'minor9', relationship: 'Extend to 9th' },
    { quality: 'minor11', relationship: 'Modal voicing' },
    { quality: 'minor6', relationship: 'Dorian sound' },
  ],

  // Dominant family - tritone substitutions and alterations
  dominant7: [
    { quality: 'dominant9', relationship: 'Add 9th' },
    { quality: 'dominant13', relationship: 'Add color tones' },
    { quality: 'dominant7flat9', relationship: 'Add tension' },
    { quality: 'dominant7sharp9', relationship: 'Hendrix chord' },
  ],
  dominant9: [
    { quality: 'dominant7', relationship: 'Simplify' },
    { quality: 'dominant13', relationship: 'Full voicing' },
    { quality: 'dominant9sharp11', relationship: 'Lydian dominant' },
  ],

  // Altered dominants - related alterations
  dominant7flat9: [
    { quality: 'dominant7sharp9', relationship: 'Switch alteration' },
    { quality: 'dominant7alt', relationship: 'Full alteration' },
    { quality: 'diminished7', relationship: 'Similar function' },
  ],
  dominant7sharp9: [
    { quality: 'dominant7flat9', relationship: 'Switch alteration' },
    { quality: 'dominant7alt', relationship: 'Full alteration' },
  ],
  dominant7alt: [
    { quality: 'dominant7sharp9', relationship: 'Specific alteration' },
    { quality: 'dominant7flat5', relationship: 'Tritone focus' },
  ],

  // Diminished - enharmonic equivalents
  diminished7: [
    { quality: 'dominant7flat9', relationship: 'Rootless dom7b9' },
    { quality: 'half_diminished7', relationship: 'Add minor 7th' },
  ],
  half_diminished7: [
    { quality: 'minor7', relationship: 'Raise the 5th' },
    { quality: 'minor9', relationship: 'Different context' },
  ],

  // Suspended - resolution options
  sus4: [
    { quality: 'major', relationship: 'Resolve to major' },
    { quality: 'minor', relationship: 'Resolve to minor' },
    { quality: 'dominant7sus4', relationship: 'Add dominant 7' },
  ],
  dominant7sus4: [
    { quality: 'dominant7', relationship: 'Resolve sus' },
    { quality: 'dominant9sus4', relationship: 'Extend' },
    { quality: 'minor7', relationship: 'ii chord sound' },
  ],

  // Augmented
  augmented: [
    { quality: 'augmented7', relationship: 'Add dominant 7' },
    { quality: 'augmented_major7', relationship: 'Add major 7' },
  ],
  augmented7: [
    { quality: 'dominant7sharp5', relationship: 'Same chord' },
    { quality: 'dominant7', relationship: 'Resolve aug 5' },
  ],
};

/**
 * Get common chord substitutions for a given quality.
 * Returns related chord qualities with a brief description of the relationship
 * (e.g. "Add color with maj7", "Tritone focus").
 */
export function getChordSubstitutions(quality: ChordQuality): ChordSubstitution[] {
  return CHORD_SUBSTITUTIONS[quality] || [];
}

// Chord suggestion for a scale (reverse lookup from CHORD_SCALE_MAP)
export interface ChordSuggestion {
  quality: ChordQuality;
  fit: 'primary' | 'secondary' | 'color';
  context?: string;
}

/**
 * Reverse lookup: find chord qualities that work well over a given scale type.
 * Scans the entire CHORD_SCALE_MAP and returns matching qualities sorted by
 * fit priority (primary → secondary → colour).
 */
export function getChordsForScale(scaleType: ScaleType): ChordSuggestion[] {
  const results: ChordSuggestion[] = [];
  const seenQualities = new Set<ChordQuality>();

  for (const [quality, suggestions] of Object.entries(CHORD_SCALE_MAP) as [
    ChordQuality,
    ScaleSuggestion[],
  ][]) {
    const match = suggestions.find((s) => s.scale === scaleType);
    if (match && !seenQualities.has(quality)) {
      seenQualities.add(quality);
      results.push({
        quality,
        fit: match.fit,
        context: match.context,
      });
    }
  }

  // Sort by fit priority: primary > secondary > color
  const fitOrder = { primary: 0, secondary: 1, color: 2 };
  return results.sort((a, b) => fitOrder[a.fit] - fitOrder[b.fit]);
}

// Mode-Scale relationships - maps modes to compatible scales for improvisation
export const MODE_SCALE_MAP: Record<import('../types/music').ModeName, ScaleSuggestion[]> = {
  ionian: [
    { scale: 'major', fit: 'primary' },
    { scale: 'pentatonic_major', fit: 'secondary', context: 'Safe choice, no avoid notes' },
    { scale: 'lydian', fit: 'color', context: 'Adds brightness with #4' },
  ],
  dorian: [
    { scale: 'dorian', fit: 'primary' },
    { scale: 'pentatonic_minor', fit: 'secondary', context: 'Safe choice' },
    { scale: 'blues', fit: 'color', context: 'Adds blue notes' },
    { scale: 'natural_minor', fit: 'color', context: 'Darker alternative' },
  ],
  phrygian: [
    { scale: 'phrygian', fit: 'primary' },
    { scale: 'phrygian_dominant', fit: 'secondary', context: 'Spanish flavor' },
    { scale: 'pentatonic_minor', fit: 'secondary', context: 'Safe choice' },
  ],
  lydian: [
    { scale: 'lydian', fit: 'primary' },
    { scale: 'major', fit: 'secondary', context: 'More traditional' },
    { scale: 'pentatonic_major', fit: 'secondary', context: 'Safe choice' },
    { scale: 'lydian_dominant', fit: 'color', context: 'Adds dominant flavor' },
  ],
  mixolydian: [
    { scale: 'mixolydian', fit: 'primary' },
    { scale: 'blues', fit: 'secondary', context: 'Blues/rock context' },
    { scale: 'pentatonic_major', fit: 'secondary', context: 'Safe choice' },
    { scale: 'bebop_dominant', fit: 'color', context: 'Jazz lines' },
  ],
  aeolian: [
    { scale: 'natural_minor', fit: 'primary' },
    { scale: 'pentatonic_minor', fit: 'secondary', context: 'Safe choice' },
    { scale: 'blues', fit: 'color', context: 'Adds blue notes' },
    { scale: 'harmonic_minor', fit: 'color', context: 'Classical flavor' },
  ],
  locrian: [
    { scale: 'locrian', fit: 'primary' },
    { scale: 'locrian_natural2', fit: 'secondary', context: 'Less dissonant' },
    { scale: 'diminished_half_whole', fit: 'color', context: 'Symmetric alternative' },
  ],
};

/**
 * Get scale suggestions for improvising over a given mode.
 * Returns scales ordered by fit (primary → secondary → colour).
 */
export function getScalesForMode(modeName: import('../types/music').ModeName): ScaleSuggestion[] {
  return MODE_SCALE_MAP[modeName] || [];
}

// Related modes information - modes that share the same root
export interface RelatedMode {
  mode: import('../types/music').ModeName;
  relationship: string;
}

/**
 * Get parallel modes — modes that share the same root but have different
 * intervallic character. Useful for exploring tonal colour alternatives
 * (e.g. switching from Dorian to Mixolydian on the same root).
 */
export function getRelatedModes(modeName: import('../types/music').ModeName): RelatedMode[] {
  const allModes: import('../types/music').ModeName[] = [
    'ionian',
    'dorian',
    'phrygian',
    'lydian',
    'mixolydian',
    'aeolian',
    'locrian',
  ];

  // Relationships between modes
  const relationships: Record<import('../types/music').ModeName, string> = {
    ionian: 'Major scale - bright, happy',
    dorian: 'Minor with natural 6 - jazzy',
    phrygian: 'Minor with flat 2 - dark, Spanish',
    lydian: 'Major with sharp 4 - dreamy',
    mixolydian: 'Major with flat 7 - bluesy',
    aeolian: 'Natural minor - sad, dark',
    locrian: 'Diminished - unstable, tense',
  };

  return allModes
    .filter((m) => m !== modeName)
    .map((m) => ({
      mode: m,
      relationship: relationships[m],
    }));
}
