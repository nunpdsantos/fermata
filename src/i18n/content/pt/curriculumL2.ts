import type { CurriculumLevelOverlay } from '../types';

const curriculumL2: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    u4: {
      title: 'Todas as Tonalidades Maiores e Graus da Escala',
      description:
        'As 15 armações de clave maiores, o Círculo de Quintas e os nomes e funções dos graus da escala',
    },
    u5: {
      title: 'Escalas Menores e Relações entre Tonalidades',
      description:
        'Escalas menor natural, harmónica e melódica, além das relações entre tonalidades relativas e paralelas',
    },
    u6: {
      title: 'Compasso Composto e Síncopa',
      description:
        'Indicações de compasso composto, síncopa, tercinas e conceitos rítmicos avançados',
    },
    u7: {
      title: 'Intervalos, Tríades e Harmonia Diatónica',
      description:
        'O sistema completo de qualidade de intervalos, os quatro tipos de tríades, inversões com baixo cifrado e tríades diatónicas com numeração romana',
    },
  },

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: {
    // ── U4 M1: All Major Keys and the Circle of Fifths ────────────────────
    l2u4m1: {
      title: 'Todas as Tonalidades Maiores e o Círculo de Quintas',
      subtitle: 'O conjunto completo de 15 armações de clave maiores e como se ligam entre si',
      objectives: [
        'Identificar as 15 armações de clave maiores, incluindo os pares enarmónicos',
        'Aplicar a ordem dos sustenidos (F-C-G-D-A-E-B) e dos bemóis (B-E-A-D-G-C-F)',
        'Determinar a tonalidade a partir da armação de clave e vice-versa',
        'Usar o Círculo de Quintas como mapa de todas as tonalidades',
      ],
      concepts: [
        {
          title: 'O Conjunto Completo de Tonalidades Maiores',
          explanation:
            'Existem 15 armações de clave maiores, mas apenas 12 tonalidades distintas. Três pares são enarmónicos -- soam de forma idêntica mas escrevem-se de maneira diferente: B/Cb, F#/Gb e C#/Db. As tonalidades com sustenidos vão de C (0 sustenidos) até C# (7 sustenidos). As tonalidades com bemóis vão de C até Cb (7 bemóis).',
          tryThisLabel: 'Vê B maior -- 5 sustenidos',
        },
        {
          title: 'Ordem dos Sustenidos e Bemóis',
          explanation:
            'Os sustenidos aparecem sempre na mesma ordem: F-C-G-D-A-E-B. Cada nova tonalidade com sustenidos acrescenta o próximo da sequência. G maior tem F#. D maior tem F# e C#. Os bemóis seguem a ordem inversa: B-E-A-D-G-C-F. F maior tem Bb. Bb maior tem Bb e Eb. Esta ordem nunca muda.',
          tryThisLabel: 'Vê A maior -- 3 sustenidos',
        },
        {
          title: 'Truques de Identificação Rápida',
          explanation:
            'Para tonalidades com sustenidos: o último sustenido é sempre o 7.o grau da escala -- sobe meio-tom e encontras o nome da tonalidade. Se o último sustenido é F#, a tonalidade é G. Para tonalidades com bemóis: o penúltimo bemol É a tonalidade. Se tens Bb e Eb, a tonalidade é Bb. A exceção: um único bemol significa sempre F maior.',
          tryThisLabel: 'Vê Db maior -- 5 bemóis',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre o Círculo de Quintas e nomeia todas as tonalidades com sustenidos no sentido dos ponteiros do relógio a partir de C',
        },
        {
          instruction:
            'Escreve "Ab major scale" -- quantos bemóis precisa? Consegues nomeá-los por ordem?',
        },
        {
          instruction:
            'Escreve "E major scale" -- o último sustenido é D#. Sobe meio-tom: E. O truque funciona!',
        },
      ],
    },

    // ── U4 M2: Scale Degree Names and Functions ───────────────────────────
    l2u4m2: {
      title: 'Nomes e Funções dos Graus da Escala',
      subtitle: 'Os sete nomes funcionais que todo o músico deve conhecer',
      objectives: [
        'Nomear os sete graus da escala: tónica, supertónica, mediante, subdominante, dominante, submediante, sensível',
        'Compreender o significado funcional de cada nome de grau',
        'Distinguir a sensível da subtónica',
      ],
      concepts: [
        {
          title: 'Os Sete Nomes dos Graus da Escala',
          explanation:
            'Cada grau da escala tem um nome funcional: 1=Tónica (repouso), 2=Supertónica (acima da tónica), 3=Mediante (ponto médio entre tónica e dominante), 4=Subdominante (abaixo da dominante), 5=Dominante (cria tensão em direção à tónica), 6=Submediante (abaixo da mediante, contando para baixo), 7=Sensível (meio-tom abaixo da tónica, a atração mais forte para casa).',
          tryThisLabel: 'Vê os sete graus de C maior',
        },
        {
          title: 'Sensível vs. Subtónica',
          explanation:
            'Quando o 7.o grau está a meio-tom abaixo da tónica (como na escala maior e menor harmónica), chama-se sensível -- puxa fortemente para cima, em direção à resolução. Quando o 7.o grau está a um tom abaixo da tónica (como na menor natural), chama-se subtónica -- a atração é mais fraca. Esta distinção explica por que existe a menor harmónica: os compositores elevaram o 7.o grau para criar uma sensível.',
          tryThisLabel: 'Ouve a subtónica na menor natural',
        },
        {
          title: 'Porque Importam Estes Nomes',
          explanation:
            'Os nomes não são rótulos arbitrários -- descrevem função harmónica. A dominante (5) e a sensível (7) criam tensão. A tónica (1) proporciona resolução. A subdominante (4) e a supertónica (2) criam movimento em direção à dominante. Compreender a função é a chave para compreender a harmonia. O sistema de cores desta app codifica estas funções: azul=tónica, ambra=dominante, vermelho=sensível.',
          tryThisLabel: 'Vê as cores dos graus em G maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre "key of C" e nomeia cada grau da escala pelo seu nome funcional, da tónica à sensível',
        },
        {
          instruction:
            'Olha para as cores dos graus -- qual é azul (tónica)? Qual é ambra (dominante)? Qual é vermelho (sensível)?',
        },
        {
          instruction:
            'Escreve "A natural minor scale" e depois "A harmonic minor scale" -- qual delas eleva o 7.o grau para criar uma sensível?',
        },
      ],
    },

    // ── U5 M1: Natural Minor Scale ────────────────────────────────────────
    l2u5m1: {
      title: 'Escala Menor Natural',
      subtitle: 'O padrão T-mT-T-T-mT-T-T e o lado mais sombrio da tonalidade',
      objectives: [
        'Construir a escala menor natural a partir de qualquer nota usando T-mT-T-T-mT-T-T',
        'Ouvir o carácter contrastante das escalas maior e menor',
        'Compreender que cada tonalidade menor partilha a armação de clave com uma relativa maior',
      ],
      concepts: [
        {
          title: 'O Padrão da Menor Natural',
          explanation:
            'A escala menor natural segue T-mT-T-T-mT-T-T -- compara com o padrão da maior: T-T-mT-T-T-T-mT. Os meios-tons caem em posições diferentes, e isso muda tudo. A menor natural mais fácil de ver é A menor natural: usa apenas teclas brancas, de A a G e de volta a A.',
          tryThisLabel: 'Ouve A menor natural -- só teclas brancas',
        },
        {
          title: 'Carácter Maior vs. Menor',
          explanation:
            'Toca a escala de C maior e depois a escala de C menor. A menor soa mais sombria, mais emocional -- ouves a diferença instantaneamente. A diferença vem de três graus baixados: o 3.o, 6.o e 7.o estão cada um meio-tom mais baixo do que na escala maior. Estas três alterações transformam brilhante e resolvido em sombrio e introspetivo.',
          tryThisLabel: 'Compara C menor com C maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "A natural minor scale" e depois "C major scale" -- usam as mesmas notas mas começam em notas diferentes. Ouve como o carácter muda completamente',
        },
        {
          instruction:
            'Escreve "D minor scale" -- que nota precisa de um bemol para manter o padrão T-mT-T-T-mT-T-T?',
        },
        {
          instruction:
            'Escreve "E minor scale" -- quantos sustenidos precisa? Compara com G maior (a sua relativa maior)',
        },
      ],
    },

    // ── U5 M2: Harmonic and Melodic Minor ─────────────────────────────────
    l2u5m2: {
      title: 'Menor Harmónica e Melódica',
      subtitle: 'Porque existem três formas de menor -- e o que cada uma resolve',
      objectives: [
        'Construir a menor harmónica elevando o 7.o grau da menor natural',
        'Construir a menor melódica elevando o 6.o e 7.o graus na forma ascendente',
        'Compreender porque existem três formas: natural para pureza, harmónica para cadências, melódica para melodia fluida',
      ],
      concepts: [
        {
          title: 'Menor Harmónica',
          explanation:
            'A menor harmónica eleva o 7.o grau meio-tom, criando uma sensível. A menor harmónica: A-B-C-D-E-F-G#. Agora o acorde V é maior, dando à tonalidade uma forte atração dominante-tónica. A contrapartida: surge uma 2.a aumentada (3 meios-tons) entre o 6.o e 7.o graus, dando à menor harmónica o seu som exótico distintivo.',
          tryThisLabel: 'Ouve o 7.o grau elevado',
        },
        {
          title: 'Menor Melódica',
          explanation:
            'A menor melódica corrige a 2.a aumentada elevando também o 6.o grau -- mas tradicionalmente só na forma ascendente. Ascendente: T-mT-T-T-T-T-mT. Descendente: menor natural. A melódica ascendente de A: A-B-C-D-E-F#-G#. No jazz, a forma ascendente usa-se em ambas as direções e chama-se escala "menor jazz".',
          tryThisLabel: 'Ouve a menor melódica',
        },
        {
          title: 'Três Formas, Três Propósitos',
          explanation:
            'A menor natural é pura e folclórica, mas o seu acorde v menor carece de poder de resolução. A menor harmónica dá-te um acorde V maior com sensível -- essencial para cadências fortes. A menor melódica suaviza a 2.a aumentada incómoda para melodias vocais e instrumentais. Os compositores escolhem entre as formas conforme o que a música precisa em cada momento.',
          tryThisLabel: 'Constrói E menor natural',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca "A natural minor", "A harmonic minor" e "A melodic minor" em sequência -- ouve como cada forma soa diferente',
        },
        {
          instruction:
            'Escreve "D harmonic minor scale" -- que nota é elevada em relação a D menor natural?',
        },
        {
          instruction:
            'Escreve "E melodic minor scale" -- identifica as duas notas elevadas em relação à menor natural',
        },
      ],
    },

    // ── U5 M3: Relative and Parallel Keys ─────────────────────────────────
    l2u5m3: {
      title: 'Tonalidades Relativas e Paralelas',
      subtitle: 'Duas formas de ligar maior e menor',
      objectives: [
        'Encontrar pares de relativa maior/menor usando a regra do 6.o grau / 3.o grau',
        'Compreender tonalidades paralelas como mesma fundamental, qualidade diferente',
        'Ver como estas relações aparecem no Círculo de Quintas',
      ],
      concepts: [
        {
          title: 'Tonalidades Relativas',
          explanation:
            'Tonalidades relativas partilham a mesma armação de clave mas têm tónicas diferentes. Para encontrar a relativa menor de uma tonalidade maior, vai ao 6.o grau. C maior -> A menor. G maior -> E menor. Para encontrar a relativa maior, vai ao 3.o grau da escala menor. A menor -> C maior. O Círculo de Quintas mostra ambas: tonalidades maiores no anel exterior, as suas relativas menores no anel interior.',
          tryThisLabel: 'Vê as tonalidades relativas no Círculo',
        },
        {
          title: 'Tonalidades Paralelas',
          explanation:
            'Tonalidades paralelas partilham a mesma fundamental mas têm qualidades diferentes. C maior e C menor são paralelas. Partilham a nota tónica mas diferem no 3.o, 6.o e 7.o graus. A relação paralela torna-se crítica mais tarde na mistura modal -- emprestar acordes da tonalidade paralela para acrescentar cor.',
          tryThisLabel: 'Compara C menor com C maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "Eb major scale" -- qual é o 6.o grau? Essa é a relativa menor. Verifica com o Círculo de Quintas',
        },
        {
          instruction:
            'Escreve "C major scale" e depois "C minor scale" -- quais três notas mudam? (3.a, 6.a, 7.a). Estas são tonalidades paralelas',
        },
        {
          instruction:
            'No Círculo de Quintas, encontra D maior no anel exterior. Que tonalidade menor está no interior? Verifica com "B minor scale"',
        },
      ],
    },

    // ── U6 M1: Compound Meter: 6/8, 9/8, 12/8 ───────────────────────────
    l2u6m1: {
      title: 'Compasso Composto: 6/8, 9/8, 12/8',
      subtitle: 'Quando os tempos se dividem em três -- a cadência ondulante do compasso composto',
      objectives: [
        'Distinguir compasso simples (tempos dividem-se por 2) de compasso composto (tempos dividem-se por 3)',
        'Ler indicações de compasso composto: 6/8, 9/8, 12/8',
        'Sentir a diferença entre 3/4 (três tempos binários) e 6/8 (dois tempos ternários)',
      ],
      concepts: [
        {
          title: 'Simples vs. Composto',
          explanation:
            'No compasso simples, cada tempo divide-se naturalmente em duas partes iguais (uma semínima divide-se em duas colcheias). No compasso composto, cada tempo divide-se em três (uma semínima com ponto divide-se em três colcheias). O número de cima nas indicações compostas é 6, 9 ou 12 -- divide por 3 para encontrar o número de tempos: 6/8 tem 2 tempos, 9/8 tem 3, 12/8 tem 4.',
          tryThisLabel: 'Sente uma pulsação ondulante -- UM-e-a DOIS-e-a',
        },
        {
          title: '3/4 vs. 6/8',
          explanation:
            '3/4 tem três tempos, cada um dividido em dois: UM-e DOIS-e TRÊS-e. 6/8 tem dois tempos, cada um dividido em três: UM-e-a DOIS-e-a. O mesmo número total de colcheias por compasso (seis), mas agrupamento diferente. 3/4 soa como uma valsa; 6/8 soa como uma jiga. A distinção é sobre a sensação, não sobre a matemática.',
          tryThisLabel: 'Experimenta contar em grupos de 3 vs. grupos de 2',
        },
      ],
      tasks: [
        {
          instruction:
            'Bate uma pulsação regular e agrupa colcheias em três: UM-e-a DOIS-e-a. Esta é a sensação de 6/8 -- dois tempos grandes, cada um com três subdivisões',
        },
        {
          instruction:
            'Agora bate em 3/4: UM-e DOIS-e TRÊS-e. O mesmo número de colcheias, mas o padrão de acentuação é completamente diferente. Sente a distinção entre valsa e jiga',
        },
      ],
    },

    // ── U6 M2: Syncopation and Triplets ───────────────────────────────────
    l2u6m2: {
      title: 'Síncopa e Tercinas',
      subtitle: 'Ritmos que empurram contra o tempo -- acentos em tempos fracos e divisões emprestadas',
      objectives: [
        'Definir síncopa como a acentuação de tempos ou partes de tempos normalmente fracos',
        'Compreender tercinas como agrupamentos emprestados de três num contexto binário',
        'Ouvir como a síncopa cria energia e impulso para a frente',
      ],
      concepts: [
        {
          title: 'Síncopa',
          explanation:
            'A síncopa coloca acentos onde o ouvido não os espera -- em tempos fracos ou entre tempos. Em vez de UM-dois-TRES-quatro, um ritmo sincopado pode acentuar o "e" do tempo 2: um-dois-E-três-quatro. Este deslocamento cria tensão rítmica e energia. A síncopa é a força motriz do jazz, funk, música latina e praticamente toda a música popular. Sem ela, o ritmo é previsível; com ela, o ritmo ganha vida.',
          tryThisLabel: 'Toca um acorde -- agora imagina tocá-lo no "e" do 2',
        },
        {
          title: 'Tercinas e Duinas',
          explanation:
            'Uma tercina divide um tempo que normalmente tem duas subdivisões em três partes iguais. Em 4/4, uma tercina de colcheias encaixa três notas no espaço de duas -- cria uma breve sensação composta dentro do compasso simples. O inverso também existe: uma duina divide um tempo composto em dois em vez de três. Estas divisões emprestadas acrescentam variedade rítmica e efeitos de ritmo cruzado.',
          tryThisLabel: 'Ouve um acorde -- imagina três pulsações num só tempo',
        },
      ],
      tasks: [
        {
          instruction:
            'Bate palmas em semínimas regulares, depois desloca a palma para o "e" entre tempos. Essa ênfase no contratempo é síncopa',
        },
        {
          instruction:
            'Bate dois tempos iguais, depois tenta bater três uniformemente no mesmo intervalo. Essa sensação de 3 contra 2 é a essência de uma tercina',
        },
      ],
    },

    // ── U7 M1: Interval Quality: Perfect, Major, Minor ───────────────────
    l2u7m1: {
      title: 'Qualidade do Intervalo: Perfeito, Maior, Menor',
      subtitle: 'Classificar intervalos pelo número e pela qualidade',
      objectives: [
        'Compreender que os intervalos têm um número (distância) e uma qualidade (carácter)',
        'Classificar intervalos perfeitos: uníssono, 4.a, 5.a, oitava',
        'Classificar intervalos maiores e menores: 2.a, 3.a, 6.a, 7.a',
      ],
      concepts: [
        {
          title: 'O Sistema de Qualidades',
          explanation:
            'No Nível 1, mediste intervalos por número: uma 3.a, uma 5.a. Agora acrescenta a qualidade -- que refina o número com um carácter preciso. Os intervalos perfeitos (uníssono, 4.a, 5.a, oitava) ocorrem naturalmente entre a tónica e os 4.o/5.o graus. Os intervalos maiores (2.a, 3.a, 6.a, 7.a) ocorrem entre a tónica e os graus superiores numa escala maior. Os intervalos menores são meio-tom mais pequenos que os maiores.',
          tryThisLabel: 'Vê todos os intervalos da escala maior a partir de C',
        },
        {
          title: 'Como Determinar a Qualidade',
          explanation:
            'Método: (1) Conta os nomes das notas para obter o número do intervalo. (2) Conta os meios-tons. (3) Compara com a escala maior: se a nota superior pertence à escala maior da nota inferior, é maior (para 2, 3, 6, 7) ou perfeito (para 1, 4, 5, 8). (4) Meio-tom mais pequeno que maior = menor.',
          tryThisLabel: 'Ouve uma 3.a menor em C menor',
        },
        {
          title: 'Ouvir a Diferença',
          explanation:
            'Os intervalos perfeitos soam "abertos" e "ocos" -- estáveis e fortes. Os intervalos maiores soam brilhantes e amplos. Os intervalos menores são meio-tom mais estreitos e soam mais sombrios, mais emocionais. Toca C a E (3.a maior) e depois C a Eb (3.a menor) -- a diferença de meio-tom cria um carácter completamente diferente.',
          tryThisLabel: 'Ouve a 3.a maior num acorde',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "C major chord" e depois "Cm" -- a única diferença é E vs. Eb. 3.a maior (4 meios-tons) vs. 3.a menor (3 meios-tons). Um meio-tom muda tudo',
        },
        {
          instruction:
            'Escreve "C major scale" -- cada intervalo de C a cada nota superior é perfeito (4.a, 5.a, oitava) ou maior (2.a, 3.a, 6.a, 7.a). Este é o conjunto de referência',
        },
        {
          instruction:
            'Qual é a qualidade do intervalo de C a F? Conta: C-D-E-F = 4.a. F pertence à escala de C maior, portanto é uma 4.a perfeita',
        },
      ],
    },

    // ── U7 M2: Augmented, Diminished, and Compound Intervals ──────────────
    l2u7m2: {
      title: 'Intervalos Aumentados, Diminutos e Compostos',
      subtitle: 'Os extremos da qualidade de intervalos e intervalos além da oitava',
      objectives: [
        'Compreender aumentado como meio-tom maior que perfeito ou maior',
        'Compreender diminuto como meio-tom menor que perfeito ou menor',
        'Identificar intervalos compostos (9.a, 10.a, 11.a, 13.a) e o trítono',
      ],
      concepts: [
        {
          title: 'Aumentado e Diminuto',
          explanation:
            'Aumentado significa meio-tom maior que perfeito ou maior. Diminuto significa meio-tom menor que perfeito ou menor. Uma 5.a perfeita (7 meios-tons) torna-se aumentada com 8 meios-tons ou diminuta com 6. O intervalo de 6 meios-tons -- o trítono -- tem dois nomes: 4.a aumentada ou 5.a diminuta. O mesmo som, grafia diferente.',
          tryThisLabel: 'Ouve o trítono dentro de C7',
        },
        {
          title: 'O Trítono',
          explanation:
            'O trítono divide a oitava exatamente ao meio e é o intervalo mais instável na música tonal. Desempenha um papel crítico nos acordes de dominante com 7.a, onde cria a tensão que impulsiona a resolução. Dentro de C7, o trítono situa-se entre E e Bb -- ambas as notas exigem resolução.',
          tryThisLabel: 'Ouve a 5.a diminuta em Cdim',
        },
        {
          title: 'Intervalos Compostos',
          explanation:
            'Intervalos maiores que uma oitava são intervalos compostos. Uma 9.a = oitava + 2.a. Uma 10.a = oitava + 3.a. Uma 11.a = oitava + 4.a. Uma 13.a = oitava + 6.a. As regras de qualidade mantêm-se: uma 9.a maior tem a mesma qualidade que uma 2.a maior. Estes intervalos tornam-se importantes nos acordes com extensões.',
          tryThisLabel: 'A 9.a é uma 2.a composta',
        },
      ],
      tasks: [
        {
          instruction:
            'Qual é o intervalo de C a F#? Conta as letras (C-D-E-F = 4.a). F pertence a C maior mas F# está meio-tom acima, portanto é uma 4.a aumentada -- um trítono',
        },
        {
          instruction:
            'Escreve "C7" e ouve -- o trítono entre E e Bb é o que dá ao acorde de dominante com 7.a a sua tensão e necessidade de resolver',
        },
        {
          instruction:
            'Escreve "Cmaj9" -- a 9.a (D) é o 2.o grau uma oitava acima. Qual é a qualidade de C a D? 2.a maior, portanto 9.a maior',
        },
      ],
    },

    // ── U7 M3: The Four Triad Types ───────────────────────────────────────
    l2u7m3: {
      title: 'Os Quatro Tipos de Tríades',
      subtitle: 'Maior, menor, diminuta, aumentada -- construir e identificar os quatro',
      objectives: [
        'Construir os quatro tipos de tríades a partir de qualquer fundamental usando terças empilhadas',
        'Compreender a distinção de estabilidade: 5.a perfeita vs. 5.a alterada',
        'Ouvir o som característico de cada qualidade',
      ],
      concepts: [
        {
          title: 'Quatro Qualidades de Tríades',
          explanation:
            'Toda a tríade empilha duas terças. Maior = 3.a maior + 3.a menor (3.aM+3.am), da fundamental à 5.a é uma 5.a perfeita. Menor = 3.a menor + 3.a maior (3.am+3.aM), da fundamental à 5.a continua a ser uma 5.a perfeita. Diminuta = 3.a menor + 3.a menor (3.am+3.am), da fundamental à 5.a é uma 5.a diminuta. Aumentada = 3.a maior + 3.a maior (3.aM+3.aM), da fundamental à 5.a é uma 5.a aumentada.',
          tryThisLabel: 'Ouve a tríade maior estável',
        },
        {
          title: 'Estável vs. Instável',
          explanation:
            'Maior e menor são estáveis -- ambas têm uma 5.a perfeita, que proporciona uma base sólida. Diminuta soa tensa e comprimida -- a sua 5.a diminuta comprime o acorde. Aumentada soa estranha e sem resolução -- a sua 5.a aumentada expande o acorde. Estabilidade vs. instabilidade é determinada pelo facto de a 5.a ser perfeita ou alterada.',
          tryThisLabel: 'Ouve diminuta -- tensa e comprimida',
        },
        {
          title: 'Ler Cifras de Acordes',
          explanation:
            'Letra sozinha = maior (C). Letra minúscula "m" = menor (Cm). "dim" ou "o" = diminuta (Cdim). "aug" ou "+" = aumentada (Caug). Estas cifras indicam-te a fundamental e a qualidade de relance.',
          tryThisLabel: 'Ouve aumentada -- flutuante e sem resolução',
        },
      ],
      tasks: [
        {
          instruction:
            'Constrói as quatro tríades de C: "C major chord", "Cm", "Cdim", "Caug" -- quais duas soam estáveis? Quais duas soam instáveis?',
        },
        {
          instruction:
            'Escreve "Fdim" e conta: da fundamental à 3.a são 3 meios-tons (3.am), da 3.a à 5.a são 3 meios-tons (3.am). Ambas as terças são menores -- é o que a torna diminuta',
        },
        {
          instruction:
            'Escreve "Caug" e conta: da fundamental à 3.a são 4 meios-tons (3.aM), da 3.a à 5.a são 4 meios-tons (3.aM). Ambas as terças são maiores -- aumentada',
        },
      ],
    },

    // ── U7 M4: Triad Inversions and Figured Bass ──────────────────────────
    l2u7m4: {
      title: 'Inversões de Tríades e Baixo Cifrado',
      subtitle: 'As mesmas notas, baixo diferente -- estado fundamental, 1.a inversão, 2.a inversão',
      objectives: [
        'Compreender estado fundamental, 1.a inversão e 2.a inversão de tríades',
        'Ler cifras de baixo cifrado: 5/3, 6/3 (ou apenas 6) e 6/4',
        'Usar notação de barra para inversões: C/E = 1.a inversão, C/G = 2.a inversão',
      ],
      concepts: [
        {
          title: 'Três Posições',
          explanation:
            'Uma tríade tem três notas, portanto tem três notas de baixo possíveis. O estado fundamental coloca a fundamental no baixo -- a disposição mais sólida. A 1.a inversão coloca a 3.a no baixo -- mais leve e melódica. A 2.a inversão coloca a 5.a no baixo -- instável, com a 4.a acima do baixo historicamente tratada como dissonância que requer resolução.',
          tryThisLabel: 'Ouve estado fundamental -- C no baixo',
        },
        {
          title: 'Baixo Cifrado',
          explanation:
            'Os números do baixo cifrado descrevem intervalos acima da nota do baixo. Estado fundamental = 5/3 (uma 5.a e uma 3.a acima do baixo). 1.a inversão = 6/3 (abreviado para apenas 6). 2.a inversão = 6/4. Esta era a notação padrão na era barroca e continua a ser central na análise de teoria musical.',
          tryThisLabel: '1.a inversão = posição 6',
        },
        {
          title: 'Porque Importam as Inversões',
          explanation:
            'As inversões permitem que os acordes se liguem suavemente. Em vez de saltar entre acordes no estado fundamental, as inversões criam linhas de baixo por grau conjunto -- o ingrediente mais importante de uma condução de vozes elegante. Uma linha de baixo que se move por grau conjunto soa mais polida do que uma que salta constantemente.',
          tryThisLabel: '2.a inversão = posição 6/4',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "C major chord", "C/E" e "C/G" em sequência -- as mesmas três notas, mas ouve como o carácter muda com cada nota no baixo',
        },
        {
          instruction:
            'Escreve "C/E" -- E está no baixo. Os intervalos acima são uma 3.a (E a G) e uma 6.a (E a C). É por isso que se chama posição 6',
        },
        {
          instruction:
            'Escreve "Am/C" -- A menor com C no baixo. C é a 3.a de Am, portanto é 1.a inversão. Ouve como soa mais leve do que Am no estado fundamental',
        },
      ],
    },

    // ── U7 M5: Diatonic Triads and Roman Numerals ─────────────────────────
    l2u7m5: {
      title: 'Tríades Diatónicas e Numeração Romana',
      subtitle: 'Os sete acordes que pertencem a cada tonalidade maior -- e como os nomear',
      objectives: [
        'Construir uma tríade em cada grau da escala maior usando apenas notas dessa escala',
        'Conhecer o padrão de qualidades: I-ii-iii-IV-V-vi-viio',
        'Ler numeração romana: maiúscula = maior, minúscula = menor, o = diminuta',
      ],
      concepts: [
        {
          title: 'Construir Tríades Diatónicas',
          explanation:
            'Constrói uma tríade em cada grau da escala maior usando apenas notas dessa escala. Em C maior: C-E-G (maior), D-F-A (menor), E-G-B (menor), F-A-C (maior), G-B-D (maior), A-C-E (menor), B-D-F (diminuta). O padrão de qualidades é sempre I-ii-iii-IV-V-vi-viio -- em todas as tonalidades maiores. Só os nomes das notas mudam.',
          tryThisLabel: 'Vê todas as tríades diatónicas em C',
        },
        {
          title: 'Convenções de Numeração Romana',
          explanation:
            'Algarismos romanos maiúsculos indicam tríades maiores (I, IV, V). Minúsculos indicam tríades menores (ii, iii, vi). O símbolo de grau (o) indica diminuta (viio). Esta notação é universal -- funciona em qualquer tonalidade. Quando vês I-IV-V, sabes as funções dos acordes independentemente das notas específicas usadas.',
          tryThisLabel: 'Vê o mesmo padrão em G maior',
        },
        {
          title: 'Porque o Padrão é Fixo',
          explanation:
            'O padrão de intervalos T-T-mT-T-T-T-mT da escala maior força combinações específicas de intervalos em cada grau. Os meios-tons entre os graus 3-4 e 7-1 criam a tríade diminuta no viio e determinam quais tríades são maiores ou menores. Muda a escala e mudas o padrão -- que é exatamente o que acontece nas tonalidades menores.',
          tryThisLabel: 'Verifica o padrão em D maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre "key of C" -- toca cada acorde diatónico. Antes de tocar, prevê se vai soar maior ou menor com base no algarismo romano',
        },
        {
          instruction:
            'Abre "key of G" -- verifica o mesmo padrão I-ii-iii-IV-V-vi-viio com nomes de notas diferentes',
        },
        {
          instruction:
            'Abre "key of Eb" -- nomeia as sete tríades diatónicas. Que notas compõem o acorde ii?',
        },
      ],
    },
  },
};

export default curriculumL2;
