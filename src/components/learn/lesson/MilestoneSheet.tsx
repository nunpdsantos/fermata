import { useTranslation } from 'react-i18next';
import type { CurriculumUnit } from '../../../core/types/curriculum';
import { Sheet } from '../../ui/Sheet';
import { Button } from '../../ui/Button';
import { InlineTryThis } from './InlineTryThis';

/**
 * The unit milestone (decision D-23, audit W9-25): shown once, at the moment
 * a unit's last lesson is completed — what the learner can do now, the bridge
 * to the next unit, and the milestone's Try This. Written and translated
 * content (curriculumL*.ts, the PT/ES overlays).
 */
export function MilestoneSheet({ unit, accent, onClose }: { unit: CurriculumUnit; accent: string; onClose: () => void }) {
  const { t } = useTranslation();
  const ms = unit.milestone;
  if (!ms) return null;
  return (
    <Sheet open onClose={onClose} title={t('lesson.unitComplete')} closeLabel={t('common.close')} testId="milestone-sheet">
      <div className="flex flex-col gap-4 pb-2" data-testid="milestone">
        <p className="learn-serif" style={{ color: 'var(--text)' }}>{unit.title}</p>
        <section className="flex flex-col gap-2">
          <h3 className="type-label">{t('lesson.skillsNow')}</h3>
          <ul className="flex flex-col gap-1.5">
            {ms.skillsSummary.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-body" style={{ color: 'var(--text)' }}>
                <span aria-hidden="true" className="text-success mt-0.5">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>
        {ms.bridgeText && <p className="text-body" style={{ color: 'var(--text-muted)' }}>{ms.bridgeText}</p>}
        <InlineTryThis query={ms.tryThisQuery} label={ms.tryThisLabel} prompt={ms.tryThisPrompt} accent={accent} compact />
        <Button variant="primary" block onClick={onClose}>{t('common.continue')}</Button>
      </div>
    </Sheet>
  );
}
