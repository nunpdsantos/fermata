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
import { sanitizeDockDetents, sanitizeDockChosen } from './dock.ts';
import type { AppState } from './storeTypes.ts';
import { progressionToSave, sanitizeSavedProgression } from './progressionSave.ts';

// Re-export types so consumers don't need to change imports
export type { AppState, ViewMode, InstrumentType, ColorMode, ThemeMode, NeckNutSide, NeckTopString } from './storeTypes.ts';

/**
 * The neck as it was drawn before 2026-11-10 (nut right, thick string on
 * top) — the owner's view. A save that exists but lacks the neck fields is a
 * learner from before the switch and keeps this view; the save records it by
 * LEAVING THE FIELD OUT (partialize), so such a learner's save is written
 * byte for byte as before.
 */
export const LEGACY_NECK = { neckNutSide: 'right', neckTopString: 'low' } as const;

// Allowed values per persisted field (audit W9-18: only types were checked,
// so e.g. instrument 'banjo' or themeMode 'purple' passed straight through).
const ALLOWED_VALUES: Record<string, readonly unknown[]> = {
  instrument: ['piano', 'guitar'],
  guitarTuningId: GUITAR_TUNINGS.map((t) => t.id),
  themeMode: ['fermata', 'fermata-night', 'auto'],
  colorMode: ['functional', 'absolute'],
  lastView: ['explore', 'learn', 'drill'],
  scaleOctaves: [1, 2],
  exploreCircleOpen: [true, false],
  neckNutSide: ['left', 'right'],
  neckTopString: ['high', 'low'],
  // Optional (wave 1): absent = never chosen; deleting a bad value means the same.
  exploreDetail: ['simple', 'full'],
  // Optional since wave 1 (no version bump): a v6 save without it takes the default (off).
  showSolfege: [true, false],
};

// Optional fields (wave 1): saved only once set, so they are guarded only when
// present — an absent one takes the slice default (null) and a save from
// before them is unchanged.
const OPTIONAL_VALUES: Record<string, readonly unknown[]> = {
  learnerProfile: ['new', 'player', 'theory', null],
  startHint: ['new', 'player', null],
  // Wave 2 (stream C, state/capo.ts): 0 = no capo, 1–9 a capo on that fret
  // (MAX_CAPO_FRET; state/__tests__/capoFret.test.ts keeps the two in step). Saved only as 1–9.
  capoFret: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  // Wave 3 (stream K, services/midi/): saved only while a MIDI keyboard is on.
  midiKeyboard: [true],
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

  // lessonLoan is never saved (partialize saves the selection it holds in
  // place of the lesson's). One in a hand-edited save — well-formed or not —
  // must not reach memory, where it would be saved back as Explore's
  // selection (B2).
  delete state.lessonLoan;

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
  for (const [k, allowed] of Object.entries(OPTIONAL_VALUES)) {
    if (k in state && !allowed.includes(state[k])) delete state[k];
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

  // dockDetents (W11-A): { explore, learn } each 'peek' | 'half' | 'full'.
  // A valid value keeps its identity (the backup vetting compares with
  // Object.is); a partial one is completed; anything else takes the default.
  if ('dockDetents' in state) {
    const d = sanitizeDockDetents(state.dockDetents);
    const raw = state.dockDetents as Record<string, unknown> | null;
    if (d === null) delete state.dockDetents;
    else if (raw?.explore !== d.explore || raw?.learn !== d.learn) state.dockDetents = d;
  }
  // dockChosen (W11-B): which detents the learner set; same identity rule.
  if ('dockChosen' in state) {
    const c = sanitizeDockChosen(state.dockChosen);
    const raw = state.dockChosen as Record<string, unknown> | null;
    if (c === null) delete state.dockChosen;
    else if (raw?.explore !== c.explore || raw?.learn !== c.learn) state.dockChosen = c;
  }

  // progression (wave 2, optional): chord symbols, tempo, beats — the same
  // object when valid (the backup check compares with Object.is), else gone.
  if ('progression' in state && sanitizeSavedProgression(state.progression) === null) delete state.progression;

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
      partialize: (state) => {
        // While a lesson borrows the instrument (lessonInstrument.ts, D-20)
        // the selection on screen is the lesson's; the save keeps Explore's
        // own. A reload or a closed tab mid-lesson then boots on Explore's
        // selection, and the reopened lesson borrows THAT again — instead of
        // recording its own as Explore's (B2). The loan is never saved.
        const own = state.lessonLoan ?? { key: state.selectedKey, scale: state.selectedScale };
        return {
          selectedKey: own.key,
          selectedScale: own.scale,
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
          dockDetents: state.dockDetents,
          dockChosen: state.dockChosen,
          exploreCircleOpen: state.exploreCircleOpen,
          // Wave 1 (start screen): written only once set, so the save of
          // anyone never asked stays exactly as it was.
          ...(state.learnerProfile !== null ? { learnerProfile: state.learnerProfile } : {}),
          ...(state.startHint !== null ? { startHint: state.startHint } : {}),
          // Optional (brief D): written only when it differs from the legacy
          // view, which a save without the field means (merge below).
          ...(state.neckNutSide !== LEGACY_NECK.neckNutSide ? { neckNutSide: state.neckNutSide } : {}),
          ...(state.neckTopString !== LEGACY_NECK.neckTopString ? { neckTopString: state.neckTopString } : {}),
          // Undefined until the learner chooses: written only once chosen,
          // so an existing save is written back exactly as it was.
          ...(state.exploreDetail !== undefined ? { exploreDetail: state.exploreDetail } : {}),
          // Written only when on: a save from someone who never turns it on
          // stays exactly what it was (the frozen v6 envelope tests).
          ...(state.showSolfege ? { showSolfege: true } : {}),
          // Wave 2: the Progression panel's chords, only while there is one.
          ...progressionToSave(state.progression),
          // Wave 2 (stream C): written only while a capo is on, so a save
          // from someone who never uses one stays exactly what it was.
          ...(Number.isInteger(state.capoFret) && state.capoFret >= 1 && state.capoFret <= 9 ? { capoFret: state.capoFret } : {}),
          // Wave 3 (stream K): written only while a MIDI keyboard is on.
          ...(state.midiKeyboard === true ? { midiKeyboard: true } : {}),
        };
      },
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
        const merged = { ...current, ...sanitized } as AppState;
        // A saved Explore detent counts only if the learner set it (W11-B);
        // otherwise this screen's default applies (Peek when short). A save
        // from before `dockChosen` existed: anything but the old default
        // 'half' must have been the learner's.
        const saved = sanitized.dockDetents as AppState['dockDetents'] | undefined;
        const chosen = (sanitized.dockChosen as AppState['dockChosen'] | undefined) ?? {
          explore: !!saved && saved.explore !== 'half',
          learn: !!saved && saved.learn !== 'peek',
        };
        merged.dockChosen = chosen;
        if (!chosen.explore) merged.dockDetents = { ...merged.dockDetents, explore: current.dockDetents.explore };
        // A save without a neck field (from before 2026-11-10, or the legacy
        // value left out by partialize): the old view. No save at all never
        // reaches here (sanitized is null): that browser keeps the slice's
        // tab / chord-chart default.
        if (!('neckNutSide' in sanitized)) merged.neckNutSide = LEGACY_NECK.neckNutSide;
        if (!('neckTopString' in sanitized)) merged.neckTopString = LEGACY_NECK.neckTopString;
        return merged;
      },
    }
  )
);
