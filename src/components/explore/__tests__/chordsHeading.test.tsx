import i18n from '../../../i18n';
/**
 * Audit 2026-11-18, Q10: the chords card's heading stayed "Chords in C major"
 * on All Chords and Build, where the chords listed are not that key's; and the
 * voicing buttons of a 5- or 6-note chord read "Root, 1st Inv, 2nd Inv, 3rd
 * Inv, Inv 4, Inv 5". The heading says what is listed; the buttons follow one
 * style (4th Inv, 5th Inv; PT / ES "4.ª Inv", the house's 3.ª ordinals).
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { buildChord } from '../../../core/constants/chords';
import { ChordsCard } from '../ChordsCard';
import { CurrentChordPanel } from '../../panels/CurrentChordPanel';

vi.mock('../../../hooks/useAudio', () => ({ useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }) }));
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
  return { StaffNotation: () => React.createElement('div') };
});

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
beforeEach(() => {
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', selectedChord: null, chordInversion: 0,
    instrument: 'piano', baseOctave: 4, view: 'explore', exerciseInputActive: false, exploreDetail: 'full',
  });
});
afterEach(async () => {
  cleanup();
  await i18n.changeLanguage('en');
});

const WORDS = {
  en: { inKey: 'Chords in C Major', all: 'All chords on C', build: 'Build a chord', tabs: ['In key', 'All Chords', 'Build'] },
  pt: { inKey: 'Acordes em C maior', all: 'Todos os acordes sobre C', build: 'Construir um acorde', tabs: ['Na tonalidade', 'Todos os acordes', 'Construir'] },
  es: { inKey: 'Acordes en C mayor', all: 'Todos los acordes sobre C', build: 'Construir un acorde', tabs: ['En la tonalidad', 'Todos los acordes', 'Construir'] },
} as const;

describe('Q10: the chords heading names what is listed', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: In key / All Chords / Build`, async () => {
      await i18n.changeLanguage(lang);
      render(<ChordsCard />);
      const heading = () => screen.getByRole('heading', { level: 2 }).textContent;
      const w = WORDS[lang];
      expect(heading()).toBe(w.inKey);
      fireEvent.click(screen.getByRole('tab', { name: w.tabs[1] }));
      expect(heading()).toBe(w.all);
      fireEvent.click(screen.getByRole('tab', { name: w.tabs[2] }));
      expect(heading()).toBe(w.build);
      fireEvent.click(screen.getByRole('tab', { name: w.tabs[0] }));
      expect(heading()).toBe(w.inKey);
    });
  }

  it('All Chords names the key\'s own root as spelled (F♯ major → F♯)', () => {
    useAppStore.setState({ selectedKey: { natural: 'F', accidental: '#' } });
    render(<ChordsCard />);
    fireEvent.click(screen.getByRole('tab', { name: 'All Chords' }));
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('All chords on F♯');
  });
});

describe('Q10: inversion buttons in one style, up to the 6th inversion of a 13th chord', () => {
  const want = {
    en: ['Root', '1st Inv', '2nd Inv', '3rd Inv', '4th Inv', '5th Inv', '6th Inv'],
    pt: ['Fund.', '1.ª Inv', '2.ª Inv', '3.ª Inv', '4.ª Inv', '5.ª Inv', '6.ª Inv'],
    es: ['Fund.', '1.ª Inv', '2.ª Inv', '3.ª Inv', '4.ª Inv', '5.ª Inv', '6.ª Inv'],
  } as const;
  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: C13 (seven notes) and C9 (five)`, async () => {
      await i18n.changeLanguage(lang);
      for (const quality of ['dominant13', 'dominant9'] as const) {
        const chord = buildChord({ natural: 'C', accidental: '' }, quality);
        useAppStore.setState({ selectedChord: chord, chordInversion: 0 });
        render(<CurrentChordPanel chord={chord} />);
        const labels = within(screen.getByRole('radiogroup')).getAllByRole('radio').map((r) => r.textContent);
        expect(labels, `${lang} ${quality}`).toEqual(want[lang].slice(0, chord.notes.length));
        cleanup();
      }
    });
  }
});
