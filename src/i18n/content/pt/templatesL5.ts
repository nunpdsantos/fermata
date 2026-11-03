import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 5 exercise templates
// Mirrors templatesL5.ts entry by entry (W4a, 2026-10-31)
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {

  // ---- l5u15m1: Secondary Dominants V/V ----
  l5u15m1: [
    {
      // chord_build
      promptTemplate:
        'Constrói uma tríade maior de {root}.',
      hintTemplate:
        'Uma tríade maior: fundamental + 3.ª maior + 5.ª perfeita. Esta qualidade de acorde é usada para dominantes secundárias como V/V.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre V/V (a dominante da dominante) é verdadeira?',
      hintTemplate:
        'V/V toniciza o acorde dominante. Contém uma alteração cromática (4.º grau elevado) e resolve para V.',
      choiceSets: [
        [
          'V/V contém o 4.º grau elevado e vai para V',
          'V/V contém o 7.º grau rebaixado e resolve para IV',
          'V/V contém o 4.º grau elevado e resolve para I',
          'V/V só contém notas diatónicas, por isso é o mesmo acorde que ii',
        ],
        [
          'Em C maior, V/V é D maior (D-F#-A), que resolve para G maior',
          'Em C maior, V/V é F maior (F-A-C), que resolve para G maior',
          'Em C maior, V/V é A maior (A-C#-E), que resolve para D menor',
          'Em C maior, V/V é B maior (B-D#-F#), que resolve para C maior',
        ],
      ],
    },
  ],

  // ---- l5u15m2: Secondary Dominants of ii, iii, IV, vi ----
  l5u15m2: [
    {
      // chord_build
      promptTemplate:
        'Constrói um acorde de dominante de sétima em {root} (uma forma muito comum de dominante secundária).',
      hintTemplate:
        'Uma dominante secundária é uma tríade maior ou uma sétima de dominante construída uma 5.ª perfeita acima do acorde que toniciza. Aqui constrói apenas {root}7: fundamental + 3.ª maior + 5.ª perfeita + 7.ª menor. Por exemplo, A7 (A-C#-E-G) é V7/ii em C maior, tonicizando D menor.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as dominantes secundárias de ii, iii, IV e vi é verdadeira?',
      hintTemplate:
        'Cada dominante secundária aponta para um acorde diatónico específico. V7/ii resolve para ii, V7/IV resolve para IV, V7/vi resolve para vi, etc.',
      choiceSets: [
        [
          'V7/vi em C maior é E7 (E-G#-B-D), que resolve para A menor',
          'V7/vi em C maior é D7 (D-F#-A-C), que resolve para G maior',
          'V7/vi em C maior é E7 (E-G#-B-D), que resolve para F maior',
          'V7/vi em C maior é A7 (A-C#-E-G), que resolve para D menor',
        ],
        [
          'V7/IV em C maior é C7 (C-E-G-Bb), que leva a F maior',
          'V7/IV em C maior é F7 (F-A-C-Eb), que resolve para Bb maior',
          'V7/IV em C maior é C7 (C-E-G-Bb), que resolve para G maior',
          'V7/IV em C maior é G7 (G-B-D-F), que resolve para C maior',
        ],
        [
          'V7/ii em C maior é A7 (A-C#-E-G), que leva a D menor',
          'V7/ii em C maior é B7 (B-D#-F#-A), que resolve para E menor',
          'V7/ii em C maior é A7 (A-C#-E-G), que resolve para C maior',
          'V7/ii em C maior é D7 (D-F#-A-C), que resolve para G maior',
        ],
      ],
    },
  ],

  // ---- l5u15m3: Secondary Leading-Tone Chords ----
  l5u15m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre os acordes de sensível secundária é verdadeira?',
      hintTemplate:
        'Acordes de sensível secundária (vii°/x) funcionam como dominantes secundárias mas são diminutos. Resolvem meio-tom acima para o acorde alvo.',
      choiceSets: [
        [
          'vii°7/V em C maior é F#dim7, que sobe para G',
          'vii°7/V em C maior é Bdim7, que resolve subindo para C',
          'vii°7/V em C maior é F#dim7, que resolve descendo para F',
          'vii°7/V em C maior é C#dim7, que resolve subindo para D',
        ],
        [
          'A sua fundamental fica meio-tom abaixo do acorde para que resolvem',
          'A sua fundamental fica uma 5.ª perfeita acima do acorde para que resolvem',
          'A sua fundamental fica um tom abaixo do acorde para que resolvem',
          'A sua fundamental fica uma 3.ª maior abaixo do acorde para que resolvem',
        ],
        [
          'Pode ser uma tríade diminuta, uma 7.ª meio-diminuta ou uma 7.ª diminuta',
          'É uma tríade maior ou um acorde de sétima dominante, como a dominante secundária que substitui',
          'É uma 7.ª meio-diminuta construída sobre a fundamental do acorde alvo',
          'Pode ser uma tríade menor ou uma 7.ª menor construída sobre a sensível do alvo',
        ],
      ],
    },
  ],

  // ---- l5u15m4: Tonicization vs Modulation ----
  l5u15m4: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre tonicização e modulação é verdadeira?',
      hintTemplate:
        'Tonicização é uma ênfase breve e momentânea num acorde não-tónica (durando 1-2 acordes). Modulação é uma mudança mais permanente para uma nova tonalidade (confirmada por uma cadência na nova tonalidade).',
      choiceSets: [
        [
          'A tonicização realça brevemente um acorde; a modulação confirma uma nova tonalidade com uma cadência',
          'A tonicização confirma uma nova tonalidade com uma cadência; a modulação realça brevemente um acorde',
          'Tonicização e modulação são dois nomes para exatamente o mesmo processo',
          'A modulação nunca usa acordes cromáticos; a tonicização usa-os sempre',
        ],
        [
          'Uma única dominante secundária e o seu alvo são uma tonicização',
          'Uma única dominante secundária e o seu alvo são uma modulação na nova tonalidade',
          'Uma tonicização tem de durar pelo menos oito compassos na nova tonalidade',
          'Uma tonicização precisa de uma cadência perfeita na nova tonalidade',
        ],
        [
          'Uma modulação confirma-se quando a música faz uma cadência na nova tonalidade',
          'Uma modulação confirma-se assim que muda a indicação de compasso',
          'Uma modulação confirma-se por qualquer nota cromática isolada na melodia',
          'Uma modulação confirma-se quando a melodia faz uma cadência na tonalidade original',
        ],
      ],
    },
  ],

  // ---- l5u15m5: Dominant Chains ----
  l5u15m5: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as cadeias de dominantes secundárias é verdadeira?',
      hintTemplate:
        'Uma cadeia de dominantes liga dominantes secundárias: p. ex., V7/vi -> V7/ii -> V7/V -> V7 -> I. Cada dominante resolve para a seguinte, criando movimento cromático em direção à tónica.',
      choiceSets: [
        [
          'Numa cadeia de dominantes, cada acorde funciona como V7 do acorde seguinte',
          'Numa cadeia de dominantes, cada acorde funciona como IV do acorde seguinte',
          'Numa cadeia de dominantes, todos os acordes ficam diatónicos na tonalidade principal',
          'Numa cadeia de dominantes, cada acorde funciona como V7 do acorde que veio antes',
        ],
        [
          'A cadeia V7/vi -> V7/ii -> V7/V -> V -> I move-se por 5.as descendentes',
          'A cadeia V7/vi -> V7/ii -> V7/V -> V -> I move-se por 5.as ascendentes',
          'A cadeia V7/vi -> V7/ii -> V7/V -> V -> I move-se por 3.as ascendentes',
          'A cadeia V7/vi -> V7/ii -> V7/V -> V -> I move-se por graus conjuntos descendentes',
        ],
        [
          'Cada dominante aplicada acrescenta normalmente uma nota cromática: a sensível do seu alvo',
          'Cada dominante aplicada fica diatónica, por isso a cadeia não acrescenta nenhuma nota cromática',
          'Cada dominante aplicada mantém o baixo na mesma nota durante toda a cadeia',
          'Cada dominante aplicada tem de ser tocada na segunda inversão',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unit 16: Modulation
  // =========================================================================

  // ---- l5u16m1: Pivot Chord Modulation ----
  l5u16m1: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a modulação por acorde pivot é verdadeira?',
      hintTemplate:
        'Um acorde pivot pertence tanto à tonalidade antiga como à nova. Reinterpreta um acorde diatónico: p. ex., IV em C = I em F. O pivot é a dobradiça entre duas regiões tonais.',
      choiceSets: [
        [
          'Um acorde pivot é diatónico tanto na tonalidade antiga como na nova',
          'Um acorde pivot é diatónico na tonalidade antiga mas cromático na nova',
          'Um acorde pivot tem de ser sempre o V7 da nova tonalidade, por isso nunca pode ser um acorde menor',
          'Um acorde pivot só pode ligar duas tonalidades menores',
        ],
        [
          'De C para G, o acorde de C maior pode servir de pivot como IV de G',
          'De C para G, o acorde de C maior pode servir de pivot como V de G',
          'De C para G, o acorde de C maior pode servir de pivot como vii° de G',
          'De C para G, o acorde de C maior não pode servir de pivot de todo',
        ],
        [
          'As tonalidades próximas (a um acidente de distância) partilham mais acordes pivot',
          'As tonalidades distantes, a muitos acidentes de distância, partilham mais acordes pivot',
          'Todos os pares de tonalidades partilham exatamente o mesmo número de acordes pivot',
          'As tonalidades paralelas (mesma tónica) partilham sempre mais acordes pivot',
        ],
      ],
    },
  ],

  // ---- l5u16m2: Modulation to Closely Related Keys ----
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
        'Qual destas afirmações sobre as tonalidades próximas é verdadeira?',
      hintTemplate:
        'Cada tonalidade maior tem 5 tonalidades próximas: a dominante, a subdominante e as relativas menores das três (tónica, dominante, subdominante).',
      choiceSets: [
        [
          'As tonalidades próximas de C maior: G maior, F maior, A menor, E menor, D menor',
          'As tonalidades próximas de C maior: D maior, Bb maior, B menor, G menor, F# menor',
          'As tonalidades próximas de C maior: Db maior, B maior, C menor, Bb menor, Eb menor',
          'As tonalidades próximas de C maior: G maior, D maior, A maior, E maior, B maior',
        ],
        [
          'As tonalidades próximas de G maior: D maior, C maior, E menor, B menor, A menor',
          'As tonalidades próximas de G maior: Gb maior, Ab maior, G menor, Eb menor, F menor',
          'As tonalidades próximas de G maior: F maior, Bb maior, D menor, G menor, C menor',
          'As tonalidades próximas de G maior: D maior, A maior, E maior, B maior, F# maior',
        ],
      ],
    },
  ],

  // ---- l5u16m3: Direct, Common-Tone, and Chromatic Modulation ----
  l5u16m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a modulação direta (de frase) é verdadeira?',
      hintTemplate:
        'A modulação direta (de frase) muda de tonalidade abruptamente numa fronteira de frase sem acorde pivot. Comum na música pop e nos hinos.',
      nudgeTemplate: 'Pergunta onde chega a nova tonalidade (a meio de uma frase ou no início de uma frase nova) e se algum acorde a prepara. Numa modulação "truck driver", pergunta em que sentido se move a tonalidade e que efeito isso tem.',
      choiceSets: [
        [
          'Uma modulação direta passa a uma nova tonalidade numa fronteira de frase, sem pivot',
          'Uma modulação direta passa a uma nova tonalidade a meio da frase através de um acorde pivot comum',
          'Uma modulação direta é outro nome para uma tonicização breve que regressa logo à tonalidade principal',
          'Uma modulação direta é suavizada pela dominante da nova tonalidade, soando gradual em vez de abrupta',
        ],
        [
          'A modulação "truck driver" sobe meio-tom ou um tom para dar um impulso',
          'A modulação "truck driver" é suavizada por um acorde pivot comum às duas tonalidades',
          'A modulação "truck driver" só se encontra na música barroca e clássica',
          'A modulação "truck driver" baixa a tonalidade meio-tom ou um tom para aliviar a tensão',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a modulação por nota comum é verdadeira?',
      hintTemplate:
        'A modulação por nota comum sustém uma única nota que é reinterpretada na nova tonalidade. Frequentemente usada para modulações distantes onde existem poucos acordes pivot.',
      choiceSets: [
        [
          'Uma nota mantida é reouvida como um grau diferente na nova tonalidade',
          'Numa modulação de C para Eb, o G mantido é a 5.ª de C e também a 5.ª de Eb',
          'Todas as notas do acorde têm de ser comuns às duas tonalidades',
          'Nenhuma nota é mantida: a música para e recomeça na nova tonalidade',
        ],
        [
          'É especialmente útil entre tonalidades distantes que partilham poucos acordes',
          'Só funciona entre tonalidades próximas que partilham muitos acordes',
          'Exige uma sequência cromática por todas as tonalidades que ficam entre as duas',
          'Só funciona entre uma tonalidade e a sua relativa maior ou menor',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a modulação cromática é verdadeira?',
      hintTemplate:
        'A modulação cromática usa uma alteração cromática para conduzir suavemente à nova tonalidade. Uma voz move-se por meio-tom de uma nota diatónica para uma nota cromática na nova tonalidade.',
      nudgeTemplate: 'A modulação cromática altera uma nota de um acorde para conduzir à nova tonalidade. Segue a voz que leva a alteração: quanto se desloca, e que papel assume a nota alterada na nova tonalidade?',
      choiceSets: [
        [
          'Uma voz move-se por meio-tom de uma nota diatónica para uma cromática',
          'Uma voz salta um trítono de uma nota diatónica para uma cromática',
          'O acorde alterado mantém a mesma função nas duas tonalidades, por isso nada é reinterpretado',
          'Precisa de um acorde pivot diatónico nas duas tonalidades',
        ],
        [
          'A nota alterada torna-se muitas vezes a sensível ou uma nota do acorde da nova tonalidade',
          'A nota alterada é sempre a tónica da nova tonalidade, nunca a sua sensível',
          'A nota alterada tem de estar sempre no baixo, nunca numa voz superior',
          'A modulação cromática nunca envolve a sensível da nova tonalidade em nenhuma das vozes',
        ],
      ],
    },
  ],

  // ---- l5u16m4: Mode Mixture — Borrowed Chords ----
  l5u16m4: [
    {
      // chord_build
      promptTemplate:
        'Constrói o acorde de empréstimo {root} (um acorde de mistura modal em C maior).',
      hintTemplate:
        'A mistura modal empresta acordes do modo menor paralelo. Em C maior, estes acordes de empréstimo são bVI (Ab maior), bIII (Eb maior), bVII (Bb maior) e iv (F menor). Constrói {root} como escrito: as fundamentais rebaixadas formam tríades maiores, o acorde iv é F menor.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre os acordes de empréstimo do modo menor paralelo é verdadeira?',
      hintTemplate:
        'Acordes de empréstimo comuns no modo maior: iv (subdominante menor), bVI (sexto grau bemol maior), bVII (sétimo grau bemol maior), bIII. Acrescentam uma cor mais escura a uma tonalidade maior.',
      choiceSets: [
        [
          'Em C maior, bVI é Ab maior (Ab-C-Eb), emprestado de C menor',
          'Em C maior, bVI é A maior (A-C#-E), emprestado de A menor',
          'Em C maior, bVI é F# maior (F#-A#-C#), emprestado de C menor',
          'Em C maior, bVI é Ab menor (Ab-Cb-Eb), emprestado de Ab menor',
        ],
        [
          'Em C maior, iv é F menor (F-Ab-C), emprestado de C menor',
          'Em C maior, iv é F maior (F-A-C), igual ao da tonalidade maior',
          'Em C maior, iv é A menor (A-C-E), emprestado de A menor',
          'Em C maior, iv é D menor (D-F-A), emprestado de C menor',
        ],
      ],
    },
  ],

  // ---- l5u16m5: Picardy Third and Mode Mixture in Minor ----
  // No generated template: the template set has no item that teaches the Picardy
  // third / mixture-in-minor concept. (The mode-mixture chord_build belongs to the
  // major-key borrowing module l5u16m4.) Rather than attach an off-topic generated
  // exercise, this module relies on its hand-authored exercises only. Coverage gap
  // acknowledged in the WS5 audit (L5 E1).

  // =========================================================================
  // Unit 17: Form, Texture, and Voice Leading
  // =========================================================================

  // ---- l5u17m1: Binary and Ternary Forms ----
  l5u17m1: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as formas binária e ternária é verdadeira?',
      hintTemplate:
        'Binária: duas secções (AB). Ternária: três secções (ABA). Binária com retorno: A modula, B desenvolve, A regressa (||:A:||:BA:||).',
      choiceSets: [
        [
          'Duas secções contrastantes, cada uma repetida (||:A:||:B:||), é a forma binária simples',
          'Duas secções contrastantes, cada uma repetida (||:A:||:B:||), é a forma ternária',
          'Duas secções contrastantes, cada uma repetida (||:A:||:B:||), é a forma rondó',
          'Duas secções contrastantes, cada uma repetida (||:A:||:B:||), é a forma binária com retorno',
        ],
        [
          'ABA, em que a primeira secção regressa depois de um contraste, é a forma ternária',
          'ABA, em que a primeira secção regressa depois de um contraste, é a forma rondó',
          'ABA, em que a primeira secção regressa depois de um contraste, é a forma estrófica',
          'ABA, em que a primeira secção regressa depois de um contraste, é uma forma de composição contínua',
        ],
        [
          'A binária com retorno traz sempre de volta material de A no fim da secção B',
          'Na binária com retorno, a secção B regressa no fim, no lugar de A',
          'A binária com retorno fica na tonalidade principal do início ao fim, sem modulação',
          'A binária com retorno é outro nome para a binária simples',
        ],
      ],
    },
  ],

  // ---- l5u17m2: Song Forms and Large Forms Introduction ----
  l5u17m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as formas rondó e tema com variações é verdadeira?',
      hintTemplate:
        'Rondó: refrão recorrente alternando com episódios (ABACA ou ABACABA). Tema com variações: um tema seguido de repetições variadas.',
      choiceSets: [
        [
          'ABACABA é um rondó em sete partes',
          'ABACABA é uma forma ternária em três partes',
          'ABACABA é uma forma binária em duas partes',
          'ABACABA é uma forma sonata em três partes',
        ],
        [
          'Cada variação mantém o tema reconhecível enquanto muda outros elementos',
          'Cada variação tem de manter a melodia e o ritmo exatamente iguais',
          'Cada variação tem de passar para uma nova tonalidade e nunca manter a original',
          'Cada variação substitui o tema por material completamente novo e sem relação',
        ],
        [
          'O refrão do rondó (A) regressa normalmente na tonalidade principal',
          'O refrão do rondó (A) muda para uma nova tonalidade sempre que regressa',
          'Os episódios do rondó têm todos de ficar na tonalidade principal',
          'O refrão do rondó é totalmente reescrito de cada vez',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a forma sonata é verdadeira?',
      hintTemplate:
        'Forma sonata: Exposição (tema 1 na tónica, tema 2 na dominante), Desenvolvimento (fragmentação, modulação), Recapitulação (ambos os temas na tónica).',
      choiceSets: [
        [
          'A exposição tem dois grupos temáticos: o primeiro na tónica, o segundo numa tonalidade contrastante',
          'A exposição tem dois grupos temáticos, e ambos ficam na tonalidade da tónica do princípio ao fim',
          'A exposição tem um só tema, que depois é variado na tonalidade da tónica',
          'A exposição é a secção do meio, entre o desenvolvimento e a recapitulação',
        ],
        [
          'O desenvolvimento fragmenta os temas e passa por várias tonalidades',
          'O desenvolvimento repete a exposição exatamente, nota por nota, na tónica',
          'O desenvolvimento só apresenta temas novos, nunca os anteriores',
          'O desenvolvimento fica na tónica do princípio ao fim',
        ],
        [
          'Na recapitulação, o segundo tema regressa na tónica, não na dominante',
          'Na recapitulação, o segundo tema regressa na dominante, não na tónica',
          'Na recapitulação, o segundo tema é omitido por completo',
          'A recapitulação repete a exposição exatamente, tonalidades incluídas',
        ],
        [
          'Numa sonata em modo maior, o segundo tema está normalmente na dominante (V)',
          'Numa sonata em modo maior, o segundo tema está normalmente na subdominante (IV)',
          'Numa sonata em modo maior, o segundo tema está normalmente na relativa menor (vi)',
          'Numa sonata em modo maior, o segundo tema fica na tónica (I)',
        ],
      ],
    },
  ],

  // ---- l5u17m3: Texture ----
  // No generated template: the template set has no item teaching texture types
  // (monophony, homophony, polyphony, etc.). This module relies on its
  // hand-authored exercises only. Coverage gap acknowledged in the WS5 audit (L5 E1).

  // ---- l5u17m4: Guide Tone Lines ----
  // No generated template: the template set has no item teaching guide-tone lines
  // (3rds and 7ths through progressions). This module relies on its hand-authored
  // exercises only. Coverage gap acknowledged in the WS5 audit (L5 E1).
};

export default overlay;
