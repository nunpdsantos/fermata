import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import type { ChoiceOption } from '../exerciseHelpers';
import { displayPattern } from '../displayPattern';
import { optionText } from '../exerciseHelpers';
import { StaffNotationSkeleton } from '../../../notation/StaffNotationSkeleton';

const StaffNotation = lazy(() =>
  import('../../../notation/StaffNotation').then((m) => ({ default: m.StaffNotation })),
);

interface ChoiceInputProps {
  options: ChoiceOption[];
  selected: string | null;
  /** Values already tried and wrong (first try): struck through, no longer choosable. */
  tried: readonly string[];
  /** The item is over: the answer is shown (D-09 — only now). */
  final: boolean;
  onSelect: (value: string) => void;
}

/**
 * The answers of a focused-check question (W4b): large targets in two
 * columns. Before the item is final nothing says which one is right: a wrong
 * first try is struck through (dashed, crossed out) and the others stay open
 * (decision D-09). Once final, the answer is marked (✓, the success colour)
 * and a wrong last pick is marked too — colour is never the only signal.
 */
export function ChoiceInput({ options, selected, tried, final, onSelect }: ChoiceInputProps) {
  const { t } = useTranslation();
  const melodies = options.some((o) => o.melody);
  // Statement answers get the full width on a phone (two columns of long
  // sentences were three lines each).
  const long = options.some((o) => o.label.length > 24);
  return (
    <div className={`grid gap-2.5 ${melodies || long ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'}`} data-testid="check-answers" role="group">
      {options.map((opt) => {
        const isTried = tried.includes(opt.value);
        const isSelected = selected === opt.value;
        const showCorrect = final && opt.correct;
        const showWrong = final && !opt.correct && (isSelected || isTried);
        const disabled = final || isTried;
        const strike = isTried || showWrong;
        const words = opt.melody ? t('exercise.melodyOption', { letter: opt.label, notes: optionText(opt) }) : opt.label;
        const displayLabel = displayPattern(opt.label);
        const space = displayLabel.indexOf(' ');
        const firstWord = space < 0 ? displayLabel : displayLabel.slice(0, space);
        const remaining = space < 0 ? '' : displayLabel.slice(space);
        const name = showCorrect
          ? t('lesson.answerIs', { answer: words })
          : isTried
            ? t('lesson.tried', { answer: words })
            : showWrong
              ? t('lesson.yourAnswer', { answer: words })
              : words;

        let cls = 'border';
        let style: React.CSSProperties = { backgroundColor: 'var(--bg-raised)', borderColor: 'var(--border)', color: 'var(--text)' };
        if (showCorrect) {
          cls = 'border bg-emerald-500/15 border-emerald-500/40 text-success';
          style = {};
        } else if (showWrong) {
          cls = 'border bg-red-500/15 border-red-500/40 text-danger';
          style = {};
        } else if (isTried) {
          cls = 'border border-dashed';
          style = { backgroundColor: 'transparent', borderColor: 'var(--border)', color: 'var(--text-muted)' };
        } else if (isSelected) {
          cls = 'border';
          // A staff is drawn in the text colour, so a melody option is marked
          // by a heavy accent edge instead of the solid accent fill.
          style = opt.melody
            ? { backgroundColor: 'var(--bg-raised)', borderColor: 'var(--accent)', boxShadow: 'inset 0 0 0 2px var(--accent)', color: 'var(--text)' }
            : { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)', color: 'var(--on-accent)' };
        }

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => !disabled && onSelect(opt.value)}
            disabled={disabled}
            aria-pressed={!final ? isSelected : undefined}
            aria-label={name}
            data-answer={opt.label}
            data-state={showCorrect ? 'answer' : showWrong ? 'wrong' : isTried ? 'tried' : isSelected ? 'selected' : 'open'}
            className={`relative min-h-[max(var(--tap),56px)] px-3 py-2.5 rounded-xl text-body font-semibold ${cls} ${disabled ? 'cursor-default' : 'cursor-pointer'} ${melodies ? 'text-left' : ''}`}
            // Every state must switch fill and ink together, including selection
            // and reset. Cancelling only on arrival at tried is too late (W4b).
            style={{ ...style, transition: 'none' }}
          >
            {opt.melody ? (
              <span className="flex flex-col gap-1">
                <span aria-hidden="true" className={`flex items-center gap-1.5 ${strike ? 'line-through' : ''}`}>
                  {showCorrect && <Check />}
                  {t('exercise.melodyLetter', { letter: opt.label })}
                </span>
                <Suspense fallback={<StaffNotationSkeleton height={84} />}>
                  <StaffNotation notes={opt.melody} keySignature={opt.keySignature} clef="treble" height={84} duration="q" />
                </Suspense>
              </span>
            ) : (
              <span aria-hidden="true" className={`${strike ? 'line-through' : ''}`}>
                {showCorrect ? <><span className="whitespace-nowrap"><Check />{firstWord}</span>{remaining}</> : displayLabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Check() {
  return (
    <svg className="inline-block align-middle mr-1.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
