import { describe, it, expect, beforeAll } from 'vitest';
import registry from '../../../scripts/pages/slugs.json';
import indexHtml from '../../../index.html?raw';
import { getNextModuleInLevel, getPreviousModuleInLevel, loadLevel } from '../../data/curriculumLoader';
import { findQuotedQueries } from '../../utils/theoryQuery';
import type { CurriculumLevel, CurriculumModule } from '../../core/types/curriculum';
import { siteLessons, SITE_LANGS, type SiteLang } from '../content';
import { buildSite, ORIGIN, sitePath, STYLESHEET, appUrl, lessonTitle, TITLE_WITH_NAME_MAX, type Site, type SitePage } from '../render';
import { checkSite, textOf, type SiteFiles } from '../check';
import { rawQueryTokens } from '../html';
import { NEW_STRINGS } from '../strings';
import type { SlugRegistry } from '../slugs';

/**
 * The generator's whole output, in memory: every page of every kind in every
 * language through the whole-output checks (src/site/check.ts — counts,
 * links, anchors, canonicals, twins, sitemap, JSON-LD, size, markup), then
 * the text of sample pages against what the app's own loader returns.
 */
const SLUGS = registry as SlugRegistry;
const publicFiles = Object.keys(import.meta.glob('../../../public/**/*', { query: '?url', import: 'default', eager: true })).map((f) => f.replace('../../../public', ''));

let site: Site;
let files: SiteFiles;
const byPath = new Map<string, SitePage>();
const doc = (path: string) => new DOMParser().parseFromString(byPath.get(path)!.html, 'text/html');
const text = (el: Element | null | undefined) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

beforeAll(() => {
  site = buildSite(SLUGS);
  for (const p of site.pages) byPath.set(p.path, p);
  files = {
    pages: new Map(site.pages.map((p) => [p.path, p.html])),
    sitemap: site.sitemap,
    home: indexHtml,
    files: new Set(['/', STYLESHEET, ...publicFiles]),
  };
});

const forbidden = () => {
  const out = new Map<string, string[]>();
  for (const lang of SITE_LANGS) {
    for (const { module } of siteLessons(lang)) out.set(sitePath.lesson(lang, SLUGS[module.id][lang]), module.tasks.flatMap((t) => rawQueryTokens(t.instruction)));
  }
  return out;
};

describe('the whole output', () => {
  it('passes every check: 136 × 3 lessons, 3 indexes, 3 glossaries, 3 landings; links, anchors, twins, sitemap, JSON-LD, size, markup', () => {
    const tokens = forbidden();
    expect([...tokens.values()].flat().length).toBeGreaterThan(300); // the raw-marker check has something to look for
    const report = checkSite(files, { lessons: 136, forbidden: tokens });
    expect(report.problems).toEqual([]);
    expect(report.counts).toEqual({ landing: 3, index: 3, lesson: 408, glossary: 3 });
    expect(report.links).toBeGreaterThan(5000);
    expect(site.pages).toHaveLength(417);
  });
});

