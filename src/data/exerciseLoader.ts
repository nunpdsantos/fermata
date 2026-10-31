/**
 * Exercise data loader — enables code-splitting of exercise data per level.
 * Mirrors the curriculumLoader.ts pattern: dynamic import + cache.
 * Merges hand-authored exercises with programmatically generated ones.
 * Supports translation overlays for non-English languages.
 */
import type { ExerciseDefinition } from '../core/types/exercise';
import type { ModuleTemplateConfig } from './exercises/exerciseTemplates';
import type { ContentLanguage } from '../i18n/content/types';
import { generateAllForLevel, mergeExerciseMaps } from './exercises/exerciseGenerator';
import { loadExerciseOverlay, loadTemplateOverlay } from '../i18n/content/overlayLoader';
import { applyExerciseOverlay, applyTemplateOverlay } from '../i18n/content/contentResolver';

type ExerciseMap = Record<string, ExerciseDefinition[]>;

const EXERCISE_IMPORTERS: Record<string, () => Promise<{ default: ExerciseMap }>> = {
  l1: () => import('./exercises/exercisesL1'),
  l2: () => import('./exercises/exercisesL2'),
  l3: () => import('./exercises/exercisesL3'),
  l4: () => import('./exercises/exercisesL4'),
  l5: () => import('./exercises/exercisesL5'),
  l6: () => import('./exercises/exercisesL6'),
  l7: () => import('./exercises/exercisesL7'),
  l8: () => import('./exercises/exercisesL8'),
  l9: () => import('./exercises/exercisesL9'),
};

const TEMPLATE_IMPORTERS: Record<string, () => Promise<{ default: ModuleTemplateConfig[] }>> = {
  l1: () => import('./exercises/templatesL1'),
  l2: () => import('./exercises/templatesL2'),
  l3: () => import('./exercises/templatesL3'),
  l4: () => import('./exercises/templatesL4'),
  l5: () => import('./exercises/templatesL5'),
  l6: () => import('./exercises/templatesL6'),
  l7: () => import('./exercises/templatesL7'),
  l8: () => import('./exercises/templatesL8'),
  l9: () => import('./exercises/templatesL9'),
};

const exerciseCache = new Map<string, ExerciseMap>();

export async function loadExercises(
  levelId: string,
  lang: ContentLanguage = 'en',
): Promise<ExerciseMap> {
  const cacheKey = `${lang}:${levelId}`;
  const cached = exerciseCache.get(cacheKey);
  if (cached) return cached;

  const importer = EXERCISE_IMPORTERS[levelId];
  if (!importer) return {};

  // Load all sources in parallel
  const templateImporter = TEMPLATE_IMPORTERS[levelId];
  const [exerciseMod, templateMod, exerciseOv, templateOv] = await Promise.all([
    importer(),
    templateImporter ? templateImporter().catch(() => null) : Promise.resolve(null),
    loadExerciseOverlay(lang, levelId),
    loadTemplateOverlay(lang, levelId),
  ]);

  // Apply exercise overlay to hand-authored exercises
  let exercises = applyExerciseOverlay(exerciseMod.default, exerciseOv);

  // Apply template overlay + generate
  if (templateMod) {
    const translatedTemplates = applyTemplateOverlay(templateMod.default, templateOv);
    const generated = generateAllForLevel(translatedTemplates, lang);
    exercises = mergeExerciseMaps(exercises, generated);
  }

  // A PT/ES overlay that failed to load comes back null: serve the English
  // fallback this time but don't cache it, so the next load retries.
  if (lang === 'en' || (exerciseOv && (!templateMod || templateOv))) exerciseCache.set(cacheKey, exercises);
  return exercises;
}
