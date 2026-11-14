import { Suspense, lazy, useEffect, useState, type ComponentType } from 'react';
import i18n from '../../i18n/index.ts';
import { onOldAddress } from '../../services/appAddress.ts';
import {
  closeMovedPanel,
  offerMovedNotice,
  pauseMovedNotice,
  refreshMovedToast,
  useMovedPanel,
} from '../../services/movedNotice.ts';

type PanelProps = { open: boolean; onClose: () => void };

// The panel and its words are a lazy chunk (only the old address fetches it).
// A failed download closes it again — the toast comes back, so the learner can
// ask again — and the next open builds a fresh lazy() under a new key, so it
// really downloads again (Settings' pattern, TopBar.tsx).
let panelFailed = false;
const loadPanel = () => lazy<ComponentType<PanelProps>>(() =>
  import('./MovedPanel.tsx').catch(() => ({ default: PanelUnavailable })));
let MovedPanel = loadPanel();
function PanelUnavailable() {
  useEffect(() => {
    panelFailed = true;
    closeMovedPanel();
  }, []);
  return null;
}

/**
 * "We've moved" in the shell (AppShell, beside the one toast region), on the
 * old address only (services/appAddress.ts): offers the reminder when the
 * shell mounts (services/movedNotice.ts decides when it may show) and hosts
 * the moving panel its action opens. Anywhere else it renders nothing and
 * does nothing.
 */
export function MovedNoticeHost() {
  const [old] = useState(() => onOldAddress());
  const open = useMovedPanel((s) => s.open);
  const opened = useMovedPanel((s) => s.opened);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!old) return;
    offerMovedNotice();
    const onLanguage = () => refreshMovedToast();
    i18n.on('languageChanged', onLanguage);
    // Opening again after a failed download: a fresh lazy(), a new fiber.
    const unsubscribe = useMovedPanel.subscribe((s, prev) => {
      if (s.open && !prev.open && panelFailed) {
        panelFailed = false;
        MovedPanel = loadPanel();
        setAttempt((n) => n + 1);
      }
    });
    return () => {
      i18n.off('languageChanged', onLanguage);
      unsubscribe();
      pauseMovedNotice();
    };
  }, [old]);

  if (!old || !opened) return null;
  return (
    <Suspense fallback={null}>
      <MovedPanel key={attempt} open={open} onClose={closeMovedPanel} />
    </Suspense>
  );
}
