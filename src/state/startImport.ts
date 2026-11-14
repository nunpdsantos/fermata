/**
 * Bringing a progress file in from the start screen (2026-11-14: someone
 * arriving at fermatina.com with the file they exported on the old address).
 *
 * The file is read and vetted exactly as Settings → Your data → Import does
 * (utils/backupFile.ts `readBackupFile`); then, unlike Settings, nothing is
 * asked first: by the start screen's own rule nothing but settings is saved
 * in this browser yet (state/welcomeGate.ts), so nothing of the learner's is
 * replaced. No door is chosen for them — what the file holds decides (a file
 * with no profile gives the app as it was for that learner: no hint, Full
 * view, their neck) — and the first-visit gate is settled 'seen', as it is
 * for any learner with that data (left 'pending', a file with settings only
 * would bring the start screen back). Then the page reloads, as Settings'
 * import does, so every store rehydrates through its own guards and migrations.
 */
import { applyBackup, type FermataBackup } from '../utils/backupHelpers.ts';
import { reloadPage } from '../utils/pageReload.ts';
import { WELCOME_KEY } from './welcomeGate.ts';

export function bringInFromStartScreen(backup: FermataBackup, storage: Storage = localStorage): void {
  applyBackup(backup, storage);
  try {
    storage.setItem(WELCOME_KEY, 'seen');
  } catch {
    // Storage that took the backup but not the flag: the reload decides from what it holds.
  }
  reloadPage();
}
