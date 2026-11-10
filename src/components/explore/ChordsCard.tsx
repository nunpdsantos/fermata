import { Suspense, lazy, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChordGrid } from '../theory/ChordGrid.tsx';
import { ChordBrowser } from '../theory/ChordBrowser.tsx';
import { ChordBuilderPanel } from '../theory/ChordBuilderPanel.tsx';
import { CurrentChordPanel } from '../panels/CurrentChordPanel.tsx';
import { Segment } from '../ui/Segment.tsx';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { exploreRegister } from './exploreRegister';
import { useAppStore } from '../../state/store.ts';
import { keyName } from './focusReadout.ts';
import { staffTrim } from './staffTrim.ts';
import { StaffNotationSkeleton } from '../notation/StaffNotationSkeleton.tsx';
import { Term } from '../../glossary/Term.tsx';
import { termAttr } from '../../glossary/visibleTerms.ts';
import { useExploreSimple } from '../../state/exploreDetail.ts';

const StaffNotation = lazy(() =>
  import('../notation/StaffNotation.tsx').then((m) => ({ default: m.StaffNotation })),
);

/** The selected chord on a small staff, in its inversion (what the instrument plays). */
const CHORD_STAFF_HEIGHT = 80;

function ChordStaff() {
  const { invertedNotes } = useKeyContext();
  const chord = useAppStore((s) => s.selectedChord);
  const instrument = useAppStore((s) => s.instrument);
  const notes = useMemo(
    () => (chord ? exploreRegister(instrument).chordPitches(invertedNotes.length > 0 ? invertedNotes : chord.notes, instrument === 'guitar' ? chord.bassNote : undefined) : []),
    [chord, invertedNotes, instrument],
  );
  const trim = useMemo(() => staffTrim(notes, instrument, CHORD_STAFF_HEIGHT), [notes, instrument]);
  if (!chord) return null;
  return (
    <div
      className="chord-detail-staff"
      aria-hidden="true"
      data-testid="chord-staff"
      style={{ marginTop: -trim.top, marginBottom: -trim.bottom }}
    >
      <Suspense fallback={<StaffNotationSkeleton height={CHORD_STAFF_HEIGHT} />}>
        <StaffNotation
          notes={notes}
          height={CHORD_STAFF_HEIGHT}
          width={132}
          duration="w"
          chord
          followInstrument
        />
      </Suspense>
    </div>
  );
}

type ChordMode = 'diatonic' | 'all' | 'build';

/**
 * CHORDS IN <KEY> (W11-B, D-25): In key / All / Build, a Segment in tabs mode
 * (it switches the panel). The selected chord's detail opens IN PLACE, under
 * the row that was tapped — under the one-row diatonic strip, under the
 * tapped row of the chord browser, under the builder's strip — never in a
 * side panel. Selecting a chord fades the scale notes outside it on the staff
 * strip, and the instrument lights the chord.
 */
export function ChordsCard() {
  const { t } = useTranslation();
  const { scale } = useKeyContext();
  const selectedChord = useAppStore((s) => s.selectedChord);
  const cardRef = useRef<HTMLElement>(null);
  const [tab, setMode] = useState<ChordMode>('diatonic');
  // Simple view: the In key row only (no All Chords / Build tabs). The tab
  // chosen in Full is kept for when the learner goes back.
  const simple = useExploreSimple();
  const mode: ChordMode = simple ? 'diatonic' : tab;
  const detail = selectedChord
    ? <CurrentChordPanel chord={selectedChord} sourceTab={simple ? undefined : t(mode === 'diatonic' ? 'explore.inKey' : mode === 'all' ? 'explore.allChords' : 'explore.build')} aside={<ChordStaff />} simple={simple} />
    : null;

  return (
    <section ref={cardRef} className="explore-card chords-card" aria-labelledby="chords-title" data-testid="chords-card">
      <div className="explore-card-head">
        <h2 id="chords-title" className="type-section">
          <Term id="chordsInKey">{t('explore.chordsIn', { key: keyName(scale, t) })}</Term>
        </h2>
        {/* Tabs switch what the screen shows: not printed. */}
        {!simple && <Segment
          className="chords-tabs no-print"
          mode="tabs"
          label={t('explore.chords')}
          value={mode}
          onChange={(next) => {
            // A selection belongs to the visible list. Clear it atomically with
            // the tab change so the strip, instruments and circle agree.
            useAppStore.getState().setSelectedChord(null);
            setMode(next);
            const main = cardRef.current?.closest<HTMLElement>('.explore-main');
            if (main && getComputedStyle(main).overflowY === 'auto') main.scrollTop = 0;
          }}
          options={[
            { value: 'diatonic', label: <span {...termAttr('chordsInKey')}>{t('explore.inKey')}</span>, id: 'chords-tab-diatonic', controls: 'chords-panel' },
            { value: 'all', label: t('explore.allChords'), id: 'chords-tab-all', controls: 'chords-panel' },
            { value: 'build', label: t('explore.build'), id: 'chords-tab-build', controls: 'chords-panel' },
          ]}
        />}
      </div>
      <div id="chords-panel" role={simple ? undefined : 'tabpanel'} aria-labelledby={simple ? undefined : `chords-tab-${mode}`} className="chords-panel">
        {mode === 'diatonic' && (
          <>
            <ChordGrid />
            {detail}
          </>
        )}
        {mode === 'all' && <ChordBrowser detail={detail} />}
        {mode === 'build' && (
          <>
            <ChordBuilderPanel />
            {detail}
          </>
        )}
      </div>
    </section>
  );
}
