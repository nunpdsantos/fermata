import { act, cleanup, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ToastRegion } from '../ToastRegion';

const state = vi.hoisted(() => ({ room: 124, resize: () => {} }));
vi.mock('../toastLayout', async (original) => ({ ...(await original<object>()), useToastRoom: () => state.room }));
vi.mock('../PWAPrompts.tsx', () => ({ PWAPrompts: () => <div>{[1, 2, 3].map((i) => <div className="toast-card" key={i}><button>Toast {i}</button></div>)}</div> }));
vi.mock('../Toast.tsx', () => ({ ToastContainer: () => <div><div className="toast-card">App toast</div></div> }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it('queues whole cards, removes their focus/announcement, and releases them when room grows', () => {
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(58);
  vi.stubGlobal('ResizeObserver', class { constructor(cb: () => void) { state.resize = cb; } observe() {} disconnect() {} });
  const { container, rerender } = render(<ToastRegion />);
  const cards = Array.from(container.querySelectorAll<HTMLElement>('.toast-card'));
  expect(cards.map((c) => c.hasAttribute('data-toast-queued'))).toEqual([false, false, true, true]);
  expect(cards[2].inert).toBe(true);
  expect(cards[2].getAttribute('aria-hidden')).toBe('true');
  state.room = 300;
  rerender(<ToastRegion />);
  act(() => state.resize());
  expect(cards.every((c) => !c.inert && !c.hasAttribute('aria-hidden'))).toBe(true);
});
