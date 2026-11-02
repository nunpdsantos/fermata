/**
 * B2 (W4b review): Learn borrows the instrument (D-20, W9-02), and a reload or
 * a closed tab in the middle of a lesson must not turn the lesson's selection
 * into Explore's. Before the fix the original lived only in a module variable
 * while the main store saved the LESSON's key and scale, so after a reload the
 * reopened lesson recorded its own selection as "Explore's" and gave that back.
 *
 * A reload (or a new tab) is simulated faithfully: fresh module instances —
 * a new store that hydrates from the same localStorage, a new lesson
 * instrument with no memory of the old page.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Note, ScaleType } from '../../core/types/music';

const APP_KEY = 'music-theory-app';
const F_SHARP: Note = { natural: 'F', accidental: '#' };
const C: Note = { natural: 'C', accidental: '' };

/** A fresh page over the same localStorage: new store, new lesson instrument. */
async function openPage() {
  vi.resetModules();
  const { useAppStore, invalidAppStateFields } = await import('../../state/store');
  const lesson = await import('../lessonInstrument');
  const { executeTheoryQuery } = await import('../../utils/queryExecutor');
  const selection = () => {
    const s = useAppStore.getState();
    return { key: s.selectedKey, scale: s.selectedScale };
  };
  return { useAppStore, invalidAppStateFields, executeTheoryQuery, selection, ...lesson };
}

/** What the main store has saved for the next boot. */
function saved(): { key: unknown; scale: unknown; raw: Record<string, unknown> } {
  const raw = JSON.parse(localStorage.getItem(APP_KEY)!).state as Record<string, unknown>;
  return { key: raw.selectedKey, scale: raw.selectedScale, raw };
}

const FS_MELODIC_MINOR = { key: F_SHARP, scale: 'melodic_minor' as ScaleType };

/** Explore on F# melodic minor, saved. */
async function exploreOnFSharpMelodicMinor() {
  const page = await openPage();
  const s = page.useAppStore.getState();
  s.setView('explore');
  s.setKey(F_SHARP);
  s.setScale('melodic_minor');
  expect(saved()).toMatchObject(FS_MELODIC_MINOR);
  return page;
}

/** Open a lesson: the app lands in Learn and the lesson shows its query. */
function inLesson(page: Awaited<ReturnType<typeof openPage>>, query = 'C major scale') {
  page.useAppStore.getState().setView('learn');
  expect(page.showLessonQuery(query)).toBe(true);
}

beforeEach(() => {
  localStorage.clear();
});

