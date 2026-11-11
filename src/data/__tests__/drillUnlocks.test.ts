/**
 * What a lesson unlocks in Drill (wave 2, "Drill follows the lessons"):
 * the table's ids, unlockedFor for nothing / a track / a level / everything,
 * course order, and — for the seat to read — five sample questions each row
 * lets through, in English (printed; every admitted item is also checked
 * against the row by its fields).
 */
import { describe, it, expect } from 'vitest';
import i18n from '../../i18n';
import { generateDrillBank } from '../../core/utils/drillBank';
import { DRILL_FAMILIES, type DrillItem } from '../../core/types/drill';
import { MODULE_INDEX } from '../moduleIndex';
import { TRACKS, TRACK_IDS } from '../tracks';
import { DRILL_FAMILY_TO_MODULE } from '../drillFamilyToModule';
import {
  TRACK_UNLOCKS,
  LEVEL_COURSE_ORDER,
  unlockedFor,
  isItemUnlocked,
  nothingUnlocked,
  openFamilies,
  nextUnlock,
  lessonOpening,
  learnTargetOf,
  lessonIdsNamed,
} from '../drillUnlocks';
import { itemPrompt, choiceLabel } from '../../components/drill/drillText';

const BANK = generateDrillBank({ includeRead: true });
const INDEX_IDS = new Set(MODULE_INDEX.map((m) => m.id));
const TRACK_LESSONS = new Set(TRACK_IDS.flatMap((id) => TRACKS[id].moduleIds));

const admitted = (completed: string[]) => {
  const unlock = unlockedFor(completed);
  return BANK.filter((item) => isItemUnlocked(unlock, item));
};

function answerText(item: DrillItem): string {
  const a = item.answer;
  switch (a.kind) {
    case 'choice': return choiceLabel(item, a.correct, i18n.t, 'en');
    case 'notes': return a.notes.join(' ');
    case 'accidentals': return a.spelled.join(' ');
    case 'rootQuality': return `${a.root} ${a.quality}`;
    case 'fretPitch': return `midi ${a.midi}`;
  }
}

describe('the table names real lessons', () => {
  it('every id is in MODULE_INDEX (the nine levels) or in tracks.ts', () => {
    for (const id of lessonIdsNamed()) {
      expect(INDEX_IDS.has(id) || TRACK_LESSONS.has(id), id).toBe(true);
    }
  });

  it('every track row belongs to the lesson of a track (none to the nine levels)', () => {
    for (const id of Object.keys(TRACK_UNLOCKS)) expect(TRACK_LESSONS.has(id), id).toBe(true);
  });

  it('course order: MODULE_INDEX order, without the optional unit, the tracks or Level 9', () => {
    expect(LEVEL_COURSE_ORDER[0]).toBe('l1u1m1');
    expect(LEVEL_COURSE_ORDER.some((id) => id.startsWith('l1u33'))).toBe(false);
    expect(LEVEL_COURSE_ORDER.some((id) => id.startsWith('l9'))).toBe(false);
    expect(LEVEL_COURSE_ORDER.some((id) => TRACK_LESSONS.has(id))).toBe(false);
    expect(LEVEL_COURSE_ORDER.at(-1)).toBe('l8u27m5');
    const indexOrder = MODULE_INDEX.map((m) => m.id).filter((id) => LEVEL_COURSE_ORDER.includes(id));
    expect(LEVEL_COURSE_ORDER).toEqual(indexOrder);
    // Every family's own lesson is in it (Level 1–3).
    for (const family of DRILL_FAMILIES) expect(LEVEL_COURSE_ORDER).toContain(DRILL_FAMILY_TO_MODULE[family]);
  });
});

