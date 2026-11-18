/**
 * The search pages' whole-output checks on a dist/ already built
 * (scripts/pages/verify.ts), the not-found page's (/404.html, 2026-11-18)
 * and the test page's own (/test/, 2026-11-14).
 * The build runs them too; this re-runs them alone.
 *
 * Usage: npm run check:pages [-- distDir=dist]
 * Exit 0 = all good; 1 = problems (listed); 2 = no build or no pages.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { printReport, verifyDist, verifyNotFoundPage, verifyTestPage } from './verify';

const dist = path.resolve(process.argv[2] ?? 'dist');
const slugs = JSON.parse(readFileSync(fileURLToPath(new URL('./slugs.json', import.meta.url)), 'utf8'));
try {
  const report = verifyDist(dist, slugs);
  printReport(report, 'check-pages');
  // The not-found page (/404.html, 2026-11-18): its own checks; missing is a problem.
  const notFound = verifyNotFoundPage(dist);
  for (const p of notFound) console.error(`  PROBLEM ${p}`);
  console.log(`check-pages: not-found page, ${notFound.length} problem(s)`);
  // The test page (/test/, 2026-11-14) has its own checks.
  const sheet = verifyTestPage(dist);
  for (const p of sheet) console.error(`  PROBLEM ${p}`);
  console.log(`check-pages: test sheet, ${sheet.length} problem(s)`);
  process.exit(report.problems.length || notFound.length || sheet.length ? 1 : 0);
} catch (e) {
  console.error(`check-pages: ${(e as Error).message}`);
  process.exit(2);
}
