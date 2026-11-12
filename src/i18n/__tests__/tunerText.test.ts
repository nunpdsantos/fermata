/**
 * The tuner's text (brief T) and the microphone switch's (brief U): the same
 * keys and placeholders in EN, PT and ES, in their own lazy files (not the
 * entry's locale files, which carry only `tunerEntry` and the switch's own
 * words, `micSwitchEntry`); every sentence that asks for the microphone says
 * what it is for and that the sound never leaves the device, in the same
 * sentence; the old controls' words are gone.
 */
import { describe, expect, it } from 'vitest';
import en from '../tuner/en.json';
import pt from '../tuner/pt.json';
import es from '../tuner/es.json';
import aen from '../tuner/mic.en.json';
import apt from '../tuner/mic.pt.json';
import aes from '../tuner/mic.es.json';
import localeEn from '../locales/en.json';
import localePt from '../locales/pt.json';
import localeEs from '../locales/es.json';

type Tree = { [k: string]: string | Tree };
const flat = (o: Tree, prefix = ''): Record<string, string> =>
  Object.entries(o).reduce<Record<string, string>>((acc, [k, v]) => (typeof v === 'string' ? { ...acc, [prefix + k]: v } : { ...acc, ...flat(v, `${prefix}${k}.`) }), {});
const placeholders = (s: string) => [...s.matchAll(/\{\{(\w+)\}\}|<\/?term>/g)].map((m) => m[0]).sort();
// PT and ES plurals: i18next uses _one / _other in all three.

describe('tuner text', () => {
  for (const [name, set] of [['tuner', { en, pt, es }], ['tuner.mic', { en: aen, pt: apt, es: aes }]] as const) {
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

  it('the entry files carry only tunerEntry (menu item, dock button, load error) and micSwitchEntry (the switch\'s name, On, Off)', () => {
    for (const locale of [localeEn, localePt, localeEs] as Tree[]) {
      expect(Object.keys(locale.tunerEntry as Tree).sort()).toEqual(['dockButton', 'loadError', 'menuItem']);
      expect(Object.keys(locale.micSwitchEntry as Tree).sort()).toEqual(['label', 'off', 'on']);
      expect(locale.tuner).toBeUndefined();
    }
    expect([localeEn, localePt, localeEs].map((l) => (l as Tree).micSwitchEntry)).toEqual([
      { label: 'Microphone', on: 'On', off: 'Off' },
      { label: 'Microfone', on: 'Ligado', off: 'Desligado' },
      { label: 'Micrófono', on: 'Activado', off: 'Desactivado' },
    ]);
  });

  it('the three old controls and their words are gone (one switch now): no "Start / Stop listening", "Show what I play", "Use my instrument", "Listening" mark, "Try again"', () => {
    const all = JSON.stringify([en, pt, es, aen, apt, aes, localeEn, localePt, localeEs]);
    for (const dead of ['Start listening', 'Stop listening', 'Show what I play', 'Use my instrument', 'Usar o meu instrumento', 'Usar mi instrumento', 'Começar a ouvir', 'Parar de ouvir', 'Empezar a escuchar', 'Dejar de escuchar', 'Mostrar no instrumento', 'Mostrar en el instrumento', 'Allow the microphone']) {
      expect(all.includes(dead), dead).toBe(false);
    }
    for (const set of [en, pt, es] as Tree[]) {
      expect(Object.keys(set).filter((k) => ['start', 'stop', 'listening', 'tryAgain', 'showOnInstrument'].includes(k))).toEqual([]);
    }
  });

  it('the line saying what the switch does in a check, and the three-minute line, word for word', () => {
    expect([aen.here, apt.here, aes.here]).toEqual([
      'With the microphone on, the notes you play are added to your answer.',
      'Com o microfone ligado, as notas que tocas são acrescentadas à tua resposta.',
      'Con el micrófono activado, las notas que tocas se añaden a tu respuesta.',
    ]);
    expect(aen.idle).toBe('The microphone turned itself off: no note was heard for three minutes.');
    expect([aen.allow, apt.allow, aes.allow]).toEqual(['Turn on the microphone', 'Ligar o microfone', 'Activar el micrófono']);
  });
});
