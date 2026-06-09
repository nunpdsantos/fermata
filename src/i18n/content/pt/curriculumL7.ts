import type { CurriculumLevelOverlay } from '../types';

const curriculumL7: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    u21: {
      title: 'Harmonia Jazz',
      description:
        'Cifras de jazz, extensoes, voicings de shell, progressoes ii-V-I, substituicao tritonica, formas de blues, rhythm changes e turnarounds',
    },
    u22: {
      title: 'Jazz Avancado, Modal e Pop',
      description:
        'Teoria acorde-escala, estruturas superiores, rearmonizacao, mudancas de Coltrane, progressoes modais, voicings quartais e pedais',
    },
    u23: {
      title: 'Harmonia Pop e Taxonomia Completa',
      description:
        'Progressoes pop, numeros de Nashville, mistura modal, mediantes cromaticas, todas as 46 escalas (modos de menor melodica, modos de menor harmonica, simetricas, do mundo) e todos os 42 tipos de acordes',
    },
  },

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: {
    // ══════════════════════════════════════════════════════════════════════════
    // Unidade 21: Harmonia Jazz
    // ══════════════════════════════════════════════════════════════════════════

    // ── U21 M1: Jazz Chord Symbols and Extensions ─────────────────────────
    l7u21m1: {
      title: 'Cifras de Jazz e Extensoes',
      subtitle:
        'A linguagem de acordes baseada em letras do jazz — qualidades, extensoes e alteracoes',
      objectives: [
        'Ler e escrever cifras de jazz fluentemente, incluindo indicadores de qualidade (maj7, m7, 7, ø7, o7)',
        'Construir acordes com extensoes (nona, decima primeira, decima terceira) e compreender o principio de empilhamento',
        'Distinguir entre extensoes (implicam a setima) e notas adicionadas (sem setima)',
        'Compreender como as alteracoes (b9, #9, #11, b13) modificam cromaticamente as extensoes',
      ],
      concepts: [
        {
          title: 'O Sistema de Cifras de Jazz',
          explanation:
            'O jazz usa um sistema baseado em letras em vez de numerais romanos. Uma letra de fundamental (C, D, E...) e seguida por um indicador de qualidade: maj7 (ou triangulo) para brilhante e estavel, m7 (ou traco) para quente e escuro, 7 para tensao dominante, ø7 para semidiminuto instavel, e o7 para simetria diminuta. Este sistema e universal em lead sheets e fake books de jazz. Todo o musico de jazz tem de ler cifras a primeira vista — a cifra E o acorde.',
          tryThisLabel: 'Constroi Cmaj7 — o acorde de setima maior brilhante e estavel',
        },
        {
          title: 'Extensoes: Nona, Decima Primeira, Decima Terceira',
          explanation:
            'As extensoes sao notas do acorde alem da setima, construidas continuando a empilhar tercas acima da oitava. A nona e uma oitava mais uma segunda, a decima primeira e uma oitava mais uma quarta, e a decima terceira e uma oitava mais uma sexta. Uma cifra com 13 implica que a setima, a nona e a decima terceira estao presentes — a decima primeira e geralmente omitida em acordes maiores e dominantes porque a decima primeira natural choca com a terca maior. Extensoes vs. notas adicionadas: Cmaj9 implica setima; Cadd9 nao. Cada extensao acrescenta riqueza harmonica e especificidade ao voicing.',
          tryThisLabel: 'Ouve G13 — extensoes empilhadas ate a decima terceira',
        },
        {
          title: 'Alteracoes: b9, #9, #11, b13',
          explanation:
            'As alteracoes modificam cromaticamente as extensoes em acordes dominantes. A b9 escurece o som, comum em V7 a resolver para menor. A #9 e o "acorde de Hendrix" com o seu timbre blues — na realidade uma terca menor acima da fundamental, notada como nona aumentada. A #11 substitui a decima primeira natural por uma cor lidia, evitando o choque terca/decima primeira. A b13 cria um som dominante alterado e tenso, enarmonico com #5. Estas alteracoes dao aos musicos de jazz um controlo preciso sobre cor e tensao em qualquer acorde dominante.',
          tryThisLabel: 'Constroi C7b9 — dominante escurecida a resolver para menor',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "Cmaj9", "Dm11" e "G13" um apos o outro. Para cada acorde, identifica a fundamental, a qualidade e que extensoes estao presentes. Repara como maj9 implica maj7, m11 implica m7+9+11 e 13 implica 7+9+13.',
        },
        {
          instruction:
            'Compara "Cmaj9" com "Cadd9". O primeiro implica setima (C-E-G-B-D); o segundo nao (C-E-G-D). Esta distincao — extensao vs. nota adicionada — e critica para ler cifras de jazz corretamente.',
        },
        {
          instruction:
            'Constroi uma escada de alteracoes dominantes: escreve "C7", depois "C7b9", depois "C7#9", depois "C7#11". Cada alteracao modifica cromaticamente uma extensao mantendo o shell dominante (C-E-Bb) intacto.',
        },
      ],
    },

    // ── U21 M2: Shell Voicings and Altered Chords ─────────────────────────
    l7u21m2: {
      title: 'Voicings de Shell e Acordes Alterados',
      subtitle:
        'Shells de fundamental-terca-setima, o acorde alt e dominantes suspensas',
      objectives: [
        'Construir voicings de shell (fundamental, terca, setima) para cada qualidade de acorde',
        'Compreender por que o shell define o acorde — as extensoes sao cor, o shell e identidade',
        'Construir o acorde "alt" (7alt) e compreender o seu papel de tensao maxima',
        'Usar acordes sus4 e 7sus4 como voicings dominantes pre-resolucao',
      ],
      concepts: [
        {
          title: 'Voicings de Shell: Fundamental, Terca, Setima',
          explanation:
            'Os voicings de shell reduzem o acorde ao essencial: fundamental, terca e setima. Estas tres notas definem a qualidade — terca maior + setima maior = maj7, terca menor + setima menor = m7, terca maior + setima menor = dominante 7. A quinta e omitida porque nao acrescenta informacao de qualidade (e perfeita em todos os tipos padrao). As extensoes sao sobrepostas ao shell. Os voicings de shell sao o ponto de partida para o acompanhamento de piano jazz e a chord-melody na guitarra: aprende os shells, depois veste-os com extensoes.',
          tryThisLabel: 'Constroi Dm7 — ouve o shell menor (D, F, C)',
        },
        {
          title: 'O Acorde Alt: Tensao Cromatica Maxima',
          explanation:
            'C7alt e um acorde de setima dominante com todas as extensoes alteradas: b9, #9, #11 (enarmonico de b5) e b13 (enarmonico de #5). Concentra a tensao cromatica maxima possivel antes da resolucao — cada nota fora do shell esta cromaticamente deslocada. O acorde alt emparelha-se exclusivamente com a escala alterada (superlócria), que e o modo 7 da menor melodica um meio-tom acima da fundamental (C alterada = Db menor melodica). Este e o som dominante de referencia para resolver para acordes menores no jazz.',
          tryThisLabel: 'Constroi C7alt — todas as extensoes alteradas',
        },
        {
          title: 'Dominantes Suspensas: 7sus4',
          explanation:
            'O acorde 7sus4 substitui a terca por uma quarta num acorde de setima dominante, criando um som aberto e nao resolvido. C7sus4 contem C-F-G-Bb — sem Mi, portanto sem identidade maior/menor. No jazz, o 7sus4 funciona como voicing pre-resolucao: a quarta suspensa resolve para a terca, e depois o acorde inteiro resolve para I. O 7sus4 tambem serve como sonoridade modal de pendor dorico: um acorde 9sus construido uma quinta perfeita acima da fundamental de um acorde menor (a posicao V-de-ii, por exemplo G9sus sobre Dm ou no lugar dele) substitui o acorde ii — Dm11/G e uma grafia comum do mesmo som. O sus2 funciona de forma semelhante, substituindo a terca por uma segunda para uma qualidade brilhante e aberta.',
          tryThisLabel: 'Ouve G7sus4 — dominante suspensa, sem terca',
        },
      ],
      tasks: [
        {
          instruction:
            'Constroi shells em varias qualidades: escreve "Cmaj7", "Cm7", "C7", "Cm7b5". Em cada um, identifica a fundamental, terca e setima. A terca e a setima mudam — e isso que torna cada qualidade distinta.',
        },
        {
          instruction:
            'Escreve "C7alt" — e um acorde de setima dominante com todas as extensoes alteradas (b9, #9, #11/b5, b13/#5). Conta as notas cromaticas em comparacao com um C7 simples. Este acorde e tensao maxima antes da resolucao.',
        },
        {
          instruction:
            'Compara "G7" com "G7sus4" — o sus4 substitui o B (terca maior) por C (quarta perfeita). A funcao dominante mantem-se (a b7 continua a puxar para baixo), mas o som e aberto e nao resolvido.',
        },
      ],
    },

    // ── U21 M3: The ii-V-I Progression ────────────────────────────────────
    l7u21m3: {
      title: 'A Progressao ii-V-I',
      subtitle:
        'A unidade fundamental da harmonia jazz — em tonalidades maiores e menores',
      objectives: [
        'Dominar a progressao ii-V-I em tonalidades maiores (Dm7-G7-Cmaj7)',
        'Dominar a progressao ii-V-i em tonalidades menores (Dm7b5-G7b9-Cm7)',
        'Compreender pares ii-V relacionados — todo V7 pode ser precedido pelo seu ii',
        'Analisar standards de jazz como cadeias de unidades ii-V-I, algumas completas, outras parciais',
      ],
      concepts: [
        {
          title: 'ii-V-I Maior',
          explanation:
            'A ii-V-I e a unidade fundamental da harmonia jazz. Em Do maior: Dm7-G7-Cmaj7. O ii (Dm7) funciona como pre-dominante, preparando o V7 (G7) cujo tritono (B-F) cria tensao maxima, resolvendo para Cmaj7. A conducao de vozes e notavelmente suave: a terca do ii (F) torna-se a setima do V, a setima do ii (C) desce para a terca do V (B), e o tritono do V resolve para dentro, para a fundamental e a terca do I. Esta unidade de tres acordes impulsiona virtualmente todos os standards de jazz.',
          tryThisLabel: 'Comeca a ii-V-I: toca Dm7 (ii em Do)',
        },
        {
          title: 'ii-V-i Menor',
          explanation:
            'A ii-V-i menor usa o ii semidiminuto e um V dominante alterado. Em Do menor: Dm7b5-G7b9-Cm7. O Dm7b5 (semidiminuto) tem uma cor pre-dominante mais escura do que o m7 usado no modo maior. O G7b9 adiciona a b9 (Lab) — a alteracao escura e tensa que puxa para uma resolucao menor. A b9 e a b6 da tonalidade menor de destino, razao pela qual soa "certa" ao resolver para menor. Muitos musicos de jazz usam G7alt em vez de G7b9 para uma tensao cromatica ainda maior.',
          tryThisLabel: 'Constroi Dm7b5 — o ii semidiminuto para menor',
        },
        {
          title: 'Pares ii-V Relacionados',
          explanation:
            'Todo acorde de setima dominante pode ser precedido pelo seu ii relacionado — o m7 construido uma quarta perfeita abaixo da fundamental do dominante (ou uma quinta acima). Isto "prepara" o dominante e cria uma conducao de vozes mais suave. Se uma musica tem E7 a resolver para algum lado, podes inserir Bm7 antes: Bm7-E7 e um par ii-V. Os musicos de jazz encadeiam estes pares em centros tonais diferentes: Bm7-E7-Am7-D7-Gmaj7 e uma cadeia de pares ii-V em cascata pelo ciclo de quintas, cada par a apontar para a tonalidade seguinte.',
          tryThisLabel: 'Ouve G7 — o V da ii-V-I em Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Constroi uma ii-V-I maior em Do: escreve "Dm7", depois "G7", depois "Cmaj7". Ouve a tensao a construir-se do ii ao V e a resolver no I. O tritono no G7 (B e F) resolve para dentro, para C e E.',
        },
        {
          instruction:
            'Agora constroi uma ii-V-i menor em Do menor: escreve "Dm7b5", depois "G7b9", depois "Cm7". Compara a atmosfera — o ii semidiminuto e a alteracao b9 escurecem tudo em comparacao com a versao maior.',
        },
        {
          instruction:
            'Encadeia pares ii-V: escreve "Em7", "A7", "Dm7", "G7", "Cmaj7". Esta e uma ii-V-I em cascata onde cada par aponta para o seguinte — Em7-A7 aponta para Dm7, depois Dm7-G7 aponta para Cmaj7. O ciclo de quintas em acao.',
        },
      ],
    },

    // ── U21 M4: Tritone Substitution ──────────────────────────────────────
    l7u21m4: {
      title: 'Substituicao Tritonica',
      subtitle:
        'Substituir dominantes a um tritono de distancia para movimento cromatico do baixo',
      objectives: [
        'Aplicar substituicao tritonica a qualquer acorde de setima dominante',
        'Compreender por que as substituicoes tritonicas funcionam — tritono partilhado entre os dois dominantes',
        'Adicionar o ii relacionado do dominante substituto para uma linha cromatica ainda mais rica',
        'Reconhecer o dominante da "porta de tras" (bVII7-I) como uma tecnica de rearmonizacao relacionada',
      ],
      concepts: [
        {
          title: 'A Substituicao Tritonica',
          explanation:
            'Substitui qualquer acorde de setima dominante pelo acorde de setima dominante a um tritono de distancia. G7 a resolver para C torna-se Db7 a resolver para C. Funciona porque G7 e Db7 partilham o mesmo intervalo de tritono (B-F enarmonico de Cb-F) — o par de notas que impulsiona a resolucao. A fundamental e a quinta mudam, mas o motor do tritono mantem-se intacto. O movimento cromatico do baixo resultante (Db a descer para C) e mais suave do que o movimento pelo ciclo de quintas (G para C), criando uma descida sofisticada por meio-tom.',
          tryThisLabel: 'Ouve Db7 — a substituicao tritonica de G7',
        },
        {
          title: 'Substituicao Tritonica com ii Relacionado',
          explanation:
            'Adicionar o ii relacionado do dominante substituto cria uma linha cromatica ainda mais rica. O ii de Db7 e Abm7, portanto a ii-V-I completa com substituicao tritonica e: Abm7-Db7-Cmaj7. A linha do baixo desce cromaticamente: Lab-Reb-Do. Compara com a original: Dm7-G7-Cmaj7 (baixo: Re-Sol-Do). Ambas chegam a Do, mas o caminho da substituicao tritonica e inteiramente cromatico. Os arranjadores de jazz misturam frequentemente ambas as abordagens na mesma peca.',
          tryThisLabel: 'Constroi Abm7 — o ii relacionado da substituicao tritonica',
        },
        {
          title: 'O Dominante da Porta de Tras',
          explanation:
            'O dominante da porta de tras (bVII7-I) aborda a tonica a partir de um tom abaixo em vez de uma quinta acima. Em Do: Bb7-Cmaj7. A terca de Bb7 (Re) resolve para cima para a terca de Cmaj7 (Mi), e a setima de Bb7 (Lab) resolve para baixo para a quinta de Cmaj7 (Sol). Isto cria uma resolucao surpreendente e quente que evita a cadencia V7-I esperada. Comum em standards de jazz e bossa nova, o dominante da porta de tras entende-se melhor como um emprestimo do menor paralelo — e o dominante de bIII (Mib) que chega, em vez disso, a I. As suas notas-guia (Re e Lab) tambem existem no dominante alterado da tonalidade (G7b9), e e por isso que Bb7 puxa tao convincentemente para Do: Re sobe para Mi e Lab desce para Sol, ambas sensiveis superiores em direcao a Cmaj7.',
          tryThisLabel: 'Ouve Bb7 — o dominante da porta de tras em Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Aplica substituicao tritonica: toca "Dm7", depois "Db7", depois "Cmaj7". O Db7 substitui G7 — mesmo tritono (F e B/Cb), mas com descida cromatica do baixo (D-Db-C) em vez do ciclo de quintas (D-G-C).',
        },
        {
          instruction:
            'Constroi a ii-V completa com substituicao tritonica: toca "Abm7", depois "Db7", depois "Cmaj7". A linha do baixo desce Lab-Reb-Do — movimento puramente cromatico. Compara com a original Dm7-G7-Cmaj7.',
        },
        {
          instruction:
            'Experimenta o dominante da porta de tras: toca "Bb7" depois "Cmaj7". O Bb7 resolve PARA CIMA um tom para Do em vez de PARA BAIXO uma quinta. Soa quente e inesperado — um final surpresa favorito em baladas de jazz.',
        },
      ],
    },

    // ── U21 M5: Blues Forms ────────────────────────────────────────────────
    l7u21m5: {
      title: 'Formas de Blues',
      subtitle: 'O blues de 12 compassos, jazz blues e blues menor',
      objectives: [
        'Tocar a forma basica do blues de 12 compassos usando acordes de setima dominante',
        'Compreender o enriquecimento do jazz blues: insercoes ii-V, substituicoes tritonicas, acordes diminutos de passagem',
        'Construir uma forma de blues menor com acordes m7 e bVI7',
        'Reconhecer por que todos os acordes no blues sao dominantes — a tensao omnipresente E o som do blues',
      ],
      concepts: [
        {
          title: 'O Blues de 12 Compassos',
          explanation:
            'O blues de 12 compassos e a forma mais tocada no jazz e na musica popular. E construido sobre tres acordes de setima dominante: I7 durante quatro compassos, IV7 durante dois, I7 durante dois, depois V7-IV7-I7-V7 nos ultimos quatro. Em Do: C7-C7-C7-C7 / F7-F7-C7-C7 / G7-F7-C7-G7. Na teoria classica, apenas o V deveria ser dominante, mas no blues TODOS os acordes sao dominantes. Essa tensao dominante omnipresente — tritonos em todo o lado, nada totalmente resolvido — E o som do blues. Todo o musico de jazz tem de navegar esta forma nas 12 tonalidades.',
          tryThisLabel: 'Ouve C7 — o acorde tonico do blues em Do',
        },
        {
          title: 'Jazz Blues',
          explanation:
            'O jazz blues enriquece a forma basica de 12 compassos com insercoes ii-V, substituicoes tritonicas e acordes diminutos de passagem. Um jazz blues comum em Do: C7 / F7 / C7 / C7 / F7 / F#dim7 / C7 / Am7 / Dm7 / G7 / C7-Am7 / Dm7-G7. O #IVdim7 (F#dim7) funciona como acorde de passagem cromatica entre IV7 e I7. Os ultimos quatro compassos tornam-se um turnaround com um ii-V (Dm7-G7) que recicla para o inicio. O bird blues (Charlie Parker) acrescenta ainda mais substituicoes e cadeias ii-V.',
          tryThisLabel: 'Constroi F7 — o IV7 do blues em Do',
        },
        {
          title: 'Blues Menor',
          explanation:
            'O blues menor substitui os acordes dominantes do I e IV por acordes m7, criando uma atmosfera mais escura e melancolica. Um blues menor padrao em Do: Cm7-Cm7-Cm7-Cm7 / Fm7-Fm7-Cm7-Cm7 / Ab7-G7-Cm7-G7. O bVI7 (Ab7) substitui o V7 no compasso 9, criando uma abordagem cromatica ao V7 (G7) no compasso 10. O blues menor e a fundacao do hard bop e do soul jazz. A atmosfera geral e mais pesada e introspetiva do que o blues maior.',
          tryThisLabel: 'Ouve Cm7 — a tonica do blues menor em Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Constroi as mudancas basicas do blues: toca "C7", "F7", "G7". Todos sao acordes de setima dominante — na teoria classica so o V deveria ser dominante, mas no blues todos o sao. Essa tensao omnipresente E o som do blues.',
        },
        {
          instruction:
            'Acrescenta o acorde de passagem do jazz blues: toca "F7" depois "F#dim7" depois "C7". O acorde diminuto liga o IV7 ao I7 com uma subida cromatica do baixo (F-F#-G, onde Sol e a quinta de Do). Este e o movimento emblematico do jazz blues.',
        },
        {
          instruction:
            'Constroi a cadencia do blues menor: toca "Ab7" depois "G7" depois "Cm7". O bVI7 (Ab7) desce cromaticamente para V7 (G7), que resolve para a tonica menor (Cm7). Esta cadencia bVI7-V7-i define o som do blues menor.',
        },
      ],
    },

    // ── U21 M6: Rhythm Changes and Turnarounds ───────────────────────────
    l7u21m6: {
      title: 'Rhythm Changes e Turnarounds',
      subtitle:
        'A forma AABA, padroes de turnaround e o ciclo de dominantes',
      objectives: [
        'Compreender rhythm changes como uma forma AABA de 32 compassos',
        'Construir padroes de turnaround: I-vi-ii-V, cromatico, abordagem diminuta',
        'Analisar a ponte dos rhythm changes como um ciclo de dominantes (III7-VI7-II7-V7)',
        'Aplicar turnarounds no final de qualquer seccao para criar ciclos harmonicos suaves',
      ],
      concepts: [
        {
          title: 'Rhythm Changes',
          explanation:
            'Os rhythm changes, derivados de Gershwin, sao uma das duas formas mais comuns no jazz (a outra sendo o blues). E uma estrutura AABA de 32 compassos. As seccoes A usam uma progressao baseada em turnaround: I-vi-ii-V em Sib maior torna-se Bbmaj7-Gm7-Cm7-F7. A ponte (seccao B) percorre dominantes em ciclo de quartas: D7-G7-C7-F7 (III7-VI7-II7-V7). Esta ponte e um dos grandes desafios de improvisacao — quatro centros tonais diferentes em oito compassos. Centenas de composicoes de jazz usam rhythm changes como a sua base harmonica.',
          tryThisLabel: 'Constroi Bbmaj7 — a tonica dos rhythm changes',
        },
        {
          title: 'Padroes de Turnaround',
          explanation:
            'Um turnaround e uma progressao curta (geralmente dois compassos) no final de uma seccao que recicla para o inicio. O turnaround basico e I-vi-ii-V: em Do, Cmaj7-Am7-Dm7-G7. Variantes incluem o turnaround cromatico (I-bIII7-bVI7-bII7: Cmaj7-Eb7-Ab7-Db7) onde cada acorde e uma substituicao tritonica, e a abordagem diminuta (I-#Io7-ii-V: Cmaj7-C#dim7-Dm7-G7) onde o acorde diminuto fornece uma ligacao cromatica no baixo. Cada turnaround cria uma sensacao satisfatoria de circularidade harmonica.',
          tryThisLabel: 'Ouve Am7 — o vi num turnaround em Do',
        },
        {
          title: 'O Ciclo de Dominantes',
          explanation:
            'A ponte dos rhythm changes usa um ciclo de acordes de setima dominante que se movem em quartas: D7-G7-C7-F7 em Sib. Cada dominante resolve para o seguinte como se fosse um V-I, mas o "I" e ele proprio um acorde dominante, portanto a resolucao e perpetuamente adiada. Isto cria impulso para a frente sem nunca pousar numa tonica estavel. O ciclo de dominantes aparece por todo o jazz — em pontes, introducoes e passagens de transicao. Cada acorde dominante implica brevemente o seu proprio centro tonal, tornando-o um terreno rico para improvisacao.',
          tryThisLabel: 'Constroi D7 — o primeiro dominante no ciclo da ponte',
        },
      ],
      tasks: [
        {
          instruction:
            'Constroi um turnaround em Do: toca "Cmaj7", "Am7", "Dm7", "G7". Este loop I-vi-ii-V e a seccao A dos rhythm changes (transposta de Sib). Repara como o G7 no final te puxa de volta para Cmaj7.',
        },
        {
          instruction:
            'Constroi o ciclo da ponte dos rhythm changes: toca "D7", "G7", "C7", "F7". Cada dominante resolve para o seguinte por uma quarta — movimento perpetuo. Experimenta emparelhar cada acorde com a sua escala mixolidia para ideias de improvisacao.',
        },
        {
          instruction:
            'Aplica o turnaround cromatico: toca "Cmaj7", "Eb7", "Ab7", "Db7". Cada acorde apos o I e uma substituicao tritonica — Eb7 substitui A7, Ab7 substitui D7, Db7 substitui G7. As fundamentais C-Eb-Ab-Db sobem uma terca menor e depois duas quartas perfeitas — e o Db7 final resolve meio tom abaixo para Do, a recompensa cromatica das substituicoes.',
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // Unidade 22: Jazz Avancado, Modal e Pop
    // ══════════════════════════════════════════════════════════════════════════

    // ── U22 M1: Chord-Scale Theory ────────────────────────────────────────
    l7u22m1: {
      title: 'Teoria Acorde-Escala',
      subtitle:
        'Emparelhar escalas com cifras — o nucleo da improvisacao jazz',
      objectives: [
        'Mapear cada qualidade padrao de acorde para as suas escalas primarias e alternativas',
        'Compreender por que certas escalas "funcionam" sobre certos acordes — notas comuns do acorde como base',
        'Aplicar a teoria acorde-escala para analisar e improvisar sobre progressoes ii-V-I',
        'Usar a escala alterada para acordes 7alt e a lidia dominante para acordes 7#11',
      ],
      concepts: [
        {
          title: 'O Mapa Acorde-Escala',
          explanation:
            'Cada acorde implica uma ou mais escalas compativeis que fornecem a paleta de notas para melodia e improvisacao. Maj7 mapeia para jonio ou lidio, m7 para dorico (mais comum), eolio ou frigio. Dominante 7 mapeia para mixolidio, lidio dominante, alterada, tons inteiros ou diminuta meio-tom/tom dependendo do contexto harmonico. Semidiminuto (m7b5) mapeia para locrio ou locrio natural 2. Diminuto completo usa a escala diminuta tom/meio-tom. O m(maj7) mapeia para menor melodica ou menor harmonica. Este sistema e o nucleo da pedagogia de improvisacao jazz.',
          tryThisLabel: 'Ve a escala alterada — a escala para C7alt',
        },
        {
          title: 'Escolhas Acorde-Escala para Dominantes',
          explanation:
            'O acorde de setima dominante tem o conjunto mais rico de escolhas de escala, determinado pelo contexto harmonico. Dominante nao alterado (a resolver normalmente) usa mixolidio. Dominante com #11 usa lidio dominante (modo 4 da menor melodica). Dominante a resolver para menor usa alterada ou frigio dominante. Dominante com b9 num contexto diminuto usa diminuta meio-tom/tom. Dominante com sonoridade de tons inteiros usa a escala de tons inteiros. A escolha nao e arbitraria — depende de para onde o acorde resolve e que extensoes estao especificadas na cifra.',
          tryThisLabel: 'Ouve lidio dominante — o som dominante com #11',
        },
        {
          title: 'Alinhamento Acorde-Escala em ii-V-I',
          explanation:
            'Numa ii-V-I maior em Do, o alinhamento acorde-escala e: Dm7 = Re dorico, G7 = Sol mixolidio, Cmaj7 = Do jonio (ou Do lidio). As tres escalas partilham as mesmas notas — sao modos de Do maior. Isto significa que o improvisador pode pensar numa so tonalidade ao longo de toda a progressao. No modo menor, o alinhamento muda: Dm7b5 = Re locrio nat.2, G7alt = Sol alterada (Lab menor melodica), Cm(maj7) = Do menor melodica. Agora tres conjuntos de notas diferentes estao em jogo, exigindo pensamento mais rapido.',
          tryThisLabel: 'Ve Re dorico — a escala de acorde para Dm7 em Do maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Emparelha acorde com escala: escreve "Dm7" (dorico), depois "D dorian" para ver a escala. Agora experimenta "G7" (mixolidio) e "G mixolydian". As notas do acorde estao dentro da escala — isto e o alinhamento acorde-escala.',
        },
        {
          instruction:
            'Explora a dominante alterada: escreve "C altered scale", depois "C7alt". Cada nota do acorde esta contida na escala. Para encontrar rapidamente qualquer escala alterada: toca menor melodica um meio-tom acima da fundamental (C alterada = Db menor melodica).',
        },
        {
          instruction:
            'Compara duas escalas dominantes: escreve "G mixolydian" (dominante nao alterada) e depois "G altered scale" (alteracao maxima). Mixolidio e brilhante e estavel; alterada e escura e cromatica. O contexto determina qual usar.',
        },
      ],
    },

    // ── U22 M2: Upper Structures and Reharmonization ──────────────────────
    l7u22m2: {
      title: 'Estruturas Superiores e Rearmonizacao',
      subtitle:
        'Voicings de acordes complexos com triades simples, e enriquecimento de progressoes',
      objectives: [
        'Construir triades de estrutura superior sobre notas de baixo dominantes para voicings de extensoes',
        'Compreender como a triade superior cria extensoes especificas sem soletrar cada nota',
        'Aplicar rearmonizacao basica: substituir acordes dentro da mesma funcao',
        'Usar substituicoes tritonicas, dominantes secundarios e acordes de passagem para enriquecer progressoes simples',
      ],
      concepts: [
        {
          title: 'Triades de Estrutura Superior',
          explanation:
            'O voicing de estrutura superior coloca uma triade simples no registo agudo sobre uma nota de baixo e guide tones no registo grave. A triade cria extensoes especificas sem soletrar cada nota individualmente. Uma triade de Re maior sobre um baixo de C7 resulta em C13#11 — as notas Re, Fa# e La tornam-se a nona, a #11 e a decima terceira. Uma triade de Mib maior sobre C7 produz C7#9b13. Uma triade de Lab maior sobre C7 cria C7b9b13. A triade superior e escolhida pelas extensoes que gera, nao pela sua propria identidade. Esta tecnica permite a pianistas e arranjadores de jazz voicings de acordes complexos com formas simples.',
          tryThisLabel: 'Constroi C13 — ouve as extensoes que uma estrutura superior cria',
        },
        {
          title: 'Principios de Rearmonizacao',
          explanation:
            'A rearmonizacao substitui os acordes originais de uma melodia por acordes diferentes que continuam a suportar as notas melodicas. As notas da melodia tornam-se extensoes diferentes dos novos acordes. Tecnicas basicas: substituir acordes dentro da mesma funcao (iii por I, vi por IV), adicionar dominantes secundarios antes de acordes-alvo, inserir substituicoes tritonicas, usar acordes diminutos de passagem entre acordes diatonicos e aplicar movimento cromatico no baixo. Toda a rearmonizacao deve preservar a melodia — a nota melodica deve ser uma nota do acorde ou uma extensao aceitavel do novo acorde.',
          tryThisLabel: 'Constroi Em7 — um iii que pode substituir Cmaj7',
        },
        {
          title: 'Linhas Cromaticas de Baixo e Acordes de Passagem',
          explanation:
            'Uma das ferramentas de rearmonizacao mais poderosas e criar uma linha cromatica de baixo inserindo acordes de passagem. Entre Do e Rem, insere C#dim7 — o baixo caminha Do-Do#-Re. Entre Fa e Mim, insere F#dim7 (ou Fmaj7-F#dim7-Em7). Os acordes de setima diminuta sao os acordes de passagem mais versateis porque cada acorde diminuto e enarmonicamente equivalente a outros tres (devido a construcao simetrica), ligando-se a multiplos destinos. Combinado com substituicoes tritonicas e dominantes secundarios, o movimento cromatico do baixo transforma progressoes diatonicas simples em harmonia jazz rica.',
          tryThisLabel: 'Ouve C#dim7 — um acorde de passagem cromatica',
        },
      ],
      tasks: [
        {
          instruction:
            'Explora estruturas superiores: escreve "C13" — este e o som de uma triade de Re maior (D-F#-A = 9-#11-13) sobre um shell de C7 (C-E-Bb). A cifra complexa e realizada com uma triade simples por cima.',
        },
        {
          instruction:
            'Experimenta uma substituicao de funcao: toca "Cmaj7" depois "Em7". Ambos sao acordes com funcao de tonica em Do maior — Em7 partilha tres notas com Cmaj7 (E-G-B) mas acrescenta uma cor diferente. Esta e a rearmonizacao mais simples.',
        },
        {
          instruction:
            'Constroi uma linha de acordes de passagem cromatica: toca "Cmaj7", depois "C#dim7", depois "Dm7". O acorde diminuto cria uma subida cromatica do baixo (C-C#-D) e cada voz move-se por meio-tom ou mantem-se igual.',
        },
      ],
    },

    // ── U22 M3: Coltrane Changes and Advanced Jazz Harmony ────────────────
    l7u22m3: {
      title: 'Mudancas de Coltrane e Harmonia Jazz Avancada',
      subtitle:
        'A matriz de Giant Steps, estrutura constante e arquitetura de tres centros tonais',
      objectives: [
        'Analisar a matriz de Coltrane (Giant Steps) — tres centros tonais maiores a uma terca maior de distancia',
        'Compreender por que cada centro tonal e abordado pelo seu acorde dominante V7',
        'Reconhecer a estrutura constante como tecnica relacionada — movimento paralelo de acordes independentemente da tonalidade',
        'Apreciar o desafio improvisatorio de navegar tres centros tonais em andamento rapido',
      ],
      concepts: [
        {
          title: 'A Matriz de Giant Steps',
          explanation:
            'John Coltrane concebeu progressoes que percorrem tres centros tonais maiores separados por tercas maiores, dividindo a oitava em tres partes iguais. A progressao de Giant Steps: Bmaj7-D7-Gmaj7-Bb7-Ebmaj7-F#7-Bmaj7, tocando nas tonalidades de Si, Sol e Mib. Cada centro tonal e abordado pelo seu acorde V7. O resultado e um ritmo harmonico extremamente rapido que exige pensar em tres tonalidades simultaneamente — um dos grandes desafios da improvisacao jazz e o cume do dominio acorde-escala.',
          tryThisLabel: 'Comeca em Bmaj7 — o primeiro centro tonal',
        },
        {
          title: 'Estrutura Constante',
          explanation:
            'A estrutura constante move a mesma qualidade de acorde cromaticamente ou por algum padrao de intervalos independentemente da tonalidade. Cmaj7-Dbmaj7-Dmaj7-Ebmaj7 (setimas maiores ascendentes) cria conducao de vozes paralela (planing) com uma cor jazz moderna. Esta tecnica abandona a harmonia funcional inteiramente — nao ha tonalidade, apenas movimento. Wayne Shorter e Herbie Hancock usaram estrutura constante extensivamente. Esta relacionada com as mudancas de Coltrane no sentido em que ambas tratam o movimento de acordes como padroes geometricos em vez de progressoes funcionais.',
          tryThisLabel: 'Ouve Dbmaj7 — estrutura constante em movimento',
        },
        {
          title: 'Improvisacao em Tres Centros Tonais',
          explanation:
            'Improvisar sobre mudancas de Coltrane requer pensar em tres tonalidades simultaneamente em andamento rapido. A abordagem padrao: tocar a escala maior (ou pentatonica) de cada centro tonal durante a duracao desse acorde, mudando instantaneamente quando a harmonia se move. Abordagens mais avancadas usam envolvimentos, padroes digitais (1235, 1357) e pentatonicas sobrepostas. A dificuldade reside na velocidade do ritmo harmonico — cada centro tonal pode durar apenas dois tempos. Este e o Evereste da improvisacao jazz, exigindo dominio total das 12 tonalidades.',
          tryThisLabel: 'Ouve Gmaj7 — o segundo centro tonal',
        },
      ],
      tasks: [
        {
          instruction:
            'Segue o ciclo de Coltrane: toca "Bmaj7", "D7", "Gmaj7", "Bb7", "Ebmaj7", "F#7". Os tres centros tonais (Si, Sol, Mib) distam uma terca maior — dividem a oitava em tres partes iguais.',
        },
        {
          instruction:
            'Verifica a geometria dos tres centros: toca "B major chord", "G major chord", "Eb major chord". Estas tres fundamentais (Si, Sol, Mib) formam uma triade aumentada — a divisao mais simetrica da oitava em tres partes.',
        },
        {
          instruction:
            'Explora estrutura constante: toca "Cmaj7", "Dbmaj7", "Dmaj7", "Ebmaj7". A mesma qualidade de acorde move-se cromaticamente — movimento paralelo que abandona a harmonia funcional inteiramente. Ouve a mudanca de cor a medida que a fundamental sobe.',
        },
      ],
    },

    // ── U22 M4: Modal Harmony Fundamentals ────────────────────────────────
    l7u22m4: {
      title: 'Fundamentos de Harmonia Modal',
      subtitle:
        'Compor fora da gravidade tonal — modos como sistemas harmonicos',
      objectives: [
        'Distinguir harmonia modal de harmonia tonal e compreender por que se evita o V-I',
        'Identificar a nota caracteristica de cada modo e usa-la para selecionar acordes',
        'Construir progressoes de acordes modais que preservem a cor modal',
        'Usar pedais, notas sustidas e padroes de ostinato para ancorar a tonica modal',
      ],
      concepts: [
        {
          title: 'Pensamento Modal vs. Tonal',
          explanation:
            'Na musica tonal, a relacao V-I define a tonalidade e cria a atracao gravitacional que organiza toda a harmonia. Na musica modal, o V-I e deliberadamente evitado porque colapsa a cor modal de volta para a tonalidade maior ou menor. A harmonia modal estabelece a tonica atraves de repeticao, pedais, notas sustidas e relacoes de acordes nao dominantes. Miles Davis, McCoy Tyner e Herbie Hancock construiram composicoes inteiras sobre este principio — "So What" usa apenas dois acordes sobre um pedal dorico. O modo em si E a harmonia.',
          tryThisLabel: 'Ve Re dorico — o pilar modal do jazz',
        },
        {
          title: 'Notas Caracteristicas',
          explanation:
            'Cada modo tem uma nota que o distingue do maior simples ou do menor natural — a nota caracteristica. O dorico tem uma sexta elevada em comparacao com o menor natural (a nota que o torna mais brilhante). O frigio tem uma segunda rebaixada (escuro, sabor espanhol). O lidio tem uma quarta elevada (brilhante, flutuante, onirico). O mixolidio tem uma setima rebaixada (blues, rock). Na teoria tonal estas sao "notas a evitar", mas na escrita modal sao as notas essenciais que devem ser enfatizadas tanto na melodia como nas escolhas de acordes para estabelecer o modo.',
          tryThisLabel: 'Ouve Fa lidio — a quarta elevada define-o',
        },
        {
          title: 'Progressoes de Acordes Modais',
          explanation:
            'Cada modo suporta movimentos de acordes especificos que reforcam a sua cor. O acorde de cor caracteristico do dorico e o IV maior sobre a tonica i — a sexta elevada vive nele (Dm-G-Dm); ii e bVII funcionam como cores secundarias. O frigio centra-se em i e bII — o bII esta um meio-tom acima da tonica, a assinatura sonora do frigio (Em-F-Em). O acorde de cor caracteristico do lidio e o II maior sobre a tonica I — a quarta elevada vive nele (C-D-C); vii partilha essa quarta elevada como cor secundaria. O mixolidio apoia-se em I e bVII — a setima rebaixada esta no acorde bVII (G-F-Dm-G). Evita qualquer acorde que implique resolucao dominante-tonica.',
          tryThisLabel: 'Ve Sol mixolidio — bVII e o acorde-chave',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "D dorian" e identifica a nota caracteristica (Si natural — a sexta elevada). Agora escreve "D natural minor scale" e compara — apenas uma nota difere. Essa unica nota define o som dorico.',
        },
        {
          instruction:
            'Escreve "E phrygian" — a nota caracteristica e Fa (a segunda rebaixada). Constroi um vamp frigio: toca "Em" depois "F major chord" e volta a "Em". O movimento da fundamental por meio-tom e a assinatura do frigio.',
        },
        {
          instruction:
            'Compara "F lydian" com "F major scale" — a unica diferenca e a quarta elevada (Si natural em vez de Sib). Esta unica nota transforma todo o caracter harmonico de maior estavel para lidio flutuante.',
        },
      ],
    },

    // ── U22 M5: Quartal/Quintal Voicings and Drones ──────────────────────
    l7u22m5: {
      title: 'Voicings Quartais/Quintais e Pedais',
      subtitle:
        'Empilhar quartas e quintas para sons modais ambiguos e abertos',
      objectives: [
        'Construir voicings quartais (quartas perfeitas empilhadas) e compreender a sua ambiguidade harmonica',
        'Compreender voicings quintais como quartas invertidas — quintas perfeitas empilhadas para um som aberto e espacoso',
        'Usar pedais e notas sustidas para ancorar composicoes modais sem funcao dominante',
        'Reconhecer os voicings quartais como a tecnica de assinatura de McCoy Tyner no jazz modal',
      ],
      concepts: [
        {
          title: 'Voicings Quartais',
          explanation:
            'Os acordes quartais constroem-se empilhando quartas perfeitas em vez de tercas. Um voicing quartal sobre Re: Re-Sol-Do-Fa. Pode implicar Dm7, Dm11 ou simplesmente uma sonoridade quartal flutuante sem identidade maior/menor clara. A ambiguidade e intencional e perfeita para musica modal — os voicings quartais nao puxam para a resolucao como as triades. McCoy Tyner construiu toda a sua sonoridade de assinatura sobre empilhamentos quartais, movendo-os frequentemente em paralelo sobre um pedal de baixo. Na mao direita: quartas. Na mao esquerda: a tonica modal como pedal.',
          tryThisLabel: 'Ouve Dm11 — um empilhamento quartal em forma de acorde',
        },
        {
          title: 'Voicings Quintais e Espacamento Aberto',
          explanation:
            'Os voicings quintais empilham quintas perfeitas: Re-La-Mi-Si. Esta e a inversao de um voicing quartal (Re-Sol-Do-Fa invertido da quintas abertas). O som e espacoso, aberto e orquestral. Voicings quintais aparecem na musica classica do seculo XX (Bartok, Hindemith) e no jazz modal. Os intervalos amplos criam transparencia — cada nota tem espaco para ressoar. Combinados com um pedal de baixo, os voicings quintais sugerem modalidade sem se comprometerem com nenhuma qualidade de acorde especifica.',
          tryThisLabel: 'Ouve um power chord de Re — o empilhamento de quintas mais simples',
        },
        {
          title: 'Pedais e Notas Sustidas',
          explanation:
            'Um pedal e uma nota de baixo sustida ou repetida sobre a qual as harmonias superiores mudam livremente. Uma nota sustida (drone) e um som continuo que ancora o centro tonal. Na musica modal, pedais e drones substituem a funcao dominante — a tonica e estabelecida por pura persistencia em vez de gravidade harmonica. A musica classica indiana e inteiramente construida sobre um drone (a tanpura). Miles Davis usou pedais no jazz modal para libertar a harmonia de mudancas de acordes funcionais, permitindo ao solista explorar o modo livremente.',
          tryThisLabel: 'Ve Re menor natural — uma escala sobre um pedal de Re',
        },
      ],
      tasks: [
        {
          instruction:
            'Constroi um som quartal: escreve "Dm11" — contem as notas Re-Sol-Do-Fa quando voiceado em quartas. Compara com "Dm7" — a extensao de decima primeira acrescenta o empilhamento quartal que cria a qualidade aberta e ambigua.',
        },
        {
          instruction:
            'Explora o power chord como empilhamento minimo de quintas: escreve "C5", depois "D5", depois "E5". Power chords nao sao maiores nem menores — quintas puras sem terca. Este e o pensamento quintal na sua forma mais basica.',
        },
        {
          instruction:
            'Compara "D dorian" com "D natural minor scale". Sobre um pedal em Re, a sexta elevada do dorico (Si natural) cria uma cor modal mais brilhante. O pedal ancora Re como tonica enquanto a escala define o modo.',
        },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // Unidade 23: Harmonia Pop e Taxonomia Completa
    // ══════════════════════════════════════════════════════════════════════════

    // ── U23 M1: Pop Progressions and Nashville Numbers ────────────────────
    l7u23m1: {
      title: 'Progressoes Pop e Numeros de Nashville',
      subtitle:
        'Loops de acordes pop, o sistema de numeros de Nashville e harmonia baseada em loops',
      objectives: [
        'Analisar as progressoes pop mais comuns e as suas assinaturas emocionais',
        'Compreender o sistema de numeros de Nashville e usa-lo para transposicao instantanea',
        'Reconhecer a harmonia baseada em loops como abordagem distinta — o loop E a harmonia',
        'Identificar o Axis (I-V-vi-IV), Sensitive (vi-IV-I-V) e outros loops pop padrao',
      ],
      concepts: [
        {
          title: 'Progressoes Pop Comuns',
          explanation:
            'A musica pop assenta num pequeno conjunto de loops de acordes com assinaturas emocionais distintas. A progressao I-V-vi-IV "Axis" soa edificante e antemica. A sua rotacao vi-IV-I-V ("Sensitive") soa emocional e moderna. I-bVII-IV produz uma sensacao mixolidia, blues rock. A cadencia "Andaluza" i-bVII-bVI-V — um baixo descendente por graus conjuntos da tonica ate a dominante, vinda diretamente do flamenco — soa escura e cinematica. I-vi-IV-V e a progressao classica dos anos 50, nostalgica e quente. Estes loops repetem-se ao longo de seccoes inteiras — a variacao harmonica provem da melodia, producao e arranjo em vez de mudancas de acordes.',
          tryThisLabel: 'Comeca o acorde I de uma progressao pop em Do',
        },
        {
          title: 'Numeros de Nashville e Harmonia de Loop',
          explanation:
            'O sistema de numeros de Nashville simplifica os numerais romanos para musicos de sessao: numeros simples para acordes maiores (1, 4, 5), um traco para menor (2-, 6-), 7 sobrescrito para acordes de setima. A tonalidade e indicada uma vez no topo da cifra e tudo o resto e relativo — "1 5 6- 4" na tonalidade de Sol significa Sol-Re-Mim-Do. Isto permite transposicao instantanea: muda a declaracao de tonalidade e toca os mesmos numeros. O pop moderno baseia-se em loops de 2-4 acordes que se repetem ao longo de uma seccao inteira. O loop fornece estabilidade harmonica; toda a variacao acontece nas camadas acima.',
          tryThisLabel: 'Lam e o vi em Do — o centro emocional do pop',
        },
        {
          title: 'Rotacoes de Loop e Mudancas Emocionais',
          explanation:
            'Os mesmos quatro acordes produzem efeitos emocionais diferentes dependendo de qual acorde inicia o loop. I-V-vi-IV a comecar no I soa triunfante e resolvido. vi-IV-I-V a comecar no vi soa vulneravel e anelante. IV-V-vi-IV (a comecar no IV) cria uma sensacao de aspiracao. O acorde inicial define onde se situa o "lar" emocional dentro do loop. Na producao pop, o acorde inicial alinha-se frequentemente com o gancho da melodia vocal, reforcando a forma emocional da letra.',
          tryThisLabel: 'Constroi Fa — o acorde IV que impulsiona a resolucao pop',
        },
      ],
      tasks: [
        {
          instruction:
            'Constroi a progressao Axis em Do: toca "C major chord", "G major chord", "Am", "F major chord". Este loop de quatro acordes sustenta centenas de exitos pop — a estrutura I-V-vi-IV.',
        },
        {
          instruction:
            'Agora roda para a versao Sensitive: toca "Am", "F major chord", "C major chord", "G major chord". Os mesmos quatro acordes (vi-IV-I-V), mas a comecar no acorde menor cria uma paisagem emocional completamente diferente.',
        },
        {
          instruction:
            'Experimenta o loop rock mixolidio: toca "C major chord", "Bb major chord", "F major chord". Este padrao I-bVII-IV usa um bVII emprestado do paralelo menor, dando-lhe uma sensacao blues de rock classico.',
        },
      ],
    },

    // ── U23 M2: Modal Mixture and Chromatic Mediants in Pop ───────────────
    l7u23m2: {
      title: 'Mistura Modal e Mediantes Cromaticas no Pop',
      subtitle:
        'Acordes emprestados no pop e rock, mediantes cromaticas em bandas sonoras',
      objectives: [
        'Aplicar mistura modal (acordes emprestados do paralelo menor) em contextos pop e rock',
        'Reconhecer o iv menor, bVI e bVII como os acordes emprestados mais comuns no pop',
        'Compreender mediantes cromaticas (acordes relacionados por terca maior) e as suas mudancas dramaticas de cor',
        'Identificar a "cadencia Mario" (bVI-bVII-I) e modulacoes diretas na composicao contemporanea',
      ],
      concepts: [
        {
          title: 'Mistura Modal no Pop',
          explanation:
            'Os acordes emprestados do paralelo menor aparecem constantemente no pop e no rock. O iv menor a substituir o IV maior cria o som de "coracao partido" — Fam numa musica em Do maior muda instantaneamente a atmosfera para agridoce. A b6 da escala (Lab em Do) faz o trabalho emocional, puxando o som maior brilhante para a escuridao menor sem se comprometer totalmente. bVI e bVII sao pilares do rock e do cinema: a progressao bVI-bVII-I (Lab-Sib-Do em Do) e a "cadencia Mario", uma marca do rock dos anos 80 com o seu baixo ascendente triunfante.',
          tryThisLabel: 'Ouve Fam — iv emprestado em Do maior',
        },
        {
          title: 'Mediantes Cromaticas no Cinema e no Pop',
          explanation:
            'As mediantes cromaticas sao acordes cujas fundamentais distam uma terca maior ou menor e que partilham zero ou uma nota comum. Do maior para Lab maior (descida de terca maior) cria um escurecimento subito — usado em bandas sonoras para misterio ou pressentimento. Do maior para Mi maior (subida de terca maior) ilumina dramaticamente — o som de "maravilha" em bandas sonoras de fantasia. Estas mudancas funcionam porque o ouvido espera relacoes diatonicas; a mediante cromatica e suficientemente proxima para ser relacionada mas suficientemente distante para surpreender. O pop usa-as como mudancas de acorde surpresa entre seccoes.',
          tryThisLabel: 'Ouve Lab maior — a mediante cromatica bVI em Do',
        },
        {
          title: 'Modulacao Direta e Mudancas de Tonalidade Abruptas',
          explanation:
            'A modulacao direta muda a tonalidade abruptamente — sem acorde pivot, sem preparacao. A forma mais comum e a "modulacao do camionista": o ultimo refrão salta um meio-tom (ou um tom) para um impulso de energia. Funciona pela pura novidade — o brilho subito de uma tonalidade mais aguda regista-se como escalada emocional. Modulacoes diretas mais sofisticadas usam mediantes cromaticas: um verso em Do maior a saltar para a ponte em Lab maior cria uma mudanca dramatica de atmosfera sem quaisquer acordes de transicao.',
          tryThisLabel: 'Ouve Reb — um destino de mudanca de tonalidade por meio-tom acima de Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Aplica mistura modal: substitui Fa maior (IV) por "Fm" (iv, emprestado de Do menor). Ouve como a atmosfera muda de brilhante para agridoce — o Lab no Fm e a b6 emprestada a fazer o trabalho emocional.',
        },
        {
          instruction:
            'Constroi a cadencia Mario em Do: toca "Ab major chord" (bVI), "Bb major chord" (bVII), "C major chord" (I). Tanto Lab como Sib sao emprestados de Do menor. O baixo ascendente (Lab-Sib-Do) cria uma chegada triunfante.',
        },
        {
          instruction:
            'Experimenta uma mudanca de mediante cromatica: toca "C major chord" depois "E major chord". A fundamental sobe uma terca maior, partilhando apenas uma nota comum (Mi). Esta e a mudanca de "maravilha" — usada em bandas sonoras para momentos magicos ou inspiradores.',
        },
      ],
    },

    // ── U23 M3: Scales: Melodic Minor Modes ──────────────────────────────
    l7u23m3: {
      title: 'Escalas: Modos da Menor Melodica',
      subtitle:
        'Sete modos da menor melodica e as suas aplicacoes no jazz',
      objectives: [
        'Navegar os sete modos da escala menor melodica ascendente',
        'Emparelhar cada modo com a sua aplicacao primaria acorde-escala no jazz',
        'Usar a lidia dominante (modo 4) para acordes dominantes 7#11',
        'Usar a escala alterada (modo 7) para acordes 7alt — o som dominante mais cromatico',
      ],
      concepts: [
        {
          title: 'A Escala-Mae Menor Melodica',
          explanation:
            'A escala menor melodica ascendente eleva tanto a sexta como a setima do menor natural, criando uma escala com terca menor mas sexta e setima maiores. O seu padrao de intervalos (T-mT-T-T-T-T-mT) gera sete modos, cada um com um carater distinto e aplicacao no jazz. O modo 1 (a propria menor jazz) emparelha-se com acordes menor-maior 7 — o som m(maj7). Ao contrario dos modos diatonicos que partilham todos as mesmas notas, os modos da menor melodica possuem cada um um sabor cromatico unico que os torna essenciais para navegar a harmonia jazz alterada.',
          tryThisLabel: 'Ve Do menor melodica — a escala-mae de 7 modos',
        },
        {
          title: 'Lidia Dominante e Mixolidio b6',
          explanation:
            'O modo 4 da menor melodica e a lidia dominante (#4 e b7) — a escala de referencia para acordes dominantes 7#11. Combina a quarta elevada do lidio com a setima rebaixada do mixolidio, criando um som dominante brilhante sem choque terca/decima primeira. O modo 5 e o mixolidio b6 (tambem chamado hindu ou eolio dominante) — funciona sobre dominantes a resolver para menor, fornecendo uma b6 que antecipa a tonalidade menor de destino. Ambos os modos estao no coracao da improvisacao jazz sobre dominantes com extensoes especificas.',
          tryThisLabel: 'Ouve lidia dominante — modo 4 da menor melodica',
        },
        {
          title: 'A Escala Alterada (Superlócria)',
          explanation:
            'O modo 7 da menor melodica e a escala alterada, tambem chamada superlócria. A sua formula a partir da fundamental: mT-T-mT-T-T-T-T. Contem todas as alteracoes possiveis de um acorde dominante: b9, #9, b5 (#11) e #5 (b13). A escala alterada emparelha-se exclusivamente com acordes 7alt e E o som essencial para dominantes a resolver para menor com tensao maxima. O atalho: a escala alterada em qualquer fundamental equivale a escala menor melodica a comecar um meio-tom acima (Do alterada = Reb menor melodica). O locrio natural 2 (modo 6) e a escala padrao para acordes semidiminutos.',
          tryThisLabel: 'Ve a escala alterada — modo 7 da menor melodica',
        },
      ],
      tasks: [
        {
          instruction:
            'Explora a familia da menor melodica: escreve "C melodic minor", depois "C lydian dominant", depois "C altered scale". Sao os modos 1, 4 e 7 da mesma escala-mae (em fundamentais diferentes). Cada um tem um carater completamente diferente.',
        },
        {
          instruction:
            'Verifica o atalho da escala alterada: escreve "C altered scale", depois "Db melodic minor". Contem as mesmas notas — a escala alterada em qualquer fundamental e a menor melodica um meio-tom acima. Esta e a forma mais rapida de encontrar qualquer escala alterada.',
        },
        {
          instruction:
            'Emparelha modo com acorde: escreve "C lydian dominant" ao lado de "C7#11". Todas as notas do acorde estao dentro da escala. Agora experimenta "C altered scale" ao lado de "C7alt". A escala contem todas as extensoes alteradas — alinhamento perfeito.',
        },
      ],
    },

    // ── U23 M4: Scales: Harmonic Minor Modes, Symmetric, and World ───────
    l7u23m4: {
      title: 'Escalas: Modos da Menor Harmonica, Simetricas e do Mundo',
      subtitle:
        'Modos da menor harmonica, tons inteiros, diminuta e escalas do mundo',
      objectives: [
        'Navegar os sete modos da menor harmonica e reconhecer a assinatura da segunda aumentada',
        'Compreender escalas simetricas (tons inteiros, diminuta) e as suas transposicoes limitadas',
        'Explorar escalas do mundo e etnicas: dupla harmonica maior, hungara menor, persa e mais',
        'Usar o frigio dominante (modo 5 da menor harmonica) para sons de flamenco, klezmer e Medio Oriente',
      ],
      concepts: [
        {
          title: 'Modos da Menor Harmonica',
          explanation:
            'A menor harmonica gera sete modos, cada um marcado por um intervalo distinto de segunda aumentada que lhes da uma cor exotica. O 5.o modo, frigio dominante, e usado extensivamente no flamenco, klezmer e musica do Medio Oriente — tem uma terca maior sobre uma base frigia, criando um som simultaneamente brilhante e escuro. O 4.o modo, dorico #4 (dorico ucraniano), aparece nas tradicoes folcloricas da Europa de Leste. O 6.o modo, lidio #2, comeca com uma segunda aumentada que soa imediatamente distintiva. Cada modo tem um emparelhamento acorde-escala definido e um contexto cultural caracteristico.',
          tryThisLabel: 'Ouve frigio dominante — flamenco e klezmer',
        },
        {
          title: 'Escalas Simetricas: Tons Inteiros e Diminuta',
          explanation:
            'As escalas simetricas tem padroes de intervalos repetitivos que limitam as suas transposicoes. A escala de tons inteiros (T-T-T-T-T-T) tem apenas 2 formas unicas e produz um som onirico, nao resolvido, tipo Debussy — 6 notas, sem meios-tons, sem atracao forte em qualquer direcao. A escala diminuta vem em dois sabores: meio-tom/tom (mT-T-mT-T-mT-T-mT-T) e tom/meio-tom (T-mT-T-mT-T-mT-T-mT), com apenas 3 formas unicas cada. A versao meio-tom/tom emparelha-se com acordes dominantes b9; a versao tom/meio-tom com acordes de setima diminuta. Ambas tem 8 notas e dividem a oitava em quatro partes iguais.',
          tryThisLabel: 'Ouve a escala de tons inteiros — 6 notas, 2 formas unicas',
        },
        {
          title: 'Escalas do Mundo e Etnicas',
          explanation:
            'Para alem das escalas funcionais ocidentais, o motor inclui escalas de diversas tradicoes musicais. A dupla harmonica maior (1-b2-3-4-5-b6-7) e usada na musica do Medio Oriente, romani e indiana — duas segundas aumentadas criam um sabor intensamente exotico. A hungara menor (1-2-b3-#4-5-b6-7) apresenta a quarta elevada combinada com qualidade menor. A persa (1-b2-3-4-b5-b6-7) tem uma cor escura distintiva. A napolitana menor e maior fornecem a segunda rebaixada da harmonia napolitana. Cada escala transporta a sua origem cultural nos seus intervalos.',
          tryThisLabel: 'Ouve hungara menor — quarta elevada numa escala menor',
        },
      ],
      tasks: [
        {
          instruction:
            'Explora o frigio dominante: escreve "C phrygian dominant". Tem uma b2 (Reb) e uma terca maior (Mi) — a segunda aumentada entre elas e o intervalo-assinatura. Este e o som de flamenco/klezmer. Compara com "C phrygian" para ouvir a diferenca que a terca maior faz.',
        },
        {
          instruction:
            'Escreve "C whole tone scale" — repara que tem apenas 6 notas e nenhum meio-tom. Agora escreve "Db whole tone scale". Estas sao as unicas duas escalas de tons inteiros unicas; qualquer outra fundamental duplica uma delas. Simetria total significa ambiguidade total.',
        },
        {
          instruction:
            'Compara escalas do mundo: escreve "C double harmonic major", depois "C hungarian minor". Ambas apresentam segundas aumentadas mas em posicoes diferentes, criando caracteres melodicos muito distintos. O motor tem 46 escalas — explora livremente.',
        },
      ],
    },

    // ── U23 M5: Complete Chord Taxonomy ───────────────────────────────────
    l7u23m5: {
      title: 'Taxonomia Completa de Acordes',
      subtitle:
        'Todos os 42 tipos de acordes — extensoes, suspensoes, notas adicionadas e estruturas especiais',
      objectives: [
        'Construir qualquer acorde com extensoes (nona, decima primeira, decima terceira) em qualquer qualidade a partir de uma fundamental',
        'Compreender acordes suspensos e de nota adicionada e como diferem das extensoes',
        'Explorar estruturas especiais: acordes quartais, power chords e poliacordes',
        'Usar o motor de acordes para identificar e construir qualquer acorde a partir da sua cifra',
      ],
      concepts: [
        {
          title: 'Acordes com Extensoes: Nonas ate Decimas Terceiras',
          explanation:
            'Os acordes com extensoes continuam o processo de empilhamento de tercas alem da setima. As qualidades maior, menor e dominante produzem familias de extensoes distintas. Cmaj9 acrescenta uma nona maior a Cmaj7. Cm11 acrescenta uma decima primeira perfeita a Cm9. G13 acrescenta uma decima terceira maior a G9 (com a decima primeira geralmente omitida em acordes dominantes para evitar o choque terca/decima primeira). Extensoes alteradas (b9, #9, #11, b13) criam a tensao cromatica essencial a conducao de vozes jazz. O motor suporta todas as extensoes padrao em todas as qualidades.',
          tryThisLabel: 'Constroi Cmaj13 — o empilhamento completo de extensoes maiores',
        },
        {
          title: 'Acordes Suspensos e de Nota Adicionada',
          explanation:
            'Os acordes suspensos substituem a terca por uma segunda (sus2) ou quarta (sus4), removendo a identidade maior/menor e criando um som aberto e nao resolvido. O 7sus4 e um acorde de setima dominante com quarta suspensa — comum no jazz como voicing pre-resolucao. Os acordes de nota adicionada mantem a terca e acrescentam uma nota sem implicar setima: Cadd9 tem fundamental, terca, quinta e nona mas sem setima. O acorde 6/9 (C6/9) acrescenta tanto a sexta como a nona a uma triade — um voicing jazz rico e estavel que funciona como alternativa de tonica ao maj7.',
          tryThisLabel: 'Ouve C7sus4 — a dominante suspensa',
        },
        {
          title: 'Estruturas Especiais: Quartais, Power Chords e Mais',
          explanation:
            'Nem todos os acordes sao construidos a partir de tercas empilhadas. Os acordes quartais empilham quartas perfeitas (Re-Sol-Do-Fa), produzindo uma qualidade ambigua e aberta central ao jazz modal — McCoy Tyner construiu a sua sonoridade de assinatura sobre estes voicings. Os power chords (apenas fundamental e quinta, sem terca) sao a espinha dorsal da guitarra rock, nem maiores nem menores. Os poliacordes empilham duas triades independentes para criar sonoridades complexas usadas na escrita orquestral e jazz. O motor cobre 42 tipos de acordes abrangendo triades, setimas, extensoes, alteracoes, suspensoes, notas adicionadas e power chords.',
          tryThisLabel: 'Ouve C6/9 — um voicing jazz classico sem setima',
        },
      ],
      tasks: [
        {
          instruction:
            'Constroi a escada de extensoes em Do: escreve "Cmaj7", "Cmaj9", "Cmaj13" em sequencia. Ouve como cada extensao acrescenta riqueza enquanto o shell (C, E, B) se mantem o mesmo.',
        },
        {
          instruction:
            'Compara acordes suspensos e de nota adicionada: escreve "Csus4", depois "Cadd9", depois "C6/9". Repara que sus4 nao tem terca, add9 nao tem setima, e 6/9 nao tem nem setima nem a tensao de resolucao de um acorde suspenso.',
        },
        {
          instruction:
            'Explora variacoes dominantes: escreve "C7", "C9", "C7sus4", "C7b9", "C7#9", "C13". Todos sao acordes da familia dominante, mas cada um tem uma cor distinta — de quente (C9) a escuro (C7b9) a aspero (C7#9) a amplo (C13).',
        },
      ],
    },
  },
};

export default curriculumL7;
