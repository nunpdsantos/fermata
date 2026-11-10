import { useTranslation } from 'react-i18next';
import { useMediaQuery } from './useMediaQuery.ts';
import { COARSE_POINTER_QUERY } from '../services/shareLinkMake.ts';

/**
 * The "Copy link" / "Share link" menu item's words, kept in step with the
 * device: re-renders when the pointer type changes (a tablet gaining a
 * trackpad), so the words always match what deliverLink does when it runs.
 */
export function useShareLinkLabel(): string {
  const { t } = useTranslation();
  const coarse = useMediaQuery(COARSE_POINTER_QUERY);
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  return t(coarse && canShare ? 'share.shareLink' : 'share.copyLink');
}
