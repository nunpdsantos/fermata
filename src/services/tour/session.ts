/**
 * One playing of a tour: the engine, the snapshot it restores, the held
 * settings save, the sound state and the tap cue. The React player
 * (components/tour/TourPlayer.tsx) renders it and forwards the viewer's
 * commands.
 */
import { createStore, type StoreApi } from 'zustand/vanilla';
import type { DemoSource, DemoTour } from '../../state/demoRequest';
import { useAppStore } from '../../state/store';
import type { ViewMode } from '../../state/storeTypes';
import { cancelScheduledAudio, getAudioState, resumeAudio } from '../../core/services/audio';
import { TourEngine, type EngineState } from './engine';
import type { StepContext, TourStep } from './types';
import { waitSettled } from './dom';
import {
  chordsTabSelector, currentChordsTab, holdAppSaving, removeEmptyLearnRecord, restoreChordsTab, restoreProgressionPanel, restoreSnapshot, takeSnapshot, type TourSnapshot,
} from './snapshot';
import { drillVisitIsQuiet, learnVisitIsQuiet } from './guards';
import { introTour, SEL, SHORT_QUERY, WORKBENCH_QUERY } from './introTour';
import { resolveExploreDetail } from '../../state/exploreDetail';

/** 'blocked': the audio is still suspended (no tap reached it) — the bar offers "Tap for sound". */
export type SoundState = 'on' | 'off' | 'blocked';

export interface SessionState {
  engine: EngineState;
  sound: SoundState;
  /** The tap cue: which element, and a counter so a repeat tap restarts it. */
  cue: { selector: string; seq: number } | null;
  finished: boolean;
}

/** The readable pause after a step: longer for a longer caption (about a minute in all). */
export function holdMsFor(caption: string): number {
  return Math.min(7500, Math.max(4500, 3000 + 60 * caption.length));
}

/** How long the cue shows before its action happens, so the viewer sees WHERE. */
export const CUE_LEAD_MS = 500;
/** How long the cue stays up in all. */
export const CUE_MS = 1000;

export interface SessionOptions {
  tour: DemoTour;
  source: DemoSource;
  reducedMotion: boolean;
  /** The readable pause after a step (from its translated caption). */
  holdMs: (step: TourStep) => number;
  /** The tour has ended: the host clears the request. */
  onDone: () => void;
}

const matches = (query: string) => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches;

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve();
    const t = setTimeout(done, ms);
    function done() {
      clearTimeout(t);
      signal.removeEventListener('abort', done);
      resolve();
    }
    signal.addEventListener('abort', done, { once: true });
  });
}

/** The steps of a tour. The short per-screen tours are not built yet: every request plays the intro. */
export function stepsFor(_tour: DemoTour, snap: TourSnapshot): TourStep[] {
  return introTour({
    startInstrument: snap.app.instrument,
    learnQuiet: learnVisitIsQuiet(),
    drillQuiet: drillVisitIsQuiet(),
    workbench: () => matches(WORKBENCH_QUERY),
    short: () => matches(SHORT_QUERY),
    simple: () => {
      const s = useAppStore.getState();
      return resolveExploreDetail(s.exploreDetail, s.learnerProfile) === 'simple';
    },
  });
}

export class TourSession {
  readonly store: StoreApi<SessionState>;
  readonly engine: TourEngine;
  readonly snapshot: TourSnapshot;
  readonly source: DemoSource;
  private readonly release: () => void;
  private readonly onDone: () => void;
  private cueSeq = 0;
  /** Whether the tour has started playing (a session disposed before that changed nothing). */
  private started = false;
  private cueTimer: ReturnType<typeof setTimeout> | null = null;
  private unsubscribe: () => void;

  constructor(opts: SessionOptions) {
    this.source = opts.source;
    this.onDone = opts.onDone;
    this.snapshot = takeSnapshot();
    this.release = holdAppSaving();
    const running = getAudioState() === 'running';
    this.engine = new TourEngine({
      steps: stepsFor(opts.tour, this.snapshot),
      context: (signal) => this.context(signal, opts.reducedMotion),
      reducedMotion: opts.reducedMotion,
      holdMs: opts.holdMs,
      // Leaving a step stops what it was playing.
      onLeave: () => cancelScheduledAudio(),
    });
    this.store = createStore<SessionState>(() => ({
      engine: this.engine.getState(),
      sound: running ? 'on' : 'blocked',
      cue: null,
      finished: false,
    }));
    this.unsubscribe = this.engine.subscribe(() => this.store.setState({ engine: this.engine.getState() }));
  }

  start(): void {
    this.started = true;
    this.engine.start();
    // The tour starts from a tap, so the audio may resume now; if it stays
    // suspended the tour runs silently and offers "Tap for sound".
    if (this.store.getState().sound === 'blocked') {
      void Promise.race([resumeAudio().catch(() => undefined), new Promise((r) => setTimeout(r, 400))]).then(() => {
        if (!this.store.getState().finished && getAudioState() === 'running' && this.store.getState().sound === 'blocked') {
          this.store.setState({ sound: 'on' });
        }
      });
    }
  }

