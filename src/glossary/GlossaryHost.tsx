import '../i18n/glossary';
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../state/store.ts';
import { useMediaQuery, SHEET_QUERY } from '../hooks/useMediaQuery.ts';
import { Sheet } from '../components/ui/Sheet.tsx';
import { ScrollBody } from '../components/ui/ScrollBody.tsx';
import { Segment } from '../components/ui/Segment.tsx';
import { useExploreDetail } from '../state/exploreDetail.ts';
import type { ExploreDetail } from '../state/storeTypes.ts';
import { Button, IconButton } from '../components/ui/Button.tsx';
import { trapTab, focusableIn } from '../components/ui/focus.ts';
import { MODULE_INDEX } from '../data/moduleIndex.ts';
import { buildScale } from '../core/constants/scales.ts';
import { playTimedNotes, resumeAudio, cancelScheduledAudio } from '../core/services/audio.ts';
import { getMidiNumber } from '../core/utils/pianoLayout.ts';
import { getSynthConfig } from '../services/synthConfig.ts';
import { keyName } from '../components/explore/focusReadout.ts';
import { useGlossaryUi } from './glossaryUi.ts';
import { GLOSSARY, type GlossaryContext } from './entries.ts';
import { termTitle } from './termTitle.ts';
import type { TermId } from './termIds.ts';

const PLAY_ICON = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

function useGlossaryContext(): GlossaryContext {
  const root = useAppStore((s) => s.selectedKey);
  const scaleType = useAppStore((s) => s.selectedScale);
  const chord = useAppStore((s) => s.selectedChord);
  const instrument = useAppStore((s) => s.instrument);
  const baseOctave = useAppStore((s) => s.baseOctave);
  return useMemo(() => ({ root, scaleType, chord, instrument, baseOctave }), [root, scaleType, chord, instrument, baseOctave]);
}

/** ▶ Hear it: the entry's demonstration through the selected instrument, lit on it as it sounds. */
function useHear() {
  const synthPreset = useAppStore((s) => s.synthPreset);
  const [playing, setPlaying] = useState<TermId | null>(null);
  const timers = useRef<number[]>([]);
  const lit = useRef<Set<number>>(new Set());
  const stop = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
    const app = useAppStore.getState();
    for (const m of lit.current) app.removeActiveNote(m);
    lit.current.clear();
  }, []);
  useEffect(() => () => {
    stop();
    cancelScheduledAudio();
  }, [stop]);
  const play = useCallback(async (id: TermId, ctx: GlossaryContext) => {
    const notes = GLOSSARY[id]?.hear?.(ctx);
    if (!notes?.length) return;
    await resumeAudio();
    cancelScheduledAudio();
    stop();
    setPlaying(id);
    const app = useAppStore.getState();
    playTimedNotes(notes, getSynthConfig(synthPreset), {
      onNotePlay: (i) => {
        const n = notes[i];
        const midi = getMidiNumber(n.note, n.note.octave);
        lit.current.add(midi);
        app.addActiveNote(midi);
        timers.current.push(window.setTimeout(() => {
          lit.current.delete(midi);
          useAppStore.getState().removeActiveNote(midi);
        }, n.duration * 1000));
      },
      onComplete: () => setPlaying((p) => (p === id ? null : p)),
    });
  }, [synthPreset, stop]);
  return { play, playing };
}

