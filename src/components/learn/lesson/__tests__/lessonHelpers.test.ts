import { describe, it, expect, beforeEach } from 'vitest';
import { L9_PAIRS, pairsWithLevel } from '../levelPairs';
import { conceptForQuestion } from '../rereadSection';
import { tryThisPicture } from '../tryThisPicture';
import { EN_UNITS } from '../../../../i18n/content/__tests__/overlayEntries';
import { showLessonQuery, returnLessonInstrument, keepLessonInstrument, isLessonInstrumentBorrowed } from '../../../../services/lessonInstrument';
import { foldDockForLesson, openDockForLesson, foldDockAfterLesson } from '../../../../services/lessonDock';
import { executeTheoryQuery } from '../../../../utils/queryExecutor';
import { useAppStore } from '../../../../state/store';

const levelText = (n: number) => EN_UNITS[n].flatMap((u) => u.modules).map((m) => `${m.title} ${m.objectives.join(' ')} ${m.concepts.map((c) => `${c.title} ${c.explanation}`).join(' ')}`).join(' ').toLowerCase();

describe('Level 9 "pairs with Level n" (D-10, W4-17)', () => {
  it('every Level 9 module has a pairing, and only those', () => {
    const l9 = EN_UNITS[9].flatMap((u) => u.modules.map((m) => m.id)).sort();
    expect(Object.keys(L9_PAIRS).sort()).toEqual(l9);
    expect(pairsWithLevel('l1u1m1')).toBeNull();
    expect(pairsWithLevel('l9u31m2', 'pt')).toEqual({ level: 7, title: 'Jazz, Pop e Harmonia Modal' });
  });

  it('evidence: the paired level teaches the theory, and no earlier level does (modes, pentatonic/blues, secondary dominants)', () => {
    // Mentioned anywhere in a level's lessons…
    const firstMentioned = (re: RegExp) => [1, 2, 3, 4, 5, 6, 7, 8].find((n) => re.test(levelText(n)));
    expect(firstMentioned(/\bdorian\b/)).toBe(L9_PAIRS.l9u31m2);
    expect(firstMentioned(/\bpentatonic\b|\bblues scale\b/)).toBe(L9_PAIRS.l9u31m3);
    // …or the subject of one of its lessons (a module title).
    const firstLesson = (re: RegExp) => [1, 2, 3, 4, 5, 6, 7, 8].find((n) => EN_UNITS[n].some((u) => u.modules.some((m) => re.test(m.title.toLowerCase()))));
    expect(firstLesson(/secondary dominants/)).toBe(L9_PAIRS.l9u32m2);
    expect(firstLesson(/seventh chords/)).toBe(L9_PAIRS.l9u31m5);
    expect(firstLesson(/cadences/)).toBe(L9_PAIRS.l9u32m3);
    expect(firstLesson(/texture/)).toBe(L9_PAIRS.l9u32m5);
    expect(firstLesson(/triad types/)).toBe(L9_PAIRS.l9u31m4);
  });
});

describe('Re-read › goes to the concept a question is about', () => {
  const mod = (id: string) => EN_UNITS[1].flatMap((u) => u.modules).find((m) => m.id === id)!;
  it('real lessons', () => {
    const staff = mod('l1u1m1'); // 0 five-line staff · 1 treble and bass clef
    expect(conceptForQuestion('Which clef curls around the G line? The treble clef', staff)).toBe(1);
    expect(conceptForQuestion('How many lines does a staff have? Five horizontal lines', staff)).toBe(0);
    const values = mod('l1u2m1'); // 0 durations · 1 rests · 2 dots and ties
    expect(conceptForQuestion('A dotted half note lasts how many beats? The dot adds half', values)).toBe(2);
    expect(conceptForQuestion('What is a rest? Measured silence', values)).toBe(1);
  });
  it('nothing in common → the first concept', () => {
    expect(conceptForQuestion('zzz qqq', mod('l1u1m1'))).toBe(0);
  });
});

