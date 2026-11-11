/**
 * Looping a progression (wave 2, stream S).
 *
 * THE SCHEDULE (`loopCycle`, pure): one bar of count-in clicks first (four
 * beats, the rhythm player's click: G5, the first louder), then each chord
 * on every beat for its number of beats, the first beat a little stronger.
 * A beat lasts 60 / tempo seconds; chord i starts at
 * countIn + i × beats × beat. Each beat's notes last 90 % of the beat.
 *
 * THE LOOP (`ProgressionLoop`): nothing in core audio loops, so each cycle
 * is handed to `playTimedNotes` (the audio clock) in one go, and the next is
 * queued LEAD seconds before the current one ends, at the exact time it
 * ends — no gap. It stops on stop(), and by itself when another playback
 * cancels the scheduled audio (every other Play calls
 * `cancelScheduledAudio()` first): core then settles every phrase at once,
 * so a cycle's clean-up arriving before its notes have finished means the
 * loop no longer owns the audio.
 */
import type { Chord, PitchedNote } from '../../../core/types/music';
import { cancelScheduledAudio, playTimedNotes, resumeAudio, type TimedNote } from '../../../core/services/audio';
import { COUNT_IN_PITCH } from '../../../utils/rhythmPlayback';

export const COUNT_IN_BEATS = 4;
/** Count-in: the first click louder, as the rhythm player's. */
export const COUNT_IN_VOLUME = { first: 0.8, other: 0.5 } as const;
/** A chord's first beat a little stronger than the others. */
export const CHORD_VOLUME = { first: 0.62, other: 0.42 } as const;
/** Each beat's notes sound for this share of the beat. */
export const BEAT_LENGTH = 0.9;
/** The next cycle is handed to the audio clock this long before the current one ends. */
export const LEAD_S = 0.75;

export interface CycleInput {
  chords: readonly Chord[];
  bpm: number;
  beats: number;
  /** The pitches a chord sounds (Explore's register for the instrument). */
  pitches: (chord: Chord) => PitchedNote[];
  countIn: boolean;
}

export interface Cycle {
  notes: TimedNote[];
  /** For each note, the chord whose FIRST beat it opens (only the first note of that beat), else undefined. */
  chordAt: (number | undefined)[];
  /** When each chord starts, seconds from the cycle's start. */
  chordStarts: number[];
  /** The cycle's length (count-in included), seconds. */
  length: number;
}

export function loopCycle({ chords, bpm, beats, pitches, countIn }: CycleInput): Cycle {
  const beat = 60 / bpm;
  const notes: TimedNote[] = [];
  const chordAt: (number | undefined)[] = [];
  let t = 0;
  if (countIn) {
    for (let b = 0; b < COUNT_IN_BEATS; b++) {
      notes.push({ note: COUNT_IN_PITCH, at: b * beat, duration: beat * 0.25, volume: b === 0 ? COUNT_IN_VOLUME.first : COUNT_IN_VOLUME.other });
      chordAt.push(undefined);
    }
    t = COUNT_IN_BEATS * beat;
  }
  const chordStarts: number[] = [];
  chords.forEach((chord, i) => {
    const ps = pitches(chord);
    chordStarts.push(t);
    for (let b = 0; b < beats; b++) {
      ps.forEach((note, j) => {
        notes.push({ note, at: t + b * beat, duration: beat * BEAT_LENGTH, volume: b === 0 ? CHORD_VOLUME.first : CHORD_VOLUME.other });
        chordAt.push(b === 0 && j === 0 ? i : undefined);
      });
    }
    t += beats * beat;
  });
  return { notes, chordAt, chordStarts, length: t };
}

export type StopReason = 'user' | 'cancelled' | 'hidden' | 'closed' | 'changed' | 'error';

export interface LoopStart {
  chords: readonly Chord[];
  bpm: number;
  beats: number;
  pitches: (chord: Chord) => PitchedNote[];
  config: Parameters<typeof playTimedNotes>[1];
  /** The chord now sounding (its first beat). */
  onChord: (index: number) => void;
  /** The loop has stopped (any reason, once). */
  onStop: (reason: StopReason) => void;
}

export interface LoopClock {
  /** Seconds, monotonic (performance.now). */
  now: () => number;
  setTimeout: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
  clearTimeout: (t: ReturnType<typeof setTimeout>) => void;
}

const realClock: LoopClock = {
  now: () => performance.now() / 1000,
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (t) => clearTimeout(t),
};

/** How early (s) a cycle's clean-up may arrive before its notes end and still count as natural. */
const SETTLE_SLACK_S = 0.05;
/** The first cycle starts this long after ▶, so its first notes are never late. */
const START_DELAY_S = 0.06;

export class ProgressionLoop {
  private gen = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private current: LoopStart | null = null;
  private owns = false;
  /** Cycles handed to the audio clock (tests). */
  cycles = 0;

  constructor(private readonly clock: LoopClock = realClock) {}

  get playing(): boolean {
    return this.current !== null;
  }

  /** Start (stopping a loop already running, without its onStop). */
  async start(opts: LoopStart): Promise<void> {
    this.halt();
    const token = ++this.gen;
    this.current = opts;
    try {
      await resumeAudio();
    } catch {
      if (token === this.gen) this.stop('error');
      return;
    }
    if (token !== this.gen) return;
    // A new playback replaces whatever was sounding (W8-01).
    cancelScheduledAudio();
    this.owns = true;
    this.queue(token, this.clock.now() + START_DELAY_S, true);
  }

  /** A new tempo or beats per chord: the cycles not yet handed to the audio clock use it. */
  retime(bpm: number, beats: number): void {
    if (this.current) this.current = { ...this.current, bpm, beats };
  }

  /** Stop; the sound this loop scheduled is cancelled (unless someone else already did). */
  stop(reason: StopReason): void {
    const opts = this.current;
    if (!opts) return;
    const owned = this.owns;
    this.halt();
    if (owned && reason !== 'cancelled') cancelScheduledAudio();
    opts.onStop(reason);
  }

  /** Forget the running loop without a word (its sound is left to the caller). */
  private halt(): void {
    this.gen++;
    if (this.timer !== null) this.clock.clearTimeout(this.timer);
    this.timer = null;
    this.current = null;
    this.owns = false;
  }

  private queue(token: number, startAt: number, countIn: boolean): void {
    const opts = this.current;
    if (!opts || token !== this.gen) return;
    const cycle = loopCycle({ chords: opts.chords, bpm: opts.bpm, beats: opts.beats, pitches: opts.pitches, countIn });
    const calledAt = this.clock.now();
    const offset = Math.max(0, startAt - calledAt);
    const notes = cycle.notes.map((n) => ({ ...n, at: n.at + offset }));
    const naturalEnd = calledAt + Math.max(...notes.map((n) => n.at + n.duration));
    this.cycles++;
    playTimedNotes(notes, opts.config, {
      onNotePlay: (i) => {
        const chord = cycle.chordAt[i];
        if (chord !== undefined && token === this.gen) opts.onChord(chord);
      },
      onComplete: () => {
        // Settled before its notes ended: another playback cancelled the audio.
        if (token === this.gen && this.clock.now() < naturalEnd - SETTLE_SLACK_S) this.stop('cancelled');
      },
    });
    const next = startAt + cycle.length;
    this.timer = this.clock.setTimeout(() => {
      this.timer = null;
      this.queue(token, next, false);
    }, Math.max(0, (next - LEAD_S - this.clock.now()) * 1000));
  }
}
