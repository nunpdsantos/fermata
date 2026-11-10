/**
 * Opening a shared link (wave 1, stream E). Loaded lazily by App.tsx, only
 * when the address carries share parameters (state/shareParams.ts).
 *
 * A link is the learner's own action, so it may change what Explore shows —
 * key, scale, chord, instrument — or open a lesson. Two rules:
 *
 *  1. Only what is valid is applied (services/shareLinkParse.ts); nothing
 *     invalid reaches the store. A link with nothing valid in it opens the app
 *     as usual, with one line saying so.
 *  2. It never discards work in progress (services/workInProgress.ts: a check
 *     under way, a Drill session with answers, a Sprint). Opening a lesson
 *     other than the one being checked would drop that check (LearnView
 *     clears a check whose lesson is left), and switching views mid-Sprint
 *     breaks its flow. So while there is work, NOTHING is applied: a toast
 *     says what the link opens and that it will wait; once the work is over
 *     (checked every 1.5 s) a second toast offers it with "Open". Choosing
 *     Open when work has started again waits again. The held link lives in
 *     this page only (the address bar was already cleaned): a reload drops it.
 */
import i18n from '../i18n/index.ts';
import { useAppStore } from '../state/store.ts';
import { toast, useToastStore } from '../state/toastStore.ts';
import { hasWorkInProgress } from './workInProgress.ts';
import { withGlyphs } from '../core/utils/accidentalGlyphs.ts';
import { getModuleTitle, loadModuleIndex } from '../data/moduleIndexI18n.ts';
import { parseShareLink, isEmptyTarget, type ShareTarget } from './shareLinkParse.ts';
import type { RawShareParams } from '../state/shareParams.ts';

/** How often a held link checks whether the work is over. */
export const HELD_LINK_POLL_MS = 1500;
const WAIT_TOAST_MS = 8000;
const UNREADABLE_TOAST_MS = 6000;

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts) as string;

/**
 * Apply a valid target. A lesson link opens that lesson (openLearnTarget) and
 * sets the instrument; key / scale / chord beside a lesson are not applied
 * (the lesson drives the instrument, D-20). Otherwise Explore opens on the
 * link's key, scale and chord — the view first: leaving Learn gives back a
 * lesson's borrowed selection (lessonInstrument.ts), which must not land on
 * top of the link's.
 */
export function applyShareTarget(target: ShareTarget): void {
  const s = useAppStore.getState();
  if (target.inst && target.inst !== s.instrument) s.setInstrument(target.inst);
  if (target.lesson) {
    useAppStore.getState().openLearnTarget(target.lesson);
    return;
  }
  if (!target.key && !target.scale && !target.chord) return;
  if (useAppStore.getState().view !== 'explore') useAppStore.getState().setView('explore');
  // Scale before key: setScale never respells, so the link's spelling stands.
  if (target.scale) useAppStore.getState().setScale(target.scale);
  if (target.key) useAppStore.getState().setKey(target.key);
  if (target.chord) useAppStore.getState().setSelectedChord(target.chord);
}

/** "D Major, the A chord, on the guitar" / "the lesson “The Major Scale”", in the app's language. */
export function describeShareTarget(target: ShareTarget): string {
  const lang = i18n.language || 'en';
  if (target.lesson) {
    const title = getModuleTitle(target.lesson.moduleId, lang) ?? target.lesson.moduleId;
    return t('share.target.lesson', { title });
  }
  const parts: string[] = [];
  if (target.key || target.scale) {
    const s = useAppStore.getState();
    const key = target.key ?? s.selectedKey;
    const scale = target.scale ?? s.selectedScale;
    parts.push(`${withGlyphs(key)} ${t(`scaleName.${scale}`)}`);
  }
  if (target.chordSymbol) parts.push(t('share.target.chord', { chord: withGlyphs(target.chordSymbol) }));
  if (target.inst) parts.push(t(parts.length ? `share.target.${target.inst}` : `share.target.${target.inst}Alone`));
  return parts.join(', ');
}

let held: ShareTarget | null = null;
let poll: ReturnType<typeof setInterval> | null = null;
let waitToastId: string | null = null;

function stopPolling(): void {
  if (poll !== null) clearInterval(poll);
  poll = null;
}

function offerWhenFree(target: ShareTarget): void {
  held = target;
  stopPolling();
  waitToastId = useToastStore.getState().addToast({
    type: 'info',
    message: t('share.waiting', { target: describeShareTarget(target) }),
    duration: WAIT_TOAST_MS,
  });
  poll = setInterval(() => {
    if (hasWorkInProgress()) return;
    stopPolling();
    const ready = held;
    held = null;
    if (!ready) return;
    if (waitToastId) useToastStore.getState().removeToast(waitToastId);
    waitToastId = null;
    useToastStore.getState().addToast({
      type: 'info',
      message: t('share.ready', { target: describeShareTarget(ready) }),
      // Stays until the learner opens it or dismisses it.
      duration: 0,
      action: { label: t('share.open'), onSelect: () => openNowOrWait(ready) },
    });
  }, HELD_LINK_POLL_MS);
}

/** "Open" on the offer: apply, unless work has started again — then wait again. */
export function openNowOrWait(target: ShareTarget): void {
  if (hasWorkInProgress()) offerWhenFree(target);
  else applyShareTarget(target);
}

export type OpenResult = 'applied' | 'held' | 'unreadable';

/**
 * Open the link the page was started with (App.tsx, at boot, after the boot
 * view is set). Never throws.
 */
export async function openShareLink(raw: RawShareParams | null): Promise<OpenResult> {
  let target: ShareTarget = {};
  try {
    target = parseShareLink(raw);
  } catch {
    target = {};
  }
  if (isEmptyTarget(target)) {
    toast(t('share.unreadable'), 'info', UNREADABLE_TOAST_MS);
    return 'unreadable';
  }
  // A lesson's title in the learner's language, for the toasts (English if
  // that index cannot load).
  if (target.lesson) await loadModuleIndex(i18n.language || 'en').catch(() => null);
  if (hasWorkInProgress()) {
    offerWhenFree(target);
    return 'held';
  }
  try {
    applyShareTarget(target);
  } catch {
    // A store action failing must not take the app down with it.
  }
  return 'applied';
}

/** Test seam: the link waiting for the work to end, if any. */
export function heldShareTarget(): ShareTarget | null {
  return held;
}

/** Test seam: forget any held link and stop watching. */
export function resetShareLinkOpen(): void {
  held = null;
  waitToastId = null;
  stopPolling();
}
