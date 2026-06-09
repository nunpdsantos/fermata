import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Note, NaturalNote, Accidental, noteToString, ChordIdentification } from '../../core/types/music.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { identifyChordFromNotes } from '../../core/utils/reverseChordParser.ts';
import { CHORD_QUALITY_NAMES } from '../../core/constants/chords.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useAppStore } from '../../state/store.ts';
import { ChromaticStrip } from './ChromaticStrip.tsx';
import { ChordBuilderStaff } from './ChordBuilderStaff.tsx';

// Default chromatic spelling fallback when a pitch isn't in the current scale.
const PC_TO_NOTE_SHARP: Record<number, Note> = {
  0:  { natural: 'C', accidental: '' },
  1:  { natural: 'C', accidental: '#' },
  2:  { natural: 'D', accidental: '' },
  3:  { natural: 'D', accidental: '#' },
  4:  { natural: 'E', accidental: '' },
  5:  { natural: 'F', accidental: '' },
  6:  { natural: 'F', accidental: '#' },
  7:  { natural: 'G', accidental: '' },
  8:  { natural: 'G', accidental: '#' },
  9:  { natural: 'A', accidental: '' },
  10: { natural: 'A', accidental: '#' },
  11: { natural: 'B', accidental: '' },
};
const PC_TO_NOTE_FLAT: Record<number, Note> = {
  ...PC_TO_NOTE_SHARP,
  1:  { natural: 'D', accidental: 'b' },
  3:  { natural: 'E', accidental: 'b' },
  6:  { natural: 'G', accidental: 'b' },
  8:  { natural: 'A', accidental: 'b' },
  10: { natural: 'B', accidental: 'b' },
};

const CHORD_ROOT_OPTIONS: Note[] = [
  { natural: 'C',  accidental: '' },
  { natural: 'D',  accidental: 'b' },
  { natural: 'D',  accidental: '' },
  { natural: 'E',  accidental: 'b' },
  { natural: 'E',  accidental: '' },
  { natural: 'F',  accidental: '' },
  { natural: 'F',  accidental: '#' },
  { natural: 'G',  accidental: '' },
  { natural: 'A',  accidental: 'b' },
  { natural: 'A',  accidental: '' },
  { natural: 'B',  accidental: 'b' },
  { natural: 'B',  accidental: '' },
];

const INTERVAL_SHORT = ['R','m2','M2','m3','M3','P4','TT','P5','m6','M6','m7','M7','8'] as const;

function noteFromValue(value: string): Note {
  const m = value.match(/^([A-G])(.*)$/);
  if (!m) return { natural: 'C', accidental: '' };
  return { natural: m[1] as NaturalNote, accidental: (m[2] as Accidental) || '' };
}

/**
 * Reverse-build mode for the chord panel. Toggle blocks on a 13-step chromatic
 * strip from a chord root; Fermata's reverseChordParser names whatever you build.
 * In-key blocks are tinted with the diatonic-degree colour and labelled with
 * their scale degree, so the strip teaches key-context as you click.
 */
export function ChordBuilderPanel() {
  const { t } = useTranslation();
  const { scale, scalePitchClasses, diatonicChords } = useKeyContext();
  const selectedKey = useAppStore((s) => s.selectedKey);

  const [chordRoot, setChordRoot] = useState<Note>(selectedKey);
  const [active, setActive] = useState<Set<number>>(new Set([0]));

  const isFlatKey = useMemo(() => scale.notes.some((n) => n.accidental.includes('b')), [scale]);

  const noteAtStep = useCallback(
    (step: number): Note => {
      const pc = (getPitchClass(chordRoot) + step) % 12;
      const inScale = scale.notes.find((n) => getPitchClass(n) === pc);
      if (inScale) return inScale;
      return (isFlatKey ? PC_TO_NOTE_FLAT : PC_TO_NOTE_SHARP)[pc];
    },
    [chordRoot, scale, isFlatKey]
  );

  const pitchClassAtStep = useCallback(
    (step: number) => (getPitchClass(chordRoot) + step) % 12,
    [chordRoot]
  );

  const pitchClassToDegree = useCallback(
    (pc: number): number | undefined => {
      const idx = scale.notes.findIndex((n) => getPitchClass(n) === pc);
      return idx >= 0 ? idx + 1 : undefined;
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
    () => [...active].sort((a, b) => a - b).map((s) => noteAtStep(s)),
    [active, noteAtStep]
  );
  const identification = useMemo(() => identifyChordFromNotes(inputNotes), [inputNotes]);
  const top: ChordIdentification | undefined = identification.results[0];

  const stepsSorted = useMemo(() => [...active].sort((a, b) => a - b), [active]);
  const intervalsLabel = stepsSorted.map((s) => INTERVAL_SHORT[s]).join(', ');
  const notesLabel = inputNotes.map(noteToString).join(' – ');
  const semitonesLabel = stepsSorted.join(', ');

  const role = useMemo(() => {
    if (!top || top.confidence !== 'exact') return null;
    const rootPc = getPitchClass(top.chord.root);
    const match = diatonicChords.find(
      (dc) => getPitchClass(dc.chord.root) === rootPc && dc.chord.quality === top.chord.quality
    );
    const keyLabel = `${noteToString(scale.root)} ${scale.type.replace('_', ' ')}`;
    if (match) return { label: `${match.numeral} ${t('chordBuilder.ofKey', { key: keyLabel })}`, inKey: true };
    const degIdx = scale.notes.findIndex((n) => getPitchClass(n) === rootPc);
    if (degIdx >= 0) {
      return {
        label: t('chordBuilder.nonDiatonicAt', { numeral: diatonicChords[degIdx]?.numeral ?? `${degIdx + 1}`, key: keyLabel }),
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
            {CHORD_ROOT_OPTIONS.map((n) => {
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
      </div>

      <ChromaticStrip
        rootNote={chordRoot}
        noteAtStep={noteAtStep}
        activeSteps={active}
        onToggleStep={onToggleStep}
        inKeyPitchClasses={scalePitchClasses}
        pitchClassToDegree={pitchClassToDegree}
        pitchClassAtStep={pitchClassAtStep}
      />

      <ChordBuilderStaff
        notes={inputNotes}
        detectedChord={top && top.confidence === 'exact' ? top.chord : undefined}
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
