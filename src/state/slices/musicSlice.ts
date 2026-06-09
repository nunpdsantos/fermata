import type { StateCreator } from 'zustand';
import type { AppState, MusicSlice } from '../storeTypes.ts';

export const createMusicSlice: StateCreator<AppState, [], [], MusicSlice> = (set) => ({
  selectedKey: { natural: 'C', accidental: '' },
  selectedScale: 'major',
  selectedChord: null,
  selectedDegree: null,
  chordInversion: 0,

  setKey: (key) =>
    set({ selectedKey: key, selectedChord: null, selectedDegree: null, guitarScalePosition: null }),
  setScale: (scale) =>
    set({ selectedScale: scale, selectedChord: null, selectedDegree: null, guitarScalePosition: null, comparisonScale: null }),
  setSelectedChord: (chord) =>
    set({ selectedChord: chord, chordInversion: 0 }),
  setSelectedDegree: (degree) => set({ selectedDegree: degree }),
  setChordInversion: (inversion) => set({ chordInversion: inversion }),
});
