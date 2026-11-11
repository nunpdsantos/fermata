/**
 * The two starting tracks' text, read from the text itself (final review of
 * wave 2, slice D: most printed claims were checked against constants typed
 * into the tests, the PT / ES prose was never read, and "Start with sound"
 * had no truth test at all — a wrong fret, a wrong note in a PT chord and a
 * wrong note in an ES sentence all passed the full suite).
 *
 *  1. PT and ES state the same notes and numbers as the English: every note
 *     with a sharp or a flat, every list of three or more notes (in order),
 *     every cardinal number — in the lessons (titles, explanations, Try This
 *     labels, tasks) and the checks (prompts, options, hints, nudges).
 *  2. Every "<note> is fret N of the <string> string" and "frets N and M of
 *     the <string> string" sentence (EN) names the note that fret sounds in
 *     standard tuning.
 *  3. Every capo sum (EN): "with the capo at fret 2, the G shape sounds A…",
 *     "C shapes with the capo at fret 4 are in the key of E".
 *  4. "Start with sound": every Try This label that lists notes lists what its
 *     query plays, in order (EN, PT, ES), and every build check's explanation
 *     lists the notes the engine builds (EN, PT, ES).
 * Each reader is shown to fire on a planted wrong sentence.
 */
import { describe, it, expect } from 'vitest';
import { L1_UNITS } from '../../core/constants/curriculumL1';
import { buildChord } from '../../core/constants/chords';
import { buildScale } from '../../core/constants/scales';
import { getPitchClass } from '../../core/constants/notes';
import { TUNING_STANDARD, getTuningPitchClasses } from '../../core/constants/guitarTunings';
import { stringToNote, type ChordQuality, type Note, type ScaleType } from '../../core/types/music';
import { withGlyphs } from '../../core/utils/accidentalGlyphs';
import { tryThisPicture } from '../../components/learn/lesson/tryThisPicture';
import ptCurriculumL1 from '../../i18n/content/pt/curriculumL1';
import esCurriculumL1 from '../../i18n/content/es/curriculumL1';

const TRACK_UNITS = L1_UNITS.filter((u) => u.track);
const OVERLAYS = { pt: ptCurriculumL1, es: esCurriculumL1 } as const;
const C: Note = { natural: 'C', accidental: '' };
const norm = (x: string) => x.replace('#', '♯').replace(/(?<=[A-G])b$/, '♭');
const note = (name: string): Note => stringToNote(norm(name).replace('♯', '#').replace('♭', 'b'));
const pcOf = (name: string) => getPitchClass(note(name));
const names = (notes: readonly Note[]) => notes.map((n) => withGlyphs(`${n.natural}${n.accidental}`));

// ─── 1. PT / ES against EN ─────────────────────────────────────────────────

