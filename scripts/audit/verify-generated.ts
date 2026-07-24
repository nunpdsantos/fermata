/**
 * Phase 3 — generated-exercise correctness.
 *
 * For each template in templatesL1-9.ts, enumerate EVERY valid (root × scale/chord × degree × direction)
 * combination and run it through validateAnswer() with the derived "correct" answer. Report mismatches.
 *
 * Also inspect generated prompts for musically-dubious strings (e.g., "Bbb major" for real exercise flow).
 *
 * Run: npx tsx scripts/audit/verify-generated.ts
 */

import type { ModuleTemplateConfig } from '../../src/data/exercises/exerciseTemplates';
import type { ExerciseConfig } from '../../src/core/types/exercise';
import type { Note, NaturalNote, Accidental, ScaleType, ChordQuality } from '../../src/core/types/music';
import { buildScale, SCALE_FORMULAS } from '../../src/core/constants/scales';
import { buildChord, CHORD_FORMULAS } from '../../src/core/constants/chords';
import { getPitchClass } from '../../src/core/constants/notes';
import { validateAnswer } from '../../src/components/learn/exercises/validateExercise';

type Finding = {
  level: number;
  moduleId: string;
  templateIdx: number;
  type: string;
  problem: string;
  promptPreview?: string;
};

const findings: Finding[] = [];
let totalCombos = 0;

function toNote(n: string, a: string): Note {
  return { natural: n as NaturalNote, accidental: a as Accidental };
}

function deriveCorrect(cfg: ExerciseConfig): string | Set<number> | null {
  switch (cfg.type) {
    case 'note_id':
      return cfg.note + (cfg.accidental ?? '');
    case 'interval_id':
      return String(cfg.targetSemitones);
    case 'scale_build': {
      const scale = buildScale(toNote(cfg.root, cfg.rootAccidental), cfg.scaleType as ScaleType);
      return new Set(scale.notes.map(n => getPitchClass(n) as number));
    }
    case 'chord_build': {
      const chord = buildChord(toNote(cfg.root, cfg.rootAccidental), cfg.quality as ChordQuality);
      return new Set(chord.notes.map(n => getPitchClass(n) as number));
    }
    case 'multiple_choice': {
      const c = cfg.choices.find(x => x.correct);
      return c?.label ?? null;
    }
    case 'ear_training': {
      if (cfg.mode === 'note' && cfg.note) return cfg.note + (cfg.accidental ?? '');
      if (cfg.mode === 'interval' && cfg.targetSemitones !== undefined) return String(cfg.targetSemitones);
      if ((cfg.mode === 'chord' || cfg.mode === 'scale' || cfg.mode === 'progression') && cfg.choices) {
        return cfg.choices.find(c => c.correct)?.label ?? null;
      }
      return null;
    }
    case 'scale_degree_id':
      return String(cfg.correctDegree);
  }
}

