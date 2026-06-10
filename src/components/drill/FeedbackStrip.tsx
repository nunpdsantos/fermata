import { useReducedMotion, m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { GradeResult } from './grading';
import { SPRING_SNAPPY, SPRING_MICRO } from '../../design/tokens/motion';

interface FeedbackStripProps {
  result: GradeResult;
  /** Canonical answer text (the correct choice as shown on its chip). */
  answerText: string;
  /** The translated "why" line for the item. */
  whyText: string;
  onContinue: () => void;
  /** Continue button only appears for wrong answers (correct ones auto-advance). */
  showContinue: boolean;
}

export function FeedbackStrip({
  result,
  answerText,
  whyText,
  onContinue,
  showContinue,
}: FeedbackStripProps) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const isCorrect = result.correct;

  return (
    <m.div
      aria-live="polite"
      aria-atomic="true"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={SPRING_SNAPPY}
      className={`rounded-xl p-4 mt-4 border ${
        isCorrect ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-red-500/10 border-red-500/25'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 shrink-0 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`} aria-hidden="true">
          {isCorrect ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </span>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium mb-1 ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
            {isCorrect ? t('drill.feedback.correct') : t('drill.feedback.wrong')}
            {!isCorrect && (
              <span style={{ color: 'var(--text)' }}>{` — ${answerText}`}</span>
            )}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {whyText}
          </p>
        </div>
      </div>

      {showContinue && (
        <div className="mt-3">
          <m.button
            type="button"
            whileTap={{ scale: 0.98, transition: SPRING_MICRO }}
            onClick={onContinue}
            className="w-full min-h-[44px] rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)' }}
          >
            {t('drill.feedback.continue')}
          </m.button>
        </div>
      )}
    </m.div>
  );
}
