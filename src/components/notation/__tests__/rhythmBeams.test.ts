/**
 * Review W4b — rhythm notation beams by the METER's grouping, not VexFlow's
 * default groups (which beamed 7/8 2+2+3 as 2+2+2+1). Every rhythm in the
 * curriculum is checked against beam spans written here from the rules of
 * notation (simple time: the beat; compound time: the dotted quarter; an
 * additive meter: the grouping its lesson names), and against an oracle
 * that re-derives the beams from the written values with its own tokenizer,
 * not the app's parser.
 */
import { describe, it, expect } from 'vitest';
import { beamSpans, rhythmBeams } from '../rhythmBeams';
import { isAdditiveMeter, meterGrouping, parseTimeSignature, rhythmProblems } from '../../../core/utils/rhythm';
import type { RhythmPattern } from '../../../core/types/exercise';
import { curriculumRhythms } from './curriculumRhythms';

const all = curriculumRhythms();
function at(where: string): RhythmPattern {
  const found = all.find((r) => r.where === where);
  if (!found) throw new Error(`no rhythm at ${where}`);
  return found.pattern;
}

/** Beam spans in quarter notes for every non-additive meter the curriculum uses. */
const SPANS: Record<string, number[]> = {
  // Simple time: by the beat.
  '2/4': [1, 1],
  '3/4': [1, 1, 1],
  '4/4': [1, 1, 1, 1],
  '5/4': [1, 1, 1, 1, 1],
  '2/2': [2, 2],
  // Compound time: by the dotted quarter.
  '6/8': [1.5, 1.5],
  '9/8': [1.5, 1.5, 1.5],
  '12/8': [1.5, 1.5, 1.5, 1.5],
};

/** Additive meters: the grouping (in eighths) the lesson or question itself names. */
const ADDITIVE: Record<string, { groups: number[]; evidence: string }> = {
  'l4u14m2 concept 1': { groups: [2, 2, 3], evidence: "tryThisLabel 'Hear 7/8 grouped 2+2+3' (grouping declared)" },
  'l4u14m2e2': { groups: [2, 2, 3], evidence: "answer 'Unequal groups of eighths, e.g. 2+2+3'; accents on eighths 1, 3, 5 (no grouping declared yet)" },
};

function expectedSpans(where: string, pattern: RhythmPattern): number[] {
  const [, unit] = parseTimeSignature(pattern.time);
  if (isAdditiveMeter(parseTimeSignature(pattern.time))) return ADDITIVE[where].groups.map((g) => (g * 4) / unit);
  return SPANS[pattern.time];
}

// ── the oracle: its own token table, onsets summed from the written values ──
const VALUE: Record<string, number> = { w: 4, h: 2, q: 1, '8': 0.5, '16': 0.25 };
interface Written { bar: number; onset: number; beamable: boolean; triplet: boolean }
function written(notes: string): Written[] {
  const out: Written[] = [];
  notes.split('|').map((b) => b.trim()).filter(Boolean).forEach((bar, b) => {
    let t = 0;
    for (const tok of bar.split(/\s+/)) {
      const m = /^>?(t)?(w|h|q|16|8)(\.)?(r)?~?$/.exec(tok)!;
      const triplet = !!m[1];
      out.push({ bar: b, onset: t, triplet, beamable: !triplet && !m[4] && (m[2] === '8' || m[2] === '16') });
      t += VALUE[m[2]] * (m[3] ? 1.5 : 1) * (triplet ? 2 / 3 : 1);
    }
  });
  return out;
}
function spanOf(onset: number, spans: number[]): number {
  let end = 0;
  for (let s = 0; s < spans.length; s++) {
    end += spans[s];
    if (onset < end - 1e-9) return s;
  }
  return spans.length;
}
/** Consecutive eighths/sixteenths starting in one span share a beam; triplets beam in threes. */
function oracle(notes: string, spans: number[]): number[][] {
  const w = written(notes);
  const beams: number[][] = [];
  let run: number[] = [];
  let triplet: number[] = [];
  w.forEach((v, i) => {
    const prev = w[i - 1];
    const joins = v.beamable && prev?.beamable && prev.bar === v.bar && spanOf(prev.onset, spans) === spanOf(v.onset, spans);
    if (!joins) {
      if (run.length > 1) beams.push(run);
      run = [];
    }
    if (v.beamable) run.push(i);
    if (v.triplet) {
      triplet.push(i);
      if (triplet.length === 3) {
        beams.push(triplet);
        triplet = [];
      }
    }
  });
  if (run.length > 1) beams.push(run);
  return beams.sort((a, b) => a[0] - b[0]);
}
const notesOf = (pattern: RhythmPattern) => rhythmBeams(pattern).map((b) => b.notes);

