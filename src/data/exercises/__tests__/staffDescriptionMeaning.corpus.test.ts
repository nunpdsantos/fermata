/**
 * What the staff descriptions MEAN (audit A9, review of e92e44e): each one,
 * in EN, PT and ES, is read back by a small reader of that language — its own
 * words, written here by hand, not the app's word files — into the clef, the
 * key signature's marks, each note's place and the accidental printed before
 * it, and how the numbers are said to be counted. That reading is compared
 * with the staff worked out from the notes themselves: a note's place from
 * its letter and WRITTEN octave (E4 = the treble staff's bottom line, G2 the
 * bass staff's; one step per letter), never from VexFlow or the describer;
 * a key signature's marks from the standard written pitches of its sharps or
 * flats; what is printed from the drawing's own `vexAccidentals` (served
 * questions) or written out by hand (the cases below).
 *
 * So a word that says the wrong thing in one language — "acima" for a note
 * below the staff, "bemol" for a natural sign — fails here even when every
 * other check passes (the review planted exactly those two).
 *
 * The served questions (every one that draws a staff, three languages) and,
 * because none of them reaches them yet, stimuli of every kind the drawing
 * takes: an accidental cancelled or repeated on one line with no key
 * signature, a minor key's signature, notes under a signature (a natural, a
 * flat it does not supply), a chord, double sharps and flats, ledger lines
 * with and without staff lines, a bass signature down to its flat below the
 * staff.
 */
import { describe, it, expect } from 'vitest';
import type { TFunction } from 'i18next';
import i18n from '../../../i18n';
import { CONTENT_LANGS, LEVELS, levelCorpus } from './learnCorpus';
import { exerciseStaff } from '../../../components/learn/exercises/exerciseStaff';
import { staffPlan, vexAccidentals } from '../../../utils/notationHelpers';
import { describeStaff } from '../../../components/notation/staffDescription';
import type { PitchedNote } from '../../../core/types/music';

type Lang = 'en' | 'pt' | 'es';
type Clef = 'treble' | 'bass';
type Acc = '#' | 'b' | '##' | 'bb' | 'n' | null;
type Where = 'line' | 'space' | 'above' | 'below';

// ─── The independent staff ─────────────────────────────────────────────────

const LETTER = 'CDEFGAB';
const BOTTOM: Record<Clef, number> = { treble: 2 + 7 * 4, bass: 4 + 7 * 2 }; // E4, G2
/** A written pitch's place: steps above the bottom line. */
const placeOf = (letter: string, writtenOctave: number, clef: Clef) => LETTER.indexOf(letter) + 7 * writtenOctave - BOTTOM[clef];
/** The octave a note is WRITTEN in: C♭ is written an octave above the B it sounds, B♯ below the C. */
const writtenOctaveOf = (n: PitchedNote) =>
  n.octave + (n.natural === 'C' && n.accidental.startsWith('b') ? 1 : 0) - (n.natural === 'B' && n.accidental.startsWith('#') ? 1 : 0);

/** The sharps and flats of each key name the drawing takes, by hand (minor keys by their relative major). */
const MAJOR_SIG: Record<string, [type: '#' | 'b', count: number]> = {
  C: ['#', 0], G: ['#', 1], D: ['#', 2], A: ['#', 3], E: ['#', 4], B: ['#', 5], 'F#': ['#', 6], 'C#': ['#', 7],
  F: ['b', 1], Bb: ['b', 2], Eb: ['b', 3], Ab: ['b', 4], Db: ['b', 5], Gb: ['b', 6], Cb: ['b', 7],
};
const RELATIVE_MAJOR: Record<string, string> = {
  Am: 'C', Em: 'G', Bm: 'D', 'F#m': 'A', 'C#m': 'E', 'G#m': 'B', 'D#m': 'F#', 'A#m': 'C#',
  Dm: 'F', Gm: 'Bb', Cm: 'Eb', Fm: 'Ab', Bbm: 'Db', Ebm: 'Gb', Abm: 'Cb',
};
/** Where each sharp and flat is written in the treble clef (the standard engraving); the bass clef writes them two octaves lower. */
const WRITTEN = { '#': ['F5', 'C5', 'G5', 'D5', 'A4', 'E5', 'B4'], b: ['B4', 'E5', 'A4', 'D5', 'G4', 'C5', 'F4'] } as const;
const whereOf = (pos: number): Where => (pos === 9 ? 'above' : pos === -1 ? 'below' : pos % 2 === 0 ? 'line' : 'space');

