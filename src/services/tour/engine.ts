/**
 * The tour engine: plays a list of steps (types.ts). Framework-free — the
 * React player (components/tour/TourPlayer.tsx) subscribes to it.
 *
 *  - Entering a step runs its action; the step is "acting" until the action
 *    resolves (it resolves on the action's real completion), then "holding"
 *    for a readable pause (`holdMs`), then the next available step.
 *  - No races: leaving a step (Back / Next / stop) aborts its action through
 *    its AbortSignal, and a late completion of an abandoned action is ignored
 *    (each step entry has its own controller).
 *  - Pause stops the clock: an action under way still finishes (a scale is
 *    short), but nothing advances until Resume, which starts the hold again.
 *  - Reduced motion: never advances by itself — the viewer steps with Next.
 *  - A step whose `available()` is false is skipped, in the direction of travel.
 *  - The `final` step (the end card) never advances and has no Next.
 */
import type { StepContext, TourStep } from './types';

export type Phase = 'idle' | 'acting' | 'holding' | 'stopped';

export interface EngineState {
  /** Index into the steps (-1 before start). */
  index: number;
  phase: Phase;
  paused: boolean;
  /** Who paused: the viewer's Pause button, or the viewer touching the app. */
  pausedBy: 'viewer' | 'touch' | null;
}

export interface EngineOptions {
  steps: readonly TourStep[];
  /** Builds a step's context (DOM helpers, sound) around its abort signal. */
  context: (signal: AbortSignal) => StepContext;
  reducedMotion: boolean;
  /** The readable pause after a step's action, in ms. */
  holdMs: (step: TourStep) => number;
  /** Called after leaving a step (its action aborted): e.g. stop its sound. */
  onLeave?: (step: TourStep) => void;
}

export class TourEngine {
  private state: EngineState = { index: -1, phase: 'idle', paused: false, pausedBy: null };
  private readonly listeners = new Set<() => void>();
  private controller: AbortController | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private readonly opts: EngineOptions;
  private reducedMotion: boolean;

  constructor(opts: EngineOptions) {
    this.opts = opts;
    this.reducedMotion = opts.reducedMotion;
  }

  // ─── Observable ───────────────────────────────────────────────────────────
  getState = (): EngineState => this.state;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private set(patch: Partial<EngineState>) {
    this.state = { ...this.state, ...patch };
    for (const l of this.listeners) l();
  }

  get steps(): readonly TourStep[] {
    return this.opts.steps;
  }

  get current(): TourStep | null {
    return this.opts.steps[this.state.index] ?? null;
  }

  /** The steps this layout shows (for the step dots). */
  visibleSteps(): TourStep[] {
    return this.opts.steps.filter((s) => isAvailable(s));
  }

  // ─── Commands ────────────────────────────────────────────────────────────
  start(): void {
    if (this.state.phase !== 'idle') return;
    const first = this.find(0, 1);
    if (first < 0) {
      this.stop();
      return;
    }
    this.enter(first);
  }

  next(): void {
    const step = this.current;
    if (!step || step.final || this.state.phase === 'stopped') return;
    const i = this.find(this.state.index + 1, 1);
    if (i >= 0) this.enter(i);
  }

  back(): void {
    if (this.state.phase === 'stopped' || this.state.index < 0) return;
    const i = this.find(this.state.index - 1, -1);
    if (i >= 0) this.enter(i);
  }

  pause(by: 'viewer' | 'touch' = 'viewer'): void {
    if (this.state.phase === 'stopped' || this.state.phase === 'idle') return;
    if (this.state.paused && this.state.pausedBy === by) return;
    this.clearTimer();
    this.set({ paused: true, pausedBy: by });
  }

  resume(): void {
    if (!this.state.paused || this.state.phase === 'stopped') return;
    this.set({ paused: false, pausedBy: null });
    if (this.state.phase === 'holding') this.scheduleAdvance();
  }

  setReducedMotion(reduce: boolean): void {
    if (reduce === this.reducedMotion) return;
    this.reducedMotion = reduce;
    if (reduce) this.clearTimer();
    else if (this.state.phase === 'holding' && !this.state.paused) this.scheduleAdvance();
  }

  /** Stop for good: the current action is aborted, nothing advances again. */
  stop(): void {
    if (this.state.phase === 'stopped') return;
    this.leave();
    this.set({ phase: 'stopped', paused: false, pausedBy: null });
  }

  // ─── Internals ──────────────────────────────────────────────────────────
  /** The first available step from `from` in direction `dir`, or -1. */
  private find(from: number, dir: 1 | -1): number {
    for (let i = from; i >= 0 && i < this.opts.steps.length; i += dir) {
      if (isAvailable(this.opts.steps[i])) return i;
    }
    return -1;
  }

  private leave() {
    this.clearTimer();
    const prev = this.current;
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
      if (prev) this.opts.onLeave?.(prev);
    }
  }

  private enter(index: number) {
    this.leave();
    const step = this.opts.steps[index];
    const controller = new AbortController();
    this.controller = controller;
    this.set({ index, phase: 'acting' });
    const ctx = this.opts.context(controller.signal);
    // A microtask later: a stop in the same tick (StrictMode's double mount)
    // aborts it before anything has run.
    void Promise.resolve()
      .then(() => (controller.signal.aborted ? undefined : step.run?.(ctx)))
      .catch(() => undefined)
      .then(() => {
        if (controller.signal.aborted || this.controller !== controller) return;
        this.set({ phase: 'holding' });
        this.scheduleAdvance();
      });
  }

  private scheduleAdvance() {
    this.clearTimer();
    const step = this.current;
    if (!step || step.final || this.state.paused || this.reducedMotion || this.state.phase !== 'holding') return;
    this.timer = setTimeout(() => {
      this.timer = null;
      this.next();
    }, this.opts.holdMs(step));
  }

  private clearTimer() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

function isAvailable(step: TourStep): boolean {
  try {
    return step.available ? step.available() : true;
  } catch {
    return false;
  }
}
