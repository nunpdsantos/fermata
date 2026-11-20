/**
 * Directions (the second audit's fix pass, item 1): a sentence that says
 * "falls", "upper", "under" or "sing up" must say it in every language, and
 * what it says must be what the demonstration does. Letters and numbers are
 * compared elsewhere (`lessonDemonstrations.corpus.test.tsx`); a word for a
 * direction is not a letter or a number, so a PT label saying «sobe» for
 * «desce», a Spanish hint saying «hacia abajo», or the PT words for the upper
 * and the lower voice swapped, passed every test until this one.
 *
 * Each row: where the words are; the direction words each language must hold
 * and must not hold; and the check against the demonstration's own data (the
 * bass's second note lower than its first, which voice is on top, which way
 * each pair moves). The text alternative's "upper" / "lower" words are read
 * the same way: the voice a language calls upper must be the higher one.
 */
import { describe, it, expect } from 'vitest';
import { L4_UNITS } from '../../core/constants/curriculumL4';
import { L7_UNITS } from '../../core/constants/curriculumL7';
import { L9_UNITS } from '../../core/constants/curriculumL9';
import type { CurriculumLevel, CurriculumUnit } from '../../core/types/curriculum';
import type { Demonstration } from '../../core/types/demonstration';
import { demoMidi } from '../../core/utils/demonstration';
import { applyCurriculumOverlay } from '../../i18n/content/contentResolver';
import ptL4 from '../../i18n/content/pt/curriculumL4';
import esL4 from '../../i18n/content/es/curriculumL4';
import ptL7 from '../../i18n/content/pt/curriculumL7';
import esL7 from '../../i18n/content/es/curriculumL7';
import ptL9 from '../../i18n/content/pt/curriculumL9';
import esL9 from '../../i18n/content/es/curriculumL9';
import templatesL9 from '../exercises/templatesL9';
import ptTemplatesL9 from '../../i18n/content/pt/templatesL9';
import esTemplatesL9 from '../../i18n/content/es/templatesL9';
import { levelCorpus } from '../exercises/__tests__/learnCorpus';
import type { EarTrainingConfig } from '../../core/types/exercise';
import i18n from '../../i18n';
import { describeDemonstration } from '../../components/learn/lesson/demoDescription';
import { LESSON_DEMO_WORDS } from '../../i18n/lessonDemo';

type Lang = 'en' | 'pt' | 'es';
const LANGS: Lang[] = ['en', 'pt', 'es'];

/** Direction words, by language (whole words, any case). */
const DOWN: Record<Lang, RegExp> = {
  en: /\b(falls?|falling|down|descend\w*)\b/i,
  pt: /\b(desce|descer|descendo|descendente|descem)\b/i,
  es: /\b(desciende|descendiendo|descendente|descender|baja|bajando|hacia abajo)\b/i,
};
const UP: Record<Lang, RegExp> = {
  en: /\b(rises?|rising|up|ascend\w*|climbs?)\b/i,
  pt: /\b(sobe|subir|subindo|ascendente|sobem)\b/i,
  es: /\b(sube|subiendo|ascendente|asciende|hacia arriba)\b/i,
};
const UPPER: Record<Lang, RegExp> = { en: /\bupper\b/i, pt: /\bsuperior\b/i, es: /\bsuperior\b/i };
const LOWER_VOICE: Record<Lang, RegExp> = { en: /\blower\b/i, pt: /\binferior\b/i, es: /\binferior\b/i };
const UNDER: Record<Lang, RegExp> = { en: /\bunder\b/i, pt: /\bdebaixo\b/i, es: /\bbajo cada\b/i };
const OVER: Record<Lang, RegExp> = { en: /\bover\b/i, pt: /\bsobre\b/i, es: /\bsobre\b/i };

const overlaid = (units: CurriculumUnit[], ov: unknown) => applyCurriculumOverlay({ id: 'x', units } as unknown as CurriculumLevel, ov as never).units;
const mod = (units: CurriculumUnit[], id: string) => units.flatMap((u) => u.modules).find((m) => m.id === id)!;
const inLangs = (units: CurriculumUnit[], [pt, es]: [unknown, unknown], pick: (u: CurriculumUnit[]) => string): Record<Lang, string> =>
  ({ en: pick(units), pt: pick(overlaid(units, pt)), es: pick(overlaid(units, es)) });