function expectedSignature(spec: string, clef: Clef) {
  const [type, count] = MAJOR_SIG[RELATIVE_MAJOR[spec] ?? spec];
  return {
    type,
    marks: WRITTEN[type].slice(0, count).map((p) => {
      const pos = placeOf(p[0], Number(p[1]) - (clef === 'bass' ? 2 : 0), clef);
      return { letter: p[0], where: whereOf(pos) };
    }),
  };
}

interface Staff { clef: Clef; keySignature?: string; chord?: boolean; notes: PitchedNote[]; printed: Acc[] }

function expectedReading(staff: Staff) {
  const order = staff.notes.map((n, i) => ({ pos: placeOf(n.natural, writtenOctaveOf(n), staff.clef), acc: staff.printed[i] }));
  if (staff.chord) order.sort((a, b) => a.pos - b.pos);
  return {
    clef: staff.clef,
    signature: staff.keySignature === undefined ? null : expectedSignature(staff.keySignature, staff.clef),
    notes: order,
    chord: !!staff.chord && staff.notes.length > 1,
    countedStaff: order.some((o) => o.pos >= 0 && o.pos <= 8),
    countedLedger: order.some((o) => o.pos <= -2 || o.pos >= 10),
  };
}

// ─── The readers, one per language (their own words) ──────────────────────

interface Reader {
  clefs: Record<string, Clef>;
  noSignature: string;
  signature: RegExp; // count word, sharp/flat word, places
  one: string[];
  sharpWords: string[];
  signaturePlaces: [RegExp, Where][];
  listSplit: RegExp;
  oneNote: RegExp;
  inOrder: RegExp;
  chord: RegExp;
  places: [string, (n: number) => number][]; // a regexp source with (\d) where the number is
  accidentals: [string, Acc][];
  countedStaff: string;
  countedLedger: string;
}

