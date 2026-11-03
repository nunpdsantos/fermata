import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese translations for Level 8 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidade 25: Fuga e Formas Imitativas
  // =========================================================================

  // ---- l8u25m1: Exposição da Fuga ----

  l8u25m1e1: {
    prompt:
      'Numa exposição de fuga, qual é a diferença entre o sujeito e a resposta?',
    choices: [
      "O sujeito começa; a resposta segue na tonalidade uma quinta acima",
      'A resposta começa; o sujeito segue na tonalidade uma quinta acima',
      'O sujeito começa; a resposta segue na tonalidade uma quinta abaixo',
      'A resposta começa; o sujeito segue na tonalidade uma quinta abaixo',
    ],
    hint: 'O sujeito entra primeiro na tonalidade da tónica. A resposta segue na dominante, imitando o sujeito uma quinta acima (ou quarta abaixo).',
  },
  l8u25m1e2: {
    prompt:
      'O que distingue uma "resposta real" de uma "resposta tonal" numa fuga?',
    choices: [
      "Uma resposta real mantém intervalos exatos; uma resposta tonal ajusta-os para não enfraquecer a tonalidade da tónica",
      "Uma resposta tonal mantém intervalos exatos; uma resposta real ajusta-os para não enfraquecer a tonalidade da tónica",
      "Uma resposta real mantém ritmos exatos; uma resposta tonal ajusta-os para não enfraquecer a tonalidade da tónica",
      "Uma resposta tonal mantém ritmos exatos; uma resposta real ajusta-os para não enfraquecer a tonalidade da tónica",
    ],
    hint: 'Uma resposta real é uma transposição exata para a dominante. Uma resposta tonal ajusta o início do sujeito para que o grau 5 seja respondido pelo 1 (e o 1 pelo 5), preservando a relação tónica–dominante.',
  },
  l8u25m1e3: {
    prompt: 'O que acontece durante a exposição de uma fuga?',
    choices: [
      'Vozes sucessivas apresentam o sujeito e a resposta até terem entrado todas as vozes',
      'Vozes simultâneas apresentam o sujeito e a resposta numa única entrada coral',
      'Vozes sucessivas desenvolvem fragmentos do sujeito antes de qualquer apresentação completa',
      'Vozes sucessivas apresentam a resposta antes da primeira apresentação do sujeito',
    ],
    hint: 'A exposição é a secção de abertura onde as vozes entram uma de cada vez, alternando entre sujeito (tónica) e resposta (dominante).',
  },

  // ---- l8u25m2: Episódios e Stretto ----

  l8u25m2e1: {
    prompt: 'Qual é a função principal de um episódio numa fuga?',
    choices: [
      "Ligar entradas do sujeito através de sequências e modulação",
      "Substituir entradas do sujeito por temas sem relação, usando sequências e modulação",
      "Repetir as entradas completas do sujeito da exposição na sua sequência tonal original",
      "Apresentar entradas do sujeito juntas em uníssono, sem sequências de ligação nem modulação",
    ],
    hint: 'Os episódios são passagens entre entradas do sujeito que tipicamente usam sequências construídas a partir de fragmentos do sujeito. Servem de pontes modulantes.',
  },
  l8u25m2e2: {
    prompt: 'O que é o "stretto" numa fuga?',
    choices: [
      'Entradas sobrepostas do sujeito',
      'Entradas não sobrepostas do sujeito',
      'Entradas do sujeito com valores de nota duplicados',
      'Entradas do sujeito com a ordem das notas invertida',
    ],
    hint: 'O stretto comprime as entradas do sujeito para que se sobreponham, criando contraponto intensificado. Aparece frequentemente perto do clímax da fuga.',
  },
  l8u25m2e3: {
    prompt: 'Na técnica de fuga, o que significa "aumentação"?',
    choices: [
      'Multiplicar por 2 a duração de cada nota',
      'Dividir por 2 a duração de cada nota',
      'Inverter a sequência das durações das notas',
      'Manter a duração de cada nota e subir todas as alturas',
    ],
    hint: 'A aumentação alonga o sujeito multiplicando as suas durações (tipicamente por dois). A diminuição faz o oposto, reduzindo os valores a metade.',
  },

  // ---- l8u25m3: Cânone ----

  l8u25m3e1: {
    prompt: 'O que é um cânone?',
    choices: [
      'Imitação exata com entrada após um intervalo de tempo',
      'Duplicação exata com entrada ao mesmo tempo',
      'Um ostinato sob uma melodia sem relação',
      'Frases alternadas sem imitação melódica',
    ],
    hint: 'Um cânone é imitação estrita: uma voz (o líder ou dux) é seguida a um intervalo temporal fixo por uma ou mais vozes (o seguidor ou comes) que a copiam exatamente.',
  },
  l8u25m3e2: {
    prompt:
      'Um cânone começa em C4; a voz seguinte entra depois em G4 e imita a mesma melodia transposta. Qual é o intervalo de entrada?',
    choices: [
      'Uma quinta perfeita',
      'Uma quarta perfeita',
      'Uma terça maior',
      'Um tom',
    ],
    hint: 'O nome do intervalo refere-se à transposição de altura, não ao atraso temporal. Um cânone à quinta transpõe a melodia uma 5.ª perfeita.',
  },
  l8u25m3e3: {
    prompt:
      'Qual é a diferença entre imitação estrita e imitação livre?',
    choices: [
      "A imitação estrita mantém os intervalos originais; a imitação livre pode adaptá-los",
      "A imitação estrita pode adaptar os intervalos originais; a imitação livre mantém-nos inalterados",
      "A imitação estrita mantém o ritmo original; a imitação livre inverte-o",
      "A imitação estrita inverte o ritmo original; a imitação livre mantém-no inalterado",
    ],
    hint: 'A imitação estrita preserva cada intervalo com precisão. A imitação livre permite alterações aos intervalos mantendo a forma geral e o ritmo do modelo.',
  },

  // =========================================================================
  // Unidade 26: Grande Forma e Orquestração
  // =========================================================================

  // ---- l8u26m1: Forma-Sonata ----

  l8u26m1e1: {
    prompt:
      'Quais são as duas áreas temáticas principais apresentadas numa exposição em forma-sonata?',
    choices: [
      "Primeiro tema: tónica; segundo tema: tonalidade contrastante",
      "Primeiro tema: tonalidade contrastante; segundo tema: tónica",
      "Primeiro tema: tónica; segundo tema: tónica",
      "Primeiro tema: dominante; segundo tema: dominante",
    ],
    hint: 'A exposição estabelece o conflito tonal: o grupo temático principal está na tónica, o grupo temático secundário move-se para a dominante (ou relativa maior nas tonalidades menores).',
  },
  l8u26m1e2: {
    prompt:
      'Qual é o propósito principal da secção de desenvolvimento na forma-sonata?',
    choices: [
      'Fragmentar e desenvolver os temas',
      "Introduzir e contrastar os temas",
      "Reexpor ambos os temas na tónica",
      "Concluir ambos os temas com uma coda",
    ],
    hint: 'O desenvolvimento pega em ideias da exposição e trabalha-as através de várias tonalidades, sequências e técnicas contrapontísticas, construindo tensão em direção à reexposição.',
  },
  l8u26m1e3: {
    prompt:
      'Na reexposição de uma sonata em C maior, em que tonalidade se apresenta normalmente o segundo tema?',
    choices: [
      'C maior',
      'G maior',
      'C menor',
      'G menor',
    ],
    hint: 'A reexposição resolve a tensão harmónica trazendo ambos os grupos temáticos na tónica. O segundo tema, originalmente na dominante, regressa agora na tonalidade-mãe.',
  },

  // ---- l8u26m2: Variação, Rondó e Ritornello ----

  l8u26m2e1: {
    prompt:
      'Numa forma de tema e variações, o que se mantém constante ao longo das variações?',
    choices: [
      'A estrutura harmónica subjacente e/ou o contorno melódico do tema',
      'A melodia e ritmo exatos sem qualquer alteração',
      'Apenas o andamento e a dinâmica',
      'A textura e o registo do tema, enquanto a melodia e o ritmo são transformados',
    ],
    hint: 'As variações tipicamente preservam a estrutura harmónica e fraseológica do tema enquanto alteram melodia, ritmo, textura ou modo.',
  },
  l8u26m2e2: {
    prompt: 'Que padrão descreve melhor a forma de rondó?',
    choices: [
      "ABACA (ou ABACABA): o tema principal vai reaparecendo",
      'ABAB (ou ABABAB): A alterna com o mesmo episódio, terminando em B',
      "ABCD (ou ABCDEF): cada secção introduz outro tema",
      "AABB (ou AABBCC): cada secção repete-se antes da seguinte",
    ],
    hint: 'A forma de rondó apresenta um tema principal (A) que regressa entre secções contrastantes. Os padrões em cinco partes incluem ABACA e ABABA.',
  },
  l8u26m2e3: {
    prompt: 'O que é uma chacona (ou passacaglia)?',
    choices: [
      "Variações contínuas sobre um baixo ou padrão harmónico recorrente",
      "Episódios contrastantes entre regressos de um refrão",
      "Entradas imitativas de um sujeito em vozes sucessivas",
      "Temas contrastantes numa exposição, desenvolvimento e reexposição",
    ],
    hint: 'Uma chacona/passacaglia é uma forma de variação construída sobre um padrão de baixo repetido (baixo ostinato). As vozes superiores mudam enquanto o baixo se repete continuamente.',
  },

  // ---- l8u26m3: Orquestração ----

  l8u26m3e1: {
    prompt:
      'Quais são as quatro famílias padrão da orquestra moderna?',
    choices: [
      'Cordas, madeiras, metais, percussão',
      'Cordas, teclados, madeiras, vozes',
      'Cordas, metais, vozes, teclados',
      'Cordas, vozes, percussão, metais',
    ],
    hint: 'As secções orquestrais padrão são: Cordas (violino, viola, violoncelo, contrabaixo), Madeiras (flauta, oboé, clarinete, fagote), Metais (trompa, trompete, trombone, tuba) e Percussão.',
    nudge: 'As famílias da orquestra agrupam os instrumentos pela forma como produzem o som (com arco ou dedilhando, soprando, fazendo vibrar os lábios, batendo ou agitando), não pelo registo, pela função nem por instrumentos isolados.',
  },
  l8u26m3e2: {
    prompt:
      'O que significa um instrumento ser um "instrumento transpositor"?',
    choices: [
      'A nota que ouves difere da nota escrita',
      'A nota que ouves coincide com a altura escrita, mas a música usa uma clave invulgar',
      'A nota que ouves muda quando tocas mais forte',
      'A nota que ouves é escolhida livremente, independentemente da altura escrita',
    ],
    hint: 'Um instrumento transpositor produz uma altura diferente da que está escrita. Isto simplifica as dedilhações entre famílias de instrumentos de tamanhos diferentes.',
  },
  l8u26m3e3: {
    prompt:
      'Quando um clarinete em Bb toca um D escrito, que som real se ouve?',
    choices: [
      'C',
      'E',
      'D',
      'F',
    ],
    hint: 'Um clarinete em Bb soa uma 2.ª maior abaixo do escrito. Quando o intérprete lê C, o ouvinte ouve Bb. Para obter C como som real, o intérprete tem de ler D.',
  },

  // =========================================================================
  // Unidade 27: Pós-Tonal e Contemporâneo
  // =========================================================================

  // ---- l8u27m1: Conjuntos de Classes de Altura ----

  l8u27m1e1: {
    prompt:
      'Na notação por inteiros de classes de altura, que número representa a nota C?',
    choices: ['0', '1', '12', '7'],
    hint: 'A notação por inteiros de classes de altura atribui C = 0, C#/Db = 1, D = 2, e assim por diante até B = 11. O sistema é módulo 12.',
    nudge: 'Cada classe de altura é numerada pela sua distância em meios-tons acima de C, em módulo 12 (por isso o 12 dá a volta). Aplica essa regra ao próprio C.',
  },
  l8u27m1e2: {
    prompt:
      'Qual é a ordem normal do conjunto de classes de altura {1, 6, 9}?',
    choices: [
      '[6, 9, 1]',
      '[1, 6, 9]',
      '[9, 1, 6]',
      '[1, 9, 6]',
    ],
    hint: 'A ordem normal é o arranjo ascendente mais compacto de um conjunto de classes de altura. Rodas por todas as ordenações e escolhes a que tem o menor intervalo exterior.',
  },
  l8u27m1e3: {
    prompt:
      'Que conjunto de classes de altura tem a mesma forma primária que {0, 4, 7}, admitindo transposição e inversão?',
    choices: [
      '{0, 3, 7}',
      '{0, 1, 6}',
      '{0, 2, 8}',
      '{0, 4, 11}',
    ],
    hint: 'A forma primária é a versão mais reduzida de um conjunto, começando em 0 e compactada o mais possível à esquerda. Permite comparar conjuntos independentemente da transposição ou inversão.',
  },

  // ---- l8u27m2: Técnica dos Doze Sons ----

  l8u27m2e1: {
    prompt: 'O que é uma série dodecafónica?',
    choices: [
      'Doze classes de altura numa ordem fixa, cada uma apresentada uma vez',
      'Doze classes de altura em ordem livre, cada uma apresentada uma vez',
      'Doze classes de altura numa ordem fixa, com repetições permitidas',
      'Doze classes de altura em ordem livre, com repetições permitidas',
    ],
    hint: 'Uma série (ou série dodecafónica) é uma ordenação fixa das 12 classes de altura cromáticas. Nenhuma classe de altura se repete até todas as 12 terem soado.',
  },
  l8u27m2e2: {
    prompt:
      'Que par define corretamente as formas R e I de uma série?',
    choices: [
      'R inverte a ordem das notas; I inverte a direção dos intervalos',
      'R inverte a direção dos intervalos; I inverte a ordem das notas',
      'R duplica os valores das notas; I reduz os valores das notas a metade',
      'R reduz os valores das notas a metade; I duplica os valores das notas',
    ],
    hint: 'P é a série original. R lê-a de trás para a frente (retrógrado). I inverte a direção de todos os intervalos. RI aplica retrogradação e inversão. Cada uma pode também ser transposta para qualquer um dos 12 níveis.',
  },
  l8u27m2e3: {
    prompt: 'Qual é a função de uma matriz dodecafónica?',
    choices: [
      'Obter versões transpostas, invertidas e retrógradas de uma série de alturas',
      'Obter versões harmonizadas, invertidas e retrógradas de uma série de alturas',
      'Obter versões transpostas, harmonizadas e ritmicamente aumentadas de uma série de alturas',
      'Obter versões ritmicamente aumentadas, harmonizadas e retrógradas de uma série de alturas',
    ],
    hint: 'A matriz (ou quadrado mágico) é uma grelha 12x12. As linhas da esquerda para a direita dão as formas P, da direita para a esquerda as R, as colunas de cima para baixo as I e de baixo para cima as RI.',
  },

  // ---- l8u27m3: Técnicas do Século XX ----

  l8u27m3e1: {
    prompt:
      'O que é o "planing" (também chamado paralelismo) na música do início do século XX?',
    choices: [
      'Mover acordes em paralelo: o planing cromático mantém os intervalos exatos, o diatónico ajusta-os à escala',
      "Mover acordes em paralelo: o planing cromático ajusta-os à escala, o diatónico mantém os intervalos exatos",
      "Mover acordes em paralelo: o planing cromático mantém os intervalos exatos, o diatónico mantém os intervalos exatos",
      "Mover acordes em paralelo: o planing cromático ajusta-os à escala, o diatónico ajusta-os à escala",
    ],
    hint: 'O planing move uma forma de acorde ou intervalo fixa para cima ou para baixo em paralelo. Debussy usou famosamente tríades e acordes de nona paralelos, abandonando as regras tradicionais de condução de vozes.',
  },
  l8u27m3e2: {
    prompt: 'O que é a politonalidade?',
    choices: [
      "Vários centros tonais ouvidos em conjunto",
      "Vários centros tonais ouvidos em sequência",
      "Vários compassos ouvidos em conjunto",
      "Vários compassos ouvidos em sequência",
    ],
    hint: 'A politonalidade sobrepõe diferentes centros tonais ao mesmo tempo. A bitonalidade (duas tonalidades) é o tipo mais comum. Milhaud e Stravinsky usaram-na extensivamente.',
  },
  l8u27m3e3: {
    prompt: 'O que é o pandiatonicismo?',
    choices: [
      "Usar uma escala diatónica livremente, sem a atração habitual de um acorde para outro",
      "Usar todas as doze notas cromáticas livremente, sem a atração habitual de um acorde para outro",
      "Usar uma escala diatónica em progressões funcionais, com cada dominante a resolver na tónica",
      "Usar todas as doze notas cromáticas em progressões funcionais, com cada dominante a resolver na tónica",
    ],
    hint: 'O pandiatonicismo usa material diatónico (p. ex., todas as teclas brancas) mas sem hierarquia tonal ou progressões funcionais. Stravinsky e Copland empregaram-no livremente.',
  },

  // ---- l8u27m4: Minimalismo e Aleatoriedade ----

  l8u27m4e1: {
    prompt:
      'Qual das seguintes opções descreve melhor o minimalismo musical?',
    choices: [
      'Música baseada na repetição extensa de padrões curtos, com mudanças graduais ao longo do tempo',
      'Música definida pelo uso do menor número possível de intérpretes',
      'Música definida por uma duração total inferior a um minuto',
      'Música baseada numa sucessão contínua de temas novos, sem repetição',
    ],
    hint: 'O minimalismo (Riley, Reich, Glass, Adams) apresenta padrões repetitivos, pulsação constante, harmonia consonante e processos lentos de transformação gradual.',
  },
  l8u27m4e2: {
    prompt: 'O que é música aleatória?',
    choices: [
      'Música cuja forma ou detalhes dependem do acaso ou de decisões do intérprete',
      'Música cuja forma e detalhes ficam totalmente fixos de antemão',
      'Música cujas alturas provêm do espectro harmónico',
      'Música cujos padrões repetidos se expandem por adições rítmicas graduais',
    ],
    hint: 'Aleatório vem do latim "alea" (dado). Cage, Lutosławski e outros incorporaram aleatoriedade ou indeterminação do intérprete nas suas composições.',
  },
  l8u27m4e3: {
    prompt:
      'Qual das seguintes é um exemplo de uma "técnica expandida"?',
    choices: [
      'Abafar as cordas do piano pousando os dedos sobre elas',
      "Fazer soar as cordas do piano pressionando as teclas",
      'Abafar as cordas do piano soltando as teclas sem pedal',
      "Sustentar as cordas do piano mantendo o pedal pressionado",
    ],
    hint: 'As técnicas expandidas produzem sons não padrão: piano preparado, col legno, multifónicos, frullato, arco atrás do cavalete, e muitas mais.',
  },

  // ---- l8u27m5: Ritmo Avançado ----

  l8u27m5e1: {
    prompt: 'O que é uma polirritmia?',
    choices: [
      'Padrões rítmicos em conflito executados simultaneamente',
      'Padrões rítmicos em conflito executados consecutivamente',
      'Padrões rítmicos idênticos executados simultaneamente',
      'Padrões rítmicos idênticos executados consecutivamente',
    ],
    hint: 'A polirritmia sobrepõe diferentes agrupamentos rítmicos ao mesmo tempo (p. ex., três notas contra duas, ou 4 contra 3). Cada camada mantém a sua própria divisão do pulso.',
  },
  l8u27m5e2: {
    prompt: 'O que é uma hemíola?',
    choices: [
      'Um recurso que cria o efeito de 3 tempos contra 2 (ou 2 contra 3) no mesmo intervalo de tempo',
      "Um recurso que faz soar simultaneamente 3 e 4 tempos iguais no mesmo intervalo de tempo",
      "Um recurso que desloca um acento de um tempo forte sem criar um agrupamento de 3 contra 2",
      "Um recurso que acelera gradualmente a pulsação mantendo inalterado o número de tempos de cada grupo",
    ],
    hint: 'A hemíola reagrupa os tempos de modo que o que se sentia em três é temporariamente sentido em dois, ou vice-versa. Comum na música barroca e nos ritmos latino-americanos.',
  },
  l8u27m5e3: {
    prompt: 'O que é a modulação métrica?',
    choices: [
      'Uma mudança de andamento feita ao tratar um valor de nota do compasso antigo como unidade de tempo do novo',
      "Um reagrupamento de dois grupos ternários em três grupos binários, mantendo o andamento e a duração das notas",
      'Uma mudança de acentos no compasso antigo, mantendo o andamento, a unidade de tempo e os valores das notas',
      "Uma mudança gradual de andamento sem um valor de nota partilhado que ligue o tempo antigo ao novo",
    ],
    hint: 'A modulação métrica usa um valor rítmico partilhado como pivô entre dois andamentos. Por exemplo, uma semínima de uma tercina no andamento antigo torna-se a nova unidade de tempo de semínima: semínima = 120 passa a semínima = 180.',
  },
};

export default overlay;
