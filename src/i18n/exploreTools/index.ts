/**
 * Explore tools' words (audit 2026-11-18, stream C, and its fix pass): Build's
 * readout, the chords card's headings, the circle's wedge names, the
 * Progression panel's preset key and capo lines. They load with Explore's
 * chunks, not the entry bundle (the entry's budget), as `practice` does.
 */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';
for (const [lang, exploreTools] of Object.entries({ en, pt, es })) {
  i18n.addResourceBundle(lang, 'translation', { exploreTools }, true, true);
}
