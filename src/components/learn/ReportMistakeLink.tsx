import { useTranslation } from 'react-i18next';
import { reportDetails, reportUrl, stopIfOffline } from '../../services/reportProblem';

interface ReportMistakeLinkProps {
  /** Module id, e.g. "l1u3m4": put in the form's details box so reports are easy to triage. */
  moduleId: string;
  /** Display title of the module: in the details too (cut to 60 characters). */
  moduleTitle: string;
}

/**
 * Small inline link at the bottom of a module that lets the reader flag an
 * error: a real link to the report form in the learner's language (the same
 * form as "⋯" → Report a problem), opened in a new tab, with the lesson in
 * its details box. Offline, the tap says the form needs a connection and
 * goes nowhere. Nothing is sent before the tap.
 */
export function ReportMistakeLink({ moduleId, moduleTitle }: ReportMistakeLinkProps) {
  const { t, i18n } = useTranslation();
  const href = reportUrl(i18n.language, reportDetails({ view: 'learn', language: i18n.language, module: { id: moduleId, title: moduleTitle } }));

  return (
    <div className="mt-8 pt-4 text-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="report-mistake"
        className="inline-flex items-center min-h-(--tap) px-2 text-caption underline decoration-dotted underline-offset-2 transition-colors"
        style={{ color: 'var(--text-dim)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; }}
        onClick={(e) => {
          if (stopIfOffline(t('report.offline'))) e.preventDefault();
        }}
      >
        {t('learn.reportMistake')}
      </a>
    </div>
  );
}
