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

const mockKSResumeContext = vi.fn().mockResolvedValue(undefined);
const mockKSStartNote = vi.fn();
const mockKSStopNote = vi.fn();
const mockKSSetVolume = vi.fn();

vi.mock('../../services/karplusStrong.ts', () => ({
  resumeContext: (...args: unknown[]) => mockKSResumeContext(...args),
  startNote: (...args: unknown[]) => mockKSStartNote(...args),
  stopNote: (...args: unknown[]) => mockKSStopNote(...args),
  setVolume: (...args: unknown[]) => mockKSSetVolume(...args),
}));

import { useAudio } from '../useAudio';
import { useAppStore } from '../../state/store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const noteC = { natural: 'C', accidental: '' } as const;

beforeEach(() => {
  vi.clearAllMocks();
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
  it('resumes both AudioContexts on first call', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.noteOn(noteC, 4);
    });

    expect(mockResumeAudio).toHaveBeenCalledOnce();
    expect(mockKSResumeContext).toHaveBeenCalledOnce();
  });

  it('resumes only once across multiple calls', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.noteOn(noteC, 4);
      await result.current.noteOn(noteC, 5);
    });

    expect(mockResumeAudio).toHaveBeenCalledOnce();
  });

  it('uses FM synth (startSustainedNote) for piano preset', async () => {
    const { result } = renderHook(() => useAudio('piano'));

    await act(async () => {
      await result.current.noteOn(noteC, 4);
    });

    expect(mockStartSustainedNote).toHaveBeenCalledWith(
      noteC,
      4,
      expect.objectContaining({ volume: expect.any(Number) }),
    );
    expect(mockKSStartNote).not.toHaveBeenCalled();
  });

  it('uses KS engine (startNote) for guitar instrument', async () => {
    const { result } = renderHook(() => useAudio('guitar'));

    await act(async () => {
      await result.current.noteOn(noteC, 4);
    });

    expect(mockKSStartNote).toHaveBeenCalledWith(60); // C4 = MIDI 60
    expect(mockStartSustainedNote).not.toHaveBeenCalled();
  });

  it('uses KS engine for pluck preset regardless of instrument', async () => {
    useAppStore.setState({ synthPreset: 'pluck' });
    const { result } = renderHook(() => useAudio('piano'));

    await act(async () => {
      await result.current.noteOn(noteC, 4);
    });

    expect(mockKSStartNote).toHaveBeenCalledWith(60);
    expect(mockStartSustainedNote).not.toHaveBeenCalled();
  });

  it('returns the MIDI number', async () => {
    const { result } = renderHook(() => useAudio());

    let midi: number | undefined;
    await act(async () => {
      midi = await result.current.noteOn(noteC, 4);
    });

    expect(midi).toBe(60);
  });

  it('adds MIDI number to activeNotes in store', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.noteOn(noteC, 4);
    });

    expect(useAppStore.getState().activeNotes.has(60)).toBe(true);
  });

  it('sets master volume on both engines', async () => {
    useAppStore.setState({ volume: 0.42 });
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.noteOn(noteC, 4);
    });

    expect(mockSetMasterVolume).toHaveBeenCalledWith(0.42);
    expect(mockKSSetVolume).toHaveBeenCalledWith(0.42);
  });
});

// =========================================================================
// noteOff
// =========================================================================
describe('useAudio — noteOff', () => {
  it('stops FM note via stopSustainedNote', () => {
    const { result } = renderHook(() => useAudio('piano'));

    act(() => {
      result.current.noteOff(60);
    });

    expect(mockStopSustainedNote).toHaveBeenCalledWith(60);
  });

  it('stops KS note via ksEngine.stopNote for guitar', () => {
    const { result } = renderHook(() => useAudio('guitar'));

    act(() => {
      result.current.noteOff(60);
    });

    expect(mockKSStopNote).toHaveBeenCalledWith(60);
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
