/**
 * W10-05 / decision D-03: the learner's own (teacher's) left-hand fingering
 * overrides the generated one, is kept locally, survives reloads, travels in
 * the backup file, and can be reset to the suggested fingering.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useFingeringStore, FINGERING_STORE_KEY, isValidFingeringKey } from '../fingeringStore';
import { fingeringKey } from '../../core/utils/guitarPositions';
import { BACKUP_KEYS, buildBackup, validateBackup, backupSections } from '../../utils/backupHelpers';
import errorBoundarySource from '../../components/ErrorBoundary.tsx?raw';

const K1 = fingeringKey('major', 'standard', 5, 0, 2, 9);
const K2 = fingeringKey('major', 'standard', 5, 0, 3, 5);
const K_OPEN = fingeringKey('natural_minor', 'drop-d', 0, 9, 1, 2);

const seed = (state: unknown, version = 1) =>
  localStorage.setItem(FINGERING_STORE_KEY, JSON.stringify({ state, version }));

beforeEach(() => {
  localStorage.clear();
  useFingeringStore.setState({ overrides: {}, labelMode: 'finger' });
});

describe('fingering overrides', () => {
  it('defaults: no overrides, finger labels', () => {
    const s = useFingeringStore.getState();
    expect(s.overrides).toEqual({});
    expect(s.labelMode).toBe('finger');
  });

  it('sets, replaces and clears an override', () => {
    const { setOverride } = useFingeringStore.getState();
    setOverride(K1, 3);
    expect(useFingeringStore.getState().overrides[K1]).toBe(3);
    setOverride(K1, 2);
    expect(useFingeringStore.getState().overrides[K1]).toBe(2);
    setOverride(K1, null);
    expect(K1 in useFingeringStore.getState().overrides).toBe(false);
  });

  it('"Reset to suggested" clears only the keys of the position on screen', () => {
    const { setOverride, clearOverrides } = useFingeringStore.getState();
    setOverride(K1, 3);
    setOverride(K2, 4);
    setOverride(K_OPEN, 1);
    clearOverrides([K1, K2]);
    expect(useFingeringStore.getState().overrides).toEqual({ [K_OPEN]: 1 });
  });

  it('ignores malformed keys and fingers instead of storing them', () => {
    const { setOverride } = useFingeringStore.getState();
    setOverride('not a key', 2);
    setOverride(K1, 7 as never);
    expect(useFingeringStore.getState().overrides).toEqual({});
  });

  it('label mode is a persisted preference', () => {
    useFingeringStore.getState().setLabelMode('degree');
    expect(useFingeringStore.getState().labelMode).toBe('degree');
    const blob = JSON.parse(localStorage.getItem(FINGERING_STORE_KEY) ?? '{}');
    expect(blob.state.labelMode).toBe('degree');
  });

  it('key validator accepts every key the engine makes and rejects junk', () => {
    expect(isValidFingeringKey(K1)).toBe(true);
    expect(isValidFingeringKey(K_OPEN)).toBe(true);
    expect(isValidFingeringKey(fingeringKey('locrian_natural2', 'half-step-down', 12, 11, 5, 11))).toBe(true);
    for (const bad of ['', 'major|standard|p5|2', 'mega|standard|p5|2|4', 'major|standard|p5|9|4', 'major|standard|q5|2|4', 'constructor|standard|p1|0|0']) {
      expect(isValidFingeringKey(bad)).toBe(false);
    }
  });
});

describe('persistence shape guard', () => {
  it('round-trips valid overrides through a reload', async () => {
    seed({ overrides: { [K1]: 2, [K_OPEN]: 4 }, labelMode: 'note' });
    await useFingeringStore.persist.rehydrate();
    const s = useFingeringStore.getState();
    expect(s.overrides).toEqual({ [K1]: 2, [K_OPEN]: 4 });
    expect(s.labelMode).toBe('note');
  });

  it('drops bad entries one by one and keeps the good ones', async () => {
    seed({ overrides: { [K1]: 2, [K2]: 9, junk: 1, [K_OPEN]: '3' }, labelMode: 'shout' });
    await useFingeringStore.persist.rehydrate();
    const s = useFingeringStore.getState();
    expect(s.overrides).toEqual({ [K1]: 2 });
    expect(s.labelMode).toBe('finger');
  });

  it('falls back to defaults when the blob is garbage', async () => {
    useFingeringStore.setState({ overrides: { [K1]: 3 } });
    seed('garbage');
    await useFingeringStore.persist.rehydrate();
    expect(useFingeringStore.getState().overrides).toEqual({});
  });
});

describe('backup and reset coverage', () => {
  it('the backup file includes the fingering store', async () => {
    expect(BACKUP_KEYS as readonly string[]).toContain(FINGERING_STORE_KEY);
    useFingeringStore.getState().setOverride(K1, 3);
    const backup = buildBackup(localStorage);
    expect(backup.data[FINGERING_STORE_KEY as keyof typeof backup.data]).toMatchObject({ state: { overrides: { [K1]: 3 } } });
    const validated = await validateBackup(JSON.parse(JSON.stringify(backup)));
    expect(validated.ok).toBe(true);
    if (validated.ok) expect(backupSections(validated.backup)).toContain('guitar fingerings');
  });

  it('"Reset app data" clears the fingering store too, via an inlined key literal (review #6)', () => {
    // Same pattern as the drill key: ErrorBoundary is eager and app-level, so
    // it carries the storage key as a literal instead of importing the store.
    expect(errorBoundarySource).toContain(`'${FINGERING_STORE_KEY}'`);
    expect(errorBoundarySource).toMatch(/localStorage\.removeItem\(FINGERING_STORE_KEY_LITERAL\)/);
    expect(errorBoundarySource).not.toMatch(/import[^;]*from\s+['"][./]*state\/fingeringStore/);
  });
});
