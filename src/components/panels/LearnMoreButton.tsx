import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { findModulesByQuery, MODULE_INDEX } from '../../data/moduleIndex.ts';
import { useAppStore } from '../../state/store.ts';
import { useLocalizedModuleIndex } from '../../hooks/useLocalizedModuleIndex.ts';

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
  const language = useAppStore((s) => s.language);
  const localized = useLocalizedModuleIndex(language);
  const match = useMemo(
    () =>
      (moduleId ? MODULE_INDEX.find((m) => m.id === moduleId) : undefined) ??
      findModulesByQuery(query, 1)[0] ??
      null,
    [query, moduleId],
  );
  if (!match) return null;

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
      // An accent-coloured quiet action (D-28 link button; was the
      // supertonic hue as text, ~2.4:1).
      // no-print: a link into the app means nothing on paper.
      className="btn btn-link -ml-1.5 no-print"
      // The lesson's title in the learner's language (no English tooltip in
      // PT/ES while the localized index is still loading).
      title={language === 'en' ? match.title : localized?.titles[match.id]?.[0]}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
      {t('panel.learnMore', { defaultValue: 'Learn about this' })}
    </button>
  );
}
