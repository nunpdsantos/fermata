/**
 * The one-tap language offer (audit 2, P9, 19 November 2026), row by row:
 * saved language × the link's `?lang=` × first visit × work in progress.
 *
 * | saved | link | first visit | work / tour | what happens                                        |
 * |-------|------|-------------|-------------|-----------------------------------------------------|
 * | —     | pt   | yes         | —           | the visit starts in PT; no offer                    |
 * | en    | pt   | no          | none        | "Mudar para português?" · Mudar (PT); EN until tap  |
 * | en    | pt   | no          | none, ✕     | stays EN; not again this visit                      |
 * | pt    | pt   | no          | —           | agree: no offer                                     |
 * | pt    | es   | no          | none        | "¿Cambiar a español?" · Cambiar                     |
 * | es    | en   | no          | none        | "Switch to English?" · Switch                       |
 * | en    | xx   | no          | —           | not a language: nothing                             |
 * | en    | pt   | no          | work        | waits; shown once the work is over                  |
 * | en    | pt   | no          | the tour    | waits; shown once it ends                           |
 * | en    | pt   | no          | work at tap | nothing changes; offered again once it is over      |
 * | en    | pt   | no          | —, learner  | the learner picks a language: withdrawn / not shown |
 * | none  | pt   | no (other   | none        | the browser's language (EN) was used: offered       |
 * |       |      | data saved) |             |                                                     |
 *
 * Each row boots a fresh copy of the app's modules with its own storage and
 * address, as a page load does (language.ts reads both once, at boot).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

const APP = 'music-theory-app';
const saveIn = (language?: string) => JSON.stringify({ state: language ? { language, lastView: 'explore' } : { lastView: 'explore' }, version: 6 });

async function boot({ storage, search }: { storage: Record<string, string>; search: string }) {
  vi.resetModules();
  localStorage.clear();
  for (const [k, v] of Object.entries(storage)) localStorage.setItem(k, v);
  window.history.replaceState(null, '', `/${search}`);
  const i18n = (await import('../../../i18n')).default;
  const { useAppStore } = await import('../../../state/store');
  const { useToastStore } = await import('../../../state/toastStore');
  const { registerWorkInProgress } = await import('../../../services/workInProgress');
  const demo = await import('../../../state/demoRequest');
  const { LanguageOffer } = await import('../LanguageOffer');
  const { ToastContainer } = await import('../Toast');
  const offer = await import('../languageOfferToast');
  const language = await import('../../../i18n/language');
  offer.resetLanguageOffer();
  await i18n.changeLanguage(useAppStore.getState().language);
  const mount = () => render(<><LanguageOffer /><ToastContainer /></>);
  return { i18n, useAppStore, useToastStore, registerWorkInProgress, demo, mount, offer, language };
}

/** Let the offer's chunk load and decide (it shows at once when nothing is under way). */
const settle = () => act(() => new Promise((r) => setTimeout(r, 30)));
const offerCard = () => screen.queryByRole('status');
const savedLanguage = () => (JSON.parse(localStorage.getItem(APP)!) as { state: { language?: string } }).state.language;

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.history.replaceState(null, '', '/');
  localStorage.clear();
  localStorage.setItem(APP, JSON.stringify({ state: {}, version: 6 }));
});

describe('a first visit: the link simply chose the language', () => {
  it('nothing saved, ?lang=pt: the app is in Portuguese and nothing is offered', async () => {
    const app = await boot({ storage: {}, search: '?lang=pt' });
    expect(app.useAppStore.getState().language).toBe('pt');
    // The link chose the language: there is nothing to offer.
    expect(app.language.bootLanguageOffer()).toBeNull();
    app.mount();
    await settle();
    expect(offerCard()).toBeNull();
  });
});

