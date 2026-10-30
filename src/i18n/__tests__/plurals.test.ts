import { describe, it, expect } from 'vitest';
import i18next from 'i18next';
import en from '../locales/en.json';
import pt from '../locales/pt.json';
import es from '../locales/es.json';
import { validateAnswer } from '../../components/learn/exercises/validateExercise';

/**
 * W6-04 — plural feedback through a REAL i18next instance.
 *
 * i18next v21+ (JSON v4) resolves plurals with Intl.PluralRules suffixes
 * (`_one`, `_other`, and `_many` / `_zero` … where the language has them).
 * The legacy `_plural` suffix is never read, so "missing 2 note" / "falta 2
 * nota" shipped while the tests passed through a hand-written fallback. These
 * tests build a fresh instance with the shipped resources and the same options
 * as src/i18n/index.ts — no fallback `t`.
 */

type Json = Record<string, unknown>;
function flatten(o: Json, p = ''): Record<string, string> {
  const r: Record<string, string> = {};
  for (const [k, v] of Object.entries(o)) {
    const key = p ? `${p}.${k}` : k;
    if (v && typeof v === 'object') Object.assign(r, flatten(v as Json, key));
    else r[key] = String(v);
  }
  return r;
}

const LOCALES = { en, pt, es } as const;
type Lang = keyof typeof LOCALES;

async function makeT(lng: Lang) {
  const inst = i18next.createInstance();
  await inst.init({
    resources: { en: { translation: en }, pt: { translation: pt }, es: { translation: es } },
    lng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
  return inst.t.bind(inst) as (key: string, opts?: Record<string, unknown>) => string;
}

describe('plural keys use the i18next v4 suffixes', () => {
  for (const lang of Object.keys(LOCALES) as Lang[]) {
    it(`${lang}: no legacy _plural keys remain`, () => {
      const legacy = Object.keys(flatten(LOCALES[lang] as Json)).filter((k) => k.endsWith('_plural'));
      expect(legacy).toEqual([]);
    });
  }

  it('every _one key has an _other sibling in all three locales (same plural bases everywhere)', () => {
    const bases = (lang: Lang) =>
      Object.keys(flatten(LOCALES[lang] as Json))
        .filter((k) => /_(one|other)$/.test(k))
        .map((k) => k.replace(/_(one|other)$/, ''))
        .sort();
    for (const lang of Object.keys(LOCALES) as Lang[]) {
      const keys = flatten(LOCALES[lang] as Json);
      for (const base of new Set(bases(lang))) {
        expect(keys[`${base}_one`], `${lang} ${base}_one`).toBeTruthy();
        expect(keys[`${base}_other`], `${lang} ${base}_other`).toBeTruthy();
      }
    }
    expect(bases('pt')).toEqual(bases('en'));
    expect(bases('es')).toEqual(bases('en'));
  });
});

describe('missing/extra-note feedback pluralises in EN/PT/ES', () => {
  const CASES: Record<Lang, Record<string, [string, string]>> = {
    en: {
      'exerciseFeedback.scaleMissing': ['missing 1 note', 'missing 2 notes'],
      'exerciseFeedback.scaleExtra': ['1 extra note', '2 extra notes'],
      'exerciseFeedback.chordMissing': ['missing 1 note', 'missing 2 notes'],
      'exerciseFeedback.chordExtra': ['1 extra note', '2 extra notes'],
      'exerciseFeedback.semitones': ['1 semitone', '2 semitones'],
      'learn.moduleCount': ['1 module', '2 modules'],
    },
    pt: {
      'exerciseFeedback.scaleMissing': ['falta 1 nota', 'faltam 2 notas'],
      'exerciseFeedback.scaleExtra': ['1 nota a mais', '2 notas a mais'],
      'exerciseFeedback.chordMissing': ['falta 1 nota', 'faltam 2 notas'],
      'exerciseFeedback.chordExtra': ['1 nota a mais', '2 notas a mais'],
      'exerciseFeedback.semitones': ['1 meio-tom', '2 meios-tons'],
      'learn.moduleCount': ['1 módulo', '2 módulos'],
    },
    es: {
      'exerciseFeedback.scaleMissing': ['falta 1 nota', 'faltan 2 notas'],
      'exerciseFeedback.scaleExtra': ['1 nota de más', '2 notas de más'],
      'exerciseFeedback.chordMissing': ['falta 1 nota', 'faltan 2 notas'],
      'exerciseFeedback.chordExtra': ['1 nota de más', '2 notas de más'],
      'exerciseFeedback.semitones': ['1 semitono', '2 semitonos'],
      'learn.moduleCount': ['1 módulo', '2 módulos'],
    },
  };

  for (const lang of Object.keys(CASES) as Lang[]) {
    for (const [key, [one, other]] of Object.entries(CASES[lang])) {
      it(`${lang} ${key}: count 1 → "${one}", count 2 → "${other}"`, async () => {
        const t = await makeT(lang);
        expect(t(key, { count: 1 })).toBe(one);
        expect(t(key, { count: 2 })).toBe(other);
        expect(t(key, { count: 5 })).toBe(other.replace('2', '5'));
      });
    }
  }

  it('validateExercise with a real PT t: two missing notes read "faltam 2 notas"', async () => {
    const t = await makeT('pt');
    // Cmaj7 = C E G B; the learner gives only C and E → 2 missing.
    const result = validateAnswer(
      { type: 'chord_build', root: 'C', rootAccidental: '', quality: 'major7', noteCount: 4 },
      new Set([0, 4]),
      t,
    );
    expect(result.correct).toBe(false);
    expect(result.explanation).toContain('faltam 2 notas');
    expect(result.explanation).not.toMatch(/falta 2 nota\b/);
  });

  it('validateExercise with a real EN t: three extra notes read "3 extra notes"', async () => {
    const t = await makeT('en');
    // C major = C E G; the learner adds D, F and A → 3 extra.
    const result = validateAnswer(
      { type: 'chord_build', root: 'C', rootAccidental: '', quality: 'major', noteCount: 3 },
      new Set([0, 4, 7, 2, 5, 9]),
      t,
    );
    expect(result.correct).toBe(false);
    expect(result.explanation).toContain('3 extra notes');
  });
});
