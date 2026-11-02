/**
 * Audit W4-18 — every L9 objective the audit found unexercised either has an
 * exercise behind it or is no longer promised.
 *
 * For each objective claim below: if the module (or unit milestone) still
 * makes the claim in English, at least one exercise the module serves must
 * practise it (judged on the exercise config: what is played and what the
 * learner may answer). Claims that need an ear mode the app does not have
 * (inversion hearing, bass-line dictation) can only pass by being trimmed.
 */
import { describe, it, expect } from 'vitest';
import type { EarTrainingConfig, ExerciseConfig } from '../../../core/types/exercise';
import { EN_UNITS } from '../../../i18n/content/__tests__/overlayEntries';
import { levelCorpus, templatesFor } from './learnCorpus';

const ear = (c: ExerciseConfig): EarTrainingConfig | null => (c.type === 'ear_training' ? c : null);
const choiceScales = (c: ExerciseConfig) => {
  const e = ear(c);
  return e?.mode === 'scale' ? [e.scaleType] : [];
};

interface Claim { moduleId: string; claim: RegExp; evidence: (configs: ExerciseConfig[]) => boolean; what: string }

const CLAIMS: Claim[] = [
  { moduleId: 'l9u30m3', claim: /tritone/i, what: 'a tritone (6 semitones) is played', evidence: (cs) => cs.some((c) => ear(c)?.mode === 'interval' && ear(c)!.targetSemitones === 6) },
  { moduleId: 'l9u30m3', claim: /unison/i, what: 'a unison is played', evidence: (cs) => cs.some((c) => ear(c)?.mode === 'interval' && ear(c)!.targetSemitones === 0) },
  { moduleId: 'l9u30m5', claim: /compound/i, what: 'an interval wider than an octave is played', evidence: (cs) => cs.some((c) => ear(c)?.mode === 'interval' && (ear(c)!.targetSemitones ?? 0) > 12) },
  { moduleId: 'l9u31m1', claim: /melodic minor/i, what: 'a melodic-minor scale is played', evidence: (cs) => cs.flatMap(choiceScales).includes('melodic_minor') },
  {
    moduleId: 'l9u31m2', claim: /seven church modes/i, what: 'all seven modes are played',
    evidence: (cs) => {
      const heard = new Set(cs.flatMap(choiceScales).map((s) => ({ major: 'ionian', natural_minor: 'aeolian' }[s as string] ?? s)));
      return ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'].every((m) => heard.has(m));
    },
  },
  { moduleId: 'l9u31m3', claim: /diminished/i, what: 'a diminished scale is played', evidence: (cs) => cs.flatMap(choiceScales).some((s) => /^diminished/.test(s ?? '')) },
  { moduleId: 'l9u31m4', claim: /inversion/i, what: 'an inverted triad is played (no such ear mode)', evidence: () => false },
  { moduleId: 'l9u31m5', claim: /minor-major/i, what: 'a minor-major 7th is played', evidence: (cs) => cs.some((c) => ear(c)?.mode === 'chord' && ear(c)!.quality === 'minor_major7') },
  { moduleId: 'l9u32m3', claim: /bass line dictation/i, what: 'a bass line is dictated (no such ear mode)', evidence: () => false },
];

/**
 * Every ear config a module can serve: its served items (authored +
 * generated) plus one per value its ear templates can draw (each interval,
 * scale type and chord quality as the played target).
 */
function configs(moduleId: string): ExerciseConfig[] {
  const served = levelCorpus(9, 'en').filter((i) => i.moduleId === moduleId).map((i) => i.exercise.config);
  const space: ExerciseConfig[] = [];
  for (const t of templatesFor(9, 'en').find((c) => c.moduleId === moduleId)?.templates ?? []) {
    const p = t.params;
    if (t.type !== 'ear_training') continue;
    for (const s of p.intervals ?? []) space.push({ type: 'ear_training', mode: 'interval', root: 'C', targetSemitones: s });
    for (const scaleType of p.scaleTypes ?? []) space.push({ type: 'ear_training', mode: 'scale', root: 'C', scaleType });
    for (const quality of p.chordQualities ?? []) space.push({ type: 'ear_training', mode: 'chord', chordRoot: 'C', quality });
  }
  return [...served, ...space];
}

describe('L9 objectives have exercises behind them (W4-18)', () => {
  const modules = EN_UNITS[9].flatMap((u) => u.modules);

  for (const c of CLAIMS) {
    it(`${c.moduleId}: "${c.claim.source}" — claimed only if ${c.what}`, () => {
      const m = modules.find((x) => x.id === c.moduleId)!;
      const claimed = m.objectives.some((o) => c.claim.test(o));
      if (claimed) expect(c.evidence(configs(c.moduleId)), `objective promises it but no exercise does: ${m.objectives.join(' | ')}`).toBe(true);
    });
  }

  it('the unit milestone claims compound intervals only if l9u30m5 exercises them', () => {
    const unit = EN_UNITS[9].find((u) => u.modules.some((m) => m.id === 'l9u30m5'))!;
    const claimed = (unit.milestone?.skillsSummary ?? []).some((s) => /compound/i.test(s));
    if (claimed) expect(CLAIMS.find((c) => c.moduleId === 'l9u30m5')!.evidence(configs('l9u30m5'))).toBe(true);
  });
});
