/**
 * THE microphone switch (brief U), its store and its one session, with a
 * fake microphone (only getUserMedia, the Permissions API and Web Audio are
 * fake): off at every start and never saved; nothing asked of the browser
 * before the tap; in the tap the audio context first, synchronously, then
 * "is it already allowed?"; and every row of the auto-off table, each ending
 * with no live track and every audio context closed.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installFakeMic, midiHz, tone, watchPrivacy, type FakeMic } from './fakeMic';
import { subscribeExternalNotes, type ExternalNote } from '../../externalNotes';
import { stopListening } from '../microphone';
import { micOff, tapMic, useMic, type MicState } from '../micSwitch';
import { micSheetClosed, openMicCheck } from '../micPlaces';
import { IDLE_MS } from '../micSession';
import { confirmMic } from '../../../components/tuner/micAsk';
import { useAppStore } from '../../../state/store';
import { noteAppSound, _resetAppSoundForTesting } from '../../../core/services/audio';
import { clearDemoRequest, requestDemo } from '../../../state/demoRequest';

let mic: FakeMic;
let query: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', 'performance'] });
  mic = installFakeMic();
  query = navigator.permissions.query as unknown as ReturnType<typeof vi.fn>;
  _resetAppSoundForTesting();
  micOff();
  useMic.setState({ check: false });
  useAppStore.setState({ view: 'explore', language: 'en' });
  clearDemoRequest();
});
afterEach(() => {
  micOff();
  stopListening();
  mic.restore();
  vi.useRealTimers();
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
});

const state = (): MicState => useMic.getState().state;
const live = () => mic.tracks.filter((t) => t.readyState === 'live').length;
const openContexts = () => mic.contexts.filter((c) => c.state !== 'closed').length;
/** No live track and every audio context closed. */
const nothingRunning = () => ({ live: live(), contexts: openContexts() });
async function wait(ms: number) {
  await vi.advanceTimersByTimeAsync(ms);
}
/** The tap, then (asked) "Turn on the microphone"; until the browser has answered. */
async function turnOn() {
  tapMic();
  await vi.waitFor(() => expect(state()).toEqual({ kind: 'asking', step: 'explain' }));
  confirmMic();
  await vi.waitFor(() => expect(state().kind).toMatch(/^(on|problem)$/));
  await wait(0);
}
async function play(midi: number, ms = 300, gap = 200) {
  mic.setSound(tone(midiHz(midi)));
  await wait(ms);
  mic.setSound(null);
  await wait(gap);
}

