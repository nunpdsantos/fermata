import { describe, it, expect } from 'vitest';
import { generateExercises, generateAllForLevel, mergeExerciseMaps } from '../exerciseGenerator';
import type { ModuleTemplateConfig } from '../exerciseTemplates';
import type { ExerciseDefinition } from '../../../core/types/exercise';
import templatesL1 from '../templatesL1';
import templatesL4 from '../templatesL4';
import templatesL6 from '../templatesL6';
import { buildScale } from '../../../core/constants/scales';
import { noteToString } from '../../../core/types/music';
import type { NaturalNote, Accidental, ScaleType } from '../../../core/types/music';
import { validateAnswer } from '../../../components/learn/exercises/validateExercise';

const SIMPLE_CONFIG: ModuleTemplateConfig = {
  moduleId: 'l1u1m1',
  targetCount: 5,
  templates: [
    {
      type: 'note_id',
      promptTemplate: 'Identify the note {root}',
      hintTemplate: 'This note is {root}',
      params: {
        roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        accidentals: ['', '', '', '', '', '', ''],
        octaves: [4],
      },
      points: 1,
    },
  ],
};

const SCALE_CONFIG: ModuleTemplateConfig = {
  moduleId: 'l1u3m1',
  targetCount: 3,
  templates: [
    {
      type: 'scale_build',
      promptTemplate: 'Build the {root} {scaleType} scale',
      hintTemplate: 'The {scaleType} scale has {root} as root',
      params: {
        roots: ['C', 'G', 'D', 'F', 'Bb'],
        accidentals: ['', '', '', '', 'b'],
        scaleTypes: ['major'],
        noteCounts: [7],
      },
      points: 2,
    },
  ],
};

