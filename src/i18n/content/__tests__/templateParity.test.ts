import { describe, it, expect } from 'vitest';
import type { ModuleTemplateConfig } from '../../../data/exercises/exerciseTemplates';
import type { TemplateLevelOverlay } from '../types';
import enL1 from '../../../data/exercises/templatesL1';
import enL2 from '../../../data/exercises/templatesL2';
import enL3 from '../../../data/exercises/templatesL3';
import enL4 from '../../../data/exercises/templatesL4';
import enL5 from '../../../data/exercises/templatesL5';
import enL6 from '../../../data/exercises/templatesL6';
import enL7 from '../../../data/exercises/templatesL7';
import enL8 from '../../../data/exercises/templatesL8';
import enL9 from '../../../data/exercises/templatesL9';
import ptL1 from '../pt/templatesL1';
import ptL2 from '../pt/templatesL2';
import ptL3 from '../pt/templatesL3';
import ptL4 from '../pt/templatesL4';
import ptL5 from '../pt/templatesL5';
import ptL6 from '../pt/templatesL6';
import ptL7 from '../pt/templatesL7';
import ptL8 from '../pt/templatesL8';
import ptL9 from '../pt/templatesL9';
import esL1 from '../es/templatesL1';
import esL2 from '../es/templatesL2';
import esL3 from '../es/templatesL3';
import esL4 from '../es/templatesL4';
import esL5 from '../es/templatesL5';
import esL6 from '../es/templatesL6';
import esL7 from '../es/templatesL7';
import esL8 from '../es/templatesL8';
import esL9 from '../es/templatesL9';

// ---------------------------------------------------------------------------
// Template overlay parity (WS6 T6)
//
// PT/ES template overlays REPLACE the English template wholesale, keyed by
// moduleId + template array index. When the English is remediated without the
// overlays following (commit b355d71), PT/ES learners get prompts that no
// longer describe the graded answer — i.e. mis-graded exercises. This suite
// pins the structural contract:
//   (1) every overlay moduleId exists in the EN template configs
//   (2) every overlay template index exists in the EN config
//   (3) overlay prompt/hint use exactly the same {token} set as the EN
//       prompt/hint they replace (no token added, none dropped)
//   (4) overlay prompt/hint only use tokens the generator can actually fill
// ---------------------------------------------------------------------------

// Replacement keys actually implemented in exerciseGenerator's fillTemplate:
//   note_id          → root, note, octave
//   interval_id      → root, semitones, direction
//   scale_build      → root, scaleType
//   chord_build      → root, quality
//   scale_degree_id  → root, scaleType, note, degree
// plus 'accidental', which fillTemplate strips because the {root} replacement
// already carries the accidental (e.g. 'Gb').
const FILLABLE_TOKENS = new Set([
  'root',
  'note',
  'octave',
  'semitones',
  'direction',
  'scaleType',
  'quality',
  'degree',
  'accidental',
]);

// Known, deliberate exceptions to exact token parity, keyed as
// `${lang}:${moduleId}[${index}].prompt|hint`. None at present — only add an
// entry here with a comment explaining why the divergence cannot mis-grade.
const PARITY_EXCEPTIONS = new Set<string>([]);

const TOKEN_RE = /\{[a-zA-Z]+\}/g;

/** Unique, sorted {token} list of a template string. */
function tokenSet(text: string): string[] {
  return [...new Set(Array.from(text.matchAll(TOKEN_RE), (m) => m[0]))].sort();
}

const LEVELS: Array<{
  id: string;
  en: ModuleTemplateConfig[];
  pt: TemplateLevelOverlay;
  es: TemplateLevelOverlay;
}> = [
  { id: 'L1', en: enL1, pt: ptL1, es: esL1 },
  { id: 'L2', en: enL2, pt: ptL2, es: esL2 },
  { id: 'L3', en: enL3, pt: ptL3, es: esL3 },
  { id: 'L4', en: enL4, pt: ptL4, es: esL4 },
  { id: 'L5', en: enL5, pt: ptL5, es: esL5 },
  { id: 'L6', en: enL6, pt: ptL6, es: esL6 },
  { id: 'L7', en: enL7, pt: ptL7, es: esL7 },
  { id: 'L8', en: enL8, pt: ptL8, es: esL8 },
  { id: 'L9', en: enL9, pt: ptL9, es: esL9 },
];

describe('template overlay parity (PT/ES vs EN)', () => {
  for (const level of LEVELS) {
    for (const lang of ['pt', 'es'] as const) {
      describe(`${level.id} ${lang}`, () => {
        const overlay = level[lang];

        for (const [moduleId, overlayTemplates] of Object.entries(overlay)) {
          const enConfig = level.en.find((c) => c.moduleId === moduleId);

          it(`${moduleId}: overlay module exists in EN templates`, () => {
            expect(enConfig, `${lang} overlay keys unknown module '${moduleId}'`).toBeTruthy();
          });
          if (!enConfig) continue;

          overlayTemplates.forEach((ov, i) => {
            const enTmpl = enConfig.templates[i];

            it(`${moduleId}[${i}]: overlay template index exists in EN`, () => {
              expect(
                enTmpl,
                `${lang} overlay ${moduleId}[${i}] has no EN counterpart (EN has ${enConfig.templates.length} templates)`,
              ).toBeTruthy();
            });
            if (!enTmpl) return;

            it(`${moduleId}[${i}]: prompt uses the same {tokens} as EN`, () => {
              if (PARITY_EXCEPTIONS.has(`${lang}:${moduleId}[${i}].prompt`)) return;
              expect(
                tokenSet(ov.promptTemplate),
                `${lang} ${moduleId}[${i}] prompt tokens diverge from EN\n  EN: "${enTmpl.promptTemplate}"\n  ${lang}: "${ov.promptTemplate}"`,
              ).toEqual(tokenSet(enTmpl.promptTemplate));
            });

            it(`${moduleId}[${i}]: hint uses the same {tokens} as EN`, () => {
              if (PARITY_EXCEPTIONS.has(`${lang}:${moduleId}[${i}].hint`)) return;
              expect(
                tokenSet(ov.hintTemplate),
                `${lang} ${moduleId}[${i}] hint tokens diverge from EN\n  EN: "${enTmpl.hintTemplate}"\n  ${lang}: "${ov.hintTemplate}"`,
              ).toEqual(tokenSet(enTmpl.hintTemplate));
            });

            it(`${moduleId}[${i}]: prompt/hint only use generator-fillable tokens`, () => {
              const tokens = [...tokenSet(ov.promptTemplate), ...tokenSet(ov.hintTemplate)];
              for (const token of tokens) {
                expect(
                  FILLABLE_TOKENS.has(token.slice(1, -1)),
                  `${lang} ${moduleId}[${i}] uses ${token}, which fillTemplate cannot fill`,
                ).toBe(true);
              }
            });
          });
        }
      });
    }
  }
});
