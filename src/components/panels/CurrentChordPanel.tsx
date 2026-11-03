import { useCallback, useEffect, useId, useRef, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { noteToString, type Chord, type Note } from '../../core/types/music.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { QUALITY_TO_MODULE } from '../../data/qualityToModule.ts';
import { useDegreeColorsEnabled } from '../../hooks/useDegreeColors.ts';
import { DEGREE_COLORS, ON_DEGREE, inkFor } from '../../design/tokens/colors.ts';
import { Button } from '../ui/Button.tsx';
import { qualityName } from '../../utils/qualityName.ts';
import { scaleContext } from '../../i18n/scaleSuggestionContext.ts';
import { toContentLanguage } from '../drill/drillText.ts';

// Resolve alpha for a colour that may be a hex literal or CSS var.
function alpha(color: string, hex: string): string {
  if (color.startsWith('#')) return color + hex;
  const pct = Math.round((parseInt(hex, 16) / 255) * 100);
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}
import {
  playChordVoiced,
  playPitchedNotes,
  playPitchedArpeggio,
  playArpeggioAscending,
  cancelScheduledAudio,
  resumeAudio,
} from '../../core/services/audio.ts';
import { getSynthConfig } from '../../services/synthConfig.ts';
import { exploreRegister } from '../explore/exploreRegister';
import { useAppStore } from '../../state/store.ts';
import { buildAscendingMidi } from '../../utils/midiHelpers.ts';
import { getMidiNumber, midiToNote } from '../../core/utils/pianoLayout.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { SCALE_FORMULAS, getScaleDegreeFunctionKey } from '../../core/constants/scales.ts';
import { useAudio } from '../../hooks/useAudio.ts';
import { useMediaQuery } from '../../hooks/useMediaQuery.ts';
import { useFocusNoteStore, useFocusNote, type FocusNote } from '../../state/focusNoteStore.ts';
import { useToastAvoid } from '../layout/toastLayout.ts';
import {
  CHORD_QUALITY_NAMES,
  getChordShortIntervalLabels,
} from '../../core/constants/chords.ts';
import { LearnMoreButton } from './LearnMoreButton.tsx';
import { ChipGroup } from '../ui/ChoiceChip.tsx';

import { getScaleSuggestions } from '../../core/constants/chordScaleRelationships.ts';

interface CurrentChordPanelProps {
  chord: Chord;
  /** Drawn beside the detail (Explore: the chord on a small staff). */
  aside?: ReactNode;
}

const INVERSION_LABEL_KEYS = ['panel.rootPos', 'panel.inv1', 'panel.inv2', 'panel.inv3'];

/** How far a toast slides into place (Toast.tsx: `initial y: 12`). */
const TOAST_TRAVEL = 12;

/** The view the detail scrolls in: its nearest scrolling ancestor (the work
 *  column; on a short screen, the whole Explore area). */
function scrollerOf(detail: HTMLElement): HTMLElement | null {
  let scroller: HTMLElement | null = detail.parentElement;
  while (scroller) {
    const oy = getComputedStyle(scroller).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && scroller.scrollHeight > scroller.clientHeight) return scroller;
    scroller = scroller.parentElement;
  }
  return null;
}

/**
 * The room kept above the chord detail as it scrolls into view: 8 px below
 * whatever covers, or may come to cover, the top of its view — the staff
 * strip held at the top of a laptop's work column (sticky), and one toast's
 * room under the top bar (a toast that comes later must not cover the
 * detail, and nothing may move when it comes or goes), more while a taller
 * stack is up — but never so much that ▶ Chord / ▶ Arpeggio leave the view:
 * a phone sideways at Half has ~120 px of it, and the fixed toast gap
 * pushed ▶ Chord under the sheet there (W11-B delta review).
 */
