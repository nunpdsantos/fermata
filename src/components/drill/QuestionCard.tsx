import { useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToastAvoid } from '../layout/toastLayout';

interface QuestionCardProps {
  /** Zero-based index of the current question. */
  asked: number;
  total: number;
  /** The question is a re-ask in this session: marked, the total unchanged. */
  again?: boolean;
  prompt: string;
  onEndSession: () => void;
  onOpenSettings: () => void;
  /** Elapsed session seconds — rendered subtly when the showTimer setting is on.
   *  undefined hides the counter entirely (the default). */
  elapsedSeconds?: number;
  /** The answer area: input, feedback, Continue. On a phone it sits in the
   *  lower half of the screen — the one-handed thumb zone (D-26). */
  children: ReactNode;
  stimulus?: ReactNode;
}

export function QuestionCard({
  asked,
  total,
  again = false,
  prompt,
  onEndSession,
  onOpenSettings,
  elapsedSeconds,
  children,
  stimulus,
}: QuestionCardProps) {
  const { t } = useTranslation();
  const answersRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  useToastAvoid(answersRef, !stimulus);
  useToastAvoid(rootRef, !!stimulus);
  const current = Math.min(asked + 1, total);

  return (
    <div ref={rootRef} className={stimulus ? 'drill-run drill-run--read' : 'drill-run'}>
      {/* Slim header: progress · [elapsed] · spacer · settings · end-session */}
      <div className={`drill-question-header flex items-center gap-2 ${stimulus ? 'mb-1' : 'mb-5'}`}>
        <span className="text-ui font-medium tabular-nums" style={{ color: 'var(--text-dim)' }}>
          {t('drill.progress', { current, total })}
        </span>
        {again && <Badge data-testid="drill-again">{t('drill.reask')}</Badge>}
        {elapsedSeconds !== undefined && (
          <span
            className="font-mono text-ui tabular-nums"
            style={{ color: 'var(--text-dim)' }}
            aria-hidden="true"
          >
            {formatElapsed(elapsedSeconds)}
          </span>
        )}
        <div className="flex-1" />
        <IconButton
          onClick={onOpenSettings}
          aria-label={t('drill.settings.title')}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          }
        />
        <IconButton
          onClick={onEndSession}
          aria-label={t('drill.endSession')}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          }
        />
      </div>

      <div className="drill-question-prompt">
        {/* Prompt — title step (20 px) */}
        <p className={`text-xl font-medium leading-snug ${stimulus ? 'mb-1' : 'mb-6'}`} style={{ color: 'var(--text)' }}>
          {prompt}
        </p>
        {stimulus}
      </div>

      {/* Toasts never cover the answers (useToastAvoid). */}
      <div ref={answersRef} className="drill-thumb" data-testid="drill-answers">
        {children}
      </div>
    </div>
  );
}

/** mm:ss for the subtle elapsed-time counter (clamped at non-negative). */
function formatElapsed(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${ss.toString().padStart(2, '0')}`;
}
