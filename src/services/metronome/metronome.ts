/**
 * The metronome (wave 3, stream M): one clock, its sound, and everything
 * that starts and stops it. Lazy: loaded with the bar
 * (`components/metronome/`), the first time the learner opens it.
 *
 * It keeps time while the learner plays notes, plays a scale, opens a
 * chord, reads a lesson or changes view between Explore and Learn: its
 * clicks are on an audio clock of their own (`clickVoice.ts`), out of reach
 * of core `cancelScheduledAudio()`. It stops on ■ and ✕, when the page is
 * hidden, when the Progression panel's loop starts (two clocks at once are
 * worse than none — the loop has its own count-in), on the way into Drill
 * and when the tour is asked for (the bar is not shown there). Starting it
 * while the loop plays stops the loop: the newer clock wins. While it runs
 * it is work in progress (`services/workInProgress.ts`): an update waits.
 *
 * The tempo and the beats in a bar are the main store's optional
 * `metronome` field (`state/metronomeSave.ts`), written only once the
 * learner changes one of them; whether it runs is never saved.
 */
import { create } from 'zustand';
import { useAppStore } from '../../state/store';
import { DEFAULT_METRONOME, isBeatsInBar, type BeatsInBar, type SavedMetronome } from '../../state/metronomeSave';
import { registerWorkInProgress } from '../workInProgress';
import { isLooping, stopLoop, useLoopState } from '../../components/explore/progression/loopController';
import { MetronomeClock, clampTempo, type ClickSink, type LoopTimer } from './clock';
import { clickSink, pendingClicks, prepareClicks, resumeClicks } from './clickVoice';

export type MetronomeStop = 'user' | 'closed' | 'hidden' | 'loop' | 'drill' | 'tour';

interface MetronomeState {
  running: boolean;
  /** The place in its bar of the click that last sounded (1…beats), or null. */
  beat: number | null;
  /** Why it last stopped (the bar's one line for 'loop'; tests). */
  lastStop: MetronomeStop | null;
}

export const useMetronome = create<MetronomeState>(() => ({ running: false, beat: null, lastStop: null }));

let sink: ClickSink = clickSink;
let clock = new MetronomeClock(sink);
let unwatchBeat: (() => void) | null = null;

/** Test seam: a clock on a fake audio clock and loop timer. */
export function setMetronomeClock(fakeSink?: ClickSink, timer?: LoopTimer): void {
  stopMetronome('closed');
  sink = fakeSink ?? clickSink;
  clock = new MetronomeClock(sink, timer);
}

/** The tempo and beats in force: the learner's saved ones, else the defaults. */
export function metronomeSettings(): SavedMetronome {
  return useAppStore.getState().metronome ?? DEFAULT_METRONOME;
}

/** React: the tempo and beats in force. */
export function useMetronomeSettings(): SavedMetronome {
  return useAppStore((s) => s.metronome) ?? DEFAULT_METRONOME;
}

export function isMetronomeRunning(): boolean {
  return clock.running;
}

/** Clicks queued and not yet sounded — on the audio seam for the real clock. */
export function queuedClicks(): number {
  return sink === clickSink ? pendingClicks() : clock.queued();
}

/** Saved only when it changes what is in force (the defaults count as in force: setting them writes nothing). */
function write(next: Partial<SavedMetronome>): SavedMetronome {
  const now = metronomeSettings();
  const merged = { ...now, ...next };
  if (merged.bpm !== now.bpm || merged.beats !== now.beats) useAppStore.getState().setMetronome(merged);
  return merged;
}

/** ▶ — called inside the learner's tap (the audio clock resumes there). */
export function startMetronome(): void {
  void resumeClicks();
  // The samples, if a load while offline left them missing (the synthesized click covers it meanwhile).
  void prepareClicks();
  if (isLooping()) stopLoop('user');
  const { bpm, beats } = metronomeSettings();
  clock.start(bpm, beats);
  useMetronome.setState({ running: true, beat: null, lastStop: null });
  // The count on screen follows the clicks that have sounded (read by the same loop's rhythm).
  unwatchBeat?.();
  const id = setInterval(() => {
    const beat = clock.currentBeat();
    if (useMetronome.getState().beat !== beat) useMetronome.setState({ beat });
  }, 25);
  unwatchBeat = () => clearInterval(id);
}

/**
 * ■ and everything else that stops it: nothing stays queued. Closing the bar
 * (✕) also forgets why it last stopped, so the loop's line is not shown again
 * when the bar is opened later.
 */
export function stopMetronome(reason: MetronomeStop = 'user'): void {
  unwatchBeat?.();
  unwatchBeat = null;
  const was = clock.running;
  clock.stop();
  if (was || useMetronome.getState().running) useMetronome.setState({ running: false, beat: null, lastStop: reason === 'closed' ? null : reason });
  else if (reason === 'closed' && useMetronome.getState().lastStop !== null) useMetronome.setState({ lastStop: null });
}

/** − / + / typed / tapped: from the next beat (also while it runs). */
export function setMetronomeTempo(bpm: number): void {
  if (!Number.isFinite(bpm)) return;
  const next = write({ bpm: clampTempo(bpm) });
  clock.setTempo(next.bpm);
}

export function setMetronomeBeats(beats: number): void {
  if (!isBeatsInBar(beats)) return;
  write({ beats: beats as BeatsInBar });
  clock.setBeats(beats as BeatsInBar);
}

// ─── What stops it (installed once, when the chunk loads) ───────────────────

registerWorkInProgress('metronome', () => clock.running);

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopMetronome('hidden');
  });
  window.addEventListener('pagehide', () => stopMetronome('hidden'));
}

useAppStore.subscribe((state, prev) => {
  if (state.view === 'drill' && prev.view !== 'drill') stopMetronome('drill');
});

useLoopState.subscribe((state, prev) => {
  if (state.playing && !prev.playing && clock.running) stopMetronome('loop');
});
