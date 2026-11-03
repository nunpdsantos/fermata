/** Practice copy loads with the guitar workbench, not the entry bundle. */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';
for (const [lang, practice] of Object.entries({ en, pt, es })) {
  i18n.addResourceBundle(lang, 'translation', { practice }, true, true);
}
