import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import { QuickSearch } from '../QuickSearch';
import { useAppStore } from '../../../state/store';

/**
 * Where focus ends after any run of opens and closes, however fast (fix pass
 * of 21 November 2026, review item 3). The dialog's exit is drawn for a while
 * as framer-motion draws it: this file's AnimatePresence keeps the closed
 * dialog (and its focused input, the same element) on the page for EXIT_MS,
 * and gives the same elements back if search opens again meanwhile. The
 * frames (requestAnimationFrame), the dialog's 50 ms focus timer and the exit
 * run only when the test moves the fake clock.
 */
const EXIT_MS = 150;

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  function makeMotion(tag: string) {
    return function MotionProxy(props: Record<string, unknown>) {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
      }
      return React.createElement(tag, clean);
    };
  }
  // One component per tag, for good: a new one each render would remount the dialog (a new input).
  const made = new Map<string, ReturnType<typeof makeMotion>>();
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => made.get(prop) ?? made.set(prop, makeMotion(prop)).get(prop) });
  function AnimatePresence({ children }: { children?: React.ReactNode }) {
    const [shown, setShown] = React.useState<React.ReactNode>(children || null);
    const [leaving, setLeaving] = React.useState(false);
    // Present: shown at once (the same elements, if it was still leaving). Gone: kept for its exit.
    if (children && shown !== children) {
      setShown(children);
      setLeaving(false);
    }
    if (!children && shown && !leaving) setLeaving(true);
    React.useEffect(() => {
      if (!leaving) return;
      const t = setTimeout(() => setShown(null), EXIT_MS);
      return () => clearTimeout(t);
    }, [leaving]);
    return <>{children || shown}</>;
  }
  return { motion: proxy, m: proxy, AnimatePresence, LazyMotion: (p: { children: React.ReactNode }) => p.children, domAnimation: {} };
});

afterEach(cleanup);

const isOpen = () => useAppStore.getState().quickSearchOpen;
const KEYS = {
  K: { key: 'k', ctrlKey: true },
  M: { key: 'K', metaKey: true },
  E: { key: 'Escape' },
} as const;
type Key = keyof typeof KEYS;
const press = (k: Key) => act(() => {
  window.dispatchEvent(new KeyboardEvent('keydown', { ...KEYS[k], cancelable: true }));
});
const later = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });
/** Every run of n keys: Cmd+K or Ctrl+K (they alternate) and Escape. */
function runs(n: number): Key[][] {
  if (n === 0) return [[]];
  return runs(n - 1).flatMap((r) => (['K', 'E'] as const).map((k) => [...r, k]));
}
const withCmd = (run: Key[]): Key[] => {
  let ks = 0;
  return run.map((k) => (k === 'K' && ks++ % 2 === 1 ? 'M' : k));
};
const after = (open: boolean, k: Key) => (k === 'E' ? false : !open);

let a: HTMLButtonElement;
let b: HTMLButtonElement;
beforeEach(() => {
  vi.useFakeTimers();
  useAppStore.setState({ quickSearchOpen: false });
  a = document.createElement('button');
  b = document.createElement('button');
  a.textContent = 'a';
  b.textContent = 'b';
  document.body.append(a, b);
});
afterEach(() => {
  vi.useRealTimers();
  a.remove();
  b.remove();
});

