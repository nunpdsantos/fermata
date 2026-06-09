import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 9 exercise templates
// 15 modules, ~80 generated exercises
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 30: Treino de Altura e Intervalos
  // =========================================================================

  // ---- l9u30m1: Correspondencia de Altura/Direcao ----
  l9u30m1: [
    {
      // note_id
      promptTemplate:
        'Ouve a altura e identifica-a. Esta e {note} na oitava {octave}.',
      hintTemplate:
        'Usa alturas de referencia que conhecas (A4 = 440 Hz, Do central = C4) para te orientares. A nota e {note}{octave}.',
    },
    {
      // note_id
      promptTemplate:
        'Identifica esta altura. Inclui um acidente.',
      hintTemplate:
        'Esta nota tem um sustenido ou bemol. Ouve se soa mais aguda ou mais grave do que a nota natural mais proxima.',
    },
  ],

  // ---- l9u30m2: Reconhecimento Maior vs Menor ----
  l9u30m2: [
    {
      // interval_id
      promptTemplate:
        'Ouve e identifica este intervalo a partir de {root}. E maior ou menor?',
      hintTemplate:
        '3.a maior = 4 semitons (brilhante, alegre). 3.a menor = 3 semitons (sombria, triste). A diferenca e apenas meio-tom, mas o caracter muda dramaticamente.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Distingue a qualidade maior da menor de ouvido.',
      hintTemplate:
        'Maior soa brilhante e aberto. Menor soa sombrio e pensativo. Foca-te na 3.a: 3.a maior = 4 semitons, 3.a menor = 3 semitons.',
      choiceSets: [
        [
          'Um acorde maior soa brilhante porque tem uma 3.a maior (4 semitons)',
          'Um acorde maior soa brilhante por causa da 5.a perfeita',
          'Acordes maiores e menores soam identicos',
          'A fundamental determina se um acorde soa brilhante',
        ],
        [
          'Um acorde menor soa mais sombrio porque tem uma 3.a menor (3 semitons)',
          'Acordes menores tem uma fundamental mais grave',
          'Acordes menores nao tem 5.a',
          'A 5.a faz um acorde soar menor',
        ],
      ],
    },
  ],

  // ---- l9u30m3: Reconhecimento de Intervalos P1-P5 ----
  l9u30m3: [
    {
      // interval_id
      promptTemplate:
        'Ouve e identifica este intervalo a partir de {root} no sentido {direction}. Foca-te em intervalos ate a 5.a perfeita.',
      hintTemplate:
        'Treino auditivo de intervalos: 2.a m=1 (tensa), 2.a M=2 (passo), 3.a m=3 (triste), 3.a M=4 (brilhante), 4.a P=5 (aberta), 5.a P=7 (poderosa). A partir de {root}, conta os semitons.',
    },
  ],

  // ---- l9u30m4: Reconhecimento de Intervalos 6.a m-P8 ----
  l9u30m4: [
    {
      // interval_id
      promptTemplate:
        'Ouve e identifica este intervalo mais amplo a partir de {root} no sentido {direction}.',
      hintTemplate:
        'Intervalos amplos: tritono=6 (tenso), 6.a m=8 (agridoce), 6.a M=9 (quente), 7.a m=10 (jazz), 7.a M=11 (anelante), 8.a P=12 (oitava). A partir de {root}.',
    },
  ],

  // ---- l9u30m5: Intervalos Harmonicos ----
  l9u30m5: [
    {
      // interval_id
      promptTemplate:
        'Ouve estas duas notas tocadas simultaneamente a partir de {root} e identifica o intervalo harmonico.',
      hintTemplate:
        'Intervalos harmonicos soam ambas as notas de uma vez. Consonancias (3, 4, 5, 7, 8, 9, 12) fundem-se suavemente. Dissonancias (1, 2, 6, 10, 11) criam tensao. A partir de {root}.',
    },
  ],

  // =========================================================================
  // Unidade 31: Reconhecimento de Acordes e Escalas
  // =========================================================================

  // ---- l9u31m1: Reconhecimento de Escalas Maior/Menor ----
  l9u31m1: [
    {
      // scale_build
      promptTemplate:
        'Apos ouvir, constroi a escala de {root} {scaleType} que ouviste. Seleciona todas as notas.',
      hintTemplate:
        'Escala maior: T-T-mT-T-T-T-mT (brilhante, resolvida). Menor natural: T-mT-T-T-mT-T-T (sombria, aberta). Menor harmonica: eleva o 7.o. Constroi a partir de {root}.',
    },
  ],

  // ---- l9u31m2: Reconhecimento de Escalas Modais ----
  l9u31m2: [
    {
      // scale_build
      promptTemplate:
        'Constroi a escala de {root} {scaleType}. Ouve a nota caracteristica que define este modo.',
      hintTemplate:
        'Identificadores modais: Dorico = 6.a natural em contexto menor, Frigio = b2, Lidio = #4, Mixolidio = b7 em contexto maior. Constroi a partir de {root}.',
    },
  ],

  // ---- l9u31m3: Qualidade de Triades de Ouvido ----
  l9u31m3: [
    {
      // chord_build
      promptTemplate:
        'Ouve e constroi a triade de {root} {quality}. Identifica a qualidade do acorde de ouvido.',
      hintTemplate:
        'Maior = brilhante/estavel. Menor = sombrio/estavel. Diminuto = tenso/instavel. Aumentado = brilhante/nao resolvido. Constroi a triade sobre {root}.',
    },
  ],

  // ---- l9u31m4: Qualidade de Acordes de Setima de Ouvido ----
  l9u31m4: [
    {
      // chord_build
      promptTemplate:
        'Ouve e constroi o acorde de {root} {quality}. Identifica a qualidade do acorde de setima de ouvido.',
      hintTemplate:
        '7.a M = sonhador/exuberante. 7.a m = suave/quente. 7.a dom = brilhante/precisa resolucao. meio-dim7 = sombrio/nao resolvido. dim7 = muito tenso. Constroi sobre {root}.',
    },
  ],

  // ---- l9u31m5: Progressao de Acordes de Ouvido ----
  l9u31m5: [
    {
      // multiple_choice
      promptTemplate:
        'Ouve esta progressao de acordes e identifica a analise em numeracao romana.',
      hintTemplate:
        'Foca-te no movimento do baixo e na qualidade de cada acorde. Progressoes comuns: I-IV-V-I, I-V-vi-IV, ii-V-I. Ouve padroes de resolucao e tensao.',
      choiceSets: [
        [
          'I - IV - V - I: a progressao harmonica mais basica na musica tonal',
          'I - ii - iii - IV',
          'I - V - IV - I',
          'I - vi - ii - V',
        ],
        [
          'I - V - vi - IV: a progressao pop mais comum',
          'I - IV - V - vi',
          'I - vi - V - IV',
          'I - ii - V - I',
        ],
        [
          'ii - V - I: a progressao fundamental do jazz',
          'I - V - ii: o padrao jazz',
          'V - ii - I: a resolucao jazz tipica',
          'I - ii - V: a abordagem jazz',
        ],
        [
          'I - vi - IV - V: a "progressao dos anos 50"',
          'I - V - IV - vi',
          'vi - I - IV - V',
          'I - IV - vi - V',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 32: Ditado Melodico e Leitura a Primeira Vista
  // =========================================================================

  // ---- l9u32m1: Ditado Melodico por Graus ----
  l9u32m1: [
    {
      // note_id
      promptTemplate:
        'Ouve esta nota numa melodia por graus e identifica-a. A nota e {note}.',
      hintTemplate:
        'Em melodias por graus, cada nota esta a meio-tom ou um tom da anterior. Canta a escala para te orientares. Esta nota e {note}.',
    },
    {
      // interval_id
      promptTemplate:
        'Identifica o passo a partir de {root}: e um meio-tom ou um tom?',
      hintTemplate:
        'Meios-tons (1 semitom) soam mais proximos/tensos. Tons (2 semitons) soam mais abertos. A partir de {root}, ouve com atencao.',
    },
  ],

  // ---- l9u32m2: Ditado Melodico com Saltos ----
  l9u32m2: [
    {
      // interval_id
      promptTemplate:
        'Ouve este salto a partir de {root} e identifica o intervalo.',
      hintTemplate:
        'Saltos melodicos comuns: 3.a M (4, brilhante), 4.a P (5, aberta), 5.a P (7, forte), 6.a m (8, expressiva), 8.a P (12, oitava). A partir de {root}, identifica o intervalo.',
    },
  ],

  // ---- l9u32m3: Ditado Melodico Cromatico ----
  l9u32m3: [
    {
      // note_id
      promptTemplate:
        'Identifica esta nota cromatica: {note}.',
      hintTemplate:
        'Notas cromaticas sao acidentes que nao pertencem a tonalidade atual. Criam tensao que resolve para notas diatonicas proximas. Esta nota e {note}.',
    },
    {
      // interval_id
      promptTemplate:
        'Identifica este intervalo cromatico a partir de {root}.',
      hintTemplate:
        'Intervalos cromaticos incluem qualidades aumentadas e diminutas. A partir de {root}, este intervalo usa uma nota fora da escala diatonica.',
    },
  ],

  // ---- l9u32m4: Leitura a Primeira Vista — Diatonica ----
  l9u32m4: [
    {
      // scale_degree_id
      promptTemplate:
        'Na escala de {root} {scaleType}, identifica o grau {degree}. Canta desde a tonica para o encontrar.',
      hintTemplate:
        'A leitura a primeira vista usa solfejo (do-re-mi-fa-sol-la-ti) ou numeros de graus. Em {root} {scaleType}, conta a partir de {root} para encontrar o grau {degree}.',
    },
    {
      // scale_build
      promptTemplate:
        'Canta e depois constroi a escala de {root} {scaleType}. Seleciona todas as 7 notas.',
      hintTemplate:
        'Canta mentalmente a escala comecando em {root} usando solfejo ou numeros antes de selecionar notas. A escala {scaleType} tem um padrao sonoro distintivo.',
    },
  ],

  // l9u32m5 (Audicao Contextual) nao tem templates gerados — usa os
  // exercicios multiple_choice escritos a mao em exercisesL9.ts.
};

export default overlay;
