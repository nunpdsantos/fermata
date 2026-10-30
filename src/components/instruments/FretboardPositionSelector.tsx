import { useTranslation } from 'react-i18next';
import { POSITION_NUMBERS, MAX_POSITION, OPEN_POSITION, toRomanNumeral } from '../../core/utils/guitarPositions.ts';
import type { FretboardLabelMode } from '../../state/fingeringStore.ts';
import { CHIP_CLASS, CHIP_TEXT_PX, chipStyle } from './fretboardConstants.ts';

const GROUP_LABEL_STYLE: React.CSSProperties = { fontSize: CHIP_TEXT_PX, color: 'var(--text-muted)' };

// ─── Chord shapes ───────────────────────────────────────────────────────────

interface ChordShapeSelectorProps {
  shapeCount: number;
  labels: string[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
}

export function ChordShapeSelector({ shapeCount, labels, selectedIdx, onSelect }: ChordShapeSelectorProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span style={GROUP_LABEL_STYLE}>{t('fretboard.position')}</span>
      <div role="tablist" aria-label={t('fretboard.chordPosition')} className="flex items-center gap-1 flex-wrap">
        {Array.from({ length: shapeCount }, (_, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={selectedIdx === idx}
            onClick={() => onSelect(idx)}
            className={CHIP_CLASS}
            style={chipStyle(selectedIdx === idx)}
          >
            {labels[idx]}
          </button>
        ))}
      </div>
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
      <button
        type="button"
        aria-label={label}
        title={`${label} (${delta === -1 ? '[' : ']'})`}
        disabled={disabled}
        onClick={() => onStep(delta)}
        className={CHIP_CLASS}
        style={{ ...chipStyle(false, disabled), fontSize: 16, lineHeight: 1 }}
      >
        {delta === -1 ? '‹' : '›'}
      </button>
    );
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span style={GROUP_LABEL_STYLE}>{t('fretboard.position')}</span>
      {stepButton(-1)}
      {mobile ? (
        <select
          value={String(position)}
          onChange={(e) => onSelect(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          aria-label={t('fretboard.scalePosition')}
          className="rounded cursor-pointer bg-transparent"
          style={{ ...chipStyle(true), paddingRight: 4 }}
        >
          {POSITION_NUMBERS.map((n) => (
            <option key={n} value={n}>{name(n)}</option>
          ))}
          <option value="all">{t('fretboard.all')}</option>
        </select>
      ) : (
        <div role="tablist" aria-label={t('fretboard.scalePosition')} className="flex items-center gap-1 flex-wrap">
          {POSITION_NUMBERS.map((n) => (
            <button
              key={n}
              type="button"
              role="tab"
              aria-selected={position === n}
              title={title(n)}
              onClick={() => onSelect(n)}
              className={CHIP_CLASS}
              style={chipStyle(position === n)}
            >
              {name(n)}
            </button>
          ))}
          <button
            type="button"
            role="tab"
            aria-selected={position === 'all'}
            title={t('fretboard.allTitle')}
            onClick={() => onSelect('all')}
            className={CHIP_CLASS}
            style={chipStyle(position === 'all')}
          >
            {t('fretboard.all')}
          </button>
        </div>
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
    <div className="flex items-center gap-1.5 flex-wrap">
      <span style={GROUP_LABEL_STYLE}>{t('fretboard.show')}</span>
      <div role="group" aria-label={t('fretboard.labelsGroup')} className="flex items-center gap-1">
        {modes.map(({ mode, key }) => (
          <button
            key={mode}
            type="button"
            aria-pressed={shown === mode}
            disabled={editing}
            onClick={() => onLabelMode(mode)}
            className={CHIP_CLASS}
            style={chipStyle(shown === mode, editing && shown !== mode)}
          >
            {t(key)}
          </button>
        ))}
      </div>
      {positionView && (
        <>
          <button
            type="button"
            aria-pressed={editing}
            onClick={onToggleEdit}
            className={CHIP_CLASS}
            style={chipStyle(editing)}
          >
            {editing ? t('fretboard.doneEditing') : t('fretboard.editFingering')}
          </button>
          {editing && (
            <>
              <button
                type="button"
                disabled={!hasOverrides}
                onClick={onResetFingering}
                className={CHIP_CLASS}
                style={chipStyle(false, !hasOverrides)}
              >
                {t('fretboard.resetFingering')}
              </button>
              <span role="status" style={{ fontSize: CHIP_TEXT_PX, color: 'var(--text-muted)' }}>
                {t('fretboard.editHint')}
              </span>
            </>
          )}
          <PositionLegend />
        </>
      )}
    </div>
  );
}

/** What the two dot marks mean (review #3): same marks as FretCell draws. */
function PositionLegend() {
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
      className="inline-flex items-center gap-3 flex-wrap"
      style={{ fontSize: CHIP_TEXT_PX - 1, color: 'var(--text-muted)' }}
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
