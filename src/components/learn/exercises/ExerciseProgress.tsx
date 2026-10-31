import { useTranslation } from 'react-i18next';

interface ExerciseProgressProps {
  current: number;
  total: number;
  score: number;
  accentColor: string;
}

export function ExerciseProgress({ current, total, score, accentColor }: ExerciseProgressProps) {
  const { t } = useTranslation();
  const pct = total > 0 ? ((current) / total) * 100 : 0;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--card-hover)' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%`, backgroundColor: accentColor }}
          />
        </div>
        <span className="text-caption shrink-0 tabular-nums" style={{ color: 'var(--text-dim)' }}>
          {current}/{total}
        </span>
      </div>
      <span className="text-caption ml-4 shrink-0 tabular-nums" style={{ color: 'var(--text-dim)' }}>
        {t('exercise.score', { score: score % 1 === 0 ? score : score.toFixed(1), total })}
      </span>
    </div>
  );
}
