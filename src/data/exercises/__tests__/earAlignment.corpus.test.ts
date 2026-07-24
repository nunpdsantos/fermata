/**
 * Corpus-level invariant (F-03): any exercise whose prompt asks the learner
 * to LISTEN must actually be an ear_training exercise — the only type that
 * plays audio. Guards against "listen" prompts backed by silent visual tasks.
 *
 * Coverage: English across all nine levels, plus Portuguese and Spanish for
 * Level 9 (the dedicated ear-training level).
 */
import { describe, it, expect } from 'vitest';
import { generateAllForLevel, mergeExerciseMaps } from '../exerciseGenerator';
import { applyExerciseOverlay, applyTemplateOverlay } from '../../../i18n/content/contentResolver';
import type { ExerciseDefinition } from '../../../core/types/exercise';
import type { ContentLanguage } from '../../../i18n/content/types';

import exercisesL1 from '../exercisesL1';
import exercisesL2 from '../exercisesL2';
import exercisesL3 from '../exercisesL3';
import exercisesL4 from '../exercisesL4';
import exercisesL5 from '../exercisesL5';
import exercisesL6 from '../exercisesL6';
import exercisesL7 from '../exercisesL7';
import exercisesL8 from '../exercisesL8';
import exercisesL9 from '../exercisesL9';
import templatesL1 from '../templatesL1';
import templatesL2 from '../templatesL2';
import templatesL3 from '../templatesL3';
import templatesL4 from '../templatesL4';
import templatesL5 from '../templatesL5';
import templatesL6 from '../templatesL6';
import templatesL7 from '../templatesL7';
import templatesL8 from '../templatesL8';
import templatesL9 from '../templatesL9';
import ptExercisesL9 from '../../../i18n/content/pt/exercisesL9';
import ptTemplatesL9 from '../../../i18n/content/pt/templatesL9';
import esExercisesL9 from '../../../i18n/content/es/exercisesL9';
import esTemplatesL9 from '../../../i18n/content/es/templatesL9';

const AUTHORED = [exercisesL1, exercisesL2, exercisesL3, exercisesL4, exercisesL5, exercisesL6, exercisesL7, exercisesL8, exercisesL9];
const TEMPLATES = [templatesL1, templatesL2, templatesL3, templatesL4, templatesL5, templatesL6, templatesL7, templatesL8, templatesL9];

// "sound(s)" is excluded deliberately: prose like "it sounds bright" describes
// character; the enforceable claim is an instruction to listen/hear.
const LISTEN_WORDS: Record<ContentLanguage, RegExp> = {
  en: /\b(listen|hear|hearing|by ear|you hear)\b/i,
  pt: /\b(ouve|ouves|ouvir|escuta|de ouvido)\b/i,
  es: /\b(escucha|escuchas|oye|oyes|de oído)\b/i,
};

function flatten(map: Record<string, ExerciseDefinition[]>): ExerciseDefinition[] {
  return Object.values(map).flat();
}

function violations(exercises: ExerciseDefinition[], lang: ContentLanguage): string[] {
  return exercises
    .filter((ex) => LISTEN_WORDS[lang].test(ex.prompt) && ex.config.type !== 'ear_training')
    .map((ex) => `${ex.id} [${ex.config.type}]: ${ex.prompt}`);
}

describe('listen-prompt / ear_training alignment (corpus)', () => {
  it('EN: every listening prompt across all levels is a real ear_training exercise', () => {
    const found: string[] = [];
    for (let i = 0; i < 9; i++) {
      const merged = mergeExerciseMaps(AUTHORED[i], generateAllForLevel(TEMPLATES[i], 'en'));
      found.push(...violations(flatten(merged), 'en'));
    }
    expect(found, `non-audio exercises claiming to be auditory:\n${found.join('\n')}`).toEqual([]);
  });

  it('L9 contains a substantial ear_training corpus in every mode', () => {
    const merged = mergeExerciseMaps(exercisesL9, generateAllForLevel(templatesL9, 'en'));
    const ears = flatten(merged).filter((ex) => ex.config.type === 'ear_training');
    expect(ears.length).toBeGreaterThan(50);
    const modes = new Set(ears.map((ex) => (ex.config.type === 'ear_training' ? ex.config.mode : '')));
    expect([...modes].sort()).toEqual(['chord', 'interval', 'note', 'progression', 'scale']);
  });

  it('PT: Level 9 listening prompts are all ear_training', () => {
    const authored = applyExerciseOverlay(exercisesL9, ptExercisesL9);
    const generated = generateAllForLevel(applyTemplateOverlay(templatesL9, ptTemplatesL9), 'pt');
    const found = violations(flatten(mergeExerciseMaps(authored, generated)), 'pt');
    expect(found, found.join('\n')).toEqual([]);
  });

  it('ES: Level 9 listening prompts are all ear_training', () => {
    const authored = applyExerciseOverlay(exercisesL9, esExercisesL9);
    const generated = generateAllForLevel(applyTemplateOverlay(templatesL9, esTemplatesL9), 'es');
    const found = violations(flatten(mergeExerciseMaps(authored, generated)), 'es');
    expect(found, found.join('\n')).toEqual([]);
  });
});
