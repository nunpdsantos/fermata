/**
 * The eager half of the listener (brief K): notes that arrive before the
 * listener's chunk has loaded are applied, in order, once it has; and when
 * the browser holds the sound back (no click or tap on the page yet — a MIDI
 * key does not count), the learner is told once.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, cleanup, act } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.doUnmock('../../core/services/audio');
  vi.doUnmock('../synthConfig');
  vi.resetModules();
  vi.useRealTimers();
});

describe('the host', () => {
  it('queues notes until the listener has loaded, then applies them in order', async () => {
    vi.resetModules();
    const { useExternalNotes } = await import('../externalNotesHost');
    const { emitExternalNote } = await import('../externalNotes');
    const { useAppStore } = await import('../../state/store');
    useAppStore.setState({ view: 'explore', exerciseInputActive: false, activeNotes: new Set() });
    renderHook(() => useExternalNotes(false));
    emitExternalNote({ midi: 60, on: true, source: 'mic' });
    emitExternalNote({ midi: 64, on: true, source: 'mic' });
    emitExternalNote({ midi: 60, on: false, source: 'mic' });
    expect([...useAppStore.getState().activeNotes]).toEqual([]);
    await vi.waitFor(() => expect([...useAppStore.getState().activeNotes]).toEqual([64]));
    const { releaseAllExternalNotes } = await import('../externalNotesListener');
    releaseAllExternalNotes();
  });

  it('a held-back sound is said once, in the learner\'s language', async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.doMock('../../core/services/audio', async (orig) => ({
      ...(await orig<typeof import('../../core/services/audio')>()),
      startSustainedNote: vi.fn(() => 0),
      stopSustainedNote: vi.fn(),
      resumeAudio: vi.fn(() => Promise.resolve()),
      getAudioState: vi.fn(() => 'suspended'),
    }));
    const { applyExternalNote, releaseAllExternalNotes } = await import('../externalNotesListener');
    const { useToastStore } = await import('../../state/toastStore');
    useToastStore.setState({ toasts: [] });
    applyExternalNote({ midi: 60, on: true, source: 'midi', velocity: 0.5 });
    applyExternalNote({ midi: 62, on: true, source: 'midi', velocity: 0.5 });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    applyExternalNote({ midi: 64, on: true, source: 'midi', velocity: 0.5 });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual(['Click or tap the page once so Fermatina can sound what you play.']);
    releaseAllExternalNotes();
  });

  async function withAudio(state: AudioContextState, over: Record<string, unknown> = {}) {
    vi.resetModules();
    vi.useFakeTimers();
    const startSustainedNote = vi.fn(() => 0);
    vi.doMock('../../core/services/audio', async (orig) => ({
      ...(await orig<typeof import('../../core/services/audio')>()),
      startSustainedNote,
      stopSustainedNote: vi.fn(),
      resumeAudio: vi.fn(() => Promise.resolve()),
      getAudioState: vi.fn(() => state),
      ...over,
    }));
    const listener = await import('../externalNotesListener');
    const { useToastStore } = await import('../../state/toastStore');
    useToastStore.setState({ toasts: [] });
    const toasts = () => useToastStore.getState().toasts.map((t) => t.message);
    return { ...listener, toasts, startSustainedNote };
  }

  it('no notice while the sound is running: the claim would be false', async () => {
    const { applyExternalNote, releaseAllExternalNotes, toasts } = await withAudio('running');
    applyExternalNote({ midi: 60, on: true, source: 'midi', velocity: 0.5 });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    expect(toasts()).toEqual([]);
    releaseAllExternalNotes();
  });

  it('the notice waits a moment (the audio may still be waking), then shows', async () => {
    const { applyExternalNote, releaseAllExternalNotes, toasts } = await withAudio('suspended');
    applyExternalNote({ midi: 60, on: true, source: 'midi', velocity: 0.5 });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(399);
    });
    expect(toasts()).toEqual([]);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2);
    });
    expect(toasts()).toHaveLength(1);
    releaseAllExternalNotes();
  });

  it('a loud preset and a hard key never ask the voice for more than full volume', async () => {
    vi.doMock('../synthConfig', async (orig) => ({
      ...(await orig<typeof import('../synthConfig')>()),
      getSynthConfig: () => ({ volume: 0.95 }),
    }));
    const { applyExternalNote, releaseAllExternalNotes, startSustainedNote } = await withAudio('running');
    applyExternalNote({ midi: 60, on: true, source: 'midi', velocity: 1 });
    applyExternalNote({ midi: 62, on: true, source: 'midi', velocity: 0 });
    const volumes = (startSustainedNote.mock.calls as unknown as [unknown, number, { volume: number }][]).map((c) => c[2].volume);
    expect(volumes[0]).toBe(1);
    expect(volumes[1]).toBeCloseTo(0.95 * 0.3, 10);
    releaseAllExternalNotes();
    vi.doUnmock('../synthConfig');
  });
});
