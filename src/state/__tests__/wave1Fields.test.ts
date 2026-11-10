/**
 * Wave 1's six new settings, together (integration, 2026-11-10): each branch
 * proves its own field; this proves they coexist in ONE v6 save. Every field
 * is optional, saved only when it says something (absent = the old app), goes
 * through the same guard (`sanitizePersistedAppState`, used on load and by
 * the backup check), and travels in the backup file.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useAppStore, sanitizePersistedAppState, invalidAppStateFields } from '../store';
import { buildBackup, validateBackup } from '../../utils/backupHelpers';

const NEW_FIELDS = {
  learnerProfile: 'player',
  startHint: 'player',
  exploreDetail: 'simple',
  neckNutSide: 'left',
  neckTopString: 'high',
  showSolfege: true,
} as const;

const FROZEN = readFileSync(join(__dirname, 'fixtures', 'settings-v6-before-start.json'), 'utf8');
const frozen = () => JSON.parse(FROZEN) as { state: Record<string, unknown>; version: number };
const saved = () => JSON.parse(localStorage.getItem('music-theory-app')!) as { state: Record<string, unknown>; version: number };

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

describe('the six wave-1 fields in one v6 save', () => {
  it('a save from before wave 1 is written back with none of them (persist stays v6)', async () => {
    localStorage.setItem('music-theory-app', FROZEN);
    await useAppStore.persist.rehydrate();
    useAppStore.setState({ volume: useAppStore.getState().volume });
    expect(saved()).toEqual(frozen());
    for (const k of Object.keys(NEW_FIELDS)) expect(saved().state).not.toHaveProperty(k);
    expect(useAppStore.getState()).toMatchObject({
      learnerProfile: null, startHint: null, neckNutSide: 'right', neckTopString: 'low', showSolfege: false,
    });
    expect(useAppStore.getState().exploreDetail).toBeUndefined();
  });

  it('all six set: saved beside the old fields, which stay unchanged, and restored by a reload', async () => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { ...frozen().state, ...NEW_FIELDS }, version: 6 }));
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState()).toMatchObject(NEW_FIELDS);
    useAppStore.setState({ volume: useAppStore.getState().volume });
    expect(saved()).toEqual({ state: { ...frozen().state, ...NEW_FIELDS }, version: 6 });
  });

  it('one guard for all six: every bad value is named and dropped, the rest survive', () => {
    const bad = { ...frozen().state, learnerProfile: 'expert', startHint: 'theory', exploreDetail: 'medium', neckNutSide: 'up', neckTopString: 7, showSolfege: 'yes' };
    expect(invalidAppStateFields(bad)!.sort()).toEqual(['exploreDetail', 'learnerProfile', 'neckNutSide', 'neckTopString', 'showSolfege', 'startHint']);
    expect(sanitizePersistedAppState(bad)).toEqual(frozen().state);
    expect(invalidAppStateFields({ ...frozen().state, ...NEW_FIELDS })).toEqual([]);
  });

  it('the backup carries all six and its check refuses a bad one', async () => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { ...frozen().state, ...NEW_FIELDS }, version: 6 }));
    const backup = buildBackup(localStorage);
    expect((backup.data['music-theory-app'] as { state: Record<string, unknown> }).state).toMatchObject(NEW_FIELDS);
    expect((await validateBackup(JSON.parse(JSON.stringify(backup)))).ok).toBe(true);
    const broken = JSON.parse(JSON.stringify(backup));
    broken.data['music-theory-app'].state.neckNutSide = 'up';
    expect(await validateBackup(broken)).toMatchObject({ ok: false });
  });
});
