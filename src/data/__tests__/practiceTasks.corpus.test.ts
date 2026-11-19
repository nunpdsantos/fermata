/**
 * The practice tasks under "On your piano / guitar" (audit Q5, 18 November
 * 2026), read in English, Portuguese and Spanish.
 *
 *  1. Nothing is typed. A quoted query in a task ('C major scale') is drawn
 *     as a button the learner taps (ModuleView `renderTaskInstruction`), so
 *     no task with a quoted query may tell the learner to type, write, key in
 *     or enter it, nor to search for it. On 6de6c0e 97 English tasks said
 *     "Type '…'" (PT «Escreve» 99, ES «Escribe» 99; 14 of them in the
 *     thirteen modules skipped below).
 *  2. The tasks sit under "On your piano" or "On your guitar": a task that
 *     sends the learner to one instrument also says what to do on the other,
 *     or is listed with its reason; PT and ES name the instruments the
 *     English names; the guitar facts the rewritten tasks state, the capo
 *     task's chords and the "common tones" a task names are the engine's.
 *  4. PT and ES state the numbers, the notes (in order) and the interval
 *     abbreviations the English states, in every task of the 136 modules.
 *  3. The queries themselves are what the app runs: every task keeps its id
 *     (the saved tick is keyed by it) and the exact quoted queries, in order,
 *     that it had on 6de6c0e, in every language
 *     (`fixtures/practice-task-queries-6de6c0e.json`, recorded on 6de6c0e).
 * Each reader is shown to fire on planted sentences.
 */
import { describe, it, expect } from 'vitest';
import { findQuotedQueries } from '../../utils/theoryQuery';
import { TUNING_STANDARD, getTuningPitchClasses } from '../../core/constants/guitarTunings';
import { getPitchClass } from '../../core/constants/notes';
import { stringToNote, type Note } from '../../core/types/music';
import { buildChord } from '../../core/constants/chords';
import { chordBelowCapo } from '../../core/constants/guitarChordShapes';
import { parseChordSymbol } from '../../core/utils/chordParser';
import { EN_UNITS, curriculumOverlay, LANGS } from '../../i18n/content/__tests__/overlayEntries';
import baseline from './fixtures/practice-task-queries-6de6c0e.json';
import auditChanges from './fixtures/practice-task-queries-audit-2026-11-18.json';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Lang = 'en' | (typeof LANGS)[number];
const ALL: readonly Lang[] = ['en', ...LANGS];

/**
 * A verb of typing (type, write, key in, enter …, any person or the gerund)
 * that governs a quoted query: at most five words of the same sentence lie
 * between it and the query's opening quote ("Type 'C7'", "then type 'G7'",
 * "Try typing 'Dm7'", «Escreve "Cmaj7"», «Prueba a escribir «Dm7»»). Words
 * that only describe music ("the written note", «a nota escrita», «se
 * escriben», "a type of seventh chord") govern no query and pass.
 */
const TYPING: Record<Lang, string> = {
  en: 'type|types|typing|write|writes|writing|key in|keying in|input|enter|entering',
  pt: 'escreve|escrever|escreva|escrevendo|digita|digitar|digite|digitando|introduz|introduzir|insere|inserir',
  es: 'escribe|escribir|escriba|escribiendo|teclea|teclear|digita|digitar|introduce|introducir|ingresa|ingresar',
};
/** A verb of searching right before the query's opening quote (with "for" / «por»): "Search for 'G7'", «Pesquisa "G7"», «Busca «G7»». */
const SEARCHING: Record<Lang, string> = {
  en: 'search|searching|look up|looking up|look for',
  pt: 'pesquisa|pesquisar|procura|procurar',
  es: 'busca|buscar',
};
const WORD_BETWEEN = String.raw`[^\s.!?'"‘’“”«»]+`;
const governs = (verbs: string, between: number) =>
  new RegExp(String.raw`(?<!\p{L})(?:${verbs})(?:\s+(?:for|por))?(?:\s+${WORD_BETWEEN}){0,${between}}\s*$`, 'iu');
