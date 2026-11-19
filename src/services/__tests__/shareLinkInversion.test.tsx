/**
 * Audit A6 (2026-11-18): "Copy link" on C major, first inversion (E in the
 * bass) made a link that opened in root position. The link now carries the
 * inversion (`inv`, a whole number 1 … notes − 1, only beside `chord`); a link
 * without it opens as before (root position); a malformed or out-of-range
 * value is ignored, never an error. The recipient sees the inversion chosen
 * and hears E as the lowest note.
 */
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act, renderHook } from '@testing-library/react';
import { useAppStore } from '../../state/store';
import { readShareParams, buildShareUrl, SHARE_PARAM_KEYS } from '../../state/shareParams';
import { parseShareLink, isEmptyTarget } from '../shareLinkParse';
import { applyShareTarget, openShareLink, resetShareLinkOpen } from '../shareLinkOpen';
import { exploreLinkValues } from '../shareLinkMake';
import { buildChord, CHORD_SYMBOLS } from '../../core/constants/chords';
import { noteToString, type ChordQuality, type Note } from '../../core/types/music';
import { CurrentChordPanel } from '../../components/panels/CurrentChordPanel';
import * as audio from '../../core/services/audio';
import { useKeyContext } from '../../hooks/useKeyContext';
import { getResults } from '../../components/navigation/quickSearchResults';
import { executeTheoryQuery } from '../../utils/queryExecutor';

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const make = (tag: string) => (props: Record<string, unknown>) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
    return React.createElement(tag, clean);
  };
  const cache = new Map<string, ReturnType<typeof make>>();
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => cache.get(prop) ?? cache.set(prop, make(prop)).get(prop) });
  return { motion: proxy, m: proxy, AnimatePresence: (p: { children: React.ReactNode }) => p.children, LazyMotion: (p: { children: React.ReactNode }) => p.children, domAnimation: {} };
});

const C: Note = { natural: 'C', accidental: '' };
const heard: number[] = [];

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  const param = () => ({ value: 1, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), setTargetAtTime: vi.fn(), cancelScheduledValues: vi.fn() });
  const ctx = {
    sampleRate: 44100, state: 'running', currentTime: 0, destination: {},
    resume: vi.fn().mockResolvedValue(undefined), close: vi.fn(),
    createGain: vi.fn(() => ({ gain: param(), connect: vi.fn(), disconnect: vi.fn() })),
    createOscillator: vi.fn(() => ({ type: 'sine', frequency: { value: 0 }, detune: { value: 0 }, connect: vi.fn(), start: vi.fn(), stop: vi.fn(), disconnect: vi.fn(), onended: null })),
    createDynamicsCompressor: vi.fn(() => ({ threshold: { value: 0 }, knee: { value: 0 }, ratio: { value: 0 }, attack: { value: 0 }, release: { value: 0 }, connect: vi.fn() })),
    createConvolver: vi.fn(() => ({ buffer: null, connect: vi.fn() })),
    createBiquadFilter: vi.fn(() => ({ type: 'lowpass', frequency: { value: 0 }, Q: { value: 1 }, connect: vi.fn(), disconnect: vi.fn() })),
    createBuffer: vi.fn((c: number, l: number, sr: number) => ({ numberOfChannels: c, length: l, sampleRate: sr, getChannelData: vi.fn(() => new Float32Array(l)) })),
  };
  vi.stubGlobal('AudioContext', function MockAudioContext() { return ctx; } as unknown as typeof AudioContext);
  audio.setInstrumentVoice({
    playNote: (midi: number) => { heard.push(midi); return true; },
    startNote: () => true, stopNote: () => {}, setVolume: () => {}, resume: () => Promise.resolve(), cancelScheduled: () => {},
  });
});

beforeEach(() => {
  useAppStore.setState({
    selectedKey: C, selectedScale: 'major', selectedChord: null, chordInversion: 0,
    instrument: 'piano', view: 'explore', lastView: 'explore', pendingLearnTarget: null, lessonLoan: null,
    exploreDetail: 'full', baseOctave: 4, exerciseInputActive: false,
  });
  resetShareLinkOpen();
});

afterEach(() => {
  cleanup();
  heard.length = 0;
  resetShareLinkOpen();
});

