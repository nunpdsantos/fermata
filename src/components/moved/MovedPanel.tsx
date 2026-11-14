import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Sheet } from '../ui/Sheet.tsx';
import { Button } from '../ui/Button.tsx';
import { toast } from '../../state/toastStore.ts';
import { downloadBackup } from '../../utils/backupFile.ts';
import { noteMovedExport, stopMovedReminder } from '../../services/movedNotice.ts';
import { AddressLink } from './AddressLink.tsx';
// The panel's words load with it (the `moved` namespace), not with the entry.
import '../../i18n/moved/index.ts';

/**
 * The moving panel (2026-11-14), opened by the old address's toast
 * (services/movedNotice.ts): why the progress does not follow by itself, the
 * three steps — export here (the same export, and the same file, as Settings
 * → Your data → Export), open fermatina.com (a real link, a new tab), import
 * there — and "Don't remind me again". A lazy chunk: only the old address
 * ever downloads it.
 */
/** The top bar's "⋯" button: Settings, where the moved line stays, is behind it. */
const moreButton = () => document.querySelector<HTMLElement>('[data-testid="app-menu"] button[aria-haspopup="menu"]');

export default function MovedPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const exportNow = () => {
    downloadBackup(localStorage);
    toast(t('backup.exported'), 'success');
    noteMovedExport();
  };
  // "Don't remind me again": the panel closes (synchronously, so the sheet has
  // let go of focus) and focus goes to "⋯" — never to <body>: the toast's
  // button, which opened the panel and where focus would return, is gone.
  const stop = () => {
    flushSync(stopMovedReminder);
    moreButton()?.focus();
  };
  return (
    <Sheet open={open} onClose={onClose} title={t('moved.title')} closeLabel={t('common.close')} testId="moved-panel">
      <div className="moved-body">
        <p>{t('moved.intro')}</p>
        <ol className="moved-steps">
          <li>
            <p>{t('moved.step1')}</p>
            <Button variant="primary" onClick={exportNow} data-testid="moved-export">{t('moved.export')}</Button>
          </li>
          <li>
            <p><AddressLink text={t('moved.step2')} testId="moved-link" /></p>
          </li>
          <li>
            <p>{t('moved.step3')}</p>
          </li>
        </ol>
        <p>{t('moved.nothingSaved')}</p>
        <p>{t('moved.keepsWorking')}</p>
        <div>
          <Button variant="quiet" onClick={stop} data-testid="moved-stop">{t('moved.stop')}</Button>
        </div>
      </div>
    </Sheet>
  );
}
