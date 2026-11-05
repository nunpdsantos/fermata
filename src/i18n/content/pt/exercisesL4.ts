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
    prompt: 'O que é um retardo 4-3?',
    choices: [
      'Uma 4.ª preparada é retida e depois desce para a 3.ª',
      'Uma 4.ª não preparada é abordada por salto e depois desce para a 3.ª',
      'Uma 4.ª é atravessada por grau conjunto a caminho da 3.ª inferior',
      'Uma 4.ª antecipa o acorde seguinte antes de descer para a 3.ª',
    ],
    hint: 'Num retardo 4-3, a 4.ª acima do baixo é uma dissonância transportada (suspensa) do acorde anterior. Depois resolve por grau conjunto descendente para a 3.ª consonante.',
  },
  l4u12m1e2: {
    prompt: 'Qual é a ordem correta das três fases de um retardo?',
    choices: [
      'Preparação → retardo → resolução',
      'Retardo → resolução → preparação',
      'Resolução → retardo → preparação',
      'Resolução → preparação → retardo',
    ],
    hint: 'Um retardo tem três fases: preparação (a nota é consonante no acorde anterior), retardo (a nota é retida enquanto a harmonia muda, criando dissonância) e resolução (move-se por grau conjunto para uma consonância).',
    nudge: 'Segue a nota retida: primeiro soa como consonância num acorde, depois é mantida enquanto a harmonia muda e choca com ela, e por fim move-se por grau conjunto para uma consonância. Dá nome a cada um desses três momentos.',
  },
  l4u12m1e3: {
    prompt:
      'Na tonalidade de C maior, um acorde V está a soar e a nota C é retida do acorde IV anterior antes de resolver, a descer, para B. Que tipo de nota estranha ao acorde é o C?',
    choices: [
      'Retardo C sobre V',
      'Nota de passagem C sobre V',
      'Apogiatura C sobre V',
      'Escapada C sobre V',
    ],
    hint: 'O C era consonante no acorde IV (F-A-C), depois foi retido para o acorde V (G-B-D) onde é dissonante (uma 4.ª perfeita acima do baixo G), e resolve descendo por grau conjunto para B (a 3.ª de V, uma 3.ª maior acima de G). Este é um retardo 4-3 exemplar.',
    nudge: 'Segue o C em três momentos: era consonância no acorde IV, é mantido enquanto a harmonia muda por baixo dele (agora uma 4.ª acima do baixo G) e depois desce por grau conjunto para B. Que nota estranha ao acorde é preparada, mantida e resolvida desta forma?',
  },

  // ---- l4u12m2: Apogiatura / Escapatória ----

  l4u12m2e1: {
    prompt: 'Que padrão exemplifica uma apogiatura?',
    choices: [
      'A nota dissonante é acentuada após um salto e resolve por grau conjunto',
      'A nota passa por grau conjunto entre notas do acorde num tempo fraco',
      'A nota é ligada do acorde anterior e torna-se dissonante',
      'A nota chega antecipadamente como consonância do acorde seguinte',
    ],
    hint: 'Uma apogiatura é uma nota estranha acentuada abordada por salto e resolvida por grau conjunto na direção oposta. Ao contrário de um retardo, não tem preparação — salta diretamente para a dissonância.',
    nudge: 'Compara-a com um retardo, que é retido do acorde anterior. Uma apogiatura não é preparada e resolve por grau conjunto — então como é que a melodia chega até ela?',
  },
  l4u12m2e2: {
    prompt: 'Como é que uma escapada difere de uma nota de passagem?',
    choices: [
      "Uma escapada é abordada por grau conjunto mas parte por salto na direção oposta",
      'Uma escapada é abordada por salto mas parte por grau conjunto na direção oposta',
      'Uma escapada é abordada por grau conjunto mas parte por grau conjunto na mesma direção',
      'Uma escapada é abordada por salto mas parte por salto na mesma direção',
    ],
    hint: 'Uma escapada (échappée) move-se por grau conjunto a partir de uma nota do acorde, depois salta na direção oposta para a nota do acorde seguinte. Uma nota de passagem move-se por grau conjunto na mesma direção ao longo de todo o percurso.',
    nudge: 'Verifica duas coisas em cada nota: como é abordada e como é deixada (por grau conjunto ou por salto), e se a linha segue no mesmo sentido ou volta para trás. Uma nota de passagem move-se por grau conjunto sempre no mesmo sentido.',
  },
  l4u12m2e3: {
    prompt: 'Um B preparado é mantido sobre um acorde de C maior e resolve para C. Que nota estranha ao acorde é esta?',
    choices: [
      'Retardo ascendente',
      'Nota de passagem',
      'Escapada',
      'Apogiatura',
    ],
    hint: 'Um retardo ascendente é essencialmente um retardo que resolve por grau conjunto ascendente em vez de descendente. O exemplo mais comum é 7-8, onde a 7.ª acima do baixo resolve para cima até à oitava.',
  },

  // ---- l4u12m3: Pedal ----

  l4u12m3e1: {
    prompt: 'O que é um pedal?',
    choices: [
      'Uma nota continua a soar ou a repetir-se enquanto os acordes mudam',
      "Uma nota passa por grau conjunto entre notas do acorde enquanto a harmonia permanece",
      "Um acorde continua a soar enquanto a melodia percorre uma frase",
      "Uma parte grave segue as fundamentais sucessivas enquanto os acordes mudam",
    ],
    hint: 'Um pedal (ou nota pedal) é uma nota única — geralmente a tónica ou a dominante — sustentada numa voz enquanto as outras vozes se movem por harmonias que podem ser dissonantes contra ela. O nome vem do pedal do órgão que mantém notas no baixo.',
  },
  l4u12m3e2: {
    prompt:
      'O que é uma "cambiata" (também chamada grupo de bordaduras ou bordadura dupla)?',
    choices: [
      "Uma melodia contorna uma nota do acorde usando as duas alturas adjacentes antes de regressar",
      "Uma melodia liga duas notas do acorde por graus conjuntos na mesma direção",
      "Uma melodia repete uma nota do acorde enquanto a harmonia muda por baixo",
      "Uma melodia deixa uma nota do acorde por salto e regressa por grau conjunto",
    ],
    hint: 'Uma cambiata (grupo de bordaduras) decora uma nota do acorde movendo-se para a bordadura superior, depois para a bordadura inferior (ou vice-versa) antes de regressar. Por exemplo: C-D-B-C ornamenta a nota C.',
  },
  l4u12m3e3: {
    prompt: 'Onde é que um pedal é mais frequentemente encontrado?',
    choices: [
      'Geralmente no baixo, sobre o grau 1 ou 5',
      'Geralmente no soprano, sobre o grau 2 ou 7',
      'Geralmente numa voz interior, sobre o grau 3 ou 6',
      'Geralmente no baixo, sobre o grau 2 ou 4',
    ],
    hint: 'Embora os pedais possam ocorrer em qualquer voz (um "pedal invertido" está no soprano, um "pedal interno" está numa voz intermédia), a colocação mais comum é no baixo nos graus 1 (pedal de tónica) ou 5 (pedal de dominante).',
  },

  // ---- l4u12m4: Regras de Resolução do V7 ----

  l4u12m4e1: {
    prompt:
      'Constrói um acorde V7 na tonalidade de C maior. Seleciona as 4 notas.',
    hint: 'G7 = G, B, D, F. Fundamental (G) + 3.ª maior (B) + 5.ª perfeita (D) + 7.ª menor (F). O trítono entre B e F impulsiona a resolução para C maior.',
  },
  l4u12m4e2: {
    prompt:
      'Constrói um acorde V7 na tonalidade de G maior. Seleciona as 4 notas.',
    hint: 'D7 = D, F#, A, C. Fundamental (D) + 3.ª maior (F#) + 5.ª perfeita (A) + 7.ª menor (C). O trítono entre F# e C resolve para G maior.',
  },
  l4u12m4e3: {
    prompt: 'Como é que o trítono dentro de V7 resolve ao mover-se para I?',
    choices: [
      'A 3.ª sobe meio-tom; a 7.ª desce meio-tom',
      'A 3.ª sobe meio-tom; a 7.ª sobe meio-tom',
      'A 3.ª desce meio-tom; a 7.ª sobe meio-tom',
      'A 3.ª desce meio-tom; a 7.ª desce meio-tom',
    ],
    hint: 'Em G7 a resolver para C: B (sensível, 3.ª de V7) resolve para cima até C; F (7.ª de V7) resolve para baixo até E. O trítono B-F contrai para dentro para C-E. Este movimento contrário é o motor da resolução tonal.',
  },

  // ---- l4u12m5: Inversões de V7 ----

  l4u12m5e1: {
    prompt: 'Que símbolo de baixo cifrado representa um acorde de sétima da dominante em primeira inversão?',
    choices: [
      '6/5 — a 3.ª do acorde está no baixo',
      '4/3 — a 5.ª do acorde está no baixo',
      '4/2 — a 7.ª do acorde está no baixo',
      '7 — a fundamental está no baixo',
    ],
    hint: 'V6/5 significa que a 3.ª de V7 é a nota do baixo. Em C maior, isso significa que B é a nota mais grave de G7. Os números 6 e 5 descrevem os intervalos acima do baixo (B a G = 6.ª, B a F = 5.ª).',
  },
  l4u12m5e2: {
    prompt: 'V4/3 (V7 em segunda inversão) resolve tipicamente para que acorde?',
    choices: [
      'I ou I6, com o grau 1 ou 3 no baixo',
      'IV ou IV6, com o grau 4 ou 6 no baixo',
      'vi ou vi6, com o grau 6 ou 1 no baixo',
      'ii ou ii6, com o grau 2 ou 4 no baixo',
    ],
    hint: 'V4/3 tem a 5.ª de V7 no baixo (D em G7/D em C maior). O D resolve tipicamente por grau conjunto — desce para C (fundamental de I) ou sobe para E (dando I6). O trítono B-F continua a resolver como habitualmente.',
    nudge: 'Em C maior, o V4/3 tem D no baixo, enquanto o trítono B–F resolve como habitualmente. Que notas do acorde de tónica pode esse D alcançar por grau conjunto, e o I fica então em estado fundamental ou invertido?',
  },
  l4u12m5e3: {
    prompt: 'Em V4/2 (V7 em terceira inversão), que nota do acorde está no baixo?',
    choices: [
      'A 7.ª do acorde',
      'A fundamental do acorde',
      'A 3.ª do acorde',
      'A 5.ª do acorde',
    ],
    hint: 'V4/2 (também escrito V2) coloca a 7.ª de V7 no baixo. Em C maior, isso significa que F é a nota do baixo de G7. O F resolve por grau conjunto descendente para E, produzindo I6 (C maior em primeira inversão).',
  },

  // =========================================================================
  // Unidade 13: Acordes de Sétima Diatónicos, Função, Sequências
  // =========================================================================

  // ---- l4u13m1: Sétimas Pré-Dominantes ----

  l4u13m1e1: {
    prompt:
      'Constrói um acorde ii7 em C maior. Seleciona as 4 notas.',
    hint: 'Dm7 = D, F, A, C. Fundamental (D) + 3.ª menor (F) + 5.ª perfeita (A) + 7.ª menor (C). Este é o acorde de sétima pré-dominante mais comum em tonalidades maiores.',
  },
  l4u13m1e2: {
    prompt:
      'Constrói um acorde iiø7 em C menor. Seleciona as 4 notas.',
    hint: 'Dø7 = D, F, Ab, C. Fundamental (D) + 3.ª menor (F) + 5.ª diminuta (Ab) + 7.ª menor (C). Em tonalidades menores, o acorde ii é meio-diminuto porque a 5.ª (Ab) é baixada.',
  },
  l4u13m1e3: {
    prompt: 'Para onde conduz geralmente ii7 numa progressão funcional em modo maior?',
    choices: [
      'V ou V7',
      'I ou Imaj7',
      'vi ou vi7',
      'iii ou iii7',
    ],
    hint: 'No modelo funcional padrão T-PD-D-T, ii (e ii7) desempenha uma função pré-dominante. Cria impulso harmónico em direção a V, que depois resolve para I. A progressão ii-V-I é fundamental tanto no clássico como no jazz.',
  },

  // ---- l4u13m2: Sétimas da Mediante / Submediante ----

  l4u13m2e1: {
    prompt: 'Numa tonalidade maior, qual é a qualidade do acorde iii7?',
    choices: [
      'Sétima menor',
      'Sétima maior',
      'Sétima da dominante',
      'Sétima meio-diminuta',
    ],
    hint: 'Em C maior, iii7 = E-G-B-D. A tríade E-G-B é menor, e E a D é uma 7.ª menor (10 meios-tons). Portanto iii7 é um acorde de sétima menor, tal como ii7 e vi7.',
  },
  l4u13m2e2: {
    prompt: 'Numa tonalidade maior, qual é a qualidade do acorde vi7?',
    choices: [
      'Sétima menor',
      'Sétima maior',
      'Sétima da dominante',
      'Sétima diminuta',
    ],
    hint: 'Em C maior, vi7 = A-C-E-G. A tríade A-C-E é menor, e A a G é uma 7.ª menor (10 meios-tons). Tal como ii7 e iii7, vi7 é um acorde de sétima menor.',
  },
  l4u13m2e3: {
    prompt:
      'Qual é a qualidade do acorde de sétima diatónico sobre o grau I numa tonalidade maior?',
    choices: [
      'Sétima maior',
      'Sétima da dominante',
      'Sétima menor',
      'Sétima meio-diminuta',
    ],
    hint: 'Em C maior, Imaj7 = C-E-G-B. A 7.ª maior (B) acrescenta calor e cor à tríade de tónica sem comprometer a sua estabilidade. É uma sonoridade básica no jazz, bossa nova e muitos estilos pop.',
  },

  // ---- l4u13m3: Sétimas da Sensível ----

  l4u13m3e1: {
    prompt:
      'Constrói vii°7 em C menor (menor harmónica): o acorde de sétima diminuta sobre a sensível. Seleciona as 4 notas.',
    hint: 'B°7 = B, D, F, Ab. Fundamental (B) + 3.ª menor (D) + 5.ª diminuta (F) + 7.ª diminuta (Ab). Todos os três intervalos superiores são 3.as menores empilhadas (3+3+3 meios-tons).',
  },
  l4u13m3e2: {
    prompt:
      'Constrói viiø7 em C maior: o acorde de sétima meio-diminuta sobre a sensível. Seleciona as 4 notas.',
    hint: 'Bø7 = B, D, F, A. Fundamental (B) + 3.ª menor (D) + 5.ª diminuta (F) + 7.ª menor (A). Ao contrário do sétima diminuto, o intervalo superior é uma 3.ª maior (F a A), tornando a 7.ª menor em vez de diminuta.',
  },
  l4u13m3e3: {
    prompt:
      'Qual é a diferença fundamental entre um acorde de sétima diminuta e um de sétima meio-diminuta?',
    choices: [
      'Sétima: diminuta ou menor',
      'Terça: menor ou maior',
      'Quinta: perfeita ou diminuta',
      'Sétima: menor ou maior',
    ],
    hint: 'Ambos os acordes partilham uma tríade diminuta (3.ª menor + 5.ª diminuta). A diferença está na 7.ª: totalmente diminuto = 7.ª diminuta (enarmonicamente 6.ª maior, 9 meios-tons); meio-diminuto = 7.ª menor (10 meios-tons).',
  },

  // ---- l4u13m4: Função Harmónica T-PD-D-T ----

  l4u13m4e1: {
    prompt:
      'No modelo funcional T-PD-D-T, que função harmónica desempenha o acorde ii?',
    choices: [
      'Pré-dominante (PD) — prepara a dominante',
      'Tónica (T) — substitui o acorde de I',
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
      'ii — partilha duas notas com IV',
      'V — partilha duas notas com IV',
      'iii — partilha duas notas com IV',
      'vii° — partilha duas notas com IV',
    ],
    hint: 'Em C maior, IV = F-A-C e ii = D-F-A. Partilham F e A (duas notas comuns) e ambos criam impulso pré-dominante para V. O acorde ii é frequentemente preferido na escrita a quatro vozes porque ii-V apresenta movimento forte das fundamentais por 5.ª descendente (enquanto ii6-V dá movimento do baixo por grau conjunto, do grau 4 para o 5).',
  },

  // ---- l4u13m5: Sequências Harmónicas ----

  l4u13m5e1: {
    prompt: 'Qual é a sequência harmónica diatónica mais comum?',
    choices: [
      "Quintas descendentes",
      "Quintas ascendentes",
      "Terças descendentes",
      "Segundas ascendentes",
    ],
    hint: 'A sequência de quintas descendentes (ou ciclo de quintas) move cada fundamental uma 5.ª abaixo diatonicamente. Em C maior: C-F-B-E-A-D-G-C (I-IV-vii°-iii-vi-ii-V-I). Esta é a espinha dorsal de inúmeras progressões na música ocidental.',
    nudge: 'Pega no movimento de fundamentais de V–I e repete-o por todos os acordes da tonalidade; ii–V–I são apenas os três últimos elos dessa cadeia.',
  },
  l4u13m5e2: {
    prompt:
      'Qual é o padrão de movimento das fundamentais em I-ii-iii-IV?',
    choices: [
      'Cada fundamental sobe uma segunda diatónica',
      'Cada fundamental desce uma segunda diatónica',
      'Cada fundamental sobe uma terça diatónica',
      'Cada fundamental desce uma terça diatónica',
    ],
    hint: 'Uma sequência de segundas ascendentes move cada fundamental por grau conjunto ascendente ao longo da escala. Embora menos comum do que as quintas descendentes, cria um forte sentido de movimento para a frente. É frequentemente combinada com inversões alternadas para suavizar a condução de vozes.',
  },
  l4u13m5e3: {
    prompt: 'O que define uma sequência harmónica?',
    choices: [
      "Um modelo harmónico retomado mais acima ou mais abaixo ao longo da passagem",
      "Um único acorde repetido várias vezes enquanto a melodia por cima sobe grau a grau",
      "Uma melodia tocada em oitavas diferentes",
      "Uma fórmula cadencial repetida sem qualquer alteração no fim de cada uma das frases",
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
      'Nota contra nota, usando apenas consonâncias',
      'Duas notas contra uma, usando apenas consonâncias',
      'Nota contra nota, permitindo dissonâncias de passagem',
      'Duas notas contra uma, permitindo dissonâncias de passagem',
    ],
    hint: 'A primeira espécie (1:1) é o contraponto mais simples: uma nota na voz acrescentada para cada nota do cantus firmus. Cada intervalo vertical deve ser consonante (3.as, 5.as, 6.as, oitavas, uníssonos). Nenhuma dissonância é permitida.',
  },
  l4u14m1e2: {
    prompt:
      'Que intervalos são considerados consonantes no contraponto de espécies?',
    choices: [
      'Uníssonos, 3.as, 5.as, 6.as e oitavas',
      'Uníssonos, 2.as, 5.as, 6.as e oitavas',
      'Uníssonos, 3.as, 5.as, 7.as e oitavas',
      'Uníssonos, 2.as, 5.as, 7.as e oitavas',
    ],
    hint: 'No contraponto a duas vozes, as consonâncias são: consonâncias perfeitas (uníssono, 5P, 8P) e consonâncias imperfeitas (3m, 3M, 6m, 6M). A 4.ª perfeita é tratada como dissonância no contraponto a duas vozes. Segundas, 7.as e trítonos são dissonantes.',
  },
  l4u14m1e3: {
    prompt:
      'No contraponto de segunda espécie, como são tratadas as dissonâncias (como notas de passagem)?',
    choices: [
      'As dissonâncias podem ocorrer apenas nos tempos fracos, alcançadas e deixadas por grau na mesma direção',
      'As dissonâncias podem ocorrer apenas nos tempos fortes, alcançadas e deixadas por grau na mesma direção',
      'As dissonâncias podem ocorrer apenas nos tempos fracos, alcançadas por salto e deixadas por grau na mesma direção',
      'As dissonâncias podem ocorrer apenas nos tempos fracos, alcançadas por grau e deixadas por salto na mesma direção',
    ],
    hint: 'A segunda espécie (2:1) tem duas notas contra cada nota do cantus firmus. Tempos fortes devem ser consonantes. Tempos fracos podem incluir notas de passagem — dissonâncias por grau conjunto que ligam duas consonâncias. Isto introduz dissonância controlada.',
  },

  // ---- l4u14m2: Compassos Assimétricos ----

  l4u14m2e1: {
    prompt: 'Como é tipicamente agrupado o compasso 5/4?',
    choices: [
      'Grupos de 3+2 ou 2+3 tempos de semínima',
      'Grupos de 4+1 ou 1+4 tempos de semínima',
      'Grupos de 2,5+2,5 tempos de semínima',
      'Grupos de 1+1+1+1+1 tempos de semínima',
    ],
    hint: '5/4 é um compasso assimétrico (ou irregular). Não pode ser dividido em grupos iguais, por isso divide-se como 3+2 ou 2+3. A escolha do agrupamento afeta o padrão de acentos e o carácter rítmico.',
  },
  l4u14m2e2: {
    prompt: 'Como funciona o compasso 7/8 como compasso aditivo?',
    choices: [
      'Grupos desiguais de colcheias, ex. 2+2+3',
      'Compasso composto com tempos de semínima pontuada',
      'Sete tempos principais iguais, como num compasso simples',
      "Compassos alternados de colcheias, ex. um compasso de 3/8 seguido de um de 4/8",
    ],
    hint: '7/8 é um compasso aditivo: 7 colcheias são agrupadas em subtempos desiguais. Agrupamentos comuns são 2+2+3 (curto-curto-longo), 3+2+2 (longo-curto-curto) ou 2+3+2. O grupo longo soa como um tempo ligeiramente esticado.',
  },
  l4u14m2e3: {
    prompt:
      'O que significa a indicação de compasso "tempo cortado" (alla breve, C com uma linha vertical)?',
    choices: [
      '2/2 — dois tempos de mínima por compasso, sentido em dois em vez de quatro',
      '4/4 tocado ao dobro da velocidade',
      '2/4 — dois tempos de semínima por compasso, com o andamento reduzido a metade',
      'Qualquer indicação de compasso onde os valores das notas são reduzidos a metade',
    ],
    hint: 'O tempo cortado (alla breve) é 2/2: dois tempos de mínima por compasso. Um compasso de 2/2 tem a mesma duração total que um de 4/4, mas conta-se em 2 (tempo de mínima) em vez de 4 (tempo de semínima) — as mesmas notas sentidas em dois tempos, dando uma pulsação mais ampla e fluida.',
  },

  // ---- l4u14m3: Ornamentação Cromática ----

  l4u14m3e1: {
    prompt: 'O que é uma nota de passagem cromática?',
    choices: [
      'Uma nota que preenche um tom entre duas notas diatónicas, movendo-se por meios-tons',
      'Uma nota que ornamenta uma nota diatónica por meio-tom e regressa a essa mesma nota',
      'Uma nota que liga duas notas diatónicas com um salto de entrada e um salto de saída',
      'Uma nota que antecipa o acorde seguinte e mantém a mesma altura quando esse acorde chega',
    ],
    hint: 'Uma nota de passagem cromática preenche o intervalo entre duas notas diatónicas que estão a um tom de distância. Por exemplo, entre C e D, um C# como nota de passagem cromática cria movimento suave por meio-tom: C-C#-D.',
  },
  l4u14m3e2: {
    prompt: 'O que é uma bordadura cromática?',
    choices: [
      'Uma nota fora da tonalidade que se afasta e regressa por grau conjunto à mesma nota do acorde',
      'Uma nota dentro da tonalidade que se afasta e regressa por grau conjunto à mesma nota do acorde',
      'Uma nota fora da tonalidade que passa por grau conjunto entre duas notas diferentes do acorde',
      'Uma nota dentro da tonalidade que passa por grau conjunto entre duas notas diferentes do acorde',
    ],
    hint: 'Uma bordadura cromática é um ornamento que se move por meio-tom a partir de uma nota do acorde e regressa: ex. E-D#-E (inferior) ou G-Ab-G (superior). Acrescenta cor sem alterar a direção harmónica, funcionando como decoração de superfície.',
    nudge: 'Junta as duas palavras: o que faz uma bordadura depois de deixar a nota do acorde, e o que te diz "cromática" sobre o tamanho do passo?',
  },
  l4u14m3e3: {
    prompt:
      'Como se distingue uma ornamentação cromática de uma nota cromática estrutural (como uma sensível secundária)?',
    choices: [
      'Só as notas estruturais mudam a harmonia',
      'Não há diferença; todas as notas cromáticas são ornamentações',
      'Ornamentações duram mais do que notas estruturais',
      'Notas estruturais estão sempre no baixo enquanto ornamentações estão nas vozes superiores',
    ],
    hint: 'Ornamentações cromáticas (notas de passagem, bordaduras) são decorações de superfície que não afetam a harmonia subjacente. Notas cromáticas estruturais (como sensíveis aplicadas ou acordes emprestados) alteram efetivamente o acorde ou tonicizam brevemente uma tonalidade diferente.',
    nudge: 'Faz um teste de remoção: tira a nota cromática (ou repõe a sua forma diatónica) e pergunta-te o que se perde — só um toque de cor, ou a própria identidade do acorde?',
  },

  // ---- l4u14m4: Análise com Numerais Romanos ----

  l4u14m4e1: {
    prompt:
      'Na tonalidade de C maior, um acorde contém as notas F, A e C. Qual é a sua análise com numerais romanos?',
    choices: [
      'IV — tríade de F maior construída sobre o 4.º grau da escala',
      'ii — tríade de D menor em primeira inversão, com F no baixo',
      'vi — tríade de A menor em primeira inversão',
      'I6/4 — C maior em segunda inversão',
    ],
    hint: 'F-A-C em estado fundamental é uma tríade de F maior. Em C maior, F é o 4.º grau da escala. Uma tríade maior no 4.º grau é notada com numeral romano maiúsculo: IV.',
  },
  l4u14m4e2: {
    prompt:
      'Na análise com numerais romanos, o que indicam os numerais maiúsculos e minúsculos?',
    choices: [
      "Maiúsculo = tríade maior; minúsculo = tríade menor",
      'Maiúsculo = tríade menor; minúsculo = tríade maior',
      'Maiúsculo = estado fundamental; minúsculo = tríade invertida',
      'Maiúsculo = tríade invertida; minúsculo = estado fundamental',
    ],
    hint: 'A análise com numerais romanos codifica tanto o grau da escala como a qualidade do acorde. Maiúsculo (I, IV, V) = tríades maiores. Minúsculo (ii, iii, vi) = tríades menores. Um ° sobrescrito marca diminuto (vii°), e + marca aumentado.',
  },
  l4u14m4e3: {
    prompt:
      'O que indicam os números após um numeral romano (baixo cifrado)?',
    choices: [
      'A distância de cada altura superior à altura mais grave, especificando o estado do acorde',
      "O grau da escala de cada altura superior na tonalidade, especificando o seu lugar na escala",
      "O número de partes separadas acima da altura mais grave, especificando o tamanho do conjunto",
      "A duração de cada altura superior em tempos, especificando o seu lugar dentro do compasso",
    ],
    hint: 'Os números do baixo cifrado mostram intervalos acima da nota mais grave a soar. Sem números (ou 5/3) = estado fundamental. 6 (ou 6/3) = primeira inversão. 6/4 = segunda inversão. Para acordes de sétima: 7, 6/5, 4/3, 4/2 indicam do estado fundamental até à terceira inversão.',
  },

  // ---- l4u14m5: Harmonia em Modo Menor ----

  l4u14m5e1: {
    prompt:
      'Constrói o acorde III em A menor (menor natural). Seleciona as 3 notas.',
    hint: 'Em A menor natural (A-B-C-D-E-F-G), a tríade sobre o 3.º grau é C-E-G, uma tríade maior. Este é III — a relativa maior. É um dos acordes característicos da harmonia em modo menor.',
  },
  l4u14m5e2: {
    prompt:
      'Constrói o acorde VII em A menor (menor natural). Seleciona as 3 notas.',
    hint: 'Em A menor natural, a tríade sobre o 7.º grau é G-B-D, uma tríade maior. VII (acorde subtónico) está a um tom abaixo da tónica, ao contrário de vii° (acorde da sensível) da menor harmónica.',
  },
  l4u14m5e3: {
    prompt:
      'O que é o acorde subtónico VII na menor natural, e como difere de vii° na menor harmónica?',
    choices: [
      "VII é maior, um tom abaixo; vii° é diminuto, meio-tom abaixo",
      "VII é diminuto, um tom abaixo; vii° é maior, meio-tom abaixo",
      "VII é maior, meio-tom abaixo; vii° é diminuto, um tom abaixo",
      "VII é diminuto, meio-tom abaixo; vii° é maior, um tom abaixo",
    ],
    hint: 'Em A menor natural, VII = G maior (G-B-D), a um tom abaixo de A. Em A menor harmónica, vii° = G#-B-D (diminuto), a meio-tom abaixo de A. O 7.º grau elevado (G#) cria a sensível que confere a vii° a sua forte atração para a tónica.',
    nudge: 'Em A menor, constrói duas vezes a tríade sobre o 7.º grau: uma com G (menor natural) e outra com G# (menor harmónica). Verifica a qualidade de cada acorde e a que distância fica a sua fundamental abaixo de A.',
  },
};

export default overlay;
