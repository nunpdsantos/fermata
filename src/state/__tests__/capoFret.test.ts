/**
 * The capo as a saved setting (wave 2, stream C): ONE optional field,
 * `capoFret`, in the v6 save, written only while a capo is on (1–9), guarded
 * on load and in the backup check. A frozen, production-shaped v6 save from
 * before it rehydrates with every field unchanged and is written back byte
 * for byte; persist stays v6.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useAppStore, sanitizePersistedAppState, invalidAppStateFields } from '../store';
import { MAX_CAPO_FRET, getCapoFret, setCapoFret } from '../capo';
import { buildBackup, validateBackup } from '../../utils/backupHelpers';

const FROZEN = readFileSync(join(__dirname, 'fixtures', 'settings-v6-before-start.json'), 'utf8');
const frozen = () => JSON.parse(FROZEN) as { state: Record<string, unknown>; version: number };
const raw = () => localStorage.getItem('music-theory-app')!;
const saved = () => JSON.parse(raw()) as { state: Record<string, unknown>; version: number };

beforeEach(() => {
  localStorage.clear();
  useAppStore.setState({ capoFret: 0 });
});
afterEach(() => {
  useAppStore.setState({ capoFret: 0 });
  localStorage.clear();
});

describe('capoFret in the v6 save', () => {
  it('a frozen v6 save rehydrates with every field unchanged, no capo, and is written back byte for byte', async () => {
    localStorage.setItem('music-theory-app', FROZEN);
    await useAppStore.persist.rehydrate();
    expect(getCapoFret()).toBe(0);
    for (const [k, v] of Object.entries(frozen().state)) expect(useAppStore.getState()[k as keyof ReturnType<typeof useAppStore.getState>], k).toEqual(v);
    useAppStore.setState({ volume: useAppStore.getState().volume });
    expect(raw()).toBe(JSON.stringify(frozen()));
    expect(saved().version).toBe(6);
    // partialize writes exactly the frozen save's keys while no capo is on.
    const keys = Object.keys(useAppStore.persist.getOptions().partialize!(useAppStore.getState()) as object);
    expect(keys).toEqual(Object.keys(frozen().state));
  });

  it('a capo is saved as one field after the others, restored on reload, and leaves the save when taken off', async () => {
    localStorage.setItem('music-theory-app', FROZEN);
    await useAppStore.persist.rehydrate();
    setCapoFret(3);
    expect(saved().state.capoFret).toBe(3);
    const { capoFret, preferencesUpdatedAt, ...rest } = saved().state;
    void capoFret; void preferencesUpdatedAt;
    const { preferencesUpdatedAt: _p, ...frozenRest } = frozen().state;
    void _p;
    expect(rest).toEqual(frozenRest);
    expect(Object.keys(saved().state).at(-1)).toBe('capoFret');

    // A reload: memory forgets, the save is read again.
    const withCapo = raw();
    useAppStore.setState({ capoFret: 0 });
    localStorage.setItem('music-theory-app', withCapo);
    await useAppStore.persist.rehydrate();
    expect(getCapoFret()).toBe(3);

    setCapoFret(0);
    expect(saved().state).not.toHaveProperty('capoFret');
    expect(Object.keys(saved().state)).toEqual(Object.keys(frozen().state));
  });

  it('setCapoFret brings anything into 0 … 9 and rounds fractions', () => {
    setCapoFret(12); expect(getCapoFret()).toBe(MAX_CAPO_FRET);
    setCapoFret(-2); expect(getCapoFret()).toBe(0);
    setCapoFret(2.6); expect(getCapoFret()).toBe(3);
    setCapoFret(Number.NaN); expect(getCapoFret()).toBe(0);
  });

  it('the guard: 0 … 9 whole numbers pass, anything else is named and dropped, the rest survive', () => {
    for (const fret of [0, 1, 5, 9]) {
      expect(invalidAppStateFields({ ...frozen().state, capoFret: fret })).toEqual([]);
      expect(sanitizePersistedAppState({ ...frozen().state, capoFret: fret })!.capoFret).toBe(fret);
    }
    for (const bad of [10, -1, 2.5, '3', null, true]) {
      expect(invalidAppStateFields({ ...frozen().state, capoFret: bad }), String(bad)).toEqual(['capoFret']);
      expect(sanitizePersistedAppState({ ...frozen().state, capoFret: bad })).toEqual(frozen().state);
    }
  });

  it('the guard allows exactly what setCapoFret can set (MAX_CAPO_FRET in step)', () => {
    expect(invalidAppStateFields({ capoFret: MAX_CAPO_FRET })).toEqual([]);
    expect(invalidAppStateFields({ capoFret: MAX_CAPO_FRET + 1 })).toEqual(['capoFret']);
  });

  it('a bad saved capo loads as no capo; the backup carries a good one and refuses a bad one', async () => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { ...frozen().state, capoFret: 'x' }, version: 6 }));
    await useAppStore.persist.rehydrate();
    expect(getCapoFret()).toBe(0);

    localStorage.setItem('music-theory-app', JSON.stringify({ state: { ...frozen().state, capoFret: 4 }, version: 6 }));
    const backup = buildBackup(localStorage);
    expect((backup.data['music-theory-app'] as { state: Record<string, unknown> }).state.capoFret).toBe(4);
    expect((await validateBackup(JSON.parse(JSON.stringify(backup)))).ok).toBe(true);
    const broken = JSON.parse(JSON.stringify(backup));
    broken.data['music-theory-app'].state.capoFret = 11;
    expect(await validateBackup(broken)).toMatchObject({ ok: false });
  });

  it('switching to the piano leaves the capo as it is', () => {
    setCapoFret(5);
    useAppStore.getState().setInstrument('piano');
    expect(getCapoFret()).toBe(5);
    useAppStore.getState().setInstrument('guitar');
    expect(getCapoFret()).toBe(5);
  });
});
