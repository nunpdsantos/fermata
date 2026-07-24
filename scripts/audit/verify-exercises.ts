/**
 * Phase 2 — hand-authored exercise correctness.
 *
 * For each exercise declared in exercisesL1-9.ts:
 *   1. Parse config.
 *   2. Derive the "correct" answer from the engine.
 *   3. Pass that derived answer back through validateAnswer().
 *   4. Any exercise whose declared-correct answer FAILS the validator
 *      has a bug in either the exercise or the validator.
 *
 * Run: npx tsx scripts/audit/verify-exercises.ts
 */

import type { ExerciseDefinition, ExerciseConfig } from '../../src/core/types/exercise';
import type { Note, NaturalNote, Accidental, ScaleType, ChordQuality } from '../../src/core/types/music';
import { buildScale } from '../../src/core/constants/scales';
import { buildChord, CHORD_FORMULAS } from '../../src/core/constants/chords';
import { SCALE_FORMULAS } from '../../src/core/constants/scales';
import { getPitchClass } from '../../src/core/constants/notes';
import { validateAnswer } from '../../src/components/learn/exercises/validateExercise';

// Dynamic import so script doesn't need to compile the entire module graph
async function loadAll(): Promise<Record<string, ExerciseDefinition[]>[]> {
  const results: Record<string, ExerciseDefinition[]>[] = [];
  for (let lvl = 1; lvl <= 9; lvl++) {
    const mod = await import(`../../src/data/exercises/exercisesL${lvl}.ts`);
    results.push(mod.default);
  }
  return results;
}

type Finding = {
  level: number;
  moduleId: string;
  exerciseId: string;
  type: string;
  problem: string;
  prompt: string;
};

const findings: Finding[] = [];
let totalCount = 0;

function toNote(natural: string, accidental: string): Note {
  return { natural: natural as NaturalNote, accidental: accidental as Accidental };
}

function deriveCorrect(cfg: ExerciseConfig): string | Set<number> | null {
  switch (cfg.type) {
    case 'note_id':
      return cfg.note + (cfg.accidental ?? '');
    case 'interval_id':
      return String(cfg.targetSemitones);
    case 'scale_build': {
      const root = toNote(cfg.root, cfg.rootAccidental);
      const scale = buildScale(root, cfg.scaleType as ScaleType);
      return new Set(scale.notes.map(n => getPitchClass(n) as number));
    }
    case 'chord_build': {
      const root = toNote(cfg.root, cfg.rootAccidental);
      const chord = buildChord(root, cfg.quality as ChordQuality);
      return new Set(chord.notes.map(n => getPitchClass(n) as number));
    }
    case 'multiple_choice': {
      const correct = cfg.choices.find(c => c.correct);
      return correct?.label ?? null;
    }
    case 'ear_training': {
      if (cfg.mode === 'note' && cfg.note) return cfg.note + (cfg.accidental ?? '');
      if (cfg.mode === 'interval' && cfg.targetSemitones !== undefined) return String(cfg.targetSemitones);
      if ((cfg.mode === 'chord' || cfg.mode === 'scale' || cfg.mode === 'progression') && cfg.choices) {
        const correct = cfg.choices.find(c => c.correct);
        return correct?.label ?? null;
      }
      return null;
    }
    case 'scale_degree_id':
      return String(cfg.correctDegree);
  }
}

