/**
 * Audit W9-11 (F-17): the fretboard (with its chord-shape / position data)
 * and Quick Search (with the search index and parsers) are separate chunks,
 * fetched only when needed — a piano user's first visit no longer downloads
 * the guitar, and nobody downloads search until they open it. Behaviour is
 * unchanged: the guitar appears when selected, Cmd/Ctrl+K opens search from
 * the first press, and a failed download never takes the app down.
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';
import { useAppStore } from '../../state/store';

const loads = vi.hoisted(() => ({ fretboard: 0, quickSearch: 0 }));

vi.mock('../instruments/Fretboard.tsx', () => {
  loads.fretboard++;
  return { Fretboard: () => <div data-testid="fret-mock" /> };
});
vi.mock('../navigation/QuickSearch.tsx', () => {
  loads.quickSearch++;
  return {
    QuickSearch: () => {
      const open = useAppStore((s) => s.quickSearchOpen);
      return open ? <div role="dialog">SEARCH UI</div> : null;
    },
  };
});
vi.mock('../instruments/Piano.tsx', () => ({ Piano: () => <div data-testid="piano-mock" /> }));
vi.mock('../instruments/InstrumentSelector.tsx', () => ({ InstrumentSelector: () => <div /> }));
vi.mock('../layout/TopBar.tsx', () => ({ TopBar: () => <div /> }));

import { AppShell } from '../layout/AppShell';
import { QuickSearchHost } from '../navigation/QuickSearchHost';

beforeEach(() => {
  useAppStore.setState({ view: 'explore', instrument: 'piano', quickSearchOpen: false });
});
afterEach(cleanup);

describe('lazy fretboard (W9-11)', () => {
  it('a piano session never loads the fretboard; choosing guitar loads and shows it', async () => {
    render(<AppShell><div /></AppShell>);
    expect(screen.getByTestId('piano-mock')).toBeTruthy();
    expect(loads.fretboard).toBe(0);

    act(() => useAppStore.setState({ instrument: 'guitar' }));
    expect(await screen.findByTestId('fret-mock')).toBeTruthy();
    expect(loads.fretboard).toBe(1);
  });
});

describe('lazy Quick Search (W9-11)', () => {
  it('is not loaded until opened; the first Ctrl+K opens it', async () => {
    render(<QuickSearchHost />);
    expect(loads.quickSearch).toBe(0);
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(useAppStore.getState().quickSearchOpen).toBe(true);
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(loads.quickSearch).toBe(1);
  });

  it('opening from the search button (store) also loads it', async () => {
    render(<QuickSearchHost />);
    act(() => useAppStore.getState().setQuickSearchOpen(true));
    expect(await screen.findByText('SEARCH UI')).toBeTruthy();
  });

  it('once loaded, the host stops handling Ctrl+K (Quick Search owns its keys again)', async () => {
    render(<QuickSearchHost />);
    act(() => useAppStore.getState().setQuickSearchOpen(true));
    await screen.findByText('SEARCH UI');
    act(() => useAppStore.getState().setQuickSearchOpen(false));
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    // The mock QuickSearch has no key handler, so nothing re-opens it:
    // proves the host's own listener was removed (no double toggling).
    expect(useAppStore.getState().quickSearchOpen).toBe(false);
  });
});
