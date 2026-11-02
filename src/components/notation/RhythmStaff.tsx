/* eslint-disable no-restricted-syntax -- VexFlow writes raw '#000000' /
   'black' into SVG style attributes; they are re-coloured to the theme here
   (comparison targets, not new colours) — the same treatment as useStaffNotation. */
/**
 * A rhythm on a one-line staff (audit W5-64): time signature, note values
 * with dots, rests, ties, eighth-note triplets, accents and barlines, beamed
 * by the time signature's beat groups. VexFlow is lazy-loaded (the shared
 * loader); the drawing follows the theme. Its text alternative names every
 * value ("A rhythm in 4/4: quarter note, quarter note, half note | …").
 */
import { useEffect, useRef, useState } from 'react';
import { loadVexFlow } from '../../utils/vexflowLoader';
import { useResolvedTheme } from '../../hooks/useTheme';
import { parseRhythm, type RhythmToken } from '../../core/utils/rhythm';
import { useRhythmDescription } from './rhythmDescription';
import type { RhythmPattern } from '../../core/types/exercise';

const HEIGHT = 110;
const VEX_DURATION: Record<RhythmToken['base'], string> = { w: 'w', h: 'h', q: 'q', '8': '8', '16': '16' };

type VexFlow = typeof import('vexflow/bravura');

function draw(vf: VexFlow, container: HTMLDivElement, pattern: RhythmPattern, width: number) {
  const { Renderer, Stave, StaveNote, Voice, Formatter, Beam, Dot, Tuplet, StaveTie, BarNote, Articulation } = vf;
  container.innerHTML = '';
  const parsed = parseRhythm(pattern);
  const renderer = new Renderer(container, Renderer.Backends.SVG);
  renderer.resize(width, HEIGHT);
  const context = renderer.getContext();
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#e4e4e7';
  const ctx = context as unknown as Record<string, ((v: string) => void) | undefined>;
  ctx.setStrokeStyle?.(textColor);
  ctx.setFillStyle?.(textColor);

  // A percussion staff (the neutral clef: no pitch), every value on the
  // middle line, stems up — the usual way to write a rhythm alone.
  const stave = new Stave(8, 10, width - 16);
  stave.addClef('percussion');
  stave.addTimeSignature(pattern.time);
  stave.setContext(context).draw();

  const tickables: InstanceType<typeof StaveNote | typeof BarNote>[] = [];
  const notes: InstanceType<typeof StaveNote>[] = [];
  const triplets: InstanceType<typeof StaveNote>[][] = [];
  let tripletRun: InstanceType<typeof StaveNote>[] = [];
  const beamable: InstanceType<typeof StaveNote>[][] = [[]];
  parsed.bars.forEach((bar, b) => {
    if (b > 0) {
      tickables.push(new BarNote());
      beamable.push([]);
    }
    for (const token of bar) {
      const note = new StaveNote({
        keys: ['b/4'],
        duration: `${VEX_DURATION[token.base]}${token.rest ? 'r' : ''}`,
        dots: token.dotted ? 1 : 0,
        stemDirection: 1,
        clef: 'percussion',
      });
      if (token.dotted) Dot.buildAndAttach([note], { all: true });
      if (token.accent && !token.rest) note.addModifier(new Articulation('a>').setPosition(4), 0);
      tickables.push(note);
      notes.push(note);
      if (token.triplet) {
        tripletRun.push(note);
        if (tripletRun.length === 3) {
          triplets.push(tripletRun);
          tripletRun = [];
        }
      } else {
        beamable[beamable.length - 1].push(note);
      }
    }
  });

  const voice = new Voice({ numBeats: 4, beatValue: 4 }).setMode(Voice.Mode.SOFT);
  voice.addTickables(tickables);
  const beams = beamable.flatMap((group) =>
    group.length ? Beam.generateBeams(group, { groups: Beam.getDefaultBeamGroups(pattern.time), stemDirection: 1 }) : [],
  );
  const tuplets = triplets.map((group) => {
    beams.push(new Beam(group));
    return new Tuplet(group, { numNotes: 3, notesOccupied: 2, bracketed: false });
  });
  new Formatter().joinVoices([voice]).format([voice], Math.max(40, stave.getNoteEndX() - stave.getNoteStartX() - 8));
  voice.draw(context, stave);
  beams.forEach((beam) => beam.setContext(context).draw());
  tuplets.forEach((tuplet) => tuplet.setContext(context).draw());

  // Ties: a note marked '~' joins the next one.
  const flat = parsed.bars.flat();
  flat.forEach((token, i) => {
    if (!token.tie || !notes[i + 1]) return;
    new StaveTie({ firstNote: notes[i], lastNote: notes[i + 1], firstIndexes: [0], lastIndexes: [0] }).setContext(context).draw();
  });

  const svg = container.querySelector('svg');
  if (svg) {
    svg.querySelectorAll<SVGElement>('line, path, rect').forEach((el) => {
      if (!el.style.fill || el.style.fill === 'none' || el.style.fill === 'black' || el.style.fill === '#000000') el.style.fill = textColor;
      if (!el.style.stroke || el.style.stroke === 'none' || el.style.stroke === 'black' || el.style.stroke === '#000000') el.style.stroke = textColor;
    });
    svg.querySelectorAll<SVGElement>('text').forEach((el) => {
      if (!el.style.fill || el.style.fill === 'black' || el.style.fill === '#000000') el.style.fill = textColor;
    });
    svg.setAttribute('aria-hidden', 'true');
  }
}

export function RhythmStaff({ pattern, className }: { pattern: RhythmPattern; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vf, setVf] = useState<VexFlow | null>(null);
  const [width, setWidth] = useState(0);
  const theme = useResolvedTheme();
  const label = useRhythmDescription(pattern);

  useEffect(() => {
    let cancelled = false;
    loadVexFlow().then((mod) => { if (!cancelled) setVf(mod); }).catch(() => { /* offline: the box stays, the label still describes it */ });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!vf || !el || width < 80) return;
    draw(vf, el, pattern, Math.min(width, 520));
  }, [vf, pattern, width, theme]);

  return <div ref={ref} role="img" aria-label={label} className={className} data-testid="rhythm-staff" style={{ width: '100%', height: HEIGHT }} />;
}
