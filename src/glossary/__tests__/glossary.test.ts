/**
 * The glossary (wave 1, brief C): every word a component marks has an
 * explanation in EN, PT and ES, short and plain; every lesson link exists;
 * every sound demonstration resolves to real notes for all twelve roots; and
 * the worked examples are the THEORY ENGINE's, checked here against a table
 * of keys and scales (a major and a minor key, a mode, a sharp key, a flat
 * key, and scales where the degree names do not apply).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import i18next from 'i18next';
import en from '../../i18n/glossary/en.json';
import pt from '../../i18n/glossary/pt.json';
import es from '../../i18n/glossary/es.json';
import enUi from '../../i18n/locales/en.json';
import ptUi from '../../i18n/locales/pt.json';
import esUi from '../../i18n/locales/es.json';
import { TERM_IDS, BASE_TERM_IDS, SCALE_TERM_IDS, QUALITY_TERM, CATEGORY_TERM, functionTermId, isTermId, type TermId } from '../termIds';
import { GLOSSARY, type GlossaryContext, type T } from '../entries';
import { termTitle } from '../termTitle';
import { MODULE_INDEX } from '../../data/moduleIndex';
import { SCALE_FORMULAS, getScaleDegreeFunctionKey } from '../../core/constants/scales';
import { buildChord, CHORD_SYMBOLS } from '../../core/constants/chords';
import { preferredRootSpelling } from '../../core/utils/degreeSpelling';
import { getMidiNumber } from '../../core/utils/pianoLayout';
import type { ChordQuality, Note, ScaleType } from '../../core/types/music';

const TEXT = { en, pt, es } as const;
const UI = { en: enUi, pt: ptUi, es: esUi } as const;
type Lang = keyof typeof TEXT;
const LANGS: Lang[] = ['en', 'pt', 'es'];

async function makeT(lng: Lang): Promise<T> {
  const inst = i18next.createInstance();
  const resources = Object.fromEntries(LANGS.map((l) => [l, {
    translation: { ...UI[l], glossary: { ...UI[l].glossary, ...TEXT[l] } },
  }]));
  await inst.init({ resources, lng, fallbackLng: 'en', interpolation: { escapeValue: false } });
  return inst.t.bind(inst) as T;
}

const note = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: (s.slice(1) as Note['accidental']) });
const ctx = (root: string, scaleType: ScaleType, extra: Partial<GlossaryContext> = {}): GlossaryContext => ({
  root: note(root), scaleType, chord: null, instrument: 'piano', baseOctave: 4, ...extra,
});

describe('every term has an explanation in EN, PT and ES', () => {
  for (const lang of LANGS) {
    it(`${lang}: one entry per term id, plain present and under 220 characters, a title for each word`, () => {
      const entries = TEXT[lang].entries as Record<string, { title?: string; plain: string }>;
      expect(Object.keys(entries).sort()).toEqual([...TERM_IDS].sort());
      for (const id of TERM_IDS) {
        const e = entries[id];
        expect(e.plain.trim().length, `${lang} ${id}`).toBeGreaterThan(20);
        expect(e.plain.length, `${lang} ${id}: ${e.plain.length}`).toBeLessThanOrEqual(220);
        if (!id.startsWith('scale_')) expect(e.title?.trim(), `${lang} ${id} title`).toBeTruthy();
      }
    });
  }

  it('the templates of each entry exist in every language and use the same placeholders', () => {
    const fields = (lang: Lang, id: string) => TEXT[lang].entries[id as keyof typeof en.entries] as Record<string, string>;
    for (const id of TERM_IDS) {
      const base = fields('en', id);
      for (const lang of ['pt', 'es'] as const) {
        const other = fields(lang, id);
        expect(Object.keys(other).sort(), `${lang} ${id}`).toEqual(Object.keys(base).sort());
        for (const [k, v] of Object.entries(base)) {
          const vars = (s: string) => [...s.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort();
          expect(vars(other[k]), `${lang} ${id}.${k}`).toEqual(vars(v));
        }
      }
    }
  });

  // After review: the PT text once said a minor chord's middle note is FOUR
  // half steps up. The numbers in an entry (digits and number words) must be
  // the same in every language.
  it('every entry states the same numbers in EN, PT and ES', () => {
    const WORDS: Record<Lang, Record<string, number>> = {
      en: { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, seventh: 7 },
      pt: { um: 1, uma: 1, dois: 2, duas: 2, três: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10, onze: 11, doze: 12, sétima: 7 },
      es: { uno: 1, una: 1, un: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, séptima: 7 },
    };
    // 1 and 2 are not compared: "um"/"un" are also articles, and "both ends"
    // is "as duas pontas" / "los dos extremos". A 7th chord is "de sétima".
    const numbers = (lang: Lang, s: string) => {
      const out: number[] = [];
      for (const m of s.toLocaleLowerCase(lang).matchAll(/\d+|[\p{L}]+/gu)) {
        const n = /^\d+$/.test(m[0]) ? Number(m[0]) : WORDS[lang][m[0]];
        if (n !== undefined && n > 2) out.push(n);
      }
      return out.sort((a, b) => a - b);
    };
    // A known positive: the fault the review found would fail here.
    expect(numbers('pt', 'Uma tríade cuja nota do meio está quatro meios-tons acima')).not.toEqual(numbers('en', 'A triad whose middle note is three half steps above the root'));
    const mismatches: string[] = [];
    for (const id of TERM_IDS) {
      const base = TEXT.en.entries[id as keyof typeof en.entries] as Record<string, string>;
      for (const lang of ['pt', 'es'] as const) {
        const other = TEXT[lang].entries[id as keyof typeof en.entries] as Record<string, string>;
        for (const field of Object.keys(base)) {
          if (field === 'title') continue;
          const a = numbers(lang, other[field]).join(' ');
          const b = numbers('en', base[field]).join(' ');
          if (a !== b) mismatches.push(`${lang} ${id}.${field}: [${a}] vs en [${b}]`);
        }
      }
    }
    expect(mismatches).toEqual([]);
  });

  it('every entry has a spec, and the scale entries cover every scale the app offers', () => {
    for (const id of TERM_IDS) expect(GLOSSARY[id], id).toBeDefined();
    expect(SCALE_TERM_IDS.length).toBe(Object.keys(SCALE_FORMULAS).length);
    expect(new Set(BASE_TERM_IDS).size).toBe(BASE_TERM_IDS.length);
  });

  it('titles come out for every term in every language (scales: the picker name, capitalised)', async () => {
    for (const lang of LANGS) {
      const t = await makeT(lang);
      for (const id of TERM_IDS) {
        const title = termTitle(id, t);
        expect(title, `${lang} ${id}`).not.toMatch(/glossary\.|scaleName\./);
        // "p, i, m, a" are the finger letters, lower case by convention.
        if (id !== 'rightHandFingers') expect(title[0], `${lang} ${id}`).toBe(title[0].toLocaleUpperCase());
      }
    }
  });
});

/** Every `<Term id="…">`, `data-term="…"`, `termAttr('…')` and `'data-term': '…'` literal in the app's components. */
function literalTermIds(): { file: string; id: string }[] {
  const out: { file: string; id: string }[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) {
        if (name !== '__tests__') walk(path);
      } else if (/\.tsx?$/.test(name)) {
        const src = readFileSync(path, 'utf8');
        const res = [/<Term\s+id="([^"]+)"/g, /data-term="([^"]+)"/g, /termAttr\('([^']+)'\)/g, /'data-term': '([^']+)'/g];
        for (const re of res) for (const m of src.matchAll(re)) out.push({ file: path, id: m[1] });
      }
    }
  };
  walk(join(__dirname, '../../components'));
  walk(join(__dirname, '../../glossary'));
  return out;
}

