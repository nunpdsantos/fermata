/**
 * Drill family 'read' — staff to fretboard (audit W10-02).
 *
 * Independent oracle: written pitch from the id (letter + scientific octave,
 * theoryOracle.midiOf), sounding = written − 12 (the guitar sounds an octave
 * lower, D-05), string pitches hard-coded, position windows re-implemented
 * here from the classical definition (index over fret N, frets N…N+3; the
 * Open position adds the open strings; one-fret stretches only for a pitch in
 * the gap between two strings). Grading is swept over every place on the neck
 * for every item.
 */
import { describe, it, expect } from 'vitest';
import { generateDrillBank, drillSiblingGroup, genRead, READ_LADDER, READ_PROMPT_KEYS, READ_WHY_KEYS } from '../drillBank';
import { gradeFretAnswer, placesInPosition } from '../fretboardReading';
import { getGuitarPosition } from '../guitarPositions';
import type { ReadDrillItem } from '../../types/drill';
import { midiOf } from './theoryOracle';
import { OPEN, MAX_FRET } from './fingeringOracle';
import enLocale from '../../../i18n/locales/en.json';

const items = genRead();
const byId = new Map(items.map((i) => [i.id, i]));

// ─── Oracle ─────────────────────────────────────────────────────────────────

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

function parseId(id: string) {
  const m = /^read:staff-to-fret:(open|any|[IVX]+):([A-G])(#|b)?(\d)$/.exec(id);
  if (!m) throw new Error(`bad read id ${id}`);
  const position = m[1] === 'any' ? null : m[1] === 'open' ? 0 : ROMAN.indexOf(m[1]);
  const written = midiOf(m[2] + (m[3] ?? ''), Number(m[4]));
  return { position, letter: m[2], accidental: m[3] ?? '', octave: Number(m[4]), written, sounding: written - 12 };
}

/** Every (string, fret) on the 15-fret neck. */
const ALL_PLACES = OPEN.flatMap((_, s) => Array.from({ length: MAX_FRET + 1 }, (__, f) => ({ stringIndex: s, fret: f })));
const sounds = (p: { stringIndex: number; fret: number }) => OPEN[p.stringIndex] + p.fret;

/** Places for `midi` in `position` (null = anywhere), from the classical definition. */
function oraclePlaces(midi: number, position: number | null): string[] {
  const here = ALL_PLACES.filter((p) => sounds(p) === midi);
  const key = (p: { stringIndex: number; fret: number }) => `${p.stringIndex}/${p.fret}`;
  if (position === null) return here.map(key);
  if (position === 0) return here.filter((p) => p.fret <= 4).map(key);
  const inWindow = here.filter((p) => p.fret >= position && p.fret <= position + 3);
  if (inWindow.length > 0) return inWindow.map(key);
  const lo = OPEN[0] + position;
  const hi = OPEN[5] + position + 3;
  if (midi < lo || midi > hi) return [];
  return here.filter((p) => p.fret === position - 1 || p.fret === position + 4).map(key);
}

const placeKeys = (item: ReadDrillItem) => item.answer.accepted.map((p) => `${p.stringIndex}/${p.fret}`).sort();

// ─── Items ──────────────────────────────────────────────────────────────────

describe('read family — items (oracle)', () => {
  it('ids are unique, stable in shape, and ranks are unique', () => {
    expect(byId.size).toBe(items.length);
    expect(new Set(items.map((i) => i.rank)).size).toBe(items.length);
    for (const item of items) expect(() => parseId(item.id)).not.toThrow();
  });

  it('is deterministic', () => {
    expect(genRead()).toEqual(items);
  });

  it('stores the written pitch and the sounding pitch an octave lower', () => {
    for (const item of items) {
      const o = parseId(item.id);
      expect(item.answer.midi, item.id).toBe(o.sounding);
      expect(item.staff.clef).toBe('treble');
      expect(item.staff.annotation).toBe('8vb');
      expect([item.staff.written.natural, item.staff.written.accidental, item.staff.written.octave]).toEqual([o.letter, o.accidental, o.octave]);
      expect(12 + 12 * item.staff.written.octave + ((midiOf(o.letter + o.accidental, 0) - 12) % 12 + 12) % 12, item.id).toBe(o.written);
      expect([item.staff.sounding.natural, item.staff.sounding.accidental, item.staff.sounding.octave]).toEqual([o.letter, o.accidental, o.octave - 1]);
    }
  });

  it('accepts exactly the places that sound the pitch in the asked position', () => {
    for (const item of items) {
      const o = parseId(item.id);
      expect(placeKeys(item), item.id).toEqual(oraclePlaces(o.sounding, o.position).sort());
      for (const p of item.answer.accepted) expect(sounds(p), item.id).toBe(item.answer.midi);
    }
  });

  it('each rung asks every pitch its position holds, naturals once and black keys both ways', () => {
    for (const rung of READ_LADDER) {
      const scopeItems = items.filter((i) => parseId(i.id).position === rung.position);
      const expected: string[] = [];
      for (let midi = OPEN[0]; midi <= OPEN[5] + MAX_FRET; midi++) {
        if (oraclePlaces(midi, rung.position).length === 0) continue;
        const pc = midi % 12;
        const names = ({ 0: ['C'], 1: ['C#', 'Db'], 2: ['D'], 3: ['D#', 'Eb'], 4: ['E'], 5: ['F'], 6: ['F#', 'Gb'], 7: ['G'], 8: ['G#', 'Ab'], 9: ['A'], 10: ['A#', 'Bb'], 11: ['B'] } as Record<number, string[]>)[pc];
        for (const n of names) expected.push(`${n}${Math.floor((midi + 12) / 12) - 1}`);
      }
      const got = scopeItems.map((i) => {
        const o = parseId(i.id);
        return `${o.letter}${o.accidental}${o.octave}`;
      });
      expect(got.sort(), `rung ${rung.position}`).toEqual(expected.sort());
      for (const i of scopeItems) expect(i.stage).toBe(rung.stage);
    }
  });

  it('climbs the ABRSM ladder: Open, II, V, then above V, then the whole neck', () => {
    expect(READ_LADDER.map((r) => [r.position, r.stage])).toEqual([[0, 1], [2, 2], [5, 3], [7, 4], [9, 4], [12, 4], [null, 5]]);
    // Easier rungs come first in the introduction order.
    const stages = [...items].sort((a, b) => a.rank - b.rank).map((i) => i.stage);
    expect(stages).toEqual([...stages].sort((a, b) => a - b));
    // Naturals before accidentals within a rung.
    for (const rung of READ_LADDER) {
      const acc = [...items].filter((i) => i.input.position === rung.position).sort((a, b) => a.rank - b.rank).map((i) => i.staff.written.accidental !== '');
      expect(acc.indexOf(true)).toBeGreaterThan(acc.lastIndexOf(false));
    }
  });

  it('agrees with the position engine: every place it shows for the chromatic scale is accepted', () => {
    for (const rung of READ_LADDER) {
      if (rung.position === null) continue;
      const pos = getGuitarPosition({ natural: 'C', accidental: '' }, 'chromatic', rung.position);
      for (const n of pos.notes) {
        const accepted = placesInPosition(n.midi, rung.position).places;
        expect(accepted.some((p) => p.stringIndex === n.stringIndex && p.fret === n.fret), `pos ${rung.position} midi ${n.midi}`).toBe(true);
      }
    }
  });

  it('input contract: a fretboard tap, standard tuning, the position window or the whole neck', () => {
    for (const item of items) {
      const o = parseId(item.id);
      expect(item.input.format).toBe('fretboard');
      expect(item.input.tuningId).toBe('standard');
      expect(item.input.maxFret).toBe(MAX_FRET);
      expect(item.input.position).toBe(o.position);
      if (o.position === null) expect(item.input.window).toBeNull();
      else if (o.position === 0) expect(item.input.window).toEqual({ fromFret: 1, toFret: 4, openStrings: true });
      else expect(item.input.window).toEqual({ fromFret: o.position, toFret: Math.min(15, o.position + 3), openStrings: false });
    }
  });
});

// ─── Grading ────────────────────────────────────────────────────────────────

describe('read family — grading by exact pitch, every item × every place', () => {
  it('right place = correct; same pitch elsewhere = near miss (outside the position); octave off = near miss; else wrong', () => {
    let checked = 0;
    for (const item of items) {
      const accepted = new Set(placeKeys(item));
      for (const p of ALL_PLACES) {
        const g = gradeFretAnswer(item, p);
        const m = sounds(p);
        expect(g.tappedMidi).toBe(m);
        if (accepted.has(`${p.stringIndex}/${p.fret}`)) expect(g).toMatchObject({ correct: true, reason: 'correct' });
        else if (m === item.answer.midi) expect(g).toMatchObject({ correct: false, nearMiss: true, reason: 'outsidePosition' });
        else if ((m - item.answer.midi) % 12 === 0) expect(g).toMatchObject({ correct: false, nearMiss: true, reason: 'octave' });
        else expect(g).toMatchObject({ correct: false, nearMiss: false, reason: 'wrong' });
        checked++;
      }
    }
    expect(checked).toBe(items.length * 6 * 16);
  });

  it('pitch class is not enough: written C5 is the C4 on string 2 fret 1, not the C3 or C5', () => {
    const item = byId.get('read:staff-to-fret:open:C5')!;
    expect(item.answer.midi).toBe(60);
    expect(placeKeys(item)).toEqual(['4/1']);
    expect(gradeFretAnswer(item, { stringIndex: 4, fret: 1 }).correct).toBe(true);
    expect(gradeFretAnswer(item, { stringIndex: 1, fret: 3 })).toMatchObject({ correct: false, reason: 'octave' }); // C3
    expect(gradeFretAnswer(item, { stringIndex: 3, fret: 5 })).toMatchObject({ correct: false, reason: 'outsidePosition' }); // C4, V
    const anywhere = byId.get('read:staff-to-fret:any:C5')!;
    expect(placeKeys(anywhere)).toEqual(['1/15', '2/10', '3/5', '4/1']);
  });

  it('rejects taps off the board', () => {
    const item = items[0];
    for (const tap of [{ stringIndex: -1, fret: 0 }, { stringIndex: 6, fret: 0 }, { stringIndex: 0, fret: 16 }, { stringIndex: 0, fret: 1.5 }]) {
      expect(gradeFretAnswer(item, tap)).toMatchObject({ correct: false, nearMiss: false, reason: 'wrong' });
    }
  });
});

// ─── Bank registration ──────────────────────────────────────────────────────

describe('read family — registered in the bank without touching the existing items', () => {
  const plain = generateDrillBank();
  const withRead = generateDrillBank({ includeRead: true });

  it('the default bank carries no read item', () => {
    expect(plain.some((i) => (i.family as string) === 'read')).toBe(false);
  });

  it('opting in appends the read items after every existing item, which stay identical and in order', () => {
    const others = withRead.filter((i) => i.family !== 'read');
    expect(others).toEqual(plain);
    expect(withRead.slice(0, plain.length)).toEqual(plain);
    expect(withRead.length).toBe(plain.length + items.length);
    expect(Math.min(...items.map((i) => i.rank))).toBeGreaterThan(Math.max(...plain.map((i) => i.rank)));
  });

  it('read ids never collide with existing ids; existing sibling groups never become read groups', () => {
    const ids = new Set(plain.map((i) => i.id));
    for (const i of items) expect(ids.has(i.id)).toBe(false);
    for (const i of plain) expect(drillSiblingGroup(i.id).startsWith('read:')).toBe(false);
  });

  it('siblings: every item about one sounding pitch (any rung, either spelling) shares a group', () => {
    for (const a of items) {
      expect(drillSiblingGroup(a.id)).toBe(`read:${a.answer.midi}`);
    }
    expect(drillSiblingGroup('read:staff-to-fret:open:G#4')).toBe(drillSiblingGroup('read:staff-to-fret:V:Ab4'));
    expect(drillSiblingGroup('read:staff-to-fret:open:G4')).not.toBe(drillSiblingGroup('read:staff-to-fret:open:G5'));
    expect(drillSiblingGroup('read:nonsense')).toBe('read:nonsense');
  });
});

// ─── i18n contract ──────────────────────────────────────────────────────────

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const v = path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj);
  return typeof v === 'string' ? v : undefined;
}

