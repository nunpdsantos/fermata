import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Chord } from '../../../core/types/music';
import { chordInKey, hasOpenGrip, type MusicKey } from '../../../core/utils/progression';
import { buildScale } from '../../../core/constants/scales';
import { hasChordShapes } from '../../../core/constants/guitarTunings';
import { useAppStore } from '../../../state/store';
import { useCapoFret, setCapoFret } from '../../../state/capo';
import { setProgressionOffer, useProgressionOffer } from '../../../state/progressionPanel';
import {
  BEAT_CHOICES, DEFAULT_BEATS, DEFAULT_BPM, EMPTY_PROGRESSION, MAX_BPM, MAX_PROGRESSION_CHORDS, MIN_BPM,
  type BeatsPerChord, type SavedProgression,
} from '../../../state/progressionSave';
import { Button, IconButton } from '../../ui/Button';
import { ChipGroup } from '../../ui/ChoiceChip';
import { Term } from '../../../glossary/Term';
import { termAttr } from '../../../glossary/visibleTerms';
import { keyName } from '../focusReadout';
import { ChordChip } from './ChordChip';
import { AnotherChordSheet } from './AnotherChordSheet';
import { PresetList, PresetsSheet } from './PresetsSheet';
import {
  addChord, capoIdeas, capoShapes, keyChords, keyLine, moveBy, moveChord, panelKeyFor, presetSymbols, readChords,
  readableSymbols, removeChord, scaleForKey,
} from './progressionModel';
import { chordList, chordName, keyLabel, keyLineSentences } from './progressionText';
import { isLooping, retimeLoop, startLoop, stopLoop, useLoopState } from './loopController';

/** Tempo steps of the − / + buttons. */
export const BPM_STEP = 5;

const distinctChords = (cs: readonly Chord[]) => cs.filter((c, i) => cs.findIndex((d) => chordName(d) === chordName(c)) === i);
const sameKeyPc = (a: MusicKey, b: MusicKey) => a.mode === b.mode && a.root.natural === b.root.natural && a.root.accidental === b.root.accidental;

/**
 * THE PROGRESSION PANEL (wave 2, stream S) — in Explore's chords card, in
 * place of its tabs and their body (ChordsCard). For someone who plays from
 * chord sheets: the chords in order with their numbers in the key, adding
 * (the key's seven, any other, a common progression), one line that tells
 * the truth about the key, a loop to play along with, moving everything by
 * half steps, and on the guitar the capo. Lazy chunk.
 */
