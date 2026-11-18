/**
 * When the start screen (components/start/) is on screen — wave 1.
 *
 *  - The first-visit gate decides at boot (state/welcomeGate.ts: no saved
 *    data, or the flag 'pending'; never after 'seen').
 *  - A shared link wins (`applyShareLinkRule`, called once by main.tsx): if
 *    the page was opened from one (`openedFromShareLink()`, state/shareParams.ts
 *    — the one answer, noted from the boot address before the first render),
 *    this visit shows the linked content.
 *    The flag stays 'pending', so the visitor's NEXT plain visit shows the
 *    start screen (they were never asked; this visit's saved settings do not
 *    count against it), until a door is chosen — unless they have really used
 *    the app since (Learn progress, Drill, an open lesson, fingerings: any
 *    store beyond the settings; `hasLearningData` in welcomeGate.ts). Then
 *    they are a returning learner: never shown, the flag settles 'seen'.
 *  - While a tour is requested (`useDemoRequest()` not null) it is hidden, so
 *    the app shows behind the tour; when the request clears and no door was
 *    chosen, it is back.
 *  - A door chosen on a public page (`?start=`) and a `?view=` asked for
 *    while it is owed (audit 2026-11-18, A19 and Q13): `startLinkPending`
 *    below, and state/startLink.ts.
 */
import { useWelcomeStore } from './welcomeGate.ts';
import { openedFromShareLink } from './shareParams.ts';
import { useDemoRequest } from './demoRequest.ts';

/** The address parameter that carries a door chosen on a public page (audit 2026-11-18, A19: state/startLink.ts). */
export const START_PARAM = 'start';

/**
 * Boot, once, after `applyShareLinkRule` (main.tsx): does this address need
 * `state/startLink.ts` — a door from a public page (`?start=`, read on any
 * visit so the address bar loses it), or a `?view=` asked for while the start
 * screen is owed (Q13)? Then main.tsx loads it and renders once it has run.
 * Everything else about those links lives in that lazy module, out of the
 * entry bundle.
 */
export function startLinkPending(search: string): boolean {
  const params = new URLSearchParams(search);
  return params.has(START_PARAM) || (useWelcomeStore.getState().open && params.has('view'));
}

/** Boot, once: a shared link in the boot address keeps the start screen away for this visit. */
export function applyShareLinkRule(): boolean {
  const { open } = useWelcomeStore.getState();
  const shared = openedFromShareLink();
  if (open && shared) useWelcomeStore.setState({ open: false, shownThisPage: false });
  return open && shared;
}

/** The gate is open (no door chosen yet in this first visit). */
export function useStartScreenOwed(): boolean {
  return useWelcomeStore((s) => s.open);
}

/** The start screen is the page now (owed, and no tour asked for). */
export function useStartScreenShown(): boolean {
  const owed = useStartScreenOwed();
  const tour = useDemoRequest();
  return owed && tour === null;
}
