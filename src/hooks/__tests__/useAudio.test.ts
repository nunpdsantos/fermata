import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------
const mockResumeAudio = vi.fn().mockResolvedValue(undefined);
const mockStartSustainedNote = vi.fn();
const mockStopSustainedNote = vi.fn();
const mockSetMasterVolume = vi.fn();

vi.mock('../../core/services/audio.ts', () => ({
  resumeAudio: (...args: unknown[]) => mockResumeAudio(...args),
  startSustainedNote: (...args: unknown[]) => mockStartSustainedNote(...args),
  stopSustainedNote: (...args: unknown[]) => mockStopSustainedNote(...args),
  setMasterVolume: (...args: unknown[]) => mockSetMasterVolume(...args),
  SYNTH_PRESETS: {
    piano: { volume: 0.5 },
    classic: { volume: 0.5 },
    organ: { volume: 0.5 },
    strings: { volume: 0.5 },
    pluck: {},
  },
}));

// The hook must never touch an engine directly — the InstrumentVoice seam
// (instrumentVoices.ts) owns engine choice. This mock exists purely to pin
// that regression: a direct KS call here is what bypassed the WS10 sampler.
const mockKSStartNote = vi.fn();
const mockKSStopNote = vi.fn();

vi.mock('../../services/karplusStrong.ts', () => ({
  resumeContext: vi.fn().mockResolvedValue(undefined),
  startNote: (...args: unknown[]) => mockKSStartNote(...args),
  stopNote: (...args: unknown[]) => mockKSStopNote(...args),
  setVolume: vi.fn(),
}));

import { useAudio } from '../useAudio';
import { useAppStore } from '../../state/store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const noteC = { natural: 'C', accidental: '' } as const;

beforeEach(() => {
  vi.clearAllMocks();
  mockResumeAudio.mockResolvedValue(undefined);
  useAppStore.setState({
    synthPreset: 'piano',
    volume: 0.7,
    activeNotes: new Set<number>(),
  });
});

afterEach(() => {
  cleanup();
});

// =========================================================================
// Basic API
// =========================================================================
describe('useAudio — API shape', () => {
  it('returns noteOn and noteOff functions', () => {
    const { result } = renderHook(() => useAudio());
    expect(typeof result.current.noteOn).toBe('function');
    expect(typeof result.current.noteOff).toBe('function');
  });
});

// =========================================================================
// noteOn
// =========================================================================
describe('useAudio — noteOn', () => {
  it('resumes core audio (and thus the registered voice) on every call', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.noteOn(noteC, 4);
      await result.current.noteOn(noteC, 5);
    });

    // Per-call resume keeps engines awake across instrument flips; it is a
    // no-op when the context is already running.
    expect(mockResumeAudio).toHaveBeenCalledTimes(2);
  });

  it('routes every note through core startSustainedNote (seam decides the engine)', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.noteOn(noteC, 4);
    });

    expect(mockStartSustainedNote).toHaveBeenCalledWith(
      noteC,
      4,
      expect.objectContaining({ volume: expect.any(Number) }),
    );
  });

  it('NEVER calls Karplus-Strong directly — the regression that hid the guitar sampler', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.noteOn(noteC, 4);
    });
    act(() => {
      result.current.noteOff(60);
    });

    expect(mockKSStartNote).not.toHaveBeenCalled();
    expect(mockKSStopNote).not.toHaveBeenCalled();
  });

  it('routes the vestigial pluck preset through core like everything else', async () => {
    useAppStore.setState({ synthPreset: 'pluck' });
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.noteOn(noteC, 4);
    });

    expect(mockStartSustainedNote).toHaveBeenCalled();
    expect(mockKSStartNote).not.toHaveBeenCalled();
  });

  it('returns the MIDI number', async () => {
    const { result } = renderHook(() => useAudio());

    let midi: number | undefined;
    await act(async () => {
      midi = await result.current.noteOn(noteC, 4);
    });

    expect(midi).toBe(60); // C4
  });

  it('adds MIDI number to activeNotes in store', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.noteOn(noteC, 4);
    });

    expect(useAppStore.getState().activeNotes.has(60)).toBe(true);
  });

  it('pushes the session volume through core before sounding', async () => {
    useAppStore.setState({ volume: 0.42 });
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.noteOn(noteC, 4);
    });

    expect(mockSetMasterVolume).toHaveBeenCalledWith(0.42);
  });

  it('still sounds the note when resume fails (warns, does not throw)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockResumeAudio.mockRejectedValueOnce(new Error('blocked'));
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.noteOn(noteC, 4);
    });

    expect(mockStartSustainedNote).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

// =========================================================================
// noteOff
// =========================================================================
describe('useAudio — noteOff', () => {
  it('stops via core stopSustainedNote', () => {
    const { result } = renderHook(() => useAudio());

    act(() => {
      result.current.noteOff(60);
    });

    expect(mockStopSustainedNote).toHaveBeenCalledWith(60);
  });

  it('removes MIDI number from activeNotes', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.noteOn(noteC, 4);
    });
    expect(useAppStore.getState().activeNotes.has(60)).toBe(true);

    act(() => {
      result.current.noteOff(60);
    });
    expect(useAppStore.getState().activeNotes.has(60)).toBe(false);
  });
});
