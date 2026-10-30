/**
 * Audit W9-18 (F-24).
 *  1. The saved-settings guard checks ALLOWED VALUES and RANGES, not only
 *     types: an unknown instrument / tuning / theme / colour mode / language,
 *     an octave outside the keyboard or a volume outside 0–1 falls back to
 *     its default (per field — the rest survives).
 *  2. A backup is checked section by section with each store's OWN guard
 *     before the confirm dialog. A backup whose Learn-progress section the
 *     progress store would reject used to be written anyway — the store then
 *     fell back to EMPTY progress and saved it over the learner's real one.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store';
import { validateBackup, type FermataBackup } from '../../utils/backupHelpers';

const KEY = 'music-theory-app';
const seed = (state: unknown, version = 6) => localStorage.setItem(KEY, JSON.stringify({ state, version }));

beforeEach(() => {
  localStorage.clear();
  useAppStore.setState({
    instrument: 'piano',
    guitarTuningId: 'standard',
    themeMode: 'fermata',
    colorMode: 'functional',
    language: 'en',
    baseOctave: 4,
    scaleOctaves: 1,
    volume: 0.7,
    preferencesUpdatedAt: 0,
  });
});

describe('saved settings: allowed values and ranges (W9-18)', () => {
  const CASES: Array<[field: string, bad: unknown, fallback: unknown]> = [
    ['instrument', 'banjo', 'piano'],
    ['guitarTuningId', 'drop-z', 'standard'],
    ['themeMode', 'purple', 'fermata'],
    ['colorMode', 'rainbow', 'functional'],
    ['language', 'xx', 'en'],
    ['baseOctave', 99, 4],
    ['baseOctave', -1, 4],
    ['baseOctave', 3.5, 4],
    ['scaleOctaves', 3, 1],
    ['volume', 5, 0.7],
    ['volume', -0.1, 0.7],
    ['preferencesUpdatedAt', -5, 0],
  ];

  it.each(CASES)('%s = %j falls back to %j, other fields survive', async (field, bad, fallback) => {
    seed({ [field]: bad, selectedScale: 'dorian' });
    await useAppStore.persist.rehydrate();
    const s = useAppStore.getState() as unknown as Record<string, unknown>;
    expect(s[field]).toEqual(fallback);
    expect(s.selectedScale).toBe('dorian');
  });

  it('keeps every allowed value at the edges of each range', async () => {
    seed({
      instrument: 'guitar',
      guitarTuningId: 'dadgad',
      themeMode: 'fermata-night',
      colorMode: 'absolute',
      language: 'pt',
      baseOctave: 0,
      scaleOctaves: 2,
      volume: 1,
      preferencesUpdatedAt: 1730000000000,
    });
    await useAppStore.persist.rehydrate();
    const s = useAppStore.getState();
    expect(s.instrument).toBe('guitar');
    expect(s.guitarTuningId).toBe('dadgad');
    expect(s.themeMode).toBe('fermata-night');
    expect(s.colorMode).toBe('absolute');
    expect(s.language).toBe('pt');
    expect(s.baseOctave).toBe(0);
    expect(s.scaleOctaves).toBe(2);
    expect(s.volume).toBe(1);

    seed({ baseOctave: 8, volume: 0 });
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().baseOctave).toBe(8);
    expect(useAppStore.getState().volume).toBe(0);
  });
});

// ── Backups ────────────────────────────────────────────────────────────────

const GOOD_APP = { state: { selectedScale: 'dorian', volume: 0.5, themeMode: 'fermata-night', lastView: 'learn' }, version: 6 };
const GOOD_PROGRESS = {
  state: {
    progress: {
      completedModules: ['l1u1m1'],
      moduleProgress: { l1u1m1: ['t1'] },
      exerciseResults: {},
      reviewSchedules: {
        l1u1m1: { completedAt: 1, nextReviewAt: 2, intervalLevel: 0, reviewCount: 0, lastReviewedAt: 1 },
      },
    },
  },
  version: 1,
};
const GOOD_DRILL = {
  state: {
    items: { 'keysig:major:G': { card: { due: 0 }, history: [], tier: 'new' } },
    settings: { length: 24, newPerSession: 4, families: {}, sound: true, showTimer: false },
    sprintBests: {},
    lifetime: { answered: 3, correct: 2 },
    activeSession: null,
  },
  version: 1,
};

function backupWith(data: FermataBackup['data']): unknown {
  return JSON.parse(JSON.stringify({ format: 'fermata-backup', version: 1, exportedAt: '2026-10-30T12:00:00.000Z', data }));
}

describe('backup import: every section passes its store\'s own check before the confirm step (W9-18)', () => {
  it('accepts a backup the app itself would write', async () => {
    const r = await validateBackup(backupWith({
      'music-theory-app': GOOD_APP,
      'music-theory-progress': GOOD_PROGRESS,
      'fermata-drill-v1': GOOD_DRILL,
    }));
    expect(r).toMatchObject({ ok: true });
  });

  it('accepts an older preferences section that its migration upgrades (v4 "dark" theme)', async () => {
    const r = await validateBackup(backupWith({
      'music-theory-app': { state: { themeMode: 'dark', volume: 0.4 }, version: 4 },
    }));
    expect(r.ok).toBe(true);
  });

  it.each([
    ['progress list is not a list', { state: { progress: { completedModules: 'l1u1m1', moduleProgress: {} } }, version: 1 }],
    ['progress wrapper missing (raw progress)', { state: { completedModules: ['l1u1m1'], completedTasks: {}, exerciseResults: {} }, version: 0 }],
    ['review schedule with a text date', { state: { progress: { ...GOOD_PROGRESS.state.progress, reviewSchedules: { l1u1m1: { completedAt: 'yesterday' } } } }, version: 1 }],
    ['no persist envelope', { completedModules: ['l1u1m1'] }],
  ])('rejects a Learn-progress section the progress store would wipe (%s)', async (_label, section) => {
    const r = await validateBackup(backupWith({ 'music-theory-progress': section as Record<string, unknown> }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/music-theory-progress/);
  });

  it('rejects a Drill section whose memory records the drill store would drop', async () => {
    const r = await validateBackup(backupWith({
      'fermata-drill-v1': { state: { ...GOOD_DRILL.state, items: { x: { card: null } } }, version: 1 },
    }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/fermata-drill-v1/);
  });

  it('rejects a preferences section with values the settings guard would discard', async () => {
    const r = await validateBackup(backupWith({
      'music-theory-app': { state: { themeMode: 'purple', baseOctave: 99 }, version: 6 },
    }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/music-theory-app.*(themeMode|baseOctave)/);
  });

  it('fingering section: a backup that would lose overrides is refused; a clean one passes', async () => {
    const key = 'major|standard|p5|0|1';
    const ok = await validateBackup(backupWith({
      'fermata-fingering-v1': { state: { overrides: { [key]: 2 }, labelMode: 'degree' }, version: 1 },
    }));
    expect(ok.ok).toBe(true);
    const bad = await validateBackup(backupWith({
      'fermata-fingering-v1': { state: { overrides: { [key]: 7, 'not|a|key': 1 }, labelMode: 'finger' }, version: 1 },
    }));
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.reason).toMatch(/fermata-fingering-v1/);
  });

  it('a replaced (not just dropped) setting counts as invalid — e.g. guitarScalePosition 99', async () => {
    const r = await validateBackup(backupWith({
      'music-theory-app': { state: { guitarScalePosition: 99 }, version: 6 },
    }));
    expect(r.ok).toBe(false);
  });

  it('one bad section rejects the whole file — nothing partial is offered', async () => {
    const r = await validateBackup(backupWith({
      'music-theory-app': GOOD_APP,
      'music-theory-progress': { state: { progress: null }, version: 1 },
      'fermata-drill-v1': GOOD_DRILL,
    }));
    expect(r.ok).toBe(false);
  });
});
