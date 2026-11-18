/**
 * An export that looks successful but is not (audit A16, 2026-11-18). Until
 * this fix a saved section that was not JSON was left out of the file without
 * a word, and a section that was JSON of the wrong shape went into the file,
 * which the importer then refused whole; both ended on "Backup downloaded".
 *
 * Now the assembled file is checked with the importer's own check
 * (`validateBackup`) before anything is said; a damaged section is named to
 * the learner; what can be recovered is kept: the store's own reading of it
 * (what the app shows), or what its own guard rescues record by record, and
 * the damaged text itself, as it was, under `damaged` (which the importer
 * ignores, so the file always imports). A healthy export is byte for byte
 * today's.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const { reloadPage } = vi.hoisted(() => ({ reloadPage: vi.fn() }));
vi.mock('../pageReload', () => ({ reloadPage }));

import i18n from '../../i18n';
import settingsV6 from '../../state/__tests__/fixtures/settings-v6-before-start.json';
import drillV3 from '../../state/__tests__/fixtures/drill-v3-before-reading.json';
import { BACKUP_KEYS, validateBackup } from '../backupHelpers';
import { useToastStore } from '../../state/toastStore';
import { SettingsSheet } from '../../components/layout/SettingsSheet';

type Key = (typeof BACKUP_KEYS)[number];
const FAR = 4102444800000;
const DONE = ['l1u1m1', 'l1u1m2', 'l1u1m3'];
const PROGRESS = { progress: {
  completedModules: DONE,
  moduleProgress: { l2u4m2: ['t1'] },
  exerciseResults: Object.fromEntries(DONE.map((id) => [id, { scores: {}, totalAttempts: 2, lastAttemptAt: 1793500000000, passed: true }])),
  reviewSchedules: Object.fromEntries(DONE.map((id, i) => [id, { completedAt: 1790000000000 + i, nextReviewAt: FAR, intervalLevel: 3, reviewCount: 3, lastReviewedAt: 1793000000000 }])),
} };
/** The stores as production saves them (compact JSON, as zustand writes them). */
const SAVED: Record<Key, string> = {
  'music-theory-app': JSON.stringify(settingsV6),
  'music-theory-progress': JSON.stringify({ state: PROGRESS, version: 4 }),
  'fermata-drill-v1': JSON.stringify(drillV3),
  'fermata-fingering-v1': JSON.stringify({ state: { overrides: {}, labelMode: 'degree' }, version: 1 }),
};
const NOW = new Date('2026-11-18T09:30:00.000Z');
/** Today's export of these saves, as the code at 6de6c0e writes it (2-space JSON). */
const TODAYS_FILE = JSON.stringify({
  format: 'fermata-backup', version: 1, exportedAt: NOW.toISOString(),
  data: Object.fromEntries(Object.entries(SAVED).map(([k, v]) => [k, JSON.parse(v)])),
}, null, 2);

let files: Blob[] = [];
const readBlob = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(reader.error);
  reader.readAsText(blob);
});

async function exportFromSettings(): Promise<string> {
  render(<SettingsSheet open onClose={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: i18n.t('backup.export') }));
  await waitFor(() => expect(files).toHaveLength(1));
  await waitFor(() => expect(useToastStore.getState().toasts.length).toBeGreaterThan(0));
  return readBlob(files[0]);
}
const toasts = () => useToastStore.getState().toasts.map((t) => ({ type: t.type, message: t.message }));

/** A page load: every store reads what this browser holds now (as the app does on opening). */
async function loadApp() {
  const [{ useProgressStore }, { useDrillStore }, { useFingeringStore }, { useAppStore }] = await Promise.all([
    import('../../state/progressStore'), import('../../state/drillStore'), import('../../state/fingeringStore'), import('../../state/store'),
  ]);
  const stores = [useProgressStore, useDrillStore, useFingeringStore, useAppStore] as const;
  // A page starts from each store's initial state (a save that is not JSON leaves it there), then reads.
  const held = Object.fromEntries(Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)!]));
  for (const store of stores) (store.setState as (s: unknown, replace: true) => void)(store.getInitialState(), true);
  localStorage.clear();
  for (const [k, v] of Object.entries(held)) localStorage.setItem(k, v);
  for (const store of stores) await store.persist.rehydrate();
  return { useProgressStore };
}

beforeEach(async () => {
  localStorage.clear();
  for (const [k, v] of Object.entries(SAVED)) localStorage.setItem(k, v);
  useToastStore.setState({ toasts: [] });
  files = [];
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
  (URL as unknown as { createObjectURL: (b: Blob) => string }).createObjectURL = vi.fn((b: Blob) => { files.push(b); return 'blob:backup'; });
  (URL as unknown as { revokeObjectURL: () => void }).revokeObjectURL = vi.fn();
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  await i18n.changeLanguage('en');
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  localStorage.clear();
  localStorage.setItem('music-theory-app', JSON.stringify({ state: {}, version: 6 }));
});

describe('a healthy export', () => {
  it('is byte for byte today\'s file, and says "Backup downloaded"', async () => {
    await loadApp();
    const text = await exportFromSettings();
    expect(text).toBe(TODAYS_FILE);
    expect(toasts()).toEqual([{ type: 'success', message: i18n.t('backup.exported') }]);
    expect(screen.queryByTestId('data-note')).toBeNull();
  });
});

