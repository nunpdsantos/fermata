import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import type { CurriculumModule, CurriculumUnit, CurriculumLevel } from '../../core/types/curriculum';
import { Card } from '../ui/Card';
import { accentText } from '../../design/tokens/learnColors';

interface ContinueBannerProps {
  module: CurriculumModule;
  unit: CurriculumUnit;
  level: CurriculumLevel;
  onClick: () => void;
}

export function ContinueBanner({ module, unit, level, onClick }: ContinueBannerProps) {
  const { t } = useTranslation();
  const accent = level.accentColor;

  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <Card
        variant="interactive"
        accentColor={accent}
        accentEdge="all"
        accentStrength="strong"
        onClick={onClick}
        padding="none"
        className="px-4 py-3.5 transition-all duration-200 group hover:scale-[1.005]"
      >
      <div className="flex items-center justify-between">
        <div>
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: accentText(accent) }}
          >
            {t('common.continue')}
          </span>
          <h3 className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text)' }}>
            {module.title}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
            {t('learn.level', { n: level.number })} &middot; {unit.title} &middot; {module.subtitle}
          </p>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={accent}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 group-hover:translate-x-0.5 transition-transform"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
      </Card>
    </m.div>
  );
}
