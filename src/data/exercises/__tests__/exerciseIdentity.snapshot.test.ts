/**
 * Gate (W4a follow-up): an exercise id keeps meaning the same exercise.
 *
 * Saved per-exercise scores are keyed by exercise id. When a content edit
 * changes the exercise behind an id (a template re-keyed, a question or its
 * right answer rewritten, a generated item shifted or dropped), the saved
 * score must be retired, or it attaches to a different exercise. This test
 * compares every served exercise's identity with the recorded snapshot and
 * fails on any change, naming the ids. To clear it:
 *
 *   npx tsx scripts/progress/retire-exercise-ids.ts
 *
 * which appends those ids as a new version to src/state/retiredExerciseIds.ts
 * (the progress store's version follows, and its migration drops the scores)
 * and re-records the snapshot.
 */
import { describe, it, expect } from 'vitest';
import snapshot from './exerciseIdentities.json';
import respellings from './exerciseRespellings.json';
import v3Snapshot from '../../../state/__tests__/fixtures/learn-identities-v3.json';
import { treeFingerprints, changedIds, fingerprint } from './exerciseFingerprints';
import { generateAllForLevel } from '../exerciseGenerator';
import { enExercisesFor, enTemplatesFor } from '../../../i18n/content/__tests__/overlayEntries';
import { PROGRESS_STORE_VERSION } from '../../../state/progressStore';
import { RETIRED_EXERCISE_IDS } from '../../../state/retiredExerciseIds';

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const current = () =>
  treeFingerprints({
    authored: LEVELS.map(enExercisesFor),
    templates: LEVELS.map(enTemplatesFor),
    generateAllForLevel: (c, lang, a) => generateAllForLevel(c, lang, a),
  });

describe('exercise identities match the recorded snapshot', () => {
  it('the fingerprint tells a changed question or answer apart, and ignores a distractor edit', () => {
    const base = { type: 'multiple_choice' as const, prompt: 'Q?', config: { type: 'multiple_choice' as const, choices: [{ label: 'A', correct: true }, { label: 'B', correct: false }] } };
    expect(fingerprint({ ...base, config: { ...base.config, choices: [{ label: 'A', correct: true }, { label: 'C', correct: false }] } })).toBe(fingerprint(base));
    expect(fingerprint({ ...base, prompt: 'Other?' })).not.toBe(fingerprint(base));
    expect(changedIds({ m: { m1: 'x', m2: 'y' } }, { m: { m1: 'x', m2: 'z' } })).toEqual({ m: ['m2'] });
  });

  it('no exercise changed identity since the snapshot (else retire its saved scores)', () => {
    const changed = changedIds(snapshot as Record<string, Record<string, string>>, current());
    const added = changedIds(current(), snapshot as Record<string, Record<string, string>>);
    expect(changed, 'run: npx tsx scripts/progress/retire-exercise-ids.ts').toEqual({});
    expect(added, 'new ids: re-record the snapshot with the same script').toEqual({});
  });

  it('since the v3 recording: the three EN typography items of v4, plus exactly the ids respelled on 2026-11-19 (British spelling, scores kept)', () => {
    // The glossary (PT/ES) added none; the British spelling pass changed 60 ids by spelling
    // only (exerciseRespellings.json, proved in exerciseRespellings.test.ts).
    const expected: Record<string, string[]> = { l4u13m1: ['l4u13m1g3'], l5u15m5: ['l5u15m5g3'], l8u27m1: ['l8u27m1g5'] };
    for (const [m, ids] of Object.entries(respellings['2026-11-19'].ids)) expected[m] = [...(expected[m] ?? []), ...Object.keys(ids)];
    const sorted = (o: Record<string, string[]>) =>
      Object.fromEntries(Object.entries(o).map(([m, ids]) => [m, [...ids].sort((x, y) => x.localeCompare(y, 'en', { numeric: true }))]));
    expect(changedIds(v3Snapshot, current())).toEqual(sorted(expected));
    expect(Object.values(expected).flat().length).toBe(63);
  });

  it('the progress store version follows the retirement list', () => {
    expect(PROGRESS_STORE_VERSION).toBe(Math.max(1, ...RETIRED_EXERCISE_IDS.map((r) => r.version)));
  });
});
