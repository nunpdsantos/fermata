/* eslint-disable no-restricted-syntax -- the per-level accentColor hex values
   defined here ARE the canonical curriculum identity colors; src/core is
   framework-agnostic and cannot reference CSS custom properties. */
import type { CurriculumLevel } from '../types/curriculum';
import { L1_UNITS } from './curriculumL1';
import { L2_UNITS } from './curriculumL2';
import { L3_UNITS } from './curriculumL3';
import { L4_UNITS } from './curriculumL4';
import { L5_UNITS } from './curriculumL5';
import { L6_UNITS } from './curriculumL6';
import { L7_UNITS } from './curriculumL7';
import { L8_UNITS } from './curriculumL8';
import { L9_UNITS } from './curriculumL9';

export const CURRICULUM_LEVELS: CurriculumLevel[] = [
  {
    id: 'l1',
    number: 1,
    title: 'Foundations of Music Literacy',
    description: 'Staff notation, pitch fundamentals, rhythm and meter, the major scale, basic intervals, and major triads.',
    difficulty: 'beginner',
    difficultyLabel: 'Absolute Beginner',
    accentColor: '#60A5FA',
    prerequisites: [],
    units: L1_UNITS,
  },
  {
    id: 'l2',
    number: 2,
    title: 'Expanding Fundamentals',
    description: 'All key signatures, scale degree names, minor scales, compound meter, syncopation, interval quality, all triad types, inversions, and diatonic harmony.',
    difficulty: 'beginner',
    difficultyLabel: 'Beginner',
    accentColor: '#38BDF8',
    prerequisites: ['l1'],
    units: L2_UNITS,
  },
  {
    id: 'l3',
    number: 3,
    title: 'Harmony Foundations',
    description: 'Seventh chords, voice leading, cadences, phrase structure, and non-chord tones.',
    difficulty: 'beginner',
    difficultyLabel: 'Upper Beginner',
    accentColor: '#34D399',
    prerequisites: ['l2'],
    units: L3_UNITS,
  },
  {
    id: 'l4',
    number: 4,
    title: 'Diatonic Mastery',
    description: 'Advanced non-chord tones, dominant seventh mastery, harmonic function, sequences, and counterpoint.',
    difficulty: 'intermediate',
    difficultyLabel: 'Intermediate',
    accentColor: '#2DD4BF',
    prerequisites: ['l3'],
    units: L4_UNITS,
  },
  {
    id: 'l5',
    number: 5,
    title: 'Chromaticism & Modulation',
    description: 'Secondary dominants, tonicization, modulation, mode mixture, and musical form.',
    difficulty: 'intermediate',
    difficultyLabel: 'Upper Intermediate',
    accentColor: '#FBBF24',
    prerequisites: ['l4'],
    units: L5_UNITS,
  },
  {
    id: 'l6',
    number: 6,
    title: 'Chromatic Harmony',
    description: 'Neapolitan chord, augmented sixths, enharmonic modulation, and advanced counterpoint.',
    difficulty: 'intermediate',
    difficultyLabel: 'Advanced Intermediate',
    accentColor: '#FB923C',
    prerequisites: ['l5'],
    units: L6_UNITS,
  },
  {
    id: 'l7',
    number: 7,
    title: 'Jazz, Pop & Modal Harmony',
    description: 'Jazz chord symbols, ii-V-I progressions, modal harmony, pop analysis, and complete scale/chord taxonomy.',
    difficulty: 'advanced',
    difficultyLabel: 'Advanced',
    accentColor: '#F472B6',
    prerequisites: ['l6'],
    units: L7_UNITS,
  },
  {
    id: 'l8',
    number: 8,
    title: 'Analysis, Counterpoint & Post-Tonal',
    description: 'Fugue analysis, large form, orchestration, set theory, and twentieth-century techniques.',
    difficulty: 'advanced',
    difficultyLabel: 'Advanced',
    accentColor: '#A78BFA',
    prerequisites: ['l7'],
    units: L8_UNITS,
  },
  {
    id: 'l9',
    number: 9,
    parallel: true,
    title: 'Ear Training & Aural Skills',
    description: 'Interval recognition, chord identification, melodic dictation, sight singing, and contextual listening.',
    difficulty: 'beginner',
    difficultyLabel: 'All Levels',
    accentColor: '#F87171',
    prerequisites: [],
    units: L9_UNITS,
  },
];
