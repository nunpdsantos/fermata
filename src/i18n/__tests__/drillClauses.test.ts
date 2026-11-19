/**
 * The Drill's clause and interval tables against the bank (audit A12).
 *
 * The bank names three explanation clauses by key (core/utils/drillBank/
 * clauses.ts); their text lives in the Drill's own bundle (i18n/drillTerms),
 * in English as well as Portuguese and Spanish. This pins the contract both
 * ways, as drillKeysParity.test.ts does for the prompt / why templates:
 *  - every clause parameter in the bank carries a registered token (never
 *    text), and every registered token is used by some item;
 *  - every token has its text in EN, PT and ES, read from each language's own
 *    resources (never through the English fallback), and the bundles hold no
 *    clause the registry does not list;
 *  - every interval name the interval items show parses to a key, and each of
 *    those keys has a PT and an ES name and article form — no more, no fewer;
 *  - (fix pass after the review of 2d07ebe) the PT and ES tables equal their
 *    recording word for word (fixtures/drill-terms-pt-es.json; RECORD_DRILL_TERMS=1
 *    re-records, for a deliberate edit only), and say what the English says:
 *    each ladder step names the same chord tones, the same size of step and the
 *    same chord symbols; each stack is the English one in the house order; each
 *    function clause keeps its V, tonic, home / rest / tension / resolve; each
 *    interval name is its number and quality in the lessons' words.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import i18n from '../index';
import '../drillTerms';
import { DRILL_TERMS } from '../drillTerms';
import { DRILL_CLAUSES, clauseKey, clauseTokens, generateDrillBank } from '../../core/utils/drillBank';
import { intervalCode } from '../../components/drill/drillText';

const BANK = generateDrillBank({ includeRead: true });
const LANGS = ['en', 'pt', 'es'] as const;

function raw(lng: string, key: string): unknown {
  return i18n.getResource(lng, 'translation', key);
}

const registered = Object.entries(DRILL_CLAUSES).flatMap(([whyKey, params]) =>
  Object.entries(params).flatMap(([param, tokens]) => (tokens as readonly string[]).map((token) => `${whyKey}|${param}|${token}`)),
);

describe('clauses: the bank and the registry, both ways', () => {
  it('every clause parameter of every item carries a registered token', () => {
    const bad: string[] = [];
    for (const item of BANK) {
      for (const [param, value] of Object.entries(item.whyParams)) {
        const tokens = clauseTokens(item.whyKey, param);
        if (tokens && !(typeof value === 'string' && tokens.includes(value))) bad.push(`${item.id}: ${param}=${String(value)}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('every registered token is used, and every clause template carries its clause parameter on every item', () => {
    const used = new Set<string>();
    for (const item of BANK) {
      const params = (DRILL_CLAUSES as Record<string, Record<string, readonly string[]>>)[item.whyKey];
      if (!params) continue;
      for (const param of Object.keys(params)) {
        expect(item.whyParams, `${item.id} lacks ${param}`).toHaveProperty(param);
        used.add(`${item.whyKey}|${param}|${String(item.whyParams[param])}`);
      }
    }
    expect([...used].sort()).toEqual([...registered].sort());
    expect(registered.length).toBe(3 + 5 + 4);
  });

  it('the three clause templates are the ones the bank uses (functionPull 30, seventhLadder 140, triadStack 112 items)', () => {
    const count = (key: string) => BANK.filter((i) => i.whyKey === key).length;
    expect(count('drill.why.functionPull')).toBe(30);
    expect(count('drill.why.seventhLadder')).toBe(140);
    expect(count('drill.why.triadStack')).toBe(112);
  });
});

describe('clauses: the text of every token, in all three languages', () => {
  for (const lng of LANGS) {
    it(`${lng.toUpperCase()}: every token resolves in its own resources`, () => {
      for (const id of registered) {
        const [whyKey, param, token] = id.split('|');
        const text = raw(lng, clauseKey(whyKey, param, token));
        expect(typeof text, `${lng} ${id}`).toBe('string');
        expect((text as string).trim().length, `${lng} ${id}`).toBeGreaterThan(0);
      }
    });

    it(`${lng.toUpperCase()}: the bundle holds no clause the registry does not list`, () => {
      const clauses = DRILL_TERMS[lng].clauses as Record<string, Record<string, Record<string, string>>>;
      const inBundle = Object.entries(clauses).flatMap(([tmpl, params]) =>
        Object.entries(params).flatMap(([param, tokens]) => Object.keys(tokens).map((token) => `drill.why.${tmpl}|${param}|${token}`)),
      );
      expect(inBundle.sort()).toEqual([...registered].sort());
    });
  }

  it('the English clauses are the texts 6de6c0e put in whyParams, character for character', () => {
    const en = i18n.getFixedT('en');
    expect(en(clauseKey('drill.why.functionPull', 'direction', 'tonic'))).toBe('home — creates rest');
    // "towards" since the British spelling pass (19 November 2026); every other character as 6de6c0e.
    expect(en(clauseKey('drill.why.functionPull', 'direction', 'subdominant'))).toBe('away from tonic — builds tension towards V');
    expect(en(clauseKey('drill.why.functionPull', 'direction', 'dominant'))).toBe('towards tonic — creates strong pull to resolve');
    expect(en(clauseKey('drill.why.seventhLadder', 'step', 'major7'))).toBe('the reference stack (M3+m3+M3)');
    expect(en(clauseKey('drill.why.seventhLadder', 'step', 'dominant7'))).toBe('maj7 with the 7th lowered a half step');
    expect(en(clauseKey('drill.why.seventhLadder', 'step', 'minor7'))).toBe('dominant 7 with the 3rd also lowered');
    expect(en(clauseKey('drill.why.seventhLadder', 'step', 'half_diminished7'))).toBe('m7 with the 5th also lowered');
    expect(en(clauseKey('drill.why.seventhLadder', 'step', 'diminished7'))).toBe('ø7 with the 7th lowered again (double-flat 7)');
    expect(en(clauseKey('drill.why.triadStack', 'stack', 'major'))).toBe('M3 + m3');
  });
});

describe('interval names: every name the interval items show has a PT and an ES name', () => {
  const names = new Set<string>();
  for (const item of BANK.filter((i) => i.family === 'interval')) {
    if (item.input.format === 'choice') for (const c of item.input.choices) names.add(c);
    for (const v of [...Object.values(item.promptParams), ...Object.values(item.whyParams)]) {
      if (typeof v === 'string') names.add(v);
    }
  }
  const intervalNames = [...names].filter((n) => /\b(unison|2nd|3rd|4th|5th|6th|7th|tritone|octave)\b/i.test(n) && !/letters/.test(n));
  const codes = new Set(intervalNames.map((n) => intervalCode(n)));

  it('every interval name parses to a key (18 intervals: 8 from the note-above prompts too)', () => {
    expect(intervalNames.filter((n) => intervalCode(n) === null)).toEqual([]);
    expect(codes.size).toBe(18);
  });

  for (const lng of ['pt', 'es'] as const) {
    it(`${lng.toUpperCase()}: a name and an article form for each key, no more, no fewer`, () => {
      const table = DRILL_TERMS[lng] as { interval: Record<string, string>; intervalWithArticle: Record<string, string> };
      expect(Object.keys(table.interval).sort()).toEqual([...codes].sort());
      expect(Object.keys(table.intervalWithArticle).sort()).toEqual([...codes].sort());
      for (const code of codes) {
        const name = table.interval[code!];
        const withArticle = table.intervalWithArticle[code!];
        // The article form is the name in lower case after "um / uma" ("un / una").
        expect(withArticle, `${lng} ${code}`).toMatch(lng === 'pt' ? /^(um|uma) / : /^(un|una) /);
        expect(withArticle.replace(/^\S+ /, ''), `${lng} ${code}`).toBe(name.charAt(0).toLowerCase() + name.slice(1));
      }
    });
  }

  it('English has no interval table: its names are the bank\'s own (graded) strings', () => {
    expect(Object.keys(DRILL_TERMS.en)).toEqual(['clauses']);
  });
});

// ─── The PT / ES wording is pinned, and checked against its meaning ────────────

const TERMS_FIXTURE = resolve(process.cwd(), 'src/i18n/__tests__/fixtures/drill-terms-pt-es.json');
if (process.env.RECORD_DRILL_TERMS) {
  writeFileSync(TERMS_FIXTURE, `${JSON.stringify({ pt: DRILL_TERMS.pt, es: DRILL_TERMS.es }, null, 1)}\n`);
}

describe('the PT and ES tables equal their recording, word for word', () => {
  it('every clause, interval name and article form', () => {
    const recorded = JSON.parse(readFileSync(TERMS_FIXTURE, 'utf8')) as Record<'pt' | 'es', unknown>;
    expect(DRILL_TERMS.pt).toEqual(recorded.pt);
    expect(DRILL_TERMS.es).toEqual(recorded.es);
  });
});

type Clauses = Record<string, Record<string, Record<string, string>>>;
const clauseText = (lng: 'en' | 'pt' | 'es', tmpl: string, param: string, token: string) =>
  (DRILL_TERMS[lng].clauses as Clauses)[tmpl][param][token];
const count = (s: string, re: RegExp) => [...s.matchAll(re)].length;
const SYMBOLS = /(?<![\p{L}\p{N}])(?:maj7|m7|ø7)(?![\p{L}\p{N}])/gu;
const symbols = (s: string) => [...s.matchAll(SYMBOLS)].map((m) => m[0]).sort();
/** Chord tones named: "the 3rd" / "a 3.ª" → 3. */
const tonesEn = (s: string) => [...new Set([...s.matchAll(/(\d)(?:st|nd|rd|th)\b/g)].map((m) => m[1]))].sort();
const tonesPtEs = (s: string) => [...new Set([...s.matchAll(/(\d)\.ª/g)].map((m) => m[1]))].sort();
/** A stack of thirds, in the house order: EN "M3+m3" → ['3M', '3m']; PT / ES "3M+3m" → the same; ES "5J" = "5P". */
const stackEn = (s: string) =>
  [...s.replace(SYMBOLS, '').matchAll(/(?<![\p{L}\p{N}])([MmPAd])(\d)(?![\p{L}\p{N}])/gu)].map((m) => `${m[2]}${m[1]}`);
