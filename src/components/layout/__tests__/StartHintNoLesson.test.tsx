/**
 * The 'player' hint's link is drawn only while the chords track's lesson 1
 * exists (final review of wave 2: the promise was pinned on the helper
 * `startHintLesson` only; the component could ignore it and every test still
 * passed). Here the eager written set is empty: the line has no link.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, cleanup, within } from '@testing-library/react';

vi.mock('../../../data/tracks', async (orig) => ({
  ...(await orig<typeof import('../../../data/tracks')>()),
  WRITTEN_TRACK_LESSONS: new Set<string>(),
}));

import i18n from '../../../i18n';
import { WRITTEN_TRACK_LESSONS } from '../../../data/tracks';
import { useAppStore } from '../../../state/store';
import { raiseStartHint, useStartHintStore } from '../../../state/startHint';
import { StartHint } from '../StartHint';

beforeEach(async () => {
  await i18n.changeLanguage('en');
  useAppStore.setState({ view: 'explore', instrument: 'piano', startHint: null, pendingLearnTarget: null });
  useStartHintStore.setState({ shown: null });
});
afterEach(() => cleanup());

describe('the player hint with its lesson not written', () => {
  it('the line alone, then ✕: no link', () => {
    expect(WRITTEN_TRACK_LESSONS.size).toBe(0);
    act(() => raiseStartHint('player'));
    render(<StartHint />);
    const hint = screen.getByTestId('start-hint');
    expect(hint.querySelector('p')!.textContent).toBe('Pick the key of a song you play, for example G. The chords below belong to it: tap one.');
    expect(within(hint).getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual(['Dismiss the tip']);
    expect(screen.queryByTestId('start-hint-lesson')).toBeNull();
  });
});
