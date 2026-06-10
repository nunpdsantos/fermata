import { useRef, useState } from 'react';
import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SPRING_MICRO } from '../../design/tokens/motion';
import { normalizeDisplay, pcOf } from './grading';

interface NoteChipsProps {
  /** Display strings shown on the chips (unicode ♯/♭/𝄪/𝄫). */
  chips: string[];
  /** How many chips make a complete answer; auto-grades on the Nth selection. */
  expectedCount: number;
  disabled: boolean;
  /** Fires once when the user reaches `expectedCount` selections (display strings). */
  onAnswer: (notes: string[]) => void;
  /** During feedback: the canonical correct spellings (ASCII) to highlight green. */
  feedback?: { correctNotes: string[] };
}

/**
 * Multi-select note chips for chord/scale SPELLING questions.
 *
 * Mirrors the ChoiceChips idiom: ≥44 pt targets, role="group", a local first-
 * commit guard so a fast tap can't double-submit before React re-renders with
 * `disabled`. Selection toggles; reaching `expectedCount` selections fires
 * onAnswer exactly once. A "Clear" text button recovers from a fat-finger tap
 * while still answering.
 *
 * The parent keys this component by item id, so a new question remounts it
 * fresh — no transition effect is needed to reset selection or the commit guard.
 */
export function NoteChips({
  chips,
  expectedCount,
  disabled,
  onAnswer,
  feedback,
}: NoteChipsProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>([]);
  // Commit guard: once we fire onAnswer we lock so extra taps can't re-submit
  // before React re-renders with `disabled`. Reset by remount on the next item.
  const locked = useRef(false);

  // Normalized set of correct spellings (ASCII) for feedback highlighting.
  const correctSet = feedback
    ? new Set(feedback.correctNotes.map(normalizeDisplay))
    : null;

  // Set of pitch classes expected by the correct answer, for amber near-miss.
  const correctPcSet = feedback
    ? new Set(feedback.correctNotes.map((n) => pcOf(normalizeDisplay(n))))
    : null;

  const toggle = (chip: string) => {
    if (disabled || locked.current) return;
    const isSelected = selected.includes(chip);
    const next = isSelected
      ? selected.filter((c) => c !== chip)
      : [...selected, chip];
    setSelected(next);
    if (next.length === expectedCount) {
      locked.current = true;
      onAnswer(next);
    }
  };

  const clear = () => {
    if (disabled || locked.current) return;
    setSelected([]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div role="group" aria-label={t('drill.a11y.notes')} className="grid grid-cols-3 gap-2 max-sm:grid-cols-3">
        {chips.map((chip, i) => {
          const isSelected = selected.includes(chip);
          const ascii = normalizeDisplay(chip);
          const showCorrect = disabled && correctSet?.has(ascii);
          // Amber: selected chip whose spelling differs from any correct note but
          // whose pitch class matches one — i.e. an enharmonic near-miss at the
          // chip level (e.g. G♭ selected when F♯ is correct).
          const showAmber =
            disabled &&
            isSelected &&
            !showCorrect &&
            correctPcSet != null &&
            correctPcSet.has(pcOf(ascii));
          const showWrong = disabled && isSelected && !showCorrect && !showAmber;

          let stateClass = '';
          if (showCorrect) {
            stateClass = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
          } else if (showAmber) {
            stateClass = 'bg-amber-500/15 border-amber-500/40 text-amber-300';
          } else if (showWrong) {
            stateClass = 'bg-red-500/15 border-red-500/40 text-red-300';
          }

          const neutral = !showCorrect && !showAmber && !showWrong;
          // While answering, a selected (but not yet graded) chip gets an accent ring.
          const activeSelect = !disabled && isSelected;

          return (
            <m.button
              // Chord chips can repeat display strings across distractors only
              // in theory; index keeps keys unique regardless.
              key={`${chip}-${i}`}
              type="button"
              whileTap={!disabled ? { scale: 0.96, transition: SPRING_MICRO } : undefined}
              onClick={() => toggle(chip)}
              disabled={disabled}
              aria-disabled={disabled}
              aria-pressed={isSelected}
              className={`min-h-[44px] px-2 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${stateClass} ${
                disabled ? 'cursor-default' : 'cursor-pointer'
              }`}
              style={
                neutral
                  ? {
                      backgroundColor: activeSelect
                        ? 'var(--accent-dim)'
                        : 'color-mix(in srgb, var(--card) 60%, transparent)',
                      borderColor: activeSelect
                        ? 'var(--accent)'
                        : 'color-mix(in srgb, var(--border) 50%, transparent)',
                      color: activeSelect ? 'var(--accent)' : 'var(--text-muted)',
                    }
                  : undefined
              }
            >
              {chip}
            </m.button>
          );
        })}
      </div>

      {!disabled && selected.length > 0 && (
        <button
          type="button"
          onClick={clear}
          className="self-start text-xs font-medium px-1 transition-colors"
          style={{ color: 'var(--text-dim)' }}
        >
          {t('drill.clear')}
        </button>
      )}
    </div>
  );
}
