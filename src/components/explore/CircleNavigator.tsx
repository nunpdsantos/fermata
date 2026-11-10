import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleOfFifths } from '../theory/CircleOfFifths.tsx';
import { useAppStore } from '../../state/store.ts';
import { keyFacts } from './keyFacts.ts';
import { useNoteLabel } from '../../hooks/useSolfege.ts';

/**
 * Signature, relative, dominant and subdominant keys of the selected key.
 * `fixedDo` = false: no "B (Si)" here even with the setting on (the laptop's
 * narrow aside column would wrap every value onto a second line).
 */
export function KeyFactsList({ fixedDo = true }: { fixedDo?: boolean }) {
  const { t } = useTranslation();
  const selectedKey = useAppStore((s) => s.selectedKey);
  const selectedScale = useAppStore((s) => s.selectedScale);
  const noteLabel = useNoteLabel();
  const { facts } = keyFacts(selectedKey, selectedScale, t, fixedDo ? noteLabel : undefined);
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
 * below it on a tablet — there `collapsible`: its heading is a disclosure
 * button and the choice is remembered (exploreCircleOpen), so the tablet
 * column need not be a long scroll; on a phone it is the key picker.
 */
export function CircleNavigator({ collapsible = false }: { collapsible?: boolean }) {
  const { t } = useTranslation();
  const storedOpen = useAppStore((s) => s.exploreCircleOpen);
  const setOpen = useAppStore((s) => s.setExploreCircleOpen);
  const open = !collapsible || storedOpen;
  const bodyId = useId();
  return (
    <section className="explore-card circle-card" aria-labelledby="circle-title" data-testid="circle-card" data-open={open || undefined}>
      <div className="explore-card-head">
        {collapsible ? (
          <h2 className="type-section">
            <button
              type="button"
              id="circle-title"
              className="circle-toggle"
              aria-expanded={open}
              aria-controls={bodyId}
              onClick={() => setOpen(!open)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: open ? 'rotate(90deg)' : undefined }}>
                <path d="M9 6l6 6-6 6" />
              </svg>
              {t('explore.circleOfFifths')}
            </button>
          </h2>
        ) : (
          <h2 id="circle-title" className="type-section">{t('explore.circleOfFifths')}</h2>
        )}
      </div>
      {/* Folded = hidden, not unmounted: a printed page still carries the
          circle and the key facts. */}
      <div id={bodyId} className="circle-body" data-folded={!open || undefined}>
        <CircleOfFifths signatureInFacts />
        <KeyFactsList fixedDo={collapsible} />
      </div>
    </section>
  );
}
