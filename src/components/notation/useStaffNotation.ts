/* eslint-disable no-restricted-syntax -- VexFlow injects raw hex values
   ('#000000', 'black') into SVG style attributes; this hook re-colors them
   to match the app theme. The hex literals here are comparison targets,
   not new design decisions. */
/**
 * Hook managing VexFlow loading + rendering lifecycle.
 * Handles dynamic import, ResizeObserver, theme reactivity.
 */
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { loadVexFlow } from '../../utils/vexflowLoader';
import { pitchedNoteToVexKey, vexAccidentals, staffLayout, staffPlan, staffStemDirections } from '../../utils/notationHelpers';
import { useAppStore } from '../../state/store';
import { useResolvedTheme } from '../../hooks/useTheme';
import type { PitchedNote } from '../../core/types/music';

interface UseStaffNotationOptions {
  notes: PitchedNote[];
  clef?: 'treble' | 'bass';
  annotation?: '8vb';
  keySignature?: string;
  width?: number;
  minNoteStartX?: number;
  height?: number;
  /** Note index → colour for the whole note (head, stem, ledger lines): a
   *  hex value or a CSS variable (`var(--deg-ink-3)`), resolved against the
   *  painted theme. Applied after the theme pass, which used to overwrite it
   *  (noteheads came out in --text whatever was asked — W11-B). */
  noteColors?: Record<number, string>;
  duration?: string;
  /** When true, render all notes stacked as a single chord (one StaveNote with
   *  multiple keys). When false (default), render each note sequentially. */
  chord?: boolean;
  /** Draw what the selected instrument plays (guitar: treble-8vb, written an
   *  octave up). Only for Explore's staves — authored notation never follows. */
  followInstrument?: boolean;
  /** Notes drawn in the dim text colour (--text-dim, still ≥ 4.5:1): the
   *  Explore strip fades the notes outside a selected chord this way —
   *  never by opacity, which would take a notehead under 3:1. */
  noteDim?: Record<number, boolean>;
  /** Called after every render with the centre x of each notehead (container
   *  px) and the staff's top / bottom line y — the Explore strip lines its
   *  note columns up under the noteheads with it. */
  onLayout?: (layout: StaffLayoutInfo) => void;
}

export interface StaffLayoutInfo {
  /** Centre x of each note (sequential mode), in container px. */
  xs: number[];
  /** Top and bottom staff-line y, in container px. */
  top: number;
  bottom: number;
  width: number;
}

