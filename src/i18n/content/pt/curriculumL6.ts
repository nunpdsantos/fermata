import type { CurriculumLevelOverlay } from '../types';

const curriculumL6: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    u18: {
      title: 'Acordes Cromáticos',
      description:
        'Acorde napolitano, acordes de sexta aumentada e modulação enarmónica pela sexta alemã',
    },
    u19: {
      title: 'Técnicas Cromáticas Avançadas',
      description:
        'Modulação pela sétima diminuta, embelezamento por nota comum, mediante cromáticas e dissolução tardo-romântica',
    },
    u20: {
      title: 'Contraponto e Escrita a Partes',
      description:
        'Contraponto de espécies completo, contraponto invertível, harmonização SATB e leitura de partitura',
    },
  },

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: {
    // ── U18 M1: The Neapolitan Chord (bII) ────────────────────────────────
    l6u18m1: {
      title: 'O Acorde Napolitano (bII)',
      subtitle: 'Um dramático pré-dominante cromático construído sobre o segundo grau rebaixado',
      objectives: [
        'Construir o acorde napolitano (tríade maior sobre o 2.o grau rebaixado) e usar bII6 como pré-dominante cromático',
        'Aplicar a condução de vozes correta, onde o b2 resolve descendentemente e o baixo se move de 4 para 5',
        'Reconhecer o efeito emocional sombrio e majestoso do napolitano e a sua cor frígia',
      ],
      concepts: [
        {
          title: 'O Que É o Napolitano?',
          explanation:
            'O napolitano é uma tríade maior construída sobre o segundo grau rebaixado. Em Dó maior ou Dó menor, esse acorde é Réb maior (Réb-Fá-Láb). Batizado com o nome da escola napolitana de ópera, funciona como uma substituição cromática dramática do pré-dominante típico (ii ou IV). É quase sempre usado na primeira inversão (bII6), colocando o 4.o grau no baixo para uma ligação suave com a dominante.',
          tryThisLabel: 'Toca Réb maior -- o napolitano em Dó menor',
        },
        {
          title: 'Porque a Primeira Inversão (bII6)?',
          explanation:
            'Na primeira inversão, a nota do baixo é o 4.o grau (Fá em Dó menor), que se liga suavemente à dominante pelo movimento do baixo 4 -> 5 -- o mesmo movimento de IV -> V. O drama cromático vive nas vozes superiores, onde o 2.o grau rebaixado (Réb) resolve descendentemente para a sensível ou a tónica. O napolitano em posição fundamental é mais raro, mas aparece na música romântica para um efeito mais enfático e surpreendente.',
          tryThisLabel: 'Ouve Réb/Fá -- napolitano na primeira inversão',
        },
        {
          title: 'Condução de Vozes e Efeito Emocional',
          explanation:
            'O 2.o grau rebaixado é uma nota de tendência forte que deve resolver descendentemente -- para a sensível ao mover-se para V, ou diretamente para a tónica. Nunca o dupliques. O b6 (quinta do bII) também resolve descendentemente para o 5.o grau. O napolitano soa sombrio, majestoso e pesado, importando uma cor de modo frígio para a harmonia. É um som característico de Beethoven, Schubert e de bandas sonoras modernas.',
          tryThisLabel: 'Vê Dó menor -- o contexto natural do napolitano',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "Db major chord" para ouvires o acorde napolitano de Dó menor. Repara como Réb-Fá-Láb soa sombrio e dramático em comparação com um acorde de Rém ou Fá neste contexto',
        },
        {
          instruction:
            'Escreve "Db/F" para ouvires o napolitano na primeira inversão. A nota do baixo Fá liga-se suavemente a Sol (dominante). Esta é a disposição padrão bII6 usada na música clássica',
        },
        {
          instruction:
            'Pensa no napolitano noutras tonalidades menores: em Lá menor, bII é Sib maior. Em Mi menor, bII é Fá maior. Em Ré menor, bII é Mib maior. Em cada caso, é uma tríade maior meio-tom acima da tónica',
        },
      ],
    },

    // ── U18 M2: Italian and French Augmented Sixth Chords ─────────────────
    l6u18m2: {
      title: 'Sexta Italiana e Sexta Francesa',
      subtitle: 'O intervalo de sexta aumentada e as suas duas variedades nacionais mais simples',
      objectives: [
        'Compreender o intervalo de sexta aumentada (b6 a #4) e a sua resolução divergente para uma oitava sobre o 5.o grau',
        'Construir a sexta italiana (It+6): b6, 1, #4 e resolvê-la para V',
        'Construir a sexta francesa (Fr+6): b6, 1, 2, #4 e reconhecer a sua cor de tons inteiros',
      ],
      concepts: [
        {
          title: 'O Intervalo de Sexta Aumentada',
          explanation:
            'Todos os acordes de sexta aumentada contêm um intervalo de sexta aumentada entre o 6.o grau rebaixado no baixo e o 4.o grau elevado numa voz superior. Em Dó: Láb (b6) até Fá# (#4). Este intervalo resolve divergentemente por movimento contrário -- Láb desce para Sol, Fá# sobe para Sol -- produzindo uma oitava sobre o 5.o grau, a fundamental da dominante. Esta resolução divergente é o gesto definidor de toda a família de sextas aumentadas.',
          tryThisLabel: 'Vê Dó maior -- o contexto para sextas aumentadas',
        },
        {
          title: 'A Sexta Italiana (It+6)',
          explanation:
            'A sexta italiana tem três notas: b6, 1, #4. Em Dó: Láb-Dó-Fá#. É o acorde de sexta aumentada mais simples -- apenas o intervalo de sexta aumentada mais o 1.o grau para preencher a sonoridade. Resolve diretamente para V com a fundamental duplicada. Por conter apenas três notas, é o membro mais leve e transparente da família.',
          tryThisLabel: 'Ouve Láb -- a nota do baixo das sextas aumentadas em Dó',
        },
        {
          title: 'A Sexta Francesa (Fr+6)',
          explanation:
            'A sexta francesa tem quatro notas: b6, 1, 2, #4. Em Dó: Láb-Dó-Ré-Fá#. Acrescenta o 2.o grau à sexta italiana. O resultado contém dois trítonos (Láb-Ré e Dó-Fá#), conferindo-lhe uma qualidade característica de tons inteiros -- as quatro notas pertencem à mesma coleção de tons inteiros. Esta cor exótica e suspensa torna a sexta francesa favorita dos compositores que procuram a máxima tensão pré-dominante.',
          tryThisLabel: 'Ouve Sol maior -- o acorde V para o qual estas sextas resolvem em Dó',
        },
      ],
      tasks: [
        {
          instruction:
            'Cifra a sexta italiana em Dó: Láb-Dó-Fá#. Agora cifra-a em Sol: Mib-Sol-Dó#. O padrão é sempre b6, 1, #4 da tonalidade-alvo. Pratica a construção da It+6 em Ré, Lá e Mib',
        },
        {
          instruction:
            'Cifra a sexta francesa em Dó: Láb-Dó-Ré-Fá#. Repara nos dois trítonos: Láb até Ré e Dó até Fá#. As quatro notas pertencem à escala de tons inteiros sobre Dó. Cifra a Fr+6 em Sol e em Ré',
        },
        {
          instruction:
            'Escreve "Ab major chord" e escuta. Agora imagina acrescentar Fá# numa voz superior. O intervalo Láb até Fá# é a sexta aumentada que define toda esta família de acordes',
        },
      ],
    },

    // ── U18 M3: German Augmented Sixth and Its Dual Identity ──────────────
    l6u18m3: {
      title: 'Sexta Alemã e a Sua Dupla Identidade',
      subtitle: 'O acorde Gr+6 e a sua equivalência enarmónica com o acorde de sétima da dominante',
      objectives: [
        'Construir a sexta alemã (Gr+6): b6, 1, b3, #4 e reconhecer a sua sonoridade rica e cheia',
        'Reconhecer que a Gr+6 é enarmonicamente idêntica a um acorde de sétima da dominante',
        'Resolver a Gr+6 através de um 6/4 cadencial para evitar quintas paralelas',
      ],
      concepts: [
        {
          title: 'A Sexta Alemã (Gr+6)',
          explanation:
            'A sexta alemã tem quatro notas: b6, 1, b3, #4. Em Dó: Láb-Dó-Mib-Fá#. Acrescenta o 3.o grau rebaixado (do modo menor) à sexta italiana. Ao contrário da cor de tons inteiros da sexta francesa, a sexta alemã soa rica e cheia -- é uma sonoridade completa de quatro notas com uma qualidade menor nas três notas inferiores.',
          tryThisLabel: 'Ouve Láb7 -- o gémeo enarmónico da Gr+6 em Dó',
        },
        {
          title: 'Equivalência Enarmónica: Gr+6 = V7',
          explanation:
            'Reescreve a sexta alemã em Dó: Láb-Dó-Mib-Fá# torna-se Láb-Dó-Mib-Solb quando Fá# é reescrito como Solb. Láb-Dó-Mib-Solb é Láb sétima da dominante (Láb7). O mesmo som serve duas funções completamente diferentes -- Gr+6 resolvendo para V em Dó, ou V7 resolvendo para I em Réb. Esta dupla identidade é o fundamento da modulação enarmónica entre tonalidades distantes.',
          tryThisLabel: 'Ouve Réb maior -- para onde Láb7 resolve como V7',
        },
        {
          title: 'O Problema das Quintas Paralelas',
          explanation:
            'Quando a Gr+6 resolve diretamente para V, o movimento das vozes b3 -> 2 (Mib -> Ré em Dó) e b6 -> 5 (Láb -> Sol) cria quintas paralelas -- proibidas na escrita rigorosa a partes. A solução padrão é inserir um acorde de 6/4 cadencial: Gr+6 -> I6/4 -> V. O acorde 6/4 quebra o movimento paralelo. As sextas italiana e francesa não têm este problema porque lhes falta o b3.',
          tryThisLabel: 'Ouve Dó/Sol -- o 6/4 cadencial que quebra as paralelas',
        },
      ],
      tasks: [
        {
          instruction:
            'Cifra a sexta alemã em Dó: Láb-Dó-Mib-Fá#. Agora reescreve Fá# como Solb: Láb-Dó-Mib-Solb = Láb7. Mesmo som, função completamente diferente. Esta equivalência enarmónica é explorada na modulação enarmónica',
        },
        {
          instruction:
            'Cifra a sexta alemã em Ré: Sib-Ré-Fá-Sol#. Reescreve Sol# como Láb: Sib-Ré-Fá-Láb = Sib7 = V7 de Mib. Cifra a Gr+6 em Lá e encontra o seu gémeo de sétima da dominante',
        },
        {
          instruction:
            'Escreve "Ab7" para ouvires o acorde. Este é simultaneamente V7 de Réb e Gr+6 em Dó. A resolução que escolhes determina a tonalidade que o ouvinte percebe',
        },
      ],
    },

    // ── U18 M4: Enharmonic Modulation: Gr+6 <-> V7 ───────────────────────
    l6u18m4: {
      title: 'Modulação Enarmónica: Gr+6 <-> V7',
      subtitle: 'Pivotar entre tonalidades distantes reinterpretando a sexta alemã como uma sétima da dominante',
      objectives: [
        'Modular entre tonalidades distantes usando a equivalência enarmónica Gr+6/V7',
        'Mapear as relações de tonalidades acessíveis através deste pivot (tonalidades a meio-tom de distância)',
        'Aplicar a técnica nas duas direções: Gr+6 -> V7 e V7 -> Gr+6',
      ],
      concepts: [
        {
          title: 'O Pivot Gr+6/V7 em Ação',
          explanation:
            'Para modular de Dó para Réb usando esta técnica: estabelece Dó como tonalidade, aborda o acorde Láb-Dó-Mib-Fá# como Gr+6 em Dó, depois resolve-o como Láb7 (V7 de Réb) para Réb maior. O ouvido do ouvinte aceita ambas as interpretações porque o acorde é acusticamente idêntico. A resolução determina a tonalidade percebida. Um único acorde pivota entre tonalidades que distam meio-tom -- uma das relações mais distantes no círculo de quintas.',
          tryThisLabel: 'Vê como Dó e Réb estão distantes no círculo',
        },
        {
          title: 'Funciona nas Duas Direções',
          explanation:
            'O pivot funciona ao contrário também. Para modular de Réb para Dó: estabelece Réb, aborda Láb7 como V7 de Réb, depois resolve-o como Gr+6 em Dó tratando-o como Láb-Dó-Mib-Fá# resolvendo para Sol (V de Dó). O mesmo acorde que te leva de Dó a Réb pode também trazer-te de volta. Qualquer par de tonalidades a meio-tom de distância é acessível através desta técnica.',
          tryThisLabel: 'Ouve Sol maior -- V de Dó, a chegada após a Gr+6 resolver',
        },
        {
          title: 'Mapear Todos os Pivots Gr+6/V7 Possíveis',
          explanation:
            'Uma vez que qualquer acorde de sétima da dominante pode ser reinterpretado como sexta alemã, cada tonalidade tem acesso a um alvo de modulação meio-tom acima ou abaixo. De Dó, a Gr+6 alcança Réb. De Ré, a Gr+6 alcança Mib. De Fá#, a Gr+6 alcança Sol. A técnica abre caminhos modulatórios diretos entre tonalidades que de outra forma exigiriam muitos passos intermediários pelo círculo de quintas.',
          tryThisLabel: 'Ouve Réb maior -- a tonalidade distante de chegada a partir de Dó',
        },
      ],
      tasks: [
        {
          instruction:
            'Cifra a sexta alemã em Ré: Sib-Ré-Fá-Sol#. Reescreve Sol# como Láb: Sib-Ré-Fá-Láb = Sib7 = V7 de Mib. Podes pivotar de Ré maior para Mib maior através de um único acorde',
        },
        {
          instruction:
            'Planeia uma modulação de Lá maior para Sib maior usando Gr+6/V7. Primeiro: qual é a Gr+6 em Lá? (Fá-Lá-Dó-Ré#.) Reescreve Ré# como Mib: Fá-Lá-Dó-Mib = Fá7 = V7 de Sib. Resolve para Sib',
        },
        {
          instruction:
            'Escreve "Db major chord" e ouve a tonalidade de chegada. Uma única reinterpretação enarmónica moveu-nos de Dó para Réb -- seis posições ao redor do círculo de quintas num só passo',
        },
      ],
    },

    // ── U19 M1: Enharmonic Modulation: Diminished Seventh ─────────────────
    l6u19m1: {
      title: 'Modulação Enarmónica: Sétima Diminuta',
      subtitle: 'A flexibilidade enarmónica quádrupla do acorde de sétima diminuta',
      objectives: [
        'Compreender que um acorde de sétima diminuta divide a oitava em quatro terças menores iguais',
        'Reinterpretar qualquer nota de um acorde dim7 como sensível para resolver em quatro tonalidades diferentes',
        'Aplicar a modulação enarmónica por dim7 para alcançar tonalidades a uma terça menor, um trítono ou uma sexta maior de distância',
      ],
      concepts: [
        {
          title: 'A Simetria da Sétima Diminuta',
          explanation:
            'Um acorde de sétima diminuta divide a oitava em quatro terças menores iguais. Si-Ré-Fá-Láb: cada par adjacente dista uma terça menor. Devido a esta simetria perfeita, o acorde soa igual independentemente de qual nota seja considerada a fundamental. Existem apenas três acordes de sétima diminuta distintos no sistema de doze notas -- cada acorde dim7 é uma reescrita enarmónica de um destes três.',
          tryThisLabel: 'Ouve Sidim7 -- quatro terças menores iguais',
        },
        {
          title: 'Quatro Resoluções Possíveis',
          explanation:
            'Como qualquer uma das quatro notas pode servir de sensível, um único acorde de sétima diminuta pode funcionar como viio7 em quatro tonalidades diferentes. Si-Ré-Fá-Láb resolve para Dó menor (Si é sensível). Reescrito como Ré-Fá-Láb-Dób: resolve para Mib menor (Ré é sensível). Reescrito como Fá-Láb-Dób-Mibb: resolve para Solb menor. Reescrito como Sol#-Si-Ré-Fá (Sol# como sensível): resolve para Lá menor. As quatro tonalidades-alvo -- Dó, Mib, Solb, Lá -- distam uma terça menor entre si.',
          tryThisLabel: 'Vê Dó menor -- uma das quatro resoluções possíveis',
        },
        {
          title: 'Aplicar a Modulação Enarmónica por Dim7',
          explanation:
            'Para modular de Dó menor para Lá menor via dim7: usa viio7 de Dó menor (Si-Ré-Fá-Láb), depois reescreve Láb como Sol# para obter viio7 de Lá menor (Sol#-Si-Ré-Fá), e resolve para Lá menor. O acorde não muda sonoramente -- apenas a grafia e a resolução mudam. Esta técnica alcança tonalidades a uma terça menor, um trítono ou uma sexta maior de distância num único passo, tornando-a o pivot enarmónico mais versátil da música tonal.',
          tryThisLabel: 'Vê Lá menor -- uma tonalidade-alvo distante a partir de Dó',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "Bdim7" -- este acorde pode resolver para Dó menor, Mib menor, Solb menor ou Lá menor. As quatro resoluções são igualmente válidas. A grafia enarmónica determina a tonalidade de destino',
        },
        {
          instruction:
            'Localiza as quatro resoluções de Sidim7 no círculo de quintas: Dó, Mib, Solb, Lá. Distam uma terça menor entre si -- dividindo a oitava em quatro partes iguais, tal como o próprio acorde',
        },
        {
          instruction:
            'Parte de Fá#dim7 (Fá#-Lá-Dó-Mib). Encontra as quatro tonalidades-alvo: Sol menor (Fá# como sensível), Sib menor (Lá como sensível), Réb menor (Dó como sensível), Mi menor (Mib reescrito como Ré# como sensível)',
        },
      ],
    },

    // ── U19 M2: Common-Tone Diminished Seventh ────────────────────────────
    l6u19m2: {
      title: 'Sétima Diminuta com Nota Comum',
      subtitle: 'O acorde CTo7 como embelezamento cromático que partilha uma nota com o acorde-alvo',
      objectives: [
        'Construir um acorde CTo7 que partilha a fundamental do acorde-alvo',
        'Resolver o CTo7 corretamente mantendo a nota comum e movendo as outras três vozes por meio-tom',
        'Distinguir o CTo7 de um viio7 funcional -- o CTo7 embeleza em vez de modular',
      ],
      concepts: [
        {
          title: 'O Que É o CTo7?',
          explanation:
            'Um acorde de sétima diminuta com nota comum partilha uma nota (a nota comum) com o acorde que embeleza. A nota comum é geralmente a fundamental do acorde-alvo. As outras três notas do acorde dim7 resolvem cada uma por meio-tom para as restantes notas do acorde. Ao contrário de um viio7 funcional, o CTo7 não muda a tonalidade -- cria uma abordagem cromática dramática a um acorde que o ouvinte já espera.',
          tryThisLabel: 'Ouve Dó maior -- o acorde-alvo que um CTo7 embeleza',
        },
        {
          title: 'Construir o CTo7',
          explanation:
            'Para construir o CTo7 de Dó maior: mantém Dó como nota comum, depois preenche um acorde de sétima diminuta que inclua Dó. Uma opção: Dó-Ré#-Fá#-Lá (= Dó com Ré#dim7 a rodeá-lo). Ré# resolve subindo para Mi, Fá# resolve subindo para Sol, Lá resolve descendo para Sol (ou sobe para a oitava). As três vozes em movimento deslocam-se cada uma por meio-tom para dentro do acorde-alvo enquanto Dó se mantém firme. O resultado é uma abordagem cromática cintilante.',
          tryThisLabel: 'Toca Dó maior -- ouve o alvo da resolução',
        },
        {
          title: 'O CTo7 em Contexto Musical',
          explanation:
            'O CTo7 é comum na música romântica e em bandas sonoras. Embeleza frequentemente a tónica (CTo7 -> I) ou a dominante (CTo7 -> V). Como não muda a tonalidade, funciona mais como um acorde vizinho cromático do que como uma verdadeira modulação. A notação CTo7 distingue-o de uma análise viio7, que implicaria uma tonicização. O CTo7 é pura cor e embelezamento.',
          tryThisLabel: 'Ouve Sol maior -- o CTo7 também pode embelezar V',
        },
      ],
      tasks: [
        {
          instruction:
            'Constrói o CTo7 de Dó maior: mantém Dó, acrescenta um acorde dim7 contendo Dó. Um resultado: Dó-Ré#-Fá#-Lá. Verifica que Ré#, Fá# e Lá resolvem cada um por meio-tom para notas do acorde de Dó maior (Mi, Sol e Sol ou Dó)',
        },
        {
          instruction:
            'Constrói o CTo7 de Sol maior: mantém Sol, acrescenta um acorde dim7 contendo Sol. Resultado: Sol-Lá#-Dó#-Mi. Lá# resolve para Si, Dó# resolve para Ré, Mi mantém-se ou resolve para Ré. O alvo é Sol-Si-Ré',
        },
        {
          instruction:
            'Escreve "C major chord" e ouve o alvo da resolução. Agora imagina o acorde CTo7 (Dó-Ré#-Fá#-Lá) a aproximar-se -- três vozes deslocam-se por meio-tom enquanto Dó se sustenta. Isto é puro embelezamento cromático, não modulação',
        },
      ],
    },

    // ── U19 M3: Chromatic Mediants and Altered Dominants ──────────────────
    l6u19m3: {
      title: 'Mediantes Cromáticas e Dominantes Alteradas',
      subtitle: 'Acordes cromáticos por relação de terça, dominantes alteradas e a progressão omnibus',
      objectives: [
        'Identificar relações de mediante cromática (fundamentais a uma terça de distância com pelo menos uma alteração cromática)',
        'Construir dominantes alteradas (V+, V7b5, V7#5) e compreender a sua resolução intensificada para I',
        'Reconhecer a progressão omnibus como um padrão cromático de troca de vozes através de sonoridades dominantes',
      ],
      concepts: [
        {
          title: 'Mediantes Cromáticas',
          explanation:
            'Uma mediante cromática é um acorde cuja fundamental dista uma terça maior ou menor do acorde atual, com pelo menos uma alteração cromática entre eles. A partir de Dó maior, Láb maior e Mi maior são mediantes cromáticas -- cada uma partilha uma nota comum com Dó, mas altera cromaticamente as restantes. Mediantes duplamente cromáticas não partilham qualquer nota comum. Estas mudanças dramáticas são uma marca das bandas sonoras e da música tardo-romântica.',
          tryThisLabel: 'Ouve Láb maior -- mediante cromática de Dó',
        },
        {
          title: 'Dominantes Alteradas',
          explanation:
            'As dominantes alteradas acrescentam tensão cromática ao acorde de dominante. V+ (dominante aumentada) eleva a quinta, que resolve ascendentemente para a 3.a de I. V7b5 rebaixa a quinta, comum no jazz. V7#5 combina a quinta aumentada com uma sétima. Dominantes duplamente aplicadas (V/V/V) estendem a cadeia um nível adiante: em Dó, Lá7 -> Ré7 -> Sol7 -> Dó cria um impulso cascateante através de resoluções dominantes sequenciais.',
          tryThisLabel: 'Ouve Mi maior -- outra mediante cromática de Dó',
        },
        {
          title: 'A Progressão Omnibus',
          explanation:
            'O omnibus é um padrão cromático de troca de vozes onde uma voz sobe cromaticamente enquanto outra desce, com as restantes vozes a sustentar-se. Isto cria uma paisagem harmónica lentamente evolutiva, movendo-se através de sonoridades de sétima da dominante e de sexta aumentada. Comum na música do século XIX, produz uma sensação de errância harmónica sem direção funcional clara.',
          tryThisLabel: 'Ouve Dó7#5 -- uma sonoridade de dominante alterada',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "Ab major chord", depois "C major chord", depois "E major chord" -- ouve como cada mediante cromática partilha uma nota com Dó maior mas altera cromaticamente as outras duas. O efeito é vívido e dramático',
        },
        {
          instruction:
            'Pensa na cadeia V/V/V em Dó: Lá7 resolve para Ré7, Ré7 resolve para Sol7, Sol7 resolve para Dó. Cada elo é uma resolução dominante-tónica criando um impulso cascateante',
        },
        {
          instruction:
            'Escreve "C7#5" para ouvires uma dominante alterada. A quinta elevada cria tensão cromática adicional que intensifica a resolução para a tónica. Compara com um Dó7 simples',
        },
      ],
    },

    // ── U19 M4: Late Romantic Harmonic Techniques ─────────────────────────
    l6u19m4: {
      title: 'Técnicas Harmónicas Tardo-Românticas',
      subtitle: 'Harmonia não funcional, planing cromático e a dissolução da tonalidade',
      objectives: [
        'Reconhecer a divisão igual da oitava (padrões de tons inteiros, diminutos, aumentados) como fontes de ambiguidade tonal',
        'Identificar sucessões de acordes não funcionais e planing cromático como alternativas à harmonia funcional',
        'Compreender a tonalidade alargada como o esticar e eventual dissolução dos centros tonais',
      ],
      concepts: [
        {
          title: 'Divisão Igual da Oitava',
          explanation:
            'Padrões simétricos que dividem os 12 semitons igualmente criam ambiguidade tonal porque nenhuma nota se sente como "casa". A divisão por 2 produz a escala de tons inteiros (6 notas, apenas 2 transposições possíveis). A divisão por 3 produz o acorde de sétima diminuta (4 notas). A divisão por 4 produz a tríade aumentada (3 notas). Estas estruturas foram exploradas por Debussy, Ravel, Liszt e Wagner para esbater ou dissolver centros tonais.',
          tryThisLabel: 'Ouve a escala de tons inteiros -- divisão por 2',
        },
        {
          title: 'Sucessões de Acordes Não Funcionais',
          explanation:
            'Na música tardo-romântica, as progressões de acordes abandonam cada vez mais a lógica funcional (T-PD-D-T). Em vez disso, os acordes ligam-se por proximidade de condução de vozes (cada voz move-se minimamente), persistência de nota comum (uma altura sustenta-se ao longo das mudanças de acorde) ou lógica de pura sonoridade (acordes escolhidos pela cor, não pela função). Isto marca o início da dissolução da tonalidade e o caminho rumo à atonalidade.',
          tryThisLabel: 'Ouve a escala diminuta -- divisão simétrica por 3',
        },
        {
          title: 'Planing Cromático e Tonalidade Alargada',
          explanation:
            'O planing move uma forma de acorde em movimento paralelo por tom ou meio-tom, ignorando as restrições de tonalidade. O planing cromático (tudo por meios-tons) produz um banho de pura cor sem direção funcional. O planing diatónico ajusta a qualidade dos intervalos para permanecer na tonalidade. A tonalidade alargada estende os limites tonais: modulações remotas tornam-se frequentes, a saturação cromática torna a identificação da tonalidade difícil e as cadências tradicionais são evitadas. Este é o crepúsculo da tonalidade da prática comum.',
          tryThisLabel: 'Explora o mundo dos tons inteiros -- a paleta de Debussy',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "whole tone scale" -- cada intervalo adjacente é um tom. Sem meios-tons, sem sensíveis, sem atração dominante. Isto é pura ambiguidade tonal, o fundamento da linguagem harmónica de Debussy',
        },
        {
          instruction:
            'Escreve "C diminished scale" -- este padrão alternado tom-meio-tom cria uma escala simétrica de oito notas contendo quatro trítonos e quatro terças menores, dividindo a oitava em partes iguais',
        },
        {
          instruction:
            'Imagina mover uma tríade de Dó maior subindo por meio-tom repetidamente: Dó-Réb-Ré-Mib... Cada acorde é uma transposição paralela. Nenhuma voz conduz funcionalmente -- cada nota desloca-se na mesma quantidade. Isto é planing cromático na sua forma mais pura',
        },
      ],
    },

    // ── U20 M1: Species Counterpoint: First through Third Species ─────────
    l6u20m1: {
      title: 'Contraponto de Espécies: Primeira a Terceira Espécie',
      subtitle: 'Cantus firmus, nota contra nota, 2:1 e 4:1',
      objectives: [
        'Escrever um cantus firmus seguindo regras estabelecidas (8-12 notas, maioritariamente por grau conjunto, um único clímax)',
        'Dominar a primeira espécie (1:1) com consonâncias e a segunda espécie (2:1) com tratamento de dissonância em tempo fraco',
        'Dominar a terceira espécie (4:1) com notas de passagem, bordaduras, cambiata e bordaduras duplas',
      ],
      concepts: [
        {
          title: 'Cantus Firmus e Primeira Espécie (1:1)',
          explanation:
            'O cantus firmus (CF) é uma melodia simples de 8 a 12 semibreves, começando e terminando na tónica, maioritariamente por grau conjunto com um ponto culminante. A primeira espécie coloca uma nota contra cada nota do CF usando apenas consonâncias -- começa com P1, P5 ou P8, termina com P1 ou P8 abordada por grau conjunto, favorece consonâncias imperfeitas (terças e sextas) e proíbe intervalos perfeitos paralelos. Sem cruzamento de vozes, sem mais de três terças ou sextas consecutivas.',
          tryThisLabel: 'Vê as notas disponíveis para um CF em Dó maior',
        },
        {
          title: 'Segunda Espécie (2:1)',
          explanation:
            'Duas notas contra cada nota do CF. Os tempos fortes devem ser consonantes com o CF. Os tempos fracos podem ser dissonantes se abordados e deixados por grau conjunto (nota de passagem) ou se se afastam e regressam por grau conjunto (bordadura). Sem uníssonos em tempos fortes, exceto no início e no fim. A segunda espécie introduz o princípio fundamental do tratamento da dissonância: a dissonância é permitida apenas quando controlada por movimento por grau conjunto.',
          tryThisLabel: 'Vê Sol maior -- outra tonalidade comum para CF',
        },
        {
          title: 'Terceira Espécie (4:1)',
          explanation:
            'Quatro notas contra cada nota do CF. A primeira nota de cada grupo deve ser consonante; as restantes três podem ser dissonantes como notas de passagem, bordaduras ou a figura de cambiata (grau conjunto para dissonância, salto de terça, grau conjunto de volta). Bordaduras duplas (bordadura superior e inferior em sequência) também são permitidas. A terceira espécie produz o contraponto mais melodicamente ativo e ornamentado antes da síncopa entrar na quarta espécie.',
          tryThisLabel: 'Vê Ré maior -- experimenta traçar um cantus firmus',
        },
      ],
      tasks: [
        {
          instruction:
            'Regras para um cantus firmus: começa e termina na tónica, maioritariamente por grau conjunto, um clímax abordado e deixado por grau conjunto, sem notas repetidas, âmbito dentro de uma oitava. Tenta compor mentalmente um em Dó maior usando apenas Dó-Ré-Mi-Fá-Sol-Lá-Si-Dó',
        },
        {
          instruction:
            'Na primeira espécie, começa com um uníssono perfeito, quinta ou oitava. Usa sobretudo consonâncias imperfeitas (terças e sextas). Proíbe quintas e oitavas perfeitas paralelas. Termina com um uníssono ou oitava abordada por grau conjunto',
        },
        {
          instruction:
            'Na terceira espécie, a cambiata é uma figura ornamental específica: consonância, grau conjunto para dissonância, salto de terça na mesma direção, depois grau conjunto de volta. Permite que uma nota dissonante seja deixada por salto -- a única exceção à regra de que a dissonância deve resolver por grau conjunto',
        },
      ],
    },

    // ── U20 M2: Species Counterpoint: Fourth and Fifth Species ────────────
    l6u20m2: {
      title: 'Contraponto de Espécies: Quarta e Quinta Espécie',
      subtitle: 'Contraponto sincopado, suspensões e contraponto florido',
      objectives: [
        'Dominar a quarta espécie (sincopada): notas ligadas criando suspensões que resolvem descendentemente por grau conjunto',
        'Identificar suspensões dissonantes padrão (7-6, 4-3, 9-8, 2-3) e encadeá-las em sequências',
        'Dominar a quinta espécie (florida): combinando todas as espécies anteriores livremente numa única linha',
      ],
      concepts: [
        {
          title: 'Quarta Espécie: Síncopa e Suspensões',
          explanation:
            'A quarta espécie introduz a síncopa -- notas ligadas de um tempo fraco através da barra de compasso para o tempo forte seguinte. Quando a nota ligada é dissonante contra o CF no tempo forte, cria uma suspensão. A suspensão tem três fases: preparação (consonância no tempo fraco), dissonância (a nota ligada no tempo forte) e resolução (grau conjunto descendente para consonância). Suspensões dissonantes padrão são 7-6, 4-3 e 9-8 acima do CF, e 2-3 quando o contraponto está abaixo.',
          tryThisLabel: 'Vê Dó maior -- traça padrões de suspensão',
        },
        {
          title: 'Cadeias de Suspensões',
          explanation:
            'As suspensões podem ser encadeadas: cada resolução torna-se a preparação da suspensão seguinte. Uma cadeia de suspensões 7-6 ou 4-3 cria uma linha descendente por grau conjunto de dissonâncias ligadas, produzindo uma das texturas mais expressivas da música tonal. As cadeias de suspensões são uma marca da música barroca e renascentista e permanecem fundamentais em toda a escrita a partes.',
          tryThisLabel: 'Vê Sol maior -- imagina uma cadeia de suspensões 7-6',
        },
        {
          title: 'Quinta Espécie: Contraponto Florido',
          explanation:
            'A quinta espécie combina livremente todas as espécies anteriores: semibreves, mínimas, semínimas e síncopa coexistem numa única linha. Todas as regras das espécies anteriores aplicam-se aos respetivos valores de notas. O contraponto florido é o mais próximo que os exercícios de espécies chegam da composição musical real, demonstrando como regras estritas produzem resultados genuinamente musicais e formando a ponte do contraponto académico para a composição livre.',
          tryThisLabel: 'Vê Ré maior -- a tela para contraponto florido',
        },
      ],
      tasks: [
        {
          instruction:
            'Suspensões da quarta espécie: 7-6 e 4-3 são as suspensões dissonantes padrão. A dissonância ocorre no tempo forte (a nota ligada) e resolve por grau conjunto descendente no tempo fraco. Este padrão é a origem de todo o uso de suspensões na música tonal',
        },
        {
          instruction:
            'Uma cadeia de suspensões 7-6: o 6 (resolução consonante) é imediatamente ligado para se tornar o 7 (suspensão dissonante) contra a nota seguinte do CF. Cada resolução alimenta a suspensão seguinte, criando tensão melódica e harmónica contínua',
        },
        {
          instruction:
            'A quinta espécie combina tudo: um compasso pode começar com uma suspensão ligada (4.a espécie), resolver em semínimas (3.a espécie) e assentar numa mínima (2.a espécie). A arte está em equilibrar variedade com uma forma melódica coerente',
        },
      ],
    },

    // ── U20 M3: Three-Part Counterpoint and Invertible Counterpoint ───────
    l6u20m3: {
      title: 'Contraponto a Três Partes e Contraponto Invertível',
      subtitle: 'Contraponto multivozes e técnicas invertíveis à oitava, décima e duodécima',
      objectives: [
        'Estender o contraponto de espécies para três e quatro vozes com intervalos válidos contra todas as partes existentes',
        'Compreender o contraponto invertível à oitava, décima e duodécima e as restrições de intervalos que cada um impõe',
        'Aplicar técnicas de contraponto triplo onde três melodias funcionam em qualquer das seis disposições verticais',
      ],
      concepts: [
        {
          title: 'Adicionar Vozes: Escrita a Três e Quatro Partes',
          explanation:
            'Quando uma terceira voz entra, deve formar intervalos válidos com ambas as vozes existentes simultaneamente, multiplicando as restrições. A escrita a três partes produz tríades completas, acrescentando riqueza harmónica. A escrita a quatro partes restringe ainda mais o movimento mas abre a textura completa SATB. Cada voz adicional aumenta exponencialmente o número de pares de intervalos que devem ser verificados quanto a quintas e oitavas paralelas.',
          tryThisLabel: 'Ouve uma tríade de três notas -- a sonoridade a 3 vozes mais simples',
        },
        {
          title: 'Contraponto Invertível à Oitava',
          explanation:
            'Contraponto invertível à oitava significa que duas melodias funcionam corretamente com qualquer uma das vozes por cima. Quando invertidas, as terças tornam-se sextas (aceitável), mas as quintas tornam-se quartas (dissonantes acima do baixo no estilo da prática comum). Portanto, o contraponto invertível à oitava evita quintas. A inversão à décima transforma terças em oitavas e sextas em quintas. A inversão à duodécima transforma quintas em oitavas -- J.S. Bach usou-a extensamente nas suas fugas.',
          tryThisLabel: 'Ouve Dó/Mi -- inverter o baixo muda a textura',
        },
        {
          title: 'Contraponto Triplo',
          explanation:
            'O contraponto triplo exige três melodias que funcionem em todas as seis permutações verticais (ABC, ACB, BAC, BCA, CAB, CBA) -- extraordinariamente exigente de escrever. Todas as seis disposições devem produzir contraponto válido com tratamento correto de consonâncias. Este é o ponto culminante da arte contrapontística, demonstrado mais completamente nas fugas de Bach e na Arte da Fuga.',
          tryThisLabel: 'Ouve Sol maior -- outra sonoridade a três vozes para inverter',
        },
      ],
      tasks: [
        {
          instruction:
            'Na escrita a três partes, verifica cada par de vozes quanto a quintas e oitavas paralelas. Com as vozes A, B e C, deves verificar A-B, A-C e B-C -- três pares em vez de um',
        },
        {
          instruction:
            'Para contraponto invertível à oitava: os intervalos transformam-se da seguinte forma -- uníssono torna-se oitava, segunda torna-se sétima, terça torna-se sexta, quarta torna-se quinta, quinta torna-se quarta. Como as quartas são dissonantes acima do baixo, as quintas devem ser evitadas no original',
        },
        {
          instruction:
            'O contraponto triplo tem seis permutações. Se a melodia A está acima de B e B acima de C no original, todas as outras cinco ordenações devem também produzir contraponto válido. Bach conseguia isto rotineiramente nas suas fugas',
        },
      ],
    },

    // ── U20 M4: Advanced Part Writing and Score Reading ───────────────────
    l6u20m4: {
      title: 'Escrita a Partes Avançada e Leitura de Partitura',
      subtitle: 'Harmonização SATB, realização de baixo cifrado e leitura de partitura orquestral',
      objectives: [
        'Harmonizar melodias de soprano e baixo em textura a quatro partes SATB seguindo regras de condução de vozes',
        'Realizar baixo cifrado preenchendo as vozes superiores a partir das cifras e acidentes do baixo',
        'Ler partituras orquestrais completas transpondo instrumentos para altura de concerto e reduzindo ao conteúdo harmónico',
      ],
      concepts: [
        {
          title: 'Harmonização de Soprano',
          explanation:
            'Dada uma melodia de soprano, a tarefa é escolher acordes e preencher contralto, tenor e baixo. O processo: determinar a tonalidade e localizar pontos de cadência, escolher uma linha de baixo e progressão de acordes que suporte funcionalmente a melodia, preencher as vozes interiores seguindo regras de condução de vozes, depois verificar erros (quintas/oitavas paralelas, violações de espaçamento, erros de duplicação, cruzamento de vozes).',
          tryThisLabel: 'Vê os acordes diatónicos de Dó maior -- a paleta de harmonização',
        },
        {
          title: 'Realização de Baixo Cifrado',
          explanation:
            'A notação de baixo cifrado fornece uma linha de baixo com números indicando os intervalos acima de cada nota. Sem cifras significa posição fundamental (5/3), 6 significa primeira inversão, 6/4 significa segunda inversão, 7 significa acorde de sétima em posição fundamental. Acidentes modificam intervalos específicos. Realizar baixo cifrado -- preencher as três vozes superiores em tempo real -- era a competência quotidiana de todo o tecladista barroco.',
          tryThisLabel: 'Vê Sol maior -- pratica mentalmente o baixo cifrado',
        },
        {
          title: 'Leitura de Partitura Orquestral',
          explanation:
            'Uma partitura orquestral completa organiza os instrumentos de cima para baixo: madeiras, metais, percussão, cordas. Os instrumentos transpositores (clarinete em Sib, trompa em Fá) são escritos a uma altura diferente da que soam. Ler uma partitura exige transpor mentalmente estas partes para a altura de concerto, ler claves de Dó (clave de contralto para a viola, clave de tenor para o violoncelo) e reduzir múltiplas vozes ao seu conteúdo harmónico essencial.',
          tryThisLabel: 'Vê Sib maior -- a tonalidade em que um clarinete em Sib lê',
        },
      ],
      tasks: [
        {
          instruction:
            'Para harmonizar uma melodia de soprano: primeiro identifica pontos de cadência (determinam os objetivos harmónicos), depois trabalha para trás a partir de cada cadência para preencher a progressão de acordes. As vozes interiores seguem o caminho mais curto entre notas do acorde',
        },
        {
          instruction:
            'Abreviaturas de baixo cifrado: sem cifras = posição fundamental (5/3), 6 = primeira inversão, 6/4 = segunda inversão, 7 = sétima em posição fundamental, 6/5 = sétima na primeira inversão, 4/3 = sétima na segunda inversão, 4/2 = sétima na terceira inversão',
        },
        {
          instruction:
            'Instrumentos transpositores: um clarinete em Sib soa um tom abaixo do que está escrito (lê Dó, o público ouve Sib). Uma trompa em Fá soa uma quinta perfeita abaixo do que está escrito. Os leitores de partitura devem transpor mentalmente para ouvir as alturas reais',
        },
      ],
    },
  },
};

export default curriculumL6;
