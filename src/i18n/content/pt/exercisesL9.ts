import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese translations for Level 9 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidade 30: Treino de Altura e Intervalos
  // =========================================================================

  // ---- l9u30m1: Correspondência de Altura/Direção ----

  l9u30m1e1: {
    prompt:
      'Ouve esta altura e identifica-a.',
    hint: 'O C central (C4) é o ponto de referência central no piano — ancora-o no teu ouvido.',
    nudge: 'Compara-a com a altura de referência que ouviste primeiro: é mais aguda, mais grave ou exatamente a mesma nota? Canta a referência e depois a nota, e ouve se há algum passo entre elas.',
  },
  l9u30m1e2: {
    prompt:
      'Ouve esta altura e identifica-a.',
    hint: 'G4 está uma 5.ª perfeita acima do C central — 7 meios-tons acima. Compara-o com C4 no teu ouvido.',
    nudge: 'Compara-a com o C de referência que ouviste primeiro: canta a escala maior a subir a partir de C, uma nota de cada vez, até lá chegares, e conta quantos graus subiste.',
  },
  l9u30m1e3: {
    prompt:
      'Quando uma segunda altura soa mais aguda do que a primeira, qual é a direção do movimento de altura?',
    choices: [
      'Ascendente',
      'Descendente',
      'Oblíquo',
      'Estático',
    ],
    hint: 'Ascendente significa mover-se para cima em altura. Descendente significa mover-se para baixo.',
    nudge: 'Pensa na altura como uma subida ou uma descida: se a segunda nota é mais aguda, a melodia foi para cima ou para baixo? Escolhe a palavra que dá nome a essa direção.',
  },
  l9u30m1e4: {
    prompt: 'O que significa "registo" em música?',
    choices: [
      'A posição relativa de agudo ou grave numa faixa de alturas',
      'A intensidade com que se toca, mais forte no agudo e mais suave no grave',
      'A velocidade a que as notas são tocadas, de muito lenta a muito rápida',
      'O número de instrumentos a tocar simultaneamente',
    ],
    hint: 'Registo descreve uma porção do espetro de alturas — registo grave, registo médio ou registo agudo.',
  },

  // ---- l9u30m2: Reconhecimento Maior vs Menor ----

  l9u30m2e1: {
    prompt:
      'Ouve este acorde. É maior ou menor?',
    choices: ['Maior', 'Menor'],
    hint: 'A 3.ª maior (4 meios-tons a partir da fundamental) dá aos acordes maiores um carácter brilhante e estável.',
    nudge: 'Ouve a 3.ª acima da fundamental: está a 4 meios-tons (som mais brilhante e aberto) ou a 3 meios-tons (som mais sombrio)?',
  },
  l9u30m2e2: {
    prompt:
      'Ouve este acorde. É maior ou menor?',
    choices: ['Maior', 'Menor'],
    hint: 'A 3.ª menor (3 meios-tons a partir da fundamental) dá aos acordes menores uma qualidade mais sombria e melancólica.',
    nudge: 'Canta a fundamental e depois a 3.ª do acorde: estão a 4 meios-tons de distância (mais brilhante) ou a 3 (mais sombrio)?',
  },
  l9u30m2e3: {
    prompt:
      'Qual é a diferença estrutural entre uma tríade maior e uma tríade menor?',
    choices: [
      'A terceira é baixada meio-tom no menor',
      'A quinta é baixada meio-tom no menor',
      'A fundamental é elevada meio-tom no menor',
      'Tríades menores têm quatro notas em vez de três',
    ],
    hint: 'Tríade maior: fundamental + 3.ª maior (4 meios-tons) + 5.ª P. Tríade menor: fundamental + 3.ª menor (3 meios-tons) + 5.ª P. Só a 3.ª muda.',
  },

  // ---- l9u30m3: Reconhecimento de Intervalos P1-P5 ----

  l9u30m3e1: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '1 meio-tom = 2.ª menor (meio-tom) — o menor intervalo na música ocidental. Pensa no tema de Tubarão.',
    nudge: 'Avalia primeiro o tamanho: as duas notas estão tão próximas quanto duas notas diferentes podem estar, tensas e rastejantes, ou há espaço para outra nota entre elas?',
  },
  l9u30m3e2: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '2 meios-tons = 2.ª maior (tom). O passo melódico do dia a dia.',
    nudge: 'É um passo ou um salto? Se for um passo, decide se as notas são teclas vizinhas (apertado e tenso) ou se têm uma tecla entre elas (um passo simples, do dia a dia).',
  },
  l9u30m3e3: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '3 meios-tons = 3.ª menor — sombria e melancólica. Este intervalo define a base de uma tríade menor.',
    nudge: 'É um pequeno salto, maior do que um passo. Ouve a sua cor: brilhante e aberta, ou mais escura e melancólica? Depois canta por meios-tons a partir da nota mais grave para confirmares o tamanho.',
  },
  l9u30m3e4: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '7 meios-tons = 5.ª perfeita — forte e aberta. O intervalo mais consonante depois da oitava e do uníssono.',
    nudge: 'Ouve o carácter do salto: tenso e instável, quente e doce, ou despido, aberto e forte? Depois conta os meios-tons a partir da nota mais grave para confirmares.',
  },

  // ---- l9u30m4: Reconhecimento de Intervalos 6.a m-P8 ----

  l9u30m4e1: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '8 meios-tons = 6.ª menor. Ouve a distância entre as notas: faltam 4 meios-tons para completar a oitava.',
    nudge: 'Ouve a distância entre as duas notas. Para a confirmares, canta a nota mais grave uma oitava acima, identifica o pequeno intervalo que forma com a outra nota e inverte-o: os números somam 9, e a qualidade passa à oposta.',
  },
  l9u30m4e2: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '9 meios-tons = 6.ª maior — quente, romântica e consonante.',
    nudge: 'Um salto largo que continua a soar quente e doce. Para confirmares, canta a nota mais grave uma oitava acima, identifica o pequeno intervalo que forma com a outra nota e inverte-o: os números somam 9, e a qualidade passa à oposta.',
  },
  l9u30m4e3: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '10 meios-tons = 7.ª menor — uma tensão dominante e bluesy que quer resolver.',
    nudge: 'Um salto muito largo com uma atração bluesy que pede resolução. Canta a nota mais grave uma oitava acima e compara: o salto fica meio-tom aquém dessa oitava, ou um tom aquém?',
  },
  l9u30m4e4: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: '12 meios-tons = oitava perfeita — as duas notas soam como a mesma altura em registos diferentes.',
    nudge: 'Ouve se as duas notas se fundem tão completamente que soam como uma só nota em duas alturas, ou se fica entre elas alguma fricção ou tensão.',
  },

  // ---- l9u30m5: Intervalos Harmónicos ----

  l9u30m5e1: {
    prompt:
      'Ouve estas duas notas tocadas em simultâneo e identifica o intervalo harmónico.',
    hint: '5 meios-tons = 4.ª perfeita. Em simultâneo tem uma qualidade aberta e oca.',
    nudge: 'Classifica-o primeiro pelo som: aberto e oco, quente e fundido, ou áspero e tenso? Depois canta as duas notas uma a seguir à outra e conta os meios-tons entre elas para fixares o tamanho.',
  },
  l9u30m5e2: {
    prompt:
      'Ouve estas duas notas tocadas em simultâneo e identifica o intervalo harmónico.',
    hint: '4 meios-tons = 3.ª maior — um som harmónico quente e consonante.',
    nudge: 'Classifica-o primeiro pelo som: aberto e oco, quente e fundido, ou áspero e tenso? Se for quente, decide se é do tipo mais brilhante ou mais escuro: canta as duas notas uma a seguir à outra e conta os meios-tons.',
  },
  l9u30m5e3: {
    prompt:
      'Qual é a diferença entre um intervalo harmónico e um intervalo melódico?',
    choices: [
      'Intervalos harmónicos fazem soar as duas notas ao mesmo tempo; intervalos melódicos tocam-nas uma após a outra',
      'Intervalos harmónicos são sempre consonantes; intervalos melódicos são sempre dissonantes',
      'Intervalos harmónicos usam sustenidos; intervalos melódicos usam bemóis',
      'Intervalos harmónicos abrangem mais de uma oitava; intervalos melódicos não',
    ],
    hint: 'Harmónico = ambas as notas ao mesmo tempo. Melódico = uma nota após a outra. As mesmas duas notas podem formar qualquer tipo.',
  },

  // =========================================================================
  // Unidade 31: Escalas, Acordes e Ditado
  // =========================================================================

  // ---- l9u31m1: Reconhecimento de Escalas Maior/Menor ----

  l9u31m1e1: {
    prompt:
      'Ouve esta escala e identifica o seu tipo.',
    choices: ['Maior', 'Menor natural', 'Menor harmónica'],
    hint: 'A escala maior (T-T-mT-T-T-T-mT) tem um carácter brilhante e resolvido em cada passo.',
    nudge: 'Verifica primeiro a 3.ª acima da tónica: 4 meios-tons ou 3? Se forem 3, ouve o topo da escala: há um salto de tom e meio entre o 6.º e o 7.º graus?',
  },
  l9u31m1e2: {
    prompt:
      'Ouve esta escala e identifica o seu tipo.',
    choices: ['Maior', 'Menor natural', 'Menor harmónica'],
    hint: 'A escala menor natural (T-mT-T-T-mT-T-T) tem uma atmosfera mais sombria do que a maior — a 3.ª, 6.ª e 7.ª baixadas moldam a sua cor.',
    nudge: 'Canta a partir da tónica: a 3.ª está a 4 ou a 3 meios-tons dela? Depois ouve o 7.º grau: fica a um tom da tónica de cima, ou a meio-tom, com um salto de tom e meio por baixo?',
  },
  l9u31m1e3: {
    prompt:
      'Qual descreve melhor o carácter geral de uma escala maior?',
    choices: [
      'Brilhante, alegre e resolvido',
      'Sombrio, triste e tenso',
      'Misterioso, ambíguo e inquieto',
      'Dissonante, áspero e instável',
    ],
    hint: 'As escalas maiores são percebidas como brilhantes e estáveis. A 3.ª maior e a 7.ª maior contribuem para este carácter positivo.',
  },

  // ---- l9u31m2: Reconhecimento de Modos ----

  l9u31m2e1: {
    prompt:
      'Ouve esta escala e identifica o modo.',
    choices: ['Dórico', 'Frígio', 'Lídio', 'Mixolídio'],
    hint: 'O Dórico é como o menor natural com o 6.º grau elevado — esse 6 natural em contexto menor é a nota característica.',
    nudge: 'Primeiro a 3.ª: está a 4 ou a 3 meios-tons da tónica? Depois compara com a escala maior (se forem 4) ou com a menor natural (se forem 3) e encontra o único grau que muda: um 2.º baixado, um 4.º elevado, um 6.º elevado ou um 7.º baixado?',
  },
  l9u31m2e2: {
    prompt:
      'Ouve esta escala e identifica o modo.',
    choices: ['Dórico', 'Frígio', 'Lídio', 'Mixolídio'],
    hint: 'O Lídio é como o maior com o 4.º grau elevado — ouve o #4 brilhante a puxar para cima.',
    nudge: 'A 3.ª está a 4 ou a 3 meios-tons da tónica? Compara a escala com a maior (se forem 4) ou com a menor natural (se forem 3) e procura o único grau diferente: o 2.º, o 4.º, o 6.º ou o 7.º?',
  },
  l9u31m2e3: {
    prompt:
      'Qual é a nota característica que distingue o Dórico do menor natural?',
    choices: [
      'Um 6.º grau elevado (natural)',
      'Um 2.º grau baixado',
      'Um 7.º grau elevado',
      'Um 5.º grau baixado',
    ],
    hint: 'O Dórico difere do menor natural por uma nota: o 6.º grau é elevado meio-tom. Em D Dórico, é B natural em vez de Bb.',
  },
  l9u31m2e4: {
    prompt:
      'Ouve esta escala e identifica o modo.',
    choices: ['Jónio', 'Lídio', 'Mixolídio', 'Dórico'],
    hint: 'O Jónio é a própria escala maior: o 1.º modo, sem nenhum grau alterado. O Lídio elevaria o 4.º grau (#4); o Mixolídio baixaria o 7.º (b7).',
    nudge: 'Compara cada grau com a escala maior que conheces: o 4.º está elevado, o 7.º baixado, a 3.ª baixada, ou todos os graus coincidem?',
  },
  l9u31m2e5: {
    prompt:
      'Ouve esta escala e identifica o modo.',
    choices: ['Eólio', 'Dórico', 'Frígio', 'Lócrio'],
    hint: 'O Eólio é a escala menor natural: o 6.º modo da escala maior. O Dórico elevaria o 6.º grau (6 natural); o Frígio baixaria o 2.º (b2); o Lócrio baixa o 2.º e o 5.º.',
    nudge: 'Compara cada grau com a escala menor natural: o 6.º está elevado, o 2.º baixado, o 2.º e o 5.º ambos baixados, ou todos os graus coincidem?',
  },

  // ---- l9u31m3: Pentatónica/Blues/Simétrica ----

  l9u31m3e1: {
    prompt:
      'Ouve esta escala e identifica o seu tipo.',
    choices: ['Pentatónica maior', 'Pentatónica menor', 'Blues', 'Tons inteiros'],
    hint: 'A pentatónica maior tem cinco notas e nenhum meio-tom — a escala maior sem o 4.º e o 7.º graus.',
    nudge: 'Conta as notas e procura meios-tons. Se houver cinco notas e nenhum meio-tom, verifica a 3.ª: está a 4 ou a 3 meios-tons da tónica?',
  },
  l9u31m3e2: {
    prompt:
      'Ouve esta escala e identifica o seu tipo.',
    choices: ['Pentatónica maior', 'Pentatónica menor', 'Blues', 'Tons inteiros'],
    hint: 'A escala de blues é a pentatónica menor mais a "blue note" (b5) — ouve essa mordida cromática extra.',
    nudge: 'Conta as notas e procura meios-tons: cinco notas sem nenhum, seis notas todas a um tom de distância, ou seis notas com uma nota cromática extra entre o 4.º e o 5.º graus?',
  },
  l9u31m3e3: {
    prompt: 'O que é a "blue note" numa escala de blues?',
    choices: [
      'A 5.ª bemolizada (ou 4.ª sustenida), entre o 4.º e o 5.º graus',
      'A tónica repetida uma oitava acima, no ponto mais agudo da escala',
      'Qualquer nota tocada com vibrato',
      'A sensível da tonalidade, a nota que fica meio-tom abaixo da tónica',
    ],
    hint: 'A blue note é a b5 (ou #4) acrescentada à pentatónica menor. Em C blues, é Gb/F#, entre F e G.',
  },

  // ---- l9u31m4: Reconhecimento de Qualidade de Tríades ----

  l9u31m4e1: {
    prompt:
      'Ouve esta tríade e identifica a sua qualidade.',
    choices: ['Maior', 'Menor', 'Diminuta', 'Aumentada'],
    hint: 'Diminuta = duas 3.as menores empilhadas. O trítono entre fundamental e 5.ª cria a sua qualidade tensa e instável.',
    nudge: 'Ouve o intervalo exterior, da fundamental à 5.ª: é uma 5.ª perfeita, ou meio-tom mais estreita ou mais larga? Depois verifica as duas 3.as empilhadas: 4 ou 3 meios-tons cada uma?',
  },
  l9u31m4e2: {
    prompt:
      'Ouve esta tríade e identifica a sua qualidade.',
    choices: ['Maior', 'Menor', 'Diminuta', 'Aumentada'],
    hint: 'Aumentada = duas 3.as maiores empilhadas. A estrutura simétrica dá-lhe uma qualidade sonhadora e não resolvida.',
    nudge: 'Empilha as duas 3.as que ouves, de baixo para cima: têm 4 + 3, 3 + 4, 3 + 3 ou 4 + 4 meios-tons? A 5.ª exterior também ajuda: é perfeita, ou meio-tom mais estreita ou mais larga?',
  },
  l9u31m4e3: {
    prompt: 'Que intervalos compõem uma tríade diminuta?',
    choices: [
      'Fundamental, 3.ª menor e 5.ª diminuta (trítono)',
      'Fundamental, 3.ª maior e 5.ª perfeita (uma tríade maior)',
      'Fundamental, 3.ª menor e 5.ª perfeita',
      'Fundamental, 3.ª maior e 5.ª aumentada (duas 3.as maiores)',
    ],
    hint: 'Diminuta = 3.ª menor (3 meios-tons) + 5.ª diminuta (6 meios-tons). Duas 3.as menores empilhadas produzem o trítono entre fundamental e 5.ª.',
  },
  l9u31m4e4: {
    prompt: 'Como descreverias o som de uma tríade aumentada?',
    choices: [
      'Tensa e não resolvida, com uma qualidade sonhadora, flutuante e ambígua',
      'Brilhante, assente e estável, tal como um simples acorde maior',
      'Sombria e pesada como um acorde menor',
      'Oca e medieval como um power chord',
    ],
    hint: 'Tríades aumentadas dividem a oitava em três partes iguais (3.ª M + 3.ª M). Esta simetria cria uma sensação ambígua e suspensa.',
  },

  // ---- l9u31m5: Qualidade de Acordes de Sétima ----

  l9u31m5e1: {
    prompt:
      'Ouve este acorde de sétima e identifica a sua qualidade.',
    choices: ['Maior com 7.ª M', 'Menor com 7.ª', 'Sétima da dominante', 'Meio-diminuto'],
    hint: 'O acorde maior com 7.ª sobrepõe uma 7.ª maior a uma tríade maior — exuberante e sonhador, comum no jazz e na bossa nova.',
    nudge: 'Primeiro a tríade: a 3.ª está a 4 ou a 3 meios-tons da fundamental, e a 5.ª é perfeita ou meio-tom mais baixa? Depois a 7.ª: fica a meio-tom ou a um tom abaixo da oitava?',
  },
  l9u31m5e2: {
    prompt:
      'Ouve este acorde de sétima e identifica a sua qualidade.',
    choices: ['Maior com 7.ª M', 'Menor com 7.ª', 'Sétima da dominante', 'Meio-diminuto'],
    hint: 'O acorde menor com 7.ª sobrepõe uma 7.ª menor a uma tríade menor — suave, quente e descontraído.',
    nudge: 'Ouve o acorde em duas camadas. A tríade: a 3.ª está a 4 ou a 3 meios-tons da fundamental, e a 5.ª é perfeita ou baixada? A 7.ª: fica a meio-tom ou a um tom abaixo da oitava?',
  },
  l9u31m5e3: {
    prompt:
      'O que dá a um acorde de 7.ª dominante a sua sensação característica de tensão e desejo de resolver?',
    choices: [
      'O trítono entre a 3.ª e a 7.ª',
      'A 5.ª perfeita formada entre a fundamental e a 5.ª do acorde',
      'A 3.ª maior entre fundamental e 3.ª',
      'A duplicação à oitava da fundamental',
    ],
    hint: 'Em G7 (G-B-D-F), B e F formam um trítono (6 meios-tons). Esta dissonância cria a atração para resolução a C maior.',
  },
  l9u31m5e4: {
    prompt:
      'Em que contexto musical é o acorde de sétima meio-diminuto mais frequentemente encontrado?',
    choices: [
      'Como acorde ii em tonalidades menores (p. ex. Bm7b5 em A menor)',
      'Como acorde I em tonalidades maiores',
      'Como acorde V em tonalidades maiores',
      'Como acorde IV de um blues de 12 compassos, onde todos os acordes são de 7.ª da dominante',
    ],
    hint: 'O acorde de sétima meio-diminuto (m7b5) ocorre naturalmente no 2.º grau da menor harmónica. Serve como acorde predominante conduzindo ao V em progressões ii-V-i menores.',
  },

  // =========================================================================
  // Unidade 32: Ditado, Leitura à Primeira Vista, Contextual
  // =========================================================================

  // ---- l9u32m1: Ditado Melódico Diatónico ----

  l9u32m1e1: {
    prompt:
      'Ouve esta nota e identifica-a.',
    hint: 'Esta altura é o 3.º grau de C maior. Canta a partir de C para a localizar.',
  },
  l9u32m1e2: {
    prompt:
      'Ouve esta nota e identifica-a.',
    hint: 'Esta altura é o 6.º grau de C maior. Canta a partir de C para a localizar.',
  },
  l9u32m1e3: {
    prompt: 'O que significa "melodia diatónica"?',
    choices: [
      'Uma melodia só com notas da tonalidade',
      'Uma melodia que usa sustenidos e bemóis fora da tonalidade',
      'Uma melodia tocada apenas numa corda da guitarra',
      'Uma melodia construída apenas com movimento por graus conjuntos, sem contornos de acorde como C-E-G',
    ],
    hint: 'Diatónico significa "pertencente à tonalidade." Uma melodia diatónica em C maior usa apenas C, D, E, F, G, A e B — sem acidentes.',
  },
  l9u32m1e4: {
    prompt:
      'Qual estratégia é mais eficaz para identificar graus individuais da escala numa melodia?',
    choices: [
      'Relacionar cada nota com a tónica cantando a escala até esse grau',
      'Memorizar a frequência exata, em hertz, de todas as notas do teclado',
      'Contar o número de linhas suplementares na pauta',
      'Tratar a primeira nota da melodia como a tónica e contar a partir daí',
    ],
    hint: 'Ouvir graus da escala significa perceber cada nota em relação à tónica. Cantar desde "do" até à nota alvo é um método fiável.',
  },
  l9u32m1e5: {
    prompt: 'Ouve a melodia e escolhe a que ouviste.',
    hint: 'Segue primeiro o contorno: a linha volta ao ponto de partida ou continua a subir?',
  },
  l9u32m1e6: {
    prompt: 'Ouve a melodia e escolhe a que ouviste.',
    hint: 'Sobe por grau conjunto e depois desce aos saltos pelas notas do acorde de tónica até acabar na tónica.',
  },
  l9u32m1e7: {
    prompt: 'Ouve a melodia e escolhe a que ouviste.',
    hint: 'Graus conjuntos ou saltos? Uma melodia que desenha o acorde de tónica move-se por terceiras e acaba onde começou.',
  },
  l9u32m1e8: {
    prompt: 'Ouve a melodia e escolhe a que ouviste.',
    hint: 'Ouve o final: a última nota é a tónica, alcançada a partir da nota meio-tom abaixo.',
  },
  l9u32m1e9: {
    prompt: 'Ouve a melodia e escolhe a que ouviste.',
    hint: 'Desce da 5.ª até à tónica, mas não pela escala abaixo de seguida: ouve os saltos.',
  },

  // ---- l9u32m2: Ditado Melódico Cromático ----

  l9u32m2e1: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: 'E para F é um meio-tom (1 meio-tom) entre duas letras diferentes — um meio-tom diatónico, que já está dentro de C maior. Um meio-tom cromático mantém a letra (F para F#). Numa melodia, qualquer um deles funciona muitas vezes como nota de passagem ou bordadura.',
  },
  l9u32m2e2: {
    prompt:
      'Ouve este intervalo ascendente e identifica-o.',
    hint: 'O trítono (6 meios-tons, 4.ª aumentada / 5.ª diminuta) é uma das dissonâncias mais ásperas (com a 2.ª menor e a 7.ª maior) e divide a oitava exatamente ao meio.',
    nudge: 'O salto soa estável e aberto, ou inquieto e por resolver, como se tivesse de seguir em frente? Conta os meios-tons a partir da nota mais grave e compara o total com os 12 da oitava.',
  },
  l9u32m2e3: {
    prompt: 'O que é uma nota cromática de passagem?',
    choices: [
      'Uma nota fora da tonalidade que preenche um tom entre duas notas diatónicas',
      'Qualquer nota tocada com acento',
      'A primeira nota de uma escala cromática, que começa na tónica e sobe por meios-tons',
      'Uma nota prolongada do acorde anterior para o seguinte, através da barra de compasso',
    ],
    hint: 'Uma nota cromática de passagem é uma nota não diatónica que liga duas notas diatónicas a um tom de distância, dividindo esse tom em dois meios-tons.',
  },
  l9u32m2e4: {
    prompt: 'Ouve a melodia e escolhe a que ouviste.',
    hint: 'Uma nota cromática de passagem preenche um tom: ouve a nota apertada entre as duas primeiras notas da escala.',
  },
  l9u32m2e5: {
    prompt: 'Ouve a melodia e escolhe a que ouviste.',
    hint: 'Uma nota sai mesmo à beira da tonalidade e volta logo: uma bordadura cromática.',
  },
  l9u32m2e6: {
    prompt: 'Ouve a melodia e escolhe a que ouviste.',
    hint: 'Ouve a nota que puxa para G por meio-tom ascendente: uma sensível secundária (V/V).',
  },
  l9u32m2e7: {
    prompt: 'Ouve a melodia e escolhe a que ouviste.',
    hint: 'Um sustenido conduz por meio-tom ascendente à nota seguinte. Para onde vai a linha a seguir?',
  },

  // ---- l9u32m3: Ditado Harmónico ----

  l9u32m3e1: {
    prompt:
      'Uma frase termina com V movendo para I, ambos em posição fundamental, com a melodia chegando à tónica. Que tipo de cadência é esta?',
    choices: [
      'Cadência perfeita (CAP)',
      'Meia cadência',
      'Cadência imperfeita (CAI)',
      'Cadência interrompida',
    ],
    hint: 'Uma cadência perfeita (CAP) requer V para I em posição fundamental com a tónica no soprano. Proporciona a sensação mais forte de finalidade.',
    nudge: 'Faz três perguntas: o V vai para o I, os dois acordes estão na posição fundamental, e a melodia chega à tónica? Quando as três se cumprem, é a cadência conclusiva mais forte; se falhar alguma, é a sua versão mais fraca.',
  },
  l9u32m3e2: {
    prompt:
      'Uma frase musical faz pausa no acorde de V sem resolver. Que tipo de cadência é esta?',
    choices: [
      'Meia cadência',
      'Cadência perfeita',
      'Cadência plagal',
      'Cadência interrompida',
    ],
    hint: 'Uma meia cadência termina em V, criando uma sensação de suspensão ou incompletude — como uma vírgula em vez de um ponto final.',
    nudge: 'Olha para o último acorde: uma cadência que acaba na tónica soa fechada; uma que fica na dominante soa aberta, como uma vírgula. Que nome descreve um final aberto, por concluir?',
  },
  l9u32m3e3: {
    prompt:
      'Esperas que V resolva para I, mas em vez disso move-se para vi. Que tipo de cadência produz esta surpresa?',
    choices: [
      'Cadência interrompida',
      'Meia cadência',
      'Cadência perfeita',
      'Cadência plagal',
    ],
    hint: 'Uma cadência interrompida substitui vi pelo I esperado após V. O ouvido espera resolução mas recebe um desvio surpresa.',
    nudge: 'A dominante faz esperar a tónica, mas chega outro acorde no seu lugar. Que cadência tem o nome de uma chegada que é cortada, e não de uma chegada ou de uma pausa?',
  },

  // ---- l9u32m4: Leitura à Primeira Vista ----

  l9u32m4e1: {
    prompt:
      'No solfejo móvel, que sílaba é sempre atribuída à tónica da tonalidade atual?',
    choices: ['Do', 'La', 'Sol', 'Re'],
    hint: 'No solfejo móvel, "Do" representa sempre a tónica independentemente da tonalidade. Em C maior, Do = C. Em G maior, Do = G.',
    nudge: 'No solfejo móvel, as sílabas seguem os graus da escala e não alturas fixas, e a tónica recebe sempre a primeira sílaba da série. Qual é a sílaba que a abre?',
  },
  l9u32m4e2: {
    prompt:
      'Na tonalidade de C maior, que nota corresponde à sílaba de solfejo "Mi"?',
    choices: ['E', 'D', 'F', 'G'],
    hint: 'Do-Re-Mi-Fa-Sol-La-Ti mapeia para os 7 graus da escala. Em C maior: C(Do), D(Re), E(Mi), F(Fa), G(Sol), A(La), B(Ti).',
    nudge: 'No solfejo móvel, as sílabas seguem os graus da escala: em C maior, Do = C. Sobe pela escala sílaba a sílaba até chegares a Mi.',
  },
  l9u32m4e3: {
    prompt:
      'Qual é o passo de preparação mais importante antes de ler à primeira vista uma melodia?',
    choices: [
      'Estabelecer a tónica cantando a escala ou arpejo da tonalidade',
      'Memorizar a melodia inteira de cor antes de cantares uma única nota',
      'Ler a letra primeiro, para saberes que palavras vais ter de cantar',
      'Contar o número total de notas da melodia antes de começares a cantar',
    ],
    hint: 'Estabelecer o centro tonal (tónica) no ouvido é essencial. Cantar uma escala ou arpejo de tónica rápidos ancora a tua perceção de altura antes de ler a melodia.',
    nudge: 'Antes de ler qualquer nota, o teu ouvido precisa de um ponto de referência: a altura em relação à qual se ouvem todas as outras. Que opção dá ao ouvido esse ponto de partida?',
  },

  // ---- l9u32m5: Audição Contextual ----

  l9u32m5e1: {
    prompt:
      'Uma linha vocal única sem acompanhamento nem harmonia é exemplo de que textura musical?',
    choices: [
      'Monofónica',
      'Homofónica',
      'Polifónica',
      'Heterofónica',
    ],
    hint: 'A textura monofónica consiste numa única linha melódica sem acompanhamento nem harmonia. Uma voz, uma linha.',
    nudge: 'Os nomes das texturas vêm de prefixos gregos. Conta quantas linhas independentes estão a soar e como se relacionam, e depois associa isso ao prefixo.',
  },
  l9u32m5e2: {
    prompt:
      'Uma canção pop alterna estrofes (letra nova de cada vez, mesma música) com um refrão que regressa sempre com a mesma letra e a mesma música. Que forma é esta?',
    choices: [
      'Forma estrofe-refrão',
      'Forma through-composed',
      'Forma rondó (ABACA)',
      'Forma sonata',
    ],
    hint: 'A forma estrofe-refrão alterna estrofes (letras diferentes, mesma melodia) com um refrão recorrente. É a estrutura mais comum na música popular.',
    nudge: 'Repara em como a canção está construída: dois tipos de secção que alternam, um dos quais regressa sem mudanças. Que forma tem o nome exatamente dessas secções?',
  },
  l9u32m5e3: {
    prompt:
      'Que característica musical é mais útil para identificar o período estilístico histórico de uma peça?',
    choices: [
      'A combinação de instrumentação, linguagem harmónica e estrutura formal',
      'A indicação de andamento sozinha, tal como impressa por cima do primeiro compasso',
      'A armação de clave sozinha',
      'O número total de compassos da peça, contados desde o primeiro até ao último',
    ],
    hint: 'Os períodos estilísticos são identificados por uma combinação de fatores: instrumentação (cravo vs. piano), vocabulário harmónico (triádico vs. cromático) e convenções formais (binária vs. forma sonata).',
  },
};

export default overlay;
