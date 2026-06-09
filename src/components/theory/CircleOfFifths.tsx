import { memo, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { noteToString, type Note, type ScaleType } from '../../core/types/music.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { useAppStore } from '../../state/store.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { resumeAudio, playChordVoiced } from '../../core/services/audio.ts';
import { getSynthConfig } from '../../services/synthConfig.ts';
import {
  CIRCLE_MAJOR, CIRCLE_MINOR, KEY_SIGNATURES,
  MINOR_SCALES, MINOR_SCALE_LABELS, ROMAN_NUMERALS,
  SIZE, CENTER, MAJOR_INNER, MAJOR_OUTER, MINOR_INNER, MINOR_OUTER,
  KEYSIG_R, SEG_GAP, TONIC_HUE, accentAlpha,
  DIST_FILL_MAJOR, DIST_STROKE_MAJOR, DIST_TEXT_MAJOR,
  DIST_FILL_MINOR, DIST_STROKE_MINOR, DIST_TEXT_MINOR,
  DISTANCE_LABELS,
} from './circleOfFifthsConstants.ts';

function isMinorScale(scale: ScaleType): boolean {
  return MINOR_SCALES.includes(scale);
}

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

export const CircleOfFifths = memo(function CircleOfFifths() {
  const selectedKey = useAppStore((s) => s.selectedKey);
  const selectedScale = useAppStore((s) => s.selectedScale);
  const synthPreset = useAppStore((s) => s.synthPreset);
  const { getNoteDegree } = useKeyContext();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredRing, setHoveredRing] = useState<'major' | 'minor' | null>(null);
  const [focusKey, setFocusKey] = useState<{ ring: 'major' | 'minor'; idx: number }>(
    { ring: 'major', idx: 0 },
  );

  const selectedPc = getPitchClass(selectedKey);
  const isMinorSel = isMinorScale(selectedScale);

  // Find the circle position of the selected key
  const selectedIdx = useMemo(() => {
    const arr = isMinorSel ? CIRCLE_MINOR : CIRCLE_MAJOR;
    const idx = arr.findIndex((n) => getPitchClass(n) === selectedPc);
    return idx >= 0 ? idx : 0;
  }, [selectedPc, isMinorSel]);

  const handleKeyClick = useCallback(
    async (note: Note, isMajor: boolean) => {
      useAppStore.setState({
        selectedKey: note,
        selectedScale: isMajor ? 'major' : 'natural_minor',
        selectedChord: null,
        selectedDegree: null,
      });
      await resumeAudio();
      const config = getSynthConfig(synthPreset);
      playChordVoiced([note], 4, 0.5, config);
    },
    [synthPreset],
  );

  const handleMinorVariant = (scaleType: ScaleType) => {
    useAppStore.setState({
      selectedScale: scaleType,
      selectedChord: null,
      selectedDegree: null,
    });
  };

  const handleSegmentKeyDown = useCallback(
    (e: React.KeyboardEvent, ring: 'major' | 'minor', idx: number, note: Note) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleKeyClick(note, ring === 'major');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusKey({ ring, idx: (idx + 1) % 12 });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusKey({ ring, idx: (idx + 11) % 12 });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusKey({ ring: ring === 'major' ? 'minor' : 'major', idx });
      }
    },
    [handleKeyClick],
  );

  // Focus the segment that matches focusKey when it changes.
  // SVG <g> doesn't focus natively via React state; use useEffect with ref map.
  const segmentRefs = useRef(new Map<string, SVGGElement | null>());
  useEffect(() => {
    const el = segmentRefs.current.get(`${focusKey.ring}-${focusKey.idx}`);
    if (el && document.activeElement !== el) el.focus();
  }, [focusKey]);

  // Build segment data — coloring based on harmonic distance from selected key
  const majorSegs = useMemo(() => {
    return CIRCLE_MAJOR.map((note, i) => {
      const start = i * 30 - 15 + SEG_GAP;
      const end = i * 30 + 15 - SEG_GAP;
      const pc = getPitchClass(note);
      const selected = pc === selectedPc && !isMinorSel;
      const dist = fifthsDistance(i, selectedIdx);
      const degree = getNoteDegree(note);
      const namePos = polarToCartesian(CENTER, CENTER, 95, i * 30);
      const degreePos = polarToCartesian(CENTER, CENTER, 113, i * 30);

      return {
        note, i, pc, selected, dist, degree, namePos, degreePos,
        path: arcPath(CENTER, CENTER, MAJOR_INNER, MAJOR_OUTER, start, end),
        fill: DIST_FILL_MAJOR[dist],
        stroke: DIST_STROKE_MAJOR[dist],
        textFill: DIST_TEXT_MAJOR[dist],
        hoverFill: dist === 0 ? TONIC_HUE : accentAlpha(dist <= 2 ? 31 : 15),
      };
    });
  }, [selectedPc, isMinorSel, selectedIdx, getNoteDegree]);

  const minorSegs = useMemo(() => {
    return CIRCLE_MINOR.map((note, i) => {
      const start = i * 30 - 15 + SEG_GAP;
      const end = i * 30 + 15 - SEG_GAP;
      const pc = getPitchClass(note);
      const selected = pc === selectedPc && isMinorSel;
      const dist = fifthsDistance(i, selectedIdx);
      const degree = getNoteDegree(note);
      const mid = polarToCartesian(CENTER, CENTER, (MINOR_INNER + MINOR_OUTER) / 2, i * 30);

      return {
        note, i, pc, selected, dist, degree, mid,
        path: arcPath(CENTER, CENTER, MINOR_INNER, MINOR_OUTER, start, end),
        fill: DIST_FILL_MINOR[dist],
        stroke: DIST_STROKE_MINOR[dist],
        textFill: DIST_TEXT_MINOR[dist],
        hoverFill: dist === 0 ? TONIC_HUE : accentAlpha(dist <= 2 ? 25 : 10),
      };
    });
  }, [selectedPc, isMinorSel, selectedIdx, getNoteDegree]);

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
    const majorNote = CIRCLE_MAJOR[hoveredIdx];
    const minorNote = CIRCLE_MINOR[hoveredIdx];
    const dist = fifthsDistance(hoveredIdx, selectedIdx);
    const majorDeg = getNoteDegree(majorNote);
    const minorDeg = getNoteDegree(minorNote);
    return {
      major: noteToString(majorNote),
      minor: noteToString(minorNote) + 'm',
      keySig: KEY_SIGNATURES[hoveredIdx],
      dist,
      distLabel: DISTANCE_LABELS[dist],
      majorDegree: majorDeg ? ROMAN_NUMERALS[majorDeg] : undefined,
      minorDegree: minorDeg ? ROMAN_NUMERALS[minorDeg] : undefined,
    };
  }, [hoveredIdx, selectedIdx, getNoteDegree]);

  const svgContent = (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[300px] mx-auto">
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
      {majorSegs.map((s) => (
        <g
          key={`maj-${s.i}`}
          ref={(el) => { segmentRefs.current.set(`major-${s.i}`, el); }}
          role="button"
          tabIndex={focusKey.ring === 'major' && focusKey.idx === s.i ? 0 : -1}
          aria-label={`${noteToString(s.note)} major`}
          aria-pressed={s.selected}
          data-focus-ring="custom"
          style={{ filter: s.selected ? 'url(#cof-glow)' : 'none', outline: focusKey.ring === 'major' && focusKey.idx === s.i ? '2px solid var(--focus-ring)' : 'none' }}
          onClick={() => handleKeyClick(s.note, true)}
          onMouseEnter={() => { setHoveredIdx(s.i); setHoveredRing('major'); }}
          onMouseLeave={() => { setHoveredIdx(null); setHoveredRing(null); }}
          onFocus={() => { setHoveredIdx(s.i); setHoveredRing('major'); }}
          onBlur={() => { setHoveredIdx(null); setHoveredRing(null); }}
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
          {s.degree && (
            <text
              x={s.degreePos.x}
              y={s.degreePos.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[6px] select-none pointer-events-none"
              fill={DIST_TEXT_MAJOR[Math.min(s.dist, 3)]}
              fillOpacity={0.53}
            >
              {ROMAN_NUMERALS[s.degree]}
            </text>
          )}
        </g>
      ))}

      {/* Minor ring */}
      {minorSegs.map((s) => (
        <g
          key={`min-${s.i}`}
          ref={(el) => { segmentRefs.current.set(`minor-${s.i}`, el); }}
          role="button"
          tabIndex={focusKey.ring === 'minor' && focusKey.idx === s.i ? 0 : -1}
          aria-label={`${noteToString(s.note)} minor`}
          aria-pressed={s.selected}
          data-focus-ring="custom"
          style={{ filter: s.selected ? 'url(#cof-glow)' : 'none', outline: focusKey.ring === 'minor' && focusKey.idx === s.i ? '2px solid var(--focus-ring)' : 'none' }}
          onClick={() => handleKeyClick(s.note, false)}
          onMouseEnter={() => { setHoveredIdx(s.i); setHoveredRing('minor'); }}
          onMouseLeave={() => { setHoveredIdx(null); setHoveredRing(null); }}
          onFocus={() => { setHoveredIdx(s.i); setHoveredRing('minor'); }}
          onBlur={() => { setHoveredIdx(null); setHoveredRing(null); }}
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
        </g>
      ))}

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

      {/* Center content — always key name + key sig (hover overrides) */}
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
            {hoverInfo.keySig || 'no \u266F/\u266D'} · {hoveredRing === 'minor' ? `rel: ${hoverInfo.major}` : `rel: ${hoverInfo.minor}`}
          </text>
        </>
      ) : (
        <>
          <text
            x={CENTER} y={CENTER - 8}
            textAnchor="middle" dominantBaseline="central"
            className="text-[15px] font-bold select-none"
            fill="var(--text)"
          >
            {noteToString(selectedKey)}{isMinorSel ? 'm' : ''}
          </text>
          <text
            x={CENTER} y={CENTER + 10}
            textAnchor="middle" dominantBaseline="central"
            className="text-[8px] select-none"
            fill="var(--text-dim)"
          >
            {selectedIdx >= 0 ? KEY_SIGNATURES[selectedIdx] || 'no \u266F/\u266D' : ''}
          </text>
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