describe('a reload or a closed tab mid-lesson keeps Explore\'s selection (B2)', () => {
  it('reload mid-lesson (twice): the reopened lesson borrows Explore\'s selection, and leaving Learn gives it back', async () => {
    const first = await exploreOnFSharpMelodicMinor();
    inLesson(first);
    expect(first.selection()).toEqual({ key: C, scale: 'major' }); // the lesson has the instrument

    // Reload: the app boots, the lesson reopens and shows its query again.
    const second = await openPage();
    expect(second.selection()).toEqual(FS_MELODIC_MINOR); // the boot has Explore's own selection
    inLesson(second);
    expect(second.selection()).toEqual({ key: C, scale: 'major' });

    // Reload again, in the same lesson.
    const third = await openPage();
    inLesson(third, 'G major scale');
    expect(third.selection()).toEqual({ key: { natural: 'G', accidental: '' }, scale: 'major' });
    third.useAppStore.getState().setView('explore');
    expect(third.selection()).toEqual(FS_MELODIC_MINOR);
    expect(third.isLessonInstrumentBorrowed()).toBe(false);
    expect(saved()).toMatchObject(FS_MELODIC_MINOR);
  });

  it('a closed tab (or a saved lesson that has expired) boots on Explore\'s selection — Explore, Drill or Learn\'s overview alike', async () => {
    const first = await exploreOnFSharpMelodicMinor();
    inLesson(first, 'D major scale');
    // The tab is closed. Nothing at boot has to give anything back: the save
    // already holds Explore's selection, whatever became of the saved lesson.
    for (const view of ['explore', 'drill', 'learn'] as const) {
      const next = await openPage();
      next.useAppStore.getState().setView(view);
      expect(next.selection()).toEqual(FS_MELODIC_MINOR);
      expect(next.isLessonInstrumentBorrowed()).toBe(false);
    }
  });

  it('the save never holds the lesson\'s selection — not while it is borrowed, not for a moment while it is given back', async () => {
    const page = await exploreOnFSharpMelodicMinor();
    const writes: { key: unknown; scale: unknown }[] = [];
    const setItem = Storage.prototype.setItem;
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, k: string, v: string) {
      if (k === APP_KEY) {
        const s = JSON.parse(v).state;
        writes.push({ key: s.selectedKey, scale: s.selectedScale });
      }
      setItem.call(this, k, v);
    });
    try {
      inLesson(page, 'C major scale');
      page.showLessonQuery('D major chord');
      page.showLessonQuery('key of G');
      page.showLessonQuery('A natural minor scale');
      page.useAppStore.getState().setView('explore');
    } finally {
      spy.mockRestore();
    }
    expect(writes.length).toBeGreaterThan(3);
    expect(writes.filter((w) => JSON.stringify(w) !== JSON.stringify(FS_MELODIC_MINOR))).toEqual([]);
    expect(page.selection()).toEqual(FS_MELODIC_MINOR);
  });

  it('"Open in Explore" after a reload keeps the lesson\'s selection: the loan is released and the save follows it', async () => {
    const first = await exploreOnFSharpMelodicMinor();
    inLesson(first);
    const page = await openPage();
    inLesson(page);

    // InlineTryThis: keepLessonInstrument(), then the executor as before.
    page.keepLessonInstrument();
    expect(page.isLessonInstrumentBorrowed()).toBe(false);
    expect(page.useAppStore.getState().lessonLoan).toBeNull();
    expect(saved()).toMatchObject({ key: C, scale: 'major' }); // the original is no longer kept
    expect(page.executeTheoryQuery('C major scale')).toBe('scale');
    expect(page.useAppStore.getState().view).toBe('explore');
    expect(page.selection()).toEqual({ key: C, scale: 'major' });

    const after = await openPage();
    expect(after.selection()).toEqual({ key: C, scale: 'major' });
  });

  it('the loan itself is never saved; a hand-edited one in the save is dropped, never trusted (localStorage is user-editable)', async () => {
    const page = await exploreOnFSharpMelodicMinor();
    inLesson(page);
    expect(page.useAppStore.getState().lessonLoan).toEqual(FS_MELODIC_MINOR);
    expect(saved().raw).not.toHaveProperty('lessonLoan');

    for (const loan of [
      { key: { natural: 'E', accidental: '' }, scale: 'dorian' }, // well-formed — still never read from a save
      { key: { natural: 'H', accidental: 'x' }, scale: 'no_such_scale' },
      'garbage',
      42,
    ]) {
      localStorage.setItem(APP_KEY, JSON.stringify({ state: { selectedKey: F_SHARP, selectedScale: 'melodic_minor', lastView: 'explore', lessonLoan: loan }, version: 6 }));
      const next = await openPage();
      expect(next.useAppStore.getState().lessonLoan).toBeNull();
      expect(next.isLessonInstrumentBorrowed()).toBe(false);
      next.useAppStore.getState().setScale('major'); // any change saves
      expect(saved()).toMatchObject({ key: F_SHARP, scale: 'major' });
      expect(saved().raw).not.toHaveProperty('lessonLoan');
      // A backup carrying one is refused before import, like any other field the guard drops.
      expect(next.invalidAppStateFields({ selectedKey: F_SHARP, lessonLoan: loan })).toEqual(['lessonLoan']);
    }
  });
});
