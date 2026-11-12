/**
 * The metronome's schedule against an independent calculation (wave 3,
 * stream M, brief "Truth and tests"): for tempos 30, 60, 97, 120, 240 and
 * every bar length, the times of the first 64 clicks handed to the audio
 * clock are exact to a tenth of a millisecond and the accented clicks are
 * the first of each bar; after a tempo change mid-bar the next click comes
 * one new beat after the last old one; a look-ahead loop that is late by
 * 200 ms loses no click and moves none; ■ leaves no click queued.
 *
 * The expected times are worked out here from first principles — the first
 * click START_LEAD_S after ▶, then one every 60 / tempo seconds — never with
 * the clock's own helpers.
 */
import { describe, it, expect } from 'vitest';
import { MetronomeClock, START_LEAD_S, AHEAD_S, LOOP_MS } from '../clock';
import { FakeSink, FakeTimer } from './fakeSink';
import type { BeatsInBar } from '../../../state/metronomeSave';

const TEMPOS = [30, 60, 97, 120, 240];
const BARS: BeatsInBar[] = [2, 3, 4, 6];
const TENTH_MS = 0.0001;

function setup(startAt = 12.345) {
  const sink = new FakeSink();
  sink.t = startAt;
  const timer = new FakeTimer(sink);
  const clock = new MetronomeClock(sink, timer);
  return { sink, timer, clock };
}

/**
 * Run until `n` clicks have been handed (and not taken back), or 300 s of
 * audio clock have gone by (64 clicks at 30 beats a minute take 128 s): a
 * clock that stops queueing ends the run with a short list, which the
 * callers' length checks then fail on, instead of spinning.
 */
function runUntil(sink: FakeSink, timer: FakeTimer, n: number) {
  const end = sink.t + 300;
  while (sink.sounding().length < n && sink.t < end) timer.run(LOOP_MS / 1000);
}

describe('the first 64 clicks', () => {
  for (const bpm of TEMPOS) {
    for (const beats of BARS) {
      it(`${bpm} beats a minute, ${beats} in a bar: exact to 0.1 ms, the first of each bar accented`, () => {
        const { sink, timer, clock } = setup();
        const t0 = sink.t + START_LEAD_S;
        clock.start(bpm, beats);
        runUntil(sink, timer, 64);
        const clicks = sink.sounding().slice(0, 64);
        expect(clicks).toHaveLength(64);
        clicks.forEach((c, i) => {
          const expected = t0 + (i * 60) / bpm;
          expect(Math.abs(c.at - expected)).toBeLessThan(TENTH_MS);
          expect(c.accent).toBe(i % beats === 0);
          // Handed over before its time, never late.
          expect(c.handedAt).toBeLessThan(c.at);
        });
        // Nothing was ever taken back: a steady run queues each click once.
        expect(sink.handed.filter((h) => h.cancelled)).toHaveLength(0);
      });
    }
  }
});

describe('a tempo change mid-bar', () => {
  for (const [from, to] of [[120, 90], [60, 150], [97, 30], [240, 61], [30, 240]] as const) {
    it(`${from} → ${to}: the next click comes one new beat after the last old one`, () => {
      const { sink, timer, clock } = setup(3);
      const t0 = 3 + START_LEAD_S;
      clock.start(from, 4);
      // Into the bar: just after the 7th click (beat 3 of the 2nd bar), part-way to the next
      // (a little less than one new beat after it, so the new beat is still to come).
      const lastOld = t0 + (6 * 60) / from;
      timer.run(lastOld - sink.t + Math.min(0.35 * 60 / from, 0.5 * 60 / to));
      clock.setTempo(to);
      timer.run(60 / to);
      const after = sink.sounding().filter((c) => c.at > lastOld + 1e-9);
      expect(Math.abs(after[0].at - (lastOld + 60 / to))).toBeLessThan(TENTH_MS);
      runUntil(sink, timer, 20);
      const later = sink.sounding().filter((c) => c.at > lastOld + 1e-9).slice(0, 10);
      expect(later).toHaveLength(10);
      later.forEach((c, i) => expect(Math.abs(c.at - (lastOld + ((i + 1) * 60) / to))).toBeLessThan(TENTH_MS));
      // The bar goes on counting: the 8th click is beat 4, the 9th the next bar's first.
      expect(later.map((c) => c.accent).slice(0, 6)).toEqual([false, true, false, false, false, true]);
      // The clicks queued at the old tempo were taken back before their time.
      expect(sink.handed.filter((h) => h.cancelled).every((h) => h.cancelledAt! < h.at)).toBe(true);
    });
  }

  it('a change before the first click keeps the first click where it was', () => {
    const { sink, timer, clock } = setup(1);
    clock.start(60, 4);
    clock.setTempo(120);
    timer.run(1);
    const s = sink.sounding();
    expect(s[0].at).toBeCloseTo(1 + START_LEAD_S, 9);
    expect(s[1].at - s[0].at).toBeCloseTo(0.5, 9);
  });

  it('a jump that puts the next beat in the past: it comes at once, then the new tempo', () => {
    const { sink, timer, clock } = setup(0);
    clock.start(30, 4); // a beat every 2 s
    timer.run(START_LEAD_S + 1.5); // 1.5 s after the first click
    const now = sink.t;
    clock.setTempo(240);
    const next = sink.sounding().filter((c) => c.at > START_LEAD_S + 1e-9);
    expect(next[0].at).toBeGreaterThan(now);
    expect(next[0].at - now).toBeLessThan(0.02);
    expect(next[1].at - next[0].at).toBeCloseTo(0.25, 9);
  });

  it('the same tempo again changes nothing', () => {
    const { sink, timer, clock } = setup();
    clock.start(100, 3);
    timer.run(1);
    const before = sink.handed.length;
    clock.setTempo(100);
    expect(sink.handed.length).toBe(before);
    expect(sink.handed.some((h) => h.cancelled)).toBe(false);
  });
});

