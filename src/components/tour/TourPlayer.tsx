import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useStore } from 'zustand';
import { Button, IconButton } from '../ui/Button.tsx';
import { useMediaQuery } from '../../hooks/useMediaQuery.ts';
import { toast } from '../../state/toastStore.ts';
import { measureToastRoom, useToastAvoid } from '../layout/toastLayout.ts';
import { getDemoSource, type DemoTour } from '../../state/demoRequest.ts';
import { useAppStore } from '../../state/store.ts';
import { TourSession, holdMsFor } from '../../services/tour/session.ts';
import { busyReason } from '../../services/tour/guards.ts';
import { returnView } from '../../services/tour/snapshot.ts';
import { BAR_GUTTER, findTarget, placeBar, type Box, type BarSlot } from '../../services/tour/dom.ts';
import type { TourStep } from '../../services/tour/types.ts';
import { useGlossaryUi } from '../../glossary/glossaryUi.ts';
import './tour.css';

/**
 * The tour player (lazy chunk): plays the requested tour over the REAL app
 * and draws the caption bar, the spotlight ring and the tap cue.
 *
 * The caption bar: caption (announced politely), step dots, Back,
 * Pause / Resume, Next, Sound and Close; Escape closes. Every control is at
 * least the tap size (Button / IconButton). Under prefers-reduced-motion
 * nothing advances by itself (no Pause then) and the cue does not move.
 * Touching the app itself pauses the tour and offers Resume / End.
 * Toasts keep off the bar (it registers with `useToastAvoid`, like the dock
 * and Drill's answers): while the bar is under the top bar, toasts wait.
 * Closing or reloading the page mid-tour ends it (restored, then saved).
 */

// The one playing session, for React (set by the player's own effect).
let active: TourSession | null = null;
const activeListeners = new Set<() => void>();
const setActive = (s: TourSession | null) => {
  active = s;
  for (const l of activeListeners) l();
};
const subscribeActive = (l: () => void) => {
  activeListeners.add(l);
  return () => activeListeners.delete(l);
};
const getActive = () => active;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

const holdMs = (step: TourStep) => holdMsFor(i18next.t(step.caption()));

export default function TourPlayer({ tour, onDone }: { tour: DemoTour; onDone: () => void }) {
  const { t } = useTranslation();
  const session = useSyncExternalStore(subscribeActive, getActive, getActive);
  const reduce = useMediaQuery(REDUCED_MOTION);

  useEffect(() => {
    const reason = busyReason();
    if (reason) {
      toast(i18next.t(reason === 'drill' ? 'showMe.busyDrill' : 'showMe.busyCheck'), 'info', 5000);
      onDone();
      return;
    }
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const s = new TourSession({
      tour,
      source: getDemoSource(),
      reducedMotion: typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION).matches,
      holdMs,
      onDone,
    });
    setActive(s);
    // Started a microtask later: React's development double-mount (StrictMode)
    // unmounts this session before it has done anything, so the second one
    // snapshots the app as the viewer left it (a started first session moved
    // the view to Explore, and from a lesson the restore cannot go back).
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) s.start();
    });
    const onPageHide = () => s.leavePage();
    window.addEventListener('pagehide', onPageHide);
    return () => {
      cancelled = true;
      window.removeEventListener('pagehide', onPageHide);
      s.dispose();
      setActive(null);
      // Focus back where the tour was started from (the "⋯" button), else the view's tab.
      const back = returnFocus?.isConnected ? returnFocus : document.getElementById(`tab-${useAppStore.getState().view}`);
      back?.focus({ preventScroll: true });
    };
  }, [tour, onDone]);

  useEffect(() => {
    session?.setReducedMotion(reduce);
  }, [session, reduce]);

  if (!session || typeof document === 'undefined') return null;
  return createPortal(<TourOverlay session={session} t={t} />, document.body);
}

type T = ReturnType<typeof useTranslation>['t'];

const svg = (d: ReactNode) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const ICONS = {
  back: svg(<path d="M15 18l-6-6 6-6" />),
  next: svg(<path d="M9 18l6-6-6-6" />),
  pause: svg(<><line x1="9" y1="6" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="18" /></>),
  play: svg(<polygon points="7 5 19 12 7 19 7 5" fill="currentColor" />),
  soundOn: svg(<><polygon points="4 9 8 9 13 5 13 19 8 15 4 15 4 9" /><path d="M16.5 8.5a5 5 0 0 1 0 7" /><path d="M19 6a8.5 8.5 0 0 1 0 12" /></>),
  soundOff: svg(<><polygon points="4 9 8 9 13 5 13 19 8 15 4 15 4 9" /><line x1="17" y1="9" x2="22" y2="15" /><line x1="22" y1="9" x2="17" y2="15" /></>),
  close: svg(<><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>),
};

