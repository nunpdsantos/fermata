/**
 * "We've moved" (2026-11-14: Fermata became Fermatina, at fermatina.com) — on
 * the old address only: the toast (waiting for work in progress and the
 * tour), the moving panel, "Don't remind me again" and its flag, Settings'
 * line and the start screen's line. Everywhere else: nothing shown, and the
 * flag never read or written. Expected words come from the locale files.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';

const host = vi.hoisted(() => ({ value: 'fermata-music.vercel.app' }));
vi.mock('../appAddress', async (importOriginal) => {
  const real = await importOriginal<typeof import('../appAddress')>();
  return { ...real, currentHostname: () => host.value, onOldAddress: (h: string = host.value) => real.onOldAddress(h) };
});
const { reloadPage } = vi.hoisted(() => ({ reloadPage: vi.fn() }));
vi.mock('../../utils/pageReload', () => ({ reloadPage }));

import i18n from '../../i18n';
import en from '../../i18n/locales/en.json';
import pt from '../../i18n/locales/pt.json';
import es from '../../i18n/locales/es.json';
import movedEn from '../../i18n/moved/en.json';
import movedPt from '../../i18n/moved/pt.json';
import movedEs from '../../i18n/moved/es.json';
import { useToastStore } from '../../state/toastStore';
import { clearDemoRequest, requestDemo } from '../../state/demoRequest';
import { registerWorkInProgress } from '../workInProgress';
import {
  MOVED_FLAG_KEY,
  MOVED_POLL_MS,
  closeMovedPanel,
  isStoppedFlag,
  movedReminderStopped,
  noteMovedExport,
  offerMovedNotice,
  openMovedPanel,
  resetMovedNotice,
  stopMovedReminder,
  useMovedPanel,
  writeMovedStopped,
} from '../movedNotice';
import { MovedNoticeHost } from '../../components/moved/MovedNoticeHost';
import { ToastRegion } from '../../components/layout/ToastRegion';
import { SettingsSheet } from '../../components/layout/SettingsSheet';
import StartScreen from '../../components/start/StartScreen';

const LOCALES = { en, pt, es };
const MOVED = { en: movedEn, pt: movedPt, es: movedEs };
const OLD = 'fermata-music.vercel.app';
const ELSEWHERE = ['fermatina.com', 'www.fermatina.com', 'fermata-music-git-feat-fermatina-x.vercel.app', 'localhost'];

const toasts = () => useToastStore.getState().toasts;
const movedToasts = () => toasts().filter((t) => t.message === en.movedEntry.toast);

/** Every key of the flag's storage touched (read or written) while `run` runs. */
async function flagTouches(run: () => unknown | Promise<unknown>): Promise<string[]> {
  const get = vi.spyOn(Storage.prototype, 'getItem');
  const set = vi.spyOn(Storage.prototype, 'setItem');
  const remove = vi.spyOn(Storage.prototype, 'removeItem');
  try {
    await run();
    return [...get.mock.calls, ...set.mock.calls, ...remove.mock.calls].map((c) => String(c[0])).filter((k) => k === MOVED_FLAG_KEY);
  } finally {
    get.mockRestore();
    set.mockRestore();
    remove.mockRestore();
  }
}

