import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import i18n from '../../../i18n';
import { ScaleStrip } from '../ScaleStrip';
import { ExploreHeader } from '../ExploreHeader';
import { useAppStore } from '../../../state/store';
import { noteToString, type PitchedNote } from '../../../core/types/music';
import { playScale } from '../../../core/services/audio';

const noteOn = vi.fn().mockResolvedValue(77);
vi.mock('../../../hooks/useAudio', () => ({ useAudio: () => ({ noteOn, noteOff: vi.fn() }) }));
vi.mock('../../../core/services/audio', async (original) => ({
  ...await original<Record<string, unknown>>(),
  playScale: vi.fn(), resumeAudio: vi.fn(async () => {}), cancelScheduledAudio: vi.fn(),
}));
vi.mock('../../notation/StaffNotation.tsx', () => ({
  StaffNotation: (p: { notes: PitchedNote[]; followInstrument?: boolean }) => <div data-testid="written-notes" data-follow={p.followInstrument} data-notes={JSON.stringify(p.notes)} />,
}));

beforeEach(() => {
  vi.clearAllMocks();
  useAppStore.setState({ selectedKey: { natural: 'A', accidental: '' }, selectedScale: 'melodic_minor', instrument: 'piano', baseOctave: 4, selectedChord: null, view: 'explore', exerciseInputActive: false });
});
afterEach(async () => { cleanup(); await i18n.changeLanguage('en'); });

const columns = () => [...document.querySelectorAll<HTMLElement>('.strip-col')];

describe('W10-09: the classical staff reuses the strip, both directions', () => {
  it.each(['en', 'pt', 'es'])('%s: notes, octave, degree labels and taps follow the descent', async (lang) => {
    await i18n.changeLanguage(lang);
    render(<ScaleStrip />);
    const staff = await screen.findByTestId('written-notes');
    expect(columns().map((c) => c.dataset.note)).toEqual(['A', 'B', 'C', 'D', 'E', 'F#', 'G#', 'A']);
    const desc = screen.getByRole('radio', { name: i18n.t('explore.strip.descending') });
    fireEvent.click(desc);
    expect(desc.getAttribute('aria-checked')).toBe('true');
    expect(columns().map((c) => c.dataset.note)).toEqual(['A', 'G', 'F', 'E', 'D', 'C', 'B', 'A']);
    expect(columns().map((c) => Number(c.dataset.midi))).toEqual([81, 79, 77, 76, 74, 72, 71, 69]);
    expect(columns().map((c) => c.querySelector('.strip-degree')?.textContent)).toEqual(['1', 'b7', 'b6', '5', '4', 'b3', '2', '1']);
    const drawn = JSON.parse(staff.getAttribute('data-notes')!) as PitchedNote[];
    expect(drawn.map((n) => noteToString(n))).toEqual(['A', 'G', 'F', 'E', 'D', 'C', 'B', 'A']);
    expect(staff.getAttribute('data-follow')).toBe('true'); // guitar keeps D-05 transposition
    fireEvent.click(columns()[2]);
    expect(noteOn).toHaveBeenCalledWith({ natural: 'F', accidental: '', octave: 5 }, 5);
    expect(columns().filter((c) => c.tabIndex === 0)).toHaveLength(1);
    fireEvent.click(screen.getByRole('radio', { name: i18n.t('explore.strip.ascending') }));
    expect(columns()[5].dataset.note).toBe('F#');
  });

  it('Play scale asks the core player for both forms; other scales keep their existing playback', async () => {
    render(<ExploreHeader />);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: i18n.t('explore.playScaleClassical') })));
    let args = vi.mocked(playScale).mock.calls[0];
    expect(args[0].map(noteToString)).toEqual(['A', 'B', 'C', 'D', 'E', 'F#', 'G#']);
    expect(args.slice(1, 4)).toEqual([4, true, true]);
    expect(args[8]!.map(noteToString)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    act(() => useAppStore.setState({ selectedScale: 'major' }));
    await act(async () => fireEvent.click(screen.getByRole('button', { name: i18n.t('explore.playScaleAscending') })));
    args = vi.mocked(playScale).mock.calls[1];
    expect(args.slice(1, 4)).toEqual([4, true, false]);
  });
});
