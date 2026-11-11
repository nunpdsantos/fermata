import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton } from '../ui/Button.tsx';
import { SelectTrigger } from '../ui/SelectTrigger.tsx';
import { Term } from '../../glossary/Term.tsx';
import { measureToastRoom, useToastAvoid } from '../layout/toastLayout.ts';
import { useMediaQuery } from '../../hooks/useMediaQuery.ts';
import { BAR_CHOICES, MAX_TEMPO, MIN_TEMPO } from '../../state/metronomeSave.ts';
import { useLoopState } from '../explore/progression/loopController.ts';
import {
  setMetronomeBeats,
  setMetronomeTempo,
  startMetronome,
  stopMetronome,
  useMetronome,
  useMetronomeSettings,
} from '../../services/metronome/metronome.ts';
import { clickAudioAvailable } from '../../services/metronome/clickVoice.ts';
import { TapTempo } from '../../services/metronome/tapTempo.ts';
import { GUTTER, placeMetronome, type Box, type MetronomePlace } from './placement.ts';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
/** A first guess at the bar's width on a tablet / laptop, before it has been drawn (it is as wide as its controls). */
const BAR_MAX_WIDTH = 720;
/** Below this the bar takes the window's width (less the gutters), as the tour's does on a phone. */
const PHONE_QUERY = '(max-width: 639px)';
/** From this width the visible labels show (metronome.css hides them below 900 px). */
const LABELS_QUERY = '(min-width: 900px)';

const svg = (d: React.ReactNode) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const ICONS = {
  play: svg(<polygon points="7 5 19 12 7 19 7 5" fill="currentColor" />),
  stop: svg(<rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" />),
  close: svg(<><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>),
};

const toBox = (r: DOMRect): Box => ({ top: r.top, bottom: r.bottom, left: r.left, right: r.right });

/**
 * The empty stretches of the top bar: between the name (or its mark) and the
 * tabs, and between the tabs and the first control on the right.
 */
function topBarSpans(): Box[] {
  const bar = document.querySelector('.app-topbar');
  if (!bar) return [];
  const r = bar.getBoundingClientRect();
  const cells = Array.from(bar.children) as HTMLElement[];
  const extent = (el: Element | undefined): { left: number; right: number } | null => {
    if (!el) return null;
    let left = Infinity;
    let right = -Infinity;
    for (const c of Array.from(el.querySelectorAll('*'))) {
      const b = c.getBoundingClientRect();
      if (b.width < 2 || b.height < 2) continue;
      left = Math.min(left, b.left);
      right = Math.max(right, b.right);
    }
    return left < right ? { left, right } : null;
  };
  const [brand, tabs, tools] = [extent(cells[0]), extent(cells[1]), extent(cells[2])];
  const spans: Box[] = [];
  if (tabs) {
    spans.push({ top: r.top, bottom: r.bottom, left: brand ? brand.right : r.left, right: tabs.left });
    spans.push({ top: r.top, bottom: r.bottom, left: tabs.right, right: tools ? tools.left : r.right });
  }
  return spans;
}

/** The first element for a selector that has a box on screen. */
function shownBox(selector: string, vh: number): Box | null {
  for (const el of Array.from(document.querySelectorAll(selector))) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < vh) return toBox(r);
  }
  return null;
}

/**
 * Where the bar goes, measured every frame while it shows (the dock moves, a
 * check's answers come and go, a chord's detail opens) — as the tour's bar
 * is. It keeps the last size each form was drawn at, per window width.
 */
