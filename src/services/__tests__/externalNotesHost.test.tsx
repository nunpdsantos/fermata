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
    expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual(['Click or tap the page once so Fermata can sound what you play.']);
    releaseAllExternalNotes();
  });
});
