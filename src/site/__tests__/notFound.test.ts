import { describe, it, expect, beforeAll } from 'vitest';
import registry from '../../../scripts/pages/slugs.json';
import indexHtml from '../../../index.html?raw';
import baseIndexHtml from './fixtures/index-6de6c0e.html?raw';
import { buildSite, notFoundPage, STYLESHEET, type Site } from '../render';
import { checkNotFoundPage, checkSite, homeFallbackLinks, homeFallbackProblems, textOf, type NotFoundFiles } from '../check';
import { appText, SITE_LANGS } from '../content';
import { NEW_STRINGS } from '../strings';
import { NOT_FOUND_FILE, servedFile, type PathKind } from '../notFound';
import type { SlugRegistry } from '../slugs';

/**
 * Audits A21 / Q12, A17 and A18 (2026-11-18), on the generator's output in
 * memory: the not-found page and its check (each check with a planted fault),
 * the address rule the host and `vite preview` answer by, what every page says
 * about working offline, and the home page's way on without its script.
 */
let site: Site;
const publicFiles = Object.keys(import.meta.glob('../../../public/**/*', { query: '?url', import: 'default', eager: true })).map((f) => f.replace('../../../public', ''));
beforeAll(() => {
  site = buildSite(registry as SlugRegistry);
});

/** The build's files as the not-found check sees them: every page's index.html, the stylesheet, public/. */
function notFoundFiles(edit: (f: { html: string; files: Set<string>; sitemap: string }) => void = () => {}): NotFoundFiles {
  const f = { html: notFoundPage(), files: new Set([STYLESHEET, ...publicFiles, '/index.html', ...site.pages.map((p) => `${p.path}index.html`)]), sitemap: site.sitemap };
  edit(f);
  return f;
}
const plant = (html: string, from: string | RegExp, to: string) => {
  const next = html.replace(from, to);
  expect(next, 'the planted fault changed nothing').not.toBe(html);
  return next;
};

