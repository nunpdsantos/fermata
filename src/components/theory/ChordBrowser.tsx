import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { noteToString, type ChordQuality } from '../../core/types/music.ts';
import { buildChord, CHORD_QUALITY_NAMES, CHORD_SYMBOLS, CHORD_FORMULAS } from '../../core/constants/chords.ts';
import { useAppStore } from '../../state/store.ts';

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

export function ChordBrowser() {
  const { t } = useTranslation();
  const selectedKey = useAppStore((s) => s.selectedKey);
  const setSelectedChord = useAppStore((s) => s.setSelectedChord);
  const selectedChord = useAppStore((s) => s.selectedChord);
  const [activeCategory, setActiveCategory] = useState(0);

  const rootLabel = noteToString(selectedKey);
  const group = CHORD_QUALITY_GROUPS[activeCategory];

  return (
    <div className="space-y-3">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-1">
        {CHORD_QUALITY_GROUPS.map((g, i) => {
          const isActive = activeCategory === i;
          return (
            <button
              key={g.labelKey}
              onClick={() => setActiveCategory(i)}
              className="px-2 py-1 text-[10px] font-medium rounded-lg transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--border)' : 'transparent',
                color: isActive ? 'var(--text)' : 'var(--text-dim)',
                border: isActive ? '1px solid var(--border-light)' : '1px solid transparent',
              }}
            >
              {t(g.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Chord pills grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {group.qualities.map((quality) => {
          const symbol = CHORD_SYMBOLS[quality];
          const name = CHORD_QUALITY_NAMES[quality];
          const isActive =
            selectedChord?.quality === quality &&
            selectedChord?.root.natural === selectedKey.natural &&
            selectedChord?.root.accidental === selectedKey.accidental;

          return (
            <button
              key={quality}
              data-quality={quality}
              onClick={() => {
                const chord = buildChord(selectedKey, quality);
                setSelectedChord(chord);
              }}
              className="flex flex-col items-start px-2.5 py-2 rounded-xl transition-all text-left"
              style={{
                backgroundColor: isActive ? 'var(--accent-dim)' : 'var(--card)',
                border: isActive ? '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' : '1px solid var(--card-hover)',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <span
                className="text-sm font-bold"
                style={{ color: isActive ? 'var(--accent)' : 'var(--text)' }}
              >
                {rootLabel}{symbol}
              </span>
              <span className="text-[9px] leading-tight mt-0.5" style={{ color: 'var(--text-dim)' }}>
                {name}
              </span>
              {SAME_NOTES[quality] && (
                <span className="text-[9px] leading-tight" style={{ color: 'var(--text-dim)' }}>
                  {SAME_NOTES[quality]!.map((o) => `= ${rootLabel}${CHORD_SYMBOLS[o]}`).join(' ')}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
