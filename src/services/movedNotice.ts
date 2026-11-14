/**
 * "We've moved" on the old address (2026-11-14: Fermata became Fermatina, at
 * fermatina.com). ON THE OLD ADDRESS ONLY (services/appAddress.ts): every
 * function here checks it before it touches anything, so on fermatina.com, a
 * preview or localhost nothing is shown and the flag is never read or written.
 *
 *  - A lasting toast in the app's one toast region (it moves nothing; one
 *    action): "Fermata is now Fermatina, at fermatina.com." · "Move my
 *    progress". Never over work in progress (a check, a Drill session, a
 *    Sprint — services/workInProgress.ts) or the tour (state/demoRequest.ts):
 *    it waits, checking every 1.5 s, and shows afterwards.
 *  - Its action opens the moving panel (components/moved/MovedPanel.tsx, a
 *    lazy chunk with its words): export here, open fermatina.com, import there.
 *  - It shows on every visit until the learner says "Don't remind me again"
 *    in the panel (the flag below), or for the rest of this visit once they
 *    have exported from the panel. A toast's action closes the toast, so it
 *    comes back when the panel is closed without either; ✕ on the toast puts
 *    it away for this visit.
 *
 * The flag, `fermatina-moved-v1` = {"stopped":true}: its own localStorage key
 * (not a store's field, not in the backup — utils/backupHelpers.ts lists the
 * four keys it carries — and not counted as app data by the first-visit gate,
 * whose prefixes are 'music-theory' and 'fermata-'), written only here, on the
 * old address, and read through a shape guard: anything else is ignored.
 */
import { create } from 'zustand';
import i18n from '../i18n/index.ts';
import { useToastStore } from '../state/toastStore.ts';
import { getDemoRequest } from '../state/demoRequest.ts';
import { hasWorkInProgress } from './workInProgress.ts';
import { currentHostname, onOldAddress } from './appAddress.ts';

export const MOVED_FLAG_KEY = 'fermatina-moved-v1';
/** How often a waiting reminder checks whether the work (or the tour) is over. */
export const MOVED_POLL_MS = 1500;

const STOPPED = JSON.stringify({ stopped: true });

type FlagStorage = Pick<Storage, 'getItem' | 'setItem'>;
function defaultStorage(): FlagStorage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** The flag's shape guard: exactly an object whose `stopped` is true. */
export function isStoppedFlag(raw: string | null): boolean {
  if (raw === null) return false;
  try {
    const value: unknown = JSON.parse(raw);
    return typeof value === 'object' && value !== null && !Array.isArray(value) && (value as { stopped?: unknown }).stopped === true;
  } catch {
    return false;
  }
}

/** The learner said "Don't remind me again" here. False — and nothing read — off the old address. */
export function movedReminderStopped(host: string = currentHostname(), storage: FlagStorage | null = defaultStorage()): boolean {
  if (!onOldAddress(host) || !storage) return false;
  try {
    return isStoppedFlag(storage.getItem(MOVED_FLAG_KEY));
  } catch {
    return false;
  }
}

/** Save "Don't remind me again". Nothing is written off the old address. */
export function writeMovedStopped(host: string = currentHostname(), storage: FlagStorage | null = defaultStorage()): boolean {
  if (!onOldAddress(host) || !storage) return false;
  try {
    storage.setItem(MOVED_FLAG_KEY, STOPPED);
    return true;
  } catch {
    return false;
  }
}

interface MovedPanelState {
  /** The moving panel is open. */
  open: boolean;
  /** It has been opened in this page (its chunk is mounted from then on). */
  opened: boolean;
}

export const useMovedPanel = create<MovedPanelState>(() => ({ open: false, opened: false }));

// This visit (the page): nothing below outlives a reload.
let exportedThisVisit = false;
let stoppedThisVisit = false;
let toastId: string | null = null;
let poll: ReturnType<typeof setInterval> | null = null;

function stopPolling(): void {
  if (poll !== null) clearInterval(poll);
  poll = null;
}

const toastUp = () => toastId !== null && useToastStore.getState().toasts.some((t) => t.id === toastId);

/** Still to be shown in this visit (checked in this order: the address first, so nothing is read elsewhere). */
function owed(): boolean {
  return onOldAddress() && !stoppedThisVisit && !exportedThisVisit && !useMovedPanel.getState().open && !movedReminderStopped();
}

/** Nothing the toast could get in the way of: no work in progress, no tour. */
const free = () => !hasWorkInProgress() && getDemoRequest() === null;

function raise(): void {
  toastId = useToastStore.getState().addToast({
    type: 'info',
    message: i18n.t('movedEntry.toast'),
    // Stays until the learner opens the panel or dismisses it.
    duration: 0,
    action: { label: i18n.t('movedEntry.action'), onSelect: openMovedPanel },
  });
}

/**
 * Show the reminder when it is owed: now if nothing is under way, else once
 * the work or the tour is over. Safe to call again (one toast, one watch).
 */
export function offerMovedNotice(): void {
  if (!owed() || toastUp()) return;
  if (free()) {
    stopPolling();
    raise();
    return;
  }
  if (poll !== null) return;
  poll = setInterval(() => {
    if (!owed() || toastUp()) {
      stopPolling();
      return;
    }
    if (!free()) return;
    stopPolling();
    raise();
  }, MOVED_POLL_MS);
}

/** The shell went away (the start screen came back): stop waiting; the next mount offers again. */
export function pauseMovedNotice(): void {
  stopPolling();
}

/** The language changed while the toast is up: the same toast, in the new language. */
export function refreshMovedToast(): void {
  if (!toastUp()) return;
  useToastStore.getState().removeToast(toastId!);
  toastId = null;
  raise();
}

/** The toast's action (the toast closes itself). */
export function openMovedPanel(): void {
  if (!onOldAddress()) return;
  toastId = null;
  stopPolling();
  useMovedPanel.setState({ open: true, opened: true });
}

/** The panel closed (✕, Escape, the scrim): the reminder is still owed unless they exported or stopped it. */
export function closeMovedPanel(): void {
  useMovedPanel.setState({ open: false });
  offerMovedNotice();
}

/** "Export my progress" in the panel: no more reminders in this visit. */
export function noteMovedExport(): void {
  exportedThisVisit = true;
}

/** "Don't remind me again": saved, the panel closes, the toast goes. */
export function stopMovedReminder(): void {
  if (!onOldAddress()) return;
  stoppedThisVisit = true;
  writeMovedStopped();
  stopPolling();
  if (toastUp()) useToastStore.getState().removeToast(toastId!);
  toastId = null;
  useMovedPanel.setState({ open: false });
}

/** Test seam: a fresh visit. */
export function resetMovedNotice(): void {
  stopPolling();
  exportedThisVisit = false;
  stoppedThisVisit = false;
  toastId = null;
  useMovedPanel.setState({ open: false, opened: false });
}
