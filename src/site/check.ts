/**
 * Whole-output checks for the search pages: run by the build on what it
 * wrote (scripts/pages/build.ts reads dist/ back), by `npm run check:pages`
 * on a dist/ already built, and by src/site/__tests__ on the generator's
 * output in memory. Over EVERY page, never a sample. Pure: reads strings,
 * parses with regular expressions (the pages are generated, so their shape
 * is known; anything outside it is itself a finding).
 */
import { htmlLangFor } from '../i18n/language';
import { SITE_LANGS, type SiteLang } from './content';
import { ORIGIN, OG_IMAGE, PATH_WORDS, type PageKind } from './render';

export interface SiteFiles {
  /** Every generated page: its path ('/en/lessons/the-major-scale/') → its HTML. */
  pages: Map<string, string>;
  sitemap: string;
  /** The app's index.html (the home page), for its alternates. */
  home: string;
  /** Every other file served at the site's root that a page may point at ('/pages.css', '/og.png', '/fonts/…'). */
  files: ReadonlySet<string>;
}

export interface CheckExpect {
  /** Lessons per language. */
  lessons: number;
  /** Per page path, raw strings that must not appear in its text (a task's quoted-query tokens). */
  forbidden?: ReadonlyMap<string, readonly string[]>;
}

export interface CheckReport {
  problems: string[];
  counts: Record<PageKind, number>;
  totalBytes: number;
  largest: { path: string; bytes: number };
  links: number;
}

/** Above this a page is not "a page of text" any more. */
export const MAX_PAGE_BYTES = 250_000;

const ALLOWED_TAGS = ['html', 'head', 'meta', 'title', 'link', 'script', 'body', 'a', 'header', 'nav', 'main', 'footer', 'section', 'div', 'h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'dfn', 'span', 'svg', 'path', 'circle'];
const STRAY_LT = new RegExp(`<(?!!doctype html>|/?(?:${ALLOWED_TAGS.join('|')})[\\s>/])`, 'i');
const BAD_AMP = /&(?!(?:amp|lt|gt|quot|#39|#\d+|#x[0-9a-f]+);)/i;
const JSON_LD = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
const EXPECTED_TYPE: Record<PageKind, string> = { landing: 'WebApplication', index: 'Course', lesson: 'LearningResource', glossary: 'DefinedTermSet' };

/** What kind of page a path is, and its language; null for a path that is no page. */
export function pageKindOf(path: string): { kind: PageKind; lang: SiteLang } | null {
  for (const lang of SITE_LANGS) {
    const w = PATH_WORDS[lang];
    if (path === `/${lang}/`) return { kind: 'landing', lang };
    if (path === `/${lang}/${w.lessons}/`) return { kind: 'index', lang };
    if (path === `/${lang}/${w.words}/`) return { kind: 'glossary', lang };
    if (new RegExp(`^/${lang}/${w.lessons}/[a-z0-9]+(?:-[a-z0-9]+)*/$`).test(path)) return { kind: 'lesson', lang };
  }
  return null;
}

const decode = (s: string) =>
  s.replace(/&(amp|lt|gt|quot|#39|#(\d+)|#x([0-9a-f]+));/gi, (_, name: string, dec?: string, hex?: string) => {
    if (dec) return String.fromCodePoint(Number(dec));
    if (hex) return String.fromCodePoint(parseInt(hex, 16));
    return ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" } as Record<string, string>)[name.toLowerCase()];
  });

function attrs(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of tag.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)) out[m[1].toLowerCase()] = decode(m[2]);
  return out;
}

const tagsOf = (html: string, name: string) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => attrs(m[0]));

