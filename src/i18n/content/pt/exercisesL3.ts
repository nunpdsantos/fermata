import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese translations for Level 3 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidade 9: Acordes de Sétima e Harmonia Diatónica
  // =========================================================================

  // ---- l3u9m1: Acordes de Sétima — Cinco Qualidades ----

  l3u9m1e1: {
    prompt:
      'Constrói um acorde de Cmaj7. Seleciona as 4 notas: fundamental, 3.ª maior, 5.ª perfeita e 7.ª maior.',
    hint: 'Cmaj7 = C, E, G, B. Uma tríade maior (C-E-G) mais uma 7.ª maior (B, 11 meios-tons acima da fundamental).',
  },
  l3u9m1e2: {
    prompt:
      'Constrói um acorde de Dm7. Seleciona as 4 notas: fundamental, 3.ª menor, 5.ª perfeita e 7.ª menor.',
    hint: 'Dm7 = D, F, A, C. Uma tríade menor (D-F-A) mais uma 7.ª menor (C, 10 meios-tons acima da fundamental).',
  },
  l3u9m1e3: {
    prompt: 'Qual qualidade de acorde de sétima tem uma tríade maior com uma 7.ª menor?',
    choices: [
      'Sétima da dominante',
      'Sétima maior',
      'Sétima menor',
      'Sétima meio-diminuta',
    ],
    hint: 'A sétima da dominante (ex.: G7) combina uma tríade maior com uma 7.ª menor. É o único tipo de acorde de sétima com esta combinação, criando forte tensão que resolve para a tónica.',
    nudge: 'Constrói um acorde de sétima sobre cada grau de C maior, só com teclas brancas, e procura o que tem uma tríade maior com uma 7.ª menor. O tipo de acorde tem o nome desse grau.',
  },
  l3u9m1e4: {
    prompt: 'Qual é a diferença entre um acorde de sétima meio-diminuto e um totalmente diminuto?',
    choices: [
      'O meio-diminuto tem 7.ª menor; o totalmente diminuto tem 7.ª diminuta',
      "O meio-diminuto tem 7.ª menor; o totalmente diminuto tem 7.ª menor",
      "O meio-diminuto tem 7.ª diminuta; o totalmente diminuto tem 7.ª menor",
      "O meio-diminuto tem 7.ª diminuta; o totalmente diminuto tem 7.ª diminuta",
    ],
    hint: 'Ambos partilham uma tríade diminuta (fundamental, 3m, 5.ª diminuta). O meio-diminuto acrescenta uma 7.ª menor (10 meios-tons), enquanto o totalmente diminuto acrescenta uma 7.ª diminuta (9 meios-tons).',
  },
  l3u9m1e_ear1: {
    prompt: 'Ouve este acorde de sétima e identifica a sua qualidade.',
    choices: [
      'Sétima maior',
      'Sétima da dominante',
      'Sétima menor',
      'Sétima meio-diminuta',
    ],
    hint: 'Um acorde de sétima maior: uma tríade maior mais uma 7.ª maior (C-E-G-B). Caloroso e rico — a 7.ª fica apenas meio-tom abaixo da oitava.',
    nudge: 'Ouve em dois passos. Primeiro, a tríade de base: brilhante (maior), suave (menor) ou tensa e oca (diminuta)? Depois, a 7.ª no topo: está colada à fundamental uma oitava acima, a roçar nela, ou um tom abaixo dela?',
  },
  l3u9m1e_ear2: {
    prompt: 'Ouve este acorde de sétima e identifica a sua qualidade.',
    choices: [
      'Sétima maior',
      'Sétima da dominante',
      'Sétima menor',
      'Sétima meio-diminuta',
    ],
    hint: 'Um acorde de sétima menor: uma tríade menor mais uma 7.ª menor (A-C-E-G). Suave e macio, sem a atração inquieta da sétima da dominante.',
    nudge: 'Ouve em dois passos. Primeiro, a tríade de base: brilhante (maior), suave (menor) ou tensa e oca (diminuta)? Depois, a 7.ª no topo: está colada à fundamental uma oitava acima, a roçar nela, ou um tom abaixo dela?',
  },
  l3u9m1e_ear3: {
    prompt: 'Ouve este acorde de sétima e identifica a sua qualidade.',
    choices: [
      'Sétima maior',
      'Sétima da dominante',
      'Sétima menor',
      'Sétima meio-diminuta',
    ],
    hint: 'Um acorde de sétima da dominante: uma tríade maior mais uma 7.ª menor (D-F#-A-C). O trítono F#-C dentro dele torna-o inquieto — quer resolver.',
    nudge: 'Ouve em dois passos. Primeiro, a tríade de base: brilhante (maior), suave (menor) ou tensa e oca (diminuta)? Depois, a 7.ª no topo: está colada à fundamental uma oitava acima, a roçar nela, ou um tom abaixo dela?',
  },
  l3u9m1e_ear4: {
    prompt: 'Ouve este acorde de sétima e identifica a sua qualidade.',
    choices: [
      'Sétima maior',
      'Sétima da dominante',
      'Sétima menor',
      'Sétima meio-diminuta',
    ],
    hint: 'Um acorde de sétima meio-diminuta: uma tríade diminuta mais uma 7.ª menor (E-G-Bb-D). Sombrio e instável — como um acorde de sétima menor com a 5.ª baixada.',
    nudge: 'Ouve em dois passos. Primeiro, a tríade de base: brilhante (maior), suave (menor) ou tensa e oca (diminuta)? Depois, a 7.ª no topo: está colada à fundamental uma oitava acima, a roçar nela, ou um tom abaixo dela?',
  },

  // ---- l3u9m2: Inversões de Acordes de Sétima ----

  l3u9m2e1: {
    prompt: 'Qual símbolo de baixo cifrado representa um acorde de sétima em estado fundamental?',
    choices: [
      '7 (abreviatura de 7/5/3)',
      '6/5 (abreviatura de 6/5/3)',
      '4/3 (abreviatura de 6/4/3)',
      '4/2 (abreviatura de 6/4/2)',
    ],
    hint: 'Em estado fundamental, os intervalos acima do baixo são 3.ª, 5.ª e 7.ª. A cifragem completa 7/5/3 é abreviada para apenas 7.',
  },
  l3u9m2e2: {
    prompt: 'Qual símbolo de baixo cifrado representa um acorde de sétima na primeira inversão?',
    choices: [
      '6/5 (abreviatura de 6/5/3)',
      '7 (abreviatura de 7/5/3)',
      '4/3 (abreviatura de 6/4/3)',
      '4/2 (abreviatura de 6/4/2)',
    ],
    hint: 'A primeira inversão coloca a 3.ª do acorde no baixo. Os intervalos característicos acima do baixo são uma 6.ª e uma 5.ª, resultando no símbolo 6/5.',
  },
  l3u9m2e3: {
    prompt: 'Qual símbolo de baixo cifrado representa um acorde de sétima na terceira inversão?',
    choices: [
      '4/2 (abreviatura de 6/4/2)',
      '6/5 (abreviatura de 6/5/3)',
      '4/3 (abreviatura de 6/4/3)',
      '7 (abreviatura de 7/5/3)',
    ],
    hint: 'A terceira inversão coloca a 7.ª do acorde no baixo. Os intervalos acima do baixo são uma 2.ª e uma 4.ª, resultando no símbolo 4/2 (ou 2).',
  },

  // ---- l3u9m3: Acordes de Sétima Diatónicos em Maior ----

  l3u9m3e1: {
    prompt:
      'Constrói um acorde de G7 (sétima da dominante). Este é o V7 em C maior. Seleciona as 4 notas.',
    hint: 'G7 = G, B, D, F. Uma tríade maior (G-B-D) mais uma 7.ª menor (F, 10 meios-tons acima de G). O trítono B-F impulsiona a resolução para C.',
  },
  l3u9m3e2: {
    prompt:
      'Constrói um acorde de Am7. Este é o vi7 em C maior. Seleciona as 4 notas.',
    hint: 'Am7 = A, C, E, G. Uma tríade menor (A-C-E) mais uma 7.ª menor (G, 10 meios-tons acima de A).',
  },
  l3u9m3e3: {
    prompt: 'O acorde V7 contém um trítono. Quais duas notas o formam na tonalidade de C maior?',
    choices: [
      'B e F — a sensível e o 4.º grau da escala',
      "G e D — a fundamental do acorde e o 2.º grau da escala",
      "G e B — a fundamental do acorde e a sensível",
      "D e F — o 2.º grau da escala e o 4.º grau da escala",
    ],
    hint: 'Em G7 (G-B-D-F), o trítono está entre B (a 3.ª) e F (a 7.ª), abrangendo 6 meios-tons. B resolve para cima, para C, enquanto F resolve para baixo, para E, criando a resolução V7-I.',
  },

  // ---- l3u9m4: Acordes de Sétima Diatónicos em Menor ----

  l3u9m4e1: {
    prompt:
      'Constrói um acorde de E7 (V7 em A menor, usando a menor harmónica). Seleciona as 4 notas.',
    hint: 'E7 = E, G#, B, D. O G# provém do 7.º grau elevado de A menor harmónica. Este acorde de sétima da dominante fornece a sensível (G#) que resolve para A.',
  },
  l3u9m4e2: {
    prompt:
      'Em A menor harmónica, que tríade se constrói sobre o sétimo grau elevado, G#?',
    choices: [
      'Diminuta',
      'Aumentada',
      'Maior',
      'Menor',
    ],
    hint: 'Em A menor natural, VII é G-B-D (maior). Elevar G para G# na menor harmónica dá G#-B-D, que é uma tríade diminuta (fundamental à 3.ª = 3m, fundamental à 5.ª = 5.ª diminuta).',
  },
  l3u9m4e3: {
    prompt:
      'Qual é a qualidade do acorde de sétima construído sobre o 2.º grau da menor harmónica (ii em A menor = B)?',
    choices: [
      'Sétima meio-diminuta (m7b5)',
      "Sétima menor (m7)",
      "Sétima diminuta (dim7)",
      "Sétima da dominante (7)",
    ],
    hint: 'Em A menor harmónica, o ii7 é B-D-F-A: uma tríade diminuta (B-D-F) mais uma 7.ª menor (A). Esta combinação chama-se meio-diminuta, escrita Bm7b5 ou B\u00f8.',
  },

  // =========================================================================
  // Unidade 10: Condução de Vozes e Escrita a Partes
  // =========================================================================

  // ---- l3u10m1: Noções Básicas de SATB ----

  l3u10m1e1: {
    prompt: 'Qual é a tessitura padrão para a voz de soprano na escrita SATB?',
    choices: [
      'C4 a G5',
      'C3 a G4',
      'F3 a C5',
      'E2 a C4',
    ],
    hint: 'O soprano é a voz mais aguda em SATB. A sua tessitura prática vai aproximadamente de C4 (C central) a G5. Ultrapassar esta tessitura torna a parte difícil de cantar.',
  },
  l3u10m1e2: {
    prompt: 'Na escrita SATB, qual tipo de movimento entre duas vozes é geralmente proibido?',
    choices: [
      'Movimento paralelo em 5.as ou 8.as perfeitas',
      'Movimento contrário em qualquer intervalo',
      'Movimento oblíquo em que uma voz se mantém na mesma nota',
      'Movimento direto em 3.as',
    ],
    hint: 'As 5.as e 8.as perfeitas paralelas são evitadas porque comprometem a independência das vozes. Cada voz deve soar como a sua própria linha melódica, e paralelas perfeitas fazem as vozes fundirem-se.',
    nudge: 'A regra protege a independência de cada voz. Que movimento faz duas vozes fundirem-se numa só, ao moverem-se juntas mantendo a mesma consonância de som aberto e oco?',
  },
  l3u10m1e3: {
    prompt: 'Em tríades em estado fundamental, qual nota do acorde deve ser tipicamente dobrada?',
    choices: [
      'A fundamental do acorde',
      'A 3.ª do acorde',
      'A 5.ª do acorde',
      'Qualquer nota do acorde igualmente',
    ],
    hint: 'Dobrar a fundamental reforça a identidade do acorde e é a escolha mais segura. Evita dobrar a sensível (7.º grau) ou outras notas com tendência de resolução, pois cria problemas na resolução.',
  },

  // ---- l3u10m2: Quintas e Oitavas Paralelas Proibidas ----

  l3u10m2e1: {
    prompt: 'Porque são as quintas perfeitas paralelas consideradas problemáticas na condução de vozes?',
    choices: [
      'Destroem a independência das vozes ao fazer duas vozes soarem como uma só',
      'Costumam transformar a quinta consonante entre duas vozes numa dissonância harmónica',
      'Costumam colocar ambas as vozes fora da tessitura que os cantores conseguem produzir',
      'Alteram as durações escritas quando duas vozes se movem na mesma direção',
    ],
    hint: 'Os intervalos perfeitos (uníssonos, 5.as, 8.as) têm forte fusão acústica. Quando duas vozes se movem em 5.as paralelas, perdem a sua identidade individual, reduzindo o número de linhas independentes percecionadas.',
  },
  l3u10m2e2: {
    prompt: "Que definições descrevem corretamente os quatro tipos de movimento entre duas vozes?",
    choices: [
      'Contrário: direções opostas; paralelo: mesma direção e intervalo; direto: mesma direção, intervalos diferentes; oblíquo: uma voz fica parada',
      'Contrário: direções opostas; paralelo: mesma direção, intervalos diferentes; direto: mesma direção e intervalo; oblíquo: uma voz fica parada',
      'Contrário: direções opostas; paralelo: mesma direção e intervalo; direto: uma voz fica parada; oblíquo: mesma direção, intervalos diferentes',
      'Contrário: direções opostas; paralelo: uma voz fica parada; direto: mesma direção, intervalos diferentes; oblíquo: mesma direção e intervalo',
    ],
    hint: 'Paralelo = mesma direção, mesmo intervalo. Direto = mesma direção, intervalo diferente. Oblíquo = uma voz move-se, a outra mantém-se. Contrário = direções opostas.',
    nudge: 'Classifica pela forma como duas vozes se movem uma em relação à outra: na mesma direção ou em direções opostas, mantendo o mesmo intervalo ou mudando-o, ou com uma voz parada.',
  },
  l3u10m2e3: {
    prompt: 'Que tipo de movimento de vozes é mais eficaz para criar linhas de vozes independentes?',
    choices: [
      'Movimento contrário — as vozes movem-se em direções opostas',
      'Movimento paralelo — as vozes movem-se na mesma direção pelo mesmo intervalo',
      'Movimento direto — as vozes movem-se na mesma direção por intervalos diferentes',
      'Todos os tipos são igualmente eficazes',
    ],
    hint: 'O movimento contrário maximiza a independência das vozes porque as vozes viajam em direções opostas. Este é o tipo de movimento mais valorizado no contraponto e na escrita a partes.',
    nudge: 'Independência significa que cada voz mantém o seu próprio contorno. Que movimento torna as duas linhas menos parecidas, de modo que nenhuma pareça seguir a outra?',
  },

  // ---- l3u10m3: Escrita a Partes em Estado Fundamental ----

  l3u10m3e1: {
    prompt:
      'Quando dois acordes em estado fundamental têm fundamentais a uma 5.ª de distância (ex.: I para V), que técnica de condução de vozes é mais importante?',
    choices: [
      "Manter a nota comum na mesma voz e mover as outras por grau conjunto",
      "Transferir a nota comum para outra voz e mover as outras por grau conjunto",
      "Manter a nota comum na mesma voz e mover as outras em paralelo com o baixo",
      "Transferir a nota comum para outra voz e mover as outras em paralelo com o baixo",
    ],
    hint: 'Quando as fundamentais se movem por 5.ª (ou 4.ª), os dois acordes partilham uma nota comum. Mantê-la na mesma voz garante uma condução de vozes suave enquanto as outras vozes se movem por grau conjunto.',
    nudge: 'Escreve I e V em C maior e encontra a nota que têm em comum. Como pode essa nota ajudar cada voz a mover-se o mínimo possível?',
  },
  l3u10m3e2: {
    prompt:
      'Quando dois acordes em estado fundamental têm fundamentais a uma 2.ª de distância (ex.: IV para V), qual é a melhor abordagem de condução de vozes?',
    choices: [
      'Mover as três vozes superiores em movimento contrário ao baixo',
      'Mover as vozes superiores em movimento paralelo com o baixo',
      'Manter uma nota comum enquanto o baixo se move por grau',
      'Mover soprano e baixo em oitavas paralelas',
    ],
    hint: 'Quando as fundamentais se movem por grau, não há notas comuns. Mover as vozes superiores em contrário ao baixo previne quintas e oitavas paralelas, mantendo o movimento de vozes suave.',
  },
  l3u10m3e3: {
    prompt: 'O que é a "lei do caminho mais curto" na condução de vozes?',
    choices: [
      'Cada voz superior move-se para a nota mais próxima do acorde seguinte',
      'Cada voz superior mantém a mesma nota em todas as mudanças de acorde',
      'Cada voz superior segue o baixo na mesma direção',
      'Cada voz superior move-se por salto enquanto o baixo se move por grau',
    ],
    hint: 'Uma condução de vozes suave minimiza a distância que cada voz percorre. Movimento por grau (ou manutenção da nota comum) é preferido em relação a saltos, produzindo linhas mais cantáveis e ligadas.',
  },

  // ---- l3u10m4: Tríades em Inversão ----

  l3u10m4e1: {
    prompt: 'Qual é o símbolo de baixo cifrado para uma tríade na primeira inversão?',
    choices: [
      '6 (abreviatura de 6/3)',
      '5/3 (muitas vezes omitido)',
      '6/4 (escrito sempre por extenso)',
      '7 (abreviatura de 7/5/3)',
    ],
    hint: 'A primeira inversão coloca a 3.ª do acorde no baixo. Os intervalos acima do baixo são uma 3.ª e uma 6.ª. O 6/3 completo é abreviado para apenas 6.',
  },
  l3u10m4e2: {
    prompt: 'O acorde cadencial 6/4 ocorre em que parte da cadência?',
    choices: [
      'Num tempo forte, preparando V na cadência',
      'Num tempo fraco, preparando V na cadência',
      'Num tempo forte, seguindo V na cadência',
      'Num tempo fraco, seguindo V na cadência',
    ],
    hint: 'O 6/4 cadencial (I6/4) funciona como uma decoração da dominante. Aparece num tempo forte com o baixo no 5.º grau, e a 6.ª e a 4.ª acima do baixo descem por grau conjunto para a 5.ª e a 3.ª para formar V.',
  },
  l3u10m4e3: {
    prompt: 'Porque é a segunda inversão (6/4) usada com mais cuidado do que a primeira inversão?',
    choices: [
      'A 4.ª acima do baixo é uma dissonância que requer resolução específica',
      'A 6.ª acima do baixo é uma dissonância que geralmente resolve numa oitava',
      'A 5.ª no baixo é uma nota instável que tem de resolver descendo por grau',
      'A inversão transforma uma tríade maior consonante numa tríade diminuta dissonante',
    ],
    hint: 'A 4.ª perfeita acima do baixo (na posição 6/4) era tratada como dissonância na harmonia de prática comum. Aparece tipicamente em quatro contextos específicos: 6/4 cadencial, de passagem, de pedal e arpejado.',
  },

  // =========================================================================
  // Unidade 11: Cadências, Frases, Ornamentação
  // =========================================================================

  // ---- l3u11m1: Cadências ----

  l3u11m1e1: {
    prompt: 'O que define uma Cadência Perfeita (CAP)?',
    choices: [
      'V para I, ambos em estado fundamental, com a tónica no soprano',
      'V para I, ambos na 1.ª inversão, com a tónica no soprano',
      'V para I, ambos em estado fundamental, com a 3.ª de I no soprano',
      'V para I, ambos em estado fundamental, com a 5.ª de I no soprano',
    ],
    hint: 'Uma CAP tem três requisitos: (1) V vai para I, (2) ambos os acordes estão em estado fundamental, e (3) o soprano termina na nota tónica (1.º grau). É o tipo de cadência mais forte.',
  },
  l3u11m1e2: {
    prompt: 'Em que acorde termina uma meia cadência?',
    choices: [
      'V',
      'IV',
      'vi',
      'I',
    ],
    hint: 'Uma meia cadência termina em V, criando uma sensação aberta e não resolvida — como uma vírgula numa frase. O acorde que precede V pode ser, por exemplo, I, ii, IV ou vi. Exige continuação.',
  },
  l3u11m1e3: {
    prompt: 'Numa cadência interrompida, o que acontece?',
    choices: [
      'V resolve para vi em vez do esperado I',
      'I resolve para V em vez do esperado IV',
      'IV resolve para ii em vez de V',
      'A cadência é tocada mais piano do que o esperado',
    ],
    hint: 'A cadência interrompida (V para vi) cria a expetativa de resolução para I mas "engana" o ouvinte ao ir para vi. Vi partilha duas notas com I, tornando-a uma substituição suave mas surpreendente.',
  },
  l3u11m1e4: {
    prompt: 'O que é uma cadência plagal?',
    choices: [
      'IV para I',
      'V para I',
      'V para vi',
      'ii para V',
    ],
    hint: 'A cadência plagal move-se de IV para I. É frequentemente chamada a cadência do "Amen" porque é tradicionalmente usada no final de hinos. Tem uma qualidade mais suave e menos impulsionada do que V-I.',
  },

  // ---- l3u11m2: Frases e Períodos ----

  l3u11m2e1: {
    prompt: 'O que é um período antecedente-consequente?',
    choices: [
      'Duas frases: a primeira termina com uma cadência mais fraca, a segunda com uma mais forte',
      'Duas frases: a primeira termina com uma cadência mais forte, a segunda com uma mais fraca',
      'Duas frases: ambas partilham uma ideia básica e terminam com a mesma cadência fraca',
      'Duas frases: a primeira é uma continuação, a segunda repete a ideia básica',
    ],
    hint: 'O antecedente termina com uma cadência mais fraca, geralmente uma meia cadência ou uma cadência imperfeita (CAI). O consequente responde com uma cadência mais forte, geralmente uma cadência perfeita (CAP). É o aumento da força cadencial que liga as duas frases.',
  },
  l3u11m2e2: {
    prompt: 'O que torna um período paralelo diferente de um período contrastante?',
    choices: [
      'Um período paralelo começa ambas as frases com material melódico semelhante',
      'Um período paralelo tem duas frases com a mesma duração',
      'Um período paralelo usa a mesma cadência no final de ambas as frases',
      'Um período paralelo tem vozes a mover-se em movimento paralelo',
    ],
    hint: 'Num período paralelo, a frase consequente começa como o antecedente mas diverge para alcançar uma cadência mais forte. Num período contrastante, as duas frases começam com ideias melódicas diferentes.',
  },
  l3u11m2e3: {
    prompt: 'Na estrutura clássica de "frase" (Satz), o que acontece depois da apresentação (a ideia básica e a sua repetição)?',
    choices: [
      'Uma continuação que fragmenta e acelera em direção a uma cadência',
      'Uma continuação que apresenta a ideia básica uma terceira vez sem alterações antes da cadência',
      "Uma continuação que abandona a cadência e reinicia a ideia básica",
      'Uma continuação que responde à apresentação com uma frase contrastante, como num período',
    ],
    hint: 'A frase clássica tem duas partes: uma apresentação (ideia básica + repetição) e uma continuação (fragmentação + aceleração em direção a uma cadência). A continuação impulsiona a frase até à sua conclusão.',
  },

  // ---- l3u11m3: Ritmo Harmónico ----

  l3u11m3e1: {
    prompt: 'O ritmo harmónico mede a frequência de mudança de que elemento musical?',
    choices: [
      'Os acordes',
      'A melodia',
      'O andamento',
      'A figuração do acompanhamento',
    ],
    hint: 'O ritmo harmónico refere-se à frequência com que a harmonia subjacente muda, independentemente da atividade rítmica de superfície. Uma passagem pode ter ritmo melódico rápido mas ritmo harmónico lento (um acorde por compasso).',
  },
  l3u11m3e2: {
    prompt: 'Como se comporta tipicamente o ritmo harmónico à medida que se aproxima uma cadência?',
    choices: [
      'Acelera — os acordes mudam mais vezes perto da cadência',
      'Abranda — os acordes mudam menos vezes à medida que a cadência se aproxima',
      'Mantém-se igual — os acordes mudam ao mesmo ritmo perto da cadência',
      'Abranda — um único acorde costuma prolongar-se através da cadência final',
    ],
    hint: 'A aceleração cadencial é uma técnica comum: as mudanças de acorde aceleram perto das cadências, criando uma sensação de impulso e chegada. Por exemplo, os acordes podem mudar a cada compasso, depois a cada dois tempos, depois a cada tempo na cadência.',
  },
  l3u11m3e3: {
    prompt: 'Como difere o efeito do ritmo harmónico lento do rápido?',
    choices: [
      'Lento cria estabilidade e repouso; rápido cria tensão e impulso',
      'Lento cria impulso e tensão; rápido cria espaço aberto',
      'Lento fixa notas melódicas mais longas; rápido fixa notas melódicas mais curtas',
      'Lento fixa uma nota melódica por compasso; rápido fixa uma por tempo',
    ],
    hint: 'Ritmo harmónico lento (um acorde durante vários compassos) dá uma sensação de calma ou estase. Ritmo harmónico rápido (várias mudanças de acorde por compasso) cria urgência, complexidade e impulso para a frente.',
  },

  // ---- l3u11m4: Notas Estranhas ao Acorde Parte 1 ----

  l3u11m4e1: {
    prompt: 'O que é uma nota de passagem?',
    choices: [
      'Uma nota estranha que se move por grau entre duas notas do acorde na mesma direção',
      'Uma nota estranha abordada por grau que regressa por grau à nota inicial do acorde',
      'Uma nota estranha que faz soar cedo uma nota pertencente ao acorde seguinte',
      'Uma nota estranha abordada por grau e deixada por salto entre notas do acorde',
    ],
    hint: 'Uma nota de passagem preenche a lacuna entre duas notas do acorde a uma 3.ª de distância. É abordada por grau e resolvida por grau na mesma direção. Exemplo: num acorde de C, D passa entre C e E.',
  },
  l3u11m4e2: {
    prompt: 'Que padrão tem uma bordadura na nota central sobre um acorde de C maior mantido?',
    choices: [
      'E4–F4–E4',
      'E4–D4–C4',
      'G4–E4–G4',
      'E4–G4–C5',
    ],
    hint: 'Uma bordadura (ou nota auxiliar) afasta-se de uma nota do acorde por grau (para cima ou para baixo) e regressa à mesma nota. Decora uma única altura: nota do acorde → grau para fora → grau de volta.',
    nudge: 'Sobre um acorde de C maior, compara C–D–C com C–D–E: um deles é uma nota de passagem. O que faz o D no outro?',
  },
  l3u11m4e3: {
    prompt: 'O que é uma antecipação?',
    choices: [
      'Uma nota estranha que faz soar cedo uma nota do acorde seguinte',
      'Uma nota estranha que preenche o espaço entre duas notas do acorde por grau',
      'Uma nota estranha que se afasta por grau e regressa à nota inicial',
      'Uma nota estranha que é abordada por grau e deixada por salto',
    ],
    hint: 'Uma antecipação "antecipa" o acorde seguinte ao fazer soar uma das suas notas mais cedo, antes de a harmonia mudar. É tipicamente uma nota curta e não acentuada que resolve mantendo-se na mesma altura.',
  },

  // ---- l3u11m5: Transposição ----

  l3u11m5e1: {
    prompt: 'Uma melodia que começa em C4 é transposta para começar na segunda nota mostrada. Qual foi o intervalo da transposição?',
    hint: 'Uma 2.ª maior são 2 meios-tons. C mais 2 meios-tons = D. Transpor uma 2.ª maior acima move cada nota um tom acima.',
    nudge: 'O intervalo de transposição é o intervalo de C até à nova nota inicial. Conta os nomes das notas de C até à segunda nota da pauta para obter o número e depois conta os meios-tons entre elas para a qualidade.',
  },
  l3u11m5e2: {
    prompt: 'C4 é transposto até à segunda nota mostrada. Indica o intervalo desta transposição.',
    hint: 'Uma 5.ª perfeita são 7 meios-tons. C mais 7 meios-tons = G. Transpor uma 5.ª perfeita acima é uma das transposições mais comuns, passando de C maior para G maior.',
    nudge: 'Todas as notas se movem pelo mesmo intervalo, por isso mede-o só na primeira nota: conta os nomes das notas de C até à segunda nota mostrada, incluindo ambas, e verifica se essa nota pertence a C maior para decidires a qualidade.',
  },
  l3u11m5e3: {
    prompt: 'Uma melodia em C maior é transposta uma 3.ª menor acima. Qual é a nova armação de clave?',
    choices: [
      'Armação de clave de Eb maior: 3 bemóis',
      'Armação de clave de D maior: 2 sustenidos',
      'Armação de clave de E maior: 4 sustenidos',
      'Armação de clave de Ab maior: 4 bemóis',
    ],
    hint: 'A transposição desloca tudo para uma nova tonalidade. Subir uma 3.ª menor (3 meios-tons) a partir de C maior chega a Eb maior. A nova armação de clave (3 bemóis) preserva todas as relações intervalares.',
  },
};

export default overlay;
