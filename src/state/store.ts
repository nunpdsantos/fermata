import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMusicSlice } from './slices/musicSlice.ts';
import { createInstrumentSlice } from './slices/instrumentSlice.ts';
import { createAudioSlice } from './slices/audioSlice.ts';
import { createNavigationSlice } from './slices/navigationSlice.ts';
import { createPreferencesSlice } from './slices/preferencesSlice.ts';
import { SCALE_FORMULAS } from '../core/constants/scales.ts';
import { GUITAR_TUNINGS } from '../core/constants/guitarTunings.ts';
import { isAppLanguage } from '../i18n/language.ts';
import type { AppState } from './storeTypes.ts';

// Re-export types so consumers don't need to change imports
export type { AppState, ViewMode, InstrumentType, ColorMode, ThemeMode } from './storeTypes.ts';

// Allowed values per persisted field (audit W9-18: only types were checked,
// so e.g. instrument 'banjo' or themeMode 'purple' passed straight through).
const ALLOWED_VALUES: Record<string, readonly unknown[]> = {
  instrument: ['piano', 'guitar'],
  guitarTuningId: GUITAR_TUNINGS.map((t) => t.id),
  themeMode: ['fermata', 'fermata-night'],
  colorMode: ['functional', 'absolute'],
  lastView: ['explore', 'learn', 'drill'],
  scaleOctaves: [1, 2],
};

// Numeric ranges. baseOctave = the piano's octave tabs (0–8, whole numbers);
// volume = core audio's master gain (0–1).
const NUMERIC_RANGES: Record<string, { min: number; max: number; integer?: boolean }> = {
  baseOctave: { min: 0, max: 8, integer: true },
  volume: { min: 0, max: 1 },
  preferencesUpdatedAt: { min: 0, max: Number.MAX_SAFE_INTEGER },
};

/**
 * Per-field shape guard for persisted app state. localStorage is
 * user-editable; a corrupted field must fall back to the slice default
 * without nuking the rest of the persisted state. Invalid fields are
 * deleted so the slice-created defaults win in the merge.
 */
export function sanitizePersistedAppState(persisted: unknown): Record<string, unknown> | null {
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

  // selectedScale: must be a known scale type. Own keys only — the `in`
  // operator also accepted inherited members like 'constructor' (audit W0-01).
  if (typeof state.selectedScale !== 'string' || !Object.hasOwn(SCALE_FORMULAS, state.selectedScale)) {
    delete state.selectedScale;
  }

  // Enumerated fields (incl. lastView): anything outside the allowed set
  // falls back to the slice default.
  for (const [k, allowed] of Object.entries(ALLOWED_VALUES)) {
    if (!allowed.includes(state[k])) delete state[k];
  }

  // guitarScalePosition: 0–12 (Open, I–XII), 'all', or null (automatic).
  // Anything else becomes automatic.
  if ('guitarScalePosition' in state) {
    const p = state.guitarScalePosition;
    const valid = p === null || p === 'all' || (typeof p === 'number' && Number.isInteger(p) && p >= 0 && p <= 12);
    if (!valid) state.guitarScalePosition = null;
  }

  // language: must be a shipped language; anything else falls back to the
  // slice default (the browser language).
  if (!isAppLanguage(state.language)) {
    delete state.language;
  }

  // Numeric fields: non-finite or out of range falls back to the default.
  for (const [k, { min, max, integer }] of Object.entries(NUMERIC_RANGES)) {
    const v = state[k];
    if (
      typeof v !== 'number' || !Number.isFinite(v) ||
      v < min || v > max || (integer && !Number.isInteger(v))
    ) {
      delete state[k];
    }
  }

  return state;
}

/**
 * Fields PRESENT in a saved-settings object that the guard above would
 * discard (missing fields are fine — they take their defaults). Used to vet a
 * backup's preferences section before it is offered for import.
 */
export function invalidAppStateFields(persisted: unknown): string[] | null {
  const sanitized = sanitizePersistedAppState(persisted);
  if (sanitized === null) return null;
  const original = persisted as Record<string, unknown>;
  // Dropped (falls back to default) or replaced (e.g. a bad guitarScalePosition
  // becomes automatic) both mean the guard rejected the value.
  return Object.keys(original).filter(
    (k) => original[k] !== undefined && (!(k in sanitized) || !Object.is(sanitized[k], original[k])),
  );
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
      version: 6,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedKey: state.selectedKey,
        selectedScale: state.selectedScale,
        instrument: state.instrument,
        guitarTuningId: state.guitarTuningId,
        guitarScalePosition: state.guitarScalePosition,
        baseOctave: state.baseOctave,
        colorMode: state.colorMode,
        scaleOctaves: state.scaleOctaves,
        volume: state.volume,
        themeMode: state.themeMode,
        language: state.language,
        preferencesUpdatedAt: state.preferencesUpdatedAt,
        lastView: state.lastView,
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
        if (version < 6 && state && typeof state === 'object') {
          // lastView is new in v6; inject the default when an older blob lacks it.
          const s = state as Record<string, unknown>;
          if (s.lastView === undefined) s.lastView = 'explore';
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
