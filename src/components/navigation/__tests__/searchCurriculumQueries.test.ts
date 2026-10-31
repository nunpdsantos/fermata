/**
 * W9-01 / W6-09 / W9-23 — Cmd+K answers what the lessons tell you to type.
 *
 * - Every quoted query in every task instruction (EN, PT, ES) and every
 *   Try-This query returns a Cmd+K result and resolves to a theory object.
 *   Before the fix, "C major scale", "C major chord", "F major scale", "C
 *   whole tone scale" and "C altered scale" returned nothing, and the
 *   "C double harmonic major" button was dead.
 * - Portuguese/Spanish scale and chord words are accepted.
 * - Lesson hits match and display Portuguese/Spanish titles (accent-blind).
 * - Index data: English titles/subtitles equal the curriculum; "florid"
 *   points at the fifth-species module.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { getResults } from '../quickSearchResults';
import { resolveTheoryQuery, findQuotedQueries, toEnglishTheoryQuery } from '../../../utils/theoryQuery';
import { MODULE_INDEX, findModulesByQuery } from '../../../data/moduleIndex';
import { loadModuleIndex, type LocalizedModuleIndex } from '../../../data/moduleIndexI18n';
import type { CurriculumUnit } from '../../../core/types/curriculum';
import type { CurriculumLevelOverlay } from '../../../i18n/content/types';

import { L1_UNITS } from '../../../core/constants/curriculumL1';
import { L2_UNITS } from '../../../core/constants/curriculumL2';
import { L3_UNITS } from '../../../core/constants/curriculumL3';
import { L4_UNITS } from '../../../core/constants/curriculumL4';
import { L5_UNITS } from '../../../core/constants/curriculumL5';
import { L6_UNITS } from '../../../core/constants/curriculumL6';
import { L7_UNITS } from '../../../core/constants/curriculumL7';
import { L8_UNITS } from '../../../core/constants/curriculumL8';
import { L9_UNITS } from '../../../core/constants/curriculumL9';
import pt1 from '../../../i18n/content/pt/curriculumL1';
import pt2 from '../../../i18n/content/pt/curriculumL2';
import pt3 from '../../../i18n/content/pt/curriculumL3';
import pt4 from '../../../i18n/content/pt/curriculumL4';
import pt5 from '../../../i18n/content/pt/curriculumL5';
import pt6 from '../../../i18n/content/pt/curriculumL6';
import pt7 from '../../../i18n/content/pt/curriculumL7';
import pt8 from '../../../i18n/content/pt/curriculumL8';
import pt9 from '../../../i18n/content/pt/curriculumL9';
import es1 from '../../../i18n/content/es/curriculumL1';
import es2 from '../../../i18n/content/es/curriculumL2';
import es3 from '../../../i18n/content/es/curriculumL3';
import es4 from '../../../i18n/content/es/curriculumL4';
import es5 from '../../../i18n/content/es/curriculumL5';
import es6 from '../../../i18n/content/es/curriculumL6';
import es7 from '../../../i18n/content/es/curriculumL7';
import es8 from '../../../i18n/content/es/curriculumL8';
import es9 from '../../../i18n/content/es/curriculumL9';

const UNITS: CurriculumUnit[] = [
  ...L1_UNITS, ...L2_UNITS, ...L3_UNITS, ...L4_UNITS, ...L5_UNITS,
  ...L6_UNITS, ...L7_UNITS, ...L8_UNITS, ...L9_UNITS,
];
const MODULES = UNITS.flatMap((u) => u.modules);
const OVERLAYS: Record<'pt' | 'es', CurriculumLevelOverlay[]> = {
  pt: [pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9],
  es: [es1, es2, es3, es4, es5, es6, es7, es8, es9],
};

/** Task instructions per language, keyed `${taskId}`. */
function instructions(lang: 'en' | 'pt' | 'es'): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const mod of MODULES) {
    const ov = lang === 'en' ? null : OVERLAYS[lang].map((o) => o.modules[mod.id]).find(Boolean);
    mod.tasks.forEach((task, i) => {
      out.push([task.id, ov ? ov.tasks[i].instruction : task.instruction]);
    });
  }
  return out;
}

// Quoted tokens that start like a note name but are prose, not queries.
const PROSE_TOKENS = new Set(['Amen', 'Amén', 'Diabelli', 'Bolero', 'Bolero.']);
const QUOTED = /(?<![\p{L}\p{N}])['"‘“«]([^'"‘’“”«»\n]{1,60}?)['"’”»](?![\p{L}\p{N}])/gu;

