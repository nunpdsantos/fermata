import { describe, it, expect } from 'vitest';
import { parseRhythm, rhythmProblems, rhythmSchedule, countInBeats, parseTimeSignature } from '../rhythm';

describe('rhythm patterns (W5-64)', () => {
  it('parses values, dots, rests, ties, triplets and accents', () => {
    const p = parseRhythm({ time: '4/4', notes: '>q. 8 hr | t8 t8 t8 h~ q' });
    expect(p.time).toEqual([4, 4]);
    expect(p.bars[0].map((t) => [t.base, t.dotted, t.rest, t.accent, t.quarters])).toEqual([
      ['q', true, false, true, 1.5],
      ['8', false, false, false, 0.5],
      ['h', false, true, false, 2],
    ]);
    expect(p.bars[1].map((t) => t.quarters)).toEqual([1 / 3, 1 / 3, 1 / 3, 2, 1]);
    expect(p.bars[1][3].tie).toBe(true);
  });

  it('checks every bar against its time signature', () => {
    expect(rhythmProblems({ time: '4/4', notes: 'q q h | w' })).toEqual([]);
    expect(rhythmProblems({ time: '3/4', notes: 'h. | q q q' })).toEqual([]);
    expect(rhythmProblems({ time: '6/8', notes: 'q. q. | 8 8 8 q 8' })).toEqual([]);
    expect(rhythmProblems({ time: '4/4', notes: 'q q q' })[0]).toMatch(/bar 1: 3 quarters, the time signature wants 4/);
    expect(rhythmProblems({ time: '2/4', notes: 't8 t8 q' })[0]).toMatch(/bar 1/);
    expect(rhythmProblems({ time: '4/4', notes: 't8 t8 t8 t8 t8 t8 h' })).toEqual([]);
    expect(rhythmProblems({ time: '4/4', notes: 'h qr~ q' })).toContain('token 2: a rest cannot be tied');
    expect(rhythmProblems({ time: '4/4', notes: 'h h~' })).toContain('the last note cannot be tied');
    expect(rhythmProblems({ time: '4/4', notes: 'q x h' })[0]).toMatch(/Not a rhythm value/);
  });

  it('count-in: the felt beat — dotted quarters in compound time, the beat unit otherwise', () => {
    expect(countInBeats(parseTimeSignature('4/4'))).toEqual({ count: 4, quarters: 1 });
    expect(countInBeats(parseTimeSignature('3/4'))).toEqual({ count: 3, quarters: 1 });
    expect(countInBeats(parseTimeSignature('6/8'))).toEqual({ count: 2, quarters: 1.5 });
    expect(countInBeats(parseTimeSignature('12/8'))).toEqual({ count: 4, quarters: 1.5 });
    expect(countInBeats(parseTimeSignature('7/8'))).toEqual({ count: 7, quarters: 0.5 });
    expect(countInBeats(parseTimeSignature('2/2'))).toEqual({ count: 2, quarters: 2 });
  });

  it('schedule: onsets are the sum of the written values before them; lengths are the values (ties joined, rests silent)', () => {
    // 60 bpm: one quarter = 1 s. Count-in: four clicks, the pattern starts at 4 s.
    const s = rhythmSchedule({ time: '4/4', notes: 'q 8 8 h | h.~ q | qr q h' }, 60);
    expect(s.start).toBe(4);
    const notes = s.events.filter((e) => e.kind === 'note').map((e) => [e.at, e.duration]);
    expect(notes).toEqual([
      [4, 1], [5, 0.5], [5.5, 0.5], [6, 2],
      [8, 4], // dotted half tied to a quarter: one note, four beats
      [13, 1], [14, 2], // after a quarter rest
    ]);
    expect(s.total).toBe(16);
    expect(s.events.filter((e) => e.kind === 'count').map((e) => e.at)).toEqual([0, 1, 2, 3]);
  });

  it('schedule: triplets divide the beat in three; compound time counts dotted quarters', () => {
    const t = rhythmSchedule({ time: '2/4', notes: 't8 t8 t8 q' }, 60);
    const at = t.events.filter((e) => e.kind === 'note').map((e) => +e.at.toFixed(6));
    expect(at).toEqual([2, +(2 + 1 / 3).toFixed(6), +(2 + 2 / 3).toFixed(6), 3]);
    const c = rhythmSchedule({ time: '6/8', notes: '8 8 8 q. ' }, 60);
    expect(c.start).toBe(3); // two dotted-quarter clicks
    expect(c.events.filter((e) => e.kind === 'note').map((e) => e.duration)).toEqual([0.5, 0.5, 0.5, 1.5]);
  });

  it('tempo scales everything (default 80 quarters per minute)', () => {
    const slow = rhythmSchedule({ time: '4/4', notes: 'w' });
    expect(slow.secondsPerQuarter).toBeCloseTo(0.75);
    expect(slow.events.at(-1)).toMatchObject({ at: 3, duration: 3, kind: 'note' });
  });
});