describe('Try This in place shows what the executor would select', () => {
  const C = { natural: 'C', accidental: '' } as const;
  it('a scale up to its octave, a key as its scale, a chord stacked, the circle as nothing', () => {
    const s = tryThisPicture('G major scale', C);
    expect(s.kind === 'scale' && s.pitches.map((p) => `${p.natural}${p.accidental}${p.octave}`)).toEqual(['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5']);
    const k = tryThisPicture('key of F', C);
    expect(k.kind === 'scale' && k.notes.map((n) => n.natural + n.accidental)).toEqual(['F', 'G', 'A', 'Bb', 'C', 'D', 'E']);
    const ch = tryThisPicture('D major chord', C);
    expect(ch.kind === 'chord' && ch.notes.map((n) => n.natural + n.accidental)).toEqual(['D', 'F#', 'A']);
    expect(tryThisPicture('circle of fifths', C).kind).toBe('none');
    expect(tryThisPicture('blah blah', C).kind).toBe('none');
  });
  it('every concept and milestone Try-This query in the curriculum resolves to something to show (or the circle)', () => {
    const dead: string[] = [];
    for (let n = 1; n <= 9; n++) {
      for (const unit of EN_UNITS[n]) {
        const queries = unit.modules.flatMap((m) => m.concepts.filter((c) => !c.rhythm).map((c) => [m.id, c.tryThisQuery]));
        if (unit.milestone) queries.push([`${unit.id} milestone`, unit.milestone.tryThisQuery]);
        for (const [where, query] of queries) {
          if (tryThisPicture(query, C).kind === 'none' && !/circle/i.test(query)) dead.push(`${where}: ${query}`);
        }
      }
    }
    expect(dead).toEqual([]);
  });
});

describe('the lesson borrows the instrument (D-20, W9-02)', () => {
  beforeEach(() => {
    returnLessonInstrument();
    useAppStore.setState({ view: 'learn', selectedKey: { natural: 'A', accidental: '' }, selectedScale: 'pentatonic_minor', selectedChord: null });
  });

  it('shows the lesson\'s query, and gives Explore its key and scale back on leaving Learn', () => {
    expect(showLessonQuery('C major scale')).toBe(true);
    expect(useAppStore.getState().selectedScale).toBe('major');
    expect(useAppStore.getState().selectedKey.natural).toBe('C');
    showLessonQuery('D major chord');
    expect(useAppStore.getState().selectedChord?.root.natural).toBe('D');
    useAppStore.getState().setView('explore');
    expect(useAppStore.getState().selectedKey.natural).toBe('A');
    expect(useAppStore.getState().selectedScale).toBe('pentatonic_minor');
    expect(isLessonInstrumentBorrowed()).toBe(false);
  });

  it('"Open in Explore" keeps the lesson\'s selection there (the executor as before)', () => {
    showLessonQuery('C major scale');
    keepLessonInstrument();
    expect(executeTheoryQuery('G major scale')).toBe('scale');
    expect(useAppStore.getState().view).toBe('explore');
    expect(useAppStore.getState().selectedKey.natural).toBe('G');
  });

  it('the circle of fifths or an unknown query leaves the instrument alone', () => {
    expect(showLessonQuery('circle of fifths')).toBe(false);
    expect(useAppStore.getState().selectedScale).toBe('pentatonic_minor');
  });
});

describe('the dock in a lesson (D-20)', () => {
  beforeEach(() => useAppStore.setState({ view: 'learn', dockDetents: { explore: 'half', learn: 'half' } }));
  it('folds on opening; opens for a need; folds back after — unless the learner moved it', () => {
    foldDockForLesson();
    expect(useAppStore.getState().dockDetents.learn).toBe('peek');
    openDockForLesson();
    expect(useAppStore.getState().dockDetents.learn).toBe('half');
    foldDockAfterLesson();
    expect(useAppStore.getState().dockDetents.learn).toBe('peek');
    openDockForLesson();
    useAppStore.getState().setDockDetent('learn', 'full'); // the learner pulls it up
    foldDockAfterLesson();
    expect(useAppStore.getState().dockDetents.learn).toBe('full');
  });
  it('never touches Explore\'s dock', () => {
    foldDockForLesson();
    openDockForLesson();
    expect(useAppStore.getState().dockDetents.explore).toBe('half');
  });
});
