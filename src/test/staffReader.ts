/**
 * Reads a staff the way a musician reads it: from what VexFlow DREW, not from
 * the data it was given (second audit, M50–M56: a lesson's demonstration must
 * draw what it plays). Every staff line, clef, key-signature sign, notehead,
 * accidental, dot, rest, bar line and tie is a glyph or a path at a position in
 * the SVG; this turns positions into pitches:
 *
 *  - each `g.vf-stave` is one staff, its five line paths give its top line and
 *    the line spacing (VexFlow: 10 px); its clef glyph says treble or bass;
 *  - a notehead's height above the bottom line, in half spaces, is its step
 *    above E4 (treble) or G2 (bass); the letter and octave follow;
 *  - its accidental is the sign drawn beside it, else one drawn earlier in the
 *    same bar on the same line or space, else the key signature's for that
 *    letter (the signs after the clef, read the same way);
 *  - a note's value is its notehead (whole, half, black) with a flag or a dot;
 *    a rest by its glyph; a tie joins the notes at its two ends.
 *
 * Self-contained (no imports, nothing outside the function bodies), so a
 * browser test can hand `readStaffSvg` to `page.evaluate` as it is, and the
 * unit tests call it on jsdom's SVG. Glyphs are SMuFL code points (Bravura).
 *
 * Which voice a note belongs to is not something a glyph says when two voices
 * share a staff: the drawing marks each note's group with `data-voice` and the
 * reader reports it (absent = voice "0").
 */

export type DrawnValue = 'w' | 'h' | 'q' | '8';

export interface DrawnStaff {
  clef: 'treble' | 'bass' | '?';
  /** The key signature, left to right: each sign and the letter of its line or space. */
  signature: { sign: '#' | 'b'; letter: string }[];
  /** The time signature as drawn ("4/4"), if any. */
  time?: string;
}

export interface DrawnNote {
  staff: number;
  voice: string;
  x: number;
  /** Written pitches, low to high, as "F#5" / "Bb3" / "C4" (empty for a rest). */
  pitches: string[];
  /** The accidental glyphs drawn beside this note's heads (empty when the signature or the bar supplies them). */
  printed: string[];
  value: DrawnValue;
  dotted: boolean;
  rest: boolean;
  /** A tie leaves this note for the next one (same voice). */
  tiedToNext: boolean;
}

export interface DrawnScore {
  staves: DrawnStaff[];
  /** In reading order: staff by staff, left to right. */
  notes: DrawnNote[];
  /** Bar lines drawn between notes (the staff's own end lines excluded), per staff. */
  barlines: number[][];
  /** Ties drawn. */
  ties: number;
  /** A brace joins two staves (a grand staff). */
  brace: boolean;
}

