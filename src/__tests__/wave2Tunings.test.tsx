/**
 * Seam 4 (wave 2 integration): one rule for "the chord shapes apply", on both
 * surfaces. For every tuning the app offers (and an id it does not know), with
 * a capo on 3 and B♭ selected: the Progression panel offers capo ideas and
 * names shapes exactly when the neck draws grips and names its shape, and it
 * says "standard tuning only" exactly when the neck does. The rule is
 * `hasChordShapes` (core/constants/guitarTunings.ts).
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { useAppStore } from '../state/store';
import { ChordsCard } from '../components/explore/ChordsCard';
import { ProgressionHost } from '../components/explore/ProgressionHost';
import { Fretboard } from '../components/instruments/Fretboard';
import { resetProgressionPanel } from '../state/progressionPanel';
import { setCapoFret } from '../state/capo';
import { stopLoop } from '../components/explore/progression/loopController';
import { GUITAR_TUNINGS, hasChordShapes } from '../core/constants/guitarTunings';
import { buildChord } from '../core/constants/chords';

vi.mock('../core/services/audio', async (orig) => ({
  ...(await orig<Record<string, unknown>>()),
  resumeAudio: vi.fn(async () => {}),
  playTimedNotes: vi.fn(),
  cancelScheduledAudio: vi.fn(),
}));
vi.mock('../hooks/useAudio', () => ({ useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }) }));
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const make = (tag: string) => (props: Record<string, unknown>) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
    return React.createElement(tag, clean);
  };
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => make(prop) });
  return { motion: proxy, m: proxy, AnimatePresence: (p: { children: React.ReactNode }) => p.children, LazyMotion: (p: { children: React.ReactNode }) => p.children, domAnimation: {} };
});
vi.mock('../components/notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return { StaffNotation: () => React.createElement('div', { 'data-testid': 'staff' }) };
});

const BB = { natural: 'B', accidental: 'b' } as const;
// With the capo on (fret 3, set below) the notice says where the notes are:
// from the capo up, not "the whole neck" (final review of wave 2).
const SHAPES_ONLY_STANDARD = 'Chord shapes are for standard tuning only. Showing the chord\'s notes from the capo up.';
const CAPO_ONLY_STANDARD = "Capo ideas need standard tuning: Fermatina's chord shapes are for standard tuning only.";

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
beforeEach(() => {
  localStorage.clear();
  resetProgressionPanel();
  useAppStore.setState({
    view: 'explore', language: 'en', exploreDetail: 'full', instrument: 'guitar',
    selectedKey: BB, selectedScale: 'major', selectedChord: buildChord(BB, 'major'), chordInversion: 0,
    exerciseInputActive: false, guitarScalePosition: null, neckNutSide: 'right', neckTopString: 'low',
    progression: { chords: ['Bb', 'Eb', 'F'], bpm: 90, beats: 4 },
  } as never);
  setCapoFret(3);
});
afterEach(() => {
  stopLoop('user');
  cleanup();
  resetProgressionPanel();
  setCapoFret(0);
  useAppStore.setState({ progression: undefined, guitarTuningId: 'standard', selectedChord: null });
});

const TUNING_IDS = [...GUITAR_TUNINGS.map((t) => t.id), 'no-such-tuning'];

describe('seam 4: capo ideas and the neck\'s grips follow one tuning rule', () => {
  it('the rule: standard (and an unknown id, which the neck draws as standard) — nothing else', () => {
    expect(TUNING_IDS.filter(hasChordShapes)).toEqual(['standard', 'no-such-tuning']);
  });

  it.each(TUNING_IDS)('%s: the panel and the neck agree', async (id) => {
    useAppStore.setState({ guitarTuningId: id });
    render(<><ChordsCard /><ProgressionHost /><Fretboard /></>);
    act(() => fireEvent.click(screen.getByTestId('progression-toggle')));
    await screen.findByTestId('progression-panel');
    const shapes = hasChordShapes(id);
    // The neck: grips and its "B♭: the G shape" line, or the standard-only notice.
    const neckLine = screen.queryAllByTestId('capo-line').map((e) => e.textContent);
    const neckNotice = screen.queryAllByText(SHAPES_ONLY_STANDARD).length > 0;
    // The panel: "Capo on fret 3: play G, C, D." and the ideas, or its standard-only line.
    const panelNow = screen.queryByTestId('progression-capo-now')?.textContent ?? null;
    const panelIdeas = screen.queryByRole('radiogroup', { name: 'Capo ideas, for shapes with open strings' }) !== null;
    const panelNotice = screen.queryByTestId('progression-capo-standard')?.textContent ?? null;
    expect({ neckLine: neckLine.length > 0, panelNow: panelNow !== null, panelIdeas }).toEqual({ neckLine: shapes, panelNow: shapes, panelIdeas: shapes });
    expect({ neckNotice, panelNotice: panelNotice !== null }).toEqual({ neckNotice: !shapes, panelNotice: !shapes });
    if (shapes) {
      expect(new Set(neckLine)).toEqual(new Set(['B♭: the G shape, capo on fret 3']));
      expect(panelNow).toBe('Capo on fret 3: play G, C, D.');
    } else {
      expect(panelNotice).toBe(CAPO_ONLY_STANDARD);
    }
  });
});
