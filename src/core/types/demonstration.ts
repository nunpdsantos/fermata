/**
 * A lesson demonstration (second audit of 18 November 2026, M50–M56): what a
 * Try This plays and draws when its sentence says more than a scale, a chord
 * or a list of chords can — notes that sound together and one after another
 * at the pitches written, a note held while others move, a key signature
 * after the clef.
 *
 * It is written as music is: one or two VOICES, each a run of EVENTS (a note,
 * several notes sounding together, or a rest) with a note value; a tie holds
 * a note into the next event. The same data is what "Hear it" plays (on the
 * audio clock, `demonstrationSchedule` → `playTimedNotes`) and what the staff
 * draws (`DemoStaff`: one staff, or treble and bass joined when a voice is on
 * each), so the two cannot disagree. Checked when it is authored
 * (`demonstration()` in `core/utils/demonstration.ts`): the type spells every
 * pitch; the check adds up every bar.
 *
 * Pitches are WRITTEN pitches in scientific notation: letter, accidental,
 * octave, with C4 = middle C ('F#5', 'Bb3'). They are what sounds, too: a
 * demonstration is never transposed for the instrument.
 */
import type { NaturalNote } from './music';

export type DemoAccidental = '' | '#' | 'b' | '##' | 'bb';
export type DemoOctave = 1 | 2 | 3 | 4 | 5 | 6 | 7;
/** A spelled, written pitch: 'C4' is middle C, 'F#5' the F sharp at the top of the treble staff. */
export type DemoPitch = `${NaturalNote}${DemoAccidental}${DemoOctave}`;

/** Note values: whole, half, quarter, eighth; a dot adds half again. */
export type DemoValue = 'w' | 'h.' | 'h' | 'q.' | 'q' | '8';

/** A key signature drawn after the clef, by its key (VexFlow's names): 'G' one sharp, 'F' one flat, 'Dm' one flat. */
export type DemoKey =
  | 'C' | 'G' | 'D' | 'A' | 'E' | 'B' | 'F#' | 'C#' | 'F' | 'Bb' | 'Eb' | 'Ab' | 'Db' | 'Gb' | 'Cb'
  | 'Am' | 'Em' | 'Bm' | 'F#m' | 'C#m' | 'G#m' | 'D#m' | 'A#m' | 'Dm' | 'Gm' | 'Cm' | 'Fm' | 'Bbm' | 'Ebm' | 'Abm';

export interface DemoEvent {
  /** The pitches that sound together, low to high; none is a rest. */
  notes: readonly DemoPitch[];
  value: DemoValue;
  /** Held into this voice's next event, which holds the same pitches: one sound, drawn as two tied notes. */
  tie?: true;
}

export interface DemoVoice {
  /** The staff it is written on. A voice on each staff draws them joined, treble above bass. */
  staff: 'treble' | 'bass';
  events: readonly DemoEvent[];
}

export interface Demonstration {
  /** The key signature after each clef. Omitted: no key signature, every sharp or flat beside its note. */
  key?: DemoKey;
  /** A time signature, drawn after the key signature; every voice then fills whole bars, with bar lines. */
  time?: '2/4' | '3/4' | '4/4';
  /** Quarter notes per minute. */
  tempo: number;
  /** One voice, or two that sound at once (the upper first); every voice lasts as long as the others. */
  voices: readonly DemoVoice[];
}
