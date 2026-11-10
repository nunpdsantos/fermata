import i18n from '../../../i18n';
/**
 * "Also show Dó, Ré, Mi" (wave 1, stream E) on each listed surface: the key
 * summary, the staff strip's note names, the dock read-out, the key picker's
 * root chips and the circle navigator's key facts — letter first, the
 * fixed-do name beside it. Off (the default) and in English nothing differs.
 * Chord names stay letters.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { useFocusNoteStore } from '../../../state/focusNoteStore';
import { buildChord } from '../../../core/constants/chords';
import { ScaleStrip } from '../ScaleStrip';
import { ExploreHeader } from '../ExploreHeader';
import { DockReadout } from '../../layout/DockReadout';
import { CircleNavigator } from '../CircleNavigator';
import { RootChips } from '../../navigation/KeySelector';
import { ChordsCard } from '../ChordsCard';

const noteOn = vi.fn().mockResolvedValue(71);
const noteOff = vi.fn();
vi.mock('../../../hooks/useAudio', () => ({ useAudio: () => ({ noteOn, noteOff }) }));
vi.mock('../../../core/services/audio.ts', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  resumeAudio: vi.fn(async () => {}),
  playScale: vi.fn(),
  playChordVoiced: vi.fn(),
  playArpeggioAscending: vi.fn(),
}));
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const make = (tag: string) => (props: Record<string, unknown>) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
    return React.createElement(tag, clean);
  };
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => make(prop) });
  return { motion: proxy, m: proxy, AnimatePresence: (p: { children: React.ReactNode }) => p.children, LazyMotion: (p: { children: React.ReactNode }) => p.children, domAnimation: {} };
});
vi.mock('../../notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return { StaffNotation: (p: { noteDim?: Record<number, boolean> }) => React.createElement('div', { 'data-testid': 'staff', 'data-dim': JSON.stringify(p.noteDim ?? null) }) };
});

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

function Surfaces() {
  return (
    <>
      <ExploreHeader />
      <ScaleStrip />
      <ChordsCard />
      <CircleNavigator collapsible />
      <RootChips />
      <DockReadout context="C4 · 1 octave" />
    </>
  );
}

async function show(lang: 'en' | 'pt' | 'es', showSolfege: boolean | undefined) {
  useFocusNoteStore.setState({ hover: null, keyboard: null, pinned: null, locations: null });
  useAppStore.setState({
    selectedKey: { natural: 'D', accidental: '' }, selectedScale: 'major', selectedChord: buildChord({ natural: 'A', accidental: '' }, 'major'), chordInversion: 0,
    instrument: 'piano', baseOctave: 4, view: 'explore', exerciseInputActive: false, comparisonScale: null, language: lang,
    showSolfege: showSolfege ?? false,
  });
  await act(async () => { await i18n.changeLanguage(lang); });
  const view = render(<Surfaces />);
  // F♯, the 3rd of D major, in focus (the read-out names it).
  act(() => useFocusNoteStore.getState().set('pinned', { pc: 6, midi: 66, source: 'staff' }));
  return view;
}

const text = (id: string) => screen.getByTestId(id).textContent;
const stripNames = () => [...document.querySelectorAll('.strip-col')].map((c) => c.querySelector('.strip-name')!.textContent + (c.querySelector('.strip-solfege')?.textContent ?? ''));
/** The page's HTML with React's generated ids (useId: _r_4_) made comparable between renders. */
const html = (el: HTMLElement) => el.innerHTML.replace(/_r_[0-9a-z]+_/g, '_r_');
const chipNames = () => screen.getAllByRole('radio').filter((r) => r.hasAttribute('data-root')).map((r) => r.textContent);

afterEach(async () => {
  cleanup();
  useAppStore.setState({ showSolfege: false, language: 'en' });
  await act(async () => { await i18n.changeLanguage('en'); });
});

describe('with the setting on in Portuguese', () => {
  beforeEach(async () => { await show('pt', true); });

  it('the key summary: D (Ré) maior · 2♯ · relativa B (Si) menor', () => {
    expect(text('key-summary')).toBe('D (Ré) maior · 2♯ · relativa B (Si) menor');
  });
  it('the staff strip: each letter with its fixed-do name under it', () => {
    expect(stripNames()).toEqual(['DRé', 'EMi', 'F♯Fá♯', 'GSol', 'ALá', 'BSi', 'C♯Dó♯', 'DRé']);
  });
  it('the dock read-out names the focus note both ways', () => {
    expect(text('dock-readout')).toMatch(/^F♯ \(Fá♯\) — /);
  });
  it('the root chips', () => {
    expect(chipNames()).toEqual(['C Dó', 'D♭ Ré♭', 'D Ré', 'E♭ Mi♭', 'E Mi', 'F Fá', 'F♯ Fá♯', 'G Sol', 'A♭ Lá♭', 'A Lá', 'B♭ Si♭', 'B Si']);
  });
  it('the circle navigator’s key facts (tablet; the phone’s key sheet uses the same list)', () => {
    const facts = [...screen.getAllByTestId('key-facts')[0].querySelectorAll('dd')].map((d) => d.textContent);
    expect(facts).toEqual(['2♯', 'B (Si) menor', 'A (Lá) maior', 'G (Sol) maior']);
  });
  it('…but not in the laptop’s aside, whose narrow column would wrap every value', () => {
    cleanup();
    render(<CircleNavigator />);
    const facts = [...screen.getByTestId('key-facts').querySelectorAll('dd')].map((d) => d.textContent);
    expect(facts).toEqual(['2♯', 'B menor', 'A maior', 'G maior']);
  });
  it('chord names stay letters', () => {
    expect(screen.getByTestId('chord-detail').querySelector('h3')!.textContent).not.toMatch(/Lá|Dó|Ré/);
    expect(screen.getByTestId('chords-card').textContent).not.toMatch(/\(Ré\)|\(Lá\)/);
  });
});

describe('Spanish uses its own names', () => {
  it('D (Re) mayor; Fa♯ in the strip', async () => {
    await show('es', true);
    expect(text('key-summary')).toMatch(/^D \(Re\) mayor · 2♯ · relativa B \(Si\) menor$/);
    expect(stripNames()[2]).toBe('F♯Fa♯');
  });
});

describe('off, or in English, nothing differs from today', () => {
  for (const lang of ['pt', 'es', 'en'] as const) {
    it(`${lang}: the setting absent, off, or (English) on render the same page`, async () => {
      const absent = html((await show(lang, undefined)).container);
      cleanup();
      const off = html((await show(lang, false)).container);
      expect(off).toBe(absent);
      expect(off).not.toMatch(/solfege/);
      if (lang === 'en') {
        cleanup();
        const onInEnglish = html((await show('en', true)).container);
        expect(onInEnglish).toBe(absent);
      }
    });
  }
  it('pt, off: the summary is today’s', async () => {
    await show('pt', false);
    expect(text('key-summary')).toBe('D maior · 2♯ · relativa B menor');
  });
});
