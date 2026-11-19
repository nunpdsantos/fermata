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
import { HISTORY_RECORD_KEY, recordForgotten } from '../../state/savedPlace';

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

/**
 * A refused import leaves the tab's place alone (review 3 of the Back stream, F1): the entry exactly as it
 * was (view, screen, layer), this tab's record of entries as it was, and a later pagehide still writes the
 * record (the history module listens here: SettingsSheet's Sheet imports it). Only a WRITTEN import may name
 * the imported save's place (state/savedPlace.ts `placeFromSave`).
 */
const PLACED = { fm: 1, i: 3, v: 'drill', s: 'mastery', l: 1 };
const RECORD = '[[3,"drill","mastery"]]';
function placeTab() {
  window.history.replaceState(PLACED, '');
  sessionStorage.setItem(HISTORY_RECORD_KEY, RECORD);
}
function expectPlaceUntouched() {
  expect(window.history.state).toEqual(PLACED);
  expect(sessionStorage.getItem(HISTORY_RECORD_KEY)).toBe(RECORD);
  expect(recordForgotten()).toBe(false);
  sessionStorage.removeItem(HISTORY_RECORD_KEY);
  window.dispatchEvent(new Event('pagehide'));
  expect(sessionStorage.getItem(HISTORY_RECORD_KEY), 'a later pagehide writes the record').not.toBeNull();
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
  window.history.replaceState(null, '');
  sessionStorage.clear();
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

  it('a key that did not exist, WRITTEN and then rolled back, is removed again (not left holding the backup\'s version)', () => {
    localStorage.removeItem('music-theory-progress'); // the second key in the file: written before the failure
    const before = allStorage();
    storageFullAt(3);
    const spy = vi.mocked(Storage.prototype.setItem);
    const result = applyBackup(BACKUP, localStorage);
    // Known positive: the progress section really was written before the third write failed.
    expect(spy.mock.calls.some(([k, v]) => k === 'music-theory-progress' && v === JSON.stringify(NEW['music-theory-progress']))).toBe(true);
    expect(result).toMatchObject({ ok: false, restored: true });
    expect(localStorage.getItem('music-theory-progress')).toBeNull();
    expect(allStorage()).toEqual(before);
  });

  it('when even putting the old data back fails, it says which sections could not be put back', () => {
    storageFullAt(3, ['music-theory-app']);
    const result = applyBackup(BACKUP, localStorage);
    expect(result).toMatchObject({ ok: false, restored: false, notRestored: ['music-theory-app'] });
    // The others are back.
    expect(localStorage.getItem('music-theory-progress')).toBe(OLD['music-theory-progress']);
  });

  it('a key that refused BOTH the write and the putting back still holds its old data: it is read back, and not reported as coming from the backup (second fix pass)', () => {
    const before = allStorage();
    storageFullAt(2, ['music-theory-progress']); // progress: its write refused, then its restore refused too
    const result = applyBackup(BACKUP, localStorage);
    expect(result).toEqual({ ok: false, restored: true, notRestored: [] });
    expect(allStorage()).toEqual(before);
  });

  it('the review\'s storage: a key that refuses every write, beside two that take them', () => {
    const mem = new Map([['music-theory-app', 'OLD-APP'], ['music-theory-progress', 'OLD-PROGRESS'], ['fermata-drill-v1', 'OLD-DRILL']]);
    const storage = {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => { if (k === 'music-theory-progress') throw quota(); mem.set(k, v); },
      removeItem: (k: string) => { mem.delete(k); },
    };
    const backup = { format: 'fermata-backup', version: 1, exportedAt: 'x', data: { 'music-theory-app': { a: 1 }, 'music-theory-progress': { b: 2 }, 'fermata-drill-v1': { c: 3 } } } as unknown as FermataBackup;
    expect(applyBackup(backup, storage)).toEqual({ ok: false, restored: true, notRestored: [] });
    expect(Object.fromEntries(mem)).toEqual({ 'music-theory-app': 'OLD-APP', 'music-theory-progress': 'OLD-PROGRESS', 'fermata-drill-v1': 'OLD-DRILL' });
  });
});

