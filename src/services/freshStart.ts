/**
 * "Fresh start" (W9b) — the moment a waiting app update may apply itself
 * silently, before the learner starts (usePWA).
 *
 * A fresh start BEGINS at
 *   1. a cold launch — this page was just opened (tracking starts with the
 *      app's first render; a page opened in the background starts when it is
 *      first shown), or
 *   2. a return after a long absence — the page becomes visible again after
 *      being hidden for at least LONG_ABSENCE_MS (30 minutes, the usual
 *      "new visit" boundary in web analytics),
 * and it ENDS at the learner's first interaction (pointer down, key down,
 * wheel, touch — any of them, trusted or not: ending early only falls back to
 * the prompt) or after FRESH_START_WINDOW_MS (15 s), whichever comes first.
 *
 * So an update that is waiting at launch, or finishes installing within the
 * first seconds while nobody has touched anything, can go in without a word;
 * an update that arrives once the learner is busy always asks.
 */

export const LONG_ABSENCE_MS = 30 * 60_000;
export const FRESH_START_WINDOW_MS = 15_000;
const INTERACTIONS = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

let startedAt: number | null = null;
let interacted = false;
let hiddenAt: number | null = null;
let tracking = false;

function begin(): void {
  startedAt = Date.now();
  interacted = false;
}

/**
 * Start tracking (once per page). `onFreshStart` is called when a NEW fresh
 * start begins after launch (first shown, or back after a long absence) — the
 * cue to re-check a waiting update.
 */
export function startFreshStartTracking(onFreshStart: () => void): void {
  if (tracking || typeof document === 'undefined') return;
  tracking = true;

  let shownYet = document.visibilityState !== 'hidden';
  if (shownYet) begin();
  else hiddenAt = Date.now();

  const onInteract = () => {
    interacted = true;
  };
  for (const type of INTERACTIONS) window.addEventListener(type, onInteract, { capture: true, passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      hiddenAt = Date.now();
      return;
    }
    const away = hiddenAt === null ? 0 : Date.now() - hiddenAt;
    hiddenAt = null;
    if (!shownYet || away >= LONG_ABSENCE_MS) {
      shownYet = true;
      begin();
      onFreshStart();
    }
  });
}

/** True during a fresh start: just launched / back after a long absence, untouched, within the window. */
export function isFreshStart(): boolean {
  return startedAt !== null && !interacted && Date.now() - startedAt <= FRESH_START_WINDOW_MS;
}
