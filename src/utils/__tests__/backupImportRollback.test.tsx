/**
 * A backup import that fails half-way (audit A15, 2026-11-18): a valid file,
 * and the browser's storage refuses one of the writes (full — the
 * QuotaExceededError every browser throws). Until this fix the sections
 * written before the failure stayed (new settings beside old progress), the
 * rest did not, nothing was put back and nothing was said.
 *
 * Now the import keeps the previous state until every section is written:
 * it notes what each key held, writes them all, and on any failure puts every
 * key back exactly as it was (removing a key that did not exist) and says so
 * plainly, in the learner's language — the matrix below fails each write in
 * turn, through both ways in (Settings → Your data → Import, and the start
 * screen's "I have a progress file"), and checks every old byte is back.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const { reloadPage } = vi.hoisted(() => ({ reloadPage: vi.fn() }));
vi.mock('../pageReload', () => ({ reloadPage }));

import i18n from '../../i18n';
import settingsV6 from '../../state/__tests__/fixtures/settings-v6-before-start.json';
import drillV3 from '../../state/__tests__/fixtures/drill-v3-before-reading.json';
import { applyBackup, BACKUP_KEYS, type FermataBackup } from '../backupHelpers';
import { WELCOME_KEY } from '../../state/welcomeGate';
import { useToastStore } from '../../state/toastStore';
import { SettingsSheet } from '../../components/layout/SettingsSheet';
import StartScreen from '../../components/start/StartScreen';

type Key = (typeof BACKUP_KEYS)[number];
const FAR = 4102444800000;
const progress = (done: string[], version = 4) => JSON.stringify({ state: { progress: {
  completedModules: done,
  moduleProgress: { l2u4m2: ['t1'] },
  exerciseResults: Object.fromEntries(done.map((id) => [id, { scores: {}, totalAttempts: 2, lastAttemptAt: 1793500000000, passed: true }])),
  reviewSchedules: Object.fromEntries(done.map((id, i) => [id, { completedAt: 1790000000000 + i, nextReviewAt: FAR, intervalLevel: 3, reviewCount: 3, lastReviewedAt: 1793000000000 }])),
} }, version });

/** What this browser holds before the import (production-shaped; no fingering save yet). */
const OLD: Partial<Record<Key, string>> = {
  'music-theory-app': JSON.stringify(settingsV6),
  'music-theory-progress': progress(['l1u1m1', 'l1u1m2']),
  'fermata-drill-v1': JSON.stringify(drillV3),
};
/** The file: other settings, more progress, a fresh drill memory, fingerings. */
const NEW: Record<Key, Record<string, unknown>> = {
  'music-theory-app': { ...settingsV6, state: { ...settingsV6.state, themeMode: 'fermata-night', instrument: 'guitar' } },
  'music-theory-progress': JSON.parse(progress(['l1u1m1', 'l1u1m2', 'l1u1m3', 'l1u2m1'])),
  'fermata-drill-v1': { state: { ...drillV3.state, lifetime: { answered: 999, correct: 900 } }, version: 3 },
  'fermata-fingering-v1': { state: { overrides: {}, labelMode: 'note' }, version: 1 },
};
const BACKUP: FermataBackup = { format: 'fermata-backup', version: 1, exportedAt: '2026-11-18T10:00:00.000Z', data: NEW };
const FILE = JSON.stringify(BACKUP, null, 2);
const file = (body: string) => Object.assign(new File([body], 'fermatina-backup-2026-11-18.json', { type: 'application/json' }), { text: async () => body });

const allStorage = () => Object.fromEntries(Object.keys(localStorage).sort().map((k) => [k, localStorage.getItem(k)]));
const quota = () => new DOMException('The quota has been exceeded.', 'QuotaExceededError');

/**
 * The browser's storage, refusing the n-th write of a backup section (1-based,
 * in the file's order). Writes that put an old value back go through, unless
 * `refuseRestore` names that key.
 */
function storageFullAt(n: number, refuseRestore: Key[] = []) {
  const real = Storage.prototype.setItem;
  let imports = 0;
  return vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
    const k = key as Key;
    if (BACKUP_KEYS.includes(k) && value === JSON.stringify(NEW[k])) {
      imports += 1;
      if (imports === n) throw quota();
    } else if (refuseRestore.includes(k) && value === OLD[k]) {
      throw quota();
    }
    return real.call(this, key, value);
  });
}

