import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { buttonClass, type ButtonSize, type ButtonVariant } from './buttonClass';

/**
 * Button (design system v2, D-28).
 *  - primary   — the one main action on a surface (solid accent, --on-accent text)
 *  - secondary — other actions (card fill, border)
 *  - quiet     — low-emphasis actions, toolbars (no fill until hover)
 *  - link      — an accent-coloured quiet action ("Learn about this →")
 * Every button is at least --tap tall (36 px with a mouse, 44 px on touch).
 * `accent` and `ghost` are the v1 names, kept as aliases of primary / quiet.
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Full width. */
  block?: boolean;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    block = false,
    loading = false,
    disabled,
    startIcon,
    endIcon,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const classes = [buttonClass({ variant, size, block }), className].filter(Boolean).join(' ');
  const isInert = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isInert}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      className={classes}
      {...rest}
    >
      {loading ? <Spinner /> : startIcon}
      {children}
      {!loading && endIcon}
    </button>
  );
});

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'startIcon' | 'endIcon' | 'aria-label'> {
  /** Required: an icon button has no visible text. */
  'aria-label': string;
  icon: ReactNode;
}

/** A square --tap button showing only an icon; the name is its aria-label. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, variant = 'quiet', className, ...rest },
  ref,
) {
  return (
    <Button ref={ref} variant={variant} className={['btn-icon', className].filter(Boolean).join(' ')} {...rest}>
      {icon}
    </Button>
  );
});

function Spinner() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="animate-spin shrink-0"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M12 2 A 10 10 0 0 1 22 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
