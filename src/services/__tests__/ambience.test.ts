/**
 * ambience.ts — graph shape + IR property tests.
 *
 * Uses a minimal mock context: each factory method returns a distinct object
 * so we can assert exact connection topology without touching real Web Audio.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createAmbience, PIANO_AMBIENCE, type AmbienceOptions } from '../ambience';

// ─── Mock context ────────────────────────────────────────────────────────────

type MockNode = {
  _type: string;
  gain?: { value: number };
  delayTime?: { value: number };
  buffer?: AudioBuffer | null;
  connections: MockNode[];
  connect: (target: MockNode) => void;
};

type MockBuffer = {
  channels: Float32Array[];
  numberOfChannels: number;
  length: number;
  sampleRate: number;
  getChannelData: (ch: number) => Float32Array;
};

function makeNode(type: string, extra: Partial<MockNode> = {}): MockNode {
  const node: MockNode = { _type: type, connections: [], ...extra } as MockNode;
  node.connect = vi.fn((target: MockNode) => {
    node.connections.push(target);
  }) as MockNode['connect'];
  return node;
}

class MockAudioContext {
  sampleRate = 44100;
  _destination = makeNode('destination');
  get destination() { return this._destination; }

  _gains: MockNode[] = [];
  _delays: MockNode[] = [];
  _convolvers: MockNode[] = [];
  _buffers: MockBuffer[] = [];

  createGain() {
    const g = makeNode('gain', { gain: { value: 1 } }) as MockNode & { gain: { value: number } };
    this._gains.push(g);
    return g;
  }

  createDelay(_maxDelay?: number) {
    const d = makeNode('delay', { delayTime: { value: 0 } }) as MockNode & { delayTime: { value: number } };
    this._delays.push(d);
    return d;
  }

  createConvolver() {
    const c = makeNode('convolver', { buffer: null }) as MockNode & { buffer: AudioBuffer | null };
    this._convolvers.push(c);
    return c;
  }

  createBuffer(channels: number, length: number, sampleRate: number): AudioBuffer {
    const buf: MockBuffer = {
      channels: Array.from({ length: channels }, () => new Float32Array(length)),
      numberOfChannels: channels,
      length,
      sampleRate,
      getChannelData(ch: number) { return this.channels[ch]; },
    };
    this._buffers.push(buf);
    return buf as unknown as AudioBuffer;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildCtx() {
  return new MockAudioContext() as unknown as AudioContext;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('createAmbience — graph shape', () => {
  let ctx: MockAudioContext;
  let dest: MockNode;

  beforeEach(() => {
    ctx = new MockAudioContext();
    dest = ctx._destination;
  });

  it('returns a node (the input bus)', () => {
    const input = createAmbience(ctx as unknown as AudioContext, dest as unknown as AudioNode, PIANO_AMBIENCE);
    expect(input).toBeTruthy();
  });

  it('dry path: input → dry(gain=1) → destination', () => {
    createAmbience(ctx as unknown as AudioContext, dest as unknown as AudioNode, PIANO_AMBIENCE);

    // We expect at least two gains: input (value=1) and dry (value=1)
    const gains = ctx._gains;
    // The first gain is the input bus; the second is dry
    expect(gains.length).toBeGreaterThanOrEqual(2);

    // dry gain value must be 1 (unaltered dry)
    const dryGain = gains[1];
    expect(dryGain.gain!.value).toBe(1);

    // dry connects to destination
    expect(dryGain.connections).toContain(dest);
  });

  it('wet path: input → preDelay → convolver → wet(gain=opts.wet) → destination', () => {
    const opts: AmbienceOptions = { wet: 0.3, decaySeconds: 1.0, preDelayMs: 20 };
    createAmbience(ctx as unknown as AudioContext, dest as unknown as AudioNode, opts);

    // One delay node, set to preDelayMs/1000
    expect(ctx._delays.length).toBe(1);
    expect(ctx._delays[0].delayTime!.value).toBeCloseTo(opts.preDelayMs / 1000, 6);

    // One convolver, with a buffer assigned
    expect(ctx._convolvers.length).toBe(1);
    expect(ctx._convolvers[0].buffer).not.toBeNull();

    // wet gain value matches opts.wet
    // gains: [input, dry, wet]
    const wetGain = ctx._gains[2];
    expect(wetGain.gain!.value).toBeCloseTo(opts.wet, 6);

    // wet gain connects to destination
    expect(wetGain.connections).toContain(dest);
  });

  it('input bus connects to both the dry gain and the preDelay node', () => {
    createAmbience(ctx as unknown as AudioContext, dest as unknown as AudioNode, PIANO_AMBIENCE);

    const inputBus = ctx._gains[0];
    // Should connect to dry (a gain) and preDelay (a delay)
    const connectTypes = inputBus.connections.map((n) => n._type);
    expect(connectTypes).toContain('gain');   // dry path
    expect(connectTypes).toContain('delay');  // wet pre-delay path
  });

  it('PIANO_AMBIENCE wet matches shipped constant', () => {
    createAmbience(ctx as unknown as AudioContext, dest as unknown as AudioNode, PIANO_AMBIENCE);
    const wetGain = ctx._gains[2];
    expect(wetGain.gain!.value).toBeCloseTo(PIANO_AMBIENCE.wet, 6);
    expect(PIANO_AMBIENCE.wet).toBe(0.16);
  });

  it('PIANO_AMBIENCE preDelayMs matches shipped constant', () => {
    createAmbience(ctx as unknown as AudioContext, dest as unknown as AudioNode, PIANO_AMBIENCE);
    expect(ctx._delays[0].delayTime!.value).toBeCloseTo(PIANO_AMBIENCE.preDelayMs / 1000, 6);
    expect(PIANO_AMBIENCE.preDelayMs).toBe(18);
  });
});

describe('createAmbience — IR buffer properties', () => {
  it('IR buffer has 2 channels (stereo)', () => {
    const ctx = buildCtx() as unknown as MockAudioContext;
    const dest = ctx.destination as unknown as AudioNode;
    createAmbience(ctx as unknown as AudioContext, dest, PIANO_AMBIENCE);
    const ir = ctx._buffers[0];
    expect(ir.numberOfChannels).toBe(2);
  });

  it('IR buffer length matches decaySeconds * sampleRate', () => {
    const ctx = buildCtx() as unknown as MockAudioContext;
    const dest = ctx.destination as unknown as AudioNode;
    const opts: AmbienceOptions = { wet: 0.1, decaySeconds: 1.0, preDelayMs: 10 };
    createAmbience(ctx as unknown as AudioContext, dest, opts);
    const ir = ctx._buffers[0];
    const expectedLength = Math.floor(ctx.sampleRate * opts.decaySeconds);
    expect(ir.length).toBe(expectedLength);
  });

  it('IR decays: first-100-sample mean magnitude > last-100 mean magnitude (both channels)', () => {
    const ctx = buildCtx() as unknown as MockAudioContext;
    const dest = ctx.destination as unknown as AudioNode;
    createAmbience(ctx as unknown as AudioContext, dest, PIANO_AMBIENCE);
    const ir = ctx._buffers[0];

    for (let ch = 0; ch < 2; ch++) {
      const data = ir.channels[ch];
      const n = data.length;
      expect(n).toBeGreaterThan(200); // sanity: buffer must be long enough

      let earlySum = 0;
      for (let i = 0; i < 100; i++) earlySum += Math.abs(data[i]);
      const earlyMean = earlySum / 100;

      let lateSum = 0;
      for (let i = n - 100; i < n; i++) lateSum += Math.abs(data[i]);
      const lateMean = lateSum / 100;

      expect(earlyMean).toBeGreaterThan(lateMean);
    }
  });

  it('IR channels are decorrelated (not identical)', () => {
    const ctx = buildCtx() as unknown as MockAudioContext;
    const dest = ctx.destination as unknown as AudioNode;
    createAmbience(ctx as unknown as AudioContext, dest, PIANO_AMBIENCE);
    const ir = ctx._buffers[0];
    const ch0 = ir.channels[0];
    const ch1 = ir.channels[1];

    // Compare first 50 samples; probability of exact match by chance: ~0
    let identical = true;
    for (let i = 0; i < 50; i++) {
      if (ch0[i] !== ch1[i]) { identical = false; break; }
    }
    expect(identical).toBe(false);
  });
});
