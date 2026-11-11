/**
 * Wave 2's new saved fields, together (integration, 2026-11-10): each branch
 * proves its own; this proves they coexist. `music-theory-app` (persist stays
 * v6) gains `progression` (stream S) and `capoFret` (stream C); the drill
 * store (`fermata-drill-v1`, persist stays v3) gains `settings.followLessons`
 * (stream D). Every one is optional, written only when it says something,
 * guarded by the same check the load and the backup use, and carried in the
 * backup file.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useAppStore, sanitizePersistedAppState, invalidAppStateFields } from '../store';
import { useDrillStore, DEFAULT_SETTINGS, DRILL_STORE_KEY } from '../drillStore';
import { buildBackup, validateBackup } from '../../utils/backupHelpers';
import { generateDrillBank } from '../../core/utils/drillBank';

const WAVE2 = {
  progression: { chords: ['G', 'D', 'Em', 'C'], bpm: 96, beats: 2 },
  capoFret: 3,
} as const;
/** In the order the app writes them (partialize), as a real save from after wave 1 holds them. */
const WAVE1 = {
  learnerProfile: 'player', startHint: 'player', neckNutSide: 'left', neckTopString: 'high', exploreDetail: 'simple', showSolfege: true,
} as const;

const FROZEN = readFileSync(join(__dirname, 'fixtures', 'settings-v6-before-start.json'), 'utf8');
const frozen = () => JSON.parse(FROZEN) as { state: Record<string, unknown>; version: number };
const saved = () => localStorage.getItem('music-theory-app')!;
const savedState = () => (JSON.parse(saved()) as { state: Record<string, unknown> }).state;
const touch = () => useAppStore.setState({ volume: useAppStore.getState().volume });

beforeEach(() => localStorage.clear());
afterEach(() => {
  localStorage.clear();
  useAppStore.setState({ progression: undefined, capoFret: 0 });
});

describe('music-theory-app: progression and capoFret in one v6 save', () => {
  it('a production-shaped save from before wave 2 loads with every field unchanged and is written back byte for byte', async () => {
    localStorage.setItem('music-theory-app', FROZEN);
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().progression).toBeUndefined();
    expect(useAppStore.getState().capoFret).toBe(0);
    touch();
    expect(saved()).toBe(JSON.stringify(frozen()));
    for (const k of Object.keys(WAVE2)) expect(savedState()).not.toHaveProperty(k);
  });

  it('the same with wave 1\'s fields in it (a learner from after wave 1): byte for byte', async () => {
    const blob = JSON.stringify({ state: { ...frozen().state, ...WAVE1 }, version: 6 });
    localStorage.setItem('music-theory-app', blob);
    await useAppStore.persist.rehydrate();
    touch();
    expect(saved()).toBe(blob);
  });

  it('a save holding every wave-2 field (and wave 1\'s) round-trips; clearing them leaves the old save', async () => {
    const state = { ...frozen().state, ...WAVE1, ...WAVE2 };
    localStorage.setItem('music-theory-app', JSON.stringify({ state, version: 6 }));
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState()).toMatchObject({ ...WAVE2 });
    touch();
    expect(JSON.parse(saved())).toEqual({ state, version: 6 });
    // No chords and no capo: the fields leave the save, nothing else changes.
    useAppStore.setState({ progression: undefined, capoFret: 0 });
    expect(JSON.parse(saved())).toEqual({ state: { ...frozen().state, ...WAVE1 }, version: 6 });
  });

  it('one guard names every bad wave-2 field (beside wave 1\'s) and drops only them', () => {
    const bad = {
      ...frozen().state, ...WAVE1,
      progression: { chords: 'G,D', bpm: 96, beats: 2 }, capoFret: 12,
    };
    expect(invalidAppStateFields(bad)!.sort()).toEqual(['capoFret', 'progression']);
    expect(sanitizePersistedAppState(bad)).toEqual({ ...frozen().state, ...WAVE1 });
    for (const [field, value] of [
      ['progression', { chords: [], bpm: 96, beats: 2 }], ['progression', { chords: ['G'], bpm: 20, beats: 2 }],
      ['progression', { chords: ['G'], bpm: 96, beats: 3 }], ['capoFret', 2.5], ['capoFret', -1], ['capoFret', '3'],
    ] as const) {
      expect(invalidAppStateFields({ ...frozen().state, [field]: value }), `${field} ${JSON.stringify(value)}`).toEqual([field]);
    }
    expect(invalidAppStateFields({ ...frozen().state, ...WAVE1, ...WAVE2 })).toEqual([]);
  });

  it('the backup carries both and its check refuses a bad one', async () => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { ...frozen().state, ...WAVE2 }, version: 6 }));
    const backup = buildBackup(localStorage);
    expect((backup.data['music-theory-app'] as { state: Record<string, unknown> }).state).toMatchObject(WAVE2);
    expect((await validateBackup(JSON.parse(JSON.stringify(backup)))).ok).toBe(true);
    for (const breakIt of [
      (s: Record<string, unknown>) => { s.capoFret = 10; },
      (s: Record<string, unknown>) => { s.progression = { chords: ['G'], bpm: 'fast', beats: 4 }; },
    ]) {
      const broken = JSON.parse(JSON.stringify(backup));
      breakIt(broken.data['music-theory-app'].state);
      expect(await validateBackup(broken)).toMatchObject({ ok: false });
    }
  });
});

