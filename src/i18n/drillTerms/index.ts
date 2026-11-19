/**
 * The Drill's own terms (audit A12, 2026-11-18): the explanation clauses the
 * bank names by key (core/utils/drillBank/clauses.ts), in all three
 * languages, and the Portuguese and Spanish names of the intervals the Drill
 * asks about (as the lessons write them: "3.ª maior" / "3.ª mayor", "5.ª
 * perfeita" / "5.ª justa"; with an article where a sentence needs one).
 * English interval names are the bank's own strings (they are what is
 * graded), so English needs no interval table.
 *
 * Loaded with the Drill view, not the entry: every module that renders a
 * Drill item imports this file (DrillView, SprintRunner, DrillInput —
 * checked by drillTermsLoad.test.ts). drillText.ts itself does not: other
 * views import it for toContentLanguage, and these strings must not load
 * with them. Merged in as the `drillTerms` namespace; same pattern as the
 * glossary's explanations (`i18n/glossary`).
 */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const DRILL_TERMS = { en, pt, es } as const;

for (const [lang, drillTerms] of Object.entries(DRILL_TERMS)) {
  i18n.addResourceBundle(lang, 'translation', { drillTerms }, true, false);
}
