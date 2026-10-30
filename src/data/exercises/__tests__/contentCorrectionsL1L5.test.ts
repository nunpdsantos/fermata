/**
 * Regression gate for the Learn L1–L5 content corrections (audit batch W5a:
 * W5-03…W5-09, W5-29…W5-36, W5-38, and the L1–L5 parts of W6-02/W6-08).
 *
 * Wherever a corrected claim can be computed, it is re-derived from the core
 * theory engine (pitch classes, chord builders, the chord parser) instead of
 * being restated; the remaining checks pin the corrected wording in English
 * and make sure Portuguese and Spanish no longer state the old, wrong fact.
 */
import { describe, expect, it } from 'vitest';
import { getModuleById } from '../../../core/constants/curriculum';
import { buildChord } from '../../../core/constants/chords';
import { buildScale } from '../../../core/constants/scales';
import { getPitchClass } from '../../../core/constants/notes';
import { stringToNote } from '../../../core/types/music';
import type { ChordQuality, Note } from '../../../core/types/music';
import { parseChordSymbol, chordFromParsed } from '../../../core/utils/chordParser';
import type { ExerciseDefinition } from '../../../core/types/exercise';
import type { CurriculumModule } from '../../../core/types/curriculum';
import type { CurriculumLevelOverlay } from '../../../i18n/content/types';

import exercisesL1 from '../exercisesL1';
import exercisesL2 from '../exercisesL2';
import exercisesL3 from '../exercisesL3';
import exercisesL4 from '../exercisesL4';
import exercisesL5 from '../exercisesL5';
import templatesL1 from '../templatesL1';
import templatesL2 from '../templatesL2';
import templatesL3 from '../templatesL3';
import templatesL4 from '../templatesL4';
import templatesL5 from '../templatesL5';

import ptL3 from '../../../i18n/content/pt/curriculumL3';
import ptL4 from '../../../i18n/content/pt/curriculumL4';
import ptL5 from '../../../i18n/content/pt/curriculumL5';
import esL3 from '../../../i18n/content/es/curriculumL3';
import esL4 from '../../../i18n/content/es/curriculumL4';
import esL5 from '../../../i18n/content/es/curriculumL5';

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

const LETTERS = 'CDEFGAB';
const pc = (name: string): number => getPitchClass(stringToNote(name));
const pcs = (notes: Note[]): number[] => notes.map(getPitchClass);
const chordPcs = (root: string, quality: ChordQuality): number[] => pcs(buildChord(stringToNote(root), quality).notes);
/** Semitones going UP from a to b (0–11). */
const up = (a: string, b: string): number => (pc(b) - pc(a) + 12) % 12;
/** Interval number (2 = 2nd, …) going up from letter a to letter b. */
const letterNumber = (a: string, b: string): number =>
  ((LETTERS.indexOf(b[0]) - LETTERS.indexOf(a[0]) + 7) % 7) + 1;
