import { describe, it, expect } from 'vitest';
import { CHORD_SCALE_MAP, getKeyScaleSuggestions, getScaleSuggestions } from '../chordScaleRelationships';
import { CHORD_FORMULAS, buildChord } from '../chords';
import { SCALE_FORMULAS, buildScale } from '../scales';
import { getPitchClass } from '../notes';
import { chordFromParsed, parseChordSymbol } from '../../utils/chordParser';
import { stringToNote, type Chord, type ChordQuality, type ScaleType } from '../../types/music';

// ---------------------------------------------------------------------------
// The chord panel's "Compatible scales" never contradict their chord (QA
// report 2 of 18 November 2026, finding 1, "P1": Cadd11 and Cmaj11 were
// offered Lydian, whose F♯ replaces the F the chord names; C7♯5♭9, C7♯5♯9
// and C7♯11 were offered Whole Tone, whose D / D / G♯ replace the chord's
// D♭ / D♯ / G).
//
// The rule, for EVERY suggestion — primary, secondary and colour alike —
// is the one a chord-scale is built by: "write all of the notes of the chord
// (including upper extensions and altered notes), then fill in the thirds"
// (Robert Hutchinson, *Music Theory for the 21st-Century Classroom*,
// University of Puget Sound, §31.10 "How to Determine Chord-Scale
// Relationships", https://musictheory.pugetsound.edu/mt21c/HowToDetermineChord-ScaleRelationships.html).
// So a scale offered for a chord holds every tone the chord names. A scale
// tone a half step above a chord tone (an "avoid note": the F of C major
// over a C chord, Wikipedia "Avoid note" after Nettles, Berklee *Harmony 3*)
// is allowed: it is a colour, not a contradiction. What is not allowed is a
// scale that LACKS a tone the chord names, whether it puts a neighbour in
// its place (Lydian's F♯ for Cadd11's F) or simply leaves it out (major
// pentatonic over Cmaj7, no B). Before this test the old rule exempted
// colour suggestions, pentatonic subsets and two blues pairings; twelve
// pairings broke the rule above at 153caab (the builder's check, below).
// ---------------------------------------------------------------------------

const pc = (n: number) => ((n % 12) + 12) % 12;
const QUALITIES = Object.keys(CHORD_FORMULAS) as ChordQuality[];

/** The 21 spellings a root can have: the seven letters, natural, sharp or flat (every pitch class, most twice). */
const ROOTS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].flatMap((l) => [l, `${l}#`, `${l}b`]).map(stringToNote);

/** The tones of `chord` that `scale`, built on the chord's root, does not hold (pitch classes). */
function missing(chord: Chord, scale: ScaleType): number[] {
  const root = getPitchClass(chord.root);
  const held = new Set(SCALE_FORMULAS[scale].map((i) => pc(root + i)));
  const named = new Set([...chord.notes, ...(chord.bassNote ? [chord.bassNote] : [])].map(getPitchClass));
  return [...named].filter((p) => !held.has(p));
}

describe('P1 — every scale the table offers holds every tone its chord names', () => {
  it('covers every chord quality (guards against an empty or partial table)', () => {
    expect(Object.keys(CHORD_SCALE_MAP).sort()).toEqual([...QUALITIES].sort());
    for (const q of QUALITIES) expect(CHORD_SCALE_MAP[q].length, q).toBeGreaterThan(0);
  });

  // The formula and the scale's intervals, as numbers: the table itself.
  for (const q of QUALITIES) {
    it(`${q}: each of ${CHORD_SCALE_MAP[q].map((s) => s.scale).join(', ')} holds 1 ${CHORD_FORMULAS[q].join(' ')}`, () => {
      for (const s of CHORD_SCALE_MAP[q]) {
        const held = new Set(SCALE_FORMULAS[s.scale]);
        const lacks = CHORD_FORMULAS[q].map(pc).filter((i) => !held.has(i));
        expect(lacks, `${q} → ${s.scale} (${s.fit}) lacks the chord's semitones ${lacks}`).toEqual([]);
      }
    });
  }

  // The same, through the chords and scales the app builds, spelled, on all
  // 21 root spellings — and through the panel's own list for the chord in a
  // key of each of the 37 scales on its root and in C major.
  it('on every root spelling, as built and as the panel lists them', () => {
    const scaleTypes = Object.keys(SCALE_FORMULAS) as ScaleType[];
    const cMajor = buildScale(stringToNote('C'), 'major');
    let checked = 0;
    for (const root of ROOTS) {
      for (const q of QUALITIES) {
        const chord = buildChord(root, q);
        for (const s of getScaleSuggestions(q)) {
          // The built scale's notes, not just the formula: the spelling engine too.
          const built = new Set(buildScale(root, s.scale).notes.map(getPitchClass));
          const lacks = [...new Set(chord.notes.map(getPitchClass))].filter((p) => !built.has(p));
          expect(lacks, `${chord.root.natural}${chord.root.accidental} ${q} → ${s.scale}`).toEqual([]);
          checked++;
        }
        for (const key of [cMajor, ...scaleTypes.map((t) => buildScale(root, t))]) {
          for (const s of getKeyScaleSuggestions(chord, key)) {
            expect(missing(chord, s.scale), `${root.natural}${root.accidental} ${q} in ${key.root.natural}${key.root.accidental} ${key.type} → ${s.scale}`).toEqual([]);
            checked++;
          }
        }
      }
    }
    expect(checked).toBeGreaterThan(50_000);
  });

  // Chords the parser builds with notes of their own (their quality is the
  // nearest named one, whose list could clash with the extra notes) and
  // slash chords, whose bass is a tone the chord names too: the panel drops
  // a suggestion that would not hold them.
  it.each([
    'Cadd11', 'Cmaj11', 'C7#5b9', 'C7#5#9', 'C7#11', 'C7b13', 'C7alt',
    'Cm(add11)', 'C7sus2', 'C7b9#11', 'Cmaj7#11', 'C13b9', 'Cm7b5',
    'C/F', 'C/F#', 'C/Bb', 'C/D', 'C/E', 'Dm7/G', 'G7/F', 'Am/G', 'F/G', 'Cmaj7/B',
  ])('%s: every scale the panel offers in C major holds its notes and bass', (symbol) => {
    const parsed = parseChordSymbol(symbol);
    expect(parsed, symbol).not.toBeNull();
    const chord = chordFromParsed(parsed!);
    for (const key of [buildScale(stringToNote('C'), 'major'), buildScale(chord.root, 'major'), buildScale(chord.root, 'mixolydian')]) {
      for (const s of getKeyScaleSuggestions(chord, key)) {
        expect(missing(chord, s.scale), `${symbol} in ${key.type} → ${s.scale}`).toEqual([]);
      }
    }
  });

  it('a slash bass outside every suggested scale leaves those scales out, not the chord (C/F♯ keeps Lydian only)', () => {
    const chord = chordFromParsed(parseChordSymbol('C/F#')!);
    expect(getKeyScaleSuggestions(chord, buildScale(stringToNote('A'), 'natural_minor')).map((s) => s.scale)).toEqual(['lydian']);
    // Without the bass, the major chord's own three.
    expect(getKeyScaleSuggestions(buildChord(stringToNote('C'), 'major'), buildScale(stringToNote('A'), 'natural_minor')).map((s) => s.scale))
      .toEqual(['major', 'lydian', 'pentatonic_major']);
  });
});

