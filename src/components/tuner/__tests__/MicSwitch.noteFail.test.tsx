/**
 * The top bar's note (MicBarNote, a lazy chunk) cannot be downloaded: the
 * switch's tap must not take the app shell down with it (the only error
 * boundary above the top bar is the app-level one). The bar stays, the
 * switch stays usable, and nothing is asked of the browser without the
 * sentence that says why.
 */
import { Component, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { installFakeMic, type FakeMic } from '../../../services/microphone/__tests__/fakeMic';
import { stopListening } from '../../../services/microphone/microphone';
import '../../../services/microphone/micSession';
import { micOff, useMic } from '../../../services/microphone/micSwitch';
import { useAppStore } from '../../../state/store';
import { clearDemoRequest } from '../../../state/demoRequest';

vi.mock('../MicBarNote.tsx', () => {
  throw new Error('Failed to fetch dynamically imported module');
});
vi.mock('../hearString.ts', () => ({ REFERENCE_SECONDS: 2.5, prepareGuitarStrings: () => undefined, playGuitarString: () => undefined }));

import { TopBar } from '../../layout/TopBar';

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <p data-testid="app-error">The app failed</p> : this.props.children;
  }
}

let mic: FakeMic;
beforeEach(() => {
  mic = installFakeMic();
  micOff();
  useMic.setState({ check: false });
  clearDemoRequest();
  useAppStore.setState({ view: 'explore', language: 'en' });
});
afterEach(() => {
  cleanup();
  micOff();
  stopListening();
  mic.restore();
});

describe('the top bar\'s note fails to download', () => {
  it('the tap leaves the app shell and the switch in place; nothing is asked without its sentence', async () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      render(<Boundary><TopBar /></Boundary>);
      fireEvent.click(screen.getByRole('button', { name: 'Microphone' }));
      await vi.waitFor(() => expect(useMic.getState().state).toEqual({ kind: 'asking', step: 'explain' }));
      await act(() => new Promise((resolve) => setTimeout(resolve, 100)));
      expect(screen.queryByTestId('app-error')).toBeNull();
      expect(screen.getByTestId('app-topbar')).toBeTruthy();
      expect(screen.queryByTestId('mic-bar-note')).toBeNull();
      expect(mic.getUserMedia).not.toHaveBeenCalled();
      // The switch still answers a tap: off, every context closed.
      fireEvent.click(screen.getByRole('button', { name: 'Microphone' }));
      expect(useMic.getState().state).toEqual({ kind: 'off' });
      expect(mic.contexts.every((c) => c.state === 'closed')).toBe(true);
    } finally {
      quiet.mockRestore();
    }
  });
});
