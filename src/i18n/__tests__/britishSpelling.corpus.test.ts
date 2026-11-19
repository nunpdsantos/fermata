/**
 * British spelling throughout (the owner's ruling, 18 November 2026: "British
 * throughout", knowing a reworded question loses its saved per-question score;
 * the seat ruled on 19 November that a respelled question keeps it).
 *
 * Every English sentence a learner can read is checked here: the curriculum
 * (every level, the tracks, milestones and completion texts), the authored
 * exercises and the generation templates, the songs, the level cards, the
 * lesson index Cmd+K searches, the chord panel's scale notes, every English
 * namespace (the entry locales and the lazy ones: glossary, practice, tuner,
 * microphone, MIDI, metronome, moved, backup file, learn words, explore tools,
 * Drill terms), the tester's sheet, every Drill item as the learner meets it,
 * and the English in code (chord, scale and shape names, feedback fallbacks,
 * backup messages…: every non-test source file but those NOT_READ_AS_CODE
 * lists, each with its reason). The rules and the guards are in
 * britishCorpus.ts.
 *
 * Music vocabulary is not spelling and stays as the app has it (quarter note,
 * half step, measure, neighbour TONE). Values the app runs or compares (lesson
 * queries, ids, search keywords, Drill graded answers) are not text and are
 * not read here.
 */
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { AMBIGUOUS_AMERICAN } from '../../data/exercises/__tests__/respelling';
import {
  AMBIGUOUS, IZE_WORDS, KEEP, NAMESPACES, NOT_READ_AS_CODE, PRACTICE_NOUNS, UK_MUSIC_TERMS, WARD_ADJECTIVES,
  americanForms, americanRule, codeFiles, englishCorpus,
} from './britishCorpus';
import { MODULE_INDEX } from '../../data/moduleIndex';