const stackPtEs = (s: string) =>
  [...s.matchAll(/(?<![\p{L}\p{N}.])(\d)([MmPJAd])(?![\p{L}\p{N}])/gu)].map((m) => `${m[1]}${m[2].replace('J', 'P')}`);

/** What each language calls the same thing. */
const WORDS: Record<string, { en: RegExp; pt: RegExp; es: RegExp }> = {
  halfStep: { en: /half step/g, pt: /meio-tom/g, es: /semitono/g },
  wholeStep: { en: /whole step/g, pt: /(?<![\p{L}-])tom(?![\p{L}-])/gu, es: /(?<!\p{L})tono(?!\p{L})/gu },
  lowered: { en: /lowered/g, pt: /baixad[ao]/g, es: /rebajad[ao]/g },
  raised: { en: /raised/g, pt: /elevad[ao]/g, es: /elevad[ao]/g },
  also: { en: /\balso\b/g, pt: /também/g, es: /también/g },
  again: { en: /\bagain\b/g, pt: /outra vez/g, es: /otra vez/g },
  dominantSeventh: { en: /dominant 7\b/g, pt: /sétima da dominante/g, es: /séptima de dominante/g },
  doubleFlatSeventh: { en: /double-flat 7/g, pt: /7\.ª diminuta/g, es: /7\.ª disminuida/g },
  referenceStack: { en: /reference stack/g, pt: /empilhamento de referência/g, es: /apilamiento de referencia/g },
  five: { en: /(?<!\p{L})V(?!\p{L})/gu, pt: /(?<!\p{L})V(?!\p{L})/gu, es: /(?<!\p{L})V(?!\p{L})/gu },
  tonic: { en: /tonic/g, pt: /tónica/g, es: /tónica/g },
  home: { en: /home/g, pt: /casa/g, es: /casa/g },
  rest: { en: /\brest\b/g, pt: /repouso/g, es: /reposo/g },
  tension: { en: /tension/g, pt: /tensão/g, es: /tensión/g },
  resolve: { en: /resolve/g, pt: /resolver/g, es: /resolver/g },
};

