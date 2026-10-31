/**
 * Right-hand arpeggio patterns (audit W10-06). Independent oracle: chord tones
 * spelled from textbook degree formulas by theoryOracle.ts, string pitches
 * hard-coded, the p-i-m-a string rules re-checked from the notes.
 * Exhaustive: every pattern × 12 major + 12 minor keys × the default
 * progression, plus I–IV–V7–I in every major key.
 */
import { describe, it, expect } from 'vitest';
import { RIGHT_HAND_PATTERNS, rightHandStudy, getRightHandPattern, DEFAULT_PROGRESSION, assignStrings } from '../rightHandPatterns';
import type { RightHandStudy } from '../rightHandPatterns';
import { preferredRootSpelling } from '../degreeSpelling';
import type { Note } from '../../types/music';
import { spellDegree, pcOf } from './theoryOracle';
import { OPEN, nameOf } from './fingeringOracle';

const mod12 = (n: number) => ((n % 12) + 12) % 12;
const QUALITY_DEGREES: Record<string, string[]> = {
  major: ['1', '3', '5'],
  minor: ['1', 'b3', '5'],
  dominant7: ['1', '3', '5', 'b7'],
};
const NUMERAL_ORACLE: Record<string, { degree: string; quality: string }> = {
  I: { degree: '1', quality: 'major' },
  IV: { degree: '4', quality: 'major' },
  V7: { degree: '5', quality: 'dominant7' },
  i: { degree: '1', quality: 'minor' },
};
const KEYS = (mode: 'major' | 'minor') =>
  Array.from({ length: 12 }, (_, pc) => preferredRootSpelling(pc, mode === 'major' ? 'major' : 'natural_minor'));

function checkStudy(study: RightHandStudy, key: Note, progression: readonly string[], label: string) {
  expect(study.bars.map((b) => b.numeral), label).toEqual([...progression]);
  study.bars.forEach((bar, bi) => {
    const where = `${label} bar ${bi + 1} (${bar.numeral})`;
    const spec = NUMERAL_ORACLE[bar.numeral];
    const root = spellDegree(nameOf(key), spec.degree)!;
    expect(nameOf(bar.chord.root), where).toBe(root);
    expect(bar.chord.quality, where).toBe(spec.quality);
    const tones = QUALITY_DEGREES[spec.quality].map((d) => spellDegree(root, d)!);

    // Strokes: the pattern's fingers, in order, one note per finger.
    expect(bar.notes.map((n) => `${n.stroke}:${n.rh}`), where).toEqual(
      study.pattern.strokes.flatMap((s, k) => s.map((f) => `${k}:${f}`)),
    );
    for (const n of bar.notes) {
      // The place sounds a chord tone, spelled as the chord spells it.
      expect(OPEN[n.stringIndex] + n.fret, where).toBe(n.midi);
      const tone = tones.find((t) => pcOf(t) === mod12(n.midi));
      expect(tone, `${where}: ${n.midi} is not a chord tone`).toBeDefined();
      expect(nameOf(n.note), where).toBe(tone);
      expect(n.fret === 0 ? n.lh === 0 : n.lh >= 1 && n.lh <= 4, `${where}: left-hand finger`).toBe(true);
    }
    // Notes plucked together are on different strings.
    for (let k = 0; k < study.pattern.strokes.length; k++) {
      const strs = bar.notes.filter((n) => n.stroke === k).map((n) => n.stringIndex);
      expect(new Set(strs).size, where).toBe(strs.length);
    }
    // p on the bass strings, below i < m < a; each finger keeps its string.
    const stringsOf = (f: string) => [...new Set(bar.notes.filter((n) => n.rh === f).map((n) => n.stringIndex))];
    const thumb = stringsOf('p');
    expect(thumb.length, where).toBeGreaterThanOrEqual(1);
    expect(thumb.length, where).toBeLessThanOrEqual(2);
    for (const f of ['i', 'm', 'a']) expect(stringsOf(f).length, `${where}: ${f} on one string`).toBeLessThanOrEqual(1);
    const [i, m, a] = ['i', 'm', 'a'].map((f) => stringsOf(f)[0]);
    const used = [i, m, a].filter((s) => s !== undefined);
    expect([...used].sort((x, y) => x - y), `${where}: i < m < a`).toEqual(used);
    for (const s of used) expect(Math.max(...thumb), `${where}: thumb above a finger`).toBeLessThan(s);
    // The thumb's first note is the lowest note of the bar, and it is the root.
    const first = bar.notes.find((n) => n.rh === 'p')!;
    expect(first.midi, where).toBe(Math.min(...bar.notes.map((n) => n.midi)));
    expect(nameOf(first.note), `${where}: bass`).toBe(root);
    // Left hand: one fret per finger in the grip, within a five-fret span.
    const lhFret = new Map<number, number>();
    for (const n of bar.notes.filter((x) => x.fret > 0)) {
      const f = lhFret.get(n.lh);
      expect(f === undefined || f === n.fret, `${where}: finger ${n.lh} on two frets`).toBe(true);
      lhFret.set(n.lh, n.fret);
    }
    const frets = [...lhFret.values()];
    if (frets.length > 0) expect(Math.max(...frets) - Math.min(...frets), where).toBeLessThanOrEqual(4);
  });
}

