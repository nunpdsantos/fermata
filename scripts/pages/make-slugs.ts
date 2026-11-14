/**
 * Adds the lessons that have no address yet to scripts/pages/slugs.json (the
 * frozen slug registry, src/site/slugs.ts). Existing entries are NEVER
 * changed: a lesson's address stays what it was when its page first went out,
 * whatever happens to its title later.
 *
 * Run: npm run pages:slugs   (after adding a lesson; then commit the file)
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { siteLessons, SITE_LANGS, type SiteLang } from '../../src/site/content';
import { addMissingSlugs, registryProblems, type SlugRegistry } from '../../src/site/slugs';

const FILE = fileURLToPath(new URL('./slugs.json', import.meta.url));

const registry: SlugRegistry = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {};
const byLang = Object.fromEntries(SITE_LANGS.map((l) => [l, siteLessons(l)])) as Record<SiteLang, ReturnType<typeof siteLessons>>;
const lessons = byLang.en.map((l, i) => ({
  id: l.module.id,
  level: l.level.number,
  titles: { en: l.module.title, pt: byLang.pt[i].module.title, es: byLang.es[i].module.title },
}));
const { registry: next, added } = addMissingSlugs(registry, lessons);
// Lesson order, so a diff reads like the curriculum.
const ordered: SlugRegistry = {};
for (const l of lessons) ordered[l.id] = next[l.id];
for (const [id, entry] of Object.entries(next)) if (!ordered[id]) ordered[id] = entry;
const problems = registryProblems(ordered, lessons.map((l) => l.id));
if (problems.length) {
  for (const p of problems) console.error(`pages:slugs: ${p}`);
  process.exit(1);
}
writeFileSync(FILE, `${JSON.stringify(ordered, null, 2)}\n`, 'utf8');
console.log(`pages:slugs: ${added.length} lesson(s) added${added.length ? ` (${added.join(', ')})` : ''}; ${Object.keys(ordered).length} in the registry`);
