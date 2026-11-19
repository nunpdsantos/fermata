/**
 * Learn's own words that load with Learn's code, not with the entry bundle
 * (audit fixes, 18 November 2026, stream E — the common rules: text not
 * needed before a lazy chunk loads stays out of `src/i18n/locales/`): the
 * `learnWords` namespace. Imported by the modules that show them (the level
 * card, the check's staff description), so it arrives with them. Same
 * pattern as `i18n/metronomeTool`.
 */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const LEARN_WORDS = { en, pt, es } as const;

for (const [lang, learnWords] of Object.entries(LEARN_WORDS)) {
  i18n.addResourceBundle(lang, 'translation', { learnWords }, true, false);
}
