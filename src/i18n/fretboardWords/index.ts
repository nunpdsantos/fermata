/**
 * The Explore fretboard's own words (music audit 2, 2026-11-19, builder K):
 * what a cell of the chosen grip says to a screen reader (M48), the open
 * string the arrow keys now reach (M47), the shape that leaves out a tone the
 * chord's name carries (M44), and the notes a scale position cannot reach in
 * a tuning with strings a 5th apart (M46). They load with the Fretboard's
 * chunk (Fretboard.tsx imports this file), not with the entry: the entry's
 * budget. Same pattern as `exploreTools`.
 */
import i18n from '../index';
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const FRETBOARD_WORDS = { en, pt, es } as const;

for (const [lang, fretboardWords] of Object.entries(FRETBOARD_WORDS)) {
  i18n.addResourceBundle(lang, 'translation', { fretboardWords }, true, true);
}
