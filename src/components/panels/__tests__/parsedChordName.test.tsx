/**
 * Audit 2026-11-18 (Q2's naming, found beside it): the chord detail's heading
 * wrote a parsed chord's root twice — "GG7♭9♯11", "CCm(add9)" — because the
 * parser's name already starts with the root. The root, the name and the slash
 * bass each once. Cm(add9) itself is now a named quality (minor_add9): its
 * heading reads by its name, and the scales offered for it are minor ones.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { CurrentChordPanel } from '../CurrentChordPanel';
import { useAppStore } from '../../../state/store';
import { chordFromParsed, parseChordSymbol } from '../../../core/utils/chordParser';

vi.mock('../../../hooks/useAudio', () => ({ useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }) }));
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

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
beforeEach(() => {
  useAppStore.setState({ selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', chordInversion: 0, instrument: 'piano', baseOctave: 4 });
});
afterEach(cleanup);

const heading = (symbol: string) => {
  const chord = chordFromParsed(parseChordSymbol(symbol)!);
  useAppStore.setState({ selectedChord: chord });
  render(<CurrentChordPanel chord={chord} />);
  const text = screen.getByRole('heading', { level: 3 }).textContent;
  cleanup();
  return text;
};

describe('the chord detail names a parsed chord once', () => {
  it.each([
    ['G7b9#11', 'G7♭9♯11'],
    ['Dm9b5', 'Dm9♭5'],
    ['Cm7(add11)/G', 'Cm7(add11)/G'],
    ['F#7b9#11', 'F♯7♭9♯11'],
  ])('%s → %s', (symbol, shown) => {
    expect(heading(symbol)).toBe(shown);
  });

  it('Cm(add9) is the named minor add 9, with the minor scales', () => {
    const chord = chordFromParsed(parseChordSymbol('Cm(add9)')!);
    expect(chord.quality).toBe('minor_add9');
    useAppStore.setState({ selectedChord: chord });
    render(<CurrentChordPanel chord={chord} />);
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe('CMinor Add 9');
    const scales = document.querySelector('.chord-detail-scales')!.textContent ?? '';
    expect(scales).toContain('Dorian');
    expect(scales).not.toMatch(/Major/);
  });
});
