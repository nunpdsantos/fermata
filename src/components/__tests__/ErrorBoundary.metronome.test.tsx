/**
 * Review of e92e44e: when the app's error boundary replaces the whole screen,
 * a running metronome would click on with no bar and no "⋯" to stop it. The
 * full-page boundary asks it to stop (services/metronome/stopRequest.ts,
 * eager and import-free: it loads none of the metronome's code); a view's own
 * boundary (ViewSlot, with a fallback) keeps the shell and the bar on screen,
 * so it asks nothing. The metronome's side — a running clock stops on the
 * request — is in services/metronome/__tests__/metronome.test.ts.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
import { onMetronomeStopRequest } from '../../services/metronome/stopRequest';

function Bomb(): never {
  throw new Error('boom');
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('the error boundary and a running metronome', () => {
  it('the full-page card asks the metronome to stop, once', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const heard = vi.fn();
    const off = onMetronomeStopRequest(heard);
    render(<ErrorBoundary><Bomb /></ErrorBoundary>);
    expect(heard).toHaveBeenCalledTimes(1);
    off();
  });

  it('a view\'s own boundary (a fallback: the shell and the bar stay) asks nothing', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const heard = vi.fn();
    const off = onMetronomeStopRequest(heard);
    render(<ErrorBoundary fallback={() => <p>view failed</p>}><Bomb /></ErrorBoundary>);
    expect(heard).not.toHaveBeenCalled();
    off();
  });

  it('no crash, no request', () => {
    const heard = vi.fn();
    const off = onMetronomeStopRequest(heard);
    render(<ErrorBoundary><p>fine</p></ErrorBoundary>);
    expect(heard).not.toHaveBeenCalled();
    off();
  });
});
