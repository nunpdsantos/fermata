import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { ValidationResult } from '../../../core/types/exercise';
import { SPRING_SNAPPY, SPRING_MICRO } from '../../../design/tokens/motion';
import { accentText } from '../../../design/tokens/learnColors';

interface ExerciseFeedbackProps {
  result: ValidationResult;
  attempt: number;
  hint?: string;
  onTryAgain: () => void;
  onNext: () => void;
  accentColor: string;
}

export function ExerciseFeedback({
  result,
  attempt,
  hint,
  onTryAgain,
  onNext,
  accentColor,
}: ExerciseFeedbackProps) {
  const { t } = useTranslation();
  const isCorrect = result.correct;
  const canRetry = !isCorrect && attempt === 1;

  return (
    <m.div
      role="status"
      aria-live="assertive"
      aria-atomic="true"
      initial={isCorrect ? { opacity: 0, y: 8, scale: 0.95 } : { opacity: 0, x: 0 }}
      animate={isCorrect ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, x: [0, -4, 4, -2, 0] }}
      transition={isCorrect ? SPRING_SNAPPY : { duration: 0.3 }}
      className={`rounded-xl p-4 mt-4 border ${
        isCorrect
          ? 'bg-emerald-500/10 border-emerald-500/25'
          : 'bg-red-500/10 border-red-500/25'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className={`mt-0.5 shrink-0 ${isCorrect ? 'text-success pulse-ring-correct' : 'text-danger'}`}>
          {isCorrect ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <m.polyline
                points="20 6 9 17 4 12"
                strokeDasharray="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <m.line
                x1="18" y1="6" x2="6" y2="18"
                strokeDasharray="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.25, delay: 0.1 }}
              />
              <m.line
                x1="6" y1="6" x2="18" y2="18"
                strokeDasharray="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.25, delay: 0.1 }}
              />
            </svg>
          )}
        </span>

        <div className="flex-1 min-w-0">
          {/* Status line */}
          <p className={`text-sm font-medium mb-1 ${isCorrect ? 'text-success' : 'text-danger'}`}>
            {isCorrect
              ? attempt === 1
                ? t('exercise.correct')
                : t('exercise.correctPartial')
              : canRetry
                ? t('exercise.notQuite')
                : t('exercise.incorrect')}
          </p>

          {/* Explanation */}
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {result.explanation}
          </p>

          {/* Hint on first wrong attempt */}
          {canRetry && hint && (
            <p className="text-xs text-warning mt-2 leading-relaxed">
              {t('exercise.hint', { hint })}
            </p>
          )}
        </div>
      </div>

      {/* Action button */}
      <div className="mt-3 flex justify-end">
        {canRetry ? (
          <m.button
            whileTap={{ scale: 0.97 }}
            transition={SPRING_MICRO}
            onClick={onTryAgain}
            className="text-xs font-medium px-4 py-1.5 max-sm:py-2 max-sm:px-5 rounded-lg transition-colors"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentText(accentColor),
            }}
          >
            {t('common.tryAgain')}
          </m.button>
        ) : (
          <m.button
            whileTap={{ scale: 0.97 }}
            transition={SPRING_MICRO}
            onClick={onNext}
            className="text-xs font-medium px-4 py-1.5 max-sm:py-2 max-sm:px-5 rounded-lg transition-colors"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentText(accentColor),
            }}
          >
            {isCorrect ? t('common.continue') : t('common.next')}
          </m.button>
        )}
      </div>
    </m.div>
  );
}
