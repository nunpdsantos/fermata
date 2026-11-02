import type { KeyboardEvent } from 'react';

/**
 * Arrow-key movement for a one-of-many group (radiogroup / tablist), the ONE
 * keyboard pattern every ChipGroup and Segment uses (W11-A): the group is a
 * single Tab stop (the selected item, or the first enabled one); Arrow keys
 * move to the next / previous enabled item and select it (wrapping); Home /
 * End jump to the first / last. Returns the index to select, or null when
 * the key is not a movement key.
 */
export function rovingTarget(key: string, current: number, enabled: readonly boolean[]): number | null {
  const n = enabled.length;
  if (n === 0) return null;
  const step = (from: number, dir: 1 | -1): number => {
    for (let i = 1; i <= n; i++) {
      const j = (from + dir * i + n * n) % n;
      if (enabled[j]) return j;
    }
    return from;
  };
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return step(current < 0 ? -1 : current, 1);
    case 'ArrowLeft':
    case 'ArrowUp':
      return step(current < 0 ? 0 : current, -1);
    case 'Home':
      return enabled.indexOf(true);
    case 'End':
      return enabled.lastIndexOf(true);
    default:
      return null;
  }
}

/** Handle an arrow key on a group: select + focus the target item. */
export function handleRovingKey(
  e: KeyboardEvent<HTMLElement>,
  current: number,
  enabled: readonly boolean[],
  onMove: (index: number) => void,
): void {
  const target = rovingTarget(e.key, current, enabled);
  if (target === null || target < 0) return;
  e.preventDefault();
  onMove(target);
  const items = e.currentTarget.querySelectorAll<HTMLElement>('[data-roving-item]');
  items[target]?.focus();
}

/** The item that carries tabIndex 0: the selected one, else the first enabled. */
export function tabStopIndex(selected: number, enabled: readonly boolean[]): number {
  return selected >= 0 && enabled[selected] ? selected : enabled.indexOf(true);
}
