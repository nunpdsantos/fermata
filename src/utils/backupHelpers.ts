/**
 * Progress backup export/import (F-09).
 *
 * Long-term progress lives only in browser localStorage; these helpers give
 * it a file-based escape hatch. A backup is a JSON envelope around the raw
 * zustand persist payloads of the persisted stores. Import writes the payloads
 * back to localStorage and the app is reloaded.
 *
 * Every section is vetted with its store's OWN guard BEFORE the confirm step
 * (audit W9-18 / F-24): when a section failed only after the reload, the
 * progress store fell back to EMPTY progress and saved that over the
 * learner's real progress. No store validation is duplicated here — the
 * guards are imported (Learn progress and Drill lazily, so neither store, nor
 * ts-fsrs, joins the entry chunk).
 */
import { useAppStore, invalidAppStateFields } from '../state/store.ts';
import { tabLine } from '../state/tabSafe.ts';
import { same, savedNow } from '../state/tabMerge.ts';

export const BACKUP_KEYS = [
  'music-theory-app',
  'music-theory-progress',
  'fermata-drill-v1',
  // Guitar fingering overrides (W10-05) — FINGERING_STORE_KEY in
  // state/fingeringStore.ts; inlined so this module stays dependency-free.
  'fermata-fingering-v1',
] as const;

export type BackupKey = (typeof BACKUP_KEYS)[number];

export interface FermataBackup {
  format: 'fermata-backup';
  version: 1;
  exportedAt: string;
  data: Partial<Record<BackupKey, Record<string, unknown>>>;
  /**
   * A16 (2026-11-18): the saved text of each section that was damaged in the
   * browser, exactly as it was, kept for repair. Only written when there is
   * one (a healthy export is byte for byte as before). The importer reads
   * `data` only, so a file with it imports everywhere.
   */
  damaged?: Partial<Record<BackupKey, string>>;
}

type ReadableStorage = Pick<Storage, 'getItem'>;
/** What an import needs of the storage: read (to keep the old data), write, and remove (to put back a key that was absent). */
type WritableStorage = Pick<Storage, 'getItem' | 'setItem'> & Partial<Pick<Storage, 'removeItem'>>;

