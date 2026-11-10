/**
 * Wave 2: the frame for the starting tracks (src/data/tracks.ts). A track is
 * an optional unit that also carries `track`: registered as optional, its
 * lessons exactly the contract's ids, not part of its level's page or counts,
 * its Next / Previous chain its own (it never runs on into another unit), and
 * the eager "written" set the start hint reads kept equal to the module index.
 */
import { describe, it, expect } from 'vitest';
import { TRACKS, TRACK_IDS, WRITTEN_TRACK_LESSONS, isTrackWritten, trackOfModule, firstLessonOf } from '../tracks';
import { MODULE_INDEX } from '../moduleIndex';
import { LEVEL_METADATA, getLevelModuleCount, getNextModuleInLevel, getPreviousModuleInLevel } from '../curriculumLoader';
import { OPTIONAL_UNIT_IDS, isOptionalModuleId } from '../../core/constants/optionalCurriculum';
import { getNextModule, getPreviousModule } from '../../core/constants/curriculum';
import { L1_UNITS } from '../../core/constants/curriculumL1';
import type { CurriculumLevel } from '../../core/types/curriculum';
import { resolveTheoryQuery } from '../../utils/theoryQuery';
import { TRACK_ENDINGS } from '../../components/learn/tracks/trackEndings';
import ptCurriculumL1 from '../../i18n/content/pt/curriculumL1';
import esCurriculumL1 from '../../i18n/content/es/curriculumL1';
import en from '../../i18n/locales/en.json';
import pt from '../../i18n/locales/pt.json';
import es from '../../i18n/locales/es.json';

const L1: CurriculumLevel = {
  id: 'l1', number: 1, title: '', description: '', difficulty: 'beginner', difficultyLabel: '', accentColor: '', prerequisites: [], units: L1_UNITS,
};
const trackUnits = L1_UNITS.filter((u) => u.track);
const indexed = new Set(MODULE_INDEX.map((m) => m.id));

describe('the tracks in the curriculum', () => {
  it('every track unit is optional, registered, and holds exactly its contract lessons in order', () => {
    expect(trackUnits.map((u) => u.id)).toEqual(['u34', 'u35']);
    for (const unit of trackUnits) {
      const track = TRACKS[unit.track!];
      expect(unit.optional, unit.id).toBe(true);
      expect(OPTIONAL_UNIT_IDS.has(unit.id)).toBe(true);
      expect(unit.id).toBe(track.unitId);
      expect(unit.levelId).toBe(track.levelId);
      expect(unit.modules.map((m) => m.id)).toEqual(track.moduleIds);
      for (const m of unit.modules) {
        expect(isOptionalModuleId(m.id)).toBe(true);
        expect(trackOfModule(m.id)).toBe(track);
        expect(m.prerequisites, m.id).toEqual([]);
        expect(m.unitId).toBe(unit.id);
      }
    }
    expect(firstLessonOf(TRACKS.sound)).toEqual({ levelId: 'l1', unitId: 'u34', moduleId: 'l1u34m1' });
    expect(firstLessonOf(TRACKS.chords)).toEqual({ levelId: 'l1', unitId: 'u35', moduleId: 'l1u35m1' });
  });

  it('a track unit stands after the level\'s own units (Level 1 keeps u1, u2, u3, u33 first, in order)', () => {
    expect(L1_UNITS.map((u) => u.id)).toEqual(['u1', 'u2', 'u3', 'u33', 'u34', 'u35']);
  });

  it('Level 1 counts stay as on main: 4 units listed, 10 modules (hand-kept metadata included)', () => {
    const meta = LEVEL_METADATA.find((m) => m.id === 'l1')!;
    expect(L1_UNITS.filter((u) => !u.track)).toHaveLength(4);
    expect(meta.unitCount).toBe(L1_UNITS.filter((u) => !u.track).length);
    expect(getLevelModuleCount(L1)).toBe(10);
    expect(meta.moduleCount).toBe(10);
  });

  it('the eager written set equals the track lessons in the module index (so the start hint cannot drift)', () => {
    const inIndex = TRACK_IDS.flatMap((id) => TRACKS[id].moduleIds).filter((id) => indexed.has(id));
    expect([...WRITTEN_TRACK_LESSONS].sort()).toEqual([...inIndex].sort());
    // Every written lesson is in the curriculum data too.
    const inData = new Set(trackUnits.flatMap((u) => u.modules.map((m) => m.id)));
    expect([...WRITTEN_TRACK_LESSONS].every((id) => inData.has(id))).toBe(true);
    expect(isTrackWritten(TRACKS.sound)).toBe(true);
    expect(isTrackWritten(TRACKS.chords)).toBe(true);
    expect(indexed.has('l1u35m1')).toBe(true);
    expect([...WRITTEN_TRACK_LESSONS]).toEqual([...TRACKS.sound.moduleIds, ...TRACKS.chords.moduleIds]);
    expect(isTrackWritten(TRACKS.chords, new Set(['l1u35m1']))).toBe(true);
  });

  it('the unit\'s title is the track card\'s title, in EN, PT and ES', () => {
    for (const unit of trackUnits) {
      const id = unit.track!;
      expect(en.tracks[id].title).toBe(unit.title);
      expect(pt.tracks[id].title).toBe(ptCurriculumL1.units[unit.id].title);
      expect(es.tracks[id].title).toBe(esCurriculumL1.units[unit.id].title);
    }
  });

  it('every closing card step that opens Explore names a query the app resolves; the chords card opens the Progression panel and Level 2', () => {
    for (const steps of Object.values(TRACK_ENDINGS)) {
      for (const step of steps ?? []) {
        if (step.kind === 'explore') expect(resolveTheoryQuery(step.query), step.query).not.toBeNull();
        // The label is a real key in all three languages.
        for (const locale of [en, pt, es]) {
          const text = step.label.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], locale);
          expect(typeof text, step.label).toBe('string');
        }
      }
    }
    expect(TRACK_ENDINGS.sound!.map((s) => s.kind)).toEqual(['explore', 'level']);
    expect(TRACK_ENDINGS.chords).toEqual([
      { kind: 'progression', label: 'tracks.chords.end.progression' },
      { kind: 'level', label: 'tracks.chords.end.level2', levelId: 'l2' },
    ]);
    expect(en.tracks.chords.end).toEqual({ progression: 'Loop your own songs in the Progression panel', level2: 'Go deeper: Level 2' });
  });
});

