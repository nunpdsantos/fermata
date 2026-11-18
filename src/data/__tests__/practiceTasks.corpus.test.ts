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
 *     English names; the guitar facts the rewritten tasks state are the
 *     engine's.
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
import { stringToNote } from '../../core/types/music';
import { EN_UNITS, curriculumOverlay, LANGS } from '../../i18n/content/__tests__/overlayEntries';
import baseline from './fixtures/practice-task-queries-6de6c0e.json';

type Lang = 'en' | (typeof LANGS)[number];
const ALL: readonly Lang[] = ['en', ...LANGS];

/**
 * The thirteen modules another stream (builder G) rewrites in the same round.
 * Their tasks still say "Type" on this branch: the seat REMOVES this list when
 * the two branches are integrated, and the typing check then covers every module.
 */
const SKIPPED_UNTIL_INTEGRATION: ReadonlySet<string> = new Set([
  'l9u30m4', 'l4u14m5', 'l3u11m5', 'l7u23m3', 'l7u21m2', 'l4u12m5', 'l4u14m4',
  'l7u21m5', 'l1u3m2', 'l9u30m3', 'l1u1m2', 'l2u6m1', 'l8u25m3',
]);

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
      .filter((t) => !SKIPPED_UNTIL_INTEGRATION.has(t.module))
      .map((t) => [t.id, typingFaults(t.text[lang] ?? '', lang)] as const)
      .filter(([, f]) => f.length > 0)
      .map(([id, f]) => `${id}: ${f.join(', ')}`);
    expect(faults).toEqual([]);
  });

  it('the skipped modules are exactly the thirteen of the other stream, and each exists', () => {
    const modules = new Set(allTasks().map((t) => t.module));
    expect(SKIPPED_UNTIL_INTEGRATION.size).toBe(13);
    for (const id of SKIPPED_UNTIL_INTEGRATION) expect(modules.has(id), id).toBe(true);
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
  pt: /(?<!\p{L})(?:guitarra|trastos?|cordas?|capo|pestana|braço)(?!\p{L})/iu,
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
  l1u33m2t1: 'guitar only (an open string stopped by fingers 1 to 4): no wording makes it a piano task; it waits for a per-instrument task, which needs the seat',
  l1u33m3t2: 'reading the barre marks aloud: no instrument is played',
  l1u35m8t2: 'guitar only (the capo): it waits for a per-instrument task, which needs the seat',
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
      .filter((t) => !SKIPPED_UNTIL_INTEGRATION.has(t.module) && !(t.id in ONE_INSTRUMENT_ALLOWED))
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
      .filter((t) => !SKIPPED_UNTIL_INTEGRATION.has(t.module))
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
});

describe('practice tasks: the queries the app runs are unchanged (Q5)', () => {
  const recorded = baseline as Record<string, { ids: string[] } & Record<Lang, string[][]>>;
  const queriesOf = (text: string | undefined) => findQuotedQueries(text ?? '').map((q) => q.query);

  it('every module keeps its task ids, in order', () => {
    const now: Record<string, string[]> = {};
    for (const t of allTasks()) (now[t.module] ??= []).push(t.id);
    expect(now).toEqual(Object.fromEntries(Object.entries(recorded).map(([m, r]) => [m, r.ids])));
  });

  it.each(ALL)('%s: every task quotes exactly the queries it quoted on 6de6c0e, byte for byte, in order', (lang) => {
    const now: Record<string, string[][]> = {};
    for (const t of allTasks()) (now[t.module] ??= []).push(queriesOf(t.text[lang]));
    expect(now).toEqual(Object.fromEntries(Object.entries(recorded).map(([m, r]) => [m, r[lang]])));
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
