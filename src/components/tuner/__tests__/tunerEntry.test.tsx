/**
 * The two ways in (brief T): "⋯" → Tuner, and with the guitar selected a
 * "Tune" button on the dock's bar — nothing else on the bar changes, it is
 * not there with the piano or during a check, and the tuner's chunk loads
 * only when asked for.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { closeTuner, useTunerRequest } from '../tunerRequest';
import en from '../../../i18n/locales/en.json';

vi.mock('../../instruments/Piano.tsx', () => ({ Piano: () => <div data-testid="piano-mock" /> }));
vi.mock('../../instruments/Fretboard.tsx', () => ({ Fretboard: () => <div data-testid="fret-mock" /> }));
const { upright } = vi.hoisted(() => ({ upright: { value: false } }));
vi.mock('../../../hooks/useMediaQuery.ts', async (orig) => ({
  ...(await orig<Record<string, unknown>>()),
  useMediaQuery: (q: string) => (q === '(max-width: 639px)' ? upright.value : false),
}));
vi.mock('../hearString.ts', () => ({ REFERENCE_SECONDS: 2.5, prepareGuitarStrings: () => undefined, playGuitarString: () => undefined }));

import { TopBar } from '../../layout/TopBar';
import { InstrumentDock } from '../../layout/InstrumentDock';

beforeEach(() => {
  useAppStore.setState({ view: 'explore', language: 'en', instrument: 'piano', exerciseInputActive: false, dockDetents: { explore: 'half', learn: 'peek' } });
  closeTuner();
  upright.value = false;
});
afterEach(() => {
  act(() => closeTuner());
  cleanup();
});

const barButtons = () => [...screen.getByTestId('instrument-dock').querySelectorAll('.dock-bar-row button')].map((b) => b.getAttribute('aria-label') ?? b.textContent);

describe('tuner entry points', () => {
  it('"⋯" → Tuner opens the tuner (its chunk loads then)', async () => {
    render(<TopBar />);
    expect(screen.queryByRole('dialog', { name: 'Tuner' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Tuner' }));
    expect(useTunerRequest.getState().open).toBe(true);
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Tuner' })).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Close the tuner' }));
    expect(useTunerRequest.getState().open).toBe(false);
    expect(screen.queryByRole('dialog', { name: 'Tuner' })).toBeNull();
  });

  it('the menu reads Settings, Show me around, Tuner, Metronome, Report a problem ("Tuner" right after "Show me around")', () => {
    render(<TopBar />);
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    // Since 2026-11-12 "Report a problem" (its words from the locale file) ends the list.
    expect(screen.getAllByRole('menuitem').map((m) => m.textContent)).toEqual(['Settings', 'Show me around', 'Tuner', 'Metronome', en.report.menuItem]);
  });

  it('guitar: the dock bar gains one button, "Tune", which opens the tuner', () => {
    useAppStore.setState({ instrument: 'piano' });
    const { unmount } = render(<InstrumentDock view="explore" available={800} />);
    const piano = barButtons();
    unmount();
    useAppStore.setState({ instrument: 'guitar' });
    render(<InstrumentDock view="explore" available={800} />);
    const guitar = barButtons();
    expect(guitar.filter((b) => b === 'Tune')).toHaveLength(1);
    // Nothing else on the bar changed: the same controls, in the same order.
    expect(guitar.filter((b) => b !== 'Tune')).toEqual(piano.map((b) => b));
    fireEvent.click(screen.getByRole('button', { name: 'Tune' }));
    expect(useTunerRequest.getState().open).toBe(true);
  });

  it('an upright phone: no "Tune" on its full bar ("⋯" → Tuner is there)', () => {
    upright.value = true;
    useAppStore.setState({ instrument: 'guitar' });
    render(<InstrumentDock view="explore" available={800} />);
    expect(screen.queryByRole('button', { name: 'Tune' })).toBeNull();
  });

  it('piano, or a check answered on the instrument: no "Tune"', () => {
    useAppStore.setState({ instrument: 'piano' });
    const { unmount } = render(<InstrumentDock view="explore" available={800} />);
    expect(screen.queryByRole('button', { name: 'Tune' })).toBeNull();
    unmount();
    useAppStore.setState({ instrument: 'guitar', exerciseInputActive: true });
    render(<InstrumentDock view="learn" available={800} />);
    expect(screen.queryByRole('button', { name: 'Tune' })).toBeNull();
  });
});
