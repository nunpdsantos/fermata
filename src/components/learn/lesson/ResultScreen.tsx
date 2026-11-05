import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { ItemOutcome } from '../exercises/ExerciseRunner';
import { passMark } from '../exercises/scoring';
import { choicesForExercise } from '../exercises/exerciseHelpers';
import { Button } from '../../ui/Button';

export interface ResultAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'quiet';
}

interface ResultScreenProps {
  title: string;
  outcomes: ItemOutcome[];
  kind: 'check' | 'review' | 'practice';
  passed: boolean;
  /** "Re-read ›": the section label a question points back to, and the jump. */
  rereadFor?: (outcome: ItemOutcome) => { label: string; onClick: () => void } | null;
  /** Below the score: a status line (e.g. "Tick the 2 practice tasks …"). */
  note?: React.ReactNode;
  actions: ResultAction[];
}

/**
 * The end of a check (W4b, D-27): the score, the pass mark, "Nothing is lost",
 * the questions to look at again (what you said · what it is · Re-read ›) and
 * always a next step — a failed set never ends on a card with no button.
 * Answers are shown here because every item is final (D-09).
 */
export function ResultScreen({ title, outcomes, kind, passed, rereadFor, note, actions }: ResultScreenProps) {
  const { t, i18n } = useTranslation();
  const fmt = (n: number) => n.toLocaleString(i18n.language || 'en', { maximumFractionDigits: 1 });
  const total = outcomes.length;
  const earned = outcomes.reduce((n, o) => n + o.score, 0);
  const missed = outcomes.map((o, i) => ({ o, n: i + 1 })).filter(({ o }) => o.score < 1);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const heading = kind === 'practice' ? 'lesson.practiceFinished' : kind === 'review' ? 'lesson.reviewFinished' : 'lesson.checkFinished';
  const right = outcomes.filter((o) => o.score > 0).length;
  // A question with two options gets one try (its second could not be wrong) — say so when the set had one.
  const hadOneTry = outcomes.some((o) => choicesForExercise(o.exercise, t).length === 2);

  return (
    <div className="flex flex-col gap-4 w-full max-w-[640px] mx-auto px-4 max-sm:px-3 py-6" data-testid="check-result">
      <h2 ref={headingRef} tabIndex={-1} className="text-ui outline-none" style={{ color: 'var(--text-muted)' }}>
        {t(heading, { title })}
      </h2>
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="learn-serif whitespace-nowrap" style={{ fontSize: 44, lineHeight: 1.1, color: 'var(--text)' }} data-testid="result-score">
          {kind === 'practice'
            ? t('lesson.practiceScore', { right, total })
            : t('lesson.scoreOf', { score: fmt(earned), total })}
        </span>
        <span className="text-body" style={{ color: 'var(--text-muted)' }}>
          {kind === 'practice'
            ? t('lesson.practiceNote')
            : passed
              ? t('lesson.passedMark', { score: fmt(passMark(total)), total })
              : `${t('lesson.needToPass', { score: fmt(passMark(total)), total })} ${t('lesson.nothingLost')}`}
        </span>
      </div>
      {kind !== 'practice' && (
        <p className="text-ui" style={{ color: 'var(--text-muted)' }} data-testid="result-scoring">
          {hadOneTry ? `${t('lesson.scoring')} ${t('lesson.oneTryNote')}` : t('lesson.scoring')}
        </p>
      )}
      {note}

      {missed.length > 0 ? (
        <section className="flex flex-col gap-2" aria-labelledby="result-missed">
          <h3 id="result-missed" className="type-label">{t('lesson.lookAgain')}</h3>
          <ul className="flex flex-col gap-2">
            {missed.map(({ o, n }) => {
              const reread = rereadFor?.(o) ?? null;
              return (
                <li
                  key={o.exercise.id}
                  className="grid grid-cols-[auto_1fr_auto] max-sm:grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-center px-3 py-2.5 rounded-xl"
                  style={{ backgroundColor: 'var(--card)' }}
                  data-testid="missed-question"
                >
                  <span className="text-ui tabular-nums" style={{ color: 'var(--text-muted)' }}>{t('lesson.questionN', { n })}</span>
                  <span className="text-ui min-w-0" style={{ color: 'var(--text)' }}>
                    <span>{o.exercise.prompt}</span>
                    <span style={{ color: 'var(--text-muted)' }}> · {t('lesson.youSaid')} </span>
                    <span>{o.answers.join(`, ${t('lesson.then')} `)}</span>
                    <span style={{ color: 'var(--text-muted)' }}> · {t('lesson.itIs')} </span>
                    <b data-testid="missed-answer">{o.answer}</b>
                    {/* After the answers, so no line starts with a bare "·". */}
                    {o.score === 0.5 && <span className="block text-caption" data-testid="half-credit">{t('lesson.secondTryCredit')}</span>}
                  </span>
                  {reread && (
                    <Button variant="quiet" className="max-sm:col-start-2 max-sm:justify-self-start" onClick={reread.onClick} aria-label={t('lesson.rereadLabel', { section: reread.label })}>
                      {t('lesson.reread')} <span aria-hidden="true">›</span>
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <p className="text-body" style={{ color: 'var(--text-muted)' }}>{t('lesson.allRight')}</p>
      )}

      <div className="flex flex-wrap gap-2.5 max-sm:flex-col">
        {actions.map((a) => (
          <Button key={a.label} variant={a.variant ?? 'secondary'} onClick={a.onClick} className="max-sm:w-full">
            {a.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
