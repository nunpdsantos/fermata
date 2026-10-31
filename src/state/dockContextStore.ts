import { create } from 'zustand';

/**
 * What the instrument is showing, for the dock bar's context line ("Position
 * II · 1 octave"). The fretboard publishes the position it actually draws
 * (the automatic suggestion included); null = not a scale-position view.
 * Kept out of the main store: it is derived display state, never persisted.
 */
interface DockContextState {
  guitarPosition: number | 'all' | null;
  setGuitarPosition: (p: number | 'all' | null) => void;
}

export const useDockContextStore = create<DockContextState>((set) => ({
  guitarPosition: null,
  setGuitarPosition: (guitarPosition) => set({ guitarPosition }),
}));
