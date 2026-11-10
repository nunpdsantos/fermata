/**
 * Audit W4-15 (and the forward-reference half of W4-01) — no exercise asks
 * about a concept before a lesson has taught it.
 *
 * Oracle: the lesson text the learner has read — the title, subtitle,
 * objectives, concepts and tasks of the exercise's own module and of every
 * module before it in course order. A term counts as taught once that text
 * contains it. Every served exercise (authored + generated, English; the
 * PT/ES items share the configs and translate the same text) is checked on
 * what the learner must know to answer it: the prompt and the keyed answer.
 *
 * L9 is the parallel ear-training track: it is open from the start (decision
 * D-10 badges it "pairs with Level n"), so its own lesson text is the
 * reference for its items — they are checked against L9's own earlier text
 * only.
 *
 * The starting tracks (wave 2, src/data/tracks.ts — "Start with sound", "From
 * the chords you know") may be skipped, so their text never counts as taught
 * for the nine levels; a track's own items are checked against that track's
 * earlier text only. Level 1's optional guitar notation (u33) keeps counting.
 */
import { describe, it, expect } from 'vitest';
import type { ExerciseConfig } from '../../../core/types/exercise';
import { LEVELS, levelCorpus, modulesInOrder } from './learnCorpus';
import { trackOfModule } from '../../tracks';

