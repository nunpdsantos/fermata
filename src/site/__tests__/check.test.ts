import { describe, it, expect, beforeAll } from 'vitest';
import registry from '../../../scripts/pages/slugs.json';
import indexHtml from '../../../index.html?raw';
import { buildSite, STYLESHEET, type Site } from '../render';
import { checkSite, MAX_PAGE_BYTES, pageKindOf, type SiteFiles } from '../check';
import { appText } from '../content';
import type { SlugRegistry } from '../slugs';
import { REPORT_FORMS, TEST_FORM } from '../../services/feedbackForms';

/**
 * Each whole-output check can fail: one planted fault at a time in the real
 * output, and the checker names it. (The clean output passes: render.test.ts.)
 */
let site: Site;
const publicFiles = Object.keys(import.meta.glob('../../../public/**/*', { query: '?url', import: 'default', eager: true })).map((f) => f.replace('../../../public', ''));
beforeAll(() => {
  site = buildSite(registry as SlugRegistry);
});

const LESSON = '/en/lessons/the-major-scale/';
function files(edit: (pages: Map<string, string>, rest: { sitemap: string; home: string; files: Set<string> }) => void = () => {}): SiteFiles {
  const pages = new Map(site.pages.map((p) => [p.path, p.html]));
  const rest = { sitemap: site.sitemap, home: indexHtml, files: new Set(['/', STYLESHEET, ...publicFiles]) };
  edit(pages, rest);
  return { pages, ...rest };
}
const problems = (f: SiteFiles, forbidden?: Map<string, string[]>) => checkSite(f, { lessons: 136, forbidden }).problems;
const replaceIn = (pages: Map<string, string>, path: string, from: string | RegExp, to: string) => {
  const html = pages.get(path)!;
  const next = html.replace(from, to);
  expect(next, `the planted fault changed nothing on ${path}`).not.toBe(html);
  pages.set(path, next);
};

