import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n/tuner/index.ts';
import { Sheet } from '../ui/Sheet.tsx';
import { Button } from '../ui/Button.tsx';
import { ChoiceChip } from '../ui/ChoiceChip.tsx';
import { Term } from '../../glossary/Term.tsx';
import type { TermId } from '../../glossary/termIds.ts';
import { useAppStore } from '../../state/store.ts';
import { useMediaQuery } from '../../hooks/useMediaQuery.ts';
import { getTuningById } from '../../core/constants/guitarTunings.ts';
import { withGlyphs } from '../../core/utils/accidentalGlyphs.ts';
import { noteToString } from '../../core/types/music.ts';
import { microphoneSupported } from '../../services/microphone/support.ts';
import { useMic, type MicState } from '../../services/microphone/micSwitch.ts';
import { micSheetClosed } from '../../services/microphone/micPlaces.ts';
import { muteMic, subscribeMicFrames } from '../../services/microphone/micSession.ts';
import { centsFrom, nearestNote, SURE_CLARITY, type PitchEstimate } from '../../services/microphone/pitch.ts';
import { createSmoother, FAR_CENTS, heardName, stringMidi, targetFor, tuneState } from './tunerReading.ts';
import { playGuitarString, prepareGuitarStrings, REFERENCE_SECONDS } from './hearString.ts';
import { MicSwitch } from './MicSwitch.tsx';
import { MicAsk } from './MicLines.tsx';

/**
 * THE TUNER (wave 3, brief T; its microphone since brief U): a Sheet reached
 * from "⋯" → Tuner and from the guitar dock's "Tune". At its top, the app's
 * ONE microphone switch (`MicSwitch`, `services/microphone/micSwitch.ts`):
 * off until the learner taps it; before the browser is asked, one sentence
 * says why and that the sound never leaves the device. On, the tuner reads
 * the frames of that one session (`micSession.ts`): it names the note heard
 * and how far it is from the target — in words and cents, and a needle on a
 * scale (never colour alone), steadied by a median + average, still under
 * prefers-reduced-motion. With the guitar: the six strings of the current
 * tuning, the nearest picked by itself or chosen by the learner, each with
 * "Hear" (the app's own guitar voice), so it works with no microphone at
 * all. In Explore the notes played light the instrument behind it (the one
 * listener counts the tuner there as Explore). Closing the tuner turns the
 * microphone off unless what is behind it can use it (Explore, a check
 * answered on the instrument).
 */
interface Reading {
  heard: number;
  target: number;
  string: number | null;
  cents: number;
}

/** After this long with nothing heard, the reading clears. */
const HOLD_READING_MS = 800;
/** Under reduced motion the reading changes at most this often. */
const STILL_INTERVAL_MS = 300;

/** `ms` from now on the frame clock (microphone.ts stamps frames with performance.now()). */
function deadlineIn(ms: number): number {
  return performance.now() + ms;
}

