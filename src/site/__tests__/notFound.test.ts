import { describe, it, expect, beforeAll } from 'vitest';
import registry from '../../../scripts/pages/slugs.json';
import indexHtml from '../../../index.html?raw';
import baseIndexHtml from './fixtures/index-6de6c0e.html?raw';
import { buildSite, notFoundPage, STYLESHEET, type Site } from '../render';
import { checkNotFoundPage, checkSite, HOME_FALLBACK_ANIMATION, HOME_FALLBACK_DELAY, HOME_FALLBACK_FADE, HOME_FALLBACK_KEYFRAMES, HOME_FALLBACK_NOSCRIPT, homeFallbackLinks, homeFallbackProblems, textOf, type NotFoundFiles } from '../check';
import { appText, SITE_LANGS, siteLessons } from '../content';
import { NEW_STRINGS } from '../strings';
import { NOT_FOUND_FILE, servedFile, type PathKind } from '../notFound';
import type { SlugRegistry } from '../slugs';
import { findQuotedQueries } from '../../utils/theoryQuery';

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
  /**
   * The offline sentence, word for word, in each language (2026-11-19, review:
   * a PT rewording saying the reading pages work offline passed every test,
   * which compared the pages with the generator's own string).
   */
  const OFFLINE = {
    en: 'Open Fermatina once while you are online, and from then on the app works offline; these reading pages need a connection.',
    pt: 'Abre a Fermatina uma vez com ligação à internet e, a partir daí, a app funciona offline; estas páginas de leitura precisam de ligação.',
    es: 'Abre Fermatina una vez con conexión a internet y, a partir de entonces, la app funciona sin conexión; estas páginas de lectura necesitan conexión.',
  } as const;
  /**
   * What it must MEAN, in each language, whatever its wording: open it once
   * while online; the app then works offline; these reading pages need a
   * connection; and nowhere that the reading pages work offline.
   */
  const MEANING = {
    en: { online: /\bonce while you are online\b/, app: /\bthe app works offline\b/, pages: /\bthese reading pages need a connection\b/, pagesOffline: /\breading pages\b[^.;]*\bwork offline\b/ },
    pt: { online: /\buma vez com ligação à internet\b/, app: /\ba app funciona offline\b/, pages: /\bestas páginas de leitura precisam de ligação\b/, pagesOffline: /\bpáginas de leitura\b[^.;]*\bfuncionam offline\b/ },
    es: { online: /\buna vez con conexión a internet\b/, app: /\bla app funciona sin conexión\b/, pages: /\bestas páginas de lectura necesitan conexión\b/, pagesOffline: /\bpáginas de lectura\b[^.;]*\bfuncionan sin conexión\b/ },
  } as const;
  const meaningProblems = (lang: keyof typeof MEANING, sentence: string) => {
    const m = MEANING[lang];
    return [
      ...(m.online.test(sentence) ? [] : ['does not say to open it once while online']),
      ...(m.app.test(sentence) ? [] : ['does not say the app works offline']),
      ...(m.pages.test(sentence) ? [] : ['does not say these reading pages need a connection']),
      ...(m.pagesOffline.test(sentence) ? ['says the reading pages work offline'] : []),
    ];
  };
  it('the offline sentence, word for word in each language, on every page\'s foot', () => {
    for (const lang of SITE_LANGS) expect(NEW_STRINGS[lang].footer.split(/(?<=\.) /)[2], lang).toBe(OFFLINE[lang]);
    for (const p of site.pages) {
      const foot = p.html.match(/<footer class="foot">[\s\S]*<\/footer>/)![0];
      expect(textOf(foot), p.path).toContain(OFFLINE[p.lang]);
    }
  });
  it('what it means, in each language: the app works offline once opened online; these reading pages need a connection', () => {
    for (const lang of SITE_LANGS) expect(meaningProblems(lang, NEW_STRINGS[lang].footer), lang).toEqual([]);
    // Known positives: the review's PT rewording, and the same fault in English and Spanish.
    expect(meaningProblems('pt', 'Abre a Fermatina uma vez com ligação à internet e, a partir daí, a app e estas páginas de leitura funcionam offline.')).toEqual(['does not say the app works offline', 'does not say these reading pages need a connection', 'says the reading pages work offline']);
    expect(meaningProblems('en', 'Open Fermatina once while you are online, and from then on the app and these reading pages work offline.')).toEqual(['does not say the app works offline', 'does not say these reading pages need a connection', 'says the reading pages work offline']);
    expect(meaningProblems('es', 'Abre Fermatina una vez con conexión a internet y, a partir de entonces, la app funciona sin conexión; estas páginas de lectura también funcionan sin conexión.')).toEqual(['does not say these reading pages need a connection', 'says the reading pages work offline']);
    // Known negative: another wording with the same meaning passes (the check reads the claims, not the sentence).
    expect(meaningProblems('en', 'Open Fermatina once while you are online; after that the app works offline, though these reading pages need a connection.')).toEqual([]);
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
    expect(homeFallbackProblems(plant(indexHtml, HOME_FALLBACK_NOSCRIPT, ''))).toEqual([`no <noscript> style showing #boot-links at once, without its lines, when scripts are off: ${HOME_FALLBACK_NOSCRIPT}`]);
    expect(homeFallbackProblems(plant(indexHtml, '#root:not(:empty)+#boot-links{display:none}', ''))).toEqual(['no style hiding #boot-links once the app has put anything into #root']);
    expect(homeFallbackProblems(plant(indexHtml, '<div id="root"></div>', '<div id="root"> </div>'))).toEqual(['#root is not empty in the initial HTML: the app\'s tests and the rule that hides the links read an empty #root']);
    expect(homeFallbackProblems(plant(indexHtml, '<li lang="es-ES">', '<li lang="es">'))).toEqual(['#boot-links: /es/ and /es/lecciones/ are not in one <li lang="es-ES">', `#boot-links <li lang="es-ES"> does not open on its line "${NEW_STRINGS.es.bootSlow}"`]);
  });

  it('its check pins the line in each language, the delay and fade, the lines hidden with scripts off, and upright regular text (2026-11-19)', () => {
    // The values as index.html writes them: 2.5 s from the first frame, then a 0.6 s fade.
    expect(HOME_FALLBACK_ANIMATION).toBe('animation:boot-links .6s cubic-bezier(.42,0,1,1) 2.5s both');
    expect(indexHtml).toContain(HOME_FALLBACK_ANIMATION);
    expect(indexHtml).toContain(HOME_FALLBACK_KEYFRAMES);
    // Each line, word for word, first in its language's item (the browser test reads the same words, spelled out).
    expect(NEW_STRINGS.en.bootSlow).toBe('Fermatina is taking a while to start. Meanwhile, you can read the lessons:');
    expect(NEW_STRINGS.pt.bootSlow).toBe('A Fermatina está a demorar a arrancar. Entretanto, podes ler as lições:');
    expect(NEW_STRINGS.es.bootSlow).toBe('Fermatina está tardando en arrancar. Mientras tanto, puedes leer las lecciones:');
    const delay = `#boot-links does not wait ${HOME_FALLBACK_DELAY} and fade in over ${HOME_FALLBACK_FADE}: expected "${HOME_FALLBACK_ANIMATION}" in`;
    const one = (from: string | RegExp, to: string) => homeFallbackProblems(plant(indexHtml, from, to));
    // The delay back at 4 s, or no fade, or a second animation.
    expect(one('2.5s both', '4s both')).toEqual([expect.stringContaining(delay)]);
    expect(one('.6s cubic-bezier(.42,0,1,1) 2.5s', '0s 2.5s')).toEqual([expect.stringContaining(delay)]);
    expect(one('animation:boot-links .6s cubic-bezier(.42,0,1,1) 2.5s both}', 'animation:boot-links .6s cubic-bezier(.42,0,1,1) 2.5s both;animation-delay:4s}')).toEqual([expect.stringContaining(delay)]);
    expect(one(HOME_FALLBACK_KEYFRAMES, '@keyframes boot-links{from{visibility:hidden}}')).toEqual([`no ${HOME_FALLBACK_KEYFRAMES}`]);
    // With scripts off the lines would show (nothing is loading): the no-script style without its second rule.
    expect(one('#boot-links{animation:none}#boot-links p{display:none}</style></noscript>', '#boot-links{animation:none}</style></noscript>')).toEqual([`no <noscript> style showing #boot-links at once, without its lines, when scripts are off: ${HOME_FALLBACK_NOSCRIPT}`]);
    // A line reworded, gone, or after its links; a fourth line.
    expect(one('podes ler as lições:', 'podes ler as lições aqui.')).toEqual([`#boot-links <li lang="pt-PT"> does not open on its line "${NEW_STRINGS.pt.bootSlow}"`]);
    expect(one(`<p>${NEW_STRINGS.es.bootSlow}</p>`, '')).toEqual([`#boot-links <li lang="es-ES"> does not open on its line "${NEW_STRINGS.es.bootSlow}"`, '#boot-links holds 2 <p>: one line per language']);
    expect(one(/<li lang="en"><p>([^<]*)<\/p>(<a href="\/en\/">English<\/a><a href="\/en\/lessons\/">Lessons<\/a>)/, '<li lang="en">$2<p>$1</p>')).toEqual([`#boot-links <li lang="en"> does not open on its line "${NEW_STRINGS.en.bootSlow}"`]);
    expect(one('<h1>Fermatina</h1>', '<h1>Fermatina</h1><p>x</p>')).toEqual(['#boot-links holds 4 <p>: one line per language']);
    // Upright regular text only.
    const upright = '#boot-links is not upright regular text throughout (an italic or bold face would be fetched early, delaying the app)';
    expect(one('font-style:normal;font-weight:400', 'font-style:italic;font-weight:400')).toEqual([upright]);
    expect(one('#boot-links p{flex-basis:100%;', '#boot-links p{flex-basis:100%;font-weight:600;')).toEqual([upright]);
    expect(one('Meanwhile, you can', 'Meanwhile, <em>you</em> can')).toEqual([`#boot-links <li lang="en"> does not open on its line "${NEW_STRINGS.en.bootSlow}"`, upright]);
  });

  it('the links lead to generated pages: a page gone fails the whole output', () => {
    const pages = new Map(site.pages.map((p) => [p.path, p.html]));
    pages.delete('/es/lecciones/');
    const report = checkSite({ pages, sitemap: site.sitemap, home: indexHtml, files: new Set(['/', STYLESHEET, ...publicFiles]) }, { lessons: 136 });
    expect(report.problems).toContain('index.html: its way on links to /es/lecciones/, which is no generated page');
  });
});

