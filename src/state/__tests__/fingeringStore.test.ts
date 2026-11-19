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
import { GUITAR_TUNINGS } from '../../core/constants/guitarTunings';
import { SCALE_FORMULAS } from '../../core/constants/scales';

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
    if (validated.ok) expect(backupSections(validated.backup)).toContain('guitarFingerings');
  });

  it('"Reset app data" clears the fingering store too, via an inlined key literal (review #6)', () => {
    // Same pattern as the drill key: ErrorBoundary is eager and app-level, so
    // it carries the storage key as a literal instead of importing the store.
    expect(errorBoundarySource).toContain(`'${FINGERING_STORE_KEY}'`);
    expect(errorBoundarySource).toMatch(/localStorage\.removeItem\(FINGERING_STORE_KEY_LITERAL\)/);
    expect(errorBoundarySource).not.toMatch(/import[^;]*from\s+['"][./]*state\/fingeringStore/);
  });
});

describe('additive route namespace, unchanged production v1 shape', () => {
  const routeKey = 'route:1|standard|Bb|major|scale|2|0|1|1';
  it('loads the old production-shaped envelope without losing a position or preference', async () => {
    // Same version/shape as existing installed saves; no route field is needed.
    seed({ overrides: { 'major|standard|p5|2|4': 3, 'natural_minor|drop-d|open9|1|2': 4 }, labelMode: 'degree' });
    await useFingeringStore.persist.rehydrate();
    expect(useFingeringStore.getState().overrides).toEqual({ 'major|standard|p5|2|4': 3, 'natural_minor|drop-d|open9|1|2': 4 });
    expect(useFingeringStore.getState().labelMode).toBe('degree');
    useFingeringStore.getState().setOverride(routeKey, 2);
    await useFingeringStore.persist.rehydrate();
    expect(useFingeringStore.getState().overrides[routeKey]).toBe(2);
    useFingeringStore.getState().clearOverrides([routeKey]);
    expect(useFingeringStore.getState().overrides['major|standard|p5|2|4']).toBe(3);
    expect(JSON.parse(localStorage.getItem(FINGERING_STORE_KEY)!).version).toBe(1);
  });
  it('guards route entries individually on load and carries them through backup validation', async () => {
    seed({ overrides: { [K1]: 3, [routeKey]: 2, [routeKey.replace('|1|1', '|9|99')]: 4 }, labelMode: 'note' });
    await useFingeringStore.persist.rehydrate();
    expect(useFingeringStore.getState().overrides).toEqual({ [K1]: 3, [routeKey]: 2 });
    // Rehydration sanitizes memory; the next legitimate edit writes that clean state.
    useFingeringStore.getState().setOverride(routeKey, 2);
    const result = await validateBackup(buildBackup(localStorage));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.backup.data[FINGERING_STORE_KEY]).toMatchObject({ state: { overrides: { [K1]: 3, [routeKey]: 2 } } });
  });
});

describe('the Position walk\'s keys (music audit 2, M38) in the same v1 save', () => {
  // Release 16 refused these keys, so a teacher's walk finger was never stored.
  const walkKey = 'route:1|standard|C|major|position-walk|2|0|1|3';
  // A save as release 16 writes it: positions, route fingers, and one the editor now calls impossible (M37:
  // finger 3 on the E of C major's first 3rds pair, while the C holds it at another fret) — kept as saved.
  const FROZEN = JSON.stringify({ state: { overrides: {
    'major|standard|p5|2|4': 3, 'natural_minor|drop-d|open9|1|2': 4,
    'route:1|standard|Bb|major|scale|2|0|1|1': 2, 'route:1|standard|C|major|thirds-together|1|0|2|2': 3,
  }, labelMode: 'degree' }, version: 1 });

  it('the walk route is accepted, the other route ids as before, and anything else still refused', () => {
    expect(isValidFingeringKey(walkKey)).toBe(true);
    expect(isValidFingeringKey('route:1|standard|C|major|scale|2|0|1|3')).toBe(true);
    expect(isValidFingeringKey('route:1|standard|C|major|brokenChord-upper|1|0|1|3')).toBe(true);
    for (const bad of ['position-walk-together', 'positionwalk', 'position-walks', 'walk', 'p-i-m-a']) {
      expect(isValidFingeringKey(walkKey.replace('position-walk', bad))).toBe(false);
    }
    useFingeringStore.getState().setOverride(walkKey, 3);
    expect(useFingeringStore.getState().overrides).toEqual({ [walkKey]: 3 });
  });

  it('a production-shaped save from release 16 loads unchanged, every override kept, and is written back byte for byte', async () => {
    localStorage.setItem(FINGERING_STORE_KEY, FROZEN);
    await useFingeringStore.persist.rehydrate();
    expect(useFingeringStore.getState().overrides).toEqual(JSON.parse(FROZEN).state.overrides);
    useFingeringStore.setState({ labelMode: useFingeringStore.getState().labelMode });
    expect(localStorage.getItem(FINGERING_STORE_KEY)).toBe(FROZEN);
  });

  it('a walk finger added to it is one more key; Reset takes exactly it out again, byte for byte', async () => {
    localStorage.setItem(FINGERING_STORE_KEY, FROZEN);
    await useFingeringStore.persist.rehydrate();
    useFingeringStore.getState().setOverride(walkKey, 3);
    const withWalk = JSON.parse(localStorage.getItem(FINGERING_STORE_KEY)!);
    expect(withWalk).toEqual({ state: { overrides: { ...JSON.parse(FROZEN).state.overrides, [walkKey]: 3 }, labelMode: 'degree' }, version: 1 });
    await useFingeringStore.persist.rehydrate();
    expect(useFingeringStore.getState().overrides[walkKey]).toBe(3);
    useFingeringStore.getState().clearOverrides([walkKey]);
    expect(localStorage.getItem(FINGERING_STORE_KEY)).toBe(FROZEN);
  });
});