(async () => {
  for (let lvl = 1; lvl <= 9; lvl++) {
    const mod = await import(`../../src/data/exercises/templatesL${lvl}.ts`);
    const configs: ModuleTemplateConfig[] = mod.default ?? [];

    for (const modCfg of configs) {
      for (let ti = 0; ti < modCfg.templates.length; ti++) {
        const tpl = modCfg.templates[ti];
        const p = tpl.params;

        // Enumerate the cross-product and send to buildConfig-equivalent
        const roots = p.roots ?? ['C'];
        const accs = p.accidentals ?? roots.map(() => '');
        const octaves = p.octaves ?? [4];
        const scales = p.scaleTypes ?? ['major'];
        const chords = p.chordQualities ?? ['major'];
        const intervals = p.intervals ?? [7];
        const dirs = p.directions ?? ['ascending'];
        const degrees = p.degrees ?? [1];
        // Match generator defaults: scale_build→7, chord_build→3
        const noteCounts = p.noteCounts ?? (tpl.type === 'scale_build' ? [7] : tpl.type === 'chord_build' ? [3] : [0]);

        const record = (problem: string, promptPreview?: string) =>
          findings.push({ level: lvl, moduleId: modCfg.moduleId, templateIdx: ti, type: tpl.type, problem, promptPreview });

        if (tpl.type === 'note_id') {
          for (let i = 0; i < roots.length; i++) {
            for (const oc of octaves) {
              totalCombos++;
              const cfg: ExerciseConfig = { type: 'note_id', note: roots[i], accidental: accs[i] ?? '', octave: oc };
              const correct = deriveCorrect(cfg)!;
              const r = validateAnswer(cfg, correct);
              if (!r.correct) record(`validator rejected derived correct: ${r.explanation}`);
            }
          }
        } else if (tpl.type === 'interval_id') {
          for (let i = 0; i < roots.length; i++) {
            for (const st of intervals) {
              for (const d of dirs) {
                for (const oc of octaves) {
                  totalCombos++;
                  const cfg: ExerciseConfig = { type: 'interval_id', root: roots[i], rootAccidental: accs[i] ?? '', rootOctave: oc, targetSemitones: st, direction: d };
                  const correct = deriveCorrect(cfg)!;
                  const r = validateAnswer(cfg, correct);
                  if (!r.correct) record(`validator rejected derived correct: ${r.explanation}`);
                }
              }
            }
          }
        } else if (tpl.type === 'scale_build') {
          // Generator pairs scaleType with noteCount by scale index when lengths match
          const pairNoteCountByScale = scales.length === noteCounts.length;
          for (let i = 0; i < roots.length; i++) {
            for (let si = 0; si < scales.length; si++) {
              const sc = scales[si];
              const nc = pairNoteCountByScale ? noteCounts[si] : noteCounts[0];
              totalCombos++;
              const cfg: ExerciseConfig = { type: 'scale_build', root: roots[i], rootAccidental: accs[i] ?? '', scaleType: sc, noteCount: nc };
              if (!SCALE_FORMULAS[sc as ScaleType]) { record(`unknown scaleType '${sc}'`); continue; }
              const correct = deriveCorrect(cfg);
              if (correct === null) { record(`no correct derivable`); continue; }
              const r = validateAnswer(cfg, correct);
              if (!r.correct) record(`validator rejected derived correct for ${roots[i]}${accs[i] ?? ''} ${sc} (nc=${nc}): ${r.explanation}`);
              // noteCount sanity
              const formula = SCALE_FORMULAS[sc as ScaleType];
              if (formula) {
                const uniq = new Set(formula.map(x => x % 12)).size;
                if (nc !== uniq && nc !== formula.length) {
                  record(`displayed noteCount=${nc} but ${sc} has ${uniq} unique PCs / ${formula.length} notes (prompt tpl: "${tpl.promptTemplate.slice(0,60)}")`);
                }
              }
            }
          }
        } else if (tpl.type === 'chord_build') {
          // Generator: if roots.length === qualities.length, pair by root index;
          // otherwise picks quality randomly. noteCount is independently picked.
          const pairQualityByRoot = roots.length === chords.length;
          for (let i = 0; i < roots.length; i++) {
            const qSet = pairQualityByRoot ? [chords[i]] : chords;
            for (const q of qSet) {
              for (const nc of noteCounts) {
                totalCombos++;
                const cfg: ExerciseConfig = { type: 'chord_build', root: roots[i], rootAccidental: accs[i] ?? '', quality: q, noteCount: nc };
                if (!CHORD_FORMULAS[q as ChordQuality]) { record(`unknown quality '${q}'`); continue; }
                const correct = deriveCorrect(cfg);
                if (correct === null) { record('no correct derivable'); continue; }
                const r = validateAnswer(cfg, correct);
                if (!r.correct) record(`validator rejected derived correct for ${roots[i]}${accs[i] ?? ''} ${q} (nc=${nc}): ${r.explanation}`);
                const formula = CHORD_FORMULAS[q as ChordQuality];
                if (formula) {
                  const uniq = new Set(formula.map(x => x % 12)).size;
                  if (nc !== uniq && nc !== formula.length) {
                    record(`displayed noteCount=${nc} but ${q} has ${uniq} unique PCs / ${formula.length} notes (prompt tpl: "${tpl.promptTemplate.slice(0,60)}")`);
                  }
                }
              }
            }
          }
        } else if (tpl.type === 'multiple_choice') {
          if (!p.choiceSets?.length) { record('multiple_choice template has no choiceSets'); continue; }
          for (let ci = 0; ci < p.choiceSets.length; ci++) {
            totalCombos++;
            const choices = p.choiceSets[ci];
            const corr = choices.filter(c => c.correct).length;
            if (corr !== 1) record(`choiceSet[${ci}] has ${corr} correct (expected 1)`);
            const labs = new Set(choices.map(c => c.label));
            if (labs.size !== choices.length) record(`choiceSet[${ci}] has duplicate labels`);
            const cfg: ExerciseConfig = { type: 'multiple_choice', choices };
            const correct = deriveCorrect(cfg);
            if (correct === null) { record(`choiceSet[${ci}]: no correct`); continue; }
            const r = validateAnswer(cfg, correct);
            if (!r.correct) record(`validator rejected derived correct for choiceSet[${ci}]: ${r.explanation}`);
          }
        } else if (tpl.type === 'scale_degree_id') {
          for (let i = 0; i < roots.length; i++) {
            for (const sc of scales) {
              for (const d of degrees) {
                totalCombos++;
                const cfg: ExerciseConfig = { type: 'scale_degree_id', root: roots[i], rootAccidental: accs[i] ?? '', scaleType: sc, note: roots[i], noteAccidental: accs[i] ?? '', correctDegree: d };
                if (!SCALE_FORMULAS[sc as ScaleType]) { record(`unknown scaleType '${sc}'`); continue; }
                // The note in config is a placeholder — skip pc comparison.
                const correct = deriveCorrect(cfg);
                if (correct === null) { record('no correct derivable'); continue; }
                const r = validateAnswer(cfg, correct);
                if (!r.correct) record(`validator rejected derived correct: ${r.explanation}`);
                // Dubious: if the scale doesn't have `d` notes
                const formula = SCALE_FORMULAS[sc as ScaleType];
                if (formula && d > formula.length) {
                  record(`scaleType '${sc}' has ${formula.length} notes but template asks for degree ${d}`);
                }
              }
            }
          }
        }
      }
    }
  }

  console.log(`Total template combinations enumerated: ${totalCombos}`);
  console.log(`Findings: ${findings.length}\n`);
  const byLevel = new Map<number, Finding[]>();
  for (const f of findings) byLevel.set(f.level, (byLevel.get(f.level) ?? []).concat(f));
  for (let lvl = 1; lvl <= 9; lvl++) {
    const list = byLevel.get(lvl) ?? [];
    if (!list.length) continue;
    console.log(`--- L${lvl} (${list.length}) ---`);
    for (const f of list) {
      console.log(`  [${f.moduleId}] template[${f.templateIdx}] ${f.type}: ${f.problem}`);
    }
    console.log();
  }
})();
