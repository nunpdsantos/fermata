import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 1 exercise templates
// 10 modules, 16 templates total
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 1: Notacao e Altura
  // =========================================================================

  // ---- l1u1m1: Pauta e Claves ----
  l1u1m1: [
    {
      // note_id
      promptTemplate:
        'Identifica a nota {note} na pauta em clave de sol ou logo junto dela.',
      hintTemplate:
        'Esta nota e {note} na oitava {octave}. Usa as posicoes na clave de sol: linhas Mi-Sol-Si-Re-Fa, espacos Fa-La-Do-Mi.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Que nota se encontra na linha ou espaco indicado da pauta?',
      hintTemplate:
        'Lembra-te das linhas da clave de sol (Mi-Sol-Si-Re-Fa) e dos espacos (Fa-La-Do-Mi).',
      choiceSets: [
        [
          'A clave de sol e tambem conhecida como clave de G',
          'A clave de sol e tambem conhecida como clave de F',
          'A clave de sol e tambem conhecida como clave de C',
          'A clave de sol e tambem conhecida como clave de D',
        ],
        [
          'A clave de fa marca a quarta linha como F',
          'A clave de fa marca a segunda linha como G',
          'A clave de fa marca a terceira linha como C',
          'A clave de fa marca a primeira linha como E',
        ],
      ],
    },
  ],

  // ---- l1u1m2: Linhas Suplementares ----
  l1u1m2: [
    {
      // note_id
      promptTemplate:
        'Identifica esta nota que necessita de linhas suplementares: {note}{octave}.',
      hintTemplate:
        'As notas acima ou abaixo da pauta utilizam linhas suplementares. Conta passo a passo a partir da linha da pauta mais proxima para encontrar {note}.',
    },
    {
      // note_id
      promptTemplate:
        'Identifica esta nota numa linha suplementar abaixo da pauta em clave de sol.',
      hintTemplate:
        'Abaixo da pauta em clave de sol: o Do central situa-se numa linha suplementar. Conta para baixo a partir dai para notas mais graves.',
    },
  ],

  // ---- l1u1m3: Meios-tons e Tons ----
  l1u1m3: [
    {
      // interval_id
      promptTemplate:
        'Qual e o intervalo a partir de {root} no sentido {direction}? E um meio-tom ou um tom?',
      hintTemplate:
        'Um meio-tom e 1 semitom (teclas adjacentes no piano). Um tom e 2 semitons (uma tecla entre elas). A partir de {root}, conta com cuidado.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Que par de notas naturais forma um meio-tom?',
      hintTemplate:
        'No piano, a maioria das notas naturais tem uma tecla preta entre elas (tom). Apenas dois pares sao diretamente adjacentes, sem tecla preta entre eles.',
      choiceSets: [
        ['Mi e Fa', 'Do e Re', 'Sol e La', 'Re e Mi'],
        ['Si e Do', 'La e Si', 'Fa e Sol', 'Sol e La'],
      ],
    },
  ],

  // ---- l1u1m4: Escala Cromatica ----
  l1u1m4: [
    {
      // note_id
      promptTemplate:
        'Identifica esta nota: a tecla preta que pode ser chamada {note}.',
      hintTemplate:
        'As teclas pretas tem dois nomes (equivalentes enarmonicos). Esta pode ser chamada {note}.',
    },
    {
      // note_id
      promptTemplate:
        'Identifica esta nota: a tecla preta que pode ser chamada {note}.',
      hintTemplate:
        'Esta tecla preta situa-se entre duas teclas brancas. Pode ser chamada {note}.',
    },
  ],

  // =========================================================================
  // Unidade 2: Ritmo e Compasso
  // =========================================================================

  // ---- l1u2m1: Valores das Notas ----
  l1u2m1: [
    {
      // multiple_choice
      promptTemplate:
        'Como se relacionam estes valores de notas entre si?',
      hintTemplate:
        'Cada valor de nota tem exatamente metade da duracao do valor imediatamente superior. Semibreve = 4 tempos, minima = 2, seminima = 1, colcheia = 0,5 em compasso 4/4.',
      choiceSets: [
        [
          'Duas minimas equivalem a uma semibreve',
          'Duas minimas equivalem a uma seminima',
          'Quatro minimas equivalem a uma semibreve',
          'Uma minima equivale a quatro seminimas',
        ],
        [
          'Duas colcheias equivalem a uma seminima',
          'Duas colcheias equivalem a uma minima',
          'Quatro colcheias equivalem a uma seminima',
          'Uma colcheia equivale a uma seminima',
        ],
        [
          'Uma minima com ponto dura 3 tempos em compasso 4/4',
          'Uma minima com ponto dura 4 tempos em compasso 4/4',
          'Uma minima com ponto dura 2 tempos em compasso 4/4',
          'Uma minima com ponto dura 1,5 tempos em compasso 4/4',
        ],
        [
          'Uma semicolcheia vale metade de um tempo em compasso 4/4',
          'Uma semicolcheia vale um quarto de tempo em compasso 4/4',
          'Uma semicolcheia vale um tempo em compasso 4/4',
          'Uma semicolcheia vale um oitavo de tempo em compasso 4/4',
        ],
      ],
    },
  ],

  // ---- l1u2m2: Compasso e Indicacoes de Compasso ----
  l1u2m2: [
    {
      // multiple_choice
      promptTemplate:
        'O que indica esta formula de compasso sobre a musica?',
      hintTemplate:
        'O numero de cima indica os tempos por compasso. O numero de baixo indica qual figura recebe um tempo (4 = seminima, 8 = colcheia, 2 = minima).',
      choiceSets: [
        [
          '2/4 significa 2 tempos de seminima por compasso',
          '2/4 significa 4 tempos de minima por compasso',
          '2/4 significa 2 tempos de minima por compasso',
          '2/4 significa 4 tempos de seminima por compasso',
        ],
        [
          '6/8 e um compasso composto com 2 tempos principais',
          '6/8 e um compasso simples com 6 tempos',
          '6/8 e o mesmo que 3/4',
          '6/8 tem 8 tempos por compasso',
        ],
        [
          'Tempo comum (C) equivale a 4/4',
          'Tempo comum (C) equivale a 2/2',
          'Tempo comum (C) significa que a peca esta em Do maior',
          'Tempo comum (C) equivale a 3/4',
        ],
        [
          'Tempo cortado (alla breve) equivale a 2/2',
          'Tempo cortado equivale a 4/4',
          'Tempo cortado significa tocar a metade do andamento',
          'Tempo cortado equivale a 6/8',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 3: Escalas, Intervalos e Primeiros Acordes
  // =========================================================================

  // ---- l1u3m1: Escala Maior ----
  l1u3m1: [
    {
      // scale_build
      promptTemplate:
        'Constroi a escala de {root} maior. Seleciona as 7 notas seguindo o padrao T-T-S-T-T-T-S.',
      hintTemplate:
        'A escala de {root} maior segue Tom-Tom-Semitom-Tom-Tom-Tom-Semitom a partir de {root}. Conta os semitons: T=2, S=1.',
    },
    {
      // scale_degree_id
      promptTemplate:
        'Na escala de {root} {scaleType}, qual e o grau da nota {note}?',
      hintTemplate:
        'Conta a partir de {root} (grau 1) ao longo da escala {scaleType} ate chegares a nota {note}.',
    },
  ],

  // ---- l1u3m2: Armacoes de Clave ----
  l1u3m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual e a armacao de clave para esta tonalidade maior?',
      hintTemplate:
        'As tonalidades com sustenidos seguem o ciclo de quintas: Sol(1#), Re(2#), La(3#), Mi(4#). Com bemois: Fa(1b), Sib(2b), Mib(3b), Lab(4b).',
      choiceSets: [
        [
          'Mi maior tem 4 sustenidos: F#, C#, G#, D#',
          'Mi maior tem 3 sustenidos: F#, C#, G#',
          'Mi maior tem 5 sustenidos',
          'Mi maior tem 2 sustenidos',
        ],
        [
          'Sib maior tem 2 bemois: Bb, Eb',
          'Sib maior tem 1 bemol: Bb',
          'Sib maior tem 3 bemois',
          'Sib maior nao tem bemois',
        ],
        [
          'Lab maior tem 4 bemois: Bb, Eb, Ab, Db',
          'Lab maior tem 3 bemois',
          'Lab maior tem 5 bemois',
          'Lab maior tem 2 bemois',
        ],
        [
          'Do maior nao tem sustenidos nem bemois',
          'Do maior tem 1 sustenido',
          'Do maior tem 1 bemol',
          'Do maior tem 7 sustenidos',
        ],
      ],
    },
  ],

  // ---- l1u3m3: Intervalos ----
  l1u3m3: [
    {
      // interval_id
      promptTemplate:
        'Identifica o intervalo a partir de {root} no sentido {direction}. Conta os nomes das notas e os semitons.',
      hintTemplate:
        'A partir de {root}, conta os nomes das notas para o numero do intervalo e os semitons para a qualidade. {semitones} semitons {direction}.',
    },
  ],

  // ---- l1u3m4: Triades Maiores ----
  l1u3m4: [
    {
      // chord_build
      promptTemplate:
        'Constroi a triade de {root} maior. Seleciona a fundamental, a 3.a maior (4 semitons) e a 5.a perfeita (7 semitons).',
      hintTemplate:
        'Uma triade maior = fundamental + 3.a maior (4 semitons acima) + 5.a perfeita (7 semitons acima). Comeca em {root} e conta.',
    },
    {
      // chord_build
      promptTemplate:
        'Constroi a triade de {root} maior utilizando as notas da armacao de clave.',
      hintTemplate:
        'Triade de {root} maior: fundamental ({root}), 3.a maior, 5.a perfeita. Lembra-te da armacao de clave para encontrar as notas corretas.',
    },
  ],
};

export default overlay;
