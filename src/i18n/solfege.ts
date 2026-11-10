/**
 * Fixed-do names beside the letters (wave 1, stream E): "D (Ré)".
 *
 * House style stays letters (D-18): note names in PT / ES content and chord
 * symbols everywhere are letters. This only ADDS the fixed-do name, for a
 * Portuguese or Spanish speaker who learned the notes as Dó, Ré, Mi, in the
 * roomy places where one note or one key is named — when the learner asks for
 * it (Settings → Language, `showSolfege`).
 *
 * It takes the SPELLED note (the spelling engine's letter and accidental),
 * never a pitch number: E♭ is Mi♭ and D♯ is Ré♯, though they sound the same.
 * Accidentals come from the app's glyph helper (♯ ♭ 𝄪 𝄫).
 */
import type { Note, NaturalNote } from '../core/types/music.ts';
import { withGlyphs } from '../core/utils/accidentalGlyphs.ts';

const SYLLABLES: Record<'pt' | 'es', Record<NaturalNote, string>> = {
  pt: { C: 'Dó', D: 'Ré', E: 'Mi', F: 'Fá', G: 'Sol', A: 'Lá', B: 'Si' },
  es: { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' },
};

/** The languages that offer the setting. */
export function solfegeLanguage(lang: string | undefined): 'pt' | 'es' | null {
  const base = (lang ?? '').slice(0, 2);
  return base === 'pt' || base === 'es' ? base : null;
}

/**
 * The fixed-do name of a spelled note in a language — "Ré", "Fá♯", "Si♭",
 * "Dó𝄪", "Mi𝄫" (PT); "Re", "Fa♯", "Si♭" (ES) — or null in a language without
 * one (English) or for something that is not a note.
 */
export function solfegeName(note: Note, lang: string | undefined): string | null {
  const l = solfegeLanguage(lang);
  const syllable = l ? SYLLABLES[l][note?.natural] : undefined;
  if (!syllable) return null;
  // withGlyphs("F#") = "F♯": the letter, then the accidental glyph(s).
  return syllable + withGlyphs(note).slice(1);
}

/** "D (Ré)" — letter first — or the letter alone when there is no fixed-do name to add. */
export function withSolfege(note: Note, solfege: string | null): string {
  return solfege ? `${withGlyphs(note)} (${solfege})` : withGlyphs(note);
}
