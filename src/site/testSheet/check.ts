/**
 * The test page's own checks (2026-11-14): run by the build on what it wrote
 * (scripts/pages/verify.ts `verifyTestPage`), by `npm run check:pages`, and
 * by the unit tests with planted faults. Pure: strings in, findings out.
 *
 *  - the page: noindex; its script an external same-origin file with no
 *    inline code; one JSON data block that parses, in three languages, with
 *    every placeholder filled; a <noscript> line; nothing loaded from another
 *    origin; no inline style or event handler;
 *  - its script: no eval, small (the curriculum never got bundled into it),
 *    and the sheet's own storage key in it;
 *  - not to be found: not in the sitemap, not in robots.txt (a blocked page's
 *    noindex is never read), linked from no public page and from nowhere in
 *    the app (index.html, every built code file), and the app's code holds
 *    neither the sheet's address nor its storage key.
 */
import { SHEET_LANGS, SHEET_STORAGE_KEY } from './model';
import { DATA_ID, TEST_PATH, TEST_SCRIPT, TEST_STYLESHEET } from './page';

export interface TestPageFiles {
  /** dist/test/index.html */
  html: string;
  /** dist/test/sheet.js */
  script: string;
  /** Every file of the build, as served ('/pages.css', '/test/sheet.js', …). */
  files: ReadonlySet<string>;
  sitemap: string;
  robots: string;
  /** The app's index.html. */
  home: string;
  /** The public pages: path → HTML. */
  pages: ReadonlyMap<string, string>;
  /** The app's built code: path → text (assets/*.js, sw.js, the manifest). */
  appCode: ReadonlyMap<string, string>;
}

/** Above this the script has swallowed something it should not have (the curriculum, the locale files). */
export const MAX_SCRIPT_BYTES = 40_000;

export function checkTestPage(f: TestPageFiles): string[] {
  const problems: string[] = [];
  const at = (msg: string) => problems.push(`${TEST_PATH}: ${msg}`);
  const { html } = f;

  if (!html.startsWith('<!doctype html>\n')) at('does not start with <!doctype html>');
  if (!/<html lang="en">/.test(html)) at('no <html lang="en"> (the script sets the language it shows)');
  if ((html.match(/<title>[^<]+<\/title>/g) ?? []).length !== 1) at('needs exactly one non-empty <title>');
  const robots = [...html.matchAll(/<meta name="robots" content="([^"]*)">/g)].map((m) => m[1]);
  if (robots.length !== 1 || robots[0] !== 'noindex') at(`robots meta ${JSON.stringify(robots)}: expected exactly one "noindex"`);
  if (!/<noscript>[\s\S]*<\/noscript>/.test(html)) at('no <noscript> line');

  // Scripts: the data block and the one external file. Nothing inline runs.
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].map((m) => ({ attrs: m[1], body: m[2] }));
  const data = scripts.filter((s) => s.attrs === ` type="application/json" id="${DATA_ID}"`);
  const external = scripts.filter((s) => s.attrs === ` src="${TEST_SCRIPT}" defer` && s.body === '');
  if (scripts.length !== 2 || data.length !== 1 || external.length !== 1) at(`${scripts.length} <script> element(s): expected the data block and <script src="${TEST_SCRIPT}" defer></script>, nothing else`);
  if ((html.match(/<script\b/g) ?? []).length !== scripts.length) at('a <script> that is not closed');
  if (/\son[a-z]+="|<style\b|\sstyle="|javascript:/i.test(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ''))) at('inline style, event handler or javascript: address');
  for (const d of data) {
    try {
      const parsed = JSON.parse(d.body) as Record<string, { ui?: { title?: unknown }; sheets?: unknown; guide?: unknown }>;
      for (const lang of SHEET_LANGS) {
        if (typeof parsed[lang]?.ui?.title !== 'string' || !parsed[lang].sheets || !parsed[lang].guide) at(`the data block has no complete "${lang}"`);
      }
      const strings: string[] = [];
      const walk = (node: unknown) => {
        if (typeof node === 'string') strings.push(node);
        else if (node && typeof node === 'object') for (const v of Object.values(node)) walk(v);
      };
      walk(parsed);
      const left = strings.find((s) => /\{\{|\}\}/.test(s));
      if (left !== undefined) at(`the data block still holds a {{placeholder}}: "${left}"`);
      if (/[<>&]/.test(d.body)) at('the data block has a raw <, > or & (it must be \\u-escaped)');
    } catch (e) {
      at(`the data block does not parse: ${(e as Error).message}`);
    }
  }

  // What the page loads: same origin, in the build.
  const loads = [
    ...[...html.matchAll(/<link\b[^>]*\shref="([^"]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/\ssrc="([^"]*)"/g)].map((m) => m[1]),
  ];
  for (const url of loads) {
    if (!url.startsWith('/') || url.startsWith('//')) at(`loads ${url} (not this site)`);
    else if (!f.files.has(url.split(/[?#]/)[0])) at(`loads ${url}, which is not in the build`);
  }
  for (const needed of ['/pages.css', TEST_STYLESHEET, TEST_SCRIPT]) if (!loads.includes(needed)) at(`does not load ${needed}`);
  // Links: the page's own; the app, by a relative address (previews work); nothing on another host.
  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
    if (!m[1].startsWith('/') || m[1].startsWith('//')) at(`links to ${m[1]} (the page links only into its own site; the form opens from the script)`);
  }

  // Its script.
  if (/\beval\s*\(|new\s+Function\s*\(/.test(f.script)) at('its script calls eval or new Function (the CSP forbids both)');
  const scriptBytes = new TextEncoder().encode(f.script).length;
  if (scriptBytes > MAX_SCRIPT_BYTES) at(`its script is ${scriptBytes} B, above ${MAX_SCRIPT_BYTES} B`);
  if (!f.script.includes(SHEET_STORAGE_KEY)) at(`its script does not hold the storage key ${SHEET_STORAGE_KEY}`);

  // Not to be found.
  const mentions = (text: string) => /\/test(?:\/|["'?#\s<]|$)/.test(text);
  if (mentions(f.sitemap)) problems.push(`sitemap.xml: lists ${TEST_PATH}`);
  if (/\/test\b/.test(f.robots)) problems.push(`robots.txt: names ${TEST_PATH} (a page robots.txt blocks is never read, so its noindex would not be seen)`);
  if (mentions(f.home)) problems.push(`index.html: names ${TEST_PATH}`);
  for (const [path, page] of f.pages) if (/href="[^"]*\/test[/"?#]/.test(page)) problems.push(`${path}: links to ${TEST_PATH}`);
  for (const [path, code] of f.appCode) {
    if (code.includes(SHEET_STORAGE_KEY)) problems.push(`${path}: the app's code holds the sheet's storage key`);
    if (/["'`]\/test\//.test(code)) problems.push(`${path}: the app's code names ${TEST_PATH}`);
  }
  return problems;
}
