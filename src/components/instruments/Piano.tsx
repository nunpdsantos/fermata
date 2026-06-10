/* eslint-disable no-restricted-syntax -- legacy instrument palette.
   Migration deferred alongside PianoKey. */
import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  generateKeyboardKeys,
  type PianoKey,
} from '../../core/utils/pianoLayout.ts';
import { PianoKeyComponent } from './PianoKey.tsx';
import { useAudio } from '../../hooks/useAudio.ts';
import { useAppStore } from '../../state/store.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useIsMobile, useIsCompact } from '../../hooks/useMediaQuery.ts';

const START_OCTAVE = 0;
const END_OCTAVE = 8;

// Computer keyboard → semitone offset from base octave C
// Bottom row = white keys, top row = black keys
// Layout: |W|E| |T|Y|U| |O|P|
//         |A|S|D|F|G|H|J|K|L|;|
const KEYBOARD_MAP: Record<string, number> = {
  'a': 0,   // C
  'w': 1,   // C#
  's': 2,   // D
  'e': 3,   // D#
  'd': 4,   // E
  'f': 5,   // F
  't': 6,   // F#
  'g': 7,   // G
  'y': 8,   // G#
  'h': 9,   // A
  'u': 10,  // A#
  'j': 11,  // B
  'k': 12,  // C (next octave)
  'o': 13,  // C#
  'l': 14,  // D
  'p': 15,  // D#
  ';': 16,  // E
};

// Responsive key widths
const KEY_WIDTH_DESKTOP = 46;
const KEY_WIDTH_TABLET = 36;
const KEY_WIDTH_MOBILE = 36; // height (130px) meets WCAG 44px touch target

// Responsive container/key heights
const CONTAINER_H_DESKTOP = 220;
const CONTAINER_H_TABLET = 170;
const CONTAINER_H_MOBILE = 140;

const WHITE_H_DESKTOP = 210;
const WHITE_H_TABLET = 160;
const WHITE_H_MOBILE = 130;

const BLACK_OFFSET_DESKTOP = 30;
const BLACK_OFFSET_TABLET = 22;
const BLACK_OFFSET_MOBILE = 22;