describe('fermata-drill-v1: followLessons', () => {
  const BANK = generateDrillBank({ includeRead: true });
  const resetDrill = () => useDrillStore.setState({
    items: {}, settings: DEFAULT_SETTINGS, sprintBests: {}, lifetime: { answered: 0, correct: 0 }, activeSession: null, sprint: null, introDone: false,
  });
  beforeEach(resetDrill);

  for (const name of ['drill-v2-store.json', 'drill-v3-before-reading.json']) {
    it(`${name}: written back without followLessons (an owner-like session: his derived value is off)`, async () => {
      const blob = readFileSync(join(__dirname, 'fixtures', name), 'utf8');
      localStorage.setItem(DRILL_STORE_KEY, blob);
      await useDrillStore.persist.rehydrate();
      useDrillStore.getState().startSession(BANK, Date.UTC(2026, 10, 10, 9), { followLessons: false, unlocked: null });
      const after = JSON.parse(localStorage.getItem(DRILL_STORE_KEY)!) as { state: { settings: Record<string, unknown> }; version: number };
      expect(after.version).toBe(3);
      expect(after.state.settings).not.toHaveProperty('followLessons');
      const before = (JSON.parse(blob) as { state: { settings: { families: Record<string, boolean> } } }).state.settings;
      // Exactly the saved settings (plus the reading toggle older saves gain, as before wave 2).
      expect(after.state.settings).toEqual({ ...before, families: { ...before.families, read: before.families.read ?? true } });
    });
  }

  it('a drill save holding followLessons round-trips and travels in the backup with the app save', async () => {
    useDrillStore.getState().updateSettings({ followLessons: true });
    const drill = JSON.parse(localStorage.getItem(DRILL_STORE_KEY)!) as { state: { settings: Record<string, unknown> } };
    expect(drill.state.settings.followLessons).toBe(true);
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { ...frozen().state, ...WAVE2 }, version: 6 }));
    const backup = buildBackup(localStorage);
    expect((backup.data[DRILL_STORE_KEY] as { state: { settings: Record<string, unknown> } }).state.settings.followLessons).toBe(true);
    expect((await validateBackup(JSON.parse(JSON.stringify(backup)))).ok).toBe(true);
    resetDrill();
    localStorage.setItem(DRILL_STORE_KEY, JSON.stringify(drill));
    await useDrillStore.persist.rehydrate();
    expect(useDrillStore.getState().settings.followLessons).toBe(true);
  });
});
