import { Suspense, lazy, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { RhythmPattern } from '../../../core/types/exercise';
import { cancelScheduledAudio, playChordVoiced, playScale, resumeAudio } from '../../../core/services/audio';
import { getSynthConfig } from '../../../services/synthConfig';
import { executeTheoryQuery } from '../../../utils/queryExecutor';
import { showLessonQuery, keepLessonInstrument } from '../../../services/lessonInstrument';
import { openDockForLesson } from '../../../services/lessonDock';
import { playRhythm } from '../../../utils/rhythmPlayback';
import { useAppStore } from '../../../state/store';
import { Button } from '../../ui/Button';
import { RhythmStaff } from '../../notation/RhythmStaff';
import { StaffNotationSkeleton } from '../../notation/StaffNotationSkeleton';
import { accentText } from '../../../design/tokens/learnColors';
import { tryThisPicture } from './tryThisPicture';
import { useNoteLabel } from '../../../hooks/useSolfege';

const StaffNotation = lazy(() =>
  import('../../notation/StaffNotation').then((m) => ({ default: m.StaffNotation })),
);

interface InlineTryThisProps {
  query: string;
  label: string;
  accent: string;
  /** A rhythm lesson's Try This: drawn on a one-line staff and played as clicks. */
  rhythm?: RhythmPattern;
  /** A smaller panel under a practice task. */
  compact?: boolean;
  /** Extra line under the label (a milestone's prompt). */
  prompt?: string;
  /** The clef lesson: the scale on a treble staff and, an octave lower, on a bass staff. */
  clefs?: boolean;
  /**
   * A sound-first lesson (the "Start with sound" track, wave 2): no staff —
   * the notes it plays are written out by name instead (letters, with Dó, Ré,
   * Mi beside them when that setting is on).
   */
  names?: boolean;
}

/**
 * "Try this" in place (W4b, D-27): a small staff of what the lesson names,
 * "Hear it", and "Show on the piano / guitar", which puts it on the
 * instrument and opens the dock — the learner stays in the lesson. "Open in
 * Explore" keeps the old executor behaviour (jump to Explore with it
 * selected) for anyone who wants the full workbench.
 */
export function InlineTryThis({ query, label, accent, rhythm, compact = false, prompt, clefs = false, names = false }: InlineTryThisProps) {
  const { t } = useTranslation();
  const noteLabel = useNoteLabel();
  const instrument = useAppStore((s) => s.instrument);
  const currentKey = useAppStore((s) => s.selectedKey);
  const picture = useMemo(() => (rhythm ? { kind: 'none' as const } : tryThisPicture(query, currentKey)), [query, rhythm, currentKey]);

  const hear = async () => {
    if (rhythm) {
      await playRhythm(rhythm);
      return;
    }
    if (picture.kind === 'none') return;
    cancelScheduledAudio();
    await resumeAudio();
    const cfg = getSynthConfig('piano');
    if (picture.kind === 'scale') playScale(picture.notes, picture.pitches[0]?.octave ?? 4, true, false, 0.35, undefined, undefined, cfg);
    else playChordVoiced(picture.notes, 4, 1.4, cfg, picture.bass);
  };

  const show = () => {
    if (showLessonQuery(query)) openDockForLesson();
  };

  const openInExplore = () => {
    keepLessonInstrument();
    executeTheoryQuery(query);
  };

  const canShow = !rhythm && picture.kind !== 'none';
  return (
    <div
      className={`rounded-2xl grid gap-3 items-center ${compact ? 'p-3' : 'p-3.5 sm:grid-cols-[1fr_minmax(0,1fr)]'}`}
      style={{ border: `1.5px solid ${accent}`, backgroundColor: 'var(--card)' }}
      data-testid="inline-try-this"
    >
      <div className="flex flex-col gap-1.5 min-w-0">
        {!compact && (
          <span className="type-label" style={{ color: accentText(accent) }}>
            {t('learn.tryThis')}
          </span>
        )}
        <span className="text-body" style={{ color: 'var(--text)' }}>{label}</span>
        {prompt && <span className="text-ui" style={{ color: 'var(--text-muted)' }}>{prompt}</span>}
        <div className="flex flex-wrap gap-2 mt-1">
          {(rhythm || picture.kind !== 'none') && (
            <Button
              variant="secondary"
              onClick={() => { void hear(); }}
              startIcon={<svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor" /></svg>}
            >
              {t('lesson.hearIt')}
            </Button>
          )}
          {canShow && (
            <Button variant="secondary" onClick={show}>
              {t(instrument === 'guitar' ? 'lesson.showOnGuitar' : 'lesson.showOnPiano')}
            </Button>
          )}
          {!rhythm && (
            <Button variant="quiet" onClick={openInExplore}>
              {t('lesson.openInExplore')}
            </Button>
          )}
        </div>
      </div>
      {rhythm ? (
        <RhythmStaff pattern={rhythm} />
      ) : names && picture.kind !== 'none' ? (
        <p className="try-this-names text-title learn-serif flex flex-wrap gap-x-3 gap-y-1 m-0 min-w-0" style={{ color: 'var(--text)' }} data-testid="try-this-names">
          {(picture.kind === 'chord' ? picture.notes : picture.pitches).map((note, i) => (
            <span key={i}>{noteLabel(note)}</span>
          ))}
        </p>
      ) : clefs && picture.kind === 'scale' ? (
        <div className="flex flex-col gap-1 min-w-0" data-testid="try-this-clefs">
          {(['treble', 'bass'] as const).map((clef) => (
            <figure key={clef} className="m-0 min-w-0">
              <figcaption className="text-ui" style={{ color: 'var(--text-muted)' }}>
                {t(clef === 'treble' ? 'lesson.trebleClef' : 'lesson.bassClef')}
              </figcaption>
              <Suspense fallback={<StaffNotationSkeleton height={100} />}>
                <StaffNotation
                  notes={clef === 'treble' ? picture.pitches : picture.pitches.map((p) => ({ ...p, octave: p.octave - 1 }))}
                  clef={clef}
                  duration="q"
                  height={100}
                />
              </Suspense>
            </figure>
          ))}
        </div>
      ) : picture.kind !== 'none' ? (
        <Suspense fallback={<StaffNotationSkeleton height={100} />}>
          <StaffNotation
            notes={picture.pitches}
            chord={picture.kind === 'chord'}
            duration={picture.kind === 'chord' ? 'w' : 'q'}
            height={100}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