describe('a key that cannot even be read back (third review)', () => {
  /** progress refuses every write, and refuses to be read once the import began. */
  function unreadable() {
    const mem = new Map([['music-theory-app', 'OLD-APP'], ['music-theory-progress', 'OLD-PROGRESS']]);
    let reads = 0;
    return {
      mem,
      storage: {
        getItem: (k: string) => { if (k === 'music-theory-progress' && ++reads > 1) throw new DOMException('denied', 'SecurityError'); return mem.get(k) ?? null; },
        setItem: (k: string, v: string) => { if (k === 'music-theory-progress') throw quota(); mem.set(k, v); },
        removeItem: (k: string) => { mem.delete(k); },
      },
    };
  }
  const backup = { format: 'fermata-backup', version: 1, exportedAt: 'x', data: { 'music-theory-app': { a: 1 }, 'music-theory-progress': { b: 2 } } } as unknown as FermataBackup;

  it('its state is unknown: never listed as coming from the backup', () => {
    const { storage, mem } = unreadable();
    expect(applyBackup(backup, storage)).toEqual({ ok: false, restored: false, notRestored: [], unknown: ['music-theory-progress'] });
    expect(mem.get('music-theory-app')).toBe('OLD-APP');
  });

  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: the sentence says so in its own sentence, and never that the part comes from the backup`, async () => {
      await i18n.changeLanguage(lang);
      const { importFailedText } = await import('../backupFile');
      const part = i18n.t('backup.section.learnProgress');
      const text = importFailedText({ ok: false, restored: false, notRestored: [], unknown: ['music-theory-progress'] });
      expect(text).toBe([i18n.t('backupFile.importNotInFull'), i18n.t('backupFile.importUnknown', { count: 1, sections: part }), i18n.t('backupFile.importRestAsItWas')].join(' '));
      expect(text).toContain(part);
      expect(text).not.toContain(i18n.t('backupFile.importFromBackup', { count: 1, sections: part }));
      const both = importFailedText({ ok: false, restored: false, notRestored: ['music-theory-app'], unknown: ['music-theory-progress'] });
      expect(both).toContain(i18n.t('backupFile.importFromBackup', { count: 1, sections: i18n.t('backup.section.preferences') }));
      expect(both).toContain(i18n.t('backupFile.importUnknown', { count: 1, sections: part }));
    });
  }
});

describe('Settings → Your data → Import, storage full half-way', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    it.each([1, 2, 3, 4])(`${lang}: write %i refused — nothing changed, no reload, and one plain sentence`, async (n) => {
      await i18n.changeLanguage(lang);
      const before = allStorage();
      placeTab();
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      render(<SettingsSheet open onClose={() => {}} />);
      storageFullAt(n);
      fireEvent.change(screen.getByTestId('backup-file-input'), { target: { files: [file(FILE)] } });
      await waitFor(() => expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual([i18n.t('backupFile.importFailed')]));
      expect(useToastStore.getState().toasts[0].type).toBe('error');
      expect(i18n.t('backupFile.importFailed')).not.toBe('backupFile.importFailed');
      // The open sheet covers the toasts: the same sentence stands in the sheet, by the buttons.
      expect(screen.getAllByTestId('data-note').map((n) => [n.textContent, n.getAttribute('role')])).toEqual([[i18n.t('backupFile.importFailed'), 'alert']]);
      expect(reloadPage).not.toHaveBeenCalled();
      expect(allStorage()).toEqual(before);
      expectPlaceUntouched();
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
      placeTab();
      render(<StartScreen />);
      storageFullAt(n);
      fireEvent.change(screen.getByTestId('start-import-input'), { target: { files: [file(FILE)] } });
      const error = await screen.findByTestId('start-import-error');
      expect(error.textContent).toBe(i18n.t('backupFile.importFailed'));
      expect(reloadPage).not.toHaveBeenCalled();
      expect(allStorage()).toEqual(before);
      expect(localStorage.getItem(WELCOME_KEY)).toBe('pending');
      expectPlaceUntouched();
    });
  }
});
