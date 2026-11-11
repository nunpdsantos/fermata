/**
 * Moving chords: numerals unchanged, every pitch class moved by exactly the
 * shift (checked by arithmetic on the oracle's pitch classes), no double
 * accidental the target key does not have itself, and there-and-back = the
 * identity. Also shiftKey's spelling and presetChords.
 */
import { describe, it, expect } from 'vitest';
import type { Chord } from '../../../types/music';
import { chordInKey } from '../chordInKey';
import { keyScale, shiftKey } from '../key';
import { PROGRESSION_PRESETS, getPreset, presetChords } from '../presets';
import { transposeChord, transposeProgression } from '../transpose';
import { chordSymbol } from '../symbol';
import type { MusicKey } from '../types';
import { MAJOR_KEYS, MINOR_KEYS, chord, chords, key, oracleScale, pcOf, text } from './fixtures';

const pcs = (c: Chord): number[] => c.notes.map((n) => pcOf(text(n)));
const isDouble = (s: string) => s.endsWith('##') || s.endsWith('bb');
const keyName = (k: MusicKey) => `${text(k.root)} ${k.mode}`;

describe('transposeProgression: every key, preset and shift', () => {
  const cases = PROGRESSION_PRESETS.flatMap((p) =>
    (p.mode === 'major' ? MAJOR_KEYS : MINOR_KEYS).map((r) => [p.id, r] as const),
  );
  it.each(cases)('%s from %s', (id, root) => {
    const preset = getPreset(id);
    const from = key(root, preset.mode);
    const original = presetChords(preset, from);
    for (let shift = 0; shift < 12; shift++) {
      const to = shiftKey(from, shift);
      const moved = transposeProgression(original, from, to);
      const targetScale = oracleScale(text(to.root), to.mode);
      const targetHasDoubles = targetScale.some(isDouble);
      moved.forEach((m, i) => {
        const label = `${id} ${root} +${shift} chord ${i}`;
        // Numeral and quality unchanged.
        expect([label, chordInKey(m, to).numeral]).toEqual([label, preset.numerals[i]]);
        expect(m.quality).toBe(original[i].quality);
        // Every pitch class moved by exactly the shift.
        expect([label, pcs(m)]).toEqual([label, pcs(original[i]).map((p) => (p + shift) % 12)]);
        expect(pcOf(text(m.root))).toBe((pcOf(text(original[i].root)) + shift) % 12);
        // No double accidental unless the target key's own scale has one — with
        // one exception, stated: the blues's dominant sevenths on C♭ and F♭ (IV7
        // in G♭ major; I7 and IV7 in C♭ major) are C♭ E♭ G♭ B𝄫 and F♭ A♭ C♭ E𝄫 —
        // the seventh needs the double flat on that root. Both keys appear only
        // as a source here (shift 0): shiftKey never moves to them, it spells as
        // the key picker does (F♯ and B major).
        const SEVENTH_ON: Record<string, string> = { Cb: 'Bbb', Fb: 'Ebb' };
        const allowed = id === 'twelve-bar-blues' && SEVENTH_ON[text(m.root)] ? [SEVENTH_ON[text(m.root)]] : [];
        if (!targetHasDoubles) {
          expect([label, m.notes.map(text).filter((n) => isDouble(n) && !allowed.includes(n))]).toEqual([label, []]);
        }
      });
      // There and back is the identity.
      expect(transposeProgression(moved, to, from)).toEqual(original);
    }
  });
});

describe('transposeChord: spelled for the new key', () => {
  it('the IV of F♯ major is B, of G♭ major C♭', () => {
    const iv = chord('C');
    expect(text(transposeChord(iv, key('G', 'major'), key('F#', 'major')).root)).toBe('B');
    expect(text(transposeChord(iv, key('G', 'major'), key('Gb', 'major')).root)).toBe('Cb');
    expect(transposeChord(iv, key('G', 'major'), key('Gb', 'major')).notes.map(text)).toEqual(['Cb', 'Eb', 'Gb']);
  });

  it('a ♭VII stays a ♭VII, an outside note keeps its degree', () => {
    const c = key('C', 'major');
    for (const target of ['G', 'F#', 'Gb', 'Db', 'E']) {
      const t = key(target, 'major');
      const m = transposeChord(chord('Bb'), c, t);
      expect([target, chordInKey(m, t).numeral]).toEqual([target, '♭VII']);
    }
    expect(chordSymbol(transposeChord(chord('Bb'), c, key('F#', 'major')))).toBe('E');
    expect(chordSymbol(transposeChord(chord('G7'), key('G', 'major'), key('E', 'major')))).toBe('E7');
    expect(transposeChord(chord('G7'), key('G', 'major'), key('Db', 'major')).notes.map(text)).toEqual(['Db', 'F', 'Ab', 'Cb']);
  });

  it('slash chords and algorithmic chords move whole', () => {
    const m = transposeChord(chord('D/F#'), key('G', 'major'), key('A', 'major'));
    expect(chordSymbol(m)).toBe('E/G#');
    expect(chordInKey(m, key('A', 'major')).numeral).toBe('V');
    const alg = transposeChord(chord('Am(add9)'), key('G', 'major'), key('Bb', 'major'));
    expect(chordSymbol(alg)).toBe('Cm(add9)');
    expect(alg.notes.map(text)).toEqual(['C', 'Eb', 'G', 'D']);
  });

  it('a root typed as an enharmonic of a key note moves as the note it sounds', () => {
    expect(chordSymbol(transposeChord(chord('C#'), key('Db', 'major'), key('C', 'major')))).toBe('C');
  });

  it('chords typed in a minor key keep their minor numerals', () => {
    const am = key('A', 'minor');
    const moved = transposeProgression(chords('Am G F E7'), am, key('E', 'minor'));
    expect(moved.map(chordSymbol)).toEqual(['Em', 'D', 'C', 'B7']);
    expect(moved.map((m) => chordInKey(m, key('E', 'minor')).numeral)).toEqual(['i', 'VII', 'VI', 'V7']);
  });
});

