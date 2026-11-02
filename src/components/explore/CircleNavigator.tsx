import { useTranslation } from 'react-i18next';
import { CircleOfFifths } from '../theory/CircleOfFifths.tsx';
import { useAppStore } from '../../state/store.ts';
import { keyFacts } from './keyFacts.ts';

/** Signature, relative, dominant and subdominant keys of the selected key. */
export function KeyFactsList() {
  const { t } = useTranslation();
  const selectedKey = useAppStore((s) => s.selectedKey);
  const selectedScale = useAppStore((s) => s.selectedScale);
  const { facts } = keyFacts(selectedKey, selectedScale, t);
  return (
    <dl className="key-facts" data-testid="key-facts">
      {facts.map((f) => (
        <div key={f.id} className="key-fact">
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The circle of fifths as the NAVIGATOR (W11-B, D-30): tap a key to go there;
 * it shows the signature, the relative, dominant and subdominant keys, and
 * marks the selected chord's root. Beside the work on a laptop (≥ 1200 px),
 * below it on a tablet; on a phone it is the key picker (ExploreHeader).
 */
export function CircleNavigator() {
  const { t } = useTranslation();
  return (
    <section className="explore-card circle-card" aria-labelledby="circle-title" data-testid="circle-card">
      <div className="explore-card-head">
        <h2 id="circle-title" className="type-section">{t('explore.circleOfFifths')}</h2>
      </div>
      <CircleOfFifths />
      <KeyFactsList />
    </section>
  );
}
