/**
 * findKeys — which keys fit a list of chords, ranked. The expected first and
 * second place are written out per preset and per hand-typed list; the
 * presets' chords are built from the oracle's spelling, not from presetChords.
 */
import { describe, it, expect } from 'vitest';
import { findKeys } from '../findKeys';
import type { KeyCandidate } from '../types';
import { PICKER_MAJOR, PICKER_MINOR, chords, oracleScaleNote, pcOf, text } from './fixtures';

const name = (c: KeyCandidate) => `${text(c.key.root)} ${c.key.mode}`;

// The presets as degrees of the key's own scale + symbol suffix, written out by hand.
type Step = [number, string];
const PRESETS: Record<string, { mode: 'major' | 'minor'; steps: Step[] }> = {
  'I-IV-V': { mode: 'major', steps: [[1, ''], [4, ''], [5, '']] },
  'I-V-vi-IV': { mode: 'major', steps: [[1, ''], [5, ''], [6, 'm'], [4, '']] },
  'I-vi-IV-V': { mode: 'major', steps: [[1, ''], [6, 'm'], [4, ''], [5, '']] },
  'vi-IV-I-V': { mode: 'major', steps: [[6, 'm'], [4, ''], [1, ''], [5, '']] },
  'ii-V-I': { mode: 'major', steps: [[2, 'm'], [5, ''], [1, '']] },
  'twelve-bar-blues': {
    mode: 'major',
    steps: [[1, '7'], [1, '7'], [1, '7'], [1, '7'], [4, '7'], [4, '7'], [1, '7'], [1, '7'], [5, '7'], [4, '7'], [1, '7'], [5, '7']],
  },
  'i-VII-VI-VII': { mode: 'minor', steps: [[1, 'm'], [7, ''], [6, ''], [7, '']] },
  'i-iv-v': { mode: 'minor', steps: [[1, 'm'], [4, 'm'], [5, 'm']] },
};

/**
 * Expected ranking per preset, stated explicitly. `second` names the other key
 * relative to the generating one: its relative, or the major key on the IV.
 * vi–IV–I–V is the one preset where the brief's signs put the RELATIVE first:
 * its first chord is the relative minor's i and the minor's tonic is present,
 * while the major has only "tonic present". No preset ties for first place.
 */
const EXPECTED: Record<string, { first: 'generating' | 'relative'; second: 'generating' | 'relative' | 'major on IV' }> = {
  'I-IV-V': { first: 'generating', second: 'relative' },
  'I-V-vi-IV': { first: 'generating', second: 'relative' },
  'I-vi-IV-V': { first: 'generating', second: 'relative' },
  'vi-IV-I-V': { first: 'relative', second: 'generating' },
  'ii-V-I': { first: 'generating', second: 'relative' },
  'twelve-bar-blues': { first: 'generating', second: 'major on IV' },
  'i-VII-VI-VII': { first: 'generating', second: 'relative' },
  'i-iv-v': { first: 'generating', second: 'relative' },
};

// The key picker's 12 roots per mode plus the other everyday name of each black key.
const EVERYDAY = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
const MAJOR_ROOTS = [...PICKER_MAJOR, 'C#', 'D#', 'Gb', 'G#', 'A#'];
const MINOR_ROOTS = [...PICKER_MINOR, 'Db', 'D#', 'Gb', 'Ab', 'A#'];

function relativeOf(root: string, mode: 'major' | 'minor'): { pc: number; mode: 'major' | 'minor'; name: string } {
  const name = mode === 'major' ? oracleScaleNote(root, 'major', 6) : oracleScaleNote(root, 'minor', 3);
  return { pc: pcOf(name), mode: mode === 'major' ? 'minor' : 'major', name };
}

