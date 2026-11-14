/**
 * The search pages (2026-11-14): plain HTML a search engine and a person can
 * read without JavaScript — per language a landing page, the lesson index,
 * one page per lesson and the glossary — and the sitemap. Built at build
 * time from the app's own data (content.ts) by scripts/pages/build.ts; pure,
 * no DOM, no file system.
 *
 * Addresses (every one a directory with an index.html, always written with
 * the trailing slash):
 *   /en/ /en/lessons/ /en/lessons/<slug>/ /en/words/
 *   /pt/ /pt/licoes/  /pt/licoes/<slug>/  /pt/palavras/
 *   /es/ /es/lecciones/ /es/lecciones/<slug>/ /es/palabras/
 * Canonicals and alternates always name https://fermatina.com (the pages are
 * served on the old address too: same deployment).
 */
import type { CurriculumModule } from '../core/types/curriculum';
import { htmlLangFor } from '../i18n/language';
import { BAR_CHOICES, MAX_TEMPO, MIN_TEMPO } from '../state/metronomeSave';
import { TRACKS, type TrackId } from '../data/tracks';
import {
  SITE_LANGS, appText, lessonNeighbours, siteGlossary, siteLessons, siteLevels, siteSongs,
  type SiteLang, type SiteLesson,
} from './content';
import { esc, instructionHtml, jsonLdHtml, proseHtml } from './html';
import { LANGUAGE_NAMES, newText } from './strings';
import { registryProblems, type SlugRegistry } from './slugs';

export const ORIGIN = 'https://fermatina.com';
export const STYLESHEET = '/pages.css';
export const OG_IMAGE = '/og.png';
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** The path words, in each language. */
export const PATH_WORDS: Record<SiteLang, { lessons: string; words: string }> = {
  en: { lessons: 'lessons', words: 'words' },
  pt: { lessons: 'licoes', words: 'palavras' },
  es: { lessons: 'lecciones', words: 'palabras' },
};

export const sitePath = {
  landing: (lang: SiteLang) => `/${lang}/`,
  index: (lang: SiteLang) => `/${lang}/${PATH_WORDS[lang].lessons}/`,
  lesson: (lang: SiteLang, slug: string) => `/${lang}/${PATH_WORDS[lang].lessons}/${slug}/`,
  glossary: (lang: SiteLang) => `/${lang}/${PATH_WORDS[lang].words}/`,
};

/** The app, opened on a lesson or on its home, in this language (`?lesson=…&lang=…`, state/shareParams.ts). */
export function appUrl(lang: SiteLang, lessonId?: string): string {
  return `${ORIGIN}/?${lessonId ? `lesson=${encodeURIComponent(lessonId)}&` : ''}lang=${lang}`;
}

const OG_LOCALE: Record<SiteLang, string> = { en: 'en_GB', pt: 'pt_PT', es: 'es_ES' };
/** Lists in the page's language ("2, 3, 4 or 6": British English, no serial comma). */
const LIST_LOCALE: Record<SiteLang, string> = { en: 'en-GB', pt: 'pt-PT', es: 'es-ES' };

export type PageKind = 'landing' | 'index' | 'lesson' | 'glossary';
export type Alternates = Record<SiteLang | 'x-default', string>;

export interface SitePage {
  path: string;
  lang: SiteLang;
  kind: PageKind;
  /** The same page in every language shares it ('landing', 'index', 'glossary' or the lesson's id). */
  key: string;
  title: string;
  description: string;
  /** Absolute addresses of its language twins and x-default. */
  alternates: Alternates;
  html: string;
}

export interface Site {
  pages: SitePage[];
  sitemap: string;
}

// ─── Small pieces ──────────────────────────────────────────────────────────

const MARK = '<svg class="mark" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 14 A 8 8 0 0 1 20 14"/><circle cx="12" cy="16" r="1.8" fill="currentColor"/></svg>';

