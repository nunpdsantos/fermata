import { useTranslation } from 'react-i18next';

interface ReportMistakeLinkProps {
  /** Module id, e.g. "l1u3m4" — included in the mailto subject so reports are easy to triage. */
  moduleId: string;
  /** Display title of the module — included in the body so the recipient sees context immediately. */
  moduleTitle: string;
}

const REPORT_EMAIL = 'nunopdsantos+musictheory@gmail.com';

/**
 * Small inline link at the bottom of a module that lets the reader flag an
 * error to the maintainer. Opens a pre-populated mailto so no infrastructure
 * is needed beyond a working email client. Sets honest expectations:
 * the project is a personal learning tool, mistakes get fixed when reported.
 */
export function ReportMistakeLink({ moduleId, moduleTitle }: ReportMistakeLinkProps) {
  const { t, i18n } = useTranslation();

  const subject = `[Fermata] Mistake in ${moduleId} — ${moduleTitle}`;
  const body = [
    `Module: ${moduleTitle} (${moduleId})`,
    `Language: ${i18n.language}`,
    `URL: ${typeof window !== 'undefined' ? window.location.href : ''}`,
    '',
    '— What looks wrong:',
    '',
    '— What you think is correct (optional):',
    '',
  ].join('\n');

  const href = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="mt-8 pt-4 text-center">
      <a
        href={href}
        className="inline-flex items-center min-h-(--tap) px-2 text-caption underline decoration-dotted underline-offset-2 transition-colors"
        style={{ color: 'var(--text-dim)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; }}
      >
        {t('learn.reportMistake', { defaultValue: 'Found a mistake? Tell me' })}
      </a>
    </div>
  );
}
