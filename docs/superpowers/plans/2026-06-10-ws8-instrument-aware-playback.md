# WS8 — Instrument-Aware One-Shot Playback — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every one-shot playback path (Explore play buttons, Circle of Fifths, ear training, celebration) sounds as the selected instrument — sampled piano or Karplus-Strong guitar — by swapping the voice registered at core audio's existing seam.

**Architecture:** Rename core's `PianoVoice` seam to `InstrumentVoice` (no behavior change). Give `karplusStrong.ts` a scheduled one-shot `playNote(midi, when, duration, velocity)` mirroring `pianoSampler.playNote`. Replace `pianoVoiceRegistration.ts` with `instrumentVoices.ts`, which registers the voice matching the store's `instrument` at boot and re-registers on change via a store subscription. Zero call-site changes — all sequencing (octave bumps, voicing, tempo, visual callbacks) stays in core above the seam.

**Tech Stack:** React 19 + TypeScript 5.9, Zustand 5 (plain `subscribe`, no selector middleware), Web Audio API, Vitest + jsdom (AudioContext stubbed via `vi.stubGlobal`).

**Spec:** `docs/superpowers/specs/2026-06-10-instrument-aware-playback-design.md`

**Conventions that bite here:**
- Source files import with explicit `.ts` extensions (`from '../core/services/audio.ts'`); test files import WITHOUT extensions (`from '../karplusStrong'`). Match each file's style.
- Type-check with `npx tsc -b --force` — never trust incremental state or IDE diagnostics.
- Branch `ws8-instrument-aware-playback` already exists with the spec committed; work on it.
- One deviation from spec §4.1, decided during planning: the master-volume push on voice swap lives in `instrumentVoices.ts` (registration layer), NOT in core `setInstrumentVoice()`. Reason: `sampler.setVolume()` eagerly creates its AudioContext; a push from core at boot-time registration would create the context during initial script eval. The swap path in registration reads `state.volume` and pushes there instead. Task 6 amends the spec.

---

### Task 1: Karplus-Strong scheduled one-shot + volume-before-chain fix

**Files:**
- Modify: `src/services/karplusStrong.ts`
- Test: `src/services/__tests__/karplusStrong.test.ts`

