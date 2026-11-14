import { describe, it, expect, beforeAll } from 'vitest';
import registry from '../../../scripts/pages/slugs.json';
import { loadExercises } from '../../data/exerciseLoader';
import { LEVEL_METADATA } from '../../data/curriculumLoader';
import type { ExerciseDefinition } from '../../core/types/exercise';
import { siteGlossary, siteLevels, siteSongs, SITE_LANGS, type SiteLang } from '../content';
import { buildSite } from '../render';
import { textOf } from '../check';
import type { SlugRegistry } from '../slugs';

/**
 * The checks are never published: no exercise's prompt, answer, hint or
 * nudge appears on any page, in any language — every exercise the app serves
 * (authored and generated, through the app's own loader) against the text
 * of every page. A text short enough to be ordinary lesson vocabulary ("C
 * major", "A minor") is not a leak, so the check looks at strings of
 * MIN_CHARS or more; and a check written in the lesson's own words — an
 * answer that IS a sentence of the lesson, as many are ("4/4 means four
 * quarter-note beats per measure") — is the lesson, published as the app
 * shows it: those are counted and listed apart, never hidden. Its own known
 * positive below proves the check can fail.
 */
const MIN_CHARS = 24;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

interface Secret { id: string; lang: SiteLang; what: string; text: string }

function secretsOf(ex: ExerciseDefinition, lang: SiteLang): Secret[] {
  const out: Secret[] = [{ id: ex.id, lang, what: 'prompt', text: ex.prompt }];
  if (ex.hint) out.push({ id: ex.id, lang, what: 'hint', text: ex.hint });
  if (ex.nudge) out.push({ id: ex.id, lang, what: 'nudge', text: ex.nudge });
  const cfg = ex.config as { choices?: { label: string; correct: boolean }[] };
  for (const c of cfg.choices ?? []) if (c.correct) out.push({ id: ex.id, lang, what: 'answer', text: c.label });
  return out.filter((s) => norm(s.text).length >= MIN_CHARS);
}

/** Every secret found in a page's text (one search over all pages joined, then which page). */
function leaks(pageTexts: ReadonlyMap<string, string>, secrets: readonly Secret[]): string[] {
  const all = [...pageTexts.values()].join('\u0000');
  const found: string[] = [];
  for (const s of secrets) {
    const needle = norm(s.text);
    if (!all.includes(needle)) continue;
    for (const [path, t] of pageTexts) if (t.includes(needle)) found.push(`${s.lang} ${s.id} ${s.what} on ${path}: ${s.text.slice(0, 60)}`);
  }
  return found;
}

/** Everything the app itself shows on its reading pages, every language: the levels, units, lessons, songs and glossary. */
function lessonCorpus(): string {
  const parts: string[] = [];
  for (const lang of SITE_LANGS) {
    for (const level of siteLevels(lang)) {
      parts.push(level.title, level.description);
      for (const unit of level.units) {
        parts.push(unit.title, unit.description);
        for (const m of unit.modules) {
          parts.push(m.title, m.subtitle, ...m.objectives, ...m.concepts.flatMap((c) => [c.title, c.explanation]), ...m.tasks.map((t) => t.instruction));
          parts.push(...siteSongs(m.id, lang).flatMap((s) => [s.song, s.artist, s.context]));
        }
      }
    }
    parts.push(...siteGlossary(lang).flatMap((t) => [t.title, t.plain]));
  }
  return parts.map(norm).join('\u0000');
}

let secrets: Secret[] = [];
let inLessonText: Secret[] = [];
const pageTexts = new Map<string, string>();
const counts = { exercises: 0, prompts: 0, answers: 0 };

beforeAll(async () => {
  const site = buildSite(registry as SlugRegistry);
  for (const p of site.pages) pageTexts.set(p.path, norm(textOf(p.html)));
  for (const lang of SITE_LANGS) {
    for (const { id } of LEVEL_METADATA) {
      for (const list of Object.values(await loadExercises(id, lang))) {
        for (const ex of list) {
          counts.exercises++;
          const s = secretsOf(ex, lang);
          counts.prompts += s.filter((x) => x.what === 'prompt').length;
          counts.answers += s.filter((x) => x.what === 'answer').length;
          secrets = secrets.concat(s);
        }
      }
    }
  }
  const corpus = lessonCorpus();
  inLessonText = secrets.filter((s) => corpus.includes(norm(s.text)));
  secrets = secrets.filter((s) => !inLessonText.includes(s));
}, 120_000);

describe('the checks are never published', () => {
  it('no prompt, answer, hint or nudge of any exercise, in any language, appears on any page', () => {
    // 1,016 exercises in each of the three languages.
    expect(counts.exercises).toBe(3 * 1016);
    expect(counts.prompts).toBeGreaterThan(2500);
    expect(counts.answers).toBeGreaterThan(1000);
    expect(pageTexts.size).toBe(417);
    expect(leaks(pageTexts, secrets)).toEqual([]);
  });

  it('the checks written in the lesson\'s own words are few, and are the lesson\'s words', () => {
    // An answer (or a question) that is a sentence of the lesson itself is not
    // the check being published. Listed so a reader can judge them.
    expect(inLessonText.length).toBeLessThan(60);
    expect(inLessonText.length / (inLessonText.length + secrets.length)).toBeLessThan(0.01);
    expect(new Set(inLessonText.map((s) => s.what))).toEqual(new Set(['answer', 'prompt']));
  });

  it('known positive: a page that quoted a check would be caught (prompt and answer)', () => {
    const prompt = secrets.find((s) => s.what === 'prompt' && s.lang === 'pt')!;
    const answer = secrets.find((s) => s.what === 'answer' && s.lang === 'es')!;
    const planted = new Map(pageTexts);
    planted.set('/pt/licoes/a-escala-maior/', `${planted.get('/pt/licoes/a-escala-maior/')} ${norm(prompt.text)}`);
    planted.set('/es/palabras/', `${planted.get('/es/palabras/')} ${norm(answer.text)}`);
    const found = leaks(planted, [prompt, answer]);
    expect(found).toHaveLength(2);
    expect(found[0]).toMatch(/prompt on \/pt\/licoes\/a-escala-maior\//);
  });
});
