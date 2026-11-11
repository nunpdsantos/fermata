/**
 * Wave 2, "From the chords you know" (u35): every chord spelling, numeral,
 * note list, fret and capo sum the ten lessons PRINT, checked against the
 * app's own engine (buildChord / buildScale / parseChordSymbol / the
 * standard tuning) — never against a second hand-written list. Where the
 * lesson states a rule ("the chords on 2, 3 and 6 are minor", "no two notes
 * of the major pentatonic are a half step apart"), the rule is checked in
 * every key the lessons use it in, or in all twelve where it is stated as
 * general.
 *
 * Also: every chord-list Try This (`chords: …`) parses, and its label names
 * exactly those chords in that order, in EN, PT and ES; every chord or note
 * a label lists is what its query plays.
 */
import { describe, it, expect } from 'vitest';
import { L1_UNITS } from '../../core/constants/curriculumL1';
import { buildChord } from '../../core/constants/chords';
import { buildScale } from '../../core/constants/scales';
import { getPitchClass } from '../../core/constants/notes';
import { TUNING_STANDARD, getTuningPitchClasses } from '../../core/constants/guitarTunings';
import { chordFromParsed, parseChordSymbol } from '../../core/utils/chordParser';
import { withGlyphs } from '../../core/utils/accidentalGlyphs';
import { stringToNote, type ChordQuality, type Note, type ScaleType } from '../../core/types/music';
import { parseChordListQuery, chordListSounds, lessonInstrumentQuery } from '../../utils/queryExecutorChords';
import { tryThisPicture } from '../../components/learn/lesson/tryThisPicture';
import ptCurriculumL1 from '../../i18n/content/pt/curriculumL1';
import esCurriculumL1 from '../../i18n/content/es/curriculumL1';

const unit = L1_UNITS.find((u) => u.id === 'u35')!;
const C: Note = { natural: 'C', accidental: '' };

/** "F♯" / "F#" / "B♭" → a Note. */
const note = (name: string): Note => stringToNote(name.replace('♯', '#').replace('♭', 'b'));
const names = (notes: readonly Note[]) => notes.map((n) => withGlyphs(`${n.natural}${n.accidental}`));
const pcs = (notes: readonly Note[]) => new Set(notes.map(getPitchClass));
const chordOf = (symbol: string) => chordFromParsed(parseChordSymbol(symbol.replace('♯', '#').replace('♭', 'b'))!);
const scaleOf = (root: string, type: ScaleType) => buildScale(note(root), type).notes;
const pcOf = (name: string) => getPitchClass(note(name));
/** The note at a fret of a string (6 = thickest … 1 = thinnest), standard tuning. */
const OPEN = getTuningPitchClasses(TUNING_STANDARD);
const fretPc = (string: number, fret: number) => (OPEN[6 - string] + fret) % 12;
/** A shape written 6th string first ('x' = not played) → the pitch classes, thickest first. */
const shapePcs = (shape: string) => [...shape].map((f, i) => (f === 'x' ? null : fretPc(6 - i, Number(f)))).filter((x): x is number => x !== null);
const pcName = (pc: number, spelling: readonly Note[]) => names(spelling.filter((n) => getPitchClass(n) === pc))[0];

describe('chord spellings printed in the lessons', () => {
  it.each([
    ['G', 'G B D'], ['C', 'C E G'], ['D', 'D F♯ A'], ['Em', 'E G B'],
    ['F♯dim', 'F♯ A C'], ['Bdim', 'B D F'], ['Gm', 'G B♭ D'],
    ['A', 'A C♯ E'], ['Am', 'A C E'], ['Dm', 'D F A'], ['F', 'F A C'],
    ['E', 'E G♯ B'], ['B', 'B D♯ F♯'],
    ['G7', 'G B D F'], ['D7', 'D F♯ A C'], ['E7', 'E G♯ B D'], ['B7', 'B D♯ F♯ A'],
  ])('%s is %s', (symbol, spelled) => {
    expect(names(chordOf(symbol).notes).join(' ')).toBe(spelled);
  });

  it('a minor chord is the major chord with its middle note a half step lower, on every note (C, D, E, G, A as printed, and all twelve)', () => {
    for (let pc = 0; pc < 12; pc++) {
      const root = buildScale(C, 'chromatic').notes[pc];
      const maj = buildChord(root, 'major').notes.map(getPitchClass);
      const min = buildChord(root, 'minor').notes.map(getPitchClass);
      expect(min[0]).toBe(maj[0]);
      expect(min[2]).toBe(maj[2]);
      expect((maj[1] - min[1] + 12) % 12).toBe(1);
    }
  });

  it('a diminished chord is the minor chord with its top note a half step lower (F♯dim, Bdim)', () => {
    for (const r of ['F#', 'B']) {
      const m = buildChord(note(r), 'minor').notes.map(getPitchClass);
      const d = buildChord(note(r), 'diminished').notes.map(getPitchClass);
      expect(d.slice(0, 2)).toEqual(m.slice(0, 2));
      expect((m[2] - d[2] + 12) % 12).toBe(1);
    }
  });

  it('a chord is every other note of its root\'s major scale (1, 3, 5): G, C, D; and G7\'s fourth note is the seventh letter, a whole step under the octave', () => {
    for (const r of ['G', 'C', 'D']) {
      const s = scaleOf(r, 'major');
      expect(names(chordOf(r).notes)).toEqual(names([s[0], s[2], s[4]]));
    }
    const g7 = chordOf('G7').notes;
    expect(g7[3].natural).toBe('F'); // G A B C D E F: the seventh letter
    expect((getPitchClass(g7[0]) - getPitchClass(g7[3]) + 12) % 12).toBe(2);
  });
});

