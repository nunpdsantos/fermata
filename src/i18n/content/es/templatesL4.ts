import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Castilian Spanish overlay for Level 4 exercise templates
// 11 module configs (Unit 14 counterpoint pooled onto l4u14m1, mirroring
// the EN source). Entry order per module must match templatesL4.ts.
// ---------------------------------------------------------------------------

const overlay: TemplateLevelOverlay = {
  // =========================================================================
  // Unidad 12: Notas Extrañas al Acorde y Séptima de Dominante
  // =========================================================================

  // ---- l4u12m1: Retardos ----
  l4u12m1: [
    {
      // multiple_choice
      promptTemplate:
        'Analiza esta figura de retardo y su resolución.',
      hintTemplate:
        'Retardos: 4-3 resuelve a una 3.ª, 7-6 a una 6.ª, 9-8 a una octava. El retardo de bajo 2-3 resuelve hacia abajo (el bajo desciende por grado conjunto; el intervalo sobre el bajo crece de una 2.ª a una 3.ª). Las cadenas de retardos crean secuencias.',
      choiceSets: [
        [
          'Una cadena de retardos 7-6 crea un movimiento descendente por grado conjunto en la voz superior',
          'Una cadena de retardos es siempre ascendente',
          'Las cadenas de retardos están prohibidas en el estilo clásico',
          'Una cadena de retardos no requiere preparación',
        ],
        [
          'Un retardo ornamentado añade una nota de paso o bordadura entre el retardo y la resolución',
          'Un retardo ornamentado salta la resolución por completo',
          'Un retardo ornamentado es siempre cromático',
          'Un retardo ornamentado resuelve hacia arriba',
        ],
        [
          'El retardo debe prepararse como consonancia y mantenerse como disonancia',
          'Los retardos pueden aparecer sin preparación en todos los estilos',
          'El retardo es siempre consonante',
          'Los retardos solo pueden ocurrir en el soprano',
        ],
      ],
    },
  ],

  // ---- l4u12m2: Apoyatura / Escapatoria ----
  l4u12m2: [
    {
      // multiple_choice
      promptTemplate:
        'Distingue entre estos tipos de notas extrañas al acorde según la aproximación y la salida.',
      hintTemplate:
        'Apoyatura: salto hacia la disonancia, grado conjunto hacia la resolución. Escapatoria: grado conjunto hacia la disonancia, salto hacia fuera. Ambas son típicamente acentuadas.',
      choiceSets: [
        [
          'Una disonancia acentuada abordada por salto y resuelta por grado conjunto = apoyatura',
          'Es una escapatoria',
          'Es una nota de paso',
          'Es un retardo',
        ],
        [
          'Una escapatoria se aborda por grado conjunto y se abandona por salto en la dirección opuesta',
          'Una escapatoria se aborda por salto y se abandona por grado conjunto',
          'Una escapatoria es lo mismo que una anticipación',
          'Una escapatoria debe resolver a la misma nota de la que partió',
        ],
        [
          'Una apoyatura sin preparación es una marca de la expresión de la era Romántica',
          'Las apoyaturas están prohibidas en la música Romántica',
          'Las apoyaturas deben prepararse siempre como los retardos',
          'Las apoyaturas ocurren solo en la voz del bajo',
        ],
      ],
    },
  ],

  // ---- l4u12m3: Pedal ----
  l4u12m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta pregunta sobre pedales y su función armónica.',
      hintTemplate:
        'Los pedales son notas sostenidas o repetidas (típicamente tónica o dominante en el bajo) que crean disonancias con las armonías cambiantes por encima.',
      choiceSets: [
        [
          'Un pedal doble sostiene simultáneamente la tónica y la dominante',
          'Un pedal doble usa dos tonalidades diferentes',
          'Un pedal doble resuelve siempre a una sola nota',
          'Un pedal doble es lo mismo que un bordón',
        ],
        [
          'Un pedal invertido ocurre en una voz superior en lugar del bajo',
          'Un pedal invertido desciende en lugar de sostenerse',
          'Un pedal invertido cambia de altura en cada compás',
          'Los pedales invertidos nunca se encuentran en la música clásica',
        ],
        [
          'Un pedal típicamente comienza y termina como consonancia con disonancia en medio',
          'Un pedal es siempre disonante a lo largo de toda su duración',
          'Un pedal nunca crea disonancia',
          'Un pedal debe durar exactamente 4 compases',
        ],
      ],
    },
  ],

  // ---- l4u12m4: Reglas de Resolución del V7 ----
  l4u12m4: [
    {
      // chord_build
      promptTemplate:
        'Construye el acorde V7 (séptima de dominante) en la tonalidad de {root} mayor.',
      hintTemplate:
        'El V7 se construye sobre el 5.º grado de {root} mayor. Es un acorde de séptima de dominante: tríada mayor + 7.ª menor. La 7.ª resuelve hacia abajo, la sensible resuelve hacia arriba.',
    },
    {
      // multiple_choice
      promptTemplate: '¿Cómo resuelve el acorde V7 a I?',
      hintTemplate:
        'En la resolución V7 a I: la sensible resuelve hacia arriba hasta la tónica, la 7.ª resuelve por grado conjunto descendente, la 5.ª de V puede ir a la fundamental de I, la fundamental de V puede ir a la fundamental de I.',
      choiceSets: [
        [
          'El tritono en V7 (entre la 3.ª y la 7.ª) resuelve por movimiento contrario: 3.ª hacia arriba, 7.ª hacia abajo',
          'El tritono resuelve por movimiento paralelo',
          'El tritono no resuelve',
          'Ambas notas del tritono resuelven hacia abajo',
        ],
        [
          'En una resolución V7-I, el acorde I a menudo queda sin la 5.ª para permitir una conducción de voces correcta',
          'El acorde I debe ser siempre completo tras V7',
          'V7-I produce siempre quintas paralelas',
          'La fundamental de V7 debe resolver a la 3.ª de I',
        ],
      ],
    },
  ],

  // ---- l4u12m5: Inversiones de V7 ----
  l4u12m5: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica la inversión de este acorde V7 según la nota del acorde que está en el bajo.',
      hintTemplate:
        'Inversiones de V7: estado fundamental (V7), 1.ª inv = V6/5 (3.ª/sensible en el bajo), 2.ª inv = V4/3 (5.ª en el bajo), 3.ª inv = V4/2 (7.ª en el bajo).',
      choiceSets: [
        [
          'V6/5 tiene la sensible en el bajo, creando una fuerte resolución ascendente hacia I',
          'V6/5 tiene la 5.ª en el bajo',
          'V6/5 tiene la 7.ª en el bajo',
          'V6/5 tiene la fundamental en el bajo',
        ],
        [
          'V4/2 tiene la 7.ª en el bajo y resuelve típicamente a I6',
          'V4/2 tiene la fundamental en el bajo',
          'V4/2 tiene la 3.ª en el bajo',
          'V4/2 resuelve a V en estado fundamental',
        ],
        [
          'V4/3 tiene la 5.ª en el bajo y puede resolver a I o I6',
          'V4/3 tiene la sensible en el bajo',
          'V4/3 tiene la 7.ª en el bajo',
          'V4/3 tiene la fundamental en el bajo',
        ],
      ],
    },
    {
      // chord_build
      promptTemplate:
        'Construye el acorde de séptima de dominante sobre {root}. Este acorde quiere resolver a una tonalidad una 5.ª por debajo.',
      hintTemplate:
        'Una séptima de dominante sobre {root}: {root} + 3.ª mayor + 5.ª justa + 7.ª menor. Este acorde resuelve una 5.ª abajo (o una 4.ª arriba) hacia su tónica.',
    },
  ],

  // =========================================================================
  // Unidad 13: Función Armónica y Secuencias
  // =========================================================================

  // ---- l4u13m1: Séptimas Predominantes ----
  l4u13m1: [
    {
      // chord_build
      promptTemplate:
        'Construye el acorde ii7 en {root} mayor. Este acorde de séptima predominante conduce a V.',
      hintTemplate:
        'El ii7 en mayor es un acorde de séptima menor construido sobre el 2.º grado de {root} mayor. Funciona como predominante, conduciendo a V o V7.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cómo funciona la función predominante en las progresiones armónicas?',
      hintTemplate:
        'Los acordes predominantes (ii, IV, ii7, IV7) preparan la dominante. Típicamente se mueven T → PD → D → T (tónica → predominante → dominante → tónica).',
      choiceSets: [
        [
          'La progresión armónica estándar es T → PD → D → T',
          'Los predominantes vienen siempre después de la dominante',
          'Los predominantes resuelven directamente a la tónica',
          'Solo acordes mayores pueden funcionar como predominantes',
        ],
        [
          'IV y ii (o sus formas de séptima) son los acordes predominantes principales',
          'Solo el acorde V funciona como predominante',
          'iii es el acorde predominante principal',
          'vi es el único acorde predominante',
        ],
      ],
    },
  ],

  // ---- l4u13m2: Categorías de Función Armónica ----
  l4u13m2: [
    {
      // multiple_choice
      promptTemplate:
        'Clasifica este acorde por su función armónica: tónica, predominante o dominante.',
      hintTemplate:
        'Función tónica: I, vi, iii. Predominante: IV, ii. Dominante: V, viiº. Estas categorías describen cómo funcionan los acordes en las progresiones, no solo su cualidad.',
      choiceSets: [
        [
          'vi puede sustituir a I como acorde de función tónica',
          'vi es un acorde de función dominante',
          'vi es siempre un acorde predominante',
          'vi no tiene función estándar',
        ],
        [
          'viiº funciona como dominante porque comparte 3 notas con V7',
          'viiº funciona como acorde de tónica',
          'viiº funciona como acorde predominante',
          'viiº no tiene función armónica',
        ],
        [
          'iii puede funcionar como tónica (compartiendo 2 notas con I) o como preparación de la dominante',
          'iii es siempre un acorde dominante',
          'iii es siempre un acorde predominante',
          'iii nunca se usa en la armonía de práctica común',
        ],
        [
          'En la cadencia rota V-vi, vi sustituye a I como acorde de función tónica',
          'En V-vi, vi actúa como acorde dominante',
          'V-vi no es una cadencia real',
          'vi rechaza siempre la función tónica',
        ],
      ],
    },
  ],

  // ---- l4u13m3: Ritmo Armónico ----
  l4u13m3: [
    {
      // multiple_choice
      promptTemplate:
        'Responde a esta pregunta sobre ritmo armónico.',
      hintTemplate:
        'El ritmo armónico es la velocidad a la que los acordes cambian. Puede acelerarse cerca de las cadencias, creando una sensación de movimiento hacia adelante y de llegada.',
      choiceSets: [
        [
          'El ritmo armónico típicamente se acelera al aproximarse a una cadencia',
          'El ritmo armónico se mantiene siempre constante',
          'El ritmo armónico se desacelera siempre en las cadencias',
          'El ritmo armónico solo cambia entre secciones',
        ],
        [
          'Un ritmo armónico más rápido crea una mayor sensación de impulso',
          'Un ritmo armónico más rápido crea un ambiente más tranquilo',
          'El ritmo armónico no afecta la energía musical',
          'Un ritmo armónico más lento indica siempre el clímax',
        ],
        [
          'Los acordes cambian típicamente en tiempos fuertes en la música de práctica común',
          'Los cambios de acorde ocurren solo en el tiempo 1',
          'Los acordes nunca pueden cambiar a mitad de un compás',
          'El ritmo armónico es siempre un acorde por compás',
        ],
      ],
    },
  ],

  // ---- l4u13m4: Secuencias ----
  l4u13m4: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica este tipo de secuencia armónica.',
      hintTemplate:
        'Una secuencia repite un patrón melódico/armónico en niveles de altura sucesivamente más altos o más bajos. Tipos comunes: quintas descendentes, 5-6 ascendente, terceras descendentes.',
      choiceSets: [
        [
          'Una secuencia de quintas descendentes se mueve por el ciclo de quintas: I-IV-viiº-iii-vi-ii-V-I',
          'Una secuencia de quintas descendentes se mueve hacia arriba por 5.as',
          'Una secuencia de quintas descendentes usa solo acordes mayores',
          'Una secuencia de quintas descendentes modula siempre',
        ],
        [
          'Una secuencia 5-6 ascendente usa acordes alternados de 5/3 y 6/3 en movimiento ascendente por grado conjunto',
          'Una secuencia 5-6 ascendente usa solo tríadas en estado fundamental',
          'Una secuencia 5-6 ascendente desciende siempre',
          'Una secuencia 5-6 ascendente no es un tipo real de secuencia',
        ],
        [
          'Las secuencias pueden suspender temporalmente las reglas normales de conducción de voces (las quintas paralelas pueden ser aceptables)',
          'Las secuencias deben seguir siempre reglas estrictas de conducción de voces',
          'Las quintas paralelas nunca son aceptables en secuencias',
          'Las secuencias no tienen relación con la conducción de voces',
        ],
      ],
    },
  ],

  // ---- l4u13m5: Progresiones Comunes ----
  l4u13m5: [
    {
      // multiple_choice
      promptTemplate:
        'Identifica el patrón de progresión armónica descrito.',
      hintTemplate:
        'Progresiones comunes: I-V-vi-IV, I-IV-V-I, ii-V-I, I-vi-IV-V. Cada una tiene un sonido característico y una lógica funcional.',
      choiceSets: [
        [
          'I-IV-V-I sigue el patrón funcional estándar T-PD-D-T',
          'I-IV-V-I no es una progresión estándar',
          'I-IV-V-I viola las reglas de la armonía funcional',
          'I-IV-V-I se usa solo en el jazz',
        ],
        [
          'La «progresión de los años 50» I-vi-IV-V usa las tres funciones armónicas',
          'I-vi-IV-V es una invención moderna',
          'I-vi-IV-V no sigue la armonía funcional',
          'I-vi-IV-V suena siempre triste',
        ],
        [
          'El movimiento de bajo por grado conjunto (como I-V6-vi o I6-ii6-V) crea una conducción de voces suave',
          'El movimiento de bajo por grado conjunto está prohibido en la armonía clásica',
          'Las primeras inversiones nunca se usan para crear líneas de bajo por grado conjunto',
          'Las líneas de bajo deben saltar siempre por 4.as y 5.as',
        ],
      ],
    },
    {
      // chord_build
      promptTemplate:
        'Construye el acorde IV en {root} mayor. Este es un acorde predominante principal.',
      hintTemplate:
        'El acorde IV es una tríada mayor construida sobre el 4.º grado de {root} mayor. Tiene un carácter cálido y subdominante.',
    },
  ],

  // =========================================================================
  // Unidad 14: Contrapunto, Métrica, Análisis y Armonía Menor
  // =========================================================================
  //
  // NOTA (corrección WS5 A2): en EN, todas las plantillas de contrapunto se
  // agruparon en l4u14m1 (el único módulo de contrapunto de especies). El orden
  // de las entradas debe coincidir con el orden de las plantillas en EN
  // (templatesL4.ts): [1.ª especie, 2.ª especie, identificación de intervalo].
  // Los módulos m2–m5 ya no tienen plantillas generadas.

  // ---- l4u14m1: Contrapunto de Primera y Segunda Especie ----
  l4u14m1: [
    {
      // multiple_choice — primera especie
      promptTemplate:
        'Responde a esta pregunta sobre contrapunto de primera especie.',
      hintTemplate:
        'Primera especie: nota contra nota. Usa consonancias (3.as, 6.as, intervalos justos). Comienza y termina en consonancias perfectas. Evita 5.as/8.as paralelas. Prefiere movimiento contrario.',
      choiceSets: [
        [
          'La primera especie usa una nota en el contrapunto por cada nota en el cantus firmus',
          'La primera especie usa dos notas contra una',
          'La primera especie usa cuatro notas contra una',
          'La primera especie no tiene restricciones rítmicas',
        ],
        [
          'En la primera especie, todos los intervalos verticales deben ser consonantes',
          'Las disonancias se permiten libremente en la primera especie',
          'Solo los intervalos justos están permitidos',
          'Solo los intervalos imperfectos están permitidos',
        ],
        [
          'Aproximarse a una consonancia perfecta por movimiento contrario es la estrategia más segura',
          'Las consonancias perfectas deben abordarse por movimiento paralelo',
          'La aproximación a las consonancias perfectas no importa',
          'Las consonancias perfectas solo pueden alcanzarse por movimiento oblicuo',
        ],
      ],
    },
    {
      // multiple_choice — segunda especie
      promptTemplate:
        'Responde a esta pregunta sobre contrapunto de segunda especie.',
      hintTemplate:
        'Segunda especie: dos notas contra una. La primera nota de cada compás debe ser consonante. La segunda nota puede ser una consonancia o una nota de paso (disonancia).',
      choiceSets: [
        [
          'En la segunda especie, las disonancias se permiten como notas de paso en tiempos débiles',
          'Todas las notas deben ser consonantes en la segunda especie',
          'Las disonancias pueden aparecer en tiempos fuertes en la segunda especie',
          'La segunda especie no tiene reglas sobre disonancia',
        ],
        [
          'La segunda especie introduce el concepto de tratamiento de la disonancia a través de notas de paso',
          'La segunda especie introduce los retardos',
          'La segunda especie introduce las apoyaturas',
          'La segunda especie no tiene conceptos nuevos respecto a la primera',
        ],
      ],
    },
    {
      // interval_id
      promptTemplate:
        '¿Cuál es el intervalo formado entre las dos voces? Partiendo de {root}.',
      hintTemplate:
        'En el contrapunto de especies, las consonancias son 3.as, 6.as e intervalos justos (P1, P5, P8). Las disonancias (2.as, 7.as, tritono) requieren tratamiento especial.',
    },
  ],
};

export default overlay;
