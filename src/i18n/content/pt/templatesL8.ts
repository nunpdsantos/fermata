import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 8 exercise templates
// 11 modules — index-aligned with templatesL8.ts (W4-01 re-keying, 2026-10-31)
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 25: Fuga e Contraponto Imitativo
  // =========================================================================

  // ---- l8u25m1: Exposição da Fuga ----
  l8u25m1: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a exposição da fuga é verdadeira?',
      hintTemplate:
        'Exposição da fuga: o sujeito entra na tónica e a resposta surge ao nível da dominante. Uma resposta real transpõe exatamente, uma 5.ª perfeita acima ou uma 4.ª perfeita abaixo. Uma resposta tonal ajusta o início: o grau 5 é respondido pelo 1, preservando a relação tónica–dominante em vez de tonicizar imediatamente a dominante. As vozes seguintes alternam entradas na tónica e na dominante; um contrassujeito é uma linha recorrente que acompanha entradas posteriores.',
      choiceSets: [
        [
          'O sujeito entra primeiro na tonalidade da tónica e a resposta entra na dominante',
          "O sujeito entra primeiro na tonalidade da dominante e a resposta entra na tónica",
          "O sujeito entra primeiro na tonalidade da tónica e a resposta entra na tónica",
          "O sujeito entra primeiro na tonalidade da dominante e a resposta entra na dominante",
        ],
        [
          'Uma resposta tonal ajusta intervalos para evitar tonicizar a dominante no ponto de entrada',
          'Uma resposta tonal transpõe o sujeito exatamente para a dominante, sem ajustar intervalos no ponto de entrada',
          "Uma resposta tonal ajusta a instrumentação para manter o sujeito na sua voz original",
          "Uma resposta tonal preserva exatamente os intervalos e muda o compasso para estabelecer a dominante",
        ],
        [
          'Uma resposta real transpõe o sujeito exatamente para a dominante (uma 5.ª perfeita acima ou 4.ª perfeita abaixo)',
          "Uma resposta real transpõe o sujeito exatamente para a subdominante (uma 4.ª perfeita acima ou 5.ª perfeita abaixo)",
          "Uma resposta real transpõe o sujeito exatamente para a tónica (uma 8.ª perfeita acima ou 8.ª perfeita abaixo)",
          "Uma resposta real transpõe o sujeito exatamente para a sensível (uma 7.ª maior acima ou 2.ª menor abaixo)",
        ],
        [
          "O contrassujeito é uma linha melódica recorrente que acompanha entradas posteriores do sujeito",
          "O contrassujeito é o próprio sujeito, transposto para acompanhar entradas posteriores do sujeito",
          "O contrassujeito é a própria resposta, repetida para introduzir entradas posteriores do sujeito",
          'O contrassujeito é uma nota pedal no baixo, mantida sob as entradas posteriores do sujeito',
        ],
      ],
    },
  ],

  // ---- l8u25m2: Episódios e Stretto ----
  l8u25m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre os episódios, o stretto e os artifícios da fuga é verdadeira?',
      hintTemplate:
        'Episódios: passagens entre entradas do sujeito, frequentemente usando sequências baseadas em fragmentos. Stretto: entradas sobrepostas do sujeito onde a resposta começa antes de o sujeito terminar. A aumentação alonga os valores das notas, geralmente duplicando-os; a diminuição encurta-os, geralmente para metade.',
      choiceSets: [
        [
          'O stretto sobrepõe entradas do sujeito: a seguinte começa antes de terminar a anterior',
          'O stretto separa entradas do sujeito: a seguinte começa depois de terminar a anterior',
          'O stretto aumenta entradas do sujeito: a seguinte duplica os valores de nota anteriores',
          'O stretto retrograda entradas do sujeito: a seguinte inverte a ordem das notas anteriores',
        ],
        [
          'Os episódios modulam entre áreas tonais, frequentemente usando sequências derivadas do sujeito',
          "Os episódios são apresentações completas do sujeito em novas tonalidades, geralmente acompanhadas pelo contrassujeito",
          "Os episódios apresentam a primeira entrada do sujeito em cada voz, estabelecendo a exposição da fuga",
          "Os episódios são entradas sobrepostas do sujeito completo, começando frequentemente antes de terminarem as anteriores",
        ],
        [
          'A aumentação multiplica os valores das notas por dois',
          'A aumentação divide os valores das notas por dois',
          'A aumentação inverte a sequência das notas',
          'A aumentação inverte a direção dos intervalos',
        ],
        [
          'A diminuição apresenta o sujeito em valores de nota mais curtos (geralmente reduzidos a metade)',
          "A diminuição apresenta o sujeito em valores de nota mais longos (geralmente duplicados)",
          "A diminuição significa eliminar notas mantendo inalterados os valores de nota restantes",
          "A diminuição significa inverter a ordem das notas mantendo os valores de nota originais",
        ],
      ],
    },
  ],

  // ---- l8u25m3: Cânone ----
  l8u25m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre os tipos de cânone é verdadeira?',
      hintTemplate:
        'Tipos de cânone: estrito (imitação exata), à oitava, à 5.ª, em inversão (movimento contrário), em retrogradação (cânone de caranguejo), cânone duplo (2 cânones independentes). Um cânone perpétuo liga o fim ao início para poder repetir-se continuamente.',
      choiceSets: [
        [
          'Um cânone em inversão transforma cada subida melódica numa descida e cada descida numa subida',
          'Um cânone em inversão lê a melodia desde a última nota até à primeira',
          'Um cânone em inversão mantém a melodia mas dá a cada nota o dobro da duração original',
          'Um cânone em inversão mantém a melodia mas dá a cada nota metade da duração original',
        ],
        [
          "Um cânone de caranguejo significa ler a melodia do fim para o princípio",
          "Um cânone de caranguejo significa ler a melodia com as direções dos intervalos invertidas",
          "Um cânone de caranguejo significa ler a melodia com as durações das notas duplicadas",
          "Um cânone de caranguejo significa ler a melodia como um cânone circular em repetição contínua",
        ],
        [
          'O que define um cânone perpétuo é que volta ao início',
          'O que define um cânone perpétuo é que inverte a ordem das notas',
          'O que define um cânone perpétuo é que duplica os valores das notas',
          'O que define um cânone perpétuo é que reduz a metade os valores das notas',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 26: Grande Forma e Orquestração
  // =========================================================================

  // ---- l8u26m1: Forma-Sonata ----
  l8u26m1: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a forma-sonata é verdadeira?',
      hintTemplate:
        'Secções da forma-sonata: Exposição (1.º grupo temático, transição, 2.º grupo temático, tema conclusivo), Desenvolvimento (fragmentação, sequências, tonalidades remotas), Reexposição (tudo na tónica), Coda opcional. Uma falsa reexposição sugere o regresso noutra tonalidade antes do verdadeiro regresso à tónica.',
      choiceSets: [
        [
          'A transição na exposição modula da tónica para a área tonal secundária',
          "A transição na exposição modula da área tonal secundária de volta para a tónica",
          "A transição na exposição confirma a tonalidade secundária depois de terminar o segundo tema",
          "A transição na exposição reapresenta o primeiro tema na tónica depois do desenvolvimento",
        ],
        [
          'O desenvolvimento apresenta tipicamente fragmentação, sequência e modulação por tonalidades afastadas',
          "O desenvolvimento apresenta tipicamente os dois temas contrastantes e estabelece as suas áreas tonais originais",
          "O desenvolvimento reapresenta tipicamente ambos os temas na tónica para resolver o contraste tonal original",
          "O desenvolvimento apresenta tipicamente o solista do concerto depois da primeira exposição orquestral",
        ],
        [
          'Uma falsa reexposição começa o regresso do tema na tonalidade errada antes da verdadeira reexposição',
          'Uma falsa reexposição é a verdadeira reexposição na tónica, mas com o primeiro tema deixado de fora',
          'Uma falsa reexposição é a retransição, a passagem construída sobre a dominante para preparar o verdadeiro regresso',
          'Uma falsa reexposição surge depois da verdadeira reexposição, como abertura de uma coda expandida',
        ],
        [
          'Na exposição de uma sonata em A menor, o segundo tema está tipicamente em C maior',
          'Na exposição de uma sonata em A menor, o segundo tema está tipicamente em A maior',
          'Na exposição de uma sonata em A menor, o segundo tema está tipicamente em B menor',
          'Na exposição de uma sonata em A menor, o segundo tema está tipicamente em D menor',
        ],
      ],
    },
  ],

  // ---- l8u26m2: Variação, Rondó e Ritornello ----
  l8u26m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as formas de variação, rondó e ritornello é verdadeira?',
      hintTemplate:
        'Ritornello: passagem orquestral recorrente alternando com episódios solistas (concerto barroco). Sonata-rondó: ABACAB\'A combina princípios do rondó e da sonata. Uma passacaglia desenvolve variações sobre uma linha de baixo recorrente.',
      choiceSets: [
        [
          'A forma de ritornello dá os refrães ao tutti e as passagens contrastantes ao solista',
          'A forma de ritornello dá o tema recorrente ao solista e material novo a cada tutti orquestral',
          'A forma de ritornello dá o tema inicial à orquestra e não o faz regressar depois',
          'A forma de ritornello dá o tema orquestral a cada episódio solista como cópia exata',
        ],
        [
          "O sonata-rondó retoma tipicamente o tema A e regressa a B na tónica na segunda metade",
          "O sonata-rondó retoma tipicamente o tema A e regressa a B na tonalidade secundária na segunda metade",
          "O sonata-rondó evita tipicamente retomar o tema A e regressa a B na tónica na segunda metade",
          "O sonata-rondó retoma tipicamente o tema A e omite o regresso de B na segunda metade",
        ],
        [
          "Uma passacaglia é um conjunto de variações sobre uma linha de baixo recorrente",
          'Uma passacaglia é um refrão recorrente que alterna com episódios melódicos contrastantes',
          "Uma passacaglia é uma estrutura de dois temas com exposição, desenvolvimento e reexposição",
          'Uma passacaglia é uma passagem orquestral recorrente que alterna com episódios solistas contrastantes',
        ],
      ],
    },
  ],

  // ---- l8u26m3: Orquestração ----
  l8u26m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre os instrumentos da orquestra é verdadeira?',
      hintTemplate:
        'Famílias da orquestra: cordas, madeiras, metais, percussão. Cada instrumento tem uma extensão, timbre e função característicos no conjunto. Um instrumento transpositor soa numa altura diferente da escrita.',
      choiceSets: [
        [
          "Pautas das cordas de cima para baixo numa partitura orquestral convencional: violino I, violino II, viola, violoncelo, contrabaixo",
          "Pautas das cordas de cima para baixo numa partitura orquestral convencional: viola, violino II, violino I, violoncelo, contrabaixo",
          "Pautas das cordas de cima para baixo numa partitura orquestral convencional: violino I, violino II, violoncelo, viola, contrabaixo",
          "Pautas das cordas de cima para baixo numa partitura orquestral convencional: violino I, violino II, viola, contrabaixo, violoncelo",
        ],
        [
          'No clarinete em Bb, o D5 escrito soa sempre como C5',
          'No clarinete em Bb, o D5 escrito soa sempre como E5',
          'No clarinete em Bb, o D5 escrito soa sempre como B4',
          'No clarinete em Bb, o D5 escrito soa sempre como F5',
        ],
        [
          'A trompa em F soa uma 5.ª perfeita abaixo do escrito',
          "A trompa em F soa uma 5.ª perfeita acima do escrito",
          "A trompa em F soa uma 4.ª perfeita abaixo do escrito",
          "A trompa em F soa uma oitava abaixo do escrito",
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 27: Teoria dos Conjuntos e Técnicas do Século XX
  // =========================================================================

  // ---- l8u27m1: Conjuntos de Classes de Altura ----
  l8u27m1: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre os conjuntos de classes de altura é verdadeira?',
      hintTemplate:
        'Classes de altura: C=0 até B=11. Um conjunto de classes de altura lista classes de altura sem repetição em ordem ascendente. A ordem normal coloca-as no arranjo mais compacto.',
      choiceSets: [
        [
          'Um conjunto de classes de altura trata as notas equivalentes à oitava e enarmónicas como uma só classe, usando inteiros de 0 a 11',
          'Um conjunto de classes de altura mantém nomes de notas e números de oitava, por isso C4 e C5 contam como duas classes diferentes no conjunto',
          'Conjuntos de classes de altura só funcionam para música tonal',
          'Os inteiros de conjuntos de classes de altura vão de 0 a 7',
        ],
        [
          'A ordem normal agrupa as notas o mais perto possível dentro de uma oitava, lidas de baixo para cima',
          'A ordem normal agrupa as notas o mais perto possível dentro de uma oitava, lidas de cima para baixo',
          'A ordem normal agrupa as notas o mais longe possível dentro de uma oitava, lidas de baixo para cima',
          'A ordem normal agrupa as notas o mais longe possível dentro de uma oitava, lidas de cima para baixo',
        ],
        [
          "As classes de altura {0, 4, 7} correspondem às notas do acorde de C maior",
          "As classes de altura {0, 4, 7} correspondem às notas do acorde de E maior",
          "As classes de altura {0, 4, 7} correspondem às notas do acorde de G maior",
          "As classes de altura {0, 4, 7} correspondem às notas do acorde de B maior",
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre vetores intervalares, forma primária e relações-Z é verdadeira?',
      hintTemplate:
        'Vetor intervalar: contagens de cada classe de intervalo (ci 1-6) num conjunto, escrito como <x x x x x x>. Dois conjuntos são Z-relacionados quando partilham o mesmo vetor intervalar mas NÃO estão relacionados por transposição ou inversão (pertencem a classes de conjuntos diferentes). A forma primária escolhe o representante mais compacto após comparar transposições e inversões, começando depois em 0.',
      choiceSets: [
        [
          'O vetor intervalar conta ocorrências de cada classe de intervalo (1 a 6) num conjunto de classes de altura',
          "O vetor intervalar conta ocorrências de cada classe de intervalo (1 a 12) num conjunto de classes de altura",
          "O vetor intervalar conta ocorrências de cada classe de intervalo (0 a 5) num conjunto de classes de altura",
          "O vetor intervalar conta ocorrências de cada classe de intervalo (0 a 11) num conjunto de classes de altura",
        ],
        [
          'A forma primária compara transposições e inversões e começa a forma escolhida em 0',
          'A forma primária compara apenas transposições e começa a forma escolhida em 0',
          'A forma primária compara transposições e inversões e mantém a forma escolhida no seu nível de altura original',
          'A forma primária compara apenas transposições e mantém a forma escolhida no seu nível de altura original',
        ],
        [
          'Conjuntos Z-relacionados têm inventários intervalares iguais, mas não coincidem por transposição nem por inversão',
          'Conjuntos Z-relacionados têm inventários intervalares iguais porque a transposição transforma diretamente um no outro',
          'Conjuntos Z-relacionados partilham a forma primária, mas diferem no número de ocorrências de cada classe de intervalo',
          'Conjuntos Z-relacionados têm inventários intervalares diferentes, mas coincidem por transposição ou inversão',
        ],
      ],
    },
  ],

  // ---- l8u27m2: Técnica Dodecafónica ----
  l8u27m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a técnica dodecafónica é verdadeira?',
      hintTemplate:
        'A série usa todas as 12 classes de altura numa ordem fixa. Transformações: P (original), I (inversão), R (retrógrada), RI (retrógrada-inversão). A matriz 12x12 organiza as 48 formas da série.',
      choiceSets: [
        [
          'A série original ordena as 12 classes de altura, sem duplicar nenhuma dentro dessa série',
          'A série original ordena as 12 classes de altura e duplica a primeira como décima terceira entrada',
          'A série original divide as 12 classes de altura em duas séries independentes de seis notas',
          'A série original divide as 12 classes de altura em três séries independentes de quatro notas',
        ],
        [
          "As quatro formas básicas leem a série para a frente, para trás, em espelho, ou para trás e em espelho",
          "As quatro formas básicas leem a série para a frente, para trás, ao dobro da duração, ou a metade da duração",
          "As quatro formas básicas leem a série para a frente, em espelho, ao dobro da duração, ou a metade da duração",
          "As quatro formas básicas leem a série para trás, em espelho, ao dobro da duração, ou a metade da duração",
        ],
        [
          'Uma matriz 12×12 apresenta 48 formas da série',
          'Uma matriz 12×12 apresenta 24 formas da série',
          'Uma matriz 12×12 apresenta 36 formas da série',
          'Uma matriz 12×12 apresenta 12 formas da série',
        ],
      ],
    },
  ],

  // ---- l8u27m3: Planing, Politonalidade e Pandiatonicismo ----
  l8u27m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o planing, a politonalidade e a música espectral é verdadeira?',
      hintTemplate:
        'O planing move uma forma de acorde em paralelo. A politonalidade faz soar duas ou mais tonalidades ao mesmo tempo; o pandiatonicismo usa livremente as notas de uma tonalidade, sem harmonia funcional. O espectralismo constrói a harmonia a partir da série de harmónicos; a microtonalidade usa passos menores que um meio-tom.',
      choiceSets: [
        [
          'A politonalidade faz sempre soar duas ou mais tonalidades ao mesmo tempo, por exemplo C maior contra F# maior',
          "A politonalidade faz sempre soar dois modos na mesma tónica, por exemplo C lídio contra C mixolídio",
          "A politonalidade faz sempre soar duas tonalidades sucessivamente, por exemplo C maior seguido de F# maior",
          "A politonalidade faz sempre soar uma tonalidade em dois registos, por exemplo C maior no agudo e no grave",
        ],
        [
          'O pandiatonicismo usa uma coleção diatónica sem exigir progressões funcionais',
          'O pandiatonicismo usa uma coleção cromática sem exigir progressões funcionais',
          'O pandiatonicismo usa uma coleção diatónica exigindo progressões funcionais',
          'O pandiatonicismo usa uma coleção cromática exigindo progressões funcionais',
        ],
        [
          'O planing cromático mantém sempre os intervalos exatos; o planing diatónico ajusta-os à escala',
          "O planing cromático costuma ajustar os intervalos à escala; o planing diatónico mantém os intervalos exatos",
          "O planing cromático move as vozes extremas em movimento contrário; o diatónico move-as em paralelo",
          "O planing cromático mantém o baixo imóvel enquanto as vozes superiores se movem; o diatónico move todas as vozes",
        ],
        [
          "A música espectral constrói acordes estudando as frequências que compõem um som",
          'A música espectral constrói acordes estudando as alturas ordenadas de uma série dodecafónica',
          'A música espectral constrói acordes estudando o ciclo de acordes dominantes de uma tonalidade',
          'A música espectral constrói acordes estudando as durações escritas das notas de uma melodia',
        ],
        [
          'A microtonalidade usa intervalos menores que um meio-tom, não apenas as 12 notas habituais',
          "A microtonalidade usa intervalos iguais a um meio-tom, limitada às 12 alturas habituais",
          "A microtonalidade usa alterações de intensidade em vez de alterações de altura",
          "A microtonalidade usa alterações de duração em vez de alterações de altura",
        ],
      ],
    },
  ],

  // ---- l8u27m4: Minimalismo, Aleatoriedade e Técnicas Expandidas ----
  l8u27m4: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o minimalismo, a música aleatória e as técnicas expandidas é verdadeira?',
      hintTemplate:
        'Minimalismo: padrões repetitivos, processo gradual, material harmónico limitado. Pioneiros: Reich (desfasamento), Glass (processo aditivo), Riley (loops de fita). A música aleatória deixa elementos ao acaso; as técnicas expandidas são formas não convencionais de tocar ou cantar.',
      choiceSets: [
        [
          'O desfasamento desloca gradualmente dois padrões repetidos idênticos para fora de sincronia',
          'O desfasamento mantém dois padrões repetidos idênticos exatamente sincronizados',
          'O desfasamento expande dois padrões repetidos idênticos acrescentando notas',
          'O desfasamento dá a dois padrões repetidos idênticos alturas novas escolhidas ao acaso',
        ],
        [
          'Um processo aditivo alonga um padrão repetido acrescentando notas gradualmente',
          'Um processo aditivo encurta um padrão repetido retirando notas gradualmente',
          'Um processo aditivo desloca gradualmente dois padrões repetidos para fora de sincronia',
          'Um processo aditivo escolhe ao acaso as notas de um padrão repetido',
        ],
        [
          'A música aleatória deixa alguns elementos ao acaso ou à escolha do intérprete',
          "A música aleatória fixa alturas, durações e dinâmicas antecipadamente sem acaso nem escolha do intérprete",
          "A música aleatória significa expandir um padrão repetido acrescentando-lhe notas gradualmente",
          "A música aleatória significa deslocar gradualmente dois padrões repetidos idênticos para fora de sincronia",
        ],
        [
          'As técnicas expandidas incluem multifónicos, piano preparado, col legno e Sprechstimme',
          'As técnicas expandidas incluem desfasamento, adição, repetição e transformação gradual',
          'As técnicas expandidas incluem moedas ao ar, mapas estelares, forma móvel e operações de acaso',
          'As técnicas expandidas incluem pulsação regular, bordões, padrões repetidos e ritmos aditivos',
        ],
      ],
    },
  ],

  // ---- l8u27m5: Ritmo Avançado ----
  l8u27m5: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a polirritmia, a hemíola e a modulação métrica é verdadeira?',
      hintTemplate:
        'Polirritmia: duas divisões do mesmo intervalo de tempo ao mesmo tempo (3 contra 2). Polimetria: dois compassos ao mesmo tempo. Hemíola: 2 × 3 tempos reagrupados como 3 × 2. Modulação métrica: uma figura do andamento antigo torna-se uma figura do novo. No compasso simples, uma quiáltera de cinco semicolcheias encaixa cinco notas iguais no espaço de quatro semicolcheias normais.',
      choiceSets: [
        [
          'Uma polirritmia faz soar duas divisões em conflito do mesmo intervalo de tempo, por exemplo 3 contra 2',
          "Uma polirritmia costuma dividir o mesmo intervalo de tempo igualmente em cada parte, por exemplo 3 notas iguais contra 3 notas iguais",
          "Uma polirritmia acelera um único padrão rítmico, por exemplo colcheias repetidas de 80 até 120 tempos por minuto",
          "Uma polirritmia muda todas as partes para um novo compasso em conjunto, por exemplo 3/4 seguido de 4/4 na barra seguinte",
        ],
        [
          'A polimetria opõe dois compassos, por exemplo 3/4 numa parte contra 4/4 noutra',
          "A polimetria mantém o mesmo compasso nas duas partes, por exemplo 3/4 numa parte contra 3/4 noutra",
          "A polimetria muda o compasso das duas partes em conjunto, por exemplo 3/4 em ambas seguido de 4/4 em ambas",
          'A polimetria divide um compasso partilhado de formas diferentes, por exemplo três notas contra duas num compasso de 6/8',
        ],
        [
          'Uma hemíola reagrupa seis tempos de 2 × 3 em 3 × 2, por exemplo dois compassos de 3/4 sentidos como um compasso de 3/2',
          "Uma hemíola costuma duplicar o andamento, por exemplo seis tempos de semínima comprimidos na duração de três",
          'Uma hemíola mantém seis tempos em 3 + 3 mas desloca o acento para o tempo 2 de cada compasso',
          "Uma hemíola acrescenta um tempo a cada compasso ternário, por exemplo dois compassos de 3/4 ampliados para dois de 4/4",
        ],
        [
          'Modulação métrica: se as colcheias de tercina a ♩ = 120 passam a ser as novas colcheias, a nova ♩ = 180',
          "Modulação métrica: se as colcheias de tercina a ♩ = 120 passam a ser as novas colcheias, a nova ♩ = 120",
          "Modulação métrica: se as colcheias de tercina a ♩ = 120 passam a ser as novas colcheias, a nova ♩ = 80",
          "Modulação métrica: se as colcheias de tercina a ♩ = 120 passam a ser as novas colcheias, a nova ♩ = 240",
        ],
        [
          'Num compasso simples, uma quiáltera de cinco semicolcheias ocupa o tempo de quatro semicolcheias normais',
          'Num compasso simples, uma quiáltera de cinco semicolcheias ocupa o tempo de três semicolcheias normais',
          'Num compasso simples, uma quiáltera de cinco semicolcheias ocupa o tempo de cinco semicolcheias normais',
          'Num compasso simples, uma quiáltera de cinco semicolcheias ocupa o tempo de seis semicolcheias normais',
        ],
      ],
    },
  ],

};

export default overlay;
