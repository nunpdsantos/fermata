/**
 * A selector a browser does not understand drops its WHOLE selector list
 * (CSS Selectors Level 4, "invalid selector"): a `:has()` in a list with
 * other selectors would take them down with it where `:has()` is missing.
 * So in src/index.css every rule that uses `:has()` — or a complex selector
 * inside `:not()` — has exactly one selector (review of bd14071, item 3).
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const css = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../index.css'), 'utf8');

/** Every rule's selector text (at-rules' preludes left out). */
function selectorLists(source: string): string[] {
  const text = source.replace(/\/\*[\s\S]*?\*\//g, '');
  const out: string[] = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '{') {
      const prelude = text.slice(start, i).trim();
      if (prelude && !prelude.startsWith('@')) out.push(prelude);
      start = i + 1;
    } else if (c === '}' || c === ';') {
      start = i + 1;
    }
  }
  return out;
}

/** Commas outside parentheses: how many selectors the list holds. */
function topLevelSelectors(list: string): number {
  let depth = 0;
  let count = 1;
  for (const c of list) {
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === ',' && depth === 0) count++;
  }
  return count;
}

const RISKY = /:has\(|:not\([^)]*\s[^)]*\)/;

describe(':has() never shares a selector list', () => {
  const lists = selectorLists(css);

  it('reads the stylesheet (known positives: the lesson print rules use :has())', () => {
    expect(lists.length).toBeGreaterThan(500);
    expect(lists.filter((l) => l.includes(':has(')).length).toBeGreaterThan(5);
    expect(lists).toContain('[data-learn-scroll] div:has(> aside > [data-testid="section-rail"])');
    // The checker sees a mixed list when there is one.
    expect(topLevelSelectors('aside:has(> .x), .y')).toBe(2);
    expect(topLevelSelectors(':is(.a, .b):has(.c)')).toBe(1);
  });

  it('every rule with :has() or a complex :not() has one selector', () => {
    const mixed = lists.filter((l) => RISKY.test(l) && topLevelSelectors(l) > 1);
    expect(mixed).toEqual([]);
  });
});
