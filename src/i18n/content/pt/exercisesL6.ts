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
      'Constrói o acorde napolitano (bII) em C menor. Seleciona as 3 notas.',
    hint: 'O acorde napolitano é uma tríade maior construída sobre o 2.º grau rebaixado. Em C menor, bII = Db maior = Db, F, Ab (classes de altura 1, 5, 8).',
  },
  l6u18m1e2: {
    prompt: 'Qual é a função harmónica do acorde napolitano (bII)?',
    choices: [
      "Uma pré-dominante cromática que prepara a dominante no lugar de ii ou iv",
      "Uma dominante cromática que substitui V e resolve diretamente para a tónica",
      "Uma tónica cromática que prepara a dominante no lugar de ii ou iv",
      "Uma dominante cromática que prepara ii ou iv no lugar de V",
    ],
    hint: 'O napolitano funciona como acorde pré-dominante, movendo-se tipicamente para V (frequentemente através de um 6/4 cadencial). Intensifica a abordagem à dominante com a sua fundamental cromática.',
  },
  l6u18m1e3: {
    prompt: 'Qual é a nota de baixo habitual do acorde napolitano em C menor?',
    choices: [
      'F',
      'Db',
      'Ab',
      'C',
    ],
    hint: 'O napolitano encontra-se quase sempre na primeira inversão (bII6), colocando o 4.º grau no baixo. Isto proporciona uma condução de vozes mais suave para V.',
  },

  // ---- l6u18m2: Sexta Italiana/Francesa ----

  l6u18m2e1: {
    prompt: 'Quantos meios-tons abrange o intervalo de sexta aumentada?',
    choices: [
      "10 meios-tons",
      "9 meios-tons",
      "8 meios-tons",
      "11 meios-tons",
    ],
    hint: 'Uma sexta aumentada é meio-tom maior que uma sexta maior (9 meios-tons). Abrange 10 meios-tons e é enarmonicamente do mesmo tamanho que uma sétima menor, mas as duas notas resolvem divergentemente para uma oitava.',
  },
  l6u18m2e2: {
    prompt: 'O que distingue a sexta italiana (It+6) da sexta francesa (Fr+6)?',
    choices: [
      'A francesa acrescenta uma quarta aumentada acima do baixo; a italiana tem apenas três notas',
      "A italiana acrescenta uma quarta aumentada acima do baixo; a francesa tem apenas três notas",
      'A francesa acrescenta uma quinta perfeita acima do baixo; a italiana tem apenas três notas',
      'A italiana acrescenta uma quinta perfeita acima do baixo; a francesa tem apenas três notas',
    ],
    hint: 'A It+6 é a mais simples: b6, 1, #4 (três notas). A Fr+6 acrescenta o 2.º grau (b6, 1, 2, #4), criando um subconjunto característico de tons inteiros com uma quarta aumentada acima do baixo.',
    nudge: 'Escreve as duas sobre o mesmo baixo, b6: enumera os graus de cada acorde e conta-os. Depois encontra a nota que a francesa tem e a italiana não, e mede-a em relação ao baixo.',
  },
  l6u18m2e3: {
    prompt: 'Qual é a função harmónica dos acordes de sexta aumentada?',
    choices: [
      'Pré-dominante: prepara a harmonia da dominante numa progressão cadencial',
      'Dominante: prepara a chegada à tónica numa progressão cadencial',
      'Tónica: fornece o ponto de repouso estável no final de uma frase',
      'Mediante: fornece a harmonia de iii ou VI na progressão tonal',
    ],
    hint: 'Todos os acordes de sexta aumentada funcionam como pré-dominantes cromáticos. O intervalo de sexta aumentada (b6 e #4) resolve divergentemente por meio-tom em ambas as vozes para a nota da dominante, criando uma abordagem intensamente direcionada para V.',
  },

  // ---- l6u18m3: Sexta Alemã ----

  l6u18m3e1: {
    prompt: 'O acorde de sexta alemã (Gr+6) é enarmonicamente equivalente a que acorde comum?',
    choices: [
      'Sétima da dominante',
      'Sétima diminuta',
      'Sétima meio-diminuta',
      'Sétima maior',
    ],
    hint: 'A Gr+6 tem as mesmas classes de altura que um acorde de sétima da dominante. Por exemplo, em C menor a Gr+6 (Ab, C, Eb, F#) soa idêntica a Ab7 (Ab, C, Eb, Gb). A grafia diferente reflete destinos de condução de vozes diferentes.',
  },
  l6u18m3e2: {
    prompt: 'Como se escreve o acorde de sexta alemã numa tonalidade menor (por ex. C menor)?',
    choices: [
      "Ab, C, Eb, F# — b6, 1, b3, #4",
      'Ab, C, D, F# — b6, 1, 2, #4',
      'Ab, C, E, F# — b6, 1, 3, #4',
      'A, C, Eb, F# — 6, 1, b3, #4',
    ],
    hint: 'Em C menor, a Gr+6 contém b6 (Ab), 1 (C), b3 (Eb) e #4 (F#). O intervalo crucial de sexta aumentada está entre Ab e F#, que resolve divergentemente para G-G (oitava sobre a dominante).',
  },
  l6u18m3e3: {
    prompt: 'Qual é a resolução padrão da sexta alemã que evita quintas paralelas?',
    choices: [
      "Gr+6 → I6/4 → V",
      "Gr+6 → V → I6/4",
      'Gr+6 → IV6/4 → V',
      'Gr+6 → I6/4 → IV',
    ],
    hint: 'Como todos os acordes de sexta aumentada, a Gr+6 resolve para V. O b6 (normalmente no baixo) e o #4 (numa voz superior) afastam-se por meio-tom até à oitava na dominante. Um 6/4 cadencial intervém frequentemente para evitar quintas paralelas.',
  },

  // ---- l6u18m4: Modulação Enarmónica Gr+6 <-> V7 ----

  l6u18m4e1: {
    prompt: 'Qual é o princípio fundamental por detrás da modulação enarmónica usando Gr+6 e V7?',
    choices: [
      'As mesmas alturas sonoras; nova função harmónica e resolução',
      'As mesmas alturas sonoras; mantêm-se a função e a resolução originais',
      'As mesmas alturas sonoras; basta nova armação de clave sem reinterpretação harmónica',
      'As mesmas alturas sonoras; é necessária uma alteração de meio-tom antes da reinterpretação',
    ],
    hint: 'Uma vez que Gr+6 e V7 são enarmonicamente idênticos, uma única sonoridade pode pivotar entre duas tonalidades distantes. A reescrita muda qual voz conduz para onde, redirecionando a trajetória harmónica.',
  },
  l6u18m4e2: {
    prompt: 'Quantos meios-tons separam as tonalidades ligadas por modulação enarmónica direta Gr+6/V7?',
    choices: [
      '1',
      '2',
      '7',
      '6',
    ],
    hint: 'Os acordes pivot diatónicos funcionam melhor entre tonalidades próximas. Reinterpretar a Gr+6 da tonalidade como V7 (ou vice-versa) move a tónica meio-tom — de C para Db são cinco passos no círculo de quintas, uma tonalidade distante alcançada através de um único acorde. É uma técnica-assinatura dos compositores do período romântico.',
    nudge: 'Reescreve a Gr+6 de C maior (Ab, C, Eb, F#) com Gb em vez de F#: de que tonalidade passa a ser o V7? Depois mede o afastamento entre essa tónica e C, como intervalo e no círculo de quintas.',
  },
  l6u18m4e3: {
    prompt: 'Se uma Gr+6 em C menor (Ab, C, Eb, F#) for reinterpretada como V7, que tonalidade toniciza agora?',
    choices: [
      'Db maior/menor — reescrita como Ab, C, Eb, Gb = Ab7 = V7/Db',
      "G maior/menor — reescrita como Ab, C, Eb, Gb = Ab7 = V7/G",
      "F maior/menor — reescrita como Ab, C, Eb, Gb = Ab7 = V7/F",
      "Eb maior/menor — reescrita como Ab, C, Eb, Gb = Ab7 = V7/Eb",
    ],
    hint: 'Reescrever F# como Gb transforma o acorde em Ab, C, Eb, Gb = Ab sétima da dominante. Ab7 é V7 de Db, portanto a música pode pivotar suavemente de C menor para Db maior — uma deslocação de meio-tom, ligando território tonal muito distante.',
  },

  // =========================================================================
  // Unidade 19: Técnicas Cromáticas Avançadas
  // =========================================================================

  // ---- l6u19m1: Modulação Enarmónica via dim7 ----

  l6u19m1e1: {
    prompt:
      'Constrói um acorde de sétima diminuta sobre C. Seleciona as 4 notas.',
    hint: 'Um acorde de sétima diminuta empilha três terças menores: C (0), Eb (3), Gb (6), Bbb (9). Estas quatro classes de altura dividem a oitava em partes iguais. Bbb é enarmonicamente A.',
  },
  l6u19m1e2: {
    prompt: 'Que espaçamento cíclico em meios-tons explica a simetria de um acorde de sétima diminuta?',
    choices: [
      '3 + 3 + 3 + 3',
      '2 + 4 + 2 + 4',
      '1 + 5 + 1 + 5',
      '3 + 3 + 4 + 2',
    ],
    hint: 'O acorde dim7 é construído inteiramente com terças menores (3 meios-tons cada). Como 3 x 4 = 12, as quatro notas dividem a oitava uniformemente. Isto significa que cada inversão do acorde soa idêntica na sua estrutura intervalar.',
  },
  l6u19m1e3: {
    prompt: 'Quantas tónicas diferentes pode um único acorde de sétima diminuta ter como alvo, funcionando como acorde de sensível (vii°7)?',
    choices: [
      "Quatro tónicas",
      "Duas tónicas",
      "Doze tónicas",
      "Uma tónica",
    ],
    hint: 'Devido à sua simetria, cada nota do acorde dim7 pode ser reescrita como sensível resolvendo ascendentemente por meio-tom para uma tónica diferente. C-Eb-Gb-Bbb pode ser vii°7 de Db, E, G ou Bb.',
  },

  // ---- l6u19m2: Sétima Diminuta com Nota Comum ----

  l6u19m2e1: {
    prompt: 'Que sonoridade de quatro notas pode ornamentar F maior como sétima diminuta com nota comum, mantendo F?',
    choices: [
      'F–G#–B–D',
      'F–A–C–E',
      'F–A–C–Eb',
      'F–Ab–C–Eb',
    ],
    hint: 'A sétima diminuta com nota comum mantém uma nota (a nota comum) do acorde que ornamenta. As outras três vozes movem-se por grau conjunto, criando uma ornamentação cromática por bordaduras.',
  },
  l6u19m2e2: {
    prompt: 'Num CTo7 que ornamenta um acorde de C maior, qual é tipicamente a nota comum?',
    choices: [
      "C",
      "E",
      "G",
      'E e G',
    ],
    hint: 'A forma mais comum mantém a fundamental do acorde-alvo. Para um CTo7 que ornamenta C maior, C é mantido enquanto as outras vozes (D#, F#, A) se movem por grau conjunto de volta para as notas do acorde de C maior.',
  },
  l6u19m2e3: {
    prompt: 'Qual é a função principal de um acorde de sétima diminuta com nota comum?',
    choices: [
      'Ornamentação de um acorde',
      'Tonicização de um acorde',
      'Substituição da dominante',
      'Modulação para outra tonalidade',
    ],
    hint: 'Ao contrário do vii°7 (que tem função dominante), o CTo7 é puramente ornamental. Ornamenta um acorde através de movimento por bordaduras cromáticas, acrescentando cor sem mudar a direção harmónica.',
  },

  // ---- l6u19m3: Mediantes Cromáticas ----

  l6u19m3e1: {
    prompt: 'Que par exemplifica uma relação de mediante cromática?',
    choices: [
      'C maior → E maior',
      'C maior → G maior',
      'C maior → F maior',
      'C maior → A menor',
    ],
    hint: 'As mediantes diatónicas (I-iii, I-vi) partilham duas notas comuns. Mediantes cromáticas como C maior para E maior ou Ab maior têm fundamentais a uma 3.ª de distância e a mesma qualidade (ambos maiores ou ambos menores), com uma nota comum. As mediantes duplamente cromáticas, como C maior para Eb menor, não partilham nenhuma.',
  },
  l6u19m3e2: {
    prompt: 'Quantos tipos de relações de terça cromática existem entre tríades maiores?',
    choices: [
      "Quatro tipos",
      "Dois tipos",
      "Seis tipos",
      "Três tipos",
    ],
    hint: 'A partir de qualquer tríade maior, podes mover-te para outra tríade maior a uma 3.ª maior ou menor acima ou abaixo: C para E, C para Eb, C para A, C para Ab. Cada uma produz uma cor diferente, e as quatro são mediantes cromáticas.',
  },
  l6u19m3e3: {
    prompt: 'Na passagem de C maior para E maior, que condução suave mantém a nota comum E?',
    choices: [
      'C→B, E→E, G→G#',
      'C→C#, E→E, G→G#',
      'C→B, E→E, G→G',
      'C→C#, E→E, G→G',
    ],
    hint: 'As mediantes cromáticas partilham frequentemente uma nota comum enquanto as outras vozes se deslocam por meio-tom. Em alguns casos (mediantes duplamente cromáticas como C maior para Ab menor, Ab-Cb-Eb) não há notas comuns, e todas as vozes se deslocam meio-tom: C para Cb, E para Eb, G para Ab.',
  },

  // ---- l6u19m4: Técnicas Tardo-Românticas ----

  l6u19m4e1: {
    prompt: 'O que caracteriza a "harmonia não funcional" na música tardo-romântica?',
    choices: [
      'As ligações entre acordes são moldadas sobretudo por alturas partilhadas e movimento suave de cada parte',
      'As ligações entre acordes são moldadas sobretudo pelo movimento de todas as vozes pelo mesmo trítono',
      'As ligações entre acordes são moldadas sobretudo pela eliminação de notas comuns entre acordes sucessivos',
      'As ligações entre acordes são moldadas sobretudo pela alternância de dois acordes fixos ao longo da peça',
    ],
    hint: 'Na harmonia não funcional, as progressões de acordes são impulsionadas pela condução suave de vozes, notas comuns ou efeito colorístico em vez do ciclo funcional tradicional T-PD-D-T. Wagner, Liszt e o Chopin tardio foram pioneiros desta abordagem.',
  },
  l6u19m4e2: {
    prompt: 'O que é planing cromático (harmonia paralela)?',
    choices: [
      'Todas as partes movem-se por um intervalo idêntico, preservando os intervalos do acorde',
      'Todas as partes movem-se para notas da tonalidade, ajustando os intervalos do acorde',
      'Todas as partes exceto o baixo ficam fixas enquanto o baixo muda',
      'Todas as partes movem-se para as notas disponíveis mais próximas do acorde',
    ],
    hint: 'O planing move uma estrutura inteira de acorde (ex. uma tríade maior ou acorde de sétima da dominante) para cima ou para baixo cromaticamente ou por tons inteiros, mantendo a mesma disposição. Debussy usou esta técnica extensamente.',
  },
  l6u19m4e3: {
    prompt: 'A que se refere a "dissolução da tonalidade" na música do final do século XIX?',
    choices: [
      'A perda de uma tonalidade de referência segura devido ao cromatismo generalizado e à modulação remota',
      'A perda de um compasso regular devido à mudança constante de indicações de compasso',
      'A perda de harmonia de acordes a favor de uma única melodia em uníssono',
      'A perda de repetição temática a favor de material continuamente novo',
    ],
    hint: 'Compositores como Wagner (Tristan und Isolde) usaram cromatismo contínuo, resoluções interrompidas e ambiguidade enarmónica tão extensamente que a sensação de uma tonalidade "casa" tornou-se elusiva — abrindo caminho para a atonalidade no século XX.',
  },

  // =========================================================================
  // Unidade 20: Contraponto e Escrita a Partes
  // =========================================================================

  // ---- l6u20m1: Contraponto de Espécies 1-3 ----

  l6u20m1e1: {
    prompt: 'Qual é o conjunto completo de intervalos consonantes permitidos acima do cantus firmus inferior na primeira espécie?',
    choices: [
      'Uníssonos, 3.as, 5.as perfeitas, 6.as e oitavas',
      'Uníssonos, 3.as, 4.as, 5.as perfeitas, 6.as e oitavas',
      'Uníssonos, 5.as perfeitas e oitavas',
      'Uníssonos, 2.as, 4.as, 6.as e oitavas',
    ],
    hint: 'A primeira espécie permite apenas consonâncias: consonâncias perfeitas (1P, 5P, 8P) e consonâncias imperfeitas (terças e sextas). Dissonâncias (segundas, quartas, sétimas, trítonos) são proibidas na primeira espécie.',
  },
  l6u20m1e2: {
    prompt: 'No contraponto de segunda espécie (duas notas contra uma), como são tratadas as dissonâncias?',
    choices: [
      "As dissonâncias podem aparecer apenas em tempos fracos como notas de passagem abordadas e deixadas por grau conjunto",
      "As dissonâncias podem aparecer apenas em tempos fortes como notas de passagem abordadas e deixadas por grau conjunto",
      "As dissonâncias podem aparecer apenas em tempos fracos como notas de passagem abordadas e deixadas por salto",
      "As dissonâncias podem aparecer apenas em tempos fortes como notas de passagem abordadas e deixadas por salto",
    ],
    hint: 'A segunda espécie introduz a nota de passagem: uma dissonância num tempo fraco que preenche o espaço entre duas consonâncias por movimento por grau conjunto. Os tempos fortes devem continuar consonantes.',
  },
  l6u20m1e3: {
    prompt: 'Que relação rítmica define o contraponto de terceira espécie?',
    choices: [
      "Quatro notas no contraponto contra cada nota do cantus firmus",
      "Três notas no contraponto contra cada nota do cantus firmus",
      "Duas notas no contraponto contra cada nota do cantus firmus",
      "Uma nota no contraponto contra cada nota do cantus firmus",
    ],
    hint: 'A terceira espécie coloca quatro semínimas contra cada semibreve do cantus firmus. Isto introduz bordaduras e notas de passagem duplas (duas notas de passagem seguidas, movendo-se por grau conjunto numa só direção para preencher uma quarta) além das notas de passagem da segunda espécie.',
  },

  // ---- l6u20m2: Contraponto de Espécies 4-5 ----

  l6u20m2e1: {
    prompt: 'Qual destas opções descreve uma suspensão de quarta espécie?',
    choices: [
      "A preparação no tempo fraco prolonga-se na dissonância do tempo forte, resolvendo por grau conjunto da nota superior para a inferior",
      "A preparação no tempo forte prolonga-se na dissonância do tempo fraco, resolvendo por grau conjunto da nota superior para a inferior",
      "A preparação no tempo fraco prolonga-se na dissonância do tempo forte, resolvendo por grau conjunto da nota inferior para a superior",
      "A preparação no tempo forte prolonga-se na dissonância do tempo fraco, resolvendo por grau conjunto da nota inferior para a superior",
    ],
    hint: 'A quarta espécie introduz a suspensão: uma consonância num tempo fraco é ligada ao tempo forte seguinte onde se torna dissonância, depois resolve descendentemente por grau conjunto. Isto cria a textura sincopada característica.',
  },
  l6u20m2e2: {
    prompt: 'O que define o contraponto de quinta espécie (contraponto florido)?',
    choices: [
      'Uma mistura das espécies anteriores, com valores de nota variados e as suas regras de dissonância',
      'Uma mistura das espécies anteriores, com valores de nota variados mas sem as suas regras de dissonância',
      'Uma mistura das espécies anteriores, com um valor de nota fixo e as suas regras de dissonância',
      'Uma mistura das espécies anteriores, com um valor de nota fixo mas sem as suas regras de dissonância',
    ],
    hint: 'A quinta espécie (florida) combina técnicas de todas as quatro espécies anteriores numa linha melódica fluente. Usa semibreves, mínimas, semínimas, suspensões e notas de passagem de forma musicalmente satisfatória.',
  },
  l6u20m2e3: {
    prompt: 'Quais são as três fases de uma suspensão corretamente executada?',
    choices: [
      "Preparação (consonância), suspensão (dissonância no tempo forte), resolução (grau conjunto descendente)",
      "Preparação (dissonância), suspensão (consonância no tempo forte), resolução (grau conjunto descendente)",
      "Preparação (consonância), suspensão (dissonância no tempo forte), resolução (grau conjunto ascendente)",
      "Preparação (dissonância), suspensão (consonância no tempo forte), resolução (grau conjunto ascendente)",
    ],
    hint: 'Uma suspensão requer: (1) Preparação — a nota é introduzida como consonância; (2) Suspensão — a nota é mantida (ligada) num tempo forte onde se torna dissonante; (3) Resolução — a nota resolve descendentemente por grau conjunto para uma consonância.',
  },

  // ---- l6u20m3: Contraponto a Três Partes/Invertível ----

  l6u20m3e1: {
    prompt: 'O que significa "contraponto invertível à oitava"?',
    choices: [
      'A linha superior pode passar a inferior mantendo contraponto válido',
      'A linha superior pode passar a inferior apenas abandonando o contraponto válido',
      'A linha superior continua superior enquanto ambas invertem a ordem das notas',
      'A linha superior continua superior enquanto ambas transpõem uma oitava',
    ],
    hint: 'No contraponto invertível à oitava, a voz A acima da voz B soa correta, E a voz B acima da voz A também soa correta. Quando as vozes trocam, os intervalos invertem-se: terças tornam-se sextas, quintas tornam-se quartas, etc.',
  },
  l6u20m3e2: {
    prompt: 'O que é contraponto triplo?',
    choices: [
      'Três linhas independentes podem permutar livremente as posições aguda, média e grave mantendo contraponto válido',
      'Três linhas independentes podem permutar posições apenas ficando o baixo original na posição mais grave',
      'Três linhas independentes podem permutar posições por rotação cíclica mas falham nas outras ordens',
      'Três linhas independentes podem permutar posições apenas ficando a melodia original na posição mais aguda',
    ],
    hint: 'Contraponto triplo significa que três vozes (A, B, C) podem ser reorganizadas em qualquer ordem — ABC, ACB, BAC, BCA, CAB, CBA — e todas as seis permutações produzem contraponto correto. Bach dominou esta técnica.',
  },
  l6u20m3e3: {
    prompt: 'Porque devem as quintas perfeitas ser evitadas ou tratadas cuidadosamente no contraponto invertível à oitava?',
    choices: [
      'A inversão dá uma 4.ª, tratada como dissonância acima do baixo',
      'A inversão dá um trítono, tratado como dissonância acima do baixo',
      'A inversão dá uma 2.ª, tratada como dissonância acima do baixo',
      'A inversão dá uma 7.ª, tratada como dissonância acima do baixo',
    ],
    hint: 'Quando as vozes se invertem à oitava, uma 5.ª perfeita torna-se uma 4.ª perfeita. No contraponto a duas vozes, quartas acima do baixo são dissonantes. Portanto, qualquer 5.ª perfeita no original torna-se um problema quando as vozes trocam de posição.',
  },

  // ---- l6u20m4: Escrita a Partes Avançada ----

  l6u20m4e1: {
    prompt: 'Quais são as quatro vozes da escrita coral, da mais aguda à mais grave?',
    choices: [
      "Soprano, Contralto, Tenor, Baixo",
      "Soprano, Tenor, Contralto, Baixo",
      "Baixo, Tenor, Contralto, Soprano",
      "Contralto, Soprano, Baixo, Tenor",
    ],
    hint: 'SATB significa Soprano (mais aguda), Contralto, Tenor e Baixo (mais grave). Soprano e Contralto partilham a pauta de clave de sol; Tenor e Baixo partilham a pauta de clave de fá na notação coral padrão.',
  },
  l6u20m4e2: {
    prompt: 'O que exige ao intérprete a realização de um baixo cifrado?',
    choices: [
      "Completar as harmonias acima da parte mais grave escrita, seguindo as cifras indicadas",
      'Tocar a linha de baixo sozinha, lendo os números como durações de acordes',
      'Duplicar a linha de baixo em três vozes superiores',
      'Transpor cada nota do baixo pelo intervalo indicado pelo número',
    ],
    hint: 'O baixo cifrado era a taquigrafia barroca para a harmonia. O intérprete lê a nota do baixo escrita e as cifras (números) abaixo dela, depois preenche as vozes superiores para criar acordes completos seguindo regras de condução de vozes.',
  },
  l6u20m4e3: {
    prompt: 'Ao ler uma partitura de instrumento transpositor (p. ex., clarinete em Bb), o que deves fazer para encontrar a altura real?',
    choices: [
      'Aplicar à altura escrita a transposição sonora do instrumento',
      'Aplicar à altura escrita uma transposição nula',
      'Aplicar à altura escrita a transposição sonora do instrumento ao contrário',
      'Aplicar à altura escrita uma transposição de oitava ascendente',
    ],
    hint: 'Um clarinete em Bb soa uma segunda maior abaixo do escrito. Quando a parte indica C, o instrumento soa Bb. A leitura de partitura exige conhecer a transposição de cada instrumento para ouvir as alturas reais (de concerto).',
  },
};

export default overlay;
