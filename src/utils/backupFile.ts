/**
 * The progress file, as a person handles it: the ONE export (Settings → Your
 * data → Export, and "Export my progress" in the old address's moving panel —
 * the same file either way). The envelope and its vetting are
 * utils/backupHelpers.ts; this module only turns it into a download.
 *
 * The file is named after the app (`fermatina-backup-<date>.json`, since
 * 2026-11-14); what is inside it is not: its `format` stays 'fermata-backup',
 * so a file exported before the rename, or by the old address, imports as is.
 */
import { buildBackup, validateBackup, type BackupValidation } from './backupHelpers.ts';

/**
 * A chosen file, read and vetted — the ONE way in, for Settings → Your data →
 * Import and the start screen's "I have a progress file": not JSON, or any
 * section its own store would refuse, and nothing is offered (W9-18).
 */
export async function readBackupFile(file: Pick<File, 'text'>): Promise<BackupValidation> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    return { ok: false, reason: 'not JSON' };
  }
  return validateBackup(parsed);
}

/** The download name of a backup exported at `exportedAt` (an ISO date). */
export function backupFileName(exportedAt: string): string {
  return `fermatina-backup-${exportedAt.slice(0, 10)}.json`;
}

/** Download every saved store as one JSON file. Returns the file's name. */
export function downloadBackup(storage: Pick<Storage, 'getItem'> = localStorage): string {
  const backup = buildBackup(storage);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = backupFileName(backup.exportedAt);
  a.click();
  URL.revokeObjectURL(url);
  return a.download;
}
