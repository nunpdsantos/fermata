/**
 * The microphone is OFF at every start (brief U; wave 3's "Use my
 * instrument is off by default", kept): in a fresh visit the switch reads
 * off in a check answered on the instrument, in the top bar and in the
 * tuner, and opening any of them asks the browser NOTHING — not even
 * whether the microphone is allowed — until the learner taps the switch.
 * (The other tests reset the in-memory state; this one reads it as the app
 * starts.)
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { installFakeMic } from '../../../services/microphone/__tests__/fakeMic';
import { useMic } from '../../../services/microphone/micSwitch';
import { useAppStore } from '../../../state/store';

vi.mock('../hearString.ts', () => ({ REFERENCE_SECONDS: 2.5, prepareGuitarStrings: () => undefined, playGuitarString: () => undefined }));

const mic = installFakeMic();
afterEach(() => {
  cleanup();
  mic.restore();
});

describe('the microphone, a fresh visit', () => {
  it('is off; a check answered on the instrument, the top bar and the tuner open; nothing asks for the microphone, or whether it is allowed', async () => {
    expect(useMic.getState().state).toEqual({ kind: 'off' });
    const { InstrumentInput } = await import('../../learn/exercises/inputs/InstrumentInput');
    const { TopBar } = await import('../../layout/TopBar');
    const { TunerSheet } = await import('../TunerSheet');
    useAppStore.setState({ view: 'explore', language: 'en', instrument: 'guitar' });
    render(
      <>
        <TopBar />
        <InstrumentInput expectedCount={3} submitted={false} onSubmit={() => undefined} accentColor="#888888" />
        <TunerSheet open onClose={() => undefined} />
      </>,
    );
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });
    const switches = screen.getAllByRole('button', { name: 'Microphone' });
    expect(switches.map((s) => s.getAttribute('data-place')).sort()).toEqual(['bar', 'check', 'tuner']);
    for (const s of switches) {
      expect(s.getAttribute('aria-pressed')).toBe('false');
      expect(s.getAttribute('data-state')).toBe('off');
    }
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(navigator.permissions.query).not.toHaveBeenCalled();
    expect(mic.contexts).toHaveLength(0);
    expect(useMic.getState().state).toEqual({ kind: 'off' });
  });
});
