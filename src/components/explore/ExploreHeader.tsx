import { useCallback, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { noteToString } from '../../core/types/music.ts';
import { withGlyphs } from '../../core/utils/accidentalGlyphs.ts';
import { KeyPicker, ScalePicker, RootChips, RespellButton } from '../navigation/KeySelector.tsx';
import { ScaleComparison } from '../theory/ScaleComparison.tsx';
import { CircleOfFifths } from '../theory/CircleOfFifths.tsx';
import { KeyFactsList } from './CircleNavigator.tsx';
import { Button, IconButton } from '../ui/Button.tsx';
import { Menu } from '../ui/Menu.tsx';
import { Sheet } from '../ui/Sheet.tsx';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useMediaQuery, PHONE_QUERY } from '../../hooks/useMediaQuery.ts';
import { exploreRegister } from './exploreRegister';
import { useAppStore } from '../../state/store.ts';
import { playScale, resumeAudio, cancelScheduledAudio } from '../../core/services/audio.ts';
import { getSynthConfig } from '../../services/synthConfig.ts';
import { generateScaleSummary, copyToClipboard } from '../../utils/exportHelpers.ts';
import { toast } from '../../state/toastStore.ts';
import { classicalDescendingNotes } from '../../core/utils/classicalScale.ts';
import { keyFacts } from './keyFacts.ts';
import { keyName } from './focusReadout.ts';
import { toContentLanguage } from '../drill/drillText.ts';
import { Segment } from '../ui/Segment.tsx';
import { Term, WordsButton } from '../../glossary/Term.tsx';
import { scaleTermId } from '../../glossary/termIds.ts';
import { useExploreSimple } from '../../state/exploreDetail.ts';
import type { ExploreDetail } from '../../state/storeTypes.ts';

const PLAY_ICON = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

/**
 * The top of the Explore workbench (W11-B, D-25 / D-29): the key and scale
 * pickers, a one-line summary ("C Major · no ♯/♭ · relative A minor"),
 * ▶ Play scale, and a "⋯" with Copy, Print and Compare — they left the main
 * surface (D-29) but stay one tap away. On a phone the key picker opens a
 * sheet with the circle of fifths and the twelve roots.
 */
