/**
 * Two notices at once (second review of builder K, item 5): "No shape here
 * has F♯ in the bass … This shape leaves out F (11)." for Cm(add11)/F♯
 * squeezed the chord chips to 62 px. Since that review no request reaches
 * both — Cm(add11)/F♯ has whole grips with its bass, and a list with no grip
 * for the bass is the chord's own whole grips (searched: 101,040 requests and
 * every typed outside bass, capo 0–9) — so the state is made here by making
 * every grip "leave out" a tone, to pin the wiring: both sentences in one
 * line, marked `data-notices="two"`, which index.css gives a line of its own.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import i18n from '../../../i18n';
import { buildChord } from '../../../core/constants/chords';
import type { Note } from '../../../core/types/music';
import { useAppStore } from '../../../state/store';
import { useGuitarShapeStore } from '../../../state/guitarShapeStore';

vi.mock('../../../hooks/useAudio', () => ({ useAudio: () => ({ noteOn: vi.fn(), noteOff: vi.fn() }) }));
vi.mock('../../../hooks/useMediaQuery', async (orig) => ({
  ...(await orig<typeof import('../../../hooks/useMediaQuery')>()),
  useIsMobile: () => false,
  useIsCompact: () => false,
}));
vi.mock('../leftOutWords', () => ({ leftOutTones: () => [{ note: { natural: 'D', accidental: '' }, degree: '9' }] }));

const N = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
});
beforeEach(async () => {
  await i18n.changeLanguage('en');
  useGuitarShapeStore.setState({ shapeChoice: { key: '', idx: 0 } });
  useAppStore.setState({
    view: 'explore', instrument: 'guitar', selectedKey: N('C'), selectedScale: 'major', selectedChord: null, chordInversion: 0,
    guitarScalePosition: null, guitarTuningId: 'standard', capoFret: 0, exerciseInputActive: false, neckNutSide: 'right', neckTopString: 'low',
  });
});
afterEach(cleanup);

describe('two notices at once', () => {
  it('both sentences, one line marked data-notices="two"; one notice alone carries no mark (the owner\'s neck is recorded so)', async () => {
    const { Fretboard } = await import('../Fretboard');
    act(() => useAppStore.setState({ selectedChord: { ...buildChord(N('C'), 'dominant7sharp5flat9'), bassNote: N('B') } }));
    const { unmount } = render(<Fretboard />);
    const two = screen.getAllByRole('status').find((n) => /in the bass/.test(n.textContent ?? ''))!;
    expect(two.textContent).toBe('No shape here has B in the bass, so the shapes are shown as they are. This shape leaves out D (9).');
    expect(two.getAttribute('data-notices')).toBe('two');
    unmount();
    act(() => useAppStore.setState({ selectedChord: buildChord(N('C'), 'major') }));
    render(<Fretboard />);
    const one = screen.getAllByRole('status').find((n) => /leaves out/.test(n.textContent ?? ''))!;
    expect(one.getAttribute('data-notices')).toBeNull();
  });
});
