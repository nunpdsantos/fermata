/**
 * The search pages (2026-11-14), written into dist/ after `vite build`
 * (`npm run build` = tsc -b && vite build && this): per language a landing
 * page, the lesson index, one page per lesson and the glossary, plain HTML
 * that reads without JavaScript; /pages.css; dist/sitemap.xml; and
 * (2026-11-18) /404.html, the page the host answers an unknown address with.
 * Every page is generated from the app's own data (src/site/content.ts) — no
 * lesson text lives here. Then every page is read back and checked
 * (scripts/pages/verify.ts); a finding fails the build. No network.
 *
 * The service worker neither precaches these files nor answers their
 * addresses (vite.config.ts globIgnores / navigateFallbackDenylist;
 * `npm run check:sw` fails if it does).
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite, notFoundPage, STYLESHEET } from '../../src/site/render';
import { SITE_LANGS } from '../../src/site/content';
import { NOT_FOUND_FILE } from '../../src/site/notFound';
import { pageStylesheet } from '../../src/site/style';
import { printReport, verifyDist, verifyNotFoundPage, verifyTestPage } from './verify';
import { writeTestSheet } from './test-sheet';

const started = performance.now();
const root = fileURLToPath(new URL('../../', import.meta.url));
const dist = path.join(root, 'dist');
if (!existsSync(path.join(dist, 'index.html'))) {
  console.error('pages: no dist/index.html — run `vite build` first (npm run build does both).');
  process.exit(2);
}

const slugs = JSON.parse(readFileSync(path.join(root, 'scripts/pages/slugs.json'), 'utf8'));
let site;
try {
  site = buildSite(slugs);
} catch (e) {
  console.error(`pages: ${(e as Error).message}`);
  process.exit(1);
}

for (const lang of SITE_LANGS) rmSync(path.join(dist, lang), { recursive: true, force: true });
let bytes = 0;
const write = (rel: string, content: string) => {
  const file = path.join(dist, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content, 'utf8');
  bytes += Buffer.byteLength(content);
};
for (const page of site.pages) write(`${page.path.slice(1)}index.html`, page.html);
write('sitemap.xml', site.sitemap);
write(STYLESHEET.slice(1), pageStylesheet(readFileSync(path.join(root, 'src/index.css'), 'utf8'), readFileSync(path.join(root, 'scripts/pages/pages.css'), 'utf8')));
// The not-found page (2026-11-18, audits A21 / Q12): Vercel answers every
// address that is no file with it, status 404 (src/site/notFound.ts).
write(NOT_FOUND_FILE, notFoundPage());
const written = performance.now();

const report = verifyDist(dist, slugs);
printReport(report, 'pages');
const notFoundProblems = verifyNotFoundPage(dist);
for (const p of notFoundProblems) console.error(`  PROBLEM ${p}`);
console.log(`pages: wrote ${site.pages.length} pages + sitemap.xml + ${STYLESHEET.slice(1)} + ${NOT_FOUND_FILE} (${bytes} B) in ${Math.round(written - started)} ms; checked in ${Math.round(performance.now() - written)} ms; ${NOT_FOUND_FILE}: ${notFoundProblems.length} problem(s)`);

// The tester's sheet, /test/ (2026-11-14): its own page, script and stylesheet, and its own checks.
let sheetSizes: Record<string, number>;
try {
  sheetSizes = await writeTestSheet(root, dist);
} catch (e) {
  console.error(`test sheet: ${(e as Error).message}`);
  process.exit(1);
}
const sheetProblems = verifyTestPage(dist);
console.log(`test sheet: wrote ${Object.entries(sheetSizes).map(([f, b]) => `${f} (${b} B)`).join(', ')}; ${sheetProblems.length} problem(s)`);
for (const p of sheetProblems) console.error(`  PROBLEM ${p}`);
process.exit(report.problems.length || notFoundProblems.length || sheetProblems.length ? 1 : 0);