const READERS: Record<Lang, Reader> = {
  en: {
    clefs: { 'Treble clef': 'treble', 'Bass clef': 'bass' },
    noSignature: 'no sharps or flats in the key signature',
    signature: /^(one|\d+) (sharps?|flats?) in the key signature: (.+)$/,
    one: ['one'], sharpWords: ['sharp', 'sharps'],
    signaturePlaces: [[/^on the ([A-G]) line$/, 'line'], [/^in the ([A-G]) space above the staff$/, 'above'], [/^in the ([A-G]) space below the staff$/, 'below'], [/^in the ([A-G]) space$/, 'space']],
    listSplit: /, | and /,
    oneNote: /^One note, (.+)\.$/, inOrder: /^(\d+) notes, one after the other: (.+)\.$/, chord: /^(\d+) notes stacked as one chord, from the lowest: (.+)\.$/,
    places: [
      ['on line (\\d)', (n) => 2 * n - 2], ['in space (\\d)', (n) => 2 * n - 1],
      ['in the space just below the staff', () => -1], ['in the space just above the staff', () => 9],
      ['on ledger line (\\d) below the staff', (n) => -2 * n], ['on ledger line (\\d) above the staff', (n) => 8 + 2 * n],
      ['in the space below ledger line (\\d), under the staff', (n) => -2 * n - 1], ['in the space above ledger line (\\d), over the staff', (n) => 9 + 2 * n],
    ],
    accidentals: [['with a double sharp', '##'], ['with a double flat', 'bb'], ['with a sharp', '#'], ['with a flat', 'b'], ['with a natural sign', 'n']],
    countedStaff: "The staff's lines and spaces are counted from the bottom.",
    countedLedger: 'Ledger lines are counted outwards from the staff.',
  },
  pt: {
    clefs: { 'Clave de sol': 'treble', 'Clave de fá': 'bass' },
    noSignature: 'sem sustenidos nem bemóis na armação de clave',
    signature: /^(um|\d+) (sustenidos?|bemol|bemóis) na armação de clave: (.+)$/,
    one: ['um'], sharpWords: ['sustenido', 'sustenidos'],
    signaturePlaces: [[/^na linha do ([A-G])$/, 'line'], [/^no espaço do ([A-G]) acima da pauta$/, 'above'], [/^no espaço do ([A-G]) abaixo da pauta$/, 'below'], [/^no espaço do ([A-G])$/, 'space']],
    listSplit: /, | e /,
    oneNote: /^Uma nota, (.+)\.$/, inOrder: /^(\d+) notas, uma depois da outra: (.+)\.$/, chord: /^(\d+) notas sobrepostas num só acorde, da mais grave para a mais aguda: (.+)\.$/,
    places: [
      ['na linha (\\d)', (n) => 2 * n - 2], ['no espaço (\\d)', (n) => 2 * n - 1],
      ['no espaço logo abaixo da pauta', () => -1], ['no espaço logo acima da pauta', () => 9],
      ['na linha suplementar (\\d) abaixo da pauta', (n) => -2 * n], ['na linha suplementar (\\d) acima da pauta', (n) => 8 + 2 * n],
      ['no espaço abaixo da linha suplementar (\\d), sob a pauta', (n) => -2 * n - 1], ['no espaço acima da linha suplementar (\\d), sobre a pauta', (n) => 9 + 2 * n],
    ],
    accidentals: [['com um duplo sustenido', '##'], ['com um duplo bemol', 'bb'], ['com um sustenido', '#'], ['com um bemol', 'b'], ['com um bequadro', 'n']],
    countedStaff: 'As linhas e os espaços da pauta contam-se de baixo para cima.',
    countedLedger: 'As linhas suplementares contam-se a partir da pauta, para fora.',
  },
  es: {
    clefs: { 'Clave de sol': 'treble', 'Clave de fa': 'bass' },
    noSignature: 'sin sostenidos ni bemoles en la armadura de clave',
    signature: /^(un|\d+) (sostenidos?|bemol|bemoles) en la armadura de clave: (.+)$/,
    one: ['un'], sharpWords: ['sostenido', 'sostenidos'],
    signaturePlaces: [[/^en la línea del ([A-G])$/, 'line'], [/^en el espacio del ([A-G]) por encima del pentagrama$/, 'above'], [/^en el espacio del ([A-G]) por debajo del pentagrama$/, 'below'], [/^en el espacio del ([A-G])$/, 'space']],
    listSplit: /, | y /,
    oneNote: /^Una nota, (.+)\.$/, inOrder: /^(\d+) notas, una después de otra: (.+)\.$/, chord: /^(\d+) notas superpuestas en un solo acorde, de la más grave a la más aguda: (.+)\.$/,
    places: [
      ['en la línea (\\d)', (n) => 2 * n - 2], ['en el espacio (\\d)', (n) => 2 * n - 1],
      ['en el espacio justo debajo del pentagrama', () => -1], ['en el espacio justo encima del pentagrama', () => 9],
      ['en la línea adicional (\\d) por debajo del pentagrama', (n) => -2 * n], ['en la línea adicional (\\d) por encima del pentagrama', (n) => 8 + 2 * n],
      ['en el espacio debajo de la línea adicional (\\d), bajo el pentagrama', (n) => -2 * n - 1], ['en el espacio encima de la línea adicional (\\d), sobre el pentagrama', (n) => 9 + 2 * n],
    ],
    accidentals: [['con un doble sostenido', '##'], ['con un doble bemol', 'bb'], ['con un sostenido', '#'], ['con un bemol', 'b'], ['con un becuadro', 'n']],
    countedStaff: 'Las líneas y los espacios del pentagrama se cuentan de abajo arriba.',
    countedLedger: 'Las líneas adicionales se cuentan desde el pentagrama hacia fuera.',
  },
};

