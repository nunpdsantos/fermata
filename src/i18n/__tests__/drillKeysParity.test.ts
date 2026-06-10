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

// Task 11 UI keys — session summary, mastery map, settings, sprint. These are
// required in ALL THREE languages from day one (unlike the prompt/why bank keys,
// whose PT/ES translation lands in Task 13).
const DRILL_T11_UI_KEYS: readonly string[] = [
  'drill.settings.newPerSession',
  'drill.settings.families',
  'drill.settings.sound',
  'drill.settings.showTimer',
  'drill.settings.back',
  'drill.summary.title',
  'drill.summary.familyScore',
  'drill.summary.masteryMap',
  'drill.summary.sprint',
  'drill.mastery.title',
  'drill.mastery.back',
  'drill.mastery.counts',
  'drill.mastery.tier.new',
  'drill.mastery.tier.learning',
  'drill.mastery.tier.review',
  'drill.mastery.tier.byHeart',
  'drill.sprint.title',
  'drill.sprint.best',
  'drill.sprint.newBest',
  'drill.sprint.again',
  'drill.sprint.exit',
  'drill.sprint.empty',
  'drill.sprint.emptyHint',
  // Families (topic labels).
  'drill.families.keysig',
  'drill.families.circle',
  'drill.families.scale',
  'drill.families.degree',
  'drill.families.interval',
  'drill.families.triad',
  'drill.families.seventh',
  'drill.families.roman',
  'drill.families.function',
];

// Pluralized keys (count-driven). Both plural forms must resolve per language.
const DRILL_T11_PLURAL_KEYS: readonly string[] = [
  'drill.summary.byHeartCallout',
  'drill.summary.reviewCallout',
  'drill.mastery.byHeartTotal',
  'drill.mastery.dueToday',
  'drill.sprint.score',
];

const LANGS = ['en', 'pt', 'es'] as const;

function resolvesInEnglish(key: string): boolean {
  return resolvesIn('en', key);
}

/** True when `key` resolves to a real (non-empty, non-key) string in `lng`.
 *  `opts` (e.g. { count }) flows into exists() too so plural-suffixed keys
 *  (key_one / key_other) are detected against the bare base key. */
function resolvesIn(lng: string, key: string, opts: Record<string, unknown> = {}): boolean {
  if (!i18n.exists(key, { lng, ...opts })) return false;
  const value = i18n.getFixedT(lng)(key, opts);
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

describe('drill i18n — Task 11 UI keys, all three languages', () => {
  it('every Task 11 UI key resolves in EN, PT, and ES', () => {
    for (const lng of LANGS) {
      for (const key of DRILL_T11_UI_KEYS) {
        expect(resolvesIn(lng, key), `missing ${lng.toUpperCase()} UI key: ${key}`).toBe(true);
      }
    }
  });

  it('every Task 11 pluralized key resolves for count 1 and 2 in EN, PT, and ES', () => {
    for (const lng of LANGS) {
      for (const key of DRILL_T11_PLURAL_KEYS) {
        expect(resolvesIn(lng, key, { count: 1 }), `missing ${lng.toUpperCase()} (one): ${key}`).toBe(true);
        expect(resolvesIn(lng, key, { count: 2 }), `missing ${lng.toUpperCase()} (other): ${key}`).toBe(true);
      }
    }
  });
});
