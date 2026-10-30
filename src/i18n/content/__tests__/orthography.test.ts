/**
 * W6-11 — Portuguese/Spanish orthography and register.
 *
 * - One ordinal style in both languages: 1.º / 3.ª (plurals 3.as, ES 1.er),
 *   never the typewriter 3.a / 5.o or the dotless 7ª.
 * - PT: em dash, not " -- "; "carácter"; tu-form throughout the interface.
 * - ES: every question and exclamation opens with ¿ / ¡; the diminished sign
 *   is ° (not the ordinal º).
 * Each rule is proven on a planted string first.
 */
import { describe, it, expect } from 'vitest';
import { overlayStrings } from './overlayStrings';

/** Questions/exclamations whose sentence has no opening ¿ / ¡. */
export function missingOpeningMarks(text: string): string[] {
  const out: string[] = [];
  const t = text.replace(/p\. ej\./g, 'p_ej_').replace(/\bej\./g, 'ej_');
  for (const m of t.matchAll(/[?!]/g)) {
    const opener = m[0] === '?' ? '¿' : '¡';
    const before = t.slice(0, m.index);
    const cut = Math.max(before.lastIndexOf('. '), before.lastIndexOf('? '), before.lastIndexOf('! '), before.lastIndexOf(': '), before.lastIndexOf('\n'));
    const sentence = before.slice(cut + 1);
    if (!sentence.includes(opener)) out.push(`${sentence.trim().slice(-50)}${m[0]}`);
  }
  return out;
}

const RULES: Record<'pt' | 'es', Array<[string, (t: string) => boolean]>> = {
  pt: [
    ['typewriter ordinal (3.a / 5.o): use 3.ª / 5.º', (t) => /(?<![\w.])\d+\.[ao](?![\wÀ-ÿ])/.test(t)],
    ['dotless ordinal (7ª): use 7.ª', (t) => /(?<![\w.])\d+[ªº](?![\wÀ-ÿ])/.test(t)],
    ['" -- " dash: use —', (t) => t.includes(' -- ')],
    ['"caráter": PT-PT is "carácter" / "caracteres"', (t) => /\bcaráter(?:es)?\b/i.test(t)],
    ['você-form imperative: use tu (Clica, Escolhe, Toca…)', (t) => /(?:^|[.!?:]\s+)(?:Clique|Escolha|Selecione|Toque|Digite|Pressione|Arraste|Experimente)\b|\bPassou!/.test(t)],
  ],
  es: [
    ['typewriter ordinal (3.a / 5.o): use 3.ª / 5.º', (t) => /(?<![\w.])\d+\.[ao](?![\wÀ-ÿ])/.test(t)],
    ['dotless ordinal (7ª): use 7.ª', (t) => /(?<![\w.])\d+[ªº](?![\wÀ-ÿ])/.test(t)],
    ['ordinal º used as the diminished sign: use °', (t) => /(?:[iv]|[IV]|[A-G][#b]?)º/.test(t)],
    ['question/exclamation without the opening ¿ / ¡', (t) => missingOpeningMarks(t).length > 0],
  ],
};

describe('rules fire on planted strings', () => {
  it.each([
    ['pt', 'uma 3.a maior e uma 5.o grau'],
    ['pt', 'Menor com 6ª maior'],
    ['pt', 'resolve -- para o I'],
    ['pt', 'o seu caráter rítmico'],
    ['pt', 'Clique nas teclas para tocar'],
    ['pt', 'Passou!'],
    ['es', 'la 3.a mayor'],
    ['es', 'el viiº resuelve'],
    ['es', 'V4/3 resuelve típicamente a qué acorde?'],
    ['es', 'Pruébalo ahora!'],
  ] as const)('%s "%s" is flagged', (lang, text) => {
    expect(RULES[lang].some(([, test]) => test(text))).toBe(true);
  });

  it.each([
    ['pt', 'uma 3.ª maior, o 5.º grau, as 3.as e 6.as'],
    ['pt', 'Clica nas teclas — Passaste!'],
    ['es', '¿Qué material utiliza — sujeto, contrasujeto, o ambos? ¿Modula?'],
    ['es', 'Pulsa una tecla. ¡Pruébalo ahora!'],
    ['es', 'el vii° (p. ej., vii°/V)'],
    ['es', 'del 1.er grado al 5.º'],
  ] as const)('%s "%s" passes', (lang, text) => {
    expect(RULES[lang].filter(([, test]) => test(text)).map(([why]) => why)).toEqual([]);
  });
});

describe('PT/ES overlays and locale strings follow the house style', () => {
  const strings = overlayStrings();
  for (const lang of ['pt', 'es'] as const) {
    it(`${lang}: no orthography or register violations`, () => {
      const bad: string[] = [];
      for (const s of strings.filter((x) => x.lang === lang)) {
        for (const [why, test] of RULES[lang]) {
          if (test(s.text)) bad.push(`${s.file} ${s.path}: ${why} | ${s.text.slice(0, 90)}`);
        }
      }
      expect(bad, bad.join('\n')).toEqual([]);
    });
  }
});
