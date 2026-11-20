import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { POSITION_NUMBERS, OPEN_POSITION, toRomanNumeral } from '../../core/utils/guitarPositions.ts';
import type { FretboardLabelMode } from '../../state/fingeringStore.ts';
import { ChipGroup, ChoiceChip } from '../ui/ChoiceChip.tsx';
import { Segment } from '../ui/Segment.tsx';
import { SelectTrigger } from '../ui/SelectTrigger.tsx';
import { Button, IconButton } from '../ui/Button.tsx';
import { EdgeFade } from '../ui/EdgeFade.tsx';

// Group labels ("Position:", "Show:") — 14 px muted (D-28 UI step).
const GROUP_LABEL_CLASS = 'text-ui shrink-0';
const GROUP_LABEL_STYLE: React.CSSProperties = { color: 'var(--text-muted)' };

// ─── Chord shapes ───────────────────────────────────────────────────────────

/** The edge fades' width (index.css `.edge-fade::before / ::after`, 18 px), kept clear beside the selected chip. */
const EDGE_FADE_PX = 18;

interface ChordShapeSelectorProps {
  shapeCount: number;
  labels: string[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
  /**
   * The dock's controls row: the chips stay on ONE line and scroll sideways
   * with the app's edge fade where they do not fit (index.css
   * .chord-shapes-line: beside "Flip neck" and the tuning from 640 px, which
   * take width from the chips; a line of their own below). Their line is
   * never narrower than its label, the widest chip as drawn selected and both
   * fades (measured below, the same whichever chip is selected), so where the
   * row cannot hold that beside the other controls the row breaks onto
   * another line rather than cut a chip; the selected chip is placed again on
   * any change of the row's box.
   * The full neck's header keeps the wrapping chips.
   */
  oneLine?: boolean;
}

/**
 * A chip's width as it is drawn selected: its text in the selected chip's
 * font (weight included), its letter-spacing after every character and its
 * word-spacing after every space, as the browser adds them (a learner's own
 * text spacing, WCAG 1.4.12, changes both), the padding and the border, at
 * least the chip's minimum width. The same whichever chip is selected.
 * Without a 2D canvas (a browser that gives none: a test's DOM never gets
 * here, its chips have no width) its width as drawn.
 */
function selectedWidth(chip: HTMLElement, selected: HTMLElement, pen: CanvasRenderingContext2D | null): number {
  if (!pen) return chip.getBoundingClientRect().width;
  const on = getComputedStyle(selected);
  const text = chip.textContent ?? '';
  pen.font = `${on.fontStyle} ${on.fontWeight} ${on.fontSize} ${on.fontFamily}`;
  const px = (v: string) => parseFloat(v) || 0; // "normal" is no spacing
  const spaces = text.match(/[ \u00a0]/g)?.length ?? 0;
  const width = pen.measureText(text).width + px(on.letterSpacing) * Array.from(text).length + px(on.wordSpacing) * spaces
    + px(on.paddingLeft) + px(on.paddingRight) + px(on.borderLeftWidth) + px(on.borderRightWidth);
  return Math.max(width, px(on.minWidth));
}

/** Which grip of the chord: a ChipGroup (one of many — D-28 choice chip). */
export function ChordShapeSelector({ shapeCount, labels, selectedIdx, onSelect, oneLine = false }: ChordShapeSelectorProps) {
  const { t } = useTranslation();
  const rowRef = useRef<HTMLDivElement>(null);
  // The selected chip whole, in view and clear of both edge fades (where a
  // fade shows; an end with nothing beyond it shows none): its row scrolls
  // sideways, nothing else moves. The chips' line is never narrower than its
  // label, the gap, the WIDEST chip of the row as it is drawn selected (bolder:
  // `.chip[aria-checked="true"]`) and room for both fades: a minimum width
  // measured here (no CSS sizes a scroller to one of its children). Each
  // chip's selected width is its text measured in the selected chip's font
  // (canvas text metrics: the page is not touched, as a hidden copy in the
  // row would be, which the edge fade's MutationObserver answers by
  // observing the row again) plus its letter-spacing, word-spacing, padding and border. The widest, not the selected one, and each as drawn
  // selected: the line's minimum, and so where the notice goes (index.css,
  // from 1280 px it may share the controls' line) and the dock's height, are
  // the same whichever grip the learner picks (from the selected chip, the
  // line changed under a narrower chip, the notice moved up and the row
  // shrank AFTER the chip was placed: GitHub's Linux, run #71 at b4fc9ab,
  // chip 5 of 8 at 1024 px with wider text).
  // The chip is placed again whenever the row's own box changes, whatever
  // changed it (a notice arriving or leaving, the window, a font, a min-width
  // still transitioning under reduced motion), and the minimum re-measured
  // when a chip or the label changes size. This cannot loop: the minimum
  // depends only on the chips and the label, and placing only scrolls. A
  // new minimum noticed by the observer is written in the next frame: written
  // inside its callback, the row's box (shallower than the chips it was told
  // about) changes there and then, and Chromium reports "ResizeObserver loop
  // completed with undelivered notifications" though nothing loops.
  useLayoutEffect(() => {
    const line = rowRef.current;
    const row = line?.querySelector<HTMLElement>('.chip-group');
    if (!oneLine || !line || !row) return;
    // The box the fades are painted on (`.edge-fade`): the scroller itself
    // sits 2 px outside it (its margin −2 px, padding 2 px, room for a chip's
    // focus ring), so measuring the scroller left the chip 2 px under each
    // fade (cold review, F4).
    const box = row.closest<HTMLElement>('.edge-fade') ?? row;
    const label = line.firstElementChild as HTMLElement | null;
    // Asked for once, and only once a chip is laid out: a test's DOM has no
    // canvas and says so in the log each time it is asked for one.
    let pen: CanvasRenderingContext2D | null | undefined;
    let frame = 0;
    const place = (observed: boolean) => {
      const chip = row.querySelector<HTMLElement>('[aria-checked="true"]');
      if (!chip || chip.getBoundingClientRect().width <= 0) return; // not laid out (a test's DOM): nothing to keep
      if (pen === undefined) pen = document.createElement('canvas').getContext('2d');
      const ink = pen;
      const chips = Array.from(row.querySelectorAll<HTMLElement>('[role="radio"]'));
      const widest = Math.max(...chips.map((c) => selectedWidth(c, chip, ink)));
      const fades = chips.length > 1 ? EDGE_FADE_PX : 0;
      const gap = parseFloat(getComputedStyle(line).columnGap) || 0;
      const min = `${Math.ceil((label?.getBoundingClientRect().width ?? 0) + gap + widest + 2 * fades)}px`;
      if (line.style.minWidth !== min) {
        if (!observed) line.style.minWidth = min;
        else {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => place(false));
        }
      }
      const b = box.getBoundingClientRect();
      const at = chip.getBoundingClientRect();
      // Whole pixels, rounded towards clear: a scroll position is kept in whole
      // pixels, so a fractional move could leave the chip half a pixel under.
      if (at.left < b.left + fades) row.scrollLeft -= Math.ceil(b.left + fades - at.left);
      else if (at.right > b.right - fades) row.scrollLeft += Math.ceil(at.right - (b.right - fades));
    };
    place(false);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => place(true));
    observer.observe(box);
    for (const c of Array.from(row.querySelectorAll('[role="radio"]'))) observer.observe(c);
    if (label) observer.observe(label);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [oneLine, selectedIdx, labels]);
  const group = (
    <ChipGroup
      label={t('fretboard.chordPosition')}
      className={oneLine ? 'chip-row-scroll' : undefined}
      value={selectedIdx}
      onChange={onSelect}
      options={Array.from({ length: shapeCount }, (_, idx) => ({ value: idx, label: labels[idx] }))}
    />
  );
  return (
    <div ref={rowRef} className={oneLine ? 'chord-shapes-line flex items-center gap-2' : 'flex items-center gap-2 flex-wrap'}>
      <span className={GROUP_LABEL_CLASS} style={GROUP_LABEL_STYLE} aria-hidden="true" data-term="position">{t('fretboard.position')}</span>
      {oneLine ? <EdgeFade>{group}</EdgeFade> : group}
    </div>
  );
}

