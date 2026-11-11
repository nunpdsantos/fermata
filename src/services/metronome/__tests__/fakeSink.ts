/**
 * A fake audio clock for the metronome's tests: time moves only when the
 * test says, and every click handed to it is recorded with the time it was
 * handed (so a test can tell a click queued in time from one handed late).
 */
import type { ClickSink, LoopTimer } from '../clock';

export interface Handed {
  id: number;
  at: number;
  accent: boolean;
  /** The audio clock when it was handed over. */
  handedAt: number;
  cancelled: boolean;
  /** The audio clock when it was taken back. */
  cancelledAt?: number;
}

export class FakeSink implements ClickSink {
  t = 0;
  handed: Handed[] = [];
  private id = 0;
  now(): number {
    return this.t;
  }
  schedule(at: number, accent: boolean): number {
    const id = ++this.id;
    this.handed.push({ id, at, accent, handedAt: this.t, cancelled: false });
    return id;
  }
  cancel(id: number): void {
    const h = this.handed.find((x) => x.id === id);
    if (h && !h.cancelled) {
      h.cancelled = true;
      h.cancelledAt = this.t;
    }
  }
  /** The clicks that will sound (or have): handed and never taken back before their time. */
  sounding(): Handed[] {
    return this.handed.filter((h) => !h.cancelled || (h.cancelledAt !== undefined && h.cancelledAt >= h.at));
  }
  /** Handed, not taken back, time not yet come. */
  pending(): Handed[] {
    return this.handed.filter((h) => !h.cancelled && h.at > this.t);
  }
}

/** The look-ahead loop's timer, run by hand: `run(ms)` advances the sink and fires the loop on time. */
export class FakeTimer implements LoopTimer {
  private fn: (() => void) | null = null;
  private period = 0;
  private due = 0;
  loops = 0;
  constructor(private readonly sink: FakeSink) {}
  every(ms: number, fn: () => void): () => void {
    this.fn = fn;
    this.period = ms / 1000;
    this.due = this.sink.t + this.period;
    this.loops++;
    return () => {
      if (this.fn === fn) this.fn = null;
    };
  }
  get active(): boolean {
    return this.fn !== null;
  }
  /** Advance `seconds`, firing the loop at each due time (or, if `lateBy` is set for this stretch, holding it up). */
  run(seconds: number): void {
    const end = this.sink.t + seconds;
    while (this.fn && this.due <= end + 1e-12) {
      this.sink.t = this.due;
      this.fn();
      this.due += this.period;
    }
    this.sink.t = end;
  }
  /** The page is busy: the loop does not run for `seconds` (time passes), then runs once and resumes its rhythm. */
  stall(seconds: number): void {
    this.sink.t += seconds;
    this.fn?.();
    this.due = this.sink.t + this.period;
  }
}
