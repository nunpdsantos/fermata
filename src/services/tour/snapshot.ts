/**
 * What the tour touches, taken before it starts and given back when it ends
 * or is stopped (unless the viewer chose "Stay here").
 *
 * Touched: the view (and lastView), Explore's key, scale, chord, inversion and
 * degree, the instrument (and preferencesUpdatedAt, which setInstrument
 * stamps), the dock's detents (and whether the learner chose them), the
 * chord-detail / comparison state, the chord grip shared by dock and full
 * neck, and the classical-minor direction. Lit keys are cleared.
 *
 * While the tour plays, the saved settings ('music-theory-app') are NOT
 * written: a reload or a closed tab mid-tour boots exactly as before it. The
 * one save happens when the tour ends (`release`), of whatever the app then
 * shows — restored, or kept with "Stay here".
 */
import { useAppStore } from '../../state/store';
import type { AppState, ViewMode } from '../../state/storeTypes';
import { useGuitarShapeStore } from '../../state/guitarShapeStore';
import { useScaleDirectionStore } from '../../state/scaleDirectionStore';
import { LEARN_SESSION_KEY } from '../../state/learnSessionPersistence';
import { cancelScheduledAudio } from '../../core/services/audio';
import { returnIsQuiet } from './guards';

type Saved = Pick<AppState,
  | 'view' | 'lastView' | 'selectedChord' | 'chordInversion' | 'selectedDegree'
  | 'instrument' | 'preferencesUpdatedAt' | 'dockDetents' | 'dockChosen'
  | 'detailPanelOpen' | 'comparisonScale'>;

export interface TourSnapshot {
  app: Saved;
  /** Explore's OWN key and scale (a lesson may be borrowing the instrument). */
  key: AppState['selectedKey'];
  scale: AppState['selectedScale'];
  shapeChoice: ReturnType<typeof useGuitarShapeStore.getState>['shapeChoice'];
  direction: ReturnType<typeof useScaleDirectionStore.getState>['direction'];
  /** Whether Learn's session record existed (Learn's first opening saves an empty one). */
  learnSessionKeyExisted: boolean;
}

export function takeSnapshot(): TourSnapshot {
  const s = useAppStore.getState();
  const own = s.lessonLoan ?? { key: s.selectedKey, scale: s.selectedScale };
  return {
    app: {
      view: s.view,
      lastView: s.lastView,
      selectedChord: s.selectedChord,
      chordInversion: s.chordInversion,
      selectedDegree: s.selectedDegree,
      instrument: s.instrument,
      preferencesUpdatedAt: s.preferencesUpdatedAt,
      dockDetents: s.dockDetents,
      dockChosen: s.dockChosen,
      detailPanelOpen: s.detailPanelOpen,
      comparisonScale: s.comparisonScale,
    },
    key: own.key,
    scale: own.scale,
    shapeChoice: useGuitarShapeStore.getState().shapeChoice,
    direction: useScaleDirectionStore.getState().direction,
    learnSessionKeyExisted: storageHas(LEARN_SESSION_KEY),
  };
}

function storageHas(key: string): boolean {
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return true; // unknown: never remove anything
  }
}

/**
 * The view the restore lands on: where the viewer was — unless going back
 * there would make Learn or Drill write (guards.ts), then Explore, which
 * writes nothing (the rest is restored all the same).
 */
export function returnView(snap: TourSnapshot): ViewMode {
  return returnIsQuiet(snap.app.view) ? snap.app.view : 'explore';
}

/** Put the app back as the snapshot found it. */
export function restoreSnapshot(snap: TourSnapshot): ViewMode {
  cancelScheduledAudio();
  const view = returnView(snap);
  const app = useAppStore.getState();
  if (app.view !== view) app.setView(view);
  useAppStore.setState({
    ...snap.app,
    view,
    lastView: view === snap.app.view ? snap.app.lastView : view,
    selectedKey: snap.key,
    selectedScale: snap.scale,
    activeNotes: new Set<number>(),
  });
  useGuitarShapeStore.setState({ shapeChoice: snap.shapeChoice });
  useScaleDirectionStore.setState({ direction: snap.direction });
  return view;
}

/**
 * Learn saves an empty "no lesson open" record the first time it opens. If
 * the tour's visit made it (none before, nothing in it now), take it away
 * again, so the storage is exactly as the tour found it.
 */
export function removeEmptyLearnRecord(snap: TourSnapshot): void {
  if (snap.learnSessionKeyExisted) return;
  try {
    const raw = localStorage.getItem(LEARN_SESSION_KEY);
    if (raw === null) return;
    const saved = JSON.parse(raw) as { state?: { screen?: unknown; check?: unknown } };
    if (saved?.state && saved.state.screen == null && saved.state.check == null) localStorage.removeItem(LEARN_SESSION_KEY);
  } catch {
    // leave it
  }
}

/**
 * Hold the saved settings while the tour plays: the store keeps working in
 * memory, nothing is written to 'music-theory-app'. Returns `release`, which
 * restores saving and saves once (the state the app is in at that moment).
 */
export function holdAppSaving(): () => void {
  const persist = useAppStore.persist;
  const current = persist?.getOptions().storage;
  if (!persist || !current) return () => {};
  // Never wrap a wrapper (a hold left by a tour that did not end cleanly).
  const real = (current as HeldStorage)[REAL] ?? current;
  const held: HeldStorage = {
    getItem: (name) => real.getItem(name),
    setItem: () => {},
    removeItem: () => {},
    [REAL]: real,
  };
  persist.setOptions({ storage: held });
  let released = false;
  return () => {
    if (released) return;
    released = true;
    persist.setOptions({ storage: real });
    useAppStore.setState({});
  };
}

const REAL = Symbol('tour: the real settings storage');
type AppStorage = NonNullable<ReturnType<typeof useAppStore.persist.getOptions>['storage']>;
type HeldStorage = AppStorage & { [REAL]?: AppStorage };
