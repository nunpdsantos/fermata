import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { findModulesByQuery, MODULE_INDEX } from '../../data/moduleIndex.ts';
import { useAppStore } from '../../state/store.ts';
import { DEGREE_COLORS } from '../../design/tokens/colors.ts';
import { useDegreeColorsEnabled } from '../../hooks/useDegreeColors.ts';

interface LearnMoreButtonProps {
  /** Text to search the module index with, e.g. "Dorian", "Major Seventh" */
  query: string;
  /** Exact module to link to — wins over the fuzzy query when provided. */
  moduleId?: string;
}

/**
 * Deep-links from Explore detail panels into the matching Learn module, if
 * the curriculum has one. Renders nothing when no lesson covers the query.
 */
export function LearnMoreButton({ query, moduleId }: LearnMoreButtonProps) {
  const { t } = useTranslation();
  const match = useMemo(
    () =>
      (moduleId ? MODULE_INDEX.find((m) => m.id === moduleId) : undefined) ??
      findModulesByQuery(query, 1)[0] ??
      null,
    [query, moduleId],
  );
  const degreeColorsOn = useDegreeColorsEnabled();
  if (!match) return null;

  const color = degreeColorsOn ? DEGREE_COLORS[2] : 'var(--accent)';
  const bg = degreeColorsOn
    ? `${DEGREE_COLORS[2]}14`
    : 'color-mix(in srgb, var(--accent) 8%, transparent)';
  const borderColor = degreeColorsOn
    ? `${DEGREE_COLORS[2]}33`
    : 'color-mix(in srgb, var(--accent) 20%, transparent)';

  return (
    <button
      type="button"
      onClick={() => {
        useAppStore.setState({
          view: 'learn',
          pendingLearnTarget: {
            levelId: match.level,
            unitId: match.unitId,
            moduleId: match.id,
          },
        });
      }}
      className="mt-3 ml-2 inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full transition-colors"
      style={{ color, backgroundColor: bg, border: `1px solid ${borderColor}` }}
      title={match.title}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
      {t('panel.learnMore', { defaultValue: 'Learn about this' })}
    </button>
  );
}
