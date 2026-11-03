import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { getResults } from '../../components/navigation/quickSearchResults';
import { LearnMoreButton } from '../../components/panels/LearnMoreButton';
import { buildChord } from '../../core/constants/chords';
import { MODULE_INDEX } from '../../data/moduleIndex';
import { pickBootView } from '../bootView';
import { useAppStore } from '../store';

const lesson = MODULE_INDEX.find((entry) => entry.title === 'The Staff and Clefs')!;
const target = { levelId: lesson.level, unitId: lesson.unitId, moduleId: lesson.id };
const selection = {
  selectedKey: { natural: 'F', accidental: '#' } as const,
  selectedScale: 'melodic_minor' as const,
  selectedChord: buildChord({ natural: 'F', accidental: '#' }, 'minor'),
  selectedDegree: 1,
  detailPanelOpen: true,
  activeNotes: new Set([66]),
};
const savedState = () => JSON.parse(localStorage.getItem('music-theory-app')!).state;

beforeEach(() => {
  localStorage.clear();
  useAppStore.setState({
    ...selection,
    view: 'explore',
    lastView: 'explore',
    pendingLearnTarget: null,
    lessonLoan: null,
    language: 'en',
  });
});
afterEach(() => {
  cleanup();
  useAppStore.setState(useAppStore.getInitialState(), true);
  localStorage.clear();
});

describe('Learn entry navigation', () => {
  it.each(['search Lesson result', 'Learn about this'] as const)('%s records the boot view without resetting selections', (entry) => {
    const updates: unknown[] = [];
    const unsubscribe = useAppStore.subscribe(({ view, lastView, pendingLearnTarget }) => {
      updates.push({ view, lastView, pendingLearnTarget });
    });
    try {
      if (entry === 'search Lesson result') {
        const result = getResults(lesson.title).find((hit) => hit.type === 'Lesson' && hit.label === lesson.title);
        expect(result).toBeDefined();
        result!.action();
      } else {
        render(<LearnMoreButton query={lesson.title} moduleId={lesson.id} />);
        fireEvent.click(screen.getByRole('button', { name: 'Learn about this' }));
      }
    } finally {
      unsubscribe();
    }

    expect(useAppStore.getState()).toMatchObject({
      ...selection,
      view: 'learn',
      lastView: 'learn',
      pendingLearnTarget: target,
    });
    expect(updates).toEqual([{ view: 'learn', lastView: 'learn', pendingLearnTarget: target }]);
    expect(savedState()).toMatchObject({
      lastView: 'learn', selectedKey: selection.selectedKey, selectedScale: selection.selectedScale,
    });
    expect(pickBootView('', savedState().lastView)).toBe('learn');
  });

  it('known-bad control: a raw view/target write leaves the persisted boot destination in Explore', () => {
    // The old implementation: the lesson opens now, but a boot restores Explore.
    useAppStore.setState({ view: 'learn', pendingLearnTarget: target });
    expect(useAppStore.getState().view).toBe('learn');
    expect(useAppStore.getState().lastView).toBe('explore');
    expect(savedState().lastView).toBe('explore');
    expect(pickBootView('', savedState().lastView)).toBe('explore');
  });
});
