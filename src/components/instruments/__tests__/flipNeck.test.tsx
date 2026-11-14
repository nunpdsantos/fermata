/**
 * "Flip neck" on the guitar (2026-11-14). A first-time player turns the neck
 * from the board itself: one button, right after "Edit fingering" (before
 * the tuning where that chip is not shown), that mirrors BOTH of Settings'
 * controls at once through the store's own setters — from the default
 * (nut right, thick string on top: facing a player) to the tab view (nut
 * left, thin string on top) and back; a mixed combination from Settings
 * mirrors too. Its name says what it does and what is drawn now, in
 * Settings' own words. It goes where the controls row goes: the dock in
 * Explore and in Learn; never the full neck, an exercise answered on the
 * instrument, Drill's reading board or the practice sheet.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '../../../i18n/index';
import en from '../../../i18n/locales/en.json';
import pt from '../../../i18n/locales/pt.json';
import es from '../../../i18n/locales/es.json';
import { useAppStore } from '../../../state/store';
import { buildChord } from '../../../core/constants/chords';
import type { NeckNutSide, NeckTopString } from '../../../state/storeTypes';
import { flippedNeck } from '../neckOrientation';
import { SCENARIOS, media, resetStores } from './neckScenarios';
import { Fretboard } from '../Fretboard';
import { SettingsSheet } from '../../layout/SettingsSheet';
import releaseNotesSource from '../../../../release-notes.json?raw';

vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }),
}));
vi.mock('../../../hooks/useMediaQuery', async (orig) => ({
  ...(await orig<typeof import('../../../hooks/useMediaQuery')>()),
  useIsMobile: () => media.mobile,
}));

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
beforeEach(() => {
  media.mobile = false;
  resetStores({ neckNutSide: 'right', neckTopString: 'low' });
});
afterEach(async () => {
  cleanup();
  vi.useRealTimers();
  await act(() => i18n.changeLanguage('en'));
});

const LOCALES = { en, pt, es } as const;
const lowerFirst = (s: string) => s.charAt(0).toLocaleLowerCase() + s.slice(1);
/** The name the button must carry, built from the locale file (never a hard-coded translation). */
function expectedName(lang: keyof typeof LOCALES, nut: NeckNutSide, top: NeckTopString) {
  const n = LOCALES[lang].neckView;
  return n.flipName
    .replace('{{action}}', n.flip)
    .replace('{{nut}}', lowerFirst(nut === 'left' ? n.nutLeft : n.nutRight))
    .replace('{{top}}', lowerFirst(top === 'high' ? n.thinTop : n.thickTop));
}
const flipButton = () => screen.getByTestId('flip-neck');
const neck = () => ({ nut: useAppStore.getState().neckNutSide, top: useAppStore.getState().neckTopString });

/** What the board draws: string indices top to bottom, and whether the open strings come before the frets. */
function drawn(root: Element) {
  const rows = [...root.querySelectorAll('[data-dock-row="string"]')];
  const strings = rows.map((row) => Number(row.querySelector<HTMLElement>('[data-fret]')!.dataset.stringRow));
  const row = rows[0];
  const open = row.querySelector('[data-open-string]')!;
  const firstFret = row.querySelector('[data-fret]:not([data-open-string])') ?? row.querySelectorAll('[data-fret]')[1];
  const nutLeft = !!(open.compareDocumentPosition(firstFret!) & Node.DOCUMENT_POSITION_FOLLOWING);
  return { strings, nut: nutLeft ? 'left' : 'right' };
}

describe('flippedNeck', () => {
  it.each([
    ['right', 'low', 'left', 'high'],
    ['left', 'high', 'right', 'low'],
    ['left', 'low', 'right', 'high'],
    ['right', 'high', 'left', 'low'],
  ] as const)('%s / %s → %s / %s (both axes)', (nut, top, nextNut, nextTop) => {
    expect(flippedNeck({ nut, top })).toEqual({ nut: nextNut, top: nextTop });
  });
});

