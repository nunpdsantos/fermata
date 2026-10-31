import type { CurriculumLevelOverlay } from '../types';

const curriculumL5: CurriculumLevelOverlay = {
  // ─── Units ──────────────────────────────────────────────────────────────────
  units: {
    u15: {
      title: 'Dominantes Secundárias e Tonicização',
      description:
        'Dominantes aplicadas, acordes de sensível secundária, tonicização e cadeias de dominantes',
    },
    u16: {
      title: 'Modulação e Mistura Modal',
      description:
        'Modulação por acorde pivot, tonalidades próximas, outros tipos de modulação e mistura modal',
    },
    u17: {
      title: 'Forma, Textura e Condução de Vozes',
      description:
        'Formas musicais, tipos de textura e condução de vozes por notas-guia',
    },
  },

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: {
    // ── U15 M1: Secondary Dominants V/V ────────────────────────────────────
    l5u15m1: {
      title: 'Dominantes Secundárias: V/V e V7/V',
      subtitle: 'A dominante da dominante — o teu primeiro acorde aplicado',
      objectives: [
        'Compreender o que significa "V de algo" (tonicizar temporariamente um acorde diatónico)',
        'Construir e resolver V/V e V7/V em tonalidades maiores',
        'Identificar a nota cromática (4.º grau elevado) que cria a sensível de V',
      ],
      concepts: [
        {
          title: 'A Ideia Central: V de V',
          explanation:
            'Qualquer acorde diatónico (exceto o diminuto) pode ser temporariamente tratado como "tónica" e receber a sua própria dominante. V/V significa "a dominante da dominante". Em C maior, V = G maior. A dominante de G é D maior. D maior contém F# — uma nota cromática que funciona como sensível de G. Esta é a forma mais simples de cromatismo: emprestar uma nota de fora da tonalidade para reforçar o movimento em direção a um acorde diatónico.',
          tryThisLabel: 'Ouve D maior — o V/V em C maior',
        },
        {
          title: 'V7/V — Acrescentar a Sétima',
          explanation:
            'A forma com sétima, V7/V, é ainda mais comum do que a tríade. V7/V em C maior = D7 (D–F#–A–C). O trítono F#–C (uma 5.ª diminuta) contrai-se para dentro, até à 3.ª maior G–B. A sétima acrescenta a força de atração que torna as dominantes secundárias tão eficazes. Em D7 a resolver para G: F# sobe a G (resolução da sensível), C desce a B (a sétima resolve por grau descendente). Estas são as mesmas regras de condução de vozes de V7 para I, apenas aplicadas a V como alvo temporário.',
          tryThisLabel: 'Ouve D7 — o V7/V em C maior',
        },
        {
          title: 'Resolução e Condução de Vozes',
          explanation:
            'As dominantes secundárias seguem as mesmas regras de resolução que V7 para I. A "sensível" cromática resolve meio-tom acima para a fundamental do alvo. A sétima (se presente) resolve por grau descendente. Em D7 a resolver para G: F# sobe a G, C desce a B. O trítono F#–C (uma 5.ª diminuta) contrai-se para dentro, até à 3.ª maior G–B. As notas cromáticas quase sempre resolvem na direção em que foram alteradas — sustenidos sobem, bemóis descem.',
          tryThisLabel: 'Ouve o alvo G depois de D7',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "D major chord" — este é V/V em C maior. O F# é a única nota cromática. Funciona como sensível de G.',
        },
        {
          instruction:
            'Escreve "D7" e depois "G major chord" — ouve como D7 cria uma forte atração para G. O trítono F#–C dentro de D7 (uma 5.ª diminuta) contrai-se para dentro, até à 3.ª maior G–B.',
        },
        {
          instruction:
            'Compara "D major chord" (tríade V/V) com "D7" (V7/V). A forma com sétima tem mais tensão por causa do trítono. Ambos apontam para G, mas D7 exige resolução com mais urgência.',
        },
      ],
    },

    // ── U15 M2: Secondary Dominants of ii, iii, IV, vi ─────────────────────
    l5u15m2: {
      title: 'Dominantes Secundárias de ii, iii, IV, vi',
      subtitle: 'Dominantes aplicadas para cada alvo diatónico',
      objectives: [
        'Construir e resolver V/ii, V/iii, V/IV e V/vi em tonalidades maiores',
        'Identificar a nota cromática em cada dominante secundária',
        'Reconhecer que V/IV usa as mesmas notas que I (o contexto determina a função)',
      ],
      concepts: [
        {
          title: 'Dominantes Secundárias para Cada Alvo',
          explanation:
            'Cada acorde diatónico (exceto vii°) tem a sua própria dominante secundária. V/ii = A(7) a apontar para Dm, com C# cromático. V/iii = B(7) a apontar para Em, com D# e F# cromáticos. V/IV = C(7) a apontar para F — mesmas notas que I, distinguido apenas pelo contexto. V/vi = E(7) a apontar para Am, com G# cromático. A forma com sétima (V7/X) é mais comum porque o trítono no seu interior cria uma atração mais forte para o alvo.',
          tryThisLabel: 'Ouve A7 — o V7/ii em C maior',
        },
        {
          title: 'O Caso Especial: V/IV',
          explanation:
            'V/IV em C maior é C–E–G — notas idênticas à tríade da tónica. A distinção é puramente contextual: se C maior é seguido de F maior, funciona como V/IV em vez de I. Acrescentar a sétima esclarece a função: V7/IV = C7 (C–E–G–Bb). O Bb é cromático em C maior e cria um trítono com E que puxa para F. Por isso V7/IV é muito mais comum do que a forma de tríade — a sétima remove a ambiguidade.',
          tryThisLabel: 'Ouve C7 — o V7/IV em C maior (repara no Bb)',
        },
        {
          title: 'Notas Cromáticas e os Seus Alvos',
          explanation:
            'Cada dominante secundária introduz notas cromáticas específicas. V7/ii traz C# (sensível de D). V7/iii traz D# (sensível de E). V7/IV traz Bb (sétima acima de C, a puxar para A em F maior). V7/vi traz G# (sensível de A). Estas notas cromáticas resolvem sempre na direção em que foram alteradas: sustenidos sobem, bemóis descem. Aprender a ouvir estas inflexões cromáticas é a chave para identificar dominantes secundárias.',
          tryThisLabel: 'Ouve E7 — o V7/vi em C maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "A7" — este é V7/ii em C maior. O C# funciona como sensível de D. Agora escreve "Dm" para ouvires a resolução.',
        },
        {
          instruction:
            'Escreve "E7" — este é V7/vi em C maior. O G# puxa para A. Compara com "Em" (iii diatónico) — E7 tem muito mais tensão por causa do G# cromático.',
        },
        {
          instruction:
            'Escreve "C7" — este é V7/IV em C maior. O Bb é a pista de que não está a funcionar como acorde da tónica. Agora escreve "F major chord" para ouvires a resolução.',
        },
      ],
    },

    // ── U15 M3: Secondary Leading-Tone Chords ─────────────────────────────
    l5u15m3: {
      title: 'Acordes de Sensível Secundária',
      subtitle: 'Construir e resolver acordes vii°/X',
      objectives: [
        'Construir vii°/X e vii°7/X para cada acorde diatónico alvo',
        'Compreender a escolha entre acordes de sensível secundária meio-diminutos e totalmente diminutos',
        'Resolver corretamente os acordes de sensível secundária',
      ],
      concepts: [
        {
          title: 'O Que São Acordes de Sensível Secundária?',
          explanation:
            'Tal como V pode ser "aplicado" a qualquer acorde diatónico, o mesmo se aplica a vii°. Constrói uma tríade diminuta (ou acorde de sétima) sobre a nota meio-tom abaixo da fundamental do alvo. vii°/V em C maior = F#dim (F#–A–C), a apontar para G. vii°/ii = C#dim (C#–E–G), a apontar para Dm. O acorde de sensível é um substituto da dominante — partilha o mesmo trítono que o V7 correspondente, mas não tem a fundamental.',
          tryThisLabel: 'Ouve F#dim — vii°/V em C maior',
        },
        {
          title: 'Totalmente Diminuto vs. Meio-Diminuto',
          explanation:
            'vii°7/X (sétima totalmente diminuta) é o mais intenso dos dois, e a escolha entre eles depende do acorde a ser tonicizado e não do modo da tonalidade de partida: alvos menores recebem o vii°7/X totalmente diminuto, enquanto alvos maiores podem ser abordados tanto por vii°7/X como pelo mais suave viiø7/X — acordes secundários totalmente diminutos também são comuns em tonalidades maiores. Todos os intervalos do vii°7 são terceiras menores, tornando o acorde simétrico — qualquer nota pode funcionar como fundamental. Essa simetria permite a reinterpretação enarmónica, o que se torna importante para modulações distantes no Nível 6.',
          tryThisLabel: 'Ouve Bdim7 — um acorde de sétima totalmente diminuta',
        },
        {
          title: 'Resolução e Comparação com V/X',
          explanation:
            'A fundamental do acorde de sensível secundária resolve meio-tom acima para a fundamental do alvo, tal como a sensível diatónica resolve para a tónica. Todas as outras vozes resolvem por grau ou por nota comum, seguindo os padrões standard de resolução de acordes diminutos. Comparando V7/X com vii°7/X a apontar para o mesmo acorde, revelam um trítono partilhado mas movimento diferente no baixo: V7/X move o baixo uma quinta abaixo (forte), enquanto vii°7/X move o baixo um meio-tom acima (suave e cromático). A escolha depende do contexto — V/X é mais enfático, vii°/X é mais subtil.',
          tryThisLabel: 'Ouve C#dim — vii°/ii em C maior, a apontar para Dm',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "F#dim" e depois "G major chord" — o F# puxa meio-tom acima para G. Compara com "D7" a resolver para "G" — ambos apontam para G mas com movimento de baixo diferente.',
        },
        {
          instruction:
            'Escreve "G#dim7" — este é vii°7/vi em C maior. O G# é sensível de A. Agora escreve "Am" para ouvires a resolução.',
        },
        {
          instruction:
            'Compara "E7" (V7/vi) com "G#dim7" (vii°7/vi) — ambos apontam para Am, mas o acorde diminuto tem uma abordagem mais suave e cromática.',
        },
      ],
    },

    // ── U15 M4: Tonicization vs. Modulation ────────────────────────────────
    l5u15m4: {
      title: 'Tonicização vs. Modulação',
      subtitle: 'Distinguir tonicização breve de mudança permanente de tonalidade',
      objectives: [
        'Distinguir tonicização de modulação (mudança breve vs. permanente de tonalidade)',
        'Reconhecer a tonicização como uma dominante secundária a resolver para o seu alvo',
        'Identificar tonicização prolongada (ii/V para V7/V para V)',
      ],
      concepts: [
        {
          title: 'Tonicização vs. Modulação',
          explanation:
            'Tonicização é uma ênfase breve e momentânea num acorde não-tónica. Um ou dois acordes "apontam" para o alvo e depois a música regressa à tonalidade original. Sem mudança de armação de clave, sem cadência na nova tonalidade. Modulação é uma mudança efetiva de tonalidade que persiste — confirmada por uma cadência na nova tonalidade. A regra prática: se há uma cadência na nova tonalidade, é modulação. Se é apenas V/X a resolver para X, é tonicização.',
          tryThisLabel: 'Vê C maior — a tonalidade de origem para regressar',
        },
        {
          title: 'Tonicização Breve vs. Prolongada',
          explanation:
            'Um único V7/X a resolver para X é uma tonicização breve. Mas vários acordes podem funcionar na "tonalidade temporária". ii/V para V7/V para V cria um mini ii–V–I na tonalidade de V. A tonalidade temporária tem a sua própria pré-dominante e dominante, mas a música regressa à tónica original. A tonicização prolongada esbate a fronteira com a modulação — a distinção depende de a música cadenciar e permanecer na nova tonalidade.',
          tryThisLabel: 'Vê G maior — alvo comum de tonicização a partir de C',
        },
        {
          title: 'Analisar Tonicizações em Música Real',
          explanation:
            'Ao analisar uma passagem com dominantes secundárias, marca a região tonicizada entre colchetes e indica tanto a função local como a função na tonalidade de origem. Em C maior, a passagem C–D7–G–C analisa-se como I–[V7/V–V]–I, onde os colchetes mostram a área tonicizada. A cadência V7–I no final confirma C como a verdadeira tónica. Se a passagem tivesse continuado em G com uma cadência (D7–G como V7–I em G), a análise passaria a modulação. O teste da cadência é a linha divisória fiável entre tonicização e modulação na análise real.',
          tryThisLabel: 'D7 toniciza G mas não modula para G',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre "key of C" e pensa: se ouves D7 seguido de G7 seguido de C, o D7 toniciza brevemente G, mas a música regressa a C. Isso é tonicização, não modulação.',
        },
        {
          instruction:
            'Pensa numa tonicização prolongada: Am7 (ii/V) para D7 (V7/V) para G (V). Três acordes funcionam na tonalidade de G, mas a música regressa a C. Continua a ser tonicização porque não há cadência em G.',
        },
        {
          instruction:
            'Agora imagina: D7 para G, depois Am para D7 para G com uma CAP em G maior. A cadência em G confirma que é uma modulação, não uma tonicização. A cadência é a linha divisória.',
        },
      ],
    },

    // ── U15 M5: Dominant Chains ────────────────────────────────────────────
    l5u15m5: {
      title: 'Cadeias de Dominantes e Tonicização Sequencial',
      subtitle: 'Cadeias de dominantes aplicadas descendentes por quintas',
      objectives: [
        'Construir cadeias de dominantes secundárias (cada dominante resolve para a seguinte)',
        'Compreender a tonicização sequencial como um padrão de quintas descendentes com dominantes aplicadas',
        'Traçar cadeias de dominantes no Círculo de Quintas',
      ],
      concepts: [
        {
          title: 'Cadeias de Dominantes Secundárias',
          explanation:
            'Uma cadeia de dominantes em que cada uma resolve para a seguinte: V7/vi para V7/ii para V7/V para V7 para I. Cada acorde é a dominante do seguinte, criando intenso impulso cromático descendente por quintas. Em C maior: E7 aponta para Am, A7 aponta para Dm, D7 aponta para G, G7 aponta para C. A cadeia segue o Círculo de Quintas no sentido anti-horário. Esta técnica cria um poderoso movimento para a frente através de tensão cromática acumulada.',
          tryThisLabel: 'Vê o ciclo de quintas que as cadeias seguem',
        },
        {
          title: 'Tonicização Sequencial',
          explanation:
            'Uma sequência harmónica em que cada passo toniciza o próximo acorde diatónico. Quintas descendentes com dominantes secundárias: V7/IV para IV, V7/iii para iii, V7/ii para ii, V7 para I. Cada par é um V–I em miniatura numa tonalidade temporária. O padrão sequencial cria um ritmo harmónico previsível enquanto as notas cromáticas acrescentam cor. Esta técnica é comum em sequências barrocas e turnarounds de jazz.',
          tryThisLabel: 'Vê C maior — traça os alvos diatónicos ao longo da sequência',
        },
        {
          title: 'Cadeias de Dominantes na Prática',
          explanation:
            'A cadeia mais comum no jazz e na música popular é a progressão "contagem decrescente": III7–VI7–II7–V7–I (em C: E7–A7–D7–G7–C). Cada acorde de sétima da dominante resolve uma quinta abaixo para o seguinte. Isto é a espinha dorsal das pontes de rhythm changes, turnarounds de jazz e inúmeras progressões pop. A cadeia funciona porque cada resolução é um V7–I satisfatório, e o movimento global conduz implacavelmente à tónica.',
          tryThisLabel: 'Ouve G7 — a dominante final antes da tónica em qualquer cadeia',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre o Círculo de Quintas e traça uma cadeia de dominantes: E7 aponta para Am, A7 aponta para Dm, D7 aponta para G, G7 aponta para C. Cada passo é uma quinta — a cadeia segue o círculo no sentido anti-horário.',
        },
        {
          instruction:
            'Escreve "D7", depois "G7", depois "Cmaj7" — esta é uma cadeia de dominantes. D7 toniciza G, G7 toniciza C. A resolução final para Cmaj7 confirma C como a verdadeira tónica.',
        },
        {
          instruction:
            'Pensa na cadeia completa: E7 para A7 para D7 para G7 para C. Cinco acordes, quatro resoluções dominantes, cada uma descendente por quinta. Cada nota cromática resolve para o acorde alvo seguinte.',
        },
      ],
    },

    // ── U16 M1: Pivot Chord Modulation ─────────────────────────────────────
    l5u16m1: {
      title: 'Modulação por Acorde Pivot',
      subtitle: 'Encontrar acordes partilhados entre tonalidades para modular suavemente',
      objectives: [
        'Compreender o conceito de acorde pivot (um acorde com função válida em ambas as tonalidades)',
        'Encontrar acordes pivot entre quaisquer duas tonalidades próximas',
        'Analisar o processo modulatório: estabelecer tonalidade 1, pivot, confirmar tonalidade 2',
      ],
      concepts: [
        {
          title: 'O Acorde Pivot',
          explanation:
            'Um acorde pivot tem uma análise válida em numeração romana tanto na tonalidade antiga como na nova. É a "dobradiça" — o ouvinte reinterpreta-o. Numa modulação de C maior para G maior, o acorde Am é vi em C e ii em G. Se a música pivota através de Am, o ouvido transita de ouvir vi em C para ii em G. O acorde pivot é o último acorde que faz sentido na tonalidade antiga E o primeiro acorde que faz sentido na nova.',
          tryThisLabel: 'Vê G maior — alvo comum de modulação a partir de C',
        },
        {
          title: 'O Processo Modulatório',
          explanation:
            'Cinco passos: (1) Estabelecer a tonalidade 1 com uma progressão clara. (2) Aproximar-se de um acorde que existe em ambas as tonalidades. (3) O acorde pivot — reinterpretado por ambas as tonalidades. (4) Seguir o pivot com função dominante na nova tonalidade (V ou V7). (5) Cadenciar na tonalidade 2 para confirmar a modulação. O acorde pivot torna a mudança de tonalidade suave porque o ouvinte não nota a mudança até a nova dominante aparecer.',
          tryThisLabel: 'Vê C maior — encontra acordes partilhados com G maior',
        },
        {
          title: 'Notação de Análise para Acordes Pivot',
          explanation:
            'No acorde pivot, escreve numeração romana para ambas as tonalidades. C: I – IV – vi / ii – V7 – I :G. A barra marca o pivot — Am é vi em C e ii em G. Tudo antes da barra é analisado em C, tudo depois em G. Esta notação torna a dupla função explícita e mostra exatamente onde a mudança de tonalidade acontece.',
          tryThisLabel: 'Vê as tonalidades vizinhas — cada par partilha muitos acordes pivot',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre "key of C" e depois "key of G" — faz uma lista de todos os acordes que aparecem em ambas as tonalidades. Esses são as tuas opções de acorde pivot (Am, C, Em, G aparecem em ambas).',
        },
        {
          instruction:
            'Pensa numa modulação de C para G: toca C, Am (pivot — vi em C, ii em G), D7 (V7 em G), G (nova tónica). O acorde pivot é onde o ouvido muda.',
        },
        {
          instruction:
            'Abre o Círculo de Quintas — escolhe qualquer tonalidade e identifica os seus vizinhos imediatos. Esses vizinhos partilham mais acordes, tornando a modulação por acorde pivot mais fácil entre tonalidades adjacentes.',
        },
      ],
    },

    // ── U16 M2: Modulation to Closely Related Keys ─────────────────────────
    l5u16m2: {
      title: 'Modulação para Tonalidades Próximas',
      subtitle: 'Modulações práticas para V, IV, vi e relativa maior/menor',
      objectives: [
        'Identificar tonalidades próximas (diferem em 0 ou 1 acidente)',
        'Executar modulações por acorde pivot para a dominante (V), subdominante (IV) e relativa menor (vi)',
        'Reconhecer os alvos de modulação mais comuns em tonalidades maiores e menores',
      ],
      concepts: [
        {
          title: 'Tonalidades Próximas',
          explanation:
            'Tonalidades próximas partilham a maioria das suas notas, diferindo em zero ou um acidente. Para C maior, as tonalidades próximas são: G maior (dominante, um sustenido), F maior (subdominante, um bemol), A menor (relativa menor), D menor (ii torna-se tónica) e E menor (iii torna-se tónica). Estas são as modulações mais fáceis porque muitos acordes são partilhados entre as tonalidades. O Círculo de Quintas mostra-as: qualquer tonalidade e os seus vizinhos imediatos são tonalidades próximas.',
          tryThisLabel: 'Vê as tonalidades próximas como vizinhas no círculo',
        },
        {
          title: 'Modulação para a Dominante (I para V)',
          explanation:
            'A modulação mais natural e comum em tonalidades maiores. De C maior para G maior, os acordes partilhados incluem Am (vi/ii), C (I/IV), Em (iii/vi), G (V/I). A modulação torna-se clara quando F# aparece — pertence a G maior mas não a C maior. Um caminho típico: C – Am – D7 – G. O Am serve como pivot (vi em C, ii em G), D7 é V7 em G e G cadencia a nova tonalidade.',
          tryThisLabel: 'Vê G maior — a tonalidade da dominante de C',
        },
        {
          title: 'Modulação para IV e vi',
          explanation:
            'Modulação para a subdominante (IV): De C maior para F maior, o aparecimento de Bb sinaliza a nova tonalidade. Acordes partilhados incluem F (IV/I), Am (vi/iii), Dm (ii/vi), C (I/V). Modulação para a relativa menor (vi): De C maior para A menor, o aparecimento de G# (sensível em A menor) confirma a mudança. Em tonalidades menores, a modulação mais comum é para a relativa maior (III) — de A menor para C maior.',
          tryThisLabel: 'Vê F maior — a tonalidade da subdominante de C',
        },
      ],
      tasks: [
        {
          instruction:
            'Abre "key of C" e "key of F" — identifica os acordes partilhados. F maior (IV em C, I em F), Dm (ii em C, vi em F), Am (vi em C, iii em F) são todos potenciais acordes pivot para modular para IV.',
        },
        {
          instruction:
            'Abre o Círculo de Quintas e escolhe C maior. Conta as tonalidades próximas: G (uma no sentido horário), F (uma no sentido anti-horário), Am (relativa menor), Dm (ii), Em (iii). Cinco tonalidades próximas no total.',
        },
        {
          instruction:
            'Pensa numa modulação de C para Am: C – F – Dm (pivot: ii em C, iv em Am) – E7 (V7 em Am) – Am. O E7 com o seu G# confirma que deixámos C maior.',
        },
      ],
    },

    // ── U16 M3: Direct, Common-Tone, and Chromatic Modulation ──────────────
    l5u16m3: {
      title: 'Modulação Direta, por Nota Comum e Cromática',
      subtitle: 'Modulação sem acordes pivot diatónicos',
      objectives: [
        'Executar modulação direta (de frase)',
        'Compreender a modulação por nota comum',
        'Reconhecer a modulação cromática (pivot cromático)',
      ],
      concepts: [
        {
          title: 'Modulação Direta (de Frase)',
          explanation:
            'Sem acorde pivot de todo. Uma frase termina na tonalidade 1, a frase seguinte começa na tonalidade 2. A mudança de tonalidade acontece entre frases, frequentemente com uma respiração ou pausa. Esta é a modulação "do camionista" comum na música pop — o último refrão sobe meio-tom ou um tom para ganhar energia. É o tipo de modulação mais abrupto, que aposta na surpresa em vez da lógica harmónica.',
          tryThisLabel: 'Ouve Db maior — meio-tom acima de C',
        },
        {
          title: 'Modulação por Nota Comum e Modulação Cromática',
          explanation:
            'Na modulação por nota comum, uma nota é sustida ou repetida enquanto a harmonia muda para uma nova tonalidade. A nota mantida liga as duas regiões tonais como um fio. Um G sustido liga C maior a Eb maior (G é a 5.ª de C e a 3.ª de Eb). Na modulação cromática, um acorde é alterado cromaticamente para sinalizar a mudança — o acorde alterado não tem função diatónica na tonalidade original. Ambas são mais dramáticas do que a modulação por acorde pivot.',
          tryThisLabel: 'Ouve Eb maior — partilha G com C maior',
        },
        {
          title: 'Modulação Sequencial e Enarmónica',
          explanation:
            'Uma sequência harmónica transporta a música para uma nova tonalidade. A lógica interna do padrão sobrepõe-se à necessidade de um pivot. Uma sequência de quintas descendentes pode gradualmente deslocar o centro tonal sem nenhum acorde individual funcionar como pivot. O ouvinte segue o padrão em vez da tonalidade. A modulação enarmónica (usar o mesmo som escrito de forma diferente para pivotar entre tonalidades distantes) é introduzida aqui e tratada em detalhe no Nível 6.',
          tryThisLabel: 'Vê como as sequências seguem o ciclo de quintas',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "C major scale" e depois "Db major scale" — imagina uma canção a terminar uma frase em C e a começar a seguinte em Db. Isso é uma modulação direta — meio-tom acima, sem pivot necessário.',
        },
        {
          instruction:
            'Compara "key of C" e "key of Eb" — G é o 5.º grau em C e o 3.º grau em Eb. Um G sustido poderia ligar estas duas tonalidades distantes via modulação por nota comum.',
        },
        {
          instruction:
            'Abre o Círculo de Quintas e traça: uma sequência passando por C, F, Bb, Eb modula gradualmente de C maior para Eb maior. O padrão sobrepõe-se à necessidade de um pivot formal.',
        },
      ],
    },

    // ── U16 M4: Mode Mixture — Borrowed Chords ─────────────────────────────
    l5u16m4: {
      title: 'Mistura Modal — Acordes de Empréstimo',
      subtitle: 'Emprestar acordes do modo menor paralelo para cor expressiva',
      objectives: [
        'Emprestar acordes do modo menor paralelo num contexto de tonalidade maior',
        'Identificar os acordes de empréstimo mais comuns: bVI, bIII, bVII, iv, ii°',
        'Compreender como os graus da escala rebaixados criam condução cromática de vozes',
      ],
      concepts: [
        {
          title: 'O Que É Mistura Modal?',
          explanation:
            'Mistura modal significa emprestar acordes da tonalidade paralela. Em C maior, a tonalidade paralela é C menor. O empréstimo traz acordes da família de C menor para um contexto de C maior. O resultado: escuridão inesperada, nostalgia ou profundidade emocional que a harmonia puramente maior não consegue alcançar. Os acordes de empréstimo mais comuns são iv (Fm), bVI (Ab), bVII (Bb), bIII (Eb) e ii° (Ddim). Cada um acrescenta uma cor distinta.',
          tryThisLabel: 'Ouve Ab — o acorde bVI de empréstimo em C maior',
        },
        {
          title: 'Os Acordes de Empréstimo Mais Comuns',
          explanation:
            'iv (F menor em C) substitui IV com uma subdominante escura. bVI (Ab maior em C) é dramático e cinematográfico — o acorde de Hollywood. bVII (Bb maior em C) cria uma cadência rock ou sensação modal. bIII (Eb maior em C) soa surpreendentemente brilhante apesar de conter um bemol. Estes acordes partilham graus rebaixados (b3, b6, b7) do modo menor paralelo. A condução cromática de vozes entre acordes diatónicos e de empréstimo é parte do que torna a mistura modal tão eficaz.',
          tryThisLabel: 'Ouve Fm — o acorde iv de empréstimo em C maior',
        },
        {
          title: 'Condução de Vozes com Acordes de Empréstimo',
          explanation:
            'As notas cromáticas dos acordes de empréstimo seguem as suas tendências naturais: notas rebaixadas (b3, b6, b7) resolvem descendentemente. Quando iv (Fm) passa a I (C), o Ab em Fm desce a G em C maior — condução cromática suave. Quando bVI (Ab) passa a V (G), o Ab desce a G por meio-tom. Estas conexões cromáticas são parte do que torna a mistura modal tão expressiva. A cor vem não apenas do acorde, mas do movimento de entrada e saída dele.',
          tryThisLabel: 'Ouve Bb — o acorde bVII de empréstimo em C maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "Ab major chord" no contexto de C maior — Ab contém Ab, C, Eb. O Ab e o Eb são emprestados de C menor. Este é bVI, o acorde de empréstimo mais cinematográfico.',
        },
        {
          instruction:
            'Compara "F major chord" (IV diatónico) com "Fm" (iv de empréstimo). A única diferença é uma nota: o A passa a Ab. Essa única alteração cromática transforma o carácter emocional.',
        },
        {
          instruction:
            'Escreve "Bb major chord" — este é bVII em C maior, emprestado de C menor. Está em todo o lado no rock e pop. Agora escreve "C major chord" para ouvires a resolução bVII para I.',
        },
      ],
    },

    // ── U16 M5: Picardy Third and Mode Mixture in Minor ────────────────────
    l5u16m5: {
      title: 'Terça Picardia e Mistura Modal no Modo Menor',
      subtitle: 'Emprestar do modo maior paralelo num contexto de tonalidade menor',
      objectives: [
        'Compreender a terça picardia (I maior a terminar uma peça em tonalidade menor)',
        'Identificar mistura modal em tonalidades menores (empréstimo do modo maior paralelo)',
        'Reconhecer o efeito expressivo de acordes maiores num contexto menor',
      ],
      concepts: [
        {
          title: 'A Terça Picardia',
          explanation:
            'A terça picardia é mistura modal na direção oposta: emprestar do modo maior paralelo para uma tonalidade menor. Uma peça em tonalidade menor termina a sua cadência final com uma tónica maior (I em vez de i). Em C menor, o acorde final torna-se C maior — a terça elevada (E natural em vez de Eb) cria um brilho inesperado, um raio de luz no final. Comum na música barroca e renascentista, onde peças em tonalidade menor terminam muitas vezes com terça picardia, sobretudo nas cadências do final do Renascimento e do início do Barroco.',
          tryThisLabel: 'Ouve C maior — a terça picardia num contexto de C menor',
        },
        {
          title: 'Mistura Modal em Tonalidades Menores',
          explanation:
            'Emprestar do modo maior paralelo para o menor é menos comum mas eficaz. Usar IV (maior) em vez de iv (menor), ou usar I (maior) em vez de i (menor) em cadências internas. Em C menor: F maior (IV emprestado de C maior) substitui o Fm esperado. A nota elevada (A natural em vez de Ab) acrescenta brilho sem sair da tonalidade menor. Esta técnica cria momentos de calor dentro de uma paisagem harmónica predominantemente escura.',
          tryThisLabel: 'Ouve F maior — IV emprestado para C menor',
        },
        {
          title: 'O Alcance Expressivo da Mistura Modal',
          explanation:
            'Mistura modal em ambas as direções dá aos compositores uma paleta expressiva enorme. Tonalidades maiores podem escurecer emprestando do menor (bVI, iv, bVII). Tonalidades menores podem iluminar emprestando do maior (terça picardia, IV maior). A capacidade de se mover livremente entre versões maiores e menores de acordes construídos sobre as mesmas fundamentais é uma das características definidoras da harmonia do período Romântico. Esbate completamente a fronteira entre maior e menor.',
          tryThisLabel: 'Vê C menor — a tonalidade paralela que empresta e recebe',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "C minor scale" para estabelecer o contexto menor. Agora escreve "C major chord" — a terça elevada (E natural em vez de Eb) é a terça picardia. Um final brilhante para uma tonalidade escura.',
        },
        {
          instruction:
            'Compara "Fm" (iv diatónico em C menor) com "F major chord" (IV emprestado de C maior). O A natural em vez de Ab acrescenta um calor surpreendente ao contexto de tonalidade menor.',
        },
        {
          instruction:
            'Pensa num final de tonalidade menor com terça picardia: Dm7b5 (iiø7 em C menor), G7 (V7), depois C maior (I picardia em vez de Cm). O final maior transforma todo o carácter emocional da cadência.',
        },
      ],
    },

    // ── U17 M1: Binary and Ternary Forms ───────────────────────────────────
    l5u17m1: {
      title: 'Forma Binária e Ternária',
      subtitle: 'Estruturas musicais em duas e três partes',
      objectives: [
        'Analisar forma binária (simples, com retorno, equilibrada)',
        'Analisar forma ternária (ABA, composta)',
        'Distinguir formas seccionais de formas contínuas',
      ],
      concepts: [
        {
          title: 'Forma Binária',
          explanation:
            'A forma binária tem duas secções, cada uma geralmente repetida. Binária simples (AB): a primeira secção afasta-se da tónica (modula ou termina em V), a segunda regressa. Binária com retorno (ABA\'): o material de A regressa no final da secção B, proporcionando encerramento. É extremamente comum e é a base da forma sonata. Binária equilibrada: ambas as secções terminam com o mesmo material, mesmo que comecem de forma diferente. A maioria das danças barrocas usa forma binária.',
          tryThisLabel: 'Vê G maior — tonalidade comum da segunda secção na forma binária',
        },
        {
          title: 'Forma Ternária',
          explanation:
            'A forma ternária (ABA) tem três secções: exposição, contraste, retorno. Cada secção é autossuficiente com as suas próprias cadências. A secção B proporciona contraste — tonalidade diferente, carácter diferente, material temático diferente. A ternária composta encaixa formas dentro de formas — o Minueto e Trio é uma ternária composta onde cada parte é em si mesma binária. O regresso de A após material contrastante B cria uma das estruturas mais satisfatórias da música.',
          tryThisLabel: 'Vê C maior — a "tonalidade de casa" a que as secções A regressam',
        },
        {
          title: 'Seccional vs. Contínua',
          explanation:
            'Uma forma seccional tem fronteiras claras: cada secção termina com uma cadência forte na sua própria tonalidade e poderia existir sozinha. Uma forma contínua flui entre secções sem cadências internas fortes — a música avança através das fronteiras de secção. O mesmo esquema de letras (AB, ABA) pode ser seccional ou contínuo. Seccional parece mais com salas separadas; contínua parece mais com um espaço fluido dividido por cortinas.',
          tryThisLabel: 'Vê F maior — região tonal contrastante comum na forma',
        },
      ],
      tasks: [
        {
          instruction:
            'Pensa numa música que conheças bem. Consegues identificar as secções? Etiqueta-as com letras: A para a primeira ideia, B para material contrastante, A\' se a primeira ideia regressa com alterações.',
        },
        {
          instruction:
            'Abre "key of C" e depois "key of G" — na forma binária, a primeira secção frequentemente modula de C para G (tónica para dominante). A segunda secção regressa a C. Este plano tonal cria a estrutura em duas partes.',
        },
        {
          instruction:
            'Considera a forma ternária: secção A em C maior, secção B modula para G maior como contraste, depois A regressa em C maior. O esquema tonal reforça a estrutura em três partes.',
        },
      ],
    },

    // ── U17 M2: Song Forms and Large Forms ─────────────────────────────────
    l5u17m2: {
      title: 'Formas de Canção e Introdução às Grandes Formas',
      subtitle: 'Estrofe-refrão, AABA, forma sonata, rondó e tema com variações',
      objectives: [
        'Reconhecer formas de canção (estrofe-refrão, AABA, estrófica)',
        'Compreender a forma sonata (exposição, desenvolvimento, recapitulação)',
        'Conhecer a forma rondó e a estrutura de tema com variações',
      ],
      concepts: [
        {
          title: 'Formas de Canção',
          explanation:
            'A forma estrófica usa a mesma música para cada estrofe — simples e repetitiva (hinos, música folk). Estrofe-refrão alterna estrofes em mudança com um refrão fixo — a forma pop mais comum. AABA (forma de 32 compassos) tem quatro secções de oito compassos: A (tema), A (repetição), B (ponte/contraste), A (retorno) — standard nos standards de jazz. Composição contínua não tem secções repetidas, usada para canções narrativas onde a música segue o texto.',
          tryThisLabel: 'Vê C maior — tonalidade típica para análise de forma de canção',
        },
        {
          title: 'Forma Sonata',
          explanation:
            'A joia da coroa da forma clássica. Três grandes secções: (1) Exposição — dois grupos temáticos em tonalidades contrastantes (primeiro tema na tónica, segundo na dominante ou relativa maior), geralmente repetida. (2) Desenvolvimento — os temas são fragmentados, recombinados e modulados por muitas tonalidades. A secção harmonicamente mais aventurosa. (3) Recapitulação — a exposição regressa, mas agora ambos os temas estão na tónica. O conflito tonal é resolvido. Introdução lenta e coda opcionais.',
          tryThisLabel: 'Vê C maior — tonalidade típica do primeiro tema',
        },
        {
          title: 'Rondó e Tema com Variações',
          explanation:
            'Na forma rondó, um tema principal (A) alterna com episódios contrastantes. Rondó em cinco partes: A–B–A–C–A. Rondó em sete partes: A–B–A–C–A–B–A. O A recorrente proporciona familiaridade; os episódios proporcionam variedade. Comum em finais clássicos. Tema com variações apresenta um tema e depois repete-o com alterações: variação melódica, harmónica, rítmica, modal (troca maior/menor) ou de carácter. Chaconne e passacaglia mantêm a linha de baixo constante enquanto as vozes superiores variam.',
          tryThisLabel: 'Vê C menor — variação modal de C maior',
        },
      ],
      tasks: [
        {
          instruction:
            'Considera a forma estrofe-refrão: a estrofe muda a letra de cada vez (A, A\', A\'\') enquanto o refrão se mantém igual (B). Como se compara com a forma AABA onde A repete antes da ponte?',
        },
        {
          instruction:
            'Prática de forma sonata: abre "key of C" (tónica) e "key of G" (dominante). Na exposição, o tema 1 está em C, o tema 2 em G. Na recapitulação, ambos os temas regressam em C.',
        },
        {
          instruction:
            'Escreve "C major scale" e depois "C minor scale" — mudar de maior para menor é uma das técnicas de variação mais comuns (variação modal). Mesma tónica, carácter completamente diferente.',
        },
      ],
    },

    // ── U17 M3: Texture ────────────────────────────────────────────────────
    l5u17m3: {
      title: 'Textura',
      subtitle: 'Monofónica, homofónica, polifónica e outros tipos de textura',
      objectives: [
        'Identificar os cinco tipos de textura de ouvido',
        'Compreender como a escolha de textura afeta o carácter musical',
        'Reconhecer mudanças de textura dentro de uma peça',
      ],
      concepts: [
        {
          title: 'Monofonia e Homofonia',
          explanation:
            'Monofonia é uma única linha melódica sem acompanhamento — todos executam a mesma melodia, possivelmente em oitavas. O canto gregoriano e melodias de solista sem acompanhamento são monofónicos. Pura, focada, exposta. Homofonia é uma melodia com acompanhamento de acordes — a melodia domina enquanto as outras vozes apoiam. Esta é a textura mais comum na música ocidental: canções pop, hinos, escrita para piano clássico, melodia orquestral com acompanhamento.',
          tryThisLabel: 'Toca uma única linha melódica — textura monofónica',
        },
        {
          title: 'Polifonia e Contraponto',
          explanation:
            'Polifonia significa duas ou mais melodias independentes a soar em simultâneo, cada uma com o seu próprio interesse rítmico e melódico. Fugas, invenções e motetos renascentistas são polifónicos. Homorritmia é uma textura específica em que todas as vozes se movem no mesmo ritmo mas com alturas diferentes — escrita ao estilo de coral. Heterofonia ocorre quando vários executantes tocam a mesma melodia simultaneamente com variações individuais, comum em tradições folclóricas.',
          tryThisLabel: 'Vê C maior — tonalidade de referência para exemplos de contraponto',
        },
        {
          title: 'Mudanças de Textura Dentro de Uma Peça',
          explanation:
            'A maioria das peças usa múltiplas texturas. Um andamento sinfónico pode começar com um tema monofónico, desenvolvê-lo homofonicamente com acompanhamento orquestral, construir até um clímax polifónico e regressar à homofonia. As mudanças de textura são uma ferramenta primária para criar contraste e estrutura. Uma mudança de homofonia para polifonia aumenta a complexidade e intensidade; uma mudança de volta proporciona alívio e clareza.',
          tryThisLabel: 'Toca uma linha melódica — imagina acrescentar acompanhamento',
        },
      ],
      tasks: [
        {
          instruction:
            'Toca uma escala no piano — isso é textura monofónica. Agora toca um acorde por baixo de uma nota melódica — isso é textura homofónica. A distinção é se o acompanhamento tem interesse melódico independente.',
        },
        {
          instruction:
            'Pensa em cinco canções que conheças. Classifica cada uma pela sua textura principal: monofónica (solo sem acompanhamento), homofónica (melodia + acordes) ou polifónica (múltiplas melodias independentes).',
        },
        {
          instruction:
            'Considera um hino: todas as vozes movem-se no mesmo ritmo com alturas diferentes. Isso é homorritmia, um tipo específico de homofonia. Compara com uma fuga onde cada voz entra separadamente com a mesma melodia.',
        },
      ],
    },

    // ── U17 M4: Guide Tone Lines ───────────────────────────────────────────
    l5u17m4: {
      title: 'Linhas de Notas-Guia',
      subtitle: 'Traçar 3.as e 7.as ao longo de progressões',
      objectives: [
        'Definir notas-guia como as 3.as e 7.as dos acordes',
        'Traçar linhas de notas-guia ao longo de progressões',
        'Usar a condução de vozes por notas-guia como ferramenta de composição',
      ],
      concepts: [
        {
          title: 'O Que São Notas-Guia?',
          explanation:
            'A 3.ª e a 7.ª de cada acorde são as notas que mais contribuem para definir a sua qualidade. A fundamental diz-te o nome do acorde; a 3.ª diz-te se é maior ou menor; a 7.ª, lida em conjunto com a 3.ª, diz-te o tipo de acorde de sétima (por exemplo, 3.ª maior + 7.ª maior = sétima maior; 3.ª maior + 7.ª menor = sétima da dominante; 3.ª menor + 7.ª menor = sétima menor). É por isso que os músicos de jazz chamam à 3.ª e à 7.ª a identidade do acorde — com uma ressalva: Cm7 e Cm7b5 partilham a mesma 3.ª e a mesma 7.ª (Eb e Bb), por isso nos acordes meio-diminutos a 5.ª também conta. Um baixista a cobrir a fundamental mais um pianista a tocar apenas a 3.ª e a 7.ª dá-te um quadro harmónico claro. Quase tudo o resto é cor.',
          tryThisLabel: 'Vê Dm7 — a 3.ª é F, a 7.ª é C',
        },
        {
          title: 'Traçar Linhas de Notas-Guia Através de ii–V–I',
          explanation:
            'Quando traças as 3.as e 7.as ao longo de uma progressão ii–V–I em C maior, formam linhas de condução de vozes suaves. Dm7: 3.ª = F, 7.ª = C. G7: 3.ª = B, 7.ª = F. Cmaj7: 3.ª = E, 7.ª = B. A 7.ª de cada acorde torna-se a 3.ª do seguinte (C, 7.ª de Dm7, desce para B, 3.ª de G7; F, 7.ª de G7, desce para E, 3.ª de Cmaj7). Para improvisadores, visar as notas-guia garante que acertas nas notas essenciais do acorde. Para arranjadores, as linhas de notas-guia são o esqueleto das partes de vozes internas.',
          tryThisLabel: 'Vê G7 — a 3.ª é B, a 7.ª é F',
        },
        {
          title: 'Notas-Guia como Ferramenta de Composição e Improvisação',
          explanation:
            'A condução de vozes por notas-guia é a abordagem Berklee para escrita suave de vozes internas. Para compor um arranjo, começa com notas do baixo (fundamentais ou inversões) e notas-guia (3.as e 7.as), depois preenche com notas de cor (5.as, extensões, alterações) à volta desse esqueleto. Para improvisação, tocar apenas as notas-guia de uma progressão de acordes delineia a harmonia com máxima eficiência — um baixista a cobrir fundamentais mais um pianista a tocar 3.as e 7.as dá o quadro harmónico completo. A consciência das notas-guia transforma escolhas de notas aleatórias em linhas direcionadas e harmonicamente conectadas.',
          tryThisLabel: 'Vê Cmaj7 — a 3.ª é E, a 7.ª é B',
        },
      ],
      tasks: [
        {
          instruction:
            'Escreve "Dm7" e encontra a 3.ª (F) e a 7.ª (C). Agora escreve "G7" — a 3.ª é B e a 7.ª é F. Repara: a 7.ª de Dm7 (C) desceu para B (3.ª de G7), e a 3.ª de Dm7 (F) manteve-se como 7.ª de G7.',
        },
        {
          instruction:
            'Escreve "G7" e depois "Cmaj7" — traça as notas-guia: a 3.ª de G7 (B) torna-se a 7.ª de Cmaj7 (B, nota comum). A 7.ª de G7 (F) desce para a 3.ª de Cmaj7 (E). Cada conexão é por grau ou estática.',
        },
        {
          instruction:
            'Toca o ii–V–I completo: "Dm7", "G7", "Cmaj7". As linhas de notas-guia são F–F–E (descendente por grau) e C–B–B (descendente por grau e depois mantendo). Esta é a condução de vozes mais suave na música tonal.',
        },
      ],
    },
  },
};

export default curriculumL5;