export function buildBackup(storage: ReadableStorage): FermataBackup {
  const data: FermataBackup['data'] = {};
  for (const key of BACKUP_KEYS) {
    const raw = storage.getItem(key);
    if (raw === null) continue;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        data[key] = parsed as Record<string, unknown>;
      }
    } catch {
      // Corrupt store payloads are skipped rather than aborting the backup.
    }
  }
  return {
    format: 'fermata-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export type BackupValidation =
  | { ok: true; backup: FermataBackup }
  | { ok: false; reason: string };

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Why a section would be rejected by its store, or null when it is fine. */
async function sectionProblem(key: BackupKey, payload: Record<string, unknown>): Promise<string | null> {
  const { state, version } = payload;
  if (!isPlainObject(state) || typeof version !== 'number') {
    return 'not a saved-store envelope ({ state, version })';
  }

  if (key === 'music-theory-app') {
    // Older blobs go through the store's own migration first (e.g. v4 'dark').
    const { version: current, migrate } = useAppStore.persist.getOptions();
    const upgraded = version < (current ?? 0) && migrate ? await migrate(state, version) : state;
    const bad = invalidAppStateFields(upgraded);
    if (bad === null) return 'settings are not an object';
    return bad.length ? `invalid ${bad.join(', ')}` : null;
  }

  if (key === 'music-theory-progress') {
    const { useProgressStore, isValidPersistedProgress } = await import('../state/progressStore.ts');
    const { version: current = 1, migrate } = useProgressStore.persist.getOptions();
    // Older progress (e.g. version 1, before W4a retired changed exercises'
    // scores) is still a good backup: the store migrates it on load. Check it
    // as the store will see it after that migration.
    if (version < 1 || version > current) return `unsupported version ${version} (expected 1–${current})`;
    // The saved shape is the same in every version from 1 on: check it as
    // saved (a broken section must be refused, not replaced by the defaults
    // the migration would fall back to), then as the store will load it.
    if (!isValidPersistedProgress(state)) return 'progress does not match the saved format';
    const upgraded = version < current && migrate ? await migrate(state, version) : state;
    return isValidPersistedProgress(upgraded) ? null : 'progress does not match the saved format';
  }

  if (key === 'fermata-fingering-v1') {
    // The fingering store drops each bad entry on its own; a backup that
    // would lose entries (or carries an unknown label mode) is not offered.
    const { sanitize } = await import('../state/fingeringStore.ts');
    const clean = sanitize(state);
    const overrides = state.overrides ?? {};
    if (!isPlainObject(overrides)) return 'fingering overrides are not an object';
    const lost = Object.keys(overrides).length - Object.keys(clean.overrides).length;
    if (lost > 0) return `${lost} fingering override(s) do not match the saved format`;
    if (state.labelMode !== undefined && state.labelMode !== clean.labelMode) return 'invalid labelMode';
    return null;
  }

  // 'fermata-drill-v1' — the drill store rescues what it can on its own
  // (since W7-10 it drops broken memory records one by one, and their broken
  // answer-history entries); a backup that would LOSE any of them is not
  // offered.
  const { validatePersistedShape } = await import('../state/drillStore.ts');
  const clean = validatePersistedShape(state);
  if (!clean) return 'drill memory does not match the saved format';
  const items = state.items ?? {};
  if (!isPlainObject(items)) return 'drill memory is not an object';
  const lostItems = Object.keys(items).length - Object.keys(clean.items).length;
  if (lostItems > 0) return `${lostItems} drill memory record(s) do not match the saved format`;
  const historyOf = (record: Record<string, unknown>) =>
    Object.values(record).reduce<number>((n, item) => {
      const history = isPlainObject(item) ? item.history : undefined;
      return n + (Array.isArray(history) ? history.length : 0);
    }, 0);
  const lostAnswers = historyOf(items) - historyOf(clean.items as unknown as Record<string, unknown>);
  if (lostAnswers > 0) return `${lostAnswers} drill answer record(s) do not match the saved format`;
  return null;
}

export async function validateBackup(raw: unknown): Promise<BackupValidation> {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { ok: false, reason: 'not an object' };
  }
  const candidate = raw as Record<string, unknown>;
  if (candidate.format !== 'fermata-backup') {
    return { ok: false, reason: 'not a fermata backup file' };
  }
  if (candidate.version !== 1) {
    return { ok: false, reason: `unsupported backup version: ${String(candidate.version)}` };
  }
  const data = candidate.data;
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { ok: false, reason: 'missing data section' };
  }
  for (const [key, value] of Object.entries(data)) {
    if (!(BACKUP_KEYS as readonly string[]).includes(key)) {
      return { ok: false, reason: `unknown storage key: ${key}` };
    }
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return { ok: false, reason: `invalid payload for ${key}` };
    }
  }
  for (const [key, value] of Object.entries(data)) {
    const problem = await sectionProblem(key as BackupKey, value as Record<string, unknown>);
    if (problem) return { ok: false, reason: `${key}: ${problem}` };
  }
  return { ok: true, backup: candidate as unknown as FermataBackup };
}

export type ApplyResult =
  | { ok: true }
  /** Nothing written stays, unless putting it back failed too: `notRestored` then holds the backup's version. */
  | { ok: false; restored: boolean; notRestored: BackupKey[] };

/**
 * Write a vetted backup: every section, or none (audit A15). What each key
 * holds is kept first; if any write fails (the browser's storage is full),
 * every key written is put back exactly as it was — a key that did not exist
 * is removed again — and the result says so, naming any key that could not
 * be put back. Nothing is thrown: the caller says what happened.
 */
export function applyBackup(backup: FermataBackup, storage: WritableStorage): ApplyResult {
  const keys = Object.keys(backup.data) as BackupKey[];
  let before: Map<BackupKey, string | null>;
  try {
    before = new Map(keys.map((k) => [k, storage.getItem(k)]));
  } catch {
    return { ok: false, restored: true, notRestored: [] };
  }
  const tried: BackupKey[] = [];
  try {
    for (const key of keys) {
      tried.push(key);
      storage.setItem(key, JSON.stringify(backup.data[key]));
    }
    return { ok: true };
  } catch {
    const notRestored: BackupKey[] = [];
    for (const key of tried.reverse()) {
      const old = before.get(key) ?? null;
      try {
        if (old !== null) storage.setItem(key, old);
        else storage.removeItem?.(key);
        if (storage.getItem(key) !== old) notRestored.push(key);
      } catch {
        notRestored.push(key);
      }
    }
    return { ok: false, restored: notRestored.length === 0, notRestored };
  }
}

