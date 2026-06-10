import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface QuestionCardProps {
  /** Zero-based index of the current question. */
  asked: number;
  total: number;
  prompt: string;
  onEndSession: () => void;
  onOpenSettings: () => void;
  children: ReactNode;
}

export function QuestionCard({
  asked,
  total,
  prompt,
  onEndSession,
  onOpenSettings,
  children,
}: QuestionCardProps) {
  const { t } = useTranslation();
  const current = Math.min(asked + 1, total);

  return (
    <div className="flex flex-col">
      {/* Slim header: progress · spacer · settings · end-session */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs font-medium tabular-nums" style={{ color: 'var(--text-dim)' }}>
          {t('drill.progress', { current, total })}
        </span>
        <div className="flex-1" />
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
          style={{ color: 'var(--text-dim)' }}
          aria-label={t('drill.settings.title')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onEndSession}
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
          style={{ color: 'var(--text-dim)' }}
          aria-label={t('drill.endSession')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Prompt — large type */}
      <p className="text-xl max-sm:text-lg font-medium leading-snug mb-6" style={{ color: 'var(--text)' }}>
        {prompt}
      </p>

      {children}
    </div>
  );
}
