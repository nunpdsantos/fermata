import { useReducedMotion, m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { GradeResult } from './grading';
import { SPRING_SNAPPY, SPRING_MICRO } from '../../design/tokens/motion';

interface FeedbackStripProps {
  result: GradeResult;
  /** Canonical answer text (the correct spelling, as shown on its chip/slots). */
  answerText: string;
  /** The translated "why" line for the item. */
  whyText: string;
  onContinue: () => void;
  /** Continue button appears for anything that isn't an auto-advancing correct. */
  showContinue: boolean;
  /**
   * Optional "Learn about this" deep link (wrong / near-miss only). When
   * provided, renders a link that runs onLearnMore.
   */
  learnMoreLabel?: string;
  onLearnMore?: () => void;
}

type Tone = 'correct' | 'wrong' | 'nearMiss';

const TONE_CONTAINER: Record<Tone, string> = {
  correct: 'bg-emerald-500/10 border-emerald-500/25',
  wrong: 'bg-red-500/10 border-red-500/25',
  nearMiss: 'bg-amber-500/10 border-amber-500/25',
};
const TONE_ICON: Record<Tone, string> = {
  correct: 'text-emerald-400',
  wrong: 'text-red-400',
  nearMiss: 'text-amber-400',
};
const TONE_TITLE: Record<Tone, string> = {
  correct: 'text-emerald-300',
  wrong: 'text-red-300',
  nearMiss: 'text-amber-300',
};

export function FeedbackStrip({
  result,
  answerText,
  whyText,
  onContinue,
  showContinue,
  learnMoreLabel,
  onLearnMore,
}: FeedbackStripProps) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const tone: Tone = result.correct ? 'correct' : result.nearMiss ? 'nearMiss' : 'wrong';

  return (
    <m.div
      aria-live="polite"
      aria-atomic="true"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={SPRING_SNAPPY}
      className={`rounded-xl p-4 mt-4 border ${TONE_CONTAINER[tone]}`}
    >
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 shrink-0 ${TONE_ICON[tone]}`} aria-hidden="true">
          {tone === 'correct' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : tone === 'nearMiss' ? (
            // Half-right: an approximate / "≈" mark reads as "close".
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
              <path d="M3 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </span>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium mb-1 ${TONE_TITLE[tone]}`}>
            {tone === 'correct' && t('drill.feedback.correct')}
            {tone === 'wrong' && (
              <>
                {t('drill.feedback.wrong')}
                <span style={{ color: 'var(--text)' }}>{` — ${answerText}`}</span>
              </>
            )}
            {tone === 'nearMiss' && t('drill.feedback.nearMiss', { expected: answerText })}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {whyText}
          </p>
          {learnMoreLabel && onLearnMore && (
            <button
              type="button"
              onClick={onLearnMore}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              {learnMoreLabel}
              <span aria-hidden="true">→</span>
            </button>
          )}
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
