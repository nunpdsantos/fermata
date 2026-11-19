/**
 * The words of a lesson demonstration's text alternative (second audit,
 * M50–M56, stream L): the `lessonDemo` namespace, loaded with the lesson's
 * code (imported by `components/learn/lesson/demoDescription.ts`), never with
 * the entry bundle. The note values' singular names and "rest" / "tied" are
 * the rhythm staff's (`lesson.rhythm_*`, already in the entry locales). Same
 * pattern as `i18n/learnWords`.
 */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const LESSON_DEMO_WORDS = { en, pt, es } as const;

for (const [lang, lessonDemo] of Object.entries(LESSON_DEMO_WORDS)) {
  i18n.addResourceBundle(lang, 'translation', { lessonDemo }, true, false);
}