describe('Next / Previous lesson: per unit for optional units (a track never runs into another unit)', () => {
  it('in a level (LearnView)', () => {
    // Guitar notation behaves as before: its own three lessons, then nothing.
    expect(getPreviousModuleInLevel('l1u33m1', L1)).toBeUndefined();
    expect(getNextModuleInLevel('l1u33m1', L1)?.id).toBe('l1u33m2');
    expect(getNextModuleInLevel('l1u33m3', L1)).toBeUndefined();
    // The track: its own five, in order; the last ends (on its closing card).
    expect(getPreviousModuleInLevel('l1u34m1', L1)).toBeUndefined();
    expect(TRACKS.sound.moduleIds.slice(0, -1).map((id) => getNextModuleInLevel(id, L1)?.id)).toEqual(TRACKS.sound.moduleIds.slice(1));
    expect(TRACKS.sound.moduleIds.slice(1).map((id) => getPreviousModuleInLevel(id, L1)?.id)).toEqual(TRACKS.sound.moduleIds.slice(0, -1));
    expect(getNextModuleInLevel('l1u34m5', L1)).toBeUndefined();
    // The chords track: its own ten, in order (m9 → m10, not m1); the last ends.
    expect(getPreviousModuleInLevel('l1u35m1', L1)).toBeUndefined();
    expect(TRACKS.chords.moduleIds.slice(0, -1).map((id) => getNextModuleInLevel(id, L1)?.id)).toEqual(TRACKS.chords.moduleIds.slice(1));
    expect(TRACKS.chords.moduleIds.slice(1).map((id) => getPreviousModuleInLevel(id, L1)?.id)).toEqual(TRACKS.chords.moduleIds.slice(0, -1));
    expect(getNextModuleInLevel('l1u35m10', L1)).toBeUndefined();
    // The required course is unchanged: l1u3m4 is Level 1's last.
    expect(getNextModuleInLevel('l1u3m4', L1)).toBeUndefined();
    expect(getNextModuleInLevel('l1u2m2', L1)?.id).toBe('l1u3m1');
  });

  it('across levels (core helpers)', () => {
    expect(getNextModule('l1u33m3')).toBeUndefined();
    expect(getPreviousModule('l1u34m1')).toBeUndefined();
    expect(getNextModule('l1u34m4')?.id).toBe('l1u34m5');
    expect(getNextModule('l1u34m5')).toBeUndefined();
    expect(getPreviousModule('l1u35m1')).toBeUndefined();
    expect(getNextModule('l1u35m9')?.id).toBe('l1u35m10');
    expect(getNextModule('l1u35m10')).toBeUndefined();
    expect(getNextModule('l1u3m4')?.id).toBe('l2u4m1');
    expect(getPreviousModule('l2u4m1')?.id).toBe('l1u3m4');
  });
});