describe('exerciseGenerator', () => {
  describe('generateExercises', () => {
    it('generates the requested number of exercises', () => {
      const exercises = generateExercises(SIMPLE_CONFIG);
      expect(exercises.length).toBe(5);
    });

    it('uses the correct ID format with g prefix', () => {
      const exercises = generateExercises(SIMPLE_CONFIG);
      expect(exercises[0].id).toBe('l1u1m1g1');
      expect(exercises[1].id).toBe('l1u1m1g2');
    });

    it('is deterministic with the same seed', () => {
      const a = generateExercises(SIMPLE_CONFIG, 42);
      const b = generateExercises(SIMPLE_CONFIG, 42);
      expect(a.map((e) => e.id)).toEqual(b.map((e) => e.id));
      expect(a.map((e) => e.prompt)).toEqual(b.map((e) => e.prompt));
    });

    it('produces different results with different seeds', () => {
      const a = generateExercises(SIMPLE_CONFIG, 42);
      const b = generateExercises(SIMPLE_CONFIG, 99);
      // At least some prompts should differ
      const aPrompts = a.map((e) => e.prompt);
      const bPrompts = b.map((e) => e.prompt);
      expect(aPrompts).not.toEqual(bPrompts);
    });

    it('fills template placeholders', () => {
      const exercises = generateExercises(SCALE_CONFIG);
      for (const ex of exercises) {
        expect(ex.prompt).not.toContain('{root}');
        expect(ex.prompt).not.toContain('{scaleType}');
        expect(ex.prompt).toContain('Build the');
        expect(ex.prompt).toContain('major scale');
      }
    });

    it('sets type correctly on generated exercises', () => {
      const exercises = generateExercises(SIMPLE_CONFIG);
      for (const ex of exercises) {
        expect(ex.type).toBe('note_id');
        expect(ex.config.type).toBe('note_id');
      }
    });

    it('assigns points from template', () => {
      const exercises = generateExercises(SCALE_CONFIG);
      for (const ex of exercises) {
        expect(ex.points).toBe(2);
      }
    });

    it('deduplicates configs', () => {
      // With only 2 possible configs, can't generate more than 2 unique
      const tinyConfig: ModuleTemplateConfig = {
        moduleId: 'test',
        targetCount: 10,
        templates: [{
          type: 'note_id',
          promptTemplate: 'Identify {root}',
          hintTemplate: 'This is {root}',
          params: { roots: ['C', 'D'], accidentals: ['', ''], octaves: [4] },
        }],
      };
      const exercises = generateExercises(tinyConfig, 1);
      // Should be at most 2 (deduped)
      expect(exercises.length).toBeLessThanOrEqual(2);
    });

    it('includes hint from template', () => {
      const exercises = generateExercises(SIMPLE_CONFIG);
      for (const ex of exercises) {
        expect(ex.hint).toBeDefined();
        expect(ex.hint).not.toContain('{root}');
      }
    });
  });

  describe('generateAllForLevel', () => {
    it('generates exercises for all configs', () => {
      const result = generateAllForLevel([SIMPLE_CONFIG, SCALE_CONFIG]);
      expect(Object.keys(result)).toEqual(['l1u1m1', 'l1u3m1']);
      expect(result['l1u1m1'].length).toBe(5);
      expect(result['l1u3m1'].length).toBe(3);
    });
  });

  describe('mergeExerciseMaps', () => {
    it('merges authored and generated exercises', () => {
      const authored: Record<string, ExerciseDefinition[]> = {
        l1u1m1: [{ id: 'l1u1m1e1', type: 'note_id', prompt: 'Hand-authored', config: { type: 'note_id', note: 'C', accidental: '', octave: 4 } }],
      };
      const generated: Record<string, ExerciseDefinition[]> = {
        l1u1m1: [{ id: 'l1u1m1g1', type: 'note_id', prompt: 'Generated', config: { type: 'note_id', note: 'D', accidental: '', octave: 4 } }],
        l1u1m2: [{ id: 'l1u1m2g1', type: 'note_id', prompt: 'New module', config: { type: 'note_id', note: 'E', accidental: '', octave: 4 } }],
      };

      const merged = mergeExerciseMaps(authored, generated);
      // Authored first, then generated
      expect(merged['l1u1m1'].length).toBe(2);
      expect(merged['l1u1m1'][0].id).toBe('l1u1m1e1');
      expect(merged['l1u1m1'][1].id).toBe('l1u1m1g1');
      // New module from generated
      expect(merged['l1u1m2'].length).toBe(1);
    });
  });

  // ── WS5 A2 regression guard ──────────────────────────────────────────────
  // Counterpoint generation templates must key ONLY to the counterpoint module
  // (l4u14m1 = "First and Second Species Counterpoint"). They were previously
  // mis-mapped onto l4u14m2 (Asymmetric Meters), m3 (Chromatic Embellishment),
  // m4 (Roman Numeral Analysis), and m5 (Minor Key Harmony) per curriculumL4.ts.
  describe('L4 Unit 14 counterpoint template mapping (WS5 A2)', () => {
    const configById = (id: string) => templatesL4.find((c) => c.moduleId === id);

    const mentionsSpeciesCounterpoint = (cfg: ModuleTemplateConfig | undefined) =>
      !!cfg &&
      cfg.templates.some((t) =>
        /species counterpoint/i.test(t.promptTemplate) || /species counterpoint/i.test(t.hintTemplate),
      );

    it('keys species-counterpoint templates to l4u14m1', () => {
      const m1 = configById('l4u14m1');
      expect(m1, 'l4u14m1 template config should exist').toBeTruthy();
      expect(mentionsSpeciesCounterpoint(m1)).toBe(true);
    });

    it('does not key any counterpoint template to the non-counterpoint u14 modules', () => {
      for (const id of ['l4u14m2', 'l4u14m3', 'l4u14m4', 'l4u14m5']) {
        expect(mentionsSpeciesCounterpoint(configById(id)), `${id} must not carry counterpoint templates`).toBe(false);
      }
    });

    it('generates only on-topic (non-counterpoint) prompts for the chromatic/RN/minor modules', () => {
      const generated = generateAllForLevel(templatesL4);
      for (const id of ['l4u14m2', 'l4u14m3', 'l4u14m4', 'l4u14m5']) {
        for (const ex of generated[id] ?? []) {
          expect(ex.prompt, `${id} generated a counterpoint prompt`).not.toMatch(/species counterpoint/i);
        }
      }
    });
  });

  // ── WS6 T1 regression guard ──────────────────────────────────────────────
  // templatesL6 l6u18m1/l6u18m3 prompts use '{root}{accidental}', but
  // fillTemplate renders the accidental as part of {root} (e.g. 'Gb') and had
  // no 'accidental' replacement — learners saw literal
  // 'Build a Gb{accidental} major triad'. fillTemplate must strip the legacy
  // {accidental} token so no generated prompt/hint carries an unreplaced token.
  describe('L6 leftover-token rendering (WS6 T1)', () => {
    it('generates l6u18m1 exercises and leaves no unreplaced {token} in any L6 EN prompt or hint', () => {
      const generated = generateAllForLevel(templatesL6, 'en');
      expect(generated['l6u18m1']?.length, 'l6u18m1 should generate exercises').toBeGreaterThan(0);

      for (const exercises of Object.values(generated)) {
        for (const ex of exercises) {
          expect(ex.prompt, `${ex.id} prompt contains an unreplaced token: "${ex.prompt}"`).not.toContain('{');
          expect(ex.hint ?? '', `${ex.id} hint contains an unreplaced token: "${ex.hint}"`).not.toContain('{');
        }
      }
    });
  });

  // ── WS5 A6 regression guard ──────────────────────────────────────────────
  // The generated l1u3m1 scale_degree_id drill was unanswerable: it never named
  // a note in the prompt and computed a RANDOM correctDegree unrelated to any
  // note. The fix resolves the chosen degree to the real note in the built scale,
  // names it in the prompt, and makes correctDegree match that note's position.
  describe('L1 generated scale_degree_id answerability (WS5 A6)', () => {
    const l1u3m1 = templatesL1.find((c) => c.moduleId === 'l1u3m1');

    it('l1u3m1 still defines a scale_degree_id template', () => {
      expect(l1u3m1, 'l1u3m1 template config should exist').toBeTruthy();
      expect(
        l1u3m1!.templates.some((t) => t.type === 'scale_degree_id'),
        'l1u3m1 should carry a scale_degree_id template',
      ).toBe(true);
    });

    it('every generated scale_degree_id item names a real scale note whose correctDegree is its position, and grades correctly', () => {
      const exercises = generateExercises(l1u3m1!);
      const degreeItems = exercises.filter((e) => e.config.type === 'scale_degree_id');
      expect(degreeItems.length, 'expected at least one generated scale_degree_id item').toBeGreaterThan(0);

      for (const ex of degreeItems) {
        const cfg = ex.config;
        if (cfg.type !== 'scale_degree_id') continue;

        // No unresolved placeholders, and the named note appears in the prompt.
        const noteName = noteToString({
          natural: cfg.note as NaturalNote,
          accidental: (cfg.noteAccidental || '') as Accidental,
        });
        expect(ex.prompt, `${ex.id} left an unresolved {note} token`).not.toContain('{note}');
        expect(ex.prompt, `${ex.id} left an unresolved {root} token`).not.toContain('{root}');
        expect(ex.prompt, `${ex.id} does not name the note to identify`).toContain(noteName);

        // correctDegree must be the note's true 1-based position in the built scale.
        const scale = buildScale(
          { natural: cfg.root as NaturalNote, accidental: (cfg.rootAccidental || '') as Accidental },
          cfg.scaleType as ScaleType,
        );
        const realIndex = scale.notes.findIndex(
          (n) => n.natural === cfg.note && n.accidental === cfg.noteAccidental,
        );
        expect(realIndex, `${ex.id}: note ${noteName} not found in ${cfg.root} ${cfg.scaleType}`).toBeGreaterThanOrEqual(0);
        expect(cfg.correctDegree, `${ex.id}: correctDegree mismatch`).toBe(realIndex + 1);

        // validateAnswer accepts the keyed degree and rejects a different one.
        expect(validateAnswer(cfg, String(cfg.correctDegree)).correct).toBe(true);
        const wrongDegree = cfg.correctDegree === 1 ? 2 : 1;
        expect(validateAnswer(cfg, String(wrongDegree)).correct).toBe(false);
      }
    });
  });
});
