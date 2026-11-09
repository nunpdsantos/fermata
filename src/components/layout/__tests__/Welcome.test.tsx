/**
 * The first-visit welcome (2026-11-09): one sheet, three views explained,
 * three ways out, never again — and the offline-ready notice it replaces on
 * that visit, plus that notice on phones (announced, no card over the page).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act, waitFor } from '@testing-library/react';
import i18n from '../../../i18n';
import { WelcomeHost } from '../WelcomeHost';
import { WELCOME_KEY, bootWelcome, useWelcomeStore } from '../../../state/welcomeGate';
import { useAppStore } from '../../../state/store';

afterEach(cleanup);
beforeEach(async () => {
  localStorage.clear();
  useWelcomeStore.setState({ open: false, shownThisPage: false });
  useAppStore.setState({ view: 'explore', lastView: 'explore', language: 'en' });
  await i18n.changeLanguage('en');
});

/** The top bar's tabs (focus returns to the one of the view now shown). */
function Tabs() {
  return (
    <div>
      {(['explore', 'learn', 'drill'] as const).map((v) => <button key={v} id={`tab-${v}`}>{v}</button>)}
    </div>
  );
}

async function openWelcome(name = 'Welcome to Fermata') {
  // useAppStore.setState above already saved settings (persist writes on
  // every set) — exactly why the real check runs before any store loads.
  localStorage.clear();
  expect(bootWelcome(localStorage)).toBe(true);
  render(<><Tabs /><WelcomeHost /></>);
  // A lazy chunk: the first import is transformed on demand.
  return screen.findByRole('dialog', { name }, { timeout: 8000 });
}

describe('the welcome sheet', () => {
  it('names itself, explains the three views in the tabs\' own words, and takes focus', async () => {
    const dialog = await openWelcome();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const terms = [...dialog.querySelectorAll('dt')].map((d) => d.textContent);
    expect(terms).toEqual(['Explore', 'Learn', 'Drill']);
    expect(dialog.textContent).toContain('nine levels');
    expect(dialog.textContent).toContain('Free, no account, works offline. Your progress stays in this browser.');
    // The Sheet moves focus in an effect after the dialog mounts: wait for it
    // (asserting at once failed once on a slow CI runner, main e60cd38).
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    expect(screen.getAllByRole('button').filter((b) => dialog.contains(b)).map((b) => b.textContent || b.getAttribute('aria-label')))
      .toEqual(['Close', 'Explore a key', 'Start the course', 'Try a drill']);
  });

  it.each([
    ['Explore a key', 'explore'],
    ['Start the course', 'learn'],
    ['Try a drill', 'drill'],
  ] as const)('"%s" closes it for good and shows %s, with focus on that tab', async (label, view) => {
    await openWelcome();
    expect(localStorage.getItem(WELCOME_KEY)).toBe('pending');
    fireEvent.click(screen.getByRole('button', { name: label }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(useAppStore.getState().view).toBe(view);
    expect(localStorage.getItem(WELCOME_KEY)).toBe('seen');
    expect(document.activeElement?.id).toBe(`tab-${view}`);
  });

  it('Escape and ✕ close it, stay on the view, and remember', async () => {
    useAppStore.setState({ view: 'learn' });
    await openWelcome();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(useAppStore.getState().view).toBe('learn');
    expect(localStorage.getItem(WELCOME_KEY)).toBe('seen');
    expect(document.activeElement?.id).toBe('tab-learn');

    cleanup();
    localStorage.removeItem(WELCOME_KEY);
    useWelcomeStore.setState({ open: false, shownThisPage: false });
    await openWelcome();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(localStorage.getItem(WELCOME_KEY)).toBe('seen');
  });

  it('nothing renders (and nothing downloads) when it is not open', () => {
    const { container } = render(<WelcomeHost />);
    expect(container.innerHTML).toBe('');
  });

  it('PT and ES: the tab names and the text in the learner\'s language', async () => {
    await i18n.changeLanguage('pt');
    let dialog = await openWelcome('Boas-vindas ao Fermata');
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
    expect([...dialog.querySelectorAll('dt')].map((d) => d.textContent)).toEqual(['Explorar', 'Aprender', 'Treino']);
    expect(screen.getByRole('button', { name: 'Começar o curso' })).toBeDefined();
    cleanup();
    useWelcomeStore.setState({ open: false });
    localStorage.clear();
    await i18n.changeLanguage('es');
    dialog = await openWelcome('Te damos la bienvenida a Fermata');
    expect([...dialog.querySelectorAll('dt')].map((d) => d.textContent)).toEqual(['Explorar', 'Aprender', 'Práctica']);
  });
});

describe('the offline-ready notice', () => {
  async function prompts() {
    vi.resetModules();
    const stub = (await import('../../../test/stubs/pwa-register')).pwaRegisterStub;
    stub.reset();
    const gate = await import('../../../state/welcomeGate');
    const { PWAPrompts } = await import('../PWAPrompts');
    return { stub, gate, PWAPrompts };
  }
  const setScreen = (compact: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (q: string) => ({ matches: compact && q.includes('max-width: 639px'), media: q, onchange: null,
        addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } }),
    });
  };
  afterEach(() => {
    delete (window as unknown as { matchMedia?: unknown }).matchMedia;
  });

  it('wide screens: a card, as before', async () => {
    setScreen(false);
    const { stub, PWAPrompts } = await prompts();
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onOfflineReady!());
    expect(screen.getByRole('alert').textContent).toMatch(/ready for offline use/);
    expect(screen.queryByTestId('offline-ready-status')).toBeNull();
  });

  it('phones and short screens: no card over the page; announced from a status that was already there', async () => {
    setScreen(true);
    const { stub, PWAPrompts } = await prompts();
    render(<PWAPrompts />);
    const status = screen.getByTestId('offline-ready-status');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.className).toContain('sr-only');
    expect(status.textContent).toBe('');
    act(() => stub.lastOptions!.onOfflineReady!());
    expect(screen.queryByRole('alert')).toBeNull();
    expect(document.querySelector('.toast-card')).toBeNull();
    // The same element (never re-mounted), now with the text: announced.
    expect(screen.getByTestId('offline-ready-status')).toBe(status);
    expect(status.textContent).toBe('App ready for offline use');
  });

  it('skipped in the page that showed the welcome (it already says "works offline"), on any screen', async () => {
    for (const compact of [false, true]) {
      setScreen(compact);
      const { stub, gate, PWAPrompts } = await prompts();
      gate.useWelcomeStore.setState({ open: false, shownThisPage: true });
      render(<PWAPrompts />);
      act(() => stub.lastOptions!.onOfflineReady!());
      expect(screen.queryByRole('alert')).toBeNull();
      expect(screen.queryByTestId('offline-ready-status')?.textContent ?? '').toBe('');
      cleanup();
    }
  });
});