export function TunerSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const instrument = useAppStore((s) => s.instrument);
  const tuningId = useAppStore((s) => s.guitarTuningId);
  const still = useMediaQuery('(prefers-reduced-motion: reduce)');
  const supported = useMemo(() => microphoneSupported(), []);
  const mic = useMic((s) => s.state);
  const listening = supported && mic.kind === 'on';
  const [reading, setReading] = useState<Reading | null>(null);
  const [chosen, setChosen] = useState<number | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);

  const tuning = getTuningById(tuningId);
  const guitar = instrument === 'guitar';
  const strings = useMemo(() => (guitar ? tuning.strings.map(stringMidi) : null), [guitar, tuning]);
  const names = useMemo(() => tuning.strings.map((s) => withGlyphs(noteToString(s))), [tuning]);
  const tuningName = tuning.id === 'standard' ? t('fretboard.standardTuning') : tuning.id === 'drop-d' ? 'Drop D (6=D)' : withGlyphs(tuning.shortName);

  // Everything the frame loop reads lives in refs (no re-subscription per render).
  const smoother = useRef(createSmoother());
  const last = useRef<{ heardAt: number; target: number | null; shownAt: number; auto: number | null }>({ heardAt: 0, target: null, shownAt: 0, auto: null });
  // A reference string sounding: nothing heard counts until then, timed
  // from the press (the frame clock is performance.now()), whether or not
  // the microphone was on when "Hear" was pressed.
  const muteUntil = useRef(0);
  const live = useRef({ strings, chosen, still });
  useEffect(() => {
    live.current = { strings, chosen, still };
    smoother.current.reset();
  }, [strings, chosen, still]);

  const onFrame = useCallback((estimate: PitchEstimate | null, time: number) => {
    if (time < muteUntil.current) return;
    const l = last.current;
    const { strings: s, chosen: c, still: motionless } = live.current;
    if (estimate && estimate.clarity >= SURE_CLARITY) {
      const target = targetFor(estimate.frequency, s, c, l.auto);
      if (target.midi !== l.target) smoother.current.reset();
      l.target = target.midi;
      if (c === null) l.auto = target.string;
      const cents = smoother.current.push(centsFrom(estimate.frequency, target.midi));
      l.heardAt = time;
      if (motionless && time - l.shownAt < STILL_INTERVAL_MS) return;
      l.shownAt = time;
      setReading({ heard: nearestNote(estimate.frequency).midi, target: target.midi, string: target.string, cents });
    } else if (time - l.heardAt > HOLD_READING_MS) {
      smoother.current.reset();
      l.target = null;
      setReading((r) => (r === null ? r : null));
    }
  }, []);

  // Open and on: read the one session's frames. Off (or closed): the reading clears.
  useEffect(() => {
    if (!open || !listening) return;
    const stop = subscribeMicFrames(onFrame);
    const smoothing = smoother.current;
    const seen = last.current;
    return () => {
      stop();
      smoothing.reset();
      seen.target = null;
      setReading(null);
    };
  }, [open, listening, onFrame]);

  // Closing the tuner: the microphone goes off unless what is behind it can use it.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setPlaying(null);
  }
  const shown = useRef(open);
  useEffect(() => {
    // The guitar's samples download only where "Hear" is offered.
    if (open && guitar) prepareGuitarStrings();
    if (!open && shown.current) micSheetClosed();
    shown.current = open;
  }, [open, guitar]);
  useEffect(() => () => {
    if (shown.current) micSheetClosed();
  }, []);

  const hear = (index: number) => {
    const midi = stringMidi(tuning.strings[index]);
    playGuitarString(midi);
    // The tuner must not read the app's own string as the learner's, nor report it as a note played.
    const ms = REFERENCE_SECONDS * 1000 + 500;
    muteUntil.current = deadlineIn(ms);
    muteMic(ms);
    smoother.current.reset();
    setReading(null);
    setPlaying(index);
  };
  useEffect(() => {
    if (playing === null) return;
    const id = setTimeout(() => setPlaying(null), REFERENCE_SECONDS * 1000 + 500);
    return () => clearTimeout(id);
  }, [playing]);

  const stringLabel = (index: number) => t('tuner.stringLabel', { n: 6 - index, note: names[index] });

  return (
    <Sheet
      open={open}
      onClose={onClose}
      testId="tuner-sheet"
      closeLabel={t('tuner.close')}
      title={t('tuner.title')}
    >
      <div className="flex flex-col gap-4 pb-1" data-testid="tuner" data-phase={supported ? mic.kind : 'unsupported'}>
        <section className="flex flex-col gap-2 items-start">
          <MicSwitch place="tuner" />
          <PhaseText mic={mic} supported={supported} guitar={guitar} />
        </section>

        {listening && (
          <ReadingView
            reading={reading}
            playing={playing === null ? null : t('tuner.playing', { n: 6 - playing, note: names[playing] })}
            guitar={guitar}
            names={names}
            strings={strings}
            still={still}
          />
        )}

        {guitar && (
          <section className="flex flex-col gap-2" aria-labelledby="tuner-strings-heading" data-testid="tuner-strings" data-tuning={tuning.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 id="tuner-strings-heading" className="type-section" style={{ color: 'var(--text)' }}>{t('tuner.stringsHeading')}</h3>
              <span className="text-ui" style={{ color: 'var(--text-dim)' }}>{withTerm(t('tuner.tuningName', { name: tuningName }), 'tuning')}</span>
            </div>
            <ChoiceChip pressed={chosen === null} onClick={() => setChosen(null)} className="self-start tuner-wrap" data-testid="tuner-auto">
              {t('tuner.auto')}
            </ChoiceChip>
            <div role="radiogroup" aria-label={t('tuner.chooseLabel')} className="tuner-strings">
              {names.map((name, i) => {
                const heardHere = chosen === null && reading?.string === i;
                return (
                  <div key={i} className="tuner-string">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={chosen === i}
                      aria-label={stringLabel(i)}
                      className="chip tuner-string-pick"
                      data-near={heardHere ? '' : undefined}
                      data-string={6 - i}
                      onClick={() => setChosen(i)}
                      onKeyDown={(e) => {
                        const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
                        if (!step) return;
                        e.preventDefault();
                        const next = ((chosen ?? i) + step + names.length) % names.length;
                        setChosen(next);
                        (e.currentTarget.parentElement?.parentElement?.querySelectorAll<HTMLButtonElement>('.tuner-string-pick')[next])?.focus();
                      }}
                      tabIndex={(chosen ?? 0) === i ? 0 : -1}
                    >
                      <span className="text-body font-semibold">{name}</span>
                      <span className="text-caption">{t('tuner.string', { n: 6 - i })}</span>
                    </button>
                    <Button variant="quiet" size="sm" onClick={() => hear(i)} aria-label={t('tuner.hearLabel', { n: 6 - i, note: name })} data-testid={`tuner-hear-${6 - i}`}>
                      <span aria-hidden="true">▶</span> {t('tuner.hear')}
                    </Button>
                  </div>
                );
              })}
            </div>
            {playing !== null && !listening && (
              <p className="text-ui" style={{ color: 'var(--text-dim)' }} role="status">{t('tuner.playing', { n: 6 - playing, note: names[playing] })}</p>
            )}
          </section>
        )}
      </div>
    </Sheet>
  );
}

