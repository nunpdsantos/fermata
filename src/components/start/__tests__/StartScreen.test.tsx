/**
 * The start screen (wave 1) in the app: a page IN PLACE of the shell on a
 * first visit (the views never mount behind it), its heading structure,
 * first focus and controls; the tour request hides it and its end brings it
 * back; a door lands in Explore. Plus the Settings row and the start hint.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, act, waitFor, within } from '@testing-library/react';

vi.mock('../../../views/ExploreView.tsx', () => ({ ExploreView: () => <div>EXPLORE_VIEW</div> }));
vi.mock('../../../views/LearnView.tsx', () => ({ LearnView: () => <div>LEARN_VIEW</div> }));
vi.mock('../../../views/DrillView.tsx', () => ({ DrillView: () => <div>DRILL_VIEW</div> }));
vi.mock('../../../hooks/useTheme.ts', () => ({ useTheme: () => {} }));
vi.mock('../../navigation/QuickSearch.tsx', () => ({ QuickSearch: () => null }));
vi.mock('../../layout/AppShell.tsx', () => ({
  AppShell: (p: { children: React.ReactNode }) => (
    <div data-testid="app-shell">
      {(['explore', 'learn', 'drill'] as const).map((v) => <button key={v} id={`tab-${v}`}>{v}</button>)}
      {p.children}
    </div>
  ),
}));
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const proxy = new Proxy({}, {
    get: (_t: unknown, tag: string) => (props: Record<string, unknown>) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (k === 'children' || !/^(while|initial|animate|exit|transition|layout|variants|drag)/.test(k)) clean[k] = v;
      }
      return React.createElement(tag === 'div' ? 'div' : tag, clean);
    },
  });
  return {
    motion: proxy, m: proxy, useReducedMotion: () => false,
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    MotionConfig: (p: { children: React.ReactNode }) => p.children,
    domAnimation: {},
  };
});

import i18n from '../../../i18n';
import App from '../../../App';
import { useAppStore } from '../../../state/store';
import { WELCOME_KEY, bootWelcome, useWelcomeStore } from '../../../state/welcomeGate';
import { applyShareLinkRule } from '../../../state/startGate';
import { clearDemoRequest, getDemoRequest } from '../../../state/demoRequest';
import { useStartHintStore, raiseStartHint } from '../../../state/startHint';
import { SettingsSheet } from '../../layout/SettingsSheet';
import { StartHint } from '../../layout/StartHint';

beforeEach(async () => {
  clearDemoRequest();
  useAppStore.setState({ view: 'explore', lastView: 'explore', instrument: 'piano', language: 'en', learnerProfile: null, startHint: null, pendingLearnTarget: null });
  useStartHintStore.setState({ shown: null });
  useWelcomeStore.setState({ open: false, shownThisPage: false, bootSearch: '' });
  window.history.replaceState(null, '', '/');
  await i18n.changeLanguage('en');
});
afterEach(cleanup);

async function firstVisit(search = '') {
  localStorage.clear();
  expect(bootWelcome(localStorage, search)).toBe(true);
  applyShareLinkRule();
  render(<App />);
}
const startPage = () => screen.findByTestId('start-screen', {}, { timeout: 8000 });

describe('the start screen in the app', () => {
  it('a first visit gets the page, not the app: no shell, no view mounted behind it', async () => {
    await firstVisit();
    // Before its chunk arrives: just the page colour.
    expect(screen.queryByTestId('app-shell')).toBeNull();
    const page = await startPage();
    expect(screen.queryByTestId('app-shell')).toBeNull();
    expect(screen.queryByText('EXPLORE_VIEW')).toBeNull();
    expect(page.tagName).toBe('MAIN');
    // Headings: h1 the name, h2 the doors' question.
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Fermata');
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Where are you starting from?');
    expect(page.textContent).toContain('Learn how music works, on a piano or guitar you can play right here.');
    expect(page.textContent).toContain('Free. No account. Works offline. Your progress stays in this browser.');
    // First focus: the page's heading.
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1 })));
    // No close: the three doors are the ways out.
    expect(screen.queryByRole('button', { name: /close/i })).toBeNull();
    const doors = within(screen.getByRole('list')).getAllByRole('button');
    expect(doors.map((d) => d.textContent)).toEqual([
      "I'm new to musicStart with sound. You don't need to read music.",
      'I play, but never learned theorySee why the chords you know go together.',
      'I know some theoryStraight to the tools: keys, chords, scales, the circle of fifths.',
    ]);
  });

  it('"I\'ll use" and the language are segments wired to the saved settings', async () => {
    await firstVisit();
    await startPage();
    const inst = screen.getByRole('radiogroup', { name: "I'll use:" });
    fireEvent.click(within(inst).getByRole('radio', { name: 'Guitar' }));
    expect(useAppStore.getState().instrument).toBe('guitar');
    const lang = screen.getByRole('radiogroup', { name: 'Language' });
    fireEvent.click(within(lang).getByRole('radio', { name: 'Português' }));
    expect(useAppStore.getState().language).toBe('pt');
    await waitFor(() => expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Qual é o teu ponto de partida?'));
    expect(screen.getByRole('button', { name: /A música é nova para mim/ })).toBeDefined();
  });

  it('a door: Explore, the profile and instrument saved, the gate closed for good, focus on the Explore tab', async () => {
    await firstVisit();
    await startPage();
    fireEvent.click(within(screen.getByRole('radiogroup', { name: "I'll use:" })).getByRole('radio', { name: 'Guitar' }));
    fireEvent.click(screen.getByRole('button', { name: /I play, but never learned theory/ }));
    expect(await screen.findByText('EXPLORE_VIEW', {}, { timeout: 8000 })).toBeDefined();
    expect(screen.queryByTestId('start-screen')).toBeNull();
    expect(useAppStore.getState()).toMatchObject({ learnerProfile: 'player', instrument: 'guitar', view: 'explore', startHint: 'player' });
    expect(localStorage.getItem(WELCOME_KEY)).toBe('seen');
    await waitFor(() => expect(document.activeElement?.id).toBe('tab-explore'));
  });

  it('the tour: asks for it and steps aside; back (focus on the tour button) when the request clears with no door', async () => {
    await firstVisit();
    await startPage();
    fireEvent.click(screen.getByRole('button', { name: 'Watch the one-minute tour' }));
    expect(getDemoRequest()).toBe('intro');
    expect(screen.queryByTestId('start-screen')).toBeNull();
    expect(await screen.findByText('EXPLORE_VIEW', {}, { timeout: 8000 })).toBeDefined();
    act(() => clearDemoRequest());
    await startPage();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Watch the one-minute tour' })));
    expect(localStorage.getItem(WELCOME_KEY)).toBe('pending');
  });

  it('a shared link: the app, not the start screen', async () => {
    await firstVisit('?key=G&scale=major');
    expect(await screen.findByText('EXPLORE_VIEW', {}, { timeout: 8000 })).toBeDefined();
    expect(screen.queryByTestId('start-screen')).toBeNull();
    expect(screen.queryByTestId('start-screen-loading')).toBeNull();
  });

  it('saved data: the app as before', async () => {
    localStorage.clear();
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { lastView: 'learn' }, version: 6 }));
    expect(bootWelcome(localStorage, '')).toBe(false);
    useAppStore.setState({ lastView: 'learn' });
    render(<App />);
    expect(await screen.findByText('LEARN_VIEW', {}, { timeout: 8000 })).toBeDefined();
    expect(screen.queryByTestId('start-screen-loading')).toBeNull();
  });
});

describe('Settings → "How I use Fermata"', () => {
  it('three choices; never asked reads as theory; a change saves the profile, raises nothing and drops a hint owed for another profile', () => {
    render(<SettingsSheet open onClose={() => {}} />);
    const group = screen.getByRole('radiogroup', { name: 'How I use Fermata' });
    const chips = within(group).getAllByRole('radio');
    expect(chips.map((c) => c.textContent)).toEqual(['New to music', 'I play, no theory', 'I know some theory']);
    expect(chips.map((c) => c.getAttribute('aria-checked'))).toEqual(['false', 'false', 'true']);
    fireEvent.click(chips[0]);
    expect(useAppStore.getState().learnerProfile).toBe('new');
    expect(useAppStore.getState().startHint).toBeNull();
    expect(useStartHintStore.getState().shown).toBeNull();
    expect(useWelcomeStore.getState().open).toBe(false);

    act(() => raiseStartHint('new'));
    fireEvent.click(within(group).getByRole('radio', { name: 'I play, no theory' }));
    expect(useAppStore.getState().learnerProfile).toBe('player');
    expect(useAppStore.getState().startHint).toBeNull();
  });
});

describe('the start hint (shell)', () => {
  it('new, piano: one line, "Start lesson 1 →" opens the first lesson and ends it', () => {
    act(() => raiseStartHint('new'));
    render(<StartHint />);
    const hint = screen.getByRole('complementary', { name: 'Getting started' });
    expect(hint.textContent).toContain('Tap a key to hear it. When you are ready:');
    expect(within(hint).getAllByRole('button').map((b) => b.textContent || b.getAttribute('aria-label'))).toEqual(['Start lesson 1 →', 'Dismiss the tip']);
    fireEvent.click(within(hint).getByRole('button', { name: 'Start lesson 1 →' }));
    expect(useAppStore.getState().view).toBe('learn');
    expect(useAppStore.getState().pendingLearnTarget).toEqual({ levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1' });
    expect(screen.queryByTestId('start-hint')).toBeNull();
  });

  it('new, guitar: says "string"', () => {
    useAppStore.setState({ instrument: 'guitar' });
    act(() => raiseStartHint('new'));
    render(<StartHint />);
    expect(screen.getByTestId('start-hint').textContent).toContain('Tap a string to hear it.');
  });

  it('player: its line and ✕ only; ✕ ends it', () => {
    act(() => raiseStartHint('player'));
    render(<StartHint />);
    const hint = screen.getByTestId('start-hint');
    expect(hint.textContent).toBe('Pick the key of a song you play, for example G. The chords below belong to it: tap one.');
    expect(within(hint).getAllByRole('button')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss the tip' }));
    expect(screen.queryByTestId('start-hint')).toBeNull();
    expect(useAppStore.getState().startHint).toBeNull();
  });

  it('Explore only, and nothing at all without a hint', () => {
    const { container, rerender } = render(<StartHint />);
    expect(container.innerHTML).toBe('');
    act(() => raiseStartHint('new'));
    act(() => useAppStore.setState({ view: 'learn' }));
    rerender(<StartHint />);
    expect(container.innerHTML).toBe('');
    act(() => useAppStore.setState({ view: 'explore' }));
    expect(screen.getByTestId('start-hint')).toBeDefined();
  });

  it('PT and ES', async () => {
    await i18n.changeLanguage('pt');
    act(() => raiseStartHint('new'));
    const { unmount } = render(<StartHint />);
    expect(screen.getByTestId('start-hint').textContent).toContain('Toca numa tecla para a ouvir.');
    expect(screen.getByRole('button', { name: 'Começar a lição 1 →' })).toBeDefined();
    unmount();
    await i18n.changeLanguage('es');
    act(() => raiseStartHint('player'));
    render(<StartHint />);
    expect(screen.getByTestId('start-hint').textContent).toContain('Elige la tonalidad de una canción que toques');
  });
});
