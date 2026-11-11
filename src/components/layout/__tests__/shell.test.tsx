/**
 * The W11-A shell: top bar (tabs + "⋯" → Settings), the Settings sheet
 * (language, theme, data, footer), the instrument dock and the toast region.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act, waitFor } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { useToastStore } from '../../../state/toastStore';
import { useDockContextStore } from '../../../state/dockContextStore';

const { reloadPage, phone } = vi.hoisted(() => ({ reloadPage: vi.fn(), phone: { value: false } }));
vi.mock('../../../utils/pageReload', () => ({ reloadPage }));
vi.mock('../../instruments/Piano.tsx', () => ({ Piano: () => <div data-testid="piano-mock" /> }));
vi.mock('../../instruments/Fretboard.tsx', () => ({ Fretboard: () => <div data-testid="fret-mock" /> }));
vi.mock('../../../hooks/useMediaQuery.ts', async (orig) => ({
  ...(await orig<Record<string, unknown>>()),
  useMediaQuery: (q: string) => (q.startsWith('(max-width: 639px)') ? phone.value : false),
}));

import { TopBar } from '../TopBar';
import { SettingsSheet } from '../SettingsSheet';
import { InstrumentDock } from '../InstrumentDock';
import { ToastRegion } from '../ToastRegion';

beforeEach(() => {
  useAppStore.setState({
    view: 'explore',
    language: 'en',
    themeMode: 'fermata',
    instrument: 'piano',
    baseOctave: 4,
    scaleOctaves: 1,
    exerciseInputActive: false,
    dockDetents: { explore: 'half', learn: 'peek' },
  });
  useToastStore.setState({ toasts: [] });
  reloadPage.mockClear();
  phone.value = false;
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('TopBar', () => {
  it('Explore / Learn / Drill are tabs controlling their panels; arrow keys switch views', () => {
    render(<TopBar />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual(['Explore', 'Learn', 'Drill']);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-controls')).toBe('learn-panel');
    expect(tabs[1].id).toBe('tab-learn');
    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(useAppStore.getState().view).toBe('learn');
  });

  it('search opens Quick Search; "⋯" → Settings opens the sheet', async () => {
    render(<TopBar />);
    fireEvent.click(screen.getByRole('button', { name: 'Quick search, Command+K' }));
    expect(useAppStore.getState().quickSearchOpen).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Settings' }));
    // A lazy chunk since the wave-2 integration (the entry file's budget).
    expect(await screen.findByRole('dialog', { name: 'Settings' })).toBeTruthy();
  });
});

describe('SettingsSheet', () => {
  it('language and theme are segments wired to the store (Day / Night / Auto)', () => {
    render(<SettingsSheet open onClose={() => {}} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Night' }));
    expect(useAppStore.getState().themeMode).toBe('fermata-night');
    fireEvent.click(screen.getByRole('radio', { name: 'Auto' }));
    expect(useAppStore.getState().themeMode).toBe('auto');
    expect(screen.getByRole('radio', { name: 'English' }).getAttribute('aria-checked')).toBe('true');
    fireEvent.click(screen.getByRole('radio', { name: 'Español' }));
    expect(useAppStore.getState().language).toBe('es');
  });

  it('Export downloads a dated backup file and says so', () => {
    const createObjectURL = vi.fn(() => 'blob:x');
    Object.assign(URL, { createObjectURL, revokeObjectURL: vi.fn() });
    const clicks: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      clicks.push(this.download);
    });
    render(<SettingsSheet open onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Export backup' }));
    expect(createObjectURL).toHaveBeenCalled();
    expect(clicks[0]).toMatch(/^fermata-backup-\d{4}-\d{2}-\d{2}\.json$/);
    expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual(['Backup downloaded']);
  });

  it('Import vets the file: garbage is refused, a valid backup asks (in the UI language), applies and reloads', async () => {
    render(<SettingsSheet open onClose={() => {}} />);
    const input = screen.getByTestId('backup-file-input') as HTMLInputElement;
    // jsdom's File has no text(): give each test file one.
    const file = (body: string) => Object.assign(new File([body], 'b.json', { type: 'application/json' }), { text: async () => body });

    fireEvent.change(input, { target: { files: [file('{not json')] } });
    await waitFor(() => expect(useToastStore.getState().toasts.at(-1)?.message).toBe('Not a valid Fermata backup file'));

    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const backup = {
      format: 'fermata-backup',
      version: 1,
      exportedAt: '2026-10-31T00:00:00.000Z',
      data: { 'music-theory-app': { state: { themeMode: 'auto', dockDetents: { explore: 'full', learn: 'half' } }, version: 6 } },
    };
    fireEvent.change(input, { target: { files: [file(JSON.stringify(backup))] } });
    await waitFor(() => expect(reloadPage).toHaveBeenCalledTimes(1));
    expect(confirm.mock.calls[0][0]).toContain('preferences');
    expect(JSON.parse(localStorage.getItem('music-theory-app')!).state.dockDetents).toEqual({ explore: 'full', learn: 'half' });
  });

  it('footer: "works offline" only while a service worker controls the page', () => {
    const { unmount } = render(<SettingsSheet open onClose={() => {}} />);
    expect(screen.getByTestId('settings-footer').textContent).toBe('Fermata');
    unmount();
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { controller: {}, addEventListener: vi.fn(), removeEventListener: vi.fn() },
    });
    try {
      render(<SettingsSheet open onClose={() => {}} />);
      expect(screen.getByTestId('settings-footer').textContent).toBe('Fermata · works offline');
    } finally {
      delete (navigator as unknown as { serviceWorker?: unknown }).serviceWorker;
    }
  });
});

describe('InstrumentDock', () => {
  it('docked panel (tablet / laptop): Show / Hide collapses to the bar; the context line says what is shown', () => {
    render(<InstrumentDock view="explore" available={700} />);
    expect(screen.getByTestId('piano-mock')).toBeTruthy();
    expect(screen.getByText('C4 · 1 octave')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Hide' }));
    expect(useAppStore.getState().dockDetents.explore).toBe('peek');
    expect(screen.queryByTestId('piano-mock')).toBeNull();
    expect(screen.queryByRole('separator')).toBeNull(); // not a sheet here
  });

  it('guitar: the position the fretboard publishes; an exercise says "answer on the instrument"', () => {
    useAppStore.setState({ instrument: 'guitar' });
    act(() => useDockContextStore.getState().setGuitarPosition(2));
    const { rerender } = render(<InstrumentDock view="explore" available={700} />);
    expect(screen.getByText('Position II')).toBeTruthy();
    act(() => useDockContextStore.getState().setGuitarPosition(0));
    rerender(<InstrumentDock view="explore" available={700} />);
    expect(screen.getByText('Open position')).toBeTruthy();
    act(() => useAppStore.setState({ exerciseInputActive: true }));
    expect(screen.getByText('Answer on the instrument')).toBeTruthy();
  });

  it('phone: a pull-up sheet whose detent is remembered per view', () => {
    phone.value = true;
    useAppStore.setState({ view: 'learn' });
    render(<InstrumentDock view="learn" available={700} />);
    const handle = screen.getByRole('separator', { name: 'Instrument panel' });
    expect(handle.getAttribute('aria-valuetext')).toBe('Peek'); // Learn starts collapsed (D-20)
    fireEvent.keyDown(handle, { key: 'End' });
    expect(useAppStore.getState().dockDetents).toEqual({ explore: 'half', learn: 'full' });
  });

  it('phone / short screen: Show / Hide is an icon button with a name; the context line wraps (no ellipsis)', () => {
    phone.value = true;
    useAppStore.setState({ view: 'learn', dockDetents: { explore: 'half', learn: 'peek' } });
    render(<InstrumentDock view="learn" available={700} />);
    const show = screen.getByRole('button', { name: 'Show instrument' });
    expect(show.textContent).toBe('');
    fireEvent.click(show);
    expect(useAppStore.getState().dockDetents.learn).toBe('half');
    expect(screen.getByRole('button', { name: 'Hide instrument' })).toBeTruthy();
    const context = document.querySelector('.dock-context')!;
    expect(context.className).not.toMatch(/truncate|ellipsis/);
  });
});

describe('ToastRegion', () => {
  it('one region: the PWA stack first, then app toasts', () => {
    const { container } = render(<ToastRegion />);
    act(() => useToastStore.getState().addToast({ type: 'success', message: 'Saved', duration: 0 }));
    const region = container.querySelector('[data-testid="toast-region"]')!;
    expect(region.className).toContain('toast-region');
    expect(screen.getByRole('status').textContent).toContain('Saved');
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeTruthy();
  });
});
