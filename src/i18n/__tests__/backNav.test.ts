/**
 * The `backNav` namespace (second audit round, P3): what a learner is told
 * when Back, Forward or an active tab leaves work in progress, the lesson's
 * way back into a kept check, and the choice before a new check would let
 * another lesson's kept one go. Lazy (it loads with state/appHistory.ts,
 * never with the entry bundle) and the same in all three languages.
 *
 * Pinned by what each sentence must DO, written here by hand (not a copy of
 * the files): which says the work is kept (or paused, or lost), which names
 * the question and the total in that order, which names the lesson, and
 * which uses the app's own word for a check, a review, a practice round and
 * Drill.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import en from '../backNav/en.json';
import pt from '../backNav/pt.json';
import es from '../backNav/es.json';
import i18n from '../index';
import '../backNav';

type Words = typeof en;
type Key = keyof Words;
const LANGS = { en, pt, es } as const;
const holes = (s: string) => [...s.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);

/** Each language's words for the roles, by hand (the app's own nouns: locales `lesson.check`, `nav.drill`, the review and practice labels). */
const ROLE = {
  en: { kept: /\bkept\b/, paused: /\bpaused\b/, lost: /\blost\b/, question: 'question {{current}} of {{total}}', check: /\bcheck\b/, review: /\breview\b/, practice: /\bpractice round\b/, drill: /\bDrill\b/, quoted: '“{{title}}”', go: 'Continue' },
  pt: { kept: /ficou guardada/, paused: /em pausa/, lost: /perde-se/, question: 'pergunta {{current}} de {{total}}', check: /verificação/, review: /revisão/, practice: /ronda de prática|\bprática\b/, drill: /\bTreino\b/, quoted: '«{{title}}»', go: 'Continuar' },
  es: { kept: /se ha guardado/, paused: /en pausa/, lost: /se pierde/, question: 'pregunta {{current}} de {{total}}', check: /comprobación/, review: /repaso/, practice: /ronda de práctica|\bpráctica\b/, drill: /\bPráctica\b/, quoted: '«{{title}}»', go: 'Continuar' },
} as const;

const KEPT_WITH_QUESTION: Key[] = ['checkKept', 'practiceKept', 'reviewKept', 'otherCheckKept', 'otherReviewKept', 'otherPracticeKept'];
const NAMES_LESSON: Key[] = ['otherCheckKept', 'otherReviewKept', 'otherPracticeKept', 'backToKept'];
const OF_CHECK: Key[] = ['checkKept', 'otherCheckKept', 'continueCheck', 'startCheckLetsGo', 'startCheckHere'];
const OF_REVIEW: Key[] = ['reviewKept', 'otherReviewKept', 'startReviewLetsGo', 'startReviewHere'];
const OF_PRACTICE: Key[] = ['practiceKept', 'otherPracticeKept', 'continuePractice'];

describe('backNav words', () => {
  it('the same keys, and each sentence\'s placeholders, in EN / PT / ES', () => {
    for (const words of [pt, es]) {
      expect(Object.keys(words).sort()).toEqual(Object.keys(en).sort());
      for (const k of Object.keys(en) as Key[]) expect([...holes(words[k])].sort(), k).toEqual([...holes(en[k])].sort());
    }
  });

  for (const [lang, words] of Object.entries(LANGS) as [keyof typeof LANGS, Words][]) {
    const r = ROLE[lang];
    describe(lang, () => {
      it('every "kept" sentence says the work is kept and names the question, then the total', () => {
        for (const k of KEPT_WITH_QUESTION) {
          expect(words[k], k).toMatch(r.kept);
          expect(words[k], k).toContain(r.question);
        }
        expect(words.drillKept).toMatch(r.kept);
        expect(words.drillKept).toMatch(r.drill);
        expect(words.sprintKept).toMatch(r.paused);
        expect(words.sprintKept).toMatch(/sprint/i);
      });

      it('the choice names the other lesson (quoted as the language quotes a title) and says starting here loses the kept one', () => {
        for (const k of NAMES_LESSON) expect(words[k], k).toContain(r.quoted);
        expect(words.startCheckLetsGo).toMatch(r.lost);
        expect(words.startReviewLetsGo).toMatch(r.lost);
      });

      it('each sentence uses the app\'s word for what it is about: the check, the review, the practice round', () => {
        for (const k of OF_CHECK) expect(words[k], k).toMatch(r.check);
        for (const k of OF_REVIEW) expect(words[k], k).toMatch(r.review);
        for (const k of OF_PRACTICE) expect(words[k], k).toMatch(r.practice);
        expect(words.continue).toBe(r.go);
      });
    });
  }

  it('fills in: the question and the total, in that order', () => {
    expect(i18n.t('backNav.checkKept', { lng: 'pt', current: 4, total: 9 })).toBe('A tua verificação ficou guardada: pergunta 4 de 9.');
    expect(i18n.t('backNav.otherCheckKept', { lng: 'es', title: 'Figuras y silencios', current: 2, total: 7 })).toBe('Tu comprobación en «Figuras y silencios» se ha guardado: pregunta 2 de 7.');
    expect(i18n.t('backNav.otherReviewKept', { lng: 'en', title: 'Note Values and Rests', current: 1, total: 5 })).toBe('Your review of “Note Values and Rests” is kept: question 1 of 5.');
  });

  it('is not in the entry locales (it loads with the history module)', () => {
    // Read from disk: i18next merges the lazy bundle into the imported objects.
    for (const lang of ['en', 'pt', 'es']) {
      const raw = JSON.parse(readFileSync(`${process.cwd()}/src/i18n/locales/${lang}.json`, 'utf8')) as Record<string, unknown>;
      expect('backNav' in raw, lang).toBe(false);
      expect('lesson' in raw, lang).toBe(true);
    }
  });
});
