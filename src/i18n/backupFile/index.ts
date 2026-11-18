/**
 * The words of a backup that did not go as planned (audit A15 / A16,
 * 2026-11-18): an import the browser would not save, an export with a
 * damaged part. They load with the backup code (utils/backupFile.ts: the
 * Settings sheet, the start screen, the moving panel), not with the entry
 * bundle (the `backupFile` namespace; the pattern of `i18n/moved`). The parts
 * are named with the existing `backup.section.*` words.
 */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const BACKUP_FILE_TEXT = { en, pt, es } as const;

for (const [lang, backupFile] of Object.entries(BACKUP_FILE_TEXT)) {
  i18n.addResourceBundle(lang, 'translation', { backupFile }, true, false);
}