interface Layout {
  target: Box | null;
  cue: { x: number; y: number } | null;
  barTop: number | null;
  barLeft: number | null;
  barWidth: number | null;
  slot: BarSlot | null;
}

/** The bar's widest (CSS max-width of .tour-bar). */
const BAR_MAX_WIDTH = 720;
const EMPTY: Layout = { target: null, cue: null, barTop: null, barLeft: null, barWidth: null, slot: null };

/** The ring 4 px outside the target, kept 2 px inside the window. */
function ring(b: Box) {
  const top = Math.max(2, b.top - 4);
  const left = Math.max(2, b.left - 4);
  const bottom = Math.min(window.innerHeight - 2, b.bottom + 4);
  const right = Math.min(window.innerWidth - 2, b.right + 4);
  return { top, left, width: Math.max(0, right - left), height: Math.max(0, bottom - top) };
}

/**
 * The part of `el` that is on screen: clipped by every scrolling / clipping
 * ancestor (the work column under the phone's sheet, a sheet's content past
 * the bottom) and by the window. Null when none of it shows.
 */
function visibleBox(el: Element, vw: number, vh: number): Box | null {
  let b = toBox(el.getBoundingClientRect());
  for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
    const cs = getComputedStyle(a);
    if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
    const r = a.getBoundingClientRect();
    b = { top: Math.max(b.top, r.top), bottom: Math.min(b.bottom, r.bottom), left: Math.max(b.left, r.left), right: Math.min(b.right, r.right) };
  }
  b = { top: Math.max(0, b.top), bottom: Math.min(vh, b.bottom), left: Math.max(0, b.left), right: Math.min(vw, b.right) };
  return b.bottom > b.top && b.right > b.left ? b : null;
}

const toBox = (r: DOMRect): Box => ({ top: r.top, bottom: r.bottom, left: r.left, right: r.right });
const sameLayout = (a: Layout, b: Layout) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Where the spotlight, the cue and the bar go — measured every frame while
 * the tour plays (targets move: a sheet opens, a card scrolls into view).
 */
function useTourLayout(targetSel: string | null, cueSel: string | null, barRef: RefObject<HTMLElement | null>): Layout {
  const [layout, setLayout] = useState<Layout>(EMPTY);
  useEffect(() => {
    let frame = 0;
    let last: Layout = EMPTY;
    const measure = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const el = targetSel ? findTarget(targetSel) : null;
      let target: Box | null = null;
      if (el) target = visibleBox(el, vw, vh);
      const cueEl = cueSel ? findTarget(cueSel) : null;
      const cueRect = cueEl ? cueEl.getBoundingClientRect() : null;
      const topBar = document.querySelector('.app-topbar')?.getBoundingClientRect();
      const dock = document.querySelector('[data-testid="instrument-dock"]')?.getBoundingClientRect();
      // A word's explanation (plain words): a phone's sheet is a floor the
      // bar stays above; a laptop's popover is a box it keeps off.
      const sheetPanel = document.querySelector('[data-testid="glossary-sheet"]')?.getBoundingClientRect();
      const popover = document.querySelector('[data-testid="glossary-popover"]')?.getBoundingClientRect();
      // The start hint (wave 1) is a line in the flow under the top bar: the bar's top place starts below it.
      const hint = document.querySelector('[data-testid="start-hint"]')?.getBoundingClientRect();
      const floor = Math.min(
        dock && dock.height > 0 && dock.top < vh ? dock.top : vh,
        sheetPanel && sheetPanel.height > 0 ? sheetPanel.top : vh,
      );
      const barHeight = barRef.current?.offsetHeight ?? 0;
      const barWidth = Math.min(BAR_MAX_WIDTH, vw - 2 * BAR_GUTTER);
      const placed = barHeight > 0
        ? placeBar({
            viewport: { width: vw, height: vh },
            topBarBottom: topBar?.bottom ?? 0,
            floor,
            barHeight,
            barWidth,
            target,
            cue: cueRect ? toBox(cueRect) : null,
            targetInTopBar: !!(el && el.closest('.app-topbar')),
            avoid: popover && popover.height > 0 ? toBox(popover) : null,
            topClear: hint && hint.height > 0 ? hint.bottom : undefined,
            keepClear: hint && hint.height > 0 ? toBox(hint) : null,
          })
        : null;
      const next: Layout = {
        target: target && { top: Math.round(target.top), bottom: Math.round(target.bottom), left: Math.round(target.left), right: Math.round(target.right) },
        cue: cueRect ? { x: Math.round(cueRect.left + cueRect.width / 2), y: Math.round(cueRect.top + cueRect.height / 2) } : null,
        barTop: placed ? Math.round(placed.top) : null,
        barLeft: placed ? Math.round(placed.left) : null,
        barWidth: placed ? barWidth : null,
        slot: placed?.slot ?? null,
      };
      if (!sameLayout(next, last)) {
        last = next;
        setLayout(next);
      }
      frame = requestAnimationFrame(measure);
    };
    frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [targetSel, cueSel, barRef]);
  return layout;
}

