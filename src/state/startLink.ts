/**
 * A start-screen door chosen elsewhere, and a view asked for through the
 * start screen (audit 2026-11-18, A19 and Q13) — lazy: main.tsx loads it only
 * when `startLinkPending` (state/startGate.ts) says the boot address needs it,
 * and renders once it has run.
 *
 *  - A19: the public pages' doors link to `/?start=new|player|theory&lang=…`.
 *    On a visit that owes the start screen, the door is taken here through
 *    the start screen's own `chooseStartDoor`, exactly as a tap would (the
 *    same saved fields, the same first screen), before anything renders, so
 *    the start screen never shows. Read as `shareParams` reads a link: a query
 *    over MAX_SHARE_SEARCH_LENGTH counts for nothing; the first value; at most
 *    MAX_SHARE_VALUE_LENGTH; one of START_DOORS, case and spaces forgiven as
 *    `?lang=` forgives them. Anything else is ignored and the start screen
 *    asks, as on a plain visit. A visitor with saved data (the gate is not
 *    open) is never re-profiled; a shared link in the same address wins, as
 *    it does over the start screen (`applyShareLinkRule` ran first). The
 *    address bar loses `start` either way.
 *  - Q13: `view` is not a share parameter, so the start screen still asks who
 *    the visitor is; the view the address asked for is noted
 *    (`carryViewRequest`) and the door then opens it instead of its own.
 */
import { useWelcomeStore } from './welcomeGate.ts';
import { MAX_SHARE_SEARCH_LENGTH, MAX_SHARE_VALUE_LENGTH } from './shareParams.ts';
import { START_PARAM } from './startGate.ts';
import { START_DOORS, carryViewRequest, chooseStartDoor } from './startDoors.ts';
import { isViewMode } from './bootView.ts';
import { useAppStore } from './store.ts';
import type { LearnerProfile } from './learnerProfile.ts';

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

/** Boot, once, before the first render (main.tsx). Returns the door taken, or null. */
export function applyStartLink(
  where: Pick<Location, 'pathname' | 'search' | 'hash'> = window.location,
  history: Pick<History, 'replaceState' | 'state'> | undefined = typeof window === 'undefined' ? undefined : window.history,
): LearnerProfile | null {
  const { pathname, search, hash } = where;
  if (new URLSearchParams(search).has(START_PARAM)) history?.replaceState(history.state, '', withoutStartParam(pathname, search, hash));
  // Not owed (saved data, or a shared link won this visit): nothing to take.
  if (!useWelcomeStore.getState().open) return null;
  const view = new URLSearchParams(search).get('view');
  carryViewRequest(isViewMode(view) ? view : null);
  const door = readStartDoor(search);
  if (door) chooseStartDoor(door, useAppStore.getState().instrument);
  return door;
}
