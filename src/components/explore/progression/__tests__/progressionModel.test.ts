import { describe, it, expect } from 'vitest';
import i18n from '../../../../i18n';
import type { Note, ScaleType } from '../../../../core/types/music';
import { chordSymbol } from '../../../../core/utils/progression';
import {
  addChord, capoIdeas, capoShapes, keyChords, keyLine, moveBy, moveChord, panelKeyFor, presetViews, readChords, readableSymbols,
  relativeKey, removeChord, sheetRoots, symbolFor,
} from '../progressionModel';
import { fitSentence, keyLineSentences, keyLabel } from '../progressionText';
import { MAX_PROGRESSION_CHORDS } from '../../../../state/progressionSave';

const n = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });
const major = (s: string) => ({ root: n(s), mode: 'major' as const });
const minor = (s: string) => ({ root: n(s), mode: 'minor' as const });
const names = (cs: ReturnType<typeof readChords>) => cs.map(chordSymbol);
const tFor = (lng: string) => i18n.getFixedT(lng) as unknown as (k: string, o?: Record<string, unknown>) => string;

describe('the key the panel numbers in', () => {
  const cases: [string, ScaleType, string, 'major' | 'minor', boolean][] = [
    ['G', 'major', 'G', 'major', true],
    ['E', 'natural_minor', 'E', 'minor', true],
    ['A', 'harmonic_minor', 'A', 'minor', false],
    ['A', 'melodic_minor', 'A', 'minor', false],
    ['G', 'pentatonic_major', 'G', 'major', false],
    ['A', 'pentatonic_minor', 'A', 'minor', false],
    ['A', 'blues', 'A', 'minor', false],
    ['D', 'dorian', 'C', 'major', false],
    ['E', 'phrygian', 'C', 'major', false],
    ['G', 'mixolydian', 'C', 'major', false],
    ['Bb', 'dorian', 'Ab', 'major', false],
    ['G', 'bebop_dominant', 'C', 'major', false],
    ['C', 'whole_tone', 'C', 'major', false],
    ['A', 'hungarian_minor', 'A', 'minor', false],
  ];
  for (const [root, scale, keyRoot, mode, exact] of cases) {
    it(`${root} ${scale} → ${keyRoot} ${mode}${exact ? '' : ' (said)'}`, () => {
      const p = panelKeyFor(n(root), scale);
      expect(p).toEqual({ key: { root: n(keyRoot), mode }, exact });
    });
  }
  it('the key\'s own seven chords', () => {
    expect(keyChords(major('G')).map((c) => chordSymbol(c.chord))).toEqual(['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim']);
    expect(keyChords(minor('A')).map((c) => chordSymbol(c.chord))).toEqual(['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G']);
  });
});

describe('the chord list (saved as symbols)', () => {
  it('reads what the parser reads, leaves out the rest, at most 16', () => {
    expect(names(readChords(['G', 'nonsense', 'D/F#', '', 'Em7']))).toEqual(['G', 'D/F#', 'Em7']);
    expect(readChords(Array(40).fill('C'))).toHaveLength(MAX_PROGRESSION_CHORDS);
    // The symbols behind the chords, index for index (what the chip actions edit).
    expect(readableSymbols(['G', 'nonsense', 'D/F#', '', 'Axyz', 'Em7'])).toEqual(['G', 'D/F#', 'Em7']);
    expect(readableSymbols(Array(40).fill('C'))).toHaveLength(MAX_PROGRESSION_CHORDS);
  });
  it('a symbol reads back as the same chord (also an algorithmic one or a double flat)', () => {
    for (const s of ['F#m7', 'G/B', 'C7(#5)', 'Cm(add9)', 'Cadd9', 'Bbm7b5', 'Bbb']) {
      const c = readChords([s])[0];
      expect(symbolFor(c), s).toBe(s);
      expect(names(readChords([symbolFor(c)!])), s).toEqual(names([c]));
    }
  });
  it('add (never past 16), move left / right, remove', () => {
    const g = readChords(['G'])[0];
    expect(addChord(['C'], g)).toEqual(['C', 'G']);
    expect(addChord(Array(16).fill('C'), g)).toHaveLength(16);
    expect(moveChord(['G', 'D', 'Em', 'C'], 1, -1)).toEqual(['D', 'G', 'Em', 'C']);
    expect(moveChord(['G', 'D', 'Em', 'C'], 1, 1)).toEqual(['G', 'Em', 'D', 'C']);
    expect(moveChord(['G', 'D'], 0, -1)).toEqual(['G', 'D']);
    expect(moveChord(['G', 'D'], 1, 1)).toEqual(['G', 'D']);
    expect(removeChord(['G', 'D', 'Em'], 1)).toEqual(['G', 'Em']);
  });
});

