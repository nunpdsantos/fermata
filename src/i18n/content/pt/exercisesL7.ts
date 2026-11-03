import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese translations for Level 7 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidade 21: Harmonia Jazz
  // =========================================================================

  // ---- l7u21m1: Cifras de Jazz e Extensões ----

  l7u21m1e1: {
    prompt:
      'Constrói um acorde Cmaj9. Seleciona as 5 notas: fundamental, terça maior, quinta perfeita, sétima maior e nona maior.',
    hint: 'Cmaj9 = C, E, G, B, D. Empilhamento: fundamental (C), terça maior (E), quinta perfeita (G), sétima maior (B), nona maior (D). Pitch classes: 0, 4, 7, 11, 2.',
  },
  l7u21m1e2: {
    prompt:
      'Constrói um acorde Dm9. Seleciona as 5 notas: fundamental, terça menor, quinta perfeita, sétima menor e nona maior.',
    hint: 'Dm9 = D, F, A, C, E. Empilhamento: fundamental (D), terça menor (F), quinta perfeita (A), sétima menor (C), nona maior (E). Pitch classes: 2, 5, 9, 0, 4.',
  },
  l7u21m1e3: {
    prompt:
      'Nas cifras de jazz, o que indica "alt" (como em G7alt)?',
    choices: [
      "Uma dominante com a quinta ou a nona elevada ou baixada",
      "Uma dominante com a terça substituída pela quarta",
      "Uma dominante com a sétima elevada para sétima maior",
      "Uma dominante com a fundamental retirada do voicing",
    ],
    hint: 'O sufixo "alt" significa que o acorde tem extensões alteradas: b9, #9, b5 (ou #11) e #5 (ou b13). Emparelha-se com a escala alterada (superlócria).',
  },

  // ---- l7u21m2: Voicings de Shell ----

  l7u21m2e1: {
    prompt: 'Um voicing de shell tipicamente contém que notas do acorde?',
    choices: [
      'Apenas fundamental, terça e sétima — omitindo a quinta e as extensões',
      "Apenas fundamental, terça e quinta — omitindo a sétima e as extensões",
      "Apenas fundamental, quinta e sétima — omitindo a terça e as extensões",
      "Apenas fundamental, quinta e nona — omitindo a terça e a sétima",
    ],
    hint: 'Os voicings de shell reduzem o acorde ao essencial: a fundamental define o baixo, a terça determina a qualidade maior/menor e a sétima determina o tipo de acorde (maj7, dom7, m7). Nesses acordes a quinta perfeita é redundante; nos acordes m7b5 e dim7 é a quinta diminuta que define o acorde, por isso fica.',
  },
  l7u21m2e2: {
    prompt:
      'Qual é a característica definidora de um acorde dominante alterado?',
    choices: [
      'Tem sempre uma sétima da dominante com uma ou mais quintas ou nonas cromaticamente alteradas',
      'Costuma substituir a terça maior por uma quarta suspensa',
      'Eleva a sétima menor para sétima maior',
      'Define-se pela omissão da fundamental na disposição do acorde',
    ],
    hint: 'Um acorde dominante alterado mantém a fundamental, terça e b7, mas altera cromaticamente a quinta (b5 ou #5) e/ou a nona (b9 ou #9), criando tensão máxima antes da resolução.',
  },
  l7u21m2e3: {
    prompt:
      'Como é que G7sus4 atrasa a resolução quando conduz a G7?',
    choices: [
      'Substituindo a terça por uma quarta',
      'Acrescentando uma quarta à terça',
      'Substituindo a quinta por uma quarta',
      'Mantendo a quarta até esta subir à quinta',
    ],
    hint: 'Um acorde sus4 substitui a terça por uma quarta, removendo a qualidade maior/menor. No jazz, G7sus4 precede frequentemente G7 numa resolução V7sus4 para V7 para I, atrasando a sensível.',
  },

  // ---- l7u21m3: Progressão ii-V-I ----

  l7u21m3e1: {
    prompt:
      'Constrói o acorde ii7 em C maior. Seleciona as 4 notas.',
    hint: 'Dm7 = D, F, A, C. Fundamental (D), terça menor (F), quinta perfeita (A), sétima menor (C). Pitch classes: 2, 5, 9, 0.',
  },
  l7u21m3e2: {
    prompt:
      'Constrói o acorde V7 em C maior. Seleciona as 4 notas.',
    hint: 'G7 = G, B, D, F. Fundamental (G), terça maior (B), quinta perfeita (D), sétima menor (F). Pitch classes: 7, 11, 2, 5.',
  },
  l7u21m3e3: {
    prompt: 'Porque é que a ii-V-I é a progressão mais importante no jazz?',
    choices: [
      'Preparação → tensão → repouso',
      'Tensão → repouso → preparação',
      'Repouso → tensão → preparação',
      'Repouso → preparação → tensão',
    ],
    hint: 'A ii-V-I encapsula o movimento harmónico completo: preparação (ii), tensão (V), resolução (I). Quase todos os standards de jazz contêm múltiplas progressões ii-V-I em várias tonalidades.',
  },

  // ---- l7u21m4: Substituição Tritónica ----

  l7u21m4e1: {
    prompt:
      'Constrói a substituição tritónica de G7. Seleciona as 4 notas.',
    hint: 'Db7 = Db, F, Ab, Cb. A substituição tritónica partilha o mesmo intervalo de trítono (F-Cb enarmónico de F-B) do acorde G7 original. Pitch classes: 1, 5, 8, 11.',
  },
  l7u21m4e2: {
    prompt: 'Qual é o princípio de substituir um acorde de sétima dominante por outro acorde de sétima dominante à distância de um trítono?',
    choices: [
      'As terças e sétimas são as mesmas duas classes de altura, com os papéis trocados',
      "As fundamentais e quintas são geralmente as mesmas duas classes de altura, com os papéis trocados",
      "As terças e sétimas sobem um tom, mantendo os mesmos papéis no novo acorde",
      'As fundamentais estão à distância de um trítono, e as quintas mantêm a mesma classe de altura',
    ],
    hint: 'G7 tem B e F como terça e sétima. Db7 tem F e Cb (=B) como terça e sétima. Os guide tones são idênticos (enarmonicamente), por isso Db7 pode resolver para C tal como G7.',
  },
  l7u21m4e3: {
    prompt: 'Na progressão Dm7 - Db7 - Cmaj7, o que é o acorde Db7?',
    choices: [
      'Uma substituição tritónica de G7, com o baixo a descer apenas por meios-tons, de D para Db e daí para C',
      'Uma substituição pela dominante back-door, com o baixo a descer apenas por meios-tons, de D para Db e daí para C',
      "Uma substituição tritónica de D7, com o baixo a descer apenas por meios-tons, de D para Db e daí para C",
      "Uma substituição tritónica de F7, com o baixo a descer apenas por meios-tons, de D para Db e daí para C",
    ],
    hint: 'Db7 substitui G7 (o V7). O baixo desce cromaticamente: D (ii) - Db (sub tritónica do V) - C (I). Esta condução de vozes suave é um dos principais benefícios das substituições tritónicas.',
  },

  // ---- l7u21m5: Formas de Blues ----

  l7u21m5e1: {
    prompt:
      'Qual é a progressão padrão para um blues básico de 12 compassos na tonalidade de C?',
    choices: [
      'I7-I7-I7-I7 | IV7-IV7-I7-I7 | V7-IV7-I7-V7 (forma C7-F7-G7)',
      "V7-V7-V7-V7 | IV7-IV7-V7-V7 | I7-IV7-V7-I7 (forma C7-F7-G7)",
      "IV7-IV7-IV7-IV7 | I7-I7-IV7-IV7 | V7-I7-IV7-V7 (forma C7-F7-G7)",
      "I7-I7-I7-I7 | V7-V7-I7-I7 | IV7-V7-I7-IV7 (forma C7-F7-G7)",
    ],
    hint: 'O blues de 12 compassos segue um padrão específico ao longo de 12 compassos: 4 compassos de I7, 2 de IV7, 2 de I7, depois V7-IV7-I7-V7, cujos dois últimos compassos (I7-V7) formam o turnaround. Todos os acordes são de sétima da dominante.',
  },
  l7u21m5e2: {
    prompt:
      'Porque é que o acorde I no blues usa qualidade de sétima da dominante (p. ex., C7) em vez de sétima maior?',
    choices: [
      'A sétima baixada pertence ao som do blues mesmo em repouso, por isso C7 mantém Bb acima da terça maior',
      'A sétima baixada obriga I7 a resolver em IV, por isso C7 nunca pode terminar um blues',
      "A sétima baixada transforma a tónica do blues numa tríade menor ao mudar E para Eb",
      "A sétima baixada retira a terça da tónica do blues, por isso C7 consiste em C, G e Bb",
    ],
    hint: 'No blues, a b7 faz parte da escala blues e do som geral do blues. Todos os acordes — I, IV e V — usam qualidade de sétima da dominante. Isto desafia a teoria clássica, onde I7 implicaria uma dominante secundária.',
  },
  l7u21m5e3: {
    prompt:
      'O que é normalmente adicionado ao blues básico de 12 compassos para criar um "jazz blues"?',
    choices: [
      'Turnarounds ii-V, substituições tritónicas e acordes diminutos de passagem',
      'Substituições do blues menor: acordes de sétima menor em I e IV, com bVI7 (Ab7) no lugar de V7',
      'Uma mudança de tonalidade a cada 4 compassos, meio-tom acima de cada vez (C, Db, D…)',
      'Exclusivamente acordes menores ao longo de toda a forma',
    ],
    hint: 'O jazz blues enriquece a forma básica inserindo progressões ii-V (ex: compassos 9-10 tornam-se ii-V em vez de apenas V-IV), adicionando substituições tritónicas e usando turnarounds rápidos ii-V para criar movimento harmónico.',
  },

  // ---- l7u21m6: Rhythm Changes ----

  l7u21m6e1: {
    prompt: 'Qual é a forma dos "rhythm changes" no jazz?',
    choices: [
      "AABA — 32 compassos em quatro secções de 8 compassos",
      "ABAB — 32 compassos em quatro secções de 8 compassos",
      "ABBA — 32 compassos em quatro secções de 8 compassos",
      "ABAC — 32 compassos em quatro secções de 8 compassos",
    ],
    hint: 'Os rhythm changes seguem uma forma AABA de 32 compassos: as secções A usam progressões baseadas em I-vi-ii-V, e a secção B (ponte) usa tipicamente um ciclo de dominantes. Baseados nas mudanças harmónicas de uma famosa peça de Gershwin.',
  },
  l7u21m6e2: {
    prompt:
      'Qual é uma progressão típica de turnaround no final de uma secção A nos rhythm changes?',
    choices: [
      'I–vi–ii–V',
      'ii–V–I–V',
      'IV–I–V–I',
      'I–V–vi–IV',
    ],
    hint: 'O turnaround (I-vi-ii-V) volta para o início da forma. No jazz, o vi é frequentemente substituído por VI7 (uma dominante secundária), e ainda mais enriquecido com substituições tritónicas e acordes de passagem.',
  },
  l7u21m6e3: {
    prompt:
      'Que cadeia de sétimas da dominante é típica na ponte dos rhythm changes em Bb maior?',
    choices: [
      'D7–G7–C7–F7',
      'D7–C7–F7–G7',
      'D7–F7–C7–G7',
      'D7–F7–G7–C7',
    ],
    hint: 'A ponte apresenta tipicamente uma cadeia de sétimas da dominante: III7-VI7-II7-V7 (em Bb: D7-G7-C7-F7). Cada dominante resolve uma quinta abaixo para o seguinte, criando forte impulso para a frente.',
  },

  // =========================================================================
  // Unidade 22: Jazz Avançado, Modal, Pop
  // =========================================================================

  // ---- l7u22m1: Teoria Acorde-Escala ----

  l7u22m1e1: {
    prompt:
      'Constrói D dórico — a escala de acorde para Dm7 numa ii-V-I em C. Seleciona as 7 notas.',
    hint: 'D dórico: D, E, F, G, A, B, C. É o 2.º modo de C maior. A sexta natural (B) distingue-o do menor natural (que tem Bb). Pitch classes: 2, 4, 5, 7, 9, 11, 0.',
  },
  l7u22m1e2: {
    prompt:
      'Constrói G mixolídio — a escala de acorde para G7 numa ii-V-I em C. Seleciona as 7 notas.',
    hint: 'G mixolídio: G, A, B, C, D, E, F. É o 5.º modo de C maior. A b7 (F em vez de F#) define o som dominante. Pitch classes: 7, 9, 11, 0, 2, 4, 5.',
  },
  l7u22m1e3: {
    prompt: 'Qual é o princípio fundamental da teoria acorde-escala?',
    choices: [
      'Ajustar a escala da melodia ao acorde que está a soar',
      'Fixar a escala da melodia pela armação de clave inicial',
      'Construir a escala da melodia com as três fundamentais seguintes',
      'Usar a escala maior sobre cada fundamental, incluindo acordes menores',
    ],
    hint: 'A teoria acorde-escala emparelha cada acorde com uma escala (muitas vezes um modo). Sobre Dm7, toca D dórico; sobre G7, toca G mixolídio; sobre Cmaj7, toca C jónio. A escala muda com cada acorde.',
  },

  // ---- l7u22m2: Estruturas Superiores ----

  l7u22m2e1: {
    prompt: 'Que disposição exemplifica uma tríade de estrutura superior sobre C7?',
    choices: [
      'D–F#–A sobre C–E–Bb',
      'C–E–G sobre C–E–Bb',
      'E–G–Bb sobre C–E–Bb',
      'E–G–B sobre C–E–Bb',
    ],
    hint: 'As estruturas superiores sobrepõem uma tríade simples (ex: D maior) sobre o shell da dominante (fundamental, 3.ª e b7; ex: C, E e Bb), criando extensões complexas. D/C7 resulta em C7 com nona, #11 e décima terceira.',
  },
  l7u22m2e2: {
    prompt: 'O que é rearmonização no jazz?',
    choices: [
      "Dar à mesma melodia outro conjunto de acordes de acompanhamento",
      "Dar aos mesmos acordes outra melodia por cima deles",
      "Mudar a melodia e todos os seus acordes para outra tonalidade",
      "Mudar cada acorde para outra inversão sob a melodia",
    ],
    hint: 'A rearmonização altera o contexto harmónico sob uma melodia. As técnicas incluem substituição tritónica, mudanças de qualidade de acordes, abordagens cromáticas e movimento de estrutura constante.',
  },
  l7u22m2e3: {
    prompt: 'O que é uma linha cromática de baixo na harmonia jazz?',
    choices: [
      'Uma linha de baixo que se move por meios-tons, muitas vezes com inversões, acordes de passagem e substituições tritónicas',
      "Uma linha de baixo que se move por tons inteiros, muitas vezes com inversões, acordes de passagem e substituições tritónicas",
      "Uma linha de baixo que se move por terças menores, muitas vezes com inversões, acordes de passagem e substituições tritónicas",
      "Uma linha de baixo que se move por quintas perfeitas, muitas vezes com inversões, acordes de passagem e substituições tritónicas",
    ],
    hint: 'O movimento cromático do baixo cria condução de vozes suave: ex: C - B - Bb - A (Cmaj7 - B7 ou G/B - Bb7 ou C7/Bb - Am7). Cada acorde é escolhido para suportar uma descida do baixo por meio-tom.',
  },

  // ---- l7u22m3: Mudanças de Coltrane ----

  l7u22m3e1: {
    prompt:
      'Que movimento de centros tonais define as "mudanças de Coltrane" (como em Giant Steps)?',
    choices: [
      "Três pontos de repouso tonal equidistantes, separados por uma terça maior",
      "Quatro pontos de repouso tonal equidistantes, separados por uma terça menor",
      "Dois pontos de repouso tonal equidistantes, separados por um trítono",
      "Seis pontos de repouso tonal equidistantes, separados por um tom",
    ],
    hint: 'As mudanças de Coltrane percorrem três centros tonais a uma terça maior de distância (ex: B, G, Eb). Estas três tonalidades dividem a oitava simetricamente em três segmentos iguais de 4 meios-tons cada.',
  },
  l7u22m3e2: {
    prompt:
      'Nas mudanças de Coltrane, como são tipicamente abordados os centros tonais?',
    choices: [
      'Por um acorde de 7.ª da dominante uma quinta perfeita acima da tónica',
      'Por um acorde de 7.ª da dominante uma terça maior acima da tónica',
      'Por um acorde de 7.ª maior uma quinta perfeita acima da tónica',
      'Por um acorde de 7.ª maior uma terça maior acima da tónica',
    ],
    hint: 'Coltrane prepara cada tónica com a sua dominante: ex: Bmaj7 - D7 - Gmaj7 - Bb7 - Ebmaj7. O D7 é o V7 de G, Bb7 é o V7 de Eb. Isto cria movimento constante dominante-tónica.',
  },
  l7u22m3e3: {
    prompt: 'O que é "estrutura constante" na harmonia jazz?',
    choices: [
      "Manter a mesma forma de acorde ao deslocá-la para fora da tonalidade",
      "Manter a mesma nota no baixo ao mudar os acordes por cima dela",
      "Manter a mesma tonalidade ao mudar as qualidades dos acordes dentro dela",
      "Manter a mesma melodia ao substituir os seus acordes de acompanhamento",
    ],
    hint: 'A estrutura constante move um tipo de acorde fixo (ex: maj7) através de uma sequência de fundamentais (ex: Cmaj7 - Ebmaj7 - Gbmaj7 - Amaj7). A forma do voicing mantém-se idêntica enquanto o padrão de fundamentais cria interesse harmónico.',
  },

  // ---- l7u22m4: Harmonia Modal ----

  l7u22m4e1: {
    prompt:
      'Constrói o modo D dórico. Este modo cria um som menor com uma sexta natural característica.',
    hint: 'D dórico: D, E, F, G, A, B, C. Comparado com D menor natural, o 6.º grau é elevado (B natural em vez de Bb). Pitch classes: 2, 4, 5, 7, 9, 11, 0.',
  },
  l7u22m4e2: {
    prompt:
      'Constrói o modo E frígio. Este modo tem um meio-tom distinto da fundamental até ao 2.º grau.',
    hint: 'O modo E frígio: E, F, G, A, B, C, D. A b2 (F natural, um meio-tom acima de E) dá ao frígio o seu carácter escuro e com sabor espanhol. Pitch classes: 4, 5, 7, 9, 11, 0, 2.',
  },
  l7u22m4e3: {
    prompt:
      'Como difere a harmonia modal da harmonia tonal (funcional)?',
    choices: [
      'A harmonia modal mantém um centro estático e evita a resolução V-I, deixando a cor do modo definir o som',
      'A harmonia modal usa mais acordes do que a harmonia tonal — os sete, um para o modo de cada grau',
      'A harmonia modal usa sempre escalas menores exclusivamente',
      'A harmonia modal assenta na resolução V-I forte, como a tonal, mas usa a cor do próprio modo',
    ],
    hint: 'Na harmonia tonal, os acordes têm funções (tónica, dominante, subdominante) que impulsionam a resolução. Na harmonia modal, um modo colora um vamp ou pedal estático, e as progressões evitam cadências V-I que estabeleceriam uma tonalidade.',
  },

  // ---- l7u22m5: Voicings Quartais/Quintais ----

  l7u22m5e1: {
    prompt: 'O que define um voicing quartal?',
    choices: [
      'Quartas perfeitas empilhadas em vez de terças',
      "Quintas perfeitas empilhadas em vez de terças",
      "Terças maiores empilhadas em vez de quartas",
      "Segundas menores empilhadas em vez de terças",
    ],
    hint: 'A harmonia quartal empilha quartas (ex: C-F-Bb-Eb). Isto cria um som ambíguo e aberto que evita qualidade maior/menor clara. McCoy Tyner popularizou os voicings quartais no jazz modal.',
  },
  l7u22m5e2: {
    prompt: 'Como difere a harmonia quintal da harmonia quartal?',
    choices: [
      'A harmonia quintal empilha quintas perfeitas em vez de quartas, com um som igualmente aberto',
      "A harmonia quintal empilha quartas perfeitas em vez de quintas, com um som igualmente aberto",
      "A harmonia quintal empilha terças maiores em vez de terças menores, com um som igualmente aberto",
      "A harmonia quintal empilha terças menores em vez de quartas perfeitas, com um som igualmente aberto",
    ],
    hint: 'Embora uma quarta invertida seja uma quinta, o som do voicing difere consoante o registo e o espaçamento. Os voicings quintais (ex: C-G-D-A) criam sonoridades amplas e brilhantes. Ambos evitam a harmonia tradicional tercial (baseada em terças).',
  },
  l7u22m5e3: {
    prompt:
      'Que papel desempenham os bordões na harmonia modal e quartal?',
    choices: [
      "Mantêm uma altura no ouvido enquanto as cores por cima dela podem mudar",
      "Costumam marcar subdivisões do tempo sem sustentar um centro de altura estável",
      "Deslocam o centro tonal meio-tom acima sempre que muda o acorde superior",
      "Elevam a sensível ao sustentar a tónica, tornando o modo maior",
    ],
    hint: 'Um bordão (nota de baixo sustida ou quinta aberta) estabelece um centro modal. Sobre um bordão em D, podes explorar livremente D dórico, D mixolídio ou outros modos sem que a harmonia puxe para a resolução.',
  },

  // =========================================================================
  // Unidade 23: Harmonia Pop e Taxonomia
  // =========================================================================

  // ---- l7u23m1: Progressões Pop ----

  l7u23m1e1: {
    prompt:
      'Que progressão é frequentemente chamada o "loop pop de quatro acordes"?',
    choices: [
      'I - V - vi - IV',
      'I - IV - V - I',
      'ii - V - I - vi',
      'I - bVII - IV - I',
    ],
    hint: 'I-V-vi-IV (em C: C-G-Am-F) é uma das progressões pop mais comuns. Repete-se indefinidamente e suporta tanto melodias edificantes como melancólicas dependendo de qual acorde a melodia enfatiza.',
    nudge: 'Toca cada opção em C e ouve. O ciclo usa quatro acordes diferentes, todos da tonalidade, e começa na tónica: que padrão já ouviste em inúmeras canções pop?',
  },
  l7u23m1e2: {
    prompt: 'O que é o sistema de números de Nashville?',
    choices: [
      'Os números indicam à banda o lugar de cada acorde na tonalidade, por isso 4 significa o acorde construído sobre o quarto grau',
      "Os números dizem à banda quantos tempos dura cada acorde, por isso 4 significa quatro tempos",
      "Os números costumam indicar ao guitarrista o trasto a tocar, por isso 1 significa o primeiro trasto em qualquer tonalidade",
      "Os números medem meios-tons acima da tónica, por isso 4 significa o acorde com fundamental uma terça maior acima",
    ],
    hint: 'O sistema de números de Nashville escreve acordes como números de graus da escala (1=I, 4=IV, 5=V). Uma cifra a ler "1-5-6m-4" pode ser tocada em qualquer tonalidade instantaneamente. É usado extensivamente em sessões de estúdio de Nashville.',
  },
  l7u23m1e3: {
    prompt: 'O que é um "loop pop" e porque é eficaz?',
    choices: [
      'Uma progressão curta que se repete e mantém a harmonia estável enquanto a melodia e a letra mudam',
      "Uma melodia curta que se repete e mantém a linha melódica estável enquanto a progressão de acordes muda",
      "Uma progressão curta de acordes que muda a sequência em cada regresso para acompanhar as mudanças da letra",
      "Um padrão curto de baixo que se repete sob progressões de acordes que mudam em vez de se repetirem",
    ],
    hint: 'Os loops pop (como I-V-vi-IV ou vi-IV-I-V) repetem um pequeno padrão harmónico ao longo da música. A harmonia estática permite que a melodia, o ritmo e a produção carreguem o interesse musical, o que se adequa a formas verso/refrão.',
  },

  // ---- l7u23m2: Mistura Modal no Pop ----

  l7u23m2e1: {
    prompt:
      'Quando uma música pop numa tonalidade maior usa um acorde bVII (ex: Bb maior na tonalidade de C), que técnica está a ser usada?',
    choices: [
      'Mistura modal (empréstimo do paralelo menor/modo mixolídio)',
      'Uma modulação para a tonalidade de Bb maior',
      'Um dominante secundário a apontar para o acorde IV',
      'Uma reescrita enarmónica do acorde vii° de C maior, B diminuto, escrito como Bb',
    ],
    hint: 'bVII é emprestado do mixolídio de C ou de C menor natural. Em C maior, Bb não é diatónico, mas emprestá-lo cria um som rock/pop. Isto é mistura modal (também chamada acordes emprestados).',
  },
  l7u23m2e2: {
    prompt:
      'Que efeito emocional cria tipicamente uma relação de mediante cromática (ex: C maior para Ab maior) na música pop?',
    choices: [
      'Uma mudança de cor dramática e cinematográfica — inesperada, mas suave graças a uma nota comum',
      'Uma sensação de regresso a casa, à tónica',
      'Nenhum efeito percetível, porque os dois acordes pertencem à mesma tonalidade e soam parecidos',
      'Um choque dissonante que soa como um erro',
    ],
    hint: 'C maior (C, E, G) e Ab maior (Ab, C, Eb) partilham uma nota comum (C). O E e o Eb estão a meio-tom de distância, criando a mudança de cor suave característica das mediantes cromáticas.',
  },
  l7u23m2e3: {
    prompt:
      'O que é uma modulação direta (ou abrupta) na composição pop?',
    choices: [
      "Mudar para outra tonalidade sem um acorde de ligação",
      "Mudar para outra tonalidade através de um acorde-pivô comum a ambas",
      'Mudar para outra tonalidade gradualmente, através de uma sequência que passa por várias tonalidades',
      'Mudar para outra tonalidade sem acorde-pivô, mas sempre exatamente meio-tom acima',
    ],
    hint: 'A modulação direta (também chamada abrupta ou de frase) simplesmente começa uma nova secção na nova tonalidade sem preparação harmónica. Comum no pop: o último refrão salta um meio-tom ou um tom para mais energia.',
  },

  // ---- l7u23m3: Modos da Menor Melódica ----

  l7u23m3e1: {
    prompt:
      'Constrói a escala de C menor melódica (forma ascendente). Seleciona as 7 notas.',
    hint: 'C menor melódica: C, D, Eb, F, G, A, B. É como C maior com uma b3. A sexta natural (A) e a sétima natural (B) distinguem-na da menor natural e da menor harmónica. Pitch classes: 0, 2, 3, 5, 7, 9, 11.',
  },
  l7u23m3e2: {
    prompt:
      'Constrói a escala alterada de G (7.º modo de Ab menor melódica). Seleciona as 7 notas.',
    hint: 'G alterada (superlócria): G, Ab, Bb, Cb, Db, Eb, F. Todas as notas não essenciais estão alteradas: b9, #9 (=b3), b5 (#11), b13 (#5). Pitch classes: 7, 8, 10, 11, 1, 3, 5.',
  },
  l7u23m3e3: {
    prompt:
      'A escala lídia dominante (4.º modo da menor melódica) é comummente usada sobre que tipo de acorde?',
    choices: [
      'Acordes de sétima da dominante com #11, como substituições tritónicas e dominantes que não resolvem',
      'Acordes m7 numa ii-V-I, porque a escala lídio dominante contém uma terça menor (b3) acima da fundamental',
      'Acordes maj7 com função de tónica',
      'Acordes diminutos de passagem',
    ],
    hint: 'A lídia dominante (ex: C D E F# G A Bb) combina uma #4 (lídia) com uma b7 (dominante). Encaixa em acordes dominantes 7(#11) e é a escala de referência para acordes de substituição tritónica.',
  },

  // ---- l7u23m4: Menor Harmónica/Simétricas/Mundo ----

  l7u23m4e1: {
    prompt:
      'Constrói a escala de C tons inteiros. Esta escala simétrica de 6 notas tem intervalos de tom iguais ao longo de toda a escala.',
    hint: 'C tons inteiros: C, D, E, F#, G#, A#. Cada intervalo é um tom (2 meios-tons). Existem apenas duas escalas de tons inteiros únicas (a outra começa em Db). Pitch classes: 0, 2, 4, 6, 8, 10.',
  },
  l7u23m4e2: {
    prompt:
      'Constrói a escala diminuta meio-tom/tom de C. Esta escala simétrica de 8 notas alterna meios-tons e tons.',
    hint: 'C diminuta meio-tom/tom: C, Db, Eb, E, F#, G, A, Bb. Alterna meio-tom, tom ao longo de toda a escala. Existem apenas três escalas diminutas distintas. Pitch classes: 0, 1, 3, 4, 6, 7, 9, 10.',
  },
  l7u23m4e3: {
    prompt: 'Qual é a propriedade definidora de uma escala simétrica?',
    choices: [
      "Um padrão repetido de distâncias reparte a oitava em partes iguais",
      "Um padrão repetido de distâncias produz doze transposições distintas",
      "Um padrão repetido de distâncias exige sete notas por oitava",
      "Um padrão repetido de distâncias precisa de duas oitavas para se repetir",
    ],
    hint: 'As escalas simétricas repetem um padrão fixo de intervalos (T = tom; mT = meio-tom; ex: tons inteiros = T-T-T-T-T-T; diminuta = mT-T-mT-T-mT-T-mT-T). Esta simetria significa que têm menos transposições únicas do que as escalas assimétricas.',
  },

  // ---- l7u23m5: Taxonomia Completa de Acordes ----

  l7u23m5e1: {
    prompt:
      'Quantos tipos básicos de tríade existem na teoria musical ocidental?',
    choices: [
      '4 — maior, menor, diminuta e aumentada',
      '2 — apenas maior e menor',
      '3 — maior, menor e diminuta',
      '7 — um tipo de tríade para cada grau da escala',
    ],
    hint: 'Existem exatamente 4 tipos de tríade, definidos pela terça e pela quinta: maior (3M + 5P), menor (3m + 5P), diminuta (3m + 5.ª diminuta) e aumentada (3M + 5.ª aumentada). Todas as outras designações triádicas são variantes destas quatro.',
  },
  l7u23m5e2: {
    prompt: 'O que faz de um acorde um acorde "com extensões"?',
    choices: [
      'Tem notas além da sétima (nona, décima primeira ou décima terceira), empilhando mais terças',
      "Tem notas acrescentadas acima de uma tríade (sexta, nona ou ambas), sem incluir uma sétima",
      "Tem substituições da terça (segunda ou quarta), formando uma suspensão dentro do acorde",
      "Tem duplicações de notas do acorde à oitava (fundamental, terça, quinta ou sétima), sem acrescentar classes de altura",
    ],
    hint: 'Os acordes com extensões continuam o princípio tercial (empilhamento de terças) além da sétima: nona = oitava + segunda, décima primeira = oitava + quarta, décima terceira = oitava + sexta. Um acorde de décima terceira contém teoricamente todos os 7 graus da escala.',
  },
  l7u23m5e3: {
    prompt:
      'Que agrupamento organiza corretamente as principais famílias de qualidade de acordes?',
    choices: [
      'Maior, menor, dominante, diminuta e aumentada, cada uma com as suas formas de sétima e com extensões',
      'Tríades, sétimas, nonas, décimas primeiras e décimas terceiras, cada uma com as suas qualidades',
      'Tónica, pré-dominante, dominante, substituto da tónica e substituto da dominante, cada um com as suas disposições',
      'Acordes diatónicos, emprestados, secundários, de mediante cromática e enarmónicos, cada um com as suas origens',
    ],
    hint: 'As famílias de acordes distinguem-se pelos seus intervalos essenciais: maior tem 3.ª maior e 5.ª perfeita (7.ª maior em maj7); sétima da dominante tem 3.ª maior e 7.ª menor; menor tem 3.ª menor e 5.ª perfeita; diminuta tem 3.ª menor e 5.ª diminuta; aumentada tem 3.ª maior e 5.ª aumentada. Os acordes de sétima e as extensões expandem estas famílias.',
  },
};

export default overlay;