describe('rhythm beams follow the meter (review W4b)', () => {
  it('the curriculum has rhythms in simple, compound and additive meters, and each has a written expectation', () => {
    const times = new Set(all.map((r) => r.pattern.time));
    for (const t of ['4/4', '3/4', '6/8', '9/8', '7/8']) expect(times, t).toContain(t);
    for (const { where, pattern } of all) {
      if (isAdditiveMeter(parseTimeSignature(pattern.time))) expect(ADDITIVE[where], `${where} ${pattern.time}: name its grouping`).toBeDefined();
      else expect(SPANS[pattern.time], `${where} ${pattern.time}: add its beam spans`).toBeDefined();
    }
    for (const where of Object.keys(ADDITIVE)) expect(isAdditiveMeter(parseTimeSignature(at(where).time)), where).toBe(true);
  });

  it('every rhythm in the curriculum: beam spans are the beat, the dotted quarter, or the named groups', () => {
    const bad = all.filter(({ where, pattern }) => JSON.stringify(beamSpans(pattern)) !== JSON.stringify(expectedSpans(where, pattern)))
      .map(({ where, pattern }) => `${where} ${pattern.time}: ${beamSpans(pattern).join('+')}, expected ${expectedSpans(where, pattern).join('+')}`);
    expect(bad).toEqual([]);
  });

  it('every rhythm in the curriculum: the beams are what the oracle derives from the written values', () => {
    const bad: string[] = [];
    for (const { where, pattern } of all) {
      const got = notesOf(pattern).sort((a, b) => a[0] - b[0]);
      const want = oracle(pattern.notes, expectedSpans(where, pattern));
      if (JSON.stringify(got) !== JSON.stringify(want)) bad.push(`${where} ${pattern.time} '${pattern.notes}': ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`);
    }
    expect(bad).toEqual([]);
  });

  it('every rhythm in the curriculum: no beam crosses a group boundary or a barline', () => {
    const bad: string[] = [];
    for (const { where, pattern } of all) {
      const w = written(pattern.notes);
      const spans = expectedSpans(where, pattern);
      for (const b of rhythmBeams(pattern)) {
        const first = w[b.notes[0]];
        const last = w[b.notes[b.notes.length - 1]];
        if (first.bar !== last.bar || spanOf(first.onset, spans) !== spanOf(last.onset, spans)) bad.push(`${where}: beam ${b.notes.join(',')}`);
        if (b.notes.some((n, i) => i > 0 && n !== b.notes[i - 1] + 1)) bad.push(`${where}: beam ${b.notes.join(',')} skips a value`);
      }
      expect(rhythmProblems(pattern), where).toEqual([]);
    }
    expect(bad).toEqual([]);
  });

  it('7/8 grouped 2+2+3 (the lesson, grouping declared): beamed 2+2+3 in each bar — not 2+2+2+1', () => {
    const lesson = at('l4u14m2 concept 1');
    expect(lesson.time).toBe('7/8');
    expect(meterGrouping(lesson)).toEqual({ groups: [2, 2, 3], source: 'declared' });
    expect(beamSpans(lesson)).toEqual([1, 1, 1.5]);
    expect(notesOf(lesson)).toEqual([[0, 1], [2, 3], [4, 5, 6], [7, 8], [9, 10], [11, 12, 13]]);
  });

  it('7/8 in the question: 2+2+3 — and its accents alone already say so (it declares no grouping today)', () => {
    const question = at('l4u14m2e2');
    expect(question.time).toBe('7/8');
    expect(meterGrouping(question).groups).toEqual([2, 2, 3]);
    expect(meterGrouping({ ...question, grouping: undefined })).toEqual({ groups: [2, 2, 3], source: 'accents' });
    expect(notesOf(question)).toEqual([[0, 1], [2, 3], [4, 5, 6]]);
  });

  it('compound time beams by the dotted quarter: 6/8 and 9/8 in threes', () => {
    expect(meterGrouping(at('l2u6m1 concept 1')).source).toBe('compound');
    expect(notesOf(at('l2u6m1 concept 1'))).toEqual([[0, 1, 2], [3, 4, 5]]); // '>8 8 8 >8 8 8 | >q. >q.'
    expect(notesOf(at('l2u6m1e3'))).toEqual([[0, 1, 2], [3, 4, 5], [6, 7, 8]]); // 9/8
  });

  it('simple time beams by the beat: 4/4 and 3/4 eighths in pairs (3/4 is not 6/8)', () => {
    expect(meterGrouping(at('l1u2m1 concept 1')).source).toBe('simple');
    expect(notesOf(at('l1u2m1 concept 1'))).toEqual([[7, 8], [9, 10], [11, 12], [13, 14]]); // 'w | h h | q q q q | 8 ×8'
    expect(notesOf(at('l2u6m1 concept 2'))).toEqual([[0, 1], [2, 3], [4, 5]]); // 3/4 '>8 8 >8 8 >8 8 | >q q q'
  });

  it('triplets keep their own beam; a quarter across the beat is not split and nothing is beamed across it', () => {
    expect(rhythmBeams(at('l2u6m2 concept 2'))).toEqual([ // 2/4 '8 8 8 8 | t8 t8 t8 t8 t8 t8 | 8 8 t8 t8 t8 | q q'
      { notes: [0, 1], triplet: false }, { notes: [2, 3], triplet: false },
      { notes: [4, 5, 6], triplet: true }, { notes: [7, 8, 9], triplet: true },
      { notes: [10, 11], triplet: false }, { notes: [12, 13, 14], triplet: true },
    ]);
    expect(notesOf(at('l2u6m2 concept 1'))).toEqual([]); // 4/4 syncopation '8 >q 8 q q | 8 >q 8 h'
  });
});

