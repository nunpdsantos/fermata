/**
 * The `backNav` namespace (second audit round, P3): what a learner is told
 * when Back or Forward leaves work in progress, and the lesson's way back
 * into a kept check. Lazy (it loads with state/appHistory.ts, never with the
 * entry bundle) and the same in all three languages: the same keys, the same
 * placeholders, each sentence word for word. The names it uses are the app's
 * own: the check (Verificação / Comprobación), the review (Revisão / Repaso),
 * Drill (Treino / Práctica), the Sprint.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import en from '../backNav/en.json';
import pt from '../backNav/pt.json';
import es from '../backNav/es.json';
import enLocale from '../locales/en.json';
import ptLocale from '../locales/pt.json';
import esLocale from '../locales/es.json';
import i18n from '../index';
import '../backNav';

const holes = (s: string) => [...s.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort();

const PINNED: [key: keyof typeof en, en: string, pt: string, es: string][] = [
  ['continue', 'Continue', 'Continuar', 'Continuar'],
  ['checkKept', 'Your check is kept: question {{current}} of {{total}}.', 'A tua verificação ficou guardada: pergunta {{current}} de {{total}}.', 'Tu comprobación se ha guardado: pregunta {{current}} de {{total}}.'],
  ['practiceKept', 'Your practice round is kept: question {{current}} of {{total}}.', 'A tua ronda de prática ficou guardada: pergunta {{current}} de {{total}}.', 'Tu ronda de práctica se ha guardado: pregunta {{current}} de {{total}}.'],
  ['reviewKept', 'Your review is kept: question {{current}} of {{total}}.', 'A tua revisão ficou guardada: pergunta {{current}} de {{total}}.', 'Tu repaso se ha guardado: pregunta {{current}} de {{total}}.'],
  ['continueCheck', 'Continue the check', 'Continuar a verificação', 'Continuar la comprobación'],
  ['continuePractice', 'Continue the practice round', 'Continuar a prática', 'Continuar la práctica'],
  ['drillKept', 'Your Drill session is kept, on the question you were on.', 'A tua sessão de Treino ficou guardada, na pergunta em que estavas.', 'Tu sesión de Práctica se ha guardado, en la pregunta en la que estabas.'],
  ['sprintKept', 'Your Sprint is paused, with the time it had left.', 'O teu sprint está em pausa, com o tempo que lhe restava.', 'Tu sprint está en pausa, con el tiempo que le quedaba.'],
];

describe('backNav words', () => {
  it('the same keys and placeholders in EN / PT / ES, and every sentence as pinned', () => {
    expect(Object.keys(pt).sort()).toEqual(Object.keys(en).sort());
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
    expect(PINNED.map(([k]) => k).sort()).toEqual(Object.keys(en).sort());
    for (const [key, e, p, s] of PINNED) {
      expect([en[key], pt[key], es[key]], key).toEqual([e, p, s]);
      expect(holes(p), key).toEqual(holes(e));
      expect(holes(s), key).toEqual(holes(e));
    }
  });

  it('names what the app names: its words for the check, the review, Drill and its button', () => {
    expect(pt.checkKept).toContain(ptLocale.lesson.check.toLowerCase());
    expect(es.checkKept).toContain(esLocale.lesson.check.toLowerCase());
    expect(en.checkKept).toContain(enLocale.lesson.check.toLowerCase());
    expect(pt.drillKept).toContain(ptLocale.nav.drill);
    expect(es.drillKept).toContain(esLocale.nav.drill);
    expect(en.drillKept).toContain(enLocale.nav.drill);
    expect([en.continue, pt.continue, es.continue]).toEqual([enLocale.drill.feedback.continue, ptLocale.drill.feedback.continue, esLocale.drill.feedback.continue]);
  });

  it('loads into the app\'s own namespace, with its placeholders filled', () => {
    expect(i18n.t('backNav.checkKept', { lng: 'pt', current: 4, total: 9 })).toBe('A tua verificação ficou guardada: pergunta 4 de 9.');
    expect(i18n.t('backNav.sprintKept', { lng: 'es' })).toBe('Tu sprint está en pausa, con el tiempo que le quedaba.');
  });

  it('is not in the entry locales (it loads with the history module)', () => {
    // Read from disk: i18next merges the lazy bundle into the imported objects.
    for (const lang of ['en', 'pt', 'es']) {
      const raw = JSON.parse(readFileSync(`${process.cwd()}/src/i18n/locales/${lang}.json`, "utf8")) as Record<string, unknown>;
      expect('backNav' in raw, lang).toBe(false);
      expect('lesson' in raw, lang).toBe(true);
    }
  });
});
