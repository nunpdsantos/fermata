import type { CurriculumLevelOverlay } from '../types';

const curriculumL9: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    u30: {
      title: 'Treino de Altura e Intervalos',
      description:
        'Correspondencia de altura, direcao melodica, reconhecimento maior/menor e identificacao completa de intervalos de ouvido',
    },
    u31: {
      title: 'Competencias de Escalas, Acordes e Ditado',
      description:
        'Reconhecimento de escalas e modos, identificacao de qualidades de triades e acordes de setima de ouvido',
    },
    u32: {
      title: 'Ditado, Leitura a Primeira Vista e Audicao Contextual',
      description:
        'Ditado melodico e harmonico, solfejo movel para leitura a primeira vista e audicao critica de textura, forma e estilo',
    },
  },

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: {
    // ── U30 M1: Pitch Matching and Direction ──────────────────────────────────
    l9u30m1: {
      title: 'Correspondencia de Altura e Direcao',
      subtitle:
        'Corresponder alturas de ouvido, identificar direcao melodica e perceber diferencas de registo',
      objectives: [
        'Corresponder alturas cantando ou identificando notas no piano',
        'Reconhecer movimento melodico ascendente vs. descendente em diferentes registos',
        'Distinguir registo agudo de registo grave e perceber a colocacao relativa de registo',
      ],
      concepts: [
        {
          title: 'Correspondencia de Altura',
          explanation:
            'A competencia aural mais fundamental e ouvir uma nota e reproduzi-la -- cantando ou encontrando-a num instrumento. Comeca com notas isoladas no registo medio (perto do Do central), depois expande para fora. Treina tocando uma nota no piano e tentando encontra-la de novo com os olhos fechados. Isto constroi a ligacao interna ouvido-mao que sustenta todo o treino auditivo posterior. O objetivo nao e ouvido absoluto (que e em grande parte inato) mas ouvido relativo fiavel -- ouvir uma nota em relacao a uma referencia.',
          tryThisLabel: 'Toca a escala de C maior como referencia de altura',
        },
        {
          title: 'Direcao do Movimento',
          explanation:
            'Consegues dizer se uma melodia sobe, desce ou se mantem? Isto e mais intuitivo do que parece -- mas tornar o julgamento consciente e preciso e o objetivo. Toca duas notas em sequencia e identifica a direcao. Movimento ascendente vai para altura mais aguda; descendente vai para mais grave. Comeca com saltos amplos (uma oitava de distancia) e estreita progressivamente ate conseguires detetar movimento de um unico meio-tom. Isto treina a percecao de contorno que vais precisar para o ditado melodico mais tarde.',
          tryThisLabel: 'Ouve movimento por graus ascendentes',
        },
        {
          title: 'Percecao de Registo',
          explanation:
            'Agudo vs. grave e sempre relativo: o "agudo" de um clarinete baixo e o "grave" de uma flauta. Percecao de registo significa identificar se uma nota se situa na zona superior, media ou inferior da extensao do instrumento. No piano, a oitava mais grave tem uma qualidade profunda e retumbante; as oitavas medias soam claras e equilibradas; a oitava mais aguda e brilhante e fina. Treina tocando notas ao longo de toda a extensao e identificando em que regiao de oitava se encontram sem olhar. Esta audicao espacial e essencial para compreender voicings orquestrais e arranjos.',
          tryThisLabel:
            'Toca A maior -- depois experimenta noutra oitava',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "C major scale" e toca no piano. Tenta cantar cada nota a medida que a ouves -- corresponde a tua voz a altura. Comeca num registo confortavel',
        },
        {
          instruction:
            'Toca notas individuais no piano com os olhos fechados -- consegues dizer se a segunda nota e mais aguda ou mais grave que a primeira? Comeca com saltos amplos, depois estreita ate teclas adjacentes',
        },
        {
          instruction:
            'Toca uma nota no registo grave, depois a mesma nota duas oitavas acima. Ouve como a qualidade muda mas a identidade da nota permanece. Isto e percecao de registo',
        },
      ],
    },

    // ── U30 M2: Major vs Minor Recognition ────────────────────────────────────
    l9u30m2: {
      title: 'Reconhecimento Maior vs. Menor',
      subtitle:
        'Distinguir tonalidade maior e menor de ouvido -- acordes, escalas e cor geral',
      objectives: [
        'Distinguir triades maiores de menores de ouvido -- brilhante/aberto vs. sombrio/melancólico',
        'Reconhecer tonalidade maior vs. menor em escalas e melodias curtas',
        'Desenvolver reconhecimento instintivo imediato antes da explicacao teorica',
      ],
      concepts: [
        {
          title: 'Acordes Maiores vs. Menores',
          explanation:
            'O reconhecimento de qualidade mais basico no treino auditivo. Acordes maiores soam brilhantes, abertos e resolvidos. Acordes menores soam sombrios, melancolicos e introspetivos. A explicacao teorica -- a diferenca esta no terceiro grau, elevado ou baixado meio-tom -- e secundaria nesta fase. Treina tocando acordes maiores e menores lado a lado a partir da mesma fundamental ate a distincao se tornar instantanea e automatica. Isto e um sentimento visceral primeiro, compreensao intelectual depois.',
          tryThisLabel: 'Ouve maior -- depois experimenta "C minor chord"',
        },
        {
          title: 'Tonalidade Maior vs. Menor',
          explanation:
            'Para la de acordes individuais, tonalidades e melodias inteiras tem caracter maior ou menor. Uma melodia em C maior soa brilhante e assente; o mesmo contorno em C menor soa mais sombrio e introspetivo. Ouve a cor emocional geral em vez de analisares notas individuais. Toca a escala de C maior seguida da escala de C menor natural -- a mudanca de atmosfera e inconfundivel. Este reconhecimento de tonalidade e a base para todo o treino auditivo de qualidade posterior.',
          tryThisLabel:
            'Ouve a tonalidade menor -- compara com a escala de C maior',
        },
        {
          title: 'Treinar o Julgamento Instantaneo',
          explanation:
            'O objetivo do reconhecimento maior/menor nao e analise, mas reflexo. Deves ouvir a qualidade antes de a tua mente consciente a nomear. Isto requer repeticao: toca acordes maiores e menores aleatorios a partir de diferentes fundamentais e identifica a qualidade o mais rapido possivel. A velocidade importa porque a musica real nao faz pausa para analisares. Experimenta fundamentais menos familiares -- Ab, Db, F# -- onde a tua familiaridade com o instrumento nao pode ajudar. Quando conseguires identificar maior vs. menor em menos de um segundo a partir de qualquer fundamental, a competencia esta internalizada.',
          tryThisLabel:
            'Experimenta maior a partir de uma fundamental menos familiar -- continua brilhante?',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "C major chord" e depois "C minor chord" um atras do outro. Qual soa brilhante? Qual soa sombrio? Repete ate a distincao ser instantanea',
        },
        {
          instruction:
            'Toca "G major chord" e depois "Gm" -- mesmo exercicio, fundamental diferente. A diferenca de qualidade deve transferir-se independentemente da nota inicial',
        },
        {
          instruction:
            'Toca "C major scale" e depois "C natural minor scale". Ouve a mudanca de cor geral. Consegues sentir a mudanca de atmosfera antes da escala estar a meio?',
        },
      ],
    },

    // ── U30 M3: Interval Recognition P1-P5 ────────────────────────────────────
    l9u30m3: {
      title: 'Reconhecimento de Intervalos: P1-P5',
      subtitle:
        'Identificar intervalos perfeitos e pequenos de ouvido usando associacoes com cancoes e reconhecimento direto',
      objectives: [
        'Identificar unissono, 2.a menor, 2.a maior, 3.a menor, 3.a maior, 4.a perfeita, tritono e 5.a perfeita de ouvido',
        'Usar associacoes com cancoes como auxiliares mnemonicos para cada intervalo',
        'Reconhecer estes intervalos tanto ascendentes como descendentes',
      ],
      concepts: [
        {
          title: 'Associacoes com Cancoes: Intervalos Pequenos',
          explanation:
            'Uma tecnica mnemonica comprovada: associar cada intervalo com o inicio de uma melodia familiar. 2.a menor ascendente = tema de Tubarao. 2.a maior = Parabens a Voce. 3.a menor = Greensleeves. 3.a maior = When the Saints (oh-when). 4.a perfeita = Marcha Nupcial. Tritono = The Simpsons (The-Simp). 5.a perfeita = Brilha Brilha Estrelinha. Estas sao rodinhas de treino -- o objetivo e internalizar o som de cada intervalo diretamente e depois abandonar a muleta. Comeca apenas com intervalos ascendentes, depois acrescenta descendentes quando os ascendentes estiverem solidos.',
          tryThisLabel:
            'Toca C maior -- ouve cada intervalo a partir da fundamental',
        },
        {
          title: 'Consonancia Perfeita vs. Imperfeita',
          explanation:
            'Os intervalos deste modulo dividem-se em duas familias. Consonancias perfeitas (P1, P4, P5) soam "abertas" e "ocas" -- como um sino ou uma corda solta. Tem uma qualidade austera e despojada. Consonancias imperfeitas (3.a m, 3.a M) soam "quentes" e "fundidas" -- as notas combinam-se suavemente mas com mais cor. Segundas (2.a m, 2.a M) sao dissonancias -- soam "asperas" ou "crocantes" quando tocadas em simultaneo. O tritono e o intervalo mais dissonante de todos -- tenso, instavel e exigindo resolucao. Aprender a categorizar por consonancia/dissonancia e mais rapido do que memorizar cada intervalo individualmente.',
          tryThisLabel:
            'Ouve a 3.a maior (C a E) e a 5.a perfeita (C a G)',
        },
        {
          title: 'Ascendente vs. Descendente',
          explanation:
            'Cada intervalo tem um caracter diferente ascendente vs. descendente. A 2.a menor ascendente soa tensa e rastejante. A 2.a menor descendente soa suspirante e resolutiva. A 4.a perfeita ascendente soa como uma fanfarra. A 4.a perfeita descendente soa assente e cadencial. Tens de treinar ambas as direcoes independentemente -- saber identificar uma 5.a perfeita ascendente nao significa automaticamente que a consegues identificar descendente. Usa tambem associacoes com cancoes descendentes: 2.a M descendente = Mary Had a Little Lamb (primeiras duas notas), 3.a m descendente = Hey Jude (hey-Jude). Constroi o conjunto descendente como uma competencia separada.',
          tryThisLabel: 'Ouve o tritono dentro de C7 (E a Bb)',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "C major chord" -- o intervalo de C a E e uma 3.a maior, e de C a G e uma 5.a perfeita. Canta os dois intervalos separadamente. Memoriza cada som',
        },
        {
          instruction:
            'Toca pares de notas no piano a partir de C: C-Db (2.a m), C-D (2.a M), C-Eb (3.a m), C-E (3.a M), C-F (4.a P), C-Gb (tritono), C-G (5.a P). Nomeia cada um antes de verificar',
        },
        {
          instruction:
            'Escreve "C7" -- encontra o tritono (E a Bb). Este e o intervalo mais instavel. Contrasta-o com a 5.a perfeita (C a G) em "C major chord". Estavel vs. tenso -- ouve a diferenca',
        },
      ],
    },

    // ── U30 M4: Interval Recognition m6-P8 ────────────────────────────────────
    l9u30m4: {
      title: 'Reconhecimento de Intervalos: 6.a m-P8',
      subtitle:
        'Identificar intervalos amplos de ouvido -- sextas, setimas e a oitava',
      objectives: [
        'Identificar 6.a menor, 6.a maior, 7.a menor, 7.a maior e oitava perfeita de ouvido',
        'Usar associacoes com cancoes para intervalos amplos, ascendentes e descendentes',
        'Combinar com o conhecimento de intervalos pequenos para reconhecimento completo de intervalos simples',
      ],
      concepts: [
        {
          title: 'Associacoes com Cancoes: Intervalos Amplos',
          explanation:
            'Continuando a abordagem mnemonica para a metade superior da oitava. 6.a menor = The Entertainer. 6.a maior = My Bonnie (my-bon). 7.a menor = Somewhere (West Side Story). 7.a maior = Take On Me (take-on). Oitava = Somewhere Over the Rainbow. Intervalos amplos sao mais dificeis de identificar porque parecem "grandes saltos" e as diferencas de tamanho entre eles sao proporcionalmente menores. As sextas e setimas sao particularmente arduas -- sao inversoes de tercas e segundas, portanto o seu caracter esta relacionado mas e mais largo. Treina contrastando pares: 6.a m vs. 6.a M, 7.a m vs. 7.a M.',
          tryThisLabel: 'Ouve o intervalo de 7.a maior (C a B)',
        },
        {
          title: 'Intervalos Amplos Descendentes',
          explanation:
            'Os intervalos descendentes soam diferentes dos ascendentes mesmo que a distancia seja igual. Uma 5.a perfeita descendente (G descendo para C) soa como resolucao ou aterragem. Uma 6.a maior descendente soa quente e nostalgica. Setimas descendentes soam dramaticas e amplas. Treina intervalos descendentes separadamente -- muitos estudantes que dominam intervalos ascendentes debatem-se com os descendentes. Usa associacoes com cancoes descendentes: 5.a P descendente = Flintstones (Flint-stones), 3.a m descendente = Hey Jude (hey-Jude). Constroi o conjunto descendente como competencia propria.',
          tryThisLabel:
            'Toca C maior descendente -- ouve os intervalos ao contrario',
        },
        {
          title: 'Relacoes de Inversao de Intervalos',
          explanation:
            'Intervalos amplos sao inversoes de intervalos pequenos: uma 6.a maior e uma 3.a menor invertida, uma 7.a menor e uma 2.a maior invertida, uma 7.a maior e uma 2.a menor invertida. Isto significa que o seu "sabor" esta relacionado -- uma 3.a menor e uma 6.a maior partilham calor, uma 2.a maior e uma 7.a menor partilham uma qualidade bluesy. Se ouves um intervalo amplo e nao o consegues identificar diretamente, tenta inverte-lo mentalmente: soa como uma 3.a menor invertida? Entao e uma 6.a maior. Esta tecnica de referencia cruzada acelera a aprendizagem de intervalos amplos.',
          tryThisLabel:
            'Ouve a 7.a menor (C a Bb) -- inversao de uma 2.a maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "Cmaj7" -- o intervalo exterior de C a B e uma 7.a maior. Agora toca C a Bb (7.a menor). A diferenca e meio-tom, mas o caracter muda de tensao brilhante para atracao bluesy',
        },
        {
          instruction:
            'Toca C a Ab (6.a m) e depois C a A (6.a M) no piano. A 6.a menor soa mais sombria e pungente. A 6.a maior soa mais quente e aberta. Repete a partir de diferentes fundamentais ate as conseguires distinguir com fiabilidade',
        },
        {
          instruction:
            'Toca C ate ao C agudo (oitava). A oitava soa como "a mesma nota, altura diferente." Agora contrasta com C a B (7.a M) -- quase uma oitava, mas com tensao. Essa qualidade de quase-la e a assinatura da 7.a maior',
        },
      ],
    },

    // ── U30 M5: Harmonic Intervals and Compounds ──────────────────────────────
    l9u30m5: {
      title: 'Intervalos Harmonicos e Compostos',
      subtitle:
        'Reconhecimento de intervalos simultaneos e intervalos compostos alem da oitava',
      objectives: [
        'Ouvir intervalos quando ambas as notas tocam simultaneamente (intervalos harmonicos)',
        'Distinguir intervalos harmonicos consonantes de dissonantes pela qualidade sonora',
        'Reconhecer intervalos compostos (9.as, 10.as, 11.as) como versoes mais largas de intervalos simples',
      ],
      concepts: [
        {
          title: 'Intervalos Harmonicos',
          explanation:
            'Ouvir intervalos quando ambas as notas tocam simultaneamente e mais dificil do que intervalos melodicos (sequenciais) porque os sons fundem-se. Consonancias perfeitas (5.a P, 8.a P) soam "abertas" e "ocas." Consonancias imperfeitas (3.as, 6.as) soam "quentes" e "fundidas." Dissonancias (2.as, 7.as, tritono) soam "asperas" ou "tensas." Aprende primeiro intervalos melodicos, depois transita para harmonicos. A distincao de qualidade -- consonante vs. dissonante -- e a tua pista principal quando as notas soam simultaneamente.',
          tryThisLabel: 'Ouve B contra C -- um intervalo de 7.a maior',
        },
        {
          title: 'Intervalos Compostos',
          explanation:
            'Apos dominar intervalos simples (dentro de uma oitava), expande para intervalos compostos que ultrapassam a oitava. Uma 9.a = oitava + 2.a. Uma 10.a = oitava + 3.a. Uma 11.a = oitava + 4.a. Uma 13.a = oitava + 6.a. Os intervalos compostos soam como os seus equivalentes simples mas "mais largos" e mais espacosos. As regras de qualidade transferem-se: uma 9.a maior tem a mesma qualidade que uma 2.a maior. Ouves estes constantemente em acordes de jazz estendidos -- a 9.a num Cmaj9 e a nota D uma oitava acima da fundamental.',
          tryThisLabel: 'Ouve o tritono dentro de C7 (E a Bb)',
        },
        {
          title: 'Exercicios de Velocidade e Fluencia',
          explanation:
            'O reconhecimento de intervalos so e util se for rapido. Na musica real, as notas passam depressa -- nao tens tempo para deliberar. O objetivo e passar de "analisar, depois nomear" para "ouvir e saber instantaneamente." Treina com exercicios cronometrados: toca duas notas aleatorias e identifica o intervalo em tres segundos. Acompanha a precisao ao longo das sessoes. Comeca com um conjunto restrito (apenas intervalos perfeitos, ou apenas consonancias) e expande quando a precisao ultrapassar 80 porcento. Misturar apresentacoes melodicas, harmonicas, ascendentes e descendentes no mesmo exercicio constroi reconhecimento robusto e independente do contexto.',
          tryThisLabel:
            'Ouve tres intervalos de uma vez -- 5.a P, 3.a M e 3.a m',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca duas notas simultaneamente no piano: C e E (3.a M), C e G (5.a P), C e B (7.a M). Ouve como se fundem de forma diferente. Consonancias misturam-se; dissonancias criam batimentos e aspereza',
        },
        {
          instruction:
            'Escreve "Cmaj7" e ouve todos os intervalos harmonicos dentro dele: C-E (3.a M), C-G (5.a P), C-B (7.a M), E-G (3.a m), E-B (5.a P), G-B (3.a M). Um unico acorde contem muitos intervalos simultaneos',
        },
        {
          instruction:
            'Toca C3 e D4 no piano (uma 9.a). Compara com C4 e D4 (uma 2.a). A 9.a soa como uma versao mais larga e espacosa da 2.a. Este e o principio dos intervalos compostos em acao',
        },
      ],
    },

    // ── U31 M1: Scale Recognition Major/Minor ─────────────────────────────────
    l9u31m1: {
      title: 'Reconhecimento de Escalas: Formas Maiores e Menores',
      subtitle:
        'Distinguir maior, menor natural, menor harmonica e menor melodica de ouvido',
      objectives: [
        'Distinguir maior de menor natural pela cor geral e atmosfera',
        'Identificar menor harmonica pela 2.a aumentada exotica entre os graus 6 e 7',
        'Identificar menor melodica pelo 6.o e 7.o graus elevados ascendentes, criando uma qualidade suave e jazzistica',
      ],
      concepts: [
        {
          title: 'Formas Maiores vs. Menores',
          explanation:
            'Construindo sobre o reconhecimento basico maior/menor: agora identifica formas menores especificas. A menor natural soa sombria e folclorica -- sem atracao forte no final porque o 7.o grau esta um tom abaixo da tonica (subtonica, nao sensivel). A menor harmonica eleva o 7.o grau, criando uma sensivel e uma 2.a aumentada exotica entre os graus 6 e 7 -- um som inconfundivel. A menor melodica eleva tanto o 6.o como o 7.o graus ascendentes, suavizando a 2.a aumentada -- soa jazzistica e sofisticada. Treina tocando as tres a partir da mesma fundamental (p. ex. A) e isolando as diferencas.',
          tryThisLabel:
            'Ouve o 7.o grau elevado exotico na menor harmonica',
        },
        {
          title: 'Metodo de Treino: Isolamento',
          explanation:
            'A chave para o reconhecimento de escalas e isolar o que muda entre escalas semelhantes. Toca A maior, depois A menor natural -- tres notas mudam (C#/C, F#/F, G#/G). Agora toca A menor natural, depois A menor harmonica -- apenas uma nota muda (G para G#). Finalmente, A menor harmonica para A menor melodica ascendente -- novamente uma nota (F para F#). Ao estreitares o foco para os graus especificos que diferem, treinas mais rapido do que tentando ouvir a escala inteira como uma unidade.',
          tryThisLabel: 'Ouve menor melodica -- suave e jazzistica',
        },
        {
          title: 'Ancoragem ao Centro Tonal',
          explanation:
            'O reconhecimento de escalas torna-se mais dificil quando a fundamental muda. Podes identificar A menor natural facilmente mas debater-te com Eb menor natural porque a tonalidade desconhecida te distrai. A solucao: ancora sempre a tonica primeiro. Toca a nota fundamental, estabelece-a como "casa," depois ouve a escala. Uma vez ancorado o centro tonal, os intervalos relativos entre graus sao os mesmos em qualquer tonalidade. Treina praticando reconhecimento de escalas nas doze fundamentais -- a qualidade deve ser identificavel independentemente da nota inicial.',
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
            'Toca "C major scale" e depois "C natural minor scale". Tres graus mudam. Consegues ouvir as tres mudancas, ou a mudanca de cor geral domina a tua percecao?',
        },
        {
          instruction:
            'Toca "E harmonic minor scale" -- ouve a 2.a aumentada entre o 6.o e o 7.o graus (C a D#). Esse salto exotico e a impressao digital da menor harmonica',
        },
      ],
    },

    // ── U31 M2: Scale Recognition Modes ───────────────────────────────────────
    l9u31m2: {
      title: 'Reconhecimento de Escalas: Modos',
      subtitle:
        'Identificar os sete modos eclesiasticos pelas suas notas caracteristicas',
      objectives: [
        'Identificar cada um dos sete modos eclesiasticos pela sua cor caracteristica',
        'Distinguir modos semelhantes a maior (Jonico, Lidio, Mixolidio) de modos semelhantes a menor (Dorico, Frigio, Eolio, Locrio)',
        'Ouvir a nota caracteristica unica que diferencia cada modo do maior ou menor natural',
      ],
      concepts: [
        {
          title: 'Caracter Modal',
          explanation:
            'Cada modo tem uma cor caracteristica definida por uma ou duas notas que diferem do maior ou menor natural. Dorico e menor com 6.o elevado -- quente e jazzistico. Frigio tem 2.a bemolizada -- sombrio e com sonoridade espanhola. Lidio tem 4.a sustenida -- sonhador e flutuante. Mixolidio tem 7.a bemolizada -- bluesy e rock. Locrio tem 2.a e 5.a bemolizadas -- instavel e raramente usado como tonica. Foca-te nestas "notas caracteristicas" ao identificar modos de ouvido.',
          tryThisLabel:
            'Ouve Dorico -- menor mas quente (6.o elevado)',
        },
        {
          title: 'Metodo de Treino: Semelhante a Maior vs. Semelhante a Menor',
          explanation:
            'Comeca por separar modos em dois grupos. Modos semelhantes a maior tem 3.a maior: Jonico (maior puro), Lidio (#4 -- sonhador), Mixolidio (b7 -- bluesy). Modos semelhantes a menor tem 3.a menor: Eolio (menor puro), Dorico (6.a natural -- quente), Frigio (b2 -- sombrio), Locrio (b2 e b5 -- instavel). Primeiro aprende a identificar o grupo, depois afunila para o modo especifico. Esta primeira passagem binaria reduz as tuas opcoes a metade imediatamente e e muito mais fiavel do que adivinhar entre sete opcoes.',
          tryThisLabel:
            'Ouve Lidio -- o #4 sonhador eleva o som',
        },
        {
          title: 'Ancoras Auditivas de Nota Caracteristica',
          explanation:
            'Para cada modo, treina o teu ouvido na uma ou duas notas que o tornam unico. Dorico: toca menor natural, depois eleva a 6.a -- ouve a calidez entrar. Frigio: toca menor natural, depois baixa a 2.a -- ouve escurecer dramaticamente. Lidio: toca maior, depois eleva a 4.a -- ouve flutuar. Mixolidio: toca maior, depois baixa a 7.a -- ouve relaxar para blues. Cada nota caracteristica cria uma mudanca emocional especifica. Memoriza essa mudanca, e consegues identificar qualquer modo ao encontrar o seu momento caracteristico.',
          tryThisLabel:
            'Ouve Frigio -- a 2.a bemolizada escurece tudo',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "C phrygian" e depois "C dorian" -- Frigio e sombrio e espanhol (2.a bemolizada). Dorico e mais quente (6.a natural). Ambos sao modos menores mas a diferenca de caracter e dramatica',
        },
        {
          instruction:
            'Toca "C lydian" e depois "C major scale" (Jonico). A unica diferenca e F vs F#. Lidio flutua; Jonico assenta. Uma nota muda a atmosfera inteira',
        },
        {
          instruction:
            'Toca "C mixolydian" e depois "C major scale". Mixolidio tem Bb em vez de B -- soa bluesy e menos conclusivo. Este e o som dominante no rock e no blues',
        },
      ],
    },

    // ── U31 M3: Scale Recognition Pentatonic/Blues/Symmetric ──────────────────
    l9u31m3: {
      title: 'Reconhecimento de Escalas: Pentatonica, Blues, Simetrica',
      subtitle:
        'Reconhecer escalas especiais de ouvido -- pentatonica, blues, tons inteiros e diminuta',
      objectives: [
        'Identificar escalas pentatonicas maior e menor pelo seu caracter aberto e com lacunas',
        'Reconhecer a escala de blues pela sua blue note adicionada (5.a bemolizada)',
        'Identificar escalas de tons inteiros e diminutas pela sua qualidade simetrica e sem direcao',
      ],
      concepts: [
        {
          title: 'Escalas Pentatonicas',
          explanation:
            'A pentatonica maior soa aberta e folclorica -- cinco notas, sem meios-tons, sem tensao. E o som de cancoes a volta da fogueira e melodias celtas. A pentatonica menor soa bluesy e crua -- a espinha dorsal do rock e da guitarra blues. Ambas as escalas pentatonicas sao instantaneamente reconheciveis porque lhes faltam as tensoes de meio-tom das escalas diatonicas. As lacunas na escala (4.o e 7.o graus ausentes na pentatonica maior, por exemplo) criam uma qualidade aberta distintiva que nenhuma escala de sete notas tem.',
          tryThisLabel:
            'Ouve a pentatonica -- aberta, folclorica, sem tensao',
        },
        {
          title: 'A Escala de Blues',
          explanation:
            'A escala de blues acrescenta a 5.a bemolizada ("blue note") a pentatonica menor, criando aspereza e expressividade. Essa unica nota adicionada transforma uma pentatonica limpa em algo com alma e fluidez. A blue note situa-se entre a 4.a perfeita e a 5.a perfeita -- uma intrusao cromatica que cria tensao maxima com ambas as vizinhas. A escala de blues e a espinha dorsal do blues, rock e improvisacao jazz, e o seu som e instantaneamente identificavel apos exposicao mesmo breve.',
          tryThisLabel: 'Ouve a escala de blues -- aspera e expressiva',
        },
        {
          title: 'Escalas Simetricas',
          explanation:
            'As escalas de tons inteiros e diminutas sao construidas a partir de padroes intervalares repetitivos, dando-lhes uma qualidade sem direcao unica. A escala de tons inteiros usa apenas tons -- nenhum meio-tom -- produzindo uma qualidade sonhadora, flutuante e nao resolvida associada ao impressionismo e bandas sonoras de cinema. A escala diminuta (meio-tom-tom) alterna meios-tons e tons, criando um som tenso e simetrico, um elemento essencial do jazz e do film noir. Ambas as escalas carecem de uma atracao tonal clara porque a sua simetria significa que nenhuma nota se sente mais como "casa" do que qualquer outra.',
          tryThisLabel:
            'Ouve tons inteiros -- sonhadora e sem direcao',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "C pentatonic scale" e depois "C blues scale" -- a escala de blues acrescenta uma nota (Gb, a blue note). Consegues ouvir a aspereza e tensao adicionadas?',
        },
        {
          instruction:
            'Toca "C whole tone scale" -- repara como cada passo tem o mesmo tamanho. Nao ha atracao para nenhuma nota particular. A escala flutua sem direcao',
        },
        {
          instruction:
            'Compara "C minor pentatonic" com "C natural minor scale". A pentatonica remove duas notas (a 2.a e a 6.a), criando lacunas. Essas lacunas dao a pentatonica o seu som aberto caracteristico',
        },
      ],
    },

    // ── U31 M4: Triad Quality Recognition ─────────────────────────────────────
    l9u31m4: {
      title: 'Reconhecimento de Qualidade de Triades',
      subtitle:
        'Identificar triades maiores, menores, diminutas e aumentadas de ouvido',
      objectives: [
        'Identificar triades maiores, menores, diminutas e aumentadas de ouvido',
        'Compreender a distincao de estabilidade: 5.a perfeita (estavel) vs. 5.a alterada (instavel)',
        'Reconhecer inversoes de triades pelo caracter da nota do baixo',
      ],
      concepts: [
        {
          title: 'Qualidades de Triades de Ouvido',
          explanation:
            'Maior soa brilhante e assente -- o acorde predefinido, estavel. Menor soa sombrio mas ainda apoiado -- mesma estabilidade, cor diferente. Diminuto soa tenso, pequeno e ansioso -- quer mover-se para algum lado. Aumentado soa estranho, suspenso e sem direcao -- sem resolucao clara. A distincao chave: maior e menor tem ambos uma 5.a perfeita (estabilidade). Diminuto e aumentado tem 5.as alteradas (instabilidade). Treina tocando as quatro qualidades a partir da mesma fundamental e fechando os olhos antes de cada uma.',
          tryThisLabel: 'Ouve diminuto -- tenso, pequeno, ansioso',
        },
        {
          title: 'Triades Estaveis vs. Instaveis',
          explanation:
            'A 5.a perfeita e o intervalo que proporciona estabilidade a um acorde. Triades maiores (3.a maior + 5.a perfeita) e triades menores (3.a menor + 5.a perfeita) contem-na -- e por isso que soam apoiadas mesmo com cores diferentes. Triades diminutas substituem a 5.a perfeita por uma 5.a diminuta (meio-tom mais pequena), criando uma qualidade comprimida e ansiosa. Triades aumentadas substituem-na por uma 5.a aumentada (meio-tom mais larga), criando uma qualidade expandida e nao resolvida. Ouvir estavel vs. instavel e o primeiro filtro -- depois afunila para a qualidade especifica.',
          tryThisLabel:
            'Ouve aumentado -- estranho, expandido, nao resolvido',
        },
        {
          title: 'Reconhecer Inversoes',
          explanation:
            'Quando uma triade esta invertida, a nota do baixo muda o peso e a estabilidade percebidos. A posicao fundamental soa apoiada e definitiva -- a fundamental ancora tudo. A primeira inversao soa mais leve e mais melodica -- a 3.a no baixo cria uma sensacao menos estavel mas fluida. A segunda inversao soa instavel -- a 4.a acima do baixo cria tensao que historicamente requer resolucao. Treina ouvindo o mesmo acorde em todas as posicoes e observando como o caracter muda enquanto a qualidade (maior/menor) permanece a mesma.',
          tryThisLabel:
            'Ouve posicao fundamental -- apoiada e definitiva',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca as quatro qualidades de triade a partir de C: "C major chord", "Cm", "Cdim", "Caug". Fecha os olhos e toca de novo -- consegues identificar cada uma apenas pelo som?',
        },
        {
          instruction:
            'Compara "C major chord" com "Cm". A unica diferenca e uma nota -- E vs. Eb. Esse unico meio-tom muda de brilhante para sombrio. Treina esta distincao em varias fundamentais',
        },
        {
          instruction:
            'Toca "Cdim" e depois "Caug" -- ambos tem 5.as alteradas e soam instaveis, mas de maneiras diferentes. Diminuto contrai para dentro (pequeno, ansioso). Aumentado expande para fora (estranho, flutuante)',
        },
      ],
    },

    // ── U31 M5: Seventh Chord Quality Recognition ─────────────────────────────
    l9u31m5: {
      title: 'Reconhecimento de Qualidade de Acordes de Setima',
      subtitle:
        'Identificar todas as qualidades de acordes de setima de ouvido -- do caloroso maior com 7.a ao tenso diminuto com 7.a',
      objectives: [
        'Identificar acordes de 7.a maior, 7.a dominante, 7.a menor, meio-diminuto e diminuto de ouvido',
        'Ouvir o acorde menor-maior com 7.a como uma qualidade distinta e inquietante',
        'Distinguir qualidades de acordes de setima pelo seu caracter emocional e nivel de tensao',
      ],
      concepts: [
        {
          title: 'Qualidades de Acordes de Setima de Ouvido',
          explanation:
            'Seis qualidades distintas de acordes de setima, cada uma com um caracter emocional unico. 7.a maior (Cmaj7): quente, exuberante, balada de jazz. 7.a dominante (C7): tensa, bluesy, exige resolucao. 7.a menor (Cm7): suave, macia, descontraida. Meio-diminuto (Cm7b5): sombrio, anelante, film noir. Diminuto (Cdim7): maximamente tenso, cada nota quer mover-se. Menor-maior com 7.a (CmMaj7): misterioso, inquietante -- o choque entre triade menor e 7.a maior. Treina tocando os seis a partir da mesma fundamental em sequencia.',
          tryThisLabel: 'Ouve 7.a maior -- quente e exuberante',
        },
        {
          title: 'A Distincao 7.a Dominante vs. 7.a Maior',
          explanation:
            'A distincao de acordes de setima mais importante. 7.a maior (Cmaj7) e 7.a dominante (C7) partilham uma triade maior mas diferem numa nota: B (7.a maior) vs. Bb (7.a menor). Essa diferenca de meio-tom transforma o acorde de repouso quente para tensao bluesy. A 7.a dominante exige resolucao -- puxa para um acorde uma 5.a abaixo (C7 quer ir para F). A 7.a maior fica contente onde esta. Esta distincao e a porta de entrada para ouvir harmonia funcional, porque a 7.a dominante e o motor do movimento harmonico.',
          tryThisLabel:
            'Ouve 7.a dominante -- tensa, bluesy, precisa de mover-se',
        },
        {
          title: 'O Lado Sombrio: Meio-Diminuto e Diminuto',
          explanation:
            'Meio-diminuto (Cm7b5) e diminuto (Cdim7) sao as qualidades de acordes de setima mais sombrias. O meio-diminuto combina uma triade diminuta com uma 7.a menor -- soa anelante, instavel e cinematico. O diminuto empilha 3.as menores simetricamente -- e maximamente tenso, com cada nota equidistante e cada nota querendo resolver. A distincao: o meio-diminuto tem um intervalo "normal" (a 7.a menor a partir da fundamental) que lhe da um toque de calidez. O diminuto e uniformemente comprimido e tenso ao longo de toda a estrutura. No jazz, o meio-diminuto e o acorde ii em tonalidades menores; o diminuto e um acorde de passagem ou substituto do dominante.',
          tryThisLabel:
            'Ouve meio-diminuto -- sombrio e anelante',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca estes acordes de setima em sequencia: "Cmaj7", "C7", "Cm7", "Cm7b5", "Cdim7". Cada um tem uma assinatura emocional distinta. Descreve o que sentes em cada um',
        },
        {
          instruction:
            'Compara "Cmaj7" (quente, resolvido) com "C7" (tenso, precisa de mover-se). A unica diferenca e uma nota -- B vs. Bb. Esse unico meio-tom muda o caracter inteiro',
        },
        {
          instruction:
            'Toca "Cm7" e depois "Cm7b5". A 7.a menor e suave e macia. O meio-diminuto e mais sombrio e anelante -- a 5.a baixada acrescenta instabilidade. Esta distincao importa no jazz e na conducao de vozes classica',
        },
      ],
    },

    // ── U32 M1: Melodic Dictation Diatonic ────────────────────────────────────
    l9u32m1: {
      title: 'Ditado Melodico: Diatonico',
      subtitle:
        'Transcrever melodias diatonicas curtas de ouvido -- movimento por graus e triadico',
      objectives: [
        'Transcrever melodias diatonicas curtas de ouvido usando um processo sistematico',
        'Aplicar a estrategia "enquadramento primeiro": identificar tonalidade, compasso e cadencia antes de escrever notas',
        'Lidar com movimento por graus e saltos triadicos (contornos de acorde como C-E-G) em tonalidades maiores',
      ],
      concepts: [
        {
          title: 'O Processo de Ditado',
          explanation:
            'O ditado melodico segue um processo sistematico -- apressar-se a escrever notas imediatamente e o erro mais comum. Primeira audicao: capta a forma geral, a tonalidade e o compasso. Identifica a tonica encontrando a nota que soa como "casa" -- normalmente a nota final. Segunda audicao: foca nas primeiras notas e nas ultimas notas. Terceira audicao: preenche o meio, construindo frase a frase. Comeca sempre pelo ritmo e contorno (a forma de sobe-e-desce), depois afina para alturas exatas. Verifica o teu trabalho: a transcricao faz sentido musical?',
          tryThisLabel:
            'Toca uma escala de referencia para ancorar a tonalidade',
        },
        {
          title: 'Estrategia do Enquadramento Primeiro',
          explanation:
            'Antes de escrever uma unica nota, estabelece o enquadramento que restringe as tuas escolhas. Identifica a tonalidade ouvindo a tonica -- a nota de repouso e resolucao. Bate o tempo para encontrar o compasso (esta em 2, 3 ou 4?). Ouve a cadencia no final -- resolve conclusivamente (cadencia autentica) ou deixa-te em suspenso (meia cadencia)? Depois preenche notas, comecando pelo ritmo e direcao geral. O enquadramento elimina respostas erradas antes de comecares, tornando o trabalho de detalhe muito mais facil.',
          tryThisLabel:
            'Ouve o acorde de tonica -- o teu ponto de ancoragem',
        },
        {
          title: 'Contorno Antes da Altura',
          explanation:
            'Contorno e a forma de uma melodia -- o seu padrao de subidas e descidas -- sem especificar intervalos exatos. Antes de tentares nomear alturas especificas, desenha o contorno: a melodia sobe, desce, faz arco ou mantem-se? Uma melodia em arco (sobe depois desce) e a forma mais comum. Uma melodia que desce ao longo de toda a duracao e menos comum e soa como se estivesse a assentar. O contorno e o esqueleto do ditado. Se o teu contorno estiver errado, as tuas alturas estarao erradas por mais cuidadosamente que ougas. Acerta sempre a forma primeiro, depois preenche as notas exatas.',
          tryThisLabel:
            'Toca G maior -- o contorno ascendente mais simples',
        },
      ],
      tasks: [
        {
          instruction:
            'Pede a um amigo que toque 4-5 notas aleatorias da escala de C maior no piano. Tenta canta-las de volta e depois encontra-las no teclado. Comeca apenas com movimento por graus',
        },
        {
          instruction:
            'Ouve uma melodia curta e identifica primeiro apenas o contorno -- sobe, desce, mantem-se ou faz arco? O contorno e o esqueleto do ditado e deve vir sempre antes das alturas exatas',
        },
        {
          instruction:
            'Pratica identificar a ultima nota de uma melodia -- e a tonica? Se sim, a melodia termina com resolucao. Se nao, soa inacabada. Esta unica observacao estabelece a tonalidade',
        },
      ],
    },

    // ── U32 M2: Melodic Dictation Chromatic ───────────────────────────────────
    l9u32m2: {
      title: 'Ditado Melodico: Cromatico',
      subtitle:
        'Transcrever melodias com notas cromaticas de passagem, notas de vizinhanca e dominantes secundarias',
      objectives: [
        'Reconhecer notas cromaticas de passagem e de vizinhanca dentro de melodias diatonicas',
        'Ouvir o efeito de dominantes secundarias em linhas melodicas -- sensiveis emprestadas',
        'Progredir em niveis de dificuldade desde ornamentacao cromatica ate ditado a duas vozes',
      ],
      concepts: [
        {
          title: 'Ornamentacao Cromatica',
          explanation:
            'Notas cromaticas de passagem e de vizinhanca sao notas fora da tonalidade que ligam ou decoram notas diatonicas. Uma nota cromatica de passagem preenche o intervalo entre duas notas diatonicas a um tom de distancia -- por exemplo, C a C# a D em C maior. Uma nota cromatica de vizinhanca sai da tonalidade e regressa imediatamente -- D a D# a D. Estas notas criam cor e tensao sem mudar a tonalidade. O desafio de treino auditivo e distinguir ornamentacoes cromaticas (desvios temporarios) de modulacoes reais (mudancas permanentes de tonalidade). Se a nota resolve por grau de volta a tonalidade, e provavelmente uma ornamentacao.',
          tryThisLabel:
            'Toca o enquadramento diatonico -- depois imagina preenchimento cromatico',
        },
        {
          title: 'Dominantes Secundarias em Melodias',
          explanation:
            'Quando uma melodia introduz brevemente uma nota fora da tonalidade que funciona como sensivel de um acorde diatonico, estas a ouvir a influencia de uma dominante secundaria. Em C maior, um F# pode aparecer como sensivel de G (a dominante) -- puxa fortemente para G da mesma forma que B puxa para C. No ditado, estas sensiveis emprestadas sao identificaveis porque resolvem por meio-tom ascendente para uma nota diatonica. Ouvir F# resolver para G numa melodia em C maior e uma pista de dominante secundaria: V/V (quinto do quinto). Esta e a ponte entre ditado diatonico e cromatico.',
          tryThisLabel:
            'Ouve G7 -- a sensivel B puxa para C',
        },
        {
          title: 'Progressao de Dificuldade',
          explanation:
            'O ditado cromatico escala em niveis claros. Nivel 1: notas cromaticas de passagem entre notas diatonicas (C-C#-D). Nivel 2: notas cromaticas de vizinhanca (D-D#-D). Nivel 3: sensiveis secundarias resolvendo por meio-tom ascendente (F#-G em C maior). Nivel 4: sequencias cromaticas onde um padrao diatonico e transposto cromaticamente. Nivel 5: ditado a duas vozes com elementos cromaticos em ambas. Nunca saltes niveis -- cada um constroi sobre o anterior. Em cada etapa, mantem pelo menos 80 porcento de precisao antes de avancar.',
          tryThisLabel:
            'Ouve menor -- o ditado torna-se mais dificil com 6.o e 7.o graus variaveis',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca a escala de C maior lentamente, depois insere uma nota cromatica de passagem entre D e E (toca D-D#-E). Agora experimenta C-C#-D. Ouve como a nota cromatica cria cor momentanea sem perturbar a tonalidade',
        },
        {
          instruction:
            'Num contexto de C maior, toca a sequencia E-F#-G. O F# e uma sensivel secundaria de G. Soa como uma tonicizacao temporaria -- G torna-se brevemente o centro de gravidade antes de C se reafirmar',
        },
        {
          instruction:
            'Ouve qualquer melodia com atencao plena e marca momentos em que uma nota soa "fora" da tonalidade. Resolve por grau? Se sim, e provavelmente uma ornamentacao cromatica. Se nao, considera se a tonalidade mudou',
        },
      ],
    },

    // ── U32 M3: Harmonic Dictation ────────────────────────────────────────────
    l9u32m3: {
      title: 'Ditado Harmonico: Cadencias e Progressoes',
      subtitle:
        'Identificar cadencias, transcrever progressoes e ditado de linha de baixo',
      objectives: [
        'Identificar tipos de cadencia (autentica, plagal, meia, deceptiva) de ouvido',
        'Transcrever progressoes diatonicas de quatro acordes usando numeracao romana',
        'Realizar ditado de linha de baixo como porta de entrada para transcricao harmonica completa',
      ],
      concepts: [
        {
          title: 'Ouvir a Linha de Baixo',
          explanation:
            'A linha de baixo e a porta de entrada para o ditado harmonico. A nota do baixo define o acorde mais do que qualquer outra voz -- diz-te a fundamental (ou a inversao). Treina ouvindo progressoes de acordes e cantando apenas as notas do baixo. Se conseguires acompanhar o baixo com precisao, estas a maior parte do caminho para identificar a harmonia. Acordes em posicao fundamental tem a relacao baixo-acorde mais clara. Inversoes requerem que ougas a nota do baixo como nao-fundamental e depois infiras o acorde real acima dela.',
          tryThisLabel:
            'Ouve a nota do baixo -- ancora o acorde',
        },
        {
          title: 'Reconhecimento de Cadencias',
          explanation:
            'Cadencias sao a pontuacao da musica -- aprende a ouvi-las antes de abordar progressoes completas. A cadencia autentica (V-I) soa final e conclusiva -- um ponto final. A cadencia plagal (IV-I) soa mais suave e quente -- como "Amen." A meia cadencia (terminando em V) soa incompleta -- um ponto de interrogacao. A cadencia deceptiva (V-vi) surpreende: esperas resolucao para I mas aterras em vi. Identificar a cadencia no final de uma frase da-te dois acordes imediatamente e ancora a tonalidade.',
          tryThisLabel: 'Ouve V (G) -- puxa para C (I)?',
        },
        {
          title: 'Processo de Ditado de Progressoes',
          explanation:
            'O ditado harmonico completo segue um processo sistematico. Passo 1: ouve a tonalidade -- identifica o acorde de tonica e a cadencia. Passo 2: acompanha a linha de baixo -- as notas do baixo delineiam o movimento harmonico. Passo 3: identifica a qualidade do acorde em cada mudanca de nota do baixo -- e maior, menor ou diminuto? Passo 4: atribui numeracao romana com base no grau da escala de cada nota do baixo. Passo 5: verifica a coerencia -- o ritmo harmonico (taxa de mudanca de acorde) faz sentido? Comeca com cadencias de dois acordes e avanca para progressoes de quatro acordes.',
          tryThisLabel:
            'Ve os acordes diatonicos disponiveis em C maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Ouve musica que conheces bem e tenta identificar as cadencias. Cada frase termina com um forte V-I (autentica)? Um suave IV-I (plagal)? Ou uma meia cadencia nao resolvida terminando em V?',
        },
        {
          instruction:
            'Pratica ditado de linha de baixo separadamente da analise harmonica completa -- canta ou trauteia a nota mais grave que ouves em cada acorde de uma progressao. O baixo e sempre o teu ponto de partida',
        },
        {
          instruction:
            'Comeca com cadencias de dois acordes: toca pares aleatorios de V-I e IV-I em diferentes tonalidades no piano. Consegues dizer que tipo de cadencia e antes de verificar? Depois acrescenta cadencias deceptivas (V-vi)',
        },
      ],
    },

    // ── U32 M4: Sight Singing Fundamentals ────────────────────────────────────
    l9u32m4: {
      title: 'Fundamentos de Leitura a Primeira Vista',
      subtitle:
        'Solfejo movel para leitura a primeira vista em tonalidades maiores e menores',
      objectives: [
        'Usar solfejo movel (do-re-mi-fa-sol-la-ti) para leitura a primeira vista em tonalidades maiores',
        'Aplicar silabas de solfejo cromatico para tonalidades menores: me, le, te para graus baixados',
        'Seguir um processo sistematico de leitura a primeira vista: tonalidade, extensao, padroes, depois cantar',
      ],
      concepts: [
        {
          title: 'Solfejo Movel',
          explanation:
            'No solfejo movel, "do" representa sempre a tonica da tonalidade atual -- independentemente de que nota seja. C maior: do=C. G maior: do=G. Bb maior: do=Bb. Isto mapeia silabas a funcao, nao a altura absoluta. "Sol" soa sempre como dominante, "ti" soa sempre como a sensivel puxando para "do." Esta e a abordagem Kodaly/Berklee, e os seus defensores argumentam que treina a audicao funcional de forma mais direta -- aprendes a ouvir relacoes, nao apenas nomes de notas. O solfejo fixo (onde do e sempre C), o padrao nos conservatorios de muitos paises incluindo Franca e Italia, constroi em vez disso a associacao de altura absoluta -- ambos os sistemas sao amplamente usados.',
          tryThisLabel: 'Canta junto: do-re-mi-fa-sol-la-ti-do',
        },
        {
          title: 'Solfejo Cromatico para Tonalidades Menores',
          explanation:
            'Tonalidades menores requerem silabas modificadas para os graus baixados. No menor baseado em do: 3.a b = "me," 6.a b = "le," 7.a b = "te." Menor natural torna-se: do-re-me-fa-sol-le-te-do. Menor harmonica eleva o 7.o de volta a "ti": do-re-me-fa-sol-le-ti-do. Menor melodica ascendente eleva ambos: do-re-me-fa-sol-la-ti-do. Para alteracoes cromaticas: sustenidos ascendentes usam -i (di, ri, fi, si, li); bemois descendentes usam vogais modificadas (ra, me, se, le, te). Estas silabas tornam os graus alterados explicitos quando cantas.',
          tryThisLabel:
            'Canta: do-re-me-fa-sol-le-te-do (menor baseado em la, um sistema alternativo comum na pratica Kodaly: la-ti-do-re-mi-fa-sol)',
        },
        {
          title: 'Processo de Leitura a Primeira Vista',
          explanation:
            'Antes de cantar uma unica nota, segue um checklist. (1) Identifica a armacao de clave e a indicacao de compasso. (2) Procura as notas mais aguda e mais grave para saber os requisitos de extensao vocal. (3) Procura padroes -- escalas, arpejos, motivos repetidos, sequencias. (4) Define um andamento suficientemente lento para manter precisao (a velocidade desenvolve-se naturalmente com a pratica). (5) Canta mantendo um pulso regular acima de tudo. Uma nota errada a um tempo regular e melhor que uma nota certa com ritmo quebrado. O pulso e o esqueleto; as alturas sao a carne.',
          tryThisLabel:
            'Le a primeira vista G maior: do comeca em G',
        },
      ],
      tasks: [
        {
          instruction:
            'Canta a escala maior usando silabas de solfejo: do-re-mi-fa-sol-la-ti-do. Comeca em qualquer altura confortavel. Depois desce: do-ti-la-sol-fa-mi-re-do. Mantem um tempo regular ao longo',
        },
        {
          instruction:
            'Agora canta menor natural usando solfejo baseado em do: do-re-me-fa-sol-le-te-do. Repara nas tres silabas baixadas -- "me," "le," e "te" -- estes sao os tres graus que diferem do maior',
        },
        {
          instruction:
            'Pratica padroes de arpejo simples: do-mi-sol (arpejo maior), do-me-sol (arpejo menor), sol-ti-re (arpejo dominante). Canta estes em pelo menos tres tonalidades diferentes para internalizares a funcao, nao a altura absoluta',
        },
      ],
    },

    // ── U32 M5: Contextual Listening ──────────────────────────────────────────
    l9u32m5: {
      title: 'Audicao Contextual',
      subtitle:
        'Identificar textura, forma, instrumentos e periodos estilisticos de ouvido',
      objectives: [
        'Identificar textura musical: monofonica, homofonica, polifonica e homoritmica',
        'Reconhecer estruturas formais de ouvido: binaria, ternaria, rondo e estrofe-refrão',
        'Atribuir musica a periodos estilisticos historicos por tracos sonoros caracteristicos',
      ],
      concepts: [
        {
          title: 'Identificacao de Textura',
          explanation:
            'A textura musical descreve quantas vozes estao presentes e como se relacionam entre si. Monofonia e uma linha unica sem acompanhamento -- limpa e exposta, como uma melodia de flauta a solo. Homofonia e uma melodia com harmonia de suporte por baixo -- a textura mais comum na musica ocidental (pensa num cantor com acordes de guitarra). Polifonia tem multiplas melodias independentes a acontecer simultaneamente -- densa e complexa, como uma fuga de Bach. Homoritmia e um caso especial onde todas as vozes se movem no mesmo ritmo, como um coral. Aprender a ouvir textura e aprender a ouvir como a musica esta organizada verticalmente.',
          tryThisLabel:
            'Um acorde e textura homofonica em miniatura',
        },
        {
          title: 'Forma de Ouvido',
          explanation:
            'Ouvir forma significa acompanhar repeticao e contraste ao longo do tempo. Quando o material regressa, rotula-o "A." Quando material novo aparece, rotula-o "B." Forma binaria e AB (duas secoes contrastantes). Ternaria e ABA (partida e regresso). Rondo alterna um tema recorrente com episodios contrastantes: ABACA. Estrofe-refrão e o equivalente pop de secoes alternadas. Ouve os limites seccionais -- cadencias, pausas, mudancas de tonalidade e mudancas de textura ou dinamica sinalizam divisoes formais. A competencia e a capacidade de atencao: tens de manter a primeira secao em memoria para reconhecer o seu regresso.',
          tryThisLabel:
            'Explora G maior -- a maioria das formas comeca e termina na tonalidade de casa',
        },
        {
          title: 'Reconhecimento de Periodo Estilistico',
          explanation:
            'Cada era historica tem sons caracteristicos que podes aprender a identificar. Barroco (1600-1750): motor ritmico continuo, baixo continuo, melodias ornamentais, dinamicas em terracos (mudancas subitas forte/piano). Classico (1750-1820): frases equilibradas de 4 e 8 compassos, padroes de baixo de Alberti, cadencias claras, simplicidade elegante. Romantico (1820-1900): orquestras expandidas, harmonia cromatica, melodias longas e amplas, extensao dinamica extrema. Seculo XX (1900-2000): dissonancia como recurso primario, timbres novos, complexidade ritmica, experimentacao formal. Cada periodo constroi sobre e reage contra o anterior.',
          tryThisLabel:
            'Menor harmonica -- um classico do Barroco e do Classico',
        },
      ],
      tasks: [
        {
          instruction:
            'Ouve uma peca musical e identifica a textura. Ha uma melodia unica sem acompanhamento (monofonia), uma melodia com acordes (homofonia), ou multiplas melodias entrecruzadas (polifonia)?',
        },
        {
          instruction:
            'Escolhe uma cancao que conhecas bem e mapeia a sua forma. Rotula secoes A, B, C. E estrofe-refrão (AB alternado)? ABA (partida e regresso)? Sem repeticao a larga escala (through-composed)?',
        },
        {
          instruction:
            'Ouve musica orquestral e identifica primeiro as familias de instrumentos: cordas vs. metais vs. madeiras vs. percussao. Depois afunila para instrumentos especificos dentro de cada familia -- violino vs. violoncelo, trompete vs. trombone, flauta vs. clarinete',
        },
      ],
    },
  },
};

export default curriculumL9;
