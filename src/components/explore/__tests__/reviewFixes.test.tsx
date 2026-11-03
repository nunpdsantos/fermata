/**
 * W11-B review fixes:
 *  - the Copy summary is written in the learner's language;
 *  - Explore's dock follows the screen (Peek when short) until the learner
 *    sets it, and a save from before `dockChosen` keeps a real choice;
 *  - with a chord on the fretboard, the scale's other notes stay in view,
 *    faded and unlabelled.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import i18next from 'i18next';
import { render, screen, cleanup } from '@testing-library/react';
import en from '../../../i18n/locales/en.json';
import pt from '../../../i18n/locales/pt.json';
import es from '../../../i18n/locales/es.json';
import { generateScaleSummary } from '../../../utils/exportHelpers';
import { buildScale } from '../../../core/constants/scales';
import { getDiatonicChordsForScale, buildChord } from '../../../core/constants/chords';
import { useAppStore } from '../../../state/store';
import { defaultExploreDetent, sanitizeDockChosen } from '../../../state/dock';
import { Fretboard } from '../../instruments/Fretboard';

vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }),
}));

const C = { natural: 'C', accidental: '' } as const;
async function makeT(lng: 'en' | 'pt' | 'es') {
  const inst = i18next.createInstance();
  await inst.init({ resources: { en: { translation: en }, pt: { translation: pt }, es: { translation: es } }, lng, fallbackLng: 'en', interpolation: { escapeValue: false } });
  return inst.t.bind(inst) as (key: string, opts?: Record<string, unknown>) => string;
}

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
});
afterEach(cleanup);

describe('Copy summary in the learner\'s language', () => {
  const scale = buildScale(C, 'major');
  const dcs = getDiatonicChordsForScale(scale).map((d) => ({ chord: d.chord, numeral: d.numeral, degree: d.degree }));
  const chord = buildChord({ natural: 'G', accidental: '' }, 'major');

  it('PT and ES: every label and name translated', async () => {
    const want = {
      pt: ['C maior', 'Notas: C  D  E  F  G  A  B', 'Quantidade: 7 notas', 'Acordes diatónicos:', 'Acorde escolhido: G'],
      es: ['C mayor', 'Notas: C  D  E  F  G  A  B', 'Cantidad: 7 notas', 'Acordes diatónicos:', 'Acorde elegido: G'],
    } as const;
    for (const lang of ['pt', 'es'] as const) {
      const text = generateScaleSummary(scale, dcs, chord, { t: await makeT(lang), lang });
      for (const w of want[lang]) expect(text, lang).toContain(w);
      expect(text, lang).not.toMatch(/\b(Notes|Count|Diatonic Chords|Selected Chord|Major|Minor)\b/);
    }
  });

  it('without a locale it stays the English text other callers rely on', () => {
    const text = generateScaleSummary(scale, dcs, chord);
    expect(text).toContain('Selected Chord: G Major');
    expect(text).toContain('Count: 7 notes');
  });
});

describe('Explore\'s dock until the learner sets it', () => {
  it('Peek on a short screen, Half otherwise', () => {
    expect(defaultExploreDetent(true)).toBe('peek');
    expect(defaultExploreDetent(false)).toBe('half');
  });

  it('the learner\'s setting is a choice; the app opening the dock for an exercise is not', () => {
    useAppStore.setState({ view: 'explore', dockDetents: { explore: 'peek', learn: 'peek' }, dockChosen: { explore: false, learn: false } });
    useAppStore.getState().setDockDetent('explore', 'half');
    expect(useAppStore.getState().dockChosen.explore).toBe(true);
    useAppStore.setState({ view: 'learn' });
    useAppStore.getState().requestDock('half');
    expect(useAppStore.getState().dockDetents.learn).toBe('half');
    expect(useAppStore.getState().dockChosen.learn).toBe(false);
  });

  it('rehydrating: an unchosen saved detent yields to the screen default; a pre-dockChosen save keeps anything but the old default', async () => {
    const merge = useAppStore.persist.getOptions().merge!;
    const current = { ...useAppStore.getState(), dockDetents: { explore: 'peek', learn: 'peek' } } as ReturnType<typeof useAppStore.getState>;
    const a = merge({ dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: false, learn: false } }, current) as typeof current;
    expect(a.dockDetents.explore).toBe('peek');
    const b = merge({ dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: true, learn: false } }, current) as typeof current;
    expect(b.dockDetents.explore).toBe('half');
    // Saved before dockChosen existed: 'full' was the learner's; 'half' was the old default.
    const c = merge({ dockDetents: { explore: 'full', learn: 'peek' } }, current) as typeof current;
    expect([c.dockDetents.explore, c.dockChosen.explore]).toEqual(['full', true]);
    const d = merge({ dockDetents: { explore: 'half', learn: 'peek' } }, current) as typeof current;
    expect([d.dockDetents.explore, d.dockChosen.explore]).toEqual(['peek', false]);
  });

  it('a corrupt dockChosen is dropped', () => {
    expect(sanitizeDockChosen({ explore: 'yes' })).toBeNull();
    expect(sanitizeDockChosen({ explore: true })).toEqual({ explore: true, learn: false });
    expect(sanitizeDockChosen({ explore: true, other: 1 })).toBeNull();
  });
});

describe('fretboard with a chord: the scale\'s other notes, faded', () => {
  beforeEach(() => {
    useAppStore.setState({
      selectedKey: C, selectedScale: 'major', selectedChord: buildChord({ natural: 'G', accidental: '' }, 'major'), chordInversion: 0,
      instrument: 'guitar', view: 'explore', exerciseInputActive: false, guitarTuningId: 'standard', guitarScalePosition: 0,
      activeNotes: new Set<number>(), highlightedNotes: [], quickSearchOpen: false, themeMode: 'fermata', language: 'en',
    });
  });

  it('every visible scale note outside the shape wears a small unlabelled dot; none under a shape dot', async () => {
    const { container } = render(<Fretboard />);
    await screen.findAllByRole('grid');
    const ctx = Array.from(container.querySelectorAll('[data-dot="context"]'));
    expect(ctx.length).toBeGreaterThan(5);
    expect(ctx.every((d) => (d.textContent ?? '') === '')).toBe(true);
    expect(ctx.every((d) => d.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(ctx.filter((d) => d.parentElement?.querySelector('[data-dot="voicing"]')).length).toBe(0);
    expect(container.querySelectorAll('[data-dot="voicing"]').length).toBeGreaterThan(0);
  });

  it('no faded dots without a chord (the scale is drawn in full there)', async () => {
    useAppStore.setState({ selectedChord: null });
    const { container } = render(<Fretboard />);
    await screen.findAllByRole('grid');
    expect(container.querySelectorAll('[data-dot="context"]').length).toBe(0);
  });
});
