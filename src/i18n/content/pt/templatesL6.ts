import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 6 exercise templates
// 12 modules — mirrors templatesL6.ts entry by entry (W4a re-keying, 2026-10-31)
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 18: Acordes Cromáticos
  // =========================================================================

  // ---- l6u18m1: Acorde Napolitano bII ----
  l6u18m1: [
    {
      // chord_build — {key} is the minor key, {root} the Neapolitan (bII) itself.
      promptTemplate:
        'Constrói o acorde napolitano (bII) de {key} menor.',
      hintTemplate:
        'O napolitano é a tríade maior sobre o 2.º grau rebaixado: em {key} menor é {root} maior (fundamental, 3.ª maior, 5.ª perfeita).',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a função do acorde napolitano é verdadeira?',
      hintTemplate:
        'O napolitano (bII ou N6) é um acorde pré-dominante que resolve para V (frequentemente via 6/4 cadencial). Está quase sempre na primeira inversão.',
      choiceSets: [
        [
          'É pré-dominante e segue para V',
          'É dominante: resolve diretamente para a tónica I',
          'É um substituto da tónica que termina frases no lugar do acorde de tónica',
          'É um acorde de passagem sem função harmónica própria',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Que opção indica o acorde napolitano (bII) correto da tonalidade menor que nomeia?',
      hintTemplate:
        'O napolitano é a tríade maior sobre o 2.º grau rebaixado da tonalidade menor: meio-tom acima da tónica, escrito na letra seguinte.',
      choiceSets: [
        [
          'Em C menor: Db maior (Db-F-Ab)',
          'Em C menor: D maior (D-F#-A)',
          'Em C menor: Eb maior (Eb-G-Bb)',
          'Em C menor: B maior (B-D#-F#)',
        ],
        [
          'Em A menor: Bb maior (Bb-D-F)',
          'Em A menor: B maior (B-D#-F#)',
          'Em A menor: Bb menor (Bb-Db-F)',
          'Em A menor: C maior (C-E-G)',
        ],
        [
          'Em E menor: F maior (F-A-C)',
          'Em E menor: F# maior (F#-A#-C#)',
          'Em E menor: D maior (D-F#-A)',
          'Em E menor: F menor (F-Ab-C)',
        ],
      ],
    },
  ],

  // ---- l6u18m2: Sexta Italiana/Francesa ----
  l6u18m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as sextas aumentadas italiana e francesa é verdadeira?',
      hintTemplate:
        'Sexta italiana: b6, 1, #4 (3 notas). Sexta francesa: b6, 1, 2, #4 (4 notas, inclui o 2.º grau). Ambas resolvem para V com as vozes extremas a expandirem-se para uma oitava.',
      choiceSets: [
        [
          'A sexta italiana tem três notas: b6, 1 e #4',
          'A sexta italiana tem quatro notas: b6, 1, 2 e #4',
          'A sexta italiana tem três notas: 6, 1 e #4',
          'A sexta italiana tem três notas: b6, 1 e 5',
        ],
        [
          'A sexta francesa junta o grau 2 à italiana',
          'A sexta francesa acrescenta o grau b3 à sexta italiana',
          'A sexta francesa acrescenta o grau 5 à sexta italiana',
          'A sexta francesa retira o #4 da sexta italiana',
        ],
        [
          'Expandem-se para uma oitava sobre a dominante',
          'Resolvem convergentemente para um uníssono sobre a tónica',
          'Resolvem divergentemente para uma oitava sobre a tónica',
          'Resolvem convergentemente para uma terça sobre a subdominante',
        ],
        [
          'De b6 a #4 há uma 6.ª aumentada (10 meios-tons) que se expande para uma oitava',
          'De b6 a #4 há uma 6.ª menor (8 meios-tons) que se contrai para uma 5.ª perfeita',
          'De b6 a #4 há uma 6.ª maior (9 meios-tons) que se expande para uma oitava',
          'De b6 a #4 há um trítono (6 meios-tons) que se contrai para uma 3.ª maior',
        ],
      ],
    },
  ],

  // ---- l6u18m3: Sexta Alemã ----
  l6u18m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o acorde de sexta aumentada alemã é verdadeira?',
      hintTemplate:
        'Sexta alemã: b6, 1, b3, #4 (4 notas, inclui a 3.ª menor). Resolve para um 6/4 cadencial para evitar quintas paralelas, depois para V.',
      choiceSets: [
        [
          'A sexta alemã contém b6, 1, b3 e #4',
          'A sexta alemã contém b6, 1, 2 e #4',
          'A sexta alemã contém b6, b2, b3 e #4',
          'A sexta alemã contém 6, 1, b3 e #4',
        ],
        [
          'Costuma passar primeiro por um 6/4 cadencial, evitando quintas paralelas com V',
          'Costuma seguir diretamente para V em posição fundamental, e é assim que evita quintas paralelas',
          'Costuma passar primeiro por um 6/4 cadencial, evitando oitavas paralelas com I',
          'Costuma resolver diretamente para a tónica I, saltando a dominante',
        ],
        [
          'É enarmonicamente equivalente a uma sétima da dominante',
          'É enarmonicamente equivalente a um acorde de sétima menor',
          'É enarmonicamente equivalente a um acorde de sétima diminuta',
          'É enarmonicamente equivalente a um acorde de sétima maior',
        ],
      ],
    },
    {
      // chord_build — {key} is the minor key; {root} is b6, the root of the
      // enharmonic dominant 7th (graded by pitch class).
      promptTemplate:
        'Constrói o acorde de sexta aumentada alemã de {key} menor.',
      hintTemplate:
        'Em {key} menor, a sexta alemã é b6–1–b3–#4, construída sobre {root}: {spelling}. Soa exatamente como {root}7, mas a nota superior escreve-se como 6.ª aumentada acima de {root}, não como 7.ª menor.',
    },
  ],

  // ---- l6u18m4: Modulação Enarmónica Gr+6 <-> V7 ----
  l6u18m4: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre modular através do pivot sexta alemã / V7 é verdadeira?',
      hintTemplate:
        'A sexta alemã é enarmonicamente idêntica a um acorde de sétima da dominante. Reescrevê-la permite uma modulação súbita para uma tonalidade remota: Gr+6 numa tonalidade = V7 noutra.',
      choiceSets: [
        [
          'A sexta alemã de C menor (Ab-C-Eb-F#), reescrita como Ab7 (Ab-C-Eb-Gb), conduz a Db',
          'A sexta alemã de C menor (Ab-C-Eb-F#), reescrita como Ab7 (Ab-C-Eb-Gb), conduz a Eb',
          'A sexta alemã de C menor (Ab-C-Eb-F#) nunca pode ser reescrita como sétima da dominante',
          'Só a sexta italiana de C menor (Ab-C-F#) pode ser reescrita como sétima da dominante',
        ],
        [
          'O pivot alcança tonalidades meio-tom acima ou abaixo da tónica',
          'O pivot alcança apenas tonalidades uma 5.ª perfeita acima ou abaixo da tónica',
          'O pivot alcança apenas o modo maior ou menor paralelo da tónica',
          'O pivot alcança apenas tonalidades um tom acima ou abaixo da tónica',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a história da modulação enarmónica pela sexta alemã é verdadeira?',
      hintTemplate:
        'De Mozart e Schubert em diante, os compositores usaram a dupla identidade da sexta alemã (e da sétima da dominante) para saltar para tonalidades remotas; tornou-se uma marca da harmonia romântica.',
      choiceSets: [
        [
          'Os românticos exploraram-na amplamente',
          'Só os compositores barrocos usaram a dupla identidade da sexta alemã',
          'Foi inventada pelos compositores de música atonal do século XX',
          'Os compositores clássicos e românticos evitaram por completo a modulação enarmónica',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 19: Técnicas Cromáticas Avançadas
  // =========================================================================

  // ---- l6u19m1: Modulação Enarmónica via dim7 ----
  l6u19m1: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a modulação enarmónica com o acorde de sétima diminuta é verdadeira?',
      hintTemplate:
        'Um acorde dim7 divide a oitava em terças menores iguais. Qualquer das suas 4 notas pode ser reescrita como fundamental, fazendo-o resolver para 4 tonalidades diferentes.',
      choiceSets: [
        [
          'Qualquer nota de um dim7 pode ser a sensível',
          'Só a fundamental escrita de um acorde dim7 pode funcionar como sensível',
          'Um acorde dim7 só conduz a uma única tonalidade: a que fica meio-tom acima da sua fundamental',
          'Um acorde dim7 não pode ser reescrito sem mudar o seu som',
        ],
        [
          'Há apenas 3 acordes dim7 diferentes; em conjunto cobrem as 12 tonalidades',
          'Há 12 acordes dim7 diferentes, um construído sobre cada uma das 12 notas',
          'Há 6 acordes dim7 diferentes, um sobre cada nota de uma escala de tons inteiros',
          'Há 4 acordes dim7 diferentes, um por cada 3.ª menor da oitava',
        ],
        [
          'B°7 (B-D-F-Ab) pode resolver para C, Eb, Gb ou A, conforme a sua grafia',
          'B°7 (B-D-F-Ab) pode resolver para C, D, E ou F, conforme a sua grafia',
          'B°7 (B-D-F-Ab) só pode resolver para C, porque B é a sua fundamental escrita',
          'B°7 (B-D-F-Ab) só pode resolver para as notas que já contém',
        ],
      ],
    },
  ],

  // ---- l6u19m2: Sétima Diminuta com Nota Comum ----
  l6u19m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o acorde de sétima diminuta com nota comum é verdadeira?',
      hintTemplate:
        'Um CT°7 partilha uma nota comum com o acorde que embeleza. Decora (em vez de funcionar harmonicamente em direção a) um acorde maior ou de sétima da dominante.',
      choiceSets: [
        [
          'O CT°7 partilha uma nota, geralmente a fundamental, com o acorde que embeleza',
          'O CT°7 não partilha nenhuma nota com o acorde que embeleza',
          'O CT°7 partilha sempre duas notas, a 3.ª e a 5.ª, com o acorde que ele embeleza',
          'O CT°7 é um acorde de dominante que resolve diretamente para a sua própria tónica, tal como V7',
        ],
        [
          'Embeleza um acorde: uma voz mantém-se enquanto três vozes se movem por grau conjunto',
          'Embeleza um acorde: as quatro vozes movem-se por grau conjunto e nenhuma delas se mantém',
          'Modula: as quatro vozes saltam juntas para um acorde de uma nova tonalidade distante',
          'Substitui a dominante: a sua fundamental resolve meio-tom acima para a tónica',
        ],
      ],
    },
  ],

  // ---- l6u19m3: Mediantes Cromáticas e Dominantes Alteradas (omnibus incluído) ----
  l6u19m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a progressão omnibus é verdadeira?',
      hintTemplate:
        'O omnibus é um padrão cromático de troca de vozes onde duas vozes se movem em movimento contrário cromático enquanto outras vozes sustentam notas comuns.',
      choiceSets: [
        [
          'Duas vozes movem-se cromaticamente em movimento contrário enquanto as outras se mantêm',
          'Todas as vozes se movem em movimento cromático paralelo, sem nenhuma nota comum entre acordes',
          'Duas vozes movem-se em quintas paralelas enquanto as outras saltam',
          'Uma voz move-se cromaticamente enquanto todas as outras saltam',
        ],
        [
          'Pode prolongar uma harmonia de dominante através de troca cromática de vozes',
          'Modula sempre para uma tonalidade distante através de troca cromática de vozes',
          'Só pode prolongar a harmonia de tónica, nunca a harmonia de dominante',
          'Substitui a cadência final de uma frase por uma cadência plagal, de IV de volta a I',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as mediantes cromáticas é verdadeira?',
      hintTemplate:
        'As mediantes cromáticas são acordes relacionados por uma 3.ª maior ou menor com fundamentais que diferem cromaticamente (ex. C maior para E maior ou Ab maior). Partilham uma nota comum.',
      choiceSets: [
        [
          'C maior → E maior é mediante cromática: fundamentais a uma 3.ª maior, uma nota comum (E)',
          'C maior → G maior é mediante cromática: fundamentais a uma 5.ª, uma nota comum (G)',
          'C maior → F maior é mediante cromática: fundamentais a uma 4.ª, uma nota comum (C)',
          'C maior → A menor é mediante cromática: fundamentais a uma 3.ª menor, duas notas comuns (C, E)',
        ],
        [
          'As mediantes cromáticas movem-se por 3.ª e alteram cromaticamente pelo menos uma nota',
          'As mediantes cromáticas movem-se por 3.ª e mantêm todas as notas dentro da tonalidade',
          'As mediantes cromáticas movem-se por 5.ª e mantêm inalteradas todas as notas da tonalidade',
          'As mediantes cromáticas movem-se por grau conjunto e partilham as três notas',
        ],
        [
          'Ab maior é mediante cromática de C maior: fundamentais a uma 3.ª maior, uma nota comum (C)',
          'Ab maior é mediante cromática de C maior: fundamentais a uma 3.ª menor, duas notas comuns (C, Eb)',
          'Ab maior é a dominante de C maior: fundamentais a uma 5.ª, duas notas comuns (C, G)',
          'Ab maior é a subdominante de C maior: fundamentais a uma 4.ª, uma nota comum (C)',
        ],
      ],
    },
    {
      // chord_build
      promptTemplate:
        'Constrói V+, a dominante alterada de {key} maior (V com a 5.ª aumentada).',
      hintTemplate:
        'O V+ é a tríade da dominante com a 5.ª elevada meio-tom: sobre {root} é fundamental, 3.ª maior, 5.ª aumentada. A 5.ª elevada sobe para a 3.ª de {key}.',
    },
  ],

  // ---- l6u19m4: Técnicas Harmónicas Tardo-Românticas ----
  l6u19m4: [
    {
      // scale_build
      promptTemplate:
        'Constrói a escala {scaleType} de {root}, que divide a oitava em seis tons iguais.',
      hintTemplate:
        'A escala de tons inteiros divide a oitava em 6 tons iguais: a partir de {root}, soma 2 meios-tons cinco vezes. Sem meios-tons não há sensível, por isso nenhuma nota soa como repouso.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as divisões iguais da oitava é verdadeira?',
      hintTemplate:
        'Divisões iguais: trítono (2 partes iguais, passos de 6 meios-tons), tríade aumentada (3 partes iguais, passos de 4), sétima diminuta (4 partes iguais, passos de 3), escala de tons inteiros (6 partes iguais, passos de 2).',
      choiceSets: [
        [
          'Uma tríade aumentada divide a oitava em 3 terças maiores iguais',
          'Uma tríade aumentada divide a oitava em 4 terças menores iguais',
          'Um acorde de sétima diminuta divide a oitava em 3 terças maiores iguais',
          'Uma tríade aumentada divide a oitava em 2 trítonos iguais',
        ],
        [
          'Há apenas 2 escalas de tons inteiros, cada uma com 6 das 12 notas',
          'Há 12 escalas de tons inteiros, uma a começar em cada uma das 12 notas',
          'Há apenas 1 escala de tons inteiros, e contém as 12 notas',
          'Há 6 escalas de tons inteiros, uma por cada uma das suas 6 notas',
        ],
        [
          'Um acorde de sétima diminuta divide a oitava em 4 terças menores iguais',
          'Um acorde de sétima diminuta divide a oitava em 6 tons iguais',
          'Um acorde de sétima diminuta divide a oitava em 2 quintas perfeitas iguais',
          'Um acorde de sétima diminuta não divide a oitava em partes iguais',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a harmonia não funcional do Romantismo tardio é verdadeira?',
      hintTemplate:
        'No Romantismo tardio, os acordes ligam-se muitas vezes por proximidade na condução de vozes, notas comuns ou cor, em vez da função tónica–dominante; o planing move a forma de um acorde em paralelo.',
      choiceSets: [
        [
          'Os acordes podem ligar-se por condução de vozes por meio-tom em vez de por função',
          'Os acordes só se podem ligar por movimento de fundamental de 5.ª, como na harmonia funcional',
          'Os acordes ligam-se por grandes saltos em todas as vozes para evitar notas comuns',
          'Toda a sucessão não funcional tem de terminar numa cadência V–I',
        ],
        [
          'O planing cromático move a forma de um acorde em paralelo, mantendo a sua qualidade exata',
          'O planing cromático move a forma de um acorde em paralelo, ajustando-a à tonalidade',
          'O planing cromático move todas as vozes em movimento contrário, sempre em direção à tónica',
          'O planing cromático mantém um acorde e muda apenas a nota do baixo',
        ],
        [
          'A tonalidade alargada enfraquece o centro tonal com tonalidades remotas e cromatismo',
          'A tonalidade alargada reforça o centro tonal repetindo cadências V–I',
          'A tonalidade alargada usa apenas as sete notas de uma tonalidade do princípio ao fim',
          'A tonalidade alargada é outro nome para as regras estritas do contraponto de espécies',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 20: Contraponto e Escrita a Partes
  // =========================================================================

  // ---- l6u20m1: Contraponto de Espécies — Primeira a Terceira Espécie ----
  l6u20m1: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o cantus firmus e a primeira espécie (1:1) é verdadeira?',
      hintTemplate:
        'Cantus firmus: 8–12 semibreves, da tónica à tónica, sobretudo por grau conjunto, um só ponto culminante. Primeira espécie: só consonâncias (P1, 3.as, P5, 6.as, P8); começa em P1, P5 ou P8; termina em P1 ou P8 alcançado por grau conjunto.',
      choiceSets: [
        [
          'Um cantus firmus começa e termina na tónica e move-se sobretudo por grau conjunto',
          'Um cantus firmus começa na dominante e move-se sobretudo por salto',
          'Um cantus firmus mistura livremente semibreves, mínimas e semínimas',
          'Um cantus firmus repete notas com frequência e tem vários pontos culminantes diferentes',
        ],
        [
          'A primeira espécie usa só consonâncias: uníssonos, 3.as, 5.as, 6.as e oitavas',
          'A primeira espécie usa só consonâncias perfeitas: uníssonos, 4.as, 5.as e oitavas',
          'A primeira espécie permite uma dissonância de passagem em cada segunda nota',
          'A primeira espécie usa só 3.as e 6.as, nunca um uníssono, uma 5.ª ou uma oitava',
        ],
        [
          'Começa num uníssono, 5.ª ou oitava e termina num uníssono ou oitava',
          'Começa numa 3.ª ou 6.ª e termina numa 5.ª alcançada por salto',
          'Começa e termina numa 3.ª, a mais doce das consonâncias, para evitar um som oco',
          'Pode terminar em qualquer consonância, alcançada por grau conjunto ou por salto',
        ],
      ],
    },
    {
      // multiple_choice — Fux: só notas de passagem na segunda espécie (decisão D-14)
      promptTemplate:
        'Qual destas afirmações sobre o contraponto de segunda espécie (2:1) é verdadeira?',
      hintTemplate:
        'Segunda espécie: duas notas contra cada nota do cantus. O tempo forte é consonante; o tempo fraco pode ser consonante ou uma nota de passagem dissonante, alcançada e deixada por grau conjunto no mesmo sentido.',
      choiceSets: [
        [
          'Uma dissonância em tempo fraco tem de ser nota de passagem, entrando e saindo por grau conjunto',
          'Uma dissonância em tempo fraco pode ser nota de passagem ou bordadura',
          'Uma dissonância em tempo forte é sempre permitida desde que depois resolva descendo por grau conjunto',
          'Uma dissonância em tempo fraco pode ser alcançada ou deixada por salto de 3.ª',
        ],
        [
          'Todo o tempo forte tem de ser consonante com o cantus firmus',
          'Todo o tempo fraco tem de ser dissonante com o cantus firmus',
          'Os tempos fortes podem ser dissonantes quando o tempo fraco seguinte é consonante',
          'Todo o tempo forte tem de formar um uníssono com o cantus firmus',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o contraponto de terceira espécie (4:1) é verdadeira?',
      hintTemplate:
        'Terceira espécie: quatro notas contra cada nota do cantus. A primeira é consonante; as outras podem ser notas de passagem, bordaduras, uma cambiata (grau conjunto para a dissonância, salto de 3.ª, grau conjunto de volta) ou uma bordadura dupla.',
      choiceSets: [
        [
          'A primeira de cada quatro notas é consonante; as outras podem ser notas de passagem ou bordaduras',
          'As quatro notas contra cada nota do cantus têm de ser todas consonantes com ela',
          'A primeira de cada quatro notas pode ser dissonante desde que as outras três sejam todas consonantes',
          'Só a última de cada quatro notas tem de ser consonante com o cantus, porque é ela que conduz à nota seguinte',
        ],
        [
          'A cambiata vai por grau conjunto para uma dissonância, salta uma 3.ª e volta por grau conjunto',
          'A cambiata salta para uma dissonância e depois resolve-a descendo por grau conjunto',
          'A cambiata liga uma dissonância por cima da barra de compasso até ao tempo forte do compasso seguinte',
          'A cambiata vai por grau conjunto para uma dissonância e continua no mesmo sentido',
        ],
        [
          'Uma bordadura dupla decora uma nota com a bordadura superior e a inferior, uma após a outra',
          'Uma bordadura dupla são duas notas de passagem consecutivas no mesmo sentido, sem regressarem à nota inicial',
          'Uma bordadura dupla faz soar duas dissonâncias ao mesmo tempo, em duas vozes diferentes da textura',
          'Uma bordadura dupla repete a mesma nota duas vezes nos tempos fortes',
        ],
      ],
    },
  ],

  // ---- l6u20m2: Contraponto de Espécies — Quarta e Quinta Espécie ----
  l6u20m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o contraponto de quarta espécie (sincopado) é verdadeira?',
      hintTemplate:
        'A quarta espécie liga uma nota de um tempo fraco por cima da barra de compasso. Se a nota ligada for dissonante no tempo forte, é uma suspensão: preparada como consonância, resolvida descendo por grau conjunto. Acima do cantus: 7-6, 4-3, 9-8; abaixo: 2-3.',
      choiceSets: [
        [
          'Uma nota é ligada de um tempo fraco, por cima da barra de compasso, até ao tempo forte seguinte',
          'Uma nota é ligada de um tempo forte até ao tempo fraco que se lhe segue, dentro do mesmo compasso',
          'Cada nota é atacada no tempo forte e deixada no tempo fraco',
          'Não se usa nenhuma ligadura; a linha é sincopada por pausas colocadas em cada tempo forte do compasso',
        ],
        [
          'Uma suspensão é preparada como consonância e resolve descendo por grau conjunto',
          'Uma suspensão é preparada como dissonância e depois resolve subindo por grau conjunto',
          'Uma suspensão é preparada como consonância e resolve subindo por grau conjunto',
          'Uma suspensão não precisa de preparação e resolve descendo por salto',
        ],
        [
          'Acima do cantus, as suspensões dissonantes são 7-6, 4-3 e 9-8; abaixo, 2-3',
          'Acima do cantus, as suspensões dissonantes são 6-5, 3-2 e 8-7; abaixo, 4-5',
          'Acima do cantus, a única suspensão dissonante é 2-3; abaixo, 7-6 e 4-3',
          'Acima ou abaixo do cantus, a única suspensão dissonante permitida é 4-3',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as cadeias de suspensões e a quinta espécie (florida) é verdadeira?',
      hintTemplate:
        'Numa cadeia, cada resolução fica ligada e torna-se a suspensão seguinte. A quinta espécie (contraponto florido) mistura numa só linha os valores das quatro primeiras espécies, cada um com as suas regras.',
      choiceSets: [
        [
          'Numa cadeia, cada resolução fica ligada para preparar a suspensão seguinte',
          'Numa cadeia, cada suspensão resolve um grau acima para preparar a seguinte',
          'Numa cadeia, cada suspensão é seguida de um salto consonante de 5.ª',
          'Numa cadeia, as suspensões têm de alternar entre as duas vozes',
        ],
        [
          'A quinta espécie combina livremente os valores das quatro primeiras espécies',
          'A quinta espécie usa cinco notas contra cada nota do cantus firmus',
          'A quinta espécie é contraponto escrito para cinco vozes independentes, uma para cada espécie',
          'A quinta espécie abandona todas as regras de dissonância das espécies anteriores',
        ],
        [
          'O contraponto florido mantém as regras de cada espécie anterior para os seus valores',
          'O contraponto florido ignora as regras de dissonância para a linha se mover livremente',
          'O contraponto florido só permite semibreves contra o cantus firmus',
          'O contraponto florido proíbe ligaduras sobre a barra de compasso, por isso as suspensões deixam de aparecer',
        ],
      ],
    },
  ],

  // ---- l6u20m3: Contraponto a Três Partes e Contraponto Invertível ----
  l6u20m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o contraponto invertível (duplo) é verdadeira?',
      hintTemplate:
        'O contraponto invertível permite que duas vozes troquem de lugar. À oitava, um intervalo n torna-se 9 − n (3.ª → 6.ª, 5.ª → 4.ª); à décima, 11 − n (3.ª → oitava, 6.ª → 5.ª); à duodécima, 13 − n (5.ª → oitava).',
      choiceSets: [
        [
          'À oitava, uma 3.ª torna-se uma 6.ª quando as vozes trocam',
          'À oitava, uma 3.ª continua a ser 3.ª quando as vozes trocam',
          'À oitava, uma 3.ª torna-se uma 5.ª quando as vozes trocam',
          'À oitava, uma 3.ª torna-se uma 7.ª quando as vozes trocam',
        ],
        [
          'À oitava, evitam-se as 5.as porque se tornam 4.as dissonantes',
          'À oitava, evitam-se as 3.as porque se tornam 6.as dissonantes',
          'À oitava, preferem-se as 5.as porque continuam 5.as perfeitas',
          'À oitava, evitam-se as 6.as porque se tornam 2.as dissonantes',
        ],
        [
          'À décima, uma 3.ª torna-se uma oitava e uma 6.ª torna-se uma 5.ª',
          'À décima, uma 3.ª torna-se uma 6.ª e uma 6.ª torna-se uma 3.ª',
          'À décima, uma 3.ª torna-se uma 5.ª e uma 6.ª torna-se uma oitava',
          'À décima, todos os intervalos mantêm exatamente o mesmo tamanho',
        ],
        [
          'À duodécima, uma 5.ª torna-se uma oitava quando as vozes trocam',
          'À duodécima, uma 5.ª torna-se uma 4.ª quando as duas vozes trocam de lugar',
          'À duodécima, uma 5.ª torna-se uma 6.ª quando as vozes trocam',
          'À duodécima, uma 3.ª torna-se uma 6.ª sempre que as duas vozes trocam',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o contraponto triplo é verdadeira?',
      hintTemplate:
        'Contraponto triplo: três vozes que funcionam nas seis disposições verticais (ABC, ACB, BAC, BCA, CAB, CBA), por isso cada par de vozes tem de ser invertível.',
      choiceSets: [
        [
          'As suas três vozes funcionam nas 6 disposições verticais possíveis',
          'As suas três vozes funcionam em apenas 3 disposições verticais possíveis',
          'As suas três vozes funcionam nas 9 disposições verticais possíveis',
          'As suas três vozes funcionam nas 12 disposições verticais possíveis',
        ],
        [
          'Cada par das suas vozes tem de funcionar como contraponto invertível',
          'Só as duas vozes extremas têm de funcionar como contraponto invertível',
          'As suas vozes podem mover-se em 5.as paralelas, porque vão ser reordenadas',
          'Só a voz superior se pode mover; as duas vozes inferiores ficam fixas',
        ],
      ],
    },
  ],

  // ---- l6u20m4: Escrita a Partes Avançada e Leitura de Partitura ----
  l6u20m4: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre harmonizar uma melodia de soprano a quatro vozes (SATB) é verdadeira?',
      hintTemplate:
        'Para harmonizar um soprano: encontra a tonalidade e os pontos de cadência, escolhe uma linha de baixo e acordes que conduzam até eles, preenche contralto e tenor pelo caminho mais curto e verifica paralelas, espaçamento e duplicações.',
      choiceSets: [
        [
          'Encontra primeiro os pontos de cadência e depois escolhe um baixo e acordes que conduzam lá',
          'Escreve primeiro o contralto e o tenor e só depois encaixa o baixo e o soprano à volta deles',
          'Escolhe primeiro um acorde qualquer para cada nota e corrige as cadências no fim',
          'Harmoniza a partir da primeira nota e deixa que os acordes decidam onde termina cada frase',
        ],
        [
          'No fim, verifica quintas e oitavas paralelas, espaçamento e erros de duplicação',
          'No fim, acrescenta quintas e oitavas paralelas entre as vozes extremas para dar força',
          'No fim, duplica a sensível em todos os acordes de dominante para um som mais cheio',
          'No fim, cruza o contralto e o tenor para que cada voz interior tenha mais espaço',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a realização do baixo cifrado é verdadeira?',
      hintTemplate:
        'Baixo cifrado: sem cifra = posição fundamental (5/3), 6 = primeira inversão, 6/4 = segunda inversão, 7 = sétima em posição fundamental, 6/5 = primeira inversão, 4/3 = segunda inversão, 4/2 = terceira inversão (7.ª no baixo).',
      choiceSets: [
        [
          'Uma nota do baixo sem cifra realiza-se como acorde em posição fundamental (5/3)',
          'Uma nota do baixo sem cifra realiza-se como um acorde na primeira inversão (6/3)',
          'Uma nota do baixo sem cifra toca-se sozinha, sem acorde por cima',
          'Uma nota do baixo sem cifra realiza-se como acorde de sétima (7)',
        ],
        [
          'Um 6 sob uma nota do baixo indica uma tríade na primeira inversão',
          'Um 6 sob uma nota do baixo indica uma tríade na segunda inversão',
          'Um 6 sob uma nota do baixo indica uma tríade em posição fundamental',
          'Um 6 sob uma nota do baixo indica um acorde de sétima na terceira inversão',
        ],
        [
          '6/4 sob uma nota do baixo indica uma tríade na segunda inversão',
          '6/4 sob uma nota do baixo indica uma tríade na primeira inversão',
          '6/4 sob uma nota do baixo indica um acorde de sétima em posição fundamental',
          '6/4 sob uma nota do baixo indica uma tríade em posição fundamental',
        ],
        [
          '4/2 sob uma nota do baixo indica um acorde de sétima com a 7.ª no baixo',
          '4/2 sob uma nota do baixo indica um acorde de sétima com a fundamental no baixo',
          '4/2 sob uma nota do baixo indica um acorde de sétima com a 3.ª no baixo',
          '4/2 sob uma nota do baixo indica um acorde de sétima com a 5.ª no baixo',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre os instrumentos transpositores numa partitura de orquestra é verdadeira?',
      hintTemplate:
        'Um instrumento transpositor faz soar a nota do seu nome quando lê C: o clarinete em Bb soa uma 2.ª maior abaixo do escrito, a trompa em F uma 5.ª perfeita abaixo. Transpõe cada parte para a altura de concerto para ouvir a harmonia real.',
      choiceSets: [
        [
          'O clarinete em Bb soa uma 2.ª maior abaixo do escrito: o C escrito soa Bb',
          'O clarinete em Bb soa uma 2.ª maior acima do que está escrito: o C escrito soa D',
          'O clarinete em Bb soa uma 3.ª menor abaixo do escrito: o C escrito soa A',
          'O clarinete em Bb soa exatamente como está escrito: o C escrito soa C',
        ],
        [
          'A trompa em F soa uma 5.ª perfeita abaixo do escrito: o C escrito soa F',
          'A trompa em F soa uma 5.ª perfeita acima do que está escrito: o C escrito soa G',
          'A trompa em F soa uma 2.ª maior abaixo do escrito: o C escrito soa Bb',
          'A trompa em F soa exatamente como está escrito: o C escrito soa C',
        ],
        [
          'Para ouvir a harmonia real, transpõe cada parte pelo intervalo do seu instrumento',
          'As partes transpositoras já soam como estão escritas, por isso não é preciso transpor',
          'Para ouvir a harmonia real, sobe todas as partes uma oitava acima do que está escrito',
          'Para ouvir a harmonia real, lê só as partes de cordas e ignora os sopros',
        ],
      ],
    },
  ],
};

export default overlay;
