import { Suspense, lazy } from 'react';
import type { ExerciseDefinition } from '../../../core/types/exercise';
import { StaffNotationSkeleton } from '../../notation/StaffNotationSkeleton';
import { exerciseStaff } from './exerciseStaff';

const StaffNotation = lazy(() =>
  import('../../notation/StaffNotation').then((m) => ({ default: m.StaffNotation }))
);

interface ExercisePromptProps {
  exercise: ExerciseDefinition;
}

export function ExercisePrompt({ exercise }: ExercisePromptProps) {
  // No instrument highlight here: a note-ID answer lit on the instrument
  // (which shows note names) would give the answer away (audit W4-21). The
  // build input owns the highlight channel and clears it itself.

  // The staff this prompt points at (note, interval or a question's notation).
  const staff = exerciseStaff(exercise.config);

  return (
    <div className="mb-4">
      <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text)' }}>
        {exercise.prompt}
      </p>
      {staff && (
        <Suspense fallback={<StaffNotationSkeleton height={100} />}>
          <StaffNotation
            notes={staff.notes}
            clef={staff.clef}
            keySignature={staff.keySignature}
            chord={staff.chord}
            height={100}
            duration={staff.duration}
          />
        </Suspense>
      )}
    </div>
  );
}
