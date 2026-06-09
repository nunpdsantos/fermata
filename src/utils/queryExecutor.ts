/**
 * Executes curriculum "Try This" queries against the app store.
 *
 * Routes through the same core parsers as Cmd+K QuickSearch so both entry
 * points accept the same language: all chord symbols (incl. alt, m7b5, slash
 * chords), every scale type and mode the parser knows, "key of X", and
 * "circle of fifths".
 *
 * Order matters: setView('explore') runs FIRST — it clears selectedChord and
 * selectedDegree — and the selection the query names is applied after it.
 *
 * Returns what was executed so callers and tests can detect dead queries.
 */
import { useAppStore } from '../state/store';
import { stringToNote } from '../core/types/music';
import { parseChordSymbol, chordFromParsed, looksLikeChordSymbol } from '../core/utils/chordParser';
import { parseScaleSymbol } from '../core/utils/scaleParser';
import type { ScaleType } from '../core/types/music';

export type TheoryQueryResult = 'chord' | 'scale' | 'key' | 'circle' | 'fallback';

// Mode names the scale parser reports that map onto base scale types.
const MODE_TO_SCALE: Record<string, ScaleType> = {
  ionian: 'major',
  aeolian: 'natural_minor',
};

// Rootless scale-name lookup ("blues scale" keeps the current key).
const ROOTLESS_SCALE_MAP: Record<string, ScaleType> = {
  major: 'major',
  minor: 'natural_minor',
  'natural minor': 'natural_minor',
  'harmonic minor': 'harmonic_minor',
  'melodic minor': 'melodic_minor',
  chromatic: 'chromatic',
  'whole tone': 'whole_tone',
  blues: 'blues',
  'major blues': 'major_blues',
  pentatonic: 'pentatonic_major',
  'major pentatonic': 'pentatonic_major',
  'pentatonic major': 'pentatonic_major',
  'minor pentatonic': 'pentatonic_minor',
  'pentatonic minor': 'pentatonic_minor',
  altered: 'altered',
  // "The diminished scale" with no other qualifier conventionally means W-H.
  diminished: 'diminished_whole_half',
};

// Word-form chord names → symbol suffixes the chord parser understands.
const CHORD_WORD_SUFFIXES: Array<[RegExp, string]> = [
  [/\s+diminished\s+7th$/i, 'dim7'],
  [/\s+diminished\s+seventh$/i, 'dim7'],
  [/\s+dominant\s+7th$/i, '7'],
  [/\s+dominant\s+seventh$/i, '7'],
  [/\s+major\s+7th$/i, 'maj7'],
  [/\s+major\s+seventh$/i, 'maj7'],
  [/\s+minor\s+7th$/i, 'm7'],
  [/\s+minor\s+seventh$/i, 'm7'],
  [/\s+major$/i, ''],
  [/\s+minor$/i, 'm'],
  [/\s+diminished$/i, 'dim'],
  [/\s+augmented$/i, 'aug'],
];

/** "C diminished 7th chord" → "Cdim7"; returns null when not a word form. */
function normalizeChordWords(q: string): string | null {
  const stripped = q.replace(/\s+chord$/i, '');
  if (stripped === q && !/\s/.test(q)) return null; // plain symbol, no normalizing needed
  for (const [pattern, suffix] of CHORD_WORD_SUFFIXES) {
    if (pattern.test(stripped)) {
      const root = stripped.replace(pattern, '').trim();
      if (/^[A-Ga-g][#b]?$/.test(root)) return `${root}${suffix}`;
    }
  }
  return null;
}

export function executeTheoryQuery(query: string): TheoryQueryResult {
  const q = query.trim();

  // Switch first: setView clears selectedChord/selectedDegree, so every
  // selection below must be applied after it.
  useAppStore.getState().setView('explore');
  const store = useAppStore.getState();

  // "key of X" / "key of X minor"
  const keyMatch = q.match(/^key\s+of\s+([A-Ga-g][#b]?)(\s+major|\s+minor)?$/i);
  if (keyMatch) {
    store.setKey(stringToNote(keyMatch[1]));
    if (keyMatch[2]?.trim().toLowerCase() === 'minor') store.setScale('natural_minor');
    return 'key';
  }

  if (q.toLowerCase() === 'circle of fifths') {
    return 'circle'; // Explore renders it; nothing to select
  }

  // Rootless scale names ("blues scale") — exact match, keeps the current key.
  // Checked before the rooted parser, whose leniency would read "blues" as
  // root B + leftovers.
  const rootless = ROOTLESS_SCALE_MAP[q.toLowerCase().replace(/\s+scale$/, '').trim()];
  if (rootless) {
    store.setScale(rootless);
    return 'scale';
  }

  // Rooted scales and modes ("D dorian", "C lydian dominant", "Bb major scale").
  // The parser misses a few aliases when the literal word "scale" trails them
  // ("C altered scale"), so retry with the suffix stripped.
  const parsedScale = parseScaleSymbol(q) ?? parseScaleSymbol(q.replace(/\s+scale$/i, ''));
  if (parsedScale) {
    const scaleType = (MODE_TO_SCALE[parsedScale.scaleType] ?? parsedScale.scaleType) as ScaleType;
    store.setKey(parsedScale.root);
    store.setScale(scaleType);
    return 'scale';
  }

  // Chords: word forms first ("C major chord"), then plain symbols (G7, C7alt,
  // C/E). parseChordSymbol is lenient about trailing text, so plain symbols are
  // gated behind looksLikeChordSymbol to keep prose from becoming a C chord.
  const wordForm = normalizeChordWords(q);
  const chordInput = wordForm ?? (looksLikeChordSymbol(q) ? q : null);
  const parsedChord = chordInput ? parseChordSymbol(chordInput) : null;
  if (parsedChord) {
    store.setSelectedChord(chordFromParsed(parsedChord));
    return 'chord';
  }

  return 'fallback';
}
