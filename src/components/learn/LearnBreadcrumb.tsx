import { useTranslation } from 'react-i18next';
import { accentText } from '../../design/tokens/learnColors';

interface BreadcrumbSegment {
  label: string;
  onClick?: () => void;
}

interface LearnBreadcrumbProps {
  segments: BreadcrumbSegment[];
  accentColor: string;
}

/**
 * Learn › Level › Unit. The links are --tap tall (W9-04: they were 15 px),
 * the separators are decorative, and the current page is marked for
 * assistive tech.
 */
export function LearnBreadcrumb({ segments, accentColor }: LearnBreadcrumbProps) {
  const { t } = useTranslation();
  return (
    <nav className="flex items-center flex-wrap gap-x-0.5 text-ui min-w-0" aria-label={t('learn.breadcrumb')}>
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <span key={i} className="flex items-center gap-0.5 min-w-0">
            {i > 0 && <span aria-hidden="true" style={{ color: 'var(--text-dim)' }}>/</span>}
            {isLast ? (
              <span aria-current="page" className="px-1.5" style={{ color: accentText(accentColor) }}>{seg.label}</span>
            ) : seg.onClick ? (
              <button type="button" onClick={seg.onClick} className="btn btn-quiet px-1.5" style={{ fontWeight: 500 }}>
                {seg.label}
              </button>
            ) : (
              <span className="px-1.5" style={{ color: 'var(--text-dim)' }}>{seg.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
