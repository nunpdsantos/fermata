/**
 * The word table of the British spelling pass (19 November 2026), and what a
 * respelling is for a saved score.
 *
 * ONE table, used by the tests and scripts/progress/retire-exercise-ids.ts
 * only — never by app code (it ships in no chunk; the app's lesson search
 * carries its own small rule in data/moduleIndex.ts, in a lazy chunk):
 *  - britishSpelling.corpus.test.ts forbids the American forms in every
 *    English text a learner reads;
 *  - `npm run progress:retire -- --respelled` and exerciseRespellings.test.ts
 *    prove that an exercise whose identity changed changed ONLY by spelling.
 *
 * A saved per-question score stays valid while its id names the same
 * exercise (W4a). A question reworded only in spelling ("What defines
 * compound meter?" → "… metre?") is the same exercise: its score is kept,
 * not retired. The proof: re-spell the current English item the American
 * way and its fingerprint is, exactly, the one recorded before. Any other
 * change still means retirement.
 */
import type { ExerciseConfig, ExerciseDefinition } from '../../../core/types/exercise';
import { exerciseFingerprint } from '../exerciseFingerprint';

/** [American, British], every form the pass wrote (and a few it forbids). */
export const SPELLINGS: readonly (readonly [american: string, british: string])[] = [
  ['color', 'colour'], ['colors', 'colours'], ['colored', 'coloured'], ['colorful', 'colourful'], ['coloring', 'colouring'], ['coloristic', 'colouristic'],
  ['neighbor', 'neighbour'], ['neighbors', 'neighbours'], ['neighboring', 'neighbouring'],
  ['favor', 'favour'], ['favors', 'favours'], ['favored', 'favoured'], ['favorite', 'favourite'], ['favorites', 'favourites'],
  ['flavor', 'flavour'], ['flavors', 'flavours'], ['flavored', 'flavoured'],
  ['center', 'centre'], ['centers', 'centres'], ['centered', 'centred'], ['centering', 'centring'],
  ['meter', 'metre'], ['meters', 'metres'], ['polymeter', 'polymetre'], ['somber', 'sombre'],
  ['recognize', 'recognise'], ['recognizes', 'recognises'], ['recognized', 'recognised'], ['recognizing', 'recognising'], ['recognizable', 'recognisable'],
  ['tonicization', 'tonicisation'], ['tonicizations', 'tonicisations'], ['tonicize', 'tonicise'], ['tonicizes', 'tonicises'], ['tonicized', 'tonicised'], ['tonicizing', 'tonicising'],
  ['reharmonization', 'reharmonisation'], ['harmonization', 'harmonisation'], ['harmonizations', 'harmonisations'],
  ['harmonize', 'harmonise'], ['harmonizes', 'harmonises'], ['harmonized', 'harmonised'], ['harmonizing', 'harmonising'],
  ['emphasize', 'emphasise'], ['emphasizes', 'emphasises'], ['emphasized', 'emphasised'], ['emphasizing', 'emphasising'],
  ['organize', 'organise'], ['organizes', 'organises'], ['organized', 'organised'], ['organizing', 'organising'], ['organization', 'organisation'],
  ['realize', 'realise'], ['realizes', 'realises'], ['realized', 'realised'], ['realizing', 'realising'], ['realization', 'realisation'],
  ['characterize', 'characterise'], ['characterizes', 'characterises'], ['characterized', 'characterised'],
  ['epitomize', 'epitomise'], ['internalize', 'internalise'], ['internalizes', 'internalises'], ['internalized', 'internalised'],
  ['memorize', 'memorise'], ['memorizing', 'memorising'], ['minimizes', 'minimises'], ['maximizes', 'maximises'],
  ['synchronization', 'synchronisation'], ['synchronized', 'synchronised'], ['hybridizes', 'hybridises'], ['normalized', 'normalised'],
  ['specialized', 'specialised'], ['energizes', 'energises'], ['categorize', 'categorise'], ['stylized', 'stylised'], ['popularized', 'popularised'],
  ['analyze', 'analyse'], ['analyzes', 'analyses'], ['analyzed', 'analysed'], ['analyzing', 'analysing'],
  ['totaling', 'totalling'], ['signaling', 'signalling'], ['labeling', 'labelling'], ['labeled', 'labelled'],
  ['toward', 'towards'], ['upward', 'upwards'], ['downward', 'downwards'], ['inward', 'inwards'], ['outward', 'outwards'], ['onward', 'onwards'], ['backward', 'backwards'],
  ['catalog', 'catalogue'], ['dialog', 'dialogue'], ['gray', 'grey'], ['math', 'maths'], ['percent', 'per cent'], ['judgment', 'judgement'],
  ['practice', 'practise'], ['practiced', 'practised'], ['practicing', 'practising'],
  ['program', 'programme'], ['programs', 'programmes'],
];

