/**
 * A lesson page's address word (its "slug"): /en/lessons/<slug>/.
 *
 * Made ONCE from the lesson's title in each language and then FROZEN in the
 * checked-in registry scripts/pages/slugs.json (module id → { en, pt, es }):
 * the build reads the registry, never the title, so a later change of title
 * never moves a page (an address once indexed or shared keeps working). A
 * lesson missing from the registry fails the build with the command that
 * adds it (`npm run pages:slugs`, which only ever ADDS missing lessons).
 */
import type { SiteLang } from './content';

export type SlugRegistry = Record<string, Record<SiteLang, string>>;

/** Lower-case ASCII words joined by single hyphens. */
export const SLUG_FORM = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Longer titles are cut at a word boundary. */
export const MAX_SLUG_LENGTH = 60;

/** A title's slug: diacritics folded, ASCII, lower case, hyphens, at most MAX_SLUG_LENGTH. */
export function slugify(title: string): string {
  const words = title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[æ]/gi, 'ae')
    .replace(/[œ]/gi, 'oe')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  let slug = '';
  for (const w of words) {
    const next = slug ? `${slug}-${w}` : w;
    if (next.length > MAX_SLUG_LENGTH && slug) break;
    slug = next.slice(0, MAX_SLUG_LENGTH);
  }
  return slug;
}

/**
 * The registry with the missing lessons added (titles slugified; a slug
 * already taken in that language gets the lesson's level appended, then a
 * number). Entries already there are never changed.
 */
export function addMissingSlugs(
  registry: SlugRegistry,
  lessons: ReadonlyArray<{ id: string; level: number; titles: Record<SiteLang, string> }>,
): { registry: SlugRegistry; added: string[] } {
  const out: SlugRegistry = { ...registry };
  const taken: Record<SiteLang, Set<string>> = { en: new Set(), pt: new Set(), es: new Set() };
  for (const entry of Object.values(out)) for (const lang of Object.keys(taken) as SiteLang[]) taken[lang].add(entry[lang]);
  const added: string[] = [];
  for (const lesson of lessons) {
    if (out[lesson.id]) continue;
    const entry = {} as Record<SiteLang, string>;
    for (const lang of Object.keys(taken) as SiteLang[]) {
      const base = slugify(lesson.titles[lang]) || lesson.id;
      let slug = base;
      if (taken[lang].has(slug)) slug = `${base}-level-${lesson.level}`;
      for (let n = 2; taken[lang].has(slug); n++) slug = `${base}-${n}`;
      taken[lang].add(slug);
      entry[lang] = slug;
    }
    out[lesson.id] = entry;
    added.push(lesson.id);
  }
  return { registry: out, added };
}

/**
 * Problems with the registry against the lessons that exist: a lesson with no
 * entry, a slug not in the frozen form, a slug used twice in one language,
 * an entry for a lesson that no longer exists. Empty = good.
 */
export function registryProblems(registry: SlugRegistry, lessonIds: readonly string[]): string[] {
  const problems: string[] = [];
  const ids = new Set(lessonIds);
  for (const id of lessonIds) {
    if (!registry[id]) problems.push(`lesson ${id} has no address in scripts/pages/slugs.json — run \`npm run pages:slugs\` to add it (existing addresses never change)`);
  }
  const seen: Record<string, Map<string, string>> = { en: new Map(), pt: new Map(), es: new Map() };
  for (const [id, entry] of Object.entries(registry)) {
    if (!ids.has(id)) problems.push(`scripts/pages/slugs.json names ${id}, which is no lesson`);
    for (const lang of ['en', 'pt', 'es'] as const) {
      const slug = entry?.[lang];
      if (typeof slug !== 'string' || !SLUG_FORM.test(slug) || slug.length > MAX_SLUG_LENGTH) {
        problems.push(`${id} (${lang}): "${String(slug)}" is not a slug (lower-case ASCII words and hyphens, at most ${MAX_SLUG_LENGTH})`);
        continue;
      }
      const other = seen[lang].get(slug);
      if (other) problems.push(`${id} and ${other} share the ${lang} address "${slug}"`);
      seen[lang].set(slug, id);
    }
  }
  return problems;
}
