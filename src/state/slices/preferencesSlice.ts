import type { StateCreator } from 'zustand';
import type { AppState, PreferencesSlice } from '../storeTypes.ts';

export const createPreferencesSlice: StateCreator<AppState, [], [], PreferencesSlice> = (set) => ({
  colorMode: 'functional',
  themeMode: 'fermata',
  scaleOctaves: 1,
  baseOctave: 4,
  language: 'en',
  preferencesUpdatedAt: 0,
  lastView: 'explore',

  setColorMode: (mode) => set({ colorMode: mode, preferencesUpdatedAt: Date.now() }),
  setThemeMode: (mode) => set({ themeMode: mode, preferencesUpdatedAt: Date.now() }),
  setScaleOctaves: (octaves) => set({ scaleOctaves: octaves, preferencesUpdatedAt: Date.now() }),
  setBaseOctave: (octave) => set({ baseOctave: octave, preferencesUpdatedAt: Date.now() }),
  setLanguage: (language) => set({ language, preferencesUpdatedAt: Date.now() }),
  setPreferencesUpdatedAt: (at) => set({ preferencesUpdatedAt: at }),
});
