/**
 * The tester's sheet, /test/ (2026-11-14), written by scripts/pages/build.ts
 * after the search pages: dist/test/index.html (src/site/testSheet/page.ts,
 * its words resolved at build time from the app's locale files by key),
 * dist/test/sheet.js (src/site/testSheet/client.ts, bundled here ON ITS OWN
 * by Vite's library mode — never part of the app's bundle) and
 * dist/test/sheet.css (scripts/pages/test-sheet.css). No network.
 *
 * The service worker neither precaches dist/test/ nor answers /test with the
 * app's shell (vite.config.ts globIgnores / navigateFallbackDenylist;
 * `npm run check:sw` fails if either is undone).
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { build, type Rollup } from 'vite';
import { sheetData } from '../../src/site/testSheet/resolve';
import { TEST_PATH, TEST_SCRIPT, TEST_STYLESHEET, testSheetHtml } from '../../src/site/testSheet/page';

/** The page's script: client.ts and what it imports, one IIFE, minified. */
export async function bundleSheetScript(root: string): Promise<string> {
  const result = await build({
    configFile: false,
    root,
    logLevel: 'warn',
    publicDir: false,
    build: {
      write: false,
      emptyOutDir: false,
      copyPublicDir: false,
      sourcemap: false,
      minify: 'esbuild',
      lib: {
        entry: path.join(root, 'src/site/testSheet/entry.ts'),
        formats: ['iife'],
        name: 'FermatinaTestSheet',
        fileName: () => 'sheet.js',
      },
    },
  });
  const outputs = (Array.isArray(result) ? result : [result]) as Rollup.RollupOutput[];
  const chunks = outputs.flatMap((o) => o.output).filter((c): c is Rollup.OutputChunk => c.type === 'chunk');
  if (chunks.length !== 1) throw new Error(`test sheet: the script bundled into ${chunks.length} chunks, expected 1`);
  return chunks[0].code;
}

/** Writes dist/test/; returns the bytes written per file. */
export async function writeTestSheet(root: string, dist: string): Promise<Record<string, number>> {
  const dir = path.join(dist, TEST_PATH.slice(1));
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const files: Record<string, string> = {
    [`${TEST_PATH}index.html`]: testSheetHtml(sheetData()),
    [TEST_SCRIPT]: await bundleSheetScript(root),
    [TEST_STYLESHEET]: readFileSync(path.join(root, 'scripts/pages/test-sheet.css'), 'utf8'),
  };
  const sizes: Record<string, number> = {};
  for (const [rel, content] of Object.entries(files)) {
    writeFileSync(path.join(dist, rel.slice(1)), content, 'utf8');
    sizes[rel] = Buffer.byteLength(content);
  }
  return sizes;
}
