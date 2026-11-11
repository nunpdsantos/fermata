/**
 * The Progression panel's one loop and everything that stops it (wave 2,
 * stream S). While it plays, the chord that sounds is Explore's selected
 * chord (strip, piano and fretboard show it as any chord); when it stops, the
 * chord selected before it started comes back — unless something else chose
 * a chord meanwhile (a key change clears it: that stays cleared).
 *
 * It stops on ■, when the panel closes (`closeProgressionPanel`, also the
 * tour), when the view changes, when the page is hidden, when the learner
 * changes Explore's key or scale or the list of chords, and when any other
 * playback cancels the scheduled audio. While it plays it is work in
 * progress (`services/workInProgress.ts`): an update waits.
 */
import { create } from 'zustand';
import type { Chord } from '../../../core/types/music';
import { useAppStore } from '../../../state/store';
import { registerLoopStop } from '../../../state/progressionPanel';
import { registerWorkInProgress } from '../../../services/workInProgress';
import { getSynthConfig } from '../../../services/synthConfig';
import { exploreRegister } from '../exploreRegister';
import { ProgressionLoop, type LoopClock, type StopReason } from './progressionLoop';

interface LoopState {
  playing: boolean;
  /** The chip now sounding, or null (count-in, stopped). */
  index: number | null;
  /** Why the last loop stopped (tests and the screen reader line). */
  lastStop: StopReason | null;
}

export const useLoopState = create<LoopState>(() => ({ playing: false, index: null, lastStop: null }));

let loop = new ProgressionLoop();
let cleanup: (() => void) | null = null;

/** Test seam: a loop on a fake clock. */
export function setLoopClock(clock?: LoopClock): void {
  stopLoop('closed');
  loop = new ProgressionLoop(clock);
}

/** Test seam: cycles handed to the audio clock by the current loop object. */
export function loopCycles(): number {
  return loop.cycles;
}

export function stopLoop(reason: StopReason = 'user'): void {
  loop.stop(reason);
}

/** Tempo or beats changed while it plays: from the next time round. */
export function retimeLoop(bpm: number, beats: number): void {
  loop.retime(bpm, beats);
}

export function isLooping(): boolean {
  return loop.playing;
}

/** Start the loop over these chords (ignored with none). */
export function startLoop(chords: readonly Chord[], bpm: number, beats: number): void {
  if (chords.length === 0) return;
  stopLoop('user');
  const app = useAppStore.getState();
  const before = { selectedChord: app.selectedChord, chordInversion: app.chordInversion };
  const register = exploreRegister(app.instrument, app.baseOctave);
  let shown: Chord | null = null;
  useLoopState.setState({ playing: true, index: null, lastStop: null });

  const finish = (reason: StopReason) => {
    cleanup?.();
    cleanup = null;
    useLoopState.setState({ playing: false, index: null, lastStop: reason });
    // Give back the chord selected before ▶ — only if the screen still shows ours.
    const s = useAppStore.getState();
    if (shown !== null && s.selectedChord === shown) useAppStore.setState(before);
  };

  void loop.start({
    chords,
    bpm,
    beats,
    pitches: (chord) => register.chordPitches(chord.notes, chord.bassNote),
    config: getSynthConfig(app.synthPreset),
    onChord: (index) => {
      shown = chords[index];
      useAppStore.getState().setSelectedChord(shown);
      useLoopState.setState({ index });
    },
    onStop: finish,
  });

  // Everything else that stops it.
  const onHidden = () => {
    if (document.hidden) stopLoop('hidden');
  };
  document.addEventListener('visibilitychange', onHidden);
  const unsubscribe = useAppStore.subscribe((state, prev) => {
    if (state.view !== prev.view) stopLoop('closed');
    else if (state.selectedKey !== prev.selectedKey || state.selectedScale !== prev.selectedScale) stopLoop('changed');
    else if (state.progression?.chords !== prev.progression?.chords) stopLoop('changed');
  });
  const unregisterStop = registerLoopStop(() => stopLoop('closed'));
  const unregisterWork = registerWorkInProgress('progression', () => loop.playing);
  cleanup = () => {
    document.removeEventListener('visibilitychange', onHidden);
    unsubscribe();
    unregisterStop();
    unregisterWork();
  };
}