beforeEach(async () => {
  host.value = OLD;
  resetMovedNotice();
  clearDemoRequest();
  useToastStore.setState({ toasts: [] });
  localStorage.removeItem(MOVED_FLAG_KEY);
  reloadPage.mockClear();
  await i18n.changeLanguage('en');
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('the words', () => {
  it('the same keys in EN, PT and ES, none empty; every sentence that names the new address carries "fermatina.com"', () => {
    for (const lang of ['pt', 'es'] as const) {
      expect(Object.keys(MOVED[lang]).sort()).toEqual(Object.keys(movedEn).sort());
      expect(Object.keys(LOCALES[lang].movedEntry).sort()).toEqual(Object.keys(en.movedEntry).sort());
    }
    for (const lang of ['en', 'pt', 'es'] as const) {
      for (const v of [...Object.values(MOVED[lang]), ...Object.values(LOCALES[lang].movedEntry)]) expect(v.trim().length).toBeGreaterThan(0);
      for (const key of ['title', 'step2', 'nothingSaved', 'settingsLine'] as const) expect(MOVED[lang][key], `${lang} ${key}`).toContain('fermatina.com');
      expect(LOCALES[lang].movedEntry.toast).toContain('fermatina.com');
    }
  });

  it('step 3 quotes the start screen\'s link and Settings → Your data → Import exactly as the app labels them', () => {
    for (const lang of ['en', 'pt', 'es'] as const) {
      const l = LOCALES[lang];
      const step3 = MOVED[lang].step3;
      expect(step3, lang).toContain(l.start.progressFile);
      expect(step3, lang).toContain(`${l.settings.title} → ${l.settings.yourData} → ${l.settings.import}`);
    }
  });
});

describe('the toast', () => {
  it('shows on the old address: the sentence and one action, lasting', () => {
    offerMovedNotice();
    expect(movedToasts()).toHaveLength(1);
    const [toast] = movedToasts();
    expect(toast.duration).toBe(0);
    expect(toast.action?.label).toBe(en.movedEntry.action);
    // Safe to ask again: still one.
    offerMovedNotice();
    expect(movedToasts()).toHaveLength(1);
  });

  it.each(ELSEWHERE)('on %s: nothing shown, and the flag is never read or written', async (elsewhere) => {
    host.value = elsewhere;
    // A flag left by some other means changes nothing either.
    const touched = await flagTouches(() => {
      offerMovedNotice();
      openMovedPanel();
      noteMovedExport();
      closeMovedPanel();
      stopMovedReminder();
      expect(movedReminderStopped()).toBe(false);
      expect(writeMovedStopped()).toBe(false);
    });
    expect(touched).toEqual([]);
    expect(toasts()).toEqual([]);
    expect(useMovedPanel.getState().open).toBe(false);
    expect(localStorage.getItem(MOVED_FLAG_KEY)).toBeNull();
  });

  it('waits while work is in progress, and shows once it is over', () => {
    vi.useFakeTimers();
    let busy = true;
    const unregister = registerWorkInProgress('moved-test', () => busy);
    try {
      offerMovedNotice();
      expect(movedToasts()).toHaveLength(0);
      vi.advanceTimersByTime(MOVED_POLL_MS * 3);
      expect(movedToasts()).toHaveLength(0);
      busy = false;
      vi.advanceTimersByTime(MOVED_POLL_MS);
      expect(movedToasts()).toHaveLength(1);
      vi.advanceTimersByTime(MOVED_POLL_MS * 3);
      expect(movedToasts()).toHaveLength(1);
    } finally {
      unregister();
    }
  });

  it('waits while the tour is asked for or playing, and shows once it has ended', () => {
    vi.useFakeTimers();
    requestDemo('intro', 'menu');
    offerMovedNotice();
    vi.advanceTimersByTime(MOVED_POLL_MS * 2);
    expect(movedToasts()).toHaveLength(0);
    clearDemoRequest();
    vi.advanceTimersByTime(MOVED_POLL_MS);
    expect(movedToasts()).toHaveLength(1);
  });

  it('its action opens the panel; closed without exporting, the reminder comes back; after an export in the panel, not in this visit', () => {
    offerMovedNotice();
    act(() => movedToasts()[0].action!.onSelect());
    expect(useMovedPanel.getState().open).toBe(true);
    // (The toast closes itself when its action runs — Toast.tsx; here the store is driven directly.)
    useToastStore.setState({ toasts: [] });
    closeMovedPanel();
    expect(movedToasts()).toHaveLength(1);
    useToastStore.setState({ toasts: [] });
    openMovedPanel();
    noteMovedExport();
    closeMovedPanel();
    expect(movedToasts()).toHaveLength(0);
    // The next visit: shown again (an export is not "don't remind me").
    resetMovedNotice();
    offerMovedNotice();
    expect(movedToasts()).toHaveLength(1);
  });

  it('"Don\'t remind me again" saves the flag (its own key, this shape) and the toast does not come back, this visit or the next', () => {
    offerMovedNotice();
    openMovedPanel();
    stopMovedReminder();
    expect(localStorage.getItem(MOVED_FLAG_KEY)).toBe('{"stopped":true}');
    expect(useMovedPanel.getState().open).toBe(false);
    expect(movedToasts()).toHaveLength(0);
    closeMovedPanel();
    expect(movedToasts()).toHaveLength(0);
    resetMovedNotice();
    offerMovedNotice();
    expect(movedToasts()).toHaveLength(0);
    expect(movedReminderStopped()).toBe(true);
  });

  it.each(['yes', 'true', '{"stopped":"true"}', '{"stopped":1}', '[true]', 'null', '{not json', '{}'])('a malformed flag (%s) is ignored, and left as it is', (raw) => {
    localStorage.setItem(MOVED_FLAG_KEY, raw);
    expect(isStoppedFlag(raw)).toBe(false);
    offerMovedNotice();
    expect(movedToasts()).toHaveLength(1);
    expect(localStorage.getItem(MOVED_FLAG_KEY)).toBe(raw);
  });

  it('a language change while it is up: the same toast in the new language', async () => {
    render(<MovedNoticeHost />);
    expect(movedToasts()).toHaveLength(1);
    await act(() => i18n.changeLanguage('pt'));
    expect(toasts().map((t) => [t.message, t.action?.label])).toEqual([[pt.movedEntry.toast, pt.movedEntry.action]]);
  });
});

describe('the panel (MovedNoticeHost in the shell)', () => {
  it('the toast\'s action opens it: the three steps, the same export as Settings (same file name), a real link, and "Don\'t remind me again"', async () => {
    const createObjectURL = vi.fn(() => 'blob:x');
    Object.assign(URL, { createObjectURL, revokeObjectURL: vi.fn() });
    const downloads: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      downloads.push(this.download);
    });
    render(<><ToastRegion /><MovedNoticeHost /></>);
    const region = screen.getByTestId('toast-region');
    expect(region.textContent).toContain(en.movedEntry.toast);
    fireEvent.click(within(region).getByRole('button', { name: en.movedEntry.action }));

    const panel = await screen.findByRole('dialog', { name: movedEn.title }, { timeout: 8000 });
    for (const key of ['intro', 'step1', 'step3', 'nothingSaved', 'keepsWorking'] as const) expect(panel.textContent).toContain(movedEn[key]);
    expect(within(panel).getAllByRole('listitem')).toHaveLength(3);
    expect(within(panel).getAllByRole('listitem')[1].textContent).toBe(movedEn.step2);
    const link = within(panel).getByRole('link', { name: 'fermatina.com' });
    expect(link.getAttribute('href')).toBe('https://fermatina.com');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');

    fireEvent.click(within(panel).getByRole('button', { name: movedEn.export }));
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(downloads).toHaveLength(1);
    expect(downloads[0]).toMatch(/^fermatina-backup-\d{4}-\d{2}-\d{2}\.json$/);
    expect(toasts().map((t) => t.message)).toContain(en.backup.exported);

    fireEvent.click(within(panel).getByRole('button', { name: movedEn.stop }));
    expect(screen.queryByRole('dialog', { name: movedEn.title })).toBeNull();
    expect(localStorage.getItem(MOVED_FLAG_KEY)).toBe('{"stopped":true}');
    expect(movedToasts()).toHaveLength(0);
  });

  it.each(ELSEWHERE)('on %s it renders nothing and offers nothing', async (elsewhere) => {
    host.value = elsewhere;
    const touched = await flagTouches(() => {
      const { container } = render(<><ToastRegion /><MovedNoticeHost /></>);
      expect(container.querySelector('[data-testid="moved-panel"]')).toBeNull();
    });
    expect(touched).toEqual([]);
    expect(toasts()).toEqual([]);
  });

  it('the exported file is today\'s backup: format "fermata-backup", every saved store', async () => {
    let blob: Blob | null = null;
    Object.assign(URL, { createObjectURL: vi.fn((b: Blob) => { blob = b; return 'blob:x'; }), revokeObjectURL: vi.fn() });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    localStorage.setItem('music-theory-progress', JSON.stringify({ state: { progress: { completedModules: ['l1u1m1'], moduleProgress: {}, exerciseResults: {}, reviewSchedules: {} } }, version: 4 }));
    try {
      render(<><ToastRegion /><MovedNoticeHost /></>);
      fireEvent.click(within(screen.getByTestId('toast-region')).getByRole('button', { name: en.movedEntry.action }));
      fireEvent.click(await screen.findByRole('button', { name: movedEn.export }, { timeout: 8000 }));
      // (jsdom's Blob has no text(): read it as a browser would.)
      const text = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.readAsText(blob!);
      });
      const file = JSON.parse(text);
      expect(file.format).toBe('fermata-backup');
      expect(file.version).toBe(1);
      expect(Object.keys(file.data).sort()).toEqual(['music-theory-app', 'music-theory-progress']);
      expect(file.data).not.toHaveProperty(MOVED_FLAG_KEY);
    } finally {
      localStorage.removeItem('music-theory-progress');
    }
  });
});

