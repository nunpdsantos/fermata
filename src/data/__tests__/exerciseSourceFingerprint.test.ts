/**
 * 2026-11-05 follow-up 3: every Learn item the loader serves carries the W4a
 * fingerprint of its ENGLISH item (`sourceFingerprint`), in every language,
 * so a saved check is keyed by what the exercise IS rather than by its PT/ES
 * wording. Checked against the real content, all nine levels.
 */
import { describe, it, expect } from 'vitest';
import { loadExercises } from '../exerciseLoader';
import { exerciseFingerprint } from '../exercises/exerciseFingerprint';
import snapshot from '../exercises/__tests__/exerciseIdentities.json';

const LEVELS = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9'];

describe('served items carry their English identity', () => {
  it('English: every item\'s own fingerprint — the one the identity snapshot records', async () => {
    for (const level of LEVELS) {
      for (const [moduleId, list] of Object.entries(await loadExercises(level, 'en'))) {
        for (const ex of list) {
          expect(ex.sourceFingerprint, ex.id).toBe(exerciseFingerprint(ex));
          expect(ex.sourceFingerprint, ex.id).toBe((snapshot as Record<string, Record<string, string>>)[moduleId]?.[ex.id]);
        }
      }
    }
  });

  it.each(['pt', 'es'] as const)('%s: every item carries the English one, though its own wording differs', async (lang) => {
    let reworded = 0;
    let items = 0;
    for (const level of LEVELS) {
      const en = new Map(Object.values(await loadExercises(level, 'en')).flat().map((ex) => [ex.id, exerciseFingerprint(ex)]));
      for (const list of Object.values(await loadExercises(level, lang))) {
        for (const ex of list) {
          items += 1;
          expect(ex.sourceFingerprint, ex.id).toBe(en.get(ex.id));
          if (exerciseFingerprint(ex) !== ex.sourceFingerprint) reworded += 1;
        }
      }
    }
    expect(items).toBeGreaterThan(900);
    // The old key (the served fingerprint) depended on the wording of this many items.
    expect(reworded).toBeGreaterThan(100);
  });
});