function roomAbove(detail: HTMLElement): number {
  const BASE = 8;
  const scroller = scrollerOf(detail);
  if (!scroller) return BASE;
  const viewTop = scroller.getBoundingClientRect().top;
  let cover = viewTop;
  const strip = scroller.querySelector<HTMLElement>(':scope > .strip-card');
  if (strip) {
    const cs = getComputedStyle(strip);
    if (cs.position === 'sticky') cover = Math.max(cover, viewTop + (parseFloat(cs.top) || 0) + strip.getBoundingClientRect().height);
  }
  const region = document.querySelector<HTMLElement>('.toast-region');
  if (region) {
    const box = region.getBoundingClientRect();
    // One toast always fits the region (index.css: --tap + 16 px); where
    // toasts are up, where they REST (layout offsets ignore the entrance
    // transform). Plus the 12 px a toast slides in by: clear even
    // mid-entrance.
    const tap = parseFloat(getComputedStyle(region).getPropertyValue('--tap')) || 36;
    let bottom = box.top + tap + 16;
    const toasts = Array.from(region.querySelectorAll<HTMLElement>('.toast-card'));
    if (toasts.length > 0) {
      const rest = Math.max(...toasts.map((t) => box.top + t.offsetTop + t.offsetHeight - region.scrollTop));
      bottom = Math.max(bottom, Math.min(box.bottom, rest));
    }
    cover = Math.max(cover, bottom + TOAST_TRAVEL);
  }
  const actions = detail.querySelector('.chord-detail-actions');
  const need = actions ? actions.getBoundingClientRect().bottom - detail.getBoundingClientRect().top : 0;
  return Math.round(Math.max(BASE, Math.min(cover - viewTop + BASE, scroller.clientHeight - need - BASE)));
}

function computeVoicedMidi(notes: Note[], startOctave: number): number[] {
  return buildAscendingMidi(notes, startOctave).midi;
}

// Reuses DEGREE_COLORS 1/2/3 deliberately — "primary fit" reads as tonic,
// "secondary" as supertonic, "color" as mediant. Shared visual language.
const FIT_COLORS = {
  primary: DEGREE_COLORS[1],
  secondary: DEGREE_COLORS[2],
  color: DEGREE_COLORS[3],
} as const;

const FIT_COLORS_MUTED: Record<keyof typeof FIT_COLORS, string> = {
  primary: 'var(--accent)',
  secondary: 'var(--text-muted)',
  color: 'var(--text-dim)',
};

