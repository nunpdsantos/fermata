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
import { checkNotFoundPage, checkSite, pageKindOf, type CheckReport } from '../../src/site/check';
import { NOT_FOUND_FILE } from '../../src/site/notFound';
import { rawQueryTokens } from '../../src/site/html';
import { sitePath } from '../../src/site/render';
import type { SlugRegistry } from '../../src/site/slugs';
import { checkTestPage } from '../../src/site/testSheet/check';
import { TEST_PATH, TEST_SCRIPT } from '../../src/site/testSheet/page';

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

/**
 * The not-found page (/404.html, 2026-11-18, audits A21 / Q12) read back
 * from dist/ and checked on its own (src/site/check.ts checkNotFoundPage):
 * there, noindex, no script, its links and words, every address absolute and
 * in the build, not in the sitemap. A build without it is a problem.
 */
export function verifyNotFoundPage(dist: string): string[] {
  const file = path.join(dist, NOT_FOUND_FILE);
  return checkNotFoundPage({
    html: existsSync(file) ? readFileSync(file, 'utf8') : null,
    files: new Set(walk(dist)),
    sitemap: existsSync(path.join(dist, 'sitemap.xml')) ? readFileSync(path.join(dist, 'sitemap.xml'), 'utf8') : '',
  });
}

/**
 * The test page (/test/, 2026-11-14) read back from dist/ and checked on its
 * own (src/site/testSheet/check.ts): noindex, its script external and
 * same-origin, its data block whole, and linked from nowhere — not the
 * sitemap, not robots.txt, no search page, nothing of the app.
 */
export function verifyTestPage(dist: string): string[] {
  const read = (rel: string) => readFileSync(path.join(dist, rel), 'utf8');
  if (!existsSync(path.join(dist, TEST_PATH.slice(1), 'index.html'))) return [`${TEST_PATH}: not in the build (dist${TEST_PATH}index.html is missing)`];
  const all = walk(dist);
  const pages = new Map<string, string>();
  const appCode = new Map<string, string>();
  for (const file of all) {
    const dirPath = file.endsWith('/index.html') ? file.slice(0, -'index.html'.length) : null;
    if (dirPath && pageKindOf(dirPath)) pages.set(dirPath, read(file));
    else if (/^\/assets\/.*\.js$|^\/sw\.js$|^\/workbox-[^/]*\.js$|^\/manifest\.webmanifest$/.test(file)) appCode.set(file, read(file));
  }
  return checkTestPage({
    html: read(`${TEST_PATH.slice(1)}index.html`),
    script: existsSync(path.join(dist, TEST_SCRIPT.slice(1))) ? read(TEST_SCRIPT.slice(1)) : '',
    files: new Set(all),
    sitemap: existsSync(path.join(dist, 'sitemap.xml')) ? read('sitemap.xml') : '',
    robots: existsSync(path.join(dist, 'robots.txt')) ? read('robots.txt') : '',
    home: read('index.html'),
    pages,
    appCode,
  });
}
