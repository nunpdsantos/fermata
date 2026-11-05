import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese translations for Level 5 hand-authored exercises
// Note names (C, D, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidade 15: Dominantes Secundárias e Tonicização
  // =========================================================================

  // ---- l5u15m1: Dominantes Secundárias V/V ----

  l5u15m1e1: {
    prompt:
      'Constrói V/V em C maior. Seleciona as 3 notas.',
    hint: 'V/V em C significa "o acorde V de G maior". A dominante de G é D maior: D (2), F# (6), A (9). O F# é cromático — não pertence a C maior.',
  },
  l5u15m1e2: {
    prompt:
      'Constrói V7/V em C maior. Seleciona as 4 notas.',
    hint: 'V7/V em C = D7: D (2), F# (6), A (9), C (0). A sétima menor acrescentada (C) reforça a atração para G. O F# é a alteração cromática.',
  },
  l5u15m1e3: {
    prompt: 'O que é V/V?',
    choices: [
      "O acorde que faz a dominante soar brevemente como uma tónica local",
      "O acorde que faz a subdominante soar brevemente como uma tónica local",
      "O acorde que faz a supertónica soar brevemente como uma tónica local",
      "O acorde que faz a sobredominante soar brevemente como uma tónica local",
    ],
    hint: 'V/V significa "a dominante da dominante". Em C maior, V é G. A dominante de G é D maior. Portanto V/V em C = D maior, um acorde cromático que toniciza temporariamente G.',
  },

  // ---- l5u15m2: Dominantes Secundárias de ii, iii, IV, vi ----

  l5u15m2e1: {
    prompt: "Constrói V/ii em C maior. Seleciona as 3 notas.",

    hint: 'Em C maior, ii é D menor. A dominante de D menor é A maior (A, C#, E). O C# é a nota cromática que cria a sensível de D.',
  },
  l5u15m2e2: {
    prompt: "Constrói V/IV em C maior. Seleciona as 3 notas.",

    hint: 'V/IV significa a dominante de IV. Em C maior, IV é F. A dominante de F é C maior. Isto é invulgar porque C maior já é a tónica — o contexto determina se funciona como I ou V/IV.',
  },
  l5u15m2e3: {
    prompt: 'O que define uma dominante aplicada (secundária)?',
    choices: [
      'Uma tríade maior ou acorde de sétima da dominante que resolve para um acorde diatónico diferente de I, funcionando sempre como V desse acorde',
      'Uma tríade maior ou acorde de sétima da dominante que resolve para I, funcionando sempre como V da tónica original',
      'Uma tríade maior ou sétima da dominante que estabelece uma nova tonalidade de modo permanente, confirmada por uma cadência',
      'Uma tríade menor ou acorde de sétima menor que resolve para I, funcionando sempre como V da tónica original',
    ],
    hint: 'Uma dominante aplicada funciona temporariamente como V (ou V7) de um acorde diatónico. Introduz notas cromáticas para criar uma resolução de sensível para o seu alvo, sem estabelecer uma nova tonalidade.',
  },

  // ---- l5u15m3: Acordes de Sensível Secundária ----

  l5u15m3e1: {
    prompt:
      'Qual é a função de um acorde de sensível secundária (p. ex., vii°/V)?',
    choices: [
      'A fundamental sobe um meio-tom para a fundamental do acorde tonicizado',
      'A fundamental desce um meio-tom para a fundamental do acorde tonicizado',
      'A fundamental desce uma quinta perfeita para a fundamental do acorde tonicizado',
      'A fundamental sobe uma quinta perfeita para a fundamental do acorde tonicizado',
    ],
    hint: 'vii°/V funciona da mesma forma que vii° numa tonalidade: a fundamental está meio-tom abaixo do acorde alvo, e a qualidade diminuta cria forte impulso de resolução ascendente para o alvo.',
    nudge: 'Pensa no que o vii° faz numa tonalidade: a sua fundamental é a sensível. No vii°/V, de que acorde é sensível essa fundamental, e para onde tende a ir uma sensível?',
  },
  l5u15m3e2: {
    prompt:
      'Qual é a diferença entre um acorde de sétima meio-diminuta e um de sétima totalmente diminuta no contexto de acordes de sensível secundária?',
    choices: [
      "O meio-diminuto tem uma 7.ª menor acima da fundamental; o totalmente diminuto, uma 7.ª diminuta (meio-tom abaixo)",
      'O meio-diminuto tem uma 7.ª diminuta acima da fundamental; o totalmente diminuto, uma 7.ª menor (meio-tom acima)',
      'O meio-diminuto tem uma 7.ª menor acima da fundamental; o totalmente diminuto, uma 7.ª menor (o mesmo intervalo)',
      'O meio-diminuto tem uma 7.ª diminuta acima da fundamental; o totalmente diminuto, uma 7.ª diminuta (o mesmo intervalo)',
    ],
    hint: 'Ambos têm uma tríade diminuta (fundamental, 3.ª menor, 5.ª diminuta). A sétima difere: meio-dim tem sétima menor (10 meios-tons), totalmente dim tem sétima diminuta (9 meios-tons). O totalmente diminuto é mais comum como acorde de sensível secundária.',
  },
  l5u15m3e3: {
    prompt:
      'Em C maior, qual é o acorde alvo para o qual vii°/V resolve?',
    choices: [
      'G maior',
      'C maior',
      'F maior',
      'D menor',
    ],
    hint: 'O "/V" indica-te o alvo: V. Em C maior, V é G. vii°/V é F# diminuto (F#, A, C), e o F# resolve meio-tom acima para G, a fundamental do acorde alvo.',
  },

  // ---- l5u15m4: Tonicização vs. Modulação ----

  l5u15m4e1: {
    prompt: 'O que é tonicização?',
    choices: [
      "Fazer outro acorde soar brevemente como ponto de repouso, mantendo a passagem na tonalidade original",
      "Uma mudança permanente da tonalidade original para uma nova tónica, preparada pela sua própria dominante e confirmada por uma cadência",
      "Tocar o acorde da tónica vezes sem conta, em todas as vozes e registos, até a tonalidade principal ficar bem estabelecida",
      "Transpor uma melodia e o seu acompanhamento para uma nova tonalidade, de modo a ouvir a passagem noutro nível de altura",
    ],
    hint: 'Tonicização é fugaz: uma dominante secundária ou acorde de sensível trata brevemente um acorde diatónico como tónica local, mas a tonalidade original mantém o controlo. Pensa nisto como um desvio momentâneo.',
  },
  l5u15m4e2: {
    prompt: 'Como se distingue modulação de tonicização?',
    choices: [
      "A modulação estabelece uma nova tonalidade; a tonicização destaca brevemente um acorde",
      "A tonicização estabelece uma nova tonalidade; a modulação destaca brevemente um acorde",
      "A modulação e a tonicização estabelecem ambas uma nova tonalidade",
      "A modulação e a tonicização destacam ambas brevemente um acorde",
    ],
    hint: 'O teste chave: o novo centro tonal mantém-se com as suas próprias cadências e passagens estáveis? Se sim, é modulação. Se a tonalidade original se reafirma rapidamente, é apenas tonicização.',
  },
  l5u15m4e3: {
    prompt:
      'Quando um acorde diferente da tónica é realçado como tónica local durante vários compassos mas nenhuma cadência confirma uma nova tonalidade, como se chama?',
    choices: [
      "Uma tonicização prolongada",
      "Uma modulação por acorde pivot",
      "Uma cadência interrompida",
      "Uma sequência cromática",
    ],
    hint: 'Tonicizações prolongadas ocupam uma zona cinzenta: duram mais do que um rápido V/x - x, mas a nova tonalidade nunca é confirmada com uma cadência forte. A fronteira entre tonicização prolongada e modulação é subjetiva.',
  },

  // ---- l5u15m5: Cadeias de Dominantes ----

  l5u15m5e1: {
    prompt: 'O que é uma cadeia de dominantes secundárias?',
    choices: [
      'Numa cadeia de V7, cada alvo fica uma quarta perfeita acima da sua dominante',
      'Numa cadeia de V7, cada alvo é de novo a tónica inicial',
      'Numa cadeia de V7, cada alvo fica um tom acima da sua dominante',
      'Numa cadeia de V7, cada alvo fica uma terça menor acima da sua dominante',
    ],
    hint: 'Uma cadeia de dominantes cria tensão em cascata: p. ex., V7/vi - V7/ii - V7/V - V7 - I. Cada acorde de sétima da dominante resolve para o elo seguinte, puxando a harmonia de volta à tónica através de um ciclo.',
  },
  l5u15m5e2: {
    prompt:
      'Numa cadeia de dominantes secundárias (p. ex., V7/vi - V7/ii - V7/V - V - I em C maior), que movimento de fundamentais liga cada acorde?',
    choices: [
      'Cada fundamental desce uma quinta perfeita (ou sobe uma quarta perfeita) para a seguinte',
      'Cada fundamental desce uma quarta perfeita (ou sobe uma quinta perfeita) para a seguinte',
      'Cada fundamental desce uma segunda maior (ou sobe uma sétima menor) para a seguinte',
      'Cada fundamental desce uma terceira menor (ou sobe uma sexta maior) para a seguinte',
    ],
    hint: 'As cadeias de dominantes exploram o movimento de fundamentais mais forte da música tonal: quinta descendente. Cada V7 resolve uma quinta abaixo para o seu alvo, e esse alvo é reinterpretado como o próximo V7.',
  },
  l5u15m5e3: {
    prompt: 'O que é tonicização sequencial?',
    choices: [
      'Um padrão em que o mesmo gesto de tonicização (p. ex., V7 - alvo) se repete em diferentes níveis de altura',
      "Um padrão em que o mesmo gesto de tonicização (p. ex., V7 - alvo) é invertido na ordem a cada novo nível de altura",
      "Um padrão em que o mesmo gesto de tonicização (p. ex., V7 - alvo) se repete num único nível de altura inalterado",
      "Um padrão em que o mesmo gesto de tonicização (p. ex., V7 - alvo) é substituído por acordes sem relação a cada nível de altura",
    ],
    hint: 'A tonicização sequencial aplica o mesmo padrão harmónico (frequentemente V7 - acorde) a graus da escala sucessivos, criando um movimento cromático previsível mas colorido. É comum na música barroca e no jazz.',
  },

  // =========================================================================
  // Unidade 16: Modulação e Mistura Modal
  // =========================================================================

  // ---- l5u16m1: Modulação por Acorde Pivot ----

  l5u16m1e1: {
    prompt: 'O que é um acorde pivot na modulação?',
    choices: [
      "Uma harmonia que pertence às duas tonalidades",
      "Uma harmonia que pertence à nova tonalidade mas não à antiga",
      "Uma harmonia que pertence à tonalidade antiga mas não à nova",
      "Uma harmonia que não pertence a nenhuma tonalidade e não tem função comum",
    ],
    hint: 'Um acorde pivot é diatónico em ambas as tonalidades. Por exemplo, ao modular de C maior para G maior, o acorde E menor é tanto iii em C como vi em G, criando uma ponte harmónica suave entre as duas tonalidades.',
  },
  l5u16m1e2: {
    prompt:
      'Que acorde pode ser um pivot diatónico entre C maior e G maior?',
    choices: [
      'Acorde de E menor',
      'Acorde de F maior',
      'Acorde de Bb maior',
      'Acorde de F# diminuto',
    ],
    hint: 'Encontra acordes comuns a ambas as tonalidades. C maior: C Dm Em F G Am Bdim. G maior: G Am Bm C D Em F#dim. Acordes partilhados incluem C, Em, Am, G. Em, como iii/vi, é uma escolha forte de pivot.',
  },
  l5u16m1e3: {
    prompt: 'Qual é o processo típico de uma modulação por acorde pivot?',
    choices: [
      'Ordem: estabelecer a tonalidade antiga, introduzir o acorde pivot e confirmar a nova tonalidade com uma cadência',
      'Ordem: estabelecer a nova tonalidade, introduzir o acorde pivot e confirmar a tonalidade antiga com uma cadência',
      'Ordem: introduzir o acorde pivot, estabelecer a tonalidade antiga e confirmar a nova tonalidade com uma cadência',
      'Ordem: estabelecer a tonalidade antiga, confirmar a nova tonalidade com uma cadência e introduzir o acorde pivot',
    ],
    hint: 'A modulação por acorde pivot desenrola-se em três fases: (1) a tonalidade antiga é claramente estabelecida, (2) um acorde diatónico é reinterpretado como pertencendo à nova tonalidade, (3) a nova tonalidade é confirmada com uma cadência (tipicamente V-I).',
  },

  // ---- l5u16m2: Modulação para Tonalidades Próximas ----

  l5u16m2e1: {
    prompt: 'Quantas tonalidades próximas tem uma tonalidade maior?',
    choices: [
      "5 tonalidades próximas",
      "2 tonalidades próximas",
      "12 tonalidades próximas",
      "3 tonalidades próximas",
    ],
    hint: 'Tonalidades próximas diferem no máximo em um acidente nas suas armações de clave. Para C maior: G maior (+1#), F maior (+1b), A menor (relativa), E menor (rel. de G), D menor (rel. de F). Isso dá 5 tonalidades próximas.',
  },
  l5u16m2e2: {
    prompt:
      'Porque é que modular para a tonalidade da dominante (V) é considerada uma das modulações mais suaves?',
    choices: [
      'Seis notas mantêm-se, deixando várias harmonias comuns para ligar as duas tonalidades',
      "Duas notas mantêm-se, deixando uma única harmonia comum para ligar as duas tonalidades",
      'As notas mantêm-se porque a tonalidade da dominante tem a mesma armação de clave',
      'As notas mantêm-se porque a tonalidade da dominante é a relativa menor da tonalidade original',
    ],
    hint: 'C maior e G maior partilham 6 de 7 notas (só F vs F#). Esta sobreposição significa que muitos acordes são comuns a ambas as tonalidades, proporcionando abundantes opções de acorde pivot e uma transição fluida.',
  },
  l5u16m2e3: {
    prompt: 'Quais das seguintes são tonalidades próximas de C maior?',
    choices: [
      "G maior, F maior, A menor, E menor, D menor",
      'D maior, G maior, B menor, E menor, F# menor',
      'F maior, Bb maior, D menor, G menor, C menor',
      'Eb maior, Ab maior, C menor, F menor, Bb menor',
    ],
    hint: 'Tonalidades próximas têm armações de clave que diferem da de C maior (sem sustenidos nem bemóis) em, no máximo, um acidente. G maior tem 1#, F maior tem 1b, e as suas relativas menores (E menor, D menor) mais a relativa menor de C (A menor) completam o conjunto.',
  },

  // ---- l5u16m3: Modulação Direta/Por Nota Comum/Cromática ----

  l5u16m3e1: {
    prompt: 'O que é uma modulação direta (ou de frase)?',
    choices: [
      "Uma mudança súbita de centro tonal entre frases, sem uma harmonia partilhada que as ligue",
      'Uma mudança gradual de centro tonal através de uma harmonia comum que liga duas frases',
      'Um breve destaque de um acorde dentro de uma frase, mantendo o centro tonal original',
      'Uma mudança gradual de centro tonal dentro de uma frase através de uma sequência cromática de ligação',
    ],
    hint: 'A modulação direta é o tipo mais abrupto: uma frase termina na tonalidade antiga e a frase seguinte simplesmente começa na nova. Nenhum acorde pivot ou preparação cromática faz a ponte. Comum no pop e nos hinos.',
  },
  l5u16m3e2: {
    prompt: 'O que é uma modulação por nota comum?',
    choices: [
      "Uma altura continua a soar enquanto a harmonia envolvente lhe dá um novo significado tonal",
      'Uma altura muda de som enquanto a harmonia envolvente lhe dá um novo significado tonal',
      'Uma altura continua a soar enquanto a harmonia envolvente permanece na mesma tonalidade',
      'Uma altura muda de som enquanto a harmonia envolvente permanece na mesma tonalidade',
    ],
    hint: 'Na modulação por nota comum, uma nota é mantida (ou repetida) enquanto a harmonia muda à sua volta. Essa nota ganha uma nova função na nova tonalidade. Esta técnica funciona bem para modular para tonalidades distantes.',
  },
  l5u16m3e3: {
    prompt: 'O que é uma modulação cromática?',
    choices: [
      'Uma modulação alcançada pela alteração cromática de uma ou mais notas num acorde para pivotar para a nova tonalidade',
      'Uma modulação alcançada ao passar para uma tonalidade com mais sustenidos ou bemóis',
      'Uma modulação obtida alterando cromaticamente a melodia enquanto a harmonia fica na tonalidade antiga',
      'Uma modulação alcançada ao começar uma nova frase diretamente noutra tonalidade',
    ],
    hint: 'A modulação cromática usa condução de vozes por meio-tom para transformar um acorde da tonalidade antiga num acorde que pertence à nova. Uma ou mais notas movem-se por meio-tom, redirecionando suavemente a harmonia.',
  },

  // ---- l5u16m4: Mistura Modal — Acordes de Empréstimo ----

  l5u16m4e1: {
    prompt:
      'Constrói bVI em C maior, um acorde emprestado de C menor. Seleciona as 3 notas.',
    hint: 'bVI em C maior = Ab maior: Ab (8), C (0), Eb (3). Este acorde é emprestado de C menor natural, onde VI é Ab maior. O Ab e o Eb são notas cromáticas em C maior.',
  },
  l5u16m4e2: {
    prompt:
      'Constrói iv em C maior, um acorde emprestado de C menor. Seleciona as 3 notas.',
    hint: 'iv em C maior = F menor: F (5), Ab (8), C (0). Em C maior, IV é F maior (F, A, C). Emprestar de C menor rebaixa o A para Ab, criando a subdominante menor mais escura.',
  },
  l5u16m4e3: {
    prompt:
      'O que é mistura modal (também chamada empréstimo modal)?',
    choices: [
      "Usar harmonias do modo oposto sobre a mesma tónica",
      'Usar harmonias da relativa maior ou menor sobre uma tónica diferente',
      'Usar harmonias do modo oposto sobre uma tónica diferente',
      'Usar harmonias do modo maior sobre uma tónica diferente, uma 5.ª acima',
    ],
    hint: 'Mistura modal empresta acordes da tonalidade homónima (mesma tónica, modo oposto). Em C maior, emprestas de C menor: bIII (Eb), iv (Fm), bVI (Ab), bVII (Bb). Acrescentam escuridão e riqueza cromática.',
  },

  // ---- l5u16m5: Terça de Picardia ----

  l5u16m5e1: {
    prompt: 'O que é uma terça de Picardia (tierce de Picardie)?',
    choices: [
      "Terminar uma peça em tonalidade menor com um acorde de tónica maior, elevando apenas a terça do acorde final",
      "Terminar uma peça em tonalidade maior com um acorde de tónica menor, baixando apenas a terça do acorde final",
      "Terminar uma peça em tonalidade menor com um acorde de dominante maior em vez do acorde de tónica final",
      "Terminar uma peça em tonalidade maior com um acorde de subdominante menor em vez do acorde de tónica final",
    ],
    hint: 'A terça de Picardia é uma técnica secular: uma peça em tonalidade menor termina com um acorde I maior (p. ex., peça em C menor a terminar em C maior). A terça elevada cria um final brilhante e resolvido após a escuridão do modo menor.',
  },
  l5u16m5e2: {
    prompt:
      'Na mistura modal, o que significa emprestar da tonalidade maior homónima numa tonalidade menor?',
    choices: [
      'Usar acordes da tonalidade maior com a mesma tónica num contexto de tonalidade menor',
      'Usar acordes da tonalidade maior com a mesma armação de clave num contexto de tonalidade menor',
      "Usar acordes de uma tonalidade maior com uma tónica diferente num contexto de tonalidade menor",
      'Usar acordes da tonalidade maior uma 5.ª acima num contexto de tonalidade menor',
    ],
    hint: 'A mistura modal funciona em ambas as direções. Uma tonalidade menor pode emprestar da sua tonalidade maior homónima: p. ex., em A menor, podes emprestar IV de A maior (D maior em vez de D menor) para iluminar temporariamente a harmonia.',
  },
  l5u16m5e3: {
    prompt:
      'Qual dos seguintes é um exemplo de mistura modal numa tonalidade menor?',
    choices: [
      'Usar um acorde IV maior numa tonalidade menor, emprestado da tonalidade maior homónima',
      'Usar um acorde III maior numa tonalidade menor, partilhado com a relativa maior',
      'Usar um acorde V maior numa tonalidade menor, construído com o 7.º grau elevado da menor harmónica',
      'Usar um acorde iv menor numa tonalidade menor, construído com a sua escala menor natural',
    ],
    hint: 'O acorde V no modo menor vem da menor harmónica — pertence à própria tonalidade menor, não à mistura modal. A mistura modal empresta acordes da tonalidade homónima. Um IV maior no modo menor (p. ex., D maior em A menor em vez de D menor) é um exemplo comum; o Nível 4 ligou o mesmo acorde à menor melódica ascendente, e ambas as leituras são comuns.',
  },

  // =========================================================================
  // Unidade 17: Forma, Textura, Condução de Vozes
  // =========================================================================

  // ---- l5u17m1: Forma Binária e Ternária ----

  l5u17m1e1: {
    prompt: 'O que é forma binária?',
    choices: [
      'Uma estrutura com uma secção inicial seguida de uma segunda secção contrastante',
      'Uma estrutura com três secções: A, B e regresso a A',
      'Uma estrutura com duas linhas simultâneas: melodia e acompanhamento',
      'Uma estrutura com pares de frases repetidos: pergunta e resposta',
    ],
    hint: 'A forma binária (AB) divide uma peça em duas secções complementares. A secção A tipicamente termina longe da tónica (frequentemente em V), e a secção B regressa à tónica. Ambas as secções são geralmente repetidas (||: A :||: B :||).',
  },
  l5u17m1e2: {
    prompt:
      'O que distingue a forma binária com retorno da forma binária simples?',
    choices: [
      'Parte do tema inicial regressa dentro da segunda secção, em vez de formar uma terceira secção separada',
      "Parte do tema inicial regressa como terceira secção separada depois de terminar a segunda",
      "Parte do tema contrastante regressa dentro da primeira secção antes de começar a segunda",
      "Parte do tema inicial desaparece da segunda secção em vez de regressar dentro dela",
    ],
    hint: 'A binária com retorno (||: A :||: B A\' :||) traz de volta o material inicial de A no final da secção B. A binária simples não regressa a A. Muitos minuetos e scherzos clássicos usam forma binária com retorno.',
  },
  l5u17m1e3: {
    prompt: 'O que é forma ternária?',
    choices: [
      "Uma estrutura em três partes em que a primeira secção regressa após uma secção central contrastante",
      'Uma estrutura em três partes em que surgem três secções contrastantes sem regresso',
      'Uma estrutura em três partes em que um tema recebe duas variações sucessivas',
      'Uma estrutura em três partes em que a mesma música se repete para três letras diferentes',
    ],
    hint: 'A forma ternária tem três secções distintas: A (exposição), B (contraste), A (retorno). Ao contrário da binária com retorno, cada secção na forma ternária é harmonicamente autossuficiente, terminando geralmente com uma cadência na sua própria tonalidade.',
  },

  // ---- l5u17m2: Formas de Canção ----

  l5u17m2e1: {
    prompt: 'O que é forma estrofe-refrão?',
    choices: [
      'Uma forma em que estrofes com letras novas alternam com um refrão recorrente',
      'Uma forma em que as estrofes mantêm a letra enquanto cada refrão apresenta uma letra nova',
      'Uma forma em que uma estrofe recorrente alterna com episódios instrumentais contrastantes em vez de refrão',
      'Uma forma em que as estrofes conduzem a uma ponte e regressam sem um refrão recorrente',
    ],
    hint: 'Estrofe-refrão é a forma pop/rock mais comum. As estrofes avançam a história com letras em mudança sobre a mesma música. O refrão proporciona o pico emocional com um gancho consistente e memorável.',
  },
  l5u17m2e2: {
    prompt: 'O que é a forma AABA (também chamada forma de canção de 32 compassos)?',
    choices: [
      'Uma canção AABA em que B é uma ponte contrastante antes do regresso de A',
      'Uma canção AABA em que B repete a música de A com outra letra',
      'Uma canção AABA em que B é a estrofe e cada A é o refrão repetido',
      'Uma canção AABA em que B é uma repetição instrumental de A com a mesma melodia e harmonia',
    ],
    hint: 'AABA é a forma clássica do Tin Pan Alley / Grande Cancioneiro Americano. Cada secção tem tipicamente 8 compassos. A secção B (ponte ou "middle eight") proporciona contraste antes do retorno final de A. Muitos standards de jazz usam esta forma.',
  },
  l5u17m2e3: {
    prompt: 'Qual é a ordem habitual das três secções principais da forma sonata?',
    choices: [
      'Exposição → desenvolvimento → reexposição',
      'Desenvolvimento → reexposição → exposição',
      'Reexposição → desenvolvimento → exposição',
      'Reexposição → exposição → desenvolvimento',
    ],
    hint: 'Forma sonata: a exposição apresenta dois temas contrastantes em tonalidades diferentes, o desenvolvimento fragmenta-os e transforma-os por várias tonalidades, e a reexposição apresenta de novo ambos os temas na tonalidade de origem.',
  },

  // ---- l5u17m3: Textura ----

  l5u17m3e1: {
    prompt: 'O que é textura monofónica?',
    choices: [
      'Uma única linha melódica sem acompanhamento nem harmonia — uma voz, uma altura de cada vez',
      'Uma melodia com acompanhamento de acordes — as outras vozes apoiam a linha melódica principal',
      'Duas melodias independentes a soar em simultâneo — cada uma com o seu próprio interesse rítmico',
      'Uma melodia tocada simultaneamente com variações individuais — os executantes diferem nas linhas melódicas',
    ],
    hint: 'Monofonia é a textura mais simples: uma única melodia sem acompanhamento. Mesmo que muitas pessoas cantem ou toquem a mesma melodia (em uníssono ou oitavas), continua a ser monofónico porque há apenas uma linha musical.',
  },
  l5u17m3e2: {
    prompt: 'O que é textura polifónica?',
    choices: [
      'Duas ou mais linhas melódicas independentes a soar em simultâneo com os seus próprios ritmos e contornos',
      'Uma única linha melódica sem acompanhamento, executada em uníssono ou oitavas por várias vozes',
      'Uma melodia com acompanhamento de acordes, com as outras vozes a apoiar o seu interesse rítmico e melódico',
      'Uma melodia executada simultaneamente com variações individuais, cada executante a ornamentar a mesma linha',
    ],
    hint: 'A polifonia apresenta múltiplas vozes independentes, cada uma com interesse melódico. Uma fuga de Bach é o exemplo clássico: cada voz entra com o mesmo tema mas depois move-se independentemente, tecendo uma teia contrapontística complexa.',
  },
  l5u17m3e3: {
    prompt: 'O que é textura homofónica?',
    choices: [
      'Uma melodia principal acompanhada por acordes ou suporte harmónico, em que todas as partes se movem no mesmo ritmo ou apoiam a melodia',
      'Uma única linha melódica executada por todas as vozes em uníssono ou oitavas, sem acompanhamento de acordes',
      'Duas linhas melódicas independentes a soar em simultâneo, cada uma com o seu próprio interesse rítmico e melódico',
      'Uma melodia tocada simultaneamente com variações individuais, sem acompanhamento de acordes por baixo',
    ],
    hint: 'Homofonia tem uma melodia dominante com acompanhamento harmónico. A maioria do pop, rock e música clássica do período Clássico em diante é homofónica. Um cantor com acordes de guitarra é um exemplo claro.',
  },

  // ---- l5u17m4: Linhas de Notas-Guia ----

  l5u17m4e1: {
    prompt: 'O que são notas-guia?',
    choices: [
      'Terças e sétimas dos acordes',
      'Fundamentais e quintas dos acordes',
      'Nonas e décimas primeiras dos acordes',
      'Notas da melodia nos tempos fortes',
    ],
    hint: 'As notas-guia (3.as e 7.as) são as notas harmonicamente mais definidoras de um acorde. A fundamental e a 5.ª são estruturalmente importantes mas genéricas; a 3.ª determina maior/menor e a 7.ª determina o tipo de acorde.',
  },
  l5u17m4e2: {
    prompt:
      'Em ii7-V7-I em C maior (Dm7-G7-Cmaj7), que notas são as notas-guia de cada acorde?',
    choices: [
      "F-C em Dm7, F-B em G7, E-B em Cmaj7",
      'D-A em Dm7, G-D em G7, C-G em Cmaj7',
      'F-A em Dm7, B-D em G7, E-G em Cmaj7',
      'A-C em Dm7, D-F em G7, G-B em Cmaj7',
    ],
    hint: 'Notas-guia de Dm7: F (3.ª), C (7.ª). Para G7: F mantém-se como nota comum e torna-se a 7.ª, enquanto C desce meio-tom para B, a 3.ª. Para Cmaj7: B mantém-se e torna-se a 7.ª, enquanto F desce meio-tom para E, a 3.ª. Movimento mínimo = condução de vozes suave.',
    nudge: 'As notas-guia são a 3.ª e a 7.ª de cada acorde. Escreve-as para Dm7, G7 e Cmaj7 e compara: que notas ficam paradas de um acorde para o seguinte, e quanto se movem as outras?',
  },
  l5u17m4e3: {
    prompt:
      'Qual é o princípio fundamental de condução de vozes que as notas-guia ilustram?',
    choices: [
      'Mover cada voz para a nota mais próxima do acorde seguinte',
      "Mover cada voz para a fundamental do acorde seguinte",
      "Mover cada voz para a quinta do acorde seguinte",
      "Mover cada voz pelo mesmo intervalo",
    ],
    hint: 'Uma boa condução de vozes minimiza o movimento: manter notas comuns, mover as outras vozes por grau. Isto cria progressões harmónicas suaves e conectadas. As linhas de notas-guia demonstram este princípio com apenas as duas notas mais essenciais por acorde.',
  },
};

export default overlay;