const midis = (demo: Demonstration, voice: number) => demo.voices[voice].events.filter((e) => e.notes.length).map((e) => e.notes.map((p) => demoMidi(p)!));
const highest = (demo: Demonstration, v: number) => Math.max(...midis(demo, v).flat());
const lowest = (demo: Demonstration, v: number) => Math.min(...midis(demo, v).flat());
/** The single notes of a one-voice demonstration in pairs, as played (rests between). */
const pairs = (demo: Demonstration) => {
  const notes = midis(demo, 0).map((m) => m[0]);
  return notes.reduce<number[][]>((out, m, i) => (i % 2 ? out : [...out, [m, notes[i + 1]]]), []);
};

const L4: [unknown, unknown] = [ptL4, esL4];
const L7: [unknown, unknown] = [ptL7, esL7];
const L9: [unknown, unknown] = [ptL9, esL9];
const c1 = mod(L4_UNITS, 'l4u12m1').concepts[1].demo!;
const c2 = mod(L4_UNITS, 'l4u12m1').concepts[2].demo!;
const t1 = mod(L4_UNITS, 'l4u12m1').tasks[0].demos!['C major chord'];
const pedal = mod(L7_UNITS, 'l7u22m5').concepts[2].demo!;
const quartal = mod(L7_UNITS, 'l7u22m5').concepts[0].demo!;
const small = mod(L9_UNITS, 'l9u30m3').concepts[0].demo!;
const large = mod(L9_UNITS, 'l9u30m4').concepts[1].demo!;

interface Row {
  where: string;
  text: Record<Lang, string>;
  must: Record<Lang, RegExp>[];
  not: Record<Lang, RegExp>[];
  /** What the words claim, checked against the demonstration's data. */
  data: () => boolean;
}

const ROWS: Row[] = [
  {
    where: 'l4u12m1 c2 (the 2-3): E held in an upper voice, the bass falls from D to C',
    text: inLangs(L4_UNITS, L4, (u) => mod(u, 'l4u12m1').concepts[2].tryThisLabel),
    must: [DOWN, UPPER], not: [UP],
    data: () => {
      const bass = midis(c2, 1).map((m) => m[0]);
      return bass.length === 2 && bass[1] < bass[0] && lowest(c2, 0) > highest(c2, 1);
    },
  },
  {
    where: 'l4u12m1 c1 (the 4-3 and the 7-6): C falls to B, B falls to A, held over the bass',
    text: inLangs(L4_UNITS, L4, (u) => mod(u, 'l4u12m1').concepts[1].tryThisLabel),
    must: [DOWN], not: [UP],
    data: () => {
      const upper = midis(c1, 0).map((m) => m[0]);
      return upper.every((m, i) => i === 0 || m <= upper[i - 1]) && upper[0] > upper[upper.length - 1] && lowest(c1, 0) > highest(c1, 1);
    },
  },
  {
    where: 'l4u12m1 t1: F held over C and G, then falling to E',
    text: inLangs(L4_UNITS, L4, (u) => mod(u, 'l4u12m1').tasks[0].instruction),
    must: [DOWN], not: [UP],
    data: () => {
      const upper = midis(t1, 0).map((m) => m[0]);
      return upper[1] < upper[0] && lowest(t1, 0) > highest(t1, 1);
    },
  },
  {
    where: 'l4u12m1 t2: B held over a C bass resolves down to A (the second of c1\'s suspensions)',
    text: inLangs(L4_UNITS, L4, (u) => mod(u, 'l4u12m1').tasks[1].instruction),
    must: [DOWN], not: [UP],
    data: () => {
      const upper = midis(c1, 0).map((m) => m[0]);
      return upper[upper.length - 2] === demoMidi('B4') && upper[upper.length - 1] === demoMidi('A4');
    },
  },
  {
    where: 'l7u22m5 c2: the scale over a D pedal, a low D under every note',
    text: inLangs(L7_UNITS, L7, (u) => mod(u, 'l7u22m5').concepts[2].tryThisLabel),
    must: [OVER, UNDER], not: [],
    data: () => highest(pedal, 1) < lowest(pedal, 0),
  },
  {
    where: 'l7u22m5 c0: fourths stacked on D, one at a time',
    text: inLangs(L7_UNITS, L7, (u) => mod(u, 'l7u22m5').concepts[0].tryThisLabel),
    must: [], not: [DOWN],
    data: () => {
      const run = midis(quartal, 0).slice(0, 4).map((m) => m[0]);
      return run.every((m, i) => i === 0 || m > run[i - 1]) && run[0] === demoMidi('D4');
    },
  },
  {
    where: 'l9u30m3 c0: each interval from the root, rising',
    text: inLangs(L9_UNITS, L9, (u) => mod(u, 'l9u30m3').concepts[0].tryThisLabel),
    must: [], not: [DOWN],
    data: () => pairs(small).every(([a, b]) => a === demoMidi('C4') && b > a),
  },
  {
    where: 'l9u30m4 c1: the large intervals falling from the upper C',
    text: inLangs(L9_UNITS, L9, (u) => mod(u, 'l9u30m4').concepts[1].tryThisLabel),
    must: [DOWN], not: [UP],
    data: () => pairs(large).every(([a, b]) => a === demoMidi('C5') && b < a),
  },
  {
    where: 'l9u32m1 note items\' hint: sing up the scale from the reference C',
    text: {
      en: templatesL9.find((t) => t.moduleId === 'l9u32m1')!.templates[0].hintTemplate!,
      pt: (ptTemplatesL9 as unknown as Record<string, { hintTemplate?: string }[]>).l9u32m1[0].hintTemplate!,
      es: (esTemplatesL9 as unknown as Record<string, { hintTemplate?: string }[]>).l9u32m1[0].hintTemplate!,
    },
    must: [UP], not: [DOWN],
    data: () => {
      const notes = levelCorpus(9, 'en').map((i) => i.exercise).filter((e) => /^l9u32m1g[1-4]$/.test(e.id));
      const midi = (c: EarTrainingConfig) => demoMidi(`${c.note}${c.accidental ?? ''}${c.octave}`)!;
      return notes.length === 4 && notes.every((e) => midi(e.config as EarTrainingConfig) >= demoMidi('C4')!);
    },
  },
];

