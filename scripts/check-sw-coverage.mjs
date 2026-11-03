#!/usr/bin/env node
/**
 * Offline / stale-page guard for the production build (audit W9-07 / W9-11,
 * tightened by W9b).
 *
 * Since W9b EVERY JS/CSS file the build emits must be PRECACHED by the service
 * worker — runtime caching is no longer enough: a page still running an older
 * build (an update waiting, "Later") must load any view, level or translation
 * it has never opened from its own precache, because after a deploy the
 * server no longer has those files. That includes every translated-content
 * chunk (PT/ES overlays, per-language module titles …), found by the `i18n-`
 * file-name prefix AND by the overlay loader's import.meta.glob map.
 *
 * Also:
 *  - precache closure: a precached file's static imports are precached;
 *  - audio samples stay OUT of the precache, on their runtime routes;
 *  - dist/version.json (the build's release + What's-new note, W9b) exists, is
 *    well-formed and is NOT precached (the network copy describes the
 *    waiting version);
 *  - the worker imports the window-count add-on (sw-window-count.js, W9b).
 *
 * Usage: node scripts/check-sw-coverage.mjs [distDir=dist]
 * Exit 0 = all good; 1 = problems (listed); 2 = no build / parser out of date.
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
// Runtime routes as emitted by workbox: <ns>.registerRoute(/regex/flags,new <ns>.Strategy({cacheName:"…"
// (the minifier's namespace letter changes between builds; lazy up to
// "/flags,new " so a "/" inside a character class is no problem)
const routeList = [...sw.matchAll(/registerRoute\((\/.+?\/[a-z]*),new \w+\.\w+\(\{cacheName:"([^"]+)"/g)].map((m) => {
  const [, body, flags] = m[1].match(/^\/(.*)\/([a-z]*)$/);
  return { re: new RegExp(body, flags), cacheName: m[2] };
});

if (precached.size === 0) {
  console.error('check-sw-coverage: found no precache entries in sw.js — parser out of date?');
  process.exit(2);
}
// Known positives for the route parser: the two sample caches must be found.
for (const name of ['piano-samples', 'guitar-samples']) {
  if (!routeList.some((r) => r.cacheName === name)) {
    console.error(`check-sw-coverage: runtime route "${name}" not found in sw.js — parser out of date?`);
    process.exit(2);
  }
}

const assetsDir = path.join(dist, 'assets');
const files = fs.readdirSync(assetsDir).filter((f) => /\.(js|css)$/.test(f));
const notPrecached = files.map((f) => `assets/${f}`).filter((u) => !precached.has(u));

console.log(
  `check-sw-coverage: ${files.length} JS/CSS files, ${precached.size} precache entries, ${routeList.length} runtime routes, ${notPrecached.length} JS/CSS file(s) not precached`,
);
for (const u of notPrecached) {
  console.log(`  NOT PRECACHED ${u} (${fs.statSync(path.join(dist, u)).size} B)`);
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

// Translated content (PT/ES overlays, per-language module titles ...): found
// two ways — the `i18n-` file-name prefix vite.config.ts gives translated
// content, and the import.meta.glob map the overlay loader is built into
// ("./pt/curriculumL1.ts":()=>...import("./<chunk>.js")). Every such chunk
// must be precached, so a stale page never drops to English.
const allJs = files.filter((f) => f.endsWith('.js'));
const globMapped = new Set();
for (const f of allJs) {
  const source = fs.readFileSync(path.join(assetsDir, f), 'utf8');
  for (const m of source.matchAll(/"\.\/[a-z]{2}\/[\w.-]+\.(?:ts|json)":\(\)=>\w+\(\(\)=>import\("\.\/([^"]+\.js)"\)/g)) {
    globMapped.add(m[1]);
  }
}
const overlays = new Set([...globMapped, ...allJs.filter((f) => f.startsWith('i18n-'))]);
const overlayProblems = [];
if (globMapped.size === 0) overlayProblems.push("found no overlay chunks in the overlay loader's glob map — parser out of date?");
for (const f of overlays) {
  if (!f.startsWith('i18n-')) overlayProblems.push(`assets/${f}: content overlay without the i18n- prefix (vite.config.ts chunkFileNames)`);
  if (!precached.has(`assets/${f}`)) overlayProblems.push(`assets/${f}: content overlay not precached`);
}
console.log(`check-sw-coverage: content overlays — ${overlays.size} chunk(s) (${globMapped.size} from the loader's glob map), ${overlayProblems.length} problem(s)`);
for (const p of overlayProblems) console.log(`  OVERLAY ${p}`);

// Audio samples: on demand (runtime routes), never in the precache.
const otherProblems = [];
for (const u of precached) {
  if (/\.mp3$/.test(u) || u.startsWith('samples/')) otherProblems.push(`${u}: an audio sample is precached (they load on first use)`);
}
for (const [dir, name] of [['piano', 'piano-samples'], ['guitar', 'guitar-samples']]) {
  const route = routeList.find((r) => r.cacheName === name);
  if (route && !route.re.test(`https://host/samples/${dir}/C4.mp3`)) otherProblems.push(`route "${name}" no longer matches /samples/${dir}/*.mp3`);
}

// version.json: published, well-formed, not precached.
const versionPath = path.join(dist, 'version.json');
if (!fs.existsSync(versionPath)) {
  otherProblems.push('dist/version.json is missing (vite.config.ts versionJson plugin)');
} else {
  let info;
  try {
    info = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
  } catch {
    otherProblems.push('dist/version.json is not valid JSON');
  }
  if (info) {
    const langs = ['en', 'pt', 'es'];
    if (typeof info.build !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(info.date ?? '')) otherProblems.push('dist/version.json: build / date missing');
    if (!Number.isInteger(info.release) || !Number.isInteger(info.criticalSince) || typeof info.critical !== 'boolean') {
      otherProblems.push('dist/version.json: release / criticalSince / critical missing');
    }
    if (!langs.every((l) => typeof info.notes?.[l] === 'string' && info.notes[l] !== '')) otherProblems.push('dist/version.json: notes need en, pt and es');
  }
}
if (precached.has('version.json')) otherProblems.push('version.json is precached — it must come from the network');

// The window-count add-on (W9b): imported by the worker, shipped at the root.
if (!/importScripts\("sw-window-count\.js"\)/.test(sw)) otherProblems.push('sw.js does not importScripts("sw-window-count.js") (vite.config.ts workbox.importScripts)');
if (!fs.existsSync(path.join(dist, 'sw-window-count.js'))) otherProblems.push('dist/sw-window-count.js is missing (public/)');
console.log(`check-sw-coverage: samples, version.json, window-count add-on — ${otherProblems.length} problem(s)`);
for (const p of otherProblems) console.log(`  PROBLEM ${p}`);

process.exit(notPrecached.length || missingDeps.length || overlayProblems.length || otherProblems.length ? 1 : 0);
