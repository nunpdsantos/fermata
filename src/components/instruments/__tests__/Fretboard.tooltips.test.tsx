/**
 * Position tooltips, with the REAL i18n resources (no key-echo mock), so
 * interpolation is exercised in all three languages.
 *   Review B2 — "Position V: index finger at fret V" must say fret 5.
 *   Review #4 — Open vs I must be distinguishable: I is first position
 *               WITHOUT open strings; Open uses them.
 */
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, screen, within, fireEvent } from '@testing-library/react';
import i18n from '../../../i18n';
import { useAppStore } from '../../../state/store';
import { useFingeringStore } from '../../../state/fingeringStore';

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
});
vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }),
}));
vi.mock('../../../hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
  useIsCompact: () => false,
  useIsTablet: () => false,
}));

beforeEach(() => {
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', selectedChord: null, chordInversion: 0,
    instrument: 'guitar', activeNotes: new Set<number>(), highlightedNotes: [], exerciseInputActive: false,
    guitarScalePosition: 5, guitarTuningId: 'standard', quickSearchOpen: false, themeMode: 'fermata',
  });
  useFingeringStore.setState({ overrides: {}, labelMode: 'finger' });
});
afterEach(async () => {
  cleanup();
  await i18n.changeLanguage('en');
});

async function renderBoard() {
  const { Fretboard } = await import('../Fretboard');
  return render(<Fretboard />);
}
const tabs = () => within(screen.getByRole('tablist')).getAllByRole('tab');

const CASES = [
  { lang: 'en', v: 'Position V: index finger at fret 5', one: /no open strings/i, open: /open strings/i },
  { lang: 'pt', v: 'Posição V: dedo indicador no traste 5', one: /sem cordas soltas/i, open: /cordas soltas/i },
  { lang: 'es', v: 'Posición V: dedo índice en el traste 5', one: /sin cuerdas al aire/i, open: /cuerdas al aire/i },
];

describe('position tooltips', () => {
  for (const c of CASES) {
    it(`${c.lang}: chip and badge give the fret as a number (B2); I and Open are told apart (#4)`, async () => {
      await i18n.changeLanguage(c.lang);
      await renderBoard();
      const [open, one, , , , five] = tabs();
      expect(five.textContent).toBe('V');
      expect(five.getAttribute('title')).toBe(c.v);
      expect(screen.getByTestId('position-badge').getAttribute('title')).toBe(c.v);
      expect(one.getAttribute('title')).toMatch(c.one);
      expect(open.getAttribute('title')).toMatch(c.open);
      expect(open.getAttribute('title')).not.toMatch(c.one);
      // No raw placeholders or Roman numerals standing in for a fret number.
      for (const tab of tabs()) expect(tab.getAttribute('title') ?? '').not.toMatch(/\{\{|fret [IVX]|traste [IVX]/);
      fireEvent.click(one);
      expect(useAppStore.getState().guitarScalePosition).toBe(1);
    });
  }
});
