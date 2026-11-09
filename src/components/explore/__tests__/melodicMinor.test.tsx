import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import i18n from '../../../i18n';
import { Piano } from '../../instruments/Piano';
import { Fretboard } from '../../instruments/Fretboard';
import { DockReadout } from '../../layout/DockReadout';
import { useScaleDirectionStore } from '../../../state/scaleDirectionStore';
import { useFocusNoteStore } from '../../../state/focusNoteStore';
import { useFingeringStore } from '../../../state/fingeringStore';
import { useKeyContext } from '../../../hooks/useKeyContext';
import { DEGREE_COLORS } from '../../../design/tokens/colors';
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
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn();
  useScaleDirectionStore.setState({ direction: 'ascending' });
  useFocusNoteStore.getState().clearAll();
  useFingeringStore.setState({ overrides: {}, labelMode: 'degree' });
  useAppStore.setState({ selectedKey: { natural: 'A', accidental: '' }, selectedScale: 'melodic_minor', instrument: 'piano', baseOctave: 4, selectedChord: null, view: 'explore', exerciseInputActive: false, scaleOctaves: 1, activeNotes: new Set(), highlightedNotes: [], guitarTuningId: 'standard', guitarScalePosition: 0, themeMode: 'fermata' });
});
afterEach(async () => { cleanup(); useScaleDirectionStore.setState({ direction: 'ascending' }); await i18n.changeLanguage('en'); });

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
    expect(columns().map((c) => c.querySelector('.strip-degree')?.textContent)).toEqual(['1', '♭7', '♭6', '5', '4', '♭3', '2', '1']);
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

// Independent, hand-written A-minor pitch pools: never derive expectations
// from the same scale builder that drives the instrument.
const UP = [0, 2, 4, 6, 8, 9, 11];
const DOWN = [0, 2, 4, 5, 7, 9, 11];
const OPEN_MIDI = [40, 45, 50, 55, 59, 64];
const pitchSet = (values: number[]) => [...new Set(values)].sort((a, b) => a - b);
const dotPc = (el: HTMLElement) => (OPEN_MIDI[Number(el.dataset.dotString)] + Number(el.dataset.dotFret)) % 12;

function HarmonyProbe() {
  const { diatonicChords, scalePitchClasses, getNoteDegree } = useKeyContext();
  const degrees = diatonicChords.map(({ chord }) => getNoteDegree(chord.root));
  return <output data-testid="harmony">{JSON.stringify({ diatonicChords, pitches: [...scalePitchClasses], degrees })}</output>;
}

describe('classical direction reaches the rendered instruments', () => {
  it('piano switches its highlighted pitches and colours, and the linked readout follows', () => {
    const { container } = render(<><ScaleStrip /><Piano /><DockReadout context="" /><HarmonyProbe /></>);
    const pitches = () => pitchSet([...container.querySelectorAll<HTMLElement>('[data-scale-note]')].map((el) => Number(el.dataset.midi) % 12));
    const harmony = screen.getByTestId('harmony').textContent;
    expect(pitches()).toEqual(UP);
    // Keep the same instrument focus as the direction changes: its role must
    // update from outside the ascending scale to the descending subtonic.
    act(() => useFocusNoteStore.getState().set('pinned', { pc: 7, midi: 79, source: 'piano' }));
    expect(screen.getByTestId('dock-readout').textContent).toContain('not in');
    fireEvent.click(screen.getByRole('radio', { name: '↓ Descending' }));
    expect(pitches()).toEqual(DOWN);
    expect(screen.getByTestId('dock-readout').textContent).toContain('subtonic');
    expect(screen.getByTestId('dock-readout').textContent).not.toContain('not in');
    for (const [midi, degree] of [[77, 6], [79, 7]] as const) {
      const key = container.querySelector<HTMLElement>(`[data-piano-key][data-midi="${midi}"]`)!;
      expect(key.style.backgroundColor).toContain(DEGREE_COLORS[degree]);
    }
    expect(screen.getByTestId('harmony').textContent).toBe(harmony);
    fireEvent.click(screen.getByRole('radio', { name: '↑ Ascending' }));
    expect(pitches()).toEqual(UP);
    // The session direction must not alter another scale or Learn's context.
    fireEvent.click(screen.getByRole('radio', { name: '↓ Descending' }));
    act(() => useAppStore.setState({ selectedScale: 'major' }));
    expect(pitches()).toEqual([1, 2, 4, 6, 8, 9, 11]);
    act(() => useAppStore.setState({ selectedScale: 'melodic_minor', view: 'learn' }));
    expect(pitches()).toEqual(UP);
  });

  it.each([
    ['dock', 0], ['dock', 'all'], ['neck', 0], ['neck', 'all'],
  ] as const)('guitar %s, position %s: pitches, degree labels and colours follow direction', (variant, position) => {
    useAppStore.setState({ instrument: 'guitar', guitarScalePosition: position });
    const { container } = render(<><ScaleStrip /><Fretboard variant={variant} /></>);
    const dots = () => [...container.querySelectorAll<HTMLElement>('[data-dot]')];
    const pitches = () => pitchSet(dots().map(dotPc));
    expect(pitches()).toEqual(UP);
    fireEvent.click(screen.getByRole('radio', { name: '↓ Descending' }));
    expect(pitches()).toEqual(DOWN);
    for (const [pc, degree] of [[5, 6], [7, 7]] as const) {
      const matching = dots().filter((el) => dotPc(el) === pc);
      expect(matching.length).toBeGreaterThan(0);
      for (const dot of matching) {
        expect(dot.textContent).toBe(`♭${degree}`);
        const expected = document.createElement('div');
        expected.style.backgroundColor = DEGREE_COLORS[degree];
        // Whole-neck dots use translucent fills, with the degree hue on the border.
        expect(dot.style.border).toContain(expected.style.backgroundColor);
      }
    }
    fireEvent.click(screen.getByRole('radio', { name: '↑ Ascending' }));
    expect(pitches()).toEqual(UP);
    expect(dots().filter((el) => dotPc(el) === 8).every((el) => el.textContent === '7')).toBe(true);
  });
});
