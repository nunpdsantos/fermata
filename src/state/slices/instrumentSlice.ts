import type { StateCreator } from 'zustand';
import type { AppState, InstrumentSlice } from '../storeTypes.ts';

export const createInstrumentSlice: StateCreator<AppState, [], [], InstrumentSlice> = (set) => ({
  instrument: 'piano',
  activeNotes: new Set<number>(),
  highlightedNotes: [],
  exerciseInputActive: false,
  guitarScalePosition: null,
  guitarTuningId: 'standard',

  setInstrument: (instrument) =>
    set({ instrument, preferencesUpdatedAt: Date.now() }),
  addActiveNote: (midi) =>
    set((state) => {
      const next = new Set(state.activeNotes);
      next.add(midi);
      return { activeNotes: next };
    }),
  removeActiveNote: (midi) =>
    set((state) => {
      const next = new Set(state.activeNotes);
      next.delete(midi);
      return { activeNotes: next };
    }),
  clearActiveNotes: () => set({ activeNotes: new Set<number>() }),
  setHighlightedNotes: (notes) => set({ highlightedNotes: notes }),
  setExerciseInputActive: (active) => set({ exerciseInputActive: active }),
  setGuitarScalePosition: (position) => set({ guitarScalePosition: position }),
  setGuitarTuningId: (id) =>
    set({ guitarTuningId: id, guitarScalePosition: null, preferencesUpdatedAt: Date.now() }),
});
