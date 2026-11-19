/**
 * "Stop the metronome" from code that must not load it (review of e92e44e):
 * the app's error boundary, when it replaces the whole screen, says so here;
 * the metronome hears it once its own chunk has loaded
 * (`services/metronome/metronome.ts`) and stops — with the screen gone,
 * nothing else could. Imports nothing, so the boundary (eager, in the entry)
 * pulls none of the metronome's code. The same pattern as `utils/rhythmStart.ts`.
 */
type Listener = () => void;

const listeners = new Set<Listener>();

/** Hear every request; returns the way to stop hearing them. */
export function onMetronomeStopRequest(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Ask a running metronome (if its chunk has loaded) to stop. */
export function requestMetronomeStop(): void {
  for (const listener of [...listeners]) listener();
}
