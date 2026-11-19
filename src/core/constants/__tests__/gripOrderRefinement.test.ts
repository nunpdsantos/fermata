/**
 * The coordinator's refinement of the board's order (19 November 2026, after
 * the review fix pass at aef144d): for a request with an asked bass, a bass
 * outside the chord sounds once (D/C x 3 0 2 3 2, not x 3 0 2 1 2, D7/C to
 * the ear), and — after the string count — a first-position grip comes first
 * (an open string, every stopped fret at 4 or below: G/D x x 0 0 0 3, not
 * x 5 5 4 3 3; A/C♯ x 4 2 2 2 0, not x 4 2 2 2 5; A7/C♯ x 4 2 2 2 3, not
 * x 4 5 0 5 5). Root position is pinned against fixtures/grip-root-first.json,
 * a RECORDING of the code (it pins change, it does not prove the grips right):
 * as at aef144d but for the 22 its `moved` list names, each with why (the
 * second review of builder K, items 3 and 4).
 */
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { buildChord, CHORD_FORMULAS } from '../chords';
import { chordShapesForCapo } from '../guitarChordShapes';
import type { ChordQuality, Note } from '../../types/music';
import recorded from './fixtures/grip-root-first.json';

const N = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });
const R12 = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
type Placed = { shape: { strings: { fret: number | null; finger?: unknown }[] }; baseFret: number };
const frets = (e: Placed) => e.shape.strings.map((p) => (p.fret === null ? 'x' : e.baseFret + p.fret)).join('-');
const grip = (e: Placed | undefined) => (e ? `${frets(e)}|${e.shape.strings.map((p) => (p.fret === null ? 'x' : String(p.finger))).join(' ')}` : '(none)');