/** Read a description back. Throws on any word the reader does not know, so nothing is skipped. */
export function readBack(description: string, lang: Lang) {
  const r = READERS[lang];
  let rest = description;
  const take = (sentence: string) => {
    if (!rest.endsWith(sentence)) return false;
    rest = rest.slice(0, -sentence.length).trimEnd();
    return true;
  };
  const countedLedger = take(r.countedLedger);
  const countedStaff = take(r.countedStaff);
  // The first sentence: the clef, then ", <signature>." or ".".
  const clefName = Object.keys(r.clefs).find((c) => rest.startsWith(c));
  if (!clefName) throw new Error(`no clef: "${description}"`);
  rest = rest.slice(clefName.length);
  let signature: ReturnType<typeof expectedSignature> | null = null;
  let notesPart = '';
  if (rest.startsWith(', ')) {
    const end = rest.indexOf('.');
    const sig = rest.slice(2, end);
    notesPart = rest.slice(end + 1).trim();
    if (sig === r.noSignature) signature = { type: '#', marks: [] };
    else {
      const m = r.signature.exec(sig);
      if (!m) throw new Error(`unread signature: "${sig}"`);
      const count = r.one.includes(m[1]) ? 1 : Number(m[1]);
      const type = r.sharpWords.includes(m[2]) ? '#' : 'b';
      const marks = m[3].split(r.listSplit).map((item) => {
        const hit = r.signaturePlaces.map(([re, where]) => [re.exec(item), where] as const).find(([mm]) => mm);
        if (!hit) throw new Error(`unread signature place: "${item}"`);
        return { letter: hit[0]![1], where: hit[1] };
      });
      if (marks.length !== count) throw new Error(`${count} said, ${marks.length} placed: "${sig}"`);
      signature = { type, marks };
    }
  } else if (rest.startsWith('.')) {
    notesPart = rest.slice(1).trim();
  } else throw new Error(`after the clef: "${rest}"`);

  const notes: { pos: number; acc: Acc }[] = [];
  let chord = false;
  if (notesPart) {
    let body: string;
    let said = 1;
    const one = r.oneNote.exec(notesPart);
    const order = r.inOrder.exec(notesPart);
    const stacked = r.chord.exec(notesPart);
    if (one) body = one[1];
    else if (order) [said, body] = [Number(order[1]), order[2]];
    else if (stacked) [said, body, chord] = [Number(stacked[1]), stacked[2], true];
    else throw new Error(`unread notes: "${notesPart}"`);
    const place = r.places.map(([src]) => `(?:${src})`).join('|');
    const acc = r.accidentals.map(([src]) => src).join('|');
    const re = new RegExp(`(${place})(?:, (?<acc>${acc}))?`, 'g');
    let consumed = '';
    for (const m of body.matchAll(re)) {
      const phrase = m[1];
      const [, toPos] = r.places.find(([src]) => new RegExp(`^${src}$`).test(phrase))!;
      const num = /(\d)/.exec(phrase);
      const word = m.groups?.acc;
      notes.push({ pos: toPos(num ? Number(num[1]) : 0), acc: word ? r.accidentals.find(([w]) => w === word)![1] : null });
      consumed += m[0];
    }
    if (notes.length !== said) throw new Error(`${said} notes said, ${notes.length} read: "${notesPart}"`);
    // Everything in the body was read (only joiners left over).
    const leftover = body.replace(re, '').replace(/, then |, depois |, después |, | and | e | y /g, '');
    if (leftover.trim()) throw new Error(`unread words "${leftover.trim()}" in "${body}"`);
    void consumed;
  }
  return { clef: r.clefs[clefName], signature, notes, chord, countedStaff, countedLedger };
}

