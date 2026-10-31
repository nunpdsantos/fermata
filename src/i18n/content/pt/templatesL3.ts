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
        'Construção de acordes de sétima a partir de {root}: maj7 = 3.aM+5.aP+7.aM, min7 = 3.am+5.aP+7.am, dom7 = 3.aM+5.aP+7.am, meio-dim7 = 3.am+5.adim+7.am, dim7 = 3.am+5.adim+7.adim.',
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
        'Inversões de acordes de sétima: estado fundamental = 7, 1.ª inv = 6/5, 2.ª inv = 4/3, 3.ª inv = 4/2 (ou 2).',
      choiceSets: [
        [
          'A 3.ª inversão tem a 7.ª no baixo (4/2)',
          'A 3.ª inversão põe a 5.ª no baixo (cifra 4/3)',
          'A 3.ª inversão põe a 3.ª no baixo (cifra 6/5)',
          'A 3.ª inversão mantém a fundamental no baixo (cifra 7)',
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
          'Na 2.ª inversão, a fundamental continua no baixo',
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
        'Tessituras SATB: Soprano C4-G5, Contralto F3-C5, Tenor C3-G4, Baixo E2-C4. As vozes superiores adjacentes devem manter-se a menos de uma oitava entre si (exceto baixo-tenor).',
      choiceSets: [
        [
          'Soprano–contralto e contralto–tenor ficam a menos de uma oitava; tenor–baixo pode afastar-se mais',
          'As quatro vozes têm de caber numa única oitava, do baixo até ao soprano',
          'Qualquer espaçamento é permitido, desde que cada voz fique na sua tessitura',
          'Tenor–baixo têm de ficar a menos de uma oitava, enquanto as vozes superiores se podem afastar muito mais',
        ],
        [
          'Cruzamento de vozes: uma voz grave passa acima da vizinha',
          'Cruzamento de vozes: duas vozes cantam a mesma nota ao mesmo tempo',
          'Cruzamento de vozes: o soprano e o baixo movem-se em movimento contrário',
          'Cruzamento de vozes: um hábito recomendado nos corais para dar mais interesse melódico',
        ],
        [
          'No estado fundamental, dobrar a fundamental é geralmente a escolha mais segura',
          'No estado fundamental, a sensível é a melhor nota para dobrar',
          'No estado fundamental, dobrar a 3.ª é sempre preferível',
          'No estado fundamental, nenhuma nota deve ser dobrada',
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
        'Evita 5.as e 8.as paralelas, resolve a sensível para cima, resolve a 7.ª do acorde para baixo, e mantém notas comuns quando possível.',
      choiceSets: [
        [
          'Quintas paralelas: duas vozes a uma 5.ª P movem-se na mesma direção para outra 5.ª P',
          'Quintas paralelas: quaisquer duas vozes que estejam a uma 5.ª em qualquer acorde',
          'Quintas paralelas: um erro apenas quando ocorrem entre o soprano e o baixo',
          'Quintas paralelas: aceitáveis em SATB desde que as duas vozes se movam por grau e não por salto',
        ],
        [
          'A sensível resolve por grau ascendente para a tónica',
          'A sensível resolve por grau descendente para a submediante',
          'A sensível pode mover-se livremente em qualquer direção',
          'A sensível salta para cima até à mediante',
        ],
        [
          'A 7.ª do acorde resolve por grau descendente',
          'A 7.ª do acorde resolve por grau ascendente',
          'A 7.ª do acorde não precisa de resolver',
          'A 7.ª do acorde salta uma 5.ª para baixo',
        ],
        [
          'Em geral prefere-se o movimento contrário entre as vozes extremas',
          'O movimento paralelo entre as quatro vozes é geralmente preferido',
          'O baixo deve mover-se em geral na mesma direção em que se move o soprano',
          'O movimento oblíquo nunca é usado na escrita a quatro vozes',
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
      choiceSets: [
        [
          'Fundamentais a uma 5.ª partilham uma nota comum: mantém-na na mesma voz',
          'Fundamentais a uma 5.ª não partilham notas: move todas as vozes superiores',
          'Fundamentais a uma 5.ª partilham duas notas comuns: move apenas uma voz',
          'Fundamentais a uma 5.ª partilham uma nota comum, que deve passar para outra voz',
        ],
        [
          'Fundamentais a uma 3.ª partilham duas notas comuns: mantém ambas e move uma voz',
          'Fundamentais a uma 3.ª partilham uma nota comum: mantém-na e move duas vozes',
          'Fundamentais a uma 3.ª não partilham notas: move as três vozes superiores',
          'Fundamentais a uma 3.ª partilham as três notas, por isso as vozes superiores nunca se movem',
        ],
        [
          'Fundamentais a uma 2.ª não partilham notas: move as vozes superiores contra o baixo',
          'Fundamentais a uma 2.ª partilham duas notas comuns: mantém ambas e move uma voz',
          'Fundamentais a uma 2.ª: move as quatro vozes na mesma direção que o baixo',
          'Fundamentais a uma 2.ª partilham uma nota comum, mantida no soprano enquanto as outras se movem',
        ],
        [
          'Cada voz superior move-se para a nota do acorde disponível mais próxima',
          'Cada voz superior salta para uma nova nota do acorde para dar interesse melódico',
          'O baixo tem sempre de ir para a nota do acorde mais próxima, por grau se possível',
          'As quatro vozes devem mover-se juntas na mesma direção',
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
        '1.ª inversão (6/3): 3.ª no baixo, usada para linhas de baixo suaves. 2.ª inversão (6/4): 5.ª no baixo, usada apenas como 6/4 cadencial, de passagem, de pedal ou arpejado.',
      choiceSets: [
        [
          'A 1.ª inversão (6/3) põe a 3.ª no baixo e suaviza a linha do baixo',
          'A 1.ª inversão (6/3) põe a 5.ª no baixo e fica reservada para as cadências',
          'A 1.ª inversão (6/3) mantém a fundamental no baixo, mas sobe a 3.ª uma oitava',
          'A 1.ª inversão (6/3) só se usa no fim de uma peça',
        ],
        [
          'Os quatro 6/4 habituais: cadencial, de passagem, de pedal e arpejado',
          'Os quatro 6/4 habituais: fundamental, 1.ª, 2.ª e 3.ª inversão',
          'Um acorde 6/4 pode usar-se livremente em qualquer ponto da frase, tal como uma tríade na 1.ª inversão',
          'O único 6/4 aceitável é o que termina uma peça na tónica',
        ],
        [
          'O 6/4 cadencial decora o V: a sua 6.ª e a sua 4.ª descem por grau para a 5.ª e a 3.ª',
          'O 6/4 cadencial é um acorde de tónica que termina a frase em vez do I',
          'O 6/4 cadencial resolve a sua 6.ª e a sua 4.ª por grau ascendente para o acorde de tónica seguinte',
          'O 6/4 cadencial cai num tempo fraco, depois do acorde de dominante',
        ],
        [
          'A 2.ª inversão (6/4) põe a 5.ª no baixo, com a fundamental uma 4.ª acima',
          'A 2.ª inversão (6/4) põe a 3.ª no baixo, com a fundamental uma 6.ª acima',
          'A 2.ª inversão (6/4) põe a fundamental no baixo, com a 5.ª uma 4.ª perfeita acima',
          'A 2.ª inversão (6/4) põe a 7.ª no baixo',
        ],
        [
          'Numa tríade na 1.ª inversão, evita dobrar o baixo quando é a sensível',
          'Numa tríade na 1.ª inversão, dobra sempre a nota do baixo, seja ela qual for',
          'Numa tríade na 1.ª inversão, dobra a sensível no baixo',
          'Numa tríade na 1.ª inversão, nenhuma nota pode ser dobrada',
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
        'Um período tem duas frases: antecedente (termina com MC ou CAI) e consequente (termina com CAP). Uma frase (Satz) tem apresentação (ideia básica + repetição) e continuação.',
      choiceSets: [
        [
          'Período paralelo: as duas frases começam com material semelhante',
          'Período paralelo: duas frases com material sem relação e a mesma cadência',
          'Período paralelo: tem sempre exatamente oito compassos',
          'Período paralelo: as duas frases terminam com meia cadência',
        ],
        [
          'O antecedente termina em geral com uma cadência fraca (MC ou CAI)',
          'O antecedente termina em geral com uma CAP',
          'O antecedente não tem cadência nenhuma',
          'O antecedente é sempre a segunda frase do período',
        ],
        [
          'Frase (Satz): uma apresentação (ideia + repetição), depois uma continuação',
          'Frase (Satz): outro nome para um período de duas frases',
          'Frase (Satz): sempre três frases, cada uma com a sua cadência',
          'Frase (Satz): primeiro uma continuação, depois a ideia básica e a sua repetição',
        ],
        [
          'Período contrastante: as duas frases começam com material diferente',
          'Período contrastante: as duas frases são idênticas do princípio ao fim',
          'Período contrastante: modula sempre',
          'Período contrastante: tem três frases',
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
        'O ritmo harmónico é a velocidade a que os acordes mudam. Pode acelerar perto de cadências, criando uma sensação de movimento para a frente e de chegada.',
      choiceSets: [
        [
          'O ritmo harmónico costuma acelerar quando se aproxima uma cadência',
          'O ritmo harmónico mantém-se constante do princípio ao fim de uma peça',
          'O ritmo harmónico costuma abrandar à medida que a cadência se aproxima',
          'O ritmo harmónico só muda entre secções',
        ],
        [
          'Um ritmo harmónico mais rápido cria maior sensação de impulso',
          'Um ritmo harmónico mais rápido cria um ambiente mais calmo e estático',
          'O ritmo harmónico não tem efeito na energia de uma passagem',
          'Um ritmo harmónico mais lento é a forma habitual de construir um clímax',
        ],
        [
          'Na prática comum, os acordes mudam em geral nos tempos fortes',
          'Os acordes só podem mudar no 1.º tempo do compasso',
          'Os acordes nunca podem mudar a meio do compasso',
          'Mudar de acorde nos tempos 2 e 4 é a escolha mais estável e normal em 4/4',
        ],
        [
          'O ritmo harmónico é o ritmo das mudanças de acorde, não o da melodia',
          'O ritmo harmónico é simplesmente o ritmo que a melodia toca',
          'O ritmo harmónico é a velocidade da linha do baixo',
          'O ritmo harmónico é o número de tempos de cada compasso',
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
          'As notas de passagem caem sempre no tempo, nunca entre tempos',
          'As notas de passagem caem sempre entre tempos e nunca podem ser acentuadas',
          'As notas de passagem têm de ser sempre notas de fora da tonalidade',
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
          'Uma bordadura incompleta é abordada ou deixada por salto em vez de grau',
          'Uma bordadura incompleta nunca chega a resolver',
          'Uma bordadura incompleta move-se apenas por tom',
          'Uma bordadura incompleta é abordada e deixada por grau, como uma bordadura completa',
        ],
        [
          'Uma antecipação faz soar uma nota do acorde seguinte antes de esse acorde chegar',
          'Uma antecipação prolonga uma nota do acorde anterior',
          'Uma antecipação resolve sempre por grau descendente',
          'Uma antecipação é uma nota que não pertence a nenhum dos acordes',
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