describe('moving by half steps keeps the numbers and spells for the new key', () => {
  it('G D Em C in G: up is A♭ E♭ Fm D♭ in A♭ major, down F♯ C♯ D♯m B in F♯ major', () => {
    expect(moveBy(n('G'), 'major', ['G', 'D', 'Em', 'C'], 1)).toEqual({ root: n('Ab'), key: major('Ab'), symbols: ['Ab', 'Eb', 'Fm', 'Db'] });
    expect(moveBy(n('G'), 'major', ['G', 'D', 'Em', 'C'], -1)).toEqual({ root: n('F#'), key: major('F#'), symbols: ['F#', 'C#', 'D#m', 'B'] });
  });
  it('a ♭VII stays a ♭VII (F in G → G♭ in A♭)', () => {
    expect(moveBy(n('G'), 'major', ['G', 'F', 'C'], 1).symbols).toEqual(['Ab', 'Gb', 'Db']);
  });
  it('twelve steps up and down come back to the same chords', () => {
    let root = n('E');
    let symbols = ['E', 'A', 'B7', 'C#m'];
    for (let i = 0; i < 12; i++) ({ root, symbols } = moveBy(root, 'major', symbols, 1));
    expect(root).toEqual(n('E'));
    expect(symbols).toEqual(['E', 'A', 'B7', 'C#m']);
  });
  it('a mode moves its root and its parent key together (D Dorian → E♭ Dorian, numbered in D♭ major)', () => {
    const r = moveBy(n('D'), 'dorian', ['Dm', 'G'], 1);
    expect(panelKeyFor(r.root, 'dorian').key).toEqual(r.key);
    expect(r.key.mode).toBe('major');
    expect(names(readChords(r.symbols)).length).toBe(2);
  });
});

describe('the key line: "fit", never "is"', () => {
  const t = tFor('en');
  it('G D Em C in G major: all four fit, nothing fits more', () => {
    const chords = readChords(['G', 'D', 'Em', 'C']);
    const line = keyLine(chords, major('G'))!;
    expect(line.current).toMatchObject({ keys: [major('G')], fit: 4, total: 4, outside: [] });
    expect(line.better).toBeNull();
    expect(keyLineSentences(line, chords, t, 'en')).toEqual({ current: 'All four chords fit G major.', better: null });
  });
  it('the same chords in C major: three of four, D does not; G major fits all four', () => {
    const chords = readChords(['G', 'D', 'Em', 'C']);
    const line = keyLine(chords, major('C'))!;
    expect(line.current.fit).toBe(3);
    expect(names(line.current.outside)).toEqual(['D']);
    expect(line.better!.keys).toEqual([major('G')]);
    expect(keyLineSentences(line, chords, t, 'en')).toEqual({
      current: 'Three of four fit C major; D does not.',
      better: 'All four chords fit G major.',
    });
  });
  it('two keys nothing tells apart are named together (F G: C major and A minor)', () => {
    const chords = readChords(['F', 'G']);
    const line = keyLine(chords, major('C'))!;
    expect(line.current.keys).toEqual([major('C'), minor('A')]);
    expect(fitSentence(line.current, chords, t, 'en')).toBe('Both chords fit C major and A minor.');
  });
  it('one chord, several outside, none, and repeats counted as chips', () => {
    expect(fitSentence(keyLine(readChords(['G']), major('C'))!.current, readChords(['G']), t, 'en')).toBe('G fits C major.');
    expect(fitSentence(keyLine(readChords(['F#']), major('C'))!.current, readChords(['F#']), t, 'en')).toBe('F♯ does not fit C major.');
    const two = readChords(['C', 'F', 'Bb', 'Eb', 'F']);
    expect(fitSentence(keyLine(two, major('C'))!.current, two, t, 'en')).toBe('Three of five fit C major; B♭ and E♭ do not.');
    const one = readChords(['C', 'Db', 'Eb']);
    expect(fitSentence(keyLine(one, major('C'))!.current, one, t, 'en')).toBe('One of three fits C major; D♭ and E♭ do not.');
    const none = readChords(['Db', 'Gb']);
    expect(fitSentence(keyLine(none, major('C'))!.current, none, t, 'en')).toBe('None of them fit C major.');
  });
  it('E7 in A minor fits (the harmonic minor V); G7 in G major is from outside', () => {
    const a = readChords(['Am', 'Dm', 'E7']);
    expect(keyLine(a, minor('A'))!.current.fit).toBe(3);
    const g = readChords(['G7', 'C']);
    expect(names(keyLine(g, major('G'))!.current.outside)).toEqual(['G7']);
  });
  it('PT and ES say it in their own words', () => {
    const chords = readChords(['G', 'D', 'Em', 'C']);
    expect(keyLineSentences(keyLine(chords, major('G'))!, chords, tFor('pt'), 'pt').current).toBe('Os quatro acordes encaixam em G maior.');
    expect(keyLineSentences(keyLine(chords, major('C'))!, chords, tFor('es'), 'es').current).toBe('Tres de cuatro encajan en C mayor; D no.');
  });
  it('"more" means more different chords: a key that only fits a repeated chord more often is not offered', () => {
    // F♯ and C share no key; F♯ major fits the repeated F♯ (two chips), C major the one C.
    const chords = readChords(['F#', 'F#', 'C']);
    const line = keyLine(chords, major('C'))!;
    expect(line.current.fit).toBe(1);
    expect(line.better).toBeNull();
  });
  it('no chords, no line', () => {
    expect(keyLine([], major('C'))).toBeNull();
  });
  it('key names', () => {
    expect(keyLabel(minor('F#'), tFor('en'))).toBe('F♯ minor');
  });
});

