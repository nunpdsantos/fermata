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
      'Identifica esta altura mostrada na pauta.',
    hint: 'O Do central (C4) e o ponto de referencia central no piano, situado na linha suplementar abaixo da pauta em clave de sol.',
  },
  l9u30m1e2: {
    prompt:
      'Ouve esta altura e identifica-a. Esta uma 5.a perfeita acima do Do central.',
    hint: 'G4 esta uma 5.a perfeita acima de C4 -- 7 semitons acima. Situa-se na segunda linha da pauta em clave de sol.',
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
      'Constroi uma triade de C maior. Ouve a sua qualidade brilhante e estavel a medida que selecionas as notas.',
    hint: 'C maior = C, E, G. A 3.a maior (4 semitons a partir da fundamental) da-lhe um caracter brilhante.',
  },
  l9u30m2e2: {
    prompt:
      'Constroi uma triade de C menor. Ouve como a 3.a baixada muda a atmosfera comparada com o maior.',
    hint: 'C menor = C, Eb, G. A 3.a menor (3 semitons a partir da fundamental) da-lhe uma qualidade mais sombria e melancolica.',
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
      'Ouve este intervalo ascendente a partir de C. E o menor intervalo na musica ocidental. Identifica-o.',
    hint: '1 semitom = 2.a menor (meio-tom). C a Db. Pensa no tema de Tubarao.',
  },
  l9u30m3e2: {
    prompt:
      'Ouve este intervalo ascendente a partir de C. Abrange um tom. Identifica-o.',
    hint: '2 semitons = 2.a maior (tom). C a D.',
  },
  l9u30m3e3: {
    prompt:
      'Ouve este intervalo ascendente a partir de C. Tem uma qualidade sombria e melancolica. Identifica-o.',
    hint: '3 semitons = 3.a menor. C a Eb. Este intervalo define a base de uma triade menor.',
  },
  l9u30m3e4: {
    prompt:
      'Ouve este intervalo ascendente a partir de C. Soa forte e aberto. Identifica-o.',
    hint: '7 semitons = 5.a perfeita. C a G. O intervalo mais consonante depois da oitava e do unissono.',
  },

  // ---- l9u30m4: Reconhecimento de Intervalos 6.a m-P8 ----

  l9u30m4e1: {
    prompt:
      'Ouve este intervalo ascendente a partir de C. Tem uma qualidade agridoce e anelante. Identifica-o.',
    hint: '8 semitons = 6.a menor. C a Ab. Tem uma qualidade pungente, algo tensa.',
  },
  l9u30m4e2: {
    prompt:
      'Ouve este intervalo ascendente a partir de C. Tem uma qualidade quente e romantica. Identifica-o.',
    hint: '9 semitons = 6.a maior. C a A. Um intervalo quente e consonante.',
  },
  l9u30m4e3: {
    prompt:
      'Ouve este intervalo ascendente a partir de C. Cria forte tensao querendo resolver. Identifica-o.',
    hint: '10 semitons = 7.a menor. C a Bb. Tem uma tensao dominante e bluesy.',
  },
  l9u30m4e4: {
    prompt:
      'Ouve este intervalo ascendente a partir de C. As duas notas soam como a mesma altura em alturas diferentes. Identifica-o.',
    hint: '12 semitons = oitava perfeita. C4 a C5. As duas alturas partilham o mesmo nome de nota.',
  },

  // ---- l9u30m5: Intervalos Harmonicos ----

  l9u30m5e1: {
    prompt:
      'Estas duas notas soam simultaneamente a partir de D. O intervalo e aberto e estavel. Identifica-o.',
    hint: '5 semitons = 4.a perfeita. D a G. Quando tocados em simultaneo, tem uma qualidade aberta e oca.',
  },
  l9u30m5e2: {
    prompt:
      'Estas duas notas soam simultaneamente a partir de E. O intervalo e brilhante e doce. Identifica-o.',
    hint: '4 semitons = 3.a maior. E a G#. A 3.a maior da um som harmonico quente e consonante.',
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
      'Constroi a escala de C maior. Ouve o caracter brilhante e resolvido de cada passo.',
    hint: 'C maior: C, D, E, F, G, A, B. Todas teclas brancas. Padrao: T-T-mT-T-T-T-mT.',
  },
  l9u31m1e2: {
    prompt:
      'Constroi a escala de A menor natural. Compara a sua atmosfera mais sombria com a escala maior.',
    hint: 'A menor natural: A, B, C, D, E, F, G. Todas teclas brancas. Padrao: T-mT-T-T-mT-T-T.',
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
      'Constroi a escala de D Dorico. E como o menor natural mas com o 6.o grau elevado.',
    hint: 'D Dorico: D, E, F, G, A, B, C. Todas teclas brancas comecando em D. O B natural (6.o elevado) e a nota caracteristica.',
  },
  l9u31m2e2: {
    prompt:
      'Constroi a escala de F Lidio. E como o maior mas com o 4.o grau elevado.',
    hint: 'F Lidio: F, G, A, B, C, D, E. Todas teclas brancas comecando em F. O B natural (4.o elevado) e a nota caracteristica.',
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
      'Constroi a escala pentatonica de C maior. Remove os meios-tons da escala maior.',
    hint: 'C pentatonica maior: C, D, E, G, A. Cinco notas -- a escala maior sem o 4.o e 7.o graus.',
  },
  l9u31m3e2: {
    prompt:
      'Constroi a escala de C blues. Acrescenta a "blue note" a pentatonica menor.',
    hint: 'C blues: C, Eb, F, Gb, G, Bb. Seis notas -- a pentatonica menor mais a 5.a bemolizada (Gb), que e a blue note.',
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
      'Constroi uma triade de E diminuto. Tem uma qualidade tensa e instavel.',
    hint: 'E diminuto = E, G, Bb. Duas 3.as menores empilhadas: E a G (3 semitons) e G a Bb (3 semitons). O tritono entre fundamental e 5.a cria tensao.',
  },
  l9u31m4e2: {
    prompt:
      'Constroi uma triade de C aumentado. Tem uma qualidade sonhadora e nao resolvida.',
    hint: 'C aumentado = C, E, G#. Duas 3.as maiores empilhadas: C a E (4 semitons) e E a G# (4 semitons). Estrutura simetrica.',
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
      'Constroi um acorde Cmaj7. Tem uma qualidade exuberante e sofisticada.',
    hint: 'Cmaj7 = C, E, G, B. Uma triade de C maior mais a 7.a maior (B, 11 semitons da fundamental). Comum no jazz e bossa nova.',
  },
  l9u31m5e2: {
    prompt:
      'Constroi um acorde Dm7. Tem uma qualidade suave e descontraida.',
    hint: 'Dm7 = D, F, A, C. Uma triade de D menor mais a 7.a menor (C, 10 semitons da fundamental).',
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
      'Ouve esta nota num contexto de C maior e identifica-a. E o 3.o grau da escala.',
    hint: 'E4 e o 3.o grau de C maior. Situa-se na primeira linha da pauta em clave de sol.',
  },
  l9u32m1e2: {
    prompt:
      'Ouve esta nota num contexto de C maior e identifica-a. E o 6.o grau da escala.',
    hint: 'A4 e o 6.o grau de C maior. Situa-se no segundo espaco da pauta em clave de sol.',
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
      'Qual estrategia e mais eficaz para ouvir graus individuais da escala numa melodia?',
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
      'Ouve este meio-tom cromatico ascendente a partir de E. Identifica o intervalo.',
    hint: '1 semitom ascendente a partir de E = E a F. Um meio-tom cromatico num contexto melodico funciona frequentemente como nota de passagem.',
  },
  l9u32m2e2: {
    prompt:
      'Ouve este intervalo altamente dissonante ascendente a partir de F. Divide a oitava exatamente ao meio. Identifica-o.',
    hint: '6 semitons = tritono (4.a aumentada / 5.a diminuta). F a B. E o intervalo mais dissonante e divide a oitava simetricamente.',
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
      'Ouves uma linha vocal unica sem acompanhamento nem harmonia. Que textura musical e esta?',
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
