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
 */

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
