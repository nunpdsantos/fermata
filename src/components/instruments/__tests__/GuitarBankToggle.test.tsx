/**
 * GuitarBankToggle (WS11, temporary A/B bake-off) — the guitar sample-bank
 * switch. Verifies it reflects the active bank, fires setGuitarBank on change,
 * and (via a guitar-gated harness mirroring AppShell) renders only for guitar.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

// Mock the sampler so we assert the switch is invoked without touching audio.
const setGuitarBank = vi.fn();
let currentBank: 'a' | 'b' = 'a';
vi.mock('../../../services/guitarSampler.ts', () => ({
  getGuitarBank: () => currentBank,
  setGuitarBank: (b: 'a' | 'b') => setGuitarBank(b),
}));

import { GuitarBankToggle } from '../GuitarBankToggle';

beforeEach(() => {
  setGuitarBank.mockClear();
  currentBank = 'a';
});
afterEach(cleanup);

describe('GuitarBankToggle (WS11)', () => {
  it('renders an A and a B radio reflecting the active bank', () => {
    render(<GuitarBankToggle />);
    const a = screen.getByRole('radio', { name: /: A$/ });
    const b = screen.getByRole('radio', { name: /: B$/ });
    expect(a.getAttribute('aria-checked')).toBe('true'); // default bank A
    expect(b.getAttribute('aria-checked')).toBe('false');
  });

  it('fires setGuitarBank("b") when B is chosen', () => {
    render(<GuitarBankToggle />);
    fireEvent.click(screen.getByRole('radio', { name: /: B$/ }));
    expect(setGuitarBank).toHaveBeenCalledTimes(1);
    expect(setGuitarBank).toHaveBeenCalledWith('b');
  });

  it('does not fire when the already-active bank is clicked', () => {
    render(<GuitarBankToggle />);
    fireEvent.click(screen.getByRole('radio', { name: /: A$/ })); // already A
    expect(setGuitarBank).not.toHaveBeenCalled();
  });

  it('reflects bank B as active when that is the current bank', () => {
    currentBank = 'b';
    render(<GuitarBankToggle />);
    expect(screen.getByRole('radio', { name: /: B$/ }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: /: A$/ }).getAttribute('aria-checked')).toBe('false');
  });

  it('exposes a labelled radiogroup', () => {
    render(<GuitarBankToggle />);
    expect(screen.getByRole('radiogroup')).toBeDefined();
  });

  // Mirrors AppShell's gate: the toggle is mounted only when guitar is selected.
  it('is shown for guitar and hidden otherwise (AppShell gate)', () => {
    function Harness({ instrument }: { instrument: 'piano' | 'guitar' }) {
      return <div>{instrument === 'guitar' && <GuitarBankToggle />}</div>;
    }
    const { rerender } = render(<Harness instrument="piano" />);
    expect(screen.queryByRole('radiogroup')).toBeNull();
    rerender(<Harness instrument="guitar" />);
    expect(screen.getByRole('radiogroup')).toBeDefined();
  });
});
