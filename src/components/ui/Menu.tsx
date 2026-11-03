import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';
import { IconButton } from './Button';

/**
 * MENU (design system v2, D-28) — the "⋯" button and its popup of actions.
 * WAI-ARIA menu button: Enter/Space/↓ open it with focus on the first item,
 * ↑/↓/Home/End move, Escape closes and returns focus to the button, Tab or a
 * click outside closes it. Choosing an item closes the menu, puts focus back
 * on the button, then runs the item (so a sheet it opens returns focus here).
 * Later batches add view actions (Copy / Print / Compare, D-29) as items.
 */
export interface MenuItem {
  id: string;
  label: ReactNode;
  onSelect: () => void;
  /** Right-aligned hint, e.g. a shortcut. */
  hint?: ReactNode;
}

export interface MenuProps {
  /** Accessible name of the button (and the menu). */
  label: string;
  items: readonly MenuItem[];
  icon?: ReactNode;
  testId?: string;
  /**
   * Something inside waits for the learner (e.g. an update put off with
   * "Later"): a dot on the button, and the button's name says what
   * (`buttonLabel`, e.g. "More — update ready"; the menu keeps `label`).
   */
  badge?: boolean;
  buttonLabel?: string;
  /**
   * Render the popup on <body>, fixed under the button: for a menu inside a
   * view that clips its overflow (Explore's scale actions — on a phone held
   * sideways the view is ~120 px tall and cut the menu off, W11-B).
   */
  portal?: boolean;
}

const DOTS = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
);

export function Menu({ label, items, icon = DOTS, testId, badge = false, buttonLabel, portal = false }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [focusFirst, setFocusFirst] = useState<'first' | 'last'>('first');
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const itemEls = () => [...(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];

  useEffect(() => {
    if (!open) return;
    const els = itemEls();
    (focusFirst === 'last' ? els[els.length - 1] : els[0])?.focus();
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (rootRef.current && !rootRef.current.contains(t) && !menuRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open, focusFirst]);

  // Portal: fixed, right-aligned under the button (re-measured on open).
  const [fixedAt, setFixedAt] = useState<{ top: number; right: number } | null>(null);
  useLayoutEffect(() => {
    if (!open || !portal || !buttonRef.current) return;
    const r = buttonRef.current.getBoundingClientRect();
    // A DOM measurement, so it is set from this layout effect (before paint).
    setFixedAt({ top: r.bottom + 6, right: Math.max(8, window.innerWidth - r.right) });
  }, [open, portal]);

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };

  const onMenuKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const els = itemEls();
    const i = els.indexOf(document.activeElement as HTMLElement);
    const go = (j: number) => {
      e.preventDefault();
      els[(j + els.length) % els.length]?.focus();
    };
    switch (e.key) {
      case 'ArrowDown': go(i + 1); break;
      case 'ArrowUp': go(i - 1); break;
      case 'Home': go(0); break;
      case 'End': go(els.length - 1); break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        close(true);
        break;
      case 'Tab':
        close(false);
        break;
    }
  };

  const wrap = (popup: ReactNode) => (portal && typeof document !== 'undefined' ? createPortal(popup, document.body) : popup);

  return (
    <div ref={rootRef} className="relative" data-testid={testId}>
      <IconButton
        ref={buttonRef}
        aria-label={buttonLabel ?? label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        icon={icon}
        onClick={() => {
          setFocusFirst('first');
          setOpen((v) => !v);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusFirst(e.key === 'ArrowUp' ? 'last' : 'first');
            setOpen(true);
          }
        }}
      />
      {badge && <span className="menu-badge" data-testid={testId ? `${testId}-badge` : undefined} aria-hidden="true" />}
      {open && wrap(
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          className="menu-popup"
          style={portal ? { position: 'fixed', top: fixedAt?.top ?? 0, right: fixedAt?.right ?? 8, visibility: fixedAt ? undefined : 'hidden' } : undefined}
          onKeyDown={onMenuKey}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              tabIndex={-1}
              className="menu-item"
              onClick={() => {
                close(true);
                item.onSelect();
              }}
            >
              <span className="flex-1">{item.label}</span>
              {item.hint && <span className="text-caption" style={{ color: 'var(--text-dim)' }}>{item.hint}</span>}
            </button>
          ))}
        </div>,
      )}
    </div>
  );
}
