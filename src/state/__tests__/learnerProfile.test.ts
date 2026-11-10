/**
 * The learner profile (state/learnerProfile.ts, wave 1) is saved with the
 * preferences (`music-theory-app`, persist v6, no version bump). A save from
 * before the start screen — frozen here, production-shaped — rehydrates with
 * the profile null and every other field unchanged, and is written back
 * unchanged; once set, the profile (and an owed start hint) is saved, guarded
 * and carried in the backup file.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useAppStore, sanitizePersistedAppState, invalidAppStateFields } from '../store';
import {
  useLearnerProfile, getLearnerProfile, setLearnerProfile, isGuidedProfile, type LearnerProfile,
} from '../learnerProfile';
import { buildBackup, validateBackup } from '../../utils/backupHelpers';
import { renderHook, act } from '@testing-library/react';

const FROZEN = readFileSync(join(__dirname, 'fixtures', 'settings-v6-before-start.json'), 'utf8');
const frozen = () => JSON.parse(FROZEN) as { state: Record<string, unknown>; version: number };
const saved = () => JSON.parse(localStorage.getItem('music-theory-app')!) as { state: Record<string, unknown>; version: number };

beforeEach(async () => {
  localStorage.clear();
  localStorage.setItem('music-theory-app', FROZEN);
  useAppStore.setState({ learnerProfile: null, startHint: null });
  localStorage.setItem('music-theory-app', FROZEN);
  await useAppStore.persist.rehydrate();
});
afterEach(() => localStorage.clear());

describe('a save from before the start screen (frozen v6)', () => {
  it('the fixture is a full v6 save of today\'s fields — a known positive for the checks below', () => {
    const keys = Object.keys(useAppStore.persist.getOptions().partialize!(useAppStore.getState()) as object);
    expect(new Set(Object.keys(frozen().state))).toEqual(new Set(keys));
    expect(frozen().version).toBe(6);
    expect(useAppStore.persist.getOptions().version).toBe(6);
  });

  it('rehydrates every field unchanged; the profile is null (never asked) and there is no hint', () => {
    expect(useAppStore.getState()).toMatchObject(frozen().state);
    expect(getLearnerProfile()).toBeNull();
    expect(useAppStore.getState().startHint).toBeNull();
    const { result } = renderHook(() => useLearnerProfile());
    expect(result.current).toBeNull();
    expect(sanitizePersistedAppState(frozen().state)).toEqual(frozen().state);
  });

  it('is written back exactly as it was (no new field appears while the profile is null)', () => {
    // Force the real persist serializer without changing a preference.
    useAppStore.setState({ instrument: useAppStore.getState().instrument });
    expect(saved()).toEqual(frozen());
  });
});

describe('once set', () => {
  it.each(['new', 'player', 'theory'] as const)('%s is saved beside the other fields, which stay unchanged, and survives a reload', async (p) => {
    setLearnerProfile(p);
    const after = saved();
    expect(after.version).toBe(6);
    expect(after.state.learnerProfile).toBe(p);
    const { learnerProfile: _p, preferencesUpdatedAt: _t, ...rest } = after.state;
    const { preferencesUpdatedAt: _t0, ...before } = frozen().state;
    expect(rest).toEqual(before);

    useAppStore.setState({ learnerProfile: null });
    localStorage.setItem('music-theory-app', JSON.stringify(after));
    await useAppStore.persist.rehydrate();
    expect(getLearnerProfile()).toBe(p);
  });

  it('back to null removes the field again', () => {
    setLearnerProfile('new');
    setLearnerProfile(null);
    expect(saved().state).not.toHaveProperty('learnerProfile');
  });

  it('an owed start hint is saved only while owed', () => {
    useAppStore.setState({ startHint: 'player' });
    expect(saved().state.startHint).toBe('player');
    useAppStore.setState({ startHint: null });
    expect(saved().state).not.toHaveProperty('startHint');
  });

  it('the hook follows changes', () => {
    const { result } = renderHook(() => useLearnerProfile());
    act(() => setLearnerProfile('player'));
    expect(result.current).toBe('player');
  });
});

describe('shape guard and backups', () => {
  it('a bad profile or hint falls back to null without touching the rest', () => {
    for (const bad of ['expert', 1, true, {}, '']) {
      const s = sanitizePersistedAppState({ ...frozen().state, learnerProfile: bad, startHint: bad });
      expect(s).not.toHaveProperty('learnerProfile');
      expect(s).not.toHaveProperty('startHint');
      expect(s).toEqual(frozen().state);
    }
    // 'theory' is a profile, never a hint.
    expect(sanitizePersistedAppState({ startHint: 'theory' })).not.toHaveProperty('startHint');
    for (const ok of ['new', 'player', 'theory', null] as (LearnerProfile | null)[]) {
      expect(sanitizePersistedAppState({ learnerProfile: ok })).toEqual({ learnerProfile: ok });
    }
  });

  it('a corrupted saved profile is dropped on rehydrate (the default, null, stays), the other fields kept', async () => {
    const corrupt = JSON.stringify({ state: { ...frozen().state, learnerProfile: 'wizard', startHint: 'theory' }, version: 6 });
    localStorage.setItem('music-theory-app', corrupt);
    await useAppStore.persist.rehydrate();
    expect(getLearnerProfile()).toBeNull();
    expect(useAppStore.getState().startHint).toBeNull();
    expect(useAppStore.getState()).toMatchObject(frozen().state);
    // Known positive: the same save with a GOOD profile does load it.
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { ...frozen().state, learnerProfile: 'player' }, version: 6 }));
    await useAppStore.persist.rehydrate();
    expect(getLearnerProfile()).toBe('player');
  });

  it('the profile travels in the backup file, and a backup with a bad one is refused', async () => {
    setLearnerProfile('player');
    const backup = buildBackup(localStorage);
    expect(backup.data['music-theory-app']?.state).toMatchObject({ learnerProfile: 'player' });
    expect((await validateBackup(backup)).ok).toBe(true);
    expect(invalidAppStateFields({ ...frozen().state, learnerProfile: 'player' })).toEqual([]);
    const bad = { ...backup, data: { 'music-theory-app': { state: { ...frozen().state, learnerProfile: 'wizard' }, version: 6 } } };
    expect(invalidAppStateFields(bad.data['music-theory-app'].state)).toEqual(['learnerProfile']);
    expect((await validateBackup(bad)).ok).toBe(false);
  });
});

describe('isGuidedProfile', () => {
  it('only new and player; null reads as theory', () => {
    expect([null, 'new', 'player', 'theory'].map((p) => isGuidedProfile(p as LearnerProfile | null))).toEqual([false, true, true, false]);
  });
});
