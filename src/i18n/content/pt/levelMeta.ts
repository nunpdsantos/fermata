import type { LevelMetaOverlay } from '../types';

const levelMeta: Record<string, LevelMetaOverlay> = {
  l1: {
    title: 'Fundamentos da literacia musical',
    description: 'Notação na pauta, fundamentos de altura, ritmo e compasso, a escala maior, intervalos básicos e tríades maiores.',
    difficultyLabel: 'Principiante absoluto',
  },
  l2: {
    title: 'Expansão dos fundamentos',
    description: 'Todas as armações de clave, nomes dos graus da escala, escalas menores, compasso composto, síncopa, qualidade de intervalos, todos os tipos de tríade, inversões e harmonia diatónica.',
    difficultyLabel: 'Principiante',
  },
  l3: {
    title: 'Fundamentos de harmonia',
    description: 'Acordes de sétima, condução de vozes, cadências, estrutura frásica e notas estranhas ao acorde.',
    difficultyLabel: 'Principiante avançado',
  },
  l4: {
    title: 'Domínio diatónico',
    description: 'Notas estranhas avançadas, domínio do acorde de sétima da dominante, função harmónica, sequências e contraponto.',
    difficultyLabel: 'Intermédio',
  },
  l5: {
    title: 'Cromatismo e modulação',
    description: 'Dominantes secundárias, tonicização, modulação, mistura modal e forma musical.',
    difficultyLabel: 'Intermédio avançado',
  },
  l6: {
    title: 'Harmonia cromática',
    description: 'Acorde napolitano, sextas aumentadas, modulação enarmónica e contraponto avançado.',
    difficultyLabel: 'Intermédio superior',
  },
  l7: {
    title: 'Jazz, pop e harmonia modal',
    description: 'Cifras de jazz, progressões ii–V–I, harmonia modal, análise pop e taxonomia completa de escalas e acordes.',
    difficultyLabel: 'Avançado',
  },
  l8: {
    title: 'Análise, contraponto e pós-tonal',
    description: 'Análise de fugas, grande forma, orquestração, teoria dos conjuntos e técnicas do século XX.',
    difficultyLabel: 'Avançado',
  },
  l9: {
    title: 'Treino auditivo e competências aurais',
    description: 'Reconhecimento de intervalos, identificação de acordes, ditado melódico, leitura à primeira vista e audição contextual.',
    difficultyLabel: 'Todos os níveis',
  },
};

export default levelMeta;
