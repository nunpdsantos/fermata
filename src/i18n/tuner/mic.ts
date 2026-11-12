/**
 * The microphone switch's sentences (brief U), loaded with what shows them —
 * the check's input (Learn's chunk), the tuner, the top bar's note — not with
 * the entry bundle, as `tuner.mic`. Only the switch's own words (its name,
 * "On", "Off") are in the entry locales (`micSwitchEntry`). The tuner's own
 * text is `i18n/tuner/index.ts`.
 */
import i18n from '../index';
import en from './mic.en.json';
import pt from './mic.pt.json';
import es from './mic.es.json';

export const MIC_TEXT = { en, pt, es } as const;

for (const [lang, mic] of Object.entries(MIC_TEXT)) {
  i18n.addResourceBundle(lang, 'translation', { tuner: { mic } }, true, false);
}
