import type { StateCreator } from 'zustand';
import type { AppState, NavigationSlice } from '../storeTypes.ts';

export const createNavigationSlice: StateCreator<AppState, [], [], NavigationSlice> = (set) => ({
  view: 'explore',
  detailPanelOpen: false,
  quickSearchOpen: false,
  comparisonScale: null,
  pendingLearnTarget: null,

  setView: (view) =>
    // Clear view-bound selections + stop any held notes so audio doesn't bleed
    // across views (e.g. MIDI/keyboard note held while switching tabs). Also
    // mirror the destination into lastView (a PreferencesSlice field — written
    // here via the combined store set) so a fresh boot can restore it.
    set({
      view,
      lastView: view,
      detailPanelOpen: false,
      selectedChord: null,
      selectedDegree: null,
      activeNotes: new Set(),
    }),
  // Deep links preserve the caller's selections, unlike the tab-switch reset.
  // Record the boot destination in the same update as the in-memory target.
  openLearnTarget: (target) => set({ view: 'learn', lastView: 'learn', pendingLearnTarget: target }),
  setDetailPanelOpen: (open) => set({ detailPanelOpen: open }),
  setQuickSearchOpen: (open) => set({ quickSearchOpen: open }),
  setComparisonScale: (scale) => set({ comparisonScale: scale }),
  setPendingLearnTarget: (target) => set({ pendingLearnTarget: target }),
});
