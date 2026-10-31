/**
 * Audit W1-08 (B-14) — in Learn build exercises the note chips (and the lit
 * keys' names) follow the target's sharp/flat direction: F major's B-flat is
 * "Bb", not "A#"; C minor's notes read "Eb", "Ab", "Bb". Only the DIRECTION
 * of the key is used — never the target's exact spellings — so a chip never
 * reveals that a pick is right (F in F# major stays "F", not "E#").
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, act, renderHook } from '@testing-library/react';
import type { Note } from '../../../../core/types/music';
import { InstrumentInput } from '../inputs/InstrumentInput';
import { useAppStore } from '../../../../state/store';
import { useKeyContext } from '../../../../hooks/useKeyContext';
import { buildScale } from '../../../../core/constants/scales';
import { buildChord } from '../../../../core/constants/chords';

afterEach(() => {
  cleanup();
  useAppStore.setState({ activeNotes: new Set<number>(), highlightedNotes: [], exerciseInputActive: false });
});

const n = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;

function tapAll(midis: number[]) {
  for (const m of midis) {
    act(() => useAppStore.setState({ activeNotes: new Set([m]) }));
    act(() => useAppStore.setState({ activeNotes: new Set<number>() }));
  }
}

function chips(c: HTMLElement): string[] {
  return [...c.querySelectorAll('span.rounded-md')].map((s) => s.textContent ?? '');
}

describe('W1-08 — chips spelled by the target key direction', () => {
  it('F major scale: A#/Bb chip reads Bb', () => {
    useAppStore.setState({ activeNotes: new Set<number>() });
    const { container } = render(
      <InstrumentInput expectedCount={7} submitted={false} onSubmit={() => {}} accentColor="#888888" spellingContext={buildScale(n('F'), 'major').notes} />,
    );
    tapAll([65, 70]); // F4, Bb4
    expect(chips(container)).toEqual(['F', 'Bb']);
    expect(useAppStore.getState().highlightedNotes.map((h) => h.natural + h.accidental)).toEqual(['F', 'Bb']);
  });

  it('C minor chord: Eb, and the other black keys flat too', () => {
    const { container } = render(
      <InstrumentInput expectedCount={3} submitted={false} onSubmit={() => {}} accentColor="#888888" spellingContext={buildChord(n('C'), 'minor').notes} />,
    );
    tapAll([60, 63, 68]); // C, Eb, Ab
    expect(chips(container)).toEqual(['C', 'Eb', 'Ab']);
  });

  it('F# major: F stays F (no E#), black keys sharp', () => {
    const { container } = render(
      <InstrumentInput expectedCount={7} submitted={false} onSubmit={() => {}} accentColor="#888888" spellingContext={buildScale(n('F#'), 'major').notes} />,
    );
    tapAll([65, 66]);
    expect(chips(container)).toEqual(['F', 'F#']);
  });

  it('the lit key on the instrument carries the chip name', () => {
    render(
      <InstrumentInput expectedCount={7} submitted={false} onSubmit={() => {}} accentColor="#888888" spellingContext={buildScale(n('F'), 'major').notes} />,
    );
    tapAll([70]);
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.spellPitchClass(10)).toEqual(n('Bb'));
  });
});
