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
        'Exposição da fuga: o sujeito entra na tónica, a resposta entra na dominante (real ou tonal), as vozes seguintes entram alternando T-D. Um contra-sujeito acompanha cada nova entrada.',
      choiceSets: [
        [
          'O sujeito entra primeiro na tonalidade da tónica e a resposta entra na dominante',
          'A resposta entra primeiro, na subdominante, e o sujeito segue-a depois na tonalidade da tónica',
          'Tanto o sujeito como a resposta estão na tónica, por isso a exposição fica na tonalidade principal desde a primeira entrada',
          'O sujeito entra primeiro na tonalidade da dominante e a resposta entra depois na tonalidade da tónica',
        ],
        [
          'Uma resposta tonal ajusta intervalos para evitar tonicizar a dominante no ponto de entrada',
          'Uma resposta tonal transpõe o sujeito exatamente para a dominante, sem alterar nenhum intervalo',
          'Uma resposta tonal está num metro diferente',
          'Respostas tonais e reais são o mesmo conceito com dois nomes, usados em épocas diferentes',
        ],
        [
          'Uma resposta real transpõe o sujeito exatamente para a dominante (uma P5 acima ou P4 abaixo)',
          'Uma resposta real altera alguns intervalos do sujeito para poder ficar na tónica',
          'Uma resposta tonal, e não uma real, transpõe exatamente os intervalos do sujeito para a dominante, uma P5 acima',
          'Uma resposta real é o contra-sujeito, uma segunda melodia escrita contra o sujeito',
        ],
        [
          'O contra-sujeito é uma linha melódica recorrente que acompanha cada nova entrada do sujeito',
          'O contra-sujeito é apenas o próprio sujeito, repetido na tónica sempre que uma nova voz entra na fuga',
          'O contra-sujeito só aparece uma vez',
          'O contra-sujeito está sempre em uníssono com a resposta',
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
        'Episódios: passagens entre entradas do sujeito, frequentemente usando sequências baseadas em fragmentos. Stretto: entradas sobrepostas do sujeito onde a resposta começa antes de o sujeito terminar.',
      choiceSets: [
        [
          'No stretto, uma nova entrada começa o sujeito antes de a anterior o ter terminado',
          'No stretto cada voz espera que a entrada anterior termine e só então entra',
          'No stretto, quanto maior o espaço entre as entradas, mais dramaticamente poderosa é a passagem',
          'O stretto está reservado à exposição e evita-se perto do fim da fuga',
        ],
        [
          'Os episódios modulam entre áreas tonais, frequentemente usando sequências derivadas do sujeito',
          'Os episódios apresentam sempre o sujeito completo na tonalidade da tónica, sem modular',
          'Os episódios são as entradas intermédias: apresentações completas do sujeito em tonalidades relacionadas',
          'Os episódios devem permanecer na tonalidade da tónica',
        ],
        [
          'A aumentação duplica as durações',
          'A aumentação acrescenta notas ao sujeito, mantendo todos os seus valores de nota iguais aos originais',
          'A aumentação é o mesmo que a inversão',
          'A aumentação encurta os valores de nota',
        ],
        [
          'A diminuição apresenta o sujeito em valores de nota mais curtos (geralmente reduzidos a metade)',
          'A diminuição retira notas ao sujeito, mas mantém os seus valores de nota originais',
          'A diminuição apresenta o sujeito em valores de nota mais longos (geralmente duplicados)',
          'A diminuição torna o sujeito mais forte',
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
        'Tipos de cânone: estrito (imitação exata), à oitava, à 5.ª, em inversão (movimento contrário), em retrogradação (cânone de caranguejo), cânone duplo (2 cânones independentes).',
      choiceSets: [
        [
          'Um cânone em inversão (cânone espelhado) imita a melodia em movimento contrário',
          'Um cânone em inversão toca a melodia de trás para a frente, da última nota para a primeira, à mesma altura',
          'Um cânone em inversão inverte o ritmo',
          'Cânone em inversão é o mesmo que aumentação: o seguidor repete a melodia em valores de nota mais longos',
        ],
        [
          'Um cânone de caranguejo (canon cancrizans) apresenta a melodia em retrogradação',
          'Um cânone de caranguejo (canon cancrizans) vira a melodia de pernas para o ar, em movimento contrário',
          'Um cânone de caranguejo (canon cancrizans) duplica os valores das notas no seguidor',
          'Um cânone de caranguejo (canon cancrizans) é um cânone perpétuo ao uníssono, com as vozes a entrar a intervalos regulares',
        ],
        [
          'Um cânone perpétuo volta ao início',
          'Um cânone perpétuo vai acrescentando vozes e acelerando até chegar a uma cadência final',
          'Um cânone perpétuo acelera gradualmente',
          'Um cânone perpétuo tem sempre um final claro',
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
        'Secções da forma-sonata: Exposição (FTG-TR-STG-CT), Desenvolvimento (fragmentação, sequências, tonalidades remotas), Reexposição (tudo na tónica), Coda opcional.',
      choiceSets: [
        [
          'A transição na exposição modula da tónica para a área tonal secundária',
          'A transição na exposição permanece na tónica e limita-se a introduzir o segundo tema',
          'A transição é o material conclusivo, que confirma a nova tonalidade depois do segundo tema',
          'A transição é sempre omitida',
        ],
        [
          'O desenvolvimento tipicamente apresenta fragmentação, sequência e modulação por tonalidades remotas',
          'O desenvolvimento constrói a retransição sobre a tónica para preparar o regresso',
          'O desenvolvimento permanece na tónica',
          'O desenvolvimento põe de lado os temas da exposição e introduz melodias novas, cada uma ouvida pela primeira vez',
        ],
        [
          'Uma falsa reexposição começa o regresso do tema na tonalidade errada antes da verdadeira reexposição',
          'Uma falsa reexposição é a verdadeira reexposição na tónica, mas com o primeiro tema deixado de fora',
          'Uma falsa reexposição é a retransição, a passagem construída sobre a dominante para preparar o verdadeiro regresso',
          'Uma falsa reexposição surge depois da verdadeira reexposição, como abertura de uma coda expandida',
        ],
        [
          'Numa sonata em tonalidade menor, o segundo tema está tipicamente no relativo maior (III)',
          'Numa sonata em tonalidade menor, o segundo tema permanece normalmente na tónica menor e nunca modula',
          'As sonatas menores põem normalmente o segundo tema na subdominante (iv), uma 4.ª acima da tónica',
          'Numa sonata em tonalidade menor, o segundo tema está tipicamente na dominante menor (v), uma 5.ª acima da tónica',
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
        'Ritornello: passagem orquestral recorrente alternando com episódios solistas (concerto barroco). Sonata-rondó: ABACAB\'A combina princípios do rondó e da sonata.',
      choiceSets: [
        [
          'A forma de ritornello alterna passagens de tutti orquestral com episódios solistas',
          'A forma de ritornello alterna passagens solistas com episódios orquestrais, por isso é o solista que toca o tema recorrente',
          'O ritornello só usa solistas',
          'A forma de ritornello não tem material recorrente: cada passagem orquestral traz um tema próprio',
        ],
        [
          'O sonata-rondó combina o tema A recorrente do rondó com as relações tonais da forma-sonata',
          'O sonata-rondó é um rondó simples, sem nenhum tema recorrente, e é usado apenas na música vocal',
          'O sonata-rondó é um rondó comum, ABACA, cujos episódios ficam na tonalidade da tónica',
          'No sonata-rondó, a secção B regressa na dominante na segunda metade',
        ],
        [
          'Uma passacaglia é um conjunto de variações sobre uma linha de baixo recorrente (baixo ostinato)',
          'Uma passacaglia é uma fuga em que o sujeito nunca mais regressa depois de terminada a exposição',
          'Uma passacaglia é um tipo de rondó (ABACA), em que um estribilho regressa entre os vários episódios contrastantes',
          'Uma passacaglia não tem elemento recorrente',
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
          'Cordas da mais aguda à mais grave: violino I, violino II, viola, violoncelo, contrabaixo',
          'Cordas da mais aguda à mais grave: violas, violino I, violino II, contrabaixos, violoncelos',
          'Cordas da mais aguda à mais grave: violino I, violino II, violoncelo, viola, contrabaixo',
          'O contrabaixo é mais agudo que o violoncelo',
        ],
        [
          'Um clarinete em Bb soa sempre uma 2.ª maior abaixo do escrito: lê C e ouve-se Bb',
          'Um clarinete em Bb soa como está escrito: o C escrito ouve-se como C',
          'O clarinete em Bb soa mais agudo do que o escrito',
          'Apenas os instrumentos de percussão transpõem',
        ],
        [
          'A trompa em F soa uma 5.ª perfeita abaixo do escrito',
          'A trompa em F soa uma 5.ª perfeita acima do escrito, por isso o seu C escrito soa como G',
          'A trompa em F é não transpositora, por isso o C escrito é o C que se ouve',
          'A trompa em F soa uma oitava abaixo',
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
        'Classes de altura: C=0 até B=11. Um conjunto de classes de altura lista CAs únicas em ordem ascendente. A forma normal coloca-as no arranjo mais compacto.',
      choiceSets: [
        [
          'Um conjunto de classes de altura trata as notas equivalentes à oitava e enarmónicas como uma só classe, usando inteiros de 0 a 11',
          'Um conjunto de classes de altura mantém nomes de notas e números de oitava, por isso C4 e C5 contam como duas classes diferentes no conjunto',
          'Conjuntos de classes de altura só funcionam para música tonal',
          'Os inteiros de conjuntos de classes de altura vão de 0 a 7',
        ],
        [
          'A forma normal arranja sempre o conjunto na ordem ascendente mais compacta',
          'A forma normal lista sempre as classes de altura por ordem numérica, de 0 a 11, seja qual for a extensão',
          'A forma normal usa ordem descendente',
          'Não existe ordenação padrão para conjuntos',
        ],
        [
          'O conjunto {C, E, G} = {0, 4, 7} é uma tríade maior expressa como classes de altura',
          '{0, 4, 7} é uma tríade menor, porque 4 meios-tons acima da fundamental são sempre uma 3.ª menor',
          'O conjunto {C, E, G} = {0, 4, 7} é uma tríade diminuta expressa como classes de altura',
          'Tríades não podem ser expressas como conjuntos de classes de altura',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre vetores intervalares, forma primária e relações-Z é verdadeira?',
      hintTemplate:
        'Vetor intervalar: contagens de cada classe de intervalo (ci 1-6) num conjunto, escrito como <x x x x x x>. Dois conjuntos são Z-relacionados quando partilham o mesmo vetor intervalar mas NÃO estão relacionados por transposição ou inversão (pertencem a classes de conjuntos diferentes).',
      choiceSets: [
        [
          'O vetor intervalar conta ocorrências de cada classe de intervalo (1 a 6) num conjunto de classes de altura',
          'O vetor intervalar conta apenas os intervalos perfeitos (4.as e 5.as) de um conjunto e ignora todas as suas 2.as, 3.as, 6.as e 7.as',
          'O vetor intervalar usa nomes de notas',
          'Vetores intervalares são outro nome para a forma normal, que lista as classes de altura de um conjunto em ordem ascendente',
        ],
        [
          'A forma primária transpõe e/ou inverte um conjunto para a sua forma mais compacta, começando sempre em 0',
          'A forma primária é o mesmo que a forma normal: o conjunto não é transposto para 0 nem invertido',
          'A forma primária apenas transpõe',
          'A forma primária começa sempre na nota mais aguda',
        ],
        [
          'Conjuntos Z-relacionados partilham o mesmo vetor intervalar mas não são equivalentes por transposição/inversão',
          'Conjuntos Z-relacionados são transposições uns dos outros, por isso os seus vetores intervalares diferem',
          'Conjuntos Z-relacionados partilham a mesma forma primária, e é por isso que os seus vetores intervalares coincidem',
          'A relação-Z não existe na teoria dos conjuntos',
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
          'Uma série dodecafónica usa cada uma das 12 classes de altura exatamente uma vez antes de qualquer repetição',
          'Uma série dodecafónica pode repetir livremente as suas 12 classes de altura dentro da série original',
          'Uma série usa apenas 7 alturas',
          'Uma série deve ser uma escala',
        ],
        [
          'As quatro transformações básicas da série são Original, Inversão, Retrógrada e Retrógrada-Inversão',
          'As quatro transformações básicas da série são Original, Inversão, Retrógrada e Aumentação',
          'Existem apenas 2 transformações básicas da série, Original e Retrógrada, porque a inversão não é uma forma da série',
          'As séries ficam fixas depois de escritas, por isso o compositor usa a série original sem alterações ao longo da peça',
        ],
        [
          'A matriz 12x12 contém as 48 formas possíveis (12P + 12I + 12R + 12RI)',
          'A matriz 12x12 mostra apenas as 12 transposições da série original, porque as inversões e as retrógradas não se podem ler nela',
          'A matriz contém 36 formas da série: P, I e R, mas não RI',
          'Uma série pode deixar de fora uma classe de altura, desde que as outras onze mantenham uma ordem fixa',
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
        'O planing move uma forma de acorde em paralelo. A politonalidade faz soar duas tonalidades ao mesmo tempo; o pandiatonicismo usa livremente as notas de uma tonalidade, sem harmonia funcional. O espectralismo constrói a harmonia a partir da série de harmónicos; a microtonalidade usa passos menores que um meio-tom.',
      choiceSets: [
        [
          'A politonalidade faz sempre soar duas ou mais tonalidades ao mesmo tempo, por exemplo C maior contra F# maior',
          'A politonalidade significa mudar de tonalidade muitas vezes numa melodia, mas sempre uma de cada vez',
          'A politonalidade não usa tonalidade nenhuma',
          'A politonalidade é uma técnica rítmica',
        ],
        [
          'O pandiatonicismo usa apenas as notas de uma tonalidade, livremente, sem progressões harmónicas funcionais',
          'O pandiatonicismo usa livremente as doze notas cromáticas, sem tonalidade nem harmonia funcional',
          'O pandiatonicismo usa apenas escalas pentatónicas',
          'O pandiatonicismo exige cadências V-I',
        ],
        [
          'O planing cromático mantém sempre os intervalos exatos; o planing diatónico ajusta-os à escala',
          'O planing cromático fica dentro da tonalidade; o diatónico mantém os intervalos exatos',
          'O planing usa sempre movimento contrário',
          'O planing muda o acorde a cada passo',
        ],
        [
          'A música espectral deriva a harmonia da série de harmónicos e da análise acústica do som',
          'A música espectral constrói toda a sua harmonia a partir de uma série dodecafónica e evita a série de harmónicos',
          'A música espectral usa harmonia tonal tradicional, com acordes empilhados em terças e com cadências V-I no fim das frases',
          'A música espectral evita todos os sons com altura definida',
        ],
        [
          'A microtonalidade usa intervalos menores que um meio-tom, não apenas as 12 notas habituais',
          'A microtonalidade usa apenas as 12 alturas padrão, mas toca cada uma delas extremamente baixinho',
          'A microtonalidade usa apenas as 12 alturas padrão',
          'A microtonalidade é o mesmo que a atonalidade: ambos os termos designam música sem centro tonal',
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
        'Minimalismo: padrões repetitivos, processo gradual, material harmónico limitado. Pioneiros: Reich (desfasamento), Glass (processo aditivo), Riley (loops de fita). A música aleatória deixa elementos ao acaso; as técnicas expandidas são formas não convencionais de tocar.',
      choiceSets: [
        [
          'O desfasamento parte de dois padrões idênticos e desloca-os gradualmente para fora de sincronia',
          'O desfasamento acrescenta gradualmente notas a um padrão repetido, que vai crescendo aos poucos',
          'O desfasamento usa técnica dodecafónica',
          'O desfasamento envolve alterar o conteúdo de alturas',
        ],
        [
          'O processo aditivo acrescenta gradualmente notas a um padrão repetido, criando uma melodia que se expande lentamente',
          'O processo aditivo retira gradualmente uma nota ao padrão de repetição em repetição, criando uma melodia que encolhe lentamente',
          'O processo aditivo muda de tonalidade a cada repetição',
          'O processo aditivo é o mesmo que tema e variações: cada repetição apresenta uma nova versão ornamentada do tema original',
        ],
        [
          'A música aleatória deixa alguns elementos ao acaso ou à escolha do intérprete',
          'A música aleatória fixa de antemão todas as notas e ritmos e não deixa ao intérprete escolha nenhuma',
          'A música aleatória é sempre eletrónica',
          'Aleatória significa música muito rápida',
        ],
        [
          'As técnicas expandidas incluem multifónicos, piano preparado, col legno e sprechstimme',
          'As técnicas expandidas são outro nome para a música aleatória: é o intérprete que decide que notas tocar',
          'As técnicas expandidas aplicam-se apenas à percussão',
          'As técnicas expandidas são padrões repetitivos que evoluem gradualmente, como o desfasamento',
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
        'Polirritmia: duas divisões do mesmo intervalo de tempo ao mesmo tempo (3 contra 2). Polimetria: dois compassos ao mesmo tempo. Hemíola: 2 × 3 tempos reagrupados como 3 × 2. Modulação métrica: uma figura do andamento antigo torna-se uma figura do novo.',
      choiceSets: [
        [
          'Uma polirritmia faz soar duas divisões em conflito do mesmo intervalo de tempo, por exemplo 3 contra 2',
          'Uma polirritmia é um só ritmo tocado em uníssono por muitos instrumentos, com todas as partes a dividir o tempo da mesma maneira',
          'Uma polirritmia é um accelerando gradual',
          'Uma polirritmia exige sempre um compasso composto, como 6/8, e nunca se pode escrever num compasso de 4/4',
        ],
        [
          'A polimetria opõe dois compassos, por exemplo 3/4 numa parte contra 4/4 noutra',
          'A polimetria significa que a peça passa de 3/4 para 4/4 a meio, com todas as partes a mudar ao mesmo tempo',
          'A polimetria usa apenas um compasso',
          'A polimetria é o mesmo que a síncopa, em que os acentos caem fora dos tempos fortes dentro de um compasso que as partes partilham',
        ],
        [
          'Uma hemíola reagrupa seis tempos de 2 × 3 em 3 × 2, por exemplo dois compassos de 3/4 sentidos como um compasso de 3/2',
          'Uma hemíola duplica o andamento durante um único compasso, de modo que seis tempos cabem no espaço de apenas três tempos',
          'Uma hemíola é uma pausa de meio tempo',
          'Uma hemíola só existe no jazz',
        ],
        [
          'Modulação métrica: se as colcheias de tercina a ♩ = 120 passam a ser as novas colcheias, o novo ♩ = 180',
          'Modulação métrica: se as colcheias de tercina a ♩ = 120 passam a ser as novas colcheias, o novo andamento fica ♩ = 120, porque a modulação métrica nunca muda a velocidade',
          'Modulação métrica significa mudar de tonalidade',
          'A modulação métrica é um ritardando gradual, em que a música abranda pouco a pouco até chegar a um andamento novo e mais calmo',
        ],
        [
          'Uma quiáltera de cinco encaixa cinco notas iguais no tempo normalmente ocupado por quatro do mesmo valor',
          'Uma quiáltera de cinco estica quatro notas por cinco tempos, por isso cada uma dura mais do que está escrito na partitura',
          'Uma quiáltera de cinco só se pode escrever em 5/4',
          'Uma quiáltera de cinco é uma frase de cinco compassos, criada juntando um compasso extra a uma frase regular de quatro',
        ],
      ],
    },
  ],

};

export default overlay;
