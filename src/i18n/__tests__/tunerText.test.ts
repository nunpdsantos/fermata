/**
 * The tuner's text (brief T): the same keys and placeholders in EN, PT and
 * ES, in its own lazy files (not the entry's locale files, which carry only
 * `tunerEntry`); every sentence that asks for the microphone says what it is
 * for and that the sound never leaves the device, in the same sentence.
 */
import { describe, expect, it } from 'vitest';
import en from '../tuner/en.json';
import pt from '../tuner/pt.json';
import es from '../tuner/es.json';
import aen from '../tuner/answer.en.json';
import apt from '../tuner/answer.pt.json';
import aes from '../tuner/answer.es.json';
import localeEn from '../locales/en.json';
import localePt from '../locales/pt.json';
import localeEs from '../locales/es.json';

type Tree = { [k: string]: string | Tree };
const flat = (o: Tree, prefix = ''): Record<string, string> =>
  Object.entries(o).reduce<Record<string, string>>((acc, [k, v]) => (typeof v === 'string' ? { ...acc, [prefix + k]: v } : { ...acc, ...flat(v, `${prefix}${k}.`) }), {});
const placeholders = (s: string) => [...s.matchAll(/\{\{(\w+)\}\}|<\/?term>/g)].map((m) => m[0]).sort();
// PT and ES plurals: i18next uses _one / _other in all three.

describe('tuner text', () => {
  for (const [name, set] of [['tuner', { en, pt, es }], ['tuner.answer', { en: aen, pt: apt, es: aes }]] as const) {
    it(`${name}: same keys and placeholders in EN, PT and ES, none empty`, () => {
      const base = flat(set.en as Tree);
      for (const lang of ['pt', 'es'] as const) {
        const other = flat(set[lang] as Tree);
        expect(Object.keys(other).sort()).toEqual(Object.keys(base).sort());
        for (const [k, v] of Object.entries(base)) {
          expect(placeholders(other[k]), `${lang} ${k}`).toEqual(placeholders(v));
          expect(other[k].trim().length).toBeGreaterThan(0);
        }
      }
    });
  }

  it('the asking sentences name the purpose and the promise in the same sentence', () => {
    const promise = { en: /the sound never leaves this device\.$/, pt: /o som nunca sai deste dispositivo\.$/, es: /el sonido nunca sale de este dispositivo\.$/ };
    for (const [lang, panel, answer] of [['en', en, aen], ['pt', pt, apt], ['es', es, aes]] as const) {
      for (const s of [panel.why, answer.why]) {
        expect(s, `${lang}: ${s}`).toMatch(promise[lang]);
        expect(s.split(/(?<=[.!?])\s/).length, `${lang}: one sentence`).toBe(1);
        expect(s).toMatch(/microphone|microfone|micrófono/);
      }
    }
  });

  it('the entry files carry only tunerEntry (menu item, dock button, load error)', () => {
    for (const locale of [localeEn, localePt, localeEs] as Tree[]) {
      expect(Object.keys(locale.tunerEntry as Tree).sort()).toEqual(['dockButton', 'loadError', 'menuItem']);
      expect(locale.tuner).toBeUndefined();
    }
  });
});
