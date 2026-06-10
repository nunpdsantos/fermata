/**
 * Programmatic Exercise Generator — seeded PRNG for deterministic generation.
 * Seed = hash of moduleId → same user sees same exercises every time.
 */
import type { ExerciseDefinition, ExerciseConfig } from '../../core/types/exercise';
import type { ModuleTemplateConfig, ExerciseTemplate } from './exerciseTemplates';
import type { ContentLanguage } from '../../i18n/content/types';
import type { Note, NaturalNote, Accidental, ScaleType } from '../../core/types/music';
import { noteToString } from '../../core/types/music';
import { buildScale } from '../../core/constants/scales';
import { translateScaleType, translateChordQuality, translateDirection } from '../../i18n/content/musicTerms';
import { mulberry32 } from '../../core/utils/prng';

/** Simple string hash → 32-bit integer */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return hash;
}

/** Pick a random element from an array using the PRNG */
function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

// ─── Config Builders ────────────────────────────────────────────────────────

function buildConfig(template: ExerciseTemplate, rand: () => number): ExerciseConfig | null {
  const p = template.params;

  switch (template.type) {
    case 'note_id': {
      const roots = p.roots ?? ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const accidentals = p.accidentals ?? roots.map(() => '');
      const octaves = p.octaves ?? [4];
      const idx = Math.floor(rand() * roots.length);
      return {
        type: 'note_id',
        note: roots[idx],
        accidental: accidentals[idx] ?? '',
        octave: pick(octaves, rand),
      };
    }

    case 'interval_id': {
      const roots = p.roots ?? ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const accidentals = p.accidentals ?? roots.map(() => '');
      const intervals = p.intervals ?? [3, 4, 5, 7];
      const directions = p.directions ?? ['ascending'];
      const octaves = p.octaves ?? [4];
      const idx = Math.floor(rand() * roots.length);
      return {
        type: 'interval_id',
        root: roots[idx],
        rootAccidental: accidentals[idx] ?? '',
        rootOctave: pick(octaves, rand),
        targetSemitones: pick(intervals, rand),
        direction: pick(directions, rand),
      };
    }

    case 'scale_build': {
      const roots = p.roots ?? ['C', 'G', 'D', 'F'];
      const accidentals = p.accidentals ?? roots.map(() => '');
      const scaleTypes = p.scaleTypes ?? ['major'];
      const noteCounts = p.noteCounts ?? [7];
      const idx = Math.floor(rand() * roots.length);
      const scaleIdx = Math.floor(rand() * scaleTypes.length);
      return {
        type: 'scale_build',
        root: roots[idx],
        rootAccidental: accidentals[idx] ?? '',
        scaleType: scaleTypes[scaleIdx],
        noteCount: scaleTypes.length === noteCounts.length
          ? noteCounts[scaleIdx]
          : pick(noteCounts, rand),
      };
    }

    case 'chord_build': {
      const roots = p.roots ?? ['C', 'G', 'D', 'F'];
      const accidentals = p.accidentals ?? roots.map(() => '');
      const qualities = p.chordQualities ?? ['major'];
      const noteCounts = p.noteCounts ?? [3];
      const idx = Math.floor(rand() * roots.length);
      return {
        type: 'chord_build',
        root: roots[idx],
        rootAccidental: accidentals[idx] ?? '',
        quality: roots.length === qualities.length
          ? qualities[idx]
          : pick(qualities, rand),
        noteCount: pick(noteCounts, rand),
      };
    }

    case 'multiple_choice': {
      if (!p.choiceSets?.length) return null;
      return {
        type: 'multiple_choice',
        choices: pick(p.choiceSets, rand),
      };
    }

    case 'scale_degree_id': {
      const roots = p.roots ?? ['C', 'G', 'D'];
      const accidentals = p.accidentals ?? roots.map(() => '');
      const scaleTypes = p.scaleTypes ?? ['major'];
      const degrees = p.degrees ?? [1, 2, 3, 4, 5, 6, 7];
      const idx = Math.floor(rand() * roots.length);
      const scaleType = pick(scaleTypes, rand);
      // Resolve the chosen degree to the ACTUAL note at that position in the
      // built scale, so the prompt can name a concrete note and correctDegree
      // truly matches it. (A degree of N maps to scale note index N-1.)
      const root: Note = {
        natural: roots[idx] as NaturalNote,
        accidental: (accidentals[idx] ?? '') as Accidental,
      };
      const scaleNotes = buildScale(root, scaleType as ScaleType).notes;
      const degree = pick(degrees, rand);
      // Clamp to the scale length in case a degree exceeds a shorter scale.
      const degreeIndex = Math.min(degree, scaleNotes.length) - 1;
      const correctDegree = degreeIndex + 1;
      const note = scaleNotes[degreeIndex];
      return {
        type: 'scale_degree_id',
        root: roots[idx],
        rootAccidental: accidentals[idx] ?? '',
        scaleType,
        note: note.natural,
        noteAccidental: note.accidental,
        correctDegree,
      };
    }

    default:
      return null;
  }
}

