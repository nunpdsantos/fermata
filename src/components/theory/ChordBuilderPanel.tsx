import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Term } from '../../glossary/Term.tsx';
import { termAttr } from '../../glossary/visibleTerms.ts';
import { qualityTermId } from '../../glossary/termIds.ts';
import { Note, NaturalNote, Accidental, noteToString, ChordIdentification, type Chord } from '../../core/types/music.ts';
import { withGlyphs } from '../../core/utils/accidentalGlyphs.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { identifyChordFromNotes } from '../../core/utils/reverseChordParser.ts';
import { qualityName } from '../../utils/qualityName.ts';
import { toContentLanguage } from '../drill/drillText.ts';
import {
  canonicalIntervalNumber,
  spellIntervalAbove,
  intervalBetween,
  degreeOf,
  degreeColorSlot,
} from '../../core/utils/degreeSpelling.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { exploreRegister } from '../explore/exploreRegister';
import { useAppStore } from '../../state/store.ts';
import { resumeAudio, playChordVoiced, playPitchedNotes, cancelScheduledAudio } from '../../core/services/audio.ts';
import { getSynthConfig } from '../../services/synthConfig.ts';
import { ChromaticStrip } from './ChromaticStrip.tsx';
import { builderRole, matchText, otherReadings } from './builderRole.ts';
import { SelectTrigger } from '../ui/SelectTrigger.tsx';
import { Button } from '../ui/Button.tsx';
import { exploreReturn, noteBuilt } from '../../state/appHistory';

// Both everyday names of every black key, so the dropdown can always show the
// strip's root as spelled (C♯ and D♭ are different roots to spell from).
const CHORD_ROOT_OPTIONS: Note[] = [
  'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
].map((s) => ({ natural: s[0] as NaturalNote, accidental: s.slice(1) as Accidental }));

/** The options, plus the current root when it is a rarer name (C♭, B♯, F𝄪…). */
function rootOptionsFor(current: Note): Note[] {
  const has = CHORD_ROOT_OPTIONS.some((n) => n.natural === current.natural && n.accidental === current.accidental);
  return has ? CHORD_ROOT_OPTIONS : [...CHORD_ROOT_OPTIONS, current];
}

function noteFromValue(value: string): Note {
  const m = value.match(/^([A-G])(.*)$/);
  if (!m) return { natural: 'C', accidental: '' };
  return { natural: m[1] as NaturalNote, accidental: (m[2] as Accidental) || '' };
}

/** "R", "m3", "A5", "8": the interval a block's note forms with the strip root. */
function intervalLabelFor(root: Note, note: Note, step: number): string {
  if (step === 0) return 'R';
  if (step === 12) return '8';
  return intervalBetween(root, note).short;
}

/**
 * Reverse-build mode for the chord panel. Toggle blocks on a 13-step chromatic
 * strip from a chord root; Fermata's reverseChordParser names whatever you build.
 * In-key blocks are tinted with the diatonic-degree colour and labelled with
 * their scale degree, so the strip teaches key-context as you click.
 *
 * Spelling (audit W1-07): every block is spelled by its INTERVAL from the
 * chosen root (m3 = E♭ above C, never D♯; the root keeps the name you chose),
 * and once the blocks form a chord, its tones show the chord's own spelling
 * (C augmented's raised 5th is G♯, labelled A5). The key no longer decides.
 */
/** The same chord: root, quality, notes, bass and name. */
function sameChord(a: Chord, b: Chord): boolean {
  const id = (c: Chord) => JSON.stringify([c.root, c.quality, c.notes, c.bassNote ?? null, c.algorithmicDisplayName ?? null]);
  return id(a) === id(b);
}

