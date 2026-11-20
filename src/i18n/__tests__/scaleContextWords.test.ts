/**
 * The scale chips' notes (`scaleSuggestionContext.ts`) name the same degrees
 * and intervals in English, Portuguese and Spanish (review of the second
 * round, 19 November 2026: a Portuguese note could say «5.ª perfeita» where
 * the English said "major 3rd", and no test noticed). For every ordinal the
 * English names — "major 3rd", "natural 11", "the 9th", "Raised 4th",
 * "4th mode" — the PT and ES notes carry its word from the table below; the
 * symbols (b9, #11, 1-3-5) are the same in all three.
 */
import { describe, expect, it } from 'vitest';
import { SCALE_CONTEXT_ES, SCALE_CONTEXT_PT } from '../scaleSuggestionContext';

const QUALITY: Record<string, { pt: string; es: string }> = {
  major: { pt: 'maior', es: 'mayor' },
  minor: { pt: 'menor', es: 'menor' },
  perfect: { pt: 'perfeita', es: 'justa' },
  natural: { pt: 'natural', es: 'natural' },
};

/** What the English names, and how PT and ES must name it (as patterns). */
function namedIn(en: string): { en: string; pt: RegExp; es: RegExp }[] {
  const out: { en: string; pt: RegExp; es: RegExp }[] = [];
  const re = /\b(?:(major|minor|perfect|natural|raised|dominant)\s+)?(\d+)(?:st|nd|rd|th)(?:\s+(degree|mode))?\b/gi;
  for (const m of en.matchAll(re)) {
    const [whole, before, n, after] = m;
    const q = before?.toLowerCase();
    if (q === 'dominant') {
      // "a dominant 7th" (the chord): «sétima da dominante» / «séptima de dominante».
      out.push({ en: whole, pt: /sétima da dominante/, es: /séptima de dominante/ });
    } else if (after || q === 'raised') {
      // A degree or a mode: «4.º grau», «4.º modo» / «4.º grado», «3.er modo».
      const noun = (after ?? 'degree').toLowerCase();
      out.push({
        en: whole,
        pt: new RegExp(`${n}\\.º ${noun === 'mode' ? 'modo' : 'grau'}`),
        es: new RegExp(`${n}\\.(?:º|er) ${noun === 'mode' ? 'modo' : 'grado'}`),
      });
    } else if (q && QUALITY[q]) {
      out.push({ en: whole, pt: new RegExp(`${n}\\.ª ${QUALITY[q].pt}`), es: new RegExp(`${n}\\.ª ${QUALITY[q].es}`) });
    } else {
      out.push({ en: whole, pt: new RegExp(`${n}\\.ª`), es: new RegExp(`${n}\\.ª`) });
    }
  }
  // "natural 11" / "natural 9" written without an ordinal ending.
  for (const m of en.matchAll(/\bnatural (\d+)\b(?!st|nd|rd|th)/gi)) {
    // («6.ª e 7.ª naturais», «la 6.ª y la 2.ª naturales»: one adjective for two.)
    out.push({
      en: m[0],
      pt: new RegExp(`${m[1]}\\.ª(?: e (?:a )?\\d+\\.ª)? natura(?:l|is)`),
      es: new RegExp(`${m[1]}\\.ª(?: y (?:la )?\\d+\\.ª)? natura(?:l|les)`),
    });
  }
  return out;
}
const symbols = (s: string) => (s.match(/(?<![\w.])[b#]\d+|\d(?:-[b#]?\d+)+/g) ?? []).sort();

describe('the scale chips\' notes name the same degrees and intervals in EN, PT and ES', () => {
  const entries = Object.entries(SCALE_CONTEXT_PT);
  it('reads the whole table', () => {
    expect(entries.length).toBeGreaterThan(80);
    expect(entries.filter(([en]) => namedIn(en).length > 0).length).toBeGreaterThan(25);
  });
  it.each(entries)('%s', (en, pt) => {
    const es = SCALE_CONTEXT_ES[en];
    for (const word of namedIn(en)) {
      expect(pt, `PT names "${word.en}"`).toMatch(word.pt);
      expect(es, `ES names "${word.en}"`).toMatch(word.es);
    }
    expect(symbols(pt), 'PT symbols').toEqual(symbols(en));
    expect(symbols(es), 'ES symbols').toEqual(symbols(en));
  });
});
