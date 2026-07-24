import type { CurriculumLevelOverlay } from '../types';

const curriculumL7: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    u21: {
      title: 'Harmonia Jazz',
      description:
        'Cifras de jazz, extensões, voicings de shell, progressões ii-V-I, substituição tritónica, formas de blues, rhythm changes e turnarounds',
    },
    u22: {
      title: 'Jazz Avançado, Modal e Pop',
      description:
        'Teoria acorde-escala, estruturas superiores, rearmonização, mudanças de Coltrane, progressões modais, voicings quartais e pedais',
    },
    u23: {
      title: 'Harmonia Pop e Taxonomia Completa',
      description:
        'Progressões pop, números de Nashville, mistura modal, mediantes cromáticas, todas as 46 escalas (modos de menor melódica, modos de menor harmónica, simétricas, do mundo) e todos os 42 tipos de acordes',
    },
  },

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: {
    // ══════════════════════════════════════════════════════════════════════════
    // Unidade 21: Harmonia Jazz
    // ══════════════════════════════════════════════════════════════════════════

    // ── U21 M1: Jazz Chord Symbols and Extensions ─────────────────────────
    l7u21m1: {
      title: 'Cifras de Jazz e Extensões',
      subtitle:
        'A linguagem de acordes baseada em letras do jazz — qualidades, extensões e alterações',
      objectives: [
        'Ler e escrever cifras de jazz fluentemente, incluindo indicadores de qualidade (maj7, m7, 7, ø7, o7)',
        'Construir acordes com extensões (nona, décima primeira, décima terceira) e compreender o princípio de empilhamento',
        'Distinguir entre extensões (implicam a sétima) e notas adicionadas (sem sétima)',
        'Compreender como as alterações (b9, #9, #11, b13) modificam cromaticamente as extensões',
      ],
      concepts: [
        {
          title: 'O Sistema de Cifras de Jazz',
          explanation:
            'O jazz usa um sistema baseado em letras em vez de numerais romanos. Uma letra de fundamental (C, D, E...) é seguida por um indicador de qualidade: maj7 (ou triângulo) para brilhante e estável, m7 (ou traço) para quente e escuro, 7 para tensão dominante, ø7 para semidiminuto instável, e o7 para simetria diminuta. Este sistema é universal em lead sheets e fake books de jazz. Todo o músico de jazz tem de ler cifras à primeira vista — a cifra É o acorde.',
          tryThisLabel: 'Constrói Cmaj7 — o acorde de sétima maior brilhante e estável',
        },
        {
          title: 'Extensões: Nona, Décima Primeira, Décima Terceira',
          explanation:
            'As extensões são notas do acorde além da sétima, construídas continuando a empilhar terças acima da oitava. A nona é uma oitava mais uma segunda, a décima primeira é uma oitava mais uma quarta, e a décima terceira é uma oitava mais uma sexta. Uma cifra com 13 implica que a sétima, a nona e a décima terceira estão presentes — a décima primeira é geralmente omitida em acordes maiores e dominantes porque a décima primeira natural choca com a terça maior. Extensões vs. notas adicionadas: Cmaj9 implica sétima; Cadd9 não. Cada extensão acrescenta riqueza harmónica e especificidade ao voicing.',
          tryThisLabel: 'Ouve G13 — extensões empilhadas até à décima terceira',
        },
        {
          title: 'Alterações: b9, #9, #11, b13',
          explanation:
            'As alterações modificam cromaticamente as extensões em acordes dominantes. A b9 escurece o som, comum em V7 a resolver para menor. A #9 é o "acorde de Hendrix" com o seu timbre blues — na realidade uma terça menor acima da fundamental, notada como nona aumentada. A #11 substitui a décima primeira natural por uma cor lídia, evitando o choque terça/décima primeira. A b13 cria um som dominante alterado e tenso, enarmónico com #5. Estas alterações dão aos músicos de jazz um controlo preciso sobre cor e tensão em qualquer acorde dominante.',
          tryThisLabel: 'Constrói C7b9 — dominante escurecida a resolver para menor',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "Cmaj9", "Dm11" e "G13" um após o outro. Para cada acorde, identifica a fundamental, a qualidade e que extensões estão presentes. Repara como maj9 implica maj7, m11 implica m7+9+11 e 13 implica 7+9+13.',
        },
        {
          instruction:
            'Compara "Cmaj9" com "Cadd9". O primeiro implica sétima (C-E-G-B-D); o segundo não (C-E-G-D). Esta distinção — extensão vs. nota adicionada — é crítica para ler cifras de jazz corretamente.',
        },
        {
          instruction:
            'Constrói uma escada de alterações dominantes: escreve "C7", depois "C7b9", depois "C7#9", depois "C7#11". Cada alteração modifica cromaticamente uma extensão mantendo o shell dominante (C-E-Bb) intacto.',
        },
      ],
    },

    // ── U21 M2: Shell Voicings and Altered Chords ─────────────────────────
    l7u21m2: {
      title: 'Voicings de Shell e Acordes Alterados',
      subtitle:
        'Shells de fundamental-terça-sétima, o acorde alt e dominantes suspensas',
      objectives: [
        'Construir voicings de shell (fundamental, terça, sétima) para cada qualidade de acorde',
        'Compreender por que o shell define o acorde — as extensões são cor, o shell é identidade',
        'Construir o acorde "alt" (7alt) e compreender o seu papel de tensão máxima',
        'Usar acordes sus4 e 7sus4 como voicings dominantes pré-resolução',
      ],
      concepts: [
        {
          title: 'Voicings de Shell: Fundamental, Terça, Sétima',
          explanation:
            'Os voicings de shell reduzem o acorde ao essencial: fundamental, terça e sétima. Estas três notas definem a qualidade — terça maior + sétima maior = maj7, terça menor + sétima menor = m7, terça maior + sétima menor = dominante 7. A quinta é omitida porque não acrescenta informação de qualidade (é perfeita em todos os tipos padrão). As extensões são sobrepostas ao shell. Os voicings de shell são o ponto de partida para o acompanhamento de piano jazz e a chord-melody na guitarra: aprende os shells, depois veste-os com extensões.',
          tryThisLabel: 'Constrói Dm7 — ouve o shell menor (D, F, C)',
        },
        {
          title: 'O Acorde Alt: Tensão Cromática Máxima',
          explanation:
            'C7alt é um acorde de sétima dominante com todas as extensões alteradas: b9, #9, #11 (enarmónico de b5) e b13 (enarmónico de #5). Concentra a tensão cromática máxima possível antes da resolução — cada nota fora do shell está cromaticamente deslocada. O acorde alt emparelha-se exclusivamente com a escala alterada (superlócria), que é o modo 7 da menor melódica um meio-tom acima da fundamental (C alterada = Db menor melódica). Este é o som dominante de referência para resolver para acordes menores no jazz.',
          tryThisLabel: 'Constrói C7alt — todas as extensões alteradas',
        },
        {
          title: 'Dominantes Suspensas: 7sus4',
          explanation:
            'O acorde 7sus4 substitui a terça por uma quarta num acorde de sétima dominante, criando um som aberto e não resolvido. C7sus4 contém C-F-G-Bb — sem Mi, portanto sem identidade maior/menor. No jazz, o 7sus4 funciona como voicing pré-resolução: a quarta suspensa resolve para a terça, e depois o acorde inteiro resolve para I. O 7sus4 também serve como sonoridade modal de pendor dórico: um acorde 9sus construído uma quinta perfeita acima da fundamental de um acorde menor (a posição V-de-ii, por exemplo G9sus sobre Dm ou no lugar dele) substitui o acorde ii — Dm11/G é uma grafia comum do mesmo som. O sus2 funciona de forma semelhante, substituindo a terça por uma segunda para uma qualidade brilhante e aberta.',
          tryThisLabel: 'Ouve G7sus4 — dominante suspensa, sem terça',
        },
      ],
      tasks: [
        {
          instruction:
            'Constrói shells em várias qualidades: escreve "Cmaj7", "Cm7", "C7", "Cm7b5". Em cada um, identifica a fundamental, terça e sétima. A terça e a sétima mudam — é isso que torna cada qualidade distinta.',
        },
        {
          instruction:
            'Escreve "C7alt" — é um acorde de sétima dominante com todas as extensões alteradas (b9, #9, #11/b5, b13/#5). Conta as notas cromáticas em comparação com um C7 simples. Este acorde é tensão máxima antes da resolução.',
        },
        {
          instruction:
            'Compara "G7" com "G7sus4" — o sus4 substitui o B (terça maior) por C (quarta perfeita). A função dominante mantém-se (a b7 continua a puxar para baixo), mas o som é aberto e não resolvido.',
        },
      ],
    },

    // ── U21 M3: The ii-V-I Progression ────────────────────────────────────
    l7u21m3: {
      title: 'A Progressão ii-V-I',
      subtitle:
        'A unidade fundamental da harmonia jazz — em tonalidades maiores e menores',
      objectives: [
        'Dominar a progressão ii-V-I em tonalidades maiores (Dm7-G7-Cmaj7)',
        'Dominar a progressão ii-V-i em tonalidades menores (Dm7b5-G7b9-Cm7)',
        'Compreender pares ii-V relacionados — todo V7 pode ser precedido pelo seu ii',
        'Analisar standards de jazz como cadeias de unidades ii-V-I, algumas completas, outras parciais',
      ],
      concepts: [
        {
          title: 'ii-V-I Maior',
          explanation:
            'A ii-V-I é a unidade fundamental da harmonia jazz. Em Dó maior: Dm7-G7-Cmaj7. O ii (Dm7) funciona como pré-dominante, preparando o V7 (G7) cujo trítono (B-F) cria tensão máxima, resolvendo para Cmaj7. A condução de vozes é notavelmente suave: a terça do ii (F) torna-se a sétima do V, a sétima do ii (C) desce para a terça do V (B), e o trítono do V resolve para dentro, para a fundamental e a terça do I. Esta unidade de três acordes impulsiona virtualmente todos os standards de jazz.',
          tryThisLabel: 'Começa a ii-V-I: toca Dm7 (ii em Dó)',
        },
        {
          title: 'ii-V-i Menor',
          explanation:
            'A ii-V-i menor usa o ii semidiminuto e um V dominante alterado. Em Dó menor: Dm7b5-G7b9-Cm7. O Dm7b5 (semidiminuto) tem uma cor pré-dominante mais escura do que o m7 usado no modo maior. O G7b9 adiciona a b9 (Láb) — a alteração escura e tensa que puxa para uma resolução menor. A b9 é a b6 da tonalidade menor de destino, razão pela qual soa "certa" ao resolver para menor. Muitos músicos de jazz usam G7alt em vez de G7b9 para uma tensão cromática ainda maior.',
          tryThisLabel: 'Constrói Dm7b5 — o ii semidiminuto para menor',
        },
        {
          title: 'Pares ii-V Relacionados',
          explanation:
            'Todo acorde de sétima dominante pode ser precedido pelo seu ii relacionado — o m7 construído uma quarta perfeita abaixo da fundamental do dominante (ou uma quinta acima). Isto "prepara" o dominante e cria uma condução de vozes mais suave. Se uma música tem E7 a resolver para algum lado, podes inserir Bm7 antes: Bm7-E7 é um par ii-V. Os músicos de jazz encadeiam estes pares em centros tonais diferentes: Bm7-E7-Am7-D7-Gmaj7 é uma cadeia de pares ii-V em cascata pelo ciclo de quintas, cada par a apontar para a tonalidade seguinte.',
          tryThisLabel: 'Ouve G7 — o V da ii-V-I em Dó',
        },
      ],
      tasks: [
        {
          instruction:
            'Constrói uma ii-V-I maior em Dó: escreve "Dm7", depois "G7", depois "Cmaj7". Ouve a tensão a construir-se do ii ao V e a resolver no I. O trítono no G7 (B e F) resolve para dentro, para C e E.',
        },
        {
          instruction:
            'Agora constrói uma ii-V-i menor em Dó menor: escreve "Dm7b5", depois "G7b9", depois "Cm7". Compara a atmosfera — o ii semidiminuto e a alteração b9 escurecem tudo em comparação com a versão maior.',
        },
        {
          instruction:
            'Encadeia pares ii-V: escreve "Em7", "A7", "Dm7", "G7", "Cmaj7". Esta é uma ii-V-I em cascata onde cada par aponta para o seguinte — Em7-A7 aponta para Dm7, depois Dm7-G7 aponta para Cmaj7. O ciclo de quintas em ação.',
        },
      ],
    },

    // ── U21 M4: Tritone Substitution ──────────────────────────────────────
    l7u21m4: {
      title: 'Substituição Tritónica',
      subtitle:
        'Substituir dominantes a um trítono de distância para movimento cromático do baixo',
      objectives: [
        'Aplicar substituição tritónica a qualquer acorde de sétima dominante',
        'Compreender por que as substituições tritónicas funcionam — trítono partilhado entre os dois dominantes',
        'Adicionar o ii relacionado do dominante substituto para uma linha cromática ainda mais rica',
        'Reconhecer o dominante da "porta de trás" (bVII7-I) como uma técnica de rearmonização relacionada',
      ],
      concepts: [
        {
          title: 'A Substituição Tritónica',
          explanation:
            'Substitui qualquer acorde de sétima dominante pelo acorde de sétima dominante a um trítono de distância. G7 a resolver para C torna-se Db7 a resolver para C. Funciona porque G7 e Db7 partilham o mesmo intervalo de trítono (B-F enarmónico de Cb-F) — o par de notas que impulsiona a resolução. A fundamental e a quinta mudam, mas o motor do trítono mantém-se intacto. O movimento cromático do baixo resultante (Db a descer para C) é mais suave do que o movimento pelo ciclo de quintas (G para C), criando uma descida sofisticada por meio-tom.',
          tryThisLabel: 'Ouve Db7 — a substituição tritónica de G7',
        },
        {
          title: 'Substituição Tritónica com ii Relacionado',
          explanation:
            'Adicionar o ii relacionado do dominante substituto cria uma linha cromática ainda mais rica. O ii de Db7 é Abm7, portanto a ii-V-I completa com substituição tritónica é: Abm7-Db7-Cmaj7. A linha do baixo desce cromaticamente: Láb-Réb-Dó. Compara com a original: Dm7-G7-Cmaj7 (baixo: Ré-Sol-Dó). Ambas chegam a Dó, mas o caminho da substituição tritónica é inteiramente cromático. Os arranjadores de jazz misturam frequentemente ambas as abordagens na mesma peça.',
          tryThisLabel: 'Constrói Abm7 — o ii relacionado da substituição tritónica',
        },
        {
          title: 'O Dominante da Porta de Trás',
          explanation:
            'O dominante da porta de trás (bVII7-I) aborda a tónica a partir de um tom abaixo em vez de uma quinta acima. Em Dó: Bb7-Cmaj7. A terça de Bb7 (Ré) resolve para cima para a terça de Cmaj7 (Mi), e a sétima de Bb7 (Láb) resolve para baixo para a quinta de Cmaj7 (Sol). Isto cria uma resolução surpreendente e quente que evita a cadência V7-I esperada. Comum em standards de jazz e bossa nova, o dominante da porta de trás entende-se melhor como um empréstimo do menor paralelo — é o dominante de bIII (Mib) que chega, em vez disso, a I. As suas notas-guia (Ré e Láb) também existem no dominante alterado da tonalidade (G7b9), e é por isso que Bb7 puxa tão convincentemente para Dó: Ré sobe para Mi e Láb desce para Sol, ambas sensíveis superiores em direção a Cmaj7.',
          tryThisLabel: 'Ouve Bb7 — o dominante da porta de trás em Dó',
        },
      ],
      tasks: [
        {
          instruction:
            'Aplica substituição tritónica: toca "Dm7", depois "Db7", depois "Cmaj7". O Db7 substitui G7 — mesmo trítono (F e B/Cb), mas com descida cromática do baixo (D-Db-C) em vez do ciclo de quintas (D-G-C).',
        },
        {
          instruction:
            'Constrói a ii-V completa com substituição tritónica: toca "Abm7", depois "Db7", depois "Cmaj7". A linha do baixo desce Láb-Réb-Dó — movimento puramente cromático. Compara com a original Dm7-G7-Cmaj7.',
        },
        {
          instruction:
            'Experimenta o dominante da porta de trás: toca "Bb7" depois "Cmaj7". O Bb7 resolve PARA CIMA um tom para Dó em vez de PARA BAIXO uma quinta. Soa quente e inesperado — um final surpresa favorito em baladas de jazz.',
        },
      ],
    },

    // ── U21 M5: Blues Forms ────────────────────────────────────────────────
    l7u21m5: {
      title: 'Formas de Blues',
      subtitle: 'O blues de 12 compassos, jazz blues e blues menor',
      objectives: [
        'Tocar a forma básica do blues de 12 compassos usando acordes de sétima dominante',
        'Compreender o enriquecimento do jazz blues: inserções ii-V, substituições tritónicas, acordes diminutos de passagem',
        'Construir uma forma de blues menor com acordes m7 e bVI7',
        'Reconhecer por que todos os acordes no blues são dominantes — a tensão omnipresente É o som do blues',
      ],
      concepts: [
        {
          title: 'O Blues de 12 Compassos',
          explanation:
            'O blues de 12 compassos é a forma mais tocada no jazz e na música popular. É construído sobre três acordes de sétima dominante: I7 durante quatro compassos, IV7 durante dois, I7 durante dois, depois V7-IV7-I7-V7 nos últimos quatro. Em Dó: C7-C7-C7-C7 / F7-F7-C7-C7 / G7-F7-C7-G7. Na teoria clássica, apenas o V deveria ser dominante, mas no blues TODOS os acordes são dominantes. Essa tensão dominante omnipresente — trítonos em todo o lado, nada totalmente resolvido — É o som do blues. Todo o músico de jazz tem de navegar esta forma nas 12 tonalidades.',
          tryThisLabel: 'Ouve C7 — o acorde tónico do blues em Dó',
        },
        {
          title: 'Jazz Blues',
          explanation:
            'O jazz blues enriquece a forma básica de 12 compassos com inserções ii-V, substituições tritónicas e acordes diminutos de passagem. Um jazz blues comum em Dó: C7 / F7 / C7 / C7 / F7 / F#dim7 / C7 / Am7 / Dm7 / G7 / C7-Am7 / Dm7-G7. O #IVdim7 (F#dim7) funciona como acorde de passagem cromática entre IV7 e I7. Os últimos quatro compassos tornam-se um turnaround com um ii-V (Dm7-G7) que recicla para o início. O bird blues (Charlie Parker) acrescenta ainda mais substituições e cadeias ii-V.',
          tryThisLabel: 'Constrói F7 — o IV7 do blues em Dó',
        },
        {
          title: 'Blues Menor',
          explanation:
            'O blues menor substitui os acordes dominantes do I e IV por acordes m7, criando uma atmosfera mais escura e melancólica. Um blues menor padrão em Dó: Cm7-Cm7-Cm7-Cm7 / Fm7-Fm7-Cm7-Cm7 / Ab7-G7-Cm7-G7. O bVI7 (Ab7) substitui o V7 no compasso 9, criando uma abordagem cromática ao V7 (G7) no compasso 10. O blues menor é a fundação do hard bop e do soul jazz. A atmosfera geral é mais pesada e introspetiva do que o blues maior.',
          tryThisLabel: 'Ouve Cm7 — a tónica do blues menor em Dó',
        },
      ],
      tasks: [
        {
          instruction:
            'Constrói as mudanças básicas do blues: toca "C7", "F7", "G7". Todos são acordes de sétima dominante — na teoria clássica só o V deveria ser dominante, mas no blues todos o são. Essa tensão omnipresente É o som do blues.',
        },
        {
          instruction:
            'Acrescenta o acorde de passagem do jazz blues: toca "F7" depois "F#dim7" depois "C7". O acorde diminuto liga o IV7 ao I7 com uma subida cromática do baixo (F-F#-G, onde Sol é a quinta de Dó). Este é o movimento emblemático do jazz blues.',
        },
        {
          instruction:
            'Constrói a cadência do blues menor: toca "Ab7" depois "G7" depois "Cm7". O bVI7 (Ab7) desce cromaticamente para V7 (G7), que resolve para a tónica menor (Cm7). Esta cadência bVI7-V7-i define o som do blues menor.',
        },
      ],
    },

    // ── U21 M6: Rhythm Changes and Turnarounds ───────────────────────────
    l7u21m6: {
      title: 'Rhythm Changes e Turnarounds',
      subtitle:
        'A forma AABA, padrões de turnaround e o ciclo de dominantes',
      objectives: [
        'Compreender rhythm changes como uma forma AABA de 32 compassos',
        'Construir padrões de turnaround: I-vi-ii-V, cromático, abordagem diminuta',
        'Analisar a ponte dos rhythm changes como um ciclo de dominantes (III7-VI7-II7-V7)',
        'Aplicar turnarounds no final de qualquer secção para criar ciclos harmónicos suaves',
      ],
      concepts: [
        {
          title: 'Rhythm Changes',
          explanation:
            'Os rhythm changes, derivados de Gershwin, são uma das duas formas mais comuns no jazz (a outra sendo o blues). É uma estrutura AABA de 32 compassos. As secções A usam uma progressão baseada em turnaround: I-vi-ii-V em Sib maior torna-se Bbmaj7-Gm7-Cm7-F7. A ponte (secção B) percorre dominantes em ciclo de quartas: D7-G7-C7-F7 (III7-VI7-II7-V7). Esta ponte é um dos grandes desafios de improvisação — quatro centros tonais diferentes em oito compassos. Centenas de composições de jazz usam rhythm changes como a sua base harmónica.',
          tryThisLabel: 'Constrói Bbmaj7 — a tónica dos rhythm changes',
        },
        {
          title: 'Padrões de Turnaround',
          explanation:
            'Um turnaround é uma progressão curta (geralmente dois compassos) no final de uma secção que recicla para o início. O turnaround básico é I-vi-ii-V: em Dó, Cmaj7-Am7-Dm7-G7. Variantes incluem o turnaround cromático (I-bIII7-bVI7-bII7: Cmaj7-Eb7-Ab7-Db7) onde cada acorde é uma substituição tritónica, e a abordagem diminuta (I-#Io7-ii-V: Cmaj7-C#dim7-Dm7-G7) onde o acorde diminuto fornece uma ligação cromática no baixo. Cada turnaround cria uma sensação satisfatória de circularidade harmónica.',
          tryThisLabel: 'Ouve Am7 — o vi num turnaround em Dó',
        },
        {
          title: 'O Ciclo de Dominantes',
          explanation:
            'A ponte dos rhythm changes usa um ciclo de acordes de sétima dominante que se movem em quartas: D7-G7-C7-F7 em Sib. Cada dominante resolve para o seguinte como se fosse um V-I, mas o "I" é ele próprio um acorde dominante, portanto a resolução é perpetuamente adiada. Isto cria impulso para a frente sem nunca pousar numa tónica estável. O ciclo de dominantes aparece por todo o jazz — em pontes, introduções e passagens de transição. Cada acorde dominante implica brevemente o seu próprio centro tonal, tornando-o um terreno rico para improvisação.',
          tryThisLabel: 'Constrói D7 — o primeiro dominante no ciclo da ponte',
        },
      ],
      tasks: [
        {
          instruction:
            'Constrói um turnaround em Dó: toca "Cmaj7", "Am7", "Dm7", "G7". Este loop I-vi-ii-V é a secção A dos rhythm changes (transposta de Sib). Repara como o G7 no final te puxa de volta para Cmaj7.',
        },
        {
          instruction:
            'Constrói o ciclo da ponte dos rhythm changes: toca "D7", "G7", "C7", "F7". Cada dominante resolve para o seguinte por uma quarta — movimento perpétuo. Experimenta emparelhar cada acorde com a sua escala mixolídia para ideias de improvisação.',
        },
        {
          instruction:
            'Aplica o turnaround cromático: toca "Cmaj7", "Eb7", "Ab7", "Db7". Cada acorde após o I é uma substituição tritónica — Eb7 substitui A7, Ab7 substitui D7, Db7 substitui G7. As fundamentais C-Eb-Ab-Db sobem uma terça menor e depois duas quartas perfeitas — e o Db7 final resolve meio tom abaixo para Dó, a recompensa cromática das substituições.',
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // Unidade 22: Jazz Avançado, Modal e Pop
    // ══════════════════════════════════════════════════════════════════════════

    // ── U22 M1: Chord-Scale Theory ────────────────────────────────────────
    l7u22m1: {
      title: 'Teoria Acorde-Escala',
      subtitle:
        'Emparelhar escalas com cifras — o núcleo da improvisação jazz',
      objectives: [
        'Mapear cada qualidade padrão de acorde para as suas escalas primárias e alternativas',
        'Compreender por que certas escalas "funcionam" sobre certos acordes — notas comuns do acorde como base',
        'Aplicar a teoria acorde-escala para analisar e improvisar sobre progressões ii-V-I',
        'Usar a escala alterada para acordes 7alt e a lídia dominante para acordes 7#11',
      ],
      concepts: [
        {
          title: 'O Mapa Acorde-Escala',
          explanation:
            'Cada acorde implica uma ou mais escalas compatíveis que fornecem a paleta de notas para melodia e improvisação. Maj7 mapeia para jónio ou lídio, m7 para dórico (mais comum), eólio ou frígio. Dominante 7 mapeia para mixolídio, lídio dominante, alterada, tons inteiros ou diminuta meio-tom/tom dependendo do contexto harmónico. Semidiminuto (m7b5) mapeia para lócrio ou lócrio natural 2. Diminuto completo usa a escala diminuta tom/meio-tom. O m(maj7) mapeia para menor melódica ou menor harmónica. Este sistema é o núcleo da pedagogia de improvisação jazz.',
          tryThisLabel: 'Vê a escala alterada — a escala para C7alt',
        },
        {
          title: 'Escolhas Acorde-Escala para Dominantes',
          explanation:
            'O acorde de sétima dominante tem o conjunto mais rico de escolhas de escala, determinado pelo contexto harmónico. Dominante não alterado (a resolver normalmente) usa mixolídio. Dominante com #11 usa lídio dominante (modo 4 da menor melódica). Dominante a resolver para menor usa alterada ou frígio dominante. Dominante com b9 num contexto diminuto usa diminuta meio-tom/tom. Dominante com sonoridade de tons inteiros usa a escala de tons inteiros. A escolha não é arbitrária — depende de para onde o acorde resolve e que extensões estão especificadas na cifra.',
          tryThisLabel: 'Ouve lídio dominante — o som dominante com #11',
        },
        {
          title: 'Alinhamento Acorde-Escala em ii-V-I',
          explanation:
            'Numa ii-V-I maior em Dó, o alinhamento acorde-escala é: Dm7 = Ré dórico, G7 = Sol mixolídio, Cmaj7 = Dó jónio (ou Dó lídio). As três escalas partilham as mesmas notas — são modos de Dó maior. Isto significa que o improvisador pode pensar numa só tonalidade ao longo de toda a progressão. No modo menor, o alinhamento muda: Dm7b5 = Ré lócrio nat.2, G7alt = Sol alterada (Láb menor melódica), Cm(maj7) = Dó menor melódica. Agora três conjuntos de notas diferentes estão em jogo, exigindo pensamento mais rápido.',
          tryThisLabel: 'Vê Ré dórico — a escala de acorde para Dm7 em Dó maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Emparelha acorde com escala: escreve "Dm7" (dórico), depois "D dorian" para ver a escala. Agora experimenta "G7" (mixolídio) e "G mixolydian". As notas do acorde estão dentro da escala — isto é o alinhamento acorde-escala.',
        },
        {
          instruction:
            'Explora a dominante alterada: escreve "C altered scale", depois "C7alt". Cada nota do acorde está contida na escala. Para encontrar rapidamente qualquer escala alterada: toca menor melódica um meio-tom acima da fundamental (C alterada = Db menor melódica).',
        },
        {
          instruction:
            'Compara duas escalas dominantes: escreve "G mixolydian" (dominante não alterada) e depois "G altered scale" (alteração máxima). Mixolídio é brilhante e estável; alterada é escura e cromática. O contexto determina qual usar.',
        },
      ],
    },

    // ── U22 M2: Upper Structures and Reharmonization ──────────────────────
    l7u22m2: {
      title: 'Estruturas Superiores e Rearmonização',
      subtitle:
        'Voicings de acordes complexos com tríades simples, e enriquecimento de progressões',
      objectives: [
        'Construir tríades de estrutura superior sobre notas de baixo dominantes para voicings de extensões',
        'Compreender como a tríade superior cria extensões específicas sem soletrar cada nota',
        'Aplicar rearmonização básica: substituir acordes dentro da mesma função',
        'Usar substituições tritónicas, dominantes secundários e acordes de passagem para enriquecer progressões simples',
      ],
      concepts: [
        {
          title: 'Tríades de Estrutura Superior',
          explanation:
            'O voicing de estrutura superior coloca uma tríade simples no registo agudo sobre uma nota de baixo e guide tones no registo grave. A tríade cria extensões específicas sem soletrar cada nota individualmente. Uma tríade de Ré maior sobre um baixo de C7 resulta em C13#11 — as notas Ré, Fá# e Lá tornam-se a nona, a #11 e a décima terceira. Uma tríade de Mib maior sobre C7 produz C7#9b13. Uma tríade de Láb maior sobre C7 cria C7b9b13. A tríade superior é escolhida pelas extensões que gera, não pela sua própria identidade. Esta técnica permite a pianistas e arranjadores de jazz voicings de acordes complexos com formas simples.',
          tryThisLabel: 'Constrói C13 — ouve as extensões que uma estrutura superior cria',
        },
        {
          title: 'Princípios de Rearmonização',
          explanation:
            'A rearmonização substitui os acordes originais de uma melodia por acordes diferentes que continuam a suportar as notas melódicas. As notas da melodia tornam-se extensões diferentes dos novos acordes. Técnicas básicas: substituir acordes dentro da mesma função (iii por I, vi por IV), adicionar dominantes secundários antes de acordes-alvo, inserir substituições tritónicas, usar acordes diminutos de passagem entre acordes diatónicos e aplicar movimento cromático no baixo. Toda a rearmonização deve preservar a melodia — a nota melódica deve ser uma nota do acorde ou uma extensão aceitável do novo acorde.',
          tryThisLabel: 'Constrói Em7 — um iii que pode substituir Cmaj7',
        },
        {
          title: 'Linhas Cromáticas de Baixo e Acordes de Passagem',
          explanation:
            'Uma das ferramentas de rearmonização mais poderosas é criar uma linha cromática de baixo inserindo acordes de passagem. Entre Dó e Rém, insere C#dim7 — o baixo caminha Dó-Dó#-Ré. Entre Fá e Mim, insere F#dim7 (ou Fmaj7-F#dim7-Em7). Os acordes de sétima diminuta são os acordes de passagem mais versáteis porque cada acorde diminuto é enarmonicamente equivalente a outros três (devido à construção simétrica), ligando-se a múltiplos destinos. Combinado com substituições tritónicas e dominantes secundários, o movimento cromático do baixo transforma progressões diatónicas simples em harmonia jazz rica.',
          tryThisLabel: 'Ouve C#dim7 — um acorde de passagem cromática',
        },
      ],
      tasks: [
        {
          instruction:
            'Explora estruturas superiores: escreve "C13" — este é o som de uma tríade de Ré maior (D-F#-A = 9-#11-13) sobre um shell de C7 (C-E-Bb). A cifra complexa é realizada com uma tríade simples por cima.',
        },
        {
          instruction:
            'Experimenta uma substituição de função: toca "Cmaj7" depois "Em7". Ambos são acordes com função de tónica em Dó maior — Em7 partilha três notas com Cmaj7 (E-G-B) mas acrescenta uma cor diferente. Esta é a rearmonização mais simples.',
        },
        {
          instruction:
            'Constrói uma linha de acordes de passagem cromática: toca "Cmaj7", depois "C#dim7", depois "Dm7". O acorde diminuto cria uma subida cromática do baixo (C-C#-D) e cada voz move-se por meio-tom ou mantém-se igual.',
        },
      ],
    },

    // ── U22 M3: Coltrane Changes and Advanced Jazz Harmony ────────────────
    l7u22m3: {
      title: 'Mudanças de Coltrane e Harmonia Jazz Avançada',
      subtitle:
        'A matriz de Giant Steps, estrutura constante e arquitetura de três centros tonais',
      objectives: [
        'Analisar a matriz de Coltrane (Giant Steps) — três centros tonais maiores a uma terça maior de distância',
        'Compreender por que cada centro tonal é abordado pelo seu acorde dominante V7',
        'Reconhecer a estrutura constante como técnica relacionada — movimento paralelo de acordes independentemente da tonalidade',
        'Apreciar o desafio improvisatório de navegar três centros tonais em andamento rápido',
      ],
      concepts: [
        {
          title: 'A Matriz de Giant Steps',
          explanation:
            'John Coltrane concebeu progressões que percorrem três centros tonais maiores separados por terças maiores, dividindo a oitava em três partes iguais. A progressão de Giant Steps: Bmaj7-D7-Gmaj7-Bb7-Ebmaj7-F#7-Bmaj7, tocando nas tonalidades de Si, Sol e Mib. Cada centro tonal é abordado pelo seu acorde V7. O resultado é um ritmo harmónico extremamente rápido que exige pensar em três tonalidades simultaneamente — um dos grandes desafios da improvisação jazz e o cume do domínio acorde-escala.',
          tryThisLabel: 'Começa em Bmaj7 — o primeiro centro tonal',
        },
        {
          title: 'Estrutura Constante',
          explanation:
            'A estrutura constante move a mesma qualidade de acorde cromaticamente ou por algum padrão de intervalos independentemente da tonalidade. Cmaj7-Dbmaj7-Dmaj7-Ebmaj7 (sétimas maiores ascendentes) cria condução de vozes paralela (planing) com uma cor jazz moderna. Esta técnica abandona a harmonia funcional inteiramente — não há tonalidade, apenas movimento. Wayne Shorter e Herbie Hancock usaram estrutura constante extensivamente. Está relacionada com as mudanças de Coltrane no sentido em que ambas tratam o movimento de acordes como padrões geométricos em vez de progressões funcionais.',
          tryThisLabel: 'Ouve Dbmaj7 — estrutura constante em movimento',
        },
        {
          title: 'Improvisação em Três Centros Tonais',
          explanation:
            'Improvisar sobre mudanças de Coltrane requer pensar em três tonalidades simultaneamente em andamento rápido. A abordagem padrão: tocar a escala maior (ou pentatónica) de cada centro tonal durante a duração desse acorde, mudando instantaneamente quando a harmonia se move. Abordagens mais avançadas usam envolvimentos, padrões digitais (1235, 1357) e pentatónicas sobrepostas. A dificuldade reside na velocidade do ritmo harmónico — cada centro tonal pode durar apenas dois tempos. Este é o Evereste da improvisação jazz, exigindo domínio total das 12 tonalidades.',
          tryThisLabel: 'Ouve Gmaj7 — o segundo centro tonal',
        },
      ],
      tasks: [
        {
          instruction:
            'Segue o ciclo de Coltrane: toca "Bmaj7", "D7", "Gmaj7", "Bb7", "Ebmaj7", "F#7". Os três centros tonais (Si, Sol, Mib) distam uma terça maior — dividem a oitava em três partes iguais.',
        },
        {
          instruction:
            'Verifica a geometria dos três centros: toca "B major chord", "G major chord", "Eb major chord". Estas três fundamentais (Si, Sol, Mib) formam uma tríade aumentada — a divisão mais simétrica da oitava em três partes.',
        },
        {
          instruction:
            'Explora estrutura constante: toca "Cmaj7", "Dbmaj7", "Dmaj7", "Ebmaj7". A mesma qualidade de acorde move-se cromaticamente — movimento paralelo que abandona a harmonia funcional inteiramente. Ouve a mudança de cor à medida que a fundamental sobe.',
        },
      ],
    },

    // ── U22 M4: Modal Harmony Fundamentals ────────────────────────────────
    l7u22m4: {
      title: 'Fundamentos de Harmonia Modal',
      subtitle:
        'Compor fora da gravidade tonal — modos como sistemas harmónicos',
      objectives: [
        'Distinguir harmonia modal de harmonia tonal e compreender por que se evita o V-I',
        'Identificar a nota característica de cada modo e usá-la para selecionar acordes',
        'Construir progressões de acordes modais que preservem a cor modal',
        'Usar pedais, notas sustidas e padrões de ostinato para ancorar a tónica modal',
      ],
      concepts: [
        {
          title: 'Pensamento Modal vs. Tonal',
          explanation:
            'Na música tonal, a relação V-I define a tonalidade e cria a atração gravitacional que organiza toda a harmonia. Na música modal, o V-I é deliberadamente evitado porque colapsa a cor modal de volta para a tonalidade maior ou menor. A harmonia modal estabelece a tónica através de repetição, pedais, notas sustidas e relações de acordes não dominantes. Miles Davis, McCoy Tyner e Herbie Hancock construíram composições inteiras sobre este princípio — "So What" usa apenas dois acordes sobre um pedal dórico. O modo em si É a harmonia.',
          tryThisLabel: 'Vê Ré dórico — o pilar modal do jazz',
        },
        {
          title: 'Notas Características',
          explanation:
            'Cada modo tem uma nota que o distingue do maior simples ou do menor natural — a nota característica. O dórico tem uma sexta elevada em comparação com o menor natural (a nota que o torna mais brilhante). O frígio tem uma segunda rebaixada (escuro, sabor espanhol). O lídio tem uma quarta elevada (brilhante, flutuante, onírico). O mixolídio tem uma sétima rebaixada (blues, rock). Na teoria tonal estas são "notas a evitar", mas na escrita modal são as notas essenciais que devem ser enfatizadas tanto na melodia como nas escolhas de acordes para estabelecer o modo.',
          tryThisLabel: 'Ouve Fá lídio — a quarta elevada define-o',
        },
        {
          title: 'Progressões de Acordes Modais',
          explanation:
            'Cada modo suporta movimentos de acordes específicos que reforçam a sua cor. O acorde de cor característico do dórico é o IV maior sobre a tónica i — a sexta elevada vive nele (Dm-G-Dm); ii e bVII funcionam como cores secundárias. O frígio centra-se em i e bII — o bII está um meio-tom acima da tónica, a assinatura sonora do frígio (Em-F-Em). O acorde de cor característico do lídio é o II maior sobre a tónica I — a quarta elevada vive nele (C-D-C); vii partilha essa quarta elevada como cor secundária. O mixolídio apoia-se em I e bVII — a sétima rebaixada está no acorde bVII (G-F-Dm-G). Evita qualquer acorde que implique resolução dominante-tónica.',
          tryThisLabel: 'Vê Sol mixolídio — bVII é o acorde-chave',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "D dorian" e identifica a nota característica (Si natural — a sexta elevada). Agora escreve "D natural minor scale" e compara — apenas uma nota difere. Essa única nota define o som dórico.',
        },
        {
          instruction:
            'Escreve "E phrygian" — a nota característica é Fá (a segunda rebaixada). Constrói um vamp frígio: toca "Em" depois "F major chord" e volta a "Em". O movimento da fundamental por meio-tom é a assinatura do frígio.',
        },
        {
          instruction:
            'Compara "F lydian" com "F major scale" — a única diferença é a quarta elevada (Si natural em vez de Sib). Esta única nota transforma todo o carácter harmónico de maior estável para lídio flutuante.',
        },
      ],
    },

    // ── U22 M5: Quartal/Quintal Voicings and Drones ──────────────────────
    l7u22m5: {
      title: 'Voicings Quartais/Quintais e Pedais',
      subtitle:
        'Empilhar quartas e quintas para sons modais ambíguos e abertos',
      objectives: [
        'Construir voicings quartais (quartas perfeitas empilhadas) e compreender a sua ambiguidade harmónica',
        'Compreender voicings quintais como quartas invertidas — quintas perfeitas empilhadas para um som aberto e espaçoso',
        'Usar pedais e notas sustidas para ancorar composições modais sem função dominante',
        'Reconhecer os voicings quartais como a técnica de assinatura de McCoy Tyner no jazz modal',
      ],
      concepts: [
        {
          title: 'Voicings Quartais',
          explanation:
            'Os acordes quartais constroem-se empilhando quartas perfeitas em vez de terças. Um voicing quartal sobre Ré: Ré-Sol-Dó-Fá. Pode implicar Dm7, Dm11 ou simplesmente uma sonoridade quartal flutuante sem identidade maior/menor clara. A ambiguidade é intencional e perfeita para música modal — os voicings quartais não puxam para a resolução como as tríades. McCoy Tyner construiu toda a sua sonoridade de assinatura sobre empilhamentos quartais, movendo-os frequentemente em paralelo sobre um pedal de baixo. Na mão direita: quartas. Na mão esquerda: a tónica modal como pedal.',
          tryThisLabel: 'Ouve Dm11 — um empilhamento quartal em forma de acorde',
        },
        {
          title: 'Voicings Quintais e Espaçamento Aberto',
          explanation:
            'Os voicings quintais empilham quintas perfeitas: Ré-Lá-Mi-Si. Esta é a inversão de um voicing quartal (Ré-Sol-Dó-Fá invertido dá quintas abertas). O som é espaçoso, aberto e orquestral. Voicings quintais aparecem na música clássica do século XX (Bartok, Hindemith) e no jazz modal. Os intervalos amplos criam transparência — cada nota tem espaço para ressoar. Combinados com um pedal de baixo, os voicings quintais sugerem modalidade sem se comprometerem com nenhuma qualidade de acorde específica.',
          tryThisLabel: 'Ouve um power chord de Ré — o empilhamento de quintas mais simples',
        },
        {
          title: 'Pedais e Notas Sustidas',
          explanation:
            'Um pedal é uma nota de baixo sustida ou repetida sobre a qual as harmonias superiores mudam livremente. Uma nota sustida (drone) é um som contínuo que ancora o centro tonal. Na música modal, pedais e drones substituem a função dominante — a tónica é estabelecida por pura persistência em vez de gravidade harmónica. A música clássica indiana é inteiramente construída sobre um drone (a tanpura). Miles Davis usou pedais no jazz modal para libertar a harmonia de mudanças de acordes funcionais, permitindo ao solista explorar o modo livremente.',
          tryThisLabel: 'Vê Ré menor natural — uma escala sobre um pedal de Ré',
        },
      ],
      tasks: [
        {
          instruction:
            'Constrói um som quartal: escreve "Dm11" — contém as notas Ré-Sol-Dó-Fá quando voiceado em quartas. Compara com "Dm7" — a extensão de décima primeira acrescenta o empilhamento quartal que cria a qualidade aberta e ambígua.',
        },
        {
          instruction:
            'Explora o power chord como empilhamento mínimo de quintas: escreve "C5", depois "D5", depois "E5". Power chords não são maiores nem menores — quintas puras sem terça. Este é o pensamento quintal na sua forma mais básica.',
        },
        {
          instruction:
            'Compara "D dorian" com "D natural minor scale". Sobre um pedal em Ré, a sexta elevada do dórico (Si natural) cria uma cor modal mais brilhante. O pedal ancora Ré como tónica enquanto a escala define o modo.',
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // Unidade 23: Harmonia Pop e Taxonomia Completa
    // ══════════════════════════════════════════════════════════════════════════

    // ── U23 M1: Pop Progressions and Nashville Numbers ────────────────────
    l7u23m1: {
      title: 'Progressões Pop e Números de Nashville',
      subtitle:
        'Loops de acordes pop, o sistema de números de Nashville e harmonia baseada em loops',
      objectives: [
        'Analisar as progressões pop mais comuns e as suas assinaturas emocionais',
        'Compreender o sistema de números de Nashville e usá-lo para transposição instantânea',
        'Reconhecer a harmonia baseada em loops como abordagem distinta — o loop É a harmonia',
        'Identificar o Axis (I-V-vi-IV), Sensitive (vi-IV-I-V) e outros loops pop padrão',
      ],
      concepts: [
        {
          title: 'Progressões Pop Comuns',
          explanation:
            'A música pop assenta num pequeno conjunto de loops de acordes com assinaturas emocionais distintas. A progressão I-V-vi-IV "Axis" soa edificante e antémica. A sua rotação vi-IV-I-V ("Sensitive") soa emocional e moderna. I-bVII-IV produz uma sensação mixolídia, blues rock. A cadência "Andaluza" i-bVII-bVI-V — um baixo descendente por graus conjuntos da tónica até à dominante, vinda diretamente do flamenco — soa escura e cinemática. I-vi-IV-V é a progressão clássica dos anos 50, nostálgica e quente. Estes loops repetem-se ao longo de secções inteiras — a variação harmónica provém da melodia, produção e arranjo em vez de mudanças de acordes.',
          tryThisLabel: 'Começa o acorde I de uma progressão pop em Dó',
        },
        {
          title: 'Números de Nashville e Harmonia de Loop',
          explanation:
            'O sistema de números de Nashville simplifica os numerais romanos para músicos de sessão: números simples para acordes maiores (1, 4, 5), um traço para menor (2-, 6-), 7 sobrescrito para acordes de sétima. A tonalidade é indicada uma vez no topo da cifra e tudo o resto é relativo — "1 5 6- 4" na tonalidade de Sol significa Sol-Ré-Mim-Dó. Isto permite transposição instantânea: muda a declaração de tonalidade e toca os mesmos números. O pop moderno baseia-se em loops de 2-4 acordes que se repetem ao longo de uma secção inteira. O loop fornece estabilidade harmónica; toda a variação acontece nas camadas acima.',
          tryThisLabel: 'Lám é o vi em Dó — o centro emocional do pop',
        },
        {
          title: 'Rotações de Loop e Mudanças Emocionais',
          explanation:
            'Os mesmos quatro acordes produzem efeitos emocionais diferentes dependendo de qual acorde inicia o loop. I-V-vi-IV a começar no I soa triunfante e resolvido. vi-IV-I-V a começar no vi soa vulnerável e anelante. IV-V-vi-IV (a começar no IV) cria uma sensação de aspiração. O acorde inicial define onde se situa o "lar" emocional dentro do loop. Na produção pop, o acorde inicial alinha-se frequentemente com o gancho da melodia vocal, reforçando a forma emocional da letra.',
          tryThisLabel: 'Constrói Fá — o acorde IV que impulsiona a resolução pop',
        },
      ],
      tasks: [
        {
          instruction:
            'Constrói a progressão Axis em Dó: toca "C major chord", "G major chord", "Am", "F major chord". Este loop de quatro acordes sustenta centenas de êxitos pop — a estrutura I-V-vi-IV.',
        },
        {
          instruction:
            'Agora roda para a versão Sensitive: toca "Am", "F major chord", "C major chord", "G major chord". Os mesmos quatro acordes (vi-IV-I-V), mas a começar no acorde menor cria uma paisagem emocional completamente diferente.',
        },
        {
          instruction:
            'Experimenta o loop rock mixolídio: toca "C major chord", "Bb major chord", "F major chord". Este padrão I-bVII-IV usa um bVII emprestado do paralelo menor, dando-lhe uma sensação blues de rock clássico.',
        },
      ],
    },

    // ── U23 M2: Modal Mixture and Chromatic Mediants in Pop ───────────────
    l7u23m2: {
      title: 'Mistura Modal e Mediantes Cromáticas no Pop',
      subtitle:
        'Acordes emprestados no pop e rock, mediantes cromáticas em bandas sonoras',
      objectives: [
        'Aplicar mistura modal (acordes emprestados do paralelo menor) em contextos pop e rock',
        'Reconhecer o iv menor, bVI e bVII como os acordes emprestados mais comuns no pop',
        'Compreender mediantes cromáticas (acordes relacionados por terça maior) e as suas mudanças dramáticas de cor',
        'Identificar a "cadência Mario" (bVI-bVII-I) e modulações diretas na composição contemporânea',
      ],
      concepts: [
        {
          title: 'Mistura Modal no Pop',
          explanation:
            'Os acordes emprestados do paralelo menor aparecem constantemente no pop e no rock. O iv menor a substituir o IV maior cria o som de "coração partido" — Fám numa música em Dó maior muda instantaneamente a atmosfera para agridoce. A b6 da escala (Láb em Dó) faz o trabalho emocional, puxando o som maior brilhante para a escuridão menor sem se comprometer totalmente. bVI e bVII são pilares do rock e do cinema: a progressão bVI-bVII-I (Láb-Sib-Dó em Dó) é a "cadência Mario", uma marca do rock dos anos 80 com o seu baixo ascendente triunfante.',
          tryThisLabel: 'Ouve Fám — iv emprestado em Dó maior',
        },
        {
          title: 'Mediantes Cromáticas no Cinema e no Pop',
          explanation:
            'As mediantes cromáticas são acordes cujas fundamentais distam uma terça maior ou menor e que partilham zero ou uma nota comum. Dó maior para Láb maior (descida de terça maior) cria um escurecimento súbito — usado em bandas sonoras para mistério ou pressentimento. Dó maior para Mi maior (subida de terça maior) ilumina dramaticamente — o som de "maravilha" em bandas sonoras de fantasia. Estas mudanças funcionam porque o ouvido espera relações diatónicas; a mediante cromática é suficientemente próxima para ser relacionada mas suficientemente distante para surpreender. O pop usa-as como mudanças de acorde surpresa entre secções.',
          tryThisLabel: 'Ouve Láb maior — a mediante cromática bVI em Dó',
        },
        {
          title: 'Modulação Direta e Mudanças de Tonalidade Abruptas',
          explanation:
            'A modulação direta muda a tonalidade abruptamente — sem acorde pivot, sem preparação. A forma mais comum é a "modulação do camionista": o último refrão salta um meio-tom (ou um tom) para um impulso de energia. Funciona pela pura novidade — o brilho súbito de uma tonalidade mais aguda regista-se como escalada emocional. Modulações diretas mais sofisticadas usam mediantes cromáticas: um verso em Dó maior a saltar para a ponte em Láb maior cria uma mudança dramática de atmosfera sem quaisquer acordes de transição.',
          tryThisLabel: 'Ouve Réb — um destino de mudança de tonalidade por meio-tom acima de Dó',
        },
      ],
      tasks: [
        {
          instruction:
            'Aplica mistura modal: substitui Fá maior (IV) por "Fm" (iv, emprestado de Dó menor). Ouve como a atmosfera muda de brilhante para agridoce — o Láb no Fm é a b6 emprestada a fazer o trabalho emocional.',
        },
        {
          instruction:
            'Constrói a cadência Mario em Dó: toca "Ab major chord" (bVI), "Bb major chord" (bVII), "C major chord" (I). Tanto Láb como Sib são emprestados de Dó menor. O baixo ascendente (Láb-Sib-Dó) cria uma chegada triunfante.',
        },
        {
          instruction:
            'Experimenta uma mudança de mediante cromática: toca "C major chord" depois "E major chord". A fundamental sobe uma terça maior, partilhando apenas uma nota comum (Mi). Esta é a mudança de "maravilha" — usada em bandas sonoras para momentos mágicos ou inspiradores.',
        },
      ],
    },

    // ── U23 M3: Scales: Melodic Minor Modes ──────────────────────────────
    l7u23m3: {
      title: 'Escalas: Modos da Menor Melódica',
      subtitle:
        'Sete modos da menor melódica e as suas aplicações no jazz',
      objectives: [
        'Navegar os sete modos da escala menor melódica ascendente',
        'Emparelhar cada modo com a sua aplicação primária acorde-escala no jazz',
        'Usar a lídia dominante (modo 4) para acordes dominantes 7#11',
        'Usar a escala alterada (modo 7) para acordes 7alt — o som dominante mais cromático',
      ],
      concepts: [
        {
          title: 'A Escala-Mãe Menor Melódica',
          explanation:
            'A escala menor melódica ascendente eleva tanto a sexta como a sétima do menor natural, criando uma escala com terça menor mas sexta e sétima maiores. O seu padrão de intervalos (T-mT-T-T-T-T-mT) gera sete modos, cada um com um carácter distinto e aplicação no jazz. O modo 1 (a própria menor jazz) emparelha-se com acordes menor-maior 7 — o som m(maj7). Ao contrário dos modos diatónicos que partilham todos as mesmas notas, os modos da menor melódica possuem cada um um sabor cromático único que os torna essenciais para navegar a harmonia jazz alterada.',
          tryThisLabel: 'Vê Dó menor melódica — a escala-mãe de 7 modos',
        },
        {
          title: 'Lídia Dominante e Mixolídio b6',
          explanation:
            'O modo 4 da menor melódica é a lídia dominante (#4 e b7) — a escala de referência para acordes dominantes 7#11. Combina a quarta elevada do lídio com a sétima rebaixada do mixolídio, criando um som dominante brilhante sem choque terça/décima primeira. O modo 5 é o mixolídio b6 (também chamado hindu ou eólio dominante) — funciona sobre dominantes a resolver para menor, fornecendo uma b6 que antecipa a tonalidade menor de destino. Ambos os modos estão no coração da improvisação jazz sobre dominantes com extensões específicas.',
          tryThisLabel: 'Ouve lídia dominante — modo 4 da menor melódica',
        },
        {
          title: 'A Escala Alterada (Superlócria)',
          explanation:
            'O modo 7 da menor melódica é a escala alterada, também chamada superlócria. A sua fórmula a partir da fundamental: mT-T-mT-T-T-T-T. Contém todas as alterações possíveis de um acorde dominante: b9, #9, b5 (#11) e #5 (b13). A escala alterada emparelha-se exclusivamente com acordes 7alt e É o som essencial para dominantes a resolver para menor com tensão máxima. O atalho: a escala alterada em qualquer fundamental equivale à escala menor melódica a começar um meio-tom acima (Dó alterada = Réb menor melódica). O lócrio natural 2 (modo 6) é a escala padrão para acordes semidiminutos.',
          tryThisLabel: 'Vê a escala alterada — modo 7 da menor melódica',
        },
      ],
      tasks: [
        {
          instruction:
            'Explora a família da menor melódica: escreve "C melodic minor", depois "C lydian dominant", depois "C altered scale". São os modos 1, 4 e 7 da mesma escala-mãe (em fundamentais diferentes). Cada um tem um carácter completamente diferente.',
        },
        {
          instruction:
            'Verifica o atalho da escala alterada: escreve "C altered scale", depois "Db melodic minor". Contêm as mesmas notas — a escala alterada em qualquer fundamental é a menor melódica um meio-tom acima. Esta é a forma mais rápida de encontrar qualquer escala alterada.',
        },
        {
          instruction:
            'Emparelha modo com acorde: escreve "C lydian dominant" ao lado de "C7#11". Todas as notas do acorde estão dentro da escala. Agora experimenta "C altered scale" ao lado de "C7alt". A escala contém todas as extensões alteradas — alinhamento perfeito.',
        },
      ],
    },

    // ── U23 M4: Scales: Harmonic Minor Modes, Symmetric, and World ───────
    l7u23m4: {
      title: 'Escalas: Modos da Menor Harmónica, Simétricas e do Mundo',
      subtitle:
        'Modos da menor harmónica, tons inteiros, diminuta e escalas do mundo',
      objectives: [
        'Navegar os sete modos da menor harmónica e reconhecer a assinatura da segunda aumentada',
        'Compreender escalas simétricas (tons inteiros, diminuta) e as suas transposições limitadas',
        'Explorar escalas do mundo e étnicas: dupla harmónica maior, húngara menor, persa e mais',
        'Usar o frígio dominante (modo 5 da menor harmónica) para sons de flamenco, klezmer e Médio Oriente',
      ],
      concepts: [
        {
          title: 'Modos da Menor Harmónica',
          explanation:
            'A menor harmónica gera sete modos, cada um marcado por um intervalo distinto de segunda aumentada que lhes dá uma cor exótica. O 5.o modo, frígio dominante, é usado extensivamente no flamenco, klezmer e música do Médio Oriente — tem uma terça maior sobre uma base frígia, criando um som simultaneamente brilhante e escuro. O 4.o modo, dórico #4 (dórico ucraniano), aparece nas tradições folclóricas da Europa de Leste. O 6.o modo, lídio #2, começa com uma segunda aumentada que soa imediatamente distintiva. Cada modo tem um emparelhamento acorde-escala definido e um contexto cultural característico.',
          tryThisLabel: 'Ouve frígio dominante — flamenco e klezmer',
        },
        {
          title: 'Escalas Simétricas: Tons Inteiros e Diminuta',
          explanation:
            'As escalas simétricas têm padrões de intervalos repetitivos que limitam as suas transposições. A escala de tons inteiros (T-T-T-T-T-T) tem apenas 2 formas únicas e produz um som onírico, não resolvido, tipo Debussy — 6 notas, sem meios-tons, sem atração forte em qualquer direção. A escala diminuta vem em dois sabores: meio-tom/tom (mT-T-mT-T-mT-T-mT-T) e tom/meio-tom (T-mT-T-mT-T-mT-T-mT), com apenas 3 formas únicas cada. A versão meio-tom/tom emparelha-se com acordes dominantes b9; a versão tom/meio-tom com acordes de sétima diminuta. Ambas têm 8 notas e dividem a oitava em quatro partes iguais.',
          tryThisLabel: 'Ouve a escala de tons inteiros — 6 notas, 2 formas únicas',
        },
        {
          title: 'Escalas do Mundo e Étnicas',
          explanation:
            'Para além das escalas funcionais ocidentais, o motor inclui escalas de diversas tradições musicais. A dupla harmónica maior (1-b2-3-4-5-b6-7) é usada na música do Médio Oriente, romani e indiana — duas segundas aumentadas criam um sabor intensamente exótico. A húngara menor (1-2-b3-#4-5-b6-7) apresenta a quarta elevada combinada com qualidade menor. A persa (1-b2-3-4-b5-b6-7) tem uma cor escura distintiva. A napolitana menor e maior fornecem a segunda rebaixada da harmonia napolitana. Cada escala transporta a sua origem cultural nos seus intervalos.',
          tryThisLabel: 'Ouve húngara menor — quarta elevada numa escala menor',
        },
      ],
      tasks: [
        {
          instruction:
            'Explora o frígio dominante: escreve "C phrygian dominant". Tem uma b2 (Réb) e uma terça maior (Mi) — a segunda aumentada entre elas é o intervalo-assinatura. Este é o som de flamenco/klezmer. Compara com "C phrygian" para ouvir a diferença que a terça maior faz.',
        },
        {
          instruction:
            'Escreve "C whole tone scale" — repara que tem apenas 6 notas e nenhum meio-tom. Agora escreve "Db whole tone scale". Estas são as únicas duas escalas de tons inteiros únicas; qualquer outra fundamental duplica uma delas. Simetria total significa ambiguidade total.',
        },
        {
          instruction:
            'Compara escalas do mundo: escreve "C double harmonic major", depois "C hungarian minor". Ambas apresentam segundas aumentadas mas em posições diferentes, criando caracteres melódicos muito distintos. O motor tem 46 escalas — explora livremente.',
        },
      ],
    },

    // ── U23 M5: Complete Chord Taxonomy ───────────────────────────────────
    l7u23m5: {
      title: 'Taxonomia Completa de Acordes',
      subtitle:
        'Todos os 42 tipos de acordes — extensões, suspensões, notas adicionadas e estruturas especiais',
      objectives: [
        'Construir qualquer acorde com extensões (nona, décima primeira, décima terceira) em qualquer qualidade a partir de uma fundamental',
        'Compreender acordes suspensos e de nota adicionada e como diferem das extensões',
        'Explorar estruturas especiais: acordes quartais, power chords e poliacordes',
        'Usar o motor de acordes para identificar e construir qualquer acorde a partir da sua cifra',
      ],
      concepts: [
        {
          title: 'Acordes com Extensões: Nonas até Décimas Terceiras',
          explanation:
            'Os acordes com extensões continuam o processo de empilhamento de terças além da sétima. As qualidades maior, menor e dominante produzem famílias de extensões distintas. Cmaj9 acrescenta uma nona maior a Cmaj7. Cm11 acrescenta uma décima primeira perfeita a Cm9. G13 acrescenta uma décima terceira maior a G9 (com a décima primeira geralmente omitida em acordes dominantes para evitar o choque terça/décima primeira). Extensões alteradas (b9, #9, #11, b13) criam a tensão cromática essencial à condução de vozes jazz. O motor suporta todas as extensões padrão em todas as qualidades.',
          tryThisLabel: 'Constrói Cmaj13 — o empilhamento completo de extensões maiores',
        },
        {
          title: 'Acordes Suspensos e de Nota Adicionada',
          explanation:
            'Os acordes suspensos substituem a terça por uma segunda (sus2) ou quarta (sus4), removendo a identidade maior/menor e criando um som aberto e não resolvido. O 7sus4 é um acorde de sétima dominante com quarta suspensa — comum no jazz como voicing pré-resolução. Os acordes de nota adicionada mantêm a terça e acrescentam uma nota sem implicar sétima: Cadd9 tem fundamental, terça, quinta e nona mas sem sétima. O acorde 6/9 (C6/9) acrescenta tanto a sexta como a nona a uma tríade — um voicing jazz rico e estável que funciona como alternativa de tónica ao maj7.',
          tryThisLabel: 'Ouve C7sus4 — a dominante suspensa',
        },
        {
          title: 'Estruturas Especiais: Quartais, Power Chords e Mais',
          explanation:
            'Nem todos os acordes são construídos a partir de terças empilhadas. Os acordes quartais empilham quartas perfeitas (Ré-Sol-Dó-Fá), produzindo uma qualidade ambígua e aberta central ao jazz modal — McCoy Tyner construiu a sua sonoridade de assinatura sobre estes voicings. Os power chords (apenas fundamental e quinta, sem terça) são a espinha dorsal da guitarra rock, nem maiores nem menores. Os poliacordes empilham duas tríades independentes para criar sonoridades complexas usadas na escrita orquestral e jazz. O motor cobre 42 tipos de acordes abrangendo tríades, sétimas, extensões, alterações, suspensões, notas adicionadas e power chords.',
          tryThisLabel: 'Ouve C6/9 — um voicing jazz clássico sem sétima',
        },
      ],
      tasks: [
        {
          instruction:
            'Constrói a escada de extensões em Dó: escreve "Cmaj7", "Cmaj9", "Cmaj13" em sequência. Ouve como cada extensão acrescenta riqueza enquanto o shell (C, E, B) se mantém o mesmo.',
        },
        {
          instruction:
            'Compara acordes suspensos e de nota adicionada: escreve "Csus4", depois "Cadd9", depois "C6/9". Repara que sus4 não tem terça, add9 não tem sétima, e 6/9 não tem nem sétima nem a tensão de resolução de um acorde suspenso.',
        },
        {
          instruction:
            'Explora variações dominantes: escreve "C7", "C9", "C7sus4", "C7b9", "C7#9", "C13". Todos são acordes da família dominante, mas cada um tem uma cor distinta — de quente (C9) a escuro (C7b9) a áspero (C7#9) a amplo (C13).',
        },
      ],
    },
  },
};

export default curriculumL7;
