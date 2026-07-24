import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 8 exercise templates
// 11 modules, ~60 generated exercises
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 25: Fuga e Contraponto Imitativo
  // =========================================================================

  // ---- l8u25m1: Exposição da Fuga ----
  l8u25m1: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa este elemento de uma exposição de fuga.',
      hintTemplate:
        'Exposição da fuga: o sujeito entra na tónica, a resposta entra na dominante (real ou tonal), as vozes seguintes entram alternando T-D. Um contra-sujeito acompanha cada nova entrada.',
      choiceSets: [
        [
          'O sujeito entra primeiro na tonalidade da tónica e a resposta entra na dominante',
          'A resposta entra na subdominante',
          'Tanto o sujeito como a resposta estão na tónica',
          'O sujeito entra primeiro na dominante',
        ],
        [
          'Uma resposta tonal ajusta intervalos para evitar tonicizar a dominante no ponto de entrada',
          'Uma resposta tonal transpõe o sujeito exatamente',
          'Uma resposta tonal está num metro diferente',
          'Respostas tonais e reais são conceitos idênticos',
        ],
        [
          'Uma resposta real transpõe o sujeito exatamente para a dominante (uma P5 acima ou P4 abaixo)',
          'Uma resposta real modifica alguns intervalos',
          'Uma resposta real usa inversão',
          'Uma resposta real está sempre na tónica',
        ],
        [
          'O contra-sujeito é uma linha melódica recorrente que acompanha cada nova entrada do sujeito',
          'O contra-sujeito é o mesmo que o sujeito',
          'O contra-sujeito só aparece uma vez',
          'O contra-sujeito está sempre em uníssono com a resposta',
        ],
      ],
    },
  ],

  // ---- l8u25m2: Episódios e Stretto ----
  l8u25m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica esta técnica de fuga.',
      hintTemplate:
        'Episódios: passagens entre entradas do sujeito, frequentemente usando sequências baseadas em fragmentos. Stretto: entradas sobrepostas do sujeito onde a resposta começa antes de o sujeito terminar.',
      choiceSets: [
        [
          'No stretto, uma nova voz começa o sujeito antes de a voz anterior o ter terminado',
          'Stretto significa tocar o sujeito lentamente',
          'Stretto é o mesmo que um episódio',
          'Stretto só ocorre na exposição',
        ],
        [
          'Os episódios modulam entre áreas tonais, frequentemente usando sequências derivadas do sujeito',
          'Os episódios apresentam sempre o sujeito completo',
          'Os episódios nunca usam material do sujeito',
          'Os episódios devem permanecer na tonalidade da tónica',
        ],
        [
          'A aumentação apresenta o sujeito em valores de nota mais longos (durações duplicadas)',
          'Aumentação significa acrescentar mais notas ao sujeito',
          'A aumentação é o mesmo que a inversão',
          'A aumentação encurta os valores de nota',
        ],
        [
          'A diminuição apresenta o sujeito em valores de nota mais curtos (durações reduzidas a metade)',
          'Diminuição significa remover notas do sujeito',
          'A diminuição é o mesmo que a retrogradação',
          'A diminuição torna o sujeito mais forte',
        ],
      ],
    },
  ],

  // ---- l8u25m3: Cânone ----
  l8u25m3: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica este tipo de cânone.',
      hintTemplate:
        'Tipos de cânone: estrito (imitação exata), à oitava, à 5.a, em inversão (movimento contrário), em retrogradação (cânone de caranguejo), cânone duplo (2 cânones independentes).',
      choiceSets: [
        [
          'Um cânone em inversão (cânone espelhado) imita a melodia em movimento contrário',
          'Um cânone em inversão transpõe a melodia',
          'Um cânone em inversão inverte o ritmo',
          'Cânone em inversão é o mesmo que aumentação',
        ],
        [
          'Um cânone de caranguejo (canon cancrizans) apresenta a melodia em retrogradação',
          'Um cânone de caranguejo é tocado de lado',
          'Um cânone de caranguejo usa inversão',
          'Um cânone de caranguejo não tem relação com a melodia original',
        ],
        [
          'Um cânone perpétuo (infinito) regressa ao início sem interrupção',
          'Um cânone perpétuo acelera gradualmente',
          'Um cânone perpétuo acrescenta novas vozes indefinidamente',
          'Um cânone perpétuo tem sempre um final claro',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 26: Grande Forma e Orquestração
  // =========================================================================

  // ---- l8u26m1: Forma-Sonata ----
  l8u26m1: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa este aspeto da forma-sonata em detalhe.',
      hintTemplate:
        'Secções da forma-sonata: Exposição (P-T-S-C), Desenvolvimento (fragmentação, sequências, tonalidades remotas), Reexposição (tudo na tónica), Coda opcional.',
      choiceSets: [
        [
          'A transição na exposição modula da tónica para a área tonal secundária',
          'A transição permanece na tónica ao longo de toda a secção',
          'A transição introduz o segundo tema',
          'A transição é sempre omitida',
        ],
        [
          'O desenvolvimento tipicamente apresenta fragmentação, sequência e modulação por tonalidades remotas',
          'O desenvolvimento simplesmente repete a exposição',
          'O desenvolvimento permanece na tónica',
          'O desenvolvimento introduz temas inteiramente novos',
        ],
        [
          'Uma falsa reexposição começa o regresso do tema na tonalidade errada antes da verdadeira reexposição',
          'Uma falsa reexposição omite o primeiro tema',
          'Uma falsa reexposição está na tónica',
          'Falsas reexposições nunca ocorrem em sonatas clássicas',
        ],
        [
          'Numa sonata em tonalidade menor, o segundo tema está tipicamente no relativo maior (III)',
          'Em sonatas menores, o segundo tema permanece na tónica',
          'As sonatas menores usam a dominante para o segundo tema',
          'As sonatas menores não têm segundo tema',
        ],
      ],
    },
  ],

  // ---- l8u26m2: Variação, Rondó e Ritornello ----
  l8u26m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica a estrutura formal descrita.',
      hintTemplate:
        'Ritornello: passagem orquestral recorrente alternando com episódios solistas (concerto barroco). Sonata-rondó: ABACAB\'A combina princípios do rondó e da sonata.',
      choiceSets: [
        [
          'A forma de ritornello alterna passagens de tutti orquestral com episódios solistas',
          'O ritornello é o mesmo que o rondó',
          'O ritornello só usa solistas',
          'O ritornello não tem material recorrente',
        ],
        [
          'O sonata-rondó combina o tema A recorrente do rondó com as relações tonais da forma-sonata',
          'O sonata-rondó é simplesmente um rondó',
          'O sonata-rondó não tem tema recorrente',
          'O sonata-rondó limita-se à música vocal',
        ],
        [
          'Uma passacaglia é um conjunto de variações sobre uma linha de baixo recorrente (baixo ostinato)',
          'Uma passacaglia não tem elemento recorrente',
          'Uma passacaglia é um tipo de rondó',
          'Uma passacaglia é o mesmo que uma fuga',
        ],
      ],
    },
  ],

  // ---- l8u26m3: Orquestração ----
  l8u26m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questão sobre orquestração e famílias de instrumentos.',
      hintTemplate:
        'Famílias da orquestra: cordas, madeiras, metais, percussão. Cada instrumento tem uma extensão, timbre e função característicos no conjunto.',
      choiceSets: [
        [
          'A ordem padrão da secção de cordas do mais agudo ao mais grave é: violino I, violino II, viola, violoncelo, contrabaixo',
          'As violas são mais agudas que os violinos',
          'Os violoncelos são mais agudos que as violas',
          'O contrabaixo é mais agudo que o violoncelo',
        ],
        [
          'Os instrumentos transpositores soam numa altura diferente da escrita: o clarinete em Bb soa uma 2.aM abaixo do escrito',
          'Todos os instrumentos orquestrais são não transpositores',
          'O clarinete em Bb soa mais agudo do que o escrito',
          'Apenas os instrumentos de percussão transpõem',
        ],
        [
          'A trompa em F soa uma 5.a perfeita abaixo do escrito',
          'A trompa em F soa uma 5.a perfeita acima do escrito',
          'A trompa em F é não transpositora',
          'A trompa em F soa uma oitava abaixo',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 27: Teoria dos Conjuntos e Técnicas do Século XX
  // =========================================================================

  // ---- l8u27m1: Conjuntos de Classes de Altura ----
  l8u27m1: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questão sobre a teoria dos conjuntos de classes de altura.',
      hintTemplate:
        'Classes de altura: C=0 até B=11. Um conjunto de classes de altura lista CAs únicas em ordem ascendente. A forma normal coloca-as no arranjo mais compacto.',
      choiceSets: [
        [
          'Um conjunto de classes de altura remove equivalência de oitava e enarmónica, usando inteiros de 0 a 11',
          'Conjuntos de classes de altura usam nomes de notas e números de oitava',
          'Conjuntos de classes de altura só funcionam para música tonal',
          'Os inteiros de conjuntos de classes de altura vão de 0 a 7',
        ],
        [
          'A forma normal arranja o conjunto na ordem ascendente mais compacta',
          'A forma normal começa sempre em C',
          'A forma normal usa ordem descendente',
          'Não existe ordenação padrão para conjuntos',
        ],
        [
          'O conjunto {C, E, G} = {0, 4, 7} é uma tríade maior expressa como classes de altura',
          '{0, 4, 7} representa uma tríade menor',
          '{0, 4, 7} representa uma tríade diminuta',
          'Tríades não podem ser expressas como conjuntos de classes de altura',
        ],
      ],
    },
  ],

  // ---- l8u27m2: Vetores Intervalares e Classes de Conjuntos ----
  l8u27m2: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa vetores intervalares e propriedades de classes de conjuntos.',
      hintTemplate:
        'Vetor intervalar: contagens de cada classe de intervalo (ci 1-6) num conjunto, escrito como <x x x x x x>. Dois conjuntos são Z-relacionados quando partilham o mesmo vetor intervalar mas NÃO estão relacionados por transposição ou inversão (pertencem a classes de conjuntos diferentes).',
      choiceSets: [
        [
          'O vetor intervalar conta ocorrências de cada classe de intervalo (1 a 6) num conjunto de classes de altura',
          'O vetor intervalar conta apenas intervalos perfeitos',
          'O vetor intervalar usa nomes de notas',
          'Vetores intervalares são o mesmo que a forma normal',
        ],
        [
          'A forma primária transpõe e/ou inverte um conjunto para a sua forma mais compacta começando em 0',
          'A forma primária é o mesmo que a forma normal',
          'A forma primária apenas transpõe',
          'A forma primária começa sempre na nota mais aguda',
        ],
        [
          'Conjuntos Z-relacionados partilham o mesmo vetor intervalar mas não são equivalentes por transposição/inversão',
          'Z-relacionados significa que são transposicionalmente equivalentes',
          'Conjuntos Z-relacionados têm vetores intervalares diferentes',
          'A relação-Z não existe na teoria dos conjuntos',
        ],
      ],
    },
  ],

  // ---- l8u27m3: Técnica dos Doze Sons ----
  l8u27m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questão sobre técnica dodecafónica (serial).',
      hintTemplate:
        'A série usa todas as 12 classes de altura numa ordem fixa. Transformações: P (original), I (inversão), R (retrógrada), RI (retrógrada-inversão). A matriz 12x12 organiza as 48 formas da série.',
      choiceSets: [
        [
          'Uma série dodecafónica usa cada uma das 12 classes de altura exatamente uma vez antes de qualquer repetição',
          'Uma série pode repetir alturas livremente',
          'Uma série usa apenas 7 alturas',
          'Uma série deve ser uma escala',
        ],
        [
          'As quatro transformações básicas da série são Original, Inversão, Retrógrada e Retrógrada-Inversão',
          'Existem apenas 2 transformações da série',
          'As transformações da série incluem aumentação e diminuição',
          'Séries não podem ser transformadas',
        ],
        [
          'A matriz 12x12 contém as 48 formas possíveis (12P + 12I + 12R + 12RI)',
          'A matriz tem 24 formas da série',
          'A matriz tem 144 formas da série',
          'Cada forma da série é exclusiva de uma célula',
        ],
      ],
    },
  ],

  // ---- l8u27m4: Minimalismo e Pós-minimalismo ----
  l8u27m4: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica as características desta técnica do século XX/XXI.',
      hintTemplate:
        'Minimalismo: padrões repetitivos, processo gradual, material harmónico limitado. Pioneiros: Reich (desfasamento), Glass (processo aditivo), Riley (loops de fita).',
      choiceSets: [
        [
          'O desfasamento desloca gradualmente dois padrões idênticos para fora de sincronia, criando texturas em evolução',
          'O desfasamento mantém os padrões perfeitamente sincronizados',
          'O desfasamento usa técnica dodecafónica',
          'O desfasamento envolve alterar o conteúdo de alturas',
        ],
        [
          'O processo aditivo acrescenta gradualmente notas a um padrão repetido, criando uma melodia que se expande lentamente',
          'O processo aditivo remove notas dos padrões',
          'O processo aditivo muda de tonalidade a cada repetição',
          'O processo aditivo é o mesmo que tema e variações',
        ],
      ],
    },
  ],

  // ---- l8u27m5: Espectralismo e Técnicas Expandidas ----
  l8u27m5: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica esta técnica composicional contemporânea.',
      hintTemplate:
        'Espectralismo: composição baseada nas propriedades acústicas do som (série de harmónicos, análise espectral). Técnicas expandidas: formas não convencionais de tocar instrumentos.',
      choiceSets: [
        [
          'A música espectral deriva a harmonia da série de harmónicos e da análise acústica do som',
          'A música espectral usa harmonia tonal tradicional',
          'A música espectral baseia-se na técnica dodecafónica',
          'A música espectral evita todos os sons com altura definida',
        ],
        [
          'As técnicas expandidas incluem multifónicos, piano preparado, col legno e harmónicos',
          'As técnicas expandidas são execução orquestral padrão',
          'As técnicas expandidas aplicam-se apenas à percussão',
          'As técnicas expandidas foram inventadas no período barroco',
        ],
        [
          'A microtonalidade divide a oitava em intervalos menores que um semitom',
          'A microtonalidade usa apenas as 12 alturas padrão',
          'Microtonalidade significa tocar muito suavemente',
          'A microtonalidade é o mesmo que a atonalidade',
        ],
      ],
    },
  ],
};

export default overlay;