const linkFor = (chordInversion: number, chord = buildChord(C, 'major')) =>
  buildShareUrl('https://fermatina.test', exploreLinkValues({ selectedKey: C, selectedScale: 'major', selectedChord: chord, instrument: 'piano', chordInversion }));

describe('making a link: the inversion on screen is in it', () => {
  it('C major, first inversion → …&chord=C&…&inv=1; root position writes no inv (old links unchanged)', () => {
    expect(new URL(linkFor(1)).search).toBe('?key=C&scale=major&chord=C&inst=piano&inv=1');
    expect(new URL(linkFor(2)).search).toBe('?key=C&scale=major&chord=C&inst=piano&inv=2');
    expect(new URL(linkFor(0)).search).toBe('?key=C&scale=major&chord=C&inst=piano');
  });

  it('no chord, no inversion; with the Progression panel open the chord (and so the inversion) is not shared', () => {
    const values = exploreLinkValues({ selectedKey: C, selectedScale: 'major', selectedChord: null, instrument: 'piano', chordInversion: 1 });
    expect(values.inv).toBeUndefined();
    const panel = exploreLinkValues(
      { selectedKey: C, selectedScale: 'major', selectedChord: buildChord(C, 'major'), instrument: 'piano', chordInversion: 1 },
      { progression: { chords: ['C', 'G'], bpm: 90, beats: 4 }, capo: 0 },
    );
    expect(panel.chord).toBeUndefined();
    expect(panel.inv).toBeUndefined();
  });

  it('`inv` is a share parameter: it is read, and cleaned from the address with the rest', () => {
    expect(SHARE_PARAM_KEYS).toContain('inv');
    expect(readShareParams('?chord=C&inv=1')).toEqual({ chord: 'C', inv: '1' });
  });
});

describe('reading a link: only a valid inversion of a valid chord counts', () => {
  it('a whole number 1 … notes − 1 beside a chord', () => {
    expect(parseShareLink({ chord: 'C', inv: '1' }).inversion).toBe(1);
    expect(parseShareLink({ chord: 'C', inv: '2' }).inversion).toBe(2);
    expect(parseShareLink({ chord: 'G7', inv: '3' }).inversion).toBe(3);
    expect(parseShareLink({ chord: 'C', inv: ' 1 ' }).inversion).toBe(1);
  });

  it.each(['3', '9', '-1', '1.5', 'x', '', '1e0', '0x1', 'first', '١', '01a', '9999'])('chord C with inv="%s": ignored, the chord still opens', (inv) => {
    const target = parseShareLink({ chord: 'C', inv });
    expect(target.inversion).toBeUndefined();
    expect(target.chord && noteToString(target.chord.root) + target.chord.quality).toBe('Cmajor');
  });

  it('inv 0 is root position (written by nobody, read as the default)', () => {
    expect(parseShareLink({ chord: 'C', inv: '0' }).inversion).toBeUndefined();
  });

  it('an inversion with no valid chord is ignored, and alone it is nothing valid', () => {
    expect(parseShareLink({ chord: 'Hzz', inv: '1' }).inversion).toBeUndefined();
    expect(parseShareLink({ key: 'D', inv: '1' }).inversion).toBeUndefined();
    expect(isEmptyTarget(parseShareLink({ inv: '1' }))).toBe(true);
  });
});

