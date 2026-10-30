// Notation-variant matrix (audit W9-27 / W9-28 / W9-29).
//
//  W9-27  Classical seventh-chord labels are CASE-SENSITIVE: MM7 = major-major
//         (major 7th), Mm7 = major-minor (dominant 7th), mm7 = minor-minor
//         (minor 7th). Before the fix all three parsed as minor-major 7th.
//         mM7 (minor triad + major 7th) keeps meaning minor-major.
//  W9-28  Roots written with the unicode double sharp / double flat (𝄪 𝄫) parse
//         exactly like their ASCII spelling (## / bb), including the "mi" minor
//         abbreviation that previously went through the lenient algorithmic
//         path and returned a C major triad for "C𝄪mi".
//  W9-29  The triangle typed on a Mac (∆ U+2206) and the geometric triangle
//         (△ U+25B3) are aliases of the Greek Δ (U+0394) for the major 7th.
//
// Oracle: the core chord builder (buildChord) for the expected quality — the
// notes must be IDENTICAL (letters + accidentals), and every pitch must be right.

import { describe, it, expect } from 'vitest';
import { parseChordSymbol, chordFromParsed } from '../chordParser';
import { buildChord } from '../../constants/chords';
import { getPitchClass } from '../../constants/notes';
import type { Accidental, ChordQuality, NaturalNote, Note } from '../../types/music';

const LETTERS: NaturalNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const SINGLE: Accidental[] = ['', '#', 'b'];
const ROOTS: Note[] = LETTERS.flatMap((natural) => SINGLE.map((accidental) => ({ natural, accidental })));
const rootText = (n: Note) => `${n.natural}${n.accidental}`;
const spell = (notes: Note[]) => notes.map(rootText).join(' ');

function notesOf(input: string): string | null {
  const parsed = parseChordSymbol(input);
  return parsed ? spell(chordFromParsed(parsed).notes) : null;
}

describe('W9-27 classical seventh-chord labels are case-sensitive', () => {
  const LABELS: Array<[string, ChordQuality]> = [
    ['MM7', 'major7'],
    ['Mm7', 'dominant7'],
    ['mm7', 'minor7'],
    // Unchanged neighbour: lower-case m + capital M is the minor-major 7th.
    ['mM7', 'minor_major7'],
  ];

  for (const [label, quality] of LABELS) {
    it(`${label} → ${quality} for all 21 roots`, () => {
      for (const root of ROOTS) {
        const parsed = parseChordSymbol(`${rootText(root)}${label}`);
        expect(parsed, `${rootText(root)}${label}`).not.toBeNull();
        expect(parsed!.quality, `${rootText(root)}${label}`).toBe(quality);
        expect(spell(chordFromParsed(parsed!).notes)).toBe(spell(buildChord(root, quality).notes));
      }
    });
  }

  it('the three labels give three different chords (G: maj7, dom7, min7)', () => {
    expect(notesOf('GMM7')).toBe('G B D F#');
    expect(notesOf('GMm7')).toBe('G B D F');
    expect(notesOf('Gmm7')).toBe('G Bb D F');
  });

  it('labels keep working with a slash bass', () => {
    const parsed = parseChordSymbol('GMm7/B');
    expect(parsed!.quality).toBe('dominant7');
    expect(parsed!.bassNote).toEqual({ natural: 'B', accidental: '' });
  });
});