export function CurrentChordPanel({ chord, aside }: CurrentChordPanelProps) {
  const { t, i18n } = useTranslation();
  const lang = toContentLanguage(i18n.language);
  const { getNoteDegree, invertedNotes, diatonicChords, scale } = useKeyContext();
  const { noteOn, noteOff } = useAudio();
  const setFocus = useFocusNoteStore((s) => s.set);
  const clearFocus = useFocusNoteStore((s) => s.clear);
  const focusPc = useFocusNote()?.pc ?? null;
  const toneGroupId = useId();
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const synthPreset = useAppStore((s) => s.synthPreset);
  const chordInversion = useAppStore((s) => s.chordInversion);
  const setChordInversion = useAppStore((s) => s.setChordInversion);
  const instrument = useAppStore((s) => s.instrument);
  const baseOctave = useAppStore((s) => s.baseOctave);
  const addActiveNote = useAppStore((s) => s.addActiveNote);
  const removeActiveNote = useAppStore((s) => s.removeActiveNote);
  const setScale = useAppStore((s) => s.setScale);
  const setKey = useAppStore((s) => s.setKey);
  const degreeColorsOn = useDegreeColorsEnabled();
  const degree = getNoteDegree(chord.root);

  // Keys this panel lit for a playback, and the timers that will un-light
  // them. Stopping the visuals un-lights NOW instead of dropping the timers
  // (dropping them left the previous chord's keys lit for good when Chord was
  // pressed again before it ended — audit W8-01 "keep visual timeouts
  // consistent").
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const litRef = useRef<Set<number>>(new Set());

  const lightKey = useCallback((midi: number) => {
    litRef.current.add(midi);
    addActiveNote(midi);
  }, [addActiveNote]);

  const unlightKeys = useCallback((midis: Iterable<number>) => {
    for (const midi of [...midis]) {
      litRef.current.delete(midi);
      removeActiveNote(midi);
    }
  }, [removeActiveNote]);

  const stopVisuals = useCallback(() => {
    for (const t of timeoutsRef.current) clearTimeout(t);
    timeoutsRef.current = [];
    unlightKeys(litRef.current);
  }, [unlightKeys]);

  // Leaving the panel (chord cleared, view change) stops its sound and
  // un-lights its keys.
  useEffect(() => () => {
    cancelScheduledAudio();
    stopVisuals();
  }, [stopVisuals]);

  const maxInversion = chord.notes.length - 1;
  const notesForPlayback = invertedNotes.length > 0 ? invertedNotes : chord.notes;

  // Real interval labels from core
  const intervalLabels = useMemo(
    () => chord.algorithmicIntervalLabels ?? getChordShortIntervalLabels(chord.quality),
    [chord],
  );

  // Compatible scales
  const scaleSuggestions = useMemo(
    () => getScaleSuggestions(chord.quality),
    [chord.quality],
  );

  const handlePlayChord = useCallback(async () => {
    await resumeAudio();
    // A new playback replaces whatever was sounding (W8-01).
    cancelScheduledAudio();
    stopVisuals();
    const config = getSynthConfig(synthPreset);
    const duration = 1.5;
    // Sound and lit keys share one voicing (bass lowest; slash bass below).
    const midiNumbers = exploreRegister(instrument, baseOctave).chordPitches(notesForPlayback, chord.bassNote)
      .map((p) => getMidiNumber(p, p.octave));
    for (const m of midiNumbers) lightKey(m);
    if (instrument === 'guitar') {
      playPitchedNotes(exploreRegister(instrument).chordPitches(notesForPlayback, chord.bassNote), duration, config);
    } else {
      playChordVoiced(notesForPlayback, baseOctave, duration, config, chord.bassNote);
    }
    const t = setTimeout(() => unlightKeys(midiNumbers), duration * 1000);
    timeoutsRef.current.push(t);
  }, [notesForPlayback, synthPreset, baseOctave, lightKey, unlightKeys, stopVisuals, chord.bassNote, instrument]);

  const handlePlayArpeggio = useCallback(async () => {
    await resumeAudio();
    cancelScheduledAudio();
    stopVisuals();
    const config = getSynthConfig(synthPreset);
    const noteDuration = 0.35;
    const guitarPitches = instrument === 'guitar'
      ? exploreRegister(instrument).chordPitches(notesForPlayback, chord.bassNote) : null;
    const midiNumbers = guitarPitches
      ? guitarPitches.map((p) => getMidiNumber(p, p.octave))
      : computeVoicedMidi(notesForPlayback, baseOctave);
    const litNotes: number[] = [];
    const onNotePlay = (noteIndex: number) => {
      const midi = midiNumbers[noteIndex];
      if (midi !== undefined) {
        lightKey(midi);
        litNotes.push(midi);
      }
    };
    // Runs when the arpeggio ends — or at once if it is cancelled (core
    // settles a cancelled phrase's visuals).
    const onComplete = () => {
      const t = setTimeout(() => unlightKeys(litNotes), noteDuration * 1000);
      timeoutsRef.current.push(t);
    };
    if (guitarPitches) {
      playPitchedArpeggio(guitarPitches, noteDuration, onNotePlay, onComplete, config);
    } else {
      playArpeggioAscending(notesForPlayback, baseOctave, noteDuration, onNotePlay, onComplete, config);
    }
  }, [notesForPlayback, synthPreset, baseOctave, lightKey, unlightKeys, stopVisuals, instrument, chord.bassNote]);

  // The chord's place in the key: "V · dominant" when it is a diatonic chord.
  const role = useMemo(() => {
    const rootPc = getPitchClass(chord.root);
    const match = diatonicChords.find((d) => getPitchClass(d.chord.root) === rootPc && d.chord.quality === chord.quality);
    if (!match) return degree ? t('panel.degree', { n: degree }) : null;
    const i = scale.notes.findIndex((n) => getPitchClass(n) === rootPc);
    const fnKey = scale.notes.length === 7 && i >= 0 ? getScaleDegreeFunctionKey(i, SCALE_FORMULAS[scale.type]?.[i] ?? 0) : null;
    return fnKey ? `${match.numeral} · ${t(fnKey.replace('degreeShort.', 'explore.fn.'))}` : match.numeral;
  }, [chord, diatonicChords, scale, degree, t]);

  // Each tone's sounding pitch in the voicing the instruments light, so a
  // tone made the focus note lights that exact key on the piano.
  const toneMidi = useMemo(() => {
    const m = new Map<number, number>();
    for (const p of exploreRegister(instrument, baseOctave).chordPitches(notesForPlayback, chord.bassNote)) {
      const pc = getPitchClass(p);
      if (!m.has(pc)) m.set(pc, getMidiNumber(p, p.octave));
    }
    return m;
  }, [notesForPlayback, baseOctave, chord.bassNote, instrument]);
  const toneFocus = (note: Note): FocusNote => {
    const pc = getPitchClass(note);
    return { pc, midi: toneMidi.get(pc), source: 'chord' };
  };
  const playTone = (note: Note) => {
    const midi = toneMidi.get(getPitchClass(note));
    if (midi === undefined) return;
    const p = midiToNote(midi);
    noteOn(p, p.octave).then((played) => window.setTimeout(() => noteOff(played), 700), () => {});
  };

  // Toasts never cover the open chord detail (W11-B).
  const detailRef = useRef<HTMLDivElement>(null);
  useToastAvoid(detailRef);

  // The detail opens under the row tapped — on a phone with the sheet at
  // Half that can be below the visible view (▶ Chord off screen; W11-B
  // review). Bring it into view: 'nearest' moves nothing when it already
  // shows (1440×900), and puts its top in view when it is taller than the
  // room. Once per chord, so browsing the inversions never jumps.
  const chordId = `${noteToString(chord.root)}|${chord.quality}|${chord.bassNote ? noteToString(chord.bassNote) : ''}`;
  useEffect(() => {
    const el = detailRef.current;
    if (!el) return;
    // Room above it for what covers (or may cover) the view's top — a
    // laptop's held staff strip, a toast's room — clamped so ▶ Chord still
    // shows (W11-B delta review: the fixed toast gap pushed it under the
    // sheet at 844×390, Half).
    el.style.scrollMarginTop = `${roomAbove(el)}px`;
    el.scrollIntoView?.({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [chordId, reduceMotion]);
  const playIcon = <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>;

  return (
    <m.div
      ref={detailRef}
      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="chord-detail"
      data-testid="chord-detail"
    >
      <div className="chord-detail-main">
      <div className="chord-detail-row">
        <h3 className="chord-detail-name">
          {noteToString(chord.root)}
          <span className="chord-detail-quality">
            {chord.algorithmicDisplayName ?? qualityName(chord.quality, lang)}
          </span>
          {chord.bassNote && (
            <span style={{ color: 'var(--text-dim)' }}>/{noteToString(chord.bassNote)}</span>
          )}
        </h3>
        {role && <span className="text-ui" style={{ color: 'var(--text-muted)' }}>{role}</span>}

        {/* Notes: each tone is the focus note on hover / focus, and plays on a tap. */}
        <div className="chord-detail-group">
          <span className="type-label" id={`${toneGroupId}-label`}>{t('panel.notes')}</span>
          <div className="flex gap-1.5" role="group" aria-labelledby={`${toneGroupId}-label`}>
            {notesForPlayback.map((note, i) => {
              const noteDegree = getNoteDegree(note);
              const fill = noteDegree ? DEGREE_COLORS[noteDegree as keyof typeof DEGREE_COLORS] : null;
              const isBass = i === 0 && chordInversion > 0;
              const isSlashBass = !!chord.bassNote && noteToString(note) === noteToString(chord.bassNote) && i === 0;
              const on = focusPc === getPitchClass(note);
              return (
                <button
                  key={i}
                  type="button"
                  className="tone-btn"
                  data-on={on || undefined}
                  style={{
                    backgroundColor: fill ?? 'var(--bg-raised)',
                    color: fill ? ON_DEGREE : 'var(--text)',
                    borderStyle: isSlashBass ? 'dashed' : 'solid',
                    borderColor: isBass || isSlashBass ? 'var(--text)' : (fill ?? 'var(--border)'),
                  }}
                  title={isSlashBass ? t('panel.slashBass') : undefined}
                  onPointerEnter={(e) => { if (e.pointerType === 'mouse') setFocus('hover', toneFocus(note)); }}
                  onPointerLeave={(e) => { if (e.pointerType === 'mouse') clearFocus('hover', 'chord'); }}
                  onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) setFocus('keyboard', toneFocus(note)); }}
                  onBlur={() => clearFocus('keyboard', 'chord')}
                  onClick={() => {
                    setFocus('pinned', toneFocus(note));
                    playTone(note);
                  }}
                >
                  {noteToString(note)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Root / 1st / 2nd …: one of many — a ChipGroup (D-28 choice chip).
            4th inversion and up (5+ note chords) use "Inv n" — never a second
            "Root" (audit W2-09). Controls: not printed (nor ▶ Chord /
            ▶ Arpeggio) — W11-B delta review. */}
        <div className="chord-detail-group no-print">
          <span className="type-label" aria-hidden="true">{t('panel.voicing')}</span>
          <ChipGroup
            label={t('panel.chordInversion')}
            value={chordInversion}
            onChange={setChordInversion}
            options={Array.from({ length: maxInversion + 1 }, (_, i) => ({
              value: i,
              label: i < INVERSION_LABEL_KEYS.length ? t(INVERSION_LABEL_KEYS[i]) : t('chordBuilder.inversion.nth', { n: i }),
            }))}
          />
        </div>

        <div className="chord-detail-actions no-print">
          {/* Chord is the main action here (primary). */}
          <Button variant="primary" onClick={handlePlayChord} startIcon={playIcon}>
            {t('panel.chord')}
          </Button>
          <Button onClick={handlePlayArpeggio} startIcon={playIcon}>
            {t('panel.arpeggio')}
          </Button>
        </div>
      </div>

      <div className="chord-detail-row">
        {/* Formula — real interval labels */}
        <div className="chord-detail-group">
          <span className="type-label">{t('panel.formula')}</span>
          <span className="flex items-center gap-1.5">
            {intervalLabels.map((label, i) => (
              <span
                key={i}
                className="text-caption font-mono px-2 py-0.5 rounded-md"
                style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-raised)', border: '1px solid var(--border-subtle)' }}
              >
                {label}
              </span>
            ))}
          </span>
        </div>

        {/* Compatible scales: choosing one makes it the key (root = this chord's). */}
        {scaleSuggestions.length > 0 && (
          <div className="chord-detail-group">
            <span className="type-label">{t('panel.compatibleScales')}</span>
            <span className="flex flex-wrap gap-1.5">
              {scaleSuggestions.map((s) => {
                const fitColor = degreeColorsOn ? FIT_COLORS[s.fit] : FIT_COLORS_MUTED[s.fit];
                return (
                  <button
                    key={s.scale}
                    onClick={() => {
                      setKey(chord.root);
                      setScale(s.scale);
                    }}
                    className="btn"
                    style={{
                      backgroundColor: alpha(fitColor, '12'),
                      color: inkFor(fitColor),
                      borderColor: alpha(fitColor, '45'),
                    }}
                    title={scaleContext(s.context, lang)}
                  >
                    {t(`scaleName.${s.scale}`)}
                  </button>
                );
              })}
            </span>
          </div>
        )}

        {/* Only chords a lesson actually teaches get a link (null = none; the
            fuzzy title fallback would land on an unrelated lesson). */}
        {QUALITY_TO_MODULE[chord.quality] && (
          <LearnMoreButton
            query={CHORD_QUALITY_NAMES[chord.quality]}
            moduleId={QUALITY_TO_MODULE[chord.quality] ?? undefined}
          />
        )}
      </div>
      </div>
      {aside}
    </m.div>
  );
}
