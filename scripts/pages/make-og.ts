/**
 * Remakes public/og.png (1200×630), the one preview image every page and the
 * app's home name for link previews: a headless-browser screenshot of
 * scripts/pages/og-card.html with the app's day tokens and fonts (read from
 * src/index.css, the fonts inlined from public/fonts/) and the start screen's
 * English tagline. Nothing is fetched from the network.
 *
 * Run: npm run pages:og   (then look at it, and commit it)
 */
import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { readTokens } from '../../src/site/style';
import { appText } from '../../src/site/content';
import { esc } from '../../src/site/html';
import { OG_IMAGE_SIZE } from '../../src/site/render';

const root = fileURLToPath(new URL('../../', import.meta.url));
const tokens = readTokens(readFileSync(path.join(root, 'src/index.css'), 'utf8'));
// The fonts as data: URLs (a page set from a string has no origin to load /fonts/ from).
const fonts = tokens.fontFaces
  .map((face) => face.replace(/url\('\/fonts\/([^']+)'\)/g, (_, file: string) => `url(data:font/woff2;base64,${readFileSync(path.join(root, 'public/fonts', file)).toString('base64')})`))
  .join('\n');
const html = readFileSync(path.join(root, 'scripts/pages/og-card.html'), 'utf8')
  .replace('/*FONTS*/', fonts)
  .replace('/*TOKENS*/', Object.entries(tokens.day).map(([k, v]) => `  ${k}: ${v};`).join('\n'))
  .replace('<!--LINE-->', esc(appText('en', 'start.tagline')));

const out = path.join(root, 'public', 'og.png');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: OG_IMAGE_SIZE.width, height: OG_IMAGE_SIZE.height }, deviceScaleFactor: 1 });
  await page.route('**/*', (route) => (route.request().url().startsWith('data:') ? route.continue() : route.abort()));
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  const faces = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.style}`));
  if (!faces.some((f) => f.startsWith('Source Serif 4 italic')) || !faces.some((f) => f.startsWith('Source Serif 4 normal'))) {
    throw new Error(`the card's fonts did not load (${faces.join(', ') || 'none'})`);
  }
  await page.screenshot({ path: out, type: 'png' });
} finally {
  await browser.close();
}
console.log(`pages:og: wrote ${out} (${OG_IMAGE_SIZE.width}×${OG_IMAGE_SIZE.height}, ${statSync(out).size} B)`);
