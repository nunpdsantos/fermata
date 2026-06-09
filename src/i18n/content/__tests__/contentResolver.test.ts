import { describe, it, expect } from 'vitest';
import {
  applyCurriculumOverlay,
  applyExerciseOverlay,
  applyTemplateOverlay,
  applySongOverlay,
} from '../contentResolver';
import type { CurriculumLevel } from '../../../core/types/curriculum';
import type { ExerciseDefinition } from '../../../core/types/exercise';
import type { ModuleTemplateConfig } from '../../../data/exercises/exerciseTemplates';
import type {
  CurriculumLevelOverlay,
  ExerciseLevelOverlay,
  TemplateLevelOverlay,
  SongOverlay,
} from '../types';
import type { SongReference } from '../../../data/songReferences';

// ─── Fixtures ───────────────────────────────────────────────────────────────

const BASE_LEVEL: CurriculumLevel = {
  id: 'l1',
  number: 1,
  title: 'English Title',
  description: 'English desc',
  difficulty: 'beginner',
  difficultyLabel: 'Beginner',
  accentColor: '#60A5FA',
  prerequisites: [],
  units: [
    {
      id: 'u1',
      levelId: 'l1',
      title: 'Unit One',
      description: 'Unit desc',
      icon: 'note',
      modules: [
        {
          id: 'l1u1m1',
          unitId: 'u1',
          levelId: 'l1',
          title: 'Module Title',
          subtitle: 'Module subtitle',
          objectives: ['Obj 1', 'Obj 2'],
          concepts: [
            {
              title: 'Concept A',
              explanation: 'English explanation',
              tryThisQuery: 'C major',
              tryThisLabel: 'Try it',
            },
          ],
          tasks: [
            { id: 'l1u1m1t1', instruction: 'Do this thing' },
          ],
          prerequisites: [],
        },
      ],
    },
  ],
};

const CURRICULUM_OVERLAY: CurriculumLevelOverlay = {
  units: {
    u1: { title: 'Unidade Um', description: 'Desc unidade' },
  },
  modules: {
    l1u1m1: {
      title: 'Título do Módulo',
      subtitle: 'Subtítulo do módulo',
      objectives: ['Obj PT 1', 'Obj PT 2'],
      concepts: [
        { title: 'Conceito A', explanation: 'Explicação PT', tryThisLabel: 'Experimenta' },
      ],
      tasks: [
        { instruction: 'Faz esta coisa' },
      ],
    },
  },
};

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('applyCurriculumOverlay', () => {
  it('returns original level when overlay is null', () => {
    const result = applyCurriculumOverlay(BASE_LEVEL, null);
    expect(result).toBe(BASE_LEVEL);
  });

  it('translates unit title and description', () => {
    const result = applyCurriculumOverlay(BASE_LEVEL, CURRICULUM_OVERLAY);
    expect(result.units[0].title).toBe('Unidade Um');
    expect(result.units[0].description).toBe('Desc unidade');
  });

  it('translates module fields', () => {
    const result = applyCurriculumOverlay(BASE_LEVEL, CURRICULUM_OVERLAY);
    const mod = result.units[0].modules[0];
    expect(mod.title).toBe('Título do Módulo');
    expect(mod.subtitle).toBe('Subtítulo do módulo');
    expect(mod.objectives).toEqual(['Obj PT 1', 'Obj PT 2']);
  });

  it('translates concept fields', () => {
    const result = applyCurriculumOverlay(BASE_LEVEL, CURRICULUM_OVERLAY);
    const concept = result.units[0].modules[0].concepts[0];
    expect(concept.title).toBe('Conceito A');
    expect(concept.explanation).toBe('Explicação PT');
    expect(concept.tryThisLabel).toBe('Experimenta');
  });

  it('preserves non-translated fields', () => {
    const result = applyCurriculumOverlay(BASE_LEVEL, CURRICULUM_OVERLAY);
    const concept = result.units[0].modules[0].concepts[0];
    expect(concept.tryThisQuery).toBe('C major');
  });

  it('translates task instructions', () => {
    const result = applyCurriculumOverlay(BASE_LEVEL, CURRICULUM_OVERLAY);
    expect(result.units[0].modules[0].tasks[0].instruction).toBe('Faz esta coisa');
  });

  it('preserves task IDs', () => {
    const result = applyCurriculumOverlay(BASE_LEVEL, CURRICULUM_OVERLAY);
    expect(result.units[0].modules[0].tasks[0].id).toBe('l1u1m1t1');
  });

  it('does not mutate original', () => {
    applyCurriculumOverlay(BASE_LEVEL, CURRICULUM_OVERLAY);
    expect(BASE_LEVEL.units[0].title).toBe('Unit One');
    expect(BASE_LEVEL.units[0].modules[0].title).toBe('Module Title');
  });

  it('handles missing module in overlay gracefully', () => {
    const partial: CurriculumLevelOverlay = { units: {}, modules: {} };
    const result = applyCurriculumOverlay(BASE_LEVEL, partial);
    expect(result.units[0].title).toBe('Unit One');
    expect(result.units[0].modules[0].title).toBe('Module Title');
  });
});