// ─── Classical scale positions (Open, I–XII, All) ───────────────────────────

interface ScalePositionSelectorProps {
  /** 0 = Open, 1–12 = I–XII, 'all' = whole neck. */
  position: number | 'all';
  onSelect: (p: number | 'all') => void;
  onStep: (delta: 1 | -1) => void;
  mobile?: boolean;
  /** Takes a row of its own below 1024 px (the dock's controls); false in
   *  the laptop dock bar and the full-neck view's header. */
  fullRow?: boolean;
  /** The positions offered (default Open, I–XII). With a capo: Open (at the capo) and those above it. */
  positions?: readonly number[];
  /** A capo on this fret (0 = none): the Open position's title says it starts at the capo. */
  capo?: number;
}

/**
 * Open, I–XII, All. A radiogroup of chips (audit W9-05: these used to
 * announce themselves as tabs without behaving like tabs); on phones a
 * select. ‹ › step one position.
 */
export function ScalePositionSelector({ position, onSelect, onStep, mobile = false, fullRow = true, positions = POSITION_NUMBERS, capo = 0 }: ScalePositionSelectorProps) {
  const { t } = useTranslation();
  const name = (n: number) => (n === OPEN_POSITION ? t('fretboard.open') : toRomanNumeral(n));
  // The numeral names the position; the fret is a plain number (review B2).
  // Position I gets its own line so it reads differently from Open (#4).
  const title = (n: number) =>
    n === OPEN_POSITION
      ? capo > 0 ? t('capo.openPositionTitle', { fret: capo, from: capo + 1, to: capo + 4 }) : t('fretboard.openPositionTitle')
      : n === 1
        ? t('fretboard.positionOneTitle')
        : t('fretboard.positionTitle', { numeral: toRomanNumeral(n), fret: n });
  const prevDisabled = position === positions[0];
  const nextDisabled = position === positions[positions.length - 1];

  const stepButton = (delta: 1 | -1) => {
    const disabled = delta === -1 ? prevDisabled : nextDisabled;
    const label = delta === -1 ? t('fretboard.prevPosition') : t('fretboard.nextPosition');
    return (
      <IconButton
        variant="secondary"
        aria-label={label}
        title={`${label} (${delta === -1 ? '[' : ']'})`}
        disabled={disabled}
        onClick={() => onStep(delta)}
        icon={<span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>{delta === -1 ? '‹' : '›'}</span>}
      />
    );
  };

  // ‹ chips › stay on ONE line (the chips scroll inside it when the row is
  // narrow) — at 768 px the steppers used to wrap onto lines of their own.
  return (
    <div className={`flex items-center gap-2 min-w-0${fullRow ? ' basis-full lg:basis-auto' : ''}`} data-testid="position-row">
      <span className={GROUP_LABEL_CLASS} style={GROUP_LABEL_STYLE} aria-hidden="true" data-term="position">{t('fretboard.position')}</span>
      {stepButton(-1)}
      {mobile ? (
        <SelectTrigger
          value={String(position)}
          onChange={(e) => onSelect(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          aria-label={t('fretboard.scalePosition')}
        >
          {positions.map((n) => (
            <option key={n} value={n}>{name(n)}</option>
          ))}
          <option value="all">{t('fretboard.all')}</option>
        </SelectTrigger>
      ) : (
        // One sideways row: the edge fades say there are more positions
        // (only while there are), like the other chip rows (#53).
        <EdgeFade className="position-chips min-w-0 flex-1 lg:flex-none">
          <ChipGroup<number | 'all'>
            label={t('fretboard.scalePosition')}
            className="chip-row-scroll"
            value={position}
            onChange={onSelect}
            options={[
              ...positions.map((n) => ({ value: n as number | 'all', label: name(n), title: title(n) })),
              { value: 'all' as const, label: t('fretboard.all'), title: t('fretboard.allTitle') },
            ]}
          />
        </EdgeFade>
      )}
      {stepButton(1)}
    </div>
  );
}

// ─── Dot labels + fingering editor ──────────────────────────────────────────

interface LabelToolbarProps {
  /**
   * 'all' (default): Show: [Fingers | Degrees | Notes] and the fingering
   * editor. 'labels': only the label toggle (the laptop dock bar and the
   * full-neck view). 'edit': only the fingering editor (beside it).
   */
  part?: 'all' | 'labels' | 'edit';
  labelMode: FretboardLabelMode;
  onLabelMode: (m: FretboardLabelMode) => void;
  /** Position view: finger labels and the fingering editor are available. */
  positionView: boolean;
  editing: boolean;
  onToggleEdit: () => void;
  onResetFingering: () => void;
  hasOverrides: boolean;
  /** Right after the fingering editor's chip, on its line ("Flip neck", 2026-11-14). */
  afterEdit?: React.ReactNode;
}

export function LabelToolbar({
  part = 'all',
  labelMode,
  onLabelMode,
  positionView,
  editing,
  onToggleEdit,
  onResetFingering,
  hasOverrides,
  afterEdit,
}: LabelToolbarProps) {
  const { t } = useTranslation();
  const modes: { mode: FretboardLabelMode; key: string }[] = [
    ...(positionView ? [{ mode: 'finger' as const, key: 'fretboard.labelFinger' }] : []),
    { mode: 'degree', key: 'fretboard.labelDegree' },
    { mode: 'note', key: 'fretboard.labelNote' },
  ];
  // On the whole neck there are no fingers: 'finger' falls back to notes.
  const shown: FretboardLabelMode = editing ? 'finger' : !positionView && labelMode === 'finger' ? 'note' : labelMode;

  if (part === 'edit' && !positionView) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {part !== 'edit' && (
        <>
          <span className={GROUP_LABEL_CLASS} style={GROUP_LABEL_STYLE} aria-hidden="true">{t('fretboard.show')}</span>
          {/* What the dots say switches the board's VIEW: a Segment (D-28). */}
          <Segment
            label={t('fretboard.labelsGroup')}
            value={shown}
            onChange={onLabelMode}
            disabled={editing}
            options={modes.map(({ mode, key }) => ({ value: mode, label: mode === 'finger' ? <span data-term="fingerNumbers">{t(key)}</span> : mode === 'degree' ? <span data-term="degree">{t(key)}</span> : t(key) }))}
          />
        </>
      )}
      {positionView && part !== 'labels' && (
        <>
          <ChoiceChip pressed={editing} onClick={onToggleEdit}>
            {editing ? t('fretboard.doneEditing') : t('fretboard.editFingering')}
          </ChoiceChip>
          {afterEdit}
          {editing && (
            <>
              <Button disabled={!hasOverrides} onClick={onResetFingering}>
                {t('fretboard.resetFingering')}
              </Button>
              <span role="status" className="text-ui" style={{ color: 'var(--text-muted)' }}>
                {t('fretboard.editHint')}
              </span>
            </>
          )}
        </>
      )}
    </div>
  );
}

/**
 * What the two dot marks mean (review #3): same marks as FretCell draws.
 * Rendered by the Fretboard's control row AFTER the tuning select, so on a
 * tablet Show / Edit fingering / Tuning share one line and only the legend
 * wraps (the guitar dock was 604 px tall at 768 px; W11-A review).
 */
export function PositionLegend() {
  const { t } = useTranslation();
  const swatch: React.CSSProperties = {
    display: 'inline-block',
    width: 12,
    height: 12,
    borderRadius: '50%',
    verticalAlign: 'middle',
    position: 'relative',
    backgroundColor: 'var(--border)',
  };
  return (
    <span
      data-testid="position-legend"
      className="inline-flex items-center gap-3 flex-wrap text-caption"
      style={{ color: 'var(--text-muted)' }}
    >
      {/* gap-2: the dashed ring is an OUTLINE (3 px outside the swatch), so
          gap-1 left it touching its words (W11-A review). */}
      <span className="inline-flex items-center gap-2">
        <span data-legend="stretch" aria-hidden="true" style={{ ...swatch, outline: '2px dashed var(--text)', outlineOffset: 1, marginLeft: 3 }} />
        <span data-term="stretch">{t('fretboard.legendStretch')}</span>
      </span>
      <span className="inline-flex items-center gap-2">
        <span data-legend="edited" aria-hidden="true" style={swatch}>
          <span
            style={{ position: 'absolute', width: 6, height: 6, top: -1, right: -1, borderRadius: '50%', backgroundColor: 'var(--text)', border: '1px solid var(--bg)' }}
          />
        </span>
        {t('fretboard.legendEdited')}
      </span>
    </span>
  );
}
