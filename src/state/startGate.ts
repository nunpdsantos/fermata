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
 *  - A door chosen elsewhere (audit 2026-11-18, A19): the public pages'
 *    doors link to `/?start=new|player|theory&lang=…`. On a visit that owes
 *    the start screen, `applyStartLinkRule` (main.tsx, once, after the
 *    shared-link rule) takes that door at boot through `chooseStartDoor`,
 *    exactly as a tap would (the same saved fields, the same first screen),
 *    and the start screen never shows. Read as `shareParams` reads a link
 *    (an over-long query: nothing; the first value; at most
 *    MAX_SHARE_VALUE_LENGTH; one of START_DOORS, case and spaces forgiven as
 *    `?lang=` forgives them); anything else is ignored and the start screen
 *    shows as on a plain visit. A visitor with saved data (the gate is not
 *    open) is never re-profiled; a shared link in the same address wins, as
 *    it does over the start screen. The address bar loses `start` either way.
 *  - The same rule notes a `?view=` the boot address asked for while the
 *    start screen is owed (audit Q13; state/bootView.ts): the door opens it.
 */
import { useWelcomeStore } from './welcomeGate.ts';
import { MAX_SHARE_SEARCH_LENGTH, MAX_SHARE_VALUE_LENGTH, openedFromShareLink } from './shareParams.ts';
import { useDemoRequest } from './demoRequest.ts';
import { useAppStore } from './store.ts';
import { START_DOORS, chooseStartDoor } from './startDoors.ts';
import { carryViewRequest, requestedView } from './bootView.ts';
import type { LearnerProfile } from './learnerProfile.ts';

/** The address parameter that carries a door chosen on a public page. */
export const START_PARAM = 'start';

/** The door a query string's `?start=` names, sanitised as a shared link's values are; null otherwise. */
export function readStartDoor(search: string): LearnerProfile | null {
  if (search.length > MAX_SHARE_SEARCH_LENGTH) return null;
  const raw = new URLSearchParams(search).get(START_PARAM);
  if (raw === null || raw.length > MAX_SHARE_VALUE_LENGTH) return null;
  const value = raw.trim().toLowerCase();
  return (START_DOORS as readonly string[]).includes(value) ? (value as LearnerProfile) : null;
}

/** The address without `start` (every other parameter and the fragment as they were). */
function withoutStartParam(pathname: string, search: string, hash: string): string {
  const params = new URLSearchParams(search);
  params.delete(START_PARAM);
  const qs = params.toString();
  return pathname + (qs ? `?${qs}` : '') + hash;
}

/**
 * Boot, once, after `applyShareLinkRule` (main.tsx): the door a public page's
 * link carries, and a view the address asks for, while the start screen is
 * owed. Returns the door taken, or null.
 */
export function applyStartLinkRule(
  where: Pick<Location, 'pathname' | 'search' | 'hash'> = window.location,
  history: Pick<History, 'replaceState' | 'state'> | undefined = typeof window === 'undefined' ? undefined : window.history,
): LearnerProfile | null {
  const { pathname, search, hash } = where;
  if (new URLSearchParams(search).has(START_PARAM)) history?.replaceState(history.state, '', withoutStartParam(pathname, search, hash));
  // Not owed (saved data, or a shared link won this visit): nothing to take.
  if (!useWelcomeStore.getState().open) return null;
  carryViewRequest(requestedView(search));
  const door = readStartDoor(search);
  if (door) chooseStartDoor(door, useAppStore.getState().instrument);
  return door;
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
