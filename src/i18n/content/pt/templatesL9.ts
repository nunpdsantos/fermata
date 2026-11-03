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
        'Usa alturas de referência que conheças (A4 = 440 Hz, C central = C4) para te orientares.',
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
        'Ouve este intervalo e identifica-o. É sempre uma terça — decide se é maior ou menor.',
      hintTemplate:
        '3.ª maior = 4 meios-tons (brilhante, alegre). 3.ª menor = 3 meios-tons (sombria, triste). A diferença é apenas meio-tom, mas o carácter muda dramaticamente.',
      nudgeTemplate: 'Ouve a cor das duas notas: uma terça brilhante e aberta, ou uma mais escura e sombria? Para confirmares, canta a partir da nota mais grave, meio-tom a meio-tom, e conta quantos são precisos até à mais aguda; a terça mais escura é meio-tom mais estreita.',
    },
    {
      // ear_training (chord)
      promptTemplate:
        'Ouve este acorde e identifica a sua qualidade.',
      hintTemplate:
        'O maior soa brilhante e aberto. O menor soa sombrio e pensativo. Concentra-te na 3.ª: 3.ª maior = 4 meios-tons, 3.ª menor = 3 meios-tons.',
      nudgeTemplate: 'Concentra-te na 3.ª acima da fundamental: a 4 meios-tons soa brilhante e aberta, a 3 meios-tons soa sombria e pensativa. Qual ouves?',
    },
  ],

  // ---- l9u30m3: Reconhecimento de Intervalos P1-P5 ----
  l9u30m3: [
    {
      // ear_training (interval)
      promptTemplate:
        'Ouve este intervalo, tocado em movimento {direction}, e identifica-o. Concentra-te em intervalos até à 5.ª perfeita.',
      hintTemplate:
        'Treino auditivo de intervalos: 2m=1 (tenso), 2M=2 (passo), 3m=3 (triste), 3M=4 (brilhante), 4P=5 (aberto), trítono=6 (instável), 5P=7 (forte). Conta os meios-tons que ouves.',
      nudgeTemplate: 'Conta os meios-tons entre as duas notas (cantar os passos intermédios ajuda) e depois lembra-te de que intervalo tem esse tamanho.',
    },
  ],

  // ---- l9u30m4: Reconhecimento de Intervalos 6.a m-P8 ----
  l9u30m4: [
    {
      // ear_training (interval)
      promptTemplate:
        'Ouve este intervalo mais largo, tocado em movimento {direction}, e identifica-o.',
      hintTemplate:
        'Compara a distância com a oitava: 6m=8, 6M=9, 7m=10, 7M=11 e 8P=12 meios-tons.',
      nudgeTemplate: 'Primeiro ouve se as duas notas se fundem como uma só nota em duas alturas. Se não, canta de novo a nota mais grave, mas deslocada para logo acima da mais aguda, identifica o pequeno intervalo que se forma e inverte-o: os números somam 9, e a qualidade passa à oposta.',
    },
  ],

  // ---- l9u30m5: Intervalos Harmónicos ----
  l9u30m5: [
    {
      // ear_training (interval, harmónico)
      promptTemplate:
        'Ouve estas duas notas tocadas em simultâneo e identifica o intervalo harmónico.',
      hintTemplate:
        'Os intervalos harmónicos soam ambas as notas ao mesmo tempo. As consonâncias (3, 4, 5, 7, 8, 9, 12 meios-tons) fundem-se suavemente. As dissonâncias (1, 2, 6, 10, 11) criam tensão.',
    },
    {
      // ear_training (interval, harmónico, composto)
      promptTemplate:
        'Ouve estas duas notas tocadas em simultâneo e identifica o intervalo composto (maior do que uma oitava).',
      hintTemplate:
        'Um intervalo composto é um intervalo simples mais uma oitava: uma 9.ª = oitava + 2.ª (9m = 13, 9M = 14 meios-tons), uma 10.ª = oitava + 3.ª (10M = 16), uma 11.ª = oitava + 4.ª (11P = 17). Ouve o intervalo simples acima da oitava.',
      nudgeTemplate: 'Um intervalo composto é um intervalo simples mais uma oitava. Ouve o intervalo simples acima da oitava, dá-lhe nome e soma 7 ao seu número; a qualidade mantém-se.',
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
        'Escala maior: T-T-mT-T-T-T-mT (brilhante, resolvida). Menor natural: T-mT-T-T-mT-T-T (sombria, aberta). Menor harmónica: eleva o 7.º, criando um salto distintivo de tom e meio. Menor melódica (ascendente): eleva o 6.º e o 7.º — menor em baixo, maior em cima.',
      nudgeTemplate: 'Primeiro a 3.ª: está a 4 ou a 3 meios-tons da tónica? Se estiver a 3, segue as últimas notas até à tónica: o 7.º grau fica a um tom ou a meio-tom dela, e há um salto de tom e meio logo antes do 7.º?',
    },
  ],

  // ---- l9u31m2: Reconhecimento de Escalas Modais ----
  l9u31m2: [
    {
      // ear_training (scale)
      promptTemplate:
        'Ouve esta escala e identifica o modo. Ouve com atenção a nota característica.',
      hintTemplate:
        'Identificadores dos modos: Dórico = 6 natural em contexto menor, Frígio = b2, Lídio = #4, Mixolídio = b7 em contexto maior, Lócrio = b2 e b5 (o mais sombrio).',
      nudgeTemplate: 'Primeiro a 3.ª: está a 4 ou a 3 meios-tons da tónica? Depois compara com a escala maior (se forem 4) ou com a menor natural (se forem 3) e encontra o que muda: um 2.º baixado (sozinho, ou também com o 5.º baixado), um 4.º elevado, um 6.º elevado ou um 7.º baixado?',
    },
  ],

  // ---- l9u31m3: Reconhecimento de Escalas Pentatónicas, Blues e Simétricas ----
  l9u31m3: [
    {
      // ear_training (scale)
      promptTemplate:
        'Ouve esta escala e identifica o seu tipo.',
      hintTemplate:
        'As escalas pentatónicas têm cinco notas e nenhuma tensão de meio-tom. A escala de blues acrescenta a "blue note" (b5). A escala de tons inteiros é toda em tons — onírica e sem centro. A escala diminuta (meio-tom/tom) alterna meios-tons e tons — oito notas, simétrica e tensa.',
      nudgeTemplate: 'Conta as notas e os meios-tons: cinco notas sem meios-tons, seis notas todas a um tom de distância, seis com uma nota cromática entre o 4.º e o 5.º graus, ou oito a alternar meio-tom e tom? Se forem cinco, verifica se a 3.ª está a 4 ou a 3 meios-tons da tónica.',
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
      nudgeTemplate: 'Ouve a tríade como duas 3.as empilhadas, de baixo para cima: 4 + 3, 3 + 4, 3 + 3 ou 4 + 4 meios-tons? Verifica também a 5.ª exterior: é perfeita, ou meio-tom mais estreita ou mais larga?',
    },
  ],

  // ---- l9u31m5: Reconhecimento de Qualidade de Acordes de Sétima ----
  l9u31m5: [
    {
      // ear_training (chord)
      promptTemplate:
        'Ouve este acorde de sétima e identifica a sua qualidade.',
      hintTemplate:
        'maj7 = sonhador/exuberante. m7 = suave/quente. 7 da dominante = brilhante/pede resolução. meio-diminuto = sombrio/não resolvido. dim7 = muito tenso. menor com 7.ª M = uma tríade menor sombria sob uma 7.ª maior brilhante, inquietante.',
      nudgeTemplate: 'Ouve o acorde em duas camadas. A tríade: a 3.ª está a 4 ou a 3 meios-tons da fundamental, e a 5.ª é perfeita ou meio-tom mais baixa? A 7.ª: fica a 1, 2 ou 3 meios-tons abaixo da oitava?',
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
        'As melodias diatónicas misturam passos (1-2 meios-tons) e saltos (3M=4, 4P=5, 5P=7, 8P=12). Canta o que ouviste antes de responder.',
    },
  ],

  // ---- l9u32m2: Ditado Melódico Cromático ----
  l9u32m2: [
    {
      // ear_training (note)
      promptTemplate:
        'Ouve esta nota e identifica-a. A maioria das notas deste conjunto são sustenidos.',
      hintTemplate:
        'Sustenidos como C#, F# e G# estão fora de C maior; numa melodia em C maior seriam notas cromáticas, atraídas para uma nota vizinha da escala.',
      nudgeTemplate: 'Parte da nota de referência que ouves primeiro e canta para cima, meio-tom a meio-tom, contando, até chegares à nota. Depois situa-a no teclado: uma tecla preta toma o nome da tecla branca logo abaixo, com um sustenido.',
    },
    {
      // ear_training (interval)
      promptTemplate:
        'Ouve este intervalo, tocado em movimento {direction}, e identifica-o.',
      hintTemplate:
        'Conta os meios-tons: 2.ª menor = 1, 3.ª menor = 3, trítono = 6, 6.ª menor = 8, 7.ª menor = 10, 7.ª maior = 11. Medidos a partir da tónica de uma tonalidade maior, os cinco primeiros são exatamente as notas fora da escala (b2, b3, #4, b6, b7).',
      nudgeTemplate: 'Canta da nota mais grave até à mais aguda e conta os meios-tons. Num salto largo, mede antes quanto lhe falta para a oitava e deduz daí o tamanho.',
    },
  ],

  // ---- l9u32m3: Ditado Harmónico -- Cadências e Progressões ----
  l9u32m3: [
    {
      // ear_training (progression, cadências)
      promptTemplate:
        'Ouve esta cadência em C maior e identifica-a.',
      hintTemplate:
        'Autêntica (V-I) = chegada conclusiva. Plagal (IV-I) = a cadência do "Amen". Interrompida (V-vi) = chegada esperada desviada. Meia cadência (I-V) = pausa na tensão.',
      nudgeTemplate: 'Ouve onde termina: na tónica, num acorde menor onde se esperava a tónica, ou num acorde aberto que deixa tudo em suspenso? Se chegar à tónica, chega com a atração forte da dominante ou com o som mais suave do "Amen"?',
    },
    {
      // ear_training (progression)
      promptTemplate:
        'Ouve esta progressão de acordes em C maior e identifica o padrão de numerais romanos.',
      hintTemplate:
        'Concentra-te no movimento do baixo e na qualidade de cada acorde. Progressões comuns: I-IV-V-I (básica), I-V-vi-IV (pop), ii-V-I (jazz), I-vi-IV-V (anos 50).',
      nudgeTemplate: 'Conta os acordes (três ou quatro?) e procura acordes menores: não há nenhum, ou há um em primeiro, segundo ou terceiro lugar? Depois segue o baixo para distinguir os acordes maiores.',
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
        'Canta mentalmente a escala a partir de {root} usando solfejo ou números antes de selecionar as notas. Ouve o padrão de tons e meios-tons que dá à escala {scaleType} o seu som.',
    },
  ],
};

export default overlay;
