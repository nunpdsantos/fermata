/**
 * The words of the browser's Back and Forward inside Fermatina (second
 * audit round, P3): what a learner is told when Back or Forward leaves work
 * in progress — a check, a review, a practice round, a Drill session, a
 * Sprint — and the lesson's way back into a kept check. They load with
 * `state/appHistory.ts` (a lazy chunk, fetched once the first screen is up),
 * never with the entry bundle (the `backNav` namespace; the pattern of
 * `i18n/moved`).
 */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const BACK_NAV_TEXT = { en, pt, es } as const;

for (const [lang, backNav] of Object.entries(BACK_NAV_TEXT)) {
  i18n.addResourceBundle(lang, 'translation', { backNav }, true, false);
}
