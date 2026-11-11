/**
 * The loop's schedule against an independent reading of tempo and beats, and
 * the loop itself on a fake clock: gapless cycles, the next one queued before
 * the current ends, a new tempo from the next time round, and stopping by
 * itself when another playback cancels the audio.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { PitchedNote } from '../../../../core/types/music';

type Callbacks = { onNotePlay: (i: number) => void; onComplete: () => void };
const audio = vi.hoisted(() => ({
  calls: [] as { notes: { note: PitchedNote; at: number; duration: number; volume?: number }[]; cb?: Callbacks; at: number }[],
  cancelled: 0,
  now: 0,
}));

vi.mock('../../../../core/services/audio', () => ({
  resumeAudio: () => Promise.resolve(),
  playTimedNotes: (notes: never, _c: unknown, cb?: Callbacks) => { audio.calls.push({ notes, cb, at: audio.now }); },
  // Core settles every phrase at once: each one's clean-up runs now.
  cancelScheduledAudio: () => {
    audio.cancelled++;
    const pending = audio.calls.splice(0);
    for (const c of pending) c.cb?.onComplete();
  },
}));

import { loopCycle, ProgressionLoop, COUNT_IN_BEATS, LEAD_S, type LoopClock } from '../progressionLoop';
import { readChords } from '../progressionModel';
import { exploreRegister } from '../../exploreRegister';
import { getMidiNumber } from '../../../../core/utils/pianoLayout';

const chords = readChords(['G', 'D', 'Em', 'C']);
const pitches = (c: (typeof chords)[number]) => exploreRegister('piano').chordPitches(c.notes, c.bassNote);
const midi = (p: PitchedNote) => getMidiNumber(p, p.octave);

describe('one cycle, read independently', () => {
  for (const [bpm, beats] of [[90, 4], [120, 2], [50, 4], [200, 2]] as const) {
    it(`${bpm} beats a minute, ${beats} beats a chord: count-in, then every beat of every chord`, () => {
      const beat = 60 / bpm; // seconds
      const c = loopCycle({ chords, bpm, beats, pitches, countIn: true });
      const clicks = c.notes.slice(0, COUNT_IN_BEATS);
      expect(clicks.map((n) => n.at)).toEqual([0, 1, 2, 3].map((k) => k * beat));
      expect(clicks.map((n) => `${n.note.natural}${n.note.octave}`)).toEqual(['G5', 'G5', 'G5', 'G5']);
      expect(clicks[0].volume!).toBeGreaterThan(clicks[1].volume!);
      const body = c.notes.slice(COUNT_IN_BEATS);
      let k = 0;
      chords.forEach((chord, i) => {
        const tones = pitches(chord).map(midi);
        for (let b = 0; b < beats; b++) {
          const at = (4 + i * beats + b) * beat;
          const here = body.slice(k, k + tones.length);
          k += tones.length;
          expect(here.map((n) => midi(n.note)), `${chord.root.natural} beat ${b}`).toEqual(tones);
          for (const n of here) {
            expect(n.at).toBeCloseTo(at, 9);
            // Each beat's notes last 90 % of the beat (a short breath before the next).
            expect(n.duration).toBeCloseTo(beat * 0.9, 9);
          }
          // The first beat a little stronger.
          if (b > 0) expect(here[0].volume!).toBeLessThan(body[k - tones.length * (b + 1)].volume!);
        }
      });
      expect(k).toBe(body.length);
      expect(c.length).toBeCloseTo((4 + chords.length * beats) * beat, 9);
      expect(c.chordStarts).toEqual(chords.map((_, i) => (4 + i * beats) * beat));
      // The chord shown changes on its first beat only.
      const shown = c.chordAt.map((x, i) => (x === undefined ? null : [x, c.notes[i].at])).filter(Boolean);
      expect(shown).toEqual(chords.map((_, i) => [i, (4 + i * beats) * beat]));
    });
  }
  it('without the count-in (every cycle after the first), the first chord starts at once', () => {
    const c = loopCycle({ chords, bpm: 60, beats: 4, pitches, countIn: false });
    expect(c.notes[0].at).toBe(0);
    expect(c.length).toBe(16);
  });
});

/** A clock the test moves by hand; timers fire as it passes them. */
function fakeClock(): LoopClock & { advance: (s: number) => void } {
  const timers: { at: number; fn: () => void; id: number }[] = [];
  let id = 0;
  const clock = {
    now: () => audio.now,
    setTimeout: (fn: () => void, ms: number) => {
      timers.push({ at: audio.now + ms / 1000, fn, id: ++id });
      return id as unknown as ReturnType<typeof setTimeout>;
    },
    clearTimeout: (t: ReturnType<typeof setTimeout>) => {
      const i = timers.findIndex((x) => x.id === (t as unknown as number));
      if (i >= 0) timers.splice(i, 1);
    },
    advance: (s: number) => {
      const end = audio.now + s;
      for (;;) {
        timers.sort((a, b) => a.at - b.at);
        const next = timers[0];
        if (!next || next.at > end) break;
        timers.shift();
        audio.now = next.at;
        next.fn();
      }
      audio.now = end;
    },
  };
  return clock;
}

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('the loop', () => {
  beforeEach(() => {
    audio.calls = [];
    audio.cancelled = 0;
    audio.now = 100;
  });

  const start = async (loop: ProgressionLoop, extra: Partial<Parameters<ProgressionLoop['start']>[0]> = {}) => {
    const onStop = vi.fn();
    const onChord = vi.fn();
    await loop.start({ chords, bpm: 120, beats: 2, pitches, config: {}, onChord, onStop, ...extra });
    await flush();
    return { onStop, onChord };
  };

  it('queues each cycle before the current one ends, starting exactly where it ends (no gap)', async () => {
    const clock = fakeClock();
    const loop = new ProgressionLoop(clock);
    await start(loop);
    expect(audio.cancelled).toBe(1); // ▶ replaces whatever was sounding
    expect(audio.calls).toHaveLength(1);
    const first = audio.calls[0];
    const beat = 0.5;
    const firstStart = first.at + first.notes[0].at; // the first click
    const cycle1End = firstStart + (4 + 4 * 2) * beat;
    clock.advance(cycle1End - LEAD_S - audio.now - 0.01);
    expect(audio.calls).toHaveLength(1);
    clock.advance(0.02);
    expect(audio.calls).toHaveLength(2);
    const second = audio.calls[1];
    expect(second.at + second.notes[0].at).toBeCloseTo(cycle1End, 9);
    // Handed to the audio clock well BEFORE the first cycle ends (read
    // independently of LEAD_S: at least half a second ahead, so a late
    // timer still leaves no gap).
    expect(cycle1End - second.at).toBeGreaterThanOrEqual(0.5);
    // No count-in the second time.
    expect(second.notes).toHaveLength(first.notes.length - 4);
    const cycle2End = cycle1End + 4 * 2 * beat;
    clock.advance(cycle2End - audio.now);
    expect(audio.calls[2].at + audio.calls[2].notes[0].at).toBeCloseTo(cycle2End, 9);
    expect(loop.playing).toBe(true);
    loop.stop('user');
  });

  it('the first notes are scheduled a little ahead of ▶ (never late), and not noticeably', async () => {
    const clock = fakeClock();
    const loop = new ProgressionLoop(clock);
    await start(loop);
    const first = audio.calls[0];
    // `at` is seconds from the moment the notes were handed over.
    expect(first.notes[0].at).toBeGreaterThanOrEqual(0.02);
    expect(first.notes[0].at).toBeLessThanOrEqual(0.2);
    loop.stop('user');
  });

  it('a new tempo applies from the next cycle', async () => {
    const clock = fakeClock();
    const loop = new ProgressionLoop(clock);
    await start(loop);
    loop.retime(60, 4);
    clock.advance(10);
    const second = audio.calls[1];
    expect(second.notes[1 * 3].at - second.notes[0].at).toBeCloseTo(1, 9); // one beat = 1 s at 60
    loop.stop('user');
  });

  it('a new number of beats per chord applies from the next cycle', async () => {
    const clock = fakeClock();
    const loop = new ProgressionLoop(clock);
    await start(loop); // 120 a minute, 2 beats a chord
    const first = audio.calls[0];
    const tones = chords.map((c) => pitches(c).length);
    expect(first.notes).toHaveLength(4 + tones.reduce((a, n) => a + n * 2, 0));
    loop.retime(120, 4);
    clock.advance(10);
    const second = audio.calls[1];
    // Four beats of every chord, no count-in; the second chord starts 4 beats (2 s) in.
    expect(second.notes).toHaveLength(tones.reduce((a, n) => a + n * 4, 0));
    expect(second.notes[tones[0] * 4].at - second.notes[0].at).toBeCloseTo(2, 9);
    loop.stop('user');
  });

  it('■: stops, cancels its own sound, says so once; the chord callbacks only while it plays', async () => {
    const clock = fakeClock();
    const loop = new ProgressionLoop(clock);
    const { onStop, onChord } = await start(loop);
    audio.calls[0].cb!.onNotePlay(4);
    expect(onChord).toHaveBeenCalledWith(0);
    const cancelledBefore = audio.cancelled;
    const pending = [...audio.calls];
    loop.stop('user');
    expect(audio.cancelled).toBe(cancelledBefore + 1);
    expect(onStop).toHaveBeenCalledTimes(1);
    expect(onStop).toHaveBeenCalledWith('user');
    pending[0].cb?.onNotePlay(4);
    expect(onChord).toHaveBeenCalledTimes(1);
    clock.advance(60);
    expect(audio.calls).toHaveLength(0); // nothing queued after ■
  });

  it('another playback cancelling the audio stops the loop by itself (no sound left with ▶ showing)', async () => {
    const clock = fakeClock();
    const loop = new ProgressionLoop(clock);
    const { onStop } = await start(loop);
    clock.advance(2);
    // Someone else's Play: core settles every phrase now.
    const before = audio.cancelled;
    audio.calls.splice(0).forEach((c) => c.cb?.onComplete());
    expect(loop.playing).toBe(false);
    expect(onStop).toHaveBeenCalledWith('cancelled');
    expect(audio.cancelled).toBe(before); // it does not cancel the newcomer's sound
    clock.advance(60);
    expect(audio.calls).toHaveLength(0);
  });

  it('a cycle that ends naturally does not stop the loop', async () => {
    const clock = fakeClock();
    const loop = new ProgressionLoop(clock);
    const { onStop } = await start(loop);
    clock.advance(6.2); // past the first cycle (6 s at 120, 2 beats, with the count-in)
    audio.calls[0].cb!.onComplete();
    expect(loop.playing).toBe(true);
    expect(onStop).not.toHaveBeenCalled();
    loop.stop('user');
  });
});
