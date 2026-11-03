import { create } from 'zustand';

/** The chord grip survives dock / full-neck remounts. Session-only, never persisted. */
interface GuitarShapeState {
  shapeChoice: { key: string; idx: number };
  setShapeChoice: (choice: GuitarShapeState['shapeChoice']) => void;
}

export const useGuitarShapeStore = create<GuitarShapeState>((set) => ({
  shapeChoice: { key: '', idx: 0 },
  setShapeChoice: (shapeChoice) => set({ shapeChoice }),
}));
