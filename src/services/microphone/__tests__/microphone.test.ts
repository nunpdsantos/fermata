/**
 * The microphone session (brief T): it opens only when asked, with the
 * speech processing off; and every way it can end leaves no track running
 * and the audio context closed — its owner's stop, the page hidden, the
 * page left, a view change, the device unplugged, a stop while the browser
 * is still asking, a second session replacing the first.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installFakeMic, midiHz, tone, type FakeMic } from './fakeMic';
import { isListening, MIC_CONSTRAINTS, MicError, startListening, stopListening, subscribeListening } from '../microphone';
import { microphoneSupported } from '../support';
import { useAppStore } from '../../../state/store';

let mic: FakeMic;
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', 'performance'] });
  mic = installFakeMic();
  useAppStore.setState({ view: 'explore' });
});
afterEach(() => {
  stopListening();
  mic.restore();
  vi.useRealTimers();
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
});

const live = () => mic.tracks.filter((t) => t.readyState === 'live').length;

describe('microphone support', () => {
  it('needs a secure context, getUserMedia and Web Audio', () => {
    expect(microphoneSupported()).toBe(true);
    Object.defineProperty(window, 'isSecureContext', { configurable: true, value: false });
    expect(microphoneSupported()).toBe(false);
  });

  it('a Permissions-Policy that forbids the microphone: not offered', () => {
    (document as unknown as { featurePolicy: unknown }).featurePolicy = { allowsFeature: (f: string) => f !== 'microphone' };
    try {
      expect(microphoneSupported()).toBe(false);
    } finally {
      delete (document as unknown as { featurePolicy?: unknown }).featurePolicy;
    }
  });
});

describe('startListening', () => {
  it('asks for audio only, with echo cancellation, noise suppression and automatic gain off', async () => {
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    await startListening({ onFrame: () => undefined });
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
    expect(mic.getUserMedia).toHaveBeenCalledWith(MIC_CONSTRAINTS);
    expect(MIC_CONSTRAINTS).toEqual({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false });
    expect(isListening()).toBe(true);
  });

  it('measures each frame and reports the pitch', async () => {
    const frames: (number | null)[] = [];
    mic.setSound(tone(midiHz(40, -12)));
    await startListening({ onFrame: (e) => frames.push(e ? e.frequency : null) });
    await vi.advanceTimersByTimeAsync(200);
    expect(frames.length).toBeGreaterThanOrEqual(5);
    const heard = frames.filter((f): f is number => f !== null);
    expect(heard.length).toBe(frames.length);
    for (const f of heard) expect(1200 * Math.log2(f / midiHz(40))).toBeCloseTo(-12, 0);
  });

  it('its own stop: every track stopped, the context closed, no more frames', async () => {
    const onFrame = vi.fn();
    const onStop = vi.fn();
    const s = await startListening({ onFrame, onStop });
    expect(live()).toBe(1);
    s.stop();
    expect(live()).toBe(0);
    expect(mic.contexts.every((c) => c.state === 'closed')).toBe(true);
    expect(isListening()).toBe(false);
    onFrame.mockClear();
    await vi.advanceTimersByTimeAsync(200);
    expect(onFrame).not.toHaveBeenCalled();
    expect(onStop).not.toHaveBeenCalled();
  });

  it('the page hidden: stopped, and the owner is told why', async () => {
    const onStop = vi.fn();
    await startListening({ onFrame: () => undefined, onStop });
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(live()).toBe(0);
    expect(onStop).toHaveBeenCalledWith('hidden');
    expect(mic.contexts[0].state).toBe('closed');
  });

  it('the page left (pagehide): stopped', async () => {
    await startListening({ onFrame: () => undefined });
    window.dispatchEvent(new Event('pagehide'));
    expect(live()).toBe(0);
  });

  it('a view change: stopped', async () => {
    const onStop = vi.fn();
    await startListening({ onFrame: () => undefined, onStop });
    useAppStore.setState({ volume: 0.5 });
    expect(live()).toBe(1);
    useAppStore.setState({ view: 'learn' });
    expect(live()).toBe(0);
    expect(onStop).toHaveBeenCalledWith('view');
  });

  it('the device unplugged: stopped', async () => {
    const onStop = vi.fn();
    await startListening({ onFrame: () => undefined, onStop });
    mic.tracks[0].unplug();
    expect(onStop).toHaveBeenCalledWith('ended');
    expect(isListening()).toBe(false);
  });

  it('stopped while the browser is still asking: the stream that arrives is stopped at once', async () => {
    const gate = mic.hold();
    const pending = startListening({ onFrame: () => undefined });
    await Promise.resolve();
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    gate.release();
    await expect(pending).rejects.toMatchObject({ problem: 'stopped' });
    expect(mic.tracks.length).toBe(1);
    expect(live()).toBe(0);
    expect(mic.contexts[0].state).toBe('closed');
  });

  it('a second session replaces the first: only one microphone open', async () => {
    const first = vi.fn();
    await startListening({ onFrame: () => undefined, onStop: first });
    await startListening({ onFrame: () => undefined });
    expect(first).toHaveBeenCalledWith('replaced');
    expect(live()).toBe(1);
  });

  it.each([
    ['NotAllowedError', 'refused'],
    ['SecurityError', 'refused'],
    ['NotFoundError', 'missing'],
    ['OverconstrainedError', 'missing'],
    ['NotReadableError', 'busy'],
    ['TypeError', 'unsupported'],
    ['NotSupportedError', 'unsupported'],
    ['WeirdError', 'failed'],
  ])('%s → %s, nothing left open', async (name, problem) => {
    mic.failWith(name);
    const error = await startListening({ onFrame: () => undefined }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(MicError);
    expect((error as MicError).problem).toBe(problem);
    expect(isListening()).toBe(false);
    expect(mic.contexts[0].state).toBe('closed');
  });

  it('no microphone support: refused before anything is asked', async () => {
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: undefined });
    await expect(startListening({ onFrame: () => undefined })).rejects.toMatchObject({ problem: 'unsupported' });
    expect(mic.getUserMedia).not.toHaveBeenCalled();
  });

  it('the listening mark hears on and off', async () => {
    const seen: boolean[] = [];
    const off = subscribeListening((on) => seen.push(on));
    const s = await startListening({ onFrame: () => undefined });
    s.stop();
    off();
    expect(seen).toEqual([true, false]);
  });
});