/** "C4" → MIDI number. */
const midi = (sci: string): number => {
  const m = /^([A-G][#b]?)(-?\d)$/.exec(sci);
  if (!m) throw new Error(`bad pitch ${sci}`);
  return pc(m[1]) + 12 * (Number(m[2]) + 1);
};

function mod(id: string): CurriculumModule {
  const m = getModuleById(id);
  expect(m, `missing module ${id}`).toBeDefined();
  return m!;
}

const AUTHORED: Record<string, ExerciseDefinition[]>[] = [exercisesL1, exercisesL2, exercisesL3, exercisesL4, exercisesL5];
const TEMPLATES = [templatesL1, templatesL2, templatesL3, templatesL4, templatesL5];

function exercise(id: string): ExerciseDefinition {
  for (const level of AUTHORED) {
    for (const list of Object.values(level)) {
      const found = list.find((e) => e.id === id);
      if (found) return found;
    }
  }
  throw new Error(`missing exercise ${id}`);
}

function template(moduleId: string, index: number) {
  for (const level of TEMPLATES) {
    const cfg = level.find((c) => c.moduleId === moduleId);
    if (cfg) return cfg.templates[index];
  }
  throw new Error(`missing template ${moduleId}[${index}]`);
}

const OVERLAYS: Array<[string, CurriculumLevelOverlay]> = [
  ['pt/L3', ptL3], ['pt/L4', ptL4], ['pt/L5', ptL5],
  ['es/L3', esL3], ['es/L4', esL4], ['es/L5', esL5],
];
function overlayModule(lang: 'pt' | 'es', level: 3 | 4 | 5, id: string) {
  const ov = OVERLAYS.find(([k]) => k === `${lang}/L${level}`)![1];
  const m = ov.modules[id];
  expect(m, `${lang} overlay missing ${id}`).toBeDefined();
  return m;
}

// ---------------------------------------------------------------------------
// Intervals
// ---------------------------------------------------------------------------

describe('interval naming (W5-09, W5-38)', () => {
  it('l1u1m3e1 asks C to Db: two letters a 2nd apart, 1 semitone = minor 2nd', () => {
    const ex = exercise('l1u1m3e1');
    const m = /from ([A-G][#b]?) to ([A-G][#b]?)\?/.exec(ex.prompt);
    expect(m, ex.prompt).not.toBeNull();
    const [, a, b] = m!;
    expect(letterNumber(a, b)).toBe(2);
    expect(ex.config.type === 'interval_id' && ex.config.targetSemitones).toBe(up(a, b));
    expect(up(a, b)).toBe(1); // a 2nd of 1 semitone is minor
  });

  it('every authored L1–L5 prompt that names both notes agrees with its answer-key interval number', () => {
    let checked = 0;
    for (const level of AUTHORED) {
      for (const list of Object.values(level)) {
        for (const ex of list) {
          if (ex.config.type !== 'interval_id') continue;
          const m = /(?:from|interval from) ([A-G][#b]?) (?:up )?to ([A-G][#b]?)(?![A-Za-z#])/.exec(ex.prompt);
          if (!m) continue;
          const [, a, b] = m;
          // semitones must match the key, and the letter count must be the
          // interval number of a 2nd/3rd/… — never a unison spelled as a 2nd
          expect(up(a, b), ex.id).toBe(ex.config.targetSemitones % 12);
          expect(letterNumber(a, b), `${ex.id}: ${a}→${b}`).toBeGreaterThan(1);
          checked++;
        }
      }
    }
    expect(checked).toBeGreaterThanOrEqual(3);
  });

  it('no L1–L5 choice label names a non-existent interval quality ("minor 5th" etc.)', () => {
    const bad = /\b(minor|major) (unison|4th|5th|octave)\b/i;
    const labels: string[] = [];
    for (const level of AUTHORED) {
      for (const list of Object.values(level)) {
        for (const ex of list) {
          if (ex.config.type === 'multiple_choice') labels.push(...ex.config.choices.map((c) => c.label));
        }
      }
    }
    for (const level of TEMPLATES) {
      for (const cfg of level) {
        for (const t of cfg.templates) {
          for (const set of t.params.choiceSets ?? []) labels.push(...set.map((c) => c.label));
        }
      }
    }
    expect(labels.length).toBeGreaterThan(300);
    expect(labels.filter((l) => bad.test(l))).toEqual([]);
  });

  it('l4u13m2: the major 7th is C up to B (11 semitones)', () => {
    expect(mod('l4u13m2').tasks[0].instruction).toContain('major 7th interval (C up to B)');
    expect(up('C', 'B')).toBe(11);
    expect(letterNumber('C', 'B')).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// Tritone resolution direction (W5-06)
// ---------------------------------------------------------------------------

describe('dominant-seventh tritone contracts inward (W5-06)', () => {
  it('derivation: B up to F (6) → C–E (4); F# up to C (6) → G–B (4)', () => {
    expect(up('B', 'F')).toBe(6);
    expect(up('C', 'E')).toBe(4);
    expect(up('F#', 'C')).toBe(6);
    expect(up('G', 'B')).toBe(4);
  });

  const passages = (): Array<[string, string]> => [
    ['l3u9m3 concept', mod('l3u9m3').concepts[1].explanation],
    ['l3u9m3 task', mod('l3u9m3').tasks[1].instruction],
    ['l5u15m1 concept 2', mod('l5u15m1').concepts[1].explanation],
    ['l5u15m1 concept 3', mod('l5u15m1').concepts[2].explanation],
    ['l5u15m1 task', mod('l5u15m1').tasks[1].instruction],
  ];

  it('English says inward in all five passages', () => {
    for (const [where, text] of passages()) {
      expect(text, where).toMatch(/inward/);
      expect(text, where).not.toMatch(/(resolves|opens) outward/);
    }
  });

  it('Portuguese and Spanish no longer say the tritone opens outward', () => {
    const texts = [
      overlayModule('pt', 3, 'l3u9m3').concepts[1].explanation,
      overlayModule('pt', 3, 'l3u9m3').tasks[1].instruction,
      overlayModule('es', 3, 'l3u9m3').concepts[1].explanation,
      overlayModule('es', 3, 'l3u9m3').tasks[1].instruction,
      ...[1, 2].map((i) => overlayModule('pt', 5, 'l5u15m1').concepts[i].explanation),
      ...[1, 2].map((i) => overlayModule('es', 5, 'l5u15m1').concepts[i].explanation),
      overlayModule('pt', 5, 'l5u15m1').tasks[1].instruction,
      overlayModule('es', 5, 'l5u15m1').tasks[1].instruction,
    ];
    for (const t of texts) {
      expect(t).not.toMatch(/resolve para fora|abre-se para|resuelve hacia fuera|se abre hacia/);
      expect(t).toMatch(/para dentro|hacia dentro/);
    }
  });
});

// ---------------------------------------------------------------------------
// Cadences and harmony (W5-03, W5-33, W5-38)
// ---------------------------------------------------------------------------

describe('minor-key deceptive cadence (W5-03)', () => {
  it('VI and i in A minor share two tones', () => {
    const vi = chordPcs('F', 'major');
    const i = chordPcs('A', 'minor');
    expect(vi.filter((p) => i.includes(p)).length).toBe(2);
    expect(up('E', 'F')).toBe(1); // bass 5 → ♭6 is a half step
  });

  it('the lesson says so in EN, PT and ES', () => {
    const text = mod('l3u11m1').concepts[1].explanation;
    expect(text).not.toContain('shares only one tone');
    expect(text).toContain('VI still shares two tones with i');
    for (const lang of ['pt', 'es'] as const) {
      const t = overlayModule(lang, 3, 'l3u11m1').concepts[1].explanation;
      expect(t, lang).toContain('F-A-C');
      expect(t, lang).toContain('A-C-E');
    }
  });

  it('the Phrygian half cadence Try-This label names the chord the button plays (Dm/F = iv6)', () => {
    const c = mod('l3u11m1').concepts[2];
    expect(c.tryThisQuery).toBe('Dm/F');
    for (const lang of ['pt', 'es'] as const) {
      expect(overlayModule(lang, 3, 'l3u11m1').concepts[2].tryThisLabel, lang).toMatch(/^\S+ iv6/);
    }
  });
});

describe('A harmonic minor is compared with A natural minor (W5-32)', () => {
  it('the raised G# changes exactly the seventh chords on degrees 1, 3, 5 and 7', () => {
    const nat = pcs(buildScale(stringToNote('A'), 'natural_minor').notes);
    const harm = pcs(buildScale(stringToNote('A'), 'harmonic_minor').notes);
    const seventh = (scale: number[], d: number) => [0, 2, 4, 6].map((k) => scale[(d + k) % 7]).join(',');
    const changed = [0, 1, 2, 3, 4, 5, 6].filter((d) => seventh(nat, d) !== seventh(harm, d)).map((d) => d + 1);
    expect(changed).toEqual([1, 3, 5, 7]);
    // A major already contains G#, so it is not the comparison that shows the change
    expect(pcs(buildScale(stringToNote('A'), 'major').notes)).toContain(pc('G#'));
    expect(mod('l3u9m4').tasks[0].instruction).toContain('Compare the pattern to A natural minor');
  });
});

describe('cadential 6/4 Try-This plays a second-inversion tonic (W5-38)', () => {
  it('C/G puts the 5th of C major in the bass', () => {
    const concept = mod('l3u10m4').concepts.find((c) => c.title === 'The Cadential 6/4')!;
    const parsed = parseChordSymbol(concept.tryThisQuery!)!;
    const chord = chordFromParsed(parsed);
    expect(chord.quality).toBe('major');
    expect(getPitchClass(parsed.bassNote!)).toBe(getPitchClass(chord.notes[2]));
  });
});

describe('V7 inversion demos contain the 7th (W5-07)', () => {
  it('V4/3 Try-This and V6/5 task build G7 over D and over B', () => {
    const m = mod('l4u12m5');
    const v43 = m.concepts.find((c) => c.title.includes('V4/3'))!;
    for (const [query, bass] of [[v43.tryThisQuery!, 'D'], [m.tasks[1].query!, 'B']] as const) {
      const parsed = parseChordSymbol(query)!;
      const chord = chordFromParsed(parsed);
      expect(chord.quality, query).toBe('dominant7');
      expect(chord.notes.length, query).toBe(4);
      expect(getPitchClass(parsed.bassNote!), query).toBe(pc(bass));
    }
    expect(m.tasks[1].instruction).toContain("'G7/B'");
  });
});

describe('blues tonic Try-This plays a dominant seventh (W5-38)', () => {
  it('l4u13m2 "Blues Tonic" button is C7', () => {
    const c = mod('l4u13m2').concepts.find((x) => x.title.includes('Blues'))!;
    expect(chordFromParsed(parseChordSymbol(c.tryThisQuery!)!).quality).toBe('dominant7');
  });
});

describe('minor-key chord palette (W5-33, W5-38)', () => {
  it('melodic minor ascending gives a minor ii and a major IV; VII–i is Aeolian', () => {
    const mel = pcs(buildScale(stringToNote('A'), 'melodic_minor').notes);
    const triad = (d: number) => [0, 2, 4].map((k) => mel[(d + k) % 7]);
    expect(triad(1)).toEqual(chordPcs('B', 'minor')); // ii
    expect(triad(3)).toEqual(chordPcs('D', 'major')); // IV
    // A Mixolydian would need C#; natural minor has C, so VII–i is Aeolian
    expect(pcs(buildScale(stringToNote('A'), 'natural_minor').notes)).not.toContain(pc('C#'));
    const text = mod('l4u14m5').concepts[1].explanation;
    expect(text).not.toMatch(/Mixolydian/);
    expect(text).toMatch(/Aeolian/);
  });

  it('L4 names the mode-mixture reading of major IV that L5 tests', () => {
    expect(mod('l4u14m5').concepts[0].explanation).toMatch(/borrowed from the parallel major/);
    expect(exercise('l5u16m5e3').hint).toMatch(/Level 4/);
    for (const [lang, word] of [['pt', 'ii e IV'], ['es', 'ii y IV']] as const) {
      expect(overlayModule(lang, 4, 'l4u14m5').concepts[0].explanation, lang).toContain(word);
    }
  });
});

// ---------------------------------------------------------------------------
// Non-chord tones and voice leading (W5-04, W5-05, W5-08, W5-30, W5-35, W5-36)
// ---------------------------------------------------------------------------

describe('4-3 suspension over V (W5-04)', () => {
  it('the held note is a perfect 4th above the V bass and resolves down to its major 3rd', () => {
    const ex = exercise('l4u12m1e3');
    const m = /the note ([A-G]) is held over from the previous IV chord before resolving down to ([A-G])/.exec(ex.prompt);
    expect(m, ex.prompt).not.toBeNull();
    const [, held, res] = m!;
    const V = chordPcs('G', 'major');
    const IV = chordPcs('F', 'major');
    expect(IV).toContain(pc(held)); // prepared (consonant) in IV
    expect(V).not.toContain(pc(held)); // dissonant over V
    expect(V).toContain(pc(res)); // resolves to a chord tone
    expect(up('G', held)).toBe(5); // 4th
    expect(up('G', res)).toBe(4); // 3rd
    expect(up(res, held)).toBe(1); // down by step
    const correct = ex.config.type === 'multiple_choice' ? ex.config.choices.find((c) => c.correct)!.label : '';
    expect(correct).toContain('4-3');
  });
});

describe('guide tones in ii–V–I (W5-05)', () => {
  it('the hint only holds notes common to both chords and moves the others by half step', () => {
    const hint = exercise('l5u17m4e2').hint ?? '';
    const Dm7 = chordPcs('D', 'minor7');
    const G7 = chordPcs('G', 'dominant7');
    const Cmaj7 = chordPcs('C', 'major7');
    const steps: Array<[number[], number[], RegExp]> = [
      [Dm7, G7, /Into G7: ([A-G]) holds .*?while ([A-G]) steps down a half step to ([A-G])/],
      [G7, Cmaj7, /Into Cmaj7: ([A-G]) holds .*?while ([A-G]) steps down a half step to ([A-G])/],
    ];
    for (const [from, to, re] of steps) {
      const m = re.exec(hint);
      expect(m, hint).not.toBeNull();
      const [, held, moving, target] = m!;
      expect(from).toContain(pc(held));
      expect(to).toContain(pc(held));
      expect(from).toContain(pc(moving));
      expect(to).toContain(pc(target));
      expect(up(target, moving)).toBe(1);
    }
    expect(G7).not.toContain(pc('C'));
  });

  it('PT/ES guide-tone lesson no longer holds C into G7', () => {
    expect(overlayModule('pt', 5, 'l5u17m4').concepts[1].explanation).not.toContain('mantém-se como nota comum');
    expect(overlayModule('es', 5, 'l5u17m4').concepts[1].explanation).not.toContain('se mantiene como nota común');
  });
});

describe('3rd + 7th caveat (W5-35)', () => {
  it('Cm7 and Cm7b5 share 3rd and 7th, so the lesson names the exception', () => {
    const m7 = chordPcs('C', 'minor7');
    const hd = chordPcs('C', 'half_diminished7');
    expect([m7[1], m7[3]]).toEqual([hd[1], hd[3]]);
    expect(m7[2]).not.toBe(hd[2]);
    const text = mod('l5u17m4').concepts[0].explanation;
    expect(text).toContain('Cm7 and Cm7b5 share the same 3rd and 7th');
    expect(text).not.toMatch(/ARE the chord/);
  });
});

describe('appoggiatura vs escape tone accent (W5-08)', () => {
  it('the hint matches the lesson: the escape tone is unaccented', () => {
    const hint = template('l4u12m2', 0).hintTemplate;
    expect(hint).not.toMatch(/Both are typically accented/);
    expect(hint).toMatch(/Escape tone:.*unaccented/);
    expect(mod('l4u12m2').concepts.find((c) => c.title === 'The Escape Tone')!.explanation).toContain('weak beat');
  });
});

describe('SATB example respects the stated ranges (W5-30)', () => {
  it('every voice of the l3u10m1 task sits inside the range given in the lesson', () => {
    const ranges = mod('l3u10m1').concepts[0].explanation;
    const task = mod('l3u10m1').tasks[0].instruction;
    const voices = ['Soprano', 'Alto', 'Tenor', 'Bass'] as const;
    const notes: Record<string, number> = {};
    for (const v of voices) {
      const r = new RegExp(`${v} \\(([A-G][#b]?\\d)-([A-G][#b]?\\d)\\)`).exec(ranges);
      const n = new RegExp(`${v} ([A-G][#b]?\\d)`).exec(task);
      expect(r, `${v} range`).not.toBeNull();
      expect(n, `${v} note`).not.toBeNull();
      notes[v] = midi(n![1]);
      expect(notes[v], v).toBeGreaterThanOrEqual(midi(r![1]));
      expect(notes[v], v).toBeLessThanOrEqual(midi(r![2]));
    }
    expect(notes.Soprano - notes.Alto).toBeLessThanOrEqual(12);
    expect(notes.Alto - notes.Tenor).toBeLessThanOrEqual(12);
    expect(task).toContain('tenor-bass gap (a perfect 5th');
    expect(notes.Tenor - notes.Bass).toBe(7);
  });
});

describe('period hint does not call a period a sentence (W5-36)', () => {
  it('l3u11m2e1', () => {
    expect(exercise('l3u11m2e1').hint).not.toMatch(/sentence/i);
  });
});

// ---------------------------------------------------------------------------
// Other L1–L5 prose fixes (W5-29, W5-38)
// ---------------------------------------------------------------------------

describe('small L1–L5 prose fixes', () => {
  it('tenor sax sounds an octave and a major 2nd lower (W5-29)', () => {
    expect(mod('l3u11m5').concepts[2].explanation).toContain('tenor sax, also in Bb, sounds an octave and a major second lower');
    expect(overlayModule('pt', 3, 'l3u11m5').concepts[2].explanation).toContain('oitava e uma 2.a maior abaixo');
    expect(overlayModule('es', 3, 'l3u11m5').concepts[2].explanation).toContain('octava y una 2.ª mayor por debajo');
  });

  it('submediant is the "lower mediant", midway between tonic and subdominant (C major: F–A–C)', () => {
    expect(mod('l2u4m2').concepts[0].explanation).toContain('6=Submediant (the "lower mediant"');
    expect(up('F', 'A')).toBe(up('A', 'C') + 1); // a 3rd either side (M3 below, m3 above)
    expect(letterNumber('F', 'A')).toBe(3);
    expect(letterNumber('A', 'C')).toBe(3);
  });

  it('figured bass gives the inversion, not the voicing', () => {
    expect(mod('l3u9m2').concepts.find((c) => c.title === 'Figured Bass for Seventh Chords')!.explanation).not.toContain('voicing');
  });

  it('6/4 hint lists all four contexts the lesson teaches', () => {
    expect(mod('l3u10m4').concepts[1].explanation).toContain('arpeggiated 6/4');
    expect(exercise('l3u10m4e3').hint).toContain('four specific contexts');
  });

  it('harmonic-rhythm speeds are defined the same way in the concept and the task', () => {
    const m = mod('l3u11m3');
    expect(m.concepts[0].explanation).toContain('Two chords per bar is moderate');
    expect(m.tasks[0].instruction).toContain('moderate (two per bar)');
  });

  it('the l3u9m1 ear items play seventh chords whose labels match the quality', () => {
    const label: Record<string, string> = {
      major7: 'Major 7th', dominant7: 'Dominant 7th', minor7: 'Minor 7th', half_diminished7: 'Half-diminished 7th',
    };
    const ears = exercisesL3.l3u9m1.filter((e) => e.type === 'ear_training');
    expect(ears.length).toBe(4);
    for (const e of ears) {
      if (e.config.type !== 'ear_training') continue;
      const q = e.config.quality as ChordQuality;
      expect(buildChord(stringToNote(e.config.chordRoot!), q).notes.length, e.id).toBe(4);
      expect(e.config.choices!.find((c) => c.correct)!.label, e.id).toBe(label[q]);
    }
  });

  it('only one spelling is offered for a black key, so the prompt describes the written note', () => {
    for (const i of [0, 1]) {
      expect(template('l1u1m4', i).promptTemplate).not.toMatch(/Use its (sharp|flat) name/);
    }
  });
});

// ---------------------------------------------------------------------------
// PT/ES stale theory (W6-02 / W6-08, L1–L5 part)
// ---------------------------------------------------------------------------

describe('PT/ES no longer state theory the English corrected', () => {
  it('2-3 bass suspension resolves downward', () => {
    for (const lang of ['pt', 'es'] as const) {
      const m = overlayModule(lang, 4, 'l4u12m1');
      const blob = [m.objectives[2], m.concepts[2].explanation, m.concepts[2].tryThisLabel].join(' ');
      expect(blob, lang).not.toMatch(/para cima|hacia arriba|ascendente/);
      expect(blob, lang).toMatch(/descendente/);
    }
  });

  it('V4/2 Try-This label names G7/F; chromatic contrary motion has no augmented-sixth claim; Level 6', () => {
    for (const lang of ['pt', 'es'] as const) {
      expect(overlayModule(lang, 4, 'l4u12m5').concepts[2].tryThisLabel, lang).toContain('G7/F');
      expect(overlayModule(lang, 4, 'l4u14m3').concepts[2].explanation, lang).not.toMatch(/sexta aumentada/);
      expect(overlayModule(lang, 4, 'l4u13m3').concepts[2].explanation, lang).toMatch(/Nível 6|Nivel 6/);
    }
  });

  it('doubling caveat and leading-tone IAC are present', () => {
    for (const lang of ['pt', 'es'] as const) {
      expect(overlayModule(lang, 3, 'l3u10m1').concepts[1].explanation, lang).toMatch(/sensible|sensível/);
      expect(overlayModule(lang, 3, 'l3u10m1').concepts[1].explanation, lang).toMatch(/a menos que|salvo que/);
      expect(overlayModule(lang, 3, 'l3u11m1').concepts[0].explanation, lang).toContain('viio6');
    }
  });
});
