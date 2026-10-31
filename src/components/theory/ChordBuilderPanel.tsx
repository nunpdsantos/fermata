import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Note, NaturalNote, Accidental, noteToString, ChordIdentification } from '../../core/types/music.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { identifyChordFromNotes } from '../../core/utils/reverseChordParser.ts';
import { CHORD_QUALITY_NAMES } from '../../core/constants/chords.ts';
import { SCALE_TYPE_NAMES } from '../../core/constants/scales.ts';
import {
  canonicalIntervalNumber,
  spellIntervalAbove,
  intervalBetween,
  degreeOf,
  degreeColorSlot,
} from '../../core/utils/degreeSpelling.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useAppStore } from '../../state/store.ts';
import { resumeAudio, playChordVoiced } from '../../core/services/audio.ts';
import { getSynthConfig } from '../../services/synthConfig.ts';
import { ChromaticStrip } from './ChromaticStrip.tsx';

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
export function ChordBuilderPanel() {
  const { t } = useTranslation();
  const { scale, scalePitchClasses, diatonicChords } = useKeyContext();
  const selectedKey = useAppStore((s) => s.selectedKey);
  const synthPreset = useAppStore((s) => s.synthPreset);
  const baseOctave = useAppStore((s) => s.baseOctave);
  const setSelectedChord = useAppStore((s) => s.setSelectedChord);

  const [chordRoot, setChordRoot] = useState<Note>(selectedKey);
  const [active, setActive] = useState<Set<number>>(new Set([0]));

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
    setSelectedChord(top && top.confidence === 'exact' ? top.chord : null);
  }, [top, setSelectedChord]);

  const handlePlay = useCallback(async () => {
    if (active.size === 0 || inputNotes.length === 0) return;
    await resumeAudio();
    // A recognised chord plays exactly as the instruments light it (the
    // selected chord's voicing); an unrecognised set plays as built.
    const recognised = top && top.confidence === 'exact' ? top.chord : null;
    playChordVoiced(recognised ? recognised.notes : inputNotes, baseOctave, 1.2, getSynthConfig(synthPreset), recognised?.bassNote);
  }, [active.size, inputNotes, baseOctave, synthPreset, top]);

  const stepsSorted = useMemo(() => [...active].sort((a, b) => a - b), [active]);
  const intervalsLabel = stepsSorted.map(intervalAtStep).join(', ');
  const notesLabel = stepsSorted.map((s) => noteToString(noteAtStep(s))).join(' – ');
  const semitonesLabel = stepsSorted.join(', ');

  const role = useMemo(() => {
    if (!top || top.confidence !== 'exact') return null;
    const rootPc = getPitchClass(top.chord.root);
    const match = diatonicChords.find(
      (dc) => getPitchClass(dc.chord.root) === rootPc && dc.chord.quality === top.chord.quality
    );
    // Display names, never internal ids (audit W1-10: was "C diminished whole_half").
    const keyLabel = `${noteToString(scale.root)} ${SCALE_TYPE_NAMES[scale.type]}`;
    if (match) return { label: `${match.numeral} ${t('chordBuilder.ofKey', { key: keyLabel })}`, inKey: true };
    const degIdx = scale.notes.findIndex((n) => getPitchClass(n) === rootPc);
    if (degIdx >= 0) {
      return {
        label: t('chordBuilder.nonDiatonicAt', {
          numeral: diatonicChords.find((dc) => getPitchClass(dc.chord.root) === rootPc)?.numeral
            ?? `${degreeOf(scale.root, scale.notes[degIdx]).number}`,
          key: keyLabel,
        }),
        inKey: false,
      };
    }
    return { label: t('chordBuilder.outOfKey', { key: keyLabel }), inKey: false };
  }, [top, diatonicChords, scale, t]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 items-end">
        <label className="flex flex-col gap-1 text-2xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          <span>{t('chordBuilder.chordRoot')}</span>
          <select
            value={`${chordRoot.natural}${chordRoot.accidental}`}
            onChange={(e) => {
              setChordRoot(noteFromValue(e.target.value));
              setActive(new Set([0]));
            }}
            className="rounded-md px-2 py-1.5 text-sm normal-case tracking-normal"
            style={{
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            }}
          >
            {rootOptionsFor(chordRoot).map((n) => {
              const v = `${n.natural}${n.accidental}`;
              return (
                <option key={v} value={v}>
                  {noteToString(n)}
                </option>
              );
            })}
          </select>
        </label>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md px-3 py-1.5 text-sm"
          style={{
            backgroundColor: 'var(--input-bg)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          }}
        >
          {t('chordBuilder.clear')}
        </button>
        <button
          type="button"
          onClick={onSyncToTonic}
          className="rounded-md px-3 py-1.5 text-sm"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
          }}
          title={t('chordBuilder.syncRootTitle', { tonic: noteToString(selectedKey) })}
        >
          {t('chordBuilder.syncRoot')}
        </button>
        <button
          type="button"
          onClick={handlePlay}
          disabled={active.size === 0}
          className="rounded-md px-3 py-1.5 text-sm"
          style={{
            backgroundColor: active.size === 0 ? 'var(--input-bg)' : 'var(--accent)',
            color: active.size === 0 ? 'var(--text-muted)' : 'var(--bg)',
            border: '1px solid var(--border)',
            opacity: active.size === 0 ? 0.5 : 1,
            cursor: active.size === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {t('chordBuilder.play')}
        </button>
      </div>

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

      <div
        className="rounded-xl p-3 text-sm"
        style={{
          backgroundColor: 'var(--bg-raised)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text)',
        }}
      >
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-2xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            {t('chordBuilder.detected')}
          </span>
          {top ? (
            <span className="text-base font-semibold" style={{ color: 'var(--accent)' }}>
              {noteToString(top.chord.root)}{' '}
              {CHORD_QUALITY_NAMES[top.chord.quality] ?? top.chord.quality}
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>
              {active.size > 1 ? t('chordBuilder.noMatch') : '—'}
            </span>
          )}
          {top && top.confidence !== 'exact' && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              ({top.interpretation})
            </span>
          )}
          {role && (
            <span
              className="text-xs font-medium"
              style={{ color: role.inKey ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              {role.inKey ? role.label : `(${role.label})`}
            </span>
          )}
        </div>

        <div className="mt-2 grid gap-y-1 gap-x-6 text-xs" style={{ gridTemplateColumns: 'auto 1fr' }}>
          <span style={{ color: 'var(--text-muted)' }}>{t('chordBuilder.notes')}</span>
          <span>{notesLabel || t('chordBuilder.none')}</span>
          <span style={{ color: 'var(--text-muted)' }}>{t('chordBuilder.intervals')}</span>
          <span>{intervalsLabel || t('chordBuilder.none')}</span>
          <span style={{ color: 'var(--text-muted)' }}>{t('chordBuilder.halfSteps')}</span>
          <span>{semitonesLabel || t('chordBuilder.none')}</span>
        </div>

        {identification.results.length > 1 && (
          <details className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <summary className="cursor-pointer">{t('chordBuilder.otherInterpretations')}</summary>
            <ul className="mt-1 ml-4 list-disc space-y-0.5">
              {identification.results.slice(1, 5).map((r, i) => (
                <li key={i}>
                  {noteToString(r.chord.root)}{' '}
                  {CHORD_QUALITY_NAMES[r.chord.quality] ?? r.chord.quality}
                  {' — '}
                  <span style={{ color: 'var(--text-dim)' }}>{r.interpretation}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
