import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 4 exercise templates
// 11 module configs (Unit 14 counterpoint pooled onto l4u14m1, mirroring
// the EN source). Entry order per module must match templatesL4.ts — see the
// W4-01 note there.
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 12: Notas Estranhas ao Acorde e Sétima da Dominante
  // =========================================================================

  // ---- l4u12m1: Suspensões ----
  l4u12m1: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre suspensões é verdadeira?',
      hintTemplate:
        'Suspensões: 4-3 resolve para uma 3.ª, 7-6 para uma 6.ª, 9-8 para uma oitava. A suspensão de baixo 2-3 resolve para baixo (o baixo desce por grau conjunto; o intervalo acima do baixo cresce de uma 2.ª para uma 3.ª). Cadeias de suspensões criam sequências.',
      choiceSets: [
        [
          'Numa suspensão 4-3, a 4.ª acima do baixo resolve descendo para a 3.ª',
          'Numa suspensão 4-3, a 3.ª acima do baixo sobe para a 4.ª',
          'Numa suspensão 4-3, a 4.ª acima do baixo resolve subindo para a 5.ª',
          'Numa suspensão 4-3, o baixo desce do 4.º para o 3.º grau',
        ],
        [
          'Numa suspensão 7-6, a 7.ª acima do baixo resolve descendo para a 6.ª',
          'Numa suspensão 7-6, a 7.ª acima do baixo resolve subindo para a oitava',
          'Numa suspensão 7-6, é o baixo que mantém a dissonância enquanto a voz superior se move',
          'Numa suspensão 7-6, a dissonância nunca chega a resolver',
        ],
        [
          'Numa suspensão 9-8, a 9.ª acima do baixo resolve descendo para a oitava',
          'Numa suspensão 9-8, a 9.ª acima do baixo resolve subindo por grau para a 10.ª',
          'Uma suspensão 9-8 é simplesmente uma suspensão 2-1 na voz do baixo',
          'Numa suspensão 9-8, a oitava acima do baixo sobe para a 9.ª',
        ],
        [
          'Numa suspensão de baixo 2-3, o baixo resolve descendo e a 2.ª passa a 3.ª',
          'Numa suspensão de baixo 2-3, a voz superior resolve descendo para uma 3.ª',
          'Numa suspensão de baixo 2-3, o baixo sobe por grau e a 2.ª passa a 3.ª',
          'Numa suspensão de baixo 2-3, o baixo salta e a dissonância fica por resolver',
        ],
        [
          'Uma suspensão é preparada como consonância e depois mantida numa dissonância',
          'Uma suspensão aparece sem preparação, no tempo forte',
          'Uma suspensão é preparada como dissonância e resolve subindo',
          'Uma suspensão é o mesmo que uma antecipação',
        ],
        [
          'Uma cadeia de suspensões 7-6 faz a voz superior descer por grau',
          'Uma cadeia de suspensões 7-6 faz a voz superior subir por grau',
          'As cadeias de suspensões não são permitidas no estilo da prática comum',
          'Uma cadeia de suspensões 7-6 mantém o baixo numa só nota',
        ],
        [
          'Uma suspensão ornamentada acrescenta uma nota entre a suspensão e a sua resolução',
          'Uma suspensão ornamentada salta a resolução por completo',
          'Uma suspensão ornamentada tem de usar sempre notas cromáticas',
          'Uma suspensão ornamentada resolve subindo por grau em vez de descer para a nota de baixo',
        ],
      ],
    },
  ],

  // ---- l4u12m2: Apogiatura, Escapatória e Retardo ----
  l4u12m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre apogiaturas, escapatórias e retardos é verdadeira?',
      hintTemplate:
        'Apogiatura: salto para a dissonância, grau conjunto para a resolução — geralmente acentuada (num tempo forte). Escapatória: grau conjunto para a dissonância, salto para fora — geralmente não acentuada (num tempo fraco). Retardo: mantido como uma suspensão, resolve subindo por grau (7-8).',
      choiceSets: [
        [
          'Uma apogiatura é abordada por salto e resolvida por grau, em geral num tempo forte',
          'Uma apogiatura é abordada por grau e deixada por salto, em geral num tempo fraco',
          'Uma apogiatura é mantida do acorde anterior e depois resolvida por grau',
          'Uma apogiatura é abordada e deixada por grau na mesma direção, sempre num tempo fraco',
        ],
        [
          'Uma escapatória é abordada por grau e deixada por salto na direção oposta',
          'Uma escapatória é abordada por salto e deixada por grau na direção oposta',
          'Uma escapatória é o mesmo que uma antecipação do acorde seguinte',
          'Uma escapatória tem de voltar à nota de onde saiu, tal como uma bordadura',
        ],
        [
          'Um retardo é mantido como uma suspensão, mas resolve subindo por grau',
          'Um retardo é mantido como uma suspensão e resolve sempre descendo por grau',
          'Um retardo é abordado por salto e não tem preparação',
          'Um retardo resolve por salto, nunca por grau',
        ],
        [
          'B mantido num acorde de C maior e a subir para C: um retardo 7-8',
          'B mantido num acorde de C maior e a subir para C: uma suspensão 4-3',
          'B mantido num acorde de C maior e a subir para C: uma escapatória',
          'B mantido num acorde de C maior e a subir para C: uma apogiatura abordada por salto',
        ],
        [
          'As apogiaturas acentuadas e sem preparação são uma marca da expressão romântica',
          'As apogiaturas são proibidas na música romântica',
          'As apogiaturas têm de ser sempre preparadas, exatamente como as suspensões',
          'As apogiaturas só ocorrem na voz do baixo, nunca na melodia que fica por cima dela',
        ],
      ],
    },
  ],

  // ---- l4u12m3: Pedal e Notas Cambiadas ----
  l4u12m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre pedais e notas cambiadas é verdadeira?',
      hintTemplate:
        'Os pedais são notas sustentadas ou repetidas (tipicamente tónica ou dominante no baixo) que criam dissonâncias com as harmonias em mudança acima. As notas cambiadas ornamentam uma nota por cima e por baixo antes de regressarem a ela.',
      choiceSets: [
        [
          'Um pedal de tónica sustenta a tónica enquanto as harmonias mudam por cima',
          'Um pedal de tónica sustenta a tónica, mas apenas na voz do soprano',
          'Um pedal de tónica tem de acabar ao fim de um compasso para a harmonia poder mudar',
          'Um pedal de tónica é um padrão melódico repetido, o mesmo que um ostinato no baixo',
        ],
        [
          'Um pedal de dominante mantém o 5.º grau e cria tensão antes do regresso da tónica',
          'Um pedal de dominante mantém a sensível, o 7.º grau',
          'Um pedal de dominante está sempre no soprano, com o baixo livre por baixo',
          'Um pedal de dominante mantém o 5.º grau e só pode aparecer mesmo no início de uma peça',
        ],
        [
          'Um pedal duplo sustenta a tónica e a dominante em simultâneo',
          'Um pedal duplo usa duas tonalidades diferentes',
          'Um pedal duplo tem de resolver sempre para uma única nota',
          'Um pedal duplo é um pedal repetido duas vezes seguidas',
        ],
        [
          'Um pedal invertido é mantido numa voz superior em vez do baixo',
          'Um pedal invertido desce grau a grau em vez de ser mantido',
          'Um pedal invertido muda de altura em cada compasso',
          'Os pedais invertidos nunca aparecem na música clássica',
        ],
        [
          'Um pedal começa e acaba em geral consonante, com dissonâncias pelo meio',
          'Um pedal é dissonante com todos os acordes, do princípio ao fim',
          'Um pedal nunca cria dissonância com as harmonias por cima',
          'Um pedal tem de durar exatamente quatro compassos e começar e acabar num tempo forte',
        ],
        [
          'As notas cambiadas ornamentam uma nota por cima e por baixo e regressam a ela',
          'As notas cambiadas são duas notas de passagem seguidas que preenchem uma 4.ª',
          'As notas cambiadas significam que duas vozes têm bordaduras ao mesmo tempo',
          'As notas cambiadas são o mesmo que um trilo, alternando depressa entre duas notas',
        ],
      ],
    },
  ],

  // ---- l4u12m4: Regras de Resolução do V7 ----
  l4u12m4: [
    {
      // chord_build — {root} é a fundamental do acorde, não a tonalidade:
      // a resposta avaliada é uma sétima da dominante SOBRE {root}. Espelha o EN.
      promptTemplate:
        'Constrói um acorde de sétima da dominante de {root}.',
      hintTemplate:
        'Um acorde de sétima da dominante: tríade maior + 7.ª menor. A 7.ª resolve para baixo, a sensível resolve para cima.',
    },
    {
      // multiple_choice
      promptTemplate: 'Como é que o acorde V7 resolve para I?',
      hintTemplate:
        'Na resolução V7 para I: a sensível resolve para cima até à tónica, a 7.ª resolve por grau conjunto descendente, a 5.ª de V pode ir para a fundamental de I, a fundamental de V pode ir para a fundamental de I.',
      choiceSets: [
        [
          'O seu trítono resolve em movimento contrário: a 3.ª sobe, a 7.ª desce',
          'O seu trítono resolve em movimento paralelo: as duas notas sobem por grau',
          'O seu trítono não resolve: as duas notas mantêm-se no acorde de I',
          'O seu trítono resolve para fora: a 3.ª desce e a 7.ª sobe para a fundamental de I',
        ],
        [
          'Em V7–I, o acorde de I omite muitas vezes a 5.ª para as vozes resolverem bem',
          'Em V7–I, o acorde de I tem de estar sempre completo, com as três notas',
          'V7–I produz sempre 5.as paralelas, que aqui são permitidas',
          'Em V7–I, a fundamental de V7 tem sempre de subir por grau para se tornar a 3.ª do acorde de I',
        ],
      ],
    },
  ],

  // ---- l4u12m5: Inversões de V7 ----
  l4u12m5: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as inversões de V7 é verdadeira?',
      hintTemplate:
        'Inversões de V7: estado fundamental (V7), 1.ª inv = V6/5 (3.ª/sensível no baixo), 2.ª inv = V4/3 (5.ª no baixo), 3.ª inv = V4/2 (7.ª no baixo).',
      choiceSets: [
        [
          'V6/5 tem a sensível no baixo, que sobe por grau para a tónica',
          'V6/5 tem a 5.ª do acorde no baixo, que desce por grau',
          'V6/5 tem a 7.ª do acorde no baixo, que desce para a 3.ª de I',
          'V6/5 tem a fundamental no baixo, que desce uma 5.ª para a tónica',
        ],
        [
          'V4/2 tem a 7.ª no baixo, por isso resolve para I6',
          'V4/2 tem a fundamental no baixo, por isso resolve para I',
          'V4/2 tem a 3.ª no baixo, por isso resolve para I6/4',
          'V4/2 tem a 5.ª no baixo, por isso resolve para o acorde de V',
        ],
        [
          'V4/3 tem a 5.ª no baixo e pode resolver para I ou I6',
          'V4/3 tem a sensível no baixo e só pode resolver para IV',
          'V4/3 tem a 7.ª no baixo e tem de resolver para I6/4',
          'V4/3 tem a fundamental no baixo e resolve para vi',
        ],
      ],
    },
    {
      // chord_build
      promptTemplate:
        'Constrói o acorde de sétima da dominante sobre {root}. Este acorde quer resolver para uma tonalidade uma 5.ª abaixo.',
      hintTemplate:
        'Uma sétima da dominante sobre {root}: {root} + 3.ª maior + 5.ª perfeita + 7.ª menor. Este acorde resolve uma 5.ª abaixo (ou uma 4.ª acima) para a sua tónica.',
    },
  ],

  // =========================================================================
  // Unidade 13: Acordes de Sétima Diatónicos e Função Harmónica
  // =========================================================================

  // ---- l4u13m1: Sétimas Pré-Dominantes ----
  l4u13m1: [
    {
      // chord_build — {root} é a fundamental do acorde, não a tonalidade:
      // a resposta avaliada é uma sétima menor SOBRE {root}. Espelha o EN.
      promptTemplate:
        'Constrói um acorde de sétima menor de {root}.',
      hintTemplate:
        'Um acorde de sétima menor: tríade menor + 7.ª menor. Construído sobre o 2.º grau (ii7), é o pré-dominante clássico, conduzindo a V ou V7.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Como funciona a função pré-dominante nas progressões harmónicas?',
      hintTemplate:
        'Os acordes pré-dominantes (ii, IV, ii7, IV7) preparam a dominante. Tipicamente movem-se T -> PD -> D -> T (tónica -> pré-dominante -> dominante -> tónica).',
      choiceSets: [
        [
          'A progressão padrão é T -> PD -> D -> T',
          'Os pré-dominantes vêm sempre depois da dominante',
          'Os pré-dominantes resolvem diretamente para a tónica',
          'Apenas acordes maiores podem funcionar como pré-dominantes',
        ],
        [
          'IV e ii (e IV7, ii7) são os principais acordes pré-dominantes',
          'V e vii° são os principais acordes pré-dominantes',
          'iii é o principal acorde pré-dominante, por estar um grau abaixo de IV',
          'vi é o único acorde que pode funcionar como pré-dominante',
        ],
      ],
    },
  ],

  // ---- l4u13m2: Sétimas da Mediante, da Submediante e da Tónica ----
  l4u13m2: [
    {
      // chord_build — {root} é o 6.º grau de {key} maior
      promptTemplate:
        'Constrói o acorde vi7 de {key} maior.',
      hintTemplate:
        'vi7 é o acorde de sétima menor sobre o 6.º grau de {key} maior: {root}, e depois uma 3.ª menor, uma 5.ª perfeita e uma 7.ª menor acima.',
    },
    {
      // chord_build — {root} é o 3.º grau de {key} maior
      promptTemplate:
        'Constrói o acorde iii7 de {key} maior.',
      hintTemplate:
        'iii7 é o acorde de sétima menor sobre o 3.º grau de {key} maior: {root}, e depois uma 3.ª menor, uma 5.ª perfeita e uma 7.ª menor acima.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre iii7, vi7 e as sétimas de tónica é verdadeira?',
      hintTemplate:
        'vi7 (e por vezes iii7) partilham notas com o I e podem substituí-lo. Imaj7 é a tónica do jazz e do pop; I7 é a tónica do blues. iii7–vi7–ii7–V7–I é uma cadeia de quintas descendentes.',
      choiceSets: [
        [
          'vi7 é o principal substituto do I com função de tónica',
          'vi7 é um acorde com função de dominante que resolve para I',
          'vi7 é um acorde pré-dominante que só aparece antes do V',
          'vi7 não tem uma função harmónica própria',
        ],
        [
          'V7–vi7 é uma resolução interrompida mais suave do que V7–vi',
          'V7–vi7 é uma cadência perfeita disfarçada',
          'V7–vi7 é impossível, porque vi7 não partilha notas com V7',
          'V7–vi7 é uma meia cadência, porque termina num acorde menor',
        ],
        [
          'No jazz e no pop, Imaj7 é a tónica habitual, um ponto de repouso',
          'No jazz e no pop, Imaj7 é um acorde tenso que tem de resolver para IV',
          'No jazz e no pop, Imaj7 é evitado no fim de um ii–V–I',
          'No jazz e no pop, a tónica é sempre uma tríade simples, nunca uma sétima',
        ],
        [
          'No blues, I7 (uma sétima da dominante) é a tónica estável',
          'No blues, I7 é evitado porque as sétimas da dominante têm de resolver',
          'No blues, só o V é uma sétima da dominante, como na harmonia clássica',
          'No blues, o acorde de tónica é uma sétima maior, Imaj7',
        ],
        [
          'iii7 abre muitas vezes um ciclo de quintas descendentes: iii7–vi7–ii7–V7–I',
          'iii7 é a dominante da tonalidade e por isso resolve normalmente direto para I',
          'iii7 é construído sobre o 6.º grau da escala maior',
          'iii7 é um acorde de sétima maior numa tonalidade maior',
        ],
      ],
    },
  ],

  // ---- l4u13m3: Sétimas da Sensível ----
  l4u13m3: [
    {
      // chord_build — {root} é a sensível de {key} maior
      promptTemplate:
        'Constrói viiø7, o acorde de sétima da sensível de {key} maior.',
      hintTemplate:
        'viiø7 assenta na sensível de {key} maior ({root}): uma sétima meio-diminuta — 3.ª menor, 5.ª diminuta e 7.ª menor acima de {root}.',
    },
    {
      // chord_build — {root} é o 7.º grau elevado de {key} menor harmónica
      promptTemplate:
        'Constrói vii°7, o acorde de sétima da sensível de {key} menor (menor harmónica).',
      hintTemplate:
        'vii°7 assenta no 7.º grau elevado de {key} menor harmónica ({root}): uma sétima diminuta — três 3.as menores sobrepostas acima de {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre os acordes de sétima da sensível é verdadeira?',
      hintTemplate:
        'viiø7 (tonalidades maiores) é meio-diminuto: em C maior, é G9 sem a fundamental. vii°7 (tonalidades menores) é diminuto, construído sobre o 7.º grau elevado; as suas quatro notas dividem a oitava em 3.as menores.',
      choiceSets: [
        [
          'viiø7 em C maior (B–D–F–A) é G9 sem a fundamental',
          'viiø7 em C maior (B–D–F–A) é G7 com uma 6.ª acrescentada',
          'viiø7 em C maior (B–D–F–A) é um acorde de sétima menor sobre B',
          'viiø7 em C maior (B–D–F–A) é a sétima de tónica, Imaj7',
        ],
        [
          'vii°7 em A menor é G#–B–D–F, sobre o 7.º grau elevado',
          'vii°7 em A menor é G–B–D–F, construído sobre o 7.º grau natural',
          'vii°7 em A menor é G#–B–D–F#, um acorde meio-diminuto',
          'vii°7 em A menor é B–D–F–A, construído sobre o 2.º grau',
        ],
        [
          'viiø7 tem uma 7.ª menor; vii°7 tem uma 7.ª diminuta',
          'viiø7 tem uma 7.ª diminuta; vii°7 tem uma 7.ª menor',
          'viiø7 e vii°7 são o mesmo acorde com dois nomes',
          'viiø7 tem uma 7.ª maior; vii°7 tem uma 5.ª perfeita e uma 7.ª menor',
        ],
        [
          'Bdim7, Ddim7, Fdim7 e G#dim7 contêm as mesmas quatro classes de altura',
          'Bdim7 e Ddim7 não partilham notas, porque as fundamentais estão a uma 3.ª',
          'Cada acorde de sétima diminuta tem o seu próprio conjunto de notas, único',
          'Um acorde de sétima diminuta só pode ser reescrito sobre uma das suas notas, a fundamental',
        ],
        [
          'Tal como V7, viiø7 resolve para I: a sensível sobe, a 7.ª desce',
          'Tal como IV, viiø7 é um acorde pré-dominante que resolve para V',
          'viiø7 resolve para vi, com a sensível a descer para o 6.º grau',
          'viiø7 não chega a resolver, porque é o acorde de sétima mais estável da tonalidade',
        ],
      ],
    },
  ],

  // ---- l4u13m4: Função Harmónica ----
  l4u13m4: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a função harmónica é verdadeira?',
      hintTemplate:
        'Função tónica: I, vi, iii. Pré-dominante: IV, ii. Dominante: V, vii°. Estas categorias descrevem como os acordes funcionam nas progressões, não apenas a sua qualidade.',
      choiceSets: [
        [
          'vi pode substituir o I como acorde com função de tónica',
          'vi é um acorde com função de dominante que resolve para I',
          'vi é um acorde pré-dominante que vai sempre para V',
          'vi não tem uma função harmónica definida',
        ],
        [
          'vii° funciona como dominante: partilha três notas com V7',
          'vii° funciona como tónica: partilha três notas com I',
          'vii° funciona como pré-dominante: vai sempre para IV',
          'vii° não tem função harmónica',
        ],
        [
          'iii pode substituir fracamente a tónica: partilha duas notas com I',
          'iii é sempre um acorde de dominante, simplesmente porque contém a sensível',
          'iii é o principal acorde pré-dominante da tonalidade',
          'iii nunca aparece na harmonia da prática comum',
        ],
        [
          'Na cadência interrompida V–vi, vi ocupa o lugar do I como tónica',
          'Em V–vi, vi funciona como dominante e puxa de volta para V',
          'V–vi não é uma verdadeira cadência',
          'Em V–vi, vi é um acorde pré-dominante a caminho de IV',
        ],
        [
          'D → PD (por exemplo V–IV) é uma retrogressão: inverte o fluxo habitual',
          'D → PD (por exemplo V–IV) é a ordem padrão das funções',
          'D → PD (por exemplo V–IV) é impossível em qualquer estilo de música',
          'D → PD (por exemplo V–IV) é a forma mais forte de terminar uma frase, mais forte do que V–I',
        ],
      ],
    },
  ],

  // ---- l4u13m5: Sequências Harmónicas ----
  l4u13m5: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre sequências harmónicas é verdadeira?',
      hintTemplate:
        'Uma sequência repete um padrão melódico/harmónico em níveis de altura sucessivamente mais altos ou mais baixos. Tipos comuns: quintas descendentes, 5-6 ascendente, terças descendentes.',
      choiceSets: [
        [
          'Uma sequência de quintas descendentes: I–IV–vii°–iii–vi–ii–V–I',
          'Uma sequência de quintas descendentes: I–V–ii–vi–iii–vii°–IV–I',
          'Uma sequência de quintas descendentes: I–ii–iii–IV–V–vi–vii°–I',
          'Uma sequência de quintas descendentes usa só acordes maiores, por isso tem de sair da tonalidade',
        ],
        [
          'Uma sequência 5-6 ascendente alterna acordes 5/3 e 6/3 sobre um baixo que sobe',
          'Uma sequência 5-6 ascendente usa só tríades no estado fundamental sobre um baixo que desce',
          'Uma sequência 5-6 ascendente faz o baixo descer por grau',
          'A sequência 5-6 não é um verdadeiro tipo de sequência',
        ],
        [
          'Uma sequência sobrepõe-se à ordem funcional normal: é o padrão repetido que a conduz',
          'Uma sequência tem de seguir a ordem T–PD–D–T em todos os acordes',
          'Uma sequência repete um acorde várias vezes à mesma altura',
          'Uma sequência é uma série de modulações',
        ],
        [
          'Uma sequência de terças descendentes: I–vi–IV–ii, com cada fundamental a descer uma 3.ª',
          'Uma sequência de terças descendentes: I–V–vi–IV, com cada fundamental a descer uma 3.ª',
          'Uma sequência de terças descendentes: I–ii–iii–IV, com cada fundamental a descer uma 3.ª',
          'Uma sequência de terças descendentes: I–iii–V–vii°, com cada fundamental a descer uma 3.ª',
        ],
        [
          'vi–ii–V–I é um fragmento da sequência de quintas descendentes',
          'vi–ii–V–I é um fragmento da sequência de segundas ascendentes',
          'vi–ii–V–I é uma sequência de terças descendentes',
          'vi–ii–V–I não faz parte de nenhuma sequência, porque termina na tónica',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 14: Contraponto, Métrica, Análise e Harmonia Menor
  // =========================================================================

  // ---- l4u14m1: Contraponto de Primeira e Segunda Espécie ----
  l4u14m1: [
    {
      // multiple_choice — primeira espécie
      promptTemplate:
        'Qual destas afirmações sobre o contraponto de primeira espécie é verdadeira?',
      hintTemplate:
        'Primeira espécie: nota contra nota. Usa consonâncias (3.as, 6.as, intervalos perfeitos). Começa e termina em consonâncias perfeitas. Evita 5.as/8.as paralelas. Prefere movimento contrário.',
      choiceSets: [
        [
          'Primeira espécie: uma nota do contraponto contra cada nota do cantus firmus',
          'Primeira espécie: duas notas do contraponto contra cada nota do cantus firmus',
          'Primeira espécie: quatro notas do contraponto contra cada nota do cantus firmus',
          'Primeira espécie: qualquer ritmo contra o cantus firmus',
        ],
        [
          'Na primeira espécie, todos os intervalos verticais têm de ser consonâncias',
          'Na primeira espécie, as dissonâncias são permitidas em qualquer tempo',
          'Na primeira espécie, só são permitidos intervalos perfeitos',
          'Na primeira espécie, só são permitidas 3.as e 6.as',
        ],
        [
          'Uma consonância perfeita aborda-se melhor por movimento contrário',
          'Uma consonância perfeita aborda-se melhor por movimento paralelo',
          'A forma de abordar uma consonância perfeita não faz diferença',
          'Uma consonância perfeita só pode ser abordada por movimento oblíquo, nunca por grau',
        ],
      ],
    },
    {
      // multiple_choice — segunda espécie
      promptTemplate:
        'Qual destas afirmações sobre o contraponto de segunda espécie é verdadeira?',
      hintTemplate:
        'Segunda espécie: duas notas contra uma. A primeira nota de cada compasso deve ser consonante. A segunda nota pode ser uma consonância ou uma nota de passagem (dissonância).',
      choiceSets: [
        [
          'Na segunda espécie, dissonâncias de passagem podem cair nos tempos fracos',
          'Na segunda espécie, todas as notas têm de ser consonantes, como na primeira',
          'Na segunda espécie, as dissonâncias podem cair nos tempos fortes',
          'Na segunda espécie, não há regras sobre a dissonância',
        ],
        [
          'A segunda espécie introduz a dissonância, como notas de passagem nos tempos fracos',
          'A segunda espécie introduz a suspensão, ligada sobre a barra de compasso',
          'A segunda espécie introduz a apogiatura, abordada por salto',
          'A segunda espécie não traz nada de novo: segue exatamente as mesmas regras da primeira',
        ],
      ],
    },
    {
      // interval_id
      promptTemplate:
        'Qual é o intervalo formado entre as duas vozes? Partindo de {root}.',
      hintTemplate:
        'No contraponto de espécies, consonâncias são 3.as, 6.as e intervalos perfeitos (P1, P5, P8). Dissonâncias (2.as, 7.as, trítono) requerem tratamento especial.',
    },
  ],
};

export default overlay;