function TourOverlay({ session, t }: { session: TourSession; t: T }) {
  const state = useStore(session.store);
  const { engine, sound, cue, finished } = state;
  const step = session.engine.steps[engine.index] ?? null;
  const barRef = useRef<HTMLElement>(null);
  const targetSel = step?.target?.() ?? null;
  const layout = useTourLayout(targetSel, cue?.selector ?? null, barRef);
  const reduce = useMediaQuery(REDUCED_MOTION);
  // While a word's explanation is open (the 'word' step), the bar stays above
  // a phone's explanation sheet and its scrim, so Next / End stay in reach.
  const explaining = useGlossaryUi((s) => s.request !== null);
  const visible = session.engine.visibleSteps();
  const position = step ? visible.indexOf(step) : -1;
  const final = !!step?.final;
  const menuTour = session.source === 'menu';

  // Toasts never cover the bar (toastLayout.ts); its place changes with the
  // step without a resize, so the room is measured again when it moves.
  const barShown = !finished && !!step && layout.barTop !== null;
  useToastAvoid(barRef, barShown);
  useLayoutEffect(() => {
    if (barShown) measureToastRoom();
  }, [barShown, layout.barTop, layout.barLeft]);

  // Escape closes (not while a sheet / dialog of the app is open: it is that one's).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (document.querySelector('[role="dialog"]')) return;
      e.preventDefault();
      void session.finish('restore');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [session]);

  // Touching the app itself (not the bar) pauses the tour and offers Resume / End.
  useEffect(() => {
    // (The tour's own presses are plain clicks — never pointerdown / keydown / wheel.)
    const onTouch = (e: Event) => {
      const bar = barRef.current;
      if (bar && e.target instanceof Node && bar.contains(e.target)) return;
      if (e instanceof KeyboardEvent && ['Tab', 'Shift', 'Escape', 'Alt', 'Control', 'Meta'].includes(e.key)) return;
      const s = session.engine.getState();
      if (s.phase === 'stopped' || session.engine.current?.final) return;
      session.pause('touch');
    };
    const opts = { capture: true, passive: true } as const;
    for (const type of ['pointerdown', 'keydown', 'wheel'] as const) document.addEventListener(type, onTouch, opts);
    return () => {
      for (const type of ['pointerdown', 'keydown', 'wheel'] as const) document.removeEventListener(type, onTouch, opts);
    };
  }, [session]);

  // Focus into the bar when the tour starts (it started from a tap or a key).
  const firstFocus = useRef(false);
  useEffect(() => {
    if (firstFocus.current || layout.barTop === null) return;
    firstFocus.current = true;
    barRef.current?.querySelector<HTMLElement>('[data-tour-focus]')?.focus({ preventScroll: true });
  }, [layout.barTop]);

  // The controls change under the keyboard (Next and Pause leave on the end
  // card): focus the card's own button rather than losing it to the page.
  const stepId = step?.id;
  const final_ = !!step?.final;
  useEffect(() => {
    if (!firstFocus.current) return;
    const lost = !document.activeElement || document.activeElement === document.body;
    const inBar = !!barRef.current?.contains(document.activeElement);
    if (final_ ? inBar || lost : lost) barRef.current?.querySelector<HTMLElement>(final_ ? '.tour-extra [data-tour-focus]' : '[data-tour-focus]')?.focus({ preventScroll: true });
  }, [stepId, final_]);

  if (finished || !step) return null;

  const caption = t(step.caption());
  const paused = engine.paused;
  const canBack = visible.indexOf(step) > 0;
  const hasExtra = final || engine.pausedBy === 'touch' || sound === 'blocked';
  // Going back to Learn or Drill would make it write (guards.ts): the restore
  // then lands on Explore, and the button says so instead of "where I was".
  const startView = session.snapshot.app.view;
  const landsElsewhere = final && menuTour && returnView(session.snapshot) !== startView;

  return (
    <div className="tour-layer" data-testid="tour" data-above-sheet={explaining ? '' : undefined}>
      {layout.target && (
        <div
          className="tour-spotlight"
          data-testid="tour-spotlight"
          aria-hidden="true"
          style={ring(layout.target)}
        />
      )}
      {cue && layout.cue && (
        <div key={cue.seq} className="tour-cue" data-testid="tour-cue" aria-hidden="true" style={{ top: layout.cue.y, left: layout.cue.x }} />
      )}
      <section
        ref={barRef}
        className="tour-bar"
        role="region"
        aria-label={t('showMe.region')}
        data-testid="tour-bar"
        data-step={step.id}
        data-phase={engine.phase}
        data-slot={layout.slot ?? undefined}
        data-measured={layout.barTop === null ? 'false' : 'true'}
        style={{ top: layout.barTop ?? 0, left: layout.barLeft ?? BAR_GUTTER, width: layout.barWidth ?? Math.min(BAR_MAX_WIDTH, window.innerWidth - 2 * BAR_GUTTER) }}
      >
        <span className="tour-dots" role="img" aria-label={t('showMe.step', { n: position + 1, total: visible.length })}>
          {visible.map((s, i) => <span key={s.id} className="tour-dot" data-current={i === position || undefined} />)}
        </span>
        <p className="tour-caption" role="status" data-testid="tour-caption">{caption}</p>

        <div className="tour-controls">
          <IconButton aria-label={t('showMe.back')} icon={ICONS.back} onClick={session.back} disabled={!canBack} data-testid="tour-back" />
          {!final && !reduce && (
            <IconButton
              aria-label={paused ? t('showMe.resume') : t('showMe.pause')}
              icon={paused ? ICONS.play : ICONS.pause}
              onClick={() => (paused ? session.resume() : session.pause('viewer'))}
              data-testid="tour-pause"
              data-tour-focus=""
            />
          )}
          {!final && (
            <IconButton
              variant="primary"
              aria-label={t('showMe.next')}
              icon={ICONS.next}
              onClick={session.next}
              data-testid="tour-next"
              {...(reduce ? { 'data-tour-focus': '' } : {})}
            />
          )}
          {sound !== 'blocked' && (
            <IconButton
              aria-label={t('showMe.sound')}
              aria-pressed={sound === 'on'}
              icon={sound === 'on' ? ICONS.soundOn : ICONS.soundOff}
              onClick={() => session.setSound(sound !== 'on')}
              data-testid="tour-sound"
            />
          )}
          <IconButton aria-label={t('showMe.close')} icon={ICONS.close} onClick={() => void session.finish('restore')} data-testid="tour-close" />
        </div>

        {hasExtra && (
          <div className="tour-extra">
            {final && menuTour && (
              <>
                {landsElsewhere && (
                  <p className="tour-note" data-testid="tour-elsewhere">{t('showMe.elsewhereNote', { view: t(`nav.${startView}`) })}</p>
                )}
                <Button variant="secondary" onClick={() => void session.finish('stay')} data-testid="tour-stay">{t('showMe.stayHere')}</Button>
                <Button variant="primary" onClick={() => void session.finish('restore')} data-testid="tour-restore" data-tour-focus="">
                  {landsElsewhere ? t('showMe.putBack') : t('showMe.backToStart')}
                </Button>
              </>
            )}
            {final && !menuTour && (
              <Button variant="primary" onClick={() => void session.finish('restore')} data-testid="tour-done" data-tour-focus="">{t('showMe.done')}</Button>
            )}
            {!final && engine.pausedBy === 'touch' && (
              <>
                <p className="tour-note" data-testid="tour-paused">{t('showMe.pausedTouch')}</p>
                <Button variant="primary" onClick={session.resume} data-testid="tour-resume">{t('showMe.resume')}</Button>
                <Button variant="secondary" onClick={() => void session.finish('restore')} data-testid="tour-end">{t('showMe.end')}</Button>
              </>
            )}
            {!final && sound === 'blocked' && (
              <Button variant="secondary" onClick={() => void session.enableSound()} data-testid="tour-tap-sound">{t('showMe.tapForSound')}</Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
