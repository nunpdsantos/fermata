import { create } from 'zustand';

type ScaleDirection = 'ascending' | 'descending';

/** Explore display state shared by the staff, dock and full neck. Never persisted. */
export const useScaleDirectionStore = create<{
  direction: ScaleDirection;
  setDirection: (direction: ScaleDirection) => void;
}>((set) => ({
  direction: 'ascending',
  setDirection: (direction) => set({ direction }),
}));
