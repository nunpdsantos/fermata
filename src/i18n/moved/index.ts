/**
 * The words of "we've moved" (2026-11-14: Fermata became Fermatina, at
 * fermatina.com): the panel the old address's toast opens and Settings' line
 * there. They load with that code, not with the entry bundle (the `moved`
 * namespace; the pattern of `i18n/midiInput`). Only the toast's own line and
 * its button, which show before this loads, are in the locale files
 * (`movedEntry`); the start screen's "I have a progress file" is `start.progressFile`.
 */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const MOVED_TEXT = { en, pt, es } as const;

for (const [lang, moved] of Object.entries(MOVED_TEXT)) {
  i18n.addResourceBundle(lang, 'translation', { moved }, true, false);
}
