/**
 * Whole-output checks for the search pages: run by the build on what it
 * wrote (scripts/pages/build.ts reads dist/ back), by `npm run check:pages`
 * on a dist/ already built, and by src/site/__tests__ on the generator's
 * output in memory. Over EVERY page, never a sample. Pure: reads strings,
 * parses with regular expressions (the pages are generated, so their shape
 * is known; anything outside it is itself a finding).
 */
import { htmlLangFor } from '../i18n/language';
import { REPORT_FORMS } from '../services/feedbackForms';
import { SITE_LANGS, appText, siteLessons, type SiteLang } from './content';
import { MAX_DESCRIPTION, ORIGIN, OG_IMAGE, PATH_WORDS, SENTENCE_END, appUrl, type PageKind } from './render';
import { LANGUAGE_NAMES, newText } from './strings';

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

const ALLOWED_TAGS = ['html', 'head', 'meta', 'title', 'link', 'script', 'body', 'a', 'header', 'nav', 'main', 'footer', 'section', 'div', 'h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'dfn', 'span', 'strong', 'svg', 'path', 'circle'];
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

/**
 * The only addresses on another host a page may link to (2026-11-14): the
 * three feedback forms, one per language, from the foot. Anything else that
 * leaves the site is a finding; so is a feedback link that is not the page's
 * own (its language's form, its path in the details box, the menu's label).
 */
/**
 * The icons every page and the home (index.html) declare, in this order
 * (2026-11-15), as `rel type sizes href`: the PNG first, because Google's
 * search results take BMP, GIF, ICO, PNG, JPEG, PPM or TIFF and do not list
 * SVG (developers.google.com/search/docs/appearance/favicon-in-search); then
 * the SVG, which a browser that takes the last icon it can use keeps in its
 * tab; then the apple-touch icon. Nothing else: /favicon.ico is linked from
 * nowhere (a linked ICO can win the tab over the SVG).
 */
export const PAGE_ICONS: readonly string[] = [
  'icon image/png 192x192 /icon-192.png',
  'icon image/svg+xml - /icon.svg',
  'apple-touch-icon - - /icon-192.png',
];

const FEEDBACK_FORMS: readonly string[] = Object.values(REPORT_FORMS).map((f) => f.url);
export const isFeedbackFormHref = (href: string) => FEEDBACK_FORMS.some((url) => href === url || href.startsWith(`${url}?`));

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
  /** Every icon link (any rel with an icon token), as `rel type sizes href`, in order. */
  icons: string[];
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
  /** Links to a feedback form: their attributes, text and whether they sit in the <footer>. */
  formLinks: { href: string; target?: string; rel?: string; text: string; inFoot: boolean }[];
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
  const foot = { start: html.search(/<footer\b/), end: html.indexOf('</footer>') };
  const formLinks = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)]
    .map((m) => {
      const a = attrs(m[1]);
      const at = m.index ?? 0;
      return { href: a.href ?? '', target: a.target, rel: a.rel, text: textOf(m[2]), inFoot: foot.start >= 0 && at > foot.start && at < foot.end };
    })
    .filter((l) => isFeedbackFormHref(l.href));
  return {
    lang: html.match(/<html lang="([^"]+)">/)?.[1] ?? null,
    title: titles.length === 1 ? titles[0] : null,
    description: meta('name', 'description').length === 1 ? meta('name', 'description')[0] : null,
    canonical: links.filter((l) => l.rel === 'canonical').map((l) => l.href),
    icons: links
      .filter((l) => (l.rel ?? '').split(/\s+/).some((t) => /^(?:icon|apple-touch-icon(?:-precomposed)?)$/i.test(t)))
      .map((l) => `${l.rel} ${l.type ?? '-'} ${l.sizes ?? '-'} ${l.href}`),
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
    formLinks,
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

// ─── The home's way on without its script (2026-11-18, audit A18) ─────────

/**
 * index.html's `#boot-links`, right after an empty #root, shown until the
 * app draws: per language its home and its lesson catalogue, named as the
 * pages name them (the language names of the pages' language links, the top
 * bar's "Lessons"), so a renamed label fails the build instead of leaving
 * the home behind.
 */
export function homeFallbackLinks(): { lang: SiteLang; href: string; text: string }[] {
  return SITE_LANGS.flatMap((lang) => [
    { lang, href: `/${lang}/`, text: LANGUAGE_NAMES[lang] },
    { lang, href: `/${lang}/${PATH_WORDS[lang].lessons}/`, text: appText(lang, 'tracks.lessonsLabel') },
  ]);
}

