import type { CurriculumLevelOverlay } from '../types';

const curriculumL3: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    u9: {
      title: 'Acordes de Sétima e Harmonia Diatónica',
      description:
        'As cinco qualidades de acordes de sétima, inversões, acordes de sétima diatónicos em maior e menor, e a sétima da dominante como motor harmónico',
    },
    u10: {
      title: 'Condução de Vozes e Escrita a Quatro Partes',
      description:
        'Disposição SATB, regras de espaçamento, quintas e oitavas paralelas proibidas, ligação de acordes com movimento suave de vozes, e o papel das inversões',
    },
    u11: {
      title: 'Cadências, Frases e Ornamentação',
      description:
        'Os seis tipos de cadência, estrutura de frase e período, ritmo harmónico, notas estranhas ao acorde e transposição para qualquer tonalidade',
    },
  },

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: {
    // ── U9 M1: Seventh Chords — Five Qualities ─────────────────────────────
    l3u9m1: {
      title: 'Acordes de Sétima: As Cinco Qualidades',
      subtitle:
        'Constrói e identifica os cinco tipos padrão de acordes de sétima e ouve os seus caracteres distintos',
      objectives: [
        'Construir e identificar as cinco qualidades padrão de acordes de sétima pela estrutura e pelo som',
        'Compreender os acordes de sétima como tríades com uma sétima acrescentada acima da fundamental',
        'Ouvir o carácter distinto de cada qualidade — do caloroso ao desesperadamente tenso',
      ],
      concepts: [
        {
          title: 'O Que É um Acorde de Sétima?',
          explanation:
            'Um acorde de sétima acrescenta uma quarta nota — uma sétima acima da fundamental — a uma tríade. Quatro notas em vez de três. Esta nota extra introduz uma cor mais rica e uma tensão harmónica maior do que qualquer tríade consegue produzir. Os acordes de sétima são a espinha dorsal harmónica do jazz, do pop e da música clássica do Romantismo, e compreendê-los abre uma dimensão inteiramente nova do vocabulário de acordes.',
          tryThisLabel: 'Ouve Cmaj7 — caloroso, luxuriante, jazzy',
        },
        {
          title: 'As Cinco Qualidades Padrão',
          explanation:
            'Sétima maior (Cmaj7): 3.aM+3.am+3.aM — caloroso e luxuriante. Sétima da dominante (C7): 3.aM+3.am+3.am — tenso e exigindo resolução. Sétima menor (Cm7): 3.am+3.aM+3.am — suave e macio. Meio-diminuto (Cm7b5): 3.am+3.am+3.aM — sombrio e ansiante. Totalmente diminuto (Cdim7): 3.am+3.am+3.am — extremamente tenso, com estrutura simétrica em que cada nota está a uma 3.a menor de distância. Uma sexta qualidade, a sétima menor-maior (CmMaj7: 3.am+3.aM+3.aM), combina uma tríade menor com uma sétima maior — rara mas inquietantemente perturbadora, usada no cinema e no jazz.',
          tryThisLabel: 'Ouve C7 — a sétima da dominante exige resolução',
        },
        {
          title: 'Comparar as Cores dos Acordes de Sétima',
          explanation:
            'A diferença entre Cmaj7 e C7 é um único meio-tom: Si natural contra Sib. Essa única nota transforma uma sonoridade luxuriante e estável num acorde a rebentar de tensão. Da mesma forma, Cm7 e Cm7b5 diferem apenas na quinta (Sol contra Solb), mas a qualidade meio-diminuta é muito mais sombria e inquieta. Treinar o ouvido para estas distinções subtis é o alicerce da escuta harmónica avançada.',
          tryThisLabel: 'Ouve Cm7 — suave e macio',
        },
      ],
      tasks: [
        {
          instruction:
            "Constrói os cinco acordes de sétima sobre Dó em sequência: 'Cmaj7', 'C7', 'Cm7', 'Cm7b5', 'Cdim7'. Ouve atentamente como cada qualidade altera o carácter emocional do acorde",
        },
        {
          instruction:
            "Compara 'Cmaj7' e 'C7' lado a lado — a única diferença é Si contra Sib. Ouve como um meio-tom transforma calor em tensão",
        },
        {
          instruction:
            "Toca 'Cdim7' — as quatro notas estão exatamente a 3 meios-tons de distância entre si. Esta simetria significa que existem apenas três acordes de sétima diminuta distintos em toda a escala cromática. Consegues descobrir quais são?",
        },
      ],
    },

    // ── U9 M2: Seventh Chord Inversions ─────────────────────────────────────
    l3u9m2: {
      title: 'Inversões de Acordes de Sétima',
      subtitle:
        'Quatro posições para cada acorde de sétima — do estado fundamental à terceira inversão',
      objectives: [
        'Identificar e construir as quatro inversões de qualquer acorde de sétima',
        'Usar as cifras de baixo cifrado (7, 6/5, 4/3, 4/2) para nomear as inversões',
        'Ouvir como cada inversão altera a nota do baixo e o peso do acorde',
      ],
      concepts: [
        {
          title: 'Quatro Posições',
          explanation:
            'Como um acorde de sétima tem quatro notas, tem quatro notas possíveis no baixo e, portanto, quatro inversões. O estado fundamental (baixo cifrado: 7) coloca a fundamental no baixo — a disposição mais estável e mais comum. A primeira inversão (6/5) coloca a terceira no baixo, criando uma sonoridade mais leve. A segunda inversão (4/3) coloca a quinta no baixo. A terceira inversão (4/2 ou simplesmente 2) coloca a sétima no baixo — a posição mais instável, que exige fortemente a resolução descendente da nota do baixo.',
          tryThisLabel: 'Ouve Cmaj7 em estado fundamental — fundamental no baixo',
        },
        {
          title: 'Baixo Cifrado para Acordes de Sétima',
          explanation:
            'As cifras de baixo cifrado descrevem os intervalos acima da nota do baixo. Estado fundamental 7: intervalos de 7.a, 5.a e 3.a acima do baixo. Primeira inversão 6/5: intervalos de 6.a, 5.a e 3.a acima do baixo. Segunda inversão 4/3: intervalos de 6.a, 4.a e 3.a acima do baixo. Terceira inversão 4/2: intervalos de 6.a, 4.a e 2.a acima do baixo. Estas cifras abreviadas indicam ao intérprete tanto o acorde como a sua disposição de imediato.',
          tryThisLabel: 'Ouve Cmaj7 na primeira inversão (6/5) — Mi no baixo',
        },
        {
          title: 'Terceira Inversão e Resolução do Baixo',
          explanation:
            'A terceira inversão (4/2) é a posição mais instável do acorde de sétima porque a sétima do acorde está no baixo. A sétima é uma dissonância que deve resolver por grau descendente. Na prática, um V4/2 resolve para I6 — o baixo desce meio-tom (Fá para Mi em Dó maior) enquanto o resto do acorde resolve normalmente. Este baixo com resolução descendente dá à terceira inversão a sua urgência e impulso característicos.',
          tryThisLabel:
            'Ouve Cmaj7 na terceira inversão (4/2) — a sétima no baixo',
        },
      ],
      tasks: [
        {
          instruction:
            "Toca 'Cmaj7' em estado fundamental, depois 'Cmaj7/E' (primeira inversão), 'Cmaj7/G' (segunda inversão) e 'Cmaj7/B' (terceira inversão). As mesmas quatro notas — ouve como a nota do baixo altera completamente o carácter do acorde",
        },
        {
          instruction:
            "Compara 'G7' (estado fundamental, V7 em Dó) com 'G7/F' (terceira inversão, V4/2). Na terceira inversão, a sétima (Fá) está no baixo e exige resolver descendo para Mi — fazendo com que V4/2 resolva naturalmente para I6",
        },
        {
          instruction:
            "Constrói 'Dm7/C' — Dm7 na terceira inversão. A sétima do acorde (Dó) está no baixo. Na tonalidade de Dó maior, este é o ii4/2, frequentemente usado antes de V6/5 numa descida suave do baixo: Dó-Si (ii4/2 para V6/5)",
        },
      ],
    },

    // ── U9 M3: Diatonic Seventh Chords in Major ────────────────────────────
    l3u9m3: {
      title: 'Acordes de Sétima Diatónicos em Maior',
      subtitle:
        'Acordes de sétima em cada grau da escala maior e a sétima da dominante como motor harmónico',
      objectives: [
        'Construir acordes de sétima em cada grau da escala maior e identificar cada qualidade',
        'Compreender a sétima da dominante (V7) e o seu trítono como motor da resolução tonal',
        'Reconhecer a progressão ii-V-I como o movimento de acordes mais comum na música ocidental',
      ],
      concepts: [
        {
          title: 'Acordes de Sétima Diatónicos em Maior',
          explanation:
            'Empilha uma sétima em cada grau da escala maior usando apenas notas dessa tonalidade. O padrão de qualidades é sempre o mesmo: Imaj7, ii7, iii7, IVmaj7, V7, vi7, vii\u00f87. Em Dó maior: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5. A sétima da dominante (V7) é o único acorde de sétima com qualidade de dominante que ocorre naturalmente, e o meio-diminuto vii\u00f87 funciona como substituto da dominante.',
          tryThisLabel: 'Vê todos os acordes diatónicos em Dó maior',
        },
        {
          title: 'A Sétima da Dominante e o Seu Trítono',
          explanation:
            'O V7 é o acorde de sétima estruturalmente mais importante na música tonal. Em Dó maior, G7 contém as notas Sol-Si-Ré-Fá. O trítono entre Si e Fá é a fonte da sua tensão: Si (a sensível) puxa para cima, para Dó, enquanto Fá (a sétima do acorde) puxa para baixo, para Mi. Esta dupla resolução — para fora, em movimento contrário — é o motor fundamental que impulsiona a harmonia tonal em direção à tónica.',
          tryThisLabel:
            'Ouve o trítono dentro de G7 — Si e Fá exigem resolução',
        },
        {
          title: 'A Progressão ii-V-I',
          explanation:
            'A progressão de acordes mais comum na música ocidental encadeia o ii7 pré-dominante com o V7 dominante e o Imaj7 tónica. Em Dó maior: Dm7-G7-Cmaj7. Cada acorde partilha notas comuns com o seguinte, produzindo uma condução de vozes suave. O ii7 estabelece tensão subdominante, o V7 intensifica-a com o trítono, e o Imaj7 resolve tudo. Este esqueleto de três acordes sustenta tudo, desde corais de Bach até standards de jazz.',
          tryThisLabel: 'Ouve Dm7 — o som do ii7 em Dó maior',
        },
      ],
      tasks: [
        {
          instruction:
            "Abre 'key of C' e identifica a qualidade do acorde de sétima em cada grau: I é sétima maior, ii é sétima menor, V é sétima da dominante. Verifica que o padrão completo corresponde a Imaj7-ii7-iii7-IVmaj7-V7-vi7-vii\u00f87",
        },
        {
          instruction:
            "Toca 'G7' e depois 'Cmaj7' — ouve como a sétima da dominante resolve para a tónica. O trítono Si-Fá abre-se para Dó-Mi. Esta é a resolução V-I que define a harmonia ocidental",
        },
        {
          instruction:
            "Toca 'Dm7' e depois 'G7' — a progressão ii-V é o movimento de dois acordes mais comum em toda a música ocidental. Combina função pré-dominante (ii) com função dominante (V) para criar o máximo impulso em direção à tónica",
        },
      ],
    },

    // ── U9 M4: Diatonic Seventh Chords in Minor ────────────────────────────
    l3u9m4: {
      title: 'Acordes de Sétima Diatónicos em Menor',
      subtitle:
        'O panorama de acordes de sétima da menor harmónica — do inquietante i(m\u03947) ao explosivo viio7',
      objectives: [
        'Construir acordes de sétima em cada grau da escala menor harmónica',
        'Identificar as qualidades distintas criadas pelo sétimo grau elevado',
        'Compreender o papel de V7, viio7 e ii\u00f87 como acordes de função dominante em menor',
      ],
      concepts: [
        {
          title: 'A Menor Harmónica Muda Tudo',
          explanation:
            'A escala menor harmónica eleva o sétimo grau, criando qualidades de acordes de sétima dramaticamente diferentes em comparação com o modo maior. No 1.o grau, a tríade menor ganha uma sétima maior, produzindo o raro acorde menor com sétima maior: i(m\u03947). No 3.o grau, o sétimo grau elevado transforma a tríade maior numa tríade aumentada com sétima maior: III+maj7. Estas qualidades exóticas dão às tonalidades menores a sua tensão e escuridão características.',
          tryThisLabel:
            'Vê Lá menor harmónica — a escala-fonte dos acordes de sétima em menor',
        },
        {
          title: 'O Padrão Completo de Acordes de Sétima Diatónicos em Menor',
          explanation:
            'Em Lá menor harmónica, os acordes de sétima em cada grau são: i(m\u03947) em Lá (Lá-Dó-Mi-Sol#), ii\u00f87 em Si (Si-Ré-Fá-Lá), III+maj7 em Dó (Dó-Mi-Sol#-Si), iv7 em Ré (Ré-Fá-Lá-Dó), V7 em Mi (Mi-Sol#-Si-Ré), VImaj7 em Fá (Fá-Lá-Dó-Mi), viio7 em Sol# (Sol#-Si-Ré-Fá). Os acordes críticos são V7 (função dominante, igual ao maior), viio7 (totalmente diminuto, dominante intensificada) e ii\u00f87 (a sonoridade pré-dominante característica em menor).',
          tryThisLabel: 'Ouve Bm7b5 — o acorde ii\u00f87 em Lá menor',
        },
        {
          title: 'A Progressão ii\u00f87-V7-i em Menor',
          explanation:
            'A contraparte em menor do ii-V-I maior: ii\u00f87-V7-i. Em Lá menor: Bm7b5-E7-Am. O ii\u00f87 meio-diminuto tem uma qualidade mais sombria e inquieta do que o ii7 de sétima menor das tonalidades maiores. Combinado com V7 (que contém a sensível elevada Sol#), esta progressão impulsiona-se em direção à tónica menor com uma intensidade que a versão em maior não consegue igualar. O viio7 pode substituir o V7, acrescentando ainda mais tensão.',
          tryThisLabel:
            'Ouve E7 — o V7 em Lá menor com a sensível elevada Sol#',
        },
      ],
      tasks: [
        {
          instruction:
            "Abre 'A harmonic minor scale' e constrói um acorde de sétima em cada grau. Compara o padrão com Lá maior — repara como o Sol# elevado altera a qualidade dos acordes nos graus i, III, V e vii",
        },
        {
          instruction:
            "Toca 'Bm7b5' e depois 'E7' e depois 'Am' — esta é a progressão ii\u00f87-V7-i em Lá menor. A qualidade meio-diminuta do ii\u00f87 dá a esta progressão um carácter mais sombrio e urgente do que o ii-V-I em maior",
        },
        {
          instruction:
            "Toca 'G#dim7' — o viio7 em Lá menor harmónica. Tal como Cdim7, é totalmente diminuto com intervalos de 3.a menor entre todas as notas. Funciona como uma dominante intensificada que pode substituir o V7 em tonalidades menores",
        },
      ],
    },

    // ── U10 M1: Voice Leading — SATB Basics ────────────────────────────────
    l3u10m1: {
      title: 'Condução de Vozes — Noções Básicas de SATB',
      subtitle: 'Disposição SATB, tessituras, regras de espaçamento e convenções de dobragem',
      objectives: [
        'Compreender a disposição SATB com tessituras, espaçamentos e dobragens corretos',
        'Aplicar regras de dobragem com base na posição e função do acorde',
        'Reconhecer erros de cruzamento e sobreposição de vozes',
      ],
      concepts: [
        {
          title: 'SATB — As Quatro Vozes',
          explanation:
            'A harmonia tradicional distribui as notas por quatro vozes com tessituras definidas: Soprano (Dó4-Sol5), Contralto (Fá3-Dó5), Tenor (Dó3-Sol4), Baixo (Mi2-Dó4). O soprano conduz a melodia e o baixo define o alicerce harmónico. As vozes superiores adjacentes devem manter-se a menos de uma oitava entre si, embora o intervalo entre tenor e baixo possa exceder uma oitava. As vozes nunca devem cruzar-se — o soprano fica acima do contralto, o contralto acima do tenor.',
          tryThisLabel: 'Vê as notas de Dó maior — imagina distribuí-las por quatro vozes',
        },
        {
          title: 'Regras de Dobragem e Espaçamento',
          explanation:
            'Quando quatro vozes tocam uma tríade de três notas, uma nota tem de ser dobrada. Em estado fundamental, dobra a fundamental — é a escolha mais forte e estável. Na primeira inversão, dobra a nota do soprano para flexibilidade. Nunca dobres a sensível: esta tem uma resolução obrigatória para a tónica, e dobrá-la cria oitavas paralelas inevitáveis. Em tríades diminutas, dobra a terceira (a nota mais estável num acorde instável).',
          tryThisLabel: 'Vê Bdim — em SATB, dobra a terceira (Ré), nunca a fundamental',
        },
        {
          title: 'Sobreposição de Vozes',
          explanation:
            'A sobreposição de vozes é um erro mais subtil do que o cruzamento: ocorre quando uma voz ultrapassa a posição onde a voz adjacente estava no tempo anterior. Por exemplo, se o contralto estava em Ré4 no tempo 1, o soprano não pode descer abaixo de Ré4 no tempo 2, mesmo que o contralto também tenha descido. A sobreposição obscurece a identidade das vozes tal como o cruzamento, tornando as linhas mais difíceis de seguir como melodias independentes.',
          tryThisLabel: 'Vê Fá maior — pratica imaginar disposições SATB no papel',
        },
      ],
      tasks: [
        {
          instruction:
            'No papel, escreve uma tríade de Dó maior em SATB: Baixo Dó2, Tenor Sol3, Contralto Mi4, Soprano Dó5. Verifica todas as regras de espaçamento: intervalo soprano-contralto (6.a menor — inferior a uma oitava), contralto-tenor (6.a maior — inferior a uma oitava), tenor-baixo (12.a perfeita — entre tenor e baixo pode exceder a oitava). Tudo válido.',
        },
        {
          instruction:
            'Explica por que motivo dobrar a sensível (Si em Dó maior) é proibido: ambas as notas Si devem resolver para Dó, produzindo oitavas paralelas — um dos erros mais graves de condução de vozes',
        },
        {
          instruction:
            'Escreve uma tríade de Fá maior em SATB com dobragem correta: dobra a fundamental Fá. Depois escreve uma tríade de viio (Bdim) — aqui dobra a terceira (Ré), não a fundamental, porque Si é a sensível e a fundamental de um acorde diminuto é instável',
        },
      ],
    },

    // ── U10 M2: Forbidden Parallels and Voice Motion ────────────────────────
    l3u10m2: {
      title: 'Quintas e Oitavas Paralelas Proibidas e Movimento de Vozes',
      subtitle:
        'Os quatro tipos de movimento e as regras de quintas/oitavas paralelas que governam a escrita a partes',
      objectives: [
        'Identificar os quatro tipos de movimento de vozes: contrário, oblíquo, direto, paralelo',
        'Reconhecer e evitar quintas e oitavas paralelas proibidas',
        'Compreender quintas e oitavas diretas (ocultas) e quando são aceitáveis',
      ],
      concepts: [
        {
          title: 'Quatro Tipos de Movimento de Vozes',
          explanation:
            'Entre quaisquer duas vozes que se movem de um acorde para o seguinte: o movimento contrário (direções opostas) produz a maior independência e é sempre a escolha mais segura. O movimento oblíquo (uma mantém-se, a outra move-se) é suave e discreto. O movimento direto (mesma direção, intervalos diferentes) é aceitável mas requer vigilância. O movimento paralelo (mesma direção, mesmo intervalo) é o mais restringido — certos intervalos paralelos são proibidos porque destroem a independência das vozes.',
          tryThisLabel: 'Vê Dó maior — o acorde de partida para exercícios de movimento de vozes',
        },
        {
          title: 'Quintas e Oitavas Paralelas',
          explanation:
            'Quintas paralelas ocorrem quando duas vozes a uma quinta perfeita de distância se movem ambas pelo mesmo intervalo para outra quinta perfeita. Oitavas paralelas são o mesmo à oitava. Ambas são proibidas na harmonia de prática comum porque as vozes fundem-se acusticamente — deixam de soar como linhas melódicas independentes e colapsam numa única linha reforçada. Terceiras e sextas paralelas, pelo contrário, são encorajadas porque as consonâncias imperfeitas mantêm a independência das vozes.',
          tryThisLabel: 'Vê Sol maior — pratica mover de Dó para Sol e verifica se há paralelas',
        },
        {
          title: 'Quintas e Oitavas Diretas (Ocultas)',
          explanation:
            'Quintas e oitavas diretas ocorrem quando duas vozes se movem em direção semelhante (mesma direção mas intervalos diferentes) para uma quinta perfeita ou oitava. São menos graves do que as paralelas mas ainda restringidas, especialmente entre as vozes extremas (soprano e baixo). A exceção padrão: quintas ou oitavas diretas são aceitáveis se o soprano se move por grau conjunto, porque o movimento por grau do soprano mascara o efeito. Nas vozes interiores, intervalos diretos são geralmente tolerados.',
          tryThisLabel: 'Vê Fá maior — imagina o soprano e o baixo a moverem-se para uma quinta',
        },
      ],
      tasks: [
        {
          instruction:
            'Dados dois acordes, Dó maior (Dó-Mi-Sol) movendo para Fá maior (Fá-Lá-Dó), identifica o tipo de movimento entre cada par de vozes. Se o baixo desce de Dó para Fá enquanto o soprano sobe de Sol para Lá, isso é movimento contrário — o tipo mais forte e desejável',
        },
        {
          instruction:
            'Identifica as quintas paralelas nesta progressão: soprano Sol-Lá, baixo Dó-Ré. No primeiro acorde, o intervalo é uma quinta perfeita (Dó a Sol). No segundo acorde, o intervalo continua a ser uma quinta perfeita (Ré a Lá). Ambas as vozes subiram por grau — quintas paralelas. Proibido.',
        },
        {
          instruction:
            'Escreve Dó maior para Sol maior em SATB onde o baixo sobe de Dó para Sol (uma quinta) e o soprano desce de Mi para Ré (um grau). Classifica o tipo de movimento de cada par de vozes. Verifica que não existem quintas nem oitavas paralelas',
        },
      ],
    },

    // ── U10 M3: Root Position Part Writing ──────────────────────────────────
    l3u10m3: {
      title: 'Escrita a Partes em Estado Fundamental',
      subtitle:
        'Ligar tríades em estado fundamental com condução de vozes suave conforme o tipo de movimento da fundamental',
      objectives: [
        'Ligar tríades em estado fundamental seguindo as regras de condução de vozes',
        'Aplicar estratégias diferentes conforme as fundamentais se movem por quinta, terceira ou segunda',
        'Escrever vozes interiores suaves mantendo dobragem correta e evitando paralelas',
      ],
      concepts: [
        {
          title: 'O Objetivo da Escrita a Partes',
          explanation:
            'A escrita a partes produz quatro linhas melódicas independentes que, em conjunto, criam harmonia correta. Cada voz deve ser individualmente cantável. O baixo define o acorde. O soprano conduz a melodia. Contralto e tenor preenchem a harmonia. O desafio é mover todas as quatro vozes suavemente de acorde para acorde, obedecendo simultaneamente às regras de espaçamento, dobragem e movimento de vozes.',
          tryThisLabel: 'Vê Dó maior — o acorde que vais dispor a quatro partes',
        },
        {
          title: 'Movimento da Fundamental por Quinta — Mantém a Nota Comum',
          explanation:
            'Quando as fundamentais dos acordes distam uma quinta (I-V, I-IV, ii-V), existe uma nota comum entre os dois acordes. Mantém essa nota comum na mesma voz e move as outras duas vozes superiores para as notas do acorde mais próximas. Este é o movimento de fundamental mais comum na música tonal e produz consistentemente a condução de vozes mais suave e económica.',
          tryThisLabel: 'Vê Sol maior — I para V partilham a nota comum Sol',
        },
        {
          title: 'Movimento da Fundamental por Terceira e por Segunda',
          explanation:
            'Fundamentais a uma terceira de distância (I-vi, I-iii, IV-ii) partilham duas notas comuns — mantém ambas nas mesmas vozes e move apenas a voz restante. Fundamentais a uma segunda de distância (IV-V, V-vi, I-ii) não partilham nenhuma nota comum — as três vozes superiores têm de se mover. Para movimento do baixo por grau, move todas as vozes superiores em movimento contrário ao baixo para prevenir as quintas e oitavas paralelas que facilmente surgem.',
          tryThisLabel: 'Vê Lá menor — I para vi partilham duas notas comuns (Dó e Mi)',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve I-V-I em Dó maior em SATB no papel. Entre I e V, a nota comum é Sol — mantém-na na mesma voz. Entre V e I, mantém Sol novamente. Move as vozes restantes para as notas do acorde mais próximas',
        },
        {
          instruction:
            'Escreve IV-V em Dó maior. As fundamentais Fá e Sol estão a uma segunda de distância — zero notas comuns. Move todas as vozes superiores em movimento contrário ao baixo (o baixo sobe de Fá para Sol, as vozes superiores descem). Verifica cada par de vozes para quintas e oitavas paralelas',
        },
        {
          instruction:
            'Escreve I-vi em Dó maior. As fundamentais Dó e Lá estão a uma terceira de distância — duas notas comuns (Dó e Mi). Mantém ambas nas mesmas vozes e move apenas a voz restante de Sol para Lá. Isto produz a condução de vozes mais suave possível com movimento mínimo',
        },
      ],
    },

    // ── U10 M4: Triads in Inversion ─────────────────────────────────────────
    l3u10m4: {
      title: 'Tríades em Inversão',
      subtitle:
        'Quando e porquê usar tríades invertidas — incluindo a restrita segunda inversão',
      objectives: [
        'Compreender quando e porquê usar tríades na primeira inversão (6/3) para linhas de baixo mais suaves',
        'Conhecer os quatro usos sancionados de tríades na segunda inversão (6/4)',
        'Aplicar regras de dobragem adequadas para tríades invertidas',
      ],
      concepts: [
        {
          title: 'Primeira Inversão — Versátil e Suave',
          explanation:
            'A primeira inversão coloca a terceira no baixo, criando uma versão mais leve e menos enfática do acorde. O seu propósito principal é criar uma linha de baixo suave, por grau — a razão mais comum pela qual os compositores invertem tríades. Qualquer tríade em estado fundamental pode ser colocada na primeira inversão para variedade. Dobra a nota do soprano; evita dobrar o baixo se este for a sensível ou uma nota com tendência de resolução.',
          tryThisLabel: 'Ouve Dó maior na primeira inversão — Mi no baixo',
        },
        {
          title: 'Segunda Inversão — Uso Restrito',
          explanation:
            'A segunda inversão coloca a quinta no baixo, criando um intervalo de quarta perfeita acima do baixo — historicamente tratada como dissonância. Na harmonia de prática comum, as tríades na segunda inversão não são usadas livremente. Existem quatro padrões sancionados: o 6/4 cadencial (I6/4 a decorar o V numa cadência), o 6/4 de passagem (baixo por grau entre inversões), o 6/4 de pedal (vozes superiores movem-se sobre um baixo sustentado), e o 6/4 arpejado em figuras de acompanhamento.',
          tryThisLabel: 'Ouve Dó maior na segunda inversão — Sol no baixo',
        },
        {
          title: 'O 6/4 Cadencial',
          explanation:
            'O padrão mais importante de segunda inversão: I6/4 a resolver para V numa cadência. A 6.a e a 4.a acima do baixo funcionam como duplas apogiaturas que resolvem por grau descendente para a 5.a e a 3.a do V. Muitos teóricos analisam este acorde não como um acorde de tónica mas como uma dominante decorada — V com suspensões. Esta distinção importa: o 6/4 cadencial funciona como dominante, não como tónica, apesar da sua escrita.',
          tryThisLabel:
            'Ouve Fá na primeira inversão — bloco de construção de linhas de baixo suaves',
        },
      ],
      tasks: [
        {
          instruction:
            "Toca 'C/E' e depois 'C/G' — as mesmas três notas, nota de baixo diferente. A primeira inversão soa mais leve e suave; a segunda inversão soa instável e quer resolver para baixo",
        },
        {
          instruction:
            "Toca 'C/G' e depois 'G7' — isto demonstra o padrão do 6/4 cadencial. O C/G funciona como uma decoração da dominante, não como um verdadeiro acorde de tónica. Ouve como flui naturalmente para G7",
        },
        {
          instruction:
            "Toca 'F/A' — Fá maior na primeira inversão. A nota de baixo Lá cria uma ligação suave por grau de Sol (um acorde dominante) passando por Lá até Sib, possibilitando uma linha de baixo por grau que acordes em estado fundamental não conseguem alcançar",
        },
      ],
    },

    // ── U11 M1: Cadences ────────────────────────────────────────────────────
    l3u11m1: {
      title: 'Cadências: O Conjunto Completo',
      subtitle:
        'Os seis tipos de cadência padrão — a pontuação harmónica que dá forma às frases musicais',
      objectives: [
        'Identificar e ouvir os seis tipos de cadência padrão',
        'Compreender as cadências como pontuação harmónica que define os limites das frases',
        'Distinguir cadências fortes (perfeita) de fracas (suspensiva, imperfeita) e resoluções interrompidas',
      ],
      concepts: [
        {
          title: 'Cadências Autênticas — Perfeita e Imperfeita',
          explanation:
            'A cadência perfeita (CAP) é V(7) para I, ambos em estado fundamental, com o soprano a terminar no 1.o grau da escala. É a chegada harmónica mais forte — um ponto final. A cadência imperfeita (CAI) também faz V para I mas enfraquece o fecho: um dos acordes pode estar invertido, ou o soprano termina na 3.a ou 5.a do I em vez da fundamental. Uma CAI funciona como uma vírgula em vez de um ponto final.',
          tryThisLabel:
            'Ouve V7 em Dó maior — o ponto de partida das cadências autênticas',
        },
        {
          title: 'Cadências Suspensiva, Plagal e Interrompida',
          explanation:
            'A cadência suspensiva termina no V — qualquer acorde que se move para a dominante. Soa como uma pergunta sem resposta, criando suspense nos limites das frases. A cadência plagal (IV para I) é a suave cadência do "Ámen", mais leve do que a autêntica. A cadência interrompida (V para vi) subverte a resolução esperada: vi partilha duas notas com I (em Dó maior, Lá menor partilha Dó e Mi com o acorde de Dó), produzindo um quase-acerto que surpreende o ouvinte e prolonga a frase.',
          tryThisLabel:
            'Ouve a tónica — o destino das cadências autênticas e plagais',
        },
        {
          title: 'A Cadência Suspensiva Frígia',
          explanation:
            'Exclusiva das tonalidades menores: iv6 a resolver para V, com o baixo a descer por meio-tom do b6.o grau para o 5.o. Esta descida de meio-tom no baixo dá à cadência o seu nome — assemelha-se ao meio-tom descendente característico do modo frígio. Comum na música barroca, a cadência suspensiva frígia tem uma qualidade sombria e arcaica que nenhuma outra cadência replica.',
          tryThisLabel:
            'Ouve vi — o alvo de resolução surpresa de uma cadência interrompida',
        },
      ],
      tasks: [
        {
          instruction:
            "Toca 'G7' e depois 'C major chord' — esta é uma cadência perfeita (V7-I) em Dó maior. A conclusão harmónica mais forte possível. Ouve o sentido completo de resolução",
        },
        {
          instruction:
            "Toca 'G7' e depois 'Am' — esta é uma cadência interrompida (V7-vi). Esperavas Dó maior mas obtiveste Lá menor. Repara como prolonga a frase em vez de a concluir",
        },
        {
          instruction:
            "Toca 'F major chord' e depois 'C major chord' — esta é uma cadência plagal (IV-I). Mais suave e devocional do que a cadência autêntica. Frequentemente ouvida como um 'Ámen' final depois da verdadeira cadência",
        },
      ],
    },

    // ── U11 M2: Phrases and Periods ─────────────────────────────────────────
    l3u11m2: {
      title: 'Frases e Períodos',
      subtitle:
        'Frases musicais, pares antecedente-consequente e a estrutura de frase (Satz)',
      objectives: [
        'Ouvir uma frase como uma unidade musical com início, meio e cadência',
        'Compreender o período como antecedente (pergunta) emparelhado com consequente (resposta)',
        'Distinguir períodos paralelos, períodos contrastantes e a estrutura de frase (Satz)',
      ],
      concepts: [
        {
          title: 'A Frase Musical',
          explanation:
            'A frase é a unidade fundamental da forma musical — tipicamente com 4 ou 8 compassos. Tem um início que estabelece a tonalidade, um meio que desenvolve o movimento harmónico e um fim marcado por uma cadência. Cada cadência assinala um limite de frase. Pensa numa frase como um pensamento musical completo, comparável a uma frase na linguagem falada — faz uma afirmação autocontida.',
          tryThisLabel: 'Vê a tonalidade de Dó — a maioria das frases começa e termina numa única tonalidade',
        },
        {
          title: 'Períodos: Antecedente e Consequente',
          explanation:
            'Um período emparelha duas frases numa estrutura de pergunta-e-resposta. O antecedente (primeira frase) termina com uma cadência fraca — normalmente suspensiva ou imperfeita — colocando uma pergunta musical. O consequente (segunda frase) termina com uma cadência forte — normalmente perfeita — fornecendo a resposta. Num período paralelo, ambas as frases partilham material de abertura semelhante. Num período contrastante, as aberturas diferem. Um período duplo agrupa quatro frases em dois pares antecedente-consequente maiores.',
          tryThisLabel: 'Ouve V — o acorde que termina uma frase antecedente (cadência suspensiva)',
        },
        {
          title: 'A Frase (Satz)',
          explanation:
            'Uma estrutura alternativa de 8 compassos comum na música clássica: uma ideia básica de 2 compassos é apresentada, depois repetida (frequentemente variada) nos compassos 3-4, seguida de uma continuação de 2 compassos que fragmenta a ideia e ganha impulso, concluindo com um gesto cadencial de 2 compassos. A frase cria impulso para a frente através de repetição, fragmentação e aceleração rítmica — uma arquitetura fundamentalmente diferente do período equilibrado.',
          tryThisLabel: 'Ouve I — a tónica que ancora tanto a frase como o período',
        },
      ],
      tasks: [
        {
          instruction:
            'Ouve qualquer melodia conhecida e identifica onde cada frase termina — cada ponto de repouso ou momento de chegada marca uma cadência e um limite de frase. Conta os compassos entre cadências',
        },
        {
          instruction:
            'Pensa num período paralelo como uma pergunta e resposta que começam da mesma forma mas terminam de maneira diferente. O antecedente pergunta (terminando com cadência suspensiva) e o consequente responde (terminando com uma CAP)',
        },
        {
          instruction:
            'Identifica a estrutura de frase numa melodia clássica: encontra a ideia básica de 2 compassos, a sua repetição, a fragmentação que se segue e a cadência final. Mozart e Beethoven usam esta forma constantemente',
        },
      ],
    },

    // ── U11 M3: Harmonic Rhythm ─────────────────────────────────────────────
    l3u11m3: {
      title: 'Ritmo Harmónico',
      subtitle:
        'Como a velocidade de mudança de acordes molda o impulso musical e a estrutura de frase',
      objectives: [
        'Definir ritmo harmónico como a velocidade de mudança de acordes, independente do ritmo melódico',
        'Ouvir como o ritmo harmónico interage com o metro — tempos fortes contra tempos fracos',
        'Reconhecer o padrão universal de aceleração do ritmo harmónico em direção às cadências',
      ],
      concepts: [
        {
          title: 'O Que É o Ritmo Harmónico?',
          explanation:
            'O ritmo harmónico é o padrão de mudanças de acordes ao longo do tempo. Um acorde por compasso é ritmo harmónico lento. Um acorde por tempo é moderado. Dois acordes por tempo é rápido. Crucialmente, o ritmo harmónico é independente do ritmo melódico — a melodia pode correr sobre mudanças lentas de acordes ou sustentar notas longas sobre harmonia em rápida mutação. É uma das ferramentas primárias que os compositores usam para controlar tensão e ritmo.',
          tryThisLabel: 'Ouve Dó maior — imagina manter este acorde durante quatro compassos inteiros',
        },
        {
          title: 'Ritmo Harmónico, Metro e Aceleração Cadencial',
          explanation:
            'As mudanças de acorde são mais fortes nos tempos fortes. Em 4/4, mudar de acorde nos tempos 1 e 3 soa estável e natural; mudar nos tempos 2 e 4 cria um ritmo harmónico sincopado que soa instável. Um padrão universal em todos os estilos: o ritmo harmónico acelera em direção às cadências. Uma frase pode manter um acorde durante dois compassos, depois mudar a cada compasso, depois a cada tempo na cadência — construindo impulso no momento de chegada.',
          tryThisLabel: 'Ouve V7 — a aceleração cadencial culmina frequentemente na dominante',
        },
        {
          title: 'O Ritmo Harmónico como Ferramenta Expressiva',
          explanation:
            'Diferentes ritmos harmónicos criam caracteres fundamentalmente distintos. Um hino com um acorde por tempo soa medido e solene. Um standard de jazz com dois ou mais acordes por compasso soa harmonicamente denso e cinético. Uma banda sonora que mantém um único acorde durante oito compassos cria espaço vasto e aberto. Os compositores escolhem o ritmo harmónico tão deliberadamente como escolhem os acordes — este molda a experiência do ouvinte ao nível estrutural mais profundo.',
          tryThisLabel: 'Ouve Dm7 — num ritmo harmónico rápido, este poderia durar apenas um tempo',
        },
      ],
      tasks: [
        {
          instruction:
            'Ouve qualquer peça e bate cada vez que o acorde muda. O ritmo harmónico é lento (um acorde por compasso), moderado (dois por compasso) ou rápido (a cada tempo)? A maioria das frases acelera em direção às cadências',
        },
        {
          instruction:
            'Compara um hino (ritmo harmónico lento — um acorde por tempo ou por compasso) com um standard de jazz bebop (ritmo harmónico rápido — dois ou mais acordes por compasso). A velocidade da mudança harmónica molda diretamente o carácter e a energia da música',
        },
        {
          instruction:
            'Escolhe uma canção que conheças e mapeia o ritmo harmónico ao longo do verso e do refrão. O refrão muda de acorde mais depressa ou mais devagar do que o verso? Como é que isso afeta o impacto emocional?',
        },
      ],
    },

    // ── U11 M4: Non-Chord Tones Part 1 ──────────────────────────────────────
    l3u11m4: {
      title: 'Notas Estranhas ao Acorde (Parte 1)',
      subtitle:
        'Notas de passagem, bordaduras e antecipações — o tempero da melodia',
      objectives: [
        'Identificar notas de passagem, bordaduras e antecipações numa linha melódica',
        'Distinguir notas estranhas acentuadas de não acentuadas',
        'Compreender as notas estranhas como ornamentos por grau que animam notas do acorde estáticas',
      ],
      concepts: [
        {
          title: 'O Que São Notas Estranhas ao Acorde?',
          explanation:
            'Notas estranhas ao acorde são notas da melodia que não pertencem ao acorde subjacente. Criam interesse melódico, tensão e movimento por grau entre notas do acorde. Sem elas, as melodias consistiriam apenas em notas do acorde arpejadas — mecânicas e sem vida. As notas estranhas classificam-se pela forma como são abordadas e resolvidas: por grau, por salto ou por nota comum. São o tempero melódico que dá vida à harmonia.',
          tryThisLabel: 'Vê Dó maior — Ré, Fá, Lá e Si são notas estranhas contra este acorde',
        },
        {
          title: 'Notas de Passagem e Bordaduras',
          explanation:
            'Uma nota de passagem preenche a lacuna entre duas notas do acorde diferentes, abordada e resolvida por grau na mesma direção (Dó-Ré-Mi sobre um acorde de Dó, onde Ré é uma nota de passagem entre Dó e Mi). Uma bordadura decora uma única nota do acorde — afasta-se por grau e regressa à nota de partida (Dó-Ré-Dó, onde Ré é uma bordadura superior). Ambos os tipos existem em versões acentuadas (no tempo forte, mais dramáticas) e não acentuadas (no tempo fraco, mais comuns).',
          tryThisLabel: 'Vê a escala de Dó maior — os graus entre notas do acorde são notas de passagem',
        },
        {
          title: 'Antecipações e Bordaduras Incompletas',
          explanation:
            'Uma antecipação chega cedo — uma nota pertencente ao acorde seguinte soa no final do acorde atual, mantendo-se depois enquanto a harmonia a alcança. Cria impulso para a frente ao saltar à frente da mudança harmónica. Uma bordadura incompleta é abordada por grau mas resolvida por salto (ou vice-versa), tendo apenas uma ligação por grau. As bordaduras incompletas são mais dramáticas e angulares do que as suas contrapartes completas e simétricas.',
          tryThisLabel: 'Vê Sol maior — antecipar uma nota do acorde seguinte cria impulso',
        },
      ],
      tasks: [
        {
          instruction:
            'Canta ou toca Dó-Ré-Mi sobre um acorde de Dó maior. Ré não pertence a Dó-Mi-Sol — é uma nota de passagem que liga a fundamental à terceira por grau numa direção',
        },
        {
          instruction:
            'Canta ou toca Mi-Fá-Mi sobre um acorde de Dó maior. Fá é uma bordadura superior — afasta-se de Mi por grau e regressa a Mi, decorando a nota do acorde sem mudar a harmonia',
        },
        {
          instruction:
            'Identifica notas estranhas numa melodia simples que conheças: toca cada nota contra o acorde subjacente e pergunta se pertence. As notas que não pertencem são notas estranhas ao acorde. Classifica cada uma como nota de passagem, bordadura ou antecipação com base na sua abordagem e resolução',
        },
      ],
    },

    // ── U11 M5: Transposition ───────────────────────────────────────────────
    l3u11m5: {
      title: 'Transposição',
      subtitle:
        'Mover música para qualquer tonalidade preservando todas as relações intervalares',
      objectives: [
        'Transpor uma melodia ou passagem para uma tonalidade diferente usando os métodos de intervalo ou de armação de clave',
        'Compreender a altura de concerto vs. a altura escrita para instrumentos transpositores',
        'Usar a aplicação para verificar transposições comparando escalas em tonalidades diferentes',
      ],
      concepts: [
        {
          title: 'O Que É a Transposição?',
          explanation:
            'A transposição move uma passagem inteira para uma tonalidade diferente preservando todas as relações intervalares. Cada nota desloca-se pelo mesmo intervalo. A melodia soa idêntica — apenas mais aguda ou mais grave. A transposição serve propósitos práticos (adaptar à extensão vocal de um cantor, corresponder às tonalidades dos instrumentos) e teóricos (compreender que a mesma lógica harmónica opera em todas as tonalidades).',
          tryThisLabel: 'Vê Dó maior — a tua tonalidade de partida para transposição',
        },
        {
          title: 'Dois Métodos de Transposição',
          explanation:
            'O método do intervalo: determina o intervalo entre a tonalidade original e a tonalidade de destino, depois desloca cada nota por esse mesmo intervalo. De Dó maior para Mib maior é uma 3.a menor ascendente, portanto cada nota sobe uma 3.a menor. O método da armação de clave: muda a armação de clave para a tonalidade de destino e ajusta quaisquer acidentes. Ambos produzem o mesmo resultado; o método do intervalo é mais fiável para passagens curtas.',
          tryThisLabel: 'Vê Mib maior — Dó maior transposto uma 3.a menor acima',
        },
        {
          title: 'Instrumentos Transpositores e Altura de Concerto',
          explanation:
            'Alguns instrumentos soam uma altura diferente da que leem. Instrumentos em Sib (trompete, clarinete, saxofone tenor) soam uma 2.a maior abaixo do que está escrito — para soar Dó de concerto, leem Ré. Instrumentos em Mib (saxofone alto) soam uma 6.a maior abaixo. Instrumentos em Fá (trompa) soam uma 5.a perfeita abaixo. A altura de concerto é a altura real que soa; todos os instrumentos alinham-se com ela quando a orquestra afina pelo Lá 440.',
          tryThisLabel:
            'Vê Sib maior — o que um trompete em Sib soa quando lê Dó maior',
        },
      ],
      tasks: [
        {
          instruction:
            "Compara 'C major scale' e 'G major scale' — cada nota subiu uma quinta perfeita. O padrão de intervalos T-T-mT-T-T-T-mT é preservado exatamente; apenas os nomes das notas mudam",
        },
        {
          instruction:
            "Abre 'C major scale' e depois 'Eb major scale' — transpuseste uma terceira menor acima. Verifica: Dó torna-se Mib, Ré torna-se Fá, Mi torna-se Sol, e assim por diante. Todos os intervalos são mantidos",
        },
        {
          instruction:
            "Um trompete em Sib lê 'C major scale' mas produz o som de 'Bb major scale'. Abre ambas e verifica: cada nota que soa é uma 2.a maior abaixo da nota escrita. É por isto que as partes de trompete são escritas um tom acima da altura de concerto",
        },
      ],
    },
  },
};

export default curriculumL3;