describe('the first grip of 24 common slash chords', () => {
  // 21 the coordinator counts right at aef144d, unmoved; and the three the
  // two rules move: G/D, A/C♯, D/C.
  const FIRST: [string, ChordQuality, string, string][] = [
    ['D', 'major', 'F#', '2-0-0-2-3-2'], ['G', 'major', 'B', 'x-2-0-0-0-3'], ['C', 'major', 'E', '0-3-2-0-1-0'],
    ['C', 'major', 'G', '3-3-2-0-1-0'], ['G', 'major', 'F#', '2-2-0-0-0-3'], ['A', 'major', 'E', '0-0-2-2-2-0'],
    ['A', 'minor', 'C', 'x-3-2-2-1-0'], ['A', 'minor', 'E', '0-0-2-2-1-0'], ['A', 'minor', 'G', '3-0-2-2-1-0'],
    ['E', 'minor', 'G', '3-2-2-0-0-0'], ['E', 'minor', 'B', 'x-2-2-0-0-0'], ['D', 'minor', 'F', '1-0-0-2-3-1'],
    ['D', 'minor', 'A', 'x-0-0-2-3-1'], ['F', 'major', 'A', 'x-0-3-2-1-1'], ['F', 'major', 'C', 'x-3-3-2-1-1'],
    ['E', 'major', 'G#', '4-2-2-1-0-0'], ['D', 'major', 'A', 'x-0-0-2-3-2'], ['C', 'major', 'Bb', 'x-1-2-0-1-0'],
    ['G', 'dominant7', 'B', 'x-2-0-0-0-1'], ['C', 'dominant7', 'E', '0-3-2-3-1-0'], ['F', 'major7', 'A', 'x-0-3-2-1-0'],
    ['G', 'major', 'D', 'x-x-0-0-0-3'], ['A', 'major', 'C#', 'x-4-2-2-2-0'], ['D', 'major', 'C', 'x-3-0-2-3-2'],
  ];
  it.each(FIRST)('%s %s over %s: %s', (root, quality, bass, want) => {
    const { shapes, bassMatched } = chordShapesForCapo({ ...buildChord(N(root), quality), bassNote: N(bass) }, 0, 0);
    expect(bassMatched).toBe(true);
    expect(frets(shapes[0])).toBe(want);
  });

  // The learner's own path (second review, item 7): typed in Quick Search or
  // opened from a link, the symbol goes through the parser; a bass that is a
  // chord tone opens as that inversion (`inversionOfBass`, as
  // `selectChordAsWritten` does), one outside the chord stays a slash chord
  // with the bass among the notes.
  const SUFFIX: Record<string, string> = { major: '', minor: 'm', dominant7: '7', major7: 'maj7' };
  it.each(FIRST)('typed: %s %s over %s: %s', async (root, quality, bass, want) => {
    const { chordFromParsed, parseChordSymbol } = await import('../../utils/chordParser');
    const { inversionOfBass } = await import('../../../utils/chordSelection');
    const chord = chordFromParsed(parseChordSymbol(`${root}${SUFFIX[quality]}/${bass}`)!);
    const inversion = inversionOfBass(chord);
    const request = inversion === null ? chord : { ...chord, bassNote: undefined };
    const { shapes, bassMatched } = chordShapesForCapo(request, inversion ?? 0, 0);
    expect(bassMatched).toBe(true);
    expect(frets(shapes[0])).toBe(want);
  });

  it('D/C: the grip that sounds C again (x 3 0 2 1 2) is still offered, after every fuller grip that sounds it once', () => {
    const shapes = chordShapesForCapo({ ...buildChord(N('D'), 'major'), bassNote: N('C') }, 0, 0).shapes;
    const list = shapes.map(frets);
    const at = list.indexOf('x-3-0-2-1-2');
    expect(at).toBeGreaterThan(0);
    // Before it only grips that sound C once; after it only grips that sound
    // C again too, reductions of an earlier grip (strings muted) and the C- /
    // G-shape barres (rules 2, 8 and 1).
    const cs = (f: string) => f.split('-').filter((x, s) => x !== 'x' && ([40, 45, 50, 55, 59, 64][s] + Number(x)) % 12 === 0).length;
    expect(list.slice(0, at).every((f) => cs(f) === 1)).toBe(true);
    const sub = (b: string, a: string) => { const fb = b.split('-'), fa = a.split('-'); return fb.some((x, i) => x === 'x' && fa[i] !== 'x') && fb.every((x, i) => x === 'x' || x === fa[i]); };
    for (const [i, f] of list.entries()) if (i > at) expect(cs(f) > 1 || list.slice(0, i).some((a) => sub(f, a)) || /C-shape Barre|G-shape Barre/.test(shapes[i].shape.madeFrom ?? shapes[i].shape.name), f).toBe(true);
  });

  it('through the parser too (Quick Search, a share link): D/C, whose C the parser puts among its notes, still opens on x 3 0 2 3 2', async () => {
    const { chordFromParsed, parseChordSymbol } = await import('../../utils/chordParser');
    for (const [symbol, want] of [['D/C', 'x-3-0-2-3-2'], ['G/D', 'x-x-0-0-0-3'], ['A/C#', 'x-4-2-2-2-0'], ['C/Bb', 'x-1-2-0-1-0'], ['G/F#', '2-2-0-0-0-3']] as const) {
      const chord = chordFromParsed(parseChordSymbol(symbol)!);
      expect(frets(chordShapesForCapo(chord, 0, 0).shapes[0]), symbol).toBe(want);
    }
  });

  it('A7/C♯: x 4 2 2 2 3, not x 4 5 0 5 5 (one open string up the neck is not first position)', () => {
    const list = chordShapesForCapo({ ...buildChord(N('A'), 'dominant7'), bassNote: N('C#') }, 0, 0).shapes.map(frets);
    expect(list[0]).toBe('x-4-2-2-2-3');
    expect(list).toContain('x-4-5-0-5-5');
  });

  it('a bass that IS a chord tone may be doubled: Dm/F 1 0 0 2 3 1 sounds F twice and stays first', () => {
    const e = chordShapesForCapo({ ...buildChord(N('D'), 'minor'), bassNote: N('F') }, 0, 0).shapes[0];
    expect(frets(e)).toBe('1-0-0-2-3-1');
  });
});

