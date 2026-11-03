import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese translations for Level 1 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {

  l1u33m1e1: {
    prompt: 'Uma parte de guitarra tem clave de sol com um pequeno 8 por baixo. Como soa o E4 escrito?',
    choices: [
      'Como E5',
      'Como E3',
      'Como E4',
      'Como B3'
    ],
    hint: 'O pequeno 8 por baixo da clave significa uma oitava abaixo: o E4 escrito soa como E3.'
  },
  l1u33m1e2: {
    prompt: 'O que indica ③ junto de uma nota de guitarra?',
    choices: [
      'Dedo 3',
      'Posição III',
      'Corda 3',
      'Trasto 3'
    ],
    hint: 'Um número em círculo indica a corda. Os números dos dedos da mão esquerda não têm círculo.'
  },
  l1u33m1e3: {
    prompt: 'Na afinação padrão da guitarra, que corda solta soa E2?',
    choices: [
      '⑥',
      '①',
      '④',
      '②'
    ],
    hint: 'A corda 6 é a mais grossa e grave: a sua altura solta é E2 na afinação padrão.'
  },
  l1u33m2e1: {
    prompt: 'Que dedo da mão esquerda indica o número 4?',
    choices: [
      'Indicador',
      'Anelar',
      'Médio',
      'Mindinho'
    ],
    hint: 'Os dedos da mão esquerda são 1 indicador, 2 médio, 3 anelar e 4 mindinho.'
  },
  l1u33m2e2: {
    prompt: 'O que significa 0 numa dedilhação de guitarra?',
    choices: [
      'Corda solta',
      'Dedo indicador',
      'Pestana completa',
      'Polegar direito'
    ],
    hint: 'Zero significa que nenhum dedo da mão esquerda prime a corda.'
  },
  l1u33m2e3: {
    prompt: 'Que ordem de dedos indica p-i-m-a?',
    choices: [
      'Polegar, anelar, médio, indicador',
      'Polegar, indicador, médio, anelar',
      'Indicador, médio, anelar, mindinho',
      'Anelar, médio, indicador, polegar'
    ],
    hint: 'As letras da mão direita são p polegar, i indicador, m médio e a anelar.'
  },
  l1u33m2e4: {
    prompt: 'Que letras significam polegar, anelar, médio, indicador?',
    choices: [
      'p-i-m-a',
      'i-m-a-p',
      'p-a-m-i',
      'a-m-i-p'
    ],
    hint: 'Lê as letras por ordem: p é polegar, a é anelar, m é médio e i é indicador.'
  },
  l1u33m3e1: {
    prompt: 'Na posição V, que trasto serve normalmente de base ao indicador?',
    choices: [
      'Trasto 4',
      'Trasto 5',
      'Trasto 6',
      'Trasto 7'
    ],
    hint: 'V significa quinta posição: o indicador tem como base o trasto 5.'
  },
  l1u33m3e2: {
    prompt: 'Que instrução dá CV na notação de guitarra?',
    choices: [
      'Pestana parcial no trasto 5',
      'Pestana completa no trasto 4',
      'Pestana parcial no trasto 4',
      'Pestana completa no trasto 5'
    ],
    hint: 'C indica uma pestana completa e V localiza-a no trasto 5. V sozinho indica a posição sem exigir uma pestana.'
  },
  l1u33m3e3: {
    prompt: 'Que indicação pede uma pestana parcial no trasto 5?',
    choices: [
      '½CV',
      'CV',
      'V',
      '⑤'
    ],
    hint: '½C pede uma pestana parcial; V indica o trasto. A partitura ou a dedilhação diz que cordas deves abranger.'
  }
,
  // =========================================================================
  // Unidade 1: Notação e Altura
  // =========================================================================

  // ---- l1u1m1: Pauta e Claves ----

  l1u1m1e1: {
    prompt:
      'Identifica esta nota na clave de sol: encontra-se numa pequena linha extra (uma linha suplementar) logo abaixo da pauta.',
    hint: 'O C central situa-se numa linha suplementar logo abaixo da pauta de clave de sol.',
    nudge: 'A clave de sol enrola-se em torno da segunda linha e marca-a como G. Conta para baixo a partir daí, uma letra por cada linha ou espaço, até chegares à linha suplementar abaixo da pauta.',
  },
  l1u1m1e2: {
    prompt:
      'Identifica esta nota: encontra-se na primeira linha da pauta de clave de sol.',
    hint: 'As linhas da clave de sol, de baixo para cima, são E-G-B-D-F. A primeira linha é E4.',
    nudge: 'A clave de sol enrola-se em torno da segunda linha e marca-a como G. Desce a partir daí, uma letra por cada espaço ou linha, até chegares à primeira linha.',
  },
  l1u1m1e3: {
    prompt:
      'Identifica esta nota: encontra-se na segunda linha da pauta de clave de sol.',
    hint: 'A clave de sol enrola-se em torno da segunda linha, marcando-a como G. Por isso também se chama clave de G.',
    nudge: 'Conta para cima a partir do C central (a linha suplementar logo abaixo da pauta), uma letra por cada linha ou espaço, até chegares a esta linha.',
  },
  l1u1m1e4: {
    prompt:
      'Qual é a clave que utiliza a segunda linha da pauta como ponto de referência para a nota G?',
    choices: [
      'Clave de sol',
      'Clave de fá',
      'Clave de dó (alto)',
      'Clave de percussão',
    ],
    hint: 'A clave de sol também se chama clave de G porque se enrola em torno da segunda linha, definindo-a como G.',
    nudge: 'Cada clave de altura definida nasceu de uma letra estilizada e fixa uma nota numa linha da pauta. Qual delas tem a espiral enrolada à volta da segunda linha a contar de baixo?',
  },

  // ---- l1u1m2: Linhas Suplementares ----

  l1u1m2e1: {
    prompt:
      'Identifica esta nota abaixo da pauta de clave de sol: encontra-se na segunda linha suplementar inferior.',
    hint: 'Abaixo da pauta de clave de sol: B3 está no espaço abaixo da primeira linha suplementar (C4), e A3 está na segunda linha suplementar.',
    nudge: 'Começa no C central, na primeira linha suplementar abaixo da pauta de clave de sol, e conta para baixo uma letra por cada linha ou espaço.',
  },
  l1u1m2e2: {
    prompt:
      'Identifica esta nota acima da pauta de clave de sol: encontra-se duas linhas suplementares acima da linha superior.',
    hint: 'C6 situa-se na segunda linha suplementar acima da pauta de clave de sol. Conta a partir da linha superior (F5): G5, A5, B5, C6.',
    nudge: 'Começa na linha superior da pauta de clave de sol (F5) e conta para cima uma letra por cada linha ou espaço: o espaço acima dela, a primeira linha suplementar, o espaço seguinte e, por fim, a segunda linha suplementar.',
  },
  l1u1m2e3: {
    prompt: 'Qual é a função das linhas suplementares?',
    choices: [
      'Escrever notas acima ou abaixo das cinco linhas da pauta',
      'Indicar a velocidade a que a peça deve ser tocada',
      'Mostrar que mão, direita ou esquerda, toca cada nota',
      'Mostrar onde ocorrem as pausas',
    ],
    hint: 'A pauta tem apenas cinco linhas. As notas que ultrapassam essas linhas necessitam de pequenas linhas adicionais para indicar a sua posição.',
  },
  l1u1m2e_ear1: {
    prompt: 'Ouve esta nota e identifica-a.',
    hint: 'Compara-a com a referência que ouviste primeiro: é mais aguda, mais grave ou exatamente a mesma nota?',
  },
  l1u1m2e_ear2: {
    prompt: 'Ouve esta nota e identifica-a.',
    hint: 'Esta nota natural situa-se na primeira linha da pauta de clave de sol.',
  },
  l1u1m2e_ear3: {
    prompt: 'Ouve esta nota e identifica-a.',
    hint: 'Esta nota situa-se na segunda linha da pauta de clave de sol — a linha em torno da qual a clave de sol se enrola.',
  },
  l1u1m2e_ear4: {
    prompt: 'Ouve esta nota e identifica-a.',
    hint: 'É mais aguda do que o C de referência: canta subindo pelas teclas brancas a partir de C, um grau de cada vez, até lá chegares.',
  },

  // ---- l1u1m3: Meios-tons e Tons ----

  l1u1m3e1: {
    prompt: 'Qual é o intervalo de Db, a descer, até C?',
    hint: 'De Db a descer até C é a menor distância possível na música ocidental: um meio-tom (1 meio-tom), da tecla preta para a tecla branca logo abaixo. Duas letras diferentes (D, C) fazem dele uma 2.ª — uma 2.ª menor.',
    nudge: 'Encontra Db e C no teclado e repara no que há entre elas: são teclas vizinhas, ou há outra tecla, branca ou preta, entre as duas?',
  },
  l1u1m3e2: {
    prompt: 'Qual é o intervalo de C a D?',
    hint: 'De C a D é um tom: dois meios-tons, equivalente a 2 meios-tons. Existe uma tecla (C#/Db) entre eles.',
    nudge: 'Encontra C e D no teclado e conta as teclas de uma à outra, incluindo as pretas: o D é a tecla imediatamente a seguir, ou há uma tecla pelo meio?',
  },
  l1u1m3e3: {
    prompt:
      'Qual é o intervalo de E a F? Este é um par especial de notas naturais.',
    hint: 'De E a F é um meio-tom natural: não existe tecla preta entre elas no piano. É apenas 1 meio-tom.',
    nudge: 'Olha para E e F no teclado: há uma tecla preta entre elas, como há entre a maioria das teclas brancas vizinhas?',
  },

  // ---- l1u1m4: Escala Cromática ----

  l1u1m4e1: {
    prompt: 'Identifica esta nota: a tecla preta entre F e G.',
    hint: 'A tecla preta entre F e G pode chamar-se F# (F sustenido) ou Gb (G bemol). Ambos os nomes referem-se à mesma altura.',
    nudge: 'Um sustenido sobe uma nota natural meio-tom, e todas as opções aqui são sustenidos. Esta tecla preta fica meio-tom acima de que tecla branca? Dá-lhe o nome a partir dessa tecla.',
  },
  l1u1m4e2: {
    prompt: 'Identifica esta nota: a tecla preta entre A e B.',
    hint: 'A tecla preta entre A e B pode chamar-se Bb (B bemol) ou A# (A sustenido). Em tonalidades com bemóis, esta nota chama-se Bb.',
    nudge: 'Um bemol desce uma nota natural meio-tom, e todas as opções aqui são bemóis. Esta tecla preta fica meio-tom abaixo de que tecla branca? Dá-lhe o nome a partir dessa tecla.',
  },
  l1u1m4e3: {
    prompt:
      'Quantas alturas distintas tem a escala cromática antes de se repetir?',
    choices: ['12', '7', '8', '10'],
    hint: 'A escala cromática inclui todas as notas: 7 teclas brancas + 5 teclas pretas = 12 alturas distintas por oitava.',
    nudge: 'Conta todas as teclas, brancas e pretas, de um C até ao C seguinte, mas sem contar o C de cima: é aí que o padrão recomeça.',
  },

  // =========================================================================
  // Unidade 2: Ritmo e Métrica
  // =========================================================================

  // ---- l1u2m1: Valores das Notas ----

  l1u2m1e1: {
    prompt:
      'Em compasso 4/4, quantos tempos dura uma semibreve?',
    choices: ['4 tempos', '2 tempos', '1 tempo', '8 tempos'],
    hint: 'Uma semibreve preenche um compasso inteiro de 4/4. Dura 4 tempos de semínima.',
    nudge: 'Uma semibreve preenche sozinha um compasso inteiro de 4/4. Olha para a indicação de compasso: o que conta o número de cima?',
  },
  l1u2m1e2: {
    prompt: 'Quantos tempos vale uma mínima em compasso 4/4?',
    choices: ['2 tempos', '4 tempos', '1 tempo', '3 tempos'],
    hint: 'Uma mínima tem metade da duração de uma semibreve. Uma semibreve = duas mínimas = 4 tempos / 2 = 2 tempos cada.',
    nudge: 'Uma mínima dura metade de uma semibreve, e a semibreve preenche um compasso inteiro de 4/4.',
  },
  l1u2m1e3: {
    prompt: 'Quantos tempos vale uma semínima em compasso 4/4?',
    choices: ['1 tempo', '2 tempos', '1/2 tempo', '4 tempos'],
    hint: 'Em compasso 4/4, o número inferior (4) indica que a semínima vale um tempo. Quatro semínimas preenchem um compasso.',
  },

  // ---- l1u2m2: Métrica e Indicações de Compasso ----

  l1u2m2e1: {
    prompt: 'O que significa a indicação de compasso 4/4?',
    choices: [
      '4 tempos de semínima por compasso',
      '4 tempos de mínima por compasso',
      '4 tempos de semicolcheia por compasso',
      '4 compassos por linha',
    ],
    hint: 'O número superior (4) indica os tempos por compasso. O número inferior (4) indica que a semínima vale um tempo.',
  },
  l1u2m2e2: {
    prompt: 'O que indica a indicação de compasso 3/4?',
    choices: [
      '3 tempos de semínima por compasso',
      '3 tempos de mínima por compasso',
      '3 tempos de semicolcheia por compasso',
      '3 compassos de 4 tempos',
    ],
    hint: '3/4 significa três tempos de semínima por compasso. Isto cria a sensação de valsa: UM-dois-três.',
  },
  l1u2m2e3: {
    prompt:
      'Qual das seguintes opções descreve melhor o "compasso simples"?',
    choices: [
      'Cada tempo divide-se naturalmente em duas partes iguais',
      'Cada tempo divide-se naturalmente em três partes iguais',
      'A música não tem indicação de compasso escrita no início da peça',
      'O andamento é lento e regular do primeiro compasso ao último',
    ],
    hint: 'No compasso simples, os tempos subdividem-se em dois. No compasso composto, subdividem-se em três. 4/4 e 3/4 são compassos simples.',
  },

  // =========================================================================
  // Unidade 3: Escalas, Intervalos e Primeiros Acordes
  // =========================================================================

  // ---- l1u3m1: Escala Maior ----

  l1u3m1e1: {
    prompt:
      'Constrói a escala de C maior. Seleciona as 7 notas no instrumento.',
    hint: 'C maior usa apenas as teclas brancas: C, D, E, F, G, A, B. O padrão é T-T-mT-T-T-T-mT.',
  },
  l1u3m1e2: {
    prompt:
      'Constrói a escala de G maior. Seleciona as 7 notas. Lembra-te: uma nota precisa de um sustenido.',
    hint: 'G maior: G, A, B, C, D, E, F#. O F tem de ser elevado a F# para manter o padrão T-T-mT-T-T-T-mT.',
  },
  l1u3m1e_deg1: {
    prompt: 'Na escala de C maior, qual é o grau da nota E?',
    hint: 'Conta a partir da fundamental: C=1, D=2, E=3.',
  },
  l1u3m1e_deg2: {
    prompt: 'Na escala de C maior, qual é o grau da nota G?',
    hint: 'G é a 5.ª nota de C maior — a dominante.',
  },
  l1u3m1e_deg3: {
    prompt: 'Na escala de C maior, qual é o grau da nota F?',
    hint: 'F é a 4.ª nota de C maior — a subdominante.',
  },
  l1u3m1e_deg4: {
    prompt: 'Na escala de G maior, qual é o grau da nota B?',
    hint: 'Conta a partir de G: G=1, A=2, B=3.',
  },

  // ---- l1u3m2: Armações de Clave ----

  l1u3m2e1: {
    prompt: 'Quantos sustenidos tem a tonalidade de G maior?',
    choices: [
      '1 sustenido (F#)',
      '0 sustenidos ou bemóis',
      '2 sustenidos (F#, C#)',
      '2 bemóis (Bb, Eb)',
    ],
    hint: 'G maior necessita de F# para manter o padrão T-T-mT-T-T-T-mT. Esse único sustenido é a sua armação de clave.',
  },
  l1u3m2e2: {
    prompt: 'Que nota é bemolizada na armação de clave de F maior?',
    choices: ['B (passa a Bb)', 'E (passa a Eb)', 'A (passa a Ab)', 'F (passa a Fb)'],
    hint: 'F maior necessita de Bb para manter o padrão da escala maior. A quarta nota (B) tem de ser rebaixada para Bb.',
  },
  l1u3m2e3: {
    prompt: 'Qual é a armação de clave de D maior?',
    choices: [
      '2 sustenidos (F# e C#)',
      '1 sustenido (F#)',
      '3 sustenidos (F#, C#, G#)',
      '2 bemóis (Bb, Eb)',
    ],
    hint: 'D maior acrescenta C# ao F# de G maior. Os sustenidos acumulam-se por ordem: F#, C#, G#, D#, A#, E#, B#.',
  },

  // ---- l1u3m3: Intervalos ----

  l1u3m3e1: {
    prompt:
      'Identifica o intervalo: C até G (ascendente). Conta os nomes das notas.',
    hint: 'C-D-E-F-G = 5 nomes de notas = uma 5.ª. De C a G são 7 meios-tons, o que corresponde a uma 5.ª perfeita.',
    nudge: 'Diz os nomes das notas por ordem, de C até G, e conta-os, incluindo o C e o G: esse total é o número do intervalo. Conta as próprias notas, não os passos entre elas.',
  },
  l1u3m3e2: {
    prompt:
      'Identifica o intervalo: C até F (ascendente). Conta os nomes das notas.',
    hint: 'C-D-E-F = 4 nomes de notas = uma 4.ª. De C a F são 5 meios-tons, o que corresponde a uma 4.ª perfeita.',
    nudge: 'Diz os nomes das notas por ordem, de C até F, e conta-os, incluindo o C e o F: esse total é o número do intervalo. Conta as próprias notas, não os passos entre elas.',
  },
  l1u3m3e3: {
    prompt:
      'Identifica o intervalo: C até E (ascendente). Conta os nomes das notas.',
    hint: 'C-D-E = 3 nomes de notas = uma 3.ª. De C a E são 4 meios-tons, o que corresponde a uma 3.ª maior.',
    nudge: 'Diz os nomes das notas por ordem, de C até E, e conta-os, incluindo o C e o E: esse total é o número do intervalo. Conta as próprias notas, não os passos entre elas.',
  },

  // ---- l1u3m4: Tríades Maiores ----

  l1u3m4e1: {
    prompt:
      'Constrói uma tríade de C maior. Seleciona as 3 notas: fundamental, 3.ª maior e 5.ª perfeita.',
    hint: 'C maior = C, E, G. Fundamental (C) + 3.ª maior (E, 4 meios-tons acima) + 5.ª perfeita (G, 7 meios-tons acima).',
  },
  l1u3m4e2: {
    prompt:
      'Constrói uma tríade de G maior. Seleciona as 3 notas que formam este acorde.',
    hint: 'G maior = G, B, D. Fundamental (G) + 3.ª maior (B, 4 meios-tons acima) + 5.ª perfeita (D, 7 meios-tons acima).',
  },
  l1u3m4e3: {
    prompt: 'Quais intervalos compõem uma tríade maior?',
    choices: [
      'Fundamental, 3.ª maior (4 meios-tons), 5.ª perfeita (7 meios-tons)',
      'Fundamental, 3.ª menor (3 meios-tons), 5.ª perfeita (7 meios-tons)',
      'Fundamental, 3.ª maior (4 meios-tons), 5.ª diminuta (6 meios-tons)',
      'Fundamental, 4.ª perfeita (5 meios-tons), 5.ª perfeita (7 meios-tons)',
    ],
    hint: 'Uma tríade maior empilha uma 3.ª maior (4 meios-tons a partir da fundamental) e depois uma 3.ª menor por cima (mais 3), resultando em fundamental + 3M + 5P.',
  },
};

export default overlay;
