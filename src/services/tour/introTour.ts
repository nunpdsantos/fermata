/**
 * The intro tour ('intro', about a minute): Explore → Learn → Drill → "Your turn."
 *
 * Every step first puts the app in the state the step needs (so Back works
 * from anywhere), then performs its own action with the tap cue on the
 * element a learner would tap. Targets are found by stable hooks: existing
 * roles, ids and data-* attributes, and `data-tour` anchors (the report lists
 * the ones this branch added).
 *
 * Layout: on a short screen (a phone held sideways, ≤ 500 px tall) the view
 * above a half-open dock is ~120 px — no room for the caption bar beside a
 * card in it. There the steps about the instrument spotlight the instrument
 * itself (dock at Half, the bar in the view), and the steps about the page
 * fold the dock to Peek. Elsewhere the dock stays at Half throughout. The
 * circle step exists only where the circle stands beside the work (laptop).
 */
import type { InstrumentType } from '../../state/storeTypes';
import type { TourStep } from './types';
import {
  chooseTourChord, chooseTourKey, clearChord, closeWordExplanation, goTo, openWordExplanation, playTourScale, pressPlayChord,
  setDock, setInstrument, showInKeyChords,
} from './appActions';

export const SEL = {
  key: '[data-testid="key-picker"]',
  strip: '[data-testid="scale-strip"]',
  playScale: '[data-tour="play-scale"]',
  chordRow: '[data-tour="chord-row"]',
  /** The fifth chord card of the row (V: D major in G). */
  chordCard: '[data-tour="chord-row"] > button:nth-of-type(5)',
  chordDetail: '[data-testid="chord-detail"]',
  playChord: '[data-tour="play-chord"]',
  /**
   * A dotted word in the chord's detail (plain words): "V · dominant" in Full
   * view; Simple has no such line, so there the chord's quality ("major").
   */
  roleWord: '[data-testid="chord-role"] button.term',
  detailWord: '[data-testid="chord-detail"] button.term',
  /** The word's explanation, open and filled in (a laptop's popover, a phone's sheet). */
  explanation: ':is([data-testid="glossary-popover"], [data-testid="glossary-sheet"]) .glossary-plain',
  /** The Piano / Guitar switch's option that is NOT selected. */
  otherInstrument: '[data-tour="instrument"] [role="radio"][aria-checked="false"]',
  instrument: '[data-tour="play-note"]',
  guitarBoard: '[data-tour="play-note"] [role="grid"]',
  pianoKeys: '[data-tour="play-note"] [data-piano-key]',
  /** The circle of fifths beside the work (laptop workbench only). */
  circle: '[data-layout="workbench"] [data-testid="circle-card"]',
  learnTab: '[data-tab="learn"]',
  learnHeading: '#learn-panel h1',
  drillTab: '[data-tab="drill"]',
  drillHeading: '#drill-intro-title',
} as const;

/** The dotted word the 'word' step explains: "V · dominant" when shown (Full), else the detail's first word. */
export function wordSelector(): string {
  if (typeof document !== 'undefined' && document.querySelector(SEL.roleWord)) return SEL.roleWord;
  return SEL.detailWord;
}

/** Laptop widths, where the circle stands beside the work (ExploreView's WORKBENCH_QUERY). */
export const WORKBENCH_QUERY = '(min-width: 1200px)';
/** A short screen (state/dock.ts SHORT_SCREEN_QUERY). */
export const SHORT_QUERY = '(max-height: 500px)';

export interface IntroEnv {
  /** The instrument the viewer was on (step 5 shows the other one; the end goes back). */
  startInstrument: InstrumentType;
  /** Opening Learn / Drill writes nothing now (guards.ts); otherwise the tour points at the tab. */
  learnQuiet: boolean;
  drillQuiet: boolean;
  /** The circle is beside the work (laptop). */
  workbench: () => boolean;
  /** A short screen (phone sideways). */
  short: () => boolean;
  /**
   * Explore shows its Simple view (plain words, wave 1): no circle there, and
   * no chords tabs (showInKeyChords finds none and does nothing). Optional:
   * Full when not given.
   */
  simple?: () => boolean;
}