describe('findKeys: every preset in every key', () => {
  const cases = Object.entries(PRESETS).flatMap(([id, p]) =>
    (p.mode === 'major' ? MAJOR_ROOTS : MINOR_ROOTS).map((root) => [id, root] as const),
  );
  it.each(cases)('%s in %s', (id, root) => {
    const { mode, steps } = PRESETS[id];
    const symbols = steps.map(([n, suffix]) => oracleScaleNote(root, mode, n) + suffix);
    const ranked = findKeys(chords(symbols.join(' ')));
    expect(ranked).toHaveLength(24);

    const generating = { pc: pcOf(root), mode, name: root };
    const relative = relativeOf(root, mode);
    const onIV = { pc: pcOf(oracleScaleNote(root, mode, 4)), mode: 'major' as const, name: oracleScaleNote(root, mode, 4) };
    const pick = (w: string) => (w === 'generating' ? generating : w === 'relative' ? relative : onIV);
    const want = EXPECTED[id];

    const [first, second] = ranked;
    // First place: the exact key, spelled as the chords were typed — when that
    // spelling is one of the 17 everyday root names; a theoretical one (B♯,
    // E♯, F𝄪 minor as relatives of D♯, G♯, A♯ major) is read as its everyday name.
    const top = pick(want.first);
    if (EVERYDAY.includes(top.name)) expect(name(first)).toBe(`${top.name} ${top.mode}`);
    else expect([pcOf(text(first.key.root)), first.key.mode]).toEqual([top.pc, top.mode]);
    // Every chord fits the first key (the blues: only the V7 fits as written — G7 and C7 carry a ♭7).
    expect(first.fitCount).toBe(id === 'twelve-bar-blues' ? 1 : first.distinctCount);
    expect(first.tiesWithNext).toBe(false);
    // Second place: the right pitch class and mode.
    expect([pcOf(text(second.key.root)), second.key.mode]).toEqual([pick(want.second).pc, pick(want.second).mode]);
  });
});

describe('findKeys: real-shaped lists', () => {
  const TABLE: [string, string, string][] = [
    ['G D Em C', 'G major', 'E minor'],
    ['Am F C G', 'A minor', 'C major'],
    ['E A B7', 'E major', 'C# minor'],
    ['Dm G7 C', 'C major', 'A minor'],
    ['A D E', 'A major', 'F# minor'],
    ['Em C G D', 'E minor', 'G major'],
    ['Am Dm E7', 'A minor', 'D minor'],
  ];
  it.each(TABLE)('%s → %s, then %s', (input, first, second) => {
    const ranked = findKeys(chords(input));
    expect([name(ranked[0]), name(ranked[1])]).toEqual([first, second]);
  });

  it('G D Em C: numerals, counts and signs of the two keys that fit every chord', () => {
    const [g, e] = findKeys(chords('G D Em C'));
    expect(g.chords.map((c) => c.numeral)).toEqual(['I', 'V', 'vi', 'IV']);
    expect(e.chords.map((c) => c.numeral)).toEqual(['III', 'VII', 'i', 'VI']);
    expect([g.fitCount, g.distinctCount, e.fitCount]).toEqual([4, 4, 4]);
    expect(g.signs).toEqual({ firstIsTonic: true, lastIsTonic: false, dominantToTonic: false, tonicPresent: true });
    expect(e.signs).toEqual({ firstIsTonic: false, lastIsTonic: false, dominantToTonic: false, tonicPresent: true });
    expect(g.tiesWithNext).toBe(false);
  });

  it('Am Dm E7: E7 counts as fitting A minor (harmonic minor), not C major', () => {
    const ranked = findKeys(chords('Am Dm E7'));
    const am = ranked.find((c) => name(c) === 'A minor')!;
    const c = ranked.find((x) => name(x) === 'C major')!;
    expect(am.chords.map((x) => x.fits)).toEqual(['key', 'key', 'harmonicMinor']);
    expect([am.fitCount, c.fitCount, c.outsideIndexes]).toEqual([3, 2, [2]]);
  });

  it('lists the chords that do not fit, by position', () => {
    const g = findKeys(chords('G D Em C F'))[0];
    expect(name(g)).toBe('G major');
    expect(g.outsideIndexes).toEqual([4]);
    expect([g.fitCount, g.distinctCount]).toEqual([4, 5]);
  });

  it('a repeated chord counts once', () => {
    const g = findKeys(chords('G G G G D'))[0];
    expect([name(g), g.fitCount, g.distinctCount]).toEqual(['G major', 2, 2]);
  });
});

