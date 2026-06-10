/**
 * DrillInput — routes a DrillItem to its tap-only answer component by
 * input.format and wires per-format feedback highlighting from the canonical
 * answer. Shared by the normal session (DrillView) and the timed Sprint, so
 * both render identical inputs and grading.
 *
 * The input is disabled during feedback; answer payloads carry display strings
 * (grading normalizes display → ASCII).
 */
import type { DrillItem } from '../../core/types/drill';
import type { AnswerPayload } from './grading';
import { ChoiceChips } from './ChoiceChips';
import { NoteChips } from './NoteChips';
import { AccidentalSlots } from './AccidentalSlots';
import { RootQualityChips } from './RootQualityChips';

interface DrillInputProps {
  item: DrillItem;
  phase: 'answering' | 'feedback';
  onAnswer: (payload: AnswerPayload) => void;
}

export function DrillInput({ item, phase, onAnswer }: DrillInputProps) {
  const disabled = phase === 'feedback';

  switch (item.input.format) {
    case 'choice': {
      const correct = item.answer.kind === 'choice' ? item.answer.correct : null;
      return (
        <ChoiceChips
          choices={item.input.choices}
          disabled={disabled}
          selected={null}
          correctChoice={disabled ? correct : null}
          onSelect={(choice) => onAnswer({ format: 'choice', choice })}
        />
      );
    }
    case 'noteChips': {
      const correctNotes = item.answer.kind === 'notes' ? item.answer.notes : [];
      return (
        <NoteChips
          chips={item.input.chips}
          expectedCount={item.input.expectedCount}
          disabled={disabled}
          onAnswer={(notes) => onAnswer({ format: 'noteChips', notes })}
          feedback={disabled ? { correctNotes } : undefined}
        />
      );
    }
    case 'accidentalSlots': {
      const correctSpelled = item.answer.kind === 'accidentals' ? item.answer.spelled : [];
      return (
        <AccidentalSlots
          letters={item.input.letters}
          disabled={disabled}
          onAnswer={(spelled) => onAnswer({ format: 'accidentalSlots', spelled })}
          feedback={disabled ? { correctSpelled } : undefined}
        />
      );
    }
    case 'rootQuality': {
      const rq = item.answer.kind === 'rootQuality' ? item.answer : null;
      return (
        <RootQualityChips
          roots={item.input.roots}
          qualities={item.input.qualities}
          disabled={disabled}
          onAnswer={({ root, quality }) => onAnswer({ format: 'rootQuality', root, quality })}
          feedback={disabled && rq ? { correctRoot: rq.root, correctQuality: rq.quality } : undefined}
        />
      );
    }
  }
}
