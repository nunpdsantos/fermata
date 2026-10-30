import { describe, it, expect, afterEach, vi } from 'vitest';
import i18n from '../index';
import { detectBrowserLanguage, htmlLangFor } from '../language';

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
