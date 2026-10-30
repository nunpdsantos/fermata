import { describe, it, expect } from 'vitest';
import i18n from '../index';
import {
  DRILL_PROMPT_KEYS,
  DRILL_WHY_KEYS,
} from '../../core/utils/drillBank';

/**
 * Trilingual drill i18n parity gate (Tasks 9 + 13).
 *
 * Every promptKey / whyKey the drill bank can emit, plus the drill UI keys,
 * must resolve to a real string IN ALL THREE LANGUAGES (en/pt/es) with NO
 * fallback to English — a missing PT/ES key would silently English-leak via
 * i18next's fallbackLng, so resolution is checked against the per-language
 * resource store (i18n.exists with an explicit lng), never the fallback chain.
 *
 * Task 13 additionally pins TOKEN-SET PARITY: the {{token}} set of each PT/ES
 * translation must equal EN's for the same key. The drill renders prompts via
 * t(promptKey, promptParams); a translation that drops or renames a token would
 * leave a param unrendered (or print a stray {{token}}) without ever failing to
 * "resolve". Token extraction reads the RAW template from the resource store
 * (getResource leaves {{...}} intact, unlike t() which would interpolate).
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
  'drill.settings.resetLabel',
  'drill.settings.resetWarning',
  'drill.settings.resetConfirm',
  'drill.settings.resetCancel',
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

// Bank keys that exist only as plural forms (key_one / key_other, selected by
// the item's `count` param): "1 semitone" vs "7 semitones" (audit W7-12).
const PLURAL_BANK_KEYS: ReadonlySet<string> = new Set([
  'drill.prompts.semitonesToName',
  'drill.why.semitoneFact',
]);

// Render-time term keys (audit W6-07): degree / function / cadence names and
// Yes/No, translated in PT/ES by components/drill/drillText.ts.
const DRILL_TERM_KEYS: readonly string[] = [
  ...['1', '2', '3', '4', '5', '6', '7'].map((n) => `drill.terms.degree.${n}`),
  'drill.terms.function.tonic',
  'drill.terms.function.subdominant',
  'drill.terms.function.dominant',
  'drill.terms.cadence.perfectAuthentic',
  'drill.terms.cadence.plagal',
  'drill.terms.cadence.half',
  'drill.terms.cadence.deceptive',
  'drill.terms.yes',
  'drill.terms.no',
];

// Tokens only English renders: the UK cadence gloss "(UK: interrupted)" means
// nothing to a Portuguese or Spanish reader (audit W6-07), so PT/ES drop it.
const EN_ONLY_TOKENS: Readonly<Record<string, readonly string[]>> = {
  'drill.why.cadenceDef': ['{{uk}}'],
  'drill.why.cadencePerfect': ['{{uk}}'],
};

/** Resolution check that understands the plural-only bank keys. */
function bankKeyResolvesIn(lng: string, key: string): boolean {
  if (!PLURAL_BANK_KEYS.has(key)) return resolvesIn(lng, key);
  return resolvesIn(lng, key, { count: 1 }) && resolvesIn(lng, key, { count: 2 });
}

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
      expect(bankKeyResolvesIn('en', key), `missing EN prompt: ${key}`).toBe(true);
    }
  });

  it('every drill why key resolves in English', () => {
    for (const key of DRILL_WHY_KEYS) {
      expect(bankKeyResolvesIn('en', key), `missing EN why: ${key}`).toBe(true);
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

// ─── Task 13: full trilingual prompt + why + UI parity (resolution + tokens) ──

const TOKEN_RE = /\{\{[a-zA-Z]+\}\}/g;

/** Unique, sorted {{token}} list of a template string (raw, un-interpolated). */
function tokenSet(text: string): string[] {
  return [...new Set(Array.from(text.matchAll(TOKEN_RE), (m) => m[0]))].sort();
}

/** Raw stored template for `key` in `lng` (leaves {{tokens}} intact), or '' if absent. */
function rawTemplate(lng: string, key: string): string {
  const v = i18n.getResource(lng, 'translation', key);
  return typeof v === 'string' ? v : '';
}

// The dynamic keys whose tokens must match EN exactly per language. These are the
// prompt + why registries (the bank's own source of truth) plus the two dynamic
// feedback keys that carry a param. Non-token UI keys are covered by resolution.
const DRILL_TOKEN_KEYS: readonly string[] = [
  ...DRILL_PROMPT_KEYS,
  ...DRILL_WHY_KEYS,
  'drill.feedback.nearMiss', // {{expected}}
];

describe('drill i18n — prompts + why resolve in all three languages (no fallback)', () => {
  for (const lng of LANGS) {
    it(`every drill prompt key resolves in ${lng.toUpperCase()}`, () => {
      for (const key of DRILL_PROMPT_KEYS) {
        expect(bankKeyResolvesIn(lng, key), `missing ${lng.toUpperCase()} prompt: ${key}`).toBe(true);
      }
    });

    it(`every drill why key resolves in ${lng.toUpperCase()}`, () => {
      for (const key of DRILL_WHY_KEYS) {
        expect(bankKeyResolvesIn(lng, key), `missing ${lng.toUpperCase()} why: ${key}`).toBe(true);
      }
    });

    it(`every drill UI key resolves in ${lng.toUpperCase()}`, () => {
      for (const key of DRILL_UI_KEYS) {
        expect(resolvesIn(lng, key), `missing ${lng.toUpperCase()} UI key: ${key}`).toBe(true);
      }
    });

    it(`every drill term key resolves in ${lng.toUpperCase()}`, () => {
      for (const key of DRILL_TERM_KEYS) {
        expect(resolvesIn(lng, key), `missing ${lng.toUpperCase()} term: ${key}`).toBe(true);
      }
    });
  }
});

describe('drill i18n — {{token}} set parity (PT/ES vs EN) for every dynamic key', () => {
  // Plural-only keys are compared form by form (_one, _other).
  const templateKeys = DRILL_TOKEN_KEYS.flatMap((key) =>
    PLURAL_BANK_KEYS.has(key) ? [`${key}_one`, `${key}_other`] : [key],
  );
  for (const key of templateKeys) {
    const baseKey = key.replace(/_(one|other)$/, '');
    it(`${key}: PT and ES use the same {{tokens}} as EN`, () => {
      const enOnly = EN_ONLY_TOKENS[baseKey] ?? [];
      const enTokens = tokenSet(rawTemplate('en', key)).filter((tok) => !enOnly.includes(tok));
      // Guard: the EN side really exists as a raw template (catches a typo'd key
      // here, or a key that only exists via fallback rather than as a real string).
      expect(rawTemplate('en', key).length, `EN raw template missing for ${key}`).toBeGreaterThan(0);
      for (const lng of ['pt', 'es'] as const) {
        const raw = rawTemplate(lng, key);
        expect(raw.length, `${lng.toUpperCase()} raw template missing for ${key}`).toBeGreaterThan(0);
        expect(
          tokenSet(raw),
          `${lng.toUpperCase()} ${key} tokens diverge from EN\n  EN: "${rawTemplate('en', key)}"\n  ${lng}: "${raw}"`,
        ).toEqual(enTokens);
      }
    });
  }

  it('EN-only tokens really are EN-only (no "(RU: …)" gloss in PT/ES)', () => {
    for (const [key, tokens] of Object.entries(EN_ONLY_TOKENS)) {
      for (const tok of tokens) expect(rawTemplate('en', key), key).toContain(tok);
      for (const lng of ['pt', 'es'] as const) {
        const raw = rawTemplate(lng, key);
        for (const tok of tokens) expect(raw, `${lng} ${key}`).not.toContain(tok);
        expect(raw, `${lng} ${key}`).not.toMatch(/\b(RU|UK):/);
      }
    }
  });
});

// ─── Task 13: PT sanity render with realistic promptParams ────────────────────
//
// promptParams carry music nomenclature in ENGLISH/symbol form (e.g. key:
// 'A major', note: 'F♯', sig: '3♯'). The view translates key names, degree,
// function and cadence names at render time (components/drill/drillText.ts —
// see its tests, audit W6-07); these checks feed the RAW template English
// params to prove the PT prose interpolates cleanly around whatever it gets,
// with no leftover {{token}}.

describe('drill i18n — PT prompts render naturally around English nomenclature', () => {
  const pt = i18n.getFixedT('pt');

  it('keyToCount: PT prose wraps an English key name', () => {
    const out = pt('drill.prompts.keyToCount', { key: 'A major' });
    expect(out).toBe('Quantos sustenidos ou bemóis tem A major?');
    expect(out).not.toMatch(/\{\{|\}\}/); // no unrendered tokens
  });

  it('noteAbove: PT prose wraps an English interval label + a ♯ root', () => {
    const out = pt('drill.prompts.noteAbove', { interval: 'major 3rd', root: 'F♯' });
    expect(out).toBe('Uma major 3rd acima de F♯?');
    expect(out).not.toMatch(/\{\{|\}\}/);
  });

  it('spellChord: PT imperative wraps an English chord symbol', () => {
    const out = pt('drill.prompts.spellChord', { chord: 'C♯ minor' });
    expect(out).toBe('Soletra C♯ minor');
    expect(out).not.toMatch(/\{\{|\}\}/);
  });
});