  // ─── Viewer commands ─────────────────────────────────────────────────────
  next = () => this.engine.next();
  back = () => this.engine.back();
  pause = (by: 'viewer' | 'touch' = 'viewer') => this.engine.pause(by);
  resume = () => this.engine.resume();
  setReducedMotion = (reduce: boolean) => this.engine.setReducedMotion(reduce);

  /** The sound toggle. Turning it off stops what is sounding. */
  setSound = (on: boolean) => {
    if (this.store.getState().sound === 'blocked') return;
    if (!on) cancelScheduledAudio();
    this.store.setState({ sound: on ? 'on' : 'off' });
  };

  /** "Tap for sound": called from the tap itself, so the audio may resume. */
  enableSound = async () => {
    try {
      await resumeAudio();
    } catch {
      // still blocked
    }
    if (getAudioState() === 'running') this.store.setState({ sound: 'on' });
  };

  /**
   * End the tour. 'restore' puts the app back as it was ("Back to where I
   * was", Close, Escape, End, and every start-screen ending); 'stay' keeps
   * what the tour shows ("Stay here").
   */
  finish = async (choice: 'stay' | 'restore'): Promise<void> => {
    if (this.store.getState().finished) return;
    this.store.setState({ finished: true, cue: null });
    this.engine.stop();
    this.clearCueTimer();
    cancelScheduledAudio();
    let view: ViewMode;
    // The settings save is released whatever happens: a restore that throws
    // must not leave it held for the rest of the page.
    try {
      view = choice === 'restore' ? restoreSnapshot(this.snapshot) : useAppStore.getState().view;
      // Back in Explore from another view, the chords card mounts afresh on In
      // key: press the tab the viewer had, once it is there.
      const tab = this.snapshot.chordsTab;
      if (choice === 'restore' && view === 'explore' && tab && currentChordsTab() !== tab) {
        if (await waitSettled(chordsTabSelector(tab), new AbortController().signal, 3000)) restoreChordsTab(this.snapshot);
      }
      // Last: the Progression panel hides the tabs (wave 2).
      if (choice === 'restore' && view === 'explore') restoreProgressionPanel(this.snapshot);
    } finally {
      this.release();
    }
    // Learn saves its (empty) record when its view opens: let it, then take
    // back the one the tour's visit created.
    if (view === 'learn') await waitSettled(SEL.learnHeading, new AbortController().signal, 3000);
    removeEmptyLearnRecord(this.snapshot);
    this.unsubscribe();
    this.onDone();
  };

  /**
   * The page is going away (closed, reloaded, navigated) mid-tour: end it as
   * Close would, at once — the app is put back and saved, so what the
   * viewer changed themselves while it played (the theme, the language, the
   * volume) is saved too, and the tour's own changes are not.
   */
  leavePage = (): void => {
    if (this.store.getState().finished) return;
    this.dispose();
    this.onDone();
  };

  /** The player went away without an ending (unmounted): restore, release, nothing else. */
  dispose = (): void => {
    if (this.store.getState().finished) return;
    this.store.setState({ finished: true, cue: null });
    this.engine.stop();
    this.clearCueTimer();
    cancelScheduledAudio();
    // Never started: nothing to put back (and a restore would move a viewer
    // in a lesson to Explore, guards.ts) — but the Progression panel the
    // snapshot closed opens again.
    try {
      if (!this.started) restoreProgressionPanel(this.snapshot);
      else if (restoreSnapshot(this.snapshot) === 'explore') restoreProgressionPanel(this.snapshot);
    } finally {
      this.release();
    }
    removeEmptyLearnRecord(this.snapshot);
    this.unsubscribe();
  };

  // ─── Step context ────────────────────────────────────────────────────────
  private context(signal: AbortSignal, reducedMotion: boolean): StepContext {
    const settled = (selector: string) => waitSettled(selector, signal);
    const reveal = async (selector: string) => {
      const el = await settled(selector);
      if (!el || signal.aborted) return el;
      if (typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
      }
      return settled(selector);
    };
    return {
      signal,
      reducedMotion,
      sound: () => this.store.getState().sound === 'on',
      settled,
      reveal,
      tap: async (selector) => {
        const el = await reveal(selector);
        if (!el || signal.aborted) return;
        this.showCue(selector);
        await delay(CUE_LEAD_MS, signal);
      },
    };
  }

  private showCue(selector: string) {
    this.clearCueTimer();
    this.store.setState({ cue: { selector, seq: ++this.cueSeq } });
    this.cueTimer = setTimeout(() => {
      this.cueTimer = null;
      this.store.setState({ cue: null });
    }, CUE_MS);
  }

  private clearCueTimer() {
    if (this.cueTimer !== null) {
      clearTimeout(this.cueTimer);
      this.cueTimer = null;
    }
  }
}
