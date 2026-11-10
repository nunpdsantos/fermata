/**
 * The start screen's three doors (wave 1) — what each one does, in ONE place.
 * Later waves route the 'new' and 'player' doors to their own lesson tracks
 * from here.
 *
 * Every door: saves the profile and the instrument, marks the first-visit
 * flag 'seen' (state/welcomeGate.ts — the start screen never returns) and
 * opens Explore. 'new' and 'player' also leave a start hint in Explore
 * (state/startHint.ts); 'theory' leaves none.
 */
import { useAppStore, type InstrumentType } from './store.ts';
import { setLearnerProfile, type LearnerProfile } from './learnerProfile.ts';
import { closeWelcome } from './welcomeGate.ts';
import { raiseStartHint } from './startHint.ts';

export function chooseStartDoor(
  profile: LearnerProfile,
  instrument: InstrumentType,
  storage: Storage | undefined = globalThis.localStorage,
): void {
  const app = useAppStore.getState();
  setLearnerProfile(profile);
  if (app.instrument !== instrument) app.setInstrument(instrument);
  raiseStartHint(profile === 'theory' ? null : profile);
  app.setView('explore');
  closeWelcome(storage);
}
