/**
 * Test helper: every translatable English source string paired with its
 * Portuguese and Spanish overlay text, under a stable key.
 *
 *   cur:l3.u9.title                      unit title / description
 *   cur:l3u11m1.concepts[0].explanation  module fields
 *   ex:l3u11m1e2.choices[1]              hand-authored exercise fields
 *   tm:l3u11m1[0].choiceSets[2][0]       generation-template fields
 *   song:l2u6m1[2]                       song-reference contexts
 *   lvl:l3.difficultyLabel               level metadata
 *
 * Used by the structural parity test and the English-source hash gate.
 */
import type { CurriculumUnit } from '../../../core/types/curriculum';
import type { ExerciseDefinition } from '../../../core/types/exercise';
import type { ModuleTemplateConfig } from '../../../data/exercises/exerciseTemplates';
import type {
  CurriculumLevelOverlay,
  ExerciseLevelOverlay,
  TemplateLevelOverlay,
  SongOverlay,
  LevelMetaOverlay,
} from '../types';
import { LEVEL_METADATA } from '../../../data/levelMetadata';
import { getAllSongReferences } from '../../../data/songReferences';
import { L1_UNITS } from '../../../core/constants/curriculumL1';
import { L2_UNITS } from '../../../core/constants/curriculumL2';
import { L3_UNITS } from '../../../core/constants/curriculumL3';
import { L4_UNITS } from '../../../core/constants/curriculumL4';
import { L5_UNITS } from '../../../core/constants/curriculumL5';
import { L6_UNITS } from '../../../core/constants/curriculumL6';
import { L7_UNITS } from '../../../core/constants/curriculumL7';
import { L8_UNITS } from '../../../core/constants/curriculumL8';
import { L9_UNITS } from '../../../core/constants/curriculumL9';

import enEx1 from '../../../data/exercises/exercisesL1';
import enEx2 from '../../../data/exercises/exercisesL2';
import enEx3 from '../../../data/exercises/exercisesL3';
import enEx4 from '../../../data/exercises/exercisesL4';
import enEx5 from '../../../data/exercises/exercisesL5';
import enEx6 from '../../../data/exercises/exercisesL6';
import enEx7 from '../../../data/exercises/exercisesL7';
import enEx8 from '../../../data/exercises/exercisesL8';
import enEx9 from '../../../data/exercises/exercisesL9';
import enTm1 from '../../../data/exercises/templatesL1';
import enTm2 from '../../../data/exercises/templatesL2';
import enTm3 from '../../../data/exercises/templatesL3';
import enTm4 from '../../../data/exercises/templatesL4';
import enTm5 from '../../../data/exercises/templatesL5';
import enTm6 from '../../../data/exercises/templatesL6';
import enTm7 from '../../../data/exercises/templatesL7';
import enTm8 from '../../../data/exercises/templatesL8';
import enTm9 from '../../../data/exercises/templatesL9';
import ptCur1 from '../pt/curriculumL1';
import ptCur2 from '../pt/curriculumL2';
import ptCur3 from '../pt/curriculumL3';
import ptCur4 from '../pt/curriculumL4';
import ptCur5 from '../pt/curriculumL5';
import ptCur6 from '../pt/curriculumL6';
import ptCur7 from '../pt/curriculumL7';
import ptCur8 from '../pt/curriculumL8';
import ptCur9 from '../pt/curriculumL9';
import ptEx1 from '../pt/exercisesL1';
import ptEx2 from '../pt/exercisesL2';
import ptEx3 from '../pt/exercisesL3';
import ptEx4 from '../pt/exercisesL4';
import ptEx5 from '../pt/exercisesL5';
import ptEx6 from '../pt/exercisesL6';
import ptEx7 from '../pt/exercisesL7';
import ptEx8 from '../pt/exercisesL8';
import ptEx9 from '../pt/exercisesL9';
import ptTm1 from '../pt/templatesL1';
import ptTm2 from '../pt/templatesL2';
import ptTm3 from '../pt/templatesL3';
import ptTm4 from '../pt/templatesL4';
import ptTm5 from '../pt/templatesL5';
import ptTm6 from '../pt/templatesL6';
import ptTm7 from '../pt/templatesL7';
import ptTm8 from '../pt/templatesL8';
import ptTm9 from '../pt/templatesL9';
import ptSongs from '../pt/songs';
import ptLevelMeta from '../pt/levelMeta';
import esCur1 from '../es/curriculumL1';
import esCur2 from '../es/curriculumL2';
import esCur3 from '../es/curriculumL3';
import esCur4 from '../es/curriculumL4';
import esCur5 from '../es/curriculumL5';
import esCur6 from '../es/curriculumL6';
import esCur7 from '../es/curriculumL7';
import esCur8 from '../es/curriculumL8';
import esCur9 from '../es/curriculumL9';
import esEx1 from '../es/exercisesL1';
import esEx2 from '../es/exercisesL2';
import esEx3 from '../es/exercisesL3';
import esEx4 from '../es/exercisesL4';
import esEx5 from '../es/exercisesL5';
import esEx6 from '../es/exercisesL6';
import esEx7 from '../es/exercisesL7';
import esEx8 from '../es/exercisesL8';
import esEx9 from '../es/exercisesL9';
import esTm1 from '../es/templatesL1';
import esTm2 from '../es/templatesL2';
import esTm3 from '../es/templatesL3';
import esTm4 from '../es/templatesL4';
import esTm5 from '../es/templatesL5';
import esTm6 from '../es/templatesL6';
import esTm7 from '../es/templatesL7';
import esTm8 from '../es/templatesL8';
import esTm9 from '../es/templatesL9';
import esSongs from '../es/songs';
import esLevelMeta from '../es/levelMeta';

