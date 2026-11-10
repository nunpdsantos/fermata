/**
 * ✕ on the start hint sends focus somewhere (the seat's decision 3,
 * 2026-11-10): to Explore's key picker, the first control under where the
 * hint was — not to <body>, where a keyboard or screen-reader user would
 * have to start again from the top. Laptop (the Root select) and phone (the
 * key button that opens the key sheet). When the hint ends by a chord picked,
 * focus stays on the chord.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '../../../i18n';
import { useAppStore } from '../../../state/store';
import { raiseStartHint, useStartHintStore } from '../../../state/startHint';
import { StartHint } from '../StartHint';
import { ExploreHeader } from '../../explore/ExploreHeader';
import { ChordsCard } from '../../explore/ChordsCard';

vi.mock('../../../hooks/useAudio', () => ({ useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }) }));
vi.mock('../../../core/services/audio.ts', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  resumeAudio: vi.fn(async () => {}),
  playScale: vi.fn(),
  playChordVoiced: vi.fn(),
  playArpeggioAscending: vi.fn(),
  cancelScheduledAudio: vi.fn(),
}));
vi.mock('../../notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return { StaffNotation: () => React.createElement('div', { 'data-testid': 'staff' }) };
});

const original = window.matchMedia;
function media(phone: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: phone && query.includes('max-width: 639px'), media: query, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
beforeEach(async () => {
  useAppStore.setState({
    view: 'explore', language: 'en', instrument: 'piano', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major',
    selectedChord: null, startHint: null, exploreDetail: 'simple', lessonLoan: null,
  });
  useStartHintStore.setState({ shown: null });
  await i18n.changeLanguage('en');
});
afterEach(() => {
  cleanup();
  window.matchMedia = original;
  act(() => raiseStartHint(null));
});

function Explore() {
  return (
    <>
      <StartHint />
      <ExploreHeader />
      <ChordsCard />
    </>
  );
}

describe('✕ on the start hint', () => {
  it.each([
    ['laptop', 'Enter', false],
    ['laptop', 'Space', false],
    ['phone', 'Enter', true],
  ] as const)('%s, dismissed from the keyboard (%s): focus is on Explore\'s key picker', async (_name, key, phone) => {
    media(phone);
    act(() => raiseStartHint('new'));
    render(<Explore />);
    const user = userEvent.setup();
    const dismiss = screen.getByRole('button', { name: 'Dismiss the tip' });
    dismiss.focus();
    await user.keyboard(key === 'Space' ? ' ' : '{Enter}');
    expect(screen.queryByTestId('start-hint')).toBeNull();
    expect(useAppStore.getState().startHint).toBeNull();
    const picker = screen.getByTestId('key-picker');
    expect(picker.tagName).toBe(phone ? 'BUTTON' : 'SELECT');
    expect(document.activeElement).toBe(picker);
  });

  it('a pointer tap on ✕ lands there too ("player")', async () => {
    act(() => raiseStartHint('player'));
    render(<Explore />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Dismiss the tip' }));
    expect(screen.queryByTestId('start-hint')).toBeNull();
    expect(document.activeElement).toBe(screen.getByTestId('key-picker'));
  });

  it('a chord picked ends the hint, and focus stays on the chord', async () => {
    act(() => raiseStartHint('player'));
    render(<Explore />);
    const chord = screen.getByRole('button', { name: 'G Major chord, degree 5' });
    await userEvent.setup().click(chord);
    expect(useAppStore.getState().startHint).toBeNull();
    // The line stays while in Explore (nothing jumps under the tap), and focus is where the learner put it.
    expect(screen.getByTestId('start-hint')).toBeTruthy();
    expect(document.activeElement).toBe(chord);
  });

  // The hint is the shell's: it can be dismissed while Explore's code is
  // still arriving (the e2e on the dev server did, and focus stayed on
  // <body>). The picker is focused when it appears — unless the learner put
  // focus somewhere meanwhile.
  function Loading({ loaded, other }: { loaded: boolean; other?: boolean }) {
    return (
      <>
        <StartHint />
        {other && <button type="button">Elsewhere</button>}
        {loaded && <ExploreHeader />}
      </>
    );
  }
  it('dismissed while Explore is still loading: the key picker gets focus when it appears', async () => {
    act(() => raiseStartHint('new'));
    const { rerender } = render(<Loading loaded={false} />);
    screen.getByRole('button', { name: 'Dismiss the tip' }).focus();
    await userEvent.setup().keyboard('{Enter}');
    expect(screen.queryByTestId('start-hint')).toBeNull();
    expect(document.activeElement).toBe(document.body);
    rerender(<Loading loaded />);
    await waitFor(() => expect(document.activeElement).toBe(screen.getByTestId('key-picker')));
  });
  it('…but never takes focus back from where the learner has put it meanwhile', async () => {
    act(() => raiseStartHint('new'));
    const { rerender } = render(<Loading loaded={false} other />);
    screen.getByRole('button', { name: 'Dismiss the tip' }).focus();
    await userEvent.setup().keyboard('{Enter}');
    const elsewhere = screen.getByRole('button', { name: 'Elsewhere' });
    elsewhere.focus();
    rerender(<Loading loaded other />);
    await new Promise((r) => setTimeout(r, 20));
    expect(screen.getByTestId('key-picker')).toBeTruthy();
    expect(document.activeElement).toBe(elsewhere);
  });
});