const unitAnchor = (unitId: string) => `unit-${unitId}`;
const levelAnchor = (n: number) => `level-${n}`;
/** A glossary entry's anchor: its term id in kebab case (relativeKey → relative-key, scale_major → scale-major). */
export const termAnchor = (id: string) => id.replace(/_/g, '-').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** A meta description's limit: whole sentences only, never cut. */
export const MAX_DESCRIPTION = 160;
/** Ends a sentence: . ! or ?, perhaps inside a closing quote or bracket. */
export const SENTENCE_END = /[.!?]["”»’)]?$/;

const sentence = (s: string) => (SENTENCE_END.test(s.trim()) ? s.trim() : `${s.trim()}.`);

/**
 * The sentences of a text: split after . ! or ? and a space, where the next
 * word opens a sentence (a capital, a digit, ¿ ¡ or an opening quote) — never
 * after an abbreviation or an initial ("polirritmia vs. polimetria", "J.S. Bach").
 */
const ABBREVIATION = /(?:^|[\s(])(?:vs|e\.g|i\.e|etc|cf|approx|Op|No|Nr|Nº|St|[A-Z])\.$/;
function sentencesOf(text: string): string[] {
  const out: string[] = [];
  let start = 0;
  for (const m of text.matchAll(/[.!?]["”»’)]?\s+(?=[\p{Lu}\d¿¡«“"(])/gu)) {
    const end = (m.index ?? 0) + m[0].trimEnd().length;
    if (ABBREVIATION.test(text.slice(start, end))) continue;
    out.push(text.slice(start, end).trim());
    start = (m.index ?? 0) + m[0].length;
  }
  out.push(text.slice(start).trim());
  return out.filter(Boolean);
}

/**
 * A description of WHOLE sentences: as many as fit in MAX_DESCRIPTION
 * characters, in order. If not even the first fits, the build fails (a
 * description is never cut mid-sentence; checkSite checks it on every page).
 */
export function wholeSentences(sentences: readonly string[], max = MAX_DESCRIPTION): string {
  const all = sentences.flatMap(sentencesOf).map(sentence);
  let out = '';
  for (const s of all) {
    const next = out ? `${out} ${s}` : s;
    if (next.length > max) break;
    out = next;
  }
  if (!out) throw new Error(`site: no whole sentence of "${all[0] ?? ''}" fits in ${max} characters`);
  return out;
}

/** A lesson's description: its subtitle, then its objectives, as whole sentences within the limit (its own words). */
export function lessonDescription(module: CurriculumModule): string {
  return wholeSentences([module.subtitle, ...module.objectives].filter((s) => s.trim()).map(sentence));
}

/** A line of the landing page's list: the name in bold, no colon, then the sentence (a sentence that opens on that same name and a colon loses them). */
function labelled(name: string, text: string): string {
  const own = `${name}: `;
  let rest = text;
  if (text.startsWith(own)) {
    rest = text.slice(own.length);
    rest = rest.charAt(0).toLocaleUpperCase() + rest.slice(1);
  } else if (/^[^:]{1,20}: /.test(text)) {
    throw new Error(`site: "${text}" opens on a label that is not "${name}"`);
  }
  return `<li><strong>${esc(name)}</strong> ${esc(rest)}</li>`;
}

interface HeadInput {
  lang: SiteLang;
  title: string;
  description: string;
  path: string;
  alternates: Alternates;
  ogType: 'website' | 'article';
  jsonLd: unknown;
}

function head(h: HeadInput): string {
  const canonical = `${ORIGIN}${h.path}`;
  const alt = (['en', 'pt', 'es', 'x-default'] as const)
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${esc(h.alternates[l])}">`)
    .join('\n');
  const otherLocales = SITE_LANGS.filter((l) => l !== h.lang)
    .map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}">`)
    .join('\n');
  const image = `${ORIGIN}${OG_IMAGE}`;
  const imageAlt = `${appText('en', 'nav.musicTheory')} — ${appText('en', 'start.tagline')}`;
  return [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}">`,
    `<link rel="canonical" href="${esc(canonical)}">`,
    alt,
    '<meta name="color-scheme" content="light dark">',
    '<meta name="theme-color" content="#f5efe2" media="(prefers-color-scheme: light)">',
    '<meta name="theme-color" content="#181208" media="(prefers-color-scheme: dark)">',
    '<link rel="icon" type="image/svg+xml" href="/icon.svg">',
    '<link rel="apple-touch-icon" href="/icon-192.png">',
    '<link rel="preload" href="/fonts/source-serif-4-latin.woff2" as="font" type="font/woff2" crossorigin>',
    `<link rel="stylesheet" href="${STYLESHEET}">`,
    `<meta property="og:type" content="${h.ogType}">`,
    '<meta property="og:site_name" content="Fermatina">',
    `<meta property="og:title" content="${esc(h.title)}">`,
    `<meta property="og:description" content="${esc(h.description)}">`,
    `<meta property="og:url" content="${esc(canonical)}">`,
    `<meta property="og:locale" content="${OG_LOCALE[h.lang]}">`,
    otherLocales,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:width" content="${OG_IMAGE_SIZE.width}">`,
    `<meta property="og:image:height" content="${OG_IMAGE_SIZE.height}">`,
    `<meta property="og:image:alt" content="${esc(imageAlt)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(h.title)}">`,
    `<meta name="twitter:description" content="${esc(h.description)}">`,
    `<meta name="twitter:image" content="${image}">`,
    jsonLdHtml(h.jsonLd),
  ].join('\n');
}

