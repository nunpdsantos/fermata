import { memo, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { noteToString, type Note, type ScaleType } from '../../core/types/music.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { SCALE_TYPE_NAMES } from '../../core/constants/scales.ts';
import { keySignatureForScale, formatKeySignature } from '../../core/utils/degreeSpelling.ts';
import { useAppStore } from '../../state/store.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { resumeAudio, playChordVoiced } from '../../core/services/audio.ts';
import { getSynthConfig } from '../../services/synthConfig.ts';
import {
  CIRCLE_MAJOR, CIRCLE_MINOR, KEY_SIGNATURES,
  MINOR_SCALES, MINOR_SCALE_LABELS,
  SIZE, CENTER, MAJOR_INNER, MAJOR_OUTER, MINOR_INNER, MINOR_OUTER,
  KEYSIG_R, SEG_GAP, TONIC_HUE, accentAlpha,
  DIST_FILL_MAJOR, DIST_STROKE_MAJOR, DIST_TEXT_MAJOR,
  DIST_FILL_MINOR, DIST_STROKE_MINOR, DIST_TEXT_MINOR,
  DISTANCE_LABELS,
} from './circleOfFifthsConstants.ts';

type Ring = 'major' | 'minor';

function isMinorScale(scale: ScaleType): boolean {
  return MINOR_SCALES.includes(scale);
}

/**
 * Scales whose key signature is their RELATIVE MINOR's (the parent major's
 * minor partner): they light the inner ring. Every other scale with a standard
 * signature (major family, church modes) lights its parent major on the outer
 * ring.
 */
const MINOR_RING_SCALES: ReadonlySet<ScaleType> = new Set<ScaleType>([
  'natural_minor', 'harmonic_minor', 'melodic_minor', 'pentatonic_minor', 'blues',
]);

function fifthsDistance(a: number, b: number): number {
  const d = Math.abs(a - b);
  return Math.min(d, 12 - d);
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number, cy: number,
  innerR: number, outerR: number,
  startDeg: number, endDeg: number,
): string {
  const os = polarToCartesian(cx, cy, outerR, startDeg);
  const oe = polarToCartesian(cx, cy, outerR, endDeg);
  const ie = polarToCartesian(cx, cy, innerR, endDeg);
  const is_ = polarToCartesian(cx, cy, innerR, startDeg);
  const la = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${os.x} ${os.y}`,
    `A ${outerR} ${outerR} 0 ${la} 1 ${oe.x} ${oe.y}`,
    `L ${ie.x} ${ie.y}`,
    `A ${innerR} ${innerR} 0 ${la} 0 ${is_.x} ${is_.y}`,
    'Z',
  ].join(' ');
}

const circleIndexOf = (pc: number): number => {
  const idx = CIRCLE_MAJOR.findIndex((n) => getPitchClass(n) === pc);
  return idx >= 0 ? idx : 0;
};

export const CircleOfFifths = memo(function CircleOfFifths() {
  const selectedKey = useAppStore((s) => s.selectedKey);
  const selectedScale = useAppStore((s) => s.selectedScale);
  const synthPreset = useAppStore((s) => s.synthPreset);
  const setKey = useAppStore((s) => s.setKey);
  const setScale = useAppStore((s) => s.setScale);
  const { diatonicChords } = useKeyContext();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredRing, setHoveredRing] = useState<Ring | null>(null);
  const [focusedSeg, setFocusedSeg] = useState<string | null>(null);
  // The keyboard tab stop once the user has moved it with the arrow keys;
  // until then it is the selected key (roving tabindex).
  const [navKey, setNavKey] = useState<{ ring: Ring; idx: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const isMinorSel = isMinorScale(selectedScale);

  // The key signature of the scale's SPELLED parent key (A dorian → G major's
  // 1♯; C♯ major → 7♯), or null when no standard signature applies — then the
  // circle shows none rather than the root's major signature (audit W2-01).
  const signature = useMemo(
    () => keySignatureForScale(selectedKey, selectedScale),
    [selectedKey, selectedScale],
  );

  // Circle position the colouring is measured from, and the highlighted
  // segment: the parent major (outer ring) or its relative minor (inner ring).
  const refIdx = circleIndexOf(getPitchClass(signature ? signature.parent : selectedKey));
  const selectedSeg = useMemo<{ ring: Ring; idx: number } | null>(
    () => (signature ? { ring: MINOR_RING_SCALES.has(selectedScale) ? 'minor' : 'major', idx: refIdx } : null),
    [signature, selectedScale, refIdx],
  );
  const focusKey = navKey ?? selectedSeg ?? { ring: 'major' as Ring, idx: refIdx };

  // Roman numerals of the scale's real diatonic triads, on the ring matching
  // their quality: major/augmented outer, minor/diminished inner (W2-02).
  const numerals = useMemo(() => {
    const m = new Map<string, string>();
    for (const dc of diatonicChords) {
      const q = dc.chord.quality;
      const ring: Ring = q === 'minor' || q === 'diminished' ? 'minor' : 'major';
      m.set(`${ring}-${getPitchClass(dc.chord.root)}`, dc.numeral);
    }
    return m;
  }, [diatonicChords]);

  // A segment that IS the selection shows the selection's spelling (C♯ major
  // selected reads "C♯" where the circle otherwise prints D♭).
  const labelFor = useCallback(
    (ring: Ring, i: number): Note => {
      if (selectedSeg && selectedSeg.ring === ring && selectedSeg.idx === i && signature) {
        return ring === 'major' ? signature.parent : selectedKey;
      }
      return ring === 'major' ? CIRCLE_MAJOR[i] : CIRCLE_MINOR[i];
    },
    [selectedSeg, signature, selectedKey],
  );

  const handleKeyClick = useCallback(
    async (note: Note, isMajor: boolean) => {
      // Through the store actions, so their resets apply (stale position chip,
      // comparison scale, chord) — audit W2-06.
      setKey(note);
      setScale(isMajor ? 'major' : 'natural_minor');
      await resumeAudio();
      const config = getSynthConfig(synthPreset);
      playChordVoiced([note], 4, 0.5, config);
    },
    [synthPreset, setKey, setScale],
  );

  const handleMinorVariant = (scaleType: ScaleType) => {
    setScale(scaleType);
  };

  const handleSegmentKeyDown = useCallback(
    (e: React.KeyboardEvent, ring: Ring, idx: number, note: Note) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleKeyClick(note, ring === 'major');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setNavKey({ ring, idx: (idx + 1) % 12 });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setNavKey({ ring, idx: (idx + 11) % 12 });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setNavKey({ ring: ring === 'major' ? 'minor' : 'major', idx });
      }
    },
    [handleKeyClick],
  );

  // Move focus to the tab stop ONLY while the user is already navigating the
  // circle with the keyboard. Focusing on mount used to steal focus and scroll
  // Explore down on load (audit W2-03).
  const segmentRefs = useRef(new Map<string, SVGGElement | null>());
  useEffect(() => {
    if (!navKey) return;
    const el = segmentRefs.current.get(`${navKey.ring}-${navKey.idx}`);
    const svg = svgRef.current;
    if (!el || !svg || !svg.contains(document.activeElement) || document.activeElement === el) return;
    el.focus({ preventScroll: true });
  }, [navKey]);

  // Build segment data — coloring based on harmonic distance from the key
  const majorSegs = useMemo(() => {
    return CIRCLE_MAJOR.map((_, i) => {
      const note = labelFor('major', i);
      const start = i * 30 - 15 + SEG_GAP;
      const end = i * 30 + 15 - SEG_GAP;
      const pc = getPitchClass(note);
      const selected = selectedSeg?.ring === 'major' && selectedSeg.idx === i;
      const dist = fifthsDistance(i, refIdx);
      const numeral = numerals.get(`major-${pc}`);
      const namePos = polarToCartesian(CENTER, CENTER, 95, i * 30);
      const degreePos = polarToCartesian(CENTER, CENTER, 113, i * 30);

      return {
        note, i, pc, selected, dist, numeral, namePos, degreePos,
        path: arcPath(CENTER, CENTER, MAJOR_INNER, MAJOR_OUTER, start, end),
        fill: DIST_FILL_MAJOR[dist],
        stroke: DIST_STROKE_MAJOR[dist],
        textFill: DIST_TEXT_MAJOR[dist],
        hoverFill: dist === 0 ? TONIC_HUE : accentAlpha(dist <= 2 ? 31 : 15),
      };
    });
  }, [labelFor, selectedSeg, refIdx, numerals]);

  const minorSegs = useMemo(() => {
    return CIRCLE_MINOR.map((_, i) => {
      const note = labelFor('minor', i);
      const start = i * 30 - 15 + SEG_GAP;
      const end = i * 30 + 15 - SEG_GAP;
      const pc = getPitchClass(note);
      const selected = selectedSeg?.ring === 'minor' && selectedSeg.idx === i;
      const dist = fifthsDistance(i, refIdx);
      const numeral = numerals.get(`minor-${pc}`);
      const mid = polarToCartesian(CENTER, CENTER, (MINOR_INNER + MINOR_OUTER) / 2 + 3, i * 30);
      const degreePos = polarToCartesian(CENTER, CENTER, MINOR_INNER + 6, i * 30);

      return {
        note, i, pc, selected, dist, numeral, mid, degreePos,
        path: arcPath(CENTER, CENTER, MINOR_INNER, MINOR_OUTER, start, end),
        fill: DIST_FILL_MINOR[dist],
        stroke: DIST_STROKE_MINOR[dist],
        textFill: DIST_TEXT_MINOR[dist],
        hoverFill: dist === 0 ? TONIC_HUE : accentAlpha(dist <= 2 ? 25 : 10),
      };
    });
  }, [labelFor, selectedSeg, refIdx, numerals]);

  // Relative key connection line on hover
  const connLine = useMemo(() => {
    if (hoveredIdx === null) return null;
    const mj = polarToCartesian(CENTER, CENTER, (MAJOR_INNER + MAJOR_OUTER) / 2, hoveredIdx * 30);
    const mn = polarToCartesian(CENTER, CENTER, (MINOR_INNER + MINOR_OUTER) / 2, hoveredIdx * 30);
    return { x1: mj.x, y1: mj.y, x2: mn.x, y2: mn.y };
  }, [hoveredIdx]);

  // Hover tooltip data
  const hoverInfo = useMemo(() => {
    if (hoveredIdx === null) return null;
    const dist = fifthsDistance(hoveredIdx, refIdx);
    return {
      major: noteToString(majorSegs[hoveredIdx].note),
      minor: noteToString(minorSegs[hoveredIdx].note) + 'm',
      keySig: KEY_SIGNATURES[hoveredIdx],
      dist,
      distLabel: DISTANCE_LABELS[dist],
    };
  }, [hoveredIdx, refIdx, majorSegs, minorSegs]);

  // The scale's own name under the key when it is not plain major / minor.
  const scaleLine = selectedScale === 'major' || isMinorSel ? null : SCALE_TYPE_NAMES[selectedScale];

  const svgContent = (
    <svg ref={svgRef} viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[300px] mx-auto">
      <defs>
        <filter id="cof-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Key signature labels — outermost ring */}
      {KEY_SIGNATURES.map((sig, i) => {
        if (!sig) return null;
        const pos = polarToCartesian(CENTER, CENTER, KEYSIG_R, i * 30);
        return (
          <text
            key={`sig-${i}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[7px] select-none pointer-events-none"
            fill="var(--border-light)"
          >
            {sig}
          </text>
        );
      })}

      {/* Major ring */}
      {majorSegs.map((s) => {
        const isStop = focusKey.ring === 'major' && focusKey.idx === s.i;
        const segKey = `major-${s.i}`;
        return (
          <g
            key={`maj-${s.i}`}
            ref={(el) => { segmentRefs.current.set(segKey, el); }}
            role="button"
            tabIndex={isStop ? 0 : -1}
            aria-label={`${noteToString(s.note)} major`}
            aria-pressed={s.selected}
            data-focus-ring="custom"
            style={{ filter: s.selected ? 'url(#cof-glow)' : 'none', outline: focusedSeg === segKey ? '2px solid var(--focus-ring)' : 'none' }}
            onClick={() => handleKeyClick(s.note, true)}
            onMouseEnter={() => { setHoveredIdx(s.i); setHoveredRing('major'); }}
            onMouseLeave={() => { setHoveredIdx(null); setHoveredRing(null); }}
            onFocus={() => { setHoveredIdx(s.i); setHoveredRing('major'); setFocusedSeg(segKey); }}
            onBlur={() => { setHoveredIdx(null); setHoveredRing(null); setFocusedSeg(null); }}
            onKeyDown={(e) => handleSegmentKeyDown(e, 'major', s.i, s.note)}
            className="cursor-pointer"
          >
            <path
              d={s.path}
              fill={hoveredIdx === s.i ? s.hoverFill : s.fill}
              stroke={s.stroke}
              strokeWidth={s.selected ? 2 : 1}
              style={{ transition: 'fill 0.15s, stroke 0.15s' }}
            />
            <text
              x={s.namePos.x}
              y={s.namePos.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[11px] font-semibold select-none pointer-events-none"
              fill={s.textFill}
            >
              {noteToString(s.note)}
            </text>
            {s.numeral && (
              <text
                data-numeral
                x={s.degreePos.x}
                y={s.degreePos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[6px] select-none pointer-events-none"
                fill={DIST_TEXT_MAJOR[Math.min(s.dist, 3)]}
                fillOpacity={0.53}
              >
                {s.numeral}
              </text>
            )}
          </g>
        );
      })}

      {/* Minor ring */}
      {minorSegs.map((s) => {
        const isStop = focusKey.ring === 'minor' && focusKey.idx === s.i;
        const segKey = `minor-${s.i}`;
        return (
          <g
            key={`min-${s.i}`}
            ref={(el) => { segmentRefs.current.set(segKey, el); }}
            role="button"
            tabIndex={isStop ? 0 : -1}
            aria-label={`${noteToString(s.note)} minor`}
            aria-pressed={s.selected}
            data-focus-ring="custom"
            style={{ filter: s.selected ? 'url(#cof-glow)' : 'none', outline: focusedSeg === segKey ? '2px solid var(--focus-ring)' : 'none' }}
            onClick={() => handleKeyClick(s.note, false)}
            onMouseEnter={() => { setHoveredIdx(s.i); setHoveredRing('minor'); }}
            onMouseLeave={() => { setHoveredIdx(null); setHoveredRing(null); }}
            onFocus={() => { setHoveredIdx(s.i); setHoveredRing('minor'); setFocusedSeg(segKey); }}
            onBlur={() => { setHoveredIdx(null); setHoveredRing(null); setFocusedSeg(null); }}
            onKeyDown={(e) => handleSegmentKeyDown(e, 'minor', s.i, s.note)}
            className="cursor-pointer"
          >
            <path
              d={s.path}
              fill={hoveredIdx === s.i ? s.hoverFill : s.fill}
              stroke={s.stroke}
              strokeWidth={s.selected ? 2 : 1}
              style={{ transition: 'fill 0.15s, stroke 0.15s' }}
            />
            <text
              x={s.mid.x}
              y={s.mid.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[8px] font-medium select-none pointer-events-none"
              fill={s.textFill}
            >
              {noteToString(s.note)}m
            </text>
            {s.numeral && (
              <text
                data-numeral
                x={s.degreePos.x}
                y={s.degreePos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[5.5px] select-none pointer-events-none"
                fill={DIST_TEXT_MINOR[Math.min(s.dist, 3)]}
                fillOpacity={0.6}
              >
                {s.numeral}
              </text>
            )}
          </g>
        );
      })}

      {/* Relative key connection line on hover */}
      {connLine && (
        <line
          x1={connLine.x1} y1={connLine.y1}
          x2={connLine.x2} y2={connLine.y2}
          stroke="var(--text)"
          strokeWidth={1}
          strokeDasharray="3 2"
          opacity={0.35}
          className="pointer-events-none"
        />
      )}

      {/* Center content — the selected key + its signature (hover overrides) */}
      {hoveredIdx !== null && hoverInfo ? (
        <>
          <text
            x={CENTER} y={CENTER - 18}
            textAnchor="middle" dominantBaseline="central"
            className="text-[13px] font-bold select-none pointer-events-none"
            fill="var(--text)"
          >
            {hoveredRing === 'minor' ? hoverInfo.minor : hoverInfo.major}
          </text>
          <text
            x={CENTER} y={CENTER - 2}
            textAnchor="middle" dominantBaseline="central"
            className="text-[7px] select-none pointer-events-none"
            fill={hoverInfo.dist <= 2 ? 'var(--text-muted)' : 'var(--text-dim)'}
          >
            {hoverInfo.distLabel}
          </text>
          <text
            x={CENTER} y={CENTER + 12}
            textAnchor="middle" dominantBaseline="central"
            className="text-[7px] select-none pointer-events-none"
            fill="var(--border-light)"
          >
            {hoverInfo.keySig || 'no ♯/♭'} · {hoveredRing === 'minor' ? `rel: ${hoverInfo.major}` : `rel: ${hoverInfo.minor}`}
          </text>
        </>
      ) : (
        <>
          <text
            data-testid="cof-centre-key"
            x={CENTER} y={CENTER - (scaleLine ? 12 : 8)}
            textAnchor="middle" dominantBaseline="central"
            className="text-[15px] font-bold select-none"
            fill="var(--text)"
          >
            {noteToString(selectedKey)}{isMinorSel ? 'm' : ''}
          </text>
          {scaleLine && (
            <text
              data-testid="cof-centre-scale"
              x={CENTER} y={CENTER + 3}
              textAnchor="middle" dominantBaseline="central"
              className="text-[7px] select-none"
              fill="var(--text-muted)"
            >
              {scaleLine}
            </text>
          )}
          {signature && (
            <text
              data-testid="cof-centre-sig"
              x={CENTER} y={CENTER + (scaleLine ? 14 : 10)}
              textAnchor="middle" dominantBaseline="central"
              className="text-[8px] select-none"
              fill="var(--text-dim)"
            >
              {formatKeySignature(signature)}
            </text>
          )}
        </>
      )}
    </svg>
  );

  return (
    <div>
      {svgContent}
      {isMinorSel && (
        <div className="flex items-center justify-center gap-1 mt-2">
          {MINOR_SCALES.map((st) => {
            const active = selectedScale === st;
            return (
              <button
                key={st}
                onClick={() => handleMinorVariant(st)}
                className="px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors"
                style={{
                  backgroundColor: active ? TONIC_HUE : 'var(--card)',
                  color: active ? 'var(--bg)' : 'var(--text-muted)',
                  border: `1px solid ${active ? TONIC_HUE : 'var(--card-hover)'}`,
                }}
              >
                {MINOR_SCALE_LABELS[st]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});
