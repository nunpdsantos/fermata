/** Button variants (design system v2, D-28). `accent` / `ghost` are v1 aliases. */
export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'link' | 'accent' | 'ghost';
/** `lg` = the big thumb-zone action (Drill's Continue). `sm` is a v1 name for md. */
export type ButtonSize = 'md' | 'lg' | 'sm';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  accent: 'btn-primary',
  secondary: 'btn-secondary',
  quiet: 'btn-quiet',
  ghost: 'btn-quiet',
  link: 'btn-link',
};

/** The class list of a v2 button — also for an `<a>` or `<label>` that must look like one. */
export function buttonClass({
  variant = 'secondary',
  size = 'md',
  block = false,
}: { variant?: ButtonVariant; size?: ButtonSize; block?: boolean } = {}): string {
  return ['btn', VARIANT_CLASS[variant], size === 'lg' ? 'btn-lg' : '', block ? 'btn-block' : ''].filter(Boolean).join(' ');
}
