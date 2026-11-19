/**
 * Portuguese has two words for a guitar fret, "traste" and "trasto" (Priberam
 * gives each as the other's synonym). Until 19 November 2026 the interface
 * and the glossary said "traste" and the lessons "trasto"; the owner chose
 * "traste" for all of it. This reads every Portuguese text file of the app
 * and fails on the other word, so the two cannot drift apart again.
 * (Old entries of release-notes.json are history and are not read.)
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const I18N = resolve(process.cwd(), 'src/i18n');

function files(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name !== '__tests__') files(path, out);
    } else out.push(path);
  }
  return out;
}

/** Portuguese text: the overlays under content/pt/, every pt.json, every *.pt.json / *.pt.ts. */
const portuguese = files(I18N).filter((f) => /\/content\/pt\/|\/pt\.json$|\.pt\.(json|ts)$/.test(f));

describe('Portuguese says "traste" for a fret, everywhere', () => {
  it('reads the Portuguese files at all (known positive: the word is there, many times)', () => {
    expect(portuguese.length).toBeGreaterThan(25);
    const count = portuguese.reduce((n, f) => n + (readFileSync(f, 'utf8').match(/(?<!\p{L})trastes?(?!\p{L})/giu) ?? []).length, 0);
    expect(count).toBeGreaterThan(100); // 129 on 19 November 2026
  });

  it('never "trasto"', () => {
    const found = portuguese.flatMap((f) =>
      [...readFileSync(f, 'utf8').matchAll(/(?<!\p{L})trastos?(?!\p{L})/giu)].map((m) => `${relative(I18N, f)}: …${readFileSync(f, 'utf8').slice(Math.max(0, m.index - 30), m.index + 40)}…`),
    );
    expect(found).toEqual([]);
  });
});
