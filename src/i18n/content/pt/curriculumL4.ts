import type { CurriculumLevelOverlay } from '../types';

const curriculumL4: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    u12: {
      title: 'Notas Estranhas ao Acorde e Sétima da Dominante',
      description:
        'Suspensões, apogiatura, pedal, regras de resolução da sétima da dominante e inversões de V7',
    },
    u13: {
      title: 'Acordes de Sétima Diatónicos, Função e Sequências',
      description:
        'Sétimas pré-dominantes, mediante e sensível, teoria da função harmónica e sequências harmónicas',
    },
    u14: {
      title: 'Contraponto, Compasso, Análise e Harmonia Menor',
      description:
        'Contraponto a duas vozes, compassos assimétricos, ornamentação cromática, análise com numerais romanos e sistema de acordes em modo menor',
    },
  },

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: {
    // ── U12 M1: Suspensions ──────────────────────────────────────────────────
    l4u12m1: {
      title: 'Suspensões',
      subtitle: 'Os tipos de suspensão 4-3, 7-6, 9-8 e 2-3',
      objectives: [
        'Compreender o padrão de suspensão em três fases: preparação, dissonância, resolução',
        'Identificar os quatro tipos de suspensão pelos seus intervalos acima do baixo',
        'Reconhecer a suspensão de baixo 2-3 como a única suspensão que resolve para cima',
      ],
      concepts: [
        {
          title: 'O Mecanismo da Suspensão',
          explanation:
            'Uma suspensão é uma nota retida (ligada) do acorde anterior para o novo acorde, criando uma dissonância que resolve por grau conjunto descendente. Tem três fases: preparação (nota consonante no acorde anterior), suspensão (a mesma nota mantida sobre o novo acorde, agora dissonante, num tempo forte) e resolução (a nota retida desce por grau conjunto até uma nota consonante do acorde). A dissonância no tempo forte é o que confere às suspensões o seu poder expressivo — o ouvinte espera consonância e recebe tensão.',
          tryThisLabel: 'Ouve o alvo consonante da resolução',
        },
        {
          title: 'Tipos de Suspensão: 4-3, 7-6, 9-8',
          explanation:
            'As suspensões são nomeadas pelos intervalos que formam acima do baixo no momento da dissonância e da resolução. A suspensão 4-3 é a mais comum: uma 4.ª acima do baixo resolve para uma 3.ª. A suspensão 7-6 retém uma 7.ª que resolve para uma 6.ª — comum em sequências e cadeias de suspensões. A suspensão 9-8 retém uma 9.ª (ou 2.ª uma oitava acima) que resolve para uma oitava. Todas as três resolvem por grau conjunto descendente.',
          tryThisLabel: 'Imagina manter C sobre este acorde (sus 4-3)',
        },
        {
          title: 'A Suspensão de Baixo 2-3',
          explanation:
            'A suspensão 2-3 é única: ocorre na voz do baixo em vez de numa voz superior, e resolve para cima. A nota do baixo é retida do acorde anterior, formando uma 2.ª contra uma voz superior, e depois resolve por grau conjunto ascendente para uma 3.ª. É a única suspensão padrão que resolve para cima. Alguns teóricos descrevem-na como uma "suspensão de baixo" para a distinguir dos tipos em vozes superiores.',
          tryThisLabel: 'O C no baixo pode suspender para um acorde de D',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "C major chord" e imagina manter a nota F enquanto o acorde soa — o F é uma 4.ª dissonante acima do baixo que quer resolver por grau conjunto descendente para E (um padrão de suspensão 4-3)',
        },
        {
          instruction:
            'Numa suspensão 7-6, uma 7.ª acima do baixo resolve para uma 6.ª. Imagina a nota B retida sobre um baixo C: B é uma 7.ª, e resolve descendo para A (uma 6.ª acima de C). Isto cria uma dissonância mais suave do que a 4-3',
        },
        {
          instruction:
            'Compara os três tipos de suspensão em vozes superiores: 4-3 (a mais comum, dissonância forte), 7-6 (moderada, frequentemente encadeada em sequências), 9-8 (espaçamento amplo, resolução em oitava). Todos partilham o mesmo mecanismo de preparação-dissonância-resolução',
        },
      ],
    },

    // ── U12 M2: Appoggiatura, Escape Tone, Retardation ─────────────────────
    l4u12m2: {
      title: 'Apogiatura, Escapatória e Retardo',
      subtitle:
        'Notas estranhas acentuadas e não acentuadas, abordadas por salto ou resolvidas para cima',
      objectives: [
        'Identificar a apogiatura pela sua abordagem por salto e resolução por grau conjunto num tempo forte',
        'Reconhecer a escapatória como o inverso: abordagem por grau conjunto, saída por salto',
        'Compreender o retardo como uma suspensão que resolve para cima em vez de para baixo',
      ],
      concepts: [
        {
          title: 'A Apogiatura',
          explanation:
            'A apogiatura é abordada por salto e resolvida por grau conjunto na direção oposta, caindo num tempo forte. A palavra significa "nota de apoio" — apoia-se fortemente na sua resolução, criando uma dissonância acentuada e dramática, mais marcante do que uma nota de passagem porque o salto a torna inesperada. O salto cria surpresa, e a resolução por grau conjunto proporciona o alívio esperado. As apogiaturas são uma marca da melodia expressiva da era Romântica.',
          tryThisLabel: 'Ouve o movimento por grau conjunto que as apogiaturas decoram',
        },
        {
          title: 'A Escapatória',
          explanation:
            'A escapatória (échappée) é o inverso da apogiatura: abordada por grau conjunto e abandonada por salto na direção oposta. Afasta-se por grau conjunto de uma nota do acorde, depois salta de volta para uma nota do acorde diferente, criando um breve gesto decorativo num tempo fraco. Porque cai num tempo fraco e parte por salto, é menos dramática do que a apogiatura — um ornamento fugaz em vez de um acento expressivo.',
          tryThisLabel: 'O movimento por grau conjunto é onde as escapatórias começam',
        },
        {
          title: 'O Retardo',
          explanation:
            'Um retardo usa o mesmo mecanismo de nota retida que uma suspensão, mas resolve por grau conjunto ascendente em vez de descendente. O retardo mais típico é 7-8: a sensível é retida do acorde da dominante e resolve para cima até à tónica. Soa como uma suspensão que vai na direção "errada". Os retardos são menos comuns do que as suspensões porque a resolução ascendente é menos natural na condução de vozes tonal, mas o retardo 7-8 é idiomático em pontos cadenciais.',
          tryThisLabel: 'O B em Sol maior pode retardar para cima até C',
        },
      ],
      tasks: [
        {
          instruction:
            'Classifica estas notas estranhas pela abordagem e saída: apogiatura (salto para tempo forte, resolução por grau conjunto na direção oposta), escapatória (abordagem por grau conjunto, saída por salto na direção oposta), retardo (nota retida, grau conjunto ascendente). A apogiatura e a escapatória são imagens espelhadas',
        },
        {
          instruction:
            'Escreve "G major chord" — imagina a nota B retida enquanto o acorde muda para Dó maior. B resolve para cima até C: isto é um retardo 7-8, o tipo de retardo mais comum',
        },
        {
          instruction:
            'Compara: uma suspensão resolve para BAIXO por grau conjunto (4-3: F desce para E), enquanto um retardo resolve para CIMA por grau conjunto (7-8: B sobe para C). Mesmo mecanismo, direção oposta. As suspensões são muito mais comuns porque a resolução descendente soa mais natural',
        },
      ],
    },

    // ── U12 M3: Pedal Point and Changing Tones ──────────────────────────────
    l4u12m3: {
      title: 'Pedal e Notas Cambiadas',
      subtitle: 'Notas sustentadas no baixo e ornamentos de dupla bordadura',
      objectives: [
        'Compreender o pedal como uma nota sustentada sobre harmonias em mudança',
        'Identificar os tipos de pedal: de baixo, invertido, interno e pedal duplo',
        'Reconhecer as notas cambiadas (dupla bordadura) como uma figura ornamental emparelhada',
      ],
      concepts: [
        {
          title: 'O Pedal',
          explanation:
            'Um pedal é uma nota sustentada ou repetida (geralmente no baixo) sobre harmonias em mudança, criando dissonâncias e consonâncias alternadas à medida que os acordes se movem acima dela. Os pedais de tónica ancoram inícios e finais de peças, proporcionando estabilidade de base. Os pedais de dominante criam tensão antes de um regresso à tónica, gerando uma sensação de antecipação enquanto as harmonias mudam acima da nota dominante sustentada.',
          tryThisLabel: 'C é a nota de pedal de tónica mais comum',
        },
        {
          title: 'Tipos de Pedal',
          explanation:
            'O pedal de baixo é o tipo mais comum, com a nota sustentada na voz mais grave. Um pedal invertido sustenta uma nota na voz do soprano enquanto as harmonias se movem abaixo. Um pedal interno mantém uma nota numa voz interior (contralto ou tenor), criando um efeito mais subtil. Um pedal duplo sustenta duas notas em simultâneo, geralmente tónica e dominante (como C e G mantidos juntos), criando um poderoso efeito de ancoragem.',
          tryThisLabel: 'G é a nota de pedal de dominante em Dó maior',
        },
        {
          title: 'Notas Cambiadas (Dupla Bordadura)',
          explanation:
            'As notas cambiadas são um par de bordaduras em sequência: nota do acorde, bordadura superior, bordadura inferior, regresso à nota original do acorde (ou na ordem inversa). Também chamadas "grupo de bordaduras" ou "dupla bordadura". Criam uma órbita decorativa em torno de uma única altura, ornamentando-a de ambos os lados antes de regressar. A figura ocorre tipicamente numa posição de tempo fraco e acrescenta interesse melódico sem perturbar a harmonia subjacente.',
          tryThisLabel: 'Imagina orbitar em torno de E com F e depois D',
        },
      ],
      tasks: [
        {
          instruction:
            'Imagina uma nota de baixo C sustentada enquanto os acordes mudam acima: Dó maior, Fá maior, G7, Dó maior. Os acordes de Fá e G7 criam dissonância contra o baixo C — isto é um pedal de tónica em ação',
        },
        {
          instruction:
            'Agora imagina um pedal de dominante: o baixo mantém G enquanto os acordes mudam acima (Sol, Dó/Sol, Ré/Sol, Sol). O G sustentado cria tensão crescente que resolve quando a harmonia finalmente se alinha com o baixo',
        },
        {
          instruction:
            'Uma figura de notas cambiadas em torno de E em Dó maior: E-F-D-E. O F é a bordadura superior, o D é a bordadura inferior, e a figura regressa a E. Este ornamento de dupla bordadura decora uma única nota do acorde de ambos os lados',
        },
      ],
    },

    // ── U12 M4: The Dominant Seventh — Resolution Rules ─────────────────────
    l4u12m4: {
      title: 'A Sétima da Dominante — Regras de Resolução',
      subtitle:
        'Notas de tendência do V7, condução de vozes e a resolução do trítono',
      objectives: [
        'Dominar as tendências de resolução do V7: a 7.ª resolve para baixo, a sensível resolve para cima',
        'Conduzir acordes de V7 completos e incompletos corretamente',
        'Compreender a contração do trítono que impulsiona a resolução V7-I',
      ],
      concepts: [
        {
          title: 'Notas de Tendência do V7',
          explanation:
            'O acorde de sétima da dominante contém duas notas de tendência que criam a sua poderosa atração gravitacional em direção à tónica. A sensível (a 3.ª de V7) resolve por meio-tom ascendente para a tónica. A 7.ª do acorde resolve por grau conjunto descendente para a 3.ª de I. Juntas, estas duas vozes formam um trítono que contrai para uma consonância imperfeita (uma 3.ª ou 6.ª), gerando o impulso harmónico mais forte na música tonal.',
          tryThisLabel: 'Ouve a tensão não resolvida de G7',
        },
        {
          title: 'V7 Completo vs. Incompleto',
          explanation:
            'Um V7 completo tem os quatro sons: fundamental, 3.ª, 5.ª e 7.ª. Um V7 incompleto omite a 5.ª e dobra a fundamental, usado quando a condução de vozes com a forma completa seria desajeitada. Quando um V7 completo resolve para I, o acorde de tónica resultante é frequentemente incompleto (fundamental triplicada, sem 5.ª) porque ambas as notas de tendência devem resolver corretamente. Este compromisso entre completude do acorde e suavidade da condução de vozes é uma preocupação central na escrita a quatro vozes.',
          tryThisLabel: 'Ouve o alvo de resolução de G7',
        },
        {
          title: 'A Resolução do Trítono',
          explanation:
            'O trítono entre a sensível e a 7.ª do acorde é o que torna o V7 singularmente poderoso. Em G7, o trítono é B-F. Quando G7 resolve para Dó, B sobe para C e F desce para E — o trítono contrai para a 3.ª consonante C-E. Esta contração da dissonância máxima para a consonância é o motor da resolução tonal. Cada movimento V7-I em qualquer tonalidade segue este mesmo padrão de trítono-para-consonância.',
          tryThisLabel: 'B e F formam o trítono dentro de G7',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "G7" — identifica as duas notas de tendência: B (sensível, resolve para cima até C) e F (7.ª do acorde, resolve para baixo até E). Juntas formam o trítono que impulsiona a resolução V7-I',
        },
        {
          instruction:
            'Agora escreve "C major chord" — é para aqui que G7 resolve. B foi para C, F foi para E. O trítono contraiu para o intervalo consonante C-E',
        },
        {
          instruction:
            'Toca "G7" e depois "C major chord" em sequência — ouve o ciclo tensão-resolução. A sétima da dominante é o movimento de acorde para acorde mais forte na música tonal',
        },
      ],
    },

    // ── U12 M5: V7 Inversions and Their Resolutions ─────────────────────────
    l4u12m5: {
      title: 'Inversões de V7 e as Suas Resoluções',
      subtitle: 'Como V6/5, V4/3 e V4/2 resolvem para posições de tónica',
      objectives: [
        'Resolver as quatro inversões de V7 para os seus alvos de tónica corretos',
        'Compreender por que V4/2 resolve quase sempre para I6 (tónica em primeira inversão)',
        'Reconhecer como a inversão determina o movimento do baixo e a resolução',
      ],
      concepts: [
        {
          title: 'V7 em Estado Fundamental e Primeira Inversão (V6/5)',
          explanation:
            'O V7 em estado fundamental resolve para I com o efeito mais enfático — o baixo desce uma 5.ª (ou sobe uma 4.ª) até à fundamental da tónica. A primeira inversão V6/5 coloca a sensível no baixo, que deve subir por meio-tom até à tónica. Isto cria o movimento de baixo mais suave possível para o acorde de tónica e é especialmente útil quando se deseja uma linha de baixo por grau conjunto.',
          tryThisLabel: 'V7 em estado fundamental em Dó maior',
        },
        {
          title: 'Segunda Inversão (V4/3)',
          explanation:
            'V4/3 coloca a 5.ª do acorde da dominante no baixo. Pode resolver tanto para I (tónica em estado fundamental) como para I6 (tónica em primeira inversão), dando ao compositor flexibilidade na condução da linha de baixo. A nota do baixo (a 5.ª de V) tipicamente desce por grau conjunto até à fundamental da tónica ou move-se para a 3.ª de I. V4/3 aparece frequentemente no meio de frases como uma dominante de passagem entre posições de tónica.',
          tryThisLabel: 'V4/3 tem D (a 5.ª) no baixo',
        },
        {
          title: 'Terceira Inversão (V4/2)',
          explanation:
            'V4/2 coloca a 7.ª do acorde no baixo. Como a 7.ª é uma nota de tendência que deve resolver por grau conjunto descendente, V4/2 resolve quase sempre para I6 (tónica em primeira inversão). Em G7, a 7.ª é F; F deve descer por grau conjunto para E, dando C/E (I6) como resolução. Esta restrição é absoluta na condução de vozes rigorosa — V4/2 para I em estado fundamental deixaria a 7.ª do baixo sem resolução.',
          tryThisLabel: 'Toca G/B para ouvir o movimento do baixo de V6/5',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "G7" — estado fundamental, baixo é G. O baixo desce uma 5.ª até C ao resolver para I. Este é o movimento de baixo V7-I mais forte e enfático',
        },
        {
          instruction:
            'Escreve "G/B" — isto é V6/5 com a sensível B no baixo. B deve subir por grau conjunto até C, dando um movimento de baixo suave por grau conjunto para a tónica. Compara o efeito com G7 em estado fundamental',
        },
        {
          instruction:
            'V4/2 coloca F (a 7.ª) no baixo. F deve resolver descendo para E, portanto V4/2 resolve para C/E (I6). Isto não é uma escolha — a nota de tendência no baixo fixa a resolução na tónica em primeira inversão',
        },
      ],
    },

    // ── U13 M1: Pre-Dominant Seventh Chords ─────────────────────────────────
    l4u13m1: {
      title: 'Acordes de Sétima Pré-Dominantes: ii7 e IV7',
      subtitle:
        'As sonoridades pré-dominantes mais fortes e a progressão ii7-V7-I',
      objectives: [
        'Construir e identificar ii7 (sétima menor em maior) e iiø7 (meio-diminuto em menor)',
        'Compreender a progressão ii7-V7-I como a sequência funcional mais forte na harmonia tonal',
        'Reconhecer IV7/IVmaj7 como uma sétima subdominante com calor acrescido',
      ],
      concepts: [
        {
          title: 'O Acorde ii7',
          explanation:
            'O ii7 é o acorde pré-dominante mais importante. Em tonalidades maiores é um acorde de sétima menor; em tonalidades menores torna-se um acorde de sétima meio-diminuto (iiø7). A progressão ii7-V7-I é a sequência funcional mais forte na harmonia tonal porque a fundamental de ii7 (D) é uma nota comum com a 5.ª de V (D em G-B-D-F), criando uma ligação suave na condução de vozes. O baixo move-se por 5.ª descendente (ou 4.ª ascendente) em cada passo, reforçando a atração gravitacional em direção à tónica.',
          tryThisLabel: 'Ouve ii7 na tonalidade de Dó',
        },
        {
          title: 'O Acorde IV7 / IVmaj7',
          explanation:
            'IVmaj7 desempenha uma função subdominante (pré-dominante) com calor e cor acrescidos. O intervalo de 7.ª maior confere-lhe uma qualidade rica, distinta da tríade IV mais simples. A sétima intensifica a atração para a dominante ao acrescentar mais uma voz que quer resolver. Embora menos comum do que ii7 na prática clássica, IVmaj7 aparece frequentemente na harmonia jazz e pop como uma sonoridade pré-dominante alternativa.',
          tryThisLabel: 'Ouve IVmaj7 na tonalidade de Dó',
        },
        {
          title: 'A Progressão ii7-V7-I',
          explanation:
            'Esta sequência de três acordes é a progressão harmónica mais fundamental no jazz e uma das mais fortes em toda a música tonal. Cada acorde flui para o seguinte por 5.ª descendente: D(m7) para G(7) para C. A condução de vozes é excecionalmente suave: a 7.ª de cada acorde resolve por grau conjunto para o acorde seguinte, e notas comuns ligam harmonias adjacentes. No jazz, esta progressão é frequentemente estendida: iii7-vi7-ii7-V7-Imaj7, uma descida completa pelo ciclo de quintas.',
          tryThisLabel: 'Começa o ii7-V7-I em Dó maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "Dm7" depois "G7" depois "Cmaj7" — esta é a progressão ii7-V7-Imaj7, a sequência de acordes mais fundamental no jazz e a progressão funcional mais forte na harmonia tonal',
        },
        {
          instruction:
            'Compara "Dm7" com "Fmaj7" — ambos têm função pré-dominante em Dó maior. Dm7 (ii7) tem uma qualidade mais escura e propulsiva; Fmaj7 (IVmaj7) é mais quente e expansivo. Ambos conduzem naturalmente a G7 (V7)',
        },
        {
          instruction:
            'Escreve "Dm7" e repara na nota comum com G7: a nota D. A 7.ª de Dm7 (C) resolve por grau conjunto para B (a 3.ª de G7). Esta ligação suave na condução de vozes é a razão pela qual ii7-V7 é tão forte',
        },
      ],
    },

    // ── U13 M2: Mediant, Submediant, and Tonic Sevenths ────────────────────
    l4u13m2: {
      title: 'Sétimas da Mediante, Submediante e Tónica',
      subtitle:
        'iii7, vi7, Imaj7 — sétimas de função tónica e a tónica jazz',
      objectives: [
        'Compreender iii7 como substituto de tónica e elo no ciclo de quintas',
        'Reconhecer vi7 como o principal substituto de função tónica e alvo da resolução de engano',
        'Distinguir Imaj7 (tónica jazz) de I7 (tónica blues)',
      ],
      concepts: [
        {
          title: 'Os Acordes iii7 e vi7',
          explanation:
            'O iii7 funciona como substituto de tónica (partilhando duas notas com I) ou como elo no movimento por ciclo de quintas: iii7-vi7-ii7-V7-I. Raramente aparece isolado, mas é essencial em sequências prolongadas. O vi7 é o principal substituto de função tónica; vi7-ii7-V7-I é extremamente comum tanto na harmonia clássica como no jazz. A resolução de engano V7-vi7 é mais suave do que V7-vi porque o acorde de sétima partilha mais notas com V7, atenuando a surpresa.',
          tryThisLabel: 'Ouve iii7 na tonalidade de Dó',
        },
        {
          title: 'A Sétima de Tónica: Imaj7',
          explanation:
            'Na harmonia clássica, a 7.ª sobre um acorde de tónica é tipicamente tratada como nota de passagem ou suspensão que resolve. No jazz e pop, Imaj7 é a disposição de tónica padrão — quente, rica e sofisticada. O intervalo de 7.ª maior (B em Cmaj7) acrescenta cor sem criar tensão de qualidade dominante. Imaj7 é o ponto de repouso da progressão ii7-V7-Imaj7, a cadência jazz mais característica.',
          tryThisLabel: 'Ouve a tónica jazz: Cmaj7',
        },
        {
          title: 'A Tónica Blues: I7',
          explanation:
            'No blues, o acorde I é uma sétima da dominante (I7), conferindo a cada acorde a tensão característica que define o estilo. C7 como acorde de tónica é "errado" segundo os padrões clássicos (sétimas da dominante devem resolver, não repousar), mas exatamente certo no blues. Num blues de 12 compassos, os três acordes principais (I7, IV7, V7) são todos sétimas da dominante. Isto transforma a sétima da dominante de um acorde de tensão no bloco sonoro básico de construção.',
          tryThisLabel: 'Ouve vi7 na tonalidade de Dó',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "Cmaj7" — repara no intervalo de 7.ª maior (B para C). Agora escreve "C7" — a 7.ª menor (Bb) dá-lhe um carácter completamente diferente. Cmaj7 é função tónica; C7 é qualidade dominante (ou tónica blues)',
        },
        {
          instruction:
            'Toca o ciclo alargado: "Em7" (iii7) \u2192 "Am7" (vi7) \u2192 "Dm7" (ii7) \u2192 "G7" (V7) \u2192 "Cmaj7" (Imaj7). Cada fundamental desce uma 5.ª. Este é o fragmento completo de quintas descendentes de iii a I',
        },
        {
          instruction:
            'Compara "Am7" com "Am" — a sétima (G) acrescenta suavidade a vi7 e torna a resolução de engano V7-vi7 mais fluida do que V7-vi. A nota acrescentada cria uma nota comum com V7',
        },
      ],
    },

    // ── U13 M3: Leading-Tone Sevenths ───────────────────────────────────────
    l4u13m3: {
      title: 'Sétimas da Sensível: viiø7 e viio7',
      subtitle:
        'Acordes de sétima meio-diminuto e diminuto como substitutos da dominante',
      objectives: [
        'Construir e resolver viiø7 (meio-diminuto, em maior) e viio7 (diminuto, em menor)',
        'Compreender as sétimas da sensível como dominantes de 9.ª sem fundamental',
        'Reconhecer a flexibilidade enarmónica do acorde de sétima diminuto',
      ],
      concepts: [
        {
          title: 'O viiø7 Meio-Diminuto',
          explanation:
            'O viiø7 em tonalidades maiores funciona como um V7 sem fundamental — as suas notas são a 3.ª, 5.ª, 7.ª e 9.ª de V. Em Dó maior, Bø7 contém B-D-F-A, que são as quatro notas superiores de G9 (G-B-D-F-A com a fundamental G removida). Resolve para I com a mesma lógica de notas de tendência: B sobe para C, F desce para E. A qualidade meio-diminuta é menos tensa do que a totalmente diminuta, conferindo-lhe uma atração dominante mais suave.',
          tryThisLabel: 'Ouve viiø7 na tonalidade de Dó',
        },
        {
          title: 'O viio7 Totalmente Diminuto',
          explanation:
            'O viio7 em tonalidades menores é construído a partir do 7.º grau elevado da escala menor harmónica. As quatro notas são todas notas de tendência que puxam para a resolução, tornando-o o mais tenso de todos os acordes de sétima diatónicos. Em Lá menor, G#dim7 contém G#-B-D-F — cada nota quer mover-se por grau conjunto. O acorde de sétima diminuto divide a oitava em 3.as menores iguais, conferindo-lhe uma qualidade simétrica e inquieta.',
          tryThisLabel: 'Ouve o viio7 totalmente diminuto',
        },
        {
          title: 'Flexibilidade Enarmónica',
          explanation:
            'Como o acorde de sétima diminuto divide a oitava em quatro 3.as menores iguais, qualquer uma das suas quatro notas pode ser renomeada como fundamental. G#dim7, Bdim7, Ddim7 e Fdim7 contêm todos as mesmas alturas (enarmonicamente). Isto torna o acorde de sétima diminuto um poderoso acorde pivot para modulação — um único acorde pode resolver para quatro tonalidades diferentes. Esta flexibilidade enarmónica torna-se central na modulação cromática no Nível 5.',
          tryThisLabel: 'Mesmas alturas que G#dim7, Ddim7, Fdim7',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "Bm7b5" (B sétima meio-diminuto) — isto é viiø7 em Dó maior. As suas notas B-D-F-A são as mesmas de G9 sem a fundamental G. Resolve para Dó maior com B a subir para C e F a descer para E',
        },
        {
          instruction:
            'Escreve "Bdim7" (B sétima diminuto) — isto é viio7 em Dó menor. Compara o som com "Bm7b5": a versão totalmente diminuta é mais tensa porque cada nota é uma nota de tendência',
        },
        {
          instruction:
            'Abre "key of C" e identifica os sete acordes de sétima diatónicos: Imaj7, ii7, iii7, IVmaj7, V7, vi7, viiø7. A sétima da sensível (viiø7) é o único acorde de qualidade diminuta em tonalidades maiores',
        },
      ],
    },

    // ── U13 M4: Harmonic Function: T → PD → D → T ──────────────────────────
    l4u13m4: {
      title: 'Função Harmónica: T \u2192 PD \u2192 D \u2192 T',
      subtitle:
        'Tónica, Pré-Dominante e Dominante — os três pilares da harmonia tonal',
      objectives: [
        'Classificar cada acorde diatónico por função: Tónica (T), Pré-Dominante (PD), Dominante (D)',
        'Compreender a progressão padrão T \u2192 PD \u2192 D \u2192 T como a frase harmónica fundamental',
        'Reconhecer retrogressões e substituição de acordes dentro de grupos funcionais',
      ],
      concepts: [
        {
          title: 'As Três Funções Harmónicas',
          explanation:
            'Cada acorde diatónico desempenha uma de três funções. Acordes de Tónica (T) — I, vi, e por vezes iii — proporcionam estabilidade e a sensação de casa. Acordes Pré-Dominantes (PD) — ii e IV — criam partida e movimento, sinalizando que a harmonia se dirige a algum lado. Acordes de Dominante (D) — V e vii° — geram tensão e urgência que exige resolução de volta à tónica. As cores dos graus nesta app codificam estas funções: azul para estabilidade tónica, âmbar para tensão dominante.',
          tryThisLabel: 'Vê as cores de função na barra de graus',
        },
        {
          title: 'A Progressão Funcional Padrão',
          explanation:
            'T \u2192 PD \u2192 D \u2192 T é a frase harmónica fundamental, espelhando a estrutura narrativa: estabelecer casa, partir, criar tensão, resolver. Quase toda a música tonal segue este padrão a algum nível estrutural. A ordem importa: PD \u2192 D aumenta a tensão, D \u2192 T liberta-a. Inverter o fluxo (retrogressão) soa invulgar porque liberta a tensão prematuramente — D \u2192 PD ou PD \u2192 T sem passar por D cria desvio, evitamento da resolução, ou um regresso suave.',
          tryThisLabel: 'Traça I-IV-V-I como T-PD-D-T',
        },
        {
          title: 'Substituição de Acordes Dentro de Funções',
          explanation:
            'Acordes dentro do mesmo grupo funcional podem substituir-se mutuamente porque partilham graus da escala. O vi pode substituir I (é por isso que a cadência de engano V-vi funciona — vi é função tónica). O ii pode substituir IV (ambos são pré-dominantes). O vii° pode substituir V (ambos são função dominante). A substituição explica por que tantas progressões diferentes funcionam: seguem o mesmo padrão funcional T-PD-D-T com acordes específicos diferentes a preencher cada papel.',
          tryThisLabel: 'Vê quais acordes partilham função',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre "key of C" e classifica cada acorde diatónico: I(T), ii(PD), iii(T), IV(PD), V(D), vi(T), vii°(D). Repara como as cores da barra de graus correspondem a estas funções',
        },
        {
          instruction:
            'Traça a progressão I-vi-ii-V-I através das etiquetas de função: T-T-PD-D-T. Mesmo com uma substituição (vi no lugar de I), o fluxo funcional T \u2192 PD \u2192 D \u2192 T é mantido',
        },
        {
          instruction:
            'Considera I-V-IV-I (T-D-PD-T). Isto é uma retrogressão — D move-se para PD em vez de resolver para T. Soa invulgar na música clássica, mas é comum no rock. Consegues ouvir a diferença na direção harmónica?',
        },
      ],
    },

    // ── U13 M5: Harmonic Sequences ──────────────────────────────────────────
    l4u13m5: {
      title: 'Sequências Harmónicas',
      subtitle:
        'Padrões harmónicos repetitivos que criam movimento direcional dentro de uma tonalidade',
      objectives: [
        'Reconhecer padrões de sequência de quintas descendentes, segundas ascendentes e terças descendentes',
        'Compreender como as sequências criam impulso harmónico direcional que sobrepõe a lógica funcional normal',
        'Ouvir sequências em contexto nos estilos Barroco, Clássico e pop',
      ],
      concepts: [
        {
          title: 'O Que É uma Sequência Harmónica?',
          explanation:
            'Uma sequência harmónica é um padrão de acordes que se repete a intervalos regulares, transpondo-se para cima ou para baixo a cada repetição. As sequências criam um forte impulso direcional — o ouvinte percebe o padrão e antecipa a sua continuação. Sobrepõem temporariamente as progressões funcionais normais porque o padrão repetitivo em si mesmo fornece a lógica harmónica. Qualquer desvio do padrão estabelecido é imediatamente percetível, o que torna as sequências simultaneamente previsíveis e cativantes.',
          tryThisLabel: 'Vê todos os acordes diatónicos para construir sequências',
        },
        {
          title: 'A Sequência de Quintas Descendentes',
          explanation:
            'A sequência harmónica mais comum. As fundamentais descem por quintas: I-IV-vii°-iii-vi-ii-V-I. Cada acorde resolve para o seguinte como se fosse um movimento V-I local. O ciclo completo regressa à tonalidade inicial. Qualquer subconjunto funciona como progressão utilizável: vi-ii-V-I é um fragmento de quintas descendentes usado constantemente na música tonal. Acrescentar acordes de sétima torna a condução de vozes ainda mais suave porque a 7.ª de cada acorde resolve por grau conjunto para o acorde seguinte.',
          tryThisLabel: 'vi7 inicia uma descida de quintas comum',
        },
        {
          title: 'Segundas Ascendentes e Terças Descendentes',
          explanation:
            'Numa sequência de segundas ascendentes, as fundamentais sobem por grau conjunto: I-ii-iii-IV-V, criando uma sensação de escalada. Primeiras inversões são frequentemente usadas para manter a linha de baixo suave (a técnica 5-6). Numa sequência de terças descendentes, as fundamentais descem por terças: I-vi-IV-ii, produzindo um movimento descendente suave comum na música Romântica. Cada par numa sequência de terças partilha uma nota comum, tornando a condução de vozes excecionalmente suave.',
          tryThisLabel: 'ii7 situa-se no centro de muitas sequências',
        },
      ],
      tasks: [
        {
          instruction:
            'Mapeia as quintas descendentes em Dó maior: C-F-Bdim-Em-Am-Dm-G-C (I-IV-vii°-iii-vi-ii-V-I). Abre "key of C" e toca cada acorde — ouve como cada fundamental desce uma 5.ª para a seguinte',
        },
        {
          instruction:
            'Toca "Am7" depois "Dm7" depois "G7" depois "Cmaj7" — este é um fragmento de quintas descendentes (vi7-ii7-V7-Imaj7), a progressão de acordes mais comum no jazz',
        },
        {
          instruction:
            'Identifica o tipo de sequência em I-vi-IV-ii: cada fundamental desce uma 3.ª (C-A-F-D). Esta é uma sequência de terças descendentes. Repara como cada par adjacente partilha uma nota comum, mantendo a condução de vozes suave',
        },
      ],
    },

    // ── U14 M1: First and Second Species Counterpoint ───────────────────────
    l4u14m1: {
      title: 'Contraponto de Primeira e Segunda Espécie',
      subtitle:
        'Combinar melodias independentes com regras de consonância e dissonância',
      objectives: [
        'Compreender o contraponto como a arte de combinar linhas melódicas independentes',
        'Aplicar a classificação de consonância e dissonância a texturas a duas vozes',
        'Escrever contraponto de primeira espécie (1:1) e segunda espécie (2:1) seguindo regras de condução de vozes',
      ],
      concepts: [
        {
          title: 'O Que É o Contraponto?',
          explanation:
            'O contraponto é a arte de combinar duas ou mais linhas melódicas independentes que estão harmonicamente relacionadas mas melodicamente independentes. Enquanto a harmonia é uma perspetiva vertical (acordes empilhados num momento no tempo), o contraponto é horizontal (melodias que se desenrolam no tempo e se entrelaçam). As duas perspetivas complementam-se — boa harmonia geralmente implica bom contraponto, e vice-versa. O contraponto foi a técnica composicional dominante do Renascimento ao Barroco.',
          tryThisLabel: 'Uma escala é a linha melódica mais simples',
        },
        {
          title: 'Consonância e Dissonância no Contraponto',
          explanation:
            'No contraponto a duas partes, cada intervalo vertical entre as vozes é classificado. Consonâncias perfeitas (P1, P5, P8) são as mais estáveis, mas soam ocas se usadas em excesso. Consonâncias imperfeitas (m3, M3, m6, M6) são estáveis e quentes — formam a espinha dorsal do bom contraponto, proporcionando o melhor equilíbrio entre harmonia e independência. Dissonâncias (m2, M2, P4, trítono, m7, M7) são instáveis e devem resolver por grau conjunto para uma consonância.',
          tryThisLabel: 'C-E é uma consonância imperfeita (M3)',
        },
        {
          title: 'Primeira e Segunda Espécie',
          explanation:
            'A primeira espécie (1:1) coloca uma nota do contraponto contra cada nota do cantus firmus (melodia dada). Cada intervalo deve ser consonante. Começa e termina em P1, P5 ou P8, usa maioritariamente consonâncias imperfeitas, e nunca se aproxima de consonâncias perfeitas em movimento paralelo. A segunda espécie (2:1) acrescenta duas notas contra cada nota do cantus firmus. Tempos fortes devem ser consonantes; na espécie estrita, a única dissonância permitida num tempo fraco é a nota de passagem, abordada e abandonada por grau conjunto (as bordaduras dissonantes chegam mais tarde, na terceira espécie — embora alguns textos modernos as admitam mais cedo). É aqui que as notas estranhas ao acorde entram pela primeira vez no contraponto.',
          tryThisLabel: 'Imagina uma segunda voz contra esta linha',
        },
      ],
      tasks: [
        {
          instruction:
            'Classifica estes intervalos para contraponto: C-E (consonância imperfeita, M3), C-G (consonância perfeita, P5), C-F (dissonância, P4 em textura a duas vozes), C-B (dissonância, M7)',
        },
        {
          instruction:
            'Toca "C major scale" ascendente e imagina uma segunda voz uma 3.ª acima (E-F-G-A-B-C-D-E). Este movimento em terças paralelas é consonância imperfeita ao longo de toda a linha — estável e quente, a textura de contraponto ideal',
        },
        {
          instruction:
            'Por que são proibidas as quintas perfeitas paralelas? Porque duas vozes em P5 paralelas perdem a sua independência melódica — começam a soar como uma única voz dobrada, não duas linhas individuais. As consonâncias imperfeitas mantêm melhor a independência',
        },
      ],
    },

    // ── U14 M2: Asymmetric and Mixed Meters ─────────────────────────────────
    l4u14m2: {
      title: 'Compassos Assimétricos e Mistos',
      subtitle:
        'Contar em 5, 7 e mais — compassos aditivos e mistos',
      objectives: [
        'Contar e sentir compassos assimétricos: 5/4, 5/8, 7/4, 7/8',
        'Compreender agrupamentos de compasso aditivo (2+3, 3+2, 2+2+3) como os blocos de construção do ritmo irregular',
        'Reconhecer compassos mistos onde a indicação de compasso muda de compasso para compasso',
      ],
      concepts: [
        {
          title: 'Compassos Assimétricos',
          explanation:
            'Compassos assimétricos têm contagens de tempos que não se dividem igualmente em grupos iguais. 5/4 ou 5/8 agrupa-se como 2+3 ou 3+2 — o agrupamento determina inteiramente o carácter rítmico. 7/4 ou 7/8 agrupa-se como 2+2+3, 2+3+2 ou 3+2+2. O agrupamento desigual cria um groove assimétrico que é característico da música folclórica balcânica, rock progressivo e muita música de concerto do século XX.',
          tryThisLabel: 'Conta 7 notas da escala em grupos de 2+2+3',
        },
        {
          title: 'Compassos Aditivos',
          explanation:
            'Compassos aditivos são construídos combinando grupos de 2 e 3 tempos. 5 = 2+3 ou 3+2. 7 = 2+2+3 ou 2+3+2 ou 3+2+2. 8 = 3+3+2, comum na música balcânica e algum rock. 11 = 2+2+3+2+2, usado por Dave Brubeck e outros. O padrão de agrupamento interno é o que dá a cada compasso o seu carácter distintivo — o mesmo número total de tempos com agrupamentos diferentes cria caráteres rítmicos inteiramente distintos.',
          tryThisLabel: 'Conta 5 notas em grupos de 3+2',
        },
        {
          title: 'Compassos Mistos e Tempo Cortado',
          explanation:
            'O compasso misto muda a indicação de compasso de compasso para compasso: um compasso de 4/4, o seguinte de 3/4, depois 5/4. Isto cria uma superfície rítmica imprevisível e mutável, comum em bandas sonoras de cinema e rock progressivo. O tempo cortado (alla breve, 2/2) usa dois tempos de mínima por compasso — um compasso de 2/2 tem a mesma duração total que um compasso de 4/4, mas a unidade de tempo é a mínima em vez da semínima, pelo que a música é contada em 2 e ganha uma sensação mais ampla e de movimento mais rápido, com maior impulso métrico. O tempo cortado é padrão em marchas e movimentos rápidos do período Clássico.',
          tryThisLabel: 'Acompanha em tempo cortado: 2 tempos por compasso',
        },
      ],
      tasks: [
        {
          instruction:
            'Bate um padrão de 7/8 agrupado como 2+2+3: conta "1-2, 1-2, 1-2-3" com ênfase no primeiro tempo de cada grupo. Depois reagrupa como 3+2+2: "1-2-3, 1-2, 1-2". O carácter muda completamente embora o total de tempos seja o mesmo',
        },
        {
          instruction:
            'Bate palmas num padrão de 5/4: experimenta 2+3 ("1-2, 1-2-3") depois 3+2 ("1-2-3, 1-2"). O primeiro sente-se como uma marcha com um tropeção extra; o segundo sente-se como uma valsa com ímpeto adicional',
        },
        {
          instruction:
            'Alterna um compasso de 4/4 com um de 3/4 e repete o ciclo várias vezes — este é o compasso misto mais simples. Repara como a duração variável do compasso cria um carácter rítmico imprevisível e assimétrico mesmo a partir de dois compassos simétricos',
        },
      ],
    },

    // ── U14 M3: Chromatic Embellishment ──────────────────────────────────────
    l4u14m3: {
      title: 'Ornamentação Cromática',
      subtitle:
        'Acrescentar cor cromática à harmonia diatónica sem mudar de tonalidade',
      objectives: [
        'Reconhecer notas de passagem cromáticas e bordaduras cromáticas',
        'Distinguir ornamentação cromática (decorativa) de cromatismo estrutural (dominantes secundárias, modulação)',
        'Ouvir como o movimento cromático acrescenta suavidade e cor à condução de vozes',
      ],
      concepts: [
        {
          title: 'Notas de Passagem e Bordaduras Cromáticas',
          explanation:
            'Uma nota de passagem cromática preenche um tom com uma nota não diatónica: C-C#-D usa o C# cromático para ligar dois tons diatónicos suavemente. Uma bordadura cromática orbita uma nota do acorde usando um meio-tom cromático: E-Eb-E cria uma órbita mais apertada do que uma bordadura diatónica. Ambas acrescentam suavidade e cor a linhas diatónicas de outro modo simples. São especialmente comuns em linhas de baixo e vozes interiores, onde o cromatismo acrescentado enriquece a textura sem perturbar a melodia.',
          tryThisLabel: 'Ouve todos os 12 passos cromáticos',
        },
        {
          title: 'Ornamentação vs. Cromatismo Estrutural',
          explanation:
            'Neste nível, o cromatismo é decorativo — acrescenta cor à harmonia diatónica sem mudar de tonalidade. Uma nota de passagem cromática entre os graus 4 e 5 é decoração. Um acorde V/V (dominante secundária) é cromatismo estrutural que aponta brevemente para um novo centro tonal. A distinção é importante: a ornamentação decora a superfície enquanto a estrutura altera a direção harmónica. O cromatismo estrutural, incluindo dominantes secundárias e modulação, vem no Nível 5.',
          tryThisLabel: 'O enquadramento diatónico que o cromatismo decora',
        },
        {
          title: 'Troca de Vozes Cromática',
          explanation:
            'Uma troca de vozes cromática é uma técnica especial em que uma voz se move cromaticamente para cima enquanto outra se move cromaticamente para baixo, envolvendo frequentemente um intervalo de sexta aumentada que expande para uma oitava. Por exemplo, o baixo pode subir C-C# enquanto uma voz superior desce E-Eb, ambas convergindo em D. Isto cria um efeito marcante de movimento cruzado que acrescenta intensidade e sofisticação à condução de vozes sem sair da tonalidade.',
          tryThisLabel: 'Os passos cromáticos são a matéria-prima',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "chromatic scale" e toca-a — cada nota está a meio-tom de distância. Agora toca "C major scale" — repara nos tons (C-D, D-E, F-G, G-A, A-B) que o cromatismo poderia preencher',
        },
        {
          instruction:
            'Imagina a linha de baixo C-C#-D sob uma mudança de acorde de I para ii em Dó maior. O C# é uma nota de passagem cromática — não muda de tonalidade, simplesmente suaviza o movimento de um tom de C para D',
        },
        {
          instruction:
            'Compara "C major scale" (7 notas por oitava) com "chromatic scale" (12 notas por oitava). As 5 notas cromáticas adicionais são a matéria-prima para ornamentação cromática dentro de uma tonalidade diatónica',
        },
      ],
    },

    // ── U14 M4: Roman Numeral Analysis Practice ─────────────────────────────
    l4u14m4: {
      title: 'Prática de Análise com Numerais Romanos',
      subtitle:
        'Analisar progressões harmónicas reais com notação completa de numerais romanos',
      objectives: [
        'Analisar progressões de acordes com notação completa de numerais romanos incluindo qualidade e inversão',
        'Identificar cadências, notas estranhas ao acorde e inversões em contexto',
        'Desenvolver fluência na leitura de texturas de coral e rotulagem de função harmónica',
      ],
      concepts: [
        {
          title: 'O Método de Análise',
          explanation:
            'A análise com numerais romanos segue um processo sistemático: (1) determinar a tonalidade a partir da armação de clave e dos padrões cadenciais, (2) em cada ponto de ritmo harmónico, identificar o acorde — que notas estão a soar, (3) determinar a fundamental e a qualidade, (4) rotular com numeral romano, símbolo de qualidade e cifra de inversão, (5) identificar notas estranhas ao acorde como notas que não pertencem ao acorde, (6) marcar cadências nos finais de frases. Este método transforma a escuta intuitiva em compreensão estruturada.',
          tryThisLabel: 'Vê todos os acordes disponíveis para análise em Dó',
        },
        {
          title: 'Leitura de Texturas de Coral',
          explanation:
            'A textura de coral a quatro vozes coloca soprano e contralto na pauta de clave de sol (hastes para cima e para baixo respetivamente), tenor e baixo na pauta de clave de fá. Começa a análise identificando a nota do baixo — ela determina a inversão. Depois identifica as restantes notas do acorde acima. Circunda quaisquer notas que não encaixem no acorde — são notas estranhas. Suspensões e notas de passagem podem fazer os acordes parecerem errados à superfície; analisa sempre a harmonia subjacente no ponto de resolução.',
          tryThisLabel: 'Um acorde simples para praticar a identificação',
        },
        {
          title: 'Armadilhas Comuns na Análise',
          explanation:
            'O erro mais comum é identificar incorretamente acordes em inversão olhando apenas para a nota do baixo. Um acorde com E no baixo, G acima e C acima não é Mi menor — é Dó maior em primeira inversão (I6). Outra armadilha: as suspensões fazem o acorde parecer "errado" no momento da dissonância. Analisa sempre até à resolução para determinar a harmonia real. O contexto determina a melhor leitura quando uma nota pode servir tanto como nota do acorde como nota estranha.',
          tryThisLabel: 'C/E é I6, não um acorde de E',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "C/E" — isto é Dó maior em primeira inversão (I6 em Dó maior). A nota do baixo é E, mas o acorde continua a ser Dó maior. Pratica a identificação da fundamental, não apenas da nota mais grave',
        },
        {
          instruction:
            'Analisa esta progressão em Dó maior: C-Dm-G-C. Em numerais romanos: I-ii-V-I. Etiquetas de função: T-PD-D-T. Esta é a frase harmónica fundamental na sua forma mais simples',
        },
        {
          instruction:
            'Acrescenta uma inversão: C-Dm/F-G7-C torna-se I-ii6-V7-I. O acorde ii em primeira inversão coloca F no baixo, criando uma linha de baixo suave por grau conjunto: C-F-G-C. As inversões são uma ferramenta para controlar a condução da voz do baixo',
        },
      ],
    },

    // ── U14 M5: Minor Key Harmony in Detail ─────────────────────────────────
    l4u14m5: {
      title: 'Harmonia em Modo Menor em Detalhe',
      subtitle:
        'Como as três formas da escala menor criam um vocabulário de acordes fluido e alargado',
      objectives: [
        'Compreender como as três formas da escala menor produzem diferentes qualidades de acordes diatónicos',
        'Conhecer o vocabulário prático de acordes em tonalidades menores extraído das três formas',
        'Reconhecer o acorde subtónico VII na menor natural e o problema do III+ aumentado na menor harmónica',
      ],
      concepts: [
        {
          title: 'A Paleta de Acordes em Modo Menor',
          explanation:
            'Na prática, as tonalidades menores extraem acordes das três formas da escala menor: V e vii° da menor harmónica (porque a sensível é necessária para cadências fortes), i, iv, VI e III da menor natural (usando o 6.º e 7.º graus inalterados), e II e IV da menor melódica ascendente (que eleva o 6.º grau). Isto dá às tonalidades menores mais opções de acordes do que às maiores, não menos. O compositor escolhe qual forma usar com base nas necessidades de condução de vozes e na cor harmónica desejada.',
          tryThisLabel: 'Vê a base da menor natural',
        },
        {
          title: 'O Subtónico VII e o III+ Aumentado',
          explanation:
            'Na menor natural, o 7.º grau está a um tom abaixo da tónica, produzindo uma tríade maior VII em vez do vii° diminuto encontrado na menor harmónica. O VII frequentemente move-se para III ou cria uma cadência de sabor Mixolídio comum no rock e pop. Construir uma tríade no 3.º grau da menor harmónica produz uma tríade aumentada (III+) porque o 7.º grau elevado torna-se a 5.ª dessa tríade. O III+ é áspero e raramente usado; os compositores usam quase sempre o III da menor natural (uma tríade maior simples).',
          tryThisLabel: 'Vê o 7.º grau elevado que cria V e vii°',
        },
        {
          title: 'O Sistema Menor Fluido',
          explanation:
            'Ao contrário do modo maior (uma escala, um conjunto fixo de acordes diatónicos), o menor é fluido — o 6.º e 7.º graus são variáveis. Esta variabilidade é uma característica, não um defeito. Uma passagem em modo menor pode usar uma cadência III-VII da menor natural numa frase e uma cadência V-i da menor harmónica na seguinte, extraindo livremente de toda a paleta. Compreender esta fluidez é essencial para analisar música real, onde a harmonia em modo menor raramente se mantém dentro de uma única forma de escala ao longo de toda a peça.',
          tryThisLabel: 'Compara com a menor natural acima',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "A natural minor scale" depois "A harmonic minor scale" — a única diferença é G vs. G#. Essa única nota elevada transforma o acorde v em V e o acorde VII em vii°, alterando as possibilidades harmónicas',
        },
        {
          instruction:
            'Toca "Am" depois "E major chord" (V-i com a sensível G# da menor harmónica). Agora toca "Am" depois "Em" (v-i com o G natural da menor natural). Ouve como o V maior cria uma resolução muito mais forte para a tónica',
        },
        {
          instruction:
            'Em Lá menor, o acorde subtónico VII é Sol maior (G-B-D). Toca "G major chord" depois "C major chord" (VII-III em Lá menor). Esta progressão da menor natural ouve-se constantemente no rock e pop como bVII-bIII',
        },
      ],
    },
  },
};

export default curriculumL4;
