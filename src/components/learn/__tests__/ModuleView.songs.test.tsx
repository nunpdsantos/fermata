/**
 * W6-03 — "Songs That Use This" shows the context sentence in the app
 * language. The song overlays existed but were never loaded, so Portuguese and
 * Spanish learners always read English (and two PT/ES entries described the
 * wrong songs). This renders real modules through ModuleView in EN/PT/ES.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ModuleView } from '../ModuleView';
import { useAppStore } from '../../../state/store';
import i18n from '../../../i18n';
import { getSongReferences, getAllSongReferences } from '../../../data/songReferences';
import ptSongs from '../../../i18n/content/pt/songs';
import esSongs from '../../../i18n/content/es/songs';
import type { CurriculumModule, CurriculumUnit, CurriculumLevel } from '../../../core/types/curriculum';

afterEach(async () => {
  cleanup();
  useAppStore.setState({ language: 'en' });
  await i18n.changeLanguage('en');
});

function moduleFor(id: string): CurriculumModule {
  return {
    id,
    unitId: 'u',
    levelId: id.slice(0, 2),
    title: 'Module',
    subtitle: 'sub',
    objectives: [],
    concepts: [],
    tasks: [],
    prerequisites: [],
  } as unknown as CurriculumModule;
}

function renderModule(id: string) {
  const module_ = moduleFor(id);
  const unit = { id: 'u', levelId: module_.levelId, title: 'U', description: '', modules: [module_] } as unknown as CurriculumUnit;
  const level = { id: module_.levelId, number: 1, title: 'L', description: '', accentColor: '#8b5cf6', units: [unit] } as unknown as CurriculumLevel;
  return render(
    <ModuleView
      module={module_}
      unit={unit}
      level={level}
      unitIndex={0}
      moduleIndex={0}
      isModuleCompleted={false}
      isTaskCompleted={() => true}
      completedTaskCount={0}
      exercises={[]}
      exercisesState="ready"
      exercisesPassed={false}
      levelCompletedModuleCount={0}
      onToggleTask={() => {}}
      onCompleteModule={() => {}}
      onRecordExerciseResult={() => {}}
      onExercisesComplete={() => {}}
      onBack={() => {}}
      onBackToLevels={() => {}}
      onNavigateModule={() => {}}
    />,
  );
}

describe('ModuleView song references follow the app language', () => {
  it('EN shows the English context', () => {
    renderModule('l1u2m2');
    expect(screen.getByText(getSongReferences('l1u2m2')[0].context)).toBeTruthy();
  });

  it('PT shows the Portuguese context for The Blue Danube (a waltz, not 6/8)', async () => {
    useAppStore.setState({ language: 'pt' });
    await i18n.changeLanguage('pt');
    renderModule('l1u2m2');
    expect(await screen.findByText(/A valsa por excelência/)).toBeTruthy();
    expect(screen.queryByText(getSongReferences('l1u2m2')[0].context)).toBeNull();
  });

  it('ES shows the Spanish context for the l4u14m2 songs (previously untranslated)', async () => {
    useAppStore.setState({ language: 'es' });
    await i18n.changeLanguage('es');
    renderModule('l4u14m2');
    expect(await screen.findByText(/compases asimétricos/)).toBeTruthy();
    expect(await screen.findByText(/riff de bajo está en 7\/4/)).toBeTruthy();
  });

  it('PT shows all three l2u6m1 songs translated (America was missing)', async () => {
    useAppStore.setState({ language: 'pt' });
    await i18n.changeLanguage('pt');
    renderModule('l2u6m1');
    expect(await screen.findByText(/hemíola/)).toBeTruthy();
  });
});

describe('song overlays cover every English song, in order', () => {
  const en = getAllSongReferences();
  for (const [lang, overlay] of [['pt', ptSongs], ['es', esSongs]] as const) {
    it(`${lang}: same modules and same song count per module`, () => {
      expect(Object.keys(overlay).sort()).toEqual(Object.keys(en).sort());
      for (const [id, songs] of Object.entries(en)) {
        expect(overlay[id]?.length, `${lang} ${id}`).toBe(songs.length);
      }
    });

    it(`${lang}: each context keeps the English meter/Roman-numeral tokens (catches shifted entries)`, () => {
      const TOKENS = /\b\d+\/\d+\b|\b(?:i{1,3}|iv|vi{0,2}|I{1,3}|IV|VI{0,2})(?:ø?7)?(?=[–\-)\s,.]|$)/g;
      for (const [id, songs] of Object.entries(en)) {
        songs.forEach((song, i) => {
          const enTokens = [...song.context.matchAll(TOKENS)].map((m) => m[0]).filter((t) => /\d\/\d|[IViv]/.test(t)).sort();
          const ovTokens = [...(overlay[id]?.[i] ?? '').matchAll(TOKENS)].map((m) => m[0]).filter((t) => /\d\/\d|[IViv]/.test(t)).sort();
          expect(ovTokens, `${lang} ${id}[${i}] ${song.song}`).toEqual(enTokens);
        });
      }
    });
  }
});
