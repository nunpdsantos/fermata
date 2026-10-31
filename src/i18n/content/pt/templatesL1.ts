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
        'Usa as posições na clave de sol: linhas E-G-B-D-F, espaços F-A-C-E.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as claves é verdadeira?',
      hintTemplate:
        'Lembra-te das linhas da clave de sol (E-G-B-D-F) e dos espaços (F-A-C-E).',
      choiceSets: [
        [
          'A clave de sol é também conhecida como clave de G',
          'A clave de sol é também conhecida como clave de F',
          'A clave de sol é também conhecida como clave de C',
          'A clave de sol é também conhecida como clave de D',
        ],
        [
          'A clave de fá marca a quarta linha (a contar de baixo) como F',
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
      // note_id (clave de sol, abaixo da pauta)
      promptTemplate:
        'Identifica esta nota abaixo da pauta em clave de sol. Conta linha a linha para baixo a partir da parte inferior da pauta.',
      hintTemplate:
        'Abaixo da pauta em clave de sol, o C central situa-se na primeira linha suplementar. Conta para baixo grau a grau a partir daí: linhas e espaços alternam, por isso a linha suplementar seguinte tem o A e a outra a seguir o F.',
    },
    {
      // note_id (clave de sol, acima da pauta)
      promptTemplate:
        'Identifica esta nota acima da pauta em clave de sol. Conta linha a linha para cima a partir do topo da pauta.',
      hintTemplate:
        'A linha superior da pauta em clave de sol é o F. Conta para cima grau a grau: o G fica logo acima da pauta, o A na primeira linha suplementar, o C na segunda e o E na terceira.',
    },
    {
      // note_id (clave de fá, acima da pauta)
      promptTemplate:
        'Identifica esta nota acima da pauta em clave de fá. Conta linha a linha para cima a partir do topo da pauta.',
      hintTemplate:
        'A linha superior da pauta em clave de fá é o A. O C central situa-se na primeira linha suplementar acima dela — o mesmo C central que fica na primeira linha suplementar abaixo da pauta em clave de sol. O E está na segunda linha suplementar.',
    },
  ],

  // ---- l1u1m3: Meios-tons e Tons ----
  l1u1m3: [
    {
      // interval_id
      promptTemplate:
        'Qual é o intervalo a partir de {root} no sentido {direction}? É um meio-tom ou um tom?',
      hintTemplate:
        'Um meio-tom é 1 meio-tom (teclas adjacentes no piano). Um tom é 2 meios-tons (uma tecla entre elas). A partir de {root}, conta com cuidado.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Que par de notas naturais forma um meio-tom?',
      hintTemplate:
        'No piano, a maioria das notas naturais tem uma tecla preta entre elas (tom). Apenas dois pares são diretamente adjacentes, sem tecla preta entre eles.',
      choiceSets: [
        ['E e F', 'C e D', 'G e A', 'D e E'],
        ['B e C', 'A e B', 'F e G', 'G e A'],
      ],
    },
  ],

  // ---- l1u1m4: Escala Cromática ----
  l1u1m4: [
    {
      // note_id
      promptTemplate:
        'Identifica esta nota de tecla preta, aqui escrita com sustenido.',
      hintTemplate:
        'Cada tecla preta tem dois nomes (equivalentes enarmónicos): um escrito com sustenido, outro com bemol. Lê a alteração na pauta: esta está escrita com sustenido.',
    },
    {
      // note_id
      promptTemplate:
        'Identifica esta nota de tecla preta, aqui escrita com bemol.',
      hintTemplate:
        'Cada tecla preta tem dois nomes (equivalentes enarmónicos): um escrito com sustenido, outro com bemol. Lê a alteração na pauta: esta está escrita com bemol.',
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
        'Qual destas afirmações sobre os valores das notas é verdadeira?',
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
          'Uma semicolcheia vale três quartos de tempo em compasso 4/4',
        ],
      ],
    },
  ],

  // ---- l1u2m2: Compasso e Indicações de Compasso ----
  l1u2m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as fórmulas de compasso é verdadeira?',
      hintTemplate:
        'O número de cima conta os tempos de cada compasso: 2 = binário, 3 = ternário, 4 = quaternário. O 4 de baixo indica que cada tempo é uma semínima.',
      choiceSets: [
        [
          '2/4 significa 2 tempos de semínima em cada compasso',
          '2/4 significa 4 tempos de mínima por compasso',
          '2/4 significa 2 tempos de mínima por compasso',
          '2/4 significa 4 tempos de semínima por compasso',
        ],
        [
          '3/4 agrupa os tempos de três em três: forte-fraco-fraco',
          '3/4 agrupa os tempos de dois em dois: forte-fraco',
          '3/4 agrupa os tempos de quatro em quatro: forte-fraco-meio-forte-fraco',
          '3/4 não tem nenhum tempo forte',
        ],
        [
          '4/4 é quaternário: quatro tempos por compasso',
          '4/4 é ternário: três tempos por compasso',
          '4/4 é binário: dois tempos por compasso',
          '4/4 significa quatro compassos em cada linha de música',
        ],
        [
          'Nos compassos 2/4, 3/4 e 4/4, o 4 de baixo indica que a semínima vale um tempo',
          'Nos compassos 2/4, 3/4 e 4/4, o 4 de baixo indica que a semibreve vale um tempo',
          'Nos compassos 2/4, 3/4 e 4/4, o 4 de baixo indica que há quatro compassos',
          'Nos compassos 2/4, 3/4 e 4/4, o 4 de baixo fixa o andamento em quatro tempos por segundo',
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
        'A escala de {root} maior segue Tom-Tom-Meio-tom-Tom-Tom-Tom-Meio-tom a partir de {root}. Conta os meios-tons: T=2, S=1.',
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
      // multiple_choice (a pauta mostra uma armação de clave)
      promptTemplate:
        'Que tonalidade maior tem esta armação de clave?',
      hintTemplate:
        'Sem sustenidos nem bemóis = C maior. Um sustenido (F#) = G maior. Dois sustenidos (F#, C#) = D maior. Um bemol (Bb) = F maior.',
      choiceSets: [
        [
          'C maior',
          'G maior',
          'D maior',
          'F maior',
        ],
        [
          'G maior',
          'D maior',
          'F maior',
          'C maior',
        ],
        [
          'D maior',
          'G maior',
          'C maior',
          'F maior',
        ],
        [
          'F maior',
          'C maior',
          'G maior',
          'D maior',
        ],
      ],
    },
  ],

  // ---- l1u3m3: Intervalos ----
  l1u3m3: [
    {
      // interval_id
      promptTemplate:
        'Identifica o intervalo a partir de {root} no sentido {direction} pelo seu número: conta os nomes das notas, incluindo as duas notas.',
      hintTemplate:
        'Conta os nomes das notas de {root} até à segunda nota, contando ambas: duas letras dão uma 2.ª, três uma 3.ª, quatro uma 4.ª, cinco uma 5.ª.',
    },
  ],

  // ---- l1u3m4: Tríades Maiores ----
  l1u3m4: [
    {
      // chord_build
      promptTemplate:
        'Constrói a tríade de {root} maior. Seleciona a fundamental, a 3.ª maior (4 meios-tons) e a 5.ª perfeita (7 meios-tons).',
      hintTemplate:
        'Uma tríade maior = fundamental + 3.ª maior (4 meios-tons acima) + 5.ª perfeita (7 meios-tons acima). Começa em {root} e conta.',
    },
    {
      // chord_build
      promptTemplate:
        'Constrói a tríade de {root} maior utilizando as notas da armação de clave.',
      hintTemplate:
        'Tríade de {root} maior: fundamental ({root}), 3.ª maior, 5.ª perfeita. Lembra-te da armação de clave para encontrar as notas corretas.',
    },
  ],
};

export default overlay;
