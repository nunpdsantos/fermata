/**
 * The top bar holds still between views (brief U2). The microphone switch is
 * offered only where a played note can be used (Explore, a check answered on
 * the instrument; never while the tour plays), so by width:
 *   below 360 px     Search in "⋯" (as on main); where the switch is not
 *                    offered, an empty inert slot of its width in its place
 *   360–639 px       where the switch is offered it takes the magnifier's
 *                    place and Search is the first item of "⋯"; elsewhere
 *                    the bar is main's (magnifier and "⋯")
 *   640–1023 px      the slot again where the switch is not offered
 *   from 1024 px     no slot
 * Where no microphone can work: no switch, no slot, no swap (main's bar).
 * The same in every language: Portuguese and Spanish have no threshold of
 * their own any more. jsdom lays nothing out: the widths are given through
 * matchMedia, the browser half is e2e/design-mic-switch.spec.ts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import i18n from '../../../i18n';
import { installFakeMic, type FakeMic } from '../../../services/microphone/__tests__/fakeMic';
import { micOff, setMic, useMic } from '../../../services/microphone/micSwitch';
import { useAppStore } from '../../../state/store';
import { clearDemoRequest, requestDemo } from '../../../state/demoRequest';
import { TopBar } from '../TopBar';

vi.mock('../../tuner/hearString.ts', () => ({ REFERENCE_SECONDS: 2.5, prepareGuitarStrings: () => undefined, playGuitarString: () => undefined }));

/** A matchMedia that answers width queries for a window `width` px wide (anything else: no match). */
function windowWidth(width: number) {
  const part = (p: string) => {
    const m = /\((max|min)-width:\s*(\d+)px\)/.exec(p);
    if (!m || p.replace(m[0], '').trim()) return false;
    return m[1] === 'max' ? width <= Number(m[2]) : width >= Number(m[2]);
  };
  const matches = (q: string) => q.split(',').some((alt) => alt.split(/\s+and\s+/).every((p) => part(p.trim())));
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: matches(q), media: q, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} }));
}

type Where = 'explore' | 'learn' | 'drill' | 'check' | 'tour';
function go(where: Where) {
  useAppStore.setState({ view: where === 'check' ? 'learn' : where === 'tour' ? 'explore' : where });
  useMic.setState({ check: where === 'check' });
  if (where === 'tour') requestDemo('intro', 'menu');
}

const WORDS = {
  en: { search: 'Search', searchButton: 'Quick search, Command+K', more: 'More', mic: 'Microphone', on: 'On', off: 'Off' },
  pt: { search: 'Pesquisar', searchButton: 'Pesquisa rápida, Command+K', more: 'Mais', mic: 'Microfone', on: 'Ligado', off: 'Desligado' },
  es: { search: 'Buscar', searchButton: 'Búsqueda rápida, Command+K', more: 'Más', mic: 'Micrófono', on: 'Activado', off: 'Desactivado' },
} as const;
type Lang = keyof typeof WORDS;

/** What the bar holds on its right, in order, and the first item of "⋯". */
function read(lang: Lang = 'en') {
  const w = WORDS[lang];
  const tools = screen.getByTestId('app-topbar').querySelector('.app-tabs')!.nextElementSibling!;
  const right = Array.from(tools.children).map((el) =>
    el.getAttribute('data-testid') === 'mic-slot' ? 'slot'
      : el.getAttribute('data-testid') === 'mic-switch' ? 'mic'
        : el.getAttribute('aria-label') === w.searchButton ? 'search'
          : el.querySelector(`[aria-label="${w.more}"]`) || el.getAttribute('aria-label') === w.more ? 'more' : `?${el.outerHTML.slice(0, 40)}`);
  fireEvent.click(screen.getByRole('button', { name: w.more }));
  const items = screen.getAllByRole('menuitem').map((m) => m.textContent);
  fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
  return { right, firstItem: items[0], searchItems: items.filter((i) => i === w.search).length };
}

let mic: FakeMic;
beforeEach(() => {
  mic = installFakeMic();
  micOff();
  clearDemoRequest();
  useMic.setState({ check: false });
  useAppStore.setState({ view: 'explore', language: 'en' });
});
afterEach(async () => {
  cleanup();
  micOff();
  clearDemoRequest();
  useMic.setState({ check: false });
  mic.restore();
  vi.unstubAllGlobals();
  await act(() => i18n.changeLanguage('en'));
});

const WIDTHS = [320, 344, 359, 360, 390, 404, 405, 430, 639, 640, 768, 1023, 1024, 1200, 1440];
const VIEWS: Where[] = ['explore', 'learn', 'drill', 'check', 'tour'];

