/**
 * The search pages' whole-output checks on a dist/ already built
 * (scripts/pages/verify.ts). The build runs them too; this re-runs them alone.
 *
 * Usage: npm run check:pages [-- distDir=dist]
 * Exit 0 = all good; 1 = problems (listed); 2 = no build or no pages.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { printReport, verifyDist } from './verify';

const dist = path.resolve(process.argv[2] ?? 'dist');
const slugs = JSON.parse(readFileSync(fileURLToPath(new URL('./slugs.json', import.meta.url)), 'utf8'));
try {
  const report = verifyDist(dist, slugs);
  printReport(report, 'check-pages');
  process.exit(report.problems.length ? 1 : 0);
} catch (e) {
  console.error(`check-pages: ${(e as Error).message}`);
  process.exit(2);
}