describe('the button on the dock', () => {
  it('position view: right after "Edit fingering", on its line, named with what is drawn now', () => {
    act(() => useAppStore.setState({ guitarScalePosition: 5 }));
    render(<Fretboard />);
    const edit = screen.getByRole('button', { name: en.fretboard.editFingering });
    const button = flipButton();
    // The chip's next sibling, in the same toolbar (so they share a line).
    expect(edit.nextElementSibling).toBe(button);
    // Beside the chip: where the word may show on a phone (index.css).
    expect(button.dataset.place).toBe('after-edit');
    expect(button.getAttribute('title')).toBe(en.neckView.flip);
    expect(button.getAttribute('aria-label')).toBe(expectedName('en', 'right', 'low'));
    expect(button.getAttribute('aria-label')).toBe('Flip neck. Now: nut on the right, thick string on top.');
    expect(button.textContent).toBe(`⇄${en.neckView.flip}`);
    expect(button.querySelector('[aria-hidden="true"]')!.textContent).toBe('⇄');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.className).toContain('btn-secondary');
    expect(screen.getAllByTestId('flip-neck')).toHaveLength(1);
  });

  it.each([
    ['a chord', { selectedChord: buildChord({ natural: 'G', accidental: '' }, 'major') }],
    ['the whole neck', { guitarScalePosition: 'all' }],
  ] as const)('%s (no "Edit fingering"): the row item right before the tuning', (_, state) => {
    act(() => useAppStore.setState(state as never));
    render(<Fretboard />);
    expect(screen.queryByRole('button', { name: en.fretboard.editFingering })).toBeNull();
    const tuning = screen.getByRole('combobox', { name: en.fretboard.tuningLabel }).closest('label')!;
    expect(tuning.previousElementSibling).toBe(flipButton());
    expect(flipButton().parentElement!.classList.contains('fretboard-controls')).toBe(true);
    // Before the tuning: the glyph alone below 1280 px (index.css).
    expect(flipButton().dataset.place).toBe('before-tuning');
  });

  it('flips both settings at once, redraws the neck, and back again; the name follows', () => {
    act(() => useAppStore.setState({ guitarScalePosition: 'all' }));
    const { container } = render(<Fretboard />);
    expect(drawn(container)).toEqual({ strings: [0, 1, 2, 3, 4, 5], nut: 'right' });
    fireEvent.click(flipButton());
    expect(neck()).toEqual({ nut: 'left', top: 'high' });
    expect(drawn(container)).toEqual({ strings: [5, 4, 3, 2, 1, 0], nut: 'left' });
    expect(flipButton().getAttribute('aria-label')).toBe(expectedName('en', 'left', 'high'));
    fireEvent.click(flipButton());
    expect(neck()).toEqual({ nut: 'right', top: 'low' });
    expect(drawn(container)).toEqual({ strings: [0, 1, 2, 3, 4, 5], nut: 'right' });
  });

  it.each([
    ['left', 'low', 'right', 'high'],
    ['right', 'high', 'left', 'low'],
  ] as const)('a mixed combination from Settings (%s / %s) mirrors too → %s / %s', (nut, top, nextNut, nextTop) => {
    act(() => useAppStore.setState({ guitarScalePosition: 'all', neckNutSide: nut, neckTopString: top }));
    const { container } = render(<Fretboard />);
    fireEvent.click(flipButton());
    expect(neck()).toEqual({ nut: nextNut, top: nextTop });
    const d = drawn(container);
    expect(d.nut).toBe(nextNut);
    expect(d.strings[0]).toBe(nextTop === 'low' ? 0 : 5);
    expect(flipButton().getAttribute('aria-label')).toBe(expectedName('en', nextNut, nextTop));
  });

  it('keyboard focus stays on the button: a click, Enter and Space', async () => {
    const user = userEvent.setup();
    act(() => useAppStore.setState({ guitarScalePosition: 5 }));
    render(<Fretboard />);
    const button = flipButton();
    await user.click(button);
    expect(neck()).toEqual({ nut: 'left', top: 'high' });
    expect(document.activeElement).toBe(button);
    await user.keyboard('{Enter}');
    expect(neck()).toEqual({ nut: 'right', top: 'low' });
    expect(document.activeElement).toBe(button);
    await user.keyboard(' ');
    expect(neck()).toEqual({ nut: 'left', top: 'high' });
    expect(document.activeElement).toBe(button);
    expect(button.isConnected).toBe(true);
  });

  it.each(['pt', 'es'] as const)('%s: the word and the name in the learner\'s language', async (lang) => {
    await act(() => i18n.changeLanguage(lang));
    act(() => useAppStore.setState({ guitarScalePosition: 5 }));
    render(<Fretboard />);
    expect(flipButton().textContent).toBe(`⇄${LOCALES[lang].neckView.flip}`);
    expect(flipButton().getAttribute('aria-label')).toBe(expectedName(lang, 'right', 'low'));
    fireEvent.click(flipButton());
    expect(flipButton().getAttribute('aria-label')).toBe(expectedName(lang, 'left', 'high'));
  });

  it('EN, PT and ES carry the two new keys, and the name template names all three parts', () => {
    for (const loc of [en, pt, es]) {
      expect(loc.neckView.flip.trim()).not.toBe('');
      for (const part of ['{{action}}', '{{nut}}', '{{top}}']) expect(loc.neckView.flipName).toContain(part);
    }
  });
});

