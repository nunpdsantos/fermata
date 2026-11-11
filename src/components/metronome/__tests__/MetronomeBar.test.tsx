/**
 * The metronome's entry and bar (wave 3, stream M): "⋯" gains "Metronome"
 * after Settings and Show me around; the bar it opens (a lazy chunk) has
 * ▶ / ■, the count, the tempo (− / + / typed), Tap, the beats in a bar and
 * ✕ (which stops it); it is not shown in Drill or while the tour plays, and
 * leaving for either stops it. Its words come with its chunk, in EN/PT/ES.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor, act, within } from '@testing-library/react';
import i18n from '../../../i18n';
import { useAppStore } from '../../../state/store';
import { clearDemoRequest, requestDemo } from '../../../state/demoRequest';
import { useToastStore } from '../../../state/toastStore';
import { installMockAudioContext } from '../../../test/mockAudioContext';
import { TopBar } from '../../layout/TopBar';
import { isMetronomeRunning, stopMetronome, useMetronome } from '../../../services/metronome/metronome';
import { useLoopState } from '../../explore/progression/loopController';
import { _resetClicksForTesting } from '../../../services/metronome/clickVoice';
import { METRONOME_TEXT } from '../../../i18n/metronomeTool';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// From disk: i18next merges lazily added namespaces into the imported locale objects.
const locale = (lang: string) => JSON.parse(readFileSync(join(__dirname, '../../../i18n/locales', `${lang}.json`), 'utf8')) as Record<string, object>;

beforeEach(() => {
  installMockAudioContext(1);
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false })));
  _resetClicksForTesting();
  // jsdom lays nothing out: give the bar a size so it is placed (and shown).
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(52);
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(320);
  useAppStore.setState({ view: 'explore', language: 'en', metronome: undefined });
  useToastStore.setState({ toasts: [] });
  useMetronome.setState({ running: false, beat: null, lastStop: null });
});
afterEach(async () => {
  stopMetronome('closed');
  cleanup();
  act(() => clearDemoRequest());
  useLoopState.setState({ playing: false, index: null, lastStop: null });
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  await i18n.changeLanguage('en');
  useAppStore.setState({ metronome: undefined, view: 'explore', language: 'en' });
});

async function openBar() {
  render(<TopBar />);
  fireEvent.click(screen.getByRole('button', { name: 'More' }));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Metronome' }));
  const bar = await screen.findByRole('region', { name: 'Metronome' });
  await waitFor(() => expect(bar.getAttribute('data-measured')).toBe('true'));
  return bar;
}

describe('the "⋯" menu', () => {
  it('lists Settings, Show me around, then Metronome — and nothing else for a learner who has never opened it', () => {
    render(<TopBar />);
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.getAllByRole('menuitem').map((m) => m.textContent)).toEqual(['Settings', 'Show me around', 'Metronome']);
    // The bar is not there until it is chosen.
    expect(screen.queryByRole('region', { name: 'Metronome' })).toBeNull();
    expect(document.querySelector('[data-testid="metronome"]')).toBeNull();
  });
});

describe('the bar', () => {
  it('opens with focus on ▶; ▶ starts it, ■ stops it', async () => {
    const bar = await openBar();
    const play = within(bar).getByRole('button', { name: 'Start the metronome' });
    await waitFor(() => expect(document.activeElement).toBe(play));
    fireEvent.click(play);
    expect(isMetronomeRunning()).toBe(true);
    fireEvent.click(within(bar).getByRole('button', { name: 'Stop the metronome' }));
    expect(isMetronomeRunning()).toBe(false);
  });

  it('− / + and a typed number set the tempo (saved); Escape puts a half-typed one back', async () => {
    const bar = await openBar();
    const input = within(bar).getByRole('textbox', { name: 'Tempo, beats a minute' }) as HTMLInputElement;
    expect(input.value).toBe('80');
    fireEvent.click(within(bar).getByRole('button', { name: 'Faster' }));
    expect(useAppStore.getState().metronome).toEqual({ bpm: 81, beats: 4 });
    fireEvent.click(within(bar).getByRole('button', { name: 'Slower' }));
    fireEvent.click(within(bar).getByRole('button', { name: 'Slower' }));
    expect(useAppStore.getState().metronome?.bpm).toBe(79);
    fireEvent.change(input, { target: { value: '72' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(useAppStore.getState().metronome?.bpm).toBe(72);
    expect(input.value).toBe('72');
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input.value).toBe('72');
    fireEvent.change(input, { target: { value: '9x99' } });
    fireEvent.blur(input);
    expect(useAppStore.getState().metronome?.bpm).toBe(240);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(useAppStore.getState().metronome?.bpm).toBe(239);
    expect(within(bar).getByRole('button', { name: 'Faster' }).hasAttribute('disabled')).toBe(false);
  });

  it('Tap: five taps 833 ms apart set 72', async () => {
    const bar = await openBar();
    const tap = within(bar).getByRole('button', { name: 'Tap the tempo' });
    expect(tap.textContent).toBe('Tap');
    for (const ms of [1000, 1833, 2667, 3500, 4333]) {
      const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
      Object.defineProperty(ev, 'timeStamp', { value: ms });
      fireEvent(tap, ev);
    }
    expect(useAppStore.getState().metronome).toEqual({ bpm: 72, beats: 4 });
    expect((within(bar).getByRole('textbox') as HTMLInputElement).value).toBe('72');
  });

  it('the beats in a bar: 2, 3, 4 or 6; the count shows one number per beat', async () => {
    const bar = await openBar();
    const select = within(bar).getByRole('combobox', { name: 'Beats in a bar' }) as HTMLSelectElement;
    expect([...select.options].map((o) => o.textContent)).toEqual(['2 beats', '3 beats', '4 beats', '6 beats']);
    expect(within(bar).getByTestId('metronome-count').textContent).toBe('1234');
    fireEvent.change(select, { target: { value: '3' } });
    expect(useAppStore.getState().metronome).toEqual({ bpm: 80, beats: 3 });
    expect(within(bar).getByTestId('metronome-count').textContent).toBe('123');
    // The count is not read out on every beat.
    expect(within(bar).getByTestId('metronome-count').getAttribute('aria-hidden')).toBe('true');
  });

  it('the beat that sounded is marked', async () => {
    const bar = await openBar();
    act(() => useMetronome.setState({ running: true, beat: 3 }));
    const marked = within(bar).getByTestId('metronome-count').querySelectorAll('[data-current]');
    expect([...marked].map((m) => m.textContent)).toEqual(['3']);
  });

  it('✕ stops it, puts it away and gives focus back to "⋯"', async () => {
    const bar = await openBar();
    fireEvent.click(within(bar).getByRole('button', { name: 'Start the metronome' }));
    expect(isMetronomeRunning()).toBe(true);
    fireEvent.click(within(bar).getByRole('button', { name: 'Close the metronome' }));
    expect(isMetronomeRunning()).toBe(false);
    expect(screen.queryByRole('region', { name: 'Metronome' })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'More' }));
    // Chosen again: back, stopped.
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Metronome' }));
    expect(await screen.findByRole('region', { name: 'Metronome' })).toBeTruthy();
    expect(isMetronomeRunning()).toBe(false);
  });

  it('not in Drill: going there stops it and hides the bar; back in Learn it shows again, stopped', async () => {
    const bar = await openBar();
    fireEvent.click(within(bar).getByRole('button', { name: 'Start the metronome' }));
    act(() => useAppStore.getState().setView('learn'));
    expect(isMetronomeRunning()).toBe(true); // Explore → Learn keeps time
    act(() => useAppStore.getState().setView('drill'));
    expect(isMetronomeRunning()).toBe(false);
    expect(screen.queryByRole('region', { name: 'Metronome' })).toBeNull();
    act(() => useAppStore.getState().setView('learn'));
    expect(await screen.findByRole('region', { name: 'Metronome' })).toBeTruthy();
    expect(isMetronomeRunning()).toBe(false);
  });

  it('not while the tour plays: asking for it stops the metronome before the tour asks about work in progress', async () => {
    const bar = await openBar();
    fireEvent.click(within(bar).getByRole('button', { name: 'Start the metronome' }));
    act(() => requestDemo('intro', 'menu'));
    expect(isMetronomeRunning()).toBe(false);
    expect(useMetronome.getState().lastStop).toBe('tour');
    expect(screen.queryByRole('region', { name: 'Metronome' })).toBeNull();
    act(() => clearDemoRequest());
    expect(await screen.findByRole('region', { name: 'Metronome' })).toBeTruthy();
  });

  it('the Progression loop: one line says why it stopped', async () => {
    const bar = await openBar();
    expect(within(bar).queryByTestId('metronome-loop-note')).toBeNull();
    act(() => useLoopState.setState({ playing: true }));
    expect(within(bar).getByTestId('metronome-loop-note').textContent).toBe('The Progression loop has its own count-in: the metronome stops while it plays.');
  });

  it('a browser without Web Audio: one sentence says so, and ✕ still puts it away', async () => {
    vi.unstubAllGlobals();
    vi.stubGlobal('AudioContext', undefined);
    const bar = await openBar();
    expect(within(bar).getByTestId('metronome-unavailable').textContent).toBe('This browser cannot play the metronome\'s click.');
    expect(within(bar).queryByRole('button', { name: 'Start the metronome' })).toBeNull();
    fireEvent.click(within(bar).getByRole('button', { name: 'Close the metronome' }));
    expect(screen.queryByRole('region', { name: 'Metronome' })).toBeNull();
  });

  it('in Portuguese and Spanish (its words come with the chunk)', async () => {
    await act(() => i18n.changeLanguage('pt'));
    useAppStore.setState({ language: 'pt' });
    render(<TopBar />);
    fireEvent.click(screen.getByRole('button', { name: 'Mais' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Metrónomo' }));
    const bar = await screen.findByRole('region', { name: 'Metrónomo' });
    expect(within(bar).getByRole('button', { name: 'Iniciar o metrónomo' })).toBeTruthy();
    expect(within(bar).getByRole('button', { name: 'Marcar o andamento' }).textContent).toBe('Marcar');
    expect(within(bar).getByRole('combobox', { name: 'Pulsações por compasso' })).toBeTruthy();
    await act(() => i18n.changeLanguage('es'));
    expect(within(bar).getByRole('button', { name: 'Iniciar el metrónomo' })).toBeTruthy();
    expect(within(bar).getByRole('combobox', { name: 'Pulsos por compás' })).toBeTruthy();
  });
});

describe('its words', () => {
  it('the same keys in EN, PT and ES, none empty; the entry carries only the menu item and the load failure', () => {
    const keys = (o: object) => Object.keys(o).sort();
    expect(keys(METRONOME_TEXT.pt)).toEqual(keys(METRONOME_TEXT.en));
    expect(keys(METRONOME_TEXT.es)).toEqual(keys(METRONOME_TEXT.en));
    for (const lang of Object.values(METRONOME_TEXT)) for (const v of Object.values(lang)) expect(String(v).trim()).not.toBe('');
    for (const loc of ['en', 'pt', 'es'].map(locale)) {
      expect(keys(loc.metronomeToolEntry)).toEqual(['loadFailed', 'menuItem']);
      // The dead `metronome` namespace is gone (nothing read it).
      expect(loc).not.toHaveProperty('metronome');
      expect(loc).not.toHaveProperty('metronomeTool');
    }
  });
});