/** Title, plain words, the worked example (or why it does not apply here), ▶ Hear it, Learn more. */
function Explanation({ id, descId, hear }: {
  id: TermId;
  descId?: string;
  hear: ReturnType<typeof useHear>;
}) {
  const { t } = useTranslation();
  const ctx = useGlossaryContext();
  const close = useGlossaryUi((s) => s.close);
  const spec = GLOSSARY[id];
  const scale = useMemo(() => buildScale(ctx.root, ctx.scaleType), [ctx.root, ctx.scaleType]);
  const key = keyName(scale, t);
  const notHere = spec?.notHere?.(ctx) ?? null;
  const example = notHere ? null : spec?.example?.(ctx, t) ?? null;
  const canHear = !!spec?.hear?.(ctx)?.length;
  const lesson = spec?.learn ? MODULE_INDEX.find((m) => m.id === spec.learn) : undefined;
  const line = notHere === 'only'
    ? t(`glossary.entries.${id}.only`)
    : notHere === 'sevenOnly'
      ? t('glossary.ui.sevenOnly', { key, n: scale.notes.length })
      : notHere === 'notHere'
        ? t('glossary.ui.notHere', { key })
        : example
          ? t(`glossary.entries.${id}.${example.template ?? 'example'}`, { key, ...example.vars })
          : null;
  return (
    <div className="glossary-explanation" data-entry={id}>
      <p id={descId} className="glossary-plain">{t(`glossary.entries.${id}.plain`)}</p>
      {line && <p className="glossary-example" data-testid="glossary-example" data-not-here={notHere ?? undefined}>{line}</p>}
      {(canHear || lesson) && (
        <div className="glossary-actions">
          {canHear && (
            <Button
              data-testid="glossary-hear"
              data-playing={hear.playing === id || undefined}
              startIcon={PLAY_ICON}
              onClick={() => void hear.play(id, ctx)}
            >
              {t('glossary.ui.hear')}
            </Button>
          )}
          {lesson && (
            <Button
              variant="link"
              data-testid="glossary-learn"
              onClick={() => {
                close();
                useAppStore.getState().openLearnTarget({ levelId: lesson.level, unitId: lesson.unitId, moduleId: lesson.id });
              }}
            >
              {t('glossary.ui.learn')} <span aria-hidden="true">→</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * A laptop's explanation: a small panel anchored to the word — under it when
 * there is room above the instrument, else over it — so it covers neither the
 * word nor the instrument more than it must. It floats (fixed): nothing on
 * the page moves. Focus goes into it; Escape, ✕ or a click outside closes it
 * and focus returns to the word.
 */
function Popover({ id, also, anchor, onClose, hear }: {
  id: TermId;
  also: TermId[];
  anchor: HTMLElement | null;
  onClose: (refocus: boolean) => void;
  hear: ReturnType<typeof useHear>;
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  const [at, setAt] = useState<{ top: number; left: number; width: number; maxHeight: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const place = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = Math.min(340, vw - 32);
      const r = anchor?.isConnected ? anchor.getBoundingClientRect() : new DOMRect(vw / 2, vh / 3, 0, 0);
      const dock = document.querySelector<HTMLElement>('[data-testid="instrument-dock"]');
      const dockTop = dock ? dock.getBoundingClientRect().top : vh;
      const floor = Math.min(vh, dockTop) - 8;
      el.style.width = `${width}px`;
      const h = el.scrollHeight;
      const left = Math.max(16, Math.min(r.left, vw - width - 16));
      const below = r.bottom + 8;
      const roomBelow = floor - below;
      const roomAbove = r.top - 8 - 8;
      let top: number;
      let maxHeight: number;
      if (h <= roomBelow || roomBelow >= roomAbove) {
        top = below;
        maxHeight = Math.max(120, roomBelow);
      } else {
        maxHeight = roomAbove;
        top = Math.max(8, r.top - 8 - Math.min(h, roomAbove));
      }
      setAt({ top, left, width, maxHeight });
    };
    place();
    window.addEventListener('resize', place);
    // Its height changes once its width applies (and when ▶ Hear it starts).
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(place) : null;
    ro?.observe(el);
    return () => {
      window.removeEventListener('resize', place);
      ro?.disconnect();
    };
  }, [anchor, id]);

  useEffect(() => {
    ref.current?.focus();
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target) || anchor?.contains(target)) return;
      onClose(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [anchor, onClose]);

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={descId}
      tabIndex={-1}
      className="glossary-popover"
      data-glossary=""
      data-testid="glossary-popover"
      style={{ top: at?.top ?? 0, left: at?.left ?? 0, width: at?.width ?? Math.min(340, window.innerWidth - 32), maxHeight: at?.maxHeight, opacity: at ? undefined : 0 }}
    >
      <div className="glossary-popover-head">
        <h2 id={titleId} className="glossary-title">{termTitle(id, t)}</h2>
        <IconButton
          aria-label={t('common.close')}
          onClick={() => onClose(true)}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          }
        />
      </div>
      {/* A bounded body with the sheets' edge cue when it scrolls. */}
      <ScrollBody>
        <Explanation id={id} descId={descId} hear={hear} />
        {also.map((other) => (
          <section key={other} className="glossary-also" aria-labelledby={`${titleId}-${other}`}>
            <h3 id={`${titleId}-${other}`} className="glossary-title glossary-title-also">{termTitle(other, t)}</h3>
            <Explanation id={other} hear={hear} />
          </section>
        ))}
      </ScrollBody>
    </div>,
    document.body,
  );
}

/** "Words on this screen": every marked word shown, each opening its explanation in place. */
function WordsList({ ids, hear }: { ids: TermId[]; hear: ReturnType<typeof useHear> }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<TermId | null>(null);
  const baseId = useId();
  if (ids.length === 0) return <p className="glossary-plain">{t('glossary.ui.noWords')}</p>;
  return (
    <div data-glossary="">
      <p className="glossary-intro">{t('glossary.ui.wordsIntro')}</p>
      <ul className="glossary-words" data-testid="glossary-words">
        {ids.map((id) => {
          const expanded = open === id;
          const panel = `${baseId}-${id}`;
          return (
            <li key={id} data-word={id}>
              <button
                type="button"
                className="glossary-word"
                aria-expanded={expanded}
                aria-controls={panel}
                onClick={() => setOpen(expanded ? null : id)}
              >
                <span>{termTitle(id, t)}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: expanded ? 'rotate(90deg)' : undefined }}>
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
              {expanded && (
                <div id={panel} className="glossary-word-body">
                  <Explanation id={id} hear={hear} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * The glossary's panels (lazy: ExploreView loads this the first time a word
 * is tapped). One word: a popover beside it on a laptop, a bottom sheet on a
 * phone or a short screen. "Words on this screen": a sheet.
 */
export default function GlossaryHost() {
  const { t } = useTranslation();
  const request = useGlossaryUi((s) => s.request);
  const closeUi = useGlossaryUi((s) => s.close);
  const sheet = useMediaQuery(SHEET_QUERY);
  const hear = useHear();
  const detail = useExploreDetail();

  const close = useCallback((refocus: boolean) => {
    const anchor = useGlossaryUi.getState().request?.anchor;
    closeUi();
    cancelScheduledAudio();
    if (refocus && anchor?.isConnected) anchor.focus();
  }, [closeUi]);

  // Escape and Tab, before any sheet underneath sees them (window capture
  // runs before a Sheet's document listener): a word explained from inside
  // the practice sheet closes only its explanation.
  const popover = request?.kind === 'term' && !sheet;
  useEffect(() => {
    if (!request) return;
    const onKey = (e: KeyboardEvent) => {
      const panel = document.querySelector<HTMLElement>(popover ? '[data-testid="glossary-popover"]' : '[data-testid="glossary-sheet"]');
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close(true);
      } else if (e.key === 'Tab' && panel) {
        e.stopPropagation();
        if (!panel.contains(document.activeElement)) {
          e.preventDefault();
          (focusableIn(panel)[0] ?? panel).focus();
        } else {
          trapTab(e, panel);
        }
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [request, popover, close]);

  if (!request) return null;
  if (popover && request.kind === 'term') {
    return <Popover key={request.id} id={request.id} also={request.also} anchor={request.anchor} onClose={close} hear={hear} />;
  }
  const title = request.kind === 'term' ? termTitle(request.id, t) : t('glossary.ui.wordsLabel');
  // Fewer words or all of them: the word list offers the Simple / Full
  // switch too (on a phone it is the one place it can stand in Full).
  const detailSwitch = request.kind === 'words' ? (
    <Segment<ExploreDetail>
      label={t('simpleView.label')}
      value={detail}
      onChange={(d) => useAppStore.getState().setExploreDetail(d)}
      options={[
        { value: 'simple', label: t('simpleView.simple') },
        { value: 'full', label: t('simpleView.full') },
      ]}
    />
  ) : undefined;
  return (
    <Sheet open onClose={() => close(true)} title={title} closeLabel={t('common.close')} testId="glossary-sheet" actions={detailSwitch}>
      <div data-glossary="">
        {request.kind === 'term'
          ? <>
            <Explanation id={request.id} hear={hear} />
            {request.also.map((other) => (
              <section key={other} className="glossary-also">
                <h3 className="glossary-title glossary-title-also">{termTitle(other, t)}</h3>
                <Explanation id={other} hear={hear} />
              </section>
            ))}
          </>
          : <WordsList ids={request.ids} hear={hear} />}
      </div>
    </Sheet>
  );
}