export function ChordBuilderPanel() {
  const { t, i18n } = useTranslation();
  const lang = toContentLanguage(i18n.language);
  const { scale, scalePitchClasses, diatonicChords, invertedNotes } = useKeyContext();
  const selectedKey = useAppStore((s) => s.selectedKey);
  const synthPreset = useAppStore((s) => s.synthPreset);
  const instrument = useAppStore((s) => s.instrument);
  const baseOctave = useAppStore((s) => s.baseOctave);
  const setSelectedChord = useAppStore((s) => s.setSelectedChord);

  // Back into Explore brings back what was built (state/appHistory.ts); otherwise the key's root alone.
  const [chordRoot, setChordRoot] = useState<Note>(() => exploreReturn()?.built?.root ?? selectedKey);
  const [active, setActive] = useState<Set<number>>(() => new Set(exploreReturn()?.built?.steps ?? [0]));
  useEffect(() => {
    noteBuilt({ root: chordRoot, steps: [...active] });
    return () => noteBuilt(null);
  }, [chordRoot, active]);

  // The note each block stands for, spelled by its interval from the root.
  const intervalNoteAtStep = useCallback(
    (step: number): Note => spellIntervalAbove(chordRoot, canonicalIntervalNumber(step), step),
    [chordRoot]
  );

  const pitchClassAtStep = useCallback(
    (step: number) => (getPitchClass(chordRoot) + step) % 12,
    [chordRoot]
  );

  // Degree badge from the key: the scale note's FUNCTION, read from its
  // spelled letter (audit W1-06), not its position in the scale.
  const pitchClassToDegree = useCallback(
    (pc: number): number | undefined => {
      const n = scale.notes.find((s) => getPitchClass(s) === pc);
      return n ? degreeColorSlot(degreeOf(scale.root, n)) : undefined;
    },
    [scale]
  );

  const onToggleStep = useCallback((step: number) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(step)) next.delete(step);
      else next.add(step);
      return next;
    });
  }, []);

  const onClear = () => setActive(new Set([0]));
  const onSyncToTonic = () => {
    setChordRoot(selectedKey);
    setActive(new Set([0]));
  };

  const inputNotes = useMemo<Note[]>(
    () => [...active].sort((a, b) => a - b).map((s) => intervalNoteAtStep(s)),
    [active, intervalNoteAtStep]
  );
  const identification = useMemo(() => identifyChordFromNotes(inputNotes), [inputNotes]);
  // Among equally good names, prefer the one rooted on the strip's anchor when
  // the anchor block is on (C E G# built from C is C augmented, not E or G♯
  // augmented — symmetric chords have several names).
  const top: ChordIdentification | undefined = useMemo(() => {
    const best = identification.results[0];
    if (!best || !active.has(0)) return best;
    const anchorPc = getPitchClass(chordRoot);
    return identification.results.find(
      (r) => r.score === best.score && r.confidence === best.confidence && getPitchClass(r.chord.root) === anchorPc,
    ) ?? best;
  }, [identification, active, chordRoot]);

  // Once a chord is recognised, its tones show the chord's own spelling.
  const noteAtStep = useCallback(
    (step: number): Note => {
      if (top && top.confidence === 'exact') {
        const pc = (getPitchClass(chordRoot) + step) % 12;
        const tone = top.chord.notes.find((n) => getPitchClass(n) === pc);
        if (tone) return tone;
      }
      return intervalNoteAtStep(step);
    },
    [top, chordRoot, intervalNoteAtStep]
  );

  const intervalAtStep = useCallback(
    (step: number): string => intervalLabelFor(chordRoot, noteAtStep(step), step),
    [chordRoot, noteAtStep]
  );

  // Drive the shared selection live: as soon as the strip forms a recognised
  // chord, the workspace staff and instruments update immediately; when the
  // note-set is unrecognised, selectedChord clears (instruments fall back to
  // the scale — per spec §13.3 we do NOT synthesise a chord from an
  // unrecognised note-set).
  useEffect(() => {
    const next = top && top.confidence === 'exact' ? top.chord : null;
    // The chord these blocks build is selected already (Back brought it back with
    // its inversion, which selecting it again would reset): left as it is.
    const now = useAppStore.getState().selectedChord;
    if (next && now && sameChord(now, next)) return;
    setSelectedChord(next);
  }, [top, setSelectedChord]);

  const handlePlay = useCallback(async () => {
    if (active.size === 0 || inputNotes.length === 0) return;
    await resumeAudio();
    // A recognised chord plays exactly as the instruments light it (the
    // selected chord's voicing); an unrecognised set plays as built.
    const recognised = top && top.confidence === 'exact' ? top.chord : null;
    cancelScheduledAudio(); // replaces whatever was sounding (W8-01)
    if (instrument === 'guitar') {
      const notes = recognised ? (invertedNotes.length ? invertedNotes : recognised.notes) : inputNotes;
      playPitchedNotes(exploreRegister(instrument).chordPitches(notes, recognised?.bassNote), 1.2, getSynthConfig(synthPreset));
      return;
    }
    playChordVoiced(recognised ? recognised.notes : inputNotes, baseOctave, 1.2, getSynthConfig(synthPreset), recognised?.bassNote);
  }, [active.size, inputNotes, baseOctave, synthPreset, top, instrument, invertedNotes]);

  const stepsSorted = useMemo(() => [...active].sort((a, b) => a - b), [active]);
  const intervalsLabel = stepsSorted.map(intervalAtStep).join(', ');
  const notesLabel = stepsSorted.map((s) => withGlyphs(noteAtStep(s))).join(' – ');
  const semitonesLabel = stepsSorted.join(', ');

  // Every other reading of the notes built, the main one never again (fix pass).
  const others = useMemo(() => otherReadings(top, identification.results), [top, identification]);

  const role = useMemo(
    () => builderRole(top && top.confidence === 'exact' ? top.chord : null, scale, diatonicChords, t),
    [top, diatonicChords, scale, t],
  );

  return (
    <div className="chord-builder space-y-3">
      {/* W11-A: v2 controls (36 / 44 px, tokens); the layout is the Explore
          batch's (D-25). */}
      <div data-chord-scroll-row className="flex flex-wrap gap-2 items-end">
        <label className="builder-root-field flex flex-col gap-1">
          <span className="type-label" {...termAttr('root')}>{t('chordBuilder.chordRoot')}</span>
          <SelectTrigger
            value={`${chordRoot.natural}${chordRoot.accidental}`}
            onChange={(e) => {
              setChordRoot(noteFromValue(e.target.value));
              setActive(new Set([0]));
            }}
          >
            {rootOptionsFor(chordRoot).map((n) => {
              const v = `${n.natural}${n.accidental}`;
              return (
                <option key={v} value={v}>
                  {withGlyphs(n)}
                </option>
              );
            })}
          </SelectTrigger>
        </label>
        <Button onClick={onClear}>{t('chordBuilder.clear')}</Button>
        <Button variant="quiet" onClick={onSyncToTonic} title={t('chordBuilder.syncRootTitle', { tonic: noteToString(selectedKey) })}>
          {t('chordBuilder.syncRoot')}
        </Button>
        <Button variant="primary" onClick={handlePlay} disabled={active.size === 0}>
          {t('chordBuilder.play')}
        </Button>
      </div>

      {/* A landing row (chordScrollLanding): the detail opening below keeps
          the strip and the readout in view where they fit (audit 2026-11-18, Q4). */}
      <div data-chord-scroll-row>
      <ChromaticStrip
        rootNote={chordRoot}
        noteAtStep={noteAtStep}
        activeSteps={active}
        onToggleStep={onToggleStep}
        inKeyPitchClasses={scalePitchClasses}
        pitchClassToDegree={pitchClassToDegree}
        pitchClassAtStep={pitchClassAtStep}
        intervalAtStep={intervalAtStep}
      />
      </div>

      {/* The readout. On the workbench (≥ 1200 px) its facts share one line
          and it is a landing row, so the detail opens with it in view
          (index.css, stream C; audit 2026-11-18, Q4). */}
      <div
        className="builder-readout rounded-xl p-3 text-sm"
        data-chord-scroll-row
        data-testid="builder-readout"
        style={{
          backgroundColor: 'var(--bg-raised)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text)',
        }}
      >
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-caption uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            {t('chordBuilder.detected')}
          </span>
          {top ? (
            <span className="text-base font-semibold" style={{ color: 'var(--accent-text)' }}>
              {withGlyphs(top.chord.root)}{' '}
              <Term id={qualityTermId(top.chord.quality)}>{qualityName(top.chord.quality, lang)}</Term>
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>
              {active.size > 1 ? t('chordBuilder.noMatch') : '—'}
            </span>
          )}
          {top && top.confidence !== 'exact' && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              ({matchText(top, t)})
            </span>
          )}
          {role && (
            <span
              className="text-xs font-medium"
              style={{ color: role.inKey ? 'var(--accent-text)' : 'var(--text-muted)' }}
              {...termAttr(role.inKey ? 'romanNumeral' : 'outOfKey')}
            >
              {role.text}
            </span>
          )}
        </div>

        <div className="builder-facts mt-2 grid gap-y-1 gap-x-6 text-xs">
          <span style={{ color: 'var(--text-muted)' }}>{t('chordBuilder.notes')}</span>
          <span>{notesLabel || t('chordBuilder.none')}</span>
          <span style={{ color: 'var(--text-muted)' }} {...termAttr('interval')}>{t('chordBuilder.intervals')}</span>
          <span>{intervalsLabel || t('chordBuilder.none')}</span>
          <span style={{ color: 'var(--text-muted)' }} {...termAttr('halfStep')}>{t('chordBuilder.halfSteps')}</span>
          <span>{semitonesLabel || t('chordBuilder.none')}</span>
        </div>

        {others.length > 0 && (
          <details className="builder-others mt-2 text-xs" style={{ color: 'var(--text-muted)' }} data-testid="builder-others">
            <summary className="cursor-pointer">{t('chordBuilder.otherInterpretations')}</summary>
            <ul className="mt-1 ml-4 list-disc space-y-0.5">
              {others.map((r, i) => (
                <li key={i}>
                  {withGlyphs(r.chord.root)}{' '}
                  {qualityName(r.chord.quality, lang)}
                  {' — '}
                  <span style={{ color: 'var(--text-dim)' }}>{matchText(r, t)}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
