/**
 * Fetching a shared link's own code at boot (App.tsx), in the entry: what is
 * said when that code cannot be fetched must not live in it.
 *
 * - The code arrives: the link opens (services/shareLinkOpen.ts), applied as
 *   ever, or only offered ("Open") when `moved()`, asked at the moment of
 *   applying, says the learner went elsewhere or chose something the link
 *   would set while it was on its way.
 * - It cannot be fetched: one lasting toast says the link could not open,
 *   with "Try Again". A failed module fetch is cached for the page (measured
 *   in Chromium 145: a second import() of it fails at once, no new request),
 *   so "Try Again" puts the link's address back on this entry, exactly as
 *   the page was opened (fragment included), and reloads, as a view's own
 *   "Try again" does after a failed download (an update waiting is applied
 *   first): the reloaded page opens the link exactly as a first visit does,
 *   work in progress included, or says so again. Offline with no service
 *   worker in control nothing could answer that reload (the page would become
 *   the browser's error page): the page is left as it is and the same toast
 *   comes back, the link kept for the next "Try Again". With a worker in
 *   control the reload is served from its cache, so it goes ahead.
 * Never throws, and never leaves a rejection unhandled.
 */
import i18n from '../i18n/index.ts';
import { useToastStore } from '../state/toastStore.ts';
import { applyUpdateOrReload } from '../hooks/usePWA.ts';
import type { RawShareParams } from '../state/shareParams.ts';

type LinkCode = typeof import('./shareLinkOpen.ts');

export function openLinkCode(
  link: RawShareParams,
  asTyped: RawShareParams | null,
  moved: () => boolean,
  /** The address the page was opened with, link and fragment included. */
  address: string,
  load: () => Promise<LinkCode> = () => import('./shareLinkOpen.ts'),
): Promise<unknown> {
  const failed = (): void => {
    useToastStore.getState().addToast({
      type: 'error',
      message: i18n.t('share.loadError'),
      duration: 0,
      action: {
        label: i18n.t('common.tryAgain'),
        onSelect: () => {
          if (!navigator.onLine && !navigator.serviceWorker?.controller) return failed();
          window.history.replaceState(window.history.state, '', address);
          void applyUpdateOrReload();
        },
      },
    });
  };
  return load()
    .then((m) => m.openShareLink(link, asTyped, moved), failed)
    .catch((e) => console.warn('[share link]', e));
}
