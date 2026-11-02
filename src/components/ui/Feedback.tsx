import type { ReactNode } from 'react';
import { Button } from './Button';

/**
 * FEEDBACK (design system v2, D-28) — the answer verdict: a card with a
 * tone edge, a title in the tone's TEXT colour (--success/danger/warning-
 * text, ≥ 4.5:1 in both themes), a hint line in --text-muted and an optional
 * "Learn about this →" link-button. Colour is never the only signal: the
 * title says it ("Correct", "Not quite — …").
 */
export type FeedbackTone = 'correct' | 'wrong' | 'nearMiss';

const TITLE_CLASS: Record<FeedbackTone, string> = {
  correct: 'text-success',
  wrong: 'text-danger',
  nearMiss: 'text-warning',
};

export interface FeedbackProps {
  tone: FeedbackTone;
  title: ReactNode;
  /** The hint / explanation line. */
  hint?: ReactNode;
  learnMore?: { label: string; onClick: () => void };
  /** Announce politely when it appears (default true). */
  live?: boolean;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function Feedback({ tone, title, hint, learnMore, live = true, icon, className, children }: FeedbackProps) {
  return (
    <div
      className={['feedback', className].filter(Boolean).join(' ')}
      data-tone={tone}
      aria-live={live ? 'polite' : undefined}
      aria-atomic={live ? true : undefined}
    >
      <div className="flex items-start gap-2.5">
        {icon && (
          <span className={`mt-0.5 shrink-0 ${TITLE_CLASS[tone]}`} aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className={`text-body font-semibold ${TITLE_CLASS[tone]}`}>{title}</p>
          {hint && (
            <p className="text-ui mt-1" style={{ color: 'var(--text-muted)', lineHeight: 1.55 }}>
              {hint}
            </p>
          )}
          {learnMore && (
            <Button variant="link" className="mt-1 -ml-1.5" onClick={learnMore.onClick}>
              {learnMore.label}
              <span aria-hidden="true">→</span>
            </Button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
