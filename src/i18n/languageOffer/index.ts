/**
 * The one-tap language offer's words (audit 2, P9, 19 November 2026), each
 * in its OWN language — the offer speaks the link's language, whatever the
 * app's is: "Switch to English?" · "Mudar para português?" · "¿Cambiar a
 * español?". They load with the offer (components/layout/languageOfferToast.ts),
 * a moment after the shell, never with the entry bundle.
 */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const LANGUAGE_OFFER = { en, pt, es } as const;

for (const [lang, languageOffer] of Object.entries(LANGUAGE_OFFER)) {
  i18n.addResourceBundle(lang, 'translation', { languageOffer }, true, false);
}
