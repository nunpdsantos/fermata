/**
 * Notes played on a real instrument, heard by the microphone, reported
 * through the wave-3 contract (`services/externalNotes.ts`, source 'mic'):
 * `on: true` once a note has been held steadily and surely for about a tenth
 * of a second, `on: false` when it ends. The app never sounds them (the
 * contract: they are already sounding in the room).
 *
 * What the app plays itself must not come back as the learner's note: while
 * the app is sounding (core audio's one signal, `appSoundingUntil`: every
 * Play, chord, strip, circle, loop, held key, MIDI-sounded note, the
 * metronome's clicks, the tuner's string — wave 3 integration) and for
 * APP_SOUND_TAIL_MS after; while the on-screen instrument is being played
 * (a tap or key press in the dock or the full-neck view) and for
 * APP_SOUND_MS after; and while a reference the app plays sounds
 * (`muteFor`), nothing is reported and a held note ends.
 */
import { appSoundingUntil } from '../../core/services/audio.ts';
import { emitExternalNote } from '../externalNotes.ts';
import { createNoteTracker } from './noteTracker.ts';
import type { PitchEstimate } from './pitch.ts';

/** How long after the on-screen instrument was played its sound is ignored. */
export const APP_SOUND_MS = 1500;
/**
 * How long after the app stops sounding what is heard is still ignored: the
 * room's echo, the speaker's and the microphone's latency, and the analysis
 * frame (4,096 samples, 85 ms at 48 kHz) that still holds the app's sound.
 */
export const APP_SOUND_TAIL_MS = 300;
const INSTRUMENT_SELECTOR = '#instrument-region, .neck-view';

export interface PlayedNotes {
  onFrame(estimate: PitchEstimate | null, time: number): void;
  /** Ignore what is heard for `ms` (the app is playing a reference). */
  muteFor(ms: number): void;
  /** Ends a held note and stops watching the on-screen instrument. */
  dispose(): void;
}

export function reportPlayedNotes(onNote?: (midi: number, on: boolean) => void): PlayedNotes {
  const tracker = createNoteTracker((midi, on) => {
    emitExternalNote({ midi, on, source: 'mic' });
    onNote?.(midi, on);
  });
  let quietUntil = 0;
  let pressing = false;
  /** The app was last heard sounding until this (plus the tail). */
  let appQuietUntil = 0;

  const fromInstrument = (e: Event) => e.target instanceof Element && e.target.closest(INSTRUMENT_SELECTOR) !== null;
  const onDown = (e: Event) => {
    if (!fromInstrument(e)) return;
    pressing = e.type === 'pointerdown';
    quietUntil = Math.max(quietUntil, performance.now() + APP_SOUND_MS);
    tracker.reset();
  };
  const onUp = () => {
    if (!pressing) return;
    pressing = false;
    quietUntil = Math.max(quietUntil, performance.now() + APP_SOUND_MS);
  };
  document.addEventListener('pointerdown', onDown, true);
  document.addEventListener('keydown', onDown, true);
  document.addEventListener('pointerup', onUp, true);
  document.addEventListener('pointercancel', onUp, true);

  return {
    onFrame(estimate, time) {
      const now = performance.now();
      if (appSoundingUntil(now) > now) appQuietUntil = now + APP_SOUND_TAIL_MS;
      if (pressing || now < quietUntil || now < appQuietUntil) {
        tracker.reset();
        return;
      }
      tracker.push(estimate, time);
    },
    muteFor(ms) {
      quietUntil = Math.max(quietUntil, performance.now() + ms);
      tracker.reset();
    },
    dispose() {
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('keydown', onDown, true);
      document.removeEventListener('pointerup', onUp, true);
      document.removeEventListener('pointercancel', onUp, true);
      tracker.reset();
    },
  };
}