/** The page: head, the top bar (the mark and the name → the landing page; Lessons, Words), main, foot. */
function page(h: HeadInput, opts: { current: 'index' | 'glossary' | null; twins: string; main: string }): string {
  const { lang } = h;
  const nav = (href: string, label: string, here: boolean) => `<a href="${href}"${here ? ' aria-current="page"' : ''}>${esc(label)}</a>`;
  return `<!doctype html>
<html lang="${htmlLangFor(lang)}">
<head>
${head(h)}
</head>
<body>
<a class="skip" href="#main">${esc(appText(lang, 'nav.skipToContent'))}</a>
<header class="top">
<div class="wrap">
<a class="brand" href="${sitePath.landing(lang)}">${MARK}<span>${esc(appText(lang, 'nav.musicTheory'))}</span></a>
<nav class="top-nav" aria-label="${esc(appText(lang, 'nav.musicTheory'))}">
${nav(sitePath.index(lang), appText(lang, 'tracks.lessonsLabel'), opts.current === 'index')}
${nav(sitePath.glossary(lang), appText(lang, 'glossary.ui.words'), opts.current === 'glossary')}
</nav>
</div>
</header>
<main id="main" class="wrap">
${opts.twins}
${opts.main}
</main>
<footer class="foot">
<div class="wrap">
<p>${esc(appText(lang, 'start.footer'))}</p>
</div>
</footer>
</body>
</html>
`;
}

/** The two other languages of this page, as links (each in its own language). */
function twinsNav(lang: SiteLang, alternates: Alternates): string {
  const links = SITE_LANGS.filter((l) => l !== lang)
    .map((l) => `<a href="${esc(alternates[l].slice(ORIGIN.length))}" hreflang="${l}" lang="${htmlLangFor(l)}">${esc(LANGUAGE_NAMES[l])}</a>`)
    .join('\n');
  return `<nav class="langs" aria-label="${esc(appText(lang, 'nav.languageLabel'))}">\n${links}\n</nav>`;
}

const button = (href: string, label: string) => `<p class="open"><a class="button" href="${esc(href)}">${esc(label)}</a></p>`;

// ─── The four kinds of page ────────────────────────────────────────────────

