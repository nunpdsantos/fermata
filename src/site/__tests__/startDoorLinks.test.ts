/**
 * Audit 2026-11-18, A19: the public entrance pages (`/en/` `/pt/` `/es/`)
 * offer the start screen's three doors. Each now links into the app with its
 * door chosen (`?start=<door>&lang=<page language>`, state/startGate.ts), so
 * the app takes the door instead of asking "Where are you starting from?"
 * again. Before, "I know some theory" linked to the app's plain entrance and
 * the other two to lesson pages.
 *
 * The build's checker accepts exactly that form of app link and nothing
 * looser: a planted unknown door, or a door with another parameter, fails.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import registry from '../../../scripts/pages/slugs.json';
import indexHtml from '../../../index.html?raw';
import { buildSite, STYLESHEET, appDoorUrl, START_DOOR_IDS, ORIGIN, type Site } from '../render';
import { checkSite, type SiteFiles } from '../check';
import { appText } from '../content';
import { START_DOORS } from '../../state/startDoors';
import { readStartDoor } from '../../state/startLink';
import type { SlugRegistry } from '../slugs';

let site: Site;
const publicFiles = Object.keys(import.meta.glob('../../../public/**/*', { query: '?url', import: 'default', eager: true })).map((f) => f.replace('../../../public', ''));
beforeAll(() => {
  site = buildSite(registry as SlugRegistry);
});

/** As the page writes an address in an attribute. */
const amp = (s: string) => s.replace(/&/g, '&amp;');
const doc = (path: string) => new DOMParser().parseFromString(site.pages.find((p) => p.path === path)!.html, 'text/html');

describe('the public pages\' doors carry the door (A19)', () => {
  it('the site and the app name the same three doors', () => {
    expect([...START_DOOR_IDS]).toEqual([...START_DOORS]);
  });

  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: each door of the landing page links to the app with that door and the page's language, in the start screen's order and words`, () => {
      const d = doc(`/${lang}/`);
      const links = [...d.querySelectorAll('section[aria-labelledby="doors"] a')];
      expect(links.map((a) => a.querySelector('.lt')?.textContent)).toEqual(START_DOOR_IDS.map((door) => appText(lang, `start.door.${door}.title`)));
      expect(links.map((a) => a.getAttribute('href'))).toEqual(START_DOOR_IDS.map((door) => `${ORIGIN}/?start=${door}&lang=${lang}`));
      // The app reads each one back as its door.
      for (const [i, a] of links.entries()) {
        const search = new URL(a.getAttribute('href')!).search;
        expect(readStartDoor(search)).toBe(START_DOOR_IDS[i]);
      }
      // "Open Fermatina" stays the plain entrance (the start screen asks).
      expect(d.querySelector('a.button')?.getAttribute('href')).toBe(`${ORIGIN}/?lang=${lang}`);
    });
  }

  it('no other page links into the app with a door', () => {
    const others = site.pages.filter((p) => !/^\/(en|pt|es)\/$/.test(p.path));
    expect(others.length).toBeGreaterThan(400);
    for (const p of others) expect(p.html.includes('?start='), p.path).toBe(false);
  });

  it('the build\'s checker passes the real output and catches an unknown door, or a door beside another parameter', () => {
    const files = (edit: (pages: Map<string, string>) => void = () => {}): SiteFiles => {
      const pages = new Map(site.pages.map((p) => [p.path, p.html]));
      edit(pages);
      return { pages, sitemap: site.sitemap, home: indexHtml, files: new Set(['/', STYLESHEET, ...publicFiles]) };
    };
    const problems = (f: SiteFiles) => checkSite(f, { lessons: 136 }).problems;
    expect(problems(files())).toEqual([]);
    const planted = (from: string, to: string) => problems(files((pages) => {
      const html = pages.get('/pt/')!;
      expect(html.includes(from)).toBe(true);
      pages.set('/pt/', html.replace(from, to));
    }));
    expect(planted(amp(appDoorUrl('pt', 'theory')), `${ORIGIN}/?start=expert&amp;lang=pt`)).toContain(`/pt/: app link ${ORIGIN}/?start=expert&lang=pt`);
    expect(planted(amp(appDoorUrl('pt', 'new')), `${ORIGIN}/?start=new&amp;view=drill&amp;lang=pt`)).toContain(`/pt/: app link ${ORIGIN}/?start=new&view=drill&lang=pt`);
  });
});