describe('applyExerciseOverlay', () => {
  const exercises: Record<string, ExerciseDefinition[]> = {
    l1u1m1: [
      {
        id: 'l1u1m1e1',
        type: 'note_id',
        prompt: 'Identify this note',
        config: { type: 'note_id', note: 'C', accidental: '', octave: 4 },
        hint: 'It is middle C',
        points: 1,
      },
      {
        id: 'l1u1m1e2',
        type: 'multiple_choice',
        prompt: 'Which clef?',
        config: {
          type: 'multiple_choice',
          choices: [
            { label: 'Treble', correct: true },
            { label: 'Bass', correct: false },
          ],
        },
        hint: 'G clef',
        points: 1,
      },
      {
        id: 'l1u1m1e_ear1',
        type: 'ear_training',
        prompt: 'Listen to this chord and identify its quality.',
        config: {
          type: 'ear_training',
          mode: 'chord',
          chordRoot: 'C',
          chordRootAccidental: '',
          quality: 'major',
          choices: [
            { label: 'Major', correct: true },
            { label: 'Minor', correct: false },
          ],
        },
        hint: 'Major chords sound bright',
        points: 1,
      },
    ],
  };

  it('returns original when overlay is null', () => {
    const result = applyExerciseOverlay(exercises, null);
    expect(result).toBe(exercises);
  });

  it('translates prompt and hint', () => {
    const overlay: ExerciseLevelOverlay = {
      l1u1m1e1: { prompt: 'Identifica esta nota', hint: 'É o Dó central' },
    };
    const result = applyExerciseOverlay(exercises, overlay);
    expect(result.l1u1m1[0].prompt).toBe('Identifica esta nota');
    expect(result.l1u1m1[0].hint).toBe('É o Dó central');
  });

  it('translates multiple choice labels', () => {
    const overlay: ExerciseLevelOverlay = {
      l1u1m1e2: {
        prompt: 'Que clave?',
        choices: ['Clave de sol', 'Clave de fá'],
      },
    };
    const result = applyExerciseOverlay(exercises, overlay);
    const config = result.l1u1m1[1].config;
    expect(config.type).toBe('multiple_choice');
    if (config.type === 'multiple_choice') {
      expect(config.choices[0].label).toBe('Clave de sol');
      expect(config.choices[1].label).toBe('Clave de fá');
      // Correctness preserved
      expect(config.choices[0].correct).toBe(true);
      expect(config.choices[1].correct).toBe(false);
    }
  });

  it('does not mutate original', () => {
    const overlay: ExerciseLevelOverlay = {
      l1u1m1e1: { prompt: 'Translated' },
    };
    applyExerciseOverlay(exercises, overlay);
    expect(exercises.l1u1m1[0].prompt).toBe('Identify this note');
  });

  it('skips exercises not in overlay', () => {
    const overlay: ExerciseLevelOverlay = {
      l1u1m1e1: { prompt: 'Translated' },
    };
    const result = applyExerciseOverlay(exercises, overlay);
    expect(result.l1u1m1[1].prompt).toBe('Which clef?');
  });

  // ExerciseRunner reads ear_training (chord mode) answer labels from
  // exercise.config.choices, so translated choices must apply there too —
  // previously only multiple_choice got them (PT/ES l3u9m1e_ear1..4 dropped).
  it('translates ear_training chord-mode choice labels', () => {
    const overlay: ExerciseLevelOverlay = {
      l1u1m1e_ear1: {
        prompt: 'Ouve este acorde e identifica a sua qualidade.',
        choices: ['Maior', 'Menor'],
      },
    };
    const result = applyExerciseOverlay(exercises, overlay);
    const config = result.l1u1m1[2].config;
    expect(config.type).toBe('ear_training');
    if (config.type === 'ear_training') {
      expect(config.choices?.[0].label).toBe('Maior');
      expect(config.choices?.[1].label).toBe('Menor');
      // Correctness and audio params preserved
      expect(config.choices?.[0].correct).toBe(true);
      expect(config.choices?.[1].correct).toBe(false);
      expect(config.chordRoot).toBe('C');
      expect(config.quality).toBe('major');
    }
  });

  it('leaves ear_training exercises without overlay choices untouched', () => {
    const overlay: ExerciseLevelOverlay = {
      l1u1m1e_ear1: { prompt: 'Ouve este acorde.' },
    };
    const result = applyExerciseOverlay(exercises, overlay);
    const config = result.l1u1m1[2].config;
    if (config.type === 'ear_training') {
      expect(config.choices?.[0].label).toBe('Major');
    }
  });
});

