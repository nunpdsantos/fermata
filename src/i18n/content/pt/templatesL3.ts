import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 3 exercise templates
// 13 modules, ~70 generated exercises
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 9: Acordes de Setima e Harmonia Diatonica
  // =========================================================================

  // ---- l3u9m1: Acordes de Setima — Cinco Qualidades ----
  l3u9m1: [
    {
      // chord_build
      promptTemplate:
        'Constroi um acorde de {root} {quality}. Seleciona as 4 notas.',
      hintTemplate:
        'Construcao de acordes de setima a partir de {root}: maj7 = 3.aM+5.aP+7.aM, min7 = 3.am+5.aP+7.am, dom7 = 3.aM+5.aP+7.am, meio-dim7 = 3.am+5.adim+7.am, dim7 = 3.am+5.adim+7.addim.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica a qualidade deste acorde de setima com base na sua estrutura intervalar.',
      hintTemplate:
        'Ouve a qualidade da triade (maior/menor/dim) e a qualidade da 7.a (maior/menor/diminuta) empilhada por cima.',
      choiceSets: [
        [
          'Triade maior + 7.a maior = acorde de setima maior',
          'Triade maior + 7.a maior = acorde de setima da dominante',
          'Triade maior + 7.a maior = acorde de setima menor',
          'Triade maior + 7.a maior = acorde de setima meio-diminuta',
        ],
        [
          'Triade maior + 7.a menor = acorde de setima da dominante',
          'Triade maior + 7.a menor = acorde de setima maior',
          'Triade maior + 7.a menor = acorde de setima menor',
          'Triade maior + 7.a menor = acorde de setima diminuta',
        ],
        [
          'Triade diminuta + 7.a menor = acorde de setima meio-diminuta',
          'Triade diminuta + 7.a menor = acorde de setima diminuta',
          'Triade diminuta + 7.a menor = acorde de setima menor',
          'Triade diminuta + 7.a menor = acorde de setima da dominante',
        ],
      ],
    },
  ],

  // ---- l3u9m2: Inversoes de Acordes de Setima ----
  l3u9m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica a inversao e o baixo cifrado deste acorde de setima.',
      hintTemplate:
        'Inversoes de acordes de setima: estado fundamental = 7, 1.a inv = 6/5, 2.a inv = 4/3, 3.a inv = 4/2 (ou 2).',
      choiceSets: [
        [
          'A terceira inversao de um acorde de setima tem a 7.a no baixo (baixo cifrado: 4/2)',
          'A terceira inversao tem a 5.a no baixo',
          'A terceira inversao tem a 3.a no baixo',
          'A terceira inversao tem a fundamental no baixo',
        ],
        [
          'A primeira inversao de um acorde de setima usa o baixo cifrado 6/5',
          'A primeira inversao usa o baixo cifrado 4/3',
          'A primeira inversao usa o baixo cifrado 4/2',
          'A primeira inversao usa o baixo cifrado 7',
        ],
        [
          'A segunda inversao de um acorde de setima usa o baixo cifrado 4/3',
          'A segunda inversao usa o baixo cifrado 6/5',
          'A segunda inversao usa o baixo cifrado 4/2',
          'A segunda inversao usa o baixo cifrado 6/4',
        ],
        [
          'Na segunda inversao, a 5.a do acorde de setima esta no baixo',
          'Na segunda inversao, a 3.a esta no baixo',
          'Na segunda inversao, a 7.a esta no baixo',
          'Na segunda inversao, a fundamental esta no baixo',
        ],
      ],
    },
  ],

  // ---- l3u9m3: Acordes de Setima Diatonicos em Maior ----
  l3u9m3: [
    {
      // chord_build
      promptTemplate:
        'Constroi o acorde de setima diatonico sobre {root} em Do maior. Usa apenas teclas brancas.',
      hintTemplate:
        'Acordes de 7.a diatonicos em Do maior: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5. Constroi sobre {root} usando apenas notas da escala de Do maior.',
    },
  ],

  // ---- l3u9m4: Acordes de Setima Diatonicos em Menor ----
  l3u9m4: [
    {
      // chord_build
      promptTemplate:
        'Constroi o acorde de setima diatonico sobre {root} em La menor (menor harmonica).',
      hintTemplate:
        'Na menor harmonica, o 7.o grau elevado cria qualidades de acordes diferentes da menor natural. O V torna-se setima da dominante e o vii torna-se setima diminuta.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica a qualidade deste acorde de setima diatonico em menor.',
      hintTemplate:
        'Na menor harmonica, o 7.o grau elevado altera a qualidade dos acordes construidos sobre os graus III, V e VII.',
      choiceSets: [
        [
          'Na menor harmonica, V7 e um acorde de setima da dominante',
          'Na menor harmonica, V7 e um acorde de setima menor',
          'Na menor harmonica, V7 e um acorde de setima maior',
          'Na menor harmonica, V7 e um acorde de setima meio-diminuta',
        ],
        [
          'Na menor harmonica, viio7 e um acorde de setima totalmente diminuta',
          'Na menor harmonica, viio7 e um acorde de setima meio-diminuta',
          'Na menor harmonica, viio7 e um acorde de setima menor',
          'Na menor harmonica, viio7 e um acorde de setima da dominante',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 10: Conducao de Vozes e Cadencias
  // =========================================================================

  // ---- l3u10m1: Nocoes Basicas de SATB ----
  l3u10m1: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questao sobre os fundamentos de conducao de vozes SATB.',
      hintTemplate:
        'Tessituras SATB: Soprano C4-G5, Contralto F3-C5, Tenor C3-G4, Baixo E2-C4. As vozes superiores adjacentes devem manter-se a menos de uma oitava entre si (exceto baixo-tenor).',
      choiceSets: [
        [
          'As vozes superiores adjacentes (S-C, C-T) devem manter-se geralmente a menos de uma oitava entre si',
          'As quatro vozes devem estar sempre dentro de uma oitava no total',
          'Nao ha restricoes de espacamento entre vozes',
          'Soprano e contralto devem estar sempre a uma 3.a de distancia',
        ],
        [
          'O cruzamento de vozes ocorre quando uma voz mais grave ultrapassa a voz mais aguda adjacente',
          'O cruzamento de vozes e quando duas vozes cantam a mesma nota',
          'O cruzamento de vozes e sempre encorajado para interesse melodico',
          'O cruzamento de vozes so se aplica a soprano e baixo',
        ],
        [
          'Dobrar a fundamental do acorde e geralmente a escolha mais segura em estado fundamental',
          'Dobrar a 3.a e sempre preferido',
          'Dobrar a 7.a cria o melhor som',
          'Todas as notas do acorde devem aparecer exatamente uma vez',
        ],
      ],
    },
  ],

  // ---- l3u10m2: Regras de Escrita a Partes ----
  l3u10m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica o erro ou regra de conducao de vozes ilustrado aqui.',
      hintTemplate:
        'Evita 5.as e 8.as paralelas, resolve a sensivel para cima, resolve a 7.a do acorde para baixo, e mantem notas comuns quando possivel.',
      choiceSets: [
        [
          'Quintas paralelas ocorrem quando duas vozes passam de uma 5.aP para outra 5.aP na mesma direcao',
          'Quintas paralelas sao sempre aceitaveis na escrita SATB',
          'Quintas paralelas so ocorrem entre soprano e baixo',
          'Quintas paralelas significam que duas vozes estao sempre a uma 5.a de distancia',
        ],
        [
          'A sensivel deve resolver por grau ascendente para a tonica',
          'A sensivel deve resolver para baixo, para a dominante',
          'A sensivel pode mover-se livremente em qualquer direcao',
          'A sensivel deve sempre saltar para a mediante',
        ],
        [
          'A 7.a do acorde deve resolver por grau descendente',
          'A 7.a do acorde deve resolver por grau ascendente',
          'A 7.a do acorde nao precisa de resolver',
          'A 7.a do acorde deve saltar uma 5.a abaixo',
        ],
        [
          'Movimento contrario entre as vozes extremas e geralmente preferido',
          'Movimento paralelo entre todas as vozes e ideal',
          'O baixo deve mover-se sempre na mesma direcao que o soprano',
          'Movimento obliquo nunca e usado na escrita SATB',
        ],
      ],
    },
  ],

  // ---- l3u10m3: Cadencias — CAP, CAI, CS ----
  l3u10m3: [
    {
      // multiple_choice
      promptTemplate:
        'Classifica este tipo de cadencia com base nos acordes e conducao de vozes descritos.',
      hintTemplate:
        'CAP: V-I com soprano na tonica. CAI: V-I com soprano NAO na tonica, ou acordes invertidos. CS: termina em V. Plagal: IV-I. Interrompida: V-vi.',
      choiceSets: [
        [
          'V para I com o soprano a terminar na tonica e uma Cadencia Autentica Perfeita (CAP)',
          'Esta e uma Cadencia Autentica Imperfeita (CAI)',
          'Esta e uma Cadencia Suspensiva (CS)',
          'Esta e uma Cadencia Interrompida',
        ],
        [
          'Uma frase que termina no acorde V e uma Cadencia Suspensiva',
          'Uma frase que termina no acorde V e uma Cadencia Autentica Perfeita',
          'Uma frase que termina no acorde V e uma Cadencia Plagal',
          'Uma frase que termina no acorde V e uma Cadencia Interrompida',
        ],
        [
          'V a resolver para vi em vez de I e uma Cadencia Interrompida',
          'V a resolver para vi e uma Cadencia Autentica Perfeita',
          'V a resolver para vi e uma Cadencia Suspensiva',
          'V a resolver para vi e uma Cadencia Plagal',
        ],
        [
          'IV para I e uma Cadencia Plagal (cadencia do Amen)',
          'IV para I e uma Cadencia Autentica Perfeita',
          'IV para I e uma Cadencia Suspensiva',
          'IV para I e uma Cadencia Interrompida',
        ],
        [
          'V para I com o soprano na 3.a e uma Cadencia Autentica Imperfeita (CAI)',
          'V para I com o soprano na 3.a e uma CAP',
          'V para I com o soprano na 3.a e uma Cadencia Suspensiva',
          'V para I com o soprano na 3.a e uma Cadencia Interrompida',
        ],
      ],
    },
  ],

  // ---- l3u10m4: Estrutura de Frase ----
  l3u10m4: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questao sobre a estrutura de frase musical.',
      hintTemplate:
        'Um periodo tem duas frases: antecedente (termina com CS ou CAI) e consequente (termina com CAP). Uma frase (Satz) tem apresentacao (ideia basica + repeticao) e continuacao.',
      choiceSets: [
        [
          'Um periodo paralelo tem frases antecedente e consequente que comecam com material semelhante',
          'Um periodo paralelo tem duas frases sem relacao',
          'Um periodo paralelo deve ter exatamente 8 compassos',
          'Um periodo paralelo termina sempre com cadencia suspensiva',
        ],
        [
          'A frase antecedente termina tipicamente com uma cadencia fraca (CS ou CAI)',
          'A frase antecedente termina sempre com uma CAP',
          'A frase antecedente nao tem cadencia',
          'O antecedente e sempre a segunda frase',
        ],
        [
          'Uma estrutura de frase (Satz) consiste numa fase de apresentacao seguida de uma fase de continuacao',
          'Uma frase (Satz) e o mesmo que um periodo',
          'Uma frase (Satz) tem sempre 3 frases',
          'Uma frase (Satz) deve ter 16 compassos',
        ],
        [
          'Um periodo contrastante tem antecedente e consequente que comecam com material diferente',
          'Um periodo contrastante tem frases identicas',
          'Um periodo contrastante modula sempre',
          'Um periodo contrastante tem tres frases',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 11: Notas Estranhas ao Acorde
  // =========================================================================

  // ---- l3u11m1: Notas de Passagem ----
  l3u11m1: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica esta nota estranha ao acorde com base na sua abordagem e resolucao.',
      hintTemplate:
        'Uma nota de passagem move-se por grau entre duas notas do acorde na mesma direcao. Preenche a lacuna entre uma 3.a.',
      choiceSets: [
        [
          'Uma nota abordada por grau e resolvida por grau na mesma direcao e uma nota de passagem',
          'E uma bordadura',
          'E uma suspensao',
          'E uma apogiatura',
        ],
        [
          'As notas de passagem podem ser acentuadas (no tempo) ou nao acentuadas (fora do tempo)',
          'As notas de passagem estao sempre no tempo',
          'As notas de passagem estao sempre fora do tempo',
          'As notas de passagem sao sempre cromaticas',
        ],
        [
          'Uma nota de passagem cromatica usa uma altura fora da tonalidade atual',
          'Uma nota de passagem cromatica e sempre diatonica',
          'Uma nota de passagem cromatica deve saltar',
          'As notas de passagem cromaticas sao proibidas na harmonia classica',
        ],
      ],
    },
  ],

  // ---- l3u11m2: Bordaduras ----
  l3u11m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica este tipo de nota estranha ao acorde e as suas caracteristicas.',
      hintTemplate:
        'Uma bordadura afasta-se por grau de uma nota do acorde e regressa a mesma nota. Bordaduras superiores sobem e descem; bordaduras inferiores descem e sobem.',
      choiceSets: [
        [
          'Uma nota que se afasta por grau de uma nota do acorde e regressa a ela e uma bordadura',
          'E uma nota de passagem',
          'E uma suspensao',
          'E uma nota de escape',
        ],
        [
          'Uma bordadura dupla (nota cambiata) decora uma nota indo tanto acima como abaixo dela',
          'Uma bordadura dupla usa duas notas de passagem consecutivas',
          'Uma bordadura dupla significa que duas vozes tem bordaduras simultaneamente',
          'Uma bordadura dupla e o mesmo que um trilo',
        ],
        [
          'Uma bordadura incompleta e abordada ou resolvida por salto em vez de grau',
          'Uma bordadura incompleta nunca resolve',
          'Uma bordadura incompleta usa apenas um tom inteiro',
          'Uma bordadura incompleta e o mesmo que uma suspensao',
        ],
      ],
    },
  ],

  // ---- l3u11m3: Suspensoes ----
  l3u11m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questao sobre suspensoes na conducao de vozes.',
      hintTemplate:
        'Uma suspensao tem 3 partes: preparacao (consonancia), suspensao (mantida em dissonancia), resolucao (grau descendente para consonancia). Nomeadas pelos intervalos: 4-3, 7-6, 9-8, 2-3.',
      choiceSets: [
        [
          'Uma suspensao 4-3 mantem a 4.a acima do baixo e resolve descendo para uma 3.a',
          'Uma suspensao 4-3 mantem a 3.a e sobe para a 4.a',
          'Uma suspensao 4-3 e uma resolucao ascendente',
          'Uma suspensao 4-3 nao requer preparacao',
        ],
        [
          'Uma suspensao deve ser preparada como consonancia num tempo fraco antes de ser mantida no tempo forte',
          'Uma suspensao pode aparecer sem preparacao',
          'Uma suspensao resolve sempre para cima',
          'Uma suspensao e o mesmo que uma apogiatura',
        ],
        [
          'Uma suspensao 7-6 mantem a 7.a acima do baixo e resolve descendo para uma 6.a',
          'Uma suspensao 7-6 resolve para cima, para uma oitava',
          'Uma suspensao 7-6 e uma suspensao do baixo',
          'Uma suspensao 7-6 nao resolve',
        ],
        [
          'Uma suspensao 9-8 mantem a 9.a acima do baixo e resolve descendo para uma oitava',
          'Uma suspensao 9-8 resolve por grau ascendente',
          'Uma suspensao 9-8 e na verdade uma suspensao 2-1',
          'Uma suspensao 9-8 ocorre apenas na voz do baixo',
        ],
      ],
    },
  ],

  // ---- l3u11m4: Antecipacoes e Pedais ----
  l3u11m4: [
    {
      // multiple_choice
      promptTemplate:
        'Classifica esta nota estranha ao acorde com base no seu comportamento.',
      hintTemplate:
        'Uma antecipacao chega cedo (antes de o acorde mudar). Um pedal e uma nota sustentada ou repetida (geralmente tonica ou dominante) mantida enquanto as harmonias mudam por cima.',
      choiceSets: [
        [
          'Uma antecipacao faz soar uma nota do acorde antes de o acorde realmente chegar',
          'Uma antecipacao e o mesmo que uma suspensao',
          'Uma antecipacao requer preparacao num tempo forte',
          'Uma antecipacao resolve sempre para baixo',
        ],
        [
          'Um pedal de tonica sustenta a nota tonica enquanto as harmonias mudam por cima',
          'Um pedal de tonica so ocorre no soprano',
          'Um pedal de tonica deve resolver apos um compasso',
          'Um pedal de tonica e o mesmo que um ostinato',
        ],
        [
          'Um pedal de dominante cria tensao ao manter o 5.o grau da escala atraves de harmonias nao dominantes',
          'Um pedal de dominante so aparece no inicio de uma peca',
          'Um pedal de dominante usa sempre a sensivel',
          'Um pedal de dominante esta sempre na voz do soprano',
        ],
      ],
    },
  ],

  // ---- l3u11m5: Revisao de Notas Estranhas ao Acorde ----
  l3u11m5: [
    {
      // multiple_choice
      promptTemplate:
        'Classifica a nota estranha ao acorde descrita: abordada e resolvida desta forma.',
      hintTemplate:
        'Nota de passagem: grau-grau mesma direcao. Bordadura: grau-grau regressando. Suspensao: mantida-grau descendente. Apogiatura: salto-grau. Nota de escape: grau-salto. Antecipacao: chega cedo.',
      choiceSets: [
        [
          'Abordada por salto, resolvida por grau na direcao oposta = apogiatura',
          'Isto descreve uma nota de passagem',
          'Isto descreve uma suspensao',
          'Isto descreve uma antecipacao',
        ],
        [
          'Abordada por grau, resolvida por salto na direcao oposta = nota de escape',
          'Isto descreve uma nota de passagem',
          'Isto descreve uma bordadura',
          'Isto descreve uma antecipacao',
        ],
        [
          'Uma retardacao e como uma suspensao mas resolve para cima',
          'Uma retardacao resolve por salto descendente',
          'Uma retardacao nao tem preparacao',
          'Uma retardacao e o mesmo que uma antecipacao',
        ],
        [
          'Todas as notas estranhas ao acorde criam dissonancia que resolve para consonancia',
          'As notas estranhas ao acorde sao sempre consonantes',
          'As notas estranhas ao acorde nunca resolvem',
          'As notas estranhas ao acorde so ocorrem na voz do baixo',
        ],
      ],
    },
    {
      // interval_id
      promptTemplate:
        'Identifica o intervalo criado entre a nota estranha ao acorde e o baixo, a partir de {root}.',
      hintTemplate:
        'Conta os semitons a partir de {root} para determinar o intervalo. As notas estranhas criam frequentemente 2.as, 7.as ou intervalos aumentados/diminutos contra o baixo.',
    },
  ],
};

export default overlay;