const N = '[A-G](?:♯|♭|#|b)?';
const SEP = /, and |, e |, y |, | and | e | y /;
const ACCIDENTAL = /(?<![\p{L}\d])([A-G](?:♯|♭|#|b))(?![\p{L}\d])/gu;
const RUN = new RegExp(`(?<![\\p{L}\\d])${N}(?:(?:${SEP.source})${N}(?![\\p{L}\\d])){2,}`, 'gu');
// Cardinal numbers only: "7th" / "7.ª" are ordinals, which the languages write differently.
const CARDINAL = /(?<![\p{L}\d.])\d+(?![\d\p{L}]|\.ª|\.º)/gu;

/** A list as notes in order: a repeat in a row once ("D, D, F♯ and A" after "the D chord"), the closing return to the first note dropped. */
function runOf(text: string): string {
  const out: string[] = [];
  for (const n of text.split(SEP).map((x) => norm(x.trim()))) if (out[out.length - 1] !== n) out.push(n);
  if (out.length > 3 && out[out.length - 1] === out[0]) out.pop();
  return out.join('-');
}

function noteFacts(text: string): { accidentals: string; runs: string; numbers: string } {
  return {
    accidentals: [...text.matchAll(ACCIDENTAL)].map((m) => norm(m[1])).sort().join(' '),
    runs: [...text.matchAll(RUN)].map((m) => runOf(m[0])).sort().join(' '),
    numbers: [...text.matchAll(CARDINAL)].map((m) => m[0]).sort().join(' '),
  };
}

/** Every [id, EN, PT, ES] string of the two tracks. */
async function trackStrings(): Promise<[string, string, string | undefined, string | undefined][]> {
  const out: [string, string, string | undefined, string | undefined][] = [];
  for (const u of TRACK_UNITS) {
    for (const m of u.modules) {
      const [pt, es] = [OVERLAYS.pt.modules[m.id], OVERLAYS.es.modules[m.id]];
      out.push([`${m.id}.title`, m.title, pt?.title, es?.title]);
      m.concepts.forEach((c, i) => {
        out.push([`${m.id}.c${i}.title`, c.title, pt?.concepts[i]?.title, es?.concepts[i]?.title]);
        out.push([`${m.id}.c${i}`, c.explanation, pt?.concepts[i]?.explanation, es?.concepts[i]?.explanation]);
        out.push([`${m.id}.c${i}.label`, c.tryThisLabel, pt?.concepts[i]?.tryThisLabel, es?.concepts[i]?.tryThisLabel]);
      });
      m.tasks.forEach((t, i) => out.push([`${m.id}.t${i}`, t.instruction, pt?.tasks?.[i]?.instruction, es?.tasks?.[i]?.instruction]));
    }
  }
  const { levelCorpus } = await import('../exercises/__tests__/learnCorpus');
  const inTracks = (lang: 'en' | 'pt' | 'es') => new Map(levelCorpus(1, lang).filter((x) => /^l1u3[45]m/.test(x.moduleId)).map((x) => [x.exercise.id, x.exercise]));
  const [en, pt, es] = [inTracks('en'), inTracks('pt'), inTracks('es')];
  for (const [id, e] of en) {
    const [p, s] = [pt.get(id), es.get(id)];
    const nudge = (x: unknown) => (x as { nudge?: string } | undefined)?.nudge ?? '';
    const options = (x: unknown) => ((x as { config?: { options?: string[] } } | undefined)?.config?.options ?? []);
    out.push([`${id}.prompt`, e.prompt, p?.prompt, s?.prompt]);
    out.push([`${id}.hint`, e.hint ?? '', p?.hint ?? '', s?.hint ?? '']);
    out.push([`${id}.nudge`, nudge(e), nudge(p), nudge(s)]);
    options(e).forEach((o, i) => out.push([`${id}.option${i}`, o, options(p)[i], options(s)[i]]));
  }
  return out;
}

describe('PT and ES state the notes and numbers the English states', () => {
  it('every lesson and check string of both tracks: sharps and flats, lists of notes, numbers', async () => {
    const strings = await trackStrings();
    expect(strings.length).toBeGreaterThan(400);
    let facts = 0;
    for (const [id, en, pt, es] of strings) {
      const want = noteFacts(en);
      if (want.accidentals || want.runs || want.numbers) facts++;
      expect(pt, `pt ${id}`).toBeTypeOf('string');
      expect(es, `es ${id}`).toBeTypeOf('string');
      expect(noteFacts(pt!), `pt ${id}: ${pt}`).toEqual(want);
      expect(noteFacts(es!), `es ${id}: ${es}`).toEqual(want);
    }
    expect(facts).toBeGreaterThan(150);
  });

  it('the reader fires on a dropped sharp, a changed note and a changed number', () => {
    const en = noteFacts('B7, with B, D♯, F♯ and A, pulls to E. In D, the A chord holds C♯; fret 4 of the A string.');
    expect(noteFacts('B7, com B, D, F♯ e A, puxa para E. Em D, o acorde de A tem C♯; o trasto 4 da corda A.')).not.toEqual(en);
    expect(noteFacts('B7, con B, D♯, F♯ y A, tira hacia E. En D, el acorde de A tiene C; el traste 4 de la cuerda A.')).not.toEqual(en);
    expect(noteFacts('B7, com B, D♯, F♯ e A, puxa para E. Em D, o acorde de A tem C♯; o trasto 3 da corda A.')).not.toEqual(en);
    expect(noteFacts('B7, com B, D♯, F♯ e A, puxa para E. Em D, o acorde de A tem C♯; o trasto 4 da corda A.')).toEqual(en);
  });
});

// ─── 2. Frets (EN) ──────────────────────────────────────────────────────────

const OPEN = getTuningPitchClasses(TUNING_STANDARD);
/** Open-string pitch class by string number (1 = thinnest). */
const openPc = (string: number) => OPEN[6 - string];
const STRING_NUMBER: Record<string, number> = {
  thinnest: 1, 'high E': 1, B: 2, G: 3, D: 4, A: 5, 'low E': 6, thickest: 6,
};
const FRETS = /\bfrets? (\d+)(?: and (\d+))? of the (thinnest|thickest|high E|low E|[ABDG]) string/;
const NAMED = /(?<![\p{L}])([A-G])(?: (sharp|flat)|([♯♭]))?(?![\p{L}\d])/gu;
/** The notes a passage names, leaving out chords ("your D chord"). */
const notesIn = (s: string) => [...s.matchAll(NAMED)]
  .filter((m) => !/^ chord\b/.test(s.slice(m.index + m[0].length)))
  .map((m) => `${m[1]}${m[2] === 'sharp' ? '♯' : m[2] === 'flat' ? '♭' : m[3] ?? ''}`);

/** [claimed note, string, fret, ok] for every fret claim in a text. */
function fretClaims(text: string): [string, number, number, boolean][] {
  const out: [string, number, number, boolean][] = [];
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const m = FRETS.exec(sentence);
    if (!m) continue;
    const frets = [Number(m[1]), ...(m[2] ? [Number(m[2])] : [])];
    const string = STRING_NUMBER[m[3]];
    // "C is fret 3 of …": the note of that clause; otherwise the last notes
    // named before the sentence's first colon ("Find C sharp: …", "Play D,
    // then F♯ and G one after the other: …", "find the F♯ in your D chord: …").
    const before = sentence.slice(0, m.index);
    const clause = before.split(';').pop()!;
    const is = /([A-G](?: sharp| flat|[♯♭])?) is $/.exec(clause);
    const lead = before.includes(':') ? before.slice(0, before.indexOf(':')) : before;
    const named = is ? notesIn(is[1]) : notesIn(lead).slice(-frets.length);
    frets.forEach((fret, k) => {
      const claimed = named[k] ?? '?';
      out.push([claimed, string, fret, claimed !== '?' && pcOf(claimed) === (openPc(string) + fret) % 12]);
    });
  }
  return out;
}

const enTexts = async () => {
  const out: string[] = [];
  for (const u of TRACK_UNITS) {
    for (const m of u.modules) {
      for (const c of m.concepts) out.push(c.explanation, c.tryThisLabel);
      for (const t of m.tasks) out.push(t.instruction);
    }
  }
  const { levelCorpus } = await import('../exercises/__tests__/learnCorpus');
  for (const { moduleId, exercise } of levelCorpus(1, 'en')) {
    if (/^l1u3[45]m/.test(moduleId)) out.push(exercise.prompt, exercise.hint ?? '', ...(((exercise.config as { options?: string[] }).options) ?? []));
  }
  return out;
};

describe('every fret the tracks name sounds the note they name (EN, standard tuning)', () => {
  it('read from the text: at least five claims, all true', async () => {
    const claims = (await enTexts()).flatMap(fretClaims);
    expect(claims.length).toBeGreaterThanOrEqual(5);
    for (const [n, string, fret, ok] of claims) expect(ok, `${n} at fret ${fret} of string ${string}`).toBe(true);
  });

  it('the reader fires on a planted wrong fret (C♯ is fret 4 of the A string, not 3)', () => {
    expect(fretClaims('Find C sharp: on the piano, the black key just right of C; on the guitar, fret 4 of the A string.')).toEqual([['C♯', 5, 4, true]]);
    expect(fretClaims('Find C sharp: on the piano, the black key just right of C; on the guitar, fret 3 of the A string.')).toEqual([['C♯', 5, 3, false]]);
    expect(fretClaims('On the guitar, C is fret 4 of the A string.')[0][3]).toBe(false);
    expect(fretClaims('Play D, then F♯ and G one after the other: on the guitar, frets 2 and 4 of the thinnest string.').map((c) => c[3])).toEqual([true, false]);
    expect(fretClaims('On the guitar, find the F♯ in your D chord: fret 2 of the thinnest string.')).toEqual([['F♯', 1, 2, true]]);
  });
});

// ─── 3. Capo sums (EN) ──────────────────────────────────────────────────────

const SYM = '[A-G][♯♭]?m?';
const SOUNDS = new RegExp(`capo (?:at|on) fret (\\d+),? (?:the )?((?:${SYM} (?:shape )?sounds ${SYM}(?:, | and )?)+)`, 'g');
const SHAPES_IN_KEY = new RegExp(`((?:${SYM}(?:, | and ))*${SYM}) shapes,? with (?:the|a) capo (?:at|on) fret (\\d+),? (?:are in|sound in) the key of (${SYM})`, 'g');

/** [claim, ok] for every capo sum in a text. */
function capoClaims(text: string): [string, boolean][] {
  const out: [string, boolean][] = [];
  const moved = (from: string, by: number, to: string) =>
    (pcOf(from.replace(/m$/, '')) + by) % 12 === pcOf(to.replace(/m$/, '')) && from.endsWith('m') === to.endsWith('m');
  for (const m of text.matchAll(SOUNDS)) {
    const fret = Number(m[1]);
    for (const p of m[2].matchAll(new RegExp(`(${SYM}) (?:shape )?sounds (${SYM})`, 'g'))) {
      out.push([`capo ${fret}: ${p[1]} → ${p[2]}`, moved(p[1], fret, p[2])]);
    }
  }
  for (const m of text.matchAll(SHAPES_IN_KEY)) {
    const fret = Number(m[2]);
    const home = m[1].split(/, | and /)[0];
    out.push([`capo ${fret}: ${m[1]} shapes → key of ${m[3]}`, moved(home, fret, m[3])]);
  }
  return out;
}

describe('every capo sum the chords track prints (EN)', () => {
  it('read from the text: at least four claims, all true', async () => {
    const claims = (await enTexts()).flatMap(capoClaims);
    expect(claims.length).toBeGreaterThanOrEqual(4);
    for (const [claim, ok] of claims) expect(ok, claim).toBe(true);
  });

  it('the reader fires on a planted wrong sum', () => {
    expect(capoClaims('With the capo at fret 2, the G shape sounds A, C sounds D, D sounds E and Em sounds F♯m.').map((c) => c[1])).toEqual([true, true, true, true]);
    expect(capoClaims('With the capo at fret 2, the G shape sounds A, C sounds D, D sounds F and Em sounds F♯m.').map((c) => c[1])).toEqual([true, true, false, true]);
    expect(capoClaims('C shapes with the capo at fret 4 are in the key of F.')).toEqual([['capo 4: C shapes → key of F', false]]);
  });
});

// ─── 4. "Start with sound": Try This labels and build explanations ─────────

const sound = TRACK_UNITS.find((u) => u.track === 'sound')!;

describe('"Start with sound" says what it plays (EN, PT, ES)', () => {
  it('every label that lists notes lists the notes its query plays, in order, from the first', () => {
    let lists = 0;
    for (const mod of sound.modules) {
      mod.concepts.forEach((c, i) => {
        const picture = tryThisPicture(c.tryThisQuery, C);
        expect(picture.kind, `${mod.id} c${i}: ${c.tryThisQuery}`).not.toBe('none');
        if (picture.kind !== 'scale' && picture.kind !== 'chord') return;
        const played = names(picture.notes);
        for (const [lang, label] of [['en', c.tryThisLabel], ['pt', OVERLAYS.pt.modules[mod.id]?.concepts[i]?.tryThisLabel], ['es', OVERLAYS.es.modules[mod.id]?.concepts[i]?.tryThisLabel]] as const) {
          expect(label, `${lang} ${mod.id} c${i}`).toBeTruthy();
          for (const run of label!.matchAll(RUN)) {
            const listed = runOf(run[0]).split('-');
            if (lang === 'en') lists++;
            expect(listed, `${lang} ${mod.id} c${i}: ${label}`).toEqual(played.slice(0, listed.length));
          }
        }
      });
    }
    expect(lists).toBeGreaterThanOrEqual(7);
  });

  it('the label of a chord or a scale named by its notes names that chord: "Hear G major: G, B and D" plays G major', () => {
    const named = /Hear ([A-G][♯♭]?) (major|minor)\b/;
    let checked = 0;
    for (const mod of sound.modules) {
      for (const c of mod.concepts) {
        const m = named.exec(c.tryThisLabel);
        if (!m) continue;
        checked++;
        const picture = tryThisPicture(c.tryThisQuery, C);
        const want = /chord/.test(c.tryThisQuery)
          ? buildChord(note(m[1]), m[2] as ChordQuality).notes
          : buildScale(note(m[1]), m[2] as ScaleType).notes;
        expect(picture.kind === 'chord' || picture.kind === 'scale' ? names(picture.notes) : [], `${mod.id}: ${c.tryThisLabel}`).toEqual(names(want));
      }
    }
    expect(checked).toBeGreaterThanOrEqual(3);
  });

  it('every build check\'s explanation lists exactly the notes the engine builds (EN, PT, ES)', async () => {
    const { levelCorpus } = await import('../exercises/__tests__/learnCorpus');
    let builds = 0;
    for (const lang of ['en', 'pt', 'es'] as const) {
      for (const { moduleId, exercise } of levelCorpus(1, lang)) {
        const c = exercise.config;
        if (!moduleId.startsWith('l1u34') || (c.type !== 'chord_build' && c.type !== 'scale_build')) continue;
        const root = note(`${c.root}${c.rootAccidental}`);
        const want = c.type === 'chord_build' ? buildChord(root, c.quality as ChordQuality).notes : buildScale(root, c.scaleType as ScaleType).notes;
        expect(want.length, exercise.id).toBe(c.noteCount);
        const run = [...(exercise.hint ?? '').matchAll(RUN)][0];
        // The chromatic build says "twelve notes" in words: its count is the check.
        if (c.type === 'scale_build' && c.scaleType === 'chromatic') {
          expect(exercise.hint, `${lang} ${exercise.id}`).toMatch(/twelve|doze|doce/);
          continue;
        }
        builds++;
        expect(run?.[0].split(SEP).map((x) => norm(x.trim())), `${lang} ${exercise.id}: ${exercise.hint}`).toEqual(names(want));
      }
    }
    expect(builds).toBe(3 * 6);
  });
});