describe('unlockedFor', () => {
  it('nothing completed: nothing open, no item admitted', () => {
    const unlock = unlockedFor([]);
    expect(nothingUnlocked(unlock)).toBe(true);
    expect(openFamilies(unlock)).toEqual([]);
    expect(admitted([])).toEqual([]);
  });

  it('an unknown id, an optional lesson or a Level 9 lesson opens nothing', () => {
    expect(nothingUnlocked(unlockedFor(['nope', 'l1u33m3', 'l9u32m5']))).toBe(true);
  });

  it('a track lesson (l1u34m5): only triads, only C G F major and A E D minor chords', () => {
    const items = admitted(['l1u34m5']);
    expect(items.length).toBe(12); // 6 chords × (spell, name)
    for (const item of items) {
      expect(item.family).toBe('triad');
      expect(['C:major', 'G:major', 'F:major', 'A:minor', 'E:minor', 'D:minor']).toContain(`${item.chord!.root}:${item.chord!.quality}`);
    }
    expect(openFamilies(unlockedFor(['l1u34m5']))).toEqual([{ family: 'triad', whole: false }]);
  });

  it('a level lesson opens its family whole, and every family whose lesson comes earlier', () => {
    const unlock = unlockedFor(['l2u7m3']); // The Four Triad Types
    expect([...unlock.whole].sort()).toEqual(['circle', 'degree', 'interval', 'keysig', 'read', 'scale', 'triad']);
    const triads = BANK.filter((i) => i.family === 'triad');
    expect(admitted(['l2u7m3']).filter((i) => i.family === 'triad')).toEqual(triads);
    expect(admitted(['l2u7m3']).some((i) => i.family === 'seventh' || i.family === 'roman' || i.family === 'function')).toBe(false);
  });

  it('a later lesson in course order opens what comes before it (l2u7m4 → triad, not roman)', () => {
    const unlock = unlockedFor(['l2u7m4']);
    expect(unlock.whole.has('triad')).toBe(true);
    expect(unlock.whole.has('roman')).toBe(false); // l2u7m5
  });

  it('a level lesson supersedes a track row of the same family', () => {
    const unlock = unlockedFor(['l1u34m5', 'l2u7m3']);
    expect(unlock.rows.some((r) => r.family === 'triad')).toBe(false);
    expect(unlock.whole.has('triad')).toBe(true);
  });

  it('everything completed: the whole bank', () => {
    const all = [...MODULE_INDEX.map((m) => m.id), ...TRACK_LESSONS];
    expect(admitted(all)).toEqual(BANK);
    expect(openFamilies(unlockedFor(all)).every((f) => f.whole)).toBe(true);
    expect(nextUnlock(all, TRACKS.chords)).toBeNull();
  });

  it('both tracks done: only the rows, never a whole family', () => {
    const unlock = unlockedFor([...TRACK_LESSONS]);
    expect(unlock.whole.size).toBe(0);
    // Integration: no track lesson opens `function` (its words are not taught there).
    expect(new Set(unlock.rows.map((r) => r.family))).toEqual(new Set(['scale', 'triad', 'roman', 'seventh']));
  });
});