The engine gets `playNote(midiNumber, when, duration, velocity)` — the one-shot the guitar voice adapter needs — plus a fix for a latent bug this feature would expose: `setVolume()` before the first note is a silent no-op (the chain doesn't exist yet, and `setupChain` hardcodes 0.9), so the persisted volume never applies to guitar until the slider moves.

- [ ] **Step 1: Write the failing tests**

Append to `src/services/__tests__/karplusStrong.test.ts` (inside the existing file, after the `resumeContext` describe block). Also add `playNote` to the existing import list from `'../karplusStrong'`:

```ts
describe('playNote (scheduled one-shot)', () => {
  it('schedules the source at currentTime + when and stops it after the release', () => {
    const { mockCtx, sources } = setupMockAudioContext();
    mockCtx.currentTime = 2;
    playNote(60, 1.5, 0.35, 0.5);
    const src = sources[sources.length - 1];
    // startAt = 2 + 1.5 = 3.5; endAt = 3.85; stop at endAt + 0.3 release + 0.05
    expect(src.start).toHaveBeenCalledWith(3.5);
    expect(src.stop).toHaveBeenCalledWith(4.2);
  });

  it('maps velocity to gain at the sustained-pluck level (×0.9)', () => {
    const { gains } = setupMockAudioContext();
    playNote(60, 0, 0.35, 0.5);
    const g = gains[gains.length - 1];
    expect(g.gain.value).toBeCloseTo(0.45);
  });

  it('schedules a release ramp to zero starting at note end', () => {
    const { mockCtx, gains } = setupMockAudioContext();
    mockCtx.currentTime = 0;
    playNote(60, 0, 1, 0.5);
    const g = gains[gains.length - 1];
    expect(g.gain.setValueAtTime).toHaveBeenCalledWith(expect.closeTo(0.45), 1);
    expect(g.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, expect.closeTo(1.3));
  });

  it('caps the generated buffer to what will be heard (short notes)', () => {
    const { mockCtx } = setupMockAudioContext();
    playNote(60, 0, 0.35, 0.5);
    // bufferDuration = max(1, min(5, 0.35 + 0.5)) = 1 second
    const lastCall = mockCtx.createBuffer.mock.calls.at(-1)!;
    expect(lastCall[1]).toBe(44100 * 1);
  });

  it('never generates more than the engine default 5 s of buffer', () => {
    const { mockCtx } = setupMockAudioContext();
    playNote(60, 0, 10, 0.5);
    const lastCall = mockCtx.createBuffer.mock.calls.at(-1)!;
    expect(lastCall[1]).toBe(44100 * 5);
  });

  it('does not occupy the sustained-voice map (same MIDI can still be fretted)', () => {
    const { sources } = setupMockAudioContext();
    playNote(60, 0, 0.35, 0.5);
    const afterOneShot = sources.length;
    startNote(60); // must create a NEW sustained voice, not be deduped
    expect(sources.length).toBe(afterOneShot + 1);
  });

  it('stopAll silences scheduled one-shots too', () => {
    const { sources } = setupMockAudioContext();
    playNote(60, 0, 2, 0.5);
    playNote(64, 0.5, 2, 0.5);
    stopAll();
    for (const s of sources.slice(-2)) {
      expect(s.stop).toHaveBeenCalled();
    }
  });
});

describe('setVolume before chain creation', () => {
  it('applies a volume set before the first note once the chain is built', () => {
    const { gains } = setupMockAudioContext();
    setVolume(0.4); // chain does not exist yet — must be remembered
    startNote(60); // chain is created here
    expect(gains[0].gain.value).toBe(0.4); // gains[0] is the master gain
  });
});
```

- [ ] **Step 2: Run the new tests to verify they fail**

Run: `cd /Users/nunosantos/Desktop/Base/Music/new_music_app && npx vitest run src/services/__tests__/karplusStrong.test.ts`
Expected: FAIL — `playNote` is not exported (import error), and the `setVolume before chain creation` test gets `0.9` instead of `0.4`.

- [ ] **Step 3: Implement in `src/services/karplusStrong.ts`**

3a. Add to the constants section (after `FADE_OUT_MS`):

```ts
const ONESHOT_RELEASE_S = 0.3; // "finger lift" after a scheduled note's duration
const ONESHOT_MIN_BUFFER_S = 1;
```

3b. Add to the module-state section (after `voiceOrder`):

```ts
let masterVolume = 0.9;
const oneShots = new Set<Voice>();
```

3c. In `setupChain`, replace the hardcoded master gain value:

```ts
  masterGain = ctx.createGain();
  masterGain.gain.value = masterVolume;
```

3d. Replace `setVolume` so pre-chain values are remembered:

```ts
export function setVolume(vol: number): void {
  masterVolume = vol;
  if (masterGain) {
    masterGain.gain.value = vol;
  }
}
```

3e. Add the one-shot after `stopNote` (before `stopAll`):

```ts
/**
 * Scheduled one-shot pluck for chord/scale/ear-training playback — the
 * guitar counterpart of pianoSampler.playNote. `when` is seconds from now
 * (offsets transfer across AudioContexts; the caller computes them against
 * core audio's clock). The pluck holds until `when + duration`, then a short
 * release ramp mimics a finger lift so fast scales stay articulate. The
 * generated buffer is capped to what will actually be heard, so scheduling a
 * 16-note scale stays cheap. One-shots live outside the sustained-voice map:
 * a scheduled scale must never voice-steal a held fret note.
 */
export function playNote(
  midiNumber: number,
  when: number,
  duration: number,
  velocity: number,
): void {
  const ctx = getContext();
  const frequency = midiToFrequency(midiNumber);
  const bufferDuration = Math.max(
    ONESHOT_MIN_BUFFER_S,
    Math.min(DEFAULT_PARAMS.duration, duration + 0.5),
  );
  const samples = generateKSBuffer(ctx.sampleRate, frequency, {
    ...DEFAULT_PARAMS,
    duration: bufferDuration,
  });

  const buffer = ctx.createBuffer(1, samples.length, ctx.sampleRate);
  buffer.getChannelData(0).set(samples);

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gain = ctx.createGain();
  // 0.5 default velocity → 0.45, the sustained-pluck level
  gain.gain.value = velocity * 0.9;

  const startAt = ctx.currentTime + when;
  const endAt = startAt + duration;
  gain.gain.setValueAtTime(velocity * 0.9, endAt);
  gain.gain.linearRampToValueAtTime(0, endAt + ONESHOT_RELEASE_S);

  source.connect(gain as unknown as AudioNode);
  gain.connect(masterGain as unknown as AudioNode);
  source.start(startAt);
  source.stop(endAt + ONESHOT_RELEASE_S + 0.05);

  const voice: Voice = { source: source as unknown as AudioBufferSourceNode, gain: gain as unknown as GainNode };
  oneShots.add(voice);
  source.onended = () => {
    oneShots.delete(voice);
  };
}
```

(Match the file's existing casting style — check how `startNote` connects nodes and copy it exactly; if `startNote` connects without casts, drop the casts here too.)

3f. Extend `stopAll` to cover one-shots:

```ts
export function stopAll(): void {
  for (const midi of [...voices.keys()]) {
    stopNote(midi);
  }
  const ctx = getContext();
  const now = ctx.currentTime;
  for (const voice of oneShots) {
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.linearRampToValueAtTime(0, now + FADE_OUT_MS / 1000);
    try {
      voice.source.stop(now + FADE_OUT_MS / 1000 + 0.01);
    } catch {
      // already stopped
    }
  }
  oneShots.clear();
}
```

3g. Extend `_resetForTesting` — add `oneShots.clear();` and `masterVolume = 0.9;` alongside the existing resets.

- [ ] **Step 4: Run the karplusStrong suite**

Run: `npx vitest run src/services/__tests__/karplusStrong.test.ts`
Expected: PASS (all existing + 8 new tests).

- [ ] **Step 5: Commit**

```bash
git add src/services/karplusStrong.ts src/services/__tests__/karplusStrong.test.ts
git commit -m "feat(audio): Karplus-Strong scheduled one-shot + remember volume set before chain creation

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Core seam rename — `PianoVoice` → `InstrumentVoice` — with seam contract tests

**Files:**
- Modify: `src/core/services/audio.ts`
- Modify: `src/services/pianoVoiceRegistration.ts` (import/call rename only — file is replaced in Task 3)
- Test: Create `src/core/services/__tests__/audio.test.ts`

Core audio has zero direct tests today. The new file pins the seam contract this WS depends on: voice-first routing with FM fallback, sustained delegation, volume push, resume. The tests are written against the NEW names, so they fail until the rename lands.

- [ ] **Step 1: Write the failing test file**

Create `src/core/services/__tests__/audio.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type * as AudioModule from '../audio';

// ---------------------------------------------------------------------------
// Mock AudioContext (pattern from src/services/__tests__/karplusStrong.test.ts)
// ---------------------------------------------------------------------------

function makeGainParam() {
  return {
    value: 1,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
    setTargetAtTime: vi.fn(),
    cancelScheduledValues: vi.fn(),
  };
}

function setupMockAudioContext() {
  const oscillators: Array<{
    type: string;
    frequency: { value: number };
    detune: { value: number };
    connect: ReturnType<typeof vi.fn>;
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
    onended: (() => void) | null;
  }> = [];

  const mockCtx = {
    sampleRate: 44100,
    state: 'running' as AudioContextState,
    currentTime: 0,
    destination: {},
    resume: vi.fn().mockResolvedValue(undefined),
    close: vi.fn(),
    createGain: vi.fn(() => ({ gain: makeGainParam(), connect: vi.fn(), disconnect: vi.fn() })),
    createOscillator: vi.fn(() => {
      const osc = {
        type: 'sine',
        frequency: { value: 0 },
        detune: { value: 0 },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        disconnect: vi.fn(),
        onended: null as (() => void) | null,
      };
      oscillators.push(osc);
      return osc;
    }),
    createDynamicsCompressor: vi.fn(() => ({
      threshold: { value: 0 },
      knee: { value: 0 },
      ratio: { value: 0 },
      attack: { value: 0 },
      release: { value: 0 },
      connect: vi.fn(),
    })),
    createConvolver: vi.fn(() => ({ buffer: null, connect: vi.fn() })),
    createBiquadFilter: vi.fn(() => ({
      type: 'lowpass',
      frequency: { value: 0 },
      Q: { value: 1 },
      connect: vi.fn(),
      disconnect: vi.fn(),
    })),
    createBuffer: vi.fn((channels: number, length: number, sampleRate: number) => ({
      numberOfChannels: channels,
      length,
      sampleRate,
      getChannelData: vi.fn(() => new Float32Array(length)),
    })),
  };

  vi.stubGlobal('AudioContext', function MockAudioContext() {
    return mockCtx;
  } as unknown as typeof AudioContext);

  return { mockCtx, oscillators };
}

function makeVoice(handles: boolean) {
  return {
    playNote: vi.fn(() => handles),
    startNote: vi.fn(() => handles),
    stopNote: vi.fn(),
    setVolume: vi.fn(),
    resume: vi.fn().mockResolvedValue(undefined),
  };
}

// Core audio uses module-level singletons (AudioContext, registered voice), so
// every test re-imports a fresh module instance.
async function freshAudio(): Promise<typeof AudioModule> {
  return (await import('../audio.ts')) as typeof AudioModule;
}

beforeEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
});

