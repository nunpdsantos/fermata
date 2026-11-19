/// <reference types="node" />
/**
 * Audit M58 and M59 (music audit 2, 18 November 2026), compared pitch by
 * pitch through the real components, the real staff (VexFlow, its keys
 * observed) and the real audio scheduler (a recording voice):
 *
 *  - M58: a chord's ▶ Chord, its small staff, its ▶ Arpeggio and the keys
 *    the piano lights are ONE voicing — slash bass included, at the piano's
 *    octave. At 153caab, piano at C4: C/E (kept as written: Simple view, a
 *    progression) sounded E3 C4 E4 G4 while the staff drew and the arpeggio
 *    played C4 E4 G4; a bass outside the chord (C/D, C/B♭, Dm7/G) was
 *    doubled an octave up and pushed the chord up an octave (Dm7/G: G3 G4
 *    D5 F5 A5 C6); at C3 the chord was open, the arpeggio close and the
 *    staff at C4.
 *  - M59: the staff strip draws, lists and sounds the scale at the piano's
 *    octave, where ▶ Play scale plays it (C3: C3–C4, not C4–C5).
 *
 * A staff's sounding pitches are read from what it was given (VexFlow's
 * keys) and from the clef it drew: a guitar's treble-8vb and a piano's 8vb
 * bass are written an octave above sounding, an 8va treble an octave below.
 */
import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChordsCard } from '../ChordsCard';
import { ScaleStrip } from '../ScaleStrip';
import { ExploreHeader } from '../ExploreHeader';
import { useAppStore } from '../../../state/store';
import { useFocusNoteStore } from '../../../state/focusNoteStore';
import { useScaleDirectionStore } from '../../../state/scaleDirectionStore';
import { useKeyContext } from '../../../hooks/useKeyContext';
import { buildChord } from '../../../core/constants/chords';
import { buildScale } from '../../../core/constants/scales';
import { octaveFitsKeyboard } from '../../../core/utils/pianoLayout';
import { chordFromParsed, parseChordSymbol } from '../../../core/utils/chordParser';
import { inversionOfBass } from '../../../utils/chordSelection';
import { cancelScheduledAudio, setInstrumentVoice } from '../../../core/services/audio';
import { installMockAudioContext } from '../../../test/mockAudioContext';
import { stringToNote, type Chord, type Note, type ScaleType } from '../../../core/types/music';

const { keys, noteOn } = vi.hoisted(() => ({ keys: [] as string[][], noteOn: vi.fn().mockResolvedValue(60) }));
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

const heard: { midi: number; when: number }[] = [];
const voice = {
  playNote: (midi: number, when: number) => { heard.push({ midi, when }); return true; },
  startNote: () => true, stopNote: () => {}, setVolume: () => {},
  resume: async () => {}, cancelScheduled: () => {},
};

