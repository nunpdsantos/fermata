/**
 * Wave 2: the 'player' start hint ends on one link, "Theory from the chords
 * you know: lesson 1 →", once that lesson exists. The chords track's lesson 1
 * is written (the REAL eager set, `WRITTEN_TRACK_LESSONS`, no mock);
 * startDoors.test.ts pins the unwritten case (no link).
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup, within } from '@testing-library/react';
import { WRITTEN_TRACK_LESSONS } from '../../../data/tracks';

import i18n from '../../../i18n';
import { useAppStore } from '../../../state/store';
import { raiseStartHint, useStartHintStore } from '../../../state/startHint';
import { StartHint } from '../StartHint';

beforeEach(async () => {
  await i18n.changeLanguage('en');
  useAppStore.setState({ view: 'explore', instrument: 'piano', startHint: null, pendingLearnTarget: null });
  useStartHintStore.setState({ shown: null });
});
afterEach(() => cleanup());

describe('the player hint\'s lesson link (chords lesson 1 written)', () => {
  it('lesson 1 of the chords track is in the real written set', () => {
    expect(WRITTEN_TRACK_LESSONS.has('l1u35m1')).toBe(true);
  });

  it('player: the line, then the link at its end, then ✕; the link opens lesson 1 and ends the hint', () => {
    act(() => raiseStartHint('player'));
    render(<StartHint />);
    const hint = screen.getByTestId('start-hint');
    expect(hint.querySelector('p')!.textContent).toBe('Pick the key of a song you play, for example G. The chords below belong to it: tap one. Theory from the chords you know: lesson 1 →');
    expect(within(hint).getAllByRole('button').map((b) => b.textContent || b.getAttribute('aria-label'))).toEqual(['Theory from the chords you know: lesson 1 →', 'Dismiss the tip']);
    fireEvent.click(screen.getByRole('button', { name: 'Theory from the chords you know: lesson 1 →' }));
    expect(useAppStore.getState()).toMatchObject({ view: 'learn', startHint: null, pendingLearnTarget: { levelId: 'l1', unitId: 'u35', moduleId: 'l1u35m1' } });
    expect(useStartHintStore.getState().shown).toBeNull();
    expect(screen.queryByTestId('start-hint')).toBeNull();
  });

  it('new: still no link (its door already opened its lesson)', () => {
    act(() => raiseStartHint('new'));
    render(<StartHint />);
    expect(within(screen.getByTestId('start-hint')).getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual(['Dismiss the tip']);
    expect(screen.queryByTestId('start-hint-lesson')).toBeNull();
  });

  it('PT and ES wording', async () => {
    for (const [lang, text] of [['pt', 'Teoria a partir dos acordes que conheces: lição 1 →'], ['es', 'Teoría desde los acordes que conoces: lección 1 →']] as const) {
      await i18n.changeLanguage(lang);
      act(() => raiseStartHint('player'));
      const { unmount } = render(<StartHint />);
      expect(screen.getByTestId('start-hint-lesson').textContent).toBe(text);
      unmount();
    }
  });
});
