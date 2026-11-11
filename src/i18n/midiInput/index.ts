/**
 * The MIDI keyboard's words (wave 3, stream K) load with its code, not with
 * the entry bundle (the `midiInput` namespace; the glossary's pattern,
 * `i18n/glossary`). Only the dock bar's mark, which shows before this code
 * loads, is in the locale files (`midiInputEntry`).
 */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const MIDI_INPUT_TEXT = { en, pt, es } as const;

for (const [lang, midiInput] of Object.entries(MIDI_INPUT_TEXT)) {
  i18n.addResourceBundle(lang, 'translation', { midiInput }, true, false);
}
