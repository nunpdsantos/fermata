import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GuitarTuning } from '../../core/constants/guitarTunings';
import { noteToString, type Note, type ScaleType } from '../../core/types/music';
import { toRomanNumeral } from '../../core/utils/guitarPositions';
import type { FingeredNote } from '../../core/utils/guitarFingering';
import { cancelScheduledAudio, playTimedNotes, resumeAudio } from '../../core/services/audio';
import { useFingeringStore, type OverrideFinger } from '../../state/fingeringStore';
import { useFocusNoteStore } from '../../state/focusNoteStore';
import { useAppStore } from '../../state/store';
import { getSynthConfig } from '../../services/synthConfig';
import { Button, IconButton } from '../ui/Button';
import { ChoiceChip } from '../ui/ChoiceChip';
import { shiftArrow } from './practiceNeckLayout';
import { SelectTrigger } from '../ui/SelectTrigger';
import { LabelToolbar } from '../instruments/FretboardPositionSelector';
import { StaffNotation } from '../notation/StaffNotation';
import { PracticeNeck } from './PracticeNeck';
import { practiceSchedule, routeFingerKey, type PracticeRoute } from './practiceModel';

export function PracticePlayer({ route, root, scale, tuning, editable = true }: {
  route: PracticeRoute; root: Note; scale: ScaleType; tuning: GuitarTuning; editable?: boolean;
}) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [tempo, setTempo] = useState(80);
  const [playing, setPlaying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const generation = useRef(0);
  const ownsAudio = useRef(false);
  const cursor = useRef<HTMLButtonElement>(null);
  const overrides = useFingeringStore((s) => s.overrides);
  const setOverride = useFingeringStore((s) => s.setOverride);
  const clearOverrides = useFingeringStore((s) => s.clearOverrides);
  const keyFor = (event: number, n: FingeredNote) => routeFingerKey(root, scale, tuning, route, event, n);
  const fingerFor = (event: number, n: FingeredNote) => editable && n.fret > 0 ? overrides[keyFor(event, n)] ?? n.finger : n.finger;
  const keys = route.events.flatMap((e, i) => e.notes.filter((n) => n.fret > 0).map((n) => keyFor(i, n)));
  const current = route.events[index];
  const staffNotes = useMemo(() => current.notes.map((n) => n.pitched), [current]);
  const staffColors = useMemo(() => Object.fromEntries(staffNotes.map((_, i) => [i, 'var(--accent-text)'])), [staffNotes]);
  const publish = useCallback((event: number) => {
    setIndex(event);
    const n = route.events[event].notes[0];
    useFocusNoteStore.getState().set('pinned', { source: 'practice', midi: n.midi, pc: n.midi % 12, cell: { stringIndex: n.stringIndex, fret: n.fret } });
  }, [route]);
  const stop = useCallback(() => {
    generation.current++;
    if (ownsAudio.current) cancelScheduledAudio();
    ownsAudio.current = false;
    setPlaying(false);
  }, []);
  useEffect(() => {
    const hidden = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', hidden);
    return () => {
      // Cancellation token, deliberately invalidate the latest pending resume.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      generation.current++;
      if (ownsAudio.current) cancelScheduledAudio();
      ownsAudio.current = false;
      useFocusNoteStore.getState().clear('pinned', 'practice');
      document.removeEventListener('visibilitychange', hidden);
    };
  }, [stop]);
  useEffect(() => { cursor.current?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' }); }, [index]);

  const play = async (event?: number) => {
    stop();
    const token = generation.current;
    ownsAudio.current = true;
    setError(false);
    setPlaying(true);
    try {
      await resumeAudio();
      if (generation.current !== token) return;
      cancelScheduledAudio();
      const selected = event === undefined ? route : { ...route, events: [route.events[event]], overRinging: false };
      const schedule = practiceSchedule(selected, tempo);
      playTimedNotes(schedule.notes, getSynthConfig(useAppStore.getState().synthPreset), {
        onNotePlay: (n) => publish(event ?? schedule.eventIndices[n]),
        onComplete: () => { ownsAudio.current = false; setPlaying(false); },
      });
    } catch {
      if (generation.current === token) { ownsAudio.current = false; setPlaying(false); setError(true); }
    }
  };
  const select = (next: number) => { stop(); publish(next); };
  const editNote = (event: number, n: FingeredNote) => {
    select(event);
    if (!editing || !editable) { void play(event); return; }
    if (!n.fret) return;
    const finger = (fingerFor(event, n) % 4 + 1) as OverrideFinger;
    setOverride(keyFor(event, n), finger === n.finger ? null : finger);
  };
  const shifts = current.notes.filter((n, i) => n.shift && !current.notes.slice(0, i).some((m) => JSON.stringify(m.shift) === JSON.stringify(n.shift)));
  const guideText = (n: FingeredNote) => n.shift?.kind === 'guide' ? t('practice.guide', {
    finger: n.shift.finger, string: 6 - n.shift.stringIndex,
    from: toRomanNumeral(n.shift.fromPosition), to: toRomanNumeral(n.shift.toPosition),
  }) : '';

  return (
    <div className="practice-player space-y-3" data-testid="practice-player">
      {route.stops && <div className="flex flex-wrap gap-2" role="group" aria-label={t('practice.walkPositions')} data-testid="walk-positions">
        {route.stops.map((stop) => <ChoiceChip pressed={current.notes[0].position === stop.position} key={stop.position} onClick={() => select(stop.start)}
          aria-current={current.notes[0].position === stop.position ? 'step' : undefined}>
          {toRomanNumeral(stop.position)} · {t('practice.octaveCount', { count: stop.octaves })}
        </ChoiceChip>)}
      </div>}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" onClick={() => playing ? stop() : void play()}>{playing ? t('practice.stop') : t('practice.play')}</Button>
        <IconButton aria-label={t('practice.previous')} disabled={index === 0} onClick={() => select(index - 1)} icon="←" />
        <IconButton aria-label={t('practice.next')} disabled={index === route.events.length - 1} onClick={() => select(index + 1)} icon="→" />
        <label className="flex items-center gap-2 text-ui">
          {t('practice.tempo')}
          <SelectTrigger value={tempo} onChange={(e) => { stop(); setTempo(Number(e.target.value)); }}>
            {[40, 60, 80, 100, 120, 160, 200].map((bpm) => <option key={bpm} value={bpm}>{bpm}</option>)}
          </SelectTrigger>
        </label>
      </div>
      <p className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('practice.beatHint')}</p>
      {error && <p role="alert">{t('practice.audioError')}</p>}
      <div className="practice-playing-note">
        <div aria-label={t('practice.staff')} data-testid="practice-staff">
          <StaffNotation notes={staffNotes} chord followInstrument height={140} width={160} noteColors={staffColors} />
        </div>
        <div className="text-ui space-y-1" data-testid="practice-current">
          <p>{t('practice.step', { current: index + 1, total: route.events.length })}{current.numeral ? ` · ${current.numeral}` : ''}</p>
          {current.notes.map((n, j) => <p key={j}>
            <strong>{current.rh[j]} · {noteToString(n.note)}</strong>{' · '}{t('practice.finger', { finger: fingerFor(index, n) })}
            {' · '}{t('explore.readout.stringFret', { string: 6 - n.stringIndex, fret: n.fret })}
            {n.barre && ` · ${t('practice.barre')}`}{n.reach && ` · ${t('practice.reach')}`}
          </p>)}
          {route.stops && <p>{t('fretboard.positionTitle', { numeral: toRomanNumeral(current.notes[0].position!), fret: current.notes[0].position })}</p>}
          {shifts.map((n, j) => <p key={j} data-testid="practice-shift">{guideText(n) || t(`practice.shift.${n.shift!.kind}`, {
            from: toRomanNumeral(n.shift!.fromPosition), to: toRomanNumeral(n.shift!.toPosition),
          })}</p>)}
        </div>
      </div>
      <PracticeNeck route={route} index={index} tuning={tuning} fingerFor={fingerFor}
        edited={(event, n) => editable && overrides[keyFor(event, n)] !== undefined} onNote={editNote} />
      {editable && <>
        <LabelToolbar part="edit" labelMode="finger" onLabelMode={() => {}} positionView editing={editing}
          onToggleEdit={() => { stop(); setEditing(!editing); }} onResetFingering={() => clearOverrides(keys)} hasOverrides={keys.some((k) => overrides[k] !== undefined)} />
        {editing && <div className="flex flex-wrap gap-2">
          {current.notes.filter((n) => n.fret > 0).map((n) => <label key={n.stringIndex} className="flex items-center gap-2 text-ui">
            {t('practice.fingerFor', { note: noteToString(n.note), string: 6 - n.stringIndex })}
            <SelectTrigger value={fingerFor(index, n)} onChange={(e) => {
              const value = Number(e.target.value) as OverrideFinger;
              setOverride(keyFor(index, n), value === n.finger ? null : value);
            }}>{[1, 2, 3, 4].map((f) => <option key={f} value={f}>{f}</option>)}</SelectTrigger>
          </label>)}
          <p className="text-caption">{t('practice.overrideHint')}</p>
        </div>}
      </>}
      <div className="practice-events" role="group" aria-label={t('practice.route')}>
        {route.events.map((event, i) => <button type="button" key={i} ref={i === index ? cursor : undefined}
          className="practice-event" aria-current={i === index ? 'step' : undefined} tabIndex={i === index ? 0 : -1}
          onKeyDown={(e) => {
            const next = e.key === 'ArrowRight' ? Math.min(route.events.length - 1, i + 1) : e.key === 'ArrowLeft' ? Math.max(0, i - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? route.events.length - 1 : null;
            if (next !== null) { e.preventDefault(); select(next); (e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus(); }
          }}
          onClick={() => select(i)} data-guide={event.notes.some((n) => n.shift?.kind === 'guide') || undefined}
          title={event.notes.map(guideText).filter(Boolean).join(' ')}
          aria-label={[t('practice.event', { number: i + 1, notes: event.notes.map((n) => noteToString(n.note)).join(' + ') }), ...event.notes.map(guideText)].filter(Boolean).join('. ')}>
          <span className="text-caption">{event.rh.join('+')}</span>
          <span>{event.notes.map((n) => noteToString(n.note)).join('+')}</span>
          <span className="text-caption">{event.notes.map((n) => fingerFor(i, n)).join('+')}{event.notes.some((n) => n.shift) ? ` ${shiftArrow(event.notes.find((n) => n.shift)!.shift)}` : ''}</span>
        </button>)}
      </div>
      <p className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('practice.suggested')}{' '}{route.overRinging ? t('practice.ring') : route.overRinging === false ? t('practice.noRing') : ''}</p>
      {!editing && keys.some((k) => overrides[k] !== undefined) && <p className="text-caption">{t('practice.overrideHint')}</p>}
    </div>
  );
}
