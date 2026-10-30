/**
 * Generated-prompt grammar gate for Levels 1–5 (audit W5-37, L1–L5 part).
 *
 * Checks two layers:
 *   1. the template strings themselves (covers every configuration a template
 *      can produce, not just the seeded sample): no "a {root}" / "an {root}"
 *      article, no "going {direction}", no raw program identifiers written
 *      into the text;
 *   2. every generated L1–L5 exercise in EN/PT/ES: no a/an article error
 *      before a note letter, no "going ascending", no leftover {token}, no raw
 *      identifiers.
 *
 * The {quality} value comes from the shared chord-quality name map in
 * musicTerms.ts, which another batch is changing ("minor7" → "minor 7th").
 * That substituted value is stripped before the raw-identifier check, so this
 * test only judges text the L1–L5 templates control and passes with either
 * version of the map.
 */
import { describe, expect, it } from 'vitest';
import { generateAllForLevel } from '../exerciseGenerator';
import { applyTemplateOverlay } from '../../../i18n/content/contentResolver';
import { translateChordQuality } from '../../../i18n/content/musicTerms';
import type { ContentLanguage } from '../../../i18n/content/types';
import type { ModuleTemplateConfig } from '../exerciseTemplates';

import templatesL1 from '../templatesL1';
import templatesL2 from '../templatesL2';
import templatesL3 from '../templatesL3';
import templatesL4 from '../templatesL4';
import templatesL5 from '../templatesL5';
import ptT1 from '../../../i18n/content/pt/templatesL1';
import ptT2 from '../../../i18n/content/pt/templatesL2';
import ptT3 from '../../../i18n/content/pt/templatesL3';
import ptT4 from '../../../i18n/content/pt/templatesL4';
import ptT5 from '../../../i18n/content/pt/templatesL5';
import esT1 from '../../../i18n/content/es/templatesL1';
import esT2 from '../../../i18n/content/es/templatesL2';
import esT3 from '../../../i18n/content/es/templatesL3';
import esT4 from '../../../i18n/content/es/templatesL4';
import esT5 from '../../../i18n/content/es/templatesL5';

const EN: ModuleTemplateConfig[][] = [templatesL1, templatesL2, templatesL3, templatesL4, templatesL5];
const OVERLAYS = {
  pt: [ptT1, ptT2, ptT3, ptT4, ptT5],
  es: [esT1, esT2, esT3, esT4, esT5],
} as const;

/** "a A/E/F…" or "an B/C/D/G…" directly before a note letter (English only). */
const ARTICLE_ERROR = /\b(?:a [AEF]|an [BCDG])[#b♯♭]?(?![A-Za-z])/;
/** snake_case ids (natural_minor, half_diminished7) or glued quality+digit (minor7). */
const RAW_ID = /\b[a-z]+_[a-z0-9_]+\b|\b(?:major|minor|dominant|diminished|augmented)\d+\b/;
const LEFTOVER_TOKEN = /\{[a-zA-Z]+\}/;

function generated(lang: ContentLanguage) {
  const out: Array<{ id: string; prompt: string; hint: string; quality?: string }> = [];
  EN.forEach((tpl, i) => {
    const cfgs = lang === 'en' ? tpl : applyTemplateOverlay(tpl, OVERLAYS[lang][i]);
    for (const list of Object.values(generateAllForLevel(cfgs, lang))) {
      for (const ex of list) {
        const cfg = ex.config as { type: string; quality?: string };
        out.push({ id: ex.id, prompt: ex.prompt, hint: ex.hint ?? '', quality: cfg.type === 'chord_build' ? cfg.quality : undefined });
      }
    }
  });
  return out;
}

describe('L1–L5 template strings (every configuration)', () => {
  const strings: Array<[string, string]> = [];
  for (const level of EN) {
    for (const cfg of level) {
      cfg.templates.forEach((t, i) => {
        strings.push([`${cfg.moduleId}[${i}].prompt`, t.promptTemplate]);
        strings.push([`${cfg.moduleId}[${i}].hint`, t.hintTemplate]);
      });
    }
  }

  it('reads the full L1–L5 template set', () => {
    expect(strings.length).toBeGreaterThan(150);
  });

  it('no a/an article directly before {root} or {note}', () => {
    expect(strings.filter(([, s]) => /\ban? \{(?:root|note)\}/.test(s))).toEqual([]);
  });

  it('no "going {direction}"', () => {
    expect(strings.filter(([, s]) => /going \{direction\}/.test(s))).toEqual([]);
  });

  it('no raw program identifiers written into template text', () => {
    expect(strings.filter(([, s]) => RAW_ID.test(s.replace(/\{[a-zA-Z]+\}/g, '')))).toEqual([]);
  });
});

describe('generated L1–L5 exercises', () => {
  const en = generated('en');

  it('generates a substantial English sample', () => {
    expect(en.length).toBeGreaterThan(200);
  });

  it('English prompts have no a/an article error before a note letter', () => {
    expect(en.filter((e) => ARTICLE_ERROR.test(e.prompt)).map((e) => `${e.id}: ${e.prompt}`)).toEqual([]);
  });

  it('English prompts never say "going ascending/descending"', () => {
    expect(en.filter((e) => /going (?:ascending|descending)/.test(e.prompt)).map((e) => e.id)).toEqual([]);
  });

  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: no leftover {tokens} and no raw identifiers outside the {quality} value`, () => {
      const items = lang === 'en' ? en : generated(lang);
      const bad: string[] = [];
      for (const e of items) {
        const qualityName = e.quality ? translateChordQuality(e.quality, lang) : '';
        for (const text of [e.prompt, e.hint]) {
          const own = qualityName ? text.split(qualityName).join('') : text;
          if (LEFTOVER_TOKEN.test(text) || RAW_ID.test(own)) bad.push(`${e.id}: ${text}`);
        }
      }
      expect(bad).toEqual([]);
    });
  }
});
