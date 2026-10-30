/**
 * W6-14 — structural parity of the PT/ES translations with English
 * (the 2026-10 audit's structural.ts, promoted to a test).
 *
 * Locale files: same keys, same {{placeholders}}, same plural bases, no empty
 * values. Overlays: every English unit, module, exercise, template, song and
 * level has a PT and ES entry with the same counts (concepts, tasks,
 * objectives, choices, choice sets), nothing empty, no extra ids, no
 * duplicate answer labels, no choices on an exercise type that ignores them,
 * and no English hint left showing because the overlay lacks one.
 */
import { describe, it, expect } from 'vitest';
import en from '../../locales/en.json';
import ptLocale from '../../locales/pt.json';
import esLocale from '../../locales/es.json';
import { getAllSongReferences } from '../../../data/songReferences';
import { LEVEL_METADATA } from '../../../data/levelMetadata';
import {
  LANGS,
  EN_UNITS,
  enExercisesFor,
  enTemplatesFor,
  curriculumOverlay,
  exerciseOverlay,
  templateOverlay,
  songOverlay,
  levelMetaOverlay,
  overlayEntries,
} from './overlayEntries';

type Json = Record<string, unknown>;
function flatten(o: Json, p = ''): Record<string, string> {
  const r: Record<string, string> = {};
  for (const [k, v] of Object.entries(o)) {
    const key = p ? `${p}.${k}` : k;
    if (v && typeof v === 'object') Object.assign(r, flatten(v as Json, key));
    else r[key] = String(v);
  }
  return r;
}
const placeholders = (s: string) => [...new Set([...s.matchAll(/\{\{\s*([\w.]+)\s*\}\}/g)].map((m) => m[1]))].sort().join(',');
const PLURAL = /_(zero|one|two|few|many|other)$/;

const EN = flatten(en as Json);
const LOCALES = { pt: flatten(ptLocale as Json), es: flatten(esLocale as Json) };

describe('locale files', () => {
  for (const lang of LANGS) {
    it(`${lang}: same keys as English, same placeholders, nothing empty`, () => {
      const L = LOCALES[lang];
      const problems: string[] = [];
      for (const k of Object.keys(EN)) {
        if (!(k in L)) problems.push(`missing ${k}`);
        else {
          if (placeholders(EN[k]) !== placeholders(L[k])) problems.push(`placeholders ${k}: EN {${placeholders(EN[k])}} vs {${placeholders(L[k])}}`);
          if (!L[k].trim() && EN[k].trim()) problems.push(`empty ${k}`);
        }
      }
      for (const k of Object.keys(L)) if (!(k in EN)) problems.push(`extra ${k}`);
      expect(problems).toEqual([]);
    });

    it(`${lang}: same plural forms as English`, () => {
      const bases = (keys: string[]) =>
        [...new Set(keys.filter((k) => PLURAL.test(k)).map((k) => `${k.replace(PLURAL, '')}:${k.match(PLURAL)![1]}`))].sort();
      expect(bases(Object.keys(LOCALES[lang]))).toEqual(bases(Object.keys(EN)));
    });
  }

  it('every count-bearing string either pluralises or is on the reviewed list', () => {
    // {{count}} is always > 1 here (a scale/chord note count, a level's module
    // count, a sprint score shown after a number label).
    const ALWAYS_PLURAL = new Set([
      'explore.notes', 'exerciseFeedback.scaleIncorrect', 'exerciseFeedback.chordIncorrect',
      'celebration.modulesCompleted', 'panel.noteCount', 'drill.sprint.best',
    ]);
    const missing = Object.keys(EN).filter((k) => /\{\{\s*count\s*\}\}/.test(EN[k]) && !PLURAL.test(k) && !ALWAYS_PLURAL.has(k));
    expect(missing).toEqual([]);
  });
});

