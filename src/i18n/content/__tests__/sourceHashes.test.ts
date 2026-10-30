/**
 * W6-14 — an English edit without a translation update fails here.
 *
 * sourceHashes.json records, for every translated English string (curriculum,
 * exercises, templates, songs, level metadata), a hash of the English text the
 * PT and ES translations were last checked against. When the English changes,
 * the hash no longer matches and this test names the entry, shows the new
 * English and the current translation, and says how to clear it:
 *
 *   1. update the PT/ES overlay text;
 *   2. npm run i18n:rehash -- <pt|es|all> <key-prefix>
 *
 * (The 2026-10 audit found 36 overlay blocks per language left stale after
 * English fixes; this is the gate that would have caught them.)
 */
import { describe, it, expect } from 'vitest';
import stored from '../sourceHashes.json';
import { overlayEntries, staleEntries, sourceHash, type StoredHashes, type Entry } from './overlayEntries';

const STORED = stored as StoredHashes;
const entries = overlayEntries();

describe('English-source hashes', () => {
  it('cover a meaningful number of entries', () => {
    expect(entries.length).toBeGreaterThan(5000);
    expect(new Set(entries.map((e) => e.key)).size).toBe(entries.length);
  });

  it('every translation was checked against the current English', () => {
    const stale = staleEntries(entries, STORED);
    const report = stale.slice(0, 25).map(
      (s) =>
        `[${s.lang}] ${s.key} — ${s.reason === 'english-changed' ? 'English changed since the translation was checked' : 'no recorded check (new English entry)'}\n` +
        `    EN now: ${s.en}\n    ${s.lang.toUpperCase()}:     ${s.tr ?? '(missing)'}`,
    );
    const help =
      '\nUpdate the PT/ES overlay text, then record the check:\n' +
      '  npm run i18n:rehash -- <pt|es|all> <key-prefix>   (e.g. all cur:l4u14m1)\n';
    expect(stale.length, `${stale.length} stale translation(s):\n${report.join('\n')}${help}`).toBe(0);
  });

  it('records no orphaned keys (English entries that no longer exist)', () => {
    const keys = new Set(entries.map((e) => e.key));
    expect(Object.keys(STORED).filter((k) => !keys.has(k))).toEqual([]);
  });

  it('the check fires on a planted English edit and on a new entry', () => {
    const planted: Entry[] = entries.slice(0, 3).map((e) => ({ ...e, tr: { ...e.tr } }));
    planted[0] = { ...planted[0], en: `${planted[0].en} (edited)` };
    planted.push({ key: 'cur:planted.new', en: 'A brand-new English sentence', tr: { pt: 'x', es: 'y' } });
    const stale = staleEntries(planted, STORED);
    expect(stale.filter((s) => s.key === planted[0].key).map((s) => s.reason)).toEqual(['english-changed', 'english-changed']);
    expect(stale.filter((s) => s.key === 'cur:planted.new').map((s) => s.reason)).toEqual(['not-recorded', 'not-recorded']);
    expect(stale.filter((s) => s.key === planted[1].key)).toEqual([]);
  });

  it('a per-language record flags only the language that was not re-checked', () => {
    const e = entries[0];
    const split: StoredHashes = { [e.key]: { pt: sourceHash(e.en), es: 'deadbeef' } };
    expect(staleEntries([e], split).map((s) => s.lang)).toEqual(['es']);
  });
});
