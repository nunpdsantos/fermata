/**
 * guitarSampler — sample-based classical-guitar voice (FreePats CC0 subset).
 *
 * 39 individually-recorded notes span E2–C6. The set is IRREGULAR: most
 * semitones are sampled, with six upstream gaps (F#2, G#2, A#2, C#3, D#3, G#4) that
 * resolve to a ±1-semitone neighbour and pitch-shift via playbackRate. Until a
 * note's sample is decoded, callers fall back to Karplus-Strong (startNote /
 * playNote return false). Mirrors the pianoSampler suite.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  resolveSample,
  preload,
  isReady,
  startNote,
  stopNote,
  playNote,
  stopAll,
  setVolume,
  getGuitarBank,
  setGuitarBank,
  _resetForTesting,
} from '../guitarSampler';

const BANK_KEY = 'fermata-guitar-bank';

// ─── AudioContext mock ──────────────────────────────────────────────────────

function makeGainMock() {
  return {
    gain: {
      value: 1,
      setValueAtTime: vi.fn(),
      setTargetAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      cancelScheduledValues: vi.fn(),
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
}

function makeSourceMock() {
  return {
    buffer: null as unknown,
    playbackRate: { value: 1 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null as (() => void) | null,
  };
}

const sources: ReturnType<typeof makeSourceMock>[] = [];
const gains: ReturnType<typeof makeGainMock>[] = [];

class MockAudioContext {
  state = 'running';
  currentTime = 10;
  destination = {};
  resume = vi.fn(async () => {});
  createGain() {
    const g = makeGainMock();
    gains.push(g);
    return g;
  }
  createBufferSource() {
    const s = makeSourceMock();
    sources.push(s);
    return s;
  }
  decodeAudioData = vi.fn(async (_buf: ArrayBuffer) => ({ duration: 4 }) as AudioBuffer);
}

beforeEach(() => {
  sources.length = 0;
  gains.length = 0;
  // WS11: clear the bank key BEFORE reset so each test starts on bank A unless
  // it stages its own value (the reset re-reads localStorage at "init").
  try {
    localStorage.removeItem(BANK_KEY);
  } catch {
    /* no localStorage in this environment */
  }
  _resetForTesting();
  vi.stubGlobal('AudioContext', MockAudioContext as unknown as typeof AudioContext);
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => ({
      ok: true,
      url,
      arrayBuffer: async () => new ArrayBuffer(8),
    })),
  );
});

// ─── resolveSample ──────────────────────────────────────────────────────────

describe('resolveSample', () => {
  it('maps a sampled note to itself at rate 1', () => {
    expect(resolveSample(40)).toEqual({ file: 'E2', rate: 1 }); // low E, ladder start
    expect(resolveSample(60)).toEqual({ file: 'C4', rate: 1 }); // middle C
    expect(resolveSample(84)).toEqual({ file: 'C6', rate: 1 }); // ladder end
  });

  it('resolves each of the four gap notes to a ±1-semitone neighbour', () => {
    // Gaps tie between the two flanking samples; the strict-less-than scan keeps
    // the lower (earlier) neighbour, so every gap shifts UP one semitone.
    const aSharp2 = resolveSample(46); // A#2 → A2 (45) +1st  [B2 (47) is the other tie]
    expect(aSharp2.file).toBe('A2');
    expect(aSharp2.rate).toBeCloseTo(2 ** (1 / 12), 6);

    const cSharp3 = resolveSample(49); // C#3 → C3 (48) +1st
    expect(cSharp3.file).toBe('C3');
    expect(cSharp3.rate).toBeCloseTo(2 ** (1 / 12), 6);

    const dSharp3 = resolveSample(51); // D#3 → D3 (50) +1st
    expect(dSharp3.file).toBe('D3');
    expect(dSharp3.rate).toBeCloseTo(2 ** (1 / 12), 6);

    const gSharp4 = resolveSample(68); // G#4 → G4 (67) +1st  [A4 (69) is the other tie]
    expect(gSharp4.file).toBe('G4');
    expect(gSharp4.rate).toBeCloseTo(2 ** (1 / 12), 6);
  });

  it('clamps notes outside the ladder to the end samples', () => {
    expect(resolveSample(39).file).toBe('E2'); // below low E
    expect(resolveSample(39).rate).toBeCloseTo(2 ** (-1 / 12), 6);
    expect(resolveSample(86).file).toBe('C6'); // above high C
    expect(resolveSample(86).rate).toBeCloseTo(2 ** (2 / 12), 6);
  });
});

