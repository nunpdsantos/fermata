/**
 * The microphone switch when its session chunk cannot be downloaded (offline
 * before the precache finished, or a page left open on a build whose chunks
 * a deploy removed): the switch says the microphone could not start, and the
 * audio context made in the tap is closed — every way off leaves the audio
 * context closed (brief U), this one included. Each further tap the same.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installFakeMic, type FakeMic } from './fakeMic';

vi.mock('../micSession.ts', () => {
  throw new Error('Failed to fetch dynamically imported module');
});

import { micOff, tapMic, useMic } from '../micSwitch';

let mic: FakeMic;
beforeEach(() => {
  mic = installFakeMic();
  micOff();
});
afterEach(() => {
  micOff();
  mic.restore();
});

describe('the session chunk fails to load', () => {
  it('"could not start", nothing asked, and every context made in a tap closed (twice)', async () => {
    for (const taps of [1, 2]) {
      tapMic();
      expect(mic.contexts).toHaveLength(taps);
      await vi.waitFor(() => expect(useMic.getState().state).toEqual({ kind: 'problem', problem: 'failed' }));
      await vi.waitFor(() => expect(mic.contexts.map((c) => c.state)).toEqual(Array(taps).fill('closed')));
    }
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(navigator.permissions.query).not.toHaveBeenCalled();
  });
});