const TYPING_RE = Object.fromEntries(ALL.map((l) => [l, governs(TYPING[l], 5)])) as Record<Lang, RegExp>;
const SEARCHING_RE = Object.fromEntries(ALL.map((l) => [l, governs(SEARCHING[l], 0)])) as Record<Lang, RegExp>;

/** Every quoted query that a task's text tells the learner to type or search for (empty = none). */
function typingFaults(text: string, lang: Lang): string[] {
  const out: string[] = [];
  for (const q of findQuotedQueries(text)) {
    const before = text.slice(0, q.index);
    const verb = before.match(TYPING_RE[lang]) ?? before.match(SEARCHING_RE[lang]);
    if (verb) out.push(`"${verb[0].trim()}" '${q.query}'`);
  }
  return out;
}

interface Task { module: string; index: number; id: string; text: Record<Lang, string | undefined> }

function allTasks(): Task[] {
  const out: Task[] = [];
  for (let n = 1; n <= 9; n++) {
    for (const unit of EN_UNITS[n]) {
      for (const mod of unit.modules) {
        mod.tasks.forEach((t, index) => out.push({
          module: mod.id,
          index,
          id: t.id,
          text: {
            en: t.instruction,
            pt: curriculumOverlay('pt', n).modules[mod.id]?.tasks[index]?.instruction,
            es: curriculumOverlay('es', n).modules[mod.id]?.tasks[index]?.instruction,
          },
        }));
      }
    }
  }
  return out;
}

describe('practice tasks: nothing is typed (Q5)', () => {
  it('the reader fires on every planted way of typing or searching, and on nothing else', () => {
    const fires: [Lang, string][] = [
      ['en', "Type 'C major scale' and notice the steps"],
      ['en', "Open 'key of C', then type 'G7'"],
      ['en', "Try typing 'Dm7' next"],
      ['en', "Write 'Cmaj7' in the box"],
      ['en', "Enter 'C7' and listen"],
      ['en', "Search for 'D dorian'"],
      ['en', "Look up 'Bdim7' and count"],
      ['pt', 'Escreve "C major scale" e repara'],
      ['pt', 'Agora escreve «G7»'],
      ['pt', 'Experimenta escrever "Dm7"'],
      ['pt', 'Pesquisa "D dorian"'],
      ['pt', 'Procura por "Bdim7"'],
      ['pt', 'Digita "C7"'],
      ['es', 'Escribe «C major scale» y observa'],
      ['es', 'Ahora escribe "G7"'],
      ['es', 'Prueba a escribir «Dm7»'],
      ['es', 'Busca «D dorian»'],
      ['es', 'Teclea "C7"'],
    ];
    for (const [lang, text] of fires) expect(typingFaults(text, lang), `${lang}: ${text}`).not.toEqual([]);
    const passes: [Lang, string][] = [
      ['en', "Tap 'C major scale' and notice the steps"],
      ['en', "A Bb trumpet reads 'C major scale': parts are written a whole step higher"],
      ['en', "Tap 'Dm7': a type of seventh chord"],
      ['en', "Tap 'Dm7' and find the 3rd (F)"],
      ['en', 'Write I-V-I in C major in SATB on paper'],
      ['pt', 'Carrega em "C major scale" e repara: a nota escrita soa uma oitava abaixo'],
      ['pt', 'Escreve I-V-I em C maior a quatro vozes'],
      ['es', 'Pulsa «C major scale»: las partes se escriben un tono más arriba'],
      ['es', 'Pulsa "Dm7" y encuentra la 3.ª (F)'],
    ];
    for (const [lang, text] of passes) expect(typingFaults(text, lang), `${lang}: ${text}`).toEqual([]);
  });

  it.each(ALL)('%s: no task tells the learner to type, write or search for a quoted query', (lang) => {
    const faults = allTasks()
      .map((t) => [t.id, typingFaults(t.text[lang] ?? '', lang)] as const)
      .filter(([, f]) => f.length > 0)
      .map(([id, f]) => `${id}: ${f.join(', ')}`);
    expect(faults).toEqual([]);
  });
});

