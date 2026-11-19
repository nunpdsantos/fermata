/**
 * Respelled, not retired (the British spelling pass, 19 November 2026; the
 * seat's ruling the same day).
 *
 * A saved per-question score stays valid while its id names the same
 * exercise. 60 questions changed identity in the pass only because their
 * words are spelt the British way now ("What defines compound meter?" →
 * "… metre?"): the same exercises, so their scores are KEPT — no version was
 * added to retiredExerciseIds.ts, the progress store stays at version 4.
 * exerciseRespellings.json records, per date, each such id with the
 * fingerprint it had before (`npm run progress:retire -- --respelled`).
 *
 * The proof, id by id and for good: the current English item, re-spelled the
 * American way (respelling.ts: whole words, case kept), has exactly the
 * fingerprint recorded before; and its fingerprint now is the snapshot's.
 * An id retired the ordinary way after its respelling (a later, real change)
 * is out of the proof. Any change but spelling still fails the identity gate
 * (exerciseIdentity.snapshot.test.ts) and still means retirement.
 */
import { describe, expect, it } from 'vitest';
import respellings from './exerciseRespellings.json';
import snapshot from './exerciseIdentities.json';
import { treeItems, fingerprint } from './exerciseFingerprints';
import { americanOriginal, americanSpelling, britishSpots } from './respelling';
import { generateAllForLevel } from '../exerciseGenerator';
import { enExercisesFor, enTemplatesFor } from '../../../i18n/content/__tests__/overlayEntries';
import { PROGRESS_STORE_VERSION } from '../../../state/progressStore';
import { RETIRED_EXERCISE_IDS } from '../../../state/retiredExerciseIds';

type Entry = { progressVersion: number; ids: Record<string, Record<string, string>> };
const ENTRIES = respellings as Record<string, Entry>;
const SNAPSHOT = snapshot as Record<string, Record<string, string>>;
const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const items = treeItems({
  authored: LEVELS.map(enExercisesFor),
  templates: LEVELS.map(enTemplatesFor),
  generateAllForLevel: (c, lang, a) => generateAllForLevel(c, lang, a),
});
const retiredAfter = (version: number) =>
  new Set(RETIRED_EXERCISE_IDS.filter((r) => r.version > version).flatMap((r) => Object.entries(r.ids).flatMap(([m, s]) => s.split(' ').map((x) => m + x))));
const idsOf = (e: Entry) => Object.values(e.ids).flatMap((ids) => Object.keys(ids));

describe('respelled exercises keep their scores (British pass, 19 November 2026)', () => {
  it.each(Object.entries(ENTRIES))('%s: every id, re-spelled the American way, is the exercise recorded before, and is the snapshot\'s now', (_date, entry) => {
    const later = retiredAfter(entry.progressVersion);
    const failures: string[] = [];
    for (const [m, ids] of Object.entries(entry.ids)) {
      for (const [id, before] of Object.entries(ids)) {
        if (later.has(id)) continue; // changed for real later, and retired the ordinary way
        const ex = items[m]?.[id];
        if (!ex) { failures.push(`${id}: no longer served`); continue; }
        if (fingerprint(ex) !== SNAPSHOT[m]?.[id]) failures.push(`${id}: its fingerprint is not the snapshot's`);
        if (!americanOriginal(ex, before)) failures.push(`${id}: re-spelled American it is not ${before} (changed by more than spelling)`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('2026-11-19: exactly the 60 ids of the pass, by level 1 / 5 / 7 / 4 / 11 / 10 / 16 / 6 / 0, none retired, the progress version still 4', () => {
    const entry = ENTRIES['2026-11-19'];
    const ids = idsOf(entry);
    expect(ids.length).toBe(60);
    expect(new Set(ids).size).toBe(60);
    const byLevel = Object.fromEntries(LEVELS.map((n) => [`l${n}`, ids.filter((id) => id.startsWith(`l${n}u`)).length]));
    expect(byLevel).toEqual({ l1: 1, l2: 5, l3: 7, l4: 4, l5: 11, l6: 10, l7: 16, l8: 6, l9: 0 });
    expect(Object.keys(entry.ids).length).toBe(30);
    for (const [m, list] of Object.entries(entry.ids)) for (const id of Object.keys(list)) expect(id.startsWith(m), id).toBe(true);
    expect(entry.progressVersion).toBe(4);
    expect(PROGRESS_STORE_VERSION).toBe(4);
    // No retirement since the version the respelling was made under (v2 / v3 retired older
    // exercises under some of these ids; the scores saved since are the current exercise's).
    expect(Math.max(...RETIRED_EXERCISE_IDS.map((r) => r.version))).toBe(4);
    expect(ids.filter((id) => retiredAfter(entry.progressVersion).has(id))).toEqual([]);
  });

  it('the proof tells spelling from wording: a planted non-spelling change, a planted wrong fingerprint and an unrespelled item all fail', () => {
    const [m, ids] = Object.entries(ENTRIES['2026-11-19'].ids)[0];
    const [id, before] = Object.entries(ids)[0];
    const ex = items[m][id];
    expect(americanOriginal(ex, before)).not.toBeNull();
    // a word that is not spelling
    expect(americanOriginal({ ...ex, prompt: `${ex.prompt} Explain.` }, before)).toBeNull();
    // a fingerprint that is not the one recorded
    expect(americanOriginal(ex, before.replace(/^./, (c) => (c === '0' ? '1' : '0')))).toBeNull();
    // an item with no British word cannot be a respelling
    expect(americanOriginal({ ...ex, prompt: 'Which note is the tonic?' }, before)).toBeNull();
  });

  it('re-spelling is whole words with their case: Metre → Meter, "per cent" → "percent", never inside another word', () => {
    expect(americanSpelling('Compound Metre; colours; per cent; towards; Practise; metronome; centred; analyses')).toBe(
      'Compound Meter; colors; percent; toward; Practice; metronome; centered; analyzes',
    );
    expect(britishSpots('metronome parameter colourist')).toEqual([]);
  });
});
