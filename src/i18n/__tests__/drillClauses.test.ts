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
 *    those keys has a PT and an ES name and article form — no more, no fewer.
 */
import { describe, expect, it } from 'vitest';
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
    expect(en(clauseKey('drill.why.functionPull', 'direction', 'subdominant'))).toBe('away from tonic — builds tension toward V');
    expect(en(clauseKey('drill.why.functionPull', 'direction', 'dominant'))).toBe('toward tonic — creates strong pull to resolve');
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
