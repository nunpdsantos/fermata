/**
 * A rhythm and the metronome (wave 3, second fix pass): `playRhythm` says a
 * rhythm is starting (`rhythmStart.ts`) and never reaches for the metronome
 * itself, so a rhythm played when the metronome was never opened loads none
 * of the metronome's chunk. The metronome module is replaced here by a stand-in
 * that records whether anything imported it, statically or later.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { setInstrumentVoice } from '../../core/services/audio';
import { installMockAudioContext } from '../../test/mockAudioContext';

const loaded = vi.hoisted(() => ({ metronome: 0, clickVoice: 0 }));
vi.mock('../../services/metronome/metronome', () => {
  loaded.metronome++;
  return {};
});
vi.mock('../../services/metronome/clickVoice', () => {
  loaded.clickVoice++;
  return {};
});

import { playRhythm } from '../rhythmPlayback';
import { onRhythmStart } from '../rhythmStart';

const voice = {
  playNote: vi.fn(() => true), startNote: vi.fn(() => true), stopNote: vi.fn(), setVolume: vi.fn(),
  resume: vi.fn(() => Promise.resolve()), cancelScheduled: vi.fn(),
};

beforeEach(() => {
  installMockAudioContext(1);
  setInstrumentVoice(voice);
});
afterEach(() => {
  setInstrumentVoice(null);
  vi.unstubAllGlobals();
});

describe('a rhythm when the metronome was never opened', () => {
  it('plays, and nothing of the metronome is loaded (not at import, not on play)', async () => {
    expect(loaded).toEqual({ metronome: 0, clickVoice: 0 });
    voice.playNote.mockClear();
    await playRhythm({ time: '4/4', notes: 'q q h' });
    await new Promise((r) => setTimeout(r, 20)); // room for a late dynamic import
    expect(voice.playNote).toHaveBeenCalled(); // known positive: it played
    expect(loaded).toEqual({ metronome: 0, clickVoice: 0 });
  });

  it('rhythmPlayback.ts and rhythmStart.ts name no metronome module (no static import that would pull the clock into the Learn chunk)', () => {
    for (const file of ['rhythmPlayback.ts', 'rhythmStart.ts']) {
      const src = readFileSync(join(__dirname, '..', file), 'utf8');
      const imports = [...src.matchAll(/(?:from\s+|import\s*\()\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
      // Known positive: the pattern reads rhythmPlayback's imports (core audio among them).
      if (file === 'rhythmPlayback.ts') expect(imports).toContain('../core/services/audio');
      expect(imports.filter((p) => /metronome/i.test(p)), file).toEqual([]);
    }
  });
});

describe('the signal', () => {
  it('playRhythm says a rhythm is starting, synchronously (inside the tap), once per play', () => {
    const heard = vi.fn();
    const off = onRhythmStart(heard);
    void playRhythm({ time: '4/4', notes: 'q q h' });
    expect(heard).toHaveBeenCalledTimes(1);
    void playRhythm({ time: '3/4', notes: 'q q q' });
    expect(heard).toHaveBeenCalledTimes(2);
    off();
    void playRhythm({ time: '4/4', notes: 'q q h' });
    expect(heard).toHaveBeenCalledTimes(2);
  });
});
