import { describe, it, expect, beforeAll } from 'vitest';
import i18n, { SUPPORTED_LANGUAGES } from '../../i18n';
import '../../i18n/glossary';
import { getNextModuleInLevel, getPreviousModuleInLevel, loadLevel, LEVEL_METADATA } from '../../data/curriculumLoader';
import { getSongReferences } from '../../data/songReferences';
import { loadSongOverlay } from '../../i18n/content/overlayLoader';
import { applySongOverlay } from '../../i18n/content/contentResolver';
import { termTitle } from '../../glossary/termTitle';
import { TERM_IDS } from '../../glossary/termIds';
import type { CurriculumLevel } from '../../core/types/curriculum';
import { appText, lessonNeighbours, siteGlossary, siteLessons, siteLevel, siteSongs, SITE_LANGS, type SiteLang } from '../content';
import { LANGUAGE_NAMES } from '../strings';

/**
 * One source of truth: the pages' data IS the app's. The generator cannot
 * call `loadLevel()` (its overlays come through Vite's import.meta.glob, and
 * the pages are written by a plain tsx script), so it applies the app's own
 * pure resolver to the same modules — and here, under Vite, the result is
 * compared with what the app's loader returns, for EVERY level and language.
 */
const appLevels = {} as Record<SiteLang, CurriculumLevel[]>;
beforeAll(async () => {
  for (const lang of SITE_LANGS) {
    appLevels[lang] = (await Promise.all(LEVEL_METADATA.map((m) => loadLevel(m.id, lang)))).filter((l): l is CurriculumLevel => !!l);
  }
});

describe('the pages read what the app reads', () => {
  it.each(SITE_LANGS)('every level in %s equals loadLevel()', (lang) => {
    expect(appLevels[lang]).toHaveLength(9);
    for (const level of appLevels[lang]) expect(siteLevel(level.id, lang)).toEqual(level);
  });

  it('the lessons: 136 in every language, in the app\'s order, with where they sit', () => {
    for (const lang of SITE_LANGS) {
      const lessons = siteLessons(lang);
      expect(lessons).toHaveLength(136);
      expect(lessons.map((l) => l.module.id)).toEqual(appLevels[lang].flatMap((lv) => lv.units.flatMap((u) => u.modules.map((m) => m.id))));
      expect(lessons.filter((l) => l.track === 'sound').map((l) => l.module.id)).toEqual(['l1u34m1', 'l1u34m2', 'l1u34m3', 'l1u34m4', 'l1u34m5']);
      expect(lessons.filter((l) => l.track === 'chords')).toHaveLength(10);
      expect(lessons.filter((l) => l.optional && !l.track).map((l) => l.module.id)).toEqual(['l1u33m1', 'l1u33m2', 'l1u33m3']);
    }
  });

  it('Previous / Next: the app\'s own lesson order, for all 136 lessons', () => {
    let pairs = 0;
    for (const level of appLevels.en) {
      for (const unit of level.units) {
        for (const m of unit.modules) {
          const { prev, next } = lessonNeighbours(m.id, siteLevel(level.id, 'en'));
          expect(prev?.id ?? null).toBe(getPreviousModuleInLevel(m.id, level)?.id ?? null);
          expect(next?.id ?? null).toBe(getNextModuleInLevel(m.id, level)?.id ?? null);
          pairs++;
        }
      }
    }
    expect(pairs).toBe(136);
  });

  it('the songs: the context in the page\'s language, as useSongReferences gives it', async () => {
    let songs = 0;
    for (const lang of SITE_LANGS) {
      const overlay = await loadSongOverlay(lang);
      for (const { module } of siteLessons(lang)) {
        const refs = getSongReferences(module.id);
        const app = lang === 'en' || !overlay ? refs : applySongOverlay({ [module.id]: refs }, overlay)[module.id];
        expect(siteSongs(module.id, lang)).toEqual(app);
        songs += app.length;
      }
    }
    expect(songs).toBeGreaterThan(200);
  });

  it('the glossary: every term, its title and plain words as the app\'s panel shows them', () => {
    for (const lang of SITE_LANGS) {
      const t = i18n.getFixedT(lang);
      const terms = siteGlossary(lang);
      expect(terms.map((x) => x.id)).toEqual([...TERM_IDS]);
      for (const term of terms) {
        expect(term.title).toBe(termTitle(term.id, (k, o) => t(k, o)));
        expect(term.plain).toBe(t(`glossary.entries.${term.id}.plain`));
        expect(term.plain.length).toBeGreaterThan(20);
      }
    }
  });
});

describe('appText: the app\'s own strings', () => {
  it('reads a key, fills its places, picks the plural form as i18next does', () => {
    expect(appText('pt', 'learn.level', { n: 3 })).toBe(i18n.getFixedT('pt')('learn.level', { n: 3 }));
    for (const lang of SITE_LANGS) {
      for (const count of [1, 5]) expect(appText(lang, 'tracks.eyebrow', { count })).toBe(i18n.getFixedT(lang)('tracks.eyebrow', { count }));
      expect(appText(lang, 'tuner.why')).toMatch(/Fermatina/);
    }
  });

  it('fails on a missing key or a missing place, so a page never shows a key', () => {
    expect(() => appText('en', 'lesson.noSuchKey')).toThrow(/no string "lesson.noSuchKey"/);
    expect(() => appText('es', 'learn.level')).toThrow(/needs \{\{n\}\}/);
  });

  it('the language names are Settings\' own', () => {
    expect(Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l.code, l.label]))).toEqual(LANGUAGE_NAMES);
  });
});

describe('never published', () => {
  // Read off the source: nothing under src/site imports the checks, a store or progress.
  const sources = import.meta.glob('../*.ts', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

  it('no module of the pages imports an exercise, a store or saved data', () => {
    expect(Object.keys(sources).length).toBeGreaterThanOrEqual(7);
    // Known positive: the scan reads the imports (content.ts imports the curriculum).
    expect(sources['../content.ts']).toMatch(/^import \{ L1_UNITS \} from '\.\.\/core\/constants\/curriculumL1';$/m);
    for (const [file, source] of Object.entries(sources)) {
      const imports = [...source.matchAll(/^import[^'"]*['"]([^'"]+)['"]/gm)].map((m) => m[1]);
      for (const spec of imports) {
        expect(spec, file).not.toMatch(/exercise|templates|Store\b|state\/store|progress|learnSession|drill|localStorage/i);
      }
    }
  });
});
