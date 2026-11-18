/**
 * The `learnWords` namespace (audit fixes, 18 November 2026, stream E): the
 * level card's optional-unit line and the check's staff descriptions. Lazy —
 * it loads with Learn's code, never with the entry bundle — and the same in
 * all three languages: the same keys, the same placeholders.
 */
import { describe, it, expect } from 'vitest';
import en from '../learnWords/en.json';
import pt from '../learnWords/pt.json';
import es from '../learnWords/es.json';
import enLocale from '../locales/en.json';
import ptLocale from '../locales/pt.json';
import esLocale from '../locales/es.json';

type Tree = { [k: string]: string | Tree };
const flat = (t: Tree, p = ''): [string, string][] =>
  Object.entries(t).flatMap(([k, v]) => (typeof v === 'string' ? [[`${p}${k}`, v] as [string, string]] : flat(v, `${p}${k}.`)));
const holes = (s: string) => [...s.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort();

describe('learnWords', () => {
  it('EN, PT and ES have the same keys and the same placeholders in each', () => {
    const [e, p, s] = [flat(en), flat(pt), flat(es)];
    expect(p.map(([k]) => k)).toEqual(e.map(([k]) => k));
    expect(s.map(([k]) => k)).toEqual(e.map(([k]) => k));
    for (const [k, v] of e) {
      expect(holes(Object.fromEntries(p)[k]), `pt ${k}`).toEqual(holes(v));
      expect(holes(Object.fromEntries(s)[k]), `es ${k}`).toEqual(holes(v));
    }
  });

  it('is not in the entry locales (it loads with Learn\'s chunk)', () => {
    for (const loc of [enLocale, ptLocale, esLocale]) expect(loc).not.toHaveProperty('learnWords');
  });

  it('says no note letter of its own: letters come only through {{letter}} (a key signature\'s lines)', () => {
    for (const lang of [en, pt, es]) for (const [k, v] of flat(lang)) expect(v.replace(/\{\{\w+\}\}/g, ''), k).not.toMatch(/(?<![\p{L}])[A-G](?![\p{L}])/u);
  });
});