describe('what comes next, and where a lesson lives', () => {
  it('the sound track: scales with l1u34m4, then triads with l1u34m5, then the levels', () => {
    expect(nextUnlock([], TRACKS.sound)).toEqual({ moduleId: 'l1u34m4', families: ['scale'] });
    expect(nextUnlock(['l1u34m4'], TRACKS.sound)).toEqual({ moduleId: 'l1u34m5', families: ['triad'] });
    expect(nextUnlock(['l1u34m4', 'l1u34m5'], TRACKS.sound)).toEqual({ moduleId: 'l1u1m1', families: ['read'] });
  });

  it('the chords track: Roman numerals with l1u35m2; m3 widens them', () => {
    expect(nextUnlock([], TRACKS.chords)).toEqual({ moduleId: 'l1u35m2', families: ['roman'] });
    expect(nextUnlock(['l1u35m2'], TRACKS.chords)).toEqual({ moduleId: 'l1u35m3', families: ['roman'] });
  });

  it('a level lesson that makes a part-open family whole counts as opening more', () => {
    // Sound track done (scale and triad part-open), then Level 1 and the first
    // Level 2 lessons: the next lesson named is the one that opens every
    // scale, not one further on.
    const done = ['l1u34m4', 'l1u34m5', 'l1u1m1', 'l1u3m3', 'l2u4m1', 'l2u4m2'];
    expect(nextUnlock(done, TRACKS.sound)).toEqual({ moduleId: 'l2u5m1', families: ['scale'] });
    expect(nextUnlock([...done, 'l2u5m1'], TRACKS.sound)?.families).toContain('triad');
  });

  it('no track: the first level lesson that opens a family', () => {
    expect(nextUnlock([], null)).toEqual({ moduleId: 'l1u1m1', families: ['read'] });
    expect(nextUnlock(['l1u1m1'], null)).toEqual({ moduleId: 'l1u3m3', families: ['interval'] });
  });

  it('the lesson that opens a family: the track\'s first, else the level lesson', () => {
    expect(lessonOpening('seventh', TRACKS.chords)).toBe('l1u35m7');
    expect(lessonOpening('seventh', TRACKS.sound)).toBe('l3u9m1');
    expect(lessonOpening('keysig', null)).toBe('l2u4m1');
  });

  it('learnTargetOf: a track lesson lives in its track\'s unit; a level lesson in MODULE_INDEX', () => {
    expect(learnTargetOf('l1u34m4')).toEqual({ levelId: 'l1', unitId: 'u34', moduleId: 'l1u34m4' });
    expect(learnTargetOf('l2u7m3')).toEqual({ levelId: 'l2', unitId: 'u7', moduleId: 'l2u7m3' });
    expect(learnTargetOf('nope')).toBeNull();
  });
});

/**
 * Each row pinned from outside the table: the exact count and the exact keys,
 * chords, degrees and kinds of question its items have. Widening a row (a
 * major 7th, a vii°, another key) or narrowing it fails here.
 */
describe('each row, pinned', () => {
  const values = (items: DrillItem[], f: (i: DrillItem) => string | number | undefined) =>
    [...new Set(items.map(f).filter((v) => v !== undefined))].map(String).sort();
  const signature = (lesson: string) => {
    const items = admitted([lesson]);
    return {
      count: items.length,
      families: values(items, (i) => i.family),
      keys: values(items, (i) => i.key),
      chords: values(items, (i) => (i.chord ? `${i.chord.root}:${i.chord.quality}` : undefined)),
      degrees: values(items, (i) => i.degree),
      prompts: values(items, (i) => i.promptKey.replace('drill.prompts.', '')),
    };
  };
  const OPEN_CHORDS = ['A:major', 'A:minor', 'C:major', 'D:major', 'D:minor', 'E:major', 'E:minor', 'G:major'];
  const EXPECTED: Record<string, ReturnType<typeof signature>> = {
    l1u34m4: { count: 14, families: ['scale'], keys: ['C', 'G'], chords: [], degrees: [], prompts: ['degreeOf', 'spellScale'] },
    l1u34m5: {
      count: 12, families: ['triad'], keys: [], degrees: [], prompts: ['nameChord', 'spellChord'],
      chords: ['A:minor', 'C:major', 'D:minor', 'E:minor', 'F:major', 'G:major'],
    },
    l1u35m2: { count: 30, families: ['roman'], keys: ['A', 'C', 'D', 'E', 'G'], chords: [], degrees: ['1', '4', '5'], prompts: ['chordToDegree', 'degreeToChord'] },
    l1u35m3: { count: 36, families: ['roman'], keys: ['C', 'D', 'G'], chords: [], degrees: ['1', '2', '3', '4', '5', '6'], prompts: ['chordToDegree', 'degreeToChord'] },
    l1u35m6: { count: 16, families: ['triad'], keys: [], chords: OPEN_CHORDS, degrees: [], prompts: ['nameChord', 'spellChord'] },
    l1u35m7: {
      count: 10, families: ['seventh'], keys: [], degrees: [], prompts: ['nameChord', 'spellChord'],
      chords: ['A:dominant7', 'C:dominant7', 'D:dominant7', 'E:dominant7', 'G:dominant7'],
    },
    l1u35m9: { count: 21, families: ['scale'], keys: ['C', 'D', 'G'], chords: [], degrees: [], prompts: ['degreeOf', 'spellScale'] },
  };

  it('the table has exactly these rows', () => {
    expect(Object.keys(TRACK_UNLOCKS).sort()).toEqual(Object.keys(EXPECTED).sort());
  });

  for (const lesson of Object.keys(EXPECTED)) {
    it(`${lesson} lets through exactly what it was fixed to`, () => {
      expect(signature(lesson)).toEqual(EXPECTED[lesson]);
    });
  }

  it('no track lesson, nor both tracks together, reaches what waits for the levels', () => {
    const items = admitted([...TRACK_LESSONS]);
    // No vii° (diminished) in Roman numerals or harmonic function.
    expect(items.some((i) => (i.family === 'roman' || i.family === 'function') && i.degree === 7)).toBe(false);
    // No minor 7th, major 7th, half-diminished or diminished seventh (integration: the lesson builds only the dominant 7th).
    expect(items.some((i) => i.family === 'seventh' && i.chord!.quality !== 'dominant7')).toBe(false);
    // No "is it diatonic?", no patterns, no cadences, no "V7 of".
    expect(items.some((i) => i.family === 'roman' && !['drill.prompts.degreeToChord', 'drill.prompts.chordToDegree'].includes(i.promptKey))).toBe(false);
    // No harmonic function at all (integration: the track never teaches its words).
    expect(items.some((i) => i.family === 'function')).toBe(false);
    // No minor key anywhere (lower-case key = minor), and nothing outside the tracks' four families.
    expect(items.some((i) => i.key !== undefined && /^[a-g]/.test(i.key))).toBe(false);
    expect(new Set(items.map((i) => i.family))).toEqual(new Set(['scale', 'triad', 'roman', 'seventh']));
  });
});