export function ExploreHeader({ practiceAction, onPractise }: {
  practiceAction?: ReactNode;
  /** "⋯" → Practise on the guitar: always offered, piano or guitar (ExploreView switches to the guitar). */
  onPractise?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const { scale, diatonicChords } = useKeyContext();
  const selectedKey = useAppStore((s) => s.selectedKey);
  const selectedScale = useAppStore((s) => s.selectedScale);
  const selectedChord = useAppStore((s) => s.selectedChord);
  const synthPreset = useAppStore((s) => s.synthPreset);
  const instrument = useAppStore((s) => s.instrument);
  const baseOctave = useAppStore((s) => s.baseOctave);
  const phone = useMediaQuery(PHONE_QUERY);
  // The Simple / Full switch is a Segment in the header; a phone's row has
  // no room for it. There it is in "Words on this screen" (both ways), and
  // Simple's "⋯" offers the way back to Full in Compare's place — Full's
  // menu stays exactly as it was.
  const segmentFits = !phone;
  const [keySheet, setKeySheet] = useState(false);
  const [compare, setCompare] = useState(false);
  const facts = keyFacts(selectedKey, selectedScale, t);
  const simple = useExploreSimple();
  const setDetail = useAppStore((s) => s.setExploreDetail);
  // Simple view's summary in words: "G Major · one sharp" (no relative key).
  const plainSignature = facts.signature
    ? facts.signature.count === 0
      ? t('simpleView.noSharpsFlats')
      : t(facts.signature.type === '#' ? 'simpleView.sharps' : 'simpleView.flats', { count: facts.signature.count })
    : null;
  const detailSegment = (
    <Segment<ExploreDetail>
      className="explore-detail-switch"
      label={t('simpleView.label')}
      value={simple ? 'simple' : 'full'}
      onChange={setDetail}
      options={[
        { value: 'simple', label: t('simpleView.simple'), data: { 'data-testid': 'detail-simple' } },
        { value: 'full', label: t('simpleView.full'), data: { 'data-testid': 'detail-full' } },
      ]}
    />
  );

  const playScaleNow = useCallback(async () => {
    await resumeAudio();
    // Play again restarts cleanly instead of layering a second scale (W8-01).
    // Audio only: stopPlayback() would also clear other components' visual
    // timeouts (e.g. the chord panel's arpeggio un-lighting its keys — B2).
    cancelScheduledAudio();
    playScale(scale.notes, exploreRegister(instrument, baseOctave).octave, true, selectedScale === 'melodic_minor', 0.25, () => {}, () => {}, getSynthConfig(synthPreset), classicalDescendingNotes(scale.root, selectedScale));
  }, [scale, selectedScale, synthPreset, baseOctave, instrument]);

  const copy = async () => {
    const ok = await copyToClipboard(generateScaleSummary(scale, diatonicChords, selectedChord, { t, lang: toContentLanguage(i18n.language) }));
    if (ok) toast(t('toast.copiedToClipboard'), 'success');
  };

  return (
    <div className="explore-header" data-testid="explore-header">
      <div className="explore-pickers no-print">
        {phone ? (
          <button
            type="button"
            className="key-trigger"
            aria-haspopup="dialog"
            aria-expanded={keySheet}
            aria-label={t('explore.keyPickerLabel', { key: noteToString(selectedKey) })}
            data-testid="key-picker"
            onClick={() => setKeySheet(true)}
          >
            <span aria-hidden="true">{withGlyphs(selectedKey)}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        ) : (
          <>
            <KeyPicker />
            <RespellButton />
          </>
        )}
        <ScalePicker className="explore-scale-picker" short={simple} />
      </div>

      {/* Each part of the summary is a word to tap: the key (its scale), its
          signature, its relative key. A phone puts "Words" at its end. */}
      <div className="explore-summary-row">
        <p className="explore-summary" data-testid="key-summary">
          <Term id={scaleTermId(selectedScale)} testId="summary-key"><span className="explore-summary-key">{keyName(scale, t)}</span></Term>
          {simple ? (
            plainSignature && <>{' · '}<Term id="keySignature" also={['sharpFlat']}>{plainSignature}</Term></>
          ) : (
            <>
              {' · '}
              <Term id="keySignature" also={['sharpFlat']}>{facts.signatureText}</Term>
              {facts.relative && <>{' · '}<Term id="relativeKey">{t('explore.relativeKey', { key: facts.relative })}</Term></>}
            </>
          )}
        </p>
        {phone && <WordsButton inline className="no-print" />}
      </div>

      <div className="explore-actions no-print">
        {segmentFits && detailSegment}
        {!phone && <WordsButton />}
        {practiceAction}
        {phone ? (
          <IconButton
            variant="primary"
            aria-label={t(selectedScale === 'melodic_minor' ? 'explore.playScaleClassical' : 'explore.playScaleAscending')}
            onClick={playScaleNow}
            icon={PLAY_ICON}
          />
        ) : (
          <Button variant="primary" onClick={playScaleNow} aria-label={t(selectedScale === 'melodic_minor' ? 'explore.playScaleClassical' : 'explore.playScaleAscending')} startIcon={PLAY_ICON}>
            {t(selectedScale === 'melodic_minor' ? 'explore.playScaleBoth' : 'explore.playScale')}
          </Button>
        )}
        <Menu
          label={t('explore.scaleActions')}
          testId="explore-menu"
          portal
          items={[
            { id: 'copy', label: t('explore.copyScaleSummary'), onSelect: () => void copy() },
            { id: 'print', label: t('explore.printScaleDiagram'), onSelect: () => window.print() },
            ...(simple ? [] : [{ id: 'compare', label: t('explore.compareScalesAction'), onSelect: () => setCompare(true) }]),
            // A guitarist who never switches the dock to Guitar still finds the
            // practice tools here (2026-11-09); the toolbar button stays as it is.
            ...(onPractise ? [{ id: 'practise', label: t('practice.title'), onSelect: onPractise }] : []),
            ...(!segmentFits && simple ? [{ id: 'detail', label: t('simpleView.menuFull'), onSelect: () => setDetail('full') }] : []),
          ]}
        />
      </div>

      <Sheet
        open={keySheet}
        onClose={() => setKeySheet(false)}
        title={t('explore.keySheetTitle')}
        closeLabel={t('common.close')}
        testId="key-sheet"
      >
        <div className="space-y-4 pb-2">
          <RootChips />
          {/* Simple view keeps the twelve roots and drops the circle. */}
          {!simple && <CircleOfFifths />}
          {!simple && <KeyFactsList />}
        </div>
      </Sheet>
      <Sheet
        open={compare}
        onClose={() => setCompare(false)}
        title={t('explore.compareScales')}
        closeLabel={t('common.close')}
        testId="compare-sheet"
      >
        <ScaleComparison inSheet />
      </Sheet>
    </div>
  );
}
