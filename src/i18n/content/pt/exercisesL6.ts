import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese translations for Level 6 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidade 18: Acordes Cromáticos
  // =========================================================================

  // ---- l6u18m1: Acorde Napolitano bII ----

  l6u18m1e1: {
    prompt:
      'Constrói o acorde napolitano (bII) em Dó menor. É uma tríade de Db maior: seleciona Db, F e Ab.',
    hint: 'O acorde napolitano é uma tríade maior construída sobre o 2.o grau rebaixado. Em Dó menor, bII = Db maior = Db, F, Ab (classes de altura 1, 5, 8).',
  },
  l6u18m1e2: {
    prompt: 'Qual é a função harmónica do acorde napolitano (bII)?',
    choices: [
      'Pré-dominante -- substitui ii ou iv e move-se para V',
      'Dominante -- resolve diretamente para a tónica',
      'Tónica -- funciona como substituto de I',
      'Acorde de passagem -- não tem função estrutural',
    ],
    hint: 'O napolitano funciona como acorde pré-dominante, movendo-se tipicamente para V (frequentemente através de um 6/4 cadencial). Intensifica a abordagem à dominante com a sua fundamental cromática.',
  },
  l6u18m1e3: {
    prompt: 'Em que inversão se encontra mais tipicamente o acorde napolitano?',
    choices: [
      'Primeira inversão (bII6) com a 3.a no baixo',
      'Posição fundamental com o 2.o grau rebaixado no baixo',
      'Segunda inversão (bII6/4) com a 5.a no baixo',
      'Aparece igualmente em todas as inversões',
    ],
    hint: 'O napolitano encontra-se quase sempre na primeira inversão (bII6), colocando o 4.o grau no baixo. Isto proporciona uma condução de vozes mais suave para V.',
  },

  // ---- l6u18m2: Sexta Italiana/Francesa ----

  l6u18m2e1: {
    prompt: 'Quantos semitons abrange o intervalo de sexta aumentada?',
    choices: [
      '10 semitons -- enarmonicamente equivalente a uma sétima menor',
      '9 semitons -- o mesmo que uma sexta maior',
      '8 semitons -- o mesmo que uma sexta menor',
      '11 semitons -- o mesmo que uma sétima maior',
    ],
    hint: 'Uma sexta aumentada é meio-tom maior que uma sexta maior (9 semitons). Abrange 10 semitons e é enarmonicamente do mesmo tamanho que uma sétima menor, mas as duas notas resolvem divergentemente para uma oitava.',
  },
  l6u18m2e2: {
    prompt: 'O que distingue a sexta italiana (It+6) da sexta francesa (Fr+6)?',
    choices: [
      'A francesa acrescenta uma quarta aumentada acima do baixo; a italiana tem apenas três notas',
      'A italiana tem quatro notas; a francesa tem apenas três',
      'A francesa resolve para a tónica; a italiana resolve para a dominante',
      'São o mesmo acorde com nomes diferentes baseados na época de utilização',
    ],
    hint: 'A It+6 é a mais simples: b6, 1, #4 (três notas). A Fr+6 acrescenta o 2.o grau (b6, 1, 2, #4), criando um subconjunto característico de tons inteiros com uma quarta aumentada acima do baixo.',
  },
  l6u18m2e3: {
    prompt: 'Qual é a função harmónica dos acordes de sexta aumentada?',
    choices: [
      'Pré-dominante -- intensificam o movimento para a dominante',
      'Dominante -- resolvem diretamente para a tónica',
      'Prolongamento da tónica -- decoram a harmonia de tónica',
      'Função de mediante -- substituem iii ou VI',
    ],
    hint: 'Todos os acordes de sexta aumentada funcionam como pré-dominantes cromáticos. O intervalo de sexta aumentada (b6 e #4) resolve divergentemente por meio-tom em ambas as vozes para a nota da dominante, criando uma abordagem intensamente direcionada para V.',
  },

  // ---- l6u18m3: Sexta Alemã ----

  l6u18m3e1: {
    prompt: 'O acorde de sexta alemã (Gr+6) é enarmonicamente equivalente a que acorde comum?',
    choices: [
      'Um acorde de sétima da dominante (V7) -- mesmas alturas, grafia e resolução diferentes',
      'Um acorde de sétima diminuta -- mesma estrutura intervalar',
      'Um acorde de sétima semi-diminuta -- mesmo som, contexto diferente',
      'Um acorde de sétima maior -- idêntico em posição cerrada',
    ],
    hint: 'A Gr+6 tem as mesmas classes de altura que um acorde de sétima da dominante. Por exemplo, em Dó menor a Gr+6 (Ab, C, Eb, F#) soa idêntica a Ab7 (Ab, C, Eb, Gb). A grafia diferente reflete destinos de condução de vozes diferentes.',
  },
  l6u18m3e2: {
    prompt: 'Como se cifra o acorde de sexta alemã numa tonalidade menor (por ex. Dó menor)?',
    choices: [
      'Ab, C, Eb, F# -- b6, 1, b3, #4',
      'Ab, C, E, F# -- b6, 1, 3, #4',
      'Ab, Cb, Eb, F# -- b6, b1, b3, #4',
      'Ab, C, Eb, Gb -- b6, 1, b3, b5',
    ],
    hint: 'Em Dó menor, a Gr+6 contém b6 (Ab), 1 (C), b3 (Eb) e #4 (F#). O intervalo crucial de sexta aumentada está entre Ab e F#, que resolve divergentemente para Sol-Sol (oitava sobre a dominante).',
  },
  l6u18m3e3: {
    prompt: 'O acorde de sexta alemã resolve tipicamente para que acorde?',
    choices: [
      'A dominante (V) ou 6/4 cadencial, com b6 e #4 a resolverem divergentemente para o 5.o grau',
      'A tónica (I) diretamente em posição fundamental',
      'A subdominante (IV) como parte de uma cadência plagal',
      'A sobretónica (ii) para iniciar uma cadeia pré-dominante',
    ],
    hint: 'Como todos os acordes de sexta aumentada, a Gr+6 resolve para V. As vozes extremas (b6 e #4) convergem na nota da dominante por meio-tom. Um 6/4 cadencial intervém frequentemente para evitar quintas paralelas.',
  },

  // ---- l6u18m4: Modulação Enarmónica Gr+6 <-> V7 ----

  l6u18m4e1: {
    prompt: 'Qual é o princípio fundamental por detrás da modulação enarmónica usando Gr+6 e V7?',
    choices: [
      'Um acorde que funciona como Gr+6 numa tonalidade pode ser reescrito como V7 numa tonalidade distante, ou vice-versa',
      'Qualquer acorde de sétima da dominante pode substituir qualquer acorde de sexta aumentada em qualquer tonalidade',
      'A modulação requer condução cromática de vozes nas quatro vozes simultaneamente',
      'Os dois acordes partilham a mesma resolução independentemente da sua grafia',
    ],
    hint: 'Uma vez que Gr+6 e V7 são enarmonicamente idênticos, uma única sonoridade pode pivotar entre duas tonalidades distantes. A reescrita muda qual voz conduz para onde, redirecionando a trajetória harmónica.',
  },
  l6u18m4e2: {
    prompt: 'A modulação enarmónica via Gr+6/V7 permite modulação direta para tonalidades a que distância?',
    choices: [
      'Tonalidades distantes -- até um trítono ou mais, muito além do alcance de pivot diatónico',
      'Apenas tonalidades próximas com uma diferença de um acidente',
      'Apenas entre tonalidades paralelas maior e menor',
      'Exatamente meio-tom de distância e não mais',
    ],
    hint: 'Os acordes pivot diatónicos ligam apenas tonalidades próximas. A reinterpretação enarmónica de Gr+6 como V7 (ou vice-versa) pode ligar tonalidades a um trítono ou mais de distância -- a técnica-assinatura dos compositores do período romântico.',
  },
  l6u18m4e3: {
    prompt: 'Se uma Gr+6 em Dó menor (Ab, C, Eb, F#) for reinterpretada como V7, que tonalidade toniciza agora?',
    choices: [
      'Db maior/menor -- reescrita como Ab, C, Eb, Gb = Ab7 = V7/Db',
      'Sol maior -- porque F# resolve subindo para Sol',
      'Fá maior -- o acorde torna-se V7/Fá',
      'Mib maior -- porque Eb é a nota do meio',
    ],
    hint: 'Reescrever F# como Gb transforma o acorde em Ab, C, Eb, Gb = Láb sétima da dominante. Ab7 é V7 de Db, portanto a música pode pivotar suavemente de Dó menor para Réb maior -- uma deslocação de meio-tom, ligando território tonal muito distante.',
  },

  // =========================================================================
  // Unidade 19: Técnicas Cromáticas Avançadas
  // =========================================================================

  // ---- l6u19m1: Modulação Enarmónica via dim7 ----

  l6u19m1e1: {
    prompt:
      'Constrói um acorde de sétima diminuta sobre C. Seleciona 4 notas: C, Eb, Gb e Bbb (enarmónico de A).',
    hint: 'Um acorde de sétima diminuta empilha três terças menores: C (0), Eb (3), Gb (6), Bbb (9). Estas quatro classes de altura dividem a oitava em partes iguais. Bbb é enarmonicamente A.',
  },
  l6u19m1e2: {
    prompt: 'Porque é que o acorde de sétima diminuta é simétrico?',
    choices: [
      'Divide a oitava de 12 semitons em quatro terças menores iguais (0, 3, 6, 9)',
      'Contém apenas notas naturais sem sustenidos ou bemóis',
      'As suas inversões produzem conteúdo intervalar diferente de cada vez',
      'Tem o mesmo número de intervalos maiores e menores',
    ],
    hint: 'O acorde dim7 é construído inteiramente com terças menores (3 semitons cada). Como 3 x 4 = 12, as quatro notas dividem a oitava uniformemente. Isto significa que cada inversão do acorde soa idêntica na sua estrutura intervalar.',
  },
  l6u19m1e3: {
    prompt: 'Para quantas tonalidades diferentes pode resolver um único acorde de sétima diminuta como acorde de sensível (viio7)?',
    choices: [
      'Quatro tonalidades -- qualquer das suas quatro notas pode ser tratada como sensível',
      'Duas tonalidades -- uma maior e uma menor',
      'Doze tonalidades -- uma para cada semitom',
      'Uma tonalidade -- determinada pela sua fundamental',
    ],
    hint: 'Devido à sua simetria, cada nota do acorde dim7 pode ser reescrita como sensível resolvendo ascendentemente por meio-tom para uma tónica diferente. C-Eb-Gb-Bbb pode ser viio7 de Db, E, G ou Bb.',
  },

  // ---- l6u19m2: Sétima Diminuta com Nota Comum ----

  l6u19m2e1: {
    prompt: 'O que define um acorde de sétima diminuta com nota comum (CTo7)?',
    choices: [
      'Um acorde de sétima diminuta que partilha uma nota com o acorde que embeleza',
      'Um acorde de sétima diminuta que resolve para a dominante',
      'Qualquer acorde de sétima diminuta usado numa tonalidade menor',
      'Um acorde de sétima diminuta que partilha todas as notas com o acorde seguinte',
    ],
    hint: 'A sétima diminuta com nota comum mantém uma nota (a nota comum) do acorde que decora. As outras três vozes movem-se por grau conjunto, criando um embelezamento cromático por notas vizinhas.',
  },
  l6u19m2e2: {
    prompt: 'Num CTo7 que embeleza um acorde de Dó maior, qual é tipicamente a nota comum?',
    choices: [
      'A fundamental do acorde embelezado (C)',
      'A 3.a do acorde embelezado (E)',
      'A 5.a do acorde embelezado (G)',
      'A 7.a do acorde embelezado (B)',
    ],
    hint: 'A forma mais comum mantém a fundamental do acorde-alvo. Para um CTo7 que embeleza Dó maior, C é mantido enquanto as outras vozes (D#, F#, A) se movem por grau conjunto de volta para as notas do acorde de Dó maior.',
  },
  l6u19m2e3: {
    prompt: 'Qual é a função principal de um acorde de sétima diminuta com nota comum?',
    choices: [
      'Embelezamento -- prolonga ou decora um acorde em vez de impulsionar a progressão harmónica',
      'Pré-dominante -- prepara a dominante como os acordes de sexta aumentada',
      'Dominante -- resolve para a tónica com movimento de sensível',
      'Modulatória -- inicia sempre uma mudança de tonalidade',
    ],
    hint: 'Ao contrário do viio7 (que tem função dominante), o CTo7 é puramente decorativo. Embeleza um acorde através de movimento cromático por notas vizinhas, acrescentando cor sem mudar a direção harmónica.',
  },

  // ---- l6u19m3: Mediantes Cromáticas ----

  l6u19m3e1: {
    prompt: 'O que define uma relação de mediante cromática entre dois acordes?',
    choices: [
      'Dois acordes cujas fundamentais distam uma 3.a com uma alteração cromática que muda a qualidade esperada',
      'Dois acordes cujas fundamentais distam uma 2.a ligados por notas de passagem cromáticas',
      'Qualquer progressão de acordes que usa condução cromática de vozes',
      'Dois acordes que partilham as três notas mas em inversões diferentes',
    ],
    hint: 'As mediantes diatónicas (I-iii, I-vi) partilham duas notas comuns. As mediantes cromáticas (ex. Dó maior para Mi maior, ou Dó maior para Láb maior) têm fundamentais a uma 3.a de distância mas com qualidade alterada, partilhando apenas uma ou zero notas comuns.',
  },
  l6u19m3e2: {
    prompt: 'Quantos tipos de relações de terça cromática existem entre tríades maiores?',
    choices: [
      'Quatro -- 3.a maior/menor ascendente e 3.a maior/menor descendente (ex. C-E, C-Ab, C-Eb, C-A)',
      'Dois -- uma ascendente e uma descendente',
      'Seis -- uma para cada classe de intervalo',
      'Três -- relações de terça maior, menor e diminuta',
    ],
    hint: 'A partir de qualquer tríade maior, podes mover-te para outra tríade maior a uma 3.a maior ou menor acima ou abaixo: C para E, C para Eb, C para A, C para Ab. Cada uma produz uma cor diferente, e as quatro são mediantes cromáticas.',
  },
  l6u19m3e3: {
    prompt: 'Qual é a característica de condução de vozes das progressões por mediante cromática?',
    choices: [
      'Uma ou zero notas comuns com movimento cromático (meio-tom) nas vozes que se movem',
      'Todas as vozes movem-se por grau conjunto na mesma direção',
      'Duas notas comuns com uma voz a mover-se por tom',
      'Movimento da fundamental por quinta com notas do acorde alteradas',
    ],
    hint: 'As mediantes cromáticas partilham frequentemente uma nota comum enquanto as outras vozes se deslocam por meio-tom. Em alguns casos (mediantes duplamente cromáticas como Dó maior para Réb menor) não há notas comuns, com deslocações cromáticas dramáticas em todas as vozes.',
  },

  // ---- l6u19m4: Técnicas Tardo-Românticas ----

  l6u19m4e1: {
    prompt: 'O que caracteriza a "harmonia não funcional" na música tardo-romântica?',
    choices: [
      'Os acordes ligam-se por condução de vozes ou cor em vez de função tónica-dominante',
      'A música evita completamente o uso de tríades ou acordes de sétima',
      'Todos os acordes são diminutos ou aumentados sem tríades maiores ou menores',
      'A harmonia usa apenas dois acordes ao longo de uma peça inteira',
    ],
    hint: 'Na harmonia não funcional, as progressões de acordes são impulsionadas pela condução suave de vozes, notas comuns partilhadas ou efeito colorístico em vez do ciclo funcional tradicional T-PD-D-T. Wagner, Liszt e o Chopin tardio foram pioneiros desta abordagem.',
  },
  l6u19m4e2: {
    prompt: 'O que é planing cromático (harmonia paralela)?',
    choices: [
      'Mover uma forma fixa de acorde em movimento paralelo por meios-tons ou tons',
      'Alternar entre dois acordes repetidamente',
      'Resolver cada acorde cromaticamente para o seguinte por meio-tom no baixo',
      'Tocar as doze alturas cromáticas simultaneamente',
    ],
    hint: 'O planing move uma estrutura inteira de acorde (ex. uma tríade maior ou acorde de sétima da dominante) para cima ou para baixo cromaticamente ou por tons inteiros, mantendo a mesma disposição. Debussy usou esta técnica extensamente.',
  },
  l6u19m4e3: {
    prompt: 'A que se refere a "dissolução da tonalidade" na música do final do século XIX?',
    choices: [
      'O enfraquecimento de um centro tonal claro através de cromatismo generalizado e modulações remotas',
      'O uso deliberado de apenas uma tonalidade ao longo de uma composição inteira',
      'A eliminação do ritmo e metro da estrutura musical',
      'A substituição de toda a harmonia por melodias em uníssono',
    ],
    hint: 'Compositores como Wagner (Tristan und Isolde) usaram cromatismo contínuo, resoluções deceptivas e ambiguidade enarmónica tão extensamente que a sensação de uma tonalidade "casa" tornou-se elusiva -- abrindo caminho para a atonalidade no século XX.',
  },

  // =========================================================================
  // Unidade 20: Contraponto e Escrita a Partes
  // =========================================================================

  // ---- l6u20m1: Contraponto de Espécies 1-3 ----

  l6u20m1e1: {
    prompt: 'No contraponto de primeira espécie (nota contra nota), que intervalos são considerados consonantes acima do cantus firmus?',
    choices: [
      'Uníssonos, terças, quintas, sextas e oitavas',
      'Apenas consonâncias perfeitas: uníssonos, quintas e oitavas',
      'Todos os intervalos exceto o trítono',
      'Segundas, quartas e sétimas além de terças e sextas',
    ],
    hint: 'A primeira espécie permite apenas consonâncias: consonâncias perfeitas (P1, P5, P8) e consonâncias imperfeitas (terças e sextas). Dissonâncias (segundas, quartas, sétimas, trítonos) são proibidas na primeira espécie.',
  },
  l6u20m1e2: {
    prompt: 'No contraponto de segunda espécie (duas notas contra uma), como são tratadas as dissonâncias?',
    choices: [
      'As dissonâncias podem aparecer apenas em tempos fracos como notas de passagem abordadas e deixadas por grau conjunto',
      'As dissonâncias são completamente proibidas como na primeira espécie',
      'As dissonâncias podem aparecer em qualquer tempo desde que resolvam por grau conjunto',
      'As dissonâncias são permitidas livremente em tempos fortes e fracos',
    ],
    hint: 'A segunda espécie introduz a nota de passagem: uma dissonância num tempo fraco que preenche o espaço entre duas consonâncias por movimento por grau conjunto. Os tempos fortes devem continuar consonantes.',
  },
  l6u20m1e3: {
    prompt: 'Que relação rítmica define o contraponto de terceira espécie?',
    choices: [
      'Quatro notas no contraponto contra cada nota do cantus firmus',
      'Três notas contra cada nota do cantus firmus',
      'Duas notas contra cada nota do cantus firmus',
      'Ritmo livre sem proporção fixa',
    ],
    hint: 'A terceira espécie coloca quatro semínimas contra cada semibreve do cantus firmus. Isto introduz bordaduras e notas de passagem duplas além das notas de passagem da segunda espécie.',
  },

  // ---- l6u20m2: Contraponto de Espécies 4-5 ----

  l6u20m2e1: {
    prompt: 'O contraponto de quarta espécie é definido principalmente por que dispositivo rítmico?',
    choices: [
      'Síncopa através de suspensões -- notas ligadas criam dissonância em tempos fortes',
      'Ritmos pontuados alternando entre notas longas e curtas',
      'Figuras de tercinas contra metro binário',
      'Valores de notas livremente misturados sem padrão específico',
    ],
    hint: 'A quarta espécie introduz a suspensão: uma consonância num tempo fraco é ligada ao tempo forte seguinte onde se torna dissonância, depois resolve descendentemente por grau conjunto. Isto cria a textura sincopada característica.',
  },
  l6u20m2e2: {
    prompt: 'O que define o contraponto de quinta espécie (contraponto florido)?',
    choices: [
      'Uma combinação livre de todas as espécies anteriores -- valores de notas misturados, notas de passagem e suspensões',
      'Cinco notas contra cada nota do cantus firmus',
      'Contraponto escrito para cinco vozes simultaneamente',
      'Imitação estrita ao intervalo de quinta ao longo de toda a peça',
    ],
    hint: 'A quinta espécie (florida) combina técnicas de todas as quatro espécies anteriores numa linha melódica fluente. Usa semibreves, mínimas, semínimas, suspensões e notas de passagem de forma musicalmente satisfatória.',
  },
  l6u20m2e3: {
    prompt: 'Quais são as três fases de uma suspensão corretamente executada?',
    choices: [
      'Preparação (consonância), suspensão (dissonância no tempo forte), resolução (grau conjunto descendente)',
      'Ataque (dissonância), sustentação (nota mantida), libertação (salto)',
      'Abordagem por salto, manutenção, resolução por salto',
      'Consonância, consonância, dissonância',
    ],
    hint: 'Uma suspensão requer: (1) Preparação -- a nota é introduzida como consonância; (2) Suspensão -- a nota é mantida (ligada) num tempo forte onde se torna dissonante; (3) Resolução -- a nota resolve descendentemente por grau conjunto para uma consonância.',
  },

  // ---- l6u20m3: Contraponto a Três Partes/Invertível ----

  l6u20m3e1: {
    prompt: 'O que significa "contraponto invertível à oitava"?',
    choices: [
      'Duas vozes podem trocar de posição (a superior torna-se inferior) e continuar a produzir contraponto correto',
      'A melodia é tocada ao contrário (retrógrado) à oitava',
      'Ambas as vozes são transpostas uma oitava acima simultaneamente',
      'Os intervalos entre vozes são invertidos (terças tornam-se sextas) mas as vozes ficam no lugar',
    ],
    hint: 'No contraponto invertível à oitava, a voz A acima da voz B soa correta, E a voz B acima da voz A também soa correta. Quando as vozes trocam, os intervalos invertem-se: terças tornam-se sextas, quintas tornam-se quartas, etc.',
  },
  l6u20m3e2: {
    prompt: 'O que é contraponto triplo?',
    choices: [
      'Três vozes escritas de modo a que qualquer das seis ordenações verticais possíveis produza contraponto válido',
      'Contraponto em metro ternário (3/4 ou 3/8)',
      'Três repetições do mesmo contraponto em níveis de altura diferentes',
      'Uma fuga com exatamente três sujeitos',
    ],
    hint: 'Contraponto triplo significa que três vozes (A, B, C) podem ser reorganizadas em qualquer ordem -- ABC, ACB, BAC, BCA, CAB, CBA -- e todas as seis permutações produzem contraponto correto. Bach dominou esta técnica.',
  },
  l6u20m3e3: {
    prompt: 'Porque devem as quintas perfeitas ser evitadas ou tratadas cuidadosamente no contraponto invertível à oitava?',
    choices: [
      'Uma quinta inverte-se numa quarta, que é tratada como dissonância acima do baixo no contraponto estrito',
      'As quintas perfeitas são sempre proibidas em todos os tipos de contraponto',
      'Uma quinta inverte-se num trítono, criando um intervalo inutilizável',
      'As quintas perfeitas não podem ser invertidas de todo',
    ],
    hint: 'Quando as vozes se invertem à oitava, uma P5 torna-se uma P4. No contraponto a duas vozes, quartas acima do baixo são dissonantes. Portanto, qualquer P5 no original torna-se um problema quando as vozes trocam de posição.',
  },

  // ---- l6u20m4: Escrita a Partes Avançada ----

  l6u20m4e1: {
    prompt: 'Quais são as quatro vozes na escrita a partes SATB (estilo coral), da mais aguda para a mais grave?',
    choices: [
      'Soprano, Contralto, Tenor, Baixo',
      'Soprano, Contralto, Agudo, Baixo',
      'Soprano, Barítono, Tenor, Baixo',
      'Soprano, Contralto, Tenor, Barítono',
    ],
    hint: 'SATB significa Soprano (mais aguda), Contralto, Tenor e Baixo (mais grave). Soprano e Contralto partilham a pauta de clave de sol; Tenor e Baixo partilham a pauta de clave de fá na notação coral padrão.',
  },
  l6u20m4e2: {
    prompt: 'O que requer a realização de baixo cifrado que um intérprete faça?',
    choices: [
      'Ler uma linha de baixo com números e improvisar as vozes superiores para formar os acordes indicados',
      'Tocar apenas as notas do baixo exatamente como escritas sem acrescentos',
      'Transpor a linha de baixo para corresponder aos números cifrados',
      'Duplicar cada nota do baixo à oitava em ambas as mãos',
    ],
    hint: 'O baixo cifrado era a taquigrafia barroca para a harmonia. O intérprete lê a nota do baixo escrita e as cifras (números) abaixo dela, depois preenche as vozes superiores para criar acordes completos seguindo regras de condução de vozes.',
  },
  l6u20m4e3: {
    prompt: 'Ao ler uma partitura de instrumento transpositor (ex. clarinete em Bb), o que deves fazer para encontrar a altura real?',
    choices: [
      'Transpor a altura escrita pelo intervalo de transposição do instrumento para encontrar a altura de concerto',
      'Tocar a altura escrita exatamente como notada -- instrumentos transpositores soam como escritos',
      'Mover cada nota uma oitava acima da altura escrita',
      'Ler a parte noutra clave para encontrar a altura correta',
    ],
    hint: 'Um clarinete em Bb soa uma segunda maior abaixo do escrito. Quando a parte indica C, o instrumento soa Bb. A leitura de partitura exige conhecer a transposição de cada instrumento para ouvir as alturas reais (de concerto).',
  },
};

export default overlay;
