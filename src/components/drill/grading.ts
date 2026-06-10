/**
 * Pure answer grading for Drill mode.
 *
 * Task 8 implements ONLY the 'choice' branch (string equality against the
 * item's canonical answer). The other three input formats throw a typed
 * "not implemented" error so Task 9 can extend each branch type-safely —
 * the exhaustive-never default guarantees a compile error if a new
 * AnswerPayload variant is added without a handler.
 */
import type { DrillItem } from '../../core/types/drill';

export type AnswerPayload =
  | { format: 'choice'; choice: string }
  | { format: 'noteChips'; notes: string[] } // DISPLAY strings as tapped
  | { format: 'accidentalSlots'; spelled: string[] }
  | { format: 'rootQuality'; root: string; quality: string };

export interface GradeResult {
  correct: boolean;
  nearMiss: boolean;
}

export function gradeAnswer(item: DrillItem, payload: AnswerPayload): GradeResult {
  switch (payload.format) {
    case 'choice': {
      const correctAnswer = item.answer.kind === 'choice' ? item.answer.correct : null;
      return { correct: payload.choice === correctAnswer, nearMiss: false };
    }
    case 'noteChips':
      throw new Error('not implemented: noteChips grading (Task 9)');
    case 'accidentalSlots':
      throw new Error('not implemented: accidentalSlots grading (Task 9)');
    case 'rootQuality':
      throw new Error('not implemented: rootQuality grading (Task 9)');
    default: {
      // Exhaustiveness guard: adding a new AnswerPayload variant without a
      // case above becomes a compile error here.
      const _exhaustive: never = payload;
      throw new Error(`unhandled answer payload: ${JSON.stringify(_exhaustive)}`);
    }
  }
}
