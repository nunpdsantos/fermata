import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('../../../core/services/audio', async (orig) => {
  const real = await orig<typeof import('../../../core/services/audio')>();
  return { ...real, resumeAudio: vi.fn(async () => {}), cancelScheduledAudio: vi.fn(), setMasterVolume: vi.fn(), playScale: vi.fn() };
});

import en from '../../../i18n/locales/en.json';
import pt from '../../../i18n/locales/pt.json';
import es from '../../../i18n/locales/es.json';
import * as audio from '../../../core/services/audio';
import { ExploreHeader } from '../../../components/explore/ExploreHeader';
import { useAppStore } from '../../../state/store';
import { introTour } from '../introTour';
import { playTourScale, tourChord } from '../appActions';
import { placeBar } from '../dom';
import { drillVisitIsQuiet, learnVisitIsQuiet } from '../guards';
import { LEARN_SESSION_KEY } from '../../../state/learnSessionPersistence';

type Dict = Record<string, unknown>;
const lookup = (dict: Dict, key: string): unknown => key.split('.').reduce<unknown>((o, k) => (o as Dict | undefined)?.[k], dict);

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('captions', () => {
  for (const startInstrument of ['piano', 'guitar'] as const) {
    it(`every step's caption exists in EN, PT and ES (starting on the ${startInstrument})`, () => {
      const steps = introTour({ startInstrument, learnQuiet: true, drillQuiet: true, workbench: () => true, short: () => false });
      expect(steps.length).toBeGreaterThanOrEqual(7);
      expect(steps.length).toBeLessThanOrEqual(9);
      for (const step of steps) {
        const key = step.caption();
        for (const [lang, dict] of [['en', en], ['pt', pt], ['es', es]] as const) {
          const text = lookup(dict as Dict, key);
          expect(typeof text, `${lang} ${key}`).toBe('string');
          expect((text as string).trim().length, `${lang} ${key}`).toBeGreaterThan(3);
        }
      }
    });
  }

  it('the showMe namespace has the same keys in all three languages', () => {
    const keys = (o: Dict, p = ''): string[] => Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? keys(v as Dict, `${p}${k}.`) : [`${p}${k}`]));
    const enKeys = keys(en.showMe as Dict).sort();
    expect(keys(pt.showMe as Dict).sort()).toEqual(enKeys);
    expect(keys(es.showMe as Dict).sort()).toEqual(enKeys);
  });

  it('the chord step says what a tap does: a chord card only selects it (ChordGrid); its sound is the panel\'s own button, named by its label', () => {
    for (const [lang, dict] of [['en', en], ['pt', pt], ['es', es]] as const) {
      const caption = lookup(dict as Dict, 'showMe.intro.chord') as string;
      const button = lookup(dict as Dict, 'panel.chord') as string;
      // The label as a word of its own (capitalised as on the button), not just "chord" in "Tap a chord".
      expect(new RegExp(`(^|\\s)${button}(\\s|$)`).test(caption), `${lang}: "${caption}" names the ${button} button`).toBe(true);
    }
  });

  it('nine steps on a laptop, eight elsewhere (the circle is beside the work only on a laptop)', () => {
    const ids = (workbench: boolean) => introTour({ startInstrument: 'piano', learnQuiet: true, drillQuiet: true, workbench: () => workbench, short: () => false })
      .filter((s) => !s.available || s.available()).map((s) => s.id);
    expect(ids(true)).toEqual(['key', 'scale', 'chords', 'chord', 'instrument', 'circle', 'learn', 'drill', 'end']);
    expect(ids(false)).not.toContain('circle');
  });

  it('a short screen spotlights the instrument for the instrument steps', () => {
    const steps = introTour({ startInstrument: 'piano', learnQuiet: true, drillQuiet: true, workbench: () => false, short: () => true });
    const target = (id: string) => steps.find((s) => s.id === id)!.target!();
    expect(target('scale')).toBe('[data-tour="play-note"]');
    expect(target('chord')).toBe('[data-tour="play-note"]');
    expect(target('chords')).toBe('[data-tour="chord-row"]');
  });
});

