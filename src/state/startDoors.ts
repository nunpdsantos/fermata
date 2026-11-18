/**
 * The start screen's three doors (wave 1) — what each one does, in ONE place.
 *
 * Every door: saves the profile and the instrument and marks the first-visit
 * flag 'seen' (state/welcomeGate.ts — the start screen never returns).
 * Where it leads (wave 2, 2026-11-10):
 *  - 'new'    — lesson 1 of "Start with sound" (data/tracks.ts), through
 *               openLearnTarget; its start hint is still owed and shows the
 *               first time they open Explore;
 *  - 'player' — Explore, with its start hint (which offers lesson 1 of "From
 *               the chords you know" once that lesson exists);
 *  - 'theory' — Explore, no hint.
 *
 * Dó-Ré-Mi (the owner's decision, 2026-11-10): a door chosen while the
 * language is Portuguese or Spanish turns `showSolfege` on (and so saves
 * it), from the language active at that moment. HERE ONLY: never on boot,
 * a language change, a profile change in Settings, a share link, a backup or
 * a tour, and never for an existing save (none of them reaches a door). A
 * learner who turns it off stays off: nothing turns it on again.
 *
 * A view the boot address asked for (`?view=drill`, the installed app's
 * shortcut, on a first visit: audit 2026-11-18, Q13) is where the door
 * leads instead; "new" still opens its lesson when that view is Learn.
 * A door can also be taken by a link (`?start=<door>`, the public pages'
 * doors: state/startGate.ts `applyStartLinkRule`) — through this same
 * function, so the saved fields and the first screen are a tap's.
 */
import { useAppStore, type InstrumentType } from './store.ts';
import { setLearnerProfile, type LearnerProfile } from './learnerProfile.ts';
import { closeWelcome } from './welcomeGate.ts';
import { raiseStartHint } from './startHint.ts';
import { solfegeLanguage } from '../i18n/solfege.ts';
import { TRACKS, firstLessonOf } from '../data/tracks.ts';
import { takeViewRequest } from './bootView.ts';

/** The three doors, in the start screen's order (the public pages' doors carry the same ids). */
export const START_DOORS: readonly LearnerProfile[] = ['new', 'player', 'theory'];

export function chooseStartDoor(
  profile: LearnerProfile,
  instrument: InstrumentType,
  storage: Storage | undefined = globalThis.localStorage,
): void {
  const app = useAppStore.getState();
  setLearnerProfile(profile);
  if (app.instrument !== instrument) app.setInstrument(instrument);
  raiseStartHint(profile === 'theory' ? null : profile);
  if (solfegeLanguage(app.language) && !app.showSolfege) app.setShowSolfege(true);
  const asked = takeViewRequest();
  const home = profile === 'new' ? 'learn' : 'explore';
  if (profile === 'new' && (asked ?? home) === 'learn') app.openLearnTarget(firstLessonOf(TRACKS.sound));
  else app.setView(asked ?? home);
  closeWelcome(storage);
}
