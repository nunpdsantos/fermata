/**
 * Content resolver — pure functions that apply translation overlays
 * to English source data, producing translated copies.
 *
 * All functions are non-mutating: they return new objects.
 * When no overlay exists (English), they return the original data unmodified.
 */
import type { CurriculumLevel, CurriculumUnit, CurriculumModule } from '../../core/types/curriculum';
import type { ExerciseDefinition } from '../../core/types/exercise';
import type { ModuleTemplateConfig, ExerciseTemplate } from '../../data/exercises/exerciseTemplates';
import type {
  CurriculumLevelOverlay,
  ExerciseLevelOverlay,
  TemplateLevelOverlay,
  SongOverlay,
} from './types';
import type { SongReference } from '../../data/songReferences';

// ─── Curriculum ─────────────────────────────────────────────────────────────

/** Apply a curriculum overlay to a CurriculumLevel, translating units/modules. */
export function applyCurriculumOverlay(
  level: CurriculumLevel,
  overlay: CurriculumLevelOverlay | null,
): CurriculumLevel {
  if (!overlay) return level;

  return {
    ...level,
    units: level.units.map((unit) => applyUnitOverlay(unit, overlay)),
  };
}

function applyUnitOverlay(
  unit: CurriculumUnit,
  overlay: CurriculumLevelOverlay,
): CurriculumUnit {
  const unitOv = overlay.units[unit.id];
  const translatedUnit: CurriculumUnit = unitOv
    ? { ...unit, title: unitOv.title, description: unitOv.description }
    : unit;

  return {
    ...translatedUnit,
    modules: unit.modules.map((mod) => applyModuleOverlay(mod, overlay)),
  };
}

function applyModuleOverlay(
  mod: CurriculumModule,
  overlay: CurriculumLevelOverlay,
): CurriculumModule {
  const modOv = overlay.modules[mod.id];
  if (!modOv) return mod;

  return {
    ...mod,
    title: modOv.title,
    subtitle: modOv.subtitle,
    objectives: modOv.objectives,
    concepts: mod.concepts.map((concept, i) => {
      const cOv = modOv.concepts[i];
      if (!cOv) return concept;
      return {
        ...concept,
        title: cOv.title,
        explanation: cOv.explanation,
        tryThisLabel: cOv.tryThisLabel,
      };
    }),
    tasks: mod.tasks.map((task, i) => {
      const tOv = modOv.tasks[i];
      if (!tOv) return task;
      return { ...task, instruction: tOv.instruction };
    }),
  };
}

// ─── Exercises ──────────────────────────────────────────────────────────────

/** Apply an exercise overlay to hand-authored exercises. */
export function applyExerciseOverlay(
  exercises: Record<string, ExerciseDefinition[]>,
  overlay: ExerciseLevelOverlay | null,
): Record<string, ExerciseDefinition[]> {
  if (!overlay) return exercises;

  const result: Record<string, ExerciseDefinition[]> = {};
  for (const [moduleId, exList] of Object.entries(exercises)) {
    result[moduleId] = exList.map((ex) => {
      const exOv = overlay[ex.id];
      if (!exOv) return ex;

      const translated: ExerciseDefinition = {
        ...ex,
        prompt: exOv.prompt,
        hint: exOv.hint ?? ex.hint,
      };

      // Translate answer-choice labels. multiple_choice always carries them;
      // ear_training carries them in chord mode (ExerciseRunner reads
      // ear-training answer labels from exercise.config.choices).
      if (
        exOv.choices &&
        (ex.config.type === 'multiple_choice' || ex.config.type === 'ear_training') &&
        ex.config.choices
      ) {
        translated.config = {
          ...ex.config,
          choices: ex.config.choices.map((choice, i) => ({
            ...choice,
            label: exOv.choices![i] ?? choice.label,
          })),
        };
      }

      return translated;
    });
  }
  return result;
}

// ─── Templates ──────────────────────────────────────────────────────────────

/** Apply a template overlay to exercise template configs before generation. */
export function applyTemplateOverlay(
  configs: ModuleTemplateConfig[],
  overlay: TemplateLevelOverlay | null,
): ModuleTemplateConfig[] {
  if (!overlay) return configs;

  return configs.map((config) => {
    const templates = overlay[config.moduleId];
    if (!templates || templates.length === 0) return config;

    return {
      ...config,
      templates: config.templates.map((tmpl, i) => {
        const tmplOv = templates[i];
        if (!tmplOv) return tmpl;

        const translated: ExerciseTemplate = {
          ...tmpl,
          promptTemplate: tmplOv.promptTemplate,
          hintTemplate: tmplOv.hintTemplate,
        };

        // Translate choice set labels
        if (tmplOv.choiceSets && tmpl.params.choiceSets) {
          translated.params = {
            ...tmpl.params,
            choiceSets: tmpl.params.choiceSets.map((set, si) => {
              const translatedLabels = tmplOv.choiceSets?.[si];
              if (!translatedLabels) return set;
              return set.map((choice, ci) => ({
                ...choice,
                label: translatedLabels[ci] ?? choice.label,
              }));
            }),
          };
        }

        return translated;
      }),
    };
  });
}

// ─── Song references ────────────────────────────────────────────────────────

/** Apply a song overlay to song references (translates context strings). */
export function applySongOverlay(
  refs: Record<string, SongReference[]>,
  overlay: SongOverlay | null,
): Record<string, SongReference[]> {
  if (!overlay) return refs;

  const result: Record<string, SongReference[]> = {};
  for (const [moduleId, songs] of Object.entries(refs)) {
    const contexts = overlay[moduleId];
    if (!contexts) {
      result[moduleId] = songs;
      continue;
    }
    result[moduleId] = songs.map((song, i) => ({
      ...song,
      context: contexts[i] ?? song.context,
    }));
  }
  return result;
}