// Static imports (not import.meta.glob) so the tsx rehash script can use this
// module too.
export const LANGS = ['pt', 'es'] as const;
export type Lang = (typeof LANGS)[number];

export const EN_UNITS: Record<number, CurriculumUnit[]> = {
  1: L1_UNITS, 2: L2_UNITS, 3: L3_UNITS, 4: L4_UNITS, 5: L5_UNITS,
  6: L6_UNITS, 7: L7_UNITS, 8: L8_UNITS, 9: L9_UNITS,
};
const EN_EX: Record<number, Record<string, ExerciseDefinition[]>> = {
  1: enEx1, 2: enEx2, 3: enEx3, 4: enEx4, 5: enEx5, 6: enEx6, 7: enEx7, 8: enEx8, 9: enEx9,
};
const EN_TM: Record<number, ModuleTemplateConfig[]> = {
  1: enTm1, 2: enTm2, 3: enTm3, 4: enTm4, 5: enTm5, 6: enTm6, 7: enTm7, 8: enTm8, 9: enTm9,
};
const OV = {
  pt: {
    cur: [ptCur1, ptCur2, ptCur3, ptCur4, ptCur5, ptCur6, ptCur7, ptCur8, ptCur9] as CurriculumLevelOverlay[],
    ex: [ptEx1, ptEx2, ptEx3, ptEx4, ptEx5, ptEx6, ptEx7, ptEx8, ptEx9] as ExerciseLevelOverlay[],
    tm: [ptTm1, ptTm2, ptTm3, ptTm4, ptTm5, ptTm6, ptTm7, ptTm8, ptTm9] as TemplateLevelOverlay[],
    songs: ptSongs as SongOverlay,
    levelMeta: ptLevelMeta as Record<string, LevelMetaOverlay>,
  },
  es: {
    cur: [esCur1, esCur2, esCur3, esCur4, esCur5, esCur6, esCur7, esCur8, esCur9] as CurriculumLevelOverlay[],
    ex: [esEx1, esEx2, esEx3, esEx4, esEx5, esEx6, esEx7, esEx8, esEx9] as ExerciseLevelOverlay[],
    tm: [esTm1, esTm2, esTm3, esTm4, esTm5, esTm6, esTm7, esTm8, esTm9] as TemplateLevelOverlay[],
    songs: esSongs as SongOverlay,
    levelMeta: esLevelMeta as Record<string, LevelMetaOverlay>,
  },
};

export const enExercisesFor = (n: number) => EN_EX[n];
export const enTemplatesFor = (n: number) => EN_TM[n];
export const curriculumOverlay = (lang: Lang, n: number) => OV[lang].cur[n - 1];
export const exerciseOverlay = (lang: Lang, n: number) => OV[lang].ex[n - 1];
export const templateOverlay = (lang: Lang, n: number) => OV[lang].tm[n - 1];
export const songOverlay = (lang: Lang) => OV[lang].songs;
export const levelMetaOverlay = (lang: Lang) => OV[lang].levelMeta;

export interface Entry {
  key: string;
  en: string;
  /** translated text per language (undefined = missing in that overlay) */
  tr: Record<Lang, string | undefined>;
}