describe('each row, read against the items it lets through', () => {
  for (const [lesson, rows] of Object.entries(TRACK_UNLOCKS)) {
    it(`${lesson}: admits items that match the row exactly, and prints five`, () => {
      const items = admitted([lesson]);
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        const row = rows.find((r) => r.family === item.family)!;
        expect(row).toBeDefined();
        if (row.keys) expect(row.keys).toContain(item.key);
        if (row.chords) expect(row.chords.some((c) => c.root === item.chord?.root && c.quality === item.chord?.quality)).toBe(true);
        if (row.degrees) expect(row.degrees).toContain(item.degree);
        if (row.prompts) expect(row.prompts).toContain(item.promptKey);
      }
      // Every key / chord / degree the row names reaches at least one item
      // (a row never promises what the bank does not ask).
      for (const row of rows) {
        const mine = items.filter((i) => i.family === row.family);
        for (const key of row.keys ?? []) expect(mine.some((i) => i.key === key), `${lesson} key ${key}`).toBe(true);
        for (const c of row.chords ?? []) {
          expect(mine.some((i) => i.chord?.root === c.root && i.chord.quality === c.quality), `${lesson} ${c.root}${c.quality}`).toBe(true);
        }
        for (const d of row.degrees ?? []) expect(mine.some((i) => i.degree === d), `${lesson} degree ${d}`).toBe(true);
      }
      // Spread over the rows' items (offset by k so the same slot of each key is not picked five times).
      const step = Math.max(1, Math.floor(items.length / 5));
      const sample = [0, 1, 2, 3, 4].map((k) => items[Math.min(items.length - 1, k * step + k)]);
      const lines = sample.map((item) => `    ${itemPrompt(item, i18n.t, 'en')}  →  ${answerText(item)}`);
      console.log(`[drill unlocks] ${lesson} (${items.length} items):\n${lines.join('\n')}`);
    });
  }
});