describe('off until the learner taps it', () => {
  it('off at the start; the store holds nothing to save (no persist), and nothing has been asked', () => {
    expect(state()).toEqual({ kind: 'off' });
    expect((useMic as unknown as { persist?: unknown }).persist).toBeUndefined();
    expect(query).not.toHaveBeenCalled();
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(mic.contexts).toHaveLength(0);
  });

  it('the tap: the audio context is made synchronously, inside it, before anything is asked or loaded', () => {
    tapMic();
    expect(mic.contexts).toHaveLength(1);
    expect(mic.contexts[0].state).toBe('running');
    expect(query).not.toHaveBeenCalled();
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(state()).toEqual({ kind: 'asking', step: 'opening' });
  });

  it('not yet allowed: one sentence first (explain), nothing opened, the first context closed; "Turn on the microphone" makes a context in ITS tap, then the browser asks', async () => {
    tapMic();
    await vi.waitFor(() => expect(state()).toEqual({ kind: 'asking', step: 'explain' }));
    expect(query).toHaveBeenCalledWith({ name: 'microphone' });
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(openContexts()).toBe(0);
    confirmMic();
    expect(mic.contexts).toHaveLength(2);
    expect(mic.contexts[1].state).toBe('running');
    expect(state()).toEqual({ kind: 'asking', step: 'browser' });
    await vi.waitFor(() => expect(state()).toEqual({ kind: 'on', heard: null }));
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
    expect(nothingRunning()).toEqual({ live: 1, contexts: 1 });
  });

  it('already allowed: the first tap opens it, with the context it made', async () => {
    query.mockResolvedValue({ state: 'granted' });
    tapMic();
    await vi.waitFor(() => expect(state()).toEqual({ kind: 'on', heard: null }));
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
    expect(mic.contexts).toHaveLength(1);
    expect(nothingRunning()).toEqual({ live: 1, contexts: 1 });
  });

  it('a browser that cannot say whether it is allowed: the sentence first, as for "not yet"', async () => {
    query.mockRejectedValue(new TypeError('unknown permission'));
    tapMic();
    await vi.waitFor(() => expect(state()).toEqual({ kind: 'asking', step: 'explain' }));
    expect(mic.getUserMedia).not.toHaveBeenCalled();
  });

  it('"Not now" (or the switch tapped again): off, nothing opened, nothing left', async () => {
    tapMic();
    await vi.waitFor(() => expect(state().kind).toBe('asking'));
    await wait(0);
    micOff();
    expect(state()).toEqual({ kind: 'off' });
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(nothingRunning()).toEqual({ live: 0, contexts: 0 });
  });

  it('on: the switch tapped again turns it off, no track, the context closed', async () => {
    await turnOn();
    tapMic();
    expect(state()).toEqual({ kind: 'off' });
    expect(nothingRunning()).toEqual({ live: 0, contexts: 0 });
  });

  it('tapped off while the browser is still asking: the stream that arrives is stopped at once', async () => {
    const gate = mic.hold();
    tapMic();
    await vi.waitFor(() => expect(state().kind).toBe('asking'));
    await vi.waitFor(() => expect(state()).toEqual({ kind: 'asking', step: 'explain' }));
    confirmMic();
    await vi.waitFor(() => expect(mic.getUserMedia).toHaveBeenCalledTimes(1));
    tapMic();
    expect(state()).toEqual({ kind: 'off' });
    gate.release();
    await wait(0);
    await wait(0);
    expect(mic.tracks).toHaveLength(1);
    expect(nothingRunning()).toEqual({ live: 0, contexts: 0 });
    expect(state()).toEqual({ kind: 'off' });
  });

  it('tapped off while it is still asking whether it is allowed: nothing opens when the answer comes', async () => {
    query.mockResolvedValue({ state: 'granted' });
    tapMic();
    micOff();
    await wait(0);
    await wait(0);
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(nothingRunning()).toEqual({ live: 0, contexts: 0 });
    expect(state()).toEqual({ kind: 'off' });
  });

  it('on, notes held are reported (source mic) and the last one is named; nothing stored, logged, recorded, sent or played back', async () => {
    const heard: ExternalNote[] = [];
    const off = subscribeExternalNotes((n) => heard.push(n));
    const watch = watchPrivacy();
    try {
      await turnOn();
      await play(48);
      await play(55);
      expect(heard).toEqual([
        { midi: 48, on: true, source: 'mic' }, { midi: 48, on: false, source: 'mic' },
        { midi: 55, on: true, source: 'mic' }, { midi: 55, on: false, source: 'mic' },
      ]);
      expect(state()).toEqual({ kind: 'on', heard: 55 });
      micOff();
      expect(watch.findings()).toEqual([]);
    } finally {
      watch.stop();
      off();
    }
  });
});

