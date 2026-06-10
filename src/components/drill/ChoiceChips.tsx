import { useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { SPRING_MICRO } from '../../design/tokens/motion';

interface ChoiceChipsProps {
  choices: string[];
  disabled: boolean;
  /** The choice the user tapped (drives wrong-answer styling during feedback). */
  selected: string | null;
  /** The canonical correct choice — only shown (success-styled) during feedback. */
  correctChoice: string | null;
  onSelect: (choice: string) => void;
}

/** Long labels (full key/chord spellings) get a single column for readability. */
const LONG_LABEL = 24;

export function ChoiceChips({
  choices,
  disabled,
  selected,
  correctChoice,
  onSelect,
}: ChoiceChipsProps) {
  // First-tap guard: once a tap fires we lock locally and ignore the rest.
  // This stops a fast double-tap from double-submitting BEFORE React re-renders
  // with `disabled` — the #1 competitor complaint. The runner guards again.
  const locked = useRef(false);

  // Re-arm the guard whenever the group becomes interactive again (next
  // question). Done in an effect — never mutate a ref during render.
  useEffect(() => {
    if (!disabled) locked.current = false;
  }, [disabled]);

  const oneColumn = choices.some((c) => c.length > LONG_LABEL);

  const handleSelect = (choice: string) => {
    if (disabled || locked.current) return;
    locked.current = true;
    onSelect(choice);
  };

  return (
    <div
      role="group"
      className={`grid gap-2 ${oneColumn ? 'grid-cols-1' : 'grid-cols-2'}`}
    >
      {choices.map((choice) => {
        const isSelected = selected === choice;
        const showCorrect = disabled && correctChoice === choice;
        const showWrong = disabled && isSelected && correctChoice !== choice;

        let stateClass = '';
        if (showCorrect) {
          stateClass = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
        } else if (showWrong) {
          stateClass = 'bg-red-500/15 border-red-500/40 text-red-300';
        }

        const neutral = !showCorrect && !showWrong;

        return (
          <m.button
            key={choice}
            type="button"
            whileTap={!disabled ? { scale: 0.97, transition: SPRING_MICRO } : undefined}
            onClick={() => handleSelect(choice)}
            disabled={disabled}
            aria-disabled={disabled}
            className={`min-h-[44px] px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${stateClass} ${
              disabled ? 'cursor-default' : 'cursor-pointer'
            }`}
            style={
              neutral
                ? {
                    backgroundColor: 'color-mix(in srgb, var(--card) 60%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--border) 50%, transparent)',
                    color: 'var(--text-muted)',
                  }
                : undefined
            }
          >
            {choice}
          </m.button>
        );
      })}
    </div>
  );
}
