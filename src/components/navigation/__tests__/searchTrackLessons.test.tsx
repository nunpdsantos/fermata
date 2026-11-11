/**
 * Cmd+K keeps the level lessons first for a learner without a track — the
 * seat's decision S-4 (wave 2 final review).
 *
 * Wave 2 put the fifteen track lessons in MODULE_INDEX, and for the owner (no
 * learner profile) they took the four lesson slots from level lessons he
 * found on main: for "key", three of the four hits were track lessons
 * (l1u3m2, l1u35m1, l1u35m3, l1u35m8). The rule:
 * - no profile, or 'theory': the lesson hits are main's — the lessons that
 *   are not track lessons, ranked as before, up to four; a track lesson
 *   appears only in a slot they leave empty, after them;
 * - 'new' / 'player': the learner's own track ranks as it does now, among the
 *   level lessons; the other track follows the first rule.
 * Nothing else in search changes.
 *
 * The expectations are built HERE, without getResults: the unchanged
 * `findModulesByQuery` is run over MODULE_INDEX with the rows this file
 * filters out itself (`rankOver`). Main's index was today's minus the track
 * rows (`git diff main -- src/data/moduleIndex.ts` adds only those), so for
 * the owner that IS main's behaviour.
 */
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { getResults } from '../quickSearchResults';
import { QuickSearch } from '../QuickSearch';
import { MODULE_INDEX, findModulesByQuery } from '../../../data/moduleIndex';
import { loadModuleIndex, type LocalizedModuleIndex } from '../../../data/moduleIndexI18n';
import { TRACKS } from '../../../data/tracks';
import { useAppStore } from '../../../state/store';
import type { LearnerProfile } from '../../../state/storeTypes';

// Mock framer-motion to render plain HTML (same pattern as QuickSearch.test).
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  function makeMotion(tag: string) {
    return function MotionProxy(props: Record<string, unknown>) {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
      }
      return React.createElement(tag, clean);
    };
  }
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => makeMotion(prop) });
  return {
    motion: proxy,
    m: proxy,
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    domAnimation: {},
  };
});

afterEach(() => {
  cleanup();
  useAppStore.setState({ learnerProfile: null, quickSearchOpen: false });
});

type Lang = 'en' | 'pt' | 'es';
const LESSON_SLOTS = 4;
const RESULT_CAP = 10;

// The tracks' lessons, read from the contract's id lists (not through the
// helpers the code under test uses).
const SOUND = new Set(TRACKS.sound.moduleIds);
const CHORDS = new Set(TRACKS.chords.moduleIds);
const isTrackLesson = (id: string) => SOUND.has(id) || CHORDS.has(id);
const ownTrack = (profile: LearnerProfile | null): ReadonlySet<string> =>
  profile === 'new' ? SOUND : profile === 'player' ? CHORDS : new Set();

/** findModulesByQuery over MODULE_INDEX with only the rows `keep` accepts. */
function rankOver(keep: (id: string) => boolean, q: string, limit: number, loc: LocalizedModuleIndex | null): string[] {
  const all = MODULE_INDEX.slice();
  MODULE_INDEX.splice(0, MODULE_INDEX.length, ...all.filter((e) => keep(e.id)));
  try {
    return findModulesByQuery(q, limit, loc).map((m) => m.id);
  } finally {
    MODULE_INDEX.splice(0, MODULE_INDEX.length, ...all);
  }
}

/** The lesson hits the rule asks for, before the ten-result cap. */
function expectedLessonIds(q: string, loc: LocalizedModuleIndex | null, profile: LearnerProfile | null): string[] {
  const own = ownTrack(profile);
  const first = rankOver((id) => !isTrackLesson(id) || own.has(id), q, LESSON_SLOTS, loc);
  const fill = rankOver((id) => isTrackLesson(id) && !own.has(id), q, LESSON_SLOTS - first.length, loc);
  return [...first, ...fill];
}

let pt: LocalizedModuleIndex;
let es: LocalizedModuleIndex;
const index = (lang: Lang): LocalizedModuleIndex | null => (lang === 'pt' ? pt : lang === 'es' ? es : null);

/** Lesson title (as search shows it in `lang`) → module id. */
const titleToId = new Map<Lang, Map<string, string>>();