describe('every term id used in a component has an entry', () => {
  it('literal ids (found, and known)', () => {
    const used = literalTermIds();
    // Sanity: the scan finds the words it should (a known positive).
    expect(used.map((u) => u.id)).toEqual(expect.arrayContaining(['keySignature', 'relativeKey', 'chordsInKey', 'degree', 'romanNumeral', 'formula', 'compatibleScales', 'circleOfFifths', 'position', 'tirandoApoyando']));
    for (const { file, id } of used) expect(isTermId(id), `${file}: ${id}`).toBe(true);
  });

  it('computed ids: every chord quality, every All Chords category, every degree name the strip can show', () => {
    for (const q of Object.keys(CHORD_SYMBOLS) as ChordQuality[]) expect(isTermId(QUALITY_TERM[q]), q).toBe(true);
    const browser = readFileSync(join(__dirname, '../../components/theory/ChordBrowser.tsx'), 'utf8');
    const keys = [...browser.matchAll(/labelKey: '([^']+)'/g)].map((m) => m[1]);
    expect(keys.length).toBe(9);
    for (const k of keys) expect(isTermId(CATEGORY_TERM[k]), k).toBe(true);
    for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
      const f = SCALE_FORMULAS[type];
      if (f.length !== 7) continue;
      f.forEach((semi, i) => {
        const key = getScaleDegreeFunctionKey(i, semi)!;
        expect(functionTermId(key), `${type} ${i}`).not.toBeNull();
      });
    }
  });
});

