import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { registerInstrumentVoices } from '../instrumentVoices';
import { setInstrumentVoice } from '../../core/services/audio';
import * as pianoSampler from '../pianoSampler';
import * as guitarSampler from '../guitarSampler';
import * as ks from '../karplusStrong';
import { useAppStore } from '../../state/store';

vi.mock('../../core/services/audio', () => ({
  setInstrumentVoice: vi.fn(),
}));

vi.mock('../pianoSampler', () => ({
  playNote: vi.fn(() => true),
  startNote: vi.fn(() => true),
  stopNote: vi.fn(),
  cancelScheduled: vi.fn(),
  setVolume: vi.fn(),
  resumeContext: vi.fn().mockResolvedValue(undefined),
  preload: vi.fn().mockResolvedValue(undefined),
}));

// Guitar sampler defaults to "ready" (returns true). Individual tests override
// the return value to false to exercise the Karplus-Strong fallback path.
vi.mock('../guitarSampler', () => ({
  playNote: vi.fn(() => true),
  startNote: vi.fn(() => true),
  stopNote: vi.fn(),
  cancelScheduled: vi.fn(),
  setVolume: vi.fn(),
  resumeContext: vi.fn().mockResolvedValue(undefined),
  preload: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../karplusStrong', () => ({
  playNote: vi.fn(),
  startNote: vi.fn(),
  stopNote: vi.fn(),
  cancelScheduled: vi.fn(),
  setVolume: vi.fn(),
  resumeContext: vi.fn().mockResolvedValue(undefined),
}));

const mockedSetVoice = vi.mocked(setInstrumentVoice);

let unsubscribe: (() => void) | null = null;

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  // Restore the "ready" defaults after clearAllMocks wiped implementations.
  vi.mocked(pianoSampler.playNote).mockReturnValue(true);
  vi.mocked(pianoSampler.startNote).mockReturnValue(true);
  vi.mocked(guitarSampler.playNote).mockReturnValue(true);
  vi.mocked(guitarSampler.startNote).mockReturnValue(true);
  useAppStore.setState({ instrument: 'piano', volume: 0.7 });
});

afterEach(() => {
  unsubscribe?.();
  unsubscribe = null;
  vi.useRealTimers();
});

