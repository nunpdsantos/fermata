import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese translations for Level 1 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidade 1: Notação e Altura
  // =========================================================================

  // ---- l1u1m1: Pauta e Claves ----

  l1u1m1e1: {
    prompt:
      'Identifica esta nota na clave de sol: encontra-se na linha suplementar abaixo da pauta.',
    hint: 'O C central situa-se numa linha suplementar logo abaixo da pauta de clave de sol.',
  },
  l1u1m1e2: {
    prompt:
      'Identifica esta nota: encontra-se na primeira linha da pauta de clave de sol.',
    hint: 'As linhas da clave de sol, de baixo para cima, são E-G-B-D-F. A primeira linha é E4.',
  },
  l1u1m1e3: {
    prompt:
      'Identifica esta nota: encontra-se na segunda linha da pauta de clave de sol.',
    hint: 'A clave de sol enrola-se em torno da segunda linha, marcando-a como G. Por isso também se chama clave de G.',
  },
  l1u1m1e4: {
    prompt:
      'Qual é a clave que utiliza a segunda linha da pauta como ponto de referência para a nota G?',
    choices: [
      'Clave de sol',
      'Clave de fá',
      'Clave de dó (alto)',
      'Clave de dó (tenor)',
    ],
    hint: 'A clave de sol também se chama clave de G porque se enrola em torno da segunda linha, definindo-a como G.',
  },

  // ---- l1u1m2: Linhas Suplementares ----

  l1u1m2e1: {
    prompt:
      'Identifica esta nota abaixo da pauta de clave de sol: encontra-se no espaço logo abaixo do C central.',
    hint: 'A3 situa-se duas linhas suplementares abaixo da pauta de clave de sol. A descer a partir do C central: B3 está no espaço abaixo da linha suplementar, A3 está na linha suplementar seguinte.',
  },
  l1u1m2e2: {
    prompt:
      'Identifica esta nota acima da pauta de clave de sol: encontra-se duas linhas suplementares acima da linha superior.',
    hint: 'C6 situa-se na segunda linha suplementar acima da pauta de clave de sol. Conta a partir da linha superior (F5): G5, A5, B5, C6.',
  },
  l1u1m2e3: {
    prompt: 'Qual é a função das linhas suplementares?',
    choices: [
      'Prolongar a pauta para notas acima ou abaixo das suas cinco linhas',
      'Indicar o andamento de uma peça',
      'Separar os compassos uns dos outros',
      'Mostrar onde ocorrem as pausas',
    ],
    hint: 'A pauta tem apenas cinco linhas. As notas que ultrapassam essas linhas necessitam de pequenas linhas adicionais para indicar a sua posição.',
  },
  l1u1m2e_ear1: {
    prompt: 'Ouve esta nota e identifica-a.',
    hint: 'Este é o C central -- a nota mais central do teclado do piano.',
  },
  l1u1m2e_ear2: {
    prompt: 'Ouve esta nota e identifica-a.',
    hint: 'Esta nota natural situa-se na primeira linha da pauta de clave de sol.',
  },
  l1u1m2e_ear3: {
    prompt: 'Ouve esta nota e identifica-a.',
    hint: 'Esta nota situa-se na segunda linha da pauta de clave de sol -- a linha em torno da qual a clave de sol se enrola.',
  },
  l1u1m2e_ear4: {
    prompt: 'Ouve esta nota e identifica-a.',
    hint: 'Esta é a nota de referência padrão para afinação, a 440 Hz.',
  },

  // ---- l1u1m3: Meios-tons e Tons ----

  l1u1m3e1: {
    prompt: 'Qual é o intervalo de C a C#?',
    hint: 'De C a C# é a menor distância possível na música ocidental: um meio-tom, equivalente a 1 semitom.',
  },
  l1u1m3e2: {
    prompt: 'Qual é o intervalo de C a D?',
    hint: 'De C a D é um tom: dois meios-tons, equivalente a 2 semitons. Existe uma tecla (C#/Db) entre eles.',
  },
  l1u1m3e3: {
    prompt:
      'Qual é o intervalo de E a F? Este é um par especial de notas naturais.',
    hint: 'De E a F é um meio-tom natural: não existe tecla preta entre elas no piano. É apenas 1 semitom.',
  },

  // ---- l1u1m4: Escala Cromática ----

  l1u1m4e1: {
    prompt: 'Identifica esta nota: a tecla preta entre F e G.',
    hint: 'A tecla preta entre F e G pode chamar-se F# (F sustenido) ou Gb (G bemol). Ambos os nomes referem-se à mesma altura.',
  },
  l1u1m4e2: {
    prompt: 'Identifica esta nota: a tecla preta entre A e B.',
    hint: 'A tecla preta entre A e B pode chamar-se Bb (B bemol) ou A# (A sustenido). Em tonalidades com bemóis, esta nota chama-se Bb.',
  },
  l1u1m4e3: {
    prompt:
      'Quantas alturas distintas tem a escala cromática antes de se repetir?',
    choices: ['12', '7', '8', '10'],
    hint: 'A escala cromática inclui todas as notas: 7 teclas brancas + 5 teclas pretas = 12 alturas distintas por oitava.',
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
  },
  l1u2m1e2: {
    prompt: 'Quantos tempos vale uma mínima em compasso 4/4?',
    choices: ['2 tempos', '4 tempos', '1 tempo', '3 tempos'],
    hint: 'Uma mínima tem metade da duração de uma semibreve. Uma semibreve = duas mínimas = 4 tempos / 2 = 2 tempos cada.',
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
      '4 tempos de colcheia por compasso',
      '4 compassos por linha',
    ],
    hint: 'O número superior (4) indica os tempos por compasso. O número inferior (4) indica que a semínima vale um tempo.',
  },
  l1u2m2e2: {
    prompt: 'O que indica a indicação de compasso 3/4?',
    choices: [
      '3 tempos de semínima por compasso',
      '3 tempos de mínima por compasso',
      '4 tempos agrupados em três',
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
      'A música não tem indicação de compasso',
      'O andamento é lento e regular',
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
    hint: 'G é a 5.a nota de C maior -- a dominante.',
  },
  l1u3m1e_deg3: {
    prompt: 'Na escala de C maior, qual é o grau da nota F?',
    hint: 'F é a 4.a nota de C maior -- a subdominante.',
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
      '1 bemol (Bb)',
    ],
    hint: 'G maior necessita de F# para manter o padrão T-T-mT-T-T-T-mT. Esse único sustenido é a sua armação de clave.',
  },
  l1u3m2e2: {
    prompt: 'Qual é a tonalidade com a armação de clave de um bemol (Bb)?',
    choices: ['F maior', 'Bb maior', 'C maior', 'G maior'],
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
    hint: 'C-D-E-F-G = 5 nomes de notas = uma 5.a. De C a G são 7 semitons, o que corresponde a uma 5.a perfeita.',
  },
  l1u3m3e2: {
    prompt:
      'Identifica o intervalo: C até F (ascendente). Conta os nomes das notas.',
    hint: 'C-D-E-F = 4 nomes de notas = uma 4.a. De C a F são 5 semitons, o que corresponde a uma 4.a perfeita.',
  },
  l1u3m3e3: {
    prompt:
      'Identifica o intervalo: C até E (ascendente). Conta os nomes das notas.',
    hint: 'C-D-E = 3 nomes de notas = uma 3.a. De C a E são 4 semitons, o que corresponde a uma 3.a maior.',
  },

  // ---- l1u3m4: Tríades Maiores ----

  l1u3m4e1: {
    prompt:
      'Constrói uma tríade de C maior. Seleciona as 3 notas: fundamental, 3.a maior e 5.a perfeita.',
    hint: 'C maior = C, E, G. Fundamental (C) + 3.a maior (E, 4 semitons acima) + 5.a perfeita (G, 7 semitons acima).',
  },
  l1u3m4e2: {
    prompt:
      'Constrói uma tríade de G maior. Seleciona as 3 notas que formam este acorde.',
    hint: 'G maior = G, B, D. Fundamental (G) + 3.a maior (B, 4 semitons acima) + 5.a perfeita (D, 7 semitons acima).',
  },
  l1u3m4e3: {
    prompt: 'Quais intervalos compõem uma tríade maior?',
    choices: [
      'Fundamental, 3.a maior (4 semitons), 5.a perfeita (7 semitons)',
      'Fundamental, 3.a menor (3 semitons), 5.a perfeita (7 semitons)',
      'Fundamental, 3.a maior (4 semitons), 5.a menor (6 semitons)',
      'Fundamental, 4.a perfeita (5 semitons), 5.a perfeita (7 semitons)',
    ],
    hint: 'Uma tríade maior empilha uma 3.a maior (4 meios-tons a partir da fundamental) e depois uma 3.a menor por cima (mais 3), resultando em fundamental + 3.aM + 5.aP.',
  },
};

export default overlay;