/**
 * When the home's way on shows with scripts on (2026-11-19, review of A18;
 * measured on the build, served compressed, 390 px): `HOME_FALLBACK_DELAY`
 * after the page's FIRST FRAME — a CSS animation's clock starts when the
 * browser first draws, which waits for the app's stylesheet, not when the
 * address is opened — then a fade of `HOME_FALLBACK_FADE`, slow at first
 * (CSS's own slow-start curve, written as its cubic-bezier: Tailwind's
 * class-name scanner reads every file, and the curve's keyword made it add
 * an unused utility to the app's stylesheet; the fade is instant under
 * reduced motion: src/index.css shortens every animation). The app
 * drew 1.3 s after the first frame at 1.6 Mb/s with the CPU 4× or 6× slower,
 * 2.2 s at 1.0 Mb/s, 4.3 s at 500 kb/s (slow 3G), 8.4 s at 250 kb/s: so a
 * start on the first two never shows it, and slow 3G shows the line for
 * about 1.2 s before the app. The values as index.html writes them.
 */
export const HOME_FALLBACK_DELAY = '2.5s';
export const HOME_FALLBACK_FADE = '.6s';
/** The style that keeps the way on hidden until the delay, then fades it in. */
export const HOME_FALLBACK_ANIMATION = `animation:boot-links ${HOME_FALLBACK_FADE} cubic-bezier(.42,0,1,1) ${HOME_FALLBACK_DELAY} both`;
export const HOME_FALLBACK_KEYFRAMES = '@keyframes boot-links{from{visibility:hidden;opacity:0}}';
/** With scripts off: the links at once, without the "taking a while" lines (nothing is loading). */
export const HOME_FALLBACK_NOSCRIPT = '<noscript><style>#boot-links{animation:none}#boot-links p{display:none}</style></noscript>';

/**
 * What is wrong with the home's way on: #root empty and the links its next
 * element (index.html's entry script may follow them; the build moves it to
 * the head); hidden once #root has content; shown at once with scripts off,
 * without the lines; with scripts on after the delay and fade above; the
 * name, the links, their words and languages; each language's line (its
 * words `bootSlow`, src/site/strings.ts) first in its item; upright regular
 * text only; no script among them.
 */
