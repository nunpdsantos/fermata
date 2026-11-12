/**
 * "A rhythm is starting" (wave 3, second fix pass): `playRhythm`
 * (`rhythmPlayback.ts`) says so here, in the learner's tap, before it plays
 * its one-bar count-in and the rhythm. The metronome listens once its own
 * chunk has loaded (`services/metronome/metronome.ts`) and stops: two clocks
 * at once are worse than none, as with the Progression loop. Neither side
 * imports the other, so the metronome's clock stays out of the Learn chunk
 * and a rhythm played when the metronome was never opened loads none of it.
 */
type Listener = () => void;

const listeners = new Set<Listener>();

/** Hear every rhythm that starts; returns the way to stop hearing them. */
export function onRhythmStart(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** A rhythm is about to play (called by `playRhythm` only). */
export function rhythmStarting(): void {
  for (const listener of [...listeners]) listener();
}
