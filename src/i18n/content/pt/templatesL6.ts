import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 6 exercise templates
// 12 modules — mirrors templatesL6.ts entry by entry (W4a re-keying, 2026-10-31)
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 18: Acordes Cromáticos
  // =========================================================================

  // ---- l6u18m1: Acorde Napolitano bII ----
  l6u18m1: [
    {
      // chord_build — {key} is the minor key, {root} the Neapolitan (bII) itself.
      promptTemplate:
        'Constrói o acorde napolitano (bII) de {key} menor.',
      hintTemplate:
        'O napolitano é a tríade maior sobre o 2.º grau rebaixado: em {key} menor é {root} maior (fundamental, 3.ª maior, 5.ª perfeita).',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a função do acorde napolitano é verdadeira?',
      hintTemplate:
        'O napolitano (bII ou N6) é um acorde pré-dominante que resolve para V (frequentemente via 6/4 cadencial). Está quase sempre na primeira inversão.',
      choiceSets: [
        [
      'Normalmente, funciona como uma pré-dominante que prepara V',
      'Normalmente, funciona como uma dominante que resolve em I',
      'Normalmente, funciona como um substituto da tónica que fecha uma frase',
      'Normalmente, funciona como uma harmonia de passagem que liga inversões de I',
    ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Que opção indica o acorde napolitano (bII) correto da tonalidade menor que nomeia?',
      hintTemplate:
        'O napolitano é a tríade maior sobre o 2.º grau rebaixado da tonalidade menor: meio-tom acima da tónica, escrito na letra seguinte.',
      choiceSets: [
        [
          'Em C menor: Db maior (Db-F-Ab)',
          'Em C menor: D maior (D-F#-A)',
          'Em C menor: Eb maior (Eb-G-Bb)',
          'Em C menor: B maior (B-D#-F#)',
        ],
        [
          'Em A menor: Bb maior (Bb-D-F)',
          'Em A menor: B maior (B-D#-F#)',
          'Em A menor: Bb menor (Bb-Db-F)',
          'Em A menor: C maior (C-E-G)',
        ],
        [
          'Em E menor: F maior (F-A-C)',
          'Em E menor: F# maior (F#-A#-C#)',
          'Em E menor: D maior (D-F#-A)',
          'Em E menor: F menor (F-Ab-C)',
        ],
      ],
    },
  ],

  // ---- l6u18m2: Sexta Italiana/Francesa ----
  l6u18m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as sextas aumentadas italiana e francesa é verdadeira?',
      hintTemplate:
        'Sexta italiana: b6, 1, #4 (3 notas). Sexta francesa: b6, 1, 2, #4 (4 notas, inclui o 2.º grau). Ambas resolvem para V com as vozes extremas a expandirem-se para uma oitava.',
      choiceSets: [
        [
          'A sexta italiana tem três notas: b6, 1 e #4',
          "A sexta italiana tem três notas: 6, 1 e #4",
          "A sexta italiana tem três notas: b3, 1 e #4",
          "A sexta italiana tem três notas: b7, 1 e #4",
        ],
        [
          'A sexta francesa acrescenta o grau 2 à italiana',
          "A sexta francesa acrescenta o grau b3 à italiana",
          "A sexta francesa acrescenta o grau 5 à italiana",
          "A sexta francesa acrescenta o grau b7 à italiana",
        ],
        [
      'Em D menor, Bb3–G#4 resolve normalmente em A3–A4',
      'Em D menor, Bb3–G#4 resolve normalmente em D3–D4',
      'Em D menor, Bb3–G#4 resolve normalmente em A3–A3',
      'Em D menor, Bb3–G#4 resolve normalmente em D3–D3',
    ],
        [
          'Em C menor, Ab3–F#4 resolve normalmente em G3–G4',
          'Em C menor, Ab3–F#4 resolve normalmente em A3–E4',
          'Em C menor, Ab3–F#4 resolve normalmente em F3–A4',
          'Em C menor, Ab3–F#4 resolve normalmente em G3–F#4',
        ],
      ],
    },
  ],

  // ---- l6u18m3: Sexta Alemã ----
  l6u18m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o acorde de sexta aumentada alemã é verdadeira?',
      hintTemplate:
        'Sexta alemã: b6, 1, b3, #4 (4 notas, inclui a 3.ª menor). Resolve para um 6/4 cadencial para evitar quintas paralelas, depois para V.',
      choiceSets: [
        [
          'A sexta alemã contém b6, 1, b3 e #4',
          "A sexta alemã contém b6, 1, 3 e #4",
          "A sexta alemã contém b6, 1, b3 e 4",
          "A sexta alemã contém b6, 1, 3 e 4",
        ],
        [
          'Costuma passar primeiro por um 6/4 cadencial, evitando quintas paralelas com V',
          'Costuma seguir diretamente para V em posição fundamental, e é assim que evita quintas paralelas',
          'Costuma passar primeiro por um 6/4 cadencial, evitando oitavas paralelas com I',
          'Costuma resolver diretamente para a tónica I, saltando a dominante',
        ],
        [
          'É enarmonicamente equivalente a uma sétima da dominante',
          'É enarmonicamente equivalente a um acorde de sétima menor',
          'É enarmonicamente equivalente a um acorde de sétima diminuta',
          'É enarmonicamente equivalente a um acorde de sétima maior',
        ],
      ],
    },
    {
      // chord_build — {key} is the minor key; {root} is b6, the root of the
      // enharmonic dominant 7th (graded by pitch class).
      promptTemplate:
        'Constrói o acorde de sexta aumentada alemã de {key} menor.',
      hintTemplate:
        'Em {key} menor, a sexta alemã é b6–1–b3–#4, construída sobre {root}: {spelling}. Soa exatamente como {root}7, mas a nota superior escreve-se como 6.ª aumentada acima de {root}, não como 7.ª menor.',
    },
  ],

  // ---- l6u18m4: Modulação Enarmónica Gr+6 <-> V7 ----
  l6u18m4: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre modular através do pivot sexta alemã / V7 é verdadeira?',
      hintTemplate:
        'A sexta alemã é enarmonicamente idêntica a um acorde de sétima da dominante. Reescrevê-la permite uma modulação súbita para uma tonalidade remota: Gr+6 numa tonalidade = V7 noutra.',
      choiceSets: [
        [
      'A sexta alemã em E menor (C–E–G–A#), reescrita como C7 (C–E–G–Bb), resolve em F',
      'A sexta alemã em E menor (C–E–G–A#), reescrita como C7 (C–E–G–Bb), resolve em G',
      'A sexta alemã em E menor (C–E–G–A#), reescrita como C7 (C–E–G–Bb), resolve em Bb',
      'A sexta alemã em E menor (C–E–G–A#), reescrita como C7 (C–E–G–Bb), resolve em D',
    ],
        [
      "Atinge tonalidades meio-tom acima ou abaixo da tónica",
      "Atinge tonalidades um tom acima ou abaixo da tónica",
      "Atinge tonalidades uma quinta perfeita acima ou abaixo da tónica",
      "Atinge tonalidades uma terça maior acima ou abaixo da tónica",
    ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a história da modulação enarmónica pela sexta alemã é verdadeira?',
      hintTemplate:
        'De Mozart e Schubert em diante, os compositores usaram a dupla identidade da sexta alemã (e da sétima da dominante) para saltar para tonalidades remotas; tornou-se uma marca da harmonia romântica.',
      choiceSets: [
        [
      'Os compositores românticos usaram-na muito',
      'Os compositores renascentistas usaram-na muito',
      'Os compositores medievais usaram-na muito',
      'Os compositores do serialismo estrito do século XX usaram-na muito',
    ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 19: Técnicas Cromáticas Avançadas
  // =========================================================================

  // ---- l6u19m1: Modulação Enarmónica via dim7 ----
  l6u19m1: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a modulação enarmónica com o acorde de sétima diminuta é verdadeira?',
      hintTemplate:
        'Um acorde dim7 divide a oitava em terças menores iguais. Qualquer das suas 4 notas pode ser reescrita como fundamental, fazendo-o resolver para 4 tonalidades diferentes.',
      choiceSets: [
        [
      'A reescrita enarmónica preserva o som; qualquer das quatro notas pode ser a nova sensível',
      'A reescrita enarmónica preserva o som; a fundamental original tem de ser a nova sensível',
      'A reescrita enarmónica preserva o som; as duas notas mais graves são as candidatas a nova sensível',
      'A reescrita enarmónica preserva o som; uma nota escrita com sustenido tem de ser a nova sensível',
    ],
        [
      "Há apenas 3 acordes dim7 diferentes; em conjunto cobrem as 12 tonalidades",
      'Há apenas 4 acordes dim7 diferentes; em conjunto cobrem as 12 tonalidades',
      'Há apenas 6 acordes dim7 diferentes; em conjunto cobrem as 12 tonalidades',
      'Há apenas 12 acordes dim7 diferentes; em conjunto cobrem as 12 tonalidades',
    ],
        [
      "B°7 pode ser reescrito com sensíveis B→C, D→Eb, F→Gb e G#→A",
      "B°7 pode ser reescrito com sensíveis B→Eb, D→C, F→Gb e G#→A",
      "B°7 pode ser reescrito com sensíveis B→C, D→Eb, F→A e G#→Gb",
      "B°7 pode ser reescrito com sensíveis B→Eb, D→C, F→A e G#→Gb",
    ],
      ],
    },
  ],

  // ---- l6u19m2: Sétima Diminuta com Nota Comum ----
  l6u19m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o acorde de sétima diminuta com nota comum é verdadeira?',
      hintTemplate:
        'Um CT°7 partilha uma nota comum com o acorde que ornamenta. Ornamenta (em vez de funcionar harmonicamente em direção a) um acorde maior ou de sétima da dominante.',
      choiceSets: [
        [
      'A fundamental do acorde ornamentado é normalmente uma nota comum; o dim7 ornamenta-o em vez de o tonicizar',
      'A fundamental do acorde ornamentado é normalmente uma nota comum; o dim7 toniciza-o em vez de o ornamentar',
      'A fundamental do acorde ornamentado é normalmente a sua sensível; o dim7 ornamenta-o em vez de o tonicizar',
      'A fundamental do acorde ornamentado é normalmente a sua sensível; o dim7 toniciza-o em vez de o ornamentar',
    ],
        [
      'Uma voz fica na mesma nota e as outras três mudam por grau conjunto, para ornamentar o acorde',
      'Três vozes ficam nas mesmas notas e a outra muda por grau conjunto, para ornamentar o acorde',
      'Uma voz fica na mesma nota e as outras três saltam uma quinta, para ornamentar o acorde',
      'Três vozes ficam nas mesmas notas e a outra salta uma quinta, para ornamentar o acorde',
    ],
      ],
    },
  ],

  // ---- l6u19m3: Mediantes Cromáticas e Dominantes Alteradas (omnibus incluído) ----
  l6u19m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a progressão omnibus é verdadeira?',
      hintTemplate:
        'O omnibus é um padrão cromático de troca de vozes onde duas vozes se movem em movimento contrário cromático enquanto outras vozes sustentam notas comuns.',
      choiceSets: [
        [
          'Duas vozes movem-se cromaticamente em movimento contrário enquanto as outras se mantêm',
          "Duas vozes movem-se cromaticamente em movimento paralelo enquanto as outras se mantêm",
          "Duas vozes movem-se diatonicamente em movimento contrário enquanto as outras se mantêm",
          "Duas vozes movem-se diatonicamente em movimento paralelo enquanto as outras se mantêm",
        ],
        [
      'Uma troca no omnibus pode usar C–C#–D–Eb–E contra E–Eb–D–C#–C, com as outras vozes mantidas',
      'Uma troca no omnibus pode usar C–C#–D–Eb–E contra D–Db–C–B–Bb, com as outras vozes mantidas',
      'Uma troca no omnibus pode usar C–D–E contra E–D–C, com as outras vozes mantidas',
      'Uma troca no omnibus pode usar C–C#–D–Eb–E contra E–F–F#–G–G#, com as outras vozes mantidas',
    ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as mediantes cromáticas é verdadeira?',
      hintTemplate:
        'Mediantes cromáticas como C maior para E maior ou Ab maior têm fundamentais a uma 3.ª maior ou menor de distância e a mesma qualidade; uma nota do acorde fica fora da tonalidade, mesmo que ambas as fundamentais sejam diatónicas. Estes pares partilham uma nota comum. As mediantes duplamente cromáticas, como C maior para Eb menor, não partilham nenhuma.',
      choiceSets: [
        [
          'C maior → E maior é mediante cromática: fundamentais a uma 3.ª maior, uma nota comum (E)',
          'C maior → G maior é mediante cromática: fundamentais a uma 5.ª, uma nota comum (G)',
          'C maior → F maior é mediante cromática: fundamentais a uma 4.ª, uma nota comum (C)',
          'C maior → A menor é mediante cromática: fundamentais a uma 3.ª menor, duas notas comuns (C, E)',
        ],
        [
      "As mediantes cromáticas ligam fundamentais à distância de uma terça, com uma nota fora da escala",
      'As mediantes cromáticas ligam fundamentais à distância de uma terça usando só notas da escala',
      'As mediantes cromáticas alteram uma nota do acorde mantendo a mesma fundamental',
      'As mediantes cromáticas ligam fundamentais à distância de uma quinta, com uma nota fora da escala',
    ],
        [
          'Ab maior é mediante cromática de C maior: fundamentais a uma 3.ª maior, uma nota comum (C)',
          'Ab maior é mediante cromática de C maior: fundamentais a uma 3.ª menor, duas notas comuns (C, Eb)',
          'Ab maior é a dominante de C maior: fundamentais a uma 5.ª, duas notas comuns (C, G)',
          'Ab maior é a subdominante de C maior: fundamentais a uma 4.ª, uma nota comum (C)',
        ],
      ],
    },
    {
      // chord_build
      promptTemplate:
        'Constrói V+, a dominante alterada de {key} maior (V com a 5.ª aumentada).',
      hintTemplate:
        'O V+ é a tríade da dominante com a 5.ª elevada meio-tom: sobre {root} é fundamental, 3.ª maior, 5.ª aumentada. A 5.ª elevada sobe para a 3.ª de {key}.',
    },
  ],

  // ---- l6u19m4: Técnicas Harmónicas Tardo-Românticas ----
  l6u19m4: [
    {
      // scale_build
      promptTemplate:
        'Constrói a escala {scaleType} de {root}, que divide a oitava em seis tons iguais.',
      hintTemplate:
        'A escala de tons inteiros divide a oitava em 6 tons iguais: a partir de {root}, soma 2 meios-tons cinco vezes. Sem meios-tons não há sensível, por isso nenhuma nota soa como repouso.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as divisões iguais da oitava é verdadeira?',
      hintTemplate:
        'Divisões iguais: trítono (2 partes iguais, passos de 6 meios-tons), tríade aumentada (3 partes iguais, passos de 4), sétima diminuta (4 partes iguais, passos de 3), escala de tons inteiros (6 partes iguais, passos de 2).',
      choiceSets: [
        [
          'Uma tríade aumentada divide a oitava em 3 terças maiores iguais',
          'Uma tríade aumentada divide a oitava em 4 terças menores iguais',
          'Um acorde de sétima diminuta divide a oitava em 3 terças maiores iguais',
          'Uma tríade aumentada divide a oitava em 2 trítonos iguais',
        ],
        [
      "Há apenas 2 escalas de tons inteiros, cada uma com 6 das 12 notas",
      'Há apenas 6 escalas de tons inteiros, cada uma com 2 das 12 notas',
      'Há apenas 3 escalas de tons inteiros, cada uma com 4 das 12 notas',
      'Há apenas 4 escalas de tons inteiros, cada uma com 3 das 12 notas',
    ],
        [
      'Um acorde de sétima diminuta divide a oitava em 4 partes iguais de 3 meios-tons',
      'Um acorde de sétima diminuta divide a oitava em 3 partes iguais de 4 meios-tons',
      'Um acorde de sétima diminuta divide a oitava em 6 partes iguais de 2 meios-tons',
      'Um acorde de sétima diminuta divide a oitava em 2 partes iguais de 6 meios-tons',
    ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a harmonia não funcional do Romantismo tardio é verdadeira?',
      hintTemplate:
        'No Romantismo tardio, os acordes ligam-se muitas vezes por proximidade na condução de vozes, notas comuns ou cor, em vez da função tónica–dominante; o paralelismo move a forma de um acorde em paralelo.',
      choiceSets: [
        [
          'As ligações não funcionais entre acordes favorecem sobretudo a fluidez linear e alturas partilhadas',
          'As ligações não funcionais entre acordes favorecem sobretudo o movimento paralelo de trítono em todas as vozes',
          'As ligações não funcionais entre acordes favorecem sobretudo saltos melódicos largos e mudanças bruscas de registo',
          'As ligações não funcionais entre acordes favorecem sobretudo a eliminação de alturas comuns entre acordes sucessivos',
        ],
        [
          'O paralelismo estrito (cromático) move a forma de um acorde em paralelo, mantendo a sua qualidade exata',
          'O paralelismo estrito (cromático) move a forma de um acorde em paralelo, ajustando-a à tonalidade',
          'O paralelismo estrito (cromático) move todas as vozes em movimento contrário, sempre em direção à tónica',
          'O paralelismo estrito (cromático) mantém um acorde e muda apenas a nota do baixo',
        ],
        [
      'As alterações cromáticas frequentes e os destinos tonais distantes costumam enfraquecer a sensação de uma tonalidade estável',
      'As alterações cromáticas frequentes e os destinos tonais distantes costumam exigir um tempo mais rápido',
      'As alterações cromáticas frequentes e os destinos tonais distantes costumam tornar mais nítida a tonalidade estável',
      'As alterações cromáticas frequentes e os destinos tonais distantes costumam eliminar a organização rítmica',
    ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 20: Contraponto e Escrita a Partes
  // =========================================================================

  // ---- l6u20m1: Contraponto de Espécies — Primeira a Terceira Espécie ----
  l6u20m1: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o cantus firmus e a primeira espécie (1:1) é verdadeira?',
      hintTemplate:
        'Cantus firmus: 8–12 semibreves, da tónica à tónica, sobretudo por grau conjunto, um só ponto culminante. Primeira espécie: só consonâncias (1P, 3.as, 5P, 6.as, 8P); começa em 1P ou 8P, ou em 5P apenas quando o contraponto está acima do cantus; termina em 1P ou 8P alcançado por grau conjunto.',
      choiceSets: [
        [
          'Um cantus firmus começa e termina na tónica e move-se sobretudo por grau conjunto',
          'Um cantus firmus começa na dominante e move-se sobretudo por salto',
          'Um cantus firmus mistura livremente semibreves, mínimas e semínimas',
          'Um cantus firmus repete notas com frequência e tem vários pontos culminantes diferentes',
        ],
        [
          'A primeira espécie permite apenas estes intervalos acima do baixo: uníssonos, 3.as, 5.as perfeitas, 6.as e oitavas',
          'A primeira espécie permite apenas estes intervalos acima do baixo: uníssonos, 3.as, 4.as, 5.as perfeitas, 6.as e oitavas',
          'A primeira espécie permite apenas estes intervalos acima do baixo: uníssonos, 5.as perfeitas e oitavas',
          'A primeira espécie permite apenas estes intervalos acima do baixo: uníssonos, 2.as, 4.as, 6.as e oitavas',
        ],
        [
          "Começa com uma consonância perfeita e termina num uníssono ou oitava",
          "Começa com uma consonância imperfeita e termina num uníssono ou oitava",
          "Começa com uma consonância perfeita e termina numa consonância imperfeita",
          "Começa com uma consonância imperfeita e termina numa consonância imperfeita",
        ],
      ],
    },
    {
      // multiple_choice — Fux: só notas de passagem na segunda espécie (decisão D-14)
      promptTemplate:
        'Qual destas afirmações sobre o contraponto de segunda espécie (2:1) é verdadeira?',
      hintTemplate:
        'Segunda espécie: duas notas contra cada nota do cantus. O tempo forte é consonante; o tempo fraco pode ser consonante ou uma nota de passagem dissonante, alcançada e deixada por grau conjunto no mesmo sentido.',
      choiceSets: [
        [
          'Uma dissonância em tempo fraco tem de ser nota de passagem, entrando e saindo por grau conjunto',
          'Uma dissonância em tempo fraco pode ser nota de passagem ou ornato',
          'Uma dissonância em tempo forte é sempre permitida desde que depois resolva descendo por grau conjunto',
          'Uma dissonância em tempo fraco pode ser alcançada ou deixada por salto de 3.ª',
        ],
        [
          'Cada tempo forte tem de ser consonante com o cantus firmus',
          "Cada tempo forte tem de ser dissonante com o cantus firmus",
          "Cada tempo fraco tem de ser consonante com o cantus firmus",
          "Cada tempo fraco tem de ser dissonante com o cantus firmus",
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o contraponto de terceira espécie (4:1) é verdadeira?',
      hintTemplate:
        'Terceira espécie: quatro notas contra cada nota do cantus. A primeira é consonante; as outras podem ser notas de passagem, ornatos, uma cambiata (grau conjunto para a dissonância, salto de 3.ª, grau conjunto de volta) ou um ornato duplo.',
      nudgeTemplate: 'A terceira espécie põe quatro notas contra cada nota do cantus. Pergunta qual das quatro cai no tempo e, por isso, tem de ser consonante; em cada figura dissonante, segue o percurso nota a nota: por grau conjunto ou por salto, e regressa ao ponto de partida?',
      choiceSets: [
        [
      'A primeira nota de cada grupo de quatro é consonante; as restantes podem ser notas de passagem ou ornatos dissonantes',
      'A primeira nota de cada grupo de quatro é dissonante; as restantes podem ser notas de passagem ou ornatos dissonantes',
      'A primeira nota de cada grupo de quatro é consonante; as restantes podem ser dissonâncias alcançadas e deixadas por salto',
      'A primeira nota de cada grupo de quatro é dissonante; as restantes podem ser dissonâncias alcançadas e deixadas por salto',
    ],
        [
          'A cambiata vai por grau conjunto para uma dissonância, salta uma 3.ª e volta por grau conjunto',
          'A cambiata salta para uma dissonância e depois resolve-a descendo por grau conjunto',
          'A cambiata liga uma dissonância por cima da barra de compasso até ao tempo forte do compasso seguinte',
          'A cambiata vai por grau conjunto para uma dissonância e continua no mesmo sentido',
        ],
        [
          "Um ornato duplo é um ornato superior e outro inferior em sequência em torno de uma nota",
          "Um ornato duplo é um grau conjunto para a dissonância, um salto de terça na mesma direção e um grau conjunto de volta",
          "Um ornato duplo é uma nota de passagem no tempo fraco abordada e deixada por grau conjunto na mesma direção",
          "Um ornato duplo são duas notas de passagem consecutivas abordadas e deixadas por grau conjunto na mesma direção",
        ],
      ],
    },
  ],

  // ---- l6u20m2: Contraponto de Espécies — Quarta e Quinta Espécie ----
  l6u20m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o contraponto de quarta espécie (sincopado) é verdadeira?',
      hintTemplate:
        'A quarta espécie liga uma nota de um tempo fraco por cima da barra de compasso. Se a nota ligada for dissonante no tempo forte, é um retardo: preparado como consonância, resolvido descendo por grau conjunto. Acima do cantus: 7-6, 4-3, 9-8; abaixo: 2-3.',
      choiceSets: [
        [
      "Num retardo, a preparação no tempo fraco fica ligada à dissonância no tempo forte e resolve por grau conjunto da nota superior para a inferior",
      "Num retardo, a preparação no tempo forte fica ligada à dissonância no tempo fraco e resolve por grau conjunto da nota superior para a inferior",
      "Num retardo, a preparação no tempo fraco fica ligada à dissonância no tempo forte e resolve por grau conjunto da nota inferior para a superior",
      "Num retardo, a preparação no tempo forte fica ligada à dissonância no tempo fraco e resolve por grau conjunto da nota inferior para a superior",
    ],
        [
      "Um retardo é preparado como consonância e resolve descendo por grau conjunto",
      "Um retardo é preparado como dissonância e resolve subindo por grau conjunto",
      "Um retardo é preparado como consonância e resolve subindo por grau conjunto",
      "Um retardo é preparado como dissonância e resolve descendo por grau conjunto",
    ],
        [
      'Acima do cantus, os principais retardos dissonantes são 7-6, 4-3 e 9-8; abaixo, 2-3',
      'Acima do cantus, os principais retardos dissonantes são 2-3, 4-3 e 9-8; abaixo, 7-6',
      'Acima do cantus, os principais retardos dissonantes são 7-6, 2-3 e 9-8; abaixo, 4-3',
      'Acima do cantus, os principais retardos dissonantes são 7-6, 4-3 e 2-3; abaixo, 9-8',
    ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as cadeias de retardos e a quinta espécie (florida) é verdadeira?',
      hintTemplate:
        'Numa cadeia, cada resolução fica ligada e torna-se o retardo seguinte. A quinta espécie (contraponto florido) mistura numa só linha os valores das quatro primeiras espécies, cada um com as suas regras.',
      nudgeTemplate: 'Numa cadeia, segue cada nota que acabou de resolver: o que lhe acontece na barra de compasso seguinte? Na quinta espécie (contraponto florido), pergunta se ela deita fora o que as quatro espécies anteriores ensinaram ou se parte disso.',
      choiceSets: [
        [
      "Numa cadeia de retardos, cada resolução fica ligada ao acorde seguinte para preparar outro retardo",
      'Numa cadeia de retardos, cada retardo resolve subindo por grau para se tornar a preparação seguinte',
      "Numa cadeia de retardos, cada resolução salta para o acorde seguinte para preparar outro retardo",
      'Numa cadeia de retardos, cada resolução é substituída por uma pausa antes da preparação seguinte',
    ],
        [
          "A quinta espécie combina livremente os valores anteriores mantendo as suas regras de dissonância",
          "A quinta espécie combina livremente os valores anteriores abandonando as suas regras de dissonância",
          "A quinta espécie fixa os valores anteriores em cinco notas por nota do cantus mantendo as suas regras de dissonância",
          "A quinta espécie fixa os valores anteriores em cinco notas por nota do cantus abandonando as suas regras de dissonância",
        ],
        [
          'O contraponto florido mantém as regras de cada espécie anterior para os seus valores',
          "O contraponto florido aplica regras de retardos a notas de passagem e regras de passagem a retardos",
          "O contraponto florido abandona regras anteriores quando semibreves e síncopa coexistem na mesma linha",
          "O contraponto florido exige que cada valor de nota use uma regra nova sem relação com espécies anteriores",
        ],
      ],
    },
  ],

  // ---- l6u20m3: Contraponto a Três Partes e Contraponto Invertível ----
  l6u20m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o contraponto invertível (duplo) é verdadeira?',
      hintTemplate:
        'O contraponto invertível permite que duas vozes troquem de lugar. À oitava, um intervalo n torna-se 9 − n (3.ª → 6.ª, 5.ª → 4.ª); à décima, 11 − n (3.ª → oitava, 6.ª → 5.ª); à duodécima, 13 − n (5.ª → oitava).',
      choiceSets: [
        [
          'Trocar C4–E4 à oitava dá E4–C5',
          'Trocar C4–E4 à oitava dá E4–B4',
          'Trocar C4–E4 à oitava dá E4–A4',
          'Trocar C4–E4 à oitava dá E4–D5',
        ],
        [
          'À oitava, evitam-se as 5.as porque se tornam 4.as dissonantes',
          'À oitava, evitam-se as 3.as porque se tornam 6.as dissonantes',
          'À oitava, preferem-se as 5.as porque continuam 5.as perfeitas',
          'À oitava, evitam-se as 6.as porque se tornam 2.as dissonantes',
        ],
        [
      "À décima, uma 3.ª torna-se uma oitava e uma 6.ª torna-se uma 5.ª",
      "À décima, uma 3.ª torna-se uma 5.ª e uma 6.ª torna-se uma oitava",
      "À décima, uma oitava torna-se uma 6.ª e uma 5.ª torna-se uma 3.ª",
      "À décima, uma 3.ª mantém-se uma 3.ª e uma 6.ª mantém-se uma 6.ª",
    ],
        [
      "Ao trocar as partes à duodécima, a quinta passa a oitava",
      "Ao trocar as partes à duodécima, a quinta passa a terça",
      "Ao trocar as partes à duodécima, a quinta passa a décima",
      "Ao trocar as partes à duodécima, a quinta passa a duodécima",
    ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o contraponto triplo é verdadeira?',
      hintTemplate:
        'Contraponto triplo: três vozes que funcionam nas seis disposições verticais (ABC, ACB, BAC, BCA, CAB, CBA), por isso cada par de vozes tem de ser invertível.',
      nudgeTemplate: 'Conta de quantas maneiras se podem empilhar três vozes, de cima para baixo, e pergunta que pares de vozes acabam por trocar de lugar ao longo dessas disposições.',
      choiceSets: [
        [
      'Um teste completo verifica a validade contrapontística das seis permutações',
      'Um teste completo verifica a validade contrapontística das três rotações cíclicas',
      'Um teste completo verifica a validade contrapontística das duas ordens que preservam o baixo original',
      'Um teste completo verifica a validade contrapontística da ordem original e da sua inversa',
    ],
        [
      'Cada um dos três pares tem de manter contraponto válido após trocar as vozes',
      'Cada um dos três pares tem de manter os mesmos intervalos após trocar as vozes',
      'Cada um dos três pares tem de conter consonâncias perfeitas após trocar as vozes',
      'Cada um dos três pares tem de mover-se em sentido contrário após trocar as vozes',
    ],
      ],
    },
  ],

  // ---- l6u20m4: Escrita a Partes Avançada e Leitura de Partitura ----
  l6u20m4: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre harmonizar uma melodia de soprano a quatro vozes (SATB) é verdadeira?',
      hintTemplate:
        'Para harmonizar um soprano: encontra a tonalidade e os pontos de cadência, escolhe uma linha de baixo e acordes que conduzam até eles, preenche contralto e tenor pelo caminho mais curto e verifica paralelas, espaçamento e duplicações.',
      nudgeTemplate: 'Planeia como um compositor: decide para onde vão as frases antes de preencher os pormenores, e guarda o último passo para rever o resultado à luz das regras da escrita a quatro vozes.',
      choiceSets: [
        [
          "Localiza os pontos de cadência da melodia e depois escolhe um baixo e acordes que os apoiem",
          'Harmoniza desde a primeira nota e deixa que os acordes decidam onde termina cada frase',
          'Escreve primeiro as vozes interiores e depois ajusta o baixo a essas vozes',
          'Escolhe um acorde novo para cada nota da melodia e depois marca os finais de frase',
        ],
        [
          'Por fim, verifica o espaçamento, a duplicação e as quintas ou oitavas paralelas',
          'Por fim, acrescenta quintas paralelas entre as vozes extremas',
          'Por fim, duplica a sensível na cadência final',
          'Por fim, cruza contralto e tenor nas vozes interiores',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a realização do baixo cifrado é verdadeira?',
      hintTemplate:
        'Baixo cifrado: sem cifra = posição fundamental (5/3), 6 = primeira inversão, 6/4 = segunda inversão, 7 = sétima em posição fundamental, 6/5 = primeira inversão, 4/3 = segunda inversão, 4/2 = terceira inversão (7.ª no baixo).',
      choiceSets: [
        [
          'Uma nota do baixo sem cifra realiza-se como acorde em posição fundamental (5/3)',
          'Uma nota do baixo sem cifra realiza-se como um acorde na primeira inversão (6/3)',
          'Uma nota do baixo sem cifra toca-se sozinha, sem acorde por cima',
          'Uma nota do baixo sem cifra realiza-se como acorde de sétima (7)',
        ],
        [
          'Um 6 sob uma nota do baixo indica uma tríade na primeira inversão',
          'Um 6 sob uma nota do baixo indica uma tríade na segunda inversão',
          'Um 6 sob uma nota do baixo indica uma tríade em posição fundamental',
          'Um 6 sob uma nota do baixo indica um acorde de sétima na terceira inversão',
        ],
        [
          '6/4 sob uma nota do baixo indica uma tríade na segunda inversão',
          '6/4 sob uma nota do baixo indica uma tríade na primeira inversão',
          '6/4 sob uma nota do baixo indica um acorde de sétima em posição fundamental',
          '6/4 sob uma nota do baixo indica uma tríade em posição fundamental',
        ],
        [
          '4/2 sob uma nota do baixo indica um acorde de sétima com a 7.ª no baixo',
          '4/2 sob uma nota do baixo indica um acorde de sétima com a fundamental no baixo',
          '4/2 sob uma nota do baixo indica um acorde de sétima com a 3.ª no baixo',
          '4/2 sob uma nota do baixo indica um acorde de sétima com a 5.ª no baixo',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre os instrumentos transpositores numa partitura de orquestra é verdadeira?',
      hintTemplate:
        'Um instrumento transpositor faz soar a nota do seu nome quando lê C: o clarinete em Bb soa uma 2.ª maior abaixo do escrito, a trompa em F uma 5.ª perfeita abaixo. Transpõe cada parte para a altura de concerto para ouvir a harmonia real.',
      choiceSets: [
        [
          'O clarinete em Bb soa uma 2.ª maior abaixo do escrito: o C escrito soa Bb',
          'O clarinete em Bb soa uma 2.ª maior acima do que está escrito: o C escrito soa D',
          'O clarinete em Bb soa uma 3.ª menor abaixo do escrito: o C escrito soa A',
          'O clarinete em Bb soa exatamente como está escrito: o C escrito soa C',
        ],
        [
          'Na trompa em F, o C5 escrito soa como F4',
          'Na trompa em F, o C5 escrito soa como G5',
          'Na trompa em F, o C5 escrito soa como Bb4',
          'Na trompa em F, o C5 escrito soa como C5',
        ],
        [
          "Para ouvir a harmonia real, converte a altura escrita em altura de concerto usando o intervalo do instrumento",
          "Para ouvir a harmonia real, converte a altura de concerto em altura escrita usando o intervalo do instrumento",
          "Para ouvir a harmonia real, converte a altura escrita em altura de concerto usando os intervalos do baixo cifrado",
          "Para ouvir a harmonia real, converte a altura de concerto em altura escrita usando os intervalos do baixo cifrado",
        ],
      ],
    },
  ],
};

export default overlay;
