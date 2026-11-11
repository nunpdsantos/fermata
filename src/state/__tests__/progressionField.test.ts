/**
 * The Progression panel's saved field (wave 2, stream S): ONE optional v6
 * field, `progression`, written only while it holds a chord, guarded on load
 * and in the backup check. A frozen, production-shaped v6 save rehydrates
 * with every field unchanged and is written back byte for byte.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useAppStore, sanitizePersistedAppState, invalidAppStateFields } from '../store';
import { buildBackup, validateBackup } from '../../utils/backupHelpers';
import { sanitizeSavedProgression } from '../progressionSave';
import { chordLinkSymbol } from '../../services/shareLinkMake';
import { readChords } from '../../components/explore/progression/progressionModel';

const FROZEN = readFileSync(join(__dirname, 'fixtures', 'settings-v6-before-start.json'), 'utf8');
const frozen = () => JSON.parse(FROZEN) as { state: Record<string, unknown>; version: number };
const raw = () => localStorage.getItem('music-theory-app')!;
const saved = () => JSON.parse(raw()) as { state: Record<string, unknown>; version: number };
const PROG = { chords: ['G', 'D/F#', 'Em7', 'C'], bpm: 96, beats: 2 as const };

beforeEach(() => localStorage.clear());
afterEach(() => {
  localStorage.clear();
  useAppStore.setState({ progression: undefined });
});

describe('a save from before the panel', () => {
  it('rehydrates unchanged, gets no progression, and is written back byte for byte', async () => {
    useAppStore.setState({ progression: undefined });
    localStorage.setItem('music-theory-app', JSON.stringify(frozen()));
    const before = raw();
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState()).toMatchObject(frozen().state);
    expect(useAppStore.getState().progression).toBeUndefined();
    useAppStore.setState({ volume: useAppStore.getState().volume });
    expect(raw()).toBe(before);
    expect(saved().state).not.toHaveProperty('progression');
  });
});

describe('the field', () => {
  it('is written beside the old fields once there is a chord, and a reload brings it back', async () => {
    localStorage.setItem('music-theory-app', FROZEN);
    await useAppStore.persist.rehydrate();
    useAppStore.getState().setProgression(PROG);
    expect(saved()).toEqual({ state: { ...frozen().state, progression: PROG }, version: 6 });
    const written = raw();
    useAppStore.setState({ progression: undefined });
    localStorage.setItem('music-theory-app', written);
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().progression).toEqual(PROG);
  });
  it('an empty list is never written (tempo and beats stay in memory only)', async () => {
    localStorage.setItem('music-theory-app', FROZEN);
    await useAppStore.persist.rehydrate();
    useAppStore.getState().setProgression({ chords: [], bpm: 120, beats: 4 });
    expect(raw()).toBe(JSON.stringify(frozen()));
    expect(useAppStore.getState().progression).toEqual({ chords: [], bpm: 120, beats: 4 });
  });
  it('its symbols are the link\'s own, so they read back as the same chords', () => {
    for (const s of PROG.chords) {
      const c = readChords([s])[0];
      expect(chordLinkSymbol(c)).toBe(s);
    }
  });
});

describe('the guard', () => {
  const bad: unknown[] = [
    null, 'G D', [], { chords: [], bpm: 90, beats: 4 }, { chords: ['G'], bpm: 90 }, { chords: ['G'], bpm: 49, beats: 4 },
    { chords: ['G'], bpm: 201, beats: 4 }, { chords: ['G'], bpm: 90.5, beats: 4 }, { chords: ['G'], bpm: 90, beats: 3 },
    { chords: Array(17).fill('G'), bpm: 90, beats: 4 }, { chords: ['<script>'], bpm: 90, beats: 4 }, { chords: [7], bpm: 90, beats: 4 },
    { chords: ['G'.repeat(51)], bpm: 90, beats: 4 }, { chords: ['G'], bpm: 90, beats: 4, extra: 1 },
  ];
  for (const b of bad) {
    it(`drops ${JSON.stringify(b)?.slice(0, 60)}, keeps the rest`, () => {
      const state = { ...frozen().state, progression: b };
      expect(sanitizePersistedAppState(state)).toEqual(frozen().state);
      expect(invalidAppStateFields(state)).toEqual(['progression']);
    });
  }
  it('keeps a valid one as the same object (the backup check compares with Object.is)', () => {
    const p = { ...PROG };
    expect(sanitizeSavedProgression(p)).toBe(p);
    expect(sanitizePersistedAppState({ ...frozen().state, progression: p })!.progression).toBe(p);
    expect(invalidAppStateFields({ ...frozen().state, progression: p })).toEqual([]);
  });
  it('the backup carries it, and its check refuses a bad one', async () => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { ...frozen().state, progression: PROG }, version: 6 }));
    const backup = buildBackup(localStorage);
    expect((backup.data['music-theory-app'] as { state: Record<string, unknown> }).state.progression).toEqual(PROG);
    expect((await validateBackup(JSON.parse(JSON.stringify(backup)))).ok).toBe(true);
    const broken = JSON.parse(JSON.stringify(backup));
    broken.data['music-theory-app'].state.progression.bpm = 999;
    expect(await validateBackup(broken)).toMatchObject({ ok: false });
  });
});
