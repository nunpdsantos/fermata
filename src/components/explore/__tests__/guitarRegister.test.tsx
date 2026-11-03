/// <reference types="node" />
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScaleStrip } from '../ScaleStrip';
import { ExploreHeader } from '../ExploreHeader';
import { ChordsCard } from '../ChordsCard';
import { CircleOfFifths } from '../../theory/CircleOfFifths';
import { Fretboard } from '../../instruments/Fretboard';
import { useAppStore } from '../../../state/store';
import { useFocusNoteStore } from '../../../state/focusNoteStore';
import { useScaleDirectionStore } from '../../../state/scaleDirectionStore';
import { buildChord } from '../../../core/constants/chords';
import { cancelScheduledAudio, setInstrumentVoice } from '../../../core/services/audio';
import { installMockAudioContext } from '../../../test/mockAudioContext';
import type { Note } from '../../../core/types/music';
import { readFileSync } from 'node:fs';

// Observe the actual keys sent to VexFlow, while still rendering its real SVG.
const { keys, noteOn } = vi.hoisted(() => ({ keys: [] as string[][], noteOn: vi.fn().mockResolvedValue(57) }));
vi.mock('../../../utils/vexflowLoader', async (original) => {
  const loader = await original<typeof import('../../../utils/vexflowLoader')>();
  const vf = await loader.loadVexFlow();
  class ObservedStaveNote extends vf.StaveNote {
    constructor(options: ConstructorParameters<typeof vf.StaveNote>[0]) {
      super(options);
      keys.push(options.keys!);
    }
  }
  return { ...loader, loadVexFlow: async () => ({ ...vf, StaveNote: ObservedStaveNote }) };
});
vi.mock('../../../hooks/useAudio', () => ({ useAudio: () => ({ noteOn, noteOff: vi.fn() }) }));