function usePlacement(barRef: React.RefObject<HTMLElement | null>): MetronomePlace | null {
  const [place, setPlace] = useState<MetronomePlace | null>(null);
  const sizes = useRef<{ full: Map<number, { w: number; h: number }>; compact: Map<number, { w: number; h: number }> }>({ full: new Map(), compact: new Map() });
  useEffect(() => {
    let frame = 0;
    let last = '';
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const bar = barRef.current;
      if (bar && bar.offsetHeight > 0) {
        // The form drawn now (the bar says which), at this window width.
        (bar.hasAttribute('data-compact') ? sizes.current.compact : sizes.current.full).set(vw, { w: bar.offsetWidth, h: bar.offsetHeight });
      }
      const full = sizes.current.full.get(vw);
      const small = sizes.current.compact.get(vw);
      if (full || small) {
        const topBar = document.querySelector('.app-topbar')?.getBoundingClientRect();
        const dock = document.querySelector('[data-testid="instrument-dock"]')?.getBoundingClientRect();
        const hint = document.querySelector('[data-testid="start-hint"]')?.getBoundingClientRect();
        const answers = shownBox('[data-testid="check-answer-zone"]', vh);
        const detail = shownBox('[data-testid="chord-detail"]', vh);
        const cap = (w: number) => Math.min(w, vw - 2 * GUTTER);
        // Before a form has been drawn at this width: a guess that errs on the large side.
        const fullSize = full ?? { w: cap(BAR_MAX_WIDTH), h: (small?.h ?? 52) * 2 };
        const smallSize = small ?? { w: cap(240), h: fullSize.h };
        // Kept in reach over a sheet (MetronomeHost portals it into the sheet:
        // wave 3 integration, seam 5): everything under the scrim is out of
        // play, the top bar included, so the bar may go up to the window's
        // top; it never covers the sheet's panel where there is room — above
        // a phone's bottom sheet (its floor), beside a wider screen's panel.
        const panel = bar?.closest('.sheet-panel')?.getBoundingClientRect();
        const bottomSheet = panel ? panel.width >= vw - 2 * GUTTER : false;
        const floorAt = panel && bottomSheet ? panel.top : dock && dock.height > 0 && dock.top < vh ? dock.top : vh;
        const next = placeMetronome({
          viewport: { width: vw, height: vh },
          topBarBottom: panel ? 0 : topBar?.bottom ?? 0,
          topClear: !panel && hint && hint.height > 0 ? hint.bottom : undefined,
          floor: floorAt,
          fullWidth: cap(fullSize.w),
          fullHeight: fullSize.h,
          compactWidth: cap(smallSize.w),
          compactHeight: smallSize.h,
          hard: [...(answers && !panel ? [answers] : []), ...(panel && !bottomSheet ? [toBox(panel)] : [])],
          soft: detail && !panel ? [detail] : [],
          topBarSpans: panel ? [] : topBarSpans(),
        });
        const rounded = { top: Math.round(next.top), left: Math.round(next.left), compact: next.compact, inTopBar: !!next.inTopBar };
        const key = JSON.stringify(rounded);
        if (key !== last) {
          last = key;
          setPlace(rounded);
        }
      }
      frame = requestAnimationFrame(measure);
    };
    measure();
    return () => cancelAnimationFrame(frame);
  }, [barRef]);
  return place;
}

/**
 * The metronome's bar (wave 3, stream M): ▶ / ■, the count (the place in
 * the bar of the click that last sounded; it does not flash under
 * prefers-reduced-motion), the tempo with − / + (and typing a number), Tap,
 * the beats in a bar, ✕ (which stops it). Never modal: a fixed overlay
 * above the instrument, off a check's answers; toasts keep off it
 * (`useToastAvoid`). One line says why it stopped when the Progression
 * loop started (and while the loop plays).
 */