beforeAll(async () => {
  pt = (await loadModuleIndex('pt'))!;
  es = (await loadModuleIndex('es'))!;
  for (const lang of ['en', 'pt', 'es'] as const) {
    const loc = index(lang);
    const map = new Map(MODULE_INDEX.map((e) => [loc?.titles[e.id]?.[0] ?? e.title, e.id]));
    // A title names one lesson in each language, so a label maps back to its id exactly.
    expect(map.size, `${lang}: duplicate lesson titles`).toBe(MODULE_INDEX.length);
    titleToId.set(lang, map);
  }
});

/** What Cmd+K shows: the lesson hits as ids, and how many results come before them. */
function shown(q: string, lang: Lang, profile: LearnerProfile | null) {
  const results = getResults(q, index(lang), profile);
  const lessons = results.filter((r) => r.type === 'Lesson');
  const before = results.length - lessons.length;
  // The lessons come after every other result, as before.
  expect(results.slice(before).every((r) => r.type === 'Lesson'), `${lang} "${q}"`).toBe(true);
  const ids = lessons.map((r) => titleToId.get(lang)!.get(r.label) ?? `?${r.label}`);
  return { ids, before, others: results.slice(0, before).map((r) => `${r.type}:${r.label}`) };
}

// At least thirty queries per language: the ones the brief names, the same
// ideas in Portuguese and Spanish, and words from the track lessons' titles.
const QUERIES: Record<Lang, string[]> = {
  en: [
    'key', 'chord', 'scale', 'capo', 'seventh', 'minor', 'blues', 'pentatonic', 'numbers', 'home',
    'major', 'triad', 'interval', 'note', 'notes', 'half step', 'whole step', 'step', 'low', 'high',
    'three notes', 'melody', 'solo', 'outside', 'away', 'relative', 'song', 'five', 'four', 'every',
    'sound', 'letters', 'ladder', 'inside', 'cadence', 'dominant', 'mode', 'rhythm', 'a chord',
    'major and minor', 'one note', 'other keys', 'your chords', 'seven', 'ear',
  ],
  pt: [
    'tonalidade', 'acorde', 'escala', 'capo', 'sétima', 'menor', 'blues', 'pentatónica', 'números', 'casa',
    'maior', 'tríade', 'intervalo', 'nota', 'notas', 'meio-tom', 'tom', 'grave', 'agudo', 'três notas',
    'melodia', 'solo', 'fora', 'relativa', 'música', 'cinco', 'quatro', 'escada', 'letras', 'dentro',
    'cadência', 'dominante', 'modo', 'ritmo', 'um acorde', 'maior e menor', 'uma nota', 'os teus acordes', 'sete',
  ],
  es: [
    'tonalidad', 'acorde', 'escala', 'capo', 'séptima', 'menor', 'blues', 'pentatónica', 'números', 'casa',
    'mayor', 'tríada', 'intervalo', 'nota', 'notas', 'semitono', 'tono', 'grave', 'agudo', 'tres notas',
    'melodía', 'solo', 'fuera', 'relativa', 'canción', 'cinco', 'cuatro', 'escalera', 'letras', 'dentro',
    'cadencia', 'dominante', 'modo', 'ritmo', 'un acorde', 'mayor y menor', 'una nota', 'tus acordes', 'siete',
  ],
};
// Each language's queries with its own index; English terms in PT / ES too
// (the lessons quote English queries, and search reads both).
const CASES: Array<[Lang, string]> = [
  ...(['en', 'pt', 'es'] as const).flatMap((lang) => QUERIES[lang].map((q) => [lang, q] as [Lang, string])),
  ...(['pt', 'es'] as const).flatMap((lang) => QUERIES.en.map((q) => [lang, q] as [Lang, string])),
];

function checkEveryQuery(profile: LearnerProfile | null) {
  const wrong: string[] = [];
  for (const [lang, q] of CASES) {
    const { ids, before } = shown(q, lang, profile);
    const want = expectedLessonIds(q, index(lang), profile).slice(0, Math.max(0, RESULT_CAP - before));
    if (ids.join(' ') !== want.join(' ')) wrong.push(`${lang} "${q}": shows [${ids.join(' ')}], want [${want.join(' ')}]`);
  }
  expect(wrong, wrong.join('\n')).toEqual([]);
}

