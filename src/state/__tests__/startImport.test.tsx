/**
 * Bringing a progress file in (2026-11-14: Fermata became Fermatina, at
 * fermatina.com, and progress moves by Export there, Import here).
 *
 * A backup file exactly as the app exports it today (format 'fermata-backup',
 * built from the production-shaped fixtures: the owner's v6 settings from
 * before the start screen, a v4 progress save, a v3 Drill save, fingerings)
 * imports through BOTH ways in — Settings → Your data → Import, and the start
 * screen's "I have a progress file" — and every store comes back byte for
 * byte. The start screen asks nothing first, chooses no door and settles the
 * first-visit gate; a bad file says so by the link and changes nothing.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const { reloadPage } = vi.hoisted(() => ({ reloadPage: vi.fn() }));
vi.mock('../../utils/pageReload', () => ({ reloadPage }));

import i18n from '../../i18n';
import en from '../../i18n/locales/en.json';
import pt from '../../i18n/locales/pt.json';
import settingsV6 from './fixtures/settings-v6-before-start.json';
import drillV3 from './fixtures/drill-v3-before-reading.json';
import { buildBackup, BACKUP_KEYS } from '../../utils/backupHelpers';
import { WELCOME_KEY, shouldShowWelcome } from '../welcomeGate';
import { SettingsSheet } from '../../components/layout/SettingsSheet';
import StartScreen from '../../components/start/StartScreen';

const DONE = ['l1u1m1', 'l1u1m2', 'l1u1m3', 'l1u2m1', 'l1u2m2', 'l2u4m1'];
const FAR = 4102444800000;
/** The stores as production saves them (compact JSON, as zustand writes it). */
const SAVED: Record<(typeof BACKUP_KEYS)[number], string> = {
  'music-theory-app': JSON.stringify(settingsV6),
  'music-theory-progress': JSON.stringify({ state: { progress: {
    completedModules: DONE,
    moduleProgress: { l2u4m2: ['t1'] },
    exerciseResults: Object.fromEntries(DONE.map((id) => [id, { scores: {}, totalAttempts: 2, lastAttemptAt: 1793500000000, passed: true }])),
    reviewSchedules: Object.fromEntries(DONE.map((id, i) => [id, { completedAt: 1790000000000 + i, nextReviewAt: FAR, intervalLevel: 3, reviewCount: 3, lastReviewedAt: 1793000000000 }])),
  } }, version: 4 }),
  'fermata-drill-v1': JSON.stringify(drillV3),
  'fermata-fingering-v1': JSON.stringify({ state: { overrides: {}, labelMode: 'degree' }, version: 1 }),
};

/** Today's export, written out: the envelope Settings → Export downloads (pretty-printed, 2 spaces). */
const TODAYS_FILE = JSON.stringify({
  format: 'fermata-backup',
  version: 1,
  exportedAt: '2026-11-13T21:04:05.000Z',
  data: Object.fromEntries(Object.entries(SAVED).map(([k, v]) => [k, JSON.parse(v)])),
}, null, 2);

const file = (body: string, name = 'fermata-backup-2026-11-13.json') =>
  Object.assign(new File([body], name, { type: 'application/json' }), { text: async () => body });

const allStorage = () => Object.fromEntries(Object.keys(localStorage).sort().map((k) => [k, localStorage.getItem(k)]));

beforeEach(async () => {
  localStorage.clear();
  reloadPage.mockClear();
  await i18n.changeLanguage('en');
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
  // Every test file starts as a learner with an old save (src/test/setup.ts).
  localStorage.setItem('music-theory-app', JSON.stringify({ state: {}, version: 6 }));
});

