/**
 * Notes played on a real instrument — a wave-3 contract (2026-11-11).
 *
 * OWNER: the MIDI branch (stream K). It may add to this file; every exported
 * name below keeps its meaning. Every other branch may only IMPORT the names
 * exported here, and must not change this file.
 *
 * Two things can hear a real instrument: a MIDI keyboard (stream K) and the
 * microphone (stream T). Both report what they hear here, and the app listens
 * in ONE place (stream K mounts the listener): in Explore a played note lights
 * on the on-screen instrument; in a check that is answered on the instrument
 * it ADDS that note to the answer (a played note never removes one: that is
 * done by tapping it on the screen).
 *
 *   midi      the note, as a MIDI number (60 = middle C)
 *   on        true when the note starts, false when it ends
 *   source    'midi' — a key pressed on a MIDI keyboard. The keyboard may
 *             make no sound of its own, so the app SOUNDS the note.
 *             'mic'  — a note the microphone has heard held steadily. It is
 *             already sounding in the room, so the app must NOT sound it
 *             (it would hear itself).
 *   velocity  0–1, MIDI only; left out by the microphone.
 *
 * Nothing here is saved, and nothing heard ever leaves the device.
 */
export type ExternalNoteSource = 'midi' | 'mic';

export interface ExternalNote {
  midi: number;
  on: boolean;
  source: ExternalNoteSource;
  velocity?: number;
}

type Listener = (note: ExternalNote) => void;

const listeners = new Set<Listener>();

/** Report a note heard on a real instrument. */
export function emitExternalNote(note: ExternalNote): void {
  for (const listener of [...listeners]) listener(note);
}

/** Listen to every note reported; returns the function that stops listening. */
export function subscribeExternalNotes(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
