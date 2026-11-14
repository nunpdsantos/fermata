import { describe, it, expect } from 'vitest';
import { pageStylesheet, readTokens, THEME_TOKENS } from '../style';

// Under Vitest a `?raw` CSS import comes back as '' (CSS processing is off), so
// read the files from disk — the pattern of src/__tests__/documentShell.test.ts.
const fs = (await import(/* @vite-ignore */ ['node', 'fs'].join(':'))) as { readFileSync: (path: string, encoding: 'utf8') => string };
const fromHere = (rel: string) => decodeURIComponent(new URL(rel, import.meta.url).pathname);
const indexCss = fs.readFileSync(fromHere('../../index.css'), 'utf8');
const rules = fs.readFileSync(fromHere('../../../scripts/pages/pages.css'), 'utf8');

describe('the pages\' stylesheet', () => {
  it('takes the app\'s own tokens: the cream page, the accent, the night theme, the five type steps, --tap', () => {
    const t = readTokens(indexCss);
    expect(t.day['--bg']).toBe('#f5efe2');
    expect(t.night['--bg']).toBe('#181208');
    expect(t.day['--accent']).toBe('#a65a2a');
    expect(t.day['--accent-text']).toBe('#8f4a1e');
    expect(t.type).toEqual({ '--text-caption': '12px', '--text-ui': '14px', '--text-body': '16px', '--text-title': '20px', '--text-display': '28px' });
    expect([t.tap, t.tapCoarse]).toEqual(['36px', '44px']);
    expect(Object.keys(t.day)).toEqual([...THEME_TOKENS]);
    expect(t.fontFaces).toHaveLength(5);
    expect(t.fontFaces.join('\n')).toMatch(/url\('\/fonts\/source-serif-4-latin\.woff2'\)/);
  });

  it('day by default, night by prefers-color-scheme, 44 px targets on touch', () => {
    const css = pageStylesheet(indexCss, rules);
    expect(css).toMatch(/:root \{\n {2}color-scheme: light;\n {2}--font-serif: [^;]+;\n {2}--bg: #f5efe2;/);
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\) \{\n {2}:root \{\n {4}color-scheme: dark;[\s\S]*?--bg: #181208;/);
    expect(css).toMatch(/@media \(pointer: coarse\) \{\n {2}:root \{ --tap: 44px; \}/);
    expect(css).toContain(rules.trim());
  });

  it('fails the build when index.css loses a token the pages read', () => {
    expect(() => readTokens(indexCss.replace(/\n {2}--accent-text: [^;]+;/, ''))).toThrow(/:root has no --accent-text/);
    expect(() => readTokens(indexCss.replace(':root.fermata-night {', ':root.night {'))).toThrow(/token blocks/);
  });

  it('the pages\' rules: every font size one of the five steps, nothing below 12 px, no colour but the tokens', () => {
    const sizes = [...rules.matchAll(/font-size:\s*([^;]+);/g)].map((m) => m[1].trim());
    expect(sizes.length).toBeGreaterThan(10);
    for (const s of sizes) expect(s).toMatch(/^var\(--text-(caption|ui|body|title|display)\)$/);
    expect(rules).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i);
  });
});
