/**
 * W6-10 / D-19 — one term per concept in each language.
 *
 * - Chord root = "fundamental" (never "tónica", which is the key's tonic).
 * - Portuguese semitone = "meio-tom" / "meios-tons" (not "semitom").
 * - Cadence names come from each language's own L3 lesson:
 *     PT: perfeita (CAP), imperfeita (CAI), suspensiva, plagal, interrompida
 *     ES: auténtica perfecta (CAP), auténtica imperfecta (CAI), semicadencia,
 *         plagal, interrumpida
 *
 * Drill strings (drill.*) are excluded: the Drill's wording is owned by the
 * Drill work (W6-07).
 */
import { describe, it, expect } from 'vitest';
import { overlayStrings } from './overlayStrings';
import pt from '../../locales/pt.json';
import es from '../../locales/es.json';

const strings = overlayStrings().filter((s) => !(s.file.endsWith('.json') && s.path.startsWith('drill.')));

const FORBIDDEN: Record<'pt' | 'es', Array<[RegExp, string]>> = {
  pt: [
    [/\bsemitom\b|\bsemitons\b/i, 'use "meio-tom" / "meios-tons"'],
    [/\bmeios? tons?\b/i, 'hyphenate "meio-tom"'],
    [/\bdeceptiv/i, 'deceptive cadence = "cadência interrompida"'],
    [/\benganos[ao]s?\b|cadência de engano/i, 'deceptive cadence = "cadência interrompida"'],
    [/\bmeias?[- ]cadências?\b/i, 'half cadence = "cadência suspensiva"'],
    [/\bautênticas? (?:im)?perfeitas?\b/i, 'PAC/IAC = "cadência perfeita" / "cadência imperfeita"'],
  ],
  es: [
    [/\bcadencias? rotas?\b|\bRota[:(]|\bRota \(/i, 'deceptive cadence = "cadencia interrumpida"'],
    [/\bengañosa/i, 'deceptive cadence = "cadencia interrumpida"'],
    [/\bcadencias? perfectas?\b/i, 'PAC = "cadencia auténtica perfecta"'],
    [/\bmedia cadencia\b/i, 'half cadence = "semicadencia"'],
  ],
};

describe('PT/ES terminology is consistent (D-19)', () => {
  for (const lang of ['pt', 'es'] as const) {
    it(`${lang}: no competing terms`, () => {
      const hits: string[] = [];
      for (const s of strings.filter((x) => x.lang === lang)) {
        for (const [re, why] of FORBIDDEN[lang]) {
          // JSON keys are not text; only values are checked.
          if (re.test(s.text)) hits.push(`${s.file} ${s.path}: ${why} | ${s.text.slice(0, 100)}`);
        }
      }
      expect(hits, hits.join('\n')).toEqual([]);
    });
  }

  it('the Chord Builder calls the chord root "fundamental", not "tónica"', () => {
    for (const loc of [pt, es]) {
      expect(loc.chordBuilder.chordRoot).toMatch(/^Fundamental/);
      expect(loc.chordBuilder.syncRootTitle).toMatch(/fundamental/);
      expect(loc.chordBuilder.nonDiatonicAt).toMatch(/fundamental/);
      expect(loc.chordBuilder.nonDiatonicAt).not.toMatch(/tónica/);
    }
  });

  it('the detector fires on the old wording (planted)', () => {
    const planted: Array<['pt' | 'es', string]> = [
      ['pt', 'Uma meia cadência termina em V'],
      ['pt', 'Cadência deceptiva'],
      ['pt', 'De C a G são 7 semitons'],
      ['pt', 'Uma Cadência Autêntica Perfeita (CAP)'],
      ['es', 'Una cadencia rota sustituye vi'],
      ['es', 'Una cadencia engañosa'],
      ['es', 'esta es una cadencia perfecta (V7-I)'],
    ];
    for (const [lang, text] of planted) {
      expect(FORBIDDEN[lang].some(([re]) => re.test(text)), text).toBe(true);
    }
  });
});
