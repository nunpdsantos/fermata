import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { AppShell } from '../AppShell';
import { useAppStore } from '../../../state/store';

// Mock the heavy instrument + chrome children — this test only cares whether the
// instrument AREA is mounted at all, gated on the current view.
vi.mock('../../instruments/Piano.tsx', () => ({ Piano: () => <div data-testid="piano-mock" /> }));
vi.mock('../../instruments/Fretboard.tsx', () => ({ Fretboard: () => <div data-testid="fret-mock" /> }));
vi.mock('../../instruments/InstrumentSelector.tsx', () => ({
  InstrumentSelector: () => <div data-testid="selector-mock" />,
}));
vi.mock('../TopBar.tsx', () => ({ TopBar: () => <div data-testid="topbar-mock" /> }));

afterEach(cleanup);

beforeEach(() => {
  useAppStore.setState({ instrument: 'piano' });
});

describe('AppShell — instrument area gating by view', () => {
  it('renders the instrument area in Explore', () => {
    useAppStore.setState({ view: 'explore' });
    const { container } = render(<AppShell><div>child</div></AppShell>);
    expect(container.querySelector('[data-tour="play-note"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="selector-mock"]')).not.toBeNull();
  });

  it('removes the ENTIRE instrument area in Drill (selector, toggle, and instrument)', () => {
    useAppStore.setState({ view: 'drill' });
    const { container } = render(<AppShell><div>child</div></AppShell>);
    // Instrument render region gone.
    expect(container.querySelector('[data-tour="play-note"]')).toBeNull();
    // Instrument bar (selector) gone too — drill owns the full vertical space.
    expect(container.querySelector('[data-testid="selector-mock"]')).toBeNull();
    expect(container.querySelector('[data-testid="piano-mock"]')).toBeNull();
  });
});
