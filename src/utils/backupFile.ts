/**
 * The progress file, as a person handles it: the ONE export (Settings → Your
 * data → Export, and "Export my progress" in the old address's moving panel —
 * the same file either way). The envelope and its vetting are
 * utils/backupHelpers.ts; this module turns it into a download and says, in
 * the learner's language, what happened (audit A15 / A16, 2026-11-18: an
 * export with a damaged part and an import the browser would not save used to
 * end on the success line, or on nothing).
 *
 * The file is named after the app (`fermatina-backup-<date>.json`, since
 * 2026-11-14); what is inside it is not: its `format` stays 'fermata-backup',
 * so a file exported before the rename, or by the old address, imports as is.
 */
import i18n from '../i18n';
import '../i18n/backupFile/index.ts';
import { toast } from '../state/toastStore.ts';
import {
  buildCheckedBackup, validateBackup, SECTION_OF,
  type ApplyResult, type BackupKey, type BackupValidation,
} from './backupHelpers.ts';

/** A long sentence stays long enough to be read. */
const LONG_TOAST_MS = 8000;

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

/** The parts of the learner's data, in their language ("Learn progress, Drill memory"). */
const sectionNames = (keys: readonly BackupKey[]) => keys.map((k) => i18n.t(`backup.section.${SECTION_OF[k]}`)).join(', ');

export interface ExportReport {
  fileName: string;
  /** Damaged and unreadable: not in the file's data. */
  missing: BackupKey[];
  /** Damaged: the file holds what could be read. */
  partly: BackupKey[];
}

/**
 * Download every saved store as one JSON file, checked by the importer's own
 * check before anything is said (A16). Returns what went into it.
 */
export async function downloadBackup(storage: Pick<Storage, 'getItem'> = localStorage): Promise<ExportReport> {
  const { backup, missing, partly } = await buildCheckedBackup(storage);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = backupFileName(backup.exportedAt);
  a.click();
  URL.revokeObjectURL(url);
  return { fileName: a.download, missing, partly };
}

/** What an export with a damaged part has to say (none for a whole one): the parts left out, then the parts saved as far as they could be read. */
export function exportWarnings({ missing, partly }: Pick<ExportReport, 'missing' | 'partly'>): string[] {
  return [
    ...(missing.length > 0 ? [i18n.t('backupFile.exportedWithout', { count: missing.length, sections: sectionNames(missing) })] : []),
    ...(partly.length > 0 ? [i18n.t('backupFile.exportedPartly', { count: partly.length, sections: sectionNames(partly) })] : []),
  ];
}

/**
 * Export, then say what happened: "Backup downloaded" only when every part
 * went in whole; otherwise the warnings above. Returns the warnings, for a
 * sheet to show them in place (a toast is drawn under an open sheet).
 */
export async function exportAndTell(storage: Pick<Storage, 'getItem'> = localStorage): Promise<string[]> {
  const warnings = exportWarnings(await downloadBackup(storage));
  if (warnings.length === 0) toast(i18n.t('backup.exported'), 'success');
  for (const line of warnings) toast(line, 'warning', LONG_TOAST_MS);
  return warnings;
}

/** The sentence for an import the browser would not save (A15): nothing changed, or which parts now come from the file. */
export function importFailedText(result: Extract<ApplyResult, { ok: false }>): string {
  return result.notRestored.length === 0
    ? i18n.t('backupFile.importFailed')
    : i18n.t('backupFile.importFailedPartly', { count: result.notRestored.length, sections: sectionNames(result.notRestored) });
}

/** Settings' way to say it: a toast that stays long enough to read. */
export function toastImportFailed(result: Extract<ApplyResult, { ok: false }>): void {
  toast(importFailedText(result), 'error', LONG_TOAST_MS);
}