describe('the whole-output checks catch', () => {
  it('nothing on the real output', () => {
    expect(problems(files())).toEqual([]);
  });

  it('a missing page (the count) and the links that pointed at it', () => {
    const p = problems(files((pages) => pages.delete('/pt/licoes/a-escala-maior/')));
    expect(p).toContain('407 lesson page(s), expected 408');
    expect(p.some((x) => x.includes('broken link /pt/licoes/a-escala-maior/'))).toBe(true);
    expect(p).toContain('sitemap.xml: https://fermatina.com/pt/licoes/a-escala-maior/ is no page');
  });

  it('a broken link and an anchor that is not there', () => {
    const p = problems(files((pages) => {
      replaceIn(pages, LESSON, 'href="/en/lessons/"', 'href="/en/lesson/"');
      replaceIn(pages, LESSON, '#level-1"', '#level-10"');
    }));
    expect(p).toContain(`${LESSON}: broken link /en/lesson/`);
    expect(p).toContain(`${LESSON}: link /en/lessons/#level-10: no id "level-10" on /en/lessons/`);
  });

  it('an unescaped < and an unescaped & in the text', () => {
    const set = '/en/lessons/pitch-class-sets-and-set-theory/';
    const p = problems(files((pages) => {
      replaceIn(pages, set, '&lt;0,0,1,1,1,0&gt;', '<0,0,1,1,1,0>');
      replaceIn(pages, '/en/lessons/song-forms-and-large-forms-introduction/', 'Theme &amp; Variations', 'Theme & Variations');
    }));
    expect(p.some((x) => x.startsWith(`${set}: unescaped "<"`))).toBe(true);
    expect(p.some((x) => x.startsWith('/en/lessons/song-forms-and-large-forms-introduction/: unescaped "&"'))).toBe(true);
  });

  it('a raw marker: a task\'s quoted query left as typed, an unfilled {{place}}', () => {
    const p = problems(
      files((pages) => {
        replaceIn(pages, LESSON, '<span class="query">‘C major scale’</span>', '&#39;C major scale&#39;');
        replaceIn(pages, '/es/', '<h1 class="hero">', '<h1 class="hero">{{count}} ');
      }),
      new Map([[LESSON, ["'C major scale'"]]]),
    );
    expect(p).toContain(`${LESSON}: raw marker "'C major scale'" reached the page`);
    expect(p).toContain('/es/: text contains "{{"');
  });

  it('JSON-LD that does not parse, or of the wrong type', () => {
    const p = problems(files((pages) => {
      replaceIn(pages, LESSON, '"@type":"LearningResource"', '"@type":"LearningResource",');
      replaceIn(pages, '/pt/', '"@type":"WebApplication"', '"@type":"Thing"');
    }));
    expect(p.some((x) => x.startsWith(`${LESSON}: JSON-LD does not parse`))).toBe(true);
    expect(p).toContain('/pt/: JSON-LD @type Thing, expected WebApplication');
  });

  it('a wrong canonical, a twin that disagrees, a missing x-default', () => {
    const p = problems(files((pages) => {
      replaceIn(pages, LESSON, '<link rel="canonical" href="https://fermatina.com/en/lessons/the-major-scale/">', '<link rel="canonical" href="https://fermata-music.vercel.app/en/lessons/the-major-scale/">');
      replaceIn(pages, '/es/lecciones/la-escala-mayor/', 'hreflang="pt" href="https://fermatina.com/pt/licoes/a-escala-maior/"', 'hreflang="pt" href="https://fermatina.com/pt/licoes/"');
      replaceIn(pages, '/es/palabras/', /<link rel="alternate" hreflang="x-default"[^>]*>\n/, '');
    }));
    expect(p.some((x) => x.startsWith(`${LESSON}: canonical`))).toBe(true);
    expect(p.some((x) => x.startsWith('/es/lecciones/la-escala-mayor/: its pt twin lists other alternates'))).toBe(true);
    expect(p.some((x) => x.startsWith('/en/lessons/the-major-scale/: its es twin lists other alternates'))).toBe(true);
    expect(p.some((x) => x.startsWith('/es/palabras/: alternates'))).toBe(true);
  });

  it('a sitemap without a page, with a stray entry, or out of step with index.html', () => {
    const p = problems(files((_pages, rest) => {
      rest.sitemap = rest.sitemap.replace(/ {2}<url>\n {4}<loc>https:\/\/fermatina\.com\/pt\/palavras\/<\/loc>[\s\S]*?<\/url>\n/, '');
      rest.sitemap = rest.sitemap.replace('</urlset>', '  <url>\n    <loc>https://fermatina.com/en/nowhere/</loc>\n  </url>\n</urlset>');
      rest.home = rest.home.replace('hreflang="es" href="https://fermatina.com/es/"', 'hreflang="es" href="https://fermatina.com/es/lecciones/"');
    }));
    expect(p).toContain('sitemap.xml: no entry for /pt/palavras/');
    expect(p).toContain('sitemap.xml: https://fermatina.com/en/nowhere/ is no page');
    expect(p.some((x) => x.startsWith('index.html: alternates'))).toBe(true);
  });

  it('a page that is too big, a file from another site, a second script, a duplicate title or id', () => {
    const p = problems(files((pages) => {
      replaceIn(pages, '/en/words/', '</main>', `<p>${'x'.repeat(MAX_PAGE_BYTES)}</p>\n</main>`);
      replaceIn(pages, LESSON, '<link rel="stylesheet" href="/pages.css">', '<link rel="stylesheet" href="https://fonts.example.com/x.css">');
      replaceIn(pages, '/pt/', '</body>', '<script src="/x.js"></script>\n</body>');
      replaceIn(pages, '/en/lessons/', '<title>Learn Music Theory · Fermatina</title>', '<title>The Major Scale · Fermatina</title>');
      replaceIn(pages, '/es/', 'id="inside"', 'id="doors"');
    }));
    expect(p.some((x) => x.startsWith('/en/words/: ') && x.includes(`above ${MAX_PAGE_BYTES} B`))).toBe(true);
    expect(p).toContain(`${LESSON}: loads https://fonts.example.com/x.css (not this site)`);
    expect(p.some((x) => x.startsWith('/pt/: 2 <script> element(s)'))).toBe(true);
    expect(p.some((x) => x.includes('title "The Major Scale · Fermatina" is also'))).toBe(true);
    expect(p).toContain('/es/: id "doors" twice');
  });

  it('icons other than the PNG, then the SVG, then the apple-touch icon, on a page or on the home (2026-11-15)', () => {
    let home = '';
    const p = problems(files((pages, rest) => {
      replaceIn(pages, LESSON, '<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">\n', '');
      replaceIn(pages, '/pt/', /(<link rel="icon" type="image\/png"[^>]*>)\n(<link rel="icon" type="image\/svg\+xml"[^>]*>)/, '$2\n$1');
      replaceIn(pages, '/es/palabras/', '<link rel="apple-touch-icon" href="/icon-192.png">', '<link rel="apple-touch-icon" href="/icon-192.png">\n<link rel="shortcut icon" href="/favicon.ico">');
      home = rest.home;
      rest.home = rest.home.replace(/ *<link rel="icon" type="image\/png"[^>]*>\n/, '');
      expect(rest.home, 'the planted fault changed nothing on index.html').not.toBe(home);
    }));
    expect(p.some((x) => x.startsWith(`${LESSON}: icons ["icon image/svg+xml - /icon.svg","apple-touch-icon - - /icon-192.png"]: expected`))).toBe(true);
    expect(p.some((x) => x.startsWith('/pt/: icons ["icon image/svg+xml - /icon.svg","icon image/png 192x192 /icon-192.png",'))).toBe(true);
    expect(p.some((x) => x.startsWith('/es/palabras/: icons') && x.includes('"shortcut icon - - /favicon.ico"]: expected'))).toBe(true);
    expect(p.some((x) => x.startsWith('index.html: icons ["icon image/svg+xml - /icon.svg"'))).toBe(true);
    expect(p).toHaveLength(4); // nothing else: the files all exist
    expect(home).toContain('<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />'); // known positive
  });

  it('a meta description cut mid-sentence, or over 160 characters', () => {
    const p = problems(files((pages) => {
      replaceIn(pages, '/pt/', /<meta name="description" content="[^"]*">/, '<meta name="description" content="Aprende como funciona a música, num piano ou numa guitarra que podes tocar aqui mesmo. Grátis. Sem conta. Depois da">');
      replaceIn(pages, '/es/palabras/', /<meta name="description" content="[^"]*">/, `<meta name="description" content="${'Una frase larga. '.repeat(10).trim()}">`);
    }));
    expect(p.some((x) => x.startsWith('/pt/: description ends mid-sentence') && x.endsWith('Depois da'))).toBe(true);
    expect(p.some((x) => x.startsWith('/es/palabras/: description is 169 characters, above 160'))).toBe(true);
  });

  describe('the foot\'s feedback link (2026-11-14): the one link allowed to another host', () => {
    // The forms and labels as the app has them, read here, never typed.
    const footLink = (path: string) => site.pages.find((p) => p.path === path)!.html.match(/<p class="feedback"><a href="([^"]*)"[^>]*>([^<]*)<\/a><\/p>/)!;
    const enHref = () => footLink(LESSON)[1];

    it('every page has it: its language\'s form, the page\'s path in the details, the menu\'s label, a new tab (the real output)', () => {
      for (const page of site.pages) {
        const [, href, text] = footLink(page.path);
        const url = new URL(href.replaceAll('&amp;', '&'));
        const form = REPORT_FORMS[page.lang];
        expect(`${url.origin}${url.pathname}`, page.path).toBe(form.url);
        expect([...url.searchParams.keys()], page.path).toEqual(['usp', `entry.${form.detailsEntry}`]);
        expect(url.searchParams.get(`entry.${form.detailsEntry}`), page.path).toBe(`page · ${page.path} · ${page.lang}`);
        expect(text, page.path).toBe(appText(page.lang, 'report.menuItem'));
      }
      expect(site.pages).toHaveLength(417);
    });

    it('a link to any other host (and the test sheet\'s form, which is not for these pages)', () => {
      const p = problems(files((pages) => {
        replaceIn(pages, LESSON, '<p class="lead">', '<p class="lead"><a href="https://evil.example/x">x</a> ');
        replaceIn(pages, '/pt/', '<p class="lead">', `<p class="lead"><a href="${TEST_FORM.url}">x</a> `);
        replaceIn(pages, '/es/', '<p class="lead">', '<p class="lead"><a href="http://docs.google.com/forms/d/e/x/viewform">x</a> ');
      }));
      expect(p).toContain(`${LESSON}: links out of the site: https://evil.example/x`);
      expect(p).toContain(`/pt/: links out of the site: ${TEST_FORM.url}`);
      expect(p).toContain('/es/: links out of the site: http://docs.google.com/forms/d/e/x/viewform');
    });

    it('a missing link, or a second one', () => {
      const p = problems(files((pages) => {
        replaceIn(pages, LESSON, /<p class="feedback">[\s\S]*?<\/p>/, '');
        replaceIn(pages, '/pt/', '<p class="lead">', `<p class="lead"><a href="${footLink('/pt/')[1]}" target="_blank" rel="noopener noreferrer">${appText('pt', 'report.menuItem')}</a> `);
      }));
      expect(p).toContain(`${LESSON}: 0 feedback-form link(s): exactly one, in the foot`);
      expect(p).toContain('/pt/: 2 feedback-form link(s): exactly one, in the foot');
      expect(p).toContain('/pt/: feedback link is not in the <footer>');
    });

    it('another language\'s form, another page\'s path, another language in the details, an extra parameter', () => {
      const ptForm = REPORT_FORMS.pt;
      const p = problems(files((pages) => {
        replaceIn(pages, LESSON, `${REPORT_FORMS.en.url}?usp=pp_url&amp;entry.${REPORT_FORMS.en.detailsEntry}=`, `${ptForm.url}?usp=pp_url&amp;entry.${ptForm.detailsEntry}=`);
        replaceIn(pages, '/en/words/', encodeURIComponent('/en/words/'), encodeURIComponent('/en/'));
        replaceIn(pages, '/es/', encodeURIComponent(' · es'), encodeURIComponent(' · en'));
        replaceIn(pages, '/pt/licoes/', 'usp=pp_url&amp;', 'usp=pp_url&amp;hl=pt&amp;');
      }));
      expect(p).toContain(`${LESSON}: feedback link to ${ptForm.url}: not the en form`);
      expect(p).toContain(`/en/words/: feedback link's details "page · /en/ · en", expected "page · /en/words/ · en"`);
      expect(p).toContain(`/es/: feedback link's details "page · /es/ · en", expected "page · /es/ · es"`);
      expect(p.some((x) => x.startsWith('/pt/licoes/: feedback link\'s query'))).toBe(true);
      expect(enHref()).toContain('&amp;entry.'); // known positive: the planted text was the page's own
    });

    it('a label that is not the menu\'s, or a link that keeps an opener or opens in place', () => {
      const p = problems(files((pages) => {
        replaceIn(pages, LESSON, `>${appText('en', 'report.menuItem')}</a>`, '>Report a problem (Google form)</a>');
        replaceIn(pages, '/es/', 'target="_blank" rel="noopener noreferrer"', 'target="_blank" rel="noopener"');
        replaceIn(pages, '/pt/palavras/', ' target="_blank" rel="noopener noreferrer"', '');
      }));
      expect(p).toContain(`${LESSON}: feedback link reads "Report a problem (Google form)", not the menu's "${appText('en', 'report.menuItem')}"`);
      expect(p).toContain('/es/: feedback link has target="_blank" rel="noopener": expected target="_blank" rel="noopener noreferrer"');
      expect(p).toContain('/pt/palavras/: feedback link has target="undefined" rel="undefined": expected target="_blank" rel="noopener noreferrer"');
    });
  });

  it('a page no link reaches', () => {
    const p = problems(files((pages) => {
      // Every English link to one lesson cut (its Portuguese and Spanish twins still link to it).
      for (const [path, html] of pages) {
        if (path.startsWith('/en/')) pages.set(path, html.replaceAll('href="/en/lessons/the-chromatic-scale/"', 'href="/en/lessons/"'));
      }
    }));
    expect(p).toContain('/en/lessons/the-chromatic-scale/: not reachable by links from /en/');
  });
});

describe('pageKindOf', () => {
  it('knows the four kinds of address in each language, and nothing else', () => {
    expect(pageKindOf('/pt/')).toEqual({ kind: 'landing', lang: 'pt' });
    expect(pageKindOf('/es/lecciones/')).toEqual({ kind: 'index', lang: 'es' });
    expect(pageKindOf('/en/lessons/the-major-scale/')).toEqual({ kind: 'lesson', lang: 'en' });
    expect(pageKindOf('/pt/palavras/')).toEqual({ kind: 'glossary', lang: 'pt' });
    expect(pageKindOf('/pt/lessons/the-major-scale/')).toBeNull();
    expect(pageKindOf('/en/lessons/The-Major-Scale/')).toBeNull();
    expect(pageKindOf('/fr/')).toBeNull();
  });
});