describe('a backup file as the app exports it today', () => {
  it('is what buildBackup makes of these saves (format "fermata-backup", the four stores)', () => {
    for (const [k, v] of Object.entries(SAVED)) localStorage.setItem(k, v);
    const built = buildBackup(localStorage);
    const today = JSON.parse(TODAYS_FILE);
    expect(built.format).toBe('fermata-backup');
    expect(built.version).toBe(1);
    expect(built.data).toEqual(today.data);
    expect(Object.keys(today.data).sort()).toEqual([...BACKUP_KEYS].sort());
  });

  it('Settings → Your data → Import: asks first, then every store comes back byte for byte', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<SettingsSheet open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('backup-file-input'), { target: { files: [file(TODAYS_FILE)] } });
    await waitFor(() => expect(reloadPage).toHaveBeenCalledTimes(1));
    expect(confirm).toHaveBeenCalledTimes(1);
    for (const [k, v] of Object.entries(SAVED)) expect(localStorage.getItem(k), k).toBe(v);
  });

  it('the start screen\'s "I have a progress file": no question, every store byte for byte, no door chosen, the gate settled', async () => {
    // A first visit: the start screen is up ('pending'), boot has saved its settings.
    localStorage.setItem(WELCOME_KEY, 'pending');
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { language: 'en', lastView: 'explore' }, version: 6 }));
    const confirm = vi.spyOn(window, 'confirm');
    render(<StartScreen />);
    const link = screen.getByRole('button', { name: en.start.progressFile });
    const picker = screen.getByTestId('start-import-input') as HTMLInputElement;
    const opened = vi.spyOn(picker, 'click').mockImplementation(() => {});
    fireEvent.click(link);
    expect(opened).toHaveBeenCalledTimes(1);
    fireEvent.change(picker, { target: { files: [file(TODAYS_FILE)] } });
    await waitFor(() => expect(reloadPage).toHaveBeenCalledTimes(1));
    expect(confirm).not.toHaveBeenCalled();
    for (const [k, v] of Object.entries(SAVED)) expect(localStorage.getItem(k), k).toBe(v);
    // No door: the profile is the file's (none — the owner's), nothing added to his settings.
    expect(JSON.parse(localStorage.getItem('music-theory-app')!).state.learnerProfile).toBeUndefined();
    expect(localStorage.getItem(WELCOME_KEY)).toBe('seen');
    expect(shouldShowWelcome(localStorage)).toBe(false);
    expect(screen.queryByTestId('start-import-error')).toBeNull();
  });

  it('a file with settings only lands in the app too (left "pending", the start screen would come back)', async () => {
    localStorage.setItem(WELCOME_KEY, 'pending');
    const settingsOnly = JSON.stringify({ format: 'fermata-backup', version: 1, exportedAt: '2026-11-13T00:00:00.000Z', data: { 'music-theory-app': settingsV6 } }, null, 2);
    render(<StartScreen />);
    fireEvent.change(screen.getByTestId('start-import-input'), { target: { files: [file(settingsOnly)] } });
    await waitFor(() => expect(reloadPage).toHaveBeenCalledTimes(1));
    expect(localStorage.getItem('music-theory-app')).toBe(SAVED['music-theory-app']);
    expect(shouldShowWelcome(localStorage)).toBe(false);
  });
});

describe('a file that is not a backup, on the start screen', () => {
  const bad: [string, string][] = [
    ['not JSON', '{not json'],
    ['another format', JSON.stringify({ format: 'something-else', version: 1, data: {} })],
    ['a malformed progress section (W9-18)', JSON.stringify({ format: 'fermata-backup', version: 1, exportedAt: '2026-10-30T12:00:00.000Z', data: { 'music-theory-progress': { state: { completedModules: ['l1u1m1'] }, version: 0 } } })],
  ];
  it.each(bad)('%s: the message by the link, in the learner\'s language; nothing changes', async (_name, body) => {
    localStorage.setItem(WELCOME_KEY, 'pending');
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { language: 'pt' }, version: 6 }));
    await i18n.changeLanguage('pt');
    const before = allStorage();
    render(<StartScreen />);
    fireEvent.change(screen.getByTestId('start-import-input'), { target: { files: [file(body)] } });
    const error = await screen.findByTestId('start-import-error');
    expect(error.textContent).toBe(pt.backup.invalidFile);
    expect(error.getAttribute('role')).toBe('alert');
    expect(reloadPage).not.toHaveBeenCalled();
    expect(allStorage()).toEqual(before);
    // Still the start screen's page: the doors are there.
    expect(screen.getByTestId('start-door-new')).toBeTruthy();
  });

  it('the English message names the app; the Portuguese and Spanish ones did not and do not', () => {
    expect(en.backup.invalidFile).toBe('Not a valid Fermatina backup file');
    expect(pt.backup.invalidFile).toBe('Ficheiro de backup inválido');
  });
});
