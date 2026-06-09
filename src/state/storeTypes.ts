/**
 * Shared type definitions for the app store slices.
 *
 * All slice interfaces and the composed AppState live here to avoid
 * circular imports between slices and the store barrel.
 */

import type { Note, ScaleType, Chord, PitchedNote } from '../core/types/music.ts';
import type { SynthPresetName } from '../core/types/visual.ts';

// ─── Enums ──────────────────────────────────────────────────────────────────

export type ViewMode = 'explore' | 'learn';
export type InstrumentType = 'piano' | 'guitar';
export type ColorMode = 'functional' | 'absolute';
export type ThemeMode = 'dark' | 'light' | 'system' | 'fermata';

// ─── Slice interfaces ───────────────────────────────────────────────────────

export interface MusicSlice {
  selectedKey: Note;
  selectedScale: ScaleType;
  selectedChord: Chord | null;
  selectedDegree: number | null;
  chordInversion: number;
  setKey: (key: Note) => void;
  setScale: (scale: ScaleType) => void;
  setSelectedChord: (chord: Chord | null) => void;
  setSelectedDegree: (degree: number | null) => void;
  setChordInversion: (inversion: number) => void;
}

export interface InstrumentSlice {
  instrument: InstrumentType;
  activeNotes: Set<number>;
  highlightedNotes: PitchedNote[];
  guitarScalePosition: number | null;
  guitarTuningId: string;
  setInstrument: (instrument: InstrumentType) => void;
  addActiveNote: (midi: number) => void;
  removeActiveNote: (midi: number) => void;
  clearActiveNotes: () => void;
  setHighlightedNotes: (notes: PitchedNote[]) => void;
  setGuitarScalePosition: (position: number | null) => void;
  setGuitarTuningId: (id: string) => void;
}

export interface AudioSlice {
  /** Fixed at the 'piano' default — its setter was removed with the Play view's
   *  preset chooser (guitar forces Karplus-Strong regardless of this value). */
  synthPreset: SynthPresetName;
  volume: number;
  setVolume: (volume: number) => void;
}

export interface LearnDeepLink {
  levelId: string;
  unitId: string;
  moduleId: string;
}

export interface NavigationSlice {
  view: ViewMode;
  detailPanelOpen: boolean;
  quickSearchOpen: boolean;
  comparisonScale: ScaleType | null;
  /** Pending Learn target set by Explore/search so LearnView can deep-link to a module on mount. Cleared after consumption. */
  pendingLearnTarget: LearnDeepLink | null;
  setView: (view: ViewMode) => void;
  setDetailPanelOpen: (open: boolean) => void;
  setQuickSearchOpen: (open: boolean) => void;
  setComparisonScale: (scale: ScaleType | null) => void;
  setPendingLearnTarget: (target: LearnDeepLink | null) => void;
}

export interface PreferencesSlice {
  colorMode: ColorMode;
  themeMode: ThemeMode;
  scaleOctaves: 1 | 2;
  baseOctave: number;
  language: string;
  preferencesUpdatedAt: number;
  setColorMode: (mode: ColorMode) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setScaleOctaves: (octaves: 1 | 2) => void;
  setBaseOctave: (octave: number) => void;
  setLanguage: (language: string) => void;
  setPreferencesUpdatedAt: (at: number) => void;
}

// ─── Composed state ─────────────────────────────────────────────────────────

export type AppState =
  MusicSlice &
  InstrumentSlice &
  AudioSlice &
  NavigationSlice &
  PreferencesSlice;
