/**
 * W5-64 — rhythm lessons and questions: every rhythm the curriculum shows is
 * well formed (each bar adds up to its time signature), and what PLAYS
 * matches what is WRITTEN. playRhythm runs on real core audio into a fake
 * voice that records each note's MIDI, start offset and length; the oracle
 * below computes onsets and lengths from the written values with its own
 * table (not the app's parser): w 4, h 2, q 1, 8 ½, 16 ¼ quarters, a dot ×1.5,
 * a triplet eighth ⅓; a rest sounds nothing; a tie joins the next value.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setInstrumentVoice } from '../../core/services/audio';
import { installMockAudioContext } from '../../test/mockAudioContext';
import { playRhythm } from '../rhythmPlayback';
import { rhythmProblems } from '../../core/utils/rhythm';
import type { RhythmPattern } from '../../core/types/exercise';
import { EN_UNITS, enExercisesFor } from '../../i18n/content/__tests__/overlayEntries';

/** Every rhythm in the curriculum: lesson concepts and question stimuli. */
function curriculumRhythms(): { where: string; pattern: RhythmPattern }[] {
  const out: { where: string; pattern: RhythmPattern }[] = [];
  for (let n = 1; n <= 9; n++) {
    for (const unit of EN_UNITS[n]) for (const mod of unit.modules) {
      mod.concepts.forEach((c, i) => { if (c.rhythm) out.push({ where: `${mod.id} concept ${i + 1}`, pattern: c.rhythm }); });
    }
    for (const ex of Object.values(enExercisesFor(n)).flat()) {
      if (ex.config.type === 'multiple_choice' && ex.config.rhythm) out.push({ where: ex.id, pattern: ex.config.rhythm });
    }
  }
  return out;
}

const VALUE: Record<string, number> = { w: 4, h: 2, q: 1, '8': 0.5, '16': 0.25 };
interface Written { quarters: number; rest: boolean; tie: boolean }
function written(notes: string): Written[] {
  return notes.split(/[|\s]+/).filter(Boolean).map((tok) => {
    const m = /^>?(t)?(w|h|q|16|8)(\.)?(r)?(~)?$/.exec(tok)!;
    let q = VALUE[m[2]];
    if (m[3]) q *= 1.5;
    if (m[1]) q *= 2 / 3; // a triplet: three in the time of two
    return { quarters: q, rest: !!m[4], tie: !!m[5] };
  });
}
/** Expected sounded notes: [onset, length] in quarters from the first bar's start. */
function expectedNotes(notes: string): [number, number][] {
  const vals = written(notes);
  const out: [number, number][] = [];
  let t = 0;
  vals.forEach((v, i) => {
    const tiedInto = i > 0 && vals[i - 1].tie;
    if (!v.rest && !tiedInto) {
      let len = v.quarters;
      for (let j = i; vals[j].tie && vals[j + 1]; j++) len += vals[j + 1].quarters;
      out.push([t, len]);
    }
    t += v.quarters;
  });
  return out;
}
const BEAT_COUNT: Record<string, [number, number]> = {
  // time → [count-in clicks, quarters per click]
  '2/4': [2, 1], '3/4': [3, 1], '4/4': [4, 1], '5/4': [5, 1], '2/2': [2, 2],
  '6/8': [2, 1.5], '9/8': [3, 1.5], '12/8': [4, 1.5], '7/8': [7, 0.5],
};

const played: { midi: number; when: number; duration: number }[] = [];
beforeEach(() => {
  installMockAudioContext(10);
  played.length = 0;
  setInstrumentVoice({
    playNote: (midi, when, duration) => { played.push({ midi, when, duration }); return true; },
    startNote: () => true, stopNote: () => {}, setVolume: () => {}, resume: () => Promise.resolve(), cancelScheduled: () => {},
  });
});
afterEach(() => {
  setInstrumentVoice(null);
  vi.unstubAllGlobals();
});

describe('rhythms in the curriculum (W5-64)', () => {
  const all = curriculumRhythms();

  it('every rhythm lesson concept has one, and the rhythm questions do', () => {
    const where = all.map((r) => r.where);
    for (const m of ['l1u2m1', 'l1u2m2', 'l2u6m1', 'l2u6m2', 'l4u14m2']) {
      expect(where.filter((w) => w.startsWith(`${m} concept`)).length, m).toBeGreaterThanOrEqual(2);
    }
    expect(where.filter((w) => !w.includes('concept')).length).toBeGreaterThanOrEqual(12);
  });

  it('every bar adds up to its time signature', () => {
    const bad = all.flatMap(({ where, pattern }) => rhythmProblems(pattern).map((p) => `${where}: ${p}`));
    expect(bad).toEqual([]);
  });

  it('what plays is what is written: a one-bar count-in, then each note at its written onset for its written length', async () => {
    const bad: string[] = [];
    for (const { where, pattern } of all) {
      played.length = 0;
      await playRhythm(pattern);
      const spq = 60 / (pattern.bpm ?? 80);
      const [count, perClick] = BEAT_COUNT[pattern.time];
      const clicks = played.filter((p) => p.midi === 79); // G5
      const notes = played.filter((p) => p.midi === 72); // C5
      if (clicks.length !== count) bad.push(`${where}: ${clicks.length} count-in clicks, expected ${count}`);
      clicks.forEach((c, i) => { if (Math.abs(c.when - i * perClick * spq) > 1e-6) bad.push(`${where}: click ${i + 1} at ${c.when}`); });
      const start = count * perClick * spq;
      const expected = expectedNotes(pattern.notes);
      if (notes.length !== expected.length) bad.push(`${where}: ${notes.length} notes, written ${expected.length}`);
      notes.forEach((n, i) => {
        const [on, len] = expected[i] ?? [NaN, NaN];
        if (Math.abs(n.when - (start + on * spq)) > 1e-6) bad.push(`${where}: note ${i + 1} at ${n.when}, written ${start + on * spq}`);
        if (Math.abs(n.duration - len * spq) > 1e-6) bad.push(`${where}: note ${i + 1} lasts ${n.duration}, written ${len * spq}`);
      });
    }
    expect(bad).toEqual([]);
  });

  it('the oracle itself: a dotted half tied to nothing is 3 beats, a half tied to a quarter is one 3-beat note', () => {
    expect(expectedNotes('h. q | h~ q q')).toEqual([[0, 3], [3, 1], [4, 3], [7, 1]]);
    expect(expectedNotes('q qr q qr')).toEqual([[0, 1], [2, 1]]);
  });
});
