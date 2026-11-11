/**
 * "Use my instrument": ONE microphone session for the whole check (wave 3
 * integration, seam 3). It is opened only by the learner's tap (the audio
 * context is made in that tap: iOS Safari starts audio only there) and kept
 * from question to question, so a later question never opens the microphone
 * from an effect, outside a tap, where such a browser would leave it silent.
 * It ends — every track stopped, its audio context closed — when the learner
 * turns it off, when the check ends or is left (ExerciseRunner unmounts),
 * when the page is hidden, the app changes view or the device goes away
 * (`services/microphone/microphone.ts` stops itself then).
 *
 * In memory only, never saved. While it is on, every note heard held
 * steadily is reported through `services/externalNotes.ts` (source 'mic');
 * where it lands is the one listener's business (`externalNotesListener.ts`:
 * an instrument question still open adds it, anything else ignores it).
 */
import { create } from 'zustand';
import { makeAudioContext } from '../../services/microphone/support.ts';
import type { MicProblem, MicSession, MicStopReason } from '../../services/microphone/microphone.ts';
import type { PlayedNotes } from '../../services/microphone/playedNotes.ts';

export type AnswerListening =
  | { kind: 'off' }
  | { kind: 'asking' }
  | { kind: 'on'; heard: number | null }
  | { kind: 'problem'; problem: MicProblem | 'hidden' | 'ended' };

export const useAnswerListening = create<{ state: AnswerListening }>(() => ({ state: { kind: 'off' } }));

const show = (state: AnswerListening) => useAnswerListening.setState({ state });

/** One token per attempt: an attempt replaced or stopped before the browser answers closes whatever arrives after. */
let attempt: object | null = null;
let session: MicSession | null = null;
let reporter: PlayedNotes | null = null;
let mic: typeof import('../../services/microphone/microphone.ts') | null = null;

function release(): void {
  // Stopped while the browser is still asking: the stream that arrives is closed at once.
  if (attempt && !session) mic?.stopListening();
  attempt = null;
  session?.stop();
  session = null;
  reporter?.dispose();
  reporter = null;
}

/** Is the microphone open (or being opened) for the check? */
export function answerListening(): boolean {
  return attempt !== null || session !== null;
}

/**
 * Turn "Use my instrument" on. Call it INSIDE the learner's tap: the audio
 * context is made before anything is awaited; the microphone's code loads
 * after it.
 */
export function startAnswerListening(): void {
  release();
  const token = {};
  attempt = token;
  const current = () => attempt === token;
  show({ kind: 'asking' });
  let context: AudioContext | undefined;
  try {
    context = makeAudioContext();
  } catch {
    context = undefined;
  }
  const loading = Promise.all([import('../../services/microphone/microphone.ts'), import('../../services/microphone/playedNotes.ts')]);
  void loading.then(([micModule, played]) => {
    mic = micModule;
    if (!current()) {
      void context?.close().catch(() => undefined);
      return;
    }
    const notes = played.reportPlayedNotes((midi, on) => {
      if (on && current()) show({ kind: 'on', heard: midi });
    });
    const onStop = (reason: MicStopReason) => {
      notes.dispose();
      if (!current()) return;
      attempt = null;
      reporter = null;
      session = null;
      // A view change turns it off with no sentence (the check went with the
      // view; "went off screen" would not be true).
      show(reason === 'hidden' || reason === 'ended' ? { kind: 'problem', problem: reason } : { kind: 'off' });
    };
    micModule.startListening({ onFrame: (e, time) => notes.onFrame(e, time), onStop }, context).then(
      (s) => {
        if (!current()) {
          s.stop();
          notes.dispose();
          return;
        }
        session = s;
        reporter = notes;
        show({ kind: 'on', heard: null });
      },
      (error: unknown) => {
        notes.dispose();
        const problem = (error as { problem?: MicProblem | 'stopped' }).problem ?? 'failed';
        if (problem === 'stopped' || !current()) return;
        attempt = null;
        show({ kind: 'problem', problem });
      },
    );
  }, () => {
    void context?.close().catch(() => undefined);
    if (!current()) return;
    attempt = null;
    show({ kind: 'problem', problem: 'failed' });
  });
}

/** Turn it off: the learner's tap, or the check ended or was left. No track is left running. */
export function stopAnswerListening(): void {
  release();
  show({ kind: 'off' });
}
