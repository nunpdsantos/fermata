import { useEffect } from 'react';
import { bootLanguageOffer } from '../../i18n/language.ts';
import { useAppStore } from '../../state/store.ts';

// The language this visit started in (the saved one, on a visit that offers
// anything), read when the shell's code is evaluated at boot, before the
// learner could change it (the start screen has a language switch).
const bootLanguage = useAppStore.getState().language;

/**
 * The one-tap language offer (audit 2, P9) in the shell (AppShell, beside
 * the one toast region): when a returning visit's link asked for another
 * language (i18n/language.ts `bootLanguageOffer`), it loads the offer and its
 * words (languageOfferToast.ts, a lazy chunk) and lets it decide when to show.
 * Otherwise it does nothing and loads nothing.
 */
export function LanguageOffer() {
  useEffect(() => {
    const lang = bootLanguageOffer();
    if (!lang || lang === bootLanguage) return;
    let stop: (() => void) | undefined;
    let gone = false;
    import('./languageOfferToast.ts')
      .then((m) => {
        if (!gone) stop = m.offerLanguage(lang, bootLanguage);
      })
      .catch(() => {});
    return () => {
      gone = true;
      stop?.();
    };
  }, []);
  return null;
}
