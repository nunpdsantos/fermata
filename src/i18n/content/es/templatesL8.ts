import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish overlay for Level 8 exercise templates
// 11 modules — index-aligned with templatesL8.ts (W4-01 re-keying, 2026-10-31)
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidad 25: Fuga y Contrapunto Imitativo
  // =========================================================================

  // ---- l8u25m1: Exposición de la Fuga ----
  l8u25m1: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la exposición de la fuga es verdadera?',
      hintTemplate:
        'Exposición de la fuga: el sujeto entra en la tónica y la respuesta aparece al nivel de la dominante. Una respuesta real transpone exactamente, una 5.ª justa por encima o una 4.ª justa por debajo. Una respuesta tonal ajusta el inicio: el grado 5 se responde con el 1, manteniendo la relación tónica–dominante en vez de tonicizar inmediatamente la dominante. Las voces siguientes alternan entradas en la tónica y en la dominante; un contrasujeto es una línea recurrente que acompaña entradas posteriores.',
      choiceSets: [
        [
          'El sujeto entra primero en la tonalidad de la tónica y la respuesta entra en la dominante',
          "El sujeto entra primero en la tonalidad de la dominante y la respuesta entra en la tónica",
          "El sujeto entra primero en la tonalidad de la tónica y la respuesta entra en la tónica",
          "El sujeto entra primero en la tonalidad de la dominante y la respuesta entra en la dominante",
        ],
        [
          'Una respuesta tonal ajusta intervalos para evitar tonicizar la dominante en el punto de entrada',
          'Una respuesta tonal transpone el sujeto exactamente a la dominante, sin ajustar intervalos en el punto de entrada',
          "Una respuesta tonal ajusta la instrumentación para mantener el sujeto en su voz original",
          "Una respuesta tonal conserva exactamente los intervalos y cambia el compás para establecer la dominante",
        ],
        [
          'Una respuesta real transpone el sujeto exactamente a la dominante (una 5.ª justa por encima o 4.ª justa por debajo)',
          "Una respuesta real transpone el sujeto exactamente a la subdominante (una 4.ª justa por encima o 5.ª justa por debajo)",
          "Una respuesta real transpone el sujeto exactamente a la tónica (una 8.ª justa por encima u 8.ª justa por debajo)",
          "Una respuesta real transpone el sujeto exactamente a la sensible (una 7.ª mayor por encima o 2.ª menor por debajo)",
        ],
        [
          "El contrasujeto es una línea melódica recurrente que acompaña entradas posteriores del sujeto",
          "El contrasujeto es el propio sujeto, transpuesto para acompañar entradas posteriores del sujeto",
          "El contrasujeto es la propia respuesta, repetida para introducir entradas posteriores del sujeto",
          'El contrasujeto es una nota pedal en el bajo, mantenida por debajo de las entradas posteriores del sujeto',
        ],
      ],
    },
  ],

  // ---- l8u25m2: Episodios y Stretto ----
  l8u25m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre los episodios, el stretto y los recursos de la fuga es verdadera?',
      hintTemplate:
        'Episodios: pasajes entre entradas del sujeto, frecuentemente usando secuencias basadas en fragmentos. Stretto: entradas solapadas del sujeto donde la respuesta comienza antes de que el sujeto termine. La aumentación alarga los valores de las notas, normalmente duplicándolos; la disminución los acorta, normalmente a la mitad.',
      choiceSets: [
        [
          'El stretto superpone entradas del sujeto: la siguiente empieza antes de terminar la anterior',
          'El stretto separa entradas del sujeto: la siguiente empieza después de terminar la anterior',
          'El stretto aumenta entradas del sujeto: la siguiente duplica los valores de nota anteriores',
          'El stretto retrograda entradas del sujeto: la siguiente invierte el orden de las notas anteriores',
        ],
        [
          'Los episodios modulan entre áreas tonales, frecuentemente usando secuencias derivadas del sujeto',
          "Los episodios son presentaciones completas del sujeto en nuevas tonalidades, normalmente acompañadas por el contrasujeto",
          "Los episodios presentan la primera entrada del sujeto en cada voz, estableciendo la exposición de la fuga",
          "Los episodios son entradas superpuestas del sujeto completo, que suelen comenzar antes de terminar las anteriores",
        ],
        [
          'La aumentación multiplica los valores de las notas por dos',
          'La aumentación divide los valores de las notas por dos',
          'La aumentación invierte la secuencia de las notas',
          'La aumentación invierte la dirección de los intervalos',
        ],
        [
          'La disminución presenta el sujeto en valores de nota más cortos (generalmente reducidos a la mitad)',
          "La disminución presenta el sujeto en valores de nota más largos (generalmente duplicados)",
          "La disminución significa eliminar notas manteniendo inalterados los valores de nota restantes",
          "La disminución significa invertir el orden de las notas manteniendo los valores de nota originales",
        ],
      ],
    },
  ],

  // ---- l8u25m3: Canon ----
  l8u25m3: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre los tipos de canon es verdadera?',
      hintTemplate:
        'Tipos de canon: estricto (imitación exacta), a la octava, a la 5.ª, en inversión (movimiento contrario), en retrogradación (canon cangrejo), canon doble (2 cánones independientes). Un canon perpetuo conecta su final con su inicio para poder repetirse continuamente.',
      choiceSets: [
        [
          'Un canon en inversión transforma cada ascenso melódico en descenso y cada descenso en ascenso',
          'Un canon en inversión lee la melodía desde su última nota hasta la primera',
          'Un canon en inversión mantiene la melodía pero da a cada nota el doble de su duración original',
          'Un canon en inversión mantiene la melodía pero da a cada nota la mitad de su duración original',
        ],
        [
          "Un canon cangrejo significa leer la melodía del final al principio",
          "Un canon cangrejo significa leer la melodía con las direcciones de sus intervalos invertidas",
          "Un canon cangrejo significa leer la melodía con las duraciones de las notas duplicadas",
          "Un canon cangrejo significa leer la melodía como un canon circular en repetición continua",
        ],
        [
          "Lo que define un canon perpetuo es que vuelve al inicio",
          "Lo que define un canon perpetuo es que invierte el orden de las notas",
          "Lo que define un canon perpetuo es que duplica los valores de las notas",
          "Lo que define un canon perpetuo es que reduce a la mitad los valores de las notas",
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 26: Gran Forma y Orquestación
  // =========================================================================

  // ---- l8u26m1: Forma Sonata ----
  l8u26m1: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la forma sonata es verdadera?',
      hintTemplate:
        'Secciones de la forma sonata: Exposición (1.er grupo temático, transición, 2.º grupo temático, tema conclusivo), Desarrollo (fragmentación, secuencias, tonalidades remotas), Reexposición (todo en la tónica), Coda opcional. Una falsa reexposición sugiere el regreso en otra tonalidad antes del verdadero regreso a la tónica.',
      choiceSets: [
        [
          'La transición en la exposición modula de la tónica al área tonal secundaria',
          "La transición en la exposición modula del área tonal secundaria de vuelta a la tónica",
          "La transición en la exposición confirma la tonalidad secundaria después de terminar el segundo tema",
          "La transición en la exposición reexpone el primer tema en la tónica después del desarrollo",
        ],
        [
          'El desarrollo presenta típicamente fragmentación, secuencia y modulación por tonalidades lejanas',
          "El desarrollo presenta típicamente los dos temas contrastantes y establece sus áreas tonales originales",
          "El desarrollo reexpone típicamente ambos temas en la tónica para resolver su contraste tonal original",
          "El desarrollo presenta típicamente al solista del concierto después de la primera exposición orquestal",
        ],
        [
          'Una falsa reexposición comienza el regreso del tema en la tonalidad equivocada antes de la verdadera reexposición',
          'Una falsa reexposición es la verdadera reexposición en la tónica, pero con el primer tema dejado fuera',
          'Una falsa reexposición es la retransición, el pasaje construido sobre la dominante para preparar el verdadero regreso',
          'Una falsa reexposición aparece después de la verdadera reexposición, como apertura de una coda expandida',
        ],
        [
          'En la exposición de una sonata en A menor, el segundo tema está típicamente en C mayor',
          'En la exposición de una sonata en A menor, el segundo tema está típicamente en A mayor',
          'En la exposición de una sonata en A menor, el segundo tema está típicamente en B menor',
          'En la exposición de una sonata en A menor, el segundo tema está típicamente en D menor',
        ],
      ],
    },
  ],

  // ---- l8u26m2: Variación, Rondó y Ritornello ----
  l8u26m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las formas de variación, rondó y ritornello es verdadera?',
      hintTemplate:
        'Ritornello: pasaje orquestal recurrente alternando con episodios solistas (concierto barroco). Rondó-sonata: ABACAB\'A combina principios del rondó y de la sonata. Una passacaglia desarrolla variaciones sobre una línea de bajo recurrente.',
      choiceSets: [
        [
          'La forma de ritornello da los estribillos al tutti y los pasajes contrastantes al solista',
          'La forma de ritornello da el tema recurrente al solista y material nuevo a cada tutti orquestal',
          'La forma de ritornello da el tema inicial a la orquesta y no lo hace volver después',
          'La forma de ritornello da el tema orquestal a cada episodio solista como copia exacta',
        ],
        [
          "El rondó-sonata retoma típicamente el tema A y vuelve a B en la tónica en la segunda mitad",
          "El rondó-sonata retoma típicamente el tema A y vuelve a B en la tonalidad secundaria en la segunda mitad",
          "El rondó-sonata evita típicamente retomar el tema A y vuelve a B en la tónica en la segunda mitad",
          "El rondó-sonata retoma típicamente el tema A y omite el regreso de B en la segunda mitad",
        ],
        [
          "Una passacaglia es un conjunto de variaciones sobre una línea de bajo recurrente",
          'Una passacaglia es un estribillo recurrente que alterna con episodios melódicos contrastantes',
          "Una passacaglia es una estructura de dos temas con exposición, desarrollo y reexposición",
          'Una passacaglia es un pasaje orquestal recurrente que alterna con episodios solistas contrastantes',
        ],
      ],
    },
  ],

  // ---- l8u26m3: Orquestación ----
  l8u26m3: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre los instrumentos de la orquesta es verdadera?',
      hintTemplate:
        'Familias de la orquesta: cuerdas, maderas, metales, percusión. Cada instrumento tiene una extensión, timbre y función característicos en el conjunto. Un instrumento transpositor suena a una altura diferente de la escrita.',
      choiceSets: [
        [
          "Pentagramas de cuerda de arriba abajo en una partitura orquestal convencional: violín I, violín II, viola, violonchelo, contrabajo",
          "Pentagramas de cuerda de arriba abajo en una partitura orquestal convencional: viola, violín II, violín I, violonchelo, contrabajo",
          "Pentagramas de cuerda de arriba abajo en una partitura orquestal convencional: violín I, violín II, violonchelo, viola, contrabajo",
          "Pentagramas de cuerda de arriba abajo en una partitura orquestal convencional: violín I, violín II, viola, contrabajo, violonchelo",
        ],
        [
          'En el clarinete en Bb, el D5 escrito siempre suena como C5',
          'En el clarinete en Bb, el D5 escrito siempre suena como E5',
          'En el clarinete en Bb, el D5 escrito siempre suena como B4',
          'En el clarinete en Bb, el D5 escrito siempre suena como F5',
        ],
        [
          'La trompa en F suena una 5.ª justa por debajo de lo escrito',
          "La trompa en F suena una 5.ª justa por encima de lo escrito",
          "La trompa en F suena una 4.ª justa por debajo de lo escrito",
          "La trompa en F suena una octava por debajo de lo escrito",
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 27: Teoría de Conjuntos y Técnicas del Siglo XX
  // =========================================================================

  // ---- l8u27m1: Conjuntos de Clases de Altura ----
  l8u27m1: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre los conjuntos de clases de altura es verdadera?',
      hintTemplate:
        'Clases de altura: C=0 hasta B=11. Un conjunto de clases de altura lista clases de altura sin repetir en orden ascendente. El orden normal las coloca en la disposición más compacta.',
      choiceSets: [
        [
          'Un conjunto de clases de altura trata las notas equivalentes a la octava y enarmónicas como una sola clase, usando enteros de 0 a 11',
          'Un conjunto de clases de altura mantiene nombres de notas y números de octava, así que C4 y C5 cuentan como dos clases diferentes en el conjunto',
          'Los conjuntos de clases de altura solo funcionan para música tonal',
          'Los enteros de conjuntos de clases de altura van de 0 a 7',
        ],
        [
          'El orden normal agrupa las notas lo más cerca posible dentro de una octava, leídas de abajo hacia arriba',
          'El orden normal agrupa las notas lo más cerca posible dentro de una octava, leídas de arriba hacia abajo',
          'El orden normal agrupa las notas lo más lejos posible dentro de una octava, leídas de abajo hacia arriba',
          'El orden normal agrupa las notas lo más lejos posible dentro de una octava, leídas de arriba hacia abajo',
        ],
        [
          "Las clases de altura {0, 4, 7} corresponden a las notas del acorde de C mayor",
          "Las clases de altura {0, 4, 7} corresponden a las notas del acorde de E mayor",
          "Las clases de altura {0, 4, 7} corresponden a las notas del acorde de G mayor",
          "Las clases de altura {0, 4, 7} corresponden a las notas del acorde de B mayor",
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre vectores interválicos, forma prima y relaciones Z es verdadera?',
      hintTemplate:
        'Vector interválico: conteos de cada clase de intervalo (ci 1-6) en un conjunto, escrito como <x x x x x x>. Dos conjuntos tienen relación Z cuando comparten el mismo vector interválico pero NO están relacionados por transposición o inversión (pertenecen a clases de conjuntos diferentes). La forma prima elige el representante más compacto tras comparar transposiciones e inversiones y después comienza en 0.',
      choiceSets: [
        [
          'El vector interválico cuenta ocurrencias de cada clase de intervalo (1 a 6) en un conjunto de clases de altura',
          "El vector interválico cuenta ocurrencias de cada clase de intervalo (1 a 12) en un conjunto de clases de altura",
          "El vector interválico cuenta ocurrencias de cada clase de intervalo (0 a 5) en un conjunto de clases de altura",
          "El vector interválico cuenta ocurrencias de cada clase de intervalo (0 a 11) en un conjunto de clases de altura",
        ],
        [
          'La forma prima compara transposiciones e inversiones y empieza la forma elegida en 0',
          'La forma prima compara solo transposiciones y empieza la forma elegida en 0',
          'La forma prima compara transposiciones e inversiones y mantiene la forma elegida en su altura original',
          'La forma prima compara solo transposiciones y mantiene la forma elegida en su altura original',
        ],
        [
          'Los conjuntos con relación Z tienen inventarios interválicos iguales, pero no coinciden por transposición ni por inversión',
          'Los conjuntos con relación Z tienen inventarios interválicos iguales porque la transposición transforma directamente uno en otro',
          'Los conjuntos con relación Z comparten la forma prima, pero difieren en el número de apariciones de cada clase de intervalo',
          "Los conjuntos con relación Z tienen inventarios interválicos diferentes, pero coinciden por transposición o inversión",
        ],
      ],
    },
  ],

  // ---- l8u27m2: Técnica Dodecafónica ----
  l8u27m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la técnica dodecafónica es verdadera?',
      hintTemplate:
        'La serie usa las 12 clases de altura en un orden fijo. Transformaciones: P (original), I (inversión), R (retrógrada), RI (retrógrada-inversión). La matriz 12x12 organiza las 48 formas de la serie.',
      choiceSets: [
        [
          'La serie original ordena las 12 clases de altura, sin duplicar ninguna dentro de esa serie',
          'La serie original ordena las 12 clases de altura y duplica la primera como decimotercera entrada',
          'La serie original divide las 12 clases de altura en dos series independientes de seis notas',
          'La serie original divide las 12 clases de altura en tres series independientes de cuatro notas',
        ],
        [
          "Las cuatro formas básicas leen la serie hacia delante, hacia atrás, en espejo, o hacia atrás y en espejo",
          "Las cuatro formas básicas leen la serie hacia delante, hacia atrás, con el doble de duración, o con la mitad de duración",
          "Las cuatro formas básicas leen la serie hacia delante, en espejo, con el doble de duración, o con la mitad de duración",
          "Las cuatro formas básicas leen la serie hacia atrás, en espejo, con el doble de duración, o con la mitad de duración",
        ],
        [
          'Una matriz 12×12 presenta 48 formas de la serie',
          'Una matriz 12×12 presenta 24 formas de la serie',
          'Una matriz 12×12 presenta 36 formas de la serie',
          'Una matriz 12×12 presenta 12 formas de la serie',
        ],
      ],
    },
  ],

  // ---- l8u27m3: Planing, Politonalidad y Pandiatonicismo ----
  l8u27m3: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el paralelismo, la politonalidad y la música espectral es verdadera?',
      hintTemplate:
        'El paralelismo mueve una forma de acorde en paralelo. La politonalidad hace sonar dos o más tonalidades a la vez; el pandiatonicismo usa libremente las notas de una tonalidad, sin armonía funcional. El espectralismo construye la armonía a partir de la serie de armónicos; la microtonalidad usa pasos menores que un semitono.',
      choiceSets: [
        [
          'La politonalidad siempre hace sonar dos o más tonalidades a la vez, por ejemplo C mayor contra F# mayor',
          "La politonalidad siempre hace sonar dos modos en la misma tónica, por ejemplo C lidio contra C mixolidio",
          "La politonalidad siempre hace sonar dos tonalidades sucesivamente, por ejemplo C mayor seguido de F# mayor",
          "La politonalidad siempre hace sonar una tonalidad en dos registros, por ejemplo C mayor en el agudo y en el grave",
        ],
        [
          'El pandiatonicismo usa una colección diatónica sin exigir progresiones funcionales',
          'El pandiatonicismo usa una colección cromática sin exigir progresiones funcionales',
          'El pandiatonicismo usa una colección diatónica exigiendo progresiones funcionales',
          'El pandiatonicismo usa una colección cromática exigiendo progresiones funcionales',
        ],
        [
          'El paralelismo estricto (cromático) siempre mantiene los intervalos exactos; el paralelismo diatónico los ajusta a la escala',
          "El paralelismo estricto (cromático) suele ajustar los intervalos a la escala; el paralelismo diatónico mantiene los intervalos exactos",
          "El paralelismo estricto (cromático) mueve las voces extremas en movimiento contrario; el diatónico las mueve en paralelo",
          "El paralelismo estricto (cromático) mantiene el bajo inmóvil mientras se mueven las voces superiores; el diatónico mueve todas las voces",
        ],
        [
          "La música espectral construye acordes estudiando las frecuencias que componen un sonido",
          'La música espectral construye acordes estudiando las alturas ordenadas de una serie dodecafónica',
          'La música espectral construye acordes estudiando el ciclo de acordes dominantes de una tonalidad',
          'La música espectral construye acordes estudiando las duraciones escritas de las notas de una melodía',
        ],
        [
          'La microtonalidad usa intervalos menores que un semitono, no solo las 12 notas habituales',
          "La microtonalidad usa intervalos iguales a un semitono, limitada a las 12 alturas habituales",
          "La microtonalidad usa cambios de intensidad en vez de cambios de altura",
          "La microtonalidad usa cambios de duración en vez de cambios de altura",
        ],
      ],
    },
  ],

  // ---- l8u27m4: Minimalismo, Aleatoriedad y Técnicas Expandidas ----
  l8u27m4: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el minimalismo, la música aleatoria y las técnicas expandidas es verdadera?',
      hintTemplate:
        'Minimalismo: patrones repetitivos, proceso gradual, material armónico limitado. Pioneros: Reich (desfase), Glass (proceso aditivo), Riley (bucles de cinta). La música aleatoria deja elementos al azar; las técnicas expandidas son formas no convencionales de tocar o cantar.',
      choiceSets: [
        [
          'El desfase desplaza gradualmente dos patrones repetidos idénticos fuera de sincronía',
          'El desfase mantiene dos patrones repetidos idénticos exactamente sincronizados',
          'El desfase expande dos patrones repetidos idénticos añadiendo notas',
          'El desfase da a dos patrones repetidos idénticos alturas nuevas elegidas al azar',
        ],
        [
          'Un proceso aditivo alarga un patrón repetido añadiendo notas gradualmente',
          'Un proceso aditivo acorta un patrón repetido quitando notas gradualmente',
          'Un proceso aditivo desplaza gradualmente dos patrones repetidos fuera de sincronía',
          'Un proceso aditivo elige al azar las notas de un patrón repetido',
        ],
        [
          'La música aleatoria deja algunos elementos al azar o a la elección del intérprete',
          "La música aleatoria fija alturas, duraciones y dinámicas de antemano sin azar ni elección del intérprete",
          "La música aleatoria significa expandir un patrón repetido añadiéndole notas gradualmente",
          "La música aleatoria significa desplazar gradualmente dos patrones repetidos idénticos fuera de sincronía",
        ],
        [
          'Las técnicas expandidas incluyen multifónicos, piano preparado, col legno y Sprechstimme',
          'Las técnicas expandidas incluyen desfase, adición, repetición y transformación gradual',
          'Las técnicas expandidas incluyen monedas al aire, mapas estelares, forma móvil y operaciones de azar',
          'Las técnicas expandidas incluyen pulso regular, bordones, patrones repetidos y ritmos aditivos',
        ],
      ],
    },
  ],

  // ---- l8u27m5: Ritmo Avanzado ----
  l8u27m5: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la polirritmia, la hemiola y la modulación métrica es verdadera?',
      hintTemplate:
        'Polirritmia: dos divisiones del mismo lapso a la vez (3 contra 2). Polimetría: dos compases a la vez. Hemiola: 2 × 3 pulsos reagrupados como 3 × 2. Modulación métrica: una figura del tempo antiguo se convierte en una figura del nuevo. En compás simple, un quintillo de semicorcheas encaja cinco notas iguales en el espacio de cuatro semicorcheas normales.',
      choiceSets: [
        [
          'Una polirritmia hace sonar dos divisiones en conflicto del mismo lapso a la vez, por ejemplo 3 contra 2',
          "Una polirritmia suele dividir el mismo intervalo de tiempo igual en cada parte, por ejemplo 3 notas iguales contra 3 notas iguales",
          "Una polirritmia acelera un único patrón rítmico, por ejemplo corcheas repetidas de 80 a 120 pulsos por minuto",
          "Una polirritmia cambia todas las partes a un nuevo compás juntas, por ejemplo 3/4 seguido de 4/4 en la barra siguiente",
        ],
        [
          'La polimetría opone dos compases, por ejemplo 3/4 en una parte contra 4/4 en otra',
          "La polimetría mantiene el mismo compás en ambas partes, por ejemplo 3/4 en una parte contra 3/4 en otra",
          "La polimetría cambia el compás de ambas partes juntas, por ejemplo 3/4 en ambas seguido de 4/4 en ambas",
          'La polimetría divide un compás compartido de formas diferentes, por ejemplo tres notas contra dos en un compás de 6/8',
        ],
        [
          'Una hemiola reagrupa seis pulsos de 2 × 3 en 3 × 2, por ejemplo dos compases de 3/4 sentidos como un compás de 3/2',
          "Una hemiola suele duplicar el tempo, por ejemplo seis pulsos de negra comprimidos en la duración de tres",
          'Una hemiola mantiene seis pulsos en 3 + 3 pero desplaza el acento al pulso 2 de cada compás',
          "Una hemiola añade un pulso a cada compás ternario, por ejemplo dos compases de 3/4 ampliados a dos de 4/4",
        ],
        [
          'Modulación métrica: si las corcheas de tresillo a ♩ = 120 pasan a ser las nuevas corcheas, la nueva ♩ = 180',
          "Modulación métrica: si las corcheas de tresillo a ♩ = 120 pasan a ser las nuevas corcheas, la nueva ♩ = 120",
          "Modulación métrica: si las corcheas de tresillo a ♩ = 120 pasan a ser las nuevas corcheas, la nueva ♩ = 80",
          "Modulación métrica: si las corcheas de tresillo a ♩ = 120 pasan a ser las nuevas corcheas, la nueva ♩ = 240",
        ],
        [
          'En un compás simple, un quintillo de semicorcheas ocupa el tiempo de cuatro semicorcheas normales',
          'En un compás simple, un quintillo de semicorcheas ocupa el tiempo de tres semicorcheas normales',
          'En un compás simple, un quintillo de semicorcheas ocupa el tiempo de cinco semicorcheas normales',
          'En un compás simple, un quintillo de semicorcheas ocupa el tiempo de seis semicorcheas normales',
        ],
      ],
    },
  ],

};

export default overlay;
