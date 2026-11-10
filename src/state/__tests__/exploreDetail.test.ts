/**
 * Explore's Simple / Full view (wave 1, brief C): the default rule, and the
 * saved choice as an OPTIONAL v6 field — a frozen, production-shaped v6 save
 * from before it rehydrates with every field unchanged and is written back
 * byte for byte; a saved choice survives; a bad one falls back to the rule.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppStore, sanitizePersistedAppState, invalidAppStateFields } from '../store';
import { resolveExploreDetail, useExploreDetail } from '../exploreDetail';
import { setLearnerProfile } from '../learnerProfile';

// Production-shaped v6 preferences (the shape main writes today).
const v6 = {
  selectedKey: { natural: 'E', accidental: 'b' }, selectedScale: 'dorian',
  instrument: 'guitar', guitarTuningId: 'drop-d', guitarScalePosition: 5,
  baseOctave: 3, colorMode: 'functional', scaleOctaves: 2, volume: 0.55,
  themeMode: 'fermata-night', language: 'pt', preferencesUpdatedAt: 1793700000000,
  lastView: 'explore', dockDetents: { explore: 'full', learn: 'peek' },
  dockChosen: { explore: true, learn: false }, exploreCircleOpen: true,
};

afterEach(() => {
  localStorage.clear();
  setLearnerProfile(null);
  useAppStore.setState({ exploreDetail: undefined });
});

describe('the default view', () => {
  it.each([
    [undefined, null, 'full'],
    [undefined, 'theory', 'full'],
    [undefined, 'new', 'simple'],
    [undefined, 'player', 'simple'],
    ['full', 'new', 'full'],
    ['simple', null, 'simple'],
    ['simple', 'theory', 'simple'],
  ] as const)('saved %s, profile %s → %s', (saved, profile, expected) => {
    expect(resolveExploreDetail(saved, profile)).toBe(expected);
  });

  it('the hook follows the profile until the learner chooses', () => {
    const { result } = renderHook(() => useExploreDetail());
    expect(result.current).toBe('full');
    act(() => setLearnerProfile('new'));
    expect(result.current).toBe('simple');
    act(() => useAppStore.getState().setExploreDetail('full'));
    expect(result.current).toBe('full');
  });
});

describe('the saved choice (persist v6, optional field)', () => {
  it('a frozen v6 save from before the field rehydrates unchanged and is written back exactly', async () => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: v6, version: 6 }));
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState()).toMatchObject(v6);
    expect(useAppStore.getState().exploreDetail).toBeUndefined();
    expect(sanitizePersistedAppState(v6)).toEqual(v6);
    // Force a write without changing a preference: no new key appears.
    useAppStore.setState({ instrument: 'guitar' });
    expect(JSON.parse(localStorage.getItem('music-theory-app')!)).toEqual({ state: v6, version: 6 });
  });

  it('a choice is saved and comes back after a reload, with every other field unchanged', async () => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: v6, version: 6 }));
    await useAppStore.persist.rehydrate();
    useAppStore.getState().setExploreDetail('simple');
    const saved = JSON.parse(localStorage.getItem('music-theory-app')!);
    expect(saved).toEqual({ state: { ...v6, exploreDetail: 'simple' }, version: 6 });
    // A reload: memory starts without it, the save still has it.
    useAppStore.setState({ exploreDetail: undefined });
    localStorage.setItem('music-theory-app', JSON.stringify(saved));
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().exploreDetail).toBe('simple');
    expect(useAppStore.getState()).toMatchObject(v6);
  });

  it('a bad value is dropped (the rule decides again); nothing else is touched', () => {
    expect(sanitizePersistedAppState({ ...v6, exploreDetail: 'medium' })).toEqual(v6);
    expect(invalidAppStateFields({ ...v6, exploreDetail: 'medium' })).toEqual(['exploreDetail']);
    expect(invalidAppStateFields({ ...v6, exploreDetail: 'full' })).toEqual([]);
  });
});