describe('lesson links', () => {
  it('every `learn` id exists in the module index', () => {
    const ids = new Set(MODULE_INDEX.map((m) => m.id));
    for (const id of TERM_IDS) {
      const learn = GLOSSARY[id].learn;
      if (learn) expect(ids.has(learn), `${id} → ${learn}`).toBe(true);
    }
  });
});

const ROOTS: Note[] = Array.from({ length: 12 }, (_, pc) => preferredRootSpelling(pc, 'major'));

describe('every sound demonstration resolves to notes for all twelve roots', () => {
  const withHear = TERM_IDS.filter((id) => GLOSSARY[id].hear);
  it('there are demonstrations (a known positive)', () => {
    expect(withHear).toEqual(expect.arrayContaining(['leadingNote', 'inversion', 'dominant', 'scale_mixolydian', 'relativeKey']));
  });
  for (const instrument of ['piano', 'guitar'] as const) {
    it(`${instrument}: in a major key, each of ${withHear.length} demonstrations plays real notes, in order`, () => {
      for (const root of ROOTS) {
        for (const id of withHear) {
          const notes = GLOSSARY[id].hear!({ root, scaleType: 'major', chord: null, instrument, baseOctave: 4 });
          expect(notes?.length, `${id} on ${root.natural}${root.accidental}`).toBeGreaterThan(1);
          let last = -1;
          for (const n of notes!) {
            const midi = getMidiNumber(n.note, n.note.octave);
            expect(Number.isInteger(midi) && midi >= 28 && midi <= 96, `${id} ${midi}`).toBe(true);
            expect(n.at).toBeGreaterThanOrEqual(last);
            expect(n.duration).toBeGreaterThan(0);
            last = n.at;
          }
        }
      }
    });
  }
  it('with a chord open, the chord demonstrations play THAT chord (G7 → its notes, then C)', () => {
    const g7 = buildChord(note('G'), 'dominant7');
    const notes = GLOSSARY.dominantSeventh.hear!(ctx('C', 'major', { chord: g7 }))!;
    const pcs = (from: number, to: number) => [...new Set(notes.filter((n) => n.at >= from && n.at < to).map((n) => getMidiNumber(n.note, n.note.octave) % 12))].sort((a, b) => a - b);
    expect(pcs(0, 0.5)).toEqual([2, 5, 7, 11]);
    expect(pcs(0.5, 10)).toEqual([0, 4, 7]);
  });
  it('the leading note: the scale up to the 7th, a breath, then home', () => {
    const notes = GLOSSARY.leadingNote.hear!(ctx('G', 'major'))!;
    const midis = notes.map((n) => getMidiNumber(n.note, n.note.octave));
    expect(midis.map((m) => m % 12)).toEqual([7, 9, 11, 0, 2, 4, 6, 7]);
    expect(notes[7].at - notes[6].at).toBeGreaterThan(notes[6].at - notes[5].at);
  });
  // After review: the twelve-roots check above uses a major key only.
  for (const scaleType of ['natural_minor', 'pentatonic_major', 'pentatonic_minor', 'blues', 'major_blues', 'dorian', 'whole_tone'] as const) {
    it(`in ${scaleType}, every demonstration that plays plays real notes, in order, for all twelve roots`, () => {
      for (const root of ROOTS) {
        for (const id of withHear) {
          const notes = GLOSSARY[id].hear!({ root, scaleType, chord: null, instrument: 'piano', baseOctave: 4 });
          if (!notes) continue;
          expect(notes.length, `${id} ${scaleType}`).toBeGreaterThan(1);
          let last = -1;
          for (const n of notes) {
            const midi = getMidiNumber(n.note, n.note.octave);
            expect(Number.isInteger(midi) && midi >= 28 && midi <= 96, `${id} ${midi}`).toBe(true);
            expect(n.at, `${id} ${scaleType}`).toBeGreaterThanOrEqual(last);
            last = n.at;
          }
        }
      }
    });
  }
  it('relative key: the sound is the key, then the relative the text names, for every major- and minor-family scale', () => {
    const pc = (n: { note: Note & { octave: number } }) => getMidiNumber(n.note, n.note.octave) % 12;
    const cases: [ScaleType, number, number][] = [
      // [scale on C, first pitch class of the key, first of its relative]
      ['major', 0, 9], ['pentatonic_major', 0, 9], ['major_blues', 0, 9],
      ['natural_minor', 0, 3], ['harmonic_minor', 0, 3], ['melodic_minor', 0, 3], ['pentatonic_minor', 0, 3], ['blues', 0, 3],
    ];
    for (const [scaleType, own, rel] of cases) {
      const notes = GLOSSARY.relativeKey.hear!(ctx('C', scaleType))!;
      expect(notes, scaleType).not.toBeNull();
      expect(pc(notes[0]), scaleType).toBe(own);
      expect(pc(notes[8]), scaleType).toBe(rel);
    }
  });
  it('the inversion: the same three notes, the 3rd lowest the second time', () => {
    const notes = GLOSSARY.inversion.hear!(ctx('C', 'major'))!;
    const first = notes.filter((n) => n.at === 0).map((n) => getMidiNumber(n.note, n.note.octave));
    const second = notes.filter((n) => n.at > 0).map((n) => getMidiNumber(n.note, n.note.octave));
    expect(Math.min(...first) % 12).toBe(0);
    expect(Math.min(...second) % 12).toBe(4);
    expect(new Set(second.map((m) => m % 12))).toEqual(new Set([0, 4, 7]));
  });
});