/** What the tuner says under its switch: why (off), the two buttons (before the browser is asked), the browser asking, what went wrong. */
function PhaseText({ mic, supported, guitar }: { mic: MicState; supported: boolean; guitar: boolean }) {
  const { t } = useTranslation();
  const lines: string[] = [];
  let ask = false;
  if (!supported) {
    lines.push(t('tuner.problem.unsupported'));
    if (guitar) lines.push(t('tuner.byEar'));
  } else if (mic.kind === 'off' || (mic.kind === 'asking' && mic.step !== 'browser')) {
    lines.push(t('tuner.why'));
    ask = mic.kind === 'asking' && mic.step === 'explain';
  } else if (mic.kind === 'asking') lines.push(t('tuner.asking'));
  else if (mic.kind === 'problem') {
    const p = mic.problem;
    if (p === 'idle') lines.push(t('tuner.mic.idle'));
    else if (p === 'hidden' || p === 'ended') lines.push(t(`tuner.problem.${p}`));
    else {
      lines.push(t(`tuner.problem.${p}`));
      if (p === 'refused') lines.push(t('tuner.problem.refusedHow'));
      if (p === 'missing') lines.push(t('tuner.problem.missingHow'));
      if (guitar) lines.push(t('tuner.byEar'));
    }
  }
  return (
    <div className="flex flex-col gap-2" aria-live="polite">
      {lines.length > 0 && (
        <div className="flex flex-col gap-1" data-testid="tuner-message">
          {lines.map((line) => (
            <p key={line} className="text-body" style={{ color: 'var(--text)' }}>{line}</p>
          ))}
        </div>
      )}
      {ask && <MicAsk place="tuner" />}
    </div>
  );
}

