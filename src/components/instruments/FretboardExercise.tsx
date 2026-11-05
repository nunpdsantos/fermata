import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FretboardInputSpec, FretPlace } from '../../core/types/drill';
import { getTuningById } from '../../core/constants/guitarTunings';
import { tuningOpenMidi } from '../../core/utils/guitarPositions';
import { midiToNote } from '../../core/utils/pianoLayout';
import { FretboardBreak } from './FretboardBreak';
import { FretCell } from './FretCell';
import { ScrollStrip } from './ScrollStrip';

export interface FretboardExerciseProps {
  spec: FretboardInputSpec;
  disabled: boolean;
  accepted?: FretPlace[];
  picked: FretPlace | null;
  onAnswer: (place: FretPlace) => void;
}

/** The same nut-right cells and scroll strip, without Explore state or pitch labels. */
export function FretboardExercise({ spec, disabled, accepted, picked, onAnswer }: FretboardExerciseProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const win = spec.window;
  const openMidi = tuningOpenMidi(getTuningById(spec.tuningId));
  // Include both stretch frets, independent of which note is being asked.
  const from = win ? Math.max(1, win.fromFret - 1) : 1;
  const to = win ? Math.min(spec.maxFret, win.toFret + 1) : spec.maxFret;
  // Answered diagrams keep the learner's tap and the nearest accepted place
  // together at full cell size. Omitted frets have explicit breaks; the nut
  // remains on the right. No distant answer can scroll the tap out of view.
  const nearest = accepted?.slice().sort((a, b) => Math.abs(a.fret - (picked?.fret ?? 0)) - Math.abs(b.fret - (picked?.fret ?? 0)))[0];
  const feedbackFrets = disabled && nearest
    ? [...new Set([0, ...(accepted ?? []).map((p) => p.fret), ...(picked ? [picked.fret] : [])])].sort((a, b) => b - a) : null;
  const frets = feedbackFrets ?? Array.from({ length: to - from + 1 }, (_, i) => to - i).concat(0);
  const gapBefore = (i: number) => i > 0 && frets[i - 1] - frets[i] > 1;
  const gaps = frets.filter((_, i) => gapBefore(i)).length;
  const labelStyle = { width: 44, flexShrink: 0, position: 'sticky' as const, left: 0, zIndex: 1,
    backgroundColor: 'var(--card)', paddingInline: 3 };
  const [focused, setFocused] = useState<FretPlace>({ stringIndex: 0, fret: win?.fromFret ?? 0 });
  const locked = useRef(false);
  const matches = (a: FretPlace | null, b: FretPlace) => a?.stringIndex === b.stringIndex && a.fret === b.fret;
  const activate = (place: FretPlace) => {
    if (disabled || locked.current) return;
    locked.current = true;
    onAnswer(place);
  };

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth - el.clientWidth;
  }, [from, to]);

  useLayoutEffect(() => {
    if (!disabled) return;
    const el = scrollRef.current;
    const correct = nearest && el?.querySelector<HTMLElement>(`[data-string-row="${nearest.stringIndex}"][data-fret="${nearest.fret}"]`);
    if (!el || !correct) return;
    const box = el.getBoundingClientRect();
    const answer = correct.getBoundingClientRect();
    const tap = picked && el.querySelector<HTMLElement>(`[data-string-row="${picked.stringIndex}"][data-fret="${picked.fret}"]`)?.getBoundingClientRect();
    const left = Math.min(answer.left, tap ? tap.left : answer.left);
    const right = Math.max(answer.right, tap ? tap.right : answer.right);
    // The fixed string gutter occupies the first 44px of the viewport.
    if (left < box.left + 44) el.scrollLeft -= box.left + 44 - left;
    else if (right > box.right) el.scrollLeft += right - box.right;
  }, [disabled, nearest, picked]);

  return (
    <div className="reading-board" data-testid="reading-board">
      <div ref={scrollRef} className="overflow-x-auto" role="group" aria-label={t('drill.reading.board')}
        onKeyDown={(e) => {
          const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-fret]');
          if (!cell || disabled || e.altKey || e.ctrlKey || e.metaKey) return;
          const place = { stringIndex: Number(cell.dataset.stringRow), fret: Number(cell.dataset.fret) };
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate(place);
            return;
          }
          let col = frets.indexOf(place.fret);
          let row = place.stringIndex;
          if (e.key === 'ArrowLeft') col--;
          else if (e.key === 'ArrowRight') col++;
          else if (e.key === 'ArrowUp') row--;
          else if (e.key === 'ArrowDown') row++;
          else if (e.key === 'Home') col = frets.length - 1;
          else if (e.key === 'End') col = 0;
          else return;
          e.preventDefault();
          const fret = frets[Math.max(0, Math.min(frets.length - 1, col))];
          row = Math.max(0, Math.min(5, row));
          const next = scrollRef.current?.querySelector<HTMLElement>(`[data-string-row="${row}"][data-fret="${fret}"]`);
          next?.focus({ preventScroll: true });
          next?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }}>
        <div style={{ minWidth: 44 + frets.length * 44 + 6 + gaps * 24 }}>
          <div className="flex text-caption text-center" style={{ color: 'var(--text-dim)' }}>
            <span data-testid="reading-corner" className="whitespace-nowrap" style={labelStyle} aria-label={t('drill.reading.stringRange')}>⑥–①</span>
            {frets.map((fret, i) => (
              <Fragment key={fret}>
                {gapBefore(i) && <span style={{ width: 24, flexShrink: 0 }}>…</span>}
                <span className="flex-1" style={{ minWidth: fret === 0 ? 50 : 44, borderLeft: fret === 0 ? '6px solid transparent' : undefined }}>{fret}</span>
              </Fragment>
            ))}
          </div>
          {[0, 1, 2, 3, 4, 5].map((stringIndex) => (
            <div key={stringIndex} className="flex" style={{ height: 44 }}>
              <span className="flex items-center justify-center text-caption" data-reading-string={6 - stringIndex} style={{ ...labelStyle, color: 'var(--text-muted)' }} aria-hidden="true">{6 - stringIndex}</span>
              {frets.map((fret, i) => {
                const place = { stringIndex, fret };
                const correct = accepted?.some((p) => matches(p, place));
                const mark = correct ? 'correct' : disabled && matches(picked, place) ? 'wrong' : undefined;
                const label = t(fret === 0 ? 'drill.reading.stringOpen' : 'drill.reading.stringFret', { string: 6 - stringIndex, fret });
                return (
                  <Fragment key={fret}>
                    {gapBefore(i) && <FretboardBreak />}
                    <div className="flex flex-1" style={{ minWidth: fret === 0 ? 50 : 44, borderLeft: fret === 0 ? '6px solid var(--text-muted)' : undefined }}>
                      <FretCell fret={fret} stringIdx={stringIndex} displayNote={midiToNote(openMidi[stringIndex] + fret)}
                        color={undefined} dotColor="var(--accent)" isActive={false} isRoot={false} isMuted={false}
                        fretMinWidth={44} isChordView={false} mobile showVoicing={false} finger={undefined} showScaleDot={false}
                        isFocused={false} onClick={() => activate(place)}
                        exercise={{ label: mark ? `${label}, ${t(`drill.reading.${mark}`)}` : label, disabled,
                          inPosition: !win || (fret === 0 ? win.openStrings : fret >= win.fromFret && fret <= win.toFret),
                          mark, tabIndex: matches(focused, place) ? 0 : -1, onFocus: () => setFocused(place) }} />
                    </div>
                  </Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <ScrollStrip containerRef={scrollRef} label={t('drill.reading.board')} />
    </div>
  );
}
