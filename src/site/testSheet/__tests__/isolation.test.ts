/**
 * The test sheet stays apart from the app (2026-11-14):
 *  - its saved answers never enter a backup, and no app code names its key
 *    (so nothing of the app reads, writes or clears it);
 *  - its script imports only what it needs (never the curriculum, the
 *    locale files or a store), so /test/sheet.js stays small and the app's
 *    bundle never holds it;
 *  - its stylesheet has no colour and no type size of its own: tokens only.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildBackup } from '../../../utils/backupHelpers';
import { SHEET_STORAGE_KEY } from '../model';

const SRC = join(__dirname, '..', '..', '..');
const ROOT = join(SRC, '..');

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

describe('the sheet\'s key and the app', () => {
  it('a backup exported with the sheet\'s answers saved does not carry them', () => {
    localStorage.setItem(SHEET_STORAGE_KEY, JSON.stringify({ lang: 'en', a: { n1: { r: 'ok', note: 'x', hint: false } }, q: {} }));
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { language: 'en' }, version: 6 }));
    const backup = buildBackup(localStorage);
    expect(Object.keys(backup.data)).toEqual(['music-theory-app']); // known positive: the app's own save is in it
    expect(JSON.stringify(backup)).not.toContain(SHEET_STORAGE_KEY);
    expect(JSON.stringify(backup)).not.toContain('fermatina-test');
    localStorage.clear();
  });

  it('no module of the app names the key (only the sheet\'s own model.ts does)', () => {
    const files = walk(SRC).filter((f) => !f.includes('__tests__'));
    const naming = files.filter((f) => readFileSync(f, 'utf8').includes(SHEET_STORAGE_KEY)).map((f) => relative(SRC, f));
    expect(files.length).toBeGreaterThan(500); // known positive: the walk reads src/
    expect(naming).toEqual(['site/testSheet/model.ts']);
  });
});

describe('the sheet\'s script', () => {
  it('imports only answers.ts, model.ts and the store-free forms module, nothing else (read off the sources)', () => {
    const seen = new Set<string>();
    const visit = (file: string) => {
      const rel = relative(SRC, file);
      if (seen.has(rel)) return;
      seen.add(rel);
      const text = readFileSync(file, 'utf8');
      for (const m of text.matchAll(/^import\s+(?!type\b)[^'"]*['"]([^'"]+)['"]/gm)) {
        const spec = m[1];
        expect(spec.startsWith('.'), `${rel} imports the package ${spec}`).toBe(true);
        visit(join(file, '..', spec.endsWith('.ts') ? spec : `${spec}.ts`));
      }
    };
    visit(join(SRC, 'site/testSheet/entry.ts'));
    expect([...seen].sort()).toEqual([
      'services/feedbackForms.ts',
      'site/testSheet/answers.ts',
      'site/testSheet/client.ts',
      'site/testSheet/entry.ts',
      'site/testSheet/model.ts',
    ]);
  });
});

describe('the sheet\'s stylesheet (scripts/pages/test-sheet.css)', () => {
  const css = readFileSync(join(ROOT, 'scripts/pages/test-sheet.css'), 'utf8');
  it('has no colour of its own: no hex, rgb(), hsl() or colour name, only the app\'s tokens', () => {
    const body = css.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(body).toMatch(/var\(--accent\)/); // known positive
    expect(body).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|(?<![-\w])(?:white|black|red|green|blue|gray|grey)(?![-\w])/i);
    for (const m of body.matchAll(/(?:^|[;{\s])(?:color|background(?:-color)?|border(?:-(?:color|top|right|bottom|left))?|outline):\s*([^;]+);/g)) {
      expect(m[1], m[0]).toMatch(/var\(--|transparent|0|none|inherit|^\d+px solid var\(--/);
    }
  });

  it('every type size is one of the five steps (a --text-* token)', () => {
    const sizes = [...css.matchAll(/font-size:\s*([^;]+);/g)].map((m) => m[1].trim());
    expect(sizes.length).toBeGreaterThan(5);
    for (const s of sizes) expect(s).toMatch(/^var\(--text-(?:caption|ui|body|title|display)\)$/);
    expect(css).not.toMatch(/\bfont:(?!\s*inherit;)/);
  });
});
