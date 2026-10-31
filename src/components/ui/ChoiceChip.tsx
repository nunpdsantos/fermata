import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { handleRovingKey, tabStopIndex } from './roving';

/**
 * CHOICE CHIP (design system v2, D-28) — one value out of many: a root, a
 * scale, a guitar position, a tuning, an octave, a chord shape.
 *
 * ChipGroup is a WAI-ARIA radiogroup: one Tab stop, Arrow keys move AND
 * select (wrapping), Home/End jump. Selected = the solid accent pill. This is
 * the only "one of many" look in the app; a view switch is a Segment.
 */
export interface ChipOption<T extends string | number> {
  value: T;
  label: ReactNode;
  /** Accessible name when the visible label is not enough. */
  ariaLabel?: string;
  title?: string;
  disabled?: boolean;
  /** Visual sub-group (e.g. "Modes"); consecutive options sharing it sit together. */
  group?: string;
  /** Extra attributes for tests / styling hooks (data-*). */
  data?: Record<`data-${string}`, string>;
}

export interface ChipGroupProps<T extends string | number> {
  /** Accessible name of the group. */
  label: string;
  value: T | null;
  options: readonly ChipOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  style?: CSSProperties;
  chipClassName?: string;
}

export function ChipGroup<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className,
  style,
  chipClassName,
}: ChipGroupProps<T>) {
  const enabled = options.map((o) => !o.disabled);
  const selected = options.findIndex((o) => o.value === value);
  const stop = tabStopIndex(selected, enabled);

  const chip = (o: ChipOption<T>, i: number) => (
    <button
      key={String(o.value)}
      type="button"
      role="radio"
      aria-checked={i === selected}
      aria-label={o.ariaLabel}
      title={o.title}
      disabled={o.disabled}
      tabIndex={i === stop ? 0 : -1}
      data-roving-item=""
      className={['chip', chipClassName].filter(Boolean).join(' ')}
      onClick={() => onChange(o.value)}
      {...o.data}
    >
      {o.label}
    </button>
  );

  // Consecutive options with the same `group` share a wrapper (a divider
  // separates wrappers); options without one render flat.
  const runs: { group: string | undefined; items: { o: ChipOption<T>; i: number }[] }[] = [];
  options.forEach((o, i) => {
    const last = runs[runs.length - 1];
    if (last && last.group === o.group && o.group !== undefined) last.items.push({ o, i });
    else runs.push({ group: o.group, items: [{ o, i }] });
  });

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={['chip-group', className].filter(Boolean).join(' ')}
      style={style}
      onKeyDown={(e) => {
        handleRovingKey(e, selected >= 0 ? selected : stop, enabled, (i) => onChange(options[i].value));
      }}
    >
      {runs.map((run, r) =>
        run.group === undefined ? (
          run.items.map(({ o, i }) => chip(o, i))
        ) : (
          <span key={run.group} role="presentation" className="chip-subgroup" data-group={run.group}>
            {run.items.map(({ o, i }) => chip(o, i))}
            {r < runs.length - 1 && <span className="chip-divider" aria-hidden="true" />}
          </span>
        ),
      )}
    </div>
  );
}

export interface ChoiceChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** A standalone on/off chip (aria-pressed), e.g. "Edit fingering". */
  pressed?: boolean;
}

/** A single chip that toggles (aria-pressed) — same look as a ChipGroup chip. */
export const ChoiceChip = forwardRef<HTMLButtonElement, ChoiceChipProps>(function ChoiceChip(
  { pressed, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      className={['chip', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
});