describe('every "<chord> is <notes>" sentence in the lessons and checks (EN), read from the text itself', () => {
  const NOTE = '[A-G][♯♭]?';
  const LIST = `${NOTE}(?:, ${NOTE})*,? and ${NOTE}`;
  const NAME = `${NOTE}(?:m|dim|7)?(?: (?:major|minor|diminished))?`;
  // "<chord> is <notes>", or, for a name with its quality, "<chord>, <notes>" / "<chord>: <notes>".
  const QNAME = `${NOTE}(?:(?:m|dim|7)|(?: (?:major|minor|diminished)))`;
  const CLAIM = new RegExp(`(?<![\\p{L}♯♭])(?:(${NAME}) is|(${QNAME})(?:,|:)) (${LIST})(?![\\p{L}♯♭])`, 'gu');
  const symbolFor = (name: string) => name.replace(' major', '').replace(' minor', 'm').replace(' diminished', 'dim');
  const texts = () => {
    const out: string[] = [];
    for (const m of unit.modules) {
      for (const c of m.concepts) out.push(c.explanation, c.tryThisLabel);
      for (const t of m.tasks) out.push(t.instruction);
    }
    return out;
  };

  it('each one names exactly the notes the engine builds (and the reader finds them: at least 15)', async () => {
    const { levelCorpus } = await import('../exercises/__tests__/learnCorpus');
    const all = [...texts(), ...levelCorpus(1, 'en').filter((x) => x.moduleId.startsWith('l1u35')).flatMap((x) => [x.exercise.prompt, x.exercise.hint ?? ''])];
    let claims = 0;
    for (const text of all) {
      for (const m of text.matchAll(CLAIM)) {
        // "Open Em is E, B, E, G, B and E" lists strings: the guitar tests below check those.
        if (/open $/i.test(text.slice(0, m.index))) continue;
        // "the notes of C major: G, B, D and F" names a key, not a chord.
        if (/\bof (?:the )?$/.test(text.slice(0, m.index))) continue;
        claims++;
        const listed = m[3].split(/, and |, | and /);
        expect(listed, `${m[0]}  (in: ${text.slice(0, 80)})`).toEqual(names(chordOf(symbolFor(m[1] ?? m[2])).notes));
      }
    }
    expect(claims).toBeGreaterThanOrEqual(15);
  });

  it('the reader fires on a planted wrong spelling', () => {
    const planted = 'D is D, F and A.';
    const m = [...planted.matchAll(CLAIM)][0];
    expect(m[3].split(/, and |, | and /)).not.toEqual(names(chordOf(symbolFor(m[1] ?? m[2])).notes));
    expect([...'Hear D7, D, F♯, A and C.'.matchAll(CLAIM)][0][3]).toBe('D, F♯, A and C');
  });
});

