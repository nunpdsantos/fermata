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
        'Qual destas afirmações sobre V/V é verdadeira?',
      hintTemplate:
        'V/V toniciza o acorde dominante. Contém uma alteração cromática (4.º grau elevado) e resolve para V.',
      choiceSets: [
        [
      'Em F maior, V/V contém B, que resolve em C',
      'Em F maior, V/V contém B, que resolve em D',
      'Em F maior, V/V contém B, que resolve em A',
      'Em F maior, V/V contém B, que resolve em F',
    ],
        [
          'Em F maior, V/V é G maior (G–B–D) e resolve em C maior',
          'Em F maior, V/V é G menor (G–Bb–D) e resolve em C maior',
          'Em F maior, V/V é C maior (C–E–G) e resolve em F maior',
          'Em F maior, V/V é C menor (C–Eb–G) e resolve em C maior',
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
        'Uma dominante secundária é uma tríade maior ou uma sétima da dominante construída uma 5.ª perfeita acima do acorde que toniciza. Aqui constrói apenas {root}7: fundamental + 3.ª maior + 5.ª perfeita + 7.ª menor. Por exemplo, A7 (A-C#-E-G) é V7/ii em C maior, tonicizando D menor.',
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
          'V7/IV em E maior é E7 (E–G#–B–D) e resolve em A maior',
          'V7/IV em E maior é B7 (B–D#–F#–A) e resolve em E maior',
          'V7/IV em E maior é E7 (E–G#–B–D) e resolve em B maior',
          'V7/IV em E maior é F#7 (F#–A#–C#–E) e resolve em B maior',
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
      'Em G maior, vii°7/V é C#–E–G–Bb e resolve em D',
      'Em G maior, vii°7/V é F#–A–C–Eb e resolve em G',
      'Em G maior, vii°7/V é C#–E–G–Bb e resolve em C',
      'Em G maior, vii°7/V é D#–F#–A–C e resolve em E',
    ],
        [
      "A fundamental fica meio-tom abaixo da tónica de chegada",
      "A fundamental fica meio-tom acima da tónica de chegada",
      "A fundamental fica um tom abaixo da tónica de chegada",
      "A fundamental fica um tom acima da tónica de chegada",
    ],
        [
      'Os tipos possíveis são uma tríade diminuta, uma sétima meio-diminuta ou uma sétima diminuta',
      'Os tipos possíveis são uma tríade maior, uma sétima da dominante ou uma sétima maior',
      'Os tipos possíveis são uma tríade menor, uma sétima menor ou uma sétima meio-diminuta',
      'Os tipos possíveis são uma tríade maior, uma sétima meio-diminuta ou uma sétima diminuta',
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
        'A tonicização é uma ênfase geralmente breve num acorde que não é a tónica, muitas vezes apenas uma dominante secundária e o seu acorde de resolução. A modulação é uma mudança mais duradoura para uma nova tonalidade, confirmada por uma cadência nessa tonalidade.',
      choiceSets: [
        [
      'A tonicização destaca brevemente um acorde; a modulação confirma uma nova tonalidade com uma cadência',
      "A tonicização confirma uma nova tonalidade com uma cadência; a modulação destaca brevemente um acorde",
      "A tonicização e a modulação confirmam ambas uma nova tonalidade com uma cadência",
      "A tonicização e a modulação destacam ambas brevemente um acorde sem confirmar uma nova tonalidade",
    ],
        [
      "Uma única dominante secundária e o seu alvo são uma tonicização",
      'Uma única dominante secundária e o seu alvo são uma modulação',
      'Uma única dominante secundária e o seu alvo são uma cadência interrompida',
      'Uma única dominante secundária e o seu alvo são uma cadência plagal',
    ],
        [
      "Uma modulação confirma-se quando a música faz uma cadência na nova tonalidade",
      "Uma modulação confirma-se quando a música faz uma cadência na tonalidade original",
      'Uma modulação confirma-se quando a música regressa à tónica original sem cadência na nova tonalidade',
      'Uma modulação confirma-se quando a música realça brevemente um acorde sem cadência na nova tonalidade',
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
        'Uma cadeia de dominantes liga dominantes secundárias: p. ex., V7/vi → V7/ii → V7/V → V7 → I. Cada dominante resolve para a seguinte, criando movimento cromático em direção à tónica.',
      choiceSets: [
        [
          'Numa cadeia de dominantes, cada acorde funciona como V7 do acorde seguinte',
          'Numa cadeia de dominantes, cada acorde funciona como IV do acorde seguinte',
          'Numa cadeia de dominantes, cada acorde funciona como ii7 do acorde seguinte',
          'Numa cadeia de dominantes, cada acorde funciona como vi7 do acorde seguinte',
        ],
        [
      'A cadeia V7/vi → V7/ii → V7/V → V → I move-se por 5.as descendentes',
      'A cadeia V7/vi → V7/ii → V7/V → V → I move-se por 3.as descendentes',
      'A cadeia V7/vi → V7/ii → V7/V → V → I move-se por 2.as descendentes',
      'A cadeia V7/vi → V7/ii → V7/V → V → I move-se por 4.as descendentes',
    ],
        [
          'Cada dominante aplicada acrescenta normalmente uma nota cromática: a sensível do seu alvo',
          "Cada dominante aplicada normalmente acrescenta uma nota cromática: a subtónica do alvo",
          "Cada dominante aplicada costuma elevar a 5.ª para criar a sensível do alvo",
          "Cada dominante aplicada tipicamente baixa a 3.ª para criar a sensível do alvo",
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
        'Qual destas afirmações sobre a modulação por acorde pivot diatónico é verdadeira?',
      hintTemplate:
        'Um acorde pivot pertence tanto à tonalidade antiga como à nova. Reinterpreta um acorde diatónico: p. ex., IV em C = I em F. O pivot é a dobradiça entre duas regiões tonais.',
      choiceSets: [
        [
      'De C maior para G maior, A menor pode servir de pivot diatónico',
      'De C maior para G maior, F maior pode servir de pivot diatónico',
      'De C maior para G maior, Bb maior pode servir de pivot diatónico',
      'De C maior para G maior, D maior pode servir de pivot diatónico',
    ],
        [
      "De C para G, o acorde de C maior pode servir de pivot como IV de G",
      "De C para G, o acorde de C maior pode servir de pivot como V de G",
      "De C para G, o acorde de C maior pode servir de pivot como ii de G",
      "De C para G, o acorde de C maior pode servir de pivot como vi de G",
    ],
        [
          'As tonalidades próximas (no máximo a um acidente de distância) partilham mais acordes pivot',
          'As tonalidades distantes (a muitos acidentes de distância) partilham mais acordes pivot do que as próximas',
          'As tonalidades homónimas (a mesma tónica em modos diferentes) partilham mais acordes pivot do que as próximas',
          'As tonalidades próximas (no máximo a um acidente de distância) não partilham acordes pivot em nenhuma tonalidade',
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
      "As tonalidades próximas de C maior: G maior, F maior, A menor, E menor, D menor",
      'As tonalidades próximas de C maior: D maior, G maior, B menor, E menor, F# menor',
      'As tonalidades próximas de C maior: F maior, Bb maior, D menor, G menor, C menor',
      'As tonalidades próximas de C maior: Eb maior, Ab maior, C menor, F menor, Bb menor',
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
      "No início de uma nova frase, o centro tonal muda sem um acorde comum a ligar as tonalidades",
      'No início de uma nova frase, o centro tonal muda através de um acorde comum que liga as tonalidades',
      'No início de uma nova frase, o centro tonal muda gradualmente através de uma dominante preparada da nova tonalidade',
      'No início de uma nova frase, um acorde é brevemente tonicizado enquanto a tonalidade original se mantém',
    ],
        [
          'A modulação "truck driver" sobe meio-tom ou um tom para dar um impulso',
          'A modulação "truck driver" passa a uma nova tonalidade por um acorde pivot comum',
          'A modulação "truck driver" repete a frase na mesma tonalidade para dar um impulso',
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
      'Uma altura sustentada muda de papel quando a harmonia estabelece uma tónica diferente',
      'Uma altura sustentada conserva o seu grau da escala quando a harmonia estabelece uma tónica diferente',
      'Uma altura sustentada torna-se a tónica sempre que a harmonia estabelece uma tonalidade diferente',
      'Uma altura sustentada torna-se a dominante sempre que a harmonia estabelece uma tonalidade diferente',
    ],
        [
          'A altura de ligação mantém-se; as tonalidades não precisam de partilhar um acorde',
          'A altura de ligação muda meio-tom; as tonalidades não precisam de partilhar um acorde',
          'A altura de ligação mantém-se; as tonalidades precisam de partilhar um acorde',
          'A altura de ligação muda meio-tom; as tonalidades precisam de partilhar um acorde',
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
        'A mistura modal empresta acordes do modo menor homónimo. Em C maior, estes acordes de empréstimo são bVI (Ab maior), bIII (Eb maior), bVII (Bb maior) e iv (F menor). Constrói {root} como escrito: as fundamentais rebaixadas formam tríades maiores, o acorde iv é F menor.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre os acordes de empréstimo do modo menor homónimo é verdadeira?',
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
        'Binária: duas secções (AB). Ternária: três secções (ABA). Binária com retorno: A termina frequentemente em V ou noutra tonalidade; após material contrastante, o material de A regressa dentro da segunda secção (||:A:||:B A\':||).',
      choiceSets: [
        [
          'Duas secções contrastantes, cada uma repetida (||:A:||:B:||), é a forma binária simples',
          'Duas secções contrastantes, cada uma repetida (||:A:||:B:||), é a forma ternária',
          'Duas secções contrastantes, cada uma repetida (||:A:||:B:||), é a forma rondó',
          'Duas secções contrastantes, cada uma repetida (||:A:||:B:||), é a forma binária com retorno',
        ],
        [
      "ABA, em que a primeira secção regressa depois de um contraste, é a forma ternária",
      'ABA, em que a primeira secção regressa depois de um contraste, é a forma rondó',
      'ABA, em que a primeira secção regressa depois de um contraste, é a forma estrófica',
      'ABA, em que a primeira secção regressa depois de um contraste, é a composição contínua',
    ],
        [
          'A binária com retorno traz sempre de volta material de A no fim da secção B',
          'A binária com retorno traz sempre de volta material de B no fim da secção A',
          'A binária com retorno deixa sempre o material de A fora da secção B',
          'A binária com retorno traz sempre de volta A como uma secção separada depois da secção B',
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
      'ABACABA é uma forma de sete partes: rondó',
      'ABACABA é uma forma de sete partes: tema com variações',
      'ABACABA é uma forma de sete partes: forma estrófica',
      'ABACABA é uma forma de sete partes: composição contínua',
    ],
        [
          'Cada variação mantém o tema reconhecível enquanto muda outros elementos',
          'Cada variação mantém o tema reconhecível repetindo todos os elementos musicais sem alteração',
          'Cada variação substitui o tema por material sem relação enquanto muda outros elementos',
          'Cada variação substitui o tema por material sem relação enquanto mantém os outros elementos sem alteração',
        ],
        [
      "Quando A regressa num rondó, normalmente traz a música de volta à tonalidade principal",
      "Quando A regressa num rondó, normalmente mantém a música afastada da tonalidade principal",
      "Quando A regressa num rondó, normalmente faz a tonalidade principal soar como dominante do episódio anterior",
      "Quando A regressa num rondó, normalmente confirma o episódio anterior como nova tonalidade principal",
    ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a forma sonata é verdadeira?',
      hintTemplate:
        'Forma sonata: a exposição contrasta um tema na tónica com uma segunda tonalidade (geralmente a dominante no modo maior e a relativa maior no modo menor); o desenvolvimento fragmenta e modula; a reexposição traz o segundo tema de volta à tónica.',
      choiceSets: [
        [
      "A exposição tem dois grupos temáticos: o primeiro na tónica, o segundo numa tonalidade contrastante",
      "A exposição tem dois grupos temáticos: o primeiro numa tonalidade contrastante, o segundo na tónica",
      "A exposição tem dois grupos temáticos: o primeiro e o segundo na tónica, sem tonalidade contrastante",
      "A exposição tem dois grupos temáticos: o primeiro e o segundo numa tonalidade contrastante, sem a tónica",
    ],
        [
          'O desenvolvimento fragmenta os temas e passa por várias tonalidades',
          'O desenvolvimento repete a exposição exatamente, nota por nota, na tónica',
          'O desenvolvimento só apresenta temas novos, nunca os anteriores',
          'O desenvolvimento fica na tónica do princípio ao fim',
        ],
        [
      "Na reexposição, o segundo tema regressa na tónica, não na dominante",
      "Na reexposição, o segundo tema regressa na dominante, não na tónica",
      "Na reexposição, o segundo tema regressa na subdominante, não na tónica",
      "Na reexposição, o segundo tema regressa na supertónica, não na tónica",
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
