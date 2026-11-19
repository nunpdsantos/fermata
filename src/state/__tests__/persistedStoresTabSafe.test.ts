/**
 * Every saved store writes through the tab-safe storage (audit A1, 19 November
 * 2026; state/tabSafe.ts). zustand's `persist` writes a tab's WHOLE saved state
 * on every change, so one store saving straight to localStorage would bring
 * the fault back for its data: with the app open in two tabs, the tab with the
 * older memory erases what the other saved. Nothing else notices a new store
 * that forgets, so this test reads the source:
 *
 *  - the files that call `persist(` are exactly the five listed here (a new
 *    saved store is added to the list on purpose, with its merge rule);
 *  - each of them gives `persist` a `storage` made of `tabSafeStorage(`;
 *  - no code calls `createJSONStorage(` with anything else.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const SRC = resolve(process.cwd(), 'src');

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : sources(path);
    return /\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name) ? [path] : [];
  });
}

/** The code without its comments (a comment may quote any of the calls). */
const code = (path: string) => readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const SAVED_STORES = [
  'state/drillStore.ts',
  'state/fingeringStore.ts',
  'state/learnSessionStore.ts',
  'state/progressStore.ts',
  'state/store.ts',
];

describe('every saved store writes through the tab-safe storage', () => {
  const files = sources(SRC).map((path) => ({ name: relative(SRC, path).split('\\').join('/'), text: code(path) }));

  it('reads the source at all (known positive: the tab-safe storage itself)', () => {
    expect(files.length).toBeGreaterThan(300);
    expect(files.find((f) => f.name === 'state/tabSafe.ts')?.text).toContain('export function tabSafeStorage(');
  });

  it('the stores that persist are the five known ones', () => {
    const persisting = files.filter((f) => /\bpersist\s*\(/.test(f.text)).map((f) => f.name).sort();
    expect(persisting).toEqual(SAVED_STORES);
  });

  it.each(SAVED_STORES)('%s saves through tabSafeStorage, once per persist', (name) => {
    const text = files.find((f) => f.name === name)!.text;
    const persists = text.match(/\bpersist\s*\(/g) ?? [];
    const safe = text.match(/storage:\s*createJSONStorage\(\(\)\s*=>\s*tabSafeStorage\(/g) ?? [];
    expect(persists.length).toBeGreaterThan(0);
    expect(safe.length).toBe(persists.length);
  });

  it('no code makes a persist storage out of anything else', () => {
    const other = files.flatMap((f) =>
      [...f.text.matchAll(/createJSONStorage\(([^\n]{0,60})/g)]
        .filter((m) => !/^\(\)\s*=>\s*tabSafeStorage\(/.test(m[1]))
        .map((m) => `${f.name}: createJSONStorage(${m[1]}`),
    );
    expect(other).toEqual([]);
  });
});
