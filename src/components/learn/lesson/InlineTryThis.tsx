import { Suspense, lazy, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { RhythmPattern } from '../../../core/types/exercise';
import { cancelScheduledAudio, playPitchedArpeggio, playPitchedNotes, playScale, playTimedNotes, resumeAudio } from '../../../core/services/audio';
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
import { tryThisPicture, type TryThisPicture } from './tryThisPicture';
import { DemoStaffPlaceholder } from './DemoStaffPlaceholder';
import { useNoteLabel } from '../../../hooks/useSolfege';
import { chordListSounds } from '../../../utils/queryExecutorChords';
import { withGlyphs } from '../../../core/utils/accidentalGlyphs';
import type { Demonstration } from '../../../core/types/demonstration';
import { demonstrationSchedule, demonstrationPitchClasses } from '../../../core/utils/demonstration';
import { getPitchClass } from '../../../core/constants/notes';

const StaffNotation = lazy(() =>
  import('../../notation/StaffNotation').then((m) => ({ default: m.StaffNotation })),
);
// A demonstration's staff and its words load with it, as the scale staff does.
const DemoStaff = lazy(() => import('./DemoStaffWithWords'));

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
  /** A scale heard and written from the top down (the concept's `descending`, audit A22). */
  descending?: boolean;
  /** A demonstration written out note by note (the concept's or task's `demo`, second audit M50–M56): played and drawn instead of the query's picture. */
  demo?: Demonstration;
}

/** The pitch classes the lesson's instrument would show for a picture of the query, if it shows notes. */
function shownPitchClasses(picture: TryThisPicture): Set<number> | null {
  if (picture.kind === 'scale') return new Set(picture.notes.map(getPitchClass));
  if (picture.kind === 'chord') return new Set([...picture.notes, ...(picture.bass ? [picture.bass] : [])].map(getPitchClass));
  return null;
}

/**
 * "Try this" in place (W4b, D-27): a small staff of what the lesson names,
 * "Hear it", and "Show on the piano / guitar", which puts it on the
 * instrument and opens the dock — the learner stays in the lesson. "Open in
 * Explore" keeps the old executor behaviour (jump to Explore with it
 * selected) for anyone who wants the full workbench.
 */
