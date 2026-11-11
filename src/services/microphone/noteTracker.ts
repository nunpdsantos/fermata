/**
 * From a stream of pitch readings to notes played (wave 3, brief T): a note
 * starts once it has been heard, sure of its pitch, for HOLD_MS (about a
 * tenth of a second) and ends when it has not been heard for RELEASE_MS, or
 * when another note has been held long enough to take its place. A single
 * unsure or stray frame inside a held note changes nothing.
 */
import { nearestNote, SURE_CLARITY, type PitchEstimate } from './pitch.ts';

export const HOLD_MS = 100;
export const RELEASE_MS = 150;

export interface NoteTracker {
  /** One reading (null = nothing heard) at `time` ms. */
  push(estimate: PitchEstimate | null, time: number): void;
  /** Forget everything; a note that was on is reported off. */
  reset(): void;
  /** The note on now, if any. */
  readonly current: number | null;
}

export function createNoteTracker(onNote: (midi: number, on: boolean) => void): NoteTracker {
  let active: number | null = null;
  let activeSeen = 0;
  let candidate: number | null = null;
  let candidateSince = 0;
  let candidateSeen = 0;

  const end = () => {
    if (active === null) return;
    const was = active;
    active = null;
    onNote(was, false);
  };

  return {
    get current() {
      return active;
    },
    push(estimate, time) {
      const midi = estimate && estimate.clarity >= SURE_CLARITY ? nearestNote(estimate.frequency).midi : null;
      if (midi !== null && midi === active) {
        activeSeen = time;
        candidate = null;
      } else if (midi !== null) {
        if (candidate !== midi || time - candidateSeen > RELEASE_MS) {
          candidate = midi;
          candidateSince = time;
        }
        candidateSeen = time;
        if (time - candidateSince >= HOLD_MS) {
          end();
          active = midi;
          activeSeen = time;
          candidate = null;
          onNote(midi, true);
        }
      }
      if (active !== null && time - activeSeen > RELEASE_MS) end();
      if (candidate !== null && time - candidateSeen > RELEASE_MS) candidate = null;
    },
    reset() {
      end();
      candidate = null;
    },
  };
}
