/**
 * The metronome's words (wave 3, stream M) load with the metronome's lazy
 * chunk, not with the entry bundle (common rules, wave 3): the `metronomeTool`
 * namespace. Only the menu item and the "did not load" line, which must show
 * before the chunk arrives, are in the locale files (`metronomeToolEntry`).
 * Same pattern as the glossary's explanations (`i18n/glossary`).
 */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const METRONOME_TEXT = { en, pt, es } as const;

for (const [lang, metronomeTool] of Object.entries(METRONOME_TEXT)) {
  i18n.addResourceBundle(lang, 'translation', { metronomeTool }, true, false);
}
