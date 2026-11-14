/**
 * The test page's own checks (src/site/testSheet/check.ts): clean on the
 * page as built, and each one catching its planted fault — the page found
 * by search engines or linked from the app or the public pages, a script
 * that is inline or from elsewhere, a broken data block, eval, the storage
 * key in the app's code. (The build runs the same checks on dist/.)
 */
import { describe, expect, it } from 'vitest';
import indexHtml from '../../../../index.html?raw';
import robotsTxt from '../../../../public/robots.txt?raw';
import { checkTestPage, MAX_SCRIPT_BYTES, type TestPageFiles } from '../check';
import { testSheetHtml } from '../page';
import { sheetData } from '../resolve';
import { SHEET_STORAGE_KEY } from '../model';

const HTML = testSheetHtml(sheetData());
const SCRIPT = `(function(){var k="${SHEET_STORAGE_KEY}";document.title="x"})();`;
const LESSON = '/en/lessons/the-major-scale/';

function files(edit: (f: { -readonly [K in keyof TestPageFiles]: TestPageFiles[K] } & { pages: Map<string, string>; appCode: Map<string, string> }) => void = () => {}): TestPageFiles {
  const f = {
    html: HTML,
    script: SCRIPT,
    files: new Set(['/', '/index.html', '/pages.css', '/icon.svg', '/fonts/source-serif-4-latin.woff2', '/test/index.html', '/test/sheet.js', '/test/sheet.css']),
    sitemap: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset><url><loc>https://fermatina.com/en/</loc></url></urlset>\n',
    robots: robotsTxt,
    home: indexHtml,
    pages: new Map([[LESSON, '<a href="/en/lessons/">Lessons</a> <a href="https://docs.google.com/forms/x">Feedback</a>']]),
    appCode: new Map([['/assets/index-abc.js', 'const k="fermata-welcome-v1";fetch("/version.json")']]),
  };
  edit(f);
  return f;
}

describe('the test page\'s checks', () => {
  it('nothing on the page as built', () => {
    expect(checkTestPage(files())).toEqual([]);
  });

  it('a page search engines may index (robots meta gone, or not noindex)', () => {
    expect(checkTestPage(files((f) => { f.html = f.html.replace('<meta name="robots" content="noindex">\n', ''); }))).toContain('/test/: robots meta []: expected exactly one "noindex"');
    expect(checkTestPage(files((f) => { f.html = f.html.replace('content="noindex"', 'content="index"'); }))).toContain('/test/: robots meta ["index"]: expected exactly one "noindex"');
  });

  it('an inline script, a second script, a script from another site, an inline handler', () => {
    const inline = checkTestPage(files((f) => { f.html = f.html.replace('</body>', '<script>alert(1)</script>\n</body>'); }));
    expect(inline.some((p) => p.startsWith('/test/: 3 <script> element(s)'))).toBe(true);
    const foreign = checkTestPage(files((f) => { f.html = f.html.replace('<script src="/test/sheet.js" defer></script>', '<script src="https://cdn.example/sheet.js" defer></script>'); }));
    expect(foreign).toContain('/test/: loads https://cdn.example/sheet.js (not this site)');
    expect(foreign.some((p) => p.includes('expected the data block and <script src="/test/sheet.js" defer></script>'))).toBe(true);
    const handler = checkTestPage(files((f) => { f.html = f.html.replace('<main id="view">', '<main id="view" onclick="x()">'); }));
    expect(handler).toContain('/test/: inline style, event handler or javascript: address');
  });

  it('a data block that does not parse, lacks a language, or still holds a placeholder', () => {
    const data = HTML.match(/<script type="application\/json" id="sheet-data">([\s\S]*?)<\/script>/)![1];
    expect(checkTestPage(files((f) => { f.html = f.html.replace(data, `${data.slice(0, -1)},}`); })).some((p) => p.startsWith('/test/: the data block does not parse'))).toBe(true);
    const noEs = JSON.parse(data);
    delete noEs.es;
    expect(checkTestPage(files((f) => { f.html = f.html.replace(data, JSON.stringify(noEs)); }))).toContain('/test/: the data block has no complete "es"');
    expect(checkTestPage(files((f) => { f.html = f.html.replace(data, data.replace('Stuck? Show a hint', 'Stuck? {{app:x.y}}')); })).some((p) => p.startsWith('/test/: the data block still holds a {{placeholder}}'))).toBe(true);
  });

  it('no <noscript> line; a stylesheet or the script missing from the build', () => {
    expect(checkTestPage(files((f) => { f.html = f.html.replace(/<noscript>[\s\S]*<\/noscript>\n/, ''); }))).toContain('/test/: no <noscript> line');
    expect(checkTestPage(files((f) => { f.files = new Set([...f.files].filter((x) => x !== '/test/sheet.css')); }))).toContain('/test/: loads /test/sheet.css, which is not in the build');
  });

  it('a script that calls eval, has grown past the limit, or lost the storage key', () => {
    expect(checkTestPage(files((f) => { f.script += 'eval("1")'; }))).toContain('/test/: its script calls eval or new Function (the CSP forbids both)');
    expect(checkTestPage(files((f) => { f.script += 'x'.repeat(MAX_SCRIPT_BYTES); })).some((p) => p.startsWith('/test/: its script is '))).toBe(true);
    expect(checkTestPage(files((f) => { f.script = f.script.replace(SHEET_STORAGE_KEY, 'fermata-test-sheet-v1'); }))).toContain(`/test/: its script does not hold the storage key ${SHEET_STORAGE_KEY}`);
  });

  it('a link off the site from the page', () => {
    expect(checkTestPage(files((f) => { f.html = f.html.replace('href="/?lang=en"', 'href="https://fermatina.com/?lang=en"'); }))).toContain('/test/: links to https://fermatina.com/?lang=en (the page links only into its own site; the form opens from the script)');
  });

  it('found: in the sitemap, in robots.txt, linked from a public page, named by the app\'s index.html', () => {
    const p = checkTestPage(files((f) => {
      f.sitemap = f.sitemap.replace('</urlset>', '<url><loc>https://fermatina.com/test/</loc></url></urlset>');
      f.robots += 'Disallow: /test/\n';
      f.pages.set(LESSON, `${f.pages.get(LESSON)} <a href="/test/">sheet</a>`);
      f.home = f.home.replace('</body>', '<a href="/test/">x</a></body>');
    }));
    expect(p).toContain('sitemap.xml: lists /test/');
    expect(p).toContain('robots.txt: names /test/ (a page robots.txt blocks is never read, so its noindex would not be seen)');
    expect(p).toContain(`${LESSON}: links to /test/`);
    expect(p).toContain('index.html: names /test/');
  });

  it('the app\'s code holding the sheet\'s key or address (the sheet\'s code in the app\'s bundle)', () => {
    const p = checkTestPage(files((f) => { f.appCode.set('/assets/index-abc.js', `${f.appCode.get('/assets/index-abc.js')};localStorage.getItem("${SHEET_STORAGE_KEY}");open("/test/")`); }));
    expect(p).toContain(`/assets/index-abc.js: the app's code holds the sheet's storage key`);
    expect(p).toContain('/assets/index-abc.js: the app\'s code names /test/');
  });
});
