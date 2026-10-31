/**
 * W6-10 / D-19 — one term per concept in each language.
 *
 * - Chord root = "fundamental" (never "tónica", which is the key's tonic).
 * - Portuguese semitone = "meio-tom" / "meios-tons" (not "semitom").
 * - Cadence names (D-19 as amended 2026-10-31, see decisions-taken.md):
 *     PT: perfeita (CAP), imperfeita (CAI), meia cadência, plagal, interrompida
 *         ("cadência suspensiva" appears once, as the alternative name, in the
 *         L3 cadence lesson)
 *     ES: auténtica perfecta (CAP), auténtica imperfecta (CAI), semicadencia,
 *         plagal, rota ("interrumpida" appears once, as the alternative name)
 *
 * The rules cover the Drill's locale strings too (drill.terms.cadence.*).
 */
import { describe, it, expect } from 'vitest';
import { overlayStrings } from './overlayStrings';
import pt from '../../locales/pt.json';
import es from '../../locales/es.json';

const strings = overlayStrings();

/** The one place each language names the alternative term. */
const ALTERNATIVE_MENTION: Record<'pt' | 'es', RegExp> = {
  pt: /\(também chamada cadência suspensiva\)/,
  es: /también llamada interrumpida/,
};

const FORBIDDEN: Record<'pt' | 'es', Array<[RegExp, string]>> = {
  pt: [
    [/\bsemitom\b|\bsemitons\b/i, 'use "meio-tom" / "meios-tons"'],
    [/\bmeios? tons?\b/i, 'hyphenate "meio-tom"'],
    [/\bdeceptiv/i, 'deceptive cadence = "cadência interrompida"'],
    [/\benganos[ao]s?\b|cadência de engano/i, 'deceptive cadence = "cadência interrompida"'],
    [/\bcadências? suspensivas?\b|\bSuspensiva\b/, 'half cadence = "meia cadência" (suspensiva only as the one alternative mention)'],
    [/\bmeias?-cadências?\b/i, 'write "meia cadência" without a hyphen'],
    [/\bautênticas? (?:im)?perfeitas?\b/i, 'PAC/IAC = "cadência perfeita" / "cadência imperfeita"'],
  ],
  es: [
    [/\bcadencias? interrumpidas?\b|\bInterrumpida[:(]|\bInterrumpida \(/i, 'deceptive cadence = "cadencia rota" (interrumpida only as the one alternative mention)'],
    [/\bengañosa/i, 'deceptive cadence = "cadencia rota"'],
    [/\bcadencias? perfectas?\b/i, 'PAC = "cadencia auténtica perfecta"'],
    [/\bmedia cadencia\b/i, 'half cadence = "semicadencia"'],
  ],
};

describe('PT/ES terminology is consistent (D-19)', () => {
  for (const lang of ['pt', 'es'] as const) {
    it(`${lang}: no competing terms`, () => {
      const hits: string[] = [];
      for (const s of strings.filter((x) => x.lang === lang)) {
        const text = s.text.replace(ALTERNATIVE_MENTION[lang], '');
        for (const [re, why] of FORBIDDEN[lang]) {
          if (re.test(text)) hits.push(`${s.file} ${s.path}: ${why} | ${s.text.slice(0, 100)}`);
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

  it('the alternative cadence name is mentioned exactly once per language (the L3 lesson)', () => {
    for (const lang of ['pt', 'es'] as const) {
      const where = strings.filter((s) => s.lang === lang && ALTERNATIVE_MENTION[lang].test(s.text)).map((s) => `${s.file} ${s.path}`);
      expect(where, lang).toEqual([`${lang}/curriculumL3 modules.l3u11m1.concepts[1].explanation`]);
    }
    expect(pt.drill.terms.cadence.half).toBe('Meia cadência');
    expect(es.drill.terms.cadence.deceptive).toBe('Cadencia rota');
  });

  it('the detector fires on the old wording (planted)', () => {
    const planted: Array<['pt' | 'es', string]> = [
      ['pt', 'Uma cadência suspensiva termina em V'],
      ['pt', 'Uma meia-cadência termina em V'],
      ['pt', 'Cadência deceptiva'],
      ['pt', 'De C a G são 7 semitons'],
      ['pt', 'Uma Cadência Autêntica Perfeita (CAP)'],
      ['es', 'Una cadencia interrumpida sustituye vi'],
      ['es', 'Una cadencia engañosa'],
      ['es', 'esta es una cadencia perfecta (V7-I)'],
    ];
    for (const [lang, text] of planted) {
      expect(FORBIDDEN[lang].some(([re]) => re.test(text)), text).toBe(true);
    }
  });
});
