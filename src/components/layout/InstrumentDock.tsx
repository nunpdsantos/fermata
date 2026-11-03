import { Suspense, lazy, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Piano } from '../instruments/Piano.tsx';
import { DockReadout } from './DockReadout.tsx';
import { DockToolsContext, DOCK_TOOLS_QUERY, NECK_QUERY } from './dockTools.ts';
import { SHORT_SCREEN_QUERY, defaultExploreDetent } from '../../state/dock.ts';

// The landscape full-neck view is its own chunk (precached): only a phone
// held sideways with the guitar ever opens it.
const NeckView = lazy(() => import('../instruments/NeckView.tsx').then((m) => ({ default: m.NeckView })));
import { InstrumentSelector } from '../instruments/InstrumentSelector.tsx';
import { ViewSlot, type ViewLoader } from '../ViewSlot.tsx';
import { DetentSheet } from '../ui/DetentSheet.tsx';
import { Button, IconButton } from '../ui/Button.tsx';
import { useAppStore } from '../../state/store.ts';
import { useDockContextStore } from '../../state/dockContextStore.ts';
import type { Detent, DockView } from '../../state/dock.ts';
import { useMediaQuery, SHEET_QUERY } from '../../hooks/useMediaQuery.ts';

// The fretboard (with its chord-shape and position data) is its own chunk —
// piano users no longer download it with the entry file (audit W9-11). It is
// precached, so guitar works offline from the first install; ViewSlot gives
// it a spinner while it loads and a working "Try again" if a download fails.
// While the fretboard chunk loads, the dock keeps roughly the fretboard's own
// height (measured on the preview build: ~323 px at 1280×900, ~400 px at
// 390×844) instead of jumping piano → 20 px spinner → fretboard (review item
// 3; e2e/fretboard-fit.spec.ts checks the loading height in a real browser).
const GUITAR_LOADING_SIZE = 'max-md:min-h-[400px] md:min-h-[320px]';

const GUITAR_LOADER: Record<'guitar', ViewLoader> = {
  guitar: () => import('../instruments/Fretboard.tsx').then((m) => ({ default: m.Fretboard })),
};

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** "Position II · 1 octave" — what the instrument is showing, for the bar. */
function useContextLine(): string {
  const { t } = useTranslation();
  const instrument = useAppStore((s) => s.instrument);
  const exercise = useAppStore((s) => s.exerciseInputActive);
  const baseOctave = useAppStore((s) => s.baseOctave);
  const octaves = useAppStore((s) => s.scaleOctaves);
  const position = useDockContextStore((s) => s.guitarPosition);
  if (exercise) return t('dock.exerciseInput');
  const count = t('dock.octaves', { count: octaves });
  if (instrument === 'piano') return `C${baseOctave} · ${count}`;
  if (position === null) return '';
  if (position === 'all') return t('fretboard.allTitle');
  return position === 0 ? t('dock.openPosition') : t('dock.position', { numeral: ROMAN[position] ?? String(position) });
}

/**
 * The instrument dock (W11-A, D-26). On a phone it is a pull-up sheet with
 * detents Peek / Half / Full (DetentSheet); on a tablet or laptop it is a
 * docked panel that collapses to its bar. Either way the bar carries the
 * instrument switch, what the instrument shows, and Show / Hide; the detent
 * is remembered per view (Learn starts at Peek, D-20). Any code can open it
 * with `useAppStore.getState().requestDock('half')`.
 */