/** [term, pattern in exercises, pattern in lesson text (default: the same)] */
const TERMS: [string, RegExp, RegExp?][] = [
  ['compound meter / 6/8', /\bcompound meter\b|\b6\/8\b|\b9\/8\b|\b12\/8\b/i],
  ['common time (C)', /common time/i],
  ['cut time / alla breve / 2/2', /cut time|alla breve|\b2\/2\b/i],
  ['hemiola', /hemiola/i],
  ['cadential 6/4', /cadential 6\/4/i],
  ['cadence types', /\b(PAC|IAC|half cadence|deceptive cadence|plagal|authentic cadence)\b/i],
  ['period / antecedent / consequent', /\bperiod\b|antecedent|consequent/i],
  ['sentence (Satz)', /sentence structure|presentation phase|\bSatz\b/i],
  ['passing tone', /passing tone/i],
  ['neighbor tone', /neighbou?r tone|\bneighbou?r\b/i],
  ['suspension', /suspension/i],
  ['appoggiatura', /appoggiatura/i],
  ['escape tone', /escape tone/i],
  ['retardation', /retardation/i],
  ['anticipation', /anticipation/i],
  ['pedal point', /pedal point|\b(tonic|dominant|double|inverted) pedal\b/i],
  ['harmonic rhythm', /harmonic rhythm/i],
  ['harmonic sequence', /\bsequence\b/i],
  ['harmonic function T/PD/D', /pre-?dominant|tonic function|T -> PD|T-PD-D/i],
  ['parallel fifths', /parallel (5ths|fifths)/i],
  ['figured bass', /figured bass/i],
  ['Neapolitan', /neapolitan/i],
  ['augmented sixth', /augmented (6th|sixth)|\b(It|Fr|Gr)\+6/i],
  ['species counterpoint', /\bspecies\b|cantus firmus/i],
  ['invertible / triple counterpoint', /invertible counterpoint|triple counterpoint/i],
  ['quadruple counterpoint', /quadruple counterpoint/i],
  ['parsimonious voice leading', /parsimonious/i],
  ['whole-tone scale', /whole[- _]tone/i],
  ['octatonic / diminished scale', /octatonic|diminished (scale|half|whole)/i],
  ['tritone substitution', /tritone sub/i],
  ['Nashville numbers', /nashville/i],
  ['modal interchange / borrowed chord', /modal interchange|borrowed (chord|from)/i, /modal interchange|borrow/i],
  ['church modes', /\b(dorian|phrygian|lydian|mixolydian|aeolian|locrian|ionian)\b/i],
  ['melodic-minor modes', /lydian dominant|altered scale|super ?locrian/i],
  ['pentatonic', /pentatonic/i],
  ['blues scale', /blues scale/i],
  ['Hirajoshi', /hirajoshi/i],
  ['Hungarian minor', /hungarian minor/i],
  ['twelve-tone row', /twelve-tone|tone row|12-tone/i],
  ['interval vector / prime form / Z-relation', /interval (class )?vector|prime form|Z-relat/i],
  ['spectral music', /spectral/i],
  ['microtonality', /microton/i],
  ['extended techniques', /extended technique|multiphonic|prepared piano/i],
  ['polyrhythm / metric modulation', /polyrhythm|metric modulation/i],
  ['planing', /\bplaning\b/i],
  ['quartal harmony', /quartal/i],
  ['Coltrane / Giant Steps', /coltrane|giant steps/i],
  ['upper-structure triad', /upper[- ]structure/i],
  ['chord-scale theory', /chord-scale/i],
  ['fugue', /\bfugue|fugal|stretto|countersubject/i],
  ['sonata form', /sonata/i],
  ['rondo', /\brondo\b/i],
  ['key signature beyond C/G/D/F (L1)', /\b(E|B|Bb|Ab|Eb|Db|Gb|A|F#|C#) major has\b/],
];

const order = modulesInOrder();
const lessonText = order.map(({ module: m }) =>
  [m.title, m.subtitle, ...m.objectives, ...m.concepts.flatMap((c) => [c.title, c.explanation]), ...m.tasks.map((t) => t.instruction)].join(' \n '),
);
const position = new Map(order.map(({ module }, i) => [module.id, i]));
const isL9 = (moduleId: string) => moduleId.startsWith('l9');

/** The track a module belongs to (null: a lesson of the nine levels). */
const trackOf = (moduleId: string) => trackOfModule(moduleId)?.id ?? null;

/** Lesson text read up to and including this module (L9: only L9's own modules; a track: only its own). */
function readBy(moduleId: string): string {
  const end = position.get(moduleId)!;
  const track = trackOf(moduleId);
  return order
    .slice(0, end + 1)
    .map(({ module }, i) => {
      if (trackOf(module.id) !== track) return '';
      return isL9(moduleId) && !isL9(module.id) ? '' : lessonText[i];
    })
    .join(' \n ');
}

function keyedAnswer(cfg: ExerciseConfig): string {
  if (cfg.type === 'multiple_choice') return cfg.choices.filter((c) => c.correct).map((c) => c.label).join(' | ');
  if (cfg.type === 'ear_training' && cfg.choices) return cfg.choices.filter((c) => c.correct).map((c) => c.label).join(' | ');
  return '';
}

describe('no concept before it is taught (W4-15)', () => {
  it('the oracle catches a planted forward reference and passes a taught term', () => {
    const planted = 'Hemiola creates the illusion of shifting meter';
    const re = TERMS.find(([name]) => name === 'hemiola')![1];
    expect(re.test(planted) && !re.test(readBy('l2u6m2'))).toBe(true);
    expect(/staff/i.test(readBy('l1u1m1'))).toBe(true);
  });

  it('a track\'s lesson text never counts as taught for the nine levels; guitar notation (u33) still does', () => {
    // Start with sound (l1u34m*) comes after Level 1's units in course order.
    const trackText = order.filter(({ module }) => trackOf(module.id) === 'sound').map(({ module }) => module.concepts[0].explanation);
    expect(trackText.length).toBe(5);
    const firstAfter = order.find(({ module }) => position.get(module.id)! > position.get('l1u34m5')! && trackOf(module.id) === null)!.module.id;
    expect(firstAfter).toBe('l2u4m1');
    const read = readBy(firstAfter);
    for (const t of trackText) expect(read.includes(t)).toBe(false);
    // Guitar notation's text is read by Level 2.
    expect(read).toContain('Circled Numbers Name Strings');
    // A track item reads its own earlier lessons, and nothing of the levels.
    expect(readBy('l1u34m3')).toContain(trackText[1]);
    expect(readBy('l1u34m3')).not.toContain('The five-line grid');
  });

  it('every exercise prompt and keyed answer uses only terms its lessons have taught', () => {
    const early: string[] = [];
    for (const n of LEVELS) {
      for (const item of levelCorpus(n, 'en')) {
        const text = `${item.exercise.prompt} | ${keyedAnswer(item.exercise.config)}`;
        const taught = readBy(item.moduleId);
        for (const [name, re, lessonRe] of TERMS) {
          if (re.test(text) && !(lessonRe ?? re).test(taught)) early.push(`${item.exercise.id} uses [${name}]: ${text.slice(0, 110)}`);
        }
      }
    }
    expect(early).toEqual([]);
  });

  it('before interval qualities are taught (l2u7m1), interval answers are numbers or half/whole steps', () => {
    const qualityTaughtAt = position.get('l2u7m1')!;
    const bad: string[] = [];
    for (const n of LEVELS) {
      for (const item of levelCorpus(n, 'en')) {
        const cfg = item.exercise.config;
        if (cfg.type !== 'interval_id' || position.get(item.moduleId)! >= qualityTaughtAt) continue;
        if (cfg.answer !== 'number' && cfg.answer !== 'step') bad.push(`${item.exercise.id}: answered by quality name`);
      }
    }
    expect(bad).toEqual([]);
  });
});