describe('a lesson page carries the lesson, as the app\'s loader returns it', () => {
  const SAMPLE = ['l1u3m1', 'l1u34m4', 'l1u35m8', 'l5u17m2', 'l8u27m1', 'l9u32m5'];
  const levels = {} as Record<SiteLang, Map<string, { module: CurriculumModule; level: CurriculumLevel }>>;
  beforeAll(async () => {
    for (const lang of SITE_LANGS) {
      levels[lang] = new Map();
      for (const id of new Set(SAMPLE.map((m) => m.slice(0, 2)))) {
        const level = (await loadLevel(id, lang))!;
        for (const unit of level.units) for (const module of unit.modules) levels[lang].set(module.id, { module, level });
      }
    }
  });

  it.each(SITE_LANGS)('%s: title, subtitle, objectives, concepts, tasks, the open button', (lang) => {
    for (const id of SAMPLE) {
      const { module } = levels[lang].get(id)!;
      const d = doc(sitePath.lesson(lang, SLUGS[id][lang]));
      expect(text(d.querySelector('h1'))).toBe(module.title);
      expect(text(d.querySelector('.lead'))).toBe(module.subtitle);
      expect([...d.querySelectorAll('.objectives li')].map(text)).toEqual(module.objectives);
      const concepts = [...d.querySelectorAll('section.concept')];
      expect(concepts.map((s) => text(s.querySelector('h2')))).toEqual(module.concepts.map((c) => c.title));
      expect(concepts.map((s) => text(s.querySelector('.prose')))).toEqual(module.concepts.map((c) => c.explanation.replace(/\s+/g, ' ').trim()));
      // A task reads as the app shows it: every quoted query as ‘query’.
      const shown = (instruction: string) => {
        let out = '';
        let last = 0;
        for (const q of findQuotedQueries(instruction)) {
          out += `${instruction.slice(last, q.index)}‘${q.query}’`;
          last = q.index + q.length;
        }
        return (out + instruction.slice(last)).replace(/\s+/g, ' ').trim();
      };
      expect([...d.querySelectorAll('.tasks li')].map(text)).toEqual(module.tasks.map((t) => shown(t.instruction)));
      const open = [...d.querySelectorAll('a.button')];
      expect(open).toHaveLength(2);
      for (const a of open) {
        expect(a.getAttribute('href')).toBe(`https://fermatina.com/?lesson=${id}&lang=${lang}`);
        expect(text(a)).toBe(NEW_STRINGS[lang].openLesson);
      }
      // The interactive parts are one sentence each, never reproduced.
      expect(d.querySelectorAll('.try').length).toBe(module.concepts.filter((c) => c.tryThisQuery?.trim() || c.rhythm || c.clefs).length);
      expect(d.querySelector('svg:not(.mark), canvas, audio, button, input, form')).toBeNull();
    }
  });

  it('escapes the lesson text: the set-theory lesson\'s <0,0,1,1,1,0> and {C, E, G} come out as text', () => {
    const html = byPath.get(sitePath.lesson('en', SLUGS.l8u27m1.en))!.html;
    expect(html).toContain('&lt;0,0,1,1,1,0&gt;');
    expect(html).not.toContain('<0,0,1,1,1,0>');
    expect(text(doc(sitePath.lesson('en', SLUGS.l8u27m1.en)).querySelector('main'))).toContain('the ICV is <0,0,1,1,1,0>');
    // and a title with an ampersand
    expect(byPath.get(sitePath.lesson('en', SLUGS.l5u17m2.en))!.html).toContain('Theme &amp; Variations');
  });

  it('Previous / Next follow the app\'s lesson order on every lesson page', async () => {
    const back = new Map(Object.entries(SLUGS).map(([id, s]) => [sitePath.lesson('en', s.en), id]));
    let checked = 0;
    for (const { module, level } of siteLessons('en')) {
      const appLevel = (await loadLevel(level.id, 'en'))!;
      const d = doc(sitePath.lesson('en', SLUGS[module.id].en));
      const prev = d.querySelector('a[rel="prev"]')?.getAttribute('href');
      const next = d.querySelector('a[rel="next"]')?.getAttribute('href');
      expect(prev ? back.get(prev) : undefined).toBe(getPreviousModuleInLevel(module.id, appLevel)?.id);
      expect(next ? back.get(next) : undefined).toBe(getNextModuleInLevel(module.id, appLevel)?.id);
      checked++;
    }
    expect(checked).toBe(136);
  });
});

