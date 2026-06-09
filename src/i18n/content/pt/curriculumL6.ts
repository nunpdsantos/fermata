import type { CurriculumLevelOverlay } from '../types';

const curriculumL6: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    u18: {
      title: 'Acordes Cromaticos',
      description:
        'Acorde napolitano, acordes de sexta aumentada e modulacao enarminica pela sexta alema',
    },
    u19: {
      title: 'Tecnicas Cromaticas Avancadas',
      description:
        'Modulacao pela setima diminuta, embelezamento por nota comum, mediante cromaticas e dissolucao tardo-romantica',
    },
    u20: {
      title: 'Contraponto e Escrita a Partes',
      description:
        'Contraponto de especies completo, contraponto invertivel, harmonizacao SATB e leitura de partitura',
    },
  },

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: {
    // ── U18 M1: The Neapolitan Chord (bII) ────────────────────────────────
    l6u18m1: {
      title: 'O Acorde Napolitano (bII)',
      subtitle: 'Um dramatico pre-dominante cromatico construido sobre o segundo grau rebaixado',
      objectives: [
        'Construir o acorde napolitano (triade maior sobre o 2.o grau rebaixado) e usar bII6 como pre-dominante cromatico',
        'Aplicar a conducao de vozes correta, onde o b2 resolve descendentemente e o baixo se move de 4 para 5',
        'Reconhecer o efeito emocional sombrio e majestoso do napolitano e a sua cor frigia',
      ],
      concepts: [
        {
          title: 'O Que E o Napolitano?',
          explanation:
            'O napolitano e uma triade maior construida sobre o segundo grau rebaixado. Em Do maior ou Do menor, esse acorde e Reb maior (Reb-Fa-Lab). Batizado com o nome da escola napolitana de opera, funciona como uma substituicao cromatica dramatica do pre-dominante tipico (ii ou IV). E quase sempre usado na primeira inversao (bII6), colocando o 4.o grau no baixo para uma ligacao suave com a dominante.',
          tryThisLabel: 'Toca Reb maior -- o napolitano em Do menor',
        },
        {
          title: 'Porque a Primeira Inversao (bII6)?',
          explanation:
            'Na primeira inversao, a nota do baixo e o 4.o grau (Fa em Do menor), que se liga suavemente a dominante pelo movimento do baixo 4 -> 5 -- o mesmo movimento de IV -> V. O drama cromatico vive nas vozes superiores, onde o 2.o grau rebaixado (Reb) resolve descendentemente para a sensivel ou a tonica. O napolitano em posicao fundamental e mais raro, mas aparece na musica romantica para um efeito mais enfatico e surpreendente.',
          tryThisLabel: 'Ouve Reb/Fa -- napolitano na primeira inversao',
        },
        {
          title: 'Conducao de Vozes e Efeito Emocional',
          explanation:
            'O 2.o grau rebaixado e uma nota de tendencia forte que deve resolver descendentemente -- para a sensivel ao mover-se para V, ou diretamente para a tonica. Nunca o dupliques. O b6 (quinta do bII) tambem resolve descendentemente para o 5.o grau. O napolitano soa sombrio, majestoso e pesado, importando uma cor de modo frigio para a harmonia. E um som caracteristico de Beethoven, Schubert e de bandas sonoras modernas.',
          tryThisLabel: 'Ve Do menor -- o contexto natural do napolitano',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "Db major chord" para ouvires o acorde napolitano de Do menor. Repara como Reb-Fa-Lab soa sombrio e dramatico em comparacao com um acorde de Rem ou Fa neste contexto',
        },
        {
          instruction:
            'Escreve "Db/F" para ouvires o napolitano na primeira inversao. A nota do baixo Fa liga-se suavemente a Sol (dominante). Esta e a disposicao padrao bII6 usada na musica classica',
        },
        {
          instruction:
            'Pensa no napolitano noutras tonalidades menores: em La menor, bII e Sib maior. Em Mi menor, bII e Fa maior. Em Re menor, bII e Mib maior. Em cada caso, e uma triade maior meio-tom acima da tonica',
        },
      ],
    },

    // ── U18 M2: Italian and French Augmented Sixth Chords ─────────────────
    l6u18m2: {
      title: 'Sexta Italiana e Sexta Francesa',
      subtitle: 'O intervalo de sexta aumentada e as suas duas variedades nacionais mais simples',
      objectives: [
        'Compreender o intervalo de sexta aumentada (b6 a #4) e a sua resolucao divergente para uma oitava sobre o 5.o grau',
        'Construir a sexta italiana (It+6): b6, 1, #4 e resolve-la para V',
        'Construir a sexta francesa (Fr+6): b6, 1, 2, #4 e reconhecer a sua cor de tons inteiros',
      ],
      concepts: [
        {
          title: 'O Intervalo de Sexta Aumentada',
          explanation:
            'Todos os acordes de sexta aumentada contem um intervalo de sexta aumentada entre o 6.o grau rebaixado no baixo e o 4.o grau elevado numa voz superior. Em Do: Lab (b6) ate Fa# (#4). Este intervalo resolve divergentemente por movimento contrario -- Lab desce para Sol, Fa# sobe para Sol -- produzindo uma oitava sobre o 5.o grau, a fundamental da dominante. Esta resolucao divergente e o gesto definidor de toda a familia de sextas aumentadas.',
          tryThisLabel: 'Ve Do maior -- o contexto para sextas aumentadas',
        },
        {
          title: 'A Sexta Italiana (It+6)',
          explanation:
            'A sexta italiana tem tres notas: b6, 1, #4. Em Do: Lab-Do-Fa#. E o acorde de sexta aumentada mais simples -- apenas o intervalo de sexta aumentada mais o 1.o grau para preencher a sonoridade. Resolve diretamente para V com a fundamental duplicada. Por conter apenas tres notas, e o membro mais leve e transparente da familia.',
          tryThisLabel: 'Ouve Lab -- a nota do baixo das sextas aumentadas em Do',
        },
        {
          title: 'A Sexta Francesa (Fr+6)',
          explanation:
            'A sexta francesa tem quatro notas: b6, 1, 2, #4. Em Do: Lab-Do-Re-Fa#. Acrescenta o 2.o grau a sexta italiana. O resultado contem dois tritonos (Lab-Re e Do-Fa#), conferindo-lhe uma qualidade caracteristica de tons inteiros -- as quatro notas pertencem a mesma colecao de tons inteiros. Esta cor exotica e suspensa torna a sexta francesa favorita dos compositores que procuram a maxima tensao pre-dominante.',
          tryThisLabel: 'Ouve Sol maior -- o acorde V para o qual estas sextas resolvem em Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Cifra a sexta italiana em Do: Lab-Do-Fa#. Agora cifra-a em Sol: Mib-Sol-Do#. O padrao e sempre b6, 1, #4 da tonalidade-alvo. Pratica a construcao da It+6 em Re, La e Mib',
        },
        {
          instruction:
            'Cifra a sexta francesa em Do: Lab-Do-Re-Fa#. Repara nos dois tritonos: Lab ate Re e Do ate Fa#. As quatro notas pertencem a escala de tons inteiros sobre Do. Cifra a Fr+6 em Sol e em Re',
        },
        {
          instruction:
            'Escreve "Ab major chord" e escuta. Agora imagina acrescentar Fa# numa voz superior. O intervalo Lab ate Fa# e a sexta aumentada que define toda esta familia de acordes',
        },
      ],
    },

    // ── U18 M3: German Augmented Sixth and Its Dual Identity ──────────────
    l6u18m3: {
      title: 'Sexta Alema e a Sua Dupla Identidade',
      subtitle: 'O acorde Gr+6 e a sua equivalencia enarminica com o acorde de setima da dominante',
      objectives: [
        'Construir a sexta alema (Gr+6): b6, 1, b3, #4 e reconhecer a sua sonoridade rica e cheia',
        'Reconhecer que a Gr+6 e enarmonicamente identica a um acorde de setima da dominante',
        'Resolver a Gr+6 atraves de um 6/4 cadencial para evitar quintas paralelas',
      ],
      concepts: [
        {
          title: 'A Sexta Alema (Gr+6)',
          explanation:
            'A sexta alema tem quatro notas: b6, 1, b3, #4. Em Do: Lab-Do-Mib-Fa#. Acrescenta o 3.o grau rebaixado (do modo menor) a sexta italiana. Ao contrario da cor de tons inteiros da sexta francesa, a sexta alema soa rica e cheia -- e uma sonoridade completa de quatro notas com uma qualidade menor nas tres notas inferiores.',
          tryThisLabel: 'Ouve Lab7 -- o gemeo enarminico da Gr+6 em Do',
        },
        {
          title: 'Equivalencia Enarminica: Gr+6 = V7',
          explanation:
            'Reescreve a sexta alema em Do: Lab-Do-Mib-Fa# torna-se Lab-Do-Mib-Solb quando Fa# e reescrito como Solb. Lab-Do-Mib-Solb e Lab setima da dominante (Lab7). O mesmo som serve duas funcoes completamente diferentes -- Gr+6 resolvendo para V em Do, ou V7 resolvendo para I em Reb. Esta dupla identidade e o fundamento da modulacao enarminica entre tonalidades distantes.',
          tryThisLabel: 'Ouve Reb maior -- para onde Lab7 resolve como V7',
        },
        {
          title: 'O Problema das Quintas Paralelas',
          explanation:
            'Quando a Gr+6 resolve diretamente para V, o movimento das vozes b3 -> 2 (Mib -> Re em Do) e b6 -> 5 (Lab -> Sol) cria quintas paralelas -- proibidas na escrita rigorosa a partes. A solucao padrao e inserir um acorde de 6/4 cadencial: Gr+6 -> I6/4 -> V. O acorde 6/4 quebra o movimento paralelo. As sextas italiana e francesa nao tem este problema porque lhes falta o b3.',
          tryThisLabel: 'Ouve Do/Sol -- o 6/4 cadencial que quebra as paralelas',
        },
      ],
      tasks: [
        {
          instruction:
            'Cifra a sexta alema em Do: Lab-Do-Mib-Fa#. Agora reescreve Fa# como Solb: Lab-Do-Mib-Solb = Lab7. Mesmo som, funcao completamente diferente. Esta equivalencia enarminica e explorada na modulacao enarminica',
        },
        {
          instruction:
            'Cifra a sexta alema em Re: Sib-Re-Fa-Sol#. Reescreve Sol# como Lab: Sib-Re-Fa-Lab = Sib7 = V7 de Mib. Cifra a Gr+6 em La e encontra o seu gemeo de setima da dominante',
        },
        {
          instruction:
            'Escreve "Ab7" para ouvires o acorde. Este e simultaneamente V7 de Reb e Gr+6 em Do. A resolucao que escolhes determina a tonalidade que o ouvinte percebe',
        },
      ],
    },

    // ── U18 M4: Enharmonic Modulation: Gr+6 <-> V7 ───────────────────────
    l6u18m4: {
      title: 'Modulacao Enarminica: Gr+6 <-> V7',
      subtitle: 'Pivotar entre tonalidades distantes reinterpretando a sexta alema como uma setima da dominante',
      objectives: [
        'Modular entre tonalidades distantes usando a equivalencia enarminica Gr+6/V7',
        'Mapear as relacoes de tonalidades acessiveis atraves deste pivot (tonalidades a meio-tom de distancia)',
        'Aplicar a tecnica nas duas direcoes: Gr+6 -> V7 e V7 -> Gr+6',
      ],
      concepts: [
        {
          title: 'O Pivot Gr+6/V7 em Acao',
          explanation:
            'Para modular de Do para Reb usando esta tecnica: estabelece Do como tonalidade, aborda o acorde Lab-Do-Mib-Fa# como Gr+6 em Do, depois resolve-o como Lab7 (V7 de Reb) para Reb maior. O ouvido do ouvinte aceita ambas as interpretacoes porque o acorde e acusticamente identico. A resolucao determina a tonalidade percebida. Um unico acorde pivota entre tonalidades que distam meio-tom -- uma das relacoes mais distantes no circulo de quintas.',
          tryThisLabel: 'Ve como Do e Reb estao distantes no circulo',
        },
        {
          title: 'Funciona nas Duas Direcoes',
          explanation:
            'O pivot funciona ao contrario tambem. Para modular de Reb para Do: estabelece Reb, aborda Lab7 como V7 de Reb, depois resolve-o como Gr+6 em Do tratando-o como Lab-Do-Mib-Fa# resolvendo para Sol (V de Do). O mesmo acorde que te leva de Do a Reb pode tambem trazer-te de volta. Qualquer par de tonalidades a meio-tom de distancia e acessivel atraves desta tecnica.',
          tryThisLabel: 'Ouve Sol maior -- V de Do, a chegada apos a Gr+6 resolver',
        },
        {
          title: 'Mapear Todos os Pivots Gr+6/V7 Possiveis',
          explanation:
            'Uma vez que qualquer acorde de setima da dominante pode ser reinterpretado como sexta alema, cada tonalidade tem acesso a um alvo de modulacao meio-tom acima ou abaixo. De Do, a Gr+6 alcanca Reb. De Re, a Gr+6 alcanca Mib. De Fa#, a Gr+6 alcanca Sol. A tecnica abre caminhos modulatorios diretos entre tonalidades que de outra forma exigiriam muitos passos intermediarios pelo circulo de quintas.',
          tryThisLabel: 'Ouve Reb maior -- a tonalidade distante de chegada a partir de Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Cifra a sexta alema em Re: Sib-Re-Fa-Sol#. Reescreve Sol# como Lab: Sib-Re-Fa-Lab = Sib7 = V7 de Mib. Podes pivotar de Re maior para Mib maior atraves de um unico acorde',
        },
        {
          instruction:
            'Planeia uma modulacao de La maior para Sib maior usando Gr+6/V7. Primeiro: qual e a Gr+6 em La? (Fa-La-Do-Re#.) Reescreve Re# como Mib: Fa-La-Do-Mib = Fa7 = V7 de Sib. Resolve para Sib',
        },
        {
          instruction:
            'Escreve "Db major chord" e ouve a tonalidade de chegada. Uma unica reinterpretacao enarminica moveu-nos de Do para Reb -- seis posicoes ao redor do circulo de quintas num so passo',
        },
      ],
    },

    // ── U19 M1: Enharmonic Modulation: Diminished Seventh ─────────────────
    l6u19m1: {
      title: 'Modulacao Enarminica: Setima Diminuta',
      subtitle: 'A flexibilidade enarminica quadrupla do acorde de setima diminuta',
      objectives: [
        'Compreender que um acorde de setima diminuta divide a oitava em quatro tercas menores iguais',
        'Reinterpretar qualquer nota de um acorde dim7 como sensivel para resolver em quatro tonalidades diferentes',
        'Aplicar a modulacao enarminica por dim7 para alcancar tonalidades a uma terca menor, um tritono ou uma sexta maior de distancia',
      ],
      concepts: [
        {
          title: 'A Simetria da Setima Diminuta',
          explanation:
            'Um acorde de setima diminuta divide a oitava em quatro tercas menores iguais. Si-Re-Fa-Lab: cada par adjacente dista uma terca menor. Devido a esta simetria perfeita, o acorde soa igual independentemente de qual nota seja considerada a fundamental. Existem apenas tres acordes de setima diminuta distintos no sistema de doze notas -- cada acorde dim7 e uma reescrita enarminica de um destes tres.',
          tryThisLabel: 'Ouve Sidim7 -- quatro tercas menores iguais',
        },
        {
          title: 'Quatro Resolucoes Possiveis',
          explanation:
            'Como qualquer uma das quatro notas pode servir de sensivel, um unico acorde de setima diminuta pode funcionar como viio7 em quatro tonalidades diferentes. Si-Re-Fa-Lab resolve para Do menor (Si e sensivel). Reescrito como Re-Fa-Lab-Dob: resolve para Mib menor (Re e sensivel). Reescrito como Fa-Lab-Dob-Mibb: resolve para Solb menor. Reescrito como Sol#-Si-Re-Fa (Sol# como sensivel): resolve para La menor. As quatro tonalidades-alvo -- Do, Mib, Solb, La -- distam uma terca menor entre si.',
          tryThisLabel: 'Ve Do menor -- uma das quatro resolucoes possiveis',
        },
        {
          title: 'Aplicar a Modulacao Enarminica por Dim7',
          explanation:
            'Para modular de Do menor para La menor via dim7: usa viio7 de Do menor (Si-Re-Fa-Lab), depois reescreve Lab como Sol# para obter viio7 de La menor (Sol#-Si-Re-Fa), e resolve para La menor. O acorde nao muda sonoramente -- apenas a grafia e a resolucao mudam. Esta tecnica alcanca tonalidades a uma terca menor, um tritono ou uma sexta maior de distancia num unico passo, tornando-a o pivot enarminico mais versatil da musica tonal.',
          tryThisLabel: 'Ve La menor -- uma tonalidade-alvo distante a partir de Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "Bdim7" -- este acorde pode resolver para Do menor, Mib menor, Solb menor ou La menor. As quatro resolucoes sao igualmente validas. A grafia enarminica determina a tonalidade de destino',
        },
        {
          instruction:
            'Localiza as quatro resolucoes de Sidim7 no circulo de quintas: Do, Mib, Solb, La. Distam uma terca menor entre si -- dividindo a oitava em quatro partes iguais, tal como o proprio acorde',
        },
        {
          instruction:
            'Parte de Fa#dim7 (Fa#-La-Do-Mib). Encontra as quatro tonalidades-alvo: Sol menor (Fa# como sensivel), Sib menor (La como sensivel), Reb menor (Do como sensivel), Mi menor (Mib reescrito como Re# como sensivel)',
        },
      ],
    },

    // ── U19 M2: Common-Tone Diminished Seventh ────────────────────────────
    l6u19m2: {
      title: 'Setima Diminuta com Nota Comum',
      subtitle: 'O acorde CTo7 como embelezamento cromatico que partilha uma nota com o acorde-alvo',
      objectives: [
        'Construir um acorde CTo7 que partilha a fundamental do acorde-alvo',
        'Resolver o CTo7 corretamente mantendo a nota comum e movendo as outras tres vozes por meio-tom',
        'Distinguir o CTo7 de um viio7 funcional -- o CTo7 embeleza em vez de modular',
      ],
      concepts: [
        {
          title: 'O Que E o CTo7?',
          explanation:
            'Um acorde de setima diminuta com nota comum partilha uma nota (a nota comum) com o acorde que embeleza. A nota comum e geralmente a fundamental do acorde-alvo. As outras tres notas do acorde dim7 resolvem cada uma por meio-tom para as restantes notas do acorde. Ao contrario de um viio7 funcional, o CTo7 nao muda a tonalidade -- cria uma abordagem cromatica dramatica a um acorde que o ouvinte ja espera.',
          tryThisLabel: 'Ouve Do maior -- o acorde-alvo que um CTo7 embeleza',
        },
        {
          title: 'Construir o CTo7',
          explanation:
            'Para construir o CTo7 de Do maior: mantem Do como nota comum, depois preenche um acorde de setima diminuta que inclua Do. Uma opcao: Do-Re#-Fa#-La (= Do com Re#dim7 a rodea-lo). Re# resolve subindo para Mi, Fa# resolve subindo para Sol, La resolve descendo para Sol (ou sobe para a oitava). As tres vozes em movimento deslocam-se cada uma por meio-tom para dentro do acorde-alvo enquanto Do se mantem firme. O resultado e uma abordagem cromatica cintilante.',
          tryThisLabel: 'Toca Do maior -- ouve o alvo da resolucao',
        },
        {
          title: 'O CTo7 em Contexto Musical',
          explanation:
            'O CTo7 e comum na musica romantica e em bandas sonoras. Embeleza frequentemente a tonica (CTo7 -> I) ou a dominante (CTo7 -> V). Como nao muda a tonalidade, funciona mais como um acorde vizinho cromatico do que como uma verdadeira modulacao. A notacao CTo7 distingue-o de uma analise viio7, que implicaria uma tonicizacao. O CTo7 e pura cor e embelezamento.',
          tryThisLabel: 'Ouve Sol maior -- o CTo7 tambem pode embelezar V',
        },
      ],
      tasks: [
        {
          instruction:
            'Constroi o CTo7 de Do maior: mantem Do, acrescenta um acorde dim7 contendo Do. Um resultado: Do-Re#-Fa#-La. Verifica que Re#, Fa# e La resolvem cada um por meio-tom para notas do acorde de Do maior (Mi, Sol e Sol ou Do)',
        },
        {
          instruction:
            'Constroi o CTo7 de Sol maior: mantem Sol, acrescenta um acorde dim7 contendo Sol. Resultado: Sol-La#-Do#-Mi. La# resolve para Si, Do# resolve para Re, Mi mantem-se ou resolve para Re. O alvo e Sol-Si-Re',
        },
        {
          instruction:
            'Escreve "C major chord" e ouve o alvo da resolucao. Agora imagina o acorde CTo7 (Do-Re#-Fa#-La) a aproximar-se -- tres vozes deslocam-se por meio-tom enquanto Do se sustenta. Isto e puro embelezamento cromatico, nao modulacao',
        },
      ],
    },

    // ── U19 M3: Chromatic Mediants and Altered Dominants ──────────────────
    l6u19m3: {
      title: 'Mediantes Cromaticas e Dominantes Alteradas',
      subtitle: 'Acordes cromaticos por relacao de terca, dominantes alteradas e a progressao omnibus',
      objectives: [
        'Identificar relacoes de mediante cromatica (fundamentais a uma terca de distancia com pelo menos uma alteracao cromatica)',
        'Construir dominantes alteradas (V+, V7b5, V7#5) e compreender a sua resolucao intensificada para I',
        'Reconhecer a progressao omnibus como um padrao cromatico de troca de vozes atraves de sonoridades dominantes',
      ],
      concepts: [
        {
          title: 'Mediantes Cromaticas',
          explanation:
            'Uma mediante cromatica e um acorde cuja fundamental dista uma terca maior ou menor do acorde atual, com pelo menos uma alteracao cromatica entre eles. A partir de Do maior, Lab maior e Mi maior sao mediantes cromaticas -- cada uma partilha uma nota comum com Do, mas altera cromaticamente as restantes. Mediantes duplamente cromaticas nao partilham qualquer nota comum. Estas mudancas dramaticas sao uma marca das bandas sonoras e da musica tardo-romantica.',
          tryThisLabel: 'Ouve Lab maior -- mediante cromatica de Do',
        },
        {
          title: 'Dominantes Alteradas',
          explanation:
            'As dominantes alteradas acrescentam tensao cromatica ao acorde de dominante. V+ (dominante aumentada) eleva a quinta, que resolve ascendentemente para a 3.a de I. V7b5 rebaixa a quinta, comum no jazz. V7#5 combina a quinta aumentada com uma setima. Dominantes duplamente aplicadas (V/V/V) estendem a cadeia um nivel adiante: em Do, La7 -> Re7 -> Sol7 -> Do cria um impulso cascateante atraves de resolucoes dominantes sequenciais.',
          tryThisLabel: 'Ouve Mi maior -- outra mediante cromatica de Do',
        },
        {
          title: 'A Progressao Omnibus',
          explanation:
            'O omnibus e um padrao cromatico de troca de vozes onde uma voz sobe cromaticamente enquanto outra desce, com as restantes vozes a sustentar-se. Isto cria uma paisagem harmonica lentamente evolutiva, movendo-se atraves de sonoridades de setima da dominante e de sexta aumentada. Comum na musica do seculo XIX, produz uma sensacao de errancia harmonica sem direcao funcional clara.',
          tryThisLabel: 'Ouve Do7#5 -- uma sonoridade de dominante alterada',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "Ab major chord", depois "C major chord", depois "E major chord" -- ouve como cada mediante cromatica partilha uma nota com Do maior mas altera cromaticamente as outras duas. O efeito e vivido e dramatico',
        },
        {
          instruction:
            'Pensa na cadeia V/V/V em Do: La7 resolve para Re7, Re7 resolve para Sol7, Sol7 resolve para Do. Cada elo e uma resolucao dominante-tonica criando um impulso cascateante',
        },
        {
          instruction:
            'Escreve "C7#5" para ouvires uma dominante alterada. A quinta elevada cria tensao cromatica adicional que intensifica a resolucao para a tonica. Compara com um Do7 simples',
        },
      ],
    },

    // ── U19 M4: Late Romantic Harmonic Techniques ─────────────────────────
    l6u19m4: {
      title: 'Tecnicas Harmonicas Tardo-Romanticas',
      subtitle: 'Harmonia nao funcional, planing cromatico e a dissolucao da tonalidade',
      objectives: [
        'Reconhecer a divisao igual da oitava (padroes de tons inteiros, diminutos, aumentados) como fontes de ambiguidade tonal',
        'Identificar sucessoes de acordes nao funcionais e planing cromatico como alternativas a harmonia funcional',
        'Compreender a tonalidade alargada como o esticar e eventual dissolucao dos centros tonais',
      ],
      concepts: [
        {
          title: 'Divisao Igual da Oitava',
          explanation:
            'Padroes simetricos que dividem os 12 semitons igualmente criam ambiguidade tonal porque nenhuma nota se sente como "casa". A divisao por 2 produz a escala de tons inteiros (6 notas, apenas 2 transposicoes possiveis). A divisao por 3 produz o acorde de setima diminuta (4 notas). A divisao por 4 produz a triade aumentada (3 notas). Estas estruturas foram exploradas por Debussy, Ravel, Liszt e Wagner para esbater ou dissolver centros tonais.',
          tryThisLabel: 'Ouve a escala de tons inteiros -- divisao por 2',
        },
        {
          title: 'Sucessoes de Acordes Nao Funcionais',
          explanation:
            'Na musica tardo-romantica, as progressoes de acordes abandonam cada vez mais a logica funcional (T-PD-D-T). Em vez disso, os acordes ligam-se por proximidade de conducao de vozes (cada voz move-se minimamente), persistencia de nota comum (uma altura sustenta-se ao longo das mudancas de acorde) ou logica de pura sonoridade (acordes escolhidos pela cor, nao pela funcao). Isto marca o inicio da dissolucao da tonalidade e o caminho rumo a atonalidade.',
          tryThisLabel: 'Ouve a escala diminuta -- divisao simetrica por 3',
        },
        {
          title: 'Planing Cromatico e Tonalidade Alargada',
          explanation:
            'O planing move uma forma de acorde em movimento paralelo por tom ou meio-tom, ignorando as restricoes de tonalidade. O planing cromatico (tudo por meios-tons) produz um banho de pura cor sem direcao funcional. O planing diatonico ajusta a qualidade dos intervalos para permanecer na tonalidade. A tonalidade alargada estende os limites tonais: modulacoes remotas tornam-se frequentes, a saturacao cromatica torna a identificacao da tonalidade dificil e as cadencias tradicionais sao evitadas. Este e o crepusculo da tonalidade da pratica comum.',
          tryThisLabel: 'Explora o mundo dos tons inteiros -- a paleta de Debussy',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "whole tone scale" -- cada intervalo adjacente e um tom. Sem meios-tons, sem sensiveis, sem atracao dominante. Isto e pura ambiguidade tonal, o fundamento da linguagem harmonica de Debussy',
        },
        {
          instruction:
            'Escreve "C diminished scale" -- este padrao alternado tom-meio-tom cria uma escala simetrica de oito notas contendo quatro tritonos e quatro tercas menores, dividindo a oitava em partes iguais',
        },
        {
          instruction:
            'Imagina mover uma triade de Do maior subindo por meio-tom repetidamente: Do-Reb-Re-Mib... Cada acorde e uma transposicao paralela. Nenhuma voz conduz funcionalmente -- cada nota desloca-se na mesma quantidade. Isto e planing cromatico na sua forma mais pura',
        },
      ],
    },

    // ── U20 M1: Species Counterpoint: First through Third Species ─────────
    l6u20m1: {
      title: 'Contraponto de Especies: Primeira a Terceira Especie',
      subtitle: 'Cantus firmus, nota contra nota, 2:1 e 4:1',
      objectives: [
        'Escrever um cantus firmus seguindo regras estabelecidas (8-12 notas, maioritariamente por grau conjunto, um unico climax)',
        'Dominar a primeira especie (1:1) com consonancias e a segunda especie (2:1) com tratamento de dissonancia em tempo fraco',
        'Dominar a terceira especie (4:1) com notas de passagem, bordaduras, cambiata e bordaduras duplas',
      ],
      concepts: [
        {
          title: 'Cantus Firmus e Primeira Especie (1:1)',
          explanation:
            'O cantus firmus (CF) e uma melodia simples de 8 a 12 semibreves, comecando e terminando na tonica, maioritariamente por grau conjunto com um ponto culminante. A primeira especie coloca uma nota contra cada nota do CF usando apenas consonancias -- comeca com P1, P5 ou P8, termina com P1 ou P8 abordada por grau conjunto, favorece consonancias imperfeitas (tercas e sextas) e proibe intervalos perfeitos paralelos. Sem cruzamento de vozes, sem mais de tres tercas ou sextas consecutivas.',
          tryThisLabel: 'Ve as notas disponiveis para um CF em Do maior',
        },
        {
          title: 'Segunda Especie (2:1)',
          explanation:
            'Duas notas contra cada nota do CF. Os tempos fortes devem ser consonantes com o CF. Os tempos fracos podem ser dissonantes se abordados e deixados por grau conjunto (nota de passagem) ou se se afastam e regressam por grau conjunto (bordadura). Sem unissonos em tempos fortes, exceto no inicio e no fim. A segunda especie introduz o principio fundamental do tratamento da dissonancia: a dissonancia e permitida apenas quando controlada por movimento por grau conjunto.',
          tryThisLabel: 'Ve Sol maior -- outra tonalidade comum para CF',
        },
        {
          title: 'Terceira Especie (4:1)',
          explanation:
            'Quatro notas contra cada nota do CF. A primeira nota de cada grupo deve ser consonante; as restantes tres podem ser dissonantes como notas de passagem, bordaduras ou a figura de cambiata (grau conjunto para dissonancia, salto de terca, grau conjunto de volta). Bordaduras duplas (bordadura superior e inferior em sequencia) tambem sao permitidas. A terceira especie produz o contraponto mais melodicamente ativo e ornamentado antes da sincopa entrar na quarta especie.',
          tryThisLabel: 'Ve Re maior -- experimenta tracar um cantus firmus',
        },
      ],
      tasks: [
        {
          instruction:
            'Regras para um cantus firmus: comeca e termina na tonica, maioritariamente por grau conjunto, um climax abordado e deixado por grau conjunto, sem notas repetidas, ambito dentro de uma oitava. Tenta compor mentalmente um em Do maior usando apenas Do-Re-Mi-Fa-Sol-La-Si-Do',
        },
        {
          instruction:
            'Na primeira especie, comeca com um unissono perfeito, quinta ou oitava. Usa sobretudo consonancias imperfeitas (tercas e sextas). Proibe quintas e oitavas perfeitas paralelas. Termina com um unissono ou oitava abordada por grau conjunto',
        },
        {
          instruction:
            'Na terceira especie, a cambiata e uma figura ornamental especifica: consonancia, grau conjunto para dissonancia, salto de terca na mesma direcao, depois grau conjunto de volta. Permite que uma nota dissonante seja deixada por salto -- a unica excecao a regra de que a dissonancia deve resolver por grau conjunto',
        },
      ],
    },

    // ── U20 M2: Species Counterpoint: Fourth and Fifth Species ────────────
    l6u20m2: {
      title: 'Contraponto de Especies: Quarta e Quinta Especie',
      subtitle: 'Contraponto sincopado, suspensoes e contraponto florido',
      objectives: [
        'Dominar a quarta especie (sincopada): notas ligadas criando suspensoes que resolvem descendentemente por grau conjunto',
        'Identificar suspensoes dissonantes padrao (7-6, 4-3, 9-8, 2-3) e encadea-las em sequencias',
        'Dominar a quinta especie (florida): combinando todas as especies anteriores livremente numa unica linha',
      ],
      concepts: [
        {
          title: 'Quarta Especie: Sincopa e Suspensoes',
          explanation:
            'A quarta especie introduz a sincopa -- notas ligadas de um tempo fraco atraves da barra de compasso para o tempo forte seguinte. Quando a nota ligada e dissonante contra o CF no tempo forte, cria uma suspensao. A suspensao tem tres fases: preparacao (consonancia no tempo fraco), dissonancia (a nota ligada no tempo forte) e resolucao (grau conjunto descendente para consonancia). Suspensoes dissonantes padrao sao 7-6, 4-3 e 9-8 acima do CF, e 2-3 quando o contraponto esta abaixo.',
          tryThisLabel: 'Ve Do maior -- traca padroes de suspensao',
        },
        {
          title: 'Cadeias de Suspensoes',
          explanation:
            'As suspensoes podem ser encadeadas: cada resolucao torna-se a preparacao da suspensao seguinte. Uma cadeia de suspensoes 7-6 ou 4-3 cria uma linha descendente por grau conjunto de dissonancias ligadas, produzindo uma das texturas mais expressivas da musica tonal. As cadeias de suspensoes sao uma marca da musica barroca e renascentista e permanecem fundamentais em toda a escrita a partes.',
          tryThisLabel: 'Ve Sol maior -- imagina uma cadeia de suspensoes 7-6',
        },
        {
          title: 'Quinta Especie: Contraponto Florido',
          explanation:
            'A quinta especie combina livremente todas as especies anteriores: semibreves, minimas, seminimas e sincopa coexistem numa unica linha. Todas as regras das especies anteriores aplicam-se aos respetivos valores de notas. O contraponto florido e o mais proximo que os exercicios de especies chegam da composicao musical real, demonstrando como regras estritas produzem resultados genuinamente musicais e formando a ponte do contraponto academico para a composicao livre.',
          tryThisLabel: 'Ve Re maior -- a tela para contraponto florido',
        },
      ],
      tasks: [
        {
          instruction:
            'Suspensoes da quarta especie: 7-6 e 4-3 sao as suspensoes dissonantes padrao. A dissonancia ocorre no tempo forte (a nota ligada) e resolve por grau conjunto descendente no tempo fraco. Este padrao e a origem de todo o uso de suspensoes na musica tonal',
        },
        {
          instruction:
            'Uma cadeia de suspensoes 7-6: o 6 (resolucao consonante) e imediatamente ligado para se tornar o 7 (suspensao dissonante) contra a nota seguinte do CF. Cada resolucao alimenta a suspensao seguinte, criando tensao melodica e harmonica continua',
        },
        {
          instruction:
            'A quinta especie combina tudo: um compasso pode comecar com uma suspensao ligada (4.a especie), resolver em seminimas (3.a especie) e assentar numa minima (2.a especie). A arte esta em equilibrar variedade com uma forma melodica coerente',
        },
      ],
    },

    // ── U20 M3: Three-Part Counterpoint and Invertible Counterpoint ───────
    l6u20m3: {
      title: 'Contraponto a Tres Partes e Contraponto Invertivel',
      subtitle: 'Contraponto multivozes e tecnicas invertiveis a oitava, decima e duodecima',
      objectives: [
        'Estender o contraponto de especies para tres e quatro vozes com intervalos validos contra todas as partes existentes',
        'Compreender o contraponto invertivel a oitava, decima e duodecima e as restricoes de intervalos que cada um impoe',
        'Aplicar tecnicas de contraponto triplo onde tres melodias funcionam em qualquer das seis disposicoes verticais',
      ],
      concepts: [
        {
          title: 'Adicionar Vozes: Escrita a Tres e Quatro Partes',
          explanation:
            'Quando uma terceira voz entra, deve formar intervalos validos com ambas as vozes existentes simultaneamente, multiplicando as restricoes. A escrita a tres partes produz triades completas, acrescentando riqueza harmonica. A escrita a quatro partes restringe ainda mais o movimento mas abre a textura completa SATB. Cada voz adicional aumenta exponencialmente o numero de pares de intervalos que devem ser verificados quanto a quintas e oitavas paralelas.',
          tryThisLabel: 'Ouve uma triade de tres notas -- a sonoridade a 3 vozes mais simples',
        },
        {
          title: 'Contraponto Invertivel a Oitava',
          explanation:
            'Contraponto invertivel a oitava significa que duas melodias funcionam corretamente com qualquer uma das vozes por cima. Quando invertidas, as tercas tornam-se sextas (aceitavel), mas as quintas tornam-se quartas (dissonantes acima do baixo no estilo da pratica comum). Portanto, o contraponto invertivel a oitava evita quintas. A inversao a decima transforma tercas em oitavas e sextas em quintas. A inversao a duodecima transforma quintas em oitavas -- J.S. Bach usou-a extensamente nas suas fugas.',
          tryThisLabel: 'Ouve Do/Mi -- inverter o baixo muda a textura',
        },
        {
          title: 'Contraponto Triplo',
          explanation:
            'O contraponto triplo exige tres melodias que funcionem em todas as seis permutacoes verticais (ABC, ACB, BAC, BCA, CAB, CBA) -- extraordinariamente exigente de escrever. Todas as seis disposicoes devem produzir contraponto valido com tratamento correto de consonancias. Este e o ponto culminante da arte contrapontistica, demonstrado mais completamente nas fugas de Bach e na Arte da Fuga.',
          tryThisLabel: 'Ouve Sol maior -- outra sonoridade a tres vozes para inverter',
        },
      ],
      tasks: [
        {
          instruction:
            'Na escrita a tres partes, verifica cada par de vozes quanto a quintas e oitavas paralelas. Com as vozes A, B e C, deves verificar A-B, A-C e B-C -- tres pares em vez de um',
        },
        {
          instruction:
            'Para contraponto invertivel a oitava: os intervalos transformam-se da seguinte forma -- unissono torna-se oitava, segunda torna-se setima, terca torna-se sexta, quarta torna-se quinta, quinta torna-se quarta. Como as quartas sao dissonantes acima do baixo, as quintas devem ser evitadas no original',
        },
        {
          instruction:
            'O contraponto triplo tem seis permutacoes. Se a melodia A esta acima de B e B acima de C no original, todas as outras cinco ordenacoes devem tambem produzir contraponto valido. Bach conseguia isto rotineiramente nas suas fugas',
        },
      ],
    },

    // ── U20 M4: Advanced Part Writing and Score Reading ───────────────────
    l6u20m4: {
      title: 'Escrita a Partes Avancada e Leitura de Partitura',
      subtitle: 'Harmonizacao SATB, realizacao de baixo cifrado e leitura de partitura orquestral',
      objectives: [
        'Harmonizar melodias de soprano e baixo em textura a quatro partes SATB seguindo regras de conducao de vozes',
        'Realizar baixo cifrado preenchendo as vozes superiores a partir das cifras e acidentes do baixo',
        'Ler partituras orquestrais completas transpondo instrumentos para altura de concerto e reduzindo ao conteudo harmonico',
      ],
      concepts: [
        {
          title: 'Harmonizacao de Soprano',
          explanation:
            'Dada uma melodia de soprano, a tarefa e escolher acordes e preencher contralto, tenor e baixo. O processo: determinar a tonalidade e localizar pontos de cadencia, escolher uma linha de baixo e progressao de acordes que suporte funcionalmente a melodia, preencher as vozes interiores seguindo regras de conducao de vozes, depois verificar erros (quintas/oitavas paralelas, violacoes de espacamento, erros de duplicacao, cruzamento de vozes).',
          tryThisLabel: 'Ve os acordes diatonicos de Do maior -- a paleta de harmonizacao',
        },
        {
          title: 'Realizacao de Baixo Cifrado',
          explanation:
            'A notacao de baixo cifrado fornece uma linha de baixo com numeros indicando os intervalos acima de cada nota. Sem cifras significa posicao fundamental (5/3), 6 significa primeira inversao, 6/4 significa segunda inversao, 7 significa acorde de setima em posicao fundamental. Acidentes modificam intervalos especificos. Realizar baixo cifrado -- preencher as tres vozes superiores em tempo real -- era a competencia quotidiana de todo o tecladista barroco.',
          tryThisLabel: 'Ve Sol maior -- pratica mentalmente o baixo cifrado',
        },
        {
          title: 'Leitura de Partitura Orquestral',
          explanation:
            'Uma partitura orquestral completa organiza os instrumentos de cima para baixo: madeiras, metais, percussao, cordas. Os instrumentos transpositores (clarinete em Sib, trompa em Fa) sao escritos a uma altura diferente da que soam. Ler uma partitura exige transpor mentalmente estas partes para a altura de concerto, ler claves de Do (clave de contralto para a viola, clave de tenor para o violoncelo) e reduzir multiplas vozes ao seu conteudo harmonico essencial.',
          tryThisLabel: 'Ve Sib maior -- a tonalidade em que um clarinete em Sib le',
        },
      ],
      tasks: [
        {
          instruction:
            'Para harmonizar uma melodia de soprano: primeiro identifica pontos de cadencia (determinam os objetivos harmonicos), depois trabalha para tras a partir de cada cadencia para preencher a progressao de acordes. As vozes interiores seguem o caminho mais curto entre notas do acorde',
        },
        {
          instruction:
            'Abreviaturas de baixo cifrado: sem cifras = posicao fundamental (5/3), 6 = primeira inversao, 6/4 = segunda inversao, 7 = setima em posicao fundamental, 6/5 = setima na primeira inversao, 4/3 = setima na segunda inversao, 4/2 = setima na terceira inversao',
        },
        {
          instruction:
            'Instrumentos transpositores: um clarinete em Sib soa um tom abaixo do que esta escrito (le Do, o publico ouve Sib). Uma trompa em Fa soa uma quinta perfeita abaixo do que esta escrito. Os leitores de partitura devem transpor mentalmente para ouvir as alturas reais',
        },
      ],
    },
  },
};

export default curriculumL6;
