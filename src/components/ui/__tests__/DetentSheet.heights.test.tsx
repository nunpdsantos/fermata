/**
 * W11-A review round 4: the sheet's detents are sized so nothing moves when a
 * toast comes or goes (Full leaves one toast's room above the sheet), and so
 * Half is usable on a phone held sideways (the view keeps 120 px, the content
 * gets at least 160 px when there is room).
 */
import { useState } from 'react';
import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent, act } from '@testing-library/react';
import { DetentSheet } from '../DetentSheet';
import type { Detent } from '../../../state/dock';

const HEAD = 72;
const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      return (this as HTMLElement).classList.contains('detent-head') ? HEAD : 0;
    },
  });
});
afterAll(() => {
  if (original) Object.defineProperty(HTMLElement.prototype, 'offsetHeight', original);
});
afterEach(cleanup);

const heightAt = (detent: Detent, available: number, fullGap = 0) => {
  const { getByTestId } = render(
    <DetentSheet detent={detent} onDetent={() => {}} available={available} fullGap={fullGap} handleLabel="Panel" detentLabels={{ peek: 'Peek', half: 'Half', full: 'Full' }} bar={null} testId="sheet">
      <div />
    </DetentSheet>,
  );
  const h = getByTestId('sheet').style.height;
  cleanup();
  return h === '' ? null : parseFloat(h);
};

describe('DetentSheet heights', () => {
  it('Full leaves the gap it is given above the sheet (room for one toast)', () => {
    expect(heightAt('full', 772, 76)).toBe(696);
    expect(heightAt('full', 772)).toBe(772);
  });

  it('upright phone: Half is half of the room', () => {
    expect(heightAt('half', 772, 76)).toBe(386);
  });

  it('phone sideways (330 px of room): Half keeps the view 120 px and gives the content more than a sliver', () => {
    const half = heightAt('half', 330, 76)!;
    expect(half).toBe(210); // 330 - 120
    expect(half - HEAD).toBeGreaterThanOrEqual(130);
    expect(half).toBeLessThanOrEqual(heightAt('full', 330, 76)!);
  });

  it('Peek is the bar only (no inline height)', () => {
    expect(heightAt('peek', 772, 76)).toBeNull();
  });
});

/**
 * 9 Nov (brief G): the sheet is never taller than its content. The content's
 * natural height is read from its children's boxes (jsdom has no layout, so
 * the child's height is stubbed here through `data-h`).
 */
describe('DetentSheet — sized to its content', () => {
  const rect = Object.getOwnPropertyDescriptor(Element.prototype, 'getBoundingClientRect')!;
  beforeAll(() => {
    Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
      configurable: true,
      value(this: Element) {
        const h = Number(this.getAttribute('data-h') ?? 0);
        return { top: 0, bottom: h, left: 0, right: 100, width: h ? 100 : 0, height: h, x: 0, y: 0, toJSON() {} } as DOMRect;
      },
    });
  });
  afterAll(() => {
    Object.defineProperty(Element.prototype, 'getBoundingClientRect', rect);
  });

  function Harness({ start, content, available = 772, spy = vi.fn(), shown = vi.fn() }: { start: Detent; content: number; available?: number; spy?: (d: Detent) => void; shown?: (d: Detent) => void }) {
    const [detent, setDetent] = useState<Detent>(start);
    return (
      <DetentSheet detent={detent} onDetent={(d) => { spy(d); setDetent(d); }} onShown={shown} available={available} fullGap={76} handleLabel="Panel" detentLabels={{ peek: 'Peek', half: 'Half', full: 'Full' }} bar={null} testId="sheet">
        <div data-h={content}><button type="button">Key</button></div>
      </DetentSheet>
    );
  }
  const sheetHeight = () => parseFloat(screen.getByTestId('sheet').style.height);

  it('a keyboard shorter than Half: Half is the bar + the keyboard, and there is no separate Full', () => {
    const spy = vi.fn();
    const shown = vi.fn();
    render(<Harness start="half" content={228} spy={spy} shown={shown} />);
    expect(sheetHeight()).toBe(HEAD + 228);
    const handle = screen.getByRole('separator', { name: 'Panel' });
    expect(handle.getAttribute('aria-valuemax')).toBe('1');
    expect(handle.getAttribute('aria-valuenow')).toBe('1');
    expect(handle.getAttribute('aria-valuetext')).toBe('Half');
    // ↑ and End stay at the top stop (nothing to grow into); no change is reported.
    fireEvent.keyDown(handle, { key: 'ArrowUp' });
    fireEvent.keyDown(handle, { key: 'End' });
    expect(spy).not.toHaveBeenCalled();
    // A tap on the handle at the top stop folds it to Peek; another opens it again.
    act(() => {
      fireEvent.pointerDown(handle, { clientY: 500, pointerId: 1, button: 0 });
      fireEvent.pointerUp(handle, { clientY: 500, pointerId: 1, button: 0 });
    });
    expect(spy).toHaveBeenLastCalledWith('peek');
    act(() => {
      fireEvent.pointerDown(handle, { clientY: 700, pointerId: 2, button: 0 });
      fireEvent.pointerUp(handle, { clientY: 700, pointerId: 2, button: 0 });
    });
    expect(spy).toHaveBeenLastCalledWith('half');
    expect(shown).toHaveBeenLastCalledWith('half');
  });

  it('a Full asked for (the learner chose it on the guitar) shows, and is announced, as Half', () => {
    const shown = vi.fn();
    render(<Harness start="full" content={228} shown={shown} />);
    const sheet = screen.getByTestId('sheet');
    expect(sheet.getAttribute('data-detent')).toBe('half');
    expect(sheetHeight()).toBe(HEAD + 228);
    expect(screen.getByRole('separator').getAttribute('aria-valuetext')).toBe('Half');
    expect(shown).toHaveBeenLastCalledWith('half');
  });

  it('content taller than Half: Half unchanged, Full ends where the content ends', () => {
    const spy = vi.fn();
    const shown = vi.fn();
    render(<Harness start="half" content={523} spy={spy} shown={shown} />);
    expect(sheetHeight()).toBe(386);
    const handle = screen.getByRole('separator');
    expect(handle.getAttribute('aria-valuemax')).toBe('2');
    fireEvent.keyDown(handle, { key: 'End' });
    expect(spy).toHaveBeenLastCalledWith('full');
    expect(sheetHeight()).toBe(HEAD + 523);
    expect(screen.getByTestId('sheet').getAttribute('data-detent')).toBe('full');
    expect(shown).toHaveBeenLastCalledWith('full');
  });

  it('content taller than Full: Half and Full as before', () => {
    render(<Harness start="full" content={900} />);
    expect(sheetHeight()).toBe(696);
    fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowDown' });
    expect(sheetHeight()).toBe(386);
  });

  it('phone sideways (330 px of room): a keyboard taller than Full keeps Half at 210 and Full at 254', () => {
    render(<Harness start="half" content={224} available={330} />);
    expect(sheetHeight()).toBe(210);
    fireEvent.keyDown(screen.getByRole('separator'), { key: 'End' });
    expect(sheetHeight()).toBe(254);
  });
});
