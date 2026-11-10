/**
 * The tour drives the REAL app: the same store actions and play functions
 * the buttons call, so it stays true at every release.
 *
 *  - Key / scale / chord / instrument / view: the store's own actions
 *    (setKey, setScale, setSelectedChord, setInstrument, setView,
 *    requestDock).
 *  - ▶ Chord: the chord panel's own button is pressed (its handler lights
 *    the chord's keys while it sounds and un-lights them when it ends — the
 *    tour waits for that).
 *  - ▶ Play scale: the header's call, with a completion callback (the
 *    header's button passes none). KEEP IN STEP with `playScaleNow` in
 *    components/explore/ExploreHeader.tsx — this mirrors it argument for
 *    argument; `appActions.test.ts` pins it.
 *
 * Nothing here touches the progress, drill, fingering or learn-session stores.
 */
import { useAppStore } from '../../state/store';
import type { InstrumentType, ViewMode } from '../../state/storeTypes';
import type { Chord, Note } from '../../core/types/music';
import { buildScale } from '../../core/constants/scales';
import { getDiatonicChordsForScale } from '../../core/constants/chords';
import { playScale, resumeAudio, cancelScheduledAudio, setMasterVolume } from '../../core/services/audio';
import { getSynthConfig } from '../../services/synthConfig';
import { classicalDescendingNotes } from '../../core/utils/classicalScale';
import { exploreRegister } from '../../components/explore/exploreRegister';
import { noteToString } from '../../core/types/music';
import { waitUntil } from './dom';

/** The tour's key: G major (one sharp, familiar on both instruments). */
export const TOUR_KEY: Note = { natural: 'G', accidental: '' };
export const TOUR_SCALE = 'major' as const;
/** The chord it plays: V of G major, D major (an open shape on the guitar). */
export const TOUR_CHORD_DEGREE = 5;

export function tourChord(): Chord {
  const triads = getDiatonicChordsForScale(buildScale(TOUR_KEY, TOUR_SCALE));
  return triads.find((t) => t.degree === TOUR_CHORD_DEGREE)!.chord;
}

const app = () => useAppStore.getState();

export function isTourKey(): boolean {
  const s = app();
  return noteToString(s.selectedKey) === noteToString(TOUR_KEY) && s.selectedScale === TOUR_SCALE;
}

export function chooseTourKey(): void {
  const s = app();
  if (noteToString(s.selectedKey) !== noteToString(TOUR_KEY)) s.setKey(TOUR_KEY);
  if (app().selectedScale !== TOUR_SCALE) app().setScale(TOUR_SCALE);
}

/**
 * The chords card shows "In key" (its own tab button, pressed when another
 * tab is open — the card keeps its tab in local state, which a view change
 * resets anyway). Its handler clears the chord, so call it before choosing one.
 */
export function showInKeyChords(): void {
  if (typeof document === 'undefined') return;
  const tab = document.getElementById('chords-tab-diatonic');
  if (tab && tab.getAttribute('aria-selected') === 'false') tab.click();
}

export function hasTourChord(): boolean {
  const c = app().selectedChord;
  const t = tourChord();
  return !!c && noteToString(c.root) === noteToString(t.root) && c.quality === t.quality;
}

export function chooseTourChord(): void {
  if (!hasTourChord()) app().setSelectedChord(tourChord());
}

export function clearChord(): void {
  if (app().selectedChord) app().setSelectedChord(null);
}

export function setInstrument(instrument: InstrumentType): void {
  if (app().instrument !== instrument) app().setInstrument(instrument);
}

export function goTo(view: ViewMode): void {
  if (app().view !== view) app().setView(view);
}

/**
 * Set the instrument dock of the current view (the app's own `requestDock`:
 * not recorded as the learner's choice; the snapshot gives the old detent
 * back). Half shows the instrument; Peek leaves a short screen its view.
 */
export function setDock(detent: 'peek' | 'half'): void {
  const s = app();
  if (s.view !== 'drill' && s.dockDetents[s.view] !== detent) s.requestDock(detent);
}

/** The saved volume, as the instruments apply it before a note (useAudio). */
function applySavedVolume() {
  setMasterVolume(app().volume);
}

/**
 * ▶ Play scale, as ExploreHeader's button plays it; resolves when the
 * scale has finished (or was cancelled: core settles a cancelled phrase).
 */
export async function playTourScale(signal: AbortSignal): Promise<void> {
  await resumeAudio();
  if (signal.aborted) return;
  applySavedVolume();
  const s = app();
  const scale = buildScale(s.selectedKey, s.selectedScale);
  cancelScheduledAudio();
  await new Promise<void>((resolve) => {
    const onAbort = () => {
      cancelScheduledAudio();
      resolve();
    };
    signal.addEventListener('abort', onAbort, { once: true });
    playScale(
      scale.notes,
      exploreRegister(s.instrument, s.baseOctave).octave,
      true,
      s.selectedScale === 'melodic_minor',
      0.25,
      () => {},
      () => {
        signal.removeEventListener('abort', onAbort);
        resolve();
      },
      getSynthConfig(s.synthPreset),
      classicalDescendingNotes(scale.root, s.selectedScale),
    );
  });
}

/**
 * Press the chord panel's ▶ Chord (its own handler) and resolve once the
 * chord has sounded: the handler lights the chord's keys while it sounds and
 * un-lights them when it ends.
 */
export async function pressPlayChord(button: HTMLElement, signal: AbortSignal): Promise<void> {
  applySavedVolume();
  const lit = () => app().activeNotes.size > 0;
  button.click();
  const subscribe = (l: () => void) => useAppStore.subscribe(l);
  if (!(await waitUntil(subscribe, lit, signal, 4000))) return;
  await waitUntil(subscribe, () => !lit(), signal, 6000);
}
