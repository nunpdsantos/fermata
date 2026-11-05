import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import type { ExerciseDefinition, RhythmPattern } from '../../../core/types/exercise';
import { Button } from '../../ui/Button';
import { playRhythm } from '../../../utils/rhythmPlayback';
import { StaffNotationSkeleton } from '../../notation/StaffNotationSkeleton';
import { RhythmStaff } from '../../notation/RhythmStaff';
import { staffPlan, staffLayout, staffInkBounds } from '../../../utils/notationHelpers';
import { exerciseStaff } from './exerciseStaff';
import { displayPattern } from './displayPattern';
import { useReferenceLine } from './referenceLine';

/** A rhythm the question points at: drawn, and playable (count-in, then clicks). */
function RhythmStimulus({ pattern }: { pattern: RhythmPattern }) {
  const { t } = useTranslation();
  return (
    <div data-testid="check-rhythm-staff" className="check-rhythm-staff rounded-xl px-3 py-2 flex flex-col gap-2" style={{ backgroundColor: 'var(--card)' }}>
      <RhythmStaff pattern={pattern} />
      <div>
        <Button variant="secondary" startIcon={<PlayIcon />} onClick={() => { void playRhythm(pattern); }}>
          {t('exercise.playRhythm')}
        </Button>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
    </svg>
  );
}

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
  const rhythm = exercise.config.type === 'multiple_choice' ? exercise.config.rhythm : undefined;
  const plan = staff ? staffPlan(staff.notes, staff.clef, 'piano', false) : null;
  const options = { keySignature: staff?.keySignature, duration: staff?.duration, chord: staff?.chord };
  const layout = plan ? staffLayout(plan.written, plan.clef, 100, options) : null;
  const ink = plan ? staffInkBounds(plan.written, plan.clef, options) : null;
  const trimTop = layout && ink ? Math.max(0, layout.staveY + ink.top - 4) : 0;
  const trimBottom = layout && ink ? Math.max(0, layout.height - layout.staveY - ink.bottom - 4) : 0;
  const reference = useReferenceLine(exercise);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-title leading-snug" style={{ color: 'var(--text)' }} data-testid="check-prompt">
        {displayPattern(exercise.prompt)}
      </p>
      {reference && (
        <p className="text-ui" style={{ color: 'var(--text-muted)' }} data-testid="ear-reference">
          {reference}
        </p>
      )}
      {staff && (
        <div data-testid="check-staff" className="check-staff rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--card)' }}>
          <div className="check-staff-ink" style={{ '--staff-trim-top': `${trimTop}px`, '--staff-trim-bottom': `${trimBottom}px` } as React.CSSProperties}>
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
          </div>
        </div>
      )}
      {rhythm && <RhythmStimulus pattern={rhythm} />}
    </div>
  );
}