export function Piano() {
  const { t } = useTranslation();
  const { noteOn, noteOff } = useAudio();
  const activeNotes = useAppStore((s) => s.activeNotes);
  const baseOctave = useAppStore((s) => s.baseOctave);
  const setBaseOctave = useAppStore((s) => s.setBaseOctave);
  const { scaleMidiNumbers, getNoteColor, chordVoicingMidi, hasSelectedChord } = useKeyContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeMidiMap = useRef<Map<number, number>>(new Map());

  const mobile = useIsMobile();
  const compact = useIsCompact();

  const keyWidth = mobile ? KEY_WIDTH_MOBILE : compact ? KEY_WIDTH_TABLET : KEY_WIDTH_DESKTOP;
  const containerHeight = mobile ? CONTAINER_H_MOBILE : compact ? CONTAINER_H_TABLET : CONTAINER_H_DESKTOP;
  const whiteKeyHeight = mobile ? WHITE_H_MOBILE : compact ? WHITE_H_TABLET : WHITE_H_DESKTOP;
  const blackKeyOffset = mobile ? BLACK_OFFSET_MOBILE : compact ? BLACK_OFFSET_TABLET : BLACK_OFFSET_DESKTOP;

  // Sizing mode passed to PianoKey
  const sizeMode: 'mobile' | 'tablet' | 'desktop' = mobile ? 'mobile' : compact ? 'tablet' : 'desktop';

  // Drag-to-scroll state (threshold-based: distinguishes click from drag)
  const DRAG_THRESHOLD = 8;
  const isPointerDown = useRef(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const lastPointerNoteKey = useRef<PianoKey | null>(null);

  const allKeys = useMemo(() => generateKeyboardKeys(START_OCTAVE, END_OCTAVE), []);

  // Show all keys on every device — octave buttons handle quick navigation
  const keys = allKeys;

  // ─── Keyboard navigation (roving tabindex) ───────────────────────
  // Focused key is tracked by MIDI number. Arrow L/R move between adjacent
  // keys (including black/white sequence); Home/End jump to endpoints.
  const sortedKeys = useMemo(
    () => [...keys].sort((a, b) => a.midiNumber - b.midiNumber),
    [keys],
  );
  const [focusedMidi, setFocusedMidi] = useState<number>(() => {
    // Default focus: middle C (60) if present, else first key.
    const hasMidi60 = sortedKeys.some((k) => k.midiNumber === 60);
    return hasMidi60 ? 60 : sortedKeys[0]?.midiNumber ?? 0;
  });

  const handleKeyFocus = useCallback((k: PianoKey) => {
    setFocusedMidi(k.midiNumber);
  }, []);

  const handleKeyNavKeyDown = useCallback(
    (e: React.KeyboardEvent, k: PianoKey) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      const idx = sortedKeys.findIndex((sk) => sk.midiNumber === k.midiNumber);
      if (idx < 0) return;
      let target = idx;
      if (e.key === 'ArrowLeft') target = Math.max(0, idx - 1);
      else if (e.key === 'ArrowRight') target = Math.min(sortedKeys.length - 1, idx + 1);
      else if (e.key === 'Home') target = 0;
      else if (e.key === 'End') target = sortedKeys.length - 1;
      const next = sortedKeys[target];
      if (next) setFocusedMidi(next.midiNumber);
    },
    [sortedKeys],
  );

  const isInScale = useCallback(
    (key: PianoKey) => scaleMidiNumbers.has(key.midiNumber),
    [scaleMidiNumbers]
  );

  const isVoicingNote = useCallback(
    (key: PianoKey) => chordVoicingMidi.has(key.midiNumber),
    [chordVoicingMidi]
  );

  const isDimmed = useCallback(
    (key: PianoKey) =>
      hasSelectedChord &&
      scaleMidiNumbers.has(key.midiNumber) &&
      !chordVoicingMidi.has(key.midiNumber),
    [hasSelectedChord, scaleMidiNumbers, chordVoicingMidi]
  );

  const getKeyColor = useCallback(
    (key: PianoKey) => getNoteColor(key.note),
    [getNoteColor]
  );

  const handleNoteOn = useCallback(
    (key: PianoKey) => {
      lastPointerNoteKey.current = key;
      noteOn(key.note, key.octave).then(
        (midi) => { activeMidiMap.current.set(key.midiNumber, midi); },
        (e) => { console.warn('[Piano] noteOn failed:', e); }
      );
    },
    [noteOn]
  );

  const handleNoteOff = useCallback(
    (key: PianoKey) => {
      const midi = activeMidiMap.current.get(key.midiNumber);
      if (midi !== undefined) {
        noteOff(midi);
        activeMidiMap.current.delete(key.midiNumber);
      }
    },
    [noteOff]
  );

  const whiteKeys = useMemo(() => keys.filter((k) => !k.isBlack), [keys]);
  const blackKeys = useMemo(() => keys.filter((k) => k.isBlack), [keys]);

  const midiToWhiteKeyIndex = useMemo(() => {
    const m = new Map<number, number>();
    whiteKeys.forEach((wk, idx) => {
      m.set(wk.midiNumber, idx);
    });
    blackKeys.forEach((bk) => {
      const bkIdx = keys.indexOf(bk);
      for (let i = bkIdx - 1; i >= 0; i--) {
        if (!keys[i].isBlack) {
          const wkIdx = whiteKeys.indexOf(keys[i]);
          if (wkIdx >= 0) m.set(bk.midiNumber, wkIdx);
          break;
        }
      }
    });
    return m;
  }, [whiteKeys, blackKeys, keys]);

  const scrollToMidiRange = useCallback(
    (midiSet: Set<number>) => {
      if (!containerRef.current || midiSet.size === 0) return;

      const midiArr = Array.from(midiSet).sort((a, b) => a - b);
      const minMidi = midiArr[0];
      const maxMidi = midiArr[midiArr.length - 1];

      const minIdx = midiToWhiteKeyIndex.get(minMidi);
      const maxIdx = midiToWhiteKeyIndex.get(maxMidi);
      if (minIdx === undefined || maxIdx === undefined) return;

      const centerIdx = (minIdx + maxIdx) / 2;
      const scrollTo = centerIdx * keyWidth - containerRef.current.clientWidth / 2 + keyWidth / 2;
      containerRef.current.scrollTo({ left: Math.max(0, scrollTo), behavior: 'smooth' });
    },
    [midiToWhiteKeyIndex, keyWidth]
  );

  // Auto-scroll only when the actual selection changes (not on every render).
  // Uses a serialized key so manual scrolling isn't overridden.
  const prevSelectionKey = useRef('');
  useEffect(() => {
    const target = chordVoicingMidi.size > 0 ? chordVoicingMidi : scaleMidiNumbers;
    if (target.size === 0) { prevSelectionKey.current = ''; return; }
    const key = Array.from(target).sort((a, b) => a - b).join(',');
    if (key === prevSelectionKey.current) return;
    prevSelectionKey.current = key;
    scrollToMidiRange(target);
  }, [scaleMidiNumbers, chordVoicingMidi, scrollToMidiRange]);

  // Scroll on octave button change
  useEffect(() => {
    const t = setTimeout(() => {
      if (chordVoicingMidi.size > 0) {
        scrollToMidiRange(chordVoicingMidi);
      } else if (scaleMidiNumbers.size > 0) {
        scrollToMidiRange(scaleMidiNumbers);
      }
    }, 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseOctave]);

  const handleContainerPointerDown = useCallback((e: React.PointerEvent) => {
    isPointerDown.current = true;
    isDragging.current = false;
    dragStartX.current = e.clientX;
    dragScrollLeft.current = containerRef.current?.scrollLeft ?? 0;
    // If pointer landed on empty space (not a key), clear stale note tracking
    if (!(e.target as HTMLElement).closest('[role="button"]')) {
      lastPointerNoteKey.current = null;
    }
    // Capture pointer on container — overrides PianoKey on desktop
    containerRef.current?.setPointerCapture(e.pointerId);
  }, []);

  const handleContainerPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPointerDown.current || !containerRef.current) return;
    const dx = e.clientX - dragStartX.current;

    if (!isDragging.current && Math.abs(dx) > DRAG_THRESHOLD) {
      isDragging.current = true;
      containerRef.current.style.cursor = 'grabbing';
      // Cancel the note that started playing on pointer down
      if (lastPointerNoteKey.current) {
        handleNoteOff(lastPointerNoteKey.current);
        lastPointerNoteKey.current = null;
      }
    }

    if (isDragging.current) {
      containerRef.current.scrollLeft = dragScrollLeft.current - dx;
    }
  }, [handleNoteOff]);

  const handleContainerPointerUp = useCallback(() => {
    // Simple click (no drag) — release the note on mouse up
    if (!isDragging.current && lastPointerNoteKey.current) {
      handleNoteOff(lastPointerNoteKey.current);
    }
    isPointerDown.current = false;
    isDragging.current = false;
    lastPointerNoteKey.current = null;
    if (containerRef.current) containerRef.current.style.cursor = 'grab';
  }, [handleNoteOff]);

  // Computer keyboard → piano key mapping (uses all keys, not filtered)
  const midiLookup = useMemo(() => {
    const m = new Map<number, PianoKey>();
    for (const k of allKeys) m.set(k.midiNumber, k);
    return m;
  }, [allKeys]);

  // Maps held keyboard key → the PianoKey used for note-on, so note-off
  // always targets the same pitch even if baseOctave changes mid-hold.
  const keyboardHeldKeys = useRef(new Map<string, PianoKey>());

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      // Don't intercept when typing in search or input fields
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (useAppStore.getState().quickSearchOpen) return;

      const semitone = KEYBOARD_MAP[e.key.toLowerCase()];
      if (semitone === undefined) return;
      if (keyboardHeldKeys.current.has(e.key)) return;

      const oct = useAppStore.getState().baseOctave;
      const midi = 12 + oct * 12 + semitone; // C4 = MIDI 60 when oct=4
      const pk = midiLookup.get(midi);
      if (!pk) return;

      e.preventDefault();
      keyboardHeldKeys.current.set(e.key, pk);
      handleNoteOn(pk);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const pk = keyboardHeldKeys.current.get(e.key);
      if (!pk) return;

      keyboardHeldKeys.current.delete(e.key);
      handleNoteOff(pk);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [midiLookup, handleNoteOn, handleNoteOff]);

  const blackKeyPositions = useMemo(() => {
    return blackKeys.map((bk) => {
      const bkIdx = keys.indexOf(bk);
      let precedingWhiteIdx = 0;
      for (let i = bkIdx - 1; i >= 0; i--) {
        if (!keys[i].isBlack) {
          precedingWhiteIdx = whiteKeys.indexOf(keys[i]);
          break;
        }
      }
      return { key: bk, left: precedingWhiteIdx * keyWidth + blackKeyOffset };
    });
  }, [blackKeys, whiteKeys, keys, keyWidth, blackKeyOffset]);

  return (
    <div role="group" aria-label={t('instrument.pianoKeyboard')} className="w-full" style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border-subtle)' }}>
      {/* Octave selector strip */}
      <div role="tablist" aria-label={t('instrument.baseOctave')} className="flex items-center gap-1 max-sm:gap-0.5 px-3 max-sm:px-2 py-1.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="text-[10px] uppercase tracking-wider mr-1" style={{ color: 'var(--text-dim)' }}>{t('play.octave')}</span>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((oct) => {
          const isActive = baseOctave === oct;
          return (
            <button
              key={oct}
              role="tab"
              aria-selected={isActive}
              onClick={() => setBaseOctave(oct)}
              className="px-2 py-0.5 rounded text-[10px] font-medium transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? '#000' : 'var(--text-dim)',
              }}
            >
              C{oct}
            </button>
          );
        })}
      </div>

      {/* Piano keyboard with drag-to-scroll */}
      <div
        ref={containerRef}
        className="overflow-x-auto overflow-y-hidden relative piano-scroll"
        style={{
          height: containerHeight,
          cursor: mobile ? undefined : 'grab',
          scrollbarWidth: 'none',
          touchAction: mobile ? 'pan-x' : undefined,
          overscrollBehavior: 'contain',
        }}
        onPointerDown={mobile ? undefined : handleContainerPointerDown}
        onPointerMove={mobile ? undefined : handleContainerPointerMove}
        onPointerUp={mobile ? undefined : handleContainerPointerUp}
        onPointerCancel={mobile ? undefined : handleContainerPointerUp}
      >
        <div
          className="relative flex"
          style={{ minWidth: '100%', width: whiteKeys.length * keyWidth, height: whiteKeyHeight, backgroundColor: 'var(--card)' }}
        >
          {whiteKeys.map((wk) => (
            <PianoKeyComponent
              key={wk.midiNumber}
              keyData={wk}
              isHighlighted={isInScale(wk)}
              highlightColor={getKeyColor(wk)}
              isActive={activeNotes.has(wk.midiNumber)}
              isChordTone={false}
              isVoicingNote={isVoicingNote(wk)}
              isDimmed={isDimmed(wk)}
              onNoteOn={handleNoteOn}
              onNoteOff={handleNoteOff}
              showLabel={!mobile || isInScale(wk) || activeNotes.has(wk.midiNumber) || (wk.note.natural === 'C' && wk.note.accidental === '')}
              sizeMode={sizeMode}
              isFocused={focusedMidi === wk.midiNumber}
              onKeyDown={handleKeyNavKeyDown}
              onFocus={handleKeyFocus}
            />
          ))}

          {blackKeyPositions.map(({ key: bk, left }) => (
            <div
              key={bk.midiNumber}
              className="absolute top-0"
              style={{ left }}
            >
              <PianoKeyComponent
                keyData={bk}
                isHighlighted={isInScale(bk)}
                highlightColor={getKeyColor(bk)}
                isActive={activeNotes.has(bk.midiNumber)}
                isChordTone={false}
                isVoicingNote={isVoicingNote(bk)}
                isDimmed={isDimmed(bk)}
                onNoteOn={handleNoteOn}
                onNoteOff={handleNoteOff}
                showLabel={!mobile || isInScale(bk) || activeNotes.has(bk.midiNumber)}
                sizeMode={sizeMode}
                isFocused={focusedMidi === bk.midiNumber}
                onKeyDown={handleKeyNavKeyDown}
                onFocus={handleKeyFocus}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
