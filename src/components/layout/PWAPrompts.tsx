import { useTranslation } from 'react-i18next';
import { usePWA } from '../../hooks/usePWA.ts';
import { Button } from '../ui/Button';

export function PWAPrompts() {
  const { t } = useTranslation();
  const { needRefresh, offlineReady, canInstall, install, dismissInstall, reload, dismissOffline } = usePWA();

  if (!needRefresh && !offlineReady && !canInstall) return null;

  // ONE fixed stack, highest priority first (update > offline-ready >
  // install). Each toast used to fix itself at the same spot, so later ones
  // covered the update toast and its Reload (review B1).
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-max max-w-[calc(100vw-2rem)]"
      data-testid="pwa-toast-stack"
    >
      {/* Update available toast */}
      {needRefresh && (
        <Toast
          message={t('pwa.newVersion')}
          action={t('common.reload')}
          onAction={reload}
        />
      )}

      {/* Offline ready toast (auto-dismiss) */}
      {offlineReady && (
        <Toast
          message={t('pwa.offlineReady')}
          onDismiss={dismissOffline}
        />
      )}

      {/* Install prompt */}
      {canInstall && (
        <Toast
          message={t('pwa.installPrompt')}
          action={t('common.install')}
          onAction={install}
          onDismiss={dismissInstall}
        />
      )}
    </div>
  );
}

function Toast({
  message,
  action,
  onAction,
  onDismiss,
}: {
  message: string;
  action?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm shadow-lg"
      style={{
        backgroundColor: 'var(--card)',
        color: 'var(--text)',
        border: '1px solid var(--border)',
      }}
      role="alert"
    >
      <span>{message}</span>
      {action && onAction && (
        <Button variant="accent" size="sm" onClick={onAction}>
          {action}
        </Button>
      )}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded transition-colors"
          style={{ color: 'var(--text-dim)' }}
          aria-label={t('common.dismiss')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
