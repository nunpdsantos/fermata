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
          'Tanto el sujeto como la respuesta están en la tónica',
          'El sujeto entra primero en la dominante',
        ],
        [
          'Una respuesta tonal ajusta intervalos para evitar tonicizar la dominante en el punto de entrada',
          'Una respuesta tonal transpone el sujeto exactamente a la dominante, sin cambiar ningún intervalo',
          'Una respuesta tonal está en un metro diferente',
          'Respuestas tonales y reales son conceptos idénticos',
        ],
        [
          'Una respuesta real transpone el sujeto exactamente a la dominante (una 5.ª J por encima o 4.ª J por debajo)',
          'Una respuesta real cambia siempre algunos intervalos del sujeto para poder permanecer en la tonalidad de la tónica',
          'Una respuesta real usa inversión',
          'Una respuesta real está siempre en la tónica',
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
          'En el stretto, una nueva voz comienza el sujeto antes de que la voz anterior lo haya terminado',
          'En el stretto cada voz espera a que la entrada anterior termine y luego toca el sujeto más despacio',
          'Stretto es lo mismo que un episodio',
          'Stretto solo ocurre en la exposición',
        ],
        [
          'Los episodios modulan entre áreas tonales, frecuentemente usando secuencias derivadas del sujeto',
          'Los episodios presentan siempre el sujeto completo y en la tonalidad de la tónica, sin ninguna modulación',
          'Los episodios nunca usan material del sujeto',
          'Los episodios deben permanecer en la tonalidad de la tónica',
        ],
        [
          'La aumentación presenta el sujeto en valores de nota más largos (duraciones duplicadas)',
          'La aumentación añade notas al sujeto, manteniendo todos sus valores de nota iguales a los originales',
          'La aumentación es lo mismo que la inversión',
          'La aumentación acorta los valores de nota',
        ],
        [
          'La disminución presenta el sujeto en valores de nota más cortos (duraciones reducidas a la mitad)',
          'La disminución quita notas al sujeto, manteniendo todos sus valores de nota originales sin ningún cambio',
          'La disminución es lo mismo que la retrogradación',
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
          'Canon en inversión es lo mismo que aumentación',
        ],
        [
          'Un canon cangrejo (canon cancrizans) presenta la melodía en retrogradación',
          'Un canon cangrejo (canon cancrizans) pone la melodía cabeza abajo, en movimiento contrario',
          'Un canon cangrejo se toca de lado',
          'Un canon cangrejo no tiene relación con la melodía original',
        ],
        [
          'Un canon perpetuo (infinito) regresa al inicio sin interrupción',
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
          'La transición introduce el segundo tema',
          'La transición se omite siempre',
        ],
        [
          'El desarrollo típicamente presenta fragmentación, secuencia y modulación por tonalidades remotas',
          'El desarrollo repite simplemente la exposición nota a nota, siempre en la tonalidad de la tónica de principio a fin',
          'El desarrollo permanece en la tónica',
          'El desarrollo introduce temas enteramente nuevos',
        ],
        [
          'Una falsa reexposición comienza el regreso del tema en la tonalidad equivocada antes de la verdadera reexposición',
          'Una falsa reexposición es simplemente la verdadera reexposición en la tónica, pero con el primer tema dejado fuera',
          'Una falsa reexposición está en la tónica',
          'Las falsas reexposiciones nunca ocurren en sonatas clásicas',
        ],
        [
          'En una sonata en tonalidad menor, el segundo tema está típicamente en el relativo mayor (III)',
          'En una sonata en tonalidad menor, el segundo tema permanece normalmente en la tónica menor y nunca modula',
          'Las sonatas menores ponen el segundo tema en la subdominante',
          'Las sonatas menores no tienen segundo tema',
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
          'La forma de ritornello es solo otro nombre del rondó, con solistas tocando todas las secciones',
          'El ritornello solo usa solistas',
          'El ritornello no tiene material recurrente',
        ],
        [
          'El sonata-rondó combina el tema A recurrente del rondó con las relaciones tonales de la forma sonata',
          'El sonata-rondó es un rondó simple, sin ningún tema recurrente, y se usa únicamente en la música vocal',
          'El sonata-rondó es simplemente un rondó',
          'El sonata-rondó no tiene tema recurrente',
        ],
        [
          'Una passacaglia es un conjunto de variaciones sobre una línea de bajo recurrente (bajo ostinato)',
          'Una passacaglia es una fuga en la que el sujeto ya nunca regresa una vez terminada la exposición',
          'Una passacaglia es un tipo de rondó',
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
          'Los violonchelos son más agudos que las violas',
          'El contrabajo es más agudo que el violonchelo',
        ],
        [
          'Un clarinete en Bb suena una 2.ª mayor por debajo de lo escrito: lee C y se oye Bb',
          'Un clarinete en Bb suena exactamente como está escrito, como todos los demás instrumentos de la orquesta',
          'El clarinete en Bb suena más agudo que lo escrito',
          'Solo los instrumentos de percusión transponen',
        ],
        [
          'La trompa en F suena una 5.ª justa por debajo de lo escrito',
          'La trompa en F suena una 5.ª justa por encima de lo escrito, así que su C escrito suena como G',
          'La trompa en F es no transpositora',
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
          'La forma normal dispone el conjunto en el orden ascendente más compacto',
          'La forma normal empieza siempre el conjunto en C y después lista sus clases de altura en orden descendente',
          'La forma normal usa orden descendente',
          'No existe ordenación estándar para conjuntos',
        ],
        [
          'El conjunto {C, E, G} = {0, 4, 7} es una tríada mayor expresada como clases de altura',
          '{0, 4, 7} es una tríada menor, porque 4 semitonos por encima de la fundamental son siempre una 3.ª menor',
          '{0, 4, 7} representa una tríada disminuida',
          'Las tríadas no pueden expresarse como conjuntos de clases de altura',
        ],
      ],
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre vectores interválicos, forma primaria y relaciones Z es verdadera?',
      hintTemplate:
        'Vector interválico: conteos de cada clase de intervalo (ci 1-6) en un conjunto, escrito como <x x x x x x>. Dos conjuntos son Z-relacionados cuando comparten el mismo vector interválico pero NO están relacionados por transposición o inversión (pertenecen a clases de conjuntos diferentes).',
      choiceSets: [
        [
          'El vector interválico cuenta ocurrencias de cada clase de intervalo (1 a 6) en un conjunto de clases de altura',
          'El vector interválico cuenta solo los intervalos justos de un conjunto e ignora todas sus 2.as, 3.as, 6.as y 7.as',
          'El vector interválico usa nombres de notas',
          'Los vectores interválicos son lo mismo que la forma normal',
        ],
        [
          'La forma primaria transpone y/o invierte un conjunto a su forma más compacta comenzando en 0',
          'La forma primaria es la forma normal dejada exactamente como está, nunca transpuesta a 0 y nunca invertida',
          'La forma primaria solo transpone',
          'La forma primaria comienza siempre en la nota más aguda',
        ],
        [
          'Los conjuntos Z-relacionados comparten el mismo vector interválico pero no son equivalentes por transposición/inversión',
          'Los conjuntos Z-relacionados son simplemente transposiciones unos de otros, así que tienen siempre vectores interválicos diferentes',
          'Los conjuntos Z-relacionados tienen vectores interválicos diferentes',
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
          'Una serie dodecafónica puede repetir cualquier altura libremente, siempre que las doce notas aparezcan en algún momento',
          'Una serie usa solo 7 alturas',
          'Una serie debe ser una escala',
        ],
        [
          'Las cuatro transformaciones básicas de la serie son Original, Inversión, Retrógrada y Retrógrada-Inversión',
          'Las cuatro transformaciones básicas de la serie son Original, Aumentación, Disminución y Modulación a la dominante',
          'Existen solo 2 transformaciones de la serie',
          'Las series no pueden transformarse',
        ],
        [
          'La matriz 12x12 contiene las 48 formas posibles (12P + 12I + 12R + 12RI)',
          'La matriz 12x12 contiene 144 formas de la serie diferentes, una para cada celda de la cuadrícula',
          'La matriz tiene 24 formas de la serie',
          'Cada forma de la serie es exclusiva de una celda',
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
          'La politonalidad hace sonar dos o más tonalidades a la vez, por ejemplo C mayor contra F# mayor',
          'La politonalidad significa cambiar de tonalidad muchas veces en una melodía, pero siempre una tonalidad cada vez',
          'La politonalidad no usa ninguna tonalidad',
          'La politonalidad es una técnica rítmica',
        ],
        [
          'El pandiatonicismo usa libremente las notas de una tonalidad, sin progresiones armónicas funcionales',
          'El pandiatonicismo usa las doce notas cromáticas por igual, de modo que no llega a oírse ninguna tonalidad',
          'El pandiatonicismo usa solo escalas pentatónicas',
          'El pandiatonicismo exige cadencias V-I',
        ],
        [
          'El planing cromático mantiene los intervalos exactos; el planing diatónico los ajusta a la escala',
          'El planing cromático mantiene todas las voces dentro de la tonalidad, mientras que el diatónico mantiene los intervalos exactos',
          'El planing usa siempre movimiento contrario',
          'El planing cambia el acorde en cada paso',
        ],
        [
          'La música espectral deriva la armonía de la serie de armónicos y del análisis acústico del sonido',
          'La música espectral construye toda su armonía a partir de una serie dodecafónica y evita la serie de armónicos',
          'La música espectral usa armonía tonal tradicional',
          'La música espectral evita todos los sonidos con altura definida',
        ],
        [
          'La microtonalidad divide la octava en intervalos menores que un semitono',
          'La microtonalidad usa solo las 12 alturas estándar, pero toca cada una de ellas extremadamente bajito',
          'La microtonalidad usa solo las 12 alturas estándar',
          'La microtonalidad es lo mismo que la atonalidad',
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
          'El desfase desplaza gradualmente dos patrones idénticos fuera de sincronía, creando texturas en evolución',
          'El desfase mantiene dos patrones idénticos perfectamente sincronizados durante toda la pieza, cambiando solo las alturas',
          'El desfase usa técnica dodecafónica',
          'El desfase implica alterar el contenido de alturas',
        ],
        [
          'El proceso aditivo añade gradualmente notas a un patrón repetido, creando una melodía que se expande lentamente',
          'El proceso aditivo quita una nota al patrón en cada repetición, hasta que al final de la pieza ya solo queda el silencio',
          'El proceso aditivo cambia de tonalidad en cada repetición',
          'El proceso aditivo es lo mismo que tema y variaciones',
        ],
        [
          'La música aleatoria deja algunos elementos al azar o a la elección del intérprete',
          'La música aleatoria fija de antemano todas las notas y ritmos y no deja al intérprete ninguna elección',
          'La música aleatoria es siempre electrónica',
          'Aleatoria significa música muy rápida',
        ],
        [
          'Las técnicas expandidas incluyen multifónicos, piano preparado, col legno y armónicos',
          'Las técnicas expandidas son simplemente las formas habituales de tocar enseñadas en cualquier método de conservatorio',
          'Las técnicas expandidas se aplican solo a la percusión',
          'Las técnicas expandidas se inventaron en el periodo barroco',
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
          'Una polirritmia exige un compás compuesto',
        ],
        [
          'La polimetría opone dos compases, por ejemplo 3/4 en una parte contra 4/4 en otra',
          'La polimetría significa que la pieza pasa de 3/4 a 4/4 a la mitad, con todas las partes cambiando a la vez',
          'La polimetría usa solo un compás',
          'La polimetría es lo mismo que la síncopa',
        ],
        [
          'Una hemiola reagrupa seis pulsos de 2 × 3 en 3 × 2, por ejemplo dos compases de 3/4 sentidos como un compás de 3/2',
          'Una hemiola duplica el tempo durante un único compás, de modo que seis pulsos caben en el espacio de solo tres pulsos',
          'Una hemiola es un silencio de medio pulso',
          'Una hemiola solo existe en el jazz',
        ],
        [
          'Modulación métrica: si las corcheas de tresillo a ♩ = 120 pasan a ser las nuevas corcheas, la nueva ♩ = 180',
          'Modulación métrica: si las corcheas de tresillo a ♩ = 120 pasan a ser las nuevas corcheas, el tempo queda ♩ = 120, porque la modulación métrica nunca cambia la velocidad',
          'Modulación métrica significa cambiar de tonalidad',
          'La modulación métrica es un ritardando gradual',
        ],
        [
          'Un quintillo encaja cinco notas iguales en el tiempo que normalmente ocupan cuatro del mismo valor',
          'Un quintillo estira cuatro notas a lo largo de cinco pulsos, así que cada una dura más de lo que está escrito en la partitura',
          'Un quintillo solo puede escribirse en 5/4',
          'Un quintillo dura cinco compases',
        ],
      ],
    },
  ],

};

export default overlay;