export function InlineTryThis({ query, label, accent, rhythm, compact = false, prompt, clefs = false, names = false, descending = false, demo }: InlineTryThisProps) {
  const { t } = useTranslation();
  const noteLabel = useNoteLabel();
  const instrument = useAppStore((s) => s.instrument);
  const currentKey = useAppStore((s) => s.selectedKey);
  const picture = useMemo(() => (rhythm ? { kind: 'none' as const } : tryThisPicture(query, currentKey, { descending, demo })), [query, rhythm, currentKey, descending, demo]);
  // A demonstration offers "Show on …" and "Open in Explore" only where the
  // query shows exactly the notes it plays (a key's scale; a chord with its
  // notes), never a different set: Dm11's six notes stacked in thirds under a
  // four-note quartal voicing, the very sound the second audit's M51 was
  // about (fix pass, item 8).
  const showsDemoNotes = useMemo(() => {
    if (!demo) return true;
    const shown = shownPitchClasses(tryThisPicture(query, currentKey));
    const played = demonstrationPitchClasses(demo);
    return !!shown && shown.size === played.size && [...played].every((pc) => shown.has(pc));
  }, [demo, query, currentKey]);

  const hear = async () => {
    if (rhythm) {
      await playRhythm(rhythm);
      return;
    }
    if (picture.kind === 'none') return;
    cancelScheduledAudio();
    await resumeAudio();
    const cfg = getSynthConfig('piano');
    const volume = typeof cfg.volume === 'number' ? cfg.volume : 0.65;
    if (picture.kind === 'demo') {
      // Every note at its written onset, held for its written length, on the
      // audio clock in one go (notes starting together share the loudness).
      playTimedNotes(
        demonstrationSchedule(picture.demo).map(({ note, at, duration, together }) => ({ note, at, duration, volume: volume / (1 + 0.2 * (together - 1)) })),
        cfg,
      );
    } else if (picture.kind === 'chords') {
      // A chord list (wave 2): each chord once, in order, over its bass.
      playTimedNotes(
        chordListSounds(picture.chords).flatMap(({ at, duration, pitches }) =>
          pitches.map((note) => ({ note, at, duration, volume: volume / (1 + 0.2 * (pitches.length - 1)) }))),
        cfg,
      );
    } else if (picture.kind === 'scale' && picture.descending) {
      // From the top down, exactly the pitches the staff writes, at the
      // scale's own pace (playScale has no form that starts on the upper tonic).
      playPitchedArpeggio(picture.pitches, 0.35, undefined, undefined, cfg);
    } else if (picture.kind === 'scale') playScale(picture.notes, picture.pitches[0]?.octave ?? 4, true, false, 0.35, undefined, undefined, cfg);
    // A chord: exactly the pitches its staff draws (an inversion as an inversion).
    else playPitchedNotes(picture.pitches, 1.4, cfg);
  };

  const show = () => {
    if (showLessonQuery(query)) openDockForLesson();
  };

  /** One chord of a chord list: it sounds and stands on the instrument. */
  const showChord = async (index: number) => {
    if (picture.kind !== 'chords') return;
    const entry = picture.chords[index];
    if (!entry) return;
    if (showLessonQuery(entry.symbol)) openDockForLesson();
    cancelScheduledAudio();
    await resumeAudio();
    // Exactly the voicing it has in the list ("Hear it"), its bass where the list puts it.
    playPitchedNotes(chordListSounds(picture.chords)[index].pitches, 1.2, getSynthConfig('piano'));
  };

  const openInExplore = () => {
    keepLessonInstrument();
    executeTheoryQuery(query);
  };

  const canShow = !rhythm && picture.kind !== 'none' && picture.kind !== 'chords' && showsDemoNotes;
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
          {!rhythm && showsDemoNotes && (
            <Button variant="quiet" onClick={openInExplore}>
              {t('lesson.openInExplore')}
            </Button>
          )}
        </div>
      </div>
      {rhythm ? (
        <RhythmStaff pattern={rhythm} />
      ) : picture.kind === 'chords' ? (
        <div role="group" aria-label={t('tracks.chordList.label')} className="flex flex-wrap gap-2 min-w-0" data-testid="try-this-chords">
          {picture.chords.map(({ symbol }, i) => (
            <Button
              key={i}
              variant="secondary"
              aria-label={t(instrument === 'guitar' ? 'tracks.chordList.showGuitar' : 'tracks.chordList.showPiano', { chord: withGlyphs(symbol) })}
              onClick={() => { void showChord(i); }}
            >
              <span className="learn-serif text-title">{withGlyphs(symbol)}</span>
            </Button>
          ))}
        </div>
      ) : picture.kind === 'demo' && !names ? (
        <Suspense fallback={<DemoStaffPlaceholder demo={picture.demo} />}>
          <DemoStaff demo={picture.demo} />
        </Suspense>
      ) : names && (picture.kind === 'scale' || picture.kind === 'chord' || picture.kind === 'demo') ? (
        // A list, so a screen reader names each note on its own ("C", "D", …)
        // rather than reading the row as one word.
        <ul role="list" className="try-this-names text-title learn-serif flex flex-wrap gap-x-3 gap-y-1 m-0 p-0 list-none min-w-0" style={{ color: 'var(--text)' }} data-testid="try-this-names">
          {(picture.kind === 'chord' ? picture.notes : picture.kind === 'demo' ? demonstrationSchedule(picture.demo).map((s) => s.note) : picture.pitches).map((note, i) => (
            <li key={i}>{noteLabel(note)}</li>
          ))}
        </ul>
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
      ) : picture.kind === 'scale' || picture.kind === 'chord' ? (
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