export function readStaffSvg(svg: Element): DrawnScore {
  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const BOTTOM = { treble: 2 + 7 * 4, bass: 4 + 7 * 2 } as const;
  const code = (el: Element) => (el.textContent ?? '').codePointAt(0) ?? 0;
  const num = (el: Element, attr: string) => Number(el.getAttribute(attr) ?? 'NaN');
  const NOTEHEAD: Record<number, DrawnValue> = { 0xe0a2: 'w', 0xe0a3: 'h', 0xe0a4: 'q' };
  const REST: Record<number, DrawnValue> = { 0xe4e3: 'w', 0xe4e4: 'h', 0xe4e5: 'q', 0xe4e6: '8' };
  const ACC: Record<number, string> = { 0xe260: 'b', 0xe261: 'n', 0xe262: '#', 0xe263: '##', 0xe264: 'bb' };
  const FLAGS = new Set([0xe240, 0xe241]);
  const DOT = 0xe1e7;

  // ── Staves: their lines, clef, key and time signatures ──
  type StaffGeo = { top: number; bottom: number; staff: DrawnStaff; x0: number; x1: number };
  const geos: StaffGeo[] = [];
  const staveGroups = [...svg.querySelectorAll('g.vf-stave')];
  for (const g of staveGroups) {
    const ys = [...g.querySelectorAll('path')].map((p) => {
      const m = /M\s*([\d.-]+)\s+([\d.-]+)\s*L\s*([\d.-]+)/.exec(p.getAttribute('d') ?? '');
      return m ? { y: Math.floor(Number(m[2])), x0: Number(m[1]), x1: Number(m[3]) } : null;
    }).filter((v): v is { y: number; x0: number; x1: number } => v !== null);
    if (ys.length < 5) continue;
    const top = Math.min(...ys.map((v) => v.y));
    geos.push({ top, bottom: top + 40, staff: { clef: '?', signature: [] }, x0: ys[0].x0, x1: ys[0].x1 });
  }
  const staffOf = (y: number) => {
    let best = 0;
    geos.forEach((geo, i) => {
      if (Math.abs(y - (geo.top + 20)) < Math.abs(y - (geos[best].top + 20))) best = i;
    });
    return best;
  };
  const stepAt = (geo: StaffGeo, y: number) => {
    const clef = geo.staff.clef === 'bass' ? 'bass' : 'treble';
    return BOTTOM[clef] + Math.round((geo.bottom - y) / 5);
  };
  const pitchOf = (step: number, acc: string) => `${LETTERS[((step % 7) + 7) % 7]}${acc === 'n' ? '' : acc}${Math.floor(step / 7)}`;

  for (const g of svg.querySelectorAll('g.vf-clef')) {
    const t = g.querySelector('text');
    if (!t || !geos.length) continue;
    const geo = geos[staffOf(num(t, 'y'))];
    geo.staff.clef = code(t) === 0xe050 ? 'treble' : code(t) === 0xe062 ? 'bass' : '?';
  }
  for (const g of svg.querySelectorAll('g.vf-keysignature')) {
    for (const t of g.querySelectorAll('text')) {
      const geo = geos[staffOf(num(t, 'y'))];
      const sign = ACC[code(t)];
      if (sign !== '#' && sign !== 'b') continue;
      geo.staff.signature.push({ sign, letter: LETTERS[((stepAt(geo, num(t, 'y')) % 7) + 7) % 7] });
    }
  }
  for (const g of svg.querySelectorAll('g.vf-timesignature')) {
    const digits = [...g.querySelectorAll('text')].sort((a, b) => num(a, 'y') - num(b, 'y'))
      .map((t) => String.fromCharCode(48 + code(t) - 0xe080));
    if (digits.length >= 2 && geos.length) geos[staffOf(num(g.querySelector('text')!, 'y'))].staff.time = `${digits[0]}/${digits[1]}`;
  }

  // ── Bar lines inside the staff (not its two ends) ──
  const barlines: number[][] = geos.map(() => []);
  for (const g of svg.querySelectorAll('g.vf-stavebarline')) {
    const r = g.querySelector('rect');
    if (!r) continue;
    const x = num(r, 'x');
    const geo = geos[staffOf(num(r, 'y') + 20)];
    if (Math.abs(x - geo.x0) < 2 || Math.abs(x - geo.x1) < 2) continue;
    barlines[geos.indexOf(geo)].push(x);
  }
  barlines.forEach((b) => b.sort((a, c) => a - c));

  // ── Notes, chords and rests ──
  type Raw = DrawnNote & { heads: { x: number; y: number; step: number; printed?: string }[] };
  const raws: Raw[] = [];
  for (const g of svg.querySelectorAll('g.vf-stavenote')) {
    const texts = [...g.querySelectorAll('text')];
    const heads = texts.filter((t) => NOTEHEAD[code(t)] !== undefined);
    const rest = texts.find((t) => REST[code(t)] !== undefined);
    const anchor = heads[0] ?? rest;
    if (!anchor) continue;
    const staff = staffOf(heads.length ? heads.reduce((s, h) => s + num(h, 'y'), 0) / heads.length : num(anchor, 'y'));
    const geo = geos[staff];
    const accs = texts.filter((t) => ACC[code(t)] !== undefined);
    const headInfo = heads.map((h) => {
      const y = num(h, 'y');
      const beside = accs.find((a) => Math.abs(num(a, 'y') - y) < 0.5 && num(a, 'x') < num(h, 'x'));
      return { x: num(h, 'x'), y, step: stepAt(geo, y), printed: beside ? ACC[code(beside)] : undefined };
    }).sort((a, b) => a.step - b.step);
    let value: DrawnValue = rest ? REST[code(rest)] : NOTEHEAD[code(heads[0])];
    if (!rest && value === 'q' && texts.some((t) => FLAGS.has(code(t)))) value = '8';
    raws.push({
      staff,
      voice: g.getAttribute('data-voice') ?? g.closest('[data-voice]')?.getAttribute('data-voice') ?? '0',
      x: num(anchor, 'x'),
      pitches: [],
      printed: headInfo.flatMap((h) => (h.printed ? [h.printed] : [])),
      value,
      dotted: texts.some((t) => code(t) === DOT),
      rest: !heads.length,
      tiedToNext: false,
      heads: headInfo,
    });
  }
  raws.sort((a, b) => a.staff - b.staff || a.x - b.x);

  // Accidentals: beside the note, else earlier in the bar on the same step, else the signature.
  for (let s = 0; s < geos.length; s++) {
    const sig = new Map(geos[s].staff.signature.map((k) => [k.letter, k.sign as string]));
    let bar = new Map<number, string>();
    let barIndex = 0;
    for (const n of raws.filter((r) => r.staff === s)) {
      while (barIndex < barlines[s].length && barlines[s][barIndex] < n.x) {
        bar = new Map();
        barIndex++;
      }
      n.pitches = n.heads.map((h) => {
        if (h.printed) bar.set(h.step, h.printed);
        const acc = h.printed ?? bar.get(h.step) ?? sig.get(LETTERS[((h.step % 7) + 7) % 7]) ?? '';
        return pitchOf(h.step, acc);
      });
    }
  }

  // Ties: a path from one notehead to a later one on the same staff.
  const tieGroups = [...svg.querySelectorAll('g.vf-stavetie')];
  for (const g of tieGroups) {
    const m = /M\s*([\d.-]+)\s+([\d.-]+)\s*Q\s*[\d.-]+\s+[\d.-]+\s*,\s*([\d.-]+)/.exec(g.querySelector('path')?.getAttribute('d') ?? '');
    if (!m) continue;
    const [x1, y, x2] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const staff = staffOf(y);
    const from = raws.find((r) => r.staff === staff && r.heads.some((h) => Math.abs(h.x - x1) < 1));
    const to = raws.find((r) => r.staff === staff && r.heads.some((h) => Math.abs(h.x - x2) < 1));
    if (from && to && from !== to) from.tiedToNext = true;
  }

  const brace = [...svg.querySelectorAll('path')].some((p) => /C/.test(p.getAttribute('d') ?? '') && !p.closest('g.vf-stavetie') && !p.closest('g.vf-stavenote'));
  return {
    staves: geos.map((g) => g.staff),
    notes: raws.map(({ heads: _heads, ...n }) => n),
    barlines,
    ties: tieGroups.length,
    brace: brace && geos.length > 1,
  };
}