/** Templates already warned about, so each leftover token is reported once. */
const warnedLeftoverTemplates = new Set<string>();

/** Fill {param} placeholders in a template string with values from config */
function fillTemplate(template: string, config: ExerciseConfig, lang: ContentLanguage = 'en', templateId = ''): string {
  let result = template;
  const replacements: Record<string, string> = {};

  switch (config.type) {
    case 'note_id':
      replacements['root'] = config.note + config.accidental;
      replacements['note'] = config.note + config.accidental;
      replacements['octave'] = String(config.octave);
      break;
    case 'interval_id':
      replacements['root'] = config.root + config.rootAccidental;
      replacements['semitones'] = String(config.targetSemitones);
      replacements['direction'] = translateDirection(config.direction, lang);
      break;
    case 'scale_build':
      replacements['root'] = config.root + config.rootAccidental;
      replacements['scaleType'] = translateScaleType(config.scaleType, lang);
      break;
    case 'chord_build':
      replacements['root'] = config.root + config.rootAccidental;
      replacements['quality'] = translateChordQuality(config.quality, lang);
      break;
    case 'scale_degree_id':
      replacements['root'] = config.root + config.rootAccidental;
      replacements['scaleType'] = translateScaleType(config.scaleType, lang);
      replacements['note'] = noteToString({
        natural: config.note as NaturalNote,
        accidental: (config.noteAccidental || '') as Accidental,
      });
      replacements['degree'] = String(config.correctDegree);
      break;
  }

  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }

  // Legacy templates write '{root}{accidental}', but the {root} replacement
  // above already carries the accidental (e.g. 'Gb'), so the token is dropped.
  result = result.replace(/\{accidental\}/g, '');

  // Dev guard: any other leftover {token} means the template references a
  // parameter this generator cannot fill. Warn once per template (don't throw —
  // the exercise still renders and grading is unaffected).
  const leftover = result.match(/\{[a-z]+\}/i);
  if (leftover) {
    const warnKey = `${templateId}:${template}`;
    if (!warnedLeftoverTemplates.has(warnKey)) {
      warnedLeftoverTemplates.add(warnKey);
      console.warn(
        `[exerciseGenerator] Unreplaced token ${leftover[0]}${templateId ? ` in template for ${templateId}` : ''}: "${template}"`,
      );
    }
  }

  return result;
}

// ─── Main Generator ─────────────────────────────────────────────────────────

/** Generate exercises for a single module from its template config. */
export function generateExercises(
  config: ModuleTemplateConfig,
  seed?: number,
  lang: ContentLanguage = 'en',
): ExerciseDefinition[] {
  const actualSeed = seed ?? hashString(config.moduleId);
  const rand = mulberry32(actualSeed);
  const exercises: ExerciseDefinition[] = [];
  const seenKeys = new Set<string>();

  let attempts = 0;
  const maxAttempts = config.targetCount * 5; // prevent infinite loops

  while (exercises.length < config.targetCount && attempts < maxAttempts) {
    attempts++;
    const template = pick(config.templates, rand);
    const exerciseConfig = buildConfig(template, rand);
    if (!exerciseConfig) continue;

    // Deduplication: create a key from the config to avoid identical exercises
    const dedupeKey = JSON.stringify(exerciseConfig);
    if (seenKeys.has(dedupeKey)) continue;
    seenKeys.add(dedupeKey);

    const index = exercises.length + 1;
    const id = `${config.moduleId}g${index}`;

    exercises.push({
      id,
      type: template.type,
      prompt: fillTemplate(template.promptTemplate, exerciseConfig, lang, config.moduleId),
      config: exerciseConfig,
      hint: fillTemplate(template.hintTemplate, exerciseConfig, lang, config.moduleId),
      points: template.points ?? 1,
    });
  }

  return exercises;
}

/** Generate all exercises for a level's template configs. Returns moduleId → exercises. */
export function generateAllForLevel(
  configs: ModuleTemplateConfig[],
  lang: ContentLanguage = 'en',
): Record<string, ExerciseDefinition[]> {
  const result: Record<string, ExerciseDefinition[]> = {};
  for (const config of configs) {
    const exercises = generateExercises(config, undefined, lang);
    if (exercises.length > 0) {
      result[config.moduleId] = exercises;
    }
  }
  return result;
}

/** Merge hand-authored exercises with generated exercises. */
export function mergeExerciseMaps(
  authored: Record<string, ExerciseDefinition[]>,
  generated: Record<string, ExerciseDefinition[]>,
): Record<string, ExerciseDefinition[]> {
  const merged: Record<string, ExerciseDefinition[]> = { ...authored };
  for (const [moduleId, genExercises] of Object.entries(generated)) {
    const existing = merged[moduleId] ?? [];
    merged[moduleId] = [...existing, ...genExercises];
  }
  return merged;
}
