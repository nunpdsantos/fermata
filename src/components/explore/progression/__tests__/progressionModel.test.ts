import { describe, it, expect } from 'vitest';
import i18n from '../../../../i18n';
import type { Note, ScaleType } from '../../../../core/types/music';
import { chordSymbol } from '../../../../core/utils/progression';
import {
  addChord, capoIdeas, capoShapes, keyChords, keyLine, moveBy, moveChord, panelKeyFor, presetViews, readChords, readableSymbols,
  relativeKey, removeChord, sheetRoots, symbolFor,
} from '../progressionModel';
import { chordName, fitSentence, keyLineSentences, keyLabel } from '../progressionText';
import { MAX_PROGRESSION_CHORDS } from '../../../../state/progressionSave';
import { PROGRESSION_PRESETS, capoOptions, hasOpenGrip, presetChords } from '../../../../core/utils/progression';
import { chordBelowCapo, getChordShapesWithFallback } from '../../../../core/constants/guitarChordShapes';
import { getPitchClass } from '../../../../core/constants/notes';
import { MAX_CAPO_FRET } from '../../../../state/capo';
import type { Chord } from '../../../../core/types/music';

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
    // Exactly: the chords move with their numbers in the parent key (i and IV of D Dorian).
    expect(r).toEqual({ root: n('Eb'), key: major('Db'), symbols: ['Ebm', 'Ab'] });
    expect(moveBy(n('D'), 'dorian', ['Dm', 'G', 'C', 'Bb'], -1)).toEqual({ root: n('C#'), key: major('B'), symbols: ['C#m', 'F#', 'B', 'A'] });
  });
});

describe('final review of wave 2: the key line\'s guards', () => {
  const t = tFor('en');
  it('a tie is named from either key of the pair (F G in A minor: A minor and C major)', () => {
    const chords = readChords(['F', 'G']);
    const line = keyLine(chords, minor('A'))!;
    expect(line.current.keys).toEqual([minor('A'), major('C')]);
    expect(fitSentence(line.current, chords, t, 'en')).toBe('Both chords fit A minor and C major.');
  });
  it('a key that fits more different chords but fewer chips is not offered as better (C C C F♯ D♭ in C major)', () => {
    const chords = readChords(['C', 'C', 'C', 'F#', 'Db']);
    const line = keyLine(chords, major('C'))!;
    expect(line.current.fit).toBe(3);
    expect(line.better).toBeNull();
  });
});

