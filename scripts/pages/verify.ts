/**
 * Reads the search pages back from a built dist/ and runs every whole-output
 * check (src/site/check.ts) on them: the counts, every link and anchor, the
 * canonicals, the language twins, the sitemap, the JSON-LD, the size of each
 * page and no raw marker. Used by the build (scripts/pages/build.ts) and by
 * `npm run check:pages`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { siteLessons, SITE_LANGS } from '../../src/site/content';
import { checkSite, pageKindOf, type CheckReport } from '../../src/site/check';
import { rawQueryTokens } from '../../src/site/html';
import { sitePath } from '../../src/site/render';
import type { SlugRegistry } from '../../src/site/slugs';

function walk(dir: string, base = dir, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, base, out);
    else out.push(`/${path.relative(base, full).split(path.sep).join('/')}`);
  }
  return out;
}

export function verifyDist(dist: string, slugs: SlugRegistry): CheckReport {
  if (!existsSync(path.join(dist, 'index.html'))) throw new Error(`no ${dist}/index.html: run the app's build first`);
  const all = walk(dist);
  const pages = new Map<string, string>();
  const files = new Set<string>(['/']);
  for (const file of all) {
    const dirPath = file.endsWith('/index.html') ? file.slice(0, -'index.html'.length) : null;
    if (dirPath && pageKindOf(dirPath)) pages.set(dirPath, readFileSync(path.join(dist, file), 'utf8'));
    else files.add(file);
  }
  if (pages.size === 0) throw new Error(`no search pages under ${dist}/en, /pt, /es: the pages step did not run`);
  const forbidden = new Map<string, string[]>();
  for (const lang of SITE_LANGS) {
    for (const { module } of siteLessons(lang)) {
      const slug = slugs[module.id]?.[lang];
      if (slug) forbidden.set(sitePath.lesson(lang, slug), module.tasks.flatMap((t) => rawQueryTokens(t.instruction)));
    }
  }
  return checkSite(
    {
      pages,
      sitemap: existsSync(path.join(dist, 'sitemap.xml')) ? readFileSync(path.join(dist, 'sitemap.xml'), 'utf8') : '',
      home: readFileSync(path.join(dist, 'index.html'), 'utf8'),
      files,
    },
    { lessons: siteLessons('en').length, forbidden },
  );
}

export function printReport(report: CheckReport, label: string): void {
  const c = report.counts;
  console.log(`${label}: ${c.landing} landing + ${c.index} index + ${c.lesson} lesson + ${c.glossary} glossary pages, ${report.links} links checked, ${report.totalBytes} B in all, largest ${report.largest.path} ${report.largest.bytes} B`);
  for (const p of report.problems) console.error(`  PROBLEM ${p}`);
  console.log(`${label}: ${report.problems.length} problem(s)`);
}
