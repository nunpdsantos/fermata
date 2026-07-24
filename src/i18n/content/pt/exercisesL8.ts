import type { ExerciseLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese translations for Level 8 hand-authored exercises
// Note names (C, D, E, F#, Bb, etc.) kept in international notation.
// ---------------------------------------------------------------------------

const overlay: ExerciseLevelOverlay = {
  // =========================================================================
  // Unidade 25: Fuga e Formas Imitativas
  // =========================================================================

  // ---- l8u25m1: Exposição da Fuga ----

  l8u25m1e1: {
    prompt:
      'Numa exposição de fuga, qual é a diferença entre o sujeito e a resposta?',
    choices: [
      'O sujeito é o tema principal apresentado primeiro; a resposta é a sua imitação na tonalidade da dominante',
      'O sujeito é tocado pelas cordas; a resposta é tocada pelos sopros',
      'O sujeito está em maior; a resposta está em menor',
      'O sujeito é rápido; a resposta é lenta',
    ],
    hint: 'O sujeito entra primeiro na tonalidade da tónica. A resposta segue na dominante, imitando o sujeito uma quinta acima (ou quarta abaixo).',
  },
  l8u25m1e2: {
    prompt:
      'O que distingue uma "resposta real" de uma "resposta tonal" numa fuga?',
    choices: [
      'Uma resposta real transpõe o sujeito exatamente; uma resposta tonal ajusta intervalos para se manter na tonalidade da dominante',
      'Uma resposta real é mais forte; uma resposta tonal é mais suave',
      'Uma resposta real usa o mesmo ritmo; uma resposta tonal altera o ritmo',
      'Uma resposta real está na mesma oitava; uma resposta tonal está uma oitava acima',
    ],
    hint: 'Uma resposta real é uma transposição exata para a dominante. Uma resposta tonal modifica certos intervalos (tipicamente os graus 1 e 5) para manter a coerência tonal.',
  },
  l8u25m1e3: {
    prompt: 'O que acontece durante a exposição de uma fuga?',
    choices: [
      'Cada voz entra sucessivamente com o sujeito ou a resposta até todas as vozes terem apresentado o tema',
      'Todas as vozes tocam o sujeito simultaneamente em uníssono',
      'O sujeito é desenvolvido através de fragmentação e sequência',
      'O sujeito é apresentado em aumentação e diminuição',
    ],
    hint: 'A exposição é a secção de abertura onde as vozes entram uma de cada vez, alternando entre sujeito (tónica) e resposta (dominante).',
  },

  // ---- l8u25m2: Episódios e Stretto ----

  l8u25m2e1: {
    prompt: 'Qual é a função principal de um episódio numa fuga?',
    choices: [
      'Modular entre tonalidades e proporcionar contraste usando fragmentos do sujeito',
      'Introduzir um tema completamente novo sem relação com o sujeito',
      'Reapresentar o sujeito em todas as vozes simultaneamente',
      'Concluir a fuga com uma cadência final',
    ],
    hint: 'Os episódios são passagens entre entradas do sujeito que tipicamente usam sequências construídas a partir de fragmentos do sujeito. Servem de pontes modulantes.',
  },
  l8u25m2e2: {
    prompt: 'O que é o "stretto" numa fuga?',
    choices: [
      'Entradas sobrepostas do sujeito onde uma nova voz começa antes de a anterior terminar',
      'Um aumento gradual do andamento em direção ao final da fuga',
      'A cadência final onde todas as vozes resolvem juntas',
      'Uma secção onde o sujeito é tocado de trás para a frente',
    ],
    hint: 'O stretto comprime as entradas do sujeito para que se sobreponham, criando contraponto intensificado. Aparece frequentemente perto do clímax da fuga.',
  },
  l8u25m2e3: {
    prompt: 'Na técnica de fuga, o que significa "aumentação"?',
    choices: [
      'O sujeito é apresentado com valores de nota duplicados (proporcionalmente mais longos)',
      'O sujeito é apresentado com notas cromáticas adicionais',
      'O sujeito é tocado por mais instrumentos do que originalmente',
      'O sujeito é transposto para uma oitava mais aguda',
    ],
    hint: 'A aumentação alonga o sujeito multiplicando as suas durações (tipicamente por dois). A diminuição faz o oposto, reduzindo os valores a metade.',
  },

  // ---- l8u25m3: Cânone ----

  l8u25m3e1: {
    prompt: 'O que é um cânone?',
    choices: [
      'Uma composição onde uma voz é imitada exatamente por outra voz que entra após um atraso',
      'Uma composição onde todas as vozes tocam melodias diferentes simultaneamente',
      'Uma composição com uma linha de baixo repetida',
      'Uma composição que modula por todas as doze tonalidades',
    ],
    hint: 'Um cânone é imitação estrita: uma voz (o líder ou dux) é seguida a um intervalo temporal fixo por uma ou mais vozes (o seguidor ou comes) que a copiam exatamente.',
  },
  l8u25m3e2: {
    prompt:
      'Num "cânone à quinta", como se relaciona o seguidor com o líder?',
    choices: [
      'O seguidor imita o líder transposto uma quinta perfeita acima (ou abaixo)',
      'O seguidor entra cinco tempos após o líder',
      'O seguidor toca apenas a quinta nota de cada frase',
      'O seguidor toca a melodia do líder cinco vezes',
    ],
    hint: 'O nome do intervalo refere-se à transposição de altura, não ao atraso temporal. Um cânone à quinta transpõe a melodia uma P5.',
  },
  l8u25m3e3: {
    prompt:
      'Qual é a diferença entre imitação estrita e imitação livre?',
    choices: [
      'A imitação estrita copia os intervalos exatamente; a imitação livre permite modificações por razões harmónicas ou melódicas',
      'A imitação estrita é mais rápida; a imitação livre é mais lenta',
      'A imitação estrita usa apenas consonâncias; a imitação livre usa apenas dissonâncias',
      'A imitação estrita é para música vocal; a imitação livre é para música instrumental',
    ],
    hint: 'A imitação estrita preserva cada intervalo com precisão. A imitação livre permite alterações aos intervalos mantendo a forma geral e o ritmo do modelo.',
  },

  // =========================================================================
  // Unidade 26: Grande Forma e Orquestração
  // =========================================================================

  // ---- l8u26m1: Forma-Sonata ----

  l8u26m1e1: {
    prompt:
      'Quais são as duas áreas temáticas principais apresentadas numa exposição em forma-sonata?',
    choices: [
      'Um primeiro tema na tónica e um segundo tema numa tonalidade contrastante (geralmente a dominante)',
      'Um tema rápido e um tema lento ambos na tónica',
      'Um tema para cordas e um tema para sopros na mesma tonalidade',
      'Um tema maior e a sua variante em modo menor',
    ],
    hint: 'A exposição estabelece o conflito tonal: o grupo temático principal está na tónica, o grupo temático secundário move-se para a dominante (ou relativo maior em tonalidades menores).',
  },
  l8u26m1e2: {
    prompt:
      'Qual é o propósito principal da secção de desenvolvimento na forma-sonata?',
    choices: [
      'Explorar, fragmentar e transformar material temático através de modulação e desenvolvimento motívico',
      'Introduzir temas inteiramente novos não ouvidos na exposição',
      'Repetir a exposição exatamente numa tonalidade diferente',
      'Proporcionar um contraste lento e lírico à exposição',
    ],
    hint: 'O desenvolvimento pega em ideias da exposição e trabalha-as através de várias tonalidades, sequências e técnicas contrapontísticas, construindo tensão em direção à reexposição.',
  },
  l8u26m1e3: {
    prompt:
      'Na reexposição de uma forma-sonata, em que tonalidade é apresentado o segundo tema?',
    choices: [
      'Na tonalidade da tónica, resolvendo o conflito tonal da exposição',
      'Na tonalidade da dominante, exatamente como na exposição',
      'Na tonalidade da subdominante como compromisso',
      'Numa tonalidade remota escolhida livremente pelo compositor',
    ],
    hint: 'A reexposição resolve a tensão harmónica trazendo ambos os grupos temáticos na tónica. O segundo tema, originalmente na dominante, regressa agora na tonalidade-mãe.',
  },

  // ---- l8u26m2: Variação, Rondó e Ritornello ----

  l8u26m2e1: {
    prompt:
      'Numa forma de tema e variações, o que se mantém constante ao longo das variações?',
    choices: [
      'A estrutura harmónica subjacente e/ou o contorno melódico do tema',
      'A melodia e ritmo exatos sem qualquer alteração',
      'Apenas o andamento e a dinâmica',
      'Nada; cada variação é completamente independente',
    ],
    hint: 'As variações tipicamente preservam a estrutura harmónica e fraseológica do tema enquanto alteram melodia, ritmo, textura ou modo.',
  },
  l8u26m2e2: {
    prompt: 'Qual padrão descreve melhor a forma de rondó?',
    choices: [
      'ABACA (ou ABACABA) — um estribilho recorrente alterna com episódios contrastantes',
      'AABB — duas secções cada uma repetida',
      'ABA — uma estrutura ternária com um meio contrastante',
      'ABCD — quatro secções diferentes tocadas uma vez cada',
    ],
    hint: 'A forma de rondó apresenta um tema principal (A) que regressa continuamente entre diferentes secções contrastantes (B, C, etc.). O padrão mínimo é ABACA.',
  },
  l8u26m2e3: {
    prompt: 'O que é uma chacona (ou passacaglia)?',
    choices: [
      'Um conjunto de variações contínuas sobre uma linha de baixo repetida ou progressão harmónica',
      'Uma dança rápida em metro ternário sem repetições',
      'Uma forma vocal com versos e estribilhos alternados',
      'Uma fuga com um sujeito cromático',
    ],
    hint: 'Uma chacona/passacaglia é uma forma de variação construída sobre um padrão de baixo repetido (baixo ostinato). As vozes superiores mudam enquanto o baixo cicla continuamente.',
  },

  // ---- l8u26m3: Orquestração ----

  l8u26m3e1: {
    prompt:
      'Quais são as quatro famílias padrão da orquestra moderna?',
    choices: [
      'Cordas, Madeiras, Metais, Percussão',
      'Cordas, Sopros, Teclados, Vozes',
      'Instrumentos agudos, Instrumentos graves, Ritmo, Melodia',
      'Violinos, Violoncelos, Trompetes, Tambores',
    ],
    hint: 'As secções orquestrais padrão são: Cordas (violino, viola, violoncelo, contrabaixo), Madeiras (flauta, oboé, clarinete, fagote), Metais (trompa, trompete, trombone, tuba) e Percussão.',
  },
  l8u26m3e2: {
    prompt:
      'O que significa um instrumento ser um "instrumento transpositor"?',
    choices: [
      'A sua altura escrita difere da altura que realmente soa (altura de concerto)',
      'Consegue tocar em qualquer tonalidade sem dificuldade',
      'Consegue mudar a sua afinação durante uma interpretação',
      'Transpõe a música automaticamente para o intérprete',
    ],
    hint: 'Um instrumento transpositor produz uma altura diferente da que está escrita. Isto simplifica as dedilhações entre famílias de instrumentos de tamanhos diferentes.',
  },
  l8u26m3e3: {
    prompt:
      'Quando um clarinete em Bb toca um C escrito, que altura de concerto soa?',
    choices: [
      'Bb (uma 2.a maior abaixo do escrito)',
      'D (uma 2.a maior acima do escrito)',
      'C (igual ao escrito)',
      'Eb (uma 3.a menor acima do escrito)',
    ],
    hint: 'Um instrumento em Bb soa uma 2.a maior abaixo do escrito. Quando o intérprete lê C, o ouvinte ouve Bb. Para soar um C de concerto, o intérprete tem de ler D.',
  },

  // =========================================================================
  // Unidade 27: Pós-Tonal e Contemporâneo
  // =========================================================================

  // ---- l8u27m1: Conjuntos de Classes de Altura ----

  l8u27m1e1: {
    prompt:
      'Na notação por inteiros de classes de altura, que número representa a nota C?',
    choices: ['0', '1', '12', '7'],
    hint: 'A notação por inteiros de classes de altura atribui C = 0, C#/Db = 1, D = 2, e assim por diante até B = 11. O sistema é módulo 12.',
  },
  l8u27m1e2: {
    prompt:
      'O que é a "forma normal" de um conjunto de classes de altura?',
    choices: [
      'O arranjo das classes de altura em ordem ascendente dentro da menor extensão intervalar possível',
      'A ordem em que as notas aparecem na partitura',
      'O arranjo por frequência do mais grave ao mais agudo',
      'Um arranjo alfabético dos nomes das notas',
    ],
    hint: 'A forma normal é o arranjo ascendente mais compacto de um conjunto de classes de altura. Rodas por todas as ordenações e escolhes a que tem o menor intervalo exterior.',
  },
  l8u27m1e3: {
    prompt:
      'Qual é o propósito de reduzir um conjunto de classes de altura à sua "forma primária"?',
    choices: [
      'Criar uma etiqueta padrão para que conjuntos relacionados por transposição e inversão partilhem a mesma identidade',
      'Determinar em que tonalidade a música está',
      'Encontrar a fundamental de um acorde',
      'Converter o conjunto em notação musical padrão',
    ],
    hint: 'A forma primária é a versão mais reduzida de um conjunto, começando em 0 e compactada o mais possível à esquerda. Permite comparar conjuntos independentemente da transposição ou inversão.',
  },

  // ---- l8u27m2: Técnica dos Doze Sons ----

  l8u27m2e1: {
    prompt: 'O que é uma série dodecafónica?',
    choices: [
      'Uma ordenação de todas as 12 classes de altura, cada uma aparecendo exatamente uma vez, usada como base de uma composição',
      'Uma escala cromática tocada do grave ao agudo',
      'Uma série de 12 acordes usados como progressão harmónica',
      'Doze compassos de música que se repetem ao longo da peça',
    ],
    hint: 'Uma série (ou série dodecafónica) é uma ordenação fixa das 12 classes de altura cromáticas. Nenhuma classe de altura se repete até todas as 12 terem soado.',
  },
  l8u27m2e2: {
    prompt:
      'Quais são as quatro formas básicas de uma série dodecafónica?',
    choices: [
      'Original (P), Retrógrada (R), Inversão (I), Retrógrada-Inversão (RI)',
      'Maior, Menor, Aumentada, Diminuta',
      'Tónica, Dominante, Subdominante, Sensível',
      'Original, Transposta, Modulada, Desenvolvida',
    ],
    hint: 'P é a série original. R inverte-a. I inverte todos os intervalos. RI aplica retrogradação e inversão. Cada uma pode também ser transposta para qualquer um dos 12 níveis.',
  },
  l8u27m2e3: {
    prompt: 'Qual é a função de uma matriz dos doze sons?',
    choices: [
      'Apresentar as 48 formas da série (12 transposições de P, R, I, RI) numa única grelha 12x12',
      'Mostrar que instrumentos tocam cada nota da série',
      'Converter números de classes de altura em notação padrão',
      'Calcular o ritmo harmónico de uma composição serial',
    ],
    hint: 'A matriz (ou quadrado mágico) é uma grelha 12x12. As linhas da esquerda para a direita dão as formas P, da direita para a esquerda as R, as colunas de cima para baixo as I e de baixo para cima as RI.',
  },

  // ---- l8u27m3: Técnicas do Século XX ----

  l8u27m3e1: {
    prompt:
      'O que é o "planing" (também chamado paralelismo) na música do início do século XX?',
    choices: [
      'Mover acordes ou intervalos em movimento paralelo, mantendo a mesma estrutura interválica',
      'Aumentar gradualmente o andamento ao longo de uma passagem',
      'Alternar entre duas tonalidades diferentes a cada compasso',
      'Escrever apenas em movimento por grau conjunto (movimento conjunto)',
    ],
    hint: 'O planing move uma forma de acorde ou intervalo fixa para cima ou para baixo em paralelo. Debussy usou famosamente tríades e acordes de nona paralelos, abandonando as regras tradicionais de condução de vozes.',
  },
  l8u27m3e2: {
    prompt: 'O que é a politonalidade?',
    choices: [
      'O uso simultâneo de duas ou mais tonalidades diferentes',
      'Música que muda frequentemente de tonalidade numa única linha melódica',
      'O uso de todos os doze sons igualmente sem centro tonal',
      'Uma textura com múltiplos padrões rítmicos independentes',
    ],
    hint: 'A politonalidade sobrepõe diferentes centros tonais ao mesmo tempo. A bitonalidade (duas tonalidades) é o tipo mais comum. Milhaud e Stravinsky usaram-na extensivamente.',
  },
  l8u27m3e3: {
    prompt: 'O que é o pandiatonicismo?',
    choices: [
      'O uso livre de todas as notas de uma escala diatónica sem harmonia funcional tradicional ou regras de condução de vozes',
      'Música que usa apenas escalas pentatónicas',
      'O uso de todos os doze sons cromáticos simultaneamente',
      'Uma melodia diatónica harmonizada exclusivamente com tríades',
    ],
    hint: 'O pandiatonicismo usa material diatónico (p. ex., todas as teclas brancas) mas sem hierarquia tonal ou progressões funcionais. Stravinsky e Copland empregaram-no livremente.',
  },

  // ---- l8u27m4: Minimalismo e Aleatoriedade ----

  l8u27m4e1: {
    prompt:
      'Qual das seguintes opções descreve melhor o minimalismo musical?',
    choices: [
      'Música construída sobre repetição extensiva de padrões curtos com mudanças graduais e subtis ao longo do tempo',
      'Música que utiliza o menor número possível de instrumentos',
      'Música que dura menos de um minuto',
      'Música que evita toda a repetição em favor de variação constante',
    ],
    hint: 'O minimalismo (Riley, Reich, Glass, Adams) apresenta padrões repetitivos, pulsação constante, harmonia consonante e processos lentos de transformação gradual.',
  },
  l8u27m4e2: {
    prompt: 'O que é música aleatória?',
    choices: [
      'Música em que algum elemento da composição ou interpretação é deixado ao acaso ou à escolha do intérprete',
      'Música composta inteiramente por um algoritmo de computador',
      'Música que é sempre interpretada a um andamento muito rápido',
      'Música que usa apenas instrumentos eletrónicos',
    ],
    hint: 'Aleatório vem do latim "alea" (dado). Cage, Lutoslawski e outros incorporaram aleatoriedade ou indeterminação do intérprete nas suas composições.',
  },
  l8u27m4e3: {
    prompt:
      'Qual das seguintes é um exemplo de uma "técnica expandida"?',
    choices: [
      'Tocar dentro do piano beliscando ou abafando as cordas diretamente',
      'Tocar uma escala padrão a um andamento muito rápido',
      'Usar um metrónomo durante a interpretação',
      'Ler à primeira vista uma peça nova',
    ],
    hint: 'As técnicas expandidas produzem sons não padrão: piano preparado, col legno, multifónicos, frullato, arco atrás do cavalete, e muitas mais.',
  },

  // ---- l8u27m5: Ritmo Avançado ----

  l8u27m5e1: {
    prompt: 'O que é uma polirritmia?',
    choices: [
      'Dois ou mais padrões rítmicos conflituantes executados simultaneamente',
      'Um único ritmo tocado por múltiplos instrumentos em uníssono',
      'Um ritmo que acelera gradualmente',
      'Um ritmo escrito numa fórmula de compasso composta',
    ],
    hint: 'A polirritmia sobrepõe diferentes agrupamentos rítmicos ao mesmo tempo (p. ex., tercinas contra pares, ou 4 contra 3). Cada camada mantém a sua própria divisão do pulso.',
  },
  l8u27m5e2: {
    prompt: 'O que é uma hemíola?',
    choices: [
      'Um recurso rítmico que cria o efeito de 3 tempos contra 2 (ou 2 contra 3) dentro do mesmo período de tempo',
      'Uma pausa que dura exatamente metade de um tempo',
      'Uma técnica em que o andamento duplica subitamente',
      'Um ritmo sincopado usado apenas no jazz',
    ],
    hint: 'A hemíola reagrupa os tempos de modo que o que se sentia em três é temporariamente sentido em dois, ou vice-versa. Comum na música barroca e nos ritmos latino-americanos.',
  },
  l8u27m5e3: {
    prompt: 'O que é a modulação métrica?',
    choices: [
      'Uma mudança de tempo conseguida reinterpretando um valor de nota do metro antigo como a unidade de tempo do novo metro',
      'Mudar de uma tonalidade maior para uma menor',
      'Tocar o mesmo ritmo numa oitava diferente',
      'Abrandar gradualmente no final de uma peça',
    ],
    hint: 'A modulação métrica (termo associado a Elliott Carter) usa um valor rítmico comum como pivot entre dois tempos. Por exemplo, uma colcheia em tercina no tempo antigo torna-se a nova colcheia.',
  },
};

export default overlay;