const heard: number[] = [];
const voice = {
  playNote: (midi: number) => { heard.push(midi); return true; },
  startNote: () => true, stopNote: () => {}, setVolume: () => {},
  resume: async () => {}, cancelScheduled: () => {},
};
const a: Note = { natural: 'A', accidental: '' };
const c: Note = { natural: 'C', accidental: '' };
const columns = () => [...document.querySelectorAll<HTMLElement>('.strip-col')];
const stripMidi = () => columns().map((el) => Number(el.dataset.midi));
const click = async (el: Element) => { await act(async () => { fireEvent.click(el); }); };
async function drawn(count: number) {
  await waitFor(() => expect(document.querySelectorAll('svg g.vf-stavenote')).toHaveLength(count));
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
  installMockAudioContext(1);
  setInstrumentVoice(voice);
  keys.length = 0;
  heard.length = 0;
  noteOn.mockClear();
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn();
  useFocusNoteStore.getState().clearAll();
  useScaleDirectionStore.setState({ direction: 'ascending' });
  useAppStore.setState({
    selectedKey: a, selectedScale: 'natural_minor', selectedChord: null, chordInversion: 0,
    instrument: 'piano', baseOctave: 4, view: 'explore', exerciseInputActive: false,
    guitarTuningId: 'standard', guitarScalePosition: 0, activeNotes: new Set(),
    highlightedNotes: [], language: 'en', themeMode: 'fermata', synthPreset: 'piano',
  });
});
afterEach(() => {
  cleanup();
  cancelScheduledAudio();
  setInstrumentVoice(null);
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('scale strip flow and clef clearance', () => {
  it.each([
    [c, 'major', 428, 78], [c, 'major', 1050, 78],
    [a, 'natural_minor', 428, 81], [a, 'natural_minor', 1050, 81],
  ] as const)('%s %s at width %s: guitar shares piano flow and keeps the 8 clear of labels', async (selectedKey, selectedScale, width, expectedFlow) => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(width);
    // Measured advance widths from the bundled Bravura hmtx table. Without
    // a canvas jsdom otherwise gives every glyph zero width, collapsing
    // the clef prefix and invalidating horizontal clearance measurements.
    const advances: Record<string, number> = { '\uE050': 671, '\uE052': 664, '\uE0A2': 422 };
    const context = {
      font: '',
      measureText(text: string) {
        const size = Number(this.font.match(/([\d.]+)pt/)?.[1] ?? 30) * 4 / 3;
        const advance = [...text].reduce((sum, ch) => sum + (advances[ch] ?? 0), 0);
        return { width: advance * size / 1000, actualBoundingBoxAscent: 0, actualBoundingBoxDescent: 0 };
      },
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
    const stripCss = readFileSync('src/index.css', 'utf8');
    // jsdom does not lay out CSS. Read the actual label-band declaration,
    // then combine it with rendered SVG coordinates and percentage margins.
    const rule = (name: string) => stripCss.match(new RegExp(`\\.${name} \\{([^}]+)\\}`))![1];
    const labelRoom = Number(rule('strip-labels-room').match(/height: (\d+)px/)![1]);
    for (const name of ['strip-body', 'strip-staff', 'strip-labels-room']) {
      expect(rule(name)).toContain('overflow: visible');
    }
    const flows: number[] = [];
    for (const instrument of ['piano', 'guitar'] as const) {
      useAppStore.setState({ selectedKey, selectedScale, instrument });
      const view = render(<ScaleStrip />);
      await drawn(8);
      const svg = document.querySelector<SVGSVGElement>('.strip-staff svg')!;
      const staff = document.querySelector<HTMLElement>('.strip-staff')!;
      const body = document.querySelector<HTMLElement>('.strip-body')!;
      const staffWidth = parseFloat(body.style.width);
      const top = -parseFloat(staff.style.marginTop) * staffWidth / 100;
      const bottomTrim = -parseFloat(staff.style.marginBottom) * staffWidth / 100;
      const height = Number(svg.getAttribute('height'));
      const flow = height - top - bottomTrim;
      flows.push(flow);
      expect(flow).toBeCloseTo(expectedFlow);
      if (instrument === 'guitar') {
        const clef = svg.querySelector('g.vf-clef text')!;
        expect(clef.textContent).toBe('\uE052');
        // Independent bundled Bravura outline, 1000 units/em at 40px.
        // The full glyph bounds enclose the 8, so horizontal separation of
        // this box proves separation of the 8 from the entire label column.
        const ink = {
          left: Number(clef.getAttribute('x')),
          right: Number(clef.getAttribute('x')) + 671 * 0.04,
          top: Number(clef.getAttribute('y')) - 1098 * 0.04,
          bottom: Number(clef.getAttribute('y')) + 878 * 0.04,
        };
        expect(ink.left).toBeGreaterThanOrEqual(0);
        expect(ink.right).toBeLessThanOrEqual(staffWidth);
        expect(ink.top).toBeGreaterThanOrEqual(top);
        expect(ink.bottom).toBeLessThanOrEqual(height);
        expect(ink.bottom - top).toBeLessThanOrEqual(flow + labelRoom);
        expect(ink.bottom - top).toBeGreaterThan(flow);
        for (const col of columns()) {
          const labelLeft = parseFloat(col.style.left) * staffWidth / 100;
          expect(ink.right, 'complete clef lies left of every label column box').toBeLessThanOrEqual(labelLeft);
        }
      }
      view.unmount();
    }
    expect(flows[1]).toBeCloseTo(flows[0]);
  });
});

describe('Explore scale register, through the real staff and audio scheduler', () => {
  it.each(['piano', 'guitar'] as const)('%s: A minor writes a4…a5 and taps/Play scale sound the strip pitches', async (instrument) => {
    useAppStore.setState({ instrument });
    render(<><ScaleStrip /><ExploreHeader /></>);
    await drawn(8);
    expect(keys.slice(-8).flat()).toEqual(['a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5', 'a/5']);
    const expected = instrument === 'guitar' ? [57, 59, 60, 62, 64, 65, 67, 69] : [69, 71, 72, 74, 76, 77, 79, 81];
    expect(stripMidi()).toEqual(expected);
    const clef = document.querySelector('g.vf-clef')!.textContent!;
    expect([...clef].map((ch) => ch.codePointAt(0))).toContain(instrument === 'guitar' ? 0xe052 : 0xe050);
    for (const [i, col] of columns().entries()) {
      await click(col);
      const [pitch, octave] = noteOn.mock.calls.at(-1)!;
      expect(pitch.octave).toBe(Math.floor(expected[i] / 12) - 1);
      expect(octave).toBe(pitch.octave);
      expect(useFocusNoteStore.getState().pinned?.midi).toBe(expected[i]);
    }
    await click(screen.getByRole('button', { name: 'Play scale ascending' }));
    expect(heard).toEqual(expected);
  });

  it.each([2, 5])('guitar Play scale ignores piano preference %s and starts on the strip’s A3', async (baseOctave) => {
    useAppStore.setState({ instrument: 'guitar', baseOctave });
    render(<><ScaleStrip /><ExploreHeader /></>);
    await drawn(8);
    await click(screen.getByRole('button', { name: 'Play scale ascending' }));
    expect(heard).toEqual(stripMidi());
    expect(heard[0]).toBe(57);
  });

  it('piano keeps its existing preference for playback and fixed staff register', async () => {
    useAppStore.setState({ baseOctave: 2 });
    render(<><ScaleStrip /><ExploreHeader /></>);
    await drawn(8);
    await click(screen.getByRole('button', { name: 'Play scale ascending' }));
    expect(stripMidi()).toEqual([69, 71, 72, 74, 76, 77, 79, 81]);
    expect(heard).toEqual([45, 47, 48, 50, 52, 53, 55, 57]);
  });

  it('instrument switching updates the strip and callback; A3 lights string 3 fret 2, A4 falls back to A pitch class', async () => {
    render(<><ScaleStrip /><ExploreHeader /><Fretboard /></>);
    await drawn(8);
    act(() => useAppStore.setState({ instrument: 'guitar', baseOctave: 5 }));
    await click(columns()[0]);
    expect(useFocusNoteStore.getState().pinned).toEqual({ pc: 9, midi: 57, source: 'staff' });
    expect(useFocusNoteStore.getState().locations?.items).toEqual(['string 3 fret 2']);
    await click(columns()[7]);
    expect(useFocusNoteStore.getState().pinned?.midi).toBe(69);
    expect(useFocusNoteStore.getState().locations?.items).toEqual(['string 5 open', 'string 3 fret 2']);
    await click(screen.getByRole('button', { name: 'Play scale ascending' }));
    expect(heard).toEqual([57, 59, 60, 62, 64, 65, 67, 69]);
  });

  it('guitar melodic minor descent draws and plays natural minor at the same lower register', async () => {
    useAppStore.setState({ instrument: 'guitar', selectedScale: 'melodic_minor' });
    useScaleDirectionStore.setState({ direction: 'descending' });
    render(<><ScaleStrip /><ExploreHeader /></>);
    await drawn(8);
    expect(keys.slice(-8).flat()).toEqual(['a/5', 'g/5', 'f/5', 'e/5', 'd/5', 'c/5', 'b/4', 'a/4']);
    expect(stripMidi()).toEqual([69, 67, 65, 64, 62, 60, 59, 57]);
    await click(screen.getByRole('button', { name: /Play classical melodic minor ascending and descending/i }));
    expect(heard).toEqual([57, 59, 60, 62, 64, 66, 68, 69, 67, 65, 64, 62, 60, 59, 57]);
  });
});

describe('other Explore guitar sounds', () => {
  it.each([
    [0, undefined, [48, 52, 55], ['c/4', 'e/4', 'g/4']],
    [1, undefined, [52, 55, 60], ['e/4', 'g/4', 'c/5']],
    [0, { natural: 'G', accidental: '' }, [43, 48, 52, 55], ['g/3', 'c/4', 'e/4', 'g/4']],
  ] as const)('chord staff, Chord and Arpeggio agree (inversion %s, bass %s)', async (chordInversion, bassNote, midis, written) => {
    useAppStore.setState({ instrument: 'guitar', baseOctave: 2, chordInversion, selectedChord: { ...buildChord(c, 'major'), bassNote } });
    render(<ChordsCard />);
    await drawn(1);
    expect(keys.at(-1)).toEqual(written);
    await click(screen.getByRole('button', { name: 'Chord' }));
    expect(heard).toEqual(midis);
    expect([...useAppStore.getState().activeNotes]).toEqual(midis);
    heard.length = 0;
    await click(screen.getByRole('button', { name: 'Arpeggio' }));
    expect(heard).toEqual(midis);
    // Tone buttons carry the same sounding MIDI as the chord, including its bass.
    const tones = document.querySelectorAll<HTMLElement>('.tone-btn');
    expect(tones.length).toBeGreaterThan(0);
    for (const tone of tones) {
      await click(tone);
      expect(midis).toContain(useFocusNoteStore.getState().pinned?.midi);
      expect(noteOn.mock.calls.at(-1)![1]).toBe(Math.floor(useFocusNoteStore.getState().pinned!.midi! / 12) - 1);
    }
  });

  it.each(['piano', 'guitar'] as const)('circle tonic playback uses the %s register', async (instrument) => {
    useAppStore.setState({ instrument, baseOctave: 2 });
    const { container } = render(<CircleOfFifths />);
    await click(container.querySelector('[data-key="C major"]')!);
    expect(heard).toEqual([instrument === 'guitar' ? 48 : 60]);
  });

  it('builder plays its recognised chord in the staff register, including the selected inversion', async () => {
    useAppStore.setState({ instrument: 'guitar', selectedKey: c, selectedScale: 'major', baseOctave: 5 });
    render(<ChordsCard />);
    await click(screen.getByRole('tab', { name: 'Build' }));
    const strip = screen.getByRole('group', { name: /Chromatic strip/ });
    const blocks = within(strip).getAllByRole('button');
    await click(blocks[4]);
    await click(blocks[7]);
    act(() => useAppStore.setState({ chordInversion: 1 }));
    await drawn(1);
    expect(keys.at(-1)).toEqual(['e/4', 'g/4', 'c/5']);
    await click(screen.getByRole('button', { name: 'Play' }));
    expect(heard).toEqual([52, 55, 60]);
  });

  it('builder’s unrecognised single-note set also plays in the guitar register', async () => {
    useAppStore.setState({ instrument: 'guitar', selectedKey: c, baseOctave: 5 });
    render(<ChordsCard />);
    await click(screen.getByRole('tab', { name: 'Build' }));
    await click(screen.getByRole('button', { name: 'Play' }));
    expect(heard).toEqual([48]);
    expect(screen.queryByTestId('chord-staff')).toBeNull();
  });
});