/** The page's visible text: scripts out, tags out, entities decoded. */
export function textOf(html: string): string {
  return decode(html.replace(JSON_LD, ' ').replace(/<head>[\s\S]*<\/head>/, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

interface Parsed {
  lang: string | null;
  title: string | null;
  description: string | null;
  canonical: string[];
  alternates: Map<string, string>;
  alternateCount: number;
  ogUrl: string | null;
  images: string[];
  ids: string[];
  hrefs: string[];
  loads: string[];
  jsonLd: string[];
  scripts: number;
  h1: string | null;
}

function parse(html: string): Parsed {
  const metas = tagsOf(html, 'meta');
  const links = tagsOf(html, 'link');
  const meta = (key: 'name' | 'property', v: string) => metas.filter((m) => m[key] === v).map((m) => m.content);
  const alternates = new Map<string, string>();
  const alt = links.filter((l) => l.rel === 'alternate' && l.hreflang);
  for (const l of alt) alternates.set(l.hreflang, l.href);
  const titles = [...html.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => decode(m[1]));
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);
  return {
    lang: html.match(/<html lang="([^"]+)">/)?.[1] ?? null,
    title: titles.length === 1 ? titles[0] : null,
    description: meta('name', 'description').length === 1 ? meta('name', 'description')[0] : null,
    canonical: links.filter((l) => l.rel === 'canonical').map((l) => l.href),
    alternates,
    alternateCount: alt.length,
    ogUrl: meta('property', 'og:url')[0] ?? null,
    images: [...meta('property', 'og:image'), ...meta('name', 'twitter:image')],
    ids: [...html.matchAll(/\sid="([^"]*)"/g)].map((m) => m[1]),
    hrefs: [...html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)].map((m) => decode(m[1])),
    loads: [
      ...links.filter((l) => l.rel !== 'canonical' && l.rel !== 'alternate').map((l) => l.href),
      ...[...html.matchAll(/\ssrc="([^"]*)"/g)].map((m) => decode(m[1])),
    ],
    jsonLd: [...html.matchAll(JSON_LD)].map((m) => m[1]),
    scripts: (html.match(/<script\b/g) ?? []).length,
    h1: h1 ? textOf(h1[1]) : null,
  };
}

function sitemapEntries(xml: string): Map<string, Map<string, string>> {
  const out = new Map<string, Map<string, string>>();
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = m[1].match(/<loc>([^<]*)<\/loc>/)?.[1];
    if (!loc) continue;
    const alts = new Map<string, string>();
    for (const l of m[1].matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\/>/g)) alts.set(l[1], decode(l[2]));
    out.set(decode(loc), alts);
  }
  return out;
}

const sameMap = (a: Map<string, string>, b: Map<string, string>) => a.size === b.size && [...a].every(([k, v]) => b.get(k) === v);
const show = (m: Map<string, string>) => [...m].map(([k, v]) => `${k}=${v}`).join(', ');