/** The panel's line for an entry: its example, or why it does not apply here. */
function line(id: TermId, c: GlossaryContext, t: T, key = 'K'): string | null {
  const spec = GLOSSARY[id];
  const notHere = spec.notHere?.(c) ?? null;
  if (notHere) return `notHere:${notHere}`;
  const ex = spec.example?.(c, t);
  return ex ? t(`glossary.entries.${id}.${ex.template ?? 'example'}`, { key, ...ex.vars }) : null;
}

describe('worked examples come from the engine (keys × scales)', () => {
  it.each([
    // [term, root, scale, expected line (EN)]
    ['dominant', 'G', 'major', 'In K: D.'],
    ['leadingNote', 'G', 'major', 'In K: F♯.'],
    ['subdominant', 'F', 'major', 'In K: B♭.'],
    ['dominant', 'A', 'natural_minor', 'In K: E.'],
    ['leadingNote', 'A', 'natural_minor', 'notHere:notHere'],
    ['subtonic', 'A', 'natural_minor', 'In K: G.'],
    ['leadingNote', 'A', 'harmonic_minor', 'In K: G♯.'],
    ['relativeKey', 'A', 'natural_minor', 'K and C major share every note.'],
    ['relativeKey', 'E♭'.replace('♭', 'b'), 'major', 'K and C minor share every note.'],
    ['relativeKey', 'D', 'dorian', 'notHere:only'],
    ['parentKey', 'D', 'dorian', 'K uses the notes of C major.'],
    ['parentKey', 'G', 'mixolydian', 'K uses the notes of C major.'],
    ['parentKey', 'C', 'major', 'notHere:only'],
    ['subtonic', 'G', 'mixolydian', 'In K: F.'],
    ['dominantKey', 'F#', 'major', 'From K: C♯ major.'],
    ['subdominantKey', 'C', 'natural_minor', 'From K: F minor.'],
    ['keySignature', 'Eb', 'major', 'K: 3♭.'],
    ['keySignature', 'C', 'whole_tone', 'K: No standard key signature.'],
    ['dominant', 'C', 'whole_tone', 'notHere:sevenOnly'],
    ['dominant', 'B', 'locrian', 'notHere:notHere'],
    ['tonic', 'C', 'pentatonic_major', 'notHere:sevenOnly'],
    ['augFifth', 'C', 'lydian_augmented', 'In K: G♯.'],
    ['chordsInKey', 'G', 'major', 'In K: G · Am · Bm · C · D · Em · F♯dim.'],
    ['chordsInKey', 'C', 'whole_tone', 'notHere:notHere'],
    ['romanNumeral', 'D', 'major', 'In K: I = D · IV = G · V = A.'],
    ['sharpFlat', 'D', 'major', 'K uses F♯ C♯.'],
    ['sharpFlat', 'C', 'major', 'K uses no sharps or flats.'],
    ['halfStep', 'C', 'major', 'In K, E to F is a half step.'],
    ['halfStep', 'C', 'whole_tone', 'In K, C to D is a whole step.'],
    ['inversion', 'C', 'major', 'C: root position C E G · 1st inversion E G C · 2nd inversion G C E.'],
    ['scale_mixolydian', 'G', 'major', 'On G: G A B C D E F.'],
    ['scale_blues', 'A', 'major', 'On A: A C D E♭ E G.'],
    ['degree', 'C', 'natural_minor', 'K: 1 C · 2 D · ♭3 E♭ · 4 F · 5 G · ♭6 A♭ · ♭7 B♭.'],
    ['circleOfFifths', 'C', 'major', 'Next to K: F major and G major.'],
    ['circleOfFifths', 'D', 'dorian', null],
  ] as const)('%s in %s %s', async (id, root, scale, expected) => {
    const t = await makeT('en');
    expect(line(id as TermId, ctx(root, scale as ScaleType), t)).toBe(expected);
  });

  it('a chord on screen: its own notes, formula and slash bass', async () => {
    const t = await makeT('en');
    const g7 = buildChord(note('G'), 'dominant7');
    expect(line('dominantSeventh', ctx('C', 'major', { chord: g7 }), t)).toBe('G7: G B D F.');
    expect(line('formula', ctx('C', 'major', { chord: g7 }), t)).toBe('G7: R 3 5 ♭7 → G B D F.');
    const slash = { ...buildChord(note('C'), 'major'), bassNote: note('E') };
    expect(line('slashChord', ctx('C', 'major', { chord: slash }), t)).toBe('C/E: the notes of C with E lowest.');
    expect(line('slashChord', ctx('C', 'major'), t)).toBeNull();
    // No chord of that kind open: one built on the key's root.
    expect(line('minorChord', ctx('D', 'major'), t)).toBe('Dm: D F A.');
  });

  it('a two-note chord (power chord) has no 2nd inversion', async () => {
    const t = await makeT('en');
    const c5 = buildChord(note('C'), 'power');
    expect(line('inversion', ctx('C', 'major', { chord: c5 }), t)).toBe('C5: root position C G · 1st inversion G C.');
    for (const lang of ['pt', 'es'] as const) {
      const tl = await makeT(lang);
      expect(line('inversion', ctx('C', 'major', { chord: c5 }), tl), lang).not.toMatch(/2/);
    }
  });

  it('a scale named beside an open chord (Compatible scales · D) is explained on the chord\'s root; the key\'s own scale on the key\'s', async () => {
    const t = await makeT('en');
    const dm7 = buildChord(note('D'), 'minor7');
    expect(line('scale_dorian', ctx('C', 'major', { chord: dm7 }), t)).toBe('On D: D E F G A B C.');
    expect(line('scale_major', ctx('C', 'major', { chord: dm7 }), t)).toBe('On C: C D E F G A B.');
    expect(line('scale_dorian', ctx('C', 'major'), t)).toBe('On C: C D E♭ F G A B♭.');
    const first = GLOSSARY.scale_dorian.hear!(ctx('C', 'major', { chord: dm7 }))![0];
    expect(getMidiNumber(first.note, first.note.octave) % 12).toBe(2);
  });

  it('"Out of key" leads to the lesson on borrowed chords', () => {
    const lesson = MODULE_INDEX.find((m) => m.id === GLOSSARY.outOfKey.learn);
    expect(lesson?.title).toMatch(/Borrowed Chords/);
  });

  it('every entry renders for a table of keys, in every language, with no placeholder left over', async () => {
    const contexts = [ctx('C', 'major'), ctx('A', 'natural_minor'), ctx('D', 'dorian'), ctx('F#', 'major'), ctx('Bb', 'melodic_minor'), ctx('C', 'whole_tone'), ctx('E', 'pentatonic_minor'), ctx('G', 'bebop_dominant'), ctx('C', 'chromatic'),
      ctx('C', 'major', { chord: { ...buildChord(note('G'), 'dominant7') } }), ctx('E', 'major', { chord: { ...buildChord(note('A'), 'minor'), bassNote: note('C') } })];
    for (const lang of LANGS) {
      const t = await makeT(lang);
      for (const c of contexts) {
        for (const id of TERM_IDS) {
          const text = line(id, c, t, 'X');
          if (text && !text.startsWith('notHere:')) {
            expect(text, `${lang} ${id}`).not.toMatch(/\{\{|\}\}|glossary\.|undefined|NaN/);
          }
          const nh = text?.startsWith('notHere:') ? text.slice(8) : null;
          if (nh === 'only') expect(t(`glossary.entries.${id}.only`), `${lang} ${id}.only`).not.toMatch(/glossary\./);
        }
      }
    }
  });
});