export function homeFallbackProblems(home: string): string[] {
  const problems: string[] = [];
  const root = home.match(/<div id="root">([\s\S]*?)<\/div>/);
  if (!root) return ['no <div id="root">'];
  if (root[1] !== '') problems.push('#root is not empty in the initial HTML: the app\'s tests and the rule that hides the links read an empty #root');
  const box = home.slice((root.index ?? 0) + root[0].length).match(/^\s*<div id="boot-links"( data-nosnippet)?>([\s\S]*?)<\/div>\s*(?:<script\b[^>]*>\s*<\/script>\s*)*<\/body>/);
  if (!box) return [...problems, 'no <div id="boot-links"> right after #root, the last thing in the body: no way on when the app does not start (audit A18)'];
  const links = box[2];
  // The block is in the home page's raw text, lines included: without `data-nosnippet` (which Google reads on a
  // div, span or section: developers.google.com/search/docs/crawling-indexing/robots-meta-tag, read 19 November
  // 2026) "Fermatina is taking a while to start" could be shown as the site's snippet in search results.
  if (!box[1]) problems.push('#boot-links is not marked data-nosnippet: its "taking a while to start" lines could become the home page\'s snippet in search results');
  if (/<script\b/i.test(links)) problems.push('#boot-links holds a script');
  if (!/#root:not\(:empty\)\+#boot-links\{display:none\}/.test(home)) problems.push('no style hiding #boot-links once the app has put anything into #root');
  const name = appText('en', 'nav.musicTheory');
  if (textOf(links.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '') !== name) problems.push(`#boot-links is not headed by the name "${name}"`);
  const found = [...links.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => ({ href: attrs(m[1]).href ?? '', text: textOf(m[2]) }));
  const want = homeFallbackLinks();
  const show = (xs: { href: string; text: string }[]) => xs.map((x) => `${x.href} "${x.text}"`).join(', ');
  if (show(found) !== show(want)) problems.push(`#boot-links links ${show(found) || 'nothing'}: expected ${show(want)}`);
  for (const lang of SITE_LANGS) {
    const own = want.filter((l) => l.lang === lang);
    const item = links.match(new RegExp(`<li lang="${htmlLangFor(lang)}">([\\s\\S]*?)</li>`))?.[1] ?? '';
    if (!own.every((l) => item.includes(`href="${l.href}"`))) problems.push(`#boot-links: ${own.map((l) => l.href).join(' and ')} are not in one <li lang="${htmlLangFor(lang)}">`);
    // Its line first, word for word, then its links.
    const line = item.match(/^<p>([^<]*)<\/p><a\b/)?.[1];
    if (line === undefined || decode(line) !== newText(lang, 'bootSlow')) problems.push(`#boot-links <li lang="${htmlLangFor(lang)}"> does not open on its line "${newText(lang, 'bootSlow')}"`);
  }
  if ((links.match(/<p\b/g) ?? []).length !== SITE_LANGS.length) problems.push(`#boot-links holds ${(links.match(/<p\b/g) ?? []).length} <p>: one line per language`);
  if (!home.includes(HOME_FALLBACK_NOSCRIPT)) problems.push(`no <noscript> style showing #boot-links at once, without its lines, when scripts are off: ${HOME_FALLBACK_NOSCRIPT}`);
  const style = home.match(/<style>(#boot-links\{[\s\S]*?)<\/style>/)?.[1] ?? '';
  const rule = style.match(/^#boot-links\{([^}]*)\}/)?.[1] ?? '';
  if (!rule.split(';').includes(HOME_FALLBACK_ANIMATION) || (rule.match(/animation/g) ?? []).length !== 1) problems.push(`#boot-links does not wait ${HOME_FALLBACK_DELAY} and fade in over ${HOME_FALLBACK_FADE}: expected "${HOME_FALLBACK_ANIMATION}" in "#boot-links{${rule}}"`);
  if (!style.includes(HOME_FALLBACK_KEYFRAMES)) problems.push(`no ${HOME_FALLBACK_KEYFRAMES}`);
  // Upright regular text only: a face index.html does not preload (the italic, a bold) would be fetched beside the app's script.
  if (/italic|oblique/.test(style) || /<(?:em|i|b|strong|cite|dfn)\b/.test(links) || [...style.matchAll(/font-weight:\s*([^;}]*)/g)].some((m) => m[1].trim() !== '400') || !/#boot-links h1\{[^}]*font-style:normal;font-weight:400/.test(style)) {
    problems.push('#boot-links is not upright regular text throughout (an italic or bold face would be fetched early, delaying the app)');
  }
  return problems;
}

// ─── The not-found page (2026-11-18, audits A21 / Q12) ─────────────────────

export interface NotFoundFiles {
  /** dist/404.html, or null when the build has none. */
  html: string | null;
  /** Every file of the build, as '/en/index.html', '/pages.css', '/icon.svg' … */
  files: ReadonlySet<string>;
  sitemap: string;
}

/**
 * /404.html, the page the host answers any unknown address with (status 404,
 * src/site/notFound.ts): there; noindex and the page of no address (no
 * canonical, no alternates, no Open Graph); no script, no inline style or
 * handler; the pages' icons; every address it uses absolute (it answers at
 * any depth) and in the build; the name; per language its heading, its
 * sentence and exactly its home and lesson catalogue, in the pages' words;
 * the brand to the app's home; not in the sitemap. `[]` = good.
 */
export function checkNotFoundPage(site: NotFoundFiles): string[] {
  const html = site.html;
  if (html === null) return ['/404.html: not in the build — the host would answer unknown addresses with its own bare page (audit A21)'];
  const problems: string[] = [];
  const where = (msg: string) => problems.push(`/404.html: ${msg}`);
  const p = parse(html);
  if (!html.startsWith('<!doctype html>\n')) where('does not start with <!doctype html>');
  if (p.lang !== htmlLangFor('en')) where(`<html lang="${p.lang}">, expected ${htmlLangFor('en')}`);
  const robots = tagsOf(html, 'meta').filter((m) => m.name === 'robots').map((m) => m.content);
  if (robots.join() !== 'noindex') where(`robots ${JSON.stringify(robots)}: expected exactly one "noindex"`);
  if (!p.title) where('needs exactly one non-empty <title>');
  if (p.canonical.length || p.alternateCount || p.ogUrl || p.images.length) where('claims an address (canonical, alternates or Open Graph): it is the page of none');
  if (p.scripts) where(`${p.scripts} <script> element(s): it has none`);
  if (/\sstyle="|<style\b|\son[a-z]+="/i.test(html)) where('inline style or event handler');
  const stray = html.match(STRAY_LT);
  if (stray) where(`an unexpected tag at …${html.slice(Math.max(0, (stray.index ?? 0) - 30), (stray.index ?? 0) + 30)}…`);
  if (BAD_AMP.test(html)) where('unescaped "&"');
  if (p.icons.join('\n') !== PAGE_ICONS.join('\n')) where(`icons ${JSON.stringify(p.icons)}: expected ${JSON.stringify(PAGE_ICONS)}`);
  for (const url of p.loads) {
    if (!url.startsWith('/') || url.startsWith('//')) where(`loads ${url}: not an absolute path of this site (the page answers at any depth)`);
    else if (!site.files.has(url.split(/[?#]/)[0])) where(`loads ${url}, which is not in the build`);
  }
  const name = appText('en', 'nav.musicTheory');
  if (p.h1 !== name) where(`h1 "${p.h1}", expected the name "${name}"`);
  const text = textOf(html);
  for (const marker of ['{{', '}}', 'undefined', '[object Object]', 'NaN']) if (text.includes(marker)) where(`text contains "${marker}"`);
  // The links: the brand to the app's home, and per language its two pages, absolute, each a page of the build.
  const want = ['/', ...SITE_LANGS.flatMap((l) => [`/${l}/`, `/${l}/${PATH_WORDS[l].lessons}/`])];
  if ([...p.hrefs].sort().join(' ') !== [...want].sort().join(' ')) where(`links ${JSON.stringify(p.hrefs)}: expected ${JSON.stringify(want)}`);
  for (const href of want) if (!site.files.has(`${href}index.html`)) where(`links to ${href}, which is not in the build`);
  for (const lang of SITE_LANGS) {
    const section = html.match(new RegExp(`<section lang="${htmlLangFor(lang)}"[^>]*>([\\s\\S]*?)</section>`))?.[1];
    if (section === undefined) {
      where(`no <section lang="${htmlLangFor(lang)}">`);
      continue;
    }
    const h2 = textOf(section.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? '');
    if (h2 !== newText(lang, 'notFoundTitle')) where(`${lang}: heading "${h2}", expected "${newText(lang, 'notFoundTitle')}"`);
    const line = textOf(section.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '');
    if (line !== newText(lang, 'notFoundLine')) where(`${lang}: sentence "${line}", expected "${newText(lang, 'notFoundLine')}"`);
    const links = [...section.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => `${attrs(m[1]).href} ${textOf(m[2].match(/<span class="lt">([\s\S]*?)<\/span>/)?.[1] ?? m[2])}`);
    const own = [`/${lang}/ ${LANGUAGE_NAMES[lang]}`, `/${lang}/${PATH_WORDS[lang].lessons}/ ${newText(lang, 'allLessons', { count: siteLessons(lang).length })}`];
    if (links.join(' | ') !== own.join(' | ')) where(`${lang}: links ${JSON.stringify(links)}, expected ${JSON.stringify(own)}`);
  }
  if (/404/.test(site.sitemap)) where('is in the sitemap');
  return problems;
}

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
    else if (p.description.length > MAX_DESCRIPTION) where(`description is ${p.description.length} characters, above ${MAX_DESCRIPTION}`);
    else if (!SENTENCE_END.test(p.description)) where(`description ends mid-sentence: …${p.description.slice(-40)}`);
    else if (descriptions.has(descriptionKey)) where(`description is also ${descriptions.get(descriptionKey)}'s`);
    else descriptions.set(descriptionKey, path);
    if (p.canonical.length !== 1 || p.canonical[0] !== canonical) where(`canonical ${JSON.stringify(p.canonical)}, expected ${canonical}`);
    if (p.ogUrl !== canonical) where(`og:url ${p.ogUrl}, expected ${canonical}`);
    if (p.alternateCount !== 4 || !['en', 'pt', 'es', 'x-default'].every((l) => p.alternates.has(l))) where(`alternates ${show(p.alternates)}: needs en, pt, es and x-default, once each`);
    if (p.alternates.get(kind.lang) !== canonical) where(`its own ${kind.lang} alternate is ${p.alternates.get(kind.lang)}, not its canonical`);
    if (p.images.length !== 2 || p.images.some((u) => u !== `${ORIGIN}${OG_IMAGE}`)) where(`og:image / twitter:image ${JSON.stringify(p.images)}`);
    if (p.icons.join('\n') !== PAGE_ICONS.join('\n')) where(`icons ${JSON.stringify(p.icons)}: expected ${JSON.stringify(PAGE_ICONS)} (the PNG first: Google's search results do not list SVG)`);
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

    // The foot's feedback link: exactly one, to the form of the page's own
    // language, its details box naming this page, the menu's own label, in a
    // new tab with no opener and no referrer.
    const form = REPORT_FORMS[kind.lang];
    const details = `page · ${path} · ${kind.lang}`;
    const label = appText(kind.lang, 'report.menuItem');
    if (p.formLinks.length !== 1) where(`${p.formLinks.length} feedback-form link(s): exactly one, in the foot`);
    for (const l of p.formLinks) {
      const url = new URL(l.href);
      if (`${url.origin}${url.pathname}` !== form.url) where(`feedback link to ${url.origin}${url.pathname}: not the ${kind.lang} form`);
      const keys = [...url.searchParams.keys()].join(',');
      if (keys !== `usp,entry.${form.detailsEntry}` || url.searchParams.get('usp') !== 'pp_url' || url.hash) where(`feedback link's query "${url.search}${url.hash}": expected usp=pp_url&entry.${form.detailsEntry}=… and nothing else`);
      else if (url.searchParams.get(`entry.${form.detailsEntry}`) !== details) where(`feedback link's details "${url.searchParams.get(`entry.${form.detailsEntry}`)}", expected "${details}"`);
      if (l.target !== '_blank' || l.rel !== 'noopener noreferrer') where(`feedback link has target="${l.target}" rel="${l.rel}": expected target="_blank" rel="noopener noreferrer"`);
      if (l.text !== label) where(`feedback link reads "${l.text}", not the menu's "${label}"`);
      if (!l.inFoot) where('feedback link is not in the <footer>');
    }

    // The foot's way to the app (2026-11-19): its sentence tells the reader
    // to open Fermatina, so those words are an ordinary link to the app's
    // home in the page's language, on every page.
    const foot = html.slice(Math.max(0, html.search(/<footer\b/)), Math.max(0, html.indexOf('</footer>')));
    const openWords = newText(kind.lang, 'footerOpen');
    const openLinks = [...foot.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].filter((m) => textOf(m[2]) === openWords).map((m) => attrs(m[1]));
    if (openLinks.length !== 1 || Object.keys(openLinks[0]).join() !== 'href' || openLinks[0].href !== appUrl(kind.lang)) {
      where(`the foot says "${openWords}" without one ordinary link to ${appUrl(kind.lang)} (${JSON.stringify(openLinks)})`);
    }

    // A lesson's tasks (2026-11-19): a task that says to tap ‘C major scale’
    // can be tapped on the page too — every quoted phrase is an ordinary link
    // to the address of the page's own "Open this lesson in Fermatina".
    // Read structurally: in the task list, every ‘…’ is the whole text of an
    // <a class="query" href> and nothing else; no other mark of a phrase is left.
    if (kind.kind === 'lesson') {
      const ownRaw = html.match(/<p class="open"><a class="button" href="([^"]*)"/)?.[1];
      const own = ownRaw === undefined ? null : decode(ownRaw);
      if (own === null) where('no "open this lesson" button');
      const tasks = html.match(/<ul class="tasks">([\s\S]*?)<\/ul>/)?.[1] ?? '';
      const PHRASE = /<a class="query" href="([^"]*)">‘[^‘’<]*’<\/a>/g;
      for (const m of tasks.matchAll(PHRASE)) if (decode(m[1]) !== own) where(`a task's quoted phrase links to ${decode(m[1])}, not to this lesson in the app (${own})`);
      const left = tasks.replace(PHRASE, '').match(/<[^>]*\bclass="query"[^>]*>[^<]*|‘[^’<]*’?/);
      if (left) where(`a task's quoted phrase is not an ordinary link to this lesson in the app: ${left[0]}`);
      if ((html.match(/class="query"/g) ?? []).length !== (tasks.match(/class="query"/g) ?? []).length) where('a quoted phrase\'s mark outside the task list');
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
      // The foot's feedback form: the one link allowed off the site (checked above, page by page).
      if (isFeedbackFormHref(href)) continue;
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

  // The home (index.html) names the landing pages back, and declares the same icons.
  const home = parse(site.home);
  const landingAlts = parsed.get('/en/')?.alternates;
  if (!landingAlts || !sameMap(home.alternates, landingAlts)) problems.push(`index.html: alternates (${show(home.alternates)}) are not the landing pages' (${landingAlts ? show(landingAlts) : 'none'})`);
  if (home.canonical.length !== 1 || home.canonical[0] !== `${ORIGIN}/`) problems.push(`index.html: canonical ${JSON.stringify(home.canonical)}`);
  if (home.icons.join('\n') !== PAGE_ICONS.join('\n')) problems.push(`index.html: icons ${JSON.stringify(home.icons)}: expected ${JSON.stringify(PAGE_ICONS)} (the PNG first: Google's search results do not list SVG)`);
  for (const p of homeFallbackProblems(site.home)) problems.push(`index.html: ${p}`);
  for (const { href } of homeFallbackLinks()) if (!parsed.has(href)) problems.push(`index.html: its way on links to ${href}, which is no generated page`);

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
