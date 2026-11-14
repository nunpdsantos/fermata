/**
 * The search pages' words. Wherever the app already has a sentence that
 * fits, the pages quote it from the app's own locale files (`appText` in
 * content.ts, by key). The few sentences the pages need and the app does not
 * have are here, in the three languages — every one of them listed for the
 * language review in the programme's notes (2026-11-14-search-pages/
 * new-strings.md). European Portuguese with "tu" and "a Fermatina"; Spain's
 * Spanish with "tú" and no article.
 */
import type { SiteLang } from './content';

export interface NewStrings {
  /** The button on every lesson page, at its top and its foot. */
  openLesson: string;
  /** The button on the landing page and the lesson index. */
  openApp: string;
  /** Beside a concept the app lets you hear and play (its Try This, rhythm or staff). */
  tryInApp: string;
  /** The heading over a lesson's tasks (the app says "On your piano" / "On your guitar"). */
  onInstrument: string;
  /** On the landing page, after the start screen's footer line. */
  languages: string;
  /** The landing page's heading over what the app holds. */
  inside: string;
  /** The landing page's line on the metronome ({{min}}, {{max}}, {{bars}} from the app's own limits). */
  metronome: string;
  /** The link to the lesson index ({{count}} lessons). */
  allLessons: string;
  /** The lesson index's meta description ({{count}} lessons). */
  indexDescription: string;
  /** The glossary's heading (h1, title) and its link text. */
  wordsTitle: string;
  /** The glossary's lead line and description ({{count}} words). */
  wordsLead: string;
}

export const NEW_STRINGS: Record<SiteLang, NewStrings> = {
  en: {
    openLesson: 'Open this lesson in Fermatina',
    openApp: 'Open Fermatina',
    tryInApp: 'In Fermatina you can hear this and play it on a piano or guitar.',
    onInstrument: 'On your instrument',
    languages: 'In English, Portuguese and Spanish.',
    inside: 'What is inside',
    metronome: 'Metronome: steady clicks from {{min}} to {{max}} beats a minute, with {{bars}} beats in a bar.',
    allLessons: 'All {{count}} lessons',
    indexDescription: '{{count}} lessons in nine levels, from reading music to jazz harmony and ear training, and two short ways in: by ear, or from the chords you play.',
    wordsTitle: 'Music words, in plain language',
    wordsLead: '{{count}} words of music, each explained in a sentence or two.',
  },
  pt: {
    openLesson: 'Abrir esta lição na Fermatina',
    openApp: 'Abrir a Fermatina',
    tryInApp: 'Na Fermatina podes ouvir isto e tocá-lo num piano ou numa guitarra.',
    onInstrument: 'No teu instrumento',
    languages: 'Em inglês, português e espanhol.',
    inside: 'O que há lá dentro',
    metronome: 'Metrónomo: cliques regulares de {{min}} a {{max}} batimentos por minuto, com {{bars}} tempos por compasso.',
    allLessons: 'Todas as {{count}} lições',
    indexDescription: '{{count}} lições em nove níveis, da leitura de música à harmonia de jazz e ao treino auditivo, e duas formas curtas de começar: de ouvido ou a partir dos acordes que tocas.',
    wordsTitle: 'Palavras da música, em linguagem simples',
    wordsLead: '{{count}} palavras da música, cada uma explicada numa ou duas frases.',
  },
  es: {
    openLesson: 'Abrir esta lección en Fermatina',
    openApp: 'Abrir Fermatina',
    tryInApp: 'En Fermatina puedes oírlo y tocarlo en un piano o una guitarra.',
    onInstrument: 'En tu instrumento',
    languages: 'En inglés, portugués y español.',
    inside: 'Qué hay dentro',
    metronome: 'Metrónomo: clics regulares de {{min}} a {{max}} pulsaciones por minuto, con {{bars}} tiempos por compás.',
    allLessons: 'Las {{count}} lecciones',
    indexDescription: '{{count}} lecciones en nueve niveles, de la lectura musical a la armonía de jazz y el entrenamiento auditivo, y dos formas cortas de empezar: de oído o desde los acordes que tocas.',
    wordsTitle: 'Palabras de la música, en lenguaje sencillo',
    wordsLead: '{{count}} palabras de la música, cada una explicada en una o dos frases.',
  },
};

/** The language names as Settings' language picker writes them (i18n/index.ts SUPPORTED_LANGUAGES; a test keeps them equal). */
export const LANGUAGE_NAMES: Record<SiteLang, string> = { en: 'English', pt: 'Português', es: 'Español' };

/** A new string with its `{{name}}` places filled. */
export function newText(lang: SiteLang, key: keyof NewStrings, vars: Record<string, string | number> = {}): string {
  return NEW_STRINGS[lang][key].replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    if (!(name in vars)) throw new Error(`site: new string "${key}" (${lang}) needs {{${name}}}`);
    return String(vars[name]);
  });
}
