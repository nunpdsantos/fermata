/**
 * Review blocker B1 (W3): on desktop the instrument dock was capped at 260 px
 * with its own scrollbar. The guitar's position controls wrap to 2–3 rows, so
 * the 1st (high-E) string — the dots you tap in fingering-edit mode — sat
 * below the cap, hidden (measured in a production build: string bottom 833 px
 * vs dock bottom 800 px at 1280×800). The guitar dock now sizes to its
 * content on every width; the piano keeps its fixed height.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { AppShell } from '../AppShell';
import { useAppStore } from '../../../state/store';

vi.mock('../../instruments/Piano.tsx', () => ({ Piano: () => <div data-testid="piano-mock" /> }));
vi.mock('../../instruments/Fretboard.tsx', () => ({ Fretboard: () => <div data-testid="fret-mock" /> }));
vi.mock('../../instruments/InstrumentSelector.tsx', () => ({ InstrumentSelector: () => <div /> }));
vi.mock('../TopBar.tsx', () => ({ TopBar: () => <div /> }));

afterEach(cleanup);

const dock = (container: HTMLElement) => container.querySelector<HTMLElement>('[data-tour="play-note"]')!;

describe('instrument dock height', () => {
  it('guitar: never height-capped or internally scrolled, at any width', () => {
    useAppStore.setState({ view: 'explore', instrument: 'guitar' });
    const { container } = render(<AppShell><div /></AppShell>);
    const cls = dock(container).className;
    expect(cls).not.toMatch(/h-\[\d+px\]/);
    expect(cls).not.toMatch(/overflow-y-auto/);
    expect(cls).toMatch(/(^|\s)h-auto(\s|$)/);
  });

  it('piano: keeps its fixed desktop height (unchanged)', () => {
    useAppStore.setState({ view: 'explore', instrument: 'piano' });
    const { container } = render(<AppShell><div /></AppShell>);
    expect(dock(container).className).toContain('md:h-[260px]');
  });
});