describe('the not-found page (A21 / Q12)', () => {
  it('passes its own checks: noindex, no script, the name, each language\'s heading, sentence, home and lesson catalogue', () => {
    expect(checkNotFoundPage(notFoundFiles())).toEqual([]);
    const d = new DOMParser().parseFromString(notFoundPage(), 'text/html');
    expect(d.querySelector('h1')?.textContent).toBe('Fermatina');
    expect(d.title).toBe('Page not found · Página não encontrada · Página no encontrada · Fermatina');
    expect([...d.querySelectorAll('section')].map((s) => s.getAttribute('lang'))).toEqual(['en', 'pt-PT', 'es-ES']);
    expect([...d.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual(['/', '/en/', '/en/lessons/', '/pt/', '/pt/licoes/', '/es/', '/es/lecciones/']);
    const text = textOf(notFoundPage());
    for (const lang of SITE_LANGS) {
      expect(text).toContain(NEW_STRINGS[lang].notFoundTitle);
      expect(text).toContain(NEW_STRINGS[lang].notFoundLine);
      expect(text).toContain(appText(lang, 'start.tagline'));
    }
    expect(text).toContain('All 136 lessons');
    expect(text).toContain('Todas as 136 lições');
    expect(text).toContain('Las 136 lecciones');
  });

  it('its check catches: no page; noindex gone; a script; an address it claims; a relative link; a load not in the build', () => {
    expect(checkNotFoundPage({ ...notFoundFiles(), html: null })).toEqual(['/404.html: not in the build — the host would answer unknown addresses with its own bare page (audit A21)']);
    const one = (edit: (h: string) => string) => checkNotFoundPage(notFoundFiles((f) => { f.html = edit(f.html); }));
    expect(one((h) => plant(h, '<meta name="robots" content="noindex">\n', ''))).toEqual(['/404.html: robots []: expected exactly one "noindex"']);
    expect(one((h) => plant(h, '</body>', '<script src="/x.js"></script></body>'))).toContain('/404.html: 1 <script> element(s): it has none');
    expect(one((h) => plant(h, '</head>', '<link rel="canonical" href="https://fermatina.com/404.html">\n</head>'))).toContain('/404.html: claims an address (canonical, alternates or Open Graph): it is the page of none');
    const relative = one((h) => plant(h, 'href="/pt/licoes/"', 'href="pt/licoes/"'));
    expect(relative.some((p) => p.startsWith('/404.html: links ['))).toBe(true);
    expect(relative.some((p) => p.startsWith('/404.html: pt: links ['))).toBe(true);
    expect(one((h) => plant(h, 'href="/pages.css"', 'href="pages.css"'))).toContain('/404.html: loads pages.css: not an absolute path of this site (the page answers at any depth)');
    expect(checkNotFoundPage(notFoundFiles((f) => f.files.delete(STYLESHEET)))).toEqual(['/404.html: loads /pages.css, which is not in the build']);
    expect(one((h) => plant(h, '<h1 class="hero">', '<h1 class="hero" style="color:red">'))).toContain('/404.html: inline style or event handler');
  });

  it('its check catches: a language\'s words not the pages\' own, a missing language, the name gone, a link too many, in the sitemap', () => {
    const one = (edit: (h: string) => string) => checkNotFoundPage(notFoundFiles((f) => { f.html = edit(f.html); }));
    expect(one((h) => plant(h, NEW_STRINGS.es.notFoundLine, 'No existe.'))).toEqual(['/404.html: es: sentence "No existe.", expected "No hay ninguna página en esta dirección."']);
    expect(one((h) => plant(h, `>${NEW_STRINGS.pt.notFoundTitle}<`, '>Página inexistente<'))).toEqual(['/404.html: pt: heading "Página inexistente", expected "Página não encontrada"']);
    expect(one((h) => plant(h, /<section lang="es-ES"[\s\S]*?<\/section>/, '')).some((p) => p === '/404.html: no <section lang="es-ES">')).toBe(true);
    expect(one((h) => plant(h, /<h1 class="hero">[\s\S]*?<\/h1>/, '<h1>Not found</h1>'))).toEqual(['/404.html: h1 "Not found", expected the name "Fermatina"']);
    expect(one((h) => plant(h, '<li><a href="/en/lessons/">', '<li><a href="/en/words/">x</a></li>\n<li><a href="/en/lessons/">')).length).toBeGreaterThanOrEqual(2);
    expect(checkNotFoundPage(notFoundFiles((f) => { f.sitemap = f.sitemap.replace('</urlset>', '  <url><loc>https://fermatina.com/404.html</loc></url>\n</urlset>'); }))).toEqual(['/404.html: is in the sitemap']);
    expect(checkNotFoundPage(notFoundFiles((f) => f.files.delete('/pt/licoes/index.html')))).toEqual(['/404.html: links to /pt/licoes/, which is not in the build']);
  });
});

describe('the address rule (src/site/notFound.ts): what the host answers with a file, and what gets the not-found page', () => {
  const tree = new Map<string, PathKind>([
    ['index.html', 'file'], ['404.html', 'file'], ['robots.txt', 'file'], ['en', 'dir'], ['en/index.html', 'file'],
    ['en/lessons', 'dir'], ['en/lessons/index.html', 'file'], ['en/lessons/the-staff-and-clefs', 'dir'], ['en/lessons/the-staff-and-clefs/index.html', 'file'],
    ['fonts', 'dir'], ['fonts/a.woff2', 'file'], ['pt/licoes/a-musica', 'dir'], ['pt/licoes/a-musica/index.html', 'file'],
  ]);
  const kindOf = (rel: string) => tree.get(rel) ?? null;
  it('a file at its address, a folder\'s index.html with and without the slash, the query ignored', () => {
    expect(servedFile('/', kindOf)).toBe('index.html');
    expect(servedFile('/?lesson=l1u3m1&lang=pt', kindOf)).toBe('index.html');
    expect(servedFile('/index.html', kindOf)).toBe('index.html');
    expect(servedFile('/robots.txt', kindOf)).toBe('robots.txt');
    expect(servedFile('/en/', kindOf)).toBe('en/index.html');
    expect(servedFile('/en', kindOf)).toBe('en/index.html');
    expect(servedFile('/en/lessons/the-staff-and-clefs/', kindOf)).toBe('en/lessons/the-staff-and-clefs/index.html');
    expect(servedFile('/en/lessons/the-staff-and-clefs/?utm_source=x#top', kindOf)).toBe('en/lessons/the-staff-and-clefs/index.html');
    expect(servedFile('/pt/licoes/a-m%75sica/', kindOf)).toBe('pt/licoes/a-musica/index.html'); // %75 = u, decoded as the host does
    expect(servedFile(`/${NOT_FOUND_FILE}`, kindOf)).toBe('404.html');
  });
  it('anything else is not found: a mistyped lesson, an unknown path, a folder without an index, a file with a slash, a way out of dist/', () => {
    for (const address of ['/en/lessons/the-staff-and-clef/', '/this-page-does-not-exist/', '/no-such-page', '/fonts/', '/fonts', '/robots.txt/', '/index.htm', '/%2e%2e/etc/passwd', '/en/../../x', '/%E0%A4%A']) {
      expect(servedFile(address, kindOf), address).toBeNull();
    }
  });
});

describe('what the pages say about working offline (A17)', () => {
  /** The offline sentence of the app's start screen: true of the app, not of a reading page. */
  const OLD = { en: 'Works offline after your first visit.', pt: 'Depois da primeira visita, funciona offline.', es: 'Tras la primera visita, funciona sin conexión.' } as const;
  it('the app\'s own footer still carries it (the start screen is the app: known positive)', () => {
    for (const lang of SITE_LANGS) expect(appText(lang, 'start.footer')).toContain(OLD[lang]);
  });
  it('no page says it — not its text, its description, Open Graph or Twitter card — and every foot says what to open online instead', () => {
    expect(site.pages).toHaveLength(417);
    for (const p of site.pages) {
      expect(p.html, p.path).not.toContain(OLD[p.lang]);
      const foot = p.html.match(/<footer class="foot">[\s\S]*<\/footer>/)![0];
      expect(textOf(foot), p.path).toContain(NEW_STRINGS[p.lang].footer);
    }
  });
  it('the pages\' footer keeps the app\'s other sentences word for word: only the offline one differs', () => {
    const sentences = (s: string) => s.split(/(?<=\.) /);
    for (const lang of SITE_LANGS) {
      const app = sentences(appText(lang, 'start.footer'));
      const pages = sentences(NEW_STRINGS[lang].footer);
      expect(app).toHaveLength(4);
      expect(pages).toHaveLength(4);
      expect([pages[0], pages[1], pages[3]], lang).toEqual([app[0], app[1], app[3]]);
      expect(app[2]).toBe(OLD[lang]);
    }
  });
});

describe('the home page\'s way on without its script (A18)', () => {
  it('index.html holds the six links inside #root, named as the pages name them; the whole output still passes', () => {
    expect(homeFallbackProblems(indexHtml)).toEqual([]);
    expect(homeFallbackLinks().map((l) => `${l.href} ${l.text}`)).toEqual([
      '/en/ English', '/en/lessons/ Lessons', '/pt/ Português', '/pt/licoes/ Lições', '/es/ Español', '/es/lecciones/ Lecciones',
    ]);
    const report = checkSite({ pages: new Map(site.pages.map((p) => [p.path, p.html])), sitemap: site.sitemap, home: indexHtml, files: new Set(['/', STYLESHEET, ...publicFiles]) }, { lessons: 136 });
    expect(report.problems).toEqual([]);
  });

  it('its check fails on the base commit\'s index.html (an empty #root and nothing after it) and on each planted fault', () => {
    expect(homeFallbackProblems(baseIndexHtml)).toEqual(['no <div id="boot-links"> right after #root, the last thing in the body: no way on when the app does not start (audit A18)']);
    expect(homeFallbackProblems(plant(indexHtml, '>Lições<', '>Lessons<'))).toEqual(['#boot-links links /en/ "English", /en/lessons/ "Lessons", /pt/ "Português", /pt/licoes/ "Lessons", /es/ "Español", /es/lecciones/ "Lecciones": expected /en/ "English", /en/lessons/ "Lessons", /pt/ "Português", /pt/licoes/ "Lições", /es/ "Español", /es/lecciones/ "Lecciones"']);
    expect(homeFallbackProblems(plant(indexHtml, '<h1>Fermatina</h1>', '<h1>Fermatina</h1><script>1</script>'))).toEqual(['#boot-links holds a script']);
    expect(homeFallbackProblems(plant(indexHtml, '<h1>Fermatina</h1>', '<h1>Fermata</h1>'))).toEqual(['#boot-links is not headed by the name "Fermatina"']);
    expect(homeFallbackProblems(plant(indexHtml, '<noscript><style>#boot-links{animation:none}</style></noscript>', ''))).toEqual(['no <noscript> style showing #boot-links at once when scripts are off']);
    expect(homeFallbackProblems(plant(indexHtml, '#root:not(:empty)+#boot-links{display:none}', ''))).toEqual(['no style hiding #boot-links once the app has put anything into #root']);
    expect(homeFallbackProblems(plant(indexHtml, '<div id="root"></div>', '<div id="root"> </div>'))).toEqual(['#root is not empty in the initial HTML: the app\'s tests and the rule that hides the links read an empty #root']);
    expect(homeFallbackProblems(plant(indexHtml, '<li lang="es-ES">', '<li lang="es">'))).toEqual(['#boot-links: /es/ and /es/lecciones/ are not in one <li lang="es-ES">']);
  });

  it('the links lead to generated pages: a page gone fails the whole output', () => {
    const pages = new Map(site.pages.map((p) => [p.path, p.html]));
    pages.delete('/es/lecciones/');
    const report = checkSite({ pages, sitemap: site.sitemap, home: indexHtml, files: new Set(['/', STYLESHEET, ...publicFiles]) }, { lessons: 136 });
    expect(report.problems).toContain('index.html: its way on links to /es/lecciones/, which is no generated page');
  });
});
