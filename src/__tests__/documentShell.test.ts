/**
 * The document shell: index.html + vercel.json.
 *  W9-12  The unused Inter font is gone (no preload, no @font-face, no file);
 *         the font actually used for text (Source Serif 4) is preloaded.
 *  W9-13  Hashed /assets/* files are cached for a year (immutable).
 *  W9-14  The saved night theme applies BEFORE first paint (no light flash),
 *         via an inline script the CSP allows by its sha256 hash; the browser
 *         bar colour (theme-color) matches the theme; the dead class="dark"
 *         is gone.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import indexHtml from '../../index.html?raw';
import vercelJson from '../../vercel.json?raw';

// Under Vitest a `?raw` CSS import comes back as '' (CSS processing is off), so
// read it from disk — same pattern as src/design/__tests__/themeContrast.test.ts.
const fs = (await import(/* @vite-ignore */ ['node', 'fs'].join(':'))) as {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
// (A helper, not a literal `new URL('…', import.meta.url)`: Vite rewrites
// that literal into a served asset URL.)
const fromHere = (rel: string) => decodeURIComponent(new URL(rel, import.meta.url).pathname);
const indexCss = fs.readFileSync(fromHere('../index.css'), 'utf8');

const fontFiles = import.meta.glob('../../public/fonts/*', { query: '?url', import: 'default', eager: true });

interface HeaderRule { source: string; headers: Array<{ key: string; value: string }> }
const vercel = JSON.parse(vercelJson) as { headers: HeaderRule[] };
const headerFor = (source: string, key: string) =>
  vercel.headers.find((r) => r.source === source)?.headers.find((h) => h.key === key)?.value;
const csp = headerFor('/(.*)', 'Content-Security-Policy') ?? '';

function inlineScripts(html: string): string[] {
  return [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="module")[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
}

async function sha256Base64(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return btoa(String.fromCharCode(...new Uint8Array(digest)));
}

describe('W9-12 fonts', () => {
  it('Inter is not preloaded, declared or shipped', () => {
    expect(indexHtml).not.toMatch(/inter-latin/);
    expect(indexCss).not.toMatch(/font-family:\s*'Inter'/);
    expect(Object.keys(fontFiles).filter((f) => /inter-/.test(f))).toEqual([]);
  });

  it('the font the text actually uses is preloaded (and exists)', () => {
    expect(indexCss).toMatch(/--font-sans:\s*'Source Serif 4'/);
    expect(indexHtml).toMatch(/<link rel="preload" href="\/fonts\/source-serif-4-latin\.woff2" as="font" type="font\/woff2" crossorigin \/>/);
    expect(Object.keys(fontFiles).some((f) => f.endsWith('/source-serif-4-latin.woff2'))).toBe(true);
  });
});

describe('W9-13 long-term caching of hashed assets', () => {
  it('/assets/* is public, one year, immutable — security headers still on every path', () => {
    expect(headerFor('/assets/(.*)', 'Cache-Control')).toBe('public, max-age=31536000, immutable');
    expect(csp).toMatch(/font-src 'self' data:/); // VexFlow data: fonts (CLAUDE.md gotcha)
  });
});

describe('W9-14 theme before first paint', () => {
  it('no leftover class="dark"; theme-color starts at the day theme background', () => {
    expect(indexHtml).not.toMatch(/class="dark"/);
    expect(indexHtml).toMatch(/<meta name="theme-color" content="#f5efe2" \/>/);
    expect(indexCss).toMatch(/:root \{[^}]*--bg: #f5efe2/);
    expect(indexCss).toMatch(/:root\.fermata-night \{[^}]*--bg: #181208/);
  });

  it('every inline script is allowed by the CSP through its exact sha256 hash', async () => {
    const scripts = inlineScripts(indexHtml);
    expect(scripts).toHaveLength(1);
    for (const s of scripts) {
      expect(csp).toContain(`'sha256-${await sha256Base64(s)}'`);
    }
    // Hash, not a blanket allowance: script-src stays free of 'unsafe-inline'.
    const scriptSrc = csp.split(';').map((d) => d.trim()).find((d) => d.startsWith('script-src')) ?? '';
    expect(scriptSrc).toMatch(/^script-src 'self' 'sha256-/);
    expect(scriptSrc).not.toContain("'unsafe-inline'");
  });

  describe('the pre-paint script', () => {
    const run = () => new Function(inlineScripts(indexHtml)[0])();
    let meta: HTMLMetaElement;
    beforeEach(() => {
      localStorage.clear();
      document.documentElement.className = '';
      document.head.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#f5efe2';
      document.head.appendChild(meta);
    });

    it('saved night theme → night class + night bar colour before React runs', () => {
      localStorage.setItem('music-theory-app', JSON.stringify({ state: { themeMode: 'fermata-night' }, version: 6 }));
      run();
      expect(document.documentElement.classList.contains('fermata-night')).toBe(true);
      expect(meta.content).toBe('#181208');
    });

    it('a pre-v5 "dark" preference (migrated to night by the store) also paints night', () => {
      localStorage.setItem('music-theory-app', JSON.stringify({ state: { themeMode: 'dark' }, version: 4 }));
      run();
      expect(document.documentElement.classList.contains('fermata-night')).toBe(true);
    });

    it('day theme, no saved state, or garbage → day, and never throws', () => {
      localStorage.setItem('music-theory-app', JSON.stringify({ state: { themeMode: 'fermata' }, version: 6 }));
      run();
      expect(document.documentElement.classList.contains('fermata-night')).toBe(false);
      localStorage.clear();
      run();
      localStorage.setItem('music-theory-app', '{not json');
      expect(run).not.toThrow();
      expect(document.documentElement.classList.contains('fermata-night')).toBe(false);
      expect(meta.content).toBe('#f5efe2');
    });
  });
});
