import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../state/store.ts';
import { Button } from '../ui/Button.tsx';
import { flippedNeck, useNeckOrientation } from './neckOrientation.ts';

/** Settings' words start a sentence; inside the button's name they follow "Now:". */
const lowerFirst = (s: string, lang: string) => s.charAt(0).toLocaleLowerCase(lang) + s.slice(1);

/**
 * "⇄ Flip neck" on the guitar itself (2026-11-14), right after "Edit
 * fingering" (before the tuning where that chip is not shown), so a first-time
 * player can turn the neck without opening Settings. It mirrors BOTH of
 * Settings' controls at once through the store's own setters (timestamped and
 * saved exactly as Settings saves them). Its name says what it does and what
 * is drawn now, in the words Settings uses ("Flip neck. Now: nut on the right,
 * thick string on top."); its tooltip is the word alone. The word shows where
 * it costs no height (index.css, `.flip-neck`): beside "Edit fingering" below
 * 440 px wide, and everywhere from 1280 px; elsewhere the glyph stands alone in
 * a --tap square (tooltip and name unchanged). `place` says which of the two
 * spots in the controls row it is in.
 */
export function FlipNeckButton({ place }: { place: 'after-edit' | 'before-tuning' }) {
  const { t, i18n } = useTranslation();
  const orientation = useNeckOrientation();
  const setNeckNutSide = useAppStore((s) => s.setNeckNutSide);
  const setNeckTopString = useAppStore((s) => s.setNeckTopString);
  const lang = i18n.language;
  const name = t('neckView.flipName', {
    action: t('neckView.flip'),
    nut: lowerFirst(t(orientation.nut === 'left' ? 'neckView.nutLeft' : 'neckView.nutRight'), lang),
    top: lowerFirst(t(orientation.top === 'high' ? 'neckView.thinTop' : 'neckView.thickTop'), lang),
  });
  return (
    <Button
      className="flip-neck"
      data-testid="flip-neck"
      data-place={place}
      aria-label={name}
      title={t('neckView.flip')}
      onClick={() => {
        // The store's live values: two quick taps flip twice.
        const { neckNutSide, neckTopString } = useAppStore.getState();
        const next = flippedNeck({ nut: neckNutSide, top: neckTopString });
        setNeckNutSide(next.nut);
        setNeckTopString(next.top);
      }}
    >
      <span aria-hidden="true" className="flip-neck-glyph">⇄</span>
      <span className="flip-neck-word">{t('neckView.flip')}</span>
    </Button>
  );
}
