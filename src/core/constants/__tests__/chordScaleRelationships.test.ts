import { describe, it, expect } from 'vitest';
import {
  CHORD_SCALE_MAP, HOLDING_SCALES_CAP, HOLDS_EVERY_NOTE, getKeyScaleSuggestions, getScaleSuggestions, scalesHoldingChord,
} from '../chordScaleRelationships';
import { CHORD_FORMULAS, buildChord } from '../chords';
import { SCALE_FORMULAS, buildScale } from '../scales';
import { getPitchClass } from '../notes';
import { chordFromParsed, parseChordSymbol } from '../../utils/chordParser';
import { scaleContext } from '../../../i18n/scaleSuggestionContext';
import { SCALE_GROUPS } from '../../../components/navigation/keyChoice';
import { stringToNote, type Chord, type ChordQuality, type ScaleType } from '../../types/music';

// ---------------------------------------------------------------------------
// The chord panel's "Compatible scales" never contradict their chord (QA
// report 2 of 18 November 2026, finding 1, "P1": Cadd11 and Cmaj11 were
// offered Lydian, whose F♯ replaces the F the chord names; C7♯5♭9, C7♯5♯9
// and C7♯11 were offered Whole Tone, whose D / D / G♯ replace the chord's
// D♭ / D♯ / G).
//
// The rule is the one a chord-scale is built by: "write all of the notes of
// the chord (including upper extensions and altered notes), then fill in the
// thirds" (Robert Hutchinson, *Music Theory for the 21st-Century Classroom*,
// University of Puget Sound, §31.10, https://musictheory.pugetsound.edu/mt21c/HowToDetermineChord-ScaleRelationships.html).
// So a scale offered for a chord holds every tone the chord names — every
// suggestion, primary, secondary or colour. A scale tone a half step above a
// chord tone (an avoid note: the F of C major over a C chord, Wikipedia
// "Avoid note" after Nettles, Berklee *Harmony 3*) is allowed.
//
// A suggestion may leave a tone out ONLY if it is in EXCEPTIONS below (the
// seat's ruling on the review of the second round, decision D-14): a subset
// whose notes clash with none of the chord's, or the blues idiom; and its
// note must say which tone, in all three languages. A thirteenth exception,
// or one whose note stops saying it, fails here.
// ---------------------------------------------------------------------------

type Exception = { kind: 'subset' | 'blues idiom'; lacks: number[]; fit: 'secondary'; index: number; reason: string };
const EXCEPTIONS: Record<string, Exception> = {
  'major7:pentatonic_major': {
    kind: 'subset', lacks: [11], fit: 'secondary', index: 2,
    reason: 'C D E G A over Cmaj7: no note a half step from a chord tone; the major 7th is left out (release 16\'s place).',
  },
  'dominant7:blues': {
    kind: 'blues idiom', lacks: [4], fit: 'secondary', index: 1,
    reason: 'The blues scale\'s ♭3 over the chord\'s major 3rd is the blues sound; chord-scale theory leaves blue notes out (Open Music Theory 2e, §6.7).',
  },
  'dominant7sharp9:blues': {
    kind: 'blues idiom', lacks: [4], fit: 'secondary', index: 1,
    reason: 'The ♭3 is the chord\'s ♯9; the scale has no major 3rd.',
  },
};
/** How each note names the tone an exception leaves out, per language. */
const LEFT_OUT: Record<number, { en: string; pt: string; es: string }> = {
  4: { en: 'major 3rd', pt: '3.ª maior', es: '3.ª mayor' },
  11: { en: 'major 7th', pt: '7.ª maior', es: '7.ª mayor' },
};

const pc = (n: number) => ((n % 12) + 12) % 12;
const QUALITIES = Object.keys(CHORD_FORMULAS) as ChordQuality[];
const CATALOGUE = SCALE_GROUPS.flatMap((g) => g.options);

/** The 21 spellings a root can have: the seven letters, natural, sharp or flat (every pitch class, most twice). */
const ROOTS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].flatMap((l) => [l, `${l}#`, `${l}b`]).map(stringToNote);

/** The tones of `chord` that `scale`, built on the chord's root, does not hold, as semitones above the root. */
function missing(chord: Chord, scale: ScaleType): number[] {
  const root = getPitchClass(chord.root);
  const held = new Set(SCALE_FORMULAS[scale]);
  return [...new Set(chord.notes.map((n) => pc(getPitchClass(n) - root)))].filter((i) => !held.has(i)).sort((a, b) => a - b);
}
const parsed = (symbol: string) => chordFromParsed(parseChordSymbol(symbol)!);

