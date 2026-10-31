import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

/** Keyboard-reachable elements inside `root`, in DOM order. */
export function focusableIn(root: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');
  return [...root.querySelectorAll<HTMLElement>(selector)].filter(
    (el) => !el.closest('[inert]') && !el.hasAttribute('hidden') && getComputedStyle(el).display !== 'none',
  );
}

/**
 * Keep Tab / Shift+Tab inside `root` (a modal sheet). Call from a keydown
 * handler; returns true when it moved focus.
 */
export function trapTab(e: KeyboardEvent | ReactKeyboardEvent, root: HTMLElement): boolean {
  if (e.key !== 'Tab') return false;
  const items = focusableIn(root);
  if (items.length === 0) {
    e.preventDefault();
    root.focus();
    return true;
  }
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement as HTMLElement | null;
  if (e.shiftKey && (active === first || !root.contains(active))) {
    e.preventDefault();
    last.focus();
    return true;
  }
  if (!e.shiftKey && (active === last || !root.contains(active))) {
    e.preventDefault();
    first.focus();
    return true;
  }
  return false;
}
