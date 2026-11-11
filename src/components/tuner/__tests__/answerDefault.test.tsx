/**
 * "Use my instrument" is OFF by default (brief T): in a fresh visit, a check
 * answered on the instrument opens with it off and the microphone closed —
 * nothing is asked until the learner turns it on. (The other tests reset the
 * in-memory "on for this visit" flag; this one reads it as the app starts.)
 */
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { installFakeMic } from '../../../services/microphone/__tests__/fakeMic';
import { InstrumentInput } from '../../learn/exercises/inputs/InstrumentInput';
import { answerWanted } from '../answerSession';

const mic = installFakeMic();
afterEach(() => {
  cleanup();
  mic.restore();
});

describe('Use my instrument, a fresh visit', () => {
  it('is off, and nothing asks for the microphone', async () => {
    expect(answerWanted()).toBe(false);
    render(<InstrumentInput expectedCount={3} submitted={false} onSubmit={() => undefined} accentColor="#888888" />);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(screen.getByRole('button', { name: 'Use my instrument' }).getAttribute('aria-pressed')).toBe('false');
    expect(mic.getUserMedia).not.toHaveBeenCalled();
  });
});
