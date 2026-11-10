/**
 * What a share link's `key` accepts (the seat's decision 7, 2026-11-10):
 * CLAUDE.md said "a root as the key picker spells it", but the parser takes
 * all 21 spellings — the seven letters, each natural, sharp or flat — E♯,
 * B♯, F♭ and C♭ included, which the key picker never offers, and Explore
 * draws every one of them without an error. This pins what the sentence
 * now says: each spelling, through the link's own path (read → parse →
 * apply), lands as spelled and draws the summary, the staff strip, the
 * chords and the circle.
 */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, renderHook, screen, cleanup, act } from '@testing-library/react';
import { useAppStore } from '../../state/store';
import { readShareParams } from '../../state/shareParams';
import { parseShareLink } from '../shareLinkParse';
import { applyShareTarget } from '../shareLinkOpen';
import { ExploreHeader } from '../../components/explore/ExploreHeader';
import { ScaleStrip } from '../../components/explore/ScaleStrip';
import { ChordsCard } from '../../components/explore/ChordsCard';
import { CircleNavigator } from '../../components/explore/CircleNavigator';
import { useRootChoices } from '../../components/navigation/keyChoice';
import { withGlyphs } from '../../core/utils/accidentalGlyphs';
import { noteToString, type NaturalNote, type Note } from '../../core/types/music';

vi.mock('../../hooks/useAudio', () => ({ useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }) }));
vi.mock('../../core/services/audio.ts', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  resumeAudio: vi.fn(async () => {}),
  playScale: vi.fn(),
}));
vi.mock('../../components/notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return { StaffNotation: () => React.createElement('div', { 'data-testid': 'staff' }) };
});

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(cleanup);

const LETTERS: NaturalNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const SPELLINGS: Note[] = LETTERS.flatMap((natural) => (['', '#', 'b'] as const).map((accidental) => ({ natural, accidental })));

function Explore() {
  return (
    <>
      <ExploreHeader />
      <ScaleStrip />
      <ChordsCard />
      <CircleNavigator />
    </>
  );
}

/** The spellings the key picker offers for a scale, the selected one aside (and its ⇄ respelling). */
function pickerSpellings(): Set<string> {
  const { result, unmount } = renderHook(() => useRootChoices().roots);
  const roots = result.current.map(noteToString);
  unmount();
  return new Set(roots);
}

describe('a share link\'s key: all 21 spellings', () => {
  it('the parser takes every one, as spelled (the key picker offers fewer)', () => {
    act(() => useAppStore.setState({ selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major' }));
    const picker = pickerSpellings();
    const beyond: string[] = [];
    for (const n of SPELLINGS) {
      const s = noteToString(n);
      expect(parseShareLink(readShareParams(`?key=${encodeURIComponent(s)}`)).key, s).toEqual(n);
      if (!picker.has(s) && !['C#', 'Db', 'D#', 'Eb', 'F#', 'Gb', 'G#', 'Ab', 'A#', 'Bb'].includes(s)) beyond.push(s);
    }
    expect(SPELLINGS).toHaveLength(21);
    // Neither offered nor reachable by ⇄: the four the sentence names.
    expect(beyond.sort()).toEqual(['B#', 'Cb', 'E#', 'Fb']);
  });

  it.each(['major', 'natural_minor'] as const)('each lands as spelled and Explore draws it without an error (%s)', (scale) => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      act(() => useAppStore.setState({ view: 'explore', language: 'en', exploreDetail: 'full', selectedChord: null, instrument: 'piano' }));
      render(<Explore />);
      for (const n of SPELLINGS) {
        const s = noteToString(n);
        act(() => applyShareTarget(parseShareLink(readShareParams(`?key=${encodeURIComponent(s)}&scale=${scale}`))));
        expect(useAppStore.getState().selectedKey, s).toEqual(n);
        expect(screen.getByTestId('key-summary').textContent, s).toMatch(new RegExp(`^${withGlyphs(n)} `));
        const cols = [...document.querySelectorAll<HTMLElement>('.strip-col')];
        expect(cols, s).toHaveLength(8);
        expect(cols[0].dataset.note, s).toBe(s);
        expect(document.querySelectorAll('.chord-row button').length, s).toBe(7);
        expect(screen.getByTestId('circle-card'), s).toBeTruthy();
      }
      expect(errors).not.toHaveBeenCalled();
    } finally {
      errors.mockRestore();
    }
  });
});
