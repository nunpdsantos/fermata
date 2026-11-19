/**
 * The Drill's terms load with the Drill, and only with it (audit A12).
 *
 * i18n/drillTerms registers the interval names and explanation clauses
 * through a module side effect. Every app module that renders a Drill item's
 * text (itemPrompt, itemWhy, choiceLabel, answerLabel) must import it, or a
 * Portuguese learner would read key paths; drillText.ts itself must not,
 * because views other than the Drill import it (toContentLanguage) and the
 * terms would then load with them.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = join(process.cwd(), 'src');

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : sources(path);
    return /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}

const RENDERERS = /\b(itemPrompt|itemWhy|choiceLabel|answerLabel)\s*\(/;
const LOADS_TERMS = /^import\s+'[./]+(?:\/i18n)?\/drillTerms';/m;

describe('who loads the Drill terms', () => {
  const files = sources(SRC).map((path) => ({ path: relative(process.cwd(), path), text: readFileSync(path, 'utf8') }));

  it('every module that renders Drill item text loads them', () => {
    const renderers = files.filter(
      (f) => RENDERERS.test(f.text) && !f.path.endsWith('drillText.ts') && !f.path.endsWith('answerText.ts'),
    );
    expect(renderers.map((f) => f.path).sort()).toEqual([
      'src/components/drill/DrillInput.tsx',
      'src/components/drill/SprintRunner.tsx',
      'src/views/DrillView.tsx',
    ]);
    for (const f of renderers) expect(LOADS_TERMS.test(f.text), f.path).toBe(true);
  });

  it('drillText.ts does not (other views import it), and nothing outside the Drill does', () => {
    const loaders = files.filter((f) => LOADS_TERMS.test(f.text)).map((f) => f.path).sort();
    expect(loaders).toEqual([
      'src/components/drill/DrillInput.tsx',
      'src/components/drill/SprintRunner.tsx',
      'src/views/DrillView.tsx',
    ]);
  });

  it('the check can fail: a renderer without the import is caught', () => {
    expect(LOADS_TERMS.test("import { itemWhy } from './drillText';\nitemWhy(item, t, lang);")).toBe(false);
    expect(LOADS_TERMS.test("import '../../i18n/drillTerms'; // the Drill's terms")).toBe(true);
    expect(LOADS_TERMS.test("import '../i18n/drillTerms';")).toBe(true);
  });
});
