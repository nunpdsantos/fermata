/**
 * Does a text give a question's answer away? (W4b, decision D-09; review B1.)
 *
 * What a learner sees after a FIRST wrong try — the nudge, or the lesson
 * section it points back to — must not hand over the answer: with a ½-point
 * second try still to come, that would recreate audit W4-04 (re-enter the
 * revealed answer for half a point). The check uses this at run time on the
 * title of the section it points to; the nudge corpus test uses it on every
 * nudge, in every language.
 *
 * Three checks:
 *  - exact: the text contains the keyed answer (normalised: case, punctuation
 *    and spacing ignored; answers of one or two characters — "E", "0", "Do" —
 *    are matched as a whole token, case kept, so the Portuguese "e" / "do"
 *    are not mistaken for them; a note letter also as a pitch, "G" in "G4"),
 *    or another spelling of it: an interval name's abbreviation ("m3", "P5",
 *    "P8", PT/ES "3m", "5J"), its Portuguese / Spanish name ("3.ª menor",
 *    "5.ª justa", "oitava"), an ordinal in any spelling ("5.ª");
 *  - near: the answer has two or more DISTINCTIVE content words (four letters
 *    or more, not function words, not in the question, not in any other
 *    option) and the text contains every one of them;
 *  - echo (the independent W4b review's definition): 70 % or more of the
 *    answer's content words are in the text, and more of them than of any
 *    other option's — the text discriminates the right option.
 */
export type LeakLang = 'en' | 'pt' | 'es';

export interface LeakItem {
  id?: string;
  /** The language of the text (Portuguese / Spanish interval names). Default English. */
  lang?: LeakLang;
  prompt: string;
  /** The text shown before the answer (a nudge, a section title). */
  hint: string;
  answer: string;
  others: string[];
}

const STOP = new Set([
  // en
  'the', 'and', 'with', 'that', 'this', 'from', 'into', 'than', 'only', 'each', 'they', 'their', 'have', 'which', 'when',
  'what', 'note', 'notes', 'beat', 'beats', 'also', 'both', 'more', 'most', 'other', 'others', 'same', 'like', 'over', 'under',
  'then', 'such', 'these', 'those', 'were', 'been', 'being', 'does', 'where', 'whom', 'four', 'three',
  // pt
  'para', 'pela', 'pelo', 'pelas', 'pelos', 'como', 'mais', 'cada', 'entre', 'umas', 'uns', 'dos', 'das', 'nas', 'nos', 'com',
  'sem', 'que', 'nota', 'notas', 'tempo', 'tempos', 'ambos', 'ambas', 'mesmo', 'mesma', 'outra', 'outro', 'outras', 'outros',
  'esta', 'este', 'essa', 'esse', 'isto', 'qual', 'quais', 'quando', 'onde', 'sobre', 'também', 'todos', 'todas',
  // es
  'una', 'unos', 'unas', 'los', 'las', 'del', 'con', 'sin', 'por', 'más', 'tiempo', 'tiempos', 'otra', 'otro', 'otras', 'otros',
  'mismo', 'misma', 'ambos', 'ambas', 'esto', 'cual', 'cuál', 'cuáles', 'cuando', 'donde', 'también', 'todos', 'todas',
]);

export const norm = (s: string) =>
  s.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}#♯♭ ]/gu, ' ').replace(/\s+/g, ' ').trim();
