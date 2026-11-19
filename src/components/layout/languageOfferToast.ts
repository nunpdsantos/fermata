/**
 * The one-tap language offer (audit 2, P9, 19 November 2026), loaded by
 * LanguageOffer.tsx only when a visit owes one. The rule (the owner, 18
 * November 2026): a saved language always wins and a link never changes a
 * learner's setting by itself; so when a link's `?lang=` differs from the
 * language a returning visit started in, ONE lasting toast, in the link's
 * language ("Mudar para português?" · "Mudar"), offers the switch, and
 * nothing changes until that tap.
 *
 *  - The house's toasts: the one region (state/toastStore.ts, drawn by
 *    ToastRegion), one action, ✕ to put it away; marked with its language
 *    (`lang`), so a screen reader reads it as Portuguese or Spanish.
 *  - Never over work in progress (a check, a Drill session with answers, a
 *    Sprint — services/workInProgress.ts) or the tour: it waits, looking
 *    every 1.5 s, as a shared link's offer does. A tap on it while work has
 *    started again changes nothing yet and offers it again once the work is
 *    over (as a shared link's Open).
 *  - Once per visit: shown, then taken or put away, it does not come back
 *    (the address bar has lost `?lang=`, so a reload owes nothing either).
 *  - The learner's own language choice in this visit (Settings, the start
 *    screen) settles it: it is withdrawn or never shown.
 */
import i18n from '../../i18n/index.ts';
import '../../i18n/languageOffer/index.ts';
import { htmlLangFor, type AppLanguage } from '../../i18n/language.ts';
import { useAppStore } from '../../state/store.ts';
import { useToastStore } from '../../state/toastStore.ts';
import { getDemoRequest } from '../../state/demoRequest.ts';
import { hasWorkInProgress } from '../../services/workInProgress.ts';

/** How often a waiting offer looks whether the work (or the tour) is over. */
export const LANGUAGE_OFFER_POLL_MS = 1500;

type State = 'idle' | 'waiting' | 'shown' | 'done';
let state: State = 'idle';
let offered: AppLanguage | null = null;
let toastId: string | null = null;
let poll: ReturnType<typeof setInterval> | null = null;
let unsubscribe: (() => void) | null = null;

/** Nothing the toast could get in the way of. */
const free = () => !hasWorkInProgress() && getDemoRequest() === null;

function stopWaiting(): void {
  if (poll !== null) clearInterval(poll);
  poll = null;
}

/** The offer is over for this visit (taken, put away, or made moot). */
function settle(): void {
  state = 'done';
  stopWaiting();
  unsubscribe?.();
  unsubscribe = null;
  if (toastId !== null) useToastStore.getState().removeToast(toastId);
  toastId = null;
}

function raise(lang: AppLanguage): void {
  const t = i18n.getFixedT(lang);
  state = 'shown';
  toastId = useToastStore.getState().addToast({
    type: 'info',
    message: t('languageOffer.ask'),
    lang: htmlLangFor(lang),
    // Stays until the learner taps it or puts it away (✕).
    duration: 0,
    action: { label: t('languageOffer.switch'), onSelect: () => take(lang) },
  });
}

function wait(lang: AppLanguage): void {
  if (free()) {
    raise(lang);
    return;
  }
  state = 'waiting';
  if (poll !== null) return;
  poll = setInterval(() => {
    if (state !== 'waiting' || !free()) return;
    stopWaiting();
    raise(lang);
  }, LANGUAGE_OFFER_POLL_MS);
}

/** The toast's action: switch now — unless work started meanwhile, then offer it again once that is over. */
function take(lang: AppLanguage): void {
  toastId = null; // the toast closes itself
  if (!free()) {
    wait(lang);
    return;
  }
  settle();
  useAppStore.getState().setLanguage(lang);
}

/**
 * Offer `lang` (the boot link's, not the one the visit started in) once in
 * this visit. `bootLanguage` is the app's language at boot: if the learner
 * has chosen another one since (the start screen), there is nothing to offer.
 * Returns the shell's cleanup: stop looking while it is gone (the next mount
 * looks again); a toast already up stays in the store.
 */
export function offerLanguage(lang: AppLanguage, bootLanguage: string): () => void {
  const pause = () => stopWaiting();
  if (state === 'done') return pause;
  if (state === 'idle') {
    if (lang === bootLanguage || useAppStore.getState().language !== bootLanguage) {
      state = 'done';
      return pause;
    }
    offered = lang;
    // Any language change in this visit is the learner's own choice: it settles the offer.
    unsubscribe = useAppStore.subscribe((s, prev) => {
      if (s.language !== prev.language) settle();
    });
  }
  // The toast still up when the shell left: it shows again with the shell.
  if (state === 'shown' && toastId !== null && useToastStore.getState().toasts.some((t) => t.id === toastId)) return pause;
  // Put away (✕) while the shell was here: done for this visit.
  if (state === 'shown') {
    settle();
    return pause;
  }
  wait(offered ?? lang);
  return pause;
}

/** Test seam: the toast was put away with ✕ (the store removed it). */
export function languageOfferState(): State {
  if (state === 'shown' && toastId !== null && !useToastStore.getState().toasts.some((t) => t.id === toastId)) settle();
  return state;
}

/** Test seam: a fresh visit. */
export function resetLanguageOffer(): void {
  stopWaiting();
  unsubscribe?.();
  unsubscribe = null;
  state = 'idle';
  offered = null;
  toastId = null;
}
