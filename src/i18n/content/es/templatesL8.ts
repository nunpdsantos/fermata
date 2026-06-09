import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish overlay for Level 8 exercise templates
// 11 modules, ~60 generated exercises
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
        'Analiza este elemento de una exposición de fuga.',
      hintTemplate:
        'Exposición de la fuga: el sujeto entra en la tónica, la respuesta entra en la dominante (real o tonal), las voces siguientes entran alternando T-D. Un contrasujeto acompaña cada nueva entrada.',
      choiceSets: [
        [
          'El sujeto entra primero en la tonalidad de la tónica y la respuesta entra en la dominante',
          'La respuesta entra en la subdominante',
          'Tanto el sujeto como la respuesta están en la tónica',
          'El sujeto entra primero en la dominante',
        ],
        [
          'Una respuesta tonal ajusta intervalos para evitar tonicizar la dominante en el punto de entrada',
          'Una respuesta tonal transpone el sujeto exactamente',
          'Una respuesta tonal está en un metro diferente',
          'Respuestas tonales y reales son conceptos idénticos',
        ],
        [
          'Una respuesta real transpone el sujeto exactamente a la dominante (una 5.ª J por encima o 4.ª J por debajo)',
          'Una respuesta real modifica algunos intervalos',
          'Una respuesta real usa inversión',
          'Una respuesta real está siempre en la tónica',
        ],
        [
          'El contrasujeto es una línea melódica recurrente que acompaña cada nueva entrada del sujeto',
          'El contrasujeto es lo mismo que el sujeto',
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
        'Identifica esta técnica de fuga.',
      hintTemplate:
        'Episodios: pasajes entre entradas del sujeto, frecuentemente usando secuencias basadas en fragmentos. Stretto: entradas solapadas del sujeto donde la respuesta comienza antes de que el sujeto termine.',
      choiceSets: [
        [
          'En el stretto, una nueva voz comienza el sujeto antes de que la voz anterior lo haya terminado',
          'Stretto significa tocar el sujeto lentamente',
          'Stretto es lo mismo que un episodio',
          'Stretto solo ocurre en la exposición',
        ],
        [
          'Los episodios modulan entre áreas tonales, frecuentemente usando secuencias derivadas del sujeto',
          'Los episodios presentan siempre el sujeto completo',
          'Los episodios nunca usan material del sujeto',
          'Los episodios deben permanecer en la tonalidad de la tónica',
        ],
        [
          'La aumentación presenta el sujeto en valores de nota más largos (duraciones duplicadas)',
          'Aumentación significa añadir más notas al sujeto',
          'La aumentación es lo mismo que la inversión',
          'La aumentación acorta los valores de nota',
        ],
        [
          'La disminución presenta el sujeto en valores de nota más cortos (duraciones reducidas a la mitad)',
          'Disminución significa eliminar notas del sujeto',
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
        'Identifica este tipo de canon.',
      hintTemplate:
        'Tipos de canon: estricto (imitación exacta), a la octava, a la 5.ª, en inversión (movimiento contrario), en retrogradación (canon cangrejo), canon doble (2 cánones independientes).',
      choiceSets: [
        [
          'Un canon en inversión (canon espejo) imita la melodía en movimiento contrario',
          'Un canon en inversión transpone la melodía',
          'Un canon en inversión invierte el ritmo',
          'Canon en inversión es lo mismo que aumentación',
        ],
        [
          'Un canon cangrejo (canon cancrizans) presenta la melodía en retrogradación',
          'Un canon cangrejo se toca de lado',
          'Un canon cangrejo usa inversión',
          'Un canon cangrejo no tiene relación con la melodía original',
        ],
        [
          'Un canon perpetuo (infinito) regresa al inicio sin interrupción',
          'Un canon perpetuo acelera gradualmente',
          'Un canon perpetuo añade nuevas voces indefinidamente',
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
        'Analiza este aspecto de la forma sonata en detalle.',
      hintTemplate:
        'Secciones de la forma sonata: Exposición (P-T-S-C), Desarrollo (fragmentación, secuencias, tonalidades remotas), Reexposición (todo en la tónica), Coda opcional.',
      choiceSets: [
        [
          'La transición en la exposición modula de la tónica al área tonal secundaria',
          'La transición permanece en la tónica a lo largo de toda la sección',
          'La transición introduce el segundo tema',
          'La transición se omite siempre',
        ],
        [
          'El desarrollo típicamente presenta fragmentación, secuencia y modulación por tonalidades remotas',
          'El desarrollo simplemente repite la exposición',
          'El desarrollo permanece en la tónica',
          'El desarrollo introduce temas enteramente nuevos',
        ],
        [
          'Una falsa reexposición comienza el regreso del tema en la tonalidad equivocada antes de la verdadera reexposición',
          'Una falsa reexposición omite el primer tema',
          'Una falsa reexposición está en la tónica',
          'Las falsas reexposiciones nunca ocurren en sonatas clásicas',
        ],
        [
          'En una sonata en tonalidad menor, el segundo tema está típicamente en el relativo mayor (III)',
          'En sonatas menores, el segundo tema permanece en la tónica',
          'Las sonatas menores usan la dominante para el segundo tema',
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
        'Identifica la estructura formal descrita.',
      hintTemplate:
        'Ritornello: pasaje orquestal recurrente alternando con episodios solistas (concierto barroco). Sonata-rondó: ABACAB\'A combina principios del rondó y de la sonata.',
      choiceSets: [
        [
          'La forma de ritornello alterna pasajes de tutti orquestal con episodios solistas',
          'El ritornello es lo mismo que el rondó',
          'El ritornello solo usa solistas',
          'El ritornello no tiene material recurrente',
        ],
        [
          'El sonata-rondó combina el tema A recurrente del rondó con las relaciones tonales de la forma sonata',
          'El sonata-rondó es simplemente un rondó',
          'El sonata-rondó no tiene tema recurrente',
          'El sonata-rondó se limita a la música vocal',
        ],
        [
          'Una passacaglia es un conjunto de variaciones sobre una línea de bajo recurrente (bajo ostinato)',
          'Una passacaglia no tiene elemento recurrente',
          'Una passacaglia es un tipo de rondó',
          'Una passacaglia es lo mismo que una fuga',
        ],
      ],
    },
  ],

  // ---- l8u26m3: Orquestación ----
  l8u26m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta cuestión sobre orquestación y familias de instrumentos.',
      hintTemplate:
        'Familias de la orquesta: cuerdas, maderas, metales, percusión. Cada instrumento tiene una extensión, timbre y función característicos en el conjunto.',
      choiceSets: [
        [
          'El orden estándar de la sección de cuerdas del más agudo al más grave es: violín I, violín II, viola, violonchelo, contrabajo',
          'Las violas son más agudas que los violines',
          'Los violonchelos son más agudos que las violas',
          'El contrabajo es más agudo que el violonchelo',
        ],
        [
          'Los instrumentos transpositores suenan a una altura diferente de la escrita: el clarinete en Bb suena una 2.ªM por debajo de lo escrito',
          'Todos los instrumentos orquestales son no transpositores',
          'El clarinete en Bb suena más agudo que lo escrito',
          'Solo los instrumentos de percusión transponen',
        ],
        [
          'La trompa en F suena una 5.ª justa por debajo de lo escrito',
          'La trompa en F suena una 5.ª justa por encima de lo escrito',
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
        'Responde a esta cuestión sobre la teoría de conjuntos de clases de altura.',
      hintTemplate:
        'Clases de altura: C=0 hasta B=11. Un conjunto de clases de altura lista CAs únicas en orden ascendente. La forma normal las coloca en la disposición más compacta.',
      choiceSets: [
        [
          'Un conjunto de clases de altura elimina equivalencia de octava y enarmónica, usando enteros de 0 a 11',
          'Los conjuntos de clases de altura usan nombres de notas y números de octava',
          'Los conjuntos de clases de altura solo funcionan para música tonal',
          'Los enteros de conjuntos de clases de altura van de 0 a 7',
        ],
        [
          'La forma normal dispone el conjunto en el orden ascendente más compacto',
          'La forma normal comienza siempre en C',
          'La forma normal usa orden descendente',
          'No existe ordenación estándar para conjuntos',
        ],
        [
          'El conjunto {C, E, G} = {0, 4, 7} es una tríada mayor expresada como clases de altura',
          '{0, 4, 7} representa una tríada menor',
          '{0, 4, 7} representa una tríada disminuida',
          'Las tríadas no pueden expresarse como conjuntos de clases de altura',
        ],
      ],
    },
  ],

  // ---- l8u27m2: Vectores Intervalares y Clases de Conjuntos ----
  l8u27m2: [
    {
      // multiple_choice
      promptTemplate:
        'Analiza vectores intervalares y propiedades de clases de conjuntos.',
      hintTemplate:
        'Vector intervalar: conteos de cada clase de intervalo (ci 1-6) en un conjunto, escrito como <x x x x x x>. Dos conjuntos son Z-relacionados cuando comparten el mismo vector intervalar pero NO están relacionados por transposición o inversión (pertenecen a clases de conjuntos diferentes).',
      choiceSets: [
        [
          'El vector intervalar cuenta ocurrencias de cada clase de intervalo (1 a 6) en un conjunto de clases de altura',
          'El vector intervalar cuenta solo intervalos perfectos',
          'El vector intervalar usa nombres de notas',
          'Los vectores intervalares son lo mismo que la forma normal',
        ],
        [
          'La forma primaria transpone y/o invierte un conjunto a su forma más compacta comenzando en 0',
          'La forma primaria es lo mismo que la forma normal',
          'La forma primaria solo transpone',
          'La forma primaria comienza siempre en la nota más aguda',
        ],
        [
          'Los conjuntos Z-relacionados comparten el mismo vector intervalar pero no son equivalentes por transposición/inversión',
          'Z-relacionados significa que son transposicionalmente equivalentes',
          'Los conjuntos Z-relacionados tienen vectores intervalares diferentes',
          'La relación-Z no existe en la teoría de conjuntos',
        ],
      ],
    },
  ],

  // ---- l8u27m3: Técnica de los Doce Tonos ----
  l8u27m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta cuestión sobre técnica dodecafónica (serial).',
      hintTemplate:
        'La serie usa las 12 clases de altura en un orden fijo. Transformaciones: P (original), I (inversión), R (retrógrada), RI (retrógrada-inversión). La matriz 12x12 organiza las 48 formas de la serie.',
      choiceSets: [
        [
          'Una serie dodecafónica usa cada una de las 12 clases de altura exactamente una vez antes de cualquier repetición',
          'Una serie puede repetir alturas libremente',
          'Una serie usa solo 7 alturas',
          'Una serie debe ser una escala',
        ],
        [
          'Las cuatro transformaciones básicas de la serie son Original, Inversión, Retrógrada y Retrógrada-Inversión',
          'Existen solo 2 transformaciones de la serie',
          'Las transformaciones de la serie incluyen aumentación y disminución',
          'Las series no pueden transformarse',
        ],
        [
          'La matriz 12x12 contiene las 48 formas posibles (12P + 12I + 12R + 12RI)',
          'La matriz tiene 24 formas de la serie',
          'La matriz tiene 144 formas de la serie',
          'Cada forma de la serie es exclusiva de una celda',
        ],
      ],
    },
  ],

  // ---- l8u27m4: Minimalismo y Posminimalismo ----
  l8u27m4: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica las características de esta técnica del siglo XX/XXI.',
      hintTemplate:
        'Minimalismo: patrones repetitivos, proceso gradual, material armónico limitado. Pioneros: Reich (desfase), Glass (proceso aditivo), Riley (bucles de cinta).',
      choiceSets: [
        [
          'El desfase desplaza gradualmente dos patrones idénticos fuera de sincronía, creando texturas en evolución',
          'El desfase mantiene los patrones perfectamente sincronizados',
          'El desfase usa técnica dodecafónica',
          'El desfase implica alterar el contenido de alturas',
        ],
        [
          'El proceso aditivo añade gradualmente notas a un patrón repetido, creando una melodía que se expande lentamente',
          'El proceso aditivo elimina notas de los patrones',
          'El proceso aditivo cambia de tonalidad en cada repetición',
          'El proceso aditivo es lo mismo que tema y variaciones',
        ],
      ],
    },
  ],

  // ---- l8u27m5: Espectralismo y Técnicas Extendidas ----
  l8u27m5: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica esta técnica composicional contemporánea.',
      hintTemplate:
        'Espectralismo: composición basada en las propiedades acústicas del sonido (serie de armónicos, análisis espectral). Técnicas extendidas: formas no convencionales de tocar instrumentos.',
      choiceSets: [
        [
          'La música espectral deriva la armonía de la serie de armónicos y del análisis acústico del sonido',
          'La música espectral usa armonía tonal tradicional',
          'La música espectral se basa en la técnica dodecafónica',
          'La música espectral evita todos los sonidos con altura definida',
        ],
        [
          'Las técnicas extendidas incluyen multifónicos, piano preparado, col legno y armónicos',
          'Las técnicas extendidas son ejecución orquestal estándar',
          'Las técnicas extendidas se aplican solo a la percusión',
          'Las técnicas extendidas se inventaron en el periodo barroco',
        ],
        [
          'La microtonalidad divide la octava en intervalos menores que un semitono',
          'La microtonalidad usa solo las 12 alturas estándar',
          'Microtonalidad significa tocar muy suavemente',
          'La microtonalidad es lo mismo que la atonalidad',
        ],
      ],
    },
  ],
};

export default overlay;
