import { Suspense, lazy } from 'react';
import type { ExerciseDefinition } from '../../../core/types/exercise';
import type { NaturalNote, Accidental, PitchedNote } from '../../../core/types/music';
import { StaffNotationSkeleton } from '../../notation/StaffNotationSkeleton';
import { intervalTargetNote, writtenOctave } from '../../../core/utils/degreeSpelling';

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

  // Build staff notes for note_id / interval_id
  const staffNotes: PitchedNote[] | null = (() => {
    const cfg = exercise.config;
    if (cfg.type === 'note_id') {
      return [{
        natural: cfg.note as NaturalNote,
        accidental: (cfg.accidental || '') as Accidental,
        octave: cfg.octave,
      }];
    }
    if (cfg.type === 'interval_id') {
      const rootNote: PitchedNote = {
        natural: cfg.root as NaturalNote,
        accidental: (cfg.rootAccidental || '') as Accidental,
        octave: cfg.rootOctave,
      };
      return [rootNote, intervalTargetNote(rootNote, cfg.targetSemitones, cfg.direction)];
    }
    return null;
  })();

  // Bass clef when a note is WRITTEN below middle C (the letter octave: C♭4
  // sounds as B3 but is written in octave 4). Exercises are AUTHORED notation:
  // the same notes and clef on every instrument, never transposed for the guitar.
  const clef = staffNotes && staffNotes.some((n) => writtenOctave(n, n.octave) < 4) ? 'bass' as const : 'treble' as const;

  return (
    <div className="mb-4">
      <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text)' }}>
        {exercise.prompt}
      </p>
      {staffNotes && (
        <Suspense fallback={<StaffNotationSkeleton height={100} />}>
          <StaffNotation
            notes={staffNotes}
            clef={clef}
            height={100}
            duration={staffNotes.length === 1 ? 'w' : 'h'}
          />
        </Suspense>
      )}
    </div>
  );
}
