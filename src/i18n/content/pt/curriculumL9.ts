import type { CurriculumLevelOverlay } from '../types';

const curriculumL9: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    u30: {
      title: 'Treino de Altura e Intervalos',
      description:
        'Correspondência de altura, direção melódica, reconhecimento maior/menor e identificação completa de intervalos de ouvido',
    },
    u31: {
      title: 'Competências de Escalas, Acordes e Ditado',
      description:
        'Reconhecimento de escalas e modos, identificação de qualidades de tríades e acordes de sétima de ouvido',
    },
    u32: {
      title: 'Ditado, Leitura à Primeira Vista e Audição Contextual',
      description:
        'Ditado melódico e harmónico, solfejo móvel para leitura à primeira vista e audição crítica de textura, forma e estilo',
    },
  },

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: {
    // ── U30 M1: Pitch Matching and Direction ──────────────────────────────────
    l9u30m1: {
      title: 'Correspondência de Altura e Direção',
      subtitle:
        'Corresponder alturas de ouvido, identificar direção melódica e perceber diferenças de registo',
      objectives: [
        'Corresponder alturas cantando ou identificando notas no piano',
        'Reconhecer movimento melódico ascendente vs. descendente em diferentes registos',
        'Distinguir registo agudo de registo grave e perceber a colocação relativa de registo',
      ],
      concepts: [
        {
          title: 'Correspondência de Altura',
          explanation:
            'A competência aural mais fundamental é ouvir uma nota e reproduzi-la -- cantando ou encontrando-a num instrumento. Começa com notas isoladas no registo médio (perto do Dó central), depois expande para fora. Treina tocando uma nota no piano e tentando encontrá-la de novo com os olhos fechados. Isto constrói a ligação interna ouvido-mão que sustenta todo o treino auditivo posterior. O objetivo não é ouvido absoluto (que é em grande parte inato) mas ouvido relativo fiável -- ouvir uma nota em relação a uma referência.',
          tryThisLabel: 'Toca a escala de C maior como referência de altura',
        },
        {
          title: 'Direção do Movimento',
          explanation:
            'Consegues dizer se uma melodia sobe, desce ou se mantém? Isto é mais intuitivo do que parece -- mas tornar o julgamento consciente e preciso é o objetivo. Toca duas notas em sequência e identifica a direção. Movimento ascendente vai para altura mais aguda; descendente vai para mais grave. Começa com saltos amplos (uma oitava de distância) e estreita progressivamente até conseguires detetar movimento de um único meio-tom. Isto treina a perceção de contorno que vais precisar para o ditado melódico mais tarde.',
          tryThisLabel: 'Ouve movimento por graus ascendentes',
        },
        {
          title: 'Perceção de Registo',
          explanation:
            'Agudo vs. grave é sempre relativo: o "agudo" de um clarinete baixo é o "grave" de uma flauta. Perceção de registo significa identificar se uma nota se situa na zona superior, média ou inferior da extensão do instrumento. No piano, a oitava mais grave tem uma qualidade profunda e retumbante; as oitavas médias soam claras e equilibradas; a oitava mais aguda é brilhante e fina. Treina tocando notas ao longo de toda a extensão e identificando em que região de oitava se encontram sem olhar. Esta audição espacial é essencial para compreender voicings orquestrais e arranjos.',
          tryThisLabel:
            'Toca A maior -- depois experimenta noutra oitava',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "C major scale" e toca no piano. Tenta cantar cada nota à medida que a ouves -- corresponde a tua voz à altura. Começa num registo confortável',
        },
        {
          instruction:
            'Toca notas individuais no piano com os olhos fechados -- consegues dizer se a segunda nota é mais aguda ou mais grave que a primeira? Começa com saltos amplos, depois estreita até teclas adjacentes',
        },
        {
          instruction:
            'Toca uma nota no registo grave, depois a mesma nota duas oitavas acima. Ouve como a qualidade muda mas a identidade da nota permanece. Isto é perceção de registo',
        },
      ],
    },

    // ── U30 M2: Major vs Minor Recognition ────────────────────────────────────
    l9u30m2: {
      title: 'Reconhecimento Maior vs. Menor',
      subtitle:
        'Distinguir tonalidade maior e menor de ouvido -- acordes, escalas e cor geral',
      objectives: [
        'Distinguir tríades maiores de menores de ouvido -- brilhante/aberto vs. sombrio/melancólico',
        'Reconhecer tonalidade maior vs. menor em escalas e melodias curtas',
        'Desenvolver reconhecimento instintivo imediato antes da explicação teórica',
      ],
      concepts: [
        {
          title: 'Acordes Maiores vs. Menores',
          explanation:
            'O reconhecimento de qualidade mais básico no treino auditivo. Acordes maiores soam brilhantes, abertos e resolvidos. Acordes menores soam sombrios, melancólicos e introspetivos. A explicação teórica -- a diferença está no terceiro grau, elevado ou baixado meio-tom -- é secundária nesta fase. Treina tocando acordes maiores e menores lado a lado a partir da mesma fundamental até a distinção se tornar instantânea e automática. Isto é um sentimento visceral primeiro, compreensão intelectual depois.',
          tryThisLabel: 'Ouve maior -- depois experimenta "C minor chord"',
        },
        {
          title: 'Tonalidade Maior vs. Menor',
          explanation:
            'Para lá de acordes individuais, tonalidades e melodias inteiras têm carácter maior ou menor. Uma melodia em C maior soa brilhante e assente; o mesmo contorno em C menor soa mais sombrio e introspetivo. Ouve a cor emocional geral em vez de analisares notas individuais. Toca a escala de C maior seguida da escala de C menor natural -- a mudança de atmosfera é inconfundível. Este reconhecimento de tonalidade é a base para todo o treino auditivo de qualidade posterior.',
          tryThisLabel:
            'Ouve a tonalidade menor -- compara com a escala de C maior',
        },
        {
          title: 'Treinar o Julgamento Instantâneo',
          explanation:
            'O objetivo do reconhecimento maior/menor não é análise, mas reflexo. Deves ouvir a qualidade antes de a tua mente consciente a nomear. Isto requer repetição: toca acordes maiores e menores aleatórios a partir de diferentes fundamentais e identifica a qualidade o mais rápido possível. A velocidade importa porque a música real não faz pausa para analisares. Experimenta fundamentais menos familiares -- Ab, Db, F# -- onde a tua familiaridade com o instrumento não pode ajudar. Quando conseguires identificar maior vs. menor em menos de um segundo a partir de qualquer fundamental, a competência está internalizada.',
          tryThisLabel:
            'Experimenta maior a partir de uma fundamental menos familiar -- continua brilhante?',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "C major chord" e depois "C minor chord" um atrás do outro. Qual soa brilhante? Qual soa sombrio? Repete até a distinção ser instantânea',
        },
        {
          instruction:
            'Toca "G major chord" e depois "Gm" -- mesmo exercício, fundamental diferente. A diferença de qualidade deve transferir-se independentemente da nota inicial',
        },
        {
          instruction:
            'Toca "C major scale" e depois "C natural minor scale". Ouve a mudança de cor geral. Consegues sentir a mudança de atmosfera antes da escala estar a meio?',
        },
      ],
    },

    // ── U30 M3: Interval Recognition P1-P5 ────────────────────────────────────
    l9u30m3: {
      title: 'Reconhecimento de Intervalos: P1-P5',
      subtitle:
        'Identificar intervalos perfeitos e pequenos de ouvido usando associações com canções e reconhecimento direto',
      objectives: [
        'Identificar uníssono, 2.a menor, 2.a maior, 3.a menor, 3.a maior, 4.a perfeita, trítono e 5.a perfeita de ouvido',
        'Usar associações com canções como auxiliares mnemónicos para cada intervalo',
        'Reconhecer estes intervalos tanto ascendentes como descendentes',
      ],
      concepts: [
        {
          title: 'Associações com Canções: Intervalos Pequenos',
          explanation:
            'Uma técnica mnemónica comprovada: associar cada intervalo com o início de uma melodia familiar. 2.a menor ascendente = tema de Tubarão. 2.a maior = Parabéns a Você. 3.a menor = Greensleeves. 3.a maior = When the Saints (oh-when). 4.a perfeita = Marcha Nupcial. Trítono = The Simpsons (The-Simp). 5.a perfeita = Brilha Brilha Estrelinha. Estas são rodinhas de treino -- o objetivo é internalizar o som de cada intervalo diretamente e depois abandonar a muleta. Começa apenas com intervalos ascendentes, depois acrescenta descendentes quando os ascendentes estiverem sólidos.',
          tryThisLabel:
            'Toca C maior -- ouve cada intervalo a partir da fundamental',
        },
        {
          title: 'Consonância Perfeita vs. Imperfeita',
          explanation:
            'Os intervalos deste módulo dividem-se em duas famílias. Consonâncias perfeitas (P1, P4, P5) soam "abertas" e "ocas" -- como um sino ou uma corda solta. Têm uma qualidade austera e despojada. Consonâncias imperfeitas (3.a m, 3.a M) soam "quentes" e "fundidas" -- as notas combinam-se suavemente mas com mais cor. Segundas (2.a m, 2.a M) são dissonâncias -- soam "ásperas" ou "crocantes" quando tocadas em simultâneo. O trítono é o intervalo mais dissonante de todos -- tenso, instável e exigindo resolução. Aprender a categorizar por consonância/dissonância é mais rápido do que memorizar cada intervalo individualmente.',
          tryThisLabel:
            'Ouve a 3.a maior (C a E) e a 5.a perfeita (C a G)',
        },
        {
          title: 'Ascendente vs. Descendente',
          explanation:
            'Cada intervalo tem um carácter diferente ascendente vs. descendente. A 2.a menor ascendente soa tensa e rastejante. A 2.a menor descendente soa suspirante e resolutiva. A 4.a perfeita ascendente soa como uma fanfarra. A 4.a perfeita descendente soa assente e cadencial. Tens de treinar ambas as direções independentemente -- saber identificar uma 5.a perfeita ascendente não significa automaticamente que a consegues identificar descendente. Usa também associações com canções descendentes: 2.a M descendente = Mary Had a Little Lamb (primeiras duas notas), 3.a m descendente = Hey Jude (hey-Jude). Constrói o conjunto descendente como uma competência separada.',
          tryThisLabel: 'Ouve o trítono dentro de C7 (E a Bb)',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "C major chord" -- o intervalo de C a E é uma 3.a maior, e de C a G é uma 5.a perfeita. Canta os dois intervalos separadamente. Memoriza cada som',
        },
        {
          instruction:
            'Toca pares de notas no piano a partir de C: C-Db (2.a m), C-D (2.a M), C-Eb (3.a m), C-E (3.a M), C-F (4.a P), C-Gb (trítono), C-G (5.a P). Nomeia cada um antes de verificar',
        },
        {
          instruction:
            'Escreve "C7" -- encontra o trítono (E a Bb). Este é o intervalo mais instável. Contrasta-o com a 5.a perfeita (C a G) em "C major chord". Estável vs. tenso -- ouve a diferença',
        },
      ],
    },

    // ── U30 M4: Interval Recognition m6-P8 ────────────────────────────────────
    l9u30m4: {
      title: 'Reconhecimento de Intervalos: 6.a m-P8',
      subtitle:
        'Identificar intervalos amplos de ouvido -- sextas, sétimas e a oitava',
      objectives: [
        'Identificar 6.a menor, 6.a maior, 7.a menor, 7.a maior e oitava perfeita de ouvido',
        'Usar associações com canções para intervalos amplos, ascendentes e descendentes',
        'Combinar com o conhecimento de intervalos pequenos para reconhecimento completo de intervalos simples',
      ],
      concepts: [
        {
          title: 'Associações com Canções: Intervalos Amplos',
          explanation:
            'Continuando a abordagem mnemónica para a metade superior da oitava. 6.a menor = The Entertainer. 6.a maior = My Bonnie (my-bon). 7.a menor = Somewhere (West Side Story). 7.a maior = Take On Me (take-on). Oitava = Somewhere Over the Rainbow. Intervalos amplos são mais difíceis de identificar porque parecem "grandes saltos" e as diferenças de tamanho entre eles são proporcionalmente menores. As sextas e sétimas são particularmente árduas -- são inversões de terças e segundas, portanto o seu carácter está relacionado mas é mais largo. Treina contrastando pares: 6.a m vs. 6.a M, 7.a m vs. 7.a M.',
          tryThisLabel: 'Ouve o intervalo de 7.a maior (C a B)',
        },
        {
          title: 'Intervalos Amplos Descendentes',
          explanation:
            'Os intervalos descendentes soam diferentes dos ascendentes mesmo que a distância seja igual. Uma 5.a perfeita descendente (G descendo para C) soa como resolução ou aterragem. Uma 6.a maior descendente soa quente e nostálgica. Sétimas descendentes soam dramáticas e amplas. Treina intervalos descendentes separadamente -- muitos estudantes que dominam intervalos ascendentes debatem-se com os descendentes. Usa associações com canções descendentes: 5.a P descendente = Flintstones (Flint-stones), 3.a m descendente = Hey Jude (hey-Jude). Constrói o conjunto descendente como competência própria.',
          tryThisLabel:
            'Toca C maior descendente -- ouve os intervalos ao contrário',
        },
        {
          title: 'Relações de Inversão de Intervalos',
          explanation:
            'Intervalos amplos são inversões de intervalos pequenos: uma 6.a maior é uma 3.a menor invertida, uma 7.a menor é uma 2.a maior invertida, uma 7.a maior é uma 2.a menor invertida. Isto significa que o seu "sabor" está relacionado -- uma 3.a menor e uma 6.a maior partilham calor, uma 2.a maior e uma 7.a menor partilham uma qualidade bluesy. Se ouves um intervalo amplo e não o consegues identificar diretamente, tenta invertê-lo mentalmente: soa como uma 3.a menor invertida? Então é uma 6.a maior. Esta técnica de referência cruzada acelera a aprendizagem de intervalos amplos.',
          tryThisLabel:
            'Ouve a 7.a menor (C a Bb) -- inversão de uma 2.a maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "Cmaj7" -- o intervalo exterior de C a B é uma 7.a maior. Agora toca C a Bb (7.a menor). A diferença é meio-tom, mas o carácter muda de tensão brilhante para atração bluesy',
        },
        {
          instruction:
            'Toca C a Ab (6.a m) e depois C a A (6.a M) no piano. A 6.a menor soa mais sombria e pungente. A 6.a maior soa mais quente e aberta. Repete a partir de diferentes fundamentais até as conseguires distinguir com fiabilidade',
        },
        {
          instruction:
            'Toca C até ao C agudo (oitava). A oitava soa como "a mesma nota, altura diferente." Agora contrasta com C a B (7.a M) -- quase uma oitava, mas com tensão. Essa qualidade de quase-lá é a assinatura da 7.a maior',
        },
      ],
    },

    // ── U30 M5: Harmonic Intervals and Compounds ──────────────────────────────
    l9u30m5: {
      title: 'Intervalos Harmónicos e Compostos',
      subtitle:
        'Reconhecimento de intervalos simultâneos e intervalos compostos além da oitava',
      objectives: [
        'Ouvir intervalos quando ambas as notas tocam simultaneamente (intervalos harmónicos)',
        'Distinguir intervalos harmónicos consonantes de dissonantes pela qualidade sonora',
        'Reconhecer intervalos compostos (9.as, 10.as, 11.as) como versões mais largas de intervalos simples',
      ],
      concepts: [
        {
          title: 'Intervalos Harmónicos',
          explanation:
            'Ouvir intervalos quando ambas as notas tocam simultaneamente é mais difícil do que intervalos melódicos (sequenciais) porque os sons fundem-se. Consonâncias perfeitas (5.a P, 8.a P) soam "abertas" e "ocas." Consonâncias imperfeitas (3.as, 6.as) soam "quentes" e "fundidas." Dissonâncias (2.as, 7.as, trítono) soam "ásperas" ou "tensas." Aprende primeiro intervalos melódicos, depois transita para harmónicos. A distinção de qualidade -- consonante vs. dissonante -- é a tua pista principal quando as notas soam simultaneamente.',
          tryThisLabel: 'Ouve B contra C -- um intervalo de 7.a maior',
        },
        {
          title: 'Intervalos Compostos',
          explanation:
            'Após dominar intervalos simples (dentro de uma oitava), expande para intervalos compostos que ultrapassam a oitava. Uma 9.a = oitava + 2.a. Uma 10.a = oitava + 3.a. Uma 11.a = oitava + 4.a. Uma 13.a = oitava + 6.a. Os intervalos compostos soam como os seus equivalentes simples mas "mais largos" e mais espaçosos. As regras de qualidade transferem-se: uma 9.a maior tem a mesma qualidade que uma 2.a maior. Ouves estes constantemente em acordes de jazz estendidos -- a 9.a num Cmaj9 é a nota D uma oitava acima da fundamental.',
          tryThisLabel: 'Ouve o trítono dentro de C7 (E a Bb)',
        },
        {
          title: 'Exercícios de Velocidade e Fluência',
          explanation:
            'O reconhecimento de intervalos só é útil se for rápido. Na música real, as notas passam depressa -- não tens tempo para deliberar. O objetivo é passar de "analisar, depois nomear" para "ouvir e saber instantaneamente." Treina com exercícios cronometrados: toca duas notas aleatórias e identifica o intervalo em três segundos. Acompanha a precisão ao longo das sessões. Começa com um conjunto restrito (apenas intervalos perfeitos, ou apenas consonâncias) e expande quando a precisão ultrapassar 80 porcento. Misturar apresentações melódicas, harmónicas, ascendentes e descendentes no mesmo exercício constrói reconhecimento robusto e independente do contexto.',
          tryThisLabel:
            'Ouve três intervalos de uma vez -- 5.a P, 3.a M e 3.a m',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca duas notas simultaneamente no piano: C e E (3.a M), C e G (5.a P), C e B (7.a M). Ouve como se fundem de forma diferente. Consonâncias misturam-se; dissonâncias criam batimentos e aspereza',
        },
        {
          instruction:
            'Escreve "Cmaj7" e ouve todos os intervalos harmónicos dentro dele: C-E (3.a M), C-G (5.a P), C-B (7.a M), E-G (3.a m), E-B (5.a P), G-B (3.a M). Um único acorde contém muitos intervalos simultâneos',
        },
        {
          instruction:
            'Toca C3 e D4 no piano (uma 9.a). Compara com C4 e D4 (uma 2.a). A 9.a soa como uma versão mais larga e espaçosa da 2.a. Este é o princípio dos intervalos compostos em ação',
        },
      ],
    },

    // ── U31 M1: Scale Recognition Major/Minor ─────────────────────────────────
    l9u31m1: {
      title: 'Reconhecimento de Escalas: Formas Maiores e Menores',
      subtitle:
        'Distinguir maior, menor natural, menor harmónica e menor melódica de ouvido',
      objectives: [
        'Distinguir maior de menor natural pela cor geral e atmosfera',
        'Identificar menor harmónica pela 2.a aumentada exótica entre os graus 6 e 7',
        'Identificar menor melódica pelo 6.o e 7.o graus elevados ascendentes, criando uma qualidade suave e jazzística',
      ],
      concepts: [
        {
          title: 'Formas Maiores vs. Menores',
          explanation:
            'Construindo sobre o reconhecimento básico maior/menor: agora identifica formas menores específicas. A menor natural soa sombria e folclórica -- sem atração forte no final porque o 7.o grau está um tom abaixo da tónica (subtónica, não sensível). A menor harmónica eleva o 7.o grau, criando uma sensível e uma 2.a aumentada exótica entre os graus 6 e 7 -- um som inconfundível. A menor melódica eleva tanto o 6.o como o 7.o graus ascendentes, suavizando a 2.a aumentada -- soa jazzística e sofisticada. Treina tocando as três a partir da mesma fundamental (p. ex. A) e isolando as diferenças.',
          tryThisLabel:
            'Ouve o 7.o grau elevado exótico na menor harmónica',
        },
        {
          title: 'Método de Treino: Isolamento',
          explanation:
            'A chave para o reconhecimento de escalas é isolar o que muda entre escalas semelhantes. Toca A maior, depois A menor natural -- três notas mudam (C#/C, F#/F, G#/G). Agora toca A menor natural, depois A menor harmónica -- apenas uma nota muda (G para G#). Finalmente, A menor harmónica para A menor melódica ascendente -- novamente uma nota (F para F#). Ao estreitares o foco para os graus específicos que diferem, treinas mais rápido do que tentando ouvir a escala inteira como uma unidade.',
          tryThisLabel: 'Ouve menor melódica -- suave e jazzística',
        },
        {
          title: 'Ancoragem ao Centro Tonal',
          explanation:
            'O reconhecimento de escalas torna-se mais difícil quando a fundamental muda. Podes identificar A menor natural facilmente mas debater-te com Eb menor natural porque a tonalidade desconhecida te distrai. A solução: ancora sempre a tónica primeiro. Toca a nota fundamental, estabelece-a como "casa," depois ouve a escala. Uma vez ancorado o centro tonal, os intervalos relativos entre graus são os mesmos em qualquer tonalidade. Treina praticando reconhecimento de escalas nas doze fundamentais -- a qualidade deve ser identificável independentemente da nota inicial.',
          tryThisLabel:
            'Ouve menor natural a partir de uma fundamental menos familiar',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "A natural minor scale", depois "A harmonic minor scale", depois "A melodic minor scale" seguidas. Ouve o que muda entre cada uma -- o 7.o elevado, depois o 6.o elevado',
        },
        {
          instruction:
            'Toca "C major scale" e depois "C natural minor scale". Três graus mudam. Consegues ouvir as três mudanças, ou a mudança de cor geral domina a tua perceção?',
        },
        {
          instruction:
            'Toca "E harmonic minor scale" -- ouve a 2.a aumentada entre o 6.o e o 7.o graus (C a D#). Esse salto exótico é a impressão digital da menor harmónica',
        },
      ],
    },

    // ── U31 M2: Scale Recognition Modes ───────────────────────────────────────
    l9u31m2: {
      title: 'Reconhecimento de Escalas: Modos',
      subtitle:
        'Identificar os sete modos eclesiásticos pelas suas notas características',
      objectives: [
        'Identificar cada um dos sete modos eclesiásticos pela sua cor característica',
        'Distinguir modos semelhantes a maior (Jónico, Lídio, Mixolídio) de modos semelhantes a menor (Dórico, Frígio, Eólio, Lócrio)',
        'Ouvir a nota característica única que diferencia cada modo do maior ou menor natural',
      ],
      concepts: [
        {
          title: 'Carácter Modal',
          explanation:
            'Cada modo tem uma cor característica definida por uma ou duas notas que diferem do maior ou menor natural. Dórico é menor com 6.o elevado -- quente e jazzístico. Frígio tem 2.a bemolizada -- sombrio e com sonoridade espanhola. Lídio tem 4.a sustenida -- sonhador e flutuante. Mixolídio tem 7.a bemolizada -- bluesy e rock. Lócrio tem 2.a e 5.a bemolizadas -- instável e raramente usado como tónica. Foca-te nestas "notas características" ao identificar modos de ouvido.',
          tryThisLabel:
            'Ouve Dórico -- menor mas quente (6.o elevado)',
        },
        {
          title: 'Método de Treino: Semelhante a Maior vs. Semelhante a Menor',
          explanation:
            'Começa por separar modos em dois grupos. Modos semelhantes a maior têm 3.a maior: Jónico (maior puro), Lídio (#4 -- sonhador), Mixolídio (b7 -- bluesy). Modos semelhantes a menor têm 3.a menor: Eólio (menor puro), Dórico (6.a natural -- quente), Frígio (b2 -- sombrio), Lócrio (b2 e b5 -- instável). Primeiro aprende a identificar o grupo, depois afunila para o modo específico. Esta primeira passagem binária reduz as tuas opções a metade imediatamente e é muito mais fiável do que adivinhar entre sete opções.',
          tryThisLabel:
            'Ouve Lídio -- o #4 sonhador eleva o som',
        },
        {
          title: 'Âncoras Auditivas de Nota Característica',
          explanation:
            'Para cada modo, treina o teu ouvido na uma ou duas notas que o tornam único. Dórico: toca menor natural, depois eleva a 6.a -- ouve a calidez entrar. Frígio: toca menor natural, depois baixa a 2.a -- ouve escurecer dramaticamente. Lídio: toca maior, depois eleva a 4.a -- ouve flutuar. Mixolídio: toca maior, depois baixa a 7.a -- ouve relaxar para blues. Cada nota característica cria uma mudança emocional específica. Memoriza essa mudança, e consegues identificar qualquer modo ao encontrar o seu momento característico.',
          tryThisLabel:
            'Ouve Frígio -- a 2.a bemolizada escurece tudo',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "C phrygian" e depois "C dorian" -- Frígio é sombrio e espanhol (2.a bemolizada). Dórico é mais quente (6.a natural). Ambos são modos menores mas a diferença de carácter é dramática',
        },
        {
          instruction:
            'Toca "C lydian" e depois "C major scale" (Jónico). A única diferença é F vs F#. Lídio flutua; Jónico assenta. Uma nota muda a atmosfera inteira',
        },
        {
          instruction:
            'Toca "C mixolydian" e depois "C major scale". Mixolídio tem Bb em vez de B -- soa bluesy e menos conclusivo. Este é o som dominante no rock e no blues',
        },
      ],
    },

    // ── U31 M3: Scale Recognition Pentatonic/Blues/Symmetric ──────────────────
    l9u31m3: {
      title: 'Reconhecimento de Escalas: Pentatónica, Blues, Simétrica',
      subtitle:
        'Reconhecer escalas especiais de ouvido -- pentatónica, blues, tons inteiros e diminuta',
      objectives: [
        'Identificar escalas pentatónicas maior e menor pelo seu carácter aberto e com lacunas',
        'Reconhecer a escala de blues pela sua blue note adicionada (5.a bemolizada)',
        'Identificar escalas de tons inteiros e diminutas pela sua qualidade simétrica e sem direção',
      ],
      concepts: [
        {
          title: 'Escalas Pentatónicas',
          explanation:
            'A pentatónica maior soa aberta e folclórica -- cinco notas, sem meios-tons, sem tensão. É o som de canções à volta da fogueira e melodias celtas. A pentatónica menor soa bluesy e crua -- a espinha dorsal do rock e da guitarra blues. Ambas as escalas pentatónicas são instantaneamente reconhecíveis porque lhes faltam as tensões de meio-tom das escalas diatónicas. As lacunas na escala (4.o e 7.o graus ausentes na pentatónica maior, por exemplo) criam uma qualidade aberta distintiva que nenhuma escala de sete notas tem.',
          tryThisLabel:
            'Ouve a pentatónica -- aberta, folclórica, sem tensão',
        },
        {
          title: 'A Escala de Blues',
          explanation:
            'A escala de blues acrescenta a 5.a bemolizada ("blue note") à pentatónica menor, criando aspereza e expressividade. Essa única nota adicionada transforma uma pentatónica limpa em algo com alma e fluidez. A blue note situa-se entre a 4.a perfeita e a 5.a perfeita -- uma intrusão cromática que cria tensão máxima com ambas as vizinhas. A escala de blues é a espinha dorsal do blues, rock e improvisação jazz, e o seu som é instantaneamente identificável após exposição mesmo breve.',
          tryThisLabel: 'Ouve a escala de blues -- áspera e expressiva',
        },
        {
          title: 'Escalas Simétricas',
          explanation:
            'As escalas de tons inteiros e diminutas são construídas a partir de padrões intervalares repetitivos, dando-lhes uma qualidade sem direção única. A escala de tons inteiros usa apenas tons -- nenhum meio-tom -- produzindo uma qualidade sonhadora, flutuante e não resolvida associada ao impressionismo e bandas sonoras de cinema. A escala diminuta (meio-tom-tom) alterna meios-tons e tons, criando um som tenso e simétrico, um elemento essencial do jazz e do film noir. Ambas as escalas carecem de uma atração tonal clara porque a sua simetria significa que nenhuma nota se sente mais como "casa" do que qualquer outra.',
          tryThisLabel:
            'Ouve tons inteiros -- sonhadora e sem direção',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "C pentatonic scale" e depois "C blues scale" -- a escala de blues acrescenta uma nota (Gb, a blue note). Consegues ouvir a aspereza e tensão adicionadas?',
        },
        {
          instruction:
            'Toca "C whole tone scale" -- repara como cada passo tem o mesmo tamanho. Não há atração para nenhuma nota particular. A escala flutua sem direção',
        },
        {
          instruction:
            'Compara "C minor pentatonic" com "C natural minor scale". A pentatónica remove duas notas (a 2.a e a 6.a), criando lacunas. Essas lacunas dão à pentatónica o seu som aberto característico',
        },
      ],
    },

    // ── U31 M4: Triad Quality Recognition ─────────────────────────────────────
    l9u31m4: {
      title: 'Reconhecimento de Qualidade de Tríades',
      subtitle:
        'Identificar tríades maiores, menores, diminutas e aumentadas de ouvido',
      objectives: [
        'Identificar tríades maiores, menores, diminutas e aumentadas de ouvido',
        'Compreender a distinção de estabilidade: 5.a perfeita (estável) vs. 5.a alterada (instável)',
        'Reconhecer inversões de tríades pelo carácter da nota do baixo',
      ],
      concepts: [
        {
          title: 'Qualidades de Tríades de Ouvido',
          explanation:
            'Maior soa brilhante e assente -- o acorde predefinido, estável. Menor soa sombrio mas ainda apoiado -- mesma estabilidade, cor diferente. Diminuto soa tenso, pequeno e ansioso -- quer mover-se para algum lado. Aumentado soa estranho, suspenso e sem direção -- sem resolução clara. A distinção chave: maior e menor têm ambos uma 5.a perfeita (estabilidade). Diminuto e aumentado têm 5.as alteradas (instabilidade). Treina tocando as quatro qualidades a partir da mesma fundamental e fechando os olhos antes de cada uma.',
          tryThisLabel: 'Ouve diminuto -- tenso, pequeno, ansioso',
        },
        {
          title: 'Tríades Estáveis vs. Instáveis',
          explanation:
            'A 5.a perfeita é o intervalo que proporciona estabilidade a um acorde. Tríades maiores (3.a maior + 5.a perfeita) e tríades menores (3.a menor + 5.a perfeita) contêm-na -- é por isso que soam apoiadas mesmo com cores diferentes. Tríades diminutas substituem a 5.a perfeita por uma 5.a diminuta (meio-tom mais pequena), criando uma qualidade comprimida e ansiosa. Tríades aumentadas substituem-na por uma 5.a aumentada (meio-tom mais larga), criando uma qualidade expandida e não resolvida. Ouvir estável vs. instável é o primeiro filtro -- depois afunila para a qualidade específica.',
          tryThisLabel:
            'Ouve aumentado -- estranho, expandido, não resolvido',
        },
        {
          title: 'Reconhecer Inversões',
          explanation:
            'Quando uma tríade está invertida, a nota do baixo muda o peso e a estabilidade percebidos. A posição fundamental soa apoiada e definitiva -- a fundamental ancora tudo. A primeira inversão soa mais leve e mais melódica -- a 3.a no baixo cria uma sensação menos estável mas fluida. A segunda inversão soa instável -- a 4.a acima do baixo cria tensão que historicamente requer resolução. Treina ouvindo o mesmo acorde em todas as posições e observando como o carácter muda enquanto a qualidade (maior/menor) permanece a mesma.',
          tryThisLabel:
            'Ouve posição fundamental -- apoiada e definitiva',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca as quatro qualidades de tríade a partir de C: "C major chord", "Cm", "Cdim", "Caug". Fecha os olhos e toca de novo -- consegues identificar cada uma apenas pelo som?',
        },
        {
          instruction:
            'Compara "C major chord" com "Cm". A única diferença é uma nota -- E vs. Eb. Esse único meio-tom muda de brilhante para sombrio. Treina esta distinção em várias fundamentais',
        },
        {
          instruction:
            'Toca "Cdim" e depois "Caug" -- ambos têm 5.as alteradas e soam instáveis, mas de maneiras diferentes. Diminuto contrai para dentro (pequeno, ansioso). Aumentado expande para fora (estranho, flutuante)',
        },
      ],
    },

    // ── U31 M5: Seventh Chord Quality Recognition ─────────────────────────────
    l9u31m5: {
      title: 'Reconhecimento de Qualidade de Acordes de Sétima',
      subtitle:
        'Identificar todas as qualidades de acordes de sétima de ouvido -- do caloroso maior com 7.a ao tenso diminuto com 7.a',
      objectives: [
        'Identificar acordes de 7.a maior, 7.a dominante, 7.a menor, meio-diminuto e diminuto de ouvido',
        'Ouvir o acorde menor-maior com 7.a como uma qualidade distinta e inquietante',
        'Distinguir qualidades de acordes de sétima pelo seu carácter emocional e nível de tensão',
      ],
      concepts: [
        {
          title: 'Qualidades de Acordes de Sétima de Ouvido',
          explanation:
            'Seis qualidades distintas de acordes de sétima, cada uma com um carácter emocional único. 7.a maior (Cmaj7): quente, exuberante, balada de jazz. 7.a dominante (C7): tensa, bluesy, exige resolução. 7.a menor (Cm7): suave, macia, descontraída. Meio-diminuto (Cm7b5): sombrio, anelante, film noir. Diminuto (Cdim7): maximamente tenso, cada nota quer mover-se. Menor-maior com 7.a (CmMaj7): misterioso, inquietante -- o choque entre tríade menor e 7.a maior. Treina tocando os seis a partir da mesma fundamental em sequência.',
          tryThisLabel: 'Ouve 7.a maior -- quente e exuberante',
        },
        {
          title: 'A Distinção 7.a Dominante vs. 7.a Maior',
          explanation:
            'A distinção de acordes de sétima mais importante. 7.a maior (Cmaj7) e 7.a dominante (C7) partilham uma tríade maior mas diferem numa nota: B (7.a maior) vs. Bb (7.a menor). Essa diferença de meio-tom transforma o acorde de repouso quente para tensão bluesy. A 7.a dominante exige resolução -- puxa para um acorde uma 5.a abaixo (C7 quer ir para F). A 7.a maior fica contente onde está. Esta distinção é a porta de entrada para ouvir harmonia funcional, porque a 7.a dominante é o motor do movimento harmónico.',
          tryThisLabel:
            'Ouve 7.a dominante -- tensa, bluesy, precisa de mover-se',
        },
        {
          title: 'O Lado Sombrio: Meio-Diminuto e Diminuto',
          explanation:
            'Meio-diminuto (Cm7b5) e diminuto (Cdim7) são as qualidades de acordes de sétima mais sombrias. O meio-diminuto combina uma tríade diminuta com uma 7.a menor -- soa anelante, instável e cinemático. O diminuto empilha 3.as menores simetricamente -- é maximamente tenso, com cada nota equidistante e cada nota querendo resolver. A distinção: o meio-diminuto tem um intervalo "normal" (a 7.a menor a partir da fundamental) que lhe dá um toque de calidez. O diminuto é uniformemente comprimido e tenso ao longo de toda a estrutura. No jazz, o meio-diminuto é o acorde ii em tonalidades menores; o diminuto é um acorde de passagem ou substituto do dominante.',
          tryThisLabel:
            'Ouve meio-diminuto -- sombrio e anelante',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca estes acordes de sétima em sequência: "Cmaj7", "C7", "Cm7", "Cm7b5", "Cdim7". Cada um tem uma assinatura emocional distinta. Descreve o que sentes em cada um',
        },
        {
          instruction:
            'Compara "Cmaj7" (quente, resolvido) com "C7" (tenso, precisa de mover-se). A única diferença é uma nota -- B vs. Bb. Esse único meio-tom muda o carácter inteiro',
        },
        {
          instruction:
            'Toca "Cm7" e depois "Cm7b5". A 7.a menor é suave e macia. O meio-diminuto é mais sombrio e anelante -- a 5.a baixada acrescenta instabilidade. Esta distinção importa no jazz e na condução de vozes clássica',
        },
      ],
    },

    // ── U32 M1: Melodic Dictation Diatonic ────────────────────────────────────
    l9u32m1: {
      title: 'Ditado Melódico: Diatónico',
      subtitle:
        'Transcrever melodias diatónicas curtas de ouvido -- movimento por graus e triádico',
      objectives: [
        'Transcrever melodias diatónicas curtas de ouvido usando um processo sistemático',
        'Aplicar a estratégia "enquadramento primeiro": identificar tonalidade, compasso e cadência antes de escrever notas',
        'Lidar com movimento por graus e saltos triádicos (contornos de acorde como C-E-G) em tonalidades maiores',
      ],
      concepts: [
        {
          title: 'O Processo de Ditado',
          explanation:
            'O ditado melódico segue um processo sistemático -- apressar-se a escrever notas imediatamente é o erro mais comum. Primeira audição: capta a forma geral, a tonalidade e o compasso. Identifica a tónica encontrando a nota que soa como "casa" -- normalmente a nota final. Segunda audição: foca nas primeiras notas e nas últimas notas. Terceira audição: preenche o meio, construindo frase a frase. Começa sempre pelo ritmo e contorno (a forma de sobe-e-desce), depois afina para alturas exatas. Verifica o teu trabalho: a transcrição faz sentido musical?',
          tryThisLabel:
            'Toca uma escala de referência para ancorar a tonalidade',
        },
        {
          title: 'Estratégia do Enquadramento Primeiro',
          explanation:
            'Antes de escrever uma única nota, estabelece o enquadramento que restringe as tuas escolhas. Identifica a tonalidade ouvindo a tónica -- a nota de repouso e resolução. Bate o tempo para encontrar o compasso (está em 2, 3 ou 4?). Ouve a cadência no final -- resolve conclusivamente (cadência autêntica) ou deixa-te em suspenso (meia cadência)? Depois preenche notas, começando pelo ritmo e direção geral. O enquadramento elimina respostas erradas antes de começares, tornando o trabalho de detalhe muito mais fácil.',
          tryThisLabel:
            'Ouve o acorde de tónica -- o teu ponto de ancoragem',
        },
        {
          title: 'Contorno Antes da Altura',
          explanation:
            'Contorno é a forma de uma melodia -- o seu padrão de subidas e descidas -- sem especificar intervalos exatos. Antes de tentares nomear alturas específicas, desenha o contorno: a melodia sobe, desce, faz arco ou mantém-se? Uma melodia em arco (sobe depois desce) é a forma mais comum. Uma melodia que desce ao longo de toda a duração é menos comum e soa como se estivesse a assentar. O contorno é o esqueleto do ditado. Se o teu contorno estiver errado, as tuas alturas estarão erradas por mais cuidadosamente que ouças. Acerta sempre a forma primeiro, depois preenche as notas exatas.',
          tryThisLabel:
            'Toca G maior -- o contorno ascendente mais simples',
        },
      ],
      tasks: [
        {
          instruction:
            'Pede a um amigo que toque 4-5 notas aleatórias da escala de C maior no piano. Tenta cantá-las de volta e depois encontrá-las no teclado. Começa apenas com movimento por graus',
        },
        {
          instruction:
            'Ouve uma melodia curta e identifica primeiro apenas o contorno -- sobe, desce, mantém-se ou faz arco? O contorno é o esqueleto do ditado e deve vir sempre antes das alturas exatas',
        },
        {
          instruction:
            'Pratica identificar a última nota de uma melodia -- é a tónica? Se sim, a melodia termina com resolução. Se não, soa inacabada. Esta única observação estabelece a tonalidade',
        },
      ],
    },

    // ── U32 M2: Melodic Dictation Chromatic ───────────────────────────────────
    l9u32m2: {
      title: 'Ditado Melódico: Cromático',
      subtitle:
        'Transcrever melodias com notas cromáticas de passagem, notas de vizinhança e dominantes secundárias',
      objectives: [
        'Reconhecer notas cromáticas de passagem e de vizinhança dentro de melodias diatónicas',
        'Ouvir o efeito de dominantes secundárias em linhas melódicas -- sensíveis emprestadas',
        'Progredir em níveis de dificuldade desde ornamentação cromática até ditado a duas vozes',
      ],
      concepts: [
        {
          title: 'Ornamentação Cromática',
          explanation:
            'Notas cromáticas de passagem e de vizinhança são notas fora da tonalidade que ligam ou decoram notas diatónicas. Uma nota cromática de passagem preenche o intervalo entre duas notas diatónicas a um tom de distância -- por exemplo, C a C# a D em C maior. Uma nota cromática de vizinhança sai da tonalidade e regressa imediatamente -- D a D# a D. Estas notas criam cor e tensão sem mudar a tonalidade. O desafio de treino auditivo é distinguir ornamentações cromáticas (desvios temporários) de modulações reais (mudanças permanentes de tonalidade). Se a nota resolve por grau de volta à tonalidade, é provavelmente uma ornamentação.',
          tryThisLabel:
            'Toca o enquadramento diatónico -- depois imagina preenchimento cromático',
        },
        {
          title: 'Dominantes Secundárias em Melodias',
          explanation:
            'Quando uma melodia introduz brevemente uma nota fora da tonalidade que funciona como sensível de um acorde diatónico, estás a ouvir a influência de uma dominante secundária. Em C maior, um F# pode aparecer como sensível de G (a dominante) -- puxa fortemente para G da mesma forma que B puxa para C. No ditado, estas sensíveis emprestadas são identificáveis porque resolvem por meio-tom ascendente para uma nota diatónica. Ouvir F# resolver para G numa melodia em C maior é uma pista de dominante secundária: V/V (quinto do quinto). Esta é a ponte entre ditado diatónico e cromático.',
          tryThisLabel:
            'Ouve G7 -- a sensível B puxa para C',
        },
        {
          title: 'Progressão de Dificuldade',
          explanation:
            'O ditado cromático escala em níveis claros. Nível 1: notas cromáticas de passagem entre notas diatónicas (C-C#-D). Nível 2: notas cromáticas de vizinhança (D-D#-D). Nível 3: sensíveis secundárias resolvendo por meio-tom ascendente (F#-G em C maior). Nível 4: sequências cromáticas onde um padrão diatónico é transposto cromaticamente. Nível 5: ditado a duas vozes com elementos cromáticos em ambas. Nunca saltes níveis -- cada um constrói sobre o anterior. Em cada etapa, mantém pelo menos 80 porcento de precisão antes de avançar.',
          tryThisLabel:
            'Ouve menor -- o ditado torna-se mais difícil com 6.o e 7.o graus variáveis',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca a escala de C maior lentamente, depois insere uma nota cromática de passagem entre D e E (toca D-D#-E). Agora experimenta C-C#-D. Ouve como a nota cromática cria cor momentânea sem perturbar a tonalidade',
        },
        {
          instruction:
            'Num contexto de C maior, toca a sequência E-F#-G. O F# é uma sensível secundária de G. Soa como uma tonicização temporária -- G torna-se brevemente o centro de gravidade antes de C se reafirmar',
        },
        {
          instruction:
            'Ouve qualquer melodia com atenção plena e marca momentos em que uma nota soa "fora" da tonalidade. Resolve por grau? Se sim, é provavelmente uma ornamentação cromática. Se não, considera se a tonalidade mudou',
        },
      ],
    },

    // ── U32 M3: Harmonic Dictation ────────────────────────────────────────────
    l9u32m3: {
      title: 'Ditado Harmónico: Cadências e Progressões',
      subtitle:
        'Identificar cadências, transcrever progressões e ditado de linha de baixo',
      objectives: [
        'Identificar tipos de cadência (autêntica, plagal, meia, deceptiva) de ouvido',
        'Transcrever progressões diatónicas de quatro acordes usando numeração romana',
        'Realizar ditado de linha de baixo como porta de entrada para transcrição harmónica completa',
      ],
      concepts: [
        {
          title: 'Ouvir a Linha de Baixo',
          explanation:
            'A linha de baixo é a porta de entrada para o ditado harmónico. A nota do baixo define o acorde mais do que qualquer outra voz -- diz-te a fundamental (ou a inversão). Treina ouvindo progressões de acordes e cantando apenas as notas do baixo. Se conseguires acompanhar o baixo com precisão, estás a maior parte do caminho para identificar a harmonia. Acordes em posição fundamental têm a relação baixo-acorde mais clara. Inversões requerem que ouças a nota do baixo como não-fundamental e depois infiras o acorde real acima dela.',
          tryThisLabel:
            'Ouve a nota do baixo -- ancora o acorde',
        },
        {
          title: 'Reconhecimento de Cadências',
          explanation:
            'Cadências são a pontuação da música -- aprende a ouvi-las antes de abordar progressões completas. A cadência autêntica (V-I) soa final e conclusiva -- um ponto final. A cadência plagal (IV-I) soa mais suave e quente -- como "Amen." A meia cadência (terminando em V) soa incompleta -- um ponto de interrogação. A cadência deceptiva (V-vi) surpreende: esperas resolução para I mas aterras em vi. Identificar a cadência no final de uma frase dá-te dois acordes imediatamente e ancora a tonalidade.',
          tryThisLabel: 'Ouve V (G) -- puxa para C (I)?',
        },
        {
          title: 'Processo de Ditado de Progressões',
          explanation:
            'O ditado harmónico completo segue um processo sistemático. Passo 1: ouve a tonalidade -- identifica o acorde de tónica e a cadência. Passo 2: acompanha a linha de baixo -- as notas do baixo delineiam o movimento harmónico. Passo 3: identifica a qualidade do acorde em cada mudança de nota do baixo -- é maior, menor ou diminuto? Passo 4: atribui numeração romana com base no grau da escala de cada nota do baixo. Passo 5: verifica a coerência -- o ritmo harmónico (taxa de mudança de acorde) faz sentido? Começa com cadências de dois acordes e avança para progressões de quatro acordes.',
          tryThisLabel:
            'Vê os acordes diatónicos disponíveis em C maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Ouve música que conheces bem e tenta identificar as cadências. Cada frase termina com um forte V-I (autêntica)? Um suave IV-I (plagal)? Ou uma meia cadência não resolvida terminando em V?',
        },
        {
          instruction:
            'Pratica ditado de linha de baixo separadamente da análise harmónica completa -- canta ou trauteia a nota mais grave que ouves em cada acorde de uma progressão. O baixo é sempre o teu ponto de partida',
        },
        {
          instruction:
            'Começa com cadências de dois acordes: toca pares aleatórios de V-I e IV-I em diferentes tonalidades no piano. Consegues dizer que tipo de cadência é antes de verificar? Depois acrescenta cadências deceptivas (V-vi)',
        },
      ],
    },

    // ── U32 M4: Sight Singing Fundamentals ────────────────────────────────────
    l9u32m4: {
      title: 'Fundamentos de Leitura à Primeira Vista',
      subtitle:
        'Solfejo móvel para leitura à primeira vista em tonalidades maiores e menores',
      objectives: [
        'Usar solfejo móvel (do-re-mi-fa-sol-la-ti) para leitura à primeira vista em tonalidades maiores',
        'Aplicar sílabas de solfejo cromático para tonalidades menores: me, le, te para graus baixados',
        'Seguir um processo sistemático de leitura à primeira vista: tonalidade, extensão, padrões, depois cantar',
      ],
      concepts: [
        {
          title: 'Solfejo Móvel',
          explanation:
            'No solfejo móvel, "do" representa sempre a tónica da tonalidade atual -- independentemente de que nota seja. C maior: do=C. G maior: do=G. Bb maior: do=Bb. Isto mapeia sílabas à função, não à altura absoluta. "Sol" soa sempre como dominante, "ti" soa sempre como a sensível puxando para "do." Esta é a abordagem Kodaly/Berklee, e os seus defensores argumentam que treina a audição funcional de forma mais direta -- aprendes a ouvir relações, não apenas nomes de notas. O solfejo fixo (onde do é sempre C), o padrão nos conservatórios de muitos países incluindo França e Itália, constrói em vez disso a associação de altura absoluta -- ambos os sistemas são amplamente usados.',
          tryThisLabel: 'Canta junto: do-re-mi-fa-sol-la-ti-do',
        },
        {
          title: 'Solfejo Cromático para Tonalidades Menores',
          explanation:
            'Tonalidades menores requerem sílabas modificadas para os graus baixados. No menor baseado em do: 3.a b = "me," 6.a b = "le," 7.a b = "te." Menor natural torna-se: do-re-me-fa-sol-le-te-do. Menor harmónica eleva o 7.o de volta a "ti": do-re-me-fa-sol-le-ti-do. Menor melódica ascendente eleva ambos: do-re-me-fa-sol-la-ti-do. Para alterações cromáticas: sustenidos ascendentes usam -i (di, ri, fi, si, li); bemóis descendentes usam vogais modificadas (ra, me, se, le, te). Estas sílabas tornam os graus alterados explícitos quando cantas.',
          tryThisLabel:
            'Canta: do-re-me-fa-sol-le-te-do (menor baseado em la, um sistema alternativo comum na prática Kodaly: la-ti-do-re-mi-fa-sol)',
        },
        {
          title: 'Processo de Leitura à Primeira Vista',
          explanation:
            'Antes de cantar uma única nota, segue um checklist. (1) Identifica a armação de clave e a indicação de compasso. (2) Procura as notas mais aguda e mais grave para saber os requisitos de extensão vocal. (3) Procura padrões -- escalas, arpejos, motivos repetidos, sequências. (4) Define um andamento suficientemente lento para manter precisão (a velocidade desenvolve-se naturalmente com a prática). (5) Canta mantendo um pulso regular acima de tudo. Uma nota errada a um tempo regular é melhor que uma nota certa com ritmo quebrado. O pulso é o esqueleto; as alturas são a carne.',
          tryThisLabel:
            'Lê à primeira vista G maior: do começa em G',
        },
      ],
      tasks: [
        {
          instruction:
            'Canta a escala maior usando sílabas de solfejo: do-re-mi-fa-sol-la-ti-do. Começa em qualquer altura confortável. Depois desce: do-ti-la-sol-fa-mi-re-do. Mantém um tempo regular ao longo',
        },
        {
          instruction:
            'Agora canta menor natural usando solfejo baseado em do: do-re-me-fa-sol-le-te-do. Repara nas três sílabas baixadas -- "me," "le," e "te" -- estes são os três graus que diferem do maior',
        },
        {
          instruction:
            'Pratica padrões de arpejo simples: do-mi-sol (arpejo maior), do-me-sol (arpejo menor), sol-ti-re (arpejo dominante). Canta estes em pelo menos três tonalidades diferentes para internalizares a função, não a altura absoluta',
        },
      ],
    },

    // ── U32 M5: Contextual Listening ──────────────────────────────────────────
    l9u32m5: {
      title: 'Audição Contextual',
      subtitle:
        'Identificar textura, forma, instrumentos e períodos estilísticos de ouvido',
      objectives: [
        'Identificar textura musical: monofónica, homofónica, polifónica e homorítmica',
        'Reconhecer estruturas formais de ouvido: binária, ternária, rondó e estrofe-refrão',
        'Atribuir música a períodos estilísticos históricos por traços sonoros característicos',
      ],
      concepts: [
        {
          title: 'Identificação de Textura',
          explanation:
            'A textura musical descreve quantas vozes estão presentes e como se relacionam entre si. Monofonia é uma linha única sem acompanhamento -- limpa e exposta, como uma melodia de flauta a solo. Homofonia é uma melodia com harmonia de suporte por baixo -- a textura mais comum na música ocidental (pensa num cantor com acordes de guitarra). Polifonia tem múltiplas melodias independentes a acontecer simultaneamente -- densa e complexa, como uma fuga de Bach. Homoritmia é um caso especial onde todas as vozes se movem no mesmo ritmo, como um coral. Aprender a ouvir textura é aprender a ouvir como a música está organizada verticalmente.',
          tryThisLabel:
            'Um acorde é textura homofónica em miniatura',
        },
        {
          title: 'Forma de Ouvido',
          explanation:
            'Ouvir forma significa acompanhar repetição e contraste ao longo do tempo. Quando o material regressa, rotula-o "A." Quando material novo aparece, rotula-o "B." Forma binária é AB (duas secções contrastantes). Ternária é ABA (partida e regresso). Rondó alterna um tema recorrente com episódios contrastantes: ABACA. Estrofe-refrão é o equivalente pop de secções alternadas. Ouve os limites seccionais -- cadências, pausas, mudanças de tonalidade e mudanças de textura ou dinâmica sinalizam divisões formais. A competência é a capacidade de atenção: tens de manter a primeira secção em memória para reconhecer o seu regresso.',
          tryThisLabel:
            'Explora G maior -- a maioria das formas começa e termina na tonalidade de casa',
        },
        {
          title: 'Reconhecimento de Período Estilístico',
          explanation:
            'Cada era histórica tem sons característicos que podes aprender a identificar. Barroco (1600-1750): motor rítmico contínuo, baixo contínuo, melodias ornamentais, dinâmicas em terraços (mudanças súbitas forte/piano). Clássico (1750-1820): frases equilibradas de 4 e 8 compassos, padrões de baixo de Alberti, cadências claras, simplicidade elegante. Romântico (1820-1900): orquestras expandidas, harmonia cromática, melodias longas e amplas, extensão dinâmica extrema. Século XX (1900-2000): dissonância como recurso primário, timbres novos, complexidade rítmica, experimentação formal. Cada período constrói sobre e reage contra o anterior.',
          tryThisLabel:
            'Menor harmónica -- um clássico do Barroco e do Clássico',
        },
      ],
      tasks: [
        {
          instruction:
            'Ouve uma peça musical e identifica a textura. Há uma melodia única sem acompanhamento (monofonia), uma melodia com acordes (homofonia), ou múltiplas melodias entrecruzadas (polifonia)?',
        },
        {
          instruction:
            'Escolhe uma canção que conheças bem e mapeia a sua forma. Rotula secções A, B, C. É estrofe-refrão (AB alternado)? ABA (partida e regresso)? Sem repetição a larga escala (through-composed)?',
        },
        {
          instruction:
            'Ouve música orquestral e identifica primeiro as famílias de instrumentos: cordas vs. metais vs. madeiras vs. percussão. Depois afunila para instrumentos específicos dentro de cada família -- violino vs. violoncelo, trompete vs. trombone, flauta vs. clarinete',
        },
      ],
    },
  },
};

export default curriculumL9;
