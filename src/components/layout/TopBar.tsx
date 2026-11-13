import { Suspense, lazy, useEffect, useRef, useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type ViewMode } from '../../state/store.ts';
import { Segment } from '../ui/Segment.tsx';
import { Button } from '../ui/Button.tsx';
import { Menu } from '../ui/Menu.tsx';
import { toast } from '../../state/toastStore.ts';
import { useMediaQuery } from '../../hooks/useMediaQuery.ts';
import { usePwaUpdateStore, applyUpdateOrReload } from '../../hooks/usePWA.ts';
import { requestDemo, useDemoRequest } from '../../state/demoRequest.ts';
import { resumeAudio } from '../../core/services/audio.ts';
import { TunerHost } from '../tuner/TunerHost.tsx';
import { openTuner, useTunerRequest } from '../tuner/tunerRequest.ts';
import { MicSwitch } from '../tuner/MicSwitch.tsx';
import { micOff, useMic } from '../../services/microphone/micSwitch.ts';
import { microphoneSupported } from '../../services/microphone/support.ts';
import { openReportForm, reportDetails, reportUrl } from '../../services/reportProblem.ts';

// Settings is a lazy chunk (wave 2 integration, for the entry file's budget):
// fetched the first time it is opened, then kept mounted (its close animation
// and focus return). A failed download says so once and leaves it closed; the
// NEXT open builds a fresh lazy() (React keeps a rejected one for good) and
// remounts it under a new key, so it really downloads again. (Building the
// fresh lazy() at once instead retried in the same open, and React then kept
// the failed fiber, so Settings never opened again: final review of wave 2.)
type SettingsProps = { open: boolean; onClose: () => void };
const loadSettings = () => lazy<ComponentType<SettingsProps>>(() =>
  import('./SettingsSheet.tsx').then((m) => ({ default: m.SettingsSheet })).catch(() => ({ default: SettingsUnavailable })));
let SettingsSheet = loadSettings();
let settingsFailed = false;
function SettingsUnavailable({ onClose }: SettingsProps) {
  const { t } = useTranslation();
  // Said once: this stays mounted until the next open, and a language change
  // (a new `t`) must not say it again (wave 3 final review).
  const said = useRef(false);
  useEffect(() => {
    if (said.current) return;
    said.current = true;
    settingsFailed = true;
    onClose();
    toast(t('settings.loadError'), 'error');
  }, [t, onClose]);
  return null;
}

// The metronome (wave 3, stream M) is a lazy chunk too: its bar, clock and
// words are fetched the first time "⋯" → "Metronome" is chosen, then kept
// mounted (a running metronome survives the bar's re-renders). A failed
// download says so once; the next choice builds a fresh lazy() under a new
// key, as Settings does.
type MetronomeProps = { open: boolean; onClose: () => void };
const loadMetronome = () => lazy<ComponentType<MetronomeProps>>(() =>
  import('../metronome/MetronomeHost.tsx').catch(() => ({ default: MetronomeUnavailable })));
let MetronomeHost = loadMetronome();
let metronomeFailed = false;
function MetronomeUnavailable({ onClose }: MetronomeProps) {
  const { t } = useTranslation();
  // Said once (as SettingsUnavailable): a language change does not repeat it.
  const said = useRef(false);
  useEffect(() => {
    if (said.current) return;
    said.current = true;
    metronomeFailed = true;
    onClose();
    toast(t('metronomeToolEntry.loadFailed'), 'error');
  }, [t, onClose]);
  return null;
}

const VIEWS: ViewMode[] = ['explore', 'learn', 'drill'];
const VIEW_KEYS: Record<ViewMode, string> = {
  explore: 'nav.explore',
  learn: 'nav.learn',
  drill: 'nav.drill',
};

const SEARCH_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
    <circle cx="11" cy="11" r="7" />
    <line x1="20" y1="20" x2="16" y2="16" />
  </svg>
);

