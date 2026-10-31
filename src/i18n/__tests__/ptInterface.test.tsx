/**
 * W6-05 / W11-A — no hard-coded English in the Portuguese (and Spanish)
 * interface W11-A touched: the top bar, the "⋯" menu and Settings sheet, the
 * instrument dock and both instruments, the key/scale pickers, the scale-
 * degree bar, the chord grid and a toast. Visible text AND accessible names
 * (aria-label, title) are checked against a list of English words that must
 * not appear. (Note names, numerals and chord symbols are notation, not
 * English — D-17 / D-18.)
 */
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { render, cleanup, fireEvent, act, screen } from '@testing-library/react';
import i18n from '../index';
import { useAppStore } from '../../state/store';
import { toast, useToastStore } from '../../state/toastStore';
import { TopBar } from '../../components/layout/TopBar';
import { InstrumentDock } from '../../components/layout/InstrumentDock';
import { ToastContainer } from '../../components/layout/Toast';
import { KeySelector } from '../../components/navigation/KeySelector';
import { ScaleDegreeBar } from '../../components/theory/ScaleDegreeBar';
import { ChordGrid } from '../../components/theory/ChordGrid';
import { Fretboard } from '../../components/instruments/Fretboard';

vi.mock('../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }),
}));
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const makeMotion = (tag: string) =>
    function MotionProxy(props: Record<string, unknown>) {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
      return React.createElement(tag, clean);
    };
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => makeMotion(prop) });
  return {
    m: proxy,
    motion: proxy,
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    useReducedMotion: () => true,
    domAnimation: {},
  };
});

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  HTMLElement.prototype.scrollTo = vi.fn() as typeof HTMLElement.prototype.scrollTo;
});
afterEach(() => {
  cleanup();
  useToastStore.setState({ toasts: [] });
});
afterAll(async () => {
  await i18n.changeLanguage('en');
});

// English words that must not show in PT/ES. Whole words, case-sensitive
// (so "Dominante", "Exportar" or "Posição" do not trip them).
const ENGLISH = [
  'Settings', 'Language', 'Theme', 'Your data', 'Export', 'Import', 'Day', 'Night', 'Auto',
  'More', 'Search', 'Explore', 'Learn', 'Drill', 'Back', 'Close', 'Dismiss', 'Show', 'Hide',
  'Instrument panel', 'Peek', 'Half', 'Full', 'octave', 'octaves', 'Position', 'Tuning', 'Open position',
  'Major', 'Minor', 'Harm\\.', 'Mel\\.', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian',
  'Whole Tone', 'Chromatic', 'Altered', 'Persian', 'Egyptian', 'More scales', 'Root', 'Scale',
  'Scale degrees', 'Diatonic chords', 'chord', 'degree', 'Degree', 'Tonic', 'Supertonic', 'Mediant',
  'Subdominant', 'Dominant', 'Submediant', 'Leading', 'Diminished', 'fret', 'string', 'open string', 'muted',
  'Fingers', 'Degrees', 'Notes', 'Edit fingering', 'Backup downloaded',
];
const ENGLISH_RE = new RegExp(`(?<![\\p{L}])(${ENGLISH.join('|')})(?![\\p{L}])`, 'u');

function englishIn(container: HTMLElement): string[] {
  const found = new Set<string>();
  const check = (where: string, text: string | null) => {
    if (!text) return;
    const m = ENGLISH_RE.exec(text);
    if (m) found.add(`${where}: "${m[1]}" in "${text.trim().slice(0, 60)}"`);
  };
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) check('text', n.textContent);
  for (const el of container.querySelectorAll('[aria-label], [title], [aria-valuetext]')) {
    check('aria-label', el.getAttribute('aria-label'));
    check('title', el.getAttribute('title'));
    check('aria-valuetext', el.getAttribute('aria-valuetext'));
  }
  return [...found];
}

describe.each(['pt', 'es'] as const)('%s interface has no hard-coded English', (lang) => {
  beforeAll(async () => {
    await i18n.changeLanguage(lang);
  });

  it('a known positive: the same check flags the English interface', async () => {
    await i18n.changeLanguage('en');
    useAppStore.setState({ language: 'en', view: 'explore' });
    const { container } = render(<KeySelector />);
    expect(englishIn(container).length).toBeGreaterThan(0);
    cleanup();
    await i18n.changeLanguage(lang);
  });

  it('top bar, "⋯" menu and the Settings sheet', () => {
    useAppStore.setState({ language: lang, view: 'explore' });
    render(<TopBar />);
    fireEvent.click(screen.getAllByRole('button')[1]); // the "⋯" button (search is first)
    expect(englishIn(document.body)).toEqual([]);
    fireEvent.click(screen.getByRole('menuitem'));
    expect(screen.getByRole('dialog', { name: lang === 'pt' ? 'Definições' : 'Ajustes' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: lang === 'pt' ? 'Noite' : 'Noche' })).toBeTruthy();
    expect(englishIn(document.body)).toEqual([]);
  });

  it('the instrument dock (piano and guitar), key / scale pickers, degree bar, chord grid, a toast', async () => {
    useAppStore.setState({
      language: lang,
      view: 'explore',
      instrument: 'piano',
      selectedKey: { natural: 'C', accidental: '' },
      selectedScale: 'major',
      selectedChord: null,
      dockDetents: { explore: 'half', learn: 'peek' },
    });
    const { container } = render(
      <div>
        <KeySelector />
        <ScaleDegreeBar />
        <ChordGrid />
        <InstrumentDock view="explore" available={800} />
        <ToastContainer />
      </div>,
    );
    fireEvent.click(screen.getByRole('button', { expanded: false, name: /▾/ })); // "More scales…" → every chip
    act(() => toast(i18n.t('backup.exported'), 'success'));
    // It really rendered the translated interface (not an empty one).
    expect(screen.getByRole('radio', { name: lang === 'pt' ? 'Menor harm.' : 'Menor arm.' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: lang === 'pt' ? 'Húngara menor' : 'Húngara menor' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /C4/ }).length).toBeGreaterThan(0);
    expect(englishIn(container)).toEqual([]);
    cleanup();

    useAppStore.setState({ instrument: 'guitar', guitarScalePosition: 5 });
    const guitar = render(<div><Fretboard /><InstrumentDock view="explore" available={800} /></div>);
    await screen.findAllByRole('grid');
    expect(guitar.container.querySelectorAll('[data-fret]').length).toBeGreaterThan(30);
    expect(englishIn(guitar.container)).toEqual([]);
  });
});
