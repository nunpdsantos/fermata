/**
 * Wave 3's new saved fields, together (integration, 2026-11-11): each branch
 * proves its own; this proves they coexist with each other and with waves 1
 * and 2. `music-theory-app` (persist stays v6) gains `midiKeyboard` (stream
 * K: `true` while a MIDI keyboard is on) and `metronome` (stream M: { bpm,
 * beats }, once the learner changed one). The microphone (stream T) saves
 * nothing: "Use my instrument" lives in memory for one check only. Every
 * field is optional, written only when it says something, guarded by the
 * same check the load and the backup use, and carried in the backup file.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useAppStore, sanitizePersistedAppState, invalidAppStateFields } from '../store';
import { buildBackup, validateBackup } from '../../utils/backupHelpers';

const WAVE3 = { midiKeyboard: true, metronome: { bpm: 72, beats: 3 } } as const;
const WAVE2 = { progression: { chords: ['G', 'D', 'Em', 'C'], bpm: 96, beats: 2 }, capoFret: 3 } as const;
const WAVE1 = {
  learnerProfile: 'player', startHint: 'player', neckNutSide: 'left', neckTopString: 'high', exploreDetail: 'simple', showSolfege: true,
} as const;

const FROZEN = readFileSync(join(__dirname, 'fixtures', 'settings-v6-before-start.json'), 'utf8');
const frozen = () => JSON.parse(FROZEN) as { state: Record<string, unknown>; version: number };
const saved = () => localStorage.getItem('music-theory-app')!;
const savedState = () => (JSON.parse(saved()) as { state: Record<string, unknown> }).state;
const touch = () => useAppStore.setState({ volume: useAppStore.getState().volume });
const clearWave3 = () => useAppStore.setState({ midiKeyboard: undefined, metronome: undefined });

beforeEach(() => localStorage.clear());
afterEach(() => {
  localStorage.clear();
  clearWave3();
  useAppStore.setState({ progression: undefined, capoFret: 0 });
});

describe('music-theory-app: midiKeyboard and metronome in one v6 save', () => {
  it('a production-shaped save from before wave 3 loads with every field unchanged and is written back byte for byte', async () => {
    localStorage.setItem('music-theory-app', FROZEN);
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().midiKeyboard).toBeUndefined();
    expect(useAppStore.getState().metronome).toBeUndefined();
    touch();
    expect(saved()).toBe(JSON.stringify(frozen()));
    for (const k of Object.keys(WAVE3)) expect(savedState()).not.toHaveProperty(k);
    // Nothing the microphone does is a saved field.
    expect(Object.keys(savedState()).filter((k) => /mic|tuner|listen|instrumentAnswer/i.test(k))).toEqual([]);
  });

  it('the same with waves 1 and 2\'s fields in it: byte for byte', async () => {
    const blob = JSON.stringify({ state: { ...frozen().state, ...WAVE1, ...WAVE2 }, version: 6 });
    localStorage.setItem('music-theory-app', blob);
    await useAppStore.persist.rehydrate();
    touch();
    expect(saved()).toBe(blob);
  });

  it('a save holding every wave-3 field (and waves 1 and 2\'s) round-trips; clearing them leaves the old save', async () => {
    const state = { ...frozen().state, ...WAVE1, ...WAVE2, ...WAVE3 };
    localStorage.setItem('music-theory-app', JSON.stringify({ state, version: 6 }));
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState()).toMatchObject({ ...WAVE3 });
    touch();
    expect(JSON.parse(saved())).toEqual({ state, version: 6 });
    // MIDI off and the metronome back to nothing set: the fields leave the save, nothing else changes.
    clearWave3();
    expect(JSON.parse(saved())).toEqual({ state: { ...frozen().state, ...WAVE1, ...WAVE2 }, version: 6 });
  });

  it('one guard names every bad wave-3 field (beside waves 1 and 2\'s) and drops only them', () => {
    const bad = { ...frozen().state, ...WAVE1, ...WAVE2, midiKeyboard: 'yes', metronome: { bpm: 72, beats: 5 } };
    expect(invalidAppStateFields(bad)!.sort()).toEqual(['metronome', 'midiKeyboard']);
    expect(sanitizePersistedAppState(bad)).toEqual({ ...frozen().state, ...WAVE1, ...WAVE2 });
    for (const [field, value] of [
      ['midiKeyboard', false], ['midiKeyboard', 1], ['midiKeyboard', null],
      ['metronome', { bpm: 29, beats: 4 }], ['metronome', { bpm: 241, beats: 4 }], ['metronome', { bpm: 72.5, beats: 4 }],
      ['metronome', { bpm: '72', beats: 4 }], ['metronome', { bpm: 72, beats: 4, running: true }], ['metronome', [72, 4]], ['metronome', null],
    ] as const) {
      expect(invalidAppStateFields({ ...frozen().state, [field]: value }), `${field} ${JSON.stringify(value)}`).toEqual([field]);
    }
    expect(invalidAppStateFields({ ...frozen().state, ...WAVE1, ...WAVE2, ...WAVE3 })).toEqual([]);
  });

  it('the backup carries both and its check refuses a bad one', async () => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { ...frozen().state, ...WAVE2, ...WAVE3 }, version: 6 }));
    const backup = buildBackup(localStorage);
    expect((backup.data['music-theory-app'] as { state: Record<string, unknown> }).state).toMatchObject({ ...WAVE2, ...WAVE3 });
    expect((await validateBackup(JSON.parse(JSON.stringify(backup)))).ok).toBe(true);
    for (const breakIt of [
      (s: Record<string, unknown>) => { s.midiKeyboard = false; },
      (s: Record<string, unknown>) => { s.metronome = { bpm: 300, beats: 4 }; },
    ]) {
      const broken = JSON.parse(JSON.stringify(backup));
      breakIt(broken.data['music-theory-app'].state);
      expect(await validateBackup(broken)).toMatchObject({ ok: false });
    }
  });
});
