import { describe, it, expect } from 'vitest';
import { withGlyphs, isMusicName, glyphsIfName } from '../accidentalGlyphs';
import { noteToString, type Accidental, type NaturalNote } from '../../types/music';

const LETTERS: NaturalNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const ACCIDENTALS: Accidental[] = ['bb', 'b', '', '#', '##'];

describe('withGlyphs — one display helper for note, key and chord names', () => {
  it('notes, from a Note or its ASCII name', () => {
    expect(withGlyphs('Eb')).toBe('E♭');
    expect(withGlyphs('F#')).toBe('F♯');
    expect(withGlyphs('Cb')).toBe('C♭');
    expect(withGlyphs('E#')).toBe('E♯');
    expect(withGlyphs('F##')).toBe('F𝄪');
    expect(withGlyphs('Bbb')).toBe('B𝄫');
    expect(withGlyphs({ natural: 'B', accidental: 'b' })).toBe('B♭');
    expect(withGlyphs({ natural: 'G', accidental: '##' })).toBe('G𝄪');
    expect(withGlyphs('Bb4')).toBe('B♭4');
  });

  it('is the drill bank’s old displayNote for all 35 spellings (its strings are grading values)', () => {
    const old = (s: string) => s.replace(/##/g, '𝄪').replace(/#/g, '♯').replace(/bb/g, '𝄫').replace(/b/g, '♭');
    for (const natural of LETTERS) {
      for (const accidental of ACCIDENTALS) {
        const n = { natural, accidental };
        expect(withGlyphs(n)).toBe(old(noteToString(n)));
      }
    }
  });

  it('chord symbols: root, alterations and slash bass', () => {
    expect(withGlyphs('Bbm7')).toBe('B♭m7');
    expect(withGlyphs('F#dim')).toBe('F♯dim');
    expect(withGlyphs('Ebmaj7/G')).toBe('E♭maj7/G');
    expect(withGlyphs('Ebmaj7/Bb')).toBe('E♭maj7/B♭');
    expect(withGlyphs('Cm7b5')).toBe('Cm7♭5');
    expect(withGlyphs('C7b9')).toBe('C7♭9');
    expect(withGlyphs('Bb7(#11)')).toBe('B♭7(♯11)');
    expect(withGlyphs('Cmaj7#11')).toBe('Cmaj7♯11');
    expect(withGlyphs('Ebaug')).toBe('E♭aug');
    expect(withGlyphs('Absus4')).toBe('A♭sus4');
    expect(withGlyphs('Dbadd9')).toBe('D♭add9');
    expect(withGlyphs('B#°')).toBe('B♯°');
    expect(withGlyphs('C#ø7')).toBe('C♯ø7');
    expect(withGlyphs('Gbb7')).toBe('G𝄫7');
    expect(withGlyphs('Bbm Ebm G#m B#°')).toBe('B♭m E♭m G♯m B♯°');
    // A suffix printed apart from its root (the chord cards' quality span).
    expect(withGlyphs('m7b5')).toBe('m7♭5');
    expect(withGlyphs('7#9')).toBe('7♯9');
    expect(withGlyphs('maj7')).toBe('maj7');
  });

  it('keys, numerals, degrees and signature counts', () => {
    expect(withGlyphs('Eb major')).toBe('E♭ major');
    expect(withGlyphs('F# Melodic Minor')).toBe('F♯ Melodic Minor');
    expect(withGlyphs('Bb Bebop Dominant')).toBe('B♭ Bebop Dominant');
    expect(withGlyphs('bVII')).toBe('♭VII');
    expect(withGlyphs('bIII+')).toBe('♭III+');
    expect(withGlyphs('#iv°7')).toBe('♯iv°7');
    expect(withGlyphs('I - bVII - IV - I')).toBe('I - ♭VII - IV - I');
    expect(withGlyphs('b3')).toBe('♭3');
    expect(withGlyphs('#11')).toBe('♯11');
    expect(withGlyphs('bb7')).toBe('𝄫7');
    expect(withGlyphs('3b')).toBe('3♭');
    expect(withGlyphs('7#')).toBe('7♯');
    expect(withGlyphs('F–Ab–C–Eb')).toBe('F–A♭–C–E♭');
    expect(withGlyphs('C→C#, E→E')).toBe('C→C♯, E→E');
    expect(withGlyphs('Bb+D')).toBe('B♭+D');
  });

  it('leaves words, naturals and existing glyphs alone (and is idempotent)', () => {
    for (const s of ['Bebop', 'Blues', 'Dbl Harm.', 'About', 'Absolute', 'Abbey', 'Ebony', 'Dorian', 'Augmented',
      'Diminished', 'Add', 'big', 'bit', 'C', 'Cm', 'G7', 'Major', 'sharp', 'b', '#', '', 'E♭', '♭VII', 'no ♯/♭',
      'Double Harmonic', 'Half-Diminished 7th', '6/9', 'R', '1']) {
      expect(withGlyphs(s), s).toBe(s);
    }
    for (const s of ['Bbm7', 'Eb major', 'C7b9', 'bVII', 'F##']) expect(withGlyphs(withGlyphs(s))).toBe(withGlyphs(s));
  });
});

describe('isMusicName / glyphsIfName — a Learn choice is changed only when it is names only', () => {
  it('names only', () => {
    for (const s of ['F', 'D#', 'Db major', 'F# maior', 'F# mayor', 'C–Eb–G', 'C→B, E→E, G→G#', 'I - bVII - IV - I',
      'Ab, C, Eb, F# — b6, 1, b3, #4', 'Bbm7', 'Ebmaj7/G', 'Em', 'Em7', 'E♭m', 'Ebm', 'Em Am', 'Bb major, Eb major']) {
      expect(isMusicName(s), s).toBe(true);
    }
    expect(glyphsIfName('D#')).toBe('D♯');
    // A key with its triad's notes, in each language and with each joiner.
    expect(glyphsIfName('Db major (Db-F-Ab)')).toBe('D♭ major (D♭-F-A♭)');
    expect(glyphsIfName('Db maior (Db-F-Ab)')).toBe('D♭ maior (D♭-F-A♭)');
    expect(glyphsIfName('Db mayor (Db–F–Ab)')).toBe('D♭ mayor (D♭–F–A♭)');
    expect(glyphsIfName('Bb menor (Bb, Db, F)')).toBe('B♭ menor (B♭, D♭, F)');
    expect(glyphsIfName('F# minor (F#-A-C#)')).toBe('F♯ minor (F♯-A-C♯)');
    expect(glyphsIfName('Ab, C, Eb, F# — b6, 1, b3, #4')).toBe('A♭, C, E♭, F♯ — ♭6, 1, ♭3, ♯4');
  });

  it('prose with a name inside stays exactly as written (a content release, not a display change)', () => {
    // PT "Em" (= "In") is not E minor in a sentence; ES "En" never parsed as a name.
    for (const s of ['Em A menor: Bb maior (Bb-D-F)', 'Em E menor: F# maior (F#-A#-C#)', 'Em A menor', 'En A menor: Bb mayor',
      'In A minor: Bb major (Bb-D-F)', 'Em A menor Bb maior', 'major', 'Bb7 major',
      'In C minor: Db major (Db-F-Ab)', 'Em A menor (A-C-E)', 'Db major (Db-F-Ab) and resolves to C', 'Db major (one flat)',
      'Db major (Db-F-Ab', 'G major (G–B–D) and resolves to C major', 'Em C maior, bVI é Ab maior (Ab-C-Eb), emprestado de C menor']) {
      expect(isMusicName(s), s).toBe(false);
      expect(glyphsIfName(s)).toBe(s);
    }
    for (const s of ['Key signature: F#', '1 sharp (F#)', 'The relative minor of Eb major is C minor',
      'C7(#9) indica E, Bb, D#', 'Shell de E7: E, G#, D', 'Dbl Harm.', 'About Bb', 'Bebop', 'Major 3rd', '']) {
      expect(isMusicName(s), s).toBe(false);
      expect(glyphsIfName(s)).toBe(s);
    }
  });
});
