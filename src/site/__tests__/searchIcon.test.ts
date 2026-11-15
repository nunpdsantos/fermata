/**
 * The site's icon in search results (2026-11-15). Google shows an icon beside
 * a result only from a format on its list — "BMP, GIF, ICO, PNG, JPEG, PPM,
 * and TIFF" (developers.google.com/search/docs/appearance/favicon-in-search,
 * read 2026-11-15; SVG is not on it) — square, larger than 48 × 48 px
 * recommended, declared in the home page's head. Until then the home page
 * declared only the SVG as `rel="icon"`. Now:
 *  - the home page (index.html) and every public page declare
 *    /icon-192.png as `rel="icon"`, FIRST, then the SVG (a browser that takes
 *    the last icon it can use keeps the SVG in the tab), then the
 *    apple-touch icon, as before;
 *  - /favicon.ico (16, 32 and 48 px) answers whatever asks for it without
 *    reading a page; no page links it.
 * The files' own bytes are read: the `type` and `sizes` attributes are not
 * trusted.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import indexHtml from '../../../index.html?raw';
import registry from '../../../scripts/pages/slugs.json';
import { buildSite, type Site } from '../render';
import type { SlugRegistry } from '../slugs';

const fs = (await import(/* @vite-ignore */ ['node', 'fs'].join(':'))) as {
  readFileSync: (path: string) => Uint8Array;
  existsSync: (path: string) => boolean;
};
const fromHere = (rel: string) => decodeURIComponent(new URL(rel, import.meta.url).pathname);
const publicFile = (href: string) => fromHere(`../../../public${href}`);

/** Google's formats, by their usual media types. */
const GOOGLE_TYPES = ['image/bmp', 'image/gif', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/png', 'image/jpeg', 'image/x-portable-pixmap', 'image/tiff'];

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const u16 = (b: Uint8Array, at: number) => b[at] | (b[at + 1] << 8);
const u32le = (b: Uint8Array, at: number) => (b[at] | (b[at + 1] << 8) | (b[at + 2] << 16) | (b[at + 3] << 24)) >>> 0;
const u32be = (b: Uint8Array, at: number) => ((b[at] << 24) | (b[at + 1] << 16) | (b[at + 2] << 8) | b[at + 3]) >>> 0;
const isPng = (b: Uint8Array, at = 0) => PNG_SIGNATURE.every((v, i) => b[at + i] === v);
/** A PNG's size from its IHDR chunk (the first chunk, right after the signature). */
function pngSize(b: Uint8Array, at = 0): { width: number; height: number } {
  expect(String.fromCharCode(...b.slice(at + 12, at + 16)), 'the first chunk is IHDR').toBe('IHDR');
  return { width: u32be(b, at + 16), height: u32be(b, at + 20) };
}

/** Icon links, as the attributes the page gives them, in document order. */
function iconLinks(html: string) {
  return [...html.matchAll(/<link\b[^>]*>/g)]
    .map((m) => Object.fromEntries([...m[0].matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1], a[2]])) as Record<string, string>)
    .filter((l) => (l.rel ?? '').split(/\s+/).some((t) => /^(?:icon|apple-touch-icon(?:-precomposed)?)$/i.test(t)));
}
const show = (l: Record<string, string>) => `${l.rel} ${l.type ?? '-'} ${l.sizes ?? '-'} ${l.href}`;

describe('the home page (index.html)', () => {
  const links = iconLinks(indexHtml);
  const icons = links.filter((l) => l.rel === 'icon');

  it('declares, as rel="icon", a file in a format on Google\'s list: a real PNG in public/, square, larger than 48 px', () => {
    const listed = icons.find((l) => GOOGLE_TYPES.includes(l.type));
    expect(listed, `rel="icon" links: ${links.map(show).join(' | ')}`).toBeDefined();
    expect(listed!.type).toBe('image/png');
    expect(fs.existsSync(publicFile(listed!.href)), `public${listed!.href}`).toBe(true);
    const bytes = fs.readFileSync(publicFile(listed!.href));
    expect(isPng(bytes), 'the file starts with the PNG signature').toBe(true);
    const { width, height } = pngSize(bytes);
    expect(width).toBe(height);
    expect(width).toBeGreaterThan(48);
    expect(listed!.sizes).toBe(`${width}x${height}`); // the attribute agrees with the file
  });

  it('lists that PNG first, before the SVG; the SVG and the apple-touch icon are still there; nothing else', () => {
    expect(links.map(show)).toEqual([
      'icon image/png 192x192 /icon-192.png',
      'icon image/svg+xml - /icon.svg',
      'apple-touch-icon - - /icon-192.png',
    ]);
    for (const l of links) expect(fs.existsSync(publicFile(l.href)), `public${l.href}`).toBe(true);
  });

  it('does not link /favicon.ico (a linked ICO can win the tab over the SVG)', () => {
    expect(links.some((l) => /favicon/i.test(l.href))).toBe(false);
  });
});

describe('/favicon.ico', () => {
  const bytes = fs.existsSync(publicFile('/favicon.ico')) ? fs.readFileSync(publicFile('/favicon.ico')) : new Uint8Array();

  it('exists in public/, starts with an ICO header, and holds 16, 32 and 48 px entries whose data is what the directory says', () => {
    expect(bytes.length, 'public/favicon.ico').toBeGreaterThan(0);
    expect(bytes.length).toBeLessThan(20_000);
    // ICONDIR: reserved 0, type 1 (icon), the number of entries.
    expect([u16(bytes, 0), u16(bytes, 2)]).toEqual([0, 1]);
    const count = u16(bytes, 4);
    const entries = Array.from({ length: count }, (_, i) => {
      const at = 6 + 16 * i;
      // 0 means 256 in the one-byte width and height.
      return { width: bytes[at] || 256, height: bytes[at + 1] || 256, size: u32le(bytes, at + 8), offset: u32le(bytes, at + 12) };
    });
    expect(entries.map((e) => `${e.width}x${e.height}`).sort()).toEqual(['16x16', '32x32', '48x48']);
    for (const e of entries) {
      expect(e.offset + e.size, `${e.width} px entry inside the file`).toBeLessThanOrEqual(bytes.length);
      expect(e.offset, `${e.width} px entry after the directory`).toBeGreaterThanOrEqual(6 + 16 * count);
      if (isPng(bytes, e.offset)) {
        expect(pngSize(bytes, e.offset)).toEqual({ width: e.width, height: e.height });
      } else {
        // A bitmap: BITMAPINFOHEADER (40 bytes), its height counting the image and its mask.
        expect(u32le(bytes, e.offset), `${e.width} px entry: BITMAPINFOHEADER`).toBe(40);
        expect([u32le(bytes, e.offset + 4), u32le(bytes, e.offset + 8)]).toEqual([e.width, e.height * 2]);
      }
    }
  });
});

describe('the public pages (src/site/render.ts)', () => {
  let site: Site;
  beforeAll(() => {
    site = buildSite(registry as SlugRegistry);
  });

  it('every page declares the home page\'s icons, in the same order: the same PNG first', () => {
    const home = iconLinks(indexHtml).map(show);
    expect(home[0]).toBe('icon image/png 192x192 /icon-192.png');
    for (const page of site.pages) expect(iconLinks(page.html).map(show), page.path).toEqual(home);
    expect(site.pages).toHaveLength(417);
  });
});