export function InstrumentDock({ view, available }: { view: DockView; available: number }) {
  const { t } = useTranslation();
  const instrument = useAppStore((s) => s.instrument);
  const detent = useAppStore((s) => s.dockDetents[view]);
  const setDockDetent = useAppStore((s) => s.setDockDetent);
  const isPhone = useMediaQuery(SHEET_QUERY);
  // Full leaves one toast's height (+ margins) above the sheet: a toast then
  // has room without covering the bar and without anything moving.
  const coarse = useMediaQuery('(pointer: coarse)');
  const fullGap = (coarse ? 44 : 36) + 32;
  const context = useContextLine();
  const open = detent !== 'peek';
  const setDetent = (d: Detent) => setDockDetent(view, d);
  // Laptop: the bar carries the fretboard's position stepper and label
  // toggle (DockToolsContext), so the guitar dock is one row shorter.
  const wideBar = useMediaQuery(DOCK_TOOLS_QUERY) && !isPhone;
  const [toolsSlot, setToolsSlot] = useState<HTMLElement | null>(null);
  // A phone held sideways with the guitar: the full-neck view (D-26 extra).
  const neckAvailable = useMediaQuery(NECK_QUERY) && instrument === 'guitar';
  const exercise = useAppStore((s) => s.exerciseInputActive);
  const [neckOpen, setNeckOpen] = useState(false);
  const showNeck = neckOpen && neckAvailable && !exercise;

  // Until the learner sets Explore's dock, it follows the screen: Peek when
  // short (a phone sideways), Half otherwise — also when the phone turns.
  const short = useMediaQuery(SHORT_SCREEN_QUERY);
  const exploreChosen = useAppStore((s) => s.dockChosen.explore);
  useEffect(() => {
    if (view !== 'explore' || exploreChosen) return;
    const want = defaultExploreDetent(short);
    const s = useAppStore.getState();
    if (s.dockDetents.explore !== want) useAppStore.setState({ dockDetents: { ...s.dockDetents, explore: want } });
  }, [short, exploreChosen, view]);

  const bar = (
    <div className="dock-bar-row">
      <InstrumentSelector />
      <DockReadout context={context} />
      {wideBar && instrument === 'guitar' && <div ref={setToolsSlot} className="dock-tools" data-testid="dock-tools" />}
      {neckAvailable && !exercise && (
        <IconButton
          variant="secondary"
          aria-label={t('neck.open')}
          aria-haspopup="dialog"
          data-testid="neck-open"
          onClick={() => setNeckOpen(true)}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>}
        />
      )}
      {/* On the phone sheet the button is icon-only (the bar is narrow and
          the context line needs the room — PT/ES "Esconder" ellipsized it);
          elsewhere it says Show / Hide. */}
      {isPhone ? (
        <IconButton
          variant="secondary"
          aria-expanded={open}
          aria-controls="instrument-region"
          aria-label={open ? t('nav.hideInstrument') : t('nav.showInstrument')}
          onClick={() => setDetent(open ? 'peek' : 'half')}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : undefined }}>
          <path d="M6 15l6-6 6 6" />
        </svg>}
        />
      ) : (
        <Button
          variant="secondary"
          aria-expanded={open}
          aria-controls="instrument-region"
          onClick={() => setDetent(open ? 'peek' : 'half')}
          endIcon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : undefined }}>
          <path d="M6 15l6-6 6 6" />
        </svg>}
        >
          {open ? t('dock.hide') : t('dock.show')}
        </Button>
      )}
    </div>
  );

  const region = (
    <div
      id="instrument-region"
      data-tour="play-note"
      role="region"
      aria-label={t('instrument.label', { name: t(`instrument.${instrument}`) })}
      // The guitar sizes to its content on every width: its position
      // controls can wrap to several rows, and a fixed 260 px dock hid the
      // high-E string below the fold (review blocker B1, W3). In the phone
      // sheet the sheet itself scrolls.
      className={
        isPhone
          ? 'h-auto'
          : instrument === 'guitar'
            ? 'h-auto overflow-visible'
            : 'md:h-[260px] md:overflow-y-auto max-md:h-auto max-md:overflow-visible'
      }
      style={{ backgroundColor: 'var(--bg)', overscrollBehavior: 'contain' }}
    >
      {instrument === 'piano' ? (
        <Piano />
      ) : showNeck ? null : (
        // While the full-neck view is open it owns the one fretboard (two
        // would both answer the [ ] position keys).
        <DockToolsContext.Provider value={wideBar ? toolsSlot : null}>
          <ViewSlot viewKey="guitar" loaders={GUITAR_LOADER} fallbackClassName={GUITAR_LOADING_SIZE} />
        </DockToolsContext.Provider>
      )}
    </div>
  );
  const neck = showNeck ? (
    <Suspense fallback={null}>
      <NeckView onClose={() => setNeckOpen(false)} />
    </Suspense>
  ) : null;

  if (isPhone) {
    return (
      <DetentSheet
        testId="instrument-dock"
        detent={detent}
        onDetent={setDetent}
        available={available}
        fullGap={fullGap}
        handleLabel={t('dock.handle')}
        detentLabels={{ peek: t('dock.peek'), half: t('dock.half'), full: t('dock.full') }}
        bar={bar}
      >
        {region}
        {neck}
      </DetentSheet>
    );
  }

  return (
    <section className="dock-panel" data-testid="instrument-dock" data-detent={detent}>
      <div className="dock-panel-bar">{bar}</div>
      {open && region}
      {neck}
    </section>
  );
}
