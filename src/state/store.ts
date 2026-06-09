import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMusicSlice } from './slices/musicSlice.ts';
import { createInstrumentSlice } from './slices/instrumentSlice.ts';
import { createAudioSlice } from './slices/audioSlice.ts';
import { createNavigationSlice } from './slices/navigationSlice.ts';
import { createPreferencesSlice } from './slices/preferencesSlice.ts';
import { SCALE_FORMULAS } from '../core/constants/scales.ts';
import type { AppState } from './storeTypes.ts';

// Re-export types so consumers don't need to change imports
export type { AppState, ViewMode, InstrumentType, ColorMode, ThemeMode } from './storeTypes.ts';

const NUMERIC_KEYS = ['baseOctave', 'scaleOctaves', 'volume', 'preferencesUpdatedAt'] as const;

/**
 * Per-field shape guard for persisted app state. localStorage is
 * user-editable; a corrupted field must fall back to the slice default
 * without nuking the rest of the persisted state. Invalid fields are
 * deleted so the slice-created defaults win in the merge.
 */
function sanitizePersistedAppState(persisted: unknown): Record<string, unknown> | null {
  if (typeof persisted !== 'object' || persisted === null || Array.isArray(persisted)) return null;
  const state = { ...(persisted as Record<string, unknown>) };

  // selectedKey: { natural: A-G, accidental: '' | '#' | 'b' }
  const key = state.selectedKey as Record<string, unknown> | null | undefined;
  if (
    typeof key !== 'object' || key === null ||
    typeof key.natural !== 'string' || !/^[A-G]$/.test(key.natural) ||
    (key.accidental !== '' && key.accidental !== '#' && key.accidental !== 'b')
  ) {
    delete state.selectedKey;
  }

  // selectedScale: must be a known scale type
  if (typeof state.selectedScale !== 'string' || !(state.selectedScale in SCALE_FORMULAS)) {
    delete state.selectedScale;
  }

  // Numeric fields: anything non-finite falls back to the slice default
  for (const k of NUMERIC_KEYS) {
    if (typeof state[k] !== 'number' || !Number.isFinite(state[k])) {
      delete state[k];
    }
  }

  return state;
}

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createMusicSlice(...a),
      ...createInstrumentSlice(...a),
      ...createAudioSlice(...a),
      ...createNavigationSlice(...a),
      ...createPreferencesSlice(...a),
    }),
    {
      name: 'music-theory-app',
      version: 5,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedKey: state.selectedKey,
        selectedScale: state.selectedScale,
        instrument: state.instrument,
        guitarTuningId: state.guitarTuningId,
        baseOctave: state.baseOctave,
        colorMode: state.colorMode,
        scaleOctaves: state.scaleOctaves,
        volume: state.volume,
        themeMode: state.themeMode,
        language: state.language,
        preferencesUpdatedAt: state.preferencesUpdatedAt,
      }),
      migrate: (persisted: unknown, version: number) => {
        const state = persisted && typeof persisted === 'object'
          ? { ...(persisted as Record<string, unknown>) }
          : persisted;
        if (version < 2 && state && typeof state === 'object') {
          (state as Record<string, unknown>).preferencesUpdatedAt = 0;
        }
        // (v3 added midiInput* defaults; those keys left the schema in v4, so the
        //  v3 step is gone — the v4 step below strips any stale values from old state.)
        if (version < 4 && state && typeof state === 'object') {
          const s = state as Record<string, unknown>;
          for (const k of [
            'synthPreset', 'midiOutputEnabled', 'midiOutputDeviceId',
            'midiInputEnabled', 'midiInputDeviceId',
            'metronomeBPM', 'metronomeBeats', 'metronomeVolume',
          ]) delete s[k];
        }
        if (version < 5 && state && typeof state === 'object') {
          const s = state as Record<string, unknown>;
          s.themeMode = s.themeMode === 'dark' ? 'fermata-night' : 'fermata';
        }
        return state;
      },
      // zustand skips migrate() when the stored version matches, so corrupt
      // same-version data must be caught here on the merge path. Per-field:
      // a single bad field falls back to its default, the rest survive.
      merge: (persisted, current) => {
        const sanitized = sanitizePersistedAppState(persisted);
        if (sanitized === null) return current;
        return { ...current, ...sanitized };
      },
    }
  )
);
