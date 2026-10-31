import type { StateCreator } from 'zustand';
import type { AppState, PreferencesSlice } from '../storeTypes.ts';
import { detectBrowserLanguage } from '../../i18n/language.ts';
import { DEFAULT_DOCK_DETENTS } from '../dock.ts';

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
  dockDetents: { ...DEFAULT_DOCK_DETENTS },

  setColorMode: (mode) => set({ colorMode: mode, preferencesUpdatedAt: Date.now() }),
  setThemeMode: (mode) => set({ themeMode: mode, preferencesUpdatedAt: Date.now() }),
  setScaleOctaves: (octaves) => set({ scaleOctaves: octaves, preferencesUpdatedAt: Date.now() }),
  setBaseOctave: (octave) => set({ baseOctave: octave, preferencesUpdatedAt: Date.now() }),
  setLanguage: (language) => set({ language, preferencesUpdatedAt: Date.now() }),
  setPreferencesUpdatedAt: (at) => set({ preferencesUpdatedAt: at }),
  setDockDetent: (view, detent) => {
    if (get().dockDetents[view] === detent) return;
    set((s) => ({ dockDetents: { ...s.dockDetents, [view]: detent } }));
  },
  requestDock: (detent) => {
    const view = get().view;
    if (view === 'drill') return;
    get().setDockDetent(view, detent);
  },
});
