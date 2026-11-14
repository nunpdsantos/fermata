/**
 * App-language helpers shared by the i18n bootstrap, the preferences slice and
 * the persisted-state guard.
 *
 * - First run (nothing persisted) follows the browser: the first entry of
 *   `navigator.languages` whose primary subtag is pt, es or en wins (W6-16).
 *   A saved choice always beats the browser.
 * - `<html lang>` follows the app language, so screen readers and spellcheck
 *   treat Portuguese and Spanish text as such (W6-15). Portuguese is declared
 *   as pt-PT (the content is European Portuguese), Spanish as es-ES.
 * - `?lang=en|pt|es` in the address (2026-11-14): the search pages' "Open in
 *   Fermatina" links say the language of the page they come from. It counts
 *   only on a visit where NO app data is saved (nothing chose a language
 *   yet); then the visit starts in it instead of the browser's. Otherwise it
 *   is ignored — a saved language always wins. Either way the address bar
 *   loses it as it loses a shared link's parameters (state/shareParams.ts
 *   `cleanedAddress`). It is not a shared link: `?lang=pt` alone still shows
 *   the start screen, in Portuguese.
 */

import { hasSavedAppData } from '../state/welcomeGate';

export const APP_LANGUAGES = ['en', 'pt', 'es'] as const;
export type AppLanguage = (typeof APP_LANGUAGES)[number];

export function isAppLanguage(value: unknown): value is AppLanguage {
  return typeof value === 'string' && (APP_LANGUAGES as readonly string[]).includes(value);
}

/** Browser language list, most preferred first; empty when unavailable. */
function browserLanguages(): readonly string[] {
  try {
    if (typeof navigator === 'undefined') return [];
    if (Array.isArray(navigator.languages) && navigator.languages.length > 0) return navigator.languages;
    return navigator.language ? [navigator.language] : [];
  } catch {
    return [];
  }
}

/**
 * Pick the app language from a browser language list ("pt-PT", "es-419",
 * "en-GB", …). The first tag the app supports wins; English otherwise.
 */
export function detectBrowserLanguage(languages: readonly string[] = browserLanguages()): AppLanguage {
  for (const tag of languages) {
    const primary = String(tag).trim().toLowerCase().split(/[-_]/)[0];
    if (isAppLanguage(primary)) return primary;
  }
  return 'en';
}

/** The address parameter the search pages' links carry. */
export const LANG_PARAM = 'lang';

/** The app language a query string's `?lang=` names (case and spaces forgiven), or null. */
export function addressLanguage(search: string): AppLanguage | null {
  try {
    const value = new URLSearchParams(search).get(LANG_PARAM)?.trim().toLowerCase();
    return isAppLanguage(value) ? value : null;
  } catch {
    return null;
  }
}

type ReadableStorage = Pick<Storage, 'getItem' | 'length' | 'key'>;

/**
 * The address's language when it may choose the visit's language: only when
 * this storage holds no app data at all (state/welcomeGate.ts
 * `hasSavedAppData`, the first-visit gate's own test). Storage that cannot be
 * read: null (the browser's language, as before).
 */
export function linkLanguage(search: string, storage: ReadableStorage | undefined): AppLanguage | null {
  const lang = addressLanguage(search);
  if (!lang || !storage) return null;
  try {
    return hasSavedAppData(storage) ? null : lang;
  } catch {
    return null;
  }
}

let bootLinkLanguage: AppLanguage | null | undefined;

/**
 * The language a visit starts in when no saved choice says otherwise: a
 * search page's `?lang=` on a visit with nothing saved, else the browser's
 * (W6-16). The address and storage are read ONCE, at the first call — the
 * i18n bootstrap, before any store exists or writes — so i18next and the
 * preferences slice's default agree.
 */
export function firstRunLanguage(): AppLanguage {
  if (bootLinkLanguage === undefined) {
    let storage: Storage | undefined;
    try {
      storage = globalThis.localStorage;
    } catch {
      storage = undefined;
    }
    bootLinkLanguage = typeof location === 'undefined' ? null : linkLanguage(location.search, storage);
  }
  return bootLinkLanguage ?? detectBrowserLanguage();
}

const HTML_LANG: Record<AppLanguage, string> = { en: 'en', pt: 'pt-PT', es: 'es-ES' };

/** BCP 47 tag for `<html lang>`. Unknown values fall back to English. */
export function htmlLangFor(language: string): string {
  return isAppLanguage(language) ? HTML_LANG[language] : HTML_LANG.en;
}

/** Point `<html lang>` at the app language (no-op outside a browser). */
export function syncDocumentLanguage(language: string): void {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = htmlLangFor(language);
}
