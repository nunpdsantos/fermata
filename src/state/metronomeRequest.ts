/**
 * Asking the top bar to open the metronome from elsewhere — Quick Search's
 * "Metronome" result (review of b94d761, item 8). The top bar's own "⋯" item
 * and this request run the same `openMetronome` (layout/TopBar.tsx), so the
 * metronome opens exactly as the menu opens it. Eager and tiny.
 */
import { create } from 'zustand';

export const useMetronomeRequest = create(() => ({ asked: 0 }));

export const requestMetronome = () => useMetronomeRequest.setState((s) => ({ asked: s.asked + 1 }));
