import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';
import { deliverLink, prefersShareSheet, shareLinkLabel } from '../shareLinkMake';
import { useToastStore, toast } from '../../state/toastStore';
import { useShareFallbackStore, closeShareFallback } from '../../state/shareFallbackStore';
import { ShareLinkHost } from '../../components/share/ShareLinkHost';
import { ToastContainer } from '../../components/layout/Toast';

const URL_ = 'http://localhost:3000/?key=D&scale=major&chord=A&inst=guitar';

function setPointer(coarse: boolean) {
  window.matchMedia = ((q: string) => ({
    matches: q === '(pointer: coarse)' ? coarse : false,
    media: q, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

const originalMatchMedia = window.matchMedia;
let writeText: ReturnType<typeof vi.fn>;

beforeEach(() => {
  useToastStore.setState({ toasts: [] });
  closeShareFallback();
  writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  setPointer(false);
});

afterEach(() => {
  cleanup();
  window.matchMedia = originalMatchMedia;
  // jsdom has no navigator.share of its own.
  delete (navigator as unknown as Record<string, unknown>).share;
});

describe('delivering a link', () => {
  it('on a laptop: the clipboard and a "Link copied" toast (no share sheet, even if offered)', async () => {
    Object.defineProperty(navigator, 'share', { value: vi.fn(), configurable: true });
    expect(prefersShareSheet()).toBe(false);
    expect(shareLinkLabel()).toBe('Copy link');
    await expect(deliverLink(URL_)).resolves.toBe('copied');
    expect(writeText).toHaveBeenCalledWith(URL_);
    expect((navigator.share as ReturnType<typeof vi.fn>)).not.toHaveBeenCalled();
    expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual(['Link copied']);
  });

  it('on a phone with a share sheet: the sheet, nothing copied', async () => {
    setPointer(true);
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    expect(shareLinkLabel()).toBe('Share link');
    await expect(deliverLink(URL_, 'The Major Scale')).resolves.toBe('shared');
    expect(share).toHaveBeenCalledWith({ url: URL_, title: 'The Major Scale' });
    expect(writeText).not.toHaveBeenCalled();
  });

  it('the learner closing the share sheet does nothing more', async () => {
    setPointer(true);
    Object.defineProperty(navigator, 'share', { value: vi.fn().mockRejectedValue(new DOMException('x', 'AbortError')), configurable: true });
    await expect(deliverLink(URL_)).resolves.toBe('cancelled');
    expect(writeText).not.toHaveBeenCalled();
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('a refused share sheet falls back to the clipboard', async () => {
    setPointer(true);
    Object.defineProperty(navigator, 'share', { value: vi.fn().mockRejectedValue(new DOMException('x', 'NotAllowedError')), configurable: true });
    await expect(deliverLink(URL_)).resolves.toBe('copied');
    expect(writeText).toHaveBeenCalledWith(URL_);
  });

  it('both refused: the link in a selectable field', async () => {
    setPointer(true);
    Object.defineProperty(navigator, 'share', { value: vi.fn().mockRejectedValue(new DOMException('x', 'NotAllowedError')), configurable: true });
    writeText.mockRejectedValue(new Error('denied'));
    render(<ShareLinkHost />);
    await act(async () => {
      await expect(deliverLink(URL_)).resolves.toBe('fallback');
    });
    expect(useShareFallbackStore.getState().url).toBe(URL_);
    const field = (await screen.findByTestId('share-fallback-field')) as HTMLInputElement;
    expect(field.value).toBe(URL_);
    expect(field.readOnly).toBe(true);
    expect(screen.getByRole('dialog', { name: 'Copy this link' })).toBeTruthy();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    });
    expect(useShareFallbackStore.getState().url).toBeNull();
  });
});

describe('a toast with an action', () => {
  it('shows its button; the button runs it and closes the toast', () => {
    const onSelect = vi.fn();
    useToastStore.getState().addToast({ type: 'info', message: 'Ready', duration: 0, action: { label: 'Open', onSelect } });
    render(<ToastContainer />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('plain toasts are unchanged (no action button) and addToast returns the id', () => {
    toast('Hello');
    render(<ToastContainer />);
    expect(screen.queryByRole('button', { name: 'Open' })).toBeNull();
    const id = useToastStore.getState().addToast({ type: 'info', message: 'x', duration: 0 });
    expect(useToastStore.getState().toasts.some((t) => t.id === id)).toBe(true);
  });
});
