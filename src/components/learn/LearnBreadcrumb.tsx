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

export function LearnBreadcrumb({ segments, accentColor }: LearnBreadcrumbProps) {
  const { t } = useTranslation();
  return (
    <nav className="flex items-center gap-1.5 text-xs" aria-label={t('learn.breadcrumb')}>
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span style={{ color: 'var(--border)' }}>/</span>}
            {isLast ? (
              <span style={{ color: accentText(accentColor) }}>{seg.label}</span>
            ) : seg.onClick ? (
              <button
                onClick={seg.onClick}
                className="transition-colors"
                style={{ color: 'var(--text-dim)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; }}
              >
                {seg.label}
              </button>
            ) : (
              <span style={{ color: 'var(--text-dim)' }}>{seg.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
