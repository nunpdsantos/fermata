/**
 * Wave 2's seams that need no browser (integration, 2026-11-10). Each branch
 * proved its own part; these prove the parts meet. The browser half is
 * `e2e/wave2-seams.spec.ts`.
 */
import { describe, it, expect } from 'vitest';
import en from '../i18n/locales/en.json';
import pt from '../i18n/locales/pt.json';
import es from '../i18n/locales/es.json';
import { PROGRESSION_PRESETS, presetChords, pickerRoot, capoOptions, type MusicKey } from '../core/utils/progression';
import { capoShapes, capoIdeas } from '../components/explore/progression/progressionModel';
import { chordShapesForCapo } from '../core/constants/guitarChordShapes';
import { chordSymbol } from '../components/explore/focusReadout';
import { getDiatonicChordsForScale } from '../core/constants/chords';
import { buildScale } from '../core/constants/scales';
import { getPitchClass } from '../core/constants/notes';
import type { Chord } from '../core/types/music';
import { MODULE_INDEX } from '../data/moduleIndex';
import { TRACK_UNLOCKS, lessonIdsNamed, learnTargetOf } from '../data/drillUnlocks';
import { loadModuleIndex, getModuleTitle } from '../data/moduleIndexI18n';
import ptCurriculumL1 from '../i18n/content/pt/curriculumL1';
import esCurriculumL1 from '../i18n/content/es/curriculumL1';
import { L1_UNITS } from '../core/constants/curriculumL1';
import { buildChord } from '../core/constants/chords';
import glossaryEn from '../i18n/glossary/en.json';
import glossaryPt from '../i18n/glossary/pt.json';
import glossaryEs from '../i18n/glossary/es.json';

const LOCALES = { en, pt, es } as const;

describe('seam 2: one name for the Progression panel', () => {
  it.each(Object.entries(LOCALES))('%s: the panel button, its heading and the closing card name it with the same word', (_lang, m) => {
    const name = m.progression.open;
    expect(m.progression.title).toBe(name);
    expect({ en: 'Progression', pt: 'Progressão', es: 'Progresión' }[_lang as 'en' | 'pt' | 'es']).toBe(name);
    // The chords track's closing card sends the learner to the panel by that name.
    expect(m.tracks.chords.end.progression).toContain(name);
  });
});

const keysOf = (): MusicKey[] =>
  (['major', 'minor'] as const).flatMap((mode) => Array.from({ length: 12 }, (_, pc) => ({ root: pickerRoot(pc, mode), mode })));

const listsFor = (key: MusicKey): { id: string; chords: Chord[] }[] => [
  ...PROGRESSION_PRESETS.filter((p) => p.mode === key.mode).map((p) => ({ id: p.id, chords: presetChords(p, key) })),
  { id: 'the key\'s seven chords', chords: getDiatonicChordsForScale(buildScale(key.root, key.mode === 'major' ? 'major' : 'natural_minor')).map((d) => d.chord) },
];

const pcs = (c: Chord) => [...new Set(c.notes.map((n) => getPitchClass(n)))].sort((a, b) => a - b);

describe('seam 3: the panel\'s capo line and the neck\'s line name the same shape', () => {
  it('for every chord of every preset and of the seven chords, in all 24 keys, capo 1–9', () => {
    let compared = 0;
    const disagree: string[] = [];
    for (const key of keysOf()) for (const { id, chords } of listsFor(key)) for (let capo = 1; capo <= 9; capo++) {
      const panel = capoShapes(chords, key, capo);
      chords.forEach((chord, i) => {
        // The neck's line names `shapeChord` (Fretboard.tsx, capo.line).
        const neck = chordShapesForCapo(chord, 0, capo).shapeChord;
        compared++;
        if (chordSymbol(panel[i]) !== chordSymbol(neck)) disagree.push(`${id} capo ${capo} ${chordSymbol(chord)}: ${chordSymbol(panel[i])} / ${chordSymbol(neck)}`);
        // And the shape + capo is the chord that sounds.
        expect(pcs(panel[i]).map((p) => (p + capo) % 12).sort((a, b) => a - b)).toEqual(pcs(chord));
      });
    }
    expect(disagree).toEqual([]);
    expect(compared).toBe(5508); // 24 keys × (their presets + the seven chords) × capo 1–9, chord by chord
  });

  it('the capo ideas name their shapes by the same rule', () => {
    for (const key of keysOf()) for (const { chords } of listsFor(key)) {
      for (const idea of capoOptions(chords, key)) {
        idea.shapes.forEach((s, i) => expect(chordSymbol(s.shape)).toBe(chordSymbol(chordShapesForCapo(chords[i], 0, idea.fret).shapeChord)));
      }
    }
  });

  it('G major I–V–vi–IV with a capo on 1: one spelling on both surfaces (was D♯m in the panel, E♭m on the neck)', () => {
    const key: MusicKey = { root: pickerRoot(7, 'major'), mode: 'major' };
    const chords = presetChords(PROGRESSION_PRESETS.find((p) => p.id === 'I-V-vi-IV')!, key);
    expect(capoShapes(chords, key, 1).map(chordSymbol)).toEqual(['F♯', 'D♭', 'E♭m', 'B']);
    expect(chords.map((c) => chordSymbol(chordShapesForCapo(c, 0, 1).shapeChord))).toEqual(['F♯', 'D♭', 'E♭m', 'B']);
  });

  it('B♭ major I–IV–V: the first idea is capo 3 with G, C, D, and the neck says "the G shape" for B♭', () => {
    const key: MusicKey = { root: pickerRoot(10, 'major'), mode: 'major' };
    const chords = presetChords(PROGRESSION_PRESETS.find((p) => p.id === 'I-IV-V')!, key);
    const ideas = capoIdeas(chords, key);
    expect(ideas.map((o) => o.fret)).toContain(3);
    expect(capoShapes(chords, key, 3).map(chordSymbol)).toEqual(['G', 'C', 'D']);
    expect(chordSymbol(chordShapesForCapo(chords[0], 0, 3).shapeChord)).toBe('G');
  });
});

