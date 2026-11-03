#!/usr/bin/env node
/**
 * Entry-bundle guard for the production build (audit W9-11).
 *
 *  - The entry JS (the script index.html loads) stays under 500 kB.
 *  - ts-fsrs (Drill's scheduler) stays OUT of the entry (CLAUDE.md gotcha).
 *  - The fretboard and Quick Search stay in their own lazy chunks.
 *  - Every inline <script> in the BUILT index.html is allowed by the CSP in
 *    vercel.json through its exact sha256 hash (audit W9-14: the theme
 *    pre-paint script; a mismatch means production blocks it silently).
 *  - Notation ships VexFlow's Bravura-only entry: its chunk embeds at most
 *    the three fonts that entry registers (Bravura, Academico, Academico
 *    Bold) — the full entry embeds six (audit W9-10).
 *  - The build id (commit) in dist/version.json appears in NO code file and
 *    not in index.html (W9b): baked into the bundle it would make every
 *    commit's deploy a new app version for every learner. (The build DATE is
 *    in the bundle — the Settings footer — so a deploy on a later UTC day is
 *    a new version anyway; one on the same day with no code change is not.)
 *    A build with no commit to name (no git, no VERCEL_GIT_COMMIT_SHA) is
 *    "unknown": nothing to probe for, the check is skipped with a note.
 *
 * Usage: node scripts/check-bundle.mjs [distDir=dist]
 * Exit 0 = all good; 1 = a budget broken (listed); 2 = no build.
 */
import crypto from 'node:crypto';
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
for (const lazyChunk of ['Fretboard', 'QuickSearch', 'GuitarPractice']) {
  if (!assets.some((f) => f.startsWith(`${lazyChunk}-`) && f.endsWith('.js'))) {
    problems.push(`no separate ${lazyChunk}-*.js chunk — it was pulled back into the entry`);
  }
}
// The route search and technical-set engine belong to the lazy practice
// chunk. Stable object keys survive minification; verify the probe itself.
const practiceChunk = assets.find((f) => /^GuitarPractice-.*\.js$/.test(f));
for (const marker of ['share23Up', 'bass-notes-on-one-string']) {
  if (!practiceChunk || !fs.readFileSync(path.join(dist, 'assets', practiceChunk), 'utf8').includes(marker)) {
    problems.push(`practice engine marker "${marker}" is missing from GuitarPractice — update the probe`);
  }
  if (entry.includes(marker)) problems.push(`guitar practice engine ("${marker}") is in the entry chunk`);
}

const vexflowChunk = assets.find((f) => /^vexflow-.*\.js$/.test(f));
if (!vexflowChunk) {
  problems.push('no vexflow-*.js chunk found');
} else {
  const embeddedFonts = (fs.readFileSync(path.join(dist, 'assets', vexflowChunk), 'utf8').match(/data:font\/woff2/g) ?? []).length;
  if (embeddedFonts > 3) problems.push(`${vexflowChunk} embeds ${embeddedFonts} fonts (Bravura-only entry embeds 3)`);
}

const vercel = JSON.parse(fs.readFileSync(path.resolve('vercel.json'), 'utf8'));
const csp = vercel.headers.flatMap((r) => r.headers).find((h) => h.key === 'Content-Security-Policy')?.value ?? '';
const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="module")[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
for (const script of inlineScripts) {
  const hash = crypto.createHash('sha256').update(script, 'utf8').digest('base64');
  if (!csp.includes(`'sha256-${hash}'`)) {
    problems.push(`inline script in index.html (sha256-${hash}) is not allowed by the CSP in vercel.json — production would block it`);
  }
}

const versionPath = path.join(dist, 'version.json');
if (!fs.existsSync(versionPath)) {
  problems.push('dist/version.json is missing — the build-id probe below cannot run');
} else {
  const { build } = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
  if (build === 'unknown') {
    console.log('check-bundle: NOTE build id is "unknown" (no git, no VERCEL_GIT_COMMIT_SHA) — the build-id probe is skipped');
  } else if (typeof build !== 'string' || build.length < 7) {
    problems.push(`dist/version.json build id "${build}" is too short to probe for`);
  } else {
    const shipped = [
      ['index.html', html],
      ...assets.filter((f) => /\.(js|css)$/.test(f)).map((f) => [`assets/${f}`, fs.readFileSync(path.join(dist, 'assets', f), 'utf8')]),
    ];
    for (const [name, text] of shipped) {
      if (text.includes(build)) problems.push(`${name} contains the build id ${build} — every deploy would be a new version`);
    }
  }
}

console.log(`check-bundle: entry ${entryMatch[1]} = ${entryBytes} B (budget ${ENTRY_BUDGET_BYTES} B), ${problems.length} problem(s)`);
for (const p of problems) console.log(`  PROBLEM ${p}`);
process.exit(problems.length ? 1 : 0);