export function useStaffNotation(options: UseStaffNotationOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const vfRef = useRef<typeof import('vexflow') | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  // The PAINTED theme (Auto follows the system) — CSS colours are re-read on change.
  const themeMode = useResolvedTheme();
  const instrument = useAppStore((s) => s.instrument);
  // Latest callback without re-rendering the staff when the caller's
  // function identity changes.
  const onLayoutRef = useRef(options.onLayout);
  useEffect(() => {
    onLayoutRef.current = options.onLayout;
  });

  // Height and stave position that fit every note, ledger lines included (the
  // exercise staff used to clip middle C at a fixed 100 px). Pure from props,
  // so the container and the SVG always agree.
  // What is WRITTEN. On a staff that follows the instrument, guitar music is
  // written an octave above where it sounds (treble-8vb, decision D-05) —
  // VexFlow's 8vb annotation only swaps the clef glyph (audit W3-12 review B3).
  // Authored notation (Learn) never follows the instrument. Layout, keys and
  // accidentals all use these written notes.
  const staff = useMemo(() => {
    const plan = staffPlan(options.notes, options.clef, instrument, options.followInstrument);
    const annotation = options.annotation ?? plan.annotation;
    return { ...plan, annotation, layout: staffLayout(plan.written, plan.clef, options.height ?? 150, {
      annotation, duration: options.duration, keySignature: options.keySignature, chord: options.chord,
    }) };
  }, [options.notes, options.clef, options.height, options.followInstrument, options.annotation, options.duration, options.keySignature, options.chord, instrument]);
  const layout = staff.layout;

  // Load VexFlow
  useEffect(() => {
    let cancelled = false;
    loadVexFlow().then((vf) => {
      if (!cancelled) {
        vfRef.current = vf;
        setLoading(false);
      }
    }).catch(() => {
      // Offline before VexFlow was ever cached: the staff skeleton stays;
      // the loader forgets the failure, so the next staff retries.
    });
    return () => { cancelled = true; };
  }, []);

  // ResizeObserver — must re-run after loading completes because the
  // container div only mounts once the skeleton is replaced.
  useEffect(() => {
    if (loading || !containerRef.current) return;
    // Synchronous initial measurement so render doesn't bail on width=0
    setContainerWidth(containerRef.current.getBoundingClientRect().width);
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [loading]);

  // Render function
  const render = useCallback(() => {
    const container = containerRef.current;
    const vf = vfRef.current;
    if (!container || !vf || loading) return;

    const w = options.width ?? containerWidth;
    if (w < 50) return; // too small

    const h = layout.height;
    const { clef, annotation, written } = staff;
    const duration = options.duration ?? 'q';

    // Clear previous render
    container.innerHTML = '';

    const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = vf;

    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(w, h);
    const context = renderer.getContext();
    // A viewBox, so a stylesheet may scale the drawing (the Explore strip
    // prints at the page's width with its note columns still under the heads).
    container.querySelector('svg')?.setAttribute('viewBox', `0 0 ${w} ${h}`);

    // Read CSS custom properties for theme colors
    const computedStyle = getComputedStyle(document.documentElement);
    const textColor = computedStyle.getPropertyValue('--text').trim() || '#e4e4e7';
    // A colour as the painted theme has it ("var(--deg-ink-3)" → "#9d174d").
    const resolve = (c: string) => {
      const m = /^var\((--[\w-]+)\)$/.exec(c.trim());
      return m ? computedStyle.getPropertyValue(m[1]).trim() || textColor : c;
    };

    context.setFont('Arial', 10);
    // VexFlow SVGContext exposes these methods but they're missing from RenderContext typings
    const ctx = context as unknown as Record<string, ((v: string) => void) | undefined>;
    ctx.setStrokeStyle?.(textColor);
    ctx.setFillStyle?.(textColor);

    // Build stave
    const staveX = 10;
    const staveY = layout.staveY;
    const staveWidth = w - 20;
    const stave = new Stave(staveX, staveY, staveWidth);
    if (annotation) stave.addClef(clef, 'default', annotation);
    else stave.addClef(clef);

    if (options.keySignature) {
      stave.addKeySignature(options.keySignature);
    }

    if (options.minNoteStartX !== undefined) {
      stave.setNoteStartX(Math.max(stave.getNoteStartX(), options.minNoteStartX));
    }

    stave.setContext(context).draw();

    // Build notes
    if (written.length === 0) return;

    // Accidentals as a correctly written measure needs them under the key
    // signature: none where the signature supplies it, a natural where the
    // signature would otherwise alter the note (audit W1-03).
    const accidentals = vexAccidentals(written, options.keySignature);

    const stems = staffStemDirections(written, clef, options.chord);
    let staveNotes: InstanceType<typeof StaveNote>[];
    if (options.chord) {
      // Stacked-chord mode: one StaveNote with all keys.
      const keys = written.map(pitchedNoteToVexKey);
      const sn = new StaveNote({ keys, duration, clef, stemDirection: stems[0] });
      options.notes.forEach((_, i) => {
        const acc = accidentals[i];
        if (acc) sn.addModifier(new Accidental(acc), i);
      });
      // Use the first provided color for the whole chord (StaveNote-level styling).
      const firstColor = options.noteColors?.[0];
      if (firstColor) {
        sn.setStyle({ fillStyle: resolve(firstColor), strokeStyle: resolve(firstColor) });
      }
      staveNotes = [sn];
    } else {
      // Sequential mode: one StaveNote per pitched note.
      staveNotes = written.map((note, i) => {
        const key = pitchedNoteToVexKey(note);
        const sn = new StaveNote({ keys: [key], duration, clef, stemDirection: stems[i] });

        const acc = accidentals[i];
        if (acc) {
          sn.addModifier(new Accidental(acc), 0);
        }

        // Apply degree color if provided
        if (options.noteColors?.[i]) {
          sn.setStyle({
            fillStyle: resolve(options.noteColors[i]),
            strokeStyle: resolve(options.noteColors[i]),
          });
        }

        return sn;
      });
    }

    const voice = new Voice({ numBeats: staveNotes.length, beatValue: 1 })
      .setMode(Voice.Mode.SOFT);
    voice.addTickables(staveNotes);

    // Format into the space left after the clef and key signature (a 7-sharp
    // signature used to push the last notes past the right edge).
    const formatWidth = Math.max(40, stave.getNoteEndX() - stave.getNoteStartX() - 10);
    new Formatter().joinVoices([voice]).format([voice], formatWidth);
    voice.draw(context, stave);


    // Apply theme colors to SVG elements. Inline styles name the theme's
    // VARIABLES (not the values read now), so a theme change — or printing,
    // whose stylesheet redefines them for paper — recolours the staff
    // without redrawing it (W11-B).
    const TEXT = 'var(--text)';
    const svg = container.querySelector('svg');
    if (svg) {
      svg.querySelectorAll('line, path').forEach((el) => {
        const elem = el as SVGElement;
        // Only override elements that don't have degree colors set
        if (!elem.style.fill || elem.style.fill === 'none' || elem.style.fill === 'black' || elem.style.fill === '#000000') {
          elem.style.fill = TEXT;
        }
        if (!elem.style.stroke || elem.style.stroke === 'none' || elem.style.stroke === 'black' || elem.style.stroke === '#000000') {
          elem.style.stroke = TEXT;
        }
      });
      svg.querySelectorAll('text').forEach((el) => {
        if (!el.style.fill || el.style.fill === 'black' || el.style.fill === '#000000') {
          el.style.fill = TEXT;
        }
      });
      // Per-note colours win over the theme pass (VexFlow puts them on the
      // note's group as attributes, which the inline theme fill above beat).
      const paint = (sn: InstanceType<typeof StaveNote>, colour: string) =>
        sn.getSVGElement()?.querySelectorAll<SVGElement>('text, path').forEach((el) => {
          el.style.fill = colour;
          el.style.stroke = colour;
        });
      staveNotes.forEach((sn, i) => {
        const c = options.chord ? options.noteColors?.[0] : options.noteColors?.[i];
        if (c) paint(sn, c);
      });
      if (options.noteDim) {
        staveNotes.forEach((sn, i) => {
          if (options.noteDim?.[i]) paint(sn, 'var(--text-dim)');
        });
      }
    }

    onLayoutRef.current?.({
      xs: options.chord ? [] : staveNotes.map((sn) => (sn.getNoteHeadBeginX() + sn.getNoteHeadEndX()) / 2),
      top: stave.getYForLine(0),
      bottom: stave.getYForLine(4),
      width: w,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- themeMode triggers re-render so CSS custom properties are re-read
  }, [loading, containerWidth, options.notes, options.clef, options.keySignature, options.width, options.minNoteStartX, options.height, options.noteColors, options.noteDim, options.duration, options.chord, themeMode, staff]);

  // Trigger render when dependencies change
  useEffect(() => {
    render();
  }, [render]);

  return { containerRef, loading, height: layout.height };
}