describe('English is spelt the British way (the owner\'s ruling, 18 November 2026)', () => {
  const corpus = englishCorpus();
  const words = new Set(corpus.flatMap(([, t]) => (t.match(/[A-Za-z]+/g) ?? []).map((w) => w.toLowerCase())));

  it('the ambiguous words are exactly the table\'s', () => {
    expect(Object.keys(AMBIGUOUS).sort()).toEqual([...AMBIGUOUS_AMERICAN].sort());
  });

  it('reads the whole corpus', () => {
    const where = (p: string) => corpus.filter(([w]) => w.startsWith(p)).length;
    expect(where('cur:')).toBeGreaterThan(2500);
    expect(where('ex:')).toBeGreaterThan(2500);
    expect(where('tm:')).toBeGreaterThan(1700);
    expect(where('song:')).toBeGreaterThan(70);
    expect(where('lvl:')).toBe(27);
    expect(where('moduleIndex:')).toBe(2 * MODULE_INDEX.length);
    expect(where('drill:')).toBe(1615);
    // every English namespace file: the entry locales and the lazy ones (audit 2 added drillNothing, languageOffer and lessonDemo)
    expect(Object.keys(NAMESPACES).sort()).toEqual([
      '../backupFile/en.json', '../drillNothing/en.json', '../drillTerms/en.json', '../exploreTools/en.json', '../glossary/en.json', '../languageOffer/en.json',
      '../learnWords/en.json', '../lessonDemo/en.json', '../locales/en.json', '../metronomeTool/en.json', '../midiInput/en.json', '../moved/en.json', '../practice/en.json',
      '../tuner/en.json', '../tuner/mic.en.json',
    ]);
    expect(where('testSheet')).toBeGreaterThan(100);
    // English in code: the files that hold it are read
    const files = codeFiles();
    expect(files.length).toBeGreaterThan(350);
    for (const f of [
      'src/core/constants/chords.ts', 'src/core/constants/scales.ts', 'src/core/constants/guitarChordShapes.ts', 'src/core/constants/guitarTunings.ts',
      'src/components/learn/exercises/validateExercise.ts', 'src/utils/backupHelpers.ts', 'src/utils/exportHelpers.ts', 'src/core/utils/reverseChordParser.ts',
      'src/core/utils/guitarVoicingGenerator.ts', 'src/core/utils/guitarTechnique.ts', 'src/components/panels/LearnMoreButton.tsx',
    ]) expect(files, f).toContain(f);
    expect(corpus.filter(([w]) => w.startsWith('src/')).length).toBeGreaterThan(600);
    for (const [re, why] of NOT_READ_AS_CODE) expect(why.length, String(re)).toBeGreaterThan(4);
  });

  it('no American form in any English text a learner reads', () => {
    const found = corpus.flatMap(([where, text]) => americanForms(where, text));
    expect(found.length, found.slice(0, 40).map((f) => `${f.where}: "${f.word}" (${f.rule}) in …${f.text}…`).join('\n')).toBe(0);
  });

  it('every kept phrase and allowed word is still used (the lists do not rot)', () => {
    const text = corpus.map(([, t]) => t).join('\n');
    const unused = [...PRACTICE_NOUNS, ...WARD_ADJECTIVES, ...KEEP].filter(([re]) => !re.test(text)).map(([re]) => String(re));
    expect([...new Set(unused)]).toEqual([]);
    expect(Object.keys(IZE_WORDS).filter((w) => !words.has(w))).toEqual([]);
    for (const [w, why] of Object.entries(IZE_WORDS)) expect(why.length, w).toBeGreaterThan(10);
  });

  it('the rules: the -ize family with any ending, the stems with all their endings, the words', () => {
    for (const w of ['realizes', 'analyzes', 'harmonizes', 'organizational', 'recognizably', 'honors', 'behavioral', 'neighborhood', 'flavorful',
      'theater', 'centerpiece', 'metered', 'catalogs', 'dialog', 'defenseless', 'modeled', 'traveling', 'counselor', 'pedaled', 'fulfillment',
      'skillful', 'toward', 'gray', 'math', 'percent', 'judgment', 'counterclockwise', 'gotten']) expect(americanRule(w), w).not.toBeNull();
    for (const w of ['size', 'sizes', 'prize', 'humorous', 'honorary', 'vigorous', 'laborious', 'metronome', 'parameter', 'literal', 'analogous',
      'pedagogy', 'license', 'parallel', 'travelled', 'colourful', 'centred', 'towards', 'practise', 'semitone', 'horizon', 'citizen', 'bizarre', 'improvisation']) {
      expect(americanRule(w), w).toBeNull();
    }
  });

  it('the guards: the verb on a noun, an -s adverb on a noun, British-only music words', () => {
    const rules = (t: string) => americanForms('planted', t).map((f) => `${f.word}: ${f.rule}`);
    expect(rules('Practise Tasks · Tick the practise task · practise answers are not scored')).toEqual([
      'Practise: the verb spelling on the noun', 'practise: the verb spelling on the noun', 'practise: the verb spelling on the noun',
    ]);
    expect(rules('Practise identifying the root; it resolves downwards by step')).toEqual([]);
    expect(rules('a downwards resolution, upwards motion')).toEqual(['downwards: the adverb spelling on a noun', 'upwards: the adverb spelling on a noun']);
    expect(rules('a crotchet, two quavers, a minim, a semibreve; a neighbour note and an auxiliary note').length).toBe(6);
    expect(rules('a quarter note, a half step or semitone, a neighbour tone')).toEqual([]);
    expect(rules('pitch classes 0 through 11, different than before').length).toBe(2);
    expect(rules('pitch classes 0 to 11, from Josquin to Bach')).toEqual([]);
    expect(UK_MUSIC_TERMS.length).toBe(3);
  });

  it('the check fires on planted American forms and passes the kept uses', () => {
    const planted = 'Practice identifying the color of a tonal center. In practice, the 7th resolves downward by step; a downward step; analyze it; {{color}}.';
    expect(americanForms('planted', planted).map((f) => f.word)).toEqual(['Practice', 'color', 'center', 'downward', 'analyze']);
    expect(americanForms('planted', 'Practise identifying the colour of a tonal centre; it resolves downwards; analyse it.')).toEqual([]);
  });

  it('every file left out of the code reading exists or is a whole class of files', () => {
    for (const f of ['src/core/utils/rhythm.ts', 'src/release/releaseNotes.ts', 'src/i18n/scaleSuggestionContext.ts', 'src/i18n/chordQualityNames.ts',
      'src/i18n/content/musicTerms.ts', 'src/data/moduleIndexI18n.ts', 'src/components/theory/chordCategoryLabel.tsx']) {
      expect(existsSync(f), f).toBe(true);
      expect(codeFiles()).not.toContain(f);
    }
  });
});