describe('registerInstrumentVoices', () => {
  it('registers the piano voice at boot when the instrument is piano', () => {
    unsubscribe = registerInstrumentVoices();

    expect(mockedSetVoice).toHaveBeenCalledTimes(1);
    const voice = mockedSetVoice.mock.calls[0][0]!;
    expect(voice.playNote(60, 0, 0.5, 0.5)).toBe(true);
    expect(pianoSampler.playNote).toHaveBeenCalledWith(60, 0, 0.5, 0.5);
    expect(ks.playNote).not.toHaveBeenCalled();
  });

  it('registers the guitar voice at boot when the persisted instrument is guitar', () => {
    useAppStore.setState({ instrument: 'guitar' });
    unsubscribe = registerInstrumentVoices();

    const voice = mockedSetVoice.mock.calls[0][0]!;
    // Sampler is ready → it handles the note, KS stays silent, no synth leak.
    expect(voice.playNote(60, 0, 0.5, 0.5)).toBe(true);
    expect(guitarSampler.playNote).toHaveBeenCalledWith(60, 0, 0.5, 0.5);
    expect(ks.playNote).not.toHaveBeenCalled();
    expect(pianoSampler.playNote).not.toHaveBeenCalled();

    // Sustained path: sampler owns the note — KS must NOT double-pluck.
    expect(voice.startNote(64, 0.5)).toBe(true);
    expect(guitarSampler.startNote).toHaveBeenCalledWith(64, 0.5);
    expect(ks.startNote).not.toHaveBeenCalled();
  });

  it('falls back to Karplus-Strong when the guitar sampler is not yet ready (still reports handled)', () => {
    useAppStore.setState({ instrument: 'guitar' });
    vi.mocked(guitarSampler.playNote).mockReturnValue(false);
    vi.mocked(guitarSampler.startNote).mockReturnValue(false);
    unsubscribe = registerInstrumentVoices();

    const voice = mockedSetVoice.mock.calls[0][0]!;
    // One-shot: sampler declines → KS plucks, but the voice still reports
    // handled=true so core's FM synth never leaks into guitar mode.
    expect(voice.playNote(60, 0, 0.5, 0.5)).toBe(true);
    expect(ks.playNote).toHaveBeenCalledWith(60, 0, 0.5, 0.5);

    // Sustained: same fallback contract.
    expect(voice.startNote(62, 0.5)).toBe(true);
    expect(ks.startNote).toHaveBeenCalledWith(62);
  });

  it('swaps the voice on instrument change and pushes the session volume to both engines', () => {
    unsubscribe = registerInstrumentVoices();

    useAppStore.setState({ instrument: 'guitar', volume: 0.4 });
    expect(mockedSetVoice).toHaveBeenCalledTimes(2);
    // Guitar setVolume fans out to the sampler AND the KS fallback.
    expect(guitarSampler.setVolume).toHaveBeenCalledWith(0.4);
    expect(ks.setVolume).toHaveBeenCalledWith(0.4);
    const guitarVoice = mockedSetVoice.mock.calls[1][0]!;
    guitarVoice.playNote(60, 0, 0.5, 0.5);
    expect(guitarSampler.playNote).toHaveBeenCalled();

    useAppStore.setState({ instrument: 'piano' });
    expect(mockedSetVoice).toHaveBeenCalledTimes(3);
    expect(pianoSampler.setVolume).toHaveBeenCalledWith(0.4);
  });

  it('ignores store changes that do not flip the instrument', () => {
    unsubscribe = registerInstrumentVoices();

    useAppStore.setState({ volume: 0.2 });
    expect(mockedSetVoice).toHaveBeenCalledTimes(1);
  });

  // Audit W8-03 / D-22: all 30 piano samples (~2 MB) used to download on the
  // first idle slot of EVERY visit, before any tap. Samples now load on first
  // use: the first tap / key press, or the first note the voice is asked for.
  it('downloads no samples before the learner interacts, however long the page sits idle', () => {
    useAppStore.setState({ instrument: 'guitar' });
    unsubscribe = registerInstrumentVoices();
    vi.advanceTimersByTime(60_000);
    expect(guitarSampler.preload).not.toHaveBeenCalled();
    expect(pianoSampler.preload).not.toHaveBeenCalled();
  });

  it('the first tap preloads only the selected instrument\'s bank, once', () => {
    useAppStore.setState({ instrument: 'guitar' });
    unsubscribe = registerInstrumentVoices();
    window.dispatchEvent(new Event('pointerdown'));
    expect(guitarSampler.preload).toHaveBeenCalledTimes(1);
    expect(pianoSampler.preload).not.toHaveBeenCalled();
    window.dispatchEvent(new Event('pointerdown'));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(guitarSampler.preload).toHaveBeenCalledTimes(1);
  });

  it('a first key press also counts as first use', () => {
    unsubscribe = registerInstrumentVoices();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(pianoSampler.preload).toHaveBeenCalledTimes(1);
  });

  it('the first note asked of the voice starts the download too (synth covers that note)', () => {
    vi.mocked(pianoSampler.playNote).mockReturnValue(false);
    unsubscribe = registerInstrumentVoices();
    const voice = mockedSetVoice.mock.calls[0][0]!;
    voice.playNote(60, 0, 0.5, 0.5);
    expect(pianoSampler.preload).toHaveBeenCalledTimes(1);
  });

  it('preloads the other bank when the instrument is switched', () => {
    useAppStore.setState({ instrument: 'piano' });
    unsubscribe = registerInstrumentVoices();

    window.dispatchEvent(new Event('pointerdown'));
    expect(pianoSampler.preload).toHaveBeenCalled();
    expect(guitarSampler.preload).not.toHaveBeenCalled();

    useAppStore.setState({ instrument: 'guitar' });
    expect(guitarSampler.preload).toHaveBeenCalled();
  });

  it('stop/resume on the guitar voice fan out to both the sampler and KS', async () => {
    useAppStore.setState({ instrument: 'guitar' });
    unsubscribe = registerInstrumentVoices();
    const voice = mockedSetVoice.mock.calls[0][0]!;

    voice.stopNote(60);
    expect(guitarSampler.stopNote).toHaveBeenCalledWith(60);
    expect(ks.stopNote).toHaveBeenCalledWith(60);

    voice.setVolume(0.3);
    expect(guitarSampler.setVolume).toHaveBeenCalledWith(0.3);
    expect(ks.setVolume).toHaveBeenCalledWith(0.3);

    await voice.resume();
    expect(guitarSampler.resumeContext).toHaveBeenCalled();
    expect(ks.resumeContext).toHaveBeenCalled();
  });

  // Audit W0-04 review B1: core stopPlayback() reaches the engines through
  // the voice. The guitar voice may have scheduled on either engine.
  it('cancelScheduled on the piano voice reaches the piano sampler', () => {
    unsubscribe = registerInstrumentVoices();
    const voice = mockedSetVoice.mock.calls[0][0]!;
    voice.cancelScheduled();
    expect(pianoSampler.cancelScheduled).toHaveBeenCalledTimes(1);
    expect(ks.cancelScheduled).not.toHaveBeenCalled();
  });

  it('cancelScheduled on the guitar voice fans out to the sampler AND Karplus-Strong', () => {
    useAppStore.setState({ instrument: 'guitar' });
    unsubscribe = registerInstrumentVoices();
    const voice = mockedSetVoice.mock.calls[0][0]!;
    voice.cancelScheduled();
    expect(guitarSampler.cancelScheduled).toHaveBeenCalledTimes(1);
    expect(ks.cancelScheduled).toHaveBeenCalledTimes(1);
  });
});