// ─── loading ────────────────────────────────────────────────────────────────

describe('preload', () => {
  it('fetches and decodes all 39 ladder samples once', async () => {
    await preload();
    expect(vi.mocked(fetch).mock.calls.length).toBe(39);
    await preload(); // second call is a no-op
    expect(vi.mocked(fetch).mock.calls.length).toBe(39);
    expect(isReady(60)).toBe(true);
  });

  it('is offline-safe: a failed fetch leaves the note unready without throwing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline');
      }),
    );
    await expect(preload()).resolves.toBeUndefined();
    expect(isReady(60)).toBe(false);
  });
});

// ─── playback ───────────────────────────────────────────────────────────────

describe('startNote / stopNote', () => {
  it('returns false before the sample is loaded (caller falls back to KS)', () => {
    expect(startNote(40)).toBe(false);
  });

  it('plays a gap note via its neighbour at the pitch-shifted rate once loaded', async () => {
    await preload();
    expect(startNote(46)).toBe(true); // A#2 → A2 +1 semitone
    const src = sources[sources.length - 1];
    expect(src.playbackRate.value).toBeCloseTo(2 ** (1 / 12), 6);
    expect(src.start).toHaveBeenCalled();
  });

  it('stopNote releases the voice with a ramp and stops the source', async () => {
    await preload();
    startNote(60);
    const src = sources[sources.length - 1];
    const voiceGain = gains[gains.length - 1];
    stopNote(60);
    expect(voiceGain.gain.setTargetAtTime).toHaveBeenCalled();
    expect(src.stop).toHaveBeenCalled();
  });

  it('stopAll releases every active voice', async () => {
    await preload();
    startNote(60);
    startNote(64);
    stopAll();
    expect(sources.filter((s) => s.stop.mock.calls.length > 0).length).toBe(2);
  });
});

describe('playNote (scheduled one-shots)', () => {
  it('starts at the requested time and releases after the duration', async () => {
    await preload();
    expect(playNote(64, 0.5, 1.2)).toBe(true);
    const src = sources[sources.length - 1];
    const voiceGain = gains[gains.length - 1];
    expect(src.start).toHaveBeenCalledWith(10.5); // currentTime 10 + when 0.5
    expect(voiceGain.gain.setTargetAtTime).toHaveBeenCalled();
    const calls = voiceGain.gain.setTargetAtTime.mock.calls;
    const releaseCall = calls[calls.length - 1];
    expect(releaseCall[1]).toBeCloseTo(11.7, 5); // 10 + 0.5 + 1.2
  });

  it('returns false when the sample is not loaded', () => {
    expect(playNote(64, 0, 1)).toBe(false);
  });
});

describe('setVolume', () => {
  it('drives the master gain', async () => {
    await preload();
    setVolume(0.3);
    expect(gains[0].gain.value).toBe(0.3);
  });
});

// ─── WS11: A/B bank switch (temporary) ──────────────────────────────────────

