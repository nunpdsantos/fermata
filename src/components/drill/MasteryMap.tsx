/**
 * MasteryMap — per-family mastery overview with a stacked tier bar and an
 * enable toggle per family.
 *
 * The bar segments (new / learning / review / byHeart) are proportions of the
 * family's bank total. Tapping a row's toggle writes settings.families (same
 * state DrillSettings edits). Header shows the global by-heart total and the
 * due-today count. A Back button returns to the previous sub-screen.
 *
 * Tier colors come from the semantic palette (success / amber / info) plus a
 * neutral surface token for 'new' — no invented hexes.
 */
import { useTranslation } from 'react-i18next';
import { DRILL_FAMILIES } from '../../core/types/drill';
import type { DrillFamily, DrillItem, ItemSrsState } from '../../core/types/drill';
import { palette } from '../../design/tokens/palette';
import {
  computeMasteryByFamily,
  dueTodayCount,
  totalByHeart,
  type FamilyMastery,
} from './masterySelectors';

interface MasteryMapProps {
  bank: DrillItem[];
  items: Record<string, ItemSrsState>;
  families: Record<DrillFamily, boolean>;
  /** Current time (ms epoch) — injected so the view layer owns Date.now. */
  now: number;
  onToggleFamily: (family: DrillFamily, enabled: boolean) => void;
  onBack: () => void;
}

/** Tier → bar color. 'new' uses a neutral surface token (no semantic weight). */
const TIER_COLOR = {
  new: 'color-mix(in srgb, var(--text-dim) 35%, transparent)',
  learning: palette.warning, // amber
  review: palette.info, // sky
  byHeart: palette.success, // emerald
} as const;

const TIER_ORDER = ['byHeart', 'review', 'learning', 'new'] as const;

function StackedBar({ m }: { m: FamilyMastery }) {
  // Guard against a 0-total family (e.g. a future family with no items yet).
  const total = m.total || 1;
  return (
    <div
      className="flex h-2 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: 'color-mix(in srgb, var(--text-dim) 12%, transparent)' }}
    >
      {TIER_ORDER.map((tier) => {
        const count = tier === 'new' ? m.newCount : m[tier];
        if (count === 0) return null;
        return (
          <div
            key={tier}
            style={{
              width: `${(count / total) * 100}%`,
              backgroundColor: TIER_COLOR[tier],
            }}
          />
        );
      })}
    </div>
  );
}

export function MasteryMap({
  bank,
  items,
  families,
  now,
  onToggleFamily,
  onBack,
}: MasteryMapProps) {
  const { t } = useTranslation();
  const mastery = computeMasteryByFamily(bank, items);
  const byHeart = totalByHeart(mastery);
  const due = dueTodayCount(bank, items, now);

  return (
    <div className="flex flex-col gap-5 py-4">
      {/* Header: back + title + headline counts */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
          style={{ color: 'var(--text-dim)' }}
          aria-label={t('drill.mastery.back')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
          {t('drill.mastery.title')}
        </h2>
      </div>

      <div className="flex items-center gap-4 px-1">
        <span className="text-sm font-medium" style={{ color: palette.success }}>
          {t('drill.mastery.byHeartTotal', { count: byHeart })}
        </span>
        <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          {t('drill.mastery.dueToday', { count: due })}
        </span>
      </div>

      {/* Per-family rows */}
      <ul className="flex flex-col gap-3">
        {DRILL_FAMILIES.map((family) => {
          const m = mastery[family];
          const enabled = families[family];
          return (
            <li key={family} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  {t(`drill.families.${family}`)}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs tabular-nums" style={{ color: 'var(--text-dim)' }}>
                    {t('drill.mastery.counts', { byHeart: m.byHeart, total: m.total })}
                  </span>
                  <FamilyToggle
                    enabled={enabled}
                    label={t(`drill.families.${family}`)}
                    onToggle={(next) => onToggleFamily(family, next)}
                  />
                </div>
              </div>
              <StackedBar m={m} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Accessible on/off switch shared with DrillSettings (same idiom + tokens). */
export function FamilyToggle({
  enabled,
  label,
  onToggle,
}: {
  enabled: boolean;
  label: string;
  onToggle: (enabled: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onToggle(!enabled)}
      className="relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors"
      style={{
        backgroundColor: enabled
          ? 'var(--accent)'
          : 'color-mix(in srgb, var(--text-dim) 30%, transparent)',
      }}
    >
      <span
        className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
        style={{ transform: enabled ? 'translateX(20px)' : 'translateX(4px)' }}
      />
    </button>
  );
}
