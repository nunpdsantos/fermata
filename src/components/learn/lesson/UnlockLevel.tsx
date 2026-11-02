import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CurriculumLevel, CurriculumProgress } from '../../../core/types/curriculum';
import { LEVEL_METADATA, computeLevelStateMeta } from '../../../data/curriculumLoader';
import { translateLevelMetadata } from '../../../i18n/content/levelMetaResolver';
import type { ContentLanguage } from '../../../i18n/content/types';
import { useProgressStore } from '../../../state/progressStore';
import { toast } from '../../../state/toastStore';
import { Sheet } from '../../ui/Sheet';
import { Button } from '../../ui/Button';

/**
 * A locked level's notice with "Unlock anyway" (decision D-10, audit W9-21):
 * levels stay in order by default, but an experienced learner can open one
 * early. The dialog says what it skips — the previous level, by its title and
 * description — and that nothing is lost; the choice is saved in progress
 * (`unlockedLevels`).
 */
export function UnlockLevelNotice({ level, progress }: { level: CurriculumLevel; progress: CurriculumProgress }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const meta = LEVEL_METADATA.find((m) => m.id === level.id);
  if (!meta) return null;
  const state = computeLevelStateMeta(meta, LEVEL_METADATA, progress.completedModules, progress.unlockedLevels);
  const early = progress.unlockedLevels?.includes(level.id) ?? false;
  if (state !== 'locked' && !early) return null;
  const lang = ((i18n.language || 'en').slice(0, 2)) as ContentLanguage;
  const prevMeta = LEVEL_METADATA.find((m) => m.id === meta.prerequisites[0]);
  const prev = prevMeta ? translateLevelMetadata([prevMeta], lang)[0] : null;

  if (early && state !== 'locked') {
    return (
      <p className="mb-6 text-ui" style={{ color: 'var(--text-muted)' }} data-testid="unlocked-early">
        {t('lesson.unlockedAnyway')}
      </p>
    );
  }

  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border-subtle)' }} data-testid="locked-level">
      <p className="text-ui" style={{ color: 'var(--text)' }}>
        {t('lesson.lockedNote', { n: prev?.number ?? '' })}
      </p>
      <Button variant="secondary" onClick={() => setOpen(true)} aria-haspopup="dialog">
        {t('lesson.unlockAnyway')}
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} title={t('lesson.unlockTitle', { n: level.number })} closeLabel={t('common.close')} testId="unlock-dialog">
        <div className="flex flex-col gap-3 pb-2">
          {prev && (
            <p className="text-body" style={{ color: 'var(--text)' }}>
              {t('lesson.unlockSkips', { n: level.number, prev: prev.number, prevTitle: prev.title, prevDescription: prev.description })}
            </p>
          )}
          <p className="text-ui" style={{ color: 'var(--text-muted)' }}>{t('lesson.unlockAssumes', { prev: prev?.number ?? '' })}</p>
          <div className="flex flex-wrap gap-2 max-sm:flex-col">
            <Button
              variant="primary"
              className="max-sm:w-full"
              onClick={() => {
                useProgressStore.getState().unlockLevel(level.id);
                setOpen(false);
                toast(t('toast.levelUnlocked', { n: level.number }), 'success');
              }}
            >
              {t('lesson.unlockConfirm', { n: level.number })}
            </Button>
            <Button variant="quiet" className="max-sm:w-full" onClick={() => setOpen(false)}>
              {t('lesson.cancel')}
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
