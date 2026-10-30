import { useTranslation } from 'react-i18next';
import type { CurriculumModule } from '../../core/types/curriculum';

interface ModuleRowProps {
  module: CurriculumModule;
  index: number;
  isCompleted: boolean;
  isLocked: boolean;
  isComingSoon?: boolean;
  accentColor: string;
  onClick: () => void;
}

export function ModuleRow({ module, index, isCompleted, isLocked, isComingSoon, accentColor: _accentColor, onClick }: ModuleRowProps) {
  const { t } = useTranslation();
  const disabled = isComingSoon; // Only truly disable coming-soon modules; locked ones are browsable

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-150 group ${
        disabled
          ? 'opacity-50 cursor-default'
          : isLocked
            ? 'opacity-70 hover:bg-white/[0.04]'
            : 'hover:bg-white/[0.04]'
      }`}
    >
      <span
        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
          isCompleted
            ? 'bg-emerald-500/20 text-success'
            : ''
        }`}
        style={!isCompleted ? { backgroundColor: 'var(--card-hover)', color: 'var(--text-dim)' } : undefined}
      >
        {isCompleted ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : isLocked ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ) : (
          index + 1
        )}
      </span>

      <div className="flex-1 min-w-0">
        <span
          className="text-xs font-medium block truncate transition-colors"
          style={{ color: isCompleted || disabled ? 'var(--text-dim)' : 'var(--text-muted)' }}
        >
          {module.title}
        </span>
        <span className="text-[11px] block truncate" style={{ color: 'var(--text-dim)' }}>
          {module.subtitle}
        </span>
      </div>

      {isComingSoon && (
        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0" style={{ color: 'var(--text-dim)', backgroundColor: 'var(--card-hover)' }}>
          {t('learn.soon')}
        </span>
      )}

      {!isComingSoon && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 group-hover:translate-x-0.5 transition-all"
          style={{ color: 'var(--border)' }}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </button>
  );
}
