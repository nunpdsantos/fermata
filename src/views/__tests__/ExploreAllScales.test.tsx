/**
 * Audit W0-01 (A-2 / C-12 / U-15): choosing Dim W-H, Dim H-W, Bebop Dominant or
 * Bebop Major crashed the WHOLE app (getRomanNumeral read baseNumerals[7] and
 * called .toLowerCase() on undefined, inside useKeyContext, which the always-on
 * instruments call). The scale is persisted, so the crash survived reload.
 *
 * This suite drives every ScaleType × the 12 KeySelector roots through:
 *   1. the pure paths (diatonic chords + numerals, Copy-summary text), and
 *   2. the rendered Explore surface (ExploreView in the Diatonic and Build
 *      chord-picker modes, plus the Piano and the Fretboard that sit in the
 *      AppShell). The third mode, All chords (ChordBrowser), reads only the
 *      selected root — never the scale or useKeyContext — so it adds no
 *      scale-dependent path and is not looped here.
 * Nothing may throw, and every numeral that is shown must be a real string.
 */
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { Component, type ReactNode } from 'react';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';
import { ExploreView } from '../ExploreView';
import { Piano } from '../../components/instruments/Piano';
import { Fretboard } from '../../components/instruments/Fretboard';
import { useAppStore } from '../../state/store';
import { buildScale, SCALE_FORMULAS } from '../../core/constants/scales';
import { getDiatonicChordsForScale } from '../../core/constants/chords';
import { generateScaleSummary } from '../../utils/exportHelpers';
import type { Note, ScaleType } from '../../core/types/music';

// framer-motion → plain elements; component type cached per tag so re-renders
// don't remount (mirrors DrillView.test.tsx).
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const cache = new Map<string, React.FC<Record<string, unknown>>>();
  function makeMotion(tag: string) {
    const cached = cache.get(tag);
    if (cached) return cached;
    const Comp = function MotionProxy(props: Record<string, unknown>) {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
      }
      return React.createElement(tag, clean);
    };
    cache.set(tag, Comp);
    return Comp;
  }
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => makeMotion(prop) });
  return {
    motion: proxy,
    m: proxy,
    useReducedMotion: () => false,
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    domAnimation: {},
  };
});

// VexFlow never loads in jsdom.
vi.mock('../../components/notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return { StaffNotation: () => React.createElement('div', { 'data-testid': 'staff-mock' }) };
});

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
  // jsdom has no matchMedia; the instruments' responsive hooks need one.
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

// The 12 roots the KeySelector offers.
const ROOTS: Note[] = [
  { natural: 'C', accidental: '' },
  { natural: 'C', accidental: '#' },
  { natural: 'D', accidental: '' },
  { natural: 'E', accidental: 'b' },
  { natural: 'E', accidental: '' },
  { natural: 'F', accidental: '' },
  { natural: 'F', accidental: '#' },
  { natural: 'G', accidental: '' },
  { natural: 'A', accidental: 'b' },
  { natural: 'A', accidental: '' },
  { natural: 'B', accidental: 'b' },
  { natural: 'B', accidental: '' },
];
const SCALE_TYPES = Object.keys(SCALE_FORMULAS) as ScaleType[];
const label = (r: Note, t: ScaleType) => `${r.natural}${r.accidental} ${t}`;

afterEach(cleanup);

beforeEach(() => {
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' },
    selectedScale: 'major',
    selectedChord: null,
    selectedDegree: null,
    chordInversion: 0,
    instrument: 'piano',
    activeNotes: new Set<number>(),
    highlightedNotes: [],
    exerciseInputActive: false,
    guitarScalePosition: null,
    guitarTuningId: 'standard',
    view: 'explore',
    colorMode: 'functional',
    scaleOctaves: 1,
    baseOctave: 4,
    themeMode: 'fermata',
    comparisonScale: null,
    language: 'en',
  });
});

