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
 *    started again (review of bd14071) changes nothing yet: the tap is
 *    remembered, and one line in the link's language says so at once ("O
 *    idioma muda para português quando acabares o que estás a fazer."), for
 *    8 s as a shared link's waiting line (a lasting one would cover a phone's
 *    Drill header — End session included — for as long as the work lasts);
 *    ✕ on it cancels the switch. When the work is over the language
 *    switches, with no second tap, and a short line says so ("Agora em
 *    português.").
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
/** How long "…when you finish what you are doing" shows (a shared link's waiting line, shareLinkOpen.ts). */
export const LANGUAGE_LATER_MS = 8000;
/** How long "Now in Portuguese." shows once the remembered tap is applied. */
export const LANGUAGE_NOW_MS = 4000;

type State = 'idle' | 'waiting' | 'shown' | 'pending' | 'done';
let state: State = 'idle';
let toastId: string | null = null;
let poll: ReturnType<typeof setInterval> | null = null;
let unsubscribe: (() => void) | null = null;
let laterTimer: ReturnType<typeof setTimeout> | null = null;
/** The "when you finish" line left by itself (its 8 s), not by ✕: the tap still stands. */
let laterExpired = false;

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
  if (laterTimer !== null) clearTimeout(laterTimer);
  laterTimer = null;
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

/** The toast's action: switch now — unless work started meanwhile: then say so, and switch once it is over. */
function take(lang: AppLanguage): void {
  toastId = null; // the toast closes itself
  if (free()) {
    settle();
    useAppStore.getState().setLanguage(lang);
    return;
  }
  const t = i18n.getFixedT(lang);
  state = 'pending';
  laterExpired = false;
  toastId = useToastStore.getState().addToast({
    type: 'info',
    message: t('languageOffer.later'),
    lang: htmlLangFor(lang),
    // Removed by its own timer below, so that ✕ (the store removing it sooner) can be told apart.
    duration: 0,
  });
  laterTimer = setTimeout(() => {
    laterTimer = null;
    laterExpired = true;
    if (toastId !== null) useToastStore.getState().removeToast(toastId);
    toastId = null;
  }, LANGUAGE_LATER_MS);
  stopWaiting();
  poll = setInterval(() => {
    if (state !== 'pending') return;
    // ✕ on the line before it left by itself: cancelled, nothing changes.
    if (!laterExpired && (toastId === null || !useToastStore.getState().toasts.some((x) => x.id === toastId))) {
      settle();
      return;
    }
    if (!free()) return;
    settle();
    useAppStore.getState().setLanguage(lang);
    useToastStore.getState().addToast({ type: 'info', message: t('languageOffer.now'), lang: htmlLangFor(lang), duration: LANGUAGE_NOW_MS });
  }, LANGUAGE_OFFER_POLL_MS);
}

/**
 * Offer `lang` (the boot link's, not the one the visit started in) once in
 * this visit. `bootLanguage` is the app's language at boot: if the learner
 * has chosen another one since (the start screen), or the two agree, there is
 * nothing to offer. Called on every mount of the shell (LanguageOffer.tsx):
 * a wait under way goes on (a toast raised while the shell is away shows
 * with it), a toast still up stays, one put away (✕) ends the offer.
 */
export function offerLanguage(lang: AppLanguage, bootLanguage: string): void {
  // Over, or a tap is waiting for the work to end (its own watch goes on).
  if (state === 'done' || state === 'pending') return;
  if (state === 'idle') {
    if (lang === bootLanguage || useAppStore.getState().language !== bootLanguage) {
      state = 'done';
      return;
    }
    // Any language change in this visit is the learner's own choice: it settles the offer.
    unsubscribe = useAppStore.subscribe((s, prev) => {
      if (s.language !== prev.language) settle();
    });
  }
  if (state === 'shown') {
    // Put away (✕) since: done for this visit.
    if (toastId === null || !useToastStore.getState().toasts.some((t) => t.id === toastId)) settle();
    return;
  }
  wait(lang);
}

/** Test seam: the toast was put away with ✕ (the store removed it). */
export function languageOfferState(): State {
  if (state === 'shown' && toastId !== null && !useToastStore.getState().toasts.some((t) => t.id === toastId)) settle();
  return state;
}

/** Test seam: a fresh visit. */
export function resetLanguageOffer(): void {
  stopWaiting();
  if (laterTimer !== null) clearTimeout(laterTimer);
  laterTimer = null;
  laterExpired = false;
  unsubscribe?.();
  unsubscribe = null;
  state = 'idle';
  toastId = null;
}