describe('three strings first while a fuller grip is offered: only where every fuller grip doubles an outside bass', () => {
  it('every request with an asked bass, no capo (12 roots × every quality × each inversion and 12 slash basses): these four power chords only', () => {
    const thin: string[] = [];
    let requests = 0;
    const sounding = (e: Placed) => e.shape.strings.filter((p) => p.fret !== null).length;
    for (const r of R12) for (const q of Object.keys(CHORD_FORMULAS)) {
      const chord = buildChord(N(r), q as ChordQuality);
      const asks = [...chord.notes.slice(1).map((_, i) => ({ inv: i + 1, bass: null as string | null })), ...R12.map((b) => ({ inv: 0, bass: b }))];
      for (const a of asks) {
        requests++;
        const { shapes } = chordShapesForCapo(a.bass ? { ...chord, bassNote: N(a.bass) } : chord, a.inv, 0);
        if (shapes.length && sounding(shapes[0]) <= 3 && shapes.some((e) => sounding(e) >= 4)) thin.push(`${r} ${q} ${a.bass ? `/${a.bass}` : `inv ${a.inv}`}: ${frets(shapes[0])}`);
      }
    }
    // 39 with first position before the string count (5acd91c), E♭/B♭ x 1 1 0 x x
    // among them; these four remain, and not by the first-position rule: every
    // fuller grip of theirs sounds the outside bass twice (D♭5/F 1 x x 1 2 1,
    // F2 and F4), and "an outside bass sounds once" comes before the string
    // count in the coordinator's order. With it after the string count they
    // would open on those doubled grips instead (measured, not kept).
    expect(thin).toEqual(['Db power /F: 1-x-x-1-2-x', 'Db power /F#: 2-x-x-1-2-x', 'D power /G: 3-x-x-2-3-x', 'Bb power /Db: x-4-3-3-x-x']);
    expect(requests).toBe(12 * Object.keys(CHORD_FORMULAS).length * 12 + 12 * Object.values(CHORD_FORMULAS).reduce((n, f) => n + f.length - 1, 0));
  }, 300_000);
});

describe('root position as recorded: aef144d\'s first grips but for the 22 listed with why', () => {
  it('every root-position first grip, 12 roots × every quality, no capo: frets and fingers', () => {
    const got: Record<string, string> = {};
    for (const r of R12) for (const q of Object.keys(CHORD_FORMULAS)) got[`${r}|${q}`] = grip(chordShapesForCapo(buildChord(N(r), q as ChordQuality), 0, 0).shapes[0]);
    expect(got).toEqual(recorded.capo0);
    expect(Object.keys(got)).toHaveLength(12 * Object.keys(CHORD_FORMULAS).length);
    // Every move is listed with its reason, and none is one of the commonest
    // chords (the stop condition): the twelve the second review named moved
    // into first position, the rest left a grip no hand can strum.
    expect(recorded.moved).toHaveLength(22);
    for (const m of recorded.moved) {
      expect(got[m.chord]).toBe(m.now);
      expect(m.why).toMatch(/item [34]/);
      expect(['major', 'minor', 'dominant7', 'major7', 'minor7', 'sus4', 'sus2']).not.toContain(m.chord.split('|')[1]);
    }
    const NAMED_TWELVE = ['A|minor_add9', 'A|minor_six_nine', 'C|minor11', 'C|dominant7sharp9', 'Db|dominant7flat9', 'Db|dominant9sharp11', 'Db|major9sharp11', 'Db|major7sharp11', 'Db|dominant7flat5flat9', 'Ab|dominant7flat9', 'Bb|major7sharp11', 'B|dominant7flat13'];
    const firstPosition = (g: string) => { const f = g.split('|')[0].split('-').filter((x) => x !== 'x').map(Number); return f.includes(0) && f.every((x) => x <= 4); };
    for (const k of NAMED_TWELVE) expect(firstPosition(got[k]), k).toBe(true);
  });

  it('with a capo on 1 to 9 too (the recording holds a hash per capo)', () => {
    // (Each capo's list is the nut's moved up; these hashes are of the code at the second review.)
    for (let capo = 1; capo <= 9; capo++) {
      const lines: string[] = [];
      for (const r of R12) for (const q of Object.keys(CHORD_FORMULAS)) lines.push(`${r}|${q}|${grip(chordShapesForCapo(buildChord(N(r), q as ChordQuality), 0, capo).shapes[0])}`);
      expect(createHash('sha256').update(lines.join('\n')).digest('hex'), `capo ${capo}`).toBe((recorded.hashes as Record<string, string>)[capo]);
    }
  });
});
