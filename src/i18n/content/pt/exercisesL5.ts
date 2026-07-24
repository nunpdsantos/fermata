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
      'Constrói V/V em Dó maior. A dominante secundária de V é uma tríade de D maior. Seleciona as 3 notas: D, F#, A.',
    hint: 'V/V em Dó significa "o acorde V de Sol maior". A dominante de Sol é Ré maior: D (2), F# (6), A (9). O F# é cromático -- não pertence a Dó maior.',
  },
  l5u15m1e2: {
    prompt:
      'Constrói V7/V em Dó maior. Este é um acorde de D dominante com sétima: D, F#, A, C. Seleciona as 4 notas.',
    hint: 'V7/V em Dó = D7: D (2), F# (6), A (9), C (0). A sétima menor acrescentada (C) reforça a atração para Sol. O F# é a alteração cromática.',
  },
  l5u15m1e3: {
    prompt: 'O que é V/V?',
    choices: [
      'Uma dominante secundária que toniciza o acorde dominante da tonalidade',
      'O quinto acorde tocado duas vezes seguidas',
      'Um acorde diminuto construído sobre o segundo grau da escala',
      'O acorde dominante em segunda inversão',
    ],
    hint: 'V/V significa "a dominante da dominante". Em Dó maior, V é Sol. A dominante de Sol é Ré maior. Portanto V/V em Dó = Ré maior, um acorde cromático que toniciza temporariamente Sol.',
  },

  // ---- l5u15m2: Dominantes Secundárias de ii, iii, IV, vi ----

  l5u15m2e1: {
    prompt: 'Em Dó maior, que acorde funciona como V/ii?',
    choices: [
      'Lá maior (A, C#, E) -- a dominante de Ré menor',
      'Sol maior (G, B, D) -- a dominante de Dó',
      'Mi maior (E, G#, B) -- a dominante de Lá menor',
      'Fá maior (F, A, C) -- a subdominante',
    ],
    hint: 'Em Dó maior, ii é Ré menor. A dominante de Ré menor é Lá maior (A, C#, E). O C# é a nota cromática que cria a sensível de Ré.',
  },
  l5u15m2e2: {
    prompt: 'Em Dó maior, que acorde funciona como V/IV?',
    choices: [
      'Dó maior (C, E, G) -- a dominante de Fá',
      'Sol maior (G, B, D) -- a dominante de Dó',
      'Sib maior (Bb, D, F) -- emprestado de Dó menor',
      'Ré maior (D, F#, A) -- a dominante de Sol',
    ],
    hint: 'V/IV significa a dominante de IV. Em Dó maior, IV é Fá. A dominante de Fá é Dó maior. Isto é invulgar porque Dó maior já é a tónica -- o contexto determina se funciona como I ou V/IV.',
  },
  l5u15m2e3: {
    prompt: 'O que define uma dominante aplicada (secundária)?',
    choices: [
      'Uma tríade maior ou acorde de sétima dominante que resolve para um acorde diatónico diferente de I, funcionando como V desse acorde',
      'Qualquer acorde de sétima dominante usado numa progressão',
      'Um acorde que modula permanentemente para uma nova tonalidade',
      'O acorde V a resolver de forma enganosa para vi',
    ],
    hint: 'Uma dominante aplicada funciona temporariamente como V (ou V7) de um acorde diatónico. Introduz notas cromáticas para criar uma resolução de sensível para o seu alvo, sem estabelecer uma nova tonalidade.',
  },

  // ---- l5u15m3: Acordes de Sensível Secundária ----

  l5u15m3e1: {
    prompt:
      'Qual é a função de um acorde de sensível secundária (p. ex., viio/V)?',
    choices: [
      'Funciona como um acorde diminuto que resolve meio-tom acima para o acorde tonicizado, tal como viio resolve para I',
      'Substitui inteiramente o acorde dominante nas cadências',
      'Funciona como um acorde de passagem sem atração harmónica',
      'É a sensível da tonalidade tocada como nota isolada',
    ],
    hint: 'viio/V funciona da mesma forma que viio numa tonalidade: a fundamental está meio-tom abaixo do acorde alvo, e a qualidade diminuta cria forte impulso de resolução ascendente para o alvo.',
  },
  l5u15m3e2: {
    prompt:
      'Qual é a diferença entre um acorde de sétima meio-diminuta e um de sétima totalmente diminuta no contexto de acordes de sensível secundária?',
    choices: [
      'O meio-diminuto tem uma sétima menor acima da fundamental; o totalmente diminuto tem uma sétima diminuta (um semitom mais baixo)',
      'O meio-diminuto resolve para cima; o totalmente diminuto resolve para baixo',
      'O meio-diminuto é usado apenas em tonalidades maiores; o totalmente diminuto apenas em menores',
      'Não há diferença; são o mesmo acorde',
    ],
    hint: 'Ambos têm uma tríade diminuta (fundamental, 3.a menor, 5.a diminuta). A sétima difere: meio-dim tem sétima menor (10 semitons), totalmente dim tem sétima diminuta (9 semitons). O totalmente diminuto é mais comum como acorde de sensível secundária.',
  },
  l5u15m3e3: {
    prompt:
      'Em Dó maior, qual é o acorde alvo para o qual viio/V resolve?',
    choices: [
      'Sol maior (V) -- o viio/V resolve meio-tom acima para a dominante',
      'Dó maior (I) -- resolve para a tónica',
      'Fá maior (IV) -- resolve para a subdominante',
      'Ré menor (ii) -- resolve para a sobretónica',
    ],
    hint: 'O "/V" indica-te o alvo: V. Em Dó maior, V é Sol. viio/V é Fá# diminuto (F#, A, C), e o F# resolve meio-tom acima para Sol, a fundamental do acorde alvo.',
  },

  // ---- l5u15m4: Tonicização vs. Modulação ----

  l5u15m4e1: {
    prompt: 'O que é tonicização?',
    choices: [
      'Uma ênfase breve e temporária num acorde não-tónica usando a sua própria dominante, sem sair da tonalidade original',
      'Uma mudança permanente de centro tonal para uma nova tónica',
      'Tocar o acorde da tónica repetidamente para estabelecer a tonalidade',
      'Transpor uma melodia para uma nova tonalidade',
    ],
    hint: 'Tonicização é fugaz: uma dominante secundária ou acorde de sensível trata brevemente um acorde diatónico como tónica local, mas a tonalidade original mantém o controlo. Pensa nisto como um desvio momentâneo.',
  },
  l5u15m4e2: {
    prompt: 'Como se distingue modulação de tonicização?',
    choices: [
      'A modulação estabelece uma nova tonalidade através de cadências e passagens extensas; a tonicização é breve e regressa à tonalidade original',
      'A modulação usa sustenidos; a tonicização usa bemóis',
      'A modulação só ocorre no final de uma peça; a tonicização ocorre no meio',
      'Não há diferença real; os termos são intercambiáveis',
    ],
    hint: 'O teste chave: o novo centro tonal mantém-se com as suas próprias cadências e passagens estáveis? Se sim, é modulação. Se a tonalidade original se reafirma rapidamente, é apenas tonicização.',
  },
  l5u15m4e3: {
    prompt:
      'Quando uma tonicização se prolonga por vários compassos mas não estabelece totalmente a nova tonalidade, como se chama?',
    choices: [
      'Uma tonicização prolongada -- mais longa do que um único acorde mas sem confirmação cadencial completa na nova tonalidade',
      'Uma modulação por acorde pivot',
      'Uma cadência enganosa',
      'Uma sequência cromática',
    ],
    hint: 'Tonicizações prolongadas ocupam uma zona cinzenta: duram mais do que um rápido V/x - x, mas a nova tonalidade nunca é confirmada com uma cadência forte. A fronteira entre tonicização prolongada e modulação é subjetiva.',
  },

  // ---- l5u15m5: Cadeias de Dominantes ----

  l5u15m5e1: {
    prompt: 'O que é uma cadeia de dominantes secundárias?',
    choices: [
      'Uma sequência em que cada acorde funciona como V7 do seguinte, passando por múltiplas tonicizações antes de resolver para a tónica',
      'Tocar o acorde V de cada tonalidade maior em sucessão',
      'Uma série de acordes diminutos descendentes cromaticamente',
      'Alternar entre I e V repetidamente',
    ],
    hint: 'Uma cadeia de dominantes cria tensão em cascata: p. ex., V7/vi - V7/ii - V7/V - V7 - I. Cada acorde de sétima dominante resolve para o elo seguinte, puxando a harmonia de volta à tónica através de um ciclo.',
  },
  l5u15m5e2: {
    prompt:
      'Numa cadeia de dominantes secundárias descendente por quintas (p. ex., V7/vi - V7/ii - V7/V - V - I em Dó maior), que movimento de fundamentais liga cada acorde?',
    choices: [
      'Cada fundamental desce uma quinta perfeita (ou sobe uma quarta perfeita) para a seguinte',
      'Cada fundamental sobe um meio-tom cromaticamente',
      'Cada fundamental desce um tom',
      'As fundamentais alternam entre terças ascendentes e descendentes',
    ],
    hint: 'As cadeias de dominantes exploram o movimento de fundamentais mais forte da música tonal: quinta descendente. Cada V7 resolve uma quinta abaixo para o seu alvo, e esse alvo é reinterpretado como o próximo V7.',
  },
  l5u15m5e3: {
    prompt: 'O que é tonicização sequencial?',
    choices: [
      'Um padrão harmónico em que o mesmo gesto de tonicização (p. ex., V7 - alvo) é repetido em diferentes níveis de altura em sequência',
      'Uma modulação que passa por todas as tonalidades no círculo de quintas',
      'Tocar escalas em sequência ascendente cromaticamente',
      'Uma série de cadências enganosas em diferentes tonalidades',
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
      'Um acorde que pertence tanto à tonalidade antiga como à nova, servindo de dobradiça entre elas',
      'O primeiro acorde da nova tonalidade que contém uma nota cromática',
      'Um acorde diminuto que resolve a modulação',
      'O acorde dominante da tonalidade original',
    ],
    hint: 'Um acorde pivot é diatónico em ambas as tonalidades. Por exemplo, ao modular de Dó maior para Sol maior, o acorde Mi menor é tanto iii em Dó como vi em Sol, criando uma ponte harmónica suave entre as duas tonalidades.',
  },
  l5u16m1e2: {
    prompt:
      'Ao modular de Dó maior para Sol maior, que acorde poderia servir como pivot?',
    choices: [
      'Mi menor -- é iii em Dó maior e vi em Sol maior',
      'Fá maior -- é IV em Dó maior e não é diatónico em Sol maior',
      'Sib maior -- é emprestado de Dó menor',
      'Fá# diminuto -- sinaliza a nova tonalidade',
    ],
    hint: 'Encontra acordes comuns a ambas as tonalidades. Dó maior: C Dm Em F G Am Bdim. Sol maior: G Am Bm C D Em F#dim. Acordes partilhados incluem C, Em, Am, G. Mi menor como iii/vi é uma escolha forte de pivot.',
  },
  l5u16m1e3: {
    prompt: 'Qual é o processo típico de uma modulação por acorde pivot?',
    choices: [
      'Estabelecer a tonalidade antiga, introduzir o acorde pivot e depois confirmar a nova tonalidade com uma cadência',
      'Tocar uma escala cromática entre as duas tonalidades',
      'Parar de tocar, mudar a armação de clave e retomar',
      'Repetir a tónica da nova tonalidade até o ouvinte se ajustar',
    ],
    hint: 'A modulação por acorde pivot desenrola-se em três fases: (1) a tonalidade antiga é claramente estabelecida, (2) um acorde diatónico é reinterpretado como pertencendo à nova tonalidade, (3) a nova tonalidade é confirmada com uma cadência (tipicamente V-I).',
  },

  // ---- l5u16m2: Modulação para Tonalidades Próximas ----

  l5u16m2e1: {
    prompt: 'Quantas tonalidades próximas tem uma tonalidade maior?',
    choices: [
      '5 -- as tonalidades cujas armações diferem no máximo em um sustenido ou bemol',
      '2 -- apenas a dominante e a subdominante',
      '12 -- todas as tonalidades são próximas',
      '3 -- a relativa menor, a dominante e a subdominante',
    ],
    hint: 'Tonalidades próximas diferem no máximo em um acidente nas suas armações de clave. Para Dó maior: Sol maior (+1#), Fá maior (+1b), Lá menor (relativa), Mi menor (rel. de Sol), Ré menor (rel. de Fá). Isso dá 5 tonalidades próximas.',
  },
  l5u16m2e2: {
    prompt:
      'Porque é que modular para a tonalidade da dominante (V) é considerada uma das modulações mais suaves?',
    choices: [
      'A tonalidade da dominante difere em apenas um acidente, e as duas tonalidades partilham a maioria dos seus acordes diatónicos',
      'A tonalidade da dominante tem a mesma nota tónica',
      'A tonalidade da dominante não usa sustenidos nem bemóis',
      'A dominante é sempre a tonalidade com som mais brilhante',
    ],
    hint: 'Dó maior e Sol maior partilham 6 de 7 notas (só F vs F#). Esta sobreposição significa que muitos acordes são comuns a ambas as tonalidades, proporcionando abundantes opções de acorde pivot e uma transição fluida.',
  },
  l5u16m2e3: {
    prompt: 'Quais das seguintes são tonalidades próximas de Dó maior?',
    choices: [
      'Sol maior, Fá maior, Lá menor, Mi menor, Ré menor',
      'Réb maior, Láb maior, Mib maior, Sib maior, Fá menor',
      'Sol maior, Ré maior, Lá maior, Mi maior, Si maior',
      'Dó menor, Mib maior, Láb maior, Sib maior, Fá menor',
    ],
    hint: 'Tonalidades próximas partilham todos os acidentes menos um com Dó maior (0 sustenidos/bemóis). Sol maior tem 1#, Fá maior tem 1b, e as suas relativas menores (Mi menor, Ré menor) mais a relativa menor de Dó (Lá menor) completam o conjunto.',
  },

  // ---- l5u16m3: Modulação Direta/Por Nota Comum/Cromática ----

  l5u16m3e1: {
    prompt: 'O que é uma modulação direta (ou de frase)?',
    choices: [
      'Uma modulação que muda para a nova tonalidade abruptamente numa fronteira de frase, sem acorde pivot',
      'Uma modulação que usa um acorde pivot partilhado entre as duas tonalidades',
      'Uma modulação que se move por meio-tom usando condução cromática de vozes',
      'Uma modulação que acontece gradualmente ao longo de muitos compassos',
    ],
    hint: 'A modulação direta é o tipo mais abrupto: uma frase termina na tonalidade antiga e a frase seguinte simplesmente começa na nova. Nenhum acorde pivot ou preparação cromática faz a ponte. Comum no pop e nos hinos.',
  },
  l5u16m3e2: {
    prompt: 'O que é uma modulação por nota comum?',
    choices: [
      'Uma modulação em que uma única nota sustida serve de ponte entre duas tonalidades, reinterpretada no contexto da nova tonalidade',
      'Uma modulação em que a nota do baixo se mantém na tónica ao longo de toda a passagem',
      'Uma modulação que usa apenas notas comuns a ambas as escalas',
      'Uma modulação que resolve para o acorde comum de duas tonalidades',
    ],
    hint: 'Na modulação por nota comum, uma nota é mantida (ou repetida) enquanto a harmonia muda à sua volta. Essa nota ganha uma nova função na nova tonalidade. Esta técnica funciona bem para modular para tonalidades distantes.',
  },
  l5u16m3e3: {
    prompt: 'O que é uma modulação cromática?',
    choices: [
      'Uma modulação alcançada pela alteração cromática de uma ou mais notas num acorde para pivotar para a nova tonalidade',
      'Uma modulação que usa apenas escalas cromáticas',
      'Uma modulação para uma tonalidade com mais sustenidos ou bemóis',
      'Uma modulação que evita todos os acordes diatónicos',
    ],
    hint: 'A modulação cromática usa condução de vozes por meio-tom para transformar um acorde da tonalidade antiga num acorde que pertence à nova. Uma ou mais notas movem-se por semitom, redirecionando suavemente a harmonia.',
  },

  // ---- l5u16m4: Mistura Modal — Acordes de Empréstimo ----

  l5u16m4e1: {
    prompt:
      'Constrói bVI em Dó maior. Este acorde é emprestado de Dó menor: Láb maior (Ab, C, Eb). Seleciona as 3 notas.',
    hint: 'bVI em Dó maior = Láb maior: Ab (8), C (0), Eb (3). Este acorde é emprestado de Dó menor natural, onde VI é Láb maior. O Ab e o Eb são notas cromáticas em Dó maior.',
  },
  l5u16m4e2: {
    prompt:
      'Constrói iv em Dó maior. Este acorde é emprestado de Dó menor: Fá menor (F, Ab, C). Seleciona as 3 notas.',
    hint: 'iv em Dó maior = Fá menor: F (5), Ab (8), C (0). Em Dó maior, IV é Fá maior (F, A, C). Emprestar de Dó menor rebaixa o A para Ab, criando a subdominante menor mais escura.',
  },
  l5u16m4e3: {
    prompt:
      'O que é mistura modal?',
    choices: [
      'Emprestar acordes da tonalidade menor (ou maior) paralela para acrescentar cor cromática sem sair da tonalidade de origem',
      'Misturar dois modos diferentes como Dórico e Mixolídio na mesma passagem',
      'Tocar um acorde maior e um menor ao mesmo tempo',
      'Alternar entre relativa maior e relativa menor',
    ],
    hint: 'Mistura modal empresta acordes da tonalidade paralela (mesma tónica, modo oposto). Em Dó maior, emprestas de Dó menor: bIII (Mib), iv (Fm), bVI (Láb), bVII (Sib). Acrescentam escuridão e riqueza cromática.',
  },

  // ---- l5u16m5: Terça Picardia ----

  l5u16m5e1: {
    prompt: 'O que é uma terça picardia (tierce de Picardie)?',
    choices: [
      'Terminar uma peça em tonalidade menor com um acorde de tónica maior, elevando a terça do acorde final',
      'Uma progressão de acordes que usa apenas terças',
      'Um intervalo de terça menor usado numa tonalidade maior',
      'Um ornamento francês em trilo sobre o terceiro grau',
    ],
    hint: 'A terça picardia é uma técnica secular: uma peça em tonalidade menor termina com um acorde I maior (p. ex., peça em Dó menor a terminar em Dó maior). A terça elevada cria um final brilhante e resolvido após a escuridão do modo menor.',
  },
  l5u16m5e2: {
    prompt:
      'Na mistura modal, o que significa emprestar do maior paralelo numa tonalidade menor?',
    choices: [
      'Usar acordes da tonalidade maior com a mesma tónica, como um IV maior ou um I maior, num contexto de tonalidade menor',
      'Modular permanentemente para a tonalidade maior',
      'Tocar a escala maior sobre acordes menores',
      'Usar os acordes da relativa maior',
    ],
    hint: 'A mistura modal funciona em ambas as direções. Uma tonalidade menor pode emprestar do seu maior paralelo: p. ex., em Lá menor, podes emprestar IV de Lá maior (Ré maior em vez de Ré menor) para iluminar temporariamente a harmonia.',
  },
  l5u16m5e3: {
    prompt:
      'Qual dos seguintes é um exemplo de mistura modal numa tonalidade menor?',
    choices: [
      'Usar um acorde IV maior numa tonalidade menor, emprestado do maior paralelo',
      'Usar o acorde V numa tonalidade menor (que requer o 7.o grau elevado da menor harmónica)',
      'Modular para a relativa maior',
      'Usar uma dominante secundária para tonicizar a dominante',
    ],
    hint: 'O acorde V no modo menor vem da menor harmónica, não da mistura modal. A mistura modal empresta especificamente acordes da tonalidade paralela. Um IV maior no modo menor (p. ex., Ré maior em Lá menor em vez de Ré menor) é mistura modal genuína.',
  },

  // =========================================================================
  // Unidade 17: Forma, Textura, Condução de Vozes
  // =========================================================================

  // ---- l5u17m1: Forma Binária e Ternária ----

  l5u17m1e1: {
    prompt: 'O que é forma binária?',
    choices: [
      'Uma estrutura em duas partes (A-B) em que cada secção é geralmente repetida, e B frequentemente modula ou contrasta com A',
      'Uma peça com apenas dois acordes',
      'Uma composição para dois instrumentos',
      'Uma forma com duas secções idênticas tocadas duas vezes',
    ],
    hint: 'A forma binária (AB) divide uma peça em duas secções complementares. A secção A tipicamente termina longe da tónica (frequentemente em V), e a secção B regressa à tónica. Ambas as secções são geralmente repetidas (||: A :||: B :||).',
  },
  l5u17m1e2: {
    prompt:
      'O que distingue a forma binária com retorno da forma binária simples?',
    choices: [
      'Na binária com retorno, o material de A regressa no final da secção B, criando uma estrutura semelhante a ABA dentro do quadro binário',
      'A binária com retorno tem finais de frase curvos em vez de cadências retas',
      'A binária com retorno repete cada secção três vezes em vez de duas',
      'A binária com retorno está sempre numa tonalidade menor',
    ],
    hint: 'A binária com retorno (||: A :||: B A\' :||) traz de volta o material inicial de A no final da secção B. A binária simples não regressa a A. Muitos minuetos e scherzos clássicos usam forma binária com retorno.',
  },
  l5u17m1e3: {
    prompt: 'O que é forma ternária (ABA)?',
    choices: [
      'Uma estrutura em três partes em que a primeira secção regressa após uma secção central contrastante, sendo cada secção autossuficiente',
      'Uma peça com três melodias diferentes que nunca se repetem',
      'Uma forma em que o andamento muda três vezes',
      'Uma peça escrita em compasso 3/4',
    ],
    hint: 'A forma ternária tem três secções distintas: A (exposição), B (contraste), A (retorno). Ao contrário da binária com retorno, cada secção na forma ternária é harmonicamente autossuficiente, terminando geralmente com uma cadência na sua própria tonalidade.',
  },

  // ---- l5u17m2: Formas de Canção ----

  l5u17m2e1: {
    prompt: 'O que é forma estrofe-refrão?',
    choices: [
      'Uma forma em que as estrofes têm a mesma música mas letras diferentes, alternando com um refrão recorrente com letra e melodia fixas',
      'Uma forma em que a estrofe e o refrão são idênticos',
      'Uma forma com apenas uma secção de estrofe e sem refrão',
      'Uma forma clássica usada exclusivamente na ópera',
    ],
    hint: 'Estrofe-refrão é a forma pop/rock mais comum. As estrofes avançam a história com letras em mudança sobre a mesma música. O refrão proporciona o pico emocional com um gancho consistente e memorável.',
  },
  l5u17m2e2: {
    prompt: 'O que é a forma AABA (também chamada forma de canção de 32 compassos)?',
    choices: [
      'Uma forma com uma secção A repetida, uma secção B contrastante (ponte), e um retorno final de A, tipicamente 32 compassos no total',
      'Uma forma com quatro secções idênticas de 8 compassos',
      'Uma forma com duas estrofes e dois refrãos',
      'Uma estrutura de improvisação jazz sem secções fixas',
    ],
    hint: 'AABA é a forma clássica do Tin Pan Alley / Grande Cancioneiro Americano. Cada secção tem tipicamente 8 compassos. A secção B (ponte ou "middle eight") proporciona contraste antes do retorno final de A. Muitos standards de jazz usam esta forma.',
  },
  l5u17m2e3: {
    prompt: 'Quais são as três secções principais da forma sonata?',
    choices: [
      'Exposição, desenvolvimento e recapitulação',
      'Estrofe, refrão e ponte',
      'Introdução, tema e coda',
      'Prelúdio, fuga e poslúdio',
    ],
    hint: 'Forma sonata: a exposição apresenta dois temas contrastantes em tonalidades diferentes, o desenvolvimento fragmenta-os e transforma-os por tonalidades distantes, e a recapitulação reexpõe ambos os temas na tonalidade de origem.',
  },

  // ---- l5u17m3: Textura ----

  l5u17m3e1: {
    prompt: 'O que é textura monofónica?',
    choices: [
      'Uma única linha melódica sem acompanhamento nem harmonia -- uma voz, uma altura de cada vez',
      'Uma melodia com acompanhamento de acordes por baixo',
      'Múltiplas melodias independentes a soar em simultâneo',
      'Um instrumento solo a tocar acordes',
    ],
    hint: 'Monofonia é a textura mais simples: uma única melodia sem acompanhamento. Mesmo que muitas pessoas cantem ou toquem a mesma melodia (em uníssono ou oitavas), continua a ser monofónico porque há apenas uma linha musical.',
  },
  l5u17m3e2: {
    prompt: 'O que é textura polifónica?',
    choices: [
      'Duas ou mais linhas melódicas independentes a soar em simultâneo, cada uma com o seu próprio ritmo e contorno',
      'Uma única melodia tocada por muitos instrumentos em uníssono',
      'Uma melodia apoiada por blocos de acordes',
      'Música sem melodia discernível',
    ],
    hint: 'A polifonia apresenta múltiplas vozes independentes, cada uma com interesse melódico. Uma fuga de Bach é o exemplo clássico: cada voz entra com o mesmo tema mas depois move-se independentemente, tecendo uma teia contrapontística complexa.',
  },
  l5u17m3e3: {
    prompt: 'O que é textura homofónica?',
    choices: [
      'Uma melodia principal acompanhada por acordes ou suporte harmónico, em que todas as partes se movem no mesmo ritmo ou apoiam a melodia',
      'Todas as vozes a cantar a mesma melodia na mesma altura',
      'Duas melodias igualmente importantes entrecruzadas',
      'Música sem qualquer melodia, consistindo apenas em padrões rítmicos',
    ],
    hint: 'Homofonia tem uma melodia dominante com acompanhamento harmónico. A maioria do pop, rock e música clássica do período Clássico em diante é homofónica. Um cantor com acordes de guitarra é um exemplo claro.',
  },

  // ---- l5u17m4: Linhas de Notas-Guia ----

  l5u17m4e1: {
    prompt: 'O que são notas-guia?',
    choices: [
      'A 3.a e a 7.a de cada acorde, que definem a sua qualidade e criam condução de vozes suave entre acordes',
      'A fundamental e a 5.a de cada acorde',
      'As notas da melodia que caem nos tempos fortes',
      'Notas cromáticas de passagem entre notas do acorde',
    ],
    hint: 'As notas-guia (3.as e 7.as) são as notas harmonicamente mais definidoras de um acorde. A fundamental e a 5.a são estruturalmente importantes mas genéricas; a 3.a determina maior/menor e a 7.a determina o tipo de acorde.',
  },
  l5u17m4e2: {
    prompt:
      'Numa progressão ii7-V7-I em Dó maior (Dm7-G7-Cmaj7), como se movem as notas-guia?',
    choices: [
      'As notas-guia movem-se por grau ou mantêm-se como notas comuns: F-C em Dm7, F-B em G7, E-B em Cmaj7',
      'As notas-guia saltam por intervalos largos entre cada acorde',
      'As notas-guia mantêm-se nas mesmas notas ao longo dos três acordes',
      'As notas-guia seguem exatamente a linha do baixo',
    ],
    hint: 'Notas-guia de Dm7: F (3.a), C (7.a). G7: o C mantém-se como nota comum tornando-se a 7.a do acorde, enquanto F desce para B (3.a). Cmaj7: B mantém-se ou resolve para B (7.a), F resolve descendo para E (3.a). Movimento mínimo = condução de vozes suave.',
  },
  l5u17m4e3: {
    prompt:
      'Qual é o princípio fundamental de condução de vozes que as notas-guia ilustram?',
    choices: [
      'Mover cada voz para a nota do acorde mais próxima disponível, preferindo movimento por grau e notas comuns a saltos',
      'Todas as vozes devem mover-se em movimento paralelo em todos os momentos',
      'Cada voz deve saltar para a nota do acorde mais distante para criar variedade',
      'A voz superior deve sempre subir enquanto a inferior desce',
    ],
    hint: 'Uma boa condução de vozes minimiza o movimento: manter notas comuns, mover as outras vozes por grau. Isto cria progressões harmónicas suaves e conectadas. As linhas de notas-guia demonstram este princípio com apenas as duas notas mais essenciais por acorde.',
  },
};

export default overlay;
