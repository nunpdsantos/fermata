/**
 * Review B1 (W9): the update, offline-ready and install toasts each sat at the
 * same fixed spot, so later ones covered the update toast — with all three
 * up only "Install" was visible, and with offline-ready up a tap on Reload
 * hit its ✕. They now stack in ONE fixed container, update first; no toast
 * positions itself, so they can never overlap (real-browser layout check:
 * e2e/pwa.spec.ts).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act, within } from '@testing-library/react';

const { reloadPage } = vi.hoisted(() => ({ reloadPage: vi.fn() }));
vi.mock('../../../utils/pageReload', () => ({ reloadPage }));

type Stub = typeof import('../../../test/stubs/pwa-register');

async function fresh() {
  vi.resetModules();
  const stub: Stub = await import('../../../test/stubs/pwa-register');
  stub.pwaRegisterStub.reset();
  const { PWAPrompts } = await import('../PWAPrompts');
  return { stub: stub.pwaRegisterStub, PWAPrompts };
}

function fireInstallPrompt() {
  const e = new Event('beforeinstallprompt') as Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
  e.prompt = async () => {};
  e.userChoice = Promise.resolve({ outcome: 'dismissed' });
  window.dispatchEvent(e);
}

beforeEach(() => reloadPage.mockClear());
afterEach(cleanup);

describe('PWA toasts never overlap (review B1)', () => {
  it('all three at once: one fixed stack, update first, every action reachable', async () => {
    const { stub, PWAPrompts } = await fresh();
    render(<PWAPrompts />);
    act(() => {
      stub.lastOptions!.onOfflineReady!();
      stub.lastOptions!.onNeedRefresh!();
      fireInstallPrompt();
    });

    const toasts = screen.getAllByRole('alert');
    expect(toasts).toHaveLength(3);
    // Priority order: update > offline-ready > install.
    expect(toasts[0].textContent).toMatch(/new version/i);
    expect(toasts[1].textContent).toMatch(/offline/i);
    expect(toasts[2].textContent).toMatch(/install/i);

    // One positioned container holds them all; no toast positions itself.
    const stack = toasts[0].parentElement!;
    expect(toasts.every((t) => t.parentElement === stack)).toBe(true);
    expect(stack.className).toMatch(/\bfixed\b/);
    expect(stack.className).toMatch(/\bflex-col\b/);
    for (const t of toasts) expect(t.className).not.toMatch(/\b(fixed|absolute)\b/);

    // Each toast carries its own controls (Reload is not under another ✕).
    expect(within(toasts[0]).getByRole('button', { name: /reload/i })).toBeTruthy();
    expect(within(toasts[1]).getByRole('button', { name: /dismiss/i })).toBeTruthy();
    expect(within(toasts[2]).getByRole('button', { name: /install/i })).toBeTruthy();
  });

  it('no toast → no stack element at all', async () => {
    const { PWAPrompts } = await fresh();
    const { container } = render(<PWAPrompts />);
    expect(container.innerHTML).toBe('');
  });
});
