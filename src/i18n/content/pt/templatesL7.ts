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
        'Cifras de jazz: triângulo/maj7 = sétima maior, - ou m = menor, 7 = dominante, ° = diminuto, ø = semidiminuto, + = aumentado, sus = suspenso.',
      choiceSets: [
        [
          'C13 implica um acorde de sétima dominante com 9.ª, 11.ª (geralmente omitida) e 13.ª',
          'C13 tem apenas fundamental e décima terceira',
          'C13 é uma tríade de C maior com apenas a décima terceira (A) acrescentada em cima, sem nenhuma sétima em todo o acorde',
          'C13 implica um acorde menor com sétima, porque a 13.ª baixa meio-tom a terça do acorde',
        ],
        [
          'Cmin7(b5) é o mesmo que Cø (C semidiminuto)',
          'Cmin7(b5) é um acorde de sétima diminuta completo, exatamente o mesmo acorde que Cdim7 (C°7)',
          'Cmin7(b5) é um acorde de sétima menor',
          'A b5 torna-o um acorde aumentado',
        ],
        [
          'C7(#9) é sempre um acorde dominante com nona aumentada, frequentemente chamado o "acorde de Hendrix"',
          'C7(#9) é um acorde de sétima maior',
          'Em C7(#9) a nona aumentada (D#) substitui a terça maior, por isso o acorde já não tem nenhum E',
          'C7(#9) não tem sétima',
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
          'Cmaj7 completo: C, E, G, B',
          'Cmaj7 sem a terça: C, G, B',
          'Cmaj7 sem a sétima: C, E, G',
        ],
        [
          'Shell de Dm7: D, F, C',
          'Dm7 completo: D, F, A, C',
          'Dm7 sem a terça: D, A, C',
          'Dm7 sem a sétima: D, F, A',
        ],
        [
          'Shell de G7: G, B, F',
          'G7 completo: G, B, D, F',
          'G7 sem a terça: G, D, F',
          'G7 sem a sétima: G, B, D',
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
          'E7 completo: E, G#, B, D',
          'E7 sem a terça: E, B, D',
          'E7 sem a sétima: E, G#, B',
        ],
        [
          'Shell de Bbmaj7: Bb, D, A',
          'Bbmaj7 completo: Bb, D, F, A',
          'Bbmaj7 sem a terça: Bb, F, A',
          'Bbmaj7 sem a sétima: Bb, D, F',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Como se ligam os voicings de shell num contexto jazz?',
      hintTemplate:
        'Num ii-V-I, a terça do ii mantém-se como sétima do V, enquanto a sétima do ii desce meio-tom para a terça do V (e o mesmo volta a acontecer do V para o I). Esta eficiência na condução de vozes chama-se linhas de guide tones.',
      choiceSets: [
        [
          'Os guide tones (terças e sétimas) movem-se sempre por grau conjunto ou mantêm-se entre acordes num ii-V-I',
          'Os voicings de shell requerem grandes saltos entre acordes',
          'Os voicings de shell movem todas as vozes por grandes saltos, porque os guide tones (terça e sétima) nunca se mantêm de acorde para acorde',
          'A condução de vozes não importa no jazz',
        ],
        [
          'A terça do ii mantém-se como sétima do V, e a sétima do ii desce meio-tom para a terça do V',
          'Todas as notas do ii ficam iguais no V, logo o voicing de shell nunca tem de se mover',
          'A fundamental do ii torna-se a fundamental do V',
          'Não existe ligação na condução de vozes entre ii e V',
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
        'Um ii7 é um acorde de sétima menor sobre {root}: fundamental + 3.ª menor + 5.ª perfeita + 7.ª menor. No jazz, a ii-V-I é a progressão mais fundamental.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a progressão ii-V-I é verdadeira?',
      hintTemplate:
        'ii-V-I em maior: m7 -> dom7 -> maj7. Em menor: m7b5 -> dom7(b9) -> m(maj7). Esta é a espinha dorsal da harmonia jazz.',
      choiceSets: [
        [
          'Em tonalidades menores, o acorde ii é semidiminuto (m7b5)',
          'Em tonalidades menores, o acorde ii é um acorde de sétima da dominante',
          'As tonalidades menores não usam ii-V-I',
          'Em tonalidades menores, o acorde ii é um acorde de sétima maior (maj7), construído sobre o 2.º grau elevado',
        ],
        [
          'A ii-V-I pode ser usada para tonicizar qualquer acorde, criando centros tonais transitórios',
          'A ii-V-I só funciona na tonalidade principal, nunca noutra tonalidade',
          'A ii-V-I não pode criar tonicização',
          'Apenas V-I cria tonicização no jazz',
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
          'A terça e a sétima do V7 original tornam-se sempre a sétima e a terça da substituição tritónica',
          'As substituições tritónicas partilham a mesma fundamental',
          'Os dois acordes dominantes não partilham notas, por isso os guide tones originais desaparecem',
          'As substituições tritónicas só funcionam em tonalidades menores',
        ],
        [
          'A substituição tritónica cria uma linha de baixo cromática que desce meio-tom de bII para I',
          'O baixo move-se por um tom inteiro, o que torna mais suave a chegada à tónica',
          'O baixo do substituto continua a descer uma 5.ª perfeita para a tónica, exatamente como em V7-I',
          'O movimento do baixo é o mesmo que V-I, porque o substituto mantém a fundamental original no baixo',
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
          'O blues básico de 12 compassos usa apenas I7, IV7 e V7',
          'O blues básico de 12 compassos usa apenas acordes de sétima maior: Imaj7, IVmaj7 e Vmaj7 do princípio ao fim',
          'O blues de 12 compassos tem 16 compassos',
          'A forma de blues fica no acorde I durante os 12 compassos e nunca passa para IV ou V',
        ],
        [
          'O jazz blues acrescenta frequentemente um ii-V no compasso 4 que leva a IV7, e outro nos compassos 9-10 que leva a I',
          'O jazz blues retira dos 12 compassos todos os acordes de sétima da dominante (I7, IV7 e V7) e toca só um vamp menor',
          'O jazz blues nunca modifica a forma básica',
          'O jazz blues usa os mesmos acordes do blues básico',
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
        'Rhythm changes (de Gershwin): forma AABA, 32 compassos. Secções A: turnarounds I-vi-ii-V. Ponte: III7-VI7-II7-V7 (ciclo de dominantes).',
      choiceSets: [
        [
          'A secção A dos rhythm changes é construída sobre turnarounds I-vi-ii-V em Bb maior',
          'Os rhythm changes seguem a forma de blues de 12 compassos, com o turnaround ouvido apenas no último compasso',
          'A secção A é em C maior, e a ponte passa sempre para a sua tonalidade relativa menor',
          'Os rhythm changes não têm tonalidade padrão, por isso cada secção A muda para uma nova tonalidade escolhida pelo solista',
        ],
        [
          'A ponte dos rhythm changes usa um ciclo de acordes de sétima dominante a descer por quintas',
          'A ponte mantém-se num só acorde',
          'A ponte dos rhythm changes fica num único acorde de sétima menor durante todos os seus oito compassos',
          'A ponte é idêntica à secção A: repete os mesmos turnarounds I-vi-ii-V, nota por nota, na mesma tonalidade',
        ],
        [
          'A forma dos rhythm changes é AABA, num total de 32 compassos',
          'Os rhythm changes têm 12 compassos',
          'Os rhythm changes são uma forma de 12 compassos que alterna dois coros de blues (ABAB)',
          'Os rhythm changes não têm forma fixa: cada banda decide a duração e a ordem das secções',
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
          'O mixolídio é a escolha de escala primária para acordes de sétima dominante',
          'O dórico é usado sobre acordes de sétima dominante',
          'O eólio é a escolha padrão sobre um acorde de sétima dominante, porque a sua b3 serve a terça do acorde',
          'O frígio é a escolha padrão para acordes de sétima dominante',
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
          'O lócrio ou o lócrio com 2.ª natural, modo 6 da menor melódica, serve acordes semidiminutos m7b5',
          'O dórico é a escala dos acordes semidiminutos (m7b5), porque a sua sexta natural coincide com a b5 do acorde, nota a nota',
          'O mixolídio é usado para acordes semidiminutos, já que a sua b7 coincide com a sétima menor desses acordes',
          'Os acordes semidiminutos não têm escala associada, por isso os improvisadores só podem usar as notas do acorde',
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
        'Uma tríade de estrutura superior fica sobre o shell da dominante (fundamental, terça, b7); nomeia as suas notas pelo intervalo acima do baixo. A rearmonização troca acordes por outros que ainda suportam a melodia, muitas vezes dentro da mesma função.',
      choiceSets: [
        [
          'Uma tríade de D maior sobre C7 fornece a nona, a #11 e a décima terceira (o som de C13#11)',
          'Uma tríade de D maior sobre C7 fornece a b9, a #9 e a b13',
          'Uma tríade de D maior sobre C7 apenas dobra a fundamental, a terça e a quinta do acorde, por isso não acrescenta cor nenhuma',
          'Uma tríade de D maior sobre C7 transforma-o num acorde menor',
        ],
        [
          'Em C maior, Em7 pode substituir Cmaj7: partilham E, G e B e ambos têm função de tónica',
          'Em C maior, G7 pode substituir Cmaj7 porque ambos os acordes têm função de tónica e partilham todas as suas notas',
          'Em7 e Cmaj7 não partilham nenhuma nota, por isso trocar um acorde pelo outro mudaria sempre a função da harmonia',
          'Apenas o V7 pode substituir um acorde de tónica',
        ],
        [
          'A rearmonização substitui os acordes sob uma melodia por outros que ainda suportam as suas notas',
          'A rearmonização reescreve as notas da melodia para que encaixem nos acordes que a música já tinha, deixando a harmonia intacta',
          'A rearmonização significa transpor uma música para outra tonalidade, o que mantém todas as funções dos acordes',
          'A rearmonização remove todos os acordes, deixando a melodia para ser cantada ou tocada sem qualquer acompanhamento',
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
          'Três centros tonais a uma 3.ª maior de distância dividem a oitava em três partes iguais',
          'Três centros tonais a uma 3.ª maior de distância dividem a oitava em quatro partes iguais, como um acorde de sétima diminuta',
          'Formam uma escala maior',
          'Nunca regressam à primeira tonalidade e passam a um novo centro tonal sempre que a música se repete',
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
          'O dórico distingue-se do menor natural pela sua sexta elevada',
          'O dórico tem uma sétima elevada',
          'O dórico distingue-se do menor natural por um 7.º grau elevado, que lhe dá uma sensível',
          'O dórico é idêntico ao menor natural sobre a mesma tónica, por isso os dois nomes descrevem exatamente as mesmas sete notas',
        ],
        [
          'O lídio distingue-se do maior pela sua quarta elevada (#4)',
          'O lídio distingue-se do maior pelo seu 7.º grau rebaixado (b7), a nota que o mixolídio acrescenta',
          'O lídio tem uma terça rebaixada',
          'O lídio é idêntico ao maior: construídas sobre a mesma tónica, as duas escalas contêm exatamente as mesmas notas',
        ],
        [
          'Um vamp em D dórico (Dm7 - G7) enfatiza a sexta natural (B natural sobre D)',
          'Um vamp em D dórico (Dm7 - Gm7) enfatiza o Bb, a sexta rebaixada que dá a cor ao D dórico',
          'Os vamps em D dórico usam apenas um acorde',
          'Os vamps dóricos evitam o 6.º grau, porque essa nota transformaria o D dórico em D maior',
        ],
        [
          'O frígio caracteriza-se pelo intervalo de b2, dando-lhe um sabor espanhol/flamenco',
          'O frígio soa idêntico ao maior, já que ambos os modos soam brilhantes e resolvem da mesma maneira',
          'O frígio caracteriza-se pela sua quarta elevada, que faz dele o mais brilhante de todos os modos',
          'O frígio não tem b2',
        ],
      ],
    },
  ],

  // ---- l7u22m5: Planing e Harmonia Quartal ----
  l7u22m5: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a harmonia quartal e o planing é verdadeira?',
      hintTemplate:
        'Planing: mover uma forma de acorde em paralelo (diatónico ou cromático). Harmonia quartal: acordes construídos de quartas empilhadas em vez de terças, comuns no jazz e na música modal.',
      choiceSets: [
        [
          'A harmonia quartal empilha quartas perfeitas em vez de terças, criando um som aberto e ambíguo',
          'A harmonia quartal empilha apenas terças maiores, o que a faz soar exatamente como as tríades tradicionais',
          'A harmonia quartal é o mesmo que a harmonia triádica tradicional',
          'Os acordes quartais são sempre dissonantes',
        ],
        [
          'O planing move uma forma de acorde inteira para cima ou para baixo com todas as vozes em paralelo',
          'O planing move as vozes em movimento contrário: a voz aguda sobe enquanto a grave desce',
          'O planing é proibido em todos os estilos musicais',
          'O planing altera sempre a qualidade do acorde em cada passo',
        ],
        [
          'O planing diatónico mantém todas as notas dentro da tonalidade; o planing cromático mantém os intervalos exatos',
          'O planing diatónico e o cromático são a mesma técnica, já que ambos mantêm sempre todas as notas dentro da tonalidade',
          'O planing cromático mantém-se dentro de uma tonalidade',
          'O planing diatónico usa todas as 12 notas cromáticas',
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
          'I-V-vi-IV é uma das progressões pop mais comuns e é usada em centenas de músicas de sucesso',
          'I-V-vi-IV pertence à escrita de corais clássicos e quase nunca se ouve em canções pop',
          'Esta progressão é raramente usada no pop',
          'I-V-vi-IV soa sempre igual em todas as tonalidades',
        ],
        [
          'vi-IV-I-V é a rotação "sensitive" da mesma progressão I-V-vi-IV',
          'vi-IV-I-V não partilha acordes com I-V-vi-IV',
          'vi-IV-I-V não funciona como progressão pop',
          'Começar no vi muda a qualidade dos quatro acordes',
        ],
        [
          'O sistema de números de Nashville representa acordes por número de grau da escala para transposição fácil',
          'Os números de Nashville designam alturas fixas, por isso uma grelha escrita como 1-4-5 só pode ser tocada em C maior',
          'Os números de Nashville são apenas para música country',
          'Os números de Nashville substituem a notação tradicional inteiramente, por isso os músicos de sessão nunca mais leem uma pauta ou cifra',
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
        'Em {key} maior, constrói o acorde ♭VII emprestado do menor paralelo.',
      hintTemplate:
        'O menor paralelo ({key} menor) empresta o seu ♭VII a {key} maior: a tríade maior sobre {root}.',
    },
    {
      // chord_build
      promptTemplate:
        'Em {key} maior, constrói o acorde ♭VI emprestado do menor paralelo.',
      hintTemplate:
        'O menor paralelo ({key} menor) empresta o seu ♭VI a {key} maior: a tríade maior sobre {root}.',
    },
    {
      // chord_build
      promptTemplate:
        'Em {key} maior, constrói o acorde iv emprestado do menor paralelo.',
      hintTemplate:
        'O menor paralelo ({key} menor) empresta o seu iv a {key} maior: a tríade menor sobre {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre acordes emprestados e mediantes cromáticas no pop é verdadeira?',
      hintTemplate:
        'Empréstimos comuns no pop: iv, bVI e bVII do menor paralelo (bVII é também o acorde mixolídio). Mediantes cromáticas: fundamentais a uma 3.ª de distância, com notas fora da tonalidade.',
      choiceSets: [
        [
          'O acorde bVII numa tonalidade maior é emprestado do menor paralelo (ou do mixolídio)',
          'O acorde bVII é emprestado do lídio, que é o único modo com o 7.º grau rebaixado em meio-tom',
          'bVII é um acorde diatónico em maior',
          'bVII é emprestado do lócrio',
        ],
        [
          'O acorde iv numa tonalidade maior é emprestado do paralelo menor (eólio)',
          'O acorde iv é diatónico numa tonalidade maior, porque o 4.º grau de uma escala maior tem uma tríade menor',
          'iv é emprestado do lídio',
          'iv não existe como acorde emprestado',
        ],
        [
          'A "cadência Mario" bVI-bVII-I usa dois acordes emprestados do menor paralelo',
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
        'Numera os modos de C menor melódica (C D Eb F G A B) a partir de cada nota: o modo 4 começa em F (lídio dominante), o modo 6 em A (lócrio com 2.ª natural), o modo 7 em B (alterada).',
      choiceSets: [
        [
          'A escala alterada é o modo 7 da menor melódica: G alterada tem as notas de Ab menor melódica',
          'A escala alterada é o modo 7 da menor harmónica: G alterada tem exatamente as notas de C menor harmónica',
          'A escala alterada não tem notas alteradas',
          'G alterada é G maior',
        ],
        [
          'O lídio dominante é o modo 4 da menor melódica e serve um acorde de sétima da dominante com #11',
          'O lídio dominante é o modo 4 da escala maior, por isso serve um acorde maj7 com a quarta natural (sem #11)',
          'O lídio dominante tem uma sétima maior',
          'O lídio dominante serve acordes menores',
        ],
        [
          'A escala menor melódica do jazz eleva a 6.ª e a 7.ª da menor natural, tanto a subir como a descer',
          'A escala menor melódica do jazz rebaixa tanto o 6.º como o 7.º grau, o que a torna simplesmente a escala menor natural',
          'Tem a terça e a sétima rebaixadas',
          'É uma escala pentatónica',
        ],
        [
          'O lócrio com 2.ª natural é o modo 6 da menor melódica e serve o acorde semidiminuto (m7b5)',
          'O lócrio com 2.ª natural é o modo 2 da menor melódica e serve o acorde de 7.ª diminuta completo (dim7)',
          'O lócrio com 2.ª natural tem uma quinta perfeita',
          'Serve um acorde maj7',
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
        'A escala menor harmónica tem um som "exótico" devido à segunda aumentada. O frígio dominante (5.º modo da menor harmónica) é usado no flamenco e na música do Médio Oriente. As escalas simétricas repetem um só padrão intervalar.',
      choiceSets: [
        [
          'A escala frígio dominante (1-b2-3-4-5-b6-b7) é o 5.º modo da menor harmónica',
          'A escala frígio dominante é simplesmente o modo frígio normal, com a mesma terça menor',
          'O frígio dominante tem uma terça menor',
          'O frígio dominante é uma escala de tons inteiros',
        ],
        [
          'A escala húngara menor tem duas segundas aumentadas, criando a sua sonoridade dramática distintiva',
          'A escala húngara menor não tem nenhuma segunda aumentada: é apenas a escala menor natural com outro nome',
          'A húngara menor não tem intervalos aumentados',
          'A húngara menor é igual à menor melódica',
        ],
        [
          'Existem apenas duas escalas de tons inteiros diferentes: em C e em Db',
          'Existem doze escalas de tons inteiros diferentes, uma a começar em cada nota cromática',
          'A escala de tons inteiros tem 7 notas',
          'Contém uma quinta perfeita',
        ],
        [
          'A escala diminuta alterna meios-tons e tons, o que dá 8 notas numa oitava',
          'A escala diminuta alterna tons e terças menores, o que lhe dá 7 notas, como a escala maior',
          'É uma escala pentatónica',
          'Não tem meios-tons',
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
        'Menor com 7.ª M = tríade menor + 7.ª maior. Aumentado com 7.ª M = tríade aumentada (5.ª elevada) + 7.ª maior. Constrói a partir de {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as famílias de acordes é verdadeira?',
      hintTemplate:
        'As extensões (9, 11, 13) implicam a sétima; as notas acrescentadas (add9, 6) não. Os acordes sus substituem a terça. Um power chord tem apenas fundamental e quinta.',
      choiceSets: [
        [
          'Uma extensão implica a sétima: C9 contém Bb, enquanto Cadd9 não tem sétima nenhuma',
          'Cadd9 e C9 são o mesmo acorde, porque uma nona acrescentada traz sempre consigo a sétima da dominante',
          'C9 não tem terça',
          'Cadd9 contém B',
        ],
        [
          'Um acorde sus4 substitui a terça pela quarta, por isso Csus4 é C-F-G',
          'Um acorde sus4 mantém a terça e acrescenta a quarta acima dela, por isso Csus4 escreve-se C-E-F-G',
          'Csus4 é C-Eb-G',
          'Csus4 é um acorde menor',
        ],
        [
          'Um power chord (C5) tem apenas fundamental e quinta, por isso não é nem maior nem menor',
          'Um power chord (C5) é uma tríade de C maior com a fundamental dobrada, por isso soa sempre maior',
          'C5 contém apenas o 5.º grau',
          'C5 é uma tríade de C menor',
        ],
        [
          'O acorde menor com 7.ª maior é uma tríade menor com sétima maior: C-Eb-G-B',
          'O acorde menor com 7.ª maior é uma tríade maior com sétima menor, ou seja, a sétima da dominante C-E-G-Bb',
          'O acorde menor com 7.ª maior tem uma sétima menor, por isso é o mesmo acorde que Cm7',
          'O acorde menor com 7.ª maior é C-E-G#-B, uma tríade aumentada com sétima maior',
        ],
      ],
    },
  ],

};

export default overlay;