describe('a damaged save', () => {
  it('progress that is not JSON: the file still imports, holds every other section as today, keeps the damaged text, and the learner is told which part is missing', async () => {
    localStorage.setItem('music-theory-progress', '{"state":{"progress":{"completedModules":["l1u1m1"');
    await loadApp();
    const text = await exportFromSettings();
    const file = JSON.parse(text);
    expect((await validateBackup(file)).ok).toBe(true);
    expect(Object.keys(file.data).sort()).toEqual(['fermata-drill-v1', 'fermata-fingering-v1', 'music-theory-app']);
    for (const k of Object.keys(file.data)) expect(JSON.stringify(file.data[k])).toBe(SAVED[k as Key]);
    expect(file.damaged).toEqual({ 'music-theory-progress': '{"state":{"progress":{"completedModules":["l1u1m1"' });
    const line = i18n.t('backupFile.exportedWithout', { count: 1, sections: i18n.t('backup.section.learnProgress') });
    expect(toasts()).toEqual([{ type: 'warning', message: line }]);
    // The open sheet covers the toasts: the same sentence stands in the sheet, by the buttons.
    const notes = await screen.findAllByTestId('data-note');
    expect(notes.map((n) => [n.textContent, n.getAttribute('role')])).toEqual([[line, 'alert']]);
  });

  it('progress that is JSON of the wrong shape: the importer accepts the file (it used to refuse it whole), the section is named and its text kept', async () => {
    const bad = JSON.stringify({ state: { progress: { completedModules: 'l1u1m1', moduleProgress: {} } }, version: 4 });
    localStorage.setItem('music-theory-progress', bad);
    await loadApp();
    const text = await exportFromSettings();
    const file = JSON.parse(text);
    expect(await validateBackup(file)).toMatchObject({ ok: true });
    expect(file.data['music-theory-progress']).toBeUndefined();
    expect(file.damaged).toEqual({ 'music-theory-progress': bad });
    expect(toasts()).toEqual([{ type: 'warning', message: i18n.t('backupFile.exportedWithout', { count: 1, sections: i18n.t('backup.section.learnProgress') }) }]);
  });

  it('Drill memory with one broken record: the file holds every good record (the store\'s own rescue), and the part is named as partly damaged', async () => {
    const drill = JSON.parse(SAVED['fermata-drill-v1']);
    const good = Object.keys(drill.state.items);
    expect(good.length).toBeGreaterThan(0);
    drill.state.items['broken-card'] = { card: { due: 'tomorrow' }, history: [], tier: 'new' };
    const raw = JSON.stringify(drill);
    localStorage.setItem('fermata-drill-v1', raw);
    await loadApp();
    const file = JSON.parse(await exportFromSettings());
    expect((await validateBackup(file)).ok).toBe(true);
    expect(Object.keys(file.data['fermata-drill-v1'].state.items).sort()).toEqual(good.sort());
    for (const id of good) expect(file.data['fermata-drill-v1'].state.items[id]).toEqual(JSON.parse(SAVED['fermata-drill-v1']).state.items[id]);
    expect(file.damaged).toEqual({ 'fermata-drill-v1': raw });
    expect(toasts()).toEqual([{ type: 'warning', message: i18n.t('backupFile.exportedPartly', { count: 1, sections: i18n.t('backup.section.drillProgress') }) }]);
  });

  it('progress damaged AFTER the app read it: the file holds the progress the app is showing (its live store)', async () => {
    const { useProgressStore } = await loadApp();
    expect(useProgressStore.getState().progress.completedModules).toEqual(DONE);
    localStorage.setItem('music-theory-progress', 'garbage');
    const file = JSON.parse(await exportFromSettings());
    expect((await validateBackup(file)).ok).toBe(true);
    expect(file.data['music-theory-progress'].state).toEqual(PROGRESS);
    expect(file.damaged).toEqual({ 'music-theory-progress': 'garbage' });
    expect(toasts()).toEqual([{ type: 'warning', message: i18n.t('backupFile.exportedPartly', { count: 1, sections: i18n.t('backup.section.learnProgress') }) }]);
  });

  it('two parts damaged, one beyond reading: two lines, each naming its parts', async () => {
    localStorage.setItem('music-theory-progress', '[]');
    localStorage.setItem('fermata-fingering-v1', JSON.stringify({ state: { overrides: { 'not-a-key': 3 }, labelMode: 'degree' }, version: 1 }));
    await loadApp();
    const file = JSON.parse(await exportFromSettings());
    expect((await validateBackup(file)).ok).toBe(true);
    expect(Object.keys(file.damaged).sort()).toEqual(['fermata-fingering-v1', 'music-theory-progress']);
    expect(file.data['fermata-fingering-v1']).toEqual({ state: { overrides: {}, labelMode: 'degree' }, version: 1 });
    expect(toasts()).toEqual([
      { type: 'warning', message: i18n.t('backupFile.exportedWithout', { count: 1, sections: i18n.t('backup.section.learnProgress') }) },
      { type: 'warning', message: i18n.t('backupFile.exportedPartly', { count: 1, sections: i18n.t('backup.section.guitarFingerings') }) },
    ]);
  });

  for (const lang of ['pt', 'es'] as const) {
    it(`${lang}: the line is in the learner's language`, async () => {
      await i18n.changeLanguage(lang);
      localStorage.setItem('music-theory-progress', 'garbage');
      await loadApp();
      await exportFromSettings();
      const message = i18n.t('backupFile.exportedWithout', { count: 1, sections: i18n.t('backup.section.learnProgress') });
      expect(message).not.toContain('backupFile');
      expect(message).toContain(i18n.t('backup.section.learnProgress'));
      expect(toasts()).toEqual([{ type: 'warning', message }]);
    });
  }
});