const LETTER: Record<string, number> = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
const ACC: Record<string, number> = { '': 0, '#': 1, '##': 2, b: -1, bb: -2 };
/** A VexFlow key ('bb/3') as the MIDI number it is written at. */
function writtenMidi(key: string): number {
  const [name, octave] = key.split('/');
  return 12 * (Number(octave) + 1) + LETTER[name[0]] + ACC[name.slice(1)];
}
/** How far the drawn clef writes above sounding, in semitones (its glyph). */
function clefShift(svg: Element | null): number {
  const glyph = svg?.querySelector('g.vf-clef text')?.textContent;
  // gClef8vb (the guitar), fClef8vb: written an octave up; gClef8va: down.
  return glyph === '' || glyph === '' ? 12 : glyph === '' ? -12 : 0;
}
const sorted = (xs: Iterable<number>) => [...xs].sort((a, b) => a - b);
const click = async (el: Element) => { await act(async () => { fireEvent.click(el); }); };
/** The onsets heard since the last call, low to high within each. */
function onsets(): number[][] {
  const out: { when: number; midis: number[] }[] = [];
  for (const p of [...heard].sort((a, b) => a.when - b.when || a.midi - b.midi)) {
    const last = out[out.length - 1];
    if (last && Math.abs(last.when - p.when) < 0.005) last.midis.push(p.midi);
    else out.push({ when: p.when, midis: [p.midi] });
  }
  heard.length = 0;
  return out.map((o) => o.midis);
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
    selectedKey: stringToNote('C'), selectedScale: 'major', selectedChord: null, chordInversion: 0,
    instrument: 'piano', baseOctave: 4, view: 'explore', exerciseInputActive: false, exploreDetail: 'full',
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

/** Select a chord as a symbol opens it: an inversion in Full view, kept as written in Simple (utils/chordSelection.ts). */
function chordAsOpened(symbol: string, simple: boolean): { chord: Chord; inversion: number } {
  const chord = chordFromParsed(parseChordSymbol(symbol)!);
  const inversion = inversionOfBass(chord);
  if (simple || inversion === null) return { chord, inversion: 0 };
  const plain = { ...chord };
  delete plain.bassNote;
  return { chord: plain, inversion };
}

async function measureChord(chord: Chord, inversion: number, instrument: 'piano' | 'guitar', baseOctave: number, simple: boolean) {
  useAppStore.setState({ instrument, baseOctave, exploreDetail: simple ? 'simple' : 'full', selectedChord: chord, chordInversion: inversion });
  const lit = sorted(renderHook(() => useKeyContext()).result.current.chordVoicingMidi);
  const view = render(<ChordsCard />);
  const staffSvg = () => view.container.querySelector('[data-testid="chord-staff"] svg');
  await waitFor(() => expect(staffSvg()?.querySelector('g.vf-stavenote')).toBeTruthy());
  const shift = clefShift(staffSvg());
  const staff = sorted(keys.at(-1)!.map((k) => writtenMidi(k) - shift));
  await click(screen.getByRole('button', { name: 'Chord' }));
  const block = onsets();
  const litWhileSounding = sorted(useAppStore.getState().activeNotes);
  await click(screen.getByRole('button', { name: 'Arpeggio' }));
  const arpeggio = onsets();
  view.unmount();
  useAppStore.setState({ activeNotes: new Set() });
  return { lit, staff, block, litWhileSounding, arpeggio };
}

describe('M58: one voicing — ▶ Chord, the small staff, ▶ Arpeggio and the lit keys', () => {
  const SYMBOLS = ['C', 'C/E', 'C/G', 'G7/F', 'Dm7/G', 'C/D', 'C/Bb', 'Am7', 'Cmaj9', 'F/G', 'Am/G', 'D7/F#'];
  for (const instrument of ['piano', 'guitar'] as const) {
    for (const simple of [false, true]) {
      for (const baseOctave of instrument === 'piano' ? [2, 3, 4, 5, 6] : [4]) {
        it(`${instrument}, ${simple ? 'Simple' : 'Full'} view, octave ${baseOctave}: every chord agrees pitch by pitch`, async () => {
          for (const symbol of SYMBOLS) {
            const { chord, inversion } = chordAsOpened(symbol, simple);
            for (const inv of simple || inversion > 0 ? [inversion] : [0, 1]) {
              const m = await measureChord(chord, inv, instrument, baseOctave, simple);
              const label = `${symbol} inv ${inv}`;
              expect(m.block, `${label}: one block chord`).toHaveLength(1);
              const chordMidis = m.block[0];
              expect(m.staff, `${label}: the staff draws what ▶ Chord plays`).toEqual(chordMidis);
              expect(m.litWhileSounding, `${label}: the keys lit while it sounds`).toEqual(chordMidis);
              if (instrument === 'piano') expect(m.lit, `${label}: the piano's chord keys`).toEqual(chordMidis);
              // One note at a time, from the bottom up: the bass first.
              expect(m.arpeggio.flat(), `${label}: ▶ Arpeggio plays the same notes, low to high`).toEqual(chordMidis);
              expect(m.arpeggio.every((o) => o.length === 1)).toBe(true);
            }
          }
          // 12 chords, rendered and played through the real staff and scheduler: seconds of work, more under load.
        }, 60_000);
      }
    }
  }

  // The audit's own cases (piano at C4), by value: the bass is heard, drawn
  // and arpeggiated first; a bass outside the chord sounds once.
  it.each([
    ['C/E', true, [52, 60, 64, 67]],       // Simple: kept as written, E3 under C4 E4 G4
    ['C/E', false, [64, 67, 72]],          // Full: first inversion (round one)
    ['C/G', true, [55, 60, 64, 67]],
    ['G7/F', true, [53, 67, 71, 74, 77]],   // F3 under G4 B4 D5 F5
    ['Dm7/G', false, [55, 62, 65, 69, 72]], // G3 D4 F4 A4 C5 (was G3 G4 D5 F5 A5 C6)
    ['C/D', false, [50, 60, 64, 67]],      // D3 C4 E4 G4 (was D3 D4 C5 E5 G5)
    ['C/Bb', false, [58, 60, 64, 67]],     // B♭3 C4 E4 G4
  ] as const)('piano at C4, %s (Simple %s): %j everywhere', async (symbol, simple, midis) => {
    const { chord, inversion } = chordAsOpened(symbol, simple);
    const m = await measureChord(chord, inversion, 'piano', 4, simple);
    expect(m.block).toEqual([midis]);
    expect(m.staff).toEqual(midis);
    expect(m.lit).toEqual(midis);
    expect(m.arpeggio).toEqual(midis.map((x) => [x]));
  });

  it('piano at C3: C major is C3 G3 E4 (open) in the chord, the arpeggio and the staff (bass clef), not C3 E3 G3 / C4 E4 G4', async () => {
    const m = await measureChord(buildChord(stringToNote('C'), 'major'), 0, 'piano', 3, false);
    expect(m.block).toEqual([[48, 55, 64]]);
    expect(m.arpeggio).toEqual([[48], [55], [64]]);
    expect(m.staff).toEqual([48, 55, 64]);
  });
});

describe('M58\'s sibling: the builder\'s ▶ plays the selected chord as the detail does', () => {
  it('piano at C3, C major built and set to its first inversion: the builder\'s ▶, the detail\'s ▶ Chord and the lit keys agree', async () => {
    useAppStore.setState({ baseOctave: 3 });
    render(<ChordsCard />);
    await click(screen.getByRole('tab', { name: 'Build' }));
    const blocks = screen.getByRole('group', { name: /Chromatic strip/ }).querySelectorAll('button');
    await click(blocks[4]);
    await click(blocks[7]);
    act(() => useAppStore.setState({ chordInversion: 1 }));
    const lit = sorted(renderHook(() => useKeyContext()).result.current.chordVoicingMidi);
    expect(lit).toEqual([52, 60, 67]); // E3 C4 G4: the open voicing below C4, in first inversion
    onsets();
    await click(screen.getByRole('button', { name: 'Play' }));
    expect(onsets(), 'the builder\'s ▶ (it played C3 G3 E4, root position, at 153caab)').toEqual([lit]);
    await click(screen.getByRole('button', { name: 'Chord' }));
    expect(onsets(), 'the detail\'s ▶ Chord').toEqual([lit]);
  });
});

describe('M59: the staff strip draws, lists and sounds where ▶ Play scale plays', () => {
  const CASES: [string, ScaleType][] = [['C', 'major'], ['A', 'natural_minor'], ['B', 'major'], ['F#', 'major'], ['Eb', 'dorian'], ['G', 'major_blues']];
  for (const [root, type] of CASES) {
    it(`${root} ${type}: octaves 1–7 (each the piano offers) and back to 4`, async () => {
      useAppStore.setState({ selectedKey: stringToNote(root), selectedScale: type });
      const view = render(<><ScaleStrip /><ExploreHeader /></>);
      const strip = () => view.container.querySelector('.strip-staff svg');
      // The octaves the piano's chips offer for this scale (C0 … C7).
      const offered = [4, 3, 1, 0, 2, 5, 6, 7, 4].filter((o) => octaveFitsKeyboard(buildScale(stringToNote(root), type).notes, o));
      expect(offered.length).toBeGreaterThanOrEqual(7);
      const columnMidis = () => [...view.container.querySelectorAll<HTMLElement>('.strip-col')].map((el) => Number(el.dataset.midi));
      const drawnMidis = () => keys.slice(-columnMidis().length).map(([k]) => writtenMidi(k) - clefShift(strip()));
      for (const octave of offered) {
        act(() => useAppStore.setState({ baseOctave: octave }));
        // Let the staff redraw (it may not, at 153caab: then the checks below say why).
        await waitFor(() => expect(drawnMidis()).toEqual(columnMidis())).catch(() => {});
        const columns = columnMidis();
        expect(drawnMidis(), `octave ${octave}: the staff draws the strip's pitches`).toEqual(columns);
        await click(screen.getByRole('button', { name: 'Play scale ascending' }));
        expect(onsets().flat(), `octave ${octave}: ▶ Play scale plays them`).toEqual(columns);
        // Degrees 1 and 8, tapped (the audit's retest).
        noteOn.mockClear();
        const cols = view.container.querySelectorAll<HTMLElement>('.strip-col');
        await click(cols[0]);
        await click(cols[cols.length - 1]);
        const tapped = (noteOn.mock.calls as [Note, number][]).map(([note, oct]) => 12 * (oct + 1) + LETTER[note.natural.toLowerCase()] + ACC[note.accidental]);
        expect(tapped, `octave ${octave}: a tap sounds the column's pitch`).toEqual([columns[0], columns[columns.length - 1]]);
        expect(columns[0] - 12 * (octave + 1), `octave ${octave}: degree 1 is in that octave`).toBeLessThan(12);
        expect(columns[0] - 12 * (octave + 1)).toBeGreaterThanOrEqual(-1); // C♭ is B of the octave below
      }
      view.unmount();
    }, 60_000);
  }
});
