import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 7 exercise templates
// 16 modules, ~85 generated exercises
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 21: Harmonia Jazz
  // =========================================================================

  // ---- l7u21m1: Cifras de Jazz e Extensoes ----
  l7u21m1: [
    {
      // chord_build
      promptTemplate:
        'Constroi um acorde de {root} {quality}. Seleciona todas as notas necessarias para este acorde com extensoes.',
      hintTemplate:
        'As extensoes de jazz empilham tercas acima da setima: nona = segunda uma oitava acima, decima primeira = quarta acima, decima terceira = sexta acima. Constroi a partir de {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Decifra esta cifra de jazz.',
      hintTemplate:
        'Cifras de jazz: triangulo/maj7 = setima maior, - ou m = menor, 7 = dominante, ° = diminuto, ø = semidiminuto, + = aumentado, sus = suspenso.',
      choiceSets: [
        [
          'C13 implica um acorde de setima dominante com nona, decima primeira (geralmente omitida) e decima terceira adicionadas',
          'C13 tem apenas fundamental e decima terceira',
          'C13 e um acorde de setima maior',
          'C13 implica um acorde menor',
        ],
        [
          'Cmin7(b5) e o mesmo que Cø (Do semidiminuto)',
          'Cmin7(b5) e um acorde totalmente diminuto',
          'Cmin7(b5) e um acorde de setima menor',
          'A b5 torna-o um acorde aumentado',
        ],
        [
          'C7(#9) e um acorde dominante com nona aumentada, frequentemente chamado o "acorde de Hendrix"',
          'C7(#9) e um acorde de setima maior',
          'A #9 significa que a nona e elevada acima de uma nona maior',
          'C7(#9) nao tem setima',
        ],
      ],
    },
  ],

  // ---- l7u21m2: Voicings de Shell ----
  l7u21m2: [
    {
      // multiple_choice — o EN e uma pergunta de escolha multipla, nao um chord_build
      promptTemplate:
        'Qual conjunto de tres notas e o voicing de shell correto?',
      hintTemplate:
        'Um voicing de shell usa apenas fundamental, terca e setima — a quinta e omitida. A terca define a qualidade do acorde (maior/menor); a setima define o tipo de acorde de setima (maj7 / m7 / dom7).',
      choiceSets: [
        [
          'Shell de Cmaj7: C, E, B',
          'Cmaj7 completo: C, E, G, B',
          'Cmaj7 sem a terca: C, G, B',
          'Cmaj7 sem a setima: C, E, G',
        ],
        [
          'Shell de Dm7: D, F, C',
          'Dm7 completo: D, F, A, C',
          'Dm7 sem a terca: D, A, C',
          'Dm7 sem a setima: D, F, A',
        ],
        [
          'Shell de G7: G, B, F',
          'G7 completo: G, B, D, F',
          'G7 sem a terca: G, D, F',
          'G7 sem a setima: G, B, D',
        ],
        [
          'Shell de Fmaj7: F, A, E',
          'Fmaj7 completo: F, A, C, E',
          'Fmaj7 sem a terca: F, C, E',
          'Fmaj7 sem a setima: F, A, C',
        ],
        [
          'Shell de Am7: A, C, G',
          'Am7 completo: A, C, E, G',
          'Am7 sem a terca: A, E, G',
          'Am7 sem a setima: A, C, E',
        ],
        [
          'Shell de E7: E, G#, D',
          'E7 completo: E, G#, B, D',
          'E7 sem a terca: E, B, D',
          'E7 sem a setima: E, G#, B',
        ],
        [
          'Shell de Bbmaj7: Bb, D, A',
          'Bbmaj7 completo: Bb, D, F, A',
          'Bbmaj7 sem a terca: Bb, F, A',
          'Bbmaj7 sem a setima: Bb, D, F',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Como se ligam os voicings de shell num contexto jazz?',
      hintTemplate:
        'Num ii-V-I, a terca de um acorde torna-se a setima do seguinte e vice-versa. Esta eficiencia na conducao de vozes chama-se linhas de guide tones.',
      choiceSets: [
        [
          'Os guide tones (tercas e setimas) ligam-se suavemente por grau conjunto entre acordes num ii-V-I',
          'Os voicings de shell requerem grandes saltos entre acordes',
          'Os guide tones sao a fundamental e a quinta',
          'A conducao de vozes nao importa no jazz',
        ],
        [
          'A terca do ii torna-se a setima do V, e a setima do ii torna-se a terca do V',
          'Todas as notas se mantem iguais entre ii e V',
          'A fundamental do ii torna-se a fundamental do V',
          'Nao existe ligacao na conducao de vozes entre ii e V',
        ],
      ],
    },
  ],

  // ---- l7u21m3: Progressao ii-V-I ----
  l7u21m3: [
    {
      // chord_build
      promptTemplate:
        'Constroi um acorde de setima menor sobre {root} — o som ii7 de uma progressao ii-V-I.',
      hintTemplate:
        'Um ii7 e um acorde de setima menor sobre {root}: fundamental + 3.a menor + 5.a perfeita + 7.a menor. No jazz, a ii-V-I e a progressao mais fundamental.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Analisa a progressao ii-V-I neste contexto.',
      hintTemplate:
        'ii-V-I em maior: m7 -> dom7 -> maj7. Em menor: m7b5 -> dom7(b9) -> m(maj7). Esta e a espinha dorsal da harmonia jazz.',
      choiceSets: [
        [
          'Em tonalidades menores, o acorde ii e semidiminuto (m7b5)',
          'Em tonalidades menores, o acorde ii e um m7',
          'As tonalidades menores nao usam ii-V-I',
          'O ii em menor e um maj7',
        ],
        [
          'A ii-V-I pode ser usada para tonicizar qualquer acorde, criando centros tonais transitórios',
          'A ii-V-I so funciona na tonalidade principal',
          'A ii-V-I nao pode criar tonicizacao',
          'Apenas V-I cria tonicizacao no jazz',
        ],
      ],
    },
  ],

  // ---- l7u21m4: Substituicao Tritonica ----
  l7u21m4: [
    {
      // chord_build
      promptTemplate:
        'Constroi a substituicao tritonica para o acorde dominante 7 sobre {root}. Substitui-o por um dom7 a um tritono de distancia.',
      hintTemplate:
        'A substituicao tritonica substitui um dom7 por outro dom7 cuja fundamental esta a um tritono (6 semitons) de distancia. Ambos partilham os mesmos guide tones (a terca e a setima trocam).',
    },
    {
      // multiple_choice
      promptTemplate:
        'Explica por que funciona a substituicao tritonica.',
      hintTemplate:
        'Dois dom7 a um tritono de distancia partilham o mesmo intervalo de tritono (a terca e a setima trocam). Isto cria movimento cromatico do baixo: bII7 -> I em vez de V7 -> I.',
      choiceSets: [
        [
          'A terca e a setima do V7 original tornam-se a setima e a terca da substituicao tritonica',
          'As substituicoes tritonicas partilham a mesma fundamental',
          'Os dois acordes nao partilham notas comuns',
          'As substituicoes tritonicas so funcionam em tonalidades menores',
        ],
        [
          'A substituicao tritonica cria uma linha cromatica de baixo: bII -> I (resolucao por meio-tom)',
          'O baixo move-se por um tom',
          'O baixo salta sempre uma quinta',
          'O movimento do baixo e o mesmo que V-I',
        ],
      ],
    },
  ],

  // ---- l7u21m5: Formas de Blues ----
  l7u21m5: [
    {
      // scale_build
      promptTemplate:
        'Constroi a escala de {root} {scaleType} usada na improvisacao blues.',
      hintTemplate:
        'A escala blues: fundamental, b3, 4, b5, 5, b7 (6 notas). A pentatonica menor: fundamental, b3, 4, 5, b7 (5 notas). Constroi a partir de {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Analisa a estrutura de uma forma de blues.',
      hintTemplate:
        'O blues de 12 compassos: I7 (4 compassos), IV7 (2 compassos), I7 (2 compassos), V7 (1), IV7 (1), I7 (2). O jazz blues acrescenta movimento ii-V e substituicoes tritonicas.',
      choiceSets: [
        [
          'O blues basico de 12 compassos usa I7, IV7 e V7 como acordes primarios',
          'O blues de 12 compassos usa apenas acordes de setima maior',
          'O blues de 12 compassos tem 16 compassos',
          'A forma de blues usa apenas o acorde I',
        ],
        [
          'O jazz blues acrescenta frequentemente um ii-V ao compasso 4 (a apontar para IV7) e aos compassos 9-10 (a apontar para I)',
          'O jazz blues remove todos os acordes dominantes',
          'O jazz blues nunca modifica a forma basica',
          'O jazz blues usa os mesmos acordes do blues basico',
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
        'Rhythm changes (de Gershwin): forma AABA, 32 compassos. Seccoes A: turnarounds I-vi-ii-V. Ponte: III7-VI7-II7-V7 (ciclo de dominantes).',
      choiceSets: [
        [
          'A seccao A dos rhythm changes e construida sobre turnarounds I-vi-ii-V em Sib maior',
          'Os rhythm changes usam a forma de blues de 12 compassos',
          'A seccao A e em Do maior',
          'Os rhythm changes nao tem tonalidade padrao',
        ],
        [
          'A ponte dos rhythm changes usa um ciclo de acordes de setima dominante a descer por quintas',
          'A ponte mantem-se num so acorde',
          'A ponte usa acordes m7',
          'A ponte e identica a seccao A',
        ],
        [
          'A forma dos rhythm changes e AABA, num total de 32 compassos',
          'Os rhythm changes tem 12 compassos',
          'Os rhythm changes tem forma ABAB',
          'Os rhythm changes nao tem forma fixa',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 22: Harmonia Modal e Pop
  // =========================================================================

  // ---- l7u22m1: Escalas Modais e Caracteristicas ----
  l7u22m1: [
    {
      // scale_build — 'o modo X de {root}': {scaleType} renderiza nomes
      // masculinos (dorico, lidio...) que nao concordam com 'a escala'
      promptTemplate:
        'Constroi o modo {scaleType} de {root}.',
      hintTemplate:
        'Os modos: jonio (maior), dorico (b3, b7), frigio (b2, b3, b6, b7), lidio (#4), mixolidio (b7), eolio (menor natural), locrio (b2, b3, b5, b6, b7).',
    },
  ],

  // ---- l7u22m2: Harmonia Modal e Vamps ----
  l7u22m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica o acorde ou vamp caracteristico que estabelece este modo.',
      hintTemplate:
        'Cada modo tem uma nota caracteristica que o distingue. Dorico: sexta natural. Frigio: b2. Lidio: #4. Mixolidio: b7. Os vamps modais enfatizam estas notas.',
      choiceSets: [
        [
          'O dorico distingue-se do menor natural pela sua sexta elevada (natural)',
          'O dorico tem uma setima elevada',
          'O dorico tem uma quarta rebaixada',
          'O dorico e identico ao menor natural',
        ],
        [
          'O lidio distingue-se do maior pela sua quarta elevada (#4)',
          'O lidio tem uma setima rebaixada',
          'O lidio tem uma terca rebaixada',
          'O lidio e identico ao maior',
        ],
        [
          'Um vamp em Re dorico (Dm7 - G7) enfatiza a sexta natural (Si natural sobre Re)',
          'Re dorico usa Sib',
          'Os vamps em Re dorico usam apenas um acorde',
          'Os vamps doricos evitam o 6.o grau',
        ],
        [
          'O frigio caracteriza-se pelo intervalo de b2, dando-lhe um sabor espanhol/flamenco',
          'O frigio soa identico ao maior',
          'O frigio tem uma quarta elevada',
          'O frigio e o modo mais brilhante',
        ],
      ],
    },
  ],

  // ---- l7u22m3: Intercambio Modal no Pop ----
  l7u22m3: [
    {
      // chord_build
      promptTemplate:
        'Constroi uma triade {quality} sobre {root} — um acorde que a musica pop empresta de um modo paralelo.',
      hintTemplate:
        'A musica pop empresta frequentemente acordes de modos paralelos: bVII do mixolidio, bIII do dorico/menor, iv do eolio. Constroi uma triade {quality} sobre {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica a mistura modal usada nesta progressao pop.',
      hintTemplate:
        'Mistura modal comum no pop: I - bVII - IV (bVII mixolidio), I - bVI - bVII (bVI e bVII eolios), I - iv (iv eolio).',
      choiceSets: [
        [
          'O acorde bVII numa tonalidade maior e emprestado do modo mixolidio',
          'bVII vem do modo lidio',
          'bVII e um acorde diatonico em maior',
          'bVII e emprestado do locrio',
        ],
        [
          'O acorde iv numa tonalidade maior e emprestado do paralelo menor (eolio)',
          'iv e diatonico em tonalidades maiores',
          'iv e emprestado do lidio',
          'iv nao existe como acorde emprestado',
        ],
      ],
    },
  ],

  // ---- l7u22m4: Progressoes Pop (Numeros de Nashville) ----
  l7u22m4: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa esta progressao pop comum.',
      hintTemplate:
        'Sistema de numeros de Nashville usa graus da escala: 1=I, 4=IV, 5=V, 6m=vi. Comuns: 1-5-6m-4, 1-4-5-1, 6m-4-1-5.',
      choiceSets: [
        [
          'I-V-vi-IV e a progressao pop mais comum, usada em centenas de musicas',
          'I-V-vi-IV e exclusiva da musica classica',
          'Esta progressao e raramente usada no pop',
          'I-V-vi-IV soa sempre igual em todas as tonalidades',
        ],
        [
          'vi-IV-I-V e a rotacao "sensitive" da mesma progressao I-V-vi-IV',
          'vi-IV-I-V e uma progressao inteiramente diferente',
          'vi-IV-I-V nao funciona como progressao pop',
          'Comecar no vi torna-a uma progressao em tonalidade menor',
        ],
        [
          'O sistema de numeros de Nashville representa acordes por numero de grau da escala para transposicao facil',
          'Os numeros de Nashville representam alturas especificas',
          'Os numeros de Nashville sao apenas para musica country',
          'Os numeros de Nashville substituem a notacao tradicional inteiramente',
        ],
      ],
    },
  ],

  // ---- l7u22m5: Planing e Harmonia Quartal ----
  l7u22m5: [
    {
      // multiple_choice
      promptTemplate:
        'Descreve esta tecnica harmonica usada em contextos modernos e de jazz.',
      hintTemplate:
        'Planing: mover uma forma de acorde em paralelo (diatonico ou cromatico). Harmonia quartal: acordes construidos de quartas empilhadas em vez de tercas, comuns no jazz e na musica modal.',
      choiceSets: [
        [
          'A harmonia quartal empilha quartas perfeitas em vez de tercas, criando um som aberto e ambiguo',
          'A harmonia quartal usa apenas tercas maiores',
          'A harmonia quartal e o mesmo que a harmonia triadica tradicional',
          'Os acordes quartais sao sempre dissonantes',
        ],
        [
          'O planing (paralelismo) move um voicing para cima ou para baixo mantendo os mesmos intervalos',
          'O planing usa sempre movimento contrario',
          'O planing e proibido em todos os estilos musicais',
          'O planing altera a qualidade do acorde em cada passo',
        ],
        [
          'O planing diatonico mantem todas as notas dentro da tonalidade; o planing cromatico mantem os intervalos exatos',
          'O planing diatonico e cromatico sao identicos',
          'O planing cromatico mantem-se dentro de uma tonalidade',
          'O planing diatonico usa todas as 12 notas cromaticas',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 23: Taxonomia de Escalas e Acordes
  // =========================================================================

  // ---- l7u23m1: Escalas Pentatonicas e Blues ----
  l7u23m1: [
    {
      // scale_build
      promptTemplate:
        'Constroi a escala de {root} {scaleType}.',
      hintTemplate:
        'Pentatonica maior: 1-2-3-5-6 (5 notas). Pentatonica menor: 1-b3-4-5-b7 (5 notas). Blues: 1-b3-4-b5-5-b7 (6 notas). Constroi a partir de {root}.',
    },
  ],

  // ---- l7u23m2: Escalas Simetricas ----
  l7u23m2: [
    {
      // scale_build
      promptTemplate:
        'Constroi a escala de {root} {scaleType}.',
      hintTemplate:
        'Tons inteiros: todos os tons (6 notas). Cromatica: todos os meios-tons (12 notas). Sao escalas simetricas — soam iguais a partir de qualquer nota inicial dentro da escala.',
    },
  ],

  // ---- l7u23m3: Escalas Bebop e Jazz ----
  l7u23m3: [
    {
      // scale_build — 'o modo X de {root}': {scaleType} renderiza nomes
      // masculinos (dorico, mixolidio) que nao concordam com 'a escala'
      promptTemplate:
        'Constroi o modo {scaleType} de {root}.',
      hintTemplate:
        'Dorico: 1-2-b3-4-5-6-b7 (7 notas). Mixolidio: 1-2-3-4-5-6-b7 (7 notas). Estes modos sao a base de muitas improvisacoes jazz.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Que escala funciona melhor sobre este tipo de acorde?',
      hintTemplate:
        'm7 -> dorico. dom7 -> mixolidio. maj7 -> jonio ou lidio. m7b5 -> locrio. dim7 -> diminuta (TmT). dom alt -> escala alterada.',
      choiceSets: [
        [
          'O dorico e a escolha de escala primaria para acordes m7 no jazz',
          'O jonio e a escolha padrao para acordes m7',
          'O locrio e usado sobre acordes m7',
          'O lidio e a escolha padrao para acordes m7',
        ],
        [
          'O mixolidio e a escolha de escala primaria para acordes de setima dominante',
          'O dorico e usado sobre acordes de setima dominante',
          'O eolio e a escolha padrao para acordes de setima dominante',
          'O frigio e a escolha padrao para acordes de setima dominante',
        ],
      ],
    },
  ],

  // ---- l7u23m4: Teoria Acorde-Escala ----
  l7u23m4: [
    {
      // multiple_choice
      promptTemplate:
        'Emparelha o tipo de acorde com a sua escala primaria na teoria acorde-escala.',
      hintTemplate:
        'Teoria acorde-escala: cada acorde tem uma escala-mae. As notas a evitar sao meios-tons acima das notas do acorde. A escala colore o acorde com tensoes disponiveis.',
      choiceSets: [
        [
          'O lidio e frequentemente preferido ao jonio para acordes maj7 porque nao tem notas a evitar',
          'O jonio nao tem notas a evitar sobre maj7',
          'O locrio e preferido para acordes maj7',
          'As notas a evitar sao irrelevantes na teoria acorde-escala',
        ],
        [
          'Uma "nota a evitar" e um grau da escala que choca (esta a um meio-tom acima) de uma nota do acorde',
          'Uma nota a evitar e qualquer nota que nao esta no acorde',
          'As notas a evitar criam consonancia',
          'Nao existem notas a evitar em nenhuma escala',
        ],
        [
          'O locrio e a escala primaria para acordes semidiminutos (m7b5)',
          'O dorico e usado para acordes semidiminutos',
          'O mixolidio e usado para acordes semidiminutos',
          'Os acordes semidiminutos nao tem escala associada',
        ],
      ],
    },
  ],

  // ---- l7u23m5: Escalas Exoticas e Nao Ocidentais ----
  l7u23m5: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica esta escala ou o seu contexto cultural.',
      hintTemplate:
        'A menor harmonica tem um som "exotico" devido a segunda aumentada. O frigio dominante (5.o modo da menor harmonica) e usado no flamenco e na musica do Medio Oriente.',
      choiceSets: [
        [
          'A escala frigio dominante (1-b2-3-4-5-b6-b7) e o 5.o modo da menor harmonica',
          'O frigio dominante e igual ao frigio normal',
          'O frigio dominante tem uma terca menor',
          'O frigio dominante e uma escala de tons inteiros',
        ],
        [
          'A escala hungara menor tem duas segundas aumentadas, criando a sua sonoridade dramatica distintiva',
          'A hungara menor e identica ao menor natural',
          'A hungara menor nao tem intervalos aumentados',
          'A hungara menor e igual a menor melodica',
        ],
        [
          'A escala japonesa Hirajoshi e uma escala de 5 notas com uma qualidade menor distinta',
          'A Hirajoshi e uma escala de 7 notas',
          'A Hirajoshi e identica a escala maior ocidental',
          'A Hirajoshi usa quartos de tom',
        ],
      ],
    },
  ],
};

export default overlay;
