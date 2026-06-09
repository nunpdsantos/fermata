import type { StateCreator } from 'zustand';
import type { AppState, AudioSlice } from '../storeTypes.ts';

export const createAudioSlice: StateCreator<AppState, [], [], AudioSlice> = (set) => ({
  synthPreset: 'piano',
  volume: 0.7,
  isPlaying: false,

  setVolume: (volume) => set({ volume, preferencesUpdatedAt: Date.now() }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
});
