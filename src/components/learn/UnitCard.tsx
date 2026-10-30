import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { CurriculumUnit } from '../../core/types/curriculum';
import { ProgressBar } from './ProgressBar';
import { Card } from '../ui/Card';

interface UnitCardProps {
  unit: CurriculumUnit;
  index: number;
  completedCount: number;
  accentColor: string;
  isComplete: boolean;
  onClick: () => void;
}

export function UnitCard({ unit, index, completedCount, accentColor, isComplete, onClick }: UnitCardProps) {
  const { t } = useTranslation();
  const totalModules = unit.modules.length;
  const progressPercent = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="relative pl-10 max-sm:pl-8"
    >
      {/* Node on the vertical line */}
      <div
        className={`absolute left-[11px] max-sm:left-[7px] top-5 w-[17px] h-[17px] rounded-full border-2 flex items-center justify-center z-10 ${
          isComplete ? '' : ''
        }`}
        style={{
          borderColor: accentColor,
          backgroundColor: isComplete ? accentColor : 'var(--bg)',
        }}
      >
        {isComplete && (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      <Card
        variant="interactive"
        accentColor={accentColor}
        accentEdge="all"
        padding="none"
        onClick={onClick}
        className="overflow-hidden group hover:scale-[1.002]"
      >
        <div className="px-4 py-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                  {t('learn.unit', { n: index + 1 })}
                </span>
                {isComplete && (
                  <span className="text-[10px] font-medium text-success bg-emerald-400/10 px-1.5 py-0.5 rounded-full">
                    {t('status.complete')}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text)' }}>
                {unit.title}
              </h3>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 mt-1 group-hover:translate-x-0.5 transition-all"
              style={{ color: 'var(--border)' }}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>

          <p className="text-xs mb-3" style={{ color: 'var(--text-dim)' }}>
            {unit.description}
          </p>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
              {t('learn.moduleCount', { count: totalModules })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <ProgressBar percent={progressPercent} color={accentColor} height={4} delay={index * 0.08} />
            </div>
            <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-dim)' }}>
              {completedCount}/{totalModules}
            </span>
          </div>
        </div>
      </Card>
    </m.div>
  );
}
