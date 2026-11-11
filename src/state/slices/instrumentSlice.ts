import type { StateCreator } from 'zustand';
import type { AppState, InstrumentSlice } from '../storeTypes.ts';

export const createInstrumentSlice: StateCreator<AppState, [], [], InstrumentSlice> = (set) => ({
  instrument: 'piano',
  activeNotes: new Set<number>(),
  highlightedNotes: [],
  exerciseInputActive: false,
  guitarScalePosition: null,
  guitarTuningId: 'standard',
  // A browser with nothing saved: the neck as tab and chord charts draw it.
  // A save from before these fields gets the old view (store.ts merge).
  neckNutSide: 'left',
  neckTopString: 'high',
  // No capo (state/capo.ts sets it; saved only while 1–9).
  capoFret: 0,

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
  // Positions are generated for any tuning, so the chosen one is kept.
  setGuitarTuningId: (id) =>
    set({ guitarTuningId: id, preferencesUpdatedAt: Date.now() }),
  setNeckNutSide: (side) => set({ neckNutSide: side, preferencesUpdatedAt: Date.now() }),
  setNeckTopString: (top) => set({ neckTopString: top, preferencesUpdatedAt: Date.now() }),
});