describe('it turns itself off when nothing on screen can use a played note', () => {
  it('the view changes: off, no sentence, nothing running', async () => {
    await turnOn();
    useAppStore.setState({ view: 'learn' });
    expect(state()).toEqual({ kind: 'off' });
    expect(nothingRunning()).toEqual({ live: 0, contexts: 0 });
  });

  it('the view changes while the sentence before asking shows: off (it went with the view)', async () => {
    tapMic();
    await vi.waitFor(() => expect(state()).toEqual({ kind: 'asking', step: 'explain' }));
    useAppStore.setState({ view: 'drill' });
    expect(state()).toEqual({ kind: 'off' });
  });

  it('the page hidden: off with its sentence, nothing running', async () => {
    await turnOn();
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(state()).toEqual({ kind: 'problem', problem: 'hidden' });
    expect(nothingRunning()).toEqual({ live: 0, contexts: 0 });
  });

  it('the page left (pagehide): off with its sentence, nothing running', async () => {
    await turnOn();
    window.dispatchEvent(new Event('pagehide'));
    expect(state()).toEqual({ kind: 'problem', problem: 'hidden' });
    expect(nothingRunning()).toEqual({ live: 0, contexts: 0 });
  });

  it('a check ends or is left (its close): off, nothing running; while it is open it can use the microphone', async () => {
    useAppStore.setState({ view: 'learn' });
    const close = openMicCheck();
    expect(useMic.getState().check).toBe(true);
    await turnOn();
    expect(state().kind).toBe('on');
    close();
    expect(useMic.getState().check).toBe(false);
    expect(state()).toEqual({ kind: 'off' });
    expect(nothingRunning()).toEqual({ live: 0, contexts: 0 });
  });

  it('the tuner closes in Learn\'s reading pages or in Drill: off, nothing running', async () => {
    for (const view of ['learn', 'drill'] as const) {
      useAppStore.setState({ view });
      await turnOn();
      micSheetClosed();
      expect(state(), view).toEqual({ kind: 'off' });
      expect(nothingRunning(), view).toEqual({ live: 0, contexts: 0 });
    }
  });

  it('the tuner closes over Explore, or over a check answered on the instrument: it stays on (what is behind can use it)', async () => {
    await turnOn();
    micSheetClosed();
    expect(state().kind).toBe('on');
    micOff();
    useAppStore.setState({ view: 'learn' });
    const close = openMicCheck();
    await turnOn();
    micSheetClosed();
    expect(state().kind).toBe('on');
    close();
  });

  it('the tuner closes over Explore while the tour plays: off (the tour can use no played note)', async () => {
    await turnOn();
    requestDemo('intro', 'menu');
    micSheetClosed();
    expect(state()).toEqual({ kind: 'off' });
    expect(nothingRunning()).toEqual({ live: 0, contexts: 0 });
  });

  it.each([
    ['refused', 'NotAllowedError'],
    ['missing', 'NotFoundError'],
    ['busy', 'NotReadableError'],
    ['failed', 'SomethingElse'],
  ])('%s (%s): off with its sentence, nothing running', async (problem, error) => {
    mic.failWith(error);
    await turnOn();
    expect(state()).toEqual({ kind: 'problem', problem });
    expect(nothingRunning()).toEqual({ live: 0, contexts: 0 });
  });

  it('the microphone unplugged: off with its sentence, nothing running', async () => {
    await turnOn();
    mic.tracks[0].unplug();
    expect(state()).toEqual({ kind: 'problem', problem: 'ended' });
    expect(nothingRunning()).toEqual({ live: 0, contexts: 0 });
  });

  it('a sentence stays until the next tap; that tap starts again from the beginning', async () => {
    mic.failWith('NotFoundError');
    await turnOn();
    await wait(60_000);
    expect(state()).toEqual({ kind: 'problem', problem: 'missing' });
    mic.failWith(null);
    await turnOn();
    expect(state().kind).toBe('on');
  });
});

describe('three minutes with no note heard', () => {
  it('is exactly three minutes', () => {
    expect(IDLE_MS).toBe(180_000);
  });

  it('nothing played for three minutes: off, with its sentence; nothing running', async () => {
    await turnOn();
    await wait(IDLE_MS - 1000);
    expect(state().kind).toBe('on');
    await wait(1100);
    expect(state()).toEqual({ kind: 'problem', problem: 'idle' });
    expect(nothingRunning()).toEqual({ live: 0, contexts: 0 });
  });

  it('a note at 2:59 starts the three minutes again', async () => {
    await turnOn();
    await wait(IDLE_MS - 1000);
    await play(52, 300, 0);
    // 2:59.3: the note was heard (reported at about 2:59.1).
    expect(state()).toEqual({ kind: 'on', heard: 52 });
    await wait(IDLE_MS - 1000);
    expect(state().kind).toBe('on');
    await wait(1200);
    expect(state()).toEqual({ kind: 'problem', problem: 'idle' });
    expect(nothingRunning()).toEqual({ live: 0, contexts: 0 });
  });

  it('the app\'s own sound never counts as a note: heard the whole time while the app sounds, off at three minutes', async () => {
    const heard: ExternalNote[] = [];
    const off = subscribeExternalNotes((n) => heard.push(n));
    await turnOn();
    // The app sounds (a loop, the metronome, a reference string) for longer than three minutes, and the room hears it.
    // (Heard for the first and the last three seconds: 6,000 frames of a tone would make the test slow, not stronger.)
    noteAppSound(0, IDLE_MS / 1000 + 60);
    mic.setSound(tone(midiHz(57)));
    await wait(3_000);
    mic.setSound(null);
    await wait(IDLE_MS - 6_000);
    mic.setSound(tone(midiHz(57)));
    await wait(2_000);
    expect(state()).toEqual({ kind: 'on', heard: null });
    await wait(1_200);
    expect(heard).toEqual([]);
    expect(state()).toEqual({ kind: 'problem', problem: 'idle' });
    expect(nothingRunning()).toEqual({ live: 0, contexts: 0 });
    mic.setSound(null);
    off();
  }, 30_000);
});