describe('P1 — every scale the table offers holds every tone its chord names, but for three listed exceptions', () => {
  it('covers every chord quality (guards against an empty or partial table)', () => {
    expect(Object.keys(CHORD_SCALE_MAP).sort()).toEqual([...QUALITIES].sort());
    for (const q of QUALITIES) expect(CHORD_SCALE_MAP[q].length, q).toBeGreaterThan(0);
  });

  it('the table marks exactly the listed exceptions, at release 16\'s fit and place, each lacking exactly its tones', () => {
    const marked = Object.entries(CHORD_SCALE_MAP).flatMap(([q, list]) => list.filter((s) => s.exception).map((s) => `${q}:${s.scale}`));
    expect(marked.sort()).toEqual(Object.keys(EXCEPTIONS).sort());
    for (const [key, x] of Object.entries(EXCEPTIONS)) {
      const [q, scale] = key.split(':') as [ChordQuality, ScaleType];
      const list = CHORD_SCALE_MAP[q];
      const s = list.find((e) => e.scale === scale)!;
      expect(list.indexOf(s), `${key}: its place`).toBe(x.index);
      expect(s.fit, key).toBe(x.fit);
      expect(s.exception, key).toEqual({ kind: x.kind, lacks: x.lacks });
      expect(missing(buildChord(stringToNote('C'), q), scale), `${key}: what it leaves out`).toEqual(x.lacks);
    }
  });

  it('each exception\'s note names the tone it leaves out, in English, Portuguese and Spanish', () => {
    for (const key of Object.keys(EXCEPTIONS)) {
      const [q, scale] = key.split(':') as [ChordQuality, ScaleType];
      const s = CHORD_SCALE_MAP[q].find((e) => e.scale === scale)!;
      for (const lack of EXCEPTIONS[key].lacks) {
        expect(scaleContext(s.context, 'en'), `${key} EN`).toContain(LEFT_OUT[lack].en);
        expect(scaleContext(s.context, 'pt'), `${key} PT`).toContain(LEFT_OUT[lack].pt);
        expect(scaleContext(s.context, 'es'), `${key} ES`).toContain(LEFT_OUT[lack].es);
      }
    }
  });

  // The formula and the scale's intervals, as numbers: the table itself.
  for (const q of QUALITIES) {
    it(`${q}: each of ${CHORD_SCALE_MAP[q].map((s) => s.scale).join(', ')} holds 1 ${CHORD_FORMULAS[q].join(' ')}`, () => {
      for (const s of CHORD_SCALE_MAP[q]) {
        const held = new Set(SCALE_FORMULAS[s.scale]);
        const lacks = CHORD_FORMULAS[q].map(pc).filter((i) => !held.has(i));
        expect(lacks, `${q} → ${s.scale} (${s.fit}) lacks the chord's semitones ${lacks}`).toEqual(EXCEPTIONS[`${q}:${s.scale}`]?.lacks ?? []);
      }
    });
  }

  // The same, through the chords and scales the app builds, spelled, on all
  // 21 root spellings — and through the panel's own list for the chord in a
  // key of each of the 37 scales on its root and in C major. A listed
  // exception is offered for the plain chord on every root.
  it('on every root spelling, as built and as the panel lists them', () => {
    const scaleTypes = Object.keys(SCALE_FORMULAS) as ScaleType[];
    const cMajor = buildScale(stringToNote('C'), 'major');
    let checked = 0;
    for (const root of ROOTS) {
      for (const q of QUALITIES) {
        const chord = buildChord(root, q);
        for (const s of getScaleSuggestions(q)) {
          const built = new Set(buildScale(root, s.scale).notes.map(getPitchClass));
          const lacks = [...new Set(chord.notes.map(getPitchClass))].filter((p) => !built.has(p)).map((p) => pc(p - getPitchClass(root)));
          expect(lacks, `${chord.root.natural}${chord.root.accidental} ${q} → ${s.scale}`).toEqual(EXCEPTIONS[`${q}:${s.scale}`]?.lacks ?? []);
          checked++;
        }
        for (const key of [cMajor, ...scaleTypes.map((t) => buildScale(root, t))]) {
          const offered = getKeyScaleSuggestions(chord, key, CATALOGUE);
          for (const s of offered) {
            expect(missing(chord, s.scale), `${root.natural}${root.accidental} ${q} in ${key.root.natural}${key.root.accidental} ${key.type} → ${s.scale}`)
              .toEqual(s.keyNotes ? [] : EXCEPTIONS[`${q}:${s.scale}`]?.lacks ?? []);
            checked++;
          }
          for (const k of Object.keys(EXCEPTIONS).filter((k) => k.startsWith(`${q}:`))) {
            expect(offered.some((s) => s.scale === k.split(':')[1]), `${k} offered on ${root.natural}${root.accidental}`).toBe(true);
          }
        }
      }
    }
    expect(checked).toBeGreaterThan(50_000);
  });

  // Chords the parser builds with notes of their own (their quality is the
  // nearest named one, whose list could clash with the extra notes) and
  // slash chords, whose bass the parser lists among the chord's notes: the
  // panel drops a suggestion that would not hold them — an exception may
  // still leave out its own tone, and nothing else.
  it.each([
    'Cadd11', 'Cmaj11', 'C7#5b9', 'C7#5#9', 'C7#11', 'C7b13', 'C7alt',
    'Cm(add11)', 'C7sus2', 'C7b9#11', 'Cmaj7#11', 'C13b9', 'Cm7b5',
    'C/F', 'C/F#', 'C/Bb', 'C/D', 'C/E', 'Dm7/G', 'G7/F', 'Am/G', 'F/G', 'Cmaj7/B',
    'C7', 'C7#9', 'Cmaj7', 'C7/D', 'Cmaj7/F', 'C7/Bb', 'Cmaj7/D', 'C7#9/F',
  ])('%s: every scale the panel offers holds its notes (an exception lacks only its own tone)', (symbol) => {
    const chord = parsed(symbol);
    for (const key of [buildScale(stringToNote('C'), 'major'), buildScale(chord.root, 'major'), buildScale(chord.root, 'mixolydian')]) {
      for (const s of getKeyScaleSuggestions(chord, key, CATALOGUE)) {
        const own = s.keyNotes ? [] : CHORD_SCALE_MAP[chord.quality].find((e) => e.scale === s.scale)?.exception?.lacks ?? [];
        expect(missing(chord, s.scale).filter((i) => !own.includes(i)), `${symbol} in ${key.type} → ${s.scale}`).toEqual([]);
      }
    }
  });

  it('the run-time filter keeps an exception for its plain chord and for a slash bass the scale holds; drops it for one it does not', () => {
    const inA = buildScale(stringToNote('A'), 'natural_minor');
    const scales = (symbol: string) => getKeyScaleSuggestions(parsed(symbol), inA, CATALOGUE).map((s) => s.scale);
    expect(scales('C7')).toContain('blues');
    expect(scales('C7#9')).toContain('blues');
    expect(scales('Cmaj7')).toContain('pentatonic_major');
    expect(scales('C7/Bb')).toContain('blues'); // B♭ is a tone of C7, and of the blues scale
    expect(scales('Cmaj7/D')).toContain('pentatonic_major'); // D is in C D E G A
    expect(scales('C7/D')).not.toContain('blues'); // the blues scale has no D
    expect(scales('Cmaj7/F')).not.toContain('pentatonic_major'); // nor C D E G A an F
    expect(scales('C7#9/F')).toContain('blues'); // F is in the blues scale: it still lacks only the major 3rd
  });

  it('a slash bass outside every suggested scale leaves those scales out, not the chord (C/F♯ keeps Lydian only)', () => {
    const chord = parsed('C/F#');
    expect(getKeyScaleSuggestions(chord, buildScale(stringToNote('A'), 'natural_minor'), CATALOGUE).map((s) => s.scale)).toEqual(['lydian']);
    // Without the bass, the major chord's own three.
    expect(getKeyScaleSuggestions(buildChord(stringToNote('C'), 'major'), buildScale(stringToNote('A'), 'natural_minor'), CATALOGUE).map((s) => s.scale))
      .toEqual(['major', 'lydian', 'pentatonic_major']);
  });
});

