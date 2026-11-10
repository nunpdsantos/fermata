/**
 * The address-bar parameters of a shared link — the wave-1 contract (2026-11-10).
 *
 * OWNER: the share-links branch (stream E). It may extend this file (parsing,
 * building links); every other branch may only IMPORT the names exported
 * here, and must not change this file.
 *
 * `view` is NOT a share parameter on its own: `?view=drill` is the installed
 * app's shortcut (state/bootView.ts) and must keep behaving as it does.
 */
export const SHARE_PARAM_KEYS = ['key', 'scale', 'chord', 'inst', 'lesson'] as const;

export type ShareParamKey = (typeof SHARE_PARAM_KEYS)[number];

/** Does this query string (`window.location.search`) carry a shared link? */
export function hasShareParams(search: string): boolean {
  const params = new URLSearchParams(search);
  return SHARE_PARAM_KEYS.some((k) => params.has(k));
}
