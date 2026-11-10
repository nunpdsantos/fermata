/**
 * The start screen's three doors (wave 1) — what each one does, in ONE place.
 * Later waves route the 'new' and 'player' doors to their own lesson tracks
 * from here.
 *
 * Every door: saves the profile and the instrument, marks the first-visit
 * flag 'seen' (state/welcomeGate.ts — the start screen never returns) and
 * opens Explore. 'new' and 'player' also leave a start hint in Explore
 * (state/startHint.ts); 'theory' leaves none.
 *
 * Dó-Ré-Mi (the owner's decision, 2026-11-10): a door chosen while the
 * language is Portuguese or Spanish turns `showSolfege` on (and so saves
 * it), from the language active at that moment. HERE ONLY: never on boot,
 * a language change, a profile change in Settings, a share link, a backup or
 * a tour, and never for an existing save (none of them reaches a door). A
 * learner who turns it off stays off: nothing turns it on again.
 */
import { useAppStore, type InstrumentType } from './store.ts';
import { setLearnerProfile, type LearnerProfile } from './learnerProfile.ts';
import { closeWelcome } from './welcomeGate.ts';
import { raiseStartHint } from './startHint.ts';
import { solfegeLanguage } from '../i18n/solfege.ts';

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
  app.setView('explore');
  closeWelcome(storage);
}
