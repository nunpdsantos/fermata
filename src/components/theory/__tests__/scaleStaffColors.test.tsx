/**
 * Audit W1-18 / W1-06 — the Explore scale staff colours every note by its
 * FUNCTION (read from the spelled letter), including the octave tonic on top.
 * Pre-fix: colours came from note order (C major pentatonic's G got the
 * subdominant colour) and the top tonic had no colour at all.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import type { Note, ScaleType } from '../../../core/types/music';
import { ChordWorkspace } from '../ChordWorkspace';
import { useAppStore } from '../../../state/store';
import { DEGREE_COLORS } from '../../../design/tokens/colors';
import { SCALE_FORMULAS } from '../../../core/constants/scales';
import { buildChord } from '../../../core/constants/chords';
import { SELECTABLE_ROOTS, letterDegree } from '../../../core/utils/__tests__/theoryOracle';

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

vi.mock('../../notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return {
    StaffNotation: (p: { notes: unknown; noteColors?: Record<number, string>; followInstrument?: boolean }) =>
      React.createElement('div', { 'data-testid': 'staff', 'data-notes': JSON.stringify(p.notes), 'data-colors': JSON.stringify(p.noteColors ?? null), 'data-follow': String(!!p.followInstrument) }),
  };
});

afterEach(cleanup);

const toNote = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;

async function staffFor(root: string, type: ScaleType) {
  useAppStore.setState({ selectedKey: toNote(root), selectedScale: type, selectedChord: null, selectedDegree: null, chordInversion: 0 });
  render(<ChordWorkspace />);
  const el = await screen.findByTestId('staff');
  const notes = JSON.parse(el.getAttribute('data-notes')!) as { natural: string; accidental: string }[];
  const colors = JSON.parse(el.getAttribute('data-colors')!) as Record<string, string>;
  return { notes, colors, follow: el.getAttribute('data-follow') === 'true' };
}

describe('Explore scale staff colours', () => {
  it('Explore staves show what the instrument plays (they follow the instrument; Learn staves do not)', async () => {
    const scaleStaff = await staffFor('C', 'major');
    expect(scaleStaff.follow).toBe(true);
    cleanup();
    useAppStore.setState({ selectedChord: buildChord({ natural: 'C', accidental: '' }, 'major') });
    render(<ChordWorkspace />);
    expect((await screen.findByTestId('staff')).getAttribute('data-follow')).toBe('true');
  });

  it('W1-18: the octave tonic on top is coloured like the tonic', async () => {
    const { notes, colors } = await staffFor('C', 'major');
    expect(notes).toHaveLength(8);
    expect(colors[7]).toBe(DEGREE_COLORS[1]);
  });

  it('W1-06: C major pentatonic colours G as the dominant and A as the submediant', async () => {
    const { colors } = await staffFor('C', 'pentatonic_major');
    expect([0, 1, 2, 3, 4, 5].map((i) => colors[i])).toEqual([
      DEGREE_COLORS[1], DEGREE_COLORS[2], DEGREE_COLORS[3], DEGREE_COLORS[5], DEGREE_COLORS[6], DEGREE_COLORS[1],
    ]);
  });

  it('every note of every scale type is coloured by its letter degree (sampled roots)', async () => {
    const bad: string[] = [];
    for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
      for (const root of SELECTABLE_ROOTS.filter((_, i) => i % 4 === 0)) {
        const { notes, colors } = await staffFor(root, type);
        notes.forEach((n, i) => {
          const want = DEGREE_COLORS[letterDegree(root, n.natural + n.accidental) as keyof typeof DEGREE_COLORS];
          if (colors[i] !== want) bad.push(`${root} ${type} note ${i} ${n.natural}${n.accidental}`);
        });
        cleanup();
      }
    }
    expect(bad).toEqual([]);
  });
});