describe('QuickSearch: focus after any run of opens and closes, however fast', () => {
  it('the closed dialog\'s input stays on the page while it leaves (what makes this file\'s runs real)', () => {
    a.focus();
    render(<QuickSearch />);
    press('K');
    later(60);
    const input = screen.getByRole('combobox');
    expect(document.activeElement).toBe(input);
    press('E');
    expect(isOpen()).toBe(false);
    expect(input.isConnected, 'still drawn, leaving').toBe(true);
    press('K');
    expect(screen.getByRole('combobox'), 'open again inside its exit: the same input').toBe(input);
    later(EXIT_MS + 60);
    expect(document.activeElement).toBe(input);
  });

  it('closed from outside (the store set elsewhere, so no frame of its own to come): focus goes back at once, and nothing is remembered', () => {
    a.focus();
    render(<QuickSearch />);
    press('K');
    later(60);
    expect(document.activeElement).toBe(screen.getByRole('combobox'));
    act(() => useAppStore.getState().setQuickSearchOpen(false));
    expect(document.activeElement, 'at once, though its input is still drawn, leaving').toBe(a);
    b.focus();
    press('K');
    later(60);
    press('E');
    later(EXIT_MS + 60);
    expect(document.activeElement, 'the next open goes back to where it began').toBe(b);
  });

  it('close and open inside one frame, then a close from outside: focus goes back at once to where that open began; the next open, from another element, closed by Escape, goes back to that element', () => {
    a.focus();
    render(<QuickSearch />);
    press('K');
    later(60);
    expect(document.activeElement).toBe(screen.getByRole('combobox'));
    press('K');
    expect(isOpen(), 'closed').toBe(false);
    press('K');
    expect(isOpen(), 'open again inside the same frame').toBe(true);
    later(60); // that close's frame, and the open's 50 ms
    expect(document.activeElement).toBe(screen.getByRole('combobox'));
    act(() => useAppStore.getState().setQuickSearchOpen(false));
    expect(document.activeElement, 'closed from outside: back at once').toBe(a);
    later(EXIT_MS + 60);
    expect(document.activeElement, 'and nothing moves it after').toBe(a);
    b.focus();
    press('K');
    later(60);
    press('E');
    later(EXIT_MS + 60);
    expect(document.activeElement, 'the next open went back to where IT began').toBe(b);
  });

  for (const n of [2, 3, 4, 5]) {
    it(`every run of ${n} keys, from closed and from open, all inside one frame or a frame after each: focus ends where search first opened (closed) or in the input (open), and nothing of its own is remembered`, { timeout: 20_000 }, () => {
      for (const start of ['closed', 'open'] as const) {
        for (const pace of ['one frame', 'a frame each'] as const) {
          for (const raw of runs(n)) {
            const run = withCmd(raw);
            const label = `${start}, ${pace}: ${run.join(' ')}`;
            useAppStore.setState({ quickSearchOpen: false });
            a.focus();
            const view = render(<QuickSearch />);
            let open = false;
            if (start === 'open') {
              press('K');
              later(60);
              open = true;
              expect(document.activeElement, `${label}: opened, the input`).toBe(screen.getByRole('combobox'));
            }
            const before = document.activeElement;
            for (const [i, k] of run.entries()) {
              press(k);
              open = after(open, k);
              expect(isOpen(), `${label}: after key ${i + 1}`).toBe(open);
              if (pace === 'one frame') expect(document.activeElement, `${label}: nothing moves focus inside the frame (key ${i + 1})`).toBe(before);
              else later(20);
            }
            later(60); // the frame, and the 50 ms timer of the last open
            if (open) {
              expect(document.activeElement, `${label}: ends open: the input`).toBe(screen.getByRole('combobox'));
              press('E');
            } else {
              expect(document.activeElement, `${label}: ends closed: where search first opened`).toBe(a);
            }
            later(EXIT_MS + 60);
            expect(isOpen()).toBe(false);
            expect(document.activeElement, `${label}: closed at last: where search first opened`).toBe(a);
            // Nothing remembered: from b, open and close; focus goes back to b, not to a nor to an element of the dialog.
            b.focus();
            press('K');
            later(60);
            press('E');
            later(EXIT_MS + 60);
            expect(document.activeElement, `${label}: the next open goes back to where it began`).toBe(b);
            // Its bookkeeping, once the run's frames have come: a close the dialog did not make (the store set
            // elsewhere) gives focus back at once to where that open began and forgets it, and the next open
            // from another element goes back to THAT element. A count of frames to come left too high (taken
            // down only when the frame finds search closed, say) leaves focus in the closing input instead.
            a.focus();
            press('K');
            later(60);
            act(() => useAppStore.getState().setQuickSearchOpen(false));
            expect(document.activeElement, `${label}: then closed from outside: back where that open began, at once`).toBe(a);
            later(EXIT_MS + 60);
            b.focus();
            press('K');
            later(60);
            press('E');
            later(EXIT_MS + 60);
            expect(document.activeElement, `${label}: and the next open, from b, goes back to b`).toBe(b);
            view.unmount();
            vi.clearAllTimers();
          }
        }
      }
    });
  }
});
