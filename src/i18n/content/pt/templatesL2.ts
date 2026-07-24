import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 2 exercise templates
// 12 modules, ~65 generated exercises
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 4: Todas as Tonalidades Maiores e Graus da Escala
  // =========================================================================

  // ---- l2u4m1: Todas as Tonalidades Maiores / Círculo de Quintas ----
  l2u4m1: [
    {
      // scale_build
      promptTemplate:
        'Constrói a escala de {root} maior. Seleciona as 7 notas usando os sustenidos ou bemóis corretos.',
      hintTemplate:
        'Aplica o padrão T-T-mT-T-T-T-mT a partir de {root}. Consulta o círculo de quintas para a armação de clave.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Quantos sustenidos ou bemóis tem esta tonalidade maior?',
      hintTemplate:
        'Segue o círculo de quintas. Sustenidos: G(1), D(2), A(3), E(4), B(5). Bemóis: F(1), Bb(2), Eb(3), Ab(4), Db(5).',
      choiceSets: [
        [
          'B maior tem 5 sustenidos',
          'B maior tem 4 sustenidos',
          'B maior tem 6 sustenidos',
          'B maior tem 3 sustenidos',
        ],
        [
          'Eb maior tem 3 bemóis',
          'Eb maior tem 2 bemóis',
          'Eb maior tem 4 bemóis',
          'Eb maior tem 1 bemol',
        ],
        [
          'Db maior tem 5 bemóis',
          'Db maior tem 4 bemóis',
          'Db maior tem 6 bemóis',
          'Db maior tem 3 bemóis',
        ],
      ],
    },
  ],

  // ---- l2u4m2: Nomes dos Graus da Escala ----
  l2u4m2: [
    {
      // scale_degree_id
      promptTemplate:
        'Na escala de {root} {scaleType}, qual é o número do grau da nota indicada?',
      hintTemplate:
        'Conta a partir de {root} como grau 1 ao longo da escala {scaleType}. Os nomes dos graus são: tónica, supertónica, mediante, subdominante, dominante, submediante, sensível.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Associa o número do grau da escala ao seu nome tradicional.',
      hintTemplate:
        '1=tónica, 2=supertónica, 3=mediante, 4=subdominante, 5=dominante, 6=submediante, 7=sensível.',
      choiceSets: [
        [
          'A mediante é o grau 3',
          'A mediante é o grau 4',
          'A mediante é o grau 5',
          'A mediante é o grau 2',
        ],
        [
          'A submediante é o grau 6',
          'A submediante é o grau 4',
          'A submediante é o grau 5',
          'A submediante é o grau 3',
        ],
        [
          'A supertónica é o grau 2',
          'A supertónica é o grau 3',
          'A supertónica é o grau 7',
          'A supertónica é o grau 1',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 5: Escalas Menores e Relações entre Tonalidades
  // =========================================================================

  // ---- l2u5m1: Menor Natural ----
  l2u5m1: [
    {
      // scale_build
      promptTemplate:
        'Constrói a escala de {root} menor natural. Seleciona as 7 notas seguindo o padrão T-mT-T-T-mT-T-T.',
      hintTemplate:
        'A escala de {root} menor natural segue o padrão T-mT-T-T-mT-T-T. Em relação à maior, os graus 3, 6 e 7 são baixados meio-tom.',
    },
  ],

  // ---- l2u5m2: Menor Harmónica/Melódica ----
  l2u5m2: [
    {
      // scale_build (harmonic)
      promptTemplate:
        'Constrói a escala de {root} menor harmónica. O 7.o grau é elevado em relação à menor natural.',
      hintTemplate:
        'Menor harmónica = menor natural com o 7.o grau elevado. Isso cria uma sensível a meio-tom abaixo da tónica {root}.',
    },
    {
      // scale_build (melodic)
      promptTemplate:
        'Constrói a escala de {root} menor melódica (forma ascendente). Tanto o 6.o como o 7.o grau são elevados.',
      hintTemplate:
        'Menor melódica ascendente = menor natural com o 6.o e 7.o graus elevados. Isso elimina a 2.a aumentada presente na menor harmónica.',
    },
  ],

  // ---- l2u5m3: Tonalidades Relativas/Paralelas ----
  l2u5m3: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica a relação entre estas tonalidades.',
      hintTemplate:
        'Tonalidades relativas partilham a mesma armação de clave (ex: C maior / A menor). Tonalidades paralelas partilham a mesma tónica (ex: C maior / C menor).',
      choiceSets: [
        [
          'A relativa menor de G maior é E menor',
          'A relativa menor de G maior é G menor',
          'A relativa menor de G maior é D menor',
          'A relativa menor de G maior é B menor',
        ],
        [
          'A relativa menor de D maior é B menor',
          'A relativa menor de D maior é D menor',
          'A relativa menor de D maior é A menor',
          'A relativa menor de D maior é F# menor',
        ],
        [
          'A relativa maior de F# menor é A maior',
          'A relativa maior de F# menor é F# maior',
          'A relativa maior de F# menor é D maior',
          'A relativa maior de F# menor é E maior',
        ],
        [
          'A relativa menor de Eb maior é C menor',
          'A relativa menor de Eb maior é Eb menor',
          'A relativa menor de Eb maior é Bb menor',
          'A relativa menor de Eb maior é Ab menor',
        ],
        [
          'Tonalidades paralelas partilham a mesma tónica mas diferem na qualidade',
          'Tonalidades paralelas partilham a mesma armação de clave',
          'Tonalidades paralelas estão sempre a uma 5.a de distância',
          'Tonalidades paralelas usam as mesmas notas',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 6: Compasso Composto e Síncopa
  // =========================================================================

  // ---- l2u6m1: Compasso Composto ----
  l2u6m1: [
    {
      // multiple_choice
      promptTemplate:
        'Classifica esta indicação de compasso como simples ou composto.',
      hintTemplate:
        'No compasso composto o número de cima é 6, 9 ou 12 e o tempo divide-se em 3. No compasso simples o tempo divide-se em 2.',
      choiceSets: [
        [
          '12/8 é composto quaternário: 4 tempos, cada um dividido em 3',
          '12/8 é simples: 12 tempos por compasso',
          '12/8 é composto ternário: 3 tempos, cada um dividido em 4',
          '12/8 é simples quaternário: 4 tempos de 3 colcheias',
        ],
        [
          '3/8 é simples ternário: 3 tempos de colcheia por compasso',
          '3/8 é composto: 1 tempo dividido em 3',
          '3/8 é igual a 6/8',
          '3/8 é composto ternário',
        ],
        [
          '9/8 é composto ternário: 3 tempos principais, cada um dividido em 3',
          '9/8 é simples: 9 tempos de colcheia por compasso',
          '9/8 é composto binário',
          '9/8 é igual a 3/4',
        ],
      ],
    },
  ],

  // ---- l2u6m2: Síncopa ----
  l2u6m2: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta pergunta sobre síncopa e técnicas rítmicas.',
      hintTemplate:
        'A síncopa coloca ênfase em tempos ou subdivisões normalmente fracos. Cria surpresa rítmica e impulso para a frente.',
      choiceSets: [
        [
          'A síncopa cria interesse rítmico ao acentuar contratempos',
          'A síncopa significa tocar tudo no tempo',
          'A síncopa remove todos os acentos da música',
          'A síncopa envolve sempre tercinas',
        ],
        [
          'Uma ligadura sobre a barra de compasso cria síncopa ao prolongar o som para o tempo forte',
          'Uma ligadura sobre a barra de compasso não tem efeito rítmico',
          'Uma ligadura sobre a barra de compasso duplica sempre o andamento',
          'As ligaduras só podem ocorrer dentro de um único compasso',
        ],
        [
          'A hemíola cria a ilusão de alternância entre agrupamentos binários e ternários',
          'A hemíola é o mesmo que um ritardando',
          'A hemíola significa tocar notas uma oitava acima',
          'A hemíola só ocorre em compasso 4/4',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 7: Intervalos, Tríades e Harmonia Diatónica
  // =========================================================================

  // ---- l2u7m1: Qualidade do Intervalo ----
  l2u7m1: [
    {
      // interval_id
      promptTemplate:
        'Identifica o intervalo a partir de {root} no sentido {direction}. Determina tanto o número como a qualidade.',
      hintTemplate:
        'Conta os nomes das notas a partir de {root} para o número do intervalo, depois conta os meios-tons para a qualidade (maior, menor, perfeito, aumentado, diminuto).',
    },
  ],

  // ---- l2u7m2: Intervalos Aumentados/Diminutos/Compostos ----
  l2u7m2: [
    {
      // interval_id
      promptTemplate:
        'Identifica este intervalo a partir de {root}. Pode ser aumentado, diminuto ou composto.',
      hintTemplate:
        'Intervalos aumentados são um meio-tom maiores que perfeitos/maiores. Diminutos são um meio-tom menores que perfeitos/menores. Intervalos compostos excedem a oitava.',
    },
  ],

  // ---- l2u7m3: Os Quatro Tipos de Tríades ----
  l2u7m3: [
    {
      // chord_build
      promptTemplate:
        'Constrói uma tríade de {root} {quality}. Seleciona as 3 notas que formam este acorde.',
      hintTemplate:
        'Maior = fundamental + 3.aM(4) + 5.aP(7). Menor = fundamental + 3.am(3) + 5.aP(7). Diminuta = fundamental + 3.am(3) + 5.adim(6). Aumentada = fundamental + 3.aM(4) + 5.aaum(8). Começa em {root}.',
    },
  ],

  // ---- l2u7m4: Inversões/Baixo Cifrado ----
  l2u7m4: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta pergunta sobre inversões de acordes e notação de baixo cifrado.',
      hintTemplate:
        'Estado fundamental = 5/3. 1.a inversão = 6/3 (6). 2.a inversão = 6/4. A nota do baixo determina a inversão.',
      choiceSets: [
        [
          'Na 2.a inversão, a 5.a do acorde está no baixo',
          'Na 2.a inversão, a 3.a do acorde está no baixo',
          'Na 2.a inversão, a fundamental está no baixo',
          'Na 2.a inversão, a 7.a está no baixo',
        ],
        [
          'Um acorde C/E é C maior em 1.a inversão',
          'Um acorde C/E é E maior em estado fundamental',
          'Um acorde C/E é C maior em 2.a inversão',
          'Um acorde C/E é um acorde de E menor',
        ],
        [
          'Baixo cifrado 6/4 indica 2.a inversão',
          'Baixo cifrado 6/4 indica estado fundamental',
          'Baixo cifrado 6/4 indica 1.a inversão',
          'Baixo cifrado 6/4 indica um acorde de 7.a',
        ],
        [
          'O 6/4 cadencial funciona como ornamentação da dominante',
          'O 6/4 cadencial funciona como acorde de tónica',
          'O 6/4 cadencial funciona como subdominante',
          'O 6/4 cadencial nunca é usado na música clássica',
        ],
      ],
    },
  ],

  // ---- l2u7m5: Tríades Diatónicas/Numeração Romana ----
  l2u7m5: [
    {
      // chord_build
      promptTemplate:
        'Constrói a tríade diatónica sobre {root} tal como aparece em C maior.',
      hintTemplate:
        'Usa apenas as notas de C maior (sem sustenidos nem bemóis). A qualidade depende de qual grau da escala {root} ocupa: I, IV, V são maiores; ii, iii, vi são menores; vii é diminuta.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica o algarismo romano e a qualidade desta tríade diatónica.',
      hintTemplate:
        'Nas tonalidades maiores: I(M) ii(m) iii(m) IV(M) V(M) vi(m) viio(dim). Maiúscula = maior, minúscula = menor, o = diminuta.',
      choiceSets: [
        [
          'O acorde ii numa tonalidade maior é menor',
          'O acorde ii numa tonalidade maior é maior',
          'O acorde ii numa tonalidade maior é diminuto',
          'O acorde ii numa tonalidade maior é aumentado',
        ],
        [
          'O acorde vi numa tonalidade maior é menor',
          'O acorde vi numa tonalidade maior é maior',
          'O acorde vi numa tonalidade maior é diminuto',
          'O acorde vi numa tonalidade maior é aumentado',
        ],
        [
          'O acorde IV numa tonalidade maior é maior',
          'O acorde IV numa tonalidade maior é menor',
          'O acorde IV numa tonalidade maior é aumentado',
          'O acorde IV numa tonalidade maior é diminuto',
        ],
      ],
    },
  ],
};

export default overlay;
