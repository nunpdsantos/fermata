import { describe, it, expect } from 'vitest';
import { validateAnswer } from '../validateExercise';
import type {
  NoteIdConfig,
  IntervalIdConfig,
  ScaleBuildConfig,
  ChordBuildConfig,
  MultipleChoiceConfig,
  EarTrainingConfig,
  ScaleDegreeIdConfig,
} from '../../../../core/types/exercise';

describe('validateAnswer', () => {
  describe('note_id', () => {
    const config: NoteIdConfig = {
      type: 'note_id',
      note: 'C',
      accidental: '#',
      octave: 4,
    };

    it('accepts exact match', () => {
      const result = validateAnswer(config, 'C#');
      expect(result.correct).toBe(true);
    });

    it('accepts enharmonic equivalent by default', () => {
      const result = validateAnswer(config, 'Db');
      expect(result.correct).toBe(true);
    });

    it('rejects enharmonic when acceptEnharmonic is false', () => {
      const strict: NoteIdConfig = { ...config, acceptEnharmonic: false };
      const result = validateAnswer(strict, 'Db');
      expect(result.correct).toBe(false);
    });

    it('rejects wrong note', () => {
      const result = validateAnswer(config, 'D');
      expect(result.correct).toBe(false);
      expect(result.expected).toBe('C#');
    });

    it('handles natural notes', () => {
      const nat: NoteIdConfig = { type: 'note_id', note: 'E', accidental: '', octave: 4 };
      expect(validateAnswer(nat, 'E').correct).toBe(true);
      expect(validateAnswer(nat, 'F').correct).toBe(false);
    });
  });

  describe('interval_id', () => {
    const config: IntervalIdConfig = {
      type: 'interval_id',
      root: 'C',
      rootAccidental: '',
      rootOctave: 4,
      targetSemitones: 7,
      direction: 'ascending',
    };

    it('accepts correct semitone count', () => {
      const result = validateAnswer(config, '7');
      expect(result.correct).toBe(true);
      expect(result.explanation).toContain('Perfect 5th');
    });

    it('rejects wrong semitone count', () => {
      const result = validateAnswer(config, '5');
      expect(result.correct).toBe(false);
      expect(result.expected).toBe('Perfect 5th');
    });

    // WS5 mitigation (REMEDIATION B1): 8 semitones is a Minor 6th in interval-ID,
    // not core INTERVAL_LABELS[8]='Augmented 5th'. Covers L2/L9 interval items.
    it('labels an 8-semitone interval as "Minor 6th", not "Augmented 5th"', () => {
      const m6Config: IntervalIdConfig = { ...config, targetSemitones: 8 };
      const correct = validateAnswer(m6Config, '8');
      expect(correct.correct).toBe(true);
      expect(correct.expected).toBe('Minor 6th');
      expect(correct.explanation).toContain('Minor 6th');
      expect(correct.explanation).not.toContain('Augmented 5th');

      const wrong = validateAnswer(m6Config, '7');
      expect(wrong.correct).toBe(false);
      expect(wrong.expected).toBe('Minor 6th');
      expect(wrong.explanation).not.toContain('Augmented 5th');
    });

    // The same path backs ear_training interval-mode feedback (L9 m6 by ear).
    it('labels an 8-semitone ear-training interval as "Minor 6th"', () => {
      const earM6: EarTrainingConfig = {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 8,
        direction: 'ascending',
      };
      const result = validateAnswer(earM6, '8');
      expect(result.correct).toBe(true);
      expect(result.expected).toBe('Minor 6th');
      expect(result.explanation).not.toContain('Augmented 5th');
    });
  });

  describe('scale_build', () => {
    const config: ScaleBuildConfig = {
      type: 'scale_build',
      root: 'C',
      rootAccidental: '',
      scaleType: 'major',
      noteCount: 7,
    };

    it('accepts correct pitch class set for C major', () => {
      // C major: C(0) D(2) E(4) F(5) G(7) A(9) B(11)
      const answer = new Set([0, 2, 4, 5, 7, 9, 11]);
      const result = validateAnswer(config, answer);
      expect(result.correct).toBe(true);
    });

    it('rejects incomplete set', () => {
      const answer = new Set([0, 2, 4, 5, 7, 9]); // missing B
      const result = validateAnswer(config, answer);
      expect(result.correct).toBe(false);
      expect(result.explanation).toContain('missing');
    });

    it('rejects set with extra notes', () => {
      const answer = new Set([0, 1, 2, 4, 5, 7, 9, 11]); // extra C#
      const result = validateAnswer(config, answer);
      expect(result.correct).toBe(false);
      expect(result.explanation).toContain('extra');
    });

    it('validates G major scale', () => {
      const gMajor: ScaleBuildConfig = {
        type: 'scale_build',
        root: 'G',
        rootAccidental: '',
        scaleType: 'major',
        noteCount: 7,
      };
      // G major: G(7) A(9) B(11) C(0) D(2) E(4) F#(6)
      const answer = new Set([7, 9, 11, 0, 2, 4, 6]);
      expect(validateAnswer(gMajor, answer).correct).toBe(true);
    });
  });

  describe('chord_build', () => {
    const config: ChordBuildConfig = {
      type: 'chord_build',
      root: 'C',
      rootAccidental: '',
      quality: 'major',
      noteCount: 3,
    };

    it('accepts correct pitch class set for C major chord', () => {
      // C major: C(0) E(4) G(7)
      const answer = new Set([0, 4, 7]);
      const result = validateAnswer(config, answer);
      expect(result.correct).toBe(true);
    });

    it('rejects wrong notes', () => {
      // C minor instead of C major: C(0) Eb(3) G(7)
      const answer = new Set([0, 3, 7]);
      const result = validateAnswer(config, answer);
      expect(result.correct).toBe(false);
    });

    it('validates G major chord', () => {
      const gMajor: ChordBuildConfig = {
        type: 'chord_build',
        root: 'G',
        rootAccidental: '',
        quality: 'major',
        noteCount: 3,
      };
      // G major: G(7) B(11) D(2)
      const answer = new Set([7, 11, 2]);
      expect(validateAnswer(gMajor, answer).correct).toBe(true);
    });
  });

  describe('multiple_choice', () => {
    const config: MultipleChoiceConfig = {
      type: 'multiple_choice',
      choices: [
        { label: 'True', correct: true },
        { label: 'False', correct: false },
      ],
    };

    it('accepts correct choice', () => {
      const result = validateAnswer(config, 'True');
      expect(result.correct).toBe(true);
    });

    it('rejects wrong choice', () => {
      const result = validateAnswer(config, 'False');
      expect(result.correct).toBe(false);
      expect(result.expected).toBe('True');
    });
  });

  describe('ear_training', () => {
    it('validates note mode (delegates to note_id)', () => {
      const config: EarTrainingConfig = {
        type: 'ear_training',
        mode: 'note',
        note: 'E',
        accidental: 'b',
        octave: 4,
      };
      expect(validateAnswer(config, 'Eb').correct).toBe(true);
      expect(validateAnswer(config, 'D#').correct).toBe(true); // enharmonic
      expect(validateAnswer(config, 'F').correct).toBe(false);
    });

    it('validates interval mode (delegates to interval_id)', () => {
      const config: EarTrainingConfig = {
        type: 'ear_training',
        mode: 'interval',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: 4,
        direction: 'ascending',
      };
      expect(validateAnswer(config, '4').correct).toBe(true); // Major 3rd
      expect(validateAnswer(config, '3').correct).toBe(false);
    });

    it('validates chord mode (delegates to multiple_choice)', () => {
      const config: EarTrainingConfig = {
        type: 'ear_training',
        mode: 'chord',
        chordRoot: 'A',
        chordRootAccidental: '',
        quality: 'minor',
        choices: [
          { label: 'Major', correct: false },
          { label: 'Minor', correct: true },
          { label: 'Diminished', correct: false },
          { label: 'Augmented', correct: false },
        ],
      };
      expect(validateAnswer(config, 'Minor').correct).toBe(true);
      expect(validateAnswer(config, 'Major').correct).toBe(false);
    });
  });

  describe('scale_degree_id', () => {
    it('accepts correct degree', () => {
      const config: ScaleDegreeIdConfig = {
        type: 'scale_degree_id',
        root: 'C',
        rootAccidental: '',
        scaleType: 'major',
        note: 'E',
        noteAccidental: '',
        correctDegree: 3,
      };
      expect(validateAnswer(config, '3').correct).toBe(true);
      expect(validateAnswer(config, '3').explanation).toContain('Mediant');
    });

    it('rejects wrong degree', () => {
      const config: ScaleDegreeIdConfig = {
        type: 'scale_degree_id',
        root: 'C',
        rootAccidental: '',
        scaleType: 'major',
        note: 'G',
        noteAccidental: '',
        correctDegree: 5,
      };
      const result = validateAnswer(config, '4');
      expect(result.correct).toBe(false);
      expect(result.expected).toContain('Dominant');
    });
  });
});
