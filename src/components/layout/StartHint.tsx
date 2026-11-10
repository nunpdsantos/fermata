import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../state/store.ts';
import { useShownStartHint, dismissStartHint } from '../../state/startHint.ts';
import { IconButton } from '../ui/Button.tsx';

/**
 * The start hint (state/startHint.ts): one line under the top bar, in the
 * page flow, Explore only. In the flow it covers nothing (not the
 * instrument, not the chord row); it is rendered with Explore's first paint
 * after a door (and on every reload while owed), so nothing moves when it
 * shows — only the learner's own ✕ or action takes it away. One action, ✕,
 * for both kinds; a chord picked is the other way it ends (state/startHint.ts).
 * No link into Learn: "Start lesson 1 →" left at the owner's decision of
 * 2026-11-10 and returns in wave 2 with a sound-first first lesson.
 */
export function StartHint() {
  const { t } = useTranslation();
  const shown = useShownStartHint();
  const view = useAppStore((s) => s.view);
  const guitar = useAppStore((s) => s.instrument === 'guitar');
  if (!shown || view !== 'explore') return null;
  return (
    <aside className="start-hint no-print" aria-label={t('start.hint.label')} data-testid="start-hint" data-hint={shown}>
      <p className="start-hint-text">
        {shown === 'new' ? t(guitar ? 'start.hint.newGuitar' : 'start.hint.newPiano') : t('start.hint.player')}
      </p>
      <IconButton
        aria-label={t('start.hint.dismiss')}
        onClick={dismissStartHint}
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        }
      />
    </aside>
  );
}