/** Where a PT / ES clause and its English disagree, in words. */
export function clauseMismatches(en: string, lng: 'pt' | 'es', text: string): string[] {
  const out: string[] = [];
  if (JSON.stringify(tonesEn(en)) !== JSON.stringify(tonesPtEs(text))) out.push(`tones ${tonesEn(en)} ≠ ${tonesPtEs(text)}`);
  if (JSON.stringify(stackEn(en)) !== JSON.stringify(stackPtEs(text))) out.push(`stack ${stackEn(en)} ≠ ${stackPtEs(text)}`);
  if (JSON.stringify(symbols(en)) !== JSON.stringify(symbols(text))) out.push(`symbols ${symbols(en)} ≠ ${symbols(text)}`);
  for (const [name, w] of Object.entries(WORDS)) {
    if (count(en, w.en) !== count(text, w[lng])) out.push(`${name} ${count(en, w.en)} ≠ ${count(text, w[lng])}`);
  }
  return out;
}

describe('each PT / ES clause says what its English says', () => {
  it('the check catches a changed step, tone, stack or symbol (planted)', () => {
    const en = clauseText('en', 'seventhLadder', 'step', 'dominant7');
    expect(clauseMismatches(en, 'es', 'el maj7 con la 7.ª rebajada un tono')).toEqual(['halfStep 1 ≠ 0', 'wholeStep 0 ≠ 1']);
    expect(clauseMismatches(clauseText('en', 'seventhLadder', 'step', 'minor7'), 'pt', 'a sétima da dominante com a 5.ª também baixada')).toEqual([
      'tones 3 ≠ 5',
    ]);
    expect(clauseMismatches('M3 + m3', 'pt', '3m + 3M')).toEqual(['stack 3M,3m ≠ 3m,3M']);
    expect(clauseMismatches(en, 'pt', 'o m7 com a 7.ª baixada meio-tom')).toEqual(['symbols maj7 ≠ m7']);
  });

  for (const lng of ['pt', 'es'] as const) {
    it(`${lng.toUpperCase()}: every clause of every template`, () => {
      const bad: string[] = [];
      for (const id of registered) {
        const [whyKey, param, token] = id.split('|');
        const tmpl = whyKey.replace(/^drill\.why\./, '');
        const en = clauseText('en', tmpl, param, token);
        const text = clauseText(lng, tmpl, param, token);
        for (const m of clauseMismatches(en, lng, text)) bad.push(`${id}: ${m} ("${en}" / "${text}")`);
      }
      expect(bad).toEqual([]);
    });
  }
});

describe('each PT / ES interval name is its number and quality in the lessons\' words', () => {
  const QUALITY = {
    pt: { P: 'perfeita', M: 'maior', m: 'menor', A: 'aumentada', d: 'diminuta' },
    es: { P: 'justa', M: 'mayor', m: 'menor', A: 'aumentada', d: 'disminuida' },
  } as const;
  const SPECIAL = {
    pt: { P1: 'Uníssono', P8: 'Oitava', TT: 'Trítono' },
    es: { P1: 'Unísono', P8: 'Octava', TT: 'Tritono' },
  } as const;
  for (const lng of ['pt', 'es'] as const) {
    it(`${lng.toUpperCase()}`, () => {
      const table = DRILL_TERMS[lng].interval as Record<string, string>;
      for (const [code, name] of Object.entries(table)) {
        const special = (SPECIAL[lng] as Record<string, string>)[code];
        const q = code[0] as keyof (typeof QUALITY)['pt'];
        expect(name, `${lng} ${code}`).toBe(special ?? `${code.slice(1)}.ª ${QUALITY[lng][q]}`);
      }
    });
  }
});