describe('every query a lesson quotes gets a Cmd+K result', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: every quoted note-led token resolves and returns results`, () => {
      const dead: string[] = [];
      let checked = 0;
      for (const [taskId, text] of instructions(lang)) {
        for (const m of text.matchAll(QUOTED)) {
          const q = m[1].trim();
          if (!/^[A-G]/.test(q) || PROSE_TOKENS.has(q)) continue;
          checked++;
          if (!resolveTheoryQuery(q) || getResults(q).length === 0) dead.push(`${taskId} '${q}'`);
        }
      }
      expect(checked).toBeGreaterThan(300);
      expect(dead, dead.join('\n')).toEqual([]);
    });

    it(`${lang}: every quoted query is rendered as a button (same count as resolvable tokens)`, () => {
      for (const [taskId, text] of instructions(lang)) {
        const resolvable = [...text.matchAll(QUOTED)].filter((m) => {
          const q = m[1].trim();
          return !/^[a-z]$/.test(q) && resolveTheoryQuery(q);
        }).length;
        expect(findQuotedQueries(text).length, taskId).toBe(resolvable);
      }
    });
  }

  it('every task shows the same query buttons in EN, PT and ES', () => {
    const buttons = (lang: 'en' | 'pt' | 'es') =>
      new Map(instructions(lang).map(([id, text]) => [id, findQuotedQueries(text).map((q) => q.query).sort().join(' | ')]));
    const en = buttons('en');
    for (const lang of ['pt', 'es'] as const) {
      const other = buttons(lang);
      const diff = [...en].filter(([id, q]) => other.get(id) !== q).map(([id, q]) => `${lang} ${id}: EN [${q}] vs [${other.get(id)}]`);
      expect(diff, diff.join('\n')).toEqual([]);
    }
  });

  it('a quoted lowercase letter is a word, not a chord button (the rhythm syllable "e")', () => {
    expect(findQuotedQueries('desloca a palma para o "e" entre tempos')).toEqual([]);
    expect(findQuotedQueries("Type 'E' and then 'Em'").map((q) => q.query)).toEqual(['E', 'Em']);
  });

  it('every Try-This query returns a Cmd+K result', () => {
    const dead = MODULES.flatMap((m) => m.concepts)
      .map((c) => c.tryThisQuery)
      .filter((q): q is string => !!q)
      .filter((q) => getResults(q).length === 0);
    expect(dead).toEqual([]);
  });

  it.each([
    ['C major scale', 'Scale', 'C Major'],
    ['F major scale', 'Scale', 'F Major'],
    ['C whole tone scale', 'Scale', 'C Whole Tone'],
    ['C altered scale', 'Scale', 'C Altered'],
    ['D natural minor scale', 'Scale', 'D Natural Minor'],
    ['C double harmonic major', 'Scale', 'C Double Harmonic'],
    ['C major chord', 'Chord', 'C Major'],
    ['Bb major chord', 'Chord', 'Bb Major'],
  ])('"%s" → first result %s %s', (q, type, label) => {
    const [first] = getResults(q);
    expect(first?.type).toBe(type);
    expect(first?.label).toContain(label);
  });

  it('apostrophes are not quotes: "don\'t" does not swallow a real query', () => {
    expect(findQuotedQueries("Don't stop: type 'C major scale', it's the start").map((q) => q.query)).toEqual(['C major scale']);
  });
});

describe('Portuguese and Spanish scale/chord words', () => {
  it.each([
    ['escala de C maior', 'C major scale'],
    ['acorde de Ré menor', 'D minor chord'],
    ['C menor harmónica', 'C harmonic minor'],
    ['Lá menor melódica', 'A melodic minor'],
    ['Fá sustenido menor', 'F# minor'],
    ['Do mayor', 'C major'],
    ['escala de La menor natural', 'A natural minor scale'],
    ['acorde de Sol séptima de dominante', 'G dominant 7th chord'],
    ['tonalidade de G maior', 'key of G major'],
    ['tonalidad de Mi menor', 'key of E minor'],
    ['C pentatónica menor', 'C minor pentatonic'],
    ['D dórico', 'D dorian'],
    ['escala maior de Ré', 'D major scale'],
    ['escala de tons inteiros de C', 'C whole tone scale'],
  ])('"%s" → "%s"', (input, english) => {
    expect(toEnglishTheoryQuery(input)).toBe(english);
  });

  it('English input is left alone (no double translation)', () => {
    expect(toEnglishTheoryQuery('C major scale')).toBeNull();
  });

  it.each([
    ['escala de C maior', 'Scale', 'C Major'],
    ['C maior', 'Scale', 'C Major'],
    ['acorde de C maior', 'Chord', 'C Major'],
    ['acorde de Ré menor', 'Chord', 'D Minor'],
    ['Si menor harmónica', 'Scale', 'B Harmonic Minor'],
    ['Do mayor', 'Scale', 'C Major'],
    ['acorde de La menor', 'Chord', 'A Minor'],
    ['escala de tons inteiros de C', 'Scale', 'Whole Tone'],
    ['G mixolidio', 'Scale', 'G Mixolydian'],
  ])('Cmd+K "%s" → %s %s', (q, type, label) => {
    const hit = getResults(q).find((r) => r.type === type);
    expect(hit?.label).toContain(label);
  });
});

describe('lesson search in Portuguese and Spanish', () => {
  let pt: LocalizedModuleIndex;
  let es: LocalizedModuleIndex;
  beforeAll(async () => {
    pt = (await loadModuleIndex('pt'))!;
    es = (await loadModuleIndex('es'))!;
  });

  const lessonIds = (q: string, idx: LocalizedModuleIndex | null) =>
    getResults(q, idx).filter((r) => r.type === 'Lesson').map((r) => r.label);

  it('PT "cadência" and the accent-less "cadencia" both find the cadence lesson, titled in Portuguese', () => {
    expect(lessonIds('cadência', pt)).toContain('Cadências: O Conjunto Completo');
    expect(lessonIds('cadencia', pt)).toContain('Cadências: O Conjunto Completo');
  });

  it('PT "suspensão" and "napolitano" find their lessons', () => {
    expect(findModulesByQuery('suspensão', 5, pt).map((m) => m.id)).toContain('l4u12m1');
    expect(findModulesByQuery('napolitano', 5, pt).map((m) => m.id)).toContain('l6u18m1');
  });

  it('ES "retardo", "cadencia rota" and "dórico" find their lessons', () => {
    expect(findModulesByQuery('retardo', 5, es).map((m) => m.id)).toContain('l4u12m1');
    expect(findModulesByQuery('cadencia rota', 5, es).map((m) => m.id)).toContain('l3u11m1');
    expect(findModulesByQuery('dorico', 5, es).map((m) => m.id)).toContain('l7u22m4');
  });

  it('the singular "dominante secundária/secundaria" finds the secondary-dominant lessons', () => {
    expect(findModulesByQuery('dominante secundária', 5, pt).map((m) => m.id)).toEqual(expect.arrayContaining(['l5u15m1', 'l5u15m2']));
    expect(findModulesByQuery('dominante secundaria', 5, es).map((m) => m.id)).toEqual(expect.arrayContaining(['l5u15m1', 'l5u15m2']));
  });

  it('a bare solfège syllable is the note, never "D diminished" for "do"', () => {
    for (const idx of [null, pt, es]) {
      const chords = getResults('do', idx).filter((r) => r.type === 'Chord').map((r) => r.label);
      expect(chords[0]).toBe('C Major');
      expect(chords.join(' ')).not.toMatch(/D Diminished/);
    }
    expect(getResults('sol', es).find((r) => r.type === 'Chord')?.label).toBe('G Major');
    expect(findQuotedQueries('En el solfeo móvil, «do» representa la tónica')).toEqual([]);
  });

  it('English terms still work in PT mode, and the hit shows the PT title', () => {
    const [hit] = findModulesByQuery('neapolitan', 5, pt);
    expect(hit.id).toBe('l6u18m1');
    expect(hit.title).toBe(pt.titles.l6u18m1[0]);
  });

  it('without a localized index the titles stay English', () => {
    expect(findModulesByQuery('cadência', 5, null)).toEqual([]);
    expect(findModulesByQuery('cadence', 5, null)[0].title).toMatch(/Cadence/);
  });
});

describe('search index data (W9-23)', () => {
  it('"florid" points at the fifth-species module first', () => {
    expect(findModulesByQuery('florid')[0].id).toBe('l6u20m2');
    expect(findModulesByQuery('florid').map((m) => m.id)).not.toContain('l6u20m1');
  });

  it('every English index title and subtitle equals the curriculum', () => {
    const byId = new Map(MODULES.map((m) => [m.id, m]));
    const drift = MODULE_INDEX.filter((e) => {
      const m = byId.get(e.id);
      return !m || m.title !== e.title || m.subtitle !== e.subtitle;
    }).map((e) => `${e.id}: index "${e.title}" / "${e.subtitle}"`);
    expect(drift, drift.join('\n')).toEqual([]);
    expect(MODULE_INDEX.map((e) => e.id)).toEqual(MODULES.map((m) => m.id));
  });
});
