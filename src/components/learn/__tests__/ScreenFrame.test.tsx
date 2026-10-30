/**
 * Audit W9-08 (F-10): while a Learn screen animates out (AnimatePresence
 * mode="wait"), it stayed clickable — a tap meant for the incoming screen
 * could land on the outgoing one (the e2e flake: the click hit the Level
 * page's Continue banner as it faded). An exiting screen must take no
 * pointer input and be inert; the present screen is untouched.
 *
 * Real framer-motion (no mock) so presence is the library's own.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { ScreenFrame } from '../ScreenFrame';

afterEach(cleanup);

function Screens({ which }: { which: 'a' | 'b' }) {
  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait" initial={false}>
        {which === 'a' ? (
          <ScreenFrame key="a" xOffset={40} enterFrom="right">
            <button>Screen A</button>
          </ScreenFrame>
        ) : (
          <ScreenFrame key="b" xOffset={40} enterFrom="right">
            <button>Screen B</button>
          </ScreenFrame>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

describe('ScreenFrame (W9-08)', () => {
  it('a present screen takes clicks', () => {
    render(<Screens which="a" />);
    const frame = screen.getByText('Screen A').closest('[data-learn-screen]') as HTMLElement;
    expect(frame.style.pointerEvents).not.toBe('none');
    expect(frame.hasAttribute('inert')).toBe(false);
  });

  it('an exiting screen takes no pointer input and is inert while it animates out', () => {
    const { rerender } = render(<Screens which="a" />);
    act(() => rerender(<Screens which="b" />));
    // mode="wait": A is still in the DOM, animating out; B is not mounted yet.
    const exiting = screen.getByText('Screen A').closest('[data-learn-screen]') as HTMLElement;
    expect(exiting.style.pointerEvents).toBe('none');
    expect(exiting.hasAttribute('inert')).toBe(true);
  });
});
