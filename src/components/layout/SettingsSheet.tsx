import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type ThemeMode } from '../../state/store.ts';
import { SUPPORTED_LANGUAGES } from '../../i18n/index.ts';
import { toast } from '../../state/toastStore.ts';
import { buildBackup, validateBackup, applyBackup, backupSections } from '../../utils/backupHelpers.ts';
import { reloadPage } from '../../utils/pageReload.ts';
import { BUILD_DATE } from '../../buildInfo.ts';
import { useServiceWorkerActive } from '../../hooks/useServiceWorkerActive.ts';
import { Sheet } from '../ui/Sheet.tsx';
import { Segment } from '../ui/Segment.tsx';
import { Button } from '../ui/Button.tsx';
import { ChoiceChip } from '../ui/ChoiceChip.tsx';
import { solfegeLanguage } from '../../i18n/solfege.ts';

/**
 * The app's Settings (W11-A, opened from the top bar's "⋯" menu): language,
 * theme (Day / Night / Auto) and your data (export / import — the W9 vetting:
 * every section is checked by its own store before anything is offered).
 * Everything that used to sit in the top bar (language select, theme menu,
 * backup menu) lives here now.
 */
const THEMES: { value: ThemeMode; key: string }[] = [
  { value: 'fermata', key: 'settings.themeDay' },
  { value: 'fermata-night', key: 'settings.themeNight' },
  { value: 'auto', key: 'settings.themeAuto' },
];

export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const showSolfege = useAppStore((s) => s.showSolfege);
  const setShowSolfege = useAppStore((s) => s.setShowSolfege);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const offline = useServiceWorkerActive();

  const handleExport = () => {
    const backup = buildBackup(localStorage);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fermata-backup-${backup.exportedAt.slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast(t('backup.exported'), 'success');
  };

  const handleImportFile = async (file: File) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      toast(t('backup.invalidFile'), 'error');
      return;
    }
    // Every section is vetted by its own store before anything is offered.
    const result = await validateBackup(parsed);
    if (!result.ok) {
      toast(t('backup.invalidFile'), 'error');
      return;
    }
    const sections = backupSections(result.backup).map((s) => t(`backup.section.${s}`)).join(', ');
    if (!window.confirm(t('backup.confirmImport', { sections }))) return;
    applyBackup(result.backup, localStorage);
    // Reload so every store rehydrates through its shape guards + migrations.
    reloadPage();
  };

  const footer = [
    t('nav.musicTheory'),
    BUILD_DATE ? t('settings.build', { date: BUILD_DATE }) : null,
    offline ? t('settings.worksOffline') : null,
  ].filter(Boolean).join(' · ');

  return (
    <Sheet open={open} onClose={onClose} title={t('settings.title')} closeLabel={t('common.close')} testId="settings-sheet">
      <SettingRow label={t('settings.language')}>
        <Segment
          label={t('settings.language')}
          value={language}
          onChange={setLanguage}
          className="w-full"
          options={SUPPORTED_LANGUAGES.map((l) => ({ value: l.code as string, label: <span lang={l.code}>{l.label}</span> }))}
        />
        {/* Fixed-do names beside the letters: Portuguese and Spanish only (wave 1). */}
        {solfegeLanguage(language) && (
          <div className="flex flex-col items-start gap-1.5 pt-1" data-testid="solfege-setting">
            <ChoiceChip pressed={showSolfege} onClick={() => setShowSolfege(!showSolfege)} aria-describedby="solfege-hint">
              {t('solfege.setting')}
            </ChoiceChip>
            <p id="solfege-hint" className="text-ui" style={{ color: 'var(--text-dim)' }}>{t('solfege.hint')}</p>
          </div>
        )}
      </SettingRow>
      <SettingRow label={t('settings.theme')}>
        <Segment
          label={t('settings.theme')}
          value={themeMode}
          onChange={setThemeMode}
          className="w-full"
          options={THEMES.map((o) => ({ value: o.value, label: t(o.key) }))}
        />
      </SettingRow>
      <SettingRow label={t('settings.yourData')} meta={t('settings.yourDataMeta')}>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleExport} aria-label={t('backup.export')}>
            {t('settings.export')}
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} aria-label={t('backup.import')}>
            {t('settings.import')}
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          data-testid="backup-file-input"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (file) void handleImportFile(file);
          }}
        />
      </SettingRow>
      <p className="text-ui pt-3" style={{ color: 'var(--text-dim)' }} data-testid="settings-footer">
        {footer}
      </p>
    </Sheet>
  );
}

function SettingRow({ label, meta, children }: { label: string; meta?: string; children: ReactNode }) {
  return (
    <div className="py-3 flex flex-col gap-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div>
        <div className="text-body" style={{ color: 'var(--text)' }}>{label}</div>
        {meta && <div className="text-ui" style={{ color: 'var(--text-dim)' }}>{meta}</div>}
      </div>
      {children}
    </div>
  );
}