describe('a change of the beats in a bar', () => {
  it('starts a new bar on the next beat, at the same tempo', () => {
    const { sink, timer, clock } = setup(0);
    const t0 = START_LEAD_S;
    clock.start(120, 4);
    timer.run(t0 + 1.25 * 0.5); // just after beat 2 sounded (t0 + 0.5)
    clock.setBeats(3);
    runUntil(sink, timer, 12);
    const s = sink.sounding();
    expect(s.length).toBeGreaterThanOrEqual(12);
    s.forEach((c, i) => expect(Math.abs(c.at - (t0 + i * 0.5))).toBeLessThan(TENTH_MS));
    // 1 2 | 1 2 3 | 1 2 3 | …
    expect(s.slice(0, 11).map((c) => c.accent)).toEqual([true, false, true, false, false, true, false, false, true, false, false]);
  });
});

describe('a busy page', () => {
  it(`the loop held up 200 ms (look-ahead ${AHEAD_S} s) loses no click and moves none`, () => {
    for (const bpm of TEMPOS) {
      const { sink, timer, clock } = setup(5);
      const t0 = 5 + START_LEAD_S;
      clock.start(bpm, 4);
      timer.run(0.5);
      timer.stall(0.2);
      timer.run(0.3);
      timer.stall(0.2);
      runUntil(sink, timer, 40);
      const s = sink.sounding().slice(0, 40);
      // All 40 are checked: a clock that stopped queueing after the late loop would hand fewer.
      expect(s).toHaveLength(40);
      s.forEach((c, i) => {
        expect(Math.abs(c.at - (t0 + (i * 60) / bpm))).toBeLessThan(TENTH_MS);
        expect(c.handedAt).toBeLessThan(c.at);
      });
    }
  });

  it('held up for longer than the look-ahead: the beats whose time has gone are skipped, never played late', () => {
    const { sink, timer, clock } = setup(0);
    clock.start(240, 4); // a beat every 0.25 s
    timer.run(0.1);
    timer.stall(2);
    for (const c of sink.sounding()) expect(c.handedAt).toBeLessThan(c.at);
    // Still on the grid.
    for (const c of sink.sounding()) {
      const n = (c.at - START_LEAD_S) / 0.25;
      expect(Math.abs(n - Math.round(n))).toBeLessThan(1e-6);
    }
  });
});

describe('■', () => {
  it('takes back every queued click and stops the loop: nothing sounds after it', () => {
    const { sink, timer, clock } = setup(0);
    clock.start(200, 4);
    timer.run(1.03);
    expect(sink.pending().length).toBeGreaterThan(0);
    clock.stop();
    expect(sink.pending()).toHaveLength(0);
    expect(clock.queued()).toBe(0);
    expect(timer.active).toBe(false);
    const handed = sink.handed.length;
    timer.run(2);
    expect(sink.handed.length).toBe(handed);
    expect(clock.running).toBe(false);
    expect(clock.currentBeat()).toBeNull();
  });

  it('▶ again starts a new count, its first click accented', () => {
    const { sink, timer, clock } = setup(0);
    clock.start(120, 3);
    timer.run(0.7);
    clock.stop();
    const at = sink.t;
    clock.start(120, 3);
    const first = sink.handed.filter((h) => !h.cancelled && h.handedAt >= at)[0];
    expect(first.at).toBeCloseTo(at + START_LEAD_S, 9);
    expect(first.accent).toBe(true);
  });
});

describe('the count', () => {
  it('is the place in its bar of the click that last sounded', () => {
    const { timer, clock } = setup(0);
    clock.start(60, 3);
    expect(clock.currentBeat()).toBeNull();
    const seen: (number | null)[] = [];
    for (let i = 0; i < 7; i++) {
      timer.run(i === 0 ? START_LEAD_S + 0.001 : 1);
      seen.push(clock.currentBeat());
    }
    expect(seen).toEqual([1, 2, 3, 1, 2, 3, 1]);
  });

  it('tempo, beats and tempo clamping', () => {
    const { clock } = setup();
    clock.setTempo(500);
    expect(clock.tempo).toBe(240);
    clock.setTempo(3);
    expect(clock.tempo).toBe(30);
    clock.setBeats(6);
    expect(clock.beatsInBar).toBe(6);
    clock.start(12.4, 2);
    expect(clock.tempo).toBe(30);
  });
});
