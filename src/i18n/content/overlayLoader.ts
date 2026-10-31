/**
 * Overlay loader — dynamic importers + cache for lazy-loaded translation overlays.
 *
 * Uses import.meta.glob so only files that exist get importers.
 * Missing overlay files are gracefully absent from the glob map — no 404s.
 * English returns null (no overlay needed).
 * Cache is keyed by `${lang}:${levelId}`.
 */
import type {
  ContentLanguage,
  CurriculumLevelOverlay,
  ExerciseLevelOverlay,
  TemplateLevelOverlay,
  SongOverlay,
} from './types';

// ─── Glob-based lazy importers ──────────────────────────────────────────────
// Vite resolves these at build time — only files that exist get entries.

type LazyModule<T> = () => Promise<{ default: T }>;

const curriculumGlob = import.meta.glob<{ default: CurriculumLevelOverlay }>(
  './**/curriculumL*.ts',
);
const exerciseGlob = import.meta.glob<{ default: ExerciseLevelOverlay }>(
  './**/exercisesL*.ts',
);
const templateGlob = import.meta.glob<{ default: TemplateLevelOverlay }>(
  './**/templatesL*.ts',
);
const songGlob = import.meta.glob<{ default: SongOverlay }>(
  './**/songs.ts',
);

/** Resolve a glob key like "./pt/curriculumL1.ts" from lang + levelId */
function getGlobKey(lang: string, filename: string): string {
  return `./${lang}/${filename}.ts`;
}

// ─── Cache ──────────────────────────────────────────────────────────────────

const curriculumCache = new Map<string, CurriculumLevelOverlay | null>();
const exerciseCache = new Map<string, ExerciseLevelOverlay | null>();
const templateCache = new Map<string, TemplateLevelOverlay | null>();
const songCache = new Map<string, SongOverlay | null>();

// ─── Generic loader ─────────────────────────────────────────────────────────

/**
 * Load one overlay chunk. A file that does not exist is cached as "no
 * overlay"; a chunk that FAILED to load (offline, flaky network) is not
 * cached, so the next request retries instead of showing the whole level in
 * English for the rest of the session (W6-14).
 */
export async function loadFromGlob<T>(
  glob: Record<string, LazyModule<T>>,
  globKey: string,
  cache: Map<string, T | null>,
  cacheKey: string,
): Promise<T | null> {
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const importer = glob[globKey] as LazyModule<T> | undefined;
  if (!importer) {
    cache.set(cacheKey, null);
    return null;
  }

  try {
    const mod = await importer();
    cache.set(cacheKey, mod.default);
    return mod.default;
  } catch {
    return null;
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function loadCurriculumOverlay(
  lang: ContentLanguage,
  levelId: string,
): Promise<CurriculumLevelOverlay | null> {
  if (lang === 'en') return null;
  const cacheKey = `${lang}:${levelId}`;
  return loadFromGlob(curriculumGlob, getGlobKey(lang, `curriculumL${levelId.slice(1)}`), curriculumCache, cacheKey);
}

export async function loadExerciseOverlay(
  lang: ContentLanguage,
  levelId: string,
): Promise<ExerciseLevelOverlay | null> {
  if (lang === 'en') return null;
  const cacheKey = `${lang}:${levelId}`;
  return loadFromGlob(exerciseGlob, getGlobKey(lang, `exercisesL${levelId.slice(1)}`), exerciseCache, cacheKey);
}

export async function loadTemplateOverlay(
  lang: ContentLanguage,
  levelId: string,
): Promise<TemplateLevelOverlay | null> {
  if (lang === 'en') return null;
  const cacheKey = `${lang}:${levelId}`;
  return loadFromGlob(templateGlob, getGlobKey(lang, `templatesL${levelId.slice(1)}`), templateCache, cacheKey);
}

export async function loadSongOverlay(
  lang: ContentLanguage,
): Promise<SongOverlay | null> {
  if (lang === 'en') return null;
  if (songCache.has(lang)) return songCache.get(lang)!;
  return loadFromGlob(songGlob, getGlobKey(lang, 'songs'), songCache, lang);
}