export default function ProgressionPanel() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const root = useAppStore((s) => s.selectedKey);
  const scale = useAppStore((s) => s.selectedScale);
  const guitar = useAppStore((s) => s.instrument === 'guitar');
  // The shape library and the capo ideas are for standard tuning only (as the fretboard's chord shapes).
  // The fretboard's own rule for its grips (core/constants/guitarTunings.ts), so both surfaces agree.
  const standardTuning = useAppStore((s) => hasChordShapes(s.guitarTuningId));
  const saved: SavedProgression = useAppStore((s) => s.progression) ?? EMPTY_PROGRESSION;
  const capo = useCapoFret();
  const offer = useProgressionOffer();
  const loop = useLoopState();
  const [sheet, setSheet] = useState<'another' | 'presets' | null>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // After a move or a removal, focus follows the chord (or the next one).
  const pendingFocus = useRef<number | null>(null);
  const setFocusChip = (i: number) => { pendingFocus.current = i; };
  const addRowRef = useRef<HTMLDivElement>(null);

  const { key, exact } = useMemo(() => panelKeyFor(root, scale), [root, scale]);
  // The symbols that read: the chips, and the list every chip action edits (same indexes).
  const symbols = useMemo(() => readableSymbols(saved.chords), [saved.chords]);
  const parsed = useMemo(() => readChords(symbols), [symbols]);
  const infos = useMemo(() => parsed.map((c) => chordInKey(c, key)), [parsed, key]);
  // The chords as read in the key (C♯ typed in D♭ major is D♭): what the
  // chips show, the loop plays and the instrument lights.
  const chords = useMemo(() => infos.map((i) => i.chord), [infos]);
  const line = useMemo(() => keyLine(chords, key), [chords, key]);
  const sentences = line ? keyLineSentences(line, chords, t, lang) : null;
  const own = useMemo(() => keyChords(key), [key]);
  const full = symbols.length >= MAX_PROGRESSION_CHORDS;
  const ideas = useMemo(() => (guitar && standardTuning ? capoIdeas(chords, key) : []), [guitar, standardTuning, chords, key]);
  const keyText = keyLabel(key, t);

  // Leaving the panel (closed, view changed) stops the loop.
  useEffect(() => () => stopLoop('closed'), []);

  useEffect(() => {
    const i = pendingFocus.current;
    if (i === null) return;
    pendingFocus.current = null;
    const el = i >= 0 ? chipRefs.current[i] ?? null : null;
    (el ?? addRowRef.current?.querySelector<HTMLElement>('button:not(:disabled)'))?.focus();
  }, [saved.chords]);

  const write = (next: Partial<SavedProgression>) => {
    const s = useAppStore.getState();
    s.setProgression({ ...(s.progression ?? EMPTY_PROGRESSION), ...next });
  };
  const setSymbols = (next: string[]) => write({ chords: next });
  const add = (chord: Chord) => setSymbols(addChord(symbols, chord));
  const setTempo = (bpm: number) => {
    const v = Math.min(MAX_BPM, Math.max(MIN_BPM, bpm));
    write({ bpm: v });
    if (isLooping()) retimeLoop(v, saved.beats);
  };
  const setBeats = (beats: BeatsPerChord) => {
    write({ beats });
    if (isLooping()) retimeLoop(saved.bpm, beats);
  };
  const move = (by: -1 | 1) => {
    const next = moveBy(root, scale, symbols, by);
    const app = useAppStore.getState();
    // The chords first: the loop stops on either change, the line never shows a mix.
    write({ chords: next.symbols });
    app.setKey(next.root);
  };
  const switchTo = (k: MusicKey) => {
    const app = useAppStore.getState();
    app.setScale(scaleForKey(k));
    app.setKey(k.root);
  };
  const usePreset = (cs: readonly Chord[]) => {
    setSymbols(presetSymbols(cs));
    setSheet(null);
  };

  const playing = loop.playing;
  const toggle = () => {
    if (playing) stopLoop('user');
    else startLoop(chords, saved.bpm ?? DEFAULT_BPM, saved.beats ?? DEFAULT_BEATS);
  };

  const scaleText = keyName(buildScale(root, scale), t);
  const outsideAny = infos.some((i) => i.fits === 'outside');

  const addRow = (
    <div className="prog-add" ref={addRowRef} data-testid="progression-add">
      <div className="prog-add-own" role="group" aria-label={t('progression.addLabel', { key: keyText })}>
        <span className="prog-label" aria-hidden="true">{t('progression.add')}</span>
        {own.map(({ chord, numeral }) => (
          <Button key={numeral} className="prog-add-btn" disabled={full} aria-label={t('progression.addChord', { chord: chordName(chord) })}
            onClick={() => add(chord)} data-add={chordName(chord)}>
            {chordName(chord)}
          </Button>
        ))}
      </div>
      <div className="prog-add-more">
        <Button variant="quiet" disabled={full} aria-haspopup="dialog" onClick={() => setSheet('another')} data-testid="progression-another">
          {t('progression.another')}
        </Button>
        {symbols.length > 0 && (
          <Button variant="quiet" aria-haspopup="dialog" onClick={() => setSheet('presets')} data-testid="progression-presets">
            {t('progression.common')}
          </Button>
        )}
      </div>
      {full && <p className="text-caption prog-dim" role="status">{t('progression.full')}</p>}
    </div>
  );

  const offerLine = offer && (
    <div className="prog-offer" role="status" data-testid="progression-offer">
      <p className="text-ui">{offer.bpm !== undefined
        ? t('progression.offerTempo', { chords: chordList(readChords(offer.chords)), bpm: offer.bpm })
        : t('progression.offer', { chords: chordList(readChords(offer.chords)) })}</p>
      <div className="prog-row">
        <Button variant="primary" onClick={() => {
          stopLoop('user');
          write({ chords: presetSymbols(readChords(offer.chords)), ...(offer.bpm !== undefined ? { bpm: offer.bpm } : {}) });
          setProgressionOffer(null);
        }}>{t('progression.useOffer')}</Button>
        <Button onClick={() => setProgressionOffer(null)}>{t('progression.keepMine')}</Button>
      </div>
    </div>
  );

  if (symbols.length === 0) {
    return (
      <div className="prog-panel" data-testid="progression-panel" data-state="empty">
        {offerLine}
        <p className="text-ui prog-intro">{t('progression.empty')}</p>
        {!exact && <p className="text-caption prog-dim" data-testid="progression-key-note">{t('progression.keyNote', { scale: scaleText, key: keyText })}</p>}
        <section aria-labelledby="prog-presets-title" className="prog-presets-inline">
          <h3 id="prog-presets-title" className="type-label">{t('progression.common')}</h3>
          <PresetList keyForPresets={key} onPick={usePreset} />
        </section>
        {addRow}
        <AnotherChordSheet open={sheet === 'another'} onClose={() => setSheet(null)} keyForRoots={key} onAdd={(c) => { add(c); setSheet(null); }} />
      </div>
    );
  }

  const capoChoices = guitar && standardTuning ? [
    { value: 0, label: t('progression.noCapo') },
    // Each different shape once: the chip stays short (the line names them all, in order).
    ...ideas.map((o) => ({ value: o.fret, label: t('progression.capoIdea', { fret: o.fret, shapes: chordList(distinctChords(o.shapes.map((s) => s.shape))) }) })),
    ...(capo > 0 && !ideas.some((o) => o.fret === capo)
      ? [{ value: capo, label: t('progression.capoIdea', { fret: capo, shapes: chordList(distinctChords(capoShapes(chords, key, capo))) }) }]
      : []),
  ] : [];

  const clear = (
    <Button variant="quiet" className="prog-clear" onClick={() => { stopLoop('user'); setSymbols([]); setFocusChip(0); }} data-testid="progression-clear">{t('progression.clear')}</Button>
  );

  return (
    <div className="prog-panel" data-testid="progression-panel" data-state={playing ? 'playing' : 'ready'}>
      {offerLine}
      <div className="prog-chips-row">
      <ol className="prog-chips" aria-label={t('progression.chips')} data-testid="progression-chips">
        {infos.map((info, i) => {
          const name = chordName(info.chord);
          const outside = info.fits === 'outside';
          return (
            <ChordChip
              key={`${i}:${symbols[i]}`}
              name={name}
              numeral={info.numeral}
              outside={outside}
              playing={playing && loop.index === i}
              label={t(outside ? 'progression.chipOutside' : 'progression.chip', { chord: name, numeral: info.numeral, key: keyText, n: i + 1, total: infos.length })}
              menuLabel={t('progression.chipMenu', { chord: name })}
              onRef={(el) => { chipRefs.current[i] = el; }}
              actions={[
                { id: 'left', label: t('progression.moveLeft'), disabled: i === 0, onSelect: () => { setSymbols(moveChord(symbols, i, -1)); setFocusChip(i - 1); } },
                { id: 'right', label: t('progression.moveRight'), disabled: i === infos.length - 1, onSelect: () => { setSymbols(moveChord(symbols, i, 1)); setFocusChip(i + 1); } },
                { id: 'remove', label: t('progression.remove'), onSelect: () => { setSymbols(removeChord(symbols, i)); setFocusChip(Math.min(i, infos.length - 2)); } },
              ]}
            />
          );
        })}
      </ol>
      {outsideAny && <p className="text-caption prog-dim prog-legend"><Term id="outOfKey">{t('progression.outsideLegend', { key: keyText })}</Term></p>}
      </div>

      {addRow}

      <div className="prog-line" data-testid="progression-key-line">
        {sentences && <p className="text-ui" data-testid="progression-fit">{sentences.current}</p>}
        {!exact && <p className="text-caption prog-dim" data-testid="progression-key-note">{t('progression.keyNote', { scale: scaleText, key: keyText })}</p>}
        {line?.better && sentences?.better && (
          <div className="prog-better" data-testid="progression-better">
            <p className="text-ui">{sentences.better}</p>
            {line.better.keys.filter((k) => !sameKeyPc(k, key)).map((k) => (
              <Button key={`${k.root.natural}${k.root.accidental}${k.mode}`} variant="link" onClick={() => switchTo(k)}>
                {t('progression.switchTo', { key: keyLabel(k, t) })}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="prog-controls">
        <Button variant="primary" className="prog-play" onClick={toggle} aria-pressed={playing} data-testid="progression-play">
          <span aria-hidden="true">{playing ? '■' : '▶'}</span> {playing ? t('progression.stop') : t('progression.loop')}
        </Button>
        <div className="prog-stepper" role="group" aria-label={t('progression.tempo')}>
          <span className="prog-label"><Term id="tempo">{t('progression.tempo')}</Term></span>
          <IconButton variant="secondary" aria-label={t('progression.slower')} icon="−" disabled={saved.bpm <= MIN_BPM} onClick={() => setTempo(saved.bpm - BPM_STEP)} />
          <output className="prog-value" aria-live="polite" aria-label={t('progression.bpm', { bpm: saved.bpm })} data-testid="progression-bpm">{saved.bpm}</output>
          <IconButton variant="secondary" aria-label={t('progression.faster')} icon="+" disabled={saved.bpm >= MAX_BPM} onClick={() => setTempo(saved.bpm + BPM_STEP)} />
        </div>
        <div className="prog-stepper">
          <span className="prog-label" aria-hidden="true">{t('progression.beats')}</span>
          <ChipGroup label={t('progression.beats')} value={saved.beats} onChange={(b) => setBeats(b as BeatsPerChord)}
            options={BEAT_CHOICES.map((b) => ({ value: b, label: String(b) }))} />
        </div>
        <div className="prog-stepper" role="group" aria-label={t('progression.moveGroup', { key: keyText })}>
          <span className="prog-label"><Term id="transpose">{t('progression.move')}</Term></span>
          <IconButton variant="secondary" aria-label={t('progression.moveDown')} icon="−" onClick={() => move(-1)} data-testid="progression-down" />
          <output className="prog-value prog-key" data-testid="progression-key">{keyText}</output>
          <IconButton variant="secondary" aria-label={t('progression.moveUp')} icon="+" onClick={() => move(1)} data-testid="progression-up" />
        </div>
        {/* Clear comes last: at the end of the controls (piano) or of the capo row (guitar). */}
        {!guitar && clear}
      </div>

      {guitar && (
        <div className="prog-foot">
        <div className="prog-capo" data-testid="progression-capo">
          {!standardTuning ? (
            <div className="prog-capo-ideas">
              <p className="text-caption prog-dim" data-testid="progression-capo-standard" {...termAttr('capo')}>{t('progression.capoStandardOnly')}</p>
              {capo > 0 && <Button variant="quiet" onClick={() => setCapoFret(0)}>{t('progression.noCapo')}</Button>}
            </div>
          ) : capoChoices.length > 1 ? (
            <div className="prog-capo-ideas">
              {/* With a capo on, the row says which shapes to play; else what the ideas are. */}
              {capo > 0
                ? <span className="text-ui prog-capo-now" data-testid="progression-capo-now" {...termAttr('capo')}>{t('progression.capoNow', { fret: capo, shapes: chordList(capoShapes(chords, key, capo)) })}</span>
                : <span className="prog-label" {...termAttr('capo')}>{t('progression.capoIdeas')}</span>}
              <ChipGroup label={t('progression.capoIdeas')} value={capo} onChange={(f) => setCapoFret(Number(f))} options={capoChoices} />
            </div>
          ) : (
            <p className="text-caption prog-dim" data-testid="progression-capo-none">
              {t(capoShapes(chords, key, 0).every(hasOpenGrip) ? 'progression.capoAllOpen' : 'progression.capoNoIdea')}
            </p>
          )}
        </div>
        {clear}
        </div>
      )}


      <AnotherChordSheet open={sheet === 'another'} onClose={() => setSheet(null)} keyForRoots={key} onAdd={(c) => { add(c); setSheet(null); }} />
      <PresetsSheet open={sheet === 'presets'} onClose={() => setSheet(null)} keyForPresets={key} onPick={usePreset} />
    </div>
  );
}
