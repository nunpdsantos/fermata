/**
 * "⋯" → "Report a problem" (2026-11-12): offered in Explore, Learn and Drill,
 * after the metronome (where offered) and before "Update ready"; not while
 * the tour plays. The tap opens the form for the app's language in a new
 * tab (window.open mocked: no test contacts Google); offline, the notice and
 * nothing opened. Expected words are read from the locale files, so a wording
 * fix never breaks these tests.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import i18n from '../../../i18n';
import { useAppStore } from '../../../state/store';
import { clearDemoRequest, requestDemo } from '../../../state/demoRequest';
import { useToastStore } from '../../../state/toastStore';
import { usePwaUpdateStore } from '../../../hooks/usePWA';
import { REPORT_FORMS } from '../../../services/reportProblem';
import { TopBar } from '../TopBar';

// From disk: i18next merges lazily added namespaces into the imported locale objects.
type Locale = { report: { menuItem: string; offline: string }; metronomeToolEntry: { menuItem: string }; pwa: { updateReady: string } };
const locale = (lang: string) => JSON.parse(readFileSync(join(__dirname, '../../../i18n/locales', `${lang}.json`), 'utf8')) as Locale;
const en = locale('en');

beforeEach(() => {
  useAppStore.setState({ view: 'explore', language: 'en' });
  useToastStore.setState({ toasts: [] });
});
afterEach(async () => {
  cleanup();
  act(() => clearDemoRequest());
  usePwaUpdateStore.setState({ needRefresh: false, updateDeferred: false });
  vi.restoreAllMocks();
  await i18n.changeLanguage('en');
  useAppStore.setState({ view: 'explore', language: 'en' });
});

const openMenu = () => {
  fireEvent.click(screen.getByRole('button', { name: /^More/ }));
  return screen.getAllByRole('menuitem').map((m) => m.textContent);
};

describe('the "⋯" row', () => {
  it.each(['explore', 'learn', 'drill'] as const)('%s: offered once, after the metronome where it is offered', (view) => {
    useAppStore.setState({ view });
    render(<TopBar />);
    const items = openMenu();
    expect(items.filter((i) => i === en.report.menuItem)).toHaveLength(1);
    const metronome = items.indexOf(en.metronomeToolEntry.menuItem);
    if (view === 'drill') expect(metronome).toBe(-1);
    else expect(items.indexOf(en.report.menuItem)).toBe(metronome + 1);
    // Last of the always-there rows (nothing waits to be updated here).
    expect(items[items.length - 1]).toBe(en.report.menuItem);
  });

  it('before "Update ready: reload" while an update waits', () => {
    usePwaUpdateStore.setState({ needRefresh: true });
    render(<TopBar />);
    const items = openMenu();
    expect(items.slice(-2)).toEqual([en.report.menuItem, en.pwa.updateReady]);
  });

  it('not while the tour plays', () => {
    act(() => requestDemo('intro', 'menu'));
    render(<TopBar />);
    expect(openMenu()).not.toContain(en.report.menuItem);
  });
});

describe('the tap', () => {
  it.each(['en', 'pt', 'es'] as const)('%s: the form in that language, in a new tab, its details box saying the view and the language', async (lang) => {
    await i18n.changeLanguage(lang);
    useAppStore.setState({ view: 'learn', language: lang });
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    render(<TopBar />);
    fireEvent.click(screen.getByRole('button', { name: /^(More|Mais|Más)/ }));
    fireEvent.click(screen.getByRole('menuitem', { name: locale(lang).report.menuItem }));
    expect(open).toHaveBeenCalledTimes(1);
    const [url, target, features] = open.mock.calls[0];
    expect(target).toBe('_blank');
    expect(features).toBe('noopener,noreferrer');
    const form = REPORT_FORMS[lang];
    expect(String(url).startsWith(`${form.url}?usp=pp_url&entry.${form.detailsEntry}=`)).toBe(true);
    const details = new URL(String(url)).searchParams.get(`entry.${form.detailsEntry}`)!;
    expect(details.split(' · ').slice(0, 3)).toEqual(['learn', lang, 'release 0 (dev)']);
    expect(details.split(' · ')).toHaveLength(5);
    expect(useToastStore.getState().toasts).toEqual([]);
  });

  it('offline: the notice in the toast, and nothing opened', async () => {
    await i18n.changeLanguage('pt');
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    render(<TopBar />);
    fireEvent.click(screen.getByRole('button', { name: /^Mais/ }));
    fireEvent.click(screen.getByRole('menuitem', { name: locale('pt').report.menuItem }));
    expect(open).not.toHaveBeenCalled();
    expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual([locale('pt').report.offline]);
  });
});
