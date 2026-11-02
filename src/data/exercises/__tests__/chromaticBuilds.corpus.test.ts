/**
 * Build questions whose answer is DERIVED from a key or another chord, graded
 * by an independent pitch-class oracle over every item the templates can
 * generate (the whole parameter space) plus the authored items:
 *
 * - W4-03 tritone substitution: the graded chord is the substitute — the
 *   dominant seventh a tritone (6 semitones) from the original V7 — never
 *   the original. "the V7 of K major" → original root K+7 → substitute K+1
 *   (♭II, spelled on the letter above K: D♭ in C, not C♯).
 * - W4-27 Neapolitan / German sixth: the prompt names the minor key K; the
 *   Neapolitan is the major triad on ♭2 (K+1, letter above K); the German
 *   sixth sounds as the dominant seventh on ♭6 (K+8, five letters above K:
 *   A♭ in C minor).
 * - W4-14 the "augmented, diminished or compound" interval module produces
 *   exactly those, each spelled with at most one accidental.
 */
import { describe, it, expect } from 'vitest';
import type { ChordBuildConfig, IntervalIdConfig } from '../../../core/types/exercise';
import { generateExercises } from '../exerciseGenerator';
import { spelledIntervalName } from '../../../components/learn/exercises/exerciseHelpers';
import { CONTENT_LANGS, levelCorpus, templatesFor } from './learnCorpus';

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACC: Record<string, number> = { '': 0, '#': 1, b: -1, '##': 2, bb: -2, '♯': 1, '♭': -1 };
const pcOf = (name: string) => (((LETTER_PC[name[0]] + ACC[name.slice(1)]) % 12) + 12) % 12;
const letterUp = (name: string, steps: number) => LETTERS[(LETTERS.indexOf(name[0]) + steps) % 7];
const NOTE = '([A-G](?:#|b|♯|♭)?)';

/** Every chord_build item a module can serve: its authored items and its templates' whole root space. */
function chordBuildSpace(level: number, moduleId: string): { id: string; prompt: string; cfg: ChordBuildConfig }[] {
  const out: { id: string; prompt: string; cfg: ChordBuildConfig }[] = [];
  for (const item of levelCorpus(level, 'en')) {
    if (item.moduleId === moduleId && item.source === 'authored' && item.exercise.config.type === 'chord_build') {
      out.push({ id: item.exercise.id, prompt: item.exercise.prompt, cfg: item.exercise.config });
    }
  }
  const mc = templatesFor(level, 'en').find((c) => c.moduleId === moduleId);
  mc?.templates.forEach((t, ti) => {
    if (t.type !== 'chord_build') return;
    (t.params.roots ?? []).forEach((_, ri) => {
      // A one-root slice of the template generates exactly that root's item.
      const slice = { ...t, params: { ...t.params, roots: [t.params.roots![ri]], accidentals: [t.params.accidentals?.[ri] ?? ''], keys: t.params.keys ? [t.params.keys[ri]] : undefined, chordQualities: t.params.chordQualities?.length === t.params.roots!.length ? [t.params.chordQualities[ri]] : t.params.chordQualities } };
      for (const e of generateExercises({ moduleId: `${moduleId}-space`, targetCount: 1, templates: [slice] }, 1)) {
        out.push({ id: `${moduleId}[${ti}] root ${ri}`, prompt: e.prompt, cfg: e.config as ChordBuildConfig });
      }
    });
  });
  return out;
}

const rootName = (c: ChordBuildConfig) => `${c.root}${c.rootAccidental}`;

describe('tritone-substitution builds grade the substitute (W4-03)', () => {
  const items = chordBuildSpace(7, 'l7u21m4').filter((i) => /tritone sub/i.test(i.prompt));

  it('covers the template space and the authored item', () => {
    expect(items.length).toBeGreaterThanOrEqual(6);
  });

  it('every item: the graded chord is the dominant 7th a tritone from the original V7', () => {
    const bad: string[] = [];
    for (const { id, prompt, cfg } of items) {
      const ofKey = new RegExp(`V7 of ${NOTE} major`).exec(prompt);
      const ofChord = new RegExp(`(?:of|for) ${NOTE}7\\b`).exec(prompt);
      const original = ofKey ? (pcOf(ofKey[1]) + 7) % 12 : ofChord ? pcOf(ofChord[1]) : null;
      if (original === null) { bad.push(`${id}: prompt names no original dominant: "${prompt}"`); continue; }
      if (cfg.quality !== 'dominant7') bad.push(`${id}: quality ${cfg.quality}`);
      if (pcOf(rootName(cfg)) !== (original + 6) % 12) bad.push(`${id}: graded ${rootName(cfg)}7 for "${prompt}"`);
      // Spelled as ♭II of the key (letter above the tonic).
      if (ofKey && cfg.root !== letterUp(ofKey[1], 1)) bad.push(`${id}: ${rootName(cfg)} is not spelled as ♭II of ${ofKey[1]}`);
    }
    expect(bad).toEqual([]);
  });
});