describe('keys, numbers and families', () => {
  const triadsOf = (key: string) => {
    const s = scaleOf(key, 'major');
    // Every other note of the key, from each of its notes — the lesson's own recipe.
    return s.map((_, i) => [s[i], s[(i + 2) % 7], s[(i + 4) % 7]]);
  };
  const symbolOf = (stack: Note[]) => {
    const [r, t, f] = stack.map(getPitchClass);
    const third = (t - r + 12) % 12;
    const fifth = (f - r + 12) % 12;
    const kind = third === 4 && fifth === 7 ? '' : third === 3 && fifth === 7 ? 'm' : third === 3 && fifth === 6 ? 'dim' : '?';
    return withGlyphs(`${stack[0].natural}${stack[0].accidental}${kind}`);
  };

  it.each([
    ['G', 'G Am Bm C D Em F♯dim'],
    ['C', 'C Dm Em F G Am Bdim'],
    ['D', 'D Em F♯m G A Bm C♯dim'],
    ['A', 'A Bm C♯m D E F♯m G♯dim'],
    ['E', 'E F♯m G♯m A B C♯m D♯dim'],
  ])('the seven chords of %s major are %s (major on 1, 4, 5; minor on 2, 3, 6; diminished on 7)', (key, chords) => {
    const got = triadsOf(key).map(symbolOf);
    expect(got.join(' ')).toBe(chords);
    expect(got.map((c) => (c.endsWith('dim') ? 'dim' : c.endsWith('m') ? 'm' : 'M'))).toEqual(['M', 'm', 'm', 'M', 'M', 'm', 'dim']);
    // The engine's own triad builder agrees with every one.
    got.forEach((sym, i) => expect(pcs(chordOf(sym).notes)).toEqual(pcs(triadsOf(key)[i])));
  });

  it('numbering G: G 1, A 2, B 3, C 4, D 5, E 6, F♯ 7; D major has two sharps, F♯ and C♯; C major none', () => {
    expect(names(scaleOf('G', 'major')).join(' ')).toBe('G A B C D E F♯');
    expect(names(scaleOf('D', 'major')).filter((n) => n.includes('♯'))).toEqual(['F♯', 'C♯']);
    expect(names(scaleOf('C', 'major')).some((n) => /[♯♭]/.test(n))).toBe(false);
  });

  it('G, C, D and Em together are exactly the seven notes of G major; C F G Am fit C, D G A Bm fit D', () => {
    const together = (syms: string[]) => new Set(syms.flatMap((s) => chordOf(s).notes.map(getPitchClass)));
    expect(together(['G', 'C', 'D', 'Em'])).toEqual(pcs(scaleOf('G', 'major')));
    expect(together(['G', 'C', 'D', 'Em']).size).toBe(7);
    for (const [syms, key] of [[['C', 'F', 'G', 'Am'], 'C'], [['D', 'G', 'A', 'Bm'], 'D']] as const) {
      const key7 = pcs(scaleOf(key, 'major'));
      for (const pc of together([...syms])) expect(key7.has(pc)).toBe(true);
    }
    // F♯ is the only note of the four that the key of C does not have.
    const outsideC = [...together(['G', 'C', 'D', 'Em'])].filter((pc) => !pcs(scaleOf('C', 'major')).has(pc));
    expect(outsideC).toEqual([pcOf('F#')]);
  });

  it('I–IV–V–I and I–V–vi–IV in the keys the lessons print', () => {
    const by = (key: string, degrees: number[]) => degrees.map((d) => symbolOf(triadsOf(key)[d - 1])).join(' ');
    expect(by('G', [1, 4, 5, 1])).toBe('G C D G');
    expect(by('C', [1, 4, 5, 1])).toBe('C F G C');
    expect(by('D', [1, 4, 5, 1])).toBe('D G A D');
    expect(by('A', [1, 4, 5, 1])).toBe('A D E A');
    expect(by('E', [1, 4, 5, 1])).toBe('E A B E');
    expect(by('G', [1, 5, 6, 4])).toBe('G D Em C');
    expect(by('A', [1, 5, 6, 4])).toBe('A E F♯m D');
    expect(by('C', [1, 5, 6, 4])).toBe('C G Am F');
    expect(by('D', [1, 5, 6, 4])).toBe('D A Bm G');
    // Checks: IV of D is G; ii of C is Dm; vi of G is Em; V of D is A.
    expect(by('D', [4])).toBe('G');
    expect(by('C', [2])).toBe('Dm');
    expect(by('G', [6, 2, 3])).toBe('Em Am Bm');
    expect(by('C', [2, 3, 6])).toBe('Dm Em Am');
    expect(by('D', [2, 3, 6])).toBe('Em F♯m Bm');
  });

  it('the relative minor shares all seven notes: E minor of G, A minor of C, B minor of D; E minor spelled E F♯ G A B C D', () => {
    for (const [maj, min] of [['G', 'E'], ['C', 'A'], ['D', 'B']]) {
      expect(pcs(scaleOf(min, 'natural_minor'))).toEqual(pcs(scaleOf(maj, 'major')));
      expect(scaleOf(maj, 'major')[5].natural).toBe(min); // the vi
    }
    expect(names(scaleOf('E', 'natural_minor')).join(' ')).toBe('E F♯ G A B C D');
    // Em C D Em uses only those notes.
    for (const s of ['Em', 'C', 'D']) for (const n of chordOf(s).notes) expect(pcs(scaleOf('E', 'natural_minor')).has(getPitchClass(n))).toBe(true);
  });

  it('V holds the 7th note of the key, a half step under home, in every major key (G, C, D, A, E as printed; all twelve)', () => {
    const printed: Record<string, string> = { G: 'F♯', C: 'B', D: 'C♯', A: 'G♯', E: 'D♯' };
    for (let pc = 0; pc < 12; pc++) {
      const key = buildScale(C, 'chromatic').notes[pc];
      const s = buildScale(key, 'major').notes;
      const v = buildChord(s[4], 'major').notes;
      expect(pcs(v).has(getPitchClass(s[6]))).toBe(true);
      expect((getPitchClass(s[0]) - getPitchClass(s[6]) + 12) % 12).toBe(1);
      const name = withGlyphs(`${key.natural}${key.accidental}`);
      if (printed[name]) expect(names([s[6]])[0]).toBe(printed[name]);
    }
    // IV has no note a half step under home (C chord in G: no F♯).
    expect(pcs(chordOf('C').notes).has(pcOf('F#'))).toBe(false);
  });

  it('G7: F is not in G major but all of G7 is in C major; its B rises to C and its F falls to E; V7 of each key pulls to it', () => {
    expect(pcs(scaleOf('G', 'major')).has(pcOf('F'))).toBe(false);
    for (const n of chordOf('G7').notes) expect(pcs(scaleOf('C', 'major')).has(getPitchClass(n))).toBe(true);
    expect((pcOf('C') - pcOf('B') + 12) % 12).toBe(1);
    expect((pcOf('F') - pcOf('E') + 12) % 12).toBe(1);
    for (const [v7, home] of [['G7', 'C'], ['D7', 'G'], ['E7', 'A'], ['B7', 'E']]) {
      const s = scaleOf(home, 'major');
      expect(chordOf(v7).root.natural).toBe(s[4].natural);
      for (const n of chordOf(v7).notes) expect(pcs(s).has(getPitchClass(n))).toBe(true);
    }
    // Twelve-bar in G: I7, IV7, V7 = G7, C7, D7.
    const g = scaleOf('G', 'major');
    expect([g[0], g[3], g[4]].map((n) => `${n.natural}${n.accidental}7`)).toEqual(['G7', 'C7', 'D7']);
  });

  it('F in the key of G is ♭VII (note 7 lowered a half step, a major chord, one of G minor\'s chords); A major is not the ii of G', () => {
    const g = scaleOf('G', 'major');
    expect((getPitchClass(g[6]) - pcOf('F') + 12) % 12).toBe(1);
    expect(pcs(g).has(pcOf('F'))).toBe(false);
    for (const n of chordOf('F').notes) expect(pcs(scaleOf('G', 'natural_minor')).has(getPitchClass(n))).toBe(true);
    expect(pcs(g).has(pcOf('C#'))).toBe(false);
    expect(pcs(chordOf('A').notes).has(pcOf('C#'))).toBe(true);
    expect((pcOf('D') - pcOf('C#') + 12) % 12).toBe(1);
  });
});