interface Ctx {
  lang: SiteLang;
  slugs: SlugRegistry;
  lessons: SiteLesson[];
}

function lessonHref(ctx: Ctx, id: string): string {
  return sitePath.lesson(ctx.lang, ctx.slugs[id][ctx.lang]);
}

function lessonList(ctx: Ctx, modules: readonly CurriculumModule[]): string {
  const items = modules
    .map((m) => `<li><a href="${lessonHref(ctx, m.id)}"><span class="lt">${esc(m.title)}</span><span class="ls">${esc(m.subtitle)}</span></a></li>`)
    .join('\n');
  return `<ol class="lessons">\n${items}\n</ol>`;
}

function landingMain(ctx: Ctx): { main: string; title: string; description: string; jsonLd: unknown } {
  const { lang } = ctx;
  const t = (k: string, v?: Record<string, string | number>) => appText(lang, k, v);
  const firstOf = (track: TrackId) => lessonHref(ctx, TRACKS[track].moduleIds[0]);
  const door = (profile: 'new' | 'player' | 'theory', href: string) =>
    `<li><a href="${esc(href)}"><span class="lt">${esc(t(`start.door.${profile}.title`))}</span><span class="ls">${esc(t(`start.door.${profile}.line`))}</span></a></li>`;
  const bars = new Intl.ListFormat(LIST_LOCALE[lang], { type: 'disjunction' }).format(BAR_CHOICES.map(String));
  const count = ctx.lessons.length;
  const tagline = t('start.tagline');
  const main = `<h1 class="hero">${MARK.replace('width="22" height="22"', 'width="32" height="32"')}<span>${esc(t('nav.musicTheory'))}</span></h1>
<p class="lead">${esc(tagline)}</p>
${button(appUrl(lang), newText(lang, 'openApp'))}
<p>${esc(t('start.footer'))} ${esc(newText(lang, 'languages'))}</p>
<section aria-labelledby="doors">
<h2 id="doors">${esc(t('start.doorsHeading'))}</h2>
<ul class="lessons">
${door('new', firstOf('sound'))}
${door('player', firstOf('chords'))}
${door('theory', appUrl(lang))}
</ul>
</section>
<section aria-labelledby="inside">
<h2 id="inside">${esc(newText(lang, 'inside'))}</h2>
<ul class="inside">
${labelled(t('nav.explore'), t('start.door.theory.line'))}
${labelled(t('nav.learn'), t('showMe.intro.learn'))}
${labelled(t('nav.drill'), t('showMe.intro.drill'))}
${labelled(t('tunerEntry.menuItem'), t('tuner.why'))}
${labelled(t('metronomeToolEntry.menuItem'), newText(lang, 'metronome', { min: MIN_TEMPO, max: MAX_TEMPO, bars }))}
</ul>
</section>
<ul class="lessons more">
<li><a href="${sitePath.index(lang)}"><span class="lt">${esc(newText(lang, 'allLessons', { count }))}</span><span class="ls">${esc(t('learn.subtitle'))}</span></a></li>
<li><a href="${sitePath.glossary(lang)}"><span class="lt">${esc(newText(lang, 'wordsTitle'))}</span><span class="ls">${esc(newText(lang, 'wordsLead', { count: siteGlossary(lang).length }))}</span></a></li>
</ul>`;
  return {
    main,
    title: newText(lang, 'landingTitle'),
    description: wholeSentences([tagline, t('start.footer')]),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Fermatina',
      url: `${ORIGIN}/`,
      description: tagline,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      inLanguage: SITE_LANGS.map(htmlLangFor),
    },
  };
}

