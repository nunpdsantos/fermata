/**
 * Audit W4-01 — every generated exercise practises its own module's topic.
 *
 * In ~25 modules (L3, L4, L6, L7, L8) the template blocks had shifted one or
 * two modules from the curriculum they were written for: "Root Position Part
 * Writing" was quizzed on cadences, "Species 4–5" on whole-tone scales, a
 * few items tested topics no lesson teaches. The blocks were re-keyed to the
 * modules they match and new templates written where none fit.
 *
 * Oracle: a topic keyword map written from each module's lesson (title,
 * objectives, concepts) — independent of the templates. Every generated item
 * (EN; PT/ES share the configs and are index-mirrored, which the parity
 * tests pin) must match its module's topic in what the learner is asked:
 * the prompt, the keyed answer, and — for build/identify items — what the
 * config builds (e.g. "chord_build half_diminished7").
 */
import { describe, it, expect } from 'vitest';
import type { ExerciseConfig } from '../../../core/types/exercise';
import { LEVELS, levelCorpus, modulesInOrder } from './learnCorpus';

/** What each module teaches, as the words its exercises must be about. */
const MODULE_TOPIC: Record<string, RegExp> = {
  // L1
  l1u1m1: /\bclef\b|\bstaff\b|note_id/i,
  l1u1m2: /ledger|grand staff|middle C|note_id/i,
  l1u1m3: /half step|whole step|semitone|accidental|sharp|flat|enharmonic|interval_id/i,
  l1u1m4: /chromatic|black[- ]key|enharmonic|note_id/i,
  l1u2m1: /note value|whole note|half note|quarter|eighth|sixteenth|dotted|\brests?\b|\btie/i,
  l1u2m2: /time signature|meter|beats? per measure|\b[234]\/4\b/i,
  l1u3m1: /major scale|scale_build major|scale_degree_id/i,
  l1u3m2: /key signature|sharps?|flats?/i,
  l1u3m3: /interval|interval_id/i,
  l1u3m4: /major triad|chord_build major\b/i,
  // L2
  l2u4m1: /circle of fifths|key signature|sharps?|flats?|scale_build major\b/i,
  l2u4m2: /degree|tonic|supertonic|mediant|subdominant|dominant|submediant|leading tone/i,
  l2u5m1: /natural minor|natural_minor/i,
  l2u5m2: /harmonic[ _]minor|melodic[ _]minor/i,
  l2u5m3: /relative|parallel/i,
  l2u6m1: /compound|simple (duple|triple|quadruple)|\b\d+\/8\b/i,
  l2u6m2: /syncopat|triplet|off-?beat|\btie\b|accent/i,
  l2u7m1: /perfect|major|minor|interval_id/i,
  l2u7m2: /augmented|diminished|compound|tritone|interval_id/i,
  l2u7m3: /triad|chord_build (major|minor|diminished|augmented)\b/i,
  l2u7m4: /inversion|figured bass|\b[56]\/[34]\b|bass/i,
  l2u7m5: /diatonic|roman numeral|\b(I|ii|iii|IV|V|vi|vii)\b|chord_build/i,
  // L3
  l3u9m1: /seventh|\b7th\b|chord_build (major7|minor7|dominant7|half_diminished7|diminished7)/i,
  l3u9m2: /inversion|\b6\/5\b|\b4\/3\b|\b4\/2\b|figured bass/i,
  l3u9m3: /diatonic seventh|chord_build (major7|minor7|dominant7|half_diminished7)/i,
  l3u9m4: /minor|chord_build/i,
  l3u10m1: /SATB|soprano|\balto\b|tenor|\bbass\b|voices?\b|doubl|spacing|crossing|overlap/i,
  l3u10m2: /parallel|motion|contrary|oblique|similar|voice[- ]leading|leading tone|chordal 7th/i,
  l3u10m3: /root position|common tone|root motion|roots? (move|a)|part[- ]writing|contrary motion|shortest|doubl|by (fifth|third|second)/i,
  l3u10m4: /inversion|\b6\/3\b|\b6\/4\b|cadential|first-inversion|second-inversion|bass/i,
  l3u11m1: /cadence|\bPAC\b|\bIAC\b|plagal|deceptive/i,
  l3u11m2: /phrase|period|antecedent|consequent|sentence|Satz|presentation|continuation/i,
  l3u11m3: /harmonic rhythm|chords? change/i,
  l3u11m4: /passing tone|neighbou?r|anticipation|non-chord tone|accented|unaccented/i,
  l3u11m5: /transpos|concert pitch|written pitch|interval_id|scale_build major\b/i,
  // L4
  l4u12m1: /suspension|\b4-3\b|\b7-6\b|\b9-8\b|\b2-3\b/i,
  l4u12m2: /appoggiatura|escape tone|retardation/i,
  l4u12m3: /pedal|changing tone|double neighbou?r/i,
  l4u12m4: /\bV7\b|dominant seventh|dominant7|tritone|leading tone|resolv/i,
  l4u12m5: /\bV7\b|\bV6\/5\b|\bV4\/3\b|\bV4\/2\b|inversion|dominant7/i,
  l4u13m1: /pre-?dominant|\bii7\b|\bIV7\b|\bii-V|minor7|ii(ø|o)7/i,
  l4u13m2: /\biii7\b|\bvi7\b|\bImaj7\b|\bI7\b|tonic[- ](seventh|function|substitut)|mediant|submediant/i,
  l4u13m3: /\bvii|leading-tone seventh|half_diminished7|diminished7|half-diminished|fully diminished|rootless/i,
  l4u13m4: /function|tonic|pre-?dominant|dominant|retrogression|substitut/i,
  l4u13m5: /sequence|descending fifths|\b5-6\b|descending thirds|ascending seconds/i,
  l4u14m1: /species|counterpoint|cantus|consonan|dissonan|interval_id/i,
  // L5
  l5u15m1: /V\/V|V7\/V|secondary dominant|dominant7|chord_build/i,
  l5u15m2: /secondary|V\/|V7\/|tonici|dominant7|chord_build/i,
  l5u15m3: /vii|leading-tone|diminished|secondary/i,
  l5u15m4: /tonici|modulat/i,
  l5u15m5: /chain|dominant|secondary|sequential|circle/i,
  l5u16m1: /pivot|modulat/i,
  l5u16m2: /closely related|modulat|relative|key/i,
  l5u16m3: /direct|common-tone|chromatic|modulat|phrase/i,
  l5u16m4: /mixture|borrow|parallel minor|chord_build/i,
  l5u17m1: /binary|ternary|form/i,
  l5u17m2: /song form|sonata|rondo|variation|theme|strophic|verse|chorus|form|exposition|development/i,
  // L6
  l6u18m1: /neapolitan|\bbII\b|♭II/i,
  l6u18m2: /augmented (6th|sixth)|\bIt\+6|\bFr\+6|italian|french/i,
  l6u18m3: /german|\bGr\+6|augmented (6th|sixth)/i,
  l6u18m4: /enharmonic|german|\bGr\+6|modulat/i,
  l6u19m1: /dim(inished)?[ -]?7|°7|enharmonic|modulat/i,
  l6u19m2: /common-tone|CT°7|CTo7|diminished/i,
  l6u19m3: /chromatic mediant|omnibus|altered dominant|\bV\+|7b5|7#5/i,
  l6u19m4: /equal division|whole[- _]tone|augmented triad|symmetr|nonfunctional|planing|extended tonality|tonal ambiguity/i,
  l6u20m1: /cantus firmus|first species|second species|third species|\b1:1\b|\b2:1\b|\b4:1\b|cambiata|double neighbou?r/i,
  l6u20m2: /fourth species|fifth species|florid|syncopat|suspension|tied/i,
  l6u20m3: /three-part|three voices|invertible|triple counterpoint|double counterpoint/i,
  l6u20m4: /harmoni[sz]|soprano|figured bass|score|transposing|concert pitch|SATB|realiz/i,
  // L7
  l7u21m1: /chord symbol|extension|\b9th\b|\b11th\b|\b13th\b|alteration|\b(b9|#9|#11|b13)\b|major9|minor9|dominant9|C13|min7\(b5\)|C7\(#9\)/i,
  l7u21m2: /shell|guide tone|alt\b|altered|sus4|7sus4/i,
  l7u21m3: /ii-V-I|ii7|\bii\b|minor7/i,
  l7u21m4: /tritone sub|back-door|bII7|subV/i,
  l7u21m5: /blues/i,
  l7u21m6: /rhythm changes|turnaround|cycle of dominants|AABA/i,
  l7u22m1: /chord-scale|scale (for|over)|over (a |the )?\w*\s?(chord|maj7|m7|7)|avoid note|scale_build (dorian|phrygian|lydian|mixolydian|locrian|altered|lydian_dominant)/i,
  l7u22m2: /upper[- ]structure|reharmoni[sz]|substitut|passing chord|chromatic bass/i,
  l7u22m3: /coltrane|giant steps|major thirds?|key centers?|constant structure|augmented triad/i,
  l7u22m4: /modal|characteristic|dorian|phrygian|lydian|mixolydian|aeolian|locrian|vamp|drone/i,
  l7u22m5: /quartal|quintal|fourths|fifths|drone|pedal|planing/i,
  l7u23m1: /nashville|pop|loop|axis|I-V-vi-IV|vi-IV-I-V/i,
  l7u23m2: /borrow|mixture|parallel minor|chromatic mediant|mario|truck driver|direct modulation|\b(bVI|bVII|bIII|iv)\b|♭(VI|VII|III)/i,
  l7u23m3: /melodic[ _]minor|lydian[ _]dominant|altered|super ?locrian|mixolydian b6|mode [1-7]/i,
  l7u23m4: /harmonic[ _]minor|phrygian[ _]dominant|whole[ _-]tone|diminished|symmetric|chromatic|hungarian|double harmonic|world/i,
  l7u23m5: /extended|suspended|sus[24]|add|6\/9|quartal|power chord|polychord|major9|minor9|dominant9|dominant13|major13|minor11|taxonomy|famil/i,
  // L8
  l8u25m1: /fugue|exposition|subject|answer|countersubject/i,
  l8u25m2: /episode|stretto|augmentation|diminution|inversion|retrograde|middle entr/i,
  l8u25m3: /canon|round|imitation/i,
  l8u26m1: /sonata|exposition|development|recapitulation|concerto|medial caesura|coda/i,
  l8u26m2: /variation|rondo|ritornello|chaconne|passacaglia|ground bass/i,
  l8u26m3: /orchestra|instrument|brass|woodwind|string|percussion|timbre|transpos|doubling/i,
  l8u27m1: /pitch[- ]class|interval class|interval vector|normal (order|form)|prime form|Forte|Z-relat/i,
  l8u27m2: /twelve-tone|tone row|\brow\b|matrix|retrograde|inversion|combinatorial|hexachord/i,
  l8u27m3: /planing|polytonal|polymodal|pandiatonic|quartal|quintal|bitonal|microton|spectral/i,
  l8u27m4: /minimalis|phas|additive|aleator|chance|extended technique|prepared piano|multiphonic|sprechstimme|mobile form|indetermina/i,
  l8u27m5: /polyrhythm|polymeter|hemiola|metric modulation|tuplet|cross-rhythm|3:2|3 against 2/i,
};

function descriptor(cfg: ExerciseConfig): string {
  switch (cfg.type) {
    case 'note_id': return 'note_id';
    case 'interval_id': return `interval_id ${cfg.targetSemitones}`;
    case 'scale_build': return `scale_build ${cfg.scaleType}`;
    case 'chord_build': return `chord_build ${cfg.quality}`;
    case 'scale_degree_id': return 'scale_degree_id';
    case 'ear_training': return `ear_training ${cfg.mode}`;
    case 'multiple_choice': return cfg.choices.filter((c) => c.correct).map((c) => c.label).join(' | ');
  }
}

describe('generated items practise their own module (W4-01)', () => {
  it('the map covers every module that has generation templates (L1–L8)', () => {
    const withTemplates = new Set(LEVELS.filter((n) => n < 9).flatMap((n) => levelCorpus(n, 'en').filter((i) => i.source === 'generated').map((i) => i.moduleId)));
    expect([...withTemplates].filter((m) => !MODULE_TOPIC[m])).toEqual([]);
    expect(Object.keys(MODULE_TOPIC).filter((m) => !modulesInOrder().some((x) => x.module.id === m))).toEqual([]);
  });

  it('the oracle rejects a planted off-topic item', () => {
    expect(MODULE_TOPIC.l3u10m3.test('Classify this cadence | V to vi is a Deceptive Cadence')).toBe(false);
    expect(MODULE_TOPIC.l3u11m1.test('Classify this cadence | V to vi is a Deceptive Cadence')).toBe(true);
  });

  it('every generated item (L1–L8) matches its module topic', () => {
    const off: string[] = [];
    for (const n of LEVELS.filter((x) => x < 9)) {
      for (const item of levelCorpus(n, 'en')) {
        if (item.source !== 'generated') continue;
        const text = `${item.exercise.prompt} | ${descriptor(item.exercise.config)}`;
        if (!MODULE_TOPIC[item.moduleId]?.test(text)) off.push(`${item.exercise.id}: ${text.slice(0, 120)}`);
      }
    }
    expect(off).toEqual([]);
  });
});
