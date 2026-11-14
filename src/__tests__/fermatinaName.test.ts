/**
 * Fermata became Fermatina (2026-11-14). Wherever the app names itself to a
 * person — every sentence in EN / PT / ES (entry locales, lazy namespaces,
 * translated content), the page title and description, the installed app's
 * name — it says Fermatina; the old name is left only where a sentence names
 * it on purpose (the "we've moved" line) and in two theme labels nothing
 * renders. Portuguese uses ONE article with the name throughout (the language
 * review's ruling, feminine, pending the owner: flip PT_ARTICLE and the
 * sentences together). The page names fermatina.com as canonical; robots.txt
 * and sitemap.xml say the same. What is SAVED keeps its old names — storage
 * keys, theme ids, the backup's format — see startImport.test.tsx.
 */
import { describe, expect, it } from 'vitest';
import indexHtml from '../../index.html?raw';

const fs = (await import(/* @vite-ignore */ ['node', 'fs'].join(':'))) as {
  readFileSync: (path: string, encoding: 'utf8') => string;
  readdirSync: (path: string, opts: { withFileTypes: true }) => { name: string; isDirectory: () => boolean }[];
};
const fromHere = (rel: string) => decodeURIComponent(new URL(rel, import.meta.url).pathname);
const read = (rel: string) => fs.readFileSync(fromHere(rel), 'utf8');
function walk(rel: string, keep: (name: string) => boolean): string[] {
  const out: string[] = [];
  for (const e of fs.readdirSync(fromHere(rel), { withFileTypes: true })) {
    const child = `${rel}/${e.name}`;
    if (e.isDirectory()) {
      if (e.name !== '__tests__') out.push(...walk(child, keep));
    } else if (keep(e.name)) out.push(child);
  }
  return out;
}

type Tree = { [k: string]: unknown };
function strings(value: unknown, path = ''): [string, string][] {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === 'object') return Object.entries(value as Tree).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  return [];
}

