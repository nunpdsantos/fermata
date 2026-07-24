import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese translations for Level 9 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidade 30: Treino de Altura e Intervalos
  // =========================================================================

  // ---- l9u30m1: Correspondencia de Altura/Direcao ----

  l9u30m1e1: {
    prompt:
      'Ouve esta altura e identifica-a.',
    hint: 'O Do central (C4) e o ponto de referencia central no piano -- ancora-o no teu ouvido.',
  },
  l9u30m1e2: {
    prompt:
      'Ouve esta altura e identifica-a.',
    hint: 'G4 esta uma 5.a perfeita acima do Do central -- 7 semitons acima. Compara-o com C4 no teu ouvido.',
  },
  l9u30m1e3: {
    prompt:
      'Quando uma segunda altura soa mais aguda do que a primeira, qual e a direcao do movimento de altura?',
    choices: [
      'Ascendente',
      'Descendente',
      'Obliquo',
      'Estatico',
    ],
    hint: 'Ascendente significa mover-se para cima em altura. Descendente significa mover-se para baixo.',
  },
  l9u30m1e4: {
    prompt: 'O que significa "registo" em musica?',
    choices: [
      'A posicao relativa de agudo ou grave numa faixa de alturas',
      'O nivel de volume de uma interpretacao',
      'A velocidade a que as notas sao tocadas',
      'O numero de instrumentos a tocar simultaneamente',
    ],
    hint: 'Registo descreve uma porcao do espetro de alturas -- registo grave, registo medio ou registo agudo.',
  },

  // ---- l9u30m2: Reconhecimento Maior vs Menor ----

  l9u30m2e1: {
    prompt:
      'Ouve este acorde. E maior ou menor?',
    choices: ['Maior', 'Menor'],
    hint: 'A 3.a maior (4 semitons a partir da fundamental) da aos acordes maiores um caracter brilhante e estavel.',
  },
  l9u30m2e2: {
    prompt:
      'Ouve este acorde. E maior ou menor?',
    choices: ['Maior', 'Menor'],
    hint: 'A 3.a menor (3 semitons a partir da fundamental) da aos acordes menores uma qualidade mais sombria e melancolica.',
  },
  l9u30m2e3: {
    prompt:
      'Qual e a diferenca estrutural entre uma triade maior e uma triade menor?',
    choices: [
      'A terceira e baixada meio-tom no menor',
      'A quinta e baixada meio-tom no menor',
      'A fundamental e elevada meio-tom no menor',
      'Triades menores tem quatro notas em vez de tres',
    ],
    hint: 'Triade maior: fundamental + 3.a maior (4 semitons) + 5.a P. Triade menor: fundamental + 3.a menor (3 semitons) + 5.a P. So a 3.a muda.',
  },

  // ---- l9u30m3: Reconhecimento de Intervalos P1-P5 ----

  l9u30m3e1: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '1 semitom = 2.a menor (meio-tom) -- o menor intervalo na musica ocidental. Pensa no tema de Tubarao.',
  },
  l9u30m3e2: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '2 semitons = 2.a maior (tom). O passo melodico do dia a dia.',
  },
  l9u30m3e3: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '3 semitons = 3.a menor -- sombria e melancolica. Este intervalo define a base de uma triade menor.',
  },
  l9u30m3e4: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '7 semitons = 5.a perfeita -- forte e aberta. O intervalo mais consonante depois da oitava e do unissono.',
  },

  // ---- l9u30m4: Reconhecimento de Intervalos 6.a m-P8 ----

  l9u30m4e1: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '8 semitons = 6.a menor -- agridoce e anelante, com uma qualidade pungente e algo tensa.',
  },
  l9u30m4e2: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '9 semitons = 6.a maior -- quente, romantica e consonante.',
  },
  l9u30m4e3: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '10 semitons = 7.a menor -- uma tensao dominante e bluesy que quer resolver.',
  },
  l9u30m4e4: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '12 semitons = oitava perfeita -- as duas notas soam como a mesma altura em registos diferentes.',
  },

  // ---- l9u30m5: Intervalos Harmonicos ----

  l9u30m5e1: {
    prompt:
      'Ouve estas duas notas tocadas em simultaneo e identifica o intervalo harmonico.',
    hint: '5 semitons = 4.a perfeita. Em simultaneo tem uma qualidade aberta e oca.',
  },
  l9u30m5e2: {
    prompt:
      'Ouve estas duas notas tocadas em simultaneo e identifica o intervalo harmonico.',
    hint: '4 semitons = 3.a maior -- um som harmonico quente e consonante.',
  },
  l9u30m5e3: {
    prompt:
      'Qual e a diferenca entre um intervalo harmonico e um intervalo melodico?',
    choices: [
      'Intervalos harmonicos soam simultaneamente; intervalos melodicos soam em sequencia',
      'Intervalos harmonicos sao consonantes; intervalos melodicos sao dissonantes',
      'Intervalos harmonicos usam sustenidos; intervalos melodicos usam bemois',
      'Intervalos harmonicos abrangem mais de uma oitava; intervalos melodicos nao',
    ],
    hint: 'Harmonico = ambas as notas ao mesmo tempo. Melodico = uma nota apos a outra. As mesmas duas notas podem formar qualquer tipo.',
  },

  // =========================================================================
  // Unidade 31: Escalas, Acordes e Ditado
  // =========================================================================

  // ---- l9u31m1: Reconhecimento de Escalas Maior/Menor ----

  l9u31m1e1: {
    prompt:
      'Ouve esta escala e identifica o seu tipo.',
    choices: ['Maior', 'Menor natural', 'Menor harmonica'],
    hint: 'A escala maior (T-T-mT-T-T-T-mT) tem um caracter brilhante e resolvido em cada passo.',
  },
  l9u31m1e2: {
    prompt:
      'Ouve esta escala e identifica o seu tipo.',
    choices: ['Maior', 'Menor natural', 'Menor harmonica'],
    hint: 'A menor natural (T-mT-T-T-mT-T-T) tem uma atmosfera mais sombria do que a maior -- a 3.a, 6.a e 7.a baixadas moldam a sua cor.',
  },
  l9u31m1e3: {
    prompt:
      'Qual descreve melhor o caracter geral de uma escala maior?',
    choices: [
      'Brilhante, alegre e resolvido',
      'Sombrio, triste e tenso',
      'Misterioso e ambiguo',
      'Dissonante e instavel',
    ],
    hint: 'As escalas maiores sao percebidas como brilhantes e estaveis. A 3.a maior e a 7.a maior contribuem para este caracter positivo.',
  },

  // ---- l9u31m2: Reconhecimento de Modos ----

  l9u31m2e1: {
    prompt:
      'Ouve esta escala e identifica o modo.',
    choices: ['Dorico', 'Frigio', 'Lidio', 'Mixolidio'],
    hint: 'O Dorico e como o menor natural com o 6.o grau elevado -- esse 6 natural em contexto menor e a nota caracteristica.',
  },
  l9u31m2e2: {
    prompt:
      'Ouve esta escala e identifica o modo.',
    choices: ['Dorico', 'Frigio', 'Lidio', 'Mixolidio'],
    hint: 'O Lidio e como o maior com o 4.o grau elevado -- ouve o #4 brilhante a puxar para cima.',
  },
  l9u31m2e3: {
    prompt:
      'Qual e a nota caracteristica que distingue o Dorico do menor natural?',
    choices: [
      'Um 6.o grau elevado',
      'Um 2.o grau baixado',
      'Um 7.o grau elevado',
      'Um 5.o grau baixado',
    ],
    hint: 'O Dorico difere do menor natural por uma nota: o 6.o grau e elevado meio-tom. Em D Dorico, e B natural em vez de Bb.',
  },

  // ---- l9u31m3: Pentatonica/Blues/Simetrica ----

  l9u31m3e1: {
    prompt:
      'Ouve esta escala e identifica o seu tipo.',
    choices: ['Pentatonica maior', 'Pentatonica menor', 'Blues', 'Tons inteiros'],
    hint: 'A pentatonica maior tem cinco notas e nenhum meio-tom -- a escala maior sem o 4.o e o 7.o graus.',
  },
  l9u31m3e2: {
    prompt:
      'Ouve esta escala e identifica o seu tipo.',
    choices: ['Pentatonica maior', 'Pentatonica menor', 'Blues', 'Tons inteiros'],
    hint: 'A escala de blues e a pentatonica menor mais a "blue note" (b5) -- ouve essa mordida cromatica extra.',
  },
  l9u31m3e3: {
    prompt: 'O que e a "blue note" numa escala de blues?',
    choices: [
      'A nota cromatica entre o 4.o e o 5.o graus (5.a bemolizada / 4.a sustenida)',
      'A 3.a menor de qualquer acorde',
      'Qualquer nota tocada com vibrato',
      'A sensivel da tonalidade',
    ],
    hint: 'A blue note e a b5 (ou #4) acrescentada a pentatonica menor. Em C blues, e Gb/F#, entre F e G.',
  },

  // ---- l9u31m4: Reconhecimento de Qualidade de Triades ----

  l9u31m4e1: {
    prompt:
      'Ouve esta triade e identifica a sua qualidade.',
    choices: ['Maior', 'Menor', 'Diminuta', 'Aumentada'],
    hint: 'Diminuta = duas 3.as menores empilhadas. O tritono entre fundamental e 5.a cria a sua qualidade tensa e instavel.',
  },
  l9u31m4e2: {
    prompt:
      'Ouve esta triade e identifica a sua qualidade.',
    choices: ['Maior', 'Menor', 'Diminuta', 'Aumentada'],
    hint: 'Aumentada = duas 3.as maiores empilhadas. A estrutura simetrica da-lhe uma qualidade sonhadora e nao resolvida.',
  },
  l9u31m4e3: {
    prompt: 'Que intervalos compoem uma triade diminuta?',
    choices: [
      'Fundamental, 3.a menor e 5.a diminuta (tritono)',
      'Fundamental, 3.a maior e 5.a perfeita',
      'Fundamental, 3.a menor e 5.a perfeita',
      'Fundamental, 3.a maior e 5.a aumentada',
    ],
    hint: 'Diminuta = 3.a menor (3 semitons) + 5.a diminuta (6 semitons). Duas 3.as menores empilhadas produzem o tritono entre fundamental e 5.a.',
  },
  l9u31m4e4: {
    prompt: 'Como descreverias o som de uma triade aumentada?',
    choices: [
      'Tensa e nao resolvida com uma qualidade sonhadora e flutuante',
      'Brilhante e estavel como um acorde maior',
      'Sombria e pesada como um acorde menor',
      'Oca e medieval como um power chord',
    ],
    hint: 'Triades aumentadas dividem a oitava em tres partes iguais (3.a M + 3.a M). Esta simetria cria uma sensacao ambigua e suspensa.',
  },

  // ---- l9u31m5: Qualidade de Acordes de Setima ----

  l9u31m5e1: {
    prompt:
      'Ouve este acorde de setima e identifica a sua qualidade.',
    choices: ['Maior com 7.a', 'Menor com 7.a', 'Setima da dominante', 'Meio-diminuto'],
    hint: 'O acorde maior com 7.a sobrepoe uma 7.a maior a uma triade maior -- exuberante e sonhador, comum no jazz e na bossa nova.',
  },
  l9u31m5e2: {
    prompt:
      'Ouve este acorde de setima e identifica a sua qualidade.',
    choices: ['Maior com 7.a', 'Menor com 7.a', 'Setima da dominante', 'Meio-diminuto'],
    hint: 'O acorde menor com 7.a sobrepoe uma 7.a menor a uma triade menor -- suave, quente e descontraido.',
  },
  l9u31m5e3: {
    prompt:
      'O que da a um acorde de 7.a dominante a sua sensacao caracteristica de tensao e desejo de resolver?',
    choices: [
      'O tritono formado entre a 3.a maior e a 7.a menor',
      'A 5.a perfeita entre fundamental e 5.a',
      'A 3.a maior entre fundamental e 3.a',
      'A duplicacao a oitava da fundamental',
    ],
    hint: 'Em G7 (G-B-D-F), B e F formam um tritono (6 semitons). Esta dissonancia cria a atracao para resolucao a C maior.',
  },
  l9u31m5e4: {
    prompt:
      'Em que contexto musical e o acorde de setima meio-diminuto mais frequentemente encontrado?',
    choices: [
      'Como acorde ii em tonalidades menores (p. ex. Bm7b5 em A menor)',
      'Como acorde I em tonalidades maiores',
      'Como acorde V em tonalidades maiores',
      'Como acorde IV em progressoes de blues',
    ],
    hint: 'O acorde de setima meio-diminuto (m7b5) ocorre naturalmente no 2.o grau da menor harmonica. Serve como acorde predominante conduzindo ao V em progressoes ii-V-i menores.',
  },

  // =========================================================================
  // Unidade 32: Ditado, Leitura a Primeira Vista, Contextual
  // =========================================================================

  // ---- l9u32m1: Ditado Melodico Diatonico ----

  l9u32m1e1: {
    prompt:
      'Ouve esta nota e identifica-a.',
    hint: 'Esta altura e o 3.o grau de C maior. Canta a partir de C para a localizar.',
  },
  l9u32m1e2: {
    prompt:
      'Ouve esta nota e identifica-a.',
    hint: 'Esta altura e o 6.o grau de C maior. Canta a partir de C para a localizar.',
  },
  l9u32m1e3: {
    prompt: 'O que significa "melodia diatonica"?',
    choices: [
      'Uma melodia que usa apenas as notas da tonalidade ou escala predominante',
      'Uma melodia que usa sustenidos e bemois fora da tonalidade',
      'Uma melodia tocada apenas numa corda da guitarra',
      'Uma melodia que se move exclusivamente por graus',
    ],
    hint: 'Diatonico significa "pertencente a tonalidade." Uma melodia diatonica em C maior usa apenas C, D, E, F, G, A e B -- sem acidentes.',
  },
  l9u32m1e4: {
    prompt:
      'Qual estrategia e mais eficaz para identificar graus individuais da escala numa melodia?',
    choices: [
      'Relacionar cada nota com a tonica cantando a escala ate esse grau',
      'Memorizar a frequencia em hertz de cada nota',
      'Contar o numero de linhas suplementares na pauta',
      'Tocar a melodia ao contrario para verificar a resposta',
    ],
    hint: 'Ouvir graus da escala significa perceber cada nota em relacao a tonica. Cantar desde "do" ate a nota alvo e um metodo fiavel.',
  },

  // ---- l9u32m2: Ditado Melodico Cromatico ----

  l9u32m2e1: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: 'Um meio-tom cromatico (1 semitom) num contexto melodico funciona frequentemente como nota de passagem.',
  },
  l9u32m2e2: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: 'O tritono (6 semitons, 4.a aumentada / 5.a diminuta) e o intervalo mais dissonante e divide a oitava exatamente ao meio.',
  },
  l9u32m2e3: {
    prompt: 'O que e uma nota cromatica de passagem?',
    choices: [
      'Uma nota fora da tonalidade que preenche um tom entre duas notas diatonicas',
      'Qualquer nota tocada com acento',
      'A primeira nota de uma escala cromatica',
      'Uma nota sustentada para la da barra de compasso',
    ],
    hint: 'Uma nota cromatica de passagem e uma nota nao diatonica que liga duas notas diatonicas a um tom de distancia, dividindo esse tom em dois meios-tons.',
  },

  // ---- l9u32m3: Ditado Harmonico ----

  l9u32m3e1: {
    prompt:
      'Uma frase termina com V movendo para I, ambos em posicao fundamental, com a melodia chegando a tonica. Que tipo de cadencia e esta?',
    choices: [
      'Cadencia autentica perfeita (CAP)',
      'Meia cadencia',
      'Cadencia plagal',
      'Cadencia deceptiva',
    ],
    hint: 'Uma cadencia autentica perfeita (CAP) requer V para I em posicao fundamental com a tonica no soprano. Proporciona a sensacao mais forte de finalidade.',
  },
  l9u32m3e2: {
    prompt:
      'Uma frase musical faz pausa no acorde de V sem resolver. Que tipo de cadencia e esta?',
    choices: [
      'Meia cadencia',
      'Cadencia autentica perfeita',
      'Cadencia plagal',
      'Cadencia deceptiva',
    ],
    hint: 'Uma meia cadencia termina em V, criando uma sensacao de suspensao ou incompletude -- como uma virgula em vez de um ponto final.',
  },
  l9u32m3e3: {
    prompt:
      'Esperas que V resolva para I, mas em vez disso move-se para vi. Que tipo de cadencia produz esta surpresa?',
    choices: [
      'Cadencia deceptiva',
      'Meia cadencia',
      'Cadencia autentica perfeita',
      'Cadencia plagal',
    ],
    hint: 'Uma cadencia deceptiva substitui vi pelo I esperado apos V. O ouvido espera resolucao mas recebe um desvio surpresa.',
  },

  // ---- l9u32m4: Leitura a Primeira Vista ----

  l9u32m4e1: {
    prompt:
      'No solfejo movel, que silaba e sempre atribuida a tonica da tonalidade atual?',
    choices: ['Do', 'La', 'Sol', 'Re'],
    hint: 'No solfejo movel, "Do" representa sempre a tonica independentemente da tonalidade. Em C maior, Do = C. Em G maior, Do = G.',
  },
  l9u32m4e2: {
    prompt:
      'Na tonalidade de C maior, que nota corresponde a silaba de solfejo "Mi"?',
    choices: ['E', 'D', 'F', 'G'],
    hint: 'Do-Re-Mi-Fa-Sol-La-Ti mapeia para os 7 graus da escala. Em C maior: C(Do), D(Re), E(Mi), F(Fa), G(Sol), A(La), B(Ti).',
  },
  l9u32m4e3: {
    prompt:
      'Qual e o passo de preparacao mais importante antes de ler a primeira vista uma melodia?',
    choices: [
      'Estabelecer a tonica cantando a escala ou arpejo da tonalidade',
      'Memorizar a melodia inteira antes de comecar',
      'Ler a letra primeiro',
      'Contar o numero total de notas',
    ],
    hint: 'Estabelecer o centro tonal (tonica) no ouvido e essencial. Cantar uma escala ou arpejo de tonica rapidos ancora a tua percecao de altura antes de ler a melodia.',
  },

  // ---- l9u32m5: Audicao Contextual ----

  l9u32m5e1: {
    prompt:
      'Uma linha vocal unica sem acompanhamento nem harmonia e exemplo de que textura musical?',
    choices: [
      'Monofonica',
      'Homofonica',
      'Polifonica',
      'Heterofonica',
    ],
    hint: 'A textura monofonica consiste numa unica linha melodica sem acompanhamento nem harmonia. Uma voz, uma linha.',
  },
  l9u32m5e2: {
    prompt:
      'Uma cancao alterna entre uma secao recorrente e secoes contrastantes (A-B-A-B). Que forma e esta?',
    choices: [
      'Forma estrofe-refrão',
      'Forma through-composed',
      'Forma rondo',
      'Forma sonata',
    ],
    hint: 'A forma estrofe-refrão alterna estrofes (letras diferentes, mesma melodia) com um refrão recorrente. E a estrutura mais comum na musica popular.',
  },
  l9u32m5e3: {
    prompt:
      'Que caracteristica musical e mais util para identificar o periodo estilistico historico de uma peca?',
    choices: [
      'A combinacao de instrumentacao, linguagem harmonica e estrutura formal',
      'A indicacao de andamento sozinha',
      'A armacao de clave sozinha',
      'O numero de compassos na peca',
    ],
    hint: 'Os periodos estilisticos sao identificados por uma combinacao de fatores: instrumentacao (cravo vs. piano), vocabulario harmonico (triadico vs. cromatico) e convencoes formais (binaria vs. forma sonata).',
  },
};

export default overlay;
