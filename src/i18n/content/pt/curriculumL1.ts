import type { CurriculumLevelOverlay } from '../types';

const curriculumL1: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    // Track "Start with sound" (wave 2)
    u34: {
      title: 'Começa pelo som',
      description: 'Cinco lições curtas, de ouvido e no teu instrumento: agudo e grave, os nomes das notas, meios-tons e tons, a escala maior e os teus primeiros acordes. Não precisas de ler música.',
    },
    u33: {
      title: 'Notação de guitarra — opcional',
      description: 'Clave, cordas, dedos, posições e pestanas. Estas três lições não contam para concluir níveis nem para os desbloquear.'
    },
    u1: {
      title: 'Notação e altura',
      description:
        'A pauta, claves, meios-tons, tons, acidentes e a escala cromática',
      milestone: {
        skillsSummary: [
          'Ler a clave de sol e a clave de fá e localizar o C central na pauta dupla',
          'Definir meios-tons e tons e encontrá-los no piano',
          'Identificar sustenidos, bemóis e equivalentes enarmónicos',
          'Conhecer as 12 alturas cromáticas e vê-las no teclado',
        ],
        bridgeText:
          'Já conheces as 12 alturas e como funciona a distância no teclado. A seguir vais aprender como se organiza o tempo na música — figuras rítmicas, pausas e compasso.',
        tryThisLabel: 'Toca as 12 notas por ordem',
        tryThisPrompt: 'Consegues nomear cada nota antes de a ouvir?',
      },
    },
    u2: {
      title: 'Ritmo e compasso',
      description:
        'Figuras rítmicas, pausas, pontos de aumentação, ligaduras e compassos simples',
      milestone: {
        skillsSummary: [
          'Conhecer a hierarquia das figuras rítmicas, da semibreve à semicolcheia',
          'Compreender os pontos de aumentação e as ligaduras como modificadores de duração',
          'Ler indicações de compasso simples: 2/4, 3/4, 4/4',
          'Sentir o metro binário, ternário e quaternário',
        ],
        bridgeText:
          'Já compreendes a altura e o ritmo — as duas dimensões da notação musical. Agora vais combiná-los em escalas, intervalos e nos teus primeiros acordes.',
        tryThisLabel: 'Toca G maior a um tempo regular',
        tryThisPrompt: 'Experimenta marcar semínimas enquanto a escala toca.',
      },
    },
    u3: {
      title: 'Escalas, intervalos e primeiros acordes',
      description:
        'A escala maior, armações de clave, números de intervalos e tríades maiores',
      milestone: {
        skillsSummary: [
          'Construir escalas maiores em C, G, D e F usando o padrão T-T-mT-T-T-T-mT',
          'Ler as armações de clave das primeiras quatro tonalidades maiores',
          'Nomear intervalos do uníssono à oitava contando os nomes das notas',
          'Construir tríades maiores a partir de qualquer fundamental',
        ],
        bridgeText: '',
        tryThisLabel: 'Constrói uma tríade de D maior',
        tryThisPrompt: 'Nomeia as três notas antes de tocar.',
      },
    },
  },

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: {
    l1u33m1: {
      title: 'Notação de guitarra: clave e cordas',
      subtitle: 'Lê a altura sonora e os números de corda em círculo',
      objectives: [
        'Explicar por que razão a guitarra se escreve uma oitava acima do som',
        'Distinguir um número de corda de um número de dedo'
      ],
      concepts: [
        {
          title: 'O pequeno 8 debaixo da clave',
          explanation: 'A música para guitarra usa a clave de sol com um pequeno 8 por baixo: as notas soam uma oitava abaixo do que está escrito. Um E4 escrito soa como E3. O pequeno 8 muda o registo, não os nomes das notas. Em Explorar, seleciona Guitarra para veres esta clave; o Piano usa a clave de sol simples.',
          tryThisLabel: 'Abre em Explorar, seleciona Guitarra e compara a clave com a do Piano'
        },
        {
          title: 'Números em círculo indicam cordas',
          explanation: 'Os símbolos ① ② ③ ④ ⑤ ⑥ indicam as cordas, da mais fina e aguda à mais grossa e grave. Na afinação padrão, as cordas soltas soam E4, B3, G3, D3, A2, E2. Um ③ em círculo significa tocar na corda 3, não com o dedo 3. Estes nomes de altura descrevem o som, antes da transposição de oitava na escrita.',
          tryThisLabel: 'Mostra na Guitarra e encontra as duas cordas E soltas'
        }
      ],
      tasks: [
        {
          instruction: 'Seleciona Guitarra em Explorar. Encontra o pequeno 8 debaixo da clave de sol e explica a diferença entre o E4 escrito e o E3 que soa.'
        },
        {
          instruction: 'Na tua guitarra, aponta para ① e ⑥. Diz as suas alturas sonoras na afinação padrão e depois encontra ③.'
        }
      ]
    },
    l1u33m2: {
      title: 'Notação de guitarra: as duas mãos',
      subtitle: 'Mão esquerda 0–4 e mão direita p-i-m-a',
      objectives: [
        'Ler os números dos dedos da mão esquerda e o sinal de corda solta',
        'Descodificar p-i-m-a e distinguir um arpejo de um tremolo'
      ],
      concepts: [
        {
          title: 'Números da mão esquerda',
          explanation: 'Os números da mão esquerda indicam os dedos que premem as cordas: 1 = indicador, 2 = médio, 3 = anelar, 4 = mindinho. O número 0 significa corda solta: nenhum dedo da mão esquerda a prime. Estes números não são os números de corda em círculo. No braço da guitarra da aplicação, escolhe Dedos para veres sugestões de dedilhação da mão esquerda.',
          tryThisLabel: 'Mostra na Guitarra e compara Dedos com Notas'
        },
        {
          title: 'Letras da mão direita',
          explanation: 'As letras p-i-m-a indicam os dedos que dedilham: p = polegar, i = indicador, m = médio, a = anelar. Num arpejo, as notas do acorde soam uma após outra. Lê p-i-m-a como polegar, indicador, médio, anelar. O padrão de tremolo p-a-m-i é polegar, anelar, médio, indicador: a ordem das letras importa. A aplicação toca alturas; pratica os movimentos das mãos na tua guitarra.',
          tryThisLabel: 'Ouve o acorde e depois dedilha as suas notas separadamente na tua guitarra'
        }
      ],
      tasks: [
        {
          instruction: 'Na tua guitarra, toca uma corda solta e depois prime-a com os dedos 1, 2, 3 e 4, um de cada vez. Diz os números enquanto tocas.'
        },
        {
          instruction: 'Imita lentamente p-i-m-a e depois p-a-m-i. Nomeia cada dedo que dedilha; não confundas uma letra da mão direita com um número da mão esquerda.'
        }
      ]
    },
    l1u33m3: {
      title: 'Notação de guitarra: posições e pestanas',
      subtitle: 'Algarismos romanos, C e ½C no braço',
      objectives: [
        'Ler posições em algarismos romanos, como V',
        'Distinguir uma indicação de posição de uma pestana completa ou parcial'
      ],
      concepts: [
        {
          title: 'Posições em algarismos romanos',
          explanation: 'Um algarismo romano indica a posição da mão esquerda: I = 1.ª, II = 2.ª, V = 5.ª, VII = 7.ª. Na posição V, o indicador tem como base o trasto 5; os outros dedos cobrem normalmente os trastos 6, 7 e 8. Uma posição é um local da mão, não um número de corda nem um acorde. Uma indicação de posição, por si só, não exige uma pestana.',
          tryThisLabel: 'Mostra na Guitarra e escolhe a posição V'
        },
        {
          title: 'O sinal de pestana',
          explanation: 'Uma pestana usa um dedo, geralmente o indicador, para premir várias cordas no mesmo trasto. C indica uma pestana completa; ½C indica uma pestana parcial. CV significa pestana completa no trasto 5, enquanto ½CV significa pestana parcial nesse trasto. A partitura ou a dedilhação indica que cordas a pestana parcial abrange; não deduzas um número fixo de cordas apenas a partir de ½.',
          tryThisLabel: 'Mostra na Guitarra; na tua guitarra, localiza o trasto 5 para CV'
        }
      ],
      tasks: [
        {
          instruction: 'Escolhe a posição V no braço da guitarra da aplicação. Localiza o trasto 5 e compara o número da posição com os números dos dedos nos pontos.'
        },
        {
          instruction: 'Lê V, CV e ½CV em voz alta. Explica qual das indicações apenas localiza a mão, qual pede uma pestana completa e qual pede uma pestana parcial.'
        }
      ]
    },

    // ── U1 M1: The Staff and Clefs ──────────────────────────────────────────
    l1u1m1: {
      title: 'A pauta e as claves',
      subtitle: 'A grelha de cinco linhas que mapeia a altura no papel',
      objectives: [
        'Identificar a pauta de cinco linhas como a base da notação ocidental',
        'Ler a clave de sol e a clave de fá e saber em que alturas se centram',
        'Compreender como a posição na pauta corresponde à altura — mais acima = som mais agudo',
      ],
      concepts: [
        {
          title: 'A pauta de cinco linhas',
          explanation:
            'Toda a música escrita vive numa pauta — cinco linhas horizontais e quatro espaços. Notas colocadas mais acima na pauta soam mais agudas; notas colocadas mais abaixo soam mais graves. Cada linha e cada espaço representa uma altura específica. A pauta é o mapa; as notas são os pontos de referência.',
          tryThisLabel: 'Vê as notas organizadas por altura',
        },
        {
          title: 'Clave de Sol e clave de Fá',
          explanation:
            'Uma clave aparece no início de uma pauta e indica quais alturas as linhas e espaços representam. A clave de sol (𝄞) centra-se no G acima do C central — é usada para instrumentos mais agudos e a mão direita no piano. A clave de fá (𝄢) centra-se no F abaixo do C central — é usada para instrumentos mais graves e a mão esquerda no piano. Sem uma clave, a pauta é apenas linhas — a clave dá-lhes significado. A guitarra usa a clave de sol com um pequeno 8 por baixo: soa uma oitava abaixo do que está escrito. A unidade opcional Notação de Guitarra explica esta convenção.',
          tryThisLabel: 'De C a C na clave de sol e na clave de fá',
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
      title: 'Linhas suplementares e a pauta dupla',
      subtitle: 'Estender a pauta e ligar a clave de sol à clave de fá',
      objectives: [
        'Compreender as linhas suplementares como extensões acima ou abaixo da pauta',
        'Saber que a pauta dupla combina as claves de sol e de fá unidas por uma chaveta',
        'Localizar o C central como a linha suplementar entre as duas pautas',
      ],
      concepts: [
        {
          title: 'Linhas suplementares',
          explanation:
            'Quando as notas ultrapassam a pauta de cinco linhas, acrescentam-se pequenas linhas horizontais chamadas linhas suplementares. O C central, por exemplo, está numa linha suplementar abaixo da pauta de clave de sol ou numa linha suplementar acima da pauta de clave de fá. As linhas suplementares estendem a pauta temporariamente — aparecem apenas onde são necessárias.',
          tryThisLabel: 'Vê o C central no piano',
        },
        {
          title: 'A pauta dupla',
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
      title: 'Meios-tons, tons e acidentes',
      subtitle:
        'As menores distâncias na música e os símbolos que modificam a altura',
      objectives: [
        'Definir meios-tons e tons como os blocos de construção de todas as escalas',
        'Compreender sustenidos, bemóis e bequadros como modificadores de altura',
        'Reconhecer equivalentes enarmónicos — o mesmo som, nome diferente',
      ],
      concepts: [
        {
          title: 'Meios-tons e tons',
          explanation:
            'Um meio-tom é a menor distância entre duas notas — como C para C# ou E para F. No piano, é a tecla imediatamente seguinte (branca ou preta). Um tom equivale a dois meios-tons — como C para D. Estas duas distâncias são os átomos a partir dos quais se constroem todas as escalas, acordes e melodias.',
          tryThisLabel: 'Vê todos os meios-tons em ordem',
        },
        {
          title: 'Sustenidos, bemóis e bequadros',
          explanation:
            'Um sustenido (#) sobe uma nota meio-tom. Um bemol (b) desce uma nota meio-tom. Um bequadro (♮) anula um sustenido ou bemol anterior. Estes símbolos chamam-se acidentes. Entre a maioria das notas naturais há uma nota intermédia — C# está entre C e D. Mas E–F e B–C já distam meio-tom, por isso não há tecla entre elas.',
          tryThisLabel: 'Vê F# — o sustenido em G maior',
        },
        {
          title: 'Equivalentes enarmónicos',
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
      title: 'A escala cromática',
      subtitle:
        'Todas as 12 notas em ordem — o vocabulário completo de alturas',
      objectives: [
        'Conhecer a escala cromática como as 12 notas ascendentes por meios-tons',
        'Compreender que a escala cromática contém todas as notas possíveis na música ocidental',
        'Ver como as 7 notas naturais e os 5 acidentes formam o conjunto completo',
      ],
      concepts: [
        {
          title: 'As 12 notas',
          explanation:
            'A música ocidental usa 12 alturas distintas, que se repetem em oitavas mais agudas e mais graves. A escala cromática toca as 12 em ordem, cada uma a meio-tom da seguinte: C, C#, D, D#, E, F, F#, G, G#, A, A#, B — e depois volta a C uma oitava acima. Estas 12 notas são o vocabulário completo de alturas. Todas as escalas, acordes e melodias provêm deste conjunto.',
          tryThisLabel: 'Ouve todas as 12 notas',
        },
        {
          title: 'O teclado do piano',
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
      title: 'Figuras rítmicas e pausas',
      subtitle:
        'Quanto tempo duram as notas — da semibreve à semicolcheia',
      objectives: [
        'Conhecer as figuras rítmicas padrão: semibreve, mínima, semínima, colcheia e semicolcheia',
        'Compreender a relação 2:1 — cada figura tem metade da duração da anterior',
        'Reconhecer as pausas como silêncio medido com a mesma hierarquia de duração',
      ],
      concepts: [
        {
          title: 'A hierarquia de durações',
          explanation:
            'A música organiza o tempo através de uma hierarquia de figuras rítmicas. A semibreve é a mais longa. A mínima dura metade. A semínima é metade disso — e assim por diante até às colcheias e semicolcheias. Cada nível divide por dois: 1 semibreve = 2 mínimas = 4 semínimas = 8 colcheias = 16 semicolcheias. Este sistema permite aos músicos escrever qualquer ritmo com precisão.',
          tryThisLabel: 'Ouve um compasso de cada: semibreves, mínimas, semínimas e colcheias',
        },
        {
          title: 'Pausas',
          explanation:
            'Cada figura rítmica tem uma pausa correspondente — um símbolo para silêncio medido. Uma pausa de semínima dura tanto como uma semínima. Uma pausa de mínima dura tanto como uma mínima. As pausas não são "nada" — são silêncios ativos que moldam as frases tanto como as próprias notas. Os grandes músicos prestam tanta atenção ao que não tocam como ao que tocam.',
          tryThisLabel: 'Ouve notas e pausas a partilhar os tempos: semínima, pausa de semínima; mínima, pausa de mínima',
        },
        {
          title: 'Pontos de aumentação e ligaduras',
          explanation:
            'Um ponto depois de uma nota aumenta a sua duração em metade — uma mínima com ponto dura três tempos em vez de dois (quando a semínima é a unidade de tempo). Uma ligadura de prolongamento une duas notas da mesma altura num som contínuo — uma mínima ligada a uma semínima dura três tempos no total. Pontos e ligaduras permitem criar durações que não encaixam na hierarquia básica.',
          tryThisLabel: 'Ouve uma mínima com ponto e depois uma mínima ligada a uma semínima: ambas duram três tempos',
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
      title: 'Compasso e indicação de compasso',
      subtitle: 'Como os tempos se agrupam em compassos — 2/4, 3/4 e 4/4',
      objectives: [
        'Compreender o metro como o padrão recorrente de tempos fortes e fracos',
        'Ler indicações de compasso simples: 2/4, 3/4, 4/4',
        'Sentir a diferença entre metro binário (2), ternário (3) e quaternário (4)',
      ],
      concepts: [
        {
          title: 'Pulsação, metro e compassos',
          explanation:
            'A música tem uma pulsação regular — o tempo em que bates o pé. O metro organiza esses tempos em grupos recorrentes de 2, 3 ou 4, com o primeiro tempo de cada grupo a sentir-se mais forte. Um compasso é um grupo completo, separado por barras de compasso. A indicação de compasso no início diz-te o agrupamento: 4/4 significa quatro tempos de semínima por compasso. 3/4 significa três. 2/4 significa dois.',
          tryThisLabel: 'Ouve 4/4: quatro tempos por compasso, o primeiro acentuado',
        },
        {
          title: 'Compassos simples',
          explanation:
            'No metro simples, cada tempo divide-se naturalmente em duas partes iguais. 4/4 é a indicação de compasso mais comum — quatro tempos de semínima por compasso, com o tempo 1 mais forte e o tempo 3 com um acento secundário. 3/4 dá à música um carácter de valsa — UM-dois-três, UM-dois-três. 2/4 cria um carácter de marcha — UM-dois, UM-dois. O número de cima indica os tempos por compasso; o número de baixo indica qual a figura que vale um tempo.',
          tryThisLabel: 'Ouve 3/4: UM-dois-três, UM-dois-três',
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
      title: 'A escala maior',
      subtitle:
        'O padrão T-T-mT-T-T-T-mT que define a tonalidade maior',
      objectives: [
        'Construir uma escala maior a partir de qualquer nota usando o padrão T-T-mT-T-T-T-mT',
        'Compreender que C maior usa apenas teclas brancas porque o padrão cai naturalmente',
        'Ver que o mesmo padrão noutra tonalidade requer sustenidos ou bemóis',
      ],
      concepts: [
        {
          title: 'O padrão da escala maior',
          explanation:
            'A escala maior segue uma sequência específica de tons e meios-tons: T-T-mT-T-T-T-mT. Começando em C, obténs apenas teclas brancas — é por isso que C maior não tem sustenidos nem bemóis. Cada nota da escala tem um número chamado grau da escala, de 1 (a fundamental) até 7.',
          tryThisLabel: 'Vê a escala de C maior',
        },
        {
          title: 'O padrão funciona em qualquer nota',
          explanation:
            'O padrão T-T-mT funciona a partir de qualquer nota inicial. Começa em G e segue o padrão — precisarás de F# em vez de F para manter os intervalos corretos. Começa em F e precisarás de Bb. O padrão diz-te exatamente que notas precisam de sustenidos ou bemóis — não os escolhes tu.',
          tryThisLabel: 'Constrói G maior — um sustenido',
        },
        {
          title: 'Mesmo padrão, mesmo som',
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
      title: 'Armações de clave — primeiras quatro tonalidades',
      subtitle: 'C, G, D e F — as tonalidades que mais vais usar',
      objectives: [
        'Compreender o que é uma armação de clave e por que existe',
        'Conhecer as armações de clave de C maior (0), G maior (1#), D maior (2#) e F maior (1b)',
        'Distinguir entre uma escala (um padrão) e uma tonalidade (um contexto musical)',
      ],
      concepts: [
        {
          title: 'O que é uma armação de clave?',
          explanation:
            'Uma armação de clave é uma abreviatura — em vez de escrever um sustenido ou bemol junto de cada nota afetada, listam-se uma vez no início. A armação de clave de G maior tem um sustenido (F#), o que significa que todos os F na peça são tocados como F#. Isto poupa espaço e indica a tonalidade de relance.',
          tryThisLabel: 'Vê a armação de G — um sustenido',
        },
        {
          title: 'As tuas primeiras quatro tonalidades',
          explanation:
            'Começa pelas tonalidades mais comuns: C maior não tem sustenidos nem bemóis. G maior tem um sustenido (F#). D maior tem dois sustenidos (F#, C#). F maior tem um bemol (Bb). Os sustenidos aparecem sempre por ordem: F-C-G-D-A-E-B. Os bemóis aparecem na ordem inversa: B-E-A-D-G-C-F. Cada nova tonalidade acrescenta o próximo acidente na sequência.',
          tryThisLabel: 'Vê a armação de D — dois sustenidos',
        },
        {
          title: 'Escala vs. tonalidade',
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
      title: 'Intervalos por número',
      subtitle:
        'Medir a distância entre notas — do uníssono à oitava',
      objectives: [
        'Nomear intervalos do uníssono à oitava contando os nomes das notas',
        'Distinguir intervalos melódicos (notas em sequência) de intervalos harmónicos (notas em simultâneo)',
        'Ouvir como intervalos maiores criam saltos mais amplos na melodia',
      ],
      concepts: [
        {
          title: 'O que é um intervalo?',
          explanation:
            'Um intervalo mede a distância entre duas notas. Para o nomear, conta os nomes das notas da nota inferior à superior, inclusive. C a E: C-D-E = 3 letras, portanto é uma 3.ª. C a G: C-D-E-F-G = 5 letras, portanto é uma 5.ª. Da mesma nota para a mesma nota é um uníssono (1.ª). Uma oitava (8.ª) vai de uma nota até à próxima ocorrência do mesmo nome.',
          tryThisLabel: 'Vê C-E-G — uma 3.ª e uma 5.ª',
        },
        {
          title: 'Intervalos melódicos e harmónicos',
          explanation:
            'Quando duas notas soam uma após a outra, o intervalo é melódico — ouves um salto ou passo numa melodia. Quando duas notas soam ao mesmo tempo, o intervalo é harmónico — ouves uma combinação ou choque. O tamanho é o mesmo nos dois casos; só a apresentação difere.',
          tryThisLabel: 'Ouve 2.as melódicas — passo a passo',
        },
        {
          title: 'Intervalos na escala maior',
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
      title: 'Os teus primeiros acordes — tríades maiores',
      subtitle:
        'Três notas que soam completas — fundamental, 3.ª maior, 5.ª perfeita',
      objectives: [
        'Construir uma tríade maior a partir de qualquer fundamental: fundamental + 3.ª maior + 5.ª perfeita',
        'Ler cifras básicas: C, G, D, F (letra sozinha = tríade maior)',
        'Ouvir o carácter brilhante e estável que define as tríades maiores',
      ],
      concepts: [
        {
          title: 'O que é um acorde?',
          explanation:
            'Um acorde é três ou mais notas a soar em simultâneo. O acorde mais simples é a tríade — três notas empilhadas em intervalos de 3.ª. Uma tríade maior combina uma fundamental, a nota uma 3.ª maior acima dela (4 meios-tons) e a nota uma 5.ª perfeita acima da fundamental (7 meios-tons). C maior = C-E-G. A cifra é apenas a letra da fundamental: C significa C maior.',
          tryThisLabel: 'Ouve C maior — fundamental, terceira, quinta',
        },
        {
          title: 'Construir tríades a partir de qualquer fundamental',
          explanation:
            'A fórmula funciona a partir de qualquer nota inicial. G maior = G-B-D. D maior = D-F#-A. F maior = F-A-C. Conta 4 meios-tons acima da fundamental para a 3.ª, depois mais 3 meios-tons para a 5.ª (ou 7 no total da fundamental à 5.ª). O carácter brilhante e estável de uma tríade maior provém desta combinação específica de intervalos.',
          tryThisLabel: 'Constrói G maior',
        },
        {
          title: 'O som da tríade maior',
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

    // ── Track "Start with sound" (wave 2) ─────────────────────────────────
    l1u34m1: {
      title: 'Agudo e grave',
      subtitle: 'Cada nota é mais aguda ou mais grave do que outra',
      objectives: [
        'Ouvir se uma nota é mais aguda ou mais grave do que a anterior',
        'Encontrar as notas mais agudas no piano e na guitarra',
        'Ouvir a mesma nota voltar mais aguda: a oitava',
      ],
      concepts: [
        {
          title: 'Mais agudo e mais grave',
          explanation: 'Cada nota musical tem uma altura: o quanto soa aguda (alta) ou grave (baixa). Quando se tocam duas notas, uma depois da outra, a segunda é mais aguda, mais grave ou igual. Não precisas de nomes para ouvir isto. Escuta e pergunta-te se o som subiu ou desceu.',
          tryThisLabel: 'Ouve oito notas, cada uma mais aguda do que a anterior',
        },
        {
          title: 'Mais agudo no piano',
          explanation: 'No piano, as notas ficam mais agudas da esquerda para a direita. A tecla mais à esquerda é a nota mais grave e a tecla mais à direita é a mais aguda. Cada tecla, branca ou preta, é uma nota diferente, um pouco mais aguda do que a tecla imediatamente à sua esquerda.',
          tryThisLabel: 'Ouve todas as teclas, brancas e pretas, de C até ao C seguinte',
        },
        {
          title: 'Mais agudo na guitarra',
          explanation: 'Na guitarra, uma nota fica mais aguda à medida que o dedo avança ao longo de uma corda em direção ao corpo da guitarra, um trasto de cada vez. As cordas também vão do grave ao agudo: tocadas soltas, sem nenhum dedo, a corda mais grossa soa a mais grave e cada corda mais fina soa mais aguda do que a do lado.',
          tryThisLabel: 'Ouve notas a subir do grave ao agudo e depois mostra-as no teu instrumento',
        },
        {
          title: 'A mesma nota, mais aguda',
          explanation: 'Continua a subir a partir de qualquer nota e chegas a uma nota que soa como a primeira, só que mais aguda. As duas soam tão parecidas que têm o mesmo nome. Essa distância chama-se oitava. No piano são doze teclas mais à direita, contando as brancas e as pretas; numa corda da guitarra são doze trastos mais adiante.',
          tryThisLabel: 'Ouve C a subir até ao C seguinte: o mesmo nome, um som mais agudo',
        },
      ],
      tasks: [
        { instruction: 'Toca uma nota qualquer e depois uma nota à direita dela no piano, ou um trasto mais perto do corpo na guitarra. Escuta: a segunda nota é mais aguda.' },
        { instruction: 'Toca uma nota e a mesma nota uma oitava acima: no piano, doze teclas à direita; na guitarra, uma corda solta e depois a mesma corda no trasto 12. Ouve como soam parecidas.' },
      ],
    },
    l1u34m2: {
      title: 'As sete letras',
      subtitle: 'As notas chamam-se de A a G e depois os nomes recomeçam',
      objectives: [
        'Dar nome às notas com as sete letras, de A a G',
        'Encontrar o C no piano',
        'Dar nome às seis cordas soltas da guitarra',
      ],
      concepts: [
        {
          title: 'Sete letras, sempre de novo',
          explanation: 'As notas têm nomes de sete letras: A, B, C, D, E, F e G. Depois do G os nomes recomeçam no A, uma oitava acima. Assim, as mesmas sete letras voltam uma e outra vez, cada vez mais agudas. Em português também se usam os nomes do solfejo: C = Dó, D = Ré, E = Mi, F = Fá, G = Sol, A = Lá, B = Si. Esta aplicação escreve as letras.',
          tryThisLabel: 'Ouve A, B, C, D, E, F e G e depois de novo o A, uma oitava acima',
        },
        {
          title: 'Encontrar o C no piano',
          explanation: 'As teclas pretas do piano estão em grupos de duas e em grupos de três. A tecla branca imediatamente à esquerda de cada grupo de duas teclas pretas é o C. A partir do C, as teclas brancas para a direita são D, E, F, G, A e B, e depois de novo C.',
          tryThisLabel: 'Ouve C, D, E, F, G, A e B e depois de novo o C',
        },
        {
          title: 'As cordas soltas da guitarra',
          explanation: 'Numa guitarra com a afinação habitual, as seis cordas tocadas soltas chamam-se, da mais grossa para a mais fina: E, A, D, G, B e E. A corda mais grossa e a mais fina são ambas E, a duas oitavas de distância.',
          tryThisLabel: 'Ouve as sete letras a partir de E: E, F, G, A, B, C, D e de novo E',
        },
        {
          title: 'A letra seguinte',
          explanation: 'Para passar de uma letra à seguinte, toca no piano a tecla branca seguinte, à direita: de C para D, de D para E, e assim por diante. Numa corda da guitarra, a letra seguinte está dois trastos mais adiante, exceto de E para F e de B para C, que ficam a apenas um trasto.',
          tryThisLabel: 'Ouve as letras a subir a partir de F: F, G, A, B, C, D, E e de novo F',
        },
      ],
      tasks: [
        { instruction: 'Piano: encontra todos os C, a tecla branca imediatamente à esquerda de cada grupo de duas teclas pretas, e toca-os da esquerda para a direita. Guitarra: toca as cordas soltas da mais grossa para a mais fina e diz os seus nomes.' },
        { instruction: 'Toca C, D, E, F, G, A, B e de novo C, dizendo cada nome enquanto tocas. No piano são as teclas brancas a partir de qualquer C; na guitarra, o C está no trasto 3 da corda A, a segunda mais grossa.' },
      ],
    },
    l1u34m3: {
      title: 'Meios-tons e tons',
      subtitle: 'As menores distâncias entre notas e as notas que ficam pelo meio',
      objectives: [
        'Ouvir e encontrar um meio-tom: a nota mais próxima',
        'Formar um tom com dois meios-tons',
        'Dar nome às notas intermédias com sustenidos e bemóis',
      ],
      concepts: [
        {
          title: 'A nota mais próxima: um meio-tom',
          explanation: 'A nota mais próxima, acima ou abaixo de qualquer nota, está a um meio-tom de distância. No piano é a tecla imediatamente a seguir, preta ou branca, sem nada pelo meio. Na guitarra é o trasto seguinte, na mesma corda. Doze meios-tons seguidos, todas as teclas de um C ao seguinte, formam a escala cromática.',
          tryThisLabel: 'Ouve doze meios-tons seguidos, de C até ao C seguinte',
        },
        {
          title: 'Dois meios-tons: um tom',
          explanation: 'Dois meios-tons formam um tom. No piano, um tom salta uma tecla: de C para D passa por cima da tecla preta que fica entre as duas. Na guitarra são dois trastos na mesma corda. Uma escala feita só de tons chama-se escala de tons inteiros.',
          tryThisLabel: 'Ouve só tons, de C até ao C seguinte',
        },
        {
          title: 'As notas intermédias',
          explanation: 'Entre C e D há mais uma nota: a tecla preta. Tem dois nomes. É C sustenido (C♯), meio-tom acima de C, e D bemol (D♭), meio-tom abaixo de D. Sustenido quer dizer meio-tom acima; bemol quer dizer meio-tom abaixo. Cada tecla preta tem um nome com sustenido e um nome com bemol.',
          tryThisLabel: 'Ouve uma subida a partir de G com uma tecla preta, F♯',
        },
        {
          title: 'Onde não há tecla preta',
          explanation: 'Duas vezes em cada oitava, duas teclas brancas estão lado a lado sem tecla preta entre elas: E e F, e B e C. Cada um desses pares está a apenas meio-tom de distância. Todos os outros pares de teclas brancas vizinhas estão a um tom, com uma tecla preta pelo meio.',
          tryThisLabel: 'Ouve as teclas brancas a partir de C, com meios-tons de E para F e de B para C',
        },
      ],
      tasks: [
        { instruction: 'Toca uma nota qualquer e depois a nota meio-tom acima: a tecla seguinte no piano ou o trasto seguinte na guitarra. Depois toca um tom: duas teclas mais adiante, ou dois trastos.' },
        { instruction: 'Encontra o C sustenido: no piano, a tecla preta imediatamente à direita de C; na guitarra, o trasto 4 da corda A. Diz os seus dois nomes: C sustenido e D bemol.' },
      ],
    },
    l1u34m4: {
      title: 'Uma escala é uma escada',
      subtitle: 'A escala maior: tom, tom, meio-tom, tom, tom, tom, meio-tom',
      objectives: [
        'Ouvir uma escala maior subir da primeira nota até à mesma nota uma oitava acima',
        'Construir uma escala maior a partir de qualquer nota com tons e meios-tons',
        'Ouvir a primeira nota da escala como a casa',
      ],
      concepts: [
        {
          title: 'Notas por ordem: uma escala',
          explanation: 'Uma escala é um conjunto de notas tocadas por ordem, como os degraus de uma escada, desde uma nota de partida até à mesma nota uma oitava acima. Uma delas é a escala maior. Tem sete notas diferentes e depois a primeira nota volta lá em cima.',
          tryThisLabel: 'Ouve a escala de C maior: sete notas e depois de novo o C, lá em cima',
        },
        {
          title: 'Tom, tom, meio-tom, tom, tom, tom, meio-tom',
          explanation: 'A escala maior sobe por esta ordem de passos: tom, tom, meio-tom, tom, tom, tom, meio-tom. Numera as suas notas de 1 a 8, a partir de baixo: os dois meios-tons ficam de 3 para 4 e de 7 para 8. A partir de C, os passos dão C, D, E, F, G, A, B e C: só teclas brancas, porque os meios-tons calham de E para F e de B para C.',
          tryThisLabel: 'Ouve os passos a partir de C: tom, tom, meio-tom, tom, tom, tom, meio-tom',
        },
        {
          title: 'A partir de qualquer nota',
          explanation: 'Começa em qualquer nota, dá os mesmos passos e obténs a escala maior dessa nota. A partir de G: G, A, B, C, D, E, F♯ e G. O F sobe para F♯ para que o último passo, até G, seja um meio-tom e o anterior um tom. Numa só corda da guitarra, os mesmos passos são 2, 2, 1, 2, 2, 2 e 1 trastos.',
          tryThisLabel: 'Ouve a escala maior a partir de G, com F♯',
        },
        {
          title: 'A casa',
          explanation: 'A primeira nota da escala é a sua casa. À medida que a escala sobe, os últimos passos levam o ouvido de volta a ela e, quando chega a nota de cima, a escala soa terminada. Se parares uma nota antes, na sétima, soa como se ainda faltasse alguma coisa.',
          tryThisLabel: 'Ouve a escala maior a partir de D subir de volta a casa, até D',
        },
      ],
      tasks: [
        { instruction: 'Toca a escala de C maior, de C até ao C seguinte, dizendo tom ou meio-tom em cada passo enquanto tocas.' },
        { instruction: 'Escolhe uma nota de partida qualquer e sobe tom, tom, meio-tom, tom, tom, tom, meio-tom. Na guitarra podes fazê-lo numa só corda: 2, 2, 1, 2, 2, 2 e 1 trastos. A nota de cima soa como a casa?' },
      ],
    },
    l1u34m5: {
      title: 'Três notas fazem um acorde',
      subtitle: 'Uma nota sim, outra não, da escala, tocadas ao mesmo tempo',
      objectives: [
        'Construir um acorde com uma nota sim, outra não, de uma escala',
        'Ouvir a diferença entre um acorde maior e um acorde menor',
        'Transformar um acorde maior num menor mudando uma nota',
      ],
      concepts: [
        {
          title: 'Uma nota sim, outra não',
          explanation: 'Um acorde são várias notas tocadas ao mesmo tempo. O acorde mais simples junta três notas de uma escala, saltando uma de cada vez: a 1.ª, a 3.ª e a 5.ª. A partir da escala de C maior, isso dá C, E e G, o acorde de C maior.',
          tryThisLabel: 'Ouve C, E e G juntos: o acorde de C maior',
        },
        {
          title: 'O maior soa luminoso',
          explanation: 'Construído assim sobre a primeira nota de uma escala maior, o acorde é um acorde maior e soa luminoso e estável. G maior é G, B e D; F maior é F, A e C.',
          tryThisLabel: 'Ouve G maior: G, B e D',
        },
        {
          title: 'O menor soa mais escuro',
          explanation: 'Baixa meio-tom a nota do meio de um acorde maior e obténs um acorde menor. C maior é C, E e G; C menor é C, E♭ e G. Só essa nota muda, e o acorde soa mais escuro.',
          tryThisLabel: 'Ouve C menor: C, E♭ e G',
        },
        {
          title: 'Para onde ir a seguir',
          explanation: 'Já consegues ouvir agudo e grave, dar nome às notas, encontrar meios-tons e tons, construir uma escala maior e formar a partir dela acordes maiores e menores. Em Explorar podes escolher qualquer tonalidade e ver a sua escala e os seus acordes no teu instrumento. Para leres estas notas escritas, o Nível 1 começa pela pauta.',
          tryThisLabel: 'Ouve A menor: A, C e E',
        },
      ],
      tasks: [
        { instruction: 'Toca C, E e G juntos; no piano são três teclas brancas, saltando uma tecla branca entre cada uma. Depois baixa o E meio-tom, para E bemol, e ouve o acorde ficar mais escuro.' },
        { instruction: 'Constrói tu um acorde a partir de G: a 1.ª, a 3.ª e a 5.ª notas da escala de G maior, G, B e D. Toca-as juntas, ou uma depois da outra, e depois baixa o B meio-tom para ouvires G menor.' },
      ],
    },
  },
};

export default curriculumL1;
