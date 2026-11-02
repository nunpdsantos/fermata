import { useTranslation } from 'react-i18next';
import { usePWA } from '../../hooks/usePWA.ts';
import { Button, IconButton } from '../ui/Button';

export function PWAPrompts() {
  const { t } = useTranslation();
  const { needRefresh, offlineReady, updateDeferred, deferUpdate, canInstall, install, dismissInstall, reload, dismissOffline } = usePWA();
  // "Later" hides the update toast; the "⋯" menu keeps "Update ready" until the reload.
  const showUpdate = needRefresh && !updateDeferred;

  if (!showUpdate && !offlineReady && !canInstall) return null;

  // ONE stack, highest priority first (update > offline-ready > install).
  // Each toast used to fix itself at the same spot, so later ones covered the
  // update toast and its Reload (review B1). The stack itself is placed by
  // ToastRegion, above the instrument dock (W9-22).
  return (
    <div className="flex flex-col gap-2 pointer-events-auto" data-testid="pwa-toast-stack">
      {/* Update available toast: one tap reloads (W9-06); "Later" puts it
          off — it stays in the "⋯" menu. */}
      {showUpdate && (
        <Toast
          message={t('pwa.newVersion')}
          action={t('common.reload')}
          onAction={reload}
          secondary={t('pwa.later')}
          onSecondary={deferUpdate}
        />
      )}

      {/* Offline ready toast (dismisses itself after OFFLINE_READY_MS — usePWA) */}
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
  secondary,
  onSecondary,
  onDismiss,
}: {
  message: string;
  action?: string;
  onAction?: () => void;
  secondary?: string;
  onSecondary?: () => void;
  onDismiss?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div
      className="toast-card flex items-center gap-3 pl-4 pr-1.5 py-1.5 text-ui"
      role="alert"
    >
      <span className="flex-1">{message}</span>
      {secondary && onSecondary && (
        <Button variant="quiet" onClick={onSecondary}>
          {secondary}
        </Button>
      )}
      {action && onAction && (
        <Button variant="primary" onClick={onAction}>
          {action}
        </Button>
      )}
      {onDismiss && (
        <IconButton
          onClick={onDismiss}
          aria-label={t('common.dismiss')}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          }
        />
      )}
    </div>
  );
}
