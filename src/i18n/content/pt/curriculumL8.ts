import type { CurriculumLevelOverlay } from '../types';

const curriculumL8: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    u25: {
      title: 'Fuga e Formas Imitativas',
      description:
        'Análise de fugas, tipos de cânone e técnicas de composição imitativa',
    },
    u26: {
      title: 'Grande Forma e Orquestração',
      description:
        'Análise formal avançada, famílias orquestrais e instrumentação',
    },
    u27: {
      title: 'Pós-Tonal e Contemporâneo',
      description:
        'Teoria dos conjuntos, técnica dos doze sons e métodos composicionais do século XX',
    },
  },

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: {
    // ── U25 M1: Fugue Exposition ──────────────────────────────────────────────
    l8u25m1: {
      title: 'Fuga: Exposição e Sujeito/Resposta',
      subtitle:
        'Estrutura da exposição da fuga, sujeito vs. resposta e o contra-sujeito',
      objectives: [
        'Analisar a exposição da fuga: entradas das vozes, sujeito, resposta, contra-sujeito',
        'Distinguir resposta real de resposta tonal',
        'Identificar o contra-sujeito e o seu papel no contraponto invertível',
        'Compreender a fuga dupla e a fuga tripla ao nível da consciência',
      ],
      concepts: [
        {
          title: 'Exposição da Fuga: Entrada Voz a Voz',
          explanation:
            'Uma fuga é uma composição contrapontística construída a partir de uma única ideia melódica (o sujeito). A exposição introduz cada voz por sua vez: a primeira voz apresenta o sujeito sozinha na tónica, a segunda voz entra com a resposta na dominante enquanto a primeira continua com um contra-sujeito, e as vozes seguintes seguem o mesmo padrão alternado — sujeito na tónica, resposta na dominante. A exposição está completa quando todas as vozes entraram. O número de vozes (tipicamente 2 a 5) define a densidade textural da fuga e determina quantas entradas a exposição contém.',
          tryThisLabel: 'Vê a tonalidade da tónica que um sujeito de fuga habitaria',
        },
        {
          title: 'Sujeito, Resposta e Contra-Sujeito',
          explanation:
            'O sujeito é o tema principal da fuga, apresentado primeiro na tónica. Uma resposta real transpõe o sujeito exatamente para a dominante. Uma resposta tonal modifica o intervalo inicial para preservar a coerência tonal — tipicamente convertendo um salto inicial de tónica para dominante numa resposta de dominante para tónica (uma 5.a torna-se uma 4.a). As respostas tonais são usadas quando o sujeito apresenta de forma proeminente os graus 1 e 5. O contra-sujeito é uma linha melódica secundária escrita em contraponto invertível, de modo a funcionar corretamente quer seja colocada acima quer abaixo do sujeito. Um contra-sujeito bem elaborado complementa o sujeito em ritmo, contorno e conteúdo interválico.',
          tryThisLabel: 'Vê a tonalidade da dominante onde a resposta entra',
        },
        {
          title: 'Fuga Dupla e Fuga Tripla',
          explanation:
            'Uma fuga dupla combina dois sujeitos, quer apresentando-os juntos desde o início, quer introduzindo cada um na sua própria exposição antes de os combinar numa secção culminante. Uma fuga tripla usa três sujeitos — A Arte da Fuga de Bach e a sua fuga final inacabada são os exemplos supremos. No tipo de apresentação combinada, ambos os sujeitos aparecem simultaneamente na exposição inicial; no tipo de exposições separadas, o segundo sujeito recebe a sua própria exposição completa antes de os dois serem entrecruzados contrapontisticamente. O desafio aumenta exponencialmente com cada sujeito adicional.',
          tryThisLabel: 'Vê Dó maior — a tonalidade da primeira fuga do CBT de Bach',
        },
      ],
      tasks: [
        {
          instruction:
            'Ouve uma fuga de Bach (p. ex., CBT Livro I, Dó menor). Mapeia a exposição: identifica a entrada de cada voz e se a resposta é real ou tonal. Quantas vozes tem a fuga?',
        },
        {
          instruction:
            'Na mesma fuga, identifica o contra-sujeito. Aparece consistentemente em cada entrada do sujeito? É ritmicamente complementar ao sujeito (preenchendo onde o sujeito tem notas longas)?',
        },
        {
          instruction:
            'Compara o sujeito e a resposta nota a nota. Onde diferem? Se a resposta é tonal, identifica o intervalo específico que foi ajustado e explica porquê (o início do sujeito enfatizava os graus 1 e 5).',
        },
      ],
    },

    // ── U25 M2: Fugue Episodes and Stretto ────────────────────────────────────
    l8u25m2: {
      title: 'Fuga: Episódios, Stretto e Procedimentos',
      subtitle:
        'Episódios de transição, técnica de stretto e transformações do sujeito',
      objectives: [
        'Identificar episódios e o seu material motívico (fragmentos do sujeito, sequências)',
        'Reconhecer passagens de stretto e avaliar a proximidade das entradas sobrepostas',
        'Compreender aumentação, diminuição, inversão e retrogradação do sujeito',
        'Traçar a jornada tonal das entradas intermédias por tonalidades vizinhas',
      ],
      concepts: [
        {
          title: 'Episódios e Entradas Intermédias',
          explanation:
            'Após a exposição, os episódios — passagens de transição construídas a partir de fragmentos motívicos do sujeito ou do contra-sujeito, frequentemente dispostos em sequência — modulam para novas tonalidades para as entradas intermédias. Cada episódio tipicamente toma um motivo curto (algumas notas da cabeça ou da cauda do sujeito) e sequencia-o através de uma cadeia de tonalidades, criando impulso para a frente. As entradas intermédias reapresentam o sujeito em tonalidades vizinhas: o relativo maior ou menor, a subdominante, ou áreas tonais mais remotas. A alternância de episódios e entradas confere à fuga a sua sensação característica de partida e regresso.',
          tryThisLabel: 'Vê Lá menor — uma tonalidade comum para entradas intermédias a partir de Dó maior',
        },
        {
          title: 'Stretto: Entradas Sobrepostas do Sujeito',
          explanation:
            'O stretto ocorre quando uma nova entrada do sujeito começa antes de a anterior ter terminado, criando apresentações sobrepostas que geram densidade contrapontística e intensidade climática. Quanto mais apertado o intervalo de stretto (mais curto o espaço entre entradas), mais tecnicamente impressionante e dramaticamente poderosa é a passagem. O stretto é frequentemente reservado para a secção final da fuga, intensificando o regresso à tónica. Nem todos os sujeitos de fuga se prestam ao stretto — a possibilidade de sobreposição depende das propriedades interválicas e rítmicas do sujeito.',
          tryThisLabel: 'Ouve o acorde diminuto — a tensão para que as fugas constroem',
        },
        {
          title: 'Procedimentos Composicionais: Aumentação, Diminuição, Inversão, Retrogradação',
          explanation:
            'A aumentação apresenta o sujeito em valores de nota mais longos, efetivamente reduzindo o tempo do tema a metade e conferindo-lhe gravidade e peso. A diminuição usa valores mais curtos, duplicando a velocidade e criando urgência. A inversão melódica inverte todos os intervalos — o movimento ascendente torna-se descendente — transformando o contorno do sujeito mas preservando o seu perfil rítmico. A retrogradação apresenta o sujeito de trás para a frente, embora isto seja raro em fugas (mais comum na música serial). Estes procedimentos podem combinar-se: aumentação invertida, diminuição retrógrada. A Arte da Fuga de Bach demonstra virtualmente todas as combinações.',
          tryThisLabel: 'Toca a escala ascendente — depois imagina-a invertida, descendente',
        },
      ],
      tasks: [
        {
          instruction:
            'Numa fuga de Bach que tenhas estudado, localiza o primeiro episódio após a exposição. Que material motívico utiliza — fragmentos do sujeito, do contra-sujeito, ou ambos? Modula? Se sim, para que tonalidade?',
        },
        {
          instruction:
            'Encontra passagens de stretto perto do final da fuga. Com que proximidade se sobrepõem as entradas (quantos tempos de diferença)? O sujeito sobrepõe-se a si mesmo, à resposta, ou ambos?',
        },
        {
          instruction:
            'A fuga utiliza aumentação, diminuição ou inversão do sujeito? Se sim, identifica a passagem específica. Se não, escreve as primeiras 4-5 notas do sujeito em inversão — inverte a direção de cada intervalo.',
        },
      ],
    },

    // ── U25 M3: Canon ─────────────────────────────────────────────────────────
    l8u25m3: {
      title: 'Cânone e Outras Formas Imitativas',
      subtitle: 'Cânones a vários intervalos e tipos especiais',
      objectives: [
        'Compreender o cânone a vários intervalos (uníssono, oitava, 5.a, 4.a, etc.)',
        'Reconhecer tipos especiais de cânone (inversão, retrogradação, aumentação/diminuição)',
        'Distinguir entre cânone estrito e imitação livre',
      ],
      concepts: [
        {
          title: 'Cânone Estrito e Intervalos Canónicos',
          explanation:
            'Num cânone estrito, uma voz líder (dux) apresenta uma melodia e uma voz seguidora (comes) replica-a exatamente após um atraso temporal fixo, transposta por algum intervalo. O cânone ao uníssono repete na mesma altura; o cânone à oitava desloca uma oitava; o cânone à quinta transpõe uma quinta perfeita acima. O desafio composicional é profundo: o líder deve gerar uma melodia que produza contraponto válido contra uma cópia de si mesma com atraso temporal. Quanto mais distante o intervalo canónico do uníssono, mais restritas se tornam as possibilidades melódicas.',
          tryThisLabel: 'Vê a escala — a matéria-prima melódica de um cânone',
        },
        {
          title: 'Tipos Especiais de Cânone e a Ronda',
          explanation:
            'O cânone espelhado (cânone por inversão) inverte todos os intervalos no seguidor — o movimento ascendente no dux torna-se descendente no comes. O cânone de caranguejo (retrógrado) toca a melodia do seguidor de trás para a frente. O cânone por aumentação duplica os valores das notas no seguidor; o cânone por diminuição reduz-los a metade. Estes podem combinar-se — retrogradação invertida, por exemplo. A ronda é o cânone mais simples: um cânone perpétuo ao uníssono onde as vozes entram a intervalos regulares e a melodia repete-se indefinidamente. O ricercar, predecessor da fuga, utiliza contraponto imitativo de forma mais livre, sem a estrutura formal de exposição-episódio da fuga.',
          tryThisLabel: 'Vê Dó maior — a tonalidade mais simples para escrita canónica',
        },
        {
          title: 'Imitação Livre vs. Cânone Estrito',
          explanation:
            'O cânone estrito mantém replicação interválica exata ao longo de toda a peça; a imitação livre utiliza o sujeito como ponto de partida mas permite desvios quando a imitação estrita produziria contraponto deficiente ou dissonância. A maioria da polifonia renascentista e barroca utiliza imitação livre — as passagens começam com entradas canónicas (chamadas "pontos de imitação") mas rapidamente divergem para contraponto independente. Compreender o espectro do cânone estrito à imitação livre ilumina virtualmente toda a música polifónica de Josquin a Bach.',
          tryThisLabel: 'Ouve o menor — comum na escrita imitativa renascentista',
        },
      ],
      tasks: [
        {
          instruction:
            'Pega numa melodia simples de 4 compassos que conheças. Canta-a ou toca-a, depois imagina-a a entrar de novo um compasso depois na mesma altura. Onde ocorreriam dissonâncias? Isto revela por que a escrita canónica é tão restritiva.',
        },
        {
          instruction:
            'Ouve o cânone das Variações Goldberg de Bach (uma em cada três variações é um cânone). Compara o Cânone ao Uníssono (Var. 3), o Cânone à 2.a (Var. 6) e o Cânone à 3.a (Var. 9). Como é que o intervalo canónico afeta o carácter?',
        },
        {
          instruction:
            'Escreve as primeiras 4 notas de uma melodia, depois escreve-as em retrogradação (de trás para a frente) e em inversão (inverte a direção de cada intervalo). Alguma delas poderia servir de cânone contra a original?',
        },
      ],
    },

    // ── U26 M1: Sonata Form ───────────────────────────────────────────────────
    l8u26m1: {
      title: 'A Forma-Sonata em Detalhe',
      subtitle:
        'Exposição, desenvolvimento e reexposição em detalhe seccional completo',
      objectives: [
        'Analisar a exposição em forma-sonata: GTP, TR, cesura medial, GTS, CT',
        'Identificar técnicas de desenvolvimento: fragmentação, sequência, falsa reexposição, retransição',
        'Compreender a resolução tonal da reexposição e a coda expandida de Beethoven',
        'Reconhecer a forma de concerto como uma adaptação da forma-sonata com dupla exposição',
      ],
      concepts: [
        {
          title: 'Forma-Sonata: A Exposição',
          explanation:
            'A exposição contém um grupo temático principal (GTP) na tónica que estabelece carácter e tonalidade, uma transição modulante (TR) que acumula energia e desloca o centro tonal, uma cesura medial (CM) — a pausa dramática que marca a chegada à nova tonalidade —, um grupo temático secundário (GTS) na tonalidade secundária (tipicamente V em maior, III em menor) com carácter contrastante, e material de encerramento (CT) que reafirma a nova tonalidade com potencialmente várias ideias conclusivas. O sinal de repetição no final da exposição é estruturalmente significativo: assegura que o ouvinte interioriza a polaridade tonal entre tónica e dominante antes de o desenvolvimento a desmantelar.',
          tryThisLabel: 'Vê a tonalidade da tónica — a base da forma-sonata',
        },
        {
          title: 'Desenvolvimento e Reexposição',
          explanation:
            'O desenvolvimento fragmenta os temas em motivos, dispõe-nos em sequências por tonalidades remotas, pode encenar uma falsa reexposição (um regresso enganador do GTP na tonalidade errada) e constrói uma retransição sobre a dominante para preparar o regresso. A reexposição reapresenta todo o material na tónica — crucialmente, o GTS aparece agora na tónica, resolvendo a tensão tonal da exposição. A TR é modificada para evitar modular. As codas de Beethoven funcionam frequentemente como segundos desenvolvimentos, estendendo substancialmente a forma com novo trabalho temático e clímaxes dramáticos.',
          tryThisLabel: 'Ouve o acorde de sétima da dominante — o acorde que impulsiona a reexposição',
        },
        {
          title: 'Forma de Concerto: Dupla Exposição',
          explanation:
            'A forma de concerto adapta os princípios da sonata com uma dupla exposição: a exposição orquestral apresenta ambos os temas na tónica, depois a exposição do solista reapresenta o primeiro tema na tónica e o segundo na dominante, seguindo a lógica tonal padrão da sonata. O desenvolvimento apresenta diálogo solista-orquestra. A reexposição resolve ambos os temas na tónica. A cadência — a passagem virtuosística não acompanhada do solista — precede tipicamente a coda final, originalmente improvisada mas cada vez mais escrita a partir de Beethoven.',
          tryThisLabel: 'Vê as relações de tonalidade que as formas-sonata percorrem',
        },
      ],
      tasks: [
        {
          instruction:
            'Escolhe um andamento de sonata do período clássico (p. ex., Mozart K.545, primeiro andamento). Cria uma linha temporal formal: identifica o GTP, TR, cesura medial, GTS, CT, desenvolvimento e reexposição. Em que compasso aparece o GTS na tónica durante a reexposição?',
        },
        {
          instruction:
            'Na secção de desenvolvimento, identifica pelo menos duas técnicas de desenvolvimento: fragmentação, sequência, pedal ou falsa reexposição. Por que tonalidades passa o desenvolvimento antes da retransição?',
        },
        {
          instruction:
            'Compara a transição (TR) na exposição com a da reexposição. Como é que a TR da reexposição é modificada para manter o GTS na tónica? O compositor simplesmente corta a modulação ou recompõe a passagem?',
        },
      ],
    },

    // ── U26 M2: Variation, Rondo, and Ritornello ──────────────────────────────
    l8u26m2: {
      title: 'Variações, Rondó e Ritornello',
      subtitle:
        'Tema e variações, chacona, passacaglia, rondó e ritornello',
      objectives: [
        'Distinguir tema e variações seccionais de formas de variação contínua',
        'Analisar a chacona (padrão harmónico repetido) e a passacaglia (baixo ostinato)',
        'Identificar formas de rondó (5 partes, 7 partes) e híbridos sonata-rondó',
        'Compreender a forma de ritornello barroca e a sua relação com o rondó',
      ],
      concepts: [
        {
          title: 'Tema e Variações, Chacona e Passacaglia',
          explanation:
            'As formas de variação incluem o tema e variações seccional (cada variação é autónoma, separada por cadências claras), a chacona (variações contínuas sobre um padrão harmónico repetido, tipicamente de 4 ou 8 compassos) e a passacaglia (variações contínuas sobre uma linha de baixo repetida — o baixo ostinato). A distinção entre chacona e passacaglia é historicamente ambígua, mas o baixo ostinato é a característica definidora da passacaglia. Em todas as formas de variação, a arte composicional reside em transformar melodia, ritmo, textura e registo mantendo uma ligação audível ao tema ou padrão.',
          tryThisLabel: 'Ouve Lá menor — tonalidade comum para chaconas e passacaglias',
        },
        {
          title: 'Formas de Rondó: Cinco Partes, Sete Partes e Sonata-Rondó',
          explanation:
            'A forma de rondó apresenta um estribilho recorrente (A) alternando com episódios contrastantes: rondó de cinco partes (A-B-A-C-A), de sete partes (A-B-A-C-A-B-A ou A-B-A-C-A-D-A). O estribilho regressa tipicamente na tónica de cada vez, proporcionando estabilidade estrutural. O sonata-rondó hibrida as duas formas — A-B-A-desenvolvimento-A-B-A — combinando a clareza estrutural do rondó com a ambição desenvolvimental da sonata. A secção B regressa na tónica durante a segunda metade, espelhando a resolução tonal da forma-sonata. Este híbrido domina os finais do período clássico.',
          tryThisLabel: 'Vê Dó maior — a tónica que cada estribilho de rondó reafirma',
        },
        {
          title: 'Forma de Ritornello',
          explanation:
            'A forma de ritornello barroca alterna uma passagem orquestral recorrente (o ritornello) com episódios solistas. O ritornello completo aparece na tónica no início e no fim; fragmentos dele regressam em tonalidades diferentes entre os episódios solistas, criando uma jornada tonal. Conceptualmente semelhante ao rondó mas mais fluida — o ritornello raramente é reapresentado completo no meio, e os episódios solistas são mais improvisatórios. Os concertos de Vivaldi epitomizam a forma: ritornello de abertura enérgico, passagens solistas virtuosísticas, fragmentos do ritornello em tonalidades vizinhas, regresso completo do ritornello no final.',
          tryThisLabel: 'Vê as relações de tonalidade que o ritornello percorre',
        },
      ],
      tasks: [
        {
          instruction:
            'Compara uma chacona (p. ex., Chacona em Ré menor de Bach para violino solo) com um tema e variações (p. ex., Variações "Diabelli" de Beethoven). Como é que a estrutura contínua vs. seccional muda a experiência de audição?',
        },
        {
          instruction:
            'Ouve um finale em sonata-rondó (p. ex., Sonata "Patética" de Beethoven, terceiro andamento). Identifica cada regresso do estribilho (A) e etiqueta os episódios. Onde ocorre a secção de "desenvolvimento" dentro da estrutura do rondó?',
        },
        {
          instruction:
            'Ouve um primeiro andamento de concerto de Vivaldi (p. ex., "Primavera" das Quatro Estações). Mapeia os regressos do ritornello: em que tonalidade está cada fragmento? Quanto do ritornello original é reapresentado de cada vez?',
        },
      ],
    },

    // ── U26 M3: Orchestration ─────────────────────────────────────────────────
    l8u26m3: {
      title: 'Orquestração e Consciência de Instrumentação',
      subtitle:
        'Famílias orquestrais, extensões, timbres e transposição',
      objectives: [
        'Conhecer as quatro famílias orquestrais e as suas características',
        'Identificar extensões e timbres dos instrumentos',
        'Compreender os instrumentos transpositores em contexto orquestral',
      ],
      concepts: [
        {
          title: 'As Quatro Famílias Orquestrais',
          explanation:
            'As cordas (violino, viola, violoncelo, contrabaixo) formam a espinha dorsal da orquestra — sustentam, articulam e abrangem a gama dinâmica mais ampla através de técnicas como pizzicato, tremolo, harmónicos e col legno. As madeiras (flauta, oboé, clarinete, fagote e os seus auxiliares) contribuem com cores tímbricas distintas e destacam-se na escrita melódica. Os metais (trompa, trompete, trombone, tuba) conferem potência e brilho, dominando os clímaxes. A percussão divide-se em afinada (tímpanos, xilofone, glockenspiel, vibrafone, marimba, celesta) e não afinada (caixa, bombo, pratos, triângulo), proporcionando definição rítmica, cor e pontuação estrutural.',
          tryThisLabel: 'Vê a extensão — as cordas abrangem quase todo este teclado',
        },
        {
          title: 'Instrumentos Transpositores e Leitura de Partitura',
          explanation:
            'Um instrumento transpositor soa uma altura diferente do Dó escrito. O clarinete em Sib soa uma segunda maior abaixo do escrito; a trompa em Fá soa uma quinta perfeita abaixo; o trompete em Sib soa uma segunda maior abaixo. Para ler uma partitura transpositora à altura real (de concerto), inverte a transposição: para um clarinete em Sib, transpõe a parte escrita uma segunda maior abaixo (ou lê uma segunda abaixo). Ordem padrão da partitura orquestral de cima para baixo: flautas, oboés, clarinetes, fagotes, trompas, trompetes, trombones, tuba, tímpanos, percussão, harpa, violinos I e II, violas, violoncelos, contrabaixos.',
          tryThisLabel: 'Vê Sib — a altura de concerto quando um clarinete em Sib lê Dó',
        },
        {
          title: 'Textura Orquestral e Dobragens',
          explanation:
            'A orquestração é a arte de distribuir ideias musicais pelo conjunto para máximo efeito. A dobragem à oitava (p. ex., flauta e violino a uma oitava de distância) espessa uma melodia sem alterar o seu carácter. A dobragem ao uníssono (p. ex., oboé e violino na mesma altura) funde timbres para criar uma cor composta indisponível em qualquer instrumento isoladamente. A escrita por coros atribui um acorde completo a uma família (um coral de metais ou um coro de madeiras). A escolha de qual instrumento conduz a melodia, qual fornece preenchimento harmónico e qual fornece energia rítmica define o carácter de cada passagem orquestral.',
          tryThisLabel: 'Vê Fá maior — a tonalidade de concerto de uma trompa a ler em Dó',
        },
      ],
      tasks: [
        {
          instruction:
            'Examina uma página de partitura orquestral (p. ex., Sinfonia n.o 5 de Beethoven, primeira página). Identifica a ordem da partitura — que instrumentos estão no topo, quais na base? Quais são transpositores?',
        },
        {
          instruction:
            'Um clarinete em Sib toca um Ré escrito. Que altura soa a altura de concerto? (Resposta: Dó — uma 2.a maior abaixo.) Agora: uma trompa em Fá toca um Sol escrito. Que altura de concerto soa? (Resposta: Dó — uma 5.a perfeita abaixo.)',
        },
        {
          instruction:
            'Ouve o início do "Bolero" de Ravel. Cada repetição do tema usa um instrumento ou combinação diferente. Lista as mudanças tímbricas ao longo das primeiras cinco apresentações. Como é que Ravel usa as dobragens para construir intensidade?',
        },
      ],
    },

    // ── U27 M1: Pitch-Class Sets ──────────────────────────────────────────────
    l8u27m1: {
      title: 'Conjuntos de Classes de Altura e Teoria dos Conjuntos',
      subtitle:
        'Classe de altura, classe de intervalo, forma normal, forma primária, VIC e números de Forte',
      objectives: [
        'Compreender a classe de altura e o sistema de notação por inteiros (0-11)',
        'Calcular a classe de intervalo (CI) e o vetor intervalar (VIC)',
        'Encontrar a forma normal e a forma primária de conjuntos de classes de altura',
        'Identificar conjuntos pelos números do catálogo de Forte',
      ],
      concepts: [
        {
          title: 'Classe de Altura, Notação por Inteiros e Classe de Intervalo',
          explanation:
            'A teoria pós-tonal colapsa todas as alturas equivalentes por oitava em 12 classes de altura numeradas de 0 a 11 (C=0, C#/Db=1, D=2, ... B=11). As grafias enarmónicas tornam-se irrelevantes — F# e Gb são ambos a classe de altura 6. A classe de intervalo (CI) mede a menor distância entre duas classes de altura no relógio mod-12: o intervalo entre CA 0 e CA 4 é CI 4 (não 8, porque tomamos o complemento menor). Os valores de CI vão de 1 a 6, já que qualquer intervalo maior que 6 semitons tem um complemento menor. Esta eliminação de oitava, grafia e distinções direcionais revela o esqueleto interválico abstrato de qualquer sonoridade.',
          tryThisLabel: 'Vê todas as 12 classes de altura dispostas cromaticamente',
        },
        {
          title: 'Conjuntos de Classes de Altura: Forma Normal e Forma Primária',
          explanation:
            'Um conjunto de classes de altura é uma coleção não ordenada de classes de altura distintas — o equivalente pós-tonal de um acorde. A forma normal é o arranjo ascendente mais compacto: roda-se o conjunto até que a extensão do primeiro ao último elemento seja a menor (usando compactação à esquerda para desempatar). A forma primária transpõe a forma normal para começar em 0, depois compara com a inversão para selecionar a que estiver mais compactada à esquerda. A forma primária é a etiqueta canónica: {C, E, G} e {D, F, A} ambos se reduzem à forma primária [0, 3, 7]. O catálogo de Allen Forte atribui a cada forma primária um número — 3-11 para [0, 3, 7] — criando um sistema universal de classificação para sonoridades pós-tonais. Existem duas convenções de compactação — a de Forte, "compactado à esquerda" (usada aqui), e a de Rahn, "compactado a partir da direita" — e discordam num punhado de classes de conjuntos (nenhuma usada neste nível).',
          tryThisLabel: 'Vê Dó menor — conjunto de Forte 3-11, forma primária [0,3,7]',
        },
        {
          title: 'Vetor Intervalar e Relações-Z',
          explanation:
            'O vetor intervalar (VIC) é uma impressão digital de seis dígitos que conta cada CI presente num conjunto. Para [0, 4, 7] (tríade maior), o VIC é <0,0,1,1,1,0>: um CI3, um CI4, um CI5. Dois conjuntos com VIC idênticos mas formas primárias diferentes são Z-relacionados — estruturalmente distintos, mas partilhando exatamente o mesmo conteúdo intervalar. Pares Z-relacionados são relativamente raros no catálogo e constituem uma curiosidade central da teoria dos conjuntos. O VIC proporciona uma forma eficiente de comparar o carácter sonoro dos conjuntos: conjuntos com VIC semelhantes partilham "cor" harmónica mesmo que o seu conteúdo de classes de altura difira inteiramente.',
          tryThisLabel: 'Vê a tríade maior — VIC <0,0,1,1,1,0>',
        },
      ],
      tasks: [
        {
          instruction:
            'Converte as seguintes notas em inteiros de classe de altura: E, Bb, F#, C. (Respostas: 4, 10, 6, 0.) Agora encontra a classe de intervalo entre cada par adjacente. Qual é a CI entre 4 e 10? (Resposta: 6 — o trítono.)',
        },
        {
          instruction:
            'Toma o conjunto {C, Db, E} = {0, 1, 4}. Encontra a forma normal experimentando todas as rotações: [0,1,4] (extensão 4), [1,4,0]=[1,4,12] (extensão 11), [4,0,1]=[4,12,13] (extensão 9). A forma normal é [0,1,4]. Esta é também a forma primária? Compara com a inversão: [0,11,8] normalizado para [0,3,4] — qual está mais compactado à esquerda?',
        },
        {
          instruction:
            'Calcula o vetor intervalar para o conjunto [0, 1, 4]: pares (0,1)=CI1, (0,4)=CI4, (1,4)=CI3. VIC = <1,0,1,1,0,0>. Agora faz o mesmo para [0, 3, 4] e verifica que obténs o VIC idêntico. Isto é esperado — [0,3,4] é a inversão de [0,1,4], por isso pertencem à mesma classe de conjuntos (3-3). A relação-Z ocorre quando dois conjuntos partilham um vetor intervalar sem estarem relacionados por transposição ou inversão; o menor par Z verdadeiro é 4-Z15 [0,1,4,6] e 4-Z29 [0,1,3,7].',
        },
      ],
    },

    // ── U27 M2: Twelve-Tone Technique ─────────────────────────────────────────
    l8u27m2: {
      title: 'Técnica dos Doze Sons',
      subtitle:
        'Séries, formas P/R/I/RI, a matriz dos doze sons e combinatorialidade',
      objectives: [
        'Construir uma série dodecafónica usando todas as 12 classes de altura exatamente uma vez',
        'Derivar as quatro formas da série: Original (P), Retrógrada (R), Inversão (I), Retrógrada-Inversão (RI)',
        'Construir e ler uma matriz 12x12 dos doze sons',
        'Compreender a combinatorialidade e a complementação hexacordal do agregado',
      ],
      concepts: [
        {
          title: 'A Série e as Suas Quatro Formas',
          explanation:
            'Na composição dodecafónica (serial), as 12 classes de altura são ordenadas numa sequência específica — a série. Esta série é a matéria-prima de toda a composição: melodia, harmonia e contraponto derivam dela. A série é manipulada através de quatro transformações: Original (P) — a série original; Retrógrada (R) — a série tocada de trás para a frente; Inversão (I) — cada intervalo invertido, o ascendente torna-se descendente; Retrógrada-Inversão (RI) — a inversão tocada de trás para a frente. Estas quatro operações preservam o ADN intervalar da série enquanto geram formas melódicas maximamente diversas.',
          tryThisLabel: 'Vê todas as 12 classes de altura — a matéria-prima de uma série',
        },
        {
          title: 'A Matriz dos Doze Sons',
          explanation:
            'Cada uma das quatro formas da série pode ser transposta para começar em qualquer uma das 12 classes de altura, produzindo 48 formas no total (P0-P11, R0-R11, I0-I11, RI0-RI11). Estas são organizadas numa matriz 12x12: as formas P leem-se da esquerda para a direita, as formas R da direita para a esquerda, as formas I de cima para baixo e as formas RI de baixo para cima. A matriz é o conjunto de ferramentas completo do compositor — cada derivação serial possível da série está visível num relance. Webern favorecia séries com alta simetria interna, onde algumas formas são idênticas a outras, reduzindo efetivamente as 48 a menos séries distintas.',
          tryThisLabel: 'Vê 7 das 12 classes de altura — uma série usa todas as 12',
        },
        {
          title: 'Combinatorialidade e Complementação Hexacordal',
          explanation:
            'A combinatorialidade é uma propriedade da série em que o primeiro hexacorde (primeiras 6 notas) de uma forma e o primeiro hexacorde de outra forma específica juntos produzem as 12 classes de altura — um agregado. Isto assegura completude harmónica quando duas formas soam simultaneamente, evitando duplicação de classes de altura. Séries totalmente combinatoriais (como as de Babbitt) alcançam complementação de agregado sob relações P, I, R e RI. As obras tardias de Schoenberg exploram a combinatorialidade para controlar a dimensão vertical (harmónica) da música serial, não apenas a horizontal (melódica).',
          tryThisLabel: 'Ouve um acorde simétrico — as séries privilegiam a simetria',
        },
      ],
      tasks: [
        {
          instruction:
            'Cria a tua própria série dodecafónica ordenando todos os inteiros de 0 a 11 sem repetição. Escreve o teu P0. Agora deriva R0 (inverte a ordem), I0 (subtrai cada elemento a 12, mod 12) e RI0 (inverte a inversão).',
        },
        {
          instruction:
            'Usando o teu P0, constrói as duas primeiras linhas de uma matriz dos doze sons. A linha 1 é o próprio P0. A linha 2 começa na segunda classe de altura de I0: transpõe P para começar nessa classe de altura (soma uma constante mod 12 a cada elemento de P0). Verifica que a coluna 1 lê a forma I0 de cima para baixo.',
        },
        {
          instruction:
            'Verifica se a tua série tem combinatorialidade: lista as primeiras 6 classes de altura de P0. Agora lista as primeiras 6 classes de altura de I5 (ou outra inversão). Os dois hexacordes juntos contêm as 12 classes de altura sem duplicações? Se não, experimenta uma transposição diferente de I.',
        },
      ],
    },

    // ── U27 M3: 20th-Century Techniques ───────────────────────────────────────
    l8u27m3: {
      title: 'Técnicas do Século XX: Planing, Politonalidade, Pandiatonicismo',
      subtitle:
        'Harmonia quartal, movimento paralelo, bitonalidade e diatonicismo livre',
      objectives: [
        'Identificar a harmonia quartal/quintal como uma linguagem harmónica completa',
        'Distinguir planing cromático de planing diatónico',
        'Reconhecer politonalidade, polimodalidade e pandiatonicismo em contexto',
      ],
      concepts: [
        {
          title: 'Harmonia Quartal/Quintal e Planing',
          explanation:
            'A harmonia quartal constrói acordes a partir de quartas perfeitas empilhadas em vez de terças, produzindo sonoridades que não são maiores nem menores — abertas, ambíguas e características de Hindemith, Bartok e Copland. A harmonia quintal usa quintas empilhadas (inversamente equivalentes a quartas). O planing move uma estrutura de acorde inteira em paralelo: o planing cromático transpõe cada nota pelo mesmo número de semitons (preservando a qualidade exata do acorde), enquanto o planing diatónico move dentro de uma escala (alterando a qualidade para se ajustar à tonalidade). Os acordes de nona paralelos de Debussy e as tríades paralelas de Ravel exemplificam o planing como técnica harmónica estrutural, não meramente um recurso colorístico.',
          tryThisLabel: 'Ouve a escala de tons inteiros — território simétrico puro para planing',
        },
        {
          title: 'Politonalidade, Polimodalidade e Pandiatonicismo',
          explanation:
            'A politonalidade sobrepõe duas ou mais tonalidades simultaneamente — a bitonalidade de Milhaud pode colocar Dó maior na mão direita contra Fá# maior na esquerda, criando uma sonoridade densa e cintilante que não é tonal nem atonal. A polimodalidade sobrepõe modos diferentes sobre a mesma tónica: Dó Lídio na melodia com Dó Mixolídio no acompanhamento produz as sete alturas diatónicas mas com inflexões modais conflituantes entre as vozes. O pandiatonicismo usa todas as notas de uma escala diatónica livremente, descartando regras de harmonia funcional — qualquer combinação é válida, produzindo música que soa tonal mas resiste à resolução. As obras neoclássicas de Stravinsky epitomizam esta técnica.',
          tryThisLabel: 'Ouve Dó aumentado — a tríade de tons inteiros, sem centro tonal',
        },
        {
          title: 'Microtonalidade e Consciência Espectral',
          explanation:
            'A microtonalidade estende o contínuo de alturas para além das 12 divisões iguais: quartos de tom dividem cada semitom ao meio (24 notas por oitava), a afinação justa afina os intervalos segundo razões de frequência puras, e a afinação espectral deriva intervalos da série de harmónicos. Temperamentos iguais alternativos — 19-TET, 31-TET, 53-TET — oferecem diferentes compromissos entre consonância e flexibilidade. Embora o motor desta aplicação opere em 12-TET padrão, a consciência dos sistemas microtonais revela que a escala cromática de 12 notas é uma convenção histórica, não uma inevitabilidade acústica.',
          tryThisLabel: 'Ouve a escala cromática 12-TET — uma de muitas divisões possíveis',
        },
      ],
      tasks: [
        {
          instruction:
            'Constrói um acorde quartal sobre C: empilha quartas (C-F-Bb-Eb). Compara o seu som com uma tríade de C maior. O acorde quartal não tem qualidade maior nem menor clara — descreve o seu carácter por palavras tuas.',
        },
        {
          instruction:
            'Toca uma escala de tons inteiros de C, depois uma escala diminuta (octatónica) de C. Ambas são simétricas — a escala de tons inteiros divide a oitava em 6 passos iguais, a octatónica alterna tons e meios-tons. Nenhuma tem dominante nem sensível. Como é que isto afeta a sensação de gravidade tonal?',
        },
        {
          instruction:
            'Imagina tocar uma tríade de C maior na mão direita e uma tríade de F# maior na esquerda simultaneamente. Lista as seis classes de altura que soariam. Há alguma sobreposição? Qual é o número total de classes de altura distintas? (Este é o famoso acorde bitonal de Petruchka.)',
        },
      ],
    },

    // ── U27 M4: Minimalism and Aleatory ───────────────────────────────────────
    l8u27m4: {
      title: 'Minimalismo, Aleatoriedade e Técnicas Expandidas',
      subtitle:
        'Desfasamento, processo aditivo, música aleatória e novos recursos sonoros',
      objectives: [
        'Compreender processos composicionais minimalistas: desfasamento, processo aditivo, evolução baseada em pulsação',
        'Distinguir as operações aleatórias de Cage da aleatoriedade controlada de Lutoslawski',
        'Reconhecer técnicas expandidas: piano preparado, multifónicos, sprechstimme',
        'Ter consciência de forma móvel e notação indeterminada',
      ],
      concepts: [
        {
          title: 'Minimalismo: Desfasamento e Processo Aditivo',
          explanation:
            'O minimalismo emprega estruturas repetitivas que evoluem gradualmente. O desfasamento (phase shifting) de Steve Reich começa dois padrões idênticos em sincronia perfeita, depois empurra um ligeiramente à frente — os padrões de interferência resultantes criam relações rítmicas e melódicas em constante mudança até as duas partes eventualmente se realinharem. O processo aditivo de Philip Glass expande padrões adicionando notas incrementalmente: uma célula de 4 notas torna-se 5, depois 6, depois 8, construindo complexidade a partir do material inicial mais simples possível. O minimalismo baseado em pulsação (La Monte Young, Terry Riley) sustenta uma pulsação rítmica constante enquanto a harmonia evolui lentamente ao longo de grandes períodos de tempo, transformando a percepção do tempo pelo ouvinte.',
          tryThisLabel: 'Toca um padrão repetitivo com estas notas — a matéria-prima do minimalismo',
        },
        {
          title: 'Aleatoriedade e Música de Acaso',
          explanation:
            'A aleatoriedade (música de acaso) introduz indeterminação na composição ou na interpretação. John Cage usou operações do I Ching, lançamentos de moedas e mapas estelares para determinar alturas, durações e dinâmicas — removendo inteiramente as escolhas subjetivas do compositor. Witold Lutoslawski desenvolveu a aleatoriedade controlada: os intérpretes escolhem livremente dentro de limites definidos (conteúdo de alturas fixo, ritmo livre), criando passagens de caos controlado. A forma móvel (Klavierstuck XI de Stockhausen, Terceira Sonata para Piano de Boulez) permite aos intérpretes tocar secções em qualquer ordem, de modo que cada interpretação cria uma trajetória formal única. Estas abordagens questionaram a própria definição de "obra" musical.',
          tryThisLabel: 'Vê todas as 12 classes de altura — a aleatoriedade recorre ao espectro completo',
        },
        {
          title: 'Técnicas Expandidas',
          explanation:
            'As técnicas expandidas transformam os instrumentos para além da sua paleta sonora convencional. O piano preparado (John Cage) coloca parafusos, porcas, borracha e feltro entre as cordas, convertendo o piano num conjunto de percussão para um só intérprete com timbres imprevisíveis. Os multifónicos extraem várias alturas simultâneas de um único instrumento de sopro através de dedilhações e embocaduras especializadas. O sul ponticello (arco perto do cavalete) e o col legno (golpear com a madeira do arco) alteram radicalmente o timbre das cordas. O sprechstimme (emissão vocal meio cantada, meio falada, desenvolvida por Schoenberg) habita o território entre a fala e o canto. Estas técnicas redefiniram o que constitui material musical em si.',
          tryThisLabel: 'Ouve a escala octatónica — recurso de Bartok e Stravinsky',
        },
      ],
      tasks: [
        {
          instruction:
            'Bate palmas num padrão rítmico simples de 4 notas em ciclo contínuo. Agora imagina uma segunda pessoa a bater palmas no mesmo padrão, mas acelerando gradualmente uma quantidade ínfima. O que acontece ao ritmo composto ao longo de 30 segundos? Isto é o desfasamento.',
        },
        {
          instruction:
            'Concebe uma célula melódica de 3 notas (p. ex., C-E-G). Agora aplica o processo aditivo: toca C-E (2 notas), depois C-E-G (3 notas), depois C-E-G-E (4 notas), depois C-E-G-E-C (5 notas). Como muda o carácter do padrão à medida que cresce?',
        },
        {
          instruction:
            'Escreve 4 fragmentos musicais curtos (2-4 notas cada) em cartões separados. Baralha os cartões e toca-os na ordem em que aparecerem. Repete com outra baralhadela. Como muda a forma? Esta é uma forma móvel simplificada.',
        },
      ],
    },

    // ── U27 M5: Advanced Rhythm ───────────────────────────────────────────────
    l8u27m5: {
      title: 'Ritmo Avançado: Polirritmia, Hemíola, Modulação Métrica',
      subtitle:
        'Quiálteras complexas, ritmos cruzados, polirritmia e modulação métrica',
      objectives: [
        'Executar e ouvir quiálteras complexas e ritmos cruzados',
        'Compreender polirritmia vs. polimetria',
        'Reconhecer hemíola e modulação métrica',
      ],
      concepts: [
        {
          title: 'Quiálteras Complexas e Ritmos Cruzados',
          explanation:
            'Para além das tercinas simples, as quiálteras complexas subdividem os tempos em quintinas (5 no espaço de 4), septinas (7:4 ou 7:6) e quiálteras aninhadas (tercinas dentro de tercinas, produzindo 9 subdivisões). Os ritmos cruzados sobrepõem agrupamentos diferentes simultaneamente: 3 contra 2 (três notas iguais numa voz contra duas noutra), 4 contra 3, ou 5 contra 4. A percepção-chave é que os ritmos cruzados criam dissonância rítmica análoga à dissonância harmónica — os pulsos conflituantes geram tensão que se resolve quando se realinham num tempo forte partilhado. Este princípio está na base de grande parte do rubato de Chopin, da complexidade rítmica de Brahms e de virtualmente toda a percussão da África subsariana.',
          tryThisLabel: 'Toca a escala — experimenta agrupar as notas em 3 e depois em 2',
        },
        {
          title: 'Polirritmia vs. Polimetria e Hemíola',
          explanation:
            'Polirritmia e polimetria são frequentemente confundidas mas estruturalmente distintas. A polirritmia sobrepõe diferentes agrupamentos rítmicos dentro de um metro partilhado — os tempos fortes continuam a alinhar-se (3 contra 2 dentro de um compasso de 6/8). A polimetria sobrepõe metros diferentes simultaneamente — uma voz em 3/4 contra outra em 4/4 — de modo que os tempos fortes divergem e só se realinham no mínimo múltiplo comum (a cada 12 tempos). A hemíola é um ritmo cruzado específico e historicamente ubíquo: dois compassos de metro ternário (3+3) reinterpretados como três grupos binários (2+2+2), ou vice-versa em tempo composto. A hemíola permeia Handel, Brahms e a música latino-americana, criando uma ambiguidade métrica momentânea que energiza passagens cadenciais e de transição.',
          tryThisLabel: 'Toca em grupos de 2, depois de 3 — sente o ritmo cruzado',
        },
        {
          title: 'Modulação Métrica e Ritmo Aditivo',
          explanation:
            'A modulação métrica (técnica assinatura de Elliott Carter) usa um valor rítmico partilhado como pivot entre tempos com precisão matemática. Se as colcheias em tercina no tempo antigo se tornam colcheias regulares no novo tempo, o novo tempo é exatamente 3/2 do antigo. Modulações baseadas em quintinas produzem razões 5:4; a técnica encadeia-se para percorrer múltiplos tempos. Os ritmos aditivos constroem padrões a partir de agrupamentos desiguais — 2+2+3, 3+2+2+3 — produzindo metros assimétricos centrais na música balcânica (aksak), em Bartok, Stravinsky e rock progressivo. As fórmulas de compasso irracionais (p. ex., 4/3, 5/6) estendem esta lógica ainda mais, especificando relações de tempo em vez de divisões tradicionais de pulso.',
          tryThisLabel: 'Toca o modo Dórico — experimenta acentuar cada 5.a nota',
        },
      ],
      tasks: [
        {
          instruction:
            'Bate palmas numa pulsação constante de 4 tempos. Agora tenta encaixar 3 palmas uniformemente espaçadas no mesmo intervalo com a outra mão. Onde coincidem as mãos? (Apenas no tempo 1.) Este é o ritmo cruzado fundamental de 3 contra 2 — a base de toda a complexidade polirrítmica.',
        },
        {
          instruction:
            'Pega numa passagem em compasso 3/4 e conta 6 tempos ao longo de dois compassos (1-2-3-1-2-3). Agora reagrupa esses mesmos 6 tempos como 2+2+2. A melodia que estava em metro ternário é agora percebida em binário — criaste uma hemíola. Onde aparece isto na música que conheces?',
        },
        {
          instruction:
            'Calcula uma modulação métrica: se o tempo atual é semínima = 120 BPM e as colcheias em tercina se tornam a nova colcheia, qual é o novo tempo? (A colcheia em tercina = 1/3 de uma semínima = 360 por minuto. Como nova colcheia, duas delas = uma nova semínima, portanto a nova semínima = 180 BPM. Razão: 3:2.)',
        },
      ],
    },
  },
};

export default curriculumL8;