export function introTour(env: IntroEnv): TourStep[] {
  const start = env.startInstrument;
  const other: InstrumentType = start === 'piano' ? 'guitar' : 'piano';

  /** Explore in G major, with or without the chord, on `instrument`, the dock as the step needs it. */
  const explore = (chord: boolean, instrument: InstrumentType, about: 'page' | 'instrument') => {
    goTo('explore');
    chooseTourKey();
    showInKeyChords();
    if (chord) chooseTourChord();
    else clearChord();
    setInstrument(instrument);
    setDock(about === 'page' && env.short() ? 'peek' : 'half');
  };
  /** On a short screen the instrument steps spotlight the instrument. */
  const onInstrument = (selector: string) => () => (env.short() ? SEL.instrument : selector);

  const playChord = async (c: Parameters<NonNullable<TourStep['run']>>[0]) => {
    if (!c.sound()) return;
    await c.tap(SEL.playChord);
    const button = await c.settled(SEL.playChord);
    if (button instanceof HTMLElement && !c.signal.aborted) await pressPlayChord(button, c.signal);
  };

  return [
    {
      id: 'key',
      caption: () => 'showMe.intro.key',
      target: () => SEL.key,
      run: async (c) => {
        goTo('explore');
        clearChord();
        setInstrument(start);
        setDock(env.short() ? 'peek' : 'half');
        await c.tap(SEL.key);
        chooseTourKey();
        await c.settled(SEL.strip);
      },
    },
    {
      id: 'scale',
      caption: () => 'showMe.intro.scale',
      target: onInstrument(SEL.strip),
      run: async (c) => {
        explore(false, start, 'instrument');
        if (!env.short()) await c.reveal(SEL.strip);
        await c.tap(SEL.playScale);
        if (c.sound()) await playTourScale(c.signal);
        await c.settled(SEL.instrument);
      },
    },
    {
      id: 'chords',
      caption: () => 'showMe.intro.chords',
      target: () => SEL.chordRow,
      run: async (c) => {
        explore(false, start, 'page');
        await c.reveal(SEL.chordRow);
      },
    },
    {
      id: 'chord',
      caption: () => 'showMe.intro.chord',
      target: onInstrument(SEL.chordDetail),
      run: async (c) => {
        explore(false, start, 'instrument');
        await c.tap(SEL.chordCard);
        chooseTourChord();
        await c.reveal(SEL.chordDetail);
        await playChord(c);
      },
    },
    {
      // A word that explains itself (plain words, wave 1): the tap cue on a
      // dotted word of the chord's detail, its explanation opened through the
      // glossary's own function, closed again when the step is left (Next,
      // Back, End, the page going away: every exit aborts the step).
      id: 'word',
      caption: () => 'showMe.intro.word',
      target: () => wordSelector(),
      run: async (c) => {
        explore(true, start, 'page');
        c.signal.addEventListener('abort', closeWordExplanation, { once: true });
        const selector = wordSelector();
        const word = await c.reveal(selector);
        if (!word || c.signal.aborted) return;
        await c.tap(selector);
        if (c.signal.aborted) return;
        // The explanation takes focus as a tap would; a viewer stepping with
        // the keyboard keeps it on the bar's button they pressed.
        const had = document.activeElement;
        const inBar = had instanceof HTMLElement && !!had.closest('[data-testid="tour-bar"]');
        if (!openWordExplanation(word)) return;
        await c.settled(SEL.explanation);
        if (inBar && !c.signal.aborted && had.isConnected) had.focus({ preventScroll: true });
      },
    },
    {
      id: 'instrument',
      caption: () => (other === 'guitar' ? 'showMe.intro.guitar' : 'showMe.intro.piano'),
      target: () => SEL.instrument,
      run: async (c) => {
        explore(true, start, 'instrument');
        await c.tap(SEL.otherInstrument);
        setInstrument(other);
        // The guitar is its own chunk: the step waits for the board itself.
        await c.settled(other === 'guitar' ? SEL.guitarBoard : SEL.pianoKeys);
        await playChord(c);
      },
    },
    {
      id: 'circle',
      caption: () => 'showMe.intro.circle',
      target: () => SEL.circle,
      // Beside the work on a laptop, in Full view only: Simple has no circle.
      available: () => env.workbench() && !(env.simple?.() ?? false),
      run: async (c) => {
        explore(true, other, 'page');
        await c.reveal(SEL.circle);
      },
    },
    {
      id: 'learn',
      caption: () => 'showMe.intro.learn',
      target: () => (env.learnQuiet ? SEL.learnHeading : SEL.learnTab),
      run: async (c) => {
        if (!env.learnQuiet) {
          // Opening Learn would write (guards.ts): point at its tab instead.
          await c.settled(SEL.learnTab);
          return;
        }
        await c.tap(SEL.learnTab);
        goTo('learn');
        await c.settled(SEL.learnHeading);
      },
    },
    {
      id: 'drill',
      caption: () => 'showMe.intro.drill',
      target: () => (env.drillQuiet ? SEL.drillHeading : SEL.drillTab),
      run: async (c) => {
        if (!env.drillQuiet) {
          // Drill would start a session by itself: point at its tab instead.
          await c.settled(SEL.drillTab);
          return;
        }
        await c.tap(SEL.drillTab);
        goTo('drill');
        await c.settled(SEL.drillHeading);
      },
    },
    {
      id: 'end',
      caption: () => 'showMe.intro.end',
      final: true,
      run: async (c) => {
        // "Your turn": back on the chord in Explore, on the viewer's own instrument.
        explore(true, start, 'instrument');
        await c.settled(SEL.chordDetail);
      },
    },
  ];
}
