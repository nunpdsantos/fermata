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
      'Um acorde dominante com quintas e nonas alteradas (b5/#5, b9/#9)',
      'Um voicing alternativo de um acorde dominante padrão',
      'Um acorde que alterna entre qualidade maior e menor',
      'Um acorde que pode ser substituído por qualquer outro',
    ],
    hint: 'O sufixo "alt" significa que o acorde tem extensões alteradas: b9, #9, b5 (ou #11) e #5 (ou b13). Emparelha-se com a escala alterada (superlócria).',
  },

  // ---- l7u21m2: Voicings de Shell ----

  l7u21m2e1: {
    prompt: 'Um voicing de shell tipicamente contém que notas do acorde?',
    choices: [
      'Apenas fundamental, terça e sétima — omitindo a quinta e as extensões',
      'Fundamental, quinta e oitava — omitindo a terça e a sétima',
      'Todas as sete notas da escala-mãe',
      'Apenas fundamental e quinta — um voicing de power chord',
    ],
    hint: 'Os voicings de shell reduzem o acorde ao essencial: a fundamental define o baixo, a terça determina a qualidade maior/menor e a sétima determina o tipo de acorde (maj7, dom7, m7). A quinta é redundante.',
  },
  l7u21m2e2: {
    prompt:
      'Qual é a característica definidora de um acorde dominante alterado?',
    choices: [
      'Tem uma sétima dominante com uma ou mais quintas ou nonas cromaticamente alteradas',
      'Substitui a terça por uma quarta suspensa',
      'Usa apenas notas da escala de tons inteiros',
      'Omite a fundamental inteiramente',
    ],
    hint: 'Um acorde dominante alterado mantém a fundamental, terça e b7, mas altera cromaticamente a quinta (b5 ou #5) e a nona (b9 ou #9), criando tensão máxima antes da resolução.',
  },
  l7u21m2e3: {
    prompt:
      'Na harmonia jazz, qual é a função típica de um acorde sus4 (ex: G7sus4)?',
    choices: [
      'Atrasa a resolução substituindo a terça por uma quarta, criando antecipação antes do V7',
      'Funciona sempre como acorde de tónica',
      'Atua como substituto do acorde ii',
      'É usado exclusivamente no jazz modal',
    ],
    hint: 'Um acorde sus4 substitui a terça por uma quarta, removendo a qualidade maior/menor. No jazz, G7sus4 precede frequentemente G7 numa resolução V7sus4 para V7 para I, atrasando a sensível.',
  },

  // ---- l7u21m3: Progressão ii-V-I ----

  l7u21m3e1: {
    prompt:
      'Constrói o acorde ii7 em Dó maior (Dm7). Seleciona as 4 notas: D, F, A, C.',
    hint: 'Dm7 = D, F, A, C. Fundamental (D), terça menor (F), quinta perfeita (A), sétima menor (C). Pitch classes: 2, 5, 9, 0.',
  },
  l7u21m3e2: {
    prompt:
      'Constrói o acorde V7 em Dó maior (G7). Seleciona as 4 notas: G, B, D, F.',
    hint: 'G7 = G, B, D, F. Fundamental (G), terça maior (B), quinta perfeita (D), sétima menor (F). Pitch classes: 7, 11, 2, 5.',
  },
  l7u21m3e3: {
    prompt: 'Por que é a ii-V-I a progressão mais importante no jazz?',
    choices: [
      'Combina as funções de subdominante, dominante e tónica no movimento cadencial mais forte possível',
      'Foi inventada por Duke Ellington e tornou-se um padrão do jazz',
      'Usa apenas três notas no total entre os três acordes',
      'Evita qualquer dissonância, facilitando a improvisação',
    ],
    hint: 'A ii-V-I encapsula o movimento harmónico completo: preparação (ii), tensão (V), resolução (I). Quase todos os standards de jazz contêm múltiplas progressões ii-V-I em várias tonalidades.',
  },

  // ---- l7u21m4: Substituição Tritónica ----

  l7u21m4e1: {
    prompt:
      'Constrói a substituição tritónica de G7: Db7. Seleciona as 4 notas: Db, F, Ab, Cb.',
    hint: 'Db7 = Db, F, Ab, Cb. A substituição tritónica partilha o mesmo intervalo de trítono (F-Cb enarmónico de F-B) do acorde G7 original. Pitch classes: 1, 5, 8, 11.',
  },
  l7u21m4e2: {
    prompt: 'Qual é o princípio por detrás da substituição tritónica?',
    choices: [
      'Dois acordes de sétima dominante a um trítono de distância partilham a mesma terça e sétima (enarmonicamente), por isso um pode substituir o outro',
      'Qualquer acorde pode ser substituído pelo acorde a um trítono de distância independentemente da qualidade',
      'A substituição tritónica move sempre a fundamental um tom acima',
      'Substitui o acorde V pelo acorde IV',
    ],
    hint: 'G7 tem B e F como terça e sétima. Db7 tem F e Cb (=B) como terça e sétima. Os guide tones são idênticos (enarmonicamente), por isso Db7 pode resolver para C tal como G7.',
  },
  l7u21m4e3: {
    prompt: 'Na progressão Dm7 - Db7 - Cmaj7, o que é o acorde Db7?',
    choices: [
      'Uma substituição tritónica de G7, criando uma linha cromática de baixo (D - Db - C)',
      'Um acorde emprestado de Réb maior',
      'O acorde napolitano em primeira inversão',
      'Um acorde diminuto de passagem reescrito enarmonicamente',
    ],
    hint: 'Db7 substitui G7 (o V7). O baixo desce cromaticamente: D (ii) - Db (sub tritónica do V) - C (I). Esta condução de vozes suave é um dos principais benefícios das substituições tritónicas.',
  },

  // ---- l7u21m5: Formas de Blues ----

  l7u21m5e1: {
    prompt:
      'Qual é a progressão padrão para um blues básico de 12 compassos na tonalidade de Dó?',
    choices: [
      'I7-I7-I7-I7 | IV7-IV7-I7-I7 | V7-IV7-I7-V7 (forma C7-F7-G7)',
      'I-IV-V-I | I-IV-V-I | I-IV-V-I (três acordes simples repetidos)',
      'ii-V-I-vi | ii-V-I-vi | ii-V-I-vi (turnaround jazz repetido)',
      'I-V-vi-IV | I-V-vi-IV | I-V-vi-IV (loop pop repetido)',
    ],
    hint: 'O blues de 12 compassos segue um padrão específico ao longo de 12 compassos: 4 compassos de I7, 2 de IV7, 2 de I7, depois V7-IV7-I7-V7 (turnaround). Todos os acordes são de sétima dominante.',
  },
  l7u21m5e2: {
    prompt:
      'Por que é que o acorde I no blues usa qualidade de sétima dominante (ex: C7) em vez de sétima maior?',
    choices: [
      'A tonalidade blues usa a b7 como blue note; a sétima dominante em todos os acordes é uma característica definidora do estilo',
      'Porque os músicos de blues não conheciam os acordes de sétima maior',
      'A sétima dominante é mais fácil de tocar na guitarra',
      'É uma convenção notacional que não afeta o som',
    ],
    hint: 'No blues, a b7 faz parte da escala blues e do som geral do blues. Todos os acordes — I, IV e V — usam qualidade de sétima dominante. Isto desafia a teoria clássica, onde I7 implicaria um dominante secundário.',
  },
  l7u21m5e3: {
    prompt:
      'O que é normalmente adicionado ao blues básico de 12 compassos para criar um "jazz blues"?',
    choices: [
      'Turnarounds ii-V, substituições tritónicas e acordes diminutos de passagem',
      'Apenas acordes de sétima maior substituem todas as sétimas dominantes',
      'Uma mudança de tonalidade a cada 4 compassos',
      'Exclusivamente acordes menores ao longo de toda a forma',
    ],
    hint: 'O jazz blues enriquece a forma básica inserindo progressões ii-V (ex: compassos 9-10 tornam-se ii-V em vez de apenas V-IV), adicionando substituições tritónicas e usando turnarounds rápidos ii-V para criar movimento harmónico.',
  },

  // ---- l7u21m6: Rhythm Changes ----

  l7u21m6e1: {
    prompt: 'Qual é a forma dos "rhythm changes" no jazz?',
    choices: [
      'AABA — 32 compassos com uma ponte de 8 compassos',
      'ABAB — secções alternadas de 8 compassos',
      'Blues de 12 compassos repetido com variações',
      'Forma contínua sem secções repetidas',
    ],
    hint: 'Os rhythm changes seguem uma forma AABA de 32 compassos: as secções A usam progressões baseadas em I-vi-ii-V, e a secção B (ponte) usa tipicamente um ciclo de dominantes. Baseado nas mudanças harmónicas de uma famosa peça de Gershwin.',
  },
  l7u21m6e2: {
    prompt:
      'Qual é uma progressão típica de turnaround no final de uma secção A nos rhythm changes?',
    choices: [
      'I - vi - ii - V (ou I - VI7 - ii - V7)',
      'IV - V - I - I',
      'I - IV - I - V',
      'vi - IV - I - V',
    ],
    hint: 'O turnaround (I-vi-ii-V) recicla para o início da forma. No jazz, o vi é frequentemente substituído por VI7 (um dominante secundário), e ainda mais enriquecido com substituições tritónicas e acordes de passagem.',
  },
  l7u21m6e3: {
    prompt:
      'Que dispositivo harmónico é comummente usado na ponte dos rhythm changes?',
    choices: [
      'Um ciclo de acordes de sétima dominante a descer por tons ou a mover-se pelo ciclo de quintas',
      'Uma nota pedal sustida sem mudanças de acordes',
      'Uma repetição exata da secção A noutra tonalidade',
      'Uma série dodecafónica',
    ],
    hint: 'A ponte apresenta tipicamente uma cadeia de sétimas dominantes: III7-VI7-II7-V7 (em Sib: D7-G7-C7-F7). Cada dominante resolve uma quinta abaixo para o seguinte, criando forte impulso para a frente.',
  },

  // =========================================================================
  // Unidade 22: Jazz Avançado, Modal, Pop
  // =========================================================================

  // ---- l7u22m1: Teoria Acorde-Escala ----

  l7u22m1e1: {
    prompt:
      'Constrói Ré dórico — a escala de acorde para Dm7 numa ii-V-I em Dó. Seleciona as 7 notas.',
    hint: 'Ré dórico: D, E, F, G, A, B, C. É o 2.o modo de Dó maior. A sexta natural (B) distingue-o do menor natural (que tem Bb). Pitch classes: 2, 4, 5, 7, 9, 11, 0.',
  },
  l7u22m1e2: {
    prompt:
      'Constrói Sol mixolídio — a escala de acorde para G7 numa ii-V-I em Dó. Seleciona as 7 notas.',
    hint: 'Sol mixolídio: G, A, B, C, D, E, F. É o 5.o modo de Dó maior. A b7 (F em vez de F#) define o som dominante. Pitch classes: 7, 9, 11, 0, 2, 4, 5.',
  },
  l7u22m1e3: {
    prompt: 'Qual é o princípio fundamental da teoria acorde-escala?',
    choices: [
      'Cada acorde numa progressão tem uma escala correspondente cujas notas estão todas disponíveis para melodia e improvisação',
      'Cada acorde só pode usar notas de uma escala fixa ao longo de toda a peça',
      'As escalas constroem-se empilhando acordes uns sobre os outros',
      'A teoria acorde-escala aplica-se apenas a tonalidades maiores',
    ],
    hint: 'A teoria acorde-escala emparelha cada acorde com uma escala-mãe. Sobre Dm7, toca Ré dórico; sobre G7, toca Sol mixolídio; sobre Cmaj7, toca Dó jónio. A escala muda com cada acorde.',
  },

  // ---- l7u22m2: Estruturas Superiores ----

  l7u22m2e1: {
    prompt: 'O que é uma tríade de estrutura superior nos voicings de jazz?',
    choices: [
      'Uma tríade tocada no registo agudo sobre uma fundamental e sétima diferentes no baixo, produzindo extensões e alterações',
      'As três notas superiores de qualquer acorde de sétima',
      'Uma tríade tocada uma oitava acima do escrito',
      'Uma técnica de análise estrutural para identificar formas',
    ],
    hint: 'As estruturas superiores sobrepõem uma tríade simples (ex: Ré maior) sobre uma nota de baixo e sétima (ex: C e Bb), criando extensões complexas. D/C7 resulta em C7 com nona, #11 e décima terceira.',
  },
  l7u22m2e2: {
    prompt: 'O que é rearmonização no jazz?',
    choices: [
      'Substituir os acordes originais de uma melodia por acordes diferentes que continuam a suportar as notas melódicas',
      'Tocar os mesmos acordes mas noutra tonalidade',
      'Adicionar vozes harmónicas a uma melodia a solo',
      'Remover todos os acordes e tocar a melodia sem acompanhamento',
    ],
    hint: 'A rearmonização altera o contexto harmónico sob uma melodia. As técnicas incluem substituição tritónica, mudanças de qualidade de acordes, abordagens cromáticas e movimento de estrutura constante.',
  },
  l7u22m2e3: {
    prompt: 'O que é uma linha cromática de baixo na harmonia jazz?',
    choices: [
      'Uma linha de baixo que se move por meios-tons, frequentemente conseguida através de inversões, acordes de passagem e substituições tritónicas',
      'Uma linha de baixo que usa apenas a escala cromática de 12 notas sem repetição',
      'Uma linha de baixo que toca apenas nas notas cromáticas (teclas pretas)',
      'Uma linha de baixo que se move em movimento contrário à melodia',
    ],
    hint: 'O movimento cromático do baixo cria condução de vozes suave: ex: C - B - Bb - A (Cmaj7 - B7 ou G/B - Bb7 ou C7/Bb - Am7). Cada acorde é escolhido para suportar uma descida do baixo por meio-tom.',
  },

  // ---- l7u22m3: Mudanças de Coltrane ----

  l7u22m3e1: {
    prompt:
      'Que movimento de centros tonais define as "mudanças de Coltrane" (como em Giant Steps)?',
    choices: [
      'Centros tonais a moverem-se por terças maiores, dividindo a oitava em três partes iguais',
      'Centros tonais a moverem-se por segundas menores cromaticamente',
      'Centros tonais a moverem-se por quintas perfeitas ao longo do ciclo',
      'Centros tonais a alternarem entre duas tonalidades a um trítono de distância',
    ],
    hint: 'As mudanças de Coltrane percorrem três centros tonais a uma terça maior de distância (ex: Si, Sol, Mib). Estas três tonalidades dividem a oitava simetricamente em três segmentos iguais de 4 semitons cada.',
  },
  l7u22m3e2: {
    prompt:
      'Nas mudanças de Coltrane, como são tipicamente abordados os centros tonais?',
    choices: [
      'Cada centro tonal é precedido pelo seu próprio acorde V7, criando movimento rápido ii-V ou V-I',
      'Os centros tonais são ligados apenas por acordes diminutos de passagem',
      'Modulação direta sem qualquer preparação',
      'Cada tonalidade é abordada por uma cadência de engano a partir da tonalidade anterior',
    ],
    hint: 'Coltrane prepara cada tónica com o seu dominante: ex: Bmaj7 - D7 - Gmaj7 - Bb7 - Ebmaj7. O D7 é o V7 de Sol, Bb7 é o V7 de Mib. Isto cria movimento constante dominante-tónica.',
  },
  l7u22m3e3: {
    prompt: 'O que é "estrutura constante" na harmonia jazz?',
    choices: [
      'Mover a mesma qualidade de acorde em paralelo através de um padrão de fundamentais não diatónico, mantendo a forma do voicing',
      'Usar o mesmo acorde durante uma música inteira',
      'Um método de análise estrutural para identificar motivos melódicos',
      'Construir todos os acordes a partir das mesmas quatro notas',
    ],
    hint: 'A estrutura constante move um tipo de acorde fixo (ex: maj7) através de uma sequência de fundamentais (ex: Cmaj7 - Ebmaj7 - Gbmaj7 - Amaj7). A forma do voicing mantém-se idêntica enquanto o padrão de fundamentais cria interesse harmónico.',
  },

  // ---- l7u22m4: Harmonia Modal ----

  l7u22m4e1: {
    prompt:
      'Constrói o modo Ré dórico. Este modo cria um som menor com uma sexta natural característica.',
    hint: 'Ré dórico: D, E, F, G, A, B, C. Comparado com Ré menor natural, o 6.o grau é elevado (Si natural em vez de Sib). Pitch classes: 2, 4, 5, 7, 9, 11, 0.',
  },
  l7u22m4e2: {
    prompt:
      'Constrói o modo Mi frígio. Este modo tem um meio-tom distinto da fundamental até ao 2.o grau.',
    hint: 'Mi frígio: E, F, G, A, B, C, D. A b2 (Fá natural, um meio-tom acima de Mi) dá ao frígio o seu carácter escuro e com sabor espanhol. Pitch classes: 4, 5, 7, 9, 11, 0, 2.',
  },
  l7u22m4e3: {
    prompt:
      'Como difere a harmonia modal da harmonia tonal (funcional)?',
    choices: [
      'A harmonia modal enfatiza um centro tonal estático e evita resolução dominante-tónica, deixando a cor do modo definir o som',
      'A harmonia modal usa mais acordes do que a harmonia tonal',
      'A harmonia modal usa sempre escalas menores exclusivamente',
      'Não há diferença funcional; são termos intercambiáveis',
    ],
    hint: 'Na harmonia tonal, os acordes têm funções (tónica, dominante, subdominante) que impulsionam a resolução. Na harmonia modal, um modo colora um vamp ou pedal estático, e as progressões evitam cadências V-I que estabeleceriam uma tonalidade.',
  },

  // ---- l7u22m5: Voicings Quartais/Quintais ----

  l7u22m5e1: {
    prompt: 'O que define um voicing quartal?',
    choices: [
      'Notas empilhadas em intervalos de quartas perfeitas em vez de terças',
      'Um voicing que usa quatro notas de um acorde de sétima',
      'Um acorde tocado em quatro oitavas simultaneamente',
      'Uma técnica de voicing exclusiva de quartetos de cordas',
    ],
    hint: 'A harmonia quartal empilha quartas (ex: C-F-Bb-Eb). Isto cria um som ambíguo e aberto que evita qualidade maior/menor clara. McCoy Tyner popularizou os voicings quartais no jazz modal.',
  },
  l7u22m5e2: {
    prompt: 'Como difere a harmonia quintal da harmonia quartal?',
    choices: [
      'A harmonia quintal empilha quintas perfeitas em vez de quartas, produzindo um som igualmente aberto mas ligeiramente diferente',
      'Quintal usa cinco notas enquanto quartal usa quatro',
      'Quintal é usada no pop enquanto quartal é usada no jazz',
      'São idênticas já que uma quarta invertida é uma quinta',
    ],
    hint: 'Embora uma quarta invertida seja uma quinta, o som do voicing difere consoante o registo e o espaçamento. Os voicings quintais (ex: C-G-D-A) criam sonoridades amplas e brilhantes. Ambos evitam a harmonia tradicional tercial (baseada em terças).',
  },
  l7u22m5e3: {
    prompt:
      'Que papel desempenham os pedais na harmonia modal e quartal?',
    choices: [
      'Ancoram o centro tonal, permitindo que as cores modais se desenvolvam sem progressões de acordes funcionais',
      'Fornecem subdivisão rítmica para o ensemble',
      'São usados apenas na música clássica indiana, não no jazz',
      'Criam função dominante ao sustentar a quinta da tonalidade',
    ],
    hint: 'Um pedal (nota de baixo sustida ou quinta aberta) estabelece um centro modal. Sobre um pedal de Ré, podes explorar livremente Ré dórico, Ré mixolídio ou outros modos sem que a harmonia puxe para a resolução.',
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
    hint: 'I-V-vi-IV (em Dó: C-G-Am-F) é uma das progressões pop mais comuns. Repete-se indefinidamente e suporta tanto melodias edificantes como melancólicas dependendo de qual acorde a melodia enfatiza.',
  },
  l7u23m1e2: {
    prompt: 'O que é o sistema de números de Nashville?',
    choices: [
      'Uma notação abreviada que usa números arábicos (1-7) para graus da escala, permitindo transposição instantânea para qualquer tonalidade',
      'Um método de contar compassos em gravações de música country',
      'Um sistema de afinação desenvolvido em estúdios de gravação de Nashville',
      'Um sistema de notação rítmica para bateristas de sessão',
    ],
    hint: 'O sistema de números de Nashville escreve acordes como números de graus da escala (1=I, 4=IV, 5=V). Uma cifra a ler "1-5-6m-4" pode ser tocada em qualquer tonalidade instantaneamente. É usado extensivamente em sessões de estúdio de Nashville.',
  },
  l7u23m1e3: {
    prompt: 'O que é um "loop pop" e por que é eficaz?',
    choices: [
      'Uma progressão curta de acordes que se repete (normalmente 4 compassos) que fornece continuidade harmónica enquanto a melodia e a letra evoluem',
      'Um loop de áudio digital amostrado de um êxito existente',
      'Uma técnica de produção específica que repete a melodia do refrão',
      'Um riff de baixo que percorre todas as 12 notas',
    ],
    hint: 'Os loops pop (como I-V-vi-IV ou vi-IV-I-V) repetem um pequeno padrão harmónico ao longo da música. A harmonia estática permite que a melodia, o ritmo e a produção carreguem o interesse musical, o que se adequa a formas verso/refrão.',
  },

  // ---- l7u23m2: Mistura Modal no Pop ----

  l7u23m2e1: {
    prompt:
      'Quando uma música pop numa tonalidade maior usa um acorde bVII (ex: Sib maior na tonalidade de Dó), que técnica está a ser usada?',
    choices: [
      'Mistura modal (empréstimo do paralelo menor/modo mixolídio)',
      'Uma modulação para a tonalidade de Sib maior',
      'Um dominante secundário a apontar para o acorde IV',
      'Uma reescrita enarmónica do acorde vii diminuto',
    ],
    hint: 'bVII é emprestado do mixolídio de Dó ou de Dó menor natural. Em Dó maior, Sib não é diatónico, mas emprestá-lo cria um som rock/pop. Isto é mistura modal (também chamada acordes emprestados).',
  },
  l7u23m2e2: {
    prompt:
      'Que efeito emocional cria tipicamente uma relação de mediante cromática (ex: Dó maior para Láb maior) na música pop?',
    choices: [
      'Uma mudança dramática e cinemática de cor — inesperada mas suave devido a notas partilhadas ou proximamente relacionadas',
      'Uma sensação de regresso a casa, à tónica',
      'Nenhum efeito notável já que os acordes são proximamente relacionados',
      'Um choque dissonante que soa como um erro',
    ],
    hint: 'As mediantes cromáticas partilham uma nota comum (Dó maior e Láb maior partilham Dó e estão na fronteira Mib/Mi). A fundamental move-se uma terça mas a mudança de qualidade cria uma alteração de cor rica e inesperada, frequentemente ouvida em bandas sonoras e momentos pop dramáticos.',
  },
  l7u23m2e3: {
    prompt:
      'O que é uma modulação direta (ou abrupta) na composição pop?',
    choices: [
      'Mudar de tonalidade sem acorde pivot ou preparação — a nova tonalidade simplesmente começa',
      'Uma mudança gradual de tonalidade que demora vários compassos a completar',
      'Uma modulação que sobe sempre um meio-tom',
      'Usar uma ii-V-I para fazer a transição suave entre tonalidades',
    ],
    hint: 'A modulação direta (também chamada abrupta ou de frase) simplesmente começa uma nova secção na nova tonalidade sem preparação harmónica. Comum no pop: o último refrão salta um meio-tom ou um tom para mais energia.',
  },

  // ---- l7u23m3: Modos da Menor Melódica ----

  l7u23m3e1: {
    prompt:
      'Constrói a escala de Dó menor melódica (forma ascendente). Seleciona as 7 notas.',
    hint: 'Dó menor melódica: C, D, Eb, F, G, A, B. É como Dó maior com uma b3. A sexta natural (A) e a sétima natural (B) distinguem-na da menor natural e da menor harmónica. Pitch classes: 0, 2, 3, 5, 7, 9, 11.',
  },
  l7u23m3e2: {
    prompt:
      'Constrói a escala alterada de Sol (7.o modo de Láb menor melódica). Seleciona as 7 notas.',
    hint: 'Sol alterada (superlócria): G, Ab, Bb, Cb, Db, Eb, F. Todas as notas não essenciais estão alteradas: b9, #9 (=b3), b5 (#11), b13 (#5). Pitch classes: 7, 8, 10, 11, 1, 3, 5.',
  },
  l7u23m3e3: {
    prompt:
      'A escala lídia dominante (4.o modo da menor melódica) é comummente usada sobre que tipo de acorde?',
    choices: [
      'Acordes de sétima dominante com #11, especialmente substituições tritónicas e dominantes não resolutivos',
      'Acordes m7 numa ii-V-I',
      'Acordes maj7 com função de tónica',
      'Acordes diminutos de passagem',
    ],
    hint: 'A lídia dominante (ex: C D E F# G A Bb) combina uma #4 (lídia) com uma b7 (dominante). Encaixa em acordes dominantes 7(#11) e é a escala de referência para acordes de substituição tritónica.',
  },

  // ---- l7u23m4: Menor Harmónica/Simétricas/Mundo ----

  l7u23m4e1: {
    prompt:
      'Constrói a escala de Dó tons inteiros. Esta escala simétrica de 6 notas tem intervalos de tom iguais ao longo de toda a escala.',
    hint: 'Dó tons inteiros: C, D, E, F#, G#, A#. Cada intervalo é um tom (2 semitons). Existem apenas duas escalas de tons inteiros únicas (a outra começa em Db). Pitch classes: 0, 2, 4, 6, 8, 10.',
  },
  l7u23m4e2: {
    prompt:
      'Constrói a escala diminuta meio-tom/tom de Dó. Esta escala simétrica de 8 notas alterna meios-tons e tons.',
    hint: 'Dó diminuta meio-tom/tom: C, Db, Eb, E, F#, G, A, Bb. Alterna meio-tom, tom ao longo de toda a escala. Existem apenas três escalas diminutas distintas. Pitch classes: 0, 1, 3, 4, 6, 7, 9, 10.',
  },
  l7u23m4e3: {
    prompt: 'Qual é a propriedade definidora de uma escala simétrica?',
    choices: [
      'Divide a oitava em segmentos iguais usando um padrão de intervalos repetitivo, produzindo transposições limitadas',
      'Tem a mesma forma ascendente e descendente',
      'Contém exatamente 7 notas como as escalas diatónicas',
      'Soa igual tocada de frente para trás ou de trás para a frente',
    ],
    hint: 'As escalas simétricas repetem um padrão fixo de intervalos (ex: tons inteiros = T-T-T-T-T-T; diminuta = mT-T-mT-T-mT-T-mT-T). Esta simetria significa que têm menos transposições únicas do que as escalas assimétricas.',
  },

  // ---- l7u23m5: Taxonomia Completa de Acordes ----

  l7u23m5e1: {
    prompt:
      'Quantos tipos básicos de tríade existem na teoria musical ocidental?',
    choices: [
      '4 — maior, menor, diminuta e aumentada',
      '2 — apenas maior e menor',
      '3 — maior, menor e diminuta',
      '7 — uma para cada grau da escala',
    ],
    hint: 'Existem exatamente 4 tipos de tríade, definidos pela terça e pela quinta: maior (3.aM+5.aP), menor (3.am+5.aP), diminuta (3.am+5.adim) e aumentada (3.aM+5.aaum). Todas as outras designações triádicas são variantes destas quatro.',
  },
  l7u23m5e2: {
    prompt: 'O que faz de um acorde um acorde "com extensões"?',
    choices: [
      'Inclui notas além da sétima — a nona, décima primeira ou décima terceira — construídas continuando a empilhar terças',
      'Usa mais de 4 notas de qualquer fonte',
      'Abrange mais de uma oitava no instrumento',
      'Acrescenta notas cromáticas não encontradas na escala-mãe',
    ],
    hint: 'Os acordes com extensões continuam o princípio tercial (empilhamento de terças) além da sétima: nona = oitava + segunda, décima primeira = oitava + quarta, décima terceira = oitava + sexta. Um acorde de décima terceira contém teoricamente todos os 7 graus da escala.',
  },
  l7u23m5e3: {
    prompt:
      'Que agrupamento organiza corretamente as principais famílias de qualidade de acordes?',
    choices: [
      'Família maior (maj, maj7, maj9), família menor (m, m7, m9), família dominante (7, 9, 13), família diminuta (dim, dim7), família aumentada (aug, aug7)',
      'Acordes consonantes (maior, menor) e acordes dissonantes (todos os acordes de sétima e além)',
      'Família diatónica (I, ii, iii, IV, V, vi) e família cromática (tudo o resto)',
      'Acordes simples (tríades) e acordes complexos (tudo com mais de 3 notas)',
    ],
    hint: 'As famílias de qualidade de acorde agrupam acordes pelo seu som essencial: a família maior tem terça maior e sétima maior; a família dominante tem terça maior e sétima menor; a família menor tem terça menor. As extensões expandem cada família.',
  },
};

export default overlay;
