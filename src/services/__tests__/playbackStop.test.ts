/**
 * End-to-end check for audit W0-04 review B1 / ledger W8-01 (F-02), with the
 * REAL registered instrument voices and engines (pianoSampler, guitarSampler,
 * Karplus-Strong) and only Web Audio mocked.
 *
 * The reviewer's probe: once samples decode, core playScale hands all 8 notes
 * to the voice up front (source.start(when), up to ~2.8 s ahead) and core
 * stopPlayback() cancelled none of them, so an abandoned ear-training scale
 * kept ringing under the next item. Now every scheduled source must be told to
 * stop within a short fade of "now".
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { playScale, stopPlayback, setInstrumentVoice } from '../../core/services/audio';
import { registerInstrumentVoices } from '../instrumentVoices';
import * as pianoSampler from '../pianoSampler';
import * as guitarSampler from '../guitarSampler';
import * as ks from '../karplusStrong';
import { useAppStore } from '../../state/store';
import { installMockAudioContext, lastStopAt, type MockSource } from '../../test/mockAudioContext';
import type { Note, NaturalNote } from '../../core/types/music';

const N = (natural: NaturalNote): Note => ({ natural, accidental: '' });
const C_MAJOR = (['C', 'D', 'E', 'F', 'G', 'A', 'B'] as NaturalNote[]).map(N);
const NOW = 5;

let sources: MockSource[] = [];
let unsubscribe: (() => void) | null = null;

beforeEach(() => {
  // registerInstrumentVoices schedules an idle-time preload; fake timers keep
  // it from firing after the mocks are gone.
  vi.useFakeTimers();
  pianoSampler._resetForTesting();
  guitarSampler._resetForTesting();
  ks._resetForTesting();
  ({ sources } = installMockAudioContext(NOW));
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) })));
});

afterEach(() => {
  unsubscribe?.();
  unsubscribe = null;
  setInstrumentVoice(null);
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function expectAllStoppedNow(scheduled: MockSource[]) {
  expect(scheduled.length).toBe(8); // 7 scale notes + octave
  for (const s of scheduled) {
    const stopAt = lastStopAt(s);
    expect(stopAt).toBeDefined();
    expect(stopAt!).toBeLessThanOrEqual(NOW + 0.1);
  }
}

describe('stopPlayback silences a scale scheduled on the real voices', () => {
  it('piano (sampled): all 8 pre-scheduled notes are stopped', async () => {
    useAppStore.setState({ instrument: 'piano' });
    unsubscribe = registerInstrumentVoices();
    await pianoSampler.preload();
    const before = sources.length;

    playScale(C_MAJOR, 4, true, false, 0.35);
    const scheduled = sources.slice(before);
    // Known positive: the notes really were scheduled into the future.
    const lastStart = scheduled[scheduled.length - 1].start.mock.calls[0][0] as number;
    expect(lastStart).toBeGreaterThan(NOW + 2.5);

    stopPlayback();
    expectAllStoppedNow(scheduled);
  });

  it('guitar (sampled): all 8 pre-scheduled notes are stopped', async () => {
    useAppStore.setState({ instrument: 'guitar' });
    unsubscribe = registerInstrumentVoices();
    await guitarSampler.preload();
    const before = sources.length;

    playScale(C_MAJOR, 4, true, false, 0.35);
    stopPlayback();
    expectAllStoppedNow(sources.slice(before));
  });

  it('guitar (Karplus-Strong fallback, samples not loaded): all 8 plucks are stopped', () => {
    useAppStore.setState({ instrument: 'guitar' });
    unsubscribe = registerInstrumentVoices();
    const before = sources.length;

    playScale(C_MAJOR, 4, true, false, 0.35);
    stopPlayback();
    expectAllStoppedNow(sources.slice(before));
  });
});
