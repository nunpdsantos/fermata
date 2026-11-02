import type { ReactNode } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useToastStore, type ToastType } from '../../state/toastStore.ts';
import { IconButton } from '../ui/Button';
import { SPRING_SNAPPY } from '../../design/tokens/motion';

// Theme TEXT tokens (≥ 4.5:1 in both themes) for the icon and the edge — the
// info toast used the stray Tailwind blue (W11-A); it is the accent now.
const TONE_COLORS: Record<ToastType, string> = {
  success: 'var(--success-text)',
  info: 'var(--accent-text)',
  warning: 'var(--warning-text)',
  error: 'var(--danger-text)',
};

const icon = (type: ToastType): ReactNode => {
  const stroke = TONE_COLORS[type];
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 2.5, strokeLinecap: 'round' as const, 'aria-hidden': true };
  switch (type) {
    case 'success':
      return <svg {...common}><polyline points="20 6 9 17 4 12" /></svg>;
    case 'info':
      return <svg {...common}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
    case 'warning':
      return <svg {...common}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
    case 'error':
      return <svg {...common}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>;
  }
};

/** App toasts. Placed by ToastRegion (never over the instrument, W9-22). */
export function ToastContainer() {
  const { t: translate } = useTranslation();
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="flex flex-col gap-2" aria-live="polite" aria-atomic="false">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <m.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={SPRING_SNAPPY}
            className="pointer-events-auto"
          >
            <div
              className="toast-card flex items-center gap-2.5 pl-3.5 pr-1 py-1 text-ui font-medium"
              style={{ borderLeft: `4px solid ${TONE_COLORS[t.type]}` }}
              role="status"
            >
              <span className="shrink-0 flex">{icon(t.type)}</span>
              <span className="flex-1">{t.message}</span>
              <IconButton
                onClick={() => removeToast(t.id)}
                aria-label={translate('common.dismiss')}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                }
              />
            </div>
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
