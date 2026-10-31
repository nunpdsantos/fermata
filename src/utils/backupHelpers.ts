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
}

type ReadableStorage = Pick<Storage, 'getItem'>;
type WritableStorage = Pick<Storage, 'setItem'>;

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
    const current = useProgressStore.persist.getOptions().version;
    if (version !== current) return `unsupported version ${version} (expected ${current})`;
    return isValidPersistedProgress(state) ? null : 'progress does not match the saved format';
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

export function applyBackup(backup: FermataBackup, storage: WritableStorage): void {
  for (const [key, value] of Object.entries(backup.data)) {
    storage.setItem(key, JSON.stringify(value));
  }
}

/** Human-readable list of sections present in a backup, for the confirm step. */
export function backupSections(backup: FermataBackup): string[] {
  const names: Record<BackupKey, string> = {
    'music-theory-app': 'preferences',
    'music-theory-progress': 'learn progress',
    'fermata-drill-v1': 'drill progress',
    'fermata-fingering-v1': 'guitar fingerings',
  };
  return (Object.keys(backup.data) as BackupKey[]).map((k) => names[k]);
}