/** Each section's store, loaded on demand (Learn progress and Drill stay out of the entry chunk). */
const STORE_MODULES: Record<BackupKey, () => Promise<unknown>> = {
  'music-theory-app': () => import('../state/store.ts'),
  'music-theory-progress': () => import('../state/progressStore.ts'),
  'fermata-drill-v1': () => import('../state/drillStore.ts'),
  'fermata-fingering-v1': () => import('../state/fingeringStore.ts'),
};

export interface CheckedBackup {
  backup: FermataBackup;
  /** Damaged, and nothing of it could be read: not in `data` (its text is in `damaged`). */
  missing: BackupKey[];
  /** Damaged, and the file holds what the app could read of it (its text is in `damaged` too). */
  partly: BackupKey[];
  /** Saved by a newer Fermatina, which this page cannot read: left out (it is not damaged, and stays in the browser). */
  newer: BackupKey[];
}

/**
 * The export, checked (audit A16): every section read as today; a section
 * the importer would refuse (or that is not even JSON) is damaged. For a
 * damaged one, the file keeps what can be recovered — the store's own
 * reading of it, i.e. what the app shows: memory read before the damage, or
 * what its guard rescues record by record — unless that is nothing but the
 * store's defaults; and the damaged text itself, under `damaged`. Then the
 * importer's own check (`validateBackup`) reads the assembled file exactly as
 * it will be read back; a section it still refuses is left out too. A
 * section the check refuses because a NEWER Fermatina saved it is not
 * damaged: it is left out and named as such (fix pass, 2026-11-19). A
 * healthy export is exactly `buildBackup`'s.
 */
export async function buildCheckedBackup(storage: ReadableStorage): Promise<CheckedBackup> {
  const backup = buildBackup(storage);
  const damaged: Partial<Record<BackupKey, string>> = {};
  const missing: BackupKey[] = [];
  const partly: BackupKey[] = [];
  const newer: BackupKey[] = [];
  for (const key of BACKUP_KEYS) {
    const raw = storage.getItem(key);
    const payload = backup.data[key];
    if (raw === null || (payload && !(await sectionProblem(key, payload)))) continue;
    delete backup.data[key];
    await STORE_MODULES[key]();
    const store = tabLine(key)?.store?.();
    if (store && typeof payload?.version === 'number' && payload.version > (store.persist.getOptions().version ?? 0)) {
      newer.push(key);
      continue;
    }
    damaged[key] = raw;
    const live = store && { state: savedNow(store), version: store.persist.getOptions().version };
    const defaults = store && savedNow(store, true);
    if (live && isPlainObject(live.state) && !same(live.state, defaults) && !(await sectionProblem(key, live as Record<string, unknown>))) {
      backup.data[key] = live as Record<string, unknown>;
      partly.push(key);
    } else {
      missing.push(key);
    }
  }
  for (;;) {
    const check = await validateBackup(JSON.parse(JSON.stringify(backup)));
    if (check.ok) break;
    const key = BACKUP_KEYS.find((k) => k in backup.data && check.reason.startsWith(`${k}:`));
    if (!key) throw new Error(`backup: ${check.reason}`);
    delete backup.data[key];
    damaged[key] ??= storage.getItem(key) ?? '';
    if (partly.includes(key)) partly.splice(partly.indexOf(key), 1);
    missing.push(key);
  }
  if (Object.keys(damaged).length > 0) backup.damaged = damaged;
  return { backup, missing, partly, newer };
}

export type BackupSection = 'preferences' | 'learnProgress' | 'drillProgress' | 'guitarFingerings';

/**
 * The sections present in a backup, for the confirm step — as i18n keys
 * (`backup.section.<key>`), so the question reads in the learner's language
 * (audit W6-05: the names used to be English in PT/ES).
 */
export const SECTION_OF: Record<BackupKey, BackupSection> = {
  'music-theory-app': 'preferences',
  'music-theory-progress': 'learnProgress',
  'fermata-drill-v1': 'drillProgress',
  'fermata-fingering-v1': 'guitarFingerings',
};

export function backupSections(backup: FermataBackup): BackupSection[] {
  return (Object.keys(backup.data) as BackupKey[]).map((k) => SECTION_OF[k]);
}