const tokens = (s: string) => s.normalize('NFC').split(/[^\p{L}\p{N}#♯♭]+/u).filter(Boolean);
export const leakWords = (s: string) => new Set(norm(s).split(' ').filter((w) => w.length >= 4 && !STOP.has(w)));

const QUALITY_ABBR: Record<string, string> = { minor: 'm', major: 'M', perfect: 'P', augmented: 'A', diminished: 'd' };
const QUALITY_PT: Record<string, string> = { minor: 'menor', major: 'maior', perfect: 'perfeita', augmented: 'aumentada', diminished: 'diminuta' };
const QUALITY_ES: Record<string, string> = { minor: 'menor', major: 'mayor', perfect: 'justa', augmented: 'aumentada', diminished: 'disminuida' };

/**
 * Other ways a text can write the same answer: an interval name's
 * abbreviation ("Minor 3rd" → "m3", "Octave" → "P8"; PT/ES write the number
 * first, "3m", "5J") and, in Portuguese and Spanish, its name the way those
 * lessons write it ("3.ª menor", "oitava"); an ordinal answer ("5.ª") in any
 * of its spellings.
 */
export function answerForms(answer: string, lang: LeakLang = 'en'): { phrases: string[]; patterns: RegExp[] } {
  const phrases = [answer];
  const patterns: RegExp[] = [];
  const iv = /^(minor|major|perfect|augmented|diminished) (\d+)(?:st|nd|rd|th)$/i.exec(answer.trim());
  if (iv) {
    const q = iv[1].toLowerCase();
    const n = iv[2];
    patterns.push(new RegExp(`(?<![\\p{L}\\p{N}])${QUALITY_ABBR[q]}${n}(?![\\p{L}\\p{N}])`, 'u'));
    const latin = lang === 'es' ? { ...QUALITY_ABBR, perfect: 'J' } : QUALITY_ABBR;
    if (lang !== 'en') patterns.push(new RegExp(`(?<![\\p{L}\\p{N}])${n}${latin[q]}(?![\\p{L}\\p{N}])`, 'u'));
    if (lang === 'pt') phrases.push(`${n}.ª ${QUALITY_PT[q]}`, `${n}ª ${QUALITY_PT[q]}`);
    if (lang === 'es') phrases.push(`${n}.ª ${QUALITY_ES[q]}`, `${n}ª ${QUALITY_ES[q]}`);
  }
  if (/^octave$/i.test(answer.trim())) {
    patterns.push(/(?<![\p{L}\p{N}])P8(?![\p{L}\p{N}])/u);
    if (lang === 'pt') phrases.push('oitava');
    if (lang === 'es') phrases.push('octava');
  }
  if (/^tritone$/i.test(answer.trim())) {
    if (lang === 'pt') phrases.push('trítono');
    if (lang === 'es') phrases.push('tritono');
  }
  const ord = /^(\d+)\.?[ªº]$/.exec(answer.trim());
  if (ord) patterns.push(new RegExp(`(?<![\\p{L}\\p{N}])${ord[1]}\\.?[ªº](?![\\p{L}\\p{N}])`, 'u'));
  return { phrases, patterns };
}

/** One phrase: case-insensitive whole words, or — one or two characters — a whole token with its case
 *  (a note letter also as a pitch: "G" in "G4"). */
function phraseIn(text: string, phrase: string): boolean {
  const a = norm(phrase);
  if (!a) return false;
  if (a.replace(/ /g, '').length <= 2) {
    const want = phrase.trim();
    const isNote = /^[A-G](#|b)?$/.test(want);
    return tokens(text).some((t) => t === want || (isNote && t.replace(/-?\d+$/, '') === want));
  }
  return ` ${norm(text)} `.includes(` ${a} `);
}

export function exactLeak(text: string, answer: string, lang: LeakLang = 'en'): boolean {
  const { phrases, patterns } = answerForms(answer, lang);
  return phrases.some((ph) => phraseIn(text, ph)) || patterns.some((re) => re.test(text));
}

/** The answer's distinctive content words — in no other option and not in the question. */
export function distinctiveWords(item: Pick<LeakItem, 'prompt' | 'answer' | 'others'>): string[] {
  const inPrompt = leakWords(item.prompt);
  const inOthers = item.others.map(leakWords);
  return [...leakWords(item.answer)].filter((w) => !inPrompt.has(w) && !inOthers.some((o) => o.has(w)));
}

export function nearLeak(item: LeakItem): boolean {
  const distinct = distinctiveWords(item);
  if (distinct.length < 2) return false;
  const words = leakWords(item.hint);
  return distinct.every((w) => words.has(w));
}

/** Share of a label's content words found in the text (0 when it has none). */
function overlap(label: string, words: Set<string>): number {
  const own = leakWords(label);
  if (own.size === 0) return 0;
  let n = 0;
  for (const w of own) if (words.has(w)) n++;
  return n / own.size;
}

/**
 * The review's "echo" (W4b review, its hint scan): the text holds the answer
 * verbatim (four characters or more), or ≥ 70 % of its content words and more
 * of them than of any other option's.
 */
export function echoLeak(item: LeakItem): boolean {
  const a = norm(item.answer);
  // Verbatim from the start of a word ("major chords" holds "Major chord").
  if (a.replace(/ /g, '').length >= 4 && ` ${norm(item.hint)}`.includes(` ${a}`)) return true;
  const words = leakWords(item.hint);
  const ov = overlap(item.answer, words);
  if (ov < 0.7) return false;
  return item.others.every((o) => overlap(o, words) < ov);
}

export function answerLeak(item: LeakItem): 'exact' | 'near' | 'echo' | null {
  if (!item.hint) return null;
  if (exactLeak(item.hint, item.answer, item.lang)) return 'exact';
  if (nearLeak(item)) return 'near';
  if (echoLeak(item)) return 'echo';
  return null;
}
