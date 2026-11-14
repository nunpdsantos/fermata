/**
 * The search pages' data (2026-11-14): the SAME data the app shows, read at
 * build time — never copied. The curriculum (src/core/constants/curriculumL*)
 * with its PT / ES overlays applied by the app's own pure resolver
 * (`applyCurriculumOverlay`), the level metadata through
 * `translateLevelMetadata`, the song references through `applySongOverlay`,
 * the glossary's words (i18n/glossary/*.json, titles by the app's own
 * `termTitle`) and the app's locale files.
 *
 * Why not `loadLevel()` itself: data/curriculumLoader.ts reaches the overlays
 * through `import.meta.glob`, which only Vite understands, and the pages are
 * written by a plain `tsx` script after `vite build`. So this file imports
 * the same modules statically and applies the same functions, and
 * src/site/__tests__/content.test.ts proves the result EQUAL to what
 * `loadLevel()` returns, for every level in every language (Vitest runs
 * Vite's transform, so the app's loader works there).
 *
 * Nothing from a store, and never the checks: no exercise module is imported
 * anywhere under src/site (a test reads the imports).
 */
import type { CurriculumLevel, CurriculumModule, CurriculumUnit } from '../core/types/curriculum';
import type { CurriculumLevelOverlay, SongOverlay } from '../i18n/content/types';
import { applyCurriculumOverlay, applySongOverlay } from '../i18n/content/contentResolver';
import { translateLevelMetadata } from '../i18n/content/levelMetaResolver';
import { LEVEL_METADATA } from '../data/levelMetadata';
import { getAllSongReferences, type SongReference } from '../data/songReferences';
import { isOptionalModuleId } from '../core/constants/optionalCurriculum';
import { trackOfModule, type TrackId } from '../data/tracks';
import { TERM_IDS, type TermId } from '../glossary/termIds';
import { GLOSSARY } from '../glossary/entries';
import { termTitle } from '../glossary/termTitle';
import { L1_UNITS } from '../core/constants/curriculumL1';
import { L2_UNITS } from '../core/constants/curriculumL2';
import { L3_UNITS } from '../core/constants/curriculumL3';
import { L4_UNITS } from '../core/constants/curriculumL4';
import { L5_UNITS } from '../core/constants/curriculumL5';
import { L6_UNITS } from '../core/constants/curriculumL6';
import { L7_UNITS } from '../core/constants/curriculumL7';
import { L8_UNITS } from '../core/constants/curriculumL8';
import { L9_UNITS } from '../core/constants/curriculumL9';
import ptL1 from '../i18n/content/pt/curriculumL1';
import ptL2 from '../i18n/content/pt/curriculumL2';
import ptL3 from '../i18n/content/pt/curriculumL3';
import ptL4 from '../i18n/content/pt/curriculumL4';
import ptL5 from '../i18n/content/pt/curriculumL5';
import ptL6 from '../i18n/content/pt/curriculumL6';
import ptL7 from '../i18n/content/pt/curriculumL7';
import ptL8 from '../i18n/content/pt/curriculumL8';
import ptL9 from '../i18n/content/pt/curriculumL9';
import esL1 from '../i18n/content/es/curriculumL1';
import esL2 from '../i18n/content/es/curriculumL2';
import esL3 from '../i18n/content/es/curriculumL3';
import esL4 from '../i18n/content/es/curriculumL4';
import esL5 from '../i18n/content/es/curriculumL5';
import esL6 from '../i18n/content/es/curriculumL6';
import esL7 from '../i18n/content/es/curriculumL7';
import esL8 from '../i18n/content/es/curriculumL8';
import esL9 from '../i18n/content/es/curriculumL9';
import ptSongs from '../i18n/content/pt/songs';
import esSongs from '../i18n/content/es/songs';
import enLocale from '../i18n/locales/en.json';
import ptLocale from '../i18n/locales/pt.json';
import esLocale from '../i18n/locales/es.json';
import enGlossary from '../i18n/glossary/en.json';
import ptGlossary from '../i18n/glossary/pt.json';
import esGlossary from '../i18n/glossary/es.json';
import enTuner from '../i18n/tuner/en.json';
import ptTuner from '../i18n/tuner/pt.json';
import esTuner from '../i18n/tuner/es.json';

export const SITE_LANGS = ['en', 'pt', 'es'] as const;
export type SiteLang = (typeof SITE_LANGS)[number];

const UNITS: Record<string, CurriculumUnit[]> = {
  l1: L1_UNITS, l2: L2_UNITS, l3: L3_UNITS, l4: L4_UNITS, l5: L5_UNITS,
  l6: L6_UNITS, l7: L7_UNITS, l8: L8_UNITS, l9: L9_UNITS,
};

const OVERLAYS: Record<Exclude<SiteLang, 'en'>, Record<string, CurriculumLevelOverlay>> = {
  pt: { l1: ptL1, l2: ptL2, l3: ptL3, l4: ptL4, l5: ptL5, l6: ptL6, l7: ptL7, l8: ptL8, l9: ptL9 },
  es: { l1: esL1, l2: esL2, l3: esL3, l4: esL4, l5: esL5, l6: esL6, l7: esL7, l8: esL8, l9: esL9 },
};

const SONG_OVERLAYS: Record<Exclude<SiteLang, 'en'>, SongOverlay> = { pt: ptSongs, es: esSongs };