describe('the track ids this file filters are in the index', () => {
  it('all fifteen, so the filtering is not vacuous', () => {
    const ids = new Set(MODULE_INDEX.map((e) => e.id));
    expect(SOUND.size + CHORDS.size).toBe(15);
    expect([...SOUND, ...CHORDS].filter((id) => !ids.has(id))).toEqual([]);
    expect(QUERIES.en.length).toBeGreaterThanOrEqual(30);
    expect(QUERIES.pt.length).toBeGreaterThanOrEqual(30);
    expect(QUERIES.es.length).toBeGreaterThanOrEqual(30);
  });
});

describe('a learner without a track (no profile — the owner — or "theory"): the lesson hits are main\'s', () => {
  it('"key" shows the four level lessons of main, no track lesson (it showed l1u3m2 l1u35m1 l1u35m3 l1u35m8)', () => {
    expect(rankOver(() => true, 'key', 4, null)).toEqual(['l1u3m2', 'l1u35m1', 'l1u35m3', 'l1u35m8']);
    expect(shown('key', 'en', null).ids).toEqual(['l1u3m2', 'l2u4m1', 'l2u5m3', 'l4u14m5']);
    expect(shown('key', 'en', 'theory').ids).toEqual(['l1u3m2', 'l2u4m1', 'l2u5m3', 'l4u14m5']);
  });

  it('a track lesson still fills a slot no level lesson takes, after them ("capo", "home", "numbers", "half step")', () => {
    expect(shown('capo', 'en', null).ids).toEqual(['l1u35m8']);
    expect(shown('home', 'en', null).ids).toEqual(['l1u35m4']);
    expect(shown('numbers', 'en', null).ids).toEqual(['l7u23m1', 'l1u33m1', 'l8u27m1', 'l1u35m8']);
    expect(shown('half step', 'en', null).ids).toEqual(['l1u1m3', 'l1u34m3', 'l1u35m5']);
  });

  for (const profile of [null, 'theory'] as const) {
    it(`${profile ?? 'no profile'}: over every query (EN, PT, ES), main's level lessons first, then only track lessons in slots left empty`, () => {
      checkEveryQuery(profile);
    });
  }

  it('the query list really has both cases: track lessons pushed out by level lessons, and track lessons filling empty slots', () => {
    let pushedOut = 0;
    let filling = 0;
    for (const [lang, q] of CASES) {
      const level = rankOver((id) => !isTrackLesson(id), q, LESSON_SLOTS, index(lang));
      const everything = rankOver(() => true, q, LESSON_SLOTS, index(lang));
      if (everything.some(isTrackLesson) && everything.join() !== level.join() && level.length === LESSON_SLOTS) pushedOut++;
      if (level.length < LESSON_SLOTS && rankOver(isTrackLesson, q, 1, index(lang)).length > 0) filling++;
    }
    expect(pushedOut).toBeGreaterThanOrEqual(10);
    expect(filling).toBeGreaterThanOrEqual(10);
  });
});

