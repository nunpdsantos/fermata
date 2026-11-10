import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';

export interface ChipAction {
  id: string;
  label: string;
  disabled?: boolean;
  onSelect: () => void;
}

/**
 * One chord of the progression: its name and, under it, its number in the
 * key. A tap opens a small menu (move left, move right, remove) — the
 * WAI-ARIA menu button pattern of ui/Menu.tsx (Enter / Space / ↓ open on the
 * first item, ↑ ↓ Home End move, Escape closes and returns focus, Tab or a
 * click outside closes), on <body> under the chip so a scrolling row never
 * clips it. A chord from outside the key wears a dashed edge; the one
 * sounding while the loop plays is marked (aria-current).
 */
export function ChordChip({ name, numeral, label, menuLabel, outside, playing, actions, onRef }: {
  name: string;
  numeral: string;
  /** Accessible name: "G, I, chord 1 of 4". */
  label: string;
  menuLabel: string;
  outside: boolean;
  playing: boolean;
  actions: readonly ChipAction[];
  onRef?: (el: HTMLButtonElement | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [first, setFirst] = useState<'first' | 'last'>('first');
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const [at, setAt] = useState<{ top: number; left: number } | null>(null);

  const items = () => [...(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? [])];

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const r = buttonRef.current.getBoundingClientRect();
    const width = 200;
    // Under the chip, kept inside the window.
    setAt({ top: r.bottom + 4, left: Math.max(8, Math.min(r.left, window.innerWidth - width - 8)) });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const els = items();
    (first === 'last' ? els[els.length - 1] : els[0])?.focus();
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!buttonRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };
    const onScroll = (e: Event) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open, first]);

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };

  const onMenuKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const els = items();
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
    <li className="prog-chip-item">
      <button
        ref={(el) => {
          buttonRef.current = el;
          onRef?.(el);
        }}
        type="button"
        className="prog-chip"
        data-outside={outside || undefined}
        data-playing={playing || undefined}
        aria-current={playing ? 'true' : undefined}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => {
          setFirst('first');
          setOpen((v) => !v);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setFirst(e.key === 'ArrowUp' ? 'last' : 'first');
            setOpen(true);
          }
        }}
      >
        <span className="prog-chip-name">{name}</span>
        <span className="prog-chip-numeral" data-term="romanNumeral">{numeral}</span>
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={menuLabel}
          className="menu-popup"
          style={{ position: 'fixed', top: at?.top ?? 0, left: at?.left ?? 8, right: 'auto', opacity: at ? undefined : 0 }}
          onKeyDown={onMenuKey}
        >
          {actions.map((a) => (
            <button
              key={a.id}
              type="button"
              role="menuitem"
              tabIndex={-1}
              className="menu-item"
              aria-disabled={a.disabled || undefined}
              data-action={a.id}
              onClick={() => {
                if (a.disabled) return;
                close(true);
                a.onSelect();
              }}
            >
              <span className="flex-1">{a.label}</span>
            </button>
          ))}
        </div>,
        document.body,
      )}
    </li>
  );
}
