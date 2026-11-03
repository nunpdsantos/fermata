/** Cardinal-first PT/ES interval notation, including body text and search titles. */
import { describe, expect, it } from 'vitest';
import { overlayStrings, type OverlayString } from './overlayStrings';
import { intervalCollisions } from './intervalCollisions';
import { sourceHash } from './overlayEntries';
import ptTitles from '../../../data/moduleTitles.pt';
import esTitles from '../../../data/moduleTitles.es';

// Unicode boundaries avoid matching chord suffixes (Cm7, m7b5, Cmaj7), IDs,
// or the legal plural ordinals 3.as / 1.os. Hybrids may have no space (3.aM).
const CANDIDATE = /(?<![\p{L}\d])(?:P[1458]|[mM][2367]|[dA][1-8]|\d+\.[ªaºo]\s*(?:dism|dim|aum|[mMPJ]))(?![\p{L}\d])/gu;
const candidates = (text: string) => [...text.matchAll(CANDIDATE)].map((m) => m[0]);
const digest = sourceHash;
const keyOf = (s: OverlayString) => `${s.file} ${s.path}`;

/** Ambiguous A* / m7 tokens require an exact, reviewed text, never a whole-file waiver. */
function violations(s: OverlayString): string[] {
  const tokens = candidates(s.text);
  const approved = intervalCollisions[keyOf(s)];
  if (approved && digest(s.text) === approved[0]) {
    return tokens.filter((t) => !/^A[1-8]$|^m7$/.test(t));
  }
  return tokens;
}

const strings = [
  ...overlayStrings({ includeLocale: false }),
  ...(['pt', 'es'] as const).flatMap((lang) =>
    Object.entries(lang === 'pt' ? ptTitles : esTitles).flatMap(([id, values]) =>
      values.map((text, i): OverlayString => ({ lang, file: `moduleTitles.${lang}`, path: `${id}[${i}]`, text })),
    ),
  ),
];

describe('PT/ES interval short forms', () => {
  it.each([
    'P1', 'P4', 'P5', 'P8', 'm2', 'M2', 'm3', 'M3', 'm6', 'M6', 'm7', 'M7',
    'd5', 'A4', 'A3', '6.ª m', '7.ª M', '5.ª J', '5.ªP', '3.aM', '5.adim', '5.ªdism', '5.ªaum',
    'Intervalos P1–P5', 'Intervalos m6–P8', '4P=5, A4=6, 5P=7',
    'Uma d5 e uma A4 são enarmónicas.', 'Una A4 tiene seis semitonos.',
    'O acorde m7 contém um intervalo m7.', 'Toca A4 e identifica a M3.',
  ])('flags planted English or hybrid form: %s', (text) => {
    expect(violations({ lang: 'pt', file: 'planted', path: 'hint', text }).length).toBeGreaterThan(0);
  });

  it.each([
    '1P–5P; 6m–8P; 4P=5; 8P=12', '1J–5J; 6m–8J; 4J=5; 8J=12',
    '2m, 2M, 3m, 3M, 6m, 6M, 7m, 7M',
    'uma 5.ª diminuta e uma 4.ª aumentada', 'una 5.ª disminuida y una 4.ª aumentada',
    '3.as, 6.as, 1.os, 2.os; 1.er, 3.er', 'Cm7, Am7, m7b5, Cmaj7, l9u30m3',
  ])('accepts cardinal-first forms, words, plurals and chord suffixes: %s', (text) => {
    expect(candidates(text)).toEqual([]);
  });

  it('preserves every reviewed pitch/chord collision and rejects edits to its text', () => {
    const byKey = new Map(strings.map((s) => [keyOf(s), s]));
    for (const [key, [hash, tokens]] of Object.entries(intervalCollisions)) {
      const s = byKey.get(key);
      expect(s, `stale collision exception: ${key}`).toBeDefined();
      if (!s) continue;
      expect(digest(s.text), `re-review changed collision: ${key}`).toBe(hash);
      expect(candidates(s.text)).toEqual(tokens);
      expect(violations(s)).toEqual([]);
      // Even a second ambiguous token in a previously approved pitch/chord
      // sentence must fail; interval keywords elsewhere never exempt it.
      for (const bad of ['A4', 'm7', 'P5', '6.ª m']) {
        expect(violations({ ...s, text: `${s.text} Intervalo ${bad}.` })).toContain(bad);
      }
    }
  });

  for (const lang of ['pt', 'es'] as const) {
    it(`${lang}: all overlays and generated module titles use local interval forms`, () => {
      const bad = strings.filter((s) => s.lang === lang).flatMap((s) => {
        const found = violations(s);
        return found.length ? [`${keyOf(s)}: ${found.join(', ')} | ${s.text}`] : [];
      });
      expect(bad, bad.join('\n')).toEqual([]);
    });
  }
});