describe('the bar keeps the switch\'s place in every view, by width', () => {
  for (const width of WIDTHS) {
    it(`${width} px: Explore, Learn, Drill, a check and the tour`, () => {
      windowWidth(width);
      for (const where of VIEWS) {
        go(where);
        const { unmount } = render(<TopBar />);
        const offered = where === 'explore' || where === 'check';
        const slotted = !offered && (width < 360 || (width >= 640 && width < 1024));
        const searchInBar = !(width < 360 || (offered && width < 640));
        const expected = [...(offered ? ['mic'] : []), ...(slotted ? ['slot'] : []), ...(searchInBar ? ['search'] : []), 'more'];
        const got = read();
        expect(got.right, `${width} px, ${where}`).toEqual(expected);
        // Search: by the magnifier or first in "⋯" — never both, never neither.
        expect(got.searchItems, `${width} px, ${where}: Search in "⋯"`).toBe(searchInBar ? 0 : 1);
        if (!searchInBar) expect(got.firstItem, `${width} px, ${where}: Search first in "⋯"`).toBe('Search');
        unmount();
        clearDemoRequest();
      }
    });
  }

  it('the slot is empty and inert: aria-hidden, not focusable, nothing a screen reader meets; the switch\'s place exactly', () => {
    windowWidth(768);
    go('learn');
    render(<TopBar />);
    const slot = screen.getByTestId('mic-slot');
    expect(slot.tagName).toBe('SPAN');
    expect(slot.getAttribute('aria-hidden')).toBe('true');
    expect(slot.hasAttribute('tabindex')).toBe(false);
    expect(slot.textContent).toBe('');
    expect(slot.children.length).toBe(0);
    expect(slot.className).toBe('mic-slot');
    // Where the switch stands in Explore: before search and "⋯".
    expect(slot.nextElementSibling?.getAttribute('aria-label')).toBe('Quick search, Command+K');
  });

  it('the switch turned on, or with a problem, keeps the same place (the state never changes the bar)', () => {
    windowWidth(390);
    render(<TopBar />);
    for (const s of [{ kind: 'on', heard: null }, { kind: 'problem', problem: 'missing' }, { kind: 'asking', step: 'explain' }] as const) {
      act(() => setMic(s));
      expect(read().right).toEqual(['mic', 'more']);
    }
  });
});

describe('where no microphone can work: main\'s bar (no switch, no slot, no swap)', () => {
  for (const width of WIDTHS) {
    it(`${width} px`, () => {
      Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: undefined });
      windowWidth(width);
      for (const where of VIEWS) {
        go(where);
        const { unmount } = render(<TopBar />);
        const got = read();
        expect(got.right, `${width} px, ${where}`).toEqual(width < 360 ? ['more'] : ['search', 'more']);
        expect(got.searchItems).toBe(width < 360 ? 1 : 0);
        unmount();
        clearDemoRequest();
      }
    });
  }
});

describe('Portuguese and Spanish: no threshold of their own (the 405 px rule is gone)', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: 360–404 px — Learn and Drill keep the magnifier; Explore swaps it for the switch; below 360 Search is in "⋯" everywhere`, async () => {
      await act(() => i18n.changeLanguage(lang));
      useAppStore.setState({ language: lang });
      for (const width of [344, 360, 390, 393, 404]) {
        windowWidth(width);
        for (const where of ['learn', 'drill', 'explore'] as const) {
          go(where);
          const { unmount } = render(<TopBar />);
          const got = read(lang);
          const expected = width < 360 ? (where === 'explore' ? ['mic', 'more'] : ['slot', 'more']) : where === 'explore' ? ['mic', 'more'] : ['search', 'more'];
          expect(got.right, `${lang} ${width} px ${where}`).toEqual(expected);
          expect(got.searchItems).toBe(expected.includes('search') ? 0 : 1);
          if (!expected.includes('search')) expect(got.firstItem).toBe(WORDS[lang].search);
          unmount();
        }
      }
    });
  }
});

describe('the bar\'s switch has a tooltip: its name and state in words (it shows no words below 1200 px)', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}`, async () => {
      const w = WORDS[lang];
      await act(() => i18n.changeLanguage(lang));
      useAppStore.setState({ language: lang });
      render(<TopBar />);
      const sw = screen.getByTestId('mic-switch');
      expect(sw.getAttribute('title')).toBe(`${w.mic}: ${w.off}`);
      act(() => setMic({ kind: 'on', heard: null }));
      expect(sw.getAttribute('title')).toBe(`${w.mic}: ${w.on}`);
      // The accessible name and the toggle's state stay as they were.
      expect(sw.getAttribute('aria-label')).toBe(w.mic);
      expect(sw.getAttribute('aria-pressed')).toBe('true');
      act(() => setMic({ kind: 'problem', problem: 'idle' }));
      expect(sw.getAttribute('title')).toBe(`${w.mic}: ${w.off}`);
      expect(sw.getAttribute('aria-pressed')).toBe('false');
    });
  }
});
