/**
 * Wave 3 integration, the seams that need no browser (the browser half is
 * `e2e/wave3-seams.spec.ts`).
 *
 * Seam 1: in Explore the tuner's "Show what I play on the instrument" lights
 * the note: the tuner is a sheet, but the one listener does not count it as
 * "something open over Explore" (the landscape full neck is the other such).
 *
 * Seams 2 and 4: the app must not hear itself.
 *
 * Core audio keeps ONE signal, "the app is sounding now, until t"
 * (`appSoundingUntil`), fed by every path that starts or schedules sound:
 * `playNote` (so every scale, chord, sequence and `playTimedNotes` phrase,
 * whichever voice plays it), the sustained notes (a held key, a MIDI key),
 * and the engines with a clock of their own (`noteAppSound`: the metronome's
 * clicks, the tuner's reference string). The microphone's note reporting
 * (`reportPlayedNotes`) ignores what it hears while that holds, plus a short
 * tail. Each feeding path has its own test here, so removing any one of them
 * fails one.
 *
 * Seam 4: a MIDI key is sounded by the app once; the microphone hearing that
 * sound reports nothing; the answer holds the note once.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup } from '@testing-library/react';
import {
  appSoundingUntil, noteAppSound, playNote, playScale, playTimedNotes, startSustainedNote, stopSustainedNote,
  cancelScheduledAudio, stopPlayback, setInstrumentVoice, APP_SOUND_RELEASE_S, _resetAppSoundForTesting,
} from '../core/services/audio';
import { installMockAudioContext } from '../test/mockAudioContext';
import { reportPlayedNotes, APP_SOUND_TAIL_MS } from '../services/microphone/playedNotes';
import { subscribeExternalNotes, type ExternalNote } from '../services/externalNotes';
import { midiHz } from '../services/microphone/__tests__/fakeMic';
import { playGuitarString, REFERENCE_SECONDS } from '../components/tuner/hearString';
import { clickSink, CLICK_S, _resetClicksForTesting } from '../services/metronome/clickVoice';
import { applyExternalNote, externalPlace, releaseAllExternalNotes } from '../services/externalNotesListener';
import { setExternalAnswerTarget } from '../services/externalAnswer';
import { useAppStore } from '../state/store';
import type { Note } from '../core/types/music';

const C: Note = { natural: 'C', accidental: '' };
const RELEASE_MS = APP_SOUND_RELEASE_S * 1000;

const voice = {
  playNote: vi.fn((_midi: number, _when: number, _duration: number, _velocity: number) => true),
  startNote: vi.fn((_midi: number, _velocity: number) => true), stopNote: vi.fn(), setVolume: vi.fn(),
  resume: vi.fn(() => Promise.resolve()), cancelScheduled: vi.fn(),
};

let t0 = 0;
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['performance', 'Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
  installMockAudioContext(5);
  _resetAppSoundForTesting();
  _resetClicksForTesting();
  setInstrumentVoice(voice);
  t0 = performance.now();
});
afterEach(() => {
  releaseAllExternalNotes();
  stopPlayback();
  setInstrumentVoice(null);
  cleanup();
  _resetAppSoundForTesting();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  useAppStore.setState({ view: 'explore', exerciseInputActive: false, activeNotes: new Set<number>() });
});

describe('seam 1: the tuner sheet over Explore', () => {
  const modal = (testId: string) => {
    const el = document.createElement('div');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('data-testid', testId);
    document.body.appendChild(el);
    return el;
  };
  it('a mic note heard with the tuner open in Explore lights the key; another sheet open makes it "elsewhere"', () => {
    useAppStore.setState({ view: 'explore', exerciseInputActive: false, activeNotes: new Set<number>() });
    const tuner = modal('tuner-sheet');
    expect(externalPlace()).toBe('explore');
    applyExternalNote({ midi: 64, on: true, source: 'mic' });
    expect([...useAppStore.getState().activeNotes]).toEqual([64]);
    applyExternalNote({ midi: 64, on: false, source: 'mic' });
    expect([...useAppStore.getState().activeNotes]).toEqual([]);
    const settings = modal('settings-sheet');
    expect(externalPlace()).toBe('elsewhere');
    settings.remove();
    tuner.remove();
  });

  it('the tuner sheet over a check (anywhere but Explore) is a sheet over it: a key played adds nothing to the hidden answer', () => {
    const added: number[] = [];
    useAppStore.setState({ view: 'learn', exerciseInputActive: true });
    const untarget = setExternalAnswerTarget((m) => added.push(m));
    expect(externalPlace()).toBe('answer');
    const tuner = modal('tuner-sheet');
    expect(externalPlace()).toBe('elsewhere');
    applyExternalNote({ midi: 61, on: true, source: 'midi', velocity: 0.8 });
    applyExternalNote({ midi: 61, on: false, source: 'midi' });
    applyExternalNote({ midi: 62, on: true, source: 'mic' });
    applyExternalNote({ midi: 62, on: false, source: 'mic' });
    expect(added).toEqual([]);
    tuner.remove();
    expect(externalPlace()).toBe('answer');
    untarget();
    // In Drill too it is a sheet over the view.
    useAppStore.setState({ view: 'drill', exerciseInputActive: false });
    const again = modal('tuner-sheet');
    expect(externalPlace()).toBe('elsewhere');
    again.remove();
  });
});

describe('core audio: "the app is sounding now, until t"', () => {
  it('silent before anything plays', () => {
    expect(appSoundingUntil()).toBe(0);
  });

  it('playNote: from now, for its length and the voice\'s release', () => {
    playNote(C, 4, 0.5);
    expect(appSoundingUntil(t0)).toBe(t0 + 500 + RELEASE_MS);
    expect(appSoundingUntil(t0 + 500 + RELEASE_MS - 1)).toBeGreaterThan(0);
    expect(appSoundingUntil(t0 + 500 + RELEASE_MS + 1)).toBe(0);
  });

  it('the release and the tail, in milliseconds (not read from the constants they pin): 1 s, 300 ms', () => {
    // A note of half a second sounds until 1.5 s after it starts.
    playNote(C, 4, 0.5);
    expect(appSoundingUntil(t0 + 1490)).toBe(t0 + 1500);
    expect(appSoundingUntil(t0 + 1501)).toBe(0);
    // The microphone hears a steady E from 1.5 s on: nothing until 300 ms after the app stopped (1.8 s), then the
    // E held 100 ms more is the learner's.
    const heard: number[] = [];
    const off = subscribeExternalNotes((n) => {
      if (n.source === 'mic' && n.on) heard.push(performance.now() - t0);
    });
    const r = reportPlayedNotes();
    for (let ms = 30; ms <= 2400; ms += 30) {
      vi.advanceTimersByTime(30);
      r.onFrame({ frequency: midiHz(64), clarity: 0.97 }, performance.now());
    }
    // (Frames come every 30 ms, so the last frame that met the app's sound may be up to one frame before 1.5 s.)
    expect(heard).toHaveLength(1);
    expect(heard[0]).toBeGreaterThanOrEqual(1800 + 100 - 30);
    expect(heard[0]).toBeLessThanOrEqual(1800 + 100 + 60);
    r.dispose();
    off();
  });

  it('a scale (scheduled one-shots): every note counts from its own start', () => {
    playScale([C, { natural: 'D', accidental: '' }, { natural: 'E', accidental: '' }], 4, true, false, 0.4);
    // Something sounds at each moment through the whole scale.
    for (let ms = 0; ms < 3 * 400; ms += 100) expect(appSoundingUntil(t0 + ms), `${ms} ms`).toBeGreaterThan(t0 + ms);
  });

  it('playTimedNotes (the loop, rhythms, melodies): a note to come is not sounding yet; it is when it starts', () => {
    playTimedNotes([{ note: { ...C, octave: 4 }, at: 2, duration: 0.5 }]);
    expect(appSoundingUntil(t0)).toBe(0);
    expect(appSoundingUntil(t0 + 2100)).toBe(t0 + 2500 + RELEASE_MS);
  });

  it('a sustained note (a held key or fret, a MIDI key): sounding while held, then its release', () => {
    startSustainedNote(C, 4);
    vi.advanceTimersByTime(10_000);
    expect(appSoundingUntil()).toBe(Infinity);
    stopSustainedNote(60);
    const now = performance.now();
    expect(appSoundingUntil(now)).toBe(now + RELEASE_MS);
    expect(appSoundingUntil(now + RELEASE_MS + 1)).toBe(0);
  });

  it('cancelScheduledAudio(): a one-shot to come never counts, one sounding fades now; held notes and other engines are left', () => {
    playNote(C, 4, 2);
    playTimedNotes([{ note: { ...C, octave: 5 }, at: 3, duration: 0.5 }]);
    const click = noteAppSound(4, 0.3);
    cancelScheduledAudio();
    expect(appSoundingUntil(t0)).toBeLessThanOrEqual(t0 + 100);
    expect(appSoundingUntil(t0 + 3100)).toBe(0);
    expect(appSoundingUntil(t0 + 4100)).toBe(t0 + 4300);
    click();
    expect(appSoundingUntil(t0 + 4100)).toBe(0);
  });

  it('stopPlayback() cancels the one-shots too', () => {
    playTimedNotes([{ note: { ...C, octave: 4 }, at: 1, duration: 0.5 }]);
    stopPlayback();
    expect(appSoundingUntil(t0 + 1100)).toBe(0);
  });

  it('the tuner\'s "Hear the string" (the guitar voice called directly)', () => {
    setInstrumentVoice(null);
    playGuitarString(40);
    expect(appSoundingUntil(t0)).toBe(t0 + (REFERENCE_SECONDS + APP_SOUND_RELEASE_S) * 1000);
  });

  it('the metronome\'s clicks (their own audio clock): each from its time, and a click taken back no longer counts', () => {
    // The mock audio clock stands at 5 s: a click at 5.5 s is half a second from now.
    const id = clickSink.schedule(5.5, true);
    expect(appSoundingUntil(t0 + 100)).toBe(0);
    const until = appSoundingUntil(t0 + 600);
    expect(until).toBeGreaterThanOrEqual(t0 + 500 + CLICK_S * 1000);
    expect(until).toBeLessThan(t0 + 1000);
    clickSink.cancel(id);
    expect(appSoundingUntil(t0 + 600)).toBe(0);
  });

  it('a MIDI key, sounded by the one listener: sounding while held', () => {
    useAppStore.setState({ view: 'explore' });
    applyExternalNote({ midi: 64, on: true, source: 'midi', velocity: 0.8 });
    expect(appSoundingUntil()).toBe(Infinity);
    applyExternalNote({ midi: 64, on: false, source: 'midi' });
    const now = performance.now();
    expect(appSoundingUntil(now)).toBe(now + RELEASE_MS);
  });

  it('a mic note is never sounded, so it never makes the app "sounding"', () => {
    applyExternalNote({ midi: 64, on: true, source: 'mic' });
    expect(appSoundingUntil()).toBe(0);
    applyExternalNote({ midi: 64, on: false, source: 'mic' });
  });
});

describe('the microphone ignores what the app plays', () => {
  let heard: ExternalNote[];
  let off: () => void;
  beforeEach(() => {
    heard = [];
    off = subscribeExternalNotes((n) => {
      if (n.source === 'mic') heard.push(n);
    });
  });
  afterEach(() => off());

  const sure = (midi: number) => ({ frequency: midiHz(midi), clarity: 0.97 });
  /** The microphone hears `midi` steadily for `ms` (one frame every 30 ms). */
  const hear = (r: ReturnType<typeof reportPlayedNotes>, midi: number, ms: number) => {
    for (let t = 0; t < ms; t += 30) {
      vi.advanceTimersByTime(30);
      r.onFrame(sure(midi), performance.now());
    }
  };
  const ons = () => heard.filter((n) => n.on).map((n) => n.midi);

  it('the learner plays E while the app plays a chord: nothing is reported until the chord (and the tail) is over', () => {
    const r = reportPlayedNotes();
    playTimedNotes([{ note: { ...C, octave: 4 }, at: 0, duration: 1 }]);
    hear(r, 64, 1000 + RELEASE_MS);
    expect(ons()).toEqual([]);
    hear(r, 64, APP_SOUND_TAIL_MS - 60);
    expect(ons()).toEqual([]);
    hear(r, 64, 300);
    expect(ons()).toEqual([64]);
    r.dispose();
  });

  it('a note already reported ends when the app starts to sound (the metronome\'s click)', () => {
    const r = reportPlayedNotes();
    hear(r, 64, 300);
    expect(heard.map((n) => [n.midi, n.on])).toEqual([[64, true]]);
    noteAppSound(0, 0.3);
    hear(r, 64, 60);
    expect(heard.map((n) => [n.midi, n.on])).toEqual([[64, true], [64, false]]);
    r.dispose();
  });

  it('while nothing sounds, it reports as before', () => {
    const r = reportPlayedNotes();
    hear(r, 67, 300);
    expect(ons()).toEqual([67]);
    r.dispose();
  });
});

