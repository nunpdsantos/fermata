/**
 * Fetching a shared link's own code at boot (App.tsx), in the entry: what is
 * said when that code cannot be fetched must not live in it.
 *
 * - The code arrives: the link opens (services/shareLinkOpen.ts), applied as
 *   ever, or only offered ("Open") when `offer()` says the learner went to
 *   another view while it was on its way.
 * - It cannot be fetched: one lasting toast says the link could not open,
 *   with "Try Again". A failed module fetch is cached for the page (measured
 *   in Chromium 145: a second import() of it fails at once, no new request),
 *   so "Try Again" puts the link's address back on this entry and reloads,
 *   as a view's own "Try again" does after a failed download (an update
 *   waiting is applied first): the reloaded page opens the link exactly as a
 *   first visit does, work in progress included, or says so again.
 * Never throws.
 */
import i18n from '../i18n/index.ts';
import { useToastStore } from '../state/toastStore.ts';
import { applyUpdateOrReload } from '../hooks/usePWA.ts';
import type { RawShareParams } from '../state/shareParams.ts';

type LinkCode = typeof import('./shareLinkOpen.ts');

export function openLinkCode(
  link: RawShareParams,
  asTyped: RawShareParams | null,
  offer: () => boolean,
  /** The address the page was opened with, link included. */
  address: string,
  load: () => Promise<LinkCode> = () => import('./shareLinkOpen.ts'),
): Promise<unknown> {
  return load().then(
    (m) => m.openShareLink(link, asTyped, offer()),
    () => {
      useToastStore.getState().addToast({
        type: 'error',
        message: i18n.t('share.loadError'),
        duration: 0,
        action: {
          label: i18n.t('common.tryAgain'),
          onSelect: () => {
            window.history.replaceState(window.history.state, '', address);
            void applyUpdateOrReload();
          },
        },
      });
    },
  );
}
