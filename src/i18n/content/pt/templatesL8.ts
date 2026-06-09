import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// European Portuguese (PT-PT) overlay for Level 8 exercise templates
// 11 modules, ~60 generated exercises
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidade 25: Fuga e Contraponto Imitativo
  // =========================================================================

  // ---- l8u25m1: Exposicao da Fuga ----
  l8u25m1: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa este elemento de uma exposicao de fuga.',
      hintTemplate:
        'Exposicao da fuga: o sujeito entra na tonica, a resposta entra na dominante (real ou tonal), as vozes seguintes entram alternando T-D. Um contra-sujeito acompanha cada nova entrada.',
      choiceSets: [
        [
          'O sujeito entra primeiro na tonalidade da tonica e a resposta entra na dominante',
          'A resposta entra na subdominante',
          'Tanto o sujeito como a resposta estao na tonica',
          'O sujeito entra primeiro na dominante',
        ],
        [
          'Uma resposta tonal ajusta intervalos para evitar tonicizar a dominante no ponto de entrada',
          'Uma resposta tonal transpoe o sujeito exatamente',
          'Uma resposta tonal esta num metro diferente',
          'Respostas tonais e reais sao conceitos identicos',
        ],
        [
          'Uma resposta real transpoe o sujeito exatamente para a dominante (uma P5 acima ou P4 abaixo)',
          'Uma resposta real modifica alguns intervalos',
          'Uma resposta real usa inversao',
          'Uma resposta real esta sempre na tonica',
        ],
        [
          'O contra-sujeito e uma linha melodica recorrente que acompanha cada nova entrada do sujeito',
          'O contra-sujeito e o mesmo que o sujeito',
          'O contra-sujeito so aparece uma vez',
          'O contra-sujeito esta sempre em unissono com a resposta',
        ],
      ],
    },
  ],

  // ---- l8u25m2: Episodios e Stretto ----
  l8u25m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica esta tecnica de fuga.',
      hintTemplate:
        'Episodios: passagens entre entradas do sujeito, frequentemente usando sequencias baseadas em fragmentos. Stretto: entradas sobrepostas do sujeito onde a resposta comeca antes de o sujeito terminar.',
      choiceSets: [
        [
          'No stretto, uma nova voz comeca o sujeito antes de a voz anterior o ter terminado',
          'Stretto significa tocar o sujeito lentamente',
          'Stretto e o mesmo que um episodio',
          'Stretto so ocorre na exposicao',
        ],
        [
          'Os episodios modulam entre areas tonais, frequentemente usando sequencias derivadas do sujeito',
          'Os episodios apresentam sempre o sujeito completo',
          'Os episodios nunca usam material do sujeito',
          'Os episodios devem permanecer na tonalidade da tonica',
        ],
        [
          'A aumentacao apresenta o sujeito em valores de nota mais longos (duracoes duplicadas)',
          'Aumentacao significa acrescentar mais notas ao sujeito',
          'A aumentacao e o mesmo que a inversao',
          'A aumentacao encurta os valores de nota',
        ],
        [
          'A diminuicao apresenta o sujeito em valores de nota mais curtos (duracoes reduzidas a metade)',
          'Diminuicao significa remover notas do sujeito',
          'A diminuicao e o mesmo que a retrogradacao',
          'A diminuicao torna o sujeito mais forte',
        ],
      ],
    },
  ],

  // ---- l8u25m3: Canone ----
  l8u25m3: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica este tipo de canone.',
      hintTemplate:
        'Tipos de canone: estrito (imitacao exata), a oitava, a 5.a, em inversao (movimento contrario), em retrogradacao (canone de caranguejo), canone duplo (2 canones independentes).',
      choiceSets: [
        [
          'Um canone em inversao (canone espelhado) imita a melodia em movimento contrario',
          'Um canone em inversao transpoe a melodia',
          'Um canone em inversao inverte o ritmo',
          'Canone em inversao e o mesmo que aumentacao',
        ],
        [
          'Um canone de caranguejo (canon cancrizans) apresenta a melodia em retrogradacao',
          'Um canone de caranguejo e tocado de lado',
          'Um canone de caranguejo usa inversao',
          'Um canone de caranguejo nao tem relacao com a melodia original',
        ],
        [
          'Um canone perpetuo (infinito) regressa ao inicio sem interrupcao',
          'Um canone perpetuo acelera gradualmente',
          'Um canone perpetuo acrescenta novas vozes indefinidamente',
          'Um canone perpetuo tem sempre um final claro',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 26: Grande Forma e Orquestracao
  // =========================================================================

  // ---- l8u26m1: Forma-Sonata ----
  l8u26m1: [
    {
      // multiple_choice
      promptTemplate:
        'Analisa este aspeto da forma-sonata em detalhe.',
      hintTemplate:
        'Seccoes da forma-sonata: Exposicao (P-T-S-C), Desenvolvimento (fragmentacao, sequencias, tonalidades remotas), Reexposicao (tudo na tonica), Coda opcional.',
      choiceSets: [
        [
          'A transicao na exposicao modula da tonica para a area tonal secundaria',
          'A transicao permanece na tonica ao longo de toda a seccao',
          'A transicao introduz o segundo tema',
          'A transicao e sempre omitida',
        ],
        [
          'O desenvolvimento tipicamente apresenta fragmentacao, sequencia e modulacao por tonalidades remotas',
          'O desenvolvimento simplesmente repete a exposicao',
          'O desenvolvimento permanece na tonica',
          'O desenvolvimento introduz temas inteiramente novos',
        ],
        [
          'Uma falsa reexposicao comeca o regresso do tema na tonalidade errada antes da verdadeira reexposicao',
          'Uma falsa reexposicao omite o primeiro tema',
          'Uma falsa reexposicao esta na tonica',
          'Falsas reexposicoes nunca ocorrem em sonatas classicas',
        ],
        [
          'Numa sonata em tonalidade menor, o segundo tema esta tipicamente no relativo maior (III)',
          'Em sonatas menores, o segundo tema permanece na tonica',
          'As sonatas menores usam a dominante para o segundo tema',
          'As sonatas menores nao tem segundo tema',
        ],
      ],
    },
  ],

  // ---- l8u26m2: Variacao, Rondo e Ritornello ----
  l8u26m2: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica a estrutura formal descrita.',
      hintTemplate:
        'Ritornello: passagem orquestral recorrente alternando com episodios solistas (concerto barroco). Sonata-rondo: ABACAB\'A combina principios do rondo e da sonata.',
      choiceSets: [
        [
          'A forma de ritornello alterna passagens de tutti orquestral com episodios solistas',
          'O ritornello e o mesmo que o rondo',
          'O ritornello so usa solistas',
          'O ritornello nao tem material recorrente',
        ],
        [
          'O sonata-rondo combina o tema A recorrente do rondo com as relacoes tonais da forma-sonata',
          'O sonata-rondo e simplesmente um rondo',
          'O sonata-rondo nao tem tema recorrente',
          'O sonata-rondo limita-se a musica vocal',
        ],
        [
          'Uma passacaglia e um conjunto de variacoes sobre uma linha de baixo recorrente (baixo ostinato)',
          'Uma passacaglia nao tem elemento recorrente',
          'Uma passacaglia e um tipo de rondo',
          'Uma passacaglia e o mesmo que uma fuga',
        ],
      ],
    },
  ],

  // ---- l8u26m3: Orquestracao ----
  l8u26m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questao sobre orquestracao e familias de instrumentos.',
      hintTemplate:
        'Familias da orquestra: cordas, madeiras, metais, percussao. Cada instrumento tem uma extensao, timbre e funcao caracteristicos no conjunto.',
      choiceSets: [
        [
          'A ordem padrao da seccao de cordas do mais agudo ao mais grave e: violino I, violino II, viola, violoncelo, contrabaixo',
          'As violas sao mais agudas que os violinos',
          'Os violoncelos sao mais agudos que as violas',
          'O contrabaixo e mais agudo que o violoncelo',
        ],
        [
          'Os instrumentos transpositores soam numa altura diferente da escrita: o clarinete em Bb soa uma 2.aM abaixo do escrito',
          'Todos os instrumentos orquestrais sao nao transpositores',
          'O clarinete em Bb soa mais agudo do que o escrito',
          'Apenas os instrumentos de percussao transpoem',
        ],
        [
          'A trompa em F soa uma 5.a perfeita abaixo do escrito',
          'A trompa em F soa uma 5.a perfeita acima do escrito',
          'A trompa em F e nao transpositora',
          'A trompa em F soa uma oitava abaixo',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidade 27: Teoria dos Conjuntos e Tecnicas do Seculo XX
  // =========================================================================

  // ---- l8u27m1: Conjuntos de Classes de Altura ----
  l8u27m1: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questao sobre a teoria dos conjuntos de classes de altura.',
      hintTemplate:
        'Classes de altura: C=0 ate B=11. Um conjunto de classes de altura lista CAs unicas em ordem ascendente. A forma normal coloca-as no arranjo mais compacto.',
      choiceSets: [
        [
          'Um conjunto de classes de altura remove equivalencia de oitava e enarmonica, usando inteiros de 0 a 11',
          'Conjuntos de classes de altura usam nomes de notas e numeros de oitava',
          'Conjuntos de classes de altura so funcionam para musica tonal',
          'Os inteiros de conjuntos de classes de altura vao de 0 a 7',
        ],
        [
          'A forma normal arranja o conjunto na ordem ascendente mais compacta',
          'A forma normal comeca sempre em C',
          'A forma normal usa ordem descendente',
          'Nao existe ordenacao padrao para conjuntos',
        ],
        [
          'O conjunto {C, E, G} = {0, 4, 7} e uma triade maior expressa como classes de altura',
          '{0, 4, 7} representa uma triade menor',
          '{0, 4, 7} representa uma triade diminuta',
          'Triades nao podem ser expressas como conjuntos de classes de altura',
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
        'Vetor intervalar: contagens de cada classe de intervalo (ci 1-6) num conjunto, escrito como <x x x x x x>. Dois conjuntos sao Z-relacionados quando partilham o mesmo vetor intervalar mas NAO estao relacionados por transposicao ou inversao (pertencem a classes de conjuntos diferentes).',
      choiceSets: [
        [
          'O vetor intervalar conta ocorrencias de cada classe de intervalo (1 a 6) num conjunto de classes de altura',
          'O vetor intervalar conta apenas intervalos perfeitos',
          'O vetor intervalar usa nomes de notas',
          'Vetores intervalares sao o mesmo que a forma normal',
        ],
        [
          'A forma primaria transpoe e/ou inverte um conjunto para a sua forma mais compacta comecando em 0',
          'A forma primaria e o mesmo que a forma normal',
          'A forma primaria apenas transpoe',
          'A forma primaria comeca sempre na nota mais aguda',
        ],
        [
          'Conjuntos Z-relacionados partilham o mesmo vetor intervalar mas nao sao equivalentes por transposicao/inversao',
          'Z-relacionados significa que sao transposicionalmente equivalentes',
          'Conjuntos Z-relacionados tem vetores intervalares diferentes',
          'A relacao-Z nao existe na teoria dos conjuntos',
        ],
      ],
    },
  ],

  // ---- l8u27m3: Tecnica dos Doze Sons ----
  l8u27m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta questao sobre tecnica dodecafonica (serial).',
      hintTemplate:
        'A serie usa todas as 12 classes de altura numa ordem fixa. Transformacoes: P (original), I (inversao), R (retrograda), RI (retrograda-inversao). A matriz 12x12 organiza as 48 formas da serie.',
      choiceSets: [
        [
          'Uma serie dodecafonica usa cada uma das 12 classes de altura exatamente uma vez antes de qualquer repeticao',
          'Uma serie pode repetir alturas livremente',
          'Uma serie usa apenas 7 alturas',
          'Uma serie deve ser uma escala',
        ],
        [
          'As quatro transformacoes basicas da serie sao Original, Inversao, Retrograda e Retrograda-Inversao',
          'Existem apenas 2 transformacoes da serie',
          'As transformacoes da serie incluem aumentacao e diminuicao',
          'Series nao podem ser transformadas',
        ],
        [
          'A matriz 12x12 contem as 48 formas possiveis (12P + 12I + 12R + 12RI)',
          'A matriz tem 24 formas da serie',
          'A matriz tem 144 formas da serie',
          'Cada forma da serie e exclusiva de uma celula',
        ],
      ],
    },
  ],

  // ---- l8u27m4: Minimalismo e Pos-minimalismo ----
  l8u27m4: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica as caracteristicas desta tecnica do seculo XX/XXI.',
      hintTemplate:
        'Minimalismo: padroes repetitivos, processo gradual, material harmonico limitado. Pioneiros: Reich (desfasamento), Glass (processo aditivo), Riley (loops de fita).',
      choiceSets: [
        [
          'O desfasamento desloca gradualmente dois padroes identicos para fora de sincronia, criando texturas em evolucao',
          'O desfasamento mantem os padroes perfeitamente sincronizados',
          'O desfasamento usa tecnica dodecafonica',
          'O desfasamento envolve alterar o conteudo de alturas',
        ],
        [
          'O processo aditivo acrescenta gradualmente notas a um padrao repetido, criando uma melodia que se expande lentamente',
          'O processo aditivo remove notas dos padroes',
          'O processo aditivo muda de tonalidade a cada repeticao',
          'O processo aditivo e o mesmo que tema e variacoes',
        ],
      ],
    },
  ],

  // ---- l8u27m5: Espectralismo e Tecnicas Expandidas ----
  l8u27m5: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica esta tecnica composicional contemporanea.',
      hintTemplate:
        'Espectralismo: composicao baseada nas propriedades acusticas do som (serie de harmonicos, analise espectral). Tecnicas expandidas: formas nao convencionais de tocar instrumentos.',
      choiceSets: [
        [
          'A musica espectral deriva a harmonia da serie de harmonicos e da analise acustica do som',
          'A musica espectral usa harmonia tonal tradicional',
          'A musica espectral baseia-se na tecnica dodecafonica',
          'A musica espectral evita todos os sons com altura definida',
        ],
        [
          'As tecnicas expandidas incluem multifonicos, piano preparado, col legno e harmonicos',
          'As tecnicas expandidas sao execucao orquestral padrao',
          'As tecnicas expandidas aplicam-se apenas a percussao',
          'As tecnicas expandidas foram inventadas no periodo barroco',
        ],
        [
          'A microtonalidade divide a oitava em intervalos menores que um semitom',
          'A microtonalidade usa apenas as 12 alturas padrao',
          'Microtonalidade significa tocar muito suavemente',
          'A microtonalidade e o mesmo que a atonalidade',
        ],
      ],
    },
  ],
};

export default overlay;