describe('capo', () => {
  it('E♭ A♭ B♭ in E♭: up to three ideas, best first (fret 1: D G A)', () => {
    const chords = readChords(['Eb', 'Ab', 'Bb']);
    const ideas = capoIdeas(chords, major('Eb'));
    expect(ideas.map((o) => [o.fret, o.shapes.map((s) => chordSymbol(s.shape))])).toEqual([
      [1, ['D', 'G', 'A']], [6, ['A', 'D', 'E']], [3, ['C', 'F', 'G']],
    ]);
    expect(capoShapes(chords, major('Eb'), 3).map(chordSymbol)).toEqual(['C', 'F', 'G']);
  });
  it('G D Em C has open shapes already: no idea', () => {
    expect(capoIdeas(readChords(['G', 'D', 'Em', 'C']), major('G'))).toEqual([]);
    expect(capoShapes(readChords(['G']), major('G'), 0).map(chordSymbol)).toEqual(['G']);
  });
});

describe('common progressions and the "Another chord" roots', () => {
  it('in G major: the major presets on G, the minor ones on E minor (the same notes)', () => {
    const v = Object.fromEntries(presetViews(major('G')).map((p) => [p.preset.id, p]));
    expect(names(v['I-V-vi-IV'].chords)).toEqual(['G', 'D', 'Em', 'C']);
    expect(v['I-V-vi-IV'].relative).toBe(false);
    expect(names(v['i-VII-VI-VII'].chords)).toEqual(['Em', 'D', 'C', 'D']);
    expect(v['i-VII-VI-VII'].key).toEqual(minor('E'));
    expect(v['i-VII-VI-VII'].relative).toBe(true);
    expect(relativeKey(minor('E'))).toEqual(major('G'));
  });
  it('roots spelled for the key: its own notes, the others by their everyday names', () => {
    const txt = (k: ReturnType<typeof major>) => sheetRoots(k).map((r) => r.natural + r.accidental).join(' ');
    expect(txt(major('C'))).toBe('C Db D Eb E F F# G Ab A Bb B');
    expect(txt(major('G'))).toBe('C Db D Eb E F F# G Ab A Bb B');
    expect(txt(major('E'))).toBe('C C# D D# E F F# G G# A Bb B');
    expect(txt(major('Db'))).toBe('C Db D Eb E F Gb G Ab A Bb B');
  });
});
