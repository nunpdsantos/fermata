import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { GuitarTuning } from '../../core/constants/guitarTunings';
import { getTuningStringLabels } from '../../core/constants/guitarTunings';
import { toRomanNumeral, tuningOpenMidi } from '../../core/utils/guitarPositions';
import { midiToNote } from '../../core/utils/pianoLayout';
import type { FingeredNote } from '../../core/utils/guitarFingering';
import { FretboardString } from '../instruments/FretboardString';
import { ACCENT_FILL, type FretNote, type PositionDot } from '../instruments/fretboardConstants';
import type { PracticeRoute } from './practiceModel';
import { practiceNeckLayout } from './practiceNeckLayout';

const EMPTY = new Map();
const color = () => ACCENT_FILL;

/** Same string/cell renderer as Fretboard, nut RIGHT, bass string TOP.
 * A window of at least five frets follows the displayed passage; no tiny whole-neck dots on phones.
 * The current event wins when the passage revisits a cell with another finger.
 */
export function PracticeNeck({ route, index, tuning, fingerFor, edited, onNote }: {
  route: PracticeRoute; index: number; tuning: GuitarTuning;
  fingerFor: (event: number, n: FingeredNote) => number;
  edited: (event: number, n: FingeredNote) => boolean;
  onNote: (event: number, n: FingeredNote) => void;
}) {
  const { t } = useTranslation();
  const current = route.events[index];
  const { guide, departure, places, frets, low } = practiceNeckLayout(route, index);
  const guideText = guide ? t('practice.guide', { finger: guide.shift!.finger, string: 6 - guide.stringIndex,
    from: toRomanNumeral(guide.shift!.fromPosition), to: toRomanNumeral(guide.shift!.toPosition) }) : '';
  const open = useMemo(() => tuningOpenMidi(tuning), [tuning]);
  const names = getTuningStringLabels(tuning);
  const getFretNote = (stringIndex: number, fret: number): FretNote => ({ stringIndex, fret, midiNumber: open[stringIndex] + fret, pitchClass: (open[stringIndex] + fret) % 12 });
  const activate = (fn: FretNote) => {
    const place = places.get(`${fn.stringIndex}:${fn.fret}`);
    if (place) onNote(place.event, place.note);
  };
  return (
    <div className="practice-neck" data-testid="practice-neck" role="group" aria-label={t('fretboard.label')}>
      {guide && <p className="text-caption px-2 pb-2" data-testid="neck-guide">{guideText}</p>}
      <div className="flex text-caption text-center" aria-hidden="true" style={{ paddingLeft: 32, paddingRight: 46 + (low > 1 ? 24 : 0) }}>
        {frets.map((f) => <span className="flex-1" key={f}>{f}</span>)}
      </div>
      {[0, 1, 2, 3, 4, 5].map((s) => {
        const dots = new Map<number, PositionDot>();
        for (const { event, note: n } of places.values()) {
          if (n.stringIndex !== s) continue;
          const isGuide = guide && (n === guide || n === departure);
          dots.set(n.fret, { label: `${fingerFor(event, n)}${isGuide ? '↗' : ''}`, isRoot: false, isStretch: !!n.reach || (n.position !== null && (n.fret < n.position || n.fret > n.position + 3)),
            isEdited: edited(event, n), description: isGuide ? guideText : t('practice.finger', { finger: fingerFor(event, n) }) });
        }
        return <FretboardString key={s} stringIdx={s} visibleFrets={frets} fretMinWidth={0} mobile={false}
          isChordView atNut showFretBreak={low > 1} mode="position" stringName={names[s]} activeNotes={new Set()}
          rootPitchClass={null} getNoteColor={color} spellPitchClass={(pc) => [...places.values()].find(({ note }) => note.midi % 12 === pc)?.note.note ?? midiToNote(60 + pc)}
          getFretNote={getFretNote} onCellActivate={activate} currentShape={null} voicingLookup={EMPTY}
          positionDots={dots} scaleLabelFor={() => ''} highlightPcs={null} focusedFret={null}
          focusFrets={new Set(current.notes.filter((n) => n.stringIndex === s).map((n) => n.fret))} rowHeight={34} />;
      })}
    </div>
  );
}
