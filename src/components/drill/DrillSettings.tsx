/**
 * DrillSettings — the full settings screen (replaces the old inline panel).
 *
 * Controls (all write straight to the drill store via updateSettings):
 *   - session length: 12 / 24 / 40 segmented
 *   - new facts per session: 0–8 stepper
 *   - topic (family) toggles: same state the MasteryMap edits
 *   - answer-sound switch
 *   - show-timer switch (governs the NORMAL session timer; sprint always counts)
 *
 * A Back button returns to the running question (settings do NOT end a session);
 * a Mastery-map link makes the map reachable from here too.
 */
import { useTranslation } from 'react-i18next';
import { DRILL_FAMILIES } from '../../core/types/drill';
import type { DrillFamily } from '../../core/types/drill';
import type { DrillSettings as DrillSettingsState } from '../../state/drillStore';
import { FamilyToggle } from './MasteryMap';

const SESSION_LENGTHS = [12, 24, 40] as const;
const MIN_NEW = 0;
const MAX_NEW = 8;

interface DrillSettingsProps {
  settings: DrillSettingsState;
  onUpdate: (patch: Partial<DrillSettingsState>) => void;
  onBack: () => void;
  onMasteryMap: () => void;
}

export function DrillSettings({ settings, onUpdate, onBack, onMasteryMap }: DrillSettingsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
          style={{ color: 'var(--text-dim)' }}
          aria-label={t('drill.settings.back')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
          {t('drill.settings.title')}
        </h2>
      </div>

      {/* Session length — segmented */}
      <section className="flex flex-col gap-2">
        <p className="text-xs font-medium" style={{ color: 'var(--text-dim)' }}>
          {t('drill.settings.length')}
        </p>
        <div
          role="group"
          aria-label={t('drill.settings.length')}
          className="grid grid-cols-3 gap-1 rounded-lg p-0.5"
          style={{ backgroundColor: 'color-mix(in srgb, var(--card-hover) 60%, transparent)' }}
        >
          {SESSION_LENGTHS.map((len) => {
            const active = len === settings.length;
            return (
              <button
                key={len}
                type="button"
                onClick={() => onUpdate({ length: len })}
                className="min-h-[40px] rounded-md text-sm tabular-nums transition-colors"
                style={{
                  backgroundColor: active ? 'var(--accent-dim)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  fontWeight: active ? 600 : 500,
                }}
                aria-pressed={active}
              >
                {len}
              </button>
            );
          })}
        </div>
      </section>

      {/* New facts per session — stepper */}
      <section className="flex items-center justify-between gap-3">
        <p className="text-sm" style={{ color: 'var(--text)' }}>
          {t('drill.settings.newPerSession')}
        </p>
        <div className="flex items-center gap-3">
          <StepperButton
            label="−"
            disabled={settings.newPerSession <= MIN_NEW}
            onClick={() => onUpdate({ newPerSession: Math.max(MIN_NEW, settings.newPerSession - 1) })}
          />
          <span className="w-5 text-center text-sm font-medium tabular-nums" style={{ color: 'var(--text)' }} aria-live="polite">
            {settings.newPerSession}
          </span>
          <StepperButton
            label="+"
            disabled={settings.newPerSession >= MAX_NEW}
            onClick={() => onUpdate({ newPerSession: Math.min(MAX_NEW, settings.newPerSession + 1) })}
          />
        </div>
      </section>

      {/* Topic (family) toggles */}
      <section className="flex flex-col gap-2.5">
        <p className="text-xs font-medium" style={{ color: 'var(--text-dim)' }}>
          {t('drill.settings.families')}
        </p>
        <ul className="flex flex-col gap-2">
          {DRILL_FAMILIES.map((family: DrillFamily) => (
            <li key={family} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {t(`drill.families.${family}`)}
              </span>
              <FamilyToggle
                enabled={settings.families[family]}
                label={t(`drill.families.${family}`)}
                onToggle={(next) =>
                  onUpdate({ families: { ...settings.families, [family]: next } })
                }
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Switches */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--text)' }}>
            {t('drill.settings.sound')}
          </span>
          <FamilyToggle
            enabled={settings.sound}
            label={t('drill.settings.sound')}
            onToggle={(next) => onUpdate({ sound: next })}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--text)' }}>
            {t('drill.settings.showTimer')}
          </span>
          <FamilyToggle
            enabled={settings.showTimer}
            label={t('drill.settings.showTimer')}
            onToggle={(next) => onUpdate({ showTimer: next })}
          />
        </div>
      </section>

      {/* Mastery-map link */}
      <button
        type="button"
        onClick={onMasteryMap}
        className="self-start text-sm font-medium transition-colors"
        style={{ color: 'var(--accent)' }}
      >
        {t('drill.summary.masteryMap')} →
      </button>
    </div>
  );
}

function StepperButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label === '+' ? 'increment' : 'decrement'}
      className="flex items-center justify-center w-9 h-9 rounded-lg text-lg font-medium transition-colors"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--card) 60%, transparent)',
        border: '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
        color: disabled ? 'var(--text-dim)' : 'var(--text)',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {label}
    </button>
  );
}