describe('the pentatonics', () => {
  it.each([
    ['G', 'pentatonic_major', 'G A B D E'], ['C', 'pentatonic_major', 'C D E G A'], ['D', 'pentatonic_major', 'D E F♯ A B'],
    ['E', 'pentatonic_minor', 'E G A B D'], ['A', 'pentatonic_minor', 'A C D E G'], ['B', 'pentatonic_minor', 'B D E F♯ A'],
  ] as const)('%s %s is %s', (root, type, spelled) => {
    expect(names(scaleOf(root, type)).join(' ')).toBe(spelled);
  });

  it('in every key: the major pentatonic is the major scale without 4 and 7, has no two notes a half step apart, and 4 and 7 are each a half step from a note of I; the relative minor pentatonic has the same notes', () => {
    for (let pc = 0; pc < 12; pc++) {
      const key = buildScale(C, 'chromatic').notes[pc];
      const s = buildScale(key, 'major').notes;
      const penta = buildScale(key, 'pentatonic_major').notes;
      expect(pcs(penta)).toEqual(pcs([s[0], s[1], s[2], s[4], s[5]]));
      const p = [...pcs(penta)];
      for (const a of p) for (const b of p) expect((a - b + 12) % 12).not.toBe(1);
      const one = pcs(buildChord(key, 'major').notes);
      for (const d of [3, 6]) expect([...one].some((x) => [1, 11].includes((x - getPitchClass(s[d]) + 12) % 12))).toBe(true);
      expect(pcs(buildScale(s[5], 'pentatonic_minor').notes)).toEqual(pcs(penta));
    }
  });
});

