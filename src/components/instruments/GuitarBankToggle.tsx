/**
 * TEMPORARY (WS11 A/B bake-off) — segmented A | B switch for the guitar sample
 * bank. Renders only when the guitar is the selected instrument (mounted
 * conditionally by AppShell). Flipping it calls setGuitarBank(), which persists
 * the choice, busts the inactive bank's decoded buffers and re-preloads the new
 * one; the Karplus-Strong fallback covers the decode gap so the guitar never
 * goes silent mid-switch. The whole control is slated for deletion once the
 * owner picks the better-sounding bank.
 *
 * Bank state lives OUTSIDE the Zustand store on purpose (it is throwaway), so
 * this holds its own React state seeded from getGuitarBank() at mount.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getGuitarBank, setGuitarBank, type GuitarBank } from '../../services/guitarSampler.ts';

const BANKS: { id: GuitarBank; labelKey: string }[] = [
  { id: 'a', labelKey: 'audio.guitarBank.a' },
  { id: 'b', labelKey: 'audio.guitarBank.b' },
];

export function GuitarBankToggle() {
  const { t } = useTranslation();
  const [bank, setBank] = useState<GuitarBank>(() => getGuitarBank());

  const choose = (next: GuitarBank) => {
    if (next === bank) return;
    setGuitarBank(next);
    setBank(next);
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-2xs max-sm:hidden" style={{ color: 'var(--text-dim)' }}>
        {t('audio.guitarBank.label')}
      </span>
      <div
        role="radiogroup"
        aria-label={t('audio.guitarBank.label')}
        className="flex items-center gap-0.5 rounded-md p-0.5 max-sm:p-1 max-sm:rounded-lg"
        style={{ backgroundColor: 'color-mix(in srgb, var(--card-hover) 60%, transparent)' }}
      >
        {BANKS.map((b) => {
          const isActive = bank === b.id;
          return (
            <button
              key={b.id}
              role="radio"
              aria-checked={isActive}
              aria-label={`${t('audio.guitarBank.label')}: ${t(b.labelKey)}`}
              onClick={() => choose(b.id)}
              // Mirrors InstrumentSelector's tab sizing: compact on desktop,
              // bumped on phones where this matters as a touch target. The min
              // sizing keeps each tap area ~44px on small screens (WCAG 2.5.5)
              // without distorting the dense desktop instrument bar.
              className="px-2 py-0.5 text-2xs font-medium rounded transition-colors max-sm:px-4 max-sm:py-2.5 max-sm:text-xs max-sm:min-w-[44px]"
              style={{
                backgroundColor: isActive ? 'var(--border)' : 'transparent',
                color: isActive ? 'var(--text)' : 'var(--text-dim)',
              }}
            >
              {t(b.labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
