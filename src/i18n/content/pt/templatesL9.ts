import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 9 exercise templates
// 14 modules with templates (l9u32m5 relies on hand-authored exercises).
// All "listen" templates are real ear_training exercises (F-03).
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 30: Treino de Altura e Intervalos
  // =========================================================================

  // ---- l9u30m1: Correspondência de Altura/Direção ----
  l9u30m1: [
    {
      // ear_training (note)
      promptTemplate:
        'Ouve a altura e identifica-a.',
      hintTemplate:
        'Usa alturas de referência que conheças (A4 = 440 Hz, Dó central = C4) para te orientares.',
    },
    {
      // ear_training (note, com acidente)
      promptTemplate:
        'Ouve esta altura e identifica-a. Inclui um acidente.',
      hintTemplate:
        'Esta nota tem um sustenido ou bemol. Ouve se soa mais aguda ou mais grave do que a nota natural mais próxima.',
    },
  ],

  // ---- l9u30m2: Reconhecimento Maior vs Menor ----
  l9u30m2: [
    {
      // ear_training (interval)
      promptTemplate:
        'Ouve este intervalo e identifica-o. A terceira é maior ou menor?',
      hintTemplate:
        '3.a maior = 4 semitons (brilhante, alegre). 3.a menor = 3 semitons (sombria, triste). A diferença é apenas meio-tom, mas o carácter muda dramaticamente.',
    },
    {
      // ear_training (chord)
      promptTemplate:
        'Ouve este acorde e identifica a sua qualidade.',
      hintTemplate:
        'O maior soa brilhante e aberto. O menor soa sombrio e pensativo. Concentra-te na 3.a: 3.a maior = 4 semitons, 3.a menor = 3 semitons.',
    },
  ],

  // ---- l9u30m3: Reconhecimento de Intervalos P1-P5 ----
  l9u30m3: [
    {
      // ear_training (interval)
      promptTemplate:
        'Ouve este intervalo, tocado em movimento {direction}, e identifica-o. Concentra-te em intervalos até à 5.a perfeita.',
      hintTemplate:
        'Treino auditivo de intervalos: 2m=1 (tenso), 2M=2 (passo), 3m=3 (triste), 3M=4 (brilhante), 4P=5 (aberto), 5P=7 (forte). Conta os semitons que ouves.',
    },
  ],

  // ---- l9u30m4: Reconhecimento de Intervalos 6.a m-P8 ----
  l9u30m4: [
    {
      // ear_training (interval)
      promptTemplate:
        'Ouve este intervalo mais largo, tocado em movimento {direction}, e identifica-o.',
      hintTemplate:
        'Intervalos largos: trítono=6 (tenso), 6m=8 (agridoce), 6M=9 (quente), 7m=10 (jazz), 7M=11 (anelante), 8P=12 (oitava).',
    },
  ],

  // ---- l9u30m5: Intervalos Harmónicos ----
  l9u30m5: [
    {
      // ear_training (interval, harmónico)
      promptTemplate:
        'Ouve estas duas notas tocadas em simultâneo e identifica o intervalo harmónico.',
      hintTemplate:
        'Os intervalos harmónicos soam ambas as notas ao mesmo tempo. As consonâncias (3, 4, 5, 7, 8, 9, 12 semitons) fundem-se suavemente. As dissonâncias (1, 2, 6, 10, 11) criam tensão.',
    },
  ],

  // =========================================================================
  // Unidade 31: Reconhecimento de Acordes e Escalas
  // =========================================================================

  // ---- l9u31m1: Reconhecimento de Escalas Maior/Menor ----
  l9u31m1: [
    {
      // ear_training (scale)
      promptTemplate:
        'Ouve esta escala e identifica o seu tipo.',
      hintTemplate:
        'Escala maior: T-T-mT-T-T-T-mT (brilhante, resolvida). Menor natural: T-mT-T-T-mT-T-T (sombria, aberta). Menor harmónica: eleva o 7.o, criando um salto distintivo de tom e meio.',
    },
  ],

  // ---- l9u31m2: Reconhecimento de Escalas Modais ----
  l9u31m2: [
    {
      // ear_training (scale)
      promptTemplate:
        'Ouve esta escala e identifica o modo. Ouve com atenção a nota característica.',
      hintTemplate:
        'Identificadores dos modos: Dórico = 6 natural em contexto menor, Frígio = b2, Lídio = #4, Mixolídio = b7 em contexto maior.',
    },
  ],

  // ---- l9u31m3: Reconhecimento de Escalas Pentatónicas, Blues e Simétricas ----
  l9u31m3: [
    {
      // ear_training (scale)
      promptTemplate:
        'Ouve esta escala e identifica o seu tipo.',
      hintTemplate:
        'As escalas pentatónicas têm cinco notas e nenhuma tensão de meio-tom. A escala de blues acrescenta a "blue note" (b5). A escala de tons inteiros é toda em tons -- onírica e sem centro.',
    },
  ],

  // ---- l9u31m4: Reconhecimento de Qualidade de Tríades ----
  l9u31m4: [
    {
      // ear_training (chord)
      promptTemplate:
        'Ouve esta tríade e identifica a sua qualidade.',
      hintTemplate:
        'Maior = brilhante/estável. Menor = sombria/estável. Diminuta = tensa/instável. Aumentada = brilhante/não resolvida.',
    },
  ],

  // ---- l9u31m5: Reconhecimento de Qualidade de Acordes de Sétima ----
  l9u31m5: [
    {
      // ear_training (chord)
      promptTemplate:
        'Ouve este acorde de sétima e identifica a sua qualidade.',
      hintTemplate:
        'maj7 = sonhador/exuberante. m7 = suave/quente. 7 da dominante = brilhante/pede resolução. meio-diminuto = sombrio/não resolvido. dim7 = muito tenso.',
    },
  ],

  // =========================================================================
  // Unidade 32: Ditado Melódico e Leitura à Primeira Vista
  // =========================================================================

  // ---- l9u32m1: Ditado Melódico Diatónico ----
  l9u32m1: [
    {
      // ear_training (note)
      promptTemplate:
        'Ouve esta altura de uma melodia por graus e identifica-a.',
      hintTemplate:
        'Em melodias por graus, cada nota está a meio-tom ou um tom da anterior. Canta a escala para te orientares.',
    },
    {
      // ear_training (interval)
      promptTemplate:
        'Ouve este intervalo melódico, tocado em movimento {direction}, e identifica-o.',
      hintTemplate:
        'As melodias diatónicas misturam passos (1-2 semitons) e saltos (3M=4, 4P=5, 5P=7, 8P=12). Canta o que ouviste antes de responder.',
    },
  ],

  // ---- l9u32m2: Ditado Melódico Cromático ----
  l9u32m2: [
    {
      // ear_training (note)
      promptTemplate:
        'Ouve esta nota cromática e identifica-a.',
      hintTemplate:
        'Notas cromáticas são acidentes que não pertencem à tonalidade atual. Criam tensão que resolve para notas diatónicas próximas.',
    },
    {
      // ear_training (interval)
      promptTemplate:
        'Ouve este intervalo cromático, tocado em movimento {direction}, e identifica-o.',
      hintTemplate:
        'Os intervalos cromáticos incluem qualidades aumentadas e diminutas. Este intervalo usa uma nota fora da escala diatónica.',
    },
  ],

  // ---- l9u32m3: Ditado Harmónico -- Cadências e Progressões ----
  l9u32m3: [
    {
      // ear_training (progression, cadências)
      promptTemplate:
        'Ouve esta cadência em C maior e identifica-a.',
      hintTemplate:
        'Autêntica (V-I) = chegada conclusiva. Plagal (IV-I) = a cadência do "Amen". Deceptiva (V-vi) = chegada esperada desviada. Meia (I-V) = pausa na tensão.',
    },
    {
      // ear_training (progression)
      promptTemplate:
        'Ouve esta progressão de acordes em C maior e identifica o padrão de numerais romanos.',
      hintTemplate:
        'Concentra-te no movimento do baixo e na qualidade de cada acorde. Progressões comuns: I-IV-V-I (básica), I-V-vi-IV (pop), ii-V-I (jazz), I-vi-IV-V (anos 50).',
    },
  ],

  // ---- l9u32m4: Leitura à Primeira Vista -- Diatónica ----
  l9u32m4: [
    {
      // scale_degree_id
      promptTemplate:
        'Na escala de {root} {scaleType}, que grau é {note}? Canta a partir da tónica para o encontrar.',
      hintTemplate:
        'A leitura à primeira vista usa solfejo (do-re-mi-fa-sol-la-si) ou números de graus. Em {root} {scaleType}, conta a partir de {root} para encontrar o grau {degree}.',
    },
    {
      // scale_build
      promptTemplate:
        'Canta e depois constrói a escala de {root} {scaleType}. Seleciona as 7 notas.',
      hintTemplate:
        'Canta mentalmente a escala a partir de {root} usando solfejo ou números antes de selecionar as notas. A escala {scaleType} tem um padrão sonoro distintivo.',
    },
  ],
};

export default overlay;
