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
import { translateScaleType, translateChordQuality, translateDirection, chordQualityLabel } from '../../i18n/content/musicTerms';
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

/** A built config plus the extra {tokens} its template params supply (e.g. {key}). */
interface BuiltConfig {
  config: ExerciseConfig;
  tokens: Record<string, string>;
}

function buildConfig(template: ExerciseTemplate, rand: () => number, lang: ContentLanguage = 'en'): BuiltConfig | null {
  const built = buildConfigWithIndex(template, rand, lang);
  if (!built) return null;
  const tokens: Record<string, string> = {};
  const key = built.rootIndex !== undefined ? template.params.keys?.[built.rootIndex] : undefined;
  if (key !== undefined) tokens['key'] = key;
  return { config: built.config, tokens };
}

/** buildConfig's body: the config and which `roots` index it drew (for index-aligned params). */
function buildConfigWithIndex(
  template: ExerciseTemplate,
  rand: () => number,
  lang: ContentLanguage,
): { config: ExerciseConfig; rootIndex?: number } | null {
  const p = template.params;
  const at = (config: ExerciseConfig, rootIndex?: number) => ({ config, rootIndex });

  switch (template.type) {
    case 'note_id': {
      const roots = p.roots ?? ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const accidentals = p.accidentals ?? roots.map(() => '');
      const octaves = p.octaves ?? [4];
      const idx = Math.floor(rand() * roots.length);
      return at({
        type: 'note_id',
        note: roots[idx],
        accidental: accidentals[idx] ?? '',
        // Index-aligned octaves pin each note's staff position (W4-05).
        octave: p.noteOctaves ? p.noteOctaves[idx] : pick(octaves, rand),
        ...(p.clef ? { clef: p.clef } : {}),
      }, idx);
    }

    case 'interval_id': {
      const roots = p.roots ?? ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const accidentals = p.accidentals ?? roots.map(() => '');
      const intervals = p.intervals ?? [3, 4, 5, 7];
      const directions = p.directions ?? ['ascending'];
      const octaves = p.octaves ?? [4];
      const idx = Math.floor(rand() * roots.length);
      const rootOctave = pick(octaves, rand);
      // Same draw as pick(intervals); the index also selects the interval number.
      const intervalIdx = Math.floor(rand() * intervals.length);
      const intervalNumber = p.intervalNumbers?.[intervalIdx];
      return at({
        type: 'interval_id',
        root: roots[idx],
        rootAccidental: accidentals[idx] ?? '',
        rootOctave,
        targetSemitones: intervals[intervalIdx],
        direction: pick(directions, rand),
        ...(intervalNumber !== undefined ? { intervalNumber } : {}),
        ...(p.intervalAnswer ? { answer: p.intervalAnswer } : {}),
      }, idx);
    }

    case 'scale_build': {
      const roots = p.roots ?? ['C', 'G', 'D', 'F'];
      const accidentals = p.accidentals ?? roots.map(() => '');
      const scaleTypes = p.scaleTypes ?? ['major'];
      const noteCounts = p.noteCounts ?? [7];
      const idx = Math.floor(rand() * roots.length);
      const scaleIdx = Math.floor(rand() * scaleTypes.length);
      return at({
        type: 'scale_build',
        root: roots[idx],
        rootAccidental: accidentals[idx] ?? '',
        scaleType: scaleTypes[scaleIdx],
        noteCount: scaleTypes.length === noteCounts.length
          ? noteCounts[scaleIdx]
          : pick(noteCounts, rand),
      }, idx);
    }

    case 'chord_build': {
      const roots = p.roots ?? ['C', 'G', 'D', 'F'];
      const accidentals = p.accidentals ?? roots.map(() => '');
      const qualities = p.chordQualities ?? ['major'];
      const noteCounts = p.noteCounts ?? [3];
      const idx = Math.floor(rand() * roots.length);
      return at({
        type: 'chord_build',
        root: roots[idx],
        rootAccidental: accidentals[idx] ?? '',
        quality: roots.length === qualities.length
          ? qualities[idx]
          : pick(qualities, rand),
        noteCount: pick(noteCounts, rand),
      }, idx);
    }

    case 'multiple_choice': {
      if (!p.choiceSets?.length) return null;
      // Same draw as pick(choiceSets); the index also selects the stimulus.
      const setIdx = Math.floor(rand() * p.choiceSets.length);
      const stimulus = p.stimuli?.[setIdx];
      return at({
        type: 'multiple_choice',
        choices: p.choiceSets[setIdx],
        ...(stimulus ? { stimulus } : {}),
      });
    }

    case 'ear_training': {
      // 'major7' → 'Major 7' (dictionary translations already read naturally)
      const cap = (s: string) =>
        (s.charAt(0).toUpperCase() + s.slice(1)).replace(/([A-Za-z])(\d)/, '$1 $2');
      const roots = p.roots ?? ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const accidentals = p.accidentals ?? roots.map(() => '');
      const octaves = p.octaves ?? [4];
      const idx = Math.floor(rand() * roots.length);

      switch (p.earMode) {
        case 'note':
          return at({
            type: 'ear_training',
            mode: 'note',
            note: roots[idx],
            accidental: accidentals[idx] ?? '',
            octave: pick(octaves, rand),
          }, idx);
        case 'interval': {
          const intervals = p.intervals ?? [3, 4, 5, 7];
          const directions = p.directions ?? ['ascending'];
          return at({
            type: 'ear_training',
            mode: 'interval',
            root: roots[idx],
            rootAccidental: accidentals[idx] ?? '',
            rootOctave: pick(octaves, rand),
            targetSemitones: pick(intervals, rand),
            direction: pick(directions, rand),
            ...(p.harmonic ? { harmonic: true } : {}),
          }, idx);
        }
        case 'chord': {
          const qualities = p.chordQualities ?? [];
          if (qualities.length < 2) return null;
          const quality = pick(qualities, rand);
          return at({
            type: 'ear_training',
            mode: 'chord',
            chordRoot: roots[idx],
            chordRootAccidental: accidentals[idx] ?? '',
            quality,
            choices: qualities.map((q) => ({
              label: chordQualityLabel(q, lang),
              correct: q === quality,
            })),
          }, idx);
        }
        case 'scale': {
          const scaleTypes = p.scaleTypes ?? [];
          if (scaleTypes.length < 2) return null;
          const scaleType = pick(scaleTypes, rand);
          return at({
            type: 'ear_training',
            mode: 'scale',
            root: roots[idx],
            rootAccidental: accidentals[idx] ?? '',
            rootOctave: pick(octaves, rand),
            scaleType,
            choices: scaleTypes.map((s) => ({
              label: cap(translateScaleType(s, lang)),
              correct: s === scaleType,
            })),
          }, idx);
        }
        case 'progression': {
          const sets = p.progressionSets ?? [];
          if (sets.length < 2) return null;
          const progression = pick(sets, rand);
          return at({
            type: 'ear_training',
            mode: 'progression',
            root: roots[idx],
            rootAccidental: accidentals[idx] ?? '',
            progression,
            choices: sets.map((s) => ({
              label: s.join(' - '),
              correct: s === progression,
            })),
          }, idx);
        }
        default:
          return null;
      }
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
      return at({
        type: 'scale_degree_id',
        root: roots[idx],
        rootAccidental: accidentals[idx] ?? '',
        scaleType,
        note: note.natural,
        noteAccidental: note.accidental,
        correctDegree,
      }, idx);
    }

    default:
      return null;
  }
}

