import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { noteToString, type ChordQuality } from '../../core/types/music.ts';
import { withGlyphs } from '../../core/utils/accidentalGlyphs.ts';
import { buildChord, CHORD_SYMBOLS, CHORD_FORMULAS } from '../../core/constants/chords.ts';
import { qualityName } from '../../utils/qualityName.ts';
import { toContentLanguage } from '../drill/drillText.ts';
import { chordCategoryLabel } from './chordCategoryLabel';
import { ChipGroup } from '../ui/ChoiceChip.tsx';
import { useAppStore } from '../../state/store.ts';
import { termAttr } from '../../glossary/visibleTerms.ts';
import { CATEGORY_TERM, qualityTermId } from '../../glossary/termIds.ts';

const CHORD_QUALITY_GROUPS: { labelKey: string; qualities: ChordQuality[] }[] = [
  {
    labelKey: 'chordCategory.triads',
    qualities: ['major', 'minor', 'diminished', 'augmented'],
  },
  {
    labelKey: 'chordCategory.sixths',
    qualities: ['major6', 'minor6', 'six_nine', 'minor_six_nine'],
  },
  {
    labelKey: 'chordCategory.sevenths',
    qualities: [
      'major7', 'minor7', 'dominant7', 'diminished7',
      'half_diminished7', 'augmented7', 'minor_major7',
      'augmented_major7', 'major7flat5', 'diminished_major7',
    ],
  },
  {
    labelKey: 'chordCategory.sus',
    qualities: ['sus2', 'sus4', 'dominant7sus4', 'dominant9sus4', 'sus2sus4'],
  },
  {
    labelKey: 'chordCategory.power',
    qualities: ['power'],
  },
  {
    labelKey: 'chordCategory.ninths',
    qualities: ['major9', 'minor9', 'dominant9', 'add9'],
  },
  {
    labelKey: 'chordCategory.altDom',
    qualities: [
      'dominant7flat9', 'dominant7sharp9', 'dominant7flat5', 'dominant7sharp5',
      'dominant7alt', 'dominant7sharp5flat9', 'dominant7flat5flat9',
      'dominant7sharp5sharp9', 'dominant7flat5sharp9', 'dominant7flat13',
    ],
  },
  {
    labelKey: 'chordCategory.elevenths',
    qualities: ['dominant11', 'major11', 'minor11', 'dominant9sharp11', 'dominant7sharp11', 'add11', 'major7sharp11', 'major9sharp11'],
  },
  {
    labelKey: 'chordCategory.thirteenths',
    qualities: ['dominant13', 'major13', 'minor13', 'dominant13flat9'],
  },
];

// Qualities that are the same notes under another name (C aug7 = C7#5,
// C9sus4 = C11): each is still offered, marked "= <other symbol>" (audit W2-10).
const pitchSet = (q: ChordQuality) =>
  [...new Set(CHORD_FORMULAS[q].map((s) => s % 12))].sort((a, b) => a - b).join(',');
const SAME_NOTES: Partial<Record<ChordQuality, ChordQuality[]>> = (() => {
  const all = Object.keys(CHORD_FORMULAS) as ChordQuality[];
  const out: Partial<Record<ChordQuality, ChordQuality[]>> = {};
  for (const q of all) {
    const twins = all.filter((o) => o !== q && pitchSet(o) === pitchSet(q));
    if (twins.length > 0) out[q] = twins;
  }
  return out;
})();

export function ChordBrowser({ detail }: { detail?: ReactNode } = {}) {
  const { t, i18n } = useTranslation();
  const lang = toContentLanguage(i18n.language);
  const selectedKey = useAppStore((s) => s.selectedKey);
  const setSelectedChord = useAppStore((s) => s.setSelectedChord);
  const selectedChord = useAppStore((s) => s.selectedChord);
  const [activeCategory, setActiveCategory] = useState(0);

  const rootLabel = noteToString(selectedKey);
  const group = CHORD_QUALITY_GROUPS[activeCategory];

  // Columns follow the panel's own width, so the chord detail can open UNDER
  // the row that holds the chord tapped (W11-B, D-25).
  const gridRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(3);
  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setCols(w >= 860 ? 5 : w >= 640 ? 4 : w >= 420 ? 3 : 2);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isActive = (quality: ChordQuality) =>
    selectedChord?.quality === quality &&
    selectedChord?.root.natural === selectedKey.natural &&
    selectedChord?.root.accidental === selectedKey.accidental;
  const activeIdx = group.qualities.findIndex(isActive);
  const rows: ChordQuality[][] = [];
  for (let i = 0; i < group.qualities.length; i += cols) rows.push(group.qualities.slice(i, i + cols));
  const detailRow = activeIdx >= 0 ? Math.floor(activeIdx / cols) : -1;

  const card = (quality: ChordQuality) => {
    const symbol = CHORD_SYMBOLS[quality];
    const name = qualityName(quality, lang);
    const active = isActive(quality);
    // Selected = the choice-chip state (accent fill, --on-accent text; D-28).
    const ink = active ? 'var(--on-accent)' : undefined;
    return (
      <button
        key={quality}
        type="button"
        data-quality={quality}
        aria-pressed={active}
        onClick={() => setSelectedChord(active ? null : buildChord(selectedKey, quality))}
        className="flex flex-col items-start px-2.5 py-2 rounded-xl transition-colors text-left min-h-(--tap) [overflow-wrap:anywhere]"
        style={{
          backgroundColor: active ? 'var(--accent)' : 'var(--card)',
          border: `1px solid ${active ? 'var(--accent)' : 'var(--border-subtle)'}`,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <span className="text-ui font-bold" style={{ color: ink ?? 'var(--text)' }}>
          {withGlyphs(`${rootLabel}${symbol}`)}
        </span>
        <span className="text-caption leading-tight mt-0.5" style={{ color: ink ?? 'var(--text-dim)' }} {...termAttr(qualityTermId(quality))}>
          {name}
        </span>
        {SAME_NOTES[quality] && (
          <span className="text-caption leading-tight" style={{ color: ink ?? 'var(--text-dim)' }}>
            {withGlyphs(SAME_NOTES[quality]!.map((o) => `= ${rootLabel}${CHORD_SYMBOLS[o]}`).join(' '))}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-3">
      {/* Category: one of many — a ChipGroup (D-28). */}
      <ChipGroup
        label={t('explore.allChords')}
        value={activeCategory}
        onChange={(next) => {
          if (selectedChord && !CHORD_QUALITY_GROUPS[next].qualities.some(isActive)) setSelectedChord(null);
          setActiveCategory(next);
        }}
        options={CHORD_QUALITY_GROUPS.map((g, i) => ({ value: i, ...chordCategoryLabel(t(g.labelKey), lang), data: { 'data-term': CATEGORY_TERM[g.labelKey] } }))}
      />

      {/* Chord cards, row by row; the detail opens under the tapped row. */}
      <div ref={gridRef} className="space-y-1.5">
        {rows.map((row, r) => (
          <div key={r} className="space-y-1.5">
            <div data-chord-scroll-row className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {row.map(card)}
            </div>
            {r === detailRow && detail}
          </div>
        ))}
      </div>
    </div>
  );
}