describe('Settings → Your data, and the start screen', () => {
  it('Settings shows the moved line with the link on the old address — with the flag set too', () => {
    const { unmount } = render(<SettingsSheet open onClose={() => {}} />);
    const line = screen.getByTestId('settings-moved');
    expect(line.textContent).toBe(movedEn.settingsLine);
    expect(within(line).getByRole('link', { name: 'fermatina.com' }).getAttribute('href')).toBe('https://fermatina.com');
    unmount();
    writeMovedStopped();
    render(<SettingsSheet open onClose={() => {}} />);
    expect(screen.getByTestId('settings-moved').textContent).toBe(movedEn.settingsLine);
  });

  it.each(ELSEWHERE)('Settings on %s: no line', (elsewhere) => {
    host.value = elsewhere;
    render(<SettingsSheet open onClose={() => {}} />);
    expect(screen.queryByTestId('settings-moved')).toBeNull();
    expect(screen.queryByRole('link', { name: 'fermatina.com' })).toBeNull();
  });

  it('the start screen on the old address: the toast\'s sentence as a line in the page, its address a link (PT too)', async () => {
    const { unmount } = render(<StartScreen />);
    const line = screen.getByTestId('start-moved');
    expect(line.textContent).toBe(en.movedEntry.toast);
    expect(within(line).getByRole('link', { name: 'fermatina.com' }).getAttribute('href')).toBe('https://fermatina.com');
    // In the page's flow, in its header, under the tagline and above the tour button.
    expect(line.previousElementSibling?.className).toBe('start-lead');
    expect(line.nextElementSibling?.getAttribute('data-testid')).toBe('start-tour');
    unmount();
    await i18n.changeLanguage('pt');
    render(<StartScreen />);
    expect(screen.getByTestId('start-moved').textContent).toBe(pt.movedEntry.toast);
  });

  it.each(ELSEWHERE)('the start screen on %s: no line', (elsewhere) => {
    host.value = elsewhere;
    render(<StartScreen />);
    expect(screen.queryByTestId('start-moved')).toBeNull();
  });
});
