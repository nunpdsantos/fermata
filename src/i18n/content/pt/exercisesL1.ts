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
    choices: ['A corda mais fina', 'A corda mais grossa', 'A corda do meio', 'A corda a seguir à mais grossa'],
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
    prompt: 'Duas notas estão a uma oitava de distância. Que letras têm?',
    choices: ['Têm a mesma letra', 'Têm a letra seguinte', 'Têm a letra anterior', 'Têm a letra ao lado'],
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
  // ── Track "From the chords you know" (wave 2) ──
  l1u35m1e1: {
    prompt: 'Junta as notas de G, C, D e Em e deixa de fora as repetidas. Quantas notas diferentes há?',
    choices: ['Sete notas', 'Três notas', 'Quatro notas', 'Doze notas'],
    hint: 'Sete: G, A, B, C, D, E e F♯, as notas da escala de G maior.',
    nudge: 'Escreve as três notas de cada acorde e depois risca cada nota que já tenhas escrito.',
  },
  l1u35m1e2: {
    prompt: 'Que nota pertence à tonalidade de G?',
    choices: ['F♯', 'F', 'C♯', 'B♭'],
    hint: 'F♯: está no acorde de D, D, F♯ e A, e a tonalidade de G tem F♯ em vez de F.',
    nudge: 'As notas de G, C, D e Em, juntas, são as notas da tonalidade. Qual das opções é uma das notas desses quatro acordes?',
  },
  l1u35m1e3: {
    prompt: 'O que é uma tonalidade?',
    choices: [
      'Uma família de sete notas e os acordes construídos a partir delas',
      'O acorde que soa como a casa, tocado no início de uma música',
      'As três notas diferentes que formam cada acorde de uma música',
      'Quaisquer sete notas, tocadas por ordem a partir da mais grave',
    ],
    hint: 'Uma tonalidade é uma família de sete notas e os acordes construídos a partir delas, com o nome da nota que soa como a casa.',
    nudge: 'Pensa em G, C, D e Em: o que é que os quatro partilham, e de onde vieram os seus acordes?',
  },
  l1u35m1e4: {
    prompt: 'Constrói a escala de G maior: seleciona as suas sete notas, as notas de G, C, D e Em juntas.',
    hint: 'G, A, B, C, D, E e F♯: todas as notas dos quatro acordes, cada uma uma vez.',
    nudge: 'Toma as três notas de cada um dos quatro acordes, uma de cada vez, e seleciona cada nota nova até teres sete.',
  },
  l1u35m1e5: {
    prompt: 'Ouve este acorde da tonalidade de G. É maior ou menor?',
    choices: ['Maior', 'Menor'],
    hint: 'Menor: era Em, E, G e B, o mais escuro dos acordes que tocaste.',
    nudge: 'Ouve outra vez e repara na sua cor: luminosa e aberta, ou mais escura?',
  },
  l1u35m2e1: {
    prompt: 'Na tonalidade de G, que nota é o número 5?',
    choices: ['D', 'C', 'E', 'B'],
    hint: 'D: G é 1, A é 2, B é 3, C é 4 e D é 5.',
    nudge: 'Sobe a escala de G maior a partir de G, que é o 1, uma nota de cada vez.',
  },
  l1u35m2e2: {
    prompt: 'Na tonalidade de C, que acordes são o I, o IV e o V?',
    choices: ['C, F e G', 'C, E e G', 'C, D e G', 'C, F e E'],
    hint: 'C, F e G: os acordes sobre as notas 1, 4 e 5 de C maior, os três maiores.',
    nudge: 'Sobe a escala de C até às notas 4 e 5 e constrói um acorde maior sobre cada uma.',
  },
  l1u35m2e3: {
    prompt: 'G, C e D na tonalidade de G são o I, o IV e o V. Que acordes fazem o mesmo movimento na tonalidade de D?',
    choices: ['D, G e A', 'D, E e A', 'D, A e B', 'D, G e B'],
    hint: 'D, G e A: as notas 1, 4 e 5 de D maior. Os números ficam; só os nomes mudam.',
    nudge: 'Sobe a escala de D maior a partir de D até às notas 4 e 5.',
  },
  l1u35m2e4: {
    prompt: 'Primeiro ouves o acorde de casa da tonalidade. Depois quatro acordes: que números são?',
    choices: ['I - IV - V - I', 'I - V - IV - I', 'I - IV - I - V'],
    hint: 'I – IV – V – I: casa, o acorde sobre o 4, o acorde sobre o 5 e de novo a casa.',
    nudge: 'Trauteia a nota mais grave de cada acorde. Que acorde soa mais longe de casa, e onde termina o último?',
  },
  l1u35m2e5: {
    prompt: 'De novo o acorde de casa e depois quatro acordes noutra tonalidade. Que números são?',
    choices: ['I - IV - V - I', 'I - V - IV - I', 'I - IV - I - V'],
    hint: 'I – V – IV – I: casa, o acorde sobre o 5, o acorde sobre o 4 e de novo a casa.',
    nudge: 'Trauteia a nota mais grave de cada acorde: nesta tonalidade, o acorde sobre o 5 fica um pouco mais agudo do que o acorde sobre o 4. Qual dos dois vem em segundo lugar, e que acorde termina a sequência?',
  },
  l1u35m2e6: {
    prompt: 'Constrói o acorde IV da tonalidade de D.',
    hint: 'G maior é G, B e D: a nota 4 de D maior é G, e o IV é um acorde maior.',
    nudge: 'Sobe a escala desta tonalidade até à nota 4 e constrói um acorde maior sobre essa nota.',
  },
  l1u35m3e1: {
    prompt: 'Na tonalidade de G, que acorde é o vi?',
    choices: ['Em', 'C', 'Am', 'Bm'],
    hint: 'Em: a nota 6 de G maior é E, e o acorde sobre o 6 é menor.',
    nudge: 'Sobe a escala de G até à nota 6 e lembra-te de que um numeral minúsculo quer dizer um acorde menor.',
  },
  l1u35m3e2: {
    prompt: 'Que acordes de uma tonalidade maior são menores?',
    choices: ['Os acordes sobre o 2, o 3 e o 6', 'Os acordes sobre o 1, o 4 e o 5', 'Os acordes sobre o 4, o 5 e o 6', 'Os acordes sobre o 2, o 5 e o 7'],
    hint: 'Os acordes sobre o 2, o 3 e o 6: ii, iii e vi, escritos em numerais minúsculos.',
    nudge: 'Três dos sete acordes são maiores e um é diminuto. Quais são os três que sobram?',
  },
  l1u35m3e3: {
    prompt: 'Que tipo de acorde fica sobre a nota 7 de uma tonalidade maior?',
    choices: ['Um acorde diminuto', 'Um acorde maior', 'Um acorde menor', 'Um acorde aumentado'],
    hint: 'Um acorde diminuto, escrito vii°: em G é F♯, A e C.',
    nudge: 'Os acordes sobre as notas 1 a 6 são maiores ou menores. O que sobra é o diferente: que tipo lhe deu a lição?',
  },
  l1u35m3e4: {
    prompt: 'Qual é a relativa menor de C maior?',
    choices: ['A menor', 'C menor', 'E menor', 'D menor'],
    hint: 'A tonalidade de A menor: começa na nota 6 de C maior e usa as mesmas sete notas, todas as teclas brancas.',
    nudge: 'A relativa menor partilha as sete notas e começa no vi da tonalidade maior. Sobe a escala de C até à nota 6.',
  },
  l1u35m3e5: {
    prompt: 'Primeiro o acorde de casa, depois quatro acordes. Que números são?',
    choices: ['I - vi - IV - V', 'I - IV - vi - V', 'I - V - vi - IV'],
    hint: 'I – vi – IV – V: casa, depois o vi, mais escuro, depois o IV e o V.',
    nudge: 'Procura o único acorde menor, o mais escuro. É o segundo acorde, o terceiro ou o quarto?',
  },
  l1u35m3e6: {
    prompt: 'Constrói o ii da tonalidade de C: o acorde sobre a nota 2, com as notas da própria tonalidade.',
    hint: 'Dm é D, F e A: uma nota sim, outra não, de C maior, a começar em D.',
    nudge: 'Começa na nota 2 da escala de C e toma uma nota sim, outra não, da mesma escala até teres três.',
  },
  l1u35m4e1: {
    prompt: 'Na tonalidade de D, que acorde puxa com mais força de volta a D?',
    choices: ['A', 'G', 'Bm', 'Em'],
    hint: 'O acorde de A, o V de D, tem C♯, a 7.ª nota da tonalidade, meio-tom abaixo de D.',
    nudge: 'Segundo a lição, que número da tonalidade leva para casa com mais força? Sobe a escala de D maior até essa nota.',
  },
  l1u35m4e2: {
    prompt: 'No acorde V, que nota se inclina com mais força para casa?',
    choices: [
      'A 7.ª nota da tonalidade, meio-tom abaixo da casa',
      'A 5.ª nota da tonalidade, um tom acima da 4.ª',
      'A 2.ª nota da tonalidade, um tom acima da casa',
      'A 4.ª nota da tonalidade, meio-tom acima da 3.ª',
    ],
    hint: 'A 7.ª nota da tonalidade: está meio-tom abaixo da casa, tão perto que o ouvido quer que suba.',
    nudge: 'Que nota do acorde V é a que fica mais perto da nota de casa?',
  },
  l1u35m4e3: {
    prompt: 'Na tonalidade de A, o acorde V é E. Qual das suas notas fica meio-tom abaixo da casa?',
    choices: ['G♯', 'F♯', 'B', 'E'],
    hint: 'G♯: a 7.ª nota de A maior, no acorde de E, E, G♯ e B.',
    nudge: 'A nota que puxa é a 7.ª da tonalidade. Que nota do acorde de E fica tão perto, por baixo da nota de casa?',
  },
  l1u35m4e4: {
    prompt: 'Primeiro ouves o acorde de casa. Depois quatro acordes: a sequência acaba longe, no V, ou volta a casa, ao I?',
    choices: ['I - IV - I - V', 'I - IV - V - I'],
    hint: 'I - IV - I - V: acaba longe, no V, que se inclina de volta para casa e deixa a sequência por terminar.',
    nudge: 'Ouve outra vez e espera depois do último acorde. Soa terminado, ou como se devesse vir mais um acorde?',
  },
  l1u35m4e5: {
    prompt: 'O acorde de casa e depois três acordes que saem e voltam. O regresso a casa foi a partir do IV, o caminho mais suave, ou do V, o puxão mais forte?',
    choices: ['I - IV - I', 'I - V - I'],
    hint: 'I - IV - I: casa a partir do IV, de C para G, sem nenhuma nota meio-tom abaixo da casa, por isso o regresso é calmo.',
    nudge: 'Ouve o acorde do meio: inclina-se com urgência para casa, ou volta a assentar com suavidade?',
  },
  l1u35m5e1: {
    prompt: 'O que muda entre D maior e D menor?',
    choices: ['Só a nota do meio, meio-tom abaixo', 'Só a nota de cima, meio-tom abaixo', 'Só a nota mais grave, meio-tom acima', 'Só a nota do meio, meio-tom acima'],
    hint: 'Só muda a nota do meio, e desce meio-tom: D, F♯ e A passam a D, F e A.',
    nudge: 'D maior é D, F♯ e A. Qual destas três é diferente em D menor, e para que lado vai?',
  },
  l1u35m5e2: {
    prompt: 'Constrói A menor: parte de A maior e baixa meio-tom a sua nota do meio.',
    hint: 'A, C e E: o C♯ de A maior desce meio-tom, para C.',
    nudge: 'Constrói primeiro A maior e depois muda só a nota do meio uma tecla para baixo.',
  },
  l1u35m5e3: {
    prompt: 'Constrói D menor: D maior com a nota do meio meio-tom abaixo.',
    hint: 'D, F e A: o F♯ de D maior desce meio-tom, para F.',
    nudge: 'Constrói primeiro D maior e depois muda só a nota do meio uma tecla para baixo.',
  },
  l1u35m5e4: {
    prompt: 'Na guitarra, como transformas a forma aberta de A em Am?',
    choices: ['Passas a nota da corda B um trasto abaixo', 'Passas a nota da corda B um trasto acima', 'Passas a nota da corda G um trasto abaixo', 'Passas a nota da corda D um trasto abaixo'],
    hint: 'A corda B toca a nota do meio, C♯, no trasto 2; um trasto abaixo, no trasto 1, é C, e o acorde é Am.',
    nudge: 'Descobre que corda toca a nota do meio de A maior e depois decide para que lado fica meio-tom abaixo.',
  },
  l1u35m5e5: {
    prompt: 'Ouve este acorde. É maior ou menor?',
    choices: ['Maior', 'Menor'],
    hint: 'Maior: soa luminoso e aberto.',
    nudge: 'Ouve outra vez e repara na nota do meio: luminosa e aberta, ou mais escura?',
  },
  l1u35m5e6: {
    prompt: 'Ouve mais um acorde. É maior ou menor?',
    choices: ['Maior', 'Menor'],
    hint: 'Menor: soa mais escuro, porque a nota do meio está meio-tom abaixo da do acorde maior.',
    nudge: 'Ouve outra vez e repara na nota do meio: luminosa e aberta, ou mais escura?',
  },
  l1u35m6e1: {
    prompt: 'Constrói C maior: a 1.ª, a 3.ª e a 5.ª notas da escala de C maior.',
    hint: 'C, E e G: C, salta D, E, salta F, G.',
    nudge: 'Começa no C e toma uma nota sim, outra não, da sua escala maior até teres três.',
  },
  l1u35m6e2: {
    prompt: 'Constrói D maior: a sua fundamental, a 3.ª e a 5.ª.',
    hint: 'D, F♯ e A: uma nota sim, outra não, da escala de D maior a partir de D.',
    nudge: 'Começa no D e toma uma nota sim, outra não, da escala de D maior até teres três.',
  },
  l1u35m6e3: {
    prompt: 'Constrói Em, o acorde vi de G: uma nota sim, outra não, da tonalidade de G, a partir de E.',
    hint: 'E, G e B: E, salta F♯, G, salta A, B.',
    nudge: 'Começa no E e toma uma nota sim, outra não, da escala desta tonalidade até teres três.',
  },
  l1u35m6e4: {
    prompt: 'Um acorde de G aberto soa em seis cordas. Quantas notas diferentes toca?',
    choices: ['Três notas diferentes', 'Seis notas diferentes', 'Quatro notas diferentes', 'Cinco notas diferentes'],
    hint: 'Três: a partir da corda mais grossa, G, B, D, G, B e G. As notas repetem-se noutras oitavas.',
    nudge: 'Diz o nome da nota de cada corda, a começar pela mais grossa, e conta quantos nomes usaste.',
  },
  l1u35m6e5: {
    prompt: 'Que nota é a 3.ª do acorde de D maior?',
    choices: ['F♯', 'A', 'E', 'C♯'],
    hint: 'F♯: na escala de D maior, D é 1, E é 2 e F♯ é 3.',
    nudge: 'Sobe a escala de D maior a partir de D, que é o 1, até à sua terceira nota.',
  },
  l1u35m6e6: {
    prompt: 'Que nota de um acorde o torna maior ou menor?',
    choices: ['A 3.ª', 'A fundamental', 'A 5.ª'],
    hint: 'A 3.ª, a nota do meio: meio-tom abaixo no acorde menor.',
    nudge: 'Pensa na lição anterior: qual das três notas mudou quando um acorde maior passou a menor?',
  },
  l1u35m7e1: {
    prompt: 'Constrói G7: G maior com uma quarta nota, um tom abaixo do G de cima.',
    hint: 'G, B, D e F: G maior com F, a sétima letra a partir de G, por cima.',
    nudge: 'Constrói primeiro G maior e depois junta a nota que fica duas teclas abaixo do G seguinte, mais agudo.',
  },
  l1u35m7e2: {
    prompt: 'Que nota junta G7 ao acorde de G maior?',
    choices: ['F', 'F♯', 'E', 'A'],
    hint: 'F: um tom abaixo do G de cima, a sétima letra contando G como a primeira.',
    nudge: 'Conta sete letras a partir de G, com G como a primeira, e confirma que fica um tom abaixo do G seguinte.',
  },
  l1u35m7e3: {
    prompt: 'G7 é o V7 de que tonalidade?',
    choices: ['C maior', 'G maior', 'D maior', 'F maior'],
    hint: 'C maior: G é a nota 5 de C, e G, B, D e F são todas notas de C.',
    nudge: 'Procura a tonalidade maior cuja nota 5 é a fundamental de G7 e que tem as suas quatro notas.',
  },
  l1u35m7e4: {
    prompt: 'Que três acordes formam o blues de doze compassos em G?',
    choices: ['G7, C7 e D7', 'G7, C7 e E7', 'G7, D7 e E7', 'G7, B7 e C7'],
    hint: 'G7, C7 e D7: I7, IV7 e V7 em G.',
    nudge: 'O blues usa o I, o IV e o V. Sobe a escala de G maior até às notas 4 e 5.',
  },
  l1u35m7e5: {
    prompt: 'Ouve este acorde. É um simples acorde maior, ou um acorde de sétima da dominante, com uma sétima por cima?',
    choices: ['Sétima da dominante', 'Maior'],
    hint: 'Sétima da dominante: D7, com C por cima de D, F♯ e A, que o faz puxar para G.',
    nudge: 'Ouve a parte de cima do acorde: há uma quarta nota que o faz soar inquieto?',
  },
  l1u35m8e1: {
    prompt: 'Que acordes são I–V–vi–IV na tonalidade de D?',
    choices: ['D, A, Bm e G', 'D, G, Bm e A', 'D, A, Em e G', 'D, E, Bm e G'],
    hint: 'D, A, Bm e G: as notas 1, 5, 6 e 4 de D maior, com um acorde menor sobre o 6.',
    nudge: 'Numera as notas de D maior de 1 a 7 e depois lê os acordes pela ordem dos números.',
  },
  l1u35m8e2: {
    prompt: 'Uma música em G usa G, C e D. Passas a música para a tonalidade de A. Que acordes tocas?',
    choices: ['A, D e E', 'A, C e D', 'A, D e F♯', 'A, C e E'],
    hint: 'A, D e E: cada acorde sobe um tom, como G sobe para A.',
    nudge: 'De G para A é um tom. Sobe cada um dos outros acordes a mesma distância.',
  },
  l1u35m8e3: {
    prompt: 'Tocas formas de G com um capo no trasto 2. Em que tonalidade soa?',
    choices: ['Na tonalidade de A', 'Na tonalidade de G', 'Na tonalidade de B', 'Na tonalidade de E'],
    hint: 'Na tonalidade de A: dois trastos são dois meios-tons, um tom acima de G.',
    nudge: 'Cada trasto é meio-tom mais agudo. Conta dois meios-tons a subir a partir de G.',
  },
  l1u35m8e4: {
    prompt: 'Tocas formas de C com o capo no trasto 4. Em que tonalidade soa?',
    choices: ['Na tonalidade de E', 'Na tonalidade de D', 'Na tonalidade de F', 'Na tonalidade de C'],
    hint: 'Na tonalidade de E: quatro meios-tons acima de C, C♯, D, D♯ e E.',
    nudge: 'Conta quatro meios-tons a subir a partir de C, um trasto por cada um.',
  },
  l1u35m8e5: {
    prompt: 'Primeiro o acorde de casa, depois uma sequência de quatro acordes numa nova tonalidade. Que números são?',
    choices: ['I - V - vi - IV', 'I - vi - IV - V', 'I - IV - V - I'],
    hint: 'I – V – vi – IV, em A: A, E, F♯m e D.',
    nudge: 'Procura o único acorde menor e onde aparece, e depois o acorde que fecha a sequência.',
  },
  l1u35m9e1: {
    prompt: 'Constrói a pentatónica maior de G: as notas de G maior sem as notas 4 e 7.',
    hint: 'G, A, B, D e E: G maior sem o C, a sua 4.ª nota, e sem o F♯, a sua 7.ª.',
    nudge: 'Parte da escala de G maior e deixa de fora a sua 4.ª e a sua 7.ª notas.',
  },
  l1u35m9e2: {
    prompt: 'Constrói a pentatónica menor de A: as cinco notas da pentatónica maior de C, a partir de A.',
    hint: 'A, C, D, E e G: a pentatónica maior de C, tocada a partir de A.',
    nudge: 'Constrói a pentatónica maior da tonalidade relativa maior e depois começa-a no A.',
  },
  l1u35m9e3: {
    prompt: 'Que duas notas de uma tonalidade maior deixa de fora a pentatónica maior?',
    choices: ['As notas 4 e 7', 'As notas 2 e 6', 'As notas 3 e 5', 'As notas 1 e 5'],
    hint: 'As notas 4 e 7: cada uma fica a meio-tom de uma nota do acorde I.',
    nudge: 'Que duas notas da tonalidade ficam a meio-tom de uma nota do acorde de casa?',
  },
  l1u35m9e4: {
    prompt: 'Qual é a pentatónica maior que tem as mesmas cinco notas da pentatónica menor de E?',
    choices: ['A pentatónica de G maior', 'A pentatónica de E maior', 'A pentatónica de C maior', 'A pentatónica de D maior'],
    hint: 'A pentatónica de G maior: a tonalidade de E menor é a relativa menor de G, e ambas as pentatónicas são E, G, A, B e D.',
    nudge: 'Que tonalidade maior tem E menor como relativa menor?',
  },
  l1u35m9e5: {
    prompt: 'Ouve esta escala. Qual é?',
    choices: ['Pentatónica maior', 'Maior', 'Pentatónica menor'],
    hint: 'Pentatónica maior: cinco notas, nenhum meio-tom e uma 3.ª luminosa acima da primeira nota.',
    nudge: 'Ouve outra vez e conta as notas antes da de cima. Depois ouve a terceira nota: luminosa ou escura?',
  },
  l1u35m10e1: {
    prompt: 'Que acorde não é um dos acordes da tonalidade de G?',
    choices: ['F', 'C', 'Em', 'D'],
    hint: 'F: o seu F não está em G maior, que tem F♯.',
    nudge: 'Escreve as três notas de cada acorde e procura uma nota que a tonalidade de G não tenha.',
  },
  l1u35m10e2: {
    prompt: 'Na tonalidade de G, F maior escreve-se ♭VII. Porquê?',
    choices: [
      'Fica sobre a nota 7 da tonalidade, baixada meio-tom',
      'Fica sobre a nota 7 da tonalidade, subida meio-tom',
      'Fica sobre a nota 6 da tonalidade, baixada meio-tom',
      'Fica sobre a nota 4 da tonalidade, baixada meio-tom',
    ],
    hint: 'A nota 7 de G maior é F♯; baixada meio-tom é F, e o acorde sobre ela é maior, por isso ♭VII.',
    nudge: 'Que nota de G maior fica a meio-tom de F, e em que direção?',
  },
  l1u35m10e3: {
    prompt: 'Na tonalidade de G, que acorde é o ii?',
    choices: ['A menor', 'A maior', 'C maior', 'C menor'],
    hint: 'O acorde de A menor: A, C e E, todas em G maior. O acorde de A maior, com C♯, seria o II, de fora da tonalidade.',
    nudge: 'Constrói um acorde sobre a nota 2 só com as notas de G maior e confirma a sua nota do meio.',
  },
  l1u35m10e4: {
    prompt: 'Uma música faz G, F, C e G e volta sempre a repousar em G. Em que tonalidade está?',
    choices: ['Em G, com um acorde de fora', 'Em F, com um acorde de fora', 'Em C, com um acorde de fora', 'Em D, com um acorde de fora'],
    hint: 'Em G: é o acorde em que a música volta a repousar, e C também pertence a G; F é emprestado de G menor.',
    nudge: 'Que acorde soa como a casa? Depois confirma quais dos outros pertencem a essa tonalidade.',
  },
  l1u35m10e5: {
    prompt: 'Constrói o ♭VII da tonalidade de G: um acorde maior sobre a nota 7 de G maior, baixada meio-tom.',
    hint: 'F, A e C: F maior, sobre o F, meio-tom abaixo de F♯.',
    nudge: 'Encontra a nota 7 de G maior, baixa-a uma tecla e constrói um acorde maior sobre ela.',
  },
};

export default overlay;