(async () => {
  const all = await loadAll();

  for (let lvl = 1; lvl <= 9; lvl++) {
    const levelExercises = all[lvl - 1];
    for (const [moduleId, list] of Object.entries(levelExercises)) {
      for (const ex of list) {
        totalCount++;
        const correct = deriveCorrect(ex.config);
        if (correct === null) {
          findings.push({ level: lvl, moduleId, exerciseId: ex.id, type: ex.type, problem: 'no correct answer derivable', prompt: ex.prompt.slice(0, 80) });
          continue;
        }
        const result = validateAnswer(ex.config, correct);
        if (!result.correct) {
          findings.push({
            level: lvl, moduleId, exerciseId: ex.id, type: ex.type,
            problem: `validator rejected its own correct answer: "${result.explanation}"`,
            prompt: ex.prompt.slice(0, 80),
          });
        }

        // Additional sanity: scale_build noteCount vs formula length
        if (ex.config.type === 'scale_build') {
          const formula = SCALE_FORMULAS[ex.config.scaleType as ScaleType];
          if (!formula) {
            findings.push({
              level: lvl, moduleId, exerciseId: ex.id, type: ex.type,
              problem: `unknown scaleType '${ex.config.scaleType}'`, prompt: ex.prompt.slice(0, 80),
            });
            continue;
          }
          const uniquePCs = new Set(formula.map(st => st % 12)).size;
          if (ex.config.noteCount !== uniquePCs && ex.config.noteCount !== formula.length) {
            findings.push({
              level: lvl, moduleId, exerciseId: ex.id, type: ex.type,
              problem: `noteCount=${ex.config.noteCount} but scale has ${uniquePCs} unique PCs / ${formula.length} notes`,
              prompt: ex.prompt.slice(0, 80),
            });
          }
        }

        if (ex.config.type === 'chord_build') {
          const formula = CHORD_FORMULAS[ex.config.quality as ChordQuality];
          if (!formula) {
            findings.push({ level: lvl, moduleId, exerciseId: ex.id, type: ex.type, problem: `unknown quality '${ex.config.quality}'`, prompt: ex.prompt.slice(0, 80) });
            continue;
          }
          const uniquePCs = new Set(formula.map(st => st % 12)).size;
          if (ex.config.noteCount !== uniquePCs && ex.config.noteCount !== formula.length) {
            findings.push({
              level: lvl, moduleId, exerciseId: ex.id, type: ex.type,
              problem: `noteCount=${ex.config.noteCount} but chord has ${uniquePCs} unique PCs / ${formula.length} notes`,
              prompt: ex.prompt.slice(0, 80),
            });
          }
        }

        // multiple_choice: exactly one correct answer required
        if (ex.config.type === 'multiple_choice') {
          const corrCount = ex.config.choices.filter(c => c.correct).length;
          if (corrCount !== 1) {
            findings.push({
              level: lvl, moduleId, exerciseId: ex.id, type: ex.type,
              problem: `${corrCount} correct answers in multiple_choice (expected exactly 1)`,
              prompt: ex.prompt.slice(0, 80),
            });
          }
          // duplicate labels
          const labels = new Set(ex.config.choices.map(c => c.label));
          if (labels.size !== ex.config.choices.length) {
            findings.push({
              level: lvl, moduleId, exerciseId: ex.id, type: ex.type,
              problem: `duplicate choice labels`,
              prompt: ex.prompt.slice(0, 80),
            });
          }
        }

        // ear_training choice-mode sanity: choices exist, exactly one correct,
        // and the correct label semantically matches the played material.
        if (ex.config.type === 'ear_training' && ['chord', 'scale', 'progression'].includes(ex.config.mode)) {
          const cfg = ex.config;
          if (!cfg.choices) {
            findings.push({
              level: lvl, moduleId, exerciseId: ex.id, type: ex.type,
              problem: `ear_training ${cfg.mode} mode missing 'choices'`,
              prompt: ex.prompt.slice(0, 80),
            });
          } else {
            const correct = cfg.choices.filter(c => c.correct);
            const norm = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '');
            let problem: string | null = null;
            if (correct.length !== 1) {
              problem = `expected exactly one correct choice, got ${correct.length}`;
            } else if (cfg.mode === 'chord' && cfg.quality && norm(correct[0].label) !== norm(cfg.quality)) {
              problem = `correct label '${correct[0].label}' does not match quality '${cfg.quality}'`;
            } else if (cfg.mode === 'scale' && cfg.scaleType && norm(correct[0].label) !== norm(cfg.scaleType)) {
              problem = `correct label '${correct[0].label}' does not match scaleType '${cfg.scaleType}'`;
            } else if (cfg.mode === 'progression' && cfg.progression && correct[0].label !== cfg.progression.join(' - ')) {
              problem = `correct label '${correct[0].label}' does not match progression '${cfg.progression.join(' - ')}'`;
            }
            if (problem) {
              findings.push({
                level: lvl, moduleId, exerciseId: ex.id, type: ex.type,
                problem, prompt: ex.prompt.slice(0, 80),
              });
            }
          }
        }

        // scale_degree_id correctness: the note declared in config.note/noteAccidental
        // should actually be the Nth note of the scale at root + scaleType
        if (ex.config.type === 'scale_degree_id') {
          const root = toNote(ex.config.root, ex.config.rootAccidental);
          try {
            const scale = buildScale(root, ex.config.scaleType as ScaleType);
            const idx = ex.config.correctDegree - 1;
            const expectedNote = scale.notes[idx];
            if (!expectedNote) {
              findings.push({
                level: lvl, moduleId, exerciseId: ex.id, type: ex.type,
                problem: `scale has no degree ${ex.config.correctDegree}`,
                prompt: ex.prompt.slice(0, 80),
              });
            } else {
              const declaredNote = toNote(ex.config.note, ex.config.noteAccidental);
              if (getPitchClass(declaredNote) !== getPitchClass(expectedNote)) {
                findings.push({
                  level: lvl, moduleId, exerciseId: ex.id, type: ex.type,
                  problem: `degree ${ex.config.correctDegree} of ${ex.config.root}${ex.config.rootAccidental} ${ex.config.scaleType} is ${expectedNote.natural}${expectedNote.accidental} (pc ${getPitchClass(expectedNote)}), but declared note is ${ex.config.note}${ex.config.noteAccidental} (pc ${getPitchClass(declaredNote)})`,
                  prompt: ex.prompt.slice(0, 80),
                });
              }
            }
          } catch (e) {
            findings.push({ level: lvl, moduleId, exerciseId: ex.id, type: ex.type, problem: `buildScale error: ${(e as Error).message}`, prompt: ex.prompt.slice(0, 80) });
          }
        }
      }
    }
  }

  console.log(`Total exercises scanned: ${totalCount}`);
  console.log(`Findings: ${findings.length}\n`);
  const byLevel = new Map<number, Finding[]>();
  for (const f of findings) {
    byLevel.set(f.level, (byLevel.get(f.level) ?? []).concat(f));
  }
  for (let lvl = 1; lvl <= 9; lvl++) {
    const list = byLevel.get(lvl) ?? [];
    if (!list.length) continue;
    console.log(`--- L${lvl} (${list.length}) ---`);
    for (const f of list) {
      console.log(`  ${f.exerciseId} [${f.type}] (${f.moduleId}): ${f.problem}`);
      console.log(`    "${f.prompt}"`);
    }
    console.log();
  }
})();
