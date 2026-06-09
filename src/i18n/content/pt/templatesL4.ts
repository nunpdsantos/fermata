import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 4 exercise templates
// 11 module configs (Unit 14 counterpoint pooled onto l4u14m1, mirroring
// the EN source). Entry order per module must match templatesL4.ts.
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 12: Notas Estranhas ao Acorde e Sétima da Dominante
  // =========================================================================

  // ---- l4u12m1: Suspensões ----
  l4u12m1: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa esta figura de suspensão e a sua resolução.',
      hintTemplate:
        'Suspensões: 4-3 resolve para uma 3.ª, 7-6 para uma 6.ª, 9-8 para uma oitava. A suspensão de baixo 2-3 resolve para baixo (o baixo desce por grau conjunto; o intervalo acima do baixo cresce de uma 2.ª para uma 3.ª). Cadeias de suspensões criam sequências.',
      choiceSets: [
        [
          'Uma cadeia de suspensões 7-6 cria um movimento descendente por grau conjunto na voz superior',
          'Uma cadeia de suspensões é sempre ascendente',
          'Cadeias de suspensões são proibidas no estilo clássico',
          'Uma cadeia de suspensões não requer preparação',
        ],
        [
          'Uma suspensão ornamentada acrescenta uma nota de passagem ou bordadura entre a suspensão e a resolução',
          'Uma suspensão ornamentada salta a resolução inteiramente',
          'Uma suspensão ornamentada é sempre cromática',
          'Uma suspensão ornamentada resolve para cima',
        ],
        [
          'A suspensão deve ser preparada como consonância e retida como dissonância',
          'As suspensões podem aparecer sem preparação em todos os estilos',
          'A suspensão é sempre consonante',
          'As suspensões só podem ocorrer no soprano',
        ],
      ],
    },
  ],

  // ---- l4u12m2: Apogiatura / Escapatória ----
  l4u12m2: [
    {
      // multiple_choice
      promptTemplate:
        'Distingue entre estes tipos de notas estranhas ao acorde com base na abordagem e saída.',
      hintTemplate:
        'Apogiatura: salto para a dissonância, grau conjunto para a resolução. Escapatória: grau conjunto para a dissonância, salto para fora. Ambas são tipicamente acentuadas.',
      choiceSets: [
        [
          'Uma dissonância acentuada abordada por salto e resolvida por grau conjunto = apogiatura',
          'Isto é uma escapatória',
          'Isto é uma nota de passagem',
          'Isto é uma suspensão',
        ],
        [
          'Uma escapatória é abordada por grau conjunto e abandonada por salto na direção oposta',
          'Uma escapatória é abordada por salto e abandonada por grau conjunto',
          'Uma escapatória é o mesmo que uma antecipação',
          'Uma escapatória deve resolver para a mesma nota de onde partiu',
        ],
        [
          'Uma apogiatura não preparada é uma marca da expressão da era Romântica',
          'As apogiaturas são proibidas na música Romântica',
          'As apogiaturas devem ser sempre preparadas como as suspensões',
          'As apogiaturas ocorrem apenas na voz do baixo',
        ],
      ],
    },
  ],

  // ---- l4u12m3: Pedal ----
  l4u12m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questão sobre pedais e a sua função harmónica.',
      hintTemplate:
        'Os pedais são notas sustentadas ou repetidas (tipicamente tónica ou dominante no baixo) que criam dissonâncias com as harmonias em mudança acima.',
      choiceSets: [
        [
          'Um pedal duplo sustenta simultaneamente a tónica e a dominante',
          'Um pedal duplo usa duas tonalidades diferentes',
          'Um pedal duplo resolve sempre para uma nota única',
          'Um pedal duplo é o mesmo que um bordão',
        ],
        [
          'Um pedal invertido ocorre numa voz superior em vez do baixo',
          'Um pedal invertido desce em vez de se sustentar',
          'Um pedal invertido muda de altura a cada compasso',
          'Pedais invertidos nunca são encontrados na música clássica',
        ],
        [
          'Um pedal tipicamente começa e termina como consonância com dissonância no meio',
          'Um pedal é sempre dissonante ao longo de toda a duração',
          'Um pedal nunca cria dissonância',
          'Um pedal deve durar exatamente 4 compassos',
        ],
      ],
    },
  ],

  // ---- l4u12m4: Regras de Resolução do V7 ----
  l4u12m4: [
    {
      // chord_build — {root} é a fundamental do acorde, não a tonalidade:
      // a resposta avaliada é uma sétima da dominante SOBRE {root}. Espelha o EN.
      promptTemplate:
        'Constrói um acorde de sétima da dominante de {root}.',
      hintTemplate:
        'Um acorde de sétima da dominante: tríade maior + 7.ª menor. A 7.ª resolve para baixo, a sensível resolve para cima.',
    },
    {
      // multiple_choice
      promptTemplate: 'Como é que o acorde V7 resolve para I?',
      hintTemplate:
        'Na resolução V7 para I: a sensível resolve para cima até à tónica, a 7.ª resolve por grau conjunto descendente, a 5.ª de V pode ir para a fundamental de I, a fundamental de V pode ir para a fundamental de I.',
      choiceSets: [
        [
          'O trítono em V7 (entre a 3.ª e a 7.ª) resolve por movimento contrário: 3.ª para cima, 7.ª para baixo',
          'O trítono resolve por movimento paralelo',
          'O trítono não resolve',
          'Ambas as notas do trítono resolvem para baixo',
        ],
        [
          'Numa resolução V7-I, o acorde I frequentemente fica sem a 5.ª para permitir a condução de vozes correta',
          'O acorde I deve ser sempre completo após V7',
          'V7-I produz sempre quintas paralelas',
          'A fundamental de V7 deve resolver para a 3.ª de I',
        ],
      ],
    },
  ],

  // ---- l4u12m5: Inversões de V7 ----
  l4u12m5: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica a inversão deste acorde V7 com base na nota do acorde que está no baixo.',
      hintTemplate:
        'Inversões de V7: estado fundamental (V7), 1.ª inv = V6/5 (3.ª/sensível no baixo), 2.ª inv = V4/3 (5.ª no baixo), 3.ª inv = V4/2 (7.ª no baixo).',
      choiceSets: [
        [
          'V6/5 tem a sensível no baixo, criando uma resolução forte para cima até I',
          'V6/5 tem a 5.ª no baixo',
          'V6/5 tem a 7.ª no baixo',
          'V6/5 tem a fundamental no baixo',
        ],
        [
          'V4/2 tem a 7.ª no baixo e resolve tipicamente para I6',
          'V4/2 tem a fundamental no baixo',
          'V4/2 tem a 3.ª no baixo',
          'V4/2 resolve para V em estado fundamental',
        ],
        [
          'V4/3 tem a 5.ª no baixo e pode resolver para I ou I6',
          'V4/3 tem a sensível no baixo',
          'V4/3 tem a 7.ª no baixo',
          'V4/3 tem a fundamental no baixo',
        ],
      ],
    },
    {
      // chord_build
      promptTemplate:
        'Constrói o acorde de sétima da dominante sobre {root}. Este acorde quer resolver para uma tonalidade uma 5.ª abaixo.',
      hintTemplate:
        'Uma sétima da dominante sobre {root}: {root} + 3.ª maior + 5.ª perfeita + 7.ª menor. Este acorde resolve uma 5.ª abaixo (ou uma 4.ª acima) para a sua tónica.',
    },
  ],

  // =========================================================================
  // Unidade 13: Função Harmónica e Sequências
  // =========================================================================

  // ---- l4u13m1: Sétimas Pré-Dominantes ----
  l4u13m1: [
    {
      // chord_build — {root} é a fundamental do acorde, não a tonalidade:
      // a resposta avaliada é uma sétima menor SOBRE {root}. Espelha o EN.
      promptTemplate:
        'Constrói um acorde de sétima menor de {root}.',
      hintTemplate:
        'Um acorde de sétima menor: tríade menor + 7.ª menor. Funciona como pré-dominante, conduzindo a V ou V7.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Como funciona a função pré-dominante nas progressões harmónicas?',
      hintTemplate:
        'Os acordes pré-dominantes (ii, IV, ii7, IV7) preparam a dominante. Tipicamente movem-se T -> PD -> D -> T (tónica -> pré-dominante -> dominante -> tónica).',
      choiceSets: [
        [
          'A progressão harmónica padrão é T -> PD -> D -> T',
          'Os pré-dominantes vêm sempre depois da dominante',
          'Os pré-dominantes resolvem diretamente para a tónica',
          'Apenas acordes maiores podem funcionar como pré-dominantes',
        ],
        [
          'IV e ii (ou as suas formas de sétima) são os acordes pré-dominantes principais',
          'Apenas o acorde V funciona como pré-dominante',
          'iii é o acorde pré-dominante principal',
          'vi é o único acorde pré-dominante',
        ],
      ],
    },
  ],

  // ---- l4u13m2: Categorias de Função Harmónica ----
  l4u13m2: [
    {
      // multiple_choice
      promptTemplate:
        'Classifica este acorde pela sua função harmónica: tónica, pré-dominante ou dominante.',
      hintTemplate:
        'Função tónica: I, vi, iii. Pré-dominante: IV, ii. Dominante: V, vii°. Estas categorias descrevem como os acordes funcionam nas progressões, não apenas a sua qualidade.',
      choiceSets: [
        [
          'vi pode substituir I como acorde de função tónica',
          'vi é um acorde de função dominante',
          'vi é sempre um acorde pré-dominante',
          'vi não tem função padrão',
        ],
        [
          'vii° funciona como dominante porque partilha 3 notas com V7',
          'vii° funciona como acorde de tónica',
          'vii° funciona como acorde pré-dominante',
          'vii° não tem função harmónica',
        ],
        [
          'iii pode funcionar como tónica (partilhando 2 notas com I) ou como preparação da dominante',
          'iii é sempre um acorde dominante',
          'iii é sempre um acorde pré-dominante',
          'iii nunca é usado na harmonia da prática comum',
        ],
        [
          'Na cadência de engano V-vi, vi substitui I como acorde de função tónica',
          'Em V-vi, vi atua como acorde dominante',
          'V-vi não é uma cadência real',
          'vi rejeita sempre a função tónica',
        ],
      ],
    },
  ],

  // ---- l4u13m3: Ritmo Harmónico ----
  l4u13m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questão sobre ritmo harmónico.',
      hintTemplate:
        'O ritmo harmónico é a velocidade a que os acordes mudam. Pode acelerar perto de cadências, criando uma sensação de movimento para a frente e de chegada.',
      choiceSets: [
        [
          'O ritmo harmónico tipicamente acelera ao aproximar-se de uma cadência',
          'O ritmo harmónico mantém-se sempre constante',
          'O ritmo harmónico abranda sempre nas cadências',
          'O ritmo harmónico só muda entre secções',
        ],
        [
          'Um ritmo harmónico mais rápido cria uma maior sensação de impulso',
          'Um ritmo harmónico mais rápido cria um ambiente mais calmo',
          'O ritmo harmónico não afeta a energia musical',
          'Um ritmo harmónico mais lento indica sempre o clímax',
        ],
        [
          'Os acordes mudam tipicamente em tempos fortes na música da prática comum',
          'As mudanças de acorde acontecem apenas no tempo 1',
          'Os acordes nunca podem mudar a meio de um compasso',
          'O ritmo harmónico é sempre um acorde por compasso',
        ],
      ],
    },
  ],

  // ---- l4u13m4: Sequências ----
  l4u13m4: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica este tipo de sequência harmónica.',
      hintTemplate:
        'Uma sequência repete um padrão melódico/harmónico em níveis de altura sucessivamente mais altos ou mais baixos. Tipos comuns: quintas descendentes, 5-6 ascendente, terças descendentes.',
      choiceSets: [
        [
          'Uma sequência de quintas descendentes move-se pelo ciclo de quintas: I-IV-vii°-iii-vi-ii-V-I',
          'Uma sequência de quintas descendentes move-se para cima por 5.as',
          'Uma sequência de quintas descendentes usa apenas acordes maiores',
          'Uma sequência de quintas descendentes modula sempre',
        ],
        [
          'Uma sequência 5-6 ascendente usa acordes alternados de 5/3 e 6/3 em movimento ascendente por grau conjunto',
          'Uma sequência 5-6 ascendente usa apenas tríades em estado fundamental',
          'Uma sequência 5-6 ascendente desce sempre',
          'Uma sequência 5-6 ascendente não é um tipo real de sequência',
        ],
        [
          'As sequências podem temporariamente sobrepor as regras normais de condução de vozes (quintas paralelas podem ser aceitáveis)',
          'As sequências devem seguir sempre regras rigorosas de condução de vozes',
          'As quintas paralelas nunca são aceitáveis em sequências',
          'As sequências não têm relação com a condução de vozes',
        ],
      ],
    },
  ],

  // ---- l4u13m5: Progressões Comuns ----
  l4u13m5: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica o padrão de progressão harmónica descrito.',
      hintTemplate:
        'Progressões comuns: I-V-vi-IV, I-IV-V-I, ii-V-I, I-vi-IV-V. Cada uma tem um som característico e uma lógica funcional.',
      choiceSets: [
        [
          'I-IV-V-I segue o padrão funcional padrão T-PD-D-T',
          'I-IV-V-I não é uma progressão padrão',
          'I-IV-V-I viola as regras da harmonia funcional',
          'I-IV-V-I é usada apenas no jazz',
        ],
        [
          'A "progressão dos anos 50" I-vi-IV-V usa as três funções harmónicas',
          'I-vi-IV-V é uma invenção moderna',
          'I-vi-IV-V não segue a harmonia funcional',
          'I-vi-IV-V soa sempre triste',
        ],
        [
          'O movimento de baixo por grau conjunto (como I-V6-vi ou I6-ii6-V) cria condução de vozes suave',
          'O movimento de baixo por grau conjunto é proibido na harmonia clássica',
          'Primeiras inversões nunca são usadas para criar linhas de baixo por grau conjunto',
          'As linhas de baixo devem saltar sempre por 4.as e 5.as',
        ],
      ],
    },
    {
      // chord_build — {root} é a fundamental do acorde, não a tonalidade:
      // a resposta avaliada é uma tríade maior SOBRE {root}. Espelha o EN.
      promptTemplate:
        'Constrói uma tríade maior de {root}.',
      hintTemplate:
        'Uma tríade maior: fundamental + 3.ª maior + 5.ª perfeita. O acorde IV tem um carácter quente e subdominante.',
    },
  ],

  // =========================================================================
  // Unidade 14: Contraponto, Métrica, Análise e Harmonia Menor
  // =========================================================================
  //
  // NOTA (correção WS5 A2): em EN, todos os modelos de contraponto foram
  // agrupados em l4u14m1 (o único módulo de contraponto de espécies). A ordem
  // das entradas tem de coincidir com a ordem dos modelos em EN
  // (templatesL4.ts): [1.ª espécie, 2.ª espécie, identificação de intervalo].
  // Os módulos m2–m5 deixaram de ter modelos gerados.

  // ---- l4u14m1: Contraponto de Primeira e Segunda Espécie ----
  l4u14m1: [
    {
      // multiple_choice — primeira espécie
      promptTemplate:
        'Responde a esta questão sobre contraponto de primeira espécie.',
      hintTemplate:
        'Primeira espécie: nota contra nota. Usa consonâncias (3.as, 6.as, intervalos perfeitos). Começa e termina em consonâncias perfeitas. Evita 5.as/8.as paralelas. Prefere movimento contrário.',
      choiceSets: [
        [
          'A primeira espécie usa uma nota no contraponto para cada nota no cantus firmus',
          'A primeira espécie usa duas notas contra uma',
          'A primeira espécie usa quatro notas contra uma',
          'A primeira espécie não tem restrições rítmicas',
        ],
        [
          'Na primeira espécie, todos os intervalos verticais devem ser consonantes',
          'Dissonâncias são livremente permitidas na primeira espécie',
          'Apenas intervalos perfeitos são permitidos',
          'Apenas intervalos imperfeitos são permitidos',
        ],
        [
          'Aproximar-se de uma consonância perfeita por movimento contrário é a abordagem mais segura',
          'As consonâncias perfeitas devem ser abordadas por movimento paralelo',
          'A abordagem às consonâncias perfeitas não importa',
          'As consonâncias perfeitas só podem ser atingidas por movimento oblíquo',
        ],
      ],
    },
    {
      // multiple_choice — segunda espécie
      promptTemplate:
        'Responde a esta questão sobre contraponto de segunda espécie.',
      hintTemplate:
        'Segunda espécie: duas notas contra uma. A primeira nota de cada compasso deve ser consonante. A segunda nota pode ser uma consonância ou uma nota de passagem (dissonância).',
      choiceSets: [
        [
          'Na segunda espécie, dissonâncias são permitidas como notas de passagem em tempos fracos',
          'Todas as notas devem ser consonantes na segunda espécie',
          'Dissonâncias podem aparecer em tempos fortes na segunda espécie',
          'A segunda espécie não tem regras sobre dissonância',
        ],
        [
          'A segunda espécie introduz o conceito de tratamento da dissonância através de notas de passagem',
          'A segunda espécie introduz suspensões',
          'A segunda espécie introduz apogiaturas',
          'A segunda espécie não tem conceitos novos em relação à primeira',
        ],
      ],
    },
    {
      // interval_id
      promptTemplate:
        'Qual é o intervalo formado entre as duas vozes? Partindo de {root}.',
      hintTemplate:
        'No contraponto de espécies, consonâncias são 3.as, 6.as e intervalos perfeitos (P1, P5, P8). Dissonâncias (2.as, 7.as, trítono) requerem tratamento especial.',
    },
  ],
};

export default overlay;