describe('instrument voice seam — one-shot routing', () => {
  it('routes playNote to the registered voice and skips the synth', async () => {
    const { mockCtx } = setupMockAudioContext();
    const audio = await freshAudio();
    const voice = makeVoice(true);
    audio.setInstrumentVoice(voice);

    audio.playNote('C', 4, 0.5);

    // C4 = MIDI 60; immediate → when offset 0; default velocity 0.5
    expect(voice.playNote).toHaveBeenCalledWith(60, 0, 0.5, 0.5);
    expect(mockCtx.createOscillator).not.toHaveBeenCalled();
  });

  it('falls back to the FM synth when the voice declines', async () => {
    const { mockCtx } = setupMockAudioContext();
    const audio = await freshAudio();
    const voice = makeVoice(false);
    audio.setInstrumentVoice(voice);

    audio.playNote('C', 4, 0.5);

    expect(voice.playNote).toHaveBeenCalled();
    expect(mockCtx.createOscillator).toHaveBeenCalled();
  });

  it('offers every chord note to the voice', async () => {
    setupMockAudioContext();
    const audio = await freshAudio();
    const voice = makeVoice(true);
    audio.setInstrumentVoice(voice);

    audio.playChord(['C', 'E', 'G'], 4, 1);

    expect(voice.playNote).toHaveBeenCalledTimes(3);
    const midis = voice.playNote.mock.calls.map((c) => c[0]);
    expect(midis).toEqual([60, 64, 67]);
  });

  it('routes a full scale (with octave note) through the voice', async () => {
    setupMockAudioContext();
    const audio = await freshAudio();
    const voice = makeVoice(true);
    audio.setInstrumentVoice(voice);

    audio.playScale(['C', 'D', 'E', 'F', 'G', 'A', 'B'], 4, true, false);

    // 7 scale notes + the octave root
    expect(voice.playNote).toHaveBeenCalledTimes(8);
    expect(voice.playNote.mock.calls[0][0]).toBe(60); // C4
    expect(voice.playNote.mock.calls[7][0]).toBe(72); // C5
  });
});

