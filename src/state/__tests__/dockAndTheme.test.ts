/**
 * W11-A store additions: the instrument dock's per-view detent (persisted,
 * shape-guarded, `requestDock` API for later batches) and the Auto theme.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore, sanitizePersistedAppState, invalidAppStateFields } from '../store';
import { DEFAULT_DOCK_DETENTS, sanitizeDockDetents } from '../dock';
import { resolveTheme } from '../../hooks/useTheme';

beforeEach(() => {
  useAppStore.setState({ view: 'explore', dockDetents: { ...DEFAULT_DOCK_DETENTS }, themeMode: 'fermata' });
});

describe('dock detents', () => {
  it('defaults: Explore opens at Half, Learn at Peek (D-20: the lesson first)', () => {
    expect(DEFAULT_DOCK_DETENTS).toEqual({ explore: 'half', learn: 'peek' });
  });

  it('setDockDetent changes one view only', () => {
    useAppStore.getState().setDockDetent('learn', 'full');
    expect(useAppStore.getState().dockDetents).toEqual({ explore: 'half', learn: 'full' });
  });

  it('requestDock acts on the CURRENT view, and does nothing in Drill', () => {
    useAppStore.setState({ view: 'learn' });
    useAppStore.getState().requestDock('half');
    expect(useAppStore.getState().dockDetents.learn).toBe('half');
    useAppStore.setState({ view: 'drill' });
    const before = useAppStore.getState().dockDetents;
    useAppStore.getState().requestDock('full');
    expect(useAppStore.getState().dockDetents).toBe(before);
  });

  it('is persisted', () => {
    useAppStore.getState().setDockDetent('explore', 'full');
    const saved = JSON.parse(localStorage.getItem('music-theory-app')!);
    expect(saved.state.dockDetents).toEqual({ explore: 'full', learn: 'peek' });
  });

  it('a corrupted saved value falls back; a valid one keeps its identity (backup vetting uses Object.is)', () => {
    expect(sanitizeDockDetents({ explore: 'half', learn: 'tall' })).toBeNull();
    expect(sanitizeDockDetents({ explore: 'half', drill: 'peek' })).toBeNull();
    expect(sanitizeDockDetents('half')).toBeNull();
    expect(sanitizeDockDetents({ explore: 'full' })).toEqual({ explore: 'full', learn: 'peek' });

    const valid = { explore: 'full', learn: 'half' };
    expect(sanitizePersistedAppState({ dockDetents: valid })!.dockDetents).toBe(valid);
    expect('dockDetents' in sanitizePersistedAppState({ dockDetents: { explore: 9 } })!).toBe(false);
    expect(invalidAppStateFields({ dockDetents: valid })).toEqual([]);
    expect(invalidAppStateFields({ dockDetents: [1] })).toEqual(['dockDetents']);
  });
});

describe('Auto theme', () => {
  it('"auto" is a valid saved theme (and garbage is not)', () => {
    expect(sanitizePersistedAppState({ themeMode: 'auto' })!.themeMode).toBe('auto');
    expect('themeMode' in sanitizePersistedAppState({ themeMode: 'sepia' })!).toBe(false);
    expect(invalidAppStateFields({ themeMode: 'auto' })).toEqual([]);
  });

  it('resolves to night only when the system is dark', () => {
    expect(resolveTheme('auto', true)).toBe('fermata-night');
    expect(resolveTheme('auto', false)).toBe('fermata');
    expect(resolveTheme('fermata', true)).toBe('fermata');
    expect(resolveTheme('fermata-night', false)).toBe('fermata-night');
  });
});
