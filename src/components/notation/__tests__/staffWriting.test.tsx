/**
 * Audit W1-02 / W1-03 / W3-12 — what the staff actually shows.
 *
 * Part 1 is a pure, exhaustive port of the auditors' staff_audit: every scale
 * type x every selectable root and every chord quality x 15 roots, read back
 * the way VexFlow places notes (by LETTER + octave) and the way a reader reads
 * them (key signature, then accidentals that hold for the measure), against
 * the independent oracle.
 * Part 2 renders the real StaffNotation (VexFlow 5) in jsdom and reads the SVG:
 * SMuFL glyphs — flat U+E260, natural U+E261, sharp U+E262, double sharp
 * U+E263, double flat U+E264; treble clef U+E050, treble-8vb U+E052, bass U+E062.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import type { ChordQuality, Note, PitchedNote, ScaleType } from '../../../core/types/music';
import { buildScale, SCALE_FORMULAS } from '../../../core/constants/scales';
import { buildChord, CHORD_FORMULAS } from '../../../core/constants/chords';
import { getScaleNotesWithOctaves, getVoicedChordNotes } from '../../../core/utils/pianoLayout';
import { pitchedNoteToVexKey, getKeySignatureForScale, vexAccidentals, writtenStaffNotes } from '../../../utils/notationHelpers';
import { StaffNotation } from '../StaffNotation';
import { useAppStore } from '../../../state/store';
import {
  ORACLE_SCALES,
  ORACLE_SYMMETRIC,
  SELECTABLE_ROOTS,
  spellDegree,
  majorKeySignature,
  midiOf,
  pcOf,
  LETTER_PC,
  ACC_OFFSET,
  mod12,
} from '../../../core/utils/__tests__/theoryOracle';

const toNote = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const vexParse = (k: string) => {
  const [n, o] = k.split('/');
  return { letter: n[0].toUpperCase(), acc: n.slice(1), octave: Number(o) };
};
const semisOf = (type: string) => (ORACLE_SCALES[type] ?? ORACLE_SYMMETRIC[type]).semis;

/** Letters altered by a VexFlow signature string, from the oracle ("Cm" → Eb major's). */
function sigAccidentals(sig: string | null): Record<string, string> {
  if (!sig) return {};
  const minor = sig.endsWith('m');
  const tonic = minor ? sig.slice(0, -1) : sig;
  return majorKeySignature(minor ? spellDegree(tonic, 'b3')! : tonic).accs;
}

