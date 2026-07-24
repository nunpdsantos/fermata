import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 7 exercise templates
// 16 modules, ~85 generated exercises
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
        'Constrói um acorde de {root} {quality}. Seleciona todas as notas necessárias para este acorde com extensões.',
      hintTemplate:
        'As extensões de jazz empilham terças acima da sétima: nona = segunda uma oitava acima, décima primeira = quarta acima, décima terceira = sexta acima. Constrói a partir de {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Decifra esta cifra de jazz.',
      hintTemplate:
        'Cifras de jazz: triângulo/maj7 = sétima maior, - ou m = menor, 7 = dominante, ° = diminuto, ø = semidiminuto, + = aumentado, sus = suspenso.',
      choiceSets: [
        [
          'C13 implica um acorde de sétima dominante com nona, décima primeira (geralmente omitida) e décima terceira adicionadas',
          'C13 tem apenas fundamental e décima terceira',
          'C13 é um acorde de sétima maior',
          'C13 implica um acorde menor',
        ],
        [
          'Cmin7(b5) é o mesmo que Cø (Dó semidiminuto)',
          'Cmin7(b5) é um acorde totalmente diminuto',
          'Cmin7(b5) é um acorde de sétima menor',
          'A b5 torna-o um acorde aumentado',
        ],
        [
          'C7(#9) é um acorde dominante com nona aumentada, frequentemente chamado o "acorde de Hendrix"',
          'C7(#9) é um acorde de sétima maior',
          'A #9 significa que a nona é elevada acima de uma nona maior',
          'C7(#9) não tem sétima',
        ],
      ],
    },
  ],

  // ---- l7u21m2: Voicings de Shell ----
  l7u21m2: [
    {
      // multiple_choice — o EN é uma pergunta de escolha múltipla, não um chord_build
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
        'Num ii-V-I, a terça de um acorde torna-se a sétima do seguinte e vice-versa. Esta eficiência na condução de vozes chama-se linhas de guide tones.',
      choiceSets: [
        [
          'Os guide tones (terças e sétimas) ligam-se suavemente por grau conjunto entre acordes num ii-V-I',
          'Os voicings de shell requerem grandes saltos entre acordes',
          'Os guide tones são a fundamental e a quinta',
          'A condução de vozes não importa no jazz',
        ],
        [
          'A terça do ii torna-se a sétima do V, e a sétima do ii torna-se a terça do V',
          'Todas as notas se mantêm iguais entre ii e V',
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
        'Um ii7 é um acorde de sétima menor sobre {root}: fundamental + 3.a menor + 5.a perfeita + 7.a menor. No jazz, a ii-V-I é a progressão mais fundamental.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Analisa a progressão ii-V-I neste contexto.',
      hintTemplate:
        'ii-V-I em maior: m7 -> dom7 -> maj7. Em menor: m7b5 -> dom7(b9) -> m(maj7). Esta é a espinha dorsal da harmonia jazz.',
      choiceSets: [
        [
          'Em tonalidades menores, o acorde ii é semidiminuto (m7b5)',
          'Em tonalidades menores, o acorde ii é um m7',
          'As tonalidades menores não usam ii-V-I',
          'O ii em menor é um maj7',
        ],
        [
          'A ii-V-I pode ser usada para tonicizar qualquer acorde, criando centros tonais transitórios',
          'A ii-V-I só funciona na tonalidade principal',
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
        'Constrói a substituição tritónica para o acorde dominante 7 sobre {root}. Substitui-o por um dom7 a um trítono de distância.',
      hintTemplate:
        'A substituição tritónica substitui um dom7 por outro dom7 cuja fundamental está a um trítono (6 semitons) de distância. Ambos partilham os mesmos guide tones (a terça e a sétima trocam).',
    },
    {
      // multiple_choice
      promptTemplate:
        'Explica por que funciona a substituição tritónica.',
      hintTemplate:
        'Dois dom7 a um trítono de distância partilham o mesmo intervalo de trítono (a terça e a sétima trocam). Isto cria movimento cromático do baixo: bII7 -> I em vez de V7 -> I.',
      choiceSets: [
        [
          'A terça e a sétima do V7 original tornam-se a sétima e a terça da substituição tritónica',
          'As substituições tritónicas partilham a mesma fundamental',
          'Os dois acordes não partilham notas comuns',
          'As substituições tritónicas só funcionam em tonalidades menores',
        ],
        [
          'A substituição tritónica cria uma linha cromática de baixo: bII -> I (resolução por meio-tom)',
          'O baixo move-se por um tom',
          'O baixo salta sempre uma quinta',
          'O movimento do baixo é o mesmo que V-I',
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
          'O blues básico de 12 compassos usa I7, IV7 e V7 como acordes primários',
          'O blues de 12 compassos usa apenas acordes de sétima maior',
          'O blues de 12 compassos tem 16 compassos',
          'A forma de blues usa apenas o acorde I',
        ],
        [
          'O jazz blues acrescenta frequentemente um ii-V ao compasso 4 (a apontar para IV7) e aos compassos 9-10 (a apontar para I)',
          'O jazz blues remove todos os acordes dominantes',
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
          'A secção A dos rhythm changes é construída sobre turnarounds I-vi-ii-V em Sib maior',
          'Os rhythm changes usam a forma de blues de 12 compassos',
          'A secção A é em Dó maior',
          'Os rhythm changes não têm tonalidade padrão',
        ],
        [
          'A ponte dos rhythm changes usa um ciclo de acordes de sétima dominante a descer por quintas',
          'A ponte mantém-se num só acorde',
          'A ponte usa acordes m7',
          'A ponte é idêntica à secção A',
        ],
        [
          'A forma dos rhythm changes é AABA, num total de 32 compassos',
          'Os rhythm changes têm 12 compassos',
          'Os rhythm changes têm forma ABAB',
          'Os rhythm changes não têm forma fixa',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 22: Harmonia Modal e Pop
  // =========================================================================

  // ---- l7u22m1: Escalas Modais e Características ----
  l7u22m1: [
    {
      // scale_build — 'o modo X de {root}': {scaleType} renderiza nomes
      // masculinos (dórico, lídio...) que não concordam com 'a escala'
      promptTemplate:
        'Constrói o modo {scaleType} de {root}.',
      hintTemplate:
        'Os modos: jónio (maior), dórico (b3, b7), frígio (b2, b3, b6, b7), lídio (#4), mixolídio (b7), eólio (menor natural), lócrio (b2, b3, b5, b6, b7).',
    },
  ],

  // ---- l7u22m2: Harmonia Modal e Vamps ----
  l7u22m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica o acorde ou vamp característico que estabelece este modo.',
      hintTemplate:
        'Cada modo tem uma nota característica que o distingue. Dórico: sexta natural. Frígio: b2. Lídio: #4. Mixolídio: b7. Os vamps modais enfatizam estas notas.',
      choiceSets: [
        [
          'O dórico distingue-se do menor natural pela sua sexta elevada (natural)',
          'O dórico tem uma sétima elevada',
          'O dórico tem uma quarta rebaixada',
          'O dórico é idêntico ao menor natural',
        ],
        [
          'O lídio distingue-se do maior pela sua quarta elevada (#4)',
          'O lídio tem uma sétima rebaixada',
          'O lídio tem uma terça rebaixada',
          'O lídio é idêntico ao maior',
        ],
        [
          'Um vamp em Ré dórico (Dm7 - G7) enfatiza a sexta natural (Si natural sobre Ré)',
          'Ré dórico usa Sib',
          'Os vamps em Ré dórico usam apenas um acorde',
          'Os vamps dóricos evitam o 6.o grau',
        ],
        [
          'O frígio caracteriza-se pelo intervalo de b2, dando-lhe um sabor espanhol/flamenco',
          'O frígio soa idêntico ao maior',
          'O frígio tem uma quarta elevada',
          'O frígio é o modo mais brilhante',
        ],
      ],
    },
  ],

  // ---- l7u22m3: Intercâmbio Modal no Pop ----
  l7u22m3: [
    {
      // chord_build
      promptTemplate:
        'Constrói uma tríade {quality} sobre {root} — um acorde que a música pop empresta de um modo paralelo.',
      hintTemplate:
        'A música pop empresta frequentemente acordes de modos paralelos: bVII do mixolídio, bIII do dórico/menor, iv do eólio. Constrói uma tríade {quality} sobre {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica a mistura modal usada nesta progressão pop.',
      hintTemplate:
        'Mistura modal comum no pop: I - bVII - IV (bVII mixolídio), I - bVI - bVII (bVI e bVII eólios), I - iv (iv eólio).',
      choiceSets: [
        [
          'O acorde bVII numa tonalidade maior é emprestado do modo mixolídio',
          'bVII vem do modo lídio',
          'bVII é um acorde diatónico em maior',
          'bVII é emprestado do lócrio',
        ],
        [
          'O acorde iv numa tonalidade maior é emprestado do paralelo menor (eólio)',
          'iv é diatónico em tonalidades maiores',
          'iv é emprestado do lídio',
          'iv não existe como acorde emprestado',
        ],
      ],
    },
  ],

  // ---- l7u22m4: Progressões Pop (Números de Nashville) ----
  l7u22m4: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa esta progressão pop comum.',
      hintTemplate:
        'Sistema de números de Nashville usa graus da escala: 1=I, 4=IV, 5=V, 6m=vi. Comuns: 1-5-6m-4, 1-4-5-1, 6m-4-1-5.',
      choiceSets: [
        [
          'I-V-vi-IV é a progressão pop mais comum, usada em centenas de músicas',
          'I-V-vi-IV é exclusiva da música clássica',
          'Esta progressão é raramente usada no pop',
          'I-V-vi-IV soa sempre igual em todas as tonalidades',
        ],
        [
          'vi-IV-I-V é a rotação "sensitive" da mesma progressão I-V-vi-IV',
          'vi-IV-I-V é uma progressão inteiramente diferente',
          'vi-IV-I-V não funciona como progressão pop',
          'Começar no vi torna-a uma progressão em tonalidade menor',
        ],
        [
          'O sistema de números de Nashville representa acordes por número de grau da escala para transposição fácil',
          'Os números de Nashville representam alturas específicas',
          'Os números de Nashville são apenas para música country',
          'Os números de Nashville substituem a notação tradicional inteiramente',
        ],
      ],
    },
  ],

  // ---- l7u22m5: Planing e Harmonia Quartal ----
  l7u22m5: [
    {
      // multiple_choice
      promptTemplate:
        'Descreve esta técnica harmónica usada em contextos modernos e de jazz.',
      hintTemplate:
        'Planing: mover uma forma de acorde em paralelo (diatónico ou cromático). Harmonia quartal: acordes construídos de quartas empilhadas em vez de terças, comuns no jazz e na música modal.',
      choiceSets: [
        [
          'A harmonia quartal empilha quartas perfeitas em vez de terças, criando um som aberto e ambíguo',
          'A harmonia quartal usa apenas terças maiores',
          'A harmonia quartal é o mesmo que a harmonia triádica tradicional',
          'Os acordes quartais são sempre dissonantes',
        ],
        [
          'O planing (paralelismo) move um voicing para cima ou para baixo mantendo os mesmos intervalos',
          'O planing usa sempre movimento contrário',
          'O planing é proibido em todos os estilos musicais',
          'O planing altera a qualidade do acorde em cada passo',
        ],
        [
          'O planing diatónico mantém todas as notas dentro da tonalidade; o planing cromático mantém os intervalos exatos',
          'O planing diatónico e cromático são idênticos',
          'O planing cromático mantém-se dentro de uma tonalidade',
          'O planing diatónico usa todas as 12 notas cromáticas',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 23: Taxonomia de Escalas e Acordes
  // =========================================================================

  // ---- l7u23m1: Escalas Pentatónicas e Blues ----
  l7u23m1: [
    {
      // scale_build
      promptTemplate:
        'Constrói a escala de {root} {scaleType}.',
      hintTemplate:
        'Pentatónica maior: 1-2-3-5-6 (5 notas). Pentatónica menor: 1-b3-4-5-b7 (5 notas). Blues: 1-b3-4-b5-5-b7 (6 notas). Constrói a partir de {root}.',
    },
  ],

  // ---- l7u23m2: Escalas Simétricas ----
  l7u23m2: [
    {
      // scale_build
      promptTemplate:
        'Constrói a escala de {root} {scaleType}.',
      hintTemplate:
        'Tons inteiros: todos os tons (6 notas). Cromática: todos os meios-tons (12 notas). São escalas simétricas — soam iguais a partir de qualquer nota inicial dentro da escala.',
    },
  ],

  // ---- l7u23m3: Escalas Bebop e Jazz ----
  l7u23m3: [
    {
      // scale_build — 'o modo X de {root}': {scaleType} renderiza nomes
      // masculinos (dórico, mixolídio) que não concordam com 'a escala'
      promptTemplate:
        'Constrói o modo {scaleType} de {root}.',
      hintTemplate:
        'Dórico: 1-2-b3-4-5-6-b7 (7 notas). Mixolídio: 1-2-3-4-5-6-b7 (7 notas). Estes modos são a base de muitas improvisações jazz.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Que escala funciona melhor sobre este tipo de acorde?',
      hintTemplate:
        'm7 -> dórico. dom7 -> mixolídio. maj7 -> jónio ou lídio. m7b5 -> lócrio. dim7 -> diminuta (TmT). dom alt -> escala alterada.',
      choiceSets: [
        [
          'O dórico é a escolha de escala primária para acordes m7 no jazz',
          'O jónio é a escolha padrão para acordes m7',
          'O lócrio é usado sobre acordes m7',
          'O lídio é a escolha padrão para acordes m7',
        ],
        [
          'O mixolídio é a escolha de escala primária para acordes de sétima dominante',
          'O dórico é usado sobre acordes de sétima dominante',
          'O eólio é a escolha padrão para acordes de sétima dominante',
          'O frígio é a escolha padrão para acordes de sétima dominante',
        ],
      ],
    },
  ],

  // ---- l7u23m4: Teoria Acorde-Escala ----
  l7u23m4: [
    {
      // multiple_choice
      promptTemplate:
        'Emparelha o tipo de acorde com a sua escala primária na teoria acorde-escala.',
      hintTemplate:
        'Teoria acorde-escala: cada acorde tem uma escala-mãe. As notas a evitar são meios-tons acima das notas do acorde. A escala colore o acorde com tensões disponíveis.',
      choiceSets: [
        [
          'O lídio é frequentemente preferido ao jónio para acordes maj7 porque não tem notas a evitar',
          'O jónio não tem notas a evitar sobre maj7',
          'O lócrio é preferido para acordes maj7',
          'As notas a evitar são irrelevantes na teoria acorde-escala',
        ],
        [
          'Uma "nota a evitar" é um grau da escala que choca (está a um meio-tom acima) de uma nota do acorde',
          'Uma nota a evitar é qualquer nota que não está no acorde',
          'As notas a evitar criam consonância',
          'Não existem notas a evitar em nenhuma escala',
        ],
        [
          'O lócrio é a escala primária para acordes semidiminutos (m7b5)',
          'O dórico é usado para acordes semidiminutos',
          'O mixolídio é usado para acordes semidiminutos',
          'Os acordes semidiminutos não têm escala associada',
        ],
      ],
    },
  ],

  // ---- l7u23m5: Escalas Exóticas e Não Ocidentais ----
  l7u23m5: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica esta escala ou o seu contexto cultural.',
      hintTemplate:
        'A menor harmónica tem um som "exótico" devido à segunda aumentada. O frígio dominante (5.o modo da menor harmónica) é usado no flamenco e na música do Médio Oriente.',
      choiceSets: [
        [
          'A escala frígio dominante (1-b2-3-4-5-b6-b7) é o 5.o modo da menor harmónica',
          'O frígio dominante é igual ao frígio normal',
          'O frígio dominante tem uma terça menor',
          'O frígio dominante é uma escala de tons inteiros',
        ],
        [
          'A escala húngara menor tem duas segundas aumentadas, criando a sua sonoridade dramática distintiva',
          'A húngara menor é idêntica ao menor natural',
          'A húngara menor não tem intervalos aumentados',
          'A húngara menor é igual à menor melódica',
        ],
        [
          'A escala japonesa Hirajoshi é uma escala de 5 notas com uma qualidade menor distinta',
          'A Hirajoshi é uma escala de 7 notas',
          'A Hirajoshi é idêntica à escala maior ocidental',
          'A Hirajoshi usa quartos de tom',
        ],
      ],
    },
  ],
};

export default overlay;
