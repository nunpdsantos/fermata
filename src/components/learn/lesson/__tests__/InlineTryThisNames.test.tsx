/**
 * Wave 2, "Start with sound": a sound-first Try This draws no staff — it
 * writes the notes it plays by name (letters first; Dó, Ré, Mi beside them
 * in PT / ES when that setting is on) and keeps "Hear it" and "Show on …".
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { InlineTryThis } from '../InlineTryThis';
import { useAppStore } from '../../../../state/store';
import i18n from '../../../../i18n';

vi.mock('../../../notation/StaffNotation', () => ({ StaffNotation: () => <div data-testid="staff" /> }));

beforeEach(async () => {
  await i18n.changeLanguage('en');
  useAppStore.setState({ language: 'en', showSolfege: false, instrument: 'piano' });
});
afterEach(cleanup);

describe('sound-first Try This (names, no staff)', () => {
  it('a scale: its notes up to the octave, by letter; Hear it and Show on the piano', () => {
    render(<InlineTryThis query="C major scale" label="Hear C climb" accent="#3b82f6" names />);
    expect(screen.getByTestId('try-this-names').textContent).toBe('CDEFGABC');
    expect([...screen.getByTestId('try-this-names').children].map((c) => c.textContent)).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C']);
    expect(screen.queryByTestId('staff')).toBeNull();
    expect(screen.getByRole('button', { name: 'Hear it' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Show on the piano' })).toBeDefined();
  });

  it('a chord: its three notes, with sharps and flats as glyphs', () => {
    render(<InlineTryThis query="C minor chord" label="Hear C minor" accent="#3b82f6" names />);
    expect([...screen.getByTestId('try-this-names').children].map((c) => c.textContent)).toEqual(['C', 'E♭', 'G']);
  });

  it('PT with Dó-Ré-Mi on: the syllable beside each letter', async () => {
    await i18n.changeLanguage('pt');
    act(() => useAppStore.setState({ language: 'pt', showSolfege: true }));
    render(<InlineTryThis query="G major chord" label="Ouve G maior" accent="#3b82f6" names />);
    expect([...screen.getByTestId('try-this-names').children].map((c) => c.textContent)).toEqual(['G (Sol)', 'B (Si)', 'D (Ré)']);
  });

  it('without `names`, the staff as before', async () => {
    render(<InlineTryThis query="C major scale" label="See notes" accent="#3b82f6" />);
    expect(await screen.findByTestId('staff')).toBeDefined();
    expect(screen.queryByTestId('try-this-names')).toBeNull();
  });
});