// The review of the second round: of 96 symbols on C, ten parser-built
// chords (Cm(add11), Cm7♭9 …) and the slash chords with a bass outside
// every listed scale (C/B♭ …) were left with no scale at all — the row went.
describe('a chord no listed scale holds gets the catalogue\'s scales that do', () => {
  const inC = buildScale(stringToNote('C'), 'major');
  const offered = (symbol: string) => getKeyScaleSuggestions(parsed(symbol), inC, CATALOGUE);

  it('C/B♭: Mixolydian first; Cm(add11): Dorian and natural minor among them; Cm7♭9: Phrygian first', () => {
    expect(offered('C/Bb').map((s) => s.scale)[0]).toBe('mixolydian');
    expect(offered('Cm(add11)').map((s) => s.scale)).toEqual(expect.arrayContaining(['natural_minor', 'dorian']));
    expect(offered('Cm7b9').map((s) => s.scale)[0]).toBe('phrygian');
  });

  it('in the Scale picker\'s order, at most four, never the chromatic scale, each holding every note, with the one note', () => {
    for (const symbol of ['C/Bb', 'Cm(add11)', 'Cm7b9', 'Cmaj7/Bb', 'G7/Ab', 'C7b9b13', 'C13#9', 'C7sus4b9', 'Cmaj7b9']) {
      const chord = parsed(symbol);
      const list = scalesHoldingChord(chord, CATALOGUE);
      expect(list.length, symbol).toBeGreaterThan(0);
      expect(list.length, symbol).toBeLessThanOrEqual(HOLDING_SCALES_CAP);
      expect(HOLDING_SCALES_CAP).toBe(4);
      const all = CATALOGUE.filter((t) => t !== 'chromatic' && missing(chord, t).length === 0);
      expect(list.map((s) => s.scale), symbol).toEqual(all.slice(0, 4));
      for (const s of list) expect(s.context).toBe(HOLDS_EVERY_NOTE);
    }
  });

  it('only where nothing listed is left: a chord with its own list keeps it', () => {
    expect(offered('C7').map((s) => s.context)).not.toContain(HOLDS_EVERY_NOTE);
    expect(offered('Cmaj7#11').map((s) => s.scale)).toEqual(['lydian']);
  });

  it('a chord no catalogue scale holds keeps no scale (the row stays hidden)', () => {
    // C E G B♭ D♭ D♯ F♯ A♭: every altered tone and the perfect 5th — no scale but the chromatic holds them.
    const cluster: Chord = { root: stringToNote('C'), quality: 'dominant7alt', notes: ['C', 'E', 'G', 'Bb', 'Db', 'D#', 'F#', 'Ab'].map(stringToNote) };
    expect(scalesHoldingChord(cluster, CATALOGUE)).toEqual([]);
    expect(getKeyScaleSuggestions(cluster, inC, CATALOGUE)).toEqual([]);
    // Four of the 96 symbols the review tried: their perfect 5th, or ♭5 with a natural 13, or major 7th
    // with ♯9, are in no scale of the catalogue (the Altered scale has no perfect 5th).
    for (const symbol of ['C7#9b13', 'C13b5', 'Cm13b5', 'Cmaj7#9']) expect(offered(symbol), symbol).toEqual([]);
  });
});