describe('meter grouping rules (patterns written for the test)', () => {
  it('a declared grouping wins: 7/8 as 3+2+2', () => {
    const p = { time: '7/8', notes: '>8 8 >8 8 >8 8 8', grouping: [3, 2, 2] };
    expect(meterGrouping(p)).toEqual({ groups: [3, 2, 2], source: 'declared' });
    expect(notesOf(p)).toEqual([[0, 1, 2], [3, 4], [5, 6]]);
  });

  it('other additive meters: 5/8 from accents (3+2), 11/8 declared (2+2+3+2+2), 8/8 from accents (3+3+2)', () => {
    expect(notesOf({ time: '5/8', notes: '>8 8 8 >8 8' })).toEqual([[0, 1, 2], [3, 4]]);
    expect(beamSpans({ time: '11/8', notes: '8 8 8 8 8 8 8 8 8 8 8', grouping: [2, 2, 3, 2, 2] })).toEqual([1, 1, 1.5, 1, 1]);
    expect(notesOf({ time: '11/8', notes: '8 8 8 8 8 8 8 8 8 8 8', grouping: [2, 2, 3, 2, 2] })).toEqual([[0, 1], [2, 3], [4, 5, 6], [7, 8], [9, 10]]);
    expect(meterGrouping({ time: '8/8', notes: '>8 8 8 >8 8 8 >8 8' })).toEqual({ groups: [3, 3, 2], source: 'accents' });
  });

  it('a note sounding across a group boundary is not split, and no beam reaches over it', () => {
    // 7/8 2+2+3: eighth, quarter (eighths 2–3, across the first boundary), then five eighths.
    expect(notesOf({ time: '7/8', notes: '8 q 8 8 8 8', grouping: [2, 2, 3] })).toEqual([[3, 4, 5]]);
  });

  it('rests and longer values break beams; ties do not; sixteenths share the beat; cut time beams by the half', () => {
    expect(notesOf({ time: '2/4', notes: '8 8r 8 8' })).toEqual([[2, 3]]);
    expect(notesOf({ time: '4/4', notes: '8~ 8 8 8 h' })).toEqual([[0, 1], [2, 3]]);
    expect(notesOf({ time: '2/4', notes: '16 16 16 16 8 8' })).toEqual([[0, 1, 2, 3], [4, 5]]);
    expect(notesOf({ time: '2/2', notes: '8 8 8 8 h' })).toEqual([[0, 1, 2, 3]]);
  });

  it('an additive meter with no grouping and no usable accents is reported, and nothing is beamed', () => {
    for (const p of [
      { time: '7/8', notes: '8 8 8 8 8 8 8' }, // nothing to read
      { time: '7/8', notes: '>8 8 >8 8 >8 8 8 | >8 8 8 >8 8 >8 8' }, // bars disagree (2+2+3, 3+2+2)
      { time: '7/8', notes: '8 >8 8 >8 8 8 8' }, // accents off the downbeat
    ]) {
      expect(meterGrouping(p).source, p.notes).toBe('ungrouped');
      expect(notesOf(p), p.notes).toEqual([]);
      expect(rhythmProblems(p).join(' '), p.notes).toMatch(/7\/8 is an additive meter: declare its grouping/);
    }
  });

  it('a declared grouping that does not add up is reported and ignored', () => {
    const p = { time: '7/8', notes: '>8 8 >8 8 >8 8 8', grouping: [2, 2, 2] };
    expect(rhythmProblems(p)).toContain('grouping [2, 2, 2] must be whole groups adding up to 7');
    expect(meterGrouping(p)).toEqual({ groups: [2, 2, 3], source: 'accents' });
  });
});
