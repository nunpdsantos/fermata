import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese translations for Level 9 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidade 30: Treino de Altura e Intervalos
  // =========================================================================

  // ---- l9u30m1: Correspondência de Altura/Direção ----

  l9u30m1e1: {
    prompt:
      'Ouve esta altura e identifica-a.',
    hint: 'O Dó central (C4) é o ponto de referência central no piano -- ancora-o no teu ouvido.',
  },
  l9u30m1e2: {
    prompt:
      'Ouve esta altura e identifica-a.',
    hint: 'G4 está uma 5.a perfeita acima do Dó central -- 7 semitons acima. Compara-o com C4 no teu ouvido.',
  },
  l9u30m1e3: {
    prompt:
      'Quando uma segunda altura soa mais aguda do que a primeira, qual é a direção do movimento de altura?',
    choices: [
      'Ascendente',
      'Descendente',
      'Oblíquo',
      'Estático',
    ],
    hint: 'Ascendente significa mover-se para cima em altura. Descendente significa mover-se para baixo.',
  },
  l9u30m1e4: {
    prompt: 'O que significa "registo" em música?',
    choices: [
      'A posição relativa de agudo ou grave numa faixa de alturas',
      'O nível de volume de uma interpretação',
      'A velocidade a que as notas são tocadas',
      'O número de instrumentos a tocar simultaneamente',
    ],
    hint: 'Registo descreve uma porção do espetro de alturas -- registo grave, registo médio ou registo agudo.',
  },

  // ---- l9u30m2: Reconhecimento Maior vs Menor ----

  l9u30m2e1: {
    prompt:
      'Ouve este acorde. É maior ou menor?',
    choices: ['Maior', 'Menor'],
    hint: 'A 3.a maior (4 semitons a partir da fundamental) dá aos acordes maiores um carácter brilhante e estável.',
  },
  l9u30m2e2: {
    prompt:
      'Ouve este acorde. É maior ou menor?',
    choices: ['Maior', 'Menor'],
    hint: 'A 3.a menor (3 semitons a partir da fundamental) dá aos acordes menores uma qualidade mais sombria e melancólica.',
  },
  l9u30m2e3: {
    prompt:
      'Qual é a diferença estrutural entre uma tríade maior e uma tríade menor?',
    choices: [
      'A terceira é baixada meio-tom no menor',
      'A quinta é baixada meio-tom no menor',
      'A fundamental é elevada meio-tom no menor',
      'Tríades menores têm quatro notas em vez de três',
    ],
    hint: 'Tríade maior: fundamental + 3.a maior (4 semitons) + 5.a P. Tríade menor: fundamental + 3.a menor (3 semitons) + 5.a P. Só a 3.a muda.',
  },

  // ---- l9u30m3: Reconhecimento de Intervalos P1-P5 ----

  l9u30m3e1: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '1 semitom = 2.a menor (meio-tom) -- o menor intervalo na música ocidental. Pensa no tema de Tubarão.',
  },
  l9u30m3e2: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '2 semitons = 2.a maior (tom). O passo melódico do dia a dia.',
  },
  l9u30m3e3: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '3 semitons = 3.a menor -- sombria e melancólica. Este intervalo define a base de uma tríade menor.',
  },
  l9u30m3e4: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '7 semitons = 5.a perfeita -- forte e aberta. O intervalo mais consonante depois da oitava e do uníssono.',
  },

  // ---- l9u30m4: Reconhecimento de Intervalos 6.a m-P8 ----

  l9u30m4e1: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '8 semitons = 6.a menor -- agridoce e anelante, com uma qualidade pungente e algo tensa.',
  },
  l9u30m4e2: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '9 semitons = 6.a maior -- quente, romântica e consonante.',
  },
  l9u30m4e3: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '10 semitons = 7.a menor -- uma tensão dominante e bluesy que quer resolver.',
  },
  l9u30m4e4: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '12 semitons = oitava perfeita -- as duas notas soam como a mesma altura em registos diferentes.',
  },

  // ---- l9u30m5: Intervalos Harmónicos ----

  l9u30m5e1: {
    prompt:
      'Ouve estas duas notas tocadas em simultâneo e identifica o intervalo harmónico.',
    hint: '5 semitons = 4.a perfeita. Em simultâneo tem uma qualidade aberta e oca.',
  },
  l9u30m5e2: {
    prompt:
      'Ouve estas duas notas tocadas em simultâneo e identifica o intervalo harmónico.',
    hint: '4 semitons = 3.a maior -- um som harmónico quente e consonante.',
  },
  l9u30m5e3: {
    prompt:
      'Qual é a diferença entre um intervalo harmónico e um intervalo melódico?',
    choices: [
      'Intervalos harmónicos soam simultaneamente; intervalos melódicos soam em sequência',
      'Intervalos harmónicos são consonantes; intervalos melódicos são dissonantes',
      'Intervalos harmónicos usam sustenidos; intervalos melódicos usam bemóis',
      'Intervalos harmónicos abrangem mais de uma oitava; intervalos melódicos não',
    ],
    hint: 'Harmónico = ambas as notas ao mesmo tempo. Melódico = uma nota após a outra. As mesmas duas notas podem formar qualquer tipo.',
  },

  // =========================================================================
  // Unidade 31: Escalas, Acordes e Ditado
  // =========================================================================

  // ---- l9u31m1: Reconhecimento de Escalas Maior/Menor ----

  l9u31m1e1: {
    prompt:
      'Ouve esta escala e identifica o seu tipo.',
    choices: ['Maior', 'Menor natural', 'Menor harmónica'],
    hint: 'A escala maior (T-T-mT-T-T-T-mT) tem um carácter brilhante e resolvido em cada passo.',
  },
  l9u31m1e2: {
    prompt:
      'Ouve esta escala e identifica o seu tipo.',
    choices: ['Maior', 'Menor natural', 'Menor harmónica'],
    hint: 'A menor natural (T-mT-T-T-mT-T-T) tem uma atmosfera mais sombria do que a maior -- a 3.a, 6.a e 7.a baixadas moldam a sua cor.',
  },
  l9u31m1e3: {
    prompt:
      'Qual descreve melhor o carácter geral de uma escala maior?',
    choices: [
      'Brilhante, alegre e resolvido',
      'Sombrio, triste e tenso',
      'Misterioso e ambíguo',
      'Dissonante e instável',
    ],
    hint: 'As escalas maiores são percebidas como brilhantes e estáveis. A 3.a maior e a 7.a maior contribuem para este carácter positivo.',
  },

  // ---- l9u31m2: Reconhecimento de Modos ----

  l9u31m2e1: {
    prompt:
      'Ouve esta escala e identifica o modo.',
    choices: ['Dórico', 'Frígio', 'Lídio', 'Mixolídio'],
    hint: 'O Dórico é como o menor natural com o 6.o grau elevado -- esse 6 natural em contexto menor é a nota característica.',
  },
  l9u31m2e2: {
    prompt:
      'Ouve esta escala e identifica o modo.',
    choices: ['Dórico', 'Frígio', 'Lídio', 'Mixolídio'],
    hint: 'O Lídio é como o maior com o 4.o grau elevado -- ouve o #4 brilhante a puxar para cima.',
  },
  l9u31m2e3: {
    prompt:
      'Qual é a nota característica que distingue o Dórico do menor natural?',
    choices: [
      'Um 6.o grau elevado',
      'Um 2.o grau baixado',
      'Um 7.o grau elevado',
      'Um 5.o grau baixado',
    ],
    hint: 'O Dórico difere do menor natural por uma nota: o 6.o grau é elevado meio-tom. Em D Dórico, é B natural em vez de Bb.',
  },

  // ---- l9u31m3: Pentatónica/Blues/Simétrica ----

  l9u31m3e1: {
    prompt:
      'Ouve esta escala e identifica o seu tipo.',
    choices: ['Pentatónica maior', 'Pentatónica menor', 'Blues', 'Tons inteiros'],
    hint: 'A pentatónica maior tem cinco notas e nenhum meio-tom -- a escala maior sem o 4.o e o 7.o graus.',
  },
  l9u31m3e2: {
    prompt:
      'Ouve esta escala e identifica o seu tipo.',
    choices: ['Pentatónica maior', 'Pentatónica menor', 'Blues', 'Tons inteiros'],
    hint: 'A escala de blues é a pentatónica menor mais a "blue note" (b5) -- ouve essa mordida cromática extra.',
  },
  l9u31m3e3: {
    prompt: 'O que é a "blue note" numa escala de blues?',
    choices: [
      'A nota cromática entre o 4.o e o 5.o graus (5.a bemolizada / 4.a sustenida)',
      'A 3.a menor de qualquer acorde',
      'Qualquer nota tocada com vibrato',
      'A sensível da tonalidade',
    ],
    hint: 'A blue note é a b5 (ou #4) acrescentada à pentatónica menor. Em C blues, é Gb/F#, entre F e G.',
  },

  // ---- l9u31m4: Reconhecimento de Qualidade de Tríades ----

  l9u31m4e1: {
    prompt:
      'Ouve esta tríade e identifica a sua qualidade.',
    choices: ['Maior', 'Menor', 'Diminuta', 'Aumentada'],
    hint: 'Diminuta = duas 3.as menores empilhadas. O trítono entre fundamental e 5.a cria a sua qualidade tensa e instável.',
  },
  l9u31m4e2: {
    prompt:
      'Ouve esta tríade e identifica a sua qualidade.',
    choices: ['Maior', 'Menor', 'Diminuta', 'Aumentada'],
    hint: 'Aumentada = duas 3.as maiores empilhadas. A estrutura simétrica dá-lhe uma qualidade sonhadora e não resolvida.',
  },
  l9u31m4e3: {
    prompt: 'Que intervalos compõem uma tríade diminuta?',
    choices: [
      'Fundamental, 3.a menor e 5.a diminuta (trítono)',
      'Fundamental, 3.a maior e 5.a perfeita',
      'Fundamental, 3.a menor e 5.a perfeita',
      'Fundamental, 3.a maior e 5.a aumentada',
    ],
    hint: 'Diminuta = 3.a menor (3 semitons) + 5.a diminuta (6 semitons). Duas 3.as menores empilhadas produzem o trítono entre fundamental e 5.a.',
  },
  l9u31m4e4: {
    prompt: 'Como descreverias o som de uma tríade aumentada?',
    choices: [
      'Tensa e não resolvida com uma qualidade sonhadora e flutuante',
      'Brilhante e estável como um acorde maior',
      'Sombria e pesada como um acorde menor',
      'Oca e medieval como um power chord',
    ],
    hint: 'Tríades aumentadas dividem a oitava em três partes iguais (3.a M + 3.a M). Esta simetria cria uma sensação ambígua e suspensa.',
  },

  // ---- l9u31m5: Qualidade de Acordes de Sétima ----

  l9u31m5e1: {
    prompt:
      'Ouve este acorde de sétima e identifica a sua qualidade.',
    choices: ['Maior com 7.a', 'Menor com 7.a', 'Sétima da dominante', 'Meio-diminuto'],
    hint: 'O acorde maior com 7.a sobrepõe uma 7.a maior a uma tríade maior -- exuberante e sonhador, comum no jazz e na bossa nova.',
  },
  l9u31m5e2: {
    prompt:
      'Ouve este acorde de sétima e identifica a sua qualidade.',
    choices: ['Maior com 7.a', 'Menor com 7.a', 'Sétima da dominante', 'Meio-diminuto'],
    hint: 'O acorde menor com 7.a sobrepõe uma 7.a menor a uma tríade menor -- suave, quente e descontraído.',
  },
  l9u31m5e3: {
    prompt:
      'O que dá a um acorde de 7.a dominante a sua sensação característica de tensão e desejo de resolver?',
    choices: [
      'O trítono formado entre a 3.a maior e a 7.a menor',
      'A 5.a perfeita entre fundamental e 5.a',
      'A 3.a maior entre fundamental e 3.a',
      'A duplicação à oitava da fundamental',
    ],
    hint: 'Em G7 (G-B-D-F), B e F formam um trítono (6 semitons). Esta dissonância cria a atração para resolução a C maior.',
  },
  l9u31m5e4: {
    prompt:
      'Em que contexto musical é o acorde de sétima meio-diminuto mais frequentemente encontrado?',
    choices: [
      'Como acorde ii em tonalidades menores (p. ex. Bm7b5 em A menor)',
      'Como acorde I em tonalidades maiores',
      'Como acorde V em tonalidades maiores',
      'Como acorde IV em progressões de blues',
    ],
    hint: 'O acorde de sétima meio-diminuto (m7b5) ocorre naturalmente no 2.o grau da menor harmónica. Serve como acorde predominante conduzindo ao V em progressões ii-V-i menores.',
  },

  // =========================================================================
  // Unidade 32: Ditado, Leitura à Primeira Vista, Contextual
  // =========================================================================

  // ---- l9u32m1: Ditado Melódico Diatónico ----

  l9u32m1e1: {
    prompt:
      'Ouve esta nota e identifica-a.',
    hint: 'Esta altura é o 3.o grau de C maior. Canta a partir de C para a localizar.',
  },
  l9u32m1e2: {
    prompt:
      'Ouve esta nota e identifica-a.',
    hint: 'Esta altura é o 6.o grau de C maior. Canta a partir de C para a localizar.',
  },
  l9u32m1e3: {
    prompt: 'O que significa "melodia diatónica"?',
    choices: [
      'Uma melodia que usa apenas as notas da tonalidade ou escala predominante',
      'Uma melodia que usa sustenidos e bemóis fora da tonalidade',
      'Uma melodia tocada apenas numa corda da guitarra',
      'Uma melodia que se move exclusivamente por graus',
    ],
    hint: 'Diatónico significa "pertencente à tonalidade." Uma melodia diatónica em C maior usa apenas C, D, E, F, G, A e B -- sem acidentes.',
  },
  l9u32m1e4: {
    prompt:
      'Qual estratégia é mais eficaz para identificar graus individuais da escala numa melodia?',
    choices: [
      'Relacionar cada nota com a tónica cantando a escala até esse grau',
      'Memorizar a frequência em hertz de cada nota',
      'Contar o número de linhas suplementares na pauta',
      'Tocar a melodia ao contrário para verificar a resposta',
    ],
    hint: 'Ouvir graus da escala significa perceber cada nota em relação à tónica. Cantar desde "do" até à nota alvo é um método fiável.',
  },

  // ---- l9u32m2: Ditado Melódico Cromático ----

  l9u32m2e1: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: 'Um meio-tom cromático (1 semitom) num contexto melódico funciona frequentemente como nota de passagem.',
  },
  l9u32m2e2: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: 'O trítono (6 semitons, 4.a aumentada / 5.a diminuta) é o intervalo mais dissonante e divide a oitava exatamente ao meio.',
  },
  l9u32m2e3: {
    prompt: 'O que é uma nota cromática de passagem?',
    choices: [
      'Uma nota fora da tonalidade que preenche um tom entre duas notas diatónicas',
      'Qualquer nota tocada com acento',
      'A primeira nota de uma escala cromática',
      'Uma nota sustentada para lá da barra de compasso',
    ],
    hint: 'Uma nota cromática de passagem é uma nota não diatónica que liga duas notas diatónicas a um tom de distância, dividindo esse tom em dois meios-tons.',
  },

  // ---- l9u32m3: Ditado Harmónico ----

  l9u32m3e1: {
    prompt:
      'Uma frase termina com V movendo para I, ambos em posição fundamental, com a melodia chegando à tónica. Que tipo de cadência é esta?',
    choices: [
      'Cadência autêntica perfeita (CAP)',
      'Meia cadência',
      'Cadência plagal',
      'Cadência deceptiva',
    ],
    hint: 'Uma cadência autêntica perfeita (CAP) requer V para I em posição fundamental com a tónica no soprano. Proporciona a sensação mais forte de finalidade.',
  },
  l9u32m3e2: {
    prompt:
      'Uma frase musical faz pausa no acorde de V sem resolver. Que tipo de cadência é esta?',
    choices: [
      'Meia cadência',
      'Cadência autêntica perfeita',
      'Cadência plagal',
      'Cadência deceptiva',
    ],
    hint: 'Uma meia cadência termina em V, criando uma sensação de suspensão ou incompletude -- como uma vírgula em vez de um ponto final.',
  },
  l9u32m3e3: {
    prompt:
      'Esperas que V resolva para I, mas em vez disso move-se para vi. Que tipo de cadência produz esta surpresa?',
    choices: [
      'Cadência deceptiva',
      'Meia cadência',
      'Cadência autêntica perfeita',
      'Cadência plagal',
    ],
    hint: 'Uma cadência deceptiva substitui vi pelo I esperado após V. O ouvido espera resolução mas recebe um desvio surpresa.',
  },

  // ---- l9u32m4: Leitura à Primeira Vista ----

  l9u32m4e1: {
    prompt:
      'No solfejo móvel, que sílaba é sempre atribuída à tónica da tonalidade atual?',
    choices: ['Do', 'La', 'Sol', 'Re'],
    hint: 'No solfejo móvel, "Do" representa sempre a tónica independentemente da tonalidade. Em C maior, Do = C. Em G maior, Do = G.',
  },
  l9u32m4e2: {
    prompt:
      'Na tonalidade de C maior, que nota corresponde à sílaba de solfejo "Mi"?',
    choices: ['E', 'D', 'F', 'G'],
    hint: 'Do-Re-Mi-Fa-Sol-La-Ti mapeia para os 7 graus da escala. Em C maior: C(Do), D(Re), E(Mi), F(Fa), G(Sol), A(La), B(Ti).',
  },
  l9u32m4e3: {
    prompt:
      'Qual é o passo de preparação mais importante antes de ler à primeira vista uma melodia?',
    choices: [
      'Estabelecer a tónica cantando a escala ou arpejo da tonalidade',
      'Memorizar a melodia inteira antes de começar',
      'Ler a letra primeiro',
      'Contar o número total de notas',
    ],
    hint: 'Estabelecer o centro tonal (tónica) no ouvido é essencial. Cantar uma escala ou arpejo de tónica rápidos ancora a tua perceção de altura antes de ler a melodia.',
  },

  // ---- l9u32m5: Audição Contextual ----

  l9u32m5e1: {
    prompt:
      'Uma linha vocal única sem acompanhamento nem harmonia é exemplo de que textura musical?',
    choices: [
      'Monofónica',
      'Homofónica',
      'Polifónica',
      'Heterofónica',
    ],
    hint: 'A textura monofónica consiste numa única linha melódica sem acompanhamento nem harmonia. Uma voz, uma linha.',
  },
  l9u32m5e2: {
    prompt:
      'Uma canção alterna entre uma secção recorrente e secções contrastantes (A-B-A-B). Que forma é esta?',
    choices: [
      'Forma estrofe-refrão',
      'Forma through-composed',
      'Forma rondó',
      'Forma sonata',
    ],
    hint: 'A forma estrofe-refrão alterna estrofes (letras diferentes, mesma melodia) com um refrão recorrente. É a estrutura mais comum na música popular.',
  },
  l9u32m5e3: {
    prompt:
      'Que característica musical é mais útil para identificar o período estilístico histórico de uma peça?',
    choices: [
      'A combinação de instrumentação, linguagem harmónica e estrutura formal',
      'A indicação de andamento sozinha',
      'A armação de clave sozinha',
      'O número de compassos na peça',
    ],
    hint: 'Os períodos estilísticos são identificados por uma combinação de fatores: instrumentação (cravo vs. piano), vocabulário harmónico (triádico vs. cromático) e convenções formais (binária vs. forma sonata).',
  },
};

export default overlay;
