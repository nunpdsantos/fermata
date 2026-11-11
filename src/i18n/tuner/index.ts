/**
 * The tuner's text (wave 3, brief T) loads with the tuner, not with the
 * entry bundle (common rules, wave 3: the entry is near its budget). Merged
 * in as the `tuner` namespace; only the menu item and the dock button, which
 * show before the tuner loads, live in the locale files (`tunerEntry`).
 * Same pattern as the glossary's explanations (`i18n/glossary`).
 */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const TUNER_TEXT = { en, pt, es } as const;

for (const [lang, tuner] of Object.entries(TUNER_TEXT)) {
  i18n.addResourceBundle(lang, 'translation', { tuner }, true, false);
}
