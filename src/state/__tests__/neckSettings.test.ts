/**
 * Brief D (2026-11-10): the guitar neck's two saved settings.
 *  - A browser with NO saved settings draws the neck as tab and chord charts
 *    do: nut LEFT, thin string on top ('left' + 'high').
 *  - A saved-settings object that exists but lacks the fields is a learner
 *    from before the switch — the owner, months of data — and keeps today's
 *    view ('right' + 'low'). That view is saved by leaving the field out, so
 *    such a learner's save is written back byte for byte as it was.
 * Persist stays at version 6; no migration step.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

const KEY = 'music-theory-app';

/** A production-shaped v6 save from before the neck fields (every field the
 *  save held on main, 9fa5300), frozen. */
const FROZEN_V6 = Object.freeze({
  selectedKey: { natural: 'F', accidental: '#' },
  selectedScale: 'harmonic_minor',
  instrument: 'guitar',
  guitarTuningId: 'drop-d',
  guitarScalePosition: 7,
  baseOctave: 3,
  colorMode: 'functional',
  scaleOctaves: 2,
  volume: 0.4,
  themeMode: 'fermata-night',
  language: 'pt',
  preferencesUpdatedAt: 1793700000000,
  lastView: 'explore',
  dockDetents: { explore: 'half', learn: 'peek' },
  dockChosen: { explore: true, learn: false },
  exploreCircleOpen: true,
});
const FROZEN_RAW = JSON.stringify({ state: FROZEN_V6, version: 6 });

/** A fresh page: the store module evaluates against what storage holds now. */
async function boot(saved: string | null) {
  localStorage.clear();
  if (saved !== null) localStorage.setItem(KEY, saved);
  vi.resetModules();
  return (await import('../store')).useAppStore;
}

afterEach(() => localStorage.clear());

describe('guitar neck defaults', () => {
  it('a browser with no saved settings gets the tab / chord-chart view, and saves it', async () => {
    const store = await boot(null);
    expect(store.getState().neckNutSide).toBe('left');
    expect(store.getState().neckTopString).toBe('high');
    store.getState().setView('explore'); // boot writes the save (as App does)
    const saved = JSON.parse(localStorage.getItem(KEY)!);
    expect(saved.version).toBe(6);
    expect(saved.state).toMatchObject({ neckNutSide: 'left', neckTopString: 'high' });
    // …and a reload keeps it.
    const again = await boot(localStorage.getItem(KEY));
    expect(again.getState()).toMatchObject({ neckNutSide: 'left', neckTopString: 'high' });
  });

  it('a frozen production v6 save without the fields keeps today\'s view, every field unchanged, and is written back exactly', async () => {
    const store = await boot(FROZEN_RAW);
    const s = store.getState();
    expect(s.neckNutSide).toBe('right');
    expect(s.neckTopString).toBe('low');
    expect(s).toMatchObject(FROZEN_V6);
    // The real persist serializer, without changing a preference.
    store.setState({ guitarTuningId: 'drop-d' });
    expect(localStorage.getItem(KEY)).toBe(FROZEN_RAW);
    // A reload (and another) stays on the old view.
    const again = await boot(localStorage.getItem(KEY));
    expect(again.getState()).toMatchObject({ ...FROZEN_V6, neckNutSide: 'right', neckTopString: 'low' });
  });

  it('a save from before v6 (migrated) is a learner from before the switch too', async () => {
    const store = await boot(JSON.stringify({ state: { themeMode: 'dark', instrument: 'guitar' }, version: 4 }));
    expect(store.getState()).toMatchObject({ neckNutSide: 'right', neckTopString: 'low', themeMode: 'fermata-night' });
  });

  it('an empty settings object (exists, no fields) is the old view', async () => {
    const store = await boot(JSON.stringify({ state: {}, version: 6 }));
    expect(store.getState()).toMatchObject({ neckNutSide: 'right', neckTopString: 'low' });
  });

  it.each([
    ['left', 'high'],
    ['left', 'low'],
    ['right', 'high'],
    ['right', 'low'],
  ] as const)('the choice %s + %s survives a reload; only a non-legacy value is written', async (nut, top) => {
    const store = await boot(FROZEN_RAW);
    store.getState().setNeckNutSide(nut);
    store.getState().setNeckTopString(top);
    const saved = JSON.parse(localStorage.getItem(KEY)!).state;
    expect('neckNutSide' in saved).toBe(nut !== 'right');
    expect('neckTopString' in saved).toBe(top !== 'low');
    // Every existing field is untouched by the neck choice.
    const { preferencesUpdatedAt: _p, ...rest } = saved;
    const { preferencesUpdatedAt: _q, ...frozenRest } = FROZEN_V6;
    expect(rest).toEqual({ ...frozenRest, ...(nut !== 'right' ? { neckNutSide: nut } : {}), ...(top !== 'low' ? { neckTopString: top } : {}) });
    const again = await boot(localStorage.getItem(KEY));
    expect(again.getState()).toMatchObject({ neckNutSide: nut, neckTopString: top });
  });

  it('a bad value falls back to the old view (the save exists); the backup vetting flags it', async () => {
    const store = await boot(JSON.stringify({ state: { ...FROZEN_V6, neckNutSide: 'up', neckTopString: 7 }, version: 6 }));
    expect(store.getState()).toMatchObject({ ...FROZEN_V6, neckNutSide: 'right', neckTopString: 'low' });
    const { invalidAppStateFields, sanitizePersistedAppState } = await import('../store');
    expect(invalidAppStateFields({ ...FROZEN_V6, neckNutSide: 'up', neckTopString: 7 })).toEqual(['neckNutSide', 'neckTopString']);
    expect(invalidAppStateFields({ ...FROZEN_V6, neckNutSide: 'left', neckTopString: 'high' })).toEqual([]);
    expect(sanitizePersistedAppState(FROZEN_V6)).toEqual(FROZEN_V6);
  });

  it('the setters mark the preferences as changed', async () => {
    const store = await boot(FROZEN_RAW);
    store.getState().setNeckNutSide('left');
    expect(store.getState().preferencesUpdatedAt).toBeGreaterThan(FROZEN_V6.preferencesUpdatedAt);
  });
});
