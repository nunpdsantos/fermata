/**
 * "Hear the string" (wave 3, brief T): the open string played by the app's
 * own guitar voice — the sampled guitar, or the Karplus-Strong pluck while
 * its samples load or offline — whatever instrument Explore has selected,
 * so the tuner is useful with no microphone at all.
 */
import * as guitarSampler from '../../services/guitarSampler.ts';
import * as ks from '../../services/karplusStrong.ts';
import { APP_SOUND_RELEASE_S, cancelScheduledAudio, noteAppSound } from '../../core/services/audio.ts';

/** How long a reference string sounds, in seconds. */
export const REFERENCE_SECONDS = 2.5;

/** Start downloading the guitar's samples (the tuner has opened). */
export function prepareGuitarStrings(): void {
  void guitarSampler.preload().catch(() => undefined);
}

/** Play an open string (MIDI number) once, now. Call it inside the learner's tap. */
export function playGuitarString(midi: number): void {
  cancelScheduledAudio();
  void guitarSampler.resumeContext().catch(() => undefined);
  void ks.resumeContext().catch(() => undefined);
  if (!guitarSampler.playNote(midi, 0, REFERENCE_SECONDS, 0.9)) ks.playNote(midi, 0, REFERENCE_SECONDS, 0.9);
  // The voices are called directly here, not through core's playNote: say
  // that the app is sounding (wave 3 integration), so the microphone does
  // not report the reference as the learner's note.
  noteAppSound(0, REFERENCE_SECONDS + APP_SOUND_RELEASE_S);
}
