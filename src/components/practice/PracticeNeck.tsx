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

const EMPTY = new Map();
const color = () => ACCENT_FILL;

/** Same string/cell renderer as Fretboard, nut RIGHT, bass string TOP.
 * A five-fret window follows the current hand; no tiny whole-neck dots on phones.
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
  const guide = current.notes.find((n) => n.shift?.kind === 'guide');
  const departure = guide && index > 0 ? route.events[index - 1].notes.find((n) => n.stringIndex === guide.stringIndex) : undefined;
  const guideText = guide ? t('practice.guide', { finger: guide.shift!.finger, string: 6 - guide.stringIndex,
    from: toRomanNumeral(guide.shift!.fromPosition), to: toRomanNumeral(guide.shift!.toPosition) }) : '';
  const fretted = [...current.notes, ...(departure ? [departure] : [])].filter((n) => n.fret > 0).map((n) => n.fret);
  const width = Math.max(5, Math.max(...fretted, 1) - Math.min(...(fretted.length ? fretted : [1])) + 1);
  const low = Math.max(1, Math.min(16 - width, Math.max(Math.max(...fretted, 1) - width + 1, Math.min(...(fretted.length ? fretted : [1])) - 1)));
  const frets = Array.from({ length: width }, (_, i) => low + width - 1 - i);
  const open = useMemo(() => tuningOpenMidi(tuning), [tuning]);
  const names = getTuningStringLabels(tuning);
  const places = new Map<string, { event: number; note: FingeredNote }>();
  // Show a short passage around the cursor. Unlike a pitch-class scale map,
  // each dot is an actual place the suggested route visits.
  route.events.slice(Math.max(0, index - 3), index + 5).forEach((e, j) => {
    const event = Math.max(0, index - 3) + j;
    e.notes.forEach((n) => places.set(`${n.stringIndex}:${n.fret}`, { event, note: n }));
  });
  current.notes.forEach((n) => places.set(`${n.stringIndex}:${n.fret}`, { event: index, note: n }));
  if (departure) places.set(`${departure.stringIndex}:${departure.fret}`, { event: index - 1, note: departure });
  const getFretNote = (stringIndex: number, fret: number): FretNote => ({ stringIndex, fret, midiNumber: open[stringIndex] + fret, pitchClass: (open[stringIndex] + fret) % 12 });
  const activate = (fn: FretNote) => {
    const place = places.get(`${fn.stringIndex}:${fn.fret}`);
    if (place) onNote(place.event, place.note);
  };
  return (
    <div className="practice-neck" data-testid="practice-neck" role="group" aria-label={t('fretboard.label')}>
      {guide && <p className="text-caption px-2 pb-2" data-testid="neck-guide">{guideText}</p>}
      <div className="flex text-caption text-center" aria-hidden="true" style={{ paddingLeft: 32, paddingRight: 42 }}>
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
          isChordView atNut={low === 1} mode="position" stringName={names[s]} activeNotes={new Set()}
          rootPitchClass={null} getNoteColor={color} spellPitchClass={(pc) => [...places.values()].find(({ note }) => note.midi % 12 === pc)?.note.note ?? midiToNote(60 + pc)}
          getFretNote={getFretNote} onCellActivate={activate} currentShape={null} voicingLookup={EMPTY}
          positionDots={dots} scaleLabelFor={() => ''} highlightPcs={null} focusedFret={null}
          focusFrets={new Set(current.notes.filter((n) => n.stringIndex === s).map((n) => n.fret))} rowHeight={34} />;
      })}
    </div>
  );
}