/** Every JSON file of words under src/i18n (entry locales and every lazy namespace), with its strings. */
const WORD_FILES = walk('../i18n', (n) => n.endsWith('.json')).map((file) => ({ file, entries: strings(JSON.parse(read(file))) }));
/** The translated-content overlays (TS files of PT / ES lesson and exercise text). */
const CONTENT_FILES = walk('../i18n/content', (n) => n.endsWith('.ts'));
const langOf = (file: string) => (/(?:^|[/.])(en|pt|es)\.json$/.exec(file)?.[1] ?? /\/content\/(pt|es)\//.exec(file)?.[1] ?? null);

const OLD_NAME = /\bFermata\b/;
/** Where the old name stays, and why. */
const KEPT: Record<string, string> = {
  'theme.fermata': 'a theme label no code renders (Settings shows Day / Night / Auto); the theme id it is named after is saved data',
  'theme.fermataNight': 'as above',
  'movedEntry.toast': 'the "we\'ve moved" line names the old name on purpose',
};

describe('the name a person reads', () => {
  it('the scan reads every words file (known positives)', () => {
    const files = WORD_FILES.map((w) => w.file);
    for (const f of ['../i18n/locales/en.json', '../i18n/locales/pt.json', '../i18n/tuner/mic.pt.json', '../i18n/midiInput/es.json', '../i18n/glossary/es.json', '../i18n/moved/pt.json']) expect(files).toContain(f);
    expect(CONTENT_FILES.length).toBeGreaterThan(50);
    expect(WORD_FILES.flatMap((w) => w.entries).filter(([, v]) => v.includes('Fermatina')).length).toBeGreaterThan(60);
  });

  it('no "Fermata" left in any sentence, but where it is kept on purpose', () => {
    const left = WORD_FILES.flatMap(({ file, entries }) => entries.filter(([k, v]) => OLD_NAME.test(v) && !(k in KEPT)).map(([k, v]) => `${file} ${k}: ${v}`));
    expect(left).toEqual([]);
    const content = CONTENT_FILES.filter((f) => OLD_NAME.test(read(f)));
    expect(content).toEqual([]);
  });

  it('the theme labels that keep the old name are rendered nowhere (no code asks for them)', () => {
    const code = walk('..', (n) => /\.(ts|tsx)$/.test(n) && !n.endsWith('.d.ts')).filter((f) => !f.startsWith('../i18n/content'));
    expect(code.length).toBeGreaterThan(300);
    const asking = code.filter((f) => /theme\.fermata|['"`]theme\.['"`$]|`theme\.\$\{/.test(read(f)));
    expect(asking).toEqual([]);
    // Known positive for the same scan: the Settings labels Day / Night are asked for.
    expect(code.filter((f) => read(f).includes("'settings.themeNight'"))).toEqual(['../components/layout/SettingsSheet.tsx']);
  });

  it('the page title and description, and the installed app\'s name, short name and description', () => {
    expect(indexHtml).toContain('<title>Fermatina — Music theory, from the instrument out</title>');
    expect(indexHtml).toContain('<meta name="description" content="Fermatina — interactive music theory through your instrument. Explore scales, chords, and keys with a piano or guitar always in reach." />');
    expect(indexHtml).not.toMatch(OLD_NAME);
    const vite = read('../../vite.config.ts');
    // The manifest's own lines (its comments may tell the story of the rename).
    const manifest = vite.slice(vite.indexOf('manifest: {'), vite.indexOf('workbox: {')).split('\n').filter((l) => !l.trim().startsWith('//')).join('\n');
    expect(manifest).toContain("name: 'Fermatina — Music Theory',");
    expect(manifest).toContain("short_name: 'Fermatina',");
    expect(manifest).toContain("description: 'Fermatina — interactive music theory through your instrument. Explore scales, chords, and keys with a piano or guitar always in reach.',");
    expect(manifest).not.toMatch(OLD_NAME);
    // The installed app stays the same app: no start_url / scope / id of its own (the defaults, '/'), the same icons and shortcut.
    expect(manifest).not.toMatch(/\b(start_url|scope|id):/);
    expect([...manifest.matchAll(/src: '([^']+)'/g)].map((m) => m[1])).toEqual(['/icon.svg', '/icon-192.png', '/icon-512.png', '/icon-192.png']);
    expect(manifest).toContain("url: '/?view=drill',");
  });
});

describe('Portuguese: one article with the name', () => {
  /** The language review's ruling (14 November): feminine. Flip to 'o' with the sentences if the owner overrules. */
  const PT_ARTICLE: 'a' | 'o' = 'a';
  const OTHER = PT_ARTICLE === 'a' ? /\b(o|O|do|ao|no|pelo|num|dum) Fermatina\b/ : /\b(a|A|da|à|na|pela|numa|duma) Fermatina\b/;
  const SAME = PT_ARTICLE === 'a' ? /\b(a|A|da|à|na|pela) Fermatina\b/ : /\b(o|O|do|ao|no|pelo) Fermatina\b/;
  const ptEntries = WORD_FILES.filter((w) => langOf(w.file) === 'pt').flatMap(({ file, entries }) => entries.map(([k, v]) => [`${file} ${k}`, v] as const));

  it('no PT sentence uses the other article', () => {
    expect(ptEntries.length).toBeGreaterThan(1000);
    expect(ptEntries.filter(([, v]) => OTHER.test(v))).toEqual([]);
  });

  it('the sentences that carry it (the list a change of article goes through)', () => {
    const carrying = ptEntries.filter(([, v]) => SAME.test(v)).map(([k]) => k);
    expect(carrying.length).toBe(20);
  });
});

describe('the address search engines are given', () => {
  it('index.html names https://fermatina.com/ as canonical, and asks nothing of it (no preconnect, no prefetch)', () => {
    expect(indexHtml).toContain('<link rel="canonical" href="https://fermatina.com/" />');
    const toNew = [...indexHtml.matchAll(/<link[^>]*fermatina\.com[^>]*>/g)].map((m) => m[0]);
    expect(toNew).toEqual(['<link rel="canonical" href="https://fermatina.com/" />']);
    expect(indexHtml).not.toMatch(/rel="(preconnect|dns-prefetch|prefetch|preload)"[^>]*fermatina/);
  });

  it('robots.txt allows everything and names the sitemap; the sitemap lists the one address', () => {
    expect(read('../../public/robots.txt')).toBe('User-agent: *\nAllow: /\n\nSitemap: https://fermatina.com/sitemap.xml\n');
    const sitemap = read('../../public/sitemap.xml');
    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')).toBe(true);
    expect([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])).toEqual(['https://fermatina.com/']);
  });

  it('the service worker hands both files to the server, never the app\'s page; vercel.json has no redirect or rewrite', () => {
    const vite = read('../../vite.config.ts');
    expect(vite).toContain('navigateFallbackDenylist: [/^\\/robots\\.txt$/, /^\\/sitemap\\.xml$/],');
    const vercel = JSON.parse(read('../../vercel.json')) as Record<string, unknown>;
    expect(Object.keys(vercel)).toEqual(['headers']);
  });
});

describe('release 13 (2026-11-14): the rename, in What\'s new', () => {
  it('is the newest entry: not critical, one line per language within 160 characters, each naming the new address and where to export', async () => {
    const { parseReleaseNotes, MAX_NOTE_LENGTH } = await import('../release/releaseNotes');
    const releases = parseReleaseNotes(JSON.parse(read('../../release-notes.json')));
    const [newest, previous] = releases;
    expect([newest.release, newest.date, newest.critical]).toEqual([13, '2026-11-14', false]);
    expect(previous.release).toBe(12);
    const locales = { en: JSON.parse(read('../i18n/locales/en.json')), pt: JSON.parse(read('../i18n/locales/pt.json')), es: JSON.parse(read('../i18n/locales/es.json')) };
    for (const lang of ['en', 'pt', 'es'] as const) {
      const note = newest.notes[lang];
      expect(note.length, lang).toBeLessThanOrEqual(MAX_NOTE_LENGTH);
      expect(note).toContain('fermatina.com');
      // The way there, in the app's own labels: Settings → Your data → Export.
      const s = locales[lang].settings;
      expect(note, lang).toContain(`${s.title} → ${s.yourData} → ${s.export}`);
    }
    expect([newest.notes.en.length, newest.notes.pt.length, newest.notes.es.length]).toEqual([122, 138, 128]);
  });
});
