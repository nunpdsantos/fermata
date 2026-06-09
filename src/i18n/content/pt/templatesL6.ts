import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 6 exercise templates
// 12 modules, ~12 templates total
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 18: Acordes Cromaticos
  // =========================================================================

  // ---- l6u18m1: Acorde Napolitano bII ----
  l6u18m1: [
    {
      // chord_build
      promptTemplate:
        'Constroi o acorde napolitano em {root} menor. E uma triade maior sobre o 2.o grau rebaixado.',
      hintTemplate:
        'O napolitano em {root} menor e uma triade maior construida na nota meio-tom acima de {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Como funciona e resolve o acorde napolitano?',
      hintTemplate:
        'O napolitano (bII ou N6) e um acorde pre-dominante que resolve para V (frequentemente via 6/4 cadencial). Esta quase sempre na primeira inversao.',
      choiceSets: [
        [
          'O napolitano e um acorde pre-dominante que resolve tipicamente para V ou para um 6/4 cadencial',
          'O napolitano resolve diretamente para I',
          'O napolitano funciona como acorde de dominante',
          'O napolitano esta sempre em posicao fundamental',
        ],
        [
          'O acorde napolitano em Do menor e Reb maior (Reb-Fa-Lab)',
          'O napolitano em Do menor e Re maior',
          'O napolitano em Do menor e Mib maior',
          'O napolitano em Do menor e Si maior',
        ],
      ],
    },
  ],

  // ---- l6u18m2: Sexta Italiana/Francesa ----
  l6u18m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica o tipo e a estrutura deste acorde de sexta aumentada.',
      hintTemplate:
        'Sexta italiana: b6, 1, #4 (3 notas). Sexta francesa: b6, 1, 2, #4 (4 notas, inclui o 2.o grau). Ambas resolvem para V com as vozes extremas a expandirem-se para uma oitava.',
      choiceSets: [
        [
          'A sexta italiana tem 3 notas: b6, 1 e #4',
          'A sexta italiana tem 4 notas',
          'A sexta italiana contem o 2.o grau',
          'A sexta italiana contem o 3.o grau',
        ],
        [
          'A sexta francesa acrescenta o 2.o grau a sexta italiana',
          'A sexta francesa acrescenta o 3.o grau',
          'A sexta francesa tem apenas 2 notas',
          'A francesa e identica a italiana',
        ],
        [
          'Os acordes de sexta aumentada resolvem divergentemente para uma oitava sobre a dominante',
          'Os acordes de sexta aumentada resolvem convergentemente para um unissono',
          'Os acordes de sexta aumentada resolvem para a tonica',
          'Os acordes de sexta aumentada nao resolvem',
        ],
        [
          'O intervalo entre b6 e #4 e uma sexta aumentada (10 semitons), que resolve para P8',
          'O intervalo de sexta aumentada e de 8 semitons',
          'A sexta aumentada resolve para P5',
          'O intervalo de sexta aumentada e de 6 semitons',
        ],
      ],
    },
  ],

  // ---- l6u18m3: Sexta Alema ----
  l6u18m3: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa o acorde de sexta alema e a sua resolucao.',
      hintTemplate:
        'Sexta alema: b6, 1, b3, #4 (4 notas, inclui a 3.a menor). Resolve para um 6/4 cadencial para evitar quintas paralelas, depois para V.',
      choiceSets: [
        [
          'A sexta alema contem b6, 1, b3 e #4',
          'A sexta alema contem b6, 1, 2 e #4',
          'A sexta alema tem apenas 3 notas',
          'A sexta alema contem o 5.o grau',
        ],
        [
          'A sexta alema resolve para um 6/4 cadencial para evitar quintas paralelas com V',
          'A sexta alema resolve diretamente para V em posicao fundamental',
          'A sexta alema resolve para I',
          'Quintas paralelas sao aceitaveis com a sexta alema',
        ],
        [
          'A sexta alema e enarmonicamente equivalente a um acorde de setima da dominante',
          'A sexta alema e enarmonicamente equivalente a uma setima menor',
          'A sexta alema nao tem equivalente enarmonico',
          'A sexta alema e equivalente a uma setima maior',
        ],
      ],
    },
    {
      // chord_build
      promptTemplate:
        'Constroi o acorde de sexta alema em {root} menor. Inclui as 4 notas.',
      hintTemplate:
        'Em {root} menor, a sexta alema usa: 6.o grau rebaixado, tonica, 3.a rebaixada e 4.o grau elevado. As vozes extremas formam uma sexta aumentada.',
    },
  ],

  // ---- l6u18m4: Modulacao Enarminica Gr+6 <-> V7 ----
  l6u18m4: [
    {
      // multiple_choice
      promptTemplate:
        'Como e que a reinterpretacao enarminica da sexta alema permite a modulacao?',
      hintTemplate:
        'A sexta alema e enarmonicamente identica a um acorde de setima da dominante. Reescreve-la permite uma modulacao subita para uma tonalidade remota: Gr+6 numa tonalidade = V7 noutra.',
      choiceSets: [
        [
          'A sexta alema em Do menor (Lab-Do-Mib-Fa#) pode ser reescrita como Lab7 (Lab-Do-Mib-Solb), resolvendo para Reb',
          'A sexta alema nao pode ser reinterpretada como setima da dominante',
          'A reinterpretacao enarminica so funciona com a sexta italiana',
          'O acorde reescrito resolve para a mesma tonalidade',
        ],
        [
          'Este pivot enarmonico permite modulacao para tonalidades a meio-tom de distancia da dominante',
          'Esta tecnica so modula entre tonalidades paralelas',
          'Esta tecnica limita-se a tonalidades proximas',
          'Este tipo de modulacao nunca foi usado historicamente',
        ],
        [
          'A ambiguidade enarminica da sexta alema foi amplamente explorada pelos compositores romanticos',
          'Esta tecnica foi usada apenas na era barroca',
          'Os compositores classicos nunca usaram modulacao enarminica',
          'Esta tecnica foi inventada no seculo XX',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 19: Tecnicas Cromaticas Avancadas
  // =========================================================================

  // ---- l6u19m1: Modulacao Enarminica via dim7 ----
  l6u19m1: [
    {
      // multiple_choice
      promptTemplate:
        'Como e que o acorde de setima diminuta permite a modulacao enarminica?',
      hintTemplate:
        'Um acorde dim7 divide a oitava em tercas menores iguais. Qualquer das suas 4 notas pode ser reescrita como fundamental, fazendo-o resolver para 4 tonalidades diferentes.',
      choiceSets: [
        [
          'Qualquer nota de um acorde dim7 pode funcionar como sensivel para uma tonalidade diferente',
          'Um acorde dim7 so pode resolver para uma tonalidade',
          'Acordes dim7 nao podem ser reescritos',
          'Apenas a fundamental de um dim7 pode funcionar como sensivel',
        ],
        [
          'Existem apenas 3 acordes de setima diminuta distintos (enarmonicamente), cobrindo as 12 tonalidades',
          'Existem 12 acordes de setima diminuta distintos',
          'Existem 6 acordes de setima diminuta distintos',
          'Cada tonalidade tem a sua setima diminuta unica',
        ],
        [
          'Sio7 (Si-Re-Fa-Lab) pode resolver para Do, Mib, Solb ou La dependendo da grafia enarminica',
          'Sio7 so pode resolver para Do',
          'Sio7 tem 2 resolucoes possiveis',
          'Sio7 resolve apenas para Si maior',
        ],
      ],
    },
  ],

  // ---- l6u19m2: Setima Diminuta com Nota Comum ----
  l6u19m2: [
    {
      // multiple_choice
      promptTemplate:
        'Explica a funcao de um acorde de setima diminuta com nota comum.',
      hintTemplate:
        'Um CTo7 partilha uma nota comum com o acorde que embeleza. Decora (em vez de funcionar harmonicamente em direcao a) um acorde maior ou de setima da dominante.',
      choiceSets: [
        [
          'O CTo7 partilha uma nota comum (geralmente a fundamental) com o acorde que embeleza',
          'O CTo7 nao tem notas em comum com o acorde seguinte',
          'O CTo7 funciona como acorde de dominante',
          'O CTo7 e o mesmo que um acorde diminuto secundario',
        ],
        [
          'O CTo7 embeleza um acorde atraves de movimento de notas vizinhas em tres vozes',
          'O CTo7 cria uma modulacao',
          'O CTo7 e sempre um acorde de passagem',
          'O CTo7 substitui a funcao dominante',
        ],
      ],
    },
  ],

  // ---- l6u19m3: Mediantes Cromaticas / Progressao Omnibus ----
  l6u19m3: [
    {
      // multiple_choice
      promptTemplate:
        'Descreve a progressao omnibus e as suas caracteristicas de conducao de vozes.',
      hintTemplate:
        'O omnibus e um padrao cromatico de troca de vozes onde duas vozes se movem em movimento contrario cromatico enquanto outras vozes sustentam notas comuns.',
      choiceSets: [
        [
          'O omnibus apresenta movimento cromatico contrario nas vozes extremas com notas comuns nas vozes interiores',
          'O omnibus usa apenas movimento paralelo',
          'O omnibus nao tem movimento cromatico',
          'O omnibus e uma simples progressao I-IV-V-I',
        ],
        [
          'O omnibus pode prolongar uma harmonia de dominante atraves de troca cromatica de vozes',
          'O omnibus cria sempre uma modulacao',
          'O omnibus so prolonga a harmonia de tonica',
          'O omnibus nunca foi usado por nenhum compositor importante',
        ],
      ],
    },
  ],

  // ---- l6u19m4: Mediantes Cromaticas / Tecnicas Tardo-Romanticas ----
  l6u19m4: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica a relacao de mediante cromatica descrita.',
      hintTemplate:
        'As mediantes cromaticas sao acordes relacionados por uma 3.a maior ou menor com fundamentais que diferem cromaticamente (ex. Do maior para Mi maior ou Lab maior). Partilham uma nota comum.',
      choiceSets: [
        [
          'Do maior para Mi maior e uma mediante cromatica: fundamentais a uma 3.aM de distancia, partilhando uma nota comum (Mi)',
          'Do maior para Sol maior e uma mediante cromatica',
          'Do maior para Fa maior e uma mediante cromatica',
          'As mediantes cromaticas nao partilham notas comuns',
        ],
        [
          'As mediantes cromaticas produzem uma mudanca de cor impressionante porque alteram o modo ao mover-se por 3.a',
          'As mediantes cromaticas soam sempre subtis e suaves',
          'As mediantes cromaticas sao o mesmo que mediantes diatonicas',
          'As mediantes cromaticas limitam-se a pecas em modo maior',
        ],
        [
          'Do maior para Lab maior e uma mediante cromatica: fundamentais a uma 3.aM de distancia, partilhando uma nota comum (Do/Mib)',
          'Do para Lab e uma relacao de dominante',
          'Esta relacao nao tem notas comuns',
          'Do para Lab e uma relacao de subdominante',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 20: Contraponto e Escrita a Partes
  // =========================================================================

  // ---- l6u20m1: Conducao Cromatica de Vozes ----
  l6u20m1: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa esta tecnica de conducao cromatica de vozes.',
      hintTemplate:
        'A conducao cromatica de vozes liga acordes atraves de movimento por meio-tom. Cria ligacoes suaves entre harmonias de outro modo distantes.',
      choiceSets: [
        [
          'A conducao cromatica de vozes usa ligacoes por meio-tom para criar movimento suave entre acordes distantes',
          'A conducao cromatica de vozes usa sempre tons inteiros',
          'A conducao cromatica de vozes e o mesmo que a conducao diatonica',
          'A conducao cromatica de vozes ignora a qualidade dos acordes',
        ],
        [
          'A conducao parcimoniosa de vozes move o minimo de vozes pelos menores intervalos',
          'A conducao parcimoniosa requer que todas as vozes se movam',
          'Parcimonioso significa mover-se por saltos grandes',
          'Este conceito nunca foi estudado teoricamente',
        ],
      ],
    },
  ],

  // ---- l6u20m2: Divisao Igual da Oitava ----
  l6u20m2: [
    {
      // scale_build
      promptTemplate:
        'Constroi a escala {scaleType} de {root}, que divide a oitava em intervalos iguais.',
      hintTemplate:
        'A escala de tons inteiros divide a oitava em 6 tons iguais. A escala cromatica divide-a em 12 meios-tons iguais. Estas divisoes simetricas criam tonalidade ambigua.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica a divisao simetrica da oitava descrita.',
      hintTemplate:
        'Divisoes iguais: tritono (2 notas, div por 6), triade aumentada (3 notas, div por 4), dim7 (4 notas, div por 3), tons inteiros (6 notas, div por 2).',
      choiceSets: [
        [
          'Uma triade aumentada divide a oitava em 3 tercas maiores iguais',
          'Uma triade aumentada divide a oitava em 4 partes iguais',
          'Uma triade aumentada divide a oitava em 2 partes iguais',
          'Uma triade aumentada nao divide a oitava igualmente',
        ],
        [
          'Existem apenas 2 escalas de tons inteiros, cada uma contendo 6 das 12 alturas cromaticas',
          'Existem 12 escalas de tons inteiros',
          'Existe apenas 1 escala de tons inteiros',
          'Existem 6 escalas de tons inteiros',
        ],
      ],
    },
  ],

  // ---- l6u20m3: Contraponto Invertivel Avancado ----
  l6u20m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questao sobre contraponto invertivel (duplo).',
      hintTemplate:
        'O contraponto invertivel permite que duas vozes troquem de posicao (a superior torna-se inferior e vice-versa). A oitava: tercas tornam-se sextas, quintas tornam-se quartas, etc.',
      choiceSets: [
        [
          'No contraponto invertivel a oitava, uma terca torna-se uma sexta quando as vozes trocam',
          'Uma terca mantem-se terca quando as vozes trocam',
          'Uma terca torna-se uma quinta quando as vozes trocam',
          'Os intervalos nao mudam quando as vozes trocam',
        ],
        [
          'As quintas perfeitas devem ser evitadas no contraponto invertivel a oitava porque se tornam quartas',
          'As quintas perfeitas sao os melhores intervalos para contraponto invertivel',
          'As quintas mantem-se quintas quando invertidas a oitava',
          'Nao ha restricoes de intervalos no contraponto invertivel',
        ],
        [
          'Contraponto invertivel a decima: uma terca torna-se oitava, uma sexta torna-se quinta',
          'A decima, todos os intervalos permanecem inalterados',
          'O contraponto invertivel so funciona a oitava',
          'A decima, uma terca torna-se quinta',
        ],
      ],
    },
  ],

  // ---- l6u20m4: Contraponto Triplo e Quadruplo ----
  l6u20m4: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questao sobre contraponto triplo e quadruplo.',
      hintTemplate:
        'Contraponto triplo: 3 vozes que podem aparecer em qualquer permutacao (6 disposicoes). Quadruplo: 4 vozes, 24 disposicoes possiveis. Bach foi o mestre supremo.',
      choiceSets: [
        [
          'O contraponto triplo permite que 3 vozes sejam reorganizadas em qualquer das 6 permutacoes',
          'O contraponto triplo tem apenas 3 disposicoes possiveis',
          'O contraponto triplo significa 3 fugas separadas',
          'O contraponto triplo tem 12 permutacoes',
        ],
        [
          'O contraponto quadruplo com 4 vozes produz 24 disposicoes possiveis',
          'O contraponto quadruplo tem 4 disposicoes',
          'O contraponto quadruplo tem 12 disposicoes',
          'O contraponto quadruplo e impossivel de escrever',
        ],
        [
          'Escrever contraponto triplo/quadruplo requer que cada par de vozes funcione em contraponto invertivel',
          'Apenas as vozes extremas precisam de ser invertiveis',
          'Nao se aplicam restricoes especiais de conducao de vozes',
          'Quintas paralelas sao aceitaveis no contraponto triplo',
        ],
      ],
    },
  ],
};

export default overlay;
