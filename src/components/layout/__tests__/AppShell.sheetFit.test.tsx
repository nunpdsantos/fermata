/**
 * 9 Nov (brief G): the phone sheet is never taller than its content. A Full
 * the learner chose (for the guitar) is shown as Half under the keyboard,
 * which fits at Half — and the view above it stays live: the view is inert
 * only while the sheet really is at Full.
 */
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import { AppShell } from '../AppShell';
import { useAppStore } from '../../../state/store';

const { content } = vi.hoisted(() => ({ content: { height: 0 } }));
vi.mock('../../instruments/Piano.tsx', () => ({ Piano: () => <div data-testid="piano-mock" /> }));
vi.mock('../../instruments/InstrumentSelector.tsx', () => ({ InstrumentSelector: () => <div /> }));
vi.mock('../TopBar.tsx', () => ({ TopBar: () => <div /> }));
vi.mock('../../../hooks/useMediaQuery.ts', async (orig) => ({
  ...(await orig<Record<string, unknown>>()),
  // A phone: the sheet query (and the phone query) match.
  useMediaQuery: (q: string) => q.startsWith('(max-width: 639px)'),
}));

// jsdom has no layout: the instrument region's natural height and the room
// under the top bar (AppShell reads its body's clientHeight) are stubbed.
const rect = Object.getOwnPropertyDescriptor(Element.prototype, 'getBoundingClientRect')!;
const client = Object.getOwnPropertyDescriptor(Element.prototype, 'clientHeight')!;
beforeAll(() => {
  Object.defineProperty(Element.prototype, 'clientHeight', { configurable: true, get: () => 784 });
  Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
    configurable: true,
    value(this: Element) {
      const h = this.id === 'instrument-region' ? content.height : 0;
      return { top: 0, bottom: h, left: 0, right: h ? 100 : 0, width: h ? 100 : 0, height: h, x: 0, y: 0, toJSON() {} } as DOMRect;
    },
  });
});
afterAll(() => {
  Object.defineProperty(Element.prototype, 'getBoundingClientRect', rect);
  Object.defineProperty(Element.prototype, 'clientHeight', client);
});
afterEach(cleanup);

const main = () => document.getElementById('main-content')!;

describe('phone sheet sized to its content', () => {
  it('a keyboard that fits at Half: a saved Full shows as Half, two stops, and the view stays live', () => {
    content.height = 228;
    useAppStore.setState({ view: 'explore', instrument: 'piano', dockDetents: { explore: 'full', learn: 'peek' }, dockChosen: { explore: true, learn: false } });
    render(<AppShell><div /></AppShell>);
    expect(screen.getByTestId('instrument-dock').getAttribute('data-detent')).toBe('half');
    const handle = screen.getByRole('separator');
    expect(handle.getAttribute('aria-valuemax')).toBe('1');
    expect(handle.getAttribute('aria-valuetext')).toBe('Half');
    expect(main().hasAttribute('inert')).toBe(false);
    // The learner's choice is kept for an instrument that does need Full.
    expect(useAppStore.getState().dockDetents.explore).toBe('full');
  });

  it('content taller than Half (or not measured): Full is Full and the view under it is inert', () => {
    content.height = 0;
    useAppStore.setState({ view: 'explore', instrument: 'piano', dockDetents: { explore: 'full', learn: 'peek' }, dockChosen: { explore: true, learn: false } });
    render(<AppShell><div /></AppShell>);
    expect(screen.getByTestId('instrument-dock').getAttribute('data-detent')).toBe('full');
    expect(screen.getByRole('separator').getAttribute('aria-valuemax')).toBe('2');
    expect(main().hasAttribute('inert')).toBe(true);
  });

  it('at Half the view is live', () => {
    content.height = 228;
    useAppStore.setState({ view: 'explore', instrument: 'piano', dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: true, learn: false } });
    render(<AppShell><div /></AppShell>);
    expect(main().hasAttribute('inert')).toBe(false);
  });
});
