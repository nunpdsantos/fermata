import { useTranslation } from 'react-i18next';
import { usePWA } from '../../hooks/usePWA.ts';
import { noteFor } from '../../services/appVersion.ts';
import { Button, IconButton } from '../ui/Button';
import { useToastRoom } from './toastLayout.ts';

/**
 * The "What's new" line makes a toast two to five lines tall; it shows only
 * where the toast region has room for that (W9b). Over a phone's instrument
 * at Full — or a phone held sideways — the region has room for one plain
 * toast (W11-A) and a taller card would cover the instrument; there the
 * prompt stays one line, and the note shows once the instrument is lowered.
 */
export const NOTE_MIN_ROOM_PX = 160;

export function PWAPrompts() {
  const { t, i18n } = useTranslation();
  const {
    needRefresh, offlineReady, updateDeferred, deferUpdate, incoming, updated, dismissUpdated,
    finishUpdate, finishUpdateReload, canInstall, install, dismissInstall, reload, dismissOffline,
  } = usePWA();
  // "Later" hides the update toast; the "⋯" menu keeps "Update ready" until the reload.
  const showUpdate = needRefresh && !updateDeferred;
  // One line about the new version, in the learner's language (W9b, version.json).
  const roomForNote = useToastRoom() >= NOTE_MIN_ROOM_PX;
  const whatsNew = (notes: Parameters<typeof noteFor>[0] | null | undefined) =>
    notes && roomForNote ? t('pwa.whatsNew', { note: noteFor(notes, i18n.language) }) : undefined;

  if (!showUpdate && !finishUpdate && !updated && !offlineReady && !canInstall) return null;

  // ONE stack, highest priority first (update > finish updating > updated > offline-ready > install).
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
          detail={whatsNew(incoming?.notes)}
          action={t('common.reload')}
          onAction={reload}
          secondary={t('pwa.later')}
          onSecondary={deferUpdate}
        />
      )}

      {/* A new version took control without this page asking (a late
          takeover, another tab's Reload): never reloaded under the learner —
          one tap finishes it (W9b review). */}
      {finishUpdate && (
        <Toast
          message={t('pwa.finishUpdate')}
          action={t('common.reload')}
          onAction={finishUpdateReload}
        />
      )}

      {/* After an automatic update (W9b): what just happened, and what is new.
          Leaves by itself after UPDATED_NOTICE_MS (usePWA). */}
      {updated && (
        <Toast
          message={t('pwa.updated')}
          detail={whatsNew(updated.notes)}
          onDismiss={dismissUpdated}
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
  detail,
  action,
  onAction,
  secondary,
  onSecondary,
  onDismiss,
}: {
  message: string;
  /** A second line under the message ("What's new: …"). */
  detail?: string;
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
      <span className="flex-1">
        {message}
        {detail && <span className="block text-caption">{detail}</span>}
      </span>
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
