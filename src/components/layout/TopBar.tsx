import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type ViewMode, type ThemeMode } from '../../state/store.ts';
import { SUPPORTED_LANGUAGES } from '../../i18n/index.ts';
import { toast } from '../../state/toastStore.ts';

const VIEWS: ViewMode[] = ['explore', 'learn'];
const VIEW_KEYS: Record<ViewMode, string> = {
  explore: 'nav.explore',
  learn: 'nav.learn',
};

const THEME_OPTIONS: ThemeMode[] = ['dark', 'light', 'system', 'fermata'];
const THEME_KEYS: Record<ThemeMode, string> = {
  dark: 'theme.dark',
  light: 'theme.light',
  system: 'theme.system',
  fermata: 'theme.fermata',
};

function ThemeIcon({ mode }: { mode: ThemeMode }) {
  const s = 14;
  if (mode === 'light') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    );
  }
  if (mode === 'system') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  }
  if (mode === 'fermata') {
    // Fermata symbol — arc over a dot
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 14 A 8 8 0 0 1 20 14" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  // dark (default)
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function TopBar() {
  const { t } = useTranslation();
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const btn = nav.querySelector<HTMLElement>(`[data-tab="${view}"]`);
    if (!btn) return;
    setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [view]);

  const themeLabel = t(THEME_KEYS[themeMode]);

  return (
    <header
      className="flex items-center justify-between px-4 max-sm:px-2.5 h-12 backdrop-blur-md shrink-0"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg) 80%, transparent)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" className="max-sm:hidden shrink-0" aria-hidden="true">
          <path d="M4 14 A 8 8 0 0 1 20 14" />
          <circle cx="12" cy="16" r="1.8" fill="var(--accent)" />
        </svg>
        <span
          className="max-sm:hidden"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '17px',
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: '-0.01em',
          }}
        >
          {t('nav.musicTheory')}
        </span>
      </div>

      <nav
        ref={navRef}
        className="flex items-center rounded-lg p-0.5 relative"
        style={{ backgroundColor: 'color-mix(in srgb, var(--card-hover) 60%, transparent)' }}
        role="tablist"
        aria-label={t('nav.appViews')}
      >
        <div
          className="absolute rounded-md"
          style={{
            left: indicator.left,
            width: indicator.width,
            top: 2,
            bottom: 2,
            backgroundColor: 'var(--accent-dim)',
            transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1), width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        {VIEWS.map((v) => (
          <button
            key={v}
            data-tab={v}
            onClick={() => setView(v)}
            className="relative px-3 max-sm:px-2 py-1 max-sm:py-0.5 text-xs font-medium rounded-md transition-colors z-10"
            style={{
              color: view === v ? 'var(--text)' : 'var(--text-muted)',
            }}
            role="tab"
            aria-selected={view === v}
            aria-controls={`${v}-panel`}
          >
            <span className="relative z-10">{t(VIEW_KEYS[v])}</span>
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {/* Language selector */}
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            toast(t('toast.languageChanged'), 'info');
          }}
          className="text-2xs px-1.5 py-1 rounded-lg appearance-none cursor-pointer bg-transparent"
          style={{
            color: 'var(--text-dim)',
            border: '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
          }}
          aria-label={t('nav.languageLabel')}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.code.toUpperCase()}</option>
          ))}
        </select>

        {/* Theme menu — pick directly instead of cycling */}
        <ThemeMenu
          mode={themeMode}
          onChange={setThemeMode}
          ariaLabel={t('nav.themeLabel', { mode: themeLabel })}
          label={themeLabel}
        />


        {/* Quick search */}
        <button
          onClick={() => useAppStore.getState().setQuickSearchOpen(true)}
          className="flex items-center gap-1.5 px-2.5 max-sm:px-2 py-1 rounded-lg text-xs transition-colors"
          style={{
            color: 'var(--text-dim)',
            backgroundColor: 'color-mix(in srgb, var(--card-hover) 50%, transparent)',
            border: '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
            boxShadow: 'var(--shadow-sm)',
          }}
          aria-label={t('nav.quickSearchLabel')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden shrink-0">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="max-sm:hidden">{t('nav.search')}</span>
          <kbd
            className="text-2xs px-1 py-0.5 rounded ml-1 max-sm:hidden"
            style={{ color: 'var(--text-dim)', backgroundColor: 'var(--bg)' }}
            aria-hidden="true"
          >
            &#8984;K
          </kbd>
        </button>
      </div>
    </header>
  );
}

interface ThemeMenuProps {
  mode: ThemeMode;
  onChange: (m: ThemeMode) => void;
  ariaLabel: string;
  label: string;
}

function ThemeMenu({ mode, onChange, ariaLabel, label }: ThemeMenuProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (m: ThemeMode) => {
    onChange(m);
    setOpen(false);
    toast(t('toast.themeChanged', { mode: t(THEME_KEYS[m]) }), 'info');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors"
        style={{
          color: 'var(--text-dim)',
          border: '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
          backgroundColor: open ? 'var(--card-hover)' : 'transparent',
        }}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <ThemeIcon mode={mode} />
        <span className="max-sm:hidden">{label}</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-1.5 z-50 rounded-lg overflow-hidden min-w-[150px]"
          style={{
            backgroundColor: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {THEME_OPTIONS.map((m) => {
            const active = m === mode;
            return (
              <button
                key={m}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => pick(m)}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left transition-colors"
                style={{
                  color: active ? 'var(--accent)' : 'var(--text)',
                  backgroundColor: active ? 'var(--accent-dim)' : 'transparent',
                  fontWeight: active ? 600 : 400,
                }}
              >
                <ThemeIcon mode={m} />
                <span className="flex-1">{t(THEME_KEYS[m])}</span>
                {active && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
