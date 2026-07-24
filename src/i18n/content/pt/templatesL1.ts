import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 1 exercise templates
// 10 modules, 16 templates total
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 1: Notação e Altura
  // =========================================================================

  // ---- l1u1m1: Pauta e Claves ----
  l1u1m1: [
    {
      // note_id
      promptTemplate:
        'Identifica a nota mostrada na pauta em clave de sol ou logo junto dela.',
      hintTemplate:
        'Usa as posições na clave de sol: linhas Mi-Sol-Si-Ré-Fá, espaços Fá-Lá-Dó-Mi.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Que nota se encontra na linha ou espaço indicado da pauta?',
      hintTemplate:
        'Lembra-te das linhas da clave de sol (Mi-Sol-Si-Ré-Fá) e dos espaços (Fá-Lá-Dó-Mi).',
      choiceSets: [
        [
          'A clave de sol é também conhecida como clave de G',
          'A clave de sol é também conhecida como clave de F',
          'A clave de sol é também conhecida como clave de C',
          'A clave de sol é também conhecida como clave de D',
        ],
        [
          'A clave de fá marca a quarta linha como F',
          'A clave de fá marca a segunda linha como G',
          'A clave de fá marca a terceira linha como C',
          'A clave de fá marca a primeira linha como E',
        ],
      ],
    },
  ],

  // ---- l1u1m2: Linhas Suplementares ----
  l1u1m2: [
    {
      // note_id
      promptTemplate:
        'Identifica esta nota que necessita de linhas suplementares.',
      hintTemplate:
        'As notas acima ou abaixo da pauta utilizam linhas suplementares. Conta passo a passo a partir da linha da pauta mais próxima.',
    },
    {
      // note_id
      promptTemplate:
        'Identifica esta nota numa linha suplementar abaixo da pauta em clave de sol.',
      hintTemplate:
        'Abaixo da pauta em clave de sol: o Dó central situa-se numa linha suplementar. Conta para baixo a partir daí para notas mais graves.',
    },
  ],

  // ---- l1u1m3: Meios-tons e Tons ----
  l1u1m3: [
    {
      // interval_id
      promptTemplate:
        'Qual é o intervalo a partir de {root} no sentido {direction}? É um meio-tom ou um tom?',
      hintTemplate:
        'Um meio-tom é 1 semitom (teclas adjacentes no piano). Um tom é 2 semitons (uma tecla entre elas). A partir de {root}, conta com cuidado.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Que par de notas naturais forma um meio-tom?',
      hintTemplate:
        'No piano, a maioria das notas naturais tem uma tecla preta entre elas (tom). Apenas dois pares são diretamente adjacentes, sem tecla preta entre eles.',
      choiceSets: [
        ['Mi e Fá', 'Dó e Ré', 'Sol e Lá', 'Ré e Mi'],
        ['Si e Dó', 'Lá e Si', 'Fá e Sol', 'Sol e Lá'],
      ],
    },
  ],

  // ---- l1u1m4: Escala Cromática ----
  l1u1m4: [
    {
      // note_id
      promptTemplate:
        'Identifica esta nota de tecla preta. Usa o nome com sustenido.',
      hintTemplate:
        'As teclas pretas têm dois nomes (equivalentes enarmónicos). Usa aqui a grafia com sustenido.',
    },
    {
      // note_id
      promptTemplate:
        'Identifica esta nota de tecla preta. Usa o nome com bemol.',
      hintTemplate:
        'Esta tecla preta situa-se entre duas teclas brancas. Usa aqui a grafia com bemol.',
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
        'Cada valor de nota tem exatamente metade da duração do valor imediatamente superior. Semibreve = 4 tempos, mínima = 2, semínima = 1, colcheia = 0,5 em compasso 4/4.',
      choiceSets: [
        [
          'Duas mínimas equivalem a uma semibreve',
          'Duas mínimas equivalem a uma semínima',
          'Quatro mínimas equivalem a uma semibreve',
          'Uma mínima equivale a quatro semínimas',
        ],
        [
          'Duas colcheias equivalem a uma semínima',
          'Duas colcheias equivalem a uma mínima',
          'Quatro colcheias equivalem a uma semínima',
          'Uma colcheia equivale a uma semínima',
        ],
        [
          'Uma mínima com ponto dura 3 tempos em compasso 4/4',
          'Uma mínima com ponto dura 4 tempos em compasso 4/4',
          'Uma mínima com ponto dura 2 tempos em compasso 4/4',
          'Uma mínima com ponto dura 1,5 tempos em compasso 4/4',
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

  // ---- l1u2m2: Compasso e Indicações de Compasso ----
  l1u2m2: [
    {
      // multiple_choice
      promptTemplate:
        'O que indica esta fórmula de compasso sobre a música?',
      hintTemplate:
        'O número de cima indica os tempos por compasso. O número de baixo indica qual figura recebe um tempo (4 = semínima, 8 = colcheia, 2 = mínima).',
      choiceSets: [
        [
          '2/4 significa 2 tempos de semínima por compasso',
          '2/4 significa 4 tempos de mínima por compasso',
          '2/4 significa 2 tempos de mínima por compasso',
          '2/4 significa 4 tempos de semínima por compasso',
        ],
        [
          '6/8 é um compasso composto com 2 tempos principais',
          '6/8 é um compasso simples com 6 tempos',
          '6/8 é o mesmo que 3/4',
          '6/8 tem 8 tempos por compasso',
        ],
        [
          'Tempo comum (C) equivale a 4/4',
          'Tempo comum (C) equivale a 2/2',
          'Tempo comum (C) significa que a peça está em Dó maior',
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
        'Constrói a escala de {root} maior. Seleciona as 7 notas seguindo o padrão T-T-S-T-T-T-S.',
      hintTemplate:
        'A escala de {root} maior segue Tom-Tom-Semitom-Tom-Tom-Tom-Semitom a partir de {root}. Conta os semitons: T=2, S=1.',
    },
    {
      // scale_degree_id
      promptTemplate:
        'Na escala de {root} {scaleType}, qual é o grau da nota {note}?',
      hintTemplate:
        'Conta a partir de {root} (grau 1) ao longo da escala {scaleType} até chegares à nota {note}.',
    },
  ],

  // ---- l1u3m2: Armações de Clave ----
  l1u3m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual é a armação de clave para esta tonalidade maior?',
      hintTemplate:
        'As tonalidades com sustenidos seguem o ciclo de quintas: Sol(1#), Ré(2#), Lá(3#), Mi(4#). Com bemóis: Fá(1b), Sib(2b), Mib(3b), Láb(4b).',
      choiceSets: [
        [
          'Mi maior tem 4 sustenidos: F#, C#, G#, D#',
          'Mi maior tem 3 sustenidos: F#, C#, G#',
          'Mi maior tem 5 sustenidos',
          'Mi maior tem 2 sustenidos',
        ],
        [
          'Sib maior tem 2 bemóis: Bb, Eb',
          'Sib maior tem 1 bemol: Bb',
          'Sib maior tem 3 bemóis',
          'Sib maior não tem bemóis',
        ],
        [
          'Láb maior tem 4 bemóis: Bb, Eb, Ab, Db',
          'Láb maior tem 3 bemóis',
          'Láb maior tem 5 bemóis',
          'Láb maior tem 2 bemóis',
        ],
        [
          'Dó maior não tem sustenidos nem bemóis',
          'Dó maior tem 1 sustenido',
          'Dó maior tem 1 bemol',
          'Dó maior tem 7 sustenidos',
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
        'A partir de {root}, conta os nomes das notas para o número do intervalo e os semitons para a qualidade. {semitones} semitons {direction}.',
    },
  ],

  // ---- l1u3m4: Tríades Maiores ----
  l1u3m4: [
    {
      // chord_build
      promptTemplate:
        'Constrói a tríade de {root} maior. Seleciona a fundamental, a 3.a maior (4 semitons) e a 5.a perfeita (7 semitons).',
      hintTemplate:
        'Uma tríade maior = fundamental + 3.a maior (4 semitons acima) + 5.a perfeita (7 semitons acima). Começa em {root} e conta.',
    },
    {
      // chord_build
      promptTemplate:
        'Constrói a tríade de {root} maior utilizando as notas da armação de clave.',
      hintTemplate:
        'Tríade de {root} maior: fundamental ({root}), 3.a maior, 5.a perfeita. Lembra-te da armação de clave para encontrar as notas corretas.',
    },
  ],
};

export default overlay;
