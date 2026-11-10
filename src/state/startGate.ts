/**
 * When the start screen (components/start/) is on screen — wave 1.
 *
 *  - The first-visit gate decides at boot (state/welcomeGate.ts: no saved
 *    data, or the flag 'pending'; never after 'seen').
 *  - A shared link wins (`applyShareLinkRule`, called once by main.tsx): if
 *    the address carried one at boot, this visit shows the linked content.
 *    The flag stays 'pending', so the visitor's NEXT plain visit shows the
 *    start screen (they were never asked; this visit's saved settings do not
 *    count against it), until a door is chosen.
 *  - While a tour is requested (`useDemoRequest()` not null) it is hidden, so
 *    the app shows behind the tour; when the request clears and no door was
 *    chosen, it is back.
 */
import { useWelcomeStore } from './welcomeGate.ts';
import { hasShareParams } from './shareParams.ts';
import { useDemoRequest } from './demoRequest.ts';

/** Boot, once: a shared link in the boot address keeps the start screen away for this visit. */
export function applyShareLinkRule(): boolean {
  const { open, bootSearch } = useWelcomeStore.getState();
  let shared = false;
  try {
    shared = hasShareParams(bootSearch);
  } catch {
    shared = false;
  }
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