function indexMain(ctx: Ctx): { main: string; title: string; description: string; jsonLd: unknown } {
  const { lang } = ctx;
  const t = (k: string, v?: Record<string, string | number>) => appText(lang, k, v);
  const levels = siteLevels(lang);
  const unitBlock = (unit: { id: string; title: string; description: string; modules: CurriculumModule[] }, eyebrow?: string) =>
    `<section id="${unitAnchor(unit.id)}" class="unit">
<h3>${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}${esc(unit.title)}</h3>
<p class="muted small">${esc(unit.description)}</p>
${lessonList(ctx, unit.modules)}
</section>`;
  const tracks = levels.flatMap((l) => l.units.filter((u) => u.track));
  const toc = [
    `<li><a href="#start">${esc(t('tracks.startHere'))}</a></li>`,
    ...levels.map((l) => `<li><a href="#${levelAnchor(l.number)}">${esc(t('learn.level', { n: l.number }))}</a></li>`),
  ].join('\n');
  const levelBlocks = levels
    .map((level) => {
      const units = level.units.filter((u) => !u.track);
      const eyebrow = [t('learn.level', { n: level.number }), level.parallel ? t('learn.parallelTrack') : ''].filter(Boolean).join(' · ');
      return `<section id="${levelAnchor(level.number)}" class="level">
<h2><span class="eyebrow">${esc(eyebrow)}</span>${esc(level.title)}</h2>
<p class="muted">${esc(level.description)}</p>
${units.map((u) => unitBlock(u, u.optional ? t('learn.optionalUnit') : undefined)).join('\n')}
</section>`;
    })
    .join('\n');
  const main = `<h1>${esc(t('learn.title'))}</h1>
<p class="lead">${esc(t('learn.subtitle'))}</p>
${button(appUrl(lang), newText(lang, 'openApp'))}
<nav aria-label="${esc(t('learn.title'))}"><ul class="toc">
${toc}
</ul></nav>
<section id="start" class="level">
<h2>${esc(t('tracks.startHere'))}</h2>
${tracks.map((u) => unitBlock(u, t('tracks.eyebrow', { count: u.modules.length }))).join('\n')}
</section>
${levelBlocks}`;
  const description = wholeSentences([newText(lang, 'indexDescription', { count: ctx.lessons.length })]);
  return {
    main,
    title: `${t('learn.title')} · Fermatina`,
    description,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: t('learn.title'),
      description,
      url: `${ORIGIN}${sitePath.index(lang)}`,
      inLanguage: htmlLangFor(lang),
      isAccessibleForFree: true,
      provider: { '@type': 'Organization', name: 'Fermatina', url: `${ORIGIN}/` },
    },
  };
}