// ─── 2. The instrument the learner holds (Q5, figure 5) ────────────────────

/**
 * The tasks sit under "On your piano" or "On your guitar", whichever is
 * selected, and no task can differ by instrument (a task is one string). So a
 * task that sends the learner to one instrument must also say what to do on
 * the other ("on the piano …; on the guitar …", the starting tracks' way),
 * or act on the app's own instrument ("the app fretboard", "in Explore").
 */
const PIANO: Record<Lang, RegExp> = {
  en: /\b(?:piano|keyboard|white keys?|black keys?)\b/iu,
  pt: /(?<!\p{L})(?:piano|teclado|teclas?)(?!\p{L})/iu,
  es: /(?<!\p{L})(?:piano|teclado|teclas?)(?!\p{L})/iu,
};
const GUITAR: Record<Lang, RegExp> = {
  en: /\b(?:guitar|frets?|fretboard|strings?|strum|strums|strumming|capo|barre)\b/iu,
  pt: /(?<!\p{L})(?:guitarra|trastes?|cordas?|capo|pestana|braço)(?!\p{L})/iu,
  es: /(?<!\p{L})(?:guitarra|trastes?|cuerdas?|capo|cejilla|mástil|rasgueos?)(?!\p{L})/iu,
};
const ON_THE_APP: Record<Lang, RegExp> = {
  en: /\b(?:the app fretboard|in Explore)\b/u,
  pt: /(?:da aplicação|em Explorar)/u,
  es: /(?:de la aplicación|en Explorar)/u,
};
/**
 * A labelled aside for one instrument, opening a clause ("Play D, then F♯ and
 * G: on the guitar, frets 2 and 3 …", "… together; on the piano they are …",
 * "On the guitar, F♯m can be a barre"), up to the end of its sentence. The
 * task around it must stand on its own on either instrument.
 */
const ASIDE = /(?:^|(?<=[.;:]\s))[Oo]n the (?:guitar|piano)\b[^.;]*[.;]?/gu;
/**
 * True when an English task sends the learner to one instrument: judged on
 * what is left once its asides are taken out ("Play G, then strum …" is
 * caught though an aside follows) — or on the whole text when the asides are
 * all there is ("On the piano, find the group of 2 black keys …").
 */
function oneInstrument(text: string): boolean {
  const names = (s: string) => PIANO.en.test(s) || GUITAR.en.test(s);
  if (ON_THE_APP.en.test(text) || (PIANO.en.test(text) && GUITAR.en.test(text)) || !names(text)) return false;
  const rest = text.replace(ASIDE, ' ');
  return rest.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length >= 4 ? names(rest) : true;
}
/** Tasks that name one instrument and may stay so, each with its reason. */
const ONE_INSTRUMENT_ALLOWED: Readonly<Record<string, string>> = {
  l1u33m2t1: 'a lesson of the guitar-only unit, and the task says "On your guitar" (an open string stopped by fingers 1 to 4): accepted by the seat, 18 November 2026',
  l1u33m3t2: 'reading the barre marks aloud: no instrument is played',
  l9u32m5t3: 'the orchestra\'s strings, not the guitar',
};

