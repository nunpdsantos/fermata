import type { CurriculumLevelOverlay } from '../types';

const curriculumL1: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    u1: {
      title: 'Notação e Altura',
      description:
        'A pauta, claves, meios-tons, tons, acidentes e a escala cromática',
    },
    u2: {
      title: 'Ritmo e Compasso',
      description:
        'Figuras rítmicas, pausas, pontos de aumentação, ligaduras e compassos simples',
    },
    u3: {
      title: 'Escalas, Intervalos e Primeiros Acordes',
      description:
        'A escala maior, armações de clave, números de intervalos e tríades maiores',
    },
  },

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: {
    // ── U1 M1: The Staff and Clefs ──────────────────────────────────────────
    l1u1m1: {
      title: 'A Pauta e as Claves',
      subtitle: 'A grelha de cinco linhas que mapeia a altura no papel',
      objectives: [
        'Identificar a pauta de cinco linhas como a base da notação ocidental',
        'Ler a clave de sol e a clave de fá e saber em que alturas se centram',
        'Compreender como a posição na pauta corresponde à altura — mais acima = som mais agudo',
      ],
      concepts: [
        {
          title: 'A Pauta de Cinco Linhas',
          explanation:
            'Toda a música escrita vive numa pauta — cinco linhas horizontais e quatro espaços. Notas colocadas mais acima na pauta soam mais agudas; notas colocadas mais abaixo soam mais graves. Cada linha e cada espaço representa uma altura específica. A pauta é o mapa; as notas são os pontos de referência.',
          tryThisLabel: 'Vê as notas organizadas por altura',
        },
        {
          title: 'Clave de Sol e Clave de Fá',
          explanation:
            'Uma clave aparece no início de uma pauta e indica quais alturas as linhas e espaços representam. A clave de sol (𝄞) centra-se no G acima do C central — é usada para instrumentos mais agudos e a mão direita no piano. A clave de fá (𝄢) centra-se no F abaixo do C central — é usada para instrumentos mais graves e a mão esquerda no piano. Sem uma clave, a pauta é apenas linhas — a clave dá-lhes significado.',
          tryThisLabel: 'Explora a tonalidade de C',
        },
      ],
      tasks: [
        {
          instruction:
            'Olha para o teclado do piano — as notas vão do grave (esquerda) ao agudo (direita), tal como a pauta vai do grave (em baixo) ao agudo (em cima)',
        },
        {
          instruction:
            'Escreve "C major scale" e repara como cada nota ocupa uma posição mais elevada à medida que a altura sobe',
        },
      ],
    },

    // ── U1 M2: Ledger Lines and the Grand Staff ────────────────────────────
    l1u1m2: {
      title: 'Linhas Suplementares e a Pauta Dupla',
      subtitle: 'Estender a pauta e ligar a clave de sol à clave de fá',
      objectives: [
        'Compreender as linhas suplementares como extensões acima ou abaixo da pauta',
        'Saber que a pauta dupla combina as claves de sol e de fá unidas por uma chaveta',
        'Localizar o C central como a linha suplementar entre as duas pautas',
      ],
      concepts: [
        {
          title: 'Linhas Suplementares',
          explanation:
            'Quando as notas ultrapassam a pauta de cinco linhas, acrescentam-se pequenas linhas horizontais chamadas linhas suplementares. O C central, por exemplo, está numa linha suplementar abaixo da pauta de clave de sol ou numa linha suplementar acima da pauta de clave de fá. As linhas suplementares estendem a pauta temporariamente — aparecem apenas onde são necessárias.',
          tryThisLabel: 'Vê o C central no piano',
        },
        {
          title: 'A Pauta Dupla',
          explanation:
            'A música para piano usa a pauta dupla — uma pauta de clave de sol em cima e uma pauta de clave de fá em baixo, unidas por uma chaveta e ligadas por uma linha suplementar partilhada de C central. A mão direita lê tipicamente a clave de sol; a esquerda lê a clave de fá. Juntas, cobrem a maior parte da extensão do piano. É por isso que os pianistas aprendem ambas as claves desde o início.',
          tryThisLabel: 'Explora o C em todo o teclado',
        },
      ],
      tasks: [
        {
          instruction:
            'Encontra o C central no piano — está entre as duas metades da pauta dupla',
        },
        {
          instruction:
            'Toca notas abaixo e acima do C central para ouvir como a pauta dupla abrange ambos os registos',
        },
      ],
    },

    // ── U1 M3: Half Steps, Whole Steps, and Accidentals ────────────────────
    l1u1m3: {
      title: 'Meios-Tons, Tons e Acidentes',
      subtitle:
        'As menores distâncias na música e os símbolos que modificam a altura',
      objectives: [
        'Definir meios-tons e tons como os blocos de construção de todas as escalas',
        'Compreender sustenidos, bemóis e bequadros como modificadores de altura',
        'Reconhecer equivalentes enarmónicos — o mesmo som, nome diferente',
      ],
      concepts: [
        {
          title: 'Meios-Tons e Tons',
          explanation:
            'Um meio-tom é a menor distância entre duas notas — como C para C# ou E para F. No piano, é a tecla imediatamente seguinte (branca ou preta). Um tom equivale a dois meios-tons — como C para D. Estas duas distâncias são os átomos a partir dos quais se constroem todas as escalas, acordes e melodias.',
          tryThisLabel: 'Vê todos os meios-tons em ordem',
        },
        {
          title: 'Sustenidos, Bemóis e Bequadros',
          explanation:
            'Um sustenido (#) sobe uma nota meio-tom. Um bemol (b) desce uma nota meio-tom. Um bequadro (♮) anula um sustenido ou bemol anterior. Estes símbolos chamam-se acidentes. Entre a maioria das notas naturais há uma nota intermédia — C# está entre C e D. Mas E–F e B–C já distam meio-tom, por isso não há tecla entre elas.',
          tryThisLabel: 'Vê F# — o sustenido em G maior',
        },
        {
          title: 'Equivalentes Enarmónicos',
          explanation:
            'C# e Db são a mesma tecla no piano — a mesma altura, nome diferente. Chamam-se equivalentes enarmónicos. O nome que se usa depende do contexto: na tonalidade de D maior, a nota chama-se C# (porque é um C elevado); na tonalidade de Ab maior, a mesma altura chama-se Db (porque é um D baixado).',
          tryThisLabel: 'Vê todas as 12 notas',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca notas adjacentes na escala cromática — cada passo é um meio-tom. Escreve "C chromatic scale" para as veres todas',
        },
        {
          instruction:
            'Encontra E e F no piano — repara que não há tecla preta entre elas. Este par é um meio-tom natural',
        },
        {
          instruction:
            'Escreve "key of G" — que nota precisa de sustenido? O F torna-se F# para manter o padrão da escala maior',
        },
      ],
    },

    // ── U1 M4: The Chromatic Scale ─────────────────────────────────────────
    l1u1m4: {
      title: 'A Escala Cromática',
      subtitle:
        'Todas as 12 notas em ordem — o vocabulário completo de alturas',
      objectives: [
        'Conhecer a escala cromática como as 12 notas ascendentes por meios-tons',
        'Compreender que a escala cromática contém todas as notas possíveis na música ocidental',
        'Ver como as 7 notas naturais e os 5 acidentes formam o conjunto completo',
      ],
      concepts: [
        {
          title: 'As 12 Notas',
          explanation:
            'A música ocidental usa 12 alturas distintas, que se repetem em oitavas mais agudas e mais graves. A escala cromática toca as 12 em ordem, cada uma a meio-tom da seguinte: C, C#, D, D#, E, F, F#, G, G#, A, A#, B — e depois volta a C uma oitava acima. Estas 12 notas são o vocabulário completo de alturas. Todas as escalas, acordes e melodias provêm deste conjunto.',
          tryThisLabel: 'Ouve todas as 12 notas',
        },
        {
          title: 'O Teclado do Piano',
          explanation:
            'O piano torna as 12 notas visíveis: 7 teclas brancas (as naturais C–B) e 5 teclas pretas (os sustenidos/bemóis). O padrão de 2 teclas pretas seguido de 3 teclas pretas repete-se ao longo do teclado. Esta disposição não é arbitrária — reflete os meios-tons naturais entre E–F e B–C. Quando reconheceres este padrão, consegues encontrar qualquer nota instantaneamente.',
          tryThisLabel: 'Vê as notas naturais no teclado',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "C chromatic scale" e conta as 12 notas antes de o padrão se repetir',
        },
        {
          instruction:
            'No piano, encontra o grupo de 2 teclas pretas — a tecla branca logo abaixo do grupo é sempre C',
        },
      ],
    },

    // ── U2 M1: Note Values and Rests ───────────────────────────────────────
    l1u2m1: {
      title: 'Figuras Rítmicas e Pausas',
      subtitle:
        'Quanto tempo duram as notas — da semibreve à semicolcheia',
      objectives: [
        'Conhecer as figuras rítmicas padrão: semibreve, mínima, semínima, colcheia e semicolcheia',
        'Compreender a relação 2:1 — cada figura tem metade da duração da anterior',
        'Reconhecer as pausas como silêncio medido com a mesma hierarquia de duração',
      ],
      concepts: [
        {
          title: 'A Hierarquia de Durações',
          explanation:
            'A música organiza o tempo através de uma hierarquia de figuras rítmicas. A semibreve é a mais longa. A mínima dura metade. A semínima é metade disso — e assim por diante até às colcheias e semicolcheias. Cada nível divide por dois: 1 semibreve = 2 mínimas = 4 semínimas = 8 colcheias = 16 semicolcheias. Este sistema permite aos músicos escrever qualquer ritmo com precisão.',
          tryThisLabel: 'Ouve uma pulsação regular sobre a escala',
        },
        {
          title: 'Pausas',
          explanation:
            'Cada figura rítmica tem uma pausa correspondente — um símbolo para silêncio medido. Uma pausa de semínima dura tanto como uma semínima. Uma pausa de mínima dura tanto como uma mínima. As pausas não são "nada" — são silêncios ativos que moldam as frases tanto como as próprias notas. Os grandes músicos prestam tanta atenção ao que não tocam como ao que tocam.',
          tryThisLabel: 'Toca um acorde — depois imagina o silêncio a preencher o mesmo espaço',
        },
        {
          title: 'Pontos de Aumentação e Ligaduras',
          explanation:
            'Um ponto depois de uma nota aumenta a sua duração em metade — uma mínima com ponto dura três tempos em vez de dois (quando a semínima é a unidade de tempo). Uma ligadura de prolongamento une duas notas da mesma altura num som contínuo — uma mínima ligada a uma semínima dura três tempos no total. Pontos e ligaduras permitem criar durações que não encaixam na hierarquia básica.',
          tryThisLabel: 'Ouve a escala a um tempo regular',
        },
      ],
      tasks: [
        {
          instruction:
            'Bate uma pulsação regular na mesa. Cada batida é uma semínima. Agora bate apenas a cada duas batidas — essas são mínimas',
        },
        {
          instruction:
            'Bate palmas no ritmo: semínima, semínima, mínima. A mínima dura tanto como as duas semínimas juntas',
        },
      ],
    },

    // ── U2 M2: Meter and Time Signatures ───────────────────────────────────
    l1u2m2: {
      title: 'Compasso e Indicação de Compasso',
      subtitle: 'Como os tempos se agrupam em compassos — 2/4, 3/4 e 4/4',
      objectives: [
        'Compreender o metro como o padrão recorrente de tempos fortes e fracos',
        'Ler indicações de compasso simples: 2/4, 3/4, 4/4',
        'Sentir a diferença entre metro binário (2), ternário (3) e quaternário (4)',
      ],
      concepts: [
        {
          title: 'Pulsação, Metro e Compassos',
          explanation:
            'A música tem uma pulsação regular — o tempo em que bates o pé. O metro organiza esses tempos em grupos recorrentes de 2, 3 ou 4, com o primeiro tempo de cada grupo a sentir-se mais forte. Um compasso é um grupo completo, separado por barras de compasso. A indicação de compasso no início diz-te o agrupamento: 4/4 significa quatro tempos de semínima por compasso. 3/4 significa três. 2/4 significa dois.',
          tryThisLabel: 'Acompanha em compasso 4/4',
        },
        {
          title: 'Compassos Simples',
          explanation:
            'No metro simples, cada tempo divide-se naturalmente em duas partes iguais. 4/4 é a indicação de compasso mais comum — quatro tempos de semínima por compasso, com o tempo 1 mais forte e o tempo 3 com um acento secundário. 3/4 dá à música um carácter de valsa — UM-dois-três, UM-dois-três. 2/4 cria um carácter de marcha — UM-dois, UM-dois. O número de cima indica os tempos por compasso; o número de baixo indica qual a figura que vale um tempo.',
          tryThisLabel: 'Imagina contar 1-2-3-4 sobre estes acordes',
        },
      ],
      tasks: [
        {
          instruction:
            'Bate uma pulsação regular e acentua cada 4.º tempo — estás a sentir o compasso 4/4. Agora experimenta acentuar cada 3.º tempo — isso é 3/4',
        },
        {
          instruction:
            'Ouve uma música que conheces e conta os tempos até o padrão se repetir. A maioria das músicas pop está em 4/4. As valsas estão em 3/4',
        },
      ],
    },

    // ── U3 M1: The Major Scale ─────────────────────────────────────────────
    l1u3m1: {
      title: 'A Escala Maior',
      subtitle:
        'O padrão T-T-mT-T-T-T-mT que define a tonalidade maior',
      objectives: [
        'Construir uma escala maior a partir de qualquer nota usando o padrão T-T-mT-T-T-T-mT',
        'Compreender que C maior usa apenas teclas brancas porque o padrão cai naturalmente',
        'Ver que o mesmo padrão noutra tonalidade requer sustenidos ou bemóis',
      ],
      concepts: [
        {
          title: 'O Padrão da Escala Maior',
          explanation:
            'A escala maior segue uma sequência específica de tons e meios-tons: T-T-mT-T-T-T-mT. Começando em C, obténs apenas teclas brancas — é por isso que C maior não tem sustenidos nem bemóis. Cada nota da escala tem um número chamado grau da escala, de 1 (a fundamental) até 7.',
          tryThisLabel: 'Vê a escala de C maior',
        },
        {
          title: 'O Padrão Funciona em Qualquer Nota',
          explanation:
            'O padrão T-T-mT funciona a partir de qualquer nota inicial. Começa em G e segue o padrão — precisarás de F# em vez de F para manter os intervalos corretos. Começa em F e precisarás de Bb. O padrão diz-te exatamente que notas precisam de sustenidos ou bemóis — não os escolhes tu.',
          tryThisLabel: 'Constrói G maior — um sustenido',
        },
        {
          title: 'Mesmo Padrão, Mesmo Som',
          explanation:
            'Como todas as escalas maiores usam exatamente o mesmo padrão de intervalos, partilham a mesma qualidade brilhante e resolvida — apenas em alturas diferentes. É por isso que os músicos tocam em tonalidades diferentes: para se adaptarem à extensão vocal de um cantor, ao registo de um instrumento, ou para mudar a cor de uma peça.',
          tryThisLabel: 'Constrói D maior — dois sustenidos',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "C major scale" e traça o padrão T-T-mT-T-T-T-mT no piano',
        },
        {
          instruction:
            'Escreve "G major scale" — que nota precisa de sustenido para manter o padrão?',
        },
        {
          instruction:
            'Escreve "F major scale" — esta precisa de um bemol. Que nota?',
        },
      ],
    },

    // ── U3 M2: Key Signatures — First Four Keys ───────────────────────────
    l1u3m2: {
      title: 'Armações de Clave — Primeiras Quatro Tonalidades',
      subtitle: 'C, G, D e F — as tonalidades que mais vais usar',
      objectives: [
        'Compreender o que é uma armação de clave e por que existe',
        'Conhecer as armações de clave de C maior (0), G maior (1#), D maior (2#) e F maior (1b)',
        'Distinguir entre uma escala (um padrão) e uma tonalidade (um contexto musical)',
      ],
      concepts: [
        {
          title: 'O Que É uma Armação de Clave?',
          explanation:
            'Uma armação de clave é uma abreviatura — em vez de escrever um sustenido ou bemol junto de cada nota afetada, listam-se uma vez no início. A armação de clave de G maior tem um sustenido (F#), o que significa que todos os F na peça são tocados como F#. Isto poupa espaço e indica a tonalidade de relance.',
          tryThisLabel: 'Vê a armação de G — um sustenido',
        },
        {
          title: 'As Tuas Primeiras Quatro Tonalidades',
          explanation:
            'Começa pelas tonalidades mais comuns: C maior não tem sustenidos nem bemóis. G maior tem um sustenido (F#). D maior tem dois sustenidos (F#, C#). F maior tem um bemol (Bb). Os sustenidos aparecem sempre por ordem: F-C-G-D-A-E-B. Os bemóis aparecem na ordem inversa: B-E-A-D-G-C-F. Cada nova tonalidade acrescenta o próximo acidente na sequência.',
          tryThisLabel: 'Vê a armação de D — dois sustenidos',
        },
        {
          title: 'Escala vs. Tonalidade',
          explanation:
            'Uma escala é um padrão de notas em ordem. Uma tonalidade é o contexto musical que usa essas notas, com uma nota como "casa". Quando estás "na tonalidade de G maior", a escala de G maior fornece as tuas notas, G é a casa, e a armação de clave indica que F é sempre sustenido.',
          tryThisLabel: 'Vê a armação de F — um bemol',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "key of G" — quantos sustenidos tem a armação de clave?',
        },
        {
          instruction:
            'Escreve "key of D" — que novo sustenido foi acrescentado além do F# de G maior?',
        },
        {
          instruction:
            'Escreve "key of F" — esta é a primeira tonalidade com bemol. Que nota é bemolizada?',
        },
      ],
    },

    // ── U3 M3: Intervals by Number ─────────────────────────────────────────
    l1u3m3: {
      title: 'Intervalos por Número',
      subtitle:
        'Medir a distância entre notas — do uníssono à oitava',
      objectives: [
        'Nomear intervalos do uníssono à oitava contando os nomes das notas',
        'Distinguir intervalos melódicos (notas em sequência) de intervalos harmónicos (notas em simultâneo)',
        'Ouvir como intervalos maiores criam saltos mais amplos na melodia',
      ],
      concepts: [
        {
          title: 'O Que É um Intervalo?',
          explanation:
            'Um intervalo mede a distância entre duas notas. Para o nomear, conta os nomes das notas da nota inferior à superior, inclusive. C a E: C-D-E = 3 letras, portanto é uma 3.ª. C a G: C-D-E-F-G = 5 letras, portanto é uma 5.ª. Da mesma nota para a mesma nota é um uníssono (1.ª). Uma oitava (8.ª) vai de uma nota até à próxima ocorrência do mesmo nome.',
          tryThisLabel: 'Vê C-E-G — uma 3.ª e uma 5.ª',
        },
        {
          title: 'Intervalos Melódicos e Harmónicos',
          explanation:
            'Quando duas notas soam uma após a outra, o intervalo é melódico — ouves um salto ou passo numa melodia. Quando duas notas soam ao mesmo tempo, o intervalo é harmónico — ouves uma combinação ou choque. O tamanho é o mesmo nos dois casos; só a apresentação difere.',
          tryThisLabel: 'Ouve 2.as melódicas — passo a passo',
        },
        {
          title: 'Intervalos na Escala Maior',
          explanation:
            'Cada nota da escala maior forma um intervalo específico com a fundamental. A partir de C: C-D é uma 2.ª, C-E é uma 3.ª, C-F é uma 4.ª, C-G é uma 5.ª, C-A é uma 6.ª, C-B é uma 7.ª, C-C é uma oitava. Estes são os números básicos dos intervalos. Mais tarde aprenderás que cada número tem também uma qualidade (maior, menor, perfeito) — por agora, o número é suficiente.',
          tryThisLabel: 'Vê o Círculo de Quintas — construído sobre intervalos de 5.ª',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "C major chord" — o intervalo de C a E é uma 3.ª, e de C a G é uma 5.ª. Conta as letras para confirmar',
        },
        {
          instruction:
            'Escreve "C major scale" — cada par adjacente é uma 2.ª (um passo). Toca notas não adjacentes para ouvires intervalos maiores',
        },
        {
          instruction:
            'Abre o Círculo de Quintas — cada passo ao redor do círculo é um intervalo de 5.ª. Conta as letras para confirmar',
        },
      ],
    },

    // ── U3 M4: Your First Chords — Major Triads ───────────────────────────
    l1u3m4: {
      title: 'Os Teus Primeiros Acordes — Tríades Maiores',
      subtitle:
        'Três notas que soam completas — fundamental, 3.ª maior, 5.ª perfeita',
      objectives: [
        'Construir uma tríade maior a partir de qualquer fundamental: fundamental + 3.ª maior + 5.ª perfeita',
        'Ler cifras básicas: C, G, D, F (letra sozinha = tríade maior)',
        'Ouvir o carácter brilhante e estável que define as tríades maiores',
      ],
      concepts: [
        {
          title: 'O Que É um Acorde?',
          explanation:
            'Um acorde é três ou mais notas a soar em simultâneo. O acorde mais simples é a tríade — três notas empilhadas em intervalos de 3.ª. Uma tríade maior combina uma fundamental, a nota uma 3.ª maior acima dela (4 meios-tons) e a nota uma 5.ª perfeita acima da fundamental (7 meios-tons). C maior = C-E-G. A cifra é apenas a letra da fundamental: C significa C maior.',
          tryThisLabel: 'Ouve C maior — fundamental, terceira, quinta',
        },
        {
          title: 'Construir Tríades a Partir de Qualquer Fundamental',
          explanation:
            'A fórmula funciona a partir de qualquer nota inicial. G maior = G-B-D. D maior = D-F#-A. F maior = F-A-C. Conta 4 meios-tons acima da fundamental para a 3.ª, depois mais 3 meios-tons para a 5.ª (ou 7 no total da fundamental à 5.ª). O carácter brilhante e estável de uma tríade maior provém desta combinação específica de intervalos.',
          tryThisLabel: 'Constrói G maior',
        },
        {
          title: 'O Som da Tríade Maior',
          explanation:
            'Toca várias tríades maiores — C, G, D, F. Todas partilham a mesma qualidade brilhante, aberta e resolvida, apesar de começarem em notas diferentes. Isto acontece porque todas usam a mesma estrutura intervalar: 3.ª maior + 3.ª menor (fundamental à 3.ª = 4 meios-tons, 3.ª à 5.ª = 3 meios-tons). Essa estrutura consistente é o que as faz soar todas "maiores".',
          tryThisLabel: 'Constrói F maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "C major chord" e conta os meios-tons: C a E = 4 (3.ª maior), E a G = 3 (3.ª menor), C a G = 7 (5.ª perfeita)',
        },
        {
          instruction:
            'Escreve "G major chord" — identifica a fundamental, a 3.ª e a 5.ª. Mesmo padrão intervalar, nota inicial diferente',
        },
        {
          instruction:
            'Toca "C major chord", "G major chord", "D major chord", "F major chord" — ouve a mesma qualidade brilhante em todas as tonalidades',
        },
      ],
    },
  },
};

export default curriculumL1;
