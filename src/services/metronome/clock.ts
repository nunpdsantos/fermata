/**
 * The metronome's clock (wave 3, stream M) — pure scheduling, no audio.
 *
 * Clicks are handed AHEAD to the audio clock (`ClickSink.schedule(at)`, `at`
 * in the sink's own seconds) by ONE short look-ahead loop: every `LOOP_MS`
 * it queues every beat that falls in the next `AHEAD_S` seconds. There is
 * never a timer per click (timers drift and stall while the page is busy);
 * the audio clock plays each click at its exact time, so the pulse holds
 * while the page is busy, and a loop that runs late by up to
 * `AHEAD_S - LOOP_MS` loses no click and moves none. A loop held up for
 * longer than that skips the beats whose time has passed (never plays them
 * late, never bunches them up).
 *
 * Beat n sounds at `anchorAt + (n - anchorIndex) × 60 / bpm` — computed
 * from an anchor, never by adding beat lengths, so nothing accumulates.
 * A tempo change takes back the queued clicks and re-anchors on the last
 * click that sounded: the next click comes one NEW beat after it (if that
 * time has already passed — a jump from 30 to 240 late in a long beat — it
 * comes at once). A change of the beats in a bar starts a new bar on the
 * next beat (its click is the accented one); the tempo is unchanged.
 */
import { MAX_TEMPO, MIN_TEMPO, type BeatsInBar } from '../../state/metronomeSave';

/** The look-ahead loop's period. */
export const LOOP_MS = 25;
/** Clicks are queued this far ahead of the audio clock. */
export const AHEAD_S = 0.4;
/** The first click comes this long after ▶, so it is never late. */
export const START_LEAD_S = 0.06;
/** A click is never queued closer to now than this. */
export const MIN_LEAD_S = 0.01;

/** Where the clicks go: the audio clock (services/metronome/clickVoice.ts) or a test's fake. */
export interface ClickSink {
  /** The audio clock, seconds. */
  now(): number;
  /** Queue one click at `at` (the sink's clock); `accent` = the first beat of a bar. Returns its id. */
  schedule(at: number, accent: boolean): number;
  /** Take back a queued click (it never sounds; one already sounding stops). */
  cancel(id: number): void;
}

/** The one look-ahead loop's timer (setInterval; a test drives it by hand). */
export interface LoopTimer {
  every(ms: number, fn: () => void): () => void;
}

export const realTimer: LoopTimer = {
  every: (ms, fn) => {
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
  },
};

export const clampTempo = (bpm: number): number => Math.min(MAX_TEMPO, Math.max(MIN_TEMPO, Math.round(bpm)));

interface Click {
  id: number;
  index: number;
  at: number;
  accent: boolean;
  /** 1-based place in its bar. */
  beatInBar: number;
}

export class MetronomeClock {
  private bpm = 80;
  private beats: BeatsInBar = 4;
  private on = false;
  private anchorAt = 0;
  private anchorIndex = 0;
  private nextIndex = 0;
  private barStartIndex = 0;
  /** Handed to the sink, time not yet come (as of the last look). */
  private queue: Click[] = [];
  /** The last click whose time has come. */
  private last: Click | null = null;
  private stopLoop: (() => void) | null = null;

  constructor(
    private readonly sink: ClickSink,
    private readonly timer: LoopTimer = realTimer,
  ) {}

  get running(): boolean {
    return this.on;
  }

  get tempo(): number {
    return this.bpm;
  }

  get beatsInBar(): BeatsInBar {
    return this.beats;
  }

  /** The place in its bar (1…beats) of the last click that sounded, or null (stopped, or before the first). */
  currentBeat(): number | null {
    if (!this.on) return null;
    this.settle(this.sink.now());
    return this.last?.beatInBar ?? null;
  }

  /** Clicks handed to the sink whose time has not come. */
  queued(): number {
    if (!this.on) return 0;
    this.settle(this.sink.now());
    return this.queue.length;
  }

  start(bpm: number, beats: BeatsInBar): void {
    if (this.on) this.stop();
    this.bpm = clampTempo(bpm);
    this.beats = beats;
    this.on = true;
    this.anchorAt = this.sink.now() + START_LEAD_S;
    this.anchorIndex = 0;
    this.nextIndex = 0;
    this.barStartIndex = 0;
    this.last = null;
    this.tick();
    this.stopLoop = this.timer.every(LOOP_MS, () => this.tick());
  }

  /** Stop: every queued click is taken back — nothing sounds after this. */
  stop(): void {
    this.on = false;
    this.stopLoop?.();
    this.stopLoop = null;
    this.takeBackQueued();
    this.last = null;
  }

  /** The loop's body: queue every beat that falls before now + AHEAD_S. */
  tick(): void {
    if (!this.on) return;
    const now = this.sink.now();
    this.settle(now);
    // Held up for longer than the look-ahead: the beats whose time has gone are skipped.
    while (this.timeOf(this.nextIndex) <= now) this.nextIndex++;
    while (this.timeOf(this.nextIndex) < now + AHEAD_S) {
      const index = this.nextIndex++;
      const beatInBar = ((index - this.barStartIndex) % this.beats) + 1;
      const at = this.timeOf(index);
      const accent = beatInBar === 1;
      const id = this.sink.schedule(at, accent);
      this.queue.push({ id, index, at, accent, beatInBar });
    }
  }

  setTempo(bpm: number): void {
    const next = clampTempo(bpm);
    if (next === this.bpm) return;
    if (!this.on) {
      this.bpm = next;
      return;
    }
    const now = this.sink.now();
    const first = this.rewind(now);
    const last = this.last;
    // One new beat after the last click that sounded; before the first click, the first keeps its time.
    if (last && last.index === first - 1) {
      this.anchorAt = last.at;
      this.anchorIndex = last.index;
    } else {
      this.anchorAt = this.timeOf(first);
      this.anchorIndex = first;
    }
    this.bpm = next;
    if (this.timeOf(first) < now + MIN_LEAD_S) {
      this.anchorAt = now + MIN_LEAD_S;
      this.anchorIndex = first;
    }
    this.tick();
  }

  setBeats(beats: BeatsInBar): void {
    if (beats === this.beats) return;
    this.beats = beats;
    if (!this.on) return;
    const first = this.rewind(this.sink.now());
    this.barStartIndex = first;
    this.tick();
  }

  /** Take back what is queued; the next beat to queue is the first taken back. */
  private rewind(now: number): number {
    this.settle(now);
    const first = this.queue.length ? this.queue[0].index : this.nextIndex;
    this.takeBackQueued();
    this.nextIndex = first;
    return first;
  }

  private takeBackQueued(): void {
    for (const c of this.queue) this.sink.cancel(c.id);
    this.queue = [];
  }

  private settle(now: number): void {
    while (this.queue.length && this.queue[0].at <= now) this.last = this.queue.shift()!;
  }

  private timeOf(index: number): number {
    return this.anchorAt + ((index - this.anchorIndex) * 60) / this.bpm;
  }
}