/**
 * Top bar (W11-A, D-26/D-28): Fermata · Explore / Learn / Drill · search · "⋯".
 * The tabs are a Segment in tabs mode: the selected tab paints its own
 * highlight, so it can never sit misaligned after a font load, a resize, an
 * orientation change or a language change (the old sliding indicator was
 * measured once per view change and drifted). Language, theme and backup
 * moved from here into Settings ("⋯" → Settings).
 */
export function TopBar() {
  const { t, i18n } = useTranslation();
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Mounted from the first open on (the sheet animates out and returns focus).
  const [settingsMounted, setSettingsMounted] = useState(false);
  // Bumped when a failed download is tried again: a new fiber for the fresh lazy().
  const [settingsAttempt, setSettingsAttempt] = useState(0);
  const openSettings = () => {
    if (settingsFailed) {
      settingsFailed = false;
      SettingsSheet = loadSettings();
      setSettingsAttempt((n) => n + 1);
    }
    setSettingsMounted(true);
    setSettingsOpen(true);
  };
  const [closeSettings] = useState(() => () => setSettingsOpen(false));
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  // Mounted from the first open on (a running metronome lives in it).
  const [metronomeMounted, setMetronomeMounted] = useState(false);
  const [metronomeAttempt, setMetronomeAttempt] = useState(0);
  const openMetronome = () => {
    if (metronomeFailed) {
      metronomeFailed = false;
      MetronomeHost = loadMetronome();
      setMetronomeAttempt((n) => n + 1);
    }
    setMetronomeMounted(true);
    setMetronomeOpen(true);
    // Already open: back to its ▶.
    document.querySelector<HTMLElement>('[data-testid="metronome-play"]')?.focus({ preventScroll: true });
  };
  const [closeMetronome] = useState(() => () => setMetronomeOpen(false));
  // Where its bar is never shown (Drill, the tour playing) the menu does not offer it.
  const tourPlaying = useDemoRequest() !== null;
  const offerMetronome = view !== 'drill' && !tourPlaying;
  // The tuner (a sheet, not tied to a view) is offered in Drill too, but not
  // while the tour plays: the tour drives the screen and sounds, and a modal
  // sheet listening to it would stand between the tour and what it shows
  // (wave 3 integration).
  const offerTuner = !tourPlaying;
  // The microphone switch (brief U): where a note played can be used — Explore,
  // and a check answered on the instrument — never while the tour plays (the
  // tour turns it off: nothing it shows can use a played note).
  const checkOpen = useMic((s) => s.check);
  const offerMic = !tourPlaying && (view === 'explore' || checkOpen);
  // Its sentences show under the bar only where no other switch carries them (inline in a check, at the tuner's top).
  const tunerOpen = useTunerRequest((s) => s.open);
  // The tabs never move between views (brief U2). The switch is offered only
  // where a played note can be used, so the bar keeps its place by width:
  // - below 360 px the three tabs need the room: search lives in "⋯" (as on
  //   main), and where the switch is not offered an empty slot of its width
  //   stands in its place;
  // - 360–639 px: where the switch is offered it takes the magnifier's place
  //   and Search is the first item of "⋯"; elsewhere the bar is main's;
  // - 640–1023 px: the slot again (the right column is full there, so the
  //   square moves the centred tabs: now it does so in every view alike);
  // - from 1024 px the right column has room: no slot (measured, nothing moves).
  // Where no microphone can work there is no switch, no slot and no swap.
  const [micWorks] = useState(microphoneSupported);
  const micShown = micWorks && offerMic;
  const tiny = useMediaQuery('(max-width: 359px)');
  const phone = useMediaQuery('(max-width: 639px)');
  const tablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const narrow = tiny || (micShown && phone);
  const micSlot = micWorks && !offerMic && (tiny || tablet);
  const updateReady = usePwaUpdateStore((s) => s.needRefresh);
  // Put off with "Later": a dot on "⋯" says an update is waiting in there.
  const updateDeferred = usePwaUpdateStore((s) => s.needRefresh && s.updateDeferred);
  const openSearch = () => useAppStore.getState().setQuickSearchOpen(true);
  // The tour plays sound: resume the audio inside this tap, then ask for it.
  // The microphone goes off (nothing the tour shows can use a played note).
  const showMeAround = () => {
    micOff();
    void resumeAudio().catch(() => undefined);
    requestDemo('intro', 'menu');
  };
  // "Report a problem" (2026-11-12): the form in the learner's language, in a
  // new tab, its details box saying where they were. Built at the tap; nothing
  // is sent before it. Not while the tour plays (the tour drives the screen).
  const offerReport = !tourPlaying;
  const reportProblem = () => {
    const language = i18n.language;
    openReportForm(reportUrl(language, reportDetails({ view, language })), t('report.offline'));
  };

  return (
    <header className="app-topbar" data-testid="app-topbar">
      <div className="flex items-center gap-2 min-w-0">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" className="shrink-0 app-mark" aria-hidden="true">
          <path d="M4 14 A 8 8 0 0 1 20 14" />
          <circle cx="12" cy="16" r="1.8" fill="var(--accent)" />
        </svg>
        <span className="app-brand max-sm:sr-only">{t('nav.musicTheory')}</span>
      </div>

      <Segment
        mode="tabs"
        label={t('nav.appViews')}
        value={view}
        onChange={setView}
        className="app-tabs"
        options={VIEWS.map((v) => ({
          value: v,
          label: t(VIEW_KEYS[v]),
          id: `tab-${v}`,
          controls: `${v}-panel`,
          data: { 'data-tab': v },
        }))}
      />

      <div className="flex items-center gap-1 justify-end">
        {micShown && <MicSwitch place="bar" note={!checkOpen && !tunerOpen} />}
        {/* The switch's place, kept where it is not offered: empty, inert, unseen by screen readers. */}
        {micSlot && <span className="mic-slot" aria-hidden="true" data-testid="mic-slot" />}
        {/* One search button: icon only (a --tap square) on phones. */}
        {!narrow && (
          <Button
            variant="quiet"
            className="max-sm:w-(--tap) max-sm:px-0"
            onClick={openSearch}
            aria-label={t('nav.quickSearchLabel')}
            startIcon={SEARCH_ICON}
          >
            <span className="max-sm:hidden">{t('nav.search')}</span>
            <kbd className="text-caption px-1 rounded max-sm:hidden" style={{ color: 'var(--text-dim)', backgroundColor: 'var(--bg-raised)', border: '1px solid var(--border-subtle)' }} aria-hidden="true">
              ⌘K
            </kbd>
          </Button>
        )}
        <Menu
          label={t('nav.more')}
          testId="app-menu"
          badge={updateDeferred}
          buttonLabel={updateDeferred ? t('nav.moreUpdateReady') : undefined}
          items={[
            ...(narrow ? [{ id: 'search', label: t('nav.search'), onSelect: openSearch }] : []),
            { id: 'settings', label: t('settings.title'), onSelect: openSettings },
            { id: 'show-me', label: t('showMe.menuItem'), onSelect: showMeAround },
            ...(offerTuner ? [{ id: 'tuner', label: t('tunerEntry.menuItem'), onSelect: openTuner }] : []),
            ...(offerMetronome ? [{ id: 'metronome', label: t('metronomeToolEntry.menuItem'), onSelect: openMetronome }] : []),
            ...(offerReport ? [{ id: 'report', label: t('report.menuItem'), onSelect: reportProblem }] : []),
            // A waiting update stays one tap away after "Later" (until the reload).
            ...(updateReady ? [{ id: 'update', label: t('pwa.updateReady'), onSelect: () => void applyUpdateOrReload() }] : []),
          ]}
        />
      </div>
      <TunerHost />
      {settingsMounted && (
        <Suspense fallback={null}>
          <SettingsSheet key={settingsAttempt} open={settingsOpen} onClose={closeSettings} />
        </Suspense>
      )}
      {metronomeMounted && (
        <Suspense fallback={null}>
          <MetronomeHost key={metronomeAttempt} open={metronomeOpen} onClose={closeMetronome} />
        </Suspense>
      )}
    </header>
  );
}