function lessonMain(ctx: Ctx, lesson: SiteLesson): { main: string; title: string; description: string; jsonLd: unknown } {
  const { lang } = ctx;
  const { module, unit, level, track } = lesson;
  const t = (k: string, v?: Record<string, string | number>) => appText(lang, k, v);
  const index = sitePath.index(lang);
  const open = appUrl(lang, module.id);
  const crumbs = [
    `<li><a href="${index}">${esc(t('tracks.lessonsLabel'))}</a></li>`,
    ...(track ? [] : [`<li><a href="${index}#${levelAnchor(level.number)}">${esc(`${t('learn.level', { n: level.number })} · ${level.title}`)}</a></li>`]),
    `<li><a href="${index}#${unitAnchor(unit.id)}">${esc(unit.title)}</a></li>`,
  ].join('\n');
  const concepts = module.concepts
    .map((c) => {
      const interactive = !!(c.tryThisQuery?.trim() || c.rhythm || c.clefs);
      return `<section class="concept">
<h2>${esc(c.title)}</h2>
<p class="prose">${proseHtml(c.explanation)}</p>${interactive ? `\n<p class="try">${esc(newText(lang, 'tryInApp'))} <a href="${esc(open)}">${esc(newText(lang, 'openLesson'))}</a></p>` : ''}
</section>`;
    })
    .join('\n');
  const songs = siteSongs(module.id, lang);
  const songBlock = songs.length
    ? `<section class="card">
<h2 class="label">${esc(t('songRef.title'))}</h2>
<ul class="songs">
${songs.map((s) => `<li><span class="song">${esc(s.song)}</span> <span class="artist">${esc(s.artist)}</span><p>${esc(s.context)}</p></li>`).join('\n')}
</ul>
</section>`
    : '';
  const tasks = module.tasks.length
    ? `<section>
<h2 class="label">${esc(newText(lang, 'onInstrument'))}</h2>
<ul class="tasks">
${module.tasks.map((task) => `<li>${instructionHtml(task.instruction)}</li>`).join('\n')}
</ul>
</section>`
    : '';
  const { prev, next } = lessonNeighbours(module.id, level);
  const pager = prev || next
    ? `<nav class="pager" aria-label="${esc(t('tracks.lessonsLabel'))}">
${prev ? `<a class="prev" rel="prev" href="${lessonHref(ctx, prev.id)}"><span class="pl">${esc(t('common.previous'))}</span><span class="pt">${esc(prev.title)}</span></a>` : ''}
${next ? `<a class="next" rel="next" href="${lessonHref(ctx, next.id)}"><span class="pl">${esc(t('lesson.nextLesson'))}</span><span class="pt">${esc(next.title)}</span></a>` : ''}
</nav>`
    : '';
  const main = `<nav class="crumbs" aria-label="${esc(t('learn.breadcrumb'))}"><ol>
${crumbs}
</ol></nav>
<h1>${esc(module.title)}</h1>
<p class="lead">${esc(module.subtitle)}</p>
${button(open, newText(lang, 'openLesson'))}
<section class="card">
<h2 class="label">${esc(t('lesson.intro'))}</h2>
<ul class="objectives">
${module.objectives.map((o) => `<li>${esc(o)}</li>`).join('\n')}
</ul>
</section>
${concepts}
${songBlock}
${tasks}
${button(open, newText(lang, 'openLesson'))}
${pager}`;
  const description = lessonDescription(module);
  return {
    main,
    title: `${module.title} · Fermatina`,
    description,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: module.title,
      description,
      url: `${ORIGIN}${lessonHref(ctx, module.id)}`,
      inLanguage: htmlLangFor(lang),
      isAccessibleForFree: true,
      learningResourceType: 'lesson',
      educationalLevel: track ? unit.title : `${t('learn.level', { n: level.number })} · ${level.title}`,
      teaches: module.objectives,
      isPartOf: {
        '@type': 'Course',
        name: t('learn.title'),
        url: `${ORIGIN}${index}`,
        inLanguage: htmlLangFor(lang),
      },
    },
  };
}

function glossaryMain(ctx: Ctx): { main: string; title: string; description: string; jsonLd: unknown } {
  const { lang } = ctx;
  const collator = new Intl.Collator(htmlLangFor(lang), { sensitivity: 'base' });
  const terms = [...siteGlossary(lang)].sort((a, b) => collator.compare(a.title, b.title));
  const byId = new Map(ctx.lessons.map((l) => [l.module.id, l.module]));
  const learnMore = appText(lang, 'glossary.ui.learn');
  const items = terms
    .map((term) => {
      const lesson = term.learn ? byId.get(term.learn) : undefined;
      const more = lesson ? `\n<p class="more"><a href="${lessonHref(ctx, lesson.id)}">${esc(`${learnMore} · ${lesson.title}`)}</a></p>` : '';
      return `<div class="term" id="${termAnchor(term.id)}">
<dt><dfn>${esc(term.title)}</dfn></dt>
<dd><p>${esc(term.plain)}</p>${more}</dd>
</div>`;
    })
    .join('\n');
  const title = newText(lang, 'wordsTitle');
  const lead = newText(lang, 'wordsLead', { count: terms.length });
  const url = `${ORIGIN}${sitePath.glossary(lang)}`;
  return {
    main: `<h1>${esc(title)}</h1>
<p class="lead">${esc(lead)}</p>
<dl class="terms">
${items}
</dl>`,
    title: `${title} · Fermatina`,
    description: wholeSentences([`${newText(lang, 'glossaryWord')}: ${lead}`]),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: title,
      description: lead,
      url,
      inLanguage: htmlLangFor(lang),
      hasDefinedTerm: terms.map((term) => ({ '@type': 'DefinedTerm', name: term.title, description: term.plain, url: `${url}#${termAnchor(term.id)}` })),
    },
  };
}