/**
 * American forms that are also right in British English in another use:
 * "practice" the noun, "upward" the adjective. The corpus test passes them
 * only inside its listed phrases.
 */
export const AMBIGUOUS_AMERICAN: ReadonlySet<string> = new Set(['practice', 'upward', 'downward', 'inward', 'outward', 'onward', 'backward']);

const TO_AMERICAN = new Map(SPELLINGS.map(([us, gb]) => [gb, us]));
const BRITISH_WORD = new RegExp(
  `(?<![\\p{L}\\p{N}])(${[...TO_AMERICAN.keys()].sort((a, b) => b.length - a.length).join('|')})(?![\\p{L}\\p{N}])`,
  'giu',
);

/** The case pattern of `like` on `word` ("Metre" → "Meter"). */
function matchCase(like: string, word: string): string {
  if (like.length > 1 && like === like.toUpperCase()) return word.toUpperCase();
  return like[0] === like[0].toUpperCase() ? word[0].toUpperCase() + word.slice(1) : word;
}

/** Every British form of the table in `text`, whole words, with its American form. */
export function britishSpots(text: string): { at: number; word: string; american: string }[] {
  return [...text.matchAll(BRITISH_WORD)].map((m) => ({
    at: m.index ?? 0,
    word: m[0],
    american: matchCase(m[0], TO_AMERICAN.get(m[0].toLowerCase())!),
  }));
}

/** `text` with the British forms at the chosen spots (bit i = spot i) spelt the American way. */
export function americanSpelling(text: string, chosen: (i: number) => boolean = () => true): string {
  let out = '';
  let from = 0;
  britishSpots(text).forEach((s, i) => {
    if (!chosen(i)) return;
    out += text.slice(from, s.at) + s.american;
    from = s.at + s.word.length;
  });
  return out + text.slice(from);
}

type Identity = Pick<ExerciseDefinition, 'type' | 'prompt'> & { config: ExerciseConfig };

/** The texts that make an exercise's identity: a multiple-choice prompt and its keyed answer; any other config whole. */
function identityTexts(ex: Identity): string[] {
  return ex.config.type === 'multiple_choice'
    ? [ex.prompt, ...ex.config.choices.filter((c) => c.correct).map((c) => c.label)]
    : [JSON.stringify(ex.config)];
}

function withTexts(ex: Identity, texts: string[]): Identity {
  if (ex.config.type === 'multiple_choice') {
    let k = 1;
    return { ...ex, prompt: texts[0], config: { ...ex.config, choices: ex.config.choices.map((c) => (c.correct ? { ...c, label: texts[k++] } : c)) } };
  }
  return { ...ex, config: JSON.parse(texts[0]) as ExerciseConfig };
}

/** Most British words one identity may hold (2^n spellings are tried). */
export const MAX_SPOTS = 14;

/**
 * Was `ex` (the current English item) the exercise whose fingerprint was
 * `before`, spelt the American way? The pass changed only some of an item's
 * British words — the base already wrote a few ("towards", "colour") —, so
 * every choice of which British words were the pass's is tried, all of them
 * first. Returns the American text that matches, or null.
 */
export function americanOriginal(ex: Identity, before: string): Identity | null {
  const texts = identityTexts(ex);
  const spots = texts.flatMap((t, ti) => britishSpots(t).map((_, si) => [ti, si] as const));
  if (spots.length === 0 || spots.length > MAX_SPOTS) return null;
  for (let mask = (1 << spots.length) - 1; mask > 0; mask--) {
    const on = new Set(spots.filter((_, i) => mask & (1 << i)).map(([ti, si]) => `${ti}:${si}`));
    const candidate = withTexts(ex, texts.map((t, ti) => americanSpelling(t, (si) => on.has(`${ti}:${si}`))));
    if (exerciseFingerprint(candidate) === before) return candidate;
  }
  return null;
}
