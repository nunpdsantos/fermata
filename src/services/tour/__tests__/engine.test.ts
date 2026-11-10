import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TourEngine } from '../engine';
import type { StepContext, TourStep } from '../types';

/** A promise the test resolves itself: an action that "really finishes" when told to. */
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => (resolve = r));
  return { promise, resolve };
}

const HOLD = 1000;

function make(steps: TourStep[], reducedMotion = false) {
  const signals: AbortSignal[] = [];
  const context = (signal: AbortSignal): StepContext => {
    signals.push(signal);
    return {
      signal,
      reducedMotion,
      sound: () => true,
      tap: async () => {},
      settled: async () => null,
      reveal: async () => null,
    };
  };
  const onLeave = vi.fn();
  const engine = new TourEngine({ steps, context, reducedMotion, holdMs: () => HOLD, onLeave });
  return { engine, signals, onLeave };
}

const step = (id: string, extra: Partial<TourStep> = {}): TourStep => ({ id, caption: () => `showMe.intro.${id}`, ...extra });
const flush = () => vi.advanceTimersByTimeAsync(0);
const at = (engine: TourEngine) => engine.current?.id;

describe('tour engine', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('a step ends only when its action has really finished, then holds for the readable pause', async () => {
    const playing = deferred();
    const { engine } = make([step('a', { run: () => playing.promise }), step('b'), step('c', { final: true })]);
    engine.start();
    await flush();
    expect(at(engine)).toBe('a');
    expect(engine.getState().phase).toBe('acting');
    // However long the action takes, nothing advances (no fixed sleep).
    await vi.advanceTimersByTimeAsync(30_000);
    expect(at(engine)).toBe('a');
    expect(engine.getState().phase).toBe('acting');
    playing.resolve();
    await flush();
    expect(engine.getState().phase).toBe('holding');
    await vi.advanceTimersByTimeAsync(HOLD - 1);
    expect(at(engine)).toBe('a');
    await vi.advanceTimersByTimeAsync(1);
    expect(at(engine)).toBe('b');
  });

  it('plays through to the end card and stays there (no auto-advance, no Next)', async () => {
    const { engine } = make([step('a'), step('b'), step('end', { final: true })]);
    engine.start();
    await vi.advanceTimersByTimeAsync(HOLD * 10);
    expect(at(engine)).toBe('end');
    expect(engine.getState().phase).toBe('holding');
    engine.next();
    await vi.advanceTimersByTimeAsync(HOLD * 10);
    expect(at(engine)).toBe('end');
  });

  it('pause stops the clock; resume restarts the hold', async () => {
    const { engine } = make([step('a'), step('b'), step('end', { final: true })]);
    engine.start();
    await flush();
    engine.pause('viewer');
    expect(engine.getState()).toMatchObject({ paused: true, pausedBy: 'viewer' });
    await vi.advanceTimersByTimeAsync(HOLD * 20);
    expect(at(engine)).toBe('a');
    engine.resume();
    expect(engine.getState().paused).toBe(false);
    await vi.advanceTimersByTimeAsync(HOLD);
    expect(at(engine)).toBe('b');
  });

  it('pausing during an action lets it finish but does not advance until resumed', async () => {
    const playing = deferred();
    const { engine } = make([step('a', { run: () => playing.promise }), step('b'), step('end', { final: true })]);
    engine.start();
    await flush();
    engine.pause('touch');
    expect(engine.getState().pausedBy).toBe('touch');
    playing.resolve();
    await flush();
    expect(engine.getState().phase).toBe('holding');
    await vi.advanceTimersByTimeAsync(HOLD * 5);
    expect(at(engine)).toBe('a');
    engine.resume();
    await vi.advanceTimersByTimeAsync(HOLD);
    expect(at(engine)).toBe('b');
  });

  it('Next and Back move at once, abort the action under way and ignore its late completion', async () => {
    const slow = deferred();
    const runB = vi.fn(async () => {});
    const { engine, signals, onLeave } = make([
      step('a', { run: () => slow.promise }),
      step('b', { run: runB }),
      step('end', { final: true }),
    ]);
    engine.start();
    await flush();
    engine.next();
    expect(at(engine)).toBe('b');
    expect(signals[0].aborted).toBe(true);
    expect(onLeave).toHaveBeenCalledTimes(1);
    await flush();
    expect(runB).toHaveBeenCalledTimes(1);
    // The abandoned action finishing late changes nothing.
    slow.resolve();
    await flush();
    expect(at(engine)).toBe('b');
    engine.back();
    expect(at(engine)).toBe('a');
    expect(signals[1].aborted).toBe(true);
    engine.back(); // nothing before the first step
    expect(at(engine)).toBe('a');
  });

  it('a step whose target does not exist in this layout is skipped, both ways', async () => {
    const { engine } = make([step('a'), step('circle', { available: () => false }), step('b'), step('end', { final: true })]);
    expect(engine.visibleSteps().map((s) => s.id)).toEqual(['a', 'b', 'end']);
    engine.start();
    engine.next();
    expect(at(engine)).toBe('b');
    engine.back();
    expect(at(engine)).toBe('a');
  });

  it('reduced motion: never advances by itself; the viewer steps with Next', async () => {
    const { engine } = make([step('a'), step('b'), step('end', { final: true })], true);
    engine.start();
    await vi.advanceTimersByTimeAsync(HOLD * 30);
    expect(at(engine)).toBe('a');
    expect(engine.getState().phase).toBe('holding');
    engine.next();
    await vi.advanceTimersByTimeAsync(HOLD * 30);
    expect(at(engine)).toBe('b');
    // Switching reduced motion off mid-tour resumes the clock.
    engine.setReducedMotion(false);
    await vi.advanceTimersByTimeAsync(HOLD);
    expect(at(engine)).toBe('end');
  });

  it('stop aborts the action and nothing runs again', async () => {
    const playing = deferred();
    const { engine, signals } = make([step('a', { run: () => playing.promise }), step('b'), step('end', { final: true })]);
    engine.start();
    await flush();
    engine.stop();
    expect(signals[0].aborted).toBe(true);
    expect(engine.getState().phase).toBe('stopped');
    playing.resolve();
    await vi.advanceTimersByTimeAsync(HOLD * 10);
    expect(at(engine)).toBe('a');
    engine.next();
    expect(at(engine)).toBe('a');
  });

  it('a stop in the same tick as the start (StrictMode) runs no action at all', async () => {
    const run = vi.fn(async () => {});
    const { engine } = make([step('a', { run }), step('end', { final: true })]);
    engine.start();
    engine.stop();
    await flush();
    expect(run).not.toHaveBeenCalled();
  });

  it('an action that throws still lets the tour go on', async () => {
    const { engine } = make([step('a', { run: async () => { throw new Error('boom'); } }), step('end', { final: true })]);
    engine.start();
    await flush();
    expect(engine.getState().phase).toBe('holding');
    await vi.advanceTimersByTimeAsync(HOLD);
    expect(at(engine)).toBe('end');
  });
});