describe('the head of every page', () => {
  it('a lesson: lang, title, description, canonical, hreflang en / pt / es / x-default, Open Graph, Twitter, JSON-LD', () => {
    const path = sitePath.lesson('pt', SLUGS.l1u3m1.pt);
    const d = doc(path);
    expect(d.documentElement.lang).toBe('pt-PT');
    expect(d.title).toBe('A escala maior · Fermatina');
    expect(d.querySelector('meta[name="description"]')?.getAttribute('content')).toMatch(/^O padrão T-T-mT-T-T-T-mT que define a tonalidade maior\./);
    expect(d.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${ORIGIN}${path}`);
    expect(Object.fromEntries([...d.querySelectorAll('link[rel="alternate"]')].map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]))).toEqual({
      en: `${ORIGIN}/en/lessons/${SLUGS.l1u3m1.en}/`,
      pt: `${ORIGIN}/pt/licoes/${SLUGS.l1u3m1.pt}/`,
      es: `${ORIGIN}/es/lecciones/${SLUGS.l1u3m1.es}/`,
      'x-default': `${ORIGIN}/en/lessons/${SLUGS.l1u3m1.en}/`,
    });
    const og = (p: string) => d.querySelector(`meta[property="${p}"]`)?.getAttribute('content');
    expect([og('og:title'), og('og:url'), og('og:locale'), og('og:image'), og('og:type')]).toEqual(['A escala maior · Fermatina', `${ORIGIN}${path}`, 'pt_PT', `${ORIGIN}/og.png`, 'article']);
    expect(d.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe('summary_large_image');
    const ld = JSON.parse(d.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(ld).toMatchObject({ '@context': 'https://schema.org', '@type': 'LearningResource', name: 'A escala maior', inLanguage: 'pt-PT', isAccessibleForFree: true, isPartOf: { '@type': 'Course', url: `${ORIGIN}/pt/licoes/` } });
  });

  it('the landing pages: WebApplication, free, educational, three languages; x-default is the app\'s home, which names them back', () => {
    for (const lang of SITE_LANGS) {
      const d = doc(`/${lang}/`);
      const ld = JSON.parse(d.querySelector('script[type="application/ld+json"]')!.textContent!);
      expect(ld).toMatchObject({ '@type': 'WebApplication', isAccessibleForFree: true, applicationCategory: 'EducationalApplication', inLanguage: ['en', 'pt-PT', 'es-ES'] });
      expect(d.querySelector('link[hreflang="x-default"]')?.getAttribute('href')).toBe(`${ORIGIN}/`);
      expect(d.querySelector('a.button')?.getAttribute('href')).toBe(appUrl(lang));
      expect(appUrl(lang)).toBe(`https://fermatina.com/?lang=${lang}`);
    }
    const home = new DOMParser().parseFromString(indexHtml, 'text/html');
    expect([...home.querySelectorAll('link[rel="alternate"]')].map((l) => `${l.getAttribute('hreflang')} ${l.getAttribute('href')}`)).toEqual([
      'en https://fermatina.com/en/', 'pt https://fermatina.com/pt/', 'es https://fermatina.com/es/', 'x-default https://fermatina.com/',
    ]);
    expect(home.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(`${ORIGIN}/og.png`);
  });

  it('the landing pages: the reviewed title; a description of whole sentences; "What is inside" as bold names, no colon', () => {
    const want = {
      en: { title: 'Fermatina: learn music theory on a piano or guitar in your browser', description: 124, names: ['Explore', 'Learn', 'Drill', 'Tuner', 'Metronome'] },
      pt: { title: 'Fermatina: aprende teoria musical num piano ou numa guitarra', description: 150, names: ['Explorar', 'Aprender', 'Treino', 'Afinador', 'Metrónomo'] },
      es: { title: 'Fermatina: aprende teoría musical en un piano o una guitarra', description: 155, names: ['Explorar', 'Aprender', 'Práctica', 'Afinador', 'Metrónomo'] },
    } as const;
    for (const lang of SITE_LANGS) {
      const d = doc(`/${lang}/`);
      expect(d.title).toBe(want[lang].title);
      const description = d.querySelector('meta[name="description"]')!.getAttribute('content')!;
      expect(description.length).toBe(want[lang].description);
      expect(description).toMatch(/\.$/);
      const items = [...d.querySelectorAll('ul.inside li')];
      expect(items.map((li) => text(li.querySelector('strong')))).toEqual(want[lang].names);
      for (const li of items) {
        const rest = text(li).slice(text(li.querySelector('strong')).length).trim();
        expect(rest, text(li)).toMatch(/^[\p{Lu}]/u);
        expect(rest.slice(0, 20), text(li)).not.toMatch(/^[^ ]+: /);
      }
    }
    expect(text(doc('/en/').querySelectorAll('ul.inside li')[4])).toBe('Metronome Steady clicks from 30 to 240 beats a minute, with 2, 3, 4 or 6 beats in a bar.');
    expect(text(doc('/pt/').querySelectorAll('ul.inside li')[4])).toBe('Metrónomo Cliques regulares de 30 a 240 pulsações por minuto, com 2, 3, 4 ou 6 pulsações por compasso.');
  });

  it('the glossary\'s description opens on the word people type, its count computed', () => {
    const lead = { en: 'Glossary: 108 music words', pt: 'Glossário: 108 palavras da teoria musical', es: 'Glosario: 108 palabras de la música' } as const;
    for (const lang of SITE_LANGS) {
      const d = doc(sitePath.glossary(lang));
      expect(d.querySelector('meta[name="description"]')!.getAttribute('content')).toMatch(new RegExp(`^${lead[lang]}, `));
      expect(text(d.querySelector('.lead'))).toMatch(/^108 /);
      expect(d.querySelectorAll('.term')).toHaveLength(108);
    }
    expect(doc('/pt/palavras/').title).toBe('Palavras da teoria musical, em linguagem simples · Fermatina');
  });

  it('JSON-LD cannot be closed by its text: < > & are \\u escapes, and it parses back', () => {
    const glossary = byPath.get('/en/words/')!.html;
    const block = glossary.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1];
    expect(block).not.toMatch(/[<>&]/);
    expect(JSON.parse(block).hasDefinedTerm.length).toBe(108);
  });
});

