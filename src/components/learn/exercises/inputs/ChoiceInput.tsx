import { m } from 'framer-motion';
import type { ChoiceOption } from '../exerciseHelpers';
import { SPRING_MICRO } from '../../../../design/tokens/motion';

interface ChoiceInputProps {
  options: ChoiceOption[];
  selected: string | null;
  submitted: boolean;
  onSelect: (value: string) => void;
  accentColor: string;
}

export function ChoiceInput({ options, selected, submitted, onSelect, accentColor }: ChoiceInputProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        const showCorrect = submitted && opt.correct;
        const showIncorrect = submitted && isSelected && !opt.correct;

        let bg = '';
        let border = '';
        const defaultStyle: React.CSSProperties = { backgroundColor: 'color-mix(in srgb, var(--card) 60%, transparent)', border: '1px solid color-mix(in srgb, var(--border) 50%, transparent)' };
        let textColor = '';

        if (isSelected && !submitted) {
          bg = '';
          border = '';
          textColor = '';
        }
        if (showCorrect) {
          bg = 'bg-emerald-500/15';
          border = 'border-emerald-500/40';
          textColor = 'text-success';
        }
        if (showIncorrect) {
          bg = 'bg-red-500/15';
          border = 'border-red-500/40';
          textColor = 'text-danger';
        }

        return (
          <m.button
            key={opt.value}
            whileTap={!submitted ? { scale: 0.97, transition: SPRING_MICRO } : undefined}
            onClick={() => !submitted && onSelect(opt.value)}
            disabled={submitted}
            className={`px-3 py-2.5 max-sm:py-3 rounded-xl text-sm font-medium transition-all duration-150 ${bg} ${border} ${textColor} ${
              submitted ? 'cursor-default' : 'cursor-pointer'
            }`}
            style={
              isSelected && !submitted
                ? {
                    backgroundColor: `${accentColor}20`,
                    border: `1px solid ${accentColor}50`,
                    color: accentColor,
                  }
                : showCorrect || showIncorrect
                  ? undefined
                  : { ...defaultStyle, color: 'var(--text-muted)' }
            }
          >
            {opt.label}
          </m.button>
        );
      })}
    </div>
  );
}
