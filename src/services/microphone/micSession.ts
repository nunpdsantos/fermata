/**
 * The ONE microphone session behind the switch (`micSwitch.ts`; brief U —
 * it generalises the wave-3 check session). Lazy: loaded inside the tap
 * that turns the microphone on, never before.
 *
 * One stream, one audio context (made in the tap), two readers: the
 * played-notes reporter (`playedNotes.ts`: every note held steadily is
 * reported through `services/externalNotes.ts`, source 'mic'; the one
 * listener decides what it does — Explore lights it, a check answered on the
 * instrument adds it, anywhere else nothing) and, while the tuner is open,
 * the tuner's own reading (`subscribeMicFrames`). No other code opens the
 * microphone.
 *
 * It ends — every track stopped, its audio context closed — when the switch
 * turns it off, when the page is hidden or the view changes, when the device
 * goes, and after IDLE_MS with no note reported (the app's own sound never
 * counts: the reporter ignores it). Nothing heard is kept: each frame is
 * measured and dropped.
 */
import { startListening, stopListening, type MicProblem, type MicSession } from './microphone.ts';
import { reportPlayedNotes, type PlayedNotes } from './playedNotes.ts';
import type { PitchEstimate } from './pitch.ts';
import { close, micAttempt, setMic, type MicIssue } from './micSwitch.ts';

/** Listening for attempt `t` (`heard` = the last note reported); ignored for an attempt replaced. */
function micOn(t: number, heard: number | null = null): void {
  if (t === micAttempt.n) setMic({ kind: 'on', heard });
}

/** It ended by itself, with a sentence or (a view change) without. */
function micEnded(t: number, problem: MicIssue | null): void {
  if (t !== micAttempt.n) return;
  micAttempt.n++;
  setMic(problem ? { kind: 'problem', problem } : { kind: 'off' });
}

/** Three minutes with no note heard: the microphone turns itself off. */
export const IDLE_MS = 3 * 60 * 1000;

type FrameReader = (estimate: PitchEstimate | null, time: number) => void;
const readers = new Set<FrameReader>();
let token = 0;
let asking = false;
let session: MicSession | null = null;
let reporter: PlayedNotes | null = null;
let idle: ReturnType<typeof setTimeout> | null = null;

function stopIdle() {
  if (idle !== null) clearTimeout(idle);
  idle = null;
}

/** (Re)start the three minutes: at opening and at every note reported. */
function armIdle(t: number) {
  stopIdle();
  idle = setTimeout(() => {
    if (t !== token) return;
    closeMic();
    micEnded(t, 'idle');
  }, IDLE_MS);
}

/**
 * Has the learner already allowed the microphone for this site? Asked only
 * inside the switch's tap, never before ('unknown' where the browser cannot say).
 */
export async function microphonePermission(): Promise<'granted' | 'denied' | 'prompt' | 'unknown'> {
  try {
    const status = await navigator.permissions?.query({ name: 'microphone' as PermissionName });
    return status?.state ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Open the microphone for attempt `t` with the context made in the tap.
 * `ask`: first ask whether it is already allowed — if not, close the
 * context and say why before the browser is asked (the switch's 'explain').
 */
export function openMic(context: AudioContext | undefined, t: number, ask = false): void {
  closeMic();
  if (ask) {
    void microphonePermission().then((p) => {
      if (t !== micAttempt.n) close(context);
      else if (p === 'granted') openMic(context, t);
      else {
        close(context);
        setMic({ kind: 'asking', step: 'explain' });
      }
    });
    return;
  }
  token = t;
  asking = true;
  const notes = reportPlayedNotes((midi, on) => {
    if (!on || t !== token) return;
    armIdle(t);
    micOn(t, midi);
  });
  startListening({
    onFrame: (estimate, time) => {
      notes.onFrame(estimate, time);
      for (const read of [...readers]) read(estimate, time);
    },
    onStop: (reason) => {
      notes.dispose();
      if (t !== token) return;
      closeMic();
      // A view change turns it off with no sentence (what it was for went with the view).
      micEnded(t, reason === 'hidden' || reason === 'ended' ? reason : null);
    },
  }, context).then(
    (s) => {
      if (t !== token) {
        s.stop();
        notes.dispose();
        return;
      }
      asking = false;
      session = s;
      reporter = notes;
      armIdle(t);
      micOn(t);
    },
    (error: unknown) => {
      notes.dispose();
      const problem = (error as { problem?: MicProblem | 'stopped' }).problem ?? 'failed';
      if (problem === 'stopped' || t !== token) return;
      asking = false;
      token = 0;
      micEnded(t, problem);
    },
  );
}

/** Close everything: no track left running, the context closed. Says nothing (the switch decides). */
export function closeMic(): void {
  // Stopped while the browser is still asking: the stream that arrives is closed at once.
  if (asking) stopListening();
  asking = false;
  token = 0;
  stopIdle();
  session?.stop();
  session = null;
  reporter?.dispose();
  reporter = null;
}

/** The tuner reads every frame while it is open. */
export function subscribeMicFrames(read: FrameReader): () => void {
  readers.add(read);
  return () => {
    readers.delete(read);
  };
}

/** The app is about to play a reference (the tuner's "Hear"): report nothing for `ms`. */
export function muteMic(ms: number): void {
  reporter?.muteFor(ms);
}
