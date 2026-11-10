/**
 * The capo outside the board (wave 2, stream C): Settings → Guitar neck →
 * "Capo" (none, 1…9, EN / PT / ES), the dock bar's context line, and the
 * practice sheet's one line while a capo is on.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import i18n from '../../../i18n/index';
import { useAppStore } from '../../../state/store';
import { useDockContextStore } from '../../../state/dockContextStore';
import { getCapoFret, setCapoFret } from '../../../state/capo';

vi.mock('../../instruments/Piano.tsx', () => ({ Piano: () => <div data-testid="piano-mock" /> }));
vi.mock('../../instruments/Fretboard.tsx', () => ({ Fretboard: () => <div data-testid="fret-mock" /> }));
vi.mock('../../../core/services/audio', () => ({
  SYNTH_PRESETS: {}, resumeAudio: vi.fn().mockResolvedValue(undefined), cancelScheduledAudio: vi.fn(), playTimedNotes: vi.fn(),
}));
vi.mock('../../notation/StaffNotation', () => ({ StaffNotation: () => <div data-testid="staff-notes" /> }));

import { SettingsSheet } from '../SettingsSheet';
import { InstrumentDock } from '../InstrumentDock';
import GuitarPractice from '../../practice/GuitarPractice';

beforeEach(() => {
  useAppStore.setState({ view: 'explore', instrument: 'guitar', exerciseInputActive: false, capoFret: 0, language: 'en', dockDetents: { explore: 'half', learn: 'peek' } });
  useDockContextStore.getState().setGuitarPosition(null);
});
afterEach(async () => {
  cleanup();
  useAppStore.setState({ capoFret: 0 });
  await act(() => i18n.changeLanguage('en'));
});

describe('Settings → Guitar neck → Capo', () => {
  it('none, 1 … 9; choosing one sets it; "No capo" takes it off', () => {
    render(<SettingsSheet open onClose={() => {}} />);
    const row = screen.getByTestId('capo-setting');
    const select = within(row).getByRole('combobox', { name: 'Capo' }) as HTMLSelectElement;
    expect([...select.options].map((o) => o.textContent)).toEqual(['No capo', 'Capo 1', 'Capo 2', 'Capo 3', 'Capo 4', 'Capo 5', 'Capo 6', 'Capo 7', 'Capo 8', 'Capo 9']);
    expect(select.value).toBe('0');
    fireEvent.change(select, { target: { value: '3' } });
    expect(getCapoFret()).toBe(3);
    expect(select.value).toBe('3');
    fireEvent.change(select, { target: { value: '0' } });
    expect(getCapoFret()).toBe(0);
    expect(within(row).getByText(/Explore's guitar shows it; lessons, Drill and the guitar practice sheet show the neck without it\./)).toBeTruthy();
    // Inside the Guitar neck row.
    expect(screen.getByTestId('neck-settings').contains(row)).toBe(true);
  });

  it.each([
    ['pt', 'Sem capo', 'Capo 3', /A guitarra do Explorar mostra-o/],
    ['es', 'Sin capo', 'Capo 3', /La guitarra de Explorar lo muestra/],
  ] as const)('%s', async (lang, none, three, hint) => {
    await act(() => i18n.changeLanguage(lang));
    render(<SettingsSheet open onClose={() => {}} />);
    const row = screen.getByTestId('capo-setting');
    const select = within(row).getByRole('combobox', { name: 'Capo' }) as HTMLSelectElement;
    expect(select.options[0].textContent).toBe(none);
    expect(select.options[3].textContent).toBe(three);
    expect(within(row).getByText(hint)).toBeTruthy();
    // ES never calls the capo "cejilla" (that word is the barre).
    expect(row.textContent).not.toMatch(/cejilla/i);
  });
});

describe('the dock bar says the capo beside what the board shows', () => {
  it('Explore\'s guitar: "Position IV · Capo 3", "Open position · Capo 3", "Capo 3" with a chord; nothing elsewhere', () => {
    act(() => setCapoFret(3));
    act(() => useDockContextStore.getState().setGuitarPosition(4));
    const { rerender } = render(<InstrumentDock view="explore" available={700} />);
    expect(screen.getByText('Position IV · Capo 3')).toBeTruthy();
    act(() => useDockContextStore.getState().setGuitarPosition(0));
    rerender(<InstrumentDock view="explore" available={700} />);
    expect(screen.getByText('Open position · Capo 3')).toBeTruthy();
    act(() => useDockContextStore.getState().setGuitarPosition(null));
    rerender(<InstrumentDock view="explore" available={700} />);
    expect(screen.getByText('Capo 3')).toBeTruthy();
    // Learn draws the neck without the capo, so the bar does not mention it.
    act(() => useAppStore.setState({ view: 'learn' }));
    act(() => useDockContextStore.getState().setGuitarPosition(4));
    rerender(<InstrumentDock view="learn" available={700} />);
    expect(screen.getByText('Position IV')).toBeTruthy();
    expect(screen.queryByText(/Capo/)).toBeNull();
  });

  it('no capo: the line as before', () => {
    act(() => useDockContextStore.getState().setGuitarPosition(4));
    render(<InstrumentDock view="explore" available={700} />);
    expect(screen.getByText('Position IV')).toBeTruthy();
  });
});

describe('the practice sheet draws the neck without the capo, and says so', () => {
  it('one line while a capo is on; none without', () => {
    useAppStore.setState({ selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', guitarTuningId: 'standard' });
    const { rerender } = render(<GuitarPractice />);
    expect(screen.queryByTestId('practice-capo-note')).toBeNull();
    act(() => setCapoFret(2));
    rerender(<GuitarPractice />);
    expect(screen.getByTestId('practice-capo-note').textContent).toBe('The capo is not used here: these studies are for the neck without a capo.');
    // Its neck has no capo drawn.
    expect(screen.getByTestId('practice-neck').querySelector('[data-capo-bar], [data-out-of-play]')).toBeNull();
  });
});