describe('seam 6: Drill\'s table names lessons that exist, by their titles', () => {
  it('every lesson the table names is in MODULE_INDEX, and a track lesson opens in its track\'s unit', () => {
    const ids = new Set(MODULE_INDEX.map((m) => m.id));
    for (const id of lessonIdsNamed()) expect(ids.has(id), id).toBe(true);
    for (const id of Object.keys(TRACK_UNLOCKS)) {
      const unit = L1_UNITS.find((u) => u.modules.some((m) => m.id === id))!;
      expect(unit.track, id).toBeDefined();
      expect(learnTargetOf(id)).toEqual({ levelId: 'l1', unitId: unit.id, moduleId: id });
    }
  });

  it.each(['pt', 'es'] as const)('%s: each track lesson Drill names has its own title (the lesson\'s, not English)', async (lang) => {
    await loadModuleIndex(lang);
    const overlay = lang === 'pt' ? ptCurriculumL1 : esCurriculumL1;
    for (const id of Object.keys(TRACK_UNLOCKS)) {
      const title = getModuleTitle(id, lang);
      expect(title, id).toBe(overlay.modules[id].title);
      expect(title, id).not.toBe(getModuleTitle(id, 'en'));
    }
  });

  it('en: the titles are the lessons\' own', () => {
    for (const id of Object.keys(TRACK_UNLOCKS)) {
      const mod = L1_UNITS.flatMap((u) => u.modules).find((m) => m.id === id)!;
      expect(getModuleTitle(id, 'en')).toBe(mod.title);
    }
  });
});

describe('seam 5: lesson 8, the glossary entry and the neck say the same about the capo', () => {
  const lesson = L1_UNITS.flatMap((u) => u.modules).find((m) => m.id === 'l1u35m8')!;
  it('"G shapes with a capo on fret 2 sound in A": the entry and the lesson say it, and the neck draws A with the G shape', () => {
    expect(glossaryEn.entries.capo.plain).toContain('G shapes with a capo on fret 2 sound in A');
    expect(lesson.concepts.map((c) => c.explanation).join(' ')).toContain('G shapes with a capo at fret 2 sound in the key of A');
    expect(glossaryPt.entries.capo.plain).toContain('formas de G com capo no traste 2 soam em A');
    expect(glossaryEs.entries.capo.plain).toContain('formas de G con capo en el traste 2 suenan en A');
    const A = { natural: 'A', accidental: '' } as const;
    expect(chordSymbol(chordShapesForCapo(buildChord(A, 'major'), 0, 2).shapeChord)).toBe('G');
  });
  it('the lesson\'s shape-and-sound pairs are what the neck names (capo 2: G→A, C→D, D→E, Em→F♯m; capo 4: C→E; capo 5: D→G)', () => {
    const pairs: [string, number, string][] = [['A', 2, 'G'], ['D', 2, 'C'], ['E', 2, 'D'], ['F#m', 2, 'Em'], ['E', 4, 'C'], ['G', 5, 'D']];
    for (const [sounds, capo, shape] of pairs) {
      const root = { natural: sounds[0], accidental: sounds[1] === '#' ? '#' : '' } as Chord['root'];
      const chord = buildChord(root, sounds.endsWith('m') ? 'minor' : 'major');
      expect(chordSymbol(chordShapesForCapo(chord, 0, capo).shapeChord), `${sounds} capo ${capo}`).toBe(shape);
    }
  });
  it('ES never calls the capo "cejilla" outside the entry\'s one note (the app\'s word for the barre)', () => {
    expect(JSON.stringify(es.capo)).not.toMatch(/cejilla/i);
    expect(JSON.stringify(es.progression)).not.toMatch(/cejilla/i);
    expect(JSON.stringify(es.tracks)).not.toMatch(/cejilla/i);
  });
});
