/**
 * Audit W8-01 remainder — "keep visual timeouts consistent".
 *
 * Scales, arpeggios and sequences schedule their SOUND on the audio clock and
 * their VISUALS (key highlights, onComplete clean-up) as tracked timeouts.
 * Cancelling the sound must also settle the visuals of that phrase: no key
 * may light up for a note that will never sound, and the phrase's clean-up
 * (which un-lights keys) must still run — once — instead of being dropped
 * (stopPlayback) or left to fire seconds later over silence
 * (cancelScheduledAudio).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { installMockAudioContext } from '../../../test/mockAudioContext';
import {
  setInstrumentVoice,
  playArpeggioAscending,
  playScale,
  playSequence,
  cancelScheduledAudio,
  stopPlayback,
} from '../audio';
import type { Note } from '../../types/music';

const n = (natural: Note['natural'], accidental: Note['accidental'] = ''): Note => ({ natural, accidental });
const CMAJ7 = [n('C'), n('E'), n('G'), n('B')];
const C_MAJOR_SCALE = [n('C'), n('D'), n('E'), n('F'), n('G'), n('A'), n('B')];

const voice = {
  playNote: vi.fn((_midi: number, _when: number, _duration: number, _velocity: number) => true),
  startNote: vi.fn((_midi: number, _velocity: number) => true),
  stopNote: vi.fn((_midi: number) => {}),
  setVolume: vi.fn((_volume: number) => {}),
  resume: vi.fn(() => Promise.resolve()),
  cancelScheduled: vi.fn(() => {}),
};

beforeEach(() => {
  vi.useFakeTimers();
  installMockAudioContext(1);
  vi.clearAllMocks();
  setInstrumentVoice(voice);
});
afterEach(() => {
  stopPlayback();
  setInstrumentVoice(null);
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

type Starter = (onNote: () => void, onDone: () => void) => void;
const PHRASES: Array<[string, Starter]> = [
  ['playArpeggioAscending', (onNote, onDone) => playArpeggioAscending(CMAJ7, 4, 0.3, onNote, onDone)],
  ['playScale', (onNote, onDone) => playScale(C_MAJOR_SCALE, 4, true, false, 0.3, onNote, onDone)],
  ['playSequence', (onNote, onDone) => playSequence(CMAJ7, 4, 0.3, 0.05, {}, onNote, onDone)],
];

describe.each(PHRASES)('%s: cancelling the sound settles the visuals', (_name, start) => {
  it('cancelScheduledAudio: no further highlights, clean-up runs at once and only once', () => {
    const onNote = vi.fn();
    const onDone = vi.fn();
    start(onNote, onDone);
    vi.advanceTimersByTime(100);
    expect(onNote).toHaveBeenCalledTimes(1); // known positive: the first note lit

    cancelScheduledAudio();
    expect(voice.cancelScheduled).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(10_000);
    expect(onNote).toHaveBeenCalledTimes(1);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('stopPlayback: the phrase clean-up still runs (no key left lit)', () => {
    const onNote = vi.fn();
    const onDone = vi.fn();
    start(onNote, onDone);
    vi.advanceTimersByTime(100);
    stopPlayback();
    expect(onDone).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(10_000);
    expect(onNote).toHaveBeenCalledTimes(1);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('a phrase that already finished is not cleaned up a second time', () => {
    const onNote = vi.fn();
    const onDone = vi.fn();
    start(onNote, onDone);
    vi.advanceTimersByTime(10_000);
    expect(onDone).toHaveBeenCalledTimes(1);
    cancelScheduledAudio();
    stopPlayback();
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});

describe('cancel only settles phrases that were cancelled', () => {
  it('a phrase started AFTER the cancel plays on normally', () => {
    const first = { onNote: vi.fn(), onDone: vi.fn() };
    const second = { onNote: vi.fn(), onDone: vi.fn() };
    playArpeggioAscending(CMAJ7, 4, 0.3, first.onNote, first.onDone);
    vi.advanceTimersByTime(50);
    cancelScheduledAudio();
    playArpeggioAscending(CMAJ7, 4, 0.3, second.onNote, second.onDone);
    vi.advanceTimersByTime(10_000);
    expect(second.onNote).toHaveBeenCalledTimes(4);
    expect(second.onDone).toHaveBeenCalledTimes(1);
    expect(first.onDone).toHaveBeenCalledTimes(1);
  });

  it('a clean-up that throws does not stop the others from running', () => {
    const bad = vi.fn(() => {
      throw new Error('component gone');
    });
    const good = vi.fn();
    playArpeggioAscending(CMAJ7, 4, 0.3, undefined, bad);
    playScale(C_MAJOR_SCALE, 4, true, false, 0.3, undefined, good);
    expect(() => cancelScheduledAudio()).not.toThrow();
    expect(bad).toHaveBeenCalledTimes(1);
    expect(good).toHaveBeenCalledTimes(1);
  });
});
