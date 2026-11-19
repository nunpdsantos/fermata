/* eslint-disable no-restricted-syntax -- VexFlow injects raw hex values
   ('#000000', 'black') into SVG style attributes; the theme pass below
   re-colours them, as useStaffNotation does. The hex literals are comparison
   targets, not new design decisions. */
/**
 * The staff of a lesson demonstration (second audit, M50–M56): the plan of
 * `demoStaffPlan` drawn with VexFlow, through the app's own loader, key
 * strings and theme pass (the notation `StaffNotation` uses), on one staff or
 * on treble and bass joined by a brace: key and time signatures after the
 * clef, chords, rests, dots, ties, bar lines, two voices on a staff with
 * their stems apart. Each note's group carries `data-voice` (which voice it
 * is), the one thing a glyph cannot say.
 *
 * For a screen reader the drawing is one image named by the demonstration's
 * description (`describeDemonstration`: the staff, the key signature, every
 * note by name and value, voice by voice); the SVG itself is hidden.
 */
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import type { Demonstration } from '../../../core/types/demonstration';
import { loadVexFlow } from '../../../utils/vexflowLoader';
import { useResolvedTheme } from '../../../hooks/useTheme';
import { StaffNotationSkeleton } from '../../notation/StaffNotationSkeleton';
import { demoStaffPlan, demoStaffLayout, type PlannedNote } from './demoStaffPlan';

export function DemoStaff({ demo, description }: { demo: Demonstration; description: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vfRef = useRef<typeof import('vexflow') | null>(null);
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(0);
  const theme = useResolvedTheme();
  const plan = useMemo(() => demoStaffPlan(demo), [demo]);
  const layout = useMemo(() => demoStaffLayout(plan), [plan]);

  useEffect(() => {
    let cancelled = false;
    loadVexFlow().then((vf) => {
      if (!cancelled) {
        vfRef.current = vf;
        setLoading(false);
      }
    }).catch(() => {
      // Offline before VexFlow was ever cached: the skeleton stays; the next staff retries.
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (loading || !containerRef.current) return;
    setWidth(containerRef.current.getBoundingClientRect().width);
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setWidth(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [loading]);

  const draw = useCallback(() => {
    const container = containerRef.current;
    const vf = vfRef.current;
    if (!container || !vf || loading || width < 50) return;
    container.innerHTML = '';
    const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, Dot, BarNote, StaveTie, StaveConnector } = vf;
    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(width, layout.height);
    const context = renderer.getContext();
    container.querySelector('svg')?.setAttribute('viewBox', `0 0 ${width} ${layout.height}`);
    const computed = getComputedStyle(document.documentElement);
    const textColor = computed.getPropertyValue('--text').trim() || '#e4e4e7';
    context.setFont('Arial', 10);
    const ctx = context as unknown as Record<string, ((v: string) => void) | undefined>;
    ctx.setStrokeStyle?.(textColor);
    ctx.setFillStyle?.(textColor);

    // The staves: a grand staff leaves room on the left for its brace.
    const grand = plan.staves.length > 1;
    const x = grand ? 22 : 10;
    const staves = plan.staves.map((clef, i) => {
      const stave = new Stave(x, layout.ys[i], width - x - 10);
      stave.addClef(clef);
      if (plan.key) stave.addKeySignature(plan.key);
      if (plan.time) stave.addTimeSignature(plan.time);
      return stave;
    });
    if (grand) Stave.formatBegModifiers(staves);
    staves.forEach((s) => s.setContext(context).draw());
    if (grand) {
      new StaveConnector(staves[0], staves[1]).setType('brace').setContext(context).draw();
      new StaveConnector(staves[0], staves[1]).setType('singleLeft').setContext(context).draw();
      new StaveConnector(staves[0], staves[1]).setType('singleRight').setContext(context).draw();
    }

    // The voices: each note with its signs and dots, a bar line where a bar ends.
    const drawn = plan.voices.map((voice) => {
      const clef = voice.staff;
      const notes = voice.notes.map((n: PlannedNote) => {
        const sn = new StaveNote({
          keys: n.keys,
          duration: n.duration,
          clef,
          ...(n.stem ? { stemDirection: n.stem } : { autoStem: true }),
        });
        n.accidentals.forEach((a, k) => { if (a) sn.addModifier(new Accidental(a), k); });
        if (n.dots) Dot.buildAndAttach([sn], { all: true });
        return sn;
      });
      const tickables = notes.flatMap((sn, i) => (voice.barsAfter.includes(i) ? [sn, new BarNote()] : [sn]));
      const total = voice.notes.reduce((s, n) => s + n.beats, 0);
      const v = new Voice({ numBeats: Math.max(1, Math.round(total * 2)), beatValue: 8 }).setMode(Voice.Mode.SOFT);
      v.addTickables(tickables);
      return { voice, notes, v, stave: staves[plan.staves.indexOf(clef)] };
    });
    const formatter = new Formatter();
    for (const stave of staves) {
      const group = drawn.filter((d) => d.stave === stave).map((d) => d.v);
      if (group.length) formatter.joinVoices(group);
    }
    const room = Math.min(...staves.map((s) => s.getNoteEndX() - s.getNoteStartX())) - 10;
    formatter.format(drawn.map((d) => d.v), Math.max(40, room));
    drawn.forEach((d, i) => {
      d.v.draw(context, d.stave);
      d.notes.forEach((sn) => sn.getSVGElement()?.setAttribute('data-voice', String(i)));
      d.voice.notes.forEach((n, k) => {
        if (!n.tieToNext || !d.notes[k + 1]) return;
        const indexes = n.keys.map((_, j) => j);
        new StaveTie({ firstNote: d.notes[k], lastNote: d.notes[k + 1], firstIndexes: indexes, lastIndexes: indexes }).setContext(context).draw();
      });
    });

    // The theme: inline styles name the theme's variables, so a theme change or print recolours without a redraw.
    const TEXT = 'var(--text)';
    const svg = container.querySelector('svg');
    svg?.querySelectorAll('line, path').forEach((el) => {
      const e = el as SVGElement;
      if (!e.style.fill || e.style.fill === 'none' || e.style.fill === 'black' || e.style.fill === '#000000') e.style.fill = TEXT;
      if (!e.style.stroke || e.style.stroke === 'none' || e.style.stroke === 'black' || e.style.stroke === '#000000') e.style.stroke = TEXT;
    });
    // Bar lines are rectangles; the note groups' invisible hit boxes (opacity 0) stay as they are.
    svg?.querySelectorAll('rect').forEach((el) => {
      if (el.getAttribute('opacity') !== '0') (el as SVGElement).style.fill = TEXT;
    });
    svg?.querySelectorAll('text').forEach((el) => {
      if (!el.style.fill || el.style.fill === 'black' || el.style.fill === '#000000') el.style.fill = TEXT;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- theme triggers a redraw so the CSS colours are read again
  }, [loading, width, plan, layout, theme]);

  useEffect(() => { draw(); }, [draw]);

  if (loading) return <StaffNotationSkeleton height={layout.height} />;
  return (
    <div role="img" aria-label={description} data-testid="demo-staff" className="min-w-0">
      <div ref={containerRef} aria-hidden="true" style={{ width: '100%', height: layout.height, minHeight: layout.height }} />
    </div>
  );
}
