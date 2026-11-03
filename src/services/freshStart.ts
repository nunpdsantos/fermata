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
 * and it ENDS at the learner's first interaction or after
 * FRESH_START_WINDOW_MS (15 s), whichever comes first. Interaction = pointer
 * down, key down, wheel, touch, a focus move (focusin) or a VERTICAL scroll —
 * the last two because a screen-reader user in browse mode moves focus and
 * scrolls the content without any pointer or key event reaching the page
 * (review W9b-f). Horizontal scrolls do not count: the app itself scrolls the
 * piano strip sideways at boot (to centre middle C — observed on every
 * launch into Explore, and into Learn on a phone), which would otherwise end
 * every fresh start. Any of these events counts, trusted or not: ending early
 * only falls back to the prompt.
 *
 * So an update that is waiting at launch, or finishes installing within the
 * first seconds while nobody has touched anything, can go in without a word;
 * an update that arrives once the learner is busy always asks.
 */

export const LONG_ABSENCE_MS = 30 * 60_000;
export const FRESH_START_WINDOW_MS = 15_000;
const INTERACTIONS = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'focusin', 'scroll'] as const;

let startedAt: number | null = null;
/** Last vertical position seen per scrolled element (or the page). */
const lastScrollTop = new WeakMap<object, number>();

/** Did this scroll event move its element (or the page) up or down? */
function scrolledVertically(event: Event): boolean {
  const target = event.target;
  const isPage = target === document || target === window || target === document.documentElement || target === null;
  const key: object = isPage ? document : (target as object);
  const top = isPage ? window.scrollY : target instanceof Element ? target.scrollTop : 0;
  const before = lastScrollTop.get(key) ?? 0;
  lastScrollTop.set(key, top);
  return top !== before;
}
let interacted = false;
let interactionCount = 0;
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

  const onInteract = (event: Event) => {
    if (event.type === 'scroll' && !scrolledVertically(event)) return;
    interacted = true;
    interactionCount++;
  };
  // Capture on the window: the capture phase runs for events that do not
  // bubble too, so a scroll of any element (not only the page) is seen here.
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

/** Monotonic across fresh starts: detects activity after an irreversible update request. */
export function getInteractionCount(): number {
  return interactionCount;
}
