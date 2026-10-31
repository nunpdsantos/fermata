import type { ReactNode } from 'react';

/**
 * LIST ROW (design system v2, D-28) — one line of a list or a settings
 * sheet: optional leading mark, a title with an optional meta line beneath,
 * optional trailing controls. A row with `onClick` is a button (whole row is
 * the target); otherwise a plain row that holds its own controls. At least
 * max(--tap, 52 px) tall.
 */
export interface ListRowProps {
  title: ReactNode;
  meta?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  /** id of the title element, for aria-labelledby on trailing controls. */
  titleId?: string;
  className?: string;
  /** Stack the trailing controls under the title (narrow screens). */
  wrap?: boolean;
}

export function ListRow({ title, meta, leading, trailing, onClick, titleId, className, wrap = false }: ListRowProps) {
  const body = (
    <>
      {leading && <span className="shrink-0">{leading}</span>}
      <span className="flex-1 min-w-0">
        <span id={titleId} className="block" style={{ color: 'var(--text)' }}>{title}</span>
        {meta && (
          <span className="block text-ui" style={{ color: 'var(--text-dim)' }}>
            {meta}
          </span>
        )}
      </span>
      {trailing && <span className="shrink-0 flex items-center gap-2 max-w-full">{trailing}</span>}
    </>
  );
  const classes = ['list-row', wrap ? 'flex-wrap' : '', className].filter(Boolean).join(' ');
  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick}>
        {body}
      </button>
    );
  }
  return <div className={classes}>{body}</div>;
}