describe('instrument voice seam — sustained + controls', () => {
  it('delegates sustained start/stop to the voice', async () => {
    setupMockAudioContext();
    const audio = await freshAudio();
    const voice = makeVoice(true);
    audio.setInstrumentVoice(voice);

    const midi = audio.startSustainedNote('C', 4);
    expect(midi).toBe(60);
    expect(voice.startNote).toHaveBeenCalledWith(60, 0.5);

    audio.stopSustainedNote(60);
    expect(voice.stopNote).toHaveBeenCalledWith(60);
  });

  it('setMasterVolume pushes to the voice', async () => {
    setupMockAudioContext();
    const audio = await freshAudio();
    const voice = makeVoice(true);
    audio.setInstrumentVoice(voice);

    audio.setMasterVolume(0.4);
    expect(voice.setVolume).toHaveBeenCalledWith(0.4);
  });

  it('resumeAudio resumes the voice', async () => {
    setupMockAudioContext();
    const audio = await freshAudio();
    const voice = makeVoice(true);
    audio.setInstrumentVoice(voice);

    await audio.resumeAudio();
    expect(voice.resume).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/core/services/__tests__/audio.test.ts`
Expected: FAIL — `setInstrumentVoice` is not exported (the module still exports `setPianoVoice`).

- [ ] **Step 3: Rename the seam in `src/core/services/audio.ts`**

3a. Replace the section banner + interface + setter (currently around lines 156–179):

```ts
// ============================================================================
// Pluggable instrument voice
// ============================================================================
// The app registers the active melodic voice here — the sampled Salamander
// piano or the Karplus-Strong guitar, following the instrument selected in
// the UI. When the voice handles a note it returns true and the FM synth
// stays silent; when it declines (piano samples still loading/offline) the
// synth plays exactly as before. Registration keeps this module
// framework-agnostic — core never imports app code.

export interface InstrumentVoice {
  /** One-shot at `when` seconds from now, released after `duration`. */
  playNote(midi: number, when: number, duration: number, velocity: number): boolean;
  /** Sustained note-on; pairs with stopNote. */
  startNote(midi: number, velocity: number): boolean;
  stopNote(midi: number): void;
  setVolume(volume: number): void;
  resume(): Promise<void>;
}

let instrumentVoice: InstrumentVoice | null = null;

export function setInstrumentVoice(voice: InstrumentVoice | null): void {
  instrumentVoice = voice;
}
```

3b. Rename the five usage sites (find each `pianoVoice` reference and replace with `instrumentVoice`; the surrounding code is untouched):

- `resumeAudio()`: `await instrumentVoice?.resume();`
- `setMasterVolume()`: `instrumentVoice?.setVolume(masterVolume);`
- `playNote()`: `if (instrumentVoice?.playNote(midiNumber, whenOffset, duration, synthConfig.volume)) {`
- `startSustainedNote()`: `if (instrumentVoice?.startNote(midiNumber, synthConfig.volume)) {`
- `stopSustainedNote()`: `instrumentVoice?.stopNote(midiNumber);` (and its comment: `// The active voice may own this note (no synth entry was created)`)
- Also update the inline comment above the `playNote` delegation from "Sampled piano takes over…" to `// The registered voice takes over when it can handle this note` (two occurrences: `playNote` and `startSustainedNote`).

3c. Update `src/services/pianoVoiceRegistration.ts` so the branch still compiles (full-file replacement; the file is superseded in Task 3 but every commit stays green):

```ts
/**
 * Registers the sampled Salamander piano as core audio's instrument voice and
 * kicks off sample loading off the critical path. Until samples decode (or
 * if they never do — first visit offline), core falls back to the FM synth,
 * so the keyboard always sounds.
 */
import { setInstrumentVoice } from '../core/services/audio.ts';
import * as sampler from './pianoSampler.ts';

export function registerSampledPiano(): void {
  setInstrumentVoice({
    playNote: (midi, when, duration, velocity) => sampler.playNote(midi, when, duration, velocity),
    startNote: (midi, velocity) => sampler.startNote(midi, velocity),
    stopNote: (midi) => sampler.stopNote(midi),
    setVolume: (volume) => sampler.setVolume(volume),
    resume: () => sampler.resumeContext(),
  });

  const kick = () => {
    void sampler.preload();
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(kick, { timeout: 3000 });
  } else {
    setTimeout(kick, 1000);
  }
}
```

- [ ] **Step 4: Verify — seam tests, full type-check, full suite**

Run: `npx vitest run src/core/services/__tests__/audio.test.ts` → PASS (7 tests)
Run: `npx tsc -b --force` → 0 errors (catches any `setPianoVoice`/`PianoVoice` stragglers)
Run: `npx vitest run` → all pass (baseline 2,265 + Task 1's 8 + these 7)

- [ ] **Step 5: Commit**

```bash
git add src/core/services/audio.ts src/core/services/__tests__/audio.test.ts src/services/pianoVoiceRegistration.ts
git commit -m "refactor(audio): PianoVoice seam becomes InstrumentVoice + seam contract tests

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: `instrumentVoices.ts` — registration follows the store

**Files:**
- Rename: `src/services/pianoVoiceRegistration.ts` → `src/services/instrumentVoices.ts` (git mv, then rewrite)
- Modify: `src/main.tsx:7,14-15`
- Test: Create `src/services/__tests__/instrumentVoices.test.ts`

- [ ] **Step 1: Write the failing test file**

Create `src/services/__tests__/instrumentVoices.test.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { registerInstrumentVoices } from '../instrumentVoices';
import { setInstrumentVoice } from '../../core/services/audio';
import * as sampler from '../pianoSampler';
import * as ks from '../karplusStrong';
import { useAppStore } from '../../state/store';

vi.mock('../../core/services/audio', () => ({
  setInstrumentVoice: vi.fn(),
}));

vi.mock('../pianoSampler', () => ({
  playNote: vi.fn(() => true),
  startNote: vi.fn(() => true),
  stopNote: vi.fn(),
  setVolume: vi.fn(),
  resumeContext: vi.fn().mockResolvedValue(undefined),
  preload: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../karplusStrong', () => ({
  playNote: vi.fn(),
  startNote: vi.fn(),
  stopNote: vi.fn(),
  setVolume: vi.fn(),
  resumeContext: vi.fn().mockResolvedValue(undefined),
}));

const mockedSetVoice = vi.mocked(setInstrumentVoice);

let unsubscribe: (() => void) | null = null;

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
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
    expect(sampler.playNote).toHaveBeenCalledWith(60, 0, 0.5, 0.5);
    expect(ks.playNote).not.toHaveBeenCalled();
  });

  it('registers the guitar voice at boot when the persisted instrument is guitar', () => {
    useAppStore.setState({ instrument: 'guitar' });
    unsubscribe = registerInstrumentVoices();

    const voice = mockedSetVoice.mock.calls[0][0]!;
    expect(voice.playNote(60, 0, 0.5, 0.5)).toBe(true);
    expect(ks.playNote).toHaveBeenCalledWith(60, 0, 0.5, 0.5);
    expect(sampler.playNote).not.toHaveBeenCalled();
  });

  it('swaps the voice on instrument change and pushes the session volume', () => {
    unsubscribe = registerInstrumentVoices();

    useAppStore.setState({ instrument: 'guitar', volume: 0.4 });
    expect(mockedSetVoice).toHaveBeenCalledTimes(2);
    expect(ks.setVolume).toHaveBeenCalledWith(0.4);
    const guitarVoice = mockedSetVoice.mock.calls[1][0]!;
    guitarVoice.playNote(60, 0, 0.5, 0.5);
    expect(ks.playNote).toHaveBeenCalled();

    useAppStore.setState({ instrument: 'piano' });
    expect(mockedSetVoice).toHaveBeenCalledTimes(3);
    expect(sampler.setVolume).toHaveBeenCalledWith(0.4);
  });

  it('ignores store changes that do not flip the instrument', () => {
    unsubscribe = registerInstrumentVoices();

    useAppStore.setState({ volume: 0.2 });
    expect(mockedSetVoice).toHaveBeenCalledTimes(1);
  });

  it('kicks off sampler preload even when booting into guitar', () => {
    useAppStore.setState({ instrument: 'guitar' });
    unsubscribe = registerInstrumentVoices();

    vi.advanceTimersByTime(1100); // jsdom has no requestIdleCallback → setTimeout(1000) branch
    expect(sampler.preload).toHaveBeenCalled();
  });

  it('adapts the full InstrumentVoice contract onto the KS engine', () => {
    useAppStore.setState({ instrument: 'guitar' });
    unsubscribe = registerInstrumentVoices();
    const voice = mockedSetVoice.mock.calls[0][0]!;

    expect(voice.startNote(60, 0.5)).toBe(true);
    expect(ks.startNote).toHaveBeenCalledWith(60);

    voice.stopNote(60);
    expect(ks.stopNote).toHaveBeenCalledWith(60);

    voice.setVolume(0.3);
    expect(ks.setVolume).toHaveBeenCalledWith(0.3);

    void voice.resume();
    expect(ks.resumeContext).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/services/__tests__/instrumentVoices.test.ts`
Expected: FAIL — cannot resolve `'../instrumentVoices'` (file doesn't exist yet).

- [ ] **Step 3: Rename and rewrite the registration module**

```bash
git mv src/services/pianoVoiceRegistration.ts src/services/instrumentVoices.ts
```

Replace the contents of `src/services/instrumentVoices.ts` entirely:

```ts
/**
 * Builds the two instrument voices — sampled Salamander piano and
 * Karplus-Strong guitar — registers the one matching the store's selected
 * instrument into core audio, and keeps the registration in sync when the
 * instrument changes. With the guitar voice active, every one-shot path
 * (Explore play buttons, Circle of Fifths, ear training, celebration) plucks
 * instead of sounding the piano.
 *
 * Piano sample loading still kicks off on idle regardless of the boot
 * instrument, so flipping to piano later never starts a 2 MB download at
 * flip time. Until samples decode (or first visit offline), core falls back
 * to the FM synth, so piano always sounds. The guitar voice generates
 * synchronously and never declines, so the synth cannot leak into guitar
 * mode.
 */
import { setInstrumentVoice, type InstrumentVoice } from '../core/services/audio.ts';
import * as sampler from './pianoSampler.ts';
import * as ks from './karplusStrong.ts';
import { useAppStore, type InstrumentType } from '../state/store.ts';

const pianoVoice: InstrumentVoice = {
  playNote: (midi, when, duration, velocity) => sampler.playNote(midi, when, duration, velocity),
  startNote: (midi, velocity) => sampler.startNote(midi, velocity),
  stopNote: (midi) => sampler.stopNote(midi),
  setVolume: (volume) => sampler.setVolume(volume),
  resume: () => sampler.resumeContext(),
};

const guitarVoice: InstrumentVoice = {
  playNote: (midi, when, duration, velocity) => {
    ks.playNote(midi, when, duration, velocity);
    return true;
  },
  startNote: (midi) => {
    ks.startNote(midi);
    return true;
  },
  stopNote: (midi) => ks.stopNote(midi),
  setVolume: (volume) => ks.setVolume(volume),
  resume: () => ks.resumeContext(),
};

function voiceFor(instrument: InstrumentType): InstrumentVoice {
  return instrument === 'guitar' ? guitarVoice : pianoVoice;
}

/** Returns the store unsubscribe (ignored in prod, used by tests). */
export function registerInstrumentVoices(): () => void {
  let current = useAppStore.getState().instrument;
  setInstrumentVoice(voiceFor(current));

  const unsubscribe = useAppStore.subscribe((state) => {
    if (state.instrument === current) return;
    current = state.instrument;
    const voice = voiceFor(current);
    setInstrumentVoice(voice);
    // The swapped-in voice picks up the session volume; boot-time volume
    // arrives via useAudio's mount sync instead (pushing here at boot would
    // create the sampler's AudioContext during initial script eval).
    voice.setVolume(state.volume);
  });

  const kick = () => {
    void sampler.preload();
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(kick, { timeout: 3000 });
  } else {
    setTimeout(kick, 1000);
  }

  return unsubscribe;
}
```

(Verify the exact export name of `InstrumentType` in `src/state/store.ts:12` — it is re-exported there from `storeTypes.ts`.)

- [ ] **Step 4: Update `src/main.tsx`**

Replace line 7 and lines 14–15:

```ts
import { registerInstrumentVoices } from './services/instrumentVoices.ts'
```

```ts
// The active instrument voice (sampled Salamander piano or Karplus-Strong
// guitar) follows the selected instrument; the FM synth remains the piano
// fallback while samples load.
registerInstrumentVoices();
```

- [ ] **Step 5: Run the new tests, type-check, full suite**

Run: `npx vitest run src/services/__tests__/instrumentVoices.test.ts` → PASS (6 tests)
Run: `npx tsc -b --force` → 0 errors
Run: `npx vitest run` → all pass

- [ ] **Step 6: Commit**

```bash
git add -A src/services/instrumentVoices.ts src/services/__tests__/instrumentVoices.test.ts src/main.tsx
git status --short   # confirm the rename shows as R and nothing unexpected is staged
git commit -m "feat(audio): one-shot playback follows the selected instrument

Voice registration now tracks the store: guitar mode routes Explore play
buttons, Circle of Fifths, ear training and celebration through Karplus-
Strong; piano mode keeps the sampled Salamander voice. Ear-training-follows-
instrument decided by Nuno 2026-06-10.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Full gates

**Files:** none (verification only)

- [ ] **Step 1: Run every gate**

```bash
npx tsc -b --force        # 0 errors
npm run lint              # 0 errors
npx vitest run            # all tests pass (record the new total for Task 5)
npm run audit:all         # engine 0 serious (4 INFO respells), exercises 0, generated 0
npm run build             # production build succeeds
```

Expected: all green. If anything fails, fix before proceeding — do not carry red gates into docs/PR.

---

### Task 5: Docs — CLAUDE.md + spec amendment

**Files:**
- Modify: `CLAUDE.md` (repo root)
- Modify: `docs/superpowers/specs/2026-06-10-instrument-aware-playback-design.md`

- [ ] **Step 1: Update CLAUDE.md**

1a. In **Audio & instruments**, replace the first bullet's final sentence fragment about sound never being silent — append a new bullet after the piano bullet:

```markdown
- **One-shot playback follows the selected instrument (WS8, 2026-06-10).** Core's
  voice seam is now `InstrumentVoice`/`setInstrumentVoice()` (was PianoVoice);
  `src/services/instrumentVoices.ts` registers the sampler-backed piano voice or a
  Karplus-Strong-backed guitar voice per `store.instrument` (persisted — boot can
  land on either) and re-registers on change. Explore play buttons, Circle of
  Fifths, **ear training** (Nuno's call, 2026-06-10) and the celebration fanfare
  all follow. The FM synth remains the piano-only fallback while samples decode;
  the guitar voice never declines, so no synth leak in guitar mode.
  `karplusStrong.playNote(midi, when, duration, velocity)` is the scheduled
  one-shot (gain = velocity × 0.9; 0.3 s finger-lift release after duration;
  buffer capped to ~duration + 0.5 s for cheap scheduling).
```

1b. In **Current State → Open items**, delete the entire "**NEXT SESSION (Nuno's request, 2026-06-09):** …" bullet (the work is done).

1c. In **What's Built**, append to the "Hardening & Sound (WS6–WS7…)" section:

```markdown
- **WS8 (2026-06-10):** one-shot playback follows the selected instrument — core
  seam renamed to `InstrumentVoice`, KS gained a scheduled one-shot, registration
  (`instrumentVoices.ts`) tracks the store. Ear training follows the instrument
  (decided with Nuno). Also fixed: KS volume set before first note now applies.
```

1d. Update the test count in the **Project** block ("**Tests:** ~2,250 passing … 45 test files") and the **Current State** paragraph ("≈2,265 tests / 46 files") with the actual numbers from Task 4's `vitest run` output (expect roughly 2,286 / 48 files — use the real figures).

- [ ] **Step 2: Amend the spec**

In `docs/superpowers/specs/2026-06-10-instrument-aware-playback-design.md` §4.1, replace the volume-push bullet:

```markdown
- ~~`setInstrumentVoice()` additionally pushes the current master volume~~
  **Amended during planning:** the volume push lives in the registration swap
  path (`instrumentVoices.ts`), not in core — `sampler.setVolume()` eagerly
  creates its AudioContext, and a core-side push at boot registration would
  create it during initial script eval. On swap, registration pushes
  `state.volume` into the incoming voice; boot volume arrives via `useAudio`'s
  mount sync as before. Additionally `ks.setVolume()` now remembers a value set
  before the chain exists (latent fix — the persisted volume previously never
  applied to guitar until the slider moved).
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md docs/superpowers/specs/2026-06-10-instrument-aware-playback-design.md
git commit -m "docs(ws8): CLAUDE.md audio section + open-items update; spec volume-push amendment

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Ship — PR, merge, deploy verification

**Files:** none (process)

- [ ] **Step 1: Push and open the PR**

```bash
git push -u origin ws8-instrument-aware-playback
gh pr create --title "WS8: one-shot playback follows the selected instrument" --body "$(cat <<'EOF'
## Summary
- Core voice seam generalized: `PianoVoice` → `InstrumentVoice` (+ first direct seam contract tests)
- `karplusStrong.playNote(midi, when, duration, velocity)`: scheduled one-shot pluck (finger-lift release, capped buffer) + volume-before-chain fix
- `instrumentVoices.ts` registers piano/guitar voice per `store.instrument` (persisted; boot honors it) and swaps on change, pushing session volume
- Zero call-site changes: Explore play buttons, Circle of Fifths, ear training (Nuno's call) and celebration all follow the instrument

## Spec / Plan
- `docs/superpowers/specs/2026-06-10-instrument-aware-playback-design.md`
- `docs/superpowers/plans/2026-06-10-ws8-instrument-aware-playback.md`

## Gates
- tsc -b --force: 0 errors · eslint: 0 · vitest: all passing · audit:all: steady state · build: OK

## Perceptual sign-off
Sound cannot be agent-verified — Nuno judges tone/levels on the deployed build (guitar mode → Chord/Arpeggio/Scale/Circle/ear-training).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 2: Squash-merge (repo convention) and clean up**

```bash
gh pr merge --squash --delete-branch
git checkout main && git pull
```

- [ ] **Step 3: Verify the deploy**

```bash
# Wait for Vercel to build (~30 s), then compare bundle hashes:
npm run build
ls dist/assets/ | grep -E '^index-.*\.js$'
curl -s https://fermata-music.vercel.app/ | grep -oE 'index-[A-Za-z0-9_-]+\.js' | head -1
```

Expected: the two hashes match. If the live hash lags, re-check after another 30–60 s (`vercel ls` shows deployment status).

- [ ] **Step 4: Hand off for ear review**

Tell Nuno exactly what to check at https://fermata-music.vercel.app/ — flip to guitar, then: Chord + Arpeggio buttons (CurrentChordPanel), scale Play (Explore hero), Circle of Fifths segment click, Build-tab Play, an L9 ear-training exercise, a module completion (celebration). Judge: pluck loudness vs piano, scale articulation (0.3 s release), chord body. Iteration knobs are named constants: `ONESHOT_RELEASE_S`, the `× 0.9` velocity factor in `karplusStrong.playNote`.

---

## Self-Review (done at planning time)

- **Spec coverage:** §4.1 → Task 2 (+ amendment in Task 5); §4.2 → Task 1; §4.3 → Task 3; §5 tests → Tasks 1–3; §7 rollout → Tasks 4–6. No gaps.
- **Placeholders:** none — every step has complete code or exact commands. The two "use the real figure" instructions (test count, bundle hash) are execution-time observations, with the exact command to obtain them given.
- **Type consistency:** `InstrumentVoice` defined in Task 2 matches the object shapes built in Task 3 and the mock voices in both test files; `ks.playNote(midi, when, duration, velocity): void` (Task 1) is wrapped by `guitarVoice.playNote` returning `true` (Task 3); `registerInstrumentVoices(): () => void` matches the test's `unsubscribe` usage.