describe('W1-02 — every scale and chord is drawn at the right height (letter octaves)', () => {
  it('scales ascend from the root in octave 4 for all types x selectable roots', () => {
    const bad: string[] = [];
    for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
      for (const root of SELECTABLE_ROOTS) {
        const pitched = getScaleNotesWithOctaves(buildScale(toNote(root), type).notes, 4);
        const drawn = pitched.map((n) => {
          const p = vexParse(pitchedNoteToVexKey(n));
          return midiOf(p.letter + p.acc, p.octave);
        });
        const rootMidi = midiOf(root, 4);
        // The app anchors the scale on the root's pitch class in octave 4.
        const anchor = 12 * 5 + pcOf(root);
        const intended = [...semisOf(type).map((s) => anchor + s), anchor + 12];
        if (drawn.join() !== intended.join()) bad.push(`${root} ${type}: drawn ${drawn.join(',')} intended ${intended.join(',')} (root letter-midi ${rootMidi})`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('chords are drawn at the pitches the app voices, for every quality x 15 roots', () => {
    const bad: string[] = [];
    for (const q of Object.keys(CHORD_FORMULAS) as ChordQuality[]) {
      for (const r of ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C#', 'Cb']) {
        const voiced = getVoicedChordNotes(buildChord(toNote(r), q).notes, 4);
        const intended = voiced.map((n) => 12 + n.octave * 12 + pcOf(n.natural + n.accidental));
        const drawn = voiced.map((n) => {
          const p = vexParse(pitchedNoteToVexKey(n));
          return midiOf(p.letter + p.acc, p.octave);
        });
        if (drawn.join() !== intended.join()) bad.push(`${r}${q}: [${voiced.map(pitchedNoteToVexKey).join(' ')}]`);
      }
    }
    expect(bad).toEqual([]);
  });
});

describe('W1-03 — a reader reads the right notes, with no redundant accidentals', () => {
  it('for every type x root (key signature for major and the minor scales)', () => {
    const wrong: string[] = [];
    const redundant: string[] = [];
    for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
      for (const root of SELECTABLE_ROOTS) {
        const scale = buildScale(toNote(root), type);
        const pitched = getScaleNotesWithOctaves(scale.notes, 4);
        const sig = getKeySignatureForScale(scale.root, type);
        const sigAcc = sigAccidentals(sig);
        const accs = vexAccidentals(pitched, sig);
        const lineState = new Map<string, string>();
        pitched.forEach((n, i) => {
          const p = vexParse(pitchedNoteToVexKey(n));
          const line = `${p.letter}${p.octave}`;
          const before = lineState.get(line) ?? sigAcc[p.letter] ?? '';
          const drawn = accs[i];
          if (drawn !== null && (drawn === 'n' ? '' : drawn) === before) redundant.push(`${root} ${type}: ${drawn} on ${n.natural}${n.accidental}`);
          const shown = drawn === null ? before : drawn === 'n' ? '' : drawn;
          lineState.set(line, shown);
          const readPc = mod12(LETTER_PC[p.letter] + ACC_OFFSET[shown]);
          if (readPc !== pcOf(n.natural + n.accidental)) wrong.push(`${root} ${type} (sig ${sig}): ${n.natural}${n.accidental} reads as ${p.letter}${shown}`);
        });
      }
    }
    expect(wrong).toEqual([]);
    expect(redundant).toEqual([]);
  });
});

// ─── Part 2: real VexFlow ─────────────────────────────────────────────────────

(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
  observe() {}
  disconnect() {}
};

const GLYPH: Record<number, string> = { 0xe260: 'b', 0xe261: 'n', 0xe262: '#', 0xe263: '##', 0xe264: 'bb' };

async function renderStaff(notes: PitchedNote[], props: { keySignature?: string; clef?: 'treble' | 'bass' } = {}) {
  const { container } = render(<StaffNotation notes={notes} width={700} height={130} {...props} />);
  await waitFor(() => expect(container.querySelectorAll('svg g.vf-stavenote').length).toBeGreaterThan(0), { timeout: 15000 });
  const svg = container.querySelector('svg')!;
  const texts = [...svg.querySelectorAll('text')];
  const glyphsIn = (cls: string) =>
    texts.filter((t) => t.parentElement?.getAttribute('class') === cls).flatMap((t) => [...(t.textContent ?? '')].map((c) => c.codePointAt(0)!));
  const noteAccidentals = texts
    .filter((t) => !['vf-clef', 'vf-keysignature'].includes(t.parentElement?.getAttribute('class') ?? ''))
    .flatMap((t) => [...(t.textContent ?? '')].map((c) => GLYPH[c.codePointAt(0)!]).filter(Boolean));
  const noteheadYs = [...svg.querySelectorAll('g.vf-stavenote')].map((g) => {
    const head = [...g.querySelectorAll('text')].find((t) => !GLYPH[(t.textContent ?? '').codePointAt(0) ?? 0]);
    return Number(head?.getAttribute('y'));
  });
  // The clef glyph is anchored to the G line, so it marks where the stave sits.
  const clefY = Number(texts.find((t) => t.parentElement?.getAttribute('class') === 'vf-clef')?.getAttribute('y'));
  return { clefGlyphs: glyphsIn('vf-clef'), noteAccidentals, noteheadYs, clefY };
}

const scaleStaff = (root: string, type: ScaleType) => {
  const scale = buildScale(toNote(root), type);
  return {
    notes: getScaleNotesWithOctaves(scale.notes, 4),
    keySignature: getKeySignatureForScale(scale.root, type) ?? undefined,
  };
};

describe('real VexFlow staff', () => {
  beforeEach(() => {
    cleanup();
    useAppStore.setState({ instrument: 'piano' });
  });

  it('W1-03: C harmonic minor shows a natural on B and no repeated flats', async () => {
    const { notes, keySignature } = scaleStaff('C', 'harmonic_minor');
    expect(keySignature).toBe('Cm');
    const r = await renderStaff(notes, { keySignature });
    expect(r.noteAccidentals).toEqual(['n']);
  });

  it('W1-03: C melodic minor shows naturals on A and B', async () => {
    const { notes, keySignature } = scaleStaff('C', 'melodic_minor');
    const r = await renderStaff(notes, { keySignature });
    expect(r.noteAccidentals).toEqual(['n', 'n']);
  });

  it('W1-03: Eb major and C# major print no accidentals on the notes', async () => {
    for (const root of ['Eb', 'C#']) {
      const { notes, keySignature } = scaleStaff(root, 'major');
      const r = await renderStaff(notes, { keySignature });
      expect(r.noteAccidentals, root).toEqual([]);
      cleanup();
    }
  });

  it('W1-02: C# major and Ab minor step upward (B# and Cb on the right line)', async () => {
    for (const [root, type] of [['C#', 'major'], ['Ab', 'natural_minor']] as const) {
      const { notes, keySignature } = scaleStaff(root, type);
      const r = await renderStaff(notes, { keySignature });
      for (let i = 1; i < r.noteheadYs.length; i++) {
        expect(r.noteheadYs[i], `${root} ${type} note ${i}`).toBeLessThan(r.noteheadYs[i - 1]);
      }
      cleanup();
    }
  });

  it('W3-12: with the guitar selected the staff uses the treble clef with the 8 below', async () => {
    useAppStore.setState({ instrument: 'guitar' });
    const { notes } = scaleStaff('C', 'major');
    const r = await renderStaff(notes);
    expect(r.clefGlyphs).toContain(0xe052);
    cleanup();
    // even where the piano would switch to the bass clef
    const low = await renderStaff([{ natural: 'A', accidental: '', octave: 3 }], { clef: 'bass' });
    expect(low.clefGlyphs).toContain(0xe052);
    expect(low.clefGlyphs).not.toContain(0xe062);
  });

  it('W3-12: the piano is unchanged (plain treble; bass when asked)', async () => {
    const { notes } = scaleStaff('C', 'major');
    const r = await renderStaff(notes);
    expect(r.clefGlyphs).toContain(0xe050);
    expect(r.clefGlyphs).not.toContain(0xe052);
    cleanup();
    const low = await renderStaff([{ natural: 'A', accidental: '', octave: 3 }], { clef: 'bass' });
    expect(low.clefGlyphs).toContain(0xe062);
  });
});

describe('W3-12 review B3 — the guitar staff is written an octave above sounding', () => {
  beforeEach(() => {
    cleanup();
    useAppStore.setState({ instrument: 'piano' });
  });

  it('sounding C4 is written c/5 under the treble-8vb clef; unchanged for the piano', () => {
    const c4: PitchedNote = { natural: 'C', accidental: '', octave: 4 };
    expect(writtenStaffNotes([c4], '8vb').map(pitchedNoteToVexKey)).toEqual(['c/5']);
    expect(writtenStaffNotes([c4]).map(pitchedNoteToVexKey)).toEqual(['c/4']);
  });

  it('the same notes sit exactly one octave (35 px) higher on the guitar staff', async () => {
    const { notes } = scaleStaff('C', 'major');
    const piano = await renderStaff(notes);
    cleanup();
    useAppStore.setState({ instrument: 'guitar' });
    const guitar = await renderStaff(notes);
    expect(guitar.noteheadYs).toHaveLength(piano.noteheadYs.length);
    // The guitar staff may grow taller for ledger lines, moving the stave down;
    // measure every note from the clef (anchored to the stave) to cancel that.
    guitar.noteheadYs.forEach((y, i) => {
      expect(y - guitar.clefY, `note ${i}`).toBe(piano.noteheadYs[i] - piano.clefY - 35);
    });
  });
});