describe('content overlays', () => {
  for (const lang of LANGS) {
    it(`${lang}: curriculum — every unit/module, same counts, nothing empty, nothing extra`, () => {
      const problems: string[] = [];
      for (let n = 1; n <= 9; n++) {
        const ov = curriculumOverlay(lang, n);
        const unitIds = new Set(EN_UNITS[n].map((u) => u.id));
        const modIds = new Set(EN_UNITS[n].flatMap((u) => u.modules.map((m) => m.id)));
        for (const u of EN_UNITS[n]) {
          if (!ov.units[u.id]) problems.push(`L${n} unit ${u.id} missing`);
          for (const m of u.modules) {
            const o = ov.modules[m.id];
            if (!o) { problems.push(`${m.id} missing`); continue; }
            for (const f of ['concepts', 'tasks', 'objectives'] as const) {
              if (o[f].length !== m[f].length) problems.push(`${m.id}.${f}: EN ${m[f].length} vs ${o[f].length}`);
            }
            if (!o.title.trim() || !o.subtitle.trim()) problems.push(`${m.id} title/subtitle empty`);
            o.concepts.forEach((c, i) => {
              if (!c.title.trim() || !c.explanation.trim() || !c.tryThisLabel.trim()) problems.push(`${m.id}.concepts[${i}] empty field`);
            });
          }
        }
        for (const id of Object.keys(ov.units)) if (!unitIds.has(id)) problems.push(`L${n} extra unit ${id}`);
        for (const id of Object.keys(ov.modules)) if (!modIds.has(id)) problems.push(`extra module ${id}`);
      }
      expect(problems).toEqual([]);
    });

    it(`${lang}: exercises — every exercise, hints present, choice counts match, no duplicates`, () => {
      const problems: string[] = [];
      for (let n = 1; n <= 9; n++) {
        const ov = exerciseOverlay(lang, n);
        const exs = Object.values(enExercisesFor(n)).flat();
        const ids = new Set(exs.map((e) => e.id));
        for (const e of exs) {
          const o = ov[e.id];
          if (!o) { problems.push(`${e.id} missing`); continue; }
          if (!o.prompt.trim()) problems.push(`${e.id} empty prompt`);
          if (e.hint && !o.hint) problems.push(`${e.id} hint falls back to English`);
          const cfg = e.config as { type: string; choices?: { label: string }[] };
          const applies = cfg.type === 'multiple_choice' || cfg.type === 'ear_training';
          if (cfg.choices && applies) {
            if (!o.choices) problems.push(`${e.id} choices missing (English shown)`);
            else {
              if (o.choices.length !== cfg.choices.length) problems.push(`${e.id} choices: EN ${cfg.choices.length} vs ${o.choices.length}`);
              if (new Set(o.choices).size !== o.choices.length) problems.push(`${e.id} duplicate choice labels`);
            }
          } else if (o.choices) problems.push(`${e.id} has choices the ${cfg.type} exercise ignores`);
        }
        for (const id of Object.keys(ov)) if (!ids.has(id)) problems.push(`extra exercise ${id}`);
      }
      expect(problems).toEqual([]);
    });

    it(`${lang}: templates — every module/template, choice sets match, no duplicates`, () => {
      const problems: string[] = [];
      for (let n = 1; n <= 9; n++) {
        const ov = templateOverlay(lang, n);
        const cfgs = enTemplatesFor(n);
        for (const cfg of cfgs) {
          const o = ov[cfg.moduleId];
          if (!o) { problems.push(`${cfg.moduleId} templates missing`); continue; }
          if (o.length !== cfg.templates.length) problems.push(`${cfg.moduleId}: EN ${cfg.templates.length} templates vs ${o.length}`);
          cfg.templates.forEach((t, i) => {
            const sets = t.params.choiceSets;
            const os = o[i]?.choiceSets;
            if (sets) {
              if (!os) { problems.push(`${cfg.moduleId}[${i}] choiceSets missing`); return; }
              if (os.length !== sets.length) problems.push(`${cfg.moduleId}[${i}]: EN ${sets.length} sets vs ${os.length}`);
              sets.forEach((set, s) => {
                if (os[s] && os[s].length !== set.length) problems.push(`${cfg.moduleId}[${i}] set ${s}: EN ${set.length} vs ${os[s].length}`);
                if (os[s] && new Set(os[s]).size !== os[s].length) problems.push(`${cfg.moduleId}[${i}] set ${s} duplicate labels`);
              });
            } else if (os) problems.push(`${cfg.moduleId}[${i}] has choiceSets English lacks`);
          });
        }
        const ids = new Set(cfgs.map((c) => c.moduleId));
        for (const id of Object.keys(ov)) if (!ids.has(id)) problems.push(`extra template module ${id}`);
      }
      expect(problems).toEqual([]);
    });

    it(`${lang}: songs and level metadata`, () => {
      const problems: string[] = [];
      const songs = getAllSongReferences();
      for (const [id, list] of Object.entries(songs)) {
        if (songOverlay(lang)[id]?.length !== list.length) problems.push(`songs ${id}: EN ${list.length} vs ${songOverlay(lang)[id]?.length}`);
      }
      for (const id of Object.keys(songOverlay(lang))) if (!(id in songs)) problems.push(`extra songs ${id}`);
      for (const meta of LEVEL_METADATA) if (!levelMetaOverlay(lang)[meta.id]) problems.push(`level ${meta.id} missing`);
      expect(problems).toEqual([]);
    });
  }

  it('every English entry has non-empty PT and ES text', () => {
    const missing = overlayEntries()
      .flatMap((e) => LANGS.filter((l) => !e.tr[l]?.trim()).map((l) => `${l} ${e.key}`));
    expect(missing).toEqual([]);
  });
});