describe('the tour plays the scale as the ▶ Play scale button does', () => {
  beforeEach(() => {
    useAppStore.setState({ view: 'explore', instrument: 'guitar', baseOctave: 3, selectedKey: { natural: 'A', accidental: '' }, selectedScale: 'melodic_minor', selectedChord: null });
  });

  it('same arguments as ExploreHeader (only the completion callback added)', async () => {
    render(<ExploreHeader />);
    fireEvent.click(screen.getAllByRole('button', { name: /play scale|classical/i })[0]);
    await waitFor(() => expect(audio.playScale).toHaveBeenCalledTimes(1));
    const fromButton = vi.mocked(audio.playScale).mock.calls[0];
    vi.mocked(audio.playScale).mockImplementationOnce((...args: unknown[]) => (args[6] as () => void)());
    await playTourScale(new AbortController().signal);
    const fromTour = vi.mocked(audio.playScale).mock.calls[1];
    const strip = (args: unknown[]) => args.map((a) => (typeof a === 'function' ? 'fn' : a));
    expect(strip(fromTour)).toEqual(strip(fromButton));
  });
});

describe('the tour chord', () => {
  it('is V of G major: D major', () => {
    const c = tourChord();
    expect(c.root).toEqual({ natural: 'D', accidental: '' });
    expect(c.quality).toBe('major');
  });
});

describe('placing the caption bar', () => {
  const base = { viewport: { width: 390, height: 844 }, topBarBottom: 60, floor: 540, barHeight: 110, barWidth: 366, cue: null, targetInTopBar: false };
  const box = (top: number, bottom: number) => ({ top, bottom, left: 16, right: 374 });

  it('just above the instrument when nothing is in the way', () => {
    expect(placeBar({ ...base, target: box(70, 120) })).toMatchObject({ slot: 'bottom', top: 422 });
  });
  it('under the top bar when the target is low', () => {
    expect(placeBar({ ...base, target: box(420, 500) })).toMatchObject({ slot: 'top', top: 68 });
  });
  it('over the top bar when the target fills the view', () => {
    expect(placeBar({ ...base, target: box(150, 530) })).toMatchObject({ slot: 'over-topbar' });
  });
  it('never over the top bar when the target is a tab', () => {
    expect(placeBar({ ...base, target: { top: 10, bottom: 50, left: 100, right: 200 }, targetInTopBar: true }).slot).not.toBe('over-topbar');
  });
  it('never below the floor (the instrument)', () => {
    for (let t = 60; t < 540; t += 20) {
      const p = placeBar({ ...base, target: box(t, t + 60) });
      expect(p.top + base.barHeight).toBeLessThanOrEqual(base.floor);
    }
  });
  it('beside the target on a wide screen', () => {
    const p = placeBar({ ...base, viewport: { width: 1440, height: 900 }, floor: 580, barHeight: 84, barWidth: 720, target: { top: 110, bottom: 570, left: 1106, right: 1422 } });
    expect(p.left + 720).toBeLessThanOrEqual(1106 - 8);
  });
});

describe('when opening Learn / Drill would write', () => {
  it('a new learner: both quiet', () => {
    expect(learnVisitIsQuiet()).toBe(true);
    expect(drillVisitIsQuiet()).toBe(true);
  });
  it('a lesson open: Learn is not quiet', () => {
    localStorage.setItem(LEARN_SESSION_KEY, JSON.stringify({ state: { screen: { type: 'module', moduleId: 'l1u1m1', at: Date.now() }, check: null }, version: 1 }));
    expect(learnVisitIsQuiet()).toBe(false);
  });
  it('an empty learn record is quiet', () => {
    localStorage.setItem(LEARN_SESSION_KEY, JSON.stringify({ state: { screen: null, check: null }, version: 1 }));
    expect(learnVisitIsQuiet()).toBe(true);
  });
  it('a completed module without a review schedule (pre-SRS): Learn would backfill', () => {
    localStorage.setItem('music-theory-progress', JSON.stringify({ state: { progress: { completedModules: ['l1u1m1'], reviewSchedules: {} } }, version: 4 }));
    expect(learnVisitIsQuiet()).toBe(false);
  });
  it('a progress save from an older release: loading it would migrate', () => {
    localStorage.setItem('music-theory-progress', JSON.stringify({ state: { progress: { completedModules: [], reviewSchedules: {} } }, version: 1 }));
    expect(learnVisitIsQuiet()).toBe(false);
  });
  it('Drill history: Drill would start a session by itself', () => {
    localStorage.setItem('fermata-drill-v1', JSON.stringify({ state: { introDone: true, activeSession: null, sprint: null }, version: 3 }));
    expect(drillVisitIsQuiet()).toBe(false);
  });
  it('corrupt storage counts as not quiet', () => {
    localStorage.setItem('fermata-drill-v1', '{nope');
    expect(drillVisitIsQuiet()).toBe(false);
  });
});