/** The pages' words that tell a reader to open the app, word for word (the foot's sentence opens on them). */
const OPEN_WORDS = { en: 'Open Fermatina', pt: 'Abre a Fermatina', es: 'Abre Fermatina' } as const;
const APP_HOME = { en: 'https://fermatina.com/?lang=en', pt: 'https://fermatina.com/?lang=pt', es: 'https://fermatina.com/?lang=es' } as const;
/** A page's links, as written (entities decoded), with their text. */
const linksOf = (html: string) => [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => ({ attrs: m[1], href: (m[1].match(/\shref="([^"]*)"/)?.[1] ?? '').replace(/&amp;/g, '&'), text: textOf(m[2]) }));

describe('a page that tells the reader to open Fermatina offers the way (2026-11-19, review)', () => {
  it('every page whose text says to open Fermatina has a link to the app: the glossaries too', () => {
    expect(site.pages).toHaveLength(417);
    const without = site.pages.filter((p) => textOf(p.html).includes(OPEN_WORDS[p.lang]) && !linksOf(p.html).some((l) => l.href.startsWith('https://fermatina.com/?'))).map((p) => p.path);
    expect(without).toEqual([]);
  });
  it('on all 417 pages the foot\'s own words are that link: an ordinary link to the app in the page\'s language, the sentence unchanged', () => {
    for (const p of site.pages) {
      const foot = p.html.match(/<footer class="foot">[\s\S]*<\/footer>/)![0];
      const own = linksOf(foot).filter((l) => l.text === OPEN_WORDS[p.lang]);
      expect(own.map((l) => l.href), p.path).toEqual([APP_HOME[p.lang]]);
      expect(own[0].attrs, `${p.path}: an ordinary link, in this tab`).toBe(` href="${APP_HOME[p.lang]}"`);
      expect(textOf(foot), p.path).toContain(NEW_STRINGS[p.lang].footer);
    }
  });
});

describe('a lesson\'s tasks: each quoted phrase is a link to the lesson in the app (2026-11-19, review)', () => {
  it('every quoted phrase on every lesson page is an ordinary link to the page\'s own "open this lesson" address — none left as text', () => {
    const lessons = site.pages.filter((p) => p.kind === 'lesson');
    expect(lessons).toHaveLength(408);
    let phrases = 0;
    for (const p of lessons) {
      const tasks = p.html.match(/<ul class="tasks">([\s\S]*?)<\/ul>/)?.[1] ?? '';
      expect(tasks, p.path).not.toContain('<span class="query">');
      const open = p.html.match(/<p class="open"><a class="button" href="([^"]*)"/)![1].replace(/&amp;/g, '&');
      expect(open, p.path).toMatch(/^https:\/\/fermatina\.com\/\?lesson=l\du\d+m\d+&lang=(en|pt|es)$/);
      for (const l of linksOf(tasks)) {
        expect(l.attrs, p.path).toMatch(/^ class="query" href="[^"]*"/);
        expect(l.href, `${p.path} ${l.text}`).toBe(open);
        expect(l.text, p.path).toMatch(/^‘[^‘’]+’$/);
        phrases++;
      }
    }
    // Every quoted phrase the lessons' tasks hold, counted from the source, not the pages.
    const expected = SITE_LANGS.reduce((n, lang) => n + siteLessons(lang).reduce((m, l) => m + l.module.tasks.reduce((k, t) => k + findQuotedQueries(t.instruction).length, 0), 0), 0);
    expect(expected, 'the lessons have quoted phrases (known positive)').toBeGreaterThan(1000);
    expect(phrases).toBe(expected);
    const major = site.pages.find((p) => p.path === '/en/lessons/the-major-scale/')!.html;
    expect(major).toContain('<a class="query" href="https://fermatina.com/?lesson=l1u3m1&amp;lang=en"');
  });
});

describe('the build\'s whole-output check holds both (2026-11-19): each rule with a planted fault', () => {
  const files = (pages: Map<string, string>) => ({ pages, sitemap: site.sitemap, home: indexHtml, files: new Set(['/', STYLESHEET, ...publicFiles]) });
  const realPages = () => new Map(site.pages.map((p) => [p.path, p.html]));
  const MAJOR = { en: '/en/lessons/the-major-scale/', es: '/es/lecciones/la-escala-mayor/' } as const;
  const swap = (pages: Map<string, string>, path: string, from: string | RegExp, to: string) => {
    const html = pages.get(path)!;
    const next = html.replace(from, to);
    expect(next, `the planted fault changed nothing on ${path}`).not.toBe(html);
    pages.set(path, next);
  };
  const open = (lang: 'en' | 'pt' | 'es', lesson?: string) => `https://fermatina.com/?${lesson ? `lesson=${lesson}&` : ''}lang=${lang}`;

  it('the real output passes (known negative)', () => {
    expect(checkSite(files(realPages()), { lessons: 136 }).problems).toEqual([]);
  });

  it('a foot without its link, with a link to another language, or one that opens a new tab', () => {
    const pages = realPages();
    swap(pages, '/pt/palavras/', `<a href="${open('pt')}">${NEW_STRINGS.pt.footerOpen}</a>`, NEW_STRINGS.pt.footerOpen);
    swap(pages, '/es/', `<a href="${open('es')}">${NEW_STRINGS.es.footerOpen}</a>`, `<a href="${open('en')}">${NEW_STRINGS.es.footerOpen}</a>`);
    swap(pages, '/en/words/', `<a href="${open('en')}">${NEW_STRINGS.en.footerOpen}</a>`, `<a href="${open('en')}" target="_blank">${NEW_STRINGS.en.footerOpen}</a>`);
    expect(checkSite(files(pages), { lessons: 136 }).problems.sort()).toEqual([
      `/en/words/: the foot says "Open Fermatina" without one ordinary link to ${open('en')} ([{"href":"${open('en')}","target":"_blank"}])`,
      `/es/: the foot says "Abre Fermatina" without one ordinary link to ${open('es')} ([{"href":"${open('en')}"}])`,
      `/pt/palavras/: the foot says "Abre a Fermatina" without one ordinary link to ${open('pt')} ([])`,
    ]);
  });

  it('a task\'s phrase left as text, linking to another lesson, or not an ordinary link', () => {
    const pages = realPages();
    swap(pages, MAJOR.en, /<a class="query" href="[^"]*">(‘C major scale’)<\/a>/, '<span class="query">$1</span>');
    swap(pages, MAJOR.es, /(<a class="query" href=")[^"]*(")/, `$1${open('es', 'l1u3m2').replace('&', '&amp;')}$2`);
    swap(pages, '/pt/licoes/a-escala-maior/', /<a class="query" (href="[^"]*")>/, '<a class="query" $1 target="_blank">');
    // A phrase left as text with no mark at all, and a mark outside the task list.
    swap(pages, '/en/lessons/the-staff-and-clefs/', /<a class="query" href="[^"]*">(‘[^’]*’)<\/a>/, '$1');
    swap(pages, '/es/lecciones/escala-menor-natural/', '<p class="lead">', '<p class="lead"><span class="query">x</span>');
    expect(checkSite(files(pages), { lessons: 136 }).problems.sort()).toEqual([
      expect.stringMatching(/^\/en\/lessons\/the-major-scale\/: a task's quoted phrase is not an ordinary link to this lesson in the app: <span class="query">‘C major scale’$/),
      expect.stringMatching(/^\/en\/lessons\/the-staff-and-clefs\/: a task's quoted phrase is not an ordinary link to this lesson in the app: ‘[^’]+’$/),
      `/es/lecciones/escala-menor-natural/: a quoted phrase's mark outside the task list`,
      `/es/lecciones/la-escala-mayor/: a task's quoted phrase links to ${open('es', 'l1u3m2')}, not to this lesson in the app (${open('es', 'l1u3m1')})`,
      expect.stringMatching(/^\/pt\/licoes\/a-escala-maior\/: a task's quoted phrase is not an ordinary link to this lesson in the app: <a class="query" href="[^"]*" target="_blank">‘[^’]+’$/),
    ]);
    // The mutant of 2026-11-19 the first form of this rule let through: a span with one more attribute.
    const more = realPages();
    swap(more, MAJOR.en, /<a class="query" href="([^"]*)">(‘C major scale’)<\/a>/, '<span class="query" data-href="$1">$2</span>');
    expect(checkSite(files(more), { lessons: 136 }).problems).toEqual([expect.stringMatching(/^\/en\/lessons\/the-major-scale\/: a task's quoted phrase is not an ordinary link to this lesson in the app: <span class="query" data-href="[^"]*">‘C major scale’$/)]);
  });
});
