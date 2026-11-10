/**
 * The glossary's explanations (wave 1, brief C) load with the glossary
 * panel, not with the entry bundle: ~100 entries in three languages would
 * take most of the entry's remaining budget (scripts/check-bundle.mjs). The
 * panel's own short labels (Words, Hear it, Learn more) stay in the locale
 * files under `glossary.ui`; these merge in beside them as `glossary.entries`.
 * Same pattern as the practice sheet's copy (`i18n/practice`).
 */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const GLOSSARY_TEXT = { en, pt, es } as const;

for (const [lang, glossary] of Object.entries(GLOSSARY_TEXT)) {
  i18n.addResourceBundle(lang, 'translation', { glossary }, true, false);
}
