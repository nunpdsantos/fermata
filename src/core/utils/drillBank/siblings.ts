/**
 * Sibling groups for drill items (audit W7-04).
 *
 * Two items are siblings when seeing one answers (or all but answers) the
 * other: an item and its reverse ("Scale degree 1 is called…?" / "The Tonic is
 * which scale degree?"), or two facts about the same key signature, chord,
 * interval or scale. The session composer and the in-session requeue never put
 * two items of one group next to each other.
 *
 * The group is derived from the item id alone (ids are stable and structured:
 * `<family>:<direction>:<payload>`), so the store can apply the rule to a
 * persisted queue without the bank. An id this module does not recognise is
 * its own group — which is exactly the old "same item never twice in a row"
 * rule.
 */
import { SCALE_DEGREE_NAMES } from '../../constants/scales';
import { ABBREVIATION_TO_SEMITONES } from '../../constants/intervals';
import { getPitchClass } from '../../constants/notes';
import { noteToString, stringToNote } from '../../types/music';
import { MAJOR_KEYS, getRelativeMinor, keySignatureOf } from './shared';
import { noteAtIntervalAbove } from './intervalEngine';
import { ABBR_TO_NUMBER } from './genInterval';
import { soundingMidiOfReadId } from './genRead';

/** Key (major tonic 'A', minor tonic lowercase 'f#') → its signature ('3#', '0'). */
let keySigByKey: Map<string, string> | null = null;
function signatureOfKey(key: string): string | null {
  if (keySigByKey === null) {
    keySigByKey = new Map();
    for (const major of MAJOR_KEYS) {
      const sig = keySignatureOf(major);
      const label = sig.type === 'none' ? '0' : `${sig.count}${sig.type}`;
      keySigByKey.set(noteToString(major), label);
      keySigByKey.set(noteToString(getRelativeMinor(major)).toLowerCase(), label);
    }
  }
  return keySigByKey.get(key) ?? null;
}

const NOTE_RE = /^[A-G](##|bb|#|b)?$/;

function pitchClassOf(ascii: string): number | null {
  return NOTE_RE.test(ascii) ? getPitchClass(stringToNote(ascii)) : null;
}

function groupFor(id: string): string | null {
  const p = id.split(':');
  const [family, direction] = p;
  switch (family) {
    case 'degree': {
      // degree:num-to-name:<n> ↔ degree:name-to-num:<Name>
      if (direction === 'num-to-name' && p.length === 3) return `degree:${p[2]}`;
      if (direction === 'name-to-num') {
        const i = SCALE_DEGREE_NAMES.indexOf(p.slice(2).join(':'));
        if (i >= 0) return `degree:${i + 1}`;
      }
      return null;
    }
    case 'triad':
    case 'seventh': {
      // <family>:name-to-notes:<root>:<quality> ↔ <family>:notes-to-name:<root>:<quality>
      if ((direction === 'name-to-notes' || direction === 'notes-to-name') && p.length === 4) {
        return `${family}:${p[2]}:${p[3]}`;
      }
      return null;
    }
    case 'roman': {
      // degree-to-chord / chord-to-degree: roman:<dir>:<tonic>:<mode>:<n>
      if ((direction === 'degree-to-chord' || direction === 'chord-to-degree') && p.length === 5) {
        return `roman:${p[2]}:${p[3]}:${p[4]}`;
      }
      // is-diatonic: roman:is-diatonic:<majorTonic>:<n>:yes|no — about the chord on n
      if (direction === 'is-diatonic' && p.length === 5) return `roman:${p[2]}:major:${p[3]}`;
      return null;
    }
    case 'function': {
      // "The V7 of E♭?" sits with "What is V in E♭ major?"
      if (direction === 'v7-of' && p.length === 3) return `roman:${p[2]}:major:5`;
      return null;
    }
    case 'scale': {
      // scale:spell:<tonic>:<type>, scale:degree-of:<tonic>:<mode>:<n>
      if ((direction === 'spell' && p.length === 4) || (direction === 'degree-of' && p.length === 5)) {
        return `scale:${p[2]}:${p[3] === 'major' ? 'major' : 'minor'}`;
      }
      return null;
    }
    case 'keysig': {
      // Every item about one signature: key ↔ count ↔ accidentals ↔ relative.
      let sig: string | null = null;
      if (direction === 'sig-to-key' && p.length === 4) sig = p[2];
      else if ((direction === 'key-to-count' || direction === 'key-to-acc') && p.length === 4) {
        sig = signatureOfKey(p[2]);
      } else if ((direction === 'rel-minor' || direction === 'rel-major') && p.length === 3) {
        sig = signatureOfKey(p[2]);
      }
      return sig === null ? null : `keysig:${sig}`;
    }
    case 'interval': {
      // "C up to E is which interval?" ↔ "A major 3rd above C?"
      if (direction === 'pair-to-name' && p.length === 4) return `interval:${p[2]}:${p[3]}`;
      if (direction === 'note-above' && p.length === 4) {
        const abbr = p[3];
        const number = ABBR_TO_NUMBER[abbr];
        const semitones = ABBREVIATION_TO_SEMITONES[abbr];
        if (number === undefined || semitones === undefined || !NOTE_RE.test(p[2])) return null;
        const above = noteAtIntervalAbove(stringToNote(p[2]), number, semitones);
        return above ? `interval:${p[2]}:${noteToString(above)}` : null;
      }
      return null;
    }
    case 'read': {
      // Every reading item about one sounding pitch — any position, either
      // spelling (G♯4 / A♭4 are played in the same places).
      const midi = soundingMidiOfReadId(id);
      return midi === null ? null : `read:${midi}`;
    }
    case 'circle': {
      // "A fifth up from C?" (G) ↔ "A fifth down from G?" (C): same fifth.
      const pc = p.length === 3 ? pitchClassOf(p[2]) : null;
      if (pc === null) return null;
      if (direction === 'fifth-up') return `circle:fifth:${pc}`;
      if (direction === 'fifth-down') return `circle:fifth:${(pc + 5) % 12}`;
      return null;
    }
    default:
      return null;
  }
}

const cache = new Map<string, string>();

/** The sibling group of a drill item id (the id itself when it has none). */
export function drillSiblingGroup(id: string): string {
  let g = cache.get(id);
  if (g === undefined) {
    g = groupFor(id) ?? id;
    cache.set(id, g);
  }
  return g;
}
