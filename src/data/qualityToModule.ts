/**
 * Static chord-quality → curriculum-module map for the "Learn about this"
 * deep link. A direct map beats fuzzy title search: "Major" used to
 * title-match "Major vs Minor Recognition" (L9 ear training) instead of the
 * module that actually teaches major triads.
 *
 * Record<ChordQuality, string | null> keeps coverage complete at compile
 * time — adding a chord quality without a decision is a type error. `null`
 * means no lesson teaches that chord, so Explore shows no "Learn about this"
 * link rather than one to a lesson that never names it (audit W9-24 / C-86).
 * qualityToModuleTeaches.test.ts checks every target lesson names its chord.
 */
import type { ChordQuality } from '../core/types/music';

export const QUALITY_TO_MODULE: Record<ChordQuality, string | null> = {
  // Triads
  major: 'l1u3m4', // Your First Chords — Major Triads
  minor: 'l2u7m3', // The Four Triad Types
  diminished: 'l2u7m3',
  augmented: 'l2u7m3',

  // Sixths and added tones — the "Suspended and Added-Tone Chords" concept of
  // Complete Chord Taxonomy (C6/9, Cadd9, "add a tone without a 7th")
  major6: 'l7u23m5',
  minor6: 'l7u23m5',
  six_nine: 'l7u23m5',
  minor_six_nine: 'l7u23m5',
  add9: 'l7u21m1', // Jazz Chord Symbols and Extensions (extensions vs added tones, add9)
  add11: 'l7u23m5',

  // Sevenths
  major7: 'l3u9m1', // Seventh Chords: The Five Qualities
  minor7: 'l3u9m1',
  diminished7: 'l3u9m1',
  half_diminished7: 'l3u9m1',
  minor_major7: 'l3u9m1',
  augmented7: 'l6u19m3', // Chromatic Mediants and Altered Dominants (V7#5)
  augmented_major7: 'l3u9m4', // Diatonic Seventh Chords in Minor (III+maj7)
  diminished_major7: null, // no lesson teaches dim(maj7)
  major7flat5: null, // no lesson teaches maj7b5
  dominant7: 'l4u12m4', // The Dominant Seventh — Resolution Rules

  // Suspensions
  sus2: 'l7u23m5', // Complete Chord Taxonomy — Suspended and Added-Tone Chords
  sus4: 'l7u23m5',
  sus2sus4: 'l7u23m5',
  dominant7sus4: 'l7u21m2', // Shell Voicings and Altered Chords (suspended dominants)
  dominant9sus4: 'l7u21m2',

  // Altered dominants
  dominant7alt: 'l7u21m2',
  dominant7flat9: 'l7u21m2',
  dominant7sharp9: 'l7u21m2',
  dominant7flat5: 'l7u21m2',
  dominant7sharp5: 'l7u21m2',
  dominant7sharp5flat9: 'l7u21m2',
  dominant7flat5flat9: 'l7u21m2',
  dominant7sharp5sharp9: 'l7u21m2',
  dominant7flat5sharp9: 'l7u21m2',

  // Extensions
  major9: 'l7u21m1',
  minor9: 'l7u21m1',
  dominant9: 'l7u21m1',
  major11: 'l7u21m1',
  minor11: 'l7u21m1',
  dominant11: 'l7u21m1',
  dominant9sharp11: 'l7u21m1',
  dominant7sharp11: 'l7u21m1',
  major9sharp11: 'l7u21m1',
  major13: 'l7u21m1',
  minor13: 'l7u21m1',
  dominant13: 'l7u21m1',
  dominant13flat9: 'l7u21m1',
  dominant7flat13: 'l7u21m2', // altered-tension dominant → Shell Voicings and Altered Chords
  major7sharp11: 'l7u21m1',

  // Special structures
  power: 'l7u23m5', // Complete Chord Taxonomy
};
