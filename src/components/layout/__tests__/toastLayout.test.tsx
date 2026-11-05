/**
 * W11-A review round 4: toasts are an overlay bounded by what they must not
 * cover. toastLayout publishes --toast-top (under the top bar) and
 * --toast-room (down to the first registered element, minus a gap).
 */
import { describe, it, expect, afterEach } from 'vitest';
import { useRef } from 'react';
import { render, cleanup } from '@testing-library/react';
import { fitToastQueue, useToastAvoid, measureToastRoom, resetToastLayoutForTests } from '../toastLayout';

const rect = (top: number, height: number) => ({ top, bottom: top + height, height, left: 0, right: 390, width: 390, x: 0, y: top, toJSON: () => ({}) }) as DOMRect;

function Avoided({ top, height }: { top: number; height: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useToastAvoid(ref);
  return <div ref={(el) => { ref.current = el; if (el) el.getBoundingClientRect = () => rect(top, height); }} />;
}

afterEach(() => {
  cleanup();
  resetToastLayoutForTests();
  document.body.innerHTML = '';
});

const vars = () => ({
  top: document.documentElement.style.getPropertyValue('--toast-top'),
  room: document.documentElement.style.getPropertyValue('--toast-room'),
});

describe('toast room', () => {
  it('runs from under the top bar down to the highest avoided element', () => {
    const bar = document.createElement('header');
    bar.className = 'app-topbar';
    bar.getBoundingClientRect = () => rect(0, 60);
    document.body.appendChild(bar);
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 844 });

    render(<><Avoided top={452} height={392} /><Avoided top={600} height={100} /></>);
    measureToastRoom();
    // top = 60 + 8; room = 452 - 8 - 68
    expect(vars()).toEqual({ top: '68px', room: '376px' });
  });

  it('with nothing to avoid, the room runs to the bottom of the screen', () => {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 600 });
    measureToastRoom();
    expect(vars()).toEqual({ top: '8px', room: '584px' });
  });

  it('an avoided element that is gone (zero height) does not count', () => {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 600 });
    render(<Avoided top={100} height={0} />);
    measureToastRoom();
    expect(vars().room).toBe('584px');
  });
});

describe('whole-card toast queue', () => {
  it('never lets a smaller card overtake a waiting or unmeasured card', () => {
    expect(fitToastQueue([58, 80, 20], 100)).toEqual({ visible: [true, false, false], tops: [0, 0, 0], height: 58 });
    expect(fitToastQueue([80, 20], 60).visible).toEqual([false, false]);
    expect(fitToastQueue([0, 20], 60).visible).toEqual([false, false]);
    expect(fitToastQueue([80, 20], 108).visible).toEqual([true, true]);
    expect(fitToastQueue([20], 60).visible).toEqual([true]);
  });
  it('queues the clipped third and fourth landscape cards without scrolling', () => {
    const fitted = fitToastQueue([58, 58, 58, 54], 132);
    expect(fitted.visible).toEqual([true, true, false, false]);
    expect(fitted.height).toBe(124);
  });
  it('shows the next complete card after dismissal, and queues all with no room', () => {
    expect(fitToastQueue([58, 54], 60).visible).toEqual([true, false]);
    expect(fitToastQueue([58, 54], 0).visible).toEqual([false, false]);
  });
});
