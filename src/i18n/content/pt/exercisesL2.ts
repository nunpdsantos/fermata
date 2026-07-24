import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese translations for Level 2 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidade 4: Todas as Tonalidades Maiores e Graus da Escala
  // =========================================================================

  // ---- l2u4m1: Todas as Tonalidades Maiores / Círculo de Quintas ----

  l2u4m1e1: {
    prompt: 'Qual é a ordem dos sustenidos tal como aparecem nas armações de clave?',
    choices: [
      'F C G D A E B',
      'B E A D G C F',
      'C G D A E B F',
      'F B E A D G C',
    ],
    hint: 'Lembra-te: os sustenidos acumulam-se nesta ordem fixa: F-C-G-D-A-E-B.',
  },
  l2u4m1e2: {
    prompt: 'Qual é a ordem dos bemóis tal como aparecem nas armações de clave?',
    choices: [
      'B E A D G C F',
      'F C G D A E B',
      'C F B E A D G',
      'E B A D G C F',
    ],
    hint: 'A ordem dos bemóis é o inverso dos sustenidos: B-E-A-D-G-C-F.',
  },
  l2u4m1e3: {
    prompt: 'Constrói a escala de D maior. Seleciona as 7 notas no instrumento. Lembra-te: D maior tem 2 sustenidos.',
    hint: 'D maior: D, E, F#, G, A, B, C#. Os dois sustenidos são F# e C#, seguindo a ordem dos sustenidos.',
  },
  l2u4m1e4: {
    prompt: 'Quantos sustenidos tem a tonalidade de A maior?',
    choices: [
      '3 sustenidos (F#, C#, G#)',
      '2 sustenidos (F#, C#)',
      '4 sustenidos (F#, C#, G#, D#)',
      '1 sustenido (F#)',
    ],
    hint: 'A maior está três passos no sentido dos ponteiros do relógio no círculo de quintas a partir de C: G (1#), D (2#), A (3#). Os sustenidos são F#, C#, G#.',
  },

  // ---- l2u4m2: Nomes dos Graus da Escala ----

  l2u4m2e1: {
    prompt: 'Qual é o nome do 5.o grau de qualquer escala maior?',
    choices: [
      'Dominante',
      'Subdominante',
      'Mediante',
      'Supertónica',
    ],
    hint: 'O 5.o grau chama-se dominante porque é a segunda nota mais importante após a tónica, dominando a tonalidade.',
  },
  l2u4m2e2: {
    prompt: 'Como se chama o 7.o grau da escala maior?',
    choices: [
      'Sensível',
      'Subtónica',
      'Dominante',
      'Supertónica',
    ],
    hint: 'Na escala maior, o 7.o grau está a meio-tom abaixo da tónica. "Conduz" fortemente para cima, em direção à tónica, daí chamar-se sensível.',
  },
  l2u4m2e3: {
    prompt: 'Qual grau da escala se chama subdominante?',
    choices: [
      '4.o grau',
      '5.o grau',
      '2.o grau',
      '6.o grau',
    ],
    hint: 'A subdominante é o 4.o grau. Situa-se uma 5.a abaixo da tónica (sub = abaixo), tal como a dominante se situa uma 5.a acima.',
  },

  // =========================================================================
  // Unidade 5: Escalas Menores e Relações entre Tonalidades
  // =========================================================================

  // ---- l2u5m1: Menor Natural ----

  l2u5m1e1: {
    prompt: 'Constrói a escala de A menor natural. Seleciona as 7 notas. Esta escala usa apenas teclas brancas.',
    hint: 'A menor natural: A, B, C, D, E, F, G. O padrão de intervalos é T-mT-T-T-mT-T-T. Sem sustenidos nem bemóis.',
  },
  l2u5m1e2: {
    prompt: 'Constrói a escala de E menor natural. Seleciona as 7 notas. Uma nota precisa de sustenido.',
    hint: 'E menor natural: E, F#, G, A, B, C, D. O F# é necessário para manter o padrão T-mT-T-T-mT-T-T.',
  },
  l2u5m1e3: {
    prompt: 'Qual é o padrão de intervalos da escala menor natural?',
    choices: [
      'T-mT-T-T-mT-T-T',
      'T-T-mT-T-T-T-mT',
      'T-mT-T-T-T-mT-T',
      'mT-T-T-mT-T-T-T',
    ],
    hint: 'A escala menor natural tem meios-tons entre os graus 2-3 e 5-6. Compara com a maior (T-T-mT-T-T-T-mT): o 3.o, 6.o e 7.o graus são baixados.',
  },
  l2u5m1e4: {
    prompt: 'Quais graus da escala menor natural são baixados em relação à escala maior?',
    choices: [
      '3.o, 6.o e 7.o',
      '2.o, 3.o e 6.o',
      '3.o e 7.o apenas',
      '2.o, 5.o e 7.o',
    ],
    hint: 'Compara C maior (C D E F G A B) com C menor natural (C D Eb F G Ab Bb). O 3.o, 6.o e 7.o graus são cada um baixados meio-tom.',
  },

  // ---- l2u5m2: Menor Harmónica/Melódica ----

  l2u5m2e1: {
    prompt: 'Constrói a escala de A menor harmónica. Seleciona as 7 notas. Em relação à menor natural, uma nota é elevada.',
    hint: 'A menor harmónica: A, B, C, D, E, F, G#. O 7.o grau (G) é elevado a G# para criar uma sensível de volta a A.',
  },
  l2u5m2e2: {
    prompt: 'Constrói a escala de A menor melódica (forma ascendente). Duas notas são elevadas em relação à menor natural.',
    hint: 'A menor melódica ascendente: A, B, C, D, E, F#, G#. Tanto o 6.o (F para F#) como o 7.o (G para G#) são elevados para suavizar a 2.a aumentada.',
  },
  l2u5m2e3: {
    prompt: 'O que distingue a menor harmónica da escala menor natural?',
    choices: [
      'O 7.o grau é elevado meio-tom',
      'O 6.o grau é elevado meio-tom',
      'O 3.o grau é elevado meio-tom',
      'O 2.o grau é baixado meio-tom',
    ],
    hint: 'A menor harmónica eleva o 7.o grau para criar uma sensível (meio-tom abaixo da tónica). Isto é essencial para formar o acorde de dominante (V) em tonalidades menores.',
  },
  l2u5m2e4: {
    prompt: 'Porque é que a escala menor melódica eleva tanto o 6.o como o 7.o grau na forma ascendente?',
    choices: [
      'Para eliminar a 2.a aumentada entre o 6.o e o 7.o grau elevado da menor harmónica',
      'Para igualar exatamente a escala maior',
      'Para facilitar a execução no piano',
      'Para remover todos os meios-tons da escala',
    ],
    hint: 'A menor harmónica tem uma 2.a aumentada incómoda (3 meios-tons) entre o 6.o e o 7.o grau elevado. Elevar também o 6.o suaviza esta distância para um tom.',
  },

  // ---- l2u5m3: Tonalidades Relativas/Paralelas ----

  l2u5m3e1: {
    prompt: 'Qual é a relativa menor de C maior?',
    choices: [
      'A menor',
      'C menor',
      'E menor',
      'D menor',
    ],
    hint: 'A relativa menor começa no 6.o grau da escala maior. Em C maior, o 6.o grau é A. Tanto C maior como A menor partilham a mesma armação de clave (sem sustenidos nem bemóis).',
  },
  l2u5m3e2: {
    prompt: 'Qual é a relativa maior de D menor?',
    choices: [
      'F maior',
      'D maior',
      'Bb maior',
      'G maior',
    ],
    hint: 'A relativa maior começa uma 3.a menor (3 meios-tons) acima da tonalidade menor. D mais 3 meios-tons = F. Tanto D menor como F maior partilham um bemol (Bb).',
  },
  l2u5m3e3: {
    prompt: 'Qual é a paralela menor de G maior?',
    choices: [
      'G menor',
      'E menor',
      'D menor',
      'B menor',
    ],
    hint: 'Tonalidades paralelas partilham a mesma fundamental mas diferem na qualidade. A paralela menor de G maior é G menor. Têm armações de clave diferentes.',
  },
  l2u5m3e4: {
    prompt: 'Qual é a diferença entre tonalidades relativas e tonalidades paralelas?',
    choices: [
      'Relativas partilham a mesma armação de clave; paralelas partilham a mesma tónica',
      'Relativas partilham a mesma tónica; paralelas partilham a mesma armação de clave',
      'Relativas são sempre maiores; paralelas são sempre menores',
      'Não há diferença; são o mesmo conceito',
    ],
    hint: 'C maior e A menor são relativas (mesma armação de clave: sem sustenidos/bemóis). C maior e C menor são paralelas (mesma tónica: C).',
  },

  // =========================================================================
  // Unidade 6: Compasso Composto e Síncopa
  // =========================================================================

  // ---- l2u6m1: Compasso Composto ----

  l2u6m1e1: {
    prompt: 'No compasso 6/8, como se organizam os tempos?',
    choices: [
      '2 tempos principais, cada um dividido em 3 colcheias',
      '6 tempos iguais de colcheias',
      '3 tempos principais, cada um dividido em 2 colcheias',
      '8 tempos agrupados em seis',
    ],
    hint: '6/8 é compasso composto binário: 6 colcheias agrupam-se em 2 grupos de 3. Cada grupo de 3 forma um tempo principal, dando a sensação UM-e-a DOIS-e-a.',
  },
  l2u6m1e2: {
    prompt: 'O que define o compasso composto?',
    choices: [
      'Cada tempo principal divide-se naturalmente em 3 partes iguais',
      'Cada tempo principal divide-se naturalmente em 2 partes iguais',
      'A indicação de compasso tem um número grande em cima',
      'O andamento é mais rápido que no compasso simples',
    ],
    hint: 'No compasso composto, a unidade de tempo é uma nota com ponto que se subdivide em três. No compasso simples, os tempos subdividem-se em dois.',
  },
  l2u6m1e3: {
    prompt: 'Quantos tempos principais tem o compasso 9/8?',
    choices: [
      '3 tempos principais (cada um dividido em 3 colcheias)',
      '9 tempos',
      '4 tempos principais',
      '2 tempos principais',
    ],
    hint: '9/8 é compasso composto ternário: 9 colcheias formam 3 grupos de 3. Cada grupo de 3 é um tempo principal (uma semínima com ponto).',
  },

  // ---- l2u6m2: Síncopa ----

  l2u6m2e1: {
    prompt: 'O que é síncopa?',
    choices: [
      'Colocar acentos em tempos normalmente fracos ou contratempos',
      'Tocar todas as notas com o mesmo volume',
      'Acelerar gradualmente o andamento',
      'Tocar notas numa oitava diferente',
    ],
    hint: 'A síncopa perturba o padrão rítmico esperado ao acentuar tempos ou partes de tempos normalmente não acentuados, criando tensão rítmica e energia.',
  },
  l2u6m2e2: {
    prompt: 'O que são tercinas?',
    choices: [
      '3 notas tocadas no tempo normalmente ocupado por 2 notas do mesmo valor',
      '3 notas tocadas uma após a outra',
      'Um acorde com 3 notas',
      '3 compassos agrupados',
    ],
    hint: 'As tercinas subdividem um tempo em 3 partes iguais em vez das habituais 2. Uma tercina de colcheias encaixa 3 colcheias no espaço de uma semínima.',
  },

  // =========================================================================
  // Unidade 7: Intervalos, Tríades e Harmonia Diatónica
  // =========================================================================

  // ---- l2u7m1: Qualidade do Intervalo ----

  l2u7m1e1: {
    prompt: 'Identifica o intervalo de C ascendente até G. Este é um dos intervalos mais consonantes da música.',
    hint: 'De C a G são 7 meios-tons. É uma 5.a perfeita -- o intervalo encontrado nos power chords e a base do círculo de quintas.',
  },
  l2u7m1e2: {
    prompt: 'Identifica o intervalo de C ascendente até Eb. Este intervalo dá aos acordes menores o seu som característico.',
    hint: 'De C a Eb são 3 meios-tons. É uma 3.a menor -- o intervalo que distingue os acordes menores dos maiores.',
  },
  l2u7m1e3: {
    prompt: 'Identifica o intervalo de D ascendente até B. Conta tanto os nomes das notas como os meios-tons.',
    hint: 'De D a B abrange 6 nomes de notas (D-E-F-G-A-B) = uma 6.a. D a B são 9 meios-tons, o que faz uma 6.a maior.',
  },
  l2u7m1e4: {
    prompt: 'O que torna um intervalo "perfeito"?',
    choices: [
      'Não tem variantes maior/menor -- apenas perfeito, aumentado ou diminuto',
      'Soa perfeitamente afinado',
      'Usa apenas teclas brancas no piano',
      'É sempre consonante',
    ],
    hint: 'Uníssonos, 4.as, 5.as e oitavas são intervalos "perfeitos". Ao contrário das 2.as, 3.as, 6.as e 7.as que têm pares maior/menor, os intervalos perfeitos têm apenas uma forma básica.',
  },
  l2u7m1e_ear1: {
    prompt: 'Ouve este intervalo e identifica-o.',
    hint: 'Este é um dos intervalos mais consonantes. Abrange 7 meios-tons e é a base do círculo de quintas.',
  },
  l2u7m1e_ear2: {
    prompt: 'Ouve este intervalo e identifica-o.',
    hint: 'Este intervalo brilhante e quente abrange 4 meios-tons e define o carácter dos acordes maiores.',
  },
  l2u7m1e_ear3: {
    prompt: 'Ouve este intervalo e identifica-o.',
    hint: 'Este intervalo abrange 5 meios-tons. É a inversão da 5.a perfeita.',
  },
  l2u7m1e_ear4: {
    prompt: 'Ouve este intervalo e identifica-o.',
    hint: 'Este intervalo mais sombrio abrange 3 meios-tons e dá aos acordes menores o seu som característico.',
  },

  // ---- l2u7m2: Aumentados/Diminutos/Compostos ----

  l2u7m2e1: {
    prompt: 'Identifica o intervalo de C ascendente até F#. Este intervalo divide a oitava exatamente ao meio.',
    hint: 'De C a F# (ou Gb) são 6 meios-tons -- exatamente metade de 12. É o trítono, também chamado 4.a aumentada ou 5.a diminuta.',
  },
  l2u7m2e2: {
    prompt: 'Identifica o intervalo de C ascendente até Db. Este é o menor intervalo com nome próprio.',
    hint: 'De C a Db é 1 meio-tom. É uma 2.a menor -- o menor intervalo na música ocidental padrão, criando tensão máxima.',
  },
  l2u7m2e3: {
    prompt: 'Identifica o intervalo de C ascendente até B. Este intervalo amplo está a apenas meio-tom de uma oitava.',
    hint: 'De C a B são 11 meios-tons. É uma 7.a maior -- um intervalo amplo e dissonante frequentemente usado em acordes de jazz.',
  },
  l2u7m2e4: {
    prompt: 'O que é um trítono?',
    choices: [
      'Um intervalo de 6 meios-tons que divide a oitava ao meio',
      'Um acorde construído a partir de 3 tons',
      'Um intervalo de 3 meios-tons',
      'Uma escala com 3 notas',
    ],
    hint: 'O trítono abrange 3 tons (6 meios-tons). Pode chamar-se 4.a aumentada ou 5.a diminuta. Na Idade Média era chamado "o diabo na música" devido à sua dissonância.',
  },

  // ---- l2u7m3: Os Quatro Tipos de Tríades ----

  l2u7m3e1: {
    prompt: 'Constrói uma tríade de D menor. Seleciona as 3 notas: fundamental, 3.a menor e 5.a perfeita.',
    hint: 'D menor = D, F, A. Fundamental (D) + 3.a menor (F, 3 meios-tons acima) + 5.a perfeita (A, 7 meios-tons acima da fundamental).',
  },
  l2u7m3e2: {
    prompt: 'Constrói uma tríade de B diminuta. Seleciona as 3 notas: fundamental, 3.a menor e 5.a diminuta.',
    hint: 'B diminuta = B, D, F. Fundamental (B) + 3.a menor (D, 3 meios-tons acima) + 5.a diminuta (F, 6 meios-tons acima da fundamental). Ambos os intervalos são 3.as menores empilhadas.',
  },
  l2u7m3e3: {
    prompt: 'Que notas compõem uma tríade aumentada construída sobre C?',
    choices: [
      'C, E, G# -- fundamental, 3.a maior, 5.a aumentada',
      'C, Eb, G -- fundamental, 3.a menor, 5.a perfeita',
      'C, E, G -- fundamental, 3.a maior, 5.a perfeita',
      'C, Eb, Gb -- fundamental, 3.a menor, 5.a diminuta',
    ],
    hint: 'Uma tríade aumentada empilha duas 3.as maiores: C a E (4 meios-tons) e E a G# (4 meios-tons). A 5.a é elevada (aumentada) em relação à tríade maior.',
  },
  l2u7m3e4: {
    prompt: 'Qual tipo de tríade é considerado o mais instável e dissonante?',
    choices: [
      'Diminuta -- duas 3.as menores com um trítono entre fundamental e 5.a',
      'Menor -- porque soa triste',
      'Maior -- porque é a mais comum',
      'Aumentada -- porque tem a 5.a elevada',
    ],
    hint: 'A tríade diminuta contém um trítono (6 meios-tons) entre a fundamental e a 5.a. Isso torna-a o tipo de tríade mais dissonante e instável, com forte necessidade de resolver.',
  },

  // ---- l2u7m4: Inversões/Baixo Cifrado ----

  l2u7m4e1: {
    prompt: 'Que números de baixo cifrado representam uma tríade em estado fundamental?',
    choices: [
      '5/3 (frequentemente abreviado não escrevendo nada)',
      '6/3',
      '6/4',
      '7/5/3',
    ],
    hint: 'No estado fundamental, os intervalos acima do baixo são uma 3.a e uma 5.a. O baixo cifrado escreve-os como 5/3. Como o estado fundamental é a posição por defeito, os números são geralmente omitidos.',
  },
  l2u7m4e2: {
    prompt: 'Que números de baixo cifrado representam uma tríade em 1.a inversão?',
    choices: [
      '6/3 (frequentemente abreviado para apenas 6)',
      '5/3',
      '6/4',
      '4/2',
    ],
    hint: 'Na 1.a inversão, a 3.a do acorde está no baixo. Os intervalos acima do baixo são uma 3.a e uma 6.a. O baixo cifrado abrevia 6/3 para apenas 6.',
  },
  l2u7m4e3: {
    prompt: 'O que é uma inversão de tríade?',
    choices: [
      'Reorganizar o acorde para que uma nota diferente da fundamental fique no baixo',
      'Virar o acorde ao contrário para que a nota de cima fique em baixo',
      'Mudar o acorde de maior para menor',
      'Tocar o acorde numa tonalidade diferente',
    ],
    hint: 'As inversões mudam qual nota do acorde está no baixo. Estado fundamental tem a fundamental no baixo, 1.a inversão tem a 3.a, 2.a inversão tem a 5.a. A identidade do acorde mantém-se.',
  },

  // ---- l2u7m5: Tríades Diatónicas/Numeração Romana ----

  l2u7m5e1: {
    prompt: 'Numa tonalidade maior, qual é a qualidade do acorde iii (construído sobre o 3.o grau)?',
    choices: [
      'Menor',
      'Maior',
      'Diminuta',
      'Aumentada',
    ],
    hint: 'As tríades diatónicas na escala maior são: I(M) ii(m) iii(m) IV(M) V(M) vi(m) vii\u00b0(dim). Algarismos romanos minúsculos indicam qualidade menor. O acorde iii é menor.',
  },
  l2u7m5e2: {
    prompt: 'Numa tonalidade maior, qual é a qualidade do acorde vii\u00b0 (construído sobre o 7.o grau)?',
    choices: [
      'Diminuta',
      'Menor',
      'Maior',
      'Aumentada',
    ],
    hint: 'O acorde construído sobre o 7.o grau da escala maior (ex: B-D-F em C maior) contém um trítono entre a fundamental e a 5.a, tornando-o diminuto. Nota-se viio.',
  },
  l2u7m5e3: {
    prompt: 'Constrói uma tríade de F maior. Este é o acorde IV na tonalidade de C maior.',
    hint: 'F maior = F, A, C. Fundamental (F) + 3.a maior (A, 4 meios-tons acima) + 5.a perfeita (C, 7 meios-tons acima da fundamental).',
  },
  l2u7m5e4: {
    prompt: 'Constrói uma tríade de A menor. Este é o acorde vi na tonalidade de C maior.',
    hint: 'A menor = A, C, E. Fundamental (A) + 3.a menor (C, 3 meios-tons acima) + 5.a perfeita (E, 7 meios-tons acima da fundamental).',
  },
};

export default overlay;
