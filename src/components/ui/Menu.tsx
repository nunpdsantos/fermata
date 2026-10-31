import { useEffect, useId, useRef, useState } from 'react';
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
}

const DOTS = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
);

export function Menu({ label, items, icon = DOTS, testId }: MenuProps) {
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
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open, focusFirst]);

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

  return (
    <div ref={rootRef} className="relative" data-testid={testId}>
      <IconButton
        ref={buttonRef}
        aria-label={label}
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
      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          className="menu-popup"
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
        </div>
      )}
    </div>
  );
}