describe('P1 — the nine removals stay removed', () => {
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

  it('C7♭9 and C7♯9 keep the half-whole scale (Hutchinson: C7(♭9), C7(♯9) → Octatonic Half-Whole); Altered (no perfect 5th) is gone', () => {
    expect(scalesOf('dominant7flat9')).toEqual(['diminished_half_whole:primary', 'phrygian_dominant:secondary']);
    expect(scalesOf('dominant7sharp9')).toEqual(['diminished_half_whole:primary', 'blues:secondary']);
    expect(SCALE_FORMULAS.altered).not.toContain(7);
  });

  it('C7: Mixolydian first (Hutchinson: C7 → C Mixolydian), the blues idiom, Bebop Dominant — release 16\'s order', () => {
    expect(scalesOf('dominant7')).toEqual(['mixolydian:primary', 'blues:secondary', 'bebop_dominant:color']);
  });

  it('C7alt: Altered only (Hutchinson: C7alt → Diminished-Whole Tone); half-whole has the natural 13 and 5, not the chord\'s ♭13', () => {
    expect(scalesOf('dominant7alt')).toEqual(['altered:primary']);
    expect(SCALE_FORMULAS.diminished_half_whole).not.toContain(8);
  });

  it('C7♭13: Mixolydian ♭6 only (Altered has no perfect 5th)', () => {
    expect(scalesOf('dominant7flat13')).toEqual(['mixolydian_b6:primary']);
  });

  it('Cmaj7: Major and Lydian (Hutchinson: C∆7 → C major or C Lydian), then the major pentatonic subset', () => {
    expect(scalesOf('major7')).toEqual(['major:primary', 'lydian:primary', 'pentatonic_major:secondary']);
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
