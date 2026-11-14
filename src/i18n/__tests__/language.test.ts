import { describe, it, expect, afterEach, vi } from 'vitest';
import i18n from '../index';
import { addressLanguage, detectBrowserLanguage, htmlLangFor, linkLanguage } from '../language';

/**
 * W6-15 — <html lang> follows the app language.
 * W6-16 — first run picks pt / es / en from the browser; a saved choice wins.
 */

describe('detectBrowserLanguage', () => {
  it.each([
    [['pt-PT'], 'pt'],
    [['pt-BR', 'en-US'], 'pt'],
    [['es-ES'], 'es'],
    [['es-419'], 'es'],
    [['EN-gb'], 'en'],
    [['fr-FR', 'es-ES', 'pt-PT'], 'es'],
    [['de-DE', 'fr'], 'en'],
    [[], 'en'],
  ] as const)('%j → %s', (langs, expected) => {
    expect(detectBrowserLanguage(langs)).toBe(expected);
  });
});

describe('htmlLangFor', () => {
  it('declares European Portuguese and Castilian Spanish', () => {
    expect(htmlLangFor('pt')).toBe('pt-PT');
    expect(htmlLangFor('es')).toBe('es-ES');
    expect(htmlLangFor('en')).toBe('en');
    expect(htmlLangFor('xx')).toBe('en');
  });
});

describe('<html lang> follows the i18next language', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('switches to pt-PT, es-ES and back to en', async () => {
    await i18n.changeLanguage('pt');
    expect(document.documentElement.lang).toBe('pt-PT');
    await i18n.changeLanguage('es');
    expect(document.documentElement.lang).toBe('es-ES');
    await i18n.changeLanguage('en');
    expect(document.documentElement.lang).toBe('en');
  });
});

describe('first-run language in the persisted store', () => {
  const original = Object.getOwnPropertyDescriptor(window.navigator, 'languages');

  function setBrowserLanguages(langs: string[]) {
    Object.defineProperty(window.navigator, 'languages', { value: langs, configurable: true });
  }

  async function freshStore() {
    vi.resetModules();
    const { useAppStore } = await import('../../state/store');
    return useAppStore;
  }

  afterEach(() => {
    localStorage.clear();
    if (original) Object.defineProperty(window.navigator, 'languages', original);
    else delete (window.navigator as unknown as Record<string, unknown>).languages;
  });

  it('no saved state + Portuguese browser → pt', async () => {
    localStorage.clear();
    setBrowserLanguages(['pt-PT', 'en']);
    expect((await freshStore()).getState().language).toBe('pt');
  });

  it('no saved state + Spanish browser → es', async () => {
    localStorage.clear();
    setBrowserLanguages(['es-ES']);
    expect((await freshStore()).getState().language).toBe('es');
  });

  it('a saved choice beats the browser language', async () => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { language: 'en' }, version: 6 }));
    setBrowserLanguages(['pt-PT']);
    expect((await freshStore()).getState().language).toBe('en');
  });

  it('a corrupt saved language falls back to the browser language', async () => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { language: 'klingon' }, version: 6 }));
    setBrowserLanguages(['es-AR']);
    expect((await freshStore()).getState().language).toBe('es');
  });
});

/**
 * `?lang=` (2026-11-14): the search pages' "Open in Fermatina" links carry the
 * page's language. It chooses the language of a visit with NO app data saved;
 * a saved language (any saved data) always wins.
 */
describe('?lang= in the address', () => {
  const storage = (entries: Record<string, string>) => ({
    length: Object.keys(entries).length,
    key: (i: number) => Object.keys(entries)[i] ?? null,
    getItem: (k: string) => entries[k] ?? null,
  });

  it('reads en, pt or es (case and spaces forgiven), nothing else', () => {
    expect(addressLanguage('?lang=pt')).toBe('pt');
    expect(addressLanguage('?lesson=l1u3m1&lang=es')).toBe('es');
    expect(addressLanguage('?lang=EN%20')).toBe('en');
    expect(addressLanguage('?lang=fr')).toBeNull();
    expect(addressLanguage('?lang=')).toBeNull();
    expect(addressLanguage('')).toBeNull();
  });

  it('counts only with no app data saved (the first-visit gate\'s flag alone is not app data)', () => {
    expect(linkLanguage('?lang=pt', storage({}))).toBe('pt');
    expect(linkLanguage('?lang=pt', storage({ 'fermata-welcome-v1': 'pending' }))).toBe('pt');
    expect(linkLanguage('?lang=pt', storage({ 'music-theory-app': JSON.stringify({ state: { language: 'en' }, version: 6 }) }))).toBeNull();
    expect(linkLanguage('?lang=pt', storage({ 'music-theory-progress': '{}' }))).toBeNull();
    expect(linkLanguage('?lang=pt', storage({ 'fermata-drill-v1': '{}' }))).toBeNull();
    expect(linkLanguage('?lang=pt', undefined)).toBeNull();
    const broken = { length: 1, key: () => { throw new Error('blocked'); }, getItem: () => null };
    expect(linkLanguage('?lang=pt', broken)).toBeNull();
  });

  describe('at boot', () => {
    const original = Object.getOwnPropertyDescriptor(window.navigator, 'languages');
    async function boot(search: string) {
      window.history.replaceState(null, '', `/${search}`);
      vi.resetModules();
      const { useAppStore } = await import('../../state/store');
      const fresh = (await import('../index')).default;
      return { store: useAppStore.getState().language, i18n: fresh.language };
    }
    afterEach(() => {
      localStorage.clear();
      window.history.replaceState(null, '', '/');
      if (original) Object.defineProperty(window.navigator, 'languages', original);
      else delete (window.navigator as unknown as Record<string, unknown>).languages;
    });

    it('a first visit by a Portuguese page\'s link, in an English browser, starts in Portuguese (store and i18next)', async () => {
      localStorage.clear();
      Object.defineProperty(window.navigator, 'languages', { value: ['en-GB'], configurable: true });
      expect(await boot('?lesson=l1u3m1&lang=pt')).toEqual({ store: 'pt', i18n: 'pt' });
    });

    it('a saved language wins over the link', async () => {
      localStorage.setItem('music-theory-app', JSON.stringify({ state: { language: 'es' }, version: 6 }));
      Object.defineProperty(window.navigator, 'languages', { value: ['en-GB'], configurable: true });
      expect(await boot('?lang=pt')).toEqual({ store: 'es', i18n: 'es' });
    });

    it('any saved data, even with no language in it, leaves the browser\'s language', async () => {
      localStorage.setItem('music-theory-progress', JSON.stringify({ state: {}, version: 4 }));
      Object.defineProperty(window.navigator, 'languages', { value: ['es-ES'], configurable: true });
      expect(await boot('?lang=pt')).toEqual({ store: 'es', i18n: 'es' });
    });

    it('decided once, at boot: what is saved afterwards does not change the answer within the page', async () => {
      localStorage.clear();
      Object.defineProperty(window.navigator, 'languages', { value: ['en-GB'], configurable: true });
      window.history.replaceState(null, '', '/?lang=es');
      vi.resetModules();
      const language = await import('../language');
      expect(language.firstRunLanguage()).toBe('es');
      localStorage.setItem('music-theory-app', '{}');
      window.history.replaceState(null, '', '/');
      expect(language.firstRunLanguage()).toBe('es');
    });
  });
});
