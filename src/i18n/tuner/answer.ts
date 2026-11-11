/**
 * The "Use my instrument" control's text (wave 3, brief T): loaded with the
 * instrument-answer input (Learn's chunk), not with the entry bundle, as
 * `tuner.answer`. The tuner's own text is `i18n/tuner/index.ts`.
 */
import i18n from '../index';
import en from './answer.en.json';
import pt from './answer.pt.json';
import es from './answer.es.json';

export const ANSWER_TEXT = { en, pt, es } as const;

for (const [lang, answer] of Object.entries(ANSWER_TEXT)) {
  i18n.addResourceBundle(lang, 'translation', { tuner: { answer } }, true, false);
}
