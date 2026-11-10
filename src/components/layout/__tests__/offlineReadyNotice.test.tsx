/**
 * The offline-ready notice (2026-11-09; moved here from the welcome sheet's
 * test when the start screen replaced the sheet, wave 1): a card on wide
 * screens; on phones announced with no card over the page; and none at all in
 * the page that showed the first-visit start screen (it already says "Works
 * offline").
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';

afterEach(cleanup);

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

  it('skipped in the page that showed the start screen (it already says "Works offline"), on any screen', async () => {
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

  it('a visit whose start screen gave way to a shared link is not "the page that showed it": the notice shows', async () => {
    setScreen(false);
    const { stub, gate, PWAPrompts } = await prompts();
    const { applyShareLinkRule } = await import('../../../state/startGate');
    gate.useWelcomeStore.setState({ open: true, shownThisPage: true, bootSearch: '?chord=G' });
    expect(applyShareLinkRule()).toBe(true);
    render(<PWAPrompts />);
    act(() => stub.lastOptions!.onOfflineReady!());
    expect(screen.getByRole('alert').textContent).toMatch(/ready for offline use/);
  });
});
