import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 5 exercise templates
// 14 modules, 14 template groups
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 15: Dominantes Secundarias e Tonicizacao
  // =========================================================================

  // ---- l5u15m1: Dominantes Secundarias V/V ----
  l5u15m1: [
    {
      // chord_build
      promptTemplate:
        'Constroi V/V (a dominante secundaria de V) na tonalidade de {root} maior.',
      hintTemplate:
        'V/V e a dominante da dominante. Em {root} maior, encontra o acorde V e depois constroi uma setima dominante (ou triade maior) sobre o seu 5.o grau da escala.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica a funcao e resolucao de V/V.',
      hintTemplate:
        'V/V toniciza o acorde dominante. Contem uma alteracao cromatica (4.o grau elevado) e resolve para V.',
      choiceSets: [
        [
          'V/V contem o 4.o grau elevado e resolve para V',
          'V/V contem o 7.o grau rebaixado e resolve para IV',
          'V/V e o mesmo que o acorde IV',
          'V/V resolve para I',
        ],
        [
          'Em Do maior, V/V e Re maior (D-F#-A) a resolver para Sol maior',
          'Em Do maior, V/V e Fa maior a resolver para Sol',
          'Em Do maior, V/V e La maior a resolver para Re',
          'Em Do maior, V/V e Si maior a resolver para Do',
        ],
      ],
    },
  ],

  // ---- l5u15m2: Dominantes Secundarias de ii, iii, IV, vi ----
  l5u15m2: [
    {
      // chord_build
      promptTemplate:
        'Constroi o acorde de dominante secundaria que toniciza o alvo indicado em {root} maior.',
      hintTemplate:
        'Uma dominante secundaria e uma triade maior ou setima dominante que resolve para um acorde diatonico diferente de I. Constroi um acorde de qualidade dominante uma 5.aP acima do alvo.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica que acorde esta a ser tonicizado por esta dominante secundaria.',
      hintTemplate:
        'Cada dominante secundaria aponta para um acorde diatonico especifico. V7/ii resolve para ii, V7/IV resolve para IV, V7/vi resolve para vi, etc.',
      choiceSets: [
        [
          'V7/vi em Do maior e E7 (E-G#-B-D), a resolver para La menor',
          'V7/vi em Do maior resolve para Fa maior',
          'V7/vi em Do maior e D7',
          'V7/vi resolve para a dominante',
        ],
        [
          'V7/IV em Do maior e C7 (C-E-G-Bb), a resolver para Fa maior',
          'V7/IV em Do maior e F7',
          'V7/IV resolve para Sol maior',
          'V7/IV nao contem alteracoes cromaticas',
        ],
        [
          'V7/ii em Do maior e A7 (A-C#-E-G), a resolver para Re menor',
          'V7/ii resolve para Do maior',
          'V7/ii em Do maior e B7',
          'V7/ii e o mesmo que V/V',
        ],
      ],
    },
  ],

  // ---- l5u15m3: Acordes de Sensivel Secundaria ----
  l5u15m3: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica o acorde de sensivel secundaria e a sua resolucao.',
      hintTemplate:
        'Acordes de sensivel secundaria (viio/x) funcionam como dominantes secundarias mas sao diminutos. Resolvem meio-tom acima para o acorde alvo.',
      choiceSets: [
        [
          'viio7/V em Do maior e F#dim7, a resolver para Sol',
          'viio7/V em Do maior e Bdim7',
          'viio7/V resolve para baixo para Fa',
          'viio7/V e o mesmo que V/V',
        ],
        [
          'Acordes de sensivel secundaria tem a fundamental meio-tom abaixo do acorde alvo',
          'Tem a fundamental uma 5.a acima do alvo',
          'Tem a fundamental uma 4.a abaixo do alvo',
          'A posicao da fundamental e aleatoria',
        ],
        [
          'viio/x pode ser tanto uma triade diminuta como um acorde de setima totalmente diminuta',
          'viio/x e sempre um acorde maior',
          'viio/x e sempre um acorde de setima menor',
          'viio/x tem de ser um acorde meio-diminuto',
        ],
      ],
    },
  ],

  // ---- l5u15m4: Tonicizacao vs. Modulacao ----
  l5u15m4: [
    {
      // multiple_choice
      promptTemplate:
        'Distingue entre tonicizacao e modulacao.',
      hintTemplate:
        'Tonicizacao e uma enfase breve e momentanea num acorde nao-tonica (durando 1-2 acordes). Modulacao e uma mudanca mais permanente para uma nova tonalidade (confirmada por uma cadencia na nova tonalidade).',
      choiceSets: [
        [
          'Tonicizacao enfatiza temporariamente um acorde; modulacao estabelece uma nova tonalidade com uma cadencia',
          'Tonicizacao e modulacao significam a mesma coisa',
          'Tonicizacao requer uma cadencia na nova tonalidade',
          'Modulacao nunca usa acordes cromaticos',
        ],
        [
          'Uma unica dominante secundaria seguida do seu alvo e tonicizacao, nao modulacao',
          'Uma dominante secundaria cria sempre uma modulacao',
          'Tonicizacao requer pelo menos 8 compassos na nova tonalidade',
          'Nao ha diferenca pratica entre os dois',
        ],
        [
          'A modulacao e confirmada quando a musica cadencia na nova tonalidade',
          'A modulacao requer mudar a formula de compasso',
          'A modulacao so acontece no final de uma peca',
          'A modulacao nunca envolve notas cromaticas',
        ],
      ],
    },
  ],

  // ---- l5u15m5: Cadeias de Dominantes ----
  l5u15m5: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa esta cadeia de dominantes secundarias.',
      hintTemplate:
        'Uma cadeia de dominantes liga dominantes secundarias: p. ex., V7/vi -> V7/ii -> V7/V -> V7 -> I. Cada dominante resolve para a seguinte, criando movimento cromatico em direcao a tonica.',
      choiceSets: [
        [
          'Numa cadeia de dominantes, cada acorde funciona como V7 do acorde seguinte',
          'Uma cadeia de dominantes usa apenas acordes diatonicos',
          'Uma cadeia de dominantes move-se sempre em quintas ascendentes',
          'As cadeias de dominantes estao limitadas a 2 acordes',
        ],
        [
          'A cadeia V7/vi -> V7/ii -> V7/V -> V -> I move-se por quintas descendentes',
          'Esta cadeia move-se por tercas ascendentes',
          'Esta cadeia nao tem padrao',
          'Esta cadeia move-se por quintas ascendentes',
        ],
        [
          'A tonicizacao prolongada usando cadeias de dominantes cria movimento cromatico no baixo',
          'As cadeias de dominantes nunca produzem movimento cromatico',
          'O baixo mantem-se sempre diatonico nas cadeias de dominantes',
          'As cadeias de dominantes usam apenas acordes em posicao fundamental',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 16: Modulacao
  // =========================================================================

  // ---- l5u16m1: Modulacao por Acorde Pivot ----
  l5u16m1: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa esta modulacao por acorde pivot.',
      hintTemplate:
        'Um acorde pivot pertence tanto a tonalidade antiga como a nova. Reinterpreta um acorde diatonico: p. ex., IV em Do = I em Fa. O pivot e a dobradica entre duas regioes tonais.',
      choiceSets: [
        [
          'Um acorde pivot funciona diatonicamente tanto na tonalidade antiga como na nova',
          'Um acorde pivot tem de ser cromatico',
          'Um acorde pivot so existe em tonalidades menores',
          'Um acorde pivot e sempre V7',
        ],
        [
          'Ao modular de Do para Sol, o acorde de Do maior pode pivotar como IV em Sol',
          'Do maior nao pode funcionar como acorde pivot',
          'Os pivots so funcionam entre tonalidades relativas',
          'O pivot tem de ser um acorde diminuto',
        ],
        [
          'Tonalidades proximas (diferindo em 1 sustenido/bemol) partilham mais acordes pivot',
          'Tonalidades distantes tem mais acordes pivot',
          'Todas as tonalidades partilham o mesmo numero de acordes pivot',
          'Os acordes pivot so funcionam entre tonalidades paralelas',
        ],
      ],
    },
  ],

  // ---- l5u16m2: Modulacao para Tonalidades Proximas ----
  // (re-keyada de l5u16m4 para corresponder ao topico do curriculo)
  l5u16m2: [
    {
      // scale_build
      promptTemplate:
        'Constroi a escala menor natural de {root} (a relativa menor — uma tonalidade proxima).',
      hintTemplate:
        'Uma tonalidade e a sua relativa menor partilham a mesma armacao de clave (0 acidentes de diferenca), por isso a relativa menor e uma das tonalidades proximas. Constroi {root} menor natural: a escala menor natural a comecar em {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica as tonalidades proximas para esta tonica.',
      hintTemplate:
        'Cada tonalidade maior tem 5 tonalidades proximas: a dominante, a subdominante e as relativas menores das tres (tonica, dominante, subdominante).',
      choiceSets: [
        [
          'Do maior tem tonalidades proximas: Sol maior, Fa maior, La menor, Mi menor, Re menor',
          'Do maior e proximo de Reb maior e Si maior',
          'Do maior nao tem tonalidades proximas',
          'Do maior e proximo de Lab maior e Mib maior',
        ],
        [
          'Sol maior tem tonalidades proximas: Re maior, Do maior, Mi menor, Si menor, La menor',
          'Sol maior e proximo de Solb maior',
          'Sol maior so esta relacionado com Do maior',
          'Sol maior e proximo de Fa maior',
        ],
      ],
    },
  ],

  // ---- l5u16m3: Modulacao Direta, por Nota Comum e Cromatica ----
  // (fundidos os blocos Direta/De Frase, Nota Comum e Cromatica — o curriculo
  //  agrupa os tres neste modulo; antes divididos por m2/m3/m5)
  l5u16m3: [
    {
      // multiple_choice — modulacao direta/de frase
      promptTemplate:
        'Identifica as caracteristicas desta tecnica de modulacao.',
      hintTemplate:
        'A modulacao direta (de frase) muda de tonalidade abruptamente numa fronteira de frase sem acorde pivot. Comum na musica pop e nos hinos.',
      choiceSets: [
        [
          'Uma modulacao direta muda para uma nova tonalidade numa fronteira de frase sem acorde pivot',
          'Uma modulacao direta usa sempre um acorde pivot',
          'Uma modulacao direta e o mesmo que tonicizacao',
          'Uma modulacao direta so sobe meio-tom',
        ],
        [
          'A modulacao "do camionista" sobe meio-tom ou um tom para efeito dramatico',
          'A modulacao do camionista vai sempre para a dominante',
          'Esta tecnica e exclusiva da musica classica',
          'Esta modulacao e sempre descendente',
        ],
      ],
    },
    {
      // multiple_choice — modulacao por nota comum
      promptTemplate:
        'Como funciona a modulacao por nota comum?',
      hintTemplate:
        'A modulacao por nota comum sustém uma unica nota que e reinterpretada na nova tonalidade. Frequentemente usada para modulacoes distantes onde existem poucos acordes pivot.',
      choiceSets: [
        [
          'A modulacao por nota comum sustém uma nota que se torna um grau da escala diferente na nova tonalidade',
          'A modulacao por nota comum requer que todas as notas sejam comuns',
          'A modulacao por nota comum nunca envolve notas sustidas',
          'A modulacao por nota comum e o mesmo que modulacao por acorde pivot',
        ],
        [
          'A modulacao por nota comum e especialmente util para tonalidades distantes que partilham poucos acordes',
          'A modulacao por nota comum so funciona para tonalidades proximas',
          'Esta tecnica requer sequencias cromaticas',
          'Esta tecnica esta limitada a relativa maior/menor',
        ],
      ],
    },
    {
      // multiple_choice — modulacao cromatica
      promptTemplate:
        'Analisa esta tecnica de modulacao cromatica.',
      hintTemplate:
        'A modulacao cromatica usa uma alteracao cromatica para conduzir suavemente a nova tonalidade. Uma voz move-se por meio-tom de uma nota diatonica para uma nota cromatica na nova tonalidade.',
      choiceSets: [
        [
          'A modulacao cromatica apresenta uma voz a mover-se por meio-tom de uma nota diatonica para uma cromatica',
          'A modulacao cromatica evita todos os meios-tons',
          'A modulacao cromatica requer um acorde pivot',
          'A modulacao cromatica move-se sempre entre tonalidades paralelas',
        ],
        [
          'A alteracao cromatica tipicamente introduz a sensivel ou uma nota do acorde da nova tonalidade',
          'A nota cromatica e sempre a tonica da nova tonalidade',
          'A modulacao cromatica nunca envolve sensiveis',
          'A alteracao tem de estar na voz do baixo',
        ],
      ],
    },
  ],

  // ---- l5u16m4: Mistura Modal — Acordes de Emprestimo ----
  // (re-keyada de l5u17m1 para corresponder ao topico do curriculo)
  l5u16m4: [
    {
      // chord_build
      promptTemplate:
        'Constroi o acorde de emprestimo {root} (um acorde de mistura modal em Do maior).',
      hintTemplate:
        'A mistura modal empresta acordes do modo menor paralelo. Em Do maior, estes acordes de emprestimo sao bVI (Lab maior), bIII (Mib maior), bVII (Sib maior) e iv (Fa menor). Constroi {root} como escrito: as fundamentais rebaixadas formam triades maiores, o acorde iv e Fa menor.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica este acorde de emprestimo do modo menor paralelo.',
      hintTemplate:
        'Acordes de emprestimo comuns no modo maior: iv (subdominante menor), bVI (sexto grau bemol maior), bVII (setimo grau bemol maior), bIII. Acrescentam uma cor mais escura a uma tonalidade maior.',
      choiceSets: [
        [
          'O acorde bVI em Do maior e Lab maior (emprestado de Do menor)',
          'O acorde bVI em Do maior e Fa# maior',
          'O acorde bVI em Do maior e La maior',
          'bVI nao existe na mistura modal',
        ],
        [
          'O acorde iv em Do maior e Fa menor (emprestado de Do menor)',
          'O acorde iv em Do maior e Fa maior inalterado',
          'O acorde iv em Do maior e La menor',
          'A mistura modal nao pode alterar a subdominante',
        ],
      ],
    },
  ],

  // ---- l5u16m5: Terca Picardia e Mistura Modal em Menor ----
  // Sem template gerado (lacuna de cobertura reconhecida na auditoria WS5).

  // =========================================================================
  // Unidade 17: Forma, Textura e Conducao de Vozes
  // =========================================================================

  // ---- l5u17m1: Formas Binaria e Ternaria ----
  // (re-keyada de l5u17m2 para corresponder ao topico do curriculo)
  l5u17m1: [
    {
      // multiple_choice
      promptTemplate:
        'Classifica esta forma musical com base na sua estrutura.',
      hintTemplate:
        'Binaria: duas seccoes (AB). Ternaria: tres seccoes (ABA). Binaria com retorno: A modula, B desenvolve, A regressa (||:A:||:BA:||).',
      choiceSets: [
        [
          'Uma peca com duas seccoes contrastantes (AB) ambas repetidas e forma binaria simples',
          'A forma AB e ternaria',
          'A forma AB e composicao continua',
          'A forma AB e rondo',
        ],
        [
          'A forma ABA em que a primeira seccao regressa e forma ternaria',
          'A forma ABA e binaria',
          'A forma ABA e estrofica',
          'A forma ABA e composicao continua',
        ],
        [
          'A binaria com retorno apresenta o regresso do material de A no final da seccao B',
          'A binaria com retorno tem tres seccoes completamente independentes',
          'A binaria com retorno nunca modula',
          'A binaria com retorno e o mesmo que a binaria simples',
        ],
      ],
    },
  ],

  // ---- l5u17m2: Formas Cancao e Grandes Formas ----
  // (fundidos os blocos Rondo/Variacoes e Sonata — o curriculo agrupa rondo,
  //  tema com variacoes e sonata neste modulo; antes divididos por m3/m4)
  l5u17m2: [
    {
      // multiple_choice — rondo e variacoes
      promptTemplate:
        'Identifica as caracteristicas desta forma musical.',
      hintTemplate:
        'Rondo: refrao recorrente alternando com episodios (ABACA ou ABACABA). Tema com variacoes: um tema seguido de repeticoes variadas.',
      choiceSets: [
        [
          'ABACABA e uma forma rondo em sete partes',
          'ABACABA e forma ternaria',
          'ABACABA e forma binaria',
          'ABACABA e forma sonata',
        ],
        [
          'No tema com variacoes, cada variacao preserva a estrutura harmonica enquanto altera outros elementos',
          'As variacoes devem manter a melodia exata',
          'As variacoes mudam sempre de tonalidade',
          'As variacoes nunca alteram o ritmo',
        ],
        [
          'O refrao do rondo (A) permanece tipicamente na tonalidade da tonica',
          'O refrao modula para uma nova tonalidade de cada vez',
          'Os episodios devem permanecer na tonalidade da tonica',
          'O refrao e sempre diferente de cada vez',
        ],
      ],
    },
    {
      // multiple_choice — forma sonata
      promptTemplate:
        'Responde a esta questao sobre a estrutura da forma sonata.',
      hintTemplate:
        'Forma sonata: Exposicao (tema 1 na tonica, tema 2 na dominante), Desenvolvimento (fragmentacao, modulacao), Recapitulacao (ambos os temas na tonica).',
      choiceSets: [
        [
          'A exposicao apresenta dois grupos tematicos: o primeiro na tonica, o segundo numa tonalidade contrastante',
          'A exposicao tem apenas um tema',
          'Ambos os temas estao na tonalidade da tonica',
          'A exposicao e a seccao do meio',
        ],
        [
          'A seccao de desenvolvimento fragmenta e desenvolve os temas atraves de modulacao e sequencia',
          'O desenvolvimento simplesmente repete a exposicao',
          'O desenvolvimento introduz temas inteiramente novos',
          'O desenvolvimento permanece na tonalidade da tonica',
        ],
        [
          'Na recapitulacao, o segundo tema regressa na tonalidade da tonica em vez da dominante',
          'A recapitulacao repete a exposicao exatamente',
          'A recapitulacao esta na tonalidade da dominante',
          'O segundo tema e omitido na recapitulacao',
        ],
        [
          'Numa sonata em tonalidade maior, o segundo tema esta tipicamente na dominante (V)',
          'O segundo tema esta sempre na subdominante (IV)',
          'O segundo tema esta sempre na relativa menor',
          'O segundo tema permanece na tonica',
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
