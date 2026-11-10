/**
 * Shared type definitions for the app store slices.
 *
 * All slice interfaces and the composed AppState live here to avoid
 * circular imports between slices and the store barrel.
 */

import type { Note, ScaleType, Chord, PitchedNote } from '../core/types/music.ts';
import type { SynthPresetName } from '../core/types/visual.ts';
import type { Detent, DockView } from './dock.ts';

// ─── Enums ──────────────────────────────────────────────────────────────────

export type ViewMode = 'explore' | 'learn' | 'drill';
export type InstrumentType = 'piano' | 'guitar';
export type ColorMode = 'functional' | 'absolute';
/** Day, Night, or Auto (follows the system, W11-A). */
export type ThemeMode = 'fermata' | 'fermata-night' | 'auto';
/** 0 = Open position, 1–12 = I–XII, 'all' = whole neck, null = automatic. */
export type GuitarPositionChoice = number | 'all' | null;
/**
 * Who the learner says they are (wave 1, the start screen). Exported to the
 * app from state/learnerProfile.ts — import it from there.
 */
export type LearnerProfile = 'new' | 'player' | 'theory';
/** The start hint still owed in Explore (state/startHint.ts): 'theory' gets none. */
export type StartHintKind = 'new' | 'player';

/** Explore's key and scale, held while a lesson borrows the instrument. */
export interface LessonLoan {
  key: Note;
  scale: ScaleType;
}

// ─── Slice interfaces ───────────────────────────────────────────────────────

export interface MusicSlice {
  selectedKey: Note;
  selectedScale: ScaleType;
  selectedChord: Chord | null;
  selectedDegree: number | null;
  chordInversion: number;
  /**
   * Explore's selection while a lesson BORROWS the instrument
   * (services/lessonInstrument.ts, D-20); null otherwise. Set and cleared only
   * there. Never saved itself: while it is set, the save keeps THIS selection
   * in place of the lesson's (store.ts partialize), so a reload or a closed
   * tab mid-lesson cannot turn the lesson's selection into Explore's (B2).
   */
  lessonLoan: LessonLoan | null;
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
  /** True while an instrument-input exercise is mounted — instruments then
   *  suppress Explore key/chord visuals and render highlightedNotes instead. */
  exerciseInputActive: boolean;
  /** Classical position on the fretboard: 0 = Open, 1–12 = I–XII, 'all' =
   *  whole neck, null = automatic (the suggested position for the scale).
   *  Kept across key, scale and tuning changes (audit W3-08). */
  guitarScalePosition: GuitarPositionChoice;
  guitarTuningId: string;
  setInstrument: (instrument: InstrumentType) => void;
  addActiveNote: (midi: number) => void;
  removeActiveNote: (midi: number) => void;
  clearActiveNotes: () => void;
  setHighlightedNotes: (notes: PitchedNote[]) => void;
  setExerciseInputActive: (active: boolean) => void;
  setGuitarScalePosition: (position: GuitarPositionChoice) => void;
  setGuitarTuningId: (id: string) => void;
}

export interface AudioSlice {
  /** Fixed at the 'piano' default — its setter was removed with the Play view's
   *  preset chooser. It only picks the FM-synth fallback's settings; which
   *  instrument actually sounds is decided by the registered voice
   *  (instrumentVoices.ts: sampled piano, or sampled guitar with
   *  Karplus-Strong while samples load / offline). */
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
  openLearnTarget: (target: LearnDeepLink) => void;
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
  /** Last view the user was on — persisted so a fresh boot (no ?view= param)
   *  restores where they left off. Written by navigationSlice navigation actions. */
  lastView: ViewMode;
  /** Instrument dock detent per view (D-26), persisted. */
  dockDetents: Record<DockView, Detent>;
  /** Which views' detent the LEARNER set (drag, tap, keys, Show / Hide).
   *  Until then Explore follows the screen: Peek when short, else Half. */
  dockChosen: Record<DockView, boolean>;
  /** Explore on a tablet: the circle of fifths below the work is unfolded
   *  (W11-B; folded by default there so the column is not a long scroll;
   *  remembered). Laptops always show it beside the work. */
  exploreCircleOpen: boolean;
  /**
   * The start screen's answer (state/learnerProfile.ts owns the API). null =
   * never asked (every learner from before wave 1): treat as 'theory'. Saved
   * only once set — a save without it is unchanged.
   */
  learnerProfile: LearnerProfile | null;
  /**
   * The one-line start hint a 'new' / 'player' door leaves in Explore, until
   * it is dismissed or acted on (state/startHint.ts); null = none. Saved
   * only while owed.
   */
  startHint: StartHintKind | null;
  setColorMode: (mode: ColorMode) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setScaleOctaves: (octaves: 1 | 2) => void;
  setBaseOctave: (octave: number) => void;
  setLanguage: (language: string) => void;
  setPreferencesUpdatedAt: (at: number) => void;
  setDockDetent: (view: DockView, detent: Detent) => void;
  setExploreCircleOpen: (open: boolean) => void;
  /**
   * Open (or rest) the instrument dock of the CURRENT view at a detent — the
   * API a Learn exercise calls when it needs the instrument (D-20). No-op in
   * Drill, which has no dock.
   */
  requestDock: (detent: Detent) => void;
}

// ─── Composed state ─────────────────────────────────────────────────────────

export type AppState =
  MusicSlice &
  InstrumentSlice &
  AudioSlice &
  NavigationSlice &
  PreferencesSlice;
