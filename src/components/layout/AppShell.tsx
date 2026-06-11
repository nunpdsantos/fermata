import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopBar } from './TopBar.tsx';
import { Piano } from '../instruments/Piano.tsx';
import { Fretboard } from '../instruments/Fretboard.tsx';
import { InstrumentSelector } from '../instruments/InstrumentSelector.tsx';
import { useAppStore } from '../../state/store.ts';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { t } = useTranslation();
  const instrument = useAppStore((s) => s.instrument);
  const view = useAppStore((s) => s.view);
  const [instrumentCollapsed, setInstrumentCollapsed] = useState(false);

  return (
    <div className="h-screen supports-[height:100dvh]:h-dvh flex flex-col" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2"
        style={{ ['--tw-ring-color' as string]: 'var(--focus-ring)', backgroundColor: 'var(--card-hover)', color: 'var(--text)' }}
      >
        {t('nav.skipToContent')}
      </a>
      <TopBar />
      <main id="main-content" className="flex-1 overflow-hidden flex flex-col min-h-0">
        {children}
      </main>
      {/* Instrument area — hidden entirely in Drill, which owns its full vertical space. */}
      {view !== 'drill' && (
        <>
      {/* Instrument bar */}
      <div
        className="flex items-center justify-between px-3 max-sm:px-2 py-1 max-sm:py-1.5"
        style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border-subtle)' }}
      >
        <InstrumentSelector />
        <div className="flex items-center gap-2">
          <span className="text-2xs max-sm:hidden" style={{ color: 'var(--text-dim)' }} aria-hidden="true">
            {t('nav.clickKeysToPlay')}
          </span>
          <button
            onClick={() => setInstrumentCollapsed((c) => !c)}
            className="hidden max-lg:flex items-center justify-center w-6 h-6 max-sm:w-8 max-sm:h-8 rounded-md transition-colors"
            style={{ color: 'var(--text-dim)' }}
            aria-label={instrumentCollapsed ? t('nav.showInstrument') : t('nav.hideInstrument')}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${instrumentCollapsed ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
      {!instrumentCollapsed && (
        <div
          data-tour="play-note"
          role="region"
          aria-label={t('instrument.label', { name: t(`instrument.${instrument}`) })}
          className={`h-[260px] max-md:h-[200px] ${instrument === 'guitar' ? 'max-sm:h-[240px]' : 'max-sm:h-[195px]'} overflow-y-auto`}
          style={{ backgroundColor: 'var(--bg)', overscrollBehavior: 'contain' }}
        >
          {instrument === 'piano' ? <Piano /> : <Fretboard />}
        </div>
      )}
        </>
      )}
    </div>
  );
}
