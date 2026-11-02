import { forwardRef } from 'react';
import type { CSSProperties, SelectHTMLAttributes } from 'react';

/**
 * SELECT TRIGGER (design system v2, D-28) — a native <select> dressed as the
 * pill with a caret ("E ▾", "Melodic minor ▾"). Native on purpose: phones get
 * their own picker, keyboards and screen readers get a real combobox. At
 * least --tap tall. Pass `aria-label` (or wrap it in a <label>).
 */
export interface SelectTriggerProps extends SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
}

export const SelectTrigger = forwardRef<HTMLSelectElement, SelectTriggerProps>(function SelectTrigger(
  { wrapperClassName, wrapperStyle, children, ...rest },
  ref,
) {
  return (
    <span className={['select-trigger', wrapperClassName].filter(Boolean).join(' ')} style={wrapperStyle}>
      <select ref={ref} {...rest}>
        {children}
      </select>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
});
