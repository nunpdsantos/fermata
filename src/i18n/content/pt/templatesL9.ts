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

  // ---- l9u30m1: Correspondencia de Altura/Direcao ----
  l9u30m1: [
    {
      // ear_training (note)
      promptTemplate:
        'Ouve a altura e identifica-a.',
      hintTemplate:
        'Usa alturas de referencia que conhecas (A4 = 440 Hz, Do central = C4) para te orientares.',
    },
    {
      // ear_training (note, com acidente)
      promptTemplate:
        'Ouve esta altura e identifica-a. Inclui um acidente.',
      hintTemplate:
        'Esta nota tem um sustenido ou bemol. Ouve se soa mais aguda ou mais grave do que a nota natural mais proxima.',
    },
  ],

  // ---- l9u30m2: Reconhecimento Maior vs Menor ----
  l9u30m2: [
    {
      // ear_training (interval)
      promptTemplate:
        'Ouve este intervalo e identifica-o. A terceira e maior ou menor?',
      hintTemplate:
        '3.a maior = 4 semitons (brilhante, alegre). 3.a menor = 3 semitons (sombria, triste). A diferenca e apenas meio-tom, mas o caracter muda dramaticamente.',
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
        'Ouve este intervalo, tocado em movimento {direction}, e identifica-o. Concentra-te em intervalos ate a 5.a perfeita.',
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
        'Intervalos largos: tritono=6 (tenso), 6m=8 (agridoce), 6M=9 (quente), 7m=10 (jazz), 7M=11 (anelante), 8P=12 (oitava).',
    },
  ],

  // ---- l9u30m5: Intervalos Harmonicos ----
  l9u30m5: [
    {
      // ear_training (interval, harmonico)
      promptTemplate:
        'Ouve estas duas notas tocadas em simultaneo e identifica o intervalo harmonico.',
      hintTemplate:
        'Os intervalos harmonicos soam ambas as notas ao mesmo tempo. As consonancias (3, 4, 5, 7, 8, 9, 12 semitons) fundem-se suavemente. As dissonancias (1, 2, 6, 10, 11) criam tensao.',
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
        'Escala maior: T-T-mT-T-T-T-mT (brilhante, resolvida). Menor natural: T-mT-T-T-mT-T-T (sombria, aberta). Menor harmonica: eleva o 7.o, criando um salto distintivo de tom e meio.',
    },
  ],

  // ---- l9u31m2: Reconhecimento de Escalas Modais ----
  l9u31m2: [
    {
      // ear_training (scale)
      promptTemplate:
        'Ouve esta escala e identifica o modo. Ouve com atencao a nota caracteristica.',
      hintTemplate:
        'Identificadores dos modos: Dorico = 6 natural em contexto menor, Frigio = b2, Lidio = #4, Mixolidio = b7 em contexto maior.',
    },
  ],

  // ---- l9u31m3: Reconhecimento de Escalas Pentatonicas, Blues e Simetricas ----
  l9u31m3: [
    {
      // ear_training (scale)
      promptTemplate:
        'Ouve esta escala e identifica o seu tipo.',
      hintTemplate:
        'As escalas pentatonicas tem cinco notas e nenhuma tensao de meio-tom. A escala de blues acrescenta a "blue note" (b5). A escala de tons inteiros e toda em tons -- onirica e sem centro.',
    },
  ],

  // ---- l9u31m4: Reconhecimento de Qualidade de Triades ----
  l9u31m4: [
    {
      // ear_training (chord)
      promptTemplate:
        'Ouve esta triade e identifica a sua qualidade.',
      hintTemplate:
        'Maior = brilhante/estavel. Menor = sombria/estavel. Diminuta = tensa/instavel. Aumentada = brilhante/nao resolvida.',
    },
  ],

  // ---- l9u31m5: Reconhecimento de Qualidade de Acordes de Setima ----
  l9u31m5: [
    {
      // ear_training (chord)
      promptTemplate:
        'Ouve este acorde de setima e identifica a sua qualidade.',
      hintTemplate:
        'maj7 = sonhador/exuberante. m7 = suave/quente. 7 da dominante = brilhante/pede resolucao. meio-diminuto = sombrio/nao resolvido. dim7 = muito tenso.',
    },
  ],

  // =========================================================================
  // Unidade 32: Ditado Melodico e Leitura a Primeira Vista
  // =========================================================================

  // ---- l9u32m1: Ditado Melodico Diatonico ----
  l9u32m1: [
    {
      // ear_training (note)
      promptTemplate:
        'Ouve esta altura de uma melodia por graus e identifica-a.',
      hintTemplate:
        'Em melodias por graus, cada nota esta a meio-tom ou um tom da anterior. Canta a escala para te orientares.',
    },
    {
      // ear_training (interval)
      promptTemplate:
        'Ouve este intervalo melodico, tocado em movimento {direction}, e identifica-o.',
      hintTemplate:
        'As melodias diatonicas misturam passos (1-2 semitons) e saltos (3M=4, 4P=5, 5P=7, 8P=12). Canta o que ouviste antes de responder.',
    },
  ],

  // ---- l9u32m2: Ditado Melodico Cromatico ----
  l9u32m2: [
    {
      // ear_training (note)
      promptTemplate:
        'Ouve esta nota cromatica e identifica-a.',
      hintTemplate:
        'Notas cromaticas sao acidentes que nao pertencem a tonalidade atual. Criam tensao que resolve para notas diatonicas proximas.',
    },
    {
      // ear_training (interval)
      promptTemplate:
        'Ouve este intervalo cromatico, tocado em movimento {direction}, e identifica-o.',
      hintTemplate:
        'Os intervalos cromaticos incluem qualidades aumentadas e diminutas. Este intervalo usa uma nota fora da escala diatonica.',
    },
  ],

  // ---- l9u32m3: Ditado Harmonico -- Cadencias e Progressoes ----
  l9u32m3: [
    {
      // ear_training (progression, cadencias)
      promptTemplate:
        'Ouve esta cadencia em C maior e identifica-a.',
      hintTemplate:
        'Autentica (V-I) = chegada conclusiva. Plagal (IV-I) = a cadencia do "Amen". Deceptiva (V-vi) = chegada esperada desviada. Meia (I-V) = pausa na tensao.',
    },
    {
      // ear_training (progression)
      promptTemplate:
        'Ouve esta progressao de acordes em C maior e identifica o padrao de numerais romanos.',
      hintTemplate:
        'Concentra-te no movimento do baixo e na qualidade de cada acorde. Progressoes comuns: I-IV-V-I (basica), I-V-vi-IV (pop), ii-V-I (jazz), I-vi-IV-V (anos 50).',
    },
  ],

  // ---- l9u32m4: Leitura a Primeira Vista -- Diatonica ----
  l9u32m4: [
    {
      // scale_degree_id
      promptTemplate:
        'Na escala de {root} {scaleType}, que grau e {note}? Canta a partir da tonica para o encontrar.',
      hintTemplate:
        'A leitura a primeira vista usa solfejo (do-re-mi-fa-sol-la-si) ou numeros de graus. Em {root} {scaleType}, conta a partir de {root} para encontrar o grau {degree}.',
    },
    {
      // scale_build
      promptTemplate:
        'Canta e depois constroi a escala de {root} {scaleType}. Seleciona as 7 notas.',
      hintTemplate:
        'Canta mentalmente a escala a partir de {root} usando solfejo ou numeros antes de selecionar as notas. A escala {scaleType} tem um padrao sonoro distintivo.',
    },
  ],
};

export default overlay;