describe('it saves exactly what Settings saves', () => {
  const T = new Date('2026-11-14T12:00:00Z');
  const start = () => {
    localStorage.clear();
    useAppStore.setState({ neckNutSide: 'right', neckTopString: 'low', guitarScalePosition: 5, preferencesUpdatedAt: 1793700000000 });
  };

  it('the tab view: the button\'s save is byte for byte the save of Settings\' two controls', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(T);
    start();
    render(<Fretboard />);
    fireEvent.click(flipButton());
    const byButton = localStorage.getItem('music-theory-app');
    cleanup();

    start();
    render(<SettingsSheet open onClose={() => {}} />);
    const row = screen.getByTestId('neck-settings');
    fireEvent.click(within(row).getByRole('radio', { name: en.neckView.nutLeft }));
    fireEvent.click(within(row).getByRole('radio', { name: en.neckView.thinTop }));
    const bySettings = localStorage.getItem('music-theory-app');

    expect(byButton).not.toBeNull();
    expect(byButton).toBe(bySettings);
    const state = JSON.parse(byButton!).state;
    expect(state).toMatchObject({ neckNutSide: 'left', neckTopString: 'high', preferencesUpdatedAt: T.getTime() });
  });

  it('flipping back to the default writes no neck field at all (the legacy view is left out)', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(T);
    start();
    render(<Fretboard />);
    fireEvent.click(flipButton());
    fireEvent.click(flipButton());
    const state = JSON.parse(localStorage.getItem('music-theory-app')!).state;
    expect(state).not.toHaveProperty('neckNutSide');
    expect(state).not.toHaveProperty('neckTopString');
    expect(state.preferencesUpdatedAt).toBe(T.getTime());
  });
});

describe('where it is not', () => {
  const scenario = (name: string) => SCENARIOS.find((s) => s.name === name)!.run;

  it.each(['neck-position-VII', 'neck-chord-Bm-barre', 'practice-scale', 'practice-position-walk', 'reading-position-V', 'reading-feedback-wrong'])(
    '%s: no button (the full neck, the practice sheet and Drill\'s board have no controls row)',
    async (name) => {
      const root = await scenario(name)();
      expect(root.querySelector('[data-testid="flip-neck"]')).toBeNull();
      expect(screen.queryByRole('combobox', { name: en.fretboard.tuningLabel })).toBeNull();
    },
  );

  it('an exercise answered on the instrument: no button (and no tuning)', () => {
    act(() => useAppStore.setState({ exerciseInputActive: true }));
    render(<Fretboard />);
    expect(screen.queryByTestId('flip-neck')).toBeNull();
    expect(screen.queryByRole('combobox', { name: en.fretboard.tuningLabel })).toBeNull();
  });

  it('Learn\'s dock shows the controls row, so the button is there too (it follows its row)', () => {
    act(() => useAppStore.setState({ view: 'learn', guitarScalePosition: 5 }));
    render(<Fretboard />);
    expect(screen.getByRole('combobox', { name: en.fretboard.tuningLabel })).toBeTruthy();
    expect(screen.getByRole('button', { name: en.fretboard.editFingering }).nextElementSibling).toBe(flipButton());
  });

  it('with a dock bar (the laptop), still in the controls row after "Edit fingering", never in the bar', async () => {
    const { DockToolsContext } = await import('../../layout/dockTools');
    const bar = document.createElement('div');
    document.body.appendChild(bar);
    act(() => useAppStore.setState({ guitarScalePosition: 5 }));
    render(<DockToolsContext.Provider value={bar}><Fretboard /></DockToolsContext.Provider>);
    expect(within(bar).queryByTestId('flip-neck')).toBeNull();
    const edit = screen.getByRole('button', { name: en.fretboard.editFingering });
    expect(edit.nextElementSibling).toBe(flipButton());
    expect(flipButton().closest('.fretboard-controls')).not.toBeNull();
    bar.remove();
  });
});

describe('release 14 (2026-11-14): What\'s new', () => {
  it('is the newest entry: not critical, one line per language within 160 characters, naming the button by its own word', async () => {
    const { parseReleaseNotes, MAX_NOTE_LENGTH } = await import('../../../release/releaseNotes');
    const [newest, previous] = parseReleaseNotes(JSON.parse(releaseNotesSource));
    expect([newest.release, newest.date, newest.critical]).toEqual([14, '2026-11-14', false]);
    expect(previous.release).toBe(13);
    for (const lang of ['en', 'pt', 'es'] as const) {
      expect(newest.notes[lang].length, lang).toBeLessThanOrEqual(MAX_NOTE_LENGTH);
      expect(newest.notes[lang], lang).toContain(LOCALES[lang].neckView.flip);
    }
    expect([newest.notes.en.length, newest.notes.pt.length, newest.notes.es.length]).toEqual([122, 139, 147]);
  });
});
