/**
 * Design review (with audit W2-03): Explore opened scrolled ~300 px down
 * because the piano focused its middle-C key on mount. Mounting must move no
 * focus; arrow-key navigation inside the keyboard must still move focus, and
 * without scrolling the page.
 */
import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import { useAppStore } from '../../../state/store';

vi.mock('../../../hooks/useAudio.ts', () => ({
  useAudio: () => ({ noteOn: vi.fn(async () => {}), noteOff: vi.fn() }),
}));

import { Piano } from '../Piano';

beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      value: (q: string) => ({ matches: false, media: q, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } }),
    });
  }
  Element.prototype.scrollIntoView ??= () => {};
  (Element.prototype as unknown as { scrollTo: () => void }).scrollTo ??= () => {};
});

afterEach(cleanup);

describe('Piano focus', () => {
  it('mounting does not move focus', () => {
    useAppStore.setState({ exerciseInputActive: false, baseOctave: 4 });
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    render(<Piano />);
    expect(document.activeElement).toBe(document.body);
    expect(focusSpy).not.toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it('arrow keys move focus between keys without scrolling the page', () => {
    const { container } = render(<Piano />);
    const c4 = container.querySelector('[aria-label="C4"]') as HTMLElement;
    expect(c4.getAttribute('tabindex')).toBe('0');
    act(() => c4.focus());
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    fireEvent.keyDown(c4, { key: 'ArrowRight' });
    expect(document.activeElement?.getAttribute('aria-label')).toMatch(/^(C#|Db)4$/);
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    focusSpy.mockRestore();
  });
});
