import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { buildChord } from '../../../core/constants/chords';
import { CHORD_SYMBOLS } from '../../../core/constants/chords';
import { getPitchClass } from '../../../core/constants/notes';
import { withGlyphs } from '../../../core/utils/accidentalGlyphs';
import type { Chord } from '../../../core/types/music';
import type { MusicKey } from '../../../core/utils/progression';
import { Sheet } from '../../ui/Sheet';
import { Button } from '../../ui/Button';
import { ChipGroup } from '../../ui/ChoiceChip';
import { Term } from '../../../glossary/Term';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { qualityName } from '../../../utils/qualityName';
import { toContentLanguage } from '../../drill/drillText';
import { CHORD_KINDS, readSymbol, sheetRoots, type ChordKind } from './progressionModel';
import { chordName } from './progressionText';

/** A mouse and a keyboard (a laptop): the sheet also takes a typed symbol. */
export const TYPING_QUERY = '(hover: hover) and (pointer: fine)';

/**
 * "Another chord": the twelve roots (spelled for the key), then the kind —
 * major, minor, 7, m7, maj7, sus4, sus2, dim — and Add. With a mouse and a
 * keyboard a typed symbol is read by the app's own chord parser too.
 */
export function AnotherChordSheet({ open, onClose, keyForRoots, onAdd }: {
  open: boolean;
  onClose: () => void;
  keyForRoots: MusicKey;
  onAdd: (chord: Chord) => void;
}) {
  const { t, i18n } = useTranslation();
  const lang = toContentLanguage(i18n.language);
  const roots = useMemo(() => sheetRoots(keyForRoots), [keyForRoots]);
  const [pc, setPc] = useState<number>(() => getPitchClass(keyForRoots.root));
  const [kind, setKind] = useState<ChordKind>('major');
  const [typed, setTyped] = useState('');
  const [invalid, setInvalid] = useState(false);
  const typing = useMediaQuery(TYPING_QUERY);
  const chord = buildChord(roots[pc], kind);

  const kindLabel = (k: ChordKind) => k === 'major' ? t('progression.kindMajor') : k === 'minor' ? t('progression.kindMinor') : withGlyphs(CHORD_SYMBOLS[k]);

  return (
    <Sheet open={open} onClose={onClose} title={t('progression.another')} closeLabel={t('common.close')} testId="progression-another-sheet"
      actions={
        <Button variant="primary" block onClick={() => onAdd(chord)} data-testid="progression-another-add">
          {t('progression.addThis', { chord: chordName(chord) })}
        </Button>
      }>
      <div className="prog-sheet-body">
        <span className="prog-label"><Term id="root">{t('progression.root')}</Term></span>
        <ChipGroup label={t('progression.root')} value={pc} onChange={(v) => setPc(Number(v))}
          options={roots.map((n, i) => ({ value: i, label: withGlyphs(n) }))} className="prog-sheet-chips" />
        <span className="prog-label" aria-hidden="true">{t('progression.kind')}</span>
        <ChipGroup label={t('progression.kind')} value={kind} onChange={(v) => setKind(v as ChordKind)}
          options={CHORD_KINDS.map((k) => ({ value: k, label: kindLabel(k), ariaLabel: `${kindLabel(k)} (${qualityName(k, lang)})` }))}
          className="prog-sheet-chips" />
        {typing && (
          <form className="prog-type" onSubmit={(e) => {
            e.preventDefault();
            const c = readSymbol(typed.trim());
            if (!c) { setInvalid(true); return; }
            setInvalid(false);
            setTyped('');
            onAdd(c);
          }}>
            <label className="prog-type-label">
              <span className="prog-label">{t('progression.typeLabel')}</span>
              <input type="text" className="share-link-field" value={typed} maxLength={50} autoComplete="off" spellCheck={false}
                placeholder={t('progression.typeHint')} aria-invalid={invalid || undefined}
                aria-describedby={invalid ? 'prog-type-error' : undefined}
                onChange={(e) => { setTyped(e.target.value); setInvalid(false); }} data-testid="progression-type" />
            </label>
            <Button type="submit" disabled={typed.trim() === ''}>{t('progression.add')}</Button>
            {invalid && <p id="prog-type-error" role="alert" className="text-ui prog-error">{t('progression.typeInvalid', { text: typed.trim() })}</p>}
          </form>
        )}
      </div>
    </Sheet>
  );
}