describe('the guitar: shapes, frets and the capo (standard tuning)', () => {
  const spell = (shape: string, chord: string) => shapePcs(shape).map((pc) => pcName(pc, chordOf(chord).notes));

  it('open G sounds G B D G B G; open Em E B E G B E: three different notes each', () => {
    expect(spell('320003', 'G').join(' ')).toBe('G B D G B G');
    expect(spell('022000', 'Em').join(' ')).toBe('E B E G B E');
    expect(new Set(shapePcs('320003')).size).toBe(3);
  });

  it('E→Em, A→Am, D→Dm: the string with the middle note goes one fret lower (G string 1→0, B string 2→1, thinnest 2→1)', () => {
    expect(new Set(shapePcs('022100'))).toEqual(pcs(chordOf('E').notes));
    expect(new Set(shapePcs('022000'))).toEqual(pcs(chordOf('Em').notes));
    expect(fretPc(3, 1)).toBe(pcOf('G#'));
    expect(new Set(shapePcs('x02220'))).toEqual(pcs(chordOf('A').notes));
    expect(new Set(shapePcs('x02210'))).toEqual(pcs(chordOf('Am').notes));
    expect(fretPc(2, 2)).toBe(pcOf('C#'));
    expect(new Set(shapePcs('xx0232'))).toEqual(pcs(chordOf('D').notes));
    expect(new Set(shapePcs('xx0231'))).toEqual(pcs(chordOf('Dm').notes));
    expect(fretPc(1, 2)).toBe(pcOf('F#'));
  });

  it('in the open G and C shapes the middle note is (also) an open string', () => {
    expect(fretPc(2, 0)).toBe(getPitchClass(chordOf('G').notes[1])); // B string open = B
    expect(fretPc(1, 0)).toBe(getPitchClass(chordOf('C').notes[1])); // thinnest open = E
    expect(new Set(shapePcs('x32010'))).toEqual(pcs(chordOf('C').notes));
  });

  it('barres: Gm at fret 3 (355333), F♯m at fret 2 (244222); D-chord frets 2 and 3 of the thinnest string are F♯ and G', () => {
    expect(new Set(shapePcs('355333'))).toEqual(pcs(chordOf('Gm').notes));
    expect(new Set(shapePcs('244222'))).toEqual(pcs(chordOf('F#m').notes));
    expect([fretPc(1, 2), fretPc(1, 3)]).toEqual([pcOf('F#'), pcOf('G')]);
    // C on the guitar (sound track): fret 3 of the A string; C♯ fret 4.
    expect(fretPc(5, 3)).toBe(pcOf('C'));
  });

  it('E minor pentatonic from the open strings: thickest 0 and 3, the next three 0 and 2, the last two 0 and 3', () => {
    const frets: [number, number[]][] = [[6, [0, 3]], [5, [0, 2]], [4, [0, 2]], [3, [0, 2]], [2, [0, 3]], [1, [0, 3]]];
    const got = new Set(frets.flatMap(([s, fs]) => fs.map((f) => fretPc(s, f))));
    expect(got).toEqual(pcs(scaleOf('E', 'pentatonic_minor')));
  });

  it('a capo at fret n raises every shape n half steps: capo 2 G C D Em → A D E F♯m; capo 4 C → E; capo 5 D → G; G → A is a whole step', () => {
    const moved = (shape: string, n: number, sounds: string) => {
      const a = chordOf(shape);
      const b = chordOf(sounds);
      expect(b.quality, `${shape} + ${n}`).toBe(a.quality);
      expect(getPitchClass(b.root), `${shape} + ${n}`).toBe((getPitchClass(a.root) + n) % 12);
    };
    moved('G', 2, 'A'); moved('C', 2, 'D'); moved('D', 2, 'E'); moved('Em', 2, 'F#m');
    moved('C', 4, 'E'); moved('D', 5, 'G');
    moved('G', 2, 'A'); moved('D', 2, 'E'); moved('Em', 2, 'F#m'); moved('C', 2, 'D');
    expect((pcOf('A') - pcOf('G') + 12) % 12).toBe(2);
    expect((pcOf('E') - pcOf('C') + 12) % 12).toBe(4);
  });
});