describe('right-hand pattern library', () => {
  it('has unique ids, p-i-m-a letters only, generic names (no study or method numbers)', () => {
    const ids = RIGHT_HAND_PATTERNS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of RIGHT_HAND_PATTERNS) {
      expect(p.name).toMatch(/^[pima+() ]+$/);
      expect(p.id).toMatch(/^[pima+-]+$/);
      for (const s of p.strokes) {
        expect(s.length).toBeGreaterThan(0);
        expect(new Set(s).size, p.id).toBe(s.length);
        for (const f of s) expect(['p', 'i', 'm', 'a']).toContain(f);
      }
      // The id spells the strokes.
      expect(p.strokes.map((s) => s.join('+')).join('-')).toBe(p.id);
      expect(getRightHandPattern(p.id)).toBe(p);
    }
  });
  it('includes the Trinity Grade-5 letter strings as plain finger sequences', () => {
    expect(getRightHandPattern('p-p-p-p-i-m-a')?.name).toBe('p p p p i m a');
    expect(getRightHandPattern('p-p-i-m-i-m')?.name).toBe('p p i m i m');
    expect(getRightHandPattern('p+a-i-m-i')?.name).toBe('(p+a) i m i');
  });
});

describe('right-hand studies — every pattern × 24 keys (oracle)', () => {
  for (const mode of ['major', 'minor'] as const) {
    it(`default progression in every ${mode} key (${DEFAULT_PROGRESSION[mode].join('–')})`, () => {
      expect(DEFAULT_PROGRESSION[mode]).toEqual(mode === 'major' ? ['I', 'V7', 'I'] : ['i', 'V7', 'i']);
      for (const key of KEYS(mode)) {
        for (const p of RIGHT_HAND_PATTERNS) {
          const study = rightHandStudy(key, mode, p.id);
          expect(study, `${nameOf(key)} ${mode} ${p.id}`).not.toBeNull();
          checkStudy(study!, key, DEFAULT_PROGRESSION[mode], `${nameOf(key)} ${mode} ${p.id}`);
        }
      }
    });
  }
  it('I–IV–V7–I in every major key', () => {
    for (const key of KEYS('major')) {
      const study = rightHandStudy(key, 'major', 'p-i-m-a-m-i', ['I', 'IV', 'V7', 'I']);
      expect(study, nameOf(key)).not.toBeNull();
      checkStudy(study!, key, ['I', 'IV', 'V7', 'I'], `${nameOf(key)} I-IV-V7-I`);
    }
  });
  it('C major p-i-m-a on the open grips: C (x32010) then G7 (320001)', () => {
    const study = rightHandStudy({ natural: 'C', accidental: '' }, 'major', 'p-i-m-a')!;
    const bar = (b: number) => study.bars[b].notes.map((n) => `${n.rh}:${6 - n.stringIndex}-${n.fret}`).join(' ');
    expect(bar(0)).toBe('p:5-3 i:3-0 m:2-1 a:1-0');
    expect(bar(1)).toBe('p:6-3 i:3-0 m:2-0 a:1-1');
    // A second thumb stroke takes the alternate bass (the next string up).
    const alt = rightHandStudy({ natural: 'C', accidental: '' }, 'major', 'p-p-i-m-i-m')!;
    expect(alt.bars[0].notes.filter((n) => n.rh === 'p').map((n) => 6 - n.stringIndex)).toEqual([5, 4]);
  });
  it('rejects unknown patterns and numerals; is deterministic', () => {
    const C: Note = { natural: 'C', accidental: '' };
    expect(rightHandStudy(C, 'major', 'p-x')).toBeNull();
    expect(rightHandStudy(C, 'major', 'p-i-m-a', ['I', 'bVII'])).toBeNull();
    expect(rightHandStudy(C, 'major', 'p-i-m-a')).toEqual(rightHandStudy(C, 'major', 'p-i-m-a'));
  });
  it('string assignment: classical 3-2-1 for i-m-a, else the three highest strings', () => {
    expect(assignStrings([1, 2, 3, 4, 5])).toEqual({ bass: [1, 2], i: 3, m: 4, a: 5 });
    expect(assignStrings([0, 1, 2, 3, 4])).toEqual({ bass: [0, 1], i: 2, m: 3, a: 4 });
    expect(assignStrings([2, 3, 4])).toBeNull();
  });
});
