/**
 * The metronome's saved field (wave 3, stream M): ONE optional v6 field,
 * `metronome` = { bpm, beats }, written only once the learner changes the
 * tempo or the beats in a bar; guarded on load and in the backup check;
 * never whether it runs. A frozen, production-shaped v6 save rehydrates
 * with every field unchanged and is written back byte for byte. The old
 * migration still strips `metronomeBPM` / `metronomeBeats` /
 * `metronomeVolume` (so the field is not called that).
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useAppStore, sanitizePersistedAppState, invalidAppStateFields } from '../store';
import { buildBackup, validateBackup } from '../../utils/backupHelpers';
import { sanitizeSavedMetronome, metronomeToSave, DEFAULT_METRONOME } from '../metronomeSave';

const FROZEN = readFileSync(join(__dirname, 'fixtures', 'settings-v6-before-start.json'), 'utf8');
const frozen = () => JSON.parse(FROZEN) as { state: Record<string, unknown>; version: number };
const raw = () => localStorage.getItem('music-theory-app')!;
const saved = () => JSON.parse(raw()) as { state: Record<string, unknown>; version: number };
const touch = () => useAppStore.setState({ volume: useAppStore.getState().volume });
/** After wave 2 (the fields a learner from today may already have), in partialize order. */
const WAVE2 = { progression: { chords: ['G', 'D', 'Em', 'C'], bpm: 96, beats: 2 }, capoFret: 3 } as const;

beforeEach(() => localStorage.clear());
afterEach(() => {
  localStorage.clear();
  useAppStore.setState({ metronome: undefined, progression: undefined, capoFret: 0 });
});

describe('a save from before the metronome (the owner\'s)', () => {
  it('rehydrates unchanged, gets no metronome field, and is written back byte for byte', async () => {
    useAppStore.setState({ metronome: undefined });
    localStorage.setItem('music-theory-app', FROZEN);
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState()).toMatchObject(frozen().state);
    expect(useAppStore.getState().metronome).toBeUndefined();
    touch();
    expect(raw()).toBe(JSON.stringify(frozen()));
    expect(saved().state).not.toHaveProperty('metronome');
  });

  it('the same with wave 2\'s fields in it', async () => {
    const blob = JSON.stringify({ state: { ...frozen().state, ...WAVE2 }, version: 6 });
    localStorage.setItem('music-theory-app', blob);
    await useAppStore.persist.rehydrate();
    touch();
    expect(raw()).toBe(blob);
  });
});

describe('the field', () => {
  it('is written beside the old fields once set, and a reload brings it back', async () => {
    localStorage.setItem('music-theory-app', FROZEN);
    await useAppStore.persist.rehydrate();
    useAppStore.getState().setMetronome({ bpm: 72, beats: 4 });
    expect(saved()).toEqual({ state: { ...frozen().state, metronome: { bpm: 72, beats: 4 } }, version: 6 });
    const written = raw();
    useAppStore.setState({ metronome: undefined });
    localStorage.setItem('music-theory-app', written);
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().metronome).toEqual({ bpm: 72, beats: 4 });
  });

  it('holds only the tempo and the beats (never running, never a volume)', () => {
    expect(metronomeToSave({ bpm: 72, beats: 3 })).toEqual({ metronome: { bpm: 72, beats: 3 } });
    expect(metronomeToSave(undefined)).toEqual({});
    // A malformed one in memory is not written.
    expect(metronomeToSave({ bpm: 500, beats: 4 })).toEqual({});
    expect(DEFAULT_METRONOME).toEqual({ bpm: 80, beats: 4 });
  });

  it('is not one of the names the v4 migration strips', async () => {
    // A v3 blob carrying the old names: the migration still drops those; ours survives a v6 save.
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { ...frozen().state, metronomeBPM: 72, metronomeBeats: 3, metronomeVolume: 1 }, version: 3 }));
    await useAppStore.persist.rehydrate();
    touch();
    expect(saved().state).not.toHaveProperty('metronomeBPM');
    expect(saved().state).not.toHaveProperty('metronomeBeats');
    expect(saved().state).not.toHaveProperty('metronomeVolume');
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { ...frozen().state, metronome: { bpm: 72, beats: 3 } }, version: 6 }));
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().metronome).toEqual({ bpm: 72, beats: 3 });
  });
});

describe('the guard', () => {
  const bad: unknown[] = [
    null, 72, 'fast', [], {}, { bpm: 72 }, { beats: 4 }, { bpm: 29, beats: 4 }, { bpm: 241, beats: 4 }, { bpm: 72.5, beats: 4 },
    { bpm: '72', beats: 4 }, { bpm: 72, beats: 5 }, { bpm: 72, beats: 1 }, { bpm: 72, beats: '4' }, { bpm: 72, beats: 4, running: true },
    { bpm: Number.NaN, beats: 4 },
  ];
  for (const b of bad) {
    it(`drops ${JSON.stringify(b)}, keeps the rest`, () => {
      const state = { ...frozen().state, metronome: b };
      expect(sanitizePersistedAppState(state)).toEqual(frozen().state);
      expect(invalidAppStateFields(state)).toEqual(['metronome']);
    });
  }
  it('keeps every valid one as the same object (the backup check compares with Object.is)', () => {
    for (const bpm of [30, 72, 240]) {
      for (const beats of [2, 3, 4, 6]) {
        const m = { bpm, beats };
        expect(sanitizeSavedMetronome(m)).toBe(m);
        expect(sanitizePersistedAppState({ ...frozen().state, metronome: m })!.metronome).toBe(m);
        expect(invalidAppStateFields({ ...frozen().state, metronome: m })).toEqual([]);
      }
    }
  });
  it('the backup carries it, and its check refuses a bad one', async () => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { ...frozen().state, metronome: { bpm: 72, beats: 4 } }, version: 6 }));
    const backup = buildBackup(localStorage);
    expect((backup.data['music-theory-app'] as { state: Record<string, unknown> }).state.metronome).toEqual({ bpm: 72, beats: 4 });
    expect((await validateBackup(JSON.parse(JSON.stringify(backup)))).ok).toBe(true);
    const broken = JSON.parse(JSON.stringify(backup));
    broken.data['music-theory-app'].state.metronome.beats = 5;
    expect(await validateBackup(broken)).toMatchObject({ ok: false });
  });
});