const tFor = (lang: Lang) => i18n.getFixedT(lang) as TFunction;
const parse = (s: string): PitchedNote => {
  const m = /^([A-G])(##|bb|#|b)?(-?\d)$/.exec(s)!;
  // As the exercise staff reads a written pitch: C♭4 sounds B3 (octave 3), B♯3 sounds C4.
  const acc = (m[2] ?? '') as PitchedNote['accidental'];
  const written = Number(m[3]);
  const octave = written + (m[1] === 'C' && acc.startsWith('b') ? -1 : 0) + (m[1] === 'B' && acc.startsWith('#') ? 1 : 0);
  return { natural: m[1] as PitchedNote['natural'], accidental: acc, octave };
};

// ─── The served questions ───────────────────────────────────────────────────

describe('what each served staff description means, read back in its own language', () => {
  it('EN, PT and ES: the clef, the key signature, every note\'s place and printed accidental, how the numbers count — all as worked out from the notes', () => {
    const wrong: string[] = [];
    let n = 0;
    for (const lang of CONTENT_LANGS) {
      for (const level of LEVELS) {
        for (const item of levelCorpus(level, lang)) {
          const staff = exerciseStaff(item.exercise.config);
          if (!staff) continue;
          const plan = staffPlan(staff.notes, staff.clef, 'piano', false);
          const described = describeStaff({ notes: plan.written, clef: plan.clef, keySignature: staff.keySignature, chord: staff.chord }, tFor(lang), lang);
          const want = expectedReading({ clef: plan.clef, keySignature: staff.keySignature, chord: staff.chord, notes: plan.written, printed: vexAccidentals(plan.written, staff.keySignature) });
          let got;
          try {
            got = readBack(described, lang);
          } catch (e) {
            wrong.push(`${lang} ${item.exercise.id}: ${(e as Error).message}`);
            continue;
          }
          n++;
          if (JSON.stringify(got) !== JSON.stringify(want)) wrong.push(`${lang} ${item.exercise.id}: "${described}" reads ${JSON.stringify(got)}, the staff is ${JSON.stringify(want)}`);
        }
      }
    }
    expect(wrong).toEqual([]);
    expect(n).toBeGreaterThanOrEqual(204);
  });
});

// ─── Every kind the drawing takes, beyond the served questions ─────────────

const CASES: (Omit<Staff, 'notes'> & { name: string; notes: string[] })[] = [
  { name: 'F♯4 then F4, no key signature: a sharp, then a natural', clef: 'treble', notes: ['F#4', 'F4'], printed: ['#', 'n'] },
  { name: 'F♯4 twice, no key signature: one sharp only', clef: 'treble', notes: ['F#4', 'F#4'], printed: ['#', null] },
  { name: 'B♭4, B4, B♭4 on one line: flat, natural, flat', clef: 'treble', notes: ['Bb4', 'B4', 'Bb4'], printed: ['b', 'n', 'b'] },
  { name: 'C minor and E4: three flats, then a natural', clef: 'treble', keySignature: 'Cm', notes: ['E4'], printed: ['n'] },
  { name: 'A minor: no sharps or flats', clef: 'treble', keySignature: 'Am', notes: [], printed: [] },
  { name: 'F♯ minor and G♯4: three sharps, nothing printed', clef: 'treble', keySignature: 'F#m', notes: ['G#4'], printed: [null] },
  { name: 'B♭ minor in the bass clef: five flats', clef: 'bass', keySignature: 'Bbm', notes: [], printed: [] },
  { name: 'C♭ major in the bass clef: seven flats, the last below the staff', clef: 'bass', keySignature: 'Cb', notes: [], printed: [] },
  { name: 'D major with F♯4 F4 C♯5 B♭4: nothing, natural, nothing, flat', clef: 'treble', keySignature: 'D', notes: ['F#4', 'F4', 'C#5', 'Bb4'], printed: [null, 'n', null, 'b'] },
  { name: 'a chord written top down: read from the lowest', clef: 'treble', chord: true, notes: ['G4', 'C4', 'E4'], printed: [null, null, null] },
  { name: 'double sharp and double flat', clef: 'treble', notes: ['C##4', 'Ebb4'], printed: ['##', 'bb'] },
  { name: 'a ledger line and a staff line: both ways of counting said', clef: 'treble', notes: ['C4', 'E4'], printed: [null, null] },
  { name: 'ledger lines only: only the outward count said', clef: 'treble', notes: ['C6', 'A3'], printed: [null, null] },
  { name: 'the spaces just outside both staves, and beside ledger lines', clef: 'bass', notes: ['F2', 'B3', 'D4', 'D2'], printed: [null, null, null, null] },
  { name: 'C♭4 (written on the ledger line, it sounds B3) with its flat', clef: 'treble', notes: ['Cb4'], printed: ['b'] },
];

describe('every kind of stimulus the drawing takes, read back in EN, PT and ES', () => {
  for (const c of CASES) {
    it(c.name, () => {
      const notes = c.notes.map(parse);
      const staff = { ...c, notes };
      // The drawing prints exactly what is written out above (its own function, checked here too).
      expect(vexAccidentals(notes, c.keySignature ?? null)).toEqual(c.printed);
      const want = expectedReading(staff);
      for (const lang of ['en', 'pt', 'es'] as const) {
        const described = describeStaff({ notes, clef: c.clef, keySignature: c.keySignature, chord: c.chord }, tFor(lang), lang);
        expect(readBack(described, lang), `${lang}: "${described}"`).toEqual(want);
      }
    });
  }

  it('the reader knows its words: it refuses a description with a word it does not know', () => {
    expect(() => readBack('Treble clef. One note, on the second line.', 'en')).toThrow(/unread notes|0 read/);
    expect(() => readBack('Clave de sol. Uma nota, na linha 2, com um sinal.', 'pt')).toThrow(/unread words/);
  });
});