describe('the route key\'s guard, one field at a time (the review of 19 November 2026)', () => {
  // A real key (C major's walk, step 1): each field is varied alone, over what the routes produce (the review's
  // census of 1,276,332 real keys: string 0-5, fret 1-15, octaves 1-3, 14 route ids, event index up to 91), then
  // just outside it.
  const REAL = ['route:1', 'standard', 'C', 'major', 'position-walk', '2', '0', '1', '3'];
  const withField = (i: number, v: string) => REAL.map((x, j) => (j === i ? v : x)).join('|');
  const ROUTE_IDS = ['scale', 'position-walk', 'tonicArpeggio', 'dominantSeventh', 'diminishedSeventh', 'thirds-broken', 'thirds-together',
    'sixths-broken', 'sixths-together', 'octaves-broken', 'octaves-together', 'chromatic', 'brokenChord', 'brokenChord-upper'];
  const accepts = (i: number, values: readonly string[]) => expect(values.filter((v) => !isValidFingeringKey(withField(i, v)))).toEqual([]);
  const refuses = (i: number, values: readonly string[]) => expect(values.filter((v) => isValidFingeringKey(withField(i, v)))).toEqual([]);

  it('the real key itself, and nine fields exactly', () => {
    expect(isValidFingeringKey(REAL.join('|'))).toBe(true);
    expect(isValidFingeringKey(REAL.slice(0, 8).join('|'))).toBe(false);
    expect(isValidFingeringKey([...REAL, '0'].join('|'))).toBe(false);
  });
  it('version: route:1 only', () => { accepts(0, ['route:1']); refuses(0, ['route:0', 'route:2', 'route:', 'route']); });
  it('tuning: the seven tunings; not a label', () => { accepts(1, GUITAR_TUNINGS.map((t) => t.id)); refuses(1, ['Standard', 'drop d', '', 'x'.repeat(33)]); });
  it('root: the 21 spellings; nothing else', () => {
    accepts(2, ['C', 'D', 'E', 'F', 'G', 'A', 'B'].flatMap((l) => [l, `${l}#`, `${l}b`]));
    refuses(2, ['H', 'c', 'C#b', 'Cx', '']);
  });
  it('scale: the 37 scale types; an unknown one refused', () => {
    accepts(3, Object.keys(SCALE_FORMULAS));
    expect(Object.keys(SCALE_FORMULAS)).toHaveLength(37);
    refuses(3, ['mega', 'constructor', 'Major', '']);
  });
  it('route id: the 14 the editor offers; the right-hand patterns and near misses refused', () => {
    accepts(4, ROUTE_IDS);
    refuses(4, ['walk', 'positionwalk', 'position_walk', 'position-walks', 'position-walk-together', 'p-i-m-a', 'p+a-i-m-i', 'Scale', '']);
  });
  it('octaves: 1 to 3; 0 and 4 refused', () => { accepts(5, ['1', '2', '3']); refuses(5, ['0', '4', '12', '']); });
  it('event index: 0 to 91 (and up to 999); four digits or a sign refused', () => {
    accepts(6, Array.from({ length: 92 }, (_, k) => String(k)));
    accepts(6, ['999']);
    refuses(6, ['1000', '-1', '', '1.5']);
  });
  it('string: 0 to 5; 6 and -1 refused', () => { accepts(7, ['0', '1', '2', '3', '4', '5']); refuses(7, ['6', '-1', '']); });
  it('fret: 1 to 15 (no route keys an open string); 0 and 16 refused', () => {
    accepts(8, Array.from({ length: 15 }, (_, k) => String(k + 1)));
    refuses(8, ['0', '16', '19', '99', '-1', '']);
  });
});
