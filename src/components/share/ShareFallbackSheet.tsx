import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet } from '../ui/Sheet.tsx';
import { useShareFallbackStore, closeShareFallback } from '../../state/shareFallbackStore.ts';

/**
 * The visible fallback when the browser refused both the share sheet and the
 * clipboard: the link, selected, in a read-only field the learner can copy
 * from by hand.
 */
export default function ShareFallbackSheet() {
  const { t } = useTranslation();
  const url = useShareFallbackStore((s) => s.url);
  const field = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!url) return;
    // After the sheet has moved focus in: select the whole link.
    const id = window.setTimeout(() => {
      field.current?.focus();
      field.current?.select();
    }, 50);
    return () => window.clearTimeout(id);
  }, [url]);
  return (
    <Sheet open={url !== null} onClose={closeShareFallback} title={t('share.fallbackTitle')} closeLabel={t('common.close')} testId="share-fallback">
      <p className="text-ui mb-3" style={{ color: 'var(--text-muted)' }}>{t('share.fallbackHint')}</p>
      <label className="block">
        <span className="type-label block mb-1.5">{t('share.fallbackField')}</span>
        <input
          ref={field}
          type="text"
          readOnly
          value={url ?? ''}
          data-testid="share-fallback-field"
          className="share-link-field"
          onFocus={(e) => e.currentTarget.select()}
        />
      </label>
    </Sheet>
  );
}
