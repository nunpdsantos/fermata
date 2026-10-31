/**
 * Audit W4-19 — the same exercise never appears twice in one session.
 *
 * A module's session is its authored items plus its generated ones. The
 * generator only removed duplicates among its own items, so 25 generated items
 * repeated an authored one (e.g. l1u3m4g5 = l1u3m4e1, "Build C major"). The
 * generator now skips any item whose language-neutral identity (config minus
 * answer labels) matches an authored item of the module, in every language,
 * so generated ids stay aligned across EN/PT/ES.
 */
import { describe, it, expect } from 'vitest';
import type { ExerciseConfig } from '../../../core/types/exercise';
import { exerciseIdentity, generateExercises } from '../exerciseGenerator';
import { CONTENT_LANGS, LEVELS, levelCorpus } from './learnCorpus';

/** Independent identity: the config's own fields, labels dropped, keys sorted. */
function oracleIdentity(c: ExerciseConfig): string {
  const o = { ...(c as unknown as Record<string, unknown>) };
  delete o.choices;
  return JSON.stringify(Object.keys(o).sort().reduce<Record<string, unknown>>((acc, k) => ({ ...acc, [k]: o[k] }), {}));
}

describe('no exercise twice in a session (W4-19)', () => {
  for (const lang of CONTENT_LANGS) {
    it(`${lang}: no generated item repeats an authored item of its module`, () => {
      const repeats: string[] = [];
      for (const n of LEVELS) {
        const items = levelCorpus(n, lang);
        const byModule = new Map<string, typeof items>();
        for (const it of items) byModule.set(it.moduleId, [...(byModule.get(it.moduleId) ?? []), it]);
        for (const [, list] of byModule) {
          const authored = list.filter((i) => i.source === 'authored');
          for (const g of list.filter((i) => i.source === 'generated')) {
            for (const a of authored) {
              const gc = g.exercise.config;
              const ac = a.exercise.config;
              if (gc.type === 'multiple_choice' && ac.type === 'multiple_choice') {
                // MC: same correct answer = same question.
                if (gc.choices.find((c) => c.correct)?.label === ac.choices.find((c) => c.correct)?.label) {
                  repeats.push(`${a.exercise.id} = ${g.exercise.id}`);
                }
              } else if (gc.type !== 'multiple_choice' && ac.type !== 'multiple_choice' && oracleIdentity(gc) === oracleIdentity(ac)) {
                repeats.push(`${a.exercise.id} = ${g.exercise.id}`);
              }
            }
          }
        }
      }
      expect(repeats).toEqual([]);
    });
  }

  it('generated ids and configs (labels aside) are identical in EN, PT and ES', () => {
    const drift: string[] = [];
    for (const n of LEVELS) {
      const sig = (lang: (typeof CONTENT_LANGS)[number]) =>
        levelCorpus(n, lang)
          .filter((i) => i.source === 'generated')
          .map((i) => `${i.exercise.id}:${exerciseIdentity(i.exercise.config) ?? `mc${(i.exercise.config as { choices: unknown[] }).choices.length}`}`);
      const en = sig('en');
      for (const lang of ['pt', 'es'] as const) {
        const other = sig(lang);
        if (JSON.stringify(other) !== JSON.stringify(en)) drift.push(`L${n} ${lang}`);
      }
    }
    expect(drift).toEqual([]);
  });

  it('the generator skips an excluded identity and still fills the module', () => {
    const cfg = {
      moduleId: 'w419',
      targetCount: 3,
      templates: [{ type: 'chord_build' as const, promptTemplate: 'Build {root} {quality}.', hintTemplate: '', params: { roots: ['C', 'G', 'D', 'F'], chordQualities: ['major'], noteCounts: [3] } }],
    };
    const all = generateExercises(cfg, 7, 'en');
    const banned = exerciseIdentity(all[0].config)!;
    const without = generateExercises(cfg, 7, 'en', new Set([banned]));
    expect(without.map((e) => exerciseIdentity(e.config))).not.toContain(banned);
    expect(without).toHaveLength(3);
  });
});
