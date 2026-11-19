/**
 * Audit A11 (2026-11-18): the category labels of search results ("Chord",
 * "Key", "Lesson", "Scale", 12 px) measured 1.41 / 1.17, 1.60 / 1.32,
 * 2.12 / 1.76 and 3.69 / 3.07 by day (row at rest / selected); text this size
 * needs 4.5:1 (WCAG 2.x 1.4.3).
 *
 * This renders the real dialog, reads each label's colours AS RENDERED (inline
 * style: a hex with alpha, or a CSS variable), resolves the variables from the
 * theme blocks of src/index.css — day (`:root`) and night
 * (`:root.fermata-night`) — and composites the label's tint over the row's two
 * backgrounds: at rest (transparent over the panel's `--bg`) and selected
 * (`--card-hover`). Every label must reach 4.5:1 on both, in both themes.
 * The table it computes is written to `_review/search-badge-contrast.json`.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { QuickSearch } from '../QuickSearch';
import { useAppStore } from '../../../state/store';

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const make = (tag: string) => (props: Record<string, unknown>) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
    return React.createElement(tag, clean);
  };
  // One component per tag: a new one per read would remount the dialog on every render.
  const cache = new Map<string, ReturnType<typeof make>>();
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => cache.get(prop) ?? cache.set(prop, make(prop)).get(prop) });
  return { motion: proxy, m: proxy, AnimatePresence: (p: { children: React.ReactNode }) => p.children, LazyMotion: (p: { children: React.ReactNode }) => p.children, domAnimation: {} };
});

afterEach(cleanup);

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8');

type RGBA = [number, number, number, number];

function themeVars(selector: RegExp): Record<string, string> {
  const re = new RegExp(`${selector.source}\\s*\\{([^}]*)\\}`, 'g');
  for (const m of css.matchAll(re)) {
    if (!m[1].includes('--bg:')) continue;
    const vars: Record<string, string> = {};
    for (const d of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[d[1]] = d[2].trim();
    return vars;
  }
  throw new Error(`theme block ${selector} not found in index.css`);
}

const THEMES = { day: themeVars(/(?:^|\n):root/), night: themeVars(/:root\.fermata-night/) };

/** A CSS colour (hex 3/6/8, rgb(a), or var(--x) of the theme) → RGBA 0–255 + alpha 0–1. */
function colour(value: string, vars: Record<string, string>): RGBA {
  const v = value.trim();
  const ref = /^var\((--[\w-]+)\)$/.exec(v);
  if (ref) {
    if (!vars[ref[1]]) throw new Error(`${ref[1]} is not a token of this theme`);
    return colour(vars[ref[1]], vars);
  }
  if (v === 'transparent') return [0, 0, 0, 0];
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(v);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].split('').map((c) => c + c).join('') : hex[1];
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
  }
  const fn = /^rgba?\(([^)]+)\)$/.exec(v);
  if (fn) {
    const p = fn[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p[3] ?? 1];
  }
  throw new Error(`cannot read colour ${v}`);
}

const over = (fg: RGBA, bg: RGBA): RGBA => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1) as RGBA;

function luminance([r, g, b]: RGBA): number {
  const ch = (x: number) => {
    const s = x / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

function contrast(a: RGBA, b: RGBA): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Each category label the dialog renders for these queries, with its colours as styled. */
function renderedBadges(): Map<string, { fill: string; text: string }> {
  const found = new Map<string, { fill: string; text: string }>();
  render(<QuickSearch />);
  const input = screen.getByRole('dialog').querySelector('input')!;
  for (const q of ['key of G', 'D dorian', 'Dm7', 'major scale', 'dorian', 'tuner']) {
    fireEvent.change(input, { target: { value: q } });
    // `[data-search-type]` since the fix; the base commit's markup (a button
    // per row, the label its last span) is read too, so the test measures it.
    const labels = screen.getByRole('dialog').querySelectorAll<HTMLElement>('[data-search-type], .max-h-64 > button > span:last-child');
    for (const label of labels) {
      found.set(label.dataset.searchType ?? label.textContent!, { fill: label.style.backgroundColor, text: label.style.color });
    }
  }
  return found;
}

describe('A11 — search category labels reach 4.5:1 on the row at rest and selected, day and night', () => {
  it('every label, both themes, both row states', () => {
    useAppStore.setState({ quickSearchOpen: true, language: 'en' });
    const badges = renderedBadges();
    // Tool: the tuner and the metronome as results (review of b94d761, item 8).
    expect([...badges.keys()].sort()).toEqual(['Chord', 'Key', 'Lesson', 'Scale', 'Tool']);
    const table: Record<string, number> = {};
    const failures: string[] = [];
    for (const [theme, vars] of Object.entries(THEMES)) {
      const rows = { rest: colour('var(--bg)', vars), selected: over(colour('var(--card-hover)', vars), colour('var(--bg)', vars)) };
      for (const [type, { fill, text }] of badges) {
        for (const [state, row] of Object.entries(rows)) {
          const painted = over(colour(fill, vars), row);
          const ratio = contrast(over(colour(text, vars), painted), painted);
          table[`${theme} ${type} ${state}`] = Math.round(ratio * 100) / 100;
          if (ratio < 4.5) failures.push(`${theme} ${type} ${state}: ${ratio.toFixed(2)} (${text} on ${fill})`);
        }
      }
    }
    mkdirSync(resolve(process.cwd(), '_review'), { recursive: true });
    writeFileSync(resolve(process.cwd(), '_review/search-badge-contrast.json'), `${JSON.stringify(table, null, 1)}\n`);
    expect(failures).toEqual([]);
  });
});
