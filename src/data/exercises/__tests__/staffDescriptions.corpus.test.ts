/**
 * Audit 2026-11-18, A9: every graded question that points at notation gives
 * a screen reader the visual evidence, never the answer.
 *
 * Every SERVED item (authored + generated, all nine levels, EN / PT / ES —
 * `learnCorpus`) that draws a staff is found here, not only the nine the
 * audit sampled (six key signatures in Levels 1–2, three generated
 * note-reading questions whose prompt gives no position):
 *  - a question staff (`exerciseStaff`: note ID, interval ID, a multiple-choice
 *    `stimulus`): its description (components/notation/staffDescription.ts,
 *    what ExercisePrompt names the staff with) is checked against VexFlow's
 *    own placement of every notehead (`Tables.keyProperties`) and every
 *    key-signature accidental (`Tables.keySignature` + `convertAccLines`),
 *    and against its answer in all three languages:
 *      · a note's answer (note ID): no note letter at all, in any spelling,
 *        and no Dó-Ré-Mi name (PT Dó Ré Mi Fá Sol Lá Si, ES Do Re Mi Fa Sol
 *        La Si, with or without an accidental) — whole tokens WITH their case,
 *        as the app's own leak detector compares short answers
 *        (answerLeak.ts), since "sol" / "fá" are the clefs' own names
 *        ("clave de sol", the lessons' words) and "la" / "do" are words;
 *      · an interval's answer: no note letter, no Dó-Ré-Mi name, and none of
 *        the interval vocabulary in any language — the number as an ordinal
 *        ("3rd", "third", "3.ª", "terceira", "tercera"…), a quality word, a
 *        half / whole step, octave, tritone, unison (positions are numbered
 *        "line 3", never "the third line", for this reason);
 *      · a key's answer: not the key's name, not its tonic as a note (letter
 *        with its accidental, the words "sharp" / "sustenido" / "sostenido"…,
 *        Dó-Ré-Mi), no "major" / "maior" / "mayor"; the only letters are those
 *        of the accidentals drawn (the description names their lines);
 *  - a rhythm question (`RhythmStaff`'s own text alternative, W5-64): the
 *    app's leak detector (exact / near / echo) finds none of its answer;
 *  - a melody question (ear training): its staves are the OPTIONS, each named
 *    by its notes (ChoiceInput) — what is heard decides, so there the notes
 *    are the content, not a leak.
 * The detector is shown to fire on planted leaks first (its known positives).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import type { TFunction } from 'i18next';
import i18n from '../../../i18n';
import { CONTENT_LANGS, LEVELS, levelCorpus, type CorpusItem } from './learnCorpus';
import type { ContentLanguage } from '../../../i18n/content/types';
import { exerciseStaff } from '../../../components/learn/exercises/exerciseStaff';
import { choicesForExercise, optionText } from '../../../components/learn/exercises/exerciseHelpers';
import { answerLeak, exactLeak } from '../../../components/learn/exercises/answerLeak';
import { staffPlan } from '../../../utils/notationHelpers';
import {
  describeStaff, staffPosition, keySignatureMarks, KEY_SIGNATURE_LINES,
} from '../../../components/notation/staffDescription';
import { describeRhythm } from '../../../components/notation/rhythmDescription';

// VexFlow's public statics (`VexFlow.keyProperties` / `keySignature` wrap its Tables) and its KeySignature class.
type VFModule = typeof import('vexflow/bravura');
let VF: VFModule;
const Tables = {
  keyProperties: (key: string, clef: string) => (VF.VexFlow as unknown as { keyProperties: (k: string, c: string) => { line: number } }).keyProperties(key, clef),
  keySignature: (spec: string) => (VF.VexFlow as unknown as { keySignature: (s: string) => { type: string; line: number }[] }).keySignature(spec),
};
beforeAll(async () => {
  VF = await import('vexflow/bravura');
});

const tFor = (lang: ContentLanguage) => i18n.getFixedT(lang) as TFunction;

// ─── The detector ──────────────────────────────────────────────────────────

const SOLFEGE = {
  pt: { C: 'Dó', D: 'Ré', E: 'Mi', F: 'Fá', G: 'Sol', A: 'Lá', B: 'Si' },
  es: { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' },
} as const;
const ALL_SYLLABLES = new Set<string>([...Object.values(SOLFEGE.pt), ...Object.values(SOLFEGE.es)]);
const GLYPH: Record<string, string> = { '': '', '#': '♯', b: '♭', '##': '𝄪', bb: '𝄫' };
const ACC_WORDS: Record<string, string[]> = {
  '#': ['sharp', 'sustenido', 'sostenido'], b: ['flat', 'bemol'],
  '##': ['double sharp', 'duplo sustenido', 'dobrado sustenido', 'doble sostenido'], bb: ['double flat', 'duplo bemol', 'dobrado bemol', 'doble bemol'], '': [],
};

/** The text's tokens: letters, digits and accidental signs kept together ("F♯", "line", "3"). */
const tokens = (text: string) => text.normalize('NFC').split(/[^\p{L}\p{N}#♯♭𝄪𝄫]+/u).filter(Boolean);
/** A note's name as a token, with or without its octave ("G", "F♯", "G4", "Bb3"). */
const NOTE_TOKEN = /^[A-G](?:##|bb|#|b|♯|♭|𝄪|𝄫)?-?\d?$/;
/** A Dó-Ré-Mi name as a token: a syllable, with or without an accidental sign after it. */
const isSolfegeToken = (tk: string) => ALL_SYLLABLES.has(tk.replace(/[#♯♭𝄪𝄫]+$/u, ''));
const wordIn = (text: string, phrase: string) =>
  new RegExp(`(?<![\\p{L}\\p{N}])${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'iu').test(text);

const ORDINALS: Record<'en' | 'pt' | 'es', string[]> = {
  en: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth'],
  pt: ['primeira', 'segunda', 'terceira', 'quarta', 'quinta', 'sexta', 'sétima', 'oitava', 'nona', 'décima', 'décima primeira', 'décima segunda', 'décima terceira', 'décima quarta', 'décima quinta'],
  es: ['primera', 'segunda', 'tercera', 'cuarta', 'quinta', 'sexta', 'séptima', 'octava', 'novena', 'décima', 'undécima', 'duodécima', 'decimotercera', 'decimocuarta', 'decimoquinta'],
};
const INTERVAL_WORDS = [
  ...ORDINALS.en, ...ORDINALS.pt, ...ORDINALS.es,
  'major', 'minor', 'perfect', 'augmented', 'diminished', 'maior', 'menor', 'perfeita', 'aumentada', 'diminuta', 'mayor', 'justa', 'disminuida',
  'half step', 'whole step', 'half steps', 'whole steps', 'semitone', 'semitones', 'tone', 'tones', 'meio-tom', 'meios-tons', 'tom', 'tons', 'semitono', 'semitonos', 'tono', 'tonos',
  'octave', 'oitava', 'octava', 'tritone', 'trítono', 'tritono', 'unison', 'uníssono', 'unísono', 'interval', 'intervalo',
];
const ORDINAL_NUMBER = /(?<![\p{L}\p{N}])\d+(?:st|nd|rd|th|\.?[ªº])(?![\p{L}\p{N}])/u;

export type Answer =
  | { kind: 'note'; natural: string; accidental: string }
  | { kind: 'interval' }
  | { kind: 'key'; natural: string; accidental: string; letters: Set<string> };

/** Why a description gives its answer away, or null. */
export function leakOf(description: string, answer: Answer): string | null {
  const tks = tokens(description);
  if (answer.kind === 'note' || answer.kind === 'interval') {
    const letter = tks.find((tk) => NOTE_TOKEN.test(tk));
    if (letter) return `names a note: "${letter}"`;
    const syllable = tks.find(isSolfegeToken);
    if (syllable) return `names a note in Dó-Ré-Mi: "${syllable}"`;
  }
  if (answer.kind === 'interval') {
    const word = INTERVAL_WORDS.find((w) => wordIn(description, w));
    if (word) return `holds the interval word "${word}"`;
    const ord = ORDINAL_NUMBER.exec(description);
    if (ord) return `holds the ordinal "${ord[0]}"`;
  }
  if (answer.kind === 'key') {
    const { natural, accidental } = answer;
    const tonic = [`${natural}${accidental}`, `${natural}${GLYPH[accidental]}`];
    for (const l of ['pt', 'es'] as const) tonic.push(`${SOLFEGE[l][natural as 'C']}${GLYPH[accidental]}`, `${SOLFEGE[l][natural as 'C']}${accidental}`);
    const hit = tks.find((tk) => tonic.includes(tk));
    if (hit) return `names the tonic: "${hit}"`;
    for (const name of [natural, SOLFEGE.pt[natural as 'C'], SOLFEGE.es[natural as 'C']]) {
      for (const w of ACC_WORDS[accidental]) if (new RegExp(`(?<![\\p{L}])${name}\\s+${w}(?![\\p{L}])`, 'u').test(description)) return `names the tonic: "${name} ${w}"`;
    }
    const mode = ['major', 'maior', 'mayor', 'minor', 'menor'].find((w) => wordIn(description, w));
    if (mode) return `holds "${mode}"`;
    const syllable = tks.find(isSolfegeToken);
    if (syllable) return `names a note in Dó-Ré-Mi: "${syllable}"`;
    const stray = tks.find((tk) => NOTE_TOKEN.test(tk) && !answer.letters.has(tk));
    if (stray) return `names "${stray}", which no accidental of the signature stands on`;
  }
  return null;
}

// ─── The corpus ────────────────────────────────────────────────────────────

interface StaffCase { item: CorpusItem; description: string; answer: Answer; answers: string[] }

/** The keyed answer's words, per language, for one id (the check shows that language's). */
function keyedLabels(): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const lang of CONTENT_LANGS) {
    for (const n of LEVELS) {
      for (const it of levelCorpus(n, lang)) {
        const label = choicesForExercise(it.exercise, tFor(lang)).filter((c) => c.correct).map((c) => c.label);
        out.set(it.exercise.id, [...(out.get(it.exercise.id) ?? []), ...label.map((l) => `${lang}:${l}`)]);
      }
    }
  }
  return out;
}

const cases: StaffCase[] = [];
const rhythms: { item: CorpusItem; description: string }[] = [];
const melodies: CorpusItem[] = [];
let labels: Map<string, string[]>;

beforeAll(() => {
  labels = keyedLabels();
  for (const lang of CONTENT_LANGS) {
    for (const n of LEVELS) {
      for (const item of levelCorpus(n, lang)) {
        const cfg = item.exercise.config;
        if (cfg.type === 'multiple_choice' && cfg.rhythm) rhythms.push({ item, description: describeRhythm(cfg.rhythm, tFor(lang)) });
        if (cfg.type === 'ear_training' && cfg.mode === 'melody') melodies.push(item);
        const staff = exerciseStaff(cfg);
        if (!staff) continue;
        const plan = staffPlan(staff.notes, staff.clef, 'piano', false);
        const description = describeStaff({ notes: plan.written, clef: plan.clef, keySignature: staff.keySignature, chord: staff.chord }, tFor(lang), lang);
        let answer: Answer;
        if (cfg.type === 'note_id') answer = { kind: 'note', natural: cfg.note, accidental: cfg.accidental };
        else if (cfg.type === 'interval_id') answer = { kind: 'interval' };
        else {
          const en = labels.get(item.exercise.id)!.find((l) => l.startsWith('en:'))!.slice(3);
          const m = /^([A-G])(#|b)? major$/.exec(en);
          if (!m) throw new Error(`${item.exercise.id}: a staff question whose answer is not a major key ("${en}") — teach this test its answer`);
          const marks = keySignatureMarks(staff.keySignature ?? 'C', plan.clef) ?? [];
          answer = { kind: 'key', natural: m[1], accidental: m[2] ?? '', letters: new Set(marks.map((mk) => mk.letter)) };
        }
        cases.push({ item, description, answer, answers: labels.get(item.exercise.id) ?? [] });
      }
    }
  }
});

describe('the detector fires on planted leaks (known positives)', () => {
  const g = { kind: 'note', natural: 'G', accidental: '' } as const;
  const fs = { kind: 'note', natural: 'F', accidental: '#' } as const;
  const dMajor = { kind: 'key', natural: 'D', accidental: '', letters: new Set(['F', 'C']) } as const;
  const fsMajor = { kind: 'key', natural: 'F', accidental: '#', letters: new Set(['F', 'C', 'G', 'D', 'A', 'E']) } as const;
  it.each([
    ['Treble clef. One note, the G, on line 2.', g, 'names a note: "G"'],
    ['Treble clef. One note, G4.', g, 'names a note: "G4"'],
    ['Clave de sol. Uma nota (Sol), na linha 2.', g, 'names a note in Dó-Ré-Mi: "Sol"'],
    ['Clave de sol. Una nota, Fa♯.', fs, 'names a note in Dó-Ré-Mi: "Fa♯"'],
    ['Treble clef. One note, F♯.', fs, 'names a note: "F♯"'],
    ['Treble clef. 2 notes: on the second line, then on the third line.', { kind: 'interval' }, 'holds the interval word "second"'],
    ['Treble clef. 2 notes, a 3rd apart.', { kind: 'interval' }, 'holds the ordinal "3rd"'],
    ['Clave de sol. 2 notas, à distância de uma 3.ª.', { kind: 'interval' }, 'holds the ordinal "3.ª"'],
    ['Clave de sol. 2 notas, a un semitono.', { kind: 'interval' }, 'holds the interval word "semitono"'],
    ['Clave de sol. 2 notas, a meio-tom.', { kind: 'interval' }, 'holds the interval word "meio-tom"'],
    ['Treble clef, 2 sharps: D major.', dMajor, 'names the tonic: "D"'],
    ['Clave de sol, 2 sustenidos: Ré maior.', dMajor, 'names the tonic: "Ré"'],
    ['Treble clef, a major key signature: on the F line.', dMajor, 'holds "major"'],
    ['Treble clef, 2 sharps: on the F line, the C space and the G space.', dMajor, 'names "G", which no accidental of the signature stands on'],
    ['Treble clef, 6 sharps: the key of F sharp.', fsMajor, 'names the tonic: "F sharp"'],
    ['Clave de sol, 6 sostenidos: Fa♯.', fsMajor, 'names the tonic: "Fa♯"'],
  ] as const)('%s', (text, answer, reason) => {
    expect(leakOf(text, answer as Answer)).toBe(reason);
  });

  it('…and passes the honest words', () => {
    expect(leakOf('Treble clef. One note, on line 2. Lines and spaces are counted from the bottom.', g)).toBeNull();
    expect(leakOf('Clave de sol. Uma nota, na linha 2. As linhas e os espaços contam-se de baixo para cima.', g)).toBeNull();
    expect(leakOf('Treble clef, 6 sharps in the key signature: on the F line, in the C space, in the G space above the staff, on the D line, in the A space and in the E space.', fsMajor)).toBeNull();
  });
});

describe('VexFlow is the oracle: the description says where it draws', () => {
  it('its anchors: E4 on the treble staff\'s bottom line, G2 on the bass staff\'s, both VexFlow line 1', () => {
    expect(Tables.keyProperties('e/4', 'treble').line).toBe(1);
    expect(Tables.keyProperties('g/2', 'bass').line).toBe(1);
    expect(Tables.keyProperties('f/5', 'treble').line).toBe(5);
  });

  it('every key signature the drawing takes (15 major, 15 minor names), treble and bass: the same accidentals on the same lines as VexFlow draws them', () => {
    const SPECS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb',
      'Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm', 'Abm'];
    for (const spec of SPECS) {
      const vf = Tables.keySignature(spec);
      const type = (vf[0]?.type ?? '#') as '#' | 'b';
      const count = vf.length;
      expect(keySignatureMarks(spec, 'treble')?.length, spec).toBe(count);
      expect(vf.every((a: { type: string }) => a.type === type), spec).toBe(true);
      expect(vf.map((a: { line: number }) => a.line), spec).toEqual(KEY_SIGNATURE_LINES[type].lines.slice(0, count));
      for (const clef of ['treble', 'bass'] as const) {
        const list = vf.map((a: { type: string; line: number }) => ({ ...a }));
        // convertAccLines is protected in VexFlow's types; it is what the drawing calls for the clef.
        (new VF.KeySignature(spec) as unknown as { convertAccLines: (c: string, t: string, l: unknown[]) => void }).convertAccLines(clef, type, list);
        const marks = keySignatureMarks(spec, clef)!;
        expect(marks.map((m) => m.pos), `${spec} ${clef}`).toEqual(list.map((a: { line: number }) => (4 - a.line) * 2));
        // Each accidental stands on the line or space of its own letter.
        const bottom = clef === 'treble' ? 30 : 18;
        expect(marks.map((m) => 'CDEFGAB'[(bottom + m.pos) % 7]), `${spec} ${clef}`).toEqual(marks.map((m) => m.letter));
      }
    }
  });

  it('every notehead of every served question staff: the position described is the one VexFlow places', () => {
    let notes = 0;
    for (const c of cases) {
      const staff = exerciseStaff(c.item.exercise.config)!;
      const plan = staffPlan(staff.notes, staff.clef, 'piano', false);
      plan.written.forEach((n, i) => {
        notes++;
        const vfLine = Tables.keyProperties(plan.keys[i], plan.clef).line;
        expect(staffPosition(n, plan.clef), `${c.item.exercise.id} ${plan.keys[i]}`).toBe((vfLine - 1) * 2);
      });
    }
    expect(notes).toBeGreaterThan(300);
  });
});

describe('every served question with a staff has a description that never holds its answer', () => {
  it('found: the nine the audit named, and every other one (counted per language)', () => {
    const count = (lang: string, type: string) => cases.filter((c) => c.item.lang === lang && c.item.exercise.config.type === type).length;
    for (const lang of CONTENT_LANGS) {
      // Today 21 note ID, 41 interval ID, 6 key signatures per language (all authored or generated items that draw a staff).
      expect(count(lang, 'note_id'), lang).toBeGreaterThanOrEqual(21);
      expect(count(lang, 'interval_id'), lang).toBeGreaterThanOrEqual(41);
      expect(count(lang, 'multiple_choice'), lang).toBeGreaterThanOrEqual(6);
      const ids = new Set(cases.filter((c) => c.item.lang === lang).map((c) => c.item.exercise.id));
      // The audit's nine (inferred from its description: six key signatures in L1–L2, three note readings with no position in the prompt).
      for (const id of ['l1u3m2g1', 'l1u3m2g2', 'l1u3m2g3', 'l1u3m2g4', 'l2u4m1g1', 'l2u4m1g2', 'l1u1m1g3', 'l1u1m1g4', 'l1u1m1g5']) expect(ids.has(id), `${lang} ${id}`).toBe(true);
    }
    expect(rhythms.length).toBeGreaterThanOrEqual(36);
    expect(melodies.length).toBeGreaterThanOrEqual(27);
  });

  it('each starts with its clef, by the lessons\' name, in its own language', () => {
    for (const c of cases) {
      const t = tFor(c.item.lang);
      const staff = exerciseStaff(c.item.exercise.config)!;
      const clef = t(staff.clef === 'bass' ? 'lesson.bassClef' : 'lesson.trebleClef');
      expect(c.description.startsWith(`${clef}${staff.keySignature !== undefined ? ',' : '.'}`), `${c.item.lang} ${c.item.exercise.id}: ${c.description}`).toBe(true);
    }
  });

  it('none holds its answer — letters, Dó-Ré-Mi, the interval words, the key — in any of the three languages', () => {
    const leaks = cases
      .map((c) => ({ c, why: leakOf(c.description, c.answer) }))
      .filter((x) => x.why)
      .map((x) => `${x.c.item.lang} ${x.c.item.exercise.id}: ${x.why} — "${x.c.description}"`);
    expect(leaks).toEqual([]);
    // And no answer as served in any language, by the app's own exact matcher.
    const exact = cases.flatMap((c) => c.answers.filter((a) => exactLeak(c.description, a.slice(3), a.slice(0, 2) as 'en')).map((a) => `${c.item.lang} ${c.item.exercise.id}: ${a}`));
    expect(exact).toEqual([]);
  });

  it('the key signatures say how many and where; the notes say where, with the accidental printed', () => {
    const d = (lang: string, id: string) => cases.find((c) => c.item.lang === lang && c.item.exercise.id === id)!.description;
    expect(d('en', 'l2u4m1g2')).toBe('Treble clef, 6 sharps in the key signature: on the F line, in the C space, in the G space above the staff, on the D line, in the A space and in the E space.');
    expect(d('en', 'l1u3m2g1')).toBe('Treble clef, one flat in the key signature: on the B line.');
    expect(d('en', 'l1u3m2g2')).toBe('Treble clef, no sharps or flats in the key signature.');
    expect(d('pt', 'l1u3m2g1')).toBe('Clave de sol, um bemol na armação de clave: na linha do B.');
    expect(d('es', 'l2u4m1g1')).toBe('Clave de sol, 5 sostenidos en la armadura de clave: en la línea del F, en el espacio del C, en el espacio del G por encima del pentagrama, en la línea del D y en el espacio del A.');
    expect(d('en', 'l1u1m1e1')).toBe('Treble clef. One note, on ledger line 1 below the staff. Ledger lines are counted outwards from the staff.');
    expect(d('en', 'l1u1m2e1')).toBe('Treble clef. One note, on ledger line 2 below the staff. Ledger lines are counted outwards from the staff.');
    expect(d('en', 'l1u1m2g5')).toBe('Treble clef. One note, in the space below ledger line 2, under the staff. Ledger lines are counted outwards from the staff.');
    expect(d('en', 'l1u1m2g3')).toBe('Bass clef. One note, in the space above ledger line 1, over the staff. Ledger lines are counted outwards from the staff.');
    expect(d('en', 'l1u1m4g1')).toBe('Treble clef. One note, in the space just below the staff, with a flat.');
    expect(d('pt', 'l1u1m4e1')).toBe('Clave de sol. Uma nota, no espaço 1, com um sustenido. As linhas e os espaços da pauta contam-se de baixo para cima.');
    expect(d('es', 'l1u1m2e2')).toBe('Clave de sol. Una nota, en la línea adicional 2 por encima del pentagrama. Las líneas adicionales se cuentan desde el pentagrama hacia fuera.');
    expect(d('en', 'l2u7m2g3')).toBe('Treble clef. 2 notes, one after the other: in the space just below the staff, then in the space above ledger line 1, over the staff. Ledger lines are counted outwards from the staff.');
  });


  it('a rhythm question: its staff\'s text alternative holds none of its answer (the app\'s leak detector, every language)', () => {
    const found: string[] = [];
    for (const { item, description } of rhythms) {
      const cfg = item.exercise.config as { choices: { label: string; correct: boolean }[] };
      const answer = cfg.choices.find((c) => c.correct)!.label;
      const why = answerLeak({ lang: item.lang, prompt: item.exercise.prompt, hint: description, answer, others: cfg.choices.filter((c) => !c.correct).map((c) => c.label) });
      if (why) found.push(`${item.lang} ${item.exercise.id}: ${why}`);
      for (const other of labels.get(item.exercise.id) ?? []) if (exactLeak(description, other.slice(3), other.slice(0, 2) as 'en')) found.push(`${item.lang} ${item.exercise.id}: ${other}`);
    }
    expect(found).toEqual([]);
  });

  it('a melody question: every option staff is named by its notes (ChoiceInput\'s name), in its language', () => {
    for (const item of melodies) {
      const t = tFor(item.lang);
      for (const opt of choicesForExercise(item.exercise, t)) {
        const name = t('exercise.melodyOption', { letter: opt.label, notes: optionText(opt) });
        expect(name, `${item.lang} ${item.exercise.id}`).toContain(optionText(opt));
        expect(optionText(opt).split(' ').length).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
