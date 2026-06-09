import type { CurriculumLevelOverlay } from '../types';

const curriculumL8: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    u25: {
      title: 'Fuga e Formas Imitativas',
      description:
        'Analise de fugas, tipos de canone e tecnicas de composicao imitativa',
    },
    u26: {
      title: 'Grande Forma e Orquestracao',
      description:
        'Analise formal avancada, familias orquestrais e instrumentacao',
    },
    u27: {
      title: 'Pos-Tonal e Contemporaneo',
      description:
        'Teoria dos conjuntos, tecnica dos doze sons e metodos composicionais do seculo XX',
    },
  },

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: {
    // ── U25 M1: Fugue Exposition ──────────────────────────────────────────────
    l8u25m1: {
      title: 'Fuga: Exposicao e Sujeito/Resposta',
      subtitle:
        'Estrutura da exposicao da fuga, sujeito vs. resposta e o contra-sujeito',
      objectives: [
        'Analisar a exposicao da fuga: entradas das vozes, sujeito, resposta, contra-sujeito',
        'Distinguir resposta real de resposta tonal',
        'Identificar o contra-sujeito e o seu papel no contraponto invertivel',
        'Compreender a fuga dupla e a fuga tripla ao nivel da consciencia',
      ],
      concepts: [
        {
          title: 'Exposicao da Fuga: Entrada Voz a Voz',
          explanation:
            'Uma fuga e uma composicao contrapontistica construida a partir de uma unica ideia melodica (o sujeito). A exposicao introduz cada voz por sua vez: a primeira voz apresenta o sujeito sozinha na tonica, a segunda voz entra com a resposta na dominante enquanto a primeira continua com um contra-sujeito, e as vozes seguintes seguem o mesmo padrao alternado — sujeito na tonica, resposta na dominante. A exposicao esta completa quando todas as vozes entraram. O numero de vozes (tipicamente 2 a 5) define a densidade textural da fuga e determina quantas entradas a exposicao contem.',
          tryThisLabel: 'Ve a tonalidade da tonica que um sujeito de fuga habitaria',
        },
        {
          title: 'Sujeito, Resposta e Contra-Sujeito',
          explanation:
            'O sujeito e o tema principal da fuga, apresentado primeiro na tonica. Uma resposta real transpoe o sujeito exatamente para a dominante. Uma resposta tonal modifica o intervalo inicial para preservar a coerencia tonal — tipicamente convertendo um salto inicial de tonica para dominante numa resposta de dominante para tonica (uma 5.a torna-se uma 4.a). As respostas tonais sao usadas quando o sujeito apresenta de forma proeminente os graus 1 e 5. O contra-sujeito e uma linha melodica secundaria escrita em contraponto invertivel, de modo a funcionar corretamente quer seja colocada acima quer abaixo do sujeito. Um contra-sujeito bem elaborado complementa o sujeito em ritmo, contorno e conteudo intervalico.',
          tryThisLabel: 'Ve a tonalidade da dominante onde a resposta entra',
        },
        {
          title: 'Fuga Dupla e Fuga Tripla',
          explanation:
            'Uma fuga dupla combina dois sujeitos, quer apresentando-os juntos desde o inicio, quer introduzindo cada um na sua propria exposicao antes de os combinar numa seccao culminante. Uma fuga tripla usa tres sujeitos — A Arte da Fuga de Bach e a sua fuga final inacabada sao os exemplos supremos. No tipo de apresentacao combinada, ambos os sujeitos aparecem simultaneamente na exposicao inicial; no tipo de exposicoes separadas, o segundo sujeito recebe a sua propria exposicao completa antes de os dois serem entrecruzados contrapontisticamente. O desafio aumenta exponencialmente com cada sujeito adicional.',
          tryThisLabel: 'Ve Do maior — a tonalidade da primeira fuga do CBT de Bach',
        },
      ],
      tasks: [
        {
          instruction:
            'Ouve uma fuga de Bach (p. ex., CBT Livro I, Do menor). Mapeia a exposicao: identifica a entrada de cada voz e se a resposta e real ou tonal. Quantas vozes tem a fuga?',
        },
        {
          instruction:
            'Na mesma fuga, identifica o contra-sujeito. Aparece consistentemente em cada entrada do sujeito? E ritmicamente complementar ao sujeito (preenchendo onde o sujeito tem notas longas)?',
        },
        {
          instruction:
            'Compara o sujeito e a resposta nota a nota. Onde diferem? Se a resposta e tonal, identifica o intervalo especifico que foi ajustado e explica porquê (o inicio do sujeito enfatizava os graus 1 e 5).',
        },
      ],
    },

    // ── U25 M2: Fugue Episodes and Stretto ────────────────────────────────────
    l8u25m2: {
      title: 'Fuga: Episodios, Stretto e Procedimentos',
      subtitle:
        'Episodios de transicao, tecnica de stretto e transformacoes do sujeito',
      objectives: [
        'Identificar episodios e o seu material motivico (fragmentos do sujeito, sequencias)',
        'Reconhecer passagens de stretto e avaliar a proximidade das entradas sobrepostas',
        'Compreender aumentacao, diminuicao, inversao e retrogradacao do sujeito',
        'Tracar a jornada tonal das entradas intermedias por tonalidades vizinhas',
      ],
      concepts: [
        {
          title: 'Episodios e Entradas Intermedias',
          explanation:
            'Apos a exposicao, os episodios — passagens de transicao construidas a partir de fragmentos motivicos do sujeito ou do contra-sujeito, frequentemente dispostos em sequencia — modulam para novas tonalidades para as entradas intermedias. Cada episodio tipicamente toma um motivo curto (algumas notas da cabeca ou da cauda do sujeito) e sequencia-o atraves de uma cadeia de tonalidades, criando impulso para a frente. As entradas intermedias reapresentam o sujeito em tonalidades vizinhas: o relativo maior ou menor, a subdominante, ou areas tonais mais remotas. A alternancia de episodios e entradas confere a fuga a sua sensacao caracteristica de partida e regresso.',
          tryThisLabel: 'Ve La menor — uma tonalidade comum para entradas intermedias a partir de Do maior',
        },
        {
          title: 'Stretto: Entradas Sobrepostas do Sujeito',
          explanation:
            'O stretto ocorre quando uma nova entrada do sujeito comeca antes de a anterior ter terminado, criando apresentacoes sobrepostas que geram densidade contrapontistica e intensidade climatica. Quanto mais apertado o intervalo de stretto (mais curto o espaco entre entradas), mais tecnicamente impressionante e dramaticamente poderosa e a passagem. O stretto e frequentemente reservado para a seccao final da fuga, intensificando o regresso a tonica. Nem todos os sujeitos de fuga se prestam ao stretto — a possibilidade de sobreposicao depende das propriedades intervalicas e ritmicas do sujeito.',
          tryThisLabel: 'Ouve o acorde diminuto — a tensao para que as fugas constroem',
        },
        {
          title: 'Procedimentos Composicionais: Aumentacao, Diminuicao, Inversao, Retrogradacao',
          explanation:
            'A aumentacao apresenta o sujeito em valores de nota mais longos, efetivamente reduzindo o tempo do tema a metade e conferindo-lhe gravidade e peso. A diminuicao usa valores mais curtos, duplicando a velocidade e criando urgencia. A inversao melodica inverte todos os intervalos — o movimento ascendente torna-se descendente — transformando o contorno do sujeito mas preservando o seu perfil ritmico. A retrogradacao apresenta o sujeito de tras para a frente, embora isto seja raro em fugas (mais comum na musica serial). Estes procedimentos podem combinar-se: aumentacao invertida, diminuicao retrograda. A Arte da Fuga de Bach demonstra virtualmente todas as combinacoes.',
          tryThisLabel: 'Toca a escala ascendente — depois imagina-a invertida, descendente',
        },
      ],
      tasks: [
        {
          instruction:
            'Numa fuga de Bach que tenhas estudado, localiza o primeiro episodio apos a exposicao. Que material motivico utiliza — fragmentos do sujeito, do contra-sujeito, ou ambos? Modula? Se sim, para que tonalidade?',
        },
        {
          instruction:
            'Encontra passagens de stretto perto do final da fuga. Com que proximidade se sobrepõem as entradas (quantos tempos de diferenca)? O sujeito sobrepõe-se a si mesmo, a resposta, ou ambos?',
        },
        {
          instruction:
            'A fuga utiliza aumentacao, diminuicao ou inversao do sujeito? Se sim, identifica a passagem especifica. Se nao, escreve as primeiras 4-5 notas do sujeito em inversao — inverte a direcao de cada intervalo.',
        },
      ],
    },

    // ── U25 M3: Canon ─────────────────────────────────────────────────────────
    l8u25m3: {
      title: 'Canone e Outras Formas Imitativas',
      subtitle: 'Canones a varios intervalos e tipos especiais',
      objectives: [
        'Compreender o canone a varios intervalos (unissono, oitava, 5.a, 4.a, etc.)',
        'Reconhecer tipos especiais de canone (inversao, retrogradacao, aumentacao/diminuicao)',
        'Distinguir entre canone estrito e imitacao livre',
      ],
      concepts: [
        {
          title: 'Canone Estrito e Intervalos Canonicos',
          explanation:
            'Num canone estrito, uma voz lider (dux) apresenta uma melodia e uma voz seguidora (comes) replica-a exatamente apos um atraso temporal fixo, transposta por algum intervalo. O canone ao unissono repete na mesma altura; o canone a oitava desloca uma oitava; o canone a quinta transpoe uma quinta perfeita acima. O desafio composicional e profundo: o lider deve gerar uma melodia que produza contraponto valido contra uma copia de si mesma com atraso temporal. Quanto mais distante o intervalo canonico do unissono, mais restritas se tornam as possibilidades melodicas.',
          tryThisLabel: 'Ve a escala — a materia-prima melodica de um canone',
        },
        {
          title: 'Tipos Especiais de Canone e a Ronda',
          explanation:
            'O canone espelhado (canone por inversao) inverte todos os intervalos no seguidor — o movimento ascendente no dux torna-se descendente no comes. O canone de caranguejo (retrogrado) toca a melodia do seguidor de tras para a frente. O canone por aumentacao duplica os valores das notas no seguidor; o canone por diminuicao reduz-los a metade. Estes podem combinar-se — retrogradacao invertida, por exemplo. A ronda e o canone mais simples: um canone perpetuo ao unissono onde as vozes entram a intervalos regulares e a melodia repete-se indefinidamente. O ricercar, predecessor da fuga, utiliza contraponto imitativo de forma mais livre, sem a estrutura formal de exposicao-episodio da fuga.',
          tryThisLabel: 'Ve Do maior — a tonalidade mais simples para escrita canonica',
        },
        {
          title: 'Imitacao Livre vs. Canone Estrito',
          explanation:
            'O canone estrito mantem replicacao intervalica exata ao longo de toda a peca; a imitacao livre utiliza o sujeito como ponto de partida mas permite desvios quando a imitacao estrita produziria contraponto deficiente ou dissonancia. A maioria da polifonia renascentista e barroca utiliza imitacao livre — as passagens comecam com entradas canonicas (chamadas "pontos de imitacao") mas rapidamente divergem para contraponto independente. Compreender o espectro do canone estrito a imitacao livre ilumina virtualmente toda a musica polifonica de Josquin a Bach.',
          tryThisLabel: 'Ouve o menor — comum na escrita imitativa renascentista',
        },
      ],
      tasks: [
        {
          instruction:
            'Pega numa melodia simples de 4 compassos que conhecas. Canta-a ou toca-a, depois imagina-a a entrar de novo um compasso depois na mesma altura. Onde ocorreriam dissonancias? Isto revela por que a escrita canonica e tao restritiva.',
        },
        {
          instruction:
            'Ouve o canone das Variacoes Goldberg de Bach (uma em cada tres variacoes e um canone). Compara o Canone ao Unissono (Var. 3), o Canone a 2.a (Var. 6) e o Canone a 3.a (Var. 9). Como e que o intervalo canonico afeta o caracter?',
        },
        {
          instruction:
            'Escreve as primeiras 4 notas de uma melodia, depois escreve-as em retrogradacao (de tras para a frente) e em inversao (inverte a direcao de cada intervalo). Alguma delas poderia servir de canone contra a original?',
        },
      ],
    },

    // ── U26 M1: Sonata Form ───────────────────────────────────────────────────
    l8u26m1: {
      title: 'A Forma-Sonata em Detalhe',
      subtitle:
        'Exposicao, desenvolvimento e reexposicao em detalhe seccional completo',
      objectives: [
        'Analisar a exposicao em forma-sonata: GTP, TR, cesura medial, GTS, CT',
        'Identificar tecnicas de desenvolvimento: fragmentacao, sequencia, falsa reexposicao, retransicao',
        'Compreender a resolucao tonal da reexposicao e a coda expandida de Beethoven',
        'Reconhecer a forma de concerto como uma adaptacao da forma-sonata com dupla exposicao',
      ],
      concepts: [
        {
          title: 'Forma-Sonata: A Exposicao',
          explanation:
            'A exposicao contem um grupo tematico principal (GTP) na tonica que estabelece caracter e tonalidade, uma transicao modulante (TR) que acumula energia e desloca o centro tonal, uma cesura medial (CM) — a pausa dramatica que marca a chegada a nova tonalidade —, um grupo tematico secundario (GTS) na tonalidade secundaria (tipicamente V em maior, III em menor) com caracter contrastante, e material de encerramento (CT) que reafirma a nova tonalidade com potencialmente varias ideias conclusivas. O sinal de repeticao no final da exposicao e estruturalmente significativo: assegura que o ouvinte interioriza a polaridade tonal entre tonica e dominante antes de o desenvolvimento a desmantelar.',
          tryThisLabel: 'Ve a tonalidade da tonica — a base da forma-sonata',
        },
        {
          title: 'Desenvolvimento e Reexposicao',
          explanation:
            'O desenvolvimento fragmenta os temas em motivos, dispoe-nos em sequencias por tonalidades remotas, pode encenar uma falsa reexposicao (um regresso enganador do GTP na tonalidade errada) e constroi uma retransicao sobre a dominante para preparar o regresso. A reexposicao reapresenta todo o material na tonica — crucialmente, o GTS aparece agora na tonica, resolvendo a tensao tonal da exposicao. A TR e modificada para evitar modular. As codas de Beethoven funcionam frequentemente como segundos desenvolvimentos, estendendo substancialmente a forma com novo trabalho tematico e climaxes dramaticos.',
          tryThisLabel: 'Ouve o acorde de setima da dominante — o acorde que impulsiona a reexposicao',
        },
        {
          title: 'Forma de Concerto: Dupla Exposicao',
          explanation:
            'A forma de concerto adapta os principios da sonata com uma dupla exposicao: a exposicao orquestral apresenta ambos os temas na tonica, depois a exposicao do solista reapresenta o primeiro tema na tonica e o segundo na dominante, seguindo a logica tonal padrao da sonata. O desenvolvimento apresenta dialogo solista-orquestra. A reexposicao resolve ambos os temas na tonica. A cadencia — a passagem virtuosistica nao acompanhada do solista — precede tipicamente a coda final, originalmente improvisada mas cada vez mais escrita a partir de Beethoven.',
          tryThisLabel: 'Ve as relacoes de tonalidade que as formas-sonata percorrem',
        },
      ],
      tasks: [
        {
          instruction:
            'Escolhe um andamento de sonata do periodo classico (p. ex., Mozart K.545, primeiro andamento). Cria uma linha temporal formal: identifica o GTP, TR, cesura medial, GTS, CT, desenvolvimento e reexposicao. Em que compasso aparece o GTS na tonica durante a reexposicao?',
        },
        {
          instruction:
            'Na seccao de desenvolvimento, identifica pelo menos duas tecnicas de desenvolvimento: fragmentacao, sequencia, pedal ou falsa reexposicao. Por que tonalidades passa o desenvolvimento antes da retransicao?',
        },
        {
          instruction:
            'Compara a transicao (TR) na exposicao com a da reexposicao. Como e que a TR da reexposicao e modificada para manter o GTS na tonica? O compositor simplesmente corta a modulacao ou recompoe a passagem?',
        },
      ],
    },

    // ── U26 M2: Variation, Rondo, and Ritornello ──────────────────────────────
    l8u26m2: {
      title: 'Variacoes, Rondo e Ritornello',
      subtitle:
        'Tema e variacoes, chacona, passacaglia, rondo e ritornello',
      objectives: [
        'Distinguir tema e variacoes seccionais de formas de variacao continua',
        'Analisar a chacona (padrao harmonico repetido) e a passacaglia (baixo ostinato)',
        'Identificar formas de rondo (5 partes, 7 partes) e hibridos sonata-rondo',
        'Compreender a forma de ritornello barroca e a sua relacao com o rondo',
      ],
      concepts: [
        {
          title: 'Tema e Variacoes, Chacona e Passacaglia',
          explanation:
            'As formas de variacao incluem o tema e variacoes seccional (cada variacao e autonoma, separada por cadencias claras), a chacona (variacoes continuas sobre um padrao harmonico repetido, tipicamente de 4 ou 8 compassos) e a passacaglia (variacoes continuas sobre uma linha de baixo repetida — o baixo ostinato). A distincao entre chacona e passacaglia e historicamente ambigua, mas o baixo ostinato e a caracteristica definidora da passacaglia. Em todas as formas de variacao, a arte composicional reside em transformar melodia, ritmo, textura e registo mantendo uma ligacao audivel ao tema ou padrao.',
          tryThisLabel: 'Ouve La menor — tonalidade comum para chaconas e passacaglias',
        },
        {
          title: 'Formas de Rondo: Cinco Partes, Sete Partes e Sonata-Rondo',
          explanation:
            'A forma de rondo apresenta um estribilho recorrente (A) alternando com episodios contrastantes: rondo de cinco partes (A-B-A-C-A), de sete partes (A-B-A-C-A-B-A ou A-B-A-C-A-D-A). O estribilho regressa tipicamente na tonica de cada vez, proporcionando estabilidade estrutural. O sonata-rondo hibrida as duas formas — A-B-A-desenvolvimento-A-B-A — combinando a clareza estrutural do rondo com a ambicao desenvolvimental da sonata. A seccao B regressa na tonica durante a segunda metade, espelhando a resolucao tonal da forma-sonata. Este hibrido domina os finais do periodo classico.',
          tryThisLabel: 'Ve Do maior — a tonica que cada estribilho de rondo reafirma',
        },
        {
          title: 'Forma de Ritornello',
          explanation:
            'A forma de ritornello barroca alterna uma passagem orquestral recorrente (o ritornello) com episodios solistas. O ritornello completo aparece na tonica no inicio e no fim; fragmentos dele regressam em tonalidades diferentes entre os episodios solistas, criando uma jornada tonal. Conceptualmente semelhante ao rondo mas mais fluida — o ritornello raramente e reapresentado completo no meio, e os episodios solistas sao mais improvisatorios. Os concertos de Vivaldi epitomizam a forma: ritornello de abertura energico, passagens solistas virtuosisticas, fragmentos do ritornello em tonalidades vizinhas, regresso completo do ritornello no final.',
          tryThisLabel: 'Ve as relacoes de tonalidade que o ritornello percorre',
        },
      ],
      tasks: [
        {
          instruction:
            'Compara uma chacona (p. ex., Chacona em Re menor de Bach para violino solo) com um tema e variacoes (p. ex., Variacoes "Diabelli" de Beethoven). Como e que a estrutura continua vs. seccional muda a experiencia de audicao?',
        },
        {
          instruction:
            'Ouve um finale em sonata-rondo (p. ex., Sonata "Patetica" de Beethoven, terceiro andamento). Identifica cada regresso do estribilho (A) e etiqueta os episodios. Onde ocorre a seccao de "desenvolvimento" dentro da estrutura do rondo?',
        },
        {
          instruction:
            'Ouve um primeiro andamento de concerto de Vivaldi (p. ex., "Primavera" das Quatro Estacoes). Mapeia os regressos do ritornello: em que tonalidade esta cada fragmento? Quanto do ritornello original e reapresentado de cada vez?',
        },
      ],
    },

    // ── U26 M3: Orchestration ─────────────────────────────────────────────────
    l8u26m3: {
      title: 'Orquestracao e Consciencia de Instrumentacao',
      subtitle:
        'Familias orquestrais, extensoes, timbres e transposicao',
      objectives: [
        'Conhecer as quatro familias orquestrais e as suas caracteristicas',
        'Identificar extensoes e timbres dos instrumentos',
        'Compreender os instrumentos transpositores em contexto orquestral',
      ],
      concepts: [
        {
          title: 'As Quatro Familias Orquestrais',
          explanation:
            'As cordas (violino, viola, violoncelo, contrabaixo) formam a espinha dorsal da orquestra — sustentam, articulam e abrangem a gama dinamica mais ampla atraves de tecnicas como pizzicato, tremolo, harmonicos e col legno. As madeiras (flauta, oboe, clarinete, fagote e os seus auxiliares) contribuem com cores timbricas distintas e destacam-se na escrita melodica. Os metais (trompa, trompete, trombone, tuba) conferem potencia e brilho, dominando os climaxes. A percussao divide-se em afinada (timpanos, xilofone, glockenspiel, vibrafone, marimba, celesta) e nao afinada (caixa, bombo, pratos, triangulo), proporcionando definicao ritmica, cor e pontuacao estrutural.',
          tryThisLabel: 'Ve a extensao — as cordas abrangem quase todo este teclado',
        },
        {
          title: 'Instrumentos Transpositores e Leitura de Partitura',
          explanation:
            'Um instrumento transpositor soa uma altura diferente do Do escrito. O clarinete em Sib soa uma segunda maior abaixo do escrito; a trompa em Fa soa uma quinta perfeita abaixo; o trompete em Sib soa uma segunda maior abaixo. Para ler uma partitura transpositora a altura real (de concerto), inverte a transposicao: para um clarinete em Sib, transpoe a parte escrita uma segunda maior abaixo (ou le uma segunda abaixo). Ordem padrao da partitura orquestral de cima para baixo: flautas, oboes, clarinetes, fagotes, trompas, trompetes, trombones, tuba, timpanos, percussao, harpa, violinos I e II, violas, violoncelos, contrabaixos.',
          tryThisLabel: 'Ve Sib — a altura de concerto quando um clarinete em Sib le Do',
        },
        {
          title: 'Textura Orquestral e Dobragens',
          explanation:
            'A orquestracao e a arte de distribuir ideias musicais pelo conjunto para maximo efeito. A dobragem a oitava (p. ex., flauta e violino a uma oitava de distancia) espessa uma melodia sem alterar o seu caracter. A dobragem ao unissono (p. ex., oboe e violino na mesma altura) funde timbres para criar uma cor composta indisponivel em qualquer instrumento isoladamente. A escrita por coros atribui um acorde completo a uma familia (um coral de metais ou um coro de madeiras). A escolha de qual instrumento conduz a melodia, qual fornece preenchimento harmonico e qual fornece energia ritmica define o caracter de cada passagem orquestral.',
          tryThisLabel: 'Ve Fa maior — a tonalidade de concerto de uma trompa a ler em Do',
        },
      ],
      tasks: [
        {
          instruction:
            'Examina uma pagina de partitura orquestral (p. ex., Sinfonia n.o 5 de Beethoven, primeira pagina). Identifica a ordem da partitura — que instrumentos estao no topo, quais na base? Quais sao transpositores?',
        },
        {
          instruction:
            'Um clarinete em Sib toca um Re escrito. Que altura soa a altura de concerto? (Resposta: Do — uma 2.a maior abaixo.) Agora: uma trompa em Fa toca um Sol escrito. Que altura de concerto soa? (Resposta: Do — uma 5.a perfeita abaixo.)',
        },
        {
          instruction:
            'Ouve o inicio do "Bolero" de Ravel. Cada repeticao do tema usa um instrumento ou combinacao diferente. Lista as mudancas timbricas ao longo das primeiras cinco apresentacoes. Como e que Ravel usa as dobragens para construir intensidade?',
        },
      ],
    },

    // ── U27 M1: Pitch-Class Sets ──────────────────────────────────────────────
    l8u27m1: {
      title: 'Conjuntos de Classes de Altura e Teoria dos Conjuntos',
      subtitle:
        'Classe de altura, classe de intervalo, forma normal, forma primaria, VIC e numeros de Forte',
      objectives: [
        'Compreender a classe de altura e o sistema de notacao por inteiros (0-11)',
        'Calcular a classe de intervalo (CI) e o vetor intervalar (VIC)',
        'Encontrar a forma normal e a forma primaria de conjuntos de classes de altura',
        'Identificar conjuntos pelos numeros do catalogo de Forte',
      ],
      concepts: [
        {
          title: 'Classe de Altura, Notacao por Inteiros e Classe de Intervalo',
          explanation:
            'A teoria pos-tonal colapsa todas as alturas equivalentes por oitava em 12 classes de altura numeradas de 0 a 11 (C=0, C#/Db=1, D=2, ... B=11). As grafias enarmonicas tornam-se irrelevantes — F# e Gb sao ambos a classe de altura 6. A classe de intervalo (CI) mede a menor distancia entre duas classes de altura no relogio mod-12: o intervalo entre CA 0 e CA 4 e CI 4 (nao 8, porque tomamos o complemento menor). Os valores de CI vao de 1 a 6, ja que qualquer intervalo maior que 6 semitons tem um complemento menor. Esta eliminacao de oitava, grafia e distincoes direcionais revela o esqueleto intervalico abstrato de qualquer sonoridade.',
          tryThisLabel: 'Ve todas as 12 classes de altura dispostas cromaticamente',
        },
        {
          title: 'Conjuntos de Classes de Altura: Forma Normal e Forma Primaria',
          explanation:
            'Um conjunto de classes de altura e uma colecao nao ordenada de classes de altura distintas — o equivalente pos-tonal de um acorde. A forma normal e o arranjo ascendente mais compacto: roda-se o conjunto ate que a extensao do primeiro ao ultimo elemento seja a menor (usando compactacao a esquerda para desempatar). A forma primaria transpoe a forma normal para comecar em 0, depois compara com a inversao para selecionar a que estiver mais compactada a esquerda. A forma primaria e a etiqueta canonica: {C, E, G} e {D, F, A} ambos se reduzem a forma primaria [0, 3, 7]. O catalogo de Allen Forte atribui a cada forma primaria um numero — 3-11 para [0, 3, 7] — criando um sistema universal de classificacao para sonoridades pos-tonais. Existem duas convencoes de compactacao — a de Forte, "compactado a esquerda" (usada aqui), e a de Rahn, "compactado a partir da direita" — e discordam num punhado de classes de conjuntos (nenhuma usada neste nivel).',
          tryThisLabel: 'Ve Do menor — conjunto de Forte 3-11, forma primaria [0,3,7]',
        },
        {
          title: 'Vetor Intervalar e Relacoes-Z',
          explanation:
            'O vetor intervalar (VIC) e uma impressao digital de seis digitos que conta cada CI presente num conjunto. Para [0, 4, 7] (triade maior), o VIC e <0,0,1,1,1,0>: um CI3, um CI4, um CI5. Dois conjuntos com VIC identicos mas formas primarias diferentes sao Z-relacionados — estruturalmente distintos, mas partilhando exatamente o mesmo conteudo intervalar. Pares Z-relacionados sao relativamente raros no catalogo e constituem uma curiosidade central da teoria dos conjuntos. O VIC proporciona uma forma eficiente de comparar o caracter sonoro dos conjuntos: conjuntos com VIC semelhantes partilham "cor" harmonica mesmo que o seu conteudo de classes de altura difira inteiramente.',
          tryThisLabel: 'Ve a triade maior — VIC <0,0,1,1,1,0>',
        },
      ],
      tasks: [
        {
          instruction:
            'Converte as seguintes notas em inteiros de classe de altura: E, Bb, F#, C. (Respostas: 4, 10, 6, 0.) Agora encontra a classe de intervalo entre cada par adjacente. Qual e a CI entre 4 e 10? (Resposta: 6 — o tritono.)',
        },
        {
          instruction:
            'Toma o conjunto {C, Db, E} = {0, 1, 4}. Encontra a forma normal experimentando todas as rotacoes: [0,1,4] (extensao 4), [1,4,0]=[1,4,12] (extensao 11), [4,0,1]=[4,12,13] (extensao 9). A forma normal e [0,1,4]. Esta e tambem a forma primaria? Compara com a inversao: [0,11,8] normalizado para [0,3,4] — qual esta mais compactado a esquerda?',
        },
        {
          instruction:
            'Calcula o vetor intervalar para o conjunto [0, 1, 4]: pares (0,1)=CI1, (0,4)=CI4, (1,4)=CI3. VIC = <1,0,1,1,0,0>. Agora faz o mesmo para [0, 3, 4] e verifica que obtens o VIC identico. Isto e esperado — [0,3,4] e a inversao de [0,1,4], por isso pertencem a mesma classe de conjuntos (3-3). A relacao-Z ocorre quando dois conjuntos partilham um vetor intervalar sem estarem relacionados por transposicao ou inversao; o menor par Z verdadeiro e 4-Z15 [0,1,4,6] e 4-Z29 [0,1,3,7].',
        },
      ],
    },

    // ── U27 M2: Twelve-Tone Technique ─────────────────────────────────────────
    l8u27m2: {
      title: 'Tecnica dos Doze Sons',
      subtitle:
        'Series, formas P/R/I/RI, a matriz dos doze sons e combinatorialidade',
      objectives: [
        'Construir uma serie dodecafonica usando todas as 12 classes de altura exatamente uma vez',
        'Derivar as quatro formas da serie: Original (P), Retrograda (R), Inversao (I), Retrograda-Inversao (RI)',
        'Construir e ler uma matriz 12x12 dos doze sons',
        'Compreender a combinatorialidade e a complementacao hexacordal do agregado',
      ],
      concepts: [
        {
          title: 'A Serie e as Suas Quatro Formas',
          explanation:
            'Na composicao dodecafonica (serial), as 12 classes de altura sao ordenadas numa sequencia especifica — a serie. Esta serie e a materia-prima de toda a composicao: melodia, harmonia e contraponto derivam dela. A serie e manipulada atraves de quatro transformacoes: Original (P) — a serie original; Retrograda (R) — a serie tocada de tras para a frente; Inversao (I) — cada intervalo invertido, o ascendente torna-se descendente; Retrograda-Inversao (RI) — a inversao tocada de tras para a frente. Estas quatro operacoes preservam o ADN intervalico da serie enquanto geram formas melodicas maximamente diversas.',
          tryThisLabel: 'Ve todas as 12 classes de altura — a materia-prima de uma serie',
        },
        {
          title: 'A Matriz dos Doze Sons',
          explanation:
            'Cada uma das quatro formas da serie pode ser transposta para comecar em qualquer uma das 12 classes de altura, produzindo 48 formas no total (P0-P11, R0-R11, I0-I11, RI0-RI11). Estas sao organizadas numa matriz 12x12: as formas P leem-se da esquerda para a direita, as formas R da direita para a esquerda, as formas I de cima para baixo e as formas RI de baixo para cima. A matriz e o conjunto de ferramentas completo do compositor — cada derivacao serial possivel da serie esta visivel num relance. Webern favorecia series com alta simetria interna, onde algumas formas sao identicas a outras, reduzindo efetivamente as 48 a menos series distintas.',
          tryThisLabel: 'Ve 7 das 12 classes de altura — uma serie usa todas as 12',
        },
        {
          title: 'Combinatorialidade e Complementacao Hexacordal',
          explanation:
            'A combinatorialidade e uma propriedade da serie em que o primeiro hexacorde (primeiras 6 notas) de uma forma e o primeiro hexacorde de outra forma especifica juntos produzem as 12 classes de altura — um agregado. Isto assegura completude harmonica quando duas formas soam simultaneamente, evitando duplicacao de classes de altura. Series totalmente combinatoriais (como as de Babbitt) alcancam complementacao de agregado sob relacoes P, I, R e RI. As obras tardias de Schoenberg exploram a combinatorialidade para controlar a dimensao vertical (harmonica) da musica serial, nao apenas a horizontal (melodica).',
          tryThisLabel: 'Ouve um acorde simetrico — as series privilegiam a simetria',
        },
      ],
      tasks: [
        {
          instruction:
            'Cria a tua propria serie dodecafonica ordenando todos os inteiros de 0 a 11 sem repeticao. Escreve o teu P0. Agora deriva R0 (inverte a ordem), I0 (subtrai cada elemento a 12, mod 12) e RI0 (inverte a inversao).',
        },
        {
          instruction:
            'Usando o teu P0, constroi as duas primeiras linhas de uma matriz dos doze sons. A linha 1 e o proprio P0. A linha 2 comeca na segunda classe de altura de I0: transpoe P para comecar nessa classe de altura (soma uma constante mod 12 a cada elemento de P0). Verifica que a coluna 1 le a forma I0 de cima para baixo.',
        },
        {
          instruction:
            'Verifica se a tua serie tem combinatorialidade: lista as primeiras 6 classes de altura de P0. Agora lista as primeiras 6 classes de altura de I5 (ou outra inversao). Os dois hexacordes juntos contem as 12 classes de altura sem duplicacoes? Se nao, experimenta uma transposicao diferente de I.',
        },
      ],
    },

    // ── U27 M3: 20th-Century Techniques ───────────────────────────────────────
    l8u27m3: {
      title: 'Tecnicas do Seculo XX: Planing, Politonalidade, Pandiatonicismo',
      subtitle:
        'Harmonia quartal, movimento paralelo, bitonalidade e diatonicismo livre',
      objectives: [
        'Identificar a harmonia quartal/quintal como uma linguagem harmonica completa',
        'Distinguir planing cromatico de planing diatonico',
        'Reconhecer politonalidade, polimodalidade e pandiatonicismo em contexto',
      ],
      concepts: [
        {
          title: 'Harmonia Quartal/Quintal e Planing',
          explanation:
            'A harmonia quartal constroi acordes a partir de quartas perfeitas empilhadas em vez de tercas, produzindo sonoridades que nao sao maiores nem menores — abertas, ambiguas e caracteristicas de Hindemith, Bartok e Copland. A harmonia quintal usa quintas empilhadas (inversamente equivalentes a quartas). O planing move uma estrutura de acorde inteira em paralelo: o planing cromatico transpoe cada nota pelo mesmo numero de semitons (preservando a qualidade exata do acorde), enquanto o planing diatonico move dentro de uma escala (alterando a qualidade para se ajustar a tonalidade). Os acordes de nona paralelos de Debussy e as triades paralelas de Ravel exemplificam o planing como tecnica harmonica estrutural, nao meramente um recurso coloristico.',
          tryThisLabel: 'Ouve a escala de tons inteiros — territorio simetrico puro para planing',
        },
        {
          title: 'Politonalidade, Polimodalidade e Pandiatonicismo',
          explanation:
            'A politonalidade sobrepoe duas ou mais tonalidades simultaneamente — a bitonalidade de Milhaud pode colocar Do maior na mao direita contra Fa# maior na esquerda, criando uma sonoridade densa e cintilante que nao e tonal nem atonal. A polimodalidade sobrepoe modos diferentes sobre a mesma tonica: Do Lidio na melodia com Do Mixolidio no acompanhamento produz as sete alturas diatonicas mas com inflexoes modais conflituantes entre as vozes. O pandiatonicismo usa todas as notas de uma escala diatonica livremente, descartando regras de harmonia funcional — qualquer combinacao e valida, produzindo musica que soa tonal mas resiste a resolucao. As obras neoclassicas de Stravinsky epitomizam esta tecnica.',
          tryThisLabel: 'Ouve Do aumentado — a triade de tons inteiros, sem centro tonal',
        },
        {
          title: 'Microtonalidade e Consciencia Espectral',
          explanation:
            'A microtonalidade estende o continuo de alturas para alem das 12 divisoes iguais: quartos de tom dividem cada semitom ao meio (24 notas por oitava), a afinacao justa afina os intervalos segundo razoes de frequencia puras, e a afinacao espectral deriva intervalos da serie de harmonicos. Temperamentos iguais alternativos — 19-TET, 31-TET, 53-TET — oferecem diferentes compromissos entre consonancia e flexibilidade. Embora o motor desta aplicacao opere em 12-TET padrao, a consciencia dos sistemas microtonais revela que a escala cromatica de 12 notas e uma convencao historica, nao uma inevitabilidade acustica.',
          tryThisLabel: 'Ouve a escala cromatica 12-TET — uma de muitas divisoes possiveis',
        },
      ],
      tasks: [
        {
          instruction:
            'Constroi um acorde quartal sobre C: empilha quartas (C-F-Bb-Eb). Compara o seu som com uma triade de C maior. O acorde quartal nao tem qualidade maior nem menor clara — descreve o seu caracter por palavras tuas.',
        },
        {
          instruction:
            'Toca uma escala de tons inteiros de C, depois uma escala diminuta (octatonica) de C. Ambas sao simetricas — a escala de tons inteiros divide a oitava em 6 passos iguais, a octatonica alterna tons e meios-tons. Nenhuma tem dominante nem sensivel. Como e que isto afeta a sensacao de gravidade tonal?',
        },
        {
          instruction:
            'Imagina tocar uma triade de C maior na mao direita e uma triade de F# maior na esquerda simultaneamente. Lista as seis classes de altura que soariam. Ha alguma sobreposicao? Qual e o numero total de classes de altura distintas? (Este e o famoso acorde bitonal de Petruchka.)',
        },
      ],
    },

    // ── U27 M4: Minimalism and Aleatory ───────────────────────────────────────
    l8u27m4: {
      title: 'Minimalismo, Aleatoriedade e Tecnicas Expandidas',
      subtitle:
        'Desfasamento, processo aditivo, musica aleatoria e novos recursos sonoros',
      objectives: [
        'Compreender processos composicionais minimalistas: desfasamento, processo aditivo, evolucao baseada em pulsacao',
        'Distinguir as operacoes aleatorias de Cage da aleatoriedade controlada de Lutoslawski',
        'Reconhecer tecnicas expandidas: piano preparado, multifonicos, sprechstimme',
        'Ter consciencia de forma movel e notacao indeterminada',
      ],
      concepts: [
        {
          title: 'Minimalismo: Desfasamento e Processo Aditivo',
          explanation:
            'O minimalismo emprega estruturas repetitivas que evoluem gradualmente. O desfasamento (phase shifting) de Steve Reich comeca dois padroes identicos em sincronia perfeita, depois empurra um ligeiramente a frente — os padroes de interferencia resultantes criam relacoes ritmicas e melodicas em constante mudanca ate as duas partes eventualmente se realinharem. O processo aditivo de Philip Glass expande padroes adicionando notas incrementalmente: uma celula de 4 notas torna-se 5, depois 6, depois 8, construindo complexidade a partir do material inicial mais simples possivel. O minimalismo baseado em pulsacao (La Monte Young, Terry Riley) sustenta uma pulsacao ritmica constante enquanto a harmonia evolui lentamente ao longo de grandes periodos de tempo, transformando a percepcao do tempo pelo ouvinte.',
          tryThisLabel: 'Toca um padrao repetitivo com estas notas — a materia-prima do minimalismo',
        },
        {
          title: 'Aleatoriedade e Musica de Acaso',
          explanation:
            'A aleatoriedade (musica de acaso) introduz indeterminacao na composicao ou na interpretacao. John Cage usou operacoes do I Ching, lancamentos de moedas e mapas estelares para determinar alturas, duracoes e dinamicas — removendo inteiramente as escolhas subjetivas do compositor. Witold Lutoslawski desenvolveu a aleatoriedade controlada: os interpretes escolhem livremente dentro de limites definidos (conteudo de alturas fixo, ritmo livre), criando passagens de caos controlado. A forma movel (Klavierstuck XI de Stockhausen, Terceira Sonata para Piano de Boulez) permite aos interpretes tocar seccoes em qualquer ordem, de modo que cada interpretacao cria uma trajetoria formal unica. Estas abordagens questionaram a propria definicao de "obra" musical.',
          tryThisLabel: 'Ve todas as 12 classes de altura — a aleatoriedade recorre ao espectro completo',
        },
        {
          title: 'Tecnicas Expandidas',
          explanation:
            'As tecnicas expandidas transformam os instrumentos para alem da sua paleta sonora convencional. O piano preparado (John Cage) coloca parafusos, porcas, borracha e feltro entre as cordas, convertendo o piano num conjunto de percussao para um so interprete com timbres imprevisiveis. Os multifonicos extraem varias alturas simultaneas de um unico instrumento de sopro atraves de dedilhacoes e embocaduras especializadas. O sul ponticello (arco perto do cavalete) e o col legno (golpear com a madeira do arco) alteram radicalmente o timbre das cordas. O sprechstimme (emissao vocal meio cantada, meio falada, desenvolvida por Schoenberg) habita o territorio entre a fala e o canto. Estas tecnicas redefiniram o que constitui material musical em si.',
          tryThisLabel: 'Ouve a escala octatonica — recurso de Bartok e Stravinsky',
        },
      ],
      tasks: [
        {
          instruction:
            'Bate palmas num padrao ritmico simples de 4 notas em ciclo continuo. Agora imagina uma segunda pessoa a bater palmas no mesmo padrao, mas acelerando gradualmente uma quantidade infima. O que acontece ao ritmo composto ao longo de 30 segundos? Isto e o desfasamento.',
        },
        {
          instruction:
            'Concebe uma celula melodica de 3 notas (p. ex., C-E-G). Agora aplica o processo aditivo: toca C-E (2 notas), depois C-E-G (3 notas), depois C-E-G-E (4 notas), depois C-E-G-E-C (5 notas). Como muda o caracter do padrao a medida que cresce?',
        },
        {
          instruction:
            'Escreve 4 fragmentos musicais curtos (2-4 notas cada) em cartoes separados. Baralha os cartoes e toca-os na ordem em que aparecerem. Repete com outra baralhadela. Como muda a forma? Esta e uma forma movel simplificada.',
        },
      ],
    },

    // ── U27 M5: Advanced Rhythm ───────────────────────────────────────────────
    l8u27m5: {
      title: 'Ritmo Avancado: Polirritmia, Hemiola, Modulacao Metrica',
      subtitle:
        'Quialteras complexas, ritmos cruzados, polirritmia e modulacao metrica',
      objectives: [
        'Executar e ouvir quialteras complexas e ritmos cruzados',
        'Compreender polirritmia vs. polimetria',
        'Reconhecer hemiola e modulacao metrica',
      ],
      concepts: [
        {
          title: 'Quialteras Complexas e Ritmos Cruzados',
          explanation:
            'Para alem das tercinas simples, as quialteras complexas subdividem os tempos em quintinas (5 no espaco de 4), septinas (7:4 ou 7:6) e quialteras aninhadas (tercinas dentro de tercinas, produzindo 9 subdivisoes). Os ritmos cruzados sobrepõem agrupamentos diferentes simultaneamente: 3 contra 2 (tres notas iguais numa voz contra duas noutra), 4 contra 3, ou 5 contra 4. A percepcao-chave e que os ritmos cruzados criam dissonancia ritmica analoga a dissonancia harmonica — os pulsos conflituantes geram tensao que se resolve quando se realinham num tempo forte partilhado. Este principio esta na base de grande parte do rubato de Chopin, da complexidade ritmica de Brahms e de virtualmente toda a percussao da Africa subsariana.',
          tryThisLabel: 'Toca a escala — experimenta agrupar as notas em 3 e depois em 2',
        },
        {
          title: 'Polirritmia vs. Polimetria e Hemiola',
          explanation:
            'Polirritmia e polimetria sao frequentemente confundidas mas estruturalmente distintas. A polirritmia sobrepoe diferentes agrupamentos ritmicos dentro de um metro partilhado — os tempos fortes continuam a alinhar-se (3 contra 2 dentro de um compasso de 6/8). A polimetria sobrepoe metros diferentes simultaneamente — uma voz em 3/4 contra outra em 4/4 — de modo que os tempos fortes divergem e so se realinham no minimo multiplo comum (a cada 12 tempos). A hemiola e um ritmo cruzado especifico e historicamente ubiquo: dois compassos de metro ternario (3+3) reinterpretados como tres grupos binarios (2+2+2), ou vice-versa em tempo composto. A hemiola permeia Handel, Brahms e a musica latino-americana, criando uma ambiguidade metrica momentanea que energiza passagens cadenciais e de transicao.',
          tryThisLabel: 'Toca em grupos de 2, depois de 3 — sente o ritmo cruzado',
        },
        {
          title: 'Modulacao Metrica e Ritmo Aditivo',
          explanation:
            'A modulacao metrica (tecnica assinatura de Elliott Carter) usa um valor ritmico partilhado como pivot entre tempos com precisao matematica. Se as colcheias em tercina no tempo antigo se tornam colcheias regulares no novo tempo, o novo tempo e exatamente 3/2 do antigo. Modulacoes baseadas em quintinas produzem razoes 5:4; a tecnica encadeia-se para percorrer multiplos tempos. Os ritmos aditivos constroem padroes a partir de agrupamentos desiguais — 2+2+3, 3+2+2+3 — produzindo metros assimetricos centrais na musica balcanica (aksak), em Bartok, Stravinsky e rock progressivo. As formulas de compasso irracionais (p. ex., 4/3, 5/6) estendem esta logica ainda mais, especificando relacoes de tempo em vez de divisoes tradicionais de pulso.',
          tryThisLabel: 'Toca o modo Dorico — experimenta acentuar cada 5.a nota',
        },
      ],
      tasks: [
        {
          instruction:
            'Bate palmas numa pulsacao constante de 4 tempos. Agora tenta encaixar 3 palmas uniformemente espacadas no mesmo intervalo com a outra mao. Onde coincidem as maos? (Apenas no tempo 1.) Este e o ritmo cruzado fundamental de 3 contra 2 — a base de toda a complexidade polirritmica.',
        },
        {
          instruction:
            'Pega numa passagem em compasso 3/4 e conta 6 tempos ao longo de dois compassos (1-2-3-1-2-3). Agora reagrupa esses mesmos 6 tempos como 2+2+2. A melodia que estava em metro ternario e agora percebida em binario — criaste uma hemiola. Onde aparece isto na musica que conheces?',
        },
        {
          instruction:
            'Calcula uma modulacao metrica: se o tempo atual e seminima = 120 BPM e as colcheias em tercina se tornam a nova colcheia, qual e o novo tempo? (A colcheia em tercina = 1/3 de uma seminima = 360 por minuto. Como nova colcheia, duas delas = uma nova seminima, portanto a nova seminima = 180 BPM. Razao: 3:2.)',
        },
      ],
    },
  },
};

export default curriculumL8;