/** Quarter-note beats of a drawn value. */
export function drawnBeats(n: Pick<DrawnNote, 'value' | 'dotted'>): number {
  const base = { w: 4, h: 2, q: 1, '8': 0.5 }[n.value];
  return n.dotted ? base * 1.5 : base;
}

/** One sounding note as the drawing says it: its written pitch, when it starts and how long it lasts, in quarter-note beats (tied notes are one sound). */
export interface DrawnSound { pitch: string; at: number; beats: number }

/**
 * What the drawing says sounds: each voice read left to right, its onsets
 * added up from the values, a tie making one sound of two notes. Sorted by
 * onset, then pitch height.
 */
export function drawnSounds(score: DrawnScore): DrawnSound[] {
  const out: DrawnSound[] = [];
  const voices = new Map<string, DrawnNote[]>();
  for (const n of score.notes) {
    const key = `${n.staff}:${n.voice}`;
    voices.set(key, [...(voices.get(key) ?? []), n]);
  }
  for (const notes of voices.values()) {
    let at = 0;
    let carried: DrawnSound[] = [];
    for (const n of notes) {
      const beats = drawnBeats(n);
      const continuing = carried;
      carried = [];
      for (const pitch of n.pitches) {
        const held = continuing.find((c) => c.pitch === pitch);
        const sound = held ?? { pitch, at, beats: 0 };
        sound.beats += beats;
        if (!held) out.push(sound);
        if (n.tiedToNext) carried.push(sound);
      }
      at += beats;
    }
  }
  return out.sort((a, b) => a.at - b.at || midiOf(a.pitch) - midiOf(b.pitch));
}

/** MIDI number of a written pitch ("F#5" → 78; C4 = 60), from letter, accidental and octave. */
export function midiOf(pitch: string): number {
  const m = /^([A-G])(##|bb|#|b)?(-?\d)$/.exec(pitch);
  if (!m) throw new Error(`not a pitch: ${pitch}`);
  const pc = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1] as 'C'];
  const acc = { '#': 1, '##': 2, b: -1, bb: -2 }[m[2] as '#'] ?? 0;
  return 12 * (Number(m[3]) + 1) + pc + acc;
}