describe('a returning visit: the saved language wins, the link\'s is offered once', () => {
  it('saved EN, ?lang=pt: one toast in Portuguese, the app still English; the tap switches and saves', async () => {
    const app = await boot({ storage: { [APP]: saveIn('en') }, search: '?lang=pt' });
    expect(app.useAppStore.getState().language).toBe('en');
    expect(app.language.bootLanguageOffer()).toBe('pt');
    app.mount();
    await settle();
    const card = offerCard()!;
    expect(card).not.toBeNull();
    expect(app.useToastStore.getState().toasts).toHaveLength(1);
    expect(card.textContent).toContain('Mudar para português?');
    const message = screen.getByText('Mudar para português?');
    expect(message.getAttribute('lang')).toBe('pt-PT');
    const action = screen.getByRole('button', { name: 'Mudar' });
    expect(action.getAttribute('lang')).toBe('pt-PT');
    // Its close button speaks the app's language.
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeDefined();
    // Nothing changed until the tap.
    expect(app.useAppStore.getState().language).toBe('en');
    expect(savedLanguage()).toBe('en');
    act(() => fireEvent.click(action));
    expect(app.useAppStore.getState().language).toBe('pt');
    expect(savedLanguage()).toBe('pt');
    expect(offerCard()).toBeNull();
  });

  it('saved EN, ?lang=pt, ✕: stays English, and the shell mounting again offers nothing (once per visit)', async () => {
    const app = await boot({ storage: { [APP]: saveIn('en') }, search: '?lang=pt' });
    app.mount();
    await settle();
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Dismiss' })));
    expect(offerCard()).toBeNull();
    cleanup();
    app.mount();
    await settle();
    expect(offerCard()).toBeNull();
    expect(app.useAppStore.getState().language).toBe('en');
    expect(savedLanguage()).toBe('en');
  });

  it('saved PT, ?lang=pt: they agree — nothing', async () => {
    const app = await boot({ storage: { [APP]: saveIn('pt') }, search: '?lang=pt' });
    app.mount();
    await settle();
    expect(offerCard()).toBeNull();
  });

  it('saved PT, ?lang=es: "¿Cambiar a español?" · Cambiar, in Spanish', async () => {
    const app = await boot({ storage: { [APP]: saveIn('pt') }, search: '?lang=es' });
    app.mount();
    await settle();
    expect(screen.getByText('¿Cambiar a español?').getAttribute('lang')).toBe('es-ES');
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Cambiar' })));
    expect(app.useAppStore.getState().language).toBe('es');
  });

  it('saved ES, ?lang=en: "Switch to English?" · Switch', async () => {
    const app = await boot({ storage: { [APP]: saveIn('es') }, search: '?lang=en' });
    app.mount();
    await settle();
    expect(screen.getByText('Switch to English?').getAttribute('lang')).toBe('en');
    expect(screen.getByRole('button', { name: 'Switch' })).toBeDefined();
  });

  it('a lesson link from a public page (?lesson=…&lang=pt) offers it too', async () => {
    const app = await boot({ storage: { [APP]: saveIn('en') }, search: '?lesson=l1u3m1&lang=pt' });
    app.mount();
    await settle();
    expect(screen.getByText('Mudar para português?')).toBeDefined();
  });

  it('?lang=xx is no language: nothing', async () => {
    const app = await boot({ storage: { [APP]: saveIn('en') }, search: '?lang=xx' });
    app.mount();
    await settle();
    expect(offerCard()).toBeNull();
  });

  it('no saved language (other data saved): the browser\'s was used, so the link\'s is offered', async () => {
    const app = await boot({ storage: { [APP]: saveIn(), 'fermata-drill-v1': '{}' }, search: '?lang=pt' });
    expect(app.useAppStore.getState().language).toBe('en');
    app.mount();
    await settle();
    expect(screen.getByText('Mudar para português?')).toBeDefined();
  });
});

describe('never over work in progress or the tour; the learner\'s own choice settles it', () => {
  it('work under way: nothing yet; once it is over, the toast within 1.5 s', async () => {
    const app = await boot({ storage: { [APP]: saveIn('en') }, search: '?lang=pt' });
    let busy = true;
    const unregister = app.registerWorkInProgress('drill', () => busy);
    app.mount();
    await settle();
    expect(offerCard()).toBeNull();
    await act(() => new Promise((r) => setTimeout(r, app.offer.LANGUAGE_OFFER_POLL_MS + 100)));
    expect(offerCard()).toBeNull();
    busy = false;
    await act(() => new Promise((r) => setTimeout(r, app.offer.LANGUAGE_OFFER_POLL_MS + 100)));
    expect(screen.getByText('Mudar para português?')).toBeDefined();
    unregister();
  });

  it('the tour playing: waits for it to end', async () => {
    const app = await boot({ storage: { [APP]: saveIn('en') }, search: '?lang=pt' });
    app.demo.requestDemo('intro', 'menu');
    app.mount();
    await settle();
    expect(offerCard()).toBeNull();
    act(() => app.demo.clearDemoRequest());
    await act(() => new Promise((r) => setTimeout(r, app.offer.LANGUAGE_OFFER_POLL_MS + 100)));
    expect(screen.getByText('Mudar para português?')).toBeDefined();
  });

  it('a tap after work started again changes nothing; it is offered again once the work is over', async () => {
    const app = await boot({ storage: { [APP]: saveIn('en') }, search: '?lang=pt' });
    let busy = false;
    const unregister = app.registerWorkInProgress('learn', () => busy);
    app.mount();
    await settle();
    busy = true;
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Mudar' })));
    expect(app.useAppStore.getState().language).toBe('en');
    expect(offerCard()).toBeNull();
    busy = false;
    await act(() => new Promise((r) => setTimeout(r, app.offer.LANGUAGE_OFFER_POLL_MS + 100)));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Mudar' })));
    expect(app.useAppStore.getState().language).toBe('pt');
    unregister();
  });

  it('the learner picks a language while it waits: never shown; while it shows: withdrawn', async () => {
    let app = await boot({ storage: { [APP]: saveIn('en') }, search: '?lang=pt' });
    let busy = true;
    const unregister = app.registerWorkInProgress('drill', () => busy);
    app.mount();
    await settle();
    act(() => app.useAppStore.getState().setLanguage('es'));
    busy = false;
    await act(() => new Promise((r) => setTimeout(r, app.offer.LANGUAGE_OFFER_POLL_MS + 100)));
    expect(offerCard()).toBeNull();
    unregister();
    cleanup();

    app = await boot({ storage: { [APP]: saveIn('en') }, search: '?lang=pt' });
    app.mount();
    await settle();
    expect(screen.getByText('Mudar para português?')).toBeDefined();
    act(() => app.useAppStore.getState().setLanguage('es'));
    expect(offerCard()).toBeNull();
    expect(app.useAppStore.getState().language).toBe('es');
  });

  it('a language chosen at boot time but before the shell (the start screen): nothing offered', async () => {
    const app = await boot({ storage: { [APP]: saveIn('en') }, search: '?lang=pt' });
    app.useAppStore.getState().setLanguage('es');
    app.mount();
    await settle();
    expect(offerCard()).toBeNull();
  });
});