/** Templates already warned about, so each leftover token is reported once. */
const warnedLeftoverTemplates = new Set<string>();

/** Fill {param} placeholders in a template string with values from config */
function fillTemplate(
  template: string,
  config: ExerciseConfig,
  lang: ContentLanguage = 'en',
  templateId = '',
  extra: Record<string, string> = {},
): string {
  let result = template;
  const replacements: Record<string, string> = { ...extra };

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
    case 'ear_training':
      // Post-attempt hints may reference the played material; prompts must
      // not (enforced by generator tests + the L9 alignment corpus test).
      if (config.note) replacements['note'] = config.note + (config.accidental ?? '');
      if (config.octave !== undefined) replacements['octave'] = String(config.octave);
      if (config.root) replacements['root'] = config.root + (config.rootAccidental ?? '');
      if (config.targetSemitones !== undefined) replacements['semitones'] = String(config.targetSemitones);
      if (config.direction) replacements['direction'] = translateDirection(config.direction, lang);
      if (config.quality) replacements['quality'] = translateChordQuality(config.quality, lang);
      if (config.scaleType) replacements['scaleType'] = translateScaleType(config.scaleType, lang);
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

/** JSON with sorted keys, so two configs written in a different key order compare equal. */
function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

/**
 * The language-neutral identity of an exercise (audit W4-19): its config
 * without answer labels — PT/ES translate the labels, everything else is
 * shared, so the same items are skipped in every language and generated ids
 * stay aligned. Multiple-choice items ARE their labels, so they have no
 * neutral identity here; authored/generated MC duplicates are kept out of
 * the content itself (corpus test).
 */
export function exerciseIdentity(config: ExerciseConfig): string | null {
  if (config.type === 'multiple_choice') return null;
  const { choices: _labels, ...rest } = config as ExerciseConfig & { choices?: unknown };
  return stableStringify(rest);
}

/**
 * Generate exercises for a single module from its template config.
 * `exclude` holds the identities of the module's authored exercises: a
 * generated item that repeats one is skipped, so a session never serves the
 * same exercise twice (audit W4-19).
 */
export function generateExercises(
  config: ModuleTemplateConfig,
  seed?: number,
  lang: ContentLanguage = 'en',
  exclude: ReadonlySet<string> = new Set(),
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
    const built = buildConfig(template, rand, lang);
    if (!built) continue;
    const exerciseConfig = built.config;

    // Deduplication: create a key from the config to avoid identical exercises
    const dedupeKey = JSON.stringify(exerciseConfig);
    if (seenKeys.has(dedupeKey)) continue;
    seenKeys.add(dedupeKey);
    // …and never repeat one of the module's authored exercises (W4-19).
    const identity = exerciseIdentity(exerciseConfig);
    if (identity !== null && exclude.has(identity)) continue;

    const index = exercises.length + 1;
    const id = `${config.moduleId}g${index}`;

    exercises.push({
      id,
      type: template.type,
      prompt: fillTemplate(template.promptTemplate, exerciseConfig, lang, config.moduleId, built.tokens),
      config: exerciseConfig,
      hint: fillTemplate(template.hintTemplate, exerciseConfig, lang, config.moduleId, built.tokens),
    });
  }

  return exercises;
}

/**
 * Generate all exercises for a level's template configs. Returns moduleId →
 * exercises. Pass the level's authored exercises so generated items never
 * repeat them (W4-19).
 */
export function generateAllForLevel(
  configs: ModuleTemplateConfig[],
  lang: ContentLanguage = 'en',
  authored: Record<string, ExerciseDefinition[]> = {},
): Record<string, ExerciseDefinition[]> {
  const result: Record<string, ExerciseDefinition[]> = {};
  for (const config of configs) {
    const exclude = new Set<string>();
    for (const ex of authored[config.moduleId] ?? []) {
      const identity = exerciseIdentity(ex.config);
      if (identity !== null) exclude.add(identity);
    }
    const exercises = generateExercises(config, undefined, lang, exclude);
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
