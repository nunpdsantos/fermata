import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Spanish (ES) overlay for Level 4 exercise templates
// 11 module configs (Unit 14 counterpoint pooled onto l4u14m1, mirroring
// the EN source). Entry order per module must match templatesL4.ts — see the
// W4-01 note there. Terms follow the L4 lessons: retardo (suspension),
// retardo ascendente (retardation), apoyatura, escapatoria, nota pedal,
// notas cambiadas.
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
        '¿Cuál de estas afirmaciones sobre los retardos es verdadera?',
      hintTemplate:
        'Retardos: 4-3 resuelve a una 3.ª, 7-6 a una 6.ª, 9-8 a una octava. El retardo de bajo 2-3 resuelve hacia abajo (el bajo desciende por grado conjunto; el intervalo sobre el bajo crece de una 2.ª a una 3.ª). Las cadenas de retardos crean secuencias. Un retardo se prepara como consonancia y se mantiene como disonancia; la ornamentación puede insertar una nota antes de su resolución descendente por grado conjunto.',
      choiceSets: [
        [
          'En un retardo 4-3, la 4.ª sobre el bajo resuelve bajando a la 3.ª',
          'En un retardo 4-3, la 3.ª sobre el bajo sube a la 4.ª',
          'En un retardo 4-3, la 4.ª sobre el bajo resuelve subiendo a la 5.ª',
          'En un retardo 4-3, el bajo baja del 4.º al 3.er grado',
        ],
        [
      "En un retardo 7-6, la 7.ª resuelve bajando a la 6.ª",
      'En un retardo 7-6, la 6.ª resuelve subiendo a la 7.ª',
      'En un retardo 7-6, la 7.ª resuelve subiendo a la octava',
      'En un retardo 7-6, la 6.ª resuelve bajando a la 5.ª',
    ],
        [
      "En un retardo 9-8, la 9.ª sobre el bajo resuelve bajando a la octava",
      'En un retardo 9-8, la octava sobre el bajo resuelve subiendo a la 9.ª',
      'En un retardo 9-8, la 9.ª sobre el bajo resuelve subiendo a la 10.ª',
      'En un retardo 9-8, la octava sobre el bajo resuelve bajando a la 7.ª',
    ],
        [
          'En un retardo de bajo 2-3, el bajo baja por grado y la 2.ª pasa a ser una 3.ª',
          'En un retardo de bajo 2-3, la voz superior resuelve bajando a una 3.ª',
          'En un retardo de bajo 2-3, el bajo sube por grado y la 2.ª pasa a ser una 3.ª',
          'En un retardo de bajo 2-3, el bajo salta y la disonancia queda sin resolver',
        ],
        [
          'Un retardo se prepara como consonancia y luego se mantiene en una disonancia',
          'Un retardo aparece sin preparación, en el tiempo fuerte',
          'Un retardo se prepara como disonancia y resuelve subiendo',
          'Un retardo es lo mismo que una anticipación',
        ],
        [
          'Una cadena de retardos 7-6 hace que la voz superior baje por grado',
          'Una cadena de retardos 7-6 hace que la voz superior suba por grado',
          'Una cadena de retardos 7-6 está prohibida en el estilo de la práctica común',
          'Una cadena de retardos 7-6 mantiene el bajo en una sola nota',
        ],
        [
      'En un retardo ornamentado, una nota adicional aplaza el paso descendente hasta la nota de resolución',
      'En un retardo ornamentado, una nota adicional sustituye la resolución descendente por grado conjunto por un salto',
      'En un retardo ornamentado, una nota adicional convierte la resolución descendente en ascendente por grado conjunto',
      'En un retardo ornamentado, una nota adicional elimina la necesidad de resolver la disonancia',
    ],
      ],
    },
  ],

  // ---- l4u12m2: Apoyatura, Escapatoria y Retardo Ascendente ----
  l4u12m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre apoyaturas, escapatorias y retardos ascendentes es verdadera?',
      hintTemplate:
        'Apoyatura: salto hacia la disonancia, grado conjunto hacia la resolución — normalmente acentuada (en un tiempo fuerte). Escapatoria: grado conjunto hacia la disonancia, salto hacia fuera — normalmente no acentuada (en un tiempo débil). Retardo ascendente: retenido como un retardo, resuelve subiendo por grado (7-8).',
      choiceSets: [
        [
          'Una apoyatura se aborda por salto y se resuelve por grado, normalmente en un tiempo fuerte',
          'Una apoyatura se aborda por grado y se abandona por salto, normalmente en un tiempo débil',
          'Una apoyatura se mantiene del acorde anterior y luego se resuelve por grado',
          'Una apoyatura se aborda y se abandona por grado en la misma dirección, siempre en un tiempo débil',
        ],
        [
          'Una escapatoria se aborda por grado y se abandona por salto en la dirección opuesta',
          'Una escapatoria se aborda por salto y se abandona por grado en la dirección opuesta',
          'Una escapatoria es lo mismo que una anticipación del acorde siguiente',
          'Una escapatoria debe volver a la nota de la que salió, igual que una bordadura',
        ],
        [
      'Un retardo ascendente se prepara y se mantiene como disonancia, luego resuelve subiendo por grado',
      'Un retardo ascendente se prepara y se mantiene como disonancia, luego resuelve subiendo por salto',
      'Un retardo ascendente se alcanza por salto sin preparación, luego resuelve subiendo por grado',
      'Un retardo ascendente se alcanza por salto sin preparación, luego resuelve subiendo por salto',
    ],
        [
          'B retenido en un acorde de C mayor y que sube a C: un retardo ascendente 7-8',
          'B retenido en un acorde de C mayor y que sube a C: un retardo 4-3',
          'B retenido en un acorde de C mayor y que sube a C: una escapatoria',
          'B retenido en un acorde de C mayor y que sube a C: una apoyatura abordada por salto',
        ],
        [
      'Una apoyatura suele ser una disonancia acentuada, alcanzada por salto y dejada por grado conjunto',
      'Una apoyatura suele ser una disonancia sin acentuar, alcanzada por salto y dejada por grado conjunto',
      'Una apoyatura suele ser una disonancia acentuada, alcanzada por grado conjunto y dejada por salto',
      'Una apoyatura suele ser una disonancia sin acentuar, alcanzada por grado conjunto y dejada por salto',
    ],
      ],
    },
  ],

  // ---- l4u12m3: Nota Pedal y Notas Cambiadas ----
  l4u12m3: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las notas pedal y las notas cambiadas es verdadera?',
      hintTemplate:
        'Los pedales son notas sostenidas o repetidas (típicamente tónica o dominante en el bajo) que crean disonancias con las armonías cambiantes por encima. Las notas cambiadas adornan una nota por encima y por debajo antes de volver a ella. Un pedal invertido está en la voz más aguda (soprano); un pedal doble mantiene dos alturas, a menudo la tónica y la dominante.',
      choiceSets: [
        [
          'Un pedal de tónica mantiene el grado 1 mientras cambian los acordes',
          'Un pedal de tónica mantiene el grado 1 solo en la soprano mientras cambian los acordes',
          'Un pedal de tónica sigue cada fundamental mientras cambian los acordes',
          'Un pedal de tónica arpegia cada nuevo acorde mientras cambian los acordes',
        ],
        [
          'Un pedal de dominante mantiene el 5.º grado y crea tensión antes de que vuelva la tónica',
          'Un pedal de dominante mantiene la sensible, el 7.º grado',
          'Un pedal de dominante está siempre en el soprano, con el bajo libre por debajo',
          'Un pedal de dominante mantiene el 5.º grado y solo puede aparecer al principio mismo de una pieza',
        ],
        [
      "Un pedal doble mantiene dos alturas simultáneamente, habitualmente la tónica y la dominante",
      'Un pedal doble suele repetir una altura dos veces, habitualmente la tónica o la dominante',
      'Un pedal doble puede colocar un pedal de tónica antes de un pedal de dominante, sin superposición',
      'Un pedal doble suele mover ambas alturas con cada nuevo acorde de tónica o dominante en vez de mantenerlas',
    ],
        [
      'Un pedal invertido sostiene una nota en la voz superior',
      'Un pedal invertido sostiene una nota en el bajo, por debajo de acordes invertidos',
      'Un pedal invertido sostiene una nota en la voz del bajo',
      'Un pedal invertido sostiene todas las notas del acorde actual',
    ],
        [
          'Un pedal suele empezar y terminar consonante, con disonancias en medio',
          "Un pedal normalmente empieza y termina disonante, con consonancia entre ambos extremos",
          "Un pedal suele cambiar de altura para seguir las fundamentales de los acordes sucesivos",
          "Un pedal típicamente se mueve por grado conjunto entre las notas de un acorde",
        ],
        [
      'Notas cambiadas: la melodía visita las dos alturas adyacentes y regresa a la nota inicial del acorde',
      'Notas cambiadas: la melodía visita dos notas intermedias y continúa hasta otra nota del acorde',
      'Notas cambiadas: la melodía visita una nota adyacente y vuelve a la nota inicial del acorde',
      'Notas cambiadas: la melodía repite la nota inicial del acorde mientras cambian los acordes de alrededor',
    ],
      ],
    },
  ],

  // ---- l4u12m4: Reglas de Resolución del V7 ----
  l4u12m4: [
    {
      // chord_build — {root} es la fundamental del acorde, no la tonalidad:
      // la respuesta evaluada es una séptima de dominante SOBRE {root}. Refleja el EN.
      promptTemplate:
        'Construye un acorde de séptima de dominante de {root}.',
      hintTemplate:
        'Un acorde de séptima de dominante: tríada mayor + 7.ª menor. La 7.ª resuelve hacia abajo, la sensible resuelve hacia arriba.',
    },
    {
      // multiple_choice
      promptTemplate: '¿Cómo resuelve el acorde V7 a I?',
      hintTemplate:
        'En la resolución V7 a I: la sensible resuelve hacia arriba hasta la tónica, la 7.ª resuelve por grado conjunto descendente, la 5.ª de V puede ir a la fundamental de I, la fundamental de V puede ir a la fundamental de I.',
      choiceSets: [
        [
          'Su tritono resuelve en movimiento contrario: la 3.ª sube, la 7.ª baja',
          'Su tritono resuelve en movimiento paralelo: la 3.ª sube, la 7.ª sube',
          'Su tritono resuelve en movimiento paralelo: la 3.ª baja, la 7.ª baja',
          'Su tritono resuelve en movimiento contrario: la 3.ª baja, la 7.ª sube',
        ],
        [
          'En V7–I, el acorde I suele omitir la 5.ª para que las voces resuelvan bien',
          "En V7–I, el acorde I suele omitir la 3.ª para que la sensible baje a la 5.ª",
          "En V7–I, quintas paralelas entre voces extremas pueden sustituir la resolución contraria del tritono en escritura estricta",
          "En V7–I, la fundamental de V7 normalmente sube por grado conjunto para convertirse en la 3.ª de I",
        ],
      ],
    },
  ],

  // ---- l4u12m5: Inversiones de V7 ----
  l4u12m5: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las inversiones de V7 es verdadera?',
      hintTemplate:
        'Inversiones de V7: estado fundamental (V7), 1.ª inv = V6/5 (3.ª/sensible en el bajo), 2.ª inv = V4/3 (5.ª en el bajo), 3.ª inv = V4/2 (7.ª en el bajo).',
      nudgeTemplate: 'Los números son intervalos por encima del bajo. En C mayor, pon la 3.ª, la 5.ª y la 7.ª de G7 en el bajo, una por una: ¿qué números da cada una, y qué nota del acorde de tónica puede alcanzar ese bajo por grado conjunto?',
      choiceSets: [
        [
          'V6/5 tiene la sensible en el bajo, que sube por grado a la tónica',
          'V6/5 tiene la 5.ª del acorde en el bajo, que baja por grado',
          'V6/5 tiene la 7.ª del acorde en el bajo, que baja a la 3.ª de I',
          'V6/5 tiene la fundamental en el bajo, que baja una 5.ª a la tónica',
        ],
        [
          'V4/2 tiene la 7.ª en el bajo, así que resuelve a I6',
          'V4/2 tiene la fundamental en el bajo, así que resuelve a I',
          'V4/2 tiene la 3.ª en el bajo, así que resuelve a I6/4',
          'V4/2 tiene la 5.ª en el bajo, así que resuelve al acorde de V',
        ],
        [
      'Con la quinta en el bajo, V4/3 puede resolver en una tríada de tónica en estado fundamental o primera inversión',
      'Con la tercera en el bajo, V4/3 puede resolver en una tríada de tónica en estado fundamental o primera inversión',
      'Con la séptima en el bajo, V4/3 puede resolver en una tríada de tónica en estado fundamental o primera inversión',
      'Con la fundamental en el bajo, V4/3 puede resolver en una tríada de tónica en estado fundamental o primera inversión',
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
  // Unidad 13: Acordes de Séptima Diatónicos y Función Armónica
  // =========================================================================

  // ---- l4u13m1: Séptimas Predominantes ----
  l4u13m1: [
    {
      // chord_build — {root} es la fundamental del acorde, no la tonalidad:
      // la respuesta evaluada es una séptima menor SOBRE {root}. Refleja el EN.
      promptTemplate:
        'Construye un acorde de séptima menor de {root}.',
      hintTemplate:
        'Un acorde de séptima menor: tríada menor + 7.ª menor. Construido sobre el 2.º grado (ii7), es el predominante clásico, conduciendo a V o V7.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cómo funciona la función predominante en las progresiones armónicas?',
      hintTemplate:
        'Los acordes predominantes (ii, IV, ii7, IV7) preparan la dominante. Típicamente se mueven T → PD → D → T (tónica → predominante → dominante → tónica).',
      choiceSets: [
        [
      'La progresión estándar es T → PD → D → T',
      'La progresión estándar es T → PD → D → PD',
      'La progresión estándar es PD → D → PD → T',
      'La progresión estándar es T → D → T → PD',
    ],
        [
          'IV y ii (y IV7, ii7) son los principales acordes predominantes',
          'V y vii° (y V7, vii°7) son los principales acordes predominantes',
          'I y vi (y Imaj7, vi7) son los principales acordes predominantes',
          'iii y vi (y iii7, vi7) son los principales acordes predominantes',
        ],
      ],
    },
  ],

  // ---- l4u13m2: Séptimas de Mediante, Submediante y Tónica ----
  l4u13m2: [
    {
      // chord_build — {root} es el 6.º grado de {key} mayor
      promptTemplate:
        'Construye el acorde vi7 de {key} mayor.',
      hintTemplate:
        'vi7 es el acorde de séptima menor sobre el 6.º grado de {key} mayor: {root}, y luego una 3.ª menor, una 5.ª justa y una 7.ª menor por encima.',
    },
    {
      // chord_build — {root} es el 3.er grado de {key} mayor
      promptTemplate:
        'Construye el acorde iii7 de {key} mayor.',
      hintTemplate:
        'iii7 es el acorde de séptima menor sobre el 3.er grado de {key} mayor: {root}, y luego una 3.ª menor, una 5.ª justa y una 7.ª menor por encima.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre iii7, vi7 y las séptimas de tónica es verdadera?',
      hintTemplate:
        'vi7 (y a veces iii7) comparten notas con el I y pueden sustituirlo. Imaj7 es la tónica del jazz y del pop; I7 es la tónica del blues. iii7–vi7–ii7–V7–I es una cadena de quintas descendentes. En V7–vi7 (G7–Am7 en C), la fundamental G puede mantenerse y se convierte en la 7.ª de vi7: una resolución rota.',
      choiceSets: [
        [
          'vi7 es el principal sustituto del I con función de tónica',
          'vi7 es un acorde con función de dominante que resuelve a I',
          'vi7 es un acorde predominante que solo aparece antes del V',
          'vi7 no tiene una función armónica propia',
        ],
        [
          'V7–vi7 es una resolución rota en la que la fundamental de V7 se mantiene como 7.ª de vi7',
          'V7–vi7 es una resolución auténtica en la que la fundamental de V7 se mantiene como fundamental de vi7',
          'V7–vi7 es una resolución rota en la que la fundamental de V7 se mantiene como fundamental de vi7',
          'V7–vi7 es una resolución auténtica en la que la fundamental de V7 se mantiene como 7.ª de vi7',
        ],
        [
          'En el jazz y el pop, Imaj7 es la tónica habitual, un punto de reposo',
          'En el jazz y el pop, Imaj7 es un acorde tenso que debe resolver a IV',
          'En el jazz y el pop, Imaj7 se evita al final de un ii–V–I',
          'En el jazz y el pop, la tónica es siempre una tríada simple, nunca una séptima',
        ],
        [
          'En el blues, I7 (una séptima de dominante) es la tónica estable',
          'En el blues, I7 se evita porque las séptimas de dominante deben resolver',
          'En el blues, solo el V es una séptima de dominante, como en la armonía clásica',
          'En el blues, el acorde de tónica es una séptima mayor, Imaj7',
        ],
        [
          'iii7 suele iniciar una cadena de quintas descendentes: iii7–vi7–ii7–V7–I',
          'iii7 es la dominante de la tonalidad y por eso resuelve normalmente directo a I',
          'iii7 se construye sobre el 6.º grado de la escala mayor',
          'iii7 es un acorde de séptima mayor en una tonalidad mayor',
        ],
      ],
    },
  ],

  // ---- l4u13m3: Séptimas de Sensible ----
  l4u13m3: [
    {
      // chord_build — {root} es la sensible de {key} mayor
      promptTemplate:
        'Construye viiø7, el acorde de séptima de sensible de {key} mayor.',
      hintTemplate:
        'viiø7 se apoya en la sensible de {key} mayor ({root}): una séptima semidisminuida — 3.ª menor, 5.ª disminuida y 7.ª menor sobre {root}.',
    },
    {
      // chord_build — {root} es el 7.º grado elevado de {key} menor armónica
      promptTemplate:
        'Construye vii°7, el acorde de séptima de sensible de {key} menor (menor armónica).',
      hintTemplate:
        'vii°7 se apoya en el 7.º grado elevado de {key} menor armónica ({root}): una séptima disminuida — tres 3.as menores superpuestas sobre {root}.',
    },
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre los acordes de séptima de sensible es verdadera?',
      hintTemplate:
        'viiø7 (tonalidades mayores) es semidisminuido: en C mayor, es G9 sin su fundamental. vii°7 (tonalidades menores) es disminuido, construido sobre el 7.º grado elevado; sus cuatro notas dividen la octava en 3.as menores. Ambos resuelven como V7: la sensible asciende a la tónica y la 7.ª del acorde desciende por grado conjunto.',
      choiceSets: [
        [
          'viiø7 en C mayor (B–D–F–A) es G9 sin su fundamental',
          'viiø7 en C mayor (B–D–F–A) es G7 con una 6.ª añadida',
          'viiø7 en C mayor (B–D–F–A) es un acorde de séptima menor sobre B',
          'viiø7 en C mayor (B–D–F–A) es la séptima de tónica, Imaj7',
        ],
        [
          'vii°7 en A menor es G#–B–D–F, sobre el 7.º grado elevado',
          'vii°7 en A menor es G–B–D–F, construido sobre el 7.º grado natural',
          'vii°7 en A menor es G#–B–D–F#, un acorde semidisminuido',
          'vii°7 en A menor es B–D–F–A, construido sobre el 2.º grado',
        ],
        [
      "viiø7 tiene una 7.ª menor; vii°7 tiene una 7.ª disminuida",
      "viiø7 tiene una 7.ª disminuida; vii°7 tiene una 7.ª menor",
      'viiø7 tiene una 7.ª menor; vii°7 tiene una 7.ª menor',
      'viiø7 tiene una 7.ª disminuida; vii°7 tiene una 7.ª disminuida',
    ],
        [
      'Colecciones distintas de alturas entre Bdim7, Ddim7, Fdim7 y G#dim7: 1',
      'Colecciones distintas de alturas entre Bdim7, Ddim7, Fdim7 y G#dim7: 4',
      'Colecciones distintas de alturas entre Bdim7, Ddim7, Fdim7 y G#dim7: 2',
      'Colecciones distintas de alturas entre Bdim7, Ddim7, Fdim7 y G#dim7: 3',
    ],
        [
      'La sensible asciende a la tónica mientras la séptima del acorde desciende, como en un acorde de séptima de dominante',
      'La sensible desciende alejándose de la tónica mientras la séptima del acorde desciende, como en un acorde de séptima de dominante',
      'La sensible asciende a la tónica mientras la séptima del acorde asciende, como en un acorde de séptima de dominante',
      'La sensible desciende alejándose de la tónica mientras la séptima del acorde asciende, como en un acorde de séptima de dominante',
    ],
      ],
    },
  ],

  // ---- l4u13m4: Función Armónica ----
  l4u13m4: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre la función armónica es verdadera?',
      hintTemplate:
        'Función tónica: I, vi, iii. Predominante: IV, ii. Dominante: V, vii°. Estas categorías describen cómo funcionan los acordes en las progresiones, no solo su cualidad.',
      choiceSets: [
        [
          'vi puede sustituir a I porque comparte dos de sus notas',
          "vi puede sustituir a V7 porque contiene la misma sensible",
          "vi puede sustituir a I porque no comparte ninguna nota del acorde de tónica",
          "vi puede sustituir a IV porque contiene exactamente las mismas tres notas del acorde",
        ],
        [
          'vii° funciona como dominante: sus tres notas están todas en V7',
          'vii° funciona como dominante: sus tres notas están todas en IV',
          'vii° funciona como tónica: sus tres notas están todas en V7',
          'vii° funciona como tónica: sus tres notas están todas en IV',
        ],
        [
          'iii puede sustituir débilmente a I porque comparte dos notas del acorde',
          'iii puede sustituir débilmente a I porque su fundamental es la tónica',
          'iii puede sustituir a IV porque comparte las tres notas del acorde',
          'iii puede sustituir a V7 porque comparte las cuatro notas del acorde',
        ],
        [
          'En la cadencia rota V–vi, vi ocupa el lugar del I como tónica',
          'En V–vi, vi actúa como dominante y tira de vuelta hacia V',
          'V–vi no es una cadencia real',
          'En V–vi, vi es un acorde predominante camino de IV',
        ],
        [
          'D → PD (por ejemplo V–IV) es una retrogresión: invierte el flujo habitual',
          'D → PD (por ejemplo V–IV) es una cadencia plagal: es la forma habitual de cerrar una frase',
          'D → PD (por ejemplo V–IV) es una cadencia rota: IV actúa como sustituto habitual de la tónica',
          'D → PD (por ejemplo V–IV) está prohibida en la armonía de práctica común',
        ],
      ],
    },
  ],

  // ---- l4u13m5: Secuencias Armónicas ----
  l4u13m5: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre las secuencias armónicas es verdadera?',
      hintTemplate:
        'Una secuencia repite un patrón melódico/armónico en niveles de altura sucesivamente más altos o más bajos. Tipos comunes: quintas descendentes, 5-6 ascendente, terceras descendentes.',
      choiceSets: [
        [
      "Una secuencia de quintas descendentes: I–IV–vii°–iii–vi–ii–V–I",
      "Una secuencia de quintas descendentes: I–V–ii–vi–iii–vii°–IV–I",
      "Una secuencia de quintas descendentes: I–ii–iii–IV–V–vi–vii°–I",
      "Una secuencia de quintas descendentes: I–vi–IV–ii–vii°–V–iii–I",
    ],
        [
          'Una secuencia 5-6 ascendente alterna acordes 5/3 y 6/3 sobre un bajo que sube por grado',
          'Una secuencia 5-6 ascendente alterna acordes 5/3 y 6/4 sobre un bajo que sube por grado',
          'Una secuencia 5-6 ascendente alterna acordes 5/3 y 6/3 sobre un bajo que sube por terceras',
          'Una secuencia 5-6 ascendente alterna acordes 5/3 y 6/4 sobre un bajo que sube por terceras',
        ],
        [
          'Una secuencia vuelve a presentar su patrón armónico en distintos niveles de altura; el patrón tiene prioridad sobre el orden funcional normal',
          'Una secuencia vuelve a presentar su patrón armónico en distintos niveles de altura; el orden funcional normal tiene prioridad sobre el patrón',
          'Una secuencia repite su patrón armónico en un único nivel de altura sin cambios; el patrón tiene prioridad sobre el orden funcional normal',
          'Una secuencia repite su patrón armónico en un único nivel de altura sin cambios; el orden funcional normal tiene prioridad sobre el patrón',
        ],
        [
          'Una secuencia de terceras descendentes: I–vi–IV–ii, con cada fundamental bajando una 3.ª',
          'Una secuencia de terceras descendentes: I–V–vi–IV, con cada fundamental bajando una 3.ª',
          'Una secuencia de terceras descendentes: I–ii–iii–IV, con cada fundamental bajando una 3.ª',
          'Una secuencia de terceras descendentes: I–iii–V–vii°, con cada fundamental bajando una 3.ª',
        ],
        [
          'vi–ii–V–I es un fragmento de la secuencia de quintas descendentes',
          'vi–ii–V–I es un fragmento de la secuencia de segundas ascendentes',
          'vi–ii–V–I es una secuencia de terceras descendentes',
          'vi–ii–V–I no forma parte de ninguna secuencia, porque termina en la tónica',
        ],
      ],
    },
  ],

  // =========================================================================
  // Unidad 14: Contrapunto, Métrica, Análisis y Armonía Menor
  // =========================================================================

  // ---- l4u14m1: Contrapunto de Primera y Segunda Especie ----
  l4u14m1: [
    {
      // multiple_choice — primera especie
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el contrapunto de primera especie es verdadera?',
      hintTemplate:
        'Primera especie: nota contra nota. Usa consonancias (3.as, 6.as, intervalos justos). Comienza y termina en consonancias perfectas. Evita 5.as/8.as paralelas. Prefiere movimiento contrario.',
      choiceSets: [
        [
      "Primera especie: una nota del contrapunto contra cada nota del cantus firmus",
      'Primera especie: dos notas del contrapunto contra cada nota del cantus firmus',
      'Primera especie: cuatro notas del contrapunto contra cada nota del cantus firmus',
      'Primera especie: tres notas del contrapunto contra cada nota del cantus firmus',
    ],
        [
          'La primera especie permite consonancias perfectas e imperfectas; nunca permite disonancias',
          'La primera especie permite consonancias perfectas pero excluye las imperfectas; nunca permite disonancias',
          'La primera especie permite consonancias perfectas e imperfectas; también permite disonancias',
          'La primera especie permite consonancias perfectas pero excluye las imperfectas; también permite disonancias',
        ],
        [
          'A una consonancia perfecta se llega mejor por movimiento contrario',
          'A una consonancia perfecta se llega mejor por movimiento paralelo',
          'A una consonancia perfecta se llega igual de bien por cualquier tipo de movimiento',
          'A una consonancia perfecta solo se puede llegar por movimiento oblicuo, nunca por grado',
        ],
      ],
    },
    {
      // multiple_choice — segunda especie
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre el contrapunto de segunda especie es verdadera?',
      hintTemplate:
        'Segunda especie: dos notas contra una. La primera nota de cada compás debe ser consonante. La segunda nota puede ser una consonancia o una nota de paso (disonancia).',
      choiceSets: [
        [
          'En la segunda especie, las disonancias de paso solo pueden caer en los tiempos débiles',
          'En la segunda especie, todas las notas deben ser consonantes, como en la primera especie',
          'En la segunda especie, las disonancias pueden caer en los tiempos fuertes',
          'En la segunda especie, no hay reglas sobre la disonancia',
        ],
        [
      "La segunda especie permite un enlace disonante por grado conjunto entre consonancias acentuadas",
      'La segunda especie permite un enlace disonante abordado por salto entre consonancias acentuadas',
      'La segunda especie permite un enlace consonante por grado conjunto entre disonancias acentuadas',
      'La segunda especie permite un enlace consonante abordado por salto entre disonancias acentuadas',
    ],
      ],
    },
    {
      // interval_id
      promptTemplate:
        '¿Cuál es el intervalo formado entre las dos voces? Partiendo de {root}.',
      hintTemplate:
        'En el contrapunto de especies, las consonancias son 3.as, 6.as e intervalos justos (1J, 5J, 8J). Las disonancias (2.as, 7.as, tritono) requieren tratamiento especial.',
    },
  ],
};

export default overlay;