beforeEach(async () => {
  localStorage.clear();
  for (const [k, v] of Object.entries(OLD)) localStorage.setItem(k, v);
  localStorage.setItem(WELCOME_KEY, 'seen');
  reloadPage.mockClear();
  useToastStore.setState({ toasts: [] });
  await i18n.changeLanguage('en');
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
  localStorage.setItem('music-theory-app', JSON.stringify({ state: {}, version: 6 }));
});

describe('applyBackup: all sections or none', () => {
  it('a healthy import writes every section, byte for byte as the file holds it, and says so', () => {
    const result = applyBackup(BACKUP, localStorage);
    expect(result).toEqual({ ok: true });
    for (const k of BACKUP_KEYS) expect(localStorage.getItem(k)).toBe(JSON.stringify(NEW[k]));
  });

  it.each([1, 2, 3, 4])('storage full on write %i of 4: every key is back exactly as it was (a key that did not exist is gone again)', (n) => {
    const before = allStorage();
    storageFullAt(n);
    const result = applyBackup(BACKUP, localStorage);
    expect(result).toMatchObject({ ok: false, restored: true });
    expect(allStorage()).toEqual(before);
    expect(localStorage.getItem('fermata-fingering-v1')).toBeNull();
  });

  it('when even putting the old data back fails, it says which sections could not be put back', () => {
    storageFullAt(3, ['music-theory-app']);
    const result = applyBackup(BACKUP, localStorage);
    expect(result).toMatchObject({ ok: false, restored: false, notRestored: ['music-theory-app'] });
    // The others are back.
    expect(localStorage.getItem('music-theory-progress')).toBe(OLD['music-theory-progress']);
  });
});

describe('Settings → Your data → Import, storage full half-way', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    it.each([1, 2, 3, 4])(`${lang}: write %i refused — nothing changed, no reload, and one plain sentence`, async (n) => {
      await i18n.changeLanguage(lang);
      const before = allStorage();
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      render(<SettingsSheet open onClose={() => {}} />);
      storageFullAt(n);
      fireEvent.change(screen.getByTestId('backup-file-input'), { target: { files: [file(FILE)] } });
      await waitFor(() => expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual([i18n.t('backupFile.importFailed')]));
      expect(useToastStore.getState().toasts[0].type).toBe('error');
      expect(i18n.t('backupFile.importFailed')).not.toBe('backupFile.importFailed');
      expect(reloadPage).not.toHaveBeenCalled();
      expect(allStorage()).toEqual(before);
    });
  }

  it('the old data could not all be put back: the sentence names the sections', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<SettingsSheet open onClose={() => {}} />);
    storageFullAt(2, ['music-theory-app']);
    fireEvent.change(screen.getByTestId('backup-file-input'), { target: { files: [file(FILE)] } });
    const expected = i18n.t('backupFile.importFailedPartly', { count: 1, sections: i18n.t('backup.section.preferences') });
    await waitFor(() => expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual([expected]));
    expect(expected).toContain(i18n.t('backup.section.preferences'));
    expect(reloadPage).not.toHaveBeenCalled();
  });
});

describe('the start screen\'s "I have a progress file", storage full half-way', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    it.each([1, 2])(`${lang}: write %i refused — the sentence by the link, nothing changed, no reload`, async (n) => {
      await i18n.changeLanguage(lang);
      localStorage.setItem(WELCOME_KEY, 'pending');
      for (const k of ['music-theory-progress', 'fermata-drill-v1']) localStorage.removeItem(k);
      const before = allStorage();
      render(<StartScreen />);
      storageFullAt(n);
      fireEvent.change(screen.getByTestId('start-import-input'), { target: { files: [file(FILE)] } });
      const error = await screen.findByTestId('start-import-error');
      expect(error.textContent).toBe(i18n.t('backupFile.importFailed'));
      expect(reloadPage).not.toHaveBeenCalled();
      expect(allStorage()).toEqual(before);
      expect(localStorage.getItem(WELCOME_KEY)).toBe('pending');
    });
  }
});
