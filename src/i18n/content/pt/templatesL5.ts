import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 5 exercise templates
// 14 modules, 14 template groups
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 15: Dominantes Secundárias e Tonicização
  // =========================================================================

  // ---- l5u15m1: Dominantes Secundárias V/V ----
  l5u15m1: [
    {
      // chord_build — {root} é a fundamental do acorde, não a tonalidade:
      // a resposta avaliada é uma tríade maior SOBRE {root}. Espelha o EN.
      promptTemplate:
        'Constrói uma tríade maior de {root}.',
      hintTemplate:
        'Uma tríade maior: fundamental + 3.a maior + 5.a perfeita. Esta qualidade de acorde é usada para dominantes secundárias como V/V.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica a função e resolução de V/V.',
      hintTemplate:
        'V/V toniciza o acorde dominante. Contém uma alteração cromática (4.o grau elevado) e resolve para V.',
      choiceSets: [
        [
          'V/V contém o 4.o grau elevado e resolve para V',
          'V/V contém o 7.o grau rebaixado e resolve para IV',
          'V/V é o mesmo que o acorde IV',
          'V/V resolve para I',
        ],
        [
          'Em Dó maior, V/V é Ré maior (D-F#-A) a resolver para Sol maior',
          'Em Dó maior, V/V é Fá maior a resolver para Sol',
          'Em Dó maior, V/V é Lá maior a resolver para Ré',
          'Em Dó maior, V/V é Si maior a resolver para Dó',
        ],
      ],
    },
  ],

  // ---- l5u15m2: Dominantes Secundárias de ii, iii, IV, vi ----
  l5u15m2: [
    {
      // chord_build
      promptTemplate:
        'Constrói um acorde de dominante de sétima em {root} (a qualidade de acorde usada em todas as dominantes secundárias).',
      hintTemplate:
        'Uma dominante secundária é uma sétima de dominante construída uma 5.aP acima do acorde que toniciza. Aqui constrói apenas {root}7: fundamental + 3.a maior + 5.aP + 7.a menor. Por exemplo, A7 (A-C#-E-G) é V7/ii em Dó maior, tonicizando Ré menor.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica que acorde está a ser tonicizado por esta dominante secundária.',
      hintTemplate:
        'Cada dominante secundária aponta para um acorde diatónico específico. V7/ii resolve para ii, V7/IV resolve para IV, V7/vi resolve para vi, etc.',
      choiceSets: [
        [
          'V7/vi em Dó maior é E7 (E-G#-B-D), a resolver para Lá menor',
          'V7/vi em Dó maior resolve para Fá maior',
          'V7/vi em Dó maior é D7',
          'V7/vi resolve para a dominante',
        ],
        [
          'V7/IV em Dó maior é C7 (C-E-G-Bb), a resolver para Fá maior',
          'V7/IV em Dó maior é F7',
          'V7/IV resolve para Sol maior',
          'V7/IV não contém alterações cromáticas',
        ],
        [
          'V7/ii em Dó maior é A7 (A-C#-E-G), a resolver para Ré menor',
          'V7/ii resolve para Dó maior',
          'V7/ii em Dó maior é B7',
          'V7/ii é o mesmo que V/V',
        ],
      ],
    },
  ],

  // ---- l5u15m3: Acordes de Sensível Secundária ----
  l5u15m3: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica o acorde de sensível secundária e a sua resolução.',
      hintTemplate:
        'Acordes de sensível secundária (viio/x) funcionam como dominantes secundárias mas são diminutos. Resolvem meio-tom acima para o acorde alvo.',
      choiceSets: [
        [
          'viio7/V em Dó maior é F#dim7, a resolver para Sol',
          'viio7/V em Dó maior é Bdim7',
          'viio7/V resolve para baixo para Fá',
          'viio7/V é o mesmo que V/V',
        ],
        [
          'Acordes de sensível secundária têm a fundamental meio-tom abaixo do acorde alvo',
          'Têm a fundamental uma 5.a acima do alvo',
          'Têm a fundamental uma 4.a abaixo do alvo',
          'A posição da fundamental é aleatória',
        ],
        [
          'viio/x pode ser tanto uma tríade diminuta como um acorde de sétima totalmente diminuta',
          'viio/x é sempre um acorde maior',
          'viio/x é sempre um acorde de sétima menor',
          'viio/x tem de ser um acorde meio-diminuto',
        ],
      ],
    },
  ],

  // ---- l5u15m4: Tonicização vs. Modulação ----
  l5u15m4: [
    {
      // multiple_choice
      promptTemplate:
        'Distingue entre tonicização e modulação.',
      hintTemplate:
        'Tonicização é uma ênfase breve e momentânea num acorde não-tónica (durando 1-2 acordes). Modulação é uma mudança mais permanente para uma nova tonalidade (confirmada por uma cadência na nova tonalidade).',
      choiceSets: [
        [
          'Tonicização enfatiza temporariamente um acorde; modulação estabelece uma nova tonalidade com uma cadência',
          'Tonicização e modulação significam a mesma coisa',
          'Tonicização requer uma cadência na nova tonalidade',
          'Modulação nunca usa acordes cromáticos',
        ],
        [
          'Uma única dominante secundária seguida do seu alvo é tonicização, não modulação',
          'Uma dominante secundária cria sempre uma modulação',
          'Tonicização requer pelo menos 8 compassos na nova tonalidade',
          'Não há diferença prática entre os dois',
        ],
        [
          'A modulação é confirmada quando a música cadencia na nova tonalidade',
          'A modulação requer mudar a fórmula de compasso',
          'A modulação só acontece no final de uma peça',
          'A modulação nunca envolve notas cromáticas',
        ],
      ],
    },
  ],

  // ---- l5u15m5: Cadeias de Dominantes ----
  l5u15m5: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa esta cadeia de dominantes secundárias.',
      hintTemplate:
        'Uma cadeia de dominantes liga dominantes secundárias: p. ex., V7/vi -> V7/ii -> V7/V -> V7 -> I. Cada dominante resolve para a seguinte, criando movimento cromático em direção à tónica.',
      choiceSets: [
        [
          'Numa cadeia de dominantes, cada acorde funciona como V7 do acorde seguinte',
          'Uma cadeia de dominantes usa apenas acordes diatónicos',
          'Uma cadeia de dominantes move-se sempre em quintas ascendentes',
          'As cadeias de dominantes estão limitadas a 2 acordes',
        ],
        [
          'A cadeia V7/vi -> V7/ii -> V7/V -> V -> I move-se por quintas descendentes',
          'Esta cadeia move-se por terças ascendentes',
          'Esta cadeia não tem padrão',
          'Esta cadeia move-se por quintas ascendentes',
        ],
        [
          'A tonicização prolongada usando cadeias de dominantes cria movimento cromático no baixo',
          'As cadeias de dominantes nunca produzem movimento cromático',
          'O baixo mantém-se sempre diatónico nas cadeias de dominantes',
          'As cadeias de dominantes usam apenas acordes em posição fundamental',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 16: Modulação
  // =========================================================================

  // ---- l5u16m1: Modulação por Acorde Pivot ----
  l5u16m1: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa esta modulação por acorde pivot.',
      hintTemplate:
        'Um acorde pivot pertence tanto à tonalidade antiga como à nova. Reinterpreta um acorde diatónico: p. ex., IV em Dó = I em Fá. O pivot é a dobradiça entre duas regiões tonais.',
      choiceSets: [
        [
          'Um acorde pivot funciona diatonicamente tanto na tonalidade antiga como na nova',
          'Um acorde pivot tem de ser cromático',
          'Um acorde pivot só existe em tonalidades menores',
          'Um acorde pivot é sempre V7',
        ],
        [
          'Ao modular de Dó para Sol, o acorde de Dó maior pode pivotar como IV em Sol',
          'Dó maior não pode funcionar como acorde pivot',
          'Os pivots só funcionam entre tonalidades relativas',
          'O pivot tem de ser um acorde diminuto',
        ],
        [
          'Tonalidades próximas (diferindo em 1 sustenido/bemol) partilham mais acordes pivot',
          'Tonalidades distantes têm mais acordes pivot',
          'Todas as tonalidades partilham o mesmo número de acordes pivot',
          'Os acordes pivot só funcionam entre tonalidades paralelas',
        ],
      ],
    },
  ],

  // ---- l5u16m2: Modulação para Tonalidades Próximas ----
  // (re-keyada de l5u16m4 para corresponder ao tópico do currículo)
  l5u16m2: [
    {
      // scale_build
      promptTemplate:
        'Constrói a escala menor natural de {root} (a relativa menor — uma tonalidade próxima).',
      hintTemplate:
        'Uma tonalidade e a sua relativa menor partilham a mesma armação de clave (0 acidentes de diferença), por isso a relativa menor é uma das tonalidades próximas. Constrói {root} menor natural: a escala menor natural a começar em {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica as tonalidades próximas para esta tónica.',
      hintTemplate:
        'Cada tonalidade maior tem 5 tonalidades próximas: a dominante, a subdominante e as relativas menores das três (tónica, dominante, subdominante).',
      choiceSets: [
        [
          'Dó maior tem tonalidades próximas: Sol maior, Fá maior, Lá menor, Mi menor, Ré menor',
          'Dó maior é próximo de Réb maior e Si maior',
          'Dó maior não tem tonalidades próximas',
          'Dó maior é próximo de Láb maior e Mib maior',
        ],
        [
          'Sol maior tem tonalidades próximas: Ré maior, Dó maior, Mi menor, Si menor, Lá menor',
          'Sol maior é próximo de Solb maior',
          'Sol maior só está relacionado com Dó maior',
          'Sol maior é próximo de Fá maior',
        ],
      ],
    },
  ],

  // ---- l5u16m3: Modulação Direta, por Nota Comum e Cromática ----
  // (fundidos os blocos Direta/De Frase, Nota Comum e Cromática — o currículo
  //  agrupa os três neste módulo; antes divididos por m2/m3/m5)
  l5u16m3: [
    {
      // multiple_choice — modulação direta/de frase
      promptTemplate:
        'Identifica as características desta técnica de modulação.',
      hintTemplate:
        'A modulação direta (de frase) muda de tonalidade abruptamente numa fronteira de frase sem acorde pivot. Comum na música pop e nos hinos.',
      choiceSets: [
        [
          'Uma modulação direta muda para uma nova tonalidade numa fronteira de frase sem acorde pivot',
          'Uma modulação direta usa sempre um acorde pivot',
          'Uma modulação direta é o mesmo que tonicização',
          'Uma modulação direta só sobe meio-tom',
        ],
        [
          'A modulação "do camionista" sobe meio-tom ou um tom para efeito dramático',
          'A modulação do camionista vai sempre para a dominante',
          'Esta técnica é exclusiva da música clássica',
          'Esta modulação é sempre descendente',
        ],
      ],
    },
    {
      // multiple_choice — modulação por nota comum
      promptTemplate:
        'Como funciona a modulação por nota comum?',
      hintTemplate:
        'A modulação por nota comum sustém uma única nota que é reinterpretada na nova tonalidade. Frequentemente usada para modulações distantes onde existem poucos acordes pivot.',
      choiceSets: [
        [
          'A modulação por nota comum sustém uma nota que se torna um grau da escala diferente na nova tonalidade',
          'A modulação por nota comum requer que todas as notas sejam comuns',
          'A modulação por nota comum nunca envolve notas sustidas',
          'A modulação por nota comum é o mesmo que modulação por acorde pivot',
        ],
        [
          'A modulação por nota comum é especialmente útil para tonalidades distantes que partilham poucos acordes',
          'A modulação por nota comum só funciona para tonalidades próximas',
          'Esta técnica requer sequências cromáticas',
          'Esta técnica está limitada à relativa maior/menor',
        ],
      ],
    },
    {
      // multiple_choice — modulação cromática
      promptTemplate:
        'Analisa esta técnica de modulação cromática.',
      hintTemplate:
        'A modulação cromática usa uma alteração cromática para conduzir suavemente à nova tonalidade. Uma voz move-se por meio-tom de uma nota diatónica para uma nota cromática na nova tonalidade.',
      choiceSets: [
        [
          'A modulação cromática apresenta uma voz a mover-se por meio-tom de uma nota diatónica para uma cromática',
          'A modulação cromática evita todos os meios-tons',
          'A modulação cromática requer um acorde pivot',
          'A modulação cromática move-se sempre entre tonalidades paralelas',
        ],
        [
          'A alteração cromática tipicamente introduz a sensível ou uma nota do acorde da nova tonalidade',
          'A nota cromática é sempre a tónica da nova tonalidade',
          'A modulação cromática nunca envolve sensíveis',
          'A alteração tem de estar na voz do baixo',
        ],
      ],
    },
  ],

  // ---- l5u16m4: Mistura Modal — Acordes de Empréstimo ----
  // (re-keyada de l5u17m1 para corresponder ao tópico do currículo)
  l5u16m4: [
    {
      // chord_build
      promptTemplate:
        'Constrói o acorde de empréstimo {root} (um acorde de mistura modal em Dó maior).',
      hintTemplate:
        'A mistura modal empresta acordes do modo menor paralelo. Em Dó maior, estes acordes de empréstimo são bVI (Láb maior), bIII (Mib maior), bVII (Sib maior) e iv (Fá menor). Constrói {root} como escrito: as fundamentais rebaixadas formam tríades maiores, o acorde iv é Fá menor.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica este acorde de empréstimo do modo menor paralelo.',
      hintTemplate:
        'Acordes de empréstimo comuns no modo maior: iv (subdominante menor), bVI (sexto grau bemol maior), bVII (sétimo grau bemol maior), bIII. Acrescentam uma cor mais escura a uma tonalidade maior.',
      choiceSets: [
        [
          'O acorde bVI em Dó maior é Láb maior (emprestado de Dó menor)',
          'O acorde bVI em Dó maior é Fá# maior',
          'O acorde bVI em Dó maior é Lá maior',
          'bVI não existe na mistura modal',
        ],
        [
          'O acorde iv em Dó maior é Fá menor (emprestado de Dó menor)',
          'O acorde iv em Dó maior é Fá maior inalterado',
          'O acorde iv em Dó maior é Lá menor',
          'A mistura modal não pode alterar a subdominante',
        ],
      ],
    },
  ],

  // ---- l5u16m5: Terça Picardia e Mistura Modal em Menor ----
  // Sem template gerado (lacuna de cobertura reconhecida na auditoria WS5).

  // =========================================================================
  // Unidade 17: Forma, Textura e Condução de Vozes
  // =========================================================================

  // ---- l5u17m1: Formas Binária e Ternária ----
  // (re-keyada de l5u17m2 para corresponder ao tópico do currículo)
  l5u17m1: [
    {
      // multiple_choice
      promptTemplate:
        'Classifica esta forma musical com base na sua estrutura.',
      hintTemplate:
        'Binária: duas secções (AB). Ternária: três secções (ABA). Binária com retorno: A modula, B desenvolve, A regressa (||:A:||:BA:||).',
      choiceSets: [
        [
          'Uma peça com duas secções contrastantes (AB) ambas repetidas é forma binária simples',
          'A forma AB é ternária',
          'A forma AB é composição contínua',
          'A forma AB é rondó',
        ],
        [
          'A forma ABA em que a primeira secção regressa é forma ternária',
          'A forma ABA é binária',
          'A forma ABA é estrófica',
          'A forma ABA é composição contínua',
        ],
        [
          'A binária com retorno apresenta o regresso do material de A no final da secção B',
          'A binária com retorno tem três secções completamente independentes',
          'A binária com retorno nunca modula',
          'A binária com retorno é o mesmo que a binária simples',
        ],
      ],
    },
  ],

  // ---- l5u17m2: Formas Canção e Grandes Formas ----
  // (fundidos os blocos Rondó/Variações e Sonata — o currículo agrupa rondó,
  //  tema com variações e sonata neste módulo; antes divididos por m3/m4)
  l5u17m2: [
    {
      // multiple_choice — rondó e variações
      promptTemplate:
        'Identifica as características desta forma musical.',
      hintTemplate:
        'Rondó: refrão recorrente alternando com episódios (ABACA ou ABACABA). Tema com variações: um tema seguido de repetições variadas.',
      choiceSets: [
        [
          'ABACABA é uma forma rondó em sete partes',
          'ABACABA é forma ternária',
          'ABACABA é forma binária',
          'ABACABA é forma sonata',
        ],
        [
          'No tema com variações, cada variação preserva a estrutura harmónica enquanto altera outros elementos',
          'As variações devem manter a melodia exata',
          'As variações mudam sempre de tonalidade',
          'As variações nunca alteram o ritmo',
        ],
        [
          'O refrão do rondó (A) permanece tipicamente na tonalidade da tónica',
          'O refrão modula para uma nova tonalidade de cada vez',
          'Os episódios devem permanecer na tonalidade da tónica',
          'O refrão é sempre diferente de cada vez',
        ],
      ],
    },
    {
      // multiple_choice — forma sonata
      promptTemplate:
        'Responde a esta questão sobre a estrutura da forma sonata.',
      hintTemplate:
        'Forma sonata: Exposição (tema 1 na tónica, tema 2 na dominante), Desenvolvimento (fragmentação, modulação), Recapitulação (ambos os temas na tónica).',
      choiceSets: [
        [
          'A exposição apresenta dois grupos temáticos: o primeiro na tónica, o segundo numa tonalidade contrastante',
          'A exposição tem apenas um tema',
          'Ambos os temas estão na tonalidade da tónica',
          'A exposição é a secção do meio',
        ],
        [
          'A secção de desenvolvimento fragmenta e desenvolve os temas através de modulação e sequência',
          'O desenvolvimento simplesmente repete a exposição',
          'O desenvolvimento introduz temas inteiramente novos',
          'O desenvolvimento permanece na tonalidade da tónica',
        ],
        [
          'Na recapitulação, o segundo tema regressa na tonalidade da tónica em vez da dominante',
          'A recapitulação repete a exposição exatamente',
          'A recapitulação está na tonalidade da dominante',
          'O segundo tema é omitido na recapitulação',
        ],
        [
          'Numa sonata em tonalidade maior, o segundo tema está tipicamente na dominante (V)',
          'O segundo tema está sempre na subdominante (IV)',
          'O segundo tema está sempre na relativa menor',
          'O segundo tema permanece na tónica',
        ],
      ],
    },
  ],

  // ---- l5u17m3: Textura ----
  // Sem template gerado (lacuna de cobertura reconhecida na auditoria WS5).

  // ---- l5u17m4: Linhas de Notas-Guia ----
  // Sem template gerado (lacuna de cobertura reconhecida na auditoria WS5).
};

export default overlay;
