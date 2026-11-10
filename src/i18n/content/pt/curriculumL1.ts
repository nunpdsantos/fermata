import type { CurriculumLevelOverlay } from '../types';

const curriculumL1: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    // Track "Start with sound" (wave 2)
    u34: {
      title: 'Começa pelo som',
      description: 'Cinco lições curtas, de ouvido e no teu instrumento: agudo e grave, os nomes das notas, meios-tons e tons, a escala maior e os teus primeiros acordes. Não precisas de ler música.',
    },
    // Track "From the chords you know" (wave 2)
    u35: {
      title: 'A partir dos acordes que conheces',
      description: 'Dez lições curtas que partem dos acordes que já tocas: tonalidades, os números de uma grelha de acordes, porque é que os acordes puxam para casa, as sétimas, o capo e as notas para um solo. Não precisas de ler música.',
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
    // ── Track "From the chords you know" (wave 2) ─────────────────────────
    l1u35m1: {
      title: 'Os teus acordes vivem numa tonalidade',
      subtitle: 'G, C, D e Em partilham sete notas: as notas de G maior',
      objectives: [
        'Encontrar as três notas dentro de acordes que já tocas',
        'Ver que G, C, D e Em usam só as sete notas de G maior',
        'Dizer o que é uma tonalidade: uma família de sete notas e os acordes construídos a partir delas',
      ],
      concepts: [
        {
          title: 'Quatro acordes que pertencem uns aos outros',
          explanation: 'Toca G, C, D e Em uns a seguir aos outros, como mudas de acorde numa música. Soam como se pertencessem uns aos outros, e há uma razão para isso. Por muitas cordas que toques, cada um destes acordes é feito de três notas diferentes: G é G, B e D; C é C, E e G; D é D, F♯ e A; Em é E, G e B.',
          tryThisLabel: 'Ouve G, C, D e Em, uns a seguir aos outros',
        },
        {
          title: 'Sete notas entre eles',
          explanation: 'Junta as notas dos quatro acordes e deixa de fora as repetidas: G, A, B, C, D, E e F♯. São sete notas, e são exatamente as notas da escala de G maior. Repara no F♯, que vem do acorde de D: a tonalidade de G tem F♯ onde a tonalidade de C tem F.',
          tryThisLabel: 'Ouve as sete notas de G maior, de G até G',
        },
        {
          title: 'O que é uma tonalidade',
          explanation: 'Uma tonalidade é uma família de sete notas e os acordes construídos a partir delas. Dizer que uma música está na tonalidade de G quer dizer que G soa como a casa e que as notas de G maior são aquelas de que a música é feita. A tonalidade tem o nome da sua nota de casa: a tonalidade de G, ou G maior.',
          tryThisLabel: 'Vê a tonalidade de G: as suas sete notas no teu instrumento',
        },
        {
          title: 'Cada tonalidade tem a sua família',
          explanation: 'Cada tonalidade maior tem as suas sete notas. A tonalidade de C tem C, D, E, F, G, A e B, sem sustenidos nem bemóis, e entre os seus acordes estão C, F, G e Am. A tonalidade de D tem dois sustenidos, F♯ e C♯, e entre os seus acordes estão D, G, A e Bm.',
          tryThisLabel: 'Ouve acordes da tonalidade de C: C, F, G e Am',
        },
      ],
      tasks: [
        { instruction: 'Toca G, C, D e Em, um de cada vez, e diz em voz alta as três notas de cada um: G B D, C E G, D F♯ A, E G B.' },
        { instruction: 'Toca a escala de G maior, de G até G, e depois toca G, C e D. Na guitarra, encontra o F♯ do teu acorde de D: trasto 2 da corda mais fina.' },
      ],
    },
    l1u35m2: {
      title: 'Um, quatro, cinco',
      subtitle: 'Os três acordes maiores de uma tonalidade: I, IV e V',
      objectives: [
        'Numerar as notas de uma tonalidade de 1 a 7',
        'Encontrar os três acordes maiores de uma tonalidade maior: I, IV e V',
        'Ouvir G–C–D em G, C–F–G em C e D–G–A em D como o mesmo movimento',
      ],
      concepts: [
        {
          title: 'Numera as notas',
          explanation: 'Numera as sete notas de uma tonalidade a partir da sua nota de casa. Em G, o G é 1, o A é 2, o B é 3, o C é 4, o D é 5, o E é 6 e o F♯ é 7. O número diz onde fica a nota na sua tonalidade, seja qual for o seu nome.',
          tryThisLabel: 'Ouve as notas de G de 1 a 7, e de novo o 1 lá em cima',
        },
        {
          title: 'Um acorde em cada nota',
          explanation: 'Uma tonalidade tem um acorde em cada uma das suas sete notas, construído com as notas da própria tonalidade. Os acordes têm o nome do seu número, em numerais romanos: I, II, III, IV, V, VI, VII. Numa tonalidade maior, os acordes sobre o 1, o 4 e o 5 são os seus três acordes maiores, escritos em maiúsculas: I, IV e V. Em G são G, C e D.',
          tryThisLabel: 'Ouve I, IV, V e I em G: G, C, D e G',
        },
        {
          title: 'O mesmo movimento em todas as tonalidades',
          explanation: 'Como os números pertencem à tonalidade, I–IV–V–I é o mesmo movimento em qualquer tonalidade; só os nomes mudam. Em C é C, F, G e C; em D, D, G, A e D; em A, A, D, E e A; em E, E, A, B e E.',
          tryThisLabel: 'Ouve I, IV, V e I em C: C, F, G e C',
        },
        {
          title: 'Uma grelha em números',
          explanation: 'Uma grelha de acordes escrita em números serve em todas as tonalidades. I–IV–I–V quer dizer casa, o acorde sobre o 4, de novo a casa, o acorde sobre o 5. Escolhe uma tonalidade, encontra as suas notas 1, 4 e 5, e ficas a saber que acordes tocar.',
          tryThisLabel: 'Ouve I, IV, V e I em D: D, G, A e D',
        },
      ],
      tasks: [
        { instruction: 'Toca I, IV, V e I em G (G, C, D, G) e depois em C (C, F, G, C). O movimento parece o mesmo nas duas tonalidades?' },
        { instruction: 'Escolhe a tonalidade de uma música que tocas. Sobe a sua escala a partir do 1 até às notas 4 e 5 e toca os seus acordes I, IV e V.' },
      ],
    },
    l1u35m3: {
      title: 'Os acordes menores da tonalidade',
      subtitle: 'ii, iii e vi, um acorde diminuto e a relativa menor',
      objectives: [
        'Encontrar os três acordes menores de uma tonalidade maior: ii, iii e vi',
        'Conhecer o acorde diminuto sobre o 7',
        'Ouvir o acorde vi como a casa da tonalidade relativa menor',
      ],
      concepts: [
        {
          title: 'Três acordes menores',
          explanation: 'Numa tonalidade maior, os acordes sobre o 2, o 3 e o 6 são menores. Escrevem-se em numerais romanos minúsculos: ii, iii e vi. Em G são Am, Bm e Em; em C, Dm, Em e Am; em D, Em, F♯m e Bm.',
          tryThisLabel: 'Ouve I, ii, iii e vi em G: G, Am, Bm e Em',
        },
        {
          title: 'O acorde sobre o 7',
          explanation: 'O acorde sobre o 7, construído com as notas da tonalidade, é diminuto: como um acorde menor com a nota de cima meio-tom abaixo, e soa tenso. Escreve-se vii°. Em G é F♯ diminuto, F♯, A e C; em C é B diminuto, B, D e F.',
          tryThisLabel: 'Ouve o vii° de G: F♯, A e C',
        },
        {
          title: 'A família inteira',
          explanation: 'Todas as tonalidades maiores têm o mesmo padrão de sete acordes: I, ii, iii, IV, V, vi e vii°. Maiores sobre o 1, o 4 e o 5; menores sobre o 2, o 3 e o 6; diminuto sobre o 7. Em G: G, Am, Bm, C, D, Em e F♯dim. Em C: C, Dm, Em, F, G, Am e Bdim.',
          tryThisLabel: 'Ouve seis acordes de G: G, Am, Bm, C, D e Em',
        },
        {
          title: 'A relativa menor',
          explanation: 'O acorde Em, o vi de G, é a casa de uma tonalidade sua, a de E menor, que usa as mesmas sete notas que G maior, a começar no E: E, F♯, G, A, B, C e D. Duas tonalidades que partilham as sete notas são relativas: a de E menor é a relativa menor de G maior. A relativa menor de C é A menor, e a de D, B menor. Qual das duas é a tonalidade depende do acorde que soa como a casa.',
          tryThisLabel: 'Ouve as mesmas notas com Em como casa: Em, C, D e Em',
        },
      ],
      tasks: [
        { instruction: 'Toca os acordes de G por ordem, G, Am, Bm, C, D e Em, e ouve quais são os três que soam mais escuros.' },
        { instruction: 'Toca Em, C, D e Em algumas vezes e depois G, C, D e G. As notas são as mesmas: que acorde soa como a casa em cada um?' },
      ],
    },
    l1u35m4: {
      title: 'Casa e longe de casa',
      subtitle: 'Porque é que o V leva de volta ao I, e o caminho mais suave para casa',
      objectives: [
        'Ouvir o I como a casa e o V como um acorde que quer voltar a ele',
        'Encontrar a nota que puxa: a 7.ª nota da tonalidade, meio-tom abaixo da casa',
        'Ouvir o IV a ir para o I como um caminho mais suave para casa',
      ],
      concepts: [
        {
          title: 'Casa',
          explanation: 'O I é a casa. Quando uma sequência de acordes volta ao I, soa assente, como uma escala soa terminada na nota de cima. Se parares a sequência noutro acorde, soa como se ainda faltasse alguma coisa.',
          tryThisLabel: 'Ouve G, C, D e de volta a casa, a G',
        },
        {
          title: 'O V puxa de volta ao I',
          explanation: 'O V é o que puxa com mais força para casa. Em G, o acorde V, D, tem F♯: a 7.ª nota da tonalidade, meio-tom abaixo de G. Uma nota tão perto da casa inclina-se para ela, e o ouvido quer que o F♯ suba para G e que o acorde de D passe para G. Toca D e para: soa por terminar.',
          tryThisLabel: 'Ouve G, depois D a inclinar-se para casa, depois G',
        },
        {
          title: 'O mesmo puxão em todas as tonalidades',
          explanation: 'Em todas as tonalidades maiores, o V tem a 7.ª nota da tonalidade, meio-tom abaixo da casa. Em C, o acorde de G tem B, abaixo de C; em D, o acorde de A tem C♯, abaixo de D; em A, o acorde de E tem G♯, abaixo de A; em E, o acorde de B tem D♯, abaixo de E.',
          tryThisLabel: 'Ouve o B do acorde de G subir para C: C, G e C',
        },
        {
          title: 'Do IV para o I: o caminho mais suave',
          explanation: 'O IV também leva a casa, com mais suavidade. Em G, C vai para G: o acorde de C não tem nenhuma nota meio-tom abaixo de G, por isso nada se inclina para a casa, e o movimento soa calmo em vez de urgente. A partir do V, voltar a casa soa como uma chegada; a partir do IV, como assentar.',
          tryThisLabel: 'Ouve G, C e G: do IV para o I',
        },
      ],
      tasks: [
        { instruction: 'Toca G, C, D e para no D. Espera e depois toca G. A seguir toca G, D, C, para no C e depois toca G. Qual das paragens soou mais por terminar?' },
        { instruction: 'Toca D e depois F♯ e G, uma nota a seguir à outra: na guitarra, trastos 2 e 3 da corda mais fina. Ouve o F♯ inclinar-se para G.' },
      ],
    },
    l1u35m5: {
      title: 'Maior e menor: uma nota',
      subtitle: 'A nota do meio, meio-tom abaixo',
      objectives: [
        'Encontrar a única nota que muda entre um acorde maior e o acorde menor sobre a mesma nota',
        'Mudá-la na guitarra, um trasto abaixo, ou no piano, uma tecla abaixo',
        'Distinguir de ouvido um acorde maior de um menor',
      ],
      concepts: [
        {
          title: 'Uma nota de diferença',
          explanation: 'G maior é G, B e D; G menor é G, B♭ e D. Só a nota do meio muda, e desce meio-tom. O mesmo acontece com todos os acordes maiores e o acorde menor sobre a mesma nota: C e Cm, D e Dm, E e Em, A e Am.',
          tryThisLabel: 'Ouve G e depois Gm',
        },
        {
          title: 'Um trasto abaixo',
          explanation: 'Na guitarra, um meio-tom é um trasto, por isso a corda que toca a nota do meio desce um trasto. De E para Em: a corda G passa do trasto 1 para solta. De A para Am: a corda B passa do trasto 2 para o trasto 1. De D para Dm: a corda mais fina passa do trasto 2 para o trasto 1. Nas formas abertas de G e de C, a nota do meio também está numa corda solta, que não pode descer, por isso Gm e Cm precisam de outras formas. No piano, a nota do meio passa para a tecla imediatamente abaixo.',
          tryThisLabel: 'Ouve E e depois Em: uma nota desce meio-tom',
        },
        {
          title: 'Luminoso e escuro',
          explanation: 'Os acordes maiores soam mais luminosos e os menores mais escuros, e essa única nota é toda a diferença. É também por isso que uma tonalidade tem os dois tipos: em G, o acorde sobre o 1 recebe B como nota do meio e é G maior, enquanto o acorde sobre o 2 recebe C, e não C♯, e é A menor.',
          tryThisLabel: 'Ouve C♯ passar a C: A e depois Am',
        },
      ],
      tasks: [
        { instruction: 'Toca E e depois Em, e repara em que dedo se mexe. Faz o mesmo com A e Am, e com D e Dm.' },
        { instruction: 'Toca G e depois G menor. Na guitarra, experimenta Gm com uma pestana no trasto 3; no piano, desce o B de G maior uma tecla, para B♭.' },
      ],
    },
    l1u35m6: {
      title: 'O que há dentro de um acorde',
      subtitle: '1, 3 e 5: uma nota sim, outra não, a partir da nota do acorde',
      objectives: [
        'Construir um acorde com uma nota sim, outra não, de uma escala: 1, 3 e 5',
        'Dar nome à fundamental, à 3.ª e à 5.ª de um acorde que tocas',
        'Perceber porque é que seis cordas tocam só três notas diferentes',
      ],
      concepts: [
        {
          title: 'Uma nota sim, outra não',
          explanation: 'Começa na nota do acorde e toma uma nota sim, outra não, da sua escala maior: a 1.ª, a 3.ª e a 5.ª. A partir de G: G, salta A, B, salta C, D. Assim, G maior é G, B e D. A partir de C dá C, E e G; a partir de D, D, F♯ e A.',
          tryThisLabel: 'Ouve G, B e D juntos: G maior',
        },
        {
          title: 'Fundamental, terceira e quinta',
          explanation: 'As três notas têm nome. A fundamental, 1, é a nota do próprio acorde e dá-lhe o nome. A terceira, 3, torna-o maior ou menor: é a nota do meio que mudaste na lição anterior. A quinta, 5, é a mais aguda das três quando se empilham a partir da fundamental.',
          tryThisLabel: 'Ouve D maior: D, F♯ e A',
        },
        {
          title: 'Seis cordas, três notas',
          explanation: 'Um acorde de G aberto soa em seis cordas, mas toca só três notas diferentes. A partir da corda mais grossa: G, B, D, G, B e G. O Em aberto é E, B, E, G, B e E. As notas repetem-se noutras oitavas, o que torna o acorde mais cheio; continuam a ser as mesmas três notas.',
          tryThisLabel: 'Ouve Em: E, G e B, por muitas cordas que os toquem',
        },
        {
          title: 'A mesma receita para todos os acordes da tonalidade',
          explanation: 'Uma nota sim, outra não, serve para todos os acordes de uma tonalidade, com as notas da própria tonalidade. Em G, a partir do 2 dá A, C e E, o acorde de A menor; a partir do 7 dá F♯, A e C, o acorde de F♯ diminuto. São as notas da tonalidade que decidem o tipo de cada acorde.',
          tryThisLabel: 'Ouve Am: A, C e E',
        },
      ],
      tasks: [
        { instruction: 'Toca um acorde de G aberto, uma corda de cada vez, a partir da mais grossa, e diz o nome de cada nota: G, B, D, G, B, G.' },
        { instruction: 'Escolhe um acorde maior que conheças e diz a sua fundamental. Conta uma nota sim, outra não, da escala maior dessa fundamental para encontrares a 3.ª e a 5.ª, e toca as três notas uma a seguir à outra.' },
      ],
    },
    l1u35m7: {
      title: 'A sétima',
      subtitle: 'Uma quarta nota por cima: G7 é G, B, D e F',
      objectives: [
        'Construir um acorde de sétima: 1, 3, 5 e uma sétima',
        'Perceber porque é que G7 puxa para C',
        'Tocar os três acordes de um blues de doze compassos: I7, IV7 e V7',
      ],
      concepts: [
        {
          title: 'Uma quarta nota',
          explanation: 'Um acorde de sétima junta uma quarta nota às três: uma sétima acima da fundamental, a sétima letra contando a fundamental como a primeira. G7 é G, B, D e F. O F fica um tom abaixo do G de cima, e é essa a sétima que um simples 7 no nome de um acorde indica.',
          tryThisLabel: 'Ouve G7: G, B, D e F',
        },
        {
          title: 'G7 puxa para C',
          explanation: 'O F não é uma das notas de G maior, mas é uma das notas de C maior: G, B, D e F pertencem todas a C. Em C, G é o acorde V, por isso G7 é o V de C com uma sétima, e puxa para C ainda com mais força do que G: o seu B quer subir para C e o seu F descer para E.',
          tryThisLabel: 'Ouve G7 e depois C',
        },
        {
          title: 'O V7 em cada tonalidade',
          explanation: 'Cada tonalidade tem o seu V7: o acorde sobre o 5 com esta sétima. O acorde sobre o 5 chama-se dominante, por isso um acorde como G7 ou D7 chama-se acorde de sétima da dominante. D7, com D, F♯, A e C, puxa para G. E7, com E, G♯, B e D, puxa para A. B7, com B, D♯, F♯ e A, puxa para E.',
          tryThisLabel: 'Ouve D7 e depois G',
        },
        {
          title: 'O blues de doze compassos',
          explanation: 'O blues de doze compassos é um padrão de doze compassos sobre três acordes, I, IV e V. Num blues, os três tocam-se muitas vezes como acordes de sétima: I7, IV7 e V7. Aqui as sétimas não levam a outra tonalidade; fazem parte do som. Uma forma comum, em G: G7 durante quatro compassos, C7 durante dois, G7 durante dois, e depois D7, C7, G7 e D7, um compasso cada.',
          tryThisLabel: 'Ouve os doze compassos em G, um acorde por compasso',
        },
      ],
      tasks: [
        { instruction: 'Toca G7 e depois C, e a seguir G e depois C. Qual dos dois se inclina mais para C?' },
        { instruction: 'Toca o blues de doze compassos em G, quatro batidas por compasso: G7 durante quatro compassos, C7 durante dois, G7 durante dois, e depois D7, C7, G7 e D7.' },
      ],
    },
    l1u35m8: {
      title: 'Mudar uma música de sítio: outras tonalidades e o capo',
      subtitle: 'Os números ficam, os nomes mudam',
      objectives: [
        'Passar uma sequência de acordes para outra tonalidade pelos seus números',
        'Saber em que tonalidade um capo põe as tuas formas',
        'Tocar a mesma sequência em duas tonalidades',
      ],
      concepts: [
        {
          title: 'Os números ficam',
          explanation: 'Escreve os acordes de uma música em números e podes tocá-la em qualquer tonalidade. I–V–vi–IV é G, D, Em e C em G. Em A é A, E, F♯m e D; em C, C, G, Am e F; em D, D, A, Bm e G.',
          tryThisLabel: 'Ouve I, V, vi e IV em G: G, D, Em e C',
        },
        {
          title: 'Os nomes mudam',
          explanation: 'Para passares uma música de G para A, sobe todos os acordes a mesma distância. De G para A é um tom, por isso D passa a E, Em passa a F♯m e C passa a D. Conta em números ou em trastos: o resultado é o mesmo.',
          tryThisLabel: 'Ouve a mesma sequência em A: A, E, F♯m e D',
        },
        {
          title: 'O que faz um capo',
          explanation: 'Um capo prende as seis cordas num trasto, por isso cada forma que tocas soa mais aguda tantos trastos quantos esse, meio-tom por cada um. Com o capo no trasto 2, a forma de G soa A, a de C soa D, a de D soa E e a de Em soa F♯m. Formas de G com o capo no trasto 2 soam na tonalidade de A.',
          tryThisLabel: 'Ouve as formas de G, C, D e G com o capo no trasto 2: A, D, E e A',
        },
        {
          title: 'Forma e som',
          explanation: 'Com um capo, cada acorde tem dois nomes: a forma que fazes com os dedos e o acorde que soa. A tonalidade é a que soa. Formas de C com o capo no trasto 4 estão na tonalidade de E; formas de D com o capo no trasto 5 estão na tonalidade de G. Uma grelha pode estar escrita de qualquer das maneiras, por isso confirma qual delas usa.',
          tryThisLabel: 'Vê a tonalidade de E: o som das formas de C com o capo no trasto 4',
        },
      ],
      tasks: [
        { instruction: 'Toca G, D, Em e C e depois a mesma sequência em A: A, E, F♯m e D. Na guitarra, F♯m pode ser uma pestana no trasto 2.' },
        { instruction: 'Põe um capo no trasto 2 e toca as tuas formas de G, D, Em e C. Soam A, E, F♯m e D: compara-as com a sequência em A que tocaste sem capo.' },
      ],
    },
    l1u35m9: {
      title: 'Notas para uma melodia ou um solo',
      subtitle: 'As sete notas da tonalidade, e as cinco mais seguras',
      objectives: [
        'Saber que notas combinam com os acordes de uma tonalidade',
        'Tocar a pentatónica maior: cinco notas da tonalidade',
        'Encontrar a pentatónica menor a partir da nota de casa da relativa menor',
      ],
      concepts: [
        {
          title: 'As notas da tonalidade',
          explanation: 'Todos os acordes de uma tonalidade são feitos das suas sete notas, por isso uma melodia ou um solo feito das mesmas notas combina com eles. Em G são G, A, B, C, D, E e F♯. Sustentadas sobre alguns acordes, umas poucas roçam, mas nenhuma está fora da tonalidade.',
          tryThisLabel: 'Ouve as sete notas de G',
        },
        {
          title: 'Cinco notas seguras',
          explanation: 'Deixa de fora as notas 4 e 7 e ficam cinco: 1, 2, 3, 5 e 6. É a escala pentatónica maior; em G, G, A, B, D e E. As notas 4 e 7 estão cada uma a meio-tom de uma nota do acorde I, o C acima do B e o F♯ abaixo do G, a distância a que duas notas mais roçam. Nenhuma das cinco está a meio-tom de outra, o que faz delas a escolha mais segura sobre os acordes da tonalidade.',
          tryThisLabel: 'Ouve a pentatónica maior de G: G, A, B, D e E',
        },
        {
          title: 'As mesmas cinco a partir da relativa menor',
          explanation: 'Toca as mesmas cinco notas a partir de E, a nota de casa da relativa menor de G, e ficam E, G, A, B e D: a pentatónica menor de E. É o mesmo conjunto de notas que a pentatónica maior de G, por isso, sobre os acordes de G maior ou de E menor, os dois nomes dão as mesmas cinco notas.',
          tryThisLabel: 'Ouve a pentatónica menor de E: E, G, A, B e D',
        },
        {
          title: 'Noutras tonalidades',
          explanation: 'Em C, a pentatónica maior é C, D, E, G e A, e a pentatónica menor da sua relativa, A menor, é A, C, D, E e G. Em D é D, E, F♯, A e B, e a pentatónica menor de B é B, D, E, F♯ e A.',
          tryThisLabel: 'Ouve a pentatónica menor de A: A, C, D, E e G',
        },
      ],
      tasks: [
        { instruction: 'Toca a pentatónica maior de G a subir e a descer: G, A, B, D, E e G. Depois toca G, C ou D e responde a cada acorde com uma das cinco notas.' },
        { instruction: 'Toca a pentatónica menor de E: E, G, A, B, D e E. Na guitarra fica nas cordas soltas e nos trastos 2 e 3: corda mais grossa 0 e 3, depois 0 e 2 nas três cordas seguintes, depois 0 e 3 nas duas últimas.' },
      ],
    },
    l1u35m10: {
      title: 'Um acorde de fora',
      subtitle: 'Acordes emprestados, e como saber a tonalidade mesmo assim',
      objectives: [
        'Reconhecer um acorde que não é um dos sete da tonalidade',
        'Chamar ♭VII ao F na tonalidade de G, e II, não ii, a A maior',
        'Saber a tonalidade de uma música pelo seu acorde de casa',
      ],
      concepts: [
        {
          title: 'Nem todos os acordes estão na tonalidade',
          explanation: 'As músicas nem sempre ficam pelos sete acordes da sua tonalidade. Um acorde com uma nota que a tonalidade não tem vem de fora dela; diz-se que é emprestado. Podes reconhecê-lo pelas notas: se uma delas não está na tonalidade, o acorde não é um dos sete da tonalidade.',
          tryThisLabel: 'Ouve uma sequência com um acorde de fora da tonalidade: G, F, C e G',
        },
        {
          title: 'F na tonalidade de G: ♭VII',
          explanation: 'F maior é F, A e C. A tonalidade de G tem F♯, não F, por isso F não é um dos seus acordes. Fica sobre a 7.ª nota da tonalidade baixada meio-tom, F em vez de F♯, e é maior, por isso escreve-se ♭VII. F maior é um dos acordes de G menor, a tonalidade menor com a mesma nota de casa.',
          tryThisLabel: 'Ouve F: F, A e C, com F em vez de F♯',
        },
        {
          title: 'O acorde de A maior em G: II, não ii',
          explanation: 'O ii de G é A menor: A, C e E. O acorde de A maior tem C♯ em vez de C, uma nota que G maior não tem, por isso não é o ii da tonalidade: escreve-se II, em maiúsculas, por ser um acorde maior. O seu C♯ fica meio-tom abaixo de D, por isso A maior inclina-se para D, o V, como o V se inclina para o I.',
          tryThisLabel: 'Ouve A maior inclinar-se para D: G, A, D e G',
        },
        {
          title: 'Saber a tonalidade mesmo assim',
          explanation: 'Um acorde de fora não muda a tonalidade. Procura o acorde a que a música está sempre a voltar e onde repousa, e depois confirma que os outros acordes pertencem a essa tonalidade. G, F, C e G continua em G: G é a casa, e C também pertence a G. A partir daqui, Explorar mostra qualquer tonalidade com os seus acordes, e o Nível 2 vai mais longe nas tonalidades e na forma como os acordes funcionam juntos.',
          tryThisLabel: 'Vê a tonalidade de G e as suas notas no teu instrumento',
        },
      ],
      tasks: [
        { instruction: 'Toca G, F, C e G e depois G, C, D e G. Que sequência tem um acorde de fora da tonalidade de G, e que nota o denuncia?' },
        { instruction: 'Pega numa música que tocas. Encontra o seu acorde de casa, confronta cada acorde com os acordes dessa tonalidade e assinala qualquer acorde de fora com a nota que não está na tonalidade.' },
      ],
    },
  },
};

export default curriculumL1;
