import { useTranslation } from 'react-i18next';
import { Sheet } from '../ui/Sheet.tsx';
import { Button } from '../ui/Button.tsx';
import { closeWelcome } from '../../state/welcomeGate.ts';
import { useAppStore, type ViewMode } from '../../state/store.ts';

const VIEWS: { view: ViewMode; name: string; body: string }[] = [
  { view: 'explore', name: 'nav.explore', body: 'welcome.explore' },
  { view: 'learn', name: 'nav.learn', body: 'welcome.learn' },
  { view: 'drill', name: 'nav.drill', body: 'welcome.drill' },
];

/**
 * The first-visit welcome (lazy chunk; WelcomeHost mounts it): what the three
 * views are, in one screen — no tour. ✕, Escape, the scrim or a drag close it
 * and it stays on the view it opened over; the actions close it and go to a
 * view. Either way it never returns (closeWelcome).
 */
export default function WelcomeSheet() {
  const { t } = useTranslation();
  const go = (view: ViewMode) => {
    closeWelcome();
    const app = useAppStore.getState();
    if (app.view !== view) app.setView(view);
  };

  return (
    <Sheet
      open
      onClose={() => closeWelcome()}
      title={t('welcome.title')}
      closeLabel={t('common.close')}
      testId="welcome-sheet"
      actions={
        <div className="welcome-actions">
          <Button variant="primary" onClick={() => go('explore')} data-testid="welcome-explore">{t('welcome.exploreAction')}</Button>
          <Button variant="secondary" onClick={() => go('learn')} data-testid="welcome-learn">{t('welcome.learnAction')}</Button>
          <Button variant="secondary" onClick={() => go('drill')} data-testid="welcome-drill">{t('welcome.drillAction')}</Button>
        </div>
      }
    >
      <dl className="welcome-views">
        {VIEWS.map(({ view, name, body }) => (
          <div key={view}>
            <dt className="type-label" style={{ color: 'var(--text)' }}>{t(name)}</dt>
            <dd className="text-body" style={{ color: 'var(--text)' }}>{t(body)}</dd>
          </div>
        ))}
      </dl>
      <p className="welcome-footer text-ui" style={{ color: 'var(--text-muted)' }}>{t('welcome.footer')}</p>
    </Sheet>
  );
}