describe('Neapolitan and German-sixth builds name their key (W4-27)', () => {
  const neapolitan = chordBuildSpace(6, 'l6u18m1');
  const german = chordBuildSpace(6, 'l6u18m3');

  it('covers both modules', () => {
    expect(neapolitan.length).toBeGreaterThanOrEqual(5);
    expect(german.length).toBeGreaterThanOrEqual(5);
  });

  it('Neapolitan: major triad on ♭2 of the named minor key', () => {
    const bad: string[] = [];
    for (const { id, prompt, cfg } of neapolitan) {
      const m = new RegExp(`(?:of|in) ${NOTE} minor`).exec(prompt);
      if (!m) { bad.push(`${id}: no key in "${prompt}"`); continue; }
      if (cfg.quality !== 'major') bad.push(`${id}: quality ${cfg.quality}`);
      if (pcOf(rootName(cfg)) !== (pcOf(m[1]) + 1) % 12 || cfg.root !== letterUp(m[1], 1)) bad.push(`${id}: ${rootName(cfg)} is not ♭II of ${m[1]} minor`);
    }
    expect(bad).toEqual([]);
  });

  it('German sixth: sounds as the dominant 7th on ♭6 of the named minor key', () => {
    const bad: string[] = [];
    for (const { id, prompt, cfg } of german) {
      if (!/german/i.test(prompt)) continue;
      const m = new RegExp(`(?:of|in) ${NOTE} minor`).exec(prompt);
      if (!m) { bad.push(`${id}: no key in "${prompt}"`); continue; }
      if (cfg.quality !== 'dominant7') bad.push(`${id}: quality ${cfg.quality}`);
      if (pcOf(rootName(cfg)) !== (pcOf(m[1]) + 8) % 12 || cfg.root !== letterUp(m[1], 5)) bad.push(`${id}: ${rootName(cfg)} is not ♭6 of ${m[1]} minor`);
    }
    expect(bad).toEqual([]);
  });

  it('German sixth hint spells the chord of ITS key: ♭6–1–♭3–♯4 (letters 6, 1, 3, 4; sizes 8, 0, 3, 6)', () => {
    const t = templatesFor(6, 'en').find((c) => c.moduleId === 'l6u18m3')!.templates.find((x) => x.type === 'chord_build')!;
    const bad: string[] = [];
    t.params.keys!.forEach((k, i) => {
      const want = [[5, 8], [0, 0], [2, 3], [3, 6]].map(([steps, semis]) => ({ letter: letterUp(k, steps), pc: (pcOf(k) + semis) % 12 }));
      const got = t.params.spellings![i].split('–');
      if (got.length !== 4 || got.some((n, j) => n[0] !== want[j].letter || pcOf(n) !== want[j].pc)) bad.push(`${k} minor: ${t.params.spellings![i]}`);
    });
    expect(t.hintTemplate).toContain('{spelling}');
    expect(t.hintTemplate).not.toMatch(/C minor/);
    expect(bad).toEqual([]);
  });

  for (const lang of CONTENT_LANGS) {
    it(`${lang}: no chord-build prompt calls a chord Neapolitan or German sixth without a key`, () => {
      const bad: string[] = [];
      for (const { exercise } of levelCorpus(6, lang)) {
        if (exercise.config.type !== 'chord_build') continue;
        if (/napolit|neapolit|alem|german/i.test(exercise.prompt) && !/[A-G](?:#|b)? (minor|menor)/.test(exercise.prompt)) bad.push(`${exercise.id}: ${exercise.prompt}`);
      }
      expect(bad).toEqual([]);
    });
  }
});

/**
 * Every build derived from a named key ({key} templates): the graded root is
 * the degree the prompt names, by its size above the tonic and its letter.
 * [prompt pattern, semitones above the key, letters above the key, quality]
 * — from the major scale 0 2 4 5 7 9 11 (harmonic minor's raised 7th = 11)
 * and each chord's definition.
 */
const KEYED_RULES: [RegExp, number, number, string][] = [
  [/\bvi7\b/, 9, 5, 'minor7'],
  [/\biii7\b/, 4, 2, 'minor7'],
  [/viiø7/, 11, 6, 'half_diminished7'],
  [/vii°7/, 11, 6, 'diminished7'],
  [/neapolitan/i, 1, 1, 'major'],
  [/german/i, 8, 5, 'dominant7'],
  [/\bV\+/, 7, 4, 'augmented'],
  [/tritone substitute/i, 1, 1, 'dominant7'],
  [/upper-structure triad/i, 2, 1, 'major'],
  [/V7 that leads into/, 7, 4, 'dominant7'],
  [/\b6m\b/, 9, 5, 'minor'],
  [/♭VII/, 10, 6, 'major'],
  [/♭VI\b/, 8, 5, 'major'],
  [/\biv chord\b/, 5, 3, 'minor'],
];

describe('every keyed build grades the chord its prompt names (W4-01, W4-03, W4-27)', () => {
  const keyed = [3, 4, 5, 6, 7, 8].flatMap((n) =>
    templatesFor(n, 'en').flatMap((c) => c.templates.map((t, i) => ({ id: `${c.moduleId}[${i}]`, t, n, moduleId: c.moduleId, index: i })).filter(({ t }) => t.params.keys)),
  );

  it('finds the keyed templates', () => {
    expect(keyed.length).toBeGreaterThanOrEqual(12);
  });

  it('each keyed template matches exactly one rule and every root is that degree of its key', () => {
    const bad: string[] = [];
    for (const { id, t } of keyed) {
      const rules = KEYED_RULES.filter(([re]) => re.test(t.promptTemplate));
      if (rules.length !== 1) { bad.push(`${id}: ${rules.length} rules match "${t.promptTemplate}"`); continue; }
      const [, semis, letters, quality] = rules[0];
      const p = t.params;
      p.roots!.forEach((r, ri) => {
        const root = r + (p.accidentals?.[ri] ?? '');
        const key = p.keys![ri];
        const q = p.chordQualities!.length === p.roots!.length ? p.chordQualities![ri] : p.chordQualities![0];
        if (q !== quality) bad.push(`${id} ${key}: quality ${q}, want ${quality}`);
        if (pcOf(root) !== (pcOf(key) + semis) % 12 || r !== letterUp(key, letters)) bad.push(`${id} ${key}: root ${root}, want ${letterUp(key, letters)} at +${semis}`);
      });
      if (!t.promptTemplate.includes('{key}')) bad.push(`${id}: prompt does not name the key`);
      if (t.promptTemplate.includes('{root}')) bad.push(`${id}: prompt gives the root away`);
    }
    expect(bad).toEqual([]);
  });

  for (const lang of ['pt', 'es'] as const) {
    it(`${lang}: the keyed prompts name the key and keep the root out`, () => {
      const bad: string[] = [];
      for (const { id, n, moduleId, index } of keyed) {
        const t = templatesFor(n, lang).find((c) => c.moduleId === moduleId)!.templates[index];
        if (!t.promptTemplate.includes('{key}') || t.promptTemplate.includes('{root}')) bad.push(`${id}: ${t.promptTemplate}`);
      }
      expect(bad).toEqual([]);
    });
  }
});

describe('"augmented, diminished or compound" intervals are exactly that (W4-14)', () => {
  const items = levelCorpus(2, 'en').filter((i) => i.moduleId === 'l2u7m2' && i.source === 'generated' && i.exercise.config.type === 'interval_id');
  const tpl = templatesFor(2, 'en').find((c) => c.moduleId === 'l2u7m2')!.templates.find((t) => t.type === 'interval_id')!;

  it('the module generates interval items', () => {
    expect(items.length).toBeGreaterThan(0);
  });

  it('every template interval is spelled, and augmented, diminished or compound', () => {
    const { intervals = [], intervalNumbers = [] } = tpl.params;
    expect(intervalNumbers).toHaveLength(intervals.length);
    const bad = intervals
      .map((s, i) => ({ s, n: intervalNumbers[i], name: spelledIntervalName(intervalNumbers[i], s) }))
      .filter(({ n, name }) => !name || !(/^(Augmented|Diminished) /.test(name) || n >= 9));
    expect(bad).toEqual([]);
  });

  it('every root × interval spells its upper note with at most one accidental', () => {
    const { roots = [], accidentals = [], intervals = [], intervalNumbers = [] } = tpl.params;
    const bad: string[] = [];
    roots.forEach((r, ri) => intervals.forEach((s, ii) => {
      const root = r + (accidentals[ri] ?? '');
      const letter = letterUp(root, intervalNumbers[ii] - 1);
      let off = ((pcOf(root) + s - LETTER_PC[letter]) % 12 + 12) % 12;
      if (off > 6) off -= 12;
      if (Math.abs(off) > 1) bad.push(`${root} + ${spelledIntervalName(intervalNumbers[ii], s)} needs ${letter} with ${off}`);
    }));
    expect(bad).toEqual([]);
  });

  it('every served item carries its interval number', () => {
    expect(items.filter((i) => (i.exercise.config as IntervalIdConfig).intervalNumber === undefined).map((i) => i.exercise.id)).toEqual([]);
  });
});
