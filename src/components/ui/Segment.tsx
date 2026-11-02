import type { CSSProperties, ReactNode } from 'react';
import { handleRovingKey, tabStopIndex } from './roving';

/**
 * SEGMENT (design system v2, D-28) — switches a VIEW: Piano/Guitar,
 * Notes/Fingers, Day/Night/Auto, English/Português/Español, and the app's
 * Explore/Learn/Drill tabs.
 *
 * `mode="tabs"` only where it really switches panels (the app views: each
 * tab controls a tabpanel); everywhere else it is a radiogroup. Both use the
 * same keyboard pattern as ChipGroup (one Tab stop, arrows move and select).
 * The selected segment is painted ON the button itself — nothing is measured,
 * so the highlight cannot drift from its label when fonts load, the window
 * resizes or the language changes (the old sliding indicator could).
 */
export interface SegmentOption<T extends string> {
  value: T;
  label: ReactNode;
  ariaLabel?: string;
  /** tabs mode: id of the tabpanel this tab controls. */
  controls?: string;
  id?: string;
  data?: Record<`data-${string}`, string>;
}

export interface SegmentProps<T extends string> {
  label: string;
  value: T;
  options: readonly SegmentOption<T>[];
  onChange: (value: T) => void;
  mode?: 'radio' | 'tabs';
  /** The whole segment is inactive (e.g. while another mode owns the view). */
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  style?: CSSProperties;
}

export function Segment<T extends string>({
  label,
  value,
  options,
  onChange,
  mode = 'radio',
  disabled = false,
  className,
  buttonClassName,
  style,
}: SegmentProps<T>) {
  const tabs = mode === 'tabs';
  const enabled = options.map(() => !disabled);
  const selected = options.findIndex((o) => o.value === value);
  const stop = tabStopIndex(selected, enabled);

  return (
    <div
      role={tabs ? 'tablist' : 'radiogroup'}
      aria-label={label}
      className={['seg', className].filter(Boolean).join(' ')}
      style={style}
      onKeyDown={(e) => handleRovingKey(e, selected >= 0 ? selected : stop, enabled, (i) => onChange(options[i].value))}
    >
      {options.map((o, i) => {
        const on = i === selected;
        return (
          <button
            key={o.value}
            id={o.id}
            type="button"
            role={tabs ? 'tab' : 'radio'}
            aria-selected={tabs ? on : undefined}
            aria-checked={tabs ? undefined : on}
            aria-controls={tabs ? o.controls : undefined}
            aria-label={o.ariaLabel}
            tabIndex={i === stop ? 0 : -1}
            disabled={disabled}
            data-roving-item=""
            className={['seg-btn', buttonClassName].filter(Boolean).join(' ')}
            onClick={() => onChange(o.value)}
            {...o.data}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
