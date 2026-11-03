import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 3 exercise templates
// 13 modules. Mirrors templatesL3.ts entry by entry (module + template index,
// choice set + choice index) — see the W4-01 note there.
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 9: Acordes de Sétima e Harmonia Diatónica
  // =========================================================================

  // ---- l3u9m1: Acordes de Sétima — Cinco Qualidades ----
  l3u9m1: [
    {
      // chord_build
      promptTemplate:
        'Constrói um acorde de {root} {quality}. Seleciona as 4 notas.',
      hintTemplate:
        'Construção de acordes de sétima a partir de {root}: maj7 = 3M + 5P + 7M, min7 = 3m + 5P + 7m, dom7 = 3M + 5P + 7m, meio-dim7 = 3m + 5.ª diminuta + 7m, dim7 = 3m + 5.ª diminuta + 7.ª diminuta.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas definições de acorde de sétima está correta?',
      hintTemplate:
        'Ouve a qualidade da tríade (maior/menor/dim) e a qualidade da 7.ª (maior/menor/diminuta) empilhada por cima.',
      choiceSets: [
        [
          'Tríade maior + 7.ª maior = acorde de sétima maior',
          'Tríade maior + 7.ª maior = acorde de sétima da dominante',
          'Tríade maior + 7.ª maior = acorde de sétima menor',
          'Tríade maior + 7.ª maior = acorde de sétima meio-diminuta',
        ],
        [
          'Tríade maior + 7.ª menor = acorde de sétima da dominante',
          'Tríade maior + 7.ª menor = acorde de sétima maior',
          'Tríade maior + 7.ª menor = acorde de sétima menor',
          'Tríade maior + 7.ª menor = acorde de sétima totalmente diminuta',
        ],
        [
          'Tríade diminuta + 7.ª menor = acorde de sétima meio-diminuta',
          'Tríade diminuta + 7.ª menor = acorde de sétima diminuta',
          'Tríade diminuta + 7.ª menor = acorde de sétima menor',
          'Tríade diminuta + 7.ª menor = acorde de sétima da dominante',
        ],
      ],
    },
  ],

  // ---- l3u9m2: Inversões de Acordes de Sétima ----
  l3u9m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre as inversões dos acordes de sétima e o seu baixo cifrado é verdadeira?',
      hintTemplate:
        'Inversões de acordes de sétima: estado fundamental = 7 (fundamental no baixo), 1.ª inversão = 6/5 (3.ª no baixo), 2.ª inversão = 4/3 (5.ª no baixo), 3.ª inversão = 4/2 ou 2 (7.ª no baixo).',
      choiceSets: [
        [
          'A 3.ª inversão tem a 7.ª no baixo (4/2)',
          'A 3.ª inversão tem a 5.ª no baixo (4/3)',
          'A 3.ª inversão tem a 3.ª no baixo (6/5)',
          'A 3.ª inversão tem a fundamental no baixo (7)',
        ],
        [
          'A 1.ª inversão cifra-se 6/5',
          'A 1.ª inversão cifra-se 4/3',
          'A 1.ª inversão cifra-se 4/2',
          'A 1.ª inversão cifra-se 7/5/3',
        ],
        [
          'A 2.ª inversão cifra-se 4/3',
          'A 2.ª inversão cifra-se 6/5',
          'A 2.ª inversão cifra-se 4/2',
          'A 2.ª inversão cifra-se 6/4',
        ],
        [
          'Na 2.ª inversão, a 5.ª está no baixo',
          'Na 2.ª inversão, a 3.ª está no baixo',
          'Na 2.ª inversão, a 7.ª está no baixo',
          'Na 2.ª inversão, a fundamental está no baixo',
        ],
      ],
    },
  ],

  // ---- l3u9m3: Acordes de Sétima Diatónicos em Maior ----
  l3u9m3: [
    {
      // chord_build
      promptTemplate:
        'Constrói o acorde de sétima diatónico sobre {root} em C maior. Usa apenas teclas brancas.',
      hintTemplate:
        'Acordes de 7.ª diatónicos em C maior: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5. Constrói sobre {root} usando apenas notas da escala de C maior.',
    },
  ],

  // ---- l3u9m4: Acordes de Sétima Diatónicos em Menor ----
  l3u9m4: [
    {
      // chord_build
      promptTemplate:
        'Constrói o acorde de sétima diatónico sobre {root} em A menor (menor harmónica).',
      hintTemplate:
        'Na menor harmónica, o 7.º grau elevado cria qualidades de acordes diferentes da menor natural. O V torna-se sétima da dominante e o vii torna-se sétima diminuta. O 7.º grau elevado cria qualidades de acorde invulgares — não estranhes sonoridades pouco familiares.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre os acordes de sétima da menor harmónica é verdadeira?',
      hintTemplate:
        'Na menor harmónica, o 7.º grau elevado altera a qualidade dos acordes construídos sobre os graus III, V e VII.',
      choiceSets: [
        [
          'Na menor harmónica, V7 é um acorde de sétima da dominante',
          'Na menor harmónica, V7 é um acorde de sétima menor',
          'Na menor harmónica, V7 é um acorde de sétima maior',
          'Na menor harmónica, V7 é um acorde de sétima meio-diminuta',
        ],
        [
          'Na menor harmónica, vii°7 é totalmente diminuto',
          'Na menor harmónica, vii°7 é um acorde de sétima meio-diminuta (m7b5)',
          'Na menor harmónica, vii°7 é um acorde de sétima menor',
          'Na menor harmónica, vii°7 é um acorde de sétima da dominante',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 10: Condução de Vozes
  // =========================================================================

  // ---- l3u10m1: Noções Básicas de SATB ----
  l3u10m1: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a disposição das vozes SATB é verdadeira?',
      hintTemplate:
        'Tessituras SATB: Soprano C4-G5, Contralto F3-C5, Tenor C3-G4, Baixo E2-C4. As vozes adjacentes devem manter-se a uma distância de no máximo uma oitava entre si (exceto baixo-tenor). O cruzamento coloca uma voz normalmente mais grave acima da vizinha; nas tríades em estado fundamental, duplicar a fundamental é o ponto de partida habitual.',
      choiceSets: [
        [
          'Vozes superiores adjacentes: no máximo uma oitava; tenor–baixo: pode exceder uma oitava',
          'Vozes superiores adjacentes: podem exceder uma oitava; tenor–baixo: no máximo uma oitava',
          'Vozes superiores adjacentes: no máximo uma oitava; tenor–baixo: no máximo uma oitava',
          'Vozes superiores adjacentes: podem exceder uma oitava; tenor–baixo: pode exceder uma oitava',
        ],
        [
          'Cruzamento de vozes: o contralto canta B4 enquanto o soprano canta G4',
          'Cruzamento de vozes: o contralto canta G4 enquanto o soprano canta G4',
          'Cruzamento de vozes: o contralto canta G4 enquanto o soprano canta B4',
          'Cruzamento de vozes: o contralto canta C4 enquanto o soprano canta E4',
        ],
        [
          'No estado fundamental, duplicar a fundamental é geralmente a escolha mais segura',
          'No estado fundamental, duplicar a sensível é geralmente a escolha mais segura',
          'No estado fundamental, duplicar a 3.ª é normalmente mais seguro do que duplicar a fundamental',
          'No estado fundamental, uma tríade preenche geralmente quatro vozes sem duplicar uma nota do acorde',
        ],
      ],
    },
  ],

  // ---- l3u10m2: Regras de Escrita a Partes ----
  l3u10m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre condução de vozes é verdadeira?',
      hintTemplate:
        'Evita 5.as e 8.as paralelas, resolve a sensível para cima, cuidado com 5.as e 8.as diretas entre as vozes extremas, e mantém notas comuns quando possível.',
      choiceSets: [
        [
          'Quintas paralelas: D4–A4 → E4–B4',
          'Quintas paralelas: D4–A4 → D4–B4',
          'Quintas paralelas: D4–A4 → E4–A4',
          'Quintas paralelas: D4–A4 → D4–A4',
        ],
        [
          'A sensível resolve por grau ascendente para a tónica',
          'A sensível resolve por grau descendente para a submediante',
          'A sensível pode mover-se livremente em qualquer direção',
          'A sensível salta para cima até à mediante',
        ],
        [
          'Uma quinta direta nas vozes extremas é aceitável com soprano por grau conjunto e baixo por salto',
          'Uma quinta direta nas vozes extremas é aceitável com soprano por salto e baixo por grau conjunto',
          'Uma quinta direta nas vozes extremas é aceitável com soprano por salto e baixo por salto',
          'Uma quinta direta nas vozes extremas é aceitável sempre que o baixo se move por grau conjunto',
        ],
        [
          'O movimento contrário entre as vozes extremas é geralmente preferido',
          'O movimento paralelo entre as quatro vozes é geralmente preferido',
          'O movimento direto entre as vozes extremas é geralmente obrigatório',
          'O movimento oblíquo entre as vozes extremas é geralmente proibido',
        ],
      ],
    },
  ],

  // ---- l3u10m3: Escrita a Partes em Estado Fundamental ----
  l3u10m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a escrita a partes com tríades no estado fundamental é verdadeira?',
      hintTemplate:
        'Fundamentais a uma 5.ª partilham uma nota comum, a uma 3.ª partilham duas, a uma 2.ª nenhuma. Mantém as notas comuns na mesma voz; quando não há nenhuma, move as vozes superiores contra o baixo.',
      nudgeTemplate: 'Testa cada afirmação com acordes reais em C maior — I–V (fundamentais a uma 5.ª), I–vi (a uma 3.ª), IV–V (a uma 2.ª): escreve os dois acordes, conta as notas que partilham e vê quanto tem de se mover cada voz superior. Para saber que nota dobrar, pergunta-te qual é o membro mais estável do acorde.',
      choiceSets: [
        [
          'Fundamentais a uma 5.ª partilham uma nota comum: mantém-na na mesma voz',
          "Fundamentais a uma 5.ª partilham duas notas comuns: mantém-nas nas mesmas vozes",
          "Fundamentais a uma 5.ª partilham duas notas comuns: move-as para outras vozes",
          "Fundamentais a uma 5.ª partilham uma nota comum: move-a para outra voz",
        ],
        [
          'Fundamentais a uma 3.ª partilham duas notas comuns: mantém ambas e move uma voz',
          'Fundamentais a uma 3.ª partilham uma nota comum: mantém essa nota na mesma voz',
          'Fundamentais a uma 3.ª não partilham nenhuma nota comum: move as três vozes superiores',
          'Fundamentais a uma 3.ª partilham três notas comuns: mantém as três nas mesmas vozes',
        ],
        [
          'Fundamentais a uma 2.ª não partilham notas: move as vozes superiores contra o baixo',
          'Fundamentais a uma 2.ª partilham duas notas comuns: mantém ambas e move uma voz',
          'Fundamentais a uma 2.ª: move as quatro vozes na mesma direção que o baixo',
          'Fundamentais a uma 2.ª partilham uma nota comum, mantida no soprano enquanto as outras se movem',
        ],
        [
          "Cada voz superior move-se para a nota do acorde disponível mais próxima",
          'Cada voz superior salta para uma nova nota do acorde para acrescentar interesse melódico',
          'Cada voz superior move-se para a nota do acorde uma oitava acima',
          'Cada voz superior move-se para a mesma nota do acorde que o baixo',
        ],
        [
          'Nas tríades no estado fundamental, dobra a fundamental por norma',
          'Nas tríades no estado fundamental, dobra a sensível',
          'Nas tríades no estado fundamental, dobra a 3.ª por norma',
          'Nas tríades no estado fundamental, nunca dobres nenhuma nota',
        ],
      ],
    },
  ],

  // ---- l3u10m4: Tríades Invertidas ----
  l3u10m4: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre tríades invertidas é verdadeira?',
      hintTemplate:
        '1.ª inversão (6/3): 3.ª no baixo, usada para linhas de baixo suaves. 2.ª inversão (6/4): 5.ª no baixo, usada apenas como 6/4 cadencial, de passagem, de pedal ou arpejado. Quando a sensível está no baixo (p. ex. V6), não a dupliques.',
      nudgeTemplate: 'Lê os números como intervalos acima do baixo: empilha uma 6.ª e uma 3.ª (6/3) ou uma 6.ª e uma 4.ª (6/4) sobre uma nota do baixo e vê que membro do acorde fica no baixo. Depois pensa em como cada acorde se comporta: que notas têm uma atração forte, e em que poucos padrões fixos aparece um 6/4?',
      choiceSets: [
        [
          'A 1.ª inversão põe a 3.ª no baixo e pode ocorrer fora das cadências',
          'A 1.ª inversão põe a 5.ª no baixo e pode ocorrer fora das cadências',
          'A 1.ª inversão põe a 3.ª no baixo e ocorre apenas nas cadências',
          'A 1.ª inversão põe a 5.ª no baixo e ocorre apenas nas cadências',
        ],
        [
          'Tipos comuns de 6/4: cadencial, de passagem, de pedal, arpejado',
          'Tipos comuns de 6/4: tónica, predominante, dominante, substituto da tónica',
          'Tipos comuns de 6/4: autêntico, plagal, semicadencial, interrompido',
          'Tipos comuns de 6/4: cadencial, sequencial, modulante, tonicizante',
        ],
        [
          'O 6/4 cadencial decora o V: a sua 6.ª e a sua 4.ª descem por grau para a 5.ª e a 3.ª',
          'O 6/4 cadencial funciona como tónica: o baixo é a fundamental do acorde de tónica',
          'O 6/4 cadencial decora o V: a 6.ª desce para a 3.ª e a 4.ª sobe para a 5.ª',
          'O 6/4 cadencial funciona como tónica: a 6.ª e a 4.ª são notas do acorde usadas livremente',
        ],
        [
          'A 2.ª inversão põe a 5.ª no baixo e a fundamental uma 4.ª acima',
          'A 2.ª inversão põe a 3.ª no baixo e a fundamental uma 4.ª acima',
          'A 2.ª inversão põe a 5.ª no baixo e a fundamental uma 6.ª acima',
          'A 2.ª inversão põe a 3.ª no baixo e a fundamental uma 6.ª acima',
        ],
        [
          'Quando a sensível está no baixo de uma tríade na 1.ª inversão, faz soar a sensível apenas numa voz',
          'Quando a sensível está no baixo de uma tríade na 1.ª inversão, faz soar a sensível em duas vozes',
          'Quando a sensível está no baixo de uma tríade na 1.ª inversão, faz soar a sensível em três vozes',
          'Quando a sensível está no baixo de uma tríade na 1.ª inversão, faz soar a sensível num número qualquer de vozes',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 11: Cadências, Frases e Ornamentação
  // =========================================================================

  // ---- l3u11m1: Cadências — O Conjunto Completo ----
  l3u11m1: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas designações de cadência está correta?',
      hintTemplate:
        'CAP: V-I com soprano na tónica. CAI: V-I com soprano NÃO na tónica, ou acordes invertidos. MC: termina em V. Plagal: IV-I. Interrompida: V-vi.',
      choiceSets: [
        [
          'V–I, ambos no estado fundamental, soprano na tónica: cadência perfeita (CAP)',
          'V–I, ambos no estado fundamental, soprano na tónica: cadência imperfeita (CAI)',
          'V–I, ambos no estado fundamental, soprano na tónica: meia cadência',
          'V–I, ambos no estado fundamental, soprano na tónica: cadência interrompida',
        ],
        [
          'Uma frase que termina em V: meia cadência',
          'Uma frase que termina em V: cadência perfeita',
          'Uma frase que termina em V: cadência plagal',
          'Uma frase que termina em V: cadência interrompida',
        ],
        [
          'V a resolver para vi: cadência interrompida',
          'V a resolver para vi: cadência perfeita (CAP)',
          'V a resolver para vi: meia cadência',
          'V a resolver para vi: cadência plagal',
        ],
        [
          'IV para I: cadência plagal',
          'IV para I: cadência perfeita (CAP)',
          'IV para I: meia cadência',
          'IV para I: cadência interrompida',
        ],
        [
          'V–I com o soprano na 3.ª: cadência imperfeita',
          'V–I com o soprano na 3.ª: cadência perfeita (CAP)',
          'V–I com o soprano na 3.ª: meia cadência',
          'V–I com o soprano na 3.ª: cadência interrompida',
        ],
      ],
    },
  ],

  // ---- l3u11m2: Frases e Períodos ----
  l3u11m2: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre frases e períodos é verdadeira?',
      hintTemplate:
        'Um período tem duas frases: antecedente (termina com MC ou CAI) e consequente (termina com CAP). Uma frase (Satz) tem apresentação (ideia básica + repetição) e continuação. Num período paralelo, ambas as frases começam de forma semelhante; num período contrastante, começam com material diferente.',
      choiceSets: [
        [
          "Um período paralelo: ambas as frases começam com material semelhante, e o consequente tem uma cadência mais forte do que o antecedente",
          "Um período paralelo: ambas as frases começam com material contrastante, e o consequente tem uma cadência mais forte do que o antecedente",
          "Um período paralelo: ambas as frases começam com material semelhante, e o consequente tem uma cadência mais fraca do que o antecedente",
          "Um período paralelo: ambas as frases começam com material contrastante, e o consequente tem uma cadência mais fraca do que o antecedente",
        ],
        [
          'O antecedente termina em geral com uma cadência fraca (MC ou CAI)',
          'O antecedente termina em geral com a cadência mais forte do período (CAP)',
          'O antecedente termina em geral com uma cadência interrompida (V–vi)',
          'O antecedente termina em geral com uma cadência plagal (IV–I)',
        ],
        [
          'Frase (Satz): uma apresentação (ideia + repetição), seguida de uma continuação',
          'Frase (Satz): um período (antecedente + consequente), seguido de outro período',
          'Frase (Satz): três apresentações (ideia + repetição), sem continuação',
          'Frase (Satz): uma continuação, seguida de uma apresentação (ideia + repetição)',
        ],
        [
          'Período contrastante: as duas frases começam com material diferente',
          'Período contrastante: as duas frases partilham material inicial semelhante',
          'Período contrastante: o consequente termina com cadência mais fraca que o antecedente',
          'Período contrastante: quatro frases formam dois pares antecedente-consequente',
        ],
      ],
    },
  ],

  // ---- l3u11m3: Ritmo Harmónico ----
  l3u11m3: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre o ritmo harmónico é verdadeira?',
      hintTemplate:
        'O ritmo harmónico é a velocidade a que os acordes mudam. Pode acelerar perto de cadências, criando uma sensação de movimento para a frente e de chegada. Na música de prática comum, os acordes mudam geralmente nos tempos fortes.',
      choiceSets: [
        [
          'O ritmo harmónico costuma acelerar quando se aproxima uma cadência',
          'O ritmo harmónico costuma criar impulso ao manter um acorde através da cadência',
          'O ritmo harmónico costuma abrandar de um acorde por tempo para um por compasso perto da cadência',
          'O ritmo harmónico costuma seguir o número de notas da melodia, independentemente de quando mudam os acordes',
        ],
        [
          'Um ritmo harmónico mais rápido costuma tornar a música mais impetuosa',
          'Um ritmo harmónico mais rápido costuma dar à passagem um carácter mais calmo e estático',
          'Um ritmo harmónico mais rápido costuma fazer a melodia adotar figuras mais curtas',
          'Um ritmo harmónico mais rápido costuma deixar inalterada a energia da passagem',
        ],
        [
          'Na prática comum, os acordes mudam geralmente nos tempos fortes',
          'Na prática comum, os acordes mudam geralmente nos tempos fracos em vez dos fortes',
          'Na prática comum, os acordes mudam geralmente quando a melodia passa para outra nota',
          'Na prática comum, os acordes mudam geralmente quando o baixo repete a mesma nota',
        ],
        [
          'O ritmo harmónico é a frequência das mudanças de acordes',
          'O ritmo harmónico é a frequência das mudanças de notas da melodia',
          'O ritmo harmónico é a frequência das mudanças de andamento',
          'O ritmo harmónico é a frequência das mudanças de compasso',
        ],
      ],
    },
  ],

  // ---- l3u11m4: Notas Estranhas ao Acorde (Parte 1) ----
  l3u11m4: [
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre notas de passagem, bordaduras e antecipações é verdadeira?',
      hintTemplate:
        'Nota de passagem: grau–grau na mesma direção entre duas notas do acorde. Bordadura: afasta-se por grau e regressa à mesma nota do acorde (incompleta: um dos lados por salto). Antecipação: uma nota do acorde seguinte que soa mais cedo.',
      choiceSets: [
        [
          'Abordada e deixada por grau na mesma direção: uma nota de passagem',
          'Abordada e deixada por grau na mesma direção: uma bordadura',
          'Abordada e deixada por grau na mesma direção: uma antecipação',
          'Abordada e deixada por grau na mesma direção: uma bordadura incompleta',
        ],
        [
          'As notas de passagem podem ser acentuadas (no tempo) ou não acentuadas',
          'As notas de passagem podem regressar por grau conjunto à nota inicial do acorde (como bordaduras completas)',
          'As notas de passagem podem anunciar o acorde seguinte cedo (sem ligação por grau conjunto)',
          'As notas de passagem podem ser alcançadas por grau conjunto e abandonadas por salto (como bordaduras incompletas)',
        ],
        [
          'C–D–E sobre um acorde de C maior: D é uma nota de passagem',
          'C–D–E sobre um acorde de C maior: D é uma nota do acorde',
          'C–D–E sobre um acorde de C maior: D é uma antecipação',
          'C–D–E sobre um acorde de C maior: a nota de passagem é a nota E',
        ],
        [
          'Uma nota que se afasta por grau de uma nota do acorde e regressa a ela: uma bordadura',
          'Uma nota que se afasta por grau de uma nota do acorde e regressa a ela: uma nota de passagem',
          'Uma nota que se afasta por grau de uma nota do acorde e regressa a ela: uma antecipação',
          'Uma nota que se afasta por grau de uma nota do acorde e regressa a ela: uma bordadura incompleta',
        ],
        [
          'Uma bordadura incompleta é a nota central de G4–D4–E4 sobre um acorde de C maior mantido',
          'Uma bordadura incompleta é a nota central de E4–D4–C4 sobre um acorde de C maior mantido',
          'Uma bordadura incompleta é a nota central de E4–D4–E4 sobre um acorde de C maior mantido',
          'Uma bordadura incompleta é a nota central de E4–G4–C5 sobre um acorde de C maior mantido',
        ],
        [
          'Uma antecipação faz soar uma nota do acorde seguinte antes de esse acorde chegar',
          'Uma antecipação preenche o espaço entre duas notas do acorde por grau na mesma direção',
          'Uma antecipação afasta-se por grau de uma nota do acorde e regressa à nota inicial',
          'Uma antecipação é abordada por grau e deixada por salto, com uma ligação por grau',
        ],
      ],
    },
  ],

  // ---- l3u11m5: Transposição ----
  l3u11m5: [
    {
      // scale_build
      promptTemplate:
        'Transpõe a escala de C maior para que comece em {root}. Seleciona as 7 notas.',
      hintTemplate:
        'Cada nota desloca-se o mesmo intervalo que vai de C a {root}, por isso o padrão T-T-mT-T-T-T-mT mantém-se: o resultado é a escala de {root} maior.',
    },
    {
      // interval_id
      promptTemplate:
        'Uma melodia que começa em {root} é transposta para começar na segunda nota mostrada. Qual foi o intervalo da transposição?',
      hintTemplate:
        'Conta os nomes das notas de {root} até à nova nota inicial para o número do intervalo, e os meios-tons ({semitones}) para a sua qualidade.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Qual destas afirmações sobre a transposição é verdadeira?',
      hintTemplate:
        'Transpor desloca todas as notas pelo mesmo intervalo. Instrumentos transpositores: os instrumentos em Bb soam uma 2.ª maior abaixo do escrito, a trompa em F uma 5.ª perfeita abaixo.',
      choiceSets: [
        [
          'Transpor desloca todas as notas pelo mesmo intervalo',
          'Transpor desloca apenas a melodia, nunca os acordes por baixo dela',
          'Transpor altera os intervalos entre as notas',
          'Transpor mantém os nomes das notas mas muda a armação de clave',
        ],
        [
          'Um trompete em Bb soa uma 2.ª maior abaixo do escrito',
          'Um trompete em Bb soa exatamente a altura que está escrita',
          'Um trompete em Bb soa uma 2.ª maior acima do escrito',
          'Um trompete em Bb soa uma 5.ª perfeita abaixo do escrito',
        ],
        [
          'C maior transposto uma 5.ª perfeita acima passa a G maior, com um sustenido',
          'C maior transposto uma 5.ª perfeita acima passa a F maior, com um bemol',
          'C maior transposto uma 5.ª perfeita acima mantém a armação sem sustenidos nem bemóis',
          'C maior transposto uma 5.ª perfeita acima passa a D maior, com dois sustenidos',
        ],
        [
          'Uma trompa em F soa uma 5.ª perfeita abaixo do escrito',
          'Uma trompa em F soa uma 5.ª perfeita acima do escrito',
          'Uma trompa em F soa uma 2.ª maior abaixo do escrito',
          'Uma trompa em F soa exatamente a altura que está escrita',
        ],
      ],
    },
  ],
};

export default overlay;