describe('final review of wave 2: a chord the parser builds is named once', () => {
  it('chips, lists and capo shapes never double the root (Am(add9), G7♭9♯11, Cm(add9)/G)', () => {
    const cs = readChords(['Am(add9)', 'G7b9#11', 'Dm9b5', 'Cm(add9)/G']);
    expect(cs.map(chordName)).toEqual(['Am(add9)', 'G7♭9♯11', 'Dm9♭5', 'Cm(add9)/G']);
    // Capo 3: the shapes three half steps lower, named the same way.
    expect(capoShapes(cs, major('C'), 3).map(chordName)).toEqual(['F♯m(add9)', 'E7♭9♯11', 'Bm9♭5', 'Am(add9)/E']);
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
  it('E♭ A♭ B♭ in E♭: up to three ideas, best first (fret 1: D G A); fret 3 (C F G) is no idea, F has no open shape (Q11)', () => {
    const chords = readChords(['Eb', 'Ab', 'Bb']);
    const ideas = capoIdeas(chords, major('Eb'));
    expect(ideas.map((o) => [o.fret, o.shapes.map((s) => chordSymbol(s.shape))])).toEqual([
      // Fret 8 (G C D) since the search reaches every fret the capo can be set to (9).
      [1, ['D', 'G', 'A']], [6, ['A', 'D', 'E']], [8, ['G', 'C', 'D']],
    ]);
    expect(capoShapes(chords, major('Eb'), 3).map(chordSymbol)).toEqual(['C', 'F', 'G']);
  });
  it('G D Em C has open shapes already: no idea', () => {
    expect(capoIdeas(readChords(['G', 'D', 'Em', 'C']), major('G'))).toEqual([]);
    expect(capoShapes(readChords(['G']), major('G'), 0).map(chordSymbol)).toEqual(['G']);
  });
  it('an idea always gives more open shapes than no capo (every preset, 24 keys) — final review of wave 2', () => {
    let ties = 0;
    for (const preset of PROGRESSION_PRESETS) {
      for (const root of ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']) {
        const k = { root: n(root), mode: preset.mode };
        const chords = presetChords(preset, k);
        const options = capoOptions(chords, k);
        const base = options.find((o) => o.fret === 0)!.openCount;
        if (options.some((o) => o.fret > 0 && o.openCount === base)) ties++;
        for (const idea of capoIdeas(chords, k)) expect(idea.openCount, `${preset.id} in ${root}`).toBeGreaterThan(base);
      }
    }
    // The rule is exercised: some frets give exactly as many open shapes as no capo.
    expect(ties).toBeGreaterThan(0);
  });
});

// Audit 2026-11-18, Q11: "Capo ideas, for shapes with open strings" offered
// barre chords — for D♭ G♭ A♭ "Fret 1: C, F, G", for F B♭ C "Fret 1: E, A, B"
// and "Fret 5: C, F, G" (F and B have no open shape in standard tuning). A fret
// is offered only when EVERY shape it gives is an open-string shape as the
// app's own shape library defines one (hasOpenGrip: a playable library shape
// of type "open" at base fret 0), read here shape by shape, never from the
// idea's own flags.
describe('Q11: a capo idea is offered only when every shape is an open shape', () => {
  const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  it('the oracle knows its open shapes: E A D G C Am Em Dm are open; F and B are not', () => {
    for (const s of ['E', 'A', 'D', 'G', 'C', 'Am', 'Em', 'Dm']) expect(hasOpenGrip(readChords([s])[0]), s).toBe(true);
    for (const s of ['F', 'B', 'Bb', 'F#m']) expect(hasOpenGrip(readChords([s])[0]), s).toBe(false);
  });
  it('the audit\'s two progressions', () => {
    const shown = (symbols: string[], k: ReturnType<typeof major>) =>
      capoIdeas(readChords(symbols), k).map((o) => `Fret ${o.fret}: ${o.shapes.map((s) => chordSymbol(s.shape)).join(', ')}`);
    expect(shown(['Db', 'Gb', 'Ab'], major('Db'))).not.toContain('Fret 1: C, F, G');
    const f = shown(['F', 'Bb', 'C'], major('F'));
    expect(f).not.toContain('Fret 1: E, A, B');
    expect(f).not.toContain('Fret 5: C, F, G');
  });
  it('every preset, in each of the 24 keys the panel can count in (its own mode and, as the panel shows it, the relative key)', () => {
    let offered = 0;
    let none = 0;
    const wrong: string[] = [];
    for (const mode of ['major', 'minor'] as const) {
      for (const root of ROOTS) {
        const panelKey = { root: n(root), mode };
        for (const view of presetViews(panelKey)) {
          const ideas = capoIdeas(view.chords, view.key);
          if (ideas.length === 0) none++;
          for (const idea of ideas) {
            offered++;
            for (const chord of view.chords) {
              const shape = chordBelowCapo(chord, idea.fret);
              if (!hasOpenGrip(shape)) wrong.push(`${view.preset.id} in ${root} ${mode} (${view.key.root.natural}${view.key.root.accidental} ${view.key.mode}): fret ${idea.fret} gives ${chordSymbol(shape)}, no open shape`);
            }
          }
        }
      }
    }
    // Both branches are exercised: frets are still offered, and some lists offer none.
    expect(offered).toBeGreaterThan(0);
    expect(none).toBeGreaterThan(0);
    expect(wrong.slice(0, 10), `${wrong.length} shapes without open strings`).toEqual([]);
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

// Fix pass (independent review, items 4 and 7): the capo tests took the app's
// own hasOpenGrip / chordBelowCapo as truth. Here each idea is checked by
// arithmetic — the shape's root + the fret is the chord's root, its tones
// moved up by the fret are the chord's tones, and the library grip counted as
// open really sounds an open string and only the shape's tones (standard
// tuning E A D G B E) — over every fret the capo can be set to (1 … 9; the
// search stopped at 7, so "No capo gives every one of these chords a shape
// with open strings" was false for E♭ major's I–V–vi–IV, G D Em C at fret 8).
describe('capo ideas by arithmetic, every fret the capo can take', () => {
  const OPEN = [4, 9, 2, 7, 11, 4]; // E A D G B E, 6th → 1st
  const pcs = (c: Chord) => new Set<number>([...c.notes, ...(c.bassNote ? [c.bassNote] : [])].map(getPitchClass));
  /** A library grip of type "open" at the nut that sounds an open string, the root and nothing but the shape's tones. */
  const openStringGrip = (shape: Chord) => getChordShapesWithFallback(shape).some(({ shape: s, baseFret }) => {
    if (s.type !== 'open' || baseFret !== 0) return false;
    const sounding = s.strings.flatMap((p, i) => (p.fret === null || p.fret < 0 ? [] : [{ abs: baseFret + p.fret, pc: (OPEN[i] + baseFret + p.fret) % 12 }]));
    const tones = pcs(shape);
    return sounding.length >= 3 && sounding.every((x) => tones.has(x.pc)) && sounding.some((x) => x.abs === 0) && sounding.some((x) => x.pc === getPitchClass(shape.root));
  });
  const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  it('the oracle knows its grips: E A D G C Am Em Dm sound an open string; F and B do not', () => {
    for (const s of ['E', 'A', 'D', 'G', 'C', 'Am', 'Em', 'Dm']) expect(openStringGrip(readChords([s])[0]), s).toBe(true);
    for (const s of ['F', 'B', 'Bb', 'F#m']) expect(openStringGrip(readChords([s])[0]), s).toBe(false);
  });
  it('every preset, in each of the 24 keys the panel counts in: each idea true by arithmetic; "no capo gives …" true over frets 1 … 9', () => {
    expect(MAX_CAPO_FRET).toBe(9);
    const wrong: string[] = [];
    let ideasPastSeven = 0;
    let noIdeaCases = 0;
    for (const mode of ['major', 'minor'] as const) {
      for (const root of ROOTS) {
        for (const view of presetViews({ root: n(root), mode })) {
          const where = `${view.preset.id} in ${view.key.root.natural}${view.key.root.accidental} ${view.key.mode}`;
          const ideas = capoIdeas(view.chords, view.key);
          for (const idea of ideas) {
            if (idea.fret > 7) ideasPastSeven++;
            if (idea.fret < 1 || idea.fret > MAX_CAPO_FRET) wrong.push(`${where}: fret ${idea.fret}`);
            idea.shapes.forEach(({ shape }, i) => {
              const chord = view.chords[i];
              if ((getPitchClass(shape.root) + idea.fret) % 12 !== getPitchClass(chord.root)) wrong.push(`${where}: fret ${idea.fret}, ${chordSymbol(shape)} + ${idea.fret} is not ${chordSymbol(chord)}`);
              const moved = new Set([...pcs(shape)].map((p) => (p + idea.fret) % 12));
              const want = pcs(chord);
              if (moved.size !== want.size || [...want].some((p) => !moved.has(p))) wrong.push(`${where}: fret ${idea.fret}, ${chordSymbol(shape)}'s tones moved are not ${chordSymbol(chord)}'s`);
              if (!openStringGrip(shape)) wrong.push(`${where}: fret ${idea.fret} gives ${chordSymbol(shape)}, no grip with an open string`);
            });
          }
          // The sentence shown when there is no idea and no capo already gives every chord an open shape.
          const noneAtZero = !view.chords.every((c) => openStringGrip(c));
          if (ideas.length === 0 && noneAtZero) {
            noIdeaCases++;
            for (let fret = 1; fret <= MAX_CAPO_FRET; fret++) {
              if (view.chords.every((c) => openStringGrip(chordBelowCapo(c, fret)))) wrong.push(`${where}: "no capo gives …" but fret ${fret} does`);
            }
          }
        }
      }
    }
    expect(ideasPastSeven, 'frets 8 and 9 are searched').toBeGreaterThan(0);
    expect(noIdeaCases, 'both branches').toBeGreaterThan(0);
    expect(wrong.slice(0, 10), `${wrong.length} wrong`).toEqual([]);
  });
});

