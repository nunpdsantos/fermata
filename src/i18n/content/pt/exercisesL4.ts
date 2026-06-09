import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese translations for Level 4 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidade 12: Notas Estranhas ao Acorde e Sétima da Dominante
  // =========================================================================

  // ---- l4u12m1: Suspensões ----

  l4u12m1e1: {
    prompt: 'O que é uma suspensão 4-3?',
    choices: [
      'A 4.ª acima do baixo é retida do acorde anterior e resolve descendo para a 3.ª',
      'A 3.ª é elevada para a 4.ª e permanece aí',
      'Um acorde que alterna entre o 4.º e o 3.º graus',
      'O baixo move-se do 4.º grau para o 3.º grau da escala',
    ],
    hint: 'Numa suspensão 4-3, a 4.ª acima do baixo é uma dissonância transportada (suspensa) do acorde anterior. Depois resolve por grau conjunto descendente para a 3.ª consonante.',
  },
  l4u12m1e2: {
    prompt: 'Quais são as três fases de uma suspensão?',
    choices: [
      'Preparação, suspensão, resolução',
      'Tensão, clímax, libertação',
      'Abordagem, chegada, partida',
      'Antecipação, suspensão, retardo',
    ],
    hint: 'Uma suspensão tem três etapas: preparação (a nota é consonante no acorde anterior), suspensão (a nota é retida enquanto a harmonia muda, criando dissonância) e resolução (move-se por grau conjunto para uma consonância).',
  },
  l4u12m1e3: {
    prompt:
      'Na tonalidade de Dó maior, um acorde V está a soar e a nota F é retida do acorde IV anterior antes de resolver para E. Que tipo de nota estranha ao acorde é o F?',
    choices: [
      'Suspensão (4-3 sobre o acorde V)',
      'Nota de passagem',
      'Apogiatura',
      'Escapatória',
    ],
    hint: 'O F era consonante no acorde IV (F-A-C), depois foi retido para o acorde V (G-B-D) onde é dissonante (uma 4.ª acima do baixo G), e resolve descendo por grau conjunto para E (a 3.ª). Esta é uma suspensão 4-3 exemplar.',
  },

  // ---- l4u12m2: Apogiatura / Escapatória ----

  l4u12m2e1: {
    prompt: 'Como é que uma apogiatura aborda a sua nota dissonante?',
    choices: [
      'Por salto — chega à dissonância sem preparação por grau conjunto',
      'Por grau conjunto descendente apenas',
      'Sendo retida do acorde anterior',
      'Por meio-tom cromático',
    ],
    hint: 'Uma apogiatura é uma nota estranha acentuada abordada por salto e resolvida por grau conjunto na direção oposta. Ao contrário de uma suspensão, não tem preparação — salta diretamente para a dissonância.',
  },
  l4u12m2e2: {
    prompt: 'Como é que uma escapatória difere de uma nota de passagem?',
    choices: [
      'Uma escapatória é abordada por grau conjunto mas parte por salto na direção oposta',
      'Uma escapatória é abordada por salto e parte por grau conjunto',
      'Uma escapatória ocorre num tempo forte enquanto uma nota de passagem ocorre num tempo fraco',
      'Não há diferença; são a mesma coisa',
    ],
    hint: 'Uma escapatória (échappée) move-se por grau conjunto a partir de uma nota do acorde, depois salta na direção oposta para a nota do acorde seguinte. Uma nota de passagem move-se por grau conjunto na mesma direção ao longo de todo o percurso.',
  },
  l4u12m2e3: {
    prompt: 'Em que direção resolve um retardo?',
    choices: [
      'Para cima por grau conjunto — é uma suspensão que resolve para cima em vez de para baixo',
      'Para baixo por grau conjunto, como uma suspensão padrão',
      'Para baixo por salto',
      'Não resolve; permanece dissonante',
    ],
    hint: 'Um retardo é essencialmente uma suspensão que resolve por grau conjunto ascendente em vez de descendente. O exemplo mais comum é 7-8, onde a 7.ª acima do baixo resolve para cima até à oitava.',
  },

  // ---- l4u12m3: Pedal ----

  l4u12m3e1: {
    prompt: 'O que é um pedal?',
    choices: [
      'Uma nota sustentada ou repetida mantida através de harmonias em mudança acima dela',
      'Uma nota estranha ao acorde que se move por grau conjunto entre duas notas do acorde',
      'Um acorde mantido durante uma frase inteira',
      'A nota mais grave de qualquer disposição de acorde',
    ],
    hint: 'Um pedal (ou nota pedal) é uma nota única — geralmente a tónica ou a dominante — sustentada numa voz enquanto as outras vozes se movem por harmonias que podem ser dissonantes contra ela. O nome vem do pedal do órgão que mantém notas no baixo.',
  },
  l4u12m3e2: {
    prompt:
      'O que é uma "nota cambiada" (também chamada grupo de bordaduras ou dupla bordadura)?',
    choices: [
      'Duas notas estranhas ao acorde que se aproximam de uma nota do acorde tanto por cima como por baixo em sucessão',
      'Uma nota do acorde que muda para uma nota do acorde diferente',
      'Uma modulação de uma tonalidade para outra',
      'Um acidente que muda a qualidade de um acorde',
    ],
    hint: 'Uma nota cambiada (grupo de bordaduras) decora uma nota do acorde movendo-se para a bordadura superior, depois para a bordadura inferior (ou vice-versa) antes de regressar. Por exemplo: C-D-B-C ornamenta a nota C.',
  },
  l4u12m3e3: {
    prompt: 'Onde é que um pedal é mais frequentemente encontrado?',
    choices: [
      'Na voz do baixo, geralmente na tónica ou na dominante',
      'Exclusivamente na voz do soprano',
      'Apenas entre as duas vozes interiores',
      'Alternando entre a voz mais aguda e a mais grave',
    ],
    hint: 'Embora os pedais possam ocorrer em qualquer voz (um "pedal invertido" está no soprano, um "pedal interno" está numa voz intermédia), a colocação mais comum é no baixo nos graus 1 (pedal de tónica) ou 5 (pedal de dominante).',
  },

  // ---- l4u12m4: Regras de Resolução do V7 ----

  l4u12m4e1: {
    prompt:
      'Constrói um acorde V7 na tonalidade de Dó maior. É G sétima da dominante: G-B-D-F. Seleciona as 4 notas.',
    hint: 'G7 = G, B, D, F. Fundamental (G) + 3.ª maior (B) + 5.ª perfeita (D) + 7.ª menor (F). O trítono entre B e F impulsiona a resolução para Dó maior.',
  },
  l4u12m4e2: {
    prompt:
      'Constrói um acorde V7 na tonalidade de Sol maior. É D sétima da dominante: D-F#-A-C. Seleciona as 4 notas.',
    hint: 'D7 = D, F#, A, C. Fundamental (D) + 3.ª maior (F#) + 5.ª perfeita (A) + 7.ª menor (C). O trítono entre F# e C resolve para Sol maior.',
  },
  l4u12m4e3: {
    prompt: 'Como é que o trítono dentro de V7 resolve ao mover-se para I?',
    choices: [
      'A sensível (3.ª de V7) resolve por meio-tom ascendente para a tónica; a 7.ª de V7 resolve por meio-tom descendente',
      'Ambas as notas do trítono resolvem por grau conjunto ascendente',
      'O trítono expande-se para uma oitava',
      'Ambas as notas do trítono descem por tom',
    ],
    hint: 'Em G7 a resolver para Dó: B (sensível, 3.ª de V7) resolve para cima até C; F (7.ª de V7) resolve para baixo até E. O trítono B-F contrai para dentro para C-E. Este movimento contrário é o motor da resolução tonal.',
  },

  // ---- l4u12m5: Inversões de V7 ----

  l4u12m5e1: {
    prompt: 'Que símbolo de baixo cifrado representa V6/5 (V7 em primeira inversão)?',
    choices: [
      '6/5 — a 3.ª do acorde está no baixo',
      '4/3 — a 5.ª do acorde está no baixo',
      '4/2 — a 7.ª do acorde está no baixo',
      '7 — a fundamental está no baixo',
    ],
    hint: 'V6/5 significa que a 3.ª de V7 é a nota do baixo. Em Dó maior, isso significa que B é a nota mais grave de G7. Os números 6 e 5 descrevem os intervalos acima do baixo (B a G = 6.ª, B a F = 5.ª).',
  },
  l4u12m5e2: {
    prompt: 'V4/3 (V7 em segunda inversão) resolve tipicamente para que acorde?',
    choices: [
      'I (ou I6) — o baixo (5.ª de V7) desce por grau conjunto até à fundamental ou 3.ª de I',
      'IV — o baixo salta para a subdominante',
      'vi — o baixo move-se para a submediante',
      'Não resolve; é um acorde estável',
    ],
    hint: 'V4/3 tem a 5.ª de V7 no baixo (D em G7/D em Dó maior). O D resolve tipicamente por grau conjunto — desce para C (fundamental de I) ou sobe para E (dando I6). O trítono B-F continua a resolver como habitualmente.',
  },
  l4u12m5e3: {
    prompt: 'Em V4/2 (V7 em terceira inversão), que nota do acorde está no baixo?',
    choices: [
      'A 7.ª do acorde',
      'A fundamental do acorde',
      'A 3.ª do acorde',
      'A 5.ª do acorde',
    ],
    hint: 'V4/2 (também escrito V2) coloca a 7.ª de V7 no baixo. Em Dó maior, isso significa que F é a nota do baixo de G7. O F resolve por grau conjunto descendente para E, produzindo I6 (Dó maior em primeira inversão).',
  },

  // =========================================================================
  // Unidade 13: Acordes de Sétima Diatónicos, Função, Sequências
  // =========================================================================

  // ---- l4u13m1: Sétimas Pré-Dominantes ----

  l4u13m1e1: {
    prompt:
      'Constrói um acorde ii7 em Dó maior. É D sétima menor: D-F-A-C. Seleciona as 4 notas.',
    hint: 'Dm7 = D, F, A, C. Fundamental (D) + 3.ª menor (F) + 5.ª perfeita (A) + 7.ª menor (C). Este é o acorde de sétima pré-dominante mais comum em tonalidades maiores.',
  },
  l4u13m1e2: {
    prompt:
      'Constrói um acorde iiø7 em Dó menor. É D sétima meio-diminuto: D-F-Ab-C. Seleciona as 4 notas.',
    hint: 'Dø7 = D, F, Ab, C. Fundamental (D) + 3.ª menor (F) + 5.ª diminuta (Ab) + 7.ª menor (C). Em tonalidades menores, o acorde ii é meio-diminuto porque a 5.ª (Ab) é baixada.',
  },
  l4u13m1e3: {
    prompt: 'Por que é que o acorde ii7 é considerado um pré-dominante?',
    choices: [
      'Progride mais frequentemente para V ou V7, preparando a harmonia dominante',
      'Resolve diretamente para o acorde I de tónica',
      'Substitui a função dominante inteiramente',
      'Aparece apenas antes do acorde IV',
    ],
    hint: 'No modelo funcional padrão T-PD-D-T, ii (e ii7) desempenha uma função pré-dominante. Cria impulso harmónico em direção a V, que depois resolve para I. A progressão ii-V-I é fundamental tanto no clássico como no jazz.',
  },

  // ---- l4u13m2: Sétimas da Mediante / Submediante ----

  l4u13m2e1: {
    prompt: 'Numa tonalidade maior, qual é a qualidade do acorde iii7?',
    choices: [
      'Sétima menor — construído sobre a mediante com uma tríade menor e 7.ª menor',
      'Sétima maior — construído com uma tríade maior e 7.ª maior',
      'Sétima da dominante — uma tríade maior com 7.ª menor',
      'Sétima meio-diminuto — uma tríade diminuta com 7.ª menor',
    ],
    hint: 'Em Dó maior, iii7 = E-G-B-D. A tríade E-G-B é menor, e E a D é uma 7.ª menor (10 semitons). Portanto iii7 é um acorde de sétima menor, tal como ii7 e vi7.',
  },
  l4u13m2e2: {
    prompt: 'Numa tonalidade maior, qual é a qualidade do acorde vi7?',
    choices: [
      'Sétima menor — uma tríade menor mais uma 7.ª menor acima da fundamental',
      'Sétima maior — uma tríade maior mais uma 7.ª maior acima da fundamental',
      'Sétima da dominante — uma tríade maior mais uma 7.ª menor acima da fundamental',
      'Sétima diminuto — uma tríade diminuta mais uma 7.ª diminuta',
    ],
    hint: 'Em Dó maior, vi7 = A-C-E-G. A tríade A-C-E é menor, e A a G é uma 7.ª menor (10 semitons). Tal como ii7 e iii7, vi7 é um acorde de sétima menor.',
  },
  l4u13m2e3: {
    prompt:
      'Qual é a qualidade do acorde Imaj7 numa tonalidade maior, e onde é comummente usado?',
    choices: [
      'Sétima maior — frequentemente usado como acorde de tónica colorido no jazz e pop',
      'Sétima da dominante — resolve sempre para IV',
      'Sétima menor — usado apenas em tonalidades menores',
      'Sétima meio-diminuto — cria forte dissonância em repouso',
    ],
    hint: 'Em Dó maior, Imaj7 = C-E-G-B. A 7.ª maior (B) acrescenta calor e cor à tríade de tónica sem comprometer a sua estabilidade. É uma sonoridade básica no jazz, bossa nova e muitos estilos pop.',
  },

  // ---- l4u13m3: Sétimas da Sensível ----

  l4u13m3e1: {
    prompt:
      'Constrói um acorde de sétima diminuto sobre B (viio7 em Dó menor): B-D-F-Ab. Seleciona as 4 notas.',
    hint: 'Bo7 = B, D, F, Ab. Fundamental (B) + 3.ª menor (D) + 5.ª diminuta (F) + 7.ª diminuta (Ab). Todos os três intervalos superiores são 3.as menores empilhadas (3+3+3 semitons).',
  },
  l4u13m3e2: {
    prompt:
      'Constrói um acorde de sétima meio-diminuto sobre B (viiø7 em Dó maior): B-D-F-A. Seleciona as 4 notas.',
    hint: 'Bø7 = B, D, F, A. Fundamental (B) + 3.ª menor (D) + 5.ª diminuta (F) + 7.ª menor (A). Ao contrário do sétima diminuto, o intervalo superior é uma 3.ª maior (F a A), tornando a 7.ª menor em vez de diminuta.',
  },
  l4u13m3e3: {
    prompt:
      'Qual é a diferença fundamental entre um acorde de sétima diminuto e um meio-diminuto?',
    choices: [
      'O diminuto tem uma 7.ª diminuta (9 semitons); o meio-diminuto tem uma 7.ª menor (10 semitons)',
      'O diminuto usa uma tríade menor; o meio-diminuto usa uma tríade maior',
      'O diminuto tem uma 5.ª perfeita; o meio-diminuto tem uma 5.ª diminuta',
      'São o mesmo acorde com nomes diferentes',
    ],
    hint: 'Ambos os acordes partilham uma tríade diminuta (3.ª menor + 5.ª diminuta). A diferença está na 7.ª: totalmente diminuto = 7.ª diminuta (enarmonicamente 6.ª maior, 9 semitons); meio-diminuto = 7.ª menor (10 semitons).',
  },

  // ---- l4u13m4: Função Harmónica T-PD-D-T ----

  l4u13m4e1: {
    prompt:
      'No modelo funcional T-PD-D-T, que função harmónica desempenha o acorde ii?',
    choices: [
      'Pré-dominante (PD) — prepara a dominante',
      'Tónica (T) — substitui I',
      'Dominante (D) — resolve para I',
      'Não tem função padrão',
    ],
    hint: 'O acorde ii (juntamente com IV) é a harmonia pré-dominante principal. No ciclo funcional T-PD-D-T, os pré-dominantes fazem a ponte entre a estabilidade da tónica e a tensão dominante: I \u2192 ii \u2192 V \u2192 I.',
  },
  l4u13m4e2: {
    prompt: 'Qual é a ordem padrão das funções harmónicas numa frase tonal?',
    choices: [
      'Tónica \u2192 Pré-dominante \u2192 Dominante \u2192 Tónica',
      'Dominante \u2192 Tónica \u2192 Pré-dominante \u2192 Dominante',
      'Pré-dominante \u2192 Dominante \u2192 Tónica \u2192 Pré-dominante',
      'Tónica \u2192 Dominante \u2192 Pré-dominante \u2192 Tónica',
    ],
    hint: 'A progressão funcional normativa é T-PD-D-T. A música começa em repouso (tónica), constrói tensão através de pré-dominante e dominante, depois regressa ao repouso. Saltar etapas é possível (T-D-T), mas inverter a ordem (D antes de PD) é raro na prática comum.',
  },
  l4u13m4e3: {
    prompt:
      'Que acorde pode substituir IV como pré-dominante numa tonalidade maior?',
    choices: [
      'ii — ambos partilham duas notas comuns e desempenham a mesma função pré-dominante',
      'V — porque está próximo de IV no ciclo de quintas',
      'iii — porque é adjacente a IV por grau conjunto',
      'viio — porque contém a sensível',
    ],
    hint: 'Em Dó maior, IV = F-A-C e ii = D-F-A. Partilham F e A (duas notas comuns) e ambos criam impulso pré-dominante para V. O acorde ii é frequentemente preferido na escrita a quatro vozes porque ii-V apresenta movimento de baixo suave por 5.ª.',
  },

  // ---- l4u13m5: Sequências Harmónicas ----

  l4u13m5e1: {
    prompt: 'Qual é a sequência harmónica diatónica mais comum?',
    choices: [
      'Quintas descendentes — cada fundamental desce uma 5.ª (ou sobe uma 4.ª): ex. I-IV-viio-iii-vi-ii-V-I',
      'Quintas ascendentes — cada fundamental sobe uma 5.ª',
      'Terças descendentes — cada fundamental desce uma 3.ª',
      'Descida cromática — cada fundamental desce um meio-tom',
    ],
    hint: 'A sequência de quintas descendentes (ou ciclo de quintas) move cada fundamental uma 5.ª abaixo diatonicamente. Em Dó maior: C-F-B-E-A-D-G-C (I-IV-viio-iii-vi-ii-V-I). Esta é a espinha dorsal de inúmeras progressões na música ocidental.',
  },
  l4u13m5e2: {
    prompt:
      'Numa sequência baseada em segundas ascendentes, qual é o padrão de movimento das fundamentais?',
    choices: [
      'Cada fundamental sobe uma 2.ª diatónica: ex. I-ii-iii-IV',
      'Cada fundamental desce uma 2.ª: ex. I-viio-vi-V',
      'As fundamentais alternam entre 2.as ascendentes e descendentes',
      'As fundamentais movem-se por 3.as mas soam como 2.as',
    ],
    hint: 'Uma sequência de segundas ascendentes move cada fundamental por grau conjunto ascendente ao longo da escala. Embora menos comum do que as quintas descendentes, cria um forte sentido de movimento para a frente. É frequentemente combinada com inversões alternadas para suavizar a condução de vozes.',
  },
  l4u13m5e3: {
    prompt: 'O que define uma sequência harmónica?',
    choices: [
      'Um padrão de progressões de acordes repetido em níveis de altura sucessivos dentro da tonalidade',
      'Um único acorde repetido várias vezes',
      'Uma melodia tocada em oitavas diferentes',
      'Uma série de modulações para tonalidades distantes',
    ],
    hint: 'Uma sequência harmónica pega num padrão curto de acordes (o modelo) e repete-o em diferentes níveis de altura diatónicos. Os intervalos entre fundamentais mantêm-se consistentes, embora a sua qualidade exata possa mudar para permanecer dentro da tonalidade.',
  },

  // =========================================================================
  // Unidade 14: Contraponto, Compasso, Análise, Harmonia Menor
  // =========================================================================

  // ---- l4u14m1: Contraponto de Primeira / Segunda Espécie ----

  l4u14m1e1: {
    prompt:
      'No contraponto de primeira espécie, qual é a regra fundamental?',
    choices: [
      'Nota contra nota — cada nota no contraponto alinha-se com uma nota no cantus firmus, usando apenas consonâncias',
      'Duas notas contra uma — o contraponto move-se ao dobro da velocidade do cantus firmus',
      'Ritmo livre — qualquer ritmo pode ser usado contra o cantus firmus',
      'Apenas uníssonos e oitavas são permitidos entre as vozes',
    ],
    hint: 'A primeira espécie (1:1) é o contraponto mais simples: uma nota na voz acrescentada para cada nota do cantus firmus. Cada intervalo vertical deve ser consonante (3.as, 5.as, 6.as, oitavas, uníssonos). Nenhuma dissonância é permitida.',
  },
  l4u14m1e2: {
    prompt:
      'Que intervalos são considerados consonantes no contraponto de espécies?',
    choices: [
      'Uníssonos, 3.as, 5.as, 6.as e oitavas',
      'Apenas intervalos perfeitos: uníssonos, 4.as, 5.as, oitavas',
      'Todos os intervalos exceto o trítono',
      '2.as, 4.as, 7.as e trítonos',
    ],
    hint: 'No contraponto a duas vozes, as consonâncias são: consonâncias perfeitas (uníssono, P5, P8) e consonâncias imperfeitas (m3, M3, m6, M6). A 4.ª perfeita é tratada como dissonância no contraponto a duas vozes. Segundas, 7.as e trítonos são dissonantes.',
  },
  l4u14m1e3: {
    prompt:
      'No contraponto de segunda espécie, como são tratadas as dissonâncias (como notas de passagem)?',
    choices: [
      'As dissonâncias podem ocorrer apenas em tempos fracos, abordadas e abandonadas por grau conjunto na mesma direção',
      'As dissonâncias podem ocorrer em qualquer tempo desde que resolvam',
      'Nenhuma dissonância é permitida na segunda espécie',
      'As dissonâncias devem ocorrer em tempos fortes e resolver em tempos fracos',
    ],
    hint: 'A segunda espécie (2:1) tem duas notas contra cada nota do cantus firmus. Tempos fortes devem ser consonantes. Tempos fracos podem incluir notas de passagem — dissonâncias por grau conjunto que ligam duas consonâncias. Isto introduz dissonância controlada.',
  },

  // ---- l4u14m2: Compassos Assimétricos ----

  l4u14m2e1: {
    prompt: 'Como é tipicamente agrupado o compasso 5/4?',
    choices: [
      'Como 3+2 ou 2+3 — um agrupamento assimétrico de tempos de semínima',
      'Como 5 tempos iguais sem agrupamento interno',
      'Como 4+1, tratando-o como 4/4 com um tempo extra',
      'Como 2,5+2,5, dividindo igualmente ao meio',
    ],
    hint: '5/4 é um compasso assimétrico (ou irregular). Não pode ser dividido em grupos iguais, por isso divide-se como 3+2 ou 2+3. A escolha do agrupamento afeta o padrão de acentos e o carácter rítmico.',
  },
  l4u14m2e2: {
    prompt: 'Como funciona o compasso 7/8 como compasso aditivo?',
    choices: [
      'Combina grupos desiguais de colcheias (ex. 2+2+3, 3+2+2 ou 2+3+2)',
      'Tem 7 tempos iguais como um compasso simples padrão',
      'É um compasso composto com tempos de semínima com ponto',
      'Alterna entre 3/8 e 4/8 a cada compasso',
    ],
    hint: '7/8 é um compasso aditivo: 7 colcheias são agrupadas em subtempos desiguais. Agrupamentos comuns são 2+2+3 (curto-curto-longo), 3+2+2 (longo-curto-curto) ou 2+3+2. O grupo longo soa como um tempo ligeiramente esticado.',
  },
  l4u14m2e3: {
    prompt:
      'O que significa a indicação de compasso "tempo cortado" (alla breve, C com uma linha vertical)?',
    choices: [
      '2/2 — dois tempos de mínima por compasso, sentido em dois em vez de quatro',
      '4/4 tocado ao dobro da velocidade',
      '2/4 com o andamento cortado ao meio',
      'Qualquer indicação de compasso onde os valores das notas são reduzidos a metade',
    ],
    hint: 'O tempo cortado (alla breve) é 2/2: dois tempos de mínima por compasso. Um compasso de 2/2 tem a mesma duração total que um de 4/4, mas conta-se em 2 (tempo de mínima) em vez de 4 (tempo de semínima) — as mesmas notas sentidas em dois tempos, dando uma pulsação mais ampla e fluida.',
  },

  // ---- l4u14m3: Ornamentação Cromática ----

  l4u14m3e1: {
    prompt: 'O que é uma nota de passagem cromática?',
    choices: [
      'Uma nota estranha ao acorde que preenche um tom com um meio-tom cromático, movendo-se por semitom entre duas notas do acorde',
      'Qualquer acidente que aparece na melodia',
      'Uma nota que salta cromaticamente de uma nota do acorde para outra',
      'Uma nota de passagem que muda a tonalidade da passagem',
    ],
    hint: 'Uma nota de passagem cromática preenche o intervalo entre duas notas do acorde que estão a um tom de distância. Por exemplo, entre C e D, um C# como nota de passagem cromática cria movimento suave por semitom: C-C#-D.',
  },
  l4u14m3e2: {
    prompt: 'O que é uma bordadura cromática?',
    choices: [
      'Uma nota estranha ao acorde a meio-tom acima ou abaixo de uma nota do acorde, regressando à mesma nota do acorde',
      'Uma bordadura que modula para uma nova tonalidade',
      'Um som emprestado da tonalidade paralela',
      'Qualquer bordadura numa passagem de escala cromática',
    ],
    hint: 'Uma bordadura cromática é um ornamento que se move por semitom a partir de uma nota do acorde e regressa: ex. E-Eb-E ou G-G#-G. Acrescenta cor sem alterar a direção harmónica, funcionando como decoração de superfície.',
  },
  l4u14m3e3: {
    prompt:
      'Como se distingue uma ornamentação cromática de uma nota cromática estrutural (como uma sensível secundária)?',
    choices: [
      'Ornamentações são notas estranhas ao acorde que decoram; notas cromáticas estruturais alteram a harmonia ou tonicizam um novo acorde',
      'Não há diferença; todas as notas cromáticas são ornamentações',
      'Ornamentações duram mais do que notas estruturais',
      'Notas estruturais estão sempre no baixo enquanto ornamentações estão nas vozes superiores',
    ],
    hint: 'Ornamentações cromáticas (notas de passagem, bordaduras) são decorações de superfície que não afetam a harmonia subjacente. Notas cromáticas estruturais (como sensíveis aplicadas ou acordes emprestados) alteram efetivamente o acorde ou tonicizam brevemente uma tonalidade diferente.',
  },

  // ---- l4u14m4: Análise com Numerais Romanos ----

  l4u14m4e1: {
    prompt:
      'Na tonalidade de Dó maior, um acorde contém as notas F, A e C. Qual é a sua análise com numerais romanos?',
    choices: [
      'IV — tríade de Fá maior construída sobre o 4.º grau da escala',
      'ii — tríade de Ré menor em primeira inversão',
      'vi — tríade de Lá menor em primeira inversão',
      'I6/4 — Dó maior em segunda inversão',
    ],
    hint: 'F-A-C em estado fundamental é uma tríade de Fá maior. Em Dó maior, Fá é o 4.º grau da escala. Uma tríade maior no 4.º grau é notada com numeral romano maiúsculo: IV.',
  },
  l4u14m4e2: {
    prompt:
      'Na análise com numerais romanos, o que indicam os numerais maiúsculos e minúsculos?',
    choices: [
      'Maiúsculo = tríade maior; minúsculo = tríade menor',
      'Maiúsculo = estado fundamental; minúsculo = invertido',
      'Maiúsculo = acorde diatónico; minúsculo = acorde cromático',
      'Maiúsculo = função forte; minúsculo = função fraca',
    ],
    hint: 'A análise com numerais romanos codifica tanto o grau da escala como a qualidade do acorde. Maiúsculo (I, IV, V) = tríades maiores. Minúsculo (ii, iii, vi) = tríades menores. Um ° sobrescrito marca diminuto (viio), e + marca aumentado.',
  },
  l4u14m4e3: {
    prompt:
      'O que indicam os números após um numeral romano (baixo cifrado)?',
    choices: [
      'Os intervalos acima da nota do baixo, revelando a inversão do acorde',
      'Os graus da escala das notas do acorde',
      'O número de vozes a tocar o acorde',
      'A duração do acorde em tempos',
    ],
    hint: 'Os números do baixo cifrado mostram intervalos acima da nota mais grave a soar. Sem números (ou 5/3) = estado fundamental. 6 (ou 6/3) = primeira inversão. 6/4 = segunda inversão. Para acordes de sétima: 7, 6/5, 4/3, 4/2 indicam do estado fundamental até à terceira inversão.',
  },

  // ---- l4u14m5: Harmonia em Modo Menor ----

  l4u14m5e1: {
    prompt:
      'Constrói o acorde III em Lá menor (menor natural). É Dó maior: C-E-G. Seleciona as 3 notas.',
    hint: 'Em Lá menor natural (A-B-C-D-E-F-G), a tríade sobre o 3.º grau é C-E-G, uma tríade maior. Este é III — a relativa maior. É um dos acordes característicos da harmonia em modo menor.',
  },
  l4u14m5e2: {
    prompt:
      'Constrói o acorde VII em Lá menor (menor natural). É Sol maior: G-B-D. Seleciona as 3 notas.',
    hint: 'Em Lá menor natural, a tríade sobre o 7.º grau é G-B-D, uma tríade maior. VII (acorde subtónico) está a um tom abaixo da tónica, ao contrário de viio (acorde da sensível) da menor harmónica.',
  },
  l4u14m5e3: {
    prompt:
      'O que é o acorde subtónico VII na menor natural, e como difere de viio na menor harmónica?',
    choices: [
      'VII é uma tríade maior a um tom abaixo da tónica; viio é uma tríade diminuta a meio-tom abaixo — apenas viio tem função dominante',
      'VII e viio são o mesmo acorde com nomes diferentes',
      'VII é diminuto e viio é maior',
      'Ambos têm função dominante mas VII é mais forte',
    ],
    hint: 'Em Lá menor natural, VII = Sol maior (G-B-D), a um tom abaixo de A. Em Lá menor harmónica, viio = G#-B-D (diminuto), a meio-tom abaixo de A. O 7.º grau elevado (G#) cria a sensível que confere a viio a sua forte atração para a tónica.',
  },
};

export default overlay;