describe('read family — keys and params', () => {
  it('the key registries match the generator both ways', () => {
    expect([...new Set(items.map((i) => i.promptKey))].sort()).toEqual([...READ_PROMPT_KEYS].sort());
    expect([...new Set(items.map((i) => i.whyKey))].sort()).toEqual([...READ_WHY_KEYS].sort());
  });
  it('every {{token}} of the EN template is in the item params', () => {
    for (const item of items) {
      for (const [key, params] of [[item.promptKey, item.promptParams], [item.whyKey, item.whyParams]] as const) {
        const tpl = getNested(enLocale as Record<string, unknown>, key);
        expect(tpl, key).toBeDefined();
        for (const m of tpl!.matchAll(/\{\{(\w+)\}\}/g)) expect(params, `${item.id} ${key}`).toHaveProperty(m[1]);
      }
    }
  });
  it('the prompt never names the note (the staff shows it); the explanation does', () => {
    for (const item of items) {
      expect(Object.values(item.promptParams).join(' '), item.id).not.toMatch(/[A-G]/);
      expect(String(item.whyParams.written)).toMatch(/^[A-G][♯♭]?\d$/u);
      expect(String(item.whyParams.places).length).toBeGreaterThan(0);
    }
    // B♭4 written sounds B♭3: in V only the 4th string's 8th fret holds it.
    expect(byId.get('read:staff-to-fret:V:Bb4')!.whyParams).toEqual({ written: 'B♭4', sounding: 'B♭3', places: '④8' });
    expect(byId.get('read:staff-to-fret:any:Bb4')!.whyParams.places).toBe('⑤13 · ④8 · ③3');
  });
});