/** Every English source string that an overlay translates. */
export function overlayEntries(): Entry[] {
  const out: Entry[] = [];
  const add = (key: string, en: string, get: (lang: Lang) => string | undefined) =>
    out.push({ key, en, tr: { pt: get('pt'), es: get('es') } });

  for (let n = 1; n <= 9; n++) {
    const lvl = `l${n}`;
    // Curriculum
    for (const unit of EN_UNITS[n]) {
      add(`cur:${lvl}.${unit.id}.title`, unit.title, (l) => curriculumOverlay(l, n).units[unit.id]?.title);
      add(`cur:${lvl}.${unit.id}.description`, unit.description, (l) => curriculumOverlay(l, n).units[unit.id]?.description);
      for (const mod of unit.modules) {
        const ov = (l: Lang) => curriculumOverlay(l, n).modules[mod.id];
        add(`cur:${mod.id}.title`, mod.title, (l) => ov(l)?.title);
        add(`cur:${mod.id}.subtitle`, mod.subtitle, (l) => ov(l)?.subtitle);
        mod.objectives.forEach((o, i) => add(`cur:${mod.id}.objectives[${i}]`, o, (l) => ov(l)?.objectives[i]));
        mod.concepts.forEach((c, i) => {
          add(`cur:${mod.id}.concepts[${i}].title`, c.title, (l) => ov(l)?.concepts[i]?.title);
          add(`cur:${mod.id}.concepts[${i}].explanation`, c.explanation, (l) => ov(l)?.concepts[i]?.explanation);
          add(`cur:${mod.id}.concepts[${i}].tryThisLabel`, c.tryThisLabel, (l) => ov(l)?.concepts[i]?.tryThisLabel);
        });
        mod.tasks.forEach((t, i) => add(`cur:${mod.id}.tasks[${i}]`, t.instruction, (l) => ov(l)?.tasks[i]?.instruction));
      }
    }
    // Hand-authored exercises
    for (const ex of Object.values(enExercisesFor(n)).flat()) {
      const ov = (l: Lang) => exerciseOverlay(l, n)[ex.id];
      add(`ex:${ex.id}.prompt`, ex.prompt, (l) => ov(l)?.prompt);
      if (ex.hint) add(`ex:${ex.id}.hint`, ex.hint, (l) => ov(l)?.hint);
      const cfg = ex.config as { type: string; choices?: { label: string }[] };
      if (cfg.choices && (cfg.type === 'multiple_choice' || cfg.type === 'ear_training')) {
        cfg.choices.forEach((c, i) => add(`ex:${ex.id}.choices[${i}]`, c.label, (l) => ov(l)?.choices?.[i]));
      }
    }
    // Generation templates
    for (const cfg of enTemplatesFor(n)) {
      cfg.templates.forEach((t, i) => {
        const ov = (l: Lang) => templateOverlay(l, n)[cfg.moduleId]?.[i];
        add(`tm:${cfg.moduleId}[${i}].promptTemplate`, t.promptTemplate, (l) => ov(l)?.promptTemplate);
        add(`tm:${cfg.moduleId}[${i}].hintTemplate`, t.hintTemplate, (l) => ov(l)?.hintTemplate);
        t.params.choiceSets?.forEach((set, s) =>
          set.forEach((c, k) => add(`tm:${cfg.moduleId}[${i}].choiceSets[${s}][${k}]`, c.label, (l) => ov(l)?.choiceSets?.[s]?.[k])),
        );
      });
    }
  }
  // Songs
  for (const [id, songs] of Object.entries(getAllSongReferences())) {
    songs.forEach((s, i) => add(`song:${id}[${i}]`, s.context, (l) => songOverlay(l)[id]?.[i]));
  }
  // Level metadata
  for (const meta of LEVEL_METADATA) {
    for (const f of ['title', 'description', 'difficultyLabel'] as const) {
      add(`lvl:${meta.id}.${f}`, meta[f], (l) => levelMetaOverlay(l)[meta.id]?.[f]);
    }
  }
  return out;
}

/**
 * Stored English-source hashes (src/i18n/content/sourceHashes.json): per key,
 * either one hash (both languages were checked against the same English) or
 * { pt, es } when they differ.
 */
export type StoredHashes = Record<string, string | Partial<Record<Lang, string>>>;

export function storedHash(stored: StoredHashes, key: string, lang: Lang): string | undefined {
  const v = stored[key];
  return typeof v === 'string' ? v : v?.[lang];
}

export interface StaleEntry {
  key: string;
  lang: Lang;
  reason: 'english-changed' | 'not-recorded';
  en: string;
  tr: string | undefined;
}

/** Entries whose English changed since the translation was last checked. */
export function staleEntries(entries: Entry[], stored: StoredHashes): StaleEntry[] {
  const out: StaleEntry[] = [];
  for (const e of entries) {
    const h = sourceHash(e.en);
    for (const lang of LANGS) {
      const s = storedHash(stored, e.key, lang);
      if (s === undefined) out.push({ key: e.key, lang, reason: 'not-recorded', en: e.en, tr: e.tr[lang] });
      else if (s !== h) out.push({ key: e.key, lang, reason: 'english-changed', en: e.en, tr: e.tr[lang] });
    }
  }
  return out;
}

/**
 * 32-bit FNV-1a of a string, as 8 hex digits. Only used to notice that an
 * English string changed; not a security hash.
 */
export function sourceHash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}
