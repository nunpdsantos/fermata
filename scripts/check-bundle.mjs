#!/usr/bin/env node
/**
 * Entry-bundle guard for the production build (audit W9-11).
 *
 *  - The entry JS (the script index.html loads) stays under 500 kB.
 *  - ts-fsrs (Drill's scheduler) stays OUT of the entry (CLAUDE.md gotcha).
 *  - The fretboard and Quick Search stay in their own lazy chunks.
 *
 * Usage: node scripts/check-bundle.mjs [distDir=dist]
 * Exit 0 = all good; 1 = a budget broken (listed); 2 = no build.
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] ?? 'dist');
const indexHtml = path.join(dist, 'index.html');
if (!fs.existsSync(indexHtml)) {
  console.error(`check-bundle: no ${indexHtml} — run \`npm run build\` first.`);
  process.exit(2);
}

const ENTRY_BUDGET_BYTES = 500_000;
const html = fs.readFileSync(indexHtml, 'utf8');
const entryMatch = html.match(/<script[^>]+type="module"[^>]+src="\/?(assets\/index-[^"]+\.js)"/);
if (!entryMatch) {
  console.error('check-bundle: could not find the entry <script type="module" src="/assets/index-*.js"> in index.html');
  process.exit(2);
}
const entryPath = path.join(dist, entryMatch[1]);
const entry = fs.readFileSync(entryPath, 'utf8');
const entryBytes = Buffer.byteLength(entry);
const assets = fs.readdirSync(path.join(dist, 'assets'));

const problems = [];
if (entryBytes > ENTRY_BUDGET_BYTES) {
  problems.push(`entry ${entryMatch[1]} is ${entryBytes} B (budget ${ENTRY_BUDGET_BYTES} B)`);
}
// ts-fsrs markers: its default-parameters field names (minified code keeps
// object keys). Checked against the drill chunk below so the probe can't rot.
const FSRS_MARKERS = ['request_retention', 'maximum_interval'];
const drillChunk = assets.find((f) => /^drillStore-.*\.js$/.test(f));
if (!drillChunk || !FSRS_MARKERS.some((m) => fs.readFileSync(path.join(dist, 'assets', drillChunk), 'utf8').includes(m))) {
  problems.push('ts-fsrs marker not found in the drillStore chunk — the probe below can no longer prove anything; update FSRS_MARKERS');
}
for (const marker of FSRS_MARKERS) {
  if (entry.includes(marker)) problems.push(`ts-fsrs ("${marker}") is in the entry chunk`);
}
for (const lazyChunk of ['Fretboard', 'QuickSearch']) {
  if (!assets.some((f) => f.startsWith(`${lazyChunk}-`) && f.endsWith('.js'))) {
    problems.push(`no separate ${lazyChunk}-*.js chunk — it was pulled back into the entry`);
  }
}

console.log(`check-bundle: entry ${entryMatch[1]} = ${entryBytes} B (budget ${ENTRY_BUDGET_BYTES} B), ${problems.length} problem(s)`);
for (const p of problems) console.log(`  PROBLEM ${p}`);
process.exit(problems.length ? 1 : 0);
