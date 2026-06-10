import { describe, it, expect } from 'vitest';
import i18n from '../index';
import {
  DRILL_PROMPT_KEYS,
  DRILL_WHY_KEYS,
} from '../../core/utils/drillBank';

/**
 * EN-side i18n parity gate (Task 9).
 *
 * Every promptKey / whyKey the drill bank can emit, plus the drill UI keys,
 * must resolve to a real English string. Task 13 extends this to PT + ES and
 * to token-set parity; for now EN is the floor that keeps prompts/why-lines
 * from rendering as raw keys.
 *
 * DRILL_PROMPT_KEYS / DRILL_WHY_KEYS are the bank's own registries, tested
 * bidirectionally against generateDrillBank() in drillBank.test.ts — so this
 * suite transitively covers every key any item actually uses.
 */

// Drill UI keys not part of the bank registries but used by the runner/views.
const DRILL_UI_KEYS: readonly string[] = [
  'drill.progress',
  'drill.endSession',
  'drill.clear',
  'drill.done',
  'drill.settings.title',
  'drill.settings.length',
  'drill.summary.score',
  'drill.summary.newSession',
  'drill.feedback.correct',
  'drill.feedback.wrong',
  'drill.feedback.nearMiss',
  'drill.feedback.continue',
  'drill.feedback.learnMore',
  'drill.a11y.notes',
  'drill.a11y.scaleNotes',
  'drill.a11y.choices',
];

function resolvesInEnglish(key: string): boolean {
  if (!i18n.exists(key, { lng: 'en' })) return false;
  const value = i18n.getFixedT('en')(key);
  // A missing key falls back to the key string itself; reject that and empties.
  return typeof value === 'string' && value.length > 0 && value !== key;
}

describe('drill i18n — EN parity gate', () => {
  it('exposes a non-empty registry of prompt + why keys', () => {
    expect(DRILL_PROMPT_KEYS.length).toBeGreaterThan(0);
    expect(DRILL_WHY_KEYS.length).toBeGreaterThan(0);
  });

  it('every drill prompt key resolves in English', () => {
    for (const key of DRILL_PROMPT_KEYS) {
      expect(resolvesInEnglish(key), `missing EN prompt: ${key}`).toBe(true);
    }
  });

  it('every drill why key resolves in English', () => {
    for (const key of DRILL_WHY_KEYS) {
      expect(resolvesInEnglish(key), `missing EN why: ${key}`).toBe(true);
    }
  });

  it('every drill UI key resolves in English', () => {
    for (const key of DRILL_UI_KEYS) {
      expect(resolvesInEnglish(key), `missing EN UI key: ${key}`).toBe(true);
    }
  });
});
