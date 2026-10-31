/**
 * Audit W1-10 (C-84, C-91, E-21) — feedback and summaries name chords and
 * scales by their display names, never by internal ids: "The C major9 chord
 * has 5 notes", "B half_diminished7", PT "A escala de C natural minor".
 */
import { describe, it, expect } from 'vitest';
import { validateAnswer } from '../validateExercise';
import { generateScaleSummary } from '../../../../utils/exportHelpers';
import { buildScale } from '../../../../core/constants/scales';
import { getDiatonicChordsForScale, buildChord } from '../../../../core/constants/chords';
import type { ExerciseConfig } from '../../../../core/types/exercise';
import { translateChordQuality, translateScaleType } from '../../../../i18n/content/musicTerms';

const ID_LIKE = /\b[a-z]+_[a-z0-9_]+\b|\b(major|minor|dominant|diminished)\d+/;

describe('W1-10 — build-exercise feedback uses display names', () => {
  const chord: ExerciseConfig = { type: 'chord_build', root: 'C', rootAccidental: '', quality: 'major9', noteCount: 5 } as ExerciseConfig;
  const halfDim: ExerciseConfig = { type: 'chord_build', root: 'B', rootAccidental: '', quality: 'half_diminished7', noteCount: 4 } as ExerciseConfig;
  const scale: ExerciseConfig = { type: 'scale_build', root: 'C', rootAccidental: '', scaleType: 'natural_minor', noteCount: 7 } as ExerciseConfig;
  const pent: ExerciseConfig = { type: 'scale_build', root: 'A', rootAccidental: '', scaleType: 'pentatonic_major', noteCount: 5 } as ExerciseConfig;

  it('English: chord and scale names, no ids', () => {
    const c = validateAnswer(chord, new Set([0]));
    expect(c.explanation).toContain('C Major 9th');
    expect(c.explanation).not.toMatch(ID_LIKE);
    expect(validateAnswer(halfDim, new Set([11])).explanation).toContain('B Half-Diminished 7th');
    const s = validateAnswer(scale, new Set([0]));
    expect(s.explanation).toContain('C Natural Minor');
    expect(validateAnswer(pent, new Set([9])).explanation).toContain('A Major Pentatonic');
  });

  it('Portuguese and Spanish: translated scale and chord names', () => {
    const tPt = (key: string, o?: Record<string, unknown>) => `${key}|${JSON.stringify(o)}`;
    // The PT/ES names come from the content team's music-term dictionary.
    expect(translateScaleType('natural_minor', 'pt')).toBe('menor natural');
    expect(validateAnswer(scale, new Set([0]), tPt, 'pt').explanation).toContain('C menor natural');
    expect(validateAnswer(scale, new Set([0]), tPt, 'es').explanation).toContain(`C ${translateScaleType('natural_minor', 'es')}`);
    const ptMajor9 = translateChordQuality('major9', 'pt');
    expect(ptMajor9).not.toBe('major9');
    expect(validateAnswer(chord, new Set([0]), tPt, 'pt').explanation).toContain(`C ${ptMajor9}`);
    // a chord the PT dictionary lacks falls back to the English display name, never the id
    const sus: ExerciseConfig = { type: 'chord_build', root: 'D', rootAccidental: '', quality: 'dominant7sus4', noteCount: 4 } as ExerciseConfig;
    expect(validateAnswer(sus, new Set([2]), tPt, 'pt').explanation).toContain('D Dominant 7th Sus4');
  });
});

describe('W1-10 — Copy summary uses display names', () => {
  it('lists diatonic chords and the selected chord by name', () => {
    const scale = buildScale({ natural: 'C', accidental: '' }, 'major');
    const dcs = getDiatonicChordsForScale(scale);
    const text = generateScaleSummary(scale, dcs, buildChord({ natural: 'B', accidental: '' }, 'half_diminished7'));
    expect(text).toContain('B Diminished');
    expect(text).toContain('Selected Chord: B Half-Diminished 7th');
    expect(text).not.toMatch(ID_LIKE);
  });
});
