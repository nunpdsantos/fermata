import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 6 exercise templates
// 12 modules, ~12 templates total
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 18: Acordes Cromáticos
  // =========================================================================

  // ---- l6u18m1: Acorde Napolitano bII ----
  l6u18m1: [
    {
      // chord_build — {root} is the chord root (the bII itself), not the key:
      // the graded answer is a major triad ON {root}. Mirrors EN.
      promptTemplate:
        'Constrói uma tríade maior de {root}{accidental} (acorde napolitano).',
      hintTemplate:
        'O acorde napolitano é uma tríade maior construída sobre o 2.o grau rebaixado. Constrói uma tríade maior sobre {root}{accidental}.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Como funciona e resolve o acorde napolitano?',
      hintTemplate:
        'O napolitano (bII ou N6) é um acorde pré-dominante que resolve para V (frequentemente via 6/4 cadencial). Está quase sempre na primeira inversão.',
      choiceSets: [
        [
          'O napolitano é um acorde pré-dominante que resolve tipicamente para V ou para um 6/4 cadencial',
          'O napolitano resolve diretamente para I',
          'O napolitano funciona como acorde de dominante',
          'O napolitano está sempre em posição fundamental',
        ],
        [
          'O acorde napolitano em Dó menor é Réb maior (Réb-Fá-Láb)',
          'O napolitano em Dó menor é Ré maior',
          'O napolitano em Dó menor é Mib maior',
          'O napolitano em Dó menor é Si maior',
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
          'A sexta italiana contém o 2.o grau',
          'A sexta italiana contém o 3.o grau',
        ],
        [
          'A sexta francesa acrescenta o 2.o grau à sexta italiana',
          'A sexta francesa acrescenta o 3.o grau',
          'A sexta francesa tem apenas 2 notas',
          'A francesa é idêntica à italiana',
        ],
        [
          'Os acordes de sexta aumentada resolvem divergentemente para uma oitava sobre a dominante',
          'Os acordes de sexta aumentada resolvem convergentemente para um uníssono',
          'Os acordes de sexta aumentada resolvem para a tónica',
          'Os acordes de sexta aumentada não resolvem',
        ],
        [
          'O intervalo entre b6 e #4 é uma sexta aumentada (10 semitons), que resolve para P8',
          'O intervalo de sexta aumentada é de 8 semitons',
          'A sexta aumentada resolve para P5',
          'O intervalo de sexta aumentada é de 6 semitons',
        ],
      ],
    },
  ],

  // ---- l6u18m3: Sexta Alemã ----
  l6u18m3: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa o acorde de sexta alemã e a sua resolução.',
      hintTemplate:
        'Sexta alemã: b6, 1, b3, #4 (4 notas, inclui a 3.a menor). Resolve para um 6/4 cadencial para evitar quintas paralelas, depois para V.',
      choiceSets: [
        [
          'A sexta alemã contém b6, 1, b3 e #4',
          'A sexta alemã contém b6, 1, 2 e #4',
          'A sexta alemã tem apenas 3 notas',
          'A sexta alemã contém o 5.o grau',
        ],
        [
          'A sexta alemã resolve para um 6/4 cadencial para evitar quintas paralelas com V',
          'A sexta alemã resolve diretamente para V em posição fundamental',
          'A sexta alemã resolve para I',
          'Quintas paralelas são aceitáveis com a sexta alemã',
        ],
        [
          'A sexta alemã é enarmonicamente equivalente a um acorde de sétima da dominante',
          'A sexta alemã é enarmonicamente equivalente a uma sétima menor',
          'A sexta alemã não tem equivalente enarmónico',
          'A sexta alemã é equivalente a uma sétima maior',
        ],
      ],
    },
    {
      // chord_build — {root} is the chord root of the enharmonic dom7, not the
      // key: the graded answer is a dominant 7th ON {root}. Mirrors EN.
      promptTemplate:
        'Constrói um acorde de sétima da dominante de {root}{accidental} (sexta alemã enarmónica).',
      hintTemplate:
        'A sexta alemã é enarmonicamente equivalente a um acorde de sétima da dominante. Constrói uma sétima da dominante sobre {root}{accidental}: fundamental + 3.a maior + 5.a perfeita + 7.a menor.',
    },
  ],

  // ---- l6u18m4: Modulação Enarmónica Gr+6 <-> V7 ----
  l6u18m4: [
    {
      // multiple_choice
      promptTemplate:
        'Como é que a reinterpretação enarmónica da sexta alemã permite a modulação?',
      hintTemplate:
        'A sexta alemã é enarmonicamente idêntica a um acorde de sétima da dominante. Reescrevê-la permite uma modulação súbita para uma tonalidade remota: Gr+6 numa tonalidade = V7 noutra.',
      choiceSets: [
        [
          'A sexta alemã em Dó menor (Láb-Dó-Mib-Fá#) pode ser reescrita como Láb7 (Láb-Dó-Mib-Solb), resolvendo para Réb',
          'A sexta alemã não pode ser reinterpretada como sétima da dominante',
          'A reinterpretação enarmónica só funciona com a sexta italiana',
          'O acorde reescrito resolve para a mesma tonalidade',
        ],
        [
          'Este pivot enarmónico permite modulação para tonalidades a meio-tom de distância da dominante',
          'Esta técnica só modula entre tonalidades paralelas',
          'Esta técnica limita-se a tonalidades próximas',
          'Este tipo de modulação nunca foi usado historicamente',
        ],
        [
          'A ambiguidade enarmónica da sexta alemã foi amplamente explorada pelos compositores românticos',
          'Esta técnica foi usada apenas na era barroca',
          'Os compositores clássicos nunca usaram modulação enarmónica',
          'Esta técnica foi inventada no século XX',
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
        'Como é que o acorde de sétima diminuta permite a modulação enarmónica?',
      hintTemplate:
        'Um acorde dim7 divide a oitava em terças menores iguais. Qualquer das suas 4 notas pode ser reescrita como fundamental, fazendo-o resolver para 4 tonalidades diferentes.',
      choiceSets: [
        [
          'Qualquer nota de um acorde dim7 pode funcionar como sensível para uma tonalidade diferente',
          'Um acorde dim7 só pode resolver para uma tonalidade',
          'Acordes dim7 não podem ser reescritos',
          'Apenas a fundamental de um dim7 pode funcionar como sensível',
        ],
        [
          'Existem apenas 3 acordes de sétima diminuta distintos (enarmonicamente), cobrindo as 12 tonalidades',
          'Existem 12 acordes de sétima diminuta distintos',
          'Existem 6 acordes de sétima diminuta distintos',
          'Cada tonalidade tem a sua sétima diminuta única',
        ],
        [
          'Sio7 (Si-Ré-Fá-Láb) pode resolver para Dó, Mib, Solb ou Lá dependendo da grafia enarmónica',
          'Sio7 só pode resolver para Dó',
          'Sio7 tem 2 resoluções possíveis',
          'Sio7 resolve apenas para Si maior',
        ],
      ],
    },
  ],

  // ---- l6u19m2: Sétima Diminuta com Nota Comum ----
  l6u19m2: [
    {
      // multiple_choice
      promptTemplate:
        'Explica a função de um acorde de sétima diminuta com nota comum.',
      hintTemplate:
        'Um CTo7 partilha uma nota comum com o acorde que embeleza. Decora (em vez de funcionar harmonicamente em direção a) um acorde maior ou de sétima da dominante.',
      choiceSets: [
        [
          'O CTo7 partilha uma nota comum (geralmente a fundamental) com o acorde que embeleza',
          'O CTo7 não tem notas em comum com o acorde seguinte',
          'O CTo7 funciona como acorde de dominante',
          'O CTo7 é o mesmo que um acorde diminuto secundário',
        ],
        [
          'O CTo7 embeleza um acorde através de movimento de notas vizinhas em três vozes',
          'O CTo7 cria uma modulação',
          'O CTo7 é sempre um acorde de passagem',
          'O CTo7 substitui a função dominante',
        ],
      ],
    },
  ],

  // ---- l6u19m3: Mediantes Cromáticas / Progressão Omnibus ----
  l6u19m3: [
    {
      // multiple_choice
      promptTemplate:
        'Descreve a progressão omnibus e as suas características de condução de vozes.',
      hintTemplate:
        'O omnibus é um padrão cromático de troca de vozes onde duas vozes se movem em movimento contrário cromático enquanto outras vozes sustentam notas comuns.',
      choiceSets: [
        [
          'O omnibus apresenta movimento cromático contrário nas vozes extremas com notas comuns nas vozes interiores',
          'O omnibus usa apenas movimento paralelo',
          'O omnibus não tem movimento cromático',
          'O omnibus é uma simples progressão I-IV-V-I',
        ],
        [
          'O omnibus pode prolongar uma harmonia de dominante através de troca cromática de vozes',
          'O omnibus cria sempre uma modulação',
          'O omnibus só prolonga a harmonia de tónica',
          'O omnibus nunca foi usado por nenhum compositor importante',
        ],
      ],
    },
  ],

  // ---- l6u19m4: Mediantes Cromáticas / Técnicas Tardo-Românticas ----
  l6u19m4: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica a relação de mediante cromática descrita.',
      hintTemplate:
        'As mediantes cromáticas são acordes relacionados por uma 3.a maior ou menor com fundamentais que diferem cromaticamente (ex. Dó maior para Mi maior ou Láb maior). Partilham uma nota comum.',
      choiceSets: [
        [
          'Dó maior para Mi maior é uma mediante cromática: fundamentais a uma 3.aM de distância, partilhando uma nota comum (Mi)',
          'Dó maior para Sol maior é uma mediante cromática',
          'Dó maior para Fá maior é uma mediante cromática',
          'As mediantes cromáticas não partilham notas comuns',
        ],
        [
          'As mediantes cromáticas produzem uma mudança de cor impressionante porque alteram o modo ao mover-se por 3.a',
          'As mediantes cromáticas soam sempre subtis e suaves',
          'As mediantes cromáticas são o mesmo que mediantes diatónicas',
          'As mediantes cromáticas limitam-se a peças em modo maior',
        ],
        [
          'Dó maior para Láb maior é uma mediante cromática: fundamentais a uma 3.aM de distância, partilhando uma nota comum (Dó/Mib)',
          'Dó para Láb é uma relação de dominante',
          'Esta relação não tem notas comuns',
          'Dó para Láb é uma relação de subdominante',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 20: Contraponto e Escrita a Partes
  // =========================================================================

  // ---- l6u20m1: Condução Cromática de Vozes ----
  l6u20m1: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa esta técnica de condução cromática de vozes.',
      hintTemplate:
        'A condução cromática de vozes liga acordes através de movimento por meio-tom. Cria ligações suaves entre harmonias de outro modo distantes.',
      choiceSets: [
        [
          'A condução cromática de vozes usa ligações por meio-tom para criar movimento suave entre acordes distantes',
          'A condução cromática de vozes usa sempre tons inteiros',
          'A condução cromática de vozes é o mesmo que a condução diatónica',
          'A condução cromática de vozes ignora a qualidade dos acordes',
        ],
        [
          'A condução parcimoniosa de vozes move o mínimo de vozes pelos menores intervalos',
          'A condução parcimoniosa requer que todas as vozes se movam',
          'Parcimonioso significa mover-se por saltos grandes',
          'Este conceito nunca foi estudado teoricamente',
        ],
      ],
    },
  ],

  // ---- l6u20m2: Divisão Igual da Oitava ----
  l6u20m2: [
    {
      // scale_build
      promptTemplate:
        'Constrói a escala {scaleType} de {root}, que divide a oitava em intervalos iguais.',
      hintTemplate:
        'A escala de tons inteiros divide a oitava em 6 tons iguais. A escala cromática divide-a em 12 meios-tons iguais. Estas divisões simétricas criam tonalidade ambígua.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica a divisão simétrica da oitava descrita.',
      hintTemplate:
        'Divisões iguais: trítono (2 notas, div por 6), tríade aumentada (3 notas, div por 4), dim7 (4 notas, div por 3), tons inteiros (6 notas, div por 2).',
      choiceSets: [
        [
          'Uma tríade aumentada divide a oitava em 3 terças maiores iguais',
          'Uma tríade aumentada divide a oitava em 4 partes iguais',
          'Uma tríade aumentada divide a oitava em 2 partes iguais',
          'Uma tríade aumentada não divide a oitava igualmente',
        ],
        [
          'Existem apenas 2 escalas de tons inteiros, cada uma contendo 6 das 12 alturas cromáticas',
          'Existem 12 escalas de tons inteiros',
          'Existe apenas 1 escala de tons inteiros',
          'Existem 6 escalas de tons inteiros',
        ],
      ],
    },
  ],

  // ---- l6u20m3: Contraponto Invertível Avançado ----
  l6u20m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questão sobre contraponto invertível (duplo).',
      hintTemplate:
        'O contraponto invertível permite que duas vozes troquem de posição (a superior torna-se inferior e vice-versa). À oitava: terças tornam-se sextas, quintas tornam-se quartas, etc.',
      choiceSets: [
        [
          'No contraponto invertível à oitava, uma terça torna-se uma sexta quando as vozes trocam',
          'Uma terça mantém-se terça quando as vozes trocam',
          'Uma terça torna-se uma quinta quando as vozes trocam',
          'Os intervalos não mudam quando as vozes trocam',
        ],
        [
          'As quintas perfeitas devem ser evitadas no contraponto invertível à oitava porque se tornam quartas',
          'As quintas perfeitas são os melhores intervalos para contraponto invertível',
          'As quintas mantêm-se quintas quando invertidas à oitava',
          'Não há restrições de intervalos no contraponto invertível',
        ],
        [
          'Contraponto invertível à décima: uma terça torna-se oitava, uma sexta torna-se quinta',
          'À décima, todos os intervalos permanecem inalterados',
          'O contraponto invertível só funciona à oitava',
          'À décima, uma terça torna-se quinta',
        ],
      ],
    },
  ],

  // ---- l6u20m4: Contraponto Triplo e Quádruplo ----
  l6u20m4: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questão sobre contraponto triplo e quádruplo.',
      hintTemplate:
        'Contraponto triplo: 3 vozes que podem aparecer em qualquer permutação (6 disposições). Quádruplo: 4 vozes, 24 disposições possíveis. Bach foi o mestre supremo.',
      choiceSets: [
        [
          'O contraponto triplo permite que 3 vozes sejam reorganizadas em qualquer das 6 permutações',
          'O contraponto triplo tem apenas 3 disposições possíveis',
          'O contraponto triplo significa 3 fugas separadas',
          'O contraponto triplo tem 12 permutações',
        ],
        [
          'O contraponto quádruplo com 4 vozes produz 24 disposições possíveis',
          'O contraponto quádruplo tem 4 disposições',
          'O contraponto quádruplo tem 12 disposições',
          'O contraponto quádruplo é impossível de escrever',
        ],
        [
          'Escrever contraponto triplo/quádruplo requer que cada par de vozes funcione em contraponto invertível',
          'Apenas as vozes extremas precisam de ser invertíveis',
          'Não se aplicam restrições especiais de condução de vozes',
          'Quintas paralelas são aceitáveis no contraponto triplo',
        ],
      ],
    },
  ],
};

export default overlay;
