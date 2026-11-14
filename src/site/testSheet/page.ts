/**
 * The test sheet's page, /test/ (2026-11-14): written by scripts/pages/build.ts
 * into dist/test/index.html with /test/sheet.js (client.ts, bundled on its
 * own) and /test/sheet.css. Plain HTML that the script fills in; the words
 * travel in one JSON data block. Not for search engines (noindex), not in
 * the sitemap, linked from nowhere (check.ts checks all three). Pure.
 */
import { esc, safeJson } from '../html';
import { STYLESHEET } from '../render';
import type { SheetContent, SheetLang } from './model';
import { SHEET_LANGS, SHEET_HTML_LANG } from './model';

export const TEST_PATH = '/test/';
export const TEST_SCRIPT = '/test/sheet.js';
export const TEST_STYLESHEET = '/test/sheet.css';
export const DATA_ID = 'sheet-data';

/** The mark (an arc and a dot: a fermata), as the public pages draw it. */
const MARK = '<svg class="mark" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 14 A 8 8 0 0 1 20 14"/><circle cx="12" cy="16" r="1.8" fill="currentColor"/></svg>';

/**
 * The page. Without JavaScript it shows the English heading, the lead, the
 * link into the app and one line in each language saying the sheet needs
 * JavaScript; the language switch stays hidden until the script runs.
 */
export function testSheetHtml(data: Record<SheetLang, SheetContent>): string {
  const en = data.en.ui;
  const noscript = SHEET_LANGS.map((l) => `<p lang="${SHEET_HTML_LANG[l]}">${esc(data[l].ui.noscript)}</p>`).join('\n');
  const switcher = SHEET_LANGS.map((l) => `<button type="button" data-lang="${l}" lang="${SHEET_HTML_LANG[l]}" aria-pressed="${l === 'en'}">${l.toUpperCase()}</button>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(en.title)}</title>
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#f5efe2" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#181208" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/svg+xml" href="/icon.svg">
<link rel="preload" href="/fonts/source-serif-4-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${STYLESHEET}">
<link rel="stylesheet" href="${TEST_STYLESHEET}">
<script type="application/json" id="${DATA_ID}">${safeJson(data)}</script>
<script src="${TEST_SCRIPT}" defer></script>
</head>
<body>
<div class="sheet-page">
<header class="sheet-top">
<div class="brand-row">
<div class="brand-name">${MARK}<h1 id="t-title">${esc(en.title)}</h1></div>
<div class="lang-switch" id="lang-switch" role="group" aria-label="${esc(en.languageLabel)}" hidden>
${switcher}
</div>
</div>
<p class="lead" id="t-lead">${esc(en.lead)}</p>
<div class="open-row">
<a class="button" id="open-app" href="/?lang=en" target="_blank" rel="noopener">${esc(en.open)}</a>
<p class="small" id="t-appnote">${esc(en.appnote)}</p>
</div>
</header>
<noscript>
<div class="noscript">
${noscript}
</div>
</noscript>
<nav class="tabs" id="tabs" aria-label="${esc(en.sheetsLabel)}"></nav>
<main id="view"></main>
</div>
</body>
</html>
`;
}
