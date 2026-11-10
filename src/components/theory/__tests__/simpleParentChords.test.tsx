/**
 * Simple view, a scale with no chords of its own (wave 2): the chords of the
 * key it comes from, under a heading that says so. Full view keeps the old
 * message.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import type { ScaleType } from '../../../core/types/music';
import { ChordGrid } from '../ChordGrid';

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const make = (tag: string) => (props: Record<string, unknown>) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
    return React.createElement(tag, clean);
  };
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => make(prop) });
  return { m: proxy, motion: proxy };
});

afterEach(cleanup);

function show(root: string, scale: ScaleType, detail: 'simple' | 'full') {
  useAppStore.setState({ selectedKey: { natural: root[0] as 'G', accidental: '' }, selectedScale: scale, exploreDetail: detail, language: 'en', selectedChord: null });
  render(<ChordGrid />);
}
const cards = () => screen.queryAllByRole('button').map((b) => b.getAttribute('aria-label'));

describe('Simple view: the parent key\'s chords', () => {
  it('G major pentatonic: the chords of G major', () => {
    show('G', 'pentatonic_major', 'simple');
    expect(screen.getByTestId('parent-chords-note').textContent).toBe('Chords that go with G Major Pentatonic: the chords of G major');
    expect(cards()).toHaveLength(7);
    expect(cards()[0]).toMatch(/^G Major chord, degree 1/);
    expect(screen.queryByText('No diatonic chords for this scale type')).toBeNull();
  });
  it('A minor pentatonic and A blues: the chords of A minor', () => {
    show('A', 'pentatonic_minor', 'simple');
    expect(screen.getByTestId('parent-chords-note').textContent).toBe('Chords that go with A Minor Pentatonic: the chords of A minor');
    expect(cards()[0]).toMatch(/^A Minor chord, degree 1/);
    cleanup();
    show('A', 'blues', 'simple');
    expect(screen.getByTestId('parent-chords-note').textContent).toContain('the chords of A minor');
  });
  it('Full view keeps today\'s message', () => {
    show('G', 'pentatonic_major', 'full');
    expect(screen.getByText('No diatonic chords for this scale type')).toBeTruthy();
    expect(screen.queryByTestId('parent-chords-note')).toBeNull();
  });
  it('a scale with no parent key (whole tone) keeps the message in Simple too; major keeps its own chords', () => {
    show('C', 'whole_tone', 'simple');
    expect(screen.getByText('No diatonic chords for this scale type')).toBeTruthy();
    cleanup();
    show('C', 'major', 'simple');
    expect(screen.queryByTestId('parent-chords-note')).toBeNull();
    expect(cards()).toHaveLength(7);
  });
});