function ReadingView({ reading, playing, guitar, names, strings, still }: {
  reading: Reading | null;
  playing: string | null;
  guitar: boolean;
  names: string[];
  strings: number[] | null;
  still: boolean;
}) {
  const { t } = useTranslation();
  const state = reading ? tuneState(reading.cents) : null;
  const cents = reading ? Math.round(Math.abs(reading.cents)) : 0;
  const words = !reading || !state
    ? null
    : state === 'inTune' ? t('tuner.inTune')
      : state === 'farFlat' ? t('tuner.farFlat')
        : state === 'farSharp' ? t('tuner.farSharp')
          : t(state === 'flat' ? 'tuner.flat' : 'tuner.sharp', { count: cents });
  const advice = !guitar || !state ? null
    : state === 'inTune' ? t('tuner.keep')
      : state === 'flat' ? t('tuner.tighten')
        : state === 'farFlat' ? t('tuner.tightenMore')
          : state === 'sharp' ? t('tuner.loosen') : t('tuner.loosenMore');
  const targetName = reading && reading.string !== null ? names[reading.string] : null;
  const heard = reading ? heardName(reading.heard, strings ? reading.target : null, targetName) : null;
  const position = reading ? Math.max(-FAR_CENTS, Math.min(FAR_CENTS, reading.cents)) : 0;

  // Screen readers hear the state once it has settled, never every frame.
  const [spoken, setSpoken] = useState('');
  const said = reading && words ? `${heard} · ${words}` : '';
  useEffect(() => {
    const id = setTimeout(() => setSpoken(said), 700);
    return () => clearTimeout(id);
  }, [said]);

  return (
    <section className="tuner-reading" data-testid="tuner-reading" data-state={state ?? 'none'} data-cents={reading ? Math.round(reading.cents) : undefined}>
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <span className="type-label" style={{ color: 'var(--text-dim)' }}>{t('tuner.heard')}</span>
          <span className="learn-serif text-display leading-none" style={{ color: 'var(--text)' }} data-testid="tuner-note">
            {heard ?? '—'}
          </span>
        </div>
        {reading && reading.string !== null && (
          <span className="text-ui" style={{ color: 'var(--text-dim)' }} data-testid="tuner-target">
            {t('tuner.target', { n: 6 - reading.string, note: names[reading.string] })}
          </span>
        )}
      </div>

      <div className="tuner-meter" aria-hidden="true" data-still={still ? '' : undefined}>
        <div className="tuner-meter-scale">
          <span className="tuner-meter-zone" />
          {[-50, -25, 0, 25, 50].map((c) => (
            <span key={c} className="tuner-meter-tick" data-major={c === 0 ? '' : undefined} style={{ left: `${50 + c}%` }} />
          ))}
          {reading && (
            <span className="tuner-meter-needle" data-in-tune={state === 'inTune' ? '' : undefined} style={{ left: `${50 + position}%` }} />
          )}
        </div>
        <div className="tuner-meter-labels text-caption">
          <span>♭ {t('tuner.meterLow')}</span>
          <span>{t('tuner.inTune')}</span>
          <span>{t('tuner.meterHigh')} ♯</span>
        </div>
      </div>

      <p className="text-body font-semibold" style={{ color: state === 'inTune' ? 'var(--success-text)' : 'var(--text)' }} data-testid="tuner-words">
        {playing ?? words ?? t(guitar ? 'tuner.playOneString' : 'tuner.playOne')}
        {!playing && state === 'inTune' && ' ✓'}
      </p>
      {advice && <p className="text-ui" style={{ color: 'var(--text)' }}>{advice}</p>}
      <p className="text-caption" style={{ color: 'var(--text-dim)' }}>{withTerm(t('tuner.cents'), 'halfStep')}</p>
      <span className="sr-only" aria-live="polite">{spoken}</span>
    </section>
  );
}

/** "100 cents make one <term>half step</term> (on the guitar, one fret)." → the word marked for the glossary. */
function withTerm(text: string, id: TermId): ReactNode {
  const m = /^(.*)<term>(.*)<\/term>(.*)$/.exec(text);
  if (!m) return text;
  return (
    <>
      {m[1]}
      <Term id={id}>{m[2]}</Term>
      {m[3]}
    </>
  );
}
