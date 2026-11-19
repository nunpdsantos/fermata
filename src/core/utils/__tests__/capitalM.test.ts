/**
 * Fix pass (independent review of the 2026-11-18 audit fixes, item 5): a
 * capital M is MAJOR. "CM(add9)" and "CMadd9" read as the add9 quality with
 * the notes C E♭ G D — a minor chord under a major name, and no link symbol;
 * the whole class went the same way ("CM7b9" C E♭ G B♭ D♭, "CM6/9", "CM13#11",
 * "CMb5"), because the parser matches symbols in lower case, where M is m.
 *
 * The oracle is the symbol itself: with a capital M the chord has the major
 * 3rd (E over C) and never the minor one (E♭), or the symbol is refused. The
 * suffixes are every minor quality symbol the app writes (CHORD_SYMBOLS, "m…")
 * with its m made M, and the algorithmic tails a player types.
 */
import { describe, it, expect } from 'vitest';
import { parseChordSymbol, chordFromParsed } from '../chordParser';
import { CHORD_SYMBOLS } from '../../constants/chords';
import { getPitchClass } from '../../constants/notes';
import { chordLinkSymbol } from '../../../services/shareLinkMake';

const TAILS = [
  '(add9)', 'add9', '(add2)', 'add2', '2', 'add(9)', '(add11)', 'add11', '6', '6/9', '69', '7', '9', '11', '13',
  '7b9', '7(b9)', '7#9', '7b5', '7#5', '7sus4', 'sus2', 'sus4', 'b5', '#5', '9#11', '13#11', '7b13', '(add9)/G', 'add9/E',
];

function read(symbol: string) {
  const parsed = parseChordSymbol(symbol);
  return parsed ? chordFromParsed(parsed) : null;
}

describe('a capital M is major, or the symbol is refused', () => {
  const suffixes = [
    ...Object.values(CHORD_SYMBOLS).filter((s) => /^m(?!aj)/.test(s)).map((s) => `M${s.slice(1)}`),
    ...TAILS.map((t) => `M${t}`),
  ];
  it(`C + ${suffixes.length} M-suffixes: no minor 3rd under a capital M`, () => {
    expect(suffixes.length).toBeGreaterThan(30);
    const wrong: string[] = [];
    for (const suffix of suffixes) {
      const symbol = `C${suffix}`;
      const chord = read(symbol);
      if (!chord) continue;
      const pcs = new Set(chord.notes.map(getPitchClass));
      // A sus chord has no 3rd; a natural-11 chord usually leaves the 3rd out
      // (it clashes with the 11th), as the app's major11 / dominant11 do.
      const noThird = /sus/.test(suffix) || /(?<!#)11/.test(suffix);
      if (pcs.has(3) && !pcs.has(4)) wrong.push(`${symbol}: ${chord.notes.map((n) => n.natural + n.accidental).join(' ')} (minor 3rd)`);
      if (!noThird && !pcs.has(4)) wrong.push(`${symbol}: no major 3rd`);
    }
    expect(wrong).toEqual([]);
  });

  it('the reported symbols: CM(add9), CMadd9 are C E G D, named add9, with a link that reads back', () => {
    for (const symbol of ['CM(add9)', 'CMadd9', 'CM(add2)', 'CM2']) {
      const chord = read(symbol)!;
      expect(chord.quality, symbol).toBe('add9');
      expect(chord.notes.map((n) => n.natural + n.accidental), symbol).toEqual(['C', 'E', 'G', 'D']);
      expect(chordLinkSymbol(chord), symbol).toBe('Cadd9');
    }
  });

  it('the minor spellings are the minor add 9, notes C E♭ G D (no5: C E♭ D, still a minor add 9)', () => {
    for (const symbol of ['Cm(add9)', 'Cmadd9', 'Cmadd(9)', 'Cm(add2)', 'Cmin(add9)', 'Cmi(add9)', 'C-(add9)', 'C-add9', 'Cm2']) {
      const chord = read(symbol)!;
      expect(chord.quality, symbol).toBe('minor_add9');
      expect(chord.notes.map((n) => n.natural + n.accidental), symbol).toEqual(['C', 'Eb', 'G', 'D']);
    }
    const no5 = read('Cm(add9)no5')!;
    expect(no5.quality).toBe('minor_add9');
    expect(no5.notes.map((n) => n.natural + n.accidental)).toEqual(['C', 'Eb', 'D']);
  });

  it('classical and named M forms keep their reading: MM7, Mm7, M7, M9, M6, M7b5', () => {
    expect(read('CMM7')!.quality).toBe('major7');
    expect(read('CMm7')!.quality).toBe('dominant7');
    expect(read('CM7')!.quality).toBe('major7');
    expect(read('CM9')!.quality).toBe('major9');
    expect(read('CM6')!.quality).toBe('major6');
    expect(read('CM7b5')!.quality).toBe('major7flat5');
    expect(read('CmM7')!.quality).toBe('minor_major7');
  });
});
