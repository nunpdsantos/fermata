import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../state/store.ts';
import { useShownStartHint, dismissStartHint, startHintLesson, followStartHintLesson } from '../../state/startHint.ts';
import { IconButton } from '../ui/Button.tsx';

/** Explore's key picker: the Root select on a laptop, the key button on a phone. */
const keyPicker = () => document.querySelector<HTMLElement>('[data-testid="explore-header"] [data-testid="key-picker"]');
/** How long a ✕ made while Explore is still loading waits for the picker to appear. */
const PICKER_WAIT_MS = 10_000;

/**
 * ✕: the hint goes, and focus goes to the first control under where it was,
 * Explore's key picker — not to <body> (the seat's decision, 2026-11-10).
 * The hint is removed first, so the picker is focused (and, if need be,
 * scrolled to) where it now sits. The hint shows from the shell, so it can
 * be dismissed while Explore's code is still arriving: then the picker is
 * focused when it appears, unless focus has been put somewhere meanwhile.
 * A chord picked ends the hint too, without this: focus is on the chord.
 */
function dismissToKeyPicker() {
  flushSync(dismissStartHint);
  const now = keyPicker();
  if (now) {
    now.focus();
    return;
  }
  const stop = () => {
    observer.disconnect();
    window.clearTimeout(timer);
  };
  const observer = new MutationObserver(() => {
    const picker = keyPicker();
    if (!picker) return;
    stop();
    if (!document.activeElement || document.activeElement === document.body) picker.focus();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  const timer = window.setTimeout(stop, PICKER_WAIT_MS);
}

/**
 * The start hint (state/startHint.ts): one line under the top bar, in the
 * page flow, Explore only. In the flow it covers nothing (not the
 * instrument, not the chord row); it is rendered with Explore's first paint
 * after a door (and on every reload while owed), so nothing moves when it
 * shows — only the learner's own ✕ or action takes it away. One action, ✕,
 * for both kinds; a chord picked is the other way it ends (state/startHint.ts).
 * Wave 2: the 'player' hint ends on one link, "Theory from the chords you
 * know: lesson 1 →", shown only once that lesson exists (decided from eager
 * data, so the line is whole from its first paint). The 'new' hint has no
 * link: its door already opened lesson 1 of "Start with sound".
 */
export function StartHint() {
  const { t } = useTranslation();
  const shown = useShownStartHint();
  const view = useAppStore((s) => s.view);
  const guitar = useAppStore((s) => s.instrument === 'guitar');
  if (!shown || view !== 'explore') return null;
  const lesson = startHintLesson(shown);
  return (
    <aside className="start-hint no-print" aria-label={t('start.hint.label')} data-testid="start-hint" data-hint={shown}>
      <p className="start-hint-text">
        {shown === 'new' ? t(guitar ? 'start.hint.newGuitar' : 'start.hint.newPiano') : t('start.hint.player')}
        {lesson && (
          <>
            {' '}
            <button
              type="button"
              className="start-hint-link"
              onClick={() => followStartHintLesson()}
              data-testid="start-hint-lesson"
              style={{ color: 'var(--accent-text)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }}
            >
              {t('start.hint.playerLesson')}
            </button>
          </>
        )}
      </p>
      <IconButton
        aria-label={t('start.hint.dismiss')}
        onClick={dismissToKeyPicker}
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