describe('findKeys: ties, spelling and edge cases', () => {
  it('a key and its relative that nothing separates tie, the major first', () => {
    for (const input of ['Dm Em', 'F G']) {
      const [a, b] = findKeys(chords(input));
      expect([name(a), name(b)]).toEqual(['C major', 'A minor']);
      expect(a.tiesWithNext).toBe(true);
      expect(a.signCount).toBe(0);
    }
  });

  it('a sign breaks the tie between relatives: Am Dm Em favours A minor', () => {
    const [a, b] = findKeys(chords('Am Dm Em'));
    expect([name(a), name(b)]).toEqual(['A minor', 'C major']);
    expect(a.tiesWithNext).toBe(false);
  });

  it('roots are spelled as the key picker would, unless the chords are typed with the other name', () => {
    expect(name(findKeys(chords('Db Gb Ab'))[0])).toBe('Db major');
    expect(name(findKeys(chords('C# F# G#'))[0])).toBe('C# major');
    expect(name(findKeys(chords('C# F# G#'))[1])).toBe('A# minor');
    expect(name(findKeys(chords('Db Gb Ab'))[1])).toBe('Bb minor');
    expect(name(findKeys(chords('C#m F#m G#7'))[0])).toBe('C# minor');
    expect(name(findKeys(chords('Gb Cb Db'))[0])).toBe('Gb major');
    expect(name(findKeys(chords('F# B C#'))[0])).toBe('F# major');
    // A key the chords do not bear on keeps the picker's spelling.
    const ranked = findKeys(chords('C# F# G#'));
    expect(ranked.filter((c) => pcOf(text(c.key.root)) === 3).map(name).sort()).toEqual(['D# minor', 'Eb major']);
  });

  it('an empty list has no keys', () => {
    expect(findKeys([])).toEqual([]);
  });

  it('a single chord: all 24 keys, the one whose tonic chord it is first', () => {
    const c = findKeys(chords('C'));
    expect(c).toHaveLength(24);
    expect(name(c[0])).toBe('C major');
    expect(c[0].signs).toEqual({ firstIsTonic: true, lastIsTonic: true, dominantToTonic: false, tonicPresent: true });
    expect(c[0].tiesWithNext).toBe(false);
    // The other keys the chord fits come next (fit 1), tied: majors first, then
    // the smaller signature (A minor 0, D and E minor 1, F minor 4), then the lower pitch class.
    const fitting = c.filter((k) => k.fitCount === 1).map(name);
    expect(fitting).toEqual(['C major', 'F major', 'G major', 'A minor', 'D minor', 'E minor', 'F minor']);
    expect(c.slice(fitting.length).every((k) => k.fitCount === 0)).toBe(true);

    expect(name(findKeys(chords('Am'))[0])).toBe('A minor');
    expect(name(findKeys(chords('E7'))[0])).toBe('A major');
  });

  it('a chord with no third (power chords) counts as the tonic chord of both modes', () => {
    const [a, b] = findKeys(chords('G5 C5 D5'));
    expect([name(a), name(b)]).toEqual(['G major', 'G minor']);
    expect(a.tiesWithNext).toBe(true);
  });

  it('V7 → I is a sign; with no wrap-around from last to first', () => {
    const c = findKeys(chords('Dm G7 C'))[0];
    expect(c.signs.dominantToTonic).toBe(true);
    const looped = findKeys(chords('C Dm G7'))[0];
    expect(name(looped)).toBe('C major');
    expect(looped.signs.dominantToTonic).toBe(false);
  });
});
