/**
 * The answer as the feedback names it (audit W1-10; moved here from
 * DrillView, 2026-11-18): a choice item's answer as its chip reads; otherwise
 * note names with ♯/♭/𝄪 and chord-quality names — never ASCII spellings or
 * the internal quality id ("C# half_diminished7" reads "C♯ Half-Diminished
 * 7th"). Drill-only module: it reads the guitar-reading formatter, which the
 * other importers of drillText.ts do not need. In PT / ES a chord's name is
 * its root and the quality its chip shows ("C♯ meio-diminuto", audit A12).
 */
import type { DrillItem } from '../../core/types/drill';
import { stringToNote } from '../../core/types/music';
import { withGlyphs } from '../../core/utils/accidentalGlyphs';
import { formatPlaces } from '../../core/utils/drillBank/genRead';
import type { ContentLanguage } from '../../i18n/content/types';
import { choiceLabel, chordName, type Translate } from './drillText';

export function answerLabel(item: DrillItem, t: Translate, lang: ContentLanguage): string {
  const note = (ascii: string) => withGlyphs(stringToNote(ascii));
  switch (item.answer.kind) {
    case 'choice':
      return choiceLabel(item, item.answer.correct, t, lang);
    case 'notes':
      return item.answer.notes.map(note).join(' ');
    case 'accidentals':
      return item.answer.spelled.map(note).join(' ');
    case 'fretPitch':
      return formatPlaces(item.answer.accepted);
    case 'rootQuality':
      return chordName(note(item.answer.root), item.answer.quality, lang);
  }
}