describe('guitar bank A/B switch (WS11)', () => {
  describe('init reads localStorage', () => {
    it("boots on bank B when the key is 'b'", () => {
      localStorage.setItem(BANK_KEY, 'b');
      _resetForTesting(); // re-runs the module-init bank read
      expect(getGuitarBank()).toBe('b');
    });

    it('boots on bank A for any other value (or unset)', () => {
      localStorage.setItem(BANK_KEY, 'anything-else');
      _resetForTesting();
      expect(getGuitarBank()).toBe('a');

      localStorage.removeItem(BANK_KEY);
      _resetForTesting();
      expect(getGuitarBank()).toBe('a');
    });
  });

  describe('LADDER_B resolution (active when bank B selected)', () => {
    beforeEach(() => {
      localStorage.setItem(BANK_KEY, 'b');
      _resetForTesting();
    });

    it('is gap-free chromatic E2..F#5 — every in-range MIDI is an exact hit', () => {
      // E2 (40) through F#5 (78): rate exactly 1, file == the note itself.
      const NAMES = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
      for (let midi = 40; midi <= 78; midi++) {
        const expectedFile = `${NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
        const { file, rate } = resolveSample(midi);
        expect(file).toBe(expectedFile);
        expect(rate).toBeCloseTo(1, 6); // exact hit, no pitch shift
      }
    });

    it('E2 (low open string) is an exact hit at rate 1', () => {
      expect(resolveSample(40)).toEqual({ file: 'E2', rate: 1 });
    });

    it('MIDI 84 (C6) resolves to Fs5 pitch-shifted up 6 semitones', () => {
      // Bank B tops out at Fs5=78; C6=84 is 6 semitones above the top sample.
      const { file, rate } = resolveSample(84);
      expect(file).toBe('Fs5');
      expect(rate).toBeCloseTo(2 ** (6 / 12), 6);
    });

    it('does NOT have bank A\'s gap notes pitch-shifted — Fs2/Cs3 are exact', () => {
      // F#2=42 and C#3=49 are GAPS in bank A but real samples in bank B.
      expect(resolveSample(42)).toEqual({ file: 'Fs2', rate: 1 });
      expect(resolveSample(49)).toEqual({ file: 'Cs3', rate: 1 });
    });
  });

  describe('setGuitarBank', () => {
    it('persists the choice to localStorage', () => {
      setGuitarBank('b');
      expect(localStorage.getItem(BANK_KEY)).toBe('b');
      setGuitarBank('a');
      expect(localStorage.getItem(BANK_KEY)).toBe('a');
    });

    it('switches which ladder resolveSample uses', () => {
      // Bank A: C6 (84) is a real sample → exact hit.
      expect(resolveSample(84)).toEqual({ file: 'C6', rate: 1 });
      // Switch to B: C6 now pitch-shifts up from the Fs5 top.
      setGuitarBank('b');
      const b = resolveSample(84);
      expect(b.file).toBe('Fs5');
      expect(b.rate).toBeCloseTo(2 ** (6 / 12), 6);
      // And A's gap note F#2 becomes an exact hit under B.
      expect(resolveSample(42)).toEqual({ file: 'Fs2', rate: 1 });
    });

    it('busts decoded buffers and re-preloads the new bank', async () => {
      await preload(); // warm bank A
      expect(isReady(60)).toBe(true);
      const callsAfterA = vi.mocked(fetch).mock.calls.length;
      expect(callsAfterA).toBe(39);

      setGuitarBank('b'); // clears buffers + loadPromise, kicks preload()
      // buffers were busted: synchronously after the switch the new set has not
      // decoded yet, so a fresh preload's fetches fire against bank B's URLs.
      await preload(); // the switch already kicked one; this awaits completion
      const bCalls = vi.mocked(fetch).mock.calls
        .map((c) => String(c[0]))
        .filter((u) => u.includes('/samples/guitar-b/'));
      expect(bCalls.length).toBeGreaterThan(0);
      expect(isReady(60)).toBe(true);
    });

    it('is a no-op when the bank is unchanged (no buffer bust)', async () => {
      await preload();
      const before = vi.mocked(fetch).mock.calls.length;
      setGuitarBank('a'); // already on A
      expect(isReady(60)).toBe(true); // buffers NOT cleared
      // no new fetches kicked
      expect(vi.mocked(fetch).mock.calls.length).toBe(before);
    });
  });
});