/** Every check over every page. `problems` empty = good. */
export function checkSite(site: SiteFiles, expect: CheckExpect): CheckReport {
  const problems: string[] = [];
  const counts: Record<PageKind, number> = { landing: 0, index: 0, lesson: 0, glossary: 0 };
  const parsed = new Map<string, Parsed>();
  let totalBytes = 0;
  let largest = { path: '', bytes: 0 };
  let links = 0;
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  for (const [path, html] of site.pages) {
    const where = (msg: string) => problems.push(`${path}: ${msg}`);
    const kind = pageKindOf(path);
    if (!kind) {
      where('not a page address');
      continue;
    }
    counts[kind.kind]++;
    const bytes = new TextEncoder().encode(html).length;
    totalBytes += bytes;
    if (bytes > largest.bytes) largest = { path, bytes };
    if (bytes > MAX_PAGE_BYTES) where(`${bytes} B, above ${MAX_PAGE_BYTES} B`);

    const p = parse(html);
    parsed.set(path, p);
    const canonical = `${ORIGIN}${path}`;
    if (!html.startsWith('<!doctype html>\n')) where('does not start with <!doctype html>');
    if (p.lang !== htmlLangFor(kind.lang)) where(`<html lang="${p.lang}">, expected ${htmlLangFor(kind.lang)}`);
    // Unique within a language (a Portuguese and a Spanish lesson may share a title: "Textura").
    const titleKey = `${kind.lang} ${p.title}`;
    const descriptionKey = `${kind.lang} ${p.description}`;
    if (!p.title) where('needs exactly one non-empty <title>');
    else if (titles.has(titleKey)) where(`title "${p.title}" is also ${titles.get(titleKey)}'s`);
    else titles.set(titleKey, path);
    if (!p.description) where('needs exactly one meta description');
    else if (p.description.length > 200) where(`description is ${p.description.length} characters`);
    else if (descriptions.has(descriptionKey)) where(`description is also ${descriptions.get(descriptionKey)}'s`);
    else descriptions.set(descriptionKey, path);
    if (p.canonical.length !== 1 || p.canonical[0] !== canonical) where(`canonical ${JSON.stringify(p.canonical)}, expected ${canonical}`);
    if (p.ogUrl !== canonical) where(`og:url ${p.ogUrl}, expected ${canonical}`);
    if (p.alternateCount !== 4 || !['en', 'pt', 'es', 'x-default'].every((l) => p.alternates.has(l))) where(`alternates ${show(p.alternates)}: needs en, pt, es and x-default, once each`);
    if (p.alternates.get(kind.lang) !== canonical) where(`its own ${kind.lang} alternate is ${p.alternates.get(kind.lang)}, not its canonical`);
    if (p.images.length !== 2 || p.images.some((u) => u !== `${ORIGIN}${OG_IMAGE}`)) where(`og:image / twitter:image ${JSON.stringify(p.images)}`);
    if (!p.h1) where('has no <h1>');

    // Markup: only the tags the generator writes; every & an entity; no script but the one data block.
    const body = html.replace(JSON_LD, '');
    const stray = body.match(STRAY_LT);
    if (stray) where(`unescaped "<" or an unexpected tag at …${body.slice(Math.max(0, (stray.index ?? 0) - 30), (stray.index ?? 0) + 30)}…`);
    const amp = body.match(BAD_AMP);
    if (amp) where(`unescaped "&" at …${body.slice(Math.max(0, (amp.index ?? 0) - 30), (amp.index ?? 0) + 30)}…`);
    if (p.scripts !== 1 || p.jsonLd.length !== 1) where(`${p.scripts} <script> element(s), ${p.jsonLd.length} JSON-LD block(s): exactly one, the data block`);
    if (/\sstyle="|<style\b|\son[a-z]+="/i.test(body)) where('inline style or event handler');
    const text = textOf(html);
    for (const marker of ['{{', '}}', 'undefined', '[object Object]', 'NaN']) if (text.includes(marker)) where(`text contains "${marker}"`);
    for (const raw of expect.forbidden?.get(path) ?? []) if (text.includes(raw)) where(`raw marker ${JSON.stringify(raw)} reached the page`);

    // JSON-LD: parses, schema.org, the right type for the page, in the page's language.
    for (const block of p.jsonLd) {
      try {
        const data = JSON.parse(block) as Record<string, unknown>;
        if (data['@context'] !== 'https://schema.org') where(`JSON-LD @context ${String(data['@context'])}`);
        if (data['@type'] !== EXPECTED_TYPE[kind.kind]) where(`JSON-LD @type ${String(data['@type'])}, expected ${EXPECTED_TYPE[kind.kind]}`);
        if (kind.kind !== 'landing' && data.inLanguage !== htmlLangFor(kind.lang)) where(`JSON-LD inLanguage ${String(data.inLanguage)}`);
        if (kind.kind === 'lesson') {
          if (data.name !== p.h1) where(`JSON-LD name "${String(data.name)}" is not the h1 "${p.h1}"`);
          if (data.isAccessibleForFree !== true || !data.isPartOf || data.url !== canonical) where('JSON-LD lesson needs isAccessibleForFree, isPartOf and its url');
        }
      } catch (e) {
        where(`JSON-LD does not parse: ${(e as Error).message}`);
      }
    }

    // Ids unique on the page.
    const seen = new Set<string>();
    for (const id of p.ids) {
      if (seen.has(id)) where(`id "${id}" twice`);
      seen.add(id);
    }

    // Files the page loads: same origin, existing.
    for (const url of p.loads) {
      if (!url.startsWith('/') || url.startsWith('//')) where(`loads ${url} (not this site)`);
      else if (!site.files.has(url.split(/[?#]/)[0])) where(`loads ${url}, which is not in the build`);
    }
  }

  // Links: every internal link resolves to a generated page (or file), every anchor to an id there.
  for (const [path, p] of parsed) {
    const where = (msg: string) => problems.push(`${path}: ${msg}`);
    for (const href of p.hrefs) {
      links++;
      let target = href;
      if (href.startsWith(`${ORIGIN}/?`)) {
        const q = new URLSearchParams(href.slice(ORIGIN.length + 2));
        const keys = [...q.keys()].join(',');
        if (!(keys === 'lang' || keys === 'lesson,lang') || !SITE_LANGS.includes(q.get('lang') as SiteLang) || (q.has('lesson') && !/^l\du\d+m\d+$/.test(q.get('lesson')!))) where(`app link ${href}`);
        continue;
      }
      if (href.startsWith(ORIGIN)) target = href.slice(ORIGIN.length);
      if (target.startsWith('#')) target = `${path}${target}`;
      if (!target.startsWith('/') || target.startsWith('//')) {
        where(`links out of the site: ${href}`);
        continue;
      }
      const [file, anchor] = target.split('#');
      const dest = parsed.get(file);
      if (!dest) {
        if (!site.files.has(file)) where(`broken link ${href}`);
        continue;
      }
      if (anchor !== undefined && !dest.ids.includes(anchor)) where(`link ${href}: no id "${anchor}" on ${file}`);
    }
  }

  // Reachable: from each language's landing page, by ordinary links between
  // pages of that language, every page of that language.
  for (const lang of SITE_LANGS) {
    const start = `/${lang}/`;
    const reached = new Set<string>([start]);
    const queue = [start];
    while (queue.length) {
      const p = parsed.get(queue.shift()!);
      for (const href of p?.hrefs ?? []) {
        const file = (href.startsWith(ORIGIN) ? href.slice(ORIGIN.length) : href).split('#')[0];
        if (parsed.has(file) && pageKindOf(file)?.lang === lang && !reached.has(file)) {
          reached.add(file);
          queue.push(file);
        }
      }
    }
    for (const path of parsed.keys()) if (pageKindOf(path)?.lang === lang && !reached.has(path)) problems.push(`${path}: not reachable by links from ${start}`);
  }

  // Twins agree: each alternate of a page is a page with the very same set.
  for (const [path, p] of parsed) {
    for (const lang of SITE_LANGS) {
      const url = p.alternates.get(lang);
      const twin = url?.startsWith(ORIGIN) ? parsed.get(url.slice(ORIGIN.length)) : undefined;
      if (!twin) problems.push(`${path}: its ${lang} alternate ${url} is no generated page`);
      else if (!sameMap(twin.alternates, p.alternates)) problems.push(`${path}: its ${lang} twin lists other alternates (${show(twin.alternates)})`);
    }
    const xd = p.alternates.get('x-default');
    if (xd !== `${ORIGIN}/` && !(xd?.startsWith(ORIGIN) && parsed.has(xd.slice(ORIGIN.length)))) problems.push(`${path}: x-default ${xd} is neither the home nor a page`);
  }

  if (!site.files.has(OG_IMAGE)) problems.push(`the shared image ${OG_IMAGE} is not in the build`);

  // The home (index.html) names the landing pages back.
  const home = parse(site.home);
  const landingAlts = parsed.get('/en/')?.alternates;
  if (!landingAlts || !sameMap(home.alternates, landingAlts)) problems.push(`index.html: alternates (${show(home.alternates)}) are not the landing pages' (${landingAlts ? show(landingAlts) : 'none'})`);
  if (home.canonical.length !== 1 || home.canonical[0] !== `${ORIGIN}/`) problems.push(`index.html: canonical ${JSON.stringify(home.canonical)}`);

  // The sitemap: the home and every page, each with the page's own alternates.
  if (!site.sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">')) problems.push('sitemap.xml: not the expected header');
  if (BAD_AMP.test(site.sitemap)) problems.push('sitemap.xml: unescaped "&"');
  const entries = sitemapEntries(site.sitemap);
  const urlCount = (site.sitemap.match(/<url>/g) ?? []).length;
  if (urlCount !== entries.size) problems.push(`sitemap.xml: ${urlCount} <url> for ${entries.size} distinct <loc>`);
  const homeEntry = entries.get(`${ORIGIN}/`);
  if (!homeEntry) problems.push('sitemap.xml: no entry for the home page');
  else if (!sameMap(homeEntry, home.alternates)) problems.push(`sitemap.xml: the home's alternates (${show(homeEntry)}) are not index.html's`);
  for (const [path, p] of parsed) {
    const e = entries.get(`${ORIGIN}${path}`);
    if (!e) problems.push(`sitemap.xml: no entry for ${path}`);
    else if (!sameMap(e, p.alternates)) problems.push(`sitemap.xml: ${path}'s alternates differ from the page's`);
  }
  for (const loc of entries.keys()) if (loc !== `${ORIGIN}/` && !parsed.has(loc.slice(ORIGIN.length))) problems.push(`sitemap.xml: ${loc} is no page`);

  // Counts.
  const want: Record<PageKind, number> = { landing: 3, index: 3, lesson: 3 * expect.lessons, glossary: 3 };
  for (const k of Object.keys(want) as PageKind[]) if (counts[k] !== want[k]) problems.push(`${counts[k]} ${k} page(s), expected ${want[k]}`);

  return { problems, counts, totalBytes, largest, links };
}
