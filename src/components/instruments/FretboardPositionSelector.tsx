import { useTranslation } from 'react-i18next';
import { POSITION_NUMBERS, MAX_POSITION, OPEN_POSITION, toRomanNumeral } from '../../core/utils/guitarPositions.ts';
import type { FretboardLabelMode } from '../../state/fingeringStore.ts';
import { ChipGroup, ChoiceChip } from '../ui/ChoiceChip.tsx';
import { Segment } from '../ui/Segment.tsx';
import { SelectTrigger } from '../ui/SelectTrigger.tsx';
import { Button, IconButton } from '../ui/Button.tsx';

// Group labels ("Position:", "Show:") — 14 px muted (D-28 UI step).
const GROUP_LABEL_CLASS = 'text-ui shrink-0';
const GROUP_LABEL_STYLE: React.CSSProperties = { color: 'var(--text-muted)' };

// ─── Chord shapes ───────────────────────────────────────────────────────────

interface ChordShapeSelectorProps {
  shapeCount: number;
  labels: string[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
}

/** Which grip of the chord: a ChipGroup (one of many — D-28 choice chip). */
export function ChordShapeSelector({ shapeCount, labels, selectedIdx, onSelect }: ChordShapeSelectorProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={GROUP_LABEL_CLASS} style={GROUP_LABEL_STYLE} aria-hidden="true">{t('fretboard.position')}</span>
      <ChipGroup
        label={t('fretboard.chordPosition')}
        value={selectedIdx}
        onChange={onSelect}
        options={Array.from({ length: shapeCount }, (_, idx) => ({ value: idx, label: labels[idx] }))}
      />
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
}

/**
 * Open, I–XII, All. A radiogroup of chips (audit W9-05: these used to
 * announce themselves as tabs without behaving like tabs); on phones a
 * select. ‹ › step one position.
 */
export function ScalePositionSelector({ position, onSelect, onStep, mobile = false }: ScalePositionSelectorProps) {
  const { t } = useTranslation();
  const name = (n: number) => (n === OPEN_POSITION ? t('fretboard.open') : toRomanNumeral(n));
  // The numeral names the position; the fret is a plain number (review B2).
  // Position I gets its own line so it reads differently from Open (#4).
  const title = (n: number) =>
    n === OPEN_POSITION
      ? t('fretboard.openPositionTitle')
      : n === 1
        ? t('fretboard.positionOneTitle')
        : t('fretboard.positionTitle', { numeral: toRomanNumeral(n), fret: n });
  const prevDisabled = position === OPEN_POSITION;
  const nextDisabled = position === MAX_POSITION;

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
    <div className="flex items-center gap-2 min-w-0 basis-full lg:basis-auto" data-testid="position-row">
      <span className={GROUP_LABEL_CLASS} style={GROUP_LABEL_STYLE} aria-hidden="true">{t('fretboard.position')}</span>
      {stepButton(-1)}
      {mobile ? (
        <SelectTrigger
          value={String(position)}
          onChange={(e) => onSelect(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          aria-label={t('fretboard.scalePosition')}
        >
          {POSITION_NUMBERS.map((n) => (
            <option key={n} value={n}>{name(n)}</option>
          ))}
          <option value="all">{t('fretboard.all')}</option>
        </SelectTrigger>
      ) : (
        <ChipGroup<number | 'all'>
          label={t('fretboard.scalePosition')}
          className="chip-row-scroll min-w-0 flex-1 lg:flex-none"
          value={position}
          onChange={onSelect}
          options={[
            ...POSITION_NUMBERS.map((n) => ({ value: n as number | 'all', label: name(n), title: title(n) })),
            { value: 'all' as const, label: t('fretboard.all'), title: t('fretboard.allTitle') },
          ]}
        />
      )}
      {stepButton(1)}
    </div>
  );
}

// ─── Dot labels + fingering editor ──────────────────────────────────────────

interface LabelToolbarProps {
  labelMode: FretboardLabelMode;
  onLabelMode: (m: FretboardLabelMode) => void;
  /** Position view: finger labels and the fingering editor are available. */
  positionView: boolean;
  editing: boolean;
  onToggleEdit: () => void;
  onResetFingering: () => void;
  hasOverrides: boolean;
}

export function LabelToolbar({
  labelMode,
  onLabelMode,
  positionView,
  editing,
  onToggleEdit,
  onResetFingering,
  hasOverrides,
}: LabelToolbarProps) {
  const { t } = useTranslation();
  const modes: { mode: FretboardLabelMode; key: string }[] = [
    ...(positionView ? [{ mode: 'finger' as const, key: 'fretboard.labelFinger' }] : []),
    { mode: 'degree', key: 'fretboard.labelDegree' },
    { mode: 'note', key: 'fretboard.labelNote' },
  ];
  // On the whole neck there are no fingers: 'finger' falls back to notes.
  const shown: FretboardLabelMode = editing ? 'finger' : !positionView && labelMode === 'finger' ? 'note' : labelMode;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={GROUP_LABEL_CLASS} style={GROUP_LABEL_STYLE} aria-hidden="true">{t('fretboard.show')}</span>
      {/* What the dots say switches the board's VIEW: a Segment (D-28). */}
      <Segment
        label={t('fretboard.labelsGroup')}
        value={shown}
        onChange={onLabelMode}
        disabled={editing}
        options={modes.map(({ mode, key }) => ({ value: mode, label: t(key) }))}
      />
      {positionView && (
        <>
          <ChoiceChip pressed={editing} onClick={onToggleEdit}>
            {editing ? t('fretboard.doneEditing') : t('fretboard.editFingering')}
          </ChoiceChip>
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
      <span className="inline-flex items-center gap-1">
        <span data-legend="stretch" aria-hidden="true" style={{ ...swatch, outline: '2px dashed var(--text)', outlineOffset: 1 }} />
        {t('fretboard.legendStretch')}
      </span>
      <span className="inline-flex items-center gap-1">
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