describe('opening a link', () => {
  it('C major, first inversion: the chord opens in first inversion', async () => {
    useAppStore.setState({ view: 'learn', lastView: 'learn' });
    await expect(openShareLink(readShareParams('?key=C&scale=major&chord=C&inst=piano&inv=1'))).resolves.toBe('applied');
    const s = useAppStore.getState();
    expect(s.view).toBe('explore');
    expect(s.selectedChord && noteToString(s.selectedChord.root) + s.selectedChord.quality).toBe('Cmajor');
    expect(s.chordInversion).toBe(1);
  });

  it('an old link (no inv) opens in root position, whatever was on screen before', async () => {
    useAppStore.setState({ selectedChord: buildChord(C, 'major'), chordInversion: 2 });
    await openShareLink(readShareParams('?key=C&scale=major&chord=C&inst=piano'));
    expect(useAppStore.getState().chordInversion).toBe(0);
  });

  it('a malformed inv opens the chord in root position, no error', async () => {
    await expect(openShareLink(readShareParams('?chord=C&inv=banana'))).resolves.toBe('applied');
    expect(useAppStore.getState().chordInversion).toBe(0);
    expect(useAppStore.getState().selectedChord?.quality).toBe('major');
  });

  it('in Simple view (which has no inversions and resets them) the chord opens in root position', () => {
    useAppStore.setState({ exploreDetail: 'simple' });
    applyShareTarget(parseShareLink({ chord: 'C', inv: '1' }));
    expect(useAppStore.getState().selectedChord?.quality).toBe('major');
    expect(useAppStore.getState().chordInversion).toBe(0);
  });

  it('every quality on C, every inversion: made, read and opened back exactly', () => {
    for (const quality of Object.keys(CHORD_SYMBOLS) as ChordQuality[]) {
      const chord = buildChord(C, quality);
      for (let inv = 0; inv < chord.notes.length; inv++) {
        const url = linkFor(inv, chord);
        const target = parseShareLink(readShareParams(new URL(url).search));
        useAppStore.setState({ selectedChord: null, chordInversion: 0 });
        applyShareTarget(target);
        expect(useAppStore.getState().chordInversion, `${quality} inv ${inv}: ${url}`).toBe(inv);
      }
    }
  });

  it('the recipient sees "1st Inv" chosen and hears E as the lowest note', async () => {
    await openShareLink(readShareParams('?key=C&scale=major&chord=C&inst=piano&inv=1'));
    const s = useAppStore.getState();
    render(<CurrentChordPanel chord={s.selectedChord!} />);
    expect(screen.getByRole('radio', { name: '1st Inv' }).getAttribute('aria-checked')).toBe('true');
    const tones = screen.getByRole('group', { name: 'Notes' }).querySelectorAll('button');
    expect(tones[0].textContent).toMatch(/^E/);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Chord' })); });
    expect(heard.length).toBe(3);
    expect(Math.min(...heard) % 12).toBe(4); // E
  });
});

/**
 * Review of b94d761, item 7 (from the second audit): "C/E" opened as
 * "C Major/E" with the Voicing chip on Root and E3 and E4 lit. A slash chord
 * whose bass is a chord tone IS an inversion — from search, a lesson's Try
 * This and a shared link — and the chip, the lit keys, the block chord and the
 * arpeggio agree.
 */
describe('a slash chord whose bass is a chord tone opens as that inversion, and everything agrees', () => {
  const sorted = (xs: Iterable<number>) => [...xs].sort((a, b) => a - b);

  async function heardFor(button: 'Chord' | 'Arpeggio') {
    heard.length = 0;
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: button })); });
    await act(async () => { await new Promise((ok) => setTimeout(ok, 1200)); });
    return sorted(heard);
  }

  const OPENERS: [string, (symbol: string) => void | Promise<unknown>][] = [
    ['search', (symbol) => getResults(symbol).find((r) => r.type === 'Chord')!.action()],
    ['a lesson\'s Try This', (symbol) => executeTheoryQuery(symbol)],
    ['a shared link', (symbol) => openShareLink({ chord: symbol })],
  ];

  for (const [from, open] of OPENERS) {
    it.each([['C/E', '1st Inv', 1, 4], ['C/G', '2nd Inv', 2, 7], ['G7/F', '3rd Inv', 3, 5]] as const)(`${from}: %s → %s, the lowest note its bass, heard == lit, no note doubled`, async (symbol, chip, inv, bassPc) => {
      await open(symbol);
      const s = useAppStore.getState();
      expect(s.chordInversion).toBe(inv);
      expect(s.selectedChord?.bassNote).toBeUndefined();
      const lit = sorted(renderHook(() => useKeyContext()).result.current.chordVoicingMidi);
      expect(lit.length).toBe(s.selectedChord!.notes.length);
      expect(lit[0] % 12).toBe(bassPc);
      render(<CurrentChordPanel chord={s.selectedChord!} />);
      expect(screen.getByRole('radio', { name: chip }).getAttribute('aria-checked')).toBe('true');
      expect(await heardFor('Chord')).toEqual(lit);
      expect(await heardFor('Arpeggio')).toEqual(lit);
    });
  }
});