describe('a learner on a track: their own track ranks as it does now, the other track follows the first rule', () => {
  /** Where `id` ranked among the lesson hits before this change (the whole index, four slots). */
  const rankBefore = (q: string, lang: Lang, id: string) => rankOver(() => true, q, LESSON_SLOTS, index(lang)).indexOf(id);

  it('player: "outside" / "fora" / "fuera" and "melody" (named by the chords track\'s titles) return that lesson where it ranked, ahead of the level lesson', () => {
    for (const [lang, q] of [['en', 'outside'], ['pt', 'fora'], ['es', 'fuera']] as Array<[Lang, string]>) {
      const { ids } = shown(q, lang, 'player');
      expect(ids, `${lang} "${q}"`).toEqual(['l1u35m10', 'l7u22m4']);
      expect(ids.indexOf('l1u35m10')).toBe(rankBefore(q, lang, 'l1u35m10'));
      // …where the owner gets the level lesson first.
      expect(shown(q, lang, null).ids, `${lang} "${q}" (owner)`).toEqual(['l7u22m4', 'l1u35m10']);
    }
    expect(shown('melody', 'en', 'player').ids).toEqual(['l1u35m9', 'l3u11m4']);
    expect(shown('melody', 'en', null).ids).toEqual(['l3u11m4', 'l1u35m9']);
  });

  it('player: a sound-track lesson goes after the level lessons ("three notes")', () => {
    expect(rankOver(() => true, 'three notes', 4, null)).toEqual(['l1u34m5', 'l1u3m4']);
    expect(shown('three notes', 'en', 'player').ids).toEqual(['l1u3m4', 'l1u34m5']);
  });

  it('new: "three notes" / "três notas" / "tres notas" and "low" (named by the sound track\'s titles) return that lesson where it ranked; the chords track goes after', () => {
    for (const [lang, q] of [['en', 'three notes'], ['pt', 'três notas'], ['es', 'tres notas']] as Array<[Lang, string]>) {
      const { ids } = shown(q, lang, 'new');
      expect(ids, `${lang} "${q}"`).toEqual(['l1u34m5', 'l1u3m4']);
      expect(ids.indexOf('l1u34m5')).toBe(rankBefore(q, lang, 'l1u34m5'));
    }
    // "High and Low": the sound lesson keeps first place; "Major and Minor:
    // One Note" (chords track, "a half step lower") moves behind the level lessons.
    expect(rankOver(() => true, 'low', 4, null)).toEqual(['l1u34m1', 'l1u35m5', 'l6u18m1', 'l9u32m3']);
    expect(shown('low', 'en', 'new').ids).toEqual(['l1u34m1', 'l6u18m1', 'l9u32m3', 'l1u35m5']);
    expect(shown('low', 'en', null).ids).toEqual(['l6u18m1', 'l9u32m3', 'l1u34m1', 'l1u35m5']);
    expect(shown('grave', 'es', 'new').ids).toEqual(['l1u34m1', 'l7u22m4']);
    expect(shown('grave', 'es', null).ids).toEqual(['l7u22m4', 'l1u34m1']);
  });

  for (const profile of ['player', 'new'] as const) {
    it(`${profile}: over every query (EN, PT, ES), the lesson hits follow the rule exactly`, () => {
      checkEveryQuery(profile);
    });
  }
});

describe('nothing else in search changes', () => {
  it('the results above the lessons are the same for every profile, and there are never more than ten', () => {
    const differ: string[] = [];
    for (const [lang, q] of CASES) {
      const owner = shown(q, lang, null);
      for (const profile of ['theory', 'new', 'player'] as const) {
        const other = shown(q, lang, profile);
        if (other.others.join('|') !== owner.others.join('|')) differ.push(`${lang} "${q}" ${profile}`);
        expect(other.before + other.ids.length).toBeLessThanOrEqual(RESULT_CAP);
      }
    }
    expect(differ, differ.join('\n')).toEqual([]);
  });

  it('lesson hits keep their localized titles', () => {
    const lessons = getResults('fora', pt, 'player').filter((r) => r.type === 'Lesson').map((r) => r.label);
    expect(lessons).toEqual([pt.titles.l1u35m10[0], pt.titles.l7u22m4[0]]);
  });
});

describe('Quick Search ranks for the learner in the store', () => {
  const lessonRows = () =>
    screen.queryAllByRole('button')
      .map((b) => b.textContent ?? '')
      .filter((text) => text.endsWith('Lesson'))
      .map((text) => text.slice(0, -'Lesson'.length));
  const title = (id: string) => MODULE_INDEX.find((e) => e.id === id)!.title;

  it('the owner (no profile) sees main\'s lessons for "key"; once the profile says player, the chords track is among them', () => {
    useAppStore.setState({ learnerProfile: null, language: 'en', quickSearchOpen: true });
    render(<QuickSearch />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'key' } });
    expect(lessonRows()).toEqual(['l1u3m2', 'l2u4m1', 'l2u5m3', 'l4u14m5'].map(title));

    act(() => useAppStore.setState({ learnerProfile: 'player' }));
    expect(lessonRows()).toEqual(['l1u3m2', 'l1u35m1', 'l1u35m3', 'l1u35m8'].map(title));
  });
});
