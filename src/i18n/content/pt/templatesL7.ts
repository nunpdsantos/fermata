import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 7 exercise templates
// 16 modules — index-aligned with templatesL7.ts (W4-01 re-keying, 2026-10-31)
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 21: Harmonia Jazz
  // =========================================================================

  // ---- l7u21m1: Cifras de Jazz e Extensões ----
  l7u21m1: [
    {
      // chord_build
      promptTemplate:
        'Constrói o acorde {quality} sobre {root}. Seleciona todas as notas, incluindo a nona acima da sétima.',
      hintTemplate:
        'As extensões de jazz empilham terças acima da sétima: nona = segunda uma oitava acima, décima primeira = quarta acima, décima terceira = sexta acima. Constrói a partir de {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as cifras de jazz é verdadeira?',
      hintTemplate:
        'Cifras de jazz: triângulo/maj7 = sétima maior, - ou m = menor, 7 = dominante, ° = diminuto, ø = semidiminuto, + = aumentado, sus = suspenso. As extensões medem-se acima da fundamental: em C13, A é a 13.ª e F é geralmente omitido; em C7(#9), D# é a 9.ª aumentada, juntamente com E e Bb.',
      choiceSets: [
        [
          "C13 mantém uma base de sétima da dominante e estende-se até A; o F fica normalmente de fora",
          "C13 tem geralmente uma base de sétima maior e estende-se até A; a sétima é B",
          "C13 mantém uma base de sétima da dominante e estende-se até Ab; a décima terceira é baixada",
          "C13 tem normalmente uma base de sétima menor com Eb como terça; o A torna-se a décima terceira",
        ],
        [
          'Cmin7(b5) é o mesmo que Cø (C semidiminuto)',
          'Cmin7(b5) é um acorde de sétima diminuta completo, exatamente o mesmo acorde que Cdim7 (C°7)',
          'Cmin7(b5) é um acorde de sétima menor',
          'A b5 torna-o um acorde aumentado',
        ],
        [
          'C7(#9) indica E, Bb, D#',
          'C7(#9) indica E, B, D#',
          'C7(#9) indica Eb, Bb, D',
          'C7(#9) indica Eb, B, D',
        ],
      ],
    },
  ],

  // ---- l7u21m2: Voicings de Shell ----
  l7u21m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual conjunto de três notas é o voicing de shell correto?',
      hintTemplate:
        'Um voicing de shell usa apenas fundamental, terça e sétima — a quinta é omitida. A terça define a qualidade do acorde (maior/menor); a sétima define o tipo de acorde de sétima (maj7 / m7 / dom7).',
      choiceSets: [
        [
          'Shell de Cmaj7: C, E, B',
          'Shell de Cmaj7: C, G, B',
          'Shell de Cmaj7: C, E, G',
          'Shell de Cmaj7: C, G, Bb',
        ],
        [
          'Shell de Dm7: D, F, C',
          'Dm7 completo: D, F, A, C',
          'Dm7 sem a terça: D, A, C',
          'Dm7 sem a sétima: D, F, A',
        ],
        [
          'Shell de G7: G, B, F',
          'Shell de G7: G, D, F',
          'Shell de G7: G, B, D',
          'Shell de G7: G, D, F#',
        ],
        [
          'Shell de Fmaj7: F, A, E',
          'Fmaj7 completo: F, A, C, E',
          'Fmaj7 sem a terça: F, C, E',
          'Fmaj7 sem a sétima: F, A, C',
        ],
        [
          'Shell de Am7: A, C, G',
          'Am7 completo: A, C, E, G',
          'Am7 sem a terça: A, E, G',
          'Am7 sem a sétima: A, C, E',
        ],
        [
          'Shell de E7: E, G#, D',
          'Shell de E7: E, B, D',
          'Shell de E7: E, G#, B',
          'Shell de E7: E, B, D#',
        ],
        [
          'Shell de Bbmaj7: Bb, D, A',
          'Shell de Bbmaj7: Bb, Eb, G',
          'Shell de Bbmaj7: Bb, F, C',
          'Shell de Bbmaj7: Bb, C, Eb',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Como se ligam os voicings de shell num contexto jazz?',
      hintTemplate:
        'Num ii-V-I, a terça do ii mantém-se como sétima do V, enquanto a sétima do ii desce meio-tom para a terça do V (e o mesmo volta a acontecer do V para o I). Esta eficiência na condução de vozes chama-se linhas de guide tones.',
      nudgeTemplate: 'Identifica a 3.ª e a 7.ª de cada acorde de um ii-V-I (em C: Dm7, G7, Cmaj7) e segue cada uma dessas notas até ao acorde seguinte: quais ficam onde estão, e quanto se deslocam as outras?',
      choiceSets: [
        [
          'Em Dm7–G7, F mantém-se em F; C passa para B',
          'Em Dm7–G7, F passa para E; C passa para B',
          'Em Dm7–G7, F mantém-se em F; C passa para D',
          'Em Dm7–G7, F passa para E; C passa para D',
        ],
        [
          'Em Bb7–Ebmaj7, D→D e Ab→G',
          'Em Bb7–Ebmaj7, D→Eb e Ab→G',
          'Em Bb7–Ebmaj7, D→D e Ab→F',
          'Em Bb7–Ebmaj7, D→Eb e Ab→F',
        ],
      ],
    },
  ],

  // ---- l7u21m3: Progressão ii-V-I ----
  l7u21m3: [
    {
      // chord_build
      promptTemplate:
        'Constrói um acorde de sétima menor sobre {root} — o som ii7 de uma progressão ii-V-I.',
      hintTemplate:
        'Um ii7 é um acorde de sétima menor sobre {root}: fundamental + 3.ª menor + 5.ª perfeita + 7.ª menor. No jazz, o ii-V-I é a progressão mais fundamental.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a progressão ii-V-I é verdadeira?',
      hintTemplate:
        'ii-V-I em maior: m7 -> dom7 -> maj7. Em menor: m7b5 -> dom7(b9) -> m(maj7). Esta é a espinha dorsal da harmonia jazz. Um ii-V-I também pode estabelecer uma tónica temporária noutro grau da tonalidade.',
      choiceSets: [
        [
          'Em tonalidades menores, o acorde ii é semidiminuto (m7b5)',
          "Em tonalidades menores, o acorde ii é de sétima da dominante (7)",
          "Em tonalidades menores, o acorde ii é de sétima maior (maj7)",
          "Em tonalidades menores, o acorde ii é de sétima diminuta (dim7)",
        ],
        [
          'Quando um ii-V-I aponta para um acorde diferente de I, esse acorde funciona como tónica da tonalidade temporária',
          'Quando um ii-V-I aponta para um acorde diferente de I, esse acorde funciona como supertónica da tonalidade temporária',
          'Quando um ii-V-I aponta para um acorde diferente de I, esse acorde funciona como subdominante da tonalidade temporária',
          'Quando um ii-V-I aponta para um acorde diferente de I, esse acorde funciona como dominante da tonalidade temporária',
        ],
      ],
    },
  ],

  // ---- l7u21m4: Substituição Tritónica ----
  l7u21m4: [
    {
      // chord_build
      promptTemplate:
        'Constrói o substituto tritónico do V7 de {key} maior.',
      hintTemplate:
        'O V7 de {key} constrói-se uma 5.ª perfeita acima de {key}. O seu substituto tritónico é o acorde de sétima da dominante a um trítono (6 meios-tons) desse V7: {root}7, que desce meio-tom para {key}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Substituição tritónica: porque funciona e o que muda?',
      hintTemplate:
        'Dois dom7 a um trítono de distância partilham o mesmo intervalo de trítono (a terça e a sétima trocam). Isto cria movimento cromático do baixo: bII7 -> I em vez de V7 -> I.',
      choiceSets: [
        [
          'G7 e Db7 partilham as alturas sonoras F e B',
          'G7 e Db7 partilham as alturas sonoras G e D',
          'G7 e Db7 partilham as alturas sonoras B e E',
          'G7 e Db7 partilham as alturas sonoras C e F',
        ],
        [
          'O baixo do substituto desce meio-tom para a tónica',
          'O baixo do substituto desce um tom para a tónica',
          'O baixo do substituto sobe meio-tom para a tónica',
          'O baixo do substituto sobe um tom para a tónica',
        ],
      ],
    },
  ],

  // ---- l7u21m5: Formas de Blues ----
  l7u21m5: [
    {
      // scale_build
      promptTemplate:
        'Constrói a escala de {root} {scaleType} usada na improvisação blues.',
      hintTemplate:
        'A escala blues: fundamental, b3, 4, b5, 5, b7 (6 notas). A pentatónica menor: fundamental, b3, 4, 5, b7 (5 notas). Constrói a partir de {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Analisa a estrutura de uma forma de blues.',
      hintTemplate:
        'O blues de 12 compassos: I7 (4 compassos), IV7 (2 compassos), I7 (2 compassos), V7 (1), IV7 (1), I7 (2). O jazz blues acrescenta movimento ii-V e substituições tritónicas.',
      choiceSets: [
        [
          'Os três acordes básicos de um blues de 12 compassos em F são F7, Bb7, C7',
          'Os três acordes básicos de um blues de 12 compassos em F são Fmaj7, Bb7, C7',
          'Os três acordes básicos de um blues de 12 compassos em F são F7, Bbmaj7, C7',
          'Os três acordes básicos de um blues de 12 compassos em F são Fmaj7, Bbmaj7, C7',
        ],
        [
          'No blues jazz em C, Gm7–C7 no compasso 4 é um ii–V que conduz a F7',
          'No blues jazz em C, Dm7–G7 no compasso 4 é um ii–V que conduz a F7',
          'No blues jazz em C, Gm7–C7 nos compassos 9–10 é um ii–V que conduz a C7',
          'No blues jazz em C, Am7–D7 nos compassos 9–10 é um ii–V que conduz a C7',
        ],
      ],
    },
  ],

  // ---- l7u21m6: Rhythm Changes ----
  l7u21m6: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa a forma dos rhythm changes.',
      hintTemplate:
        'Rhythm changes (de "I Got Rhythm", de Gershwin): forma AABA, 32 compassos. Secções A: turnarounds I-vi-ii-V. Ponte: III7-VI7-II7-V7 (ciclo de dominantes).',
      choiceSets: [
        [
          'A secção A dos rhythm changes é construída sobre turnarounds I-vi-ii-V em Bb maior',
          "A secção A dos rhythm changes é construída sobre turnarounds I-IV-vi-V em Bb maior",
          "A secção A dos rhythm changes é construída sobre turnarounds I-V-vi-IV em Bb maior",
          "A secção A dos rhythm changes é construída sobre turnarounds I-bVII-IV-I em Bb maior",
        ],
        [
          "A ponte liga acordes dominantes cujas fundamentais descem uma quinta de cada vez",
          "A ponte liga acordes dominantes cujas fundamentais sobem uma quinta de cada vez",
          "A ponte liga acordes dominantes cujas fundamentais descem uma terça maior de cada vez",
          "A ponte liga acordes dominantes cujas fundamentais sobem meio-tom de cada vez",
        ],
        [
          'A forma dos rhythm changes é AABA, num total de 32 compassos',
          "A forma dos rhythm changes é ABAB, num total de 32 compassos",
          "A forma dos rhythm changes é ABBA, num total de 32 compassos",
          "A forma dos rhythm changes é ABAC, num total de 32 compassos",
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 22: Harmonia Modal e Pop
  // =========================================================================

  // ---- l7u22m1: Teoria Acorde-Escala ----
  l7u22m1: [
    {
      // scale_build
      promptTemplate:
        'Constrói o modo {scaleType} de {root}.',
      hintTemplate:
        'Os modos: jónio (maior), dórico (b3, b7), frígio (b2, b3, b6, b7), lídio (#4), mixolídio (b7), eólio (menor natural), lócrio (b2, b3, b5, b6, b7).',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a teoria acorde-escala é verdadeira?',
      hintTemplate:
        'm7 -> dórico. dom7 -> mixolídio. maj7 -> jónio ou lídio. m7b5 -> lócrio (ou lócrio com 2.ª natural). Uma nota a evitar é uma nota da escala meio-tom acima de uma nota do acorde.',
      choiceSets: [
        [
          'O dórico é a escolha de escala primária para acordes m7 no jazz',
          'O jónio é a escolha padrão para acordes m7',
          'O lócrio é a escolha padrão sobre um acorde m7, porque a sua b5 coincide com a quinta do acorde',
          'O lídio é a escolha padrão para acordes m7',
        ],
        [
          'O mixolídio é a escolha de escala primária para acordes de sétima da dominante',
          'O dórico é usado sobre acordes de sétima da dominante',
          'O eólio é a escolha padrão sobre um acorde de sétima da dominante, porque a sua b3 serve a terça do acorde',
          'O frígio é a escolha padrão para acordes de sétima da dominante',
        ],
        [
          'O lídio é frequentemente preferido ao jónio para acordes maj7 porque não tem notas a evitar',
          'O jónio não tem notas a evitar sobre maj7, porque a sua quarta fica um tom acima da terça do acorde',
          'O lócrio é preferido para acordes maj7',
          'As notas a evitar são irrelevantes na teoria acorde-escala',
        ],
        [
          'Uma "nota a evitar" é uma nota da escala meio-tom acima de uma nota do acorde, por isso choca com ela',
          'Uma "nota a evitar" é qualquer nota da escala que não está no acorde, por isso todas as nonas, décimas primeiras e décimas terceiras o são',
          'As notas a evitar criam consonância',
          'Não existem notas a evitar em nenhuma escala',
        ],
        [
          "O lócrio e o lócrio com 2.ª natural fornecem as notas de um acorde semidiminuto m7b5",
          "O dórico e o eólio fornecem as notas de um acorde semidiminuto m7b5",
          "O jónio e o lídio fornecem as notas de um acorde semidiminuto m7b5",
          "O mixolídio e o lídio dominante fornecem as notas de um acorde semidiminuto m7b5",
        ],
      ],
    },
  ],

  // ---- l7u22m2: Estruturas Superiores e Rearmonização ----
  l7u22m2: [
    {
      // chord_build
      promptTemplate:
        'Constrói a tríade de estrutura superior que fica sobre {key}7 e lhe dá a nona, a décima primeira aumentada e a décima terceira.',
      hintTemplate:
        'A nona de {key}7 fica um tom acima de {key}. A tríade maior sobre essa nota, {root}, contém a nona (a sua fundamental), a décima primeira aumentada (a sua terça) e a décima terceira (a sua quinta).',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as estruturas superiores e a rearmonização é verdadeira?',
      hintTemplate:
        'Uma tríade de estrutura superior fica sobre o shell da dominante (fundamental, terça, b7); nomeia as suas notas pelo intervalo acima do baixo. A rearmonização troca acordes por outros que ainda suportam a melodia, muitas vezes dentro da mesma função. Acordes diminutos de passagem podem ligar acordes à distância de um grau através de movimento cromático no baixo.',
      choiceSets: [
        [
          'Uma tríade de D maior sobre C7 fornece a nona, a #11 e a décima terceira (o som de C13#11)',
          'Uma tríade de D maior sobre C7 fornece a b9, a #9 e a b13',
          'Uma tríade de D maior sobre C7 apenas dobra a fundamental, a terça e a quinta do acorde, por isso não acrescenta cor nenhuma',
          'Uma tríade de D maior sobre C7 transforma-o num acorde menor',
        ],
        [
          'Em C maior, Em7 pode substituir Cmaj7: partilham E, G e B e ambos têm função de tónica',
          "Em C maior, Em7 pode substituir Cmaj7: partilham E, G e B e ambos têm função dominante",
          "Em C maior, Em7 pode substituir Cmaj7: partilham C, E e G e ambos têm função de tónica",
          "Em C maior, Em7 pode substituir Cmaj7: partilham C, E e G e ambos têm função dominante",
        ],
        [
          "A rearmonização dá a uma melodia conhecida um acompanhamento novo, escolhendo outros acordes de apoio",
          "A rearmonização dá aos acordes originais uma melodia diferente, substituindo as notas melódicas por cima deles",
          "A rearmonização move a melodia e os acordes originais para outra tonalidade, preservando as suas funções harmónicas",
          "A rearmonização muda a inversão dos acordes originais, preservando a melodia e a identidade dos acordes",
        ],
        [
          'C#dim7 entre Cmaj7 e Dm7 é um acorde de passagem: o baixo sobe cromaticamente C-C#-D',
          'C#dim7 entre Cmaj7 e Dm7 é a nova tónica, por isso a música modulou definitivamente para C# menor',
          'Um acorde de passagem tem de durar uma secção inteira',
          'Os acordes de passagem não podem ser diminutos',
        ],
      ],
    },
  ],

  // ---- l7u22m3: Mudanças de Coltrane ----
  l7u22m3: [
    {
      // chord_build
      promptTemplate:
        'Nas mudanças de Coltrane cada centro tonal é preparado pelo seu próprio V7. Constrói o V7 que conduz a {key} maior.',
      hintTemplate:
        'Um acorde de sétima da dominante resolve uma 5.ª perfeita abaixo: o V7 de {key} constrói-se uma 5.ª acima de {key}, sobre {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as mudanças de Coltrane é verdadeira?',
      hintTemplate:
        'Giant Steps: três centros tonais a uma 3.ª maior de distância (B, G, Eb), cada um alcançado pelo seu próprio V7. A estrutura constante move uma mesma qualidade de acorde em paralelo, seja qual for a tonalidade.',
      choiceSets: [
        [
          'Giant Steps percorre três centros tonais a uma 3.ª maior de distância: B, G e Eb',
          'Giant Steps percorre centros tonais a uma 5.ª perfeita de distância, um passo de cada vez no ciclo de quintas',
          'Os seus centros tonais estão a meio-tom de distância',
          'Fica numa só tonalidade do princípio ao fim',
        ],
        [
          "A oitava reparte-se igualmente por três pontos de repouso tonal separados por quatro meios-tons",
          'A oitava reparte-se igualmente por quatro pontos de repouso tonal separados por três meios-tons',
          'A oitava reparte-se igualmente por dois pontos de repouso tonal separados por seis meios-tons',
          'A oitava reparte-se igualmente por seis pontos de repouso tonal separados por dois meios-tons',
        ],
        [
          'A estrutura constante move uma mesma qualidade de acorde em paralelo, seja qual for a tonalidade (Cmaj7-Dbmaj7-Dmaj7)',
          'A estrutura constante significa manter um único acorde durante toda a música, mudando apenas a melodia que está por cima',
          'A estrutura constante usa apenas acordes diatónicos',
          'A estrutura constante proíbe o movimento paralelo',
        ],
      ],
    },
  ],

  // ---- l7u22m4: Fundamentos da Harmonia Modal ----
  l7u22m4: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a nota característica de um modo é verdadeira?',
      hintTemplate:
        'Cada modo tem uma nota característica que o distingue. Dórico: sexta natural. Frígio: b2. Lídio: #4. Mixolídio: b7. Os vamps modais enfatizam estas notas.',
      choiceSets: [
        [
          "Parte da menor natural e sobe a sexta nota meio-tom para obter o dórico",
          "Parte da menor natural e sobe a sétima nota meio-tom para obter o dórico",
          "Parte da menor natural e sobe a terceira nota meio-tom para obter o dórico",
          "Parte da menor natural e baixa a segunda nota meio-tom para obter o dórico",
        ],
        [
          "Eleva apenas a quarta nota de uma escala maior para obter o lídio",
          "Eleva apenas a quinta nota de uma escala maior para obter o lídio",
          "Baixa apenas a sétima nota de uma escala maior para obter o lídio",
          "Baixa apenas a terceira nota de uma escala maior para obter o lídio",
        ],
        [
          'Um vamp em D dórico (Dm7 - G7) enfatiza a sexta natural (B natural sobre D)',
          "Um vamp em D dórico (Dm7 - Gm7) enfatiza a sexta baixada (Bb sobre D)",
          "Um vamp em D dórico (Dm7 - A7) enfatiza a sétima elevada (C# sobre D)",
          "Um vamp em D dórico (Dmaj7 - Gmaj7) enfatiza a terça maior (F# sobre D)",
        ],
        [
          'O frígio caracteriza-se pelo intervalo de b2, dando-lhe um sabor espanhol/flamenco',
          "O frígio caracteriza-se pelo intervalo de #4, dando-lhe um sabor espanhol/flamenco",
          'O frígio caracteriza-se pelo intervalo de sétima maior, dando-lhe um sabor espanhol/flamenco',
          "O frígio caracteriza-se pelo intervalo de sexta natural, dando-lhe um sabor espanhol/flamenco",
        ],
      ],
    },
  ],

  // ---- l7u22m5: Planing e Harmonia Quartal ----
  l7u22m5: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a harmonia quartal e o paralelismo é verdadeira?',
      hintTemplate:
        'Paralelismo: mover uma forma de acorde em paralelo (diatónico ou cromático). Harmonia quartal: acordes construídos de quartas empilhadas em vez de terças, comuns no jazz e na música modal.',
      choiceSets: [
        [
          'O empilhamento quartal D–G–C–F tem três quartas perfeitas entre notas adjacentes',
          'O empilhamento quartal D–G–C–F tem três quartas aumentadas entre notas adjacentes',
          'O empilhamento quartal D–G–C–F tem quartas perfeitas alternadas com quintas perfeitas',
          'O empilhamento quartal D–G–C–F tem duas quartas perfeitas entre as suas três notas',
        ],
        [
          "O paralelismo desloca todas as notas de um acorde na mesma direção ao mesmo tempo",
          "O paralelismo costuma enviar a nota superior do acorde para cima enquanto a inferior desce",
          "O paralelismo mantém todas as notas superiores enquanto o baixo percorre a escala",
          "O paralelismo transforma um acorde em melodia fazendo soar as notas uma após outra",
        ],
        [
          'O paralelismo diatónico mantém todas as notas dentro da tonalidade; o paralelismo estrito (cromático) mantém os intervalos exatos',
          "O paralelismo diatónico mantém os intervalos exatos; o paralelismo estrito (cromático) mantém todas as notas na tonalidade",
          "O paralelismo diatónico mantém todas as vozes imóveis; o paralelismo estrito (cromático) muda apenas o baixo",
          "O paralelismo diatónico move todas as notas em movimento contrário; o paralelismo estrito (cromático) mantém os intervalos exatos",
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 23: Taxonomia de Escalas e Acordes
  // =========================================================================

  // ---- l7u23m1: Progressões Pop e Números de Nashville ----
  l7u23m1: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre progressões pop e números de Nashville é verdadeira?',
      hintTemplate:
        'O sistema de números de Nashville usa graus da escala: 1=I, 4=IV, 5=V, 6m=vi. Comuns: 1-5-6m-4, 1-4-5-1, 6m-4-1-5.',
      choiceSets: [
        [
          "I-V-vi-IV é comum no pop, e os seus algarismos romanos preservam as relações entre acordes em diferentes tonalidades",
          "I-V-vi-IV é comum no pop, e os seus algarismos romanos mantêm as mesmas alturas absolutas em diferentes tonalidades",
          "I-V-vi-IV é comum no pop, e o vi representa um acorde maior sobre o sexto grau da escala",
          'I-V-vi-IV é comum no pop, e o IV representa um acorde menor sobre o quarto grau da escala',
        ],
        [
          "vi-IV-I-V roda I-V-vi-IV de modo que os mesmos quatro acordes comecem no vi",
          "vi-IV-I-V roda I-IV-vi-V de modo que os mesmos quatro acordes comecem no vi",
          "vi-IV-I-V roda I-vi-IV-V de modo que os mesmos quatro acordes comecem no vi",
          "vi-IV-I-V roda I-V-IV-vi de modo que os mesmos quatro acordes comecem no vi",
        ],
        [
          'As cifras de Nashville numeram as fundamentais por grau da escala a partir da tónica, fazendo de 4 o acorde sobre o quarto grau',
          'As cifras de Nashville costumam numerar as fundamentais por meios-tons acima da tónica, fazendo de 4 uma terça maior',
          'As cifras de Nashville numeram as fundamentais como alturas fixas, fazendo de 1 a nota C em qualquer tonalidade',
          'As cifras de Nashville numeram as durações dos acordes em tempos, fazendo de 4 um acorde com quatro tempos',
        ],
      ],
    },
    {
      // chord_build
      promptTemplate:
        'Em {key} maior, constrói o acorde escrito 6m em números de Nashville.',
      hintTemplate:
        '6m é o acorde menor sobre o 6.º grau da escala (vi): em {key} maior é {root} menor.',
    },
  ],

  // ---- l7u23m2: Mistura Modal e Mediantes Cromáticas no Pop ----
  l7u23m2: [
    {
      // chord_build
      promptTemplate:
        'Em {key} maior, constrói o acorde ♭VII emprestado do menor homónimo.',
      hintTemplate:
        'O menor homónimo ({key} menor) empresta o seu ♭VII a {key} maior: a tríade maior sobre {root}.',
    },
    {
      // chord_build
      promptTemplate:
        'Em {key} maior, constrói o acorde ♭VI emprestado do menor homónimo.',
      hintTemplate:
        'O menor homónimo ({key} menor) empresta o seu ♭VI a {key} maior: a tríade maior sobre {root}.',
    },
    {
      // chord_build
      promptTemplate:
        'Em {key} maior, constrói o acorde iv emprestado do menor homónimo.',
      hintTemplate:
        'O menor homónimo ({key} menor) empresta o seu iv a {key} maior: a tríade menor sobre {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre acordes emprestados e mediantes cromáticas no pop é verdadeira?',
      hintTemplate:
        'Empréstimos comuns no pop: iv, bVI e bVII do menor homónimo (bVII é também o acorde mixolídio). Mediantes cromáticas: fundamentais a uma 3.ª de distância, com notas fora da tonalidade.',
      choiceSets: [
        [
          'O acorde bVII numa tonalidade maior é emprestado do menor homónimo (ou do mixolídio)',
          'O acorde bVII é emprestado do lídio, que é o único modo com o 7.º grau rebaixado em meio-tom',
          'bVII é um acorde diatónico em maior',
          'bVII é emprestado do lócrio',
        ],
        [
          'O acorde iv numa tonalidade maior é emprestado do homónimo menor (eólio)',
          'O acorde iv é diatónico numa tonalidade maior, porque o 4.º grau de uma escala maior tem uma tríade menor',
          'iv é emprestado do lídio',
          'iv não existe como acorde emprestado',
        ],
        [
          'A "cadência Mario" bVI-bVII-I usa dois acordes emprestados do menor homónimo',
          'A "cadência Mario" bVI-bVII-I usa apenas acordes diatónicos da tonalidade maior, sem nada emprestado',
          'Termina no acorde vi',
          'É apenas uma cadência de tonalidade menor',
        ],
        [
          'C maior para E maior é uma mediante cromática: fundamentais a uma 3.ª maior, uma nota comum (E)',
          'C maior para E maior é um movimento diatónico simples: ambos os acordes pertencem a C maior e partilham duas notas',
          'C para E maior é uma relação de dominante',
          'C maior e E maior não partilham notas',
        ],
      ],
    },
  ],

  // ---- l7u23m3: Escalas: Modos da Menor Melódica ----
  l7u23m3: [
    {
      // scale_build
      promptTemplate:
        'Constrói a escala {scaleType} de {root}.',
      hintTemplate:
        'Menor melódica (menor jazz): 1-2-b3-4-5-6-7. Alterada (modo 7 da menor melódica): 1-b2-#2-3-#4-#5-b7 — a menor melódica meio-tom acima de {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre os modos da menor melódica é verdadeira?',
      hintTemplate:
        'Numera os modos de C menor melódica (C D Eb F G A B) a partir de cada nota: o modo 4 começa em F (lídio dominante), o modo 6 em A (lócrio com 2.ª natural), o modo 7 em B (escala alterada).',
      choiceSets: [
        [
          'A escala alterada é o modo 7 da menor melódica: G alterada tem as notas de Ab menor melódica',
          'A escala alterada é o modo 7 da menor harmónica: G alterada tem exatamente as notas de C menor harmónica',
          'A escala alterada não tem notas alteradas',
          'G alterada é G maior',
        ],
        [
          'O lídio dominante é o modo 4 da menor melódica e serve para um acorde de sétima da dominante com #11',
          'O lídio dominante é o modo 2 da menor melódica e serve para um acorde de sétima da dominante com #11',
          'O lídio dominante é o modo 6 da menor melódica e serve para um acorde de sétima da dominante com #11',
          'O lídio dominante é o modo 7 da menor melódica e serve para um acorde de sétima da dominante com #11',
        ],
        [
          'A escala menor melódica do jazz eleva a 6.ª e a 7.ª da menor natural, tanto a subir como a descer',
          'A escala menor melódica do jazz rebaixa tanto o 6.º como o 7.º grau, o que a torna simplesmente a escala menor natural',
          'A escala menor melódica do jazz tem a terça e a sétima rebaixadas',
          'A escala menor melódica do jazz eleva apenas a 7.ª da menor natural, como a menor harmónica',
        ],
        [
          'O lócrio com 2.ª natural é o modo 6 da menor melódica e serve para o acorde semidiminuto (m7b5)',
          'O lócrio com 2.ª natural é o modo 2 da menor melódica e serve para o acorde semidiminuto (m7b5)',
          'O lócrio com 2.ª natural é o modo 4 da menor melódica e serve para o acorde semidiminuto (m7b5)',
          'O lócrio com 2.ª natural é o modo 7 da menor melódica e serve para o acorde semidiminuto (m7b5)',
        ],
      ],
    },
  ],

  // ---- l7u23m4: Modos da Menor Harmónica, Escalas Simétricas e do Mundo ----
  l7u23m4: [
    {
      // scale_build
      promptTemplate:
        'Constrói a escala de {root} {scaleType}.',
      hintTemplate:
        'Tons inteiros: só tons (6 notas). Frígio dominante: modo 5 da menor harmónica, 1-b2-3-4-5-b6-b7 (7). Menor harmónica: menor natural com a 7.ª elevada (7). Diminuta meio-tom/tom: meios-tons e tons alternados (8).',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre os modos da menor harmónica, as escalas simétricas e as do mundo é verdadeira?',
      hintTemplate:
        'A escala menor harmónica tem um som "exótico" devido à segunda aumentada. O frígio dominante (5.º modo da menor harmónica) é usado no flamenco e na música do Médio Oriente. As escalas simétricas repetem um só padrão intervalar. A escala menor húngara eleva o grau 4 da menor harmónica, criando duas segundas aumentadas. As escalas de tons inteiros usam tons inteiros (duas coleções distintas); as diminutas alternam meios-tons e tons (oito notas).',
      choiceSets: [
        [
          'A escala frígio dominante (1-b2-3-4-5-b6-b7) é o 5.º modo da menor harmónica',
          'A escala frígio dominante é simplesmente o modo frígio normal, com a mesma terça menor',
          'O frígio dominante tem uma terça menor',
          'O frígio dominante é uma escala de tons inteiros',
        ],
        [
          'A escala menor húngara tem duas segundas aumentadas, criando a sua sonoridade dramática distintiva',
          'A escala menor húngara é o modo 5 da menor harmónica, o frígio dominante, com uma 3.ª maior',
          'A escala menor húngara não tem intervalos aumentados',
          'A escala menor húngara é igual à menor melódica (6.ª e 7.ª elevadas)',
        ],
        [
          'Existem apenas duas escalas de tons inteiros diferentes: em C e em Db',
          'Existem doze escalas de tons inteiros diferentes, uma a começar em cada nota cromática',
          'A escala de tons inteiros tem 7 notas',
          'Contém uma quinta perfeita',
        ],
        [
          'A escala diminuta alterna meios-tons e tons, o que dá 8 notas numa oitava',
          "A escala diminuta alterna meios-tons e tons, o que dá 6 notas numa oitava",
          "A escala diminuta alterna meios-tons e tons, o que dá 7 notas numa oitava",
          "A escala diminuta alterna meios-tons e tons, o que dá 12 notas numa oitava",
        ],
      ],
    },
  ],

  // ---- l7u23m5: Taxonomia Completa de Acordes ----
  l7u23m5: [
    {
      // chord_build
      promptTemplate:
        'Famílias de acordes: constrói um acorde de {root} {quality}, empilhando terças até à nona.',
      hintTemplate:
        'Empilha terças a partir de {root}: fundamental, terça, quinta, sétima, nona — a terça e a sétima definem a família (maior, menor ou dominante).',
    },
    {
      // chord_build
      promptTemplate:
        'Famílias de acordes: constrói um acorde de {root} {quality}.',
      hintTemplate:
        'Menor com 7.ª maior = tríade menor + 7.ª maior. Aumentado com 7.ª maior = tríade aumentada (5.ª elevada) + 7.ª maior. Constrói a partir de {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as famílias de acordes é verdadeira?',
      hintTemplate:
        'As extensões (9, 11, 13) implicam a sétima; as notas acrescentadas (add9, 6) não. Os acordes sus substituem a terça. Um power chord tem apenas fundamental e quinta. Um acorde menor com sétima maior combina uma tríade menor com uma sétima maior: C-Eb-G-B.',
      choiceSets: [
        [
          'Em C9, inclui a sétima Bb; em Cadd9, omite a sétima',
          'Em C9, omite a sétima; em Cadd9, inclui a sétima Bb',
          'Em C9, inclui a sétima B; em Cadd9, omite a sétima',
          'Em C9, omite a sétima; em Cadd9, inclui a sétima B',
        ],
        [
          'Um acorde sus4 substitui a terça pela quarta, por isso Csus4 é C-F-G',
          'Um acorde sus4 mantém a terça e acrescenta a quarta, por isso Csus4 é C-E-F-G',
          'Um acorde sus4 substitui a terça pela quarta aumentada, por isso Csus4 é C-F#-G',
          "Um acorde sus4 substitui a quinta pela quarta, por isso Csus4 é C-E-F",
        ],
        [
          'Um power chord (C5) tem apenas fundamental e quinta, por isso não é nem maior nem menor',
          'Um power chord (C5) é uma tríade de C maior com a fundamental dobrada, por isso soa sempre maior',
          'C5 contém apenas o 5.º grau',
          'C5 é uma tríade de C menor',
        ],
        [
          'O acorde menor com 7.ª maior sobre C contém C-Eb-G-B',
          'O acorde menor com 7.ª maior sobre C contém C-E-G-Bb',
          'O acorde menor com 7.ª maior sobre C contém C-Eb-G-Bb',
          'O acorde menor com 7.ª maior sobre C contém C-E-G-B',
        ],
      ],
    },
  ],

};

export default overlay;