export function MetronomeBar({ onClose, focusOnOpen = true, onFocused }: {
  onClose: () => void;
  /** ▶ takes focus once it is placed (false when the bar only moved into or out of a sheet). */
  focusOnOpen?: boolean;
  onFocused?: () => void;
}) {
  const { t } = useTranslation();
  const { bpm, beats } = useMetronomeSettings();
  const running = useMetronome((s) => s.running);
  const beat = useMetronome((s) => s.beat);
  const stoppedByLoop = useMetronome((s) => s.lastStop === 'loop');
  const looping = useLoopState((s) => s.playing);
  const reduce = useMediaQuery(REDUCED_MOTION);
  const phone = useMediaQuery(PHONE_QUERY);
  const labels = useMediaQuery(LABELS_QUERY);
  const barRef = useRef<HTMLElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const tapper = useRef(new TapTempo());
  const place = usePlacement(barRef);
  const compact = place?.compact ?? false;
  const available = clickAudioAvailable();

  const shown = place !== null;
  // In the top bar's empty stretch toasts (under the top bar) never meet it — and it must not take their room.
  useToastAvoid(barRef, shown && !place?.inTopBar);
  useLayoutEffect(() => {
    if (shown) measureToastRoom();
  }, [shown, place?.top, place?.left, compact]);

  // Focus on ▶ when the bar opens (it was opened from the "⋯" menu).
  const focused = useRef(!focusOnOpen);
  useEffect(() => {
    if (focused.current || !shown) return;
    focused.current = true;
    (playRef.current ?? barRef.current?.querySelector<HTMLElement>('button'))?.focus({ preventScroll: true });
    onFocused?.();
  }, [shown, onFocused]);

  // A control that went away with the compact form: focus stays in the bar.
  useLayoutEffect(() => {
    if (document.activeElement === document.body && barRef.current?.dataset.hadFocus === 'true') playRef.current?.focus({ preventScroll: true });
  }, [compact]);

  const close = () => {
    stopMetronome('closed');
    tapper.current.reset();
    onClose();
    document.querySelector<HTMLElement>('[data-testid="app-menu"] button')?.focus({ preventScroll: true });
  };

  const toggle = () => (running ? stopMetronome('user') : startMetronome());

  const onTap = (e: MouseEvent<HTMLButtonElement>) => {
    const next = tapper.current.tap(e.timeStamp || performance.now());
    if (next !== null) setMetronomeTempo(next);
  };

  const note = available && (looping || stoppedByLoop) ? t('metronomeTool.loopNote') : null;

  return (
    <section
      ref={barRef}
      className="metro-bar"
      role="region"
      aria-label={t('metronomeTool.region')}
      data-testid="metronome"
      data-running={running || undefined}
      data-compact={compact || undefined}
      data-in-top-bar={place?.inTopBar || undefined}
      data-measured={shown ? 'true' : 'false'}
      data-reduced-motion={reduce || undefined}
      onFocus={() => { if (barRef.current) barRef.current.dataset.hadFocus = 'true'; }}
      onBlur={(e) => { if (barRef.current && !barRef.current.contains(e.relatedTarget as Node | null)) barRef.current.dataset.hadFocus = 'false'; }}
      style={{
        top: place?.top ?? 0,
        left: place?.left ?? GUTTER,
        ...(phone && !compact ? { width: `calc(100vw - ${2 * GUTTER}px)` } : {}),
      }}
    >
      {!available ? (
        <div className="metro-row">
          <p className="metro-note" data-testid="metronome-unavailable">{t('metronomeTool.unavailable')}</p>
          <IconButton aria-label={t('metronomeTool.close')} icon={ICONS.close} onClick={close} data-testid="metronome-close" />
        </div>
      ) : (
        <div className="metro-row">
          <IconButton
            ref={playRef}
            variant="primary"
            aria-label={running ? t('metronomeTool.stop') : t('metronomeTool.start')}
            icon={running ? ICONS.stop : ICONS.play}
            onClick={toggle}
            data-testid="metronome-play"
          />
          {compact ? (
            <>
              <span className="metro-now" aria-hidden="true" data-testid="metronome-count">
                <span className="metro-beat" data-current={beat !== null || undefined}>{beat ?? '·'}</span>
              </span>
              <span className="metro-tempo-text" data-testid="metronome-bpm" aria-label={t('metronomeTool.tempoNow', { bpm })} role="img">{bpm}</span>
            </>
          ) : (
            <>
              <span className="metro-count" aria-hidden="true" data-testid="metronome-count">
                {Array.from({ length: beats }, (_, i) => (
                  <span key={i} className="metro-beat" data-current={beat === i + 1 || undefined}>{i + 1}</span>
                ))}
              </span>
              <div className="metro-group" role="group" aria-label={t('metronomeTool.tempo')}>
                {/* The word is a glossary button only where it shows: a hidden one would be an invisible Tab stop (the group's name says "Tempo" anyway). */}
                {labels && <span className="metro-label"><Term id="tempo">{t('metronomeTool.tempo')}</Term></span>}
                <IconButton variant="secondary" aria-label={t('metronomeTool.slower')} icon="−" disabled={bpm <= MIN_TEMPO} onClick={() => setMetronomeTempo(bpm - 1)} data-testid="metronome-slower" />
                <TempoInput bpm={bpm} label={t('metronomeTool.tempoInput')} />
                <IconButton variant="secondary" aria-label={t('metronomeTool.faster')} icon="+" disabled={bpm >= MAX_TEMPO} onClick={() => setMetronomeTempo(bpm + 1)} data-testid="metronome-faster" />
              </div>
              <Button variant="secondary" className="metro-tap" aria-label={t('metronomeTool.tapLabel')} onClick={onTap} data-testid="metronome-tap">
                {t('metronomeTool.tap')}
              </Button>
              <label className="metro-group metro-beats">
                <span className="metro-label">{t('metronomeTool.beats')}</span>
                <SelectTrigger
                  aria-label={t('metronomeTool.beats')}
                  value={beats}
                  onChange={(e) => setMetronomeBeats(Number(e.target.value))}
                  data-testid="metronome-beats"
                >
                  {BAR_CHOICES.map((b) => <option key={b} value={b}>{t('metronomeTool.beatsOption', { n: b })}</option>)}
                </SelectTrigger>
              </label>
            </>
          )}
          <IconButton aria-label={t('metronomeTool.close')} icon={ICONS.close} onClick={close} className="metro-close" data-testid="metronome-close" />
        </div>
      )}
      {note && !compact && <p className="metro-note" role="status" data-testid="metronome-loop-note">{note}</p>}
    </section>
  );
}

/** The tempo as a number the learner can type: applied on Enter or leaving the field; Escape puts it back. */
function TempoInput({ bpm, label }: { bpm: number; label: string }) {
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    if (draft === null) return;
    const n = Number.parseInt(draft, 10);
    setDraft(null);
    if (Number.isFinite(n)) setMetronomeTempo(n);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Escape') {
      setDraft(null);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      setDraft(null);
      setMetronomeTempo(bpm + (e.key === 'ArrowUp' ? 1 : -1));
    }
  };
  return (
    <input
      className="metro-input"
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={3}
      aria-label={label}
      value={draft ?? String(bpm)}
      onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ''))}
      onBlur={commit}
      onKeyDown={onKey}
      data-testid="metronome-bpm"
    />
  );
}