describe('every direction a changed sentence states, in every language, is what the demonstration does', () => {
  it.each(ROWS.map((r) => [r.where, r] as const))('%s', (_w, row) => {
    expect(row.data(), 'the demonstration does what the words say').toBe(true);
    for (const lang of LANGS) {
      for (const must of row.must) expect(row.text[lang], `${lang} must say ${must[lang]}`).toMatch(must[lang]);
      for (const not of row.not) expect(row.text[lang], `${lang} must not say ${not[lang]}`).not.toMatch(not[lang]);
    }
  });
});

describe('the text alternative\'s "upper" and "lower" voice words name the voice that is higher and the one that is lower', () => {
  it.each(LANGS)('%s: the words themselves', (lang) => {
    expect(LESSON_DEMO_WORDS[lang].upper).toMatch(UPPER[lang]);
    expect(LESSON_DEMO_WORDS[lang].upper).not.toMatch(LOWER_VOICE[lang]);
    expect(LESSON_DEMO_WORDS[lang].lower).toMatch(LOWER_VOICE[lang]);
    expect(LESSON_DEMO_WORDS[lang].lower).not.toMatch(UPPER[lang]);
  });

  it.each(LANGS.flatMap((lang) => [['l7u22m5 c2', pedal, lang], ['l4u12m1 c2', c2, lang], ['l4u12m1 c1', c1, lang]] as const))('%s, %s: the voice called upper is the higher one', (_w, demo, lang) => {
    const text = describeDemonstration(demo, i18n.getFixedT(lang));
    const up = text.search(UPPER[lang]);
    const low = text.search(LOWER_VOICE[lang]);
    expect(up).toBeGreaterThanOrEqual(0);
    expect(low).toBeGreaterThan(up);
    // The pitches named after "upper" are the higher voice's, after "lower" the lower voice's.
    const names = (part: string) => (part.match(/[A-G][♯♭]?\d/g) ?? []).map((n) => demoMidi(n.replace('♯', '#').replace('♭', 'b'))!);
    const upperPart = names(text.slice(up, low));
    const lowerPart = names(text.slice(low));
    expect(Math.min(...upperPart)).toBeGreaterThan(Math.max(...lowerPart));
    expect(Math.min(...upperPart)).toBe(lowest(demo, 0));
  });
});
