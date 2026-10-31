import type { TemplateLevelOverlay } from '../types';

// ---------------------------------------------------------------------------
// Spanish (ES) overlay for Level 4 exercise templates
// 11 module configs (Unit 14 counterpoint pooled onto l4u14m1, mirroring
// the EN source). Entry order per module must match templatesL4.ts — see the
// W4-01 note there. Terms follow the L4 lessons: retardo (suspension),
// anticipación ascendente (retardation), apoyatura, escapatoria, nota pedal,
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
        'Retardos: 4-3 resuelve a una 3.ª, 7-6 a una 6.ª, 9-8 a una octava. El retardo de bajo 2-3 resuelve hacia abajo (el bajo desciende por grado conjunto; el intervalo sobre el bajo crece de una 2.ª a una 3.ª). Las cadenas de retardos crean secuencias.',
      choiceSets: [
        [
          'En un retardo 4-3, la 4.ª sobre el bajo resuelve bajando a la 3.ª',
          'En un retardo 4-3, la 3.ª sobre el bajo sube a la 4.ª',
          'En un retardo 4-3, la 4.ª sobre el bajo resuelve subiendo a la 5.ª',
          'En un retardo 4-3, el bajo baja del 4.º al 3.er grado',
        ],
        [
          'En un retardo 7-6, la 7.ª sobre el bajo resuelve bajando a la 6.ª',
          'En un retardo 7-6, la 7.ª sobre el bajo resuelve subiendo a la octava',
          'En un retardo 7-6, es el bajo el que mantiene la disonancia mientras la voz superior se mueve',
          'En un retardo 7-6, la disonancia nunca llega a resolver',
        ],
        [
          'En un retardo 9-8, la 9.ª sobre el bajo resuelve bajando a la octava',
          'En un retardo 9-8, la 9.ª sobre el bajo resuelve subiendo por grado a la 10.ª',
          'Un retardo 9-8 es simplemente un retardo 2-1 en la voz del bajo',
          'En un retardo 9-8, la octava sobre el bajo sube a la 9.ª',
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
          'Las cadenas de retardos no están permitidas en el estilo de la práctica común',
          'Una cadena de retardos 7-6 mantiene el bajo en una sola nota',
        ],
        [
          'Un retardo ornamentado añade una nota entre el retardo y su resolución',
          'Un retardo ornamentado se salta la resolución por completo',
          'Un retardo ornamentado debe usar siempre notas cromáticas',
          'Un retardo ornamentado resuelve subiendo por grado en lugar de bajar a la nota inferior',
        ],
      ],
    },
  ],

  // ---- l4u12m2: Apoyatura, Escapatoria y Anticipación Ascendente ----
  l4u12m2: [
    {
      // multiple_choice
      promptTemplate:
        '¿Cuál de estas afirmaciones sobre apoyaturas, escapatorias y anticipaciones ascendentes es verdadera?',
      hintTemplate:
        'Apoyatura: salto hacia la disonancia, grado conjunto hacia la resolución — normalmente acentuada (en un tiempo fuerte). Escapatoria: grado conjunto hacia la disonancia, salto hacia fuera — normalmente no acentuada (en un tiempo débil). Anticipación ascendente: retenida como un retardo, resuelve subiendo por grado (7-8).',
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
          'Una anticipación ascendente se mantiene como un retardo, pero resuelve subiendo por grado',
          'Una anticipación ascendente se mantiene como un retardo y resuelve siempre bajando por grado',
          'Una anticipación ascendente se aborda por salto y no tiene preparación',
          'Una anticipación ascendente resuelve por salto, nunca por grado',
        ],
        [
          'B retenido en un acorde de C mayor y que sube a C: una anticipación ascendente 7-8',
          'B retenido en un acorde de C mayor y que sube a C: un retardo 4-3',
          'B retenido en un acorde de C mayor y que sube a C: una escapatoria',
          'B retenido en un acorde de C mayor y que sube a C: una apoyatura abordada por salto',
        ],
        [
          'Las apoyaturas acentuadas y sin preparación son una seña de la expresión romántica',
          'Las apoyaturas están prohibidas en la música romántica',
          'Las apoyaturas deben prepararse siempre, exactamente como los retardos',
          'Las apoyaturas solo aparecen en la voz del bajo, nunca en la melodía que va por encima',
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
        'Los pedales son notas sostenidas o repetidas (típicamente tónica o dominante en el bajo) que crean disonancias con las armonías cambiantes por encima. Las notas cambiadas adornan una nota por encima y por debajo antes de volver a ella.',
      choiceSets: [
        [
          'Un pedal de tónica sostiene la tónica mientras las armonías cambian por encima',
          'Un pedal de tónica sostiene la tónica, pero solo en la voz del soprano',
          'Un pedal de tónica debe terminar al cabo de un compás para que la armonía pueda cambiar',
          'Un pedal de tónica es un patrón melódico repetido, lo mismo que un ostinato en el bajo',
        ],
        [
          'Un pedal de dominante mantiene el 5.º grado y crea tensión antes de que vuelva la tónica',
          'Un pedal de dominante mantiene la sensible, el 7.º grado',
          'Un pedal de dominante está siempre en el soprano, con el bajo libre por debajo',
          'Un pedal de dominante mantiene el 5.º grado y solo puede aparecer al principio mismo de una pieza',
        ],
        [
          'Un pedal doble sostiene la tónica y la dominante a la vez',
          'Un pedal doble usa dos tonalidades diferentes',
          'Un pedal doble debe resolver siempre a una sola nota',
          'Un pedal doble es un pedal que se repite dos veces seguidas',
        ],
        [
          'Un pedal invertido se mantiene en una voz superior en lugar del bajo',
          'Un pedal invertido desciende grado a grado en lugar de mantenerse',
          'Un pedal invertido cambia de altura en cada compás',
          'Los pedales invertidos nunca aparecen en la música clásica',
        ],
        [
          'Un pedal suele empezar y terminar consonante, con disonancias en medio',
          'Un pedal es disonante con todos los acordes, de principio a fin',
          'Un pedal nunca crea disonancia con las armonías de encima',
          'Un pedal debe durar exactamente cuatro compases y empezar y terminar en un tiempo fuerte',
        ],
        [
          'Las notas cambiadas adornan una nota por encima y por debajo y vuelven a ella',
          'Las notas cambiadas son dos notas de paso seguidas que rellenan una 4.ª',
          'Las notas cambiadas significan que dos voces tienen bordaduras a la vez',
          'Las notas cambiadas son lo mismo que un trino, alternando rápido entre dos notas',
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
          'Su tritono resuelve en movimiento paralelo: las dos notas suben por grado',
          'Su tritono no resuelve: las dos notas se mantienen en el acorde de I',
          'Su tritono resuelve hacia fuera: la 3.ª baja y la 7.ª sube a la fundamental de I',
        ],
        [
          'En V7–I, el acorde de I omite a menudo su 5.ª para que las voces resuelvan bien',
          'En V7–I, el acorde de I debe estar siempre completo, con sus tres notas',
          'V7–I produce siempre 5.as paralelas, que aquí están permitidas',
          'En V7–I, la fundamental de V7 debe subir siempre por grado para convertirse en la 3.ª del acorde de I',
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
          'V4/3 tiene la 5.ª en el bajo y puede resolver a I o I6',
          'V4/3 tiene la sensible en el bajo y solo puede resolver a IV',
          'V4/3 tiene la 7.ª en el bajo y debe resolver a I6/4',
          'V4/3 tiene la fundamental en el bajo y resuelve a vi',
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
          'La progresión estándar es T -> PD -> D -> T',
          'Los predominantes vienen siempre después de la dominante',
          'Los predominantes resuelven directamente a la tónica',
          'Solo los acordes mayores pueden funcionar como predominantes',
        ],
        [
          'IV y ii (y IV7, ii7) son los principales acordes predominantes',
          'V y vii° son los principales acordes predominantes',
          'iii es el principal acorde predominante, por estar un grado por debajo de IV',
          'vi es el único acorde que puede funcionar como predominante',
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
        'vi7 (y a veces iii7) comparten notas con el I y pueden sustituirlo. Imaj7 es la tónica del jazz y del pop; I7 es la tónica del blues. iii7–vi7–ii7–V7–I es una cadena de quintas descendentes.',
      choiceSets: [
        [
          'vi7 es el principal sustituto del I con función de tónica',
          'vi7 es un acorde con función de dominante que resuelve a I',
          'vi7 es un acorde predominante que solo aparece antes del V',
          'vi7 no tiene una función armónica propia',
        ],
        [
          'V7–vi7 es una resolución rota más suave que V7–vi',
          'V7–vi7 es una cadencia auténtica perfecta disfrazada',
          'V7–vi7 es imposible, porque vi7 no comparte notas con V7',
          'V7–vi7 es una semicadencia, porque termina en un acorde menor',
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
        'viiø7 (tonalidades mayores) es semidisminuido: en C mayor, es G9 sin su fundamental. vii°7 (tonalidades menores) es disminuido, construido sobre el 7.º grado elevado; sus cuatro notas dividen la octava en 3.as menores.',
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
          'viiø7 tiene una 7.ª menor; vii°7 tiene una 7.ª disminuida',
          'viiø7 tiene una 7.ª disminuida; vii°7 tiene una 7.ª menor',
          'viiø7 y vii°7 son el mismo acorde con dos nombres',
          'viiø7 tiene una 7.ª mayor; vii°7 tiene una 5.ª justa y una 7.ª menor',
        ],
        [
          'Bdim7, Ddim7, Fdim7 y G#dim7 contienen las mismas cuatro clases de altura',
          'Bdim7 y Ddim7 no comparten notas, porque sus fundamentales están a una 3.ª',
          'Cada acorde de séptima disminuida tiene su propio conjunto de notas, único',
          'Un acorde de séptima disminuida solo puede reescribirse sobre una de sus notas, la fundamental',
        ],
        [
          'Igual que V7, viiø7 resuelve a I: la sensible sube, la 7.ª baja',
          'Igual que IV, viiø7 es un acorde predominante que resuelve a V',
          'viiø7 resuelve a vi, con la sensible bajando al 6.º grado',
          'viiø7 no llega a resolver, porque es el acorde de séptima más estable de la tonalidad',
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
          'vi puede sustituir al I como acorde con función de tónica',
          'vi es un acorde con función de dominante que resuelve a I',
          'vi es un acorde predominante que va siempre a V',
          'vi no tiene una función armónica definida',
        ],
        [
          'vii° funciona como dominante: comparte tres notas con V7',
          'vii° funciona como tónica: comparte tres notas con I',
          'vii° funciona como predominante: va siempre a IV',
          'vii° no tiene función armónica',
        ],
        [
          'iii puede sustituir débilmente a la tónica: comparte dos notas con I',
          'iii es siempre un acorde de dominante, simplemente porque contiene la sensible',
          'iii es el principal acorde predominante de la tonalidad',
          'iii nunca aparece en la armonía de la práctica común',
        ],
        [
          'En la cadencia rota V–vi, vi ocupa el lugar del I como tónica',
          'En V–vi, vi actúa como dominante y tira de vuelta hacia V',
          'V–vi no es una cadencia real',
          'En V–vi, vi es un acorde predominante camino de IV',
        ],
        [
          'D → PD (por ejemplo V–IV) es una retrogresión: invierte el flujo habitual',
          'D → PD (por ejemplo V–IV) es el orden estándar de las funciones',
          'D → PD (por ejemplo V–IV) es imposible en cualquier estilo de música',
          'D → PD (por ejemplo V–IV) es la forma más fuerte de terminar una frase, más fuerte que V–I',
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
          'Una secuencia de quintas descendentes: I–IV–vii°–iii–vi–ii–V–I',
          'Una secuencia de quintas descendentes: I–V–ii–vi–iii–vii°–IV–I',
          'Una secuencia de quintas descendentes: I–ii–iii–IV–V–vi–vii°–I',
          'Una secuencia de quintas descendentes usa solo acordes mayores, así que debe salir de la tonalidad',
        ],
        [
          'Una secuencia 5-6 ascendente alterna acordes 5/3 y 6/3 sobre un bajo que sube',
          'Una secuencia 5-6 ascendente usa solo tríadas en estado fundamental sobre un bajo que baja',
          'Una secuencia 5-6 ascendente hace bajar el bajo por grado',
          'La secuencia 5-6 no es un tipo real de secuencia',
        ],
        [
          'Una secuencia se impone al orden funcional normal: la conduce el patrón repetido',
          'Una secuencia debe seguir el orden T–PD–D–T en todos los acordes',
          'Una secuencia repite un acorde varias veces a la misma altura',
          'Una secuencia es una serie de modulaciones',
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
          'Primera especie: una nota del contrapunto contra cada nota del cantus firmus',
          'Primera especie: dos notas del contrapunto contra cada nota del cantus firmus',
          'Primera especie: cuatro notas del contrapunto contra cada nota del cantus firmus',
          'Primera especie: cualquier ritmo contra el cantus firmus',
        ],
        [
          'En la primera especie, todos los intervalos verticales deben ser consonancias',
          'En la primera especie, las disonancias se permiten en cualquier tiempo',
          'En la primera especie, solo se permiten intervalos justos',
          'En la primera especie, solo se permiten 3.as y 6.as',
        ],
        [
          'A una consonancia perfecta se llega mejor por movimiento contrario',
          'A una consonancia perfecta se llega mejor por movimiento paralelo',
          'La forma de llegar a una consonancia perfecta no tiene importancia',
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
          'En la segunda especie, las disonancias de paso pueden caer en los tiempos débiles',
          'En la segunda especie, todas las notas deben ser consonantes, como en la primera especie',
          'En la segunda especie, las disonancias pueden caer en los tiempos fuertes',
          'En la segunda especie, no hay reglas sobre la disonancia',
        ],
        [
          'La segunda especie introduce la disonancia, como notas de paso en los tiempos débiles',
          'La segunda especie introduce el retardo, ligado sobre la barra de compás',
          'La segunda especie introduce la apoyatura, abordada por salto',
          'La segunda especie no aporta nada nuevo: sigue exactamente las mismas reglas que la primera',
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
