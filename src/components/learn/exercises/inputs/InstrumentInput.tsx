import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../../state/store';
import type { Note, PitchedNote } from '../../../../core/types/music';
import { noteToString } from '../../../../core/types/music';
import { directionSpeller } from '../../../../core/utils/spelling';
import { accentText } from '../../../../design/tokens/learnColors';

interface InstrumentInputProps {
  expectedCount: number;
  submitted: boolean;
  onSubmit: (pitchClasses: Set<number>) => void;
  accentColor: string;
  /**
   * The notes the exercise asks for. Only their sharp/flat DIRECTION is used to
   * name the learner's picks (F major's B♭ reads "Bb", not "A#"); their exact
   * spellings are never shown, so a chip can't reveal a right answer (W1-08).
   */
  spellingContext?: readonly Note[];
}

export function InstrumentInput({ expectedCount, submitted, onSubmit, accentColor, spellingContext }: InstrumentInputProps) {
  const { t } = useTranslation();
  const spell = useMemo(() => directionSpeller(spellingContext ?? []), [spellingContext]);
  const [toggledPCs, setToggledPCs] = useState<Set<number>>(new Set());
  const activeNotes = useAppStore((s) => s.activeNotes);
  const setHighlightedNotes = useAppStore((s) => s.setHighlightedNotes);
  const setExerciseInputActive = useAppStore((s) => s.setExerciseInputActive);

  // While mounted, the instruments suppress Explore visuals and render the
  // toggled selection instead (see useKeyContext exercise-input mode).
  useEffect(() => {
    setExerciseInputActive(true);
    // The answer is played on the instrument: make sure the dock is open (Learn
    // keeps it at Peek by default, D-20). Full D-20 wiring is a later batch.
    useAppStore.getState().requestDock('half');
    return () => setExerciseInputActive(false);
  }, [setExerciseInputActive]);

  // Toggle a pitch class once per NOTE-ON. Diffing against the previous
  // active set means held notes and dyads toggle each note exactly once
  // (the old all-active reprocessing made two held notes cancel out).
  // The diff runs during render with state-tracked previous value (react.dev
  // "storing information from previous renders") rather than setState inside
  // an effect body.
  const [prevActiveNotes, setPrevActiveNotes] = useState<Set<number>>(() => new Set());
  if (activeNotes !== prevActiveNotes) {
    const added: number[] = [];
    for (const midi of activeNotes) {
      if (!prevActiveNotes.has(midi)) added.push(midi);
    }
    setPrevActiveNotes(activeNotes);
    if (!submitted && added.length > 0) {
      setToggledPCs((prev) => {
        const next = new Set(prev);
        for (const midi of added) {
          const pc = midi % 12;
          if (next.has(pc)) next.delete(pc);
          else next.add(pc);
        }
        return next;
      });
    }
  }

  // Update highlighted notes on instrument whenever toggled set changes
  useEffect(() => {
    if (submitted) return;
    const highlighted: PitchedNote[] = [];
    for (const pc of toggledPCs) {
      highlighted.push({ ...spell(pc), octave: 4 });
    }
    setHighlightedNotes(highlighted);

    return () => {
      setHighlightedNotes([]);
    };
  }, [toggledPCs, submitted, setHighlightedNotes, spell]);

  const handleClear = useCallback(() => {
    setToggledPCs(new Set());
  }, []);

  const handleCheck = useCallback(() => {
    onSubmit(toggledPCs);
  }, [toggledPCs, onSubmit]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {t('exercise.instrumentSelected', { selected: toggledPCs.size, expected: expectedCount })}
        </span>
        <span className="text-caption flex items-center gap-1.5" style={{ color: 'var(--text-dim)' }}>
          {t('exercise.instrumentToggle')}
        </span>
      </div>

      {/* Toggled notes display */}
      {toggledPCs.size > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {[...toggledPCs].sort((a, b) => a - b).map((pc) => {
            const label = noteToString(spell(pc));
            return (
              <span
                key={pc}
                className="px-2 py-0.5 rounded-md text-xs font-medium"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentText(accentColor),
                }}
              >
                {label}
              </span>
            );
          })}
        </div>
      )}

      {!submitted && (
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="inline-flex items-center justify-center min-h-(--tap) px-3 rounded-lg text-ui transition-colors"
            style={{ color: 'var(--text-dim)', border: '1px solid color-mix(in srgb, var(--border) 50%, transparent)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--card-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
          >
            {t('common.clear')}
          </button>
          <button
            onClick={handleCheck}
            disabled={toggledPCs.size === 0}
            className="inline-flex items-center justify-center min-h-(--tap) px-4 rounded-lg text-ui font-medium transition-colors disabled:opacity-40"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentText(accentColor),
            }}
          >
            {t('exercise.checkAnswer')}
          </button>
        </div>
      )}
    </div>
  );
}
