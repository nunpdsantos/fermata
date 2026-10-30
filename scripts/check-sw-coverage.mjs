#!/usr/bin/env node
/**
 * Offline guard for the production build (audit W9-07 / W9-11).
 *
 * Every JS/CSS file the build emits must be either PRECACHED by the service
 * worker or matched by one of its RUNTIME-CACHING routes; otherwise the file
 * that needs it breaks offline. Splitting code into new chunks (lazy
 * Fretboard, Quick Search, stores pulled apart by a dynamic import …) is
 * exactly how a file silently falls through both lists.
 *
 * Usage: node scripts/check-sw-coverage.mjs [distDir=dist]
 * Exit 0 = every file covered; 1 = uncovered files (listed); 2 = no build.
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] ?? 'dist');
const swPath = path.join(dist, 'sw.js');
if (!fs.existsSync(swPath)) {
  console.error(`check-sw-coverage: no ${swPath} — run \`npm run build\` first.`);
  process.exit(2);
}
const sw = fs.readFileSync(swPath, 'utf8');

const precached = new Set([...sw.matchAll(/url:"([^"]+)"/g)].map((m) => m[1]));
// Runtime routes as emitted by workbox: e.registerRoute(/regex/flags,new e.Strategy(…
// (lazy up to "/flags,new " so a "/" inside a character class is no problem)
const routes = [...sw.matchAll(/registerRoute\((\/.+?\/[a-z]*),new /g)].map((m) => {
  const [, body, flags] = m[1].match(/^\/(.*)\/([a-z]*)$/);
  return new RegExp(body, flags);
});

if (precached.size === 0) {
  console.error('check-sw-coverage: found no precache entries in sw.js — parser out of date?');
  process.exit(2);
}

const assetsDir = path.join(dist, 'assets');
const files = fs.readdirSync(assetsDir).filter((f) => /\.(js|css)$/.test(f));
const uncovered = files
  .map((f) => `assets/${f}`)
  .filter((u) => !precached.has(u) && !routes.some((r) => r.test(`https://host/${u}`)));

console.log(
  `check-sw-coverage: ${files.length} JS/CSS files, ${precached.size} precache entries, ${routes.length} runtime routes, ${uncovered.length} uncovered`,
);
for (const u of uncovered) {
  console.log(`  UNCOVERED ${u} (${fs.statSync(path.join(dist, u)).size} B)`);
}

// Precache closure: a precached file's STATIC imports must be precached too,
// or that file fails offline on a fresh install (the prng chunk had to ride
// along with Drill for exactly this reason).
const missingDeps = [];
for (const entry of precached) {
  if (!entry.startsWith('assets/') || !entry.endsWith('.js')) continue;
  const source = fs.readFileSync(path.join(dist, entry), 'utf8');
  const deps = new Set([...source.matchAll(/(?:from|import)\s*"\.\/([^"]+\.js)"/g)].map((m) => `assets/${m[1]}`));
  for (const dep of deps) {
    if (!precached.has(dep)) missingDeps.push(`${entry} → ${dep}`);
  }
}
console.log(`check-sw-coverage: precache closure — ${missingDeps.length} precached file(s) import a chunk that is not precached`);
for (const d of missingDeps) console.log(`  NOT PRECACHED ${d}`);

process.exit(uncovered.length || missingDeps.length ? 1 : 0);
