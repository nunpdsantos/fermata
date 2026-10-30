/**
 * W6-06 / D-18 — Portuguese and Spanish text names notes with letters
 * (C, D, E…), matching the instruments, the answers and chord symbols.
 *
 * Solfège survives only where a sentence is ABOUT solfège syllables (movable
 * do, "the syllable Mi"), in clef names ("clave de sol", "Clave de Fá"), and
 * in a few proper names. Spanish "La"/"Si" at a sentence start are the
 * article/conjunction, not notes.
 *
 * The detector is proven on planted strings (the audit's own examples of
 * mixed sentences) before it runs on the real overlays.
 */
import { describe, it, expect } from 'vitest';
import { overlayStrings } from './overlayStrings';

const ACC = '(?:##|bb|#|b|♯|♭)?';
const SUFFIX = '(?:maj|min|dim|aug|sus|add|alt|m|M|o(?=\\d)|ø|°|º|\\+)?';
const END = '(?![A-Za-zÀ-ÿ])';

/** Strings whose subject is the solfège syllables themselves. */
const ABOUT_SOLFEGE = /solfej|solfeo|\bti\b|\bTi\b|[A-G]\((?:Do|Ti)\)|«Mi»|"Mi"/;
/** Proper names and labels that look like solfège. */
const NAMES = /La Monte|La Primavera|Where Do I|Dom\. Alt\.|Domin\./;
const CLEF = /[Cc]laves? de (?:Sol|Fá|Fa|Dó|Do)(?: e de \S+)?(?!\s+(?:maior|menor|mayor))/g;

/** Solfège note tokens a string still contains (empty = none). */
export function solfegeNotes(lang: 'pt' | 'es', text: string): string[] {
  if (ABOUT_SOLFEGE.test(text)) return [];
  const t = text.replace(NAMES, ' ').replace(CLEF, ' ');
  const found: string[] = [];
  if (lang === 'pt') {
    // Accented forms are unambiguous; Mi/Sol/Si are not PT words when capitalised.
    const re = new RegExp(`(?<![\\wÀ-ÿ])(?:Dó|Ré|Fá|Lá|Mi|Sol|Si)${ACC}${SUFFIX}${END}`, 'g');
    for (const m of t.matchAll(re)) found.push(m[0]);
  } else {
    const sure = new RegExp(`(?<![\\wÀ-ÿ])(?:Do|Re|Fa|Mi|Sol)${ACC}${SUFFIX}${END}`, 'g');
    for (const m of t.matchAll(sure)) found.push(m[0]);
    // La / Si: a note when an accidental, suffix or digit is attached, when
    // joined to another note, or mid-sentence before a key word.
    const laSi = new RegExp(
      `(?<![\\wÀ-ÿ])(?:La|Si)(?:(?:##|bb|#|b|♯|♭|m|dim|maj|º|°)[0-9]*${END}|[0-9]${END}|(?=[–\\-/]))|` +
        `(?<=[–\\-/])(?:La|Si)${END}|` +
        `(?<=[a-zà-ÿ,] )(?:La|Si)(?= (?:mayor|menor|natural)\\b)|` +
        `(?<![\\wÀ-ÿ])(?:La|Si)(?= (?:sostenido|bemol)\\b)`,
      'g',
    );
    for (const m of t.matchAll(laSi)) found.push(m[0]);
  }
  return found;
}

/**
 * Letter note names. A bare "A"/"E" counts only mid-sentence (after a word),
 * so the PT article "A" / conjunction "E" at a sentence start are not notes.
 */
export function letterNotes(text: string): string[] {
  const re = /(?<![\wÀ-ÿ])(?:[BCDFG]|[A-G](?:##|bb|#|b|♯|♭)|[A-G](?:##|bb|#|b|♯|♭)?(?:m|maj|dim|aug|sus|7|9|[0-8]))(?![\wÀ-ÿ])|(?<=[\wÀ-ÿ,] )[AE](?![\wÀ-ÿ])/g;
  return [...text.matchAll(re)].map((m) => m[0]);
}

describe('detector proven on planted strings (audit examples)', () => {
  it.each([
    ['pt', 'sobre D em Lá menor'],
    ['pt', '…de Lá menor harmónica… resolve para A'],
    ['pt', 'em torno de E em Dó maior'],
    ['pt', 'Sidim7 resolve para C'],
    ['pt', 'O C central e o Fá# acima'],
    ['es', 'en La menor resuelve a G'],
    ['es', 'Si bemol y F'],
    ['es', 'Do–Mi–Sol sobre C'],
  ] as const)('%s "%s" is flagged as mixed', (lang, text) => {
    expect(solfegeNotes(lang, text).length).toBeGreaterThan(0);
    expect(letterNotes(text).length).toBeGreaterThan(0);
  });

  it.each([
    ['es', 'La escala de C mayor'],
    ['es', 'Si tocas G7, la 7.ª resuelve'],
    ['es', 'La menor armónica eleva el 7.º grado'],
    ['pt', 'A clave de sol centra-se no G'],
    ['pt', 'Clave de Sol e Clave de Fá'],
    ['pt', 'No solfejo móvel, "Do" representa sempre a tónica. Em C maior, Do = C.'],
    ['es', 'El minimalismo de drone (La Monte Young) sostiene sonidos'],
  ] as const)('%s "%s" is not flagged', (lang, text) => {
    expect(solfegeNotes(lang, text)).toEqual([]);
  });
});

describe('PT/ES overlays name notes with letters (D-18)', () => {
  // l9u32m4e1 asks which movable-do SYLLABLE names the tonic; its answer
  // choices are the syllables themselves (Do, La, Sol, Re).
  const strings = overlayStrings().filter((s) => !s.path.startsWith('l9u32m4e1.choices'));

  it('reads a meaningful number of strings', () => {
    expect(strings.length).toBeGreaterThan(10_000);
  });

  it('no string mixes solfège and letter note names', () => {
    const mixed = strings
      .filter((s) => solfegeNotes(s.lang, s.text).length > 0 && letterNotes(s.text).length > 0)
      .map((s) => `${s.file} ${s.path}: ${solfegeNotes(s.lang, s.text).join(', ')} | ${s.text.slice(0, 120)}`);
    expect(mixed, mixed.join('\n')).toEqual([]);
  });

  it('no string uses solfège note names outside solfège-topic sentences, clef names and proper names', () => {
    const solfege = strings
      .filter((s) => solfegeNotes(s.lang, s.text).length > 0)
      .map((s) => `${s.file} ${s.path}: ${solfegeNotes(s.lang, s.text).join(', ')} | ${s.text.slice(0, 120)}`);
    expect(solfege, solfege.join('\n')).toEqual([]);
  });
});
