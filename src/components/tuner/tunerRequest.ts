/**
 * Opening the tuner (wave 3, brief T) — eager and tiny: the top bar's "⋯"
 * menu ("Tuner") and the guitar dock's "Tune" button ask for it here; the
 * tuner itself is a lazy chunk (`TunerSheet.tsx`, through `TunerHost.tsx`).
 * `attempt` counts downloads: −1 = never asked; a failed download (`failed`)
 * makes the next open a new attempt.
 */
import { create } from 'zustand';

export const useTunerRequest = create(() => ({ open: false, attempt: -1, failed: false }));

export const openTuner = () => useTunerRequest.setState((s) => ({ open: true, failed: false, attempt: s.attempt < 0 || s.failed ? s.attempt + 1 : s.attempt }));

export const closeTuner = () => useTunerRequest.setState({ open: false });
