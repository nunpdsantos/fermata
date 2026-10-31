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
import { pitchedNoteToVexKey, vexAccidentals, staffLayout, staffPlan } from '../../utils/notationHelpers';
import { useAppStore } from '../../state/store';
import type { PitchedNote } from '../../core/types/music';

interface UseStaffNotationOptions {
  notes: PitchedNote[];
  clef?: 'treble' | 'bass';
  keySignature?: string;
  width?: number;
  height?: number;
  noteColors?: Record<number, string>;
  duration?: string;
  /** When true, render all notes stacked as a single chord (one StaveNote with
   *  multiple keys). When false (default), render each note sequentially. */
  chord?: boolean;
  /** Draw what the selected instrument plays (guitar: treble-8vb, written an
   *  octave up). Only for Explore's staves — authored notation never follows. */
  followInstrument?: boolean;
}

export function useStaffNotation(options: UseStaffNotationOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const vfRef = useRef<typeof import('vexflow') | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const themeMode = useAppStore((s) => s.themeMode);
  const instrument = useAppStore((s) => s.instrument);

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
    return { ...plan, layout: staffLayout(plan.written, plan.clef, options.height ?? 150) };
  }, [options.notes, options.clef, options.height, options.followInstrument, instrument]);
  const layout = staff.layout;

  // Load VexFlow
  useEffect(() => {
    let cancelled = false;
    loadVexFlow().then((vf) => {
      if (!cancelled) {
        vfRef.current = vf;
        setLoading(false);
      }
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

    // Read CSS custom properties for theme colors
    const computedStyle = getComputedStyle(document.documentElement);
    const textColor = computedStyle.getPropertyValue('--text').trim() || '#e4e4e7';

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

    stave.setContext(context).draw();

    // Build notes
    if (written.length === 0) return;

    // Accidentals as a correctly written measure needs them under the key
    // signature: none where the signature supplies it, a natural where the
    // signature would otherwise alter the note (audit W1-03).
    const accidentals = vexAccidentals(written, options.keySignature);

    let staveNotes: InstanceType<typeof StaveNote>[];
    if (options.chord) {
      // Stacked-chord mode: one StaveNote with all keys.
      const keys = written.map(pitchedNoteToVexKey);
      const sn = new StaveNote({ keys, duration, clef });
      options.notes.forEach((_, i) => {
        const acc = accidentals[i];
        if (acc) sn.addModifier(new Accidental(acc), i);
      });
      // Use the first provided color for the whole chord (StaveNote-level styling).
      const firstColor = options.noteColors?.[0];
      if (firstColor) {
        sn.setStyle({ fillStyle: firstColor, strokeStyle: firstColor });
      }
      staveNotes = [sn];
    } else {
      // Sequential mode: one StaveNote per pitched note.
      staveNotes = written.map((note, i) => {
        const key = pitchedNoteToVexKey(note);
        const sn = new StaveNote({ keys: [key], duration, clef });

        const acc = accidentals[i];
        if (acc) {
          sn.addModifier(new Accidental(acc), 0);
        }

        // Apply degree color if provided
        if (options.noteColors?.[i]) {
          sn.setStyle({
            fillStyle: options.noteColors[i],
            strokeStyle: options.noteColors[i],
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

    // Apply theme colors to SVG elements
    const svg = container.querySelector('svg');
    if (svg) {
      svg.querySelectorAll('line, path').forEach((el) => {
        const elem = el as SVGElement;
        // Only override elements that don't have degree colors set
        if (!elem.style.fill || elem.style.fill === 'none' || elem.style.fill === 'black' || elem.style.fill === '#000000') {
          elem.style.fill = textColor;
        }
        if (!elem.style.stroke || elem.style.stroke === 'none' || elem.style.stroke === 'black' || elem.style.stroke === '#000000') {
          elem.style.stroke = textColor;
        }
      });
      svg.querySelectorAll('text').forEach((el) => {
        if (!el.style.fill || el.style.fill === 'black' || el.style.fill === '#000000') {
          el.style.fill = textColor;
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- themeMode triggers re-render so CSS custom properties are re-read
  }, [loading, containerWidth, options.notes, options.clef, options.keySignature, options.width, options.height, options.noteColors, options.duration, options.chord, themeMode, staff]);

  // Trigger render when dependencies change
  useEffect(() => {
    render();
  }, [render]);

  return { containerRef, loading, height: layout.height };
}