describe('W0-01 diatonic chords + Copy summary — every ScaleType × 12 roots (pure)', () => {
  it('sanity: the matrix covers all 37 scale types and 12 roots', () => {
    expect(SCALE_TYPES.length).toBeGreaterThanOrEqual(37);
    expect(SCALE_TYPES).toContain('bebop_major');
    expect(ROOTS).toHaveLength(12);
  });

  it('getDiatonicChordsForScale never throws and every numeral is a non-empty string', () => {
    const failures: string[] = [];
    for (const type of SCALE_TYPES) {
      for (const root of ROOTS) {
        try {
          const dcs = getDiatonicChordsForScale(buildScale(root, type));
          for (const dc of dcs) {
            if (typeof dc.numeral !== 'string' || dc.numeral.length === 0) {
              failures.push(`${label(root, type)}: blank numeral`);
            }
          }
        } catch (e) {
          failures.push(`${label(root, type)}: THROWS ${(e as Error).message}`);
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it('8-note scales get NO diatonic numerals (no invented numerals beyond VII)', () => {
    for (const type of SCALE_TYPES) {
      const scale = buildScale({ natural: 'C', accidental: '' }, type);
      if (scale.notes.length > 7) {
        expect(getDiatonicChordsForScale(scale), type).toEqual([]);
      }
    }
  });

  it('control: heptatonic scales keep their seven numerals (C dorian = i ii III IV v vi° VII)', () => {
    const dorian = getDiatonicChordsForScale(buildScale({ natural: 'C', accidental: '' }, 'dorian'));
    expect(dorian.map((d) => d.numeral)).toEqual(['i', 'ii', 'III', 'IV', 'v', 'vi°', 'VII']);
  });

  it('Copy-summary text builds for every combo (no padEnd on undefined)', () => {
    const failures: string[] = [];
    for (const type of SCALE_TYPES) {
      for (const root of ROOTS) {
        try {
          const scale = buildScale(root, type);
          const dcs = getDiatonicChordsForScale(scale).map((d, i) => ({ ...d, degree: i + 1 }));
          const text = generateScaleSummary(scale, dcs, null);
          if (!text.includes('Notes:')) failures.push(`${label(root, type)}: no notes line`);
        } catch (e) {
          failures.push(`${label(root, type)}: THROWS ${(e as Error).message}`);
        }
      }
    }
    expect(failures).toEqual([]);
  });
});

// Records render errors instead of letting React tear the tree down, so one
// bad combo is reported by name and the loop continues.
class Catcher extends Component<{ onError: (e: Error) => void; children: ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) {
    return { err };
  }
  componentDidCatch(err: Error) {
    this.props.onError(err);
  }
  render() {
    return this.state.err ? <div data-testid="caught" /> : this.props.children;
  }
}

function renderSurface(onError: (e: Error) => void) {
  return render(
    <Catcher onError={onError}>
      <ExploreView />
      <Piano />
      <Fretboard />
    </Catcher>,
  );
}

describe('W0-01 Explore surface renders for every ScaleType × 12 roots', () => {
  for (const mode of ['Diatonic', 'Build'] as const) {
    it(`renders ExploreView (${mode} chord mode) + Piano + Fretboard with no throw`, async () => {
      const errors: string[] = [];
      let current = 'C major';
      // React logs caught render errors; keep the output readable.
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      renderSurface((e) => errors.push(`${current}: ${e.message}`));
      // The initial C major render must work (baseline for the loop).
      expect(errors).toEqual([]);
      await screen.findAllByTestId('staff-mock');
      if (mode === 'Build') {
        fireEvent.click(screen.getByRole('button', { name: 'Build' }));
      }
      for (const type of SCALE_TYPES) {
        for (const root of ROOTS) {
          current = label(root, type);
          act(() => {
            useAppStore.getState().setKey(root);
            useAppStore.getState().setScale(type);
          });
          if (screen.queryByTestId('caught')) break;
        }
        if (screen.queryByTestId('caught')) break;
      }
      spy.mockRestore();
      expect(errors).toEqual([]);
    }, 60_000);
  }
});