describe('P1 — the five pairings the audit found, and the seven more the check found, are gone', () => {
  const scalesOf = (q: ChordQuality) => CHORD_SCALE_MAP[q].map((s) => `${s.scale}:${s.fit}`);

  it('Cadd11 and Cmaj11 (natural 11, F): Major only — Lydian\'s F♯ is the maj7♯11 sound', () => {
    expect(scalesOf('add11')).toEqual(['major:primary']);
    expect(scalesOf('major11')).toEqual(['major:primary']);
  });

  it('C7♯5♭9 and C7♯5♯9: Altered only (Whole Tone has D, not D♭ or D♯)', () => {
    expect(scalesOf('dominant7sharp5flat9')).toEqual(['altered:primary']);
    expect(scalesOf('dominant7sharp5sharp9')).toEqual(['altered:primary']);
  });

  it('C7♯11: Lydian Dominant only (Whole Tone has G♯, not the chord\'s G) — Hutchinson Table 31.10.3: C7(♯11) → Lydian-Dominant', () => {
    expect(scalesOf('dominant7sharp11')).toEqual(['lydian_dominant:primary']);
  });

  it('C7♭9 and C7♯9 keep the half-whole scale (Hutchinson: C7(♭9), C7(♯9) → Octatonic Half-Whole); Altered (no perfect 5th) and Blues (no major 3rd) are gone', () => {
    expect(scalesOf('dominant7flat9')).toEqual(['diminished_half_whole:primary', 'phrygian_dominant:secondary']);
    expect(scalesOf('dominant7sharp9')).toEqual(['diminished_half_whole:primary']);
    expect(SCALE_FORMULAS.altered).not.toContain(7);
    expect(SCALE_FORMULAS.blues).not.toContain(4);
  });

  it('C7: Mixolydian first (Hutchinson: C7 → C Mixolydian), Bebop Dominant; the blues scale (no major 3rd) is gone', () => {
    expect(scalesOf('dominant7')).toEqual(['mixolydian:primary', 'bebop_dominant:color']);
  });

  it('C7alt: Altered only (Hutchinson: C7alt → Diminished-Whole Tone); half-whole has the natural 13 and 5, not the chord\'s ♭13', () => {
    expect(scalesOf('dominant7alt')).toEqual(['altered:primary']);
    expect(SCALE_FORMULAS.diminished_half_whole).not.toContain(8);
  });

  it('C7♭13: Mixolydian ♭6 only (Altered has no perfect 5th)', () => {
    expect(scalesOf('dominant7flat13')).toEqual(['mixolydian_b6:primary']);
  });

  it('Cmaj7: Major and Lydian (Hutchinson: C∆7 → C major or C Lydian); major pentatonic, which has no B, is gone', () => {
    expect(scalesOf('major7')).toEqual(['major:primary', 'lydian:primary']);
  });
});

describe('CHORD_SCALE_MAP — rankings and wording kept from D-14', () => {
  it('sus chords never suggest major pentatonic (it has the 3rd and lacks the 4th)', () => {
    for (const q of ['sus4', 'sus2sus4'] as const) {
      expect(CHORD_SCALE_MAP[q].some((s) => s.scale === 'pentatonic_major')).toBe(false);
      for (const s of CHORD_SCALE_MAP[q]) expect(s.context ?? '').not.toMatch(/no clash with 3rd/i);
    }
  });

  it('no suggestion keeps prose found false or unsupported', () => {
    const all = Object.values(CHORD_SCALE_MAP).flat().map((s) => s.context ?? '');
    for (const old of [/Every note is aug chord tone/i, /THE Hendrix chord scale/i, /#11 matches the lydian 4th/i,
      // P1: "preferred in jazz" (Lydian over maj7) and "jazz standard" (Lydian
      // Dominant over 7♭5) had no source; the sources the builder read list
      // Major or Lydian for C∆7 and Whole Tone for C7(♭5) (Hutchinson).
      /preferred in jazz/i, /jazz standard/i]) {
      expect(all.some((c) => old.test(c)), String(old)).toBe(false);
    }
  });
});
