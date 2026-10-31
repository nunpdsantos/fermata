/**
 * Test helper: every Learn exercise exactly as the app serves it, in English,
 * Portuguese and Spanish — authored items with their overlay applied, plus the
 * items the seeded generator produces from the (translated) templates. Mirrors
 * `exerciseLoader.loadExercises` synchronously, so corpus tests read what a
 * learner sees rather than the raw source files.
 */
import type { CurriculumModule } from '../../../core/types/curriculum';
import type { ExerciseDefinition } from '../../../core/types/exercise';
import type { ModuleTemplateConfig } from '../exerciseTemplates';
import type { ContentLanguage } from '../../../i18n/content/types';
import { generateAllForLevel, mergeExerciseMaps } from '../exerciseGenerator';
import { applyExerciseOverlay, applyTemplateOverlay } from '../../../i18n/content/contentResolver';
import {
  EN_UNITS,
  enExercisesFor,
  enTemplatesFor,
  exerciseOverlay,
  templateOverlay,
} from '../../../i18n/content/__tests__/overlayEntries';

export const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const CONTENT_LANGS: readonly ContentLanguage[] = ['en', 'pt', 'es'];

export interface CorpusItem {
  level: number;
  moduleId: string;
  lang: ContentLanguage;
  source: 'authored' | 'generated';
  exercise: ExerciseDefinition;
}

/** The (translated) template configs the generator runs on, per level. */
export function templatesFor(level: number, lang: ContentLanguage): ModuleTemplateConfig[] {
  const en = enTemplatesFor(level);
  return lang === 'en' ? en : applyTemplateOverlay(en, templateOverlay(lang, level));
}

/** Authored exercises (translated), per level, keyed by module. */
export function authoredFor(level: number, lang: ContentLanguage): Record<string, ExerciseDefinition[]> {
  const en = enExercisesFor(level);
  return lang === 'en' ? en : applyExerciseOverlay(en, exerciseOverlay(lang, level));
}

const cache = new Map<string, CorpusItem[]>();

/** Every served exercise of a level in one language. */
export function levelCorpus(level: number, lang: ContentLanguage): CorpusItem[] {
  const key = `${lang}:${level}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const authored = authoredFor(level, lang);
  const generated = generateAllForLevel(templatesFor(level, lang), lang, enExercisesFor(level));
  const merged = mergeExerciseMaps(authored, generated);
  const items: CorpusItem[] = [];
  for (const [moduleId, list] of Object.entries(merged)) {
    for (const exercise of list) {
      items.push({
        level,
        moduleId,
        lang,
        source: /g\d+$/.test(exercise.id) ? 'generated' : 'authored',
        exercise,
      });
    }
  }
  cache.set(key, items);
  return items;
}

/** Every served exercise, all levels, all three languages. */
export function fullCorpus(): CorpusItem[] {
  return CONTENT_LANGS.flatMap((lang) => LEVELS.flatMap((n) => levelCorpus(n, lang)));
}

/** Curriculum modules in course order, with their level number. */
export function modulesInOrder(): { level: number; module: CurriculumModule }[] {
  return LEVELS.flatMap((n) => EN_UNITS[n].flatMap((u) => u.modules.map((module) => ({ level: n, module }))));
}
