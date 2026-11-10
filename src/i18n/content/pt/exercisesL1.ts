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
      'Trasto 3',
      'Corda 3',
      'Posição III'
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
      'Tocar a corda sem nenhum dedo da mão esquerda a premi-la em qualquer traste',
      'Tocar a corda com um dedo da mão esquerda a premi-la no traste 1',
      'Tocar a corda com uma pestana da mão esquerda a premi-la no traste 1',
      'Tocar a corda com um dedo da mão esquerda a premi-la no traste 3'
    ],
    hint: 'Zero significa que nenhum dedo da mão esquerda prime a corda.'
  },
  l1u33m2e3: {
    prompt: 'Que ordem de dedos indica p-i-m-a?',
    choices: [
      'Mindinho, indicador, médio, anelar',
      'Polegar, indicador, médio, anelar',
      'Polegar, indicador, médio, mindinho',
      'Anelar, indicador, médio, polegar'
    ],
    hint: 'As letras da mão direita são p polegar, i indicador, m médio e a anelar.'
  },
  l1u33m2e4: {
    prompt: 'Que letras significam polegar, anelar, médio, indicador?',
    choices: [
      'a-p-m-i',
      'p-i-m-a',
      'p-a-m-i',
      'a-m-p-i'
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
      'Escrever alturas fora da pauta',
      'Separar os compassos na pauta',
      'Elevar todas as alturas uma oitava',
      'Ligar duas pautas num sistema',
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
      '4 tempos medidos em semínimas por compasso',
      '4 tempos medidos em mínimas por compasso',
      '4 tempos medidos em semibreves por compasso',
      '4 tempos medidos em colcheias por compasso',
    ],
    hint: 'O número superior (4) indica os tempos por compasso. O número inferior (4) indica que a semínima vale um tempo.',
  },
  l1u2m2e2: {
    prompt: 'O que te diz a indicação de compasso 3/4?',
    choices: [
      '3 tempos medidos em semínimas por compasso',
      '3 tempos medidos em mínimas por compasso',
      '3 tempos medidos em semibreves por compasso',
      '3 tempos medidos em colcheias por compasso',
    ],
    hint: '3/4 significa três tempos de semínima por compasso. Isto cria a sensação de valsa: UM-dois-três.',
  },
  l1u2m2e3: {
    prompt:
      'Qual das seguintes opções descreve melhor o "compasso simples"?',
    choices: [
      'O tempo divide-se em 2 notas iguais',
      'O tempo divide-se em 3 notas iguais',
      'O compasso contém 2 tempos',
      'O compasso contém 3 tempos',
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
    choices: ['B fica bemol; A, E e F ficam naturais', 'E fica bemol; A, B e F ficam naturais', 'A fica bemol; B, E e F ficam naturais', 'F fica bemol; A, B e E ficam naturais'],
    hint: 'F maior necessita de Bb para manter o padrão da escala maior. A quarta nota (B) tem de ser rebaixada para Bb.',
  },
  l1u3m2e3: {
    prompt: 'Qual é a armação de clave de D maior?',
    choices: [
      'Armação de clave: F#, C#',
      'Armação de clave: F#',
      'Armação de clave: F#, C#, G#',
      'Armação de clave: Bb, Eb',
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
    prompt: 'Constrói uma tríade de B maior. Seleciona as três notas.',
    hint: 'Uma tríade maior empilha uma 3.ª maior (4 meios-tons a partir da fundamental) e depois uma 3.ª menor por cima (mais 3), resultando em fundamental + 3M + 5P.',
  },

  // ── Track "Start with sound" (wave 2) ──
  l1u34m1e1: {
    prompt: 'Ouve duas notas, uma depois da outra. Qual é a mais aguda?',
    choices: ['A primeira nota', 'A segunda nota', 'Nenhuma: são a mesma nota'],
    hint: 'A segunda nota era mais aguda: o som subiu.',
    nudge: 'Ouve outra vez e trauteia. A tua voz tem de subir ou descer para seguir a mudança?',
  },
  l1u34m1e2: {
    prompt: 'Ouve mais duas notas, uma depois da outra. Qual é a mais aguda?',
    choices: ['A primeira nota', 'A segunda nota', 'Nenhuma: são a mesma nota'],
    hint: 'A primeira nota era mais aguda: o som desceu.',
    nudge: 'Ouve outra vez e trauteia. A tua voz tem de subir ou descer para seguir a mudança?',
  },
  l1u34m1e3: {
    prompt: 'Ouve duas notas. Como é a segunda em comparação com a primeira?',
    choices: ['A mesma nota outra vez, mais aguda', 'A mesma nota outra vez, mais grave', 'Uma nota diferente, mais aguda', 'Uma nota diferente, mais grave'],
    hint: 'Era uma oitava: a mesma nota outra vez, mais aguda, por isso mantém o nome.',
    nudge: 'Primeiro decide se o som subiu ou desceu. Depois trauteia as duas: parecem-se, ou são bem diferentes?',
  },
  l1u34m1e4: {
    prompt: 'No piano, onde estão as notas mais agudas?',
    choices: ['No lado direito', 'No lado esquerdo', 'Nas teclas do meio', 'Nas teclas brancas'],
    hint: 'No piano, as notas ficam mais agudas da esquerda para a direita: cada tecla é um pouco mais aguda do que a tecla à sua esquerda.',
    nudge: 'Imagina a tecla mais grave do piano. Para que lado avanças para subir a partir dela?',
  },
  l1u34m1e5: {
    prompt: 'Na guitarra, que corda soa mais aguda quando a tocas solta?',
    choices: ['A corda mais fina', 'A corda mais grossa', 'A corda do meio', 'A corda mais próxima de ti'],
    hint: 'Tocada solta, cada corda mais fina soa mais aguda do que a do lado, por isso a mais fina é a mais aguda.',
    nudge: 'Lembra-te da lição sobre a guitarra: como mudam as cordas da mais grave para a seguinte?',
  },
  l1u34m2e1: {
    prompt: 'Nos nomes das notas, que letra vem logo a seguir a G?',
    choices: ['A', 'F', 'B', 'E'],
    hint: 'Há só sete letras, de A a G. Depois do G os nomes recomeçam no A, uma oitava acima.',
    nudge: 'Há só sete letras. O que acontece aos nomes depois da última?',
  },
  l1u34m2e2: {
    prompt: 'No piano, que tecla branca fica imediatamente à esquerda de um grupo de duas teclas pretas?',
    choices: ['C', 'D', 'F', 'E'],
    hint: 'O C é a tecla branca imediatamente à esquerda de cada grupo de duas teclas pretas. Imediatamente à esquerda de cada grupo de três fica o F.',
    nudge: 'As teclas pretas estão em grupos de duas e de três. Imagina um grupo de duas e a tecla branca à sua esquerda: que letra lhe deu a lição?',
  },
  l1u34m2e3: {
    prompt: 'Numa guitarra com a afinação habitual, como se chamam as cordas soltas, da mais grossa para a mais fina?',
    choices: ['E, A, D, G, B, E', 'E, B, G, D, A, E', 'E, F, G, A, B, C', 'E, A, D, G, C, F'],
    hint: 'A partir da mais grossa: E, A, D, G, B e de novo E, duas oitavas acima da primeira.',
    nudge: 'A corda mais grossa e a mais fina têm a mesma letra, e a ordem começa na corda mais grossa. Que lista serve para as duas coisas?',
  },
  l1u34m2e4: {
    prompt: 'A partir de C, seleciona sete notas, uma para cada letra. No piano, usa só teclas brancas.',
    hint: 'C, D, E, F, G, A e B: uma nota para cada letra, todas teclas brancas no piano.',
    nudge: 'Começa no C, a tecla branca imediatamente à esquerda de um grupo de duas teclas pretas, e toma de cada vez a tecla branca seguinte até teres sete.',
  },
  l1u34m2e5: {
    prompt: 'Duas notas estão a uma oitava de distância. Como se chamam?',
    choices: ['Com a mesma letra', 'Com a letra seguinte', 'Com a letra anterior', 'Com a letra ao lado'],
    hint: 'Notas a uma oitava de distância soam tão parecidas que têm a mesma letra: as sete letras recomeçam depois do G.',
    nudge: 'Conta as sete letras a partir de uma nota qualquer. Onde chegas quando os nomes recomeçam?',
  },
  l1u34m3e1: {
    prompt: 'Ouve duas notas. A que distância estão?',
    choices: ['Um meio-tom', 'Um tom', 'Dois tons'],
    hint: 'Um meio-tom: as duas notas eram vizinhas, sem nenhuma nota entre elas.',
    nudge: 'Ouve outra vez e canta as duas notas. Caberia outra nota entre elas, ou não?',
  },
  l1u34m3e2: {
    prompt: 'Ouve mais duas notas. A que distância estão?',
    choices: ['Um meio-tom', 'Um tom', 'Dois tons'],
    hint: 'Um tom: dois meios-tons, com uma nota saltada pelo meio.',
    nudge: 'Ouve outra vez e canta as duas notas. Caberia outra nota entre elas, ou não?',
  },
  l1u34m3e3: {
    prompt: 'O que é C sustenido (C♯)?',
    choices: ['A nota meio-tom mais aguda do que C', 'A nota meio-tom mais grave do que C', 'A nota um tom mais aguda do que C', 'A nota um tom mais grave do que C'],
    hint: 'Sustenido quer dizer meio-tom acima: C♯ é a tecla preta imediatamente à direita de C, também chamada D♭.',
    nudge: 'O sustenido e o bemol movem uma nota pela menor distância que existe. Qual dos dois sobe?',
  },
  l1u34m3e4: {
    prompt: 'Que duas teclas brancas vizinhas estão a apenas meio-tom de distância?',
    choices: ['B e C', 'C e D', 'F e G', 'G e A'],
    hint: 'Não há tecla preta entre B e C (nem entre E e F), por isso estão a apenas meio-tom.',
    nudge: 'Procura duas teclas brancas sem tecla preta entre elas.',
  },
  l1u34m3e5: {
    prompt: 'Seleciona todas as doze notas diferentes de C até B, brancas e pretas, cada uma a meio-tom da seguinte.',
    hint: 'De C até B há doze notas, cada uma a meio-tom da seguinte: sete teclas brancas e cinco pretas.',
    nudge: 'Começa no C e toma todas as teclas por ordem, pretas e brancas, até a seguinte voltar a ser C.',
  },
  l1u34m4e1: {
    prompt: 'Constrói a escala maior que começa em C: seleciona as suas sete notas.',
    hint: 'C, D, E, F, G, A e B: todas as teclas brancas, porque os dois meios-tons calham de E para F e de B para C.',
    nudge: 'Começa no C e sobe: tom, tom, meio-tom, tom, tom, tom, meio-tom.',
  },
  l1u34m4e2: {
    prompt: 'Constrói a escala maior que começa em G. Usa os mesmos passos que a partir de C.',
    hint: 'G, A, B, C, D, E e F♯: o F sobe para que o último passo, até G, seja um meio-tom.',
    nudge: 'Sobe a partir de G: tom, tom, meio-tom, tom, tom, tom, meio-tom. Verifica com cuidado os dois últimos passos.',
  },
  l1u34m4e3: {
    prompt: 'Ouve esta escala. Qual é?',
    choices: ['Maior', 'Cromática', 'Tons inteiros'],
    hint: 'Maior: tons e meios-tons misturados, a subir de volta à casa lá em cima.',
    nudge: 'Ouve outra vez. Os passos eram todos do mesmo tamanho, e quantas notas ouviste?',
  },
  l1u34m4e4: {
    prompt: 'Ouve esta subida. Qual é?',
    choices: ['Maior', 'Cromática', 'Tons inteiros'],
    hint: 'Cromática: todas as notas, cada uma a meio-tom da anterior, treze notas de C a C.',
    nudge: 'Ouve outra vez. Os passos eram todos do mesmo tamanho, e quantas notas ouviste?',
  },
  l1u34m4e5: {
    prompt: 'Numera as notas de uma escala maior de 1 a 8, a partir de baixo. Onde estão os seus dois meios-tons?',
    choices: ['De 3 para 4 e de 7 para 8', 'De 1 para 2 e de 5 para 6', 'De 2 para 3 e de 6 para 7', 'De 4 para 5 e de 7 para 8'],
    hint: 'Tom, tom, meio-tom, tom, tom, tom, meio-tom: o terceiro passo (de 3 para 4) e o sétimo (de 7 para 8) são os meios-tons.',
    nudge: 'Diz os passos por ordem e conta-os pelos dedos: quais são os dois pequenos?',
  },
  l1u34m5e1: {
    prompt: 'Constrói o acorde de C maior: a 1.ª, a 3.ª e a 5.ª notas da escala de C maior.',
    hint: 'C, E e G: a 1.ª, a 3.ª e a 5.ª notas da escala de C maior.',
    nudge: 'Começa no C e depois toma uma nota sim, outra não, da escala de C maior até teres três.',
  },
  l1u34m5e2: {
    prompt: 'Constrói C menor: parte de C maior e baixa meio-tom a sua nota do meio.',
    hint: 'C, E♭ e G: o E de C maior desce meio-tom, para E♭.',
    nudge: 'Constrói primeiro C maior e depois move só a nota do meio uma tecla para baixo.',
  },
  l1u34m5e3: {
    prompt: 'Constrói G maior: a 1.ª, a 3.ª e a 5.ª notas da escala de G maior.',
    hint: 'G, B e D: a 1.ª, a 3.ª e a 5.ª notas da escala de G maior.',
    nudge: 'Sobe a escala de G maior a partir de G e fica com uma nota sim, outra não: a 1.ª, a 3.ª e a 5.ª.',
  },
  l1u34m5e4: {
    prompt: 'Ouve este acorde. É maior ou menor?',
    choices: ['Maior', 'Menor'],
    hint: 'Maior: soa luminoso e estável.',
    nudge: 'Ouve outra vez e repara na sua cor: luminosa e estável, ou mais escura?',
  },
  l1u34m5e5: {
    prompt: 'Ouve mais um acorde. É maior ou menor?',
    choices: ['Maior', 'Menor'],
    hint: 'Menor: soa mais escuro, porque a nota do meio está meio-tom abaixo da de um acorde maior.',
    nudge: 'Ouve outra vez e repara na sua cor: luminosa e estável, ou mais escura?',
  },
};

export default overlay;
