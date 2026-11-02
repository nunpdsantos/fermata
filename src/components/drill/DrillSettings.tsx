/**
 * DrillSettings — the full settings screen (replaces the old inline panel).
 *
 * Controls (all write straight to the drill store via updateSettings):
 *   - session length: 12 / 24 / 40 — a ChipGroup (one of many, D-28)
 *   - new facts per session: 0–8 stepper
 *   - topics: toggle chips (several can be on — same state the MasteryMap edits)
 *   - answer sound / show timer: toggle chips (show-timer governs the NORMAL
 *     session timer; sprint always counts)
 *
 * A Back button returns to the running question (settings do NOT end a session);
 * a Mastery-map link makes the map reachable from here too.
 * A destructive "Reset drill progress" section at the bottom clears SRS state
 * while preserving settings.
 *
 * W11-A: on the v2 system — the two selected states (choice chip; the toggle
 * chips use the same "on" look), --tap targets, 12 px floor, tokens only.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DRILL_FAMILIES } from '../../core/types/drill';
import type { DrillFamily } from '../../core/types/drill';
import type { DrillSettings as DrillSettingsState } from '../../state/drillStore';
import { ChipGroup, ChoiceChip } from '../ui/ChoiceChip';
import { Button, IconButton } from '../ui/Button';

const SESSION_LENGTHS = [12, 24, 40] as const;
const MIN_NEW = 0;
const MAX_NEW = 8;

interface DrillSettingsProps {
  settings: DrillSettingsState;
  onUpdate: (patch: Partial<DrillSettingsState>) => void;
  onBack: () => void;
  onMasteryMap: () => void;
  onResetProgress: () => void;
}

const BACK_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export function DrillSettings({ settings, onUpdate, onBack, onMasteryMap, onResetProgress }: DrillSettingsProps) {
  const { t } = useTranslation();
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <IconButton onClick={onBack} aria-label={t('drill.settings.back')} icon={BACK_ICON} />
        <h2 className="text-title font-semibold" style={{ color: 'var(--text)' }}>
          {t('drill.settings.title')}
        </h2>
      </div>

      {/* Session length — one of three values */}
      <section className="flex flex-col gap-2">
        <p className="type-label">{t('drill.settings.length')}</p>
        <ChipGroup
          label={t('drill.settings.length')}
          value={settings.length}
          onChange={(len) => onUpdate({ length: len })}
          chipClassName="tabular-nums"
          options={SESSION_LENGTHS.map((len) => ({ value: len, label: String(len) }))}
        />
      </section>

      {/* New facts per session — stepper */}
      <section className="flex items-center justify-between gap-3">
        <p className="text-body" style={{ color: 'var(--text)' }}>
          {t('drill.settings.newPerSession')}
        </p>
        <div className="flex items-center gap-2">
          <IconButton
            variant="secondary"
            aria-label={t('drill.settings.fewerNew')}
            disabled={settings.newPerSession <= MIN_NEW}
            onClick={() => onUpdate({ newPerSession: Math.max(MIN_NEW, settings.newPerSession - 1) })}
            icon={<span aria-hidden="true" className="text-title leading-none">−</span>}
          />
          <span className="w-6 text-center text-body font-semibold tabular-nums" style={{ color: 'var(--text)' }} aria-live="polite">
            {settings.newPerSession}
          </span>
          <IconButton
            variant="secondary"
            aria-label={t('drill.settings.moreNew')}
            disabled={settings.newPerSession >= MAX_NEW}
            onClick={() => onUpdate({ newPerSession: Math.min(MAX_NEW, settings.newPerSession + 1) })}
            icon={<span aria-hidden="true" className="text-title leading-none">+</span>}
          />
        </div>
      </section>

      {/* Topics — several can be on: toggle chips (pressed = on) */}
      <section className="flex flex-col gap-2">
        <p className="type-label">{t('drill.settings.families')}</p>
        <div role="group" aria-label={t('drill.settings.families')} className="chip-group">
          {DRILL_FAMILIES.map((family: DrillFamily) => (
            <ChoiceChip
              key={family}
              pressed={settings.families[family]}
              onClick={() => onUpdate({ families: { ...settings.families, [family]: !settings.families[family] } })}
            >
              {t(`drill.families.${family}`)}
            </ChoiceChip>
          ))}
        </div>
      </section>

      {/* Answer sound / show timer — on/off toggle chips */}
      <section className="chip-group">
        <ChoiceChip pressed={settings.sound} onClick={() => onUpdate({ sound: !settings.sound })}>
          {t('drill.settings.sound')}
        </ChoiceChip>
        <ChoiceChip pressed={settings.showTimer} onClick={() => onUpdate({ showTimer: !settings.showTimer })}>
          {t('drill.settings.showTimer')}
        </ChoiceChip>
      </section>

      {/* Mastery-map link */}
      <Button variant="link" className="self-start -ml-1.5" onClick={onMasteryMap}>
        {t('drill.summary.masteryMap')} <span aria-hidden="true">→</span>
      </Button>

      {/* ── Destructive zone ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        {!confirmingReset ? (
          <Button
            variant="quiet"
            className="self-start -ml-3.5"
            style={{ color: 'var(--danger-text)' }}
            onClick={() => setConfirmingReset(true)}
          >
            {t('drill.settings.resetLabel')}
          </Button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-ui" style={{ color: 'var(--text-muted)' }}>
              {t('drill.settings.resetWarning')}
            </p>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                style={{ color: 'var(--danger-text)', borderColor: 'var(--danger-text)' }}
                onClick={() => {
                  setConfirmingReset(false);
                  onResetProgress();
                }}
              >
                {t('drill.settings.resetConfirm')}
              </Button>
              <Button className="flex-1" onClick={() => setConfirmingReset(false)}>
                {t('drill.settings.resetCancel')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
