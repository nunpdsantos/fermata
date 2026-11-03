import type { ReactNode } from 'react';
import { useReducedMotion, m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { GradeResult } from './grading';
import { SPRING_SNAPPY } from '../../design/tokens/motion';
import { Feedback, type FeedbackTone } from '../ui/Feedback';

interface FeedbackStripProps {
  result: GradeResult;
  reading?: boolean;
  /** Canonical answer text (the correct spelling, as shown on its chip/slots). */
  answerText: string;
  /** The translated "why" line for the item. */
  whyText: string;
  /**
   * Optional "Learn about this" deep link (wrong / near-miss only). When
   * provided, renders a link that runs onLearnMore.
   */
  learnMoreLabel?: string;
  onLearnMore?: () => void;
}

const ICONS: Record<FeedbackTone, ReactNode> = {
  correct: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  // Half-right: an approximate / "≈" mark reads as "close".
  nearMiss: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  ),
  wrong: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

/**
 * The Drill verdict, on the v2 Feedback card (D-28): tone edge + title in the
 * tone's text colour, the "why" as the hint line, and "Learn about this →"
 * on a miss. The Continue button is the screen's own (thumb zone, DrillView).
 */
export function FeedbackStrip({ result, answerText, whyText, learnMoreLabel, onLearnMore, reading }: FeedbackStripProps) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const tone: FeedbackTone = result.correct ? 'correct' : result.nearMiss ? 'nearMiss' : 'wrong';

  return (
    <m.div
      className="drill-feedback"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={SPRING_SNAPPY}
    >
      <Feedback
        tone={tone}
        icon={ICONS[tone]}
        title={
          tone === 'correct' ? (
            t('drill.feedback.correct')
          ) : tone === 'wrong' ? (
            <>
              {t('drill.feedback.wrong')}
              <span style={{ color: 'var(--text)' }}>{` — ${answerText}`}</span>
            </>
          ) : (
            t(reading ? 'drill.reading.nearMiss' : 'drill.feedback.nearMiss', { expected: answerText })
          )
        }
        hint={whyText}
        learnMore={learnMoreLabel && onLearnMore ? { label: learnMoreLabel, onClick: onLearnMore } : undefined}
      />
    </m.div>
  );
}