/** The app's own locale files (entry namespaces) plus the lazy ones the pages quote. */
const LOCALES: Record<SiteLang, Record<string, unknown>> = {
  en: { ...enLocale, glossary: { ...enLocale.glossary, ...enGlossary }, tuner: enTuner },
  pt: { ...ptLocale, glossary: { ...ptLocale.glossary, ...ptGlossary }, tuner: ptTuner },
  es: { ...esLocale, glossary: { ...esLocale.glossary, ...esGlossary }, tuner: esTuner },
};

/**
 * One level as `loadLevel(levelId, lang)` builds it (data/curriculumLoader.ts):
 * the translated metadata, the English units, the overlay applied.
 */
export function siteLevel(levelId: string, lang: SiteLang): CurriculumLevel {
  const meta = LEVEL_METADATA.find((m) => m.id === levelId);
  const units = UNITS[levelId];
  if (!meta || !units) throw new Error(`site: no level ${levelId}`);
  const t = translateLevelMetadata([meta], lang)[0];
  const level: CurriculumLevel = {
    id: t.id,
    number: t.number,
    title: t.title,
    description: t.description,
    difficulty: t.difficulty,
    difficultyLabel: t.difficultyLabel,
    accentColor: t.accentColor,
    prerequisites: t.prerequisites,
    parallel: t.parallel,
    comingSoon: t.comingSoon,
    units,
  };
  return lang === 'en' ? level : applyCurriculumOverlay(level, OVERLAYS[lang][levelId] ?? null);
}

/** Every level, in the app's order (LEVEL_METADATA). */
export function siteLevels(lang: SiteLang): CurriculumLevel[] {
  return LEVEL_METADATA.map((m) => siteLevel(m.id, lang));
}

/** A lesson with where it sits. */
export interface SiteLesson {
  module: CurriculumModule;
  unit: CurriculumUnit;
  level: CurriculumLevel;
  /** A starting track's lesson ('sound' | 'chords'), else null. */
  track: TrackId | null;
  /** In an optional unit (the guitar-notation unit or a track). */
  optional: boolean;
}

/** Every lesson, levels in order, units in their data order. */
export function siteLessons(lang: SiteLang): SiteLesson[] {
  return siteLevels(lang).flatMap((level) =>
    level.units.flatMap((unit) =>
      unit.modules.map((module) => ({
        module,
        unit,
        level,
        track: trackOfModule(module.id)?.id ?? null,
        optional: isOptionalModuleId(module.id),
      })),
    ),
  );
}

/**
 * The lessons Previous / Next walk through, as the app's lesson page does
 * (`getPreviousModuleInLevel` / `getNextModuleInLevel`): a required lesson
 * walks its level's required units; a lesson of an optional unit (guitar
 * notation, a track) walks that unit only. Proved equal to the app's for all
 * 136 lessons in src/site/__tests__/content.test.ts.
 */
export function lessonNeighbours(moduleId: string, level: CurriculumLevel): { prev: CurriculumModule | null; next: CurriculumModule | null } {
  const sequence = isOptionalModuleId(moduleId)
    ? (level.units.find((u) => u.modules.some((m) => m.id === moduleId))?.modules ?? [])
    : level.units.filter((u) => !u.optional).flatMap((u) => u.modules);
  const i = sequence.findIndex((m) => m.id === moduleId);
  if (i === -1) return { prev: null, next: null };
  return { prev: sequence[i - 1] ?? null, next: sequence[i + 1] ?? null };
}

/** "Songs That Use This" for a lesson, the context in the page's language (hooks/useSongReferences.ts). */
export function siteSongs(moduleId: string, lang: SiteLang): SongReference[] {
  const all = getAllSongReferences();
  const refs = all[moduleId] ?? [];
  if (lang === 'en' || refs.length === 0) return refs;
  return applySongOverlay({ [moduleId]: refs }, SONG_OVERLAYS[lang])[moduleId];
}

/**
 * A string from the app's locale files: `{{name}}` filled in, and a `count`
 * choosing `_one` / `_other` as i18next does (Intl.PluralRules on the
 * language code). A missing key FAILS the build: the pages never show a key.
 */
export function appText(lang: SiteLang, key: string, vars: Record<string, string | number> = {}): string {
  const lookup = (k: string): unknown => k.split('.').reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), LOCALES[lang]);
  let value: unknown;
  if (typeof vars.count === 'number') {
    const form = new Intl.PluralRules(lang).select(vars.count);
    value = lookup(`${key}_${form}`) ?? lookup(`${key}_other`);
  } else {
    value = lookup(key);
  }
  if (typeof value !== 'string') throw new Error(`site: no string "${key}" in ${lang}`);
  return value.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    if (!(name in vars)) throw new Error(`site: "${key}" (${lang}) needs {{${name}}}`);
    return String(vars[name]);
  });
}

/** A glossary entry as the pages show it: the app's title and plain words, and the lesson that teaches it. */
export interface SiteTerm {
  id: TermId;
  title: string;
  plain: string;
  learn: string | null;
}

/** Every glossary entry (TERM_IDS: 71 words + one per scale). */
export function siteGlossary(lang: SiteLang): SiteTerm[] {
  const t = (key: string, opts?: Record<string, unknown>) => appText(lang, key, (opts ?? {}) as Record<string, string | number>);
  return TERM_IDS.map((id) => ({
    id,
    title: termTitle(id, t),
    plain: appText(lang, `glossary.entries.${id}.plain`),
    learn: GLOSSARY[id]?.learn ?? null,
  }));
}
