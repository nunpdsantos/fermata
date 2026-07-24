/**
 * F-09 guard: progress backup export/import round-trips the three persisted
 * stores and rejects malformed files instead of corrupting localStorage.
 */
import { describe, it, expect } from 'vitest';
import {
  BACKUP_KEYS,
  buildBackup,
  validateBackup,
  applyBackup,
} from '../backupHelpers';

function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    dump: () => Object.fromEntries(map),
  };
}

const APP = JSON.stringify({ state: { volume: 0.5 }, version: 6 });
const PROGRESS = JSON.stringify({ state: { completedModules: ['l1u1m1'] }, version: 2 });
const DRILL = JSON.stringify({ state: { facts: {} }, version: 1 });

describe('backupHelpers', () => {
  it('exports every persisted store that exists', () => {
    const storage = fakeStorage({
      'music-theory-app': APP,
      'music-theory-progress': PROGRESS,
      'fermata-drill-v1': DRILL,
    });
    const backup = buildBackup(storage);
    expect(backup.format).toBe('fermata-backup');
    expect(backup.version).toBe(1);
    expect(Object.keys(backup.data).sort()).toEqual([...BACKUP_KEYS].sort());
    expect(backup.data['music-theory-progress']).toEqual(JSON.parse(PROGRESS));
  });

  it('omits stores that have no persisted state yet', () => {
    const storage = fakeStorage({ 'music-theory-app': APP });
    const backup = buildBackup(storage);
    expect(Object.keys(backup.data)).toEqual(['music-theory-app']);
  });

  it('round-trips: applying an exported backup restores identical storage', () => {
    const source = fakeStorage({
      'music-theory-app': APP,
      'music-theory-progress': PROGRESS,
      'fermata-drill-v1': DRILL,
    });
    const backup = buildBackup(source);
    const validated = validateBackup(JSON.parse(JSON.stringify(backup)));
    expect(validated.ok).toBe(true);
    if (!validated.ok) return;

    const target = fakeStorage();
    applyBackup(validated.backup, target);
    expect(target.dump()).toEqual(source.dump());
  });

  it('rejects files that are not fermata backups', () => {
    expect(validateBackup(null).ok).toBe(false);
    expect(validateBackup('nonsense').ok).toBe(false);
    expect(validateBackup({ format: 'other', version: 1, data: {} }).ok).toBe(false);
    expect(validateBackup({ format: 'fermata-backup', version: 99, data: {} }).ok).toBe(false);
    expect(validateBackup({ format: 'fermata-backup', version: 1 }).ok).toBe(false);
  });

  it('rejects backups containing unknown storage keys', () => {
    const result = validateBackup({
      format: 'fermata-backup',
      version: 1,
      exportedAt: 'x',
      data: { 'evil-key': { state: {} } },
    });
    expect(result.ok).toBe(false);
  });

  it('rejects backups whose entries are not persist envelopes', () => {
    const result = validateBackup({
      format: 'fermata-backup',
      version: 1,
      exportedAt: 'x',
      data: { 'music-theory-app': 'not-an-object' },
    });
    expect(result.ok).toBe(false);
  });
});
