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
        'Qual destas afirmações sobre retardos é verdadeira?',
      hintTemplate:
        'Retardos: 4-3 resolve para uma 3.ª, 7-6 para uma 6.ª, 9-8 para uma oitava. O retardo de baixo 2-3 resolve para baixo (o baixo desce por grau conjunto; o intervalo acima do baixo cresce de uma 2.ª para uma 3.ª). Cadeias de retardos criam sequências. Um retardo é preparado como consonância e mantido como dissonância; a ornamentação pode inserir uma nota antes da resolução descendente por grau conjunto.',
      choiceSets: [
        [
          'Num retardo 4-3, a 4.ª acima do baixo resolve descendo para a 3.ª',
          'Num retardo 4-3, a 3.ª acima do baixo sobe para a 4.ª',
          'Num retardo 4-3, a 4.ª acima do baixo resolve subindo para a 5.ª',
          'Num retardo 4-3, o baixo desce do 4.º para o 3.º grau',
        ],
        [
      "Num retardo 7-6, a 7.ª resolve descendo para a 6.ª",
      'Num retardo 7-6, a 6.ª resolve subindo para a 7.ª',
      'Num retardo 7-6, a 7.ª resolve subindo para a oitava',
      'Num retardo 7-6, a 6.ª resolve descendo para a 5.ª',
    ],
        [
      "Num retardo 9-8, a 9.ª acima do baixo resolve descendo para a oitava",
      'Num retardo 9-8, a oitava acima do baixo resolve subindo para a 9.ª',
      'Num retardo 9-8, a 9.ª acima do baixo resolve subindo para a 10.ª',
      'Num retardo 9-8, a oitava acima do baixo resolve descendo para a 7.ª',
    ],
        [
          'Num retardo de baixo 2-3, o baixo resolve descendo e a 2.ª passa a 3.ª',
          'Num retardo de baixo 2-3, a voz superior resolve descendo para uma 3.ª',
          'Num retardo de baixo 2-3, o baixo sobe por grau e a 2.ª passa a 3.ª',
          'Num retardo de baixo 2-3, o baixo salta e a dissonância fica por resolver',
        ],
        [
          'Um retardo é preparado como consonância e depois mantido numa dissonância',
          'Um retardo aparece sem preparação, no tempo forte',
          'Um retardo é preparado como dissonância e resolve subindo',
          'Um retardo é o mesmo que uma antecipação',
        ],
        [
          'Uma cadeia de retardos 7-6 faz a voz superior descer por grau',
          'Uma cadeia de retardos 7-6 faz a voz superior subir por grau',
          'Uma cadeia de retardos 7-6 é proibida no estilo da prática comum',
          'Uma cadeia de retardos 7-6 mantém o baixo numa só nota',
        ],
        [
      'Num retardo ornamentado, uma nota adicional adia a descida por grau até à nota de resolução',
      'Num retardo ornamentado, uma nota adicional substitui a resolução descendente por grau conjunto por um salto',
      'Num retardo ornamentado, uma nota adicional transforma a resolução numa subida por grau conjunto',
      'Num retardo ornamentado, uma nota adicional elimina a necessidade de resolver a dissonância',
    ],
      ],
    },
  ],

  // ---- l4u12m2: Apogiatura, Escapatória e Retardo ----
  l4u12m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre apogiaturas, escapadas e retardos ascendentes é verdadeira?',
      hintTemplate:
        'Apogiatura: salto para a dissonância, grau conjunto para a resolução — geralmente acentuada (num tempo forte). Escapada: grau conjunto para a dissonância, salto para fora — geralmente não acentuada (num tempo fraco). Retardo ascendente: mantido como um retardo, resolve subindo por grau (7-8).',
      choiceSets: [
        [
          'Uma apogiatura é abordada por salto e resolvida por grau, em geral num tempo forte',
          'Uma apogiatura é abordada por grau e deixada por salto, em geral num tempo fraco',
          'Uma apogiatura é mantida do acorde anterior e depois resolvida por grau',
          'Uma apogiatura é abordada e deixada por grau na mesma direção, sempre num tempo fraco',
        ],
        [
          'Uma escapada é abordada por grau e deixada por salto na direção oposta',
          'Uma escapada é abordada por salto e deixada por grau na direção oposta',
          'Uma escapada é o mesmo que uma antecipação do acorde seguinte',
          'Uma escapada tem de voltar à nota de onde saiu, tal como uma bordadura',
        ],
        [
      'Um retardo ascendente é preparado e mantido como dissonância, depois resolve subindo por grau',
      'Um retardo ascendente é preparado e mantido como dissonância, depois resolve subindo por salto',
      'Um retardo ascendente é atingido por salto sem preparação, depois resolve subindo por grau',
      'Um retardo ascendente é atingido por salto sem preparação, depois resolve subindo por salto',
    ],
        [
          'B mantido num acorde de C maior e a subir para C: um retardo ascendente 7-8',
          'B mantido num acorde de C maior e a subir para C: um retardo 4-3',
          'B mantido num acorde de C maior e a subir para C: uma escapada',
          'B mantido num acorde de C maior e a subir para C: uma apogiatura abordada por salto',
        ],
        [
      'Uma apogiatura é tipicamente uma dissonância acentuada, alcançada por salto e deixada por grau conjunto',
      'Uma apogiatura é tipicamente uma dissonância não acentuada, alcançada por salto e deixada por grau conjunto',
      'Uma apogiatura é tipicamente uma dissonância acentuada, alcançada por grau conjunto e deixada por salto',
      'Uma apogiatura é tipicamente uma dissonância não acentuada, alcançada por grau conjunto e deixada por salto',
    ],
      ],
    },
  ],

  // ---- l4u12m3: Pedal e Notas Cambiadas ----
  l4u12m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre pedais e cambiatas é verdadeira?',
      hintTemplate:
        'Os pedais são notas sustentadas ou repetidas (tipicamente tónica ou dominante no baixo) que criam dissonâncias com as harmonias em mudança acima. As cambiatas ornamentam uma nota por cima e por baixo antes de regressarem a ela. Um pedal invertido fica na voz mais aguda (soprano); um pedal duplo mantém duas alturas, frequentemente a tónica e a dominante.',
      choiceSets: [
        [
          'Um pedal de tónica mantém o grau 1 enquanto os acordes mudam',
          'Um pedal de tónica mantém o grau 1 apenas no soprano enquanto os acordes mudam',
          'Um pedal de tónica segue cada fundamental enquanto os acordes mudam',
          'Um pedal de tónica arpeja cada novo acorde enquanto os acordes mudam',
        ],
        [
          'Um pedal de dominante mantém o 5.º grau e cria tensão antes do regresso da tónica',
          'Um pedal de dominante mantém a sensível, o 7.º grau',
          'Um pedal de dominante está sempre no soprano, com o baixo livre por baixo',
          'Um pedal de dominante mantém o 5.º grau e só pode aparecer mesmo no início de uma peça',
        ],
        [
      "Um pedal duplo mantém duas alturas em simultâneo, habitualmente a tónica e a dominante",
      'Um pedal duplo costuma repetir uma altura duas vezes, habitualmente a tónica ou a dominante',
      'Um pedal duplo pode colocar um pedal de tónica antes de um pedal de dominante, sem sobreposição',
      'Um pedal duplo costuma mover ambas as alturas com cada novo acorde de tónica ou dominante em vez de as manter',
    ],
        [
      'Um pedal invertido sustenta uma nota na voz superior',
      'Um pedal invertido sustenta uma nota no baixo sob acordes invertidos',
      'Um pedal invertido sustenta uma nota na voz do baixo',
      'Um pedal invertido sustenta todas as notas do acorde atual',
    ],
        [
          'Um pedal costuma começar e terminar consonante, com dissonâncias pelo meio',
          'Um pedal costuma começar e terminar dissonante, com consonâncias pelo meio',
          'Um pedal costuma mudar de altura para seguir as fundamentais dos acordes',
          'Um pedal costuma mover-se por grau conjunto entre as notas de um acorde',
        ],
        [
      'Cambiatas: a melodia visita as duas alturas adjacentes e regressa à nota inicial do acorde',
      'Cambiatas: a melodia visita duas notas intermédias e continua até outra nota do acorde',
      'Cambiatas: a melodia visita uma nota adjacente e regressa à nota inicial do acorde',
      'Cambiatas: a melodia repete a nota inicial do acorde enquanto os acordes em redor mudam',
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
          'O seu trítono resolve em movimento paralelo: a 3.ª sobe, a 7.ª sobe',
          'O seu trítono resolve em movimento paralelo: a 3.ª desce, a 7.ª desce',
          'O seu trítono resolve em movimento contrário: a 3.ª desce, a 7.ª sobe',
        ],
        [
          'Em V7–I, o acorde I costuma omitir a 5.ª para as vozes resolverem bem',
          "Em V7–I, o acorde I costuma omitir a 3.ª para a sensível descer à 5.ª",
          "Em V7–I, quintas paralelas entre vozes extremas podem substituir a resolução contrária do trítono na escrita estrita",
          "Em V7–I, a fundamental de V7 normalmente sobe por grau conjunto para se tornar a 3.ª de I",
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
      nudgeTemplate: 'Os números são intervalos acima do baixo. Em C maior, põe a 3.ª, a 5.ª e a 7.ª de G7 no baixo, uma de cada vez: que números dá cada uma, e que nota do acorde de tónica pode esse baixo alcançar por grau conjunto?',
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
      'Com a quinta no baixo, V4/3 pode resolver numa tríade de tónica no estado fundamental ou na primeira inversão',
      'Com a terça no baixo, V4/3 pode resolver numa tríade de tónica no estado fundamental ou na primeira inversão',
      'Com a sétima no baixo, V4/3 pode resolver numa tríade de tónica no estado fundamental ou na primeira inversão',
      'Com a fundamental no baixo, V4/3 pode resolver numa tríade de tónica no estado fundamental ou na primeira inversão',
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
        'Os acordes pré-dominantes (ii, IV, ii7, IV7) preparam a dominante. Tipicamente movem-se T → PD → D → T (tónica → pré-dominante → dominante → tónica).',
      choiceSets: [
        [
      'A progressão padrão é T → PD → D → T',
      'A progressão padrão é T → PD → D → PD',
      'A progressão padrão é PD → D → PD → T',
      'A progressão padrão é T → D → T → PD',
    ],
        [
          'IV e ii (e IV7, ii7) são os principais acordes pré-dominantes',
          'V e vii° (e V7, vii°7) são os principais acordes pré-dominantes',
          'I e vi (e Imaj7, vi7) são os principais acordes pré-dominantes',
          'iii e vi (e iii7, vi7) são os principais acordes pré-dominantes',
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
        'vi7 (e por vezes iii7) partilham notas com o I e podem substituí-lo. Imaj7 é a tónica do jazz e do pop; I7 é a tónica do blues. iii7–vi7–ii7–V7–I é uma cadeia de quintas descendentes. Em V7–vi7 (G7–Am7 em C), a fundamental G pode manter-se e torna-se a 7.ª de vi7: uma resolução interrompida.',
      choiceSets: [
        [
          'vi7 é o principal substituto do I com função de tónica',
          'vi7 é um acorde com função de dominante que resolve para I',
          'vi7 é um acorde pré-dominante que só aparece antes do V',
          'vi7 não tem uma função harmónica própria',
        ],
        [
          'V7–vi7 é uma resolução interrompida em que a fundamental de V7 se mantém como 7.ª de vi7',
          'V7–vi7 é uma resolução autêntica em que a fundamental de V7 se mantém como fundamental de vi7',
          'V7–vi7 é uma resolução interrompida em que a fundamental de V7 se mantém como fundamental de vi7',
          'V7–vi7 é uma resolução autêntica em que a fundamental de V7 se mantém como 7.ª de vi7',
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
        'viiø7 (tonalidades maiores) é meio-diminuto: em C maior, é G9 sem a fundamental. vii°7 (tonalidades menores) é diminuto, construído sobre o 7.º grau elevado; as suas quatro notas dividem a oitava em 3.as menores. Ambos resolvem como V7: a sensível sobe para a tónica e a 7.ª do acorde desce por grau conjunto.',
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
      "viiø7 tem uma 7.ª menor; vii°7 tem uma 7.ª diminuta",
      "viiø7 tem uma 7.ª diminuta; vii°7 tem uma 7.ª menor",
      'viiø7 tem uma 7.ª menor; vii°7 tem uma 7.ª menor',
      'viiø7 tem uma 7.ª diminuta; vii°7 tem uma 7.ª diminuta',
    ],
        [
      'Coleções distintas de alturas entre Bdim7, Ddim7, Fdim7 e G#dim7: 1',
      'Coleções distintas de alturas entre Bdim7, Ddim7, Fdim7 e G#dim7: 4',
      'Coleções distintas de alturas entre Bdim7, Ddim7, Fdim7 e G#dim7: 2',
      'Coleções distintas de alturas entre Bdim7, Ddim7, Fdim7 e G#dim7: 3',
    ],
        [
      'A sensível sobe para a tónica enquanto a sétima do acorde desce, tal como num acorde de sétima da dominante',
      'A sensível desce afastando-se da tónica enquanto a sétima do acorde desce, tal como num acorde de sétima da dominante',
      'A sensível sobe para a tónica enquanto a sétima do acorde sobe, tal como num acorde de sétima da dominante',
      'A sensível desce afastando-se da tónica enquanto a sétima do acorde sobe, tal como num acorde de sétima da dominante',
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
          'vi pode substituir I porque partilham duas notas do acorde de tónica',
          "vi pode substituir V7 porque contém a mesma sensível",
          "vi pode substituir I porque não partilha nenhuma nota do acorde de tónica",
          "vi pode substituir IV porque contém exatamente as mesmas três notas do acorde",
        ],
        [
          'vii° funciona como dominante: as suas três notas estão todas em V7',
          'vii° funciona como dominante: as suas três notas estão todas em IV',
          'vii° funciona como tónica: as suas três notas estão todas em V7',
          'vii° funciona como tónica: as suas três notas estão todas em IV',
        ],
        [
          'iii pode substituir I de forma fraca porque partilha duas notas do acorde',
          'iii pode substituir I de forma fraca porque a sua fundamental é a tónica',
          'iii pode substituir IV porque partilha as três notas do acorde',
          'iii pode substituir V7 porque partilha as quatro notas do acorde',
        ],
        [
          'Na cadência interrompida V–vi, vi ocupa o lugar do I como tónica',
          'Em V–vi, vi funciona como dominante e puxa de volta para V',
          'V–vi não é uma verdadeira cadência',
          'Em V–vi, vi é um acorde pré-dominante a caminho de IV',
        ],
        [
          'D → PD (por exemplo V–IV) é uma retrogressão: inverte o fluxo habitual',
          'D → PD (por exemplo V–IV) é uma cadência plagal: é a forma habitual de concluir uma frase',
          'D → PD (por exemplo V–IV) é uma cadência interrompida: IV funciona como o substituto habitual da tónica',
          'D → PD (por exemplo V–IV) é proibida na harmonia da prática comum',
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
      "Uma sequência de quintas descendentes: I–IV–vii°–iii–vi–ii–V–I",
      "Uma sequência de quintas descendentes: I–V–ii–vi–iii–vii°–IV–I",
      "Uma sequência de quintas descendentes: I–ii–iii–IV–V–vi–vii°–I",
      "Uma sequência de quintas descendentes: I–vi–IV–ii–vii°–V–iii–I",
    ],
        [
          'Uma sequência 5-6 ascendente alterna acordes 5/3 e 6/3 sobre um baixo que sobe por grau',
          'Uma sequência 5-6 ascendente alterna acordes 5/3 e 6/4 sobre um baixo que sobe por grau',
          'Uma sequência 5-6 ascendente alterna acordes 5/3 e 6/3 sobre um baixo que sobe por terceiras',
          'Uma sequência 5-6 ascendente alterna acordes 5/3 e 6/4 sobre um baixo que sobe por terceiras',
        ],
        [
          'Uma sequência reapresenta o padrão harmónico em diferentes níveis de altura; o padrão tem prioridade sobre a ordem funcional normal',
          'Uma sequência reapresenta o padrão harmónico em diferentes níveis de altura; a ordem funcional normal tem prioridade sobre o padrão',
          'Uma sequência repete o padrão harmónico num único nível de altura inalterado; o padrão tem prioridade sobre a ordem funcional normal',
          'Uma sequência repete o padrão harmónico num único nível de altura inalterado; a ordem funcional normal tem prioridade sobre o padrão',
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
      "Primeira espécie: uma nota do contraponto contra cada nota do cantus firmus",
      'Primeira espécie: duas notas do contraponto contra cada nota do cantus firmus',
      'Primeira espécie: quatro notas do contraponto contra cada nota do cantus firmus',
      'Primeira espécie: três notas do contraponto contra cada nota do cantus firmus',
    ],
        [
          'A primeira espécie permite consonâncias perfeitas e imperfeitas; nunca permite dissonâncias',
          'A primeira espécie permite consonâncias perfeitas mas exclui as imperfeitas; nunca permite dissonâncias',
          'A primeira espécie permite consonâncias perfeitas e imperfeitas; também permite dissonâncias',
          'A primeira espécie permite consonâncias perfeitas mas exclui as imperfeitas; também permite dissonâncias',
        ],
        [
          'Uma consonância perfeita aborda-se melhor por movimento contrário',
          'Uma consonância perfeita aborda-se melhor por movimento paralelo',
          'Uma consonância perfeita aborda-se igualmente bem por qualquer tipo de movimento',
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
          'Na segunda espécie, as dissonâncias de passagem só podem cair nos tempos fracos',
          'Na segunda espécie, todas as notas têm de ser consonantes, como na primeira',
          'Na segunda espécie, as dissonâncias podem cair nos tempos fortes',
          'Na segunda espécie, não há regras sobre a dissonância',
        ],
        [
      "A segunda espécie permite uma ligação dissonante por grau conjunto entre consonâncias acentuadas",
      'A segunda espécie permite uma ligação dissonante abordada por salto entre consonâncias acentuadas',
      'A segunda espécie permite uma ligação consonante por grau conjunto entre dissonâncias acentuadas',
      'A segunda espécie permite uma ligação consonante abordada por salto entre dissonâncias acentuadas',
    ],
      ],
    },
    {
      // interval_id
      promptTemplate:
        'Qual é o intervalo formado entre as duas vozes? Partindo de {root}.',
      hintTemplate:
        'No contraponto de espécies, consonâncias são 3.as, 6.as e intervalos perfeitos (1P, 5P, 8P). Dissonâncias (2.as, 7.as, trítono) requerem tratamento especial.',
    },
  ],
};

export default overlay;