// ─── The whole site ────────────────────────────────────────────────────────

function alternatesFor(key: string, slugs: SlugRegistry): Alternates {
  const url = (lang: SiteLang) => {
    switch (key) {
      case 'landing': return `${ORIGIN}${sitePath.landing(lang)}`;
      case 'index': return `${ORIGIN}${sitePath.index(lang)}`;
      case 'glossary': return `${ORIGIN}${sitePath.glossary(lang)}`;
      default: return `${ORIGIN}${sitePath.lesson(lang, slugs[key][lang])}`;
    }
  };
  // The landing pages' x-default is the app's home, which opens in the
  // visitor's own language (index.html names the three landing pages back).
  return { en: url('en'), pt: url('pt'), es: url('es'), 'x-default': key === 'landing' ? `${ORIGIN}/` : url('en') };
}

/** The app's home (index.html): its own alternates, the same as the landing pages'. */
export const HOME_ALTERNATES: Alternates = alternatesFor('landing', {});

/** Every page in every language, and the sitemap. Throws on a slug registry that does not cover every lesson. */
export function buildSite(slugs: SlugRegistry): Site {
  const lessonsEn = siteLessons('en');
  const problems = registryProblems(slugs, lessonsEn.map((l) => l.module.id));
  if (problems.length) throw new Error(`site: the slug registry is not right:\n  ${problems.join('\n  ')}`);

  const pages: SitePage[] = [];
  for (const lang of SITE_LANGS) {
    const ctx: Ctx = { lang, slugs, lessons: lang === 'en' ? lessonsEn : siteLessons(lang) };
    const add = (kind: PageKind, key: string, path: string, built: { main: string; title: string; description: string; jsonLd: unknown }, current: 'index' | 'glossary' | null) => {
      const alternates = alternatesFor(key, slugs);
      const h: HeadInput = { lang, title: built.title, description: built.description, path, alternates, ogType: kind === 'lesson' ? 'article' : 'website', jsonLd: built.jsonLd };
      pages.push({ path, lang, kind, key, title: built.title, description: built.description, alternates, html: page(h, { current, twins: twinsNav(lang, alternates), main: built.main }) });
    };
    add('landing', 'landing', sitePath.landing(lang), landingMain(ctx), null);
    add('index', 'index', sitePath.index(lang), indexMain(ctx), 'index');
    for (const lesson of ctx.lessons) add('lesson', lesson.module.id, lessonHref(ctx, lesson.module.id), lessonMain(ctx, lesson), null);
    add('glossary', 'glossary', sitePath.glossary(lang), glossaryMain(ctx), 'glossary');
  }
  return { pages, sitemap: sitemapXml(pages) };
}

/** sitemap.xml: the app's home, then every page, each with its language twins and x-default. */
export function sitemapXml(pages: readonly Pick<SitePage, 'path' | 'alternates'>[]): string {
  const entry = (loc: string, alternates: Alternates) =>
    `  <url>\n    <loc>${esc(loc)}</loc>\n${(['en', 'pt', 'es', 'x-default'] as const)
      .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${esc(alternates[l])}"/>`)
      .join('\n')}\n  </url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[entry(`${ORIGIN}/`, HOME_ALTERNATES), ...pages.map((p) => entry(`${ORIGIN}${p.path}`, p.alternates))].join('\n')}
</urlset>
`;
}