describe('claims the review corrected (2026-11-10), each checked against the engine', () => {
  const mod = (id: string) => unit.modules.find((m) => m.id === id)!;
  const ROMAN_DEGREE: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7 };
  const triadOn = (key: string, degree: number) => {
    const s = scaleOf(key, 'major');
    return [s[degree - 1], s[(degree + 1) % 7], s[(degree + 3) % 7]];
  };
  const sameChord = (a: readonly Note[], b: readonly Note[]) => {
    expect(pcs(a)).toEqual(pcs(b));
    expect(getPitchClass(a[0])).toBe(getPitchClass(b[0]));
  };

  it('every chord list labelled "Hear <numerals> in <key>" plays the key\'s chords on those numbers, in that order (EN, PT, ES)', () => {
    const overlays = { pt: ptCurriculumL1, es: esCurriculumL1 } as const;
    let checked = 0;
    for (const m of unit.modules) {
      m.concepts.forEach((c, i) => {
        const list = parseChordListQuery(c.tryThisQuery);
        const labels = [c.tryThisLabel, overlays.pt.modules[m.id]?.concepts[i]?.tryThisLabel ?? '', overlays.es.modules[m.id]?.concepts[i]?.tryThisLabel ?? ''];
        for (const label of labels) {
          const hit = /((?:\b(?:VII|VI|IV|III|II|V|I|vii|vi|iv|iii|ii)\b(?:, | and | e | y )?)+) (?:in|em|en) ([A-G][♯♭]?):/u.exec(label);
          if (!list || !hit) continue;
          checked++;
          const numerals = hit[1].split(/, | and | e | y /).filter(Boolean);
          expect(numerals.length, `${m.id} c${i}: ${label}`).toBe(list.length);
          numerals.forEach((r, k) => {
            const want = triadOn(hit[2], ROMAN_DEGREE[r.toUpperCase()]);
            sameChord(list[k].chord.notes, want);
            // Capitals are major, small numerals minor.
            expect(r === r.toUpperCase(), `${m.id} c${i} ${r}`).toBe((getPitchClass(want[1]) - getPitchClass(want[0]) + 12) % 12 === 4);
          });
        }
      });
    }
    // Five such labels (lessons 2, 3 and 8), in each of the three languages.
    expect(checked).toBe(3 * 5);
  });

  it('lesson 2: the chart the sentence spells out (I–IV–I–V) is the one its Try This plays', () => {
    const c = mod('l1u35m2').concepts[3];
    const chart = /\b((?:I|IV|V)(?:–(?:I|IV|V))+)\b/.exec(c.explanation)![1].split('–');
    expect(chart).toEqual(['I', 'IV', 'I', 'V']);
    const list = parseChordListQuery(c.tryThisQuery)!;
    expect(list.length).toBe(chart.length);
    chart.forEach((r, k) => sameChord(list[k].chord.notes, triadOn('D', ROMAN_DEGREE[r])));
  });

  it('lesson 4: the G chord holds B, a half step under C; the label promises no B rising to C (the C chord after it is voiced with no C near B)', () => {
    const c = mod('l1u35m4').concepts[2];
    expect(pcs(chordOf('G').notes).has(pcOf('B'))).toBe(true);
    expect((pcOf('C') - pcOf('B') + 12) % 12).toBe(1);
    const sounds = chordListSounds(parseChordListQuery(c.tryThisQuery)!);
    const midi = (p: Note & { octave: number }) => (p.octave + 1) * 12 + getPitchClass(p);
    const b = sounds[1].pitches.find((p) => getPitchClass(p) === pcOf('B'))!;
    // The C a half step above the G chord's B is not in the C chord as voiced.
    expect(sounds[2].pitches.map(midi)).not.toContain(midi(b) + 1);
    expect(c.tryThisLabel).not.toMatch(/\brise/);
  });

  it('lesson 6: "every other note of its major scale" builds the MAJOR chord only; a minor chord is those places with the 3rd a half step lower (all twelve roots), and the sentence says so', () => {
    for (let pc = 0; pc < 12; pc++) {
      const root = buildScale(C, 'chromatic').notes[pc];
      const s = buildScale(root, 'major').notes;
      const stacked = [s[0], s[2], s[4]].map(getPitchClass);
      expect(buildChord(root, 'major').notes.map(getPitchClass)).toEqual(stacked);
      const minor = buildChord(root, 'minor').notes.map(getPitchClass);
      expect(minor).not.toEqual(stacked);
      expect([minor[0], (minor[1] + 1) % 12, minor[2]]).toEqual(stacked);
    }
    const text = mod('l1u35m6').concepts[0].explanation;
    expect(text.startsWith('For a major chord')).toBe(true);
    expect(text).toMatch(/minor chord takes the same three places, with its 3rd a half step lower/);
  });

  it('lesson 9: the major pentatonic is a half step from no note of I in every key, but over IV or V one of its notes is a half step from a chord note; so the lesson calls it safe over the home chord only', () => {
    const halfStep = (a: number, b: number) => [1, 11].includes((a - b + 12) % 12);
    for (let pc = 0; pc < 12; pc++) {
      const key = buildScale(C, 'chromatic').notes[pc];
      const s = buildScale(key, 'major').notes;
      const penta = [...pcs(buildScale(key, 'pentatonic_major').notes)];
      const chordOn = (d: number) => [...pcs(buildChord(s[d - 1], 'major').notes)];
      expect(penta.some((p) => chordOn(1).some((x) => halfStep(p, x)))).toBe(false);
      expect(penta.some((p) => chordOn(4).some((x) => halfStep(p, x)))).toBe(true);
      expect(penta.some((p) => chordOn(5).some((x) => halfStep(p, x)))).toBe(true);
    }
    const text = mod('l1u35m9').concepts[1].explanation;
    expect(text).not.toMatch(/safest choice over the chords of the key/);
    expect(text).toMatch(/safe first choice over the home chord/);
    expect(text).toMatch(/Over the other chords one of them can still clash/);
  });

  it('lesson 10: F is a chord of G minor (borrowed), A major is not (not borrowed: it leans to D); G, F and C are all chords of C major, so the text lets the resting chord decide', () => {
    const gMinor = scaleOf('G', 'natural_minor');
    const inGMinor = (sym: string) => chordOf(sym).notes.every((n) => pcs(gMinor).has(getPitchClass(n)));
    expect(inGMinor('F')).toBe(true);
    expect(inGMinor('A')).toBe(false);
    for (const sym of ['G', 'F', 'C']) expect(chordOf(sym).notes.every((n) => pcs(scaleOf('C', 'major')).has(getPitchClass(n)))).toBe(true);
    const m = mod('l1u35m10');
    // "Borrowed" names F only: not the subtitle, not the general sentence, not A major.
    expect(m.subtitle).not.toMatch(/borrow/i);
    expect(m.concepts[0].explanation).not.toMatch(/borrow/i);
    expect(m.concepts[2].explanation).not.toMatch(/borrow/i);
    expect(m.concepts[1].explanation).toMatch(/F is called a borrowed chord: borrowed from G minor/);
    expect(m.concepts[3].explanation).toMatch(/G, F and C are also all chords of C major/);
  });

  it('lesson 5: every "X to Xm: the <string> goes from fret a to fret b / to open" sentence moves the string that plays the 3rd, onto the minor 3rd (EN), with a planted wrong string caught', () => {
    const STRING: Record<string, number> = { 'G string': 3, 'B string': 2, 'thinnest string': 1, 'D string': 4, 'A string': 5 };
    const CLAIM = /([A-G]) to \1m: the ((?:[A-G]|thinnest) string) goes from fret (\d+) to (?:fret (\d+)|open)/g;
    const check = (text: string) => [...text.matchAll(CLAIM)].map((m) => {
      const s = STRING[m[2]];
      const from = Number(m[3]);
      const to = m[4] === undefined ? 0 : Number(m[4]);
      return fretPc(s, from) === getPitchClass(chordOf(m[1]).notes[1]) && fretPc(s, to) === getPitchClass(chordOf(`${m[1]}m`).notes[1]) && from - to === 1;
    });
    const got = check(mod('l1u35m5').concepts[1].explanation);
    expect(got).toEqual([true, true, true]);
    expect(check('A to Am: the G string goes from fret 2 to fret 1.')).toEqual([false]);
  });
});

