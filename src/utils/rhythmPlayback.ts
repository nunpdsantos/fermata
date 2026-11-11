/**
 * Play a rhythm (W5-64) with the app's audio engine: a one-bar count-in,
 * then one click per sounded note, scheduled on the audio clock from
 * `rhythmSchedule` — so what is heard is exactly the written durations (the
 * schedule is what the tests check). Clicks are short, high notes of the
 * selected instrument's voice: the count-in a fifth above the rhythm, the
 * first beat of the count-in and accented notes louder.
 *
 * It brings its own count-in, so it says it is starting (`rhythmStart.ts`)
 * and a running metronome stops (wave 3, second fix pass). This file never
 * imports the metronome: its clock stays out of the Learn chunk.
 */
import { cancelScheduledAudio, playTimedNotes, resumeAudio, type TimedNote } from '../core/services/audio';
import { rhythmSchedule } from '../core/utils/rhythm';
import { getSynthConfig } from '../services/synthConfig';
import type { RhythmPattern } from '../core/types/exercise';
import type { PitchedNote } from '../core/types/music';
import { rhythmStarting } from './rhythmStart';

/** The rhythm's clicks sound C5; the count-in G5. */
export const RHYTHM_PITCH: PitchedNote = { natural: 'C', accidental: '', octave: 5 };
export const COUNT_IN_PITCH: PitchedNote = { natural: 'G', accidental: '', octave: 5 };

/** The notes a rhythm plays, in schedule order (exported for tests). */
export function rhythmNotes(pattern: RhythmPattern): { notes: TimedNote[]; total: number } {
  const schedule = rhythmSchedule(pattern);
  const notes = schedule.events.map((e) => ({
    note: e.kind === 'count' ? COUNT_IN_PITCH : RHYTHM_PITCH,
    at: e.at,
    duration: e.duration,
    volume: e.accent ? 0.8 : 0.5,
  }));
  return { notes, total: schedule.total };
}

/** Play it (stopping whatever else was playing, the metronome too). Resolves with its length in seconds. */
export async function playRhythm(pattern: RhythmPattern): Promise<number> {
  rhythmStarting();
  cancelScheduledAudio();
  await resumeAudio();
  const { notes, total } = rhythmNotes(pattern);
  playTimedNotes(notes, getSynthConfig('piano'));
  return total;
}
