import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('../../../core/services/audio', async (orig) => {
  const real = await orig<typeof import('../../../core/services/audio')>();
  return {
    ...real,
    getAudioState: vi.fn(() => 'running'),
    resumeAudio: vi.fn(async () => {}),
    cancelScheduledAudio: vi.fn(),
    setMasterVolume: vi.fn(),
    playScale: vi.fn((...args: unknown[]) => setTimeout(args[6] as () => void, 50)),
  };
});
// The views are not mounted here: every target is "there" at once.
vi.mock('../../../services/tour/dom', async (orig) => {
  const real = await orig<typeof import('../../../services/tour/dom')>();
  return { ...real, waitSettled: vi.fn(async () => document.createElement('div')) };
});

import i18n from 'i18next';
import { TopBar } from '../../layout/TopBar';
import { TourHost } from '../TourHost';
import { clearDemoRequest, getDemoRequest, requestDemo } from '../../../state/demoRequest';
import { useAppStore } from '../../../state/store';
import { useToastStore } from '../../../state/toastStore';
import { registerWorkInProgress } from '../../../services/workInProgress';

function setReducedMotion(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduce && query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

const bar = () => screen.findByRole('region', { name: 'Tour of the app' });

beforeEach(async () => {
  localStorage.clear();
  setReducedMotion(true);
  useToastStore.setState({ toasts: [] });
  useAppStore.setState({ view: 'explore', lastView: 'explore', instrument: 'piano', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', selectedChord: null });
  await act(async () => { await i18n.changeLanguage('en'); });
});
afterEach(() => {
  act(() => clearDemoRequest());
  cleanup();
  delete (window as { matchMedia?: unknown }).matchMedia;
});

describe('the tour host and caption bar', () => {
  it('"⋯" → "Show me around" starts the tour: a named region, the caption announced politely', async () => {
    render(<><TopBar /><TourHost /></>);
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Show me around' }));
    expect(getDemoRequest()).toBe('intro');
    const region = await bar();
    const caption = await screen.findByText('Most songs live in a key. Here we pick G major.');
    expect(caption.getAttribute('role')).toBe('status');
    expect(region.contains(caption)).toBe(true);
    expect(screen.getByRole('img', { name: /^Step 1 of \d$/ })).toBeTruthy();
  });

  it('every control is a named button; reduced motion: no Pause, Next and Back step', async () => {
    render(<TourHost />);
    act(() => requestDemo('intro', 'menu'));
    await bar();
    for (const name of ['Back', 'Next', 'Sound', 'End the tour']) expect(screen.getByRole('button', { name })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Pause' })).toBeNull();
    // (Focus moving into the bar needs a laid-out bar: e2e/tour.spec.ts "keyboard only".)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByText('These are the notes of that key, lit on the instrument.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(await screen.findByText(/Most songs live in a key/)).toBeTruthy();
  });

  it('with motion: Pause / Resume', async () => {
    setReducedMotion(false);
    render(<TourHost />);
    act(() => requestDemo('intro', 'menu'));
    await bar();
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(screen.getByRole('button', { name: 'Resume' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Resume' }));
    expect(screen.getByRole('button', { name: 'Pause' })).toBeTruthy();
  });

  it('Escape ends the tour, puts the app back and clears the request', async () => {
    render(<TourHost />);
    act(() => requestDemo('intro', 'menu'));
    await bar();
    await waitFor(() => expect(useAppStore.getState().selectedKey.natural).toBe('G'));
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(getDemoRequest()).toBeNull());
    expect(screen.queryByRole('region', { name: 'Tour of the app' })).toBeNull();
    expect(useAppStore.getState().selectedKey).toEqual({ natural: 'C', accidental: '' });
  });

  it('touching the app pauses the tour and offers Resume / End', async () => {
    render(<><button type="button">app</button><TourHost /></>);
    act(() => requestDemo('intro', 'menu'));
    await bar();
    fireEvent.pointerDown(screen.getByRole('button', { name: 'app' }));
    expect(await screen.findByText('Paused: you touched the app.')).toBeTruthy();
    // Pressing the bar's own buttons is not touching the app.
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Resume' }));
    fireEvent.click(screen.getByRole('button', { name: 'Resume' }));
    await waitFor(() => expect(screen.queryByText('Paused: you touched the app.')).toBeNull());
    fireEvent.pointerDown(screen.getByRole('button', { name: 'app' }));
    fireEvent.click(await screen.findByRole('button', { name: 'End' }));
    await waitFor(() => expect(getDemoRequest()).toBeNull());
  });

  it('the menu tour ends on "Stay here" / "Back to where I was"', async () => {
    render(<TourHost />);
    act(() => requestDemo('intro', 'menu'));
    await bar();
    for (let i = 0; i < 12 && !screen.queryByText('Your turn.'); i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      await act(async () => { await new Promise((r) => setTimeout(r, 10)); });
    }
    expect(screen.getByText('Your turn.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Back to where I was' }));
    await waitFor(() => expect(getDemoRequest()).toBeNull());
    expect(useAppStore.getState().selectedKey.natural).toBe('C');
  });

  it('a start-screen tour (requestDemo with no source) simply ends: one "Done", the app put back, the request cleared', async () => {
    render(<TourHost />);
    act(() => requestDemo('intro'));
    await bar();
    for (let i = 0; i < 12 && !screen.queryByText('Your turn.'); i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      await act(async () => { await new Promise((r) => setTimeout(r, 10)); });
    }
    expect(screen.queryByRole('button', { name: 'Stay here' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Back to where I was' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(getDemoRequest()).toBeNull());
    expect(useAppStore.getState().selectedKey.natural).toBe('C');
  });

  it('does not start while work is in progress: it says why and clears the request', async () => {
    const unregister = registerWorkInProgress('test-check', () => true);
    try {
      render(<TourHost />);
      act(() => requestDemo('intro', 'menu'));
      await waitFor(() => expect(getDemoRequest()).toBeNull());
      expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual(['Finish or leave your check first.']);
      expect(screen.queryByRole('region', { name: 'Tour of the app' })).toBeNull();
      expect(useAppStore.getState().selectedKey.natural).toBe('C');
    } finally {
      unregister();
    }
  });

  it('speaks the learner\'s language (PT)', async () => {
    await act(async () => { await i18n.changeLanguage('pt'); });
    render(<TourHost />);
    act(() => requestDemo('intro', 'menu'));
    expect(await screen.findByRole('region', { name: 'Visita guiada à app' })).toBeTruthy();
    expect(screen.getByText('A maioria das canções está numa tonalidade. Aqui escolhemos G maior.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Seguinte' })).toBeTruthy();
  });
});
