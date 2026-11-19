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
import { demoStaffPlan, demoStaffLayout, demoBoxStyle, type PlannedNote } from './demoStaffPlan';
import { DemoStaffPlaceholder } from './DemoStaffPlaceholder';

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
    // Drawn at least as wide as its notes need (`layout.width`); a narrower
    // box shows it scaled down (the SVG fills the box, which keeps its shape).
    const drawWidth = Math.max(width, layout.width);
    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(drawWidth, layout.height);
    const context = renderer.getContext();
    const svgEl = container.querySelector('svg');
    svgEl?.setAttribute('viewBox', `0 0 ${drawWidth} ${layout.height}`);
    // VexFlow sizes the SVG in pixels, as attributes and as a style: the box decides instead.
    svgEl?.setAttribute('width', '100%');
    svgEl?.setAttribute('height', '100%');
    if (svgEl) {
      svgEl.style.width = '100%';
      svgEl.style.height = '100%';
      svgEl.style.display = 'block';
    }
    const computed = getComputedStyle(document.documentElement);
    const textColor = computed.getPropertyValue('--text').trim() || '#e4e4e7';
    context.setFont('Arial', 10);
    const ctx = context as unknown as Record<string, ((v: string) => void) | undefined>;
    ctx.setStrokeStyle?.(textColor);
    ctx.setFillStyle?.(textColor);

    // Line by line (the author's line breaks): the staves, a grand staff
    // leaving room on the left for its brace; clef and key signature on every
    // line, the time signature on the first.
    const grand = plan.staves.length > 1;
    const x = grand ? 22 : 10;
    for (let row = 0; row < plan.rows; row++) {
      const staves = plan.staves.map((clef, i) => {
        const stave = new Stave(x, layout.rowTops[row] + layout.ys[i], drawWidth - x - 10);
        stave.addClef(clef);
        if (plan.key) stave.addKeySignature(plan.key);
        if (plan.time && row === 0) stave.addTimeSignature(plan.time);
        return stave;
      });
      if (grand) Stave.formatBegModifiers(staves);
      staves.forEach((st) => st.setContext(context).draw());
      if (grand) {
        new StaveConnector(staves[0], staves[1]).setType('brace').setContext(context).draw();
        new StaveConnector(staves[0], staves[1]).setType('singleLeft').setContext(context).draw();
        new StaveConnector(staves[0], staves[1]).setType('singleRight').setContext(context).draw();
      }

      // The voices of this line: each note with its signs and dots, a bar line where a bar ends.
      const drawn = plan.voices.map((voice) => {
        const clef = voice.staff;
        const indexed = voice.notes.map((n, k) => [n, k] as const).filter(([n]) => n.row === row);
        const notes = indexed.map(([n]: readonly [PlannedNote, number]) => {
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
        const tickables = notes.flatMap((sn, i) => (voice.barsAfter.includes(indexed[i][1]) ? [sn, new BarNote()] : [sn]));
        const total = indexed.reduce((sum, [n]) => sum + n.beats, 0);
        const vf = new Voice({ numBeats: Math.max(1, Math.round(total * 2)), beatValue: 8 }).setMode(Voice.Mode.SOFT);
        vf.addTickables(tickables);
        return { voice, indexed, notes, v: vf, stave: staves[plan.staves.indexOf(clef)] };
      });
      const formatter = new Formatter();
      for (const stave of staves) {
        const group = drawn.filter((d) => d.stave === stave && d.notes.length).map((d) => d.v);
        if (group.length) formatter.joinVoices(group);
      }
      const room = Math.min(...staves.map((st) => st.getNoteEndX() - st.getNoteStartX())) - 10;
      const withNotes = drawn.filter((d) => d.notes.length);
      formatter.format(withNotes.map((d) => d.v), Math.max(40, room));
      withNotes.forEach((d) => {
        d.v.draw(context, d.stave);
        d.notes.forEach((sn) => sn.getSVGElement()?.setAttribute('data-voice', String(plan.voices.indexOf(d.voice))));
        // Ties never cross a line (the check refuses it).
        d.indexed.forEach(([n], k) => {
          if (!n.tieToNext || !d.notes[k + 1]) return;
          const indexes = n.keys.map((_, i) => i);
          new StaveTie({ firstNote: d.notes[k], lastNote: d.notes[k + 1], firstIndexes: indexes, lastIndexes: indexes }).setContext(context).draw();
        });
      });
    }

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

  if (loading) return <DemoStaffPlaceholder demo={demo} />;
  return (
    <div role="img" aria-label={description} data-testid="demo-staff" className="min-w-0" style={demoBoxStyle(layout)}>
      <div ref={containerRef} aria-hidden="true" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
