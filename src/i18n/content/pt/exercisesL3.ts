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
      'Constrói um acorde de Cmaj7. Seleciona as 4 notas: fundamental, 3.a maior, 5.a perfeita e 7.a maior.',
    hint: 'Cmaj7 = C, E, G, B. Uma tríade maior (C-E-G) mais uma 7.a maior (B, 11 semitons acima da fundamental).',
  },
  l3u9m1e2: {
    prompt:
      'Constrói um acorde de Dm7. Seleciona as 4 notas: fundamental, 3.a menor, 5.a perfeita e 7.a menor.',
    hint: 'Dm7 = D, F, A, C. Uma tríade menor (D-F-A) mais uma 7.a menor (C, 10 semitons acima da fundamental).',
  },
  l3u9m1e3: {
    prompt: 'Qual qualidade de acorde de sétima tem uma tríade maior com uma 7.a menor?',
    choices: [
      'Sétima da dominante',
      'Sétima maior',
      'Sétima menor',
      'Sétima meio-diminuta',
    ],
    hint: 'A sétima da dominante (ex.: G7) combina uma tríade maior com uma 7.a menor. É o único tipo de acorde de sétima com esta combinação, criando forte tensão que resolve para a tónica.',
  },
  l3u9m1e4: {
    prompt: 'Qual é a diferença entre um acorde de sétima meio-diminuto e um totalmente diminuto?',
    choices: [
      'O meio-diminuto tem 7.a menor; o totalmente diminuto tem 7.a diminuta (duplo bemol)',
      'O meio-diminuto tem 7.a maior; o totalmente diminuto tem 7.a menor',
      'Usam tríades diferentes: o meio-diminuto é menor, o totalmente diminuto é diminuto',
      'Não há diferença; são o mesmo acorde',
    ],
    hint: 'Ambos partilham uma tríade diminuta (fundamental, 3.am, 5.adim). O meio-diminuto acrescenta uma 7.a menor (10 semitons), enquanto o totalmente diminuto acrescenta uma 7.a diminuta (9 semitons).',
  },
  l3u9m1e_ear1: {
    prompt: 'Ouve este acorde e identifica a sua qualidade.',
    choices: [
      'Maior',
      'Menor',
      'Diminuto',
      'Aumentado',
    ],
    hint: 'Os acordes maiores soam brilhantes e alegres. Este acorde é construído sobre C com uma 3.a maior e 5.a perfeita.',
  },
  l3u9m1e_ear2: {
    prompt: 'Ouve este acorde e identifica a sua qualidade.',
    choices: [
      'Maior',
      'Menor',
      'Diminuto',
      'Aumentado',
    ],
    hint: 'Os acordes menores soam mais escuros e melancólicos do que os maiores. A 3.a é baixada meio-tom.',
  },
  l3u9m1e_ear3: {
    prompt: 'Ouve este acorde e identifica a sua qualidade.',
    choices: [
      'Maior',
      'Menor',
      'Diminuto',
      'Aumentado',
    ],
    hint: 'Este acorde tem a qualidade brilhante e estável de uma tríade maior construída sobre D.',
  },
  l3u9m1e_ear4: {
    prompt: 'Ouve este acorde e identifica a sua qualidade.',
    choices: [
      'Maior',
      'Menor',
      'Diminuto',
      'Aumentado',
    ],
    hint: 'Este acorde tem a qualidade sombria e introspetiva de uma tríade menor construída sobre E.',
  },

  // ---- l3u9m2: Inversões de Acordes de Sétima ----

  l3u9m2e1: {
    prompt: 'Qual símbolo de baixo cifrado representa um acorde de sétima em estado fundamental?',
    choices: [
      '7 (abreviatura de 7/5/3)',
      '6/5',
      '4/3',
      '4/2',
    ],
    hint: 'Em estado fundamental, os intervalos acima do baixo são 3.a, 5.a e 7.a. A cifragem completa 7/5/3 é abreviada para apenas 7.',
  },
  l3u9m2e2: {
    prompt: 'Qual símbolo de baixo cifrado representa um acorde de sétima na primeira inversão?',
    choices: [
      '6/5 (abreviatura de 6/5/3)',
      '7',
      '4/3',
      '4/2',
    ],
    hint: 'A primeira inversão coloca a 3.a do acorde no baixo. Os intervalos característicos acima do baixo são uma 6.a e uma 5.a, resultando no símbolo 6/5.',
  },
  l3u9m2e3: {
    prompt: 'Qual símbolo de baixo cifrado representa um acorde de sétima na terceira inversão?',
    choices: [
      '4/2 (abreviatura de 6/4/2)',
      '6/5',
      '4/3',
      '7',
    ],
    hint: 'A terceira inversão coloca a 7.a do acorde no baixo. Os intervalos acima do baixo são uma 2.a e uma 4.a, resultando no símbolo 4/2 (ou 2).',
  },

  // ---- l3u9m3: Acordes de Sétima Diatónicos em Maior ----

  l3u9m3e1: {
    prompt:
      'Constrói um acorde de G7 (sétima da dominante). Este é o V7 em Dó maior. Seleciona as 4 notas.',
    hint: 'G7 = G, B, D, F. Uma tríade maior (G-B-D) mais uma 7.a menor (F, 10 semitons acima de G). O trítono B-F impulsiona a resolução para C.',
  },
  l3u9m3e2: {
    prompt:
      'Constrói um acorde de Am7. Este é o vi7 em Dó maior. Seleciona as 4 notas.',
    hint: 'Am7 = A, C, E, G. Uma tríade menor (A-C-E) mais uma 7.a menor (G, 10 semitons acima de A).',
  },
  l3u9m3e3: {
    prompt: 'O acorde V7 contém um trítono. Quais duas notas o formam na tonalidade de Dó maior?',
    choices: [
      'B e F -- a sensível e o 4.o grau da escala',
      'G e D -- a fundamental e a 5.a do acorde V',
      'C e F# -- a tónica e uma nota cromática',
      'E e Bb -- a 3.a e um bemol emprestado',
    ],
    hint: 'Em G7 (G-B-D-F), o trítono está entre B (a 3.a) e F (a 7.a), abrangendo 6 semitons. B resolve para cima, para C, enquanto F resolve para baixo, para E, criando a resolução V7-I.',
  },

  // ---- l3u9m4: Acordes de Sétima Diatónicos em Menor ----

  l3u9m4e1: {
    prompt:
      'Constrói um acorde de E7 (V7 em Lá menor, usando a menor harmónica). Seleciona as 4 notas.',
    hint: 'E7 = E, G#, B, D. O G# provém do 7.o grau elevado de Lá menor harmónica. Este acorde de sétima da dominante fornece a sensível (G#) que resolve para A.',
  },
  l3u9m4e2: {
    prompt:
      'Em Lá menor natural, o acorde construído sobre o 7.o grau (G) é uma tríade maior. Porque muda isto na menor harmónica?',
    choices: [
      'Elevar o 7.o grau (G para G#) transforma VII em viio, uma tríade diminuta',
      'O acorde do 7.o grau é sempre diminuto independentemente da forma da escala menor',
      'A menor harmónica baixa o 7.o grau, criando um acorde diminuto',
      'A qualidade do acorde não muda entre menor natural e menor harmónica',
    ],
    hint: 'Em Lá menor natural, VII é G-B-D (maior). Elevar G para G# na menor harmónica dá G#-B-D, que é diminuto (fundamental à 3.a = 3.am, fundamental à 5.a = 5.adim).',
  },
  l3u9m4e3: {
    prompt:
      'Qual é a qualidade do acorde de sétima construído sobre o 2.o grau da menor harmónica (ii em Lá menor = B)?',
    choices: [
      'Sétima meio-diminuta (m7b5)',
      'Sétima menor',
      'Sétima totalmente diminuta',
      'Sétima da dominante',
    ],
    hint: 'Em Lá menor harmónica, o ii7 é B-D-F-A: uma tríade diminuta (B-D-F) mais uma 7.a menor (A). Esta combinação chama-se meio-diminuta, escrita Bm7b5 ou B\u00f8.',
  },

  // =========================================================================
  // Unidade 10: Condução de Vozes e Escrita a Partes
  // =========================================================================

  // ---- l3u10m1: Noções Básicas de SATB ----

  l3u10m1e1: {
    prompt: 'Qual é a tessitura padrão para a voz de soprano na escrita SATB?',
    choices: [
      'C4 a G5 (Dó central até ao Sol uma oitava e uma quinta acima)',
      'C3 a G4',
      'G3 a D5',
      'C5 a C7',
    ],
    hint: 'O soprano é a voz mais aguda em SATB. A sua tessitura prática vai aproximadamente de C4 (Dó central) a G5. Ultrapassar esta tessitura torna a parte difícil de cantar.',
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
  },
  l3u10m1e3: {
    prompt: 'Em tríades em estado fundamental, qual nota do acorde deve ser tipicamente dobrada?',
    choices: [
      'A fundamental do acorde',
      'A 3.a do acorde',
      'A 5.a do acorde',
      'Qualquer nota do acorde igualmente',
    ],
    hint: 'Dobrar a fundamental reforça a identidade do acorde e é a escolha mais segura. Evita dobrar a sensível (7.o grau) ou outras notas com tendência de resolução, pois cria problemas na resolução.',
  },

  // ---- l3u10m2: Quintas e Oitavas Paralelas Proibidas ----

  l3u10m2e1: {
    prompt: 'Porque são as quintas perfeitas paralelas consideradas problemáticas na condução de vozes?',
    choices: [
      'Destroem a independência das vozes ao fazer duas vozes soarem como uma só',
      'Criam dissonância que o ouvido não consegue resolver',
      'São fisicamente impossíveis de cantar',
      'Violam as regras do ritmo',
    ],
    hint: 'Os intervalos perfeitos (uníssonos, 5.as, 8.as) têm forte fusão acústica. Quando duas vozes se movem em 5.as paralelas, perdem a sua identidade individual, reduzindo o número de linhas independentes percecionadas.',
  },
  l3u10m2e2: {
    prompt: 'Quais são os quatro tipos de movimento entre duas vozes?',
    choices: [
      'Paralelo, direto, oblíquo e contrário',
      'Ascendente, descendente, estático e misto',
      'Conjunto, disjunto, cromático e diatónico',
      'Consonante, dissonante, resolvido e suspenso',
    ],
    hint: 'Paralelo = mesma direção, mesmo intervalo. Direto = mesma direção, intervalo diferente. Oblíquo = uma voz move-se, a outra mantém-se. Contrário = direções opostas.',
  },
  l3u10m2e3: {
    prompt: 'Qual tipo de movimento de vozes é mais eficaz para criar linhas de vozes independentes?',
    choices: [
      'Movimento contrário -- as vozes movem-se em direções opostas',
      'Movimento paralelo -- as vozes movem-se na mesma direção pelo mesmo intervalo',
      'Movimento direto -- as vozes movem-se na mesma direção por intervalos diferentes',
      'Todos os tipos são igualmente eficazes',
    ],
    hint: 'O movimento contrário maximiza a independência das vozes porque as vozes viajam em direções opostas. Este é o tipo de movimento mais valorizado no contraponto e na escrita a partes.',
  },

  // ---- l3u10m3: Escrita a Partes em Estado Fundamental ----

  l3u10m3e1: {
    prompt:
      'Quando dois acordes em estado fundamental têm fundamentais a uma 5.a de distância (ex.: I para V), qual técnica de condução de vozes é mais importante?',
    choices: [
      'Manter a nota comum na mesma voz e mover as outras por grau',
      'Mover as quatro vozes na mesma direção',
      'Manter todas as vozes o mais juntas possível independentemente de notas comuns',
      'Dobrar a 3.a do segundo acorde',
    ],
    hint: 'Quando as fundamentais se movem por 5.a (ou 4.a), os dois acordes partilham uma nota comum. Mantê-la na mesma voz garante uma condução de vozes suave enquanto as outras vozes se movem por grau.',
  },
  l3u10m3e2: {
    prompt:
      'Quando dois acordes em estado fundamental têm fundamentais a uma 2.a de distância (ex.: IV para V), qual é a melhor abordagem de condução de vozes?',
    choices: [
      'Mover as três vozes superiores em movimento contrário ao baixo',
      'Mover todas as vozes em movimento paralelo com o baixo',
      'Manter uma voz como nota comum',
      'Saltar todas as vozes para a nota do acorde mais próxima',
    ],
    hint: 'Quando as fundamentais se movem por grau, não há notas comuns. Mover as vozes superiores em contrário ao baixo previne quintas e oitavas paralelas, mantendo o movimento de vozes suave.',
  },
  l3u10m3e3: {
    prompt: 'O que é a "lei do caminho mais curto" na condução de vozes?',
    choices: [
      'Cada voz deve mover-se para a nota do acorde mais próxima, preferindo movimento por grau',
      'O baixo deve mover-se sempre a menor distância',
      'Os acordes devem ser espaçados o mais junto possível',
      'A peça deve usar o menor número possível de acordes',
    ],
    hint: 'Uma condução de vozes suave minimiza a distância que cada voz percorre. Movimento por grau (ou manutenção da nota comum) é preferido em relação a saltos, produzindo linhas mais cantáveis e ligadas.',
  },

  // ---- l3u10m4: Tríades em Inversão ----

  l3u10m4e1: {
    prompt: 'Qual é o símbolo de baixo cifrado para uma tríade na primeira inversão?',
    choices: [
      '6 (abreviatura de 6/3)',
      '5/3',
      '6/4',
      '7',
    ],
    hint: 'A primeira inversão coloca a 3.a do acorde no baixo. Os intervalos acima do baixo são uma 3.a e uma 6.a. O 6/3 completo é abreviado para apenas 6.',
  },
  l3u10m4e2: {
    prompt: 'O acorde cadencial 6/4 ocorre em que parte da cadência?',
    choices: [
      'Num tempo forte, imediatamente antes do acorde de dominante (V)',
      'Num tempo fraco, após o acorde de tónica',
      'Logo no início de uma frase',
      'Apenas no final de uma peça, no acorde final',
    ],
    hint: 'O 6/4 cadencial (I6/4) funciona como uma decoração da dominante. Aparece num tempo forte com o baixo no 5.o grau, e as vozes superiores resolvem por grau descendente para formar V.',
  },
  l3u10m4e3: {
    prompt: 'Porque é a segunda inversão (6/4) usada com mais cuidado do que a primeira inversão?',
    choices: [
      'A 4.a acima do baixo é uma dissonância que requer resolução específica',
      'Os acordes na segunda inversão soam pior do que na primeira inversão',
      'A 5.a no baixo torna o acorde impossível de identificar',
      'A segunda inversão é proibida em toda a música clássica',
    ],
    hint: 'A 4.a perfeita acima do baixo (na posição 6/4) era tratada como dissonância na harmonia de prática comum. Aparece tipicamente em três contextos específicos: 6/4 cadencial, de passagem e de pedal.',
  },

  // =========================================================================
  // Unidade 11: Cadências, Frases, Ornamentação
  // =========================================================================

  // ---- l3u11m1: Cadências ----

  l3u11m1e1: {
    prompt: 'O que define uma Cadência Autêntica Perfeita (CAP)?',
    choices: [
      'V para I com ambos os acordes em estado fundamental e a tónica no soprano sobre o acorde I',
      'Qualquer progressão que termine no acorde I',
      'IV para I em estado fundamental',
      'V para I com a 3.a de I no soprano',
    ],
    hint: 'Uma CAP tem três requisitos: (1) V vai para I, (2) ambos os acordes estão em estado fundamental, e (3) o soprano termina na nota tónica (1.o grau). É o tipo de cadência mais forte.',
  },
  l3u11m1e2: {
    prompt: 'O que é uma cadência suspensiva?',
    choices: [
      'Qualquer cadência que termine no acorde de dominante (V)',
      'Uma cadência que termina no acorde de tónica (I)',
      'Uma cadência que usa apenas mínimas',
      'Uma cadência que modula para uma nova tonalidade',
    ],
    hint: 'Uma cadência suspensiva termina em V, criando uma sensação aberta e não resolvida -- como uma vírgula numa frase. O acorde que precede V pode ser I, ii, IV ou vi. Exige continuação.',
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
      'IV para I -- a cadência do "Amen"',
      'V para I -- a cadência mais forte',
      'V para vi -- a cadência interrompida',
      'ii para V -- uma progressão pré-dominante comum',
    ],
    hint: 'A cadência plagal move-se de IV para I. É frequentemente chamada a cadência do "Amen" porque é tradicionalmente usada no final de hinos. Tem uma qualidade mais suave e menos impulsionada do que V-I.',
  },

  // ---- l3u11m2: Frases e Períodos ----

  l3u11m2e1: {
    prompt: 'O que é um período antecedente-consequente?',
    choices: [
      'Duas frases em que a primeira termina com cadência suspensiva e a segunda com cadência autêntica',
      'Uma única frase repetida exatamente duas vezes',
      'Duas frases completamente sem relação',
      'Uma frase que modula para a dominante e regressa',
    ],
    hint: 'Um período é um par de frases: o antecedente (pergunta) termina inconclusivamente com uma cadência suspensiva, e o consequente (resposta) termina conclusivamente com uma CAP. Formam uma "frase" musical.',
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
    prompt: 'Na estrutura clássica de "frase" (Satz), o que acontece após a ideia inicial (apresentação)?',
    choices: [
      'Uma continuação que fragmenta e acelera em direção a uma cadência',
      'Uma repetição exata da apresentação',
      'Uma secção contrastante numa nova tonalidade',
      'Um silêncio seguido de um novo tema',
    ],
    hint: 'A frase clássica tem duas partes: uma apresentação (ideia básica + repetição) e uma continuação (fragmentação + aceleração em direção a uma cadência). A continuação impulsiona a frase até à sua conclusão.',
  },

  // ---- l3u11m3: Ritmo Harmónico ----

  l3u11m3e1: {
    prompt: 'O que é o ritmo harmónico?',
    choices: [
      'A velocidade a que os acordes mudam numa passagem',
      'O ritmo tocado pelos instrumentos harmónicos',
      'A velocidade da melodia',
      'A indicação de compasso da peça',
    ],
    hint: 'O ritmo harmónico refere-se à frequência com que a harmonia subjacente muda, independentemente da atividade rítmica de superfície. Uma passagem pode ter ritmo melódico rápido mas ritmo harmónico lento (um acorde por compasso).',
  },
  l3u11m3e2: {
    prompt: 'O que acontece tipicamente ao ritmo harmónico nos pontos cadenciais?',
    choices: [
      'Acelera -- os acordes mudam mais frequentemente a aproximar-se da cadência',
      'Desacelera -- os acordes mudam menos frequentemente nas cadências',
      'Mantém-se igual ao longo da frase',
      'Para completamente antes do acorde cadencial',
    ],
    hint: 'A aceleração cadencial é uma técnica comum: as mudanças de acorde aceleram perto das cadências, criando uma sensação de impulso e chegada. Por exemplo, os acordes podem mudar a cada compasso, depois a cada dois tempos, depois a cada tempo na cadência.',
  },
  l3u11m3e3: {
    prompt: 'Como difere o efeito do ritmo harmónico lento do rápido?',
    choices: [
      'Lento cria estabilidade e repouso; rápido cria tensão e impulso',
      'Lento é sempre usado em tonalidades menores; rápido em tonalidades maiores',
      'Lento significa menos notas por compasso; rápido significa mais notas por compasso',
      'Não há diferença percetível para o ouvinte',
    ],
    hint: 'Ritmo harmónico lento (um acorde durante vários compassos) dá uma sensação de calma ou estase. Ritmo harmónico rápido (várias mudanças de acorde por compasso) cria urgência, complexidade e impulso para a frente.',
  },

  // ---- l3u11m4: Notas Estranhas ao Acorde Parte 1 ----

  l3u11m4e1: {
    prompt: 'O que é uma nota de passagem?',
    choices: [
      'Uma nota estranha que se move por grau entre duas notas do acorde na mesma direção',
      'Uma nota que é mantida do acorde anterior',
      'Uma nota estranha abordada por salto e resolvida por grau',
      'Um trilo ornamental sobre uma nota do acorde',
    ],
    hint: 'Uma nota de passagem preenche a lacuna entre duas notas do acorde a uma 3.a de distância. É abordada por grau e resolvida por grau na mesma direção. Exemplo: num acorde de C, D passa entre C e E.',
  },
  l3u11m4e2: {
    prompt: 'O que é uma bordadura?',
    choices: [
      'Uma nota estranha que se afasta por grau de uma nota do acorde e regressa a ela',
      'Uma nota estranha que se move por grau entre duas notas do acorde diferentes',
      'Uma nota do acorde que se repete no tempo seguinte',
      'Uma nota emprestada de uma tonalidade vizinha',
    ],
    hint: 'Uma bordadura (ou nota auxiliar) afasta-se de uma nota do acorde por grau (para cima ou para baixo) e regressa à mesma nota. Decora uma única altura: nota do acorde -> grau para fora -> grau de volta.',
  },
  l3u11m4e3: {
    prompt: 'O que é uma antecipação?',
    choices: [
      'Uma nota estranha que chega cedo -- soa uma nota do acorde seguinte antes de o acorde mudar',
      'Uma nota do acorde que é atrasada até depois do tempo',
      'Uma nota que é mantida do acorde anterior',
      'Uma pausa que substitui uma nota esperada',
    ],
    hint: 'Uma antecipação "antecipa" o acorde seguinte ao fazer soar uma das suas notas mais cedo, antes de a harmonia mudar. É tipicamente uma nota curta e não acentuada que resolve mantendo-se na mesma altura.',
  },

  // ---- l3u11m5: Transposição ----

  l3u11m5e1: {
    prompt: 'Transpõe C4 uma 2.a maior acima. Identifica o intervalo de 2 semitons ascendente a partir de C.',
    hint: 'Uma 2.a maior são 2 semitons. C mais 2 semitons = D. Transpor uma 2.a maior acima move cada nota um tom acima.',
  },
  l3u11m5e2: {
    prompt: 'Transpõe C4 uma 5.a perfeita acima. Identifica o intervalo de 7 semitons ascendente a partir de C.',
    hint: 'Uma 5.a perfeita são 7 semitons. C mais 7 semitons = G. Transpor uma 5.aP acima é uma das transposições mais comuns, passando de Dó maior para Sol maior.',
  },
  l3u11m5e3: {
    prompt: 'Ao transpor uma melodia uma 3.a menor acima, o que acontece à armação de clave?',
    choices: [
      'Muda para refletir a nova tonalidade (ex.: Dó maior torna-se Mib maior, ganhando 3 bemóis)',
      'Mantém-se igual; só as notas se movem',
      'Os sustenidos e bemóis são removidos',
      'Cada nota recebe um acidente',
    ],
    hint: 'A transposição desloca tudo para uma nova tonalidade. Subir uma 3.a menor (3 semitons) a partir de Dó maior chega a Mib maior. A nova armação de clave (3 bemóis) preserva todas as relações intervalares.',
  },
};

export default overlay;
