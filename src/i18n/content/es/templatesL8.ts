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
        'Exposición de la fuga: el sujeto entra en la tónica, la respuesta entra en la dominante (real o tonal), las voces siguientes entran alternando T-D. Un contrasujeto acompaña cada nueva entrada.',
      choiceSets: [
        [
          'El sujeto entra primero en la tonalidad de la tónica y la respuesta entra en la dominante',
          'La respuesta entra primero, en la subdominante, y el sujeto la sigue después en la tonalidad de la tónica',
          'Tanto el sujeto como la respuesta están en la tónica, así que la exposición se queda en la tonalidad principal desde la primera entrada',
          'El sujeto entra primero en la tonalidad de la dominante y la respuesta entra después en la tonalidad de la tónica',
        ],
        [
          'Una respuesta tonal ajusta intervalos para evitar tonicizar la dominante en el punto de entrada',
          'Una respuesta tonal transpone el sujeto exactamente a la dominante, sin cambiar ningún intervalo',
          'Una respuesta tonal está en un metro diferente',
          'Respuestas tonales y reales son el mismo concepto con dos nombres, usados en épocas distintas',
        ],
        [
          'Una respuesta real transpone el sujeto exactamente a la dominante (una 5.ª justa por encima o 4.ª justa por debajo)',
          'Una respuesta real cambia algunos intervalos del sujeto para poder quedarse en la tonalidad de la tónica',
          'Una respuesta tonal, y no una real, transpone exactamente los intervalos del sujeto a la dominante, una 5.ª justa por encima',
          'Una respuesta real es el contrasujeto, una segunda melodía escrita contra el sujeto',
        ],
        [
          'El contrasujeto es una línea melódica recurrente que acompaña cada nueva entrada del sujeto',
          'El contrasujeto es solo el propio sujeto, repetido en la tónica cada vez que una nueva voz entra en la fuga',
          'El contrasujeto solo aparece una vez',
          'El contrasujeto está siempre al unísono con la respuesta',
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
        'Episodios: pasajes entre entradas del sujeto, frecuentemente usando secuencias basadas en fragmentos. Stretto: entradas solapadas del sujeto donde la respuesta comienza antes de que el sujeto termine.',
      choiceSets: [
        [
          'En el stretto, una nueva entrada comienza el sujeto antes de que la anterior lo haya terminado',
          'En el stretto cada voz espera a que la entrada anterior termine y solo entonces entra',
          'En el stretto, cuanto mayor es el espacio entre las entradas, más dramáticamente poderoso es el pasaje',
          'El stretto está reservado a la exposición y se evita cerca del final de la fuga',
        ],
        [
          'Los episodios modulan entre áreas tonales, frecuentemente usando secuencias derivadas del sujeto',
          'Los episodios presentan siempre el sujeto completo en la tónica, sin ninguna modulación',
          'Los episodios son las entradas intermedias: presentaciones completas del sujeto en tonalidades relacionadas',
          'Los episodios deben permanecer en la tonalidad de la tónica',
        ],
        [
          'La aumentación duplica las duraciones',
          'La aumentación añade notas al sujeto, manteniendo todos sus valores de nota iguales a los originales',
          'La aumentación es lo mismo que la inversión',
          'La aumentación acorta los valores de nota',
        ],
        [
          'La disminución presenta el sujeto en valores de nota más cortos (generalmente reducidos a la mitad)',
          'La disminución quita notas al sujeto, pero mantiene sus valores de nota originales',
          'La disminución presenta el sujeto en valores de nota más largos (generalmente duplicados)',
          'La disminución hace el sujeto más fuerte',
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
        'Tipos de canon: estricto (imitación exacta), a la octava, a la 5.ª, en inversión (movimiento contrario), en retrogradación (canon cangrejo), canon doble (2 cánones independientes).',
      choiceSets: [
        [
          'Un canon en inversión (canon espejo) imita la melodía en movimiento contrario',
          'Un canon en inversión toca la melodía al revés, de la última nota a la primera, a la misma altura',
          'Un canon en inversión invierte el ritmo',
          'Canon en inversión es lo mismo que aumentación: la voz que sigue repite la melodía en valores de nota más largos',
        ],
        [
          'Un canon cangrejo (canon cancrizans) presenta la melodía en retrogradación',
          'Un canon cangrejo (canon cancrizans) pone la melodía cabeza abajo, en movimiento contrario',
          'Un canon cangrejo (canon cancrizans) duplica los valores de las notas en el seguidor',
          'Un canon cangrejo (canon cancrizans) es un canon perpetuo al unísono, con voces que entran a intervalos regulares',
        ],
        [
          'Un canon perpetuo vuelve al inicio',
          'Un canon perpetuo va añadiendo voces y acelerando hasta llegar a una cadencia final',
          'Un canon perpetuo acelera gradualmente',
          'Un canon perpetuo tiene siempre un final claro',
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
        'Secciones de la forma sonata: Exposición (FTG-TR-STG-CT), Desarrollo (fragmentación, secuencias, tonalidades remotas), Reexposición (todo en la tónica), Coda opcional.',
      choiceSets: [
        [
          'La transición en la exposición modula de la tónica al área tonal secundaria',
          'La transición en la exposición permanece en la tónica y se limita a introducir el segundo tema',
          'La transición es el material conclusivo, que confirma la nueva tonalidad después del segundo tema',
          'La transición se omite siempre',
        ],
        [
          'El desarrollo típicamente presenta fragmentación, secuencia y modulación por tonalidades remotas',
          'El desarrollo construye la retransición sobre la tónica para preparar el regreso',
          'El desarrollo permanece en la tónica',
          'El desarrollo deja de lado los temas de la exposición e introduce melodías nuevas, cada una oída por primera vez',
        ],
        [
          'Una falsa reexposición comienza el regreso del tema en la tonalidad equivocada antes de la verdadera reexposición',
          'Una falsa reexposición es la verdadera reexposición en la tónica, pero con el primer tema dejado fuera',
          'Una falsa reexposición es la retransición, el pasaje construido sobre la dominante para preparar el verdadero regreso',
          'Una falsa reexposición aparece después de la verdadera reexposición, como apertura de una coda expandida',
        ],
        [
          'En una sonata en tonalidad menor, el segundo tema está típicamente en el relativo mayor (III)',
          'En una sonata en tonalidad menor, el segundo tema permanece normalmente en la tónica menor y nunca modula',
          'Las sonatas menores ponen normalmente el segundo tema en la subdominante (iv), una 4.ª por encima de la tónica',
          'En una sonata en tonalidad menor, el segundo tema está típicamente en la dominante menor (v), una 5.ª por encima de la tónica',
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
        'Ritornello: pasaje orquestal recurrente alternando con episodios solistas (concierto barroco). Sonata-rondó: ABACAB\'A combina principios del rondó y de la sonata.',
      choiceSets: [
        [
          'La forma de ritornello alterna pasajes de tutti orquestal con episodios solistas',
          'La forma de ritornello alterna pasajes solistas con episodios orquestales, así que es el solista quien toca el tema recurrente',
          'El ritornello solo usa solistas',
          'La forma de ritornello no tiene material recurrente: cada pasaje orquestal trae un tema propio',
        ],
        [
          'El sonata-rondó combina el tema A recurrente del rondó con las relaciones tonales de la forma sonata',
          'El sonata-rondó es un rondó simple, sin ningún tema recurrente, y se usa únicamente en la música vocal',
          'El sonata-rondó es un rondó común, ABACA, cuyos episodios se quedan en la tonalidad de la tónica',
          'En el sonata-rondó, la sección B regresa en la dominante en la segunda mitad',
        ],
        [
          'Una passacaglia es un conjunto de variaciones sobre una línea de bajo recurrente (bajo ostinato)',
          'Una passacaglia es una fuga en la que el sujeto ya nunca regresa una vez terminada la exposición',
          'Una passacaglia es un tipo de rondó (ABACA), en el que un estribillo regresa entre los distintos episodios contrastantes',
          'Una passacaglia no tiene elemento recurrente',
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
          'Cuerdas de la más aguda a la más grave: violín I, violín II, viola, violonchelo, contrabajo',
          'Cuerdas de la más aguda a la más grave: violas, violín I, violín II, contrabajos, violonchelos',
          'Cuerdas de la más aguda a la más grave: violín I, violín II, violonchelo, viola, contrabajo',
          'El contrabajo es más agudo que el violonchelo',
        ],
        [
          'Un clarinete en Bb siempre suena una 2.ª mayor por debajo de lo escrito: lee C y se oye Bb',
          'Un clarinete en Bb suena exactamente como está escrito: su C escrito se oye como C',
          'El clarinete en Bb suena más agudo que lo escrito',
          'Solo los instrumentos de percusión transponen',
        ],
        [
          'La trompa en F suena una 5.ª justa por debajo de lo escrito',
          'La trompa en F suena una 5.ª justa por encima de lo escrito, así que su C escrito suena como G',
          'La trompa en F es no transpositora, así que el C escrito es el C que se oye',
          'La trompa en F suena una octava por debajo',
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
        'Clases de altura: C=0 hasta B=11. Un conjunto de clases de altura lista CAs únicas en orden ascendente. La forma normal las coloca en la disposición más compacta.',
      choiceSets: [
        [
          'Un conjunto de clases de altura trata las notas equivalentes a la octava y enarmónicas como una sola clase, usando enteros de 0 a 11',
          'Un conjunto de clases de altura mantiene nombres de notas y números de octava, así que C4 y C5 cuentan como dos clases diferentes en el conjunto',
          'Los conjuntos de clases de altura solo funcionan para música tonal',
          'Los enteros de conjuntos de clases de altura van de 0 a 7',
        ],
        [
          'La forma normal siempre dispone el conjunto en el orden ascendente más compacto',
          'La forma normal enumera siempre las clases de altura en orden numérico, de 0 a 11, sea cual sea la extensión',
          'La forma normal usa orden descendente',
          'No existe ordenación estándar para conjuntos',
        ],
        [
          'El conjunto {C, E, G} = {0, 4, 7} es una tríada mayor expresada como clases de altura',
          '{0, 4, 7} es una tríada menor, porque 4 semitonos por encima de la fundamental son siempre una 3.ª menor',
          'El conjunto {C, E, G} = {0, 4, 7} es una tríada disminuida expresada como clases de altura',
          'Las tríadas no pueden expresarse como conjuntos de clases de altura',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre vectores interválicos, forma prima y relaciones Z es verdadera?',
      hintTemplate:
        'Vector interválico: conteos de cada clase de intervalo (ci 1-6) en un conjunto, escrito como <x x x x x x>. Dos conjuntos son Z-relacionados cuando comparten el mismo vector interválico pero NO están relacionados por transposición o inversión (pertenecen a clases de conjuntos diferentes).',
      choiceSets: [
        [
          'El vector interválico cuenta ocurrencias de cada clase de intervalo (1 a 6) en un conjunto de clases de altura',
          'El vector interválico cuenta solo los intervalos justos (4.as y 5.as) de un conjunto e ignora todas sus 2.as, 3.as, 6.as y 7.as',
          'El vector interválico usa nombres de notas',
          'Los vectores interválicos son otro nombre de la forma normal, que lista las clases de altura de un conjunto en orden ascendente',
        ],
        [
          'La forma prima transpone y/o invierte un conjunto a su forma más compacta, comenzando siempre en 0',
          'La forma prima es lo mismo que la forma normal: el conjunto no se transpone a 0 ni se invierte',
          'La forma prima solo transpone',
          'La forma prima comienza siempre en la nota más aguda',
        ],
        [
          'Los conjuntos Z-relacionados comparten el mismo vector interválico pero no son equivalentes por transposición/inversión',
          'Los conjuntos Z-relacionados son transposiciones unos de otros, así que sus vectores interválicos difieren',
          'Los conjuntos Z-relacionados comparten la misma forma prima, y por eso sus vectores interválicos coinciden',
          'La relación Z no existe en la teoría de conjuntos',
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
          'Una serie dodecafónica usa cada una de las 12 clases de altura exactamente una vez antes de cualquier repetición',
          'Una serie dodecafónica puede repetir libremente sus 12 clases de altura dentro de la serie original',
          'Una serie usa solo 7 alturas',
          'Una serie debe ser una escala',
        ],
        [
          'Las cuatro transformaciones básicas de la serie son Original, Inversión, Retrógrada y Retrógrada-Inversión',
          'Las cuatro transformaciones básicas de la serie son Original, Inversión, Retrógrada y Aumentación',
          'Existen solo 2 transformaciones básicas de la serie, Original y Retrógrada, porque la inversión no es una forma de la serie',
          'Las series quedan fijas una vez escritas, así que el compositor usa la serie original sin cambios a lo largo de la pieza',
        ],
        [
          'La matriz 12x12 contiene las 48 formas posibles (12P + 12I + 12R + 12RI)',
          'La matriz 12x12 muestra solo las 12 transposiciones de la serie original, porque las inversiones y las retrógradas no se pueden leer en ella',
          'La matriz contiene 36 formas de la serie: P, I y R, pero no RI',
          'Una serie puede dejar fuera una clase de altura, siempre que las otras once mantengan un orden fijo',
        ],
      ],
    },
  ],

  // ---- l8u27m3: Planing, Politonalidad y Pandiatonicismo ----
  l8u27m3: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el planing, la politonalidad y la música espectral es verdadera?',
      hintTemplate:
        'El planing mueve una forma de acorde en paralelo. La politonalidad hace sonar dos tonalidades a la vez; el pandiatonicismo usa libremente las notas de una tonalidad, sin armonía funcional. El espectralismo construye la armonía a partir de la serie de armónicos; la microtonalidad usa pasos menores que un semitono.',
      choiceSets: [
        [
          'La politonalidad siempre hace sonar dos o más tonalidades a la vez, por ejemplo C mayor contra F# mayor',
          'La politonalidad significa cambiar de tonalidad muchas veces en una melodía, pero de una en una',
          'La politonalidad no usa ninguna tonalidad',
          'La politonalidad es una técnica rítmica',
        ],
        [
          'El pandiatonicismo usa solo las notas de una tonalidad, libremente, sin progresiones armónicas funcionales',
          'El pandiatonicismo usa libremente las doce notas cromáticas, sin tonalidad ni armonía funcional',
          'El pandiatonicismo usa solo escalas pentatónicas',
          'El pandiatonicismo exige cadencias V-I',
        ],
        [
          'El planing cromático siempre mantiene los intervalos exactos; el planing diatónico los ajusta a la escala',
          'El planing cromático mantiene las voces dentro de la tonalidad; el diatónico, los intervalos exactos',
          'El planing usa siempre movimiento contrario',
          'El planing cambia el acorde en cada paso',
        ],
        [
          'La música espectral deriva la armonía de la serie de armónicos y del análisis acústico del sonido',
          'La música espectral construye toda su armonía a partir de una serie dodecafónica y evita la serie de armónicos',
          'La música espectral usa armonía tonal tradicional, con acordes apilados en terceras y cadencias V-I al final de las frases',
          'La música espectral evita todos los sonidos con altura definida',
        ],
        [
          'La microtonalidad usa intervalos menores que un semitono, no solo las 12 notas habituales',
          'La microtonalidad usa solo las 12 alturas estándar, pero toca cada una de ellas extremadamente bajito',
          'La microtonalidad usa solo las 12 alturas estándar',
          'La microtonalidad es lo mismo que la atonalidad: ambos términos designan música sin centro tonal',
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
        'Minimalismo: patrones repetitivos, proceso gradual, material armónico limitado. Pioneros: Reich (desfase), Glass (proceso aditivo), Riley (bucles de cinta). La música aleatoria deja elementos al azar; las técnicas expandidas son formas no convencionales de tocar.',
      choiceSets: [
        [
          'El desfase parte de dos patrones idénticos y los desplaza gradualmente fuera de sincronía',
          'El desfase añade gradualmente notas a un patrón repetido, que va creciendo poco a poco',
          'El desfase usa técnica dodecafónica',
          'El desfase implica alterar el contenido de alturas',
        ],
        [
          'El proceso aditivo añade gradualmente notas a un patrón repetido, creando una melodía que se expande lentamente',
          'El proceso aditivo quita gradualmente una nota al patrón de repetición en repetición, creando una melodía que se encoge lentamente',
          'El proceso aditivo cambia de tonalidad en cada repetición',
          'El proceso aditivo es lo mismo que tema y variaciones: cada repetición presenta una nueva versión ornamentada del tema original',
        ],
        [
          'La música aleatoria deja algunos elementos al azar o a la elección del intérprete',
          'La música aleatoria fija de antemano todas las notas y ritmos y no deja al intérprete ninguna elección',
          'La música aleatoria es siempre electrónica',
          'Aleatoria significa música muy rápida',
        ],
        [
          'Las técnicas expandidas incluyen multifónicos, piano preparado, col legno y sprechstimme',
          'Las técnicas expandidas son otro nombre de la música aleatoria: el intérprete decide qué notas tocar',
          'Las técnicas expandidas se aplican solo a la percusión',
          'Las técnicas expandidas son patrones repetitivos que evolucionan gradualmente, como el desfase',
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
        'Polirritmia: dos divisiones del mismo lapso a la vez (3 contra 2). Polimetría: dos compases a la vez. Hemiola: 2 × 3 pulsos reagrupados como 3 × 2. Modulación métrica: una figura del tempo antiguo se convierte en una figura del nuevo.',
      choiceSets: [
        [
          'Una polirritmia hace sonar dos divisiones en conflicto del mismo lapso a la vez, por ejemplo 3 contra 2',
          'Una polirritmia es un solo ritmo tocado al unísono por muchos instrumentos, con todas las partes dividiendo el pulso de la misma manera',
          'Una polirritmia es un accelerando gradual',
          'Una polirritmia exige siempre un compás compuesto, como 6/8, y nunca puede escribirse en un compás de 4/4',
        ],
        [
          'La polimetría opone dos compases, por ejemplo 3/4 en una parte contra 4/4 en otra',
          'La polimetría significa que la pieza pasa de 3/4 a 4/4 a la mitad, con todas las partes cambiando a la vez',
          'La polimetría usa solo un compás',
          'La polimetría es lo mismo que la síncopa, en la que los acentos caen fuera del pulso dentro de un compás que las partes comparten',
        ],
        [
          'Una hemiola reagrupa seis pulsos de 2 × 3 en 3 × 2, por ejemplo dos compases de 3/4 sentidos como un compás de 3/2',
          'Una hemiola duplica el tempo durante un único compás, de modo que seis pulsos caben en el espacio de solo tres pulsos',
          'Una hemiola es un silencio de medio pulso',
          'Una hemiola solo existe en el jazz',
        ],
        [
          'Modulación métrica: si las corcheas de tresillo a ♩ = 120 pasan a ser las nuevas corcheas, la nueva ♩ = 180',
          'Modulación métrica: si las corcheas de tresillo a ♩ = 120 pasan a ser las nuevas corcheas, el tempo del nuevo pasaje sigue siendo ♩ = 120, porque la modulación métrica nunca cambia la velocidad',
          'Modulación métrica significa cambiar de tonalidad',
          'La modulación métrica es un ritardando gradual, en el que la música se frena poco a poco hasta llegar a un tempo nuevo y más tranquilo',
        ],
        [
          'Un quintillo encaja cinco notas iguales en el tiempo que normalmente ocupan cuatro del mismo valor',
          'Un quintillo estira cuatro notas a lo largo de cinco pulsos, así que cada una dura más de lo que está escrito en la partitura',
          'Un quintillo solo puede escribirse en 5/4',
          'Un quintillo es una frase de cinco compases, creada añadiendo un compás extra a una frase regular de cuatro',
        ],
      ],
    },
  ],

};

export default overlay;
