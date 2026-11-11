import { Suspense, lazy, useEffect, useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type ViewMode } from '../../state/store.ts';
import { Segment } from '../ui/Segment.tsx';
import { Button } from '../ui/Button.tsx';
import { Menu } from '../ui/Menu.tsx';
import { toast } from '../../state/toastStore.ts';
import { useMediaQuery } from '../../hooks/useMediaQuery.ts';
import { usePwaUpdateStore, applyUpdateOrReload } from '../../hooks/usePWA.ts';
import { requestDemo } from '../../state/demoRequest.ts';
import { resumeAudio } from '../../core/services/audio.ts';

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
  useEffect(() => {
    settingsFailed = true;
    onClose();
    toast(t('settings.loadError'), 'error');
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
  const { t } = useTranslation();
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
  // Below 360 px the three tabs need the room: search moves into the menu.
  const narrow = useMediaQuery('(max-width: 359px)');
  const updateReady = usePwaUpdateStore((s) => s.needRefresh);
  // Put off with "Later": a dot on "⋯" says an update is waiting in there.
  const updateDeferred = usePwaUpdateStore((s) => s.needRefresh && s.updateDeferred);
  const openSearch = () => useAppStore.getState().setQuickSearchOpen(true);
  // The tour plays sound: resume the audio inside this tap, then ask for it.
  const showMeAround = () => {
    void resumeAudio().catch(() => undefined);
    requestDemo('intro', 'menu');
  };

  return (
    <header className="app-topbar" data-testid="app-topbar">
      <div className="flex items-center gap-2 min-w-0">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" className="shrink-0" aria-hidden="true">
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
            // A waiting update stays one tap away after "Later" (until the reload).
            ...(updateReady ? [{ id: 'update', label: t('pwa.updateReady'), onSelect: () => void applyUpdateOrReload() }] : []),
          ]}
        />
      </div>
      {settingsMounted && (
        <Suspense fallback={null}>
          <SettingsSheet key={settingsAttempt} open={settingsOpen} onClose={closeSettings} />
        </Suspense>
      )}
    </header>
  );
}