describe('the index, the glossary and the sitemap', () => {
  it('each index lists every lesson of its language, with its subtitle, under its level and unit (or track)', () => {
    for (const lang of SITE_LANGS) {
      const d = doc(sitePath.index(lang));
      const links = new Map([...d.querySelectorAll('ol.lessons a')].map((a) => [a.getAttribute('href'), text(a.querySelector('.ls'))]));
      for (const { module, unit, level } of siteLessons(lang)) {
        expect(links.get(sitePath.lesson(lang, SLUGS[module.id][lang]))).toBe(module.subtitle.replace(/\s+/g, ' ').trim());
        expect(d.getElementById(`unit-${unit.id}`)).not.toBeNull();
        expect(d.getElementById(`level-${level.number}`)).not.toBeNull();
      }
      expect(links.size).toBe(136);
    }
  });

  it('each glossary has every term, one anchor each, with its plain words', () => {
    const d = doc('/es/palabras/');
    const terms = [...d.querySelectorAll('.term')];
    expect(terms).toHaveLength(108);
    expect(new Set(terms.map((t) => t.id)).size).toBe(108);
    expect(text(d.getElementById('relative-key')?.querySelector('dfn'))).toBe('Tonalidad relativa');
  });

  it('the sitemap is XML: the home and all 417 pages, each with its four alternates', () => {
    const xml = new DOMParser().parseFromString(site.sitemap, 'application/xml');
    expect(xml.querySelector('parsererror')).toBeNull();
    const urls = [...xml.getElementsByTagName('url')];
    expect(urls).toHaveLength(418);
    expect(urls[0].getElementsByTagName('loc')[0].textContent).toBe('https://fermatina.com/');
    for (const u of urls) expect(u.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')).toHaveLength(4);
  });
});

describe('the pages are text, not the app', () => {
  it('no page carries a script but its data block, a store\'s words or an exercise', () => {
    for (const p of site.pages) {
      expect(p.html.match(/<script\b/g)).toHaveLength(1);
      expect(textOf(p.html)).not.toMatch(/music-theory-app|fermata-drill|localStorage/);
    }
  });
});

describe('a lesson page\'s title: the site\'s name only while the whole title fits the limit', () => {
  it('carries the site\'s name while it fits, and is the lesson\'s own title, unshortened, when it does not', () => {
    expect(TITLE_WITH_NAME_MAX).toBe(60);
    expect(lessonTitle('The Major Scale')).toBe('The Major Scale · Fermatina');
    const atLimit = 'x'.repeat(TITLE_WITH_NAME_MAX - ' · Fermatina'.length);
    expect(lessonTitle(atLimit)).toBe(`${atLimit} · Fermatina`);
    expect(lessonTitle(`${atLimit}y`)).toBe(`${atLimit}y`);
  });

  it('holds over every lesson page of the build: named up to the limit, never cut, never empty, all different', () => {
    const site = buildSite(registry as SlugRegistry);
    const titles: string[] = [];
    let alone = 0;
    for (const lang of SITE_LANGS) {
      const own = new Map(siteLessons(lang).map((l) => [l.module.id, l.module.title]));
      for (const page of site.pages.filter((p) => p.kind === 'lesson' && p.lang === lang)) {
        titles.push(`${lang}:${page.title}`);
        expect(page.title.trim().length, page.path).toBeGreaterThan(0);
        expect(/<title>([^<]*)<\/title>/.exec(page.html)?.[1]?.trim().length ?? 0, page.path).toBeGreaterThan(0);
        if (page.title.endsWith(' · Fermatina')) {
          expect(page.title.length, page.title).toBeLessThanOrEqual(TITLE_WITH_NAME_MAX);
          expect(page.title, page.path).toBe(`${own.get(page.key)} · Fermatina`);
        } else {
          alone++;
          expect(page.title, page.path).toBe(own.get(page.key));
          expect(`${page.title} · Fermatina`.length, page.title).toBeGreaterThan(TITLE_WITH_NAME_MAX);
        }
      }
    }
    expect(titles.length).toBe(136 * 3);
    expect(new Set(titles).size).toBe(titles.length);
    // Known positive: some titles are long enough to stand alone, most are not.
    expect(alone).toBeGreaterThan(0);
    expect(alone).toBeLessThan(60);
  });
});