describe('practice tasks: true on the instrument the learner holds (Q5)', () => {
  it('the reader fires on a piano-only task and a guitar-only task, and passes both ways of saying both', () => {
    expect(oneInstrument('Look at the piano keyboard — notes go from low (left) to high (right)')).toBe(true);
    expect(oneInstrument('On the piano, find the group of 2 black keys — the white key just below the group is always C')).toBe(true);
    expect(oneInstrument('Find E and F on the piano — notice there is no black key between them.')).toBe(true);
    expect(oneInstrument('Put a capo at fret 2 and play your G, D, Em and C shapes.')).toBe(true);
    expect(oneInstrument('Play the G major scale, then strum G, C and D. On the guitar, find the F♯ in your D chord: fret 2 of the thinnest string.')).toBe(true);
    expect(oneInstrument('Find E and F — on the piano there is no black key between them; on the guitar they are one fret apart.')).toBe(false);
    expect(oneInstrument('Play the G major scale, then play the chords G, C and D. On the guitar, find the F♯ in your D chord: fret 2 of the thinnest string.')).toBe(false);
    expect(oneInstrument('Play C, E and G together; on the piano they are three white keys with one white key skipped between each. Then lower E.')).toBe(false);
    expect(oneInstrument('Choose position V on the app fretboard.')).toBe(false);
    expect(oneInstrument('Play two notes simultaneously: C and E (M3).')).toBe(false);
  });

  it('EN: no task sends the learner to one instrument only, outside the listed exceptions', () => {
    const one = allTasks()
      .filter((t) => !(t.id in ONE_INSTRUMENT_ALLOWED))
      .filter((t) => oneInstrument(t.text.en!))
      .map((t) => `${t.id}: ${t.text.en}`);
    expect(one).toEqual([]);
  });

  it('every listed exception exists and still names one instrument (a stale entry fails)', () => {
    const byId = new Map(allTasks().map((t) => [t.id, t.text.en!]));
    for (const id of Object.keys(ONE_INSTRUMENT_ALLOWED)) {
      const text = byId.get(id);
      expect(text, id).toBeTypeOf('string');
      expect(oneInstrument(text!), `${id}: ${text}`).toBe(true);
    }
  });

  it.each(LANGS)('%s names the same instruments as the English in every task', (lang) => {
    const drift = allTasks()
      .filter((t) => PIANO[lang].test(t.text[lang]!) !== PIANO.en.test(t.text.en!) || GUITAR[lang].test(t.text[lang]!) !== GUITAR.en.test(t.text.en!))
      .map((t) => `${t.id}: ${t.text.en} | ${t.text[lang]}`);
    expect(drift).toEqual([]);
  });

  it('the guitar facts the rewritten Level 1 tasks state are the engine\'s (standard tuning)', () => {
    const open = getTuningPitchClasses(TUNING_STANDARD); // [6th … 1st string]
    const pc = (n: string) => getPitchClass(stringToNote(n));
    const STRING: Record<string, number> = { 'low E': 0, A: 1, D: 2, G: 3, B: 4, 'high E': 5 };
    // "C is fret 3 of the A string": every such sentence in any task.
    const claims = allTasks().flatMap((t) => [...t.text.en!.matchAll(/\b([A-G][♯♭#b]?) is fret (\d+) of the (low E|high E|[ABDG]) string/gu)]);
    expect(claims.length).toBeGreaterThanOrEqual(2);
    for (const [s, note, fret, string] of claims) expect((open[STRING[string]] + Number(fret)) % 12, s).toBe(pc(note.replace('♯', '#').replace('♭', 'b')));
    // "E and F … on the guitar they are one fret apart": one fret is one half step.
    expect(allTasks().find((t) => t.id === 'l1u1m3t2')!.text.en).toMatch(/E and F\b.*one fret apart/);
    expect((pc('F') - pc('E') + 12) % 12).toBe(1);
  });

  it('the capo task is true on both instruments: the shapes sound what it says, and the pianist plays the same chords two half steps up', () => {
    const text = allTasks().find((t) => t.id === 'l1u35m8t2')!.text.en!;
    const SYM = '[A-G][♯♭]?m?';
    const list = (x: string) => x.split(/, | and /);
    const m = new RegExp(`capo at fret (\\d+) and play your ((?:${SYM}(?:, | and ))+${SYM}) shapes: they sound ((?:${SYM}(?:, | and ))+${SYM})`, 'u').exec(text);
    expect(m, text).not.toBeNull();
    const piano = new RegExp(`On the piano, play ((?:${SYM}(?:, | and ))+${SYM}), then each chord (two) half steps higher, ((?:${SYM}(?:, | and ))+${SYM})`, 'u').exec(text);
    expect(piano, text).not.toBeNull();
    const fret = Number(m![1]);
    const [shapes, sounds] = [list(m![2]), list(m![3])];
    expect(list(piano![1])).toEqual(shapes);
    expect(list(piano![3])).toEqual(sounds);
    expect(fret).toBe(2); // "two half steps": a capo raises every shape a half step per fret
    const chordOf = (sym: string) => { const p = parseChordSymbol(sym.replace('♯', '#').replace('♭', 'b'))!; return buildChord(p.root, p.quality); };
    const name = (n: Note) => `${n.natural}${n.accidental}`;
    shapes.forEach((shape, i) => {
      // The fretboard's own rule: the chord that sounds, moved down by the capo, is the shape.
      const under = chordBelowCapo(chordOf(sounds[i]), fret);
      expect(`${name(under.root)} ${under.quality}`, `${shape} at capo ${fret}`).toBe(`${name(chordOf(shape).root)} ${chordOf(shape).quality}`);
    });
  });
});

describe('practice tasks: music facts against the engine (fix pass, 18 November 2026)', () => {
  it('"the common tones with …" names exactly the notes the two chords share', () => {
    const chordNotes = (sym: string) => { const p = parseChordSymbol(sym)!; return buildChord(p.root, p.quality).notes.map((n) => `${n.natural}${n.accidental}`); };
    const READ = /'([^']+)' and notice the common tones? with (\S+?): the notes? ([A-G][#b♯♭]?)(?: and ([A-G][#b♯♭]?))?/u;
    const claims = allTasks().map((t) => READ.exec(t.text.en!)).filter((x): x is RegExpExecArray => x !== null);
    expect(claims.length).toBeGreaterThanOrEqual(1);
    for (const [s, a, b, ...named] of claims) {
      const shared = chordNotes(a).filter((n) => chordNotes(b).includes(n)).sort();
      expect(named.filter(Boolean).sort(), s).toEqual(shared);
    }
    // Planted: the old sentence ("the common tone with G7: the note D") is caught.
    const old = READ.exec("Tap 'Dm7' and notice the common tone with G7: the note D.")!;
    expect([old[3]]).not.toEqual(chordNotes('Dm7').filter((n) => chordNotes('G7').includes(n)).sort());
  });
});

describe('practice tasks: the queries the app runs are unchanged (Q5)', () => {
  const recorded = baseline as Record<string, { ids: string[] } & Record<Lang, string[][]>>;
  const queriesOf = (text: string | undefined) => findQuotedQueries(text ?? '').map((q) => q.query);

  it('every module keeps its task ids, in order', () => {
    const now: Record<string, string[]> = {};
    for (const t of allTasks()) (now[t.module] ??= []).push(t.id);
    expect(now).toEqual(Object.fromEntries(Object.entries(recorded).map(([m, r]) => [m, r.ids])));
  });

  /**
   * The audit of 18 November 2026 changed some queries ON PURPOSE, all in the
   * thirteen modules of its lesson corrections (A23: E then Am; A25: one parent
   * scale; A29: C7/G …). They are recorded apart, module by module, so every
   * other task is still held to 6de6c0e byte for byte. `RECORD_TASK_QUERY_CHANGES=1`
   * re-records that file (a deliberate content change only).
   */
  const changed = auditChanges as Record<string, Record<Lang, string[][]>>;
  const AUDIT_MODULES = new Set([
    'l9u30m4', 'l4u14m5', 'l3u11m5', 'l7u23m3', 'l7u21m2', 'l4u12m5', 'l4u14m4',
    'l7u21m5', 'l1u3m2', 'l9u30m3', 'l1u1m2', 'l2u6m1', 'l8u25m3',
  ]);
  const queriesNow = (lang: Lang) => {
    const now: Record<string, string[][]> = {};
    for (const t of allTasks()) (now[t.module] ??= []).push(queriesOf(t.text[lang]));
    return now;
  };

  it.runIf(process.env.RECORD_TASK_QUERY_CHANGES === '1')('RECORD: the modules whose queries differ from 6de6c0e', () => {
    const out: Record<string, Record<string, string[][]>> = {};
    for (const lang of ALL) {
      const now = queriesNow(lang);
      for (const [m, r] of Object.entries(recorded)) {
        if (JSON.stringify(now[m]) !== JSON.stringify(r[lang])) (out[m] ??= {})[lang] = now[m];
      }
    }
    for (const m of Object.keys(out)) for (const lang of ALL) out[m][lang] ??= queriesNow(lang)[m];
    writeFileSync(resolve(process.cwd(), 'src/data/__tests__/fixtures/practice-task-queries-audit-2026-11-18.json'), `${JSON.stringify(out, null, 2)}\n`);
  });

  it.each(ALL)('%s: every task quotes exactly the queries it quoted on 6de6c0e, byte for byte, in order (the audit\'s recorded changes apart)', (lang) => {
    expect(queriesNow(lang)).toEqual(Object.fromEntries(Object.entries(recorded).map(([m, r]) => [m, changed[m]?.[lang] ?? r[lang]])));
  });

  it('the queries changed on purpose are all in the audit\'s thirteen modules, and each really differs from 6de6c0e', () => {
    for (const [m, byLang] of Object.entries(changed)) {
      expect(AUDIT_MODULES.has(m), m).toBe(true);
      expect(ALL.some((lang) => JSON.stringify(byLang[lang]) !== JSON.stringify(recorded[m][lang])), m).toBe(true);
    }
  });

  it('the comparison fires on a planted change to one query', () => {
    const t = allTasks().find((x) => x.id === 'l1u1m1t2')!;
    const planted = t.text.en!.replace("'C major scale'", "'C major scale '");
    expect(queriesOf(t.text.en)).toEqual(recorded.l1u1m1.en[1]);
    expect(queriesOf(planted)).toEqual(recorded.l1u1m1.en[1]); // trimmed: the app runs the same query
    expect(queriesOf(t.text.en!.replace("'C major scale'", "'G major scale'"))).not.toEqual(recorded.l1u1m1.en[1]);
    expect(queriesOf(t.text.en!.replace("'C major scale'", 'C major scale'))).not.toEqual(recorded.l1u1m1.en[1]);
  });
});

// ─── 4. PT and ES state the facts the English states (fix pass) ────────────

/**
 * Every task of the 136 modules, English against Portuguese and against
 * Spanish: the same numbers (frets, strings, counts, bars, degrees — number
 * words read as digits: "fifth" = «quinta» = 5, "both" = «ambos» = 2; "one"
 * / «uma» / «una» are left out, they are also articles), the same note
 * letters in the same order (a sentence-opening "A" before a word that names
 * no quality is the article — EN "A single chord", PT «A distinção»), and
 * the same interval abbreviations under the house mapping (P5 = 5P = 5J,
 * M3 = 3M, m6 = 6m). The tests above check the English against the engine;
 * this one makes the translations say the same thing.
 */
const NUMBER_WORDS: Record<Lang, [RegExp, string][]> = (() => {
  const w = (words: string, d: string, flags = 'giu'): [RegExp, string] => [new RegExp(`(?<!\\p{L})(?:${words})(?!\\p{L})`, flags), d];
  return {
    en: [w('unisons?', '1'), w('octaves?', '8'), w('first', '1'), w('seconds?', '2'), w('thirds?', '3'), w('fourths?', '4'), w('fifths?', '5'), w('sixths?', '6'), w('sevenths?', '7'),
      w('ninths?', '9'), w('elevenths?', '11'), w('thirteenths?', '13'), w('both', '2'), w('threes', '3'), w('two', '2'), w('three', '3'), w('four', '4'), w('five', '5'), w('six', '6'),
      w('seven', '7'), w('eight', '8'), w('nine', '9'), w('ten', '10'), w('eleven', '11'), w('twelve', '12')],
    pt: [w('décima primeira', '11'), w('décima terceira', '13'), w('uníssonos?', '1'), w('oitavas?', '8'), w('primeir[oa]s?', '1'), w('segund[oa]s?', '2'), w('terceir[oa]s?|terças?', '3'),
      w('quart[oa]s?', '4'), w('quint[oa]s?', '5'), w('sext[oa]s?', '6'), w('sétim[oa]s?', '7'), w('oitavos?', '8'), w('non[oa]s?', '9'), w('dodecafónic[oa]s?', '12'),
      w('dois|duas|ambos|ambas', '2'), w('três', '3'), w('quatro', '4'), w('cinco', '5'), w('seis', '6'), w('sete', '7'), w('oito', '8'), w('nove', '9'), w('dez', '10'), w('onze', '11'), w('doze', '12')],
    es: [w('unísonos?', '1'), w('octavas?', '8'), w('primer[oa]?s?', '1'), w('segund[oa]s?', '2'), w('tercer[oa]?s?', '3'), w('cuart[oa]s?', '4'), w('quint[oa]s?', '5'), w('sext[oa]s?', '6'),
      w('séptim[oa]s?', '7'), w('octavos?', '8'), w('noven[oa]s?', '9'), w('oncenas?|undécimas?', '11'), w('dodecafónic[oa]s?', '12'),
      w('dos|ambos|ambas', '2'), w('tres', '3'), w('cuatro', '4'), w('cinco', '5'), w('seis', '6'), w('siete', '7'), w('ocho', '8'), w('nueve', '9'), w('diez', '10'), w('once', '11'), w('doce', '12')],
  };
})();
const QUALITY_WORD = /^(?:major|minor|natural|harmonic|melodic|dorian|phrygian|lydian|mixolydian|aeolian|locrian|maior|menor|mayor|harmónica|armónica|melódica|chord|scale|section|secção|sección)\b/iu;
const NOTE_LETTER = /(?<![\p{L}\d])([A-G])(♯|♭|#|b)?(?![\p{L}\d])/gu;
const INTERVAL = /(?<![\p{L}\d.])(?:([PMmdA])(\d{1,2})|(\d{1,2})([PMmdJ]))(?![\p{L}\d])/gu;

function numbersOf(text: string, lang: Lang): string {
  let s = text;
  for (const [re, d] of NUMBER_WORDS[lang]) s = s.replace(re, ` ${d} `);
  return (s.match(/\d+/g) ?? []).map(Number).sort((a, b) => a - b).join(' ');
}
function notesOf(text: string): string {
  const withoutArticles = text.replace(/(^|[.!?:;—–(]\s*)A(?= (\S+))/gu, (m, lead: string, next: string) => (QUALITY_WORD.test(next) || next.startsWith(',') ? m : `${lead}·`));
  return [...withoutArticles.matchAll(NOTE_LETTER)].map((m) => m[1] + (m[2] === '#' || m[2] === '♯' ? '♯' : m[2] ? '♭' : '')).join(' ');
}
function intervalsOf(text: string): string {
  return [...text.matchAll(INTERVAL)].map((m) => (m[1] ? m[1] + m[2] : (m[4] === 'J' ? 'P' : m[4]) + m[3])).sort().join(' ');
}
type FactKind = 'numbers' | 'notes' | 'intervals';
const FACTS: Record<FactKind, (text: string, lang: Lang) => string> = { numbers: numbersOf, notes: (t) => notesOf(t), intervals: (t) => intervalsOf(t) };
function factDifferences(en: string, tr: string, lang: Lang): FactKind[] {
  return (Object.keys(FACTS) as FactKind[]).filter((k) => FACTS[k](en, 'en') !== FACTS[k](tr, lang));
}

/** Where a language legitimately says the same thing another way: `<task id> <lang> <kind>` and why. */
const FACT_EXCEPTIONS: Readonly<Record<string, string>> = {
  'l1u2m1t1 pt numbers': '"every other beat" is «a cada duas batidas» (two)',
  'l1u2m1t1 es numbers': '"every other beat" is «cada dos golpes» (two)',
  'l1u3m2t2 pt notes': 'possessive order: "G major\'s F#" is «o F# de G maior» (one of the other stream\'s thirteen modules)',
  'l1u3m2t2 es notes': 'possessive order: "G major\'s F#" is «el F# de G mayor» (one of the other stream\'s thirteen modules)',
  'l2u6m1t1 es numbers': '"by threes" is «de tres en tres» (one of the other stream\'s thirteen modules)',
  'l3u9m1t3 pt numbers': '"which three?" is «quais são?»: the three is in the sentence before',
  'l3u9m1t3 es numbers': '"which three?" is «cuáles son?»: the three is in the sentence before',
  'l5u16m4t2 pt notes': 'the English "A becomes Ab" opens a clause with the note A, which the reader takes for the article',
  'l5u16m4t2 es notes': 'the English "A becomes Ab" opens a clause with the note A, which the reader takes for the article',
  'l5u16m5t3 pt numbers': '"Picardy I" is «I com terça de Picardia» (the third named)',
  'l7u21m5t1 pt numbers': '"All three are dominant 7ths" is «Todos são acordes de sétima da dominante»',
  'l7u21m5t1 es numbers': '"All three are dominant 7ths" is «Todos son acordes de séptima de dominante»',
  'l7u23m2t2 pt numbers': '"Both Ab and Bb" is «Tanto Ab como Bb»',
  'l7u23m2t2 es numbers': '"Both Ab and Bb" is «Tanto Ab como Bb»',
};

describe('practice tasks: PT and ES state the numbers, notes and intervals the English states (fix pass)', () => {
  it('the reader fires on a changed fret, a changed interval and notes out of order, and passes the house forms', () => {
    const en = 'Find C — on the guitar, C is fret 3 of the A string. Play C and G (P5), C and E (M3).';
    expect(factDifferences(en, 'Encontra C — na guitarra, o C está no traste 3 da corda A. Toca C e G (5P), C e E (3M).', 'pt')).toEqual([]);
    expect(factDifferences(en, 'Encuentra C — en la guitarra, C está en el traste 3 de la cuerda A. Toca C y G (5J), C y E (3M).', 'es')).toEqual([]);
    expect(factDifferences(en, 'Encontra C — na guitarra, o C está no traste 5 da corda A. Toca C e G (5P), C e E (3M).', 'pt')).toEqual(['numbers']);
    expect(factDifferences(en, 'Encuentra C — en la guitarra, C está en el traste 3 de la cuerda A. Toca C y G (4J), C y E (3M).', 'es')).toEqual(['numbers', 'intervals']);
    expect(factDifferences(en, 'Encontra C — na guitarra, o C está no traste 3 da corda A. Toca C e E (5P), C e G (3M).', 'pt')).toEqual(['notes']);
    expect(factDifferences('Play the 5th and both 3rds.', 'Toca a quinta e ambas as terças.', 'pt')).toEqual([]);
    expect(factDifferences('A single chord holds A, C and E.', 'Um único acorde tem A, C e E.', 'pt')).toEqual([]);
    expect(factDifferences('A single chord holds A, C and E.', 'Um único acorde tem C e E.', 'pt')).toEqual(['notes']);
  });

  it.each(LANGS)('%s: every task of the 136 modules, outside the listed exceptions', (lang) => {
    const bad = allTasks().flatMap((t) => factDifferences(t.text.en!, t.text[lang]!, lang)
      .filter((k) => !(`${t.id} ${lang} ${k}` in FACT_EXCEPTIONS))
      .map((k) => `${t.id} ${k}: [${FACTS[k](t.text.en!, 'en')}] vs [${FACTS[k](t.text[lang]!, lang)}] | ${t.text[lang]}`));
    expect(bad).toEqual([]);
  });

  it('every listed exception still differs (a stale entry fails)', () => {
    const byId = new Map(allTasks().map((t) => [t.id, t.text]));
    for (const key of Object.keys(FACT_EXCEPTIONS)) {
      const [id, lang, kind] = key.split(' ') as [string, Lang, FactKind];
      const text = byId.get(id);
      expect(text, key).toBeDefined();
      expect(factDifferences(text!.en!, text![lang]!, lang), key).toContain(kind);
    }
  });
});
