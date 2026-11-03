import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../../../i18n';
import GuitarPractice from '../GuitarPractice';
import { useAppStore } from '../../../state/store';
import { useFingeringStore, FINGERING_STORE_KEY } from '../../../state/fingeringStore';
import { useFocusNoteStore } from '../../../state/focusNoteStore';
import { cancelScheduledAudio, playTimedNotes, resumeAudio } from '../../../core/services/audio';

vi.mock('../../../core/services/audio', () => ({
  SYNTH_PRESETS: {}, resumeAudio: vi.fn().mockResolvedValue(undefined), cancelScheduledAudio: vi.fn(), playTimedNotes: vi.fn(),
}));
vi.mock('../../notation/StaffNotation', () => ({ StaffNotation: ({ notes, followInstrument }: { notes: unknown; followInstrument: boolean }) =>
  <div data-testid="staff-notes" data-guitar={followInstrument}>{JSON.stringify(notes)}</div> }));

beforeEach(async () => {
  vi.clearAllMocks();
  vi.mocked(resumeAudio).mockResolvedValue(undefined);
  localStorage.clear();
  useFingeringStore.setState({ overrides: {}, labelMode: 'finger' });
  useFocusNoteStore.getState().clearAll();
  useAppStore.setState({ selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', guitarTuningId: 'standard', instrument: 'guitar', view: 'explore' });
  await i18n.changeLanguage('en');
});
afterEach(cleanup);

describe('guitar practice views', () => {
  it('renders fingers, right-hand alternation, shifts, and a guitar staff; steps link to Explore', () => {
    render(<GuitarPractice />);
    expect(screen.getByTestId('staff-notes').getAttribute('data-guitar')).toBe('true');
    expect(screen.getByTestId('practice-neck').querySelector('[data-dot="position"]')?.textContent).toMatch(/[0-4]/);
    const scaleOptions = within(screen.getByRole('combobox', { name: 'Scale' })).getAllByRole('option');
    expect(scaleOptions.slice(0, 4).map((o) => (o as HTMLOptionElement).value)).toEqual(['major', 'natural_minor', 'harmonic_minor', 'melodic_minor']);
    fireEvent.click(screen.getByRole('button', { name: 'Next note or chord' }));
    expect(screen.getByTestId('practice-current').textContent).toContain('2 of 29');
    expect(useFocusNoteStore.getState().pinned?.source).toBe('practice');
    const events = within(screen.getByRole('group', { name: 'Route in playing order' })).getAllByRole('button');
    const shifted = events.find((e) => e.textContent?.includes('↗'))!;
    fireEvent.click(shifted);
    expect(screen.getByTestId('practice-shift').textContent).toMatch(/shift: [IVX]+ → [IVX]+/);
    fireEvent.keyDown(shifted, { key: 'ArrowLeft' });
    expect(document.activeElement?.getAttribute('aria-current')).toBe('step');
  });
  it('edits and resets a route finger without touching position overrides; persists after remount', async () => {
    useFingeringStore.getState().setOverride('major|standard|p5|2|4', 3);
    const view = render(<GuitarPractice />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit fingering' }));
    const select = screen.getByRole('combobox', { name: /Finger for/ }) as HTMLSelectElement;
    const initial = select.value;
    const changed = initial === '1' ? '2' : '1';
    fireEvent.change(select, { target: { value: changed } });
    const blob = JSON.parse(localStorage.getItem(FINGERING_STORE_KEY)!);
    expect(Object.keys(blob.state.overrides).some((k) => k.startsWith('route:1|'))).toBe(true);
    view.unmount();
    await useFingeringStore.persist.rehydrate();
    render(<GuitarPractice />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit fingering' }));
    expect((screen.getByRole('combobox', { name: /Finger for/ }) as HTMLSelectElement).value).toBe(changed);
    fireEvent.click(screen.getByRole('button', { name: 'Reset to suggested' }));
    expect((screen.getByRole('combobox', { name: /Finger for/ }) as HTMLSelectElement).value).toBe(initial);
    expect(useFingeringStore.getState().overrides).toEqual({ 'major|standard|p5|2|4': 3 });
  });
  it('shows technical availability and simultaneous notes; right hand keeps p-i-m-a above notes', () => {
    render(<GuitarPractice />);
    fireEvent.click(screen.getByRole('tab', { name: 'Technical set' }));
    expect(screen.getByTestId('practice-exercise').querySelectorAll('option')).toHaveLength(13);
    fireEvent.change(screen.getByTestId('practice-exercise'), { target: { value: 'brokenChord-upper' } });
    expect(screen.getByRole('status').textContent).toContain('three strings');
    expect(screen.queryByTestId('practice-player')).toBeNull();
    fireEvent.change(screen.getByTestId('practice-exercise'), { target: { value: 'sixths-together' } });
    expect(JSON.parse(screen.getByTestId('staff-notes').textContent!)).toHaveLength(2);
    fireEvent.click(screen.getByRole('tab', { name: 'Right hand' }));
    expect(screen.getByText(/I → V7 → I/)).toBeDefined();
    const events = within(screen.getByRole('group', { name: 'Route in playing order' })).getAllByRole('button');
    expect(events.slice(0, 4).map((e) => e.firstElementChild?.textContent)).toEqual(['p', 'i', 'm', 'a']);
    expect(screen.queryByRole('button', { name: 'Edit fingering' })).toBeNull();
  });
  it.each(['en', 'pt', 'es'])('renders all three tabs and controls in %s without missing keys', async (lang) => {
    await i18n.changeLanguage(lang);
    render(<GuitarPractice />);
    for (const key of ['scales', 'technical', 'rightHand']) {
      fireEvent.click(screen.getByRole('tab', { name: i18n.t(`practice.tabs.${key}`) }));
      expect(screen.getByRole('button', { name: i18n.t('practice.play') })).toBeDefined();
      expect(document.body.textContent).not.toMatch(/practice\.|fretboard\./);
    }
  });
});

describe('playback ownership and cancellation', () => {
  it('uses the shared schedule, highlights the sounding note, stops on tab change and unmount', async () => {
    const view = render(<GuitarPractice />);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: '▶ Play' })));
    const [notes, , callbacks] = vi.mocked(playTimedNotes).mock.calls[0];
    expect(notes).toHaveLength(29);
    act(() => callbacks!.onNotePlay(4));
    expect(screen.getByTestId('practice-current').textContent).toContain('5 of 29');
    expect(JSON.parse(screen.getByTestId('staff-notes').textContent!)).toEqual([notes[4].note]);
    expect(useFocusNoteStore.getState().pinned?.midi).toBe(55);
    fireEvent.click(screen.getByRole('tab', { name: 'Right hand' }));
    expect(cancelScheduledAudio).toHaveBeenCalledTimes(2); // start + leaving
    expect(useFocusNoteStore.getState().pinned).toBeNull();
    await act(async () => fireEvent.click(screen.getByRole('button', { name: '▶ Play' })));
    view.unmount();
    expect(cancelScheduledAudio).toHaveBeenCalledTimes(4);
  });
  it('cannot start after leaving while audio resume is pending', async () => {
    let resolve!: () => void;
    vi.mocked(resumeAudio).mockImplementation(() => new Promise<void>((r) => { resolve = r; }));
    const view = render(<GuitarPractice />);
    fireEvent.click(screen.getByRole('button', { name: '▶ Play' }));
    view.unmount();
    await act(async () => resolve());
    expect(playTimedNotes).not.toHaveBeenCalled();
  });
  it('cancels on key/tuning change and tempo change, with no replacement schedule until Play', async () => {
    render(<GuitarPractice />);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: '▶ Play' })));
    fireEvent.change(screen.getByRole('combobox', { name: 'Tempo' }), { target: { value: '120' } });
    expect(cancelScheduledAudio).toHaveBeenCalledTimes(2);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: '▶ Play' })));
    act(() => useAppStore.setState({ guitarTuningId: 'drop-d' }));
    expect(cancelScheduledAudio).toHaveBeenCalledTimes(4);
    expect(playTimedNotes).toHaveBeenCalledTimes(2);
  });
});
