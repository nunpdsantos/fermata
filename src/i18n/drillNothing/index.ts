/**
 * The Drill's lines for "nothing to ask" (audit 2, P6, 19 November 2026):
 * every topic switched off, or no new facts per session and no fact met yet
 * (components/drill/DrillIntro.tsx). They load with the Drill's code, not
 * with the entry bundle: DrillIntro imports this file. Same pattern as
 * `i18n/learnWords`.
 */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const DRILL_NOTHING = { en, pt, es } as const;

for (const [lang, drillNothing] of Object.entries(DRILL_NOTHING)) {
  i18n.addResourceBundle(lang, 'translation', { drillNothing }, true, false);
}