describe('W9-28 unicode double-accidental roots', () => {
  const DOUBLE: Array<[string, Accidental]> = [
    ['𝄪', '##'],
    ['𝄫', 'bb'],
  ];
  const QUALITIES: Array<[string, ChordQuality]> = [
    ['', 'major'],
    ['m', 'minor'],
    ['mi', 'minor'],
    ['m7', 'minor7'],
    ['7', 'dominant7'],
    ['maj7', 'major7'],
    ['dim', 'diminished'],
  ];

  for (const [glyph, ascii] of DOUBLE) {
    for (const [suffix, quality] of QUALITIES) {
      it(`<letter>${glyph}${suffix} parses as <letter>${ascii} ${quality}, pitches intact`, () => {
        for (const natural of LETTERS) {
          const root: Note = { natural, accidental: ascii };
          const input = `${natural}${glyph}${suffix}`;
          const parsed = parseChordSymbol(input);
          expect(parsed, input).not.toBeNull();
          expect(parsed!.root, input).toEqual(root);
          expect(parsed!.quality, input).toBe(quality);
          // Same result as the ASCII spelling of the same chord.
          expect(notesOf(input), input).toBe(notesOf(`${natural}${ascii}${suffix}`));
          // Every pitch is right even where a letter-true spelling would need a
          // triple accidental (e.g. Cbb minor's third is E-triple-flat).
          const expectedPcs = buildChord(root, quality).notes.map(getPitchClass);
          expect(chordFromParsed(parsed!).notes.map(getPitchClass), input).toEqual(expectedPcs);
        }
      });
    }
  }

  it('C𝄪mi is a C-double-sharp minor triad (was a C major triad + C)', () => {
    expect(notesOf('C𝄪mi')).toBe('C## E# G##');
  });

  it('"mi" is accepted as minor on every single-accidental root too', () => {
    for (const root of ROOTS) {
      const parsed = parseChordSymbol(`${rootText(root)}mi`);
      expect(parsed!.quality).toBe('minor');
      expect(chordFromParsed(parsed!).notes.map(getPitchClass)).toEqual(
        buildChord(root, 'minor').notes.map(getPitchClass),
      );
    }
  });

  it('a unicode double accidental in the slash bass still parses', () => {
    const parsed = parseChordSymbol('C/E𝄫');
    expect(parsed!.bassNote).toEqual({ natural: 'E', accidental: 'bb' });
  });

  it('algorithmic-path chords on double-accidental roots keep every pitch right', () => {
    // Complex qualities with no explicit table entry go through the algorithmic
    // builder; its spelling fallback must never change a pitch.
    for (const natural of LETTERS) {
      for (const [glyph, ascii] of DOUBLE) {
        const parsed = parseChordSymbol(`${natural}${glyph}m7b5#9`);
        expect(parsed, `${natural}${glyph}m7b5#9`).not.toBeNull();
        const rootPc = getPitchClass({ natural, accidental: ascii });
        const pcs = chordFromParsed(parsed!).notes.map(getPitchClass);
        // root, m3, b5, b7, #9 (= m3 an octave up, so the set has 4 classes)
        const expected = [0, 3, 6, 10].map((st) => (rootPc + st) % 12);
        expect(new Set(pcs), `${natural}${glyph}m7b5#9`).toEqual(new Set(expected));
      }
    }
  });
});

describe('W9-29 triangle glyphs for the major 7th', () => {
  // ∆ U+2206 INCREMENT (inferred: macOS Option-J); △ U+25B3 WHITE UP-POINTING
  // TRIANGLE; Δ U+0394 GREEK CAPITAL DELTA (already supported).
  const GLYPHS = ['∆', '△', 'Δ'];
  const SUFFIXES: Array<[string, ChordQuality]> = [
    ['', 'major7'],
    ['7', 'major7'],
    ['9', 'major9'],
    ['13', 'major13'],
    ['7#11', 'major7sharp11'],
  ];

  for (const glyph of GLYPHS) {
    for (const [suffix, quality] of SUFFIXES) {
      it(`U+${glyph.codePointAt(0)!.toString(16).toUpperCase()} + "${suffix}" → ${quality} for all 21 roots`, () => {
        for (const root of ROOTS) {
          const input = `${rootText(root)}${glyph}${suffix}`;
          const parsed = parseChordSymbol(input);
          expect(parsed, input).not.toBeNull();
          expect(parsed!.quality, input).toBe(quality);
          expect(spell(chordFromParsed(parsed!).notes)).toBe(spell(buildChord(root, quality).notes));
        }
      });
    }
  }

  it('minor-major with the Mac triangle (Cm∆7) is the minor-major 7th', () => {
    expect(parseChordSymbol('Cm∆7')!.quality).toBe('minor_major7');
    expect(parseChordSymbol('C-△7')!.quality).toBe('minor_major7');
  });
});
