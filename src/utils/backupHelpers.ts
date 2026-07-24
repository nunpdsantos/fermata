/**
 * Progress backup export/import (F-09).
 *
 * Long-term progress lives only in browser localStorage; these helpers give
 * it a file-based escape hatch. A backup is a JSON envelope around the raw
 * zustand persist payloads of the three stores. Import writes the payloads
 * back to localStorage and the app is reloaded — each store's own shape
 * guards and migrations then validate the content, so no store-internal
 * validation is duplicated here.
 */

export const BACKUP_KEYS = [
  'music-theory-app',
  'music-theory-progress',
  'fermata-drill-v1',
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

export function validateBackup(raw: unknown): BackupValidation {
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
  };
  return (Object.keys(backup.data) as BackupKey[]).map((k) => names[k]);
}
