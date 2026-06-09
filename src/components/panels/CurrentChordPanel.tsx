import { useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { noteToString, type Chord, type Note } from '../../core/types/music.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useDegreeColorsEnabled } from '../../hooks/useDegreeColors.ts';
import { DEGREE_COLORS } from '../../design/tokens/colors.ts';

// Resolve alpha for a colour that may be a hex literal or CSS var.
function alpha(color: string, hex: string): string {
  if (color.startsWith('#')) return color + hex;
  const pct = Math.round((parseInt(hex, 16) / 255) * 100);
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}
import {
  playChordVoiced,
  playArpeggioAscending,
  resumeAudio,
} from '../../core/services/audio.ts';
import { getSynthConfig } from '../../services/synthConfig.ts';
import { useAppStore } from '../../state/store.ts';
import { buildAscendingMidi } from '../../utils/midiHelpers.ts';
import {
  CHORD_QUALITY_NAMES,
  getChordShortIntervalLabels,
} from '../../core/constants/chords.ts';
import { LearnMoreButton } from './LearnMoreButton.tsx';
import { Badge } from '../ui/Badge';

import { getScaleSuggestions } from '../../core/constants/chordScaleRelationships.ts';
import { SCALE_TYPE_NAMES } from '../../core/constants/scales.ts';

interface CurrentChordPanelProps {
  chord: Chord;
}

const INVERSION_LABEL_KEYS = ['panel.rootPos', 'panel.inv1', 'panel.inv2', 'panel.inv3'];

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

export function CurrentChordPanel({ chord }: CurrentChordPanelProps) {
  const { t } = useTranslation();
  const { getNoteDegree, invertedNotes } = useKeyContext();
  const synthPreset = useAppStore((s) => s.synthPreset);
  const chordInversion = useAppStore((s) => s.chordInversion);
  const setChordInversion = useAppStore((s) => s.setChordInversion);
  const baseOctave = useAppStore((s) => s.baseOctave);
  const addActiveNote = useAppStore((s) => s.addActiveNote);
  const removeActiveNote = useAppStore((s) => s.removeActiveNote);
  const setScale = useAppStore((s) => s.setScale);
  const setKey = useAppStore((s) => s.setKey);
  const degreeColorsOn = useDegreeColorsEnabled();
  const degree = getNoteDegree(chord.root);
  const color = degreeColorsOn && degree
    ? DEGREE_COLORS[degree as keyof typeof DEGREE_COLORS]
    : degree
      ? 'var(--accent)'
      : 'var(--text-muted)';

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearVisualTimeouts = useCallback(() => {
    for (const t of timeoutsRef.current) clearTimeout(t);
    timeoutsRef.current = [];
  }, []);

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
    clearVisualTimeouts();
    const config = getSynthConfig(synthPreset);
    const duration = 1.5;
    const midiNumbers = computeVoicedMidi(notesForPlayback, baseOctave);
    for (const m of midiNumbers) addActiveNote(m);
    playChordVoiced(notesForPlayback, baseOctave, duration, config);
    const t = setTimeout(() => {
      for (const m of midiNumbers) removeActiveNote(m);
    }, duration * 1000);
    timeoutsRef.current.push(t);
  }, [notesForPlayback, synthPreset, baseOctave, addActiveNote, removeActiveNote, clearVisualTimeouts]);

  const handlePlayArpeggio = useCallback(async () => {
    await resumeAudio();
    clearVisualTimeouts();
    const config = getSynthConfig(synthPreset);
    const noteDuration = 0.35;
    const midiNumbers = computeVoicedMidi(notesForPlayback, baseOctave);
    const litNotes: number[] = [];
    playArpeggioAscending(
      notesForPlayback,
      baseOctave,
      noteDuration,
      (noteIndex) => {
        const midi = midiNumbers[noteIndex];
        if (midi !== undefined) {
          addActiveNote(midi);
          litNotes.push(midi);
        }
      },
      () => {
        const t = setTimeout(() => {
          for (const m of litNotes) removeActiveNote(m);
        }, noteDuration * 1000);
        timeoutsRef.current.push(t);
      },
      config,
    );
  }, [notesForPlayback, synthPreset, baseOctave, addActiveNote, removeActiveNote, clearVisualTimeouts]);

  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold learn-serif" style={{ color: 'var(--text)' }}>
          {chord.algorithmicDisplayName
            ? <>{noteToString(chord.root)}<span className="font-normal ml-1.5" style={{ color: 'var(--text-muted)' }}>{chord.algorithmicDisplayName}</span></>
            : <>{noteToString(chord.root)}<span className="font-normal ml-1.5" style={{ color: 'var(--text-muted)' }}>{CHORD_QUALITY_NAMES[chord.quality]}</span></>
          }
          {chord.bassNote && (
            <span className="font-normal ml-0.5" style={{ color: 'var(--text-dim)' }}>/{noteToString(chord.bassNote)}</span>
          )}
        </h2>
        {degree && (
          <Badge
            degree={degree as keyof typeof DEGREE_COLORS}
            shape="pill"
            size="xs"
            outlined
            className="mt-2"
          >
            {t('panel.degree', { n: degree })}
          </Badge>
        )}
        <LearnMoreButton query={CHORD_QUALITY_NAMES[chord.quality]} />
      </div>

      {/* Notes */}
      <div>
        <h3 className="type-section mb-2">
          {t('panel.notes')}
        </h3>
        <div className="flex gap-1.5">
          {notesForPlayback.map((note, i) => {
            const noteDegree = getNoteDegree(note);
            const noteColor = degreeColorsOn && noteDegree
              ? DEGREE_COLORS[noteDegree as keyof typeof DEGREE_COLORS]
              : noteDegree
                ? 'var(--accent)'
                : 'var(--text-muted)';
            const isBass = i === 0 && chordInversion > 0;
            const isSlashBass = chord.bassNote &&
              noteToString(note) === noteToString(chord.bassNote) && i === 0;
            return (
              <span
                key={i}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: alpha(noteColor, '15'),
                  color: noteColor,
                  border: isSlashBass
                    ? `1.5px dashed ${noteColor}`
                    : isBass ? `1.5px solid ${noteColor}` : `1px solid ${noteColor}30`,
                }}
                title={isSlashBass ? t('panel.slashBass') : undefined}
              >
                {noteToString(note)}
              </span>
            );
          })}
        </div>
      </div>

      {/* Inversions */}
      <div>
        <h3 className="type-section mb-2">
          {t('panel.voicing')}
        </h3>
        <div className="flex gap-1.5" role="radiogroup" aria-label={t('panel.chordInversion')}>
          {Array.from({ length: maxInversion + 1 }, (_, i) => {
            const isActive = chordInversion === i;
            return (
              <button
                key={i}
                role="radio"
                aria-checked={isActive}
                onClick={() => setChordInversion(i)}
                className="relative px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                style={{
                  backgroundColor: isActive ? alpha(color, '20') : 'var(--card)',
                  color: isActive ? color : 'var(--text-muted)',
                  border: isActive ? `1px solid ${alpha(color, '50')}` : '1px solid var(--border)',
                }}
              >
                {t(INVERSION_LABEL_KEYS[i] ?? 'panel.rootPos')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Formula — real interval labels */}
      <div>
        <h3 className="type-section mb-2">
          {t('panel.formula')}
        </h3>
        <div className="flex items-center gap-1.5">
          {intervalLabels.map((label, i) => (
            <span
              key={i}
              className="text-xs font-mono px-2 py-1 rounded-md"
              style={{ color: 'var(--text-muted)', backgroundColor: 'color-mix(in srgb, var(--card) 60%, transparent)' }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Compatible Scales */}
      {scaleSuggestions.length > 0 && (
        <div>
          <h3 className="type-section mb-2">
            {t('panel.compatibleScales')}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {scaleSuggestions.map((s) => {
              const fitColor = degreeColorsOn ? FIT_COLORS[s.fit] : FIT_COLORS_MUTED[s.fit];
              return (
                <button
                  key={s.scale}
                  onClick={() => {
                    setKey(chord.root);
                    setScale(s.scale);
                  }}
                  className="px-2 py-1 rounded-lg text-[11px] font-medium transition-all hover:brightness-125"
                  style={{
                    backgroundColor: alpha(fitColor, '12'),
                    color: fitColor,
                    border: `1px solid ${alpha(fitColor, '30')}`,
                  }}
                  title={s.context}
                >
                  {SCALE_TYPE_NAMES[s.scale]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Play controls */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handlePlayChord}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 hover:scale-[1.02]"
          style={{
            backgroundColor: alpha(color, '15'),
            color,
            border: `1px solid ${alpha(color, '30')}`,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          {t('panel.chord')}
        </button>
        <button
          onClick={handlePlayArpeggio}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 hover:scale-[1.02]"
          style={{
            color: 'var(--text)',
            backgroundColor: 'color-mix(in srgb, var(--card) 60%, transparent)',
            border: '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          {t('panel.arpeggio')}
        </button>
      </div>
    </m.div>
  );
}
