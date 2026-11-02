import { Suspense, lazy, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { noteToString, type PitchedNote } from '../../core/types/music.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { SCALE_FORMULAS, getScaleDegreeFunctionKey } from '../../core/constants/scales.ts';
import { getScaleNotesWithOctaves, getMidiNumber } from '../../core/utils/pianoLayout.ts';
import { degreeOf, degreeColorSlot, formatDegree, keySignatureForScale } from '../../core/utils/degreeSpelling.ts';
import { getKeySignatureForScale } from '../../utils/notationHelpers.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useAudio } from '../../hooks/useAudio.ts';
import { useMediaQuery } from '../../hooks/useMediaQuery.ts';
import { useAppStore } from '../../state/store.ts';
import { useFocusNoteStore, useFocusNote, focusMatches, type FocusNote } from '../../state/focusNoteStore.ts';
import { DEGREE_COLORS, DEGREE_INKS } from '../../design/tokens/colors.ts';
import { StaffNotationSkeleton } from '../notation/StaffNotationSkeleton.tsx';
import type { StaffLayoutInfo } from '../notation/useStaffNotation.ts';
import { staffTrim } from './staffTrim.ts';

const StaffNotation = lazy(() =>
  import('../notation/StaffNotation.tsx').then((m) => ({ default: m.StaffNotation })),
);

const STAFF_HEIGHT = 80;
/** Room the clef takes before the first note (px), plus 10 px per signature accidental. */
const CLEF_ROOM = 64;

/**
 * NOTES OF THE SCALE (W11-B, D-25): the staff and the scale-degree strip in
 * one — a column per scale note (the octave tonic on top included), the
 * notehead above and its name, degree (♭3 style, read from the spelling) and
 * function below. Tap or click a column to hear it; hovering, focusing or
 * tapping one makes it the LINKED FOCUS NOTE, lit on the instrument and named
 * by the read-out. A selected chord fades the notes outside it.
 *
 * The columns are lined up under the noteheads VexFlow actually drew
 * (StaffNotation's onLayout). One Tab stop; ← → move, Home / End jump,
 * Enter / Space play. On a narrow screen the strip scrolls sideways inside
 * its card so every column stays a full tap target.
 */
export function ScaleStrip() {
  const { t } = useTranslation();
  const { scale } = useKeyContext();
  const selectedScale = useAppStore((s) => s.selectedScale);
  const selectedChord = useAppStore((s) => s.selectedChord);
  const instrument = useAppStore((s) => s.instrument);
  const { noteOn, noteOff } = useAudio();
  const coarse = useMediaQuery('(pointer: coarse)');
  const wide = useMediaQuery('(min-width: 640px)');
  const setFocus = useFocusNoteStore((s) => s.set);
  const clearFocus = useFocusNoteStore((s) => s.clear);
  const focus = useFocusNote();

  // The scale as the staff draws it: every note plus the octave tonic, each
  // coloured and labelled by its FUNCTION read from the spelled letter (a
  // pentatonic's G is the dominant — audit W1-06, W1-18).
  const notes: PitchedNote[] = useMemo(() => getScaleNotesWithOctaves(scale.notes, 4), [scale]);
  const midis = useMemo(() => notes.map((n) => getMidiNumber(n, n.octave)), [notes]);
  const degrees = useMemo(() => notes.map((n) => degreeOf(scale.root, n)), [notes, scale.root]);
  const noteColors = useMemo(
    () => Object.fromEntries(degrees.map((d, i) => [i, DEGREE_COLORS[degreeColorSlot(d)]])),
    [degrees],
  );
  const chordPcs = useMemo(() => {
    if (!selectedChord) return null;
    const s = new Set(selectedChord.notes.map(getPitchClass));
    if (selectedChord.bassNote) s.add(getPitchClass(selectedChord.bassNote));
    return s;
  }, [selectedChord]);
  const dimmed = useMemo(() => notes.map((n) => !!chordPcs && !chordPcs.has(getPitchClass(n))), [notes, chordPcs]);
  const noteDim = useMemo(
    () => (chordPcs ? Object.fromEntries(dimmed.map((d, i) => [i, d])) : undefined),
    [dimmed, chordPcs],
  );
  const lit = useMemo(() => focusMatches(focus, midis), [focus, midis]);
  const formula = SCALE_FORMULAS[selectedScale];
  const keySignature = getKeySignatureForScale(scale.root, selectedScale) ?? undefined;

  // ── Width: the card's, or wider (it then scrolls) so columns stay taps ──
  const scrollRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setBoxWidth(el.clientWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const minCol = coarse ? 48 : 44;
  const sigCount = keySignature ? (keySignatureForScale(scale.root, selectedScale)?.count ?? 0) : 0;
  const prefix = CLEF_ROOM + 10 * sigCount;
  const staffWidth = Math.max(boxWidth, prefix + notes.length * minCol + 12);

  // Where VexFlow put each notehead; until it has drawn, an even spread.
  const [drawn, setDrawn] = useState<{ xs: number[]; width: number } | null>(null);
  const onLayout = useCallback((l: StaffLayoutInfo) => {
    setDrawn((prev) => (prev && prev.width === l.width && prev.xs.length === l.xs.length && prev.xs.every((x, i) => Math.abs(x - l.xs[i]) < 0.5) ? prev : { xs: l.xs, width: l.width }));
  }, []);
  const xs = useMemo(() => {
    if (drawn && drawn.xs.length === notes.length && Math.abs(drawn.width - staffWidth) < 1) return drawn.xs;
    const step = (staffWidth - prefix - 20) / Math.max(1, notes.length);
    return notes.map((_, i) => prefix + step * (i + 0.5));
  }, [drawn, notes, staffWidth, prefix]);
  const half = useMemo(() => {
    let min = Infinity;
    for (let i = 1; i < xs.length; i++) min = Math.min(min, xs[i] - xs[i - 1]);
    return Math.max(minCol, Math.min(min === Infinity ? 96 : min, 120)) / 2 - 2;
  }, [xs, minCol]);
  // Function names ("7 · leading") only where a column has room for them
  // (a laptop's strip; on narrower ones the degree alone).
  const showFunctions = wide && scale.notes.length === 7 && half * 2 >= 104;

  // ── Focus + sound ────────────────────────────────────────────────────────
  const noteAt = (i: number): FocusNote => ({ pc: getPitchClass(notes[i]), midi: midis[i], source: 'staff' });
  const play = (i: number) => {
    const n = notes[i];
    noteOn(n, n.octave).then(
      (midi) => window.setTimeout(() => noteOff(midi), 700),
      () => {},
    );
  };
  const [stop, setStop] = useState(0);
  const tabStop = Math.min(stop, notes.length - 1);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: ReactKeyboardEvent, i: number) => {
    let j: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = Math.min(notes.length - 1, i + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = Math.max(0, i - 1);
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = notes.length - 1;
    if (j === null) return;
    e.preventDefault();
    setStop(j);
    buttons.current[j]?.focus();
    buttons.current[j]?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  };
  const onEnter = (e: ReactPointerEvent, i: number) => {
    if (e.pointerType === 'mouse') setFocus('hover', noteAt(i));
  };
  const onLeave = (e: ReactPointerEvent) => {
    if (e.pointerType === 'mouse') clearFocus('hover', 'staff');
  };

  // The staff's empty headroom is trimmed (the workbench fits 1440×900).
  const trim = useMemo(() => staffTrim(notes, instrument, STAFF_HEIGHT), [notes, instrument]);

  const written = instrument === 'guitar';
  const hint = written ? t('explore.strip.hintGuitar') : t('explore.strip.hint');

  return (
    <section className="explore-card strip-card" aria-labelledby="strip-title" data-testid="scale-strip">
      <div className="explore-card-head">
        <h2 id="strip-title" className="type-section">{t('explore.strip.title')}</h2>
        <p className="text-caption explore-card-hint" style={{ color: 'var(--text-dim)' }}>{hint}</p>
      </div>
      <div ref={scrollRef} className="strip-scroll">
        <div className="strip-body" style={{ width: staffWidth }}>
          <div
            role="group"
            aria-label={t('explore.strip.group')}
            className="strip-columns"
          >
            {notes.map((n, i) => {
              const d = degrees[i];
              const slot = degreeColorSlot(d);
              const on = lit.has(midis[i]);
              const fnKey = showFunctions ? getScaleDegreeFunctionKey(i % 7, formula[i % 7] ?? 0) : null;
              const name = noteToString(n);
              return (
                <button
                  key={`${name}${n.octave}-${i}`}
                  ref={(el) => { buttons.current[i] = el; }}
                  type="button"
                  className="strip-col"
                  data-on={on || undefined}
                  data-dim={dimmed[i] || undefined}
                  data-midi={midis[i]}
                  data-note={name}
                  tabIndex={i === tabStop ? 0 : -1}
                  style={{ left: xs[i] - half, width: half * 2 }}
                  aria-label={t('explore.degreeButton', { degree: i % scale.notes.length + 1, interval: formatDegree(d), note: name })}
                  onPointerEnter={(e) => onEnter(e, i)}
                  onPointerLeave={onLeave}
                  onFocus={(e) => {
                    setStop(i);
                    if (e.currentTarget.matches(':focus-visible')) setFocus('keyboard', noteAt(i));
                  }}
                  onBlur={() => clearFocus('keyboard', 'staff')}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  onClick={() => {
                    setFocus('pinned', noteAt(i));
                    play(i);
                  }}
                >
                  <span className="strip-name" aria-hidden="true">{name}</span>
                  <span className="strip-sub" aria-hidden="true">
                    <span
                      className="strip-degree"
                      style={{ color: dimmed[i] ? 'var(--text-dim)' : DEGREE_INKS[slot] }}
                    >
                      {formatDegree(d, '1')}
                    </span>
                    {fnKey && <span className="strip-fn">{t(fnKey)}</span>}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="strip-staff" aria-hidden="true" style={{ marginTop: -trim.top, marginBottom: -trim.bottom }}>
            <Suspense fallback={<StaffNotationSkeleton height={STAFF_HEIGHT} />}>
              <StaffNotation
                notes={notes}
                keySignature={keySignature}
                noteColors={noteColors}
                noteDim={noteDim}
                width={staffWidth}
                height={STAFF_HEIGHT}
                duration="w"
                followInstrument
                onLayout={onLayout}
              />
            </Suspense>
          </div>
          <div className="strip-labels-room" />
        </div>
      </div>
    </section>
  );
}
