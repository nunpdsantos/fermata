/**
 * Level metadata (English) — statically available (~2 KB) for card rendering.
 *
 * Its own module so tools that cannot load the Vite-only overlay loader (the
 * tsx i18n scripts) can read it; curriculumLoader re-exports both names.
 */
import type { DifficultyTier } from '../core/types/curriculum';
import { LEVEL_ACCENTS } from '../design/tokens/learnColors';

export interface LevelMeta {
  id: string;
  number: number;
  title: string;
  description: string;
  difficulty: DifficultyTier;
  difficultyLabel: string;
  accentColor: string;
  prerequisites: string[];
  parallel?: boolean;
  comingSoon?: boolean;
  unitCount: number;
  moduleCount: number;
}

export const LEVEL_METADATA: LevelMeta[] = [
  { id: 'l1', number: 1, title: 'Foundations of Music Literacy', description: 'Staff notation, pitch fundamentals, rhythm and meter, the major scale, basic intervals, and major triads.', difficulty: 'beginner', difficultyLabel: 'Absolute Beginner', accentColor: LEVEL_ACCENTS.l1, prerequisites: [], unitCount: 3, moduleCount: 10 },
  { id: 'l2', number: 2, title: 'Expanding Fundamentals', description: 'All key signatures, scale degree names, minor scales, compound meter, syncopation, interval quality, all triad types, inversions, and diatonic harmony.', difficulty: 'beginner', difficultyLabel: 'Beginner', accentColor: LEVEL_ACCENTS.l2, prerequisites: ['l1'], unitCount: 4, moduleCount: 12 },
  { id: 'l3', number: 3, title: 'Harmony Foundations', description: 'Seventh chords, voice leading, cadences, phrase structure, and non-chord tones.', difficulty: 'beginner', difficultyLabel: 'Upper Beginner', accentColor: LEVEL_ACCENTS.l3, prerequisites: ['l2'], unitCount: 3, moduleCount: 13 },
  { id: 'l4', number: 4, title: 'Diatonic Mastery', description: 'Advanced non-chord tones, dominant seventh mastery, harmonic function, sequences, and counterpoint.', difficulty: 'intermediate', difficultyLabel: 'Intermediate', accentColor: LEVEL_ACCENTS.l4, prerequisites: ['l3'], unitCount: 3, moduleCount: 15 },
  { id: 'l5', number: 5, title: 'Chromaticism & Modulation', description: 'Secondary dominants, tonicization, modulation, mode mixture, and musical form.', difficulty: 'intermediate', difficultyLabel: 'Upper Intermediate', accentColor: LEVEL_ACCENTS.l5, prerequisites: ['l4'], unitCount: 3, moduleCount: 14 },
  { id: 'l6', number: 6, title: 'Chromatic Harmony', description: 'Neapolitan chord, augmented sixths, enharmonic modulation, and advanced counterpoint.', difficulty: 'intermediate', difficultyLabel: 'Advanced Intermediate', accentColor: LEVEL_ACCENTS.l6, prerequisites: ['l5'], unitCount: 3, moduleCount: 12 },
  { id: 'l7', number: 7, title: 'Jazz, Pop & Modal Harmony', description: 'Jazz chord symbols, ii-V-I progressions, modal harmony, pop analysis, and complete scale/chord taxonomy.', difficulty: 'advanced', difficultyLabel: 'Advanced', accentColor: LEVEL_ACCENTS.l7, prerequisites: ['l6'], unitCount: 3, moduleCount: 16 },
  { id: 'l8', number: 8, title: 'Analysis, Counterpoint & Post-Tonal', description: 'Fugue analysis, large form, orchestration, set theory, and twentieth-century techniques.', difficulty: 'advanced', difficultyLabel: 'Advanced', accentColor: LEVEL_ACCENTS.l8, prerequisites: ['l7'], unitCount: 3, moduleCount: 11 },
  { id: 'l9', number: 9, title: 'Ear Training & Aural Skills', description: 'Interval recognition, chord identification, melodic dictation, sight singing, and contextual listening.', difficulty: 'beginner', difficultyLabel: 'All Levels', accentColor: LEVEL_ACCENTS.l9, prerequisites: [], parallel: true, unitCount: 3, moduleCount: 15 },
];
