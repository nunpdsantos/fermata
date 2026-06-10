/**
 * SessionSummary — the end-of-session screen.
 *
 * Reads the runner's in-memory SessionSummaryData (no store fields): the
 * headline score, a per-family breakdown of THIS session, and tier-change
 * callouts ("2 facts now by heart"). Three navigation buttons: New session,
 * Mastery map, Sprint. Deliberately no confetti — drill is a focused tool.
 */
import { useTranslation } from 'react-i18next';
import { DRILL_FAMILIES } from '../../core/types/drill';
import type { DrillFamily } from '../../core/types/drill';
import type { SessionSummaryData } from './useDrillRunner';

interface SessionSummaryProps {
  summary: SessionSummaryData;
  onNewSession: () => void;
  onMasteryMap: () => void;
  onSprint: () => void;
}

export function SessionSummary({
  summary,
  onNewSession,
  onMasteryMap,
  onSprint,
}: SessionSummaryProps) {
  const { t } = useTranslation();

  // Families answered this session, in canonical family order.
  const answeredFamilies = DRILL_FAMILIES.filter(
    (f): f is DrillFamily => summary.byFamily[f] !== undefined,
  );

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-dim)' }}>
          {t('drill.summary.title')}
        </p>
        <p className="text-2xl font-medium tabular-nums" style={{ color: 'var(--text)' }}>
          {t('drill.summary.score', { correct: summary.correct, asked: summary.asked })}
        </p>
      </div>

      {/* Tier-change callouts — only render when something crossed up. */}
      {(summary.newlyByHeart > 0 || summary.newlyReview > 0) && (
        <div className="flex flex-col items-center gap-1.5">
          {summary.newlyByHeart > 0 && (
            <span
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--accent) 14%, transparent)',
                color: 'var(--accent)',
              }}
            >
              <span aria-hidden="true">★</span>
              {t('drill.summary.byHeartCallout', { count: summary.newlyByHeart })}
            </span>
          )}
          {summary.newlyReview > 0 && (
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {t('drill.summary.reviewCallout', { count: summary.newlyReview })}
            </span>
          )}
        </div>
      )}

      {/* Per-family breakdown of this session. */}
      {answeredFamilies.length > 0 && (
        <ul className="flex flex-col gap-1.5" aria-label={t('drill.settings.families')}>
          {answeredFamilies.map((family) => {
            const tally = summary.byFamily[family]!;
            return (
              <li
                key={family}
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ backgroundColor: 'color-mix(in srgb, var(--card) 50%, transparent)' }}
              >
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {t(`drill.families.${family}`)}
                </span>
                <span className="text-sm font-medium tabular-nums" style={{ color: 'var(--text)' }}>
                  {t('drill.summary.familyScore', { correct: tally.correct, asked: tally.asked })}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onNewSession}
          className="min-h-[44px] rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
        >
          {t('drill.summary.newSession')}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onMasteryMap}
            className="min-h-[44px] rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--card) 60%, transparent)',
              color: 'var(--text-muted)',
              border: '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
            }}
          >
            {t('drill.summary.masteryMap')}
          </button>
          <button
            type="button"
            onClick={onSprint}
            className="min-h-[44px] rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--card) 60%, transparent)',
              color: 'var(--text-muted)',
              border: '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
            }}
          >
            {t('drill.summary.sprint')}
          </button>
        </div>
      </div>
    </div>
  );
}