describe('shiftKey', () => {
  it.each([
    ['B major', 1, 'C major'], ['C major', -1, 'B major'], ['C major', 1, 'Db major'], ['F major', 1, 'F# major'],
    ['E major', 1, 'F major'], ['G major', 2, 'A major'], ['A minor', 1, 'Bb minor'], ['B minor', 1, 'C minor'],
    ['B minor', 2, 'C# minor'], ['F# minor', 2, 'G# minor'], ['D minor', 1, 'Eb minor'], ['G major', -14, 'F major'],
    ['Gb major', 0, 'Gb major'], ['Gb major', 12, 'Gb major'], ['Gb major', 1, 'G major'], ['D# minor', 0, 'D# minor'],
  ])('%s %i → %s', (from, s, to) => {
    const [r, m] = from.split(' ');
    expect(keyName(shiftKey(key(r, m as 'major' | 'minor'), s))).toBe(to);
  });

  it('never gives a white key a sharp or flat name, in either mode', () => {
    for (const mode of ['major', 'minor'] as const) {
      for (let s = 1; s < 12; s++) {
        const k = shiftKey(key('C', mode), s);
        if ([0, 2, 4, 5, 7, 9, 11].includes(pcOf(text(k.root)))) expect(k.root.accidental).toBe('');
        expect(keyScale(k).some((n) => n.accidental.length === 2)).toBe(false);
      }
    }
  });
});

describe('presetChords and PROGRESSION_PRESETS', () => {
  it('spells each preset in G major / E minor as written out here', () => {
    const G = key('G', 'major');
    const E = key('E', 'minor');
    const got = Object.fromEntries(
      PROGRESSION_PRESETS.map((p) => [p.id, presetChords(p, p.mode === 'major' ? G : E).map(chordSymbol).join(' ')]),
    );
    expect(got).toEqual({
      'I-IV-V': 'G C D',
      'I-V-vi-IV': 'G D Em C',
      'I-vi-IV-V': 'G Em C D',
      'vi-IV-I-V': 'Em C G D',
      'ii-V-I': 'Am D G',
      'twelve-bar-blues': 'G7 G7 G7 G7 C7 C7 G7 G7 D7 C7 G7 D7',
      'i-VII-VI-VII': 'Em D C D',
      'i-iv-v': 'Em Am Bm',
    });
  });

  it('every preset lists the numerals its chords get, in every key of its mode', () => {
    for (const p of PROGRESSION_PRESETS) {
      for (const r of p.mode === 'major' ? MAJOR_KEYS : MINOR_KEYS) {
        const k = key(r, p.mode);
        expect([p.id, r, presetChords(p, k).map((c) => chordInKey(c, k).numeral)]).toEqual([p.id, r, p.numerals]);
      }
    }
  });

  it('ids are unique, eight presets, each with as many numerals as chords', () => {
    expect(new Set(PROGRESSION_PRESETS.map((p) => p.id)).size).toBe(PROGRESSION_PRESETS.length);
    expect(PROGRESSION_PRESETS).toHaveLength(8);
    for (const p of PROGRESSION_PRESETS) expect(p.numerals).toHaveLength(p.steps.length);
    expect(() => getPreset('nope' as never)).toThrow();
  });

  it('a preset asked for in a key of the other mode uses the same tonic in its own mode', () => {
    expect(presetChords(getPreset('i-iv-v'), key('G', 'major')).map(chordSymbol)).toEqual(['Gm', 'Cm', 'Dm']);
  });
});