describe('applyTemplateOverlay', () => {
  const configs: ModuleTemplateConfig[] = [
    {
      moduleId: 'l1u1m1',
      targetCount: 5,
      templates: [
        {
          type: 'note_id',
          promptTemplate: 'Identify {note}',
          hintTemplate: 'This is {note}',
          params: { roots: ['C'], octaves: [4] },
        },
        {
          type: 'multiple_choice',
          promptTemplate: 'Pick the clef',
          hintTemplate: 'Think about G clef',
          params: {
            choiceSets: [
              [{ label: 'Treble', correct: true }, { label: 'Bass', correct: false }],
            ],
          },
        },
      ],
    },
  ];

  it('returns original when overlay is null', () => {
    const result = applyTemplateOverlay(configs, null);
    expect(result).toBe(configs);
  });

  it('translates promptTemplate and hintTemplate', () => {
    const overlay: TemplateLevelOverlay = {
      l1u1m1: [
        { promptTemplate: 'Identifica {note}', hintTemplate: 'Esta é {note}' },
      ],
    };
    const result = applyTemplateOverlay(configs, overlay);
    expect(result[0].templates[0].promptTemplate).toBe('Identifica {note}');
    expect(result[0].templates[0].hintTemplate).toBe('Esta é {note}');
  });

  it('translates choice set labels', () => {
    const overlay: TemplateLevelOverlay = {
      l1u1m1: [
        { promptTemplate: 'Identifica {note}', hintTemplate: 'Esta é {note}' },
        {
          promptTemplate: 'Escolhe a clave',
          hintTemplate: 'Pensa na clave de sol',
          choiceSets: [['Clave de sol', 'Clave de fá']],
        },
      ],
    };
    const result = applyTemplateOverlay(configs, overlay);
    const choiceSets = result[0].templates[1].params.choiceSets!;
    expect(choiceSets[0][0].label).toBe('Clave de sol');
    expect(choiceSets[0][1].label).toBe('Clave de fá');
    expect(choiceSets[0][0].correct).toBe(true);
  });

  it('does not mutate original', () => {
    const overlay: TemplateLevelOverlay = {
      l1u1m1: [
        { promptTemplate: 'Translated', hintTemplate: 'Translated' },
      ],
    };
    applyTemplateOverlay(configs, overlay);
    expect(configs[0].templates[0].promptTemplate).toBe('Identify {note}');
  });
});

describe('applySongOverlay', () => {
  const refs: Record<string, SongReference[]> = {
    l1u1m1: [
      { song: 'Für Elise', artist: 'Beethoven', context: 'English context' },
      { song: 'Ode to Joy', artist: 'Beethoven', context: 'Another context' },
    ],
  };

  it('returns original when overlay is null', () => {
    expect(applySongOverlay(refs, null)).toBe(refs);
  });

  it('translates context strings', () => {
    const overlay: SongOverlay = {
      l1u1m1: ['Contexto PT', 'Outro contexto'],
    };
    const result = applySongOverlay(refs, overlay);
    expect(result.l1u1m1[0].context).toBe('Contexto PT');
    expect(result.l1u1m1[1].context).toBe('Outro contexto');
  });

  it('preserves song and artist', () => {
    const overlay: SongOverlay = {
      l1u1m1: ['Contexto PT', 'Outro contexto'],
    };
    const result = applySongOverlay(refs, overlay);
    expect(result.l1u1m1[0].song).toBe('Für Elise');
    expect(result.l1u1m1[0].artist).toBe('Beethoven');
  });

  it('does not mutate original', () => {
    const overlay: SongOverlay = {
      l1u1m1: ['Translated'],
    };
    applySongOverlay(refs, overlay);
    expect(refs.l1u1m1[0].context).toBe('English context');
  });
});
