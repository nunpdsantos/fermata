import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 3 exercise templates
// 13 modules, ~70 generated exercises
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
        'Construção de acordes de sétima a partir de {root}: maj7 = 3.aM+5.aP+7.aM, min7 = 3.am+5.aP+7.am, dom7 = 3.aM+5.aP+7.am, meio-dim7 = 3.am+5.adim+7.am, dim7 = 3.am+5.adim+7.addim.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica a qualidade deste acorde de sétima com base na sua estrutura intervalar.',
      hintTemplate:
        'Ouve a qualidade da tríade (maior/menor/dim) e a qualidade da 7.a (maior/menor/diminuta) empilhada por cima.',
      choiceSets: [
        [
          'Tríade maior + 7.a maior = acorde de sétima maior',
          'Tríade maior + 7.a maior = acorde de sétima da dominante',
          'Tríade maior + 7.a maior = acorde de sétima menor',
          'Tríade maior + 7.a maior = acorde de sétima meio-diminuta',
        ],
        [
          'Tríade maior + 7.a menor = acorde de sétima da dominante',
          'Tríade maior + 7.a menor = acorde de sétima maior',
          'Tríade maior + 7.a menor = acorde de sétima menor',
          'Tríade maior + 7.a menor = acorde de sétima diminuta',
        ],
        [
          'Tríade diminuta + 7.a menor = acorde de sétima meio-diminuta',
          'Tríade diminuta + 7.a menor = acorde de sétima diminuta',
          'Tríade diminuta + 7.a menor = acorde de sétima menor',
          'Tríade diminuta + 7.a menor = acorde de sétima da dominante',
        ],
      ],
    },
  ],

  // ---- l3u9m2: Inversões de Acordes de Sétima ----
  l3u9m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica a inversão e o baixo cifrado deste acorde de sétima.',
      hintTemplate:
        'Inversões de acordes de sétima: estado fundamental = 7, 1.a inv = 6/5, 2.a inv = 4/3, 3.a inv = 4/2 (ou 2).',
      choiceSets: [
        [
          'A terceira inversão de um acorde de sétima tem a 7.a no baixo (baixo cifrado: 4/2)',
          'A terceira inversão tem a 5.a no baixo',
          'A terceira inversão tem a 3.a no baixo',
          'A terceira inversão tem a fundamental no baixo',
        ],
        [
          'A primeira inversão de um acorde de sétima usa o baixo cifrado 6/5',
          'A primeira inversão usa o baixo cifrado 4/3',
          'A primeira inversão usa o baixo cifrado 4/2',
          'A primeira inversão usa o baixo cifrado 7',
        ],
        [
          'A segunda inversão de um acorde de sétima usa o baixo cifrado 4/3',
          'A segunda inversão usa o baixo cifrado 6/5',
          'A segunda inversão usa o baixo cifrado 4/2',
          'A segunda inversão usa o baixo cifrado 6/4',
        ],
        [
          'Na segunda inversão, a 5.a do acorde de sétima está no baixo',
          'Na segunda inversão, a 3.a está no baixo',
          'Na segunda inversão, a 7.a está no baixo',
          'Na segunda inversão, a fundamental está no baixo',
        ],
      ],
    },
  ],

  // ---- l3u9m3: Acordes de Sétima Diatónicos em Maior ----
  l3u9m3: [
    {
      // chord_build
      promptTemplate:
        'Constrói o acorde de sétima diatónico sobre {root} em Dó maior. Usa apenas teclas brancas.',
      hintTemplate:
        'Acordes de 7.a diatónicos em Dó maior: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5. Constrói sobre {root} usando apenas notas da escala de Dó maior.',
    },
  ],

  // ---- l3u9m4: Acordes de Sétima Diatónicos em Menor ----
  l3u9m4: [
    {
      // chord_build
      promptTemplate:
        'Constrói o acorde de sétima diatónico sobre {root} em Lá menor (menor harmónica).',
      hintTemplate:
        'Na menor harmónica, o 7.o grau elevado cria qualidades de acordes diferentes da menor natural. O V torna-se sétima da dominante e o vii torna-se sétima diminuta.',
    },
    {
      // multiple_choice
      promptTemplate:
        'Identifica a qualidade deste acorde de sétima diatónico em menor.',
      hintTemplate:
        'Na menor harmónica, o 7.o grau elevado altera a qualidade dos acordes construídos sobre os graus III, V e VII.',
      choiceSets: [
        [
          'Na menor harmónica, V7 é um acorde de sétima da dominante',
          'Na menor harmónica, V7 é um acorde de sétima menor',
          'Na menor harmónica, V7 é um acorde de sétima maior',
          'Na menor harmónica, V7 é um acorde de sétima meio-diminuta',
        ],
        [
          'Na menor harmónica, viio7 é um acorde de sétima totalmente diminuta',
          'Na menor harmónica, viio7 é um acorde de sétima meio-diminuta',
          'Na menor harmónica, viio7 é um acorde de sétima menor',
          'Na menor harmónica, viio7 é um acorde de sétima da dominante',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 10: Condução de Vozes e Cadências
  // =========================================================================

  // ---- l3u10m1: Noções Básicas de SATB ----
  l3u10m1: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questão sobre os fundamentos de condução de vozes SATB.',
      hintTemplate:
        'Tessituras SATB: Soprano C4-G5, Contralto F3-C5, Tenor C3-G4, Baixo E2-C4. As vozes superiores adjacentes devem manter-se a menos de uma oitava entre si (exceto baixo-tenor).',
      choiceSets: [
        [
          'As vozes superiores adjacentes (S-C, C-T) devem manter-se geralmente a menos de uma oitava entre si',
          'As quatro vozes devem estar sempre dentro de uma oitava no total',
          'Não há restrições de espaçamento entre vozes',
          'Soprano e contralto devem estar sempre a uma 3.a de distância',
        ],
        [
          'O cruzamento de vozes ocorre quando uma voz mais grave ultrapassa a voz mais aguda adjacente',
          'O cruzamento de vozes é quando duas vozes cantam a mesma nota',
          'O cruzamento de vozes é sempre encorajado para interesse melódico',
          'O cruzamento de vozes só se aplica a soprano e baixo',
        ],
        [
          'Dobrar a fundamental do acorde é geralmente a escolha mais segura em estado fundamental',
          'Dobrar a 3.a é sempre preferido',
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
        'Identifica o erro ou regra de condução de vozes ilustrado aqui.',
      hintTemplate:
        'Evita 5.as e 8.as paralelas, resolve a sensível para cima, resolve a 7.a do acorde para baixo, e mantém notas comuns quando possível.',
      choiceSets: [
        [
          'Quintas paralelas ocorrem quando duas vozes passam de uma 5.aP para outra 5.aP na mesma direção',
          'Quintas paralelas são sempre aceitáveis na escrita SATB',
          'Quintas paralelas só ocorrem entre soprano e baixo',
          'Quintas paralelas significam que duas vozes estão sempre a uma 5.a de distância',
        ],
        [
          'A sensível deve resolver por grau ascendente para a tónica',
          'A sensível deve resolver para baixo, para a dominante',
          'A sensível pode mover-se livremente em qualquer direção',
          'A sensível deve sempre saltar para a mediante',
        ],
        [
          'A 7.a do acorde deve resolver por grau descendente',
          'A 7.a do acorde deve resolver por grau ascendente',
          'A 7.a do acorde não precisa de resolver',
          'A 7.a do acorde deve saltar uma 5.a abaixo',
        ],
        [
          'Movimento contrário entre as vozes extremas é geralmente preferido',
          'Movimento paralelo entre todas as vozes é ideal',
          'O baixo deve mover-se sempre na mesma direção que o soprano',
          'Movimento oblíquo nunca é usado na escrita SATB',
        ],
      ],
    },
  ],

  // ---- l3u10m3: Cadências — CAP, CAI, CS ----
  l3u10m3: [
    {
      // multiple_choice
      promptTemplate:
        'Classifica este tipo de cadência com base nos acordes e condução de vozes descritos.',
      hintTemplate:
        'CAP: V-I com soprano na tónica. CAI: V-I com soprano NÃO na tónica, ou acordes invertidos. CS: termina em V. Plagal: IV-I. Interrompida: V-vi.',
      choiceSets: [
        [
          'V para I com o soprano a terminar na tónica é uma Cadência Autêntica Perfeita (CAP)',
          'Esta é uma Cadência Autêntica Imperfeita (CAI)',
          'Esta é uma Cadência Suspensiva (CS)',
          'Esta é uma Cadência Interrompida',
        ],
        [
          'Uma frase que termina no acorde V é uma Cadência Suspensiva',
          'Uma frase que termina no acorde V é uma Cadência Autêntica Perfeita',
          'Uma frase que termina no acorde V é uma Cadência Plagal',
          'Uma frase que termina no acorde V é uma Cadência Interrompida',
        ],
        [
          'V a resolver para vi em vez de I é uma Cadência Interrompida',
          'V a resolver para vi é uma Cadência Autêntica Perfeita',
          'V a resolver para vi é uma Cadência Suspensiva',
          'V a resolver para vi é uma Cadência Plagal',
        ],
        [
          'IV para I é uma Cadência Plagal (cadência do Amen)',
          'IV para I é uma Cadência Autêntica Perfeita',
          'IV para I é uma Cadência Suspensiva',
          'IV para I é uma Cadência Interrompida',
        ],
        [
          'V para I com o soprano na 3.a é uma Cadência Autêntica Imperfeita (CAI)',
          'V para I com o soprano na 3.a é uma CAP',
          'V para I com o soprano na 3.a é uma Cadência Suspensiva',
          'V para I com o soprano na 3.a é uma Cadência Interrompida',
        ],
      ],
    },
  ],

  // ---- l3u10m4: Estrutura de Frase ----
  l3u10m4: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questão sobre a estrutura de frase musical.',
      hintTemplate:
        'Um período tem duas frases: antecedente (termina com CS ou CAI) e consequente (termina com CAP). Uma frase (Satz) tem apresentação (ideia básica + repetição) e continuação.',
      choiceSets: [
        [
          'Um período paralelo tem frases antecedente e consequente que começam com material semelhante',
          'Um período paralelo tem duas frases sem relação',
          'Um período paralelo deve ter exatamente 8 compassos',
          'Um período paralelo termina sempre com cadência suspensiva',
        ],
        [
          'A frase antecedente termina tipicamente com uma cadência fraca (CS ou CAI)',
          'A frase antecedente termina sempre com uma CAP',
          'A frase antecedente não tem cadência',
          'O antecedente é sempre a segunda frase',
        ],
        [
          'Uma estrutura de frase (Satz) consiste numa fase de apresentação seguida de uma fase de continuação',
          'Uma frase (Satz) é o mesmo que um período',
          'Uma frase (Satz) tem sempre 3 frases',
          'Uma frase (Satz) deve ter 16 compassos',
        ],
        [
          'Um período contrastante tem antecedente e consequente que começam com material diferente',
          'Um período contrastante tem frases idênticas',
          'Um período contrastante modula sempre',
          'Um período contrastante tem três frases',
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
        'Identifica esta nota estranha ao acorde com base na sua abordagem e resolução.',
      hintTemplate:
        'Uma nota de passagem move-se por grau entre duas notas do acorde na mesma direção. Preenche a lacuna entre uma 3.a.',
      choiceSets: [
        [
          'Uma nota abordada por grau e resolvida por grau na mesma direção é uma nota de passagem',
          'É uma bordadura',
          'É uma suspensão',
          'É uma apogiatura',
        ],
        [
          'As notas de passagem podem ser acentuadas (no tempo) ou não acentuadas (fora do tempo)',
          'As notas de passagem estão sempre no tempo',
          'As notas de passagem estão sempre fora do tempo',
          'As notas de passagem são sempre cromáticas',
        ],
        [
          'Uma nota de passagem cromática usa uma altura fora da tonalidade atual',
          'Uma nota de passagem cromática é sempre diatónica',
          'Uma nota de passagem cromática deve saltar',
          'As notas de passagem cromáticas são proibidas na harmonia clássica',
        ],
      ],
    },
  ],

  // ---- l3u11m2: Bordaduras ----
  l3u11m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica este tipo de nota estranha ao acorde e as suas características.',
      hintTemplate:
        'Uma bordadura afasta-se por grau de uma nota do acorde e regressa à mesma nota. Bordaduras superiores sobem e descem; bordaduras inferiores descem e sobem.',
      choiceSets: [
        [
          'Uma nota que se afasta por grau de uma nota do acorde e regressa a ela é uma bordadura',
          'É uma nota de passagem',
          'É uma suspensão',
          'É uma nota de escape',
        ],
        [
          'Uma bordadura dupla (nota cambiata) decora uma nota indo tanto acima como abaixo dela',
          'Uma bordadura dupla usa duas notas de passagem consecutivas',
          'Uma bordadura dupla significa que duas vozes têm bordaduras simultaneamente',
          'Uma bordadura dupla é o mesmo que um trilo',
        ],
        [
          'Uma bordadura incompleta é abordada ou resolvida por salto em vez de grau',
          'Uma bordadura incompleta nunca resolve',
          'Uma bordadura incompleta usa apenas um tom inteiro',
          'Uma bordadura incompleta é o mesmo que uma suspensão',
        ],
      ],
    },
  ],

  // ---- l3u11m3: Suspensões ----
  l3u11m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questão sobre suspensões na condução de vozes.',
      hintTemplate:
        'Uma suspensão tem 3 partes: preparação (consonância), suspensão (mantida em dissonância), resolução (grau descendente para consonância). Nomeadas pelos intervalos: 4-3, 7-6, 9-8, 2-3.',
      choiceSets: [
        [
          'Uma suspensão 4-3 mantém a 4.a acima do baixo e resolve descendo para uma 3.a',
          'Uma suspensão 4-3 mantém a 3.a e sobe para a 4.a',
          'Uma suspensão 4-3 é uma resolução ascendente',
          'Uma suspensão 4-3 não requer preparação',
        ],
        [
          'Uma suspensão deve ser preparada como consonância num tempo fraco antes de ser mantida no tempo forte',
          'Uma suspensão pode aparecer sem preparação',
          'Uma suspensão resolve sempre para cima',
          'Uma suspensão é o mesmo que uma apogiatura',
        ],
        [
          'Uma suspensão 7-6 mantém a 7.a acima do baixo e resolve descendo para uma 6.a',
          'Uma suspensão 7-6 resolve para cima, para uma oitava',
          'Uma suspensão 7-6 é uma suspensão do baixo',
          'Uma suspensão 7-6 não resolve',
        ],
        [
          'Uma suspensão 9-8 mantém a 9.a acima do baixo e resolve descendo para uma oitava',
          'Uma suspensão 9-8 resolve por grau ascendente',
          'Uma suspensão 9-8 é na verdade uma suspensão 2-1',
          'Uma suspensão 9-8 ocorre apenas na voz do baixo',
        ],
      ],
    },
  ],

  // ---- l3u11m4: Antecipações e Pedais ----
  l3u11m4: [
    {
      // multiple_choice
      promptTemplate:
        'Classifica esta nota estranha ao acorde com base no seu comportamento.',
      hintTemplate:
        'Uma antecipação chega cedo (antes de o acorde mudar). Um pedal é uma nota sustentada ou repetida (geralmente tónica ou dominante) mantida enquanto as harmonias mudam por cima.',
      choiceSets: [
        [
          'Uma antecipação faz soar uma nota do acorde antes de o acorde realmente chegar',
          'Uma antecipação é o mesmo que uma suspensão',
          'Uma antecipação requer preparação num tempo forte',
          'Uma antecipação resolve sempre para baixo',
        ],
        [
          'Um pedal de tónica sustenta a nota tónica enquanto as harmonias mudam por cima',
          'Um pedal de tónica só ocorre no soprano',
          'Um pedal de tónica deve resolver após um compasso',
          'Um pedal de tónica é o mesmo que um ostinato',
        ],
        [
          'Um pedal de dominante cria tensão ao manter o 5.o grau da escala através de harmonias não dominantes',
          'Um pedal de dominante só aparece no início de uma peça',
          'Um pedal de dominante usa sempre a sensível',
          'Um pedal de dominante está sempre na voz do soprano',
        ],
      ],
    },
  ],

  // ---- l3u11m5: Revisão de Notas Estranhas ao Acorde ----
  l3u11m5: [
    {
      // multiple_choice
      promptTemplate:
        'Classifica a nota estranha ao acorde descrita: abordada e resolvida desta forma.',
      hintTemplate:
        'Nota de passagem: grau-grau mesma direção. Bordadura: grau-grau regressando. Suspensão: mantida-grau descendente. Apogiatura: salto-grau. Nota de escape: grau-salto. Antecipação: chega cedo.',
      choiceSets: [
        [
          'Abordada por salto, resolvida por grau na direção oposta = apogiatura',
          'Isto descreve uma nota de passagem',
          'Isto descreve uma suspensão',
          'Isto descreve uma antecipação',
        ],
        [
          'Abordada por grau, resolvida por salto na direção oposta = nota de escape',
          'Isto descreve uma nota de passagem',
          'Isto descreve uma bordadura',
          'Isto descreve uma antecipação',
        ],
        [
          'Uma retardação é como uma suspensão mas resolve para cima',
          'Uma retardação resolve por salto descendente',
          'Uma retardação não tem preparação',
          'Uma retardação é o mesmo que uma antecipação',
        ],
        [
          'Todas as notas estranhas ao acorde criam dissonância que resolve para consonância',
          'As notas estranhas ao acorde são sempre consonantes',
          'As notas estranhas ao acorde nunca resolvem',
          'As notas estranhas ao acorde só ocorrem na voz do baixo',
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
