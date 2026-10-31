/**
 * D-28: five type steps (12 · 14 · 16 · 20 · 28) and nothing below 12 px.
 * The browser sweep (e2e/design-system.spec.ts) measures what renders; this
 * fails fast on the source patterns that produced small text before W11-A:
 * `text-2xs` (Tailwind v3 naming — no CSS at all, it inherited 16 px),
 * arbitrary `text-[Npx]` below 12, inline font sizes below 12, and an
 * unlayered :root block overriding Tailwind's --text-* scale.
 */
import { describe, it, expect } from 'vitest';

const fs = (await import(/* @vite-ignore */ ['node', 'fs'].join(':'))) as {
  readFileSync: (path: string, encoding: 'utf8') => string;
};
const fromHere = (rel: string) => decodeURIComponent(new URL(rel, import.meta.url).pathname);
const indexCss = fs.readFileSync(fromHere('../../index.css'), 'utf8');

// Every component / view / hook source (not tests, not the theory engine).
const SOURCES = import.meta.glob(['../../**/*.{ts,tsx}', '!../../**/__tests__/**', '!../../core/**'], {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

describe('the five steps live in Tailwind v4\'s --text-* namespace', () => {
  const theme = /@theme static \{([\s\S]*?)\n\}/.exec(indexCss)?.[1] ?? '';
  const step = (name: string) => new RegExp(`--text-${name}:\\s*(\\d+)px`).exec(theme)?.[1];

  it('caption 12 · ui 14 · body 16 · title 20 · display 28', () => {
    expect([step('caption'), step('ui'), step('body'), step('title'), step('display')]).toEqual(['12', '14', '16', '20', '28']);
  });

  it("Tailwind's stock names map onto those steps (no 11 / 13 / 15 / 18 / 24)", () => {
    const steps = new Set(['12', '14', '16', '20', '28']);
    for (const n of ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']) expect(steps.has(step(n) ?? ''), `text-${n} = ${step(n)}`).toBe(true);
  });

  it('no v3-style --font-size-* theme keys and no unlayered --text-* overrides', () => {
    expect(indexCss).not.toMatch(/--font-size-[\w-]+\s*:/);
    // :root blocks (outside @theme) must not redefine the type scale.
    for (const m of indexCss.matchAll(/(?:^|\n):root[^{]*\{([^}]*)\}/g)) {
      expect(m[1]).not.toMatch(/--text-(2xs|xs|sm|base|lg|xl|2xl)\s*:/);
    }
  });

  it('a known positive: the patterns below do find small sizes', () => {
    expect(SMALL_CLASS.test('className="text-[10px]"')).toBe(true);
    expect(SMALL_INLINE.test('style={{ fontSize: 11 }}')).toBe(true);
    expect(SMALL_INLINE.test("labelSize: '9px'")).toBe(true);
    expect(SMALL_CLASS.test('className="text-[12px]"')).toBe(false);
  });
});

const SMALL_CLASS = /\btext-2xs\b|\btext-\[(?:[0-9]|1[01])(?:\.\d+)?px\]/;
const SMALL_INLINE = /(?:fontSize|labelSize)\s*[:=]\s*\{?\s*['"]?(?:[0-9]|1[01])(?:\.\d+)?(?:px)?['"]?\s*\}?\s*(?:[,}\n]|$)/;

describe('no source asks for text below 12 px', () => {
  it('scans every component, view and hook', () => {
    expect(Object.keys(SOURCES).length).toBeGreaterThan(100);
    const bad: string[] = [];
    for (const [file, src] of Object.entries(SOURCES)) {
      src.split('\n').forEach((line, i) => {
        if (SMALL_CLASS.test(line) || SMALL_INLINE.test(line)) bad.push(`${file}:${i + 1}: ${line.trim().slice(0, 100)}`);
      });
    }
    expect(bad).toEqual([]);
  });
});