describe('seam 4: a MIDI keyboard and the microphone together', () => {
  it('a key is sounded once by the app; the microphone hearing it reports nothing; the answer holds it once', () => {
    const added: number[] = [];
    useAppStore.setState({ view: 'learn', exerciseInputActive: true });
    const untarget = setExternalAnswerTarget((m) => added.push(m));
    const heard: ExternalNote[] = [];
    const off = subscribeExternalNotes((n) => {
      heard.push(n);
      applyExternalNote(n); // the one listener, as the host hands it notes
    });
    const r = reportPlayedNotes();
    voice.startNote.mockClear();
    act(() => applyExternalNote({ midi: 60, on: true, source: 'midi', velocity: 0.8 }));
    expect(voice.startNote.mock.calls.map((c) => c[0])).toEqual([60]);
    // The speaker's C reaches the microphone while the key is held for 2 s, and through its release and the tail after.
    let releasedAt: number | null = null;
    for (let t = 0; t < 2000 + RELEASE_MS + APP_SOUND_TAIL_MS; t += 30) {
      vi.advanceTimersByTime(30);
      if (releasedAt === null && t >= 2000) {
        releasedAt = t;
        act(() => applyExternalNote({ midi: 60, on: false, source: 'midi' }));
      }
      r.onFrame({ frequency: midiHz(60), clarity: 0.97 }, performance.now());
    }
    // The key really was let go, with the release and the tail still heard after it.
    expect(releasedAt).not.toBeNull();
    expect(2000 + RELEASE_MS + APP_SOUND_TAIL_MS - releasedAt!).toBeGreaterThan(RELEASE_MS);
    expect(heard.filter((n) => n.source === 'mic')).toEqual([]);
    expect(voice.startNote).toHaveBeenCalledTimes(1);
    expect(added).toEqual([60]);
    r.dispose();
    off();
    untarget();
  });
});
