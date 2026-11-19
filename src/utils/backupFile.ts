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
  /** Saved by a newer Fermatina: left out. */
  newer: BackupKey[];
}

/**
 * Download every saved store as one JSON file, checked by the importer's own
 * check before anything is said (A16). Returns what went into it.
 */
export async function downloadBackup(storage: Pick<Storage, 'getItem'> = localStorage): Promise<ExportReport> {
  const { backup, missing, partly, newer } = await buildCheckedBackup(storage);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = backupFileName(backup.exportedAt);
  a.click();
  URL.revokeObjectURL(url);
  return { fileName: a.download, missing, partly, newer };
}

/**
 * What an export that is not whole has to say (none for a whole one): the
 * parts left out as damaged, the parts saved as far as they could be read,
 * and the parts a newer Fermatina saved (not damaged; this page cannot read them).
 */
export function exportWarnings({ missing, partly, newer = [] }: Pick<ExportReport, 'missing' | 'partly'> & Partial<Pick<ExportReport, 'newer'>>): string[] {
  const line = (key: string, parts: BackupKey[]) => (parts.length > 0 ? [i18n.t(key, { count: parts.length, sections: sectionNames(parts) })] : []);
  return [...line('backupFile.exportedWithout', missing), ...line('backupFile.exportedPartly', partly), ...line('backupFile.exportedNewer', newer)];
}

/** One sentence the export has for the learner, and how it reads. */
export interface ExportNote { text: string; tone: 'success' | 'warning' | 'error' }

/** The colour each tone's sentence is written in (its token). */
export const NOTE_INK: Record<ExportNote['tone'], string> = { success: 'var(--success-text)', warning: 'var(--warning-text)', error: 'var(--danger-text)' };

/**
 * Export, then say what happened: "Backup downloaded" only when every part
 * went in whole; otherwise the warnings above; and if no file could be made,
 * that. Returns the sentences — "Backup downloaded" too (second fix pass,
 * 2026-11-19: a whole export said nothing where the learner was looking) —
 * for a sheet to show them in place (a toast is drawn under an open sheet).
 */
export async function exportAndTell(storage: Pick<Storage, 'getItem'> = localStorage): Promise<ExportNote[]> {
  let warnings: string[];
  try {
    warnings = exportWarnings(await downloadBackup(storage));
  } catch {
    const text = i18n.t('backupFile.exportFailed');
    toast(text, 'error', LONG_TOAST_MS);
    return [{ text, tone: 'error' }];
  }
  if (warnings.length === 0) {
    const text = i18n.t('backup.exported');
    toast(text, 'success');
    return [{ text, tone: 'success' }];
  }
  for (const line of warnings) toast(line, 'warning', LONG_TOAST_MS);
  return warnings.map((text) => ({ text, tone: 'warning' }));
}

/**
 * The sentence for an import the browser would not save (A15): nothing
 * changed, or which parts now come from the file — and, for a part that
 * could not even be read back afterwards, that what it holds is unknown, in
 * its own sentence (never that it holds the backup's data).
 */
export function importFailedText(result: Extract<ApplyResult, { ok: false }>): string {
  const { notRestored, unknown = [] } = result;
  if (unknown.length === 0) {
    return notRestored.length === 0
      ? i18n.t('backupFile.importFailed')
      : i18n.t('backupFile.importFailedPartly', { count: notRestored.length, sections: sectionNames(notRestored) });
  }
  return [
    i18n.t('backupFile.importNotInFull'),
    ...(notRestored.length ? [i18n.t('backupFile.importFromBackup', { count: notRestored.length, sections: sectionNames(notRestored) })] : []),
    i18n.t('backupFile.importUnknown', { count: unknown.length, sections: sectionNames(unknown) }),
    i18n.t('backupFile.importRestAsItWas'),
  ].join(' ');
}

/** Settings' way to say it: a toast that stays long enough to read. */
export function toastImportFailed(result: Extract<ApplyResult, { ok: false }>): void {
  toast(importFailedText(result), 'error', LONG_TOAST_MS);
}
