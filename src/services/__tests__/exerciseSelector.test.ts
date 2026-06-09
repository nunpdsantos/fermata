import { describe, it, expect } from 'vitest';
import { selectWeightedExercises } from '../exerciseSelector';
import type { ExerciseDefinition } from '../../core/types/exercise';

function makeExercise(id: string, type: 'interval_id' | 'chord_build' | 'note_id', semitones?: number): ExerciseDefinition {
  if (type === 'interval_id') {
    return {
      id,
      type: 'interval_id',
      prompt: `Identify interval (${semitones} semitones)`,
      config: {
        type: 'interval_id',
        root: 'C',
        rootAccidental: '',
        rootOctave: 4,
        targetSemitones: semitones ?? 7,
        direction: 'ascending' as const,
      },
    };
  }
  if (type === 'chord_build') {
    return {
      id,
      type: 'chord_build',
      prompt: 'Build chord',
      config: {
        type: 'chord_build',
        root: 'C',
        rootAccidental: '',
        quality: 'major',
        noteCount: 3,
      },
    };
  }
  return {
    id,
    type: 'note_id',
    prompt: 'Identify note',
    config: {
      type: 'note_id',
      note: 'C',
      accidental: '',
      octave: 4,
    },
  };
}

describe('exerciseSelector', () => {
  describe('selectWeightedExercises', () => {
    it('returns empty array for empty input', () => {
      expect(selectWeightedExercises([], ['intervals'], 5)).toEqual([]);
    });

    it('returns all exercises when no weak concepts', () => {
      const exercises = [
        makeExercise('e1', 'note_id'),
        makeExercise('e2', 'interval_id', 7),
        makeExercise('e3', 'chord_build'),
      ];
      const result = selectWeightedExercises(exercises, [], 3);
      expect(result).toHaveLength(3);
      // All IDs present
      const ids = result.map((e) => e.id);
      expect(ids).toContain('e1');
      expect(ids).toContain('e2');
      expect(ids).toContain('e3');
    });

    it('returns unique exercises (no duplicates)', () => {
      const exercises = [
        makeExercise('e1', 'interval_id', 7),
        makeExercise('e2', 'interval_id', 4),
        makeExercise('e3', 'note_id'),
      ];
      const result = selectWeightedExercises(exercises, ['intervals'], 3);
      const ids = result.map((e) => e.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });

    it('does not exceed targetCount', () => {
      const exercises = Array.from({ length: 20 }, (_, i) =>
        makeExercise(`e${i}`, 'note_id'),
      );
      const result = selectWeightedExercises(exercises, ['note_reading'], 5);
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('returns all exercises when targetCount >= exercises.length', () => {
      const exercises = [
        makeExercise('e1', 'note_id'),
        makeExercise('e2', 'interval_id', 3),
      ];
      const result = selectWeightedExercises(exercises, ['intervals'], 10);
      expect(result).toHaveLength(2);
    });

    it('handles exercises with no weak concept overlap', () => {
      const exercises = [
        makeExercise('e1', 'note_id'),
        makeExercise('e2', 'note_id'),
      ];
      // No note_id exercises have interval concepts
      const result = selectWeightedExercises(exercises, ['intervals'], 2);
      expect(result).toHaveLength(2);
    });
  });
});
