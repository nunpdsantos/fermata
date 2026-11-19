/**
 * The public entrance pages' doors (`/en/` `/pt/` `/es/`), as the owner ruled
 * on 19 November 2026: "I'm new to music" and "I play, but never learned
 * theory" link to the first lesson PAGE of their track ("Start with sound",
 * "From the chords you know") — pages a search visitor reads without the
 * app, as before the audit; "I know some theory" opens the app with its door
 * chosen (`?start=theory&lang=<page language>`, state/startLink.ts — audit
 * A19: its plain entrance made the app ask "Where are you starting from?"
 * again).
 *
 * The build's checker allows exactly that one door link, on a landing page,
 * in its language, and requires it there: a planted `?start=new` or
 * `?start=player` (valid in the app, no longer offered by the pages), an
 * unknown door, a door beside another parameter, a door in another language,
 * a door on another page, or the theory door gone back to the plain entrance
 * all fail it.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import registry from '../../../scripts/pages/slugs.json';
import indexHtml from '../../../index.html?raw';
import { buildSite, STYLESHEET, appDoorUrl, appUrl, sitePath, START_DOOR_IDS, ORIGIN, type Site } from '../render';
import { checkSite, type SiteFiles } from '../check';
import { appText, siteLevel } from '../content';
import { START_DOORS } from '../../state/startDoors';
import { readStartDoor } from '../../state/startLink';
import { TRACKS } from '../../data/tracks';
import type { SlugRegistry } from '../slugs';

const SLUGS = registry as SlugRegistry;
let site: Site;
const publicFiles = Object.keys(import.meta.glob('../../../public/**/*', { query: '?url', import: 'default', eager: true })).map((f) => f.replace('../../../public', ''));
beforeAll(() => {
  site = buildSite(SLUGS);
});

/** As the page writes an address in an attribute. */
const amp = (s: string) => s.replace(/&/g, '&amp;');
const doc = (path: string) => new DOMParser().parseFromString(site.pages.find((p) => p.path === path)!.html, 'text/html');

describe('the public pages\' doors (the owner\'s ruling, 19 November 2026)', () => {
  it('the site and the app name the same three doors', () => {
    expect([...START_DOOR_IDS]).toEqual([...START_DOORS]);
  });

  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: "new" and "I play" link to their track's first lesson page, in the page's language; "I know some theory" opens the app with its door`, () => {
      const d = doc(`/${lang}/`);
      const links = [...d.querySelectorAll('section[aria-labelledby="doors"] a')];
      // The start screen's words, in its order.
      expect(links.map((a) => a.querySelector('.lt')?.textContent)).toEqual(START_DOOR_IDS.map((door) => appText(lang, `start.door.${door}.title`)));
      const sound = TRACKS.sound.moduleIds[0];
      const chords = TRACKS.chords.moduleIds[0];
      expect(links.map((a) => a.getAttribute('href'))).toEqual([
        sitePath.lesson(lang, SLUGS[sound][lang]),
        sitePath.lesson(lang, SLUGS[chords][lang]),
        `${ORIGIN}/?start=theory&lang=${lang}`,
      ]);
      // The two reading links are those lessons' own pages: their titles, in this language.
      const titleOf = (id: string) => siteLevel('l1', lang).units.flatMap((u) => u.modules).find((m) => m.id === id)!.title;
      expect(doc(links[0].getAttribute('href')!).querySelector('h1')?.textContent).toBe(titleOf(sound));
      expect(doc(links[1].getAttribute('href')!).querySelector('h1')?.textContent).toBe(titleOf(chords));
      // The app reads the theory door back as its door.
      expect(readStartDoor(new URL(links[2].getAttribute('href')!).search)).toBe('theory');
      // "Open Fermatina" stays the plain entrance (the start screen asks).
      expect(d.querySelector('a.button')?.getAttribute('href')).toBe(appUrl(lang));
    });
  }

  it('no other page links into the app with a door, and no page offers "new" or "player" as a door', () => {
    for (const p of site.pages) {
      const doors = [...p.html.matchAll(/\?start=([a-z]+)/g)].map((m) => m[1]);
      expect(doors, p.path).toEqual(/^\/(en|pt|es)\/$/.test(p.path) ? ['theory'] : []);
    }
  });

  it('the build\'s checker passes the real output, requires the theory door, and refuses every other door link', () => {
    const files = (edit: (pages: Map<string, string>) => void = () => {}): SiteFiles => {
      const pages = new Map(site.pages.map((p) => [p.path, p.html]));
      edit(pages);
      return { pages, sitemap: site.sitemap, home: indexHtml, files: new Set(['/', STYLESHEET, ...publicFiles]) };
    };
    const problems = (f: SiteFiles) => checkSite(f, { lessons: 136, slugs: SLUGS }).problems;
    expect(problems(files())).toEqual([]);
    const planted = (path: string, from: string, to: string) => problems(files((pages) => {
      const html = pages.get(path)!;
      expect(html.includes(from), `${from} on ${path}`).toBe(true);
      pages.set(path, html.replace(from, to));
    }));
    const theoryDoor = amp(appDoorUrl('pt', 'theory'));
    const newDoor = sitePath.lesson('pt', SLUGS[TRACKS.sound.moduleIds[0]].pt);
    const playerDoor = sitePath.lesson('pt', SLUGS[TRACKS.chords.moduleIds[0]].pt);
    // The two doors the pages no longer offer.
    expect(planted('/pt/', `href="${newDoor}"`, `href="${amp(appDoorUrl('pt', 'new'))}"`)).toContain(`/pt/: app link ${ORIGIN}/?start=new&lang=pt`);
    expect(planted('/pt/', `href="${playerDoor}"`, `href="${amp(appDoorUrl('pt', 'player'))}"`)).toContain(`/pt/: app link ${ORIGIN}/?start=player&lang=pt`);
    // An unknown door, a door beside another parameter, a door in another language.
    expect(planted('/pt/', theoryDoor, `${ORIGIN}/?start=expert&amp;lang=pt`)).toContain(`/pt/: app link ${ORIGIN}/?start=expert&lang=pt`);
    expect(planted('/pt/', theoryDoor, `${ORIGIN}/?start=theory&amp;view=drill&amp;lang=pt`)).toContain(`/pt/: app link ${ORIGIN}/?start=theory&view=drill&lang=pt`);
    expect(planted('/pt/', theoryDoor, amp(appDoorUrl('en', 'theory')))).toContain(`/pt/: app link ${ORIGIN}/?start=theory&lang=en`);
    // The theory door gone back to the plain entrance (A19 again).
    expect(planted('/pt/', theoryDoor, amp(appUrl('pt')))).toContain(`/pt/: no "I know some theory" door with its door chosen (${ORIGIN}/?start=theory&lang=pt): the app would ask again`);
    // A door on a page that is not an entrance.
    expect(planted('/pt/licoes/', `href="${amp(appUrl('pt'))}"`, `href="${theoryDoor}"`)).toContain(`/pt/licoes/: app link ${ORIGIN}/?start=theory&lang=pt`);
  }, 60_000); // the whole-output checker, eight times over the 417 pages
});
