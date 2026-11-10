import type { StateCreator } from 'zustand';
import type { AppState, PreferencesSlice } from '../storeTypes.ts';
import { detectBrowserLanguage } from '../../i18n/language.ts';
import { initialDockDetents } from '../dock.ts';

export const createPreferencesSlice: StateCreator<AppState, [], [], PreferencesSlice> = (set, get) => ({
  colorMode: 'functional',
  themeMode: 'fermata',
  scaleOctaves: 1,
  baseOctave: 4,
  // First run follows the browser (pt/es/en); a persisted choice overrides
  // this default in the persist merge.
  language: detectBrowserLanguage(),
  preferencesUpdatedAt: 0,
  lastView: 'explore',
  dockDetents: initialDockDetents(),
  dockChosen: { explore: false, learn: false },
  // Tablet: the circle below the work starts folded (the column stays short).
  exploreCircleOpen: false,
  // Never asked (wave 1): the app as it was — see state/learnerProfile.ts.
  learnerProfile: null,
  startHint: null,
  // Fixed-do names beside the letters (PT / ES): off until the learner asks.
  showSolfege: false,

  setColorMode: (mode) => set({ colorMode: mode, preferencesUpdatedAt: Date.now() }),
  setThemeMode: (mode) => set({ themeMode: mode, preferencesUpdatedAt: Date.now() }),
  setScaleOctaves: (octaves) => set({ scaleOctaves: octaves, preferencesUpdatedAt: Date.now() }),
  setBaseOctave: (octave) => set({ baseOctave: octave, preferencesUpdatedAt: Date.now() }),
  setLanguage: (language) => set({ language, preferencesUpdatedAt: Date.now() }),
  setPreferencesUpdatedAt: (at) => set({ preferencesUpdatedAt: at }),
  // The learner's own setting (drag, tap, keys, Show / Hide): remembered as
  // a choice, so the screen-based default no longer applies to that view.
  setDockDetent: (view, detent) => {
    const s = get();
    if (s.dockDetents[view] === detent && s.dockChosen[view]) return;
    set({ dockDetents: { ...s.dockDetents, [view]: detent }, dockChosen: { ...s.dockChosen, [view]: true } });
  },
  setExploreCircleOpen: (open) => set({ exploreCircleOpen: open }),
  // No default value: undefined means "not chosen yet" (state/exploreDetail.ts).
  // Simple has no voicing control: its chord sounds and shows in root position.
  setExploreDetail: (detail) => set(detail === 'simple' ? { exploreDetail: detail, chordInversion: 0 } : { exploreDetail: detail }),
  setShowSolfege: (on) => set({ showSolfege: on, preferencesUpdatedAt: Date.now() }),
  // The app opening the dock for an exercise is not the learner's choice.
  requestDock: (detent) => {
    const { view, dockDetents } = get();
    if (view === 'drill' || dockDetents[view] === detent) return;
    set({ dockDetents: { ...dockDetents, [view]: detent } });
  },
});