describe('every Try This plays what its label says (EN, PT, ES)', () => {
  const overlays = { pt: ptCurriculumL1, es: esCurriculumL1 } as const;
  const SYMBOL = /(?<![\p{L}])([A-G](?:♯|♭)?(?:dim|m)?7?)(?![\p{L}\d])/gu;

  it('every chord list parses, sounds each chord once in order, shows its first chord on the instrument, and its label names those chords in that order', () => {
    let lists = 0;
    for (const mod of unit.modules) {
      mod.concepts.forEach((c, i) => {
        const list = parseChordListQuery(c.tryThisQuery);
        const picture = tryThisPicture(c.tryThisQuery, C);
        if (!c.tryThisQuery.startsWith('chords:')) {
          expect(picture.kind, `${mod.id} c${i}`).not.toBe('none');
          return;
        }
        lists++;
        expect(list, `${mod.id} c${i}`).not.toBeNull();
        expect(picture.kind).toBe('chords');
        const symbols = list!.map((e) => withGlyphs(e.symbol));
        expect(lessonInstrumentQuery(c.tryThisQuery)).toBe(list![0].symbol);
        const sounds = chordListSounds(list!);
        expect(sounds.map((s) => s.at)).toEqual(list!.map((_, k) => k));
        sounds.forEach((s, k) => {
          expect(pcs(s.pitches)).toEqual(pcs(list![k].chord.notes));
          expect(getPitchClass(s.pitches[0])).toBe(getPitchClass(list![k].chord.root)); // the root is the bass
        });
        // The twelve-bar label names the bars, not each chord.
        if (list!.length > 6) return;
        for (const label of [c.tryThisLabel, overlays.pt.modules[mod.id]?.concepts[i]?.tryThisLabel, overlays.es.modules[mod.id]?.concepts[i]?.tryThisLabel]) {
          expect(label, `${mod.id} c${i}`).toBeTruthy();
          const named = [...label!.matchAll(SYMBOL)].map((m) => m[1]).filter((s) => s !== 'I' );
          expect(named.slice(-symbols.length), `${mod.id} c${i}: ${label}`).toEqual(symbols);
        }
      });
    }
    expect(lists).toBeGreaterThanOrEqual(5);
    // Lessons 1, 2, 3, 7 and 8 each let the learner hear their chords as a loop.
    for (const n of [1, 2, 3, 7, 8]) {
      expect(unit.modules[n - 1].concepts.some((c) => c.tryThisQuery.startsWith('chords:')), `lesson ${n}`).toBe(true);
    }
  });

  it('labels that list a chord\'s or a scale\'s notes list what the query plays', () => {
    for (const mod of unit.modules) {
      mod.concepts.forEach((c, i) => {
        const picture = tryThisPicture(c.tryThisQuery, C);
        if (picture.kind !== 'chord' && picture.kind !== 'scale') return;
        const m = /:\s*((?:[A-G][♯♭]?(?:, | and )?){3,})$/.exec(c.tryThisLabel);
        if (!m) return;
        const listed = m[1].split(/, | and /).map((x) => x.trim()).filter(Boolean);
        expect(listed, `${mod.id} c${i}: ${c.tryThisLabel}`).toEqual(names(picture.notes));
      });
    }
  });

  it('every build check\'s explanation lists exactly the notes the engine builds (EN, PT, ES)', async () => {
    const { levelCorpus } = await import('../exercises/__tests__/learnCorpus');
    const RUN = /(?<![\p{L}])[A-G][♯♭]?(?:(?:, | and | e | y )[A-G][♯♭]?(?![\p{L}\d]))+/u;
    let builds = 0;
    for (const lang of ['en', 'pt', 'es'] as const) {
      for (const { moduleId, exercise } of levelCorpus(1, lang)) {
        const c = exercise.config;
        if (!moduleId.startsWith('l1u35') || (c.type !== 'chord_build' && c.type !== 'scale_build')) continue;
        builds++;
        const root = note(`${c.root}${c.rootAccidental}`);
        const want = c.type === 'chord_build' ? buildChord(root, c.quality as ChordQuality).notes : buildScale(root, c.scaleType as ScaleType).notes;
        expect(want.length, exercise.id).toBe(c.noteCount);
        const run = RUN.exec(exercise.hint ?? '')?.[0] ?? '';
        expect(run.split(/, | and | e | y /), `${lang} ${exercise.id}: ${exercise.hint}`).toEqual(names(want));
      }
    }
    expect(builds).toBe(3 * 12);
  });
});
