import type { StateCreator } from 'zustand';
import type { AppState, InstrumentSlice } from '../storeTypes.ts';

export const createInstrumentSlice: StateCreator<AppState, [], [], InstrumentSlice> = (set) => ({
  instrument: 'piano',
  activeNotes: new Set<number>(),
  highlightedNotes: [],
  exerciseInputActive: false,
  guitarScalePosition: null,
  guitarTuningId: 'standard',
  // A browser with nothing saved (since 2026-11-14): the neck as you see it
  // facing a right-handed player — open strings on the right, thick string
  // on top: LEGACY_NECK (store.ts), which partialize never writes, so a new
  // browser saves nothing about the neck until the learner changes it.
  neckNutSide: 'right',
  neckTopString: 'low',
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
