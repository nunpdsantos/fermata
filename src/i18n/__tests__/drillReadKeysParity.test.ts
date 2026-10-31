import { describe, it, expect } from 'vitest';
import i18n from '../index';
import { READ_PROMPT_KEYS, READ_WHY_KEYS, genRead } from '../../core/utils/drillBank';

/**
 * Trilingual parity for the guitar reading family (audit W10-02), which has
 * its own key registries because it is not in the default bank yet (see
 * ReadDrillItem in core/types/drill.ts). Same rules as drillKeysParity.test.ts:
 * every key resolves in EN, PT and ES with no fallback, and PT/ES use exactly
 * EN's {{tokens}}.
 */

const KEYS = [...READ_PROMPT_KEYS, ...READ_WHY_KEYS, 'drill.families.read'];
const LANGS = ['en', 'pt', 'es'] as const;
const TOKEN_RE = /\{\{[a-zA-Z]+\}\}/g;

const raw = (lng: string, key: string) => {
  const v = i18n.getResource(lng, 'translation', key);
  return typeof v === 'string' ? v : '';
};
const tokens = (s: string) => [...new Set(Array.from(s.matchAll(TOKEN_RE), (m) => m[0]))].sort();

describe('drill i18n — reading family', () => {
  for (const lng of LANGS) {
    it(`every reading key resolves in ${lng.toUpperCase()} (no fallback)`, () => {
      for (const key of KEYS) {
        expect(i18n.exists(key, { lng }), `${lng} ${key}`).toBe(true);
        expect(raw(lng, key).length, `${lng} ${key}`).toBeGreaterThan(0);
      }
    });
  }

  it('PT and ES use the same {{tokens}} as EN', () => {
    for (const key of KEYS) {
      for (const lng of ['pt', 'es'] as const) expect(tokens(raw(lng, key)), `${lng} ${key}`).toEqual(tokens(raw('en', key)));
    }
  });

  it('renders cleanly in every language with real item params', () => {
    const items = genRead();
    const sample = [items.find((i) => i.input.position === 5)!, items.find((i) => i.input.position === 0)!, items.find((i) => i.input.position === null)!];
    for (const lng of LANGS) {
      const t = i18n.getFixedT(lng);
      for (const item of sample) {
        const prompt = t(item.promptKey, item.promptParams);
        const why = t(item.whyKey, item.whyParams);
        expect(prompt, `${lng} ${item.id}`).not.toMatch(/\{\{|\}\}/);
        expect(why, `${lng} ${item.id}`).not.toMatch(/\{\{|\}\}/);
        expect(why).toContain(String(item.whyParams.written));
      }
    }
    expect(i18n.getFixedT('pt')('drill.prompts.readInPosition', { position: 'V' })).toBe('Onde está esta nota na posição V?');
    expect(i18n.getFixedT('es')('drill.prompts.readInPosition', { position: 'V' })).toBe('¿Dónde está esta nota en la posición V?');
  });
});
